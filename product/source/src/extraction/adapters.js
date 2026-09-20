import { requireValue, checkAbort } from './core.js';
export function binaryRaster({ raster, mask, parameters = {} }) {
  const threshold = parameters.threshold ?? 128;
  requireValue(Number.isFinite(threshold) && threshold >= 0 && threshold <= 255, 'EXTRACTION_THRESHOLD');
  const data = new Uint8ClampedArray(raster.data.length);
  for (let i=0;i<raster.width*raster.height;i++) {
    const o=i*4, dark=raster.data[o]*.2126+raster.data[o+1]*.7152+raster.data[o+2]*.0722 < threshold;
    const foreground=mask ? mask.data[i] === 255 : dark && raster.data[o+3] > 0;
    data[o]=data[o+1]=data[o+2]=foreground?0:255; data[o+3]=255;
  }
  return { width:raster.width,height:raster.height,data };
}
export function imageTracerAdapter(tracer) {
  return { id:'imagetracerjs',version:'1.2.6',async extract(input) {
    requireValue(typeof tracer?.imagedataToTracedata === 'function','EXTRACTION_IMAGETRACER_UNAVAILABLE');
    checkAbort(input.signal);
    const options={ltres:1,qtres:1,pathomit:8,colorsampling:0,colorquantcycles:1,numberofcolors:2,
      pal:[{r:0,g:0,b:0,a:255},{r:255,g:255,b:255,a:255}],scale:1,roundcoords:3,layering:0};
    const trace=tracer.imagedataToTracedata(binaryRaster(input),options);
    trace.layers=trace.layers.map((layer,i)=>trace.palette[i].r<128?layer:[]);
    return { svg:tracer.getsvgstring(trace,options),warnings:['Binary luminance/explicit mask boundary; not semantic segmentation.'] };
  }};
}
export function openCVAdapter(cv, version) {
  requireValue(typeof version==='string' && version.length>0,'EXTRACTION_OPENCV_VERSION');
  return { id:'opencvjs-contours',version,extract(input) {
    requireValue(cv?.Mat && cv?.findContours,'EXTRACTION_OPENCV_UNAVAILABLE');
    checkAbort(input.signal);
    const raster=binaryRaster(input),resources=[];
    const own=x=>(resources.push(x),x);
    try {
      const mat=own(cv.matFromImageData(raster)),gray=own(new cv.Mat()),mask=own(new cv.Mat());
      const contours=own(new cv.MatVector()),hierarchy=own(new cv.Mat());
      cv.cvtColor(mat,gray,cv.COLOR_RGBA2GRAY);cv.threshold(gray,mask,127,255,cv.THRESH_BINARY_INV);
      cv.findContours(mask,contours,hierarchy,cv.RETR_TREE,cv.CHAIN_APPROX_SIMPLE);
      const output=[]; const epsilon=input.parameters?.epsilon ?? 1;
      requireValue(Number.isFinite(epsilon) && epsilon>=0 && epsilon<=20,'EXTRACTION_EPSILON');
      // Keep hierarchy indexes intact; fail on degenerate rings rather than silently relink holes.
      for(let i=0;i<contours.size();i++) {
        const contour=contours.get(i),approx=new cv.Mat();
        try {cv.approxPolyDP(contour,approx,epsilon,true); const points=[];
          for(let j=0;j<approx.data32S.length;j+=2)points.push([approx.data32S[j],approx.data32S[j+1]]);
          output.push({parent:hierarchy.data32S[i*4+3],points});
        } finally {contour.delete();approx.delete();}
      }
      // Omit degenerate nodes and all descendants; reindex remaining parent references.
      const keep=output.map((c,i)=>{let j=i;while(j!==-1){if(output[j].points.length<3)return false;j=output[j].parent;}return true;});
      const remap=new Map();output.forEach((c,i)=>{if(keep[i])remap.set(i,remap.size);});
      return {contours:output.filter((c,i)=>keep[i]).map(c=>({...c,parent:c.parent===-1?-1:remap.get(c.parent)})),warnings:['Threshold mask; degenerate contours omitted.']};
    } finally {for(const value of resources.reverse())value.delete();}
  }};
}
// Inject a verified WASM/native bridge. No model/network acquisition in shared core.
export function vTracerAdapter(convert, version) {
  return {id:'vtracer',version,async extract(input) {
    requireValue(typeof convert==='function','EXTRACTION_VTRACER_UNAVAILABLE');
    checkAbort(input.signal);const svg=await convert(binaryRaster(input),{colormode:'binary',mode:'spline',filter_speckle:4});
    checkAbort(input.signal);return {svg};
  }};
}
