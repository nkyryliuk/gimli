import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

// Types
export interface Character {
  id: number;
  name: string;
  character_class: string;
  character_class_display: string;
  race: string;
  race_display: string;
  age: number | null;
  alignment: string;
  alignment_display: string;
  bio: string;
  character_data: Record<string, any>;
  campaign: any;
  owner: any;
  created_at: string;
  updated_at: string;
}

export interface CharacterCreateInput {
  name: string;
  character_class: string;
  race: string;
  age?: number | null;
  alignment: string;
  bio: string;
  character_data?: Record<string, any>;
}

// API functions
export const fetchCharacters = async (
  campaignId: number
): Promise<Character[]> => {
  const response = await axiosInstance.get(
    `/campaigns/${campaignId}/characters/`
  );
  return response.data;
};

export const fetchCharacter = async ({
  campaignId,
  characterId,
}: {
  campaignId: number;
  characterId: number;
}): Promise<Character> => {
  const response = await axiosInstance.get(
    `/campaigns/${campaignId}/characters/${characterId}/`
  );
  return response.data;
};

export const createCharacter = async ({
  campaignId,
  data,
}: {
  campaignId: number;
  data: CharacterCreateInput;
}): Promise<Character> => {
  try {
    const response = await axiosInstance.post(
      `/campaigns/${campaignId}/characters/`,
      data
    );
    return response.data;
  } catch (error: any) {
    console.error("Error creating character:", error);
    throw error;
  }
};

export const updateCharacter = async ({
  campaignId,
  characterId,
  data,
}: {
  campaignId: number;
  characterId: number;
  data: Partial<CharacterCreateInput>;
}): Promise<Character> => {
  const response = await axiosInstance.patch(
    `/campaigns/${campaignId}/characters/${characterId}/`,
    data
  );
  return response.data;
};

export const deleteCharacter = async ({
  campaignId,
  characterId,
}: {
  campaignId: number;
  characterId: number;
}): Promise<void> => {
  await axiosInstance.delete(
    `/campaigns/${campaignId}/characters/${characterId}/`
  );
};

// Custom hook for characters list
export function useCharacters(campaignId: number) {
  const queryClient = useQueryClient();

  // Fetch all characters for a campaign
  const charactersQuery = useQuery({
    queryKey: ["characters", campaignId],
    queryFn: () => fetchCharacters(campaignId),
    enabled: !!campaignId,
  });

  // Create character mutation
  const createCharacterMutation = useMutation({
    mutationFn: (data: CharacterCreateInput) =>
      createCharacter({ campaignId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["characters", campaignId] });
    },
  });

  // Delete character mutation
  const deleteCharacterMutation = useMutation({
    mutationFn: (characterId: number) =>
      deleteCharacter({ campaignId, characterId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["characters", campaignId] });
    },
  });

  return {
    // Queries
    characters: charactersQuery.data || [],
    isLoading: charactersQuery.isLoading,
    isError: charactersQuery.isError,
    error: charactersQuery.error,

    // Mutations
    createCharacter: createCharacterMutation.mutate,
    isCreating: createCharacterMutation.isPending,
    createError: createCharacterMutation.error,

    deleteCharacter: deleteCharacterMutation.mutate,
    isDeleting: deleteCharacterMutation.isPending,

    // Refetch
    refetch: charactersQuery.refetch,
  };
}

// Custom hook for a single character
export function useCharacter(campaignId: number, characterId: number) {
  const queryClient = useQueryClient();

  // Fetch single character
  const characterQuery = useQuery({
    queryKey: ["character", campaignId, characterId],
    queryFn: () => fetchCharacter({ campaignId, characterId }),
    enabled: !!campaignId && !!characterId,
  });

  // Update character mutation
  const updateCharacterMutation = useMutation({
    mutationFn: (data: Partial<CharacterCreateInput>) =>
      updateCharacter({ campaignId, characterId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["character", campaignId, characterId],
      });
      queryClient.invalidateQueries({ queryKey: ["characters", campaignId] });
    },
  });

  return {
    // Query
    character: characterQuery.data,
    isLoading: characterQuery.isLoading,
    isError: characterQuery.isError,
    error: characterQuery.error,

    // Mutation
    updateCharacter: updateCharacterMutation.mutate,
    isUpdating: updateCharacterMutation.isPending,
    updateError: updateCharacterMutation.error,

    // Refetch
    refetch: characterQuery.refetch,
  };
}
