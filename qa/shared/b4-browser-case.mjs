// Shared checked-in qualification; creative mutations use named tools only.
// Direct Core calls below are isolated reset/reapplication compatibility probes.
export const B4_BROWSER_CASE = String.raw`(async()=>{
  const app=window.INK_APP,api=app.inkPublicApi;
  if(!app.documentOpen){app.documentOpen=true;app.refreshWorkspaceUI?.();}
  const clone=v=>JSON.parse(JSON.stringify(v)), eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  const check=(v,msg)=>{if(!v)throw new Error('B4_'+msg);};
  const find=(v,k)=>{if(!v||typeof v!=='object')return; if(Object.hasOwn(v,k))return v[k];for(const a of Object.values(v)){const r=find(a,k);if(r!==undefined)return r;}};
  const invoke=async(tool,input={})=>{const r=await api.tools.invoke(tool,input);check(r.status!=='FAILED',tool+':'+JSON.stringify(r.diagnostics));return r;};
  const frames=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  const preview=async()=>{await frames();const r=await invoke('get_ink_preview',{scope:'content',background:false,maxDimension:800});check(r.status==='COMPLETED','PREVIEW');return r.outputHandles[0].renderFingerprint;};
  const canvas=()=>{let h=2166136261;const s=app.el.canvas.toDataURL();for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0).toString(16);};
  const receipts=[];
  const edit=async t=>{
    const before=JSON.stringify(app.page());
    const p=await invoke('propose_ink_edit',{task:t});check(p.status==='PROPOSED','PROPOSE');
    const proposalId=find(p,'proposalId');const a=await invoke('approve_ink_edit',{proposalId});
    check(JSON.stringify(app.page())===before,'PROPOSAL_APPROVAL_MUTATED');
    const r=await invoke('execute_ink_edit',{proposalId,approvalToken:find(a,'approvalToken')});
    check(r.status==='EXECUTED'&&find(r,'changed')===true,'EXECUTE');receipts.push({operation:t.operation,proposed:p.status,approved:a.status,executed:r.status});await frames();return r;
  };
  const inventory=api.tools.registry().map(v=>v.name);
  for(const operation of ['path.warp.v1','path.distort.v1','path.perspective.v1','stroke.create.v1','page.paper.set.v1','paint.session.create.v1','image.adjustment.add.v1']){
    const d=await invoke('describe_ink_capability',{idOrToolName:operation});check(d.status==='COMPLETED','DISCOVERY:'+operation);
  }
  await edit({taskId:'b4-create-base',operation:'path.create.v1',targets:[],arguments:{objectId:'b4-native-path',shape:'ellipse',cx:0,cy:0,rx:140,ry:95,fill:'#b95573',stroke:'#293848',strokeWidth:5}});
  const lookup=()=>{for(const l of app.page().layers){const o=(l.objects||[]).find(o=>o.id==='b4-native-path');if(o)return {object:o,layer:l};}throw new Error('B4_PATH_MISSING');};
  const target={pageId:app.page().id,layerId:lookup().layer.id,objectId:'b4-native-path'};
  const original=clone(lookup().object.subpaths);const baseline=await preview(),baseCanvas=canvas();
  const deformationUrl=performance.getEntriesByType('resource').map(r=>r.name).find(u=>/\/src\/vector\/deformation\.js(?:\?|$)/.test(u));
  check(deformationUrl,'NATIVE_MODULE_URL');const core=await import(deformationUrl);
  const outcomes={};
  for(const mode of ['warp','distort','perspective']){
    const args=mode==='warp'?{strength:.6,maxDisplacement:.4}:{xOffset:32,yOffset:16};
    const n=app.history.undoStack.length;
    await edit({taskId:'b4-'+mode,operation:'path.'+mode+'.v1',targets:[target],arguments:args});
    let object=lookup().object;check(object.type==='path'&&object.id===target.objectId,'NATIVE_ID');
    check(!eq(object.subpaths,original),'SUBPATH_DELTA:'+mode);
    const state=clone(object.deformation),changed=clone(object.subpaths);
    check(state.type==='INK-NON-DESTRUCTIVE-DEFORMATION'&&state.reversible&&state.revision>0&&eq(state.baseSubpaths,original),'STATE:'+mode);
    check(mode==='warp'?Number.isFinite(state.parameters.bend):state.parameters.projective.mode===mode,'PARAMETERS:'+mode);
    check(app.history.undoStack.length===n+1,'HISTORY_COUNT');
    const resultPreview=await preview(),resultCanvas=canvas();
    check(resultPreview!==baseline&&resultCanvas!==baseCanvas,'RENDER_DELTA:'+mode);
    const history=await invoke('get_ink_history',{});
    await invoke('undo_ink');object=lookup().object;
    check(eq(object.subpaths,original)&&!object.deformation,'UNDO_STATE:'+mode);
    check(await preview()===baseline&&canvas()===baseCanvas,'UNDO_RENDER:'+mode);
    await invoke('redo_ink');object=lookup().object;
    check(eq(object.subpaths,changed)&&eq(object.deformation,state),'REDO_STATE:'+mode);
    check(await preview()===resultPreview&&canvas()===resultCanvas,'REDO_RENDER:'+mode);
    core.applyNonDestructiveDeformation(object,clone(state.parameters));
    check(eq(object.subpaths,changed),'BASE_REAPPLICATION:'+mode);
    core.resetNonDestructiveDeformation(object);app.spatialDirty=true;app.refreshAll();app.renderer.render();
    check(eq(object.subpaths,original)&&!object.deformation,'RESET:'+mode);
    check(await preview()===baseline,'RESET_RENDER:'+mode);
    // Put the exact History post-state back before testing the public Undo route.
    object.subpaths=clone(changed);object.deformation=clone(state);
    await invoke('undo_ink');check(eq(lookup().object.subpaths,original),'RESTORE_BASE');
    outcomes[mode]={stableId:target.objectId,baseSubpathsRetained:true,parameters:state.parameters,deformation:state,subpaths:changed,canvasBefore:baseCanvas,canvasAfter:resultCanvas,previewBefore:baseline,previewAfter:resultPreview,historyLabel:app.history.redoStack.at(-1)?.label,historyStatus:history.status,undoRedoExact:true,resetExact:true,reapplicationFromBaseExact:true};
  }
  check(!eq(outcomes.distort.subpaths,outcomes.perspective.subpaths),'DISTORT_EQUALS_PERSPECTIVE');
  await invoke('redo_ink');await preview();
  return {passed:true,inventory,receipts,outcomes,distortDiffersFromPerspective:true,noPointerEmulation:true,original};
})()`;
