export type ISODate = string; // YYYY-MM-DD in local time

export type Schedule =
  | { type: 'daily' }
  | { type: 'weekdays'; days: number[] } // 0 = Sunday … 6 = Saturday
  | { type: 'once'; date: ISODate };

export interface Routine {
  id: string;
  name: string;
  emoji: string;
}

export interface Chore {
  id: string;
  title: string;
  emoji: string;
  stars: number;
  routineId: string;
  schedule: Schedule;
  active: boolean;
}

export interface Reward {
  id: string;
  title: string;
  emoji: string;
  cost: number;
  active: boolean;
}

export interface Parent {
  id: string;
  name: string;
  salt: string;
  pinHash: string;
}

interface EventBase {
  id: string;
  at: number; // epoch ms
  date: ISODate; // local day the event belongs to
  voided?: { at: number; parentId: string };
}

export type StarEvent =
  | (EventBase & { type: 'chore'; choreId: string; title: string; emoji: string; stars: number })
  | (EventBase & { type: 'redeem'; rewardId: string; title: string; emoji: string; cost: number })
  | (EventBase & { type: 'bonus'; stars: number; note: string; parentId: string });

export type ThemeId = 'blocky' | 'space' | 'clean' | 'geography' | 'flags';
export type ColorMode = 'auto' | 'light' | 'dark';

export interface Settings {
  theme: ThemeId;
  mode: ColorMode;
  accent: string | null; // custom accent color, null = theme default
  background: string | null; // custom background color, null = theme default
  seasonal: boolean;
  disabledOccasions: string[];
  sound: boolean;
}

export interface Child {
  name: string;
  avatarId: string;
  skinTone: number;
  hairColor: number;
  birthday: string | null; // MM-DD
}

export interface AppState {
  version: 1;
  setupComplete: boolean;
  child: Child;
  parents: Parent[];
  recovery: { salt: string; hash: string } | null;
  routines: Routine[];
  chores: Chore[];
  rewards: Reward[];
  events: StarEvent[];
  settings: Settings;
}
