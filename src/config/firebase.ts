import Constants from 'expo-constants';

export interface FirebasePublicConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

type ExtraFirebase = Partial<FirebasePublicConfig>;

function readEnv(key: string): string | undefined {
  const value = process.env[key];
  return value && value.trim().length > 0 ? value.trim() : undefined;
}

export function getFirebaseConfig(): FirebasePublicConfig {
  const extra = Constants.expoConfig?.extra?.firebase as ExtraFirebase | undefined;

  return {
    apiKey: readEnv('EXPO_PUBLIC_FIREBASE_API_KEY') ?? extra?.apiKey ?? '',
    authDomain: readEnv('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN') ?? extra?.authDomain ?? '',
    projectId: readEnv('EXPO_PUBLIC_FIREBASE_PROJECT_ID') ?? extra?.projectId ?? '',
    storageBucket:
      readEnv('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET') ?? extra?.storageBucket ?? '',
    messagingSenderId:
      readEnv('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID') ??
      extra?.messagingSenderId ??
      '',
    appId: readEnv('EXPO_PUBLIC_FIREBASE_APP_ID') ?? extra?.appId ?? '',
  };
}

export function isFirebaseConfigured(): boolean {
  const config = getFirebaseConfig();
  return Boolean(config.apiKey && config.authDomain && config.projectId && config.appId);
}

export function getMissingFirebaseEnvKeys(): string[] {
  const required: Array<[keyof FirebasePublicConfig, string]> = [
    ['apiKey', 'EXPO_PUBLIC_FIREBASE_API_KEY'],
    ['authDomain', 'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN'],
    ['projectId', 'EXPO_PUBLIC_FIREBASE_PROJECT_ID'],
    ['storageBucket', 'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET'],
    ['messagingSenderId', 'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'],
    ['appId', 'EXPO_PUBLIC_FIREBASE_APP_ID'],
  ];

  const config = getFirebaseConfig();
  return required.filter(([field]) => !config[field]).map(([, envKey]) => envKey);
}
