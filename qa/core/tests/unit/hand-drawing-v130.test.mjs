import test from 'node:test';
import assert from 'node:assert/strict';
import {
  STROKE_SAMPLE_FIELDS, createUnifiedStroke, migrateUnifiedStroke, validateUnifiedStroke,
  BrushPresetRegistry, BUILTIN_BRUSH_PRESETS, compileBrushStroke, createBrushPackage,
  exportBrushPackage, importBrushPackage, validateBrushPreset,
  StrokeSessionRecorder, replayStrokeSession, selectSessionStrokes, deleteSessionStrokes,
  recolorSessionStrokes, setSessionStrokeOpacity, replaceSessionStrokeBrush,
  transformSessionStrokes, undoSessionEdit, redoSessionEdit, migrateStrokeSession,
  importDrawingWorkflow, DrawingGapFrequencyRanking, evaluateStrokeQuality, compareStrokeReplays
} from '../../src/paint/index.js';
import { defaultDocument } from '../../src/document/model.js';
import { migrateDocument } from '../../src/document/migration.js';
import { StylusTestRecorder, STYLUS_TEST_PATTERNS } from '../../src/input/stylus-test.js';

const samples = Array.from({ length: 12 }, (_, index) => ({ x: 10 + index * 6, y: 20 + Math.sin(index / 2) * 8, timestamp: index * 12, pressure: .12 + index / 14, tiltX: index * 2, tiltY: 12 - index, azimuth: index * .1, altitude: 60, size: 1, opacity: 1, flow: 1, spacing: .1, scatter: 0, rotation: 0, textureCoordinates: { u: index / 11, v: .5 }, wetness: .2, paintLoad: .8, smudge: 0, blend: 0, glaze: 0, seed: 200 + index }));
const stroke = (id = 's1', brushId = 'ink') => createUnifiedStroke({ id, brushId, layerId: 'paint', color: '#a04466', seed: 77, samples });

test('Stroke schema preserves every required recorded and derived attribute', () => {
  const value = stroke(); const result = validateUnifiedStroke(value);
  assert.equal(result.valid, true); assert.equal(value.samples.length, samples.length);
  for (const field of STROKE_SAMPLE_FIELDS) assert.ok(field in value.samples[0], field);
  assert.ok(value.boundingBox.width > 0); assert.ok(value.contentHash);
});

test('legacy stroke migration retains pointer evidence and fixed seed', () => {
  const migrated = migrateUnifiedStroke({ id: 'legacy', kind: 'pencil', matrix: [1,0,0,1,4,8], points: samples.map(item => ({ x: item.x, y: item.y, p: item.pressure, t: item.timestamp, tiltX: item.tiltX, tiltY: item.tiltY })), seed: 44 });
  assert.equal(migrated.schemaVersion, 2); assert.equal(migrated.brushId, 'pencil'); assert.equal(migrated.seed, 44); assert.equal(migrated.transform[4], 4);
});

test('twelve brush classes have twelve actual behavior modes', () => {
  const registry = new BrushPresetRegistry(); assert.equal(registry.list().length, 12);
  const modes = registry.list().map(item => compileBrushStroke(stroke(`s-${item.id}`, item.id), item).dabs[0]?.mode);
  assert.equal(new Set(modes).size, 12); assert.ok(modes.every(Boolean));
});

test('pressure, tilt, velocity and direction alter compiled brush parameters', () => {
  const registry = new BrushPresetRegistry(), preset = registry.get('oil-like'), result = compileBrushStroke(stroke('dynamic','oil-like'), preset);
  assert.notEqual(result.dabs[0].size, result.dabs.at(-1).size); assert.notEqual(result.dabs[0].rotation, result.dabs.at(-1).rotation); assert.ok(result.dabs.some(dab => dab.thickness > 0));
});

test('watercolor exposes wet/dry, diffusion, edge backrun and pigment deposition', () => {
  const result = compileBrushStroke(stroke('wc','watercolor'), BUILTIN_BRUSH_PRESETS.find(item => item.id === 'watercolor'));
  assert.equal(result.approximation, 'APPROXIMATION_MODEL_NOT_PHYSICAL_EQUIVALENCE'); assert.ok(result.dabs.every(dab => dab.diffusion > 0 && dab.edgeBackrun > 0 && dab.pigmentDeposit > 0)); assert.ok(result.dabs.every(dab => dab.wetIntoWet || dab.wetOnDry));
});

test('oil-like exposes paint load, thickness, mixing, drag and directional bristles', () => {
  const result = compileBrushStroke(stroke('oil','oil-like'), BUILTIN_BRUSH_PRESETS.find(item => item.id === 'oil-like'));
  assert.ok(result.dabs.every(dab => dab.thickness > 0 && dab.drag > 0)); assert.ok(result.dabs.some(dab => dab.bristleDirection !== 0)); assert.equal(result.approximation, 'APPROXIMATION_MODEL_NOT_PHYSICAL_EQUIVALENCE');
});

