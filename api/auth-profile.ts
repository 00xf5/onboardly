import { firestore } from './_firebase.js';

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    // Get user profile
    try {
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ error: 'User ID required' });
      }

      let user = null;
      
      if (firestore) {
        const userDoc = await firestore.collection('users').doc(userId).get();
        if (userDoc.exists) {
          user = userDoc.data();
          user.id = userDoc.id;
        }
      } else {
        // Fallback for local development
        user = {
          id: userId,
          email: 'demo@example.com',
          name: 'Demo User',
          plan: 'free',
          createdAt: new Date().toISOString()
        };
      }

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.json({ ok: true, user });
      
    } catch (err: any) {
      console.error('auth-profile GET error', err);
      return res.status(500).json({ error: err.message || 'Failed to get profile' });
    }
  } else if (req.method === 'PUT') {
    // Update user profile
    try {
      const { userId, name, email } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: 'User ID required' });
      }

      const updateData: any = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      updateData.updatedAt = new Date().toISOString();

      let user = null;
      
      if (firestore) {
        await firestore.collection('users').doc(userId).update(updateData);
        const userDoc = await firestore.collection('users').doc(userId).get();
        user = userDoc.data();
        user.id = userDoc.id;
      } else {
        // Fallback for local development - just return success
        user = {
          id: userId,
          email: email || 'demo@example.com',
          name: name || 'Demo User',
          plan: 'free',
          ...updateData
        };
      }

      return res.json({ ok: true, user });
      
    } catch (err: any) {
      console.error('auth-profile PUT error', err);
      return res.status(500).json({ error: err.message || 'Failed to update profile' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
