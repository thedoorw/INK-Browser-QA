(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.RASemanticBoundary=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';

const VERSION='1.0';
const round=(value,digits=4)=>Number(Number(value).toFixed(digits));
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);

function hash(text){
  let h=0x811c9dc5;
  for(let i=0;i<text.length;i++){
    h^=text.charCodeAt(i);
    h=Math.imul(h,0x01000193)>>>0;
  }
  return h.toString(16).padStart(8,'0');
}

function stableId(kind,parts){
  const normalized=parts.flat().map(String).sort().join('|');
  return `sb-${kind}-${hash(`${kind}|${normalized}`)}`;
}

function reviewEnvelope(kind,id,evidenceIds,payload={}){
  return {
    id,kind,
    ...payload,
    evidenceIds:[...new Set(evidenceIds)].sort(),
    reviewState:'AUTO_PROPOSED',
    decisionState:'unresolved',
    recipeEligible:false,
    formalPromotionBlocked:true,
    requiresAIReview:true,
    provenance:{
      sourceKind:'raw-boundary-evidence',
      algorithm:'RA Semantic Boundary Engine',
      algorithmVersion:VERSION
    }
  };
}

function bboxEdges(contour){
  const b=contour.bbox;
  return {left:b.x,top:b.y,right:b.x+b.width,bottom:b.y+b.height};
}

function bboxContains(a,b,tolerance=1){
  const x=bboxEdges(a),y=bboxEdges(b);
  return x.left<=y.left+tolerance&&x.top<=y.top+tolerance&&
    x.right>=y.right-tolerance&&x.bottom>=y.bottom-tolerance;
}

function bboxOverlap(a,b){
  const x=bboxEdges(a),y=bboxEdges(b);
  const width=Math.min(x.right,y.right)-Math.max(x.left,y.left);
  const height=Math.min(x.bottom,y.bottom)-Math.max(x.top,y.top);
  return {width:Math.max(0,width),height:Math.max(0,height),area:Math.max(0,width)*Math.max(0,height)};
}

function bboxGap(a,b){
  const x=bboxEdges(a),y=bboxEdges(b);
  const dx=Math.max(0,Math.max(x.left,y.left)-Math.min(x.right,y.right));
  const dy=Math.max(0,Math.max(x.top,y.top)-Math.min(x.bottom,y.bottom));
  return Math.hypot(dx,dy);
}

