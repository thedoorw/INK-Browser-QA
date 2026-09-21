(function(){
"use strict";
const compiler=window.RASemanticCompiler;
const svg=window.RASVGRuntimeAdapter;
const icad=window.RAiCADRuntimeAdapter;
const bridge=window.RAWorkbenchBridge;
const states=new Map();
const $=id=>document.getElementById(id);
const els={
  input:$("compilerAuthoringInput"),compile:$("runSemanticCompilerBtn"),
  roundtrip:$("runRoundtripBtn"),save:$("saveProjectPackageBtn"),
  open:$("openProjectPackageBtn"),projectInput:$("projectPackageInput"),
  summary:$("compilerSummary"),diagnostics:$("compilerDiagnostics"),
  preview:$("compilerSVGPreview"),caseSelect:$("caseSelect")
};
const esc=value=>String(value??"").replace(/[&<>"']/g,char=>({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
}[char]));
const caseId=()=>bridge.currentCase().id;
const safe=action=>()=>{
  try{action();}
  catch(error){els.summary.textContent=`Blocked: ${error.message}`;}
};
function defaultAuthoring(){
  const active=bridge.currentCase();
  return {
    kind:"ra-working-authoring-export",version:"RA0.8",caseId:active.id,
    case:{id:active.id,name:active.name},
    canvas:{width:320,height:240,origin:{x:0,y:0},background:"#ffffff"},
    primitives:[
      {id:`${active.id}-line-preview`,type:"LINE",parameters:{start:{x:20,y:30},end:{x:280,y:30}}},
      {id:`${active.id}-circle-preview`,type:"CIRCLE",parameters:{center:{x:90,y:120},radius:45}},
      {id:`${active.id}-spline-preview`,type:"SPLINE",parameters:{p0:{x:150,y:170},p1:{x:190,y:90},p2:{x:240,y:220},p3:{x:290,y:150}}}
    ],
    dirtyObjectIds:[],boundaryWorkingCandidates:[],geometryMeasurements:[]
  };
}
function parseAuthoring(){
  const value=els.input.value.trim();
  if(!value)throw new Error("Authoring JSON is required.");
  return JSON.parse(value);
}
function render(){
  const state=states.get(caseId());
  if(!state){
    els.summary.textContent="尚未執行 Semantic Compiler。";
    els.diagnostics.innerHTML='<div class="constraint-row"><small>沒有 compiler diagnostics。</small></div>';
    els.preview.innerHTML="";
    return;
  }
  const result=state.compileResult;
  els.summary.textContent=`${result.status} · recipe ${result.recipe?.objects?.length||0} objects · digest ${result.digest||"—"} · roundtrip ${state.roundtrip?.status||"not run"}`;
  const messages=[
    ...(result.diagnostics?.errors||[]).map(item=>({kind:"ERROR",item})),
    ...(result.diagnostics?.warnings||[]).map(item=>({kind:"WARNING",item}))
  ];
  els.diagnostics.innerHTML=messages.map(({kind,item})=>`
    <div class="constraint-row"><span class="semantic-state">${esc(kind)}</span><b>${esc(item.code)}</b><small>${esc(item.message)}</small></div>
  `).join("")||'<div class="constraint-row"><b>PASS</b><small>No compiler blockers.</small></div>';
  els.preview.innerHTML=result.recipe?svg.render(result.recipe):"";
}
function runCompile(){
  const authoring=parseAuthoring(),compileResult=compiler.compile(authoring);
  const projectPackage=compileResult.status==="PASS"?compiler.createProjectPackage(authoring,compileResult):null;
  const runtimePlan=compileResult.status==="PASS"?icad.importRecipe(compileResult.recipe):null;
  states.set(caseId(),{authoring,compileResult,projectPackage,runtimePlan,roundtrip:null});
  if(projectPackage)els.projectInput.value=compiler.serializeProject(projectPackage);
  render();bridge.renderQA();
}
function runRoundtrip(){
  const state=states.get(caseId());
  if(!state?.authoring)throw new Error("Compile an Authoring document first.");
  state.roundtrip=compiler.roundTrip(state.authoring);
  render();bridge.renderQA();
}
function saveProject(){
  const project=states.get(caseId())?.projectPackage;
  if(!project)throw new Error("A successful compile is required before Save.");
  const blob=new Blob([compiler.serializeProject(project)],{type:"application/json"});
  const link=document.createElement("a");
  link.href=URL.createObjectURL(blob);
  link.download=`${caseId()}_RA0_8_authoring_project.json`;
  link.click();
  setTimeout(()=>URL.revokeObjectURL(link.href),1000);
}
function openProject(){
  const project=compiler.openProject(els.projectInput.value);
  els.input.value=JSON.stringify(project.authoring,null,2);
  const compileResult=compiler.compile(project.authoring);
  states.set(caseId(),{
    authoring:project.authoring,compileResult,projectPackage:project,
    runtimePlan:compileResult.status==="PASS"?icad.importRecipe(compileResult.recipe):null,
    roundtrip:null
  });
  render();bridge.renderQA();
}
function reset(){
  if(!states.has(caseId()))els.input.value=JSON.stringify(defaultAuthoring(),null,2);
  render();
}
els.compile.addEventListener("click",safe(runCompile));
els.roundtrip.addEventListener("click",safe(runRoundtrip));
els.save.addEventListener("click",safe(saveProject));
els.open.addEventListener("click",safe(openProject));
els.caseSelect.addEventListener("change",()=>setTimeout(reset,0));
window.RACompilerWorkspace={
  exportState:id=>{
    const state=states.get(id);
    return state?{
      version:"10.0",caseId:id,authoring:state.authoring,
      compileResult:state.compileResult,projectPackage:state.projectPackage,
      runtimePlan:state.runtimePlan,roundtrip:state.roundtrip
    }:null;
  },
  setState:(id,value)=>{states.set(id,value);if(id===caseId())render();return value;}
};
reset();
})();
