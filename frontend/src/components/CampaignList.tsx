import { useCampaigns, Campaign } from "@/hooks/useCampaigns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusIcon, TrashIcon, UserPlusIcon, UsersIcon } from "lucide-react";

interface CampaignListProps {
  onNewCampaign: () => void;
  onEditCampaign: (campaign: Campaign) => void;
}

export function CampaignList({
  onNewCampaign,
  onEditCampaign,
}: CampaignListProps) {
  const { campaigns, isLoading, isError, deleteCampaign } = useCampaigns();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="mt-4 text-gray-700">Loading campaigns...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-500">
          Failed to load campaigns. Please try again.
        </p>
        <Button variant="outline" className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500 mb-4">No campaigns found</p>
        <Button onClick={onNewCampaign} className="flex items-center">
          <PlusIcon className="mr-2 h-4 w-4" />
          Create your first campaign
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Campaigns</h2>
        <Button onClick={onNewCampaign} className="flex items-center">
          <PlusIcon className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <Card
            key={campaign.id}
            className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader
              className="cursor-pointer"
              onClick={() => onEditCampaign(campaign)}
            >
              <CardTitle className="flex items-start justify-between">
                <span>{campaign.name}</span>
                {!campaign.is_active && (
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                    Inactive
                  </span>
                )}
              </CardTitle>
              <CardDescription>{campaign.game_system}</CardDescription>
            </CardHeader>

            <CardContent
              className="cursor-pointer"
              onClick={() => onEditCampaign(campaign)}
            >
              <p className="text-sm text-gray-600 line-clamp-3">
                {campaign.description || "No description provided."}
              </p>

              <div className="flex items-center mt-4 text-sm text-gray-500">
                <UsersIcon className="h-4 w-4 mr-1" />
                <span>{campaign.players.length + 1} participants</span>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between bg-gray-50 border-t">
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation();
                  if (
                    confirm("Are you sure you want to delete this campaign?")
                  ) {
                    deleteCampaign(campaign.id);
                  }
                }}
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Delete
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                onClick={(e) => {
                  e.stopPropagation();
                  // This would typically open a modal to add players
                  alert("Add players functionality to be implemented");
                }}
              >
                <UserPlusIcon className="h-4 w-4 mr-1" />
                Add Players
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
