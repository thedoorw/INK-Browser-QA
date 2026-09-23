// Edit shell.template.html, then run `node product/source/generate-shell.mjs`.
// `--check` verifies committed delivery outputs without writing files.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));
const template = readFileSync(join(root, 'shell.template.html'), 'utf8');
const targets = [
  ['index.html', 'Web', 'manifest.webmanifest', '<span class="web-surface-badge">WEB</span>', '<script type="module" src="src/ink.js?v=0.1"></script>'],
  ['index-standalone.html', 'Portable', 'manifest-portable.webmanifest', '', '<script src="dist/ink.compat.js?v=0.1"></script>']
];

for (const [file, delivery, manifest, badge, runtime] of targets) {
  const substitutions = { DELIVERY: delivery, MANIFEST: manifest, WEB_BADGE: badge, RUNTIME_SCRIPT: runtime };
  const output = template.replace(/\{\{([A-Z_]+)\}\}/g, (match, name) => {
    if (!(name in substitutions)) throw new Error(`Unknown shell token: ${name}`);
    return substitutions[name];
  });
  if (/\{\{[A-Z_]+\}\}/.test(output)) throw new Error(`Unresolved shell token in ${file}`);
  const path = join(root, file);
  if (process.argv.includes('--check')) {
    if (readFileSync(path, 'utf8') !== output) throw new Error(`${file} differs from shell.template.html; regenerate it`);
  } else writeFileSync(path, output);
}
