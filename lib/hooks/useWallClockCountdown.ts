"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseWallClockCountdownParams {
  durationSec: number;
  isActive: boolean;
  onTimeUp?: () => void;
  resetKey?: unknown;
  intervalMs?: number; // fallback/alternative interval (default 250ms)
  startTimeMs?: number; // optional anchor start time (e.g., server-authoritative)
}

interface UseWallClockCountdownResult {
  timeRemainingSec: number;
  progress: number;
}

export function useWallClockCountdown({
  durationSec,
  isActive,
  onTimeUp,
  resetKey,
  startTimeMs,
  intervalMs = 250,
}: UseWallClockCountdownParams): UseWallClockCountdownResult {
  const [timeRemainingSec, setTimeRemainingSec] = useState<number>(durationSec);
  
  const endTimeRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasFiredTimeoutRef = useRef<boolean>(false);
  
  const onTimeUpRef = useRef(onTimeUp);
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  const clear = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    if (!endTimeRef.current) return;
    
    const now = Date.now();
    const remainingMs = Math.max(0, endTimeRef.current - now);
    const remainingSec = remainingMs / 1000;
    
    setTimeRemainingSec(remainingSec);
    
    if (remainingMs <= 0 && !hasFiredTimeoutRef.current) {
      hasFiredTimeoutRef.current = true;
      clear();
      onTimeUpRef.current?.();
    }
  }, [clear]);

  const start = useCallback(() => {
    clear();
    
    const baseTime = startTimeMs ?? Date.now();
    endTimeRef.current = baseTime + durationSec * 1000;
    hasFiredTimeoutRef.current = false;

    tick();

    const loop = () => {
      tick();
      if (document.visibilityState === "visible") {
        rafIdRef.current = requestAnimationFrame(loop);
      }
    };

    if (typeof document !== "undefined" && document.visibilityState === "visible") {
      rafIdRef.current = requestAnimationFrame(loop);
    } else {
      intervalRef.current = setInterval(tick, Math.max(16, intervalMs));
    }
  }, [durationSec, startTimeMs, intervalMs, clear, tick]);

  useEffect(() => {
    if (!isActive) {
      clear();
      setTimeRemainingSec(durationSec);
      endTimeRef.current = null;
      return;
    }

    start();

    const handleVisibility = () => {
      if (isActive && endTimeRef.current) {
        start();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      clear();
    };
  }, [isActive, durationSec, resetKey, start, clear]);

  const progress = durationSec > 0 ? Math.max(0, Math.min(1, timeRemainingSec / durationSec)) : 0;

  return { timeRemainingSec, progress };
}
