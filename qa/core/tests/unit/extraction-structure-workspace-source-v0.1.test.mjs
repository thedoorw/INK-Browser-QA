import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source=readFileSync(new URL('../../../../product/source/src/ink.js',import.meta.url),'utf8');

test('workspace traversal exposes existing Repeat source through renderer, bounds, hit and SVG export',()=>{
  assert.match(source,/pathStrokeRenderWidth, repeatTransforms, tracePath, vectorObjectToSVG/);
  assert.match(source,/o\.type==='repeat'\)\{for\(const transform of repeatTransforms\(o\)\)\{ctx\.save\(\);ctx\.transform\(\.\.\.transform\);this\.drawObject\(ctx,o\.source/);
  assert.match(source,/if\(o\.type==='repeat'\)\{const repeatWorld=M\.toWorld\(parent,o\.matrix/);
  assert.match(source,/if\(o\.type==='repeat'\)return vectorObjectToSVG\(o,defs\)/);
  assert.match(source,/o\.type==='group'\|\|o\.type==='frame'\|\|o\.type==='repeat'\|\|isComponentInstance/);
});
