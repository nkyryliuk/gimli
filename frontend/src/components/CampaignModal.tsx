import { Campaign } from "@/hooks/useCampaigns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CampaignForm } from "./CampaignForm";

interface CampaignModalProps {
  campaign?: Campaign;
  open: boolean;
  onClose: () => void;
}

export function CampaignModal({ campaign, open, onClose }: CampaignModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {campaign ? "Edit Campaign" : "Create New Campaign"}
          </DialogTitle>
          <DialogDescription>
            {campaign
              ? "Update your campaign details below."
              : "Fill in the details to create a new campaign."}
          </DialogDescription>
        </DialogHeader>

        <CampaignForm campaign={campaign} onSubmit={onClose} />
      </DialogContent>
    </Dialog>
  );
}
