"use client";

import { GamePhase } from "@/lib/types/socket";
import { useWallClockCountdown } from "@/lib/hooks/useWallClockCountdown";
import { useEffect, useRef } from "react";
import { useSettings } from "@/lib/context/SettingsContext";
import { audioManager } from "@/lib/utils/audio-manager";

interface TimerProps {
  timePerQuestion: number;
  questionIndex: number;
  currentPhase: GamePhase;
  onTimeUp?: () => void;
  startTimeMs?: number;
}

export default function Timer({
  timePerQuestion,
  questionIndex,
  currentPhase,
  onTimeUp,
  startTimeMs,
}: TimerProps) {
  const { timeRemainingSec } = useWallClockCountdown({
    durationSec: timePerQuestion,
    isActive: currentPhase === "question",
    onTimeUp,
    resetKey: `timer-${questionIndex}-${timePerQuestion}`,
    startTimeMs,
  });

  const { settings } = useSettings();
  const previousWholeSecondsRef = useRef<number | null>(null);
  const shouldAnimate =
    currentPhase === "question" && timeRemainingSec < timePerQuestion;

  useEffect(() => {
    previousWholeSecondsRef.current = Math.ceil(timeRemainingSec);
  }, [questionIndex, currentPhase]);

  useEffect(() => {
    if (currentPhase !== "question") return;
    if (!settings.soundEffectsEnabled) return;

    const currentWhole = Math.ceil(timeRemainingSec);
    const previousWhole = previousWholeSecondsRef.current;
    const THRESHOLD_SECONDS = 5;

    if (
      previousWhole !== null &&
      currentWhole < previousWhole &&
      currentWhole <= THRESHOLD_SECONDS &&
      currentWhole > 0
    ) {
      audioManager.playClockTick(0.18).catch((error) => {
        console.error("Error playing clock tick:", error);
      });
    }

    previousWholeSecondsRef.current = currentWhole;
  }, [
    timeRemainingSec,
    currentPhase,
    settings.soundEffectsEnabled,
    timePerQuestion,
  ]);

  return (
    <div className="relative w-8 h-8">
      <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
        <circle
          cx="16"
          cy="16"
          r="14"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-muted-foreground/20"
        />
        <circle
          cx="16"
          cy="16"
          r="14"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          className={"text-primary"}
          style={{
            strokeDasharray: `${2 * Math.PI * 14}`,
            strokeDashoffset:
              2 * Math.PI * 14 * (1 - timeRemainingSec / timePerQuestion),
            willChange: shouldAnimate ? "stroke-dashoffset" : undefined,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-primary">
          {Math.ceil(timeRemainingSec)}
        </span>
      </div>
    </div>
  );
}
