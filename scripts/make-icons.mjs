// Builds the app icons (SVG + PNG sizes iOS needs) from a pixel-art star.
// Run with: npm run icons   (needs Playwright installed to render the PNGs)
import { writeFileSync } from 'node:fs';

const half = [
  '........',
  '.......k',
  '......ky',
  '......ky',
  '.....kyy',
  'kkkkkkyy',
  '.kyyyyyy',
  '..kyyyyy',
  '...kyyyy',
  '...kyyyy',
  '..kyyyyy',
  '..kyykyy',
  '.kyyk.ky',
  '.kkk...k',
  '........',
  '........',
];
const colors = { k: '#24212b', y: '#ffd23f' };
const rows = half.map((r) => r + [...r].reverse().join(''));

let rects = '';
for (let y = 0; y < 18; y++) for (let x = 0; x < 18; x++) {
  if ((x + y) % 2 === 0) rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="#4a7be0"/>`;
}
rows.forEach((row, y) =>
  [...row].forEach((ch, x) => {
    if (colors[ch]) rects += `<rect x="${x + 1}" y="${y + 2}" width="1.02" height="1.02" fill="${colors[ch]}"/>`;
  }),
);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" shape-rendering="crispEdges"><rect width="18" height="18" fill="#3d6fd8"/>${rects}</svg>`;
writeFileSync('public/icons/icon.svg', svg);

const { chromium } = await import(process.env.PLAYWRIGHT_PATH ?? 'playwright');
const browser = await chromium.launch();
for (const [name, size] of [['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  await page.setContent(`<body style="margin:0">${svg.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body>`);
  await page.screenshot({ path: `public/icons/${name}`, omitBackground: false });
  await page.close();
}
await browser.close();
console.log('Icons written to public/icons/');
