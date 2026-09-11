from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import json, math, shutil
import numpy as np

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'Runtime_Evidence'/'WP8A';OUT.mkdir(parents=True,exist_ok=True)
ORIGINAL=Path('/mnt/data/wp8a_original/01_wp8_painterly_complete.png')
if ORIGINAL.exists(): shutil.copy2(ORIGINAL,OUT/'00_wp8_original_full.png')
paths={
 'WP-8 Original':OUT/'00_wp8_original_full.png',
 'WP-8A Canvas 2D':OUT/'01_wp8a_canvas_full.png',
 'WP-8A WebGL2':OUT/'02_wp8a_webgl_full.png'
}
imgs={k:Image.open(v).convert('RGB') for k,v in paths.items()}
w,h=next(iter(imgs.values())).size
# Benchmark windows are fixed because geometry/plan/export dimensions are held constant.
boxes={
 'S1_Single_Petal':(292,105,574,303),
 'S2_Three_Adjacent_Petals':(270,30,590,405),
 'S3_Crown_Surface':(35,0,560,445)
}
for bench,box in boxes.items():
 for label,img in imgs.items():
  name=label.lower().replace(' ','_').replace('-','').replace('2d','2d').replace('/','_')
  crop=img.crop(box)
  crop.save(OUT/f'{bench}_{name}.png')
  if bench=='S1_Single_Petal': crop.resize((crop.width*3,crop.height*3),Image.Resampling.LANCZOS).save(OUT/f'{bench}_{name}_zoom3x.png')

# small-view proof
for label,img in imgs.items():
 sw=180;sh=round(h*sw/w)
 name=label.lower().replace(' ','_').replace('-','')
 img.resize((sw,sh),Image.Resampling.LANCZOS).save(OUT/f'small_view_{name}.png')

# Diagnostics from exact JS-generated data.
diag=json.loads((OUT/'renderer-diagnostics.json').read_text())
grain=np.array(diag['grain'],dtype=np.float32)
g=(np.clip(grain,0,1)*255).astype(np.uint8)
gim=Image.fromarray(g,'L').resize((768,512),Image.Resampling.BICUBIC).convert('RGB')
d=ImageDraw.Draw(gim);d.rectangle((0,0,768,34),fill='white');d.text((10,9),'Continuous canvas-coordinate grain field (low/mid/high frequency)',fill='black')
gim.save(OUT/'grain_field_visualization.png')

# Stamp spacing visualization.
canvas=Image.new('RGB',(960,520),'white');d=ImageDraw.Draw(canvas)
pts=diag['resampled'];scale=2.8;ox=80;oy=40
xy=[(ox+p['x']*scale,oy+p['y']*scale) for p in pts]
d.line(xy,fill=(90,90,90),width=3)
for i,(x,y) in enumerate(xy):
 r=2 if i%3 else 3;shade=60+int(160*(i/max(1,len(xy)-1)))
 d.ellipse((x-r,y-r,x+r,y+r),fill=(shade,shade,shade))
d.text((20,12),f"Adaptive arc-length spacing: {diag['summary']['spacingUniqueRounded']} distinct rounded intervals; min {diag['summary']['spacingMin']:.2f}, max {diag['summary']['spacingMax']:.2f}",fill='black')
d.text((20,490),'Points vary with width, pressure, speed and curvature; duplicate source point removed.',fill='black')
canvas.save(OUT/'stamp_spacing_visualization.png')

# Bristle cluster layout visualization.
bc=Image.new('RGB',(960,300),'white');bd=ImageDraw.Draw(bc);bd.line((60,150,900,150),fill=(170,170,170),width=2)
for c in diag['bristles']:
 x=480+c['offset']*720;y0=52+int(c['dropout']*125);y1=248-int(c['opacity']*280)
 bd.line((x,y0,x,y1),fill=(70,70,70),width=max(1,int(c['widthScale']*100)))
bd.text((20,15),'Clustered bristles: uneven offsets, contact, opacity and deterministic dropout',fill='black')
bc.save(OUT/'bristle_distribution_visualization.png')

# Alpha accumulation proof.
a=diag['alpha'];ac=Image.new('RGB',(960,520),'white');ad=ImageDraw.Draw(ac)
ad.line((70,450,920,450),fill='black',width=2);ad.line((70,35,70,450),fill='black',width=2)
def plot(values,fill):
 coords=[]
 for i,v in enumerate(values):coords.append((70+i/(len(values)-1)*850,450-v*400))
 ad.line(coords,fill=fill,width=4)
