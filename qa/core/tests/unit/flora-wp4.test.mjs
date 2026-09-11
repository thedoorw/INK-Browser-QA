import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultDocument } from '../../src/document/model.js';
import { HistoryManager } from '../../src/history/history.js';
import { Matrix } from '../../src/core/math.js';
import { installFloraActionLayer } from '../../src/flora/index.js';
import { PAINTING_RECIPE_OPERATIONS } from '../../src/flora/recipe/painting-recipe-schema.js';
import { paintingRecipeRoundtrip } from '../../src/flora/recipe/painting-recipe-compiler.js';
import { vectorPathContains, worldPointToNormalized } from '../../src/flora/mask/vector-mask.js';
import { validateFloraAction } from '../../src/flora/action/flora-action-validator.js';

const PRESETS = {
  'brush-round': { id: 'brush-round', kind: 'brush', size: 12, opacity: .88, smoothing: .46, pressure: .95, taper: .42, flow: .82, wetness: .36, bristle: .18 },
  'brush-letter': { id: 'brush-letter', kind: 'brush', size: 8, opacity: .95, smoothing: .54, pressure: 1, taper: .58, flow: .94, wetness: .22, bristle: .28 },
  'air-soft': { id: 'air-soft', kind: 'airbrush', size: 42, opacity: .09, smoothing: .7, pressure: .55, softness: .9 }
};

function createApp() {
  const app = {
    doc: defaultDocument(), brushPresetCatalog: structuredClone(PRESETS), toolSettings: {}, spatialDirty: false,
    page() { return this.doc.pages[0]; }, pagePath() { return ['pages', 0]; },
    layerPath(layer) { return ['pages', 0, 'layers', this.page().layers.indexOf(layer)]; },
    layerObjectsPath(layer) { return [...this.layerPath(layer), 'objects']; },
    refreshAll() {}, markDirty() {}, updateHistoryUI() {},
    renderer: { render() {}, invalidateTiles() {}, naturalMedia: { clearCaches() {} } },
    replaceDocument(document) { this.doc = document; this.flora?.adapter?.maskCache?.clear(); }
  };
  app.history = new HistoryManager(app);
  app.flora = installFloraActionLayer(app);
  app.flora.hero.createBenchmarkThreePetals({ profileId: 'wp4-three-petal', feather: .012, seed: 404 }, { history: false });
  return app;
}

const IDs = {
  left: 'wp4-three-petal:petal:rear-left', right: 'wp4-three-petal:petal:rear-right', front: 'wp4-three-petal:petal:front-center'
};
const defaultsByOperation = {
  'Base Wash': ['brush-round', 'contour-follow', ['#bd6178', '#d58a9d'], 'source-over'],
  'Root Shadow': ['brush-round', 'base-to-tip', ['#7b2944'], 'multiply'],
  'Fold Shadow': ['brush-letter', 'base-to-tip', ['#8d3854'], 'multiply'],
  'Central Light': ['air-soft', 'base-to-tip', ['#f1c8d2'], 'screen'],
  'Edge Light': ['brush-letter', 'contour-follow', ['#f5d9df'], 'screen'],
  'Overlap Shadow': ['brush-round', 'contour-follow', ['#6f263e'], 'multiply'],
  'Transparent Glaze': ['brush-round', 'base-to-tip', ['#b14d70'], 'soft-light'],
  'Directional Brushwork': ['brush-letter', 'base-to-tip', ['#ca6d83'], 'source-over'],
  'Boundary Dissolve': ['air-soft', 'contour-follow', ['#edb9c7'], 'source-over']
};

function recipe(operation, regionId = IDs.front, seed = 700, extra = {}) {
  const [brushPreset, direction, palette, blendMode] = defaultsByOperation[operation];
  const constraints = operation === 'Overlap Shadow' ? { frontRegionId: IDs.front, bandWidth: .045, preserveManual: true } :
    operation === 'Fold Shadow' ? { foldSide: 'center', bandWidth: .06, preserveManual: true } :
    { bandWidth: .05, preserveManual: true };
  return {
    recipeId: `recipe-${operation.replace(/\s+/g, '-').toLowerCase()}-${regionId.split(':').at(-1)}`,
    schemaVersion: '0.1', targetRegionId: regionId, operation, brushPreset, direction, palette,
    coverage: .82, opacity: [.07, .22], density: 8, spacing: .036, widthRange: [5, 20],
    jitter: .12, feather: .014, passes: 1, blendMode, seed, constraints,
    metadata: { source: 'ai', label: `${operation} test` }, ...extra
  };
}

