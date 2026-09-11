import test from 'node:test';
import assert from 'node:assert/strict';
import { createWP6App, createWP6Plan } from '../helpers/flora-wp6-fixture.mjs';

const HERO_ID='wp6-a4-hero';

test('WP8 increases crown, stem, and leaf visual mass without leaving A4 bounds', () => {
  const app=createWP6App();
  const result=app.flora.completeHero.compile(createWP6Plan(606));
  assert.equal(result.ok,true,JSON.stringify(result.errors||result.details));
  const petals=result.structure.regions.filter(r=>r.kind==='petal-region');
  assert.ok(Math.max(...petals.map(r=>r.petal.length))>=.34);
  assert.ok(Math.max(...petals.map(r=>r.petal.width))>=.22);
  const stem=result.structure.regions.find(r=>r.kind==='stem-region');
  assert.ok(stem.stem.widthRatio>=1/12);
  const leaves=result.structure.regions.filter(r=>r.kind==='leaf-region');
  assert.equal(leaves.length,2);
  for(const region of [...petals,stem,...leaves]) for(const point of region.path) {
    assert.ok(point.x>=0&&point.x<=1&&point.y>=0&&point.y<=1);
  }
});

test('WP8 painterly execution suppresses grain while retaining editable brush accents', () => {
  const app=createWP6App();
  const result=app.flora.completeHero.execute(createWP6Plan(606));
  assert.equal(result.ok,true,JSON.stringify(result.details));
  const mapping=app.flora.completeHero.mapping(HERO_ID);
  const objects=mapping.strokeIds.map(id=>app.flora.adapter.findObject(id)?.object).filter(Boolean);
  assert.ok(objects.length>250&&objects.length<700);
  assert.ok(objects.every(o=>(o.grain??0)<=.018));
  assert.ok(objects.some(o=>o.kind==='brush'));
  assert.ok(objects.some(o=>o.kind==='airbrush'));
  assert.ok(objects.some(o=>o.floraPaint?.index==='petal-underpaint'));
  assert.ok(objects.some(o=>o.floraPaint?.index==='petal-body-brush'));
});

test('WP8 remains deterministic and atomic', () => {
  const app=createWP6App();
  const ca=app.flora.completeHero.compile(createWP6Plan(606));
  const cb=app.flora.completeHero.compile(createWP6Plan(606));
  assert.equal(ca.ok,true); assert.equal(cb.ok,true); assert.equal(ca.compileHash,cb.compileHash);
  const result=app.flora.completeHero.execute(createWP6Plan(606));
  assert.equal(result.ok,true);
  const before=app.flora.documentHash(), replay=app.flora.completeHero.replayHash(HERO_ID);
  assert.equal(app.history.undo(),true); assert.equal(app.history.redo(),true);
  assert.equal(app.flora.documentHash(),before); assert.equal(app.flora.completeHero.replayHash(HERO_ID),replay);
});
