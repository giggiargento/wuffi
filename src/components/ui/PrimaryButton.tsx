import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  type TouchableOpacityProps,
} from 'react-native';
import { cn } from '@/utils/cn';

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
}

export function PrimaryButton({
  title,
  loading,
  variant = 'primary',
  className,
  disabled,
  ...props
}: PrimaryButtonProps) {
  const variantStyles = {
    primary: 'bg-primary',
    secondary: 'bg-lavender',
    outline: 'bg-card',
  };

  return (
    <TouchableOpacity
      className={cn(
        'w-full items-center justify-center rounded-3xl border-2 border-border px-6 py-4 shadow-soft',
        variantStyles[variant],
        (disabled || loading) && 'opacity-60',
        className
      )}
      disabled={disabled || loading}
      activeOpacity={0.85}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="#1F2937" />
      ) : (
        <Text className="text-base font-semibold text-text">{title}</Text>
      )}
    </TouchableOpacity>
  );
}
