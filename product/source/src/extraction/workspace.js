import { Matrix, uid } from '../core/index.js';
import { findPageObject } from '../document/hierarchy.js';
import { moveAnchor } from '../vector/vector-core.js';
import { executeExtraction, normalizePaths, requireValue, checkAbort, sha256, validateRaster } from './core.js';
import { radialEvidence, sectorMask, reconstructRadial } from './structure.js';
const copy=value=>JSON.parse(JSON.stringify(value));

export async function extractIntoDocument(app, request, adapter, { referenceSrc, matrix=Matrix.identity(), signal }={}) {
  const doc=app.doc,page=app.page(),layer=app.layer();
  requireValue(!app.history.pending && !layer.locked && layer.visible!==false,'EXTRACTION_TARGET_UNAVAILABLE');
  requireValue(Matrix.isInvertible(matrix),'EXTRACTION_SINGULAR_TRANSFORM');
  requireValue(typeof referenceSrc==='string' && /^data:image\/(png|jpeg|webp);base64,/.test(referenceSrc),'EXTRACTION_EMBEDDED_REFERENCE_REQUIRED');
  const before=JSON.stringify(doc),pageId=page.id,layerId=layer.id;
  const result=await executeExtraction(request,adapter,{signal});
  // Give queued cancel/document-switch actions a chance before the atomic commit.
  await new Promise(resolve=>setTimeout(resolve,0));checkAbort(signal);
  requireValue(app.doc===doc && app.page().id===pageId && app.layer().id===layerId && JSON.stringify(doc)===before && !app.history.pending,'EXTRACTION_STALE_DOCUMENT');
  const batchId=uid(),referenceId=`${batchId}-reference`;
  const paths=normalizePaths(result.paths,batchId,result.provenance).paths;
  const image={id:referenceId,type:'image',name:request.source.name,src:referenceSrc,w:request.raster.width,h:request.raster.height,
    matrix:[...matrix],opacity:0.5,locked:true,metadata:{extractionReference:{schema:result.schema,source:copy(request.source),pixelSha256:result.provenance.pixelSha256}}};
  for(const path of paths) {
    path.matrix=Matrix.multiply(matrix,path.matrix);path.fill=null;path.stroke='#b3261e';path.strokeWidth=1;
    path.metadata.extraction={...path.metadata.extraction,referenceObjectId:referenceId,batchId};
  }
  const targets=[app.layerObjectsPath(layer)];requireValue(Array.isArray(targets[0]),'EXTRACTION_TARGET_PATH');
  // The original image is embedded in its existing image object. No new asset store.
  app.history.pushScoped('Reference → editable Path',targets,()=>layer.objects.push(image,...paths));
  app.selection=paths.map(object=>({layerId:layer.id,objectId:object.id}));
  app.spatialDirty=true;app.refreshAll?.();
  return {...result,paths,referenceObjectId:referenceId,batchId};
}
export async function reconstructStructureIntoDocument(app, request, adapter, {
  referenceObjectId = null,
  matrix = Matrix.identity(),
  count = null,
  threshold = 128,
  signal
} = {}) {
  const doc=app.doc,page=app.page(),layer=app.layer();
  requireValue(!app.history.pending && !layer.locked && layer.visible!==false,'EXTRACTION_TARGET_UNAVAILABLE');
  requireValue(Matrix.isInvertible(matrix),'EXTRACTION_SINGULAR_TRANSFORM');
  requireValue(referenceObjectId && findPageObject(page,referenceObjectId)?.object?.metadata?.extractionReference,'EXTRACTION_STRUCTURE_REFERENCE_REQUIRED');
  validateRaster(request?.raster);
  const before=JSON.stringify(doc),pageId=page.id,layerId=layer.id;
  const evidence=radialEvidence(request.raster,{threshold});
  const selectedCount=Number.isInteger(count)?count:evidence.candidates[0]?.count;
  requireValue(Number.isInteger(selectedCount)&&evidence.candidates.some(item=>item.count===selectedCount),'EXTRACTION_STRUCTURE_COUNT');
  const mask=sectorMask(request.raster,request.source,evidence,{count:selectedCount,sector:0,threshold});
  const prototypeResult=await executeExtraction({
    ...request,
    mask,
    parameters:{...(request.parameters||{}),threshold,structureAware:true,radialCount:selectedCount,sector:0}
  },adapter,{signal});
  await new Promise(resolve=>setTimeout(resolve,0));checkAbort(signal);
  requireValue(app.doc===doc && app.page().id===pageId && app.layer().id===layerId && JSON.stringify(doc)===before && !app.history.pending,'EXTRACTION_STALE_DOCUMENT');

  const batchId=uid();
  for(const path of prototypeResult.paths){
    path.matrix=Matrix.multiply(matrix,path.matrix);
    path.fill=null;path.stroke='#2f718f';path.strokeWidth=1;
    path.metadata.extraction={...path.metadata.extraction,referenceObjectId,batchId,structureAware:true,radialCount:selectedCount,sector:0};
  }
  const repeat=reconstructRadial(prototypeResult.paths,evidence,{
    count:selectedCount,
    id:`${batchId}-structure-repeat`,
    prototypeSetId:`${batchId}-structure-prototype`
  });
  repeat.metadata={
    ...repeat.metadata,
    extraction:{...(repeat.metadata?.extraction||{}),referenceObjectId,batchId,structureAware:true,radialCount:selectedCount},
    structureAware:{
      schema:'INK-STRUCTURE-AWARE-WORKSPACE/1',
      radialCount:selectedCount,
      prototypePathCount:prototypeResult.paths.length,
      effectiveInstanceCount:selectedCount,
      referenceObjectId,
      source:copy(request.source)
    }
  };
  const targets=[app.layerObjectsPath(layer)];requireValue(Array.isArray(targets[0]),'EXTRACTION_TARGET_PATH');
  app.history.pushScoped('Structure-Aware radial reconstruction',targets,()=>layer.objects.push(repeat));
  app.selection=[{layerId:layer.id,objectId:repeat.id}];
  app.spatialDirty=true;app.refreshAll?.();
  const candidate=evidence.candidates.find(item=>item.count===selectedCount);
  return {
    schema:'INK-STRUCTURE-AWARE-WORKSPACE/1',
    batchId,
    repeat,
    repeatId:repeat.id,
    referenceObjectId,
    radialCount:selectedCount,
    maskIoU:candidate?.maskIoU??null,
    prototypePaths:prototypeResult.paths,
    prototypeDiagnostics:copy(prototypeResult.diagnostics),
    evidence:copy(evidence)
  };
}

