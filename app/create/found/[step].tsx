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
import { ARGENTINA_PROVINCES, SPECIES } from '@/constants';
import { getCurrentLocation, DEFAULT_LOCATION } from '@/utils/location';
import type { CreateFoundCaseInput, Species, TemporaryCare } from '@/types';

const CARE_OPTIONS: TemporaryCare[] = ['with_finder', 'shelter', 'street', 'vet', 'foster'];

export default function CreateFoundCaseScreen() {
  const { step } = useLocalSearchParams<{ step: string }>();
  const { t } = useTranslation();
  const router = useRouter();
  const createCase = useCreateCase();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [petName, setPetName] = useState('');
  const [species, setSpecies] = useState<Species>('dog');
  const [province, setProvince] = useState('Ciudad Autónoma de Buenos Aires');
  const [city, setCity] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [phone, setPhone] = useState('');
  const [temporaryCare, setTemporaryCare] = useState<TemporaryCare>('with_finder');
  const [location, setLocation] = useState(DEFAULT_LOCATION);

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

    const input: CreateFoundCaseInput = {
      caseType: 'found',
      petSnapshot: { name: petName, species, photoUrls: [] },
      title,
      description,
      location,
      province,
      city,
      neighborhood: neighborhood || undefined,
      foundAt: new Date(),
      foundLocation: location,
      temporaryCare,
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
      <Stack.Screen options={{ title: t('create.foundPet') }} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-background">
        <ScrollView className="flex-1 px-4 py-4" keyboardShouldPersistTaps="handled">
          <Input label={t('pet.form.name')} value={petName} onChangeText={setPetName} />
          <Input label={t('create.caseTitle')} value={title} onChangeText={setTitle} />
          <Input label={t('case.description')} value={description} onChangeText={setDescription} multiline />
          <Input label={t('explore.city')} value={city} onChangeText={setCity} />
          <Input label={t('explore.neighborhood')} value={neighborhood} onChangeText={setNeighborhood} />
          <Input label={t('case.contact.call')} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

          <Text className="mb-2 mt-2 text-sm font-medium text-text">{t('explore.province')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            {ARGENTINA_PROVINCES.slice(0, 4).map((p) => (
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

          <PrimaryButton title={t('create.publish')} onPress={handlePublish} loading={createCase.isPending} className="mt-4" />
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
