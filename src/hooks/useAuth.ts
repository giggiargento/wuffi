import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { subscribeToAuth, signInWithEmail, registerWithEmail, signOutUser, resetPassword } from '@/services/firebase/auth';
import { getOrCreateUser } from '@/services/users/userService';
import { isFirebaseConfigured } from '@/services/firebase/app';

export function useAuthInit() {
  const { setFirebaseUser, setUserProfile, setLoading, setInitialized, reset } = useAuthStore();

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setLoading(false);
      setInitialized(true);
      return;
    }

    const unsubscribe = subscribeToAuth(async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          const profile = await getOrCreateUser({
            uid: user.uid,
            email: user.email ?? '',
            displayName: user.displayName ?? user.email?.split('@')[0] ?? 'Usuario',
          });
          setUserProfile(profile);
        } catch {
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
      setInitialized(true);
    });

    return unsubscribe;
  }, [setFirebaseUser, setUserProfile, setLoading, setInitialized]);
}

export function useAuth() {
  const state = useAuthStore();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signInWithEmail(email, password),
  });

  const registerMutation = useMutation({
    mutationFn: ({
      email,
      password,
      displayName,
    }: {
      email: string;
      password: string;
      displayName: string;
    }) => registerWithEmail(email, password, displayName),
  });

  const logoutMutation = useMutation({
    mutationFn: signOutUser,
    onSuccess: () => {
      reset();
      queryClient.clear();
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (email: string) => resetPassword(email),
  });

  return {
    ...state,
    isAuthenticated: Boolean(state.firebaseUser),
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    resetPassword: resetPasswordMutation.mutateAsync,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
}

function reset() {
  useAuthStore.getState().reset();
}

export function useUserProfile() {
  const uid = useAuthStore((s) => s.firebaseUser?.uid);
  return useQuery({
    queryKey: ['user', uid],
    queryFn: () => (uid ? getOrCreateUser({ uid, email: '', displayName: '' }) : null),
    enabled: false,
  });
}
