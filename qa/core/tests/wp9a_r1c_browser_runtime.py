from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageOps
import base64, json, io, hashlib, math, statistics

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'Runtime_Evidence' / 'Retention'
OUT.mkdir(parents=True, exist_ok=True)
PREVIEW = ROOT / 'FLR012_PREVIEW_ONLY_Painted_Retention.png'
SMALL = ROOT / 'FLR012_PREVIEW_ONLY_Painted_Retention_Small_View.png'
INK = ROOT / 'FLR012_PREVIEW_ONLY_Painted_Retention.ink'
OLD = ROOT / 'FLR012_Candidate_A_R1.png'
GEOM_PREVIEW = ROOT / 'Runtime_Evidence' / 'Geometry' / 'R1a1_Geometry_Evidence_Contact_Sheet.png'

html = (ROOT / 'index-standalone.html').read_text(encoding='utf-8').replace('<link rel="stylesheet" href="styles.css">','').replace('<script src="dist/ink.compat.js"></script>','')
css = (ROOT / 'styles.css').read_text(encoding='utf-8')
js = (ROOT / 'dist' / 'ink.compat.js').read_text(encoding='utf-8')
messages=[]
direct_open={'attempted':True,'ok':False,'url':(ROOT/'index-standalone.html').resolve().as_uri()}
formal_preview_execute_count=0

def sha(data): return hashlib.sha256(data).hexdigest()
def decode(data_url): return base64.b64decode(data_url.split(',',1)[1])
def export_canvas(page, background=True):
    return page.evaluate("""async(bg)=>{const c=await INK_APP.renderExportCanvas({scope:'artboard',ppi:72,includeBleed:false,cropMarks:false,background:bg});return{data:c.toDataURL('image/png'),width:c.width,height:c.height}}""", background)

