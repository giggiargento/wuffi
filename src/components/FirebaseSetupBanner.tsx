import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getMissingFirebaseEnvKeys } from '@/config/firebase';

export function FirebaseSetupBanner() {
  const { t } = useTranslation();
  const missing = getMissingFirebaseEnvKeys();

  if (missing.length === 0) return null;

  return (
    <View className="mb-6 rounded-2xl border-2 border-border bg-pink p-4">
      <Text className="mb-2 text-base font-bold text-text">{t('errors.firebaseNotConfigured')}</Text>
      <Text className="mb-2 text-sm text-text">{t('firebase.setup.missingEnv')}</Text>
      {missing.map((key) => (
        <Text key={key} className="font-mono text-xs text-muted">
          • {key}
        </Text>
      ))}
      <Text className="mt-3 text-sm text-muted">{t('firebase.setup.seeDocs')}</Text>
    </View>
  );
}
