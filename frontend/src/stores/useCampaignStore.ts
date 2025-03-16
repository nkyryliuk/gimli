import { create } from "zustand";
import { Campaign } from "@/hooks/useCampaigns";

interface CampaignStore {
  modalOpen: boolean;
  selectedCampaign: Campaign | undefined;

  openNewCampaign: () => void;
  editCampaign: (campaign: Campaign) => void;
  closeModal: () => void;
}

export const useCampaignStore = create<CampaignStore>((set) => ({
  modalOpen: false,
  selectedCampaign: undefined,

  openNewCampaign: () =>
    set({
      selectedCampaign: undefined,
      modalOpen: true,
    }),

  editCampaign: (campaign: Campaign) =>
    set({
      selectedCampaign: campaign,
      modalOpen: true,
    }),

  closeModal: () =>
    set({
      modalOpen: false,
    }),
}));
