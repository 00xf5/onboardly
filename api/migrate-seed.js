const { firestore } = require('./_firebase');

const templatesSeed = [
  { id: 1, title: 'Enterprise Nexus', description: 'High-compliance protocol for global institutions.', tasks: [{ id: 1, title: 'Sign Master Service Agreement' }, { id: 2, title: 'Submit Brand Identity Assets' }, { id: 3, title: 'Configure Domain Records' }] },
  { id: 2, title: 'Velocity Stream', description: 'Rapid onboarding for high-growth startups.', tasks: [{ id: 1, title: 'Intro Call' }, { id: 2, title: 'Share Brand Kit' }] },
  { id: 3, title: 'Standard Onboarding', description: 'Baseline verification sequence for standard partners.', tasks: [{ id: 1, title: 'Sign Contract' }, { id: 2, title: 'Provide Assets' }, { id: 3, title: 'Confirm Payment' }] }
];

const clientsSeed = [
  { id: 'seed-1', name: 'Sarah Johnson', email: 'sarah@company.com', template: 'Enterprise Nexus', progress: 75, status: 'in_progress' },
  { id: 'seed-2', name: 'Michael Chen', email: 'michael@startup.io', template: 'Velocity Stream', progress: 100, status: 'completed' }
];

module.exports = async function (req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    if (!firestore) return res.status(500).json({ error: 'Firestore not initialized' });

    for (const t of templatesSeed) {
      const ref = firestore.collection('templates').doc(String(t.id));
      const snap = await ref.get();
      if (!snap.exists) {
        await ref.set({ ...t, createdAt: new Date().toISOString() });
      }
    }

    for (const c of clientsSeed) {
      const ref = firestore.collection('clients').doc(String(c.id));
      const snap = await ref.get();
      if (!snap.exists) {
        await ref.set({ ...c, createdAt: new Date().toISOString() });
      }
    }

    return res.json({ ok: true, templatesSeeded: templatesSeed.length, clientsSeeded: clientsSeed.length });
  } catch (err) {
    console.error('migrate-seed error', err);
    return res.status(500).json({ error: String(err) });
  }
};
