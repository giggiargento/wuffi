import { create } from 'zustand';
import type { CaseType, ExploreFilters } from '@/types';

interface ExploreState {
  activeTab: CaseType;
  viewMode: 'list' | 'map';
  filters: ExploreFilters;
  searchQuery: string;
  setActiveTab: (tab: CaseType) => void;
  setViewMode: (mode: 'list' | 'map') => void;
  setFilters: (filters: ExploreFilters) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
}

export const useExploreStore = create<ExploreState>((set) => ({
  activeTab: 'lost',
  viewMode: 'list',
  filters: {},
  searchQuery: '',
  setActiveTab: (activeTab) => set({ activeTab }),
  setViewMode: (viewMode) => set({ viewMode }),
  setFilters: (filters) => set({ filters }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  resetFilters: () => set({ filters: {}, searchQuery: '' }),
}));
