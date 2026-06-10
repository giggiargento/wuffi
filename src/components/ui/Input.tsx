import { TextInput, View, Text, type TextInputProps } from 'react-native';
import { cn } from '@/utils/cn';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  containerClassName,
  className,
  ...props
}: InputProps) {
  return (
    <View className={cn('mb-4', containerClassName)}>
      {label ? (
        <Text className="mb-2 text-sm font-medium text-text">{label}</Text>
      ) : null}
      <TextInput
        className={cn(
          'rounded-2xl border-2 border-border bg-card px-4 py-3 text-base text-text',
          error && 'border-pink',
          className
        )}
        placeholderTextColor="#6B7280"
        {...props}
      />
      {error ? <Text className="mt-1 text-sm text-pink">{error}</Text> : null}
    </View>
  );
}
