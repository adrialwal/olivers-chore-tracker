import type { ThemeId } from './types';

export interface ThemeInfo {
  id: ThemeId;
  name: string;
  emoji: string;
  description: string;
}

// The look of each theme lives in styles.css under [data-theme="…"].
export const THEMES: ThemeInfo[] = [
  { id: 'blocky', name: 'Blocky', emoji: '🧱', description: 'Chunky pixel blocks' },
  { id: 'space', name: 'Space', emoji: '🚀', description: 'Stars, planets and rockets' },
  { id: 'clean', name: 'Clean', emoji: '◻️', description: 'Simple and minimal' },
  { id: 'geography', name: 'Geography', emoji: '🧭', description: 'Maps and a country of the day' },
  { id: 'flags', name: 'Flags', emoji: '🏁', description: 'Flags of the world' },
];

export const ACCENT_SWATCHES = ['#e2453c', '#f08a24', '#f2c12e', '#3fae55', '#1fa39a', '#3d7be0', '#7a4bd1', '#d64f9a'];
export const BACKGROUND_SWATCHES = ['#fdf6e3', '#eef6ff', '#f1fbef', '#fff0f5', '#1f2a44', '#1d2b22', '#2b1d33', '#111111'];

/** Pick black or white text for a given background color. */
export function readableTextOn(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum > 0.4 ? '#1b1b1f' : '#ffffff';
}

export function isDarkColor(hex: string): boolean {
  return readableTextOn(hex) === '#ffffff';
}
