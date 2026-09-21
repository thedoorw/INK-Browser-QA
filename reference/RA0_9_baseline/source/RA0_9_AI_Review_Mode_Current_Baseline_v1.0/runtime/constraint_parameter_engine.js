(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.RAConstraintParameters=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';

const VERSION='1.0';
const TYPES=Object.freeze([
  'CONCENTRIC','EQUAL_RADIUS','PARALLEL','PERPENDICULAR','TANGENT',
  'EQUAL_SPACING','SHARED_PITCH','SHARED_CENTER','SHARED_AXIS',
  'SHARED_ANGLE','SHARED_COUNT'
]);
const round=(value,digits=6)=>Number(Number(value).toFixed(digits));
const clone=value=>JSON.parse(JSON.stringify(value));
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
  const normalized=parts.flat().map(String).sort().join('|');
  return `cp-${kind.toLowerCase()}-${hash(`${kind}|${normalized}`)}`;
}

function center(member){
  const value=member?.parameters?.center||member?.center;
  if(!value||!finite(value.x)||!finite(value.y))throw new Error(`${member?.id||'member'} has no finite center.`);
  return {x:Number(value.x),y:Number(value.y)};
}

function radius(member){
  const value=member?.parameters?.radius??member?.radius;
  if(!finite(value)||Number(value)<=0)throw new Error(`${member?.id||'member'} has no valid radius.`);
  return Number(value);
}

function lineEndpoints(member){
  const start=member?.parameters?.start||member?.start;
  const end=member?.parameters?.end||member?.end;
  if(!start||!end||![start.x,start.y,end.x,end.y].every(finite))throw new Error(`${member?.id||'member'} has no finite LINE endpoints.`);
  return {start:{x:Number(start.x),y:Number(start.y)},end:{x:Number(end.x),y:Number(end.y)}};
}

function lineAngle(member){
  const explicit=member?.parameters?.angleDeg;
  if(finite(explicit))return ((Number(explicit)%180)+180)%180;
  const {start,end}=lineEndpoints(member);
  return ((Math.atan2(end.y-start.y,end.x-start.x)*180/Math.PI%180)+180)%180;
}

function angleDifference(a,b){
  const difference=Math.abs(a-b)%180;
  return Math.min(difference,180-difference);
}

function pointLineDistance(point,line){
  const {start,end}=lineEndpoints(line);
  const dx=end.x-start.x,dy=end.y-start.y;
  const length=Math.hypot(dx,dy);
  if(length<1e-9)throw new Error(`${line.id||'line'} is degenerate.`);
  return Math.abs((point.x-start.x)*dy-(point.y-start.y)*dx)/length;
}

function pairKey(a,b){
  return [a,b].sort().join('|');
}

function mean(values){
  return values.reduce((sum,value)=>sum+value,0)/values.length;
}

function maxDeviation(values,target=mean(values)){
  return Math.max(...values.map(value=>Math.abs(value-target)));
}

