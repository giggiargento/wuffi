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
import { Input, PrimaryButton } from '@/components';
import { petSchema } from '@/schemas';
import { useCreatePet } from '@/hooks/usePets';
import { SPECIES, SEX_OPTIONS } from '@/constants';
import type { Species, Sex } from '@/types';

export default function CreatePersonalPetScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const createPet = useCreatePet();

  const [name, setName] = useState('');
  const [species, setSpecies] = useState<Species>('dog');
  const [breed, setBreed] = useState('');
  const [sex, setSex] = useState<Sex>('unknown');
  const [color, setColor] = useState('');
  const [ageMonths, setAgeMonths] = useState('');
  const [personalityNotes, setPersonalityNotes] = useState('');

  const handleCreate = async () => {
    const result = petSchema.safeParse({
      name,
      species,
      breed: breed || undefined,
      sex,
      color: color || undefined,
      ageMonths: ageMonths ? Number(ageMonths) : undefined,
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
        ageMonths: ageMonths ? Number(ageMonths) : undefined,
        personalityNotes: personalityNotes || undefined,
      });
      Alert.alert(t('pet.created'));
      router.replace(`/pet/${pet.id}`);
    } catch {
      Alert.alert(t('common.error'), t('common.error'));
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

          <Text className="mb-2 text-sm font-medium text-text">{t('pet.form.species')}</Text>
          <View className="mb-4 flex-row flex-wrap">
            {SPECIES.map((s) => (
              <TouchableOpacity
                key={s}
                onPress={() => setSpecies(s)}
                className={`mb-2 mr-2 rounded-full border-2 border-border px-4 py-2 ${
                  species === s ? 'bg-primary' : 'bg-card'
                }`}
              >
                <Text className="text-sm font-medium">{t(`pet.species.${s}`)}</Text>
              </TouchableOpacity>
            ))}
          </View>

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
          <Input
            label={t('pet.form.ageMonths')}
            value={ageMonths}
            onChangeText={setAgeMonths}
            keyboardType="numeric"
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
