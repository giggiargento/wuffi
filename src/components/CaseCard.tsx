import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Card } from './ui/Card';
import { StatusBadge } from './ui/StatusBadge';
import type { Case } from '@/types';

interface CaseCardProps {
  caseItem: Case;
  onPress?: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
}

export function CaseCard({ caseItem, onPress, onFavorite, isFavorite }: CaseCardProps) {
  const { t } = useTranslation();
  const photo = caseItem.petSnapshot.photoUrls[0];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Card className="mb-3 flex-row overflow-hidden p-0">
        {photo ? (
          <Image source={{ uri: photo }} className="h-28 w-28" contentFit="cover" />
        ) : (
          <View className="h-28 w-28 items-center justify-center bg-sky">
            <Ionicons name="paw" size={32} color="#1F2937" />
          </View>
        )}
        <View className="flex-1 p-3">
          <View className="mb-1 flex-row items-start justify-between">
            <StatusBadge status={caseItem.status} caseType={caseItem.caseType} />
            {onFavorite ? (
              <TouchableOpacity onPress={onFavorite} hitSlop={8}>
                <Ionicons
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={22}
                  color="#F9A23B"
                />
              </TouchableOpacity>
            ) : null}
          </View>
          <Text className="text-base font-bold text-text" numberOfLines={1}>
            {caseItem.title}
          </Text>
          <Text className="text-sm text-muted" numberOfLines={1}>
            {caseItem.petSnapshot.name} · {t(`pet.species.${caseItem.petSnapshot.species}`)}
          </Text>
          {caseItem.city ? (
            <Text className="mt-1 text-xs text-muted" numberOfLines={1}>
              {[caseItem.neighborhood, caseItem.city, caseItem.province]
                .filter(Boolean)
                .join(', ')}
            </Text>
          ) : null}
        </View>
      </Card>
    </TouchableOpacity>
  );
}
