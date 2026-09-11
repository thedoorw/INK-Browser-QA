from pathlib import Path
from playwright.sync_api import sync_playwright
import argparse, base64, json
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'Runtime_Evidence'/'WP8A';OUT.mkdir(parents=True,exist_ok=True)
PLAN=json.loads((ROOT/'Runtime_Evidence'/'WP8'/'A4_Hero_Painterly_Plan.json').read_text(encoding='utf-8'))
parser=argparse.ArgumentParser();parser.add_argument('--backend',choices=['canvas2d','gpu'],required=True);parser.add_argument('--headful',action='store_true');parser.add_argument('--seed-offset',type=int,default=0);args=parser.parse_args()
if args.seed_offset:
    PLAN['seed']+=args.seed_offset
    PLAN['crownPlan']['seed']+=args.seed_offset
    PLAN['stemPlan']['seed']+=args.seed_offset
    for item in PLAN['leafPlans']: item['seed']+=args.seed_offset
    PLAN['backgroundPlan']['seed']+=args.seed_offset
html=(ROOT/'index-standalone.html').read_text(encoding='utf-8').replace('<link rel="stylesheet" href="styles.css">','').replace('<script src="dist/ink.compat.js"></script>','')
css=(ROOT/'styles.css').read_text(encoding='utf-8');js=(ROOT/'dist'/'ink.compat.js').read_text(encoding='utf-8')
messages=[]
launch_args=['--no-sandbox','--disable-gpu-sandbox']
if args.backend=='gpu':launch_args+=['--use-angle=swiftshader','--enable-webgl','--ignore-gpu-blocklist']
with sync_playwright() as p:
    browser=p.chromium.launch(headless=not args.headful,executable_path='/usr/bin/chromium',args=launch_args)
    page=browser.new_page(viewport={'width':1500,'height':1120})
    page.on('console',lambda m:messages.append({'type':m.type,'text':m.text}))
    page.on('pageerror',lambda e:messages.append({'type':'pageerror','text':str(e)}))
    page.set_content(html,wait_until='domcontentloaded');page.add_style_tag(content=css);page.add_script_tag(content=js)
    page.wait_for_function('window.INK_APP?.flora?.completeHero')
    page.evaluate("INK_TEST.fresh();INK_APP.switchWorkspace('layout',{fit:false,announce:false});INK_APP.fitArtboard({switchSpace:false});")
    mode=page.evaluate('(m)=>INK_TEST.setRenderMode(m)',args.backend)
    gpu_validation=page.evaluate('INK_APP.runGPUValidation()') if args.backend=='gpu' else None
    compiled=page.evaluate('plan=>INK_APP.flora.completeHero.compile(plan)',PLAN)
    executed=page.evaluate('plan=>INK_APP.flora.completeHero.execute(plan)',PLAN)
    if not executed.get('ok'):raise RuntimeError(json.dumps(executed,ensure_ascii=False))
    png=page.evaluate("""async()=>{const c=await INK_APP.renderExportCanvas({scope:'artboard',ppi:72,includeBleed:false,cropMarks:false,background:true});return{data:c.toDataURL('image/png'),width:c.width,height:c.height,diag:INK_APP.renderer.naturalMedia.diagnostics()}}""")
    payload=base64.b64decode(png['data'].split(',',1)[1]);name=('03_wp8a_canvas_seed_plus1.png' if args.backend=='canvas2d' else '04_wp8a_webgl_seed_plus1.png') if args.seed_offset else ('01_wp8a_canvas_full.png' if args.backend=='canvas2d' else '02_wp8a_webgl_full.png');(OUT/name).write_bytes(payload)
    browser.close()
errors=[m for m in messages if m['type'] in {'error','pageerror'}]
log={'schema':'INK_FLORA_WP8A_BROWSER_RENDER_V1','backend':args.backend,'imageModelUsed':False,'specificSpeciesUsed':False,'benchmarkTraced':False,'renderMode':mode,'gpuValidation':gpu_validation,'compiled':{'ok':compiled.get('ok'),'compileHash':compiled.get('compileHash')},'execute':executed,'export':{'width':png['width'],'height':png['height'],'bytes':len(payload)},'diagnostics':png['diag'],'errors':errors}
(OUT/f"{args.backend}{'-seed-plus1' if args.seed_offset else ''}-runtime-log.json").write_text(json.dumps(log,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'ok':not errors,'backend':args.backend,'export':log['export'],'diagnostics':png['diag'],'gpuValidation':gpu_validation},ensure_ascii=False,indent=2))
