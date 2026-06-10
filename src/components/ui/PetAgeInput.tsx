import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Input } from './Input';

interface PetAgeInputProps {
  years: string;
  months: string;
  onChangeYears: (value: string) => void;
  onChangeMonths: (value: string) => void;
  yearsError?: string;
  monthsError?: string;
}

export function PetAgeInput({
  years,
  months,
  onChangeYears,
  onChangeMonths,
  yearsError,
  monthsError,
}: PetAgeInputProps) {
  const { t } = useTranslation();

  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-semibold text-text">{t('pet.age.label')}</Text>
      <View className="flex-row gap-3">
        <View className="flex-1">
          <Input
            label={t('pet.age.yearsLabel')}
            value={years}
            onChangeText={onChangeYears}
            keyboardType="number-pad"
            containerClassName="mb-0"
            error={yearsError}
          />
        </View>
        <View className="flex-1">
          <Input
            label={t('pet.age.monthsLabel')}
            value={months}
            onChangeText={onChangeMonths}
            keyboardType="number-pad"
            containerClassName="mb-0"
            error={monthsError}
          />
        </View>
      </View>
    </View>
  );
}
