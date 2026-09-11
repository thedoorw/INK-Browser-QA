import test from 'node:test';
import assert from 'node:assert/strict';
import { createWP6App } from '../helpers/flora-wp6-fixture.mjs';
import { createFLR012HeroPaintingPlan } from '../../src/flora/species/flr012-adonis.js';

const create = seed => {
  const app = createWP6App();
  const result = app.flora.completeHero.execute(createFLR012HeroPaintingPlan(seed));
  assert.equal(result.ok, true, JSON.stringify(result));
  const page = app.page();
  const objects = page.layers.flatMap(layer => layer.objects || []).filter(object => object.floraPaint);
  return { app, page, objects, structure: page.floraHero };
};
const cached = create(12012);
const executed = () => cached;
const formalBase = () => executed().objects.filter(object => object.floraPaint.operation === 'Base Wash' && object.floraPaint.baseMassStrategy === 'non-periodic-full-body');
const regionObjects = regionId => formalBase().filter(object => object.floraPaint.regionId === regionId);
const normalizedWorldPoints = object => object.points.map(point => ({ x: object.matrix[4] + point.x, y: object.matrix[5] + point.y }));
const segmentLengths = points => points.slice(1).map((point, index) => Math.hypot(point.x - points[index].x, point.y - points[index].y));
const cv = values => {
  const mean = values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / Math.max(1, values.length);
  return mean ? Math.sqrt(variance) / mean : 0;
};


test('R1c.1 formal Base Mass no longer uses fixed cross-section-fill', () => {
  const recipes = Object.values(executed().page.floraRecipeState.recipes).map(item => item.recipe).filter(recipe => recipe.operation === 'Base Wash' && recipe.metadata.component !== 'background');
  assert.ok(recipes.length >= 20);
  assert.ok(recipes.every(recipe => recipe.constraints.coverageRetention.mode === 'non-periodic-full-body'));
  assert.equal(executed().objects.filter(object => String(object.floraPaint.index).includes('retention-cross-fill')).length, 0);
  assert.equal(executed().objects.filter(object => String(object.floraPaint.index).includes('retention-center-fill')).length, 0);
});

test('R1c.1 continuous body field exists exactly once per subject region', () => {
  const subject = executed().structure.regions.filter(region => region.kind !== 'background-region');
  for (const region of subject) {
    const body = regionObjects(region.regionId).filter(object => object.floraPaint.baseMassLayer === 'continuous-body');
    assert.equal(body.length, 1, region.regionId);
  }
});

test('R1c.1 low-frequency density fields are bounded and non-tiled', () => {
  for (const region of executed().structure.regions.filter(region => region.kind !== 'background-region')) {
    const fields = regionObjects(region.regionId).filter(object => object.floraPaint.baseMassLayer === 'low-frequency-density');
    assert.equal(fields.length, 2, region.regionId);
    assert.notDeepEqual(fields[0].points.map(point => [point.x, point.y]), fields[1].points.map(point => [point.x, point.y]));
  }
});

test('R1c.1 sparse directional variation remains a secondary layer', () => {
  for (const region of executed().structure.regions.filter(region => region.kind !== 'background-region')) {
    const items = regionObjects(region.regionId), body = items.find(object => object.floraPaint.baseMassLayer === 'continuous-body');
    const sparse = items.find(object => object.floraPaint.baseMassLayer === 'sparse-directional-deposit');
    assert.ok(body && sparse, region.regionId);
    assert.ok(sparse.opacity < body.opacity * .45, `${region.regionId}:${sparse.opacity}/${body.opacity}`);
    assert.ok(sparse.size < body.size * .55, `${region.regionId}:${sparse.size}/${body.size}`);
  }
});

test('R1c.1 Base Mass paths have no fixed section-spacing ladder', () => {
  for (const object of formalBase()) {
    const lengths = segmentLengths(normalizedWorldPoints(object));
    assert.ok(lengths.length >= 2, object.id);
    const unique = new Set(lengths.map(value => value.toFixed(3)));
    assert.ok(unique.size >= Math.min(4, lengths.length), `${object.id}:${unique.size}`);
  }
});

test('R1c.1 no repeated endpoint clustering exists across formal Base Mass', () => {
  for (const region of executed().structure.regions.filter(region => region.kind !== 'background-region')) {
    const endpoints = regionObjects(region.regionId).flatMap(object => {
      const points = normalizedWorldPoints(object); return [points[0], points.at(-1)];
    });
    const unique = new Set(endpoints.map(point => `${point.x.toFixed(2)}:${point.y.toFixed(2)}`));
    assert.ok(unique.size >= Math.ceil(endpoints.length * .70), `${region.regionId}:${unique.size}/${endpoints.length}`);
  }
});

