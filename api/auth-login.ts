import { firestore } from './_firebase.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // For demo purposes, accept any email/password combo
    // In production, integrate with Firebase Auth or other auth provider
    
    let user = null;
    
    if (firestore) {
      // Check if user exists in Firestore
      const usersRef = firestore.collection('users');
      const snapshot = await usersRef.where('email', '==', email).limit(1).get();
      
      if (!snapshot.empty) {
        user = snapshot.docs[0].data();
        user.id = snapshot.docs[0].id;
      } else {
        // Create new user for demo
        const newUser = {
          email,
          name: email.split('@')[0],
          createdAt: new Date().toISOString(),
          plan: 'free'
        };
        const docRef = await usersRef.add(newUser);
        user = { ...newUser, id: docRef.id };
      }
    } else {
      // Fallback for local development
      user = {
        id: `local_${Date.now()}`,
        email,
        name: email.split('@')[0],
        plan: 'free',
        createdAt: new Date().toISOString()
      };
    }

    return res.json({ 
      ok: true, 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan || 'free'
      }
    });
    
  } catch (err: any) {
    console.error('auth-login error', err);
    return res.status(500).json({ error: err.message || 'Login failed' });
  }
}
