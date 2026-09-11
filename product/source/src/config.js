export const INK_VERSION = '0.1';
export const FORMAT_VERSION = 4;
export const RELEASE_NAME = 'Health';

// User-facing product identity remains INK v0.1 throughout pre-completion development.
// Development stage is expressed only as a short suffix; historical source versions
// remain preserved in governance / QA evidence and are not rewritten globally.
if (typeof document !== 'undefined') document.title = `INK v${INK_VERSION} — ${RELEASE_NAME}`;
