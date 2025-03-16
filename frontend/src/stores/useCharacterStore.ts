import { create } from "zustand";
import { Character, CharacterCreateInput } from "@/hooks/useCharacters";

type CharacterModalStep = "basic" | "sheet";

interface CharacterStore {
  modalOpen: boolean;
  modalStep: CharacterModalStep;
  selectedCharacter: Character | undefined;
  campaignId: number | undefined;
  formData: CharacterCreateInput;

  openNewCharacter: (campaignId: number) => void;
  editCharacter: (campaignId: number, character: Character) => void;
  closeModal: () => void;
  nextStep: () => void;
  prevStep: () => void;
  setFormData: (data: Partial<CharacterCreateInput>) => void;
}

const initialFormData: CharacterCreateInput = {
  name: "",
  character_class: "fighter",
  race: "human",
  age: null,
  alignment: "nn",
  bio: "",
  character_data: {},
};

export const useCharacterStore = create<CharacterStore>((set) => ({
  modalOpen: false,
  modalStep: "basic",
  selectedCharacter: undefined,
  campaignId: undefined,
  formData: { ...initialFormData },

  openNewCharacter: (campaignId: number) =>
    set({
      selectedCharacter: undefined,
      campaignId,
      modalOpen: true,
      modalStep: "basic",
      formData: { ...initialFormData },
    }),

  editCharacter: (campaignId: number, character: Character) =>
    set({
      selectedCharacter: character,
      campaignId,
      modalOpen: true,
      modalStep: "basic",
      formData: {
        name: character.name,
        character_class: character.character_class,
        race: character.race,
        age: character.age,
        alignment: character.alignment,
        bio: character.bio || "",
        character_data: character.character_data || {},
      },
    }),

  closeModal: () =>
    set({
      modalOpen: false,
      selectedCharacter: undefined,
    }),

  nextStep: () =>
    set((state) => ({
      modalStep: state.modalStep === "basic" ? "sheet" : state.modalStep,
    })),

  prevStep: () =>
    set((state) => ({
      modalStep: state.modalStep === "sheet" ? "basic" : state.modalStep,
    })),

  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
}));
