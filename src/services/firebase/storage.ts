import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage, isFirebaseConfigured } from './app';

export async function uploadFile(
  path: string,
  blob: Blob,
  contentType = 'image/jpeg'
): Promise<string> {
  if (!isFirebaseConfigured() || !storage) {
    throw new Error('Firebase Storage not configured');
  }
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, blob, { contentType });
  return getDownloadURL(storageRef);
}

export async function deleteFile(path: string): Promise<void> {
  if (!isFirebaseConfigured() || !storage) return;
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}

export function petPhotoPath(petId: string, fileId: string) {
  return `pets/${petId}/photos/${fileId}.jpg`;
}

export function casePhotoPath(caseId: string, fileId: string) {
  return `cases/${caseId}/photos/${fileId}.jpg`;
}

export function userAvatarPath(uid: string) {
  return `users/${uid}/avatar.jpg`;
}
