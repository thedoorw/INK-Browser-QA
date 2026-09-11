from pathlib import Path
from playwright.sync_api import sync_playwright
import argparse, base64, json
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'Runtime_Evidence'/'WP8B';OUT.mkdir(parents=True,exist_ok=True)
PLAN=json.loads((ROOT/'Runtime_Evidence'/'WP8'/'A4_Hero_Painterly_Plan.json').read_text(encoding='utf-8'))
parser=argparse.ArgumentParser();parser.add_argument('--frequency',choices=['all','low','mid','high'],default='all');parser.add_argument('--seed-offset',type=int,default=0);args=parser.parse_args()
if args.seed_offset:
    PLAN['seed']+=args.seed_offset;PLAN['crownPlan']['seed']+=args.seed_offset;PLAN['stemPlan']['seed']+=args.seed_offset
    for item in PLAN['leafPlans']: item['seed']+=args.seed_offset
    PLAN['backgroundPlan']['seed']+=args.seed_offset
html=(ROOT/'index-standalone.html').read_text(encoding='utf-8').replace('<link rel="stylesheet" href="styles.css">','').replace('<script src="dist/ink.compat.js"></script>','')
css=(ROOT/'styles.css').read_text(encoding='utf-8');js=(ROOT/'dist'/'ink.compat.js').read_text(encoding='utf-8')
messages=[]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu-sandbox'])
    page=browser.new_page(viewport={'width':1500,'height':1120})
    page.on('console',lambda m:messages.append({'type':m.type,'text':m.text}));page.on('pageerror',lambda e:messages.append({'type':'pageerror','text':str(e)}))
    page.set_content(html,wait_until='domcontentloaded');page.add_style_tag(content=css);page.add_script_tag(content=js)
    page.wait_for_function('window.INK_APP?.flora?.completeHero')
    page.evaluate("INK_TEST.fresh();INK_APP.switchWorkspace('layout',{fit:false,announce:false});INK_APP.fitArtboard({switchSpace:false});INK_TEST.setRenderMode('canvas2d');")
    executed=page.evaluate('plan=>INK_APP.flora.completeHero.execute(plan)',PLAN)
    if not executed.get('ok'): raise RuntimeError(json.dumps(executed,ensure_ascii=False))
    visibility={'all':{'low':True,'mid':True,'high':True},'low':{'low':True,'mid':False,'high':False},'mid':{'low':False,'mid':True,'high':False},'high':{'low':False,'mid':False,'high':True}}[args.frequency]
    page.evaluate('(v)=>INK_APP.renderer.naturalMedia.setFrequencyVisibility(v)',visibility)
    png=page.evaluate("""async()=>{const c=await INK_APP.renderExportCanvas({scope:'artboard',ppi:72,includeBleed:false,cropMarks:false,background:true});return{data:c.toDataURL('image/png'),width:c.width,height:c.height,diag:INK_APP.renderer.naturalMedia.diagnostics()}}""")
    payload=base64.b64decode(png['data'].split(',',1)[1]); suffix='-seed-plus1' if args.seed_offset else ''
    name=f"01_wp8b_{args.frequency}{suffix}.png";(OUT/name).write_bytes(payload)
    stroke_stats=page.evaluate("""()=>{const objects=INK_APP.page().layers.flatMap(l=>l.objects||[]).filter(o=>o.floraPaint);const byFrequency={};const byOperation={};for(const o of objects){const f=o.floraPaint.frequencyLayer||'legacy';byFrequency[f]=(byFrequency[f]||0)+1;const op=o.floraPaint.operation||'unknown';byOperation[op]=(byOperation[op]||0)+1;}return{count:objects.length,byFrequency,byOperation,opacity:{min:Math.min(...objects.map(o=>o.opacity)),max:Math.max(...objects.map(o=>o.opacity)),mean:objects.reduce((a,o)=>a+o.opacity,0)/objects.length}}}""")
    browser.close()
errors=[m for m in messages if m['type'] in {'error','pageerror'}]
log={'schema':'INK_FLORA_WP8B_BROWSER_RENDER_V1','frequency':args.frequency,'seedOffset':args.seed_offset,'imageModelUsed':False,'specificSpeciesUsed':False,'benchmarkTraced':False,'execute':executed,'export':{'width':png['width'],'height':png['height'],'bytes':len(payload)},'diagnostics':png['diag'],'strokeStats':stroke_stats,'errors':errors}
(OUT/f"runtime-{args.frequency}{'-seed-plus1' if args.seed_offset else ''}.json").write_text(json.dumps(log,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'ok':not errors,'frequency':args.frequency,'export':log['export'],'strokeStats':stroke_stats,'diagnostics':png['diag']},ensure_ascii=False,indent=2))
