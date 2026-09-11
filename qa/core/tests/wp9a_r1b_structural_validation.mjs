import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { measureCrownGeometryGates, measureLeafGeometryGates, measureFourLeafSeparation, GEOMETRY_GATE_THRESHOLDS } from '../src/flora/structure/geometry-measurement-gates.js';
import { maskAlphaAt, worldPointToNormalized } from '../src/flora/mask/vector-mask.js';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const OUT=path.join(ROOT,'Runtime_Evidence','WP9A_R1b');
const doc=JSON.parse(fs.readFileSync(path.join(ROOT,'FLR012_Candidate_A_R1.ink'),'utf8'));
const page=doc.pages[0], structure=page.floraHero;
const crown=measureCrownGeometryGates(structure);
const leaves=structure.regions.filter(r=>r.kind==='leaf-region');
const leafMetrics=leaves.map(r=>({regionId:r.regionId,...measureLeafGeometryGates(r)}));
const separation=measureFourLeafSeparation(structure);
const petals=structure.regions.filter(r=>r.kind==='petal-region');
const outer=petals.filter(r=>r.petal?.ring==='outer'),inner=petals.filter(r=>r.petal?.ring==='inner');
const masks=new Map(structure.masks.map(m=>[m.regionId,m]));
const painted=page.layers.flatMap(l=>l.objects||[]).filter(o=>o.floraPaint && o.floraPaint.regionId!==structure.backgroundRegionId);
let totalPoints=0,outsidePoints=0,zeroAlphaPoints=0;
const regionStats={};
for(const o of painted){
 const regionId=o.floraPaint.regionId,mask=masks.get(regionId); if(!mask) continue;
 const matrix=Array.isArray(o.matrix)?o.matrix:[1,0,0,1,0,0]; const tx=Number(matrix[4])||0,ty=Number(matrix[5])||0;
 regionStats[regionId]??={strokes:0,points:0,outside:0,zeroAlpha:0};regionStats[regionId].strokes++;
 for(const p of o.points||[]){
  const n=worldPointToNormalized(page,{x:tx+p.x,y:ty+p.y}); const a=maskAlphaAt(mask,n.x,n.y); totalPoints++;regionStats[regionId].points++;
  if(a<=0){outsidePoints++;zeroAlphaPoints++;regionStats[regionId].outside++;regionStats[regionId].zeroAlpha++;}
 }
}
const checks={
 petalCount:petals.length===14,outer8:outer.length===8,inner6:inner.length===6,
 staggered:crown.staggerMinimum>.06,
 innerShorter:crown.innerMeanLength<crown.outerMeanLength,
 spoonRange:crown.spoon.every(s=>s.widestPointT>=.55&&s.widestPointT<=.80),
 roundedTips:crown.spoon.every(s=>!s.spearTip),
 coreOneMass:crown.crownUnionComponentCount===1,
 radialGap:crown.radialGapRatio<=GEOMETRY_GATE_THRESHOLDS.crown.maximumRadialGapRatio,
 innerOuterIntersect:crown.innerOuterIntersectionRatio>=GEOMETRY_GATE_THRESHOLDS.crown.minimumInnerOuterIntersectionRatio,
 centerOcclusion:crown.centerOcclusionRatio>=GEOMETRY_GATE_THRESHOLDS.crown.minimumCenterOcclusionRatio&&crown.centerOcclusionRatio<=GEOMETRY_GATE_THRESHOLDS.crown.maximumCenterOcclusionRatio&&crown.centerVisibleRatio>0,
 noGenericRadial:!crown.genericRadialFlowerWarning,
 fourLeaves:leaves.length===4&&separation.separated&&separation.allIndividualContoursConnected,
 leafAxes:leafMetrics.every(x=>x.centralAxisContinuous),
 noGenericRibbon:leafMetrics.every(x=>!x.genericRibbonSimilarity),
 leafLobes:leafMetrics.every(x=>x.effectiveLobeCountLeft>=6&&x.effectiveLobeCountLeft<=10&&x.effectiveLobeCountRight>=6&&x.effectiveLobeCountRight<=10),
 paintClipped:outsidePoints===0
};
const result={schema:'INK_FLORA_WP9A_R1B_STRUCTURAL_VALIDATION_V1',candidate:'FLR012_Candidate_A_R1',checks,passed:Object.values(checks).filter(Boolean).length,total:Object.keys(checks).length,crown,leafMetrics,separation,paintedStrokeClipping:{strokes:painted.length,totalPoints,outsidePoints,zeroAlphaPoints,regionStats}};
fs.writeFileSync(path.join(OUT,'structural-validation.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({passed:result.passed,total:result.total,checks,paintedStrokeClipping:result.paintedStrokeClipping},null,2));
if(!Object.values(checks).every(Boolean))process.exitCode=1;
