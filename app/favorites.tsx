import { View, FlatList, ActivityIndicator } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { CaseCard, EmptyState } from '@/components';
import { useFavorites } from '@/hooks/useFavorites';
import { useCase } from '@/hooks/useCases';

function FavoriteCaseItem({ caseId }: { caseId: string }) {
  const router = useRouter();
  const { data: caseItem } = useCase(caseId);

  if (!caseItem) return null;

  return (
    <CaseCard caseItem={caseItem} onPress={() => router.push(`/case/${caseId}`)} isFavorite />
  );
}

export default function FavoritesScreen() {
  const { t } = useTranslation();
  const { data: favorites, isLoading } = useFavorites();

  const caseFavorites = favorites?.filter((f) => f.targetType === 'case') ?? [];

  return (
    <>
      <Stack.Screen
        options={{
          title: t('favorites.title'),
          headerStyle: { backgroundColor: '#FFF4EA' },
        }}
      />
      {isLoading ? (
        <View className="flex-1 items-center justify-center bg-background">
          <ActivityIndicator color="#F9A23B" />
        </View>
      ) : (
        <FlatList
          className="flex-1 bg-background"
          contentContainerClassName="px-4 py-4 pb-8"
          data={caseFavorites}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <EmptyState
              title={t('favorites.empty')}
              subtitle={t('favorites.emptySubtitle')}
              icon="heart-outline"
            />
          }
          renderItem={({ item }) => <FavoriteCaseItem caseId={item.targetId} />}
        />
      )}
    </>
  );
}
