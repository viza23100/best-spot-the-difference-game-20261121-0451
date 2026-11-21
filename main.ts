import { cpSync, mkdirSync, realpathSync, writeFileSync } from 'node:fs';
import { dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const root = dirname(fileURLToPath(import.meta.url));
const output = resolve(process.env.MAKEFUN_OUTPUT_DIR || '/output');
for (const folder of ['game', 'screenshots']) {
  const source = realpathSync(resolve(root, folder));
  if (output === source || output.startsWith(source + sep)) throw new Error('Output must be outside the source folders.');
}
mkdirSync(output, { recursive: true });
for (const folder of ['game', 'screenshots']) cpSync(resolve(root, folder), resolve(output, folder), { recursive: true, dereference: false });
writeFileSync(resolve(output, 'dossier.json'), buildDossier(output, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
}));
console.log('Riverlight: game, screenshots and deterministic dossier exported.');
