import test from 'node:test';
import assert from 'node:assert/strict';
import { createWP6App, addManualStroke, stableObjectHash } from '../helpers/flora-wp6-fixture.mjs';
import { createFLR012HeroPaintingPlan } from '../../src/flora/species/flr012-adonis.js';

const HERO_ID = 'flr012-adonis-candidate-a';

test('R1c local recompile preserves non-target regions and manual stroke', () => {
  const app = createWP6App(), manual = addManualStroke(app, 'manual-r1c');
  assert.equal(app.flora.completeHero.execute(createFLR012HeroPaintingPlan(12012)).ok, true);
  const mapping = app.flora.completeHero.mapping(HERO_ID), petal = app.flora.adapter.hero().regions.find(region => region.kind === 'petal-region').regionId;
  const target = new Set((mapping.regionRecipeIds[petal] || []).flatMap(id => mapping.recipeToStrokeIds[id] || []));
  const nonTarget = mapping.strokeIds.filter(id => !target.has(id)), before = stableObjectHash(app, nonTarget);
  const local = app.flora.completeHero.recompilePetal(HERO_ID, petal, { operation: 'Directional Brushwork', patch: {} });
  assert.equal(local.ok, true, JSON.stringify(local));
  assert.equal(stableObjectHash(app, nonTarget), before);
  assert.ok(app.flora.adapter.objectExists(manual));
});

test('R1c rollback Undo Redo and ink roundtrip preserve retained paint', () => {
  const app = createWP6App();
  assert.equal(app.flora.completeHero.execute(createFLR012HeroPaintingPlan(12012)).ok, true);
  const doc = app.flora.documentHash(), replay = app.flora.replayHash(), hero = app.flora.completeHero.replayHash(HERO_ID);
  assert.equal(app.history.undo(), true); assert.equal(app.history.redo(), true);
  assert.equal(app.flora.documentHash(), doc); assert.equal(app.flora.replayHash(), replay);
  const serialized = app.flora.serializeDocument(), reload = createWP6App(); reload.flora.reloadDocument(serialized);
  assert.equal(reload.flora.replayHash(), replay); assert.equal(reload.flora.completeHero.replayHash(HERO_ID), hero);
  const rb = createWP6App(), before = { doc: rb.flora.documentHash(), replay: rb.flora.replayHash(), history: rb.history.undoStack.length };
  const original = rb.flora.adapter.execute.bind(rb.flora.adapter); let count = 0;
  rb.flora.adapter.execute = (action, options) => { if (action.type === 'paintRegion' && ++count === 17) throw new Error('R1c rollback'); return original(action, options); };
  const failed = rb.flora.completeHero.execute(createFLR012HeroPaintingPlan(12012)); rb.flora.adapter.execute = original;
  assert.equal(failed.ok, false); assert.equal(rb.flora.documentHash(), before.doc); assert.equal(rb.flora.replayHash(), before.replay); assert.equal(rb.history.undoStack.length, before.history);
});
