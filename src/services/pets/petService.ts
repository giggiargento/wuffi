import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/services/firebase/app';
import { FIRESTORE_COLLECTIONS } from '@/constants';
import type { Pet, CreatePetInput, UpdatePetInput } from '@/types';
import { normalizePetSpecies } from '@/types/species';
import {
  timestampToDate,
  removeUndefined,
  generateWuffiId,
} from '@/utils/firestore';

function firestoreToPet(id: string, data: Record<string, unknown>): Pet {
  const vaccines = (data.vaccines as Array<Record<string, unknown>> | undefined)?.map(
    (v) => ({
      name: v.name as string,
      date: timestampToDate(v.date as Timestamp) ?? new Date(),
      nextDue: timestampToDate(v.nextDue as Timestamp),
    })
  );

  return {
    id,
    ownerId: data.ownerId as string,
    visibility: 'private',
    name: data.name as string,
    species: normalizePetSpecies(data.species),
    breed: data.breed as string | undefined,
    sex: data.sex as Pet['sex'],
    birthDate: timestampToDate(data.birthDate as Timestamp),
    ageMonths: data.ageMonths as number | undefined,
    weightKg: data.weightKg as number | undefined,
    color: data.color as string | undefined,
    photoUrls: (data.photoUrls as string[]) ?? [],
    personalityNotes: data.personalityNotes as string | undefined,
    medicalNotes: data.medicalNotes as string | undefined,
    vaccines,
    allergies: data.allergies as string[] | undefined,
    vetContact: data.vetContact as Pet['vetContact'],
    microchipId: data.microchipId as string | undefined,
    customId: data.customId as string | undefined,
    wuffiId: data.wuffiId as string,
    emergencyContact: data.emergencyContact as Pet['emergencyContact'],
    status: (data.status as Pet['status']) ?? 'safe',
    activeLostCaseId: data.activeLostCaseId as string | undefined,
    createdAt: timestampToDate(data.createdAt as Timestamp) ?? new Date(),
    updatedAt: timestampToDate(data.updatedAt as Timestamp) ?? new Date(),
  };
}

export async function getPet(petId: string): Promise<Pet | null> {
  if (!isFirebaseConfigured() || !db) return null;
  const snap = await getDoc(doc(db, FIRESTORE_COLLECTIONS.pets, petId));
  if (!snap.exists()) return null;
  return firestoreToPet(snap.id, snap.data());
}

export async function getPetsByOwner(ownerId: string): Promise<Pet[]> {
  if (!isFirebaseConfigured() || !db) return [];
  const q = query(
    collection(db, FIRESTORE_COLLECTIONS.pets),
    where('ownerId', '==', ownerId)
  );
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => firestoreToPet(d.id, d.data()))
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

export async function createPet(
  ownerId: string,
  input: CreatePetInput
): Promise<Pet> {
  if (!isFirebaseConfigured() || !db) throw new Error('Firestore not configured');
  const payload = removeUndefined({
    ownerId,
    visibility: 'private',
    name: input.name,
    species: input.species,
    breed: input.breed,
    sex: input.sex,
    birthDate: input.birthDate ? Timestamp.fromDate(input.birthDate) : undefined,
    ageMonths: input.ageMonths,
    weightKg: input.weightKg,
    color: input.color,
    photoUrls: input.photoUrls ?? [],
    personalityNotes: input.personalityNotes,
    medicalNotes: input.medicalNotes,
    allergies: input.allergies,
    microchipId: input.microchipId,
    wuffiId: generateWuffiId(input.name),
    status: 'safe',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const ref = await addDoc(collection(db, FIRESTORE_COLLECTIONS.pets), payload);
  const pet = await getPet(ref.id);
  if (!pet) throw new Error('Failed to create pet');
  return pet;
}

export async function updatePet(
  petId: string,
  input: UpdatePetInput
): Promise<Pet> {
  if (!isFirebaseConfigured() || !db) throw new Error('Firestore not configured');
  const ref = doc(db, FIRESTORE_COLLECTIONS.pets, petId);
  const payload = removeUndefined({
    ...input,
    allergies:
      typeof input.allergies === 'string'
        ? input.allergies.split(',').map((a) => a.trim()).filter(Boolean)
        : input.allergies,
    birthDate: input.birthDate ? Timestamp.fromDate(input.birthDate) : undefined,
    updatedAt: serverTimestamp(),
  });
  await updateDoc(ref, payload);
  const pet = await getPet(petId);
  if (!pet) throw new Error('Pet not found');
  return pet;
}

export async function deletePet(petId: string, ownerId: string): Promise<void> {
  if (!isFirebaseConfigured() || !db) throw new Error('Firestore not configured');
  const pet = await getPet(petId);
  if (!pet) throw new Error('Pet not found');
  if (pet.ownerId !== ownerId) throw new Error('Unauthorized');
  await deleteDoc(doc(db, FIRESTORE_COLLECTIONS.pets, petId));
}

export async function addPetPhoto(petId: string, photoUrl: string): Promise<Pet> {
  const pet = await getPet(petId);
  if (!pet) throw new Error('Pet not found');
  return updatePet(petId, { photoUrls: [...pet.photoUrls, photoUrl] });
}
