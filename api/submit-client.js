const { firestore } = require('./_firebase');
const { sendWelcomeEmail } = require('./_mail');

module.exports = async function (req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { name, email, company, templateId, tasks } = req.body || {};
    if (!name || !email) return res.status(400).json({ error: 'Missing name/email' });

    const createdAt = new Date().toISOString();
    const docRef = firestore ? firestore.collection('clients').doc() : { id: 'local-' + Date.now(), set: async () => {} };
    const client = {
      id: docRef.id || (docRef.id = 'local-' + Date.now()),
      name,
      email,
      company: company || '',
      templateId: templateId || null,
      tasks: tasks || [],
      progress: 0,
      status: 'pending',
      createdAt
    };

    if (firestore) await firestore.collection('clients').doc(client.id).set(client);

    const mailResult = await sendWelcomeEmail(client);

    return res.json({ ok: true, client, mailResult });
  } catch (err) {
    console.error('submit-client error', err);
    return res.status(500).json({ error: String(err) });
  }
};
