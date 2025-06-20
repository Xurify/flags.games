import { AUDIO_URLS, AUDIO_URLS_KEYS } from "@/lib/constants";

interface AudioCache {
  [key: string]: HTMLAudioElement;
}

class AudioManager {
  private audioCache: AudioCache = {};
  private audioEnabled: boolean = true;
  private audioContext: AudioContext | null = null;
  private autoResumeSetup = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.initAudioContext();
    }
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn("AudioContext not supported:", error);
    }
  }

  /**
   * Idempotent: Only sets up listeners once per app session
   */
  public setupAutoResumeOnUserInteraction() {
    if (this.autoResumeSetup) return;
    this.autoResumeSetup = true;
    const resume = () => {
      this.resumeAudioContext();
      document.removeEventListener("click", resume);
      document.removeEventListener("keydown", resume);
      document.removeEventListener("touchstart", resume);
    };
    document.addEventListener("click", resume);
    document.addEventListener("keydown", resume);
    document.addEventListener("touchstart", resume);
  }

  /**
   * Preload an audio file and cache it
   */
  async preloadAudio(url: string, key?: string): Promise<HTMLAudioElement> {
    const cacheKey = key || url;

    if (this.audioCache[cacheKey]) {
      return this.audioCache[cacheKey];
    }

    return new Promise((resolve, reject) => {
      const audio = new Audio();

      audio.addEventListener(
        "canplaythrough",
        () => {
          this.audioCache[cacheKey] = audio;
          resolve(audio);
        },
        { once: true }
      );

      audio.addEventListener(
        "error",
        (error) => {
          console.error("Failed to preload audio:", url, error);
          reject(error);
        },
        { once: true }
      );

      audio.src = url;
      audio.load();
    });
  }

  /**
   * Play a preloaded audio file
   */
  async playAudio(
    url: string,
    options: {
      volume?: number;
      key?: string;
      force?: boolean;
    } = {}
  ): Promise<void> {
    const { volume = 0.5, key, force = false } = options;

    if (!this.audioEnabled && !force) {
      return;
    }

    try {
      const audio = await this.preloadAudio(url, key);

      audio.currentTime = 0;
      audio.volume = volume;

      const playPromise = audio.play();

      if (playPromise !== undefined) {
        await playPromise;
      }
    } catch (error) {
      console.error("Failed to play audio:", url, error);
    }
  }

  /**
   * Play a simple tone using Web Audio API
   */
  playTone(
    frequency: number,
    duration: number = 0.3,
    type: OscillatorType = "sine"
  ): void {
    if (!this.audioEnabled || !this.audioContext) {
      return;
    }

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(
        frequency,
        this.audioContext.currentTime
      );
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioContext.currentTime + duration
      );

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (error) {
      console.error("Failed to play tone:", error);
    }
  }

  playSuccessSound(): void {
    if (!this.audioEnabled) return;

    try {
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Ascending chord: C, E, G
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C
      oscillator.frequency.setValueAtTime(
        659.25,
        audioContext.currentTime + 0.1
      ); // E
      oscillator.frequency.setValueAtTime(
        783.99,
        audioContext.currentTime + 0.2
      ); // G

      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.error("Error playing success sound:", error);
    }
  }

  playErrorSound(): void {
    if (!this.audioEnabled) return;

    try {
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Descending chord: B, G, E
      oscillator.frequency.setValueAtTime(493.88, audioContext.currentTime); // B
      oscillator.frequency.setValueAtTime(
        415.3,
        audioContext.currentTime + 0.1
      ); // G#
      oscillator.frequency.setValueAtTime(
        369.99,
        audioContext.currentTime + 0.2
      ); // F#

      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.error("Error playing error sound:", error);
    }
  }

  playButtonClickSound(): void {
    this.playAudio(AUDIO_URLS.BUTTON_CLICK, {
      volume: 0.3,
      key: AUDIO_URLS_KEYS.BUTTON_CLICK,
    });
  }

  clearCache(): void {
    Object.values(this.audioCache).forEach((audio) => {
      audio.pause();
      audio.src = "";
    });
    this.audioCache = {};
  }

  /**
   * Resume audio context (needed after user interaction)
   */
  async resumeAudioContext(): Promise<void> {
    if (this.audioContext && this.audioContext.state === "suspended") {
      try {
        await this.audioContext.resume();
      } catch (error) {
        console.error("Failed to resume audio context:", error);
      }
    }
  }
}

export const audioManager = new AudioManager();

export const playSuccessSound = () => audioManager.playSuccessSound();
export const playErrorSound = () => audioManager.playErrorSound();
