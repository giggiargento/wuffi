import { View, TextInput, type ViewProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '@/utils/cn';

interface SearchBarProps extends ViewProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}

export function SearchBar({ value, onChangeText, placeholder, className, ...props }: SearchBarProps) {
  return (
    <View
      className={cn(
        'flex-row items-center rounded-2xl border-2 border-border bg-card px-4 py-3',
        className
      )}
      {...props}
    >
      <Ionicons name="search" size={20} color="#6B7280" />
      <TextInput
        className="ml-2 flex-1 text-base text-text"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#6B7280"
      />
    </View>
  );
}
