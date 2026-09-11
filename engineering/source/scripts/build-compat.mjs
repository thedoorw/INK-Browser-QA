import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
await mkdir(dist, { recursive: true });
const bootstrap = `/* INK v1.6.2 RC dependency-free browser bootstrap.\n * The authoritative modular Runtime remains src/ink.js. */\n(async()=>{\n  try { await import('../src/ink.js'); }\n  catch (error) { console.error('INK_COMPAT_BOOTSTRAP_FAILED', error); throw error; }\n})();\n`;
await writeFile(path.join(dist, 'ink.compat.js'), bootstrap);
const index = await readFile(path.join(root, 'index.html'), 'utf8');
const standalone = index.replace('<script type="module" src="src/ink.js"></script>', '<script src="dist/ink.compat.js"></script>');
if (standalone === index) throw new Error('INK_BUILD_ENTRY_SCRIPT_NOT_FOUND');
await writeFile(path.join(root, 'index-standalone.html'), standalone);
console.log('Built dependency-free dist/ink.compat.js bootstrap and index-standalone.html');
