import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCharacterStore } from "@/stores/useCharacterStore";

export function CharacterBasicForm() {
  const { formData, setFormData, nextStep } = useCharacterStore();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "age") {
      const ageValue = value ? parseInt(value, 10) : null;
      setFormData({ [name]: ageValue });
    } else {
      setFormData({ [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  const raceOptions = [
    { value: "dragonborn", label: "Dragonborn" },
    { value: "dwarf", label: "Dwarf" },
    { value: "elf", label: "Elf" },
    { value: "gnome", label: "Gnome" },
    { value: "half_elf", label: "Half-Elf" },
    { value: "half_orc", label: "Half-Orc" },
    { value: "halfling", label: "Halfling" },
    { value: "human", label: "Human" },
    { value: "tiefling", label: "Tiefling" },
    { value: "orc", label: "Orc" },
    { value: "leonin", label: "Leonin" },
    { value: "satyr", label: "Satyr" },
    { value: "aasimar", label: "Aasimar" },
    { value: "fairy", label: "Fairy" },
    { value: "harengon", label: "Harengon" },
    { value: "tabaxi", label: "Tabaxi" },
    { value: "tortle", label: "Tortle" },
    { value: "genasi", label: "Genasi" },
    { value: "goliath", label: "Goliath" },
    { value: "other", label: "Other" },
  ];

  const classOptions = [
    { value: "barbarian", label: "Barbarian" },
    { value: "bard", label: "Bard" },
    { value: "cleric", label: "Cleric" },
    { value: "druid", label: "Druid" },
    { value: "fighter", label: "Fighter" },
    { value: "monk", label: "Monk" },
    { value: "paladin", label: "Paladin" },
    { value: "ranger", label: "Ranger" },
    { value: "rogue", label: "Rogue" },
    { value: "sorcerer", label: "Sorcerer" },
    { value: "warlock", label: "Warlock" },
    { value: "wizard", label: "Wizard" },
    { value: "artificer", label: "Artificer" },
    { value: "blood_hunter", label: "Blood Hunter" },
  ];

  const alignmentOptions = [
    { value: "lg", label: "Lawful Good" },
    { value: "ng", label: "Neutral Good" },
    { value: "cg", label: "Chaotic Good" },
    { value: "ln", label: "Lawful Neutral" },
    { value: "nn", label: "True Neutral" },
    { value: "cn", label: "Chaotic Neutral" },
    { value: "le", label: "Lawful Evil" },
    { value: "ne", label: "Neutral Evil" },
    { value: "ce", label: "Chaotic Evil" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Character Name *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter character name"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="race">Race *</Label>
          <select
            id="race"
            name="race"
            value={formData.race}
            onChange={handleChange}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            required
          >
            {raceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="character_class">Class *</Label>
          <select
            id="character_class"
            name="character_class"
            value={formData.character_class}
            onChange={handleChange}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            required
          >
            {classOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            name="age"
            type="number"
            value={formData.age === null ? "" : formData.age}
            onChange={handleChange}
            placeholder="Enter age"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="alignment">Alignment *</Label>
          <select
            id="alignment"
            name="alignment"
            value={formData.alignment}
            onChange={handleChange}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            required
          >
            {alignmentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Background/Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Character background and personality"
          rows={4}
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit">Next: Character Sheet</Button>
      </div>
    </form>
  );
}
