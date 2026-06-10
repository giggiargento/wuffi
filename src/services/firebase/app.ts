import { Platform } from 'react-native';
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getFirebaseConfig, isFirebaseConfigured } from '@/config/firebase';

const firebaseConfig = getFirebaseConfig();

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;
let initError: string | undefined;

if (isFirebaseConfigured()) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

    if (__DEV__ && Platform.OS !== 'web') {
      console.info('[WUFFI] Firebase initialized for', Platform.OS);
    }
  } catch (error) {
    initError = error instanceof Error ? error.message : 'Unknown Firebase init error';
    console.error('[WUFFI] Firebase initialization failed:', initError);
  }
} else {
  console.warn('[WUFFI] Firebase not configured. Add EXPO_PUBLIC_FIREBASE_* to .env');
}

export { app, auth, db, storage, initError, firebaseConfig };
export { isFirebaseConfigured, getMissingFirebaseEnvKeys } from '@/config/firebase';
