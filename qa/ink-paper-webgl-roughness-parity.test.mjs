import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  normalizePaperProfile,
  paperProfileFingerprint,
  paperSampleAt
} from '../product/source/src/render/paper-profile.js';

const WEBGL_SOURCE='product/source/src/render/webgl/multi-channel-ink-webgl.js';

test('paper roughness remains one canonical page.paper profile field',()=>{
  const low=normalizePaperProfile({roughness:.05,absorbency:.58,sizing:.28,granulation:.32,seed:1337});
  const high=normalizePaperProfile({roughness:.95,absorbency:.58,sizing:.28,granulation:.32,seed:1337});
  assert.equal(low.roughness,.05);
  assert.equal(high.roughness,.95);
  assert.notEqual(paperProfileFingerprint(low),paperProfileFingerprint(high));
});

test('Canvas2D paper resistance responds to roughness-only without changing absorbency authority',()=>{
  const base={absorbency:.58,sizing:.28,granulation:.32,fiberStrength:.36,fiberAngle:0,seed:1337};
  const low=paperSampleAt(91.25,-43.75,{...base,roughness:.05});
  const high=paperSampleAt(91.25,-43.75,{...base,roughness:.95});
  assert.equal(low.absorbency,high.absorbency);
  assert.ok(high.resistance>low.resistance,'higher roughness must increase paper resistance');
});

test('WebGL simulation consumes dedicated roughness with Canvas2D-compatible resistance role',()=>{
  const source=readFileSync(WEBGL_SOURCE,'utf8');
  assert.match(source,/uniform float u_roughness;/);
  assert.match(source,/roughness:gl\.getUniformLocation\(simulate,'u_roughness'\)/);
  assert.match(source,/gl\.uniform1f\(sim\.roughness,profile\.roughness\)/);
  assert.match(source,/resistance=clamp\(u_sizing\*\.72\+\(1\.0-paper\)\*u_roughness\*\.35,0\.0,1\.0\)/);
  assert.doesNotMatch(source,/resistance=clamp\(u_sizing\*\.72\+\(1\.0-paper\)\*u_granulation/);
});

test('roughness parity does not replace existing absorbency or granulation semantics',()=>{
  const source=readFileSync(WEBGL_SOURCE,'utf8');
  assert.match(source,/float absorb=clamp\(u_absorbency\*\(1\.0-u_sizing\*\.58\)/);
  assert.match(source,/float settle=absorbed\*\(1\.0\+u_granulation\*\(1\.0-paper\)\)/);
  assert.match(source,/paperProfileFingerprint\(paper\)/);
});
