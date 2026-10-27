// Seasonal and holiday decorations. Each occasion has a window of days; when several
// overlap, the shortest window wins so a one-day holiday beats a whole season.
import { addDays, toISODate } from './dates';

export interface Occasion {
  id: string;
  name: string;
  greeting: string;
  emoji: string; // banner emoji
  particles: string[]; // emoji that drift down the screen
  kind: 'holiday' | 'season' | 'birthday';
}

export const OCCASIONS: Occasion[] = [
  { id: 'new-year', name: "New Year's", greeting: 'Happy New Year!', emoji: '🎉', particles: ['🎉', '✨', '🎊'], kind: 'holiday' },
  { id: 'mlk-day', name: 'Martin Luther King Jr. Day', greeting: 'Happy MLK Day! Dream big!', emoji: '🕊️', particles: ['🕊️', '💛'], kind: 'holiday' },
  { id: 'lunar-new-year', name: 'Lunar New Year', greeting: 'Happy Lunar New Year!', emoji: '🧧', particles: ['🧧', '🏮', '✨'], kind: 'holiday' },
  { id: 'valentines', name: "Valentine's Day", greeting: "Happy Valentine's Day!", emoji: '💝', particles: ['💖', '💌', '❤️'], kind: 'holiday' },
  { id: 'presidents-day', name: "Presidents' Day", greeting: "Happy Presidents' Day!", emoji: '🇺🇸', particles: ['⭐', '🇺🇸'], kind: 'holiday' },
  { id: 'st-patricks', name: "St. Patrick's Day", greeting: "Happy St. Patrick's Day!", emoji: '☘️', particles: ['☘️', '🌈', '🪙'], kind: 'holiday' },
  { id: 'easter', name: 'Easter', greeting: 'Happy Easter!', emoji: '🐣', particles: ['🥚', '🐣', '🌷'], kind: 'holiday' },
  { id: 'earth-day', name: 'Earth Day', greeting: 'Happy Earth Day!', emoji: '🌍', particles: ['🌱', '🌍', '♻️'], kind: 'holiday' },
  { id: 'mothers-day', name: "Mother's Day", greeting: "Happy Mother's Day!", emoji: '💐', particles: ['💐', '🌸', '💗'], kind: 'holiday' },
  { id: 'memorial-day', name: 'Memorial Day', greeting: 'Memorial Day', emoji: '🇺🇸', particles: ['⭐', '🇺🇸'], kind: 'holiday' },
  { id: 'fathers-day', name: "Father's Day", greeting: "Happy Father's Day!", emoji: '👔', particles: ['💙', '⭐', '🏆'], kind: 'holiday' },
  { id: 'juneteenth', name: 'Juneteenth', greeting: 'Happy Juneteenth!', emoji: '🎉', particles: ['⭐', '🎉', '💚'], kind: 'holiday' },
  { id: 'independence-day', name: 'Independence Day', greeting: 'Happy 4th of July!', emoji: '🎆', particles: ['🎆', '⭐', '🇺🇸'], kind: 'holiday' },
  { id: 'labor-day', name: 'Labor Day', greeting: 'Happy Labor Day!', emoji: '🛠️', particles: ['⭐', '🛠️'], kind: 'holiday' },
  { id: 'halloween', name: 'Halloween', greeting: 'Happy Halloween!', emoji: '🎃', particles: ['🎃', '🦇', '🍬', '👻'], kind: 'holiday' },
  { id: 'veterans-day', name: 'Veterans Day', greeting: 'Thank you, veterans!', emoji: '🎖️', particles: ['⭐', '🇺🇸'], kind: 'holiday' },
  { id: 'thanksgiving', name: 'Thanksgiving', greeting: 'Happy Thanksgiving!', emoji: '🦃', particles: ['🍂', '🦃', '🥧'], kind: 'holiday' },
  { id: 'hanukkah', name: 'Hanukkah', greeting: 'Happy Hanukkah!', emoji: '🕎', particles: ['✨', '💙', '🕯️'], kind: 'holiday' },
  { id: 'christmas', name: 'Christmas', greeting: 'Merry Christmas!', emoji: '🎄', particles: ['❄️', '🎁', '⭐'], kind: 'holiday' },
  { id: 'kwanzaa', name: 'Kwanzaa', greeting: 'Happy Kwanzaa!', emoji: '🕯️', particles: ['🕯️', '💚', '❤️'], kind: 'holiday' },
  { id: 'birthday', name: 'Birthday', greeting: 'Happy Birthday', emoji: '🎂', particles: ['🎈', '🎉', '🎂'], kind: 'birthday' },
  { id: 'winter', name: 'Winter', greeting: 'Brrr! Winter is here!', emoji: '⛄', particles: ['❄️', '❄️', '⛄'], kind: 'season' },
  { id: 'spring', name: 'Spring', greeting: 'Spring has sprung!', emoji: '🌷', particles: ['🌸', '🌷', '🦋'], kind: 'season' },
  { id: 'summer', name: 'Summer', greeting: 'Sunny summer days!', emoji: '☀️', particles: ['☀️', '🌊', '🍉'], kind: 'season' },
  { id: 'fall', name: 'Fall', greeting: 'Happy fall!', emoji: '🍁', particles: ['🍂', '🍁', '🍃'], kind: 'season' },
];

