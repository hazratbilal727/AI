/**
 * STONIC AI - Procedural Audio & Voice Service
 * Zero external audio files; uses Web Audio API oscillators and Web Speech API.
 */

class VoiceService {
  private audioCtx: AudioContext | null = null;
  private isSpeaking = false;
  private isListening = false;
  private listeners: ((state: { isSpeaking: boolean; isListening: boolean }) => void)[] = [];

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Futuristic UI procedural sound effects
  playSfx(type: 'click' | 'activate' | 'pulse' | 'alert' | 'complete'): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(700, now + 0.04);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'activate') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.14);
        osc.start(now);
        osc.stop(now + 0.14);
      } else if (type === 'pulse') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(260, now + 0.2);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'complete') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      } else if (type === 'alert') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(440, now + 0.1);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
      }
    } catch {
      // Audio autoplay policy catch
    }
  }

  // Synthesize text using browser SpeechSynthesis
  speak(text: string, onEnd?: () => void): void {
    if (typeof window === 'undefined') return;

    if (!('speechSynthesis' in window)) {
      this.isSpeaking = true;
      this.notify();
      setTimeout(() => {
        this.isSpeaking = false;
        this.notify();
        onEnd?.();
      }, Math.min(3000, text.length * 50));
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 0.95;

    // Pick a preferred British or tech English voice if available
    const voices = window.speechSynthesis.getVoices();
    const techVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Daniel') || v.name.includes('George') || v.name.includes('David') || v.name.includes('Google UK English Male')));
    if (techVoice) {
      utterance.voice = techVoice;
    }

    this.isSpeaking = true;
    this.notify();

    utterance.onend = () => {
      this.isSpeaking = false;
      this.notify();
      onEnd?.();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.notify();
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  }

  stopSpeaking(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.notify();
  }

  setListening(listening: boolean): void {
    this.isListening = listening;
    this.notify();
  }

  getState() {
    return {
      isSpeaking: this.isSpeaking,
      isListening: this.isListening,
    };
  }

  subscribe(listener: (state: { isSpeaking: boolean; isListening: boolean }) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    const st = this.getState();
    this.listeners.forEach(fn => fn(st));
  }
}

export const voiceService = new VoiceService();
export const playSound = (type: 'click' | 'activate' | 'pulse' | 'alert' | 'complete'): void => {
  voiceService.playSfx(type);
};
