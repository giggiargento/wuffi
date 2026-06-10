import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPetsByOwner,
  getPet,
  createPet,
  updatePet,
  deletePet,
  addPetPhoto,
} from '@/services/pets/petService';
import type { CreatePetInput, Pet, UpdatePetInput } from '@/types';
import { useAuthStore } from '@/stores/authStore';

export function usePets() {
  const ownerId = useAuthStore((s) => s.firebaseUser?.uid);

  return useQuery({
    queryKey: ['pets', ownerId],
    queryFn: () => (ownerId ? getPetsByOwner(ownerId) : []),
    enabled: Boolean(ownerId),
  });
}

export function usePet(petId: string) {
  return useQuery({
    queryKey: ['pet', petId],
    queryFn: () => getPet(petId),
    enabled: Boolean(petId),
  });
}

export function useCreatePet() {
  const queryClient = useQueryClient();
  const ownerId = useAuthStore((s) => s.firebaseUser?.uid);

  return useMutation({
    mutationFn: (input: CreatePetInput) => {
      if (!ownerId) throw new Error('Not authenticated');
      return createPet(ownerId, input);
    },
    onSuccess: (pet) => {
      queryClient.setQueryData(['pet', pet.id], pet);
      queryClient.setQueryData<Pet[]>(['pets', ownerId], (existing) => {
        const pets = existing ?? [];
        if (pets.some((item) => item.id === pet.id)) return pets;
        return [pet, ...pets];
      });
      void queryClient.invalidateQueries({ queryKey: ['pets', ownerId] });
    },
  });
}

export function useUpdatePet(petId: string) {
  const queryClient = useQueryClient();
  const ownerId = useAuthStore((s) => s.firebaseUser?.uid);

  return useMutation({
    mutationFn: (input: UpdatePetInput) => updatePet(petId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pet', petId] });
      queryClient.invalidateQueries({ queryKey: ['pets', ownerId] });
    },
  });
}

export function useDeletePet(petId: string) {
  const queryClient = useQueryClient();
  const ownerId = useAuthStore((s) => s.firebaseUser?.uid);

  return useMutation({
    mutationFn: () => {
      if (!ownerId) throw new Error('Not authenticated');
      return deletePet(petId, ownerId);
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['pet', petId] });
      queryClient.setQueryData<Pet[]>(['pets', ownerId], (existing) =>
        (existing ?? []).filter((item) => item.id !== petId)
      );
      void queryClient.invalidateQueries({ queryKey: ['pets', ownerId] });
    },
  });
}

export function useAddPetPhoto(petId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (photoUrl: string) => addPetPhoto(petId, photoUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pet', petId] });
    },
  });
}
