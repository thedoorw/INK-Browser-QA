import { createRepeat } from '../vector/vector-core.js';
import { binaryRaster } from './adapters.js';
import { requireValue, validateRaster } from './core.js';
// Evidence only. A high rotational score does not establish semantic equivalence.
export function radialEvidence(raster,{center=null,radius=null,counts=[2,3,4,5,6,8,10,12,16],threshold=128}={}) {
  validateRaster(raster);const binary=binaryRaster({raster,parameters:{threshold}}),{width,height}=raster;
  let sx=0,sy=0,n=0;
  for(let y=0;y<height;y++)for(let x=0;x<width;x++)if(binary.data[(y*width+x)*4]===0){sx+=x;sy+=y;n++;}
  requireValue(n>0,'EXTRACTION_STRUCTURE_EMPTY');
  const c=center||{x:sx/n,y:sy/n},r=radius??Math.min(c.x,c.y,width-1-c.x,height-1-c.y);
  requireValue([c.x,c.y,r].every(Number.isFinite)&&r>2&&r<=Math.max(width,height),'EXTRACTION_STRUCTURE_ROI');
  requireValue(counts.length>0&&counts.length<=24&&counts.every(v=>Number.isInteger(v)&&v>=2&&v<=48),'EXTRACTION_STRUCTURE_COUNTS');
  const sample=(angle,dist)=>{const x=Math.round(c.x+Math.cos(angle)*dist),y=Math.round(c.y+Math.sin(angle)*dist);return x>=0&&x<width&&y>=0&&y<height&&binary.data[(y*width+x)*4]===0;};
  const rotations=counts.map(count=>{let intersect=0,union=0;for(let a=0;a<360;a++)for(let d=8;d<128;d++){
    const p=sample(a*Math.PI/180,r*d/128),q=sample(a*Math.PI/180+2*Math.PI/count,r*d/128);intersect+=p&&q?1:0;union+=p||q?1:0;
  }return{count,maskIoU:union?intersect/union:0};}).sort((a,b)=>b.maskIoU-a.maskIoU||a.count-b.count);
  const rings=[];for(let d=1;d<128;d++){let hits=0;for(let a=0;a<360;a++)hits+=sample(a*Math.PI/180,r*d/128)?1:0;rings.push({radius:r*d/128,occupancy:hits/360});}
  return {schema:'INK-RADIAL-EVIDENCE/1',center:{...c},centerOrigin:center?'provided-hypothesis':'foreground-centroid',radius:r,
    candidates:rotations,ringCandidates:rings.filter((v,i)=>i>0&&i<rings.length-1&&v.occupancy>rings[i-1].occupancy&&v.occupancy>=rings[i+1].occupancy),
    warning:'Scores measure binary-mask rotational agreement, not completeness or semantic motif identity.'};
}
export function sectorMask(raster,source,evidence,{count,sector=0,innerRadius=0,threshold=128}={}) {
  requireValue(Number.isInteger(count)&&count>=2&&count<=48&&Number.isInteger(sector)&&sector>=0&&sector<count,'EXTRACTION_SECTOR');
  const b=binaryRaster({raster,parameters:{threshold}}),data=new Uint8Array(raster.width*raster.height),step=2*Math.PI/count;
  for(let y=0;y<raster.height;y++)for(let x=0;x<raster.width;x++){
    const dx=x-evidence.center.x,dy=y-evidence.center.y,d=Math.hypot(dx,dy),a=(Math.atan2(dy,dx)+2*Math.PI)%(2*Math.PI);
    if(d>=innerRadius&&d<=evidence.radius&&a>=sector*step&&a<(sector+1)*step&&b.data[(y*raster.width+x)*4]===0)data[y*raster.width+x]=255;
  }
  return{width:raster.width,height:raster.height,data,sourceSha256:source.sha256,provider:'geometric-sector-mask',model:null};
}
export function reconstructRadial(prototype,evidence,{count,id='extracted-repeat'}={}) {
  requireValue(prototype?.type==='path'&&evidence?.schema==='INK-RADIAL-EVIDENCE/1'&&evidence.candidates.some(c=>c.count===count),'EXTRACTION_REPEAT_EVIDENCE');
  const repeat=createRepeat(prototype,{id,name:'Structure reconstruction candidate',mode:'radial',count,center:evidence.center,sourceObjectId:prototype.id});
  repeat.metadata={...repeat.metadata,extraction:prototype.metadata?.extraction,structureEvidence:JSON.parse(JSON.stringify(evidence)),status:'CANDIDATE_REQUIRES_OVERLAY_QA'};
  return repeat;
}
