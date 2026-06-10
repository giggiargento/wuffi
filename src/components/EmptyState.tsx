import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton } from './ui/PrimaryButton';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  onCta?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function EmptyState({
  title,
  subtitle,
  ctaLabel,
  onCta,
  icon = 'paw-outline',
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-12">
      <View className="mb-4 rounded-full border-2 border-border bg-lavender p-6">
        <Ionicons name={icon} size={48} color="#1F2937" />
      </View>
      <Text className="mb-2 text-center text-xl font-bold text-text">{title}</Text>
      {subtitle ? (
        <Text className="mb-6 text-center text-base text-muted">{subtitle}</Text>
      ) : null}
      {ctaLabel && onCta ? (
        <PrimaryButton title={ctaLabel} onPress={onCta} className="max-w-xs" />
      ) : null}
    </View>
  );
}
