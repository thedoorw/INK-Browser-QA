(function(){
'use strict';
const engine=window.RADependencyRecompute;
const generators=window.RAGeneratorAuthoring;
const bridge=window.RAWorkbenchBridge;
const graphs=new Map();
const $=id=>document.getElementById(id);
const els={
  build:$('buildDependencyGraphBtn'),undo:$('undoDependencyBtn'),redo:$('redoDependencyBtn'),
  parameter:$('dependencyParameterNode'),value:$('dependencyParameterValue'),
  apply:$('applyDependencyTransactionBtn'),summary:$('dependencySummary'),
  list:$('dependencyNodeList'),caseSelect:$('caseSelect')
};
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const caseId=()=>bridge.currentCase().id;
const graph=()=>graphs.get(caseId())||null;
const safe=action=>()=>{
  try{action();}
  catch(error){els.summary.textContent=`Blocked: ${error.message}`;}
};

function parseValue(){
  const text=els.value.value.trim();
  if(!text)throw new Error('A JSON parameter value is required.');
  return JSON.parse(text);
}

function render(){
  const active=graph();
  if(!active){
    els.summary.textContent='尚未建立 Dependency Graph。';
    els.parameter.innerHTML='';
    els.list.innerHTML='<div class="constraint-row"><small>沒有 dependency nodes。</small></div>';
    els.undo.disabled=true;els.redo.disabled=true;els.apply.disabled=true;
    return;
  }
  const document=engine.buildDocument(active);
  els.summary.textContent=`${document.summary.nodeCount} nodes · ${document.summary.edgeCount} edges · revision ${document.summary.revision} · undo ${document.summary.undoDepth} · redo ${document.summary.redoDepth}`;
  const parameterNodes=Object.values(active.nodes).filter(node=>node.kind==='PARAMETER');
  const previous=els.parameter.value;
  els.parameter.innerHTML=parameterNodes.map(node=>`<option value="${esc(node.id)}">${esc(node.id)}</option>`).join('');
  if(parameterNodes.some(node=>node.id===previous))els.parameter.value=previous;
  els.list.innerHTML=Object.values(active.nodes).sort((a,b)=>a.id.localeCompare(b.id)).map(node=>`
    <div class="constraint-row">
      <b>${esc(node.kind)} · ${esc(node.id)}</b>
      <small>deps ${esc(node.dependencies.join(', ')||'none')} · r${esc(node.revision)} · value ${esc(JSON.stringify(node.value))}</small>
    </div>`).join('');
  els.undo.disabled=!active.history.length;
  els.redo.disabled=!active.future.length;
  els.apply.disabled=!parameterNodes.length;
  const selected=active.nodes[els.parameter.value];
  if(selected&&!els.value.matches(':focus'))els.value.value=JSON.stringify(selected.value,null,2);
}

function build(){
  const document=window.RAGeneratorWorkspace?.exportState(caseId());
  if(!document?.generatorCandidates?.length)throw new Error('Create at least one Generator before building dependencies.');
  graphs.set(caseId(),engine.fromGeneratorDocument(caseId(),document));
  render();
}

function applyLocalOutputs(before,result){
  const generatorDocument=window.RAGeneratorWorkspace?.exportState(caseId());
  if(!generatorDocument)return;
  const updates=new Map(result.localOutputs.filter(output=>output.kind==='GENERATOR').map(output=>[output.reviewTargetId,output.value]));
  if(!updates.size)return;
  const expansions={...generatorDocument.workingExpansions};
  const nextGenerators=generatorDocument.generatorCandidates.map(generator=>{
    if(!updates.has(generator.id))return generator;
    const next=generators.edit(generator,updates.get(generator.id));
    expansions[generator.id]=generators.expand(next);
    return next;
  });
  window.RAGeneratorWorkspace.setDocument(caseId(),generators.buildDocument(caseId(),nextGenerators,expansions));
  window.RAAIReviewQueueWorkspace?.invalidateTargets(caseId(),result.reviewTargetIds,'Parameter dependency transaction changed Generator output.');
}

function apply(){
  const active=graph();
  if(!active)throw new Error('Dependency Graph is not available.');
  let transaction=engine.beginTransaction(active);
  transaction=engine.setParameter(transaction,els.parameter.value,parseValue());
  const result=engine.commit(active,transaction);
  graphs.set(caseId(),result.graph);
  applyLocalOutputs(active,result);
  render();
}

function changedGeneratorOutputs(before,after){
  const outputs=[];
  for(const node of Object.values(after.nodes))if(node.kind==='GENERATOR'){
    const previous=before.nodes[node.id];
    if(JSON.stringify(previous?.value)!==JSON.stringify(node.value)){
      outputs.push({nodeId:node.id,kind:'GENERATOR',value:node.value,reviewTargetId:node.reviewTargetId});
    }
  }
  return outputs;
}

function restore(direction){
  const before=graph();
  if(!before)return;
  const after=direction==='undo'?engine.undo(before):engine.redo(before);
  graphs.set(caseId(),after);
  const localOutputs=changedGeneratorOutputs(before,after);
  applyLocalOutputs(before,{localOutputs,reviewTargetIds:localOutputs.map(output=>output.reviewTargetId)});
  render();
}

els.build.addEventListener('click',safe(build));
els.apply.addEventListener('click',safe(apply));
els.undo.addEventListener('click',safe(()=>restore('undo')));
els.redo.addEventListener('click',safe(()=>restore('redo')));
els.parameter.addEventListener('change',()=>{
  const node=graph()?.nodes[els.parameter.value];
  if(node)els.value.value=JSON.stringify(node.value,null,2);
});
els.caseSelect.addEventListener('change',()=>setTimeout(render,0));

window.RADependencyWorkspace={
  exportState:id=>graphs.has(id)?engine.buildDocument(graphs.get(id)):null,
  graph:id=>graphs.get(id)||null,
  setGraph:(id,value)=>{graphs.set(id,value);if(id===caseId())render();return value;}
};
render();
})();