// Dates computed from the Hebrew and Chinese calendars (first evening of Hanukkah,
// first day of Lunar New Year). Month-day, keyed by year.
const HANUKKAH: Record<number, string> = {
  2025: '12-14', 2026: '12-4', 2027: '12-24', 2028: '12-12', 2029: '12-1', 2030: '12-20', 2031: '12-9',
  2032: '11-27', 2033: '12-16', 2034: '12-6', 2035: '12-25', 2036: '12-13', 2037: '12-2', 2038: '12-21',
  2039: '12-11', 2040: '11-29', 2041: '12-17', 2042: '12-7', 2043: '12-26', 2044: '12-14', 2045: '12-4',
};
const LUNAR_NEW_YEAR: Record<number, string> = {
  2025: '1-29', 2026: '2-17', 2027: '2-7', 2028: '1-26', 2029: '2-13', 2030: '2-2', 2031: '1-23',
  2032: '2-11', 2033: '1-31', 2034: '2-19', 2035: '2-8', 2036: '1-28', 2037: '2-15', 2038: '2-4',
  2039: '1-24', 2040: '2-12', 2041: '2-1', 2042: '1-22', 2043: '2-10', 2044: '1-30', 2045: '2-17',
};

function fromMonthDay(year: number, md: string): Date {
  const [m, d] = md.split('-').map(Number);
  return new Date(year, m - 1, d);
}

/** The nth given weekday (0=Sun) of a month; n = -1 means the last one. */
function nthWeekday(year: number, month: number, weekday: number, n: number): Date {
  if (n > 0) {
    const first = new Date(year, month, 1);
    const offset = (weekday - first.getDay() + 7) % 7;
    return new Date(year, month, 1 + offset + (n - 1) * 7);
  }
  const last = new Date(year, month + 1, 0);
  const offset = (last.getDay() - weekday + 7) % 7;
  return new Date(year, month, last.getDate() - offset);
}

/** Western (Gregorian) Easter Sunday. */
export function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

type Window = { id: string; start: Date; end: Date };

function windowsForYear(y: number, birthday: string | null): Window[] {
  const w = (id: string, start: Date, end: Date): Window => ({ id, start, end });
  const day = (id: string, d: Date) => w(id, d, d);
  const before = (id: string, d: Date, days: number) => w(id, addDays(d, -days), d);
  const out: Window[] = [
    w('new-year', new Date(y, 0, 1), new Date(y, 0, 2)),
    w('new-year', new Date(y, 11, 31), new Date(y, 11, 31)),
    day('mlk-day', nthWeekday(y, 0, 1, 3)),
    w('valentines', new Date(y, 1, 7), new Date(y, 1, 14)),
    day('presidents-day', nthWeekday(y, 1, 1, 3)),
    w('st-patricks', new Date(y, 2, 10), new Date(y, 2, 17)),
    before('easter', easterSunday(y), 6),
    day('earth-day', new Date(y, 3, 22)),
    before('mothers-day', nthWeekday(y, 4, 0, 2), 2),
    before('memorial-day', nthWeekday(y, 4, 1, -1), 2),
    before('fathers-day', nthWeekday(y, 5, 0, 3), 2),
    day('juneteenth', new Date(y, 5, 19)),
    w('independence-day', new Date(y, 5, 28), new Date(y, 6, 4)),
    before('labor-day', nthWeekday(y, 8, 1, 1), 2),
    w('halloween', new Date(y, 9, 15), new Date(y, 9, 31)),
    day('veterans-day', new Date(y, 10, 11)),
    before('thanksgiving', nthWeekday(y, 10, 4, 4), 6),
    w('christmas', new Date(y, 11, 1), new Date(y, 11, 26)),
    w('kwanzaa', new Date(y, 11, 26), new Date(y + 1, 0, 1)),
    w('winter', new Date(y, 11, 1), new Date(y + 1, 1, 28 + (isLeap(y + 1) ? 1 : 0))),
    w('spring', new Date(y, 2, 1), new Date(y, 4, 31)),
    w('summer', new Date(y, 5, 1), new Date(y, 7, 31)),
    w('fall', new Date(y, 8, 1), new Date(y, 10, 30)),
  ];
  if (LUNAR_NEW_YEAR[y]) {
    const start = fromMonthDay(y, LUNAR_NEW_YEAR[y]);
    out.push(w('lunar-new-year', start, addDays(start, 6)));
  }
  if (HANUKKAH[y]) {
    const start = fromMonthDay(y, HANUKKAH[y]);
    out.push(w('hanukkah', start, addDays(start, 8)));
  }
  if (birthday) out.push(day('birthday', fromMonthDay(y, birthday)));
  return out;
}

function isLeap(y: number) {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

/** The decoration to show on a given day, or null for none. */
export function occasionFor(date: Date, birthday: string | null, disabled: string[] = []): Occasion | null {
  const target = toISODate(date);
  const y = date.getFullYear();
  const candidates = [...windowsForYear(y - 1, birthday), ...windowsForYear(y, birthday)]
    .filter((win) => !disabled.includes(win.id))
    .filter((win) => toISODate(win.start) <= target && target <= toISODate(win.end));
  if (candidates.length === 0) return null;
  const len = (win: Window) => (win.id === 'birthday' ? -1 : win.end.getTime() - win.start.getTime());
  candidates.sort((a, b) => len(a) - len(b));
  return OCCASIONS.find((o) => o.id === candidates[0].id) ?? null;
}
