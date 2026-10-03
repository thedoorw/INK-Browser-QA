// Executes the loaded product renderer with a real browser Canvas2D sink.
export const NATURAL_MEDIA_CACHE_REVIEW_CASE = String.raw`(async()=>{
  const Backend=window.INK_APP?.naturalMedia?.multiChannelCanvas2d?.constructor;
  if(!Backend)throw new Error('NATIVE_CANVAS2D_BACKEND_MISSING');
  const make=()=>new Backend({cacheLimit:2,maxDimension:480,maxPixels:90000});
  const check=(condition,message)=>{if(!condition)throw new Error(message);};
  const hash=result=>{
    const bytes=result.canvas.getContext('2d').getImageData(0,0,result.canvas.width,result.canvas.height).data;
    let h=2166136261;for(const v of bytes){h^=v;h=Math.imul(h,16777619);}return h>>>0;
  };
  const same=(a,b,label)=>{
    for(const key of ['x','y','w','h','scale'])check(a[key]===b[key],label+':'+key);
    check(a.canvas.width===b.canvas.width&&a.canvas.height===b.canvas.height,label+':dimensions');
    check(hash(a)===hash(b),label+':pixels');
  };
  const stroke=(kind,id,y=0)=>({id,type:'stroke',kind,color:'#355d73',size:18,opacity:1,pressure:.9,taper:.08,flow:.78,wetness:.58,grain:.2,bristle:.28,softness:.72,blend:.9,smudge:.92,drag:.78,seed:9182,points:Array.from({length:80},(_,i)=>({x:i*2.2,y:y+Math.sin(i*.08)*18,p:.8,t:i*4}))});
  const entries=['brush','drybrush','blender','smudge'].map((kind,i)=>({stroke:stroke(kind,'browser-cache-'+kind,i*8),matrix:[1,0,0,1,0,0],opacity:1}));
  const paper={absorbency:.62,roughness:.51,fiberStrength:.43,fiberAngle:17,sizing:.23,granulation:.47,seed:241};
  const opts={minimumStrokes:1,preferredScale:1,maxDimension:480,maxPixels:90000};
  const instance=make();let start=performance.now(),first=instance.render(entries,paper,opts),coldMs=performance.now()-start;
  check(first,'COLD_RENDER_MISSING');const warmMs=[];
  for(let i=0;i<5;i++){start=performance.now();check(instance.render(entries,paper,opts)===first,'WARM_NOT_RETAINED');warmMs.push(performance.now()-start);}
  const warmDiagnostics=instance.diagnostics();
  check(warmDiagnostics.preparations===1&&warmDiagnostics.preparationSkips===5,'WARM_PREPARATION_NOT_SKIPPED');
  same(first,make().render(entries,paper,opts),'warm/fresh');
  const changes=[];
  const mutate=(label,fn)=>{
    const before=instance.render(entries,paper,opts);fn();
    const changed=instance.render(entries,paper,opts),fresh=make().render(entries,paper,opts);
    check(changed!==before,label+':STALE_CACHE');same(changed,fresh,label);changes.push({label,hash:hash(changed),bounds:[changed.x,changed.y,changed.w,changed.h],scale:changed.scale});
  };
  mutate('fractional-point',()=>entries[0].stroke.points[24].x+=.001);
  mutate('fractional-opacity',()=>entries[0].opacity=.9999);
  mutate('preferred-scale',()=>opts.preferredScale=1.0002);
  mutate('pixel-budget',()=>opts.maxPixels=110000);
  mutate('dimension-budget',()=>opts.maxDimension=420);
  mutate('paper',()=>paper.roughness=.93);
  const fractionalEntries=[{stroke:{...stroke('brush','fractional'),points:[{x:0,y:0,p:.8},{x:300,y:25,p:.8}]},matrix:[1,0,0,1,0,0],opacity:1}];
  const seed=make().render(fractionalEntries,paper,opts);
  const fractionalOpts={...opts,preferredScale:1,maxDimension:Math.max(seed.w,seed.h)*.60055};
  const fractional=make(),original=fractional.render(fractionalEntries,paper,fractionalOpts);
  fractionalEntries[0].matrix=[1.0004,0,0,1.0004,0,0];
  const changed=fractional.render(fractionalEntries,paper,fractionalOpts),fresh=make().render(fractionalEntries,paper,fractionalOpts);
  check(changed!==original,'FRACTIONAL_TRANSFORM_STALE');same(changed,fresh,'fractional-transform');
  const transient=make();same(transient.render(entries,paper,{...opts,transient:true}),transient.render(entries,paper,{...opts,transient:true}),'transient');
  check(transient.diagnostics().cacheEntries===0&&transient.diagnostics().preparations===2&&transient.diagnostics().preparationSkips===0,'TRANSIENT_CACHE_CHANGED');
  const bounded=make();for(let i=0;i<4;i++){entries[0].stroke.size=18+i;bounded.render(entries,paper,opts);}
  check(bounded.diagnostics().cacheEntries===2&&bounded.diagnostics().evictions===2,'CACHE_LIMIT_CHANGED');
  bounded.clearCache();check(bounded.diagnostics().cacheEntries===0,'CACHE_CLEAR_FAILED');
  return {passed:true,sink:'real-browser-canvas2d',clock:'performance.now',coldMs,warmMs,warmDiagnostics,firstHash:hash(first),changes,fractionalTransform:{originalBounds:[original.x,original.y,original.w,original.h],changedBounds:[changed.x,changed.y,changed.w,changed.h],changedScale:changed.scale,freshScale:fresh.scale,hash:hash(changed)},transient:transient.diagnostics(),bounded:bounded.diagnostics(),speedupVsBaselineClaim:false};
})()`;
