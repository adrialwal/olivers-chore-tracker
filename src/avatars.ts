// Original 16×16 pixel-art characters. Each sprite is drawn as its left half
// (8 columns) and mirrored, so every character is symmetric.
// Palette letters: s = skin, S = skin shadow, h = hair; others are fixed colors.

export const SKIN_TONES = [
  { name: 'Light', base: '#f6d3b3', shade: '#e3b593' },
  { name: 'Medium light', base: '#e5b083', shade: '#cc9468' },
  { name: 'Medium', base: '#c08455', shade: '#a36c41' },
  { name: 'Deep', base: '#8a5634', shade: '#6f4227' },
];

export const HAIR_COLORS = [
  { name: 'Black', color: '#2a2320' },
  { name: 'Brown', color: '#6b4226' },
  { name: 'Blond', color: '#e2b84f' },
  { name: 'Red', color: '#c4532b' },
];

const PALETTE: Record<string, string> = {
  k: '#24212b', // outline
  w: '#f4f6fb', // white
  g: '#a3acbb', // grey
  G: '#6f7888', // dark grey
  d: '#1f2a44', // screen
  c: '#55e1ff', // cyan
  r: '#e2453c', // red
  b: '#3d6fd8', // blue
  y: '#ffd23f', // yellow
  o: '#f08a24', // orange
  p: '#ff9fb2', // pink
  n: '#8b5a2b', // brown
  N: '#5e3a1a', // dark brown
  t: '#dcb77c', // tan
  v: '#6b8e3a', // olive
  u: '#7a4bd1', // purple
  e: '#4cbf56', // green
  l: '#cdeca0', // light green
  m: '#b5473a', // mouth
};

export interface AvatarDef {
  id: string;
  name: string;
  usesSkin: boolean;
  half: string[]; // 16 rows × 8 columns
}

