import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  type TouchableOpacityProps,
} from 'react-native';
import { cn } from '@/utils/cn';
import { shadows } from './shadows';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  textClassName?: string;
}

const variantStyles: Record<ButtonVariant, { container: string; text: string }> = {
  primary: { container: 'bg-primary', text: 'text-text font-bold' },
  secondary: { container: 'bg-lavender', text: 'text-text font-semibold' },
  outline: { container: 'bg-card', text: 'text-text font-semibold' },
  ghost: { container: 'bg-transparent border-transparent', text: 'text-primary font-semibold' },
  destructive: { container: 'bg-pink', text: 'text-text font-bold' },
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2.5 rounded-2xl',
  md: 'px-6 py-3.5 rounded-3xl',
  lg: 'px-6 py-4 rounded-3xl',
};

const textSizeStyles: Record<ButtonSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-base',
};

export function Button({
  title,
  loading,
  variant = 'primary',
  size = 'lg',
  className,
  textClassName,
  disabled,
  style,
  onPress,
  ...props
}: ButtonProps) {
  const styles = variantStyles[variant];
  const showShadow = variant !== 'ghost';

  return (
    <TouchableOpacity
      className={cn(
        'w-full items-center justify-center border-2 border-border',
        sizeStyles[size],
        styles.container,
        (disabled || loading) && 'opacity-60',
        className
      )}
      style={[showShadow ? shadows.soft : undefined, style]}
      disabled={disabled || loading}
      activeOpacity={0.85}
      onPress={onPress}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="#1F2937" />
      ) : (
        <Text
          className={cn(textSizeStyles[size], styles.text, textClassName)}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

/** @deprecated Use Button */
export const PrimaryButton = Button;
