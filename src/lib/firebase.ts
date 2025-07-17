
// src/lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// This check is crucial for Next.js to avoid initializing Firebase on the server.
if (typeof window !== 'undefined' && firebaseConfig.apiKey) {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);

  // Enable offline persistence. It's important to wrap this in a try-catch block
  // as it can fail if another tab already has persistence enabled.
  try {
    enableIndexedDbPersistence(db, { forceOwnership: true });
  } catch (error: any) {
    if (error.code === 'failed-precondition') {
      console.warn(
        'Firebase offline persistence could not be enabled. ' +
        'This is likely because it is already active in another tab.'
      );
    } else if (error.code === 'unimplemented') {
      console.warn(
        'Firebase offline persistence is not available in this browser.'
      );
    } else {
        console.error('Error enabling Firestore offline persistence:', error);
    }
  }
} else {
  // Provide dummy objects for server-side rendering to prevent errors
  app = {} as FirebaseApp;
  auth = {} as Auth;
  db = {} as Firestore;
}

export { app, auth, db };
