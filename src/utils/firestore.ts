import { Timestamp, GeoPoint } from 'firebase/firestore';

export function timestampToDate(value: Timestamp | Date | undefined): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  return value.toDate();
}

export function dateToTimestamp(value: Date | undefined): Timestamp | undefined {
  if (!value) return undefined;
  return Timestamp.fromDate(value);
}

export function geoPointToCoords(
  value: GeoPoint | { latitude: number; longitude: number } | undefined
): { latitude: number; longitude: number } | undefined {
  if (!value) return undefined;
  if (value instanceof GeoPoint) {
    return { latitude: value.latitude, longitude: value.longitude };
  }
  return value;
}

export function coordsToGeoPoint(
  value: { latitude: number; longitude: number } | undefined
): GeoPoint | undefined {
  if (!value) return undefined;
  return new GeoPoint(value.latitude, value.longitude);
}

export function removeUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as Partial<T>;
}

export function generateWuffiId(name: string): string {
  const slug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${slug || 'pet'}-${suffix}`;
}

export function favoriteDocId(
  userId: string,
  targetType: string,
  targetId: string
): string {
  return `${userId}_${targetType}_${targetId}`;
}
