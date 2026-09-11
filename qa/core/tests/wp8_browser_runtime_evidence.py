from pathlib import Path
from playwright.sync_api import sync_playwright
import base64, json, shutil
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'Runtime_Evidence'/'WP8'; OUT.mkdir(parents=True,exist_ok=True)
PLAN=json.loads((OUT/'A4_Hero_Painterly_Plan.json').read_text(encoding='utf-8'))
html=(ROOT/'index-standalone.html').read_text(encoding='utf-8').replace('<link rel="stylesheet" href="styles.css">','').replace('<script src="dist/ink.compat.js"></script>','')
css=(ROOT/'styles.css').read_text(encoding='utf-8'); js=(ROOT/'dist'/'ink.compat.js').read_text(encoding='utf-8')
messages=[]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu-sandbox'])
    page=browser.new_page(viewport={'width':1500,'height':1120})
    page.on('console',lambda m:messages.append({'type':m.type,'text':m.text}))
    page.on('pageerror',lambda e:messages.append({'type':'pageerror','text':str(e)}))
    page.set_content(html,wait_until='domcontentloaded'); page.add_style_tag(content=css); page.add_script_tag(content=js)
    page.wait_for_function('window.INK_APP?.flora?.completeHero')
    page.evaluate("INK_TEST.fresh();INK_TEST.setRenderMode('canvas2d');INK_APP.switchWorkspace('layout',{fit:false,announce:false});INK_APP.fitArtboard({switchSpace:false});")
    compiled=page.evaluate('plan=>INK_APP.flora.completeHero.compile(plan)',PLAN)
    executed=page.evaluate('plan=>INK_APP.flora.completeHero.execute(plan)',PLAN)
    if not executed.get('ok'): raise RuntimeError(json.dumps(executed,ensure_ascii=False))
    png=page.evaluate("""async()=>{const c=await INK_APP.renderExportCanvas({scope:'artboard',ppi:72,includeBleed:false,cropMarks:false,background:true});return {data:c.toDataURL('image/png'),width:c.width,height:c.height}}""")
    payload=base64.b64decode(png['data'].split(',',1)[1]); (OUT/'01_wp8_painterly_complete.png').write_bytes(payload)
    browser.close()
errors=[m for m in messages if m['type'] in {'error','pageerror'}]
log={'schema':'INK_FLORA_WP8_BROWSER_RUNTIME_V1','imageModelUsed':False,'specificSpeciesUsed':False,'benchmarkTraced':False,'compiled':{'ok':compiled.get('ok'),'compileHash':compiled.get('compileHash'),'checks':compiled.get('checks')},'execute':executed,'export':{'width':png['width'],'height':png['height'],'bytes':len(payload)},'consoleErrors':errors}
(OUT/'runtime-log.json').write_text(json.dumps(log,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(OUT/'runtime-complete.flag').write_text('PASS\n' if not errors else 'FAIL\n',encoding='utf-8')
print(json.dumps({'ok':not errors,'strokes':executed.get('strokeCount'),'export':log['export']},indent=2))