function orientation(a,b,c){
  const value=(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
  return Math.abs(value)<1e-9?0:(value>0?1:-1);
}

function segmentsIntersect(a,b,c,d){
  const o1=orientation(a,b,c),o2=orientation(a,b,d),o3=orientation(c,d,a),o4=orientation(c,d,b);
  return o1!==o2&&o3!==o4;
}

function sampledSegments(contour,maxPoints=48){
  const points=contour.points||[];
  if(points.length<2)return[];
  const step=Math.max(1,Math.ceil(points.length/maxPoints));
  const sampled=points.filter((_p,index)=>index%step===0);
  if(sampled.at(-1)!==points.at(-1))sampled.push(points.at(-1));
  const result=[];
  for(let i=1;i<sampled.length;i++)result.push([sampled[i-1],sampled[i]]);
  if(contour.closed&&sampled.length>2)result.push([sampled.at(-1),sampled[0]]);
  return result;
}

function contourIntersects(a,b){
  if(!bboxOverlap(a,b).area)return false;
  const aa=sampledSegments(a),bb=sampledSegments(b);
  for(const x of aa)for(const y of bb)if(segmentsIntersect(x[0],x[1],y[0],y[1]))return true;
  return false;
}

function hierarchyDepth(contour,map){
  let depth=0,current=contour,seen=new Set([contour.contourId]);
  while(current.parentContourId){
    if(seen.has(current.parentContourId))return {depth,cycle:[...seen,current.parentContourId]};
    seen.add(current.parentContourId);
    current=map.get(current.parentContourId);
    if(!current)break;
    depth++;
  }
  return {depth,cycle:null};
}

function validateHierarchy(contours){
  const map=new Map(contours.map(c=>[c.contourId,c]));
  const cycles=[],invalidParents=[];
  for(const contour of contours){
    if(contour.parentContourId&&!map.has(contour.parentContourId)){
      invalidParents.push({contourId:contour.contourId,parentContourId:contour.parentContourId});
      continue;
    }
    const result=hierarchyDepth(contour,map);
    if(result.cycle)cycles.push(result.cycle);
  }
  return {valid:cycles.length===0&&invalidParents.length===0,cycles,invalidParents};
}

function hierarchyCandidates(contours){
  const map=new Map(contours.map(c=>[c.contourId,c]));
  return contours.map(contour=>{
    const result=hierarchyDepth(contour,map);
    const role=result.depth===0?'outer':result.depth%2===1?'hole':'island';
    return reviewEnvelope('HIERARCHY_ROLE',stableId('role',[contour.contourId,role]),[contour.contourId],{
      contourId:contour.contourId,
      proposedRole:role,
      depth:result.depth,
      parentContourId:contour.parentContourId||null,
      confidence:contour.closed?0.65:0.25,
      reasons:[
        `raw hierarchy depth ${result.depth}`,
        contour.closed?'closed evidence supports region role':'open chain requires AI review'
      ]
    });
  });
}

function relationship(kind,a,b,metrics={}){
  return reviewEnvelope('RELATIONSHIP',stableId(kind.toLowerCase(),[a.contourId,b.contourId]),[a.contourId,b.contourId],{
    relationshipType:kind,
    sourceId:a.contourId,
    targetId:b.contourId,
    metrics
  });
}

function relationshipCandidates(contours,tolerance=2){
  const relationships=[],crossings=[],occlusions=[];
  const existing=new Set();
  const add=item=>{
    const key=`${item.relationshipType}|${item.sourceId}|${item.targetId}`;
    if(!existing.has(key)){existing.add(key);relationships.push(item);}
  };
  const map=new Map(contours.map(c=>[c.contourId,c]));
  for(const child of contours){
    const parent=map.get(child.parentContourId);
    if(parent){
      add(relationship('contains',parent,child,{source:'rawHierarchy'}));
      add(relationship('inside',child,parent,{source:'rawHierarchy'}));
    }
  }
  for(let i=0;i<contours.length;i++)for(let j=i+1;j<contours.length;j++){
    const a=contours[i],b=contours[j],overlap=bboxOverlap(a,b);
    if(bboxContains(a,b)||bboxContains(b,a))continue;
    if(overlap.area>0){
      const intersects=contourIntersects(a,b);
      const areaA=Math.max(1,a.bbox.width*a.bbox.height),areaB=Math.max(1,b.bbox.width*b.bbox.height);
      const overlapRatio=overlap.area/Math.min(areaA,areaB);
      if(!intersects&&overlapRatio<0.2)continue;
      add(relationship(intersects?'intersects':'overlaps',a,b,{
        source:intersects?'sampledSegments':'bbox',
        overlapArea:round(overlap.area),
        overlapRatio:round(overlapRatio,6)
      }));
      if(intersects){
        crossings.push(reviewEnvelope('CROSSING',stableId('crossing',[a.contourId,b.contourId]),[a.contourId,b.contourId],{
          pathA:a.contourId,pathB:b.contourId,
          crossingState:'UNRESOLVED',
          connectedJunction:null,
          overPath:null,underPath:null,
          reason:'Sampled segments intersect; connectivity and over/under require AI review.'
        }));
      }
      if(intersects||overlapRatio>=0.35){
        occlusions.push(reviewEnvelope('OCCLUSION',stableId('occlusion',[a.contourId,b.contourId]),[a.contourId,b.contourId],{
          frontContourId:null,backContourId:null,
          overlapArea:round(overlap.area),
          overlapRatio:round(overlapRatio,6),
          reason:'Overlapping boundary evidence may indicate occlusion; z-order is unresolved.'
        }));
      }
    }else{
      const gap=bboxGap(a,b);
      if(gap<=tolerance)add(relationship('touches',a,b,{source:'bboxGap',gap:round(gap)}));
    }
  }
  return {relationships,crossings,occlusions};
}

function endpoints(contour){
  const points=contour.points||[];
  if(contour.closed||points.length<2)return[];
  return [
    {contourId:contour.contourId,index:0,point:points[0]},
    {contourId:contour.contourId,index:points.length-1,point:points.at(-1)}
  ];
}

function proposeMerge(contours,reason='AI requested merge candidate'){
  const ids=[...new Set(contours.map(c=>c.contourId))].sort();
  if(ids.length<2)throw new Error('Merge candidate requires at least two contours.');
  return reviewEnvelope('MERGE',stableId('merge',ids),ids,{
    sourceContourIds:ids,
    mergedContourId:stableId('merged-child',ids),
    reason
  });
}

function gapBridgeCandidates(contours,maxGap=24){
  const points=contours.flatMap(endpoints),bridges=[];
  for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++){
    const a=points[i],b=points[j];
    if(a.contourId===b.contourId)continue;
    const gap=distance(a.point,b.point);
    if(gap<=maxGap){
      const ids=[a.contourId,b.contourId];
      bridges.push(reviewEnvelope('GAP_BRIDGE',stableId('bridge',[...ids,a.index,b.index]),ids,{
        from:a,to:b,gap:round(gap),
        mergeCandidateId:stableId('merge',ids),
        reason:'Open endpoints fall within the working gap threshold.'
      }));
    }
  }
  return bridges;
}

