/* INK v1.6.2 RC dependency-free browser bootstrap.
 * The authoritative modular Runtime remains src/ink.js. */
(async()=>{
  try { await import('../src/ink.js'); }
  catch (error) { console.error('INK_COMPAT_BOOTSTRAP_FAILED', error); throw error; }
})();
