#!/usr/bin/env node
'use strict';
const fs=require('fs');
const path=require('path');
const crypto=require('crypto');
const ROOT=path.resolve(__dirname,'..');
const Compiler=require(path.join(ROOT,'runtime/semantic_compiler_engine.js'));
const Generator=require(path.join(ROOT,'runtime/generator_authoring_engine.js'));
const Compound=require(path.join(ROOT,'runtime/compound_topology_engine.js'));
const Tx=require(path.join(ROOT,'runtime/authoring_transaction_engine.js'));
const SVG=require(path.join(ROOT,'runtime/svg_runtime_adapter.js'));
const ICAD=require(path.join(ROOT,'runtime/icad_runtime_adapter.js'));
const Review=require(path.join(ROOT,'runtime/ai_review_queue_engine.js'));
const OUT=path.join(ROOT,'qa/evidence/basic_function_freeze');
const FIX=path.join(ROOT,'qa/fixtures');
fs.mkdirSync(OUT,{recursive:true}); fs.mkdirSync(FIX,{recursive:true});
const clone=x=>JSON.parse(JSON.stringify(x));
const sha=text=>crypto.createHash('sha256').update(text).digest('hex');
const style={stroke:'#17202a',fill:'none',strokeWidth:2,opacity:1};
function reviewItem(targetId,targetKind){return {reviewId:`review-${targetId}`,targetId,targetKind,state:'FORMAL_COMPILED',reviewer:'QA Test Authority',reviewAuthority:'MAIN_CHAT',mainAIReviewStatus:'MAIN_AI_CONFIRMED',geometryCheck:{passed:true,notes:['synthetic freeze contract']},structureCheck:{passed:true,notes:['synthetic freeze contract']},runtimeCheck:{passed:true,notes:['synthetic freeze contract']},evidenceIds:['evidence-freeze-contract'],candidateIdsCompared:[targetId],decisionReason:'Synthetic test-only fixture explicitly authorizes compile contract.',provenance:{sourceCandidateId:targetId,testOnly:true},authoringVersion:'RA0.9 Basic Function Freeze Test',qa:{runtime:true,topology:true,roundtrip:true,hardFailures:[]},workingDraftDirty:false,formalBlockers:[],createdAt:'2026-07-31T00:00:00Z',reviewedAt:'2026-07-31T00:00:00Z',history:[],future:[],compiler:{id:'freeze-contract',version:'1.0'}};}
function primitive(id,type,parameters,zIndex){return {id,type,parameters,zIndex,style:clone(style),provenance:{sourceKind:'semantic-authoring',testOnly:true}};}
const direct=[
 primitive('line-main','LINE',{start:{x:50,y:80},end:{x:220,y:80}},1),
 primitive('circle-main','CIRCLE',{center:{x:120,y:180},radius:45},2),
 primitive('arc-main','ARC',{center:{x:280,y:180},radius:55,startAngleDeg:180,endAngleDeg:360,sweepDeg:180,clockwiseScreen:true},3),
 primitive('ellipse-main','ELLIPSE',{center:{x:450,y:180},radiusX:70,radiusY:40},4),
 primitive('polyline-main','POLYLINE',{points:[{x:50,y:300},{x:110,y:260},{x:170,y:300}],closed:false},5),
 primitive('spline-main','SPLINE',{p0:{x:230,y:300},p1:{x:280,y:240},p2:{x:350,y:360},p3:{x:410,y:300}},6),
 primitive('center-path','LINE',{start:{x:80,y:420},end:{x:360,y:420}},7),
 primitive('outer-region','CIRCLE',{center:{x:520,y:390},radius:80},8),
 primitive('hole-region','CIRCLE',{center:{x:520,y:390},radius:35},9),
 primitive('island-region','CIRCLE',{center:{x:520,y:390},radius:12},10)
];
let offsetGenerator=Generator.propose('OFFSET',{primitive:direct.find(x=>x.id==='center-path'),distance:10},['center-path']);
offsetGenerator=Generator.edit(offsetGenerator,{distance:12});
const arrayGenerator=Generator.propose('ARRAY',{primitives:[primitive('array-source','CIRCLE',{center:{x:100,y:520},radius:15},20)],count:3,dx:55,dy:0},['array-source']);
const generatorCandidates=[offsetGenerator,arrayGenerator];
const workingExpansions=Object.fromEntries(generatorCandidates.map(g=>[g.id,Generator.expand(g)]));
const compoundBase={id:'compound-line-arc',segments:[
 primitive('compound-line','LINE',{start:{x:420,y:500},end:{x:500,y:500}},30),
 primitive('compound-arc','ARC',{center:{x:500,y:550},radius:50,startAngleDeg:-90,endAngleDeg:0,sweepDeg:90,clockwiseScreen:true},31)
]};
const compoundCandidate=Compound.proposeCompound(compoundBase,{requestedContinuity:'G1'});
const compoundOffset=Compound.offsetCompound(compoundBase,[-8,8],{targetContinuity:'G1'});
const sharedParameter={id:'shared-band-width',kind:'SHARED_PARAMETER',parameterKind:'width',memberIds:['center-path',offsetGenerator.id],value:12,decisionState:'selected',unresolved:[],reviewState:'FORMAL_COMPILED',recipeEligible:true,formalPromotionBlocked:false,requiresAIReview:false,requiresRescore:false,provenance:{sourceKind:'semantic-authoring',algorithm:'Freeze Contract',algorithmVersion:'1.0'}};
const formalTargets=[...generatorCandidates,compoundCandidate,compoundOffset,sharedParameter];
const semanticTopology={kind:'ra-semantic-topology',version:'1.0',relations:[
 {id:'rel-hole','type':'hole',parentId:'outer-region',childId:'hole-region',decisionState:'selected'},
 {id:'rel-island','type':'island',parentId:'hole-region',childId:'island-region',decisionState:'selected'},
 {id:'rel-subtract','type':'booleanSubtract',targetId:'outer-region',operandId:'hole-region',resultId:'ring-region',decisionState:'selected'},
 {id:'rel-contains','type':'contains',parentId:'outer-region',childId:'island-region',decisionState:'selected'},
 {id:'rel-draw-order','type':'drawOrder',beforeId:'hole-region',afterId:'island-region',decisionState:'selected'}
],unresolvedItems:[]};
const authoring={
 kind:'ra-working-authoring-export',version:'RA0.9 Basic Function Freeze Test',caseId:'FREEZE-CORE-001',case:{id:'FREEZE-CORE-001',name:'Basic Function Freeze Core Loop'},
 canvas:{width:640,height:600,origin:{x:0,y:0},background:'#ffffff'},layers:[{id:'GEOMETRY',name:'Semantic Geometry',visible:true,locked:false}],
 referenceIdentity:{id:'synthetic-reference',sha256:'0'.repeat(64)},
 observations:[{id:'obs-1',statement:'Synthetic fixture exercises the complete authoring and replay chain.',evidenceIds:['evidence-freeze-contract']}],
 hypotheses:[{id:'hyp-1',candidateType:'LINE_ARC_COMPOUND',parameters:{compoundId:compoundCandidate.id},state:'selected'},{id:'hyp-2',candidateType:'SPLINE_STACK',parameters:{},state:'rejected'}],
 decisions:[{id:'dec-1',targetId:compoundCandidate.id,state:'selected',reason:'Lower-complexity native compound is sufficient.'}],
 selectedCandidateIds:[compoundCandidate.id,offsetGenerator.id,arrayGenerator.id],rejectedCandidateIds:['hyp-2'],unresolvedItems:[],confidence:0.99,
 provenance:{source:'synthetic-freeze-audit',testOnly:true},semanticRecipe:{source:'authoring'},topologyDecision:clone(semanticTopology),
 reviewState:{state:'FORMAL_COMPILED',reviewAuthority:'MAIN_CHAT',silentFormalization:false},stableObjectIds:direct.map(x=>x.id),
 versionIdentity:{authoringVersion:'RA0.9 Basic Function Freeze Test',recipeVersion:'1.1'},replayIdentity:{algorithm:'RA Semantic Compiler + SVG Adapter',hash:'pending'},
 layerSeparation:{evidence:'referenceIdentity/observations',workingDraft:'transaction document',formalRecipe:'compiledRecipe',runtimeExpansion:'recipe.objects',mainAIReviewState:'reviewState'},
 primitives:direct,dirtyObjectIds:[],boundaryWorkingCandidates:[],geometryMeasurements:[],decisionModel:{targets:[]},
 generatorAuthoring:{kind:'ra-generator-authoring-document',version:'1.0',caseId:'FREEZE-CORE-001',generatorCandidates,workingExpansions,summary:{generatorCount:generatorCandidates.length,expandedPrimitiveCount:Object.values(workingExpansions).reduce((a,x)=>a+x.primitiveCount,0),pendingAIReviewCount:0,formalReadyCount:0}},
 compoundTopology:{kind:'ra-compound-topology-document',version:'1.0',caseId:'FREEZE-CORE-001',compoundCandidates:[compoundCandidate],compoundOffsetCandidates:[compoundOffset],topologyCandidates:[],weaveGraph:{kind:'weaveGraph',paths:[],crossingIds:[],unresolvedCrossingIds:[],validation:{valid:true,invalid:[],cycle:null}},summary:{compoundCount:1,compoundOffsetCount:1,crossingCount:0,unresolvedCrossingCount:0,topologyValid:true,formalReadyCount:0}},
 constraintParameters:{kind:'ra-constraint-parameter-document',version:'1.0',caseId:'FREEZE-CORE-001',constraintCandidates:[],sharedParameterCandidates:[sharedParameter],conflictValidation:{valid:true,conflicts:[]},summary:{constraintCount:0,sharedParameterCount:1,passingResidualCount:0,conflictCount:0,formalReadyCount:0}},
 semanticTopology,
 aiReviewQueue:{kind:'ra-ai-review-queue',version:'1.0',caseId:'FREEZE-CORE-001',authoringVersion:'RA0.9 Basic Function Freeze Test',items:formalTargets.map(t=>reviewItem(t.id,t.kind)),audit:[{action:'TEST_ONLY_QUEUE_CREATED',targetIds:formalTargets.map(t=>t.id),at:'2026-07-31T00:00:00Z'}]}
};
// Data-layer authoring operations.
let txDoc=Tx.createDocument('FREEZE-CORE-001',[clone(direct[0])]);
let tx=Tx.beginTransaction(txDoc); tx=Tx.addObject(tx,clone(direct[1])); tx=Tx.selectObject(tx,'circle-main'); txDoc=Tx.commit(txDoc,tx);
const addPass=txDoc.objects.length===2&&txDoc.selectionId==='circle-main';
tx=Tx.beginTransaction(txDoc); tx=Tx.updateObject(tx,'circle-main',{parameters:{center:{x:120,y:180},radius:50}}); txDoc=Tx.commit(txDoc,tx);
const modifyPass=txDoc.objects.find(x=>x.id==='circle-main').parameters.radius===50;
tx=Tx.beginTransaction(txDoc); tx=Tx.deleteObject(tx,'circle-main'); txDoc=Tx.commit(txDoc,tx); const deletePass=txDoc.objects.length===1;
const undone=Tx.undo(txDoc),redone=Tx.redo(undone); const undoPass=undone.objects.length===2,redoPass=redone.objects.length===1;
const rollback=Tx.rollback(txDoc,Tx.addObject(Tx.beginTransaction(txDoc),{id:'should-not-exist',type:'LINE'})); const rollbackPass=!rollback.objects.some(x=>x.id==='should-not-exist');
const compileResult=Compiler.compile(authoring,{revision:1,producerVersion:'RA0.9 Basic Function Freeze Candidate'});
if(compileResult.status!=='PASS')throw new Error(`Compile failed: ${JSON.stringify(compileResult.diagnostics)}`);
const recipe=compileResult.recipe;
const svgRuns=[0,1,2].map(()=>SVG.render(recipe));
const replayHashes=svgRuns.map(sha); authoring.replayIdentity.hash=replayHashes[0];
const project=Compiler.createProjectPackage(authoring,compileResult);
const serialized=Compiler.serializeProject(project); const reopened=Compiler.openProject(serialized);
const second=Compiler.compile(reopened.authoring,{revision:1,producerVersion:'RA0.9 Basic Function Freeze Candidate'});
const saveOpenPass=Compiler.canonical(authoring)===Compiler.canonical(reopened.authoring);
const roundtrip=Compiler.roundTrip(authoring,{revision:1,producerVersion:'RA0.9 Basic Function Freeze Candidate'});
const icad=ICAD.roundTrip(recipe);
let authorityRejectsWork=false,authorityAcceptsMain=false;
const authorityItem={reviewId:'review-authority-test',targetId:'authority-target',targetKind:'TEST',state:'MAIN_AI_REVIEW_REQUIRED',reviewer:'QA',reviewAuthority:'WORK',mainAIReviewStatus:'MAIN_AI_REVIEW_REQUIRED',geometryCheck:{passed:true,notes:[]},structureCheck:{passed:true,notes:[]},runtimeCheck:{passed:true,notes:[]},evidenceIds:['e1'],candidateIdsCompared:['c1'],decisionReason:'test',provenance:{sourceCandidateId:'c1'},authoringVersion:'RA0.9 RC4',qa:{runtime:true,topology:true,roundtrip:true,hardFailures:[]},workingDraftDirty:false,formalBlockers:['main review'],createdAt:'2026-07-31T00:00:00Z',reviewedAt:'2026-07-31T00:00:00Z',history:[],future:[]};
try{Review.mainConfirm(authorityItem,{reviewAuthority:'WORK',silentFormalization:false,decisionReason:'invalid work authority'});}catch(_error){authorityRejectsWork=true;}
try{const confirmed=Review.mainConfirm(authorityItem,{reviewAuthority:'MAIN_CHAT',silentFormalization:false,decisionReason:'explicit test-only main authority'});authorityAcceptsMain=confirmed.state==='MAIN_AI_CONFIRMED'&&confirmed.reviewAuthority==='MAIN_CHAT';}catch(_error){authorityAcceptsMain=false;}
const rawContourBlocked=Compiler.diagnostics({...authoring,primitives:[...authoring.primitives,{id:'raw-test',type:'LINE',parameters:{start:{x:0,y:0},end:{x:1,y:1}},provenance:{sourceKind:'raw-contour'}}]}).errors.some(e=>e.code==='TRACE_DEPENDENCY_FORBIDDEN');
const unresolvedBlocked=Compiler.diagnostics({...authoring,semanticTopology:{...authoring.semanticTopology,unresolvedItems:['u1']}}).errors.some(e=>e.code==='UNRESOLVED_SEMANTIC_TOPOLOGY');
const results={
 kind:'ra-basic-function-freeze-node-contract',version:'1.0',status:'PASS',
 authoring:{add:addPass,select:addPass,modify:modifyPass,delete:deletePass,undo:undoPass,redo:redoPass,rollback:rollbackPass,stableIds:new Set(recipe.objects.map(x=>x.id)).size===recipe.objects.length},
 compile:{status:compileResult.status,objectCount:recipe.objects.length,types:[...new Set(recipe.objects.map(x=>x.type))].sort(),topologyRelationTypes:[...new Set((recipe.topologyRelations||[]).map(x=>x.type))].sort(),sharedParameterCount:(recipe.sharedParameters||[]).length,noSilentFallback:compileResult.diagnostics.errors.length===0},
 saveOpen:{status:saveOpenPass?'PASS':'FAIL',authoringPreserved:saveOpenPass,objectIdsPreserved:authoring.primitives.map(x=>x.id).join('|')===reopened.authoring.primitives.map(x=>x.id).join('|')},
 jsonRoundtrip:{status:roundtrip.status,authoringPreserved:roundtrip.authoringPreserved,recipePreserved:roundtrip.recipePreserved},
 deterministicReplay:{status:new Set(replayHashes).size===1?'PASS':'FAIL',runs:3,hashes:replayHashes,objectCounts:[recipe.objects.length,recipe.objects.length,recipe.objects.length]},
 icadCompatibility:{status:icad.preserved?'PASS':'FAIL',preserved:icad.preserved,objectCount:icad.plan.objectCount,commandCount:icad.plan.commandCount,compatibilityReport:icad.compatibilityReport},
 reviewAuthority:{rejectsWorkAuthority:authorityRejectsWork,acceptsExplicitMainChat:authorityAcceptsMain,rawContourFormalizationBlocked:rawContourBlocked,unresolvedSilentFormalizationBlocked:unresolvedBlocked},
 primitiveCoverage:{LINE:false,CIRCLE:false,ARC:false,ELLIPSE:false,POLYLINE:false,SPLINE:false,OFFSET:generatorCandidates.some(g=>g.generatorType==='OFFSET'),COMPOUND:recipe.objects.some(o=>o.metadata?.compoundId),BOOLEAN:(recipe.topologyRelations||[]).some(r=>r.type==='booleanSubtract'||r.type==='booleanUnion'),HOLE:(recipe.topologyRelations||[]).some(r=>r.type==='hole'),ISLAND:(recipe.topologyRelations||[]).some(r=>r.type==='island'),SHARED_PARAMETERS:(recipe.sharedParameters||[]).length>0,GENERATOR:(recipe.objects||[]).some(o=>o.metadata?.generatorId),ARRAY:generatorCandidates.some(g=>g.generatorType==='ARRAY'),TRANSFORM:generatorCandidates.some(g=>g.generatorType==='ARRAY')}
};
for(const type of ['LINE','CIRCLE','ARC','ELLIPSE','POLYLINE','SPLINE'])results.primitiveCoverage[type]=recipe.objects.some(o=>o.type===type.toLowerCase());
const all=[...Object.values(results.authoring),...Object.values(results.reviewAuthority),results.compile.status==='PASS',results.saveOpen.status==='PASS',results.jsonRoundtrip.status==='PASS',results.deterministicReplay.status==='PASS',results.icadCompatibility.status==='PASS',...Object.values(results.primitiveCoverage)].every(Boolean);
results.status=all?'PASS':'FAIL';
const notebook={kind:'ra-geometry-notebook',version:'1.0',caseId:authoring.caseId,referenceIdentity:authoring.referenceIdentity,observations:authoring.observations,hypotheses:authoring.hypotheses,decisions:authoring.decisions,selectedCandidateIds:authoring.selectedCandidateIds,rejectedCandidateIds:authoring.rejectedCandidateIds,unresolvedItems:authoring.unresolvedItems,confidence:authoring.confidence,provenance:authoring.provenance,semanticRecipe:recipe,topologyDecision:authoring.semanticTopology,reviewState:authoring.reviewState,stableObjectIds:recipe.objects.map(x=>x.id),versionIdentity:authoring.versionIdentity,replayIdentity:authoring.replayIdentity,layerSeparation:authoring.layerSeparation};
fs.writeFileSync(path.join(FIX,'ra_basic_function_freeze_notebook.json'),JSON.stringify(notebook,null,2)+'\n');
fs.writeFileSync(path.join(FIX,'ra_basic_function_freeze_authoring.json'),JSON.stringify(authoring,null,2)+'\n');
fs.writeFileSync(path.join(OUT,'RA_BASIC_FUNCTION_TEST_RECIPE.json'),JSON.stringify(recipe,null,2)+'\n');
fs.writeFileSync(path.join(OUT,'RA_BASIC_FUNCTION_TEST_RUNTIME.svg'),svgRuns[0]);
fs.writeFileSync(path.join(OUT,'RA_BASIC_FUNCTION_NODE_CONTRACT.json'),JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify(results,null,2));
process.exit(results.status==='PASS'?0:1);
