import '../global.css';
import '@/i18n';
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { useAuthInit, useAuth } from '@/hooks/useAuth';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitialized } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isInitialized, segments, router]);

  return <>{children}</>;
}

function RootLayoutNav() {
  useAuthInit();

  return (
    <AuthGate>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FFF4EA' } }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="pet/[id]" options={{ headerShown: true, title: '' }} />
        <Stack.Screen name="pet/[id]/edit" options={{ headerShown: true, title: '' }} />
        <Stack.Screen name="case/[id]" options={{ headerShown: true, title: '' }} />
        <Stack.Screen name="create" options={{ headerShown: false }} />
        <Stack.Screen name="explore/map" options={{ headerShown: true, title: '' }} />
        <Stack.Screen name="explore/filters" options={{ presentation: 'modal', title: '' }} />
        <Stack.Screen name="favorites" options={{ headerShown: true, title: '' }} />
        <Stack.Screen name="settings/index" options={{ headerShown: true, title: '' }} />
      </Stack>
    </AuthGate>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <RootLayoutNav />
        <StatusBar style="dark" />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
