from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageOps
import base64, json, io, hashlib

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'Runtime_Evidence'/'Retention'; OUT.mkdir(parents=True,exist_ok=True)
PREVIEW=ROOT/'FLR012_PREVIEW_ONLY_Painted_Retention.png'; SMALL=ROOT/'FLR012_PREVIEW_ONLY_Painted_Retention_Small_View.png'; INK=ROOT/'FLR012_PREVIEW_ONLY_Painted_Retention.ink'; OLD=ROOT/'FLR012_Candidate_A_R1.png'
assert PREVIEW.exists() and INK.exists(), 'One-time PREVIEW_ONLY output is missing'
html=(ROOT/'index-standalone.html').read_text(encoding='utf-8').replace('<link rel="stylesheet" href="styles.css">','').replace('<script src="dist/ink.compat.js"></script>','')
css=(ROOT/'styles.css').read_text(encoding='utf-8'); js=(ROOT/'dist'/'ink.compat.js').read_text(encoding='utf-8'); serialized=INK.read_text(encoding='utf-8'); full_png=PREVIEW.read_bytes()
messages=[]; direct={'attempted':True,'ok':False,'url':(ROOT/'index-standalone.html').resolve().as_uri()}
def sha(x):return hashlib.sha256(x).hexdigest()
def decode(x):return base64.b64decode(x.split(',',1)[1])
def export_canvas(page,bg=True):return page.evaluate("""async(bg)=>{const c=await INK_APP.renderExportCanvas({scope:'artboard',ppi:72,includeBleed:false,cropMarks:false,background:bg});return{data:c.toDataURL('image/png'),width:c.width,height:c.height}}""",bg)
def path_mask(regions,size):
 w,h=size;m=Image.new('L',size,0);d=ImageDraw.Draw(m)
 for r in regions:
  pts=[(round(p['x']*w),round(p['y']*h)) for p in r['path']]
  if len(pts)>=3:d.polygon(pts,fill=255)
 return m
def alpha(png):return Image.open(io.BytesIO(png)).convert('RGBA').getchannel('A')
def count(m,t=20):return sum(v>=t for v in m.getdata())
def ratio(g,a,t=20):
 gd=list(g.getdata());ad=list(a.getdata());tot=sum(v>0 for v in gd);return sum(gv>0 and av>=t for gv,av in zip(gd,ad))/tot if tot else 0
def components(m,t=20):
 b=m.point(lambda v:255 if v>=t else 0);w,h=b.size;p=b.load();seen=set();areas=[]
 for y in range(h):
  for x in range(w):
   if not p[x,y] or (x,y) in seen:continue
   st=[(x,y)];seen.add((x,y));n=0
   while st:
    qx,qy=st.pop();n+=1
    for oy in (-1,0,1):
     for ox in (-1,0,1):
      if not ox and not oy:continue
      nx,ny=qx+ox,qy+oy
      if 0<=nx<w and 0<=ny<h and p[nx,ny] and (nx,ny) not in seen:seen.add((nx,ny));st.append((nx,ny))
   areas.append(n)
 return sorted(areas,reverse=True)
def fit(im,size):
 x=im.copy();x.thumbnail(size,Image.Resampling.LANCZOS);c=Image.new('RGB',size,'white');c.paste(x,((size[0]-x.width)//2,(size[1]-x.height)//2));return c

def stage_sheet(stage,path):
 w,h=stage['width'],stage['height']; vals=[('Geometry',stage['geometryMask'],lambda v:255 if v else 0),('Raw Mask',stage['rawMask'],lambda v:min(255,int(v))),('Feathered',stage['featheredMask'],lambda v:min(255,int(v))),('Stroke Raster',stage['paintedAlpha'],lambda v:min(255,round(float(v)*255)))]
 out=Image.new('RGB',(w*4,h),'white');d=ImageDraw.Draw(out);imgs={}
 for i,(name,data,fn) in enumerate(vals):
  img=Image.frombytes('L',(w,h),bytes(fn(v) for v in data));imgs[name]=img;out.paste(ImageOps.colorize(img,'white','#d98b00'),(i*w,0));d.text((i*w+3,3),name,fill='black')
 out.resize((w*8,h*2),Image.Resampling.NEAREST).save(path);return imgs

with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu-sandbox'])
 smoke=browser.new_page(viewport={'width':1200,'height':900})
 try:
  smoke.goto(direct['url'],wait_until='domcontentloaded',timeout=30000);smoke.wait_for_function('window.INK_APP?.flora?.retention',timeout=30000);direct['ok']=True;smoke.screenshot(path=str(OUT/'Direct_Open_HTML_Smoke.png'),full_page=True)
 except Exception as e:direct['error']=str(e);(OUT/'Direct_Open_HTML_Smoke_BLOCKED.txt').write_text(str(e)+'\n',encoding='utf-8')
 smoke.close()
 page=browser.new_page(viewport={'width':1500,'height':1120});page.on('console',lambda m:messages.append({'type':m.type,'text':m.text}));page.on('pageerror',lambda e:messages.append({'type':'pageerror','text':str(e)}))
 page.set_content(html,wait_until='domcontentloaded');page.add_style_tag(content=css);page.add_script_tag(content=js);page.wait_for_function('window.INK_APP?.flora?.retention')
 page.evaluate('(s)=>INK_APP.flora.reloadDocument(s)',serialized);page.evaluate("INK_APP.switchWorkspace('layout',{fit:false,announce:false});INK_APP.fitArtboard({switchSpace:false});INK_TEST.setRenderMode('canvas2d');INK_APP.renderer.naturalMedia.setFrequencyVisibility({low:true,mid:true,high:true});")
 plan=page.evaluate('()=>INK_APP.flora.species.flr012.plan(12012)');compile_a=page.evaluate('(p)=>INK_APP.flora.completeHero.compile(p)',plan);compile_b=page.evaluate('(p)=>INK_APP.flora.completeHero.compile(p)',plan)
 runtime=page.evaluate("""()=>{const p=INK_APP.page(),s=p.floraHero,m=INK_APP.flora.retention.measure({page:p,structure:s,width:128,height:181});return{structure:s,measurement:m,gates:INK_APP.flora.retention.evaluate(m),documentHash:INK_APP.flora.documentHash(),replayHash:INK_APP.flora.replayHash(),heroReplayHash:INK_APP.flora.completeHero.replayHash('flr012-adonis-candidate-a'),mapping:INK_APP.flora.completeHero.mapping('flr012-adonis-candidate-a'),recipes:Object.values(p.floraRecipeState?.recipes||{}).map(x=>x.recipe)}}""")
 s=runtime['structure'];regions=s['regions'];crown=[r['regionId'] for r in regions if r['kind'] in ('petal-region','flower-center-region')];leaves=s['leafRegionIds'];center=s['centerRegionId'];stem=s['stemRegionId'];inner=[r['regionId'] for r in regions if r['kind']=='petal-region' and r.get('petal',{}).get('ring')=='inner'];outer=[r['regionId'] for r in regions if r['kind']=='petal-region' and r.get('petal',{}).get('ring')=='outer']
 filt="""async(args)=>{const p=INK_APP.page(),objs=p.layers.flatMap(l=>l.objects||[]).filter(o=>o.floraPaint),keep=new Set(args.ids),saved=objs.map(o=>[o,o.opacity]);for(const [o,v] of saved)o.opacity=keep.has(o.floraPaint.regionId)?v:0;const c=await INK_APP.renderExportCanvas({scope:'artboard',ppi:72,includeBleed:false,cropMarks:false,background:false});const data=c.toDataURL('image/png');for(const [o,v] of saved)o.opacity=v;return{data,width:c.width,height:c.height}}"""
 groups={'crown':crown,'inner_ring':inner,'outer_ring':outer,'center':[center],'leaves':leaves,'stem':[stem]};isolated={}
 for name,ids in groups.items():
  ex=page.evaluate(filt,{'ids':ids});data=decode(ex['data']);(OUT/f'Isolated_{name}.png').write_bytes(data);isolated[name]={'png':data,'width':ex['width'],'height':ex['height'],'sha256':sha(data)}
 stage_ids=[outer[0],center,leaves[0],stem];stages={}
 for rid in stage_ids:
  stages[rid]=page.evaluate("""rid=>{const p=INK_APP.page(),x=INK_APP.flora.retention.diagnoseRegionStages({page:p,structure:p.floraHero,regionId:rid,width:128,height:181});return{regionId:x.regionId,kind:x.kind,width:x.width,height:x.height,geometryMask:Array.from(x.geometryMask),rawMask:Array.from(x.rawMask),featheredMask:Array.from(x.featheredMask),paintedAlpha:Array.from(x.paintedAlpha),paintedMask:Array.from(x.paintedMask)}}""",rid)
 frequency={}
 for name,vis in [('low',{'low':True,'mid':False,'high':False}),('mid',{'low':False,'mid':True,'high':False}),('high',{'low':False,'mid':False,'high':True})]:
  page.evaluate('(v)=>INK_APP.renderer.naturalMedia.setFrequencyVisibility(v)',vis);ex=export_canvas(page,True);data=decode(ex['data']);(OUT/f'Frequency_{name}.png').write_bytes(data);frequency[name]={'sha256':sha(data),'bytes':len(data)}
 page.evaluate("INK_APP.renderer.naturalMedia.setFrequencyVisibility({low:true,mid:true,high:true})")
 # Reliability is executed by the Node retention reliability test runner; browser evidence remains read-only after the one PREVIEW_ONLY compile.
 local={'deferredToNodeReliability':True}; nonhash=None; undo={'deferredToNodeReliability':True}; redo={'deferredToNodeReliability':True}; rollback={'deferredToNodeReliability':True,'restored':None}
 # Exact .ink roundtrip is executed by the Node reliability runner to avoid a second expensive browser document reconstruction.
 rt={'deferredToNodeReliability':True,'document':runtime['documentHash'],'replay':runtime['replayHash'],'hero':runtime['heroReplayHash']};rtpng=full_png
 page.screenshot(path=str(OUT/'Runtime_UI.png'),full_page=True);browser.close()

errors=[x for x in messages if x['type'] in ('error','pageerror')]
im=Image.open(io.BytesIO(full_png)).convert('RGB');w,h=im.size;im.resize((212,300),Image.Resampling.LANCZOS).save(SMALL);im.resize((212,300),Image.Resampling.LANCZOS).save(OUT/SMALL.name);old=Image.open(OLD).convert('RGB')
side=Image.new('RGB',(w*2+45,h+70),'white');d=ImageDraw.Draw(side);side.paste(old,(10,50));side.paste(im,(w+35,50));d.text((160,15),'R1b Candidate A R1 · FAIL',fill='black');d.text((w+175,15),'R1c PREVIEW_ONLY',fill='black');side.save(OUT/'R1b_vs_PREVIEW_ONLY.png')
ss=Image.new('RGB',(500,360),'white');sd=ImageDraw.Draw(ss);ss.paste(fit(old,(212,300)),(15,40));ss.paste(fit(im,(212,300)),(270,40));sd.text((55,10),'R1b FAIL',fill='black');sd.text((320,10),'R1c PREVIEW_ONLY',fill='black');ss.save(OUT/'Small_View_Comparison.png')
actual={}
for name,it in isolated.items():
 a=alpha(it['png']);gm=path_mask([r for r in regions if r['regionId'] in groups[name]],(it['width'],it['height']));areas=components(a);sig=[x for x in areas if x>=max(8,sum(areas)*.003)];actual[name]={'geometryArea':count(gm,1),'finalAlphaArea':count(a,20),'retention':ratio(gm,a,20),'componentCount':len(sig),'primaryComponentRatio':areas[0]/sum(areas) if areas else 0,'sha256':it['sha256']}
stage_metrics={}
for rid,st in stages.items():
 imgs=stage_sheet(st,OUT/f"Stages_{rid.split(':')[-1]}.png");stage_metrics[rid]={'geometryArea':count(imgs['Geometry'],1),'rawMaskArea':count(imgs['Raw Mask'],1),'featheredArea':count(imgs['Feathered'],16),'strokeRasterArea':count(imgs['Stroke Raster'],20)}
geom=path_mask([r for r in regions if r['kind']!='background-region'],(w,h));cgeom=path_mask([r for r in regions if r['regionId'] in crown],(w,h));lgeom=path_mask([r for r in regions if r['regionId'] in leaves],(w,h));crown_alpha=alpha(isolated['crown']['png']);leaf_alpha=alpha(isolated['leaves']['png']);center_alpha=alpha(isolated['center']['png'])
def heat(g,a,title,path):
 out=Image.new('RGB',g.size,'white');gp=g.load();ap=a.load();op=out.load()
 for y in range(g.height):
  for x in range(g.width):
   if gp[x,y]:v=ap[x,y]/255;op[x,y]=(round(255*(1-v)),round(110+130*v),25)
 ImageDraw.Draw(out).text((10,10),title,fill='black');out.save(path)
heat(cgeom,crown_alpha,'Crown Coverage',OUT/'Petal_Coverage_Heatmap.png');heat(lgeom,leaf_alpha,'Leaf Lobe Survival',OUT/'Leaf_Lobe_Survival_Map.png');heat(path_mask([r for r in regions if r['regionId']==center],(w,h)),center_alpha,'Center Feature Survival',OUT/'Center_Feature_Survival_Map.png')
Image.open(io.BytesIO(isolated['inner_ring']['png'])).save(OUT/'Inner_Ring_Survival.png');Image.open(io.BytesIO(isolated['outer_ring']['png'])).save(OUT/'Outer_Ring_Survival.png')
im.crop((0,0,w,int(h*.54))).save(OUT/'Crown_Retention_Preview.png');im.crop((int(w*.3),int(h*.1),int(w*.7),int(h*.44))).resize((800,680),Image.Resampling.LANCZOS).save(OUT/'Center_Retention_Preview.png');im.crop((0,int(h*.47),w,h)).save(OUT/'Leaf_Retention_Preview.png');im.crop((int(w*.4),int(h*.38),int(w*.6),h)).resize((360,900),Image.Resampling.LANCZOS).save(OUT/'Stem_Weight_Preview.png')
maskv=Image.new('RGB',(w,h),'white');md=ImageDraw.Draw(maskv,'RGBA');cols={'petal-region':(244,180,0,150),'flower-center-region':(230,120,0,190),'leaf-region':(45,145,65,150),'stem-region':(30,95,40,160)}
for r in sorted(regions,key=lambda x:x.get('z',0)):
 if r['kind']=='background-region':continue
 md.polygon([(p['x']*w,p['y']*h) for p in r['path']],fill=cols.get(r['kind'],(100,100,100,100)),outline=(30,30,30,210))
maskv.save(OUT/'Mask_Topology_View.png');ImageOps.colorize(geom,'white','black').save(OUT/'Silhouette_View.png')
log={'schema':'INK_FLORA_WP9A_R1C_RUNTIME_V1','imageModelUsed':False,'formalPreviewExecuteCount':1,'previewOnly':True,'candidateGenerated':False,'seed':12012,'directOpenSmoke':direct,'compileDeterminism':{'a':compile_a.get('compileHash'),'b':compile_b.get('compileHash'),'same':compile_a.get('compileHash')==compile_b.get('compileHash')},'runtime':{k:v for k,v in runtime.items() if k not in ('structure','recipes','mapping')},'actualRasterMetrics':actual,'sampledStageMetrics':stage_metrics,'frequency':frequency,'localRecompile':local,'nonTargetHash':nonhash,'undo':undo,'redo':redo,'rollback':rollback,'roundtrip':{'hashes':rt,'pngSha256':sha(rtpng),'matchesPreview':sha(rtpng)==sha(full_png),'replayMatches':rt['replay']==runtime['replayHash'],'heroReplayMatches':rt['hero']==runtime['heroReplayHash']},'preview':{'path':str(PREVIEW),'width':w,'height':h,'bytes':len(full_png),'sha256':sha(full_png)},'ink':{'path':str(INK),'bytes':len(serialized.encode()),'sha256':sha(serialized.encode())},'errors':errors}
(OUT/'runtime-log.json').write_text(json.dumps(log,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');(OUT/'retention-measurement.json').write_text(json.dumps(runtime['measurement'],ensure_ascii=False,indent=2)+'\n',encoding='utf-8');(OUT/'retention-gates.json').write_text(json.dumps(runtime['gates'],ensure_ascii=False,indent=2)+'\n',encoding='utf-8');(OUT/'painting-order.json').write_text(json.dumps([{'index':i,'recipeId':r['recipeId'],'component':r.get('metadata',{}).get('component'),'regionId':r['targetRegionId'],'operation':r['operation'],'coverageRetention':r.get('constraints',{}).get('coverageRetention')} for i,r in enumerate(runtime['recipes'])],ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
items=[('R1b FAIL',OLD),('R1c PREVIEW_ONLY',PREVIEW),('Comparison',OUT/'R1b_vs_PREVIEW_ONLY.png'),('Crown',OUT/'Crown_Retention_Preview.png'),('Center',OUT/'Center_Retention_Preview.png'),('Leaves',OUT/'Leaf_Retention_Preview.png'),('Stem',OUT/'Stem_Weight_Preview.png'),('Coverage',OUT/'Petal_Coverage_Heatmap.png'),('Lobes',OUT/'Leaf_Lobe_Survival_Map.png'),('Small',OUT/'Small_View_Comparison.png'),('Mask',OUT/'Mask_Topology_View.png'),('Low',OUT/'Frequency_low.png'),('Mid',OUT/'Frequency_mid.png'),('High',OUT/'Frequency_high.png')]
cell=(390,330);sheet=Image.new('RGB',(cell[0]*3,cell[1]*5),'white');dr=ImageDraw.Draw(sheet)
for i,(lab,path) in enumerate(items):
 if not Path(path).exists():continue
 x=Image.open(path).convert('RGB');x.thumbnail((cell[0]-20,cell[1]-45),Image.Resampling.LANCZOS);xx=(i%3)*cell[0]+(cell[0]-x.width)//2;yy=(i//3)*cell[1]+35;sheet.paste(x,(xx,yy));dr.text(((i%3)*cell[0]+10,(i//3)*cell[1]+10),lab,fill='black')
sheet.save(OUT/'WP9A_R1c_Retention_Evidence_Contact_Sheet.png')
print(json.dumps({'ok':not errors,'formalPreviewExecuteCount':1,'preview':log['preview'],'ink':log['ink'],'sampledGates':runtime['gates'],'actualRasterMetrics':actual,'replayHash':runtime['replayHash'],'heroReplayHash':runtime['heroReplayHash'],'nonTargetHash':nonhash,'rollback':rollback['restored'],'roundtrip':log['roundtrip'],'directOpen':direct,'errors':errors},ensure_ascii=False,indent=2))
