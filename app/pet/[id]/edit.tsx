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
import { Input, PrimaryButton, PetAgeInput, SpeciesSelector, Button, ConfirmDialog, InlineError } from '@/components';
import { parsePetAgeInput, petSchema } from '@/schemas';
import { usePet, useUpdatePet, useAddPetPhoto, useDeletePet } from '@/hooks/usePets';
import { useMyCases } from '@/hooks/useCases';
import { useAuthStore } from '@/stores/authStore';
import { uploadFile, petPhotoPath } from '@/services/firebase/storage';
import { DEFAULT_PET_SPECIES, SEX_OPTIONS } from '@/constants';
import { monthsToAgeFields, MAX_PET_AGE_YEARS } from '@/utils/petAge';
import { countActiveCasesForPet } from '@/utils/caseStatus';
import type { PetSpecies, Sex } from '@/types';

export default function EditPetScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const router = useRouter();
  const { data: pet } = usePet(id);
  const updatePet = useUpdatePet(id);
  const addPhoto = useAddPetPhoto(id);
  const deletePetMutation = useDeletePet(id);
  const { data: myCases } = useMyCases();
  const currentUserId = useAuthStore((s) => s.firebaseUser?.uid);

  const isOwner = Boolean(pet && currentUserId && pet.ownerId === currentUserId);
  const activeLinkedCaseCount = myCases ? countActiveCasesForPet(myCases, id) : 0;

  const [name, setName] = useState('');
  const [species, setSpecies] = useState<PetSpecies>(DEFAULT_PET_SPECIES);
  const [breed, setBreed] = useState('');
  const [sex, setSex] = useState<Sex>('unknown');
  const [color, setColor] = useState('');
  const [ageYears, setAgeYears] = useState('');
  const [ageMonthsPart, setAgeMonthsPart] = useState('');
  const [ageYearsError, setAgeYearsError] = useState<string>();
  const [ageMonthsError, setAgeMonthsError] = useState<string>();
  const [weightKg, setWeightKg] = useState('');
  const [personalityNotes, setPersonalityNotes] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [allergies, setAllergies] = useState('');
  const [microchipId, setMicrochipId] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (!pet) return;
    setName(pet.name);
    setSpecies(pet.species);
    setBreed(pet.breed ?? '');
    setSex(pet.sex);
    setColor(pet.color ?? '');
    const ageFields = monthsToAgeFields(pet.ageMonths);
    setAgeYears(ageFields.years);
    setAgeMonthsPart(ageFields.months);
    setWeightKg(pet.weightKg?.toString() ?? '');
    setPersonalityNotes(pet.personalityNotes ?? '');
    setMedicalNotes(pet.medicalNotes ?? '');
    setAllergies(pet.allergies?.join(', ') ?? '');
    setMicrochipId(pet.microchipId ?? '');
  }, [pet]);

  const handleSave = async () => {
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
        ageMonths: ageResult.data.ageMonths,
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

  const performDelete = async () => {
    if (!isOwner) {
      setDeleteError(t('pet.delete.unauthorized'));
      setShowDeleteConfirm(false);
      return;
    }

    try {
      setDeleteError(null);
      setLoading(true);
      await deletePetMutation.mutateAsync();
      setShowDeleteConfirm(false);
      router.replace('/(tabs)');
    } catch (error) {
      const detail =
        error instanceof Error && error.message === 'Unauthorized'
          ? t('pet.delete.unauthorized')
          : t('pet.delete.error');
      setDeleteError(detail);
      setShowDeleteConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePress = () => {
    setDeleteError(null);

    if (!isOwner) {
      setDeleteError(t('pet.delete.unauthorized'));
      return;
    }

    setShowDeleteConfirm(true);
  };

  const deleteConfirmMessage =
    activeLinkedCaseCount > 0
      ? t('pet.delete.confirmMessageWithCases', { count: activeLinkedCaseCount })
      : t('pet.delete.confirmMessage');

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

          {isOwner ? (
            <>
              <Button
                title={t('pet.delete.action')}
                variant="destructive"
                onPress={handleDeletePress}
                loading={deletePetMutation.isPending}
                disabled={loading && !showDeleteConfirm}
                className="mt-4 mb-8"
              />
              {deleteError ? <InlineError message={deleteError} className="mb-8" /> : null}
            </>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>

      <ConfirmDialog
        visible={showDeleteConfirm}
        title={t('pet.delete.confirmTitle')}
        message={deleteConfirmMessage}
        confirmLabel={t('pet.delete.confirmAction')}
        cancelLabel={t('common.cancel')}
        destructive
        loading={deletePetMutation.isPending}
        onConfirm={performDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}
