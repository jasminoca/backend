/* eslint-disable prettier/prettier */
import * as admin from 'firebase-admin';
import { cert } from 'firebase-admin/app';

import * as serviceAccount from '../math-75c23-firebase-adminsdk-fbsvc-b37ecf0812.json'; // adjust path if needed

admin.initializeApp({
  credential: cert(serviceAccount as admin.ServiceAccount),
});

const db = admin.firestore();

export { db, admin };