def fit(img,size,bg='white'):
    x=img.copy(); x.thumbnail(size,Image.Resampling.LANCZOS); c=Image.new('RGB',size,bg); c.paste(x,((size[0]-x.width)//2,(size[1]-x.height)//2)); return c

def path_mask(regions, size):
    w,h=size; m=Image.new('L',size,0); d=ImageDraw.Draw(m)
    for r in regions:
        pts=[(round(p['x']*w),round(p['y']*h)) for p in r['path']]
        if len(pts)>=3:d.polygon(pts,fill=255)
    return m

def alpha_mask(png_bytes):
    im=Image.open(io.BytesIO(png_bytes)).convert('RGBA')
    return im.getchannel('A')

def binary_count(mask, threshold=20):
    return sum(1 for v in mask.getdata() if v>=threshold)

def masked_ratio(geometry, painted, threshold=20):
    g=list(geometry.getdata()); p=list(painted.getdata()); total=sum(v>0 for v in g); hit=sum((gv>0 and pv>=threshold) for gv,pv in zip(g,p)); return hit/total if total else 0

def component_areas(mask, threshold=20):
    b=mask.point(lambda v:255 if v>=threshold else 0)
    w,h=b.size; px=b.load(); seen=set(); areas=[]
    for y in range(h):
        for x in range(w):
            if not px[x,y] or (x,y) in seen: continue
            stack=[(x,y)]; seen.add((x,y)); a=0
            while stack:
                qx,qy=stack.pop();a+=1
                for oy in (-1,0,1):
                    for ox in (-1,0,1):
                        if not ox and not oy:continue
                        nx,ny=qx+ox,qy+oy
                        if 0<=nx<w and 0<=ny<h and px[nx,ny] and (nx,ny) not in seen:
                            seen.add((nx,ny));stack.append((nx,ny))
            areas.append(a)
    return sorted(areas, reverse=True)

def save_stage_image(stage, path):
    w,h=stage['width'],stage['height']
    geom=Image.frombytes('L',(w,h),bytes(255 if v else 0 for v in stage['geometryMask']))
    raw=Image.frombytes('L',(w,h),bytes(min(255,int(v)) for v in stage['rawMask']))
    feather=Image.frombytes('L',(w,h),bytes(min(255,int(v)) for v in stage['featheredMask']))
    painted=Image.frombytes('L',(w,h),bytes(min(255,round(float(v)*255)) for v in stage['paintedAlpha']))
    sheet=Image.new('RGB',(w*4,h),(255,255,255)); draw=ImageDraw.Draw(sheet)
    for i,(name,img) in enumerate([('Geometry',geom),('Raw Mask',raw),('Feathered',feather),('Stroke Raster',painted)]):
        colored=ImageOps.colorize(img,'white',('#e3a300' if i<3 else '#d98200'))
        sheet.paste(colored,(i*w,0)); draw.text((i*w+4,4),name,fill='black')
    sheet.resize((w*8,h*2),Image.Resampling.NEAREST).save(path)
    return {'geometry':geom,'raw':raw,'feather':feather,'painted':painted}

with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu-sandbox'])
    smoke=browser.new_page(viewport={'width':1200,'height':900})
    try:
        smoke.goto(direct_open['url'],wait_until='domcontentloaded',timeout=30000)
        smoke.wait_for_function('window.INK_APP?.flora?.retention',timeout=30000)
        direct_open['ok']=True
        smoke.screenshot(path=str(OUT/'Direct_Open_HTML_Smoke.png'),full_page=True)
    except Exception as e:
        direct_open['error']=str(e); (OUT/'Direct_Open_HTML_Smoke_BLOCKED.txt').write_text(str(e)+'\n',encoding='utf-8')
    finally: smoke.close()

    page=browser.new_page(viewport={'width':1500,'height':1120})
    page.on('console',lambda m:messages.append({'type':m.type,'text':m.text}))
    page.on('pageerror',lambda e:messages.append({'type':'pageerror','text':str(e)}))
    page.set_content(html,wait_until='domcontentloaded');page.add_style_tag(content=css);page.add_script_tag(content=js)
    page.wait_for_function('window.INK_APP?.flora?.retention')
    page.evaluate("INK_TEST.fresh();INK_APP.switchWorkspace('layout',{fit:false,announce:false});INK_APP.fitArtboard({switchSpace:false});INK_TEST.setRenderMode('canvas2d');")
    plan=page.evaluate('()=>INK_APP.flora.species.flr012.plan(12012)')
    compile_a=page.evaluate('(plan)=>INK_APP.flora.completeHero.compile(plan)',plan)
    compile_b=page.evaluate('(plan)=>INK_APP.flora.completeHero.compile(plan)',plan)

    # The only complete diagnostic compilation in WP-9A-R1c.
    executed=page.evaluate('(plan)=>INK_APP.flora.completeHero.execute(plan)',plan); formal_preview_execute_count+=1
    if not executed.get('ok'): raise RuntimeError(json.dumps(executed,ensure_ascii=False))
    full=export_canvas(page,True); full_png=decode(full['data']); PREVIEW.write_bytes(full_png); (OUT/PREVIEW.name).write_bytes(full_png)
    serialized=page.evaluate('()=>INK_APP.flora.serializeDocument()'); INK.write_text(serialized,encoding='utf-8'); (OUT/INK.name).write_text(serialized,encoding='utf-8')
    runtime=page.evaluate("""()=>{const p=INK_APP.page(),s=p.floraHero,m=INK_APP.flora.retention.measure({page:p,structure:s,width:128,height:181}),g=INK_APP.flora.retention.evaluate(m);return{structure:s,measurement:m,gates:g,documentHash:INK_APP.flora.documentHash(),replayHash:INK_APP.flora.replayHash(),heroReplayHash:INK_APP.flora.completeHero.replayHash('flr012-adonis-candidate-a'),mapping:INK_APP.flora.completeHero.mapping('flr012-adonis-candidate-a'),recipes:Object.values(p.floraRecipeState?.recipes||{}).map(x=>x.recipe),history:{undo:INK_APP.history.undoStack.length,redo:INK_APP.history.redoStack.length}}}""")
    structure=runtime['structure']; regions=structure['regions']; crown_ids=[r['regionId'] for r in regions if r['kind'] in ('petal-region','flower-center-region')]; leaf_ids=structure['leafRegionIds']; stem_id=structure['stemRegionId']; center_id=structure['centerRegionId']; inner_ids=[r['regionId'] for r in regions if r['kind']=='petal-region' and r.get('petal',{}).get('ring')=='inner']; outer_ids=[r['regionId'] for r in regions if r['kind']=='petal-region' and r.get('petal',{}).get('ring')=='outer']

    async_export_filtered="""async(args)=>{const p=INK_APP.page(),objs=p.layers.flatMap(l=>l.objects||[]).filter(o=>o.floraPaint),keep=new Set(args.regionIds||[]),saved=objs.map(o=>[o,o.opacity]);for(const [o] of saved){const bg=o.floraPaint.regionId===p.floraHero.backgroundRegionId;o.opacity=(keep.has(o.floraPaint.regionId)||(args.keepBackground&&bg))?saved.find(x=>x[0]===o)[1]:0;}const c=await INK_APP.renderExportCanvas({scope:'artboard',ppi:72,includeBleed:false,cropMarks:false,background:!!args.background});const data=c.toDataURL('image/png');for(const [o,v] of saved)o.opacity=v;return{data,width:c.width,height:c.height}}"""
    isolated={}
    groups={'crown':crown_ids,'inner_ring':inner_ids,'outer_ring':outer_ids,'center':[center_id],'leaves':leaf_ids,'stem':[stem_id]}
    for name,ids in groups.items():
        ex=page.evaluate(async_export_filtered,{'regionIds':ids,'keepBackground':False,'background':False}); data=decode(ex['data']); (OUT/f'Isolated_{name}.png').write_bytes(data); isolated[name]={'png':data,'width':ex['width'],'height':ex['height'],'sha256':sha(data)}
    for lid in leaf_ids:
        ex=page.evaluate(async_export_filtered,{'regionIds':[lid],'keepBackground':False,'background':False}); data=decode(ex['data']); isolated[lid]={'png':data,'width':ex['width'],'height':ex['height'],'sha256':sha(data)}

    stage_ids=[next(r['regionId'] for r in regions if r['kind']=='petal-region' and r.get('petal',{}).get('ring')=='outer'), center_id, leaf_ids[0], stem_id]
    stages={}
    for rid in stage_ids:
        stages[rid]=page.evaluate("""rid=>{const p=INK_APP.page(),s=p.floraHero,x=INK_APP.flora.retention.diagnoseRegionStages({page:p,structure:s,regionId:rid,width:128,height:181});return{regionId:x.regionId,kind:x.kind,width:x.width,height:x.height,geometryMask:Array.from(x.geometryMask),rawMask:Array.from(x.rawMask),featheredMask:Array.from(x.featheredMask),paintedAlpha:Array.from(x.paintedAlpha),paintedMask:Array.from(x.paintedMask)}}""",rid)

    frequency={}
    for name,vis in [('low',{'low':True,'mid':False,'high':False}),('mid',{'low':False,'mid':True,'high':False}),('high',{'low':False,'mid':False,'high':True}),('all',{'low':True,'mid':True,'high':True})]:
        page.evaluate('(v)=>INK_APP.renderer.naturalMedia.setFrequencyVisibility(v)',vis); ex=export_canvas(page,True); data=decode(ex['data']); (OUT/f'Frequency_{name}.png').write_bytes(data); frequency[name]={'sha256':sha(data),'bytes':len(data)}
    page.evaluate("INK_APP.renderer.naturalMedia.setFrequencyVisibility({low:true,mid:true,high:true})")

    complete_hash=page.evaluate('()=>({document:INK_APP.flora.documentHash(),replay:INK_APP.flora.replayHash(),hero:INK_APP.flora.completeHero.replayHash("flr012-adonis-candidate-a")})')
    undo=page.evaluate('()=>({ok:INK_APP.history.undo(),document:INK_APP.flora.documentHash(),replay:INK_APP.flora.replayHash()})')
    redo=page.evaluate('()=>({ok:INK_APP.history.redo(),document:INK_APP.flora.documentHash(),replay:INK_APP.flora.replayHash(),hero:INK_APP.flora.completeHero.replayHash("flr012-adonis-candidate-a")})')
    redo_png=decode(export_canvas(page,True)['data']); (OUT/'Undo_Redo_Restored.png').write_bytes(redo_png)

    local=page.evaluate("""()=>{const p=INK_APP.page(),h=p.floraHero,m=INK_APP.flora.completeHero.mapping('flr012-adonis-candidate-a'),target=h.regions.find(r=>r.kind==='leaf-region').regionId,ids=new Set((m.regionRecipeIds[target]||[]).flatMap(id=>m.recipeToStrokeIds[id]||[])),objects=p.layers.flatMap(l=>l.objects||[]),non=m.strokeIds.filter(id=>!ids.has(id)),snapshot=JSON.stringify(objects.filter(o=>non.includes(o.id)).sort((a,b)=>a.id.localeCompare(b.id))),layer=p.layers.find(l=>l.id===p.activeLayerId)||p.layers[0],manual={id:'manual-r1c-retention',type:'stroke',name:'Manual R1c',matrix:{a:1,b:0,c:0,d:1,e:0,f:0},opacity:1,color:'#222',size:2,kind:'pen',points:[{x:-1000,y:-1000,p:1},{x:-990,y:-990,p:1}]};layer.objects.push(manual);const result=INK_APP.flora.completeHero.recompileRegion('flr012-adonis-candidate-a',target,{operation:'Directional Brushwork',patch:{}}),after=JSON.stringify(p.layers.flatMap(l=>l.objects||[]).filter(o=>non.includes(o.id)).sort((a,b)=>a.id.localeCompare(b.id)));return{target,result,nonTargetUnchanged:snapshot===after,nonTargetSnapshot:snapshot,manualPreserved:!!INK_APP.flora.adapter.findObject('manual-r1c-retention')?.object};}""")
    local_non_target_hash=sha(local.pop('nonTargetSnapshot').encode('utf-8'))
    page.evaluate('()=>INK_APP.history.undo()')
    rollback=page.evaluate("""()=>{const h=INK_APP.page().floraHero,target=h.regions.find(r=>r.kind==='petal-region').regionId,before={document:INK_APP.flora.documentHash(),replay:INK_APP.flora.replayHash(),undo:INK_APP.history.undoStack.length};const original=INK_APP.flora.adapter.execute.bind(INK_APP.flora.adapter);let n=0;INK_APP.flora.adapter.execute=(a,o)=>{if(a.type==='createStroke'&&++n===2)throw new Error('R1c injected rollback');return original(a,o)};const result=INK_APP.flora.completeHero.recompileRegion('flr012-adonis-candidate-a',target,{operation:'Directional Brushwork',patch:{}});INK_APP.flora.adapter.execute=original;const after={document:INK_APP.flora.documentHash(),replay:INK_APP.flora.replayHash(),undo:INK_APP.history.undoStack.length};return{result,before,after,restored:before.document===after.document&&before.replay===after.replay&&before.undo===after.undo};}""")

    page.evaluate('(s)=>INK_APP.flora.reloadDocument(s)',serialized); page.evaluate("INK_APP.switchWorkspace('layout',{fit:false,announce:false});INK_APP.fitArtboard({switchSpace:false});INK_TEST.setRenderMode('canvas2d');")
    roundtrip=page.evaluate('()=>({document:INK_APP.flora.documentHash(),replay:INK_APP.flora.replayHash(),hero:INK_APP.flora.completeHero.replayHash("flr012-adonis-candidate-a")})'); roundtrip_png=decode(export_canvas(page,True)['data']); (OUT/'Roundtrip_Reload.png').write_bytes(roundtrip_png)
    page.screenshot(path=str(OUT/'Runtime_UI.png'),full_page=True)
    browser.close()

errors=[m for m in messages if m['type'] in {'error','pageerror'}]
# Images and actual raster metrics.
im=Image.open(io.BytesIO(full_png)).convert('RGB'); w,h=im.size; im.resize((212,300),Image.Resampling.LANCZOS).save(SMALL); im.resize((212,300),Image.Resampling.LANCZOS).save(OUT/SMALL.name)
old=Image.open(OLD).convert('RGB') if OLD.exists() else Image.new('RGB',(w,h),'white')
side=Image.new('RGB',(w*2+45,h+70),'white'); d=ImageDraw.Draw(side); side.paste(old,(10,50)); side.paste(im,(w+35,50)); d.text((170,15),'R1b Candidate A R1 · FAIL',fill='black'); d.text((w+180,15),'R1c PREVIEW_ONLY',fill='black'); side.save(OUT/'R1b_vs_PREVIEW_ONLY.png')
small_side=Image.new('RGB',(500,360),'white');sd=ImageDraw.Draw(small_side);small_side.paste(fit(old,(212,300)),(15,40));small_side.paste(fit(im,(212,300)),(270,40));sd.text((48,10),'R1b FAIL',fill='black');sd.text((320,10),'R1c PREVIEW_ONLY',fill='black');small_side.save(OUT/'Small_View_Comparison.png')

# Isolated actual alpha/visible metrics.
actual_metrics={}
for name,item in isolated.items():
    alpha=alpha_mask(item['png']); ids=groups.get(name,[name]); rs=[r for r in regions if r['regionId'] in ids]; gm=path_mask(rs,(item['width'],item['height']))
    areas=component_areas(alpha,20); actual_metrics[name]={'geometryArea':binary_count(gm,1),'finalAlphaArea':binary_count(alpha,20),'retention':masked_ratio(gm,alpha,20),'componentCount':len([a for a in areas if a>=max(8,sum(areas)*.003)]),'primaryComponentRatio':areas[0]/sum(areas) if areas else 0,'sha256':item['sha256']}

# Stage comparisons and named heat maps.
stage_outputs={}
for rid,stage in stages.items():
    safe=rid.split(':')[-1].replace('/','-'); imgs=save_stage_image(stage,OUT/f'Stages_{safe}.png'); stage_outputs[rid]={'geometryArea':binary_count(imgs['geometry'],1),'rawMaskArea':binary_count(imgs['raw'],1),'featheredArea':binary_count(imgs['feather'],16),'strokeRasterArea':binary_count(imgs['painted'],20)}

# Combined geometry, coverage, core and gap visualizations.
geom_all=path_mask([r for r in regions if r['kind']!='background-region'],(w,h)); crown_geom=path_mask([r for r in regions if r['regionId'] in crown_ids],(w,h)); leaf_geom=path_mask([r for r in regions if r['regionId'] in leaf_ids],(w,h))
crown_alpha=alpha_mask(isolated['crown']['png']); leaves_alpha=alpha_mask(isolated['leaves']['png']); center_alpha=alpha_mask(isolated['center']['png']); stem_alpha=alpha_mask(isolated['stem']['png'])
def heat(geom,alpha,title,path):
    base=Image.new('RGB',geom.size,'white'); g=geom.load(); a=alpha.load(); pix=base.load();
    for y in range(geom.height):
        for x in range(geom.width):
            if g[x,y]>0:
                v=a[x,y]/255; pix[x,y]=(round(255*(1-v)),round(120+120*v),30)
    dr=ImageDraw.Draw(base);dr.text((12,10),title,fill='black');base.save(path)
heat(crown_geom,crown_alpha,'Petal / Crown Coverage Heatmap',OUT/'Petal_Coverage_Heatmap.png')
heat(leaf_geom,leaves_alpha,'Four-Leaf Lobe Survival',OUT/'Leaf_Lobe_Survival_Map.png')
heat(path_mask([r for r in regions if r['regionId']==center_id],(w,h)),center_alpha,'Center Feature Survival',OUT/'Center_Feature_Survival_Map.png')
# Root zone and ring survival views.
Image.open(io.BytesIO(isolated['inner_ring']['png'])).save(OUT/'Inner_Ring_Survival.png'); Image.open(io.BytesIO(isolated['outer_ring']['png'])).save(OUT/'Outer_Ring_Survival.png')
im.crop((0,0,w,int(h*.54))).save(OUT/'Crown_Retention_Preview.png'); im.crop((int(w*.30),int(h*.10),int(w*.70),int(h*.44))).resize((800,680),Image.Resampling.LANCZOS).save(OUT/'Center_Retention_Preview.png'); im.crop((0,int(h*.47),w,h)).save(OUT/'Leaf_Retention_Preview.png'); im.crop((int(w*.40),int(h*.38),int(w*.60),h)).resize((360,900),Image.Resampling.LANCZOS).save(OUT/'Stem_Weight_Preview.png')
# Mask/topology and silhouette.
mask_view=Image.new('RGB',(w,h),'white');md=ImageDraw.Draw(mask_view,'RGBA'); colors={'petal-region':(244,180,0,150),'flower-center-region':(230,120,0,190),'leaf-region':(45,145,65,150),'stem-region':(30,95,40,160)}
for r in sorted(regions,key=lambda x:x.get('z',0)):
    if r['kind']=='background-region':continue
    pts=[(p['x']*w,p['y']*h) for p in r['path']];md.polygon(pts,fill=colors.get(r['kind'],(100,100,100,100)),outline=(30,30,30,210))
mask_view.save(OUT/'Mask_Topology_View.png'); ImageOps.colorize(geom_all,'white','black').save(OUT/'Silhouette_View.png')

runtime_log={'schema':'INK_FLORA_WP9A_R1C_RUNTIME_V1','imageModelUsed':False,'formalPreviewExecuteCount':formal_preview_execute_count,'seed':12012,'previewOnly':True,'candidateGenerated':False,'directOpenSmoke':direct_open,'compileDeterminism':{'a':compile_a.get('compileHash'),'b':compile_b.get('compileHash'),'same':compile_a.get('compileHash')==compile_b.get('compileHash')},'execute':executed,'runtime':{k:v for k,v in runtime.items() if k not in ('structure','recipes','mapping')},'actualRasterMetrics':actual_metrics,'sampledStageMetrics':stage_outputs,'frequency':frequency,'undo':undo,'redo':redo,'redoMatchesPreview':sha(redo_png)==sha(full_png),'localRecompile':local,'nonTargetHash':local_non_target_hash,'rollback':rollback,'roundtrip':{'hashes':roundtrip,'pngSha256':sha(roundtrip_png),'matchesPreview':sha(roundtrip_png)==sha(full_png),'replayMatches':roundtrip['replay']==runtime['replayHash'],'heroReplayMatches':roundtrip['hero']==runtime['heroReplayHash']},'preview':{'path':str(PREVIEW),'width':w,'height':h,'bytes':len(full_png),'sha256':sha(full_png)},'ink':{'path':str(INK),'bytes':len(serialized.encode()),'sha256':sha(serialized.encode())},'errors':errors}
(OUT/'runtime-log.json').write_text(json.dumps(runtime_log,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(OUT/'retention-measurement.json').write_text(json.dumps(runtime['measurement'],ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(OUT/'retention-gates.json').write_text(json.dumps(runtime['gates'],ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(OUT/'painting-order.json').write_text(json.dumps([{'index':i,'recipeId':r['recipeId'],'component':r.get('metadata',{}).get('component'),'regionId':r['targetRegionId'],'operation':r['operation'],'coverageRetention':r.get('constraints',{}).get('coverageRetention')} for i,r in enumerate(runtime['recipes'])],ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

# Contact sheet.
items=[('R1a.1 Geometry',GEOM_PREVIEW if GEOM_PREVIEW.exists() else OUT/'Mask_Topology_View.png'),('R1b FAIL',OLD),('R1c PREVIEW_ONLY',PREVIEW),('Crown',OUT/'Crown_Retention_Preview.png'),('Center',OUT/'Center_Retention_Preview.png'),('Leaves',OUT/'Leaf_Retention_Preview.png'),('Stem',OUT/'Stem_Weight_Preview.png'),('Coverage',OUT/'Petal_Coverage_Heatmap.png'),('Lobes',OUT/'Leaf_Lobe_Survival_Map.png'),('Small View',OUT/'Small_View_Comparison.png'),('Mask / Topology',OUT/'Mask_Topology_View.png'),('Frequency Low',OUT/'Frequency_low.png'),('Frequency Mid',OUT/'Frequency_mid.png'),('Frequency High',OUT/'Frequency_high.png')]
cell=(390,330); sheet=Image.new('RGB',(cell[0]*3,cell[1]*5),'white'); dr=ImageDraw.Draw(sheet)
for i,(label,path) in enumerate(items):
    if not Path(path).exists():continue
    img=Image.open(path).convert('RGB'); img.thumbnail((cell[0]-20,cell[1]-45),Image.Resampling.LANCZOS); x=(i%3)*cell[0]+(cell[0]-img.width)//2; y=(i//3)*cell[1]+35; sheet.paste(img,(x,y));dr.text(((i%3)*cell[0]+10,(i//3)*cell[1]+10),label,fill='black')
sheet.save(OUT/'WP9A_R1c_Retention_Evidence_Contact_Sheet.png')
print(json.dumps({'ok':not errors,'formalPreviewExecuteCount':formal_preview_execute_count,'preview':runtime_log['preview'],'ink':runtime_log['ink'],'sampledGates':runtime['gates'],'actualRasterMetrics':actual_metrics,'replayHash':runtime['replayHash'],'heroReplayHash':runtime['heroReplayHash'],'nonTargetHash':local_non_target_hash,'rollback':rollback.get('restored'),'roundtrip':runtime_log['roundtrip'],'directOpen':direct_open,'errors':errors},ensure_ascii=False,indent=2))
