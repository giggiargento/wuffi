import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Linking, Share } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Card, StatusBadge, PrimaryButton } from '@/components';
import { useCase } from '@/hooks/useCases';
import { useIsFavorite, useToggleFavorite } from '@/hooks/useFavorites';
import { useAuthStore } from '@/stores/authStore';
import { CASE_TYPE_COLORS } from '@/constants';

export default function CaseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const router = useRouter();
  const { data: caseItem, isLoading } = useCase(id);
  const userId = useAuthStore((s) => s.firebaseUser?.uid);
  const { data: isFav } = useIsFavorite('case', id);
  const toggleFavorite = useToggleFavorite();

  if (isLoading || !caseItem) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color="#F9A23B" size="large" />
      </View>
    );
  }

  const photo = caseItem.petSnapshot.photoUrls[0];

  const handleWhatsApp = () => {
    const number = caseItem.contact.whatsApp ?? caseItem.contact.phone;
    if (!number) return;
    Linking.openURL(`https://wa.me/${number.replace(/\D/g, '')}`);
  };

  const handleCall = () => {
    if (!caseItem.contact.phone) return;
    Linking.openURL(`tel:${caseItem.contact.phone}`);
  };

  const handleShare = async () => {
    await Share.share({
      message: `WUFFI: ${caseItem.title}\nwuffi://case/${caseItem.id}`,
      url: `wuffi://case/${caseItem.id}`,
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: t(`case.type.${caseItem.caseType}`),
          headerStyle: { backgroundColor: '#FFF4EA' },
          headerRight: () =>
            userId ? (
              <TouchableOpacity
                onPress={() =>
                  toggleFavorite.mutate({
                    targetType: 'case',
                    targetId: caseItem.id,
                    caseType: caseItem.caseType,
                  })
                }
                className="mr-2"
              >
                <Ionicons
                  name={isFav ? 'heart' : 'heart-outline'}
                  size={24}
                  color="#F9A23B"
                />
              </TouchableOpacity>
            ) : null,
        }}
      />
      <ScrollView className="flex-1 bg-background" contentContainerClassName="pb-8">
        {photo ? (
          <Image source={{ uri: photo }} className="h-64 w-full" contentFit="cover" />
        ) : (
          <View
            className="h-64 w-full items-center justify-center"
            style={{ backgroundColor: CASE_TYPE_COLORS[caseItem.caseType] }}
          >
            <Ionicons name="paw" size={64} color="#1F2937" />
          </View>
        )}

        <View className="px-4 pt-4">
          <StatusBadge status={caseItem.status} caseType={caseItem.caseType} />
          <Text className="mt-3 text-2xl font-bold text-text">{caseItem.title}</Text>
          <Text className="mt-1 text-base text-muted">
            {caseItem.petSnapshot.name} · {t(`pet.species.${caseItem.petSnapshot.species}`)}
          </Text>

          <Card className="mt-4">
            <Text className="mb-2 text-sm font-semibold text-text">{t('case.description')}</Text>
            <Text className="text-base text-muted">{caseItem.description}</Text>
          </Card>

          <Card className="mt-3">
            <Text className="mb-2 text-sm font-semibold text-text">{t('case.location')}</Text>
            <Text className="text-base text-muted">
              {[caseItem.addressText, caseItem.neighborhood, caseItem.city, caseItem.province]
                .filter(Boolean)
                .join(', ')}
            </Text>
          </Card>

          <Text className="mb-3 mt-6 text-lg font-bold text-text">{t('case.contact.title')}</Text>
          {caseItem.contact.showWhatsApp && caseItem.contact.whatsApp ? (
            <PrimaryButton
              title={t('case.contact.whatsapp')}
              onPress={handleWhatsApp}
              className="mb-3"
            />
          ) : null}
          {caseItem.contact.showPhone && caseItem.contact.phone ? (
            <PrimaryButton
              title={t('case.contact.call')}
              variant="secondary"
              onPress={handleCall}
              className="mb-3"
            />
          ) : null}
          <PrimaryButton
            title={t('case.contact.share')}
            variant="outline"
            onPress={handleShare}
          />

          {caseItem.caseType === 'lost' ? (
            <PrimaryButton
              title={t('case.reportSighting')}
              variant="secondary"
              onPress={() => router.push(`/case/${id}/sighting`)}
              className="mt-4"
            />
          ) : null}
        </View>
      </ScrollView>
    </>
  );
}
