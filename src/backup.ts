import { toISODate } from './dates';
import { normalize } from './store';
import type { AppState } from './types';

const BACKUP_KIND = 'olivers-chore-tracker/backup';
const SETUP_KIND = 'olivers-chore-tracker/setup';

/** Everything except parents (PINs), recovery code and star history. */
export type SharedSetup = Pick<AppState, 'child' | 'routines' | 'chores' | 'rewards' | 'settings'>;

export function backupFile(state: AppState): File {
  const body = JSON.stringify({ kind: BACKUP_KIND, exportedAt: new Date().toISOString(), state }, null, 1);
  return new File([body], `chore-tracker-backup-${toISODate(new Date())}.json`, { type: 'application/json' });
}

export function setupFile(state: AppState): File {
  const setup: SharedSetup = {
    child: state.child,
    routines: state.routines,
    chores: state.chores,
    rewards: state.rewards,
    settings: state.settings,
  };
  const body = JSON.stringify({ kind: SETUP_KIND, exportedAt: new Date().toISOString(), setup }, null, 1);
  return new File([body], `chore-tracker-setup-${toISODate(new Date())}.json`, { type: 'application/json' });
}

/** Open the iPad share sheet (AirDrop, Messages, Save to Files…), or download as a fallback. */
export async function shareFile(file: File): Promise<void> {
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: file.name });
      return;
    } catch (err) {
      if ((err as DOMException).name === 'AbortError') return;
    }
  }
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export type ParsedFile =
  | { kind: 'backup'; state: AppState }
  | { kind: 'setup'; setup: SharedSetup }
  | { kind: 'invalid'; reason: string };

export function parseImport(text: string): ParsedFile {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { kind: 'invalid', reason: "That file isn't a chore tracker file." };
  }
  const obj = data as { kind?: string; state?: AppState; setup?: SharedSetup };
  if (obj.kind === BACKUP_KIND && obj.state && Array.isArray(obj.state.events)) {
    return { kind: 'backup', state: normalize(obj.state) };
  }
  if (obj.kind === SETUP_KIND && obj.setup && Array.isArray(obj.setup.chores)) {
    const base = normalize({});
    return {
      kind: 'setup',
      setup: {
        child: { ...base.child, ...obj.setup.child },
        routines: obj.setup.routines ?? [],
        chores: obj.setup.chores,
        rewards: obj.setup.rewards ?? [],
        settings: { ...base.settings, ...obj.setup.settings },
      },
    };
  }
  return { kind: 'invalid', reason: "That file isn't a chore tracker backup or setup file." };
}
