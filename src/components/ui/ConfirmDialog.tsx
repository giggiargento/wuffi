import {
  Modal,
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Card } from './Card';
import { Button } from './Button';
import { cn } from '@/utils/cn';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <Pressable
          className="flex-1 items-center justify-center bg-black/40 px-6"
          onPress={onCancel}
          accessibilityRole="button"
          accessibilityLabel={cancelLabel}
        >
          <Pressable onPress={(event) => event.stopPropagation()}>
            <Card variant="floating" className="w-full max-w-md">
              <Text className="text-xl font-bold text-text">{title}</Text>
              <Text className="mt-3 text-base leading-6 text-muted">{message}</Text>
              <View className="mt-6 gap-3">
                <Button
                  title={confirmLabel}
                  variant={destructive ? 'destructive' : 'primary'}
                  onPress={onConfirm}
                  loading={loading}
                  disabled={loading}
                />
                <Button
                  title={cancelLabel}
                  variant="outline"
                  onPress={onCancel}
                  disabled={loading}
                />
              </View>
            </Card>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

interface InlineErrorProps {
  message: string;
  className?: string;
}

export function InlineError({ message, className }: InlineErrorProps) {
  return (
    <View
      className={cn(
        'mt-3 rounded-2xl border-2 border-border bg-pink px-4 py-3',
        className
      )}
    >
      <Text className="text-sm font-medium leading-5 text-text">{message}</Text>
    </View>
  );
}
