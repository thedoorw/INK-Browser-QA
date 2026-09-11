import test from 'node:test';
import assert from 'node:assert/strict';
import { importSVGDocument, vectorObjectToSVG, createAnchor, createPath } from '../../src/vector/vector-core.js';
import { stableHash } from '../../src/core/stable-id.js';
import { compareCompositionPreservation } from '../../src/composition/composition-constraints.js';
import { defaultDocument } from '../../src/document/model.js';
import { createVectorBrushMaterial, createWatercolorPetal } from '../../src/paint/vector-watercolor.js';

const flatten = objects => { const out=[]; const walk=o=>{out.push(o);for(const c of o.children||[])walk(c);if(o.source)walk(o.source);};objects.forEach(walk);return out; };
const duplicateSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100">
<g id="flower" data-ink-type="group"><path id="petal" data-ink-id="petal" fill="#a55" d="M10 50 L30 10 L50 50 Z"/></g>
<g id="flower" data-ink-type="group"><path id="petal" data-ink-id="petal" fill="#5a5" d="M110 50 L130 10 L150 50 Z"/></g>
</svg>`;
function documentFrom(objects){const d=defaultDocument();d.pages[0].layers[0].objects=objects;return d;}

test('duplicate SVG IDs normalize deterministically at import, not export', () => {
  const a=importSVGDocument(duplicateSvg,{sourceDocumentIdentity:'case5-poster',importSessionSeed:'163'});
  const b=importSVGDocument(duplicateSvg,{sourceDocumentIdentity:'case5-poster',importSessionSeed:'163'});
  const idsA=flatten(a.objects).map(o=>o.id),idsB=flatten(b.objects).map(o=>o.id);
  assert.equal(new Set(idsA).size,idsA.length); assert.deepEqual(idsA,idsB);
  assert.equal(a.metadata.idNormalization.duplicateGroupCount ?? a.metadata.idNormalization.original.duplicateGroupCount,2);
  assert.equal(a.metadata.idNormalization.normalizedOccurrenceCount,4);
  assert.equal(a.metadata.idNormalization.randomUuidUsed,false);
});

test('normalized IDs survive replay, local edit and rollback preservation', () => {
  const parsed=importSVGDocument(duplicateSvg,{sourceDocumentIdentity:'case5-poster',importSessionSeed:'163'});
  const before=documentFrom(structuredClone(parsed.objects)),after=structuredClone(before);
  const all=flatten(after.pages[0].layers[0].objects),target=all.find(o=>o.type==='path');
  const originalId=target.id,targetBefore=stableHash(target);target.fill='#335599';
  const preservation=compareCompositionPreservation(before,after,[originalId]);
  assert.equal(preservation.status,'PASS'); assert.equal(target.id,originalId); assert.notEqual(stableHash(target),targetBefore);
  assert.equal(stableHash(structuredClone(before)),stableHash(before));
  const svg=flatten(after.pages[0].layers[0].objects).map(o=>o.type==='path'?vectorObjectToSVG(o,[]):'').join('');
  const ids=[...svg.matchAll(/(?:^|\s)id="([^"]+)"/g)].map(m=>m[1]); assert.equal(new Set(ids).size,ids.length);
});

test('unique SVG IDs remain unchanged for backward compatibility', () => {
  const parsed=importSVGDocument('<svg><path id="only" d="M0 0L10 0L10 10Z"/></svg>');
  assert.equal(parsed.paths[0].id,'only'); assert.equal(parsed.metadata.idNormalization.normalizedOccurrenceCount,0);
});

test('watercolor stroke preserves source transform while adding deterministic jitter', () => {
  const source=createPath({id:'petal:source',matrix:[0.8,0.6,-0.6,0.8,320,410],fill:'#c05b78',subpaths:[{closed:true,role:'outer',anchors:[createAnchor(0,0),createAnchor(30,-80),createAnchor(-30,-80)]}]});
  const brush=createVectorBrushMaterial({brushId:'brush:test',brushVersion:'1.0.0',seed:163,layerCount:4,jitter:1.5});
  const first=createWatercolorPetal(source,brush,{id:'petal:watercolor',seed:163}),second=createWatercolorPetal(source,brush,{id:'petal:watercolor',seed:163});
  const layers=flatten([first]).filter(o=>o.type==='path'); assert.ok(layers.length>=4);
  assert.ok(layers.every(o=>o.matrix.slice(0,4).every((value,index)=>value===source.matrix[index])));
  assert.ok(layers.every(o=>Math.abs(o.matrix[4]-source.matrix[4])<4&&Math.abs(o.matrix[5]-source.matrix[5])<4));
  assert.deepEqual(first,second);
});
