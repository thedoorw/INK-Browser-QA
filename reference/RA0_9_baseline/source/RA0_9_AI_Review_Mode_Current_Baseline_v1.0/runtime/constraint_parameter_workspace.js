(function(){
'use strict';
const engine=window.RAConstraintParameters;
const bridge=window.RAWorkbenchBridge;
const documents=new Map();
const selected=new Map();
const $=id=>document.getElementById(id);
const els={
  type:$('constraintType'),members:$('constraintMemberIds'),tolerance:$('constraintTolerance'),
  propose:$('proposeConstraintBtn'),promote:$('promoteSharedParameterBtn'),clear:$('clearConstraintBtn'),
  summary:$('constraintParameterSummary'),list:$('constraintParameterList'),caseSelect:$('caseSelect')
};
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const caseId=()=>bridge.currentCase().id;
const current=()=>documents.get(caseId())||engine.buildDocument(caseId(),[],[]);
const splitIds=value=>[...new Set(String(value||'').split(',').map(part=>part.trim()).filter(Boolean))];
const safe=action=>()=>{
  try{action();}
  catch(error){els.summary.textContent=`Blocked: ${error.message}`;}
};

function catalog(){
  const active=bridge.currentCase();
  const values=[
    ...(bridge.state.measurementCandidates||[]).filter(item=>item.caseId===active.id),
    ...(active.programs||[]),
    ...(active.decisionModel?.targets||[]).flatMap(target=>target.candidates||[])
  ];
  return new Map(values.filter(item=>item?.id).map(item=>[item.id,item]));
}

function render(){
  const value=current(),activeId=selected.get(caseId());
  const rows=[...value.constraintCandidates,...value.sharedParameterCandidates];
  els.summary.textContent=`${value.summary.constraintCount} constraints · ${value.summary.sharedParameterCount} shared parameters · ${value.summary.conflictCount} conflicts · Formal ready 0`;
  els.list.innerHTML=rows.map(item=>`
    <div class="constraint-row ${item.id===activeId?'active':''}" data-constraint-id="${esc(item.id)}">
      <span class="semantic-state">${esc(item.reviewState)}</span>
      <b>${esc(item.constraintType||item.parameterKind)} · ${esc(item.id)}</b>
      <small>residual ${esc(item.evaluation?.residual??'n/a')} · ${esc(item.conflictState||'separate review required')}</small>
    </div>`).join('')||'<div class="constraint-row"><small>沒有 Constraint 候選。</small></div>';
  const active=rows.find(item=>item.id===activeId);
  const review=window.RAAIReviewQueueWorkspace?.exportState(caseId())?.items.find(item=>item.targetId===activeId);
  els.promote.disabled=!(active?.kind==='CONSTRAINT'&&review?.state==='AI_CONFIRMED'&&active.evaluation?.passed);
}

function propose(){
  const ids=splitIds(els.members.value);
  const available=catalog();
  const members=ids.map(id=>available.get(id));
  if(!ids.length||members.some(member=>!member))throw new Error('Constraint member ID was not found in current measurements, programs or candidates.');
  const document=current();
  const candidate=engine.proposeConstraint(els.type.value,members,{tolerance:Number(els.tolerance.value)});
  const constraints=document.constraintCandidates.filter(item=>item.id!==candidate.id).concat(candidate);
  documents.set(caseId(),engine.buildDocument(caseId(),constraints,document.sharedParameterCandidates));
  selected.set(caseId(),candidate.id);
  render();
}

function promote(){
  const document=current();
  const candidate=document.constraintCandidates.find(item=>item.id===selected.get(caseId()));
  const review=window.RAAIReviewQueueWorkspace?.exportState(caseId())?.items.find(item=>item.targetId===candidate?.id);
  if(!candidate||!review)return;
  const parameter=engine.promoteSharedParameter(candidate,review);
  const parameters=document.sharedParameterCandidates.filter(item=>item.id!==parameter.id).concat(parameter);
  documents.set(caseId(),engine.buildDocument(caseId(),document.constraintCandidates,parameters));
  selected.set(caseId(),parameter.id);
  render();
}

els.list.addEventListener('click',event=>{
  const row=event.target.closest('[data-constraint-id]');
  if(row){selected.set(caseId(),row.dataset.constraintId);render();}
});
els.propose.addEventListener('click',safe(propose));
els.promote.addEventListener('click',safe(promote));
els.clear.addEventListener('click',()=>{documents.delete(caseId());selected.delete(caseId());render();});
els.caseSelect.addEventListener('change',()=>setTimeout(render,0));

window.RAConstraintWorkspace={
  exportState:id=>documents.get(id)||null,
  setDocument:(id,document)=>{documents.set(id,document);return document;},
  catalog
};
render();
})();
