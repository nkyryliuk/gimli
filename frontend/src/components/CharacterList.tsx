import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PlusIcon,
  UserIcon,
  Trash as TrashIcon,
  Edit as EditIcon,
} from "lucide-react";
import { useCharacters } from "@/hooks/useCharacters";
import { useCharacterStore } from "@/stores/useCharacterStore";
import { toast } from "sonner";

interface CharacterListProps {
  campaignId: number;
}

export function CharacterList({ campaignId }: CharacterListProps) {
  const { characters, isLoading, isError, deleteCharacter, refetch } =
    useCharacters(campaignId);

  const { openNewCharacter, editCharacter } = useCharacterStore();

  const handleDelete = async (characterId: number) => {
    if (!confirm("Are you sure you want to delete this character?")) {
      return;
    }

    try {
      deleteCharacter(characterId);
      toast.success("Character deleted successfully");
    } catch (error) {
      toast.error("Failed to delete character");
      console.error("Error deleting character:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-6">
        <p className="text-red-500 mb-2">Failed to load characters</p>
        <Button variant="outline" onClick={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Characters</h3>
        <Button
          onClick={() => openNewCharacter(campaignId)}
          className="flex items-center gap-1"
          size="sm"
        >
          <PlusIcon size={16} />
          <span>Add Character</span>
        </Button>
      </div>

      {characters.length === 0 ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-8">
          <UserIcon size={32} className="text-gray-400 mb-4" />
          <p className="text-gray-500 mb-4">No characters yet</p>
          <Button onClick={() => openNewCharacter(campaignId)}>
            Create Your First Character
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {characters.map((character) => (
            <Card key={character.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <span>{character.name}</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Lvl {character.character_data?.level || 1}
                  </span>
                </CardTitle>
              </CardHeader>

              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground">
                  {character.character_class_display} • {character.race_display}
                </p>

                {character.bio && (
                  <p className="text-sm mt-2 line-clamp-3">{character.bio}</p>
                )}

                {character.character_data?.abilities && (
                  <div className="grid grid-cols-6 gap-1 mt-3">
                    {["STR", "DEX", "CON", "INT", "WIS", "CHA"].map(
                      (ability) => (
                        <div
                          key={ability}
                          className="flex flex-col items-center"
                        >
                          <span className="text-xs text-muted-foreground">
                            {ability}
                          </span>
                          <span className="text-sm font-medium">
                            {character.character_data?.abilities[ability] || 10}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}
              </CardContent>

              <CardFooter className="bg-muted/20 pt-3">
                <div className="flex justify-between w-full">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(character.id)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <TrashIcon size={16} className="mr-1" />
                    Delete
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editCharacter(campaignId, character)}
                  >
                    <EditIcon size={16} className="mr-1" />
                    Edit
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
