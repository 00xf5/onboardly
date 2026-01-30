import { firestore } from './_firebase';
import { sendWelcomeEmail } from './_mail';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { name, email, company, templateId, tasks } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Missing name/email' });

    const createdAt = new Date().toISOString();
    const docRef = firestore.collection('clients').doc();
    const client = {
      id: docRef.id,
      name,
      email,
      company: company || '',
      templateId: templateId || null,
      tasks: tasks || [],
      progress: 0,
      status: 'pending',
      createdAt
    };

    await docRef.set(client);

    // send welcome email
    const mailResult = await sendWelcomeEmail(client);

    return res.json({ ok: true, client, mailResult });
  } catch (err: any) {
    console.error('submit-client error', err);
    return res.status(500).json({ error: err.message || String(err) });
  }
}