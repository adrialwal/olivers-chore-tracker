import { describe, expect, it } from 'vitest';
import { emptyState } from './defaults';
import { balance, choresDueOn, completionFor, describeSchedule, isDueOn, starsEarnedOn } from './logic';
import type { StarEvent } from './types';

const base = { at: 0, date: '2026-10-27' };

describe('schedules', () => {
  it('handles daily, weekday and one-time chores', () => {
    // 2026-10-27 is a Tuesday
    expect(isDueOn({ type: 'daily' }, '2026-10-27')).toBe(true);
    expect(isDueOn({ type: 'weekdays', days: [2] }, '2026-10-27')).toBe(true);
    expect(isDueOn({ type: 'weekdays', days: [0, 6] }, '2026-10-27')).toBe(false);
    expect(isDueOn({ type: 'once', date: '2026-10-27' }, '2026-10-27')).toBe(true);
    expect(isDueOn({ type: 'once', date: '2026-10-28' }, '2026-10-27')).toBe(false);
  });

  it('skips paused chores', () => {
    const s = emptyState();
    s.chores = [
      { id: 'a', title: 'A', emoji: '⭐', stars: 1, routineId: 'r', schedule: { type: 'daily' }, active: true },
      { id: 'b', title: 'B', emoji: '⭐', stars: 1, routineId: 'r', schedule: { type: 'daily' }, active: false },
    ];
    expect(choresDueOn(s, '2026-10-27').map((c) => c.id)).toEqual(['a']);
  });

  it('describes schedules in plain words', () => {
    expect(describeSchedule({ type: 'weekdays', days: [5, 1, 2, 3, 4] })).toBe('Weekdays');
    expect(describeSchedule({ type: 'weekdays', days: [6, 0] })).toBe('Weekends');
    expect(describeSchedule({ type: 'weekdays', days: [1, 3] })).toBe('Mon, Wed');
  });
});

describe('star balance', () => {
  const events: StarEvent[] = [
    { ...base, id: '1', type: 'chore', choreId: 'a', title: 'A', emoji: '⭐', stars: 3 },
    { ...base, id: '2', type: 'bonus', stars: 5, note: '', parentId: 'p' },
    { ...base, id: '3', type: 'redeem', rewardId: 'r', title: 'R', emoji: '🎁', cost: 4 },
    { ...base, id: '4', type: 'chore', choreId: 'b', title: 'B', emoji: '⭐', stars: 2, voided: { at: 1, parentId: 'p' } },
  ];

  it('adds earnings, subtracts rewards and ignores undone items', () => {
    expect(balance(events)).toBe(4);
  });

  it('counts only earnings for the day total', () => {
    expect(starsEarnedOn(events, '2026-10-27')).toBe(8);
  });

  it('treats a voided completion as not done', () => {
    expect(completionFor(events, 'a', '2026-10-27')?.id).toBe('1');
    expect(completionFor(events, 'b', '2026-10-27')).toBeUndefined();
  });
});
