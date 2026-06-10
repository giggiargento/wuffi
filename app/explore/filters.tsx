import { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Input, PrimaryButton, Chip, ChipRow } from '@/components';
import { useExploreStore } from '@/stores/exploreStore';
import { ARGENTINA_PROVINCES, SPECIES } from '@/constants';

export default function ExploreFiltersScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const filters = useExploreStore((s) => s.filters);
  const setFilters = useExploreStore((s) => s.setFilters);
  const resetFilters = useExploreStore((s) => s.resetFilters);

  const [province, setProvince] = useState(filters.province ?? '');
  const [city, setCity] = useState(filters.city ?? '');
  const [neighborhood, setNeighborhood] = useState(filters.neighborhood ?? '');
  const [species, setSpecies] = useState(filters.species ?? '');

  const handleApply = () => {
    setFilters({
      province: province || undefined,
      city: city || undefined,
      neighborhood: neighborhood || undefined,
      species: species || undefined,
    });
    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: t('explore.filters'),
          headerStyle: { backgroundColor: '#FFF4EA' },
        }}
      />
      <ScrollView className="flex-1 bg-background px-4 py-4">
        <Text className="mb-2 text-sm font-medium text-text">{t('explore.province')}</Text>
        <ChipRow>
          {ARGENTINA_PROVINCES.slice(0, 8).map((p) => (
            <Chip
              key={p}
              label={p}
              selected={province === p}
              onPress={() => setProvince(province === p ? '' : p)}
              color="sky"
            />
          ))}
        </ChipRow>

        <Input label={t('explore.city')} value={city} onChangeText={setCity} />
        <Input label={t('explore.neighborhood')} value={neighborhood} onChangeText={setNeighborhood} />

        <Text className="mb-2 mt-2 text-sm font-medium text-text">{t('explore.species')}</Text>
        <ChipRow>
          {SPECIES.map((s) => (
            <Chip
              key={s}
              label={t(`pet.species.${s}`)}
              selected={species === s}
              onPress={() => setSpecies(species === s ? '' : s)}
              color="lavender"
            />
          ))}
        </ChipRow>

        <PrimaryButton title={t('explore.applyFilters')} onPress={handleApply} className="mt-4" />
        <TouchableOpacity onPress={() => { resetFilters(); router.back(); }} className="mt-4 items-center">
          <Text className="font-medium text-primary">{t('explore.clearFilters')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}
