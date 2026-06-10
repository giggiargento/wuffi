export type CaseType = 'lost' | 'found' | 'adoption' | 'transit';
export type LostStatus = 'active' | 'sighted' | 'found' | 'closed';
export type FoundStatus = 'looking_for_owner' | 'reunited' | 'closed';
export type AdoptionStatus = 'available' | 'reserved' | 'adopted';
export type TransitStatus = 'seeking_home' | 'in_transit' | 'placed' | 'closed';
export type TemporaryCare = 'with_finder' | 'shelter' | 'street' | 'vet' | 'foster';
export type ContactMethod = 'whatsapp' | 'phone' | 'in_app';
export type PetSize = 'small' | 'medium' | 'large';

export interface PetSnapshot {
  name: string;
  species: string;
  breed?: string;
  sex?: string;
  ageMonths?: number;
  weightKg?: number;
  color?: string;
  photoUrls: string[];
}

export interface CaseContact {
  showPhone: boolean;
  showWhatsApp: boolean;
  phone?: string;
  whatsApp?: string;
  preferredMethod: ContactMethod;
}

export interface CaseReward {
  amount?: number;
  currency?: 'ARS';
  description?: string;
}

export interface BaseCase {
  id: string;
  caseType: CaseType;
  ownerId: string;
  petId?: string;
  organizationId?: string;
  petSnapshot: PetSnapshot;
  title: string;
  description: string;
  status: string;
  location: { latitude: number; longitude: number };
  locationGeoHash: string;
  addressText?: string;
  province?: string;
  city?: string;
  neighborhood?: string;
  contact: CaseContact;
  sightingCount: number;
  favoriteCount: number;
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
}

export interface LostCase extends BaseCase {
  caseType: 'lost';
  status: LostStatus;
  lastSeenAt: Date;
  lastSeenLocation: { latitude: number; longitude: number };
  reward?: CaseReward;
}

export interface FoundCase extends BaseCase {
  caseType: 'found';
  status: FoundStatus;
  foundAt: Date;
  foundLocation: { latitude: number; longitude: number };
  temporaryCare: TemporaryCare;
}

export interface AdoptionCase extends BaseCase {
  caseType: 'adoption';
  status: AdoptionStatus;
  adoptionLocation: { latitude: number; longitude: number };
  healthStatus?: string;
  vaccinated: boolean;
  neutered: boolean;
  personality?: string;
  requirements?: string[];
  size?: PetSize;
}

export interface TransitCase extends BaseCase {
  caseType: 'transit';
  status: TransitStatus;
  transitStartAt: Date;
  transitEndAt?: Date;
  fosterLocation: { latitude: number; longitude: number };
  temporaryCare: TemporaryCare;
  needsHome: boolean;
}

export type Case = LostCase | FoundCase | AdoptionCase | TransitCase;

export interface CreateCaseBaseInput {
  petId?: string;
  petSnapshot: PetSnapshot;
  title: string;
  description: string;
  location: { latitude: number; longitude: number };
  addressText?: string;
  province?: string;
  city?: string;
  neighborhood?: string;
  contact: CaseContact;
}

export interface CreateLostCaseInput extends CreateCaseBaseInput {
  caseType: 'lost';
  lastSeenAt: Date;
  lastSeenLocation: { latitude: number; longitude: number };
  reward?: CaseReward;
}

export interface CreateFoundCaseInput extends CreateCaseBaseInput {
  caseType: 'found';
  foundAt: Date;
  foundLocation: { latitude: number; longitude: number };
  temporaryCare: TemporaryCare;
}

export interface CreateAdoptionCaseInput extends CreateCaseBaseInput {
  caseType: 'adoption';
  adoptionLocation: { latitude: number; longitude: number };
  healthStatus?: string;
  vaccinated: boolean;
  neutered: boolean;
  personality?: string;
  requirements?: string[];
  size?: PetSize;
}

export interface CreateTransitCaseInput extends CreateCaseBaseInput {
  caseType: 'transit';
  transitStartAt: Date;
  transitEndAt?: Date;
  fosterLocation: { latitude: number; longitude: number };
  temporaryCare: TemporaryCare;
  needsHome: boolean;
}

export type CreateCaseInput =
  | CreateLostCaseInput
  | CreateFoundCaseInput
  | CreateAdoptionCaseInput
  | CreateTransitCaseInput;

export interface ExploreFilters {
  caseType?: CaseType;
  species?: string;
  province?: string;
  city?: string;
  neighborhood?: string;
  status?: string;
  search?: string;
}
