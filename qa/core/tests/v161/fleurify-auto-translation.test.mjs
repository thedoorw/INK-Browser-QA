import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { UniversalProgramImporter } from '../../src/program-import/importer.js';
import { RecipeEngine, installProgramImportSchema } from '../../src/recipe/recipe-engine.js';
import { createAnchor, createPath } from '../../src/vector/vector-core.js';
import { deterministicBlankDocument } from '../../src/headless/session-manager.js';

const source = await readFile(new URL('../../external-assets/benchmarks/fleurify/fleurify.js', import.meta.url), 'utf8');
const provenance = { sourceUrl: 'https://github.com/johnwun/js4ai/blob/master/fleurify.js', revision: 'master' };
const license = { spdx: 'LicenseRef-John-Wundes-JS4AI', url: 'http://www.wundes.com/js4ai/copyright.txt' };
function basePath(){
 const pts=[[397,170],[510,215],[560,330],[510,445],[397,492],[284,445],[234,330],[284,215]];
 return createPath({id:'fleurify-outline-8',name:'Eight Anchor Base',fill:'#db7892',stroke:'#653243',strokeWidth:3,subpaths:[{closed:true,role:'outer',anchors:pts.map(([x,y],i)=>createAnchor(x,y,null,null,{id:`anchor-${i}`,mode:'corner'}))}]});
}
function setup(){const document=deterministicBlankDocument(16101);const path=basePath();document.pages[0].layers[0].objects.push(path);return{document,path};}

test('original .js is detected, scanned and automatically compiled',()=>{
 const importer=new UniversalProgramImporter({inkVersion:'1.6.1'});
 const report=importer.importAsset({name:'fleurify.js',text:source,license,provenance,safetyMode:'TRANSLATE_ONLY',compile:true});
 assert.equal(report.detection.format,'ILLUSTRATOR_JSX');
 assert.equal(report.detection.extension,'js');
 assert.equal(report.security.status,'PASS');
 assert.equal(report.security.findings.some(x=>x.ruleId==='FILESYSTEM_WRITE'),false);
 assert.equal(report.recipe.parameters.percentage.default,100);
 assert.equal(report.recipe.steps.some(x=>x.op==='pathpoint'),true);
 assert.equal(report.conversionReport.compileStatus,'COMPLETE');
});

test('100 and 70 modify handles, preserve anchors, replay and invalid input rollback',()=>{
 const importer=new UniversalProgramImporter({inkVersion:'1.6.1'});
 const report=importer.importAsset({name:'fleurify.js',text:source,license,provenance,safetyMode:'TRANSLATE_ONLY',compile:true});
 const a=setup(), engine=new RecipeEngine();installProgramImportSchema(engine);engine.registerRecipe(report.recipe);
 const anchorSnapshot=structuredClone(a.path.subpaths[0].anchors.map(({id,x,y})=>({id,x,y})));
 const r100=engine.execute(report.recipe,{document:a.document,inputs:[{...a.path,role:'target'}],roles:{target:[a.path]},parameters:{percentage:100}});
 assert.deepEqual(a.path.subpaths[0].anchors.map(({id,x,y})=>({id,x,y})),anchorSnapshot);
 assert.deepEqual(a.path.subpaths[0].anchors[0].in,{x:113,y:45});
 assert.deepEqual(a.path.subpaths[0].anchors[0].out,{x:-113,y:45});
 const hash100=r100.result.documentHash;
 const b=setup();const e2=new RecipeEngine();installProgramImportSchema(e2);e2.registerRecipe(report.recipe);
 const replay=e2.execute(report.recipe,{document:b.document,roles:{target:[b.path]},parameters:{percentage:100}});
 assert.equal(replay.result.documentHash,hash100);
 const c=setup();const e3=new RecipeEngine();installProgramImportSchema(e3);e3.registerRecipe(report.recipe);
 e3.execute(report.recipe,{document:c.document,roles:{target:[c.path]},parameters:{percentage:70}});
 assert.notDeepEqual(c.path.subpaths[0].anchors[0].in,a.path.subpaths[0].anchors[0].in);
 assert.deepEqual(c.path.subpaths[0].anchors[0].in,{x:79.1,y:31.499999999999996});
 const invalid=setup();const e4=new RecipeEngine();installProgramImportSchema(e4);e4.registerRecipe(report.recipe);
 assert.throws(()=>e4.execute(report.recipe,{document:invalid.document,roles:{target:[invalid.path]},parameters:{percentage:'bad'}}),/INK_PARAMETER_INVALID/);
 assert.deepEqual(invalid.path.subpaths[0].anchors.map(({in:hin,out})=>({in:hin,out})),basePath().subpaths[0].anchors.map(({in:hin,out})=>({in:hin,out})));
});
