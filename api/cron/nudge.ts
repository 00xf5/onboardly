import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Resend } from 'resend';

// Initialize Firebase with Node-compatible config
const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: any, res: any) {
    // Simple security check for Vercel Cron
    // if (process.env.CRON_SECRET && req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return res.status(401).json({ error: 'Unauthorized' });
    // }

    try {
        const clientsRef = collection(db, "clients");
        // We want clients who aren't finished
        const q = query(clientsRef, where("progress", "<", 100));
        const snap = await getDocs(q);

        const now = new Date();
        const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

        const results = [];

        for (const clientDoc of snap.docs) {
            const client = clientDoc.data();
            const lastAction = client.lastActionAt ? new Date(client.lastActionAt) : new Date(client.createdAt);
            const lastNudge = client.lastNudgeAt ? new Date(client.lastNudgeAt) : null;

            // Condition: 
            // 1. Last action was > 48 hours ago
            // 2. We haven't nudged them in the last 48 hours either
            const isIdle = lastAction < fortyEightHoursAgo;
            const notRecentlyNudged = !lastNudge || lastNudge < fortyEightHoursAgo;

            if (isIdle && notRecentlyNudged) {
                // Trigger Nudge Email
                try {
                    await resend.emails.send({
                        from: 'Onboardly Nexus <nudge@resend.dev>',
                        to: client.email,
                        subject: 'Action Required: Your Onboarding Sequence is Stalled',
                        html: `
                            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px; background-color: #0b0c10; color: white;">
                                <h1 style="color: #f97316; text-transform: uppercase; font-style: italic;">Operational Stagnation Detected</h1>
                                <p style="color: #ccc;">Hello <strong>${client.name}</strong>,</p>
                                <p style="color: #ccc;">The Nexus has detected 48 hours of inactivity on your onboarding sequence for <strong>${client.company}</strong>.</p>
                                
                                <div style="background: rgba(249, 115, 22, 0.1); padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid rgba(249, 115, 22, 0.2);">
                                    <p style="margin: 0; color: #f97316; font-weight: bold; font-size: 14px; text-transform: uppercase;">Current Progress: ${Math.round(client.progress)}%</p>
                                    <p style="margin: 10px 0 0; color: #fff; font-size: 13px;">Your activation is required to move into the next operational phase.</p>
                                </div>

                                <a href="${process.env.APP_URL || 'https://onboardly-nexus.vercel.app'}/onboard/${client.slug}" 
                                   style="display: inline-block; background: #f97316; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; text-transform: uppercase; font-size: 12px;">
                                   Resume Sequence →
                                </a>

                                <p style="margin-top: 30px; font-size: 11px; color: #444; border-top: 1px solid #1a1b23; pt: 20px;">
                                    This is an automated signal from the Onboardly Ghost Nudge Subsystem.
                                </p>
                            </div>
                        `
                    });

                    // Update client record
                    await updateDoc(doc(db, "clients", clientDoc.id), {
                        lastNudgeAt: new Date().toISOString()
                    });

                    results.push({ name: client.name, status: 'nudged' });
                } catch (emailErr) {
                    console.error(`Failed to nudge ${client.name}:`, emailErr);
                    results.push({ name: client.name, status: 'failed', error: emailErr });
                }
            }
        }

        return res.status(200).json({ success: true, processed: snap.docs.length, results });
    } catch (error: any) {
        console.error('Cron Nudge Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
