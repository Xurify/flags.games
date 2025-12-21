"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils/strings";
import { GamePhase, Timer } from "@/lib/types/socket";
import { useWallClockCountdown } from "@/lib/hooks/useWallClockCountdown";

interface CountdownOverlayProps {
  currentPhase: GamePhase;
  timer: Timer | null;
  questionIndex?: number;
  totalQuestions?: number;
}

export default function CountdownOverlay({ currentPhase, timer, questionIndex, totalQuestions }: CountdownOverlayProps) {
  const { timeRemainingSec } = useWallClockCountdown({
    durationSec: timer?.duration ?? 3,
    startTimeMs: timer?.startTime,
    isActive: currentPhase === "results" && !!timer,
  });

  const barRef = useRef<HTMLDivElement>(null);
  const isVisible = currentPhase === "results";
  const countdown = Math.max(0, Math.ceil(timeRemainingSec));

  const isLastQuestion = questionIndex && totalQuestions && questionIndex >= totalQuestions;
  const message = isLastQuestion ? "Final Results In" : "Next Question In";

  useEffect(() => {
    if (!isVisible || !timer || !barRef.current) return;

    let rafId: number;
    const duration = timer.duration * 1000;
    const endTime = timer.startTime + duration;

    const updateBar = () => {
      const remaining = Math.max(0, endTime - Date.now());
      const progress = remaining / duration;
      if (barRef.current) {
        barRef.current.style.width = `${progress * 100}%`;
      }
      if (remaining > 0) {
        rafId = requestAnimationFrame(updateBar);
      }
    };

    rafId = requestAnimationFrame(updateBar);
    return () => cancelAnimationFrame(rafId);
  }, [isVisible, timer]);

  return (
    <div
      className={cn(
        "absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-20",
        isVisible
          ? "opacity-100 scale-100 animate-in fade-in zoom-in duration-200"
          : "opacity-0 scale-95 pointer-events-none transition-all duration-300"
      )}
    >
      <p className="font-black text-2xl tracking-tighter mb-2 uppercase">{message}</p>
      <div className="text-8xl font-black text-foreground tabular-nums tracking-tighter leading-none">{countdown}</div>
      <div className="w-48 h-2.5 bg-muted mt-8 overflow-hidden border-2 border-foreground shadow-retro-sm relative">
        <div ref={barRef} className="h-full bg-primary absolute left-0 top-0" style={{ width: "100%" }} />
      </div>
    </div>
  );
}
