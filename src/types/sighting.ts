export type SightingStatus = 'pending' | 'confirmed' | 'dismissed';

export interface Sighting {
  id: string;
  caseId: string;
  reporterId: string;
  photoUrl?: string;
  location: { latitude: number; longitude: number };
  locationGeoHash: string;
  seenAt: Date;
  notes?: string;
  status: SightingStatus;
  createdAt: Date;
}
