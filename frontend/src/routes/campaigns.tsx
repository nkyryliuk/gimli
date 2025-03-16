import { CampaignList } from "@/components/CampaignList";
import { CampaignModal } from "@/components/CampaignModal";
import { useCampaignStore } from "@/stores/useCampaignStore";
import { Toaster } from "@/components/ui/sonner";

export default function Campaigns() {
  const {
    modalOpen,
    selectedCampaign,
    openNewCampaign,
    editCampaign,
    closeModal,
  } = useCampaignStore();

  return (
    <>
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
      </div>
      <Toaster position="top-right" />
    </>
  );
}
