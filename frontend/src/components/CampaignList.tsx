import { useNavigate } from "react-router-dom";
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
import {
  BookOpenText,
  MapPin,
  PlusIcon,
  Scroll,
  Shield,
  TrashIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";

interface CampaignListProps {
  onNewCampaign: () => void;
  onEditCampaign: (campaign: Campaign) => void;
}

export function CampaignList({
  onNewCampaign,
  onEditCampaign,
}: CampaignListProps) {
  const { campaigns, isLoading, isError, deleteCampaign } = useCampaigns();
  const navigate = useNavigate();

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
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
              <BookOpenText className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Begin Your Adventure</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Create your first campaign to start organizing your world,
              characters, and lore for your tabletop adventures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-4 border-dashed">
              <div className="flex flex-col items-center text-center">
                <Shield className="h-10 w-10 text-primary/60 mb-2" />
                <h3 className="font-medium">Organize Your Game</h3>
                <p className="text-sm text-muted-foreground">
                  Track campaigns, sessions, and player information
                </p>
              </div>
            </Card>

            <Card className="p-4 border-dashed">
              <div className="flex flex-col items-center text-center">
                <Scroll className="h-10 w-10 text-primary/60 mb-2" />
                <h3 className="font-medium">Create Rich Lore</h3>
                <p className="text-sm text-muted-foreground">
                  Document NPCs, locations, and factions
                </p>
              </div>
            </Card>

            <Card className="p-4 border-dashed">
              <div className="flex flex-col items-center text-center">
                <MapPin className="h-10 w-10 text-primary/60 mb-2" />
                <h3 className="font-medium">Plan Adventures</h3>
                <p className="text-sm text-muted-foreground">
                  Map out quests and story arcs
                </p>
              </div>
            </Card>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={onNewCampaign}
              className="flex items-center"
              size="lg"
            >
              <PlusIcon className="mr-2 h-5 w-5" />
              Create Your First Campaign
            </Button>
          </div>
        </div>
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
              onClick={() => navigate(`/campaigns/${campaign.id}/characters`)}
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
              onClick={() => navigate(`/campaigns/${campaign.id}/characters`)}
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
                  onEditCampaign(campaign);
                }}
              >
                <UserPlusIcon className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
