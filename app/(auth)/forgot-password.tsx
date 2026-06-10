import { useState } from 'react';
import { View, Text, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, PrimaryButton } from '@/components';
import { forgotPasswordSchema } from '@/schemas';
import { useAuth } from '@/hooks/useAuth';
import { isFirebaseConfigured } from '@/services/firebase/app';

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!isFirebaseConfigured()) {
      Alert.alert(t('common.error'), t('errors.firebaseNotConfigured'));
      return;
    }

    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      Alert.alert(t('common.error'), t('common.required'));
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email);
      Alert.alert(t('auth.resetPassword'), t('auth.resetSent'));
      router.back();
    } catch {
      Alert.alert(t('common.error'), t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-6"
      >
        <Text className="mb-2 text-2xl font-bold text-text">{t('auth.forgotPassword')}</Text>
        <Text className="mb-6 text-base text-muted">{t('auth.email')}</Text>
        <Input
          label={t('auth.email')}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <PrimaryButton title={t('auth.resetPassword')} onPress={handleReset} loading={loading} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
