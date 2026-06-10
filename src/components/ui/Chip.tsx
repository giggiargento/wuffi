import { View, Text, TouchableOpacity } from 'react-native';
import { cn } from '@/utils/cn';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  color?: 'lavender' | 'pink' | 'sky' | 'mint' | 'primary';
}

const colorMap = {
  lavender: 'bg-lavender',
  pink: 'bg-pink',
  sky: 'bg-sky',
  mint: 'bg-mint',
  primary: 'bg-primary',
};

export function Chip({ label, selected, onPress, color = 'lavender' }: ChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.8}
      className={cn(
        'mr-2 rounded-full border-2 border-border px-4 py-2',
        selected ? colorMap[color] : 'bg-card'
      )}
    >
      <Text className={cn('text-sm font-medium', selected ? 'text-text' : 'text-muted')}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function ChipRow({ children }: { children: React.ReactNode }) {
  return <View className="flex-row flex-wrap">{children}</View>;
}
