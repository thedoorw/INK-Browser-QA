import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { imageTracerAdapter } from '../product/source/src/extraction/adapters.js';
import {
  CHAT_REFERENCE_DECOMPOSITION_OPERATION,
  createChatReferenceHandoffAdapter
} from '../product/source/src/ai/chat-reference-handoff.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=async relative=>readFile(path.join(root,relative),'utf8');

{
  let tracedInput=null,tracedOptions=null;
  const tracer={
    imagedataToTracedata(input,options){
      tracedInput=input; tracedOptions=options;
      return {
        palette:[{r:240,g:80,b:90,a:255},{r:50,g:140,b:90,a:255}],
        layers:[
          [{segments:[{x1:0,y1:0,x2:4,y2:0},{x1:4,y1:0,x2:4,y2:4},{x1:4,y1:4,x2:0,y2:4},{x1:0,y1:4,x2:0,y2:0}],holechildren:[]}],
          [{segments:[{x1:1,y1:1,x2:3,y2:1},{x1:3,y1:1,x2:3,y2:3},{x1:3,y1:3,x2:1,y2:3},{x1:1,y1:3,x2:1,y2:1}],holechildren:[]}]
        ]
      };
    },
    getsvgstring(){
      return '<svg><path fill="#f0505a" d="M0 0L4 0L4 4L0 4Z"/><path fill="#328c5a" d="M1 1L3 1L3 3L1 3Z"/></svg>';
    }
  };
  const adapter=imageTracerAdapter(tracer);
  const raster={width:2,height:1,data:new Uint8ClampedArray([240,80,90,255,50,140,90,255])};
  const result=await adapter.extract({raster,parameters:{mode:'color-regions',numberOfColors:6,pathOmit:2}});
  assert.equal(tracedOptions.numberofcolors,6);
  assert.equal(tracedOptions.colorsampling,2);
  assert.deepEqual([...tracedInput.data],[...raster.data]);
  assert.match(result.svg,/#f0505a/);
  assert.match(result.warnings[0],/Quantized color-region trace/);
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
  const workspace=await source('product/source/src/extraction/workspace.js');
  const install=await source('product/source/src/extraction/install.js');
  const handoff=await source('product/source/src/ai/chat-reference-handoff.js');
  assert.match(adapters,/mode==='color-regions'/);
  assert.match(adapters,/tracer\.imagedataToTracedata\(raster,options\)/);
  assert.match(workspace,/decodeReferenceFile\(file\)/);
  assert.match(workspace,/executeExtraction\([\s\S]*mode:'color-regions'/);
  assert.match(workspace,/const colorLayer=defaultLayer\('Color'\),lineLayer=defaultLayer\('Line'\)/);
  assert.match(workspace,/const linePaths=colorPaths\.map/);
  assert.match(workspace,/out\.fill=null;[\s\S]*out\.stroke=lineStroke/);
  assert.match(workspace,/app\.history\.pushScoped\('Reference → Color \+ Line layers'/);
  assert.match(install,/decomposeReference:/);
  assert.match(handoff,/decomposeReference\(referenceObjectId, options = \{\}\)/);
  assert.match(handoff,/commands:\[CHAT_REFERENCE_DECOMPOSITION_OPERATION\]/);
  assert.doesNotMatch(workspace,/centerline/i);
  assert.doesNotMatch(workspace,/semantic labeling/i);
}

console.log('INK-CHAT-VALIDATION-001 Phase B line-color focused QA: PASS');
