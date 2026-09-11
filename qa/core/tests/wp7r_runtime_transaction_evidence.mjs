import fs from 'node:fs';
import path from 'node:path';
import { createWP6App, createWP6Plan, addManualStroke, stableObjectHash } from './helpers/flora-wp6-fixture.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'Runtime_Evidence', 'WP7R');
fs.mkdirSync(OUT, { recursive: true });
const heroId = 'wp7r-recovered-hero';
const planId = 'wp7r-recovered-plan';
const makePlan = (seed = 606) => {
  const plan = createWP6Plan(seed, { heroId, planId, petalCount: 10 });
  plan.metadata = { source: 'ai', label: 'WP7R Recovered A4 Hero Flower Benchmark C3' };
  plan.crownPlan.metadata = { source: 'ai', label: 'WP7R Recovered Single Crown' };
  plan.stemPlan.metadata = { source: 'ai', label: 'WP7R Recovered Stem' };
  plan.leafPlans[0].metadata = { source: 'ai', label: 'WP7R Recovered Left Leaf', side: 'left' };
  plan.leafPlans[1].metadata = { source: 'ai', label: 'WP7R Recovered Right Leaf', side: 'right' };
  plan.backgroundPlan.metadata = { source: 'ai', label: 'WP7R Recovered Quiet Background' };
  return plan;
};
const stable = value => JSON.stringify(value, (key, item) => item && typeof item === 'object' && !Array.isArray(item)
  ? Object.keys(item).sort().reduce((out, name) => (out[name] = item[name], out), {}) : item);

const app = createWP6App();
const manualId = addManualStroke(app, 'manual-wp7-runtime');
const plan = makePlan();
const compiled = app.flora.completeHero.compile(plan);
if (!compiled.ok) throw new Error(JSON.stringify(compiled.errors));
const compiledAgain = app.flora.completeHero.compile(makePlan());
const compiledDifferentSeed = app.flora.completeHero.compile(makePlan(607));
const result = app.flora.completeHero.execute(plan);
if (!result.ok) throw new Error(JSON.stringify(result));
const mapping = app.flora.completeHero.mapping(heroId);
const heroReplayBeforeLocal = app.flora.completeHero.replayHash(heroId);
const manualBefore = stable(app.flora.adapter.findObject(manualId)?.object);
const documentBeforeLocal = app.flora.serializeDocument();
const firstPetalId = app.flora.adapter.hero().regions.find(region => region.kind === 'petal-region').regionId;
const targetRecipeIds = mapping.regionRecipeIds[firstPetalId] || [];
const targetIds = new Set(targetRecipeIds.flatMap(id => mapping.recipeToStrokeIds[id] || []));
const nonTargetIds = mapping.strokeIds.filter(id => !targetIds.has(id));
const localBefore = { targetRegionId: firstPetalId, targetHash: stableObjectHash(app, [...targetIds]), nonTargetHash: stableObjectHash(app, nonTargetIds), nonTargetCount: nonTargetIds.length };
const local = app.flora.completeHero.recompilePetal(heroId, firstPetalId, {
  operation: 'Central Light',
  patch: { palette: ['#f4c6d2', '#e9a4b8'], opacity: [.035, .105], edgeSoftness: .010 }
});
if (!local.ok) throw new Error(JSON.stringify(local));
const mappingAfterLocal = app.flora.completeHero.mapping(heroId);
const targetRecipeIdsAfter = mappingAfterLocal.regionRecipeIds[firstPetalId] || [];
const targetIdsAfter = new Set(targetRecipeIdsAfter.flatMap(id => mappingAfterLocal.recipeToStrokeIds[id] || []));
const nonTargetIdsAfter = mappingAfterLocal.strokeIds.filter(id => !targetIdsAfter.has(id));
const localAfter = { targetHash: stableObjectHash(app, [...targetIdsAfter]), nonTargetHash: stableObjectHash(app, nonTargetIdsAfter), nonTargetCount: nonTargetIdsAfter.length };
const manualAfter = stable(app.flora.adapter.findObject(manualId)?.object);
const serialized = app.flora.serializeDocument();
fs.writeFileSync(path.join(OUT, 'WP7R_Before_Local_Edit.ink.json'), documentBeforeLocal);
fs.writeFileSync(path.join(OUT, 'WP7R_After_Local_Edit.ink.json'), serialized);
const beforeRoundtrip = { documentHash: app.flora.documentHash(), replayHash: app.flora.replayHash(), heroReplayHash: app.flora.completeHero.replayHash(heroId), strokeCount: mappingAfterLocal.strokeIds.length };
const reloaded = createWP6App();
reloaded.flora.reloadDocument(serialized);
const roundtrip = {
  before: beforeRoundtrip,
  after: { documentHash: reloaded.flora.documentHash(), replayHash: reloaded.flora.replayHash(), heroReplayHash: reloaded.flora.completeHero.replayHash(heroId), strokeCount: reloaded.flora.completeHero.mapping(heroId)?.strokeIds.length },
  replayUnchanged: reloaded.flora.replayHash() === beforeRoundtrip.replayHash,
  heroReplayUnchanged: reloaded.flora.completeHero.replayHash(heroId) === beforeRoundtrip.heroReplayHash
};

