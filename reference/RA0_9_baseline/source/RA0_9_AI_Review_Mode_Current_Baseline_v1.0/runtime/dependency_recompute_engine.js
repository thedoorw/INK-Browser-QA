(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.RADependencyRecompute=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';

const VERSION='1.0';
const clone=value=>JSON.parse(JSON.stringify(value));
const finite=value=>Number.isFinite(Number(value));

function canonical(value){
  if(Array.isArray(value))return `[${value.map(canonical).join(',')}]`;
  if(value&&typeof value==='object')return `{${Object.keys(value).sort().map(key=>`${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}

function hash(text){
  let value=0x811c9dc5;
  for(let index=0;index<text.length;index++){
    value^=text.charCodeAt(index);
    value=Math.imul(value,0x01000193)>>>0;
  }
  return value.toString(16).padStart(8,'0');
}

function normalizeNode(node){
  if(!node?.id)throw new Error('Dependency node requires a stable id.');
  const dependencies=[...new Set(node.dependencies||[])].sort();
  return {
    id:node.id,
    kind:node.kind||'COMPUTED',
    value:clone(node.value??null),
    expression:clone(node.expression??null),
    dependencies,
    reviewTargetId:node.reviewTargetId||null,
    metadata:clone(node.metadata||{}),
    revision:Number(node.revision||0)
  };
}

function validateReferences(graph){
  const missing=[];
  for(const node of Object.values(graph.nodes)){
    for(const dependency of node.dependencies)if(!graph.nodes[dependency])missing.push({nodeId:node.id,dependencyId:dependency});
  }
  return {valid:missing.length===0,missing};
}

function topologicalOrder(graph){
  const visiting=new Set(),visited=new Set(),order=[],cycles=[];
  function visit(id,stack=[]){
    if(visited.has(id))return;
    if(visiting.has(id)){
      const index=stack.indexOf(id);
      cycles.push([...stack.slice(index),id]);
      return;
    }
    visiting.add(id);
    const node=graph.nodes[id];
    if(node)for(const dependency of node.dependencies)visit(dependency,[...stack,id]);
    visiting.delete(id);
    visited.add(id);
    order.push(id);
  }
  Object.keys(graph.nodes).sort().forEach(id=>visit(id,[]));
  if(cycles.length)throw new Error(`Cyclic dependency: ${cycles[0].join(' -> ')}`);
  return order;
}

function validateGraph(graph){
  const references=validateReferences(graph);
  let cycles=[];
  try{topologicalOrder(graph);}
  catch(error){cycles=[String(error.message)];}
  return {valid:references.valid&&cycles.length===0,missing:references.missing,cycles};
}

function createGraph(caseId,nodes=[]){
  const map={};
  for(const input of nodes){
    const node=normalizeNode(input);
    if(map[node.id])throw new Error(`Duplicate dependency node: ${node.id}`);
    map[node.id]=node;
  }
  const graph={
    kind:'ra-dependency-graph',
    version:VERSION,
    caseId,
    revision:0,
    nodes:map,
    history:[],
    future:[],
    lastTransaction:null,
    validation:null
  };
  graph.validation=validateGraph(graph);
  if(!graph.validation.valid)throw new Error(graph.validation.cycles[0]||`Missing dependency ${graph.validation.missing[0]?.dependencyId}`);
  return graph;
}

function dependentsMap(graph){
  const map=new Map(Object.keys(graph.nodes).map(id=>[id,[]]));
  for(const node of Object.values(graph.nodes))for(const dependency of node.dependencies){
    if(map.has(dependency))map.get(dependency).push(node.id);
  }
  for(const values of map.values())values.sort();
  return map;
}

function downstream(graph,changedIds){
  const map=dependentsMap(graph),seen=new Set(changedIds),queue=[...changedIds].sort();
  while(queue.length){
    const id=queue.shift();
    for(const dependent of map.get(id)||[])if(!seen.has(dependent)){
      seen.add(dependent);queue.push(dependent);
    }
  }
  return [...seen].sort();
}

function evaluateExpression(expression,values){
  if(expression===null||expression===undefined)return null;
  if(typeof expression!=='object'||Array.isArray(expression))return clone(expression);
  const op=expression.op;
  if(op==='ref'){
    if(!Object.prototype.hasOwnProperty.call(values,expression.id))throw new Error(`Expression reference is unavailable: ${expression.id}`);
    return clone(values[expression.id]);
  }
  if(op==='literal')return clone(expression.value);
  if(op==='array')return (expression.items||[]).map(item=>evaluateExpression(item,values));
  if(op==='object')return Object.fromEntries(Object.entries(expression.fields||{}).map(([key,value])=>[key,evaluateExpression(value,values)]));
  if(op==='sequence'){
    const start=Number(evaluateExpression(expression.start,values));
    const step=Number(evaluateExpression(expression.step,values));
    const count=Number(evaluateExpression(expression.count,values));
    if(!finite(start)||!finite(step)||!Number.isInteger(count)||count<0)throw new Error('Sequence requires finite start/step and non-negative integer count.');
    return Array.from({length:count},(_value,index)=>start+step*index);
  }
  const args=(expression.args||[]).map(item=>Number(evaluateExpression(item,values)));
  if(!args.length||!args.every(finite))throw new Error(`${op} requires finite numeric arguments.`);
  if(op==='add')return args.reduce((sum,value)=>sum+value,0);
  if(op==='subtract')return args.slice(1).reduce((value,item)=>value-item,args[0]);
  if(op==='multiply')return args.reduce((value,item)=>value*item,1);
  if(op==='divide'){
    if(args.slice(1).some(value=>Math.abs(value)<1e-12))throw new Error('Division by zero.');
    return args.slice(1).reduce((value,item)=>value/item,args[0]);
  }
  throw new Error(`Unsupported dependency expression: ${op}`);
}

function recompute(graph,changedIds){
  const affected=downstream(graph,changedIds);
  const affectedSet=new Set(affected);
  const order=topologicalOrder(graph);
  const values=Object.fromEntries(Object.values(graph.nodes).map(node=>[node.id,clone(node.value)]));
  const recomputed=[];
  for(const id of order){
    const node=graph.nodes[id];
    if(!affectedSet.has(id)||!node.expression)continue;
    const value=evaluateExpression(node.expression,values);
    node.value=clone(value);
    node.revision=Number(node.revision||0)+1;
    values[id]=clone(value);
    recomputed.push(id);
  }
  const reviewTargetIds=[...new Set(affected.map(id=>graph.nodes[id]?.reviewTargetId).filter(Boolean))].sort();
  return {
    graph,
    changedIds:[...changedIds].sort(),
    invalidatedIds:affected,
    recomputedIds:recomputed,
    reviewTargetIds,
    localOutputs:recomputed.filter(id=>['GENERATOR','GEOMETRY','RUNTIME'].includes(graph.nodes[id].kind)).map(id=>({
      nodeId:id,
      kind:graph.nodes[id].kind,
      value:clone(graph.nodes[id].value),
      reviewTargetId:graph.nodes[id].reviewTargetId
    }))
  };
}

function snapshot(graph){
  const value=clone(graph);
  value.history=[];
  value.future=[];
  return value;
}

function beginTransaction(graph){
  return {
    kind:'ra-dependency-transaction',
    version:VERSION,
    caseId:graph.caseId,
    baseRevision:graph.revision,
    changes:{}
  };
}

function setParameter(transaction,nodeId,value){
  const output=clone(transaction);
  output.changes[nodeId]=clone(value);
  return output;
}

function commit(graph,transaction){
  if(transaction.baseRevision!==graph.revision)throw new Error('Transaction base revision is stale.');
  const changeIds=Object.keys(transaction.changes).sort();
  if(!changeIds.length)throw new Error('Transaction has no parameter changes.');
  const working=snapshot(graph);
  for(const id of changeIds){
    const node=working.nodes[id];
    if(!node)throw new Error(`Transaction node not found: ${id}`);
    if(!['PARAMETER','EXTERNAL'].includes(node.kind))throw new Error(`Only PARAMETER or EXTERNAL nodes can be set directly: ${id}`);
    node.value=clone(transaction.changes[id]);
    node.revision=Number(node.revision||0)+1;
  }
  const result=recompute(working,changeIds);
  working.revision=graph.revision+1;
  const transactionId=`tx-${hash(`${graph.caseId}|${graph.revision}|${canonical(transaction.changes)}`)}`;
  working.lastTransaction={
    id:transactionId,
    baseRevision:graph.revision,
    committedRevision:working.revision,
    changedIds:changeIds,
    invalidatedIds:result.invalidatedIds,
    recomputedIds:result.recomputedIds,
    reviewTargetIds:result.reviewTargetIds
  };
  working.history=[...(graph.history||[]),{transactionId,before:snapshot(graph),after:snapshot(working)}];
  working.future=[];
  working.validation=validateGraph(working);
  if(!working.validation.valid)throw new Error('Committed graph is invalid.');
  return {...result,graph:working,transactionId};
}

function undo(graph){
  const history=[...(graph.history||[])];
  if(!history.length)return clone(graph);
  const record=history.pop();
  const restored=clone(record.before);
  restored.history=history;
  restored.future=[record,...(graph.future||[])];
  restored.lastTransaction={id:`undo-${record.transactionId}`,restoredRevision:restored.revision};
  return restored;
}

function redo(graph){
  const future=[...(graph.future||[])];
  if(!future.length)return clone(graph);
  const record=future.shift();
  const restored=clone(record.after);
  restored.history=[...(graph.history||[]),record];
  restored.future=future;
  restored.lastTransaction={id:`redo-${record.transactionId}`,restoredRevision:restored.revision};
  return restored;
}

function addNode(graph,node){
  const output=snapshot(graph),normalized=normalizeNode(node);
  if(output.nodes[normalized.id])throw new Error(`Duplicate dependency node: ${normalized.id}`);
  output.nodes[normalized.id]=normalized;
  output.validation=validateGraph(output);
  if(!output.validation.valid)throw new Error(output.validation.cycles[0]||`Missing dependency ${output.validation.missing[0]?.dependencyId}`);
  output.revision=graph.revision+1;
  output.history=[...(graph.history||[]),{transactionId:`graph-add-${normalized.id}`,before:snapshot(graph),after:snapshot(output)}];
  return output;
}

function updateDependencies(graph,nodeId,dependencies){
  const output=snapshot(graph);
  if(!output.nodes[nodeId])throw new Error(`Dependency node not found: ${nodeId}`);
  output.nodes[nodeId].dependencies=[...new Set(dependencies)].sort();
  output.validation=validateGraph(output);
  if(!output.validation.valid)throw new Error(output.validation.cycles[0]||`Missing dependency ${output.validation.missing[0]?.dependencyId}`);
  output.revision=graph.revision+1;
  output.history=[...(graph.history||[]),{transactionId:`graph-deps-${nodeId}`,before:snapshot(graph),after:snapshot(output)}];
  return output;
}

function fromGeneratorDocument(caseId,document){
  const nodes=[];
  for(const generator of document?.generatorCandidates||[]){
    const fields={};
    for(const [key,value] of Object.entries(generator.parameters||{})){
      const id=`${generator.id}:parameter:${key}`;
      nodes.push({id,kind:'PARAMETER',value,reviewTargetId:generator.id,metadata:{parameterKey:key}});
      fields[key]={op:'ref',id};
    }
    const dependencies=Object.values(fields).map(value=>value.id);
    nodes.push({
      id:`${generator.id}:generator`,
      kind:'GENERATOR',
      value:clone(generator.parameters),
      expression:{op:'object',fields},
      dependencies,
      reviewTargetId:generator.id,
      metadata:{generatorId:generator.id,generatorType:generator.generatorType}
    });
  }
  return createGraph(caseId,nodes);
}

function buildDocument(graph){
  return {
    kind:'ra-dependency-recompute-document',
    version:VERSION,
    caseId:graph.caseId,
    graph:clone(graph),
    summary:{
      nodeCount:Object.keys(graph.nodes).length,
      edgeCount:Object.values(graph.nodes).reduce((sum,node)=>sum+node.dependencies.length,0),
      revision:graph.revision,
      valid:graph.validation?.valid===true,
      undoDepth:graph.history?.length||0,
      redoDepth:graph.future?.length||0
    }
  };
}

return {
  VERSION,canonical,normalizeNode,createGraph,validateGraph,topologicalOrder,
  dependentsMap,downstream,evaluateExpression,recompute,
  beginTransaction,setParameter,commit,undo,redo,addNode,updateDependencies,
  fromGeneratorDocument,buildDocument
};
});
