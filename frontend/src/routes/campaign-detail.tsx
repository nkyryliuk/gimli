import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCampaigns } from "@/hooks/useCampaigns";
import { CharacterList } from "@/components/CharacterList";
import { CharacterModal } from "@/components/CharacterModal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Edit, ArrowLeft, UsersIcon } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const campaignId = parseInt(id || "0");
  const navigate = useNavigate();

  const { campaigns, isLoading, isError } = useCampaigns();
  const campaign = campaigns.find((c) => c.id === campaignId);

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

        <Card className="w-full">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{campaign.name}</CardTitle>
                <CardDescription>{campaign.game_system}</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/campaigns/${campaign.id}/characters`)}
              >
                <Edit className="mr-2 h-4 w-4" />
                View Characters
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
          <CardFooter className="bg-gray-50 border-t">
            <Button
              variant="link"
              className="text-primary"
              onClick={() => navigate(`/campaigns/${campaign.id}/characters`)}
            >
              Manage Characters
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Toaster />
    </div>
  );
}
