import { get, set } from 'idb-keyval';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { emptyState } from './defaults';
import type { AppState } from './types';

const KEY = 'olivers-chore-tracker/state';

interface Store {
  state: AppState;
  /** Apply a change to a copy of the state, then save it. */
  mutate: (recipe: (draft: AppState) => void) => void;
  replace: (next: AppState) => void;
}

const StoreContext = createContext<Store | null>(null);

/** Fill in anything missing from older saves or imported files. */
export function normalize(raw: Partial<AppState>): AppState {
  const base = emptyState();
  return {
    ...base,
    ...raw,
    child: { ...base.child, ...raw.child },
    settings: { ...base.settings, ...raw.settings },
    parents: raw.parents ?? [],
    routines: raw.routines ?? [],
    chores: raw.chores ?? [],
    rewards: raw.rewards ?? [],
    events: raw.events ?? [],
    version: 1,
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const pending = useRef<AppState | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    get<AppState>(KEY)
      .then((saved) => setState(saved ? normalize(saved) : emptyState()))
      .catch((err) => setLoadError(String(err)));
    // Ask the browser not to clear our data when space runs low.
    navigator.storage?.persist?.().catch(() => {});
  }, []);

  const flush = useCallback(() => {
    if (!pending.current) return;
    const toSave = pending.current;
    pending.current = null;
    window.clearTimeout(timer.current);
    set(KEY, toSave).catch((err) => console.error('Save failed', err));
  }, []);

  useEffect(() => {
    const onHide = () => document.visibilityState === 'hidden' && flush();
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', flush);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('pagehide', flush);
    };
  }, [flush]);

  const save = useCallback(
    (next: AppState) => {
      pending.current = next;
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(flush, 150);
    },
    [flush],
  );

  const mutate = useCallback(
    (recipe: (draft: AppState) => void) => {
      setState((prev) => {
        if (!prev) return prev;
        const draft = structuredClone(prev);
        recipe(draft);
        save(draft);
        return draft;
      });
    },
    [save],
  );

  const replace = useCallback(
    (next: AppState) => {
      setState(next);
      save(next);
    },
    [save],
  );

  if (loadError) return <div className="boot-message">Couldn't load saved data: {loadError}</div>;
  if (!state) return <div className="boot-message">Loading…</div>;
  return <StoreContext.Provider value={{ state, mutate, replace }}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore outside StoreProvider');
  return store;
}
