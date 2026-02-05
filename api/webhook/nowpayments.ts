import crypto from 'crypto';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin once
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                // Handle escaped newlines in the private key
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            } as any),
        });
        console.log('Firebase Admin Initialized');
    } catch (error) {
        console.error('Firebase Admin Initialization Error:', error);
    }
}

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const signature = req.headers['x-nowpayments-sig'];
    const IPN_SECRET = process.env.NOWPAYMENTS_IPN_SECRET;

    if (!signature || !IPN_SECRET) {
        console.error('Missing signature or IPN secret');
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const data = req.body;

    // 1. Verify Signature
    // NOWPayments sends the signature as HMAC-SHA512 of the JSON payload
    // with keys sorted alphabetically.
    const sortedPayload = JSON.stringify(data, Object.keys(data).sort());
    const hmac = crypto.createHmac('sha512', IPN_SECRET);
    hmac.update(sortedPayload);
    const expectedSignature = hmac.digest('hex');

    console.log(`[IPN] Received payment ${data.payment_id} (${data.payment_status}) for Order: ${data.order_id}`);

    if (signature !== expectedSignature) {
        console.error('[IPN] Signature Mismatch! Rejecting.');
        return res.status(400).json({ error: 'Invalid signature' });
    }

    try {
        const { payment_status, order_id } = data;

        // 2. Process Success
        if (payment_status === 'finished' || payment_status === 'confirmed') {
            console.log(`[IPN] Authorized: Upgrading User ${order_id} to PRO`);

            const db = admin.firestore();
            const userRef = db.collection('users').doc(order_id);

            await userRef.update({
                plan: 'pro',
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                lastPaymentId: data.payment_id
            });

            console.log(`[IPN] Success: User ${order_id} is now PRO.`);

            return res.status(200).json({
                success: true,
                message: `User ${order_id} upgraded to PRO`
            });
        }

        return res.status(200).json({ success: true, status: payment_status });
    } catch (error: any) {
        console.error('[IPN] Processing Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
