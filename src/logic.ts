import { fromISODate } from './dates';
import type { AppState, Chore, ISODate, Schedule, StarEvent } from './types';

export function newId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

export function isDueOn(schedule: Schedule, date: ISODate): boolean {
  switch (schedule.type) {
    case 'daily':
      return true;
    case 'weekdays':
      return schedule.days.includes(fromISODate(date).getDay());
    case 'once':
      return schedule.date === date;
  }
}

export function choresDueOn(state: AppState, date: ISODate): Chore[] {
  return state.chores.filter((c) => c.active && isDueOn(c.schedule, date));
}

export function eventStars(e: StarEvent): number {
  if (e.voided) return 0;
  return e.type === 'redeem' ? -e.cost : e.stars;
}

export function balance(events: StarEvent[]): number {
  return events.reduce((sum, e) => sum + eventStars(e), 0);
}

/** The live completion event for a chore on a given day, if any. */
export function completionFor(events: StarEvent[], choreId: string, date: ISODate): StarEvent | undefined {
  return events.find((e) => e.type === 'chore' && e.choreId === choreId && e.date === date && !e.voided);
}

export function starsEarnedOn(events: StarEvent[], date: ISODate): number {
  return events
    .filter((e) => e.date === date && e.type !== 'redeem' && !e.voided)
    .reduce((sum, e) => sum + eventStars(e), 0);
}

export function describeSchedule(s: Schedule): string {
  const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  switch (s.type) {
    case 'daily':
      return 'Every day';
    case 'weekdays': {
      const days = [...s.days].sort();
      if (days.join() === '1,2,3,4,5') return 'Weekdays';
      if (days.join() === '0,6') return 'Weekends';
      if (days.length === 7) return 'Every day';
      return days.map((d) => names[d]).join(', ');
    }
    case 'once':
      return 'Once on ' + fromISODate(s.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }
}
