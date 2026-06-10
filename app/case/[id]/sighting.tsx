import { View, Text } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { EmptyState } from '@/components';

export default function ReportSightingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen
        options={{
          title: t('case.reportSighting'),
          headerStyle: { backgroundColor: '#FFF4EA' },
        }}
      />
      <View className="flex-1 bg-background">
        <EmptyState
          title={t('case.reportSighting')}
          subtitle={`Case: ${id}`}
          icon="eye-outline"
        />
      </View>
    </>
  );
}
