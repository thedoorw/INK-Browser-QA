/* INK v0.1 single user entry.
 * HTTP(S): authoritative modular ESM Runtime.
 * file://: generated direct-file module packs + blob/import-map Runtime.
 */
(() => {
  if (location.protocol !== 'file:') {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'src/ink.js';
    document.body.append(script);
    return;
  }

  const files = [
    'ink.file-modules-01.js',
    'ink.file-modules-02.js',
    'ink.file-modules-03.js',
    'ink.file-modules-04.js',
    'ink.file-modules-05a.js',
    'ink.file-modules-05b.js',
    'ink.file-modules-05c.js',
    'ink.file-modules-05d.js',
    'ink.file-modules-05e.js',
    'ink.file-modules-05f.js',
    'ink.file-modules-05g.js',
    'ink.file-modules-06.js',
    'ink.file-modules-07.js',
    'ink.file-modules-08.js',
    'ink.file-modules-09.js',
    'ink.file-modules-10.js',
    'ink.file-modules-11.js',
    'ink.file-modules-12.js',
    'ink.file-runtime.js'
  ];

  window.__INK_FILE_MODULES__ = {};
  const loadNext = index => {
    if (index >= files.length) return;
    const script = document.createElement('script');
    script.src = files[index];
    script.onload = () => loadNext(index + 1);
    script.onerror = () => {
      document.documentElement.dataset.inkFileRuntime = 'failed';
      console.error('INK_FILE_ENTRY_LOAD_FAILED', files[index]);
    };
    document.body.append(script);
  };
  loadNext(0);
})();
