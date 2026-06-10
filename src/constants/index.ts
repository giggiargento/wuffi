export const COLORS = {
  primary: '#F9A23B',
  background: '#FFF4EA',
  lavender: '#D8C3FF',
  pink: '#FFC8D8',
  sky: '#BDEFFF',
  mint: '#CFF5DC',
  text: '#1F2937',
  muted: '#6B7280',
  card: '#FFFFFF',
  border: '#000000',
} as const;

export const CASE_TYPE_COLORS = {
  lost: COLORS.primary,
  found: COLORS.sky,
  adoption: COLORS.mint,
  transit: COLORS.lavender,
} as const;

export const DEFAULT_LOCALE = 'es-AR' as const;
export const SUPPORTED_LOCALES = ['es-AR', 'en-US'] as const;

export const DEFAULT_NOTIFICATION_RADIUS_KM = 10;

export const FIRESTORE_COLLECTIONS = {
  users: 'users',
  pets: 'pets',
  cases: 'cases',
  sightings: 'sightings',
  favorites: 'favorites',
  notifications: 'notifications',
  organizations: 'organizations',
  documents: 'documents',
  qrProfiles: 'qrProfiles',
  reports: 'reports',
} as const;

export const CASE_TYPES = ['lost', 'found', 'adoption', 'transit'] as const;
export const SPECIES = ['dog', 'cat', 'rabbit', 'bird', 'other'] as const;
export const SEX_OPTIONS = ['male', 'female', 'unknown'] as const;

export const ARGENTINA_PROVINCES = [
  'Buenos Aires',
  'Ciudad Autónoma de Buenos Aires',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Cruz',
  'Santa Fe',
  'Santiago del Estero',
  'Tierra del Fuego',
  'Tucumán',
] as const;
