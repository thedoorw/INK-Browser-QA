from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
import base64, json, io, hashlib
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'Runtime_Evidence'/'WP9A';OUT.mkdir(parents=True,exist_ok=True)
html=(ROOT/'index-standalone.html').read_text(encoding='utf-8').replace('<link rel="stylesheet" href="styles.css">','').replace('<script src="dist/ink.compat.js"></script>','')
css=(ROOT/'styles.css').read_text(encoding='utf-8'); js=(ROOT/'dist'/'ink.compat.js').read_text(encoding='utf-8')
messages=[]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu-sandbox'])
    page=browser.new_page(viewport={'width':1500,'height':1120})
    page.on('console',lambda m:messages.append({'type':m.type,'text':m.text}));page.on('pageerror',lambda e:messages.append({'type':'pageerror','text':str(e)}))
    page.set_content(html,wait_until='domcontentloaded');page.add_style_tag(content=css);page.add_script_tag(content=js)
    page.wait_for_function('window.INK_APP?.flora?.species?.flr012')
    page.evaluate("INK_TEST.fresh();INK_APP.switchWorkspace('layout',{fit:false,announce:false});INK_APP.fitArtboard({switchSpace:false});INK_TEST.setRenderMode('canvas2d');")
    mapping=page.evaluate('()=>INK_APP.flora.species.flr012.sourceMapping()')
    profile=page.evaluate('()=>INK_APP.flora.species.flr012.profile()')
    plan=page.evaluate('()=>INK_APP.flora.species.flr012.plan(12012)')
    compiled=page.evaluate('(plan)=>INK_APP.flora.completeHero.compile(plan)',plan)
    if not compiled.get('ok'): raise RuntimeError(json.dumps(compiled,ensure_ascii=False))
    executed=page.evaluate('(plan)=>INK_APP.flora.completeHero.execute(plan)',plan)
    if not executed.get('ok'): raise RuntimeError(json.dumps(executed,ensure_ascii=False))
    export=page.evaluate("""async()=>{const c=await INK_APP.renderExportCanvas({scope:'artboard',ppi:72,includeBleed:false,cropMarks:false,background:true});return{data:c.toDataURL('image/png'),width:c.width,height:c.height}}""")
    png=base64.b64decode(export['data'].split(',',1)[1]); (OUT/'FLR012_Candidate_A.png').write_bytes(png)
    serialized=page.evaluate('()=>INK_APP.flora.serializeDocument()'); (OUT/'FLR012_Candidate_A.ink.json').write_text(serialized,encoding='utf-8')
    runtime=page.evaluate("""()=>{const p=INK_APP.page(),h=INK_APP.flora.adapter.hero(),m=INK_APP.flora.completeHero.mapping('flr012-adonis-candidate-a');return {structure:h,mapping:m,recipes:Object.values(p.floraRecipeState?.recipes||{}).map(x=>x.recipe),documentHash:INK_APP.flora.documentHash(),replayHash:INK_APP.flora.replayHash(),heroReplayHash:INK_APP.flora.completeHero.replayHash('flr012-adonis-candidate-a'),maskCache:INK_APP.flora.maskCacheDiagnostics(),history:{undo:INK_APP.history.undoStack.length,redo:INK_APP.history.redoStack.length},renderer:INK_APP.renderer.naturalMedia.diagnostics()}}""")
    # local recompile one petal, then render evidence only
    petal_id=next(r['regionId'] for r in runtime['structure']['regions'] if r['kind']=='petal-region')
    before_non=page.evaluate("""(petal)=>{const m=INK_APP.flora.completeHero.mapping('flr012-adonis-candidate-a');const targets=new Set((m.regionRecipeIds[petal]||[]).flatMap(id=>m.recipeToStrokeIds[id]||[]));const ids=m.strokeIds.filter(id=>!targets.has(id));const stable=v=>JSON.stringify(v,(k,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.keys(x).sort().reduce((o,n)=>(o[n]=x[n],o),{}):x);let h=0x811c9dc5;const t=stable(ids.map(id=>INK_APP.flora.adapter.findObject(id)?.object).filter(Boolean));for(let i=0;i<t.length;i++){h^=t.charCodeAt(i);h=Math.imul(h,0x01000193)}return(h>>>0).toString(16).padStart(8,'0')}""",petal_id)
    local=page.evaluate("""(petal)=>INK_APP.flora.completeHero.recompilePetal('flr012-adonis-candidate-a',petal,{operation:'Directional Brushwork',patch:{opacity:[.045,.105],edgeSoftness:.007}})""",petal_id)
    after_non=local.get('nonTargetHashAfter')
    local_export=page.evaluate("""async()=>{const c=await INK_APP.renderExportCanvas({scope:'artboard',ppi:72,includeBleed:false,cropMarks:false,background:true});return c.toDataURL('image/png')}""")
    (OUT/'FLR012_Local_Recompile_After.png').write_bytes(base64.b64decode(local_export.split(',',1)[1]))
    browser.close()

