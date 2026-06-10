import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/services/firebase/app';
import { FIRESTORE_COLLECTIONS } from '@/constants';
import type { Favorite, CaseType } from '@/types';
import { timestampToDate, favoriteDocId } from '@/utils/firestore';

function firestoreToFavorite(id: string, data: Record<string, unknown>): Favorite {
  return {
    id,
    userId: data.userId as string,
    targetType: data.targetType as Favorite['targetType'],
    targetId: data.targetId as string,
    caseType: data.caseType as CaseType | undefined,
    createdAt: timestampToDate(data.createdAt as Timestamp) ?? new Date(),
  };
}

export async function getFavoritesByUser(userId: string): Promise<Favorite[]> {
  if (!isFirebaseConfigured() || !db) return [];
  const q = query(
    collection(db, FIRESTORE_COLLECTIONS.favorites),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => firestoreToFavorite(d.id, d.data()));
}

export async function isFavorite(
  userId: string,
  targetType: string,
  targetId: string
): Promise<boolean> {
  if (!isFirebaseConfigured() || !db) return false;
  const id = favoriteDocId(userId, targetType, targetId);
  const snap = await getDoc(doc(db, FIRESTORE_COLLECTIONS.favorites, id));
  return snap.exists();
}

export async function addFavorite(
  userId: string,
  targetType: 'case' | 'organization',
  targetId: string,
  caseType?: CaseType
): Promise<Favorite> {
  if (!isFirebaseConfigured() || !db) throw new Error('Firestore not configured');
  const id = favoriteDocId(userId, targetType, targetId);
  const ref = doc(db, FIRESTORE_COLLECTIONS.favorites, id);
  await setDoc(ref, {
    id,
    userId,
    targetType,
    targetId,
    caseType,
    createdAt: serverTimestamp(),
  });
  const snap = await getDoc(ref);
  return firestoreToFavorite(snap.id, snap.data()!);
}

export async function removeFavorite(
  userId: string,
  targetType: string,
  targetId: string
): Promise<void> {
  if (!isFirebaseConfigured() || !db) throw new Error('Firestore not configured');
  const id = favoriteDocId(userId, targetType, targetId);
  await deleteDoc(doc(db, FIRESTORE_COLLECTIONS.favorites, id));
}

export async function toggleFavorite(
  userId: string,
  targetType: 'case' | 'organization',
  targetId: string,
  caseType?: CaseType
): Promise<boolean> {
  const exists = await isFavorite(userId, targetType, targetId);
  if (exists) {
    await removeFavorite(userId, targetType, targetId);
    return false;
  }
  await addFavorite(userId, targetType, targetId, caseType);
  return true;
}
