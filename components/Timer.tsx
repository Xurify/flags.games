"use client";

import { GamePhase } from "@/lib/types/socket";
import { useState, useEffect, useRef } from "react";

interface TimerProps {
  timePerQuestion: number;
  questionNumber: number;
  currentPhase: GamePhase;
  onTimeUp?: () => void;
}

export default function Timer({ timePerQuestion, questionNumber, currentPhase, onTimeUp }: TimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(timePerQuestion);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTimeRemaining(timePerQuestion);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (currentPhase === "question") {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 0) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            if (onTimeUp) {
              onTimeUp();
            }
            return 0;
          }
          return prev - 0.5;
        });
      }, 500);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [questionNumber, currentPhase, timePerQuestion, onTimeUp]);

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
          strokeDashoffset={`${2 * Math.PI * 14 * (1 - timeRemaining / timePerQuestion)}`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-primary">
          {Math.ceil(timeRemaining)}
        </span>
      </div>
    </div>
  );
} 