import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { documentFingerprint, stableStringify } from '../src/document/integrity.js';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const OUT = resolve(ROOT, 'test-fixtures');
const DATE = '2026-07-24T00:00:00.000Z';
const matrix = (x = 0, y = 0, sx = 1, sy = 1) => [sx, 0, 0, sy, x, y];
const paper = { type:'blank', color:'#fffef9', gridSize:32, absorbency:.58, roughness:.42, fiberStrength:.36, fiberAngle:0, sizing:.28, granulation:.32, seed:1337, textureVisible:true };
const artboard = { mode:'fixed', preset:'A4', orientation:'portrait', widthMm:210, heightMm:297, ppi:300, bleedMm:3, safeMarginMm:10, unit:'mm', showBleed:true, showSafeArea:true, showCenter:true, clipContent:true };
const cameras = { creation:{x:0,y:0,scale:1,rotation:0}, layout:{x:0,y:0,scale:.65,rotation:0} };
const workspace = activeSpace => ({ activeSpace, showLayoutFrameInCreation:false, layoutViewport:{x:0,y:0,scale:1,rotation:0}, cameras: structuredClone(cameras), visited:{creation:activeSpace==='creation',layout:activeSpace==='layout'} });
const shape = (id, shapeType, x, y, w, h, color, fillColor = color, fill = true, opacity = 1) => ({ id, type:'shape', shape:shapeType, matrix:matrix(x,y), opacity, color, fillColor, fill, size:2, x2:w, y2:h, w, h });
const text = (id, value, x, y, size=28, color='#202020') => ({ id, type:'text', matrix:matrix(x,y), opacity:1, text:value, color, fontFamily:'Noto Sans TC', fontSize:size, lineHeight:1.3 });
const stroke = (id, points, kind='brush', color='#202020', size=18, extras={}) => ({ id, type:'stroke', matrix:matrix(), opacity:1, color, size, kind, smoothing:.48, pressure:.95, flow:.78, wetness:.62, bristle:.32, grain:.22, softness:.35, mediaModel:'natural-v2', points, ...extras });
const layer = (id, name, objects=[], extras={}) => ({ id, name, visible:true, locked:false, opacity:1, objects, ...extras });
function doc(id, title, activeSpace='creation', layers=[layer(`${id}-layer-1`,'圖層 1')]) {
  const pageId = `${id}-page-1`;
  return { format:'INK', formatVersion:4, appVersion:'0.8.3', id, title, createdAt:DATE, modifiedAt:DATE, activePageId:pageId, pages:[{ id:pageId, name:'頁面 1', artboard:structuredClone(artboard), workspace:workspace(activeSpace), paper:structuredClone(paper), camera:structuredClone(cameras[activeSpace]), layers, activeLayerId:layers[0].id }], recentColors:['#202020','#ffffff','#b63c36','#d18b2f','#d7c64b','#3d875d','#2f718f','#594f9a'] };
}
const json = value => JSON.stringify(value, null, 2) + '\n';

await mkdir(OUT, { recursive:true });

const blank = doc('fixture-blank-a4','01 空白 A4 測試');
await writeFile(resolve(OUT,'01_blank_a4.ink'), json(blank));

const outside = doc('fixture-outside','02 創作空間與畫板外物件','creation',[
  layer('outside-main','主要內容',[
    shape('inside-card','rect',-250,-360,500,720,'#202020','#fffef9',true),
    text('inside-title','版面內標題',-130,-250,34,'#202020'),
    shape('outside-swatch','ellipse',720,-120,180,180,'#2f8179','#2f8179',true),
    text('outside-note','畫板外素材',700,100,26,'#dedfe1')
  ])
]);
outside.pages[0].workspace.cameras.creation = {x:-200,y:0,scale:.7,rotation:0};
await writeFile(resolve(OUT,'02_creation_outside_artboard.ink'), json(outside));

