(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.RAGeneratorAuthoring=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';

const VERSION='1.0';
const TYPES=Object.freeze([
  'CONCENTRIC_ARC_FIELD','PARALLEL_PATH_FIELD','OFFSET',
  'ARRAY','MIRROR','ROTATION','RADIUS_SEQUENCE'
]);
const clone=value=>JSON.parse(JSON.stringify(value));
const round=(value,digits=6)=>Number(Number(value).toFixed(digits));
const finite=value=>Number.isFinite(Number(value));

function canonical(value){
  if(Array.isArray(value))return `[${value.map(canonical).join(',')}]`;
  if(value&&typeof value==='object'){
    return `{${Object.keys(value).sort().map(key=>`${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function hash(text){
  let value=0x811c9dc5;
  for(let index=0;index<text.length;index++){
    value^=text.charCodeAt(index);
    value=Math.imul(value,0x01000193)>>>0;
  }
  return value.toString(16).padStart(8,'0');
}

function stableId(type,sourceIds,parameters){
  return `gen-${type.toLowerCase().replaceAll('_','-')}-${hash(`${type}|${[...sourceIds].sort().join('|')}|${canonical(parameters)}`)}`;
}

function validatePoint(point,label='point'){
  if(!point||!finite(point.x)||!finite(point.y))throw new Error(`${label} must contain finite x/y.`);
  return {x:Number(point.x),y:Number(point.y)};
}

function validatePrimitive(primitive){
  if(!primitive?.type&&!primitive?.candidateType)throw new Error('Primitive type is required.');
  if(!primitive.id)throw new Error('Primitive id is required.');
  return primitive;
}

function primitiveType(primitive){
  return String(primitive.type||primitive.candidateType).toUpperCase();
}

function parametersOf(primitive){
  return primitive.parameters||primitive;
}

function offsetPrimitive(primitive,distance){
  validatePrimitive(primitive);
  if(!finite(distance))throw new Error('Offset distance must be finite.');
  const output=clone(primitive),parameters=parametersOf(output),type=primitiveType(output);
  if(type==='LINE'){
    const start=validatePoint(parameters.start,'LINE start');
    const end=validatePoint(parameters.end,'LINE end');
    const dx=end.x-start.x,dy=end.y-start.y,length=Math.hypot(dx,dy);
    if(length<1e-9)throw new Error('Cannot offset a degenerate LINE.');
    const normal={x:-dy/length,y:dx/length};
    parameters.start={x:round(start.x+normal.x*distance),y:round(start.y+normal.y*distance)};
    parameters.end={x:round(end.x+normal.x*distance),y:round(end.y+normal.y*distance)};
  }else if(['CIRCLE','ARC'].includes(type)){
    const radius=Number(parameters.radius);
    if(!finite(radius)||radius+Number(distance)<=0)throw new Error('Offset radius must stay positive.');
    parameters.radius=round(radius+Number(distance));
  }else{
    throw new Error(`Exact Offset is not implemented for ${type}; keep the Generator unresolved.`);
  }
  return output;
}

function translatePrimitive(primitive,dx,dy){
  const output=clone(primitive),parameters=parametersOf(output);
  const translate=point=>({x:round(Number(point.x)+dx),y:round(Number(point.y)+dy)});
  if(parameters.start)parameters.start=translate(parameters.start);
  if(parameters.end)parameters.end=translate(parameters.end);
  if(parameters.center)parameters.center=translate(parameters.center);
  for(const key of ['p0','p1','p2','p3'])if(parameters[key])parameters[key]=translate(parameters[key]);
  return output;
}

function mirrorPoint(point,axis){
  const value=Number(axis.value);
  if(axis.kind==='vertical')return {x:round(2*value-point.x),y:round(point.y)};
  if(axis.kind==='horizontal')return {x:round(point.x),y:round(2*value-point.y)};
  throw new Error('Mirror axis must be vertical or horizontal.');
}

function mirrorPrimitive(primitive,axis){
  const output=clone(primitive),parameters=parametersOf(output);
  const apply=point=>mirrorPoint(validatePoint(point),axis);
  if(parameters.start)parameters.start=apply(parameters.start);
  if(parameters.end)parameters.end=apply(parameters.end);
  if(parameters.center)parameters.center=apply(parameters.center);
  for(const key of ['p0','p1','p2','p3'])if(parameters[key])parameters[key]=apply(parameters[key]);
  if(finite(parameters.startAngleDeg)){
    const transform=angle=>axis.kind==='vertical'?180-Number(angle):-Number(angle);
    parameters.startAngleDeg=round(transform(parameters.startAngleDeg));
    parameters.endAngleDeg=round(transform(parameters.endAngleDeg));
    if(finite(parameters.sweepDeg))parameters.sweepDeg=round(-Number(parameters.sweepDeg));
  }
  return output;
}

function rotatePoint(point,center,angleDeg){
  const angle=Number(angleDeg)*Math.PI/180,c=Math.cos(angle),s=Math.sin(angle);
  const dx=point.x-center.x,dy=point.y-center.y;
  return {x:round(center.x+dx*c-dy*s),y:round(center.y+dx*s+dy*c)};
}

function rotatePrimitive(primitive,center,angleDeg){
  const output=clone(primitive),parameters=parametersOf(output);
  const apply=point=>rotatePoint(validatePoint(point),center,angleDeg);
  if(parameters.start)parameters.start=apply(parameters.start);
  if(parameters.end)parameters.end=apply(parameters.end);
  if(parameters.center)parameters.center=apply(parameters.center);
  for(const key of ['p0','p1','p2','p3'])if(parameters[key])parameters[key]=apply(parameters[key]);
  for(const key of ['angleDeg','startAngleDeg','endAngleDeg'])if(finite(parameters[key]))parameters[key]=round(Number(parameters[key])+Number(angleDeg));
  return output;
}

function validate(type,parameters){
  if(!TYPES.includes(type))throw new Error(`Unsupported Generator type: ${type}`);
  if(!parameters||typeof parameters!=='object')throw new Error('Generator parameters are required.');
  if(['CONCENTRIC_ARC_FIELD','RADIUS_SEQUENCE'].includes(type)){
    const centers=parameters.centers||[parameters.center];
    if(!centers.length)throw new Error(`${type} requires at least one center.`);
    centers.forEach((point,index)=>validatePoint(point,`center ${index}`));
    const radius=parameters.radius||{};
    if(!finite(radius.start)||!finite(radius.step)||!Number.isInteger(radius.count)||radius.count<1)throw new Error('Radius sequence requires finite start/step and positive integer count.');
    if(Number(radius.start)<=0||Number(radius.start)+Number(radius.step)*(radius.count-1)<=0)throw new Error('All generated radii must stay positive.');
  }else if(type==='PARALLEL_PATH_FIELD'){
    if(!Array.isArray(parameters.basePath)||!parameters.basePath.length)throw new Error('ParallelPathField requires basePath primitives.');
    parameters.basePath.forEach(validatePrimitive);
    if(!Array.isArray(parameters.offsets)||!parameters.offsets.length||!parameters.offsets.every(finite))throw new Error('ParallelPathField requires finite offsets.');
  }else if(type==='OFFSET'){
    validatePrimitive(parameters.primitive);
    if(!finite(parameters.distance))throw new Error('Offset requires a finite distance.');
  }else if(type==='ARRAY'){
    if(!Array.isArray(parameters.primitives)||!parameters.primitives.length)throw new Error('Array requires primitives.');
    parameters.primitives.forEach(validatePrimitive);
    if(parameters.mode==='grid'){
      if(!Number.isInteger(parameters.rows)||parameters.rows<1||!Number.isInteger(parameters.columns)||parameters.columns<1)throw new Error('Grid Array requires positive rows and columns.');
    }else if(!Number.isInteger(parameters.count)||parameters.count<1||!finite(parameters.dx)||!finite(parameters.dy)){
      throw new Error('Translation Array requires count, dx and dy.');
    }
  }else if(type==='MIRROR'){
    if(!Array.isArray(parameters.primitives)||!parameters.primitives.length)throw new Error('Mirror requires primitives.');
    parameters.primitives.forEach(validatePrimitive);
    if(!['vertical','horizontal'].includes(parameters.axis?.kind)||!finite(parameters.axis?.value))throw new Error('Mirror requires a finite vertical/horizontal axis.');
  }else if(type==='ROTATION'){
    if(!Array.isArray(parameters.primitives)||!parameters.primitives.length)throw new Error('Rotation requires primitives.');
    parameters.primitives.forEach(validatePrimitive);
    validatePoint(parameters.center,'rotation center');
    if(!Number.isInteger(parameters.count)||parameters.count<1||!finite(parameters.angleStepDeg))throw new Error('Rotation requires count and angleStepDeg.');
  }
  return true;
}

function reviewEnvelope(type,id,sourceIds,parameters){
  return {
    id,kind:'GENERATOR',generatorType:type,sourceIds:[...new Set(sourceIds)].sort(),
    parameters:clone(parameters),revision:1,
    reviewState:'AUTO_PROPOSED',decisionState:'unresolved',
    recipeEligible:false,formalPromotionBlocked:true,requiresAIReview:true,requiresRescore:true,
    provenance:{
      sourceKind:'semantic-authoring',
      algorithm:'RA Generator Authoring Engine',
      algorithmVersion:VERSION
    }
  };
}

function propose(type,parameters,sourceIds=[]){
  validate(type,parameters);
  const inferred=sourceIds.length?sourceIds:collectSourceIds(parameters);
  return reviewEnvelope(type,stableId(type,inferred,parameters),inferred,parameters);
}

function collectSourceIds(value){
  const ids=[];
  const visit=item=>{
    if(Array.isArray(item))return item.forEach(visit);
    if(!item||typeof item!=='object')return;
    if(item.id&&item.type)ids.push(item.id);
    Object.values(item).forEach(visit);
  };
  visit(value);
  return [...new Set(ids)].sort();
}

function edit(generator,patch){
  if(!generator||generator.kind!=='GENERATOR')throw new Error('Generator proposal is required.');
  const parameters={...clone(generator.parameters),...clone(patch)};
  validate(generator.generatorType,parameters);
  return {
    ...clone(generator),
    parameters,
    revision:Number(generator.revision||1)+1,
    reviewState:'AUTO_PROPOSED',
    decisionState:'unresolved',
    recipeEligible:false,
    formalPromotionBlocked:true,
    requiresAIReview:true,
    requiresRescore:true,
    previousReviewInvalidated:true
  };
}

function tagPrimitive(primitive,generator,index,instance={}){
  return {
    ...clone(primitive),
    id:`${generator.id}-primitive-${String(index+1).padStart(4,'0')}`,
    generatorProvenance:{
      generatorId:generator.id,
      generatorRevision:generator.revision,
      instanceIndex:index,
      ...instance
    },
    formalEligible:false
  };
}

function expand(generator){
  validate(generator.generatorType,generator.parameters);
  const parameters=generator.parameters,primitives=[];
  if(['CONCENTRIC_ARC_FIELD','RADIUS_SEQUENCE'].includes(generator.generatorType)){
    const centers=parameters.centers||[parameters.center],sequence=parameters.radius;
    for(let centerIndex=0;centerIndex<centers.length;centerIndex++)for(let index=0;index<sequence.count;index++){
      const value=round(Number(sequence.start)+Number(sequence.step)*index);
      const type=String(parameters.primitive||'CIRCLE').toUpperCase();
      const primitive={
        type,
        parameters:{
          center:clone(centers[centerIndex]),
          radius:value,
          ...(type==='ARC'?{
            startAngleDeg:Number(parameters.startAngleDeg??0),
            endAngleDeg:Number(parameters.endAngleDeg??180),
            clockwiseScreen:Boolean(parameters.clockwiseScreen)
          }:{})
        }
      };
      primitives.push(tagPrimitive(primitive,generator,primitives.length,{centerIndex,radiusIndex:index}));
    }
  }else if(generator.generatorType==='PARALLEL_PATH_FIELD'){
    for(let offsetIndex=0;offsetIndex<parameters.offsets.length;offsetIndex++){
      const distance=Number(parameters.offsets[offsetIndex]);
      for(let pathIndex=0;pathIndex<parameters.basePath.length;pathIndex++){
        const value=offsetPrimitive(parameters.basePath[pathIndex],distance);
        primitives.push(tagPrimitive(value,generator,primitives.length,{offsetIndex,pathIndex,distance}));
      }
    }
  }else if(generator.generatorType==='OFFSET'){
    primitives.push(tagPrimitive(offsetPrimitive(parameters.primitive,Number(parameters.distance)),generator,0,{distance:Number(parameters.distance)}));
  }else if(generator.generatorType==='ARRAY'){
    if(parameters.mode==='grid'){
      for(let row=0;row<parameters.rows;row++)for(let column=0;column<parameters.columns;column++)for(const primitive of parameters.primitives){
        const value=translatePrimitive(primitive,column*Number(parameters.dx||0),row*Number(parameters.dy||0));
        primitives.push(tagPrimitive(value,generator,primitives.length,{row,column}));
      }
    }else{
      for(let instance=0;instance<parameters.count;instance++)for(const primitive of parameters.primitives){
        const value=translatePrimitive(primitive,instance*Number(parameters.dx),instance*Number(parameters.dy));
        primitives.push(tagPrimitive(value,generator,primitives.length,{instance}));
      }
    }
  }else if(generator.generatorType==='MIRROR'){
    const source=parameters.includeSource===false?[]:parameters.primitives.map(clone);
    for(const primitive of [...source,...parameters.primitives.map(value=>mirrorPrimitive(value,parameters.axis))]){
      primitives.push(tagPrimitive(primitive,generator,primitives.length,{axis:clone(parameters.axis)}));
    }
  }else if(generator.generatorType==='ROTATION'){
    const center=validatePoint(parameters.center);
    for(let instance=0;instance<parameters.count;instance++)for(const primitive of parameters.primitives){
      const angle=instance*Number(parameters.angleStepDeg);
      primitives.push(tagPrimitive(rotatePrimitive(primitive,center,angle),generator,primitives.length,{instance,angleDeg:angle}));
    }
  }
  const digest=hash(canonical(primitives));
  return {
    kind:'ra-generator-expansion',
    version:VERSION,
    generatorId:generator.id,
    generatorRevision:generator.revision,
    primitiveCount:primitives.length,
    primitives,
    digest,
    formalEligible:false
  };
}

function collapse(generator,expansion){
  if(expansion?.generatorId!==generator?.id||expansion?.generatorRevision!==generator?.revision)throw new Error('Expansion provenance does not match Generator revision.');
  const expected=expand(generator);
  if(expected.digest!==expansion.digest||canonical(expected.primitives)!==canonical(expansion.primitives))throw new Error('Expansion was modified and cannot collapse deterministically.');
  return clone(generator);
}

function comparePrograms(programs){
  if(!Array.isArray(programs)||programs.length<2)throw new Error('Program comparison requires at least two candidates.');
  const ranked=programs.map(program=>{
    if(program.hardGatePassed===false)return {...clone(program),eligible:false,complexityScore:Infinity,rejectionReason:'Hard Gate failed.'};
    const primitiveCount=Number(program.primitiveCount??Infinity);
    const freeParameterCount=Number(program.freeParameterCount??Infinity);
    const sharedParameterCount=Number(program.sharedParameterCount??0);
    const complexityScore=primitiveCount*4+freeParameterCount*2-sharedParameterCount;
    return {...clone(program),eligible:true,complexityScore:round(complexityScore)};
  }).sort((a,b)=>a.complexityScore-b.complexityScore||String(a.id).localeCompare(String(b.id)));
  const selected=ranked.find(program=>program.eligible)||null;
  return {
    selectedId:selected?.id||null,
    ranked,
    reason:selected?'Lowest complexity among Hard-Gate-valid programs.':'No program passed Hard Gate.'
  };
}

function buildDocument(caseId,generators=[],expansions={}){
  const sorted=[...generators].sort((a,b)=>a.id.localeCompare(b.id));
  return {
    kind:'ra-generator-authoring-document',
    version:VERSION,
    caseId,
    generatorCandidates:clone(sorted),
    workingExpansions:clone(expansions),
    summary:{
      generatorCount:sorted.length,
      expandedPrimitiveCount:Object.values(expansions).reduce((sum,value)=>sum+Number(value?.primitiveCount||0),0),
      pendingAIReviewCount:sorted.filter(item=>item.reviewState!=='FORMAL_COMPILED').length,
      formalReadyCount:0
    }
  };
}

return {
  VERSION,TYPES,canonical,stableId,validate,collectSourceIds,propose,edit,
  offsetPrimitive,translatePrimitive,mirrorPrimitive,rotatePrimitive,
  expand,collapse,comparePrograms,buildDocument
};
});
