from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw
import base64, json, io, hashlib

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'Runtime_Evidence'/'WP9A_R1b';OUT.mkdir(parents=True,exist_ok=True)
SER=(ROOT/'FLR012_Candidate_A_R1.ink').read_text(encoding='utf-8')
FINAL=(ROOT/'FLR012_Candidate_A_R1.png').read_bytes()
html=(ROOT/'index-standalone.html').read_text(encoding='utf-8').replace('<link rel="stylesheet" href="styles.css">','').replace('<script src="dist/ink.compat.js"></script>','')
css=(ROOT/'styles.css').read_text(encoding='utf-8');js=(ROOT/'dist'/'ink.compat.js').read_text(encoding='utf-8')
msgs=[]
def decode(url):return base64.b64decode(url.split(',',1)[1])
def sha(b):return hashlib.sha256(b).hexdigest()
def export(page):return page.evaluate("""async()=>{const c=await INK_APP.renderExportCanvas({scope:'artboard',ppi:72,includeBleed:false,cropMarks:false,background:true});return{data:c.toDataURL('image/png'),width:c.width,height:c.height}}""")
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu-sandbox'])
 page=b.new_page(viewport={'width':1500,'height':1120});page.on('console',lambda m:msgs.append({'type':m.type,'text':m.text}));page.on('pageerror',lambda e:msgs.append({'type':'pageerror','text':str(e)}))
 page.set_content(html,wait_until='domcontentloaded');page.add_style_tag(content=css);page.add_script_tag(content=js);page.wait_for_function('window.INK_APP?.flora?.completeHero')
 page.evaluate('(s)=>INK_APP.flora.reloadDocument(s)',SER);page.evaluate("INK_APP.switchWorkspace('layout',{fit:false,announce:false});INK_APP.fitArtboard({switchSpace:false});INK_TEST.setRenderMode('canvas2d');INK_APP.renderer.naturalMedia.setFrequencyVisibility({low:true,mid:true,high:true});")
 runtime=page.evaluate("""()=>{const p=INK_APP.page();const h=INK_APP.flora.adapter.hero();const m=INK_APP.flora.completeHero.mapping('flr012-adonis-candidate-a');const objects=p.layers.flatMap(l=>l.objects||[]);return {structure:h,mapping:m,recipes:Object.values(p.floraRecipeState?.recipes||{}).map(x=>x.recipe),documentHash:INK_APP.flora.documentHash(),replayHash:INK_APP.flora.replayHash(),heroReplayHash:INK_APP.flora.completeHero.replayHash('flr012-adonis-candidate-a'),maskCache:INK_APP.flora.maskCacheDiagnostics(),renderer:INK_APP.renderer.naturalMedia.diagnostics(),strokeStats:{all:objects.filter(o=>o.floraPaint).length,low:objects.filter(o=>o.floraPaint&&o.floraPaint.frequencyLayer==='low').length,mid:objects.filter(o=>o.floraPaint&&o.floraPaint.frequencyLayer==='mid').length,high:objects.filter(o=>o.floraPaint&&o.floraPaint.frequencyLayer==='high').length}};}""")
 freq={}
 for name,vis in [('low',{'low':True,'mid':False,'high':False}),('mid',{'low':False,'mid':True,'high':False}),('high',{'low':False,'mid':False,'high':True}),('all',{'low':True,'mid':True,'high':True})]:
  page.evaluate('(v)=>INK_APP.renderer.naturalMedia.setFrequencyVisibility(v)',vis);e=export(page);data=decode(e['data']);(OUT/f'Frequency_{name}.png').write_bytes(data);freq[name]={'sha256':sha(data),'bytes':len(data),'width':e['width'],'height':e['height']}
 page.evaluate("INK_APP.renderer.naturalMedia.setFrequencyVisibility({low:true,mid:true,high:true})")
 roundtrip=export(page);roundpng=decode(roundtrip['data']);(OUT/'Roundtrip_Reload.png').write_bytes(roundpng)
 # manual-preservation + local recompilation validation, not a formal candidate compile
 local=page.evaluate("""()=>{const p=INK_APP.page(),layer=p.layers.find(l=>l.id===p.activeLayerId)||p.layers[0];const manual={id:'manual-r1b-validation',type:'stroke',name:'Manual validation stroke',matrix:[1,0,0,1,0,0],opacity:1,color:'#222222',size:2,kind:'pen',points:[{x:-1000,y:-1000,p:1},{x:-990,y:-990,p:1}]};layer.objects.push(manual);const before=JSON.stringify(manual);const petal=INK_APP.flora.adapter.hero().regions.find(r=>r.kind==='petal-region');const result=INK_APP.flora.completeHero.recompilePetal('flr012-adonis-candidate-a',petal.regionId,{operation:'Directional Brushwork',patch:{}});const after=JSON.stringify(INK_APP.flora.adapter.findObject('manual-r1b-validation')?.object);return{petalId:petal.regionId,result,manualPreserved:before===after};}""")
 local_img=export(page);(OUT/'Local_Recompile_Validation.png').write_bytes(decode(local_img['data']))
 local_undo=page.evaluate('()=>({ok:INK_APP.history.undo(),heroReplay:INK_APP.flora.completeHero.replayHash("flr012-adonis-candidate-a")})')
 rollback=page.evaluate("""()=>{const petal=INK_APP.flora.adapter.hero().regions.filter(r=>r.kind==='petal-region')[1];const before={document:INK_APP.flora.documentHash(),replay:INK_APP.flora.replayHash(),undo:INK_APP.history.undoStack.length,redo:INK_APP.history.redoStack.length,cache:JSON.stringify(INK_APP.flora.maskCacheDiagnostics())};const original=INK_APP.flora.adapter.execute.bind(INK_APP.flora.adapter);let n=0;INK_APP.flora.adapter.execute=(action,options)=>{if(action.type==='createStroke'&&++n===2)throw new Error('WP9A-R1b injected local validation failure');return original(action,options)};const result=INK_APP.flora.completeHero.recompilePetal('flr012-adonis-candidate-a',petal.regionId,{operation:'Directional Brushwork',patch:{opacity:[.04,.08]}});INK_APP.flora.adapter.execute=original;const after={document:INK_APP.flora.documentHash(),replay:INK_APP.flora.replayHash(),undo:INK_APP.history.undoStack.length,redo:INK_APP.history.redoStack.length,cache:JSON.stringify(INK_APP.flora.maskCacheDiagnostics())};return{result,before,after,documentRestored:before.document===after.document,replayRestored:before.replay===after.replay,historyUnchanged:before.undo===after.undo&&before.redo===after.redo,cacheRestored:before.cache===after.cache};}""")
 page.screenshot(path=str(OUT/'Runtime_UI.png'),full_page=True);b.close()
errors=[m for m in msgs if m['type'] in {'error','pageerror'}]
(OUT/'FLR012_R1_Painting_Recipes.json').write_text(json.dumps(runtime['recipes'],ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(OUT/'FLR012_R1_Structure.json').write_text(json.dumps(runtime['structure'],ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
log={'schema':'INK_FLORA_WP9A_R1B_VALIDATION_RESUME_V1','formalCandidateRecompiled':False,'candidateSha256':sha(FINAL),'roundtripPngSha256':sha(roundpng),'roundtripPngMatchesCandidate':sha(FINAL)==sha(roundpng),'runtime':{k:v for k,v in runtime.items() if k not in ['structure','recipes','mapping']},'frequencyExports':freq,'localRecompile':local,'localUndo':local_undo,'rollback':rollback,'errors':errors}
(OUT/'validation-resume-log.json').write_text(json.dumps(log,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'ok':not errors,'candidateMatchesRoundtrip':log['roundtripPngMatchesCandidate'],'runtime':log['runtime'],'local':local,'rollback':{k:rollback[k] for k in ['documentRestored','replayRestored','historyUnchanged','cacheRestored']},'errors':errors},ensure_ascii=False,indent=2))
