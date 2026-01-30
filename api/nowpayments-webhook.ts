import crypto from 'crypto';
import { firestore } from './_firebase';

function verifySignature(secret: string | undefined, body: string, headerSignature: string | undefined) {
  if (!secret) return true; // if not configured, skip verification (but warn in prod)
  if (!headerSignature) return false;
  const hmac = crypto.createHmac('sha512', secret);
  hmac.update(body);
  const digest = hmac.digest('hex');
  // NowPayments may use hex or base64 — we check for substring match
  return headerSignature.includes(digest) || digest.includes(headerSignature);
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const headerSig = (req.headers['x-nowpayments-signature'] as string) || (req.headers['x-nowpayments-hook-signature'] as string) || (req.headers['x-hub-signature'] as string);
    const secret = process.env.NOWPAYMENTS_WEBHOOK_SECRET;

    const ok = verifySignature(secret, rawBody, headerSig);
    if (!ok) {
      console.warn('NowPayments webhook signature verification failed');
      return res.status(401).json({ ok: false, error: 'Invalid signature' });
    }

    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    // Basic shape expected from NowPayments IPN
    // { id, price_amount, price_currency, status, order_id }
    const invoiceId = payload.id || (payload.payment && payload.payment.id);
    const status = payload.status;
    const order_id = payload.order_id || payload.ext_order_id || payload.orderId;

    console.log('NowPayments webhook', { invoiceId, status, order_id });

    if (!invoiceId) {
      return res.status(400).json({ ok: false, error: 'Missing invoice id' });
    }

    // update payment doc
    if (firestore) {
      const paymentRef = firestore.collection('payments').doc(String(invoiceId));
      const paymentDoc = await paymentRef.get();

      let paymentData: any = { status, updatedAt: new Date().toISOString(), raw: payload };

      if (paymentDoc.exists) {
        await paymentRef.update(paymentData);
      } else {
        await paymentRef.set({ invoiceId, status, raw: payload, createdAt: new Date().toISOString() });
      }

      // if status indicates success, mark client subscription premium
      if (['finished', 'confirmed', 'paid'].includes((status || '').toLowerCase())) {
        // order_id pattern clientId:timestamp
        const clientId = order_id && String(order_id).split(':')[0];
        if (clientId) {
          // mark subscription active for 30 days
          const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString();
          await firestore.collection('subscriptions').doc(String(clientId)).set({
            clientId,
            status: 'active',
            plan: 'premium',
            startsAt: new Date().toISOString(),
            expiresAt
          }, { merge: true });

          // also mark client document if exists
          const clientRef = firestore.collection('clients').doc(String(clientId));
          const clientSnap = await clientRef.get();
          if (clientSnap.exists) {
            await clientRef.update({ plan: 'premium', planStatus: 'active', planExpiresAt: expiresAt });
          }
        }
      }
    }

    return res.json({ ok: true });
  } catch (err: any) {
    console.error('webhook error', err);
    return res.status(500).json({ ok: false, error: err.message || String(err) });
  }
}