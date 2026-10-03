export const C019_TEXT_PATH_BROWSER_CASE = String.raw`(async()=>{
  const app=window.INK_APP,api=app?.inkPublicApi;
  if(!api?.tools?.invoke)throw new Error('INK_PUBLIC_API_UNAVAILABLE');
  const required=['describe_ink_capability','propose_ink_edit','approve_ink_edit','execute_ink_edit','get_ink_preview','undo_ink','redo_ink'];
  const tools=api.tools.registry().map(item=>item.name);
  for(const name of required)if(!tools.includes(name))throw new Error('MISSING_TOOL:'+name);
  if(!app.documentOpen){app.documentOpen=true;app.refreshWorkspaceUI?.();}
  app.history.clear();

  const findField=(value,key,depth=0)=>{if(value==null||depth>12||typeof value!=='object')return undefined;if(Object.prototype.hasOwnProperty.call(value,key))return value[key];for(const item of Object.values(value)){const found=findField(item,key,depth+1);if(found!==undefined)return found;}return undefined;};
  const waitFrames=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const hashCanvas=()=>{const data=app.el.canvas.toDataURL('image/png');let h=2166136261;for(let i=0;i<data.length;i++){h^=data.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0).toString(16);};
  const preview=async()=>{const value=await Promise.resolve(api.tools.invoke('get_ink_preview',{scope:'content',maxDimension:900,background:true}));if(value?.status==='FAILED')throw new Error('PREVIEW_FAILED:'+JSON.stringify(value.diagnostics||[]));return{fingerprint:findField(value,'renderFingerprint')||findField(value,'fingerprint')||null,bounds:findField(value,'bounds')||null,status:value.status};};
  const edit=async task=>{
    const p=await Promise.resolve(api.tools.invoke('propose_ink_edit',{task}));if(p?.status==='FAILED')throw new Error('PROPOSE:'+task.operation+':'+JSON.stringify(p.diagnostics||[]));
    const proposalId=findField(p,'proposalId');if(!proposalId)throw new Error('PROPOSAL_ID_MISSING:'+task.operation);
    const a=await Promise.resolve(api.tools.invoke('approve_ink_edit',{proposalId}));if(a?.status==='FAILED')throw new Error('APPROVE:'+task.operation+':'+JSON.stringify(a.diagnostics||[]));
    const token=findField(a,'approvalToken');if(!token)throw new Error('TOKEN_MISSING:'+task.operation);
    const e=await Promise.resolve(api.tools.invoke('execute_ink_edit',{proposalId,approvalToken:token}));if(e?.status==='FAILED')throw new Error('EXECUTE:'+task.operation+':'+JSON.stringify(e.diagnostics||[]));
    await waitFrames();return e;
  };
  const createdPath=await edit({schema:'INK-CHAT-EDIT-TASK',version:1,taskId:'qa-c019-path',operation:'path.create.v1',targets:[],arguments:{
    objectId:'qa-c019-path',name:'C019 Curved Text Guide',shape:'path',fill:'none',stroke:'#b7b7b7',strokeWidth:1,opacity:.55,
    subpaths:[{closed:false,role:'outer',anchors:[
      {x:-220,y:70,out:{x:70,y:-115}},
      {x:0,y:-55,in:{x:-85,y:0},out:{x:85,y:0}},
      {x:220,y:70,in:{x:-70,y:-115}}
    ]}]
  }});
  const pathRef=findField(createdPath,'resultRefs')?.[0];if(!pathRef)throw new Error('PATH_REF_MISSING');

  const createdText=await edit({schema:'INK-CHAT-EDIT-TASK',version:1,taskId:'qa-c019-text',operation:'text.create.v1',targets:[],arguments:{
    text:'NATIVE CURVED TEXT',x:-175,y:10,color:'#202020',fontFamily:'system-ui',fontSize:30,lineHeight:1.2,fontWeight:600,opacity:1
  }});
  const textRef=findField(createdText,'resultRefs')?.[0];if(!textRef)throw new Error('TEXT_REF_MISSING');
  const textBefore=app.findObject(textRef)?.object;if(!textBefore||textBefore.type!=='text')throw new Error('TEXT_NOT_NATIVE_BEFORE');
  if(textBefore.pathText)throw new Error('TEXT_PATH_PREEXISTS');
  app.renderer.render();await waitFrames();
  const straight={canvas:hashCanvas(),preview:await preview()};

  const described=await Promise.resolve(api.tools.invoke('describe_ink_capability',{idOrToolName:'text.path.set.v1'}));
  if(described?.status==='FAILED'||!JSON.stringify(described).includes('text.path.set.v1'))throw new Error('C019_CAPABILITY_MISSING');

  app.history.clear();
  await edit({schema:'INK-CHAT-EDIT-TASK',version:1,taskId:'qa-c019-attach',operation:'text.path.set.v1',targets:[textRef],arguments:{pathRef,startOffset:14,overflow:'clip'}});
  const attached=app.findObject(textRef)?.object,path=app.findObject(pathRef)?.object;
  if(!attached||attached.type!=='text'||attached.id!==textRef.objectId)throw new Error('TEXT_NATIVE_IDENTITY_LOST');
  if(attached.pathText?.pathId!==pathRef.objectId||attached.pathText?.startOffset!==14||attached.pathText?.overflow!=='clip')throw new Error('PATH_DESCRIPTOR_INVALID:'+JSON.stringify(attached.pathText));
  if(!path||path.type!=='path'||path.id!==pathRef.objectId)throw new Error('PATH_IDENTITY_LOST');
  if(app.history.undoStack.length!==1||app.history.undoStack.at(-1)?.label!=='CHAT set Text Path')throw new Error('ATTACH_HISTORY_INVALID');
  app.renderer.render();await waitFrames();
  const curved={canvas:hashCanvas(),preview:await preview()};
  if(curved.canvas===straight.canvas)throw new Error('CURVED_RENDER_UNCHANGED');
  if(straight.preview.fingerprint&&curved.preview.fingerprint&&straight.preview.fingerprint===curved.preview.fingerprint)throw new Error('CURVED_PREVIEW_UNCHANGED');

  const {layoutTextOnPath}=await import('./src/editor/text-layout.js');
  const layout=layoutTextOnPath(attached,path,{measureText:text=>app.renderer.measureCtx.measureText(text).width});
  if(layout.placements.length<3||!layout.placements.some(p=>Math.abs(p.angle)>.02))throw new Error('CURVED_LAYOUT_NOT_OBSERVED');

  const undone=await Promise.resolve(api.tools.invoke('undo_ink',{}));if(undone?.status==='FAILED')throw new Error('UNDO_FAILED');
  await waitFrames();
  const undoText=app.findObject(textRef)?.object;if(undoText?.pathText)throw new Error('UNDO_DESCRIPTOR_RETAINED');
  app.renderer.render();await waitFrames();
  const undoCanvas=hashCanvas();if(undoCanvas!==straight.canvas)throw new Error('UNDO_RENDER_MISMATCH');

  const redone=await Promise.resolve(api.tools.invoke('redo_ink',{}));if(redone?.status==='FAILED')throw new Error('REDO_FAILED');
  await waitFrames();app.renderer.render();await waitFrames();
  const redoText=app.findObject(textRef)?.object,redoCanvas=hashCanvas();
  if(redoText?.type!=='text'||redoText?.pathText?.pathId!==pathRef.objectId)throw new Error('REDO_NATIVE_RELATION_MISSING');
  if(redoCanvas!==curved.canvas)throw new Error('REDO_RENDER_MISMATCH');

  await edit({schema:'INK-CHAT-EDIT-TASK',version:1,taskId:'qa-c019-text-edit',operation:'text.edit.v1',targets:[textRef],arguments:{text:'EDITABLE AFTER CURVE'}});
  const edited=app.findObject(textRef)?.object;if(edited?.type!=='text'||edited.text!=='EDITABLE AFTER CURVE'||edited.pathText?.pathId!==pathRef.objectId)throw new Error('TEXT_EDITABILITY_FAILED');
  const afterEditCanvas=hashCanvas();if(afterEditCanvas===redoCanvas)throw new Error('TEXT_EDIT_RENDER_UNCHANGED');

  const beforeWarpLayout=layoutTextOnPath(edited,app.findObject(pathRef).object,{measureText:text=>app.renderer.measureCtx.measureText(text).width}).placements.map(p=>[p.x,p.y,p.angle]);
  await edit({schema:'INK-CHAT-EDIT-TASK',version:1,taskId:'qa-c019-warp-path',operation:'path.warp.v1',targets:[pathRef],arguments:{strength:.38,maxDisplacement:.3}});
  const warpedPath=app.findObject(pathRef)?.object,afterWarpText=app.findObject(textRef)?.object;
  if(warpedPath?.id!==pathRef.objectId||afterWarpText?.type!=='text'||afterWarpText?.pathText?.pathId!==pathRef.objectId)throw new Error('POST_WARP_IDENTITY_FAILED');
  const afterWarpLayout=layoutTextOnPath(afterWarpText,warpedPath,{measureText:text=>app.renderer.measureCtx.measureText(text).width}).placements.map(p=>[p.x,p.y,p.angle]);
  if(JSON.stringify(beforeWarpLayout)===JSON.stringify(afterWarpLayout))throw new Error('TEXT_DID_NOT_FOLLOW_WARP');
  app.renderer.render();await waitFrames();
  const warped={canvas:hashCanvas(),preview:await preview()};if(warped.canvas===afterEditCanvas)throw new Error('WARP_RENDER_UNCHANGED');

  const serialized=JSON.stringify(app.doc),restored=JSON.parse(serialized);
  const restoredText=restored.pages.flatMap(page=>page.layers.flatMap(layer=>layer.objects||[])).find(o=>o.id===textRef.objectId);
  if(restored.formatVersion!==4||restoredText?.type!=='text'||restoredText?.pathText?.pathId!==pathRef.objectId)throw new Error('PERSISTENCE_DESCRIPTOR_FAILED');

  return {
    passed:true,
    operation:'text.path.set.v1',
    textRef,pathRef,
    straight,curved,warped,
    curvedPlacementCount:layout.placements.length,
    curvedAnglesObserved:layout.placements.filter(p=>Math.abs(p.angle)>.02).length,
    historyLabel:'CHAT set Text Path',
    undoStatus:undone.status,
    redoStatus:redone.status,
    undoCanvas,redoCanvas,
    editableAfterCurve:true,
    followsWarp:true,
    persistence:{formatVersion:restored.formatVersion,textType:restoredText.type,pathText:restoredText.pathText}
  };
})()`;
