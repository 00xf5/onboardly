import { firestore } from './_firebase.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    let user = null;
    
    if (firestore) {
      // Check if user already exists
      const usersRef = firestore.collection('users');
      const snapshot = await usersRef.where('email', '==', email).limit(1).get();
      
      if (!snapshot.empty) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Create new user
      const newUser = {
        name,
        email,
        createdAt: new Date().toISOString(),
        plan: 'free'
      };
      
      const docRef = await usersRef.add(newUser);
      user = { ...newUser, id: docRef.id };
    } else {
      // Fallback for local development
      user = {
        id: `local_${Date.now()}`,
        name,
        email,
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
        plan: user.plan
      }
    });
    
  } catch (err: any) {
    console.error('auth-signup error', err);
    return res.status(500).json({ error: err.message || 'Signup failed' });
  }
}
