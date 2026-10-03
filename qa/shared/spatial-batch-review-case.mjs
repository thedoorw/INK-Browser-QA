export const SPATIAL_BATCH_REVIEW_CASE = String.raw`(async()=>{
  const app=window.INK_APP,api=app.inkPublicApi;
  const check=(v,m)=>{if(!v)throw new Error(m);};
  const field=(v,k)=>{if(!v||typeof v!=='object')return; if(Object.hasOwn(v,k))return v[k];for(const a of Object.values(v)){const f=field(a,k);if(f!==undefined)return f;}};
  const frame=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  const edit=async(task)=>{const p=await api.tools.invoke('propose_ink_edit',{task});check(p.status!=='FAILED','PROPOSE:'+JSON.stringify(p.diagnostics));const proposalId=field(p,'proposalId');const a=await api.tools.invoke('approve_ink_edit',{proposalId});check(a.status!=='FAILED','APPROVE');const e=await api.tools.invoke('execute_ink_edit',{proposalId,approvalToken:field(a,'approvalToken')});check(e.status==='EXECUTED','EXECUTE:'+JSON.stringify(e.diagnostics));await frame();return e;};
  app.documentOpen=true;app.refreshWorkspaceUI?.();
  const refs=[];
  for(let i=0;i<16;i++){const e=await edit({schema:'INK-CHAT-EDIT-TASK',version:1,taskId:'spatial-create-'+i,operation:'path.create.v1',targets:[],arguments:{objectId:'spatial-batch-'+i,name:'Spatial batch '+i,shape:'rectangle',x:20+(i%4)*45,y:20+Math.floor(i/4)*45,width:24,height:24,fill:'#d4878b',stroke:'#49383b',strokeWidth:1,opacity:1}});refs.push(field(e,'resultRefs')[0]);}
  app.selection=[];app.refreshSelectionUI();app.renderer.render();await frame();app.history.clear();
  const objects=()=>refs.map(ref=>app.findObject({layerId:ref.layerId,objectId:ref.objectId}));
  const geometry=()=>JSON.stringify(objects().map(f=>({id:f.object.id,matrix:f.object.matrix,subpaths:f.object.subpaths})));
  const hash=()=>{const text=app.el.canvas.toDataURL();let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;};
  const bounds=(o,e)=>app.renderer.objectWorldBounds(o,e.parentWorldMatrix);
  const verify=()=>{const live=app.ensureSpatialIndex(),fresh=new live.constructor({capacity:live.capacity});fresh.rebuild(app.page(),bounds);const signature=index=>JSON.stringify([...index.itemById].map(([id,i])=>({id,b:i.bounds,depth:i.depth,locked:i.effectiveLocked,visible:i.effectiveVisible,order:i.renderOrder})).sort((a,b)=>a.id.localeCompare(b.id)));check(signature(live)===signature(fresh),'INDEX_FRESH_METADATA');for(const ref of refs){const item=live.itemById.get(ref.objectId);check(item&&live.query(item.bounds).some(i=>i.object.id===ref.objectId),'QUERY_MISSING:'+ref.objectId);}return live.stats();};
  verify();const original=geometry(),beforeHash=hash(),before=app.spatialIndex.stats();
  const result=await edit({schema:'INK-CHAT-EDIT-TASK',version:1,taskId:'spatial-batch-align',operation:'object.align.v1',targets:refs,arguments:{mode:'left'}});
  const after=verify(),changed=geometry(),afterHash=hash();check(changed!==original&&afterHash!==beforeHash,'NO_VISIBLE_CHANGE');check(after.fullRebuilds===before.fullRebuilds+1,'NOT_SINGLE_BATCH_REBUILD');check(after.incrementalUpdates===before.incrementalUpdates,'PER_OBJECT_UPDATES');check(app.history.undoStack.length===1,'HISTORY_COUNT');
  const preview=await api.tools.invoke('get_ink_preview',{scope:'content',maxDimension:800,background:true});check(preview.status==='COMPLETED','PREVIEW');
  await api.tools.invoke('undo_ink',{});await frame();verify();check(geometry()===original&&hash()===beforeHash,'UNDO_NOT_EXACT');
  await api.tools.invoke('redo_ink',{});await frame();verify();check(geometry()===changed&&hash()===afterHash,'REDO_NOT_EXACT');
  const template=objects()[0].object,fixture={id:'large-spatial-fixture',layers:[{id:'fixture-layer',visible:true,locked:false,opacity:1,objects:Array.from({length:3000},(_,i)=>({...structuredClone(template),id:'large-'+i,matrix:[1,0,0,1,(i%100)*35,Math.floor(i/100)*35]}))}]};
  const Index=app.spatialIndex.constructor,index=new Index();index.rebuild(fixture,bounds);
  const times=[];for(let run=0;run<20;run++){const ids=[];for(let i=0;i<100;i++){fixture.layers[0].objects[i].matrix[4]+=.25;ids.push('large-'+i);}const t=performance.now();check(index.syncObjects(fixture,ids,bounds),'SYNC_FALSE');times.push(performance.now()-t);check(index.items.length===3000&&index.itemById.size===3000,'RETAINED_CARDINALITY');}
  const fresh=new Index();fresh.rebuild(fixture,bounds);const area={x:0,y:0,w:1000,h:1000};const hits=i=>i.query(area).map(x=>x.object.id).sort().join(',');check(hits(index)===hits(fresh),'LARGE_QUERY_PARITY');
  return {passed:true,targets:16,before,after,beforeHash,afterHash,previewStatus:preview.status,undoRedoExact:true,indexFreshParity:true,largeFixture:{objects:3000,batch:100,cycles:20,timesMs:times,stats:index.stats(),queryParity:true},memoryLeakClaim:false};
})()`;
