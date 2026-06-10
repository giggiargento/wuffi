import { View, Text, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { CaseCard, EmptyState } from '@/components';
import { useExploreCases } from '@/hooks/useCases';

export default function ExploreMapScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: cases } = useExploreCases();

  return (
    <>
      <Stack.Screen
        options={{
          title: t('map.title'),
          headerStyle: { backgroundColor: '#FFF4EA' },
        }}
      />
      <View className="flex-1 bg-background">
        <View className="border-b-2 border-border bg-sky px-4 py-3">
          <Text className="text-center text-sm text-text">{t('map.webFallback')}</Text>
        </View>
        <ScrollView className="flex-1 px-4 py-4">
          {cases && cases.length > 0 ? (
            cases.map((c) => (
              <CaseCard
                key={c.id}
                caseItem={c}
                onPress={() => router.push(`/case/${c.id}`)}
              />
            ))
          ) : (
            <EmptyState title={t('explore.empty')} icon="map-outline" />
          )}
        </ScrollView>
      </View>
    </>
  );
}
