// Real Canvas2D checks against the installed product Renderer; no product mutation engine.
export const IMAGE_STACK_CACHE_REVIEW_CASE = String.raw`(async()=>{
  const app=window.INK_APP,r=app.renderer;
  const {createColorRaster,serializeColorRaster}=await import('./src/image/color-management-core.js');
  const check=(v,m)=>{if(!v)throw new Error(m);};
  const hash=c=>{let h=2166136261;for(const v of c.getContext('2d').getImageData(0,0,c.width,c.height).data){h^=v;h=Math.imul(h,16777619);}return h>>>0;};
  const source=document.createElement('canvas');source.width=64;source.height=48;
  const sc=source.getContext('2d');for(let y=0;y<48;y++){sc.fillStyle='rgb('+y*4+','+(255-y*4)+',90)';sc.fillRect(0,y,64,1);}
  const src=source.toDataURL(),loaded=new Image();loaded.src=src;await loaded.decode();
  const cache=r.studioImageCache,oldModified=app.doc.modifiedAt;
  const o={id:'cache-review-external',type:'image',src,w:64,h:48,adjustments:[{id:'a',type:'brightnessContrast',params:{brightness:8,contrast:12},enabled:true,opacity:1,mask:null}],filterStack:[{id:'f',type:'gaussianBlur',params:{radius:1},enabled:true,opacity:1,mask:null}],effects:[],rasterMask:null};
  const sink=document.createElement('canvas');sink.width=64;sink.height=48;const ctx=sink.getContext('2d');
  r.imageCache.set(src,loaded);r.studioImageCache=new Map();
  const draw=()=>{ctx.clearRect(0,0,64,48);r.drawImage(ctx,o);return hash(sink);};
  const retained=()=>Array.from(r.studioImageCache.values()).at(-1);
  const times=[],checks=[];
  const fresh=expected=>{const saved=r.studioImageCache;r.studioImageCache=new Map();check(draw()===expected,'FRESH_PIXEL_PARITY');r.studioImageCache=saved;};
  try{
    let t=performance.now(),base=draw();const coldMs=performance.now()-t,first=retained();fresh(base);
    for(let i=0;i<4;i++){app.doc.modifiedAt='cache-review-unrelated-'+i;t=performance.now();check(draw()===base,'WARM_PIXELS');times.push(performance.now()-t);check(retained()===first&&r.studioImageCache.size===1,'UNRELATED_EDIT_RECOMPUTED');}
    checks.push('unrelated-document-warm-hit');
    o.adjustments[0].params.brightness=30;const changed=draw();check(changed!==base&&retained()!==first,'ADJUSTMENT_STALE');fresh(changed);checks.push('adjustment-invalidation');
    o.adjustments[0].params.brightness=8;check(draw()===base,'UNDO_STACK_EXACT');o.adjustments[0].params.brightness=30;check(draw()===changed,'REDO_STACK_EXACT');checks.push('stack-state-roundtrip');
    sc.fillStyle='#e328a9';sc.fillRect(0,0,64,48);o.src=source.toDataURL();const secondImage=new Image();secondImage.src=o.src;await secondImage.decode();r.imageCache.set(o.src,secondImage);const replaced=draw();check(replaced!==changed,'SOURCE_STALE');fresh(replaced);checks.push('source-invalidation');
    const samples=new Uint8Array(64*48*3);for(let i=0;i<samples.length;i++)samples[i]=(i*13)%256;
    o.rasterState={colorRaster:serializeColorRaster(createColorRaster({width:64,height:48,data:samples}))};app.doc.modifiedAt='raster-before';const rasterBefore=draw(),before=retained();samples.fill(230);o.rasterState.colorRaster=serializeColorRaster(createColorRaster({width:64,height:48,data:samples}));app.doc.modifiedAt='raster-after';const rasterAfter=draw();check(retained()!==before&&rasterAfter!==rasterBefore,'RASTER_MUTATION_STALE');fresh(rasterAfter);checks.push('raster-invalidation');
    delete o.rasterState;app.doc.modifiedAt='external-again';check(draw()===replaced,'RASTER_EXTERNAL_TRANSITION');checks.push('raster-external-transition');
    r.studioImageCache.clear();check(draw()===replaced,'CLEAR_PARITY');checks.push('clear-rebuild');
    return {passed:true,checks,coldMs,warmMs:times,hashes:{base,changed,replaced,rasterBefore,rasterAfter},canvas:[64,48],measurement:'real browser Canvas2D; no baseline browser speedup claim'};
  }finally{r.studioImageCache=cache;app.doc.modifiedAt=oldModified;r.imageCache.delete(src);r.imageCache.delete(o.src);}
})()`;
