"use client";

import { GamePhase } from "@/lib/types/socket";
import { useWallClockCountdown } from "@/lib/hooks/useWallClockCountdown";

interface TimerProps {
  timePerQuestion: number;
  questionNumber: number;
  currentPhase: GamePhase;
  onTimeUp?: () => void;
}

export default function Timer({ timePerQuestion, questionNumber, currentPhase, onTimeUp }: TimerProps) {
  const { timeRemainingSec } = useWallClockCountdown({
    durationSec: timePerQuestion,
    isActive: currentPhase === "question",
    onTimeUp,
    resetKey: questionNumber,
  });

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
          className="text-primary transition-all duration-1000 ease-linear"
          strokeDasharray={`${2 * Math.PI * 14}`}
          strokeDashoffset={`${2 * Math.PI * 14 * (1 - timeRemainingSec / timePerQuestion)}`}
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