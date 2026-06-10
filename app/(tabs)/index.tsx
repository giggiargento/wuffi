import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  PetCard,
  CaseCard,
  EmptyState,
  ScreenHeader,
  SectionHeader,
  QuickActionCard,
  LoadingSpinner,
} from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { usePets } from '@/hooks/usePets';
import { useNearbyCases } from '@/hooks/useCases';
import { useFavorites } from '@/hooks/useFavorites';

const QUICK_ACTIONS = [
  { key: 'addPet', icon: 'paw' as const, route: '/create/personal/1', color: 'lavender' as const },
  { key: 'reportLost', icon: 'alert-circle' as const, route: '/create/lost/1', color: 'primary' as const, featured: true },
  { key: 'addFound', icon: 'search' as const, route: '/create/found/1', color: 'sky' as const },
  { key: 'addAdoption', icon: 'heart' as const, route: '/create/adoption/1', color: 'mint' as const },
  { key: 'addTransit', icon: 'car' as const, route: '/create/transit/1', color: 'lavender' as const },
];

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { userProfile } = useAuth();
  const {
    data: pets,
    isLoading: petsLoading,
    isError: petsError,
    refetch: refetchPets,
  } = usePets();
  const { data: nearbyCases } = useNearbyCases();
  const { data: favorites } = useFavorites();

  const name = userProfile?.displayName ?? t('home.greetingGuest');
  const location = userProfile?.city
    ? [userProfile.neighborhood, userProfile.city, userProfile.province].filter(Boolean).join(', ')
    : undefined;
  const avatarInitial = userProfile?.displayName?.charAt(0)?.toUpperCase();

  const featuredAction = QUICK_ACTIONS.find((a) => a.featured);
  const regularActions = QUICK_ACTIONS.filter((a) => !a.featured);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1 px-4" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title={t('home.greeting', { name })}
          subtitle={location}
          avatarInitial={avatarInitial}
          showNotification
        />

        <SectionHeader title={t('home.myPets')} />
        {petsLoading ? (
          <LoadingSpinner />
        ) : petsError ? (
          <View className="mb-6">
            <EmptyState
              title={t('home.petsLoadError')}
              subtitle={t('home.petsLoadErrorSubtitle')}
              ctaLabel={t('common.retry')}
              onCta={() => refetchPets()}
              accent="pink"
            />
          </View>
        ) : pets && pets.length > 0 ? (
          pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} onPress={() => router.push(`/pet/${pet.id}`)} />
          ))
        ) : (
          <View className="mb-6">
            <EmptyState
              title={t('home.empty.title')}
              subtitle={t('home.empty.subtitle')}
              ctaLabel={t('home.empty.cta')}
              onCta={() => router.push('/create/personal/1')}
              accent="lavender"
            />
          </View>
        )}

        <SectionHeader title={t('home.quickActionsTitle')} />
        {featuredAction ? (
          <QuickActionCard
            label={t(`home.quickActions.${featuredAction.key}`)}
            description={t('create.lostPetDesc')}
            icon={featuredAction.icon}
            featured
            onPress={() => router.push(featuredAction.route as never)}
          />
        ) : null}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8">
          {regularActions.map((action) => (
            <QuickActionCard
              key={action.key}
              label={t(`home.quickActions.${action.key}`)}
              icon={action.icon}
              color={action.color}
              onPress={() => router.push(action.route as never)}
            />
          ))}
        </ScrollView>

        {nearbyCases && nearbyCases.length > 0 ? (
          <>
            <SectionHeader title={t('home.nearbyAlerts')} />
            {nearbyCases.slice(0, 3).map((c) => (
              <CaseCard
                key={c.id}
                caseItem={c}
                onPress={() => router.push(`/case/${c.id}`)}
              />
            ))}
          </>
        ) : null}

        {favorites && favorites.length > 0 ? (
          <View className="mt-2">
            <SectionHeader
              title={t('home.recentFavorites')}
              actionLabel={t('common.seeAll')}
              onAction={() => router.push('/favorites')}
            />
            <View className="rounded-3xl border-2 border-border bg-cream p-4">
              <Text className="text-sm font-medium text-muted">
                {t('home.favoritesCount', { title: t('favorites.title'), count: favorites.length })}
              </Text>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
