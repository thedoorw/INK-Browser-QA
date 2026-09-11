from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageOps, ImageFilter
import base64, json, io, hashlib, math, statistics
import numpy as np

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'Runtime_Evidence'/'WP9A_R2_Convergence'; OUT.mkdir(parents=True,exist_ok=True)
NEW=ROOT/'FLR012_Candidate_A_R2.png'
SMALL=ROOT/'FLR012_Candidate_A_R2_Small_View.png'
INK=ROOT/'FLR012_Candidate_A_R2.ink'
OLD=ROOT/'FLR012_R1c1_NonPeriodic_Fill_PREVIEW_ONLY.png'
OLD_INK=ROOT/'FLR012_R1c1_NonPeriodic_Fill_PREVIEW_ONLY.ink'
messages=[]; formal_compile_count=0

def sha(b): return hashlib.sha256(b).hexdigest()
def decode(s): return base64.b64decode(s.split(',',1)[1])
def fit(im,size,bg='white'):
 x=im.copy();x.thumbnail(size,Image.Resampling.LANCZOS);c=Image.new('RGB',size,bg);c.paste(x,((size[0]-x.width)//2,(size[1]-x.height)//2));return c

def path_mask(regions,size):
 w,h=size;m=Image.new('L',size,0);d=ImageDraw.Draw(m)
 for r in regions:
  pts=[(round(p['x']*w),round(p['y']*h)) for p in r['path']]
  if len(pts)>=3:d.polygon(pts,fill=255)
 return m

def alpha(png): return Image.open(io.BytesIO(png)).convert('RGBA').getchannel('A')
def count(mask,t=20): return sum(v>=t for v in mask.getdata())
def ratio(g,a,t=20):
 gv=np.array(g)>0; av=np.array(a)>=t
 return float((gv&av).sum()/max(1,gv.sum()))

def components(mask,t=20):
 b=(np.array(mask)>=t).astype(np.uint8);h,w=b.shape;seen=np.zeros_like(b,bool);areas=[]
 for y in range(h):
  for x in range(w):
   if not b[y,x] or seen[y,x]:continue
   stack=[(y,x)];seen[y,x]=1;area=0
   while stack:
    yy,xx=stack.pop();area+=1
    for oy in (-1,0,1):
     for ox in (-1,0,1):
      if ox==oy==0:continue
      ny,nx=yy+oy,xx+ox
      if 0<=ny<h and 0<=nx<w and b[ny,nx] and not seen[ny,nx]:seen[ny,nx]=1;stack.append((ny,nx))
   areas.append(area)
 return sorted(areas,reverse=True)

def spatial_metrics(png, geom_mask):
 im=Image.open(io.BytesIO(png)).convert('RGBA'); arr=np.asarray(im).astype(np.float32)/255
 mask=(np.asarray(geom_mask)>0)&(arr[:,:,3]>.03)
 if not mask.any(): return {'periodicEnergyRatio':1,'dominantFrequencyPeakRatio':1,'orientationAutocorrelation':1,'stripeContrast':1,'localDensityCV':1}
 rgb=arr[:,:,:3]; lum=.2126*rgb[:,:,0]+.7152*rgb[:,:,1]+.0722*rgb[:,:,2]
 density=arr[:,:,3]*(.30+.70*(1-lum))
 ys,xs=np.where(mask); pad=4; y0=max(0,ys.min()-pad);y1=min(mask.shape[0],ys.max()+pad+1);x0=max(0,xs.min()-pad);x1=min(mask.shape[1],xs.max()+pad+1)
 d=density[y0:y1,x0:x1];m=mask[y0:y1,x0:x1]
 low=np.asarray(Image.fromarray(np.uint8(np.clip(d*255,0,255))).filter(ImageFilter.GaussianBlur(radius=max(2,min(d.shape)*.035)))).astype(np.float32)/255
 residual=(d-low)*m
 residual-=residual[m].mean() if m.any() else 0
 # Hann window and spectral metrics.
 wy=np.hanning(max(2,residual.shape[0]))[:,None];wx=np.hanning(max(2,residual.shape[1]))[None,:]
 spec=np.abs(np.fft.fftshift(np.fft.fft2(residual*wy*wx)))**2
 cy,cx=np.array(spec.shape)//2; yy,xx=np.ogrid[:spec.shape[0],:spec.shape[1]];rr=np.sqrt((yy-cy)**2+(xx-cx)**2)
 hi=spec[rr>=max(3,min(spec.shape)*.035)];total=float(hi.sum())+1e-12
 flat=np.sort(hi.ravel())
 top=flat[-max(4,int(flat.size*.002)):]
 periodic=float(top.sum()/total); dominant=float(flat[-1]/total)
 # Maximum normalized row/column autocorrelation over visible band lags.
 r=residual.copy(); denom=float((r*r).sum())+1e-12; ac=0
 for lag in range(3,max(4,min(28,min(r.shape)//3))):
  ac=max(ac,abs(float((r[:,lag:]*r[:,:-lag]).sum()/denom)),abs(float((r[lag:,:]*r[:-lag,:]).sum()/denom)))
 stripe=float(residual[m].std()/(density[y0:y1,x0:x1][m].mean()+1e-6))
 # coarse local density continuity
 vals=[]
 step=max(4,min(d.shape)//8)
 for yy0 in range(0,d.shape[0],step):
  for xx0 in range(0,d.shape[1],step):
   mm=m[yy0:yy0+step,xx0:xx0+step]
   if mm.sum()>max(3,step*step*.18): vals.append(float(d[yy0:yy0+step,xx0:xx0+step][mm].mean()))
 localcv=float(np.std(vals)/(np.mean(vals)+1e-6)) if vals else 1
 return {'periodicEnergyRatio':periodic,'dominantFrequencyPeakRatio':dominant,'orientationAutocorrelation':ac,'stripeContrast':stripe,'localDensityCV':localcv}

def stage_image(stage,path):
 w,h=stage['width'],stage['height']; imgs=[]
 for key in ['geometryMask','rawMask','featheredMask','paintedAlpha']:
  vals=stage[key]; data=bytes((255 if v else 0) if key=='geometryMask' else min(255,round(float(v)*(255 if key=='paintedAlpha' else 1))) for v in vals)
  imgs.append(Image.frombytes('L',(w,h),data))
 sheet=Image.new('RGB',(w*4,h),'white');d=ImageDraw.Draw(sheet)
 for i,(name,img) in enumerate(zip(['Geometry','Raw Mask','Feathered','Final Raster'],imgs)):
  sheet.paste(ImageOps.colorize(img,'white',['#d5aa00','#d9ad00','#d8a500','#d67d00'][i]),(i*w,0));d.text((i*w+3,3),name,fill='black')
 sheet.resize((w*8,h*2),Image.Resampling.NEAREST).save(path)

html=(ROOT/'index-standalone.html').read_text(encoding='utf-8').replace('<link rel="stylesheet" href="styles.css">','').replace('<script src="dist/ink.compat.js"></script>','')
css=(ROOT/'styles.css').read_text(encoding='utf-8');js=(ROOT/'dist/ink.compat.js').read_text(encoding='utf-8')
direct={'attempted':True,'ok':False,'url':(ROOT/'index-standalone.html').resolve().as_uri()}
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu-sandbox'])
 smoke=browser.new_page()
 try:
  smoke.goto(direct['url'],wait_until='domcontentloaded',timeout=30000);smoke.wait_for_function('window.INK_APP?.flora',timeout=30000);direct['ok']=True
 except Exception as e: direct['error']=str(e);(OUT/'Direct_Open_HTML_Smoke_BLOCKED.txt').write_text(str(e)+'\n')
 smoke.close()
 page=browser.new_page(viewport={'width':1500,'height':1120});page.on('console',lambda m:messages.append({'type':m.type,'text':m.text}));page.on('pageerror',lambda e:messages.append({'type':'pageerror','text':str(e)}))
 page.set_content(html,wait_until='domcontentloaded');page.add_style_tag(content=css);page.add_script_tag(content=js);page.wait_for_function('window.INK_APP?.flora?.retention')
 page.evaluate("INK_TEST.fresh();INK_APP.switchWorkspace('layout',{fit:false,announce:false});INK_APP.fitArtboard({switchSpace:false});INK_TEST.setRenderMode('canvas2d');")
 plan=page.evaluate('()=>INK_APP.flora.species.flr012.plan(12012)')
 result=page.evaluate('(plan)=>INK_APP.flora.completeHero.execute(plan)',plan);formal_compile_count+=1
 if not result.get('ok'): raise RuntimeError(json.dumps(result,ensure_ascii=False))
 async_export="""async(bg)=>{const c=await INK_APP.renderExportCanvas({scope:'artboard',ppi:72,includeBleed:false,cropMarks:false,background:bg});return{data:c.toDataURL('image/png'),width:c.width,height:c.height}}"""
 full=page.evaluate(async_export,True);full_png=decode(full['data']);NEW.write_bytes(full_png);(OUT/NEW.name).write_bytes(full_png)
 serialized=page.evaluate('()=>INK_APP.flora.serializeDocument()');INK.write_text(serialized,encoding='utf-8');(OUT/INK.name).write_text(serialized,encoding='utf-8')
 runtime=page.evaluate("""()=>{const p=INK_APP.page(),s=p.floraHero,m=INK_APP.flora.retention.measure({page:p,structure:s,width:128,height:181}),g=INK_APP.flora.retention.evaluate(m);return{structure:s,measurement:m,gates:g,documentHash:INK_APP.flora.documentHash(),replayHash:INK_APP.flora.replayHash(),heroReplayHash:INK_APP.flora.completeHero.replayHash('flr012-adonis-candidate-a'),mapping:INK_APP.flora.completeHero.mapping('flr012-adonis-candidate-a')}}""")
 structure=runtime['structure'];regions=structure['regions'];petal=next(r for r in regions if r['kind']=='petal-region' and r.get('petal',{}).get('ring')=='outer');center=next(r for r in regions if r['kind']=='flower-center-region');leaf=next(r for r in regions if r['kind']=='leaf-region');stem=next(r for r in regions if r['kind']=='stem-region')
 crown_ids=[r['regionId'] for r in regions if r['kind'] in ('petal-region','flower-center-region')];leaf_ids=[r['regionId'] for r in regions if r['kind']=='leaf-region']
 groups={'petal':[petal['regionId']],'center':[center['regionId']],'leaf':[leaf['regionId']],'stem':[stem['regionId']],'crown':crown_ids,'leaves':leaf_ids}
 filt="""async(args)=>{const p=INK_APP.page(),objs=p.layers.flatMap(l=>l.objects||[]).filter(o=>o.floraPaint),keep=new Set(args.ids),saved=objs.map(o=>[o,o.opacity]);for(const [o,v] of saved)o.opacity=keep.has(o.floraPaint.regionId)?v:0;const c=await INK_APP.renderExportCanvas({scope:'artboard',ppi:72,includeBleed:false,cropMarks:false,background:false});const data=c.toDataURL('image/png');for(const [o,v] of saved)o.opacity=v;return{data,width:c.width,height:c.height}}"""
 new_iso={}
 for name,ids in groups.items():
  ex=page.evaluate(filt,{'ids':ids});data=decode(ex['data']);(OUT/f'R2_Isolated_{name}.png').write_bytes(data);new_iso[name]=(data,ex['width'],ex['height'])
 # Base-mass layer evidence from the one compiled document.
 layer_export="""async(layer)=>{const p=INK_APP.page(),objs=p.layers.flatMap(l=>l.objects||[]).filter(o=>o.floraPaint),saved=objs.map(o=>[o,o.opacity]);for(const [o,v] of saved)o.opacity=(o.floraPaint.baseMassStrategy==='non-periodic-full-body'&&o.floraPaint.baseMassLayer===layer)?v:0;const c=await INK_APP.renderExportCanvas({scope:'artboard',ppi:72,includeBleed:false,cropMarks:false,background:false});const data=c.toDataURL('image/png');for(const [o,v] of saved)o.opacity=v;return data}"""
 for layer,fn in [('continuous-body','Continuous_Body_Field_only.png'),('low-frequency-density','Low_Frequency_Density_Field_only.png'),('sparse-directional-deposit','Sparse_Directional_Deposit_only.png')]: (OUT/fn).write_bytes(decode(page.evaluate(layer_export,layer)))
 for name,vis in [('low',{'low':True,'mid':False,'high':False}),('mid',{'low':False,'mid':True,'high':False}),('high',{'low':False,'mid':False,'high':True})]:
  page.evaluate('(v)=>INK_APP.renderer.naturalMedia.setFrequencyVisibility(v)',vis);(OUT/f'Frequency_{name}.png').write_bytes(decode(page.evaluate(async_export,True)['data']))
 page.evaluate("INK_APP.renderer.naturalMedia.setFrequencyVisibility({low:true,mid:true,high:true})")
 # Stage comparisons from actual geometry/mask/raster.
 stages={}
 for r in [petal,center,leaf,stem]:
  st=page.evaluate("""rid=>{const p=INK_APP.page(),x=INK_APP.flora.retention.diagnoseRegionStages({page:p,structure:p.floraHero,regionId:rid,width:128,height:181});return{regionId:x.regionId,kind:x.kind,width:x.width,height:x.height,geometryMask:Array.from(x.geometryMask),rawMask:Array.from(x.rawMask),featheredMask:Array.from(x.featheredMask),paintedAlpha:Array.from(x.paintedAlpha)}}""",r['regionId']);stages[r['kind']]=st;stage_image(st,OUT/f"Stages_{r['kind']}.png")
 # Render old R1c evidence from retained .ink without recompilation.
 old_serialized=OLD_INK.read_text(encoding='utf-8');page.evaluate('(s)=>INK_APP.flora.reloadDocument(s)',old_serialized)
 old_iso={}
 for name,ids in groups.items():
  ex=page.evaluate(filt,{'ids':ids});data=decode(ex['data']);(OUT/f'R1c1_Isolated_{name}.png').write_bytes(data);old_iso[name]=(data,ex['width'],ex['height'])
 # Roundtrip new serialized and deterministic export.
 page.evaluate('(s)=>INK_APP.flora.reloadDocument(s)',serialized);rt=page.evaluate(async_export,True);rt_png=decode(rt['data']);roundtrip={'pngSha256':sha(rt_png),'matches':sha(rt_png)==sha(full_png),'documentHash':page.evaluate('()=>INK_APP.flora.documentHash()'),'replayHash':page.evaluate('()=>INK_APP.flora.replayHash()'),'heroReplayHash':page.evaluate("()=>INK_APP.flora.completeHero.replayHash('flr012-adonis-candidate-a')")}
 browser.close()

im=Image.open(io.BytesIO(full_png)).convert('RGB');old=Image.open(OLD).convert('RGB');w,h=im.size
im.resize((212,300),Image.Resampling.LANCZOS).save(SMALL);im.resize((212,300),Image.Resampling.LANCZOS).save(OUT/SMALL.name)
side=Image.new('RGB',(w*2+40,h+55),'white');d=ImageDraw.Draw(side);side.paste(old,(5,45));side.paste(im,(w+35,45));d.text((150,12),'R1c.1 PREVIEW',fill='black');d.text((w+150,12),'R2 Candidate A R2',fill='black');side.save(OUT/'R1c1_vs_R2_Full.png')
smallside=Image.new('RGB',(500,340),'white');sd=ImageDraw.Draw(smallside);smallside.paste(fit(old,(212,300)),(15,30));smallside.paste(fit(im,(212,300)),(270,30));sd.text((55,8),'R2',fill='black');sd.text((320,8),'R2',fill='black');smallside.save(OUT/'R1c1_vs_R2_Small.png')

metrics={}; retention={}
for name,ids in groups.items():
 regs=[r for r in regions if r['regionId'] in ids];gm=path_mask(regs,(w,h));na=alpha(new_iso[name][0]);oa=alpha(old_iso[name][0])
 metrics[name]={'R2':spatial_metrics(old_iso[name][0],gm),'R1c1':spatial_metrics(new_iso[name][0],gm)}
 areas=components(na);retention[name]={'geometryArea':count(gm,1),'finalAlphaArea':count(na,20),'retention':ratio(gm,na,20),'componentCount':len([a for a in areas if a>=max(8,sum(areas)*.003)])}
 # detector visualization
 high=ImageChops.difference(Image.open(io.BytesIO(new_iso[name][0])).convert('RGB'),Image.open(io.BytesIO(new_iso[name][0])).convert('RGB').filter(ImageFilter.GaussianBlur(5)))
 high=ImageOps.autocontrast(high);high.save(OUT/f'{name.capitalize()}_Band_Detector.png')

thresholds={'periodicEnergyRatioMax':.34,'dominantFrequencyPeakRatioMax':.055,'orientationAutocorrelationMax':.48,'stripeContrastMax':.38,'localDensityCVMax':.46}
checks={}
for name in ['petal','center','leaf','stem']:
 m=metrics[name]['R1c1'];checks[name]={
  'periodic':m['periodicEnergyRatio']<=thresholds['periodicEnergyRatioMax'],
  'dominantPeak':m['dominantFrequencyPeakRatio']<=thresholds['dominantFrequencyPeakRatioMax'],
  'autocorrelation':m['orientationAutocorrelation']<=thresholds['orientationAutocorrelationMax'],
  'stripeContrast':m['stripeContrast']<=thresholds['stripeContrastMax'],
  'densityContinuity':m['localDensityCV']<=thresholds['localDensityCVMax']}

# Make object closeups and heatmaps.
for name in ['petal','center','leaf','stem']:
 Image.open(io.BytesIO(new_iso[name][0])).convert('RGBA').crop((0,0,w,h)).save(OUT/f'{name.capitalize()}_Base_Mass.png')
# simple retention heatmap all subject
subject=path_mask([r for r in regions if r['kind']!='background-region'],(w,h));out=Image.new('RGB',(w,h),'white');sp=np.array(subject)>0;aa=np.array(Image.open(io.BytesIO(full_png)).convert('RGBA').getchannel('A'))/255;arr=np.full((h,w,3),255,dtype=np.uint8);arr[sp,0]=(255*(1-aa[sp])).astype(np.uint8);arr[sp,1]=(80+160*aa[sp]).astype(np.uint8);arr[sp,2]=20;Image.fromarray(arr).save(OUT/'Retention_Heatmap.png')

spatial={'schema':'INK_FLORA_WP9A_R2_SPATIAL_METRICS_V1','thresholds':thresholds,'metrics':metrics,'checks':checks,'allChecksPass':all(all(x.values()) for x in checks.values())}
(OUT/'spatial-metrics.json').write_text(json.dumps(spatial,indent=2)+'\n')
(OUT/'retention-metrics.json').write_text(json.dumps(retention,indent=2)+'\n')
errors=[m for m in messages if m['type'] in ('error','pageerror')]
log={'schema':'INK_FLORA_WP9A_R2_RUNTIME_V1','imageModelUsed':False,'formalPreviewExecuteCount':formal_compile_count,'seed':12012,'candidateGenerated':False,'previewOnly':True,'preview':{'path':str(NEW),'width':w,'height':h,'bytes':len(full_png),'sha256':sha(full_png)},'ink':{'path':str(INK),'bytes':len(serialized.encode()),'sha256':sha(serialized.encode())},'runtime':{k:v for k,v in runtime.items() if k!='structure'},'retention':retention,'spatial':spatial,'roundtrip':roundtrip,'directOpen':direct,'errors':errors}
(OUT/'runtime-log.json').write_text(json.dumps(log,ensure_ascii=False,indent=2)+'\n')
# evidence sheet
items=[('R2',OLD),('R2',NEW),('Full compare',OUT/'R1c1_vs_R2_Full.png'),('Small compare',OUT/'R1c1_vs_R2_Small.png'),('Continuous Body',OUT/'Continuous_Body_Field_only.png'),('Low Frequency',OUT/'Low_Frequency_Density_Field_only.png'),('Directional',OUT/'Sparse_Directional_Deposit_only.png'),('Petal',OUT/'Petal_Base_Mass.png'),('Center',OUT/'Center_Base_Mass.png'),('Leaf',OUT/'Leaf_Base_Mass.png'),('Stem',OUT/'Stem_Base_Mass.png'),('Petal detector',OUT/'Petal_Band_Detector.png'),('Leaf detector',OUT/'Leaf_Band_Detector.png'),('Stem detector',OUT/'Stem_Band_Detector.png'),('Retention',OUT/'Retention_Heatmap.png'),('Low layer',OUT/'Frequency_low.png'),('Mid layer',OUT/'Frequency_mid.png'),('High layer',OUT/'Frequency_high.png')]
cell=(380,315);sheet=Image.new('RGB',(cell[0]*3,cell[1]*6),'white');dr=ImageDraw.Draw(sheet)
for i,(lab,path) in enumerate(items):
 x=Image.open(path).convert('RGB');x.thumbnail((cell[0]-18,cell[1]-42),Image.Resampling.LANCZOS);xx=(i%3)*cell[0]+(cell[0]-x.width)//2;yy=(i//3)*cell[1]+32;sheet.paste(x,(xx,yy));dr.text(((i%3)*cell[0]+8,(i//3)*cell[1]+8),lab,fill='black')
sheet.save(OUT/'WP9A_R2_Convergence_Evidence_Contact_Sheet.png')
print(json.dumps({'ok':not errors,'formalPreviewExecuteCount':formal_compile_count,'preview':log['preview'],'ink':log['ink'],'retention':retention,'spatial':spatial,'replayHash':runtime['replayHash'],'heroReplayHash':runtime['heroReplayHash'],'roundtrip':roundtrip,'directOpen':direct,'errors':errors},ensure_ascii=False,indent=2))
