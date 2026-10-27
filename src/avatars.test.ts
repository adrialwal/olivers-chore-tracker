import { describe, expect, it } from 'vitest';
import { AVATARS, PALETTE_KEYS, spriteRows } from './avatars';

describe('avatars', () => {
  it.each(AVATARS.map((a) => [a.id, a] as const))('%s is a valid 16×16 sprite', (_, a) => {
    const rows = spriteRows(a);
    expect(rows).toHaveLength(16);
    for (const row of rows) {
      expect(row).toHaveLength(16);
      for (const ch of row) expect(PALETTE_KEYS.has(ch)).toBe(true);
    }
  });
});