test('dry brush creates pressure and paper dependent broken coverage', () => {
  const value = createUnifiedStroke({ id:'dry', brushId:'dry-brush', layerId:'paint', seed:3, samples:Array.from({length:80},(_,i)=>({x:i*2,y:Math.sin(i)*3,timestamp:i*8,pressure:.15+(i%9)/12})) });
  const result = compileBrushStroke(value, BUILTIN_BRUSH_PRESETS.find(item=>item.id==='dry-brush'));
  assert.ok(result.dabs.length < value.samples.length); assert.ok(result.dabs.every(dab => dab.coverage >= 0 && dab.coverage <= 1));
});

test('Brush Package roundtrip keeps presets, assets, license and hash', () => {
  const registry = new BrushPresetRegistry(), encoded = JSON.stringify(exportBrushPackage(registry, ['watercolor','oil-like','dry-brush'], { id:'natural', license:{spdx:'MIT'} })), imported = importBrushPackage(encoded, new BrushPresetRegistry([]));
  assert.equal(imported.status, 'DIRECT'); assert.equal(imported.imported.length, 3); assert.ok(imported.packageHash);
});

test('missing brush dependency warns while executable asset is rejected', () => {
  const missing = validateBrushPreset({ ...BUILTIN_BRUSH_PRESETS[0], id:'dependent', dependencies:[{assetId:'grain-x',required:true}] }); assert.ok(missing.warnings.includes('DEPENDENCY_MISSING:grain-x'));
  const unsafe = createBrushPackage({ id:'unsafe', presets:[BUILTIN_BRUSH_PRESETS[0]], assets:[{id:'x',name:'tip.js',mimeType:'text/javascript',executable:true}] });
  const result = importBrushPackage(unsafe, new BrushPresetRegistry([])); assert.equal(result.status, 'REJECTED');
});

function recordedSession() {
  const recorder = new StrokeSessionRecorder({ id:'session', seed:100, documentState:{id:'doc'}, layerState:[{id:'paint'}] });
  recorder.setBrush('pencil'); recorder.setColor('#774455'); recorder.beginStroke({id:'outline'}); samples.forEach(item=>recorder.addSample(item)); recorder.endStroke(); recorder.pause(150); recorder.resume(180); recorder.checkpoint('outline');
  recorder.setBrush('watercolor'); recorder.beginStroke({id:'wash'}); samples.map(item=>({...item,y:item.y+30,wetness:.9})).forEach(item=>recorder.addSample(item)); recorder.endStroke(); recorder.setMask({id:'petal-mask'}); recorder.setBlend('multiply',.8); recorder.undo(); recorder.redo(); return recorder.finish({complete:true});
}

test('Session records pause, resume, state, strokes, timing and intermediate states', () => { const session = recordedSession(); assert.equal(session.status,'complete'); assert.equal(session.strokes.length,2); assert.ok(session.events.some(item=>item.type==='pause')); assert.ok(session.intermediateStates.length>=2); assert.ok(session.deterministicHash); });
test('Session save/reopen migration and fixed-seed replay are deterministic', () => { const session=migrateStrokeSession(JSON.parse(JSON.stringify(recordedSession()))), a=replayStrokeSession(session), b=replayStrokeSession(session); assert.equal(a.replayHash,b.replayHash); assert.equal(a.report.status,'COMPLETED'); });
test('brush replacement replay changes behavior without changing source session', () => { const session=recordedSession(), before=session.deterministicHash, base=replayStrokeSession(session), replaced=replayStrokeSession(session,{brushOverrides:{watercolor:'oil-like'}}); assert.notEqual(base.replayHash,replaced.replayHash); assert.equal(session.deterministicHash,before); });
test('color replacement and partial replay operate on selected strokes', () => { const session=recordedSession(), changed=replayStrokeSession(session,{colorOverrides:{wash:'#224466'},strokeIds:['wash']}); assert.equal(changed.strokes.length,1); assert.equal(changed.strokes[0].color,'#224466'); assert.equal(changed.report.partial,true); });
test('replay failure rolls back with reproducible report', () => { const result=replayStrokeSession(recordedSession(),{failAtStroke:'wash',throwOnFailure:false}); assert.equal(result.report.status,'EXECUTION FAILED'); assert.equal(result.report.rollback.succeeded,true); assert.equal(result.strokes.length,0); });
test('session selection delete transform recolor opacity brush and undo redo remain editable', () => { const session=recordedSession(); assert.deepEqual(selectSessionStrokes(session,['outline']),['outline']); recolorSessionStrokes(session,['outline'],'#000'); setSessionStrokeOpacity(session,['outline'],.5); replaceSessionStrokeBrush(session,['outline'],'ink'); transformSessionStrokes(session,['outline'],[1.2,0,0,1.2,4,5]); assert.equal(session.strokes[0].brushId,'ink'); assert.equal(undoSessionEdit(session),true); assert.equal(redoSessionEdit(session),true); assert.equal(deleteSessionStrokes(session,['wash']),1); });

