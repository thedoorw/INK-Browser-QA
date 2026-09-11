from pathlib import Path
from playwright.sync_api import sync_playwright
import base64, json, hashlib
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index-standalone.html').read_text(encoding='utf-8').replace('<link rel="stylesheet" href="styles.css">','').replace('<script src="dist/ink.compat.js"></script>','')
css=(ROOT/'styles.css').read_text(encoding='utf-8'); js=(ROOT/'dist/ink.compat.js').read_text(encoding='utf-8')
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu-sandbox'])
 page=b.new_page(viewport={'width':1500,'height':1120})
 page.set_content(html,wait_until='domcontentloaded'); page.add_style_tag(content=css); page.add_script_tag(content=js)
 page.wait_for_function('window.INK_APP?.flora?.completeHero',timeout=30000)
 page.evaluate("INK_TEST.fresh();INK_APP.switchWorkspace('layout',{fit:false,announce:false});INK_APP.fitArtboard({switchSpace:false});INK_TEST.setRenderMode('canvas2d');")
 plan=page.evaluate('()=>INK_APP.flora.species.flr012.plan(12012)')
 result=page.evaluate('(plan)=>INK_APP.flora.completeHero.execute(plan)',plan)
 if not result.get('ok'): raise RuntimeError(json.dumps(result))
 exp=page.evaluate("""async()=>{const c=await INK_APP.renderExportCanvas({scope:'artboard',ppi:72,includeBleed:false,cropMarks:false,background:true});return{data:c.toDataURL('image/png'),width:c.width,height:c.height}}""")
 png=base64.b64decode(exp['data'].split(',',1)[1]); (ROOT/'FLR012_R2_Structural_Identity_Recovery_PREVIEW_ONLY.png').write_bytes(png)
 Image.open(ROOT/'FLR012_R2_Structural_Identity_Recovery_PREVIEW_ONLY.png').convert('RGB').resize((212,300),Image.Resampling.LANCZOS).save(ROOT/'FLR012_R2_Structural_Identity_Recovery_Small_View_PREVIEW_ONLY.png')
 ink=page.evaluate('()=>INK_APP.flora.serializeDocument()'); (ROOT/'FLR012_R2_Structural_Identity_Recovery_PREVIEW_ONLY.ink').write_text(ink,encoding='utf-8')
 stats=page.evaluate("""()=>{const p=INK_APP.page(),s=p.floraHero;return{documentHash:INK_APP.flora.documentHash(),replayHash:INK_APP.flora.replayHash(),heroReplayHash:INK_APP.flora.completeHero.replayHash('flr012-adonis-candidate-a'),regions:s.regions.map(r=>({id:r.regionId,kind:r.kind,ring:r.petal?.ring||null,z:r.z})),objectCount:p.layers.reduce((n,l)=>n+(l.objects||[]).length,0)}}""")
 b.close()
 print(json.dumps({'ok':True,'seed':12012,'png':{'width':exp['width'],'height':exp['height'],'sha256':hashlib.sha256(png).hexdigest()},'inkSha256':hashlib.sha256(ink.encode()).hexdigest(),'stats':stats},indent=2))
