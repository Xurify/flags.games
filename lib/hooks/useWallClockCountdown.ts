"use client";

import { useEffect, useRef, useState } from "react";

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
  const rafIdRef = useRef<number | null>(null);

  const clear = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (rafIdRef.current !== null && typeof cancelAnimationFrame !== "undefined") {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  };

  const start = (dSec: number) => {
    const plannedEndTime = (params.startTimeMs ?? Date.now()) + dSec * 1000;
    endTimeRef.current = plannedEndTime;

    const nowAtStart = Date.now();
    const initialRemainingMs = Math.max(0, plannedEndTime - nowAtStart);
    setTimeRemainingSec(initialRemainingMs / 1000);
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

    const scheduleWithInterval = () => {
      const interval = Math.max(16, params.intervalMs ?? 250);
      intervalRef.current = setInterval(tick, interval);
    };

    const scheduleWithRaf = () => {
      const loop = () => {
        tick();
        if (document.visibilityState === "visible") {
          rafIdRef.current = requestAnimationFrame(loop);
        }
      };
      rafIdRef.current = requestAnimationFrame(loop);
    };

    if (typeof document !== "undefined" && document.visibilityState === "visible" && typeof requestAnimationFrame !== "undefined") {
      scheduleWithRaf();
    } else {
      scheduleWithInterval();
    }
  };

  useEffect(() => {
    if (!isActive) {
      setTimeRemainingSec(durationSec);
      endTimeRef.current = null;
      clear();
      return;
    }

    start(durationSec);

    const handleVisibility = () => {
      if (!endTimeRef.current) return;
      const now = Date.now();
      const remainingMs = Math.max(0, endTimeRef.current - now);
      const remainingSeconds = remainingMs / 1000;
      setTimeRemainingSec(remainingSeconds);
      if (remainingMs <= 0 && !hasFiredTimeoutRef.current) {
        hasFiredTimeoutRef.current = true;
        clear();
        if (onTimeUp) onTimeUp();
        return;
      }

      clear();
      if (document.visibilityState === "visible" && typeof requestAnimationFrame !== "undefined") {
        const loop = () => {
          const now2 = Date.now();
          const remainingMs2 = Math.max(0, (endTimeRef.current ?? now2) - now2);
          const remaining2 = remainingMs2 / 1000;
          setTimeRemainingSec(remaining2);
          if (remainingMs2 <= 0 && !hasFiredTimeoutRef.current) {
            hasFiredTimeoutRef.current = true;
            clear();
            if (onTimeUp) onTimeUp();
            return;
          }
          if (document.visibilityState === "visible") {
            rafIdRef.current = requestAnimationFrame(loop);
          }
        };
        rafIdRef.current = requestAnimationFrame(loop);
      } else {
        const interval = Math.max(16, params.intervalMs ?? 250);
        intervalRef.current = setInterval(() => {
          const now2 = Date.now();
          const remainingMs2 = Math.max(0, (endTimeRef.current ?? now2) - now2);
          const remaining2 = remainingMs2 / 1000;
          setTimeRemainingSec(remaining2);
          if (remainingMs2 <= 0 && !hasFiredTimeoutRef.current) {
            hasFiredTimeoutRef.current = true;
            clear();
            if (onTimeUp) onTimeUp();
          }
        }, interval);
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


