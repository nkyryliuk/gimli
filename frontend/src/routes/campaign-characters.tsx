import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Edit, UsersIcon } from "lucide-react";
import { useCampaigns } from "@/hooks/useCampaigns";
import { CharacterList } from "@/components/CharacterList";
import { CharacterModal } from "@/components/CharacterModal";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function CampaignCharactersPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const { campaigns, isLoading, isError } = useCampaigns();

  const campaign = campaignId
    ? campaigns.find((c) => c.id === parseInt(campaignId))
    : null;

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load campaign details");
      navigate("/campaigns");
    }
  }, [isError, navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="mt-4 text-gray-700">Loading campaign details...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-500">Campaign not found</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate("/campaigns")}
        >
          Back to Campaigns
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="flex items-center mb-4"
          onClick={() => navigate("/campaigns")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Campaigns
        </Button>

        <Card className="w-full mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{campaign.name}</CardTitle>
                <CardDescription>{campaign.game_system}</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/campaigns/${campaign.id}`)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Campaign
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              {campaign.description || "No description provided."}
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <UsersIcon className="h-4 w-4 mr-1" />
                <span>{campaign.players.length + 1} participants</span>
              </div>
              <div>
                <span className="font-medium">Created: </span>
                {campaign.created_at
                  ? new Date(campaign.created_at).toLocaleDateString()
                  : "Unknown date"}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8">
          <CharacterList campaignId={parseInt(campaignId!)} />
        </div>
      </div>

      <CharacterModal />
      <Toaster />
    </div>
  );
}
