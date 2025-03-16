import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCharacterStore } from "@/stores/useCharacterStore";
import { useCharacters, useCharacter } from "@/hooks/useCharacters";
import { toast } from "sonner";

const ABILITIES = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

export function CharacterSheetForm() {
  const {
    formData,
    setFormData,
    prevStep,
    closeModal,
    selectedCharacter,
    campaignId,
  } = useCharacterStore();

  const { createCharacter } = useCharacters(campaignId || 0);
  const { updateCharacter } = useCharacter(
    campaignId || 0,
    selectedCharacter?.id || 0
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const characterData = formData.character_data || {
    abilities: {
      STR: 10,
      DEX: 10,
      CON: 10,
      INT: 10,
      WIS: 10,
      CHA: 10,
    },
    hitPoints: {
      max: 10,
      current: 10,
    },
    level: 1,
    proficiencyBonus: 2,
    armorClass: 10,
    initiative: 0,
    speed: 30,
    skills: {},
    equipment: "",
    spells: "",
    features: "",
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [category, field] = name.split(".");

      setFormData({
        character_data: {
          ...characterData,
          [category]: {
            ...characterData[category],
            [field]: value === "" ? "" : parseInt(value) || value,
          },
        },
      });
    } else {
      setFormData({
        character_data: {
          ...characterData,
          [name]: value === "" ? "" : parseInt(value) || value,
        },
      });
    }
  };

  const handleAbilityChange = (ability: string, value: string) => {
    setFormData({
      character_data: {
        ...characterData,
        abilities: {
          ...characterData.abilities,
          [ability]: value === "" ? 10 : parseInt(value) || 10,
        },
      },
    });
  };

  const getModifier = (score: number) => {
    return Math.floor((score - 10) / 2);
  };

  const formatModifier = (mod: number) => {
    return mod >= 0 ? `+${mod}` : mod.toString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (selectedCharacter) {
        await updateCharacter(formData);
        toast.success("Character updated successfully");
        closeModal();
      } else {
        await createCharacter(formData);
        toast.success("Character created successfully");
        closeModal();
      }
    } catch (error: any) {
      console.error("Error saving character:", error);
      toast.error(error.response?.data?.detail || "Failed to save character");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get display names from ID values
  const getRaceDisplay = () => {
    const raceMap: Record<string, string> = {
      dragonborn: "Dragonborn",
      dwarf: "Dwarf",
      elf: "Elf",
      gnome: "Gnome",
      half_elf: "Half-Elf",
      half_orc: "Half-Orc",
      halfling: "Halfling",
      human: "Human",
      tiefling: "Tiefling",
      orc: "Orc",
      leonin: "Leonin",
      satyr: "Satyr",
      aasimar: "Aasimar",
      fairy: "Fairy",
      harengon: "Harengon",
      tabaxi: "Tabaxi",
      tortle: "Tortle",
      genasi: "Genasi",
      goliath: "Goliath",
      other: "Other",
    };
    return raceMap[formData.race] || formData.race;
  };

  const getClassDisplay = () => {
    const classMap: Record<string, string> = {
      barbarian: "Barbarian",
      bard: "Bard",
      cleric: "Cleric",
      druid: "Druid",
      fighter: "Fighter",
      monk: "Monk",
      paladin: "Paladin",
      ranger: "Ranger",
      rogue: "Rogue",
      sorcerer: "Sorcerer",
      warlock: "Warlock",
      wizard: "Wizard",
      artificer: "Artificer",
      blood_hunter: "Blood Hunter",
    };
    return classMap[formData.character_class] || formData.character_class;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between bg-muted/40 p-2 rounded-md mb-4">
        <div>
          <h3 className="font-bold text-lg">{formData.name}</h3>
          <p className="text-sm text-muted-foreground">
            {getRaceDisplay()} {getClassDisplay()}
          </p>
        </div>
        <div>
          <Label htmlFor="level">Level</Label>
          <Input
            id="level"
            name="level"
            type="number"
            value={characterData.level || 1}
            onChange={handleChange}
            className="w-16 text-center"
            min={1}
            max={20}
          />
        </div>
      </div>

      {/* Ability Scores */}
      <div>
        <h3 className="font-semibold mb-2">Ability Scores</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {ABILITIES.map((ability) => (
            <div
              key={ability}
              className="flex flex-col items-center border rounded-md p-2"
            >
              <Label htmlFor={ability} className="font-bold">
                {ability}
              </Label>
              <Input
                id={ability}
                type="number"
                value={characterData.abilities?.[ability] || 10}
                onChange={(e) => handleAbilityChange(ability, e.target.value)}
                className="text-center mb-1"
                min={1}
                max={30}
              />
              <span className="text-sm font-semibold">
                {formatModifier(
                  getModifier(characterData.abilities?.[ability] || 10)
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Combat Stats */}
      <div>
        <h3 className="font-semibold mb-2">Combat</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <Label htmlFor="hitPoints.max">Max HP</Label>
            <Input
              id="hitPoints.max"
              name="hitPoints.max"
              type="number"
              value={characterData.hitPoints?.max || 0}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="hitPoints.current">Current HP</Label>
            <Input
              id="hitPoints.current"
              name="hitPoints.current"
              type="number"
              value={characterData.hitPoints?.current || 0}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="armorClass">Armor Class</Label>
            <Input
              id="armorClass"
              name="armorClass"
              type="number"
              value={characterData.armorClass || 10}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="initiative">Initiative</Label>
            <Input
              id="initiative"
              name="initiative"
              type="number"
              value={characterData.initiative || 0}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Equipment and Features */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <Label htmlFor="equipment">Equipment</Label>
          <textarea
            id="equipment"
            name="equipment"
            value={characterData.equipment || ""}
            onChange={(e) =>
              setFormData({
                character_data: {
                  ...characterData,
                  equipment: e.target.value,
                },
              })
            }
            className="w-full min-h-20 p-2 border rounded-md"
            placeholder="Weapons, armor, and items..."
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="features">Features & Traits</Label>
          <textarea
            id="features"
            name="features"
            value={characterData.features || ""}
            onChange={(e) =>
              setFormData({
                character_data: {
                  ...characterData,
                  features: e.target.value,
                },
              })
            }
            className="w-full min-h-20 p-2 border rounded-md"
            placeholder="Class features, racial traits, etc..."
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={prevStep}>
          Back to Basics
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : selectedCharacter
            ? "Update Character"
            : "Create Character"}
        </Button>
      </div>
    </form>
  );
}
