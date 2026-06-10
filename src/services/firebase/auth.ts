import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './app';

export type AuthUser = FirebaseUser;

export function subscribeToAuth(callback: (user: AuthUser | null) => void) {
  if (!isFirebaseConfigured() || !auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export async function signInWithEmail(email: string, password: string) {
  if (!auth) throw new Error('Firebase Auth not configured');
  return signInWithEmailAndPassword(auth, email, password);
}

export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string
) {
  if (!auth) throw new Error('Firebase Auth not configured');
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName });
  return credential;
}

export async function signOutUser() {
  if (!auth) throw new Error('Firebase Auth not configured');
  return signOut(auth);
}

export async function resetPassword(email: string) {
  if (!auth) throw new Error('Firebase Auth not configured');
  return sendPasswordResetEmail(auth, email);
}

export function getCurrentUser() {
  return auth?.currentUser ?? null;
}
