import { create } from 'zustand';
import type { AuthUser } from '@/services/firebase/auth';
import type { User } from '@/types';

interface AuthState {
  firebaseUser: AuthUser | null;
  userProfile: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  setFirebaseUser: (user: AuthUser | null) => void;
  setUserProfile: (profile: User | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  firebaseUser: null,
  userProfile: null,
  isLoading: true,
  isInitialized: false,
  setFirebaseUser: (firebaseUser) => set({ firebaseUser }),
  setUserProfile: (userProfile) => set({ userProfile }),
  setLoading: (isLoading) => set({ isLoading }),
  setInitialized: (isInitialized) => set({ isInitialized }),
  reset: () =>
    set({
      firebaseUser: null,
      userProfile: null,
      isLoading: false,
    }),
}));
