/**
 * AudioEngine — Singleton wrapper around the Web Audio API.
 *
 * Lazy-initialises AudioContext on first user interaction so we comply with
 * browser autoplay policies.  All sound modules should obtain their context
 * and master gain through this engine rather than creating their own context.
 */

class AudioEngineClass {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private muted = false;

  /* ------------------------------------------------------------------ */
  /*  Singleton                                                         */
  /* ------------------------------------------------------------------ */

  private static instance: AudioEngineClass | undefined;

  static getInstance(): AudioEngineClass {
    if (!AudioEngineClass.instance) {
      AudioEngineClass.instance = new AudioEngineClass();
    }
    return AudioEngineClass.instance;
  }

  /* ------------------------------------------------------------------ */
  /*  Public API                                                        */
  /* ------------------------------------------------------------------ */

  /**
   * Return the shared AudioContext, creating it lazily on first call.
   * Returns null when the Web Audio API is unavailable.
   */
  getContext(): AudioContext | null {
    if (this.context) return this.context;

    const Ctor =
      globalThis.AudioContext ??
      ((globalThis as Record<string, unknown>).webkitAudioContext as
        | typeof AudioContext
        | undefined);

    if (!Ctor) return null;

    try {
      this.context = new Ctor();
    } catch {
      return null;
    }

    // Wire up master gain
    this.masterGain = this.context.createGain();
    this.masterGain.connect(this.context.destination);

    return this.context;
  }

  /** Return the master GainNode (or null when context unavailable). */
  getMasterGain(): GainNode | null {
    // Ensure context exists first
    this.getContext();
    return this.masterGain;
  }

  /**
   * Resume the AudioContext (call after a user gesture).
   * No-op if the context is already running or unavailable.
   */
  async play(): Promise<void> {
    const ctx = this.getContext();
    if (!ctx || ctx.state === 'running') return;
    await ctx.resume();
  }

  /**
   * Close the AudioContext and clean up references.
   * After this call, getContext() will create a fresh context.
   */
  async cleanup(): Promise<void> {
    if (this.context) {
      await this.context.close();
      this.context = null;
      this.masterGain = null;
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Mute                                                              */
  /* ------------------------------------------------------------------ */

  /** Mute or unmute all audio. */
  setMuted(muted: boolean): void {
    this.muted = muted;
    const gain = this.getMasterGain();
    if (gain) {
      gain.gain.value = muted ? 0 : 1;
    }
  }

  /** Current mute state. */
  isMuted(): boolean {
    return this.muted;
  }

  /* ------------------------------------------------------------------ */
  /*  Testing helpers                                                   */
  /* ------------------------------------------------------------------ */

  /** Reset internal state — test-only. */
  reset(): void {
    this.context = null;
    this.masterGain = null;
    this.muted = false;
  }
}

export { AudioEngineClass as AudioEngine };

/** Convenience export — singleton access. */
export const audioEngine = AudioEngineClass.getInstance();
