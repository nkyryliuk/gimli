import { Campaign, useCampaigns } from "@/hooks/useCampaigns";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface CampaignFormProps {
  campaign?: Campaign;
  onSubmit: () => void;
}

const GAME_SYSTEMS = [
  "D&D 5e",
  "Pathfinder",
  "Call of Cthulhu",
  "Shadowrun",
  "Vampire: The Masquerade",
  "Warhammer Fantasy",
  "Star Wars RPG",
  "Cyberpunk RED",
  "GURPS",
  "Other",
];

export function CampaignForm({ campaign, onSubmit }: CampaignFormProps) {
  const { createCampaign, updateCampaign, isCreating, isUpdating } =
    useCampaigns();

  const form = useForm({
    defaultValues: {
      name: campaign?.name ?? "",
      description: campaign?.description ?? "",
      game_system: campaign?.game_system ?? "D&D 5e",
      is_active: campaign?.is_active ?? true,
    },
    onSubmit: async ({ value }) => {
      if (campaign) {
        updateCampaign({ id: campaign.id, data: value });
        toast.success("Campaign updated successfully");
      } else {
        createCampaign(value);
        toast.success("Campaign created successfully");
      }
    },
  });

  return (
    <form onSubmit={form.handleSubmit} className="space-y-6 py-4">
      <div className="space-y-2">
        <form.Field
          name="name"
          children={(field) => (
            <Input
              id="name"
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Enter campaign name"
              required
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <form.Field
          name="game_system"
          children={(field) => (
            <select
              id="game_system"
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              required
            >
              {GAME_SYSTEMS.map((system) => (
                <option key={system} value={system}>
                  {system}
                </option>
              ))}
            </select>
          )}
        />
      </div>

      <div className="space-y-2">
        <form.Field
          name="description"
          children={(field) => (
            <Textarea
              id="description"
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Describe your campaign"
              rows={4}
            />
          )}
        />
      </div>

      <div className="flex items-center space-x-2">
        <form.Field
          name="is_active"
          children={(field) => (
            <Switch
              id="is_active"
              checked={field.state.value}
              onCheckedChange={(checked) => field.handleChange(checked)}
            />
          )}
        />
        <Label htmlFor="is_active">Campaign is active</Label>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onSubmit}
          disabled={isCreating || isUpdating}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={
            isCreating ||
            isUpdating ||
            !form.state.values.name ||
            !form.state.values.game_system
          }
        >
          {isCreating || isUpdating ? (
            <span className="flex items-center">
              <div className="animate-spin h-4 w-4 mr-2 border-2 border-b-0 border-white rounded-full" />
              Saving...
            </span>
          ) : campaign ? (
            "Update Campaign"
          ) : (
            "Create Campaign"
          )}
        </Button>
      </div>
    </form>
  );
}
