import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root=path.resolve(process.argv[2]||'.');
const product=path.join(root,'product/source');
const evidenceDir=path.join(root,'evidence');
await fs.mkdir(evidenceDir,{recursive:true});

async function walk(dir){
  const out=[];
  for(const entry of await fs.readdir(dir,{withFileTypes:true})){
    const full=path.join(dir,entry.name);
    if(entry.isDirectory())out.push(...await walk(full));
    else out.push(full);
  }
  return out;
}
const files=await walk(product);
const jsFiles=files.filter(f=>/\.(?:js|mjs)$/.test(f));
const htmlFiles=files.filter(f=>/\.html$/.test(f));
const read=async f=>await fs.readFile(f,'utf8');
const jsPairs=await Promise.all(jsFiles.map(async f=>[f,await read(f)]));
const jsCorpus=jsPairs.map(([,s])=>s).join('\n');
const htmlPairs=await Promise.all(htmlFiles.map(async f=>[f,await read(f)]));
const htmlCorpus=htmlPairs.map(([,s])=>s).join('\n');

const contributionPath=path.join(product,'ui/capability-contributions.js');
const mod=await import(pathToFileURL(contributionPath).href+'?health='+Date.now());
const {
  UI_B_MENU_CONTRIBUTIONS,
  UI_B_TOOL_GROUPS,
  UI_B_DIALOGS,
  UI_B_REQUIRED_PANELS,
  UI_B_GAP_IDS,
  UI_B_PUI_IDS
}=mod;

const controls=await read(path.join(product,'ui/full-capability-controls.js'));
const webShell=await read(path.join(product,'web-shell.js'));
const exact=[...controls.matchAll(/command==='([^']+)'/g)].map(m=>m[1]);
const prefixes=[...controls.matchAll(/command\.startsWith\('([^']+)'\)/g)].map(m=>m[1]);
const routed=command=>exact.includes(command)||prefixes.some(prefix=>command.startsWith(prefix));
const missingRoutes=[...new Set(UI_B_MENU_CONTRIBUTIONS.map(x=>x.command))].filter(x=>!routed(x));
const missingAuthorities=UI_B_MENU_CONTRIBUTIONS.filter(x=>!String(x.authority||'').trim()).map(x=>x.id);
const proxyMissing=UI_B_MENU_CONTRIBUTIONS.filter(x=>x.command.startsWith('proxy:')&&!htmlCorpus.includes('id="'+x.command.slice(6)+'"')).map(x=>({id:x.id,target:x.command.slice(6)}));
const panelMissing=UI_B_REQUIRED_PANELS.filter(id=>!new RegExp("id:\\s*['\"]"+id+"['\"]").test(webShell));
const forbiddenClaims=[/remote plugin/i,/marketplace/i,/plugin sandbox/i,/permission system/i].filter(rx=>rx.test(controls)).map(rx=>String(rx));
const explicitUnsupported={
  psbAdapter:/PSB encode requires a registered adapter/.test(controls),
  rawExport:/RAW export is not supported/.test(controls),
  multichannel:/Multichannel conversion requires explicit channel construction/.test(controls)
};

const interactive=[];
const tagRx=/<(button|input|select|textarea)\b([^>]*)>/gi;
for(const [file,html] of htmlPairs){
  let m;
  while((m=tagRx.exec(html))){
    const tag=m[1].toLowerCase(),attrs=m[2]||'';
    const id=attrs.match(/\bid="([^"]+)"/)?.[1]||null;
    const type=attrs.match(/\btype="([^"]+)"/i)?.[1]?.toLowerCase()||null;
    const disabled=/\bdisabled\b/i.test(attrs);
    const hidden=/\bhidden\b/i.test(attrs)||type==='hidden';
    const dataAttrs=[...attrs.matchAll(/\b(data-[\w-]+)="([^"]*)"/g)].map(x=>({name:x[1],value:x[2]}));
    if(hidden)continue;
    interactive.push({file:path.relative(root,file).replaceAll('\\','/'),tag,id,type,disabled,dataAttrs});
  }
}
function idBound(id){
  if(!id)return false;
  const forms=[
    '#'+id,
    "getElementById('"+id+"')",
    'getElementById("'+id+'")',
    "querySelector('#"+id+"')",
    'querySelector("#'+id+'")'
  ];
  return forms.some(token=>jsCorpus.includes(token));
}
function dataBound(attrs){
  return attrs.some(({name,value})=>{
    const camel=name.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase());
    return jsCorpus.includes('dataset.'+camel)||jsCorpus.includes('['+JSON.stringify(name)+']')||jsCorpus.includes(name);
  });
}
const staticInventory=interactive.map(item=>({
  ...item,
  sourceBound:item.disabled||idBound(item.id)||dataBound(item.dataAttrs)
}));
const unboundStatic=staticInventory.filter(x=>!x.sourceBound);

const checks=[
  {id:'A03',pass:missingRoutes.length===0&&missingAuthorities.length===0&&proxyMissing.length===0&&panelMissing.length===0&&UI_B_PUI_IDS.length===74&&UI_B_GAP_IDS.length===34,detail:{menuContributions:UI_B_MENU_CONTRIBUTIONS.length,toolGroups:UI_B_TOOL_GROUPS.length,dialogs:UI_B_DIALOGS.length,panels:UI_B_REQUIRED_PANELS.length,missingRoutes,missingAuthorities,proxyMissing,panelMissing,puiCount:UI_B_PUI_IDS.length,gapCount:UI_B_GAP_IDS.length}},
  {id:'AB08-source',pass:unboundStatic.length===0,detail:{staticInteractive:staticInventory.length,sourceBound:staticInventory.filter(x=>x.sourceBound).length,unboundStatic}},
  {id:'AE08-source',pass:missingRoutes.length===0&&unboundStatic.length===0,detail:{missingRoutes,staticInteractive:staticInventory.length,unboundStatic}},
  {id:'AE10',pass:missingRoutes.length===0&&forbiddenClaims.length===0&&Object.values(explicitUnsupported).every(Boolean),detail:{missingRoutes,forbiddenClaims,explicitUnsupported}}
];
const failed=checks.filter(x=>!x.pass);
const result={
  schema:'INK-UI-ISSUE92-CONTROL-HEALTH-SOURCE',
  version:1,
  status:failed.length?'FAIL':'PASS',
  checks,
  registry:{
    menu:UI_B_MENU_CONTRIBUTIONS.map(({id,menu,command,authority})=>({id,menu,command,authority,routed:routed(command)})),
    toolGroups:UI_B_TOOL_GROUPS.map(g=>({id:g.id,primary:g.primary,tools:g.tools.map(x=>x[0])})),
    dialogs:[...UI_B_DIALOGS],
    panels:[...UI_B_REQUIRED_PANELS]
  },
  staticInventory,
  summary:{total:checks.length,passed:checks.length-failed.length,failed:failed.length}
};
await fs.writeFile(path.join(evidenceDir,'control-health-source.json'),JSON.stringify(result,null,2));
if(failed.length)process.exitCode=1;
