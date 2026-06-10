import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, PrimaryButton } from '@/components';
import { registerSchema } from '@/schemas';
import { useAuth } from '@/hooks/useAuth';
import { isFirebaseConfigured } from '@/services/firebase/app';

export default function RegisterScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { register, isRegistering } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRegister = async () => {
    if (!isFirebaseConfigured()) {
      Alert.alert(t('common.error'), t('errors.firebaseNotConfigured'));
      return;
    }

    const result = registerSchema.safeParse({
      displayName,
      email,
      password,
      confirmPassword,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((e) => {
        const key = String(e.path[0]);
        fieldErrors[key] =
          e.message === 'passwords_must_match'
            ? t('auth.passwordsMustMatch')
            : t('common.required');
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      setErrors({});
      await register({ email, password, displayName });
      router.replace('/(tabs)');
    } catch {
      Alert.alert(t('common.error'), t('auth.registerError'));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow px-6 py-8"
          keyboardShouldPersistTaps="handled"
        >
          <Text className="mb-6 text-2xl font-bold text-text">{t('auth.register')}</Text>

          <Input
            label={t('auth.displayName')}
            value={displayName}
            onChangeText={setDisplayName}
            error={errors.displayName}
          />
          <Input
            label={t('auth.email')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />
          <Input
            label={t('auth.password')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
          />
          <Input
            label={t('auth.confirmPassword')}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={errors.confirmPassword}
          />

          <PrimaryButton
            title={t('auth.register')}
            onPress={handleRegister}
            loading={isRegistering}
            className="mt-2"
          />

          <View className="mt-6 flex-row justify-center">
            <Text className="text-muted">{t('auth.hasAccount')} </Text>
            <Link href="/(auth)/login">
              <Text className="font-semibold text-primary">{t('auth.login')}</Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
