import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card, PetCard, CaseCard, PrimaryButton } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { usePets } from '@/hooks/usePets';
import { useMyCases } from '@/hooks/useCases';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { userProfile, logout } = useAuth();
  const { data: pets, isLoading: petsLoading } = usePets();
  const { data: myCases } = useMyCases();

  const menuItems = [
    { key: 'favorites', icon: 'heart' as const, route: '/favorites' },
    { key: 'settings', icon: 'settings' as const, route: '/settings' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1 px-4" contentContainerClassName="pb-28">
        <View className="mb-6 items-center pt-4">
          <View className="mb-3 h-24 w-24 items-center justify-center rounded-full border-2 border-border bg-lavender">
            <Ionicons name="person" size={48} color="#1F2937" />
          </View>
          <Text className="text-xl font-bold text-text">{userProfile?.displayName}</Text>
          <Text className="text-sm text-muted">{userProfile?.email}</Text>
          {userProfile?.city ? (
            <Text className="mt-1 text-sm text-muted">
              {[userProfile.neighborhood, userProfile.city, userProfile.province]
                .filter(Boolean)
                .join(', ')}
            </Text>
          ) : null}
        </View>

        {menuItems.map((item) => (
          <TouchableOpacity key={item.key} onPress={() => router.push(item.route as never)}>
            <Card className="mb-3 flex-row items-center">
              <Ionicons name={item.icon} size={24} color="#F9A23B" />
              <Text className="ml-3 flex-1 text-base font-medium text-text">
                {t(`profile.${item.key}`)}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#6B7280" />
            </Card>
          </TouchableOpacity>
        ))}

        <Text className="mb-3 mt-4 text-lg font-bold text-text">{t('profile.myPets')}</Text>
        {petsLoading ? (
          <ActivityIndicator color="#F9A23B" />
        ) : (
          pets?.slice(0, 3).map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              onPress={() => router.push(`/pet/${pet.id}`)}
            />
          ))
        )}

        <Text className="mb-3 mt-4 text-lg font-bold text-text">{t('profile.myCases')}</Text>
        {myCases && myCases.length > 0 ? (
          myCases.slice(0, 3).map((c) => (
            <CaseCard
              key={c.id}
              caseItem={c}
              onPress={() => router.push(`/case/${c.id}`)}
            />
          ))
        ) : (
          <Text className="text-sm text-muted">{t('explore.empty')}</Text>
        )}

        <PrimaryButton
          title={t('auth.logout')}
          variant="outline"
          onPress={() => logout()}
          className="mt-8"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
