import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { imageTracerAdapter, boundedColorTraceRaster, COLOR_TRACE_MAX_PIXELS, COLOR_TRACE_MAX_DIMENSION } from '../product/source/src/extraction/adapters.js';
import { executeExtraction } from '../product/source/src/extraction/core.js';
import {
  CHAT_REFERENCE_DECOMPOSITION_OPERATION,
  createChatReferenceHandoffAdapter
} from '../product/source/src/ai/chat-reference-handoff.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=async relative=>readFile(path.join(root,relative),'utf8');

{
  const sourceWidth=1200,sourceHeight=800;
  const raster={width:sourceWidth,height:sourceHeight,data:new Uint8ClampedArray(sourceWidth*sourceHeight*4)};
  for(let y=0;y<sourceHeight;y++)for(let x=0;x<sourceWidth;x++){
    const o=(y*sourceWidth+x)*4;
    raster.data[o]=x<sourceWidth/2?240:50;
    raster.data[o+1]=x<sourceWidth/2?80:140;
    raster.data[o+2]=x<sourceWidth/2?90:90;
    raster.data[o+3]=255;
  }

  const directWork=boundedColorTraceRaster(raster);
  assert.equal(COLOR_TRACE_MAX_PIXELS,64_000);
  assert.equal(COLOR_TRACE_MAX_DIMENSION,320);
  assert.ok(directWork.pixels<=COLOR_TRACE_MAX_PIXELS);
  assert.ok(directWork.width<=COLOR_TRACE_MAX_DIMENSION);
  assert.ok(directWork.height<=COLOR_TRACE_MAX_DIMENSION);
  assert.equal(directWork.downsampled,true);
  assert.ok(Math.abs(directWork.width*directWork.scaleX-sourceWidth)<1e-9);
  assert.ok(Math.abs(directWork.height*directWork.scaleY-sourceHeight)<1e-9);

  let tracedInput=null,tracedOptions=null;
  const tracer={
    imagedataToTracedata(input,options){
      tracedInput=input; tracedOptions=options;
      return {
        palette:[{r:240,g:80,b:90,a:255},{r:50,g:140,b:90,a:255}],
        layers:[
          [{segments:[{x1:0,y1:0,x2:input.width,y2:0},{x1:input.width,y1:0,x2:input.width,y2:input.height},{x1:input.width,y1:input.height,x2:0,y2:input.height},{x1:0,y1:input.height,x2:0,y2:0}],holechildren:[]}],
          []
        ]
      };
    },
    getsvgstring(){
      return '<svg><path fill="#f0505a" d="M0 0L'+tracedInput.width+' 0L'+tracedInput.width+' '+tracedInput.height+'L0 '+tracedInput.height+'Z"/></svg>';
    }
  };

  const adapter=imageTracerAdapter(tracer);
  const adapterResult=await adapter.extract({raster,parameters:{mode:'color-regions',numberOfColors:6,pathOmit:2}});
  assert.equal(tracedOptions.numberofcolors,6);
  assert.equal(tracedOptions.colorsampling,2);
  assert.equal(tracedOptions.colorquantcycles,1);
  assert.ok(tracedInput.width*tracedInput.height<=COLOR_TRACE_MAX_PIXELS);
  assert.ok(tracedInput.width<=COLOR_TRACE_MAX_DIMENSION);
  assert.ok(tracedInput.height<=COLOR_TRACE_MAX_DIMENSION);
  assert.equal(adapterResult.traceRaster.downsampled,true);
  assert.ok(Math.abs(tracedInput.width*adapterResult.coordinateScale.x-sourceWidth)<1e-9);
  assert.ok(Math.abs(tracedInput.height*adapterResult.coordinateScale.y-sourceHeight)<1e-9);
  assert.match(adapterResult.warnings[0],/deterministic bounded work raster/);

  const extracted=await executeExtraction({
    raster,
    source:{name:'large-reference.png',sha256:'a'.repeat(64)},
    parameters:{mode:'color-regions',numberOfColors:6,pathOmit:2}
  },adapter);
  assert.equal(extracted.paths.length,1);
  assert.ok(Math.abs(extracted.paths[0].matrix[0]-extracted.diagnostics.coordinateScale.x)<1e-9);
  assert.ok(Math.abs(extracted.paths[0].matrix[3]-extracted.diagnostics.coordinateScale.y)<1e-9);
  assert.ok(Math.abs(extracted.diagnostics.traceRaster.width*extracted.paths[0].matrix[0]-sourceWidth)<1e-6);
  assert.ok(Math.abs(extracted.diagnostics.traceRaster.height*extracted.paths[0].matrix[3]-sourceHeight)<1e-6);
}

function mockApp(){
  const history={
    undoStack:[],redoStack:[],pending:null,limit:30,
    timeline(){return{entries:[...this.undoStack,...[...this.redoStack].reverse()],applied:this.undoStack.length,limit:this.limit};}
  };
  return {
    doc:{id:'doc-phase-b'},
    history,
    layer:()=>({id:'source-layer'}),
    revisions:{revisionIdFor:()=> 'revision-before'},
    extraction:{
      decode:async()=>null,
      importReference:()=>null,
      async decomposeReference(referenceObjectId){
        history.undoStack.push({label:'Reference → Color + Line layers',objectIds:['color-1','color-2','line-1','line-2'],patchCount:1,captureMode:'scoped'});
        return {
          operation:CHAT_REFERENCE_DECOMPOSITION_OPERATION,
          historyLabel:'Reference → Color + Line layers',
          documentId:'doc-phase-b',
          referenceObjectId,
          source:{name:'flower.png',mimeType:'image/png',sha256:'a'.repeat(64),width:10,height:10,sizeBytes:100},
          colorLayerId:'color-layer',
          lineLayerId:'line-layer',
          colorObjectIds:['color-1','color-2'],
          lineObjectIds:['line-1','line-2'],
          colorCount:2,
          lineCount:2,
          palette:[{color:'#f0505a',regions:1},{color:'#328c5a',regions:1}]
        };
      }
    }
  };
}

