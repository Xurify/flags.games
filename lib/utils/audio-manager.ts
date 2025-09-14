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

  private async playWithAudioContext(
    actionName: string,
    action: (context: AudioContext) => void
  ): Promise<void> {
    if (!this.audioContext) {
      console.warn(`AudioContext not available for ${actionName}.`);
      return;
    }

    // Ensure AudioContext is resumed (needed after user interaction on all platforms)
    if (this.audioContext.state === "suspended") {
      try {
        await this.audioContext.resume();
      } catch (error) {
        console.warn(`Failed to resume AudioContext for ${actionName}:`, error);
        return;
      }
    }

    try {
      action(this.audioContext);
    } catch (error) {
      console.error(`Error playing ${actionName}:`, error);
    }
  }

  public async resumeAudioContext(): Promise<void> {
    if (this.audioContext && this.audioContext.state === "suspended") {
      try {
        await this.audioContext.resume();
      } catch (error) {
        console.error("Failed to resume audio context:", error);
      }
    }
  }

  /**
   * Idempotent: Only sets up listeners once per app session
   */
  public setupAutoResumeOnUserInteraction() {
    if (this.autoResumeSetup) return;
    this.autoResumeSetup = true;
    const resume = async () => {
      await this.resumeAudioContext();
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
      
      audio.preload = "auto";
      audio.crossOrigin = "anonymous";

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

      if (audio.readyState < 3) {
        await new Promise((resolve) => {
          const handleCanPlay = () => {
            audio.removeEventListener("canplay", handleCanPlay);
            resolve(undefined);
          };
          audio.addEventListener("canplay", handleCanPlay);
        });
      }

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
  async playTone(
    frequency: number,
    duration: number = 0.3,
    type: OscillatorType = "sine"
  ): Promise<void> {
    await this.playWithAudioContext("TONE", (ctx) => {
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

  async playSuccessSound(): Promise<void> {
    await this.playWithAudioContext("SUCCESS", (ctx) => {
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

  async playErrorSound(): Promise<void> {
    await this.playWithAudioContext("ERROR", (ctx) => {
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

  async playButtonClickSound(): Promise<void> {
    await this.playButtonClickTone();
  }

  playVictorySound(): void {
    this.playAudio(AUDIO_URLS.VICTORY, {
      volume: 0.7,
      key: AUDIO_URLS_KEYS.VICTORY,
    });
  }

  async playAnswerSubmittedSound(): Promise<void> {
    await this.playWithAudioContext("ANSWER_SUBMITTED", (ctx) => {
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

  async playButtonClickTone(): Promise<void> {
    await this.playWithAudioContext("BUTTON_CLICK", (ctx) => {
      const now = ctx.currentTime;
      const duration = 0.06; // 60ms - shorter and snappier
      
      // Simple single oscillator - clean and crisp
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      // Even lower frequency for more neutral feel
      oscillator.frequency.setValueAtTime(350, now);
      oscillator.type = "sine"; // Clean sine wave
      
      // Very gentle attack and decay for neutral feel
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.05, now + 0.01); // Longer, gentler attack
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration); // Smooth decay
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.start(now);
      oscillator.stop(now + duration);
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
}

export const audioManager = new AudioManager();

export const playClockTick = (volume?: number) => audioManager.playClockTick(volume);