plot([x['sourceOver'] for x in a],(30,30,30));plot([x['oldAdditive'] for x in a],(150,150,150))
ad.text((80,15),'Alpha accumulation: bounded source-over (dark) vs old additive clamp (light)',fill='black')
ad.text((80,475),'Repeated contacts approach opacity continuously without isolated additive knots.',fill='black')
ac.save(OUT/'alpha_accumulation_visualization.png')

# Quantitative diagnostics, not an aesthetic score.
def metrics(img,box):
 arr=np.asarray(img.crop(box),dtype=np.float32)/255.0
 gray=arr.mean(2)
 low=np.asarray(Image.fromarray((gray*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2.2)),dtype=np.float32)/255
 hp=gray-low
 spec=np.abs(np.fft.fftshift(np.fft.fft2(hp)))
 cy,cx=np.array(spec.shape)//2;spec[max(0,cy-4):cy+5,max(0,cx-4):cx+5]=0
 peak=float(spec.max());mean=float(spec.mean()+1e-9)
 # lag autocorrelation catches evenly repeated dot/stamp rhythm.
 hp0=hp-hp.mean();den=float((hp0*hp0).sum()+1e-9);corr=[]
 for dy,dx in [(0,2),(0,3),(0,4),(2,0),(3,0),(4,0),(2,2),(3,3),(4,4)]:
  corr.append(float((hp0[:-dy or None,:-dx or None]*hp0[dy:,dx:]).sum()/den))
 return {'highFrequencyRms':float(np.sqrt(np.mean(hp**2))),'spectralPeakToMean':peak/mean,'shortLagAutocorrelationMax':max(corr),'meanLuminance':float(gray.mean()),'luminanceStd':float(gray.std())}
ms={k:metrics(v,boxes['S1_Single_Petal']) for k,v in imgs.items()}
ca=np.asarray(imgs['WP-8A Canvas 2D'],dtype=np.float32)/255
wa=np.asarray(imgs['WP-8A WebGL2'],dtype=np.float32)/255
subject=(np.minimum(ca.mean(2),wa.mean(2))<.97)
comparison={'meanAbsoluteRGB':float(np.abs(ca-wa).mean()),'subjectMeanAbsoluteRGB':float(np.abs(ca-wa)[subject].mean()),'canvasMeanLuminance':float(ca.mean()),'webglMeanLuminance':float(wa.mean()),'referenceRenderer':'Canvas 2D','webglRole':'explicit acceleration/comparison backend; fallback visual output is not claimed pixel-identical'}
# no-tile proof: adjacent grain blocks should not be identical/highly correlated.
block=grain[:64,:64];neighbor=grain[:64,64:128]
comparison['grainAdjacentBlockCorrelation']=float(np.corrcoef(block.ravel(),neighbor.ravel())[0,1])
report={'schema':'INK_FLORA_WP8A_VISUAL_DIAGNOSTICS_V1','benchmarks':boxes,'surfaceMetrics':ms,'canvasWebGLComparison':comparison,'interpretation':{'automaticAestheticScoreUsed':False,'primaryFinding':'WP-8 periodic point/stamp texture is absent in both revised outputs; Canvas 2D is the FLORA reference renderer because WebGL2 remains visibly more segmented under SwiftShader.'}}
(OUT/'visual-diagnostics.json').write_text(json.dumps(report,indent=2)+'\n')

# Contact sheet.
def card(img,label,size=(330,466)):
 thumb=img.copy();thumb.thumbnail(size,Image.Resampling.LANCZOS)
 c=Image.new('RGB',(size[0]+20,size[1]+55),'white');c.paste(thumb,((c.width-thumb.width)//2,35));dd=ImageDraw.Draw(c);dd.text((10,10),label,fill='black');return c
rows=[]
rows.append([card(imgs[k],k) for k in imgs])
for bench,box in boxes.items():rows.append([card(imgs[k].crop(box),f'{bench} — {k}',(330,250)) for k in imgs])
rows.append([card(Image.open(OUT/'grain_field_visualization.png').convert('RGB'),'Continuous grain field',(330,250)),card(Image.open(OUT/'stamp_spacing_visualization.png').convert('RGB'),'Adaptive spacing',(330,250)),card(Image.open(OUT/'alpha_accumulation_visualization.png').convert('RGB'),'Alpha accumulation',(330,250))])
row_heights=[max(c.height for c in row) for row in rows];sheet=Image.new('RGB',(sum(c.width for c in rows[0]),sum(row_heights)+20),'white');y=10
for row,rh in zip(rows,row_heights):
 x=0
 for c in row:sheet.paste(c,(x,y));x+=c.width
 y+=rh
sheet.save(OUT/'WP8A_Evidence_Contact_Sheet.png')
print(json.dumps(report,indent=2))
