import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getFavoritesByUser,
  toggleFavorite,
  isFavorite,
} from '@/services/favorites/favoriteService';
import type { CaseType } from '@/types';
import { useAuthStore } from '@/stores/authStore';

export function useFavorites() {
  const userId = useAuthStore((s) => s.firebaseUser?.uid);

  return useQuery({
    queryKey: ['favorites', userId],
    queryFn: () => (userId ? getFavoritesByUser(userId) : []),
    enabled: Boolean(userId),
  });
}

export function useIsFavorite(targetType: 'case' | 'organization', targetId: string) {
  const userId = useAuthStore((s) => s.firebaseUser?.uid);

  return useQuery({
    queryKey: ['isFavorite', userId, targetType, targetId],
    queryFn: () =>
      userId ? isFavorite(userId, targetType, targetId) : false,
    enabled: Boolean(userId && targetId),
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.firebaseUser?.uid);

  return useMutation({
    mutationFn: ({
      targetType,
      targetId,
      caseType,
    }: {
      targetType: 'case' | 'organization';
      targetId: string;
      caseType?: CaseType;
    }) => {
      if (!userId) throw new Error('Not authenticated');
      return toggleFavorite(userId, targetType, targetId, caseType);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['favorites', userId] });
      queryClient.invalidateQueries({
        queryKey: ['isFavorite', userId, variables.targetType, variables.targetId],
      });
    },
  });
}
