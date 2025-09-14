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
  limitedLifeModeEnabled: boolean;
  onToggleLimitedLifeMode: (value: boolean) => void;
  onRequestRestart: () => void;
  onStartTimeAttack?: (durationSec: number) => void;
  onStartClassic?: () => void;
  onStartLimitedLife?: () => void;
}

const ModesDialog: React.FC<ModesDialogProps> = ({
  open,
  onOpenChange,
  limitedLifeModeEnabled,
  onToggleLimitedLifeMode,
  onRequestRestart,
  onStartTimeAttack,
  onStartClassic,
  onStartLimitedLife,
}) => {
  const { settings } = useSettings();
  const [showLimitedLifeConfirm, setShowLimitedLifeConfirm] = useState(false);
  const [pendingLimitedLife, setPendingLimitedLife] =
    useState<boolean>(limitedLifeModeEnabled);
  const [timePerQuestion, setTimePerQuestion] = useState<number>(
    settings.timePerQuestion
  );

  useEffect(() => {
    if (open) {
      setPendingLimitedLife(limitedLifeModeEnabled);
      setTimePerQuestion(settings.timePerQuestion);
    }
  }, [open, limitedLifeModeEnabled, settings.timePerQuestion]);

  const confirmLimitedLifeRestart = () => {
    setShowLimitedLifeConfirm(false);
    onToggleLimitedLifeMode(pendingLimitedLife);
    onRequestRestart();
  };

  const startTimeAttack = () => {
    const nextDuration = Number(timePerQuestion);
    onStartTimeAttack?.(nextDuration);
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
                    onToggleLimitedLifeMode(false);
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
                  limitedLifeModeEnabled
                    ? "text-red-500 fill-red-500"
                    : "text-muted-foreground"
                }`}
              />
              <div className="min-w-0">
                <div className="font-medium text-sm">Limited Life</div>
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
                  if (onStartLimitedLife) {
                    onStartLimitedLife();
                  } else {
                    onToggleLimitedLifeMode(true);
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
                <div className="font-medium text-sm">Time Attack</div>
                <div className="text-xs text-muted-foreground leading-tight break-words">
                  Answer each question within a limited time frame
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
              <Button
                size="sm"
                variant="default"
                className="w-full sm:w-auto sm:min-w-[72px]"
                onClick={startTimeAttack}
              >
                Start
              </Button>
            </div>
          </div>
        </div>

        <AlertDialogFooter className="pt-2 sm:pt-3">
          <AlertDialogCancel className="w-full">Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>

      <AlertDialog open={showLimitedLifeConfirm} onOpenChange={setShowLimitedLifeConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restart Game?</AlertDialogTitle>
            <AlertDialogDescription>
              Changing hearts mode will restart the game and you'll lose your
              current progress. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowLimitedLifeConfirm(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmLimitedLifeRestart}
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
