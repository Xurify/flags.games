import { useEffect, useCallback, useRef } from "react";
import { audioManager } from "@/lib/utils/audioUtils";
import { AUDIO_URLS } from "@/lib/constants";

interface UseAudioOptions {
  preload?: boolean;
  autoResume?: boolean;
}

export const useAudio = (options: UseAudioOptions = {}) => {
  const { preload = true, autoResume = true } = options;
  const isInitialized = useRef(false);

  useEffect(() => {
    if (autoResume) {
      audioManager.setupAutoResumeOnUserInteraction();
    }
  }, [autoResume]);

  const preloadCustomAudio = useCallback(async (url: string, key?: string) => {
    try {
      await audioManager.preloadAudio(url, key);
    } catch (error) {
      console.error("Failed to preload audio:", error);
    }
  }, []);

  const playCustomAudio = useCallback(
    async (
      url: string,
      options?: {
        volume?: number;
        key?: string;
        force?: boolean;
      }
    ) => {
      try {
        await audioManager.playAudio(url, options);
      } catch (error) {
        console.error("Failed to play custom audio:", error);
      }
    },
    []
  );

  return {
    audioManager,
    playCustomAudio,
    preloadCustomAudio,
  };
};
