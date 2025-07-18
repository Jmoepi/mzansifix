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

// A promise that resolves with the Firebase services once they are initialized.
let firebasePromise: Promise<{ app: FirebaseApp; auth: Auth; db: Firestore }> | null = null;

function getFirebase() {
  if (firebasePromise) {
    return firebasePromise;
  }
  
  if (typeof window !== 'undefined' && firebaseConfig.apiKey) {
    firebasePromise = new Promise((resolve, reject) => {
      try {
        const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
        const auth = getAuth(app);
        const db = getFirestore(app);

        enableIndexedDbPersistence(db, { forceOwnership: true })
          .then(() => {
            console.log('Firestore offline persistence enabled.');
            resolve({ app, auth, db });
          })
          .catch((error: any) => {
            if (error.code === 'failed-precondition') {
              console.warn('Firestore offline persistence could not be enabled. This is likely because it is already active in another tab. The app will continue without it.');
              resolve({ app, auth, db }); // Resolve anyway, but without offline persistence
            } else if (error.code === 'unimplemented') {
              console.warn('Firestore offline persistence is not available in this browser. The app will continue without it.');
               resolve({ app, auth, db }); // Resolve anyway, but without offline persistence
            } else {
              console.error('Error enabling Firestore offline persistence:', error);
              reject(error);
            }
          });
      } catch (error) {
        reject(error);
      }
    });
    return firebasePromise;
  }
  
  // This should not happen in the browser, but as a fallback:
  return Promise.reject(new Error("Firebase can only be initialized on the client."));
}

export { getFirebase };
