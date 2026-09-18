/* INK v0.1 direct-file Runtime loader. */
(() => {
  const modules = window.__INK_FILE_MODULES__ || {};
  const entry = '@ink/src/ink.js';
  const state = window.__INK_FILE_RUNTIME__ = {
    mode: 'file-compatible',
    state: 'loading',
    entry,
    moduleCount: Object.keys(modules).length,
    error: null
  };

  const fail = error => {
    state.state = 'failed';
    state.error = String(error?.message || error || 'Unknown direct-file Runtime error');
    document.documentElement.dataset.inkFileRuntime = 'failed';
    console.error('INK_FILE_RUNTIME_FAILED', error);
  };

  const waitFor = async (predicate, timeoutMs = 12000) => {
    const started = performance.now();
    while (performance.now() - started < timeoutMs) {
      if (predicate()) return true;
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    return false;
  };

  const runFileSmoke = async () => {
    if (new URLSearchParams(location.search).get('ink-file-smoke') !== '1') return;
    const root = document.documentElement;
    root.dataset.inkFileUiSmoke = 'running';
    try {
      if (!(await waitFor(() => Boolean(window.INK_TEST)))) throw new Error('INK_TEST did not initialize in file mode.');

      const app = document.querySelector('#app');
      const layout = document.querySelector('[data-space="layout"]');
      const inspectorToggle = document.querySelector('#inspectorToggle');
      const inspector = document.querySelector('#inspector');
      if (!app || !layout || !inspectorToggle || !inspector) throw new Error('Required UI controls are missing.');

      layout.click();
      await new Promise(resolve => setTimeout(resolve, 80));
      const workspacePass = app.dataset.space === 'layout';

      const wasOpen = app.classList.contains('inspector-open');
      if (wasOpen) inspectorToggle.click();
      inspectorToggle.click();
      await new Promise(resolve => setTimeout(resolve, 50));
      const inspectorPass = app.classList.contains('inspector-open') &&
        inspector.getAttribute('aria-hidden') === 'false' &&
        inspectorToggle.getAttribute('aria-expanded') === 'true';

      if (app.classList.contains('inspector-open')) inspectorToggle.click();

      root.dataset.inkFileWorkspace = workspacePass ? 'pass' : 'fail';
      root.dataset.inkFileInspector = inspectorPass ? 'pass' : 'fail';
      root.dataset.inkFileUiSmoke = workspacePass && inspectorPass ? 'pass' : 'fail';
    } catch (error) {
      root.dataset.inkFileUiSmoke = 'fail';
      root.dataset.inkFileUiSmokeError = String(error?.message || error);
      console.error('INK_FILE_UI_SMOKE_FAILED', error);
    }
  };

  try {
    if (!modules[entry]) throw new Error('INK direct-file entry module is missing.');
    const imports = {};
    const objectUrls = [];

    for (const [id, record] of Object.entries(modules)) {
      const source = typeof record === 'string' ? record : record.source;
      const mime = typeof record === 'string' ? 'text/javascript' : (record.mime || 'text/javascript');
      const url = URL.createObjectURL(new Blob([source], { type: mime }));
      imports[id] = url;
      objectUrls.push(url);
    }

    const importMap = document.createElement('script');
    importMap.type = 'importmap';
    importMap.textContent = JSON.stringify({ imports });
    (document.head || document.documentElement).append(importMap);

    const bootstrapUrl = URL.createObjectURL(new Blob([
      'import "@ink/src/ink.js";\n' +
      'window.__INK_FILE_RUNTIME__.state = "loaded";\n' +
      'document.documentElement.dataset.inkFileRuntime = "loaded";'
    ], { type: 'text/javascript' }));
    objectUrls.push(bootstrapUrl);

    const bootstrap = document.createElement('script');
    bootstrap.type = 'module';
    bootstrap.src = bootstrapUrl;
    bootstrap.onload = () => { runFileSmoke(); };
    bootstrap.onerror = () => fail(new Error('Direct-file module bootstrap failed.'));
    document.body.append(bootstrap);

    window.addEventListener('error', event => {
      if (state.state !== 'loaded') fail(event.error || event.message);
    });
    window.addEventListener('unhandledrejection', event => {
      if (state.state !== 'loaded') fail(event.reason);
    });
    window.addEventListener('beforeunload', () => {
      for (const url of objectUrls) URL.revokeObjectURL(url);
    }, { once: true });
  } catch (error) {
    fail(error);
  }
})();
