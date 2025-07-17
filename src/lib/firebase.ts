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

// Check if all required environment variables are present
if (firebaseConfig.apiKey) {
  // Initialize Firebase
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  // Enable offline persistence
  try {
    enableIndexedDbPersistence(db);
  } catch (err: any) {
    if (err.code === 'failed-precondition') {
      // This error happens if you have multiple tabs open and persistence is
      // enabled in one of them. It's safe to ignore.
      console.log('Firestore persistence failed-precondition. Multiple tabs open?');
    } else if (err.code === 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence
      console.log('Firestore persistence not available in this browser.');
    }
  }

} else {
    // This is a fallback for when the env variables are not set
    // The app will not have firebase functionality, but it will not crash.
    // We provide dummy objects to prevent the app from crashing on import
    app = {} as FirebaseApp;
    auth = {} as Auth;
    db = {} as Firestore;
}


export { app, auth, db };