function evaluate(type,members,options={}){
  if(!TYPES.includes(type))throw new Error(`Unsupported constraint type: ${type}`);
  if(!Array.isArray(members)||members.length<2)throw new Error(`${type} requires at least two members.`);
  const threshold=Number(options.tolerance??({
    CONCENTRIC:2,EQUAL_RADIUS:2,PARALLEL:2,PERPENDICULAR:2,TANGENT:2,
    EQUAL_SPACING:2,SHARED_PITCH:2,SHARED_CENTER:2,SHARED_AXIS:2,
    SHARED_ANGLE:2,SHARED_COUNT:0
  }[type]));
  let residual=Infinity,metrics={},suggestedValue=null;
  if(['CONCENTRIC','SHARED_CENTER'].includes(type)){
    const centers=members.map(center);
    const average={x:mean(centers.map(value=>value.x)),y:mean(centers.map(value=>value.y))};
    residual=Math.max(...centers.map(value=>Math.hypot(value.x-average.x,value.y-average.y)));
    suggestedValue={x:round(average.x),y:round(average.y)};
    metrics={centers,maxCenterDeviation:round(residual)};
  }else if(type==='EQUAL_RADIUS'){
    const radii=members.map(radius);
    suggestedValue=round(mean(radii));
    residual=maxDeviation(radii,suggestedValue);
    metrics={radii:radii.map(round),meanRadius:suggestedValue,maxRadiusDeviation:round(residual)};
  }else if(['PARALLEL','SHARED_ANGLE','SHARED_AXIS'].includes(type)){
    const angles=members.map(lineAngle);
    const reference=angles[0];
    residual=Math.max(...angles.map(value=>angleDifference(value,reference)));
    suggestedValue=round(mean(angles));
    metrics={angles:angles.map(round),maxAngleErrorDeg:round(residual)};
  }else if(type==='PERPENDICULAR'){
    if(members.length!==2)throw new Error('PERPENDICULAR requires exactly two LINE members.');
    const angles=members.map(lineAngle);
    residual=Math.abs(90-angleDifference(angles[0],angles[1]));
    metrics={angles:angles.map(round),perpendicularErrorDeg:round(residual)};
  }else if(type==='TANGENT'){
    if(members.length!==2)throw new Error('TANGENT requires exactly two members.');
    const line=members.find(member=>String(member.candidateType||member.type).toUpperCase()==='LINE');
    const curve=members.find(member=>['ARC','CIRCLE'].includes(String(member.candidateType||member.type).toUpperCase()));
    if(!line||!curve)throw new Error('TANGENT currently requires one LINE and one ARC/CIRCLE.');
    const distance=pointLineDistance(center(curve),line);
    const curveRadius=radius(curve);
    residual=Math.abs(distance-curveRadius);
    metrics={centerDistance:round(distance),radius:round(curveRadius),tangentResidual:round(residual)};
  }else if(['EQUAL_SPACING','SHARED_PITCH'].includes(type)){
    if(members.length<3)throw new Error(`${type} requires at least three LINE members.`);
    const baseAngle=lineAngle(members[0])*Math.PI/180;
    const normal={x:-Math.sin(baseAngle),y:Math.cos(baseAngle)};
    const angleErrors=members.map(member=>angleDifference(lineAngle(member),lineAngle(members[0])));
    const offsets=members.map(member=>{
      const {start}=lineEndpoints(member);
      return start.x*normal.x+start.y*normal.y;
    }).sort((a,b)=>a-b);
    const gaps=offsets.slice(1).map((value,index)=>value-offsets[index]);
    const pitch=mean(gaps);
    residual=Math.max(maxDeviation(gaps,pitch),Math.max(...angleErrors));
    suggestedValue=round(pitch);
    metrics={
      offsets:offsets.map(round),gaps:gaps.map(round),meanPitch:suggestedValue,
      maxGapDeviation:round(maxDeviation(gaps,pitch)),maxAngleErrorDeg:round(Math.max(...angleErrors))
    };
  }else if(type==='SHARED_COUNT'){
    const counts=members.map(member=>Number(member?.parameters?.count??member?.count));
    if(!counts.every(value=>Number.isInteger(value)&&value>0))throw new Error('SHARED_COUNT requires positive integer counts.');
    suggestedValue=Math.round(mean(counts));
    residual=maxDeviation(counts,suggestedValue);
    metrics={counts,meanCount:suggestedValue,maxCountDeviation:residual};
  }
  return {
    passed:residual<=threshold,
    residual:round(residual),
    tolerance:round(threshold),
    suggestedValue,
    metrics
  };
}

function reviewEnvelope(kind,id,evidenceIds,payload={}){
  return {
    id,kind,...payload,
    evidenceIds:[...new Set(evidenceIds)].sort(),
    reviewState:'AUTO_PROPOSED',
    decisionState:'unresolved',
    recipeEligible:false,
    formalPromotionBlocked:true,
    requiresAIReview:true,
    requiresRescore:true,
    provenance:{
      sourceKind:'measured-geometry',
      algorithm:'RA Constraint and Shared Parameter Engine',
      algorithmVersion:VERSION
    }
  };
}

function proposeConstraint(type,members,options={}){
  const ids=members.map(member=>member.id).filter(Boolean);
  if(ids.length!==members.length)throw new Error('Every constraint member requires a stable id.');
  const evaluation=evaluate(type,members,options);
  return reviewEnvelope('CONSTRAINT',stableId(type,ids),ids,{
    constraintType:type,
    memberIds:[...ids].sort(),
    evaluation,
    conflictState:evaluation.passed?'NONE':'RESIDUAL_EXCEEDS_TOLERANCE',
    reason:evaluation.passed
      ?`${type} residual is within the working tolerance.`
      :`${type} residual exceeds the working tolerance; keep unresolved or modify members.`
  });
}