const undoApp = createWP6App();
addManualStroke(undoApp, 'manual-wp7-undo');
const undoResult = undoApp.flora.completeHero.execute(makePlan());
const completeHash = undoApp.flora.documentHash(), completeReplay = undoApp.flora.replayHash(), completeHeroReplay = undoApp.flora.completeHero.replayHash(heroId);
const undo = { ok: undoApp.history.undo(), heroRemoved: undoApp.flora.completeHero.lookup(heroId) === null, manualPreserved: undoApp.flora.adapter.objectExists('manual-wp7-undo') };
const redo = { ok: undoApp.history.redo(), documentRestored: undoApp.flora.documentHash() === completeHash, replayRestored: undoApp.flora.replayHash() === completeReplay, heroReplayRestored: undoApp.flora.completeHero.replayHash(heroId) === completeHeroReplay, manualPreserved: undoApp.flora.adapter.objectExists('manual-wp7-undo') };

const rollbackApp = createWP6App();
const rollbackBefore = { documentHash: rollbackApp.flora.documentHash(), replayHash: rollbackApp.flora.replayHash(), history: rollbackApp.history.undoStack.length, cache: rollbackApp.flora.maskCacheDiagnostics(), mapping: stable([...rollbackApp.flora.adapter.actionObjectMap]) };
const original = rollbackApp.flora.adapter.execute.bind(rollbackApp.flora.adapter);
let paints = 0;
rollbackApp.flora.adapter.execute = (action, options) => {
  if (action.type === 'paintRegion' && ++paints === 23) throw new Error('WP7R runtime injected pass failure');
  return original(action, options);
};
const rollbackResult = rollbackApp.flora.completeHero.execute(makePlan());
rollbackApp.flora.adapter.execute = original;
const rollbackAfter = { documentHash: rollbackApp.flora.documentHash(), replayHash: rollbackApp.flora.replayHash(), history: rollbackApp.history.undoStack.length, cache: rollbackApp.flora.maskCacheDiagnostics(), mapping: stable([...rollbackApp.flora.adapter.actionObjectMap]) };
const rollback = {
  result: rollbackResult,
  before: rollbackBefore,
  after: rollbackAfter,
  documentRestored: rollbackBefore.documentHash === rollbackAfter.documentHash,
  replayRestored: rollbackBefore.replayHash === rollbackAfter.replayHash,
  historyUnchanged: rollbackBefore.history === rollbackAfter.history,
  cacheRestored: stable(rollbackBefore.cache) === stable(rollbackAfter.cache),
  mappingRestored: rollbackBefore.mapping === rollbackAfter.mapping
};

const deterministic = {
  sameSeed: { source: 'serialized .ink reload', firstHeroReplay: beforeRoundtrip.heroReplayHash, secondHeroReplay: roundtrip.after.heroReplayHash, equal: roundtrip.heroReplayUnchanged },
  compileSame: compiled.compileHash === compiledAgain.compileHash,
  compileDifferentSeed: compiled.compileHash !== compiledDifferentSeed.compileHash
};

const oldLikeRecipe = structuredClone(compiled.recipes.find(recipe => recipe.metadata.component === 'crown' && recipe.operation === 'Base Wash'));
const refinedRecipe = structuredClone(oldLikeRecipe);
oldLikeRecipe.schemaVersion = '0.1';
delete oldLikeRecipe.refinement;
oldLikeRecipe.metadata.label = 'WP6-compatible Recipe without WP7R refinement controls';
const recipeDiff = { legacyCompatible: oldLikeRecipe, wp7rRecovered: refinedRecipe, addedParameters: Object.keys(refinedRecipe.refinement || {}) };
fs.writeFileSync(path.join(OUT, 'WP7R_Recipe_Diff.json'), JSON.stringify(recipeDiff, null, 2) + '\n');
fs.writeFileSync(path.join(OUT, 'A4_Hero_Recovered_Plan.json'), JSON.stringify(plan, null, 2) + '\n');
fs.writeFileSync(path.join(OUT, 'A4_Hero_Recovered_Compiled_Action_Log.json'), JSON.stringify({ recipes: compiled.recipes, preview: compiled.preview, checks: compiled.checks }, null, 2) + '\n');
const evidence = {
  schema: 'INK_FLORA_WP7R_TRANSACTION_EVIDENCE_V1', imageModelUsed: false, speciesUsed: false,
  planHash: compiled.planHash, structureHash: compiled.structureHash, compileHash: compiled.compileHash,
  compileChecks: compiled.checks, execute: result,
  local: { before: localBefore, result: local, after: localAfter, nonTargetUnchanged: localBefore.nonTargetHash === localAfter.nonTargetHash, manualPreserved: manualBefore === manualAfter },
  roundtrip, undo, redo, rollback, deterministic,
  final: { documentHash: app.flora.documentHash(), replayHash: app.flora.replayHash(), heroReplayHash: app.flora.completeHero.replayHash(heroId), mapping: mappingAfterLocal, cache: app.flora.maskCacheDiagnostics() }
};
fs.writeFileSync(path.join(OUT, 'node-transaction-evidence.json'), JSON.stringify(evidence, null, 2) + '\n');
console.log(JSON.stringify({ ok: true, strokes: result.strokeCount, recipes: result.recipeCount, localNonTargetUnchanged: evidence.local.nonTargetUnchanged, manualPreserved: evidence.local.manualPreserved, rollback, roundtrip, deterministic }, null, 2));
