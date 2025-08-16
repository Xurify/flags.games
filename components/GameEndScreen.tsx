import React, { useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

interface GameEndScreenProps {
  score: number;
  totalPossible: number;
  percentage: number;
  onPlayAgain: () => void;
  onChangeDifficulty: () => void;
  heartsModeEnabled?: boolean;
  hearts?: number;
}

const CIRCLE_SIZE = 180;
const STROKE_WIDTH = 12;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const GameEndScreen: React.FC<GameEndScreenProps> = ({
  score,
  totalPossible,
  percentage,
  onPlayAgain,
  onChangeDifficulty,
  heartsModeEnabled,
  hearts,
}) => {
  const progress = Math.max(0, Math.min(percentage, 100));
  const offset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;
  
  const isHeartsModeGameOver = heartsModeEnabled && hearts === 0;
  const isPerfectScore = score === totalPossible;

  const getGameOverMessage = useCallback(() => {
    if (isHeartsModeGameOver) {
      return "You ran out of hearts! 💔";
    }
    if (isPerfectScore) {
      return "Holy smokes! You really know your stuff! 👏";
    }
    return "Try again to beat your own score. 👏";
  }, []);

  const accuracyLabel = useMemo(() => `${progress}%`, [progress]);

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-3">
          <Trophy className="w-7 h-7" aria-hidden />
        </div>
        <h1 className="text-2xl font-bold text-foreground leading-tight">
          {isHeartsModeGameOver ? "Game Over" : "Game Complete"}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">{getGameOverMessage()}</p>
      </div>

      <div className="relative flex items-center justify-center mb-6">
        <svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={isHeartsModeGameOver ? "#ef4444" : "#3b82f6"} />
              <stop offset="100%" stopColor={isHeartsModeGameOver ? "#f97316" : "#22d3ee"} />
            </linearGradient>
          </defs>
          <circle cx={CIRCLE_SIZE / 2} cy={CIRCLE_SIZE / 2} r={RADIUS} stroke="#e5e7eb" strokeWidth={STROKE_WIDTH} fill="none" />
          <circle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={RADIUS}
            stroke="url(#progressGradient)"
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(.4,2,.6,1)" }}
            transform={`rotate(-90 ${CIRCLE_SIZE / 2} ${CIRCLE_SIZE / 2})`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-xs uppercase text-muted-foreground">Accuracy</div>
          <div className="text-4xl font-extrabold text-foreground">{accuracyLabel}</div>
          <div className="text-xs text-muted-foreground mt-1">{score}/{totalPossible} correct</div>
        </div>
      </div>

      {heartsModeEnabled && (
        <div className="grid grid-cols-1 sm:grid-cols-1 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4 text-center">
            <div className="text-xs uppercase text-muted-foreground mb-1">Hearts Left</div>
            <div className={`text-2xl font-bold ${isHeartsModeGameOver ? "text-red-600" : ""}`}>{hearts ?? 0}</div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <Button onClick={onPlayAgain} className="w-full sm:w-1/2" size="lg">Play Again</Button>
        <Button variant="outline" className="w-full sm:w-1/2" size="lg" onClick={onChangeDifficulty}>Change Difficulty</Button>
      </div>
    </div>
  );
};

export default GameEndScreen;
