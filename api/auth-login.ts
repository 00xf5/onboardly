import { firestore } from './_firebase.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Basic validation
    if (!email.includes('@') || email.length < 5) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // For demo purposes, accept demo credentials
    const demoEmails = [
      'demo@onboardly.app',
      'admin@onboardly.app',
      'test@onboardly.app',
      'user@example.com'
    ];
    
    const demoPassword = 'demo123';
    
    // Check if it's a demo account
    if (demoEmails.includes(email) && password === demoPassword) {
      let user = null;
      
      if (firestore) {
        // Check if user exists in Firestore
        const usersRef = firestore.collection('users');
        const snapshot = await usersRef.where('email', '==', email).limit(1).get();
        
        if (!snapshot.empty) {
          user = snapshot.docs[0].data();
          user.id = snapshot.docs[0].id;
        } else {
          // Create demo user
          const newUser = {
            email,
            name: email.split('@')[0],
            createdAt: new Date().toISOString(),
            plan: 'pro',
            isDemo: true
          };
          const docRef = await usersRef.add(newUser);
          user = { ...newUser, id: docRef.id };
        }
      } else {
        // Fallback for local development
        user = {
          id: `demo_${Date.now()}`,
          email,
          name: email.split('@')[0],
          plan: 'pro',
          isDemo: true,
          createdAt: new Date().toISOString()
        };
      }

      return res.json({ 
        ok: true, 
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          plan: user.plan || 'free',
          isDemo: user.isDemo || false
        }
      });
    }

    // For non-demo accounts, we'd normally check against a database
    // For now, we'll create a simple validation
    if (email && password && password.length >= 6) {
      // Create a simple user for demo purposes
      let user = null;
      
      if (firestore) {
        const usersRef = firestore.collection('users');
        const snapshot = await usersRef.where('email', '==', email).limit(1).get();
        
        if (!snapshot.empty) {
          user = snapshot.docs[0].data();
          user.id = snapshot.docs[0].id;
        } else {
          // Create new user
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
    }

    return res.status(401).json({ error: 'Invalid email or password' });
    
  } catch (err: any) {
    console.error('auth-login error', err);
    return res.status(500).json({ error: err.message || 'Login failed' });
  }
}
