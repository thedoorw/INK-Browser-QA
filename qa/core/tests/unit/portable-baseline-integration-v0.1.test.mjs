import test from 'node:test';
import assert from 'node:assert/strict';
import {
  existsSync,
  readFileSync,
  readdirSync
} from 'node:fs';
import {
  dirname,
  relative,
  resolve,
  sep
} from 'node:path';
import { fileURLToPath } from 'node:url';

import { FORMAT_VERSION } from '../../../../product/source/src/config.js';
import {
  InkStore,
  RevisionController,
  defaultDocument,
  documentFingerprint,
  unwrapInkFile,
  wrapInkFile
} from '../../../../product/source/src/document/index.js';
import { HistoryManager } from '../../../../product/source/src/history/index.js';
import { ChatBoundedEditController } from '../../../../product/source/src/editor/chat-bounded-edit.js';
import { ChatCreativePlanController } from '../../../../product/source/src/editor/chat-creative-plan.js';
import { CreativeWorkspaceController } from '../../../../product/source/src/editor/creative-workspace.js';

const repoRoot = fileURLToPath(new URL('../../../../', import.meta.url));
const sourceRoot = resolve(repoRoot, 'product/source');
const srcRoot = resolve(sourceRoot, 'src');

const readSource = path => readFileSync(resolve(sourceRoot, path), 'utf8');
const clone = value => JSON.parse(JSON.stringify(value));

function walk(dir) {
  const found = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const absolute = resolve(dir, entry.name);
    if (entry.isDirectory()) found.push(...walk(absolute));
    else found.push(absolute);
  }
  return found;
}

function sourceRelative(file) {
  return relative(srcRoot, file).split(sep).join('/');
}

function localModuleSpecifiers(source) {
  const specs = new Set();
  const patterns = [
    /(?:^|\n)\s*import\s+(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]/g,
    /(?:^|\n)\s*export\s+(?:\*|\{[\s\S]*?\})\s+from\s+['"]([^'"]+)['"]/g,
    /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g
  ];
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      if (match[1]?.startsWith('.')) specs.add(match[1]);
    }
  }
  return [...specs];
}

function makeRevisionApp(store = new InkStore()) {
  const app = {
    doc: defaultDocument(),
    store,
    selection: [],
    draft: null,
    strokeEdit: null,
    dirty: false,
    updateHistoryUI() {},
    refreshAll() {},
    renderer: { render() {} },
    markDirty() { this.dirty = true; },
    replaceDocument(next, { fromHistory = false } = {}) {
      this.doc = clone(next);
      this.selection = [];
      this.draft = null;
      this.strokeEdit = null;
      if (!fromHistory) {
        this.history.clear();
        this.dirty = false;
      }
    }
  };
  app.history = new HistoryManager(app);
  app.revisions = new RevisionController(app, { store });
  return app;
}

test('portable static shell is an exact local closure of product/source/src', () => {
  const serviceWorker = readSource('service-worker.js');
  const sourceFiles = walk(srcRoot)
    .filter(file => /\.(?:js|json)$/i.test(file))
    .map(file => `./src/${sourceRelative(file)}`)
    .sort();
  const shellFiles = [...serviceWorker.matchAll(/['"](\.\/src\/[^'"]+)['"]/g)]
    .map(match => match[1])
    .sort();

  assert.doesNotThrow(() => new Function(serviceWorker));
  assert.deepEqual(shellFiles, sourceFiles);
  for (const path of shellFiles) {
    assert.equal(existsSync(resolve(sourceRoot, path.replace(/^\.\//, ''))), true, path);
  }
  assert.doesNotMatch(serviceWorker, /icons\/ink-(?:192|512)\.png/);
  assert.match(serviceWorker, /const PRODUCT_VERSION = '0\.1'/);
  assert.match(serviceWorker, /const CACHE_PREFIX = 'ink-build-'/);
  assert.match(serviceWorker, /searchParams\.get\('build'\)/);
  assert.doesNotMatch(serviceWorker, /const RELEASE_VERSION = '0\.1-Web'/);

  const manifest = JSON.parse(readSource('manifest.webmanifest'));
  assert.deepEqual(manifest.icons, []);
});

test('all local static ES module references resolve to files in the shared source tree', () => {
  const modules = walk(srcRoot).filter(file => file.endsWith('.js'));
  const unresolved = [];

  for (const file of modules) {
    const source = readFileSync(file, 'utf8');
    for (const specifier of localModuleSpecifiers(source)) {
      const clean = specifier.split(/[?#]/, 1)[0];
      const candidate = resolve(dirname(file), clean);
      if (!existsSync(candidate)) {
        unresolved.push(`${sourceRelative(file)} -> ${specifier}`);
      }
    }
  }

  assert.deepEqual(unresolved, []);
});

test('portable entries converge on one authoritative shared runtime with deterministic install order', () => {
  const index = readSource('index.html');
  const standalone = readSource('index-standalone.html');
  const compat = readSource('dist/ink.compat.js');
  const ink = readSource('src/ink.js');

  assert.match(index, /<script type="module" src="src\/ink\.js"><\/script>/);
  assert.match(standalone, /<script src="dist\/ink\.compat\.js"><\/script>/);
  assert.match(compat, /import\(['"]\.\.\/src\/ink\.js['"]\)/);

  const sequence = [
    'installStudioCore(this)',
    'installExtraction(this)',
    'installPathEditing(this)',
    'installExpressiveStroke(this)',
    'installRepaintMaterial(this)',
    'installRevision(this,{store:this.store})',
    'installChatBoundedEdit(this)',
    'installChatCreativePlan(this)',
    'installCreativeWorkspace(this)'
  ];
  let previous = -1;
  for (const marker of sequence) {
    const at = ink.indexOf(marker);
    assert.ok(at > previous, marker);
    previous = at;
  }

  assert.equal((ink.match(/new HistoryManager\s*\(/g) || []).length, 1);
  assert.equal((ink.match(/new InkStore\s*\(/g) || []).length, 1);
});

test('structured document open/save roundtrip preserves FORMAT_VERSION 4 and identity', () => {
  const document = defaultDocument();
  const envelope = wrapInkFile(document, {
    savedAt: '2026-09-21T00:00:00.000Z'
  });
  const reopened = unwrapInkFile(JSON.parse(JSON.stringify(envelope)));

  assert.equal(FORMAT_VERSION, 4);
  assert.equal(document.formatVersion, 4);
  assert.equal(reopened.formatVersion, 4);
  assert.equal(reopened.id, document.id);
  assert.equal(documentFingerprint(reopened), documentFingerprint(document));
});

test('History and Revision remain browser-local compatible authorities', async () => {
  const app = makeRevisionApp();
  const originalTitle = app.doc.title;

  app.history.pushScoped('portable-title', [['title']], () => {
    app.doc.title = 'Portable Integration';
  });
  assert.equal(app.history.undoStack.length, 1);
  assert.equal(app.history.undo(), true);
  assert.equal(app.doc.title, originalTitle);
  assert.equal(app.history.redo(), true);
  assert.equal(app.doc.title, 'Portable Integration');

  const captured = await app.revisions.capture({
    createdAt: '2026-09-21T00:01:00.000Z',
    reason: 'portable-integration'
  });
  assert.equal(captured.created, true);

  app.history.pushScoped('portable-title-2', [['title']], () => {
    app.doc.title = 'After Revision';
  });
  const restored = await app.revisions.restore(captured.record);
  assert.equal(restored.restored, true);
  assert.equal(restored.historyBoundary, 'RESET_TO_REVISION');
  assert.equal(app.doc.title, 'Portable Integration');
  assert.equal(app.history.undoStack.length, 0);
  assert.equal(app.history.redoStack.length, 0);
});

test('CHAT local collaboration controllers are present without mandatory remote transport', () => {
  assert.equal(typeof ChatBoundedEditController, 'function');
  assert.equal(typeof ChatCreativePlanController, 'function');
  assert.equal(typeof CreativeWorkspaceController, 'function');

  const localCoreSources = [
    'src/document/storage.js',
    'src/document/revision.js',
    'src/editor/chat-bounded-edit.js',
    'src/editor/chat-creative-plan.js',
    'src/editor/creative-workspace.js'
  ];

  for (const path of localCoreSources) {
    const source = readSource(path);
    assert.doesNotMatch(source, /\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon\s*\(/, path);
  }

  const remoteAdapter = readSource('src/ai/chat-runtime.js');
  assert.match(remoteAdapter, /localOnlyMode/);
  assert.match(remoteAdapter, /LOCAL_ONLY_NETWORK_BLOCKED/);
  assert.match(remoteAdapter, /fetchImpl\s*=\s*globalThis\.fetch/);
  assert.match(remoteAdapter, /this\.settings\.endpoint/);
});

test('portable baseline keeps package and format boundaries outside shared-core integration', () => {
  assert.equal(FORMAT_VERSION, 4);
  assert.equal(existsSync(resolve(repoRoot, 'product/source/src/ink.js')), true);
  assert.equal(existsSync(resolve(repoRoot, 'product/source/service-worker.js')), true);
});
