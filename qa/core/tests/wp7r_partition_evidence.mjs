import fs from 'node:fs';
import path from 'node:path';
import { createWP6App, createWP6Plan, addManualStroke } from './helpers/flora-wp6-fixture.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'Runtime_Evidence', 'WP7R');
fs.mkdirSync(OUT, { recursive: true });
const heroId = 'wp7r-partition-hero', planId = 'wp7r-partition-plan';
const plan = createWP6Plan(606, { heroId, planId, petalCount: 10 });
const app = createWP6App();
const manualId = addManualStroke(app, 'manual-wp7r-partition');
const base = app.flora.completeHero.execute(plan);
if (!base.ok) throw new Error(JSON.stringify(base));
const regions = app.flora.adapter.hero().regions;
const petals = regions.filter(region => region.kind === 'petal-region');
const run = [];
const record = (name, result, params) => {
  if (!result.ok) throw new Error(`${name}: ${JSON.stringify(result)}`);
  run.push({
    partition: name,
    params,
    result: {
      ok: result.ok, atomic: result.atomic, selector: result.selector,
      targetRecipeIds: result.recipeIds, removedStrokeCount: result.removedStrokeIds?.length || 0,
      createdStrokeCount: result.createdStrokeIds?.length || 0,
      nonTargetHashBefore: result.nonTargetHashBefore,
      nonTargetHashAfter: result.nonTargetHashAfter,
      nonTargetUnchanged: result.nonTargetUnchanged,
      historyEntriesAdded: result.historyEntriesAdded
    },
    manualPreserved: app.flora.adapter.objectExists(manualId)
  });
};
record('single-petal', app.flora.completeHero.recompilePetal(heroId, petals[0].regionId, { operation:'Transparent Glaze', patch:{ seed:717, palette:['#c97994','#e4abb9'], opacity:[.028,.074], edgeSoftness:.011 } }), { operation:'Transparent Glaze', seed:717, edgeSoftness:.011 });
record('three-adjacent-petals', app.flora.completeHero._localRecompile(heroId, { regionIds: petals.slice(0,3).map(region=>region.regionId), operation:'Directional Brushwork' }, { seed:718, density:12, opacity:[.018,.055] }), { operation:'Directional Brushwork', seed:718, regionCount:3 });
record('complete-crown', app.flora.completeHero.recompileCrown(heroId, { operation:'Transparent Glaze', patch:{ seed:719, opacity:[.022,.062] } }), { operation:'Transparent Glaze', seed:719 });
record('flower-center', app.flora.completeHero.recompileCenter(heroId, { operation:'Directional Brushwork', patch:{ seed:720, opacity:[.020,.060], palette:['#8e3f59','#c97b7c','#e1b165'] } }), { operation:'Directional Brushwork', seed:720 });
record('stem', app.flora.completeHero.recompileStem(heroId, { operation:'Central Light', patch:{ seed:721, opacity:[.020,.067], palette:['#597e64','#8cab82'] } }), { operation:'Central Light', seed:721 });
record('left-leaf', app.flora.completeHero.recompileLeaf(heroId, 'left', { operation:'Transparent Glaze', patch:{ seed:722, opacity:[.018,.058], palette:['#456a50','#769276'] } }), { operation:'Transparent Glaze', seed:722 });
record('right-leaf', app.flora.completeHero.recompileLeaf(heroId, 'right', { operation:'Central Light', patch:{ seed:723, opacity:[.018,.060], palette:['#66896c','#93aa87'] } }), { operation:'Central Light', seed:723 });
record('background', app.flora.completeHero.recompileBackground(heroId, { operation:'Transparent Glaze', patch:{ seed:724, opacity:[.004,.014], palette:['#eee5e1','#e5d7d4','#f4ece8'] } }), { operation:'Transparent Glaze', seed:724 });
const evidence = {
  schema:'INK_FLORA_WP7R_PARTITION_EVIDENCE_V1',
  imageModelUsed:false, benchmarkTraced:false, specificSpeciesUsed:false,
  base:{ recipeCount:base.recipeCount, strokeCount:base.strokeCount, historyEntriesAdded:base.historyEntriesAdded },
  partitions:run,
  allNonTargetsUnchanged:run.every(item=>item.result.nonTargetUnchanged),
  manualPreserved:run.every(item=>item.manualPreserved),
  final:{ documentHash:app.flora.documentHash(), replayHash:app.flora.replayHash(), heroReplayHash:app.flora.completeHero.replayHash(heroId) }
};
fs.writeFileSync(path.join(OUT,'partition-local-recompile-evidence.json'), JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify({ok:true,partitions:run.length,allNonTargetsUnchanged:evidence.allNonTargetsUnchanged,manualPreserved:evidence.manualPreserved},null,2));
