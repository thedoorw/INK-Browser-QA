const {chromium}=require('playwright');
 const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict'),crypto=require('crypto');
const dir=path.join(__dirname,'ink-local/working/evidence/ink-ui-normalization-20261001');fs.mkdirSync(dir,{recursive:true});
const root=process.env.INK_QA_BASELINE?'/tmp/ink-baseline':path.join(__dirname,'ink-local');
const prefix=process.env.INK_QA_BASELINE?'before':'after';
(async()=>{
 const fontRoot='/tmp/ink-browser-qa/node_modules/@fontsource/noto-sans-tc';
 const server=http.createServer((req,res)=>{const url=decodeURIComponent(req.url.split('?')[0]);let p=url.startsWith('/qa-fonts/')?path.join(fontRoot,url.slice(10)):path.join(root,url);if(fs.existsSync(p)&&fs.statSync(p).isDirectory())p=path.join(p,'index.html');if(!fs.existsSync(p)){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',({'.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.html':'text/html','.json':'application/json','.svg':'image/svg+xml','.woff2':'font/woff2','.jpg':'image/jpeg'})[path.extname(p)]||'application/octet-stream');res.end(fs.readFileSync(p));});await new Promise(r=>server.listen(8765,'127.0.0.1',r));
 const packed=(await import('/tmp/ink-browser-qa/node_modules/@sparticuz/chromium/build/index.js')).default;
 const browser=await chromium.launch({executablePath:await packed.executablePath(),headless:true,args:[...packed.args.filter(x=>!/gpu|use-gl|use-angle/.test(x)),"--disable-gpu","--disable-software-rasterizer"]});
 const page=await browser.newPage({viewport:{width:1280,height:1024},deviceScaleFactor:1});
 const errors=[],report={environment:{viewport:'1280x1024',DPR:1,browser:browser.version(),font:'Noto Sans TC 400 (QA-only font registration)',rendering:'Canvas fallback / CPU rasterization for screenshot stability',source:prefix==='before'?'58f7435374dbbd42cd74d5ef31440e3de1de908f':'candidate'},checks:[],states:{}};
 const responseJobs=[],loaded=[];
 page.on('pageerror',e=>errors.push(String(e)));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());if(new URL(r.url()).pathname.startsWith('/product/source/'))responseJobs.push((async()=>{const bytes=await r.body();let file=path.join(root,new URL(r.url()).pathname);if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');const local=fs.readFileSync(file);loaded.push({url:r.url(),sha256:crypto.createHash('sha256').update(bytes).digest('hex'),matchesServedSource:bytes.equals(local)});})().catch(e=>{errors.push(String(e));}));});page.on('dialog',d=>d.accept());
 const settle=()=>page.evaluate(async()=>{await document.fonts.ready;await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));});
 async function snapshot(name){await settle();await page.screenshot({path:path.join(dir,prefix+'-'+name+'.png')});report.states[name]=await page.evaluate(()=>{
  const rect=e=>e.getBoundingClientRect().toJSON(),visible=e=>e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden';
  const ss=['.tool-rail','.tool-group','.tool-colors','.tool-bottom-utilities','.panel-stack-framework','.panel-stack-region','.panel-stack-splitter','.panel-stack-tab','.panel-stack-options','.branding-settings-dialog','.layer-row','.creative-workspace-field','.creative-structure-option'];
  return {documentActive:document.querySelector('#app').dataset.documentActive,regions:ss.flatMap(s=>[...document.querySelectorAll(s)].filter(visible).map(e=>{let c=getComputedStyle(e);return{selector:s,text:e.textContent.trim().slice(0,32),rect:rect(e),scrollHeight:e.scrollHeight,clientHeight:e.clientHeight,color:c.color,background:c.backgroundColor,border:c.border,fontSize:c.fontSize,fontWeight:c.fontWeight,padding:c.padding,overflow:c.overflow,grid:c.gridTemplateColumns}})),sliders:[...document.querySelectorAll('input[type="range"]')].filter(visible).map(e=>({id:e.id,documentScrollbar:!!e.closest('.document-scrollbar'),rect:rect(e),border:getComputedStyle(e).border,pseudoGeometry:'Chromium exposes input geometry for native range pseudos; use screenshot + CSSOM, not this as rendered thumb measurement'})),scrollbars:[...document.querySelectorAll('.panel-stack-body *,.preferences-content *')].filter(e=>visible(e)&&/auto|scroll/.test(getComputedStyle(e).overflow)&&(e.scrollHeight>e.clientHeight+1||e.scrollWidth>e.clientWidth+1)).map(e=>({class:e.className,id:e.id,rect:rect(e),scrollbarWidth:getComputedStyle(e,'::-webkit-scrollbar').width,radius:getComputedStyle(e,'::-webkit-scrollbar-thumb').borderRadius}))};
 });}
 const check=(name,ok,data)=>{report.checks.push({name,ok,data});if(!ok)throw new Error(name+': '+JSON.stringify(data));};
 try{
 await page.goto('http://127.0.0.1:8765/product/source/',{waitUntil:'networkidle'});
 await page.addStyleTag({content:fs.readFileSync(path.join(fontRoot,'400.css'),'utf8').replaceAll('url(./files/','url(/qa-fonts/files/')});
 await page.waitForFunction(()=>window.INK_APP&&window.INK_UI_B);await snapshot('empty');
 await page.locator('[data-application-menu-trigger="file"]').click();await page.locator('[data-file-command="new"]').click();await page.waitForFunction(()=>document.querySelector('#app').dataset.documentActive==='true');await snapshot('active');
 await page.locator('#toolbarLayoutToggle').click();await snapshot('tools-single');
 const fit=await page.evaluate(()=>{const rail=document.querySelector('.tool-rail').getBoundingClientRect();return[...document.querySelectorAll('.tool-colors,.tool-bottom-utilities,.tool-color,.color-utility')].map(e=>{const r=e.getBoundingClientRect();return{class:e.className,inside:r.left>=rail.left&&r.right<=rail.right&&r.top>=rail.top&&r.bottom<=rail.bottom}})});
 if(prefix==='after')check('single Tools swatches/utilities contained',fit.every(x=>x.inside),fit);
 await page.locator('#toolbarLayoutToggle').click();
 await page.locator('.panel-stack-framework [data-panel-edge-toggle]').click();await snapshot('dock-collapsed');
 await page.locator('.panel-dock [data-panel-edge-toggle]').click();await snapshot('dock-expanded');
 report.menus=[];for(const trigger of await page.locator('[data-application-menu-trigger]').all()){await trigger.click();await settle();report.menus.push(await page.locator('.application-command-menu:visible,#panelWindowMenu:visible').evaluate(e=>({id:e.id,width:e.getBoundingClientRect().width,background:getComputedStyle(e).backgroundColor,items:e.querySelectorAll('[role="menuitem"]').length})));await page.keyboard.press('Escape');}
 await page.locator('[data-panel-stack-target="reference"]').click();await snapshot('reference');
 const details=page.locator('.creative-structure-option').first();if(await details.count()){await details.locator('summary').click();await snapshot('reference-details');}
 const scroller=page.locator('.creative-workspace-body');await scroller.evaluate(e=>e.scrollTop=e.scrollHeight);await snapshot('reference-scroll');await scroller.evaluate(e=>e.scrollTop=0);
 await page.locator('[data-application-menu-trigger="edit"]').click();await snapshot('edit-menu');
 report.editCommands=await page.locator('#editMenu [role="menuitem"]').evaluateAll(es=>es.map(e=>({label:e.textContent.trim(),id:e.dataset.uiBContribution,command:e.dataset.uiBCommand||e.dataset.shellAction})));
 if(prefix==='after'){check('Edit Preferences last',report.editCommands.at(-1).command==='preferences',report.editCommands);check('Edit transformations preserved',report.editCommands.filter(x=>x.command.startsWith('transform:')).length===4);}
 await page.keyboard.press('Escape');
 report.panels=[];for(const id of ['properties','color','compose','chat','revision','history','channels','pages','libraries','reference','layers']){await page.locator('[data-panel-stack-target="'+id+'"]').click();await settle();report.panels.push(await page.evaluate(id=>{const all=[...document.querySelectorAll('.panel-stack-body input,.panel-stack-body select,.panel-stack-body button')].filter(e=>e.getClientRects().length);return{id,controls:all.map(e=>{let c=getComputedStyle(e);return{id:e.id,type:e.type,disabled:e.disabled,height:e.getBoundingClientRect().height,fontSize:c.fontSize,fontWeight:c.fontWeight}})}},id));}
 await page.locator('[data-panel-stack-target="layers"]').click();const count0=await page.locator('.layer-row').count();
 await page.locator('#addLayerBtn').click();await page.locator('#duplicateLayerBtn').click();check('Layers add + duplicate',await page.locator('.layer-row').count()===count0+2);
 await page.locator('.layer-row').first().locator('.layer-name').click();await page.locator('[data-layer-action="toggle-lock"]').click();
 check('Layers lock changes authoritative state',await page.evaluate(()=>INK_APP.layer().locked));await snapshot('layers-locked');
 await page.locator('[data-layer-action="toggle-lock"]').click();
 await page.locator('.layer-visibility').first().click();await snapshot('layers-hidden');await page.locator('.layer-visibility').first().click();
 const rows=page.locator('.layer-row');const from=await rows.first().boundingBox(),to=await rows.last().boundingBox();
 const beforeOrder=await page.evaluate(()=>INK_APP.page().layers.map(l=>l.id));
 await page.mouse.move(from.x+from.width/2,from.y+from.height/2);await page.mouse.down();await page.mouse.move(to.x+to.width/2,to.y+to.height-2,{steps:12});await snapshot('layers-drag');await page.mouse.up();await settle();
 const afterOrder=await page.evaluate(()=>INK_APP.page().layers.map(l=>l.id));check('Layers reorder changes authoritative order',JSON.stringify(beforeOrder)!==JSON.stringify(afterOrder),{beforeOrder,afterOrder});await snapshot('layers-reordered');
 await page.locator('#deleteLayerBtn').click();check('Layers delete',await page.locator('.layer-row').count()===count0+1);
 await page.keyboard.press('Control+z');await settle();check('Layers undo restores delete',await page.locator('.layer-row').count()===count0+2);await snapshot('layers-undo');
 await page.locator('[data-application-menu-trigger="edit"]').click();await page.locator('[data-ui-b-command="preferences"]').click();await snapshot('preferences');
 report.preferences=[];for(const b of await page.locator('.preferences-categories button').all()){await b.click();await settle();report.preferences.push(await page.locator('.branding-settings-dialog').evaluate(e=>({width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height,text:document.querySelector('.preferences-category:not([hidden])').textContent.trim().slice(0,28)})));}
 check('Preferences width invariant across categories',new Set(report.preferences.map(x=>x.width)).size===1,report.preferences);await snapshot('preferences-branding');await page.locator('#closeBrandingSettings').click();
 await page.locator('#toolbarLayoutToggle').focus();await snapshot('focus');
 const splitter=page.locator('.panel-stack-splitter').first();const sb=await splitter.boundingBox();const oldH=await page.locator('.panel-stack-region').first().evaluate(e=>e.getBoundingClientRect().height);await page.mouse.move(sb.x+40,sb.y+sb.height/2);await page.mouse.down();await page.mouse.move(sb.x+40,sb.y+25,{steps:8});await page.mouse.up();await settle();check('Panel splitter resizes',Math.abs((await page.locator('.panel-stack-region').first().evaluate(e=>e.getBoundingClientRect().height))-oldH)>5);await snapshot('splitter-resized');
 await page.setViewportSize({width:960,height:800});await snapshot('desktop-narrow');
 await page.setViewportSize({width:960,height:500});await page.locator('#toolbarLayoutToggle').click();await snapshot('short-single');if(prefix==='after')check('Short Tools utilities inside viewport',await page.locator('.tool-bottom-utilities').evaluate(e=>e.getBoundingClientRect().bottom<=innerHeight));
 await page.setViewportSize({width:390,height:844});await snapshot('compact');
 if(prefix==='after')check('Compact page contains horizontal viewport',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 if(prefix==='after'){
 await page.setViewportSize({width:1280,height:1024});await page.reload({waitUntil:'networkidle'});await page.addStyleTag({content:fs.readFileSync(path.join(fontRoot,'400.css'),'utf8').replaceAll('url(./files/','url(/qa-fonts/files/')});await page.locator('[data-application-menu-trigger="file"]').click();await page.locator('[data-file-command="new"]').click();await settle();
 const inventory=await page.evaluate(async()=>{const m=await import('./ui/capability-contributions.js');return {tools:[...new Set(['eraser','select','pan','image',...m.UI_B_TOOL_GROUPS.flatMap(g=>g.tools.map(([id])=>id))])],fields:m.UI_B_RASTER_OPTION_FIELDS};});
 report.toolExposure=[];
 for(const tool of inventory.tools.filter(t=>t!=='image')){
   await page.evaluate(t=>{if(['eraser','select','pan'].includes(t))INK_APP.setTool(t);else INK_UI_B.activateTool(t)},tool);await settle();
   const exposure=await page.evaluate(tool=>({tool,mode:document.querySelector('#contextualOptions').dataset.contextMode,contextTool:document.querySelector('#contextualOptions').dataset.contextTool,controls:[...document.querySelectorAll('#contextualControlHost input,#contextualControlHost select,#contextualControlHost button')].filter(e=>e.getClientRects().length).map(e=>({id:e.id,parameter:e.dataset.uiBOption,type:e.type,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height})),brushExtras:[...document.querySelectorAll('[data-ui-b-brush-option]')].map(e=>e.dataset.uiBBrushOption)}),tool);
   report.toolExposure.push(exposure);
   if(inventory.fields[tool])check('Consumed parameters exposed: '+tool,inventory.fields[tool].every(k=>exposure.controls.some(c=>c.parameter===k))&&exposure.controls.filter(c=>c.parameter).every(c=>inventory.fields[tool].includes(c.parameter)),exposure);
 }
 await page.evaluate(()=>INK_UI_B.activateTool('paintBucket'));await settle();
 const tolerance=page.locator('[data-ui-b-option="tolerance"]');await tolerance.fill('77');await tolerance.press('Tab');check('Raster numeric edit updates existing state',await page.evaluate(()=>INK_UI_B.raster.options().tolerance===77));
 await snapshot('options-paint-bucket');
 await page.evaluate(()=>INK_UI_B.activateTool('cloneStamp'));await settle();await snapshot('options-clone');
 await page.evaluate(()=>INK_APP.setTool('pencil'));await settle();await page.locator('[data-panel-stack-target="properties"]').click();await settle();
 const grain=page.locator('[data-ui-b-brush-option="grain"]');await grain.evaluate(e=>{e.value='61';e.dispatchEvent(new Event('input',{bubbles:true}));});check('Brush extra routes through native settings',await page.evaluate(()=>INK_APP.toolSettings.pencil.grain===.61));await snapshot('properties-pencil');
 await page.evaluate(()=>INK_APP.setTool('text'));await settle();const canvas=await page.locator('#stage').boundingBox();await page.mouse.click(canvas.x+canvas.width/2,canvas.y+canvas.height/2);await page.locator('#textInput').fill('Line one\nLine two');await page.locator('#textCommit').click();await settle();
 check('Text creation selects native object',await page.evaluate(()=>INK_APP.selectedObjects()[0]?.object.type==='text'));await page.locator('[data-panel-stack-target="properties"]').click();await settle();const lineHeight=page.locator('[data-ui-b-text-line-height]');await lineHeight.fill('1.8');await lineHeight.press('Tab');check('Text line height commits to native object',await page.evaluate(()=>INK_APP.selectedObjects()[0]?.object.lineHeight===1.8));await lineHeight.scrollIntoViewIfNeeded();await snapshot('properties-text');await page.keyboard.press('Control+z');await settle();check('Text line height undo uses native History',await page.evaluate(()=>INK_APP.page().layers.flatMap(l=>l.objects).find(o=>o.type==='text')?.lineHeight===1.25));
 await page.evaluate(()=>INK_APP.setTool('select'));await page.mouse.click(canvas.x+canvas.width/2+20,canvas.y+canvas.height/2-8);await settle();check('Text remains selectable after undo',await page.evaluate(()=>INK_APP.selectedObjects().length>0));await page.evaluate(()=>INK_APP.setTool('brush'));await settle();check('Drawing Options remain visible with selected object',await page.locator('#quickSizeInput').isVisible());await snapshot('options-selected-brush');
 }
 check('No page/resource errors',errors.length===0,errors);
 report.instanceInventory=await page.evaluate(()=>({sliders:[...document.querySelectorAll('input[type="range"]')].map(e=>({id:e.id,name:e.name,documentScrollbar:!!e.closest('.document-scrollbar'),owner:e.closest('[data-content],[data-workspace-panel],.preferences-category')?.getAttribute('data-content')||e.closest('.preferences-category')?.dataset.preferencesCategory})),tokens:Object.fromEntries([...getComputedStyle(document.documentElement)].filter(x=>x.startsWith('--ink-ui-')).map(x=>[x,getComputedStyle(document.documentElement).getPropertyValue(x).trim()]))}));
 }catch(e){report.failure=String(e);report.errors=errors;await page.screenshot({path:path.join(dir,prefix+'-failure.png')});console.error(e);process.exitCode=1;}
 await Promise.all(responseJobs);report.loadedResponses=loaded;report.serviceWorkerController=await page.evaluate(()=>navigator.serviceWorker.controller?.scriptURL||null);
 if(prefix==='after')check('Browser-loaded product response bytes match source',loaded.every(x=>x.matchesServedSource),{count:loaded.length});
 fs.writeFileSync(path.join(dir,prefix+'-browser.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({prefix,checks:report.checks.map(({name,ok})=>({name,ok})),failure:report.failure,errors}));await browser.close();server.close();
})().catch(e=>{console.error(e);process.exit(1)});
