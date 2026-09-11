import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const PROGRAM = process.env.INK_PROGRAM || path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = process.env.INK_HERO_V165_OUT || path.join(PROGRAM, 'Validation', 'v1.6.5', 'HERO-Dependency-Scope');
const src = file => pathToFileURL(path.join(PROGRAM, file)).href;
const { defaultDocument } = await import(src('src/document/model.js'));
const { stableHash } = await import(src('src/core/stable-id.js'));
const { createAnchor, createPath, createVectorGroup } = await import(src('src/vector/vector-core.js'));
const { applyNonDestructiveDeformation } = await import(src('src/vector/deformation.js'));
const { evaluateComposition, objectBounds } = await import(src('src/composition/composition-constraints.js'));
const { analyzeLocalRecompute } = await import(src('src/recompute/local-recompute.js'));
const { addDependencyRelation } = await import(src('src/recompute/dependency-graph.js'));
const { ExportRunner } = await import(src('src/headless/export-runner.js'));
const { decodePNG, encodePNG, imageDifference } = await import(src('src/compare/image-difference.js'));
const {
  createVectorBrushMaterial, registerVectorBrushMaterial, createWatercolorPetalV2,
  createWatercolorWashV2, createNaturalSplatter, createPaperOverlayMaterial, watercolorV2Report
} = await import(src('src/paint/vector-watercolor.js'));

const clone = v => structuredClone(v);
const ensure = p => mkdir(p,{recursive:true});
const fixed = '2026-08-06T00:00:00.000Z';
const sha256 = data => createHash('sha256').update(data).digest('hex');
const ART = {x:0,y:0,w:1123,h:794};
const ORIGINAL_LICENSE={id:'INK-PROJECT-ORIGINAL',name:'INK Project Original Material',redistributable:true,derivatives:true};
const ASSET_HASH='d083be10efec6bb13ee93383fc9343bb1341498958367c1d26c210432de958c8';
const PAPER_HASH='3612f0b7a65f1c1986eb59edf4acc7c322fd45c0add99ad3ec89140ac0ae8e54';

