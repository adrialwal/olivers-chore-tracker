import { describe, expect, it } from 'vitest';
import { easterSunday, occasionFor } from './seasons';

const on = (y: number, m: number, d: number, birthday: string | null = null, disabled: string[] = []) =>
  occasionFor(new Date(y, m - 1, d), birthday, disabled)?.id ?? null;

describe('occasions', () => {
  it('computes Easter', () => {
    expect(easterSunday(2026).toDateString()).toBe(new Date(2026, 3, 5).toDateString());
    expect(easterSunday(2027).toDateString()).toBe(new Date(2027, 2, 28).toDateString());
  });

  it('picks holidays over seasons', () => {
    expect(on(2026, 10, 27)).toBe('halloween');
    expect(on(2026, 10, 5)).toBe('fall');
    expect(on(2026, 7, 4)).toBe('independence-day');
    expect(on(2026, 11, 26)).toBe('thanksgiving'); // 4th Thursday
    expect(on(2026, 11, 11)).toBe('veterans-day');
    expect(on(2027, 1, 18)).toBe('mlk-day'); // 3rd Monday
    expect(on(2026, 5, 25)).toBe('memorial-day'); // last Monday
    expect(on(2026, 12, 20)).toBe('christmas');
    expect(on(2026, 12, 6)).toBe('hanukkah');
    expect(on(2026, 12, 28)).toBe('kwanzaa');
    expect(on(2026, 12, 31)).toBe('new-year');
    expect(on(2027, 1, 1)).toBe('new-year');
    expect(on(2027, 1, 10)).toBe('winter');
    expect(on(2026, 2, 18)).toBe('lunar-new-year');
  });

  it('puts the birthday first and respects disabled occasions', () => {
    expect(on(2026, 10, 31, '10-31')).toBe('birthday');
    expect(on(2026, 10, 27, null, ['halloween'])).toBe('fall');
    expect(on(2026, 10, 27, null, ['halloween', 'fall'])).toBeNull();
  });
});
