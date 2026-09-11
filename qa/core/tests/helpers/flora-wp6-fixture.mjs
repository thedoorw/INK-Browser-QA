import { defaultDocument } from '../../src/document/model.js';
import { HistoryManager } from '../../src/history/history.js';
import { installFloraActionLayer } from '../../src/flora/index.js';

export const WP6_PRESETS = {
  'brush-round': { id: 'brush-round', kind: 'brush', size: 12, opacity: .88, smoothing: .46, pressure: .95, taper: .42, flow: .82, wetness: .36, bristle: .18 },
  'brush-letter': { id: 'brush-letter', kind: 'brush', size: 8, opacity: .95, smoothing: .54, pressure: 1, taper: .58, flow: .94, wetness: .22, bristle: .28 },
  'air-soft': { id: 'air-soft', kind: 'airbrush', size: 42, opacity: .09, smoothing: .7, pressure: .55, softness: .9 }
};

export function createWP6App(document = defaultDocument()) {
  const app = {
    doc: structuredClone(document), brushPresetCatalog: structuredClone(WP6_PRESETS), toolSettings: {}, spatialDirty: false,
    page() { return this.doc.pages[0]; }, pagePath() { return ['pages', 0]; },
    layerPath(layer) { return ['pages', 0, 'layers', this.page().layers.indexOf(layer)]; },
    layerObjectsPath(layer) { return [...this.layerPath(layer), 'objects']; },
    refreshAll() {}, markDirty() {}, updateHistoryUI() {},
    renderer: { render() {}, invalidateTiles() {}, naturalMedia: { clearCaches() {} } },
    replaceDocument(next) { this.doc = next; this.flora?.adapter?.maskCache?.clear(); }
  };
  app.history = new HistoryManager(app);
  app.flora = installFloraActionLayer(app);
  return app;
}

export function createWP6Plan(seed = 606, patch = {}) {
  const heroId = patch.heroId || 'wp6-a4-hero';
  const planId = patch.planId || 'wp6-a4-hero-plan';
  const petalCount = patch.petalCount || 8;
  const brushes = { wash: 'brush-round', shadow: 'brush-round', light: 'air-soft', glaze: 'brush-round', detail: 'brush-letter', soft: 'air-soft' };
  const metadata = (label, extra = {}) => ({ source: 'ai', label, ...extra });
  const plan = {
    planId, schemaVersion: '0.1', heroId,
    composition: { page: 'A4 portrait', normalized: true, crownMode: 'Single', leafCount: 'Two', crownTop: .02, crownHeight: .5, stemAxisX: .5, stemWidthRatio: 1 / 12, leafWidth: 'Medium', leafTip: 'Pointed', leafCurve: 'Gentle Wave', singleFocalPoint: true },
    crownPlan: {
      planId: `${planId}:crown`, schemaVersion: '0.1', crownId: `${heroId}:crown`, petalCount,
      crownBasePalette: ['#b65372', '#dc8ca3', '#9d3c5a'], petalPaletteVariation: { lightnessRange: [-.06, .08], saturationRange: [-.04, .06] },
      centerPalette: ['#6f263d', '#d49b55', '#f2d899'], globalLightDirection: { x: -.45, y: -.89 }, depthOrder: 'topology-z', focalRegion: { petalIndex: 0 },
      edgeHierarchy: { focal: 'crisp', front: 'mixed', rear: 'soft' }, shadowStrategy: { root: .82, fold: .68, overlap: .88 }, glazeStrategy: { strength: .62, passes: 1 },
      backgroundExclusionMask: { enabled: true, mode: 'crown-envelope' }, brushPresets: brushes, seed, metadata: metadata('WP6 abstract Single Crown')
    },
    stemPlan: { regionId: `${heroId}:stem`, palette: ['#416b4f', '#6e9270', '#294936'], brushPresets: brushes, opacityScale: .82, edgeSoftness: .015, seed: seed + 11, metadata: metadata('WP6 central stem') },
    leafPlans: [
      { regionId: `${heroId}:leaf:left`, palette: ['#3e6b4b', '#719373', '#294a36'], brushPresets: brushes, opacityScale: .86, edgeSoftness: .018, seed: seed + 21, metadata: metadata('WP6 left leaf', { side: 'left' }) },
      { regionId: `${heroId}:leaf:right`, palette: ['#426f50', '#759877', '#2d4f39'], brushPresets: brushes, opacityScale: .84, edgeSoftness: .019, seed: seed + 22, metadata: metadata('WP6 right leaf', { side: 'right' }) }
    ],
    backgroundPlan: { regionId: `${heroId}:background`, palette: ['#eadfda', '#e1d3cf', '#f1e7e2'], brushPresets: brushes, contrast: .16, textureStrength: .12, edgeSoftness: .025, seed: seed + 31, metadata: metadata('WP6 quiet background') },
    globalPalette: ['#b65372', '#dc8ca3', '#9d3c5a', '#416b4f', '#719373', '#eadfda'], globalLightDirection: { x: -.45, y: -.89 },
    focalHierarchy: { primary: 'crown', secondary: ['stem', 'leaves', 'background'] }, edgeHierarchy: { crown: 'mixed', stem: 'mixed', leaves: 'mixed', background: 'soft' },
    depthStrategy: { mode: 'topology-z', background: 'behind-subject', stem: 'front-of-leaves-behind-crown' },
    colorContinuity: { sharedWarmCool: true, subjectBackgroundRelation: .72 }, backgroundContrast: .16,
    smallViewRequirements: { crown: true, stem: true, twoLeaves: true }, seed, metadata: metadata('WP6 Complete A4 Hero Benchmark C2')
  };
  delete patch.petalCount;
  return { ...plan, ...structuredClone(patch), crownPlan: patch.crownPlan || plan.crownPlan };
}

export function addManualStroke(app, id = 'manual-wp6-stroke') {
  app.page().layers[0].objects.push({ id, type: 'stroke', name: 'Manual WP6', matrix: { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }, opacity: 1, color: '#222222', size: 2, kind: 'pen', points: [{ x: 20, y: 20, p: 1 }, { x: 35, y: 30, p: 1 }] });
  return id;
}

export function stableObjectHash(app, ids) {
  const json = JSON.stringify(ids.map(id => app.flora.adapter.findObject(id)?.object).filter(Boolean));
  let value = 0x811c9dc5;
  for (let i = 0; i < json.length; i += 1) { value ^= json.charCodeAt(i); value = Math.imul(value, 0x01000193); }
  return (value >>> 0).toString(16).padStart(8, '0');
}
