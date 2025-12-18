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
import { SignalIcon } from "lucide-react";
import { getDifficultySettings } from "@/lib/utils/gameLogic";
import { Difficulty, DIFFICULTY_LEVELS } from "@/lib/constants";
import { GameState } from "./FlagGameClient";

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
      <AlertDialogContent className="max-w-[92vw] sm:max-w-xl p-4 sm:p-8">
        <AlertDialogHeader className="mb-4 sm:mb-6">
          <AlertDialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
            <SignalIcon className="w-6 h-6 text-primary" />
            Change Difficulty
          </AlertDialogTitle>
          <AlertDialogDescription className="font-mono text-xs uppercase tracking-widest">
            Restart game with a new difficulty level.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-6 mt-2">
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground ml-1">Select Difficulty</span>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty as any}>
              <SelectTrigger className="w-full h-12 sm:h-14 font-black uppercase text-base border-2 border-foreground shadow-retro">
                <SelectValue>
                  {`${difficultySettings.label} (${difficultySettings.count} countries)`}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-w-[92vw] sm:max-w-md w-full">
                {DIFFICULTY_LEVELS.map((level) => {
                  const settings = getDifficultySettings(level);
                  let description = "";
                  switch (level) {
                    case "easy":
                      description = "Primary identification — high-visibility global entities.";
                      break;
                    case "medium":
                      description = "Standard operational set — includes moderate complexity.";
                      break;
                    case "hard":
                      description = "Deep identification — all global entities included.";
                      break;
                    case "expert":
                      description = "Maximum challenge — obscure entities and similar patterns.";
                      break;
                    default:
                      description = "";
                  }
                  return (
                    <SelectItem key={level} value={level} className="py-3 px-4 group">
                      <div className="flex flex-col gap-1">
                        <span className="font-black uppercase tracking-tight text-sm">
                          {settings.label} ({settings.count} units)
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground group-focus:text-primary-foreground/80 uppercase leading-tight tracking-wide">{description}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleDifficultyChange}
            className="w-full h-12 sm:h-14 font-black uppercase text-lg border-2 border-foreground shadow-retro bg-primary text-primary-foreground hover:translate-y-[2px] hover:shadow-none transition-all"
            disabled={selectedDifficulty === currentDifficulty}
          >
            CONFIRM SELECTION
          </Button>
        </div>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel className="w-full font-mono text-xs uppercase tracking-widest border-2 border-foreground hover:bg-muted">Cancel</AlertDialogCancel>
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