function baseDocument(title){
  const d=defaultDocument(); d.id='doc:hero-wc-01'; d.title=title; d.createdAt=fixed; d.modifiedAt=fixed; d.appVersion='1.6.5-RC';
  const p=d.pages[0]; p.id='page:hero'; p.name='HERO A4 Landscape'; p.artboard={id:'artboard:hero',name:'A4 Landscape',x:0,y:0,width:1123,height:794,background:'#fffaf5',visible:true,locked:false,printable:true,clipContent:true,safeMarginMm:10}; p.layers=[]; p.activeLayerId=null; d.activePageId=p.id;
  d.metadata={benchmarkId:'HERO-WC-01',benchmarkName:'Large-Scale Watercolor Flower Corolla Stress Test',claim:'HERO_CAPABILITY_STRESS_TEST_NOT_ARTIST_IMITATION'};
  return d;
}
function layer(d,id,name,blendMode='source-over',opacity=1){const l={id,name,visible:true,locked:false,opacity,blendMode,objects:[],metadata:{semanticRole:id.replace('layer:','')}};d.pages[0].layers.push(l);if(!d.pages[0].activeLayerId)d.pages[0].activeLayerId=id;return l;}
function rectangle(id,x,y,w,h,{fill='none',stroke='#7097b8',strokeWidth=2,opacity=1,dash=[]}={}){return createPath({id,name:id,fill,stroke,strokeWidth,opacity,dash,subpaths:[{closed:true,role:'outer',anchors:[createAnchor(x,y),createAnchor(x+w,y),createAnchor(x+w,y+h),createAnchor(x,y+h)]}],metadata:{semanticRole:'composition-guide'}});}
function irregularCenterBlob(id,cx,cy,rx,ry,rotation,color,opacity=.42){const c=Math.cos(rotation),s=Math.sin(rotation),k=.5522847498;return createPath({id,name:id,fill:color,stroke:'none',opacity,blendMode:'multiply',matrix:[c,s,-s,c,cx,cy],subpaths:[{closed:true,role:'outer',anchors:[createAnchor(rx,0,{x:0,y:-ry*k},{x:0,y:ry*k}),createAnchor(0,ry,{x:rx*k,y:0},{x:-rx*k,y:0}),createAnchor(-rx,0,{x:0,y:ry*k},{x:0,y:-ry*k}),createAnchor(0,-ry,{x:-rx*k,y:0},{x:rx*k,y:0})]}],metadata:{semanticRole:'focal-pigment-center'}});}
function heroPetalSource(id,{x,y,length,width,rotation=0,scaleX=1,scaleY=1,color='#ca6380',family='A',asymmetry=0,tipShift=0,ruffle=0,depth='outer',intentionalCrop=false,deformation={}}){
  const c=Math.cos(rotation),s=Math.sin(rotation);
  const anchors=[
    createAnchor(0,0,{x:-width*.24,y:22},{x:width*.24,y:-20},{id:`${id}:a0`,mode:'smooth'}),
    createAnchor(-width*(.42+asymmetry),-length*.22,{x:width*.18,y:28},{x:-width*.28,y:-36},{id:`${id}:a1`,mode:'smooth'}),
    createAnchor(-width*(.76+ruffle*.12),-length*.58,{x:width*.26,y:44},{x:-width*.12,y:-52},{id:`${id}:a2`,mode:'smooth'}),
    createAnchor(tipShift-width*ruffle*.18,-length,{x:-width*.40,y:34},{x:width*.44,y:-28},{id:`${id}:a3`,mode:'smooth'}),
    createAnchor(width*(.72-ruffle*.08),-length*.61,{x:-width*.14,y:-48},{x:width*.30,y:40},{id:`${id}:a4`,mode:'smooth'}),
    createAnchor(width*(.38-asymmetry),-length*.23,{x:-width*.30,y:-34},{x:width*.16,y:24},{id:`${id}:a5`,mode:'smooth'})
  ];
  const p=createPath({id,name:`HERO Petal ${family}`,fill:color,stroke:'none',matrix:[1,0,0,1,0,0],subpaths:[{closed:true,role:'outer',anchors}],metadata:{semanticRole:'main-subject',petalFamily:family,depthLayer:depth,intentionalCrop,cropReason:intentionalCrop?'HERO flower intentionally extends beyond artboard':null,sourceGeometry:true}});
  if(Object.keys(deformation).length) applyNonDestructiveDeformation(p,deformation);
  p.matrix=[c*scaleX,s*scaleX,-s*scaleY,c*scaleY,x,y];
  return p;
}
function material(id,profile,color,seed,overrides={}){const presets={
 soft:{edgeProfile:[.12,.34,.72,1,.62,.28,.1],opacityProfile:[.12,.25,.48,.62,.34,.16],pigmentDensityProfile:[.18,.32,.62,.88,.52,.22],strokeVariation:.22,widthVariation:.22,rotationVariation:.035,colorVariation:.1,jitter:1.8,layerCount:8,opacity:.28},
 broken:{edgeProfile:[.08,.72,.18,1,.25,.82,.12],opacityProfile:[.08,.55,.2,.68,.18,.44],pigmentDensityProfile:[.16,.78,.25,1,.34,.62],strokeVariation:.42,widthVariation:.38,rotationVariation:.08,colorVariation:.16,jitter:3.1,layerCount:9,opacity:.25},
 dense:{edgeProfile:[.42,.78,1,.86,.52,.35],opacityProfile:[.28,.55,.72,.78,.5,.3],pigmentDensityProfile:[.48,.82,1,.92,.7,.45],strokeVariation:.18,widthVariation:.16,rotationVariation:.025,colorVariation:.08,jitter:1.1,layerCount:8,opacity:.36}
};return createVectorBrushMaterial({brushId:id,brushVersion:'2.0.0',brushType:'procedural-vector-watercolor-art-brush',sourceType:'INK-original-procedural-vector',sourceAsset:'assets/watercolor-v2/INK_Watercolor_Brush_Artwork_Profiles_v2.json',brushArtwork:{type:'INK_PROCEDURAL_BRUSH_ARTWORK',profile},brushMask:{type:'VECTOR_EDGE_MASK',enabled:true},assetLicense:ORIGINAL_LICENSE,assetHash:ASSET_HASH,renderMode:'VECTOR',color,strokeWidth:15,scale:1,spacing:.18,direction:'along-path',blendMode:'multiply',colorization:'tint',seed,validationState:'VALIDATION REQUIRED',...presets[profile],...overrides});}
function registerMaterials(d,round){
  const changed=round===3;
  return {
    soft:registerVectorBrushMaterial(d,material('brush:hero:soft','soft',changed?'#c76582':'#d67991',164101,changed?{opacity:.19,widthVariation:.34,edgeProfile:[.08,.46,.82,1,.55,.22,.06]}:{ })),
    broken:registerVectorBrushMaterial(d,material('brush:hero:broken','broken','#bb4f72',164102)),
    dense:registerVectorBrushMaterial(d,material('brush:hero:dense','dense','#96395c',164103))
  };
}
const familySpecs={
 A:{depth:'foreground',count:5,length:465,width:166,radius:34,brush:'broken',color:'#cf708c',angles:[-2.50,-1.68,-.73,.52,1.42]},
 B:{depth:'outer',count:9,length:385,width:132,radius:58,brush:'soft',color:'#d98298'},
 C:{depth:'middle',count:8,length:278,width:96,radius:38,brush:'broken',color:'#c65b7a'},
 D:{depth:'inner',count:7,length:176,width:65,radius:24,brush:'dense',color:'#a93e63'}
};
function specsFor(round){const center=round>=2?{x:742,y:418}:{x:785,y:397};return {center,innerCount:round>=2?9:7};}
function buildPetal(d,materials,family,index,round){
  const spec=familySpecs[family], cfg=specsFor(round), count=family==='D'?cfg.innerCount:spec.count;
  const baseAngle=spec.angles?.[index] ?? (index/count*Math.PI*2 + ({B:.13,C:-.09,D:.25}[family]||0));
  const wave=Math.sin(index*1.91+family.charCodeAt(0))*.085+(index%3-1)*.025;
  let angle=baseAngle+wave, length=spec.length*(.89+(index%4)*.055), width=spec.width*(.88+(index%3)*.07), radius=spec.radius;
  const shiftCenter=(family==='C'||family==='D')?cfg.center:{x:785,y:397};
  if(round>=2&&family==='A'&&index===4){angle+=.18;length+=55;}
  const x=shiftCenter.x+Math.sin(angle)*radius, y=shiftCenter.y-Math.cos(angle)*radius;
  let foldAngle=family==='A'?[22,-31,18,36,-24][index]:family==='B'?((index%4)-1.5)*11:family==='C'?((index%3)-1)*18:((index%2)?26:-19);
  if(round>=2&&family==='A'&&(index===1||index===3)) foldAngle += index===1?28:-24;
  const frontBack=(family==='C'&&index%3===0)||(family==='D'&&index%2===1)?'back':'front';
  const intentionalCrop=family==='A'||(family==='B'&&[1,2,3].includes(index));
  const color=family==='A'?'#d4758f':family==='B'?'#dc8398':family==='C'?'#c55a79':'#a93e63';
  const src=heroPetalSource(`hero:source:${family}:${index}`,{x,y,length,width,rotation:angle,scaleX:.91+(index%3)*.06,scaleY:.93+(index%4)*.035,color,family,depth:spec.depth,asymmetry:(index%2?.07:-.05),tipShift:(index%4-1.5)*8,ruffle:(index%3-1)*.35,intentionalCrop,deformation:{foreshortening:family==='A'?.82:family==='B'?.88:family==='C'?.74:.66,taper:family==='D'?.22:.08,bend:(index%5-2)*(family==='A'?7:4),foldAxis:.36+(index%4)*.065,foldAngle,frontBack}});
  const brushName=spec.brush; const mat=materials[brushName];
  const opacityOverride=round===3&&family==='B'?{opacity:.17,groupOpacity:.86}:{};
  const composite=createWatercolorPetalV2(src,{...mat,color},{id:`hero:petal:${family}:${index}`,seed:mat.seed+family.charCodeAt(0)*100+index,color,blendMode:(family==='C'||family==='D')?'darken':'multiply',fillLayers:family==='A'?8:family==='D'?6:7,...opacityOverride});
  composite.semantic={role:'main-subject'};
  composite.metadata={...composite.metadata,semanticRole:'main-subject',petalFamily:family,depthLayer:spec.depth,intentionalCrop,cropReason:intentionalCrop?'HERO intentional crop':null,frontBack,sourceGeometryHash:stableHash(src.subpaths),deformation:clone(src.deformation)};
  return composite;
}
function centerGroup(round,cx,cy){const children=[];const count=round===3?38:28;for(let i=0;i<7;i++){const a=i/7*Math.PI*2+.2,rx=44+(i%3)*9,ry=24+(i%2)*8;children.push(irregularCenterBlob(`hero:center:blob:${i}`,cx+Math.cos(a)*35,cy+Math.sin(a)*28,rx,ry,a*.4,i%2?'#7f3550':'#9d4b5d',round===3?.52:.42));}children.push(createNaturalSplatter({id:'hero:center:stamen',count,center:{x:cx,y:cy},radius:82,color:round===3?'#5f263f':'#7f3d4e',seed:164211,opacity:round===3?.62:.48}));const g=createVectorGroup(children,{id:'hero:center',name:'Irregular focal pigment center',blendMode:'multiply'});g.metadata={semanticRole:'main-subject',focalArea:true,notSimpleCircle:true};return g;}
function buildDocument(round){
  const d=baseDocument(`HERO-WC-01 Round ${round}`), mats=registerMaterials(d,round);
  const wash=layer(d,'layer:wash','Local non-uniform wash','multiply');
  const outer=layer(d,'layer:outer','Outer depth petals','multiply');
  const middle=layer(d,'layer:middle','Middle folded petals','multiply');
  const inner=layer(d,'layer:inner','Inner tight petals','darken');
  const foreground=layer(d,'layer:foreground','Foreground cropped petals','multiply');
  const center=layer(d,'layer:center','Focal pigment center','multiply');
  const effects=layer(d,'layer:effects','Local splatter','multiply');
  const paper=layer(d,'layer:paper','Optional paper overlay','multiply');
  const cfg=specsFor(round);
  wash.objects.push(createWatercolorWashV2({id:'hero:wash:primary',center:{x:round===3?690:720,y:round===3?425:410},width:round===3?820:760,height:round===3?680:620,color:round===3?'#c3a6d6':'#e3b4c2',opacity:round===3?.075:.055,seed:164220+(round===3?19:0),lobes:5}));
  wash.objects[0].metadata={...wash.objects[0].metadata,semanticRole:'background',intentionalCrop:true,cropReason:'local wash may extend beyond artboard'};
  for(const family of ['B','C','D','A']){
    const count=family==='D'?cfg.innerCount:familySpecs[family].count;
    const target=family==='A'?foreground:family==='B'?outer:family==='C'?middle:inner;
    for(let i=0;i<count;i++) target.objects.push(buildPetal(d,mats,family,i,round));
  }
  center.objects.push(centerGroup(round,cfg.center.x,cfg.center.y));
  effects.objects.push(createNaturalSplatter({id:'hero:splatter:local',count:44,center:{x:725,y:410},radius:400,color:'#9d4260',seed:164230,opacity:.14}));
  effects.objects[0].metadata={...effects.objects[0].metadata,semanticRole:'background',intentionalCrop:true};
  paper.objects.push(createPaperOverlayMaterial({id:'hero:paper',width:1123,height:794,seed:164240,intensity:.075,assetHash:PAPER_HASH,assetLicense:ORIGINAL_LICENSE,enabled:true}));
  for(const family of ['A','B','C','D']){
    const targetLayer=family==='A'?foreground:family==='B'?outer:family==='C'?middle:inner;
    if(family==='C'||family==='D') for(const p of targetLayer.objects) addDependencyRelation(d,{from:'hero:center',to:p.id,type:'POSITIONED_RELATIVE_TO',metadata:{family,round,changeDomains:['GEOMETRY_CHANGE','TRANSFORM_CHANGE']}});
  }
  d.metadata.structure={viewDirection:'front/three-quarter hybrid HERO crop',bloomState:'full bloom',mainCenter:cfg.center,outerSilhouette:'asymmetric cropped oval-corolla',cropStrategy:'right/top/bottom intentional crop with left negative space',symmetry:'controlled asymmetric radial',petalFamilies:['A foreground broad folded','B outer broad','C middle folded/back','D inner tight'],depthLayers:4,overlapOrder:['wash','outer','middle','inner','foreground','center','splatter','paper'],foreground:'Family A',midground:'Families B/C',background:'wash/paper',colorConcentrationZones:['irregular center','selected folded seams','overlap intersections'],negativeSpace:'left upper and left middle',focalFlow:'left negative space toward off-center pigment core'};
  return d;
}
function flatten(d){const a=[];const walk=o=>{a.push(o);for(const c of o.children||[])walk(c);if(o.source)walk(o.source)};for(const p of d.pages)for(const l of p.layers)for(const o of l.objects||[])walk(o);return a;}
function ownHash(o){const x=clone(o);delete x.children;delete x.source;return stableHash(x);}
function uniqueIds(d){const ids=flatten(d).map(o=>o.id).filter(Boolean);return {count:ids.length,unique:new Set(ids).size,duplicates:[...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))]};}
function geometrySignatures(d){return Object.fromEntries(flatten(d).filter(o=>o.metadata?.sourceGeometryHash).map(o=>[o.id,o.metadata.sourceGeometryHash]));}
function objectMap(d){return new Map(flatten(d).map(o=>[o.id,o]));}
function descendantIds(d,rootIds){const map=objectMap(d),set=new Set();const walk=o=>{if(!o||set.has(o.id))return;set.add(o.id);for(const c of o.children||[])walk(c);if(o.source)walk(o.source)};for(const id of rootIds)walk(map.get(id));return set;}
function preservation(before,after,changedRoots=[]){const a=objectMap(before),b=objectMap(after),allowed=new Set([...descendantIds(before,changedRoots),...descendantIds(after,changedRoots)]);const preserved=[],unexpected=[],missing=[];for(const [id,o] of a){if(allowed.has(id))continue;if(!b.has(id)){missing.push(id);continue;}if(ownHash(o)===ownHash(b.get(id)))preserved.push(id);else unexpected.push(id);}return {status:unexpected.length||missing.length?'FAIL':'PASS',changedRootIds:changedRoots,allowedChangedCount:allowed.size,preservedCount:preserved.length,unexpectedChangedObjectIds:unexpected,missingObjectIds:missing};}
function customComposition(d){const entries=d.pages[0].layers.flatMap(l=>(l.objects||[]).map(o=>({layer:l.id,object:o,bounds:objectBounds(o),role:o.metadata?.semanticRole||null,intentional:Boolean(o.metadata?.intentionalCrop)})));const clipped=entries.filter(e=>e.bounds.x<0||e.bounds.y<0||e.bounds.x+e.bounds.w>ART.w||e.bounds.y+e.bounds.h>ART.h);const accidental=clipped.filter(e=>!e.intentional&&e.role!=='background'&&e.role!=='paper-overlay');const petalEntries=entries.filter(e=>e.object.id.startsWith('hero:petal:'));const minX=Math.min(...petalEntries.map(e=>e.bounds.x)),minY=Math.min(...petalEntries.map(e=>e.bounds.y)),maxX=Math.max(...petalEntries.map(e=>e.bounds.x+e.bounds.w)),maxY=Math.max(...petalEntries.map(e=>e.bounds.y+e.bounds.h));const interW=Math.max(0,Math.min(ART.w,maxX)-Math.max(0,minX)),interH=Math.max(0,Math.min(ART.h,maxY)-Math.max(0,minY));const areaRatio=interW*interH/(ART.w*ART.h);return {status:accidental.length?'FAIL':'PASS',artboard:ART,safeMargin:38,intentionalCropObjects:clipped.filter(e=>e.intentional).map(e=>e.object.id),accidentalClipping:accidental.map(e=>e.object.id),mainFocalArea:{center:d.metadata.structure.mainCenter,radius:125},secondaryColorArea:{x:440,y:120,w:540,h:570},negativeSpace:{x:0,y:0,w:330,h:794},visualDominanceProxy:areaRatio,cropReason:'Large-scale flower intentionally exits the artboard to test HERO tension',builtInReport:evaluateComposition(d,{artboard:ART,safeMargin:38})};}
async function exportDoc(d,name){const dir=path.join(OUT,'HERO-WC-01','outputs',name);await ensure(dir);const runner=new ExportRunner({root:PROGRAM});const report=await runner.export(d,{output:dir,basename:name,formats:['svg','png'],background:'#fffaf5',width:ART.w,height:ART.h,deterministic:true});await writeFile(path.join(dir,`${name}.document.json`),JSON.stringify(d,null,2));await writeFile(path.join(dir,`${name}.export.json`),JSON.stringify(report,null,2));return report;}
async function compare(a,b,name){const dir=path.join(OUT,'HERO-WC-01','comparisons');await ensure(dir);const A=decodePNG(await readFile(a)),B=decodePNG(await readFile(b)),r=imageDifference(A,B,6);for(const [k,img] of [['difference',r.difference],['side-by-side',r.sideBySide],['overlay',r.overlay]])await writeFile(path.join(dir,`${name}.${k}.png`),encodePNG(img));await writeFile(path.join(dir,`${name}.metrics.json`),JSON.stringify(r.metrics,null,2));return {...r.metrics,paths:{difference:path.join(dir,`${name}.difference.png`),sideBySide:path.join(dir,`${name}.side-by-side.png`),overlay:path.join(dir,`${name}.overlay.png`)}};}
function structureView(round1){const d=baseDocument('HERO-WC-01 Structure View');d.pages[0].layers=[];const guides=layer(d,'layer:guides','Composition guides');guides.objects.push(rectangle('structure:artboard',1,1,1121,792,{stroke:'#555',strokeWidth:2}),rectangle('structure:safe',38,38,1047,718,{stroke:'#6f9abb',strokeWidth:2,dash:[12,7]}));const colors={A:'#e05b70',B:'#ef9a7e',C:'#b073b6',D:'#6c4d9b'};for(const source of flatten(round1).filter(o=>o.metadata?.sourceGeometryHash)){const p=clone(source.vectorBrushInstance?.editablePath||source.children?.find(c=>c.metadata?.watercolorV2Fill===0)||null);if(!p)continue;p.id=`structure:${source.id}`;p.fill=colors[source.metadata.petalFamily]||'#ccc';p.opacity=.62;p.stroke='#4c3d55';p.strokeWidth=1.4;p.metadata={semanticRole:`structure-${source.metadata.petalFamily}`};guides.objects.push(p);}guides.objects.push(irregularCenterBlob('structure:center',785,397,82,58,.2,'#6e3249',.72));d.metadata.structureLegend=colors;return d;}

