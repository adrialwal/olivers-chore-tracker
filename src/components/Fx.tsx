// Celebrations: floating "+3 ⭐" bursts, full-screen star showers, sounds and toasts.
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { sounds, type SoundName } from '../sound';
import { useStore } from '../store';

interface Particle {
  id: number;
  x: number;
  y: number;
  text: string;
  dx: number;
  dy: number;
  delay: number;
  big?: boolean;
}

interface Toast {
  id: number;
  message: string;
  actionLabel?: string;
  action?: () => void;
}

interface Fx {
  burst: (x: number, y: number, label: string) => void;
  shower: (emoji?: string[]) => void;
  play: (name: SoundName) => void;
  toast: (message: string, actionLabel?: string, action?: () => void) => void;
}

const FxContext = createContext<Fx | null>(null);

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export function FxProvider({ children }: { children: ReactNode }) {
  const { state } = useStore();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [toast, setToast] = useState<Toast | null>(null);
  const nextId = useRef(1);
  const toastTimer = useRef<number | undefined>(undefined);
  const soundOn = state.settings.sound;

  const add = useCallback((items: Omit<Particle, 'id'>[], lifetime: number) => {
    const withIds = items.map((p) => ({ ...p, id: nextId.current++ }));
    setParticles((prev) => [...prev, ...withIds]);
    const ids = new Set(withIds.map((p) => p.id));
    window.setTimeout(() => setParticles((prev) => prev.filter((p) => !ids.has(p.id))), lifetime);
  }, []);

  const burst = useCallback(
    (x: number, y: number, label: string) => {
      const items: Omit<Particle, 'id'>[] = [{ x, y, text: label, dx: 0, dy: -90, delay: 0, big: true }];
      if (!reducedMotion()) {
        for (let i = 0; i < 8; i++) {
          const angle = (Math.PI * 2 * i) / 8;
          items.push({ x, y, text: '⭐', dx: Math.cos(angle) * 90, dy: Math.sin(angle) * 90, delay: 0 });
        }
      }
      add(items, 1200);
    },
    [add],
  );

  const shower = useCallback(
    (emoji: string[] = ['⭐', '🌟', '✨']) => {
      if (reducedMotion()) return;
      const w = window.innerWidth;
      const items = Array.from({ length: 36 }, (_, i) => ({
        x: Math.random() * w,
        y: -40,
        text: emoji[i % emoji.length],
        dx: (Math.random() - 0.5) * 120,
        dy: window.innerHeight + 80,
        delay: Math.random() * 700,
      }));
      add(items, 3000);
    },
    [add],
  );

  const play = useCallback((name: SoundName) => soundOn && sounds[name](), [soundOn]);

  const toastFn = useCallback((message: string, actionLabel?: string, action?: () => void) => {
    window.clearTimeout(toastTimer.current);
    setToast({ id: nextId.current++, message, actionLabel, action });
    toastTimer.current = window.setTimeout(() => setToast(null), 6000);
  }, []);

  return (
    <FxContext.Provider value={{ burst, shower, play, toast: toastFn }}>
      {children}
      <div className="fx-layer" aria-hidden="true">
        {particles.map((p) => (
          <span
            key={p.id}
            className={'fx-particle' + (p.big ? ' fx-big' : '') + (p.dy > 300 ? ' fx-fall' : '')}
            style={
              {
                left: p.x,
                top: p.y,
                '--dx': `${p.dx}px`,
                '--dy': `${p.dy}px`,
                animationDelay: `${p.delay}ms`,
              } as React.CSSProperties
            }
          >
            {p.text}
          </span>
        ))}
      </div>
      {toast && (
        <div className="toast card" key={toast.id} role="status">
          <span>{toast.message}</span>
          {toast.action && (
            <button
              className="btn btn-small"
              onClick={() => {
                toast.action?.();
                setToast(null);
              }}
            >
              {toast.actionLabel}
            </button>
          )}
        </div>
      )}
    </FxContext.Provider>
  );
}

export function useFx(): Fx {
  const fx = useContext(FxContext);
  if (!fx) throw new Error('useFx outside FxProvider');
  return fx;
}
