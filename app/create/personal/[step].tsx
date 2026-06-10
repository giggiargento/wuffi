import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Input, PrimaryButton, PetAgeInput, SpeciesSelector } from '@/components';
import { parsePetAgeInput, petSchema } from '@/schemas';
import { useCreatePet } from '@/hooks/usePets';
import { DEFAULT_PET_SPECIES, SEX_OPTIONS } from '@/constants';
import { MAX_PET_AGE_YEARS } from '@/utils/petAge';
import type { PetSpecies, Sex } from '@/types';

export default function CreatePersonalPetScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const createPet = useCreatePet();

  const [name, setName] = useState('');
  const [species, setSpecies] = useState<PetSpecies>(DEFAULT_PET_SPECIES);
  const [breed, setBreed] = useState('');
  const [sex, setSex] = useState<Sex>('unknown');
  const [color, setColor] = useState('');
  const [ageYears, setAgeYears] = useState('');
  const [ageMonthsPart, setAgeMonthsPart] = useState('');
  const [ageYearsError, setAgeYearsError] = useState<string>();
  const [ageMonthsError, setAgeMonthsError] = useState<string>();
  const [personalityNotes, setPersonalityNotes] = useState('');

  const handleCreate = async () => {
    setAgeYearsError(undefined);
    setAgeMonthsError(undefined);

    const ageResult = parsePetAgeInput(ageYears, ageMonthsPart);
    if (!ageResult.success) {
      const issue = ageResult.error.issues[0];
      const message = t(`pet.age.errors.${issue.message}`, { maxYears: MAX_PET_AGE_YEARS });
      if (issue.path[0] === 'ageMonthsPart') {
        setAgeMonthsError(message);
      } else {
        setAgeYearsError(message);
      }
      return;
    }

    const result = petSchema.safeParse({
      name,
      species,
      breed: breed || undefined,
      sex,
      color: color || undefined,
      ageMonths: ageResult.data.ageMonths,
      personalityNotes: personalityNotes || undefined,
    });

    if (!result.success) {
      Alert.alert(t('common.error'), t('common.required'));
      return;
    }

    try {
      const pet = await createPet.mutateAsync({
        name,
        species,
        breed: breed || undefined,
        sex,
        color: color || undefined,
        ageMonths: ageResult.data.ageMonths,
        personalityNotes: personalityNotes || undefined,
      });
      Alert.alert(t('pet.created'));
      router.replace(`/pet/${pet.id}`);
    } catch (error) {
      const detail =
        error instanceof Error && error.message !== 'Not authenticated'
          ? error.message
          : t('pet.saveError');
      Alert.alert(t('common.error'), detail);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: t('pet.createTitle') }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-background"
      >
        <ScrollView className="flex-1 px-4 py-4" keyboardShouldPersistTaps="handled">
          <Text className="mb-4 text-sm text-muted">{t('create.step', { current: 1, total: 1 })}</Text>
          <Input label={t('pet.form.name')} value={name} onChangeText={setName} />

          <SpeciesSelector value={species} onChange={setSpecies} />

          <Input label={t('pet.form.breed')} value={breed} onChangeText={setBreed} />

          <Text className="mb-2 text-sm font-medium text-text">{t('pet.form.sex')}</Text>
          <View className="mb-4 flex-row flex-wrap">
            {SEX_OPTIONS.map((s) => (
              <TouchableOpacity
                key={s}
                onPress={() => setSex(s)}
                className={`mb-2 mr-2 rounded-full border-2 border-border px-4 py-2 ${
                  sex === s ? 'bg-lavender' : 'bg-card'
                }`}
              >
                <Text className="text-sm font-medium">{t(`pet.sex.${s}`)}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Input label={t('pet.form.color')} value={color} onChangeText={setColor} />
          <PetAgeInput
            years={ageYears}
            months={ageMonthsPart}
            onChangeYears={setAgeYears}
            onChangeMonths={setAgeMonthsPart}
            yearsError={ageYearsError}
            monthsError={ageMonthsError}
          />
          <Input
            label={t('pet.form.personality')}
            value={personalityNotes}
            onChangeText={setPersonalityNotes}
            multiline
          />

          <PrimaryButton
            title={t('common.save')}
            onPress={handleCreate}
            loading={createPet.isPending}
            className="mt-4"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
