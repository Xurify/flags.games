import React, { useEffect, useState } from "react";
import {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialog,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { getDifficultySettings } from "@/lib/utils/gameLogic";
import { Difficulty, DIFFICULTY_LEVELS } from "@/lib/constants";
import { GameState } from "./FlagGameClient";
import { useSettings } from "@/lib/context/SettingsContext";

interface DifficultySelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChangeDifficulty: (difficulty: Difficulty) => void;
  currentDifficulty: Difficulty;
  gameState: GameState;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  open,
  onOpenChange,
  onChangeDifficulty,
  currentDifficulty,
  gameState,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState(currentDifficulty);
  const [showDifficultyRestartDialog, setShowDifficultyRestartDialog] = useState(false);
  const difficultySettings = getDifficultySettings(selectedDifficulty);

  useEffect(() => {
    if (open) {
      setSelectedDifficulty(currentDifficulty);
    }
  }, [open, currentDifficulty]);

  const handleDifficultyChange = () => {
    if (gameState.currentQuestion > 1 && selectedDifficulty !== currentDifficulty) {
      setShowDifficultyRestartDialog(true);
    } else {
      onChangeDifficulty(selectedDifficulty);
    }
  };

  const handleConfirmDifficultyRestart = () => {
    setShowDifficultyRestartDialog(false);
    onChangeDifficulty(selectedDifficulty);
  };

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
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty as any}>
            <SelectTrigger className="w-full">
              <SelectValue>
                {`${difficultySettings.label} (${difficultySettings.count} countries)`}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-w-[80vw] w-full sm:w-auto">
              {DIFFICULTY_LEVELS.map((level) => {
                const settings = getDifficultySettings(level);
                let description = "";
                switch (level) {
                  case "easy":
                    description = "Only the most recognizable/distinctive flags worldwide.";
                    break;
                  case "medium":
                    description = "Like easy difficulty, includes moderately recognizable flags.";
                    break;
                  case "hard":
                    description = "All countries, more obscure/unknown flags.";
                    break;
                  case "expert":
                    description = "All countries, similar to hard difficulty, but with more challenging options";
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
                      <span className="text-xs text-muted-foreground mt-0.5">{description}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <Button onClick={handleDifficultyChange} className="w-full mt-2" disabled={selectedDifficulty === currentDifficulty}>
            Change Difficulty
          </Button>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="w-full">Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>

      <AlertDialog open={showDifficultyRestartDialog} onOpenChange={setShowDifficultyRestartDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restart Game?</AlertDialogTitle>
            <AlertDialogDescription>
              Changing the difficulty will restart the game and you'll lose your current progress. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDifficultyRestartDialog(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDifficultyRestart} variant="destructive">
              Restart Game
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertDialog>
  );
};

export default DifficultySelector;


