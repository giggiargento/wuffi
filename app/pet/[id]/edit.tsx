import { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import { Input, PrimaryButton } from '@/components';
import { petSchema } from '@/schemas';
import { usePet, useUpdatePet, useAddPetPhoto } from '@/hooks/usePets';
import { uploadFile, petPhotoPath } from '@/services/firebase/storage';
import { SPECIES, SEX_OPTIONS } from '@/constants';
import type { Species, Sex } from '@/types';

export default function EditPetScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const router = useRouter();
  const { data: pet } = usePet(id);
  const updatePet = useUpdatePet(id);
  const addPhoto = useAddPetPhoto(id);

  const [name, setName] = useState('');
  const [species, setSpecies] = useState<Species>('dog');
  const [breed, setBreed] = useState('');
  const [sex, setSex] = useState<Sex>('unknown');
  const [color, setColor] = useState('');
  const [ageMonths, setAgeMonths] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [personalityNotes, setPersonalityNotes] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [allergies, setAllergies] = useState('');
  const [microchipId, setMicrochipId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!pet) return;
    setName(pet.name);
    setSpecies(pet.species);
    setBreed(pet.breed ?? '');
    setSex(pet.sex);
    setColor(pet.color ?? '');
    setAgeMonths(pet.ageMonths?.toString() ?? '');
    setWeightKg(pet.weightKg?.toString() ?? '');
    setPersonalityNotes(pet.personalityNotes ?? '');
    setMedicalNotes(pet.medicalNotes ?? '');
    setAllergies(pet.allergies?.join(', ') ?? '');
    setMicrochipId(pet.microchipId ?? '');
  }, [pet]);

  const handleSave = async () => {
    const result = petSchema.safeParse({
      name,
      species,
      breed: breed || undefined,
      sex,
      color: color || undefined,
      ageMonths: ageMonths ? Number(ageMonths) : undefined,
      weightKg: weightKg ? Number(weightKg) : undefined,
      personalityNotes: personalityNotes || undefined,
      medicalNotes: medicalNotes || undefined,
      allergies: allergies || undefined,
      microchipId: microchipId || undefined,
    });

    if (!result.success) {
      Alert.alert(t('common.error'), t('common.required'));
      return;
    }

    try {
      setLoading(true);
      await updatePet.mutateAsync({
        name,
        species,
        breed: breed || undefined,
        sex,
        color: color || undefined,
        ageMonths: ageMonths ? Number(ageMonths) : undefined,
        weightKg: weightKg ? Number(weightKg) : undefined,
        personalityNotes: personalityNotes || undefined,
        medicalNotes: medicalNotes || undefined,
        allergies: allergies || undefined,
        microchipId: microchipId || undefined,
      });
      Alert.alert(t('pet.updated'));
      router.back();
    } catch {
      Alert.alert(t('common.error'), t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) return;

    try {
      setLoading(true);
      const asset = result.assets[0];
      const response = await fetch(asset.uri);
      const blob = await response.blob();
      const fileId = Date.now().toString();
      const url = await uploadFile(petPhotoPath(id, fileId), blob);
      await addPhoto.mutateAsync(url);
    } catch {
      Alert.alert(t('common.error'), t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: t('pet.editTitle'),
          headerStyle: { backgroundColor: '#FFF4EA' },
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-background"
      >
        <ScrollView className="flex-1 px-4 py-4" keyboardShouldPersistTaps="handled">
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
            label={t('pet.form.weightKg')}
            value={weightKg}
            onChangeText={setWeightKg}
            keyboardType="decimal-pad"
          />
          <Input
            label={t('pet.form.personality')}
            value={personalityNotes}
            onChangeText={setPersonalityNotes}
            multiline
          />
          <Input
            label={t('pet.form.medicalNotes')}
            value={medicalNotes}
            onChangeText={setMedicalNotes}
            multiline
          />
          <Input
            label={t('pet.form.allergies')}
            value={allergies}
            onChangeText={setAllergies}
          />
          <Input
            label={t('pet.form.microchip')}
            value={microchipId}
            onChangeText={setMicrochipId}
          />

          <PrimaryButton
            title={t('pet.form.addPhoto')}
            variant="secondary"
            onPress={handleAddPhoto}
            className="mb-4"
          />
          <PrimaryButton title={t('common.save')} onPress={handleSave} loading={loading} />
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
