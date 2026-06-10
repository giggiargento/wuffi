import * as Location from 'expo-location';

export interface LocationResult {
  latitude: number;
  longitude: number;
  addressText?: string;
}

export async function getCurrentLocation(): Promise<LocationResult | null> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return null;

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  let addressText: string | undefined;
  try {
    const [address] = await Location.reverseGeocodeAsync({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
    if (address) {
      addressText = [
        address.street,
        address.streetNumber,
        address.district,
        address.city,
        address.region,
      ]
        .filter(Boolean)
        .join(', ');
    }
  } catch {
    // reverse geocode optional
  }

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    addressText,
  };
}

export const DEFAULT_LOCATION = {
  latitude: -34.6037,
  longitude: -58.3816,
};
