import { createHash } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { UniversalProgramImporter } from '../src/program-import/importer.js';
import { RecipeEngine, installProgramImportSchema } from '../src/recipe/recipe-engine.js';
import { createAnchor, createPath } from '../src/vector/vector-core.js';
import { deterministicBlankDocument } from '../src/headless/session-manager.js';
import { ExportRunner } from '../src/headless/export-runner.js';
import { PNGImage, decodePNG, encodePNG } from '../src/compare/png-codec.js';
import { sideBySidePNG } from '../src/compare/layout-renderer.js';

const outputRoot = path.resolve('Release_Evidence/Headless_PNG_Final');
await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });
const sha256 = value => createHash('sha256').update(value).digest('hex');
const source = await readFile(path.resolve('external-assets/benchmarks/fleurify/fleurify.js'), 'utf8');
const importer = new UniversalProgramImporter({ inkVersion: '1.6.1' });
const imported = importer.importAsset({
  name: 'fleurify.js',
  text: source,
  license: { spdx: 'LicenseRef-John-Wundes-JS4AI', url: 'http://www.wundes.com/js4ai/copyright.txt' },
  provenance: { sourceUrl: 'https://github.com/johnwun/js4ai/blob/master/fleurify.js', revision: 'master', retrievedAt: '2026-08-05' },
  safetyMode: 'TRANSLATE_ONLY',
  compile: true
});
const points = [[397,170],[510,215],[560,330],[510,445],[397,492],[284,445],[234,330],[284,215]];
function build() {
  const document = deterministicBlankDocument(16101);
  const target = createPath({ id: 'fleurify-outline-8', name: 'Eight Anchor Base', fill: '#db7892', stroke: '#653243', strokeWidth: 3, subpaths: [{ id: 'fleurify-outline-subpath', closed: true, role: 'outer', anchors: points.map(([x,y], i) => createAnchor(x, y, null, null, { id: `anchor-${i}`, mode: 'corner' })) }] });
  document.pages[0].layers[0].objects.push(target);
  return { document, target };
}
async function render(name, percentage) {
  const { document, target } = build();
  const engine = new RecipeEngine(); installProgramImportSchema(engine); engine.registerRecipe(imported.recipe);
  const before = target.subpaths[0].anchors.map(({ id, x, y }) => ({ id, x, y }));
  const execution = engine.execute(imported.recipe, { document, roles: { target: [target] }, parameters: { percentage } });
  const after = target.subpaths[0].anchors.map(({ id, x, y }) => ({ id, x, y }));
  const runner = new ExportRunner();
  const report = await runner.export(document, { output: outputRoot, formats: ['svg','png'], basename: name, width: 794, height: 794, background: 'white', deterministic: true });
  await runner.close();
  return { name, percentage, execution, export: report, anchorInvariant: JSON.stringify(before) === JSON.stringify(after), stableIds: after.map(item => item.id) };
}
function exactDifference(a, b) {
  if (a.width !== b.width || a.height !== b.height) throw new Error('DIMENSION_MISMATCH');
  const output = new PNGImage({ width: a.width, height: a.height });
  let changedPixels = 0;
  for (let i = 0; i < output.data.length; i += 4) {
    const dr = Math.abs(a.data[i] - b.data[i]);
    const dg = Math.abs(a.data[i+1] - b.data[i+1]);
    const db = Math.abs(a.data[i+2] - b.data[i+2]);
    const da = Math.abs(a.data[i+3] - b.data[i+3]);
    const changed = dr || dg || db || da;
    if (changed) changedPixels += 1;
    if (changed) { output.data[i] = dr; output.data[i+1] = dg; output.data[i+2] = db; output.data[i+3] = 255; }
  }
  return { output, changedPixels, totalPixels: a.width * a.height };
}
function metrics(image) {
  let nonTransparentPixels=0, transparentPixels=0, partialAlphaPixels=0, nonWhitePixels=0;
  for (let i=0;i<image.data.length;i+=4) {
    const a=image.data[i+3]; if (a===0) transparentPixels++; else nonTransparentPixels++; if (a>0&&a<255) partialAlphaPixels++;
    if (a>0 && (image.data[i]!==255||image.data[i+1]!==255||image.data[i+2]!==255)) nonWhitePixels++;
  }
  return { width:image.width,height:image.height,colorFormat:'RGBA8',alpha:true,nonTransparentPixels,transparentPixels,partialAlphaPixels,nonWhitePixels };
}

