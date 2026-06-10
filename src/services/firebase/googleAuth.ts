import { GoogleAuthProvider, signInWithPopup, signInWithCredential } from 'firebase/auth';
import { auth, isFirebaseConfigured } from './app';

/**
 * Google Sign-In (web popup). Native OAuth requires extra setup
 * (@react-native-google-signin/google-signin + platform config).
 * Email/password is the MVP path; this is prepared but optional.
 */
export async function signInWithGoogleWeb() {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error('Firebase Auth not configured');
  }

  if (typeof signInWithPopup !== 'function') {
    throw new Error('Google Sign-In is not available on this platform yet');
  }

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  return signInWithPopup(auth, provider);
}

export async function signInWithGoogleCredential(idToken: string, accessToken?: string) {
  if (!auth) throw new Error('Firebase Auth not configured');
  const credential = GoogleAuthProvider.credential(idToken, accessToken);
  return signInWithCredential(auth, credential);
}

export const isGoogleSignInReady = false;
