import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { addManualStroke, createWP6App, createWP6Plan } from './helpers/flora-wp6-fixture.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const app=createWP6App(), manualId=addManualStroke(app,'manual-wp6-transaction-evidence');
const plan=createWP6Plan(1606,{heroId:'wp6-transaction-hero',planId:'wp6-transaction-plan',petalCount:10});
const blankHash=app.flora.documentHash(), blankReplay=app.flora.replayHash();
const execute=app.flora.completeHero.execute(plan);
const completeHash=app.flora.documentHash(), completeReplay=app.flora.replayHash();
const mapping=app.flora.completeHero.mapping(plan.heroId);
const undoOk=app.history.undo(), undoHash=app.flora.documentHash(), undoReplay=app.flora.replayHash(), manualAfterUndo=app.flora.adapter.objectExists(manualId);
const redoOk=app.history.redo(), redoHash=app.flora.documentHash(), redoReplay=app.flora.replayHash(), manualAfterRedo=app.flora.adapter.objectExists(manualId);
const beforeRoundtrip={documentHash:app.flora.documentHash(),replayHash:app.flora.replayHash(),heroReplayHash:app.flora.completeHero.replayHash(plan.heroId),mappingHash:JSON.stringify(app.flora.completeHero.mapping(plan.heroId)).length};
const json=app.flora.serializeDocument(), inkBytes=Buffer.byteLength(json); app.flora.reloadDocument(json);
const afterRoundtrip={documentHash:app.flora.documentHash(),replayHash:app.flora.replayHash(),heroReplayHash:app.flora.completeHero.replayHash(plan.heroId),mappingHash:JSON.stringify(app.flora.completeHero.mapping(plan.heroId)).length};
const evidence={
 schema:'INK_FLORA_WP6_NODE_TRANSACTION_EVIDENCE_V1',planId:plan.planId,heroId:plan.heroId,
 execute:{ok:execute.ok,atomic:execute.atomic,historyEntriesAdded:execute.historyEntriesAdded,recipeCount:execute.recipeCount,actionCount:execute.actionCount,strokeCount:execute.strokeCount,checksPassed:execute.checks?.passed},
 undo:{ok:undoOk,blankHash,undoHash,blankReplay,undoReplay,restored:undoHash===blankHash&&undoReplay===blankReplay,manualPreserved:manualAfterUndo},
 redo:{ok:redoOk,completeHash,redoHash,completeReplay,redoReplay,restored:redoHash===completeHash&&redoReplay===completeReplay,manualPreserved:manualAfterRedo},
 roundtrip:{inkBytes,before:beforeRoundtrip,after:afterRoundtrip,documentMatch:beforeRoundtrip.documentHash===afterRoundtrip.documentHash,replayMatch:beforeRoundtrip.replayHash===afterRoundtrip.replayHash,heroReplayMatch:beforeRoundtrip.heroReplayHash===afterRoundtrip.heroReplayHash,mappingMatch:beforeRoundtrip.mappingHash===afterRoundtrip.mappingHash},
 mapping:{recipeCount:mapping.recipeIds.length,actionCount:mapping.actionIds.length,strokeCount:mapping.strokeIds.length}
};
const out=path.join(root,'Runtime_Evidence','WP6','node-transaction-evidence.json');fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify(evidence,null,2));
