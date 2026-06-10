export type Locale = 'es-AR' | 'en-US';
export type UserRole = 'user' | 'org_admin' | 'moderator';

export interface NotificationSettings {
  lostNearby: boolean;
  foundNearby: boolean;
  transitNearby: boolean;
  sightings: boolean;
  adoptionUpdates: boolean;
  interactions: boolean;
  pushEnabled: boolean;
  radiusKm: number;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phone?: string;
  province?: string;
  city?: string;
  neighborhood?: string;
  geo?: { latitude: number; longitude: number };
  locale: Locale;
  role: UserRole;
  organizationId?: string;
  notificationSettings: NotificationSettings;
  pushToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  uid: string;
  email: string;
  displayName: string;
  locale?: Locale;
}
