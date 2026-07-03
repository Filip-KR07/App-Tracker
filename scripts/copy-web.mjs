// Kopiert die Web-Assets aus dem Repo-Root in www/,
// damit Capacitor sie in das native iOS-Projekt übernehmen kann.
// index.html bleibt im Root, damit GitHub Pages weiter funktioniert.

import { mkdirSync, copyFileSync, existsSync, rmSync } from 'node:fs';

const OUT = 'www';

const FILES = [
  'index.html',
  'sw.js',
  'manifest.json',
  'icon.png',
  'icon.svg',
  'icon.png.HEIC',
  'custom-image.png',
  'custom-sound.mp3',
];

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

let n = 0;
for (const f of FILES) {
  if (existsSync(f)) {
    copyFileSync(f, `${OUT}/${f}`);
    console.log('  ✓', f);
    n++;
  }
}

console.log(`\n${n} Datei(en) → ${OUT}/`);
