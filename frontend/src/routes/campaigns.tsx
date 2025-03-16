import { useCampaignStore } from "@/stores/useCampaignStore";
import { CampaignList } from "@/components/CampaignList";
import { CampaignModal } from "@/components/CampaignModal";
import { Toaster } from "@/components/ui/sonner";

export default function CampaignsPage() {
  const {
    modalOpen,
    selectedCampaign,
    openNewCampaign,
    editCampaign,
    closeModal,
  } = useCampaignStore();

  return (
    <div className="container mx-auto px-4 py-8">
      <CampaignList
        onNewCampaign={openNewCampaign}
        onEditCampaign={editCampaign}
      />
      <CampaignModal
        campaign={selectedCampaign}
        open={modalOpen}
        onClose={closeModal}
      />
      <Toaster position="top-right" />
    </div>
  );
}
