const { firestore } = require('./_firebase');
const { sendReminderEmail } = require('./_mail');

module.exports = async function (req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    if (!firestore) return res.status(500).json({ error: 'Firestore not initialized' });

    // naive scan: clients with tasks that have 'completed' !== true
    const snaps = await firestore.collection('clients').get();
    const reminders = [];
    for (const doc of snaps.docs) {
      const client = doc.data();
      const tasks = client.tasks || [];
      for (const task of tasks) {
        if (!task.completed) {
          const result = await sendReminderEmail(client, task);
          reminders.push({ client: client.id || client.email, taskId: task.id, result });
        }
      }
    }

    return res.json({ ok: true, remindersSent: reminders.length, reminders });
  } catch (err) {
    console.error('send-reminders error', err);
    return res.status(500).json({ error: String(err) });
  }
};
