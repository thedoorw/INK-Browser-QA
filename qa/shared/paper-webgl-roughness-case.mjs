export const PAPER_WEBGL_ROUGHNESS_CASE = String.raw`(async()=>{
  const app=window.INK_APP,api=app?.inkPublicApi;
  if(!api?.tools?.invoke)throw new Error('INK_PUBLIC_API_UNAVAILABLE');
  if(!app.documentOpen){app.documentOpen=true;app.refreshWorkspaceUI?.();}
  app.history.clear();
  const invoke=(tool,input={})=>Promise.resolve(api.tools.invoke(tool,input));
  const find=(value,key,depth=0)=>{
    if(value==null||depth>10||typeof value!=='object')return undefined;
    if(Object.prototype.hasOwnProperty.call(value,key))return value[key];
    for(const item of Object.values(value)){const found=find(item,key,depth+1);if(found!==undefined)return found;}
  };
  const frames=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const preview=async()=>{
    await frames();
    const r=await invoke('get_ink_preview',{scope:'content',background:false,maxDimension:800});
    if(r?.status!=='COMPLETED')throw new Error('PREVIEW_FAILED');
    return r.outputHandles?.[0]?.renderFingerprint||null;
  };
  const edit=async task=>{
    const proposed=await invoke('propose_ink_edit',{task});
    if(proposed?.status!=='PROPOSED')throw new Error('PROPOSE_FAILED:'+JSON.stringify(proposed));
    const proposalId=find(proposed,'proposalId'),approved=await invoke('approve_ink_edit',{proposalId});
    const result=await invoke('execute_ink_edit',{proposalId,approvalToken:find(approved,'approvalToken')});
    if(result?.status!=='EXECUTED'||find(result,'changed')!==true)throw new Error('EXECUTE_FAILED:'+JSON.stringify(result));
    return result;
  };
  const strokeTask={schema:'INK-CHAT-EDIT-TASK',version:1,taskId:'qa-webgl-roughness-brush',operation:'stroke.create.v1',targets:[],arguments:{
    kind:'brush',color:'#355d73',size:78,opacity:.92,flow:.86,wetness:.9,grain:.34,bristle:.3,seed:9182,
    samples:[
      {x:-145,y:-35,pressure:.3,timestamp:0},
      {x:-55,y:55,pressure:.82,timestamp:22},
      {x:45,y:-5,pressure:.96,timestamp:44},
      {x:145,y:42,pressure:.55,timestamp:66}
    ]
  }};
  const paperTask=value=>({schema:'INK-CHAT-EDIT-TASK',version:1,taskId:'qa-webgl-roughness-paper-'+String(value).replace('.','-'),operation:'page.paper.set.v1',targets:[],arguments:{key:'roughness',value}});
  const created=await edit(strokeTask);
  const objectId=find(created,'objectId');
  const flat=()=>app.page().layers.flatMap(layer=>layer.objects||[]);
  const object=flat().find(item=>item.id===objectId);
  if(!object||object.type!=='stroke'||object.kind!=='brush')throw new Error('STROKE_INVALID');
  const identity=JSON.stringify(object);
  const paperBefore=JSON.parse(JSON.stringify(app.page().paper));
  const historyBefore=app.history.undoStack.length;
  const baseline=await preview();
  const roughEdit=await edit(paperTask(.95));
  const paperAfter=JSON.parse(JSON.stringify(app.page().paper));
  const changed=await preview();
  if(!baseline||!changed||baseline===changed)throw new Error('ROUGHNESS_RENDER_NO_DELTA');
  if(paperAfter.roughness!==.95)throw new Error('ROUGHNESS_STATE');
  for(const key of Object.keys(paperBefore)){
    if(key==='roughness')continue;
    if(JSON.stringify(paperBefore[key])!==JSON.stringify(paperAfter[key]))throw new Error('ROUGHNESS_SCOPE:'+key);
  }
  if(app.history.undoStack.length!==historyBefore+1)throw new Error('ROUGHNESS_HISTORY_COUNT');
  if(JSON.stringify(flat().find(item=>item.id===objectId))!==identity)throw new Error('ROUGHNESS_MUTATED_STROKE');
  const diagnostics=app.renderer?.naturalMedia?.diagnostics?.()||null;
  if(diagnostics?.activeBackend!=='webgl2-multichannel')throw new Error('WEBGL_BACKEND_NOT_ACTIVE:'+diagnostics?.activeBackend);
  const undone=await invoke('undo_ink',{});if(undone?.status==='FAILED')throw new Error('UNDO_FAILED');
  const undoPreview=await preview();if(undoPreview!==baseline)throw new Error('UNDO_RENDER_NOT_RESTORED');
  const redone=await invoke('redo_ink',{});if(redone?.status==='FAILED')throw new Error('REDO_FAILED');
  const redoPreview=await preview();if(redoPreview!==changed)throw new Error('REDO_RENDER_NOT_RESTORED');

  const mod=await import(location.origin+'/src/render/index.js?roughness-parity=1');
  const makeStroke=(id,kind,y)=>({stroke:{
    id,type:'stroke',kind,color:kind==='drybrush'?'#6a573e':'#355d73',size:54,opacity:.92,pressure:.9,taper:.08,flow:.86,
    wetness:kind==='drybrush'?.52:.9,grain:kind==='drybrush'?.72:.28,bristle:kind==='drybrush'?.7:.28,seed:kind==='drybrush'?28182:18182,
    points:[{x:-110,y:-12,p:.28,t:0},{x:-35,y:30,p:.82,t:22},{x:45,y:-8,p:.96,t:44},{x:118,y:24,p:.5,t:66}]
  },matrix:[1,0,0,1,0,y],opacity:1});
  const entries=[makeStroke('parity-brush','brush',-12),makeStroke('parity-dry','drybrush',24)];
  const lowPaper={...paperBefore,roughness:.05},highPaper={...paperBefore,roughness:.95};
  const hashCanvas=canvas=>{
    const data=canvas.toDataURL('image/png');let h=2166136261;
    for(let i=0;i<data.length;i++){h^=data.charCodeAt(i);h=Math.imul(h,16777619);}
    return (h>>>0).toString(16);
  };
  const canvas2d=new mod.Canvas2DMultiChannelInkRenderer({maxDimension:512,maxPixels:262144});
  const cLow=canvas2d.render(entries,lowPaper,{transient:true,preferredScale:1.35,maxDimension:512,maxPixels:262144});
  const cHigh=canvas2d.render(entries,highPaper,{transient:true,preferredScale:1.35,maxDimension:512,maxPixels:262144});
  if(!cLow||!cHigh)throw new Error('CANVAS2D_PARITY_RENDER_FAILED');
  const canvasLowHash=hashCanvas(cLow.canvas),canvasHighHash=hashCanvas(cHigh.canvas);
  if(canvasLowHash===canvasHighHash)throw new Error('CANVAS2D_ROUGHNESS_NO_DELTA');

  const webgl=new mod.WebGLMultiChannelInkRenderer({maxDimension:512,maxPixels:262144});
  const wLow=webgl.render(entries,lowPaper,{transient:true,preferredScale:1.35,maxDimension:512,maxPixels:262144});
  const wHigh=webgl.render(entries,highPaper,{transient:true,preferredScale:1.35,maxDimension:512,maxPixels:262144});
  if(!wLow||!wHigh)throw new Error('WEBGL_PARITY_RENDER_FAILED:'+JSON.stringify(webgl.diagnostics()));
  const webglLowHash=hashCanvas(wLow.canvas),webglHighHash=hashCanvas(wHigh.canvas);
  if(webglLowHash===webglHighHash)throw new Error('WEBGL_ROUGHNESS_NO_DELTA');

  const sampleLow=mod.paperSampleAt(91.25,-43.75,lowPaper),sampleHigh=mod.paperSampleAt(91.25,-43.75,highPaper);
  if(!(sampleHigh.resistance>sampleLow.resistance))throw new Error('CANVAS2D_RESISTANCE_DIRECTION');
  if(sampleLow.absorbency!==sampleHigh.absorbency)throw new Error('ROUGHNESS_CHANGED_ABSORBENCY_MODEL');
  const shaderSource=await fetch(location.origin+'/src/render/webgl/multi-channel-ink-webgl.js?roughness-source=1').then(r=>r.text());
  if(!shaderSource.includes('uniform float u_roughness;')||!shaderSource.includes('(1.0-paper)*u_roughness*.35'))throw new Error('WEBGL_ROUGHNESS_BINDING_MISSING');
  if(shaderSource.includes('resistance=clamp(u_sizing*.72+(1.0-paper)*u_granulation'))throw new Error('WEBGL_GRANULATION_STILL_DRIVES_RESISTANCE');
  webgl.dispose();

  return {
    passed:true,
    operation:'page.paper.set.v1',
    roughnessOnly:true,
    paperBefore,
    paperAfter,
    absorbencyPreserved:paperBefore.absorbency===paperAfter.absorbency,
    baseline,
    changed,
    undoPreview,
    redoPreview,
    historyBefore,
    historyAfter:app.history.undoStack.length,
    activeBackend:diagnostics.activeBackend,
    objectId,
    strokeIdentityStable:true,
    paperProfileFingerprint:find(roughEdit,'paperProfileFingerprint')||null,
    directParity:{
      canvas2d:{low:canvasLowHash,high:canvasHighHash,changed:canvasLowHash!==canvasHighHash},
      webgl:{low:webglLowHash,high:webglHighHash,changed:webglLowHash!==webglHighHash},
      resistance:{low:sampleLow.resistance,high:sampleHigh.resistance,direction:'HIGHER_ROUGHNESS_HIGHER_RESISTANCE'},
      absorbency:{low:sampleLow.absorbency,high:sampleHigh.absorbency,preserved:sampleLow.absorbency===sampleHigh.absorbency}
    },
    naturalMedia:diagnostics
  };
})()`;
