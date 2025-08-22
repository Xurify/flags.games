"use client";

import { useEffect, useRef } from "react";

interface UsePageReloadProtectionOptions {
  enabled: boolean;
  message?: string;
}

/**
 * Hook that prevents accidental page reloads/closes during active game sessions
 * by showing a confirmation dialog to the user
 */
export function usePageReloadProtection({
  enabled,
  message = "You're in an active game! Are you sure you want to leave? Your progress will be lost.",
}: UsePageReloadProtectionOptions) {
  const enabledRef = useRef(enabled);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!enabledRef.current) {
        return;
      }

      event.preventDefault();
      event.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [message]);
}
