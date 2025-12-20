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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HeartIcon, TimerIcon, CompassIcon, SwordsIcon } from "lucide-react";
import { TIME_PER_QUESTION_OPTIONS } from "@/lib/constants";
import { useSettings } from "@/lib/context/SettingsContext";

interface GameModesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  limitedLifeModeEnabled: boolean;
  activeTimeAttackDuration: number | null;
  onToggleLimitedLifeMode: (value: boolean) => void;
  onRequestRestart: () => void;
  onStartTimeAttack?: (durationSec: number) => void;
  onStartClassic?: () => void;
  onStartLimitedLife?: () => void;
}

const GameModesDialog: React.FC<GameModesDialogProps> = ({
  open,
  onOpenChange,
  limitedLifeModeEnabled,
  activeTimeAttackDuration,
  onToggleLimitedLifeMode,
  onRequestRestart,
  onStartTimeAttack,
  onStartClassic,
  onStartLimitedLife,
}) => {
  const { settings } = useSettings();
  const [showLimitedLifeConfirm, setShowLimitedLifeConfirm] = useState(false);
  const [pendingLimitedLife, setPendingLimitedLife] = useState<boolean>(limitedLifeModeEnabled);
  const [timePerQuestion, setTimePerQuestion] = useState<number>(settings.timePerQuestion);

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

  const isClassicActive = !limitedLifeModeEnabled && activeTimeAttackDuration === null;
  const isLimitedLifeActive = limitedLifeModeEnabled;
  const isTimeAttackActive = activeTimeAttackDuration !== null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[92vw] sm:max-w-2xl p-4 sm:p-8 max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader className="mb-4 sm:mb-6">
          <AlertDialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
            <SwordsIcon className="w-6 h-6 text-primary" />
            Game Modes
          </AlertDialogTitle>
          <AlertDialogDescription className="font-mono text-xs uppercase tracking-widest">
            Restart with a new game mode.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-3 mt-2">
          <div
            className={`flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-4 p-4 sm:p-5 rounded-sm border-2 transition-all shadow-retro ${
              isClassicActive ? "border-primary bg-primary/5" : "border-foreground bg-card shadow-primary/10"
            }`}
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <CompassIcon className="w-8 h-8 sm:w-6 sm:h-6 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <div className="font-black uppercase tracking-tight text-base sm:text-lg">Classic Mode</div>
                <div className="text-xs font-mono text-muted-foreground leading-normal mt-0.5">
                  Standard procedure — identify all flags in the set.
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto sm:shrink-0">
              <Button
                size="lg"
                variant={isClassicActive ? "outline" : "default"}
                disabled={isClassicActive}
                className="w-full sm:w-auto sm:min-w-[120px] font-black"
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
                {isClassicActive ? "SELECTED" : "SELECT"}
              </Button>
            </div>
          </div>

          <div
            className={`flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-4 p-4 sm:p-5 rounded-sm border-2 transition-all shadow-retro ${
              isLimitedLifeActive ? "border-primary bg-primary/5" : "border-foreground bg-card shadow-primary/10"
            }`}
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <HeartIcon
                className={`w-8 h-8 sm:w-6 sm:h-6 shrink-0 ${
                  isLimitedLifeActive ? "text-red-500 fill-red-500" : "text-muted-foreground"
                }`}
              />
              <div className="min-w-0">
                <div className="font-black uppercase tracking-tight text-base sm:text-lg">Limited Life</div>
                <div className="text-xs font-mono text-muted-foreground leading-normal mt-0.5">
                  High stakes — failure reduces terminal heart count.
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto sm:shrink-0">
              <Button
                size="lg"
                variant={isLimitedLifeActive ? "outline" : "default"}
                disabled={isLimitedLifeActive}
                className="w-full sm:w-auto sm:min-w-[120px] font-black"
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
                {isLimitedLifeActive ? "SELECTED" : "SELECT"}
              </Button>
            </div>
          </div>

          <div
            className={`flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-4 p-4 sm:p-5 rounded-sm border-2 transition-all shadow-retro ${
              isTimeAttackActive ? "border-primary bg-primary/5" : "border-foreground bg-card shadow-primary/10"
            }`}
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <TimerIcon className={`w-8 h-8 sm:w-6 sm:h-6 shrink-0 ${isTimeAttackActive ? "text-primary" : ""}`} />
              <div className="min-w-0">
                <div className="font-black uppercase tracking-tight text-base sm:text-lg">Time Attack</div>
                <div className="text-xs font-mono text-muted-foreground leading-normal mt-0.5">
                  Rapid identification — limited window per guess.
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto sm:shrink-0">
              <div className="w-full sm:w-auto min-w-0">
                <Select value={String(timePerQuestion)} onValueChange={(value) => setTimePerQuestion(Number(value))}>
                  <SelectTrigger className="w-full sm:w-24 h-11 sm:h-10 text-sm font-bold border-2 border-foreground/20">
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
                size="lg"
                variant={isTimeAttackActive && timePerQuestion === activeTimeAttackDuration ? "outline" : "default"}
                disabled={isTimeAttackActive && timePerQuestion === activeTimeAttackDuration}
                className="w-full sm:w-auto sm:min-w-[120px] font-black"
                onClick={startTimeAttack}
              >
                {isTimeAttackActive && timePerQuestion === activeTimeAttackDuration
                  ? "SELECTED"
                  : isTimeAttackActive
                  ? "RESTART"
                  : "SELECT"}
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
              Changing hearts mode will restart the game and you&apos;ll lose your current progress. Are you sure you want to
              continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowLimitedLifeConfirm(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLimitedLifeRestart} variant="destructive">
              Restart Game
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertDialog>
  );
};

export default GameModesDialog;
