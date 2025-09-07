import { useEffect, useRef, useState, useCallback } from "react";
import { audioManager } from "@/lib/utils/audio-manager";

interface UseSoundEffectOptions {
  audioUrl: string;
  volume?: number;
  preload?: boolean;
  cacheKey?: string;
}

export function useSoundEffect({
  audioUrl,
  volume = 0.5,
  preload = true,
  cacheKey,
}: UseSoundEffectOptions) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    audioManager.setupAutoResumeOnUserInteraction();
    if (preload) {
      audioManager
        .preloadAudio(audioUrl, cacheKey || audioUrl)
        .then((audio) => {
          audioRef.current = audio;
          setIsLoaded(true);
        })
        .catch((error) => {
          console.warn("Failed to preload audio:", error);
        });
    }
  }, [audioUrl, preload, cacheKey]);

  const playSound = useCallback(() => {
    if (audioRef.current && isLoaded) {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = volume;
      audioRef.current.play().catch(console.error);
    } else {
      const audio = new Audio(audioUrl);
      audio.volume = volume;
      audio.play().catch(console.error);
    }
  }, [audioUrl, volume, isLoaded]);

  return { playSound, isLoaded };
}
