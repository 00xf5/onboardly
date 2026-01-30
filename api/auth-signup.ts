import { firestore } from './_firebase.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    // Basic validation
    if (name.length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters' });
    }

    if (!email.includes('@') || email.length < 5) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Check if user already exists
    let userExists = false;
    
    if (firestore) {
      const usersRef = firestore.collection('users');
      const snapshot = await usersRef.where('email', '==', email).limit(1).get();
      userExists = !snapshot.empty;
    } else {
      // For local demo, check against some demo data
      const demoEmails = ['demo@onboardly.app', 'admin@onboardly.app', 'test@onboardly.app'];
      userExists = demoEmails.includes(email);
    }

    if (userExists) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create new user
    let user = null;
    
    if (firestore) {
      const usersRef = firestore.collection('users');
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
