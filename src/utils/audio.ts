// Web Audio API romantic acoustic piano / guitar engine and ambient sound effects

class RomanticAudioManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private isPlaying: boolean = false;
  private timerId: number | null = null;
  private currentStep: number = 0;
  private masterGain: GainNode | null = null;

  // Romantic chord progression (frequencies in Hz):
  // Cmaj9 -> Am9 -> Fmaj7 -> Gsus4/G -> Em7 -> Fmaj7
  private chordProgression = [
    // Cmaj9: C3, G3, B3, D4, E4, G4
    [130.81, 196.00, 246.94, 293.66, 329.63, 392.00],
    // Am9: A2, E3, G3, C4, E4, B4
    [110.00, 164.81, 196.00, 261.63, 329.63, 493.88],
    // Fmaj7: F2, C3, E3, A3, C4, E4
    [87.31, 130.81, 164.81, 220.00, 261.63, 329.63],
    // Gsus4 / G: G2, D3, G3, B3, D4, G4
    [98.00, 146.83, 196.00, 246.94, 293.66, 392.00],
    // Em7: E2, B2, E3, G3, B3, E4
    [82.41, 123.47, 164.81, 196.00, 246.94, 329.63],
    // Fadd9: F2, C3, G3, A3, C4, G4
    [87.31, 130.81, 196.00, 220.00, 261.63, 392.00],
  ];

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.4, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    const ctx = this.getContext();
    if (this.masterGain) {
      const targetGain = this.isMuted ? 0 : 0.35;
      this.masterGain.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.2);
    }
    if (!this.isMuted && !this.isPlaying) {
      this.startMusic();
    }
    return this.isMuted;
  }

  public unmute(): void {
    if (this.isMuted) {
      this.toggleMute();
    }
  }

  public startMusic(): void {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.getContext();
    this.scheduleNextArpeggio();
  }

  public stopMusic(): void {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  // Plays a single piano/acoustic plucked note with rich harmonics and natural decay
  private playFeltNote(freq: number, startTime: number, velocity: number = 0.5, duration: number = 2.2): void {
    if (!this.ctx || !this.masterGain) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();

    // Triangle + Sine for warm, felt-covered piano / acoustic nylon guitar hammer tone
    osc1.type = 'triangle';
    osc2.type = 'sine';
    subOsc.type = 'sine';

    osc1.frequency.setValueAtTime(freq, startTime);
    // Slight detune for chorus warmth
    osc2.frequency.setValueAtTime(freq * 1.002, startTime);
    subOsc.frequency.setValueAtTime(freq * 0.5, startTime);

    const noteGain = this.ctx.createGain();
    // Warm lowpass filter to emulate soft piano felt & wooden acoustic resonance
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, startTime);
    filter.frequency.exponentialRampToValueAtTime(320, startTime + duration);

    // Envelope
    noteGain.gain.setValueAtTime(0.0001, startTime);
    // Soft attack (~15ms)
    noteGain.gain.linearRampToValueAtTime(velocity * 0.25, startTime + 0.015);
    // Natural acoustic exponential decay
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    // Connect
    osc1.connect(filter);
    osc2.connect(filter);
    subOsc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc1.start(startTime);
    osc2.start(startTime);
    subOsc.start(startTime);

    osc1.stop(startTime + duration);
    osc2.stop(startTime + duration);
    subOsc.stop(startTime + duration);
  }

  private scheduleNextArpeggio = (): void => {
    if (!this.isPlaying || !this.ctx) return;

    const chordIndex = Math.floor(this.currentStep / 8) % this.chordProgression.length;
    const noteInChord = this.currentStep % 8;
    const chord = this.chordProgression[chordIndex];

    // Elegant fingerpicking pattern: Bass root on 0, then rolling arpeggios
    let noteFreq = chord[0];
    let vel = 0.55;

    if (noteInChord === 0) {
      // Root bass note
      noteFreq = chord[0];
      vel = 0.65;
    } else if (noteInChord === 1) {
      noteFreq = chord[2];
      vel = 0.45;
    } else if (noteInChord === 2) {
      noteFreq = chord[3];
      vel = 0.48;
    } else if (noteInChord === 3) {
      noteFreq = chord[4];
      vel = 0.52;
    } else if (noteInChord === 4) {
      noteFreq = chord[5] || chord[4];
      vel = 0.58;
    } else if (noteInChord === 5) {
      noteFreq = chord[3];
      vel = 0.45;
    } else if (noteInChord === 6) {
      noteFreq = chord[2];
      vel = 0.48;
    } else if (noteInChord === 7) {
      noteFreq = chord[1];
      vel = 0.42;
    }

    const now = this.ctx.currentTime;
    this.playFeltNote(noteFreq, now, vel, 2.5);

    // Optional top romantic bell melody accents
    if (this.currentStep % 4 === 0) {
      const bellFreq = chord[4] * 1.5;
      this.playFeltNote(bellFreq, now + 0.08, 0.25, 2.0);
    }

    this.currentStep++;
    // ~94 BPM (approx 320ms per eighth note)
    const stepDurationMs = 320;
    this.timerId = window.setTimeout(this.scheduleNextArpeggio, stepDurationMs);
  };

  // Sound Effects

  // 1. Easter egg sparkle chime (3 heart clicks)
  public playEasterEggChime(): void {
    try {
      const ctx = this.getContext();
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 1.2);
      });
    } catch {
      // AudioContext fallback
    }
  }

  // 2. Playful "No" dodge whoosh / cute squeak
  public playDodgeSqueak(): void {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      const now = ctx.currentTime;
      // Quick cute slide up then down
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.09);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.18);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Audio fallback
    }
  }

  // 3. "Yes" romantic chime
  public playYesCelebration(): void {
    try {
      const ctx = this.getContext();
      const freqs = [392.00, 523.25, 659.25, 783.99, 1046.50]; // G4, C5, E5, G5, C6
      const now = ctx.currentTime;
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + i * 0.06);

        gain.gain.setValueAtTime(0.001, now + i * 0.06);
        gain.gain.linearRampToValueAtTime(0.25, now + i * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 1.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 1.8);
      });
    } catch {
      // Audio fallback
    }
  }

  // 4. Soft tap / chime for quiz selection
  public playQuizOptionSound(): void {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.08);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch {
      // Fallback
    }
  }

  // Playful success chime when answer is correct
  public playQuizCorrectSound(): void {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);

        gain.gain.setValueAtTime(0.001, now + i * 0.07);
        gain.gain.linearRampToValueAtTime(0.18, now + i * 0.07 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.07 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.65);
      });
    } catch {
      // Fallback
    }
  }

  // Playful gentle wobble when answer is wrong
  public playQuizWrongSound(): void {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.28);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.16, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // Fallback
    }
  }

  // 5. Confetti and heart burst sound
  public playConfettiPop(): void {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.05);

        gain.gain.setValueAtTime(0.001, now + i * 0.05);
        gain.gain.linearRampToValueAtTime(0.18, now + i * 0.05 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.05 + 1.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 1.5);
      });
    } catch {
      // Fallback
    }
  }

  // 6. Subtle tactile UI button click / tap
  public playButtonClick(): void {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Soft warm wooden tap / pop sound
      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(820, now + 0.025);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.06);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {
      // Fallback
    }
  }

  // 7. Tactile screen transition sweep / whoosh
  public playTransitionWhoosh(): void {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Soft filtered noise/sine sweep with sparkle harmonics
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.18);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.35);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(2400, now + 0.15);
      filter.frequency.exponentialRampToValueAtTime(400, now + 0.35);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.14, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);

      // Light companion sparkle chime
      const chime = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chime.type = 'sine';
      chime.frequency.setValueAtTime(1174.66, now + 0.06); // D6
      chime.frequency.exponentialRampToValueAtTime(1567.98, now + 0.22); // G6

      chimeGain.gain.setValueAtTime(0.0001, now + 0.06);
      chimeGain.gain.linearRampToValueAtTime(0.08, now + 0.09);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

      chime.connect(chimeGain);
      chimeGain.connect(ctx.destination);

      chime.start(now + 0.06);
      chime.stop(now + 0.4);
    } catch {
      // Fallback
    }
  }

  // 8. Intense cascading confetti rain sound
  public playIntenseConfettiRainSound(): void {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      // Multi-tier sparkling bells mimicking raindrops of joy
      const rainNotes = [
        { f: 587.33, delay: 0.0 },
        { f: 880.00, delay: 0.06 },
        { f: 1174.66, delay: 0.12 },
        { f: 1318.51, delay: 0.18 },
        { f: 1760.00, delay: 0.24 },
        { f: 1567.98, delay: 0.32 },
        { f: 2093.00, delay: 0.40 },
        { f: 1760.00, delay: 0.48 },
        { f: 1318.51, delay: 0.58 },
      ];

      rainNotes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.f, now + n.delay);

        gain.gain.setValueAtTime(0.0001, now + n.delay);
        gain.gain.linearRampToValueAtTime(0.12, now + n.delay + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + n.delay + 0.85);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + n.delay);
        osc.stop(now + n.delay + 0.9);
      });
    } catch {
      // Fallback
    }
  }
}

export const romanticAudio = new RomanticAudioManager();
