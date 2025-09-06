import { AUDIO_URLS, AUDIO_URLS_KEYS } from "@/lib/constants";

interface AudioCache {
  [key: string]: HTMLAudioElement;
}

class AudioManager {
  private audioCache: AudioCache = {};
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

  private playWithAudioContext(
    actionName: string,
    action: (context: AudioContext) => void
  ): void {
    if (!this.audioContext) {
      console.warn(`AudioContext not available for ${actionName}.`);
      return;
    }

    try {
      action(this.audioContext);
    } catch (error) {
      console.error(`Error playing ${actionName}:`, error);
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

  async playAudio(
    url: string,
    options: {
      volume?: number;
      key?: string;
    } = {}
  ): Promise<void> {
    const { volume = 0.5, key } = options;

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
    this.playWithAudioContext("TONE", (ctx) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    });
  }

  playSuccessSound(): void {
    this.playWithAudioContext("SUCCESS", (ctx) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Ascending chord: C, E, G
      oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C
      oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E
      oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G

      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
    });
  }

  playErrorSound(): void {
    this.playWithAudioContext("ERROR", (ctx) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Descending chord: B, G, E
      oscillator.frequency.setValueAtTime(493.88, ctx.currentTime); // B
      oscillator.frequency.setValueAtTime(415.3, ctx.currentTime + 0.1); // G#
      oscillator.frequency.setValueAtTime(369.99, ctx.currentTime + 0.2); // F#

      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
    });
  }

  playButtonClickSound(): void {
    this.playAudio(AUDIO_URLS.BUTTON_CLICK, {
      volume: 0.3,
      key: AUDIO_URLS_KEYS.BUTTON_CLICK,
    });
  }

  playVictorySound(): void {
    this.playAudio(AUDIO_URLS.VICTORY, {
      volume: 0.7,
      key: AUDIO_URLS_KEYS.VICTORY,
    });
  }

  playAnswerSubmittedSound(): void {
    this.playWithAudioContext("ANSWER_SUBMITTED", (ctx) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Lively but short: two quick triangle blips (bounce up)
      oscillator.type = "triangle";
      const now = ctx.currentTime;
      const blip = 0.05; // 50ms blip
      const gap = 0.02; // 20ms gap between blips
      const secondStart = now + blip + gap; // start of second blip

      // Frequencies: G#5 -> C6 for a playful bounce
      oscillator.frequency.setValueAtTime(830.61, now);
      oscillator.frequency.setValueAtTime(1046.5, secondStart);

      // Envelope for first blip
      gainNode.gain.cancelScheduledValues(now);
      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(0.12, now + 0.005);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + blip);

      // Brief silence (gap)
      gainNode.gain.setValueAtTime(0.001, secondStart - 0.001);

      // Envelope for second blip
      gainNode.gain.linearRampToValueAtTime(0.12, secondStart + 0.005);
      gainNode.gain.exponentialRampToValueAtTime(0.001, secondStart + blip);

      oscillator.start(now);
      oscillator.stop(secondStart + blip);
    });
  }

  playButtonClickTone(): void {
    this.playWithAudioContext("BUTTON_CLICK", (ctx) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Softer click: lower frequency with gentler ramp
      oscillator.frequency.setValueAtTime(500, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.08);

      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.15);
    });
  }

  async playClockTick(volume: number = 0.25): Promise<void> {
    await this.playAudio(AUDIO_URLS.CLOCK_TICK, { volume, key: AUDIO_URLS_KEYS.CLOCK_TICK });
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
export const playClockTick = (volume?: number) => audioManager.playClockTick(volume);
