const admin = require('firebase-admin');

let firestore = null;

try {
  if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKeyBase64 = process.env.FIREBASE_PRIVATE_KEY_BASE64;

    if (projectId && clientEmail && privateKeyBase64) {
      const privateKey = Buffer.from(privateKeyBase64, 'base64').toString('utf8');
      admin.initializeApp({
        credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || undefined
      });
      firestore = admin.firestore();
      console.log('Firebase admin initialized (JS shim)');
    } else {
      console.warn('Firebase envs not fully configured. Firestore disabled.');
    }
  } else {
    firestore = admin.firestore();
  }
} catch (err) {
  console.error('firebase init error', err);
}

module.exports = { firestore };