const started = Date.now();
const r100 = await render('fleurify-100', 100);
const r70 = await render('fleurify-70', 70);
const boundary = await render('fleurify-boundary', 0);
const rerun = await render('fleurify-100-rerun', 100);
const p100 = decodePNG(await readFile(path.join(outputRoot,'fleurify-100.png')));
const p70 = decodePNG(await readFile(path.join(outputRoot,'fleurify-70.png')));
const pBoundary = decodePNG(await readFile(path.join(outputRoot,'fleurify-boundary.png')));
const pRerun = decodePNG(await readFile(path.join(outputRoot,'fleurify-100-rerun.png')));
const diff10070 = exactDifference(p100,p70), diff100Rerun = exactDifference(p100,pRerun);
await writeFile(path.join(outputRoot,'fleurify-100-70-side-by-side.png'), encodePNG(sideBySidePNG(p100,p70)));
await writeFile(path.join(outputRoot,'fleurify-100-70-difference.png'), encodePNG(diff10070.output));
await writeFile(path.join(outputRoot,'fleurify-100-rerun-difference.png'), encodePNG(diff100Rerun.output));
const files = {};
for (const name of ['fleurify-100.png','fleurify-70.png','fleurify-boundary.png','fleurify-100-rerun.png','fleurify-100.svg','fleurify-70.svg','fleurify-boundary.svg','fleurify-100-rerun.svg','fleurify-100-70-side-by-side.png','fleurify-100-70-difference.png','fleurify-100-rerun-difference.png']) {
  const bytes=await readFile(path.join(outputRoot,name));files[name]={bytes:bytes.length,sha256:sha256(bytes)};
}
for (const [name,image] of [['fleurify-100.png',p100],['fleurify-70.png',p70],['fleurify-boundary.png',pBoundary],['fleurify-100-rerun.png',pRerun]]) files[name].metrics=metrics(image);
const pngHashEqual = files['fleurify-100.png'].sha256 === files['fleurify-100-rerun.png'].sha256;
const svgHashEqual = files['fleurify-100.svg'].sha256 === files['fleurify-100-rerun.svg'].sha256;
const report = {
  format:'INK-V1.6.1-HEADLESS-PNG-FINAL',version:'1.0',status: pngHashEqual && svgHashEqual && diff100Rerun.changedPixels===0 && diff10070.changedPixels>0 ? 'PASS':'FAIL',
  renderer:r100.export.files.png.backend,rendererVersion:r100.export.files.png.rendererVersion,durationMs:Date.now()-started,
  import:{host:imported.detection.format,security:imported.security.status,compile:imported.conversionReport.compileStatus},
  cases:{
    '100':{status:'PASS',anchorInvariant:r100.anchorInvariant,stableIds:r100.stableIds,export:r100.export.files},
    '70':{status:'PASS',anchorInvariant:r70.anchorInvariant,stableIds:r70.stableIds,export:r70.export.files},
    boundary:{status:'PASS',percentage:0,anchorInvariant:boundary.anchorInvariant,stableIds:boundary.stableIds,export:boundary.export.files},
    rerun:{status:'PASS',anchorInvariant:rerun.anchorInvariant,stableIds:rerun.stableIds,export:rerun.export.files}
  },
  deterministic:{pngHashEqual,svgHashEqual,pixelChangedCount:diff100Rerun.changedPixels,status:pngHashEqual&&svgHashEqual&&diff100Rerun.changedPixels===0?'PASS':'FAIL'},
  difference:{hundredVsSeventy:{changedPixels:diff10070.changedPixels,totalPixels:diff10070.totalPixels,status:diff10070.changedPixels>0?'PASS':'FAIL'},hundredVsRerun:{changedPixels:diff100Rerun.changedPixels,totalPixels:diff100Rerun.totalPixels,status:diff100Rerun.changedPixels===0?'PASS':'FAIL'}},
  files
};
await writeFile(path.join(outputRoot,'headless-png-final-report.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if(report.status!=='PASS') process.exitCode=1;
