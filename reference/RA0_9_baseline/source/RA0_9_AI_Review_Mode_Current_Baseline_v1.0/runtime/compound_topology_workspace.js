(function(){
"use strict";
const engine=window.RACompoundTopology;
const bridge=window.RAWorkbenchBridge;
const documents=new Map();
const $=id=>document.getElementById(id);
const els={
  compound:$("compoundInput"),crossing:$("crossingInput"),
  analyze:$("analyzeCompoundBtn"),reconcile:$("reconcileCompoundBtn"),
  offset:$("offsetCompoundBtn"),analyzeCrossing:$("analyzeCrossingBtn"),
  summary:$("compoundTopologySummary"),list:$("compoundTopologyList"),
  caseSelect:$("caseSelect")
};
const esc=value=>String(value??"").replace(/[&<>"']/g,char=>({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
}[char]));
const caseId=()=>bridge.currentCase().id;
const empty=id=>engine.buildDocument(id,[],[],[],[]);
const active=()=>documents.get(caseId())||empty(caseId());
const save=value=>{
  documents.set(caseId(),value);
  window.RAAIReviewQueueWorkspace?.invalidateTargets(
    caseId(),
    [
      ...(value.compoundCandidates||[]),
      ...(value.compoundOffsetCandidates||[]),
      ...(value.topologyCandidates||[])
    ].map(item=>item.id),
    "Compound or topology candidate changed."
  );
  render();
  bridge.renderQA();
  return value;
};
const safe=action=>()=>{
  try{action();}
  catch(error){els.summary.textContent=`Blocked: ${error.message}`;}
};
const parse=(element,label)=>{
  const text=element.value.trim();
  if(!text)throw new Error(`${label} JSON is required.`);
  return JSON.parse(text);
};

function rebuild({compounds,offsets,crossings,pathIds}){
  const current=active();
  return save(engine.buildDocument(
    caseId(),
    compounds??current.compoundCandidates,
    offsets??current.compoundOffsetCandidates,
    crossings??current.topologyCandidates,
    pathIds??current.weaveGraph.paths
  ));
}

function analyze(){
  const value=parse(els.compound,"Compound");
  const candidate=engine.proposeCompound(value,{requestedContinuity:"G1"});
  const current=active();
  rebuild({
    compounds:[...current.compoundCandidates.filter(item=>item.id!==candidate.id),candidate]
  });
}

function reconcile(){
  const value=parse(els.compound,"Compound");
  const repaired=engine.reconcileCompound(value,"G1");
  els.compound.value=JSON.stringify(repaired.compound,null,2);
  const candidate=engine.proposeCompound(repaired.compound,{requestedContinuity:"G1"});
  const current=active();
  rebuild({
    compounds:[...current.compoundCandidates.filter(item=>item.id!==candidate.id),candidate]
  });
}

function offset(){
  const value=parse(els.compound,"Compound");
  const candidate=engine.offsetCompound(value,[-10,10],{targetContinuity:"G1"});
  const current=active();
  rebuild({
    offsets:[...current.compoundOffsetCandidates.filter(item=>item.id!==candidate.id),candidate]
  });
}

function crossing(){
  const value=parse(els.crossing,"Crossing");
  const candidate=engine.proposeCrossing(
    value.pathA,value.pathB,value.point,value.evidence||{},value.decision||{}
  );
  const current=active();
  rebuild({
    crossings:[...current.topologyCandidates.filter(item=>item.id!==candidate.id),candidate],
    pathIds:[...new Set([...current.weaveGraph.paths,value.pathA,value.pathB])]
  });
}

function render(){
  const value=active(),summary=value.summary;
  els.summary.textContent=`compound ${summary.compoundCount} · offset ${summary.compoundOffsetCount} · crossing ${summary.crossingCount} · unresolved ${summary.unresolvedCrossingCount} · topology ${summary.topologyValid?"VALID":"BLOCKED"}`;
  const rows=[
    ...value.compoundCandidates.map(item=>({item,label:`${item.continuity.minimumContinuity} continuity`})),
    ...value.compoundOffsetCandidates.map(item=>({item,label:`${item.members.length} members · ${item.allPassed?"continuity pass":"blocked"}`})),
    ...value.topologyCandidates.map(item=>({item,label:item.crossingState}))
  ];
  els.list.innerHTML=rows.map(({item,label})=>`
    <div class="constraint-row">
      <span class="semantic-state">${esc(item.reviewState)}</span>
      <b>${esc(item.kind)} · ${esc(item.id)}</b>
      <small>${esc(label)} · Formal blocked until AI Review</small>
    </div>`).join("")||'<div class="constraint-row"><small>沒有 Compound / Topology 候選。</small></div>';
}

els.analyze.addEventListener("click",safe(analyze));
els.reconcile.addEventListener("click",safe(reconcile));
els.offset.addEventListener("click",safe(offset));
els.analyzeCrossing.addEventListener("click",safe(crossing));
els.caseSelect.addEventListener("change",()=>setTimeout(render,0));

window.RACompoundTopologyWorkspace={
  exportState:id=>documents.get(id)||null,
  setDocument:(id,value)=>{documents.set(id,value);if(id===caseId())render();return value;},
  pendingCount:id=>{
    const value=documents.get(id);
    return value
      ?value.compoundCandidates.length+value.compoundOffsetCandidates.length+value.topologyCandidates.length
      :0;
  }
};
render();
})();
