(function(root,factory){
  const api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  root.RASemanticCompiler=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
"use strict";

const VERSION="1.1-freeze";
const RECIPE_VERSION="1.1";
const ALLOWED_TYPES=new Set(["LINE","CIRCLE","ARC","SPLINE","RECTANGLE","ELLIPSE","POLYLINE"]);
const TOPOLOGY_RELATION_TYPES=new Set(["contains","inside","touches","intersect","intersects","overlaps","occludes","occludedBy","sharesBoundary","drawOrder","canvasCrop","booleanSubtract","booleanUnion","hole","island"]);
const clone=value=>JSON.parse(JSON.stringify(value));
const finite=value=>Number.isFinite(Number(value));

function canonical(value){
  if(Array.isArray(value))return `[${value.map(canonical).join(",")}]`;
  if(value&&typeof value==="object"){
    return `{${Object.keys(value).sort().map(key=>`${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function hash(text){
  let value=0x811c9dc5;
  for(let index=0;index<text.length;index++){
    value^=text.charCodeAt(index);
    value=Math.imul(value,0x01000193)>>>0;
  }
  return value.toString(16).padStart(8,"0");
}

function digest(value){return hash(canonical(value));}
function parametersOf(primitive){return primitive.parameters||primitive;}
function primitiveType(primitive){return String(primitive.type||primitive.candidateType||"").toUpperCase();}
function reviewMap(authoring){
  return new Map((authoring.aiReviewQueue?.items||[]).map(item=>[item.targetId,item]));
}

function collectFormalTargets(authoring){
  return [
    ...(authoring.generatorAuthoring?.generatorCandidates||[]),
    ...(authoring.compoundTopology?.compoundCandidates||[]),
    ...(authoring.compoundTopology?.compoundOffsetCandidates||[]),
    ...(authoring.compoundTopology?.topologyCandidates||[]),
    ...(authoring.constraintParameters?.constraintCandidates||[]),
    ...(authoring.constraintParameters?.sharedParameterCandidates||[])
  ];
}

function diagnostics(authoring){
  const errors=[],warnings=[],reviews=reviewMap(authoring);
  if(!authoring||typeof authoring!=="object"){
    return {valid:false,errors:[{code:"INVALID_AUTHORING",message:"Authoring document is required."}],warnings:[]};
  }
  if(!String(authoring.caseId||authoring.case?.id||"").trim()){
    errors.push({code:"CASE_ID_REQUIRED",message:"A stable caseId is required."});
  }
  if((authoring.dirtyObjectIds||[]).length){
    errors.push({code:"DIRTY_WORKING_STATE",message:"Working edits require re-score and review.",targetIds:[...authoring.dirtyObjectIds]});
  }
  if((authoring.boundaryWorkingCandidates||[]).length){
    errors.push({code:"RAW_BOUNDARY_CANDIDATE",message:"Boundary-derived working candidates cannot enter Formal Recipe."});
  }
  if((authoring.geometryMeasurements||[]).some(item=>item.decisionState!=="selected"||item.recipeEligible!==true)){
    errors.push({code:"UNRESOLVED_MEASUREMENT",message:"All measurement candidates must be selected and recipe eligible."});
  }
  const rc2Contract=/RC(?:2|3)/.test(String(authoring.version||""));
  for(const target of collectFormalTargets(authoring)){
    const review=reviews.get(target.id);
    if(rc2Contract&&!new Set(["MAIN_AI_CONFIRMED","FORMAL_COMPILED"]).has(review?.state)){
      errors.push({
        code:"REVIEW_NOT_MAIN_AI_CONFIRMED",
        message:`${target.id} has not been explicitly confirmed by Main Chat.`,
        targetId:target.id,
        observedState:review?.state||null
      });
    }else if(!rc2Contract&&review?.state!=="FORMAL_COMPILED"){
      errors.push({code:"REVIEW_NOT_COMPILED",message:`${target.id} has not reached FORMAL_COMPILED.`,targetId:target.id});
    }
    if(target.decisionState==="selected"&&(target.unresolved||[]).length){
      errors.push({
        code:"SILENT_UNRESOLVED_SELECTION",
        message:`${target.id} cannot remain selected while unresolved entries exist.`,
        targetId:target.id,
        unresolved:[...target.unresolved]
      });
    }
    if(target.provenance?.sourceKind==="raw-contour"||target.recipeEligible===true&&target.rawContour===true){
      errors.push({
        code:"RAW_CONTOUR_FORMALIZATION_FORBIDDEN",
        message:`${target.id} is raw-contour evidence and can never enter Formal Recipe.`,
        targetId:target.id
      });
    }
  }
  for(const decision of authoring.decisionModel?.targets||[]){
    if((decision.unresolved||[]).length){
      errors.push({
        code:"UNRESOLVED_DECISION_TARGET",
        message:`${decision.targetId} retains unresolved alternatives.`,
        targetId:decision.targetId,
        unresolved:[...decision.unresolved]
      });
    }
  }
  if(rc2Contract){
    const promotion=authoring.aiPromotionRecord;
    if(
      promotion?.state!=="MAIN_AI_CONFIRMED"||
      promotion?.reviewAuthority!=="MAIN_CHAT"||
      promotion?.silentFormalization!==false
    ){
      errors.push({
        code:"MAIN_AI_PROMOTION_RECORD_REQUIRED",
        message:"Formal compile requires an explicit MAIN_AI_CONFIRMED promotion record from Main Chat."
      });
    }
  }
  const semanticTopology=authoring.semanticTopology;
  if(semanticTopology){
    for(const relation of semanticTopology.relations||[]){
      if(!relation.id||!TOPOLOGY_RELATION_TYPES.has(String(relation.type||""))){
        errors.push({code:"UNSUPPORTED_TOPOLOGY_RELATION",message:`Topology relation ${relation.id||"(missing id)"} has unsupported type ${relation.type||"(missing)"}.`});
      }
      if(relation.decisionState==="unresolved"||relation.unresolved===true){
        errors.push({code:"UNRESOLVED_SEMANTIC_TOPOLOGY",message:`Topology relation ${relation.id||"(missing id)"} remains unresolved.`});
      }
    }
    if((semanticTopology.unresolvedItems||[]).length){
      errors.push({code:"UNRESOLVED_SEMANTIC_TOPOLOGY",message:"Semantic topology contains unresolved items.",targetIds:[...semanticTopology.unresolvedItems]});
    }
  }
  const topology=authoring.compoundTopology;
  if(topology){
    if(topology.weaveGraph?.validation?.valid!==true){
      errors.push({code:"INVALID_TOPOLOGY",message:"Weave graph validation failed."});
    }
    if((topology.weaveGraph?.unresolvedCrossingIds||[]).length){
      errors.push({code:"UNRESOLVED_TOPOLOGY",message:"Crossings remain unresolved.",targetIds:[...topology.weaveGraph.unresolvedCrossingIds]});
    }
  }
  for(const primitive of authoring.primitives||[]){
    const type=primitiveType(primitive);
    if(!primitive.id||!ALLOWED_TYPES.has(type)){
      errors.push({code:"UNSUPPORTED_PRIMITIVE",message:`Primitive ${primitive.id||"(missing id)"} has unsupported type ${type||"(missing)"}.`});
    }
    if(primitive.traceDependency||primitive.provenance?.sourceKind==="raw-contour"){
      errors.push({code:"TRACE_DEPENDENCY_FORBIDDEN",message:`Primitive ${primitive.id} depends on raw contour evidence.`});
    }
  }
  if(!(authoring.primitives||[]).length&&!collectFormalTargets(authoring).length){
    warnings.push({code:"EMPTY_RECIPE",message:"No Formal geometry was supplied."});
  }
  return {valid:errors.length===0,errors,warnings};
}

function normalizePrimitive(primitive,index,provenance={}){
  const type=primitiveType(primitive);
  if(!ALLOWED_TYPES.has(type))throw new Error(`Unsupported primitive type: ${type}`);
  const parameters=clone(parametersOf(primitive));
  return {
    id:String(primitive.id||`object-${String(index+1).padStart(4,"0")}`),
    type:type.toLowerCase(),
    layer:String(primitive.layer||"GEOMETRY"),
    zIndex:Number(primitive.zIndex??index),
    visible:primitive.visible!==false,
    locked:Boolean(primitive.locked),
    style:clone(primitive.style||{stroke:"#151614",fill:"none",strokeWidth:1,opacity:1}),
    metadata:{
      authoringType:type,
      sourceId:String(primitive.id||""),
      ...clone(provenance),
      ...clone(primitive.metadata||{})
    },
    ...parameters
  };
}

function collectPrimitives(authoring){
  const output=(authoring.primitives||[]).map(item=>clone(item));
  const expansions=authoring.generatorAuthoring?.workingExpansions||{};
  for(const generator of authoring.generatorAuthoring?.generatorCandidates||[]){
    const expansion=expansions[generator.id];
    if(!expansion||expansion.generatorRevision!==generator.revision){
      throw new Error(`Generator expansion missing or stale: ${generator.id}`);
    }
    output.push(...expansion.primitives.map(primitive=>({
      ...clone(primitive),
      compilerProvenance:{generatorId:generator.id,generatorRevision:generator.revision}
    })));
  }
  for(const compound of authoring.compoundTopology?.compoundCandidates||[]){
    output.push(...compound.segments.map(segment=>({
      ...clone(segment),
      compilerProvenance:{compoundId:compound.id}
    })));
  }
  for(const family of authoring.compoundTopology?.compoundOffsetCandidates||[]){
    for(const member of family.members||[])for(const segment of member.compound?.segments||[]){
      output.push({
        ...clone(segment),
        id:`${member.compound.id}-${segment.id}`,
        compilerProvenance:{compoundOffsetId:family.id,offset:member.offset}
      });
    }
  }
  return output;
}

function compileSemanticTopology(authoring){
  return (authoring.semanticTopology?.relations||[]).map(relation=>clone(relation)).sort((a,b)=>String(a.id).localeCompare(String(b.id)));
}

function compileSharedParameters(authoring){
  return (authoring.constraintParameters?.sharedParameterCandidates||[]).map(parameter=>({
    id:String(parameter.id),
    kind:"sharedParameter",
    parameterKind:String(parameter.parameterKind||"generic"),
    value:clone(parameter.value),
    memberIds:[...(parameter.memberIds||[])].sort(),
    provenance:clone(parameter.provenance||{})
  })).sort((a,b)=>a.id.localeCompare(b.id));
}

function compileTopology(authoring){
  const reviews=reviewMap(authoring),operations=[];
  const rc2Contract=/RC(?:2|3)/.test(String(authoring.version||""));
  for(const crossing of authoring.compoundTopology?.topologyCandidates||[]){
    const accepted=rc2Contract
      ?new Set(["MAIN_AI_CONFIRMED","FORMAL_COMPILED"])
      :new Set(["FORMAL_COMPILED"]);
    if(!accepted.has(reviews.get(crossing.id)?.state)){
      throw new Error(`Topology review not compiled: ${crossing.id}`);
    }
    if(crossing.crossingState==="CONNECTED_JUNCTION"){
      operations.push({op:"JOIN_PATHS",paths:[crossing.pathA,crossing.pathB],point:clone(crossing.point),crossingId:crossing.id});
    }else if(crossing.crossingState==="OVER_UNDER"&&crossing.mask){
      operations.push(
        {op:"DRAW_PATH",pathId:crossing.underPath,crossingId:crossing.id},
        {op:"LOCAL_MASK",pathId:crossing.underPath,mask:clone(crossing.mask),crossingId:crossing.id},
        {op:"DRAW_PATH",pathId:crossing.overPath,crossingId:crossing.id}
      );
    }else{
      throw new Error(`Unresolved topology cannot compile: ${crossing.id}`);
    }
  }
  return operations;
}

function compile(authoring,options={}){
  const report=diagnostics(authoring);
  if(!report.valid)return {kind:"ra-semantic-compile-result",version:VERSION,status:"BLOCKED",diagnostics:report,recipe:null,digest:null};
  try{
    const caseId=String(authoring.caseId||authoring.case.id);
    const primitives=collectPrimitives(authoring);
    const objects=primitives.map((primitive,index)=>normalizePrimitive(
      primitive,index,primitive.compilerProvenance||{}
    )).sort((a,b)=>a.zIndex-b.zIndex||a.id.localeCompare(b.id));
    const topologyOperations=compileTopology(authoring);
    const recipe={
      kind:"icad-auto-drawing-recipe",
      schemaVersion:RECIPE_VERSION,
      recipeId:caseId,
      revision:Number(options.revision??1),
      producer:{name:"Recipe Authoring Workbench",version:String(options.producerVersion||"RA0.8")},
      document:{
        id:caseId,
        name:String(authoring.case?.name||authoring.name||caseId),
        units:String(options.units||authoring.units||"px"),
        coordinateSpace:"absolute",
        width:Number(authoring.canvas?.width??1000),
        height:Number(authoring.canvas?.height??1000),
        origin:clone(authoring.canvas?.origin||{x:0,y:0}),
        background:String(authoring.canvas?.background||"#ffffff")
      },
      layers:clone(authoring.layers||[{id:"GEOMETRY",name:"Native Semantic Geometry",visible:true,locked:false}]),
      objects,
      topologyOperations,
      topologyRelations:compileSemanticTopology(authoring),
      sharedParameters:compileSharedParameters(authoring),
      compileProvenance:{
        compiler:"RA Semantic Compiler",
        compilerVersion:VERSION,
        authoringVersion:String(authoring.version||"RA0.8"),
        sourceDigest:digest(authoring),
        reviewTargetIds:collectFormalTargets(authoring).map(item=>item.id).sort()
      }
    };
    return {
      kind:"ra-semantic-compile-result",version:VERSION,status:"PASS",
      diagnostics:report,recipe,digest:digest(recipe)
    };
  }catch(error){
    return {
      kind:"ra-semantic-compile-result",version:VERSION,status:"BLOCKED",
      diagnostics:{valid:false,errors:[...report.errors,{code:"COMPILE_FAILURE",message:error.message}],warnings:report.warnings},
      recipe:null,digest:null
    };
  }
}

function createProjectPackage(authoring,compileResult){
  if(compileResult?.status!=="PASS"||!compileResult.recipe)throw new Error("A successful compile result is required.");
  const payload={
    kind:"ra-authoring-project-package",version:VERSION,
    authoring:clone(authoring),
    compiledRecipe:clone(compileResult.recipe),
    compileDigest:compileResult.digest
  };
  return {...payload,packageDigest:digest(payload)};
}

function serializeProject(project){
  if(project?.kind!=="ra-authoring-project-package")throw new Error("RA authoring project package is required.");
  return `${canonical(project)}\n`;
}

function openProject(serialized){
  const project=typeof serialized==="string"?JSON.parse(serialized):clone(serialized);
  if(project?.kind!=="ra-authoring-project-package")throw new Error("Unsupported project package.");
  const supplied=project.packageDigest;
  const payload=clone(project);
  delete payload.packageDigest;
  if(supplied!==digest(payload))throw new Error("Project package digest mismatch.");
  return project;
}

function recipeToAuthoring(recipe){
  if(recipe?.kind!=="icad-auto-drawing-recipe")throw new Error("iCAD Recipe is required.");
  const primitives=(recipe.objects||[]).map(object=>{
    const primitive={id:object.id,type:String(object.type).toUpperCase(),parameters:{}};
    const excluded=new Set(["id","type","layer","zIndex","visible","locked","style","metadata"]);
    for(const [key,value] of Object.entries(object))if(!excluded.has(key))primitive.parameters[key]=clone(value);
    return primitive;
  });
  return {
    kind:"ra-working-authoring-export",version:"RA0.8-import",
    caseId:recipe.recipeId,
    case:{id:recipe.recipeId,name:recipe.document?.name||recipe.recipeId},
    canvas:{
      width:recipe.document?.width,height:recipe.document?.height,
      origin:clone(recipe.document?.origin||{x:0,y:0}),
      background:recipe.document?.background||"#ffffff"
    },
    layers:clone(recipe.layers||[]),primitives,
    semanticTopology:{kind:"ra-semantic-topology",version:"1.0",relations:clone(recipe.topologyRelations||[]),unresolvedItems:[]},
    constraintParameters:{kind:"ra-constraint-parameter-document",version:"1.0",caseId:recipe.recipeId,constraintCandidates:[],sharedParameterCandidates:clone(recipe.sharedParameters||[]),conflictValidation:{valid:true,conflicts:[]},summary:{constraintCount:0,sharedParameterCount:(recipe.sharedParameters||[]).length,passingResidualCount:0,conflictCount:0,formalReadyCount:0}},
    dirtyObjectIds:[],boundaryWorkingCandidates:[],geometryMeasurements:[],
    importAttestation:{sourceRecipeDigest:digest(recipe)}
  };
}

function roundTrip(authoring,options={}){
  const first=compile(authoring,options);
  if(first.status!=="PASS")return {status:"BLOCKED",first,reason:"Initial compile failed."};
  const project=createProjectPackage(authoring,first);
  const reopened=openProject(serializeProject(project));
  const second=compile(reopened.authoring,options);
  return {
    status:second.status==="PASS"&&canonical(first.recipe)===canonical(second.recipe)?"PASS":"MISMATCH",
    firstDigest:first.digest,secondDigest:second.digest,
    projectDigest:project.packageDigest,
    authoringPreserved:canonical(authoring)===canonical(reopened.authoring),
    recipePreserved:canonical(first.recipe)===canonical(second.recipe)
  };
}

return {
  VERSION,RECIPE_VERSION,ALLOWED_TYPES,canonical,digest,diagnostics,
  normalizePrimitive,collectPrimitives,compileSemanticTopology,compileSharedParameters,compileTopology,compile,
  createProjectPackage,serializeProject,openProject,recipeToAuthoring,roundTrip
};
});
