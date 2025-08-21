"use client";

import { useEffect, useRef, useState } from "react";

interface UseWallClockCountdownParams {
  durationSec: number;
  isActive: boolean;
  onTimeUp?: () => void;
  resetKey?: unknown;
  intervalMs?: number; // fallback/alternative interval (default 250ms)
}

interface UseWallClockCountdownResult {
  timeRemainingSec: number;
  progress: number; // 0..1, where 1 means full time remaining
  restart: (nextDurationSec?: number) => void;
}

export function useWallClockCountdown(
  params: UseWallClockCountdownParams
): UseWallClockCountdownResult {
  const { durationSec, isActive, onTimeUp, resetKey } = params;

  const [timeRemainingSec, setTimeRemainingSec] = useState<number>(durationSec);
  const endTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasFiredTimeoutRef = useRef<boolean>(false);

  const clear = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const start = (dSec: number) => {
    endTimeRef.current = Date.now() + dSec * 1000;
    setTimeRemainingSec(dSec);
    hasFiredTimeoutRef.current = false;

    clear();
    const tick = () => {
      const now = Date.now();
      const remainingMs = Math.max(0, (endTimeRef.current ?? now) - now);
      const remaining = remainingMs / 1000;
      setTimeRemainingSec(remaining);
      if (remainingMs <= 0 && !hasFiredTimeoutRef.current) {
        hasFiredTimeoutRef.current = true;
        clear();
        if (onTimeUp) onTimeUp();
        return;
      }
    };

    const interval = Math.max(16, params.intervalMs ?? 250);
    intervalRef.current = setInterval(tick, interval);
  };

  useEffect(() => {
    if (!isActive) {
      // hold at full when inactive
      setTimeRemainingSec(durationSec);
      endTimeRef.current = null;
      clear();
      return;
    }

    start(durationSec);

    const handleVisibility = () => {
      if (document.visibilityState === "visible" && endTimeRef.current) {
        const now = Date.now();
        const remainingMs = Math.max(0, endTimeRef.current - now);
        const remaining = remainingMs / 1000;
        setTimeRemainingSec(remaining);
        if (remainingMs <= 0 && !hasFiredTimeoutRef.current) {
          hasFiredTimeoutRef.current = true;
          clear();
          if (onTimeUp) onTimeUp();
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      clear();
    };
  }, [isActive, durationSec, resetKey]);

  const restart = (nextDurationSec?: number) => {
    start(nextDurationSec ?? durationSec);
  };

  const progress = durationSec > 0 ? timeRemainingSec / durationSec : 0;

  return { timeRemainingSec, progress, restart };
}


