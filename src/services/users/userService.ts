import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/services/firebase/app';
import { FIRESTORE_COLLECTIONS, DEFAULT_NOTIFICATION_RADIUS_KM } from '@/constants';
import type { User, CreateUserInput } from '@/types';
import {
  timestampToDate,
  geoPointToCoords,
  coordsToGeoPoint,
  removeUndefined,
} from '@/utils/firestore';

function firestoreToUser(id: string, data: Record<string, unknown>): User {
  const settings = (data.notificationSettings ?? {}) as Record<string, unknown>;
  return {
    uid: id,
    email: data.email as string,
    displayName: data.displayName as string,
    photoURL: data.photoURL as string | undefined,
    phone: data.phone as string | undefined,
    province: data.province as string | undefined,
    city: data.city as string | undefined,
    neighborhood: data.neighborhood as string | undefined,
    geo: geoPointToCoords(data.geo as never),
    locale: (data.locale as User['locale']) ?? 'es-AR',
    role: (data.role as User['role']) ?? 'user',
    organizationId: data.organizationId as string | undefined,
    notificationSettings: {
      lostNearby: (settings.lostNearby as boolean) ?? true,
      foundNearby: (settings.foundNearby as boolean) ?? true,
      transitNearby: (settings.transitNearby as boolean) ?? true,
      sightings: (settings.sightings as boolean) ?? true,
      adoptionUpdates: (settings.adoptionUpdates as boolean) ?? true,
      interactions: (settings.interactions as boolean) ?? true,
      pushEnabled: (settings.pushEnabled as boolean) ?? false,
      radiusKm: (settings.radiusKm as number) ?? DEFAULT_NOTIFICATION_RADIUS_KM,
    },
    pushToken: data.pushToken as string | undefined,
    createdAt: timestampToDate(data.createdAt as Timestamp) ?? new Date(),
    updatedAt: timestampToDate(data.updatedAt as Timestamp) ?? new Date(),
  };
}

export async function getUser(uid: string): Promise<User | null> {
  if (!isFirebaseConfigured() || !db) return null;
  const snap = await getDoc(doc(db, FIRESTORE_COLLECTIONS.users, uid));
  if (!snap.exists()) return null;
  return firestoreToUser(snap.id, snap.data());
}

export async function createUser(input: CreateUserInput): Promise<User> {
  if (!isFirebaseConfigured() || !db) throw new Error('Firestore not configured');
  const ref = doc(db, FIRESTORE_COLLECTIONS.users, input.uid);
  const payload = removeUndefined({
    uid: input.uid,
    email: input.email,
    displayName: input.displayName,
    locale: input.locale ?? 'es-AR',
    role: 'user',
    notificationSettings: {
      lostNearby: true,
      foundNearby: true,
      transitNearby: true,
      sightings: true,
      adoptionUpdates: true,
      interactions: true,
      pushEnabled: false,
      radiusKm: DEFAULT_NOTIFICATION_RADIUS_KM,
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await setDoc(ref, payload);
  const created = await getUser(input.uid);
  if (!created) throw new Error('Failed to create user');
  return created;
}

export async function updateUser(
  uid: string,
  data: Partial<Omit<User, 'uid' | 'createdAt'>>
): Promise<User> {
  if (!isFirebaseConfigured() || !db) throw new Error('Firestore not configured');
  const ref = doc(db, FIRESTORE_COLLECTIONS.users, uid);
  const payload = removeUndefined({
    ...data,
    geo: coordsToGeoPoint(data.geo),
    updatedAt: serverTimestamp(),
  });
  await updateDoc(ref, payload);
  const updated = await getUser(uid);
  if (!updated) throw new Error('User not found');
  return updated;
}

export async function getOrCreateUser(input: CreateUserInput): Promise<User> {
  const existing = await getUser(input.uid);
  if (existing) return existing;
  return createUser(input);
}
