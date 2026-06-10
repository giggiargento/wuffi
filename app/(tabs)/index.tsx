import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PetCard, CaseCard, EmptyState, Card } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { usePets } from '@/hooks/usePets';
import { useNearbyCases } from '@/hooks/useCases';
import { useFavorites } from '@/hooks/useFavorites';

const QUICK_ACTIONS = [
  { key: 'addPet', icon: 'paw' as const, route: '/create/personal/1', color: 'bg-lavender' },
  { key: 'reportLost', icon: 'alert-circle' as const, route: '/create/lost/1', color: 'bg-primary' },
  { key: 'addFound', icon: 'search' as const, route: '/create/found/1', color: 'bg-sky' },
  { key: 'addAdoption', icon: 'heart' as const, route: '/create/adoption/1', color: 'bg-mint' },
  { key: 'addTransit', icon: 'car' as const, route: '/create/transit/1', color: 'bg-lavender' },
];

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { userProfile } = useAuth();
  const { data: pets, isLoading: petsLoading } = usePets();
  const { data: nearbyCases } = useNearbyCases();
  const { data: favorites } = useFavorites();

  const name = userProfile?.displayName ?? t('home.greetingGuest');

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1 px-4" contentContainerClassName="pb-28">
        <View className="mb-6 pt-2">
          <Text className="text-2xl font-bold text-text">
            {t('home.greeting', { name })}
          </Text>
          {userProfile?.city ? (
            <Text className="mt-1 text-sm text-muted">
              {[userProfile.neighborhood, userProfile.city, userProfile.province]
                .filter(Boolean)
                .join(', ')}
            </Text>
          ) : null}
        </View>

        <Text className="mb-3 text-lg font-bold text-text">{t('home.myPets')}</Text>
        {petsLoading ? (
          <ActivityIndicator color="#F9A23B" className="my-8" />
        ) : pets && pets.length > 0 ? (
          pets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              onPress={() => router.push(`/pet/${pet.id}`)}
            />
          ))
        ) : (
          <EmptyState
            title={t('home.empty.title')}
            subtitle={t('home.empty.subtitle')}
            ctaLabel={t('home.empty.cta')}
            onCta={() => router.push('/create/personal/1')}
          />
        )}

        <Text className="mb-3 mt-6 text-lg font-bold text-text">
          {t('home.quickActionsTitle')}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.key}
              onPress={() => router.push(action.route as never)}
              className="mr-3"
            >
              <Card className={`w-28 items-center ${action.color} p-3`}>
                <Ionicons name={action.icon} size={28} color="#1F2937" />
                <Text className="mt-2 text-center text-xs font-medium text-text">
                  {t(`home.quickActions.${action.key}`)}
                </Text>
              </Card>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {nearbyCases && nearbyCases.length > 0 ? (
          <>
            <Text className="mb-3 text-lg font-bold text-text">{t('home.nearbyAlerts')}</Text>
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
          <>
            <View className="mb-3 mt-4 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-text">{t('home.recentFavorites')}</Text>
              <TouchableOpacity onPress={() => router.push('/favorites')}>
                <Text className="text-sm font-medium text-primary">{t('common.seeAll')}</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-sm text-muted">
              {t('favorites.title')}: {favorites.length}
            </Text>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
