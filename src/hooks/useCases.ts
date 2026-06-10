import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCase,
  getCasesByOwner,
  exploreCases,
  createCase,
  updateCaseStatus,
  getRecentCasesNearby,
} from '@/services/cases/caseService';
import type { CreateCaseInput, ExploreFilters } from '@/types';
import { useAuthStore } from '@/stores/authStore';
import { useExploreStore } from '@/stores/exploreStore';

export function useCase(caseId: string) {
  return useQuery({
    queryKey: ['case', caseId],
    queryFn: () => getCase(caseId),
    enabled: Boolean(caseId),
  });
}

export function useMyCases() {
  const ownerId = useAuthStore((s) => s.firebaseUser?.uid);

  return useQuery({
    queryKey: ['myCases', ownerId],
    queryFn: () => (ownerId ? getCasesByOwner(ownerId) : []),
    enabled: Boolean(ownerId),
  });
}

export function useExploreCases() {
  const activeTab = useExploreStore((s) => s.activeTab);
  const filters = useExploreStore((s) => s.filters);
  const searchQuery = useExploreStore((s) => s.searchQuery);

  const mergedFilters: ExploreFilters = {
    ...filters,
    caseType: activeTab,
    search: searchQuery || filters.search,
  };

  return useQuery({
    queryKey: ['exploreCases', mergedFilters],
    queryFn: () => exploreCases(mergedFilters),
  });
}

export function useNearbyCases() {
  return useQuery({
    queryKey: ['nearbyCases'],
    queryFn: () => getRecentCasesNearby(undefined, 5),
  });
}

export function useCreateCase() {
  const queryClient = useQueryClient();
  const ownerId = useAuthStore((s) => s.firebaseUser?.uid);

  return useMutation({
    mutationFn: (input: CreateCaseInput) => {
      if (!ownerId) throw new Error('Not authenticated');
      return createCase(ownerId, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exploreCases'] });
      queryClient.invalidateQueries({ queryKey: ['myCases', ownerId] });
      queryClient.invalidateQueries({ queryKey: ['nearbyCases'] });
    },
  });
}

export function useUpdateCaseStatus(caseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: string) => updateCaseStatus(caseId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['case', caseId] });
      queryClient.invalidateQueries({ queryKey: ['exploreCases'] });
    },
  });
}
