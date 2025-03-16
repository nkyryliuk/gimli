import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCharacterStore } from "@/stores/useCharacterStore";
import { CharacterBasicForm } from "./CharacterBasicForm";
import { CharacterSheetForm } from "./CharacterSheetForm";

export function CharacterModal() {
  const { modalOpen, modalStep, selectedCharacter, closeModal } =
    useCharacterStore();

  const getTitle = () => {
    if (selectedCharacter) {
      return modalStep === "basic"
        ? "Edit Character"
        : `Edit ${selectedCharacter.name}'s Sheet`;
    }
    return modalStep === "basic"
      ? "Create New Character"
      : "Complete Character Sheet";
  };

  const getDescription = () => {
    if (modalStep === "basic") {
      return selectedCharacter
        ? "Update your character details"
        : "Enter your character details";
    }
    return "Fill out your character abilities and stats";
  };

  return (
    <Dialog open={modalOpen} onOpenChange={closeModal}>
      <DialogContent
        className={modalStep === "sheet" ? "sm:max-w-3xl" : "sm:max-w-md"}
      >
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>

        {modalStep === "basic" ? (
          <CharacterBasicForm />
        ) : (
          <CharacterSheetForm />
        )}
      </DialogContent>
    </Dialog>
  );
}
