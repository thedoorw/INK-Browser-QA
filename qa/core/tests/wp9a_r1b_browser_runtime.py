from pathlib import Path
from playwright.sync_api import sync_playwright, Error as PlaywrightError
from PIL import Image, ImageDraw, ImageFont, ImageChops, ImageEnhance
import base64, json, io, hashlib, math, traceback

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'Runtime_Evidence' / 'WP9A_R1b'
OUT.mkdir(parents=True, exist_ok=True)
CANDIDATE = ROOT / 'FLR012_Candidate_A_R1.png'
SMALL = ROOT / 'FLR012_Candidate_A_R1_Small_View.png'
INK = ROOT / 'FLR012_Candidate_A_R1.ink'
OLD = ROOT / 'FLR012_Candidate_A.png'
REF = ROOT / 'FLR012_Reference_Crop.png'
GEOM = ROOT / 'Runtime_Evidence' / 'Geometry' / '02_R1a1_New_Crown_Geometry.png'

html = (ROOT / 'index-standalone.html').read_text(encoding='utf-8').replace('<link rel="stylesheet" href="styles.css">','').replace('<script src="dist/ink.compat.js"></script>','')
css = (ROOT / 'styles.css').read_text(encoding='utf-8')
js = (ROOT / 'dist' / 'ink.compat.js').read_text(encoding='utf-8')
messages=[]
direct_open={'attempted':True,'ok':False,'url':(ROOT/'index-standalone.html').resolve().as_uri()}
formal_execute_count=0


def sha(data): return hashlib.sha256(data).hexdigest()
def decode(data_url): return base64.b64decode(data_url.split(',',1)[1])

def export_canvas(page):
    return page.evaluate("""async()=>{const c=await INK_APP.renderExportCanvas({scope:'artboard',ppi:72,includeBleed:false,cropMarks:false,background:true});return{data:c.toDataURL('image/png'),width:c.width,height:c.height}}""")

