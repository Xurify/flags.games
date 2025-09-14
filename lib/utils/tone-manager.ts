import * as Tone from "tone";

class ToneManager {
  private isInitialized = false;
  private isStarted = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.initializeTone();
    }
  }

  private async initializeTone() {
    if (this.isInitialized) return;

    try {
      await Tone.start();
      this.isInitialized = true;
      console.log("Tone.js initialized successfully");
    } catch (error) {
      console.warn("Failed to initialize Tone.js:", error);
    }
  }

  private async ensureStarted() {
    if (!this.isInitialized) {
      await this.initializeTone();
    }

    if (!this.isStarted && Tone.context.state !== "running") {
      try {
        await Tone.start();
        this.isStarted = true;
      } catch (error) {
        console.warn("Failed to start Tone.js context:", error);
      }
    }
  }

  async playTone(
    frequency: number,
    duration: number = 0.3,
    type: "sine" | "square" | "sawtooth" | "triangle" = "sine",
    volume: number = -12
  ): Promise<void> {
    await this.ensureStarted();

    const oscillator = new Tone.Oscillator(frequency, type);
    const envelope = new Tone.AmplitudeEnvelope({
      attack: 0.01,
      decay: 0.1,
      sustain: 0.3,
      release: duration - 0.11,
    });

    oscillator.connect(envelope);
    envelope.toDestination();
    oscillator.volume.value = volume;

    oscillator.start();
    envelope.triggerAttackRelease(duration);

    setTimeout(() => {
      oscillator.dispose();
      envelope.dispose();
    }, duration * 1000 + 100);
  }

  async playChord(
    frequencies: number[],
    duration: number = 0.5,
    type: "sine" | "square" | "sawtooth" | "triangle" = "sine",
    volume: number = -15
  ): Promise<void> {
    await this.ensureStarted();

    const oscillators: Tone.Oscillator[] = [];
    const envelope = new Tone.AmplitudeEnvelope({
      attack: 0.01,
      decay: 0.1,
      sustain: 0.3,
      release: duration - 0.11,
    });

    frequencies.forEach((frequency) => {
      const oscillator = new Tone.Oscillator(frequency, type);
      oscillator.connect(envelope);
      oscillators.push(oscillator);
    });

    envelope.toDestination();

    oscillators.forEach((oscillator) => oscillator.start());
    envelope.triggerAttackRelease(duration);

    setTimeout(() => {
      oscillators.forEach((oscillator) => oscillator.dispose());
      envelope.dispose();
    }, duration * 1000 + 100);
  }

  async playSuccessSound(): Promise<void> {
    await this.ensureStarted();

    const synth = new Tone.Synth({
      oscillator: {
        type: "sine",
      },
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.3,
        release: 0.3,
      },
    }).toDestination();

    synth.volume.value = -12;

    const now = Tone.now();
    synth.triggerAttackRelease("C5", "8n", now);
    synth.triggerAttackRelease("E5", "8n", now + 0.1);
    synth.triggerAttackRelease("G5", "8n", now + 0.2);

    setTimeout(() => {
      synth.dispose();
    }, 1000);
  }

  async playErrorSound(): Promise<void> {
    await this.ensureStarted();

    const synth = new Tone.Synth({
      oscillator: {
        type: "sawtooth",
      },
      envelope: {
        attack: 0.01,
        decay: 0.2,
        sustain: 0.1,
        release: 0.3,
      },
    }).toDestination();

    synth.volume.value = -30;

    const now = Tone.now();
    synth.triggerAttackRelease("B4", "8n", now);
    synth.triggerAttackRelease("G#4", "8n", now + 0.1);
    synth.triggerAttackRelease("F#4", "8n", now + 0.2);

    setTimeout(() => {
      synth.dispose();
    }, 1000);
  }

  async playButtonClickSound(): Promise<void> {
    await this.ensureStarted();

    const synth = new Tone.Synth({
      oscillator: {
        type: "sine",
      },
      envelope: {
        attack: 0.002,
        decay: 0.03,
        sustain: 0.0,
        release: 0.04,
      },
    }).toDestination();

    synth.volume.value = -15;

    const now = Tone.now();
    synth.triggerAttackRelease("E5", "64n", now);

    setTimeout(() => {
      synth.dispose();
    }, 200);
  }

  async playAnswerSubmittedSound(): Promise<void> {
    await this.ensureStarted();

    const synth = new Tone.Synth({
      oscillator: {
        type: "triangle",
      },
      envelope: {
        attack: 0.001,
        decay: 0.05,
        sustain: 0.2,
        release: 0.1,
      },
    }).toDestination();

    synth.volume.value = -15;

    const now = Tone.now();
    synth.triggerAttackRelease("G#5", "16n", now);
    synth.triggerAttackRelease("C6", "16n", now + 0.1);

    setTimeout(() => {
      synth.dispose();
    }, 500);
  }

  async playVictoryFanfare(): Promise<void> {
    await this.ensureStarted();

    const synth = new Tone.Synth({
      oscillator: {
        type: "sine",
      },
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.5,
        release: 0.3,
      },
    }).toDestination();

    synth.volume.value = -10;

    const now = Tone.now();
    const notes = ["C5", "E5", "G5", "C6", "E6", "G6"];
    notes.forEach((note, index) => {
      synth.triggerAttackRelease(note, "4n", now + index * 0.2);
    });

    setTimeout(() => {
      synth.dispose();
    }, 2000);
  }

  async playCountdownTick(): Promise<void> {
    await this.ensureStarted();

    const synth = new Tone.Synth({
      oscillator: {
        type: "sine",
      },
      envelope: {
        attack: 0.001,
        decay: 0.1,
        sustain: 0,
        release: 0.1,
      },
    }).toDestination();

    synth.volume.value = -22;

    synth.triggerAttackRelease("A#4", "32n");

    setTimeout(() => {
      synth.dispose();
    }, 200);
  }

  async playClockTick(): Promise<void> {
    await this.ensureStarted();

    const highSynth = new Tone.Synth({
      oscillator: {
        type: "sine",
      },
      envelope: {
        attack: 0.001,
        decay: 0.05,
        sustain: 0,
        release: 0.05,
      },
    }).toDestination();

    const lowSynth = new Tone.Synth({
      oscillator: {
        type: "triangle",
      },
      envelope: {
        attack: 0.001,
        decay: 0.08,
        sustain: 0,
        release: 0.08,
      },
    }).toDestination();

    highSynth.volume.value = -10;
    lowSynth.volume.value = -15;

    // Play two frequencies simultaneously for a more realistic "tick" sound
    const now = Tone.now();
    highSynth.triggerAttackRelease("C6", "64n", now);
    lowSynth.triggerAttackRelease("C4", "64n", now);

    setTimeout(() => {
      highSynth.dispose();
      lowSynth.dispose();
    }, 150);
  }

  async playMechanicalClockTick(): Promise<void> {
    await this.ensureStarted();

    const synth = new Tone.Synth({
      oscillator: {
        type: "triangle",
      },
      envelope: {
        attack: 0.001,
        decay: 0.15,
        sustain: 0,
        release: 0.15,
      },
    }).toDestination();

    // Add a subtle filter for resonance
    const filter = new Tone.Filter(800, "lowpass");
    synth.connect(filter);
    filter.toDestination();

    synth.volume.value = -28;

    // Play a quick tick with slight frequency variation
    const now = Tone.now();
    synth.triggerAttackRelease("E4", "32n", now);
    synth.triggerAttackRelease("F4", "64n", now + 0.02);

    setTimeout(() => {
      synth.dispose();
      filter.dispose();
    }, 200);
  }

  async playNotificationSound(): Promise<void> {
    await this.ensureStarted();

    const synth = new Tone.Synth({
      oscillator: {
        type: "sine",
      },
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.3,
        release: 0.5,
      },
    }).toDestination();

    synth.volume.value = -18;

    const now = Tone.now();
    synth.triggerAttackRelease("F5", "4n", now);
    synth.triggerAttackRelease("A5", "4n", now + 0.2);

    setTimeout(() => {
      synth.dispose();
    }, 1000);
  }

  async playCustomSound(
    frequency: number,
    duration: number,
    options: {
      type?: "sine" | "square" | "sawtooth" | "triangle";
      volume?: number;
      effects?: {
        reverb?: boolean;
        delay?: boolean;
        filter?: boolean;
      };
    } = {}
  ): Promise<void> {
    await this.ensureStarted();

    const { type = "sine", volume = -12, effects = {} } = options;

    const synth = new Tone.Synth({
      oscillator: { type },
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.3,
        release: duration - 0.11,
      },
    });

    let chain = synth;

    if (effects.reverb) {
      const reverb = new Tone.Reverb(0.5);
      chain = chain.connect(reverb);
    }

    if (effects.delay) {
      const delay = new Tone.PingPongDelay("8n", 0.3);
      chain = chain.connect(delay);
    }

    if (effects.filter) {
      const filter = new Tone.Filter(1000, "lowpass");
      chain = chain.connect(filter);
    }

    chain.toDestination();
    synth.volume.value = volume;

    synth.triggerAttackRelease(frequency, duration);

    setTimeout(() => {
      synth.dispose();
    }, duration * 1000 + 100);
  }

  getContextState(): AudioContextState {
    return Tone.context.state;
  }

  async resumeContext(): Promise<void> {
    if (Tone.context.state === "suspended") {
      await Tone.start();
    }
  }
}

export const toneManager = new ToneManager();
