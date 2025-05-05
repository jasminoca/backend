/* eslint-disable prettier/prettier */
import * as admin from 'firebase-admin';
import { cert } from 'firebase-admin/app';

// Parse from environment variable
const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
);

admin.initializeApp({
  credential: cert(serviceAccount as admin.ServiceAccount),
});

const db = admin.firestore();

export { db, admin };
