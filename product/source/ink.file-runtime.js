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