function absolutePoints(stroke) { return stroke.points.map(point => Matrix.point(stroke.matrix, point)); }
function assertInside(app, regionId, strokes) {
  const region = app.flora.adapter.region(regionId);
  for (const stroke of strokes) for (const point of absolutePoints(stroke)) {
    assert.equal(vectorPathContains(region.path, worldPointToNormalized(app.page(), point)), true, `${stroke.id} leaked`);
  }
}

function executeBasicTriplet(app) {
  const sequence = [
    recipe('Base Wash', IDs.left, 101), recipe('Root Shadow', IDs.left, 102), recipe('Overlap Shadow', IDs.left, 103),
    recipe('Base Wash', IDs.right, 111), recipe('Root Shadow', IDs.right, 112), recipe('Overlap Shadow', IDs.right, 113),
    recipe('Base Wash', IDs.front, 121), recipe('Fold Shadow', IDs.front, 122), recipe('Central Light', IDs.front, 123),
    recipe('Edge Light', IDs.front, 124), recipe('Transparent Glaze', IDs.front, 125), recipe('Directional Brushwork', IDs.front, 126),
    recipe('Boundary Dissolve', IDs.front, 127)
  ];
  return sequence.map(item => app.flora.recipe.execute(item));
}

test('WP-3 governance baseline remains intact and WP-4 exposes exactly nine Recipe operations', () => {
  assert.deepEqual(PAINTING_RECIPE_OPERATIONS, [
    'Base Wash', 'Root Shadow', 'Fold Shadow', 'Central Light', 'Edge Light',
    'Overlap Shadow', 'Transparent Glaze', 'Directional Brushwork', 'Boundary Dissolve'
  ]);
  const app = createApp();
  assert.equal(app.flora.schemaVersion, '0.5');
  assert.equal(app.page().floraHero.regions.length, 3);
});

test('all nine Painting Recipe operations validate, compile, preview, and execute as editable clipped strokes', () => {
  for (const [index, operation] of PAINTING_RECIPE_OPERATIONS.entries()) {
    const app = createApp(), regionId = operation === 'Overlap Shadow' ? IDs.left : IDs.front;
    const input = recipe(operation, regionId, 800 + index);
    const validation = app.flora.recipe.validate(input);
    assert.equal(validation.ok, true, `${operation}: ${JSON.stringify(validation.errors)}`);
    const compiled = app.flora.recipe.compile(input);
    assert.equal(compiled.ok, true);
    assert.ok(compiled.actions.some(action => action.type === 'paintRegion'));
    const preview = app.flora.recipe.preview(input);
    assert.equal(preview.ok, true);
    assert.ok(preview.strokes.length > 0);
    assert.equal(preview.strokeActions.length, preview.strokes.length);
    assert.ok(preview.strokeActions.every(action => action.type === 'createStroke' && validateFloraAction(action, app.flora.adapter).ok));
    assertInside(app, regionId, preview.strokes);
    const result = app.flora.recipe.execute(input);
    assert.equal(result.ok, true, `${operation}: ${JSON.stringify(result)}`);
    assert.equal(result.historyEntriesAdded, 1);
    assert.equal(result.expandedActionLog.length, result.strokeIds.length);
    assert.ok(result.expandedActionLog.every(action => action.type === 'createStroke'));
    const objects = app.page().layers[0].objects.filter(object => result.strokeIds.includes(object.id));
    assert.ok(objects.length > 0);
    assert.ok(objects.every(object => object.floraPaint?.recipeId === input.recipeId));
    assert.ok(objects.every(object => object.blendMode === input.blendMode));
    assertInside(app, regionId, objects);
  }
});

test('same Recipe and seed are deterministic while different seed changes compiler output', () => {
  const a = createApp(), input = recipe('Directional Brushwork', IDs.front, 913);
  const first = a.flora.recipe.preview(input), second = a.flora.recipe.preview(structuredClone(input));
  assert.deepEqual(first.preview.compilerHashes, second.preview.compilerHashes);
  const b = a.flora.recipe.preview({ ...structuredClone(input), seed: 914 });
  assert.notDeepEqual(first.preview.compilerHashes, b.preview.compilerHashes);
});

