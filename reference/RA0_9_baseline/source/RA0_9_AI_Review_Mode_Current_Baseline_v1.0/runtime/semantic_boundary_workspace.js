(function(){
'use strict';
const engine=window.RASemanticBoundary;
const raw=window.RA_RAW_BOUNDARIES||{};
const bridge=window.RAWorkbenchBridge;
const documents=new Map();
const $=id=>document.getElementById(id);
const els={
  analyze:$('analyzeSemanticBoundaryBtn'),
  clear:$('clearSemanticBoundaryBtn'),
  split:$('splitSemanticBoundaryBtn'),
  merge:$('mergeSemanticBoundaryBtn'),
  export:$('exportSemanticBoundaryBtn'),
  summary:$('semanticBoundarySummary'),
  list:$('semanticBoundaryList'),
  caseSelect:$('caseSelect')
};
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const currentCaseId=()=>bridge.currentCase().id;
const currentDocument=()=>documents.get(currentCaseId())||null;

function allCandidates(document){
  if(!document)return[];
  return [
    ...document.hierarchyCandidates,
    ...document.splitCandidates,
    ...document.mergeCandidates,
    ...document.relationshipCandidates,
    ...document.gapBridgeCandidates,
    ...document.crossingCandidates,
    ...document.occlusionCandidates,
    ...document.primitiveProvenance
  ];
}

function render(){
  const document=currentDocument();
  if(!document){
    els.summary.textContent='尚未分析。所有自動結果都將保持 AUTO_PROPOSED。';
    els.list.innerHTML='<div class="semantic-boundary-row"><small>沒有 Semantic Boundary 候選。</small></div>';
  }else{
    const s=document.summary;
    els.summary.textContent=`${s.pendingAIReviewCount} candidates · ${s.relationshipCandidateCount} relations · ${s.crossingCandidateCount} crossings · Formal ready 0`;
    const rows=allCandidates(document).slice(0,240);
    els.list.innerHTML=rows.map(item=>{
      const label=item.relationshipType||item.proposedRole||item.primitiveCandidateType||item.kind;
      const source=item.contourId||item.sourceContourId||item.sourceId||item.boundaryId||(item.evidenceIds||[]).join(', ');
      return `<div class="semantic-boundary-row"><span class="semantic-state">${esc(item.reviewState)}</span><b>${esc(item.id)} · ${esc(label)}</b><small>${esc(source)} · Recipe blocked · AI review required</small></div>`;
    }).join('')||'<div class="semantic-boundary-row"><small>沒有候選。</small></div>';
  }
  els.split.disabled=!(bridge.state.selected?.kind==='contour');
  els.merge.disabled=bridge.state.boundarySelected.size<2;
  bridge.renderQA();
}

function analyze(){
  const source=raw[currentCaseId()];
  if(!source)return;
  documents.set(currentCaseId(),engine.analyze(source));
  render();
}

function clear(){
  documents.delete(currentCaseId());
  render();
}

function proposeSplit(){
  const selected=bridge.state.selected;
  if(selected?.kind!=='contour')return;
  const source=raw[currentCaseId()];
  const contour=source?.contours.find(item=>item.contourId===selected.id);
  if(!contour)return;
  const index=Math.max(1,Math.min(contour.points.length-2,Math.floor(contour.points.length/2)));
  const document=currentDocument()||engine.analyze(source);
  const candidate=engine.proposeSplit(contour,[index]);
  document.splitCandidates=document.splitCandidates.filter(item=>item.id!==candidate.id).concat(candidate);
  document.summary.splitCandidateCount=document.splitCandidates.length;
  document.summary.pendingAIReviewCount=allCandidates(document).length;
  documents.set(currentCaseId(),document);
  render();
}

function proposeMerge(){
  const source=raw[currentCaseId()];
  const contours=[...bridge.state.boundarySelected].map(id=>source?.contours.find(item=>item.contourId===id)).filter(Boolean);
  if(contours.length<2)return;
  const document=currentDocument()||engine.analyze(source);
  const candidate=engine.proposeMerge(contours);
  document.mergeCandidates=document.mergeCandidates.filter(item=>item.id!==candidate.id).concat(candidate);
  document.summary.mergeCandidateCount=document.mergeCandidates.length;
  document.summary.pendingAIReviewCount=allCandidates(document).length;
  documents.set(currentCaseId(),document);
  render();
}

function exportDocument(){
  const boundaryDocument=currentDocument();
  if(!boundaryDocument)return;
  const blob=new Blob([JSON.stringify(boundaryDocument,null,2)],{type:'application/json'});
  const link=document.createElement('a');
  link.href=URL.createObjectURL(blob);
  link.download=`${currentCaseId()}_RA0_2_semantic_boundary.json`;
  link.click();
  setTimeout(()=>URL.revokeObjectURL(link.href),1000);
}

els.analyze.addEventListener('click',analyze);
els.clear.addEventListener('click',clear);
els.split.addEventListener('click',proposeSplit);
els.merge.addEventListener('click',proposeMerge);
els.export.addEventListener('click',exportDocument);
els.caseSelect.addEventListener('change',()=>setTimeout(render,0));
document.getElementById('boundaryList').addEventListener('click',()=>setTimeout(render,0));

window.RASemanticBoundaryWorkspace={
  exportState:caseId=>documents.get(caseId)||null,
  pendingCount:caseId=>allCandidates(documents.get(caseId)).length,
  analyzeCase:caseId=>{
    if(raw[caseId])documents.set(caseId,engine.analyze(raw[caseId]));
    return documents.get(caseId)||null;
  },
  clearCase:caseId=>documents.delete(caseId)
};
render();
})();
