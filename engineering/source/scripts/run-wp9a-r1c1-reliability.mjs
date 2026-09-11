import fs from 'node:fs';
import crypto from 'node:crypto';
import { createWP6App, addManualStroke, stableObjectHash } from '../tests/helpers/flora-wp6-fixture.mjs';
import { createFLR012HeroPaintingPlan } from '../src/flora/species/flr012-adonis.js';

const HERO_ID = 'flr012-adonis-candidate-a';
const serialized = fs.readFileSync(new URL('../FLR012_R1c1_NonPeriodic_Fill_PREVIEW_ONLY.ink', import.meta.url), 'utf8');
const app = createWP6App();
app.flora.reloadDocument(serialized);
const initial = { document: app.flora.documentHash(), replay: app.flora.replayHash(), hero: app.flora.completeHero.replayHash(HERO_ID) };
const mapping = app.flora.completeHero.mapping(HERO_ID);
const target = app.flora.adapter.hero().regions.find(region => region.kind === 'leaf-region').regionId;
const targetIds = new Set((mapping.regionRecipeIds[target] || []).flatMap(id => mapping.recipeToStrokeIds[id] || []));
const nonTargetIds = mapping.strokeIds.filter(id => !targetIds.has(id));
const nonTargetBefore = stableObjectHash(app, nonTargetIds);
const manual = addManualStroke(app, 'manual-r1c1-nonperiodic');
const local = app.flora.completeHero.recompileOperation(HERO_ID, 'Directional Brushwork', { regionId: target, patch: {} });
const nonTargetAfter = stableObjectHash(app, nonTargetIds);
const manualPreserved = app.flora.adapter.objectExists(manual);
const localComplete = { document: app.flora.documentHash(), replay: app.flora.replayHash(), hero: app.flora.completeHero.replayHash(HERO_ID) };
const undo = app.history.undo();
const undoState = { document: app.flora.documentHash(), replay: app.flora.replayHash(), hero: app.flora.completeHero.replayHash(HERO_ID) };
const redo = app.history.redo();
const redoState = { document: app.flora.documentHash(), replay: app.flora.replayHash(), hero: app.flora.completeHero.replayHash(HERO_ID) };
app.flora.reloadDocument(serialized);
const savedAgain = app.flora.serializeDocument();
const reload = createWP6App();
reload.flora.reloadDocument(savedAgain);
const roundtrip = { document: reload.flora.documentHash(), replay: reload.flora.replayHash(), hero: reload.flora.completeHero.replayHash(HERO_ID) };

const rollbackApp = createWP6App();
const rollbackBefore = { document: rollbackApp.flora.documentHash(), replay: rollbackApp.flora.replayHash(), history: rollbackApp.history.undoStack.length };
const original = rollbackApp.flora.adapter.execute.bind(rollbackApp.flora.adapter);
let count = 0;
rollbackApp.flora.adapter.execute = (action, options) => {
  if (action.type === 'paintRegion' && ++count === 17) throw new Error('WP9A-R1c.1 injected rollback');
  return original(action, options);
};
const failed = rollbackApp.flora.completeHero.execute(createFLR012HeroPaintingPlan(12012));
rollbackApp.flora.adapter.execute = original;
const rollbackAfter = { document: rollbackApp.flora.documentHash(), replay: rollbackApp.flora.replayHash(), history: rollbackApp.history.undoStack.length };
const output = {
  schema: 'INK_FLORA_WP9A_R1C1_RELIABILITY_V1',
  seed: 12012,
  previewOnly: true,
  formalPreviewCompileCount: 1,
  initial,
  localRecompile: {
    result: { ok: local.ok, atomic: local.atomic, heroId: local.heroId, recipeIds: local.recipeIds, createdStrokeCount: local.createdStrokeIds?.length || 0, removedStrokeCount: local.removedStrokeIds?.length || 0, historyEntriesAdded: local.historyEntriesAdded },
    target, nonTargetBefore, nonTargetAfter, nonTargetUnchanged: nonTargetBefore === nonTargetAfter, manualPreserved
  },
  undoRedo: { undo, undoState, redo, redoState, redoRestoresLocal: redoState.document === localComplete.document && redoState.replay === localComplete.replay && redoState.hero === localComplete.hero },
  roundtrip: { savedBytes: Buffer.byteLength(savedAgain), savedSha256: crypto.createHash('sha256').update(savedAgain).digest('hex'), hashes: roundtrip, matchesInitial: roundtrip.document === initial.document && roundtrip.replay === initial.replay && roundtrip.hero === initial.hero },
  rollback: { result: { ok: failed.ok, code: failed.code, message: failed.message, details: failed.details }, before: rollbackBefore, after: rollbackAfter, restored: rollbackBefore.document === rollbackAfter.document && rollbackBefore.replay === rollbackAfter.replay && rollbackBefore.history === rollbackAfter.history }
};
console.log(JSON.stringify(output, null, 2));