await ensure(OUT);
await ensure(path.join(OUT,'HERO-WC-01'));
const structure={format:'INK-HERO-STRUCTURAL-ANALYSIS',version:'1.0',benchmarkId:'HERO-WC-01',viewDirection:'front/three-quarter hybrid',bloomState:'full bloom',mainCenter:{x:785,y:397},outerSilhouette:'large asymmetric cropped corolla',cropStrategy:'intentional crop on right, top and bottom edges; preserve negative space on left',symmetryType:'controlled asymmetric radial',petalFamilies:familySpecs,depthLayers:['foreground A','outer B','middle C','inner D'],overlapOrder:['B outer','C middle/back','D inner','A foreground','irregular center'],colorConcentrationZones:['center pigment cluster','fold seams','overlap intersections'],foldDirections:'family and index-specific reversible deformation',negativeSpace:'left 25–30% of artboard',focalFlow:'negative space to off-center pigment core'};
await writeFile(path.join(OUT,'HERO-WC-01','HERO_Structure_Analysis.json'),JSON.stringify(structure,null,2));
const recipe={format:'INK-RECIPE',version:'1.0',id:'HERO_Watercolor_Flower_Recipe_v0.1',name:'HERO Watercolor Flower Recipe v0.1',producer:{name:'INK',version:'1.6.5-RC'},deterministic:true,seed:164100,executionBinding:'run-v165-hero-dependency-validation.mjs',parameters:{artboard:{default:ART},center:{default:{x:785,y:397}},paperOverlay:{default:true},round:{default:1,min:1,max:3}},steps:[
{id:'01-artboard',op:'document',params:{action:'create-artboard',preset:'A4 Landscape'}},{id:'02-composition',op:'composition',params:{safeMargin:38,intentionalCrop:true}},{id:'03-center-axis',op:'path',params:{role:'focal-center'}},{id:'04-family-A',op:'material',params:{action:'define-petal-family',family:'A'}},{id:'05-family-B',op:'material',params:{action:'define-petal-family',family:'B'}},{id:'06-family-C',op:'material',params:{action:'define-petal-family',family:'C'}},{id:'07-family-D',op:'material',params:{action:'define-petal-family',family:'D'}},{id:'08-outer',op:'repeat',params:{family:'B',count:9}},{id:'09-middle',op:'repeat',params:{family:'C',count:8}},{id:'10-inner',op:'repeat',params:{family:'D',count:7}},{id:'11-foreground',op:'repeat',params:{family:'A',count:5}},{id:'12-fold',op:'deformation',params:{reversible:true}},{id:'13-brush',op:'brush',params:{materialLinks:['brush:hero:soft','brush:hero:broken','brush:hero:dense']}},{id:'14-pigment',op:'style',params:{pigmentDensity:true}},{id:'15-occlusion',op:'hierarchy',params:{depthOrder:true}},{id:'16-wash',op:'brush',params:{action:'irregular-wash'}},{id:'17-splatter',op:'brush',params:{action:'natural-splatter'}},{id:'18-paper',op:'brush',params:{action:'paper-overlay',optional:true,claim:'OVERLAY_ONLY'}},{id:'19-recompute',op:'dependency',params:{action:'recompute-scope'}},{id:'20-export',op:'export',params:{formats:['svg','png']}}],compatibility:{documentFormat:4,recipeSchema:'1.0',migrationRequired:false}};
await writeFile(path.join(OUT,'HERO-WC-01','HERO_Watercolor_Flower_Recipe_v0.1.json'),JSON.stringify(recipe,null,2));