const poster = doc('fixture-poster','03 多圖層海報範例','layout',[
  layer('poster-guides','背景',[
    shape('poster-bg','rect',-396.85,-561.26,793.7,1122.52,'#e9e4d7','#e9e4d7',true),
    shape('poster-band','rect',-396.85,280,793.7,281,'#202020','#202020',true)
  ],{locked:true}),
  layer('poster-image','主視覺',[
    shape('poster-circle','ellipse',-220,-260,440,440,'#2f8179','#2f8179',true),
    stroke('poster-ink',[{x:-210,y:40,p:.2,t:0},{x:-80,y:-120,p:.9,t:16},{x:80,y:-170,p:.7,t:32},{x:210,y:20,p:.25,t:48}],'brush','#202020',34)
  ]),
  layer('poster-text','文字',[
    text('poster-title','INK POSTER',-245,340,56,'#fffef9'),
    text('poster-subtitle','創作空間 × 版面空間',-230,420,26,'#fffef9'),
    text('poster-footer','A4 / 300 PPI / 3 mm Bleed',-210,515,18,'#202020')
  ])
]);
poster.pages[0].activeLayerId='poster-text';
await writeFile(resolve(OUT,'03_multilayer_poster.ink'), json(poster));

const stressObjects=[];
for(let s=0;s<150;s++){
  const points=[];
  for(let i=0;i<120;i++) points.push({x:-360+i*6.2,y:-500+s*6.8+Math.sin((i+s)*.18)*18,p:.15+.8*((i%24)/23),tiltX:(i%30)-15,tiltY:15-(i%30),t:i*8,mode:'corner'});
  stressObjects.push(stroke(`stress-${s}`,points,s%3===0?'drybrush':'brush',s%5===0?'#2f718f':'#202020',8+(s%7),{wetness:s%3===0?.08:.68,grain:s%3===0?.82:.24,bristle:s%3===0?.9:.34}));
}
const stress = doc('fixture-natural-stress','04 自然媒材壓力測試','creation',[layer('stress-layer','150 筆自然媒材',stressObjects)]);
stress.pages[0].workspace.cameras.creation={x:0,y:0,scale:.45,rotation:0};
await writeFile(resolve(OUT,'04_natural_media_stress.ink'), json(stress));

const legacyFixed = structuredClone(poster);
legacyFixed.id='fixture-legacy-fixed'; legacyFixed.title='05 v0.8.2 Fixed Migration'; legacyFixed.appVersion='0.8.2';
delete legacyFixed.pages[0].workspace; legacyFixed.pages[0].artboard.mode='fixed'; legacyFixed.pages[0].camera={x:45,y:-30,scale:.72,rotation:0};
await writeFile(resolve(OUT,'05_v082_fixed_migration.ink'), json(legacyFixed));

const legacyInfinite = structuredClone(outside);
legacyInfinite.id='fixture-legacy-infinite'; legacyInfinite.title='06 Legacy Infinite Migration'; legacyInfinite.appVersion='0.8.2';
delete legacyInfinite.pages[0].workspace; legacyInfinite.pages[0].artboard.mode='infinite'; legacyInfinite.pages[0].camera={x:-120,y:80,scale:1.1,rotation:.05};
await writeFile(resolve(OUT,'06_v082_infinite_migration.ink'), json(legacyInfinite));

const invalid = structuredClone(blank);
invalid.id='fixture-invalid-duplicate'; invalid.title='07 無效文件：重複 ID';
invalid.pages[0].layers[0].objects=[shape('duplicate-object','rect',0,0,100,100,'#202020'),shape('duplicate-object','ellipse',150,0,100,100,'#b63c36')];
await writeFile(resolve(OUT,'07_invalid_duplicate_id.ink'), json(invalid));

function record(value){const serialized=stableStringify(value);return{schema:'INK_STORAGE_V3',savedAt:DATE,modifiedAt:value.modifiedAt,byteLength:new TextEncoder().encode(serialized).byteLength,fingerprint:documentFingerprint(value),value};}
const previous=record(blank); const current=record(poster); current.fingerprint='fnv1a32:00000000';
const recovery={schema:'INK_TEST_STORAGE_RECOVERY_V1',key:'autosave',current,previous,checkpoints:[record(outside)],expectedRecoverySource:'previous'};
await writeFile(resolve(OUT,'08_storage_recovery_scenario.json'), json(recovery));

console.log('Generated 8 deterministic test fixtures.');