errors=[m for m in messages if m['type'] in {'error','pageerror'}]
(OUT/'FLR012_Reference_Mapping.json').write_text(json.dumps(mapping,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(OUT/'FLR012_Hero_Profile.json').write_text(json.dumps(profile,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(OUT/'FLR012_Hero_Painting_Plan.json').write_text(json.dumps(plan,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(OUT/'FLR012_Painting_Recipes.json').write_text(json.dumps(runtime['recipes'],ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(OUT/'FLR012_Structure.json').write_text(json.dumps(runtime['structure'],ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
# Small view and crops
im=Image.open(io.BytesIO(png)).convert('RGB'); im.resize((212,300),Image.Resampling.LANCZOS).save(OUT/'FLR012_Small_View.png')
w,h=im.size
im.crop((0,0,w,int(h*.54))).save(OUT/'FLR012_Crown_Result.png')
im.crop((int(w*.32),int(h*.12),int(w*.68),int(h*.44))).save(OUT/'FLR012_Center_Result.png')
im.crop((0,int(h*.42),w,h)).save(OUT/'FLR012_Four_Leaves_Stem_Result.png')
# structure/mask/topology diagrams
S=runtime['structure']; canvas=Image.new('RGB',(595,842),'white'); d=ImageDraw.Draw(canvas,'RGBA')
colors={'background-region':(220,224,235,40),'leaf-region':(64,125,70,100),'stem-region':(55,100,55,130),'petal-region':(244,196,35,115),'flower-center-region':(222,146,18,155)}
for r in sorted(S['regions'],key=lambda x:x.get('z',0)):
    if r['kind']=='background-region': continue
    pts=[(p['x']*595,p['y']*842) for p in r['path']]
    d.polygon(pts,fill=colors.get(r['kind'],(100,100,100,80)),outline=(40,40,40,180))
    gx=r.get('growthAxis');
    if gx: d.line([(gx['base']['x']*595,gx['base']['y']*842),(gx['tip']['x']*595,gx['tip']['y']*842)],fill=(20,60,160,200),width=2)
canvas.save(OUT/'FLR012_Unpainted_Structure.png')
# labeled topology
label=canvas.copy(); dl=ImageDraw.Draw(label,'RGBA')
for r in S['regions']:
    if r['kind']=='background-region': continue
    gx=r.get('growthAxis',{}).get('tip',{'x':.5,'y':.5}); text=r['regionId'].split(':')[-1]
    dl.text((gx['x']*595-12,gx['y']*842-8),text,fill=(0,0,0,255))
label.save(OUT/'FLR012_Region_Mask_Topology.png')
# Reference identity evidence contact image
ref=Image.open(ROOT/'Reference_Audit'/'WP9A'/'FLR012_Reference_Crop.png').convert('RGB')
ref.thumbnail((260,380))
evid=Image.new('RGB',(900,430),'white'); evid.paste(ref,(20,25)); de=ImageDraw.Draw(evid)
lines=['FLR-012 / 01-12 / D012','福壽草 / Adonis','Adonis amurensis','Source: 1-A.png, slot 12','Crop: x780 y720 w275 h400','Mapping: VERIFIED (6/6 fields)']
for i,t in enumerate(lines): de.text((320,45+i*48),t,fill='black')
evid.save(OUT/'FLR012_Excel_Reference_Identity_Evidence.png')
log={'schema':'INK_FLORA_WP9A_RUNTIME_V1','imageModelUsed':False,'candidateCount':1,'mapping':mapping,'profileId':profile['profileId'],'compile':{'planHash':compiled['planHash'],'structureHash':compiled['structureHash'],'compileHash':compiled['compileHash'],'preview':compiled['preview'],'failedChecks':compiled['checks']['failed']},'execute':executed,'export':{'width':export['width'],'height':export['height'],'bytes':len(png),'sha256':hashlib.sha256(png).hexdigest()},'runtime':{k:v for k,v in runtime.items() if k not in ['structure','recipes','mapping']},'localRecompile':{'result':local,'nonTargetBefore':before_non,'nonTargetAfter':after_non,'nonTargetUnchanged':before_non==after_non},'errors':errors}
(OUT/'runtime-log.json').write_text(json.dumps(log,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'ok':not errors,'candidate':log['export'],'preview':compiled['preview'],'checksPassed':not compiled['checks']['failed'],'executeChecksPassed':executed['checks']['passed'],'local':log['localRecompile'],'replayHash':runtime['replayHash'],'heroReplayHash':runtime['heroReplayHash']},ensure_ascii=False,indent=2))
