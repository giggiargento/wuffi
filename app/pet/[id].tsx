import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Card, StatusBadge, PrimaryButton } from '@/components';
import { usePet } from '@/hooks/usePets';

export default function PetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const router = useRouter();
  const { data: pet, isLoading } = usePet(id);

  if (isLoading || !pet) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color="#F9A23B" size="large" />
      </View>
    );
  }

  const photo = pet.photoUrls[0];

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: pet.name,
          headerStyle: { backgroundColor: '#FFF4EA' },
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push(`/pet/${id}/edit`)} className="mr-2">
              <Ionicons name="create-outline" size={24} color="#1F2937" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView className="flex-1 bg-background" contentContainerClassName="pb-8">
        {photo ? (
          <Image source={{ uri: photo }} className="h-64 w-full" contentFit="cover" />
        ) : (
          <View className="h-64 w-full items-center justify-center bg-lavender">
            <Ionicons name="paw" size={64} color="#1F2937" />
          </View>
        )}

        <View className="px-4 pt-4">
          <StatusBadge status={pet.status} caseType="lost" />
          <Text className="mt-3 text-2xl font-bold text-text">{pet.name}</Text>
          <Text className="text-base text-muted">
            {t(`pet.species.${pet.species}`)}
            {pet.breed ? ` · ${pet.breed}` : ''}
            {pet.sex ? ` · ${t(`pet.sex.${pet.sex}`)}` : ''}
          </Text>

          <Card className="mt-4">
            <Text className="mb-2 font-semibold text-text">{t('pet.info')}</Text>
            {pet.color ? (
              <Text className="text-muted">{t('pet.form.color')}: {pet.color}</Text>
            ) : null}
            {pet.ageMonths ? (
              <Text className="text-muted">{t('pet.form.ageMonths')}: {pet.ageMonths}</Text>
            ) : null}
            {pet.weightKg ? (
              <Text className="text-muted">{t('pet.form.weightKg')}: {pet.weightKg}</Text>
            ) : null}
            {pet.personalityNotes ? (
              <Text className="mt-2 text-muted">{pet.personalityNotes}</Text>
            ) : null}
          </Card>

          {(pet.medicalNotes || pet.allergies?.length) ? (
            <Card className="mt-3">
              <Text className="mb-2 font-semibold text-text">{t('pet.health')}</Text>
              {pet.medicalNotes ? (
                <Text className="text-muted">{pet.medicalNotes}</Text>
              ) : null}
              {pet.allergies?.length ? (
                <Text className="mt-1 text-muted">
                  {t('pet.form.allergies')}: {pet.allergies.join(', ')}
                </Text>
              ) : null}
            </Card>
          ) : null}

          {pet.status === 'safe' ? (
            <PrimaryButton
              title={t('pet.reportLost')}
              onPress={() => router.push(`/create/lost/1?petId=${pet.id}`)}
              className="mt-6"
            />
          ) : null}
        </View>
      </ScrollView>
    </>
  );
}
