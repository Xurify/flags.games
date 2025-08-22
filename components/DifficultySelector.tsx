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
import { HeartIcon } from "lucide-react";
import { GameState } from "./FlagGameClient";

interface DifficultySelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChangeDifficulty: (difficulty: Difficulty) => void;
  currentDifficulty: Difficulty;
  heartsModeEnabled: boolean;
  onToggleHeartsMode: (value: boolean) => void;
  gameState: GameState;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  open,
  onOpenChange,
  onChangeDifficulty,
  onToggleHeartsMode,
  currentDifficulty,
  heartsModeEnabled,
  gameState,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState(currentDifficulty);
  const [showDifficultyRestartDialog, setShowDifficultyRestartDialog] = useState(false);
  const [showHeartsRestartDialog, setShowHeartsRestartDialog] = useState(false);
  const [pendingHeartsMode, setPendingHeartsMode] = useState(false);
  const settings = getDifficultySettings(selectedDifficulty);

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

  const handleHeartsToggle = (value: boolean) => {
    if (gameState.currentQuestion > 1 && value !== heartsModeEnabled) {
      setPendingHeartsMode(value);
      setShowHeartsRestartDialog(true);
    } else {
      onToggleHeartsMode(value);
    }
  };

  const handleConfirmDifficultyRestart = () => {
    setShowDifficultyRestartDialog(false);
    onChangeDifficulty(selectedDifficulty);
  };

  const handleConfirmHeartsModeRestart = () => {
    setShowHeartsRestartDialog(false);
    onToggleHeartsMode(pendingHeartsMode);
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
                <HeartIcon
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
                onCheckedChange={handleHeartsToggle}
                className={
                  heartsModeEnabled ? "data-[state=checked]:bg-red-500" : ""
                }
              />
            </div>
          </div>

          <Button
            onClick={handleDifficultyChange}
            className="w-full mt-2"
            disabled={selectedDifficulty === currentDifficulty}
          >
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
            <AlertDialogCancel onClick={() => setShowDifficultyRestartDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDifficultyRestart} variant="destructive">
              Restart Game
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showHeartsRestartDialog} onOpenChange={setShowHeartsRestartDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restart Game?</AlertDialogTitle>
            <AlertDialogDescription>
              Changing hearts mode will restart the game and you'll lose your current progress. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowHeartsRestartDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmHeartsModeRestart} variant="destructive">
              Restart Game
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertDialog>
  );
};

export default DifficultySelector;
