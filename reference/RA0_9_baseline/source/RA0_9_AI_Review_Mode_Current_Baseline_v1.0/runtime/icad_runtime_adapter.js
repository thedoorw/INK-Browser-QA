(function(root,factory){
  const api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  root.RAiCADRuntimeAdapter=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
"use strict";
const VERSION="1.1-freeze";
const clone=value=>JSON.parse(JSON.stringify(value));
const supported=new Set(["line","circle","arc","spline","rectangle","ellipse","polyline"]);
const topologySupported=new Set(["contains","inside","touches","intersect","intersects","overlaps","occludes","occludedBy","sharesBoundary","drawOrder","canvasCrop","booleanSubtract","booleanUnion","hole","island"]);
const recognizedTopLevel=new Set(["kind","schemaVersion","recipeId","revision","producer","document","layers","objects","topologyOperations","topologyRelations","sharedParameters","compileProvenance"]);
function importRecipe(recipe){
  if(recipe?.kind!=="icad-auto-drawing-recipe")throw new Error("iCAD Recipe is required.");
  const commands=[];
  for(const object of recipe.objects||[]){
    if(!supported.has(object.type))throw new Error(`iCAD adapter does not support ${object.type}.`);
    commands.push({
      op:"CREATE_NATIVE_OBJECT",
      objectType:object.type.toUpperCase(),
      object:clone(object)
    });
  }
  commands.push(...(recipe.topologyOperations||[]).map(operation=>({
    op:"APPLY_TOPOLOGY_OPERATION",operation:clone(operation)
  })));
  for(const relation of recipe.topologyRelations||[]){
    if(!topologySupported.has(String(relation.type||"")))throw new Error(`iCAD adapter does not support topology relation ${relation.type||"(missing)"}.`);
    commands.push({op:"REGISTER_TOPOLOGY_RELATION",relation:clone(relation)});
  }
  const unsupportedTopLevelFields=Object.keys(recipe).filter(key=>!recognizedTopLevel.has(key)).sort();
  return {
    kind:"icad-runtime-plan",version:VERSION,recipeId:recipe.recipeId,
    objectCount:(recipe.objects||[]).length,
    commandCount:commands.length,
    commands,
    compatibilityReport:{
      status:"PASS_WITH_EXPLICIT_ANNOTATIONS",
      unsupportedTopLevelFields,
      unsupportedObjectTypes:[],
      unsupportedTopologyRelationTypes:[],
      sharedParameterCount:(recipe.sharedParameters||[]).length,
      note:"Unknown top-level fields are reported and preserved through the template; no silent discard."
    }
  };
}
function exportRecipe(plan,template){
  if(plan?.kind!=="icad-runtime-plan")throw new Error("iCAD Runtime plan is required.");
  const objects=plan.commands.filter(command=>command.op==="CREATE_NATIVE_OBJECT").map(command=>clone(command.object));
  const topologyOperations=plan.commands.filter(command=>command.op==="APPLY_TOPOLOGY_OPERATION").map(command=>clone(command.operation));
  const topologyRelations=plan.commands.filter(command=>command.op==="REGISTER_TOPOLOGY_RELATION").map(command=>clone(command.relation));
  return {...clone(template),objects,topologyOperations,topologyRelations};
}
function roundTrip(recipe){
  const plan=importRecipe(recipe),exported=exportRecipe(plan,recipe);
  return {plan,recipe:exported,preserved:JSON.stringify(recipe)===JSON.stringify(exported),compatibilityReport:plan.compatibilityReport};
}
return {VERSION,importRecipe,exportRecipe,roundTrip};
});