function sharedParameterKind(constraintType){
  return ({
    CONCENTRIC:'center',SHARED_CENTER:'center',EQUAL_RADIUS:'radius',
    PARALLEL:'angle',SHARED_ANGLE:'angle',SHARED_AXIS:'axis',
    EQUAL_SPACING:'pitch',SHARED_PITCH:'pitch',SHARED_COUNT:'count'
  })[constraintType]||null;
}

function promoteSharedParameter(constraint,confirmedReview){
  if(!constraint||constraint.kind!=='CONSTRAINT')throw new Error('Constraint candidate is required.');
  if(confirmedReview?.state!=='AI_CONFIRMED')throw new Error('Shared Parameter promotion requires AI_CONFIRMED constraint review.');
  if(!constraint.evaluation?.passed)throw new Error('Constraint residual must pass before Shared Parameter proposal.');
  const parameterKind=sharedParameterKind(constraint.constraintType);
  if(!parameterKind)throw new Error(`${constraint.constraintType} does not define a Shared Parameter.`);
  return reviewEnvelope('SHARED_PARAMETER',stableId(`shared-${parameterKind}`,constraint.memberIds),[
    constraint.id,...constraint.evidenceIds
  ],{
    parameterKind,
    memberIds:[...constraint.memberIds],
    value:clone(constraint.evaluation.suggestedValue),
    sourceConstraintId:constraint.id,
    sourceReviewId:confirmedReview.reviewId,
    reason:'AI-confirmed constraint may seed a shared parameter; the new proposal requires its own review.'
  });
}

function detectConflicts(constraints=[],sharedParameters=[],options={}){
  const tolerance=Number(options.tolerance??1e-6);
  const conflicts=[];
  const byPair=new Map();
  for(const constraint of constraints){
    const members=constraint.memberIds||[];
    if(members.length===2){
      const key=pairKey(...members);
      const previous=byPair.get(key)||[];
      previous.push(constraint);
      byPair.set(key,previous);
    }
  }
  for(const [members,items] of byPair){
    const types=new Set(items.map(item=>item.constraintType));
    if(types.has('PARALLEL')&&types.has('PERPENDICULAR')){
      conflicts.push({
        id:stableId('conflict-parallel-perpendicular',[members]),
        type:'INCOMPATIBLE_RELATIONSHIPS',
        constraintIds:items.filter(item=>['PARALLEL','PERPENDICULAR'].includes(item.constraintType)).map(item=>item.id).sort(),
        memberKey:members
      });
    }
  }
  const assignments=new Map();
  for(const parameter of sharedParameters){
    const key=`${parameter.parameterKind}|${[...(parameter.memberIds||[])].sort().join('|')}`;
    const values=assignments.get(key)||[];
    values.push(parameter);
    assignments.set(key,values);
  }
  for(const [key,items] of assignments){
    for(let left=0;left<items.length;left++)for(let right=left+1;right<items.length;right++){
      const a=items[left].value,b=items[right].value;
      const delta=typeof a==='number'&&typeof b==='number'
        ?Math.abs(a-b)
        :Math.hypot(Number(a?.x)-Number(b?.x),Number(a?.y)-Number(b?.y));
      if(finite(delta)&&delta>tolerance){
        conflicts.push({
          id:stableId('conflict-shared-value',[items[left].id,items[right].id]),
          type:'SHARED_PARAMETER_VALUE_CONFLICT',
          parameterIds:[items[left].id,items[right].id].sort(),
          assignmentKey:key,
          residual:round(delta)
        });
      }
    }
  }
  conflicts.sort((a,b)=>a.id.localeCompare(b.id));
  return {valid:conflicts.length===0,conflicts};
}

function buildDocument(caseId,constraints=[],sharedParameters=[]){
  const conflictValidation=detectConflicts(constraints,sharedParameters);
  return {
    kind:'ra-constraint-parameter-document',
    version:VERSION,
    caseId,
    constraintCandidates:clone(constraints).sort((a,b)=>a.id.localeCompare(b.id)),
    sharedParameterCandidates:clone(sharedParameters).sort((a,b)=>a.id.localeCompare(b.id)),
    conflictValidation,
    summary:{
      constraintCount:constraints.length,
      sharedParameterCount:sharedParameters.length,
      passingResidualCount:constraints.filter(item=>item.evaluation?.passed).length,
      conflictCount:conflictValidation.conflicts.length,
      formalReadyCount:0
    }
  };
}

return {
  VERSION,TYPES,stableId,center,radius,lineEndpoints,lineAngle,angleDifference,
  evaluate,proposeConstraint,promoteSharedParameter,detectConflicts,buildDocument
};
});