export const AVATARS: AvatarDef[] = [
  {
    id: 'astronaut', name: 'Astronaut', usesSkin: true,
    half: [
      '........',
      '....kkkk',
      '..kkwwww',
      '.kwwwwww',
      '.kwkkkkk',
      '.kwkhhhh',
      '.kwkskss',
      '.kwkssss',
      '.kwkSssm',
      '.kwkkkkk',
      '..kwwwww',
      '...kGGGG',
      '..kwwwww',
      '.kwwbwww',
      '.kwwwwrw',
      '.kwwwwww',
    ],
  },
  {
    id: 'knight', name: 'Knight', usesSkin: true,
    half: [
      '.......r',
      '......rr',
      '....kkkk',
      '...kgggg',
      '..kggggg',
      '..kgssss',
      '..kgskss',
      '..kgssss',
      '..kgSssm',
      '..kggggg',
      '...kgGgg',
      '..kkkkkk',
      '.kbbbbbb',
      '.kbbbbby',
      '.kbbbbyy',
      '.kbbbbby',
    ],
  },
  {
    id: 'robot', name: 'Robot', usesSkin: false,
    half: [
      '.......y',
      '.......k',
      '..kkkkkk',
      '..kggggg',
      '..kgkkkk',
      'kkkgkddd',
      'kgkgkdcd',
      'kkkgkddd',
      '..kgkdcc',
      '..kgkkkk',
      '..kggggg',
      '...kkkkk',
      '..kooooo',
      '.koooooo',
      '.koooocy',
      '.koooooo',
    ],
  },
  {
    id: 'scientist', name: 'Scientist', usesSkin: true,
    half: [
      '........',
      '....hhhh',
      '...hhhhh',
      '..hhhhhh',
      '..hkcckk',
      '..hsssss',
      '..hsskss',
      '..hsssss',
      '...Ssssm',
      '....ssss',
      '...kwwss',
      '..kwwwkb',
      '.kwwwwkb',
      '.kwwwwkb',
      '.kwrwwkb',
      '.kwwwwkb',
    ],
  },
  {
    id: 'explorer', name: 'Explorer', usesSkin: true,
    half: [
      '........',
      '....tttt',
      '...ttttt',
      '...nnnnn',
      'tttttttt',
      '..hsssss',
      '..hsskss',
      '..hsssss',
      '...Ssssm',
      '....ssss',
      '...kvvss',
      '..kvvvvv',
      '.kvnvvvv',
      '.kvvnvvv',
      '.kvvvnvv',
      '.kvvvvnv',
    ],
  },
  {
    id: 'wizard', name: 'Wizard', usesSkin: true,
    half: [
      '.......u',
      '......uu',
      '.....uuu',
      '....uuuy',
      '...uuuuu',
      '.uuuuuuu',
      '..hsssss',
      '..hsskss',
      '..hsssss',
      '...Ssssm',
      '....ssss',
      '...kuuuu',
      '..kuuuuu',
      '.kuuuuyu',
      '.kuuuuuu',
      '.kuuuuuu',
    ],
  },
  {
    id: 'cat', name: 'Cat', usesSkin: false,
    half: [
      '........',
      '..kk....',
      '..kpk...',
      '..kppkkk',
      '..kooooo',
      '.koooooo',
      '.kookooo',
      '.koooooo',
      '.kooooop',
      '.koooowk',
      '..kooooo',
      '...kkkkk',
      '..kooooo',
      '.koooooo',
      '.kooowww',
      '.kooowww',
    ],
  },
  {
    id: 'dog', name: 'Puppy', usesSkin: false,
    half: [
      '........',
      '........',
      '...kkkkk',
      '..knnnnn',
      '.kNnnnnn',
      'kNNnnnnn',
      'kNNnknnn',
      'kNNnnnnn',
      'kNNnnnwk',
      '.kNnnwww',
      '..knnwwp',
      '...kkkkk',
      '..krrrry',
      '.knnnnnn',
      '.knnnnnw',
      '.knnnnnw',
    ],
  },
  {
    id: 'fox', name: 'Fox', usesSkin: false,
    half: [
      '........',
      '.k......',
      '.kok....',
      '.kook...',
      '.koookkk',
      '.koooooo',
      'kwoookoo',
      'kwwooooo',
      '.kwwwooo',
      '..kwwwww',
      '...kwwwk',
      '....kkkk',
      '..kooooo',
      '.koooooo',
      '.kooowww',
      '.kooowww',
    ],
  },
  {
    id: 'panda', name: 'Panda', usesSkin: false,
    half: [
      '........',
      '..kk....',
      '.kkkkkkk',
      '.kkwwwww',
      '.kwwwwww',
      'kwwkkwww',
      'kwkkwkww',
      'kwwkkwww',
      'kwwwwwwk',
      '.kwwwwkw',
      '..kwwwww',
      '...kkkkk',
      '..kkkwww',
      '.kkkkwww',
      '.kkkwwww',
      '.kkkwwww',
    ],
  },
  {
    id: 'owl', name: 'Owl', usesSkin: false,
    half: [
      '........',
      '.kk.....',
      '.knk....',
      '.knnkkkk',
      '.knnnnnn',
      'knwwwwnn',
      'knwykwnn',
      'knwwwwnn',
      'knnnnnyy',
      '.knnnnny',
      '.kntntnn',
      '.knnntnt',
      '.kntntnn',
      '.knnnnnn',
      '..knnnnn',
      '....kyky',
    ],
  },
  {
    id: 'dino', name: 'Dino', usesSkin: false,
    half: [
      '.....o.o',
      '....kkkk',
      '...keeee',
      '..keeeee',
      '.keeeeee',
      '.keekeee',
      '.keeeeee',
      '.keeeeee',
      '.keeeeee',
      '.keeekkk',
      '..keeeew',
      '...keeee',
      '..keeeee',
      '.keeelll',
      '.keeelll',
      '.keeelll',
    ],
  },
];

export function avatarById(id: string): AvatarDef {
  return AVATARS.find((a) => a.id === id) ?? AVATARS[0];
}

/** Full 16×16 rows for a sprite. */
export function spriteRows(def: AvatarDef): string[] {
  return def.half.map((row) => row + [...row].reverse().join(''));
}

export function colorFor(ch: string, skinTone: number, hairColor: number): string | null {
  if (ch === '.') return null;
  const skin = SKIN_TONES[skinTone] ?? SKIN_TONES[0];
  if (ch === 's') return skin.base;
  if (ch === 'S') return skin.shade;
  if (ch === 'h') return (HAIR_COLORS[hairColor] ?? HAIR_COLORS[0]).color;
  return PALETTE[ch] ?? null;
}

export const PALETTE_KEYS = new Set(['.', 's', 'S', 'h', ...Object.keys(PALETTE)]);
