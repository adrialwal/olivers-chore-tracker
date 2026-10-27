import { useEffect, useMemo, useState } from 'react';
import { FxProvider } from './components/Fx';
import { fromISODate } from './dates';
import { ParentScreen } from './screens/Parent';
import { KidScreen } from './screens/Kid';
import { Setup } from './screens/Setup';
import { occasionFor } from './seasons';
import { useStore } from './store';
import { isDarkColor, readableTextOn } from './themes';
import { useToday } from './useToday';

function useSystemDark(): boolean {
  const query = '(prefers-color-scheme: dark)';
  const [dark, setDark] = useState(() => window.matchMedia?.(query).matches ?? false);
  useEffect(() => {
    const mq = window.matchMedia?.(query);
    if (!mq) return;
    const onChange = () => setDark(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return dark;
}

export function App() {
  const { state } = useStore();
  const { settings } = state;
  const today = useToday();
  const systemDark = useSystemDark();
  const [parentId, setParentId] = useState<string | null>(null);

  const dark = settings.mode === 'dark' || (settings.mode === 'auto' && systemDark);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = settings.theme;
    root.dataset.mode = dark ? 'dark' : 'light';
    const set = (name: string, value: string | null) =>
      value ? root.style.setProperty(name, value) : root.style.removeProperty(name);
    set('--accent', settings.accent);
    set('--on-accent', settings.accent && readableTextOn(settings.accent));
    set('--bg', settings.background);
    set('--on-bg', settings.background && readableTextOn(settings.background));
    // A custom background replaces the theme's pattern.
    set('--bg-pattern', settings.background ? 'none' : null);
    const themeColor = settings.background ?? (dark ? '#111318' : '#f4f1ea');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor);
    root.dataset.bgTone = settings.background ? (isDarkColor(settings.background) ? 'dark' : 'light') : '';
  }, [settings.theme, settings.accent, settings.background, dark]);

  const occasion = useMemo(
    () => (settings.seasonal ? occasionFor(fromISODate(today), state.child.birthday, settings.disabledOccasions) : null),
    [settings.seasonal, settings.disabledOccasions, state.child.birthday, today],
  );

  // A parent who was removed (or a restored backup) ends the parent session.
  const parent = state.parents.find((p) => p.id === parentId) ?? null;

  let screen;
  if (!state.setupComplete) {
    screen = <Setup />;
  } else if (parent) {
    screen = <ParentScreen parent={parent} today={today} onExit={() => setParentId(null)} />;
  } else {
    screen = <KidScreen today={today} occasion={occasion} onParentLogin={setParentId} />;
  }

  return (
    <FxProvider>
      {occasion && !parent && state.setupComplete && (
        <div className="season-layer" aria-hidden="true">
          {Array.from({ length: 14 }, (_, i) => (
            <span
              key={i}
              className="season-particle"
              style={{
                left: `${(i * 37) % 100}%`,
                animationDelay: `${-((i * 2.3) % 18)}s`,
                animationDuration: `${14 + (i % 5) * 2}s`,
              }}
            >
              {occasion.particles[i % occasion.particles.length]}
            </span>
          ))}
        </div>
      )}
      <div className="app">{screen}</div>
    </FxProvider>
  );
}
