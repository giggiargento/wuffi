import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CaseCard, Chip, ChipRow, SearchBar, EmptyState } from '@/components';
import { useExploreCases } from '@/hooks/useCases';
import { useExploreStore } from '@/stores/exploreStore';
import { useToggleFavorite, useIsFavorite } from '@/hooks/useFavorites';
import { useAuthStore } from '@/stores/authStore';
import type { CaseType, Case } from '@/types';

const TABS: CaseType[] = ['lost', 'found', 'adoption', 'transit'];

function ExploreCaseCard({ caseItem }: { caseItem: Case }) {
  const router = useRouter();
  const userId = useAuthStore((s) => s.firebaseUser?.uid);
  const { data: isFav } = useIsFavorite('case', caseItem.id);
  const toggleFavorite = useToggleFavorite();

  return (
    <CaseCard
      caseItem={caseItem}
      onPress={() => router.push(`/case/${caseItem.id}`)}
      isFavorite={isFav}
      onFavorite={
        userId
          ? () =>
              toggleFavorite.mutate({
                targetType: 'case',
                targetId: caseItem.id,
                caseType: caseItem.caseType,
              })
          : undefined
      }
    />
  );
}

export default function ExploreScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const activeTab = useExploreStore((s) => s.activeTab);
  const searchQuery = useExploreStore((s) => s.searchQuery);
  const setActiveTab = useExploreStore((s) => s.setActiveTab);
  const setSearchQuery = useExploreStore((s) => s.setSearchQuery);
  const { data: cases, isLoading, refetch, isRefetching } = useExploreCases();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-4 pt-2">
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-text">{t('explore.title')}</Text>
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => router.push('/explore/map')}
              className="rounded-full border-2 border-border bg-card p-2"
            >
              <Ionicons name="map" size={22} color="#1F2937" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/explore/filters')}
              className="rounded-full border-2 border-border bg-card p-2"
            >
              <Ionicons name="options" size={22} color="#1F2937" />
            </TouchableOpacity>
          </View>
        </View>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('explore.searchPlaceholder')}
          className="mb-4"
        />

        <ChipRow>
          {TABS.map((tab) => (
            <Chip
              key={tab}
              label={t(`explore.${tab}`)}
              selected={activeTab === tab}
              onPress={() => setActiveTab(tab)}
              color={
                tab === 'lost'
                  ? 'primary'
                  : tab === 'found'
                    ? 'sky'
                    : tab === 'adoption'
                      ? 'mint'
                      : 'lavender'
              }
            />
          ))}
        </ChipRow>
      </View>

      {isLoading ? (
        <ActivityIndicator color="#F9A23B" className="mt-12" />
      ) : (
        <FlatList
          data={cases ?? []}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 pb-28 pt-4"
          refreshing={isRefetching}
          onRefresh={refetch}
          ListEmptyComponent={
            <EmptyState title={t('explore.empty')} icon="search-outline" />
          }
          renderItem={({ item }) => (
            <ExploreCaseCard caseItem={item} />
          )}
        />
      )}
    </SafeAreaView>
  );
}
