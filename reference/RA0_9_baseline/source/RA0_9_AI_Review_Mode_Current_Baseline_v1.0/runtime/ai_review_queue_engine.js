(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.RAAIReviewQueue=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';

const VERSION='1.1-rc2';
const STATES=Object.freeze([
  'AUTO_PROPOSED','AI_REVIEWING','AI_CONFIRMED','AI_REJECTED',
  'UNRESOLVED','FORMAL_BLOCKED','FORMAL_READY','FORMAL_COMPILED'
]);
const RC2_STATES=Object.freeze([
  'WORK_REVIEW_CONFIRMED','MAIN_AI_REVIEW_REQUIRED','MAIN_AI_CONFIRMED'
]);
const ALL_STATES=Object.freeze([...STATES,...RC2_STATES]);
const TRANSITIONS=Object.freeze({
  AUTO_PROPOSED:['AI_REVIEWING'],
  AI_REVIEWING:['AI_CONFIRMED','WORK_REVIEW_CONFIRMED','AI_REJECTED','UNRESOLVED'],
  AI_CONFIRMED:['FORMAL_BLOCKED','FORMAL_READY','AI_REVIEWING'],
  WORK_REVIEW_CONFIRMED:['MAIN_AI_REVIEW_REQUIRED','AI_REVIEWING'],
  MAIN_AI_REVIEW_REQUIRED:['MAIN_AI_CONFIRMED','AI_REJECTED','UNRESOLVED','AI_REVIEWING'],
  MAIN_AI_CONFIRMED:['FORMAL_BLOCKED','FORMAL_READY','AI_REVIEWING'],
  AI_REJECTED:['AI_REVIEWING'],
  UNRESOLVED:['AI_REVIEWING'],
  FORMAL_BLOCKED:['AI_REVIEWING','FORMAL_READY'],
  FORMAL_READY:['FORMAL_COMPILED','AI_REVIEWING'],
  FORMAL_COMPILED:['AI_REVIEWING']
});

const clone=value=>JSON.parse(JSON.stringify(value));
const isObject=value=>value&&typeof value==='object'&&!Array.isArray(value);
const now=()=>new Date().toISOString();
const checkShape=value=>isObject(value)&&typeof value.passed==='boolean'&&Array.isArray(value.notes);
const allChecksPassed=checks=>['geometryCheck','structureCheck','runtimeCheck'].every(key=>checkShape(checks[key])&&checks[key].passed);
const usesMainChatAuthority=item=>/RA0[._ -]?9.*RC2|RC2/i.test(String(item?.authoringVersion||''));

function assertState(state){
  if(!ALL_STATES.includes(state))throw new Error(`Unknown review state: ${state}`);
}

function assertTransition(from,to){
  assertState(from);assertState(to);
  if(!(TRANSITIONS[from]||[]).includes(to))throw new Error(`Illegal review transition: ${from} -> ${to}`);
}

function sourceCandidates(document){
  if(!isObject(document))return[];
  const keys=[
    'hierarchyCandidates','splitCandidates','mergeCandidates','relationshipCandidates',
    'gapBridgeCandidates','crossingCandidates','occlusionCandidates','primitiveProvenance',
    'constraintCandidates','sharedParameterCandidates','generatorCandidates',
    'compoundCandidates','compoundOffsetCandidates','topologyCandidates'
  ];
  return keys.flatMap(key=>Array.isArray(document[key])?document[key]:[]);
}

function createItem(candidate,context={}){
  if(!candidate||!candidate.id)throw new Error('Review candidate requires a stable id.');
  const provenance=clone(candidate.provenance||{});
  return {
    reviewId:`review-${candidate.id}`,
    targetId:candidate.id,
    targetKind:candidate.kind||'UNKNOWN',
    state:'AUTO_PROPOSED',
    reviewer:null,
    geometryCheck:{passed:false,notes:[]},
    structureCheck:{passed:false,notes:[]},
    runtimeCheck:{passed:false,notes:[]},
    evidenceIds:[...new Set(candidate.evidenceIds||[])].sort(),
    candidateIdsCompared:[],
    decisionReason:'',
    provenance:{
      ...provenance,
      sourceCandidateId:candidate.id,
      sourceDocumentId:context.sourceDocumentId||null,
      sourceVersion:context.sourceVersion||null
    },
    authoringVersion:context.authoringVersion||'RA0.3-working',
    qa:{runtime:false,topology:false,roundtrip:false,hardFailures:[]},
    workingDraftDirty:Boolean(context.workingDraftDirty),
    formalBlockers:['AI review not completed.'],
    createdAt:context.createdAt||now(),
    reviewedAt:null,
    history:[],
    future:[]
  };
}

function createQueue(document,context={}){
  const items=sourceCandidates(document).map(candidate=>createItem(candidate,{
    ...context,
    sourceDocumentId:context.sourceDocumentId||document?.caseId||null,
    sourceVersion:context.sourceVersion||document?.version||null
  }));
  items.sort((a,b)=>a.targetId.localeCompare(b.targetId));
  return {
    kind:'ra-ai-review-queue',
    version:VERSION,
    caseId:context.caseId||document?.caseId||'unknown',
    authoringVersion:context.authoringVersion||'RA0.3-working',
    items,
    audit:[{
      action:'QUEUE_CREATED',
      targetIds:items.map(item=>item.targetId),
      at:context.createdAt||now()
    }]
  };
}

function snapshot(item){
  const copy=clone(item);
  delete copy.history;
  delete copy.future;
  return copy;
}

function commit(item,next,action,at=now()){
  const output=clone(next);
  output.history=[...(item.history||[]),{action,at,snapshot:snapshot(item)}];
  output.future=[];
  return output;
}

function transition(item,to,patch={},action=`TRANSITION_${to}`,at=now()){
  assertTransition(item.state,to);
  return commit(item,{...clone(item),...clone(patch),state:to},action,at);
}

function beginReview(item,reviewer='AI',at=now()){
  if(!reviewer)throw new Error('Reviewer identity is required.');
  return transition(item,'AI_REVIEWING',{reviewer,formalBlockers:['Review in progress.']},'BEGIN_REVIEW',at);
}

function confirm(item,record,at=now()){
  if(item.state!=='AI_REVIEWING')throw new Error('Only AI_REVIEWING items can be confirmed.');
  if(!record||!allChecksPassed(record))throw new Error('Geometry, structure and Runtime checks must all pass.');
  if(!Array.isArray(record.evidenceIds)||record.evidenceIds.length===0)throw new Error('Confirmation requires Evidence provenance.');
  if(!Array.isArray(record.candidateIdsCompared)||record.candidateIdsCompared.length===0)throw new Error('Confirmation requires compared candidate ids.');
  if(!String(record.decisionReason||'').trim())throw new Error('Confirmation requires a decision reason.');
  const provenance={...(item.provenance||{}),...(record.provenance||{})};
  if(!provenance.sourceCandidateId)throw new Error('Confirmation requires source candidate provenance.');
  const mainChatContract=usesMainChatAuthority(item);
  return transition(item,mainChatContract?'WORK_REVIEW_CONFIRMED':'AI_CONFIRMED',{
    reviewer:record.reviewer||item.reviewer||'AI',
    ...(mainChatContract?{
      reviewAuthority:'WORK',
      mainAIReviewStatus:'MAIN_AI_REVIEW_REQUIRED'
    }:{}),
    geometryCheck:clone(record.geometryCheck),
    structureCheck:clone(record.structureCheck),
    runtimeCheck:clone(record.runtimeCheck),
    evidenceIds:[...new Set(record.evidenceIds)].sort(),
    candidateIdsCompared:[...new Set(record.candidateIdsCompared)].sort(),
    decisionReason:String(record.decisionReason).trim(),
    provenance,
    reviewedAt:record.reviewedAt||at,
    authoringVersion:record.authoringVersion||item.authoringVersion,
    formalBlockers:[mainChatContract
      ?'Explicit Main Chat review is required.'
      :'Runtime, Topology and Roundtrip QA have not been evaluated.']
  },mainChatContract?'WORK_REVIEW_CONFIRM':'AI_CONFIRM',at);
}

function requestMainReview(item,at=now()){
  if(item.state!=='WORK_REVIEW_CONFIRMED'){
    throw new Error('Only WORK_REVIEW_CONFIRMED items can request Main Chat review.');
  }
  return transition(item,'MAIN_AI_REVIEW_REQUIRED',{
    reviewAuthority:'WORK',
    mainAIReviewStatus:'MAIN_AI_REVIEW_REQUIRED',
    formalBlockers:['Explicit Main Chat review is required.']
  },'REQUEST_MAIN_AI_REVIEW',at);
}

function mainConfirm(item,record={},at=now()){
  if(item.state!=='MAIN_AI_REVIEW_REQUIRED'){
    throw new Error('Only MAIN_AI_REVIEW_REQUIRED items can be confirmed by Main Chat.');
  }
  if(record.reviewAuthority!=='MAIN_CHAT'){
    throw new Error('MAIN_AI_CONFIRMED requires MAIN_CHAT authority.');
  }
  if(record.silentFormalization!==false){
    throw new Error('Silent formalization is forbidden.');
  }
  if(!String(record.decisionReason||item.decisionReason||'').trim()){
    throw new Error('Main Chat confirmation requires a decision reason.');
  }
  return transition(item,'MAIN_AI_CONFIRMED',{
    reviewer:record.reviewer||'Main Chat',
    reviewAuthority:'MAIN_CHAT',
    mainAIReviewStatus:'MAIN_AI_CONFIRMED',
    decisionReason:String(record.decisionReason||item.decisionReason).trim(),
    reviewedAt:record.reviewedAt||at,
    formalBlockers:['Runtime, Topology and Roundtrip QA have not been evaluated.']
  },'MAIN_AI_CONFIRM',at);
}

function reject(item,reason,at=now()){
  if(item.state!=='AI_REVIEWING')throw new Error('Only AI_REVIEWING items can be rejected.');
  if(!String(reason||'').trim())throw new Error('Rejection reason is required.');
  return transition(item,'AI_REJECTED',{
    decisionReason:String(reason).trim(),
    reviewedAt:at,
    formalBlockers:['AI rejected the candidate.']
  },'AI_REJECT',at);
}

function keepUnresolved(item,reason,missingEvidence=[],at=now()){
  if(item.state!=='AI_REVIEWING')throw new Error('Only AI_REVIEWING items can remain unresolved.');
  if(!String(reason||'').trim())throw new Error('Unresolved reason is required.');
  return transition(item,'UNRESOLVED',{
    decisionReason:String(reason).trim(),
    missingEvidence:[...new Set(missingEvidence)].sort(),
    reviewedAt:at,
    formalBlockers:['Evidence is insufficient.']
  },'KEEP_UNRESOLVED',at);
}

function reopen(item,reason='Review reopened',at=now()){
  if(item.state==='AI_REVIEWING'||item.state==='AUTO_PROPOSED')throw new Error(`Cannot reopen ${item.state}.`);
  return transition(item,'AI_REVIEWING',{
    decisionReason:String(reason),
    reviewedAt:null,
    formalBlockers:['Review reopened; previous promotion is invalid.']
  },'REOPEN_REVIEW',at);
}

function formalGate(item,qa={},at=now()){
  const mainChatContract=usesMainChatAuthority(item);
  const acceptedStates=mainChatContract
    ?['MAIN_AI_CONFIRMED','FORMAL_BLOCKED']
    :['AI_CONFIRMED','FORMAL_BLOCKED'];
  if(!acceptedStates.includes(item.state)){
    throw new Error(mainChatContract
      ?'Formal Gate requires explicit MAIN_AI_CONFIRMED.'
      :'Formal Gate accepts only AI_CONFIRMED or FORMAL_BLOCKED items.');
  }
  const normalizedQA={
    runtime:Boolean(qa.runtime),
    topology:Boolean(qa.topology),
    roundtrip:Boolean(qa.roundtrip),
    hardFailures:[...new Set(qa.hardFailures||[])].sort()
  };
  const blockers=[];
  if(mainChatContract&&(
    item.reviewAuthority!=='MAIN_CHAT'||
    item.mainAIReviewStatus!=='MAIN_AI_CONFIRMED'
  ))blockers.push('Traceable Main Chat confirmation record is missing.');
  if(!allChecksPassed(item))blockers.push('Three-layer AI confirmation is incomplete.');
  if(!item.reviewedAt||!item.reviewer)blockers.push('Traceable AI confirmation record is missing.');
  if(!item.provenance?.sourceCandidateId)blockers.push('Candidate provenance is missing.');
  if(!item.evidenceIds?.length)blockers.push('Evidence ids are missing.');
  if(!item.candidateIdsCompared?.length)blockers.push('Candidate comparison record is missing.');
  if(!item.decisionReason)blockers.push('Decision reason is missing.');
  if(item.workingDraftDirty)blockers.push('Working Draft requires Gate, Score and Review rerun.');
  if(!normalizedQA.runtime)blockers.push('Runtime QA did not pass.');
  if(!normalizedQA.topology)blockers.push('Topology QA did not pass.');
  if(!normalizedQA.roundtrip)blockers.push('Roundtrip QA did not pass.');
  blockers.push(...normalizedQA.hardFailures);
  const target=blockers.length?'FORMAL_BLOCKED':'FORMAL_READY';
  return transition(item,target,{qa:normalizedQA,formalBlockers:blockers},`FORMAL_GATE_${target}`,at);
}

function compile(item,compiler={},at=now()){
  if(item.state!=='FORMAL_READY')throw new Error('Only FORMAL_READY items can be formally compiled.');
  if(item.formalBlockers?.length)throw new Error('Formal blockers must be empty.');
  return transition(item,'FORMAL_COMPILED',{
    compiler:{
      id:compiler.id||'ra-semantic-compiler',
      version:compiler.version||'unassigned',
      compiledAt:at,
      sourceReviewId:item.reviewId
    }
  },'FORMAL_COMPILE',at);
}

function undo(item){
  const history=[...(item.history||[])];
  if(!history.length)return clone(item);
  const previous=history.pop();
  const current=snapshot(item);
  return {
    ...clone(previous.snapshot),
    history,
    future:[{action:previous.action,at:previous.at,snapshot:current},...(item.future||[])]
  };
}

function redo(item){
  const future=[...(item.future||[])];
  if(!future.length)return clone(item);
  const next=future.shift();
  return {
    ...clone(next.snapshot),
    history:[...(item.history||[]),{action:`REDO_${next.action}`,at:now(),snapshot:snapshot(item)}],
    future
  };
}

function replaceItem(queue,item,action='ITEM_UPDATED',at=now()){
  const index=queue.items.findIndex(entry=>entry.reviewId===item.reviewId);
  if(index<0)throw new Error(`Review item not found: ${item.reviewId}`);
  const output=clone(queue);
  output.items[index]=clone(item);
  output.audit.push({action,targetIds:[item.targetId],at});
  return output;
}

function summary(queue){
  const states=Object.fromEntries(ALL_STATES.map(state=>[state,0]));
  for(const item of queue?.items||[])states[item.state]=(states[item.state]||0)+1;
  return {
    total:queue?.items?.length||0,
    states,
    formalReady:states.FORMAL_READY,
    formalCompiled:states.FORMAL_COMPILED,
    blocked:states.FORMAL_BLOCKED,
    pending:states.AUTO_PROPOSED+states.AI_REVIEWING+states.WORK_REVIEW_CONFIRMED+
      states.MAIN_AI_REVIEW_REQUIRED+states.UNRESOLVED
  };
}

return {
  VERSION,STATES,RC2_STATES,TRANSITIONS,sourceCandidates,createItem,createQueue,beginReview,
  confirm,requestMainReview,mainConfirm,reject,keepUnresolved,reopen,formalGate,
  compile,undo,redo,replaceItem,summary
};
});
