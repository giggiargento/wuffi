import { View, Text } from 'react-native';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components';
import { useAuth } from '@/hooks/useAuth';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { userProfile } = useAuth();

  return (
    <>
      <Stack.Screen
        options={{
          title: t('settings.title'),
          headerStyle: { backgroundColor: '#FFF4EA' },
        }}
      />
      <View className="flex-1 bg-background px-4 py-4">
        <Card className="mb-4">
          <Text className="font-semibold text-text">{t('settings.account')}</Text>
          <Text className="mt-2 text-muted">{userProfile?.email}</Text>
        </Card>
        <Card>
          <Text className="font-semibold text-text">{t('settings.language')}</Text>
          <Text className="mt-2 text-muted">{userProfile?.locale ?? 'es-AR'}</Text>
        </Card>
      </View>
    </>
  );
}
