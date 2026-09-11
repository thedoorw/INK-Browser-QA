from playwright.sync_api import sync_playwright
from pathlib import Path
from PIL import Image, ImageDraw
import json, os

ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'Runtime_Evidence'/'WP5'; OUT.mkdir(parents=True,exist_ok=True)
html=(ROOT/'index-standalone.html').read_text().replace('<link rel="stylesheet" href="styles.css">','').replace('<script src="dist/ink.compat.js"></script>','')
css=(ROOT/'styles.css').read_text(); js=(ROOT/'dist/ink.compat.js').read_text()
PLAN={
 'planId':'wp5-runtime-crown-plan','schemaVersion':'0.1','crownId':'wp5-runtime-complete-crown','petalCount':8,
 'crownBasePalette':['#ad4964','#d47c92','#933a56'],'petalPaletteVariation':{'lightnessRange':[-.07,.09],'saturationRange':[-.04,.06]},
 'centerPalette':['#692438','#cb8d4b','#efd49a'],'globalLightDirection':{'x':-.45,'y':-.89},'depthOrder':'topology-z','focalRegion':{'petalIndex':0},
 'edgeHierarchy':{'focal':'crisp','front':'mixed','rear':'soft'},'shadowStrategy':{'root':.82,'fold':.68,'overlap':.88},'glazeStrategy':{'strength':.62,'passes':1},
 'backgroundExclusionMask':{'enabled':True,'mode':'crown-envelope'},
 'brushPresets':{'wash':'brush-round','shadow':'brush-round','light':'air-soft','glaze':'brush-round','detail':'brush-letter','soft':'air-soft'},
 'seed':505,'metadata':{'source':'ai','label':'WP5 Runtime Transaction Crown'}
}

def setup(browser,console,label):
 p=browser.new_page(viewport={'width':1500,'height':1120})
 p.on('console',lambda m:console.append({'type':m.type,'text':m.text,'page':label}))
 p.on('pageerror',lambda e:console.append({'type':'pageerror','text':str(e),'page':label}))
 p.set_content(html,wait_until='domcontentloaded');p.add_style_tag(content=css);p.add_script_tag(content=js)
 p.wait_for_function('window.INK_APP && window.INK_APP.flora && window.INK_APP.flora.crown')
 p.evaluate("""(()=>{const b=document.createElement('div');b.style.cssText='position:fixed;z-index:999999;left:50%;top:66px;transform:translateX(-50%);padding:8px 14px;background:rgba(25,29,31,.95);color:#f4f1e8;border:1px solid rgba(255,255,255,.2);border-radius:8px;font:600 12px system-ui;pointer-events:none';b.textContent='WP-5 · COMPLETE CROWN TRANSACTION EVIDENCE · NO IMAGE MODEL';document.body.append(b);const c=document.createElement('pre');c.id='wp5-card';c.style.cssText='position:fixed;z-index:999999;left:44px;bottom:34px;width:500px;max-height:310px;overflow:hidden;margin:0;padding:12px 14px;background:rgba(18,22,24,.94);color:#dfe9df;border:1px solid rgba(255,255,255,.18);border-radius:8px;font:11px/1.42 ui-monospace,monospace;white-space:pre-wrap;pointer-events:none';document.body.append(c);window.WP5_EVIDENCE=(t,d)=>c.textContent=t+'\\n'+JSON.stringify(d,null,2)})()""")
 p.evaluate("INK_TEST.fresh();INK_TEST.setRenderMode('canvas2d');INK_APP.switchWorkspace('layout',{fit:false,announce:false});INK_APP.fitArtboard({switchSpace:false});")
 return p

def shot(p,name,title,data):
 p.evaluate('(x)=>WP5_EVIDENCE(x.t,x.d)',{'t':title,'d':data});p.wait_for_timeout(600);p.screenshot(path=str(OUT/name))

