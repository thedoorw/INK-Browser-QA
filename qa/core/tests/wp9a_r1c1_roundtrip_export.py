from pathlib import Path
from playwright.sync_api import sync_playwright
import base64, hashlib, json
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'Runtime_Evidence'/'NonPeriodicFill'
source=(ROOT/'FLR012_R1c1_NonPeriodic_Fill_PREVIEW_ONLY.png').read_bytes()
serialized=(ROOT/'FLR012_R1c1_NonPeriodic_Fill_PREVIEW_ONLY.ink').read_text(encoding='utf-8')
html=(ROOT/'index-standalone.html').read_text(encoding='utf-8').replace('<link rel="stylesheet" href="styles.css">','').replace('<script src="dist/ink.compat.js"></script>','')
css=(ROOT/'styles.css').read_text(encoding='utf-8'); js=(ROOT/'dist/ink.compat.js').read_text(encoding='utf-8')
messages=[]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu-sandbox'])
    page=browser.new_page(viewport={'width':1500,'height':1120})
    page.on('console',lambda m:messages.append({'type':m.type,'text':m.text}))
    page.on('pageerror',lambda e:messages.append({'type':'pageerror','text':str(e)}))
    page.set_content(html,wait_until='domcontentloaded'); page.add_style_tag(content=css); page.add_script_tag(content=js)
    page.wait_for_function('window.INK_APP?.flora')
    page.evaluate('(s)=>INK_APP.flora.reloadDocument(s)',serialized)
    result=page.evaluate("""async()=>{INK_APP.switchWorkspace('layout',{fit:false,announce:false});INK_APP.fitArtboard({switchSpace:false});INK_TEST.setRenderMode('canvas2d');const c=await INK_APP.renderExportCanvas({scope:'artboard',ppi:72,includeBleed:false,cropMarks:false,background:true});return{data:c.toDataURL('image/png'),width:c.width,height:c.height,documentHash:INK_APP.flora.documentHash(),replayHash:INK_APP.flora.replayHash(),heroReplayHash:INK_APP.flora.completeHero.replayHash('flr012-adonis-candidate-a')}}""")
    browser.close()
png=base64.b64decode(result['data'].split(',',1)[1]); (OUT/'Roundtrip_Reload_Export.png').write_bytes(png)
sha=lambda b:hashlib.sha256(b).hexdigest()
log={'schema':'INK_FLORA_WP9A_R1C1_ROUNDTRIP_EXPORT_V1','sourceSha256':sha(source),'reloadSha256':sha(png),'matchesSource':sha(source)==sha(png),'width':result['width'],'height':result['height'],'documentHash':result['documentHash'],'replayHash':result['replayHash'],'heroReplayHash':result['heroReplayHash'],'errors':[m for m in messages if m['type'] in ('error','pageerror')]}
(OUT/'roundtrip-export.json').write_text(json.dumps(log,indent=2)+'\n')
print(json.dumps(log,indent=2))
if not log['matchesSource'] or log['errors']: raise SystemExit(1)
