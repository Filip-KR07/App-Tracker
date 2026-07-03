// Erzeugt aus icon.svg alle benötigten PNG-Icons (iOS + PWA).
//
// Einmalig lokal ausführen:
//   npm install --save-dev sharp
//   node scripts/generate-icons.mjs
//
// Ausgabe in ./icons/. Für Xcode 14+ genügt icon-1024.png im
// App-Icon-Asset; die übrigen Größen sind für PWA/ältere Setups dabei.

import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'node:fs';

const SRC = 'icon.svg';
const OUT = 'icons';
const BG = '#0D0D0E'; // App-Store-Icon darf keine Transparenz haben

// px-Größen: iOS AppIcon + PWA (192/512) + apple-touch (180) + Store (1024)
const SIZES = [40, 58, 60, 76, 80, 87, 120, 152, 167, 180, 192, 512, 1024];

const svg = readFileSync(SRC);
mkdirSync(OUT, { recursive: true });

for (const s of SIZES) {
  await sharp(svg, { density: 512 })
    .resize(s, s, { fit: 'contain', background: BG })
    .flatten({ background: BG })
    .png()
    .toFile(`${OUT}/icon-${s}.png`);
  console.log('  ✓ icon-' + s + '.png');
}

console.log(`\n${SIZES.length} Icons → ${OUT}/`);
console.log('App Store: icons/icon-1024.png  ·  PWA: 192/512  ·  apple-touch: 180');
