import { firestore } from './_firebase.js';
import { sendReminderEmail } from './_mail.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    if (!firestore) return res.status(500).json({ error: 'Firestore not initialized' });
    // Find clients with incomplete tasks or tasks past due
    const clientsSnap = await firestore.collection('clients').get();
    const sent: any[] = [];
    for (const doc of clientsSnap.docs) {
      const client = doc.data();
      if (!client.email) continue;
      const clientTasks = client.tasks || [];
      for (const task of clientTasks) {
        // send reminder if not completed and either no deadline or deadline in future? simple: send if not completed
        if (!task.completed) {
          await sendReminderEmail(client, task);
          sent.push({ client: client.id || client.email, task: task.id });
        }
      }
    }

    return res.json({ ok: true, sentCount: sent.length, sent });
  } catch (err: any) {
    console.error('send-reminders error', err);
    return res.status(500).json({ error: err.message || String(err) });
  }
}