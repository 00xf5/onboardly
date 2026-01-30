import admin from 'firebase-admin';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import path from 'path';

// Local fallback storage for development
const localDbPath = path.join(process.cwd(), 'local-db.json');

let localDb: any = {};
if (existsSync(localDbPath)) {
  try {
    localDb = JSON.parse(readFileSync(localDbPath, 'utf8'));
  } catch (err) {
    console.warn('Failed to read local db, starting fresh');
    localDb = {};
  }
}

const saveLocalDb = () => {
  try {
    writeFileSync(localDbPath, JSON.stringify(localDb, null, 2));
  } catch (err) {
    console.error('Failed to save local db:', err);
  }
};

// Debug environment variables
console.log('Environment check:', {
  projectId: process.env.FIREBASE_PROJECT_ID ? 'SET' : 'MISSING',
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL ? 'SET' : 'MISSING', 
  privateKey: process.env.FIREBASE_PRIVATE_KEY_BASE64 ? 'SET' : 'MISSING',
});

if (!admin.apps.length) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKeyBase64 = process.env.FIREBASE_PRIVATE_KEY_BASE64 || process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKeyBase64) {
      console.error('❌ Firebase credentials are missing. Check environment variables.');
      throw new Error('Missing Firebase credentials');
    }

    const privateKey = privateKeyBase64.includes('-----BEGIN')
      ? privateKeyBase64
      : Buffer.from(privateKeyBase64, 'base64').toString('utf8');

    console.log('🔥 Initializing Firebase with project:', projectId);

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
    
    console.log('✅ Firebase admin initialized successfully');
  } catch (err) {
    console.error('❌ Failed to initialize Firebase admin:', err);
    console.log('📁 Using local JSON fallback instead');
  }
}

// Create Firestore interface that works with both Firebase and local fallback
export const firestore = admin.apps.length ? admin.firestore() : {
  collection: (name: string) => ({
    where: (field: string, op: string, value: any) => ({
      limit: (limit: number) => ({
        get: async () => {
          console.log(`📄 Local query: ${name}.${field} == ${value}`);
          const items = (localDb[name] || []).filter((item: any) => 
            field in item && item[field] === value
          ).slice(0, limit);
          
          return {
            empty: items.length === 0,
            docs: items.map((item: any) => ({
              id: item.id,
              data: () => item
            }))
          };
        }
      }),
      add: async (data: any) => {
        console.log(`📝 Local add: ${name}`, data);
        if (!localDb[name]) localDb[name] = [];
        const id = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newItem = { ...data, id, createdAt: new Date().toISOString() };
        localDb[name].push(newItem);
        saveLocalDb();
        
        return {
          id: id
        };
      }
    }),
    add: async (data: any) => {
      console.log(`📝 Local add: ${name}`, data);
      if (!localDb[name]) localDb[name] = [];
      const id = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newItem = { ...data, id, createdAt: new Date().toISOString() };
      localDb[name].push(newItem);
      saveLocalDb();
      
      return {
        id: id
      };
    }
  })
};

export const storage = admin.apps.length && admin.storage ? admin.storage() : undefined;
export default admin;