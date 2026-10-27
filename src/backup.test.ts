import { describe, expect, it } from 'vitest';
import { parseImport } from './backup';
import { emptyState } from './defaults';

describe('import files', () => {
  it('rejects random files', () => {
    expect(parseImport('not json').kind).toBe('invalid');
    expect(parseImport('{"hello":1}').kind).toBe('invalid');
  });

  it('reads a setup file without stars or PINs', () => {
    const s = emptyState();
    const text = JSON.stringify({ kind: 'olivers-chore-tracker/setup', setup: { child: s.child, routines: [], chores: [], rewards: [], settings: s.settings } });
    const parsed = parseImport(text);
    expect(parsed.kind).toBe('setup');
  });

  it('reads a full backup and fills in missing fields', () => {
    const text = JSON.stringify({ kind: 'olivers-chore-tracker/backup', state: { events: [], setupComplete: true } });
    const parsed = parseImport(text);
    expect(parsed.kind).toBe('backup');
    if (parsed.kind === 'backup') expect(parsed.state.settings.sound).toBe(false);
  });
});
