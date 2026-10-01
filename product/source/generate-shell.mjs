// Edit shell.template.html, then run `node product/source/generate-shell.mjs`.
// `--check` verifies committed delivery outputs without writing files.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { UI_B_MENU_CONTRIBUTIONS } from './ui/capability-contributions.js';

const root = dirname(fileURLToPath(import.meta.url));
const template = readFileSync(join(root, 'shell.template.html'), 'utf8');
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
function assembleCapabilityMenus(html) {
  for (const menu of new Set(UI_B_MENU_CONTRIBUTIONS.map(item => item.menu))) {
    const entries = UI_B_MENU_CONTRIBUTIONS.filter(item => item.menu === menu);
    let section = null;
    const markup = entries.map(item => {
      const divider = section && section !== item.section ? '<span class="application-menu-separator" role="separator"></span>' : '';
      section = item.section;
      return divider + `<button type="button" role="menuitem" data-ui-b-contribution="${escapeHtml(item.id)}" data-ui-b-command="${escapeHtml(item.command)}"><span>${escapeHtml(item.label)}</span>${item.shortcut ? `<kbd>${escapeHtml(item.shortcut)}</kbd>` : ''}</button>`;
    }).join('');
    const anchor = new RegExp(`(<div id="${menu}Menu"[^>]*>)([\\s\\S]*?)(\\n        </div>)`);
    if (!anchor.test(html)) throw new Error(`Missing capability menu: ${menu}`);
    html = html.replace(anchor, (_, start, contents, end) => start + contents + '\n          ' + markup + end);
  }
  return html;
}
const targets = [
  ['index.html', 'Web', 'manifest.webmanifest', '<span class="web-surface-badge">WEB</span>', '<script type="module" src="src/ink.js?v=0.1-ui-20261001-light4"></script>'],
  ['index-standalone.html', 'Portable', 'manifest-portable.webmanifest', '', '<script src="dist/ink.compat.js?v=0.1-ui-20261001-light4"></script>']
];

for (const [file, delivery, manifest, badge, runtime] of targets) {
  const substitutions = { DELIVERY: delivery, MANIFEST: manifest, WEB_BADGE: badge, RUNTIME_SCRIPT: runtime };
  const output = assembleCapabilityMenus(template.replace(/\{\{([A-Z_]+)\}\}/g, (match, name) => {
    if (!(name in substitutions)) throw new Error(`Unknown shell token: ${name}`);
    return substitutions[name];
  }));
  if (/\{\{[A-Z_]+\}\}/.test(output)) throw new Error(`Unresolved shell token in ${file}`);
  const path = join(root, file);
  if (process.argv.includes('--check')) {
    if (readFileSync(path, 'utf8') !== output) throw new Error(`${file} differs from shell.template.html; regenerate it`);
  } else writeFileSync(path, output);
}

