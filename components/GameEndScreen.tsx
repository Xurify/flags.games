import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface GameEndScreenProps {
  score: number;
  totalPossible: number;
  percentage: number;
  onPlayAgain: () => void;
  onChangeDifficulty: () => void;
}

const CIRCLE_SIZE = 240;
const STROKE_WIDTH = 10;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const GameEndScreen: React.FC<GameEndScreenProps> = ({
  score,
  totalPossible,
  percentage,
  onPlayAgain,
  onChangeDifficulty,
}) => {
  const progress = Math.max(0, Math.min(percentage, 100));
  const offset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;

  return (
    <div className="w-full">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-semibold text-foreground leading-[1] mb-6">Game Over</h1>
      </div>
      <div className="relative flex items-center justify-center mb-6">
        <svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
          <circle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={RADIUS}
            stroke="#e5e7eb"
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
          <circle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={RADIUS}
            stroke="#2563eb"
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 0.6s cubic-bezier(.4,2,.6,1)",
            }}
            transform={`rotate(-90 ${CIRCLE_SIZE / 2} ${CIRCLE_SIZE / 2})`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold text-blue-700">
            {score}/{totalPossible}
          </span>
          <span className="text-sm text-muted-foreground mt-1">
            {score} points
          </span>
        </div>
      </div>
      <div className="text-sm text-muted-foreground mb-8 text-center">
        {score === totalPossible
          ? 'You did fantastic! Perfect score!'
          : 'Try again to beat your own score.'}
      </div>
      <div className="flex flex-col gap-3 w-full">
        <Button onClick={onPlayAgain} className="w-full" size="lg">
          Play Again
        </Button>
        <Button
          variant="outline"
          className="w-full"
          size="lg"
          onClick={onChangeDifficulty}
        >
          Change Difficulty
        </Button>
      </div>
    </div>
  );
};

export default GameEndScreen;
