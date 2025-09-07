import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HeartIcon, TimerIcon, FlagIcon, CompassIcon } from "lucide-react";
import { TIME_PER_QUESTION_OPTIONS } from "@/lib/constants";
import { useSettings } from "@/lib/context/SettingsContext";

interface ModesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  heartsModeEnabled: boolean;
  onToggleHeartsMode: (value: boolean) => void;
  onRequestRestart: () => void;
  onStartTimedMode?: (durationSec: number) => void;
  onStartClassic?: () => void;
  onStartHearts?: () => void;
}

const ModesDialog: React.FC<ModesDialogProps> = ({
  open,
  onOpenChange,
  heartsModeEnabled,
  onToggleHeartsMode,
  onRequestRestart,
  onStartTimedMode,
  onStartClassic,
  onStartHearts,
}) => {
  const { settings } = useSettings();
  const [showHeartsConfirm, setShowHeartsConfirm] = useState(false);
  const [pendingHearts, setPendingHearts] =
    useState<boolean>(heartsModeEnabled);
  const [timePerQuestion, setTimePerQuestion] = useState<number>(
    settings.timePerQuestion
  );

  useEffect(() => {
    if (open) {
      setPendingHearts(heartsModeEnabled);
      setTimePerQuestion(settings.timePerQuestion);
    }
  }, [open, heartsModeEnabled, settings.timePerQuestion]);

  const confirmHeartsRestart = () => {
    setShowHeartsConfirm(false);
    onToggleHeartsMode(pendingHearts);
    onRequestRestart();
  };

  const startTimedMode = () => {
    const nextDuration = Number(timePerQuestion);
    onStartTimedMode?.(nextDuration);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[92vw] sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Modes</AlertDialogTitle>
          <AlertDialogDescription>
            Configure singleplayer modes.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2 mt-1 sm:mt-2">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-2 sm:gap-3 p-3 rounded-lg border bg-card">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <CompassIcon className="w-6 h-6 sm:w-5 sm:h-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <div className="font-medium text-sm">Classic Mode</div>
                <div className="text-xs text-muted-foreground leading-tight break-words">
                  Just answer questions till the end
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto sm:shrink-0">
              <Button
                size="sm"
                variant="default"
                className="w-full sm:w-auto sm:min-w-[72px]"
                onClick={() => {
                  if (onStartClassic) {
                    onStartClassic();
                  } else {
                    onToggleHeartsMode(false);
                    onRequestRestart();
                  }
                  onOpenChange(false);
                }}
              >
                Start
              </Button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-2 sm:gap-3 p-3 rounded-lg border bg-card">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <HeartIcon
                className={`w-6 h-6 sm:w-5 sm:h-5 shrink-0 ${
                  heartsModeEnabled
                    ? "text-red-500 fill-red-500"
                    : "text-muted-foreground"
                }`}
              />
              <div className="min-w-0">
                <div className="font-medium text-sm">Hearts Mode</div>
                <div className="text-xs text-muted-foreground leading-tight break-words">
                  Lose a heart for each wrong answer
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto sm:shrink-0">
              <Button
                size="sm"
                variant="default"
                className="w-full sm:w-auto sm:min-w-[72px]"
                onClick={() => {
                  if (onStartHearts) {
                    onStartHearts();
                  } else {
                    onToggleHeartsMode(true);
                    onRequestRestart();
                  }
                  onOpenChange(false);
                }}
              >
                Start
              </Button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-2 sm:gap-3 p-3 rounded-lg border bg-card">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <TimerIcon className="w-6 h-6 sm:w-5 sm:h-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <div className="font-medium text-sm">Timed Mode</div>
                <div className="text-xs text-muted-foreground leading-tight break-words">
                  Start a timed game with a countdown per question
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto sm:shrink-0">
              <div className="w-full sm:w-auto min-w-0">
                <Select
                  value={String(timePerQuestion)}
                  onValueChange={(value) => setTimePerQuestion(Number(value))}
                >
                  <SelectTrigger className="w-full sm:w-24 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_PER_QUESTION_OPTIONS.map((sec) => (
                      <SelectItem key={sec} value={String(sec)}>
                        {sec}s
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button size="sm" variant="default" className="w-full sm:w-auto sm:min-w-[72px]" onClick={startTimedMode}>
                Start
              </Button>
            </div>
          </div>
        </div>

        <AlertDialogFooter className="pt-2 sm:pt-3">
          <AlertDialogCancel className="w-full">Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>

      <AlertDialog open={showHeartsConfirm} onOpenChange={setShowHeartsConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restart Game?</AlertDialogTitle>
            <AlertDialogDescription>
              Changing hearts mode will restart the game and you'll lose your
              current progress. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowHeartsConfirm(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmHeartsRestart}
              variant="destructive"
            >
              Restart Game
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertDialog>
  );
};

export default ModesDialog;
