import React, { useState, useEffect } from "react";
import {
  Campaign,
  CampaignCreateInput,
  useCampaigns,
} from "@/hooks/useCampaigns";
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

export function CampaignForm({ campaign, onSubmit }: CampaignFormProps) {
  const { createCampaign, updateCampaign, isCreating, isUpdating } =
    useCampaigns();
  const isLoading = isCreating || isUpdating;

  const [formData, setFormData] = useState<CampaignCreateInput>({
    name: "",
    description: "",
    game_system: "D&D 5e", // Default value
    is_active: true,
  });

  useEffect(() => {
    if (campaign) {
      setFormData({
        name: campaign.name,
        description: campaign.description,
        game_system: campaign.game_system,
        is_active: campaign.is_active,
      });
    } else {
      // Reset form when creating a new campaign
      setFormData({
        name: "",
        description: "",
        game_system: "D&D 5e",
        is_active: true,
      });
    }
  }, [campaign]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_active: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (campaign) {
        await updateCampaign({ id: campaign.id, data: formData });
        toast.success("Campaign updated successfully");
      } else {
        await createCampaign(formData);
        toast.success("Campaign created successfully");
      }

      onSubmit();
    } catch (error: any) {
      console.error("Error submitting campaign:", error);

      // Display error message
      if (error.response?.data) {
        // Display specific error from API if available
        const errorMsg =
          typeof error.response.data === "string"
            ? error.response.data
            : Object.entries(error.response.data)
                .map(([key, value]) => `${key}: ${value}`)
                .join(", ");

        toast.error(`Failed to save campaign: ${errorMsg}`);
      } else {
        toast.error("Failed to save campaign. Please try again.");
      }
    }
  };

  const gameSystems = [
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">Campaign Name *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter campaign name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="game_system">Game System *</Label>
        <select
          id="game_system"
          name="game_system"
          value={formData.game_system}
          onChange={handleChange}
          className="w-full rounded-md border border-input bg-background px-3 py-2"
          required
        >
          {gameSystems.map((system) => (
            <option key={system} value={system}>
              {system}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your campaign"
          rows={4}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={handleSwitchChange}
        />
        <Label htmlFor="is_active">Campaign is active</Label>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onSubmit}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading || !formData.name || !formData.game_system}
        >
          {isLoading ? (
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
