/* eslint-disable prettier/prettier */
import * as admin from 'firebase-admin';
import { cert } from 'firebase-admin/app';

import * as serviceAccount from '../firebase-service-account.json'; // adjust path if needed

admin.initializeApp({
  credential: cert(serviceAccount as admin.ServiceAccount),
});

const db = admin.firestore();

export { db, admin };
