import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Input, PrimaryButton } from '@/components';
import { useCreateCase } from '@/hooks/useCases';
import { usePet } from '@/hooks/usePets';
import { ARGENTINA_PROVINCES, SPECIES } from '@/constants';
import { getCurrentLocation, DEFAULT_LOCATION, type LocationResult } from '@/utils/location';
import type { CreateLostCaseInput, Species } from '@/types';

export default function CreateLostCaseScreen() {
  const { step, petId } = useLocalSearchParams<{ step: string; petId?: string }>();
  const { t } = useTranslation();
  const router = useRouter();
  const createCase = useCreateCase();
  const { data: existingPet } = usePet(petId ?? '');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [petName, setPetName] = useState('');
  const [species, setSpecies] = useState<Species>('dog');
  const [province, setProvince] = useState('Ciudad Autónoma de Buenos Aires');
  const [city, setCity] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState<LocationResult>(DEFAULT_LOCATION);

  useEffect(() => {
    if (existingPet) {
      setPetName(existingPet.name);
      setSpecies(existingPet.species);
      setTitle(`${existingPet.name} - ${t('explore.lost')}`);
    }
  }, [existingPet, t]);

  useEffect(() => {
    getCurrentLocation().then((loc) => {
      if (loc) setLocation(loc);
    });
  }, []);

  const handlePublish = async () => {
    if (!title || !description || !petName || !city) {
      Alert.alert(t('common.error'), t('common.required'));
      return;
    }

    const input: CreateLostCaseInput = {
      caseType: 'lost',
      petId: petId ?? undefined,
      petSnapshot: {
        name: petName,
        species,
        photoUrls: existingPet?.photoUrls ?? [],
        breed: existingPet?.breed,
        sex: existingPet?.sex,
      },
      title,
      description,
      location,
      province,
      city,
      neighborhood: neighborhood || undefined,
      addressText: location.addressText,
      lastSeenAt: new Date(),
      lastSeenLocation: location,
      contact: {
        showPhone: Boolean(phone),
        showWhatsApp: Boolean(phone),
        phone: phone || undefined,
        whatsApp: phone || undefined,
        preferredMethod: 'whatsapp',
      },
    };

    try {
      const created = await createCase.mutateAsync(input);
      Alert.alert(t('create.published'));
      router.replace(`/case/${created.id}`);
    } catch {
      Alert.alert(t('common.error'), t('common.error'));
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: t('create.lostPet') }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-background"
      >
        <ScrollView className="flex-1 px-4 py-4" keyboardShouldPersistTaps="handled">
          <Text className="mb-4 text-sm text-muted">
            {t('create.step', { current: step ?? '1', total: 1 })}
          </Text>

          <Input label={t('pet.form.name')} value={petName} onChangeText={setPetName} />
          <Input label={t('create.caseTitle')} value={title} onChangeText={setTitle} />
          <Input
            label={t('case.description')}
            value={description}
            onChangeText={setDescription}
            multiline
          />

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

          <Text className="mb-2 text-sm font-medium text-text">{t('explore.province')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            {ARGENTINA_PROVINCES.slice(0, 6).map((p) => (
              <TouchableOpacity
                key={p}
                onPress={() => setProvince(p)}
                className={`mr-2 rounded-full border-2 border-border px-3 py-2 ${
                  province === p ? 'bg-sky' : 'bg-card'
                }`}
              >
                <Text className="text-xs font-medium">{p}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Input label={t('explore.city')} value={city} onChangeText={setCity} />
          <Input
            label={t('explore.neighborhood')}
            value={neighborhood}
            onChangeText={setNeighborhood}
          />
          <Input label={t('case.contact.call')} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

          <PrimaryButton
            title={t('create.publish')}
            onPress={handlePublish}
            loading={createCase.isPending}
            className="mt-4"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
