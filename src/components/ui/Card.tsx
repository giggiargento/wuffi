import { View, type ViewProps } from 'react-native';
import { cn } from '@/utils/cn';

interface CardProps extends ViewProps {
  className?: string;
  children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <View
      className={cn(
        'rounded-3xl border-2 border-border bg-card p-4 shadow-soft',
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}