function curvatureSplitIndices(contour){
  const points=contour.points||[];
  if(points.length<7)return[];
  const step=Math.max(1,Math.floor(points.length/32)),ranked=[];
  for(let i=step;i<points.length-step;i+=step){
    const a=points[i-step],b=points[i],c=points[i+step];
    const u={x:a.x-b.x,y:a.y-b.y},v={x:c.x-b.x,y:c.y-b.y};
    const denom=Math.hypot(u.x,u.y)*Math.hypot(v.x,v.y);
    if(!denom)continue;
    const angle=Math.acos(Math.max(-1,Math.min(1,(u.x*v.x+u.y*v.y)/denom)))*180/Math.PI;
    const turn=180-angle;
    if(turn>=55)ranked.push({index:i,turn});
  }
  return ranked.sort((a,b)=>b.turn-a.turn||a.index-b.index).slice(0,4).map(x=>x.index).sort((a,b)=>a-b);
}

function proposeSplit(contour,indices=curvatureSplitIndices(contour)){
  const clean=[...new Set(indices)].filter(i=>Number.isInteger(i)&&i>0&&i<(contour.points||[]).length-1).sort((a,b)=>a-b);
  if(!clean.length)throw new Error('Split candidate requires at least one internal split index.');
  const id=stableId('split',[contour.contourId,...clean]);
  return reviewEnvelope('SPLIT',id,[contour.contourId],{
    sourceContourId:contour.contourId,
    splitIndices:clean,
    childContourIds:Array.from({length:clean.length+1},(_v,index)=>stableId('split-child',[id,index])),
    reason:'High-curvature spans suggest a working split; AI must confirm semantic boundaries.'
  });
}

function splitCandidates(contours){
  const result=[];
  for(const contour of contours){
    const indices=curvatureSplitIndices(contour);
    if(indices.length)result.push(proposeSplit(contour,indices));
  }
  return result;
}

function primitiveProvenance(contours){
  return contours.flatMap(contour=>Object.keys(contour.fits||{}).sort().map(type=>
    reviewEnvelope('PRIMITIVE_PROVENANCE',stableId('primitive-link',[contour.contourId,type]),[contour.contourId],{
      boundaryId:contour.contourId,
      primitiveCandidateType:type,
      fitMetrics:contour.fits[type]?.metrics||{},
      promotionRule:'Evidence can seed a Working Candidate but cannot become Formal Geometry directly.'
    })
  ));
}

function analyze(rawBoundary,options={}){
  if(!rawBoundary||!Array.isArray(rawBoundary.contours))throw new Error('Raw boundary document is required.');
  const contours=rawBoundary.contours;
  const hierarchyValidation=validateHierarchy(contours);
  const hierarchy=hierarchyCandidates(contours);
  const related=relationshipCandidates(contours,options.touchTolerance??2);
  const gaps=gapBridgeCandidates(contours,options.maxGap??24);
  const splits=splitCandidates(contours);
  const mergeById=new Map();
  for(const bridge of gaps){
    const selected=bridge.evidenceIds.map(id=>contours.find(c=>c.contourId===id)).filter(Boolean);
    const candidate=proposeMerge(selected,'Gap-bridge evidence suggests a possible contour merge.');
    mergeById.set(candidate.id,candidate);
  }
  const result={
    kind:'ra-semantic-boundary-resolution',
    version:VERSION,
    caseId:rawBoundary.caseId,
    sourceBoundaryVersion:rawBoundary.version,
    formalPolicy:'All results require AI review and remain ineligible for Formal Recipe.',
    hierarchyValidation,
    hierarchyCandidates:hierarchy,
    splitCandidates:splits,
    mergeCandidates:[...mergeById.values()].sort((a,b)=>a.id.localeCompare(b.id)),
    relationshipCandidates:related.relationships,
    gapBridgeCandidates:gaps,
    crossingCandidates:related.crossings,
    occlusionCandidates:related.occlusions,
    primitiveProvenance:primitiveProvenance(contours)
  };
  result.summary={
    contourCount:contours.length,
    hierarchyCandidateCount:result.hierarchyCandidates.length,
    splitCandidateCount:result.splitCandidates.length,
    mergeCandidateCount:result.mergeCandidates.length,
    relationshipCandidateCount:result.relationshipCandidates.length,
    gapBridgeCandidateCount:result.gapBridgeCandidates.length,
    crossingCandidateCount:result.crossingCandidates.length,
    occlusionCandidateCount:result.occlusionCandidates.length,
    primitiveProvenanceCount:result.primitiveProvenance.length,
    pendingAIReviewCount:[
      result.hierarchyCandidates,result.splitCandidates,result.mergeCandidates,
      result.relationshipCandidates,result.gapBridgeCandidates,
      result.crossingCandidates,result.occlusionCandidates,result.primitiveProvenance
    ].reduce((sum,list)=>sum+list.length,0),
    formalReadyCount:0
  };
  return result;
}

return {
  VERSION,hash,stableId,validateHierarchy,bboxContains,bboxOverlap,bboxGap,
  contourIntersects,relationshipCandidates,gapBridgeCandidates,
  proposeSplit,proposeMerge,analyze
};
});
