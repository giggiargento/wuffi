import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import {
  Card,
  Badge,
  Button,
  InfoChip,
  InfoChipGrid,
  LoadingSpinner,
  IconButton,
} from '@/components';
import { shadows } from '@/components';
import { usePet } from '@/hooks/usePets';
import { formatPetAge } from '@/utils/petAge';

export default function PetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const router = useRouter();
  const { data: pet, isLoading } = usePet(id);

  if (isLoading || !pet) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <LoadingSpinner />
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
          headerShadowVisible: false,
          headerRight: () => (
            <IconButton
              icon="create-outline"
              onPress={() => router.push(`/pet/${id}/edit`)}
              className="mr-2"
            />
          ),
        }}
      />
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="pb-10"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 pt-4">
          <View
            className="overflow-hidden rounded-3xl border-2 border-border bg-card"
            style={shadows.float}
          >
            {photo ? (
              <Image source={{ uri: photo }} className="h-72 w-full" contentFit="cover" />
            ) : (
              <View className="h-72 w-full items-center justify-center bg-lavender">
                <Ionicons name="paw" size={72} color="#1F2937" />
              </View>
            )}
          </View>
        </View>

        <View className="px-4 pt-5">
          <Badge status={pet.status} caseType="lost" size="md" />
          <Text className="mt-4 text-3xl font-bold text-text">{pet.name}</Text>
          <Text className="mt-1 text-base text-muted">
            {t(`pet.species.${pet.species}`)}
            {pet.breed ? ` · ${pet.breed}` : ''}
            {pet.sex ? ` · ${t(`pet.sex.${pet.sex}`)}` : ''}
          </Text>

          <InfoChipGrid>
            {pet.ageMonths ? (
              <InfoChip
                label={t('pet.age.label')}
                value={formatPetAge(t, pet.ageMonths) ?? ''}
                icon="calendar-outline"
                color="cream"
              />
            ) : null}
            {pet.breed ? (
              <InfoChip
                label={t('pet.form.breed')}
                value={pet.breed}
                icon="ribbon-outline"
                color="sky"
              />
            ) : null}
            {pet.sex ? (
              <InfoChip
                label={t('pet.form.sex')}
                value={t(`pet.sex.${pet.sex}`)}
                icon="male-female-outline"
                color="lavender"
              />
            ) : null}
            {pet.weightKg ? (
              <InfoChip
                label={t('pet.form.weightKg')}
                value={pet.weightKg}
                icon="fitness-outline"
                color="mint"
              />
            ) : null}
          </InfoChipGrid>

          {(pet.color || pet.personalityNotes) ? (
            <Card className="mt-5" variant="floating">
              <Text className="mb-3 text-lg font-bold text-text">{t('pet.info')}</Text>
              {pet.color ? (
                <Text className="text-base text-muted">
                  {t('pet.detail.colorValue', { value: pet.color })}
                </Text>
              ) : null}
              {pet.personalityNotes ? (
                <Text className="mt-2 text-base leading-6 text-muted">{pet.personalityNotes}</Text>
              ) : null}
            </Card>
          ) : null}

          {(pet.medicalNotes || pet.allergies?.length) ? (
            <Card className="mt-4" variant="floating" pastel="pink">
              <Text className="mb-3 text-lg font-bold text-text">{t('pet.health')}</Text>
              {pet.medicalNotes ? (
                <Text className="text-base leading-6 text-muted">{pet.medicalNotes}</Text>
              ) : null}
              {pet.allergies?.length ? (
                <Text className="mt-2 text-base text-muted">
                  {t('pet.detail.allergiesValue', { value: pet.allergies.join(', ') })}
                </Text>
              ) : null}
            </Card>
          ) : null}

          {pet.status === 'safe' ? (
            <Button
              title={t('pet.reportLost')}
              onPress={() => router.push(`/create/lost/1?petId=${pet.id}`)}
              className="mt-8"
            />
          ) : null}
        </View>
      </ScrollView>
    </>
  );
}