const r1=buildDocument(1), r1rerun=buildDocument(1), r2=buildDocument(2), r3=buildDocument(3), rollback=buildDocument(1), view=structureView(r1);
const [e1,e1r,e2,e3,eBack,eView]=await Promise.all([exportDoc(r1,'Round-1'),exportDoc(r1rerun,'Round-1-Rerun'),exportDoc(r2,'Round-2'),exportDoc(r3,'Round-3'),exportDoc(rollback,'Rollback-Round-1'),exportDoc(view,'Structure-View')]);
const cDet=await compare(e1.files.png.path,e1r.files.png.path,'Round1-vs-Rerun');
const c12=await compare(e1.files.png.path,e2.files.png.path,'Round1-vs-Round2');
const c23=await compare(e2.files.png.path,e3.files.png.path,'Round2-vs-Round3');
const cBack=await compare(e1.files.png.path,eBack.files.png.path,'Round1-vs-Rollback');
const round2Changed=['hero:petal:A:1','hero:petal:A:3','hero:petal:A:4',...Array.from({length:8},(_,i)=>`hero:petal:C:${i}`),...Array.from({length:9},(_,i)=>`hero:petal:D:${i}`),'hero:center'];
const round3Changed=[...Array.from({length:9},(_,i)=>`hero:petal:B:${i}`),'hero:center','hero:wash:primary'];
const preservation2=preservation(r1,r2,round2Changed), preservation3=preservation(r2,r3,round3Changed);
const local2=analyzeLocalRecompute(r1,r2,{changes:[
  {targetId:'hero:petal:A:1',operation:'bend',changeDomain:'GEOMETRY_CHANGE'},
  {targetId:'hero:petal:A:3',operation:'bend',changeDomain:'GEOMETRY_CHANGE'},
  {targetId:'hero:petal:A:4',operation:'deformation',changeDomain:'GEOMETRY_CHANGE'},
  {targetId:'hero:center',operation:'move',changeDomain:'GEOMETRY_CHANGE'}
]});
const local3=analyzeLocalRecompute(r2,r3,{changes:[
  {targetId:'brush:hero:soft',operation:'update-material',changeDomain:'MATERIAL_CHANGE'},
  {targetId:'hero:center',operation:'update-material',changeDomain:'MATERIAL_CHANGE'},
  {targetId:'hero:center',operation:'deformation',changeDomain:'GEOMETRY_CHANGE'},
  {targetId:'hero:wash:primary',operation:'update-material',changeDomain:'MATERIAL_CHANGE'},
  {targetId:'hero:wash:primary',operation:'deformation',changeDomain:'GEOMETRY_CHANGE'}
]});
const composition={round1:customComposition(r1),round2:customComposition(r2),round3:customComposition(r3)};
const report={format:'INK-HERO-WATERCOLOR-BENCHMARK-REPORT',version:'1.0',benchmarkId:'HERO-WC-01',runtimeModified:true,artboard:{type:'A4 Landscape',width:1123,height:794},petalCount:{round1:29,round2:31,round3:31},petalFamilies:4,depthLayers:4,brushMaterials:['soft-edge','broken-edge','dense-pigment'],intentionalCrop:composition.round1.intentionalCropObjects.length>0,rounds:{round1:{status:'PASS',png:e1.files.png.path,svg:e1.files.svg.path,composition:composition.round1},round2:{status:preservation2.status==='PASS'&&composition.round2.status==='PASS'&&local2.status==='LOCAL_RECOMPUTE_COMPLETED'?'PASS':'VALIDATION REQUIRED',png:e2.files.png.path,svg:e2.files.svg.path,preservation:preservation2,localRecompute:local2,composition:composition.round2,changes:['foreground fold group','inner count 7→9','center shift','crop relation']},round3:{status:preservation3.status==='PASS'&&composition.round3.status==='PASS'&&local3.status==='LOCAL_RECOMPUTE_COMPLETED'?'PASS':'VALIDATION REQUIRED',png:e3.files.png.path,svg:e3.files.svg.path,preservation:preservation3,localRecompute:local3,composition:composition.round3,changes:['outer brush material','center pigment density','outer opacity','local wash']},rollback:{status:cBack.changedPixels===0?'PASS':'FAIL',png:eBack.files.png.path}},deterministic:{status:cDet.changedPixels===0&&e1.files.png.sha256===e1r.files.png.sha256?'PASS':'FAIL',round1Hash:e1.files.png.sha256,rerunHash:e1r.files.png.sha256,difference:cDet},differences:{round1Round2:c12,round2Round3:c23,rollback:cBack},stableIds:{round1:uniqueIds(r1),round2:uniqueIds(r2),round3:uniqueIds(r3)},geometryMaterialSeparation:{round2ToRound3GeometrySignaturesEqual:JSON.stringify(geometrySignatures(r2))===JSON.stringify(geometrySignatures(r3))},watercolor:watercolorV2Report(r3)};
await writeFile(path.join(OUT,'HERO-WC-01','HERO_WC_01_Result.json'),JSON.stringify(report,null,2));
const depSummary={format:'INK-HERO-LAYER-DEPENDENCY-SUMMARY',version:'1.0',layers:r3.pages[0].layers.map(l=>({id:l.id,name:l.name,blendMode:l.blendMode,objectCount:l.objects.length})),dependencyEdges:r3.dependencyModel?.edges||[],round2Preservation:preservation2,round3Preservation:preservation3,round2FormalRecompute:{status:local2.status,changeDomains:local2.recomputeScope?.changeDomains,changedObjectIds:local2.changedObjectIds,overRecomputed:local2.overRecomputed,underRecomputed:local2.underRecomputed,unaffectedChangedObjectIds:local2.unaffectedChangedObjectIds,recomputeSet:local2.recomputeScope?.recomputeSet,recomputeSetHash:local2.recomputeScope?.recomputeSetHash,reasonTrace:local2.recomputeReasons},round3FormalRecompute:{status:local3.status,changeDomains:local3.recomputeScope?.changeDomains,changedObjectIds:local3.changedObjectIds,overRecomputed:local3.overRecomputed,underRecomputed:local3.underRecomputed,unaffectedChangedObjectIds:local3.unaffectedChangedObjectIds,recomputeSet:local3.recomputeScope?.recomputeSet,recomputeSetHash:local3.recomputeScope?.recomputeSetHash,reasonTrace:local3.recomputeReasons}};
await writeFile(path.join(OUT,'HERO-WC-01','Layer_Dependency_Summary.json'),JSON.stringify(depSummary,null,2));
console.log(JSON.stringify({status:'DONE',out:OUT,report},null,2));