export function correctExtractionAnchor(app,{objectId,subpath=0,node=0,x,y,maxDistance=32}) {
  const found=findPageObject(app.page(),objectId);
  requireValue(found?.object.type==='path' && found.object.metadata?.extraction,'EXTRACTION_PATH_NOT_FOUND');
  requireValue(!app.history.pending && !found.effectiveLocked && found.effectiveVisible!==false && Matrix.isInvertible(found.worldMatrix),'EXTRACTION_TARGET_UNAVAILABLE');
  const anchor=found.object.subpaths[subpath]?.anchors[node];
  requireValue(anchor && [x,y,maxDistance].every(Number.isFinite) && maxDistance>0 && maxDistance<=128 && Math.hypot(x-anchor.x,y-anchor.y)<=maxDistance,'EXTRACTION_CORRECTION_BOUND');
  app.history.pushScoped('Correct extracted node',[app.objectPath(found)],()=>moveAnchor(found.object,subpath,node,x,y));
  app.spatialDirty=true;app.refreshAll?.();
}
export function setReferenceOverlay(app,referenceObjectId,opacity) {
  const found=findPageObject(app.page(),referenceObjectId);
  requireValue(found?.object.type==='image' && found.object.metadata?.extractionReference && Number.isFinite(opacity) && opacity>=0 && opacity<=1 && !app.history.pending,'EXTRACTION_OVERLAY_INVALID');
  app.history.pushScoped('Reference overlay',[app.objectPath(found)],()=>{found.object.opacity=opacity;});
  app.refreshAll?.();
}
export async function decodeReferenceFile(file) {
  requireValue(file && ['image/png','image/jpeg','image/webp'].includes(file.type) && file.size<=16_000_000,'EXTRACTION_IMAGE_FILE');
  const bytes=new Uint8Array(await file.arrayBuffer()),source={name:file.name,sha256:await sha256(bytes)};
  const bitmap=await createImageBitmap(file);
  try {
    requireValue(bitmap.width*bitmap.height<=4_000_000,'EXTRACTION_RASTER_SIZE');
    const canvas=document.createElement('canvas');canvas.width=bitmap.width;canvas.height=bitmap.height;
    const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(bitmap,0,0);
    const raster=ctx.getImageData(0,0,bitmap.width,bitmap.height);validateRaster(raster);
    const referenceSrc=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(reader.error);reader.readAsDataURL(file);});
    return {source,raster,referenceSrc};
  } finally {bitmap.close();}
}
