// Short original sound effects synthesized with Web Audio, so there are no audio files.
let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  try {
    ctx ??= new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, start: number, duration: number, type: OscillatorType = 'square', volume = 0.08) {
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime + start;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + duration + 0.02);
}

export const sounds = {
  chore() {
    tone(784, 0, 0.09);
    tone(1175, 0.08, 0.16);
  },
  reward() {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.07, 0.14, 'triangle', 0.12));
  },
  allDone() {
    [523, 659, 784, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.1, 0.18, 'square', 0.07));
  },
  tap() {
    tone(440, 0, 0.04, 'triangle', 0.05);
  },
};

export type SoundName = keyof typeof sounds;