test('Recipe JSON roundtrip and Recipe-to-Action-to-Scene replay preserve hashes and bidirectional mapping', () => {
  const app = createApp(), input = recipe('Transparent Glaze', IDs.front, 1001, { passes: 2 });
  assert.deepEqual(paintingRecipeRoundtrip(input), input);
  const result = app.flora.recipe.execute(input);
  assert.equal(result.ok, true);
  const mapping = app.flora.recipe.mapping(input.recipeId);
  assert.ok(mapping.actionIds.length >= 2);
  assert.ok(mapping.strokeIds.length > 0);
  const state = app.page().floraRecipeState;
  assert.ok(mapping.actionIds.every(id => state.actionToRecipe[id] === input.recipeId));
  assert.ok(mapping.strokeIds.every(id => state.strokeToRecipe[id] === input.recipeId));
  const replay = app.flora.replayHash(), serialized = app.flora.serializeDocument();
  app.flora.reloadDocument(serialized);
  assert.equal(app.flora.replayHash(), replay);
  assert.deepEqual(app.flora.recipe.mapping(input.recipeId), mapping);
});

test('local recompile replaces only the selected Recipe and preserves other regions plus manual strokes', () => {
  const app = createApp(), layer = app.page().layers[0];
  layer.objects.push({ id: 'manual-wp4-stroke', type: 'stroke', name: 'Manual', matrix: Matrix.identity(), opacity: 1, color: '#222222', size: 2, kind: 'pen', points: [{ x: 0, y: 0, p: 1 }, { x: 12, y: 8, p: 1 }] });
  const left = recipe('Base Wash', IDs.left, 1201), front = recipe('Base Wash', IDs.front, 1202);
  assert.equal(app.flora.recipe.execute(left).ok, true);
  assert.equal(app.flora.recipe.execute(front).ok, true);
  const leftIds = new Set(app.flora.recipe.mapping(left.recipeId).strokeIds);
  const frontBefore = new Set(app.flora.recipe.mapping(front.recipeId).strokeIds);
  const result = app.flora.recipe.recompile(front.recipeId, { operation: 'Base Wash', patch: { seed: 1302, palette: ['#d99bae'] } });
  assert.equal(result.ok, true);
  assert.ok(layer.objects.some(object => object.id === 'manual-wp4-stroke'));
  assert.deepEqual(new Set(app.flora.recipe.mapping(left.recipeId).strokeIds), leftIds);
  const frontAfter = new Set(app.flora.recipe.mapping(front.recipeId).strokeIds);
  assert.notDeepEqual(frontAfter, frontBefore);
  assert.ok([...frontBefore].every(id => !app.flora.adapter.objectExists(id)));
});

test('three-petal topology is explicit and overlap shadow is constrained to the correct seam', () => {
  const app = createApp(), hero = app.page().floraHero;
  const frontTopology = hero.topology.find(item => item.regionId === IDs.front);
  assert.deepEqual(new Set(frontTopology.frontOf), new Set([IDs.left, IDs.right]));
  for (const rear of [IDs.left, IDs.right]) {
    const input = recipe('Overlap Shadow', rear, rear === IDs.left ? 1401 : 1402);
    const preview = app.flora.recipe.preview(input);
    assert.equal(preview.ok, true, JSON.stringify(preview.errors));
    const region = app.flora.adapter.region(rear), seam = region.overlaps[0].seam, band = input.constraints.bandWidth;
    const distanceToSegment = (point, a, b) => {
      const dx = b.x - a.x, dy = b.y - a.y, l2 = dx * dx + dy * dy || 1;
      const t = Math.max(0, Math.min(1, ((point.x - a.x) * dx + (point.y - a.y) * dy) / l2));
      return Math.hypot(point.x - (a.x + dx * t), point.y - (a.y + dy * t));
    };
    for (const stroke of preview.strokes) {
      const origin = stroke.floraPaint.normalizedOrigin;
      assert.ok(distanceToSegment(origin, seam[0], seam[1]) <= band + 1e-9);
    }
  }
  const bad = recipe('Overlap Shadow', IDs.front, 1403, { constraints: { frontRegionId: IDs.left, bandWidth: .04 } });
  assert.equal(app.flora.recipe.validate(bad).ok, false);
});