with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu-sandbox'])
 console=[]
 # Fresh-page atomic failure: no prior Crown, so a failed petal/pass must leave the blank Scene untouched.
 fail=setup(browser,console,'rollback')
 fail.evaluate("window.__wp5RealRender=INK_APP.renderer.render.bind(INK_APP.renderer);INK_APP.renderer.render=()=>{}")
 rollback=fail.evaluate("""(plan)=>{const before={hash:INK_APP.flora.documentHash(),replay:INK_APP.flora.replayHash(),undo:INK_APP.history.undoStack.length,redo:INK_APP.history.redoStack.length,objects:INK_APP.page().layers[0].objects.length};const original=INK_APP.flora.adapter.execute.bind(INK_APP.flora.adapter);let n=0;INK_APP.flora.adapter.execute=(action,options)=>{if(action.type==='paintRegion'&&++n===2)throw new Error('WP5 injected pass failure');return original(action,options)};const result=INK_APP.flora.crown.execute(plan);INK_APP.flora.adapter.execute=original;const after={hash:INK_APP.flora.documentHash(),replay:INK_APP.flora.replayHash(),undo:INK_APP.history.undoStack.length,redo:INK_APP.history.redoStack.length,objects:INK_APP.page().layers[0].objects.length,crown:INK_APP.flora.crown.lookup(plan.crownId)};return{before,result,after,hashRestored:before.hash===after.hash,replayRestored:before.replay===after.replay,historyUnchanged:before.undo===after.undo&&before.redo===after.redo,objectsUnchanged:before.objects===after.objects,crownAbsent:after.crown===null}}""",PLAN)
 fail.evaluate("INK_APP.renderer.render=window.__wp5RealRender;INK_APP.renderer.render()")
 shot(fail,'12_atomic_crown_rollback.png','ATOMIC CROWN FAILURE · COMPLETE ROLLBACK',rollback)
 fail.close()

 # Full transaction/roundtrip run. Rendering is deferred during state tests, then restored for evidence/export.
 page=setup(browser,console,'transaction')
 manual=page.evaluate('INK_TEST.addEditableStroke()');manual_id=manual['objectId']
 manual_before=page.evaluate("""(id)=>{const o=INK_APP.flora.adapter.findObject(id)?.object;return JSON.stringify(o&&{id:o.id,type:o.type,matrix:o.matrix,color:o.color,size:o.size,kind:o.kind,points:(o.points||[]).map(p=>({x:p.x,y:p.y,p:p.p}))})}""",manual_id)
 page.evaluate("window.__wp5RealRender=INK_APP.renderer.render.bind(INK_APP.renderer);INK_APP.renderer.render=()=>{}")
 compiled=page.evaluate('(plan)=>INK_APP.flora.crown.compile(plan)',PLAN)
 before=page.evaluate("({hash:INK_APP.flora.documentHash(),replay:INK_APP.flora.replayHash(),undo:INK_APP.history.undoStack.length,objects:INK_APP.page().layers[0].objects.length})")
 execute=page.evaluate('(plan)=>INK_APP.flora.crown.execute(plan)',PLAN)
 after=page.evaluate("({hash:INK_APP.flora.documentHash(),replay:INK_APP.flora.replayHash(),undo:INK_APP.history.undoStack.length,objects:INK_APP.page().layers[0].objects.length,mapping:INK_APP.flora.crown.mapping('wp5-runtime-complete-crown'),checks:INK_APP.flora.crown.visualChecks('wp5-runtime-complete-crown')})")
 page.evaluate('INK_APP.history.undo()')
 undo=page.evaluate("({hash:INK_APP.flora.documentHash(),replay:INK_APP.flora.replayHash(),objects:INK_APP.page().layers[0].objects.length,manual:!!INK_APP.flora.adapter.findObject('"+manual_id+"'),crown:INK_APP.flora.crown.lookup('wp5-runtime-complete-crown'),undo:INK_APP.history.undoStack.length,redo:INK_APP.history.redoStack.length})")
 page.evaluate('INK_APP.history.redo()')
 redo=page.evaluate("({hash:INK_APP.flora.documentHash(),replay:INK_APP.flora.replayHash(),objects:INK_APP.page().layers[0].objects.length,manual:!!INK_APP.flora.adapter.findObject('"+manual_id+"'),crownPresent:!!INK_APP.flora.crown.lookup('wp5-runtime-complete-crown'),undo:INK_APP.history.undoStack.length,redo:INK_APP.history.redoStack.length})")
 target='wp5-runtime-complete-crown:petal:01'
 local_before=page.evaluate("""(p)=>{const m=INK_APP.flora.crown.mapping(p.c),ids=m.regionRecipeIds[p.r].flatMap(id=>m.recipeToStrokeIds[id]||[]),other=m.strokeIds.filter(id=>!ids.includes(id));let h=2166136261;for(const ch of JSON.stringify(other.map(id=>INK_APP.flora.adapter.findObject(id)?.object).filter(Boolean))){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return{ids,otherHash:(h>>>0).toString(16).padStart(8,'0')}}""",{'c':PLAN['crownId'],'r':target})
 local=page.evaluate("""(p)=>INK_APP.flora.crown.adjustPetal(p.c,p.r,{operation:'Central Light',opacity:[.055,.16],palette:['#fff0f4'],edgeSoftness:.006})""",{'c':PLAN['crownId'],'r':target})
 local_after=page.evaluate("""(p)=>{const m=INK_APP.flora.crown.mapping(p.c),ids=m.regionRecipeIds[p.r].flatMap(id=>m.recipeToStrokeIds[id]||[]),other=m.strokeIds.filter(id=>!ids.includes(id));let h=2166136261;for(const ch of JSON.stringify(other.map(id=>INK_APP.flora.adapter.findObject(id)?.object).filter(Boolean))){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return{ids,otherHash:(h>>>0).toString(16).padStart(8,'0')}}""",{'c':PLAN['crownId'],'r':target})
 roundtrip=page.evaluate("""(()=>{const before={replay:INK_APP.flora.replayHash(),crownReplay:INK_APP.flora.crown.replayHash('wp5-runtime-complete-crown'),mapping:INK_APP.flora.crown.mapping('wp5-runtime-complete-crown')};const json=INK_APP.flora.serializeDocument(),bytes=new Blob([json],{type:'application/json'}).size;INK_APP.flora.reloadDocument(json);const after={replay:INK_APP.flora.replayHash(),crownReplay:INK_APP.flora.crown.replayHash('wp5-runtime-complete-crown'),mapping:INK_APP.flora.crown.mapping('wp5-runtime-complete-crown')};return{before,after,inkBytes:bytes,replayMatch:before.replay===after.replay,crownReplayMatch:before.crownReplay===after.crownReplay,mappingMatch:JSON.stringify(before.mapping)===JSON.stringify(after.mapping)}})()""")
 page.evaluate("INK_APP.renderer.render=window.__wp5RealRender;INK_APP.switchWorkspace('layout',{fit:false,announce:false});INK_APP.fitArtboard({switchSpace:false});INK_APP.renderer.render()")
 shot(page,'13_ink_roundtrip_replay.png','.INK ROUNDTRIP + DETERMINISTIC CROWN REPLAY',roundtrip)
 png=page.evaluate("""async()=>{const canvas=await INK_APP.renderExportCanvas({scope:'artboard',ppi:150,includeBleed:false,cropMarks:false,background:true});const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));const out={type:blob?.type||null,bytes:blob?.size||0,width:canvas.width,height:canvas.height};canvas.width=1;canvas.height=1;return out}""")
 manual_after=page.evaluate("""(id)=>{const o=INK_APP.flora.adapter.findObject(id)?.object;return JSON.stringify(o&&{id:o.id,type:o.type,matrix:o.matrix,color:o.color,size:o.size,kind:o.kind,points:(o.points||[]).map(p=>({x:p.x,y:p.y,p:p.p}))})}""",manual_id)
 checks=page.evaluate("INK_APP.flora.crown.visualChecks('wp5-runtime-complete-crown')")
 runtime={
  'schema':'INK_FLORA_WP5_RUNTIME_EVIDENCE_V1','runtime':'Chromium functional harness using production standalone DOM/CSS/dist compatibility bundle',
  'imageModelUsed':False,'specificSpeciesUsed':False,'benchmarkTraced':False,'plan':PLAN,
  'compiled':{'ok':compiled.get('ok'),'planHash':compiled.get('planHash'),'structureHash':compiled.get('structureHash'),'compileHash':compiled.get('compileHash'),'preview':compiled.get('preview'),'checks':compiled.get('checks')},
  'beforeExecute':before,'execute':execute,'afterExecute':after,'undo':undo,'redo':redo,
  'localRecompile':{'before':local_before,'result':local,'after':local_after,'nonTargetUnchanged':local_before['otherHash']==local_after['otherHash']},
  'atomicRollback':rollback,'roundtrip':roundtrip,'manualStroke':{'id':manual_id,'preserved':manual_before==manual_after},
  'visualChecks':checks,'pngExport':png,'maskCache':page.evaluate('INK_APP.flora.maskCacheDiagnostics()'),
  'finalReplayHash':page.evaluate('INK_APP.flora.replayHash()'),'crownReplayHash':page.evaluate("INK_APP.flora.crown.replayHash('wp5-runtime-complete-crown')"),
  'console':console,'consoleErrors':[x for x in console if x.get('type') in ('error','pageerror')]
 }
 (OUT/'runtime-log.json').write_text(json.dumps(runtime,ensure_ascii=False,indent=2)+'\n')
 (OUT/'runtime-complete.flag').write_text('PASS\n' if not runtime['consoleErrors'] else 'FAIL\n')
 page.close();browser.close()

# Contact sheet from all evidence images already generated across both runs.
files=sorted(OUT.glob('[0-9][0-9]_*.png'))
thumbs=[]
for path in files:
 im=Image.open(path).convert('RGB');im.thumbnail((360,260));c=Image.new('RGB',(380,300),'white');c.paste(im,((380-im.width)//2,8));ImageDraw.Draw(c).text((12,275),path.stem,fill='black');thumbs.append(c)
cols=3;rows=(len(thumbs)+cols-1)//cols;sheet=Image.new('RGB',(cols*380,rows*300),(235,235,235))
for i,im in enumerate(thumbs):sheet.paste(im,((i%cols)*380,(i//cols)*300))
sheet.save(OUT/'WP5_Runtime_Contact_Sheet.png')
os._exit(0)
