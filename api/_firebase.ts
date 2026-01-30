import admin from 'firebase-admin';

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyBase64 = process.env.FIREBASE_PRIVATE_KEY_BASE64 || process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKeyBase64) {
    console.warn('Firebase credentials are not fully configured in env vars.');
  } else {
    const privateKey = privateKeyBase64.includes('-----BEGIN')
      ? privateKeyBase64
      : Buffer.from(privateKeyBase64, 'base64').toString('utf8');

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  }
}

export const firestore = admin.firestore();
export const storage = admin.storage ? admin.storage() : undefined;
export default admin;