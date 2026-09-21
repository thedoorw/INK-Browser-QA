(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.RAAuthoringTransaction=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const VERSION='1.0-freeze';
const clone=value=>JSON.parse(JSON.stringify(value));
function assertUnique(objects){
  const ids=objects.map(x=>x?.id);
  if(ids.some(id=>!id))throw new Error('Every authoring object requires a stable id.');
  if(new Set(ids).size!==ids.length)throw new Error('Duplicate stable id.');
}
function snapshot(document){const out=clone(document);out.history=[];out.future=[];return out;}
function createDocument(caseId,objects=[]){
  assertUnique(objects);
  return {kind:'ra-authoring-transaction-document',version:VERSION,caseId,objects:clone(objects),selectionId:null,revision:0,history:[],future:[]};
}
function beginTransaction(document){return {kind:'ra-authoring-transaction',version:VERSION,caseId:document.caseId,baseRevision:document.revision,operations:[]};}
function addObject(tx,object){const out=clone(tx);out.operations.push({op:'ADD',object:clone(object)});return out;}
function selectObject(tx,id){const out=clone(tx);out.operations.push({op:'SELECT',id});return out;}
function updateObject(tx,id,patch){const out=clone(tx);out.operations.push({op:'UPDATE',id,patch:clone(patch)});return out;}
function deleteObject(tx,id){const out=clone(tx);out.operations.push({op:'DELETE',id});return out;}
function commit(document,tx){
  if(tx.baseRevision!==document.revision)throw new Error('Transaction base revision is stale.');
  const before=snapshot(document),working=snapshot(document);
  for(const operation of tx.operations){
    if(operation.op==='ADD'){
      if(working.objects.some(x=>x.id===operation.object.id))throw new Error(`Duplicate stable id: ${operation.object.id}`);
      working.objects.push(clone(operation.object));
    }else if(operation.op==='SELECT'){
      if(!working.objects.some(x=>x.id===operation.id))throw new Error(`Selection not found: ${operation.id}`);
      working.selectionId=operation.id;
    }else if(operation.op==='UPDATE'){
      const index=working.objects.findIndex(x=>x.id===operation.id);if(index<0)throw new Error(`Object not found: ${operation.id}`);
      working.objects[index]={...working.objects[index],...clone(operation.patch)};
    }else if(operation.op==='DELETE'){
      const index=working.objects.findIndex(x=>x.id===operation.id);if(index<0)throw new Error(`Object not found: ${operation.id}`);
      working.objects.splice(index,1);if(working.selectionId===operation.id)working.selectionId=null;
    }else throw new Error(`Unsupported transaction operation: ${operation.op}`);
  }
  assertUnique(working.objects);
  working.revision=document.revision+1;
  working.history=[...(document.history||[]),{before,after:snapshot(working),operations:clone(tx.operations)}];
  working.future=[];
  return working;
}
function rollback(document,_tx){return clone(document);}
function undo(document){
  const history=[...(document.history||[])];if(!history.length)return clone(document);
  const record=history.pop(),out=clone(record.before);out.history=history;out.future=[record,...(document.future||[])];return out;
}
function redo(document){
  const future=[...(document.future||[])];if(!future.length)return clone(document);
  const record=future.shift(),out=clone(record.after);out.history=[...(document.history||[]),record];out.future=future;return out;
}
return {VERSION,createDocument,beginTransaction,addObject,selectObject,updateObject,deleteObject,commit,rollback,undo,redo};
});
