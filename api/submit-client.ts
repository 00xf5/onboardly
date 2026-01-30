import { firestore } from './_firebase.js';
import { sendWelcomeEmail } from './_mail.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { name, email, company, templateId, tasks } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Missing name/email' });

    const createdAt = new Date().toISOString();

    // if Firestore is not configured, fall back to a local id and do not attempt writes
    const clientId = firestore ? firestore.collection('clients').doc().id : `local-${Date.now()}`;
    const client = {
      id: clientId,
      name,
      email,
      company: company || '',
      templateId: templateId || null,
      tasks: tasks || [],
      progress: 0,
      status: 'pending',
      createdAt
    };

    if (firestore) {
      await firestore.collection('clients').doc(client.id).set(client);
    }

    // send welcome email (stub records 'skipped' when no send service configured)
    const mailResult = await sendWelcomeEmail(client);

    return res.json({ ok: true, client, mailResult });
  } catch (err: any) {
    console.error('submit-client error', err);
    return res.status(500).json({ error: err.message || String(err) });
  }
}