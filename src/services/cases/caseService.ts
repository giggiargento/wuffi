import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  GeoPoint,
} from 'firebase/firestore';
import { geohashForLocation } from 'geofire-common';
import { db, isFirebaseConfigured } from '@/services/firebase/app';
import { FIRESTORE_COLLECTIONS } from '@/constants';
import type {
  Case,
  CreateCaseInput,
  ExploreFilters,
  CaseType,
} from '@/types';
import {
  timestampToDate,
  geoPointToCoords,
  coordsToGeoPoint,
  removeUndefined,
} from '@/utils/firestore';

function firestoreToCase(id: string, data: Record<string, unknown>): Case {
  const base = {
    id,
    caseType: data.caseType as CaseType,
    ownerId: data.ownerId as string,
    petId: data.petId as string | undefined,
    organizationId: data.organizationId as string | undefined,
    petSnapshot: data.petSnapshot as Case['petSnapshot'],
    title: data.title as string,
    description: data.description as string,
    status: data.status as string,
    location: geoPointToCoords(data.location as GeoPoint)!,
    locationGeoHash: data.locationGeoHash as string,
    addressText: data.addressText as string | undefined,
    province: data.province as string | undefined,
    city: data.city as string | undefined,
    neighborhood: data.neighborhood as string | undefined,
    contact: data.contact as Case['contact'],
    sightingCount: (data.sightingCount as number) ?? 0,
    favoriteCount: (data.favoriteCount as number) ?? 0,
    createdAt: timestampToDate(data.createdAt as Timestamp) ?? new Date(),
    updatedAt: timestampToDate(data.updatedAt as Timestamp) ?? new Date(),
    closedAt: timestampToDate(data.closedAt as Timestamp),
  };

  switch (data.caseType) {
    case 'lost':
      return {
        ...base,
        caseType: 'lost',
        status: data.status as 'active' | 'sighted' | 'found' | 'closed',
        lastSeenAt: timestampToDate(data.lastSeenAt as Timestamp) ?? new Date(),
        lastSeenLocation: geoPointToCoords(data.lastSeenLocation as GeoPoint)!,
        reward: data.reward as Case extends { caseType: 'lost' } ? Case['reward'] : never,
      };
    case 'found':
      return {
        ...base,
        caseType: 'found',
        status: data.status as 'looking_for_owner' | 'reunited' | 'closed',
        foundAt: timestampToDate(data.foundAt as Timestamp) ?? new Date(),
        foundLocation: geoPointToCoords(data.foundLocation as GeoPoint)!,
        temporaryCare: data.temporaryCare as 'with_finder' | 'shelter' | 'street' | 'vet',
      };
    case 'adoption':
      return {
        ...base,
        caseType: 'adoption',
        status: data.status as 'available' | 'reserved' | 'adopted',
        adoptionLocation: geoPointToCoords(data.adoptionLocation as GeoPoint)!,
        healthStatus: data.healthStatus as string | undefined,
        vaccinated: (data.vaccinated as boolean) ?? false,
        neutered: (data.neutered as boolean) ?? false,
        personality: data.personality as string | undefined,
        requirements: data.requirements as string[] | undefined,
        size: data.size as 'small' | 'medium' | 'large' | undefined,
      };
    case 'transit':
      return {
        ...base,
        caseType: 'transit',
        status: data.status as 'seeking_home' | 'in_transit' | 'placed' | 'closed',
        transitStartAt: timestampToDate(data.transitStartAt as Timestamp) ?? new Date(),
        transitEndAt: timestampToDate(data.transitEndAt as Timestamp),
        fosterLocation: geoPointToCoords(data.fosterLocation as GeoPoint)!,
        temporaryCare: data.temporaryCare as 'with_finder' | 'shelter' | 'street' | 'vet' | 'foster',
        needsHome: (data.needsHome as boolean) ?? true,
      };
    default:
      throw new Error(`Unknown case type: ${data.caseType}`);
  }
}

function getDefaultStatus(caseType: CaseType): string {
  switch (caseType) {
    case 'lost':
      return 'active';
    case 'found':
      return 'looking_for_owner';
    case 'adoption':
      return 'available';
    case 'transit':
      return 'seeking_home';
  }
}

function buildCasePayload(ownerId: string, input: CreateCaseInput) {
  const geoHash = geohashForLocation([
    input.location.latitude,
    input.location.longitude,
  ]);

  const base = {
    caseType: input.caseType,
    ownerId,
    petId: input.petId,
    petSnapshot: input.petSnapshot,
    title: input.title,
    description: input.description,
    status: getDefaultStatus(input.caseType),
    location: coordsToGeoPoint(input.location),
    locationGeoHash: geoHash,
    addressText: input.addressText,
    province: input.province,
    city: input.city,
    neighborhood: input.neighborhood,
    contact: input.contact,
    sightingCount: 0,
    favoriteCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  switch (input.caseType) {
    case 'lost':
      return {
        ...base,
        lastSeenAt: Timestamp.fromDate(input.lastSeenAt),
        lastSeenLocation: coordsToGeoPoint(input.lastSeenLocation),
        reward: input.reward,
      };
    case 'found':
      return {
        ...base,
        foundAt: Timestamp.fromDate(input.foundAt),
        foundLocation: coordsToGeoPoint(input.foundLocation),
        temporaryCare: input.temporaryCare,
      };
    case 'adoption':
      return {
        ...base,
        adoptionLocation: coordsToGeoPoint(input.adoptionLocation),
        healthStatus: input.healthStatus,
        vaccinated: input.vaccinated,
        neutered: input.neutered,
        personality: input.personality,
        requirements: input.requirements,
        size: input.size,
      };
    case 'transit':
      return {
        ...base,
        transitStartAt: Timestamp.fromDate(input.transitStartAt),
        transitEndAt: input.transitEndAt
          ? Timestamp.fromDate(input.transitEndAt)
          : undefined,
        fosterLocation: coordsToGeoPoint(input.fosterLocation),
        temporaryCare: input.temporaryCare,
        needsHome: input.needsHome,
      };
  }
}

export async function getCase(caseId: string): Promise<Case | null> {
  if (!isFirebaseConfigured() || !db) return null;
  const snap = await getDoc(doc(db, FIRESTORE_COLLECTIONS.cases, caseId));
  if (!snap.exists()) return null;
  return firestoreToCase(snap.id, snap.data());
}

export async function getCasesByOwner(ownerId: string): Promise<Case[]> {
  if (!isFirebaseConfigured() || !db) return [];
  const q = query(
    collection(db, FIRESTORE_COLLECTIONS.cases),
    where('ownerId', '==', ownerId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => firestoreToCase(d.id, d.data()));
}

export async function exploreCases(
  filters: ExploreFilters,
  maxResults = 50
): Promise<Case[]> {
  if (!isFirebaseConfigured() || !db) return [];

  const constraints = [];
  if (filters.caseType) {
    constraints.push(where('caseType', '==', filters.caseType));
  }
  if (filters.city) {
    constraints.push(where('city', '==', filters.city));
  }
  if (filters.province) {
    constraints.push(where('province', '==', filters.province));
  }

  const q = query(
    collection(db, FIRESTORE_COLLECTIONS.cases),
    ...constraints,
    orderBy('createdAt', 'desc'),
    limit(maxResults)
  );

  const snap = await getDocs(q);
  let cases = snap.docs.map((d) => firestoreToCase(d.id, d.data()));

  if (filters.species) {
    cases = cases.filter((c) => c.petSnapshot.species === filters.species);
  }
  if (filters.neighborhood) {
    cases = cases.filter((c) => c.neighborhood === filters.neighborhood);
  }
  if (filters.search) {
    const term = filters.search.toLowerCase();
    cases = cases.filter(
      (c) =>
        c.title.toLowerCase().includes(term) ||
        c.description.toLowerCase().includes(term) ||
        c.petSnapshot.name.toLowerCase().includes(term)
    );
  }

  return cases;
}

export async function getRecentCasesNearby(
  caseType?: CaseType,
  maxResults = 10
): Promise<Case[]> {
  return exploreCases({ caseType }, maxResults);
}

export async function createCase(
  ownerId: string,
  input: CreateCaseInput
): Promise<Case> {
  if (!isFirebaseConfigured() || !db) throw new Error('Firestore not configured');
  const payload = removeUndefined(buildCasePayload(ownerId, input));
  const ref = await addDoc(collection(db, FIRESTORE_COLLECTIONS.cases), payload);
  const created = await getCase(ref.id);
  if (!created) throw new Error('Failed to create case');
  return created;
}

export async function updateCaseStatus(
  caseId: string,
  status: string
): Promise<Case> {
  if (!isFirebaseConfigured() || !db) throw new Error('Firestore not configured');
  const ref = doc(db, FIRESTORE_COLLECTIONS.cases, caseId);
  await updateDoc(ref, {
    status,
    updatedAt: serverTimestamp(),
    ...(status === 'closed' || status === 'adopted' || status === 'reunited'
      ? { closedAt: serverTimestamp() }
      : {}),
  });
  const updated = await getCase(caseId);
  if (!updated) throw new Error('Case not found');
  return updated;
}
