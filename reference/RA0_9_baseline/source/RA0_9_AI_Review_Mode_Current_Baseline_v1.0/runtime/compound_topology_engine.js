(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.RACompoundTopology=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';

const VERSION='1.0';
const clone=value=>JSON.parse(JSON.stringify(value));
const round=(value,digits=6)=>Number(Number(value).toFixed(digits));
const finite=value=>Number.isFinite(Number(value));

function hash(text){
  let value=0x811c9dc5;
  for(let index=0;index<text.length;index++){
    value^=text.charCodeAt(index);
    value=Math.imul(value,0x01000193)>>>0;
  }
  return value.toString(16).padStart(8,'0');
}

function stableId(kind,parts){
  return `ct-${kind.toLowerCase()}-${hash(`${kind}|${parts.flat().map(String).sort().join('|')}`)}`;
}

function point(value,label='point'){
  if(!value||!finite(value.x)||!finite(value.y))throw new Error(`${label} requires finite x/y.`);
  return {x:Number(value.x),y:Number(value.y)};
}

function add(a,b){return {x:a.x+b.x,y:a.y+b.y};}
function subtract(a,b){return {x:a.x-b.x,y:a.y-b.y};}
function scale(value,factor){return {x:value.x*factor,y:value.y*factor};}
function length(value){return Math.hypot(value.x,value.y);}
function normalize(value,label='vector'){
  const magnitude=length(value);
  if(magnitude<1e-12)throw new Error(`${label} is degenerate.`);
  return {x:value.x/magnitude,y:value.y/magnitude};
}
function normal(value){return {x:-value.y,y:value.x};}
function cross(a,b){return a.x*b.y-a.y*b.x;}
function distance(a,b){return length(subtract(a,b));}
function angleErrorDeg(a,b){
  const left=normalize(a),right=normalize(b);
  return Math.acos(Math.max(-1,Math.min(1,left.x*right.x+left.y*right.y)))*180/Math.PI;
}

function typeOf(segment){return String(segment.type||segment.candidateType).toUpperCase();}
function parametersOf(segment){return segment.parameters||segment;}
function directionSign(parameters){
  if(finite(parameters.sweepDeg))return Number(parameters.sweepDeg)>=0?1:-1;
  return parameters.clockwiseScreen===false?-1:1;
}

function cubicCurvature(p0,p1,p2,p3,atEnd=false){
  const first=atEnd?scale(subtract(p3,p2),3):scale(subtract(p1,p0),3);
  const second=atEnd
    ?scale(add(subtract(p1,scale(p2,2)),p3),6)
    :scale(add(subtract(p0,scale(p1,2)),p2),6);
  const denominator=length(first)**3;
  return denominator<1e-12?0:cross(first,second)/denominator;
}

function endpointState(segment,where){
  const type=typeOf(segment),parameters=parametersOf(segment),atEnd=where==='end';
  if(type==='LINE'){
    const start=point(parameters.start,'LINE start'),end=point(parameters.end,'LINE end');
    return {point:atEnd?end:start,tangent:normalize(subtract(end,start)),curvature:0};
  }
  if(type==='ARC'){
    const center=point(parameters.center,'ARC center'),radius=Number(parameters.radius);
    if(!finite(radius)||radius<=0)throw new Error('ARC radius must be positive.');
    const angle=Number(atEnd?parameters.endAngleDeg:parameters.startAngleDeg)*Math.PI/180;
    const radial={x:Math.cos(angle),y:Math.sin(angle)},sign=directionSign(parameters);
    return {
      point:add(center,scale(radial,radius)),
      tangent:scale({x:-radial.y,y:radial.x},sign),
      curvature:sign/radius
    };
  }
  if(type==='SPLINE'){
    const p0=point(parameters.p0,'Spline p0'),p1=point(parameters.p1,'Spline p1');
    const p2=point(parameters.p2,'Spline p2'),p3=point(parameters.p3,'Spline p3');
    return {
      point:atEnd?p3:p0,
      tangent:normalize(atEnd?subtract(p3,p2):subtract(p1,p0)),
      curvature:cubicCurvature(p0,p1,p2,p3,atEnd)
    };
  }
  throw new Error(`Unsupported Compound segment type: ${type}`);
}

function analyzeCompound(compound,options={}){
  const segments=compound?.segments||[];
  if(segments.length<2)throw new Error('Compound path requires at least two segments.');
  const tolerance={
    g0:Number(options.g0Tolerance??0.5),
    g1:Number(options.g1ToleranceDeg??2),
    g2:Number(options.g2Tolerance??0.005)
  };
  const joins=[];
  for(let index=0;index<segments.length-1;index++){
    const left=endpointState(segments[index],'end');
    const right=endpointState(segments[index+1],'start');
    const gap=distance(left.point,right.point);
    const tangentError=angleErrorDeg(left.tangent,right.tangent);
    const curvatureError=Math.abs(left.curvature-right.curvature);
    const achieved=gap>tolerance.g0?'NONE':tangentError>tolerance.g1?'G0':curvatureError>tolerance.g2?'G1':'G2';
    joins.push({
      id:stableId('join',[segments[index].id,segments[index+1].id]),
      leftSegmentId:segments[index].id,
      rightSegmentId:segments[index+1].id,
      gap:round(gap),
      tangentErrorDeg:round(tangentError),
      curvatureError:round(curvatureError,9),
      achieved,
      g0Passed:gap<=tolerance.g0,
      g1Passed:gap<=tolerance.g0&&tangentError<=tolerance.g1,
      g2Passed:gap<=tolerance.g0&&tangentError<=tolerance.g1&&curvatureError<=tolerance.g2
    });
  }
  return {
    valid:joins.every(join=>join.g0Passed),
    joins,
    minimumContinuity:joins.every(join=>join.g2Passed)?'G2':joins.every(join=>join.g1Passed)?'G1':joins.every(join=>join.g0Passed)?'G0':'NONE',
    tolerance
  };
}

function setStartState(segment,target,targetLevel){
  const output=clone(segment),parameters=parametersOf(output),type=typeOf(output);
  if(type==='LINE'){
    const oldStart=point(parameters.start),oldEnd=point(parameters.end);
    const segmentLength=distance(oldStart,oldEnd);
    parameters.start={x:round(target.point.x),y:round(target.point.y)};
    parameters.end=targetLevel==='G0'
      ?{x:round(oldEnd.x),y:round(oldEnd.y)}
      :{x:round(target.point.x+target.tangent.x*segmentLength),y:round(target.point.y+target.tangent.y*segmentLength)};
  }else if(type==='ARC'){
    const radius=Number(parameters.radius),sign=directionSign(parameters);
    if(!finite(radius)||radius<=0)throw new Error('ARC radius must be positive.');
    if(targetLevel==='G0'){
      const center=point(parameters.center);
      parameters.startAngleDeg=round(Math.atan2(target.point.y-center.y,target.point.x-center.x)*180/Math.PI);
    }else{
      const radial=scale({x:target.tangent.y,y:-target.tangent.x},sign);
      parameters.center={
        x:round(target.point.x-radial.x*radius),
        y:round(target.point.y-radial.y*radius)
      };
      parameters.startAngleDeg=round(Math.atan2(radial.y,radial.x)*180/Math.PI);
    }
    if(finite(parameters.sweepDeg))parameters.endAngleDeg=round(Number(parameters.startAngleDeg)+Number(parameters.sweepDeg));
  }else if(type==='SPLINE'){
    const oldP0=point(parameters.p0),oldP1=point(parameters.p1),oldP2=point(parameters.p2);
    const handle=Math.max(1e-6,distance(oldP0,oldP1));
    parameters.p0={x:round(target.point.x),y:round(target.point.y)};
    if(targetLevel!=='G0'){
      parameters.p1={
        x:round(target.point.x+target.tangent.x*handle),
        y:round(target.point.y+target.tangent.y*handle)
      };
      if(targetLevel==='G2'){
        const tangent=normalize(target.tangent),leftNormal=normal(tangent);
        const p0=point(parameters.p0),p1=point(parameters.p1);
        const existingQ=add(subtract(p0,scale(p1,2)),oldP2);
        const tangentComponent=scale(tangent,existingQ.x*tangent.x+existingQ.y*tangent.y);
        const normalComponent=scale(leftNormal,1.5*target.curvature*handle*handle);
        const q=add(tangentComponent,normalComponent);
        const p2=add(subtract(scale(p1,2),p0),q);
        parameters.p2={x:round(p2.x),y:round(p2.y)};
      }
    }
  }
  return output;
}

function reconcileCompound(compound,targetLevel='G1',options={}){
  if(!['G0','G1','G2'].includes(targetLevel))throw new Error('Target continuity must be G0, G1 or G2.');
  const output=clone(compound);
  if(!Array.isArray(output.segments)||output.segments.length<2)throw new Error('Compound path requires at least two segments.');
  const unresolved=[];
  for(let index=0;index<output.segments.length-1;index++){
    const target=endpointState(output.segments[index],'end');
    const nextType=typeOf(output.segments[index+1]);
    if(targetLevel==='G2'&&nextType!=='SPLINE'){
      const next=endpointState(output.segments[index+1],'start');
      if(Math.abs(target.curvature-next.curvature)>Number(options.g2Tolerance??0.005)){
        unresolved.push({
          joinIndex:index,
          reason:`G2 repair for ${nextType} would require changing its native curvature.`
        });
      }
    }
    output.segments[index+1]=setStartState(output.segments[index+1],target,targetLevel);
  }
  const analysis=analyzeCompound(output,options);
  return {compound:output,analysis,unresolved,targetLevel};
}

function offsetSegment(segment,distanceValue){
  const output=clone(segment),parameters=parametersOf(output),type=typeOf(output),offset=Number(distanceValue);
  if(!finite(offset))throw new Error('Compound Offset distance must be finite.');
  if(type==='LINE'){
    const start=point(parameters.start),end=point(parameters.end),n=normal(normalize(subtract(end,start)));
    parameters.start={x:round(start.x+n.x*offset),y:round(start.y+n.y*offset)};
    parameters.end={x:round(end.x+n.x*offset),y:round(end.y+n.y*offset)};
  }else if(type==='ARC'){
    const next=Number(parameters.radius)+offset*directionSign(parameters);
    if(next<=0)throw new Error('Compound Offset produced a non-positive ARC radius.');
    parameters.radius=round(next);
  }else if(type==='SPLINE'){
    const startState=endpointState(output,'start'),endState=endpointState(output,'end');
    const startNormal=normal(startState.tangent),endNormal=normal(endState.tangent);
    for(const key of ['p0','p1']){
      const value=point(parameters[key]);
      parameters[key]={x:round(value.x+startNormal.x*offset),y:round(value.y+startNormal.y*offset)};
    }
    for(const key of ['p2','p3']){
      const value=point(parameters[key]);
      parameters[key]={x:round(value.x+endNormal.x*offset),y:round(value.y+endNormal.y*offset)};
    }
  }
  return output;
}

function reviewEnvelope(kind,id,evidenceIds,payload={}){
  return {
    id,kind,...payload,
    evidenceIds:[...new Set(evidenceIds)].sort(),
    reviewState:'AUTO_PROPOSED',decisionState:'unresolved',
    recipeEligible:false,formalPromotionBlocked:true,requiresAIReview:true,requiresRescore:true,
    provenance:{sourceKind:'semantic-geometry',algorithm:'RA Compound and Topology Engine',algorithmVersion:VERSION}
  };
}

function proposeCompound(compound,options={}){
  const analysis=analyzeCompound(compound,options);
  const ids=compound.segments.map(segment=>segment.id);
  return reviewEnvelope('COMPOUND_PATH',compound.id||stableId('compound',ids),ids,{
    segments:clone(compound.segments),
    continuity:analysis,
    requestedContinuity:options.requestedContinuity||'G1'
  });
}

function offsetCompound(compound,offsets,options={}){
  if(!Array.isArray(offsets)||!offsets.length||!offsets.every(finite))throw new Error('Compound Offset requires finite offsets.');
  const members=[],unresolved=[];
  for(const value of offsets){
    const raw={
      id:stableId('offset-member',[compound.id,value]),
      segments:compound.segments.map(segment=>offsetSegment(segment,Number(value)))
    };
    const repaired=reconcileCompound(raw,options.targetContinuity||'G1',options);
    members.push({offset:Number(value),compound:repaired.compound,continuity:repaired.analysis});
    unresolved.push(...repaired.unresolved.map(item=>({...item,offset:Number(value)})));
  }
  return reviewEnvelope('COMPOUND_OFFSET',stableId('compound-offset',[compound.id,...offsets]),[
    compound.id,...compound.segments.map(segment=>segment.id)
  ],{
    sourceCompoundId:compound.id,
    offsets:[...offsets].map(Number),
    members,
    requestedContinuity:options.targetContinuity||'G1',
    unresolved,
    allPassed:members.every(member=>{
      const level=options.targetContinuity||'G1';
      return member.continuity.joins.every(join=>join[`${level.toLowerCase()}Passed`]);
    })
  });
}

function proposeCrossing(pathA,pathB,crossingPoint,evidence={},decision={}){
  if(!pathA||!pathB||pathA===pathB)throw new Error('Crossing requires two distinct paths.');
  const location=point(crossingPoint,'crossing point');
  const ids=[pathA,pathB],connected=decision.connectedJunction===true;
  let crossingState='UNRESOLVED',overPath=null,underPath=null,mask=null;
  if(connected)crossingState='CONNECTED_JUNCTION';
  else if(decision.overPath){
    if(!ids.includes(decision.overPath))throw new Error('overPath must reference one crossing path.');
    overPath=decision.overPath;
    underPath=ids.find(id=>id!==overPath);
    const radius=Number(decision.maskRadius??6);
    if(!finite(radius)||radius<=0)throw new Error('Crossing mask radius must be positive.');
    mask={kind:'LOCAL_GAP_MASK',center:location,radius};
    crossingState='OVER_UNDER';
  }
  return reviewEnvelope('CROSSING',stableId('crossing',[...ids,location.x,location.y]),ids,{
    pathA,pathB,point:location,crossingState,connectedJunction:connected,
    overPath,underPath,mask,zOrderEvidence:clone(evidence),reason:decision.reason||'Topology requires AI confirmation.'
  });
}

function topologicalDrawOrder(paths,edges){
  const ids=[...new Set(paths)].sort(),incoming=new Map(ids.map(id=>[id,0])),outgoing=new Map(ids.map(id=>[id,[]]));
  for(const [before,after] of edges){
    if(!incoming.has(before)||!incoming.has(after))throw new Error('Draw-order edge references an unknown path.');
    outgoing.get(before).push(after);
    incoming.set(after,incoming.get(after)+1);
  }
  const queue=ids.filter(id=>incoming.get(id)===0).sort(),order=[];
  while(queue.length){
    const id=queue.shift();order.push(id);
    for(const next of outgoing.get(id).sort()){
      incoming.set(next,incoming.get(next)-1);
      if(incoming.get(next)===0){queue.push(next);queue.sort();}
    }
  }
  if(order.length!==ids.length)throw new Error('Occlusion / draw-order cycle detected.');
  return order;
}

function buildWeaveGraph(pathIds,crossings){
  const paths=[...new Set(pathIds)].sort(),seen=new Set(),invalid=[],unresolved=[],edges=[];
  for(const crossing of crossings){
    if(seen.has(crossing.id))invalid.push({crossingId:crossing.id,reason:'duplicate crossing id'});
    seen.add(crossing.id);
    if(!paths.includes(crossing.pathA)||!paths.includes(crossing.pathB))invalid.push({crossingId:crossing.id,reason:'unknown path'});
    if(crossing.crossingState==='UNRESOLVED')unresolved.push(crossing.id);
    if(crossing.crossingState==='OVER_UNDER'){
      if(!crossing.overPath||!crossing.underPath||!crossing.mask)invalid.push({crossingId:crossing.id,reason:'over/under mask incomplete'});
      else edges.push([crossing.underPath,crossing.overPath]);
    }
  }
  let drawOrder=[],cycle=null;
  try{drawOrder=topologicalDrawOrder(paths,edges);}
  catch(error){cycle=error.message;}
  return {
    kind:'weaveGraph',paths,crossingIds:crossings.map(item=>item.id).sort(),
    occlusionEdges:edges,drawOrder,unresolvedCrossingIds:unresolved.sort(),
    validation:{valid:invalid.length===0&&!cycle,invalid,cycle}
  };
}

function compileCrossingOperations(crossing,confirmedReview){
  if(confirmedReview?.state!=='AI_CONFIRMED')throw new Error('Crossing operations require AI_CONFIRMED review.');
  if(crossing.crossingState==='CONNECTED_JUNCTION'){
    return {crossingId:crossing.id,operations:[{op:'JOIN_PATHS',paths:[crossing.pathA,crossing.pathB],point:crossing.point}]};
  }
  if(crossing.crossingState!=='OVER_UNDER'||!crossing.mask)throw new Error('Unresolved crossing cannot compile topology operations.');
  return {
    crossingId:crossing.id,
    operations:[
      {op:'DRAW_PATH',pathId:crossing.underPath},
      {op:'LOCAL_MASK',pathId:crossing.underPath,mask:clone(crossing.mask)},
      {op:'DRAW_PATH',pathId:crossing.overPath}
    ]
  };
}

function buildDocument(caseId,compounds=[],offsets=[],crossings=[],pathIds=[]){
  const weaveGraph=buildWeaveGraph(pathIds,crossings);
  return {
    kind:'ra-compound-topology-document',version:VERSION,caseId,
    compoundCandidates:clone(compounds).sort((a,b)=>a.id.localeCompare(b.id)),
    compoundOffsetCandidates:clone(offsets).sort((a,b)=>a.id.localeCompare(b.id)),
    topologyCandidates:clone(crossings).sort((a,b)=>a.id.localeCompare(b.id)),
    weaveGraph,
    summary:{
      compoundCount:compounds.length,
      compoundOffsetCount:offsets.length,
      crossingCount:crossings.length,
      unresolvedCrossingCount:weaveGraph.unresolvedCrossingIds.length,
      topologyValid:weaveGraph.validation.valid,
      formalReadyCount:0
    }
  };
}

return {
  VERSION,stableId,point,endpointState,analyzeCompound,reconcileCompound,
  offsetSegment,proposeCompound,offsetCompound,proposeCrossing,
  topologicalDrawOrder,buildWeaveGraph,compileCrossingOperations,buildDocument
};
});
