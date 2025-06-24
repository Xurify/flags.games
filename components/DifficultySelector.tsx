import React from "react";
import {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialog,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { getDifficultySettings } from "@/lib/utils/gameLogic";
import { Difficulty, DIFFICULTY_LEVELS } from "@/lib/constants";
import { Heart } from "lucide-react";
import { GameState } from "./FlagGameClient";

interface DifficultySelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDifficulty: Difficulty;
  setSelectedDifficulty: (value: Difficulty) => void;
  onChangeDifficulty: () => void;
  currentDifficulty: Difficulty;
  heartsModeEnabled: boolean;
  onToggleHeartsMode: (value: boolean) => void;
  gameState: GameState;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  open,
  onOpenChange,
  selectedDifficulty,
  setSelectedDifficulty,
  onChangeDifficulty,
  onToggleHeartsMode,
  currentDifficulty,
  heartsModeEnabled,
  gameState,
}) => {
  const settings = getDifficultySettings(selectedDifficulty);
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Change Difficulty</AlertDialogTitle>
          <AlertDialogDescription>
            Select a new difficulty level for your next game.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 mt-2">
          <Select
            value={selectedDifficulty}
            onValueChange={setSelectedDifficulty as any}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                {`${settings.label} (${settings.count} countries)`}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-w-[80vw] w-full sm:w-auto">
              {DIFFICULTY_LEVELS.map((level) => {
                const settings = getDifficultySettings(level);
                let description = "";
                switch (level) {
                  case "easy":
                    description =
                      "Only the most recognizable/distinctive flags worldwide.";
                    break;
                  case "medium":
                    description =
                      "Like easy difficulty, includes moderately recognizable flags.";
                    break;
                  case "hard":
                    description =
                      "All countries, more obscure/unknown flags.";
                    break;
                  case "expert":
                    description =
                      "All countries, similar to hard difficulty, but with more challenging options";
                    break;
                  default:
                    description = "";
                }
                return (
                  <SelectItem key={level} value={level}>
                    <div className="flex flex-col">
                      <span>
                        {settings.label} ({settings.count} countries)
                      </span>
                      <span className="text-xs text-muted-foreground mt-0.5">
                        {description}
                      </span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
              <div className="flex items-center gap-3">
                <Heart
                  className={`w-5 h-5 ${
                    heartsModeEnabled
                      ? "text-red-500 fill-red-500"
                      : "text-muted-foreground"
                  }`}
                />
                <div>
                  <div className="font-medium text-sm">Hearts Mode</div>
                  <div className="text-xs text-muted-foreground">
                    Lose a heart for each wrong answer
                  </div>
                </div>
              </div>
              <Switch
                checked={heartsModeEnabled}
                onCheckedChange={onToggleHeartsMode}
                className={
                  heartsModeEnabled ? "data-[state=checked]:bg-red-500" : ""
                }
                disabled={gameState.currentQuestion > 1}
                title={
                  gameState.currentQuestion > 1
                    ? "You cannot change while the game is in session"
                    : undefined
                }
              />
            </div>
          </div>

          <Button
            onClick={onChangeDifficulty}
            className="w-full mt-2"
            disabled={selectedDifficulty === currentDifficulty}
          >
            Change Difficulty
          </Button>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DifficultySelector;