with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu-sandbox'])
    # Direct-open smoke is attempted without executing a candidate.
    smoke=browser.new_page(viewport={'width':1200,'height':900})
    try:
        smoke.goto(direct_open['url'],wait_until='domcontentloaded',timeout=30000)
        smoke.wait_for_function('window.INK_APP?.flora?.species?.flr012',timeout=30000)
        direct_open['ok']=True
        direct_open['floraVersion']=smoke.evaluate('()=>INK_APP.flora.botanicalGeometryVersion')
        smoke.screenshot(path=str(OUT/'Direct_Open_HTML_Smoke.png'),full_page=True)
    except Exception as e:
        direct_open['error']=str(e)
        (OUT/'Direct_Open_HTML_Smoke_BLOCKED.txt').write_text(str(e)+'\n',encoding='utf-8')
    finally:
        smoke.close()

    page=browser.new_page(viewport={'width':1500,'height':1120})
    page.on('console',lambda m:messages.append({'type':m.type,'text':m.text}))
    page.on('pageerror',lambda e:messages.append({'type':'pageerror','text':str(e)}))
    page.set_content(html,wait_until='domcontentloaded');page.add_style_tag(content=css);page.add_script_tag(content=js)
    page.wait_for_function('window.INK_APP?.flora?.species?.flr012')
    page.evaluate("INK_TEST.fresh();INK_APP.switchWorkspace('layout',{fit:false,announce:false});INK_APP.fitArtboard({switchSpace:false});INK_TEST.setRenderMode('canvas2d');")
    mapping=page.evaluate('()=>INK_APP.flora.species.flr012.sourceMapping()')
    profile=page.evaluate('()=>INK_APP.flora.species.flr012.profile()')
    plan=page.evaluate('()=>INK_APP.flora.species.flr012.plan(12012)')

    # The only formal Candidate A R1 execution in this work package.
    executed=page.evaluate('(plan)=>INK_APP.flora.completeHero.execute(plan)',plan)
    formal_execute_count += 1
    if not executed.get('ok'): raise RuntimeError(json.dumps(executed,ensure_ascii=False))

    final_export=export_canvas(page); final_png=decode(final_export['data'])
    CANDIDATE.write_bytes(final_png)
    (OUT/'FLR012_Candidate_A_R1.png').write_bytes(final_png)
    serialized=page.evaluate('()=>INK_APP.flora.serializeDocument()')
    INK.write_text(serialized,encoding='utf-8')
    (OUT/'FLR012_Candidate_A_R1.ink').write_text(serialized,encoding='utf-8')

    runtime=page.evaluate("""()=>{const p=INK_APP.page(),h=INK_APP.flora.adapter.hero(),m=INK_APP.flora.completeHero.mapping('flr012-adonis-candidate-a');const objects=p.layers.flatMap(l=>l.objects||[]);return {structure:h,mapping:m,recipes:Object.values(p.floraRecipeState?.recipes||{}).map(x=>x.recipe),documentHash:INK_APP.flora.documentHash(),replayHash:INK_APP.flora.replayHash(),heroReplayHash:INK_APP.flora.completeHero.replayHash('flr012-adonis-candidate-a'),maskCache:INK_APP.flora.maskCacheDiagnostics(),history:{undo:INK_APP.history.undoStack.length,redo:INK_APP.history.redoStack.length},renderer:INK_APP.renderer.naturalMedia.diagnostics(),strokeStats:{all:objects.filter(o=>o.floraPaint).length,low:objects.filter(o=>o.floraPaint?.frequencyLayer==='low').length,mid:objects.filter(o=>o.floraPaint?.frequencyLayer==='mid').length,high:objects.filter(o=>o.floraPaint?.frequencyLayer==='high').length}}""")

    # Frequency-layer evidence from the same compiled Candidate.
    frequency_exports={}
    for name,vis in [('low',{'low':True,'mid':False,'high':False}),('mid',{'low':False,'mid':True,'high':False}),('high',{'low':False,'mid':False,'high':True}),('all',{'low':True,'mid':True,'high':True})]:
        page.evaluate('(v)=>INK_APP.renderer.naturalMedia.setFrequencyVisibility(v)',vis)
        ex=export_canvas(page); data=decode(ex['data']); (OUT/f'Frequency_{name}.png').write_bytes(data)
        frequency_exports[name]={'sha256':sha(data),'bytes':len(data),'width':ex['width'],'height':ex['height']}

    # Undo/redo is validation only; no recompilation.
    complete_hash=page.evaluate('()=>({document:INK_APP.flora.documentHash(),replay:INK_APP.flora.replayHash(),hero:INK_APP.flora.completeHero.replayHash("flr012-adonis-candidate-a")})')
    undo=page.evaluate('()=>({ok:INK_APP.history.undo(),heroPresent:!!INK_APP.flora.completeHero.lookup("flr012-adonis-candidate-a"),document:INK_APP.flora.documentHash(),replay:INK_APP.flora.replayHash()})')
    redo=page.evaluate('()=>({ok:INK_APP.history.redo(),heroPresent:!!INK_APP.flora.completeHero.lookup("flr012-adonis-candidate-a"),document:INK_APP.flora.documentHash(),replay:INK_APP.flora.replayHash(),hero:INK_APP.flora.completeHero.replayHash("flr012-adonis-candidate-a")})')
    redo_export=export_canvas(page); redo_png=decode(redo_export['data']); (OUT/'Redo_Restored.png').write_bytes(redo_png)

    # Local recompile on one operation. Candidate export above remains the formal result.
    local_info=page.evaluate("""()=>{const page=INK_APP.page(),layer=page.layers.find(l=>l.id===page.activeLayerId)||page.layers[0];const manual={id:'manual-r1b-validation',type:'stroke',name:'Manual validation stroke',matrix:{a:1,b:0,c:0,d:1,e:0,f:0},opacity:1,color:'#222222',size:2,kind:'pen',points:[{x:-1000,y:-1000,p:1},{x:-990,y:-990,p:1}]};layer.objects.push(manual);const before=JSON.stringify(manual);const h=INK_APP.flora.adapter.hero(),petal=h.regions.find(r=>r.kind==='petal-region');const result=INK_APP.flora.completeHero.recompilePetal('flr012-adonis-candidate-a',petal.regionId,{operation:'Directional Brushwork',patch:{}});const manualAfter=JSON.stringify(INK_APP.flora.adapter.findObject('manual-r1b-validation')?.object);return{petalId:petal.regionId,result,manualPreserved:before===manualAfter};}""")
    local_after=export_canvas(page); (OUT/'Local_Recompile_Validation.png').write_bytes(decode(local_after['data']))
    # Undo local recompile only, leaving validation manual object outside history; final .ink was already saved.
    local_undo=page.evaluate('()=>({ok:INK_APP.history.undo(),hero:INK_APP.flora.completeHero.replayHash("flr012-adonis-candidate-a")})')

    # Inject one local-pass failure to verify rollback without compiling another full Candidate.
    rollback=page.evaluate("""()=>{const petal=INK_APP.flora.adapter.hero().regions.filter(r=>r.kind==='petal-region')[1];const before={document:INK_APP.flora.documentHash(),replay:INK_APP.flora.replayHash(),undo:INK_APP.history.undoStack.length,redo:INK_APP.history.redoStack.length,cache:JSON.stringify(INK_APP.flora.maskCacheDiagnostics())};const original=INK_APP.flora.adapter.execute.bind(INK_APP.flora.adapter);let count=0;INK_APP.flora.adapter.execute=(action,options)=>{if(action.type==='createStroke'&&++count===2)throw new Error('WP9A-R1b injected local validation failure');return original(action,options)};const result=INK_APP.flora.completeHero.recompilePetal('flr012-adonis-candidate-a',petal.regionId,{operation:'Directional Brushwork',patch:{opacity:[.04,.08]}});INK_APP.flora.adapter.execute=original;const after={document:INK_APP.flora.documentHash(),replay:INK_APP.flora.replayHash(),undo:INK_APP.history.undoStack.length,redo:INK_APP.history.redoStack.length,cache:JSON.stringify(INK_APP.flora.maskCacheDiagnostics())};return{result,before,after,documentRestored:before.document===after.document,replayRestored:before.replay===after.replay,historyUnchanged:before.undo===after.undo&&before.redo===after.redo,cacheRestored:before.cache===after.cache};}""")

    # Reload the exact saved .ink; no candidate compilation occurs.
    page.evaluate('(s)=>INK_APP.flora.reloadDocument(s)',serialized)
    page.evaluate("INK_APP.switchWorkspace('layout',{fit:false,announce:false});INK_APP.fitArtboard({switchSpace:false});INK_TEST.setRenderMode('canvas2d');INK_APP.renderer.naturalMedia.setFrequencyVisibility({low:true,mid:true,high:true});")
    roundtrip_hashes=page.evaluate('()=>({document:INK_APP.flora.documentHash(),replay:INK_APP.flora.replayHash(),hero:INK_APP.flora.completeHero.replayHash("flr012-adonis-candidate-a"),mapping:INK_APP.flora.completeHero.mapping("flr012-adonis-candidate-a")})')
    roundtrip_export=export_canvas(page); roundtrip_png=decode(roundtrip_export['data']); (OUT/'Roundtrip_Reload.png').write_bytes(roundtrip_png)
    page.screenshot(path=str(OUT/'Runtime_UI.png'),full_page=True)
    browser.close()