{
  const app=mockApp(),audits=[];
  const adapter=createChatReferenceHandoffAdapter(app,{
    auditLog:{add:record=>({format:'INK-AI-AUDIT',auditId:`audit-${audits.push(record)}`})},
    groundedContextProvider:{read:()=>({modules:{provenance:{status:'AVAILABLE',fingerprint:'fp',context:{events:[
      {eventId:'p1',kind:'object-source',target:{type:'object',id:'color-1'}},
      {eventId:'p2',kind:'object-source',target:{type:'object',id:'line-1'}}
    ]}}}})}
  });
  const receipt=await adapter.decomposeReference('reference-1',{numberOfColors:8,lineStroke:'#202020',lineStrokeWidth:1});
  assert.equal(receipt.status,'COMPLETED');
  assert.equal(receipt.operation,CHAT_REFERENCE_DECOMPOSITION_OPERATION);
  assert.equal(receipt.sourceReferenceObjectId,'reference-1');
  assert.equal(receipt.colorLayerId,'color-layer');
  assert.equal(receipt.lineLayerId,'line-layer');
  assert.equal(receipt.colorCount,2);
  assert.equal(receipt.lineCount,2);
  assert.equal(receipt.history.commit.valid,true);
  assert.equal(receipt.history.commit.newestMatches,true);
  assert.equal(receipt.revision.before,receipt.revision.after);
  assert.ok(receipt.audit.auditId);
  assert.equal(audits[0].commands[0],CHAT_REFERENCE_DECOMPOSITION_OPERATION);
  assert.equal(receipt.provenance.status,'AVAILABLE');
  assert.deepEqual(receipt.provenance.eventIds,['p1','p2']);
}

{
  const adapters=await source('product/source/src/extraction/adapters.js');
  const core=await source('product/source/src/extraction/core.js');
  const workspace=await source('product/source/src/extraction/workspace.js');
  const install=await source('product/source/src/extraction/install.js');
  const handoff=await source('product/source/src/ai/chat-reference-handoff.js');
  const browserHarness=await source('qa/runtime/ink-cloud-018-browser-harness.html');
  const runtimeBatch=await source('qa/runtime/run-ink-runtime-batch.mjs');
  assert.match(adapters,/mode==='color-regions'/);
  assert.match(adapters,/boundedColorTraceRaster\(input\.raster/);
  assert.match(adapters,/imagedataToTracedata\(\{width:work\.width,height:work\.height,data:work\.data\},options\)/);
  assert.match(adapters,/COLOR_TRACE_MAX_PIXELS=64_000/);
  assert.match(adapters,/COLOR_TRACE_MAX_DIMENSION=320/);
  assert.match(adapters,/colorsampling:2,colorquantcycles:1,numberofcolors:numberOfColors/);
  assert.doesNotMatch(adapters,/colorsampling:2,colorquantcycles:[2-9]/);
  assert.doesNotMatch(adapters,/new Uint8ClampedArray\(input\.raster\.data\)/);
  assert.match(core,/Matrix\.scale\(scaleX,scaleY\)/);
  assert.match(core,/Matrix\.multiply\(sourceScale,path\.matrix\)/);
  assert.match(workspace,/decodeReferenceFile\(file\)/);
  assert.match(workspace,/executeExtraction\([\s\S]*mode:'color-regions'/);
  assert.match(workspace,/traceMaxPixels:64_000,[\s\S]*traceMaxDimension:320/);
  assert.match(workspace,/const colorLayer=defaultLayer\('Color'\),lineLayer=defaultLayer\('Line'\)/);
  assert.match(workspace,/const linePaths=colorPaths\.map/);
  assert.match(workspace,/out\.fill=null;[\s\S]*out\.stroke=lineStroke/);
  assert.match(workspace,/app\.history\.pushScoped\('Reference → Color \+ Line layers'/);
  assert.match(install,/decomposeReference:/);
  assert.match(handoff,/decomposeReference\(referenceObjectId, options = \{\}\)/);
  assert.match(handoff,/commands:\[CHAT_REFERENCE_DECOMPOSITION_OPERATION\]/);
  assert.doesNotMatch(workspace,/centerline/i);
  assert.doesNotMatch(workspace,/semantic labeling/i);
  assert.match(browserHarness,/phaseBElapsedMs<30000/);
  assert.match(browserHarness,/phaseBTrace\.pixels<=64000/);
  assert.match(browserHarness,/phaseBTrace\.width<=320 && phaseBTrace\.height<=320/);
  assert.match(runtimeBatch,/Harness timeout \(240 seconds\)/);
  assert.match(runtimeBatch,/240000/);
}

console.log('INK-CHAT-VALIDATION-001 Phase B line-color focused QA: PASS');
