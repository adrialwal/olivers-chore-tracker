import { newId } from './logic';
import type { AppState, Chore, Reward, Routine } from './types';

export function emptyState(): AppState {
  return {
    version: 1,
    setupComplete: false,
    child: { name: 'Oliver', avatarId: 'astronaut', skinTone: 0, hairColor: 1, birthday: null },
    parents: [],
    recovery: null,
    routines: [],
    chores: [],
    rewards: [],
    events: [],
    settings: {
      theme: 'blocky',
      mode: 'auto',
      accent: null,
      background: null,
      seasonal: false,
      disabledOccasions: [],
      sound: false,
    },
  };
}

export function starterRoutines(): Routine[] {
  return [
    { id: newId(), name: 'Morning', emoji: '🌅' },
    { id: newId(), name: 'After School', emoji: '🎒' },
    { id: newId(), name: 'Bedtime', emoji: '🌙' },
    { id: newId(), name: 'Anytime', emoji: '⭐' },
  ];
}

export function starterChores(routines: Routine[]): Chore[] {
  const [morning, afterSchool, bedtime, anytime] = routines.map((r) => r.id);
  const weekdays = { type: 'weekdays' as const, days: [1, 2, 3, 4, 5] };
  const daily = { type: 'daily' as const };
  const c = (title: string, emoji: string, stars: number, routineId: string, schedule: Chore['schedule']): Chore => ({
    id: newId(), title, emoji, stars, routineId, schedule, active: true,
  });
  return [
    c('Make my bed', '🛏️', 1, morning, daily),
    c('Brush my teeth', '🪥', 1, morning, daily),
    c('Get dressed', '👕', 1, morning, daily),
    c('Pack my backpack', '🎒', 1, morning, weekdays),
    c('Homework or reading', '📚', 2, afterSchool, weekdays),
    c('Put shoes away', '👟', 1, afterSchool, daily),
    c('Tidy my room', '🧸', 2, afterSchool, daily),
    c('Bath or shower', '🛁', 1, bedtime, daily),
    c('Brush my teeth', '🪥', 1, bedtime, daily),
    c('Clear my plate', '🍽️', 1, anytime, daily),
  ];
}

export function starterRewards(): Reward[] {
  const r = (title: string, emoji: string, cost: number): Reward => ({ id: newId(), title, emoji, cost, active: true });
  return [
    r('15 min screen time', '📱', 10),
    r('30 min screen time', '🎮', 18),
    r('Pick a family movie', '🎬', 25),
    r('Choose dinner', '🍕', 30),
    r('Special treat', '🍦', 20),
    r('Stay up 15 min later', '🌙', 25),
    r('Trip to the park', '🛝', 35),
    r('Small toy', '🎁', 75),
  ];
}