test('R1c.1 body fields follow growth direction rather than transverse sections', () => {
  for (const region of executed().structure.regions.filter(region => ['petal-region','leaf-region','stem-region'].includes(region.kind))) {
    const body = regionObjects(region.regionId).find(object => object.floraPaint.baseMassLayer === 'continuous-body');
    const points = normalizedWorldPoints(body), first = points[0], last = points.at(-1);
    const axis = region.growthAxis;
    const a = { x: axis.tip.x-axis.base.x, y: axis.tip.y-axis.base.y }, b = { x:last.x-first.x, y:last.y-first.y };
    const cosine = Math.abs((a.x*b.x+a.y*b.y)/(Math.hypot(a.x,a.y)*Math.hypot(b.x,b.y)));
    assert.ok(cosine > .88, `${region.regionId}:${cosine}`);
  }
});

test('R1c.1 petal body fill uses full-body width', () => {
  for (const region of executed().structure.regions.filter(region => region.kind === 'petal-region')) {
    const body = regionObjects(region.regionId).find(object => object.floraPaint.baseMassLayer === 'continuous-body');
    assert.ok(body.size >= 28, `${region.regionId}:${body.size}`);
  }
});

test('R1c.1 leaf body fill is wider than its sparse deposit', () => {
  for (const region of executed().structure.regions.filter(region => region.kind === 'leaf-region')) {
    const items = regionObjects(region.regionId), body = items.find(object => object.floraPaint.baseMassLayer === 'continuous-body'), sparse = items.find(object => object.floraPaint.baseMassLayer === 'sparse-directional-deposit');
    assert.ok(body.size >= sparse.size * 2.4, region.regionId);
  }
});

test('R1c.1 stem uses continuous longitudinal body without repeated nodes', () => {
  const stem = executed().structure.regions.find(region => region.kind === 'stem-region');
  const items = regionObjects(stem.regionId);
  assert.equal(items.filter(object => object.floraPaint.baseMassLayer === 'continuous-body').length, 1);
  assert.equal(items.filter(object => String(object.floraPaint.index).includes('cross')).length, 0);
});

test('R1c.1 center mass uses irregular multi-angle sweeps, not a grid or ring', () => {
  const center = executed().structure.regions.find(region => region.kind === 'flower-center-region');
  const items = regionObjects(center.regionId);
  assert.equal(items.length, 4);
  const angles = items.map(object => { const p=normalizedWorldPoints(object); return Math.atan2(p.at(-1).y-p[0].y,p.at(-1).x-p[0].x); });
  const rounded = new Set(angles.map(angle => (angle/0.15|0)));
  assert.ok(rounded.size >= 3, JSON.stringify(angles));
});

test('R1c.1 low-frequency body paths vary continuously', () => {
  for (const object of formalBase().filter(object => object.floraPaint.baseMassLayer !== 'continuous-body')) {
    const points=normalizedWorldPoints(object), lengths=segmentLengths(points);
    assert.ok(cv(lengths) > .015, `${object.id}:${cv(lengths)}`);
  }
});

test('R1c.1 no dropout is applied to formal Base Mass', () => {
  assert.ok(formalBase().filter(object => object.floraPaint.baseMassLayer !== 'sparse-directional-deposit').every(object => object.floraPaint.frequencyLayer === 'low'));
  assert.ok(formalBase().filter(object => object.floraPaint.baseMassLayer === 'sparse-directional-deposit').every(object => object.floraPaint.frequencyLayer === 'mid'));
  assert.ok(formalBase().every(object => object.floraPaint.constraints.coverageRetention.mode === 'non-periodic-full-body'));
});

test('R1c.1 same-seed compiler output is deterministic', () => {
  const app=createWP6App();
  const a=app.flora.completeHero.compile(createFLR012HeroPaintingPlan(12012));
  const b=app.flora.completeHero.compile(createFLR012HeroPaintingPlan(12012));
  assert.equal(a.ok,true); assert.equal(b.ok,true); assert.equal(a.compileHash,b.compileHash);
});

test('R1c.1 different seed produces bounded compiler variation', () => {
  const app=createWP6App();
  const a=app.flora.completeHero.compile(createFLR012HeroPaintingPlan(12012));
  const b=app.flora.completeHero.compile(createFLR012HeroPaintingPlan(12013));
  assert.equal(a.ok,true); assert.equal(b.ok,true); assert.notEqual(a.compileHash,b.compileHash);
  assert.ok(Math.abs(a.recipes.length-b.recipes.length) <= 2, `${a.recipes.length}/${b.recipes.length}`);
});

test('R1c.1 locked geometry counts remain unchanged', () => {
  const regions=executed().structure.regions;
  assert.equal(regions.filter(r=>r.kind==='petal-region').length,14);
  assert.equal(regions.filter(r=>r.kind==='leaf-region').length,4);
  assert.equal(regions.filter(r=>r.kind==='flower-center-region').length,1);
  assert.equal(regions.filter(r=>r.kind==='stem-region').length,1);
});

test('R1c.1 compiler version identifies new formal body strategy', () => {
  assert.ok(formalBase().every(object=>object.floraPaint.compilerVersion==='0.7-nonperiodic-fill'));
});

test('R1c.1 cross-section-fill remains legacy-only and unused in formal output', () => {
  assert.equal(executed().objects.filter(object=>object.floraPaint.baseMassStrategy==='cross-section-fill').length,0);
  assert.equal(executed().objects.filter(object=>String(object.floraPaint.index).includes('retention-cross-fill')).length,0);
});
