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
  private continuousSources = new Set<GainNode>();
  private boundVisibilityHandler: (() => void) | null = null;

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

    // Listen for tab visibility changes to pause/resume continuous sounds
    this.setupVisibilityListener();

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
    this.removeVisibilityListener();
    this.continuousSources.clear();
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
  /*  Continuous sound sources (tab visibility handling)                */
  /* ------------------------------------------------------------------ */

  /** Register a GainNode that controls a continuous sound (e.g. marble roll). */
  registerContinuous(node: GainNode): void {
    this.continuousSources.add(node);
  }

  /** Unregister a previously registered continuous GainNode. */
  unregisterContinuous(node: GainNode): void {
    this.continuousSources.delete(node);
  }

  /** Pause all registered continuous sources (set gain to 0). */
  pauseContinuous(): void {
    for (const node of this.continuousSources) {
      node.gain.setValueAtTime(0, this.context?.currentTime ?? 0);
    }
  }

  /** Resume all registered continuous sources (set gain to 1, unless muted). */
  resumeContinuous(): void {
    if (this.muted) return;
    for (const node of this.continuousSources) {
      node.gain.setValueAtTime(1, this.context?.currentTime ?? 0);
    }
  }

  /** Set up document.visibilitychange listener. */
  private setupVisibilityListener(): void {
    if (this.boundVisibilityHandler) return; // Already listening
    this.boundVisibilityHandler = () => {
      if (document.hidden) {
        this.pauseContinuous();
      } else {
        this.resumeContinuous();
      }
    };
    document.addEventListener('visibilitychange', this.boundVisibilityHandler);
  }

  /* ------------------------------------------------------------------ */
  /*  Testing helpers                                                   */
  /* ------------------------------------------------------------------ */

  /** Remove document.visibilitychange listener. */
  private removeVisibilityListener(): void {
    if (this.boundVisibilityHandler) {
      document.removeEventListener(
        'visibilitychange',
        this.boundVisibilityHandler,
      );
      this.boundVisibilityHandler = null;
    }
  }

  /** Reset internal state — test-only. */
  reset(): void {
    this.context = null;
    this.masterGain = null;
    this.muted = false;
    this.removeVisibilityListener();
    this.continuousSources.clear();
  }
}

export { AudioEngineClass as AudioEngine };

/** Convenience export — singleton access. */
export const audioEngine = AudioEngineClass.getInstance();
