import React from "react";
import {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { getDifficultySettings } from "@/lib/utils/gameLogic";
import { Difficulty, DIFFICULTY_LEVELS } from "@/lib/constants";

interface DifficultySelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDifficulty: Difficulty;
  setSelectedDifficulty: (value: Difficulty) => void;
  onChangeDifficulty: () => void;
  currentDifficulty: Difficulty;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  open,
  onOpenChange,
  selectedDifficulty,
  setSelectedDifficulty,
  onChangeDifficulty,
  currentDifficulty,
}) => (
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
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {DIFFICULTY_LEVELS.map((level) => {
            const settings = getDifficultySettings(level);
            return (
              <SelectItem key={level} value={level}>
                {settings.label} ({settings.count} countries)
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
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
);

export default DifficultySelector;
