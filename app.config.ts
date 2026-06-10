import { ExpoConfig, ConfigContext } from 'expo/config';

const firebaseExtra = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'WUFFI',
  slug: 'wuffi',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  scheme: 'wuffi',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#FFF4EA',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.wuffi.app',
    config: {
      googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundColor: '#FFF4EA',
    },
    package: 'com.wuffi.app',
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
      },
    },
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-localization',
    [
      'expo-location',
      {
        locationAlwaysAndWhenInUsePermission:
          'WUFFI necesita tu ubicación para mostrar alertas cercanas y publicar casos.',
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission:
          'WUFFI necesita acceso a tus fotos para subir imágenes de mascotas.',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: 'wuffi-app',
    },
    firebase: firebaseExtra,
  },
});
