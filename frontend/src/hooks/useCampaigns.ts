import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

const CAMPAIGN_QUERY_KEY = "campaigns";

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Campaign {
  id: number;
  name: string;
  description: string;
  game_system: string;
  created_at: string;
  updated_at: string;
  owner: User;
  players: User[];
  is_active: boolean;
}

export interface CampaignCreateInput {
  name: string;
  description: string;
  game_system: string;
  is_active: boolean;
}

export const fetchCampaigns = async (): Promise<Campaign[]> => {
  const response = await axiosInstance.get("/lore/campaigns/");
  return response.data;
};

export const createCampaign = async (
  data: CampaignCreateInput
): Promise<Campaign> => {
  try {
    const response = await axiosInstance.post("/lore/campaigns/", data);
    return response.data;
  } catch (error: any) {
    console.error("Error creating campaign:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    }
    throw error;
  }
};

export const updateCampaign = async ({
  id,
  data,
}: {
  id: number;
  data: Partial<CampaignCreateInput>;
}): Promise<Campaign> => {
  const response = await axiosInstance.patch(`/lore/campaigns/${id}/`, data);
  return response.data;
};

export const deleteCampaign = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/lore/campaigns/${id}/`);
};

export const addPlayerToCampaign = async ({
  campaignId,
  userId,
}: {
  campaignId: number;
  userId: number;
}): Promise<void> => {
  await axiosInstance.post(`/lore/campaigns/${campaignId}/add_player/`, {
    user_id: userId,
  });
};

export const removePlayerFromCampaign = async ({
  campaignId,
  userId,
}: {
  campaignId: number;
  userId: number;
}): Promise<void> => {
  await axiosInstance.post(`/lore/campaigns/${campaignId}/remove_player/`, {
    user_id: userId,
  });
};

export function useCampaigns() {
  const queryClient = useQueryClient();

  const campaignsQuery = useQuery({
    queryKey: [CAMPAIGN_QUERY_KEY],
    queryFn: fetchCampaigns,
  });

  const createCampaignMutation = useMutation({
    mutationFn: createCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CAMPAIGN_QUERY_KEY] });
    },
  });

  const updateCampaignMutation = useMutation({
    mutationFn: updateCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CAMPAIGN_QUERY_KEY] });
    },
  });

  const deleteCampaignMutation = useMutation({
    mutationFn: deleteCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CAMPAIGN_QUERY_KEY] });
    },
  });

  const addPlayerMutation = useMutation({
    mutationFn: addPlayerToCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CAMPAIGN_QUERY_KEY] });
    },
  });

  const removePlayerMutation = useMutation({
    mutationFn: removePlayerFromCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CAMPAIGN_QUERY_KEY] });
    },
  });

  return {
    campaigns: campaignsQuery.data || [],
    isLoading: campaignsQuery.isLoading,
    isError: campaignsQuery.isError,
    error: campaignsQuery.error,

    createCampaign: createCampaignMutation.mutate,
    isCreating: createCampaignMutation.isPending,
    createError: createCampaignMutation.error,

    updateCampaign: updateCampaignMutation.mutate,
    isUpdating: updateCampaignMutation.isPending,

    deleteCampaign: deleteCampaignMutation.mutate,
    isDeleting: deleteCampaignMutation.isPending,

    addPlayer: addPlayerMutation.mutate,
    removePlayer: removePlayerMutation.mutate,

    refetch: campaignsQuery.refetch,
  };
}