test('topology-order execution keeps front-center paint after rear petals and preserves visible occlusion order', () => {
  const app = createApp(), results = executeBasicTriplet(app);
  assert.ok(results.every(result => result.ok));
  const lateRear = app.flora.recipe.execute(recipe('Root Shadow', IDs.left, 1999, { recipeId: 'recipe-late-rear-shadow' }));
  assert.equal(lateRear.ok, true);
  const objects = app.page().layers[0].objects;
  const lastRear = Math.max(...objects.map((object, index) => [object, index]).filter(([object]) => [IDs.left, IDs.right].includes(object.floraPaint?.regionId)).map(([, index]) => index));
  const firstFront = Math.min(...objects.map((object, index) => [object, index]).filter(([object]) => object.floraPaint?.regionId === IDs.front).map(([, index]) => index));
  assert.ok(firstFront > lastRear);
});

test('invalid Recipes reject without Scene, History, Mask, Stroke, or Cache pollution', () => {
  const app = createApp(), base = recipe('Base Wash', IDs.front, 1501), before = app.flora.documentHash(), history = app.history.undoStack.length;
  const variants = [
    { ...base, targetRegionId: 'missing:region' }, { ...base, brushPreset: 'missing-brush' }, { ...base, direction: 'sideways' },
    { ...base, palette: [] }, { ...base, passes: 99 }, { ...base, density: Infinity }, { ...base, blendMode: 'difference' },
    { ...base, operation: 'Unknown Paint' }, { ...base, coverage: 2 }, { ...base, constraints: { frontRegionId: IDs.left } }
  ];
  for (const variant of variants) assert.equal(app.flora.recipe.execute(variant).ok, false);
  assert.equal(app.flora.documentHash(), before);
  assert.equal(app.history.undoStack.length, history);
  assert.equal(app.flora.maskCacheDiagnostics().entries, 0);
});

test('Recipe execution is one atomic transaction and mid-pass failure rolls back all document and mapping state', () => {
  const app = createApp(), input = recipe('Base Wash', IDs.front, 1601, { passes: 3 });
  const before = app.flora.documentHash(), replay = app.flora.replayHash(), undo = app.history.undoStack.length;
  const original = app.flora.adapter.execute.bind(app.flora.adapter); let paintCount = 0;
  app.flora.adapter.execute = (action, options) => {
    if (action.type === 'paintRegion' && ++paintCount === 2) throw new Error('injected pass failure');
    return original(action, options);
  };
  const result = app.flora.recipe.execute(input);
  app.flora.adapter.execute = original;
  assert.equal(result.ok, false);
  assert.equal(result.code, 'RECIPE_ROLLBACK');
  assert.equal(app.flora.documentHash(), before);
  assert.equal(app.flora.replayHash(), replay);
  assert.equal(app.history.undoStack.length, undo);
  assert.equal(app.page().floraRecipeState, undefined);
  assert.equal(app.flora.maskCacheDiagnostics().entries, 0);
});

test('Recipe transaction supports Undo/Redo and coexists with manual INK content', () => {
  const app = createApp(), layer = app.page().layers[0];
  layer.objects.push({ id: 'manual-coexist', type: 'stroke', name: 'Manual', matrix: Matrix.identity(), opacity: 1, color: '#000000', size: 3, kind: 'pen', points: [{ x: 1, y: 1, p: 1 }, { x: 7, y: 9, p: 1 }] });
  const before = app.flora.documentHash(), result = app.flora.recipe.execute(recipe('Fold Shadow', IDs.front, 1701));
  assert.equal(result.ok, true);
  const after = app.flora.documentHash();
  assert.notEqual(after, before);
  assert.equal(app.history.undoStack.at(-1).label.startsWith('FLORA Recipe'), true);
  assert.equal(app.history.undo(), true);
  assert.equal(app.flora.documentHash(), before);
  assert.ok(app.page().layers[0].objects.some(object => object.id === 'manual-coexist'));
  assert.equal(app.history.redo(), true);
  assert.equal(app.flora.documentHash(), after);
  assert.ok(app.page().layers[0].objects.some(object => object.id === 'manual-coexist'));
});
