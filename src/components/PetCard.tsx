import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Card } from './ui/Card';
import { StatusBadge } from './ui/StatusBadge';
import type { Pet } from '@/types';

interface PetCardProps {
  pet: Pet;
  onPress?: () => void;
}

export function PetCard({ pet, onPress }: PetCardProps) {
  const { t } = useTranslation();
  const photo = pet.photoUrls[0];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Card className="mb-3 overflow-hidden p-0">
        <View className="relative">
          {photo ? (
            <Image source={{ uri: photo }} className="h-40 w-full" contentFit="cover" />
          ) : (
            <View className="h-40 w-full items-center justify-center bg-lavender">
              <Ionicons name="paw" size={48} color="#1F2937" />
            </View>
          )}
          <View className="absolute right-3 top-3 rounded-full border-2 border-border bg-card px-2 py-1">
            <Text className="text-xs font-medium text-text">
              {t(`pet.status.${pet.status}`)}
            </Text>
          </View>
        </View>
        <View className="p-4">
          <Text className="text-lg font-bold text-text">{pet.name}</Text>
          <Text className="text-sm text-muted">
            {t(`pet.species.${pet.species}`)}
            {pet.breed ? ` · ${pet.breed}` : ''}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
