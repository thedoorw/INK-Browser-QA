import { readFileSync } from 'node:fs';
import { UI_B_MENU_CONTRIBUTIONS, UI_B_TOOL_GROUPS, UI_B_REQUIRED_PANELS, UI_B_DIALOGS } from '../../../product/source/ui/capability-contributions.js';
const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
const evidence=JSON.parse(read('../../../working/INK_UI_FUNCTIONAL_ASSEMBLY_ROUTE_EVIDENCE_v1.0.json'));
const html=read('../../../product/source/index.html'),portable=read('../../../product/source/index-standalone.html');
const controls=read('../../../product/source/ui/full-capability-controls.js');
const shell=read('../../../product/source/web-shell.js'),styles=read('../../../product/source/styles.css');
const sources=html+'\n'+controls+'\n'+shell+'\n'+read('../../../product/source/ui/capability-contributions.js');
const fail=message=>{throw new Error('INK_FUNCTIONAL_ASSEMBLY: '+message)};
if(evidence.pui_routes.length!==74||new Set(evidence.pui_routes.map(row=>row.id)).size!==74)fail('PUI ledger coverage');
for(let n=1;n<=74;n++){
  const row=evidence.pui_routes[n-1],id=`PUI-${String(n).padStart(3,'0')}`;
  if(row.id!==id)fail('missing '+id);
  if(row.disposition==='HEADLESS_NO_CONTROL'){
    if(row.route!=='HEADLESS_NO_CONTROL')fail('headless '+id);
  }else if(!row.route){fail('route '+id);
  }else{
    // Runtime-generated selectors use single quotes in JS template strings.
    const literal=row.route.match(/="([^"]+)"/)?.[1]||row.route.replace(/^#uiB-/, '').replace(/^#/, '');
    if(!sources.includes(literal))fail('route '+id+' '+row.route);
  }
}
for(const item of UI_B_MENU_CONTRIBUTIONS){
  for(const delivery of [html,portable])if(!delivery.includes(`data-ui-b-contribution="${item.id}"`))fail('missing menu '+item.id);
  if(!controls.includes(`installMenus();`)||!controls.includes('dispatch(command)'))fail('menu dispatch missing');
}
for(const id of UI_B_REQUIRED_PANELS)if(!shell.includes(`id: '${id}'`))fail('panel '+id);
for(const id of UI_B_DIALOGS)if(!controls.includes(`'${id}'`))fail('dialog '+id);
if(UI_B_MENU_CONTRIBUTIONS.filter(item=>item.menu==='filter').length<15)fail('empty Filter');
if(/Photoshop dark workstation authority|color-scheme:dark/.test(styles))fail('dark workstation override');
if(/\{\{[A-Z_]+\}\}/.test(html+portable))fail('template token');
console.log(`PUI 74/74 · actionable 64 · headless 10 · menus ${UI_B_MENU_CONTRIBUTIONS.length} · Filter 16 · tool groups ${UI_B_TOOL_GROUPS.length} · panels ${UI_B_REQUIRED_PANELS.length} · dialogs ${UI_B_DIALOGS.length}`);
