import tracer from '../vendor/imagetracer-1.2.6.js';
import { imageTracerAdapter } from './adapters.js';
import { extractIntoDocument, decodeReferenceFile, correctExtractionAnchor, setReferenceOverlay } from './workspace.js';
export function installExtraction(app) {
  const adapter=imageTracerAdapter(tracer);let controller=null,last=null;
  app.extraction={extract:(request,options)=>extractIntoDocument(app,request,adapter,options),correct:edit=>correctExtractionAnchor(app,edit),overlay:(id,value)=>setReferenceOverlay(app,id,value)};
  const host=document.querySelector('#studioReport')?.parentElement;if(!host)return;
  const panel=document.createElement('details');
  panel.innerHTML='<summary>參考圖 → 路徑</summary><input type="file" accept="image/png,image/jpeg,image/webp" aria-label="參考圖"><label>明暗閾值 <input type="number" value="128" min="0" max="255"></label><button type="button">擷取路徑</button><button type="button">取消</button><label>原圖透明度 <input type="range" min="0" max="1" step="0.1" value="0.5"></label><output></output>';
  host.append(panel);
  const [file,threshold,opacity]=panel.querySelectorAll('input'),[run,cancel]=panel.querySelectorAll('button'),report=panel.querySelector('output');
  cancel.onclick=()=>controller?.abort();
  opacity.onchange=()=>{try{if(last)app.extraction.overlay(last.referenceObjectId,Number(opacity.value));}catch(e){report.textContent=e.message;}};
  run.onclick=async()=>{
    if(controller)return;controller=new AbortController();run.disabled=true;report.textContent='擷取中…';
    try {
      const reference=await decodeReferenceFile(file.files?.[0]);
      last=await app.extraction.extract({...reference,parameters:{threshold:Number(threshold.value)}},{referenceSrc:reference.referenceSrc,signal:controller.signal});
      report.textContent=`${last.diagnostics.paths} 路徑 · ${last.diagnostics.nodes} 節點`;app.fitContent?.();
    } catch(error) {report.textContent=error.code==='EXTRACTION_CANCELLED'?'已取消':`擷取失敗：${error.message}`;}
    finally {controller=null;run.disabled=false;}
  };
}
