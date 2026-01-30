import { firestore } from './_firebase.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    // For demo purposes, just return success
    // In production, integrate with email service to send reset link
    
    let userExists = false;
    
    if (firestore) {
      const usersRef = firestore.collection('users');
      const snapshot = await usersRef.where('email', '==', email).limit(1).get();
      userExists = !snapshot.empty;
    } else {
      // For local demo, assume user exists
      userExists = true;
    }

    if (userExists) {
      // In production, send actual reset email here
      console.log(`Password reset requested for: ${email}`);
      return res.json({ 
        ok: true, 
        message: 'Password reset link sent to your email' 
      });
    } else {
      // Don't reveal if email exists or not for security
      return res.json({ 
        ok: true, 
        message: 'If an account exists, a reset link will be sent' 
      });
    }
    
  } catch (err: any) {
    console.error('auth-forgot-password error', err);
    return res.status(500).json({ error: err.message || 'Request failed' });
  }
}
