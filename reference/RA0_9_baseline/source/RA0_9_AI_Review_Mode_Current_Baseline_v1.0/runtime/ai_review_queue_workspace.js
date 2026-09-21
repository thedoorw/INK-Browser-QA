(function(){
'use strict';
const engine=window.RAAIReviewQueue;
const semantic=window.RASemanticBoundaryWorkspace;
const bridge=window.RAWorkbenchBridge;
const queues=new Map();
const selected=new Map();
const $=id=>document.getElementById(id);
const els={
  create:$('createReviewQueueBtn'),summary:$('reviewQueueSummary'),list:$('reviewQueueList'),
  begin:$('beginReviewBtn'),confirm:$('confirmReviewBtn'),reject:$('rejectReviewBtn'),
  unresolved:$('unresolvedReviewBtn'),reopen:$('reopenReviewBtn'),undo:$('undoReviewBtn'),
  redo:$('redoReviewBtn'),gate:$('formalGateBtn'),compile:$('formalCompileBtn'),
  geometry:$('geometryReviewCheck'),structure:$('structureReviewCheck'),runtime:$('runtimeReviewCheck'),
  compared:$('reviewComparedCandidateIds'),reason:$('reviewDecisionReason'),
  runtimeQA:$('runtimeQACheck'),topologyQA:$('topologyQACheck'),roundtripQA:$('roundtripQACheck'),
  caseSelect:$('caseSelect')
};
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const caseId=()=>bridge.currentCase().id;
const queue=()=>queues.get(caseId())||null;
const item=()=>{
  const active=queue();
  const id=selected.get(caseId());
  return active?.items.find(entry=>entry.reviewId===id)||null;
};
const splitIds=value=>[...new Set(String(value||'').split(',').map(part=>part.trim()).filter(Boolean))];
const safe=action=>()=>{
  try{action();}
  catch(error){els.summary.textContent=`Blocked: ${error.message}`;}
};
function combinedDocument(id){
  let boundary=semantic.exportState(id);
  if(!boundary)boundary=semantic.analyzeCase(id);
  const constraints=window.RAConstraintWorkspace?.exportState(id);
  const generators=window.RAGeneratorWorkspace?.exportState(id);
  const compoundTopology=window.RACompoundTopologyWorkspace?.exportState(id);
  if(!boundary&&!constraints&&!generators&&!compoundTopology)return null;
  return {
    ...(boundary||{caseId:id,version:'1.0'}),
    constraintCandidates:constraints?.constraintCandidates||[],
    sharedParameterCandidates:constraints?.sharedParameterCandidates||[],
    generatorCandidates:generators?.generatorCandidates||[],
    compoundCandidates:compoundTopology?.compoundCandidates||[],
    compoundOffsetCandidates:compoundTopology?.compoundOffsetCandidates||[],
    topologyCandidates:compoundTopology?.topologyCandidates||[]
  };
}

function setItem(next,action){
  const active=queue();
  if(!active||!next)return;
  queues.set(caseId(),engine.replaceItem(active,next,action));
  selected.set(caseId(),next.reviewId);
  render();
}

function render(){
  const active=queue();
  const current=item();
  const value=active?engine.summary(active):null;
  els.summary.textContent=value
    ? `${value.total} items · pending ${value.pending} · blocked ${value.blocked} · ready ${value.formalReady} · compiled ${value.formalCompiled}`
    :'尚未建立。先分析 Semantic Boundary，再建立佇列。';
  els.list.innerHTML=active?.items.map(entry=>`
    <div class="review-queue-row ${entry.reviewId===current?.reviewId?'active':''}" data-review-id="${esc(entry.reviewId)}">
      <span class="semantic-state">${esc(entry.state)}</span>
      <b>${esc(entry.targetId)}</b>
      <small>${esc(entry.targetKind)} · blockers ${(entry.formalBlockers||[]).length}</small>
    </div>`).join('')||'<div class="review-queue-row"><small>沒有審查項目。</small></div>';
  if(current){
    els.geometry.checked=current.geometryCheck.passed;
    els.structure.checked=current.structureCheck.passed;
    els.runtime.checked=current.runtimeCheck.passed;
    els.compared.value=(current.candidateIdsCompared||[]).join(', ');
    els.reason.value=current.decisionReason||'';
    els.runtimeQA.checked=current.qa.runtime;
    els.topologyQA.checked=current.qa.topology;
    els.roundtripQA.checked=current.qa.roundtrip;
  }
  const state=current?.state;
  els.begin.disabled=state!=='AUTO_PROPOSED';
  els.confirm.disabled=state!=='AI_REVIEWING';
  els.reject.disabled=state!=='AI_REVIEWING';
  els.unresolved.disabled=state!=='AI_REVIEWING';
  els.reopen.disabled=!state||['AUTO_PROPOSED','AI_REVIEWING'].includes(state);
  els.undo.disabled=!current?.history?.length;
  els.redo.disabled=!current?.future?.length;
  els.gate.disabled=!['AI_CONFIRMED','FORMAL_BLOCKED'].includes(state);
  els.compile.disabled=state!=='FORMAL_READY';
}

function createQueue(){
  const document=combinedDocument(caseId());
  if(!document)return;
  const next=engine.createQueue(document,{
    caseId:caseId(),
    authoringVersion:'RA0.7-working'
  });
  queues.set(caseId(),next);
  selected.set(caseId(),next.items[0]?.reviewId||null);
  render();
}

els.list.addEventListener('click',event=>{
  const row=event.target.closest('[data-review-id]');
  if(row){selected.set(caseId(),row.dataset.reviewId);render();}
});
els.create.addEventListener('click',createQueue);
els.begin.addEventListener('click',safe(()=>setItem(engine.beginReview(item(),'AI'),'BEGIN_REVIEW')));
els.confirm.addEventListener('click',safe(()=>{
  const current=item();
  const compared=splitIds(els.compared.value);
  const notes=String(els.reason.value||'').trim();
  setItem(engine.confirm(current,{
    reviewer:'AI',
    geometryCheck:{passed:els.geometry.checked,notes:notes?[notes]:[]},
    structureCheck:{passed:els.structure.checked,notes:notes?[notes]:[]},
    runtimeCheck:{passed:els.runtime.checked,notes:notes?[notes]:[]},
    evidenceIds:current.evidenceIds,
    candidateIdsCompared:compared,
    decisionReason:notes,
    authoringVersion:'RA0.7-working',
    provenance:current.provenance
  }),'AI_CONFIRM');
}));
els.reject.addEventListener('click',safe(()=>setItem(engine.reject(item(),els.reason.value),'AI_REJECT')));
els.unresolved.addEventListener('click',safe(()=>setItem(engine.keepUnresolved(item(),els.reason.value,[]),'KEEP_UNRESOLVED')));
els.reopen.addEventListener('click',safe(()=>setItem(engine.reopen(item(),els.reason.value||'Review reopened'),'REOPEN_REVIEW')));
els.undo.addEventListener('click',()=>setItem(engine.undo(item()),'UNDO'));
els.redo.addEventListener('click',()=>setItem(engine.redo(item()),'REDO'));
els.gate.addEventListener('click',safe(()=>setItem(engine.formalGate(item(),{
  runtime:els.runtimeQA.checked,
  topology:els.topologyQA.checked,
  roundtrip:els.roundtripQA.checked,
  hardFailures:[
    ...(window.RAConstraintWorkspace?.exportState(caseId())?.conflictValidation?.conflicts||[]).map(conflict=>`Constraint conflict ${conflict.id}`),
    ...(window.RADependencyWorkspace?.exportState(caseId())?.summary?.valid===false?['Dependency Graph validation failed.'] : []),
    ...(window.RACompoundTopologyWorkspace?.exportState(caseId())?.weaveGraph?.validation?.valid===false?['Compound Topology weave graph validation failed.'] : []),
    ...((window.RACompoundTopologyWorkspace?.exportState(caseId())?.summary?.unresolvedCrossingCount||0)>0?['Compound Topology contains unresolved crossings.'] : [])
  ]
}),'FORMAL_GATE')));
els.compile.addEventListener('click',safe(()=>setItem(engine.compile(item(),{
  id:'ra-semantic-compiler',
  version:'RA0.7-gate'
}),'FORMAL_COMPILE')));
els.caseSelect.addEventListener('change',()=>setTimeout(render,0));

window.RAAIReviewQueueWorkspace={
  exportState:id=>queues.get(id)||null,
  createForCase:id=>{
    const document=combinedDocument(id);
    if(!document)return null;
    const next=engine.createQueue(document,{caseId:id,authoringVersion:'RA0.7-working'});
    queues.set(id,next);
    return next;
  },
  invalidateTargets:(id,targetIds,reason='Dependency change requires review')=>{
    let active=queues.get(id);
    if(!active)return null;
    for(const targetId of [...new Set(targetIds)]){
      const current=active.items.find(entry=>entry.targetId===targetId);
      if(!current||['AUTO_PROPOSED','AI_REVIEWING'].includes(current.state))continue;
      const reopened=engine.reopen(current,reason);
      active=engine.replaceItem(active,reopened,'DEPENDENCY_INVALIDATION');
    }
    queues.set(id,active);
    if(id===caseId())render();
    return active;
  },
  summary:id=>engine.summary(queues.get(id)||{items:[]})
};
render();
})();