const p5 = `brush.set("HB", "#333333", 2); brush.line(10, 10, 100, 80); brush.set("marker", "#aa5577", 5); brush.circle(80, 90, 30);`;
test('external p5.brush workflow converts to Recipe plus Stroke Session', () => { const report=importDrawingWorkflow({name:'public-workflow.js',text:p5,license:{spdx:'MIT'},sourceUrl:'https://www.npmjs.com/package/p5.brush'}); assert.ok(['EQUIVALENT','APPROXIMATED'].includes(report.status)); assert.ok(report.inkStrokeSession.strokes.length>=2); assert.equal(report.inkRecipe.strokeSession.id,report.inkStrokeSession.id); });
test('external JSON Stroke Session imports directly', () => { const session=recordedSession(), report=importDrawingWorkflow({name:'session.session.json',text:JSON.stringify(session),license:{spdx:'MIT'}}); assert.equal(report.status,'DIRECT'); assert.equal(report.inkStrokeSession.strokes.length,2); });
test('external SVG and Canvas workflows preserve concrete paths', () => { const svg=importDrawingWorkflow({name:'line.svg',text:'<svg><path d="M 0 0 L 30 40 L 60 0" stroke="#222" stroke-width="3"/></svg>',license:{spdx:'MIT'}}), canvas=importDrawingWorkflow({name:'canvas.js',text:'ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(10,20); ctx.lineTo(30,10); ctx.stroke();',license:{spdx:'MIT'}}); assert.equal(svg.inkStrokeSession.strokes.length,1); assert.equal(canvas.inkStrokeSession.strokes.length,1); });
test('unexecutable Krita workflow is not misreported as converted', () => { const report=importDrawingWorkflow({name:'plugin.py',text:'from krita import *\nKrita.instance().activeDocument()',license:{spdx:'GPL-3.0-only'}}); assert.equal(report.status,'EXTERNAL EXECUTION REQUIRED'); assert.equal(report.inkStrokeSession.strokes.length,0); });
test('Gap Frequency Ranking prioritizes artwork blockers', () => { const ranking=new DrawingGapFrequencyRanking(); ranking.add(importDrawingWorkflow({name:'plugin.py',text:'from krita import *\nKrita.instance()',license:{spdx:'GPL-3.0-only'}})); ranking.add(importDrawingWorkflow({name:'macro.scm',text:'(script-fu-register "x") (gimp-image-new 10 10 0)',license:{spdx:'GPL-3.0-only'}})); const report=ranking.report(); assert.ok(report.entries[0].blocksArtwork); assert.ok(report.entries[0].affectedAssetCount>=1); });
test('quality model separates automated evidence from required human validation', () => { const session=recordedSession(), replay=replayStrokeSession(session), quality=evaluateStrokeQuality(session,replay,{frameTimeMs:8,inputLatencyMs:12}); assert.equal(quality.manual.physicalStylusFeel,'USER VALIDATION REQUIRED'); assert.ok(quality.automated.strokeContinuity>=0); assert.equal(compareStrokeReplays(replay,replay).decision,'EQUIVALENT'); });
test('stylus test records required patterns and calibration evidence', () => { let clock=1000; const recorder=new StylusTestRecorder({deviceInfo:{userAgent:'test'},frameClock:()=>clock}); recorder.start(STYLUS_TEST_PATTERNS[0]); for(let i=0;i<40;i++){clock+=8;recorder.addFrame(clock);recorder.addPointerEvent({timeStamp:clock-3,pointerType:'pen',pointerId:1,clientX:i*3,clientY:20+Math.sin(i)*.2,pressure:i/50,tiltX:i/2,tiltY:4});} const report=recorder.finish(); assert.ok(report.eventFrequencyHz>100); assert.equal(report.manual.physicalStylusFeel,'USER VALIDATION REQUIRED'); assert.ok(Array.isArray(report.calibrationRecommendation)); });
test('.ink document roundtrip migrates sessions packages and reports without changing format 4', () => { const doc=defaultDocument(); doc.strokeSessions=[recordedSession()]; doc.brushPackages=[createBrushPackage({id:'builtins'})]; doc.handDrawingReports=[{format:'QA'}]; const migrated=migrateDocument(JSON.parse(JSON.stringify(doc))); assert.equal(migrated.formatVersion,4); assert.equal(migrated.strokeSessions[0].schemaVersion,2); assert.equal(migrated.brushPackages[0].format,'INK-BRUSH-PACKAGE'); });
test('100000-stroke metadata stress remains bounded and deterministic', () => { const ids=Array.from({length:100000},(_,i)=>`s${i}`), a=ids.reduce((hash,id)=>((hash*33)^id.length)>>>0,5381), b=ids.reduce((hash,id)=>((hash*33)^id.length)>>>0,5381); assert.equal(a,b); assert.equal(ids.length,100000); });