errors=[m for m in messages if m['type'] in {'error','pageerror'}]
# Save machine-readable evidence.
(OUT/'FLR012_R1_Hero_Profile.json').write_text(json.dumps(profile,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(OUT/'FLR012_R1_Painting_Plan.json').write_text(json.dumps(plan,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(OUT/'FLR012_R1_Painting_Recipes.json').write_text(json.dumps(runtime['recipes'],ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(OUT/'FLR012_R1_Structure.json').write_text(json.dumps(runtime['structure'],ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

# Derivative evidence from the one formal PNG.
im=Image.open(io.BytesIO(final_png)).convert('RGB'); w,h=im.size
im.resize((212,300),Image.Resampling.LANCZOS).save(SMALL); im.resize((212,300),Image.Resampling.LANCZOS).save(OUT/'FLR012_Candidate_A_R1_Small_View.png')
im.crop((0,0,w,int(h*.54))).save(OUT/'Crown_Closeup.png')
im.crop((int(w*.28),int(h*.11),int(w*.72),int(h*.43))).resize((880,640),Image.Resampling.LANCZOS).save(OUT/'Center_Closeup.png')
im.crop((int(w*.23),int(h*.28),int(w*.77),int(h*.58))).resize((900,600),Image.Resampling.LANCZOS).save(OUT/'Petal_Root_Closeup.png')
im.crop((0,int(h*.47),w,h)).save(OUT/'Four_Leaves_Closeup.png')
im.crop((int(w*.42),int(h*.38),int(w*.58),h)).resize((350,900),Image.Resampling.LANCZOS).save(OUT/'Stem_Closeup.png')
im.crop((0,0,int(w*.28),h)).save(OUT/'Background_Closeup.png')

# Comparison sheets.
def fit(img,size,bg='white'):
    x=img.copy();x.thumbnail(size,Image.Resampling.LANCZOS);c=Image.new('RGB',size,bg);c.paste(x,((size[0]-x.width)//2,(size[1]-x.height)//2));return c
old=Image.open(OLD).convert('RGB') if OLD.exists() else Image.new('RGB',(595,842),'white')
side=Image.new('RGB',(1240,930),'white'); d=ImageDraw.Draw(side); side.paste(fit(old,(595,842)),(15,55));side.paste(fit(im,(595,842)),(630,55));d.text((220,20),'Original Candidate A · FAIL',fill='black');d.text((825,20),'Candidate A R1',fill='black');side.save(ROOT/'FLR012_Candidate_A_FAIL_vs_R1.png');side.save(OUT/'FLR012_Candidate_A_FAIL_vs_R1.png')
smallside=Image.new('RGB',(500,360),'white');sd=ImageDraw.Draw(smallside);smallside.paste(fit(old,(212,300)),(15,40));smallside.paste(fit(im,(212,300)),(270,40));sd.text((42,12),'Candidate A FAIL',fill='black');sd.text((316,12),'Candidate A R1',fill='black');smallside.save(OUT/'Small_View_Comparison.png')

# Structure / mask / topology evidence from locked geometry.
S=runtime['structure']; canvas=Image.new('RGB',(595,842),'white'); d=ImageDraw.Draw(canvas,'RGBA')
colors={'leaf-region':(55,135,60,125),'stem-region':(35,105,45,150),'petal-region':(245,194,25,125),'flower-center-region':(225,139,12,180)}
for r in sorted(S['regions'],key=lambda x:x.get('z',0)):
    if r['kind']=='background-region': continue
    pts=[(p['x']*595,p['y']*842) for p in r['path']]
    d.polygon(pts,fill=colors.get(r['kind'],(100,100,100,80)),outline=(35,35,35,190))
    ga=r.get('growthAxis');
    if ga:d.line([(ga['base']['x']*595,ga['base']['y']*842),(ga['tip']['x']*595,ga['tip']['y']*842)],fill=(30,65,180,220),width=2)
canvas.save(OUT/'Mask_Topology_View.png')
# Silhouette view
sil=Image.new('L',(595,842),0); ds=ImageDraw.Draw(sil)
for r in S['regions']:
    if r['kind']=='background-region': continue
    ds.polygon([(p['x']*595,p['y']*842) for p in r['path']],fill=255)
Image.merge('RGB',(sil,sil,sil)).save(OUT/'Silhouette_View.png')

runtime_log={
 'schema':'INK_FLORA_WP9A_R1B_RUNTIME_V1','imageModelUsed':False,'formalCandidateExecuteCount':formal_execute_count,'seed':12012,
 'directOpenSmoke':direct_open,'mapping':mapping,'profileId':profile['profileId'],'execute':executed,
 'candidate':{'path':str(CANDIDATE),'width':final_export['width'],'height':final_export['height'],'bytes':len(final_png),'sha256':sha(final_png)},
 'ink':{'path':str(INK),'bytes':len(serialized.encode('utf-8'))},
 'runtime':{k:v for k,v in runtime.items() if k not in ['structure','recipes','mapping']},'frequencyExports':frequency_exports,
 'undo':undo,'redo':redo,'redoPngSha256':sha(redo_png),'redoMatchesCandidate':sha(redo_png)==sha(final_png),
 'localRecompile':local_info,'localUndo':local_undo,'rollback':rollback,
 'roundtrip':{'hashes':roundtrip_hashes,'pngSha256':sha(roundtrip_png),'pngMatchesCandidate':sha(roundtrip_png)==sha(final_png),'replayMatches':roundtrip_hashes['replay']==runtime['replayHash'],'heroReplayMatches':roundtrip_hashes['hero']==runtime['heroReplayHash']},
 'errors':errors
}
(OUT/'runtime-log.json').write_text(json.dumps(runtime_log,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'ok':not errors,'formalCandidateExecuteCount':formal_execute_count,'candidate':runtime_log['candidate'],'execute':{'recipes':executed.get('recipeCount'),'actions':executed.get('actionCount'),'strokes':executed.get('strokeCount'),'checks':executed.get('checks')},'directOpen':direct_open,'undoRedo':{'undo':undo,'redo':redo,'matches':runtime_log['redoMatchesCandidate']},'local':local_info,'rollback':{k:rollback[k] for k in ['documentRestored','replayRestored','historyUnchanged','cacheRestored']},'roundtrip':runtime_log['roundtrip'],'errors':errors},ensure_ascii=False,indent=2))
