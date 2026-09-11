import fs from 'node:fs';
import path from 'node:path';
import {
  buildBristleClusters,
  buildNaturalMediaStamps,
  naturalMediaGrainAt,
  naturalMediaSeed,
  premultiplyMediaRGBA,
  removeDuplicateNaturalMediaPoints,
  resampleNaturalMediaPath,
  sourceOverCoverage
} from '../src/render/natural-media-utils.js';

const ROOT=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');
const OUT=path.join(ROOT,'Runtime_Evidence','WP8A');fs.mkdirSync(OUT,{recursive:true});
const stroke={
  id:'wp8a-diagnostic-stroke',type:'stroke',kind:'brush',seed:8081,color:'#ad4f70',size:38,
  pressure:.88,flow:.72,opacity:.78,grain:.24,bristle:.38,wetness:.44,softness:.7,taper:.12,
  points:[
    {x:42,y:154,p:.24,tiltX:-8,tiltY:3,t:0},
    {x:42,y:154,p:.24,tiltX:-8,tiltY:3,t:0},
    {x:82,y:126,p:.46,tiltX:-3,tiltY:5,t:16},
    {x:129,y:83,p:.75,tiltX:4,tiltY:10,t:33},
    {x:161,y:62,p:.91,tiltX:8,tiltY:14,t:47},
    {x:173,y:91,p:.69,tiltX:4,tiltY:8,t:65},
    {x:217,y:122,p:.53,tiltX:-2,tiltY:4,t:84},
    {x:276,y:131,p:.31,tiltX:-8,tiltY:1,t:108}
  ]
};
const deduped=removeDuplicateNaturalMediaPoints(stroke.points);
const resampled=resampleNaturalMediaPath(stroke,{maxSamples:2048});
const stampResult=buildNaturalMediaStamps(stroke,{maxStamps:2048});
const bristles=buildBristleClusters(stroke);
const grain=[];
for(let y=0;y<128;y++){
  const row=[];
  for(let x=0;x<192;x++)row.push(naturalMediaGrainAt(x*2.2,y*2.2,naturalMediaSeed(stroke)));
  grain.push(row);
}
const alpha=[];let coverage=0;
for(let i=0;i<32;i++){
  const added=.12*(.55+.45*Math.sin((i+1)*.41)**2);
  coverage=sourceOverCoverage(coverage,added);
  alpha.push({step:i+1,added,sourceOver:coverage,oldAdditive:Math.min(1,(i+1)*added),premultiplied:premultiplyMediaRGBA([.68,.31,.44,coverage])});
}
const intervals=[];
for(let i=1;i<resampled.length;i++)intervals.push(Math.hypot(resampled[i].x-resampled[i-1].x,resampled[i].y-resampled[i-1].y));
const output={
  schema:'INK_FLORA_WP8A_RENDERER_DIAGNOSTICS_V1',
  imageModelUsed:false,
  stroke,
  duplicatePointCount:stroke.points.length-deduped.length,
  deduped,
  resampled,
  stamps:stampResult.stamps,
  bristles,
  grain,
  alpha,
  summary:{
    sourcePointCount:stroke.points.length,dedupedPointCount:deduped.length,resampledPointCount:resampled.length,
    stampCount:stampResult.stamps.length,bristleClusterCount:bristles.length,
    spacingMin:Math.min(...intervals),spacingMax:Math.max(...intervals),spacingMean:intervals.reduce((a,b)=>a+b,0)/intervals.length,
    spacingUniqueRounded:new Set(intervals.map(v=>v.toFixed(3))).size,
    grainMin:Math.min(...grain.flat()),grainMax:Math.max(...grain.flat()),grainMean:grain.flat().reduce((a,b)=>a+b,0)/grain.flat().length
  }
};
fs.writeFileSync(path.join(OUT,'renderer-diagnostics.json'),JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify(output.summary,null,2));
