export type Species = 'dog' | 'cat' | 'rabbit' | 'bird' | 'other';
export type Sex = 'male' | 'female' | 'unknown';
export type PetVisibility = 'private';
export type PetStatus = 'safe' | 'lost';

export interface VaccineRecord {
  name: string;
  date: Date;
  nextDue?: Date;
}

export interface VetContact {
  name: string;
  phone?: string;
  email?: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship?: string;
}

export interface Pet {
  id: string;
  ownerId: string;
  visibility: PetVisibility;
  name: string;
  species: Species;
  breed?: string;
  sex: Sex;
  birthDate?: Date;
  ageMonths?: number;
  weightKg?: number;
  color?: string;
  photoUrls: string[];
  personalityNotes?: string;
  medicalNotes?: string;
  vaccines?: VaccineRecord[];
  allergies?: string[];
  vetContact?: VetContact;
  microchipId?: string;
  customId?: string;
  wuffiId: string;
  emergencyContact?: EmergencyContact;
  status: PetStatus;
  activeLostCaseId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePetInput {
  name: string;
  species: Species;
  breed?: string;
  sex: Sex;
  birthDate?: Date;
  ageMonths?: number;
  weightKg?: number;
  color?: string;
  photoUrls?: string[];
  personalityNotes?: string;
  medicalNotes?: string;
  allergies?: string[];
  microchipId?: string;
}

export interface UpdatePetInput extends Partial<Omit<CreatePetInput, 'allergies'>> {
  status?: PetStatus;
  activeLostCaseId?: string | null;
  allergies?: string | string[];
  photoUrls?: string[];
}
