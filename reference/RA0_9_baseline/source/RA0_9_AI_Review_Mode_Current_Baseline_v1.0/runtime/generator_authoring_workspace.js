(function(){
'use strict';
const engine=window.RAGeneratorAuthoring;
const bridge=window.RAWorkbenchBridge;
const documents=new Map();
const selected=new Map();
const $=id=>document.getElementById(id);
const els={
  type:$('generatorType'),sources:$('generatorSourceIds'),parameters:$('generatorParameters'),
  propose:$('proposeGeneratorBtn'),edit:$('editGeneratorBtn'),expand:$('expandGeneratorBtn'),
  collapse:$('collapseGeneratorBtn'),clear:$('clearGeneratorBtn'),
  summary:$('generatorSummary'),list:$('generatorList'),caseSelect:$('caseSelect')
};
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const caseId=()=>bridge.currentCase().id;
const current=()=>documents.get(caseId())||engine.buildDocument(caseId(),[],{});
const splitIds=value=>[...new Set(String(value||'').split(',').map(part=>part.trim()).filter(Boolean))];
const safe=action=>()=>{
  try{action();}
  catch(error){els.summary.textContent=`Blocked: ${error.message}`;}
};
const parseParameters=()=>JSON.parse(els.parameters.value);

function render(){
  const document=current(),activeId=selected.get(caseId());
  els.summary.textContent=`${document.summary.generatorCount} generators · ${document.summary.expandedPrimitiveCount} working primitives · ${document.summary.pendingAIReviewCount} pending · Formal ready 0`;
  els.list.innerHTML=document.generatorCandidates.map(generator=>{
    const expansion=document.workingExpansions[generator.id];
    return `<div class="constraint-row ${generator.id===activeId?'active':''}" data-generator-id="${esc(generator.id)}">
      <span class="semantic-state">${esc(generator.reviewState)}</span>
      <b>${esc(generator.generatorType)} · r${esc(generator.revision)}</b>
      <small>${esc(generator.id)} · expanded ${esc(expansion?.primitiveCount||0)}</small>
    </div>`;
  }).join('')||'<div class="constraint-row"><small>沒有 Generator 候選。</small></div>';
  const active=document.generatorCandidates.find(item=>item.id===activeId);
  els.edit.disabled=!active;
  els.expand.disabled=!active;
  els.collapse.disabled=!active||!document.workingExpansions[active.id];
  if(active){
    els.type.value=active.generatorType;
    els.sources.value=(active.sourceIds||[]).join(', ');
  }
}

function propose(){
  const document=current();
  const generator=engine.propose(els.type.value,parseParameters(),splitIds(els.sources.value));
  const generators=document.generatorCandidates.filter(item=>item.id!==generator.id).concat(generator);
  documents.set(caseId(),engine.buildDocument(caseId(),generators,document.workingExpansions));
  selected.set(caseId(),generator.id);
  render();
}

function edit(){
  const document=current();
  const active=document.generatorCandidates.find(item=>item.id===selected.get(caseId()));
  if(!active)return;
  const generator=engine.edit(active,parseParameters());
  const generators=document.generatorCandidates.map(item=>item.id===active.id?generator:item);
  const expansions={...document.workingExpansions};
  delete expansions[active.id];
  documents.set(caseId(),engine.buildDocument(caseId(),generators,expansions));
  render();
}

function expand(){
  const document=current();
  const active=document.generatorCandidates.find(item=>item.id===selected.get(caseId()));
  if(!active)return;
  const expansions={...document.workingExpansions,[active.id]:engine.expand(active)};
  documents.set(caseId(),engine.buildDocument(caseId(),document.generatorCandidates,expansions));
  render();
}

function collapse(){
  const document=current();
  const active=document.generatorCandidates.find(item=>item.id===selected.get(caseId()));
  const expansion=document.workingExpansions[active?.id];
  if(!active||!expansion)return;
  engine.collapse(active,expansion);
  const expansions={...document.workingExpansions};
  delete expansions[active.id];
  documents.set(caseId(),engine.buildDocument(caseId(),document.generatorCandidates,expansions));
  render();
}

els.list.addEventListener('click',event=>{
  const row=event.target.closest('[data-generator-id]');
  if(!row)return;
  selected.set(caseId(),row.dataset.generatorId);
  const active=current().generatorCandidates.find(item=>item.id===row.dataset.generatorId);
  if(active)els.parameters.value=JSON.stringify(active.parameters,null,2);
  render();
});
els.propose.addEventListener('click',safe(propose));
els.edit.addEventListener('click',safe(edit));
els.expand.addEventListener('click',safe(expand));
els.collapse.addEventListener('click',safe(collapse));
els.clear.addEventListener('click',()=>{documents.delete(caseId());selected.delete(caseId());render();});
els.caseSelect.addEventListener('change',()=>setTimeout(render,0));

window.RAGeneratorWorkspace={
  exportState:id=>documents.get(id)||null,
  setDocument:(id,document)=>{documents.set(id,document);if(id===caseId())render();return document;},
  refresh:render
};
render();
})();
