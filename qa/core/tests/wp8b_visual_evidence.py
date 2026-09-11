from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
import json, math, hashlib
import numpy as np
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'Runtime_Evidence'/'WP8B';OUT.mkdir(parents=True,exist_ok=True)
P={
 'WP-8A Reference':ROOT/'Runtime_Evidence'/'WP8A'/'01_wp8a_canvas_full.png',
 'WP-8B Low Frequency':OUT/'01_wp8b_low.png',
 'WP-8B Mid Frequency':OUT/'01_wp8b_mid.png',
 'WP-8B High Frequency':OUT/'01_wp8b_high.png',
 'WP-8B Composite':OUT/'01_wp8b_all.png'
}
imgs={k:Image.open(v).convert('RGB') for k,v in P.items()};w,h=imgs['WP-8B Composite'].size
boxes={'M1_Single_Petal':(292,105,574,303),'M2_Three_Petals':(270,30,590,405),'M3_Complete_Crown':(35,0,560,445),'Stem_Leaf':(45,360,550,840),'Background':(350,390,520,500)}
for name,box in boxes.items():
 for label,img in imgs.items():
  slug=label.lower().replace(' ','_').replace('-','').replace('/','_')
  crop=img.crop(box);crop.save(OUT/f'{name}_{slug}.png')
  if name=='M1_Single_Petal':crop.resize((crop.width*3,crop.height*3),Image.Resampling.LANCZOS).save(OUT/f'{name}_{slug}_zoom3x.png')
for label,img in imgs.items():
 sw=180;sh=round(h*sw/w);slug=label.lower().replace(' ','_').replace('-','');img.resize((sw,sh),Image.Resampling.LANCZOS).save(OUT/f'small_{slug}.png')
# Full and small side-by-side
for small in (False,True):
 a=imgs['WP-8A Reference'];b=imgs['WP-8B Composite']
 if small:a=a.resize((180,round(h*180/w)),Image.Resampling.LANCZOS);b=b.resize(a.size,Image.Resampling.LANCZOS)
 canvas=Image.new('RGB',(a.width+b.width+30,max(a.height,b.height)+48),'white');canvas.paste(a,(5,40));canvas.paste(b,(a.width+25,40));d=ImageDraw.Draw(canvas);d.text((8,12),'WP-8A',fill='black');d.text((a.width+28,12),'WP-8B',fill='black')
 canvas.save(OUT/('M4_A4_side_by_side_small.png' if small else 'M4_A4_side_by_side.png'))
# Quantitative frequency diagnosis (not aesthetic scoring)
def metrics(img):
 arr=np.asarray(img,dtype=np.float32)/255;lum=arr.mean(2);mask=lum<.97
 mx=arr.max(2);mn=arr.min(2);sat=(mx-mn)/(mx+1e-6)
 blur4=np.asarray(Image.fromarray((lum*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(4)),dtype=np.float32)/255
 blur1=np.asarray(Image.fromarray((lum*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1)),dtype=np.float32)/255
 return {'subjectLuminance':float(lum[mask].mean()),'subjectSaturation':float(sat[mask].mean()),'lowFrequencyStd':float(blur4[mask].std()),'midFrequencyRms':float(np.sqrt(np.mean((blur1[mask]-blur4[mask])**2))),'highFrequencyRms':float(np.sqrt(np.mean((lum[mask]-blur1[mask])**2))),'subjectFraction':float(mask.mean())}
summary={k:metrics(v) for k,v in imgs.items()}
# Periodic texture diagnostics in single-petal crop
def periodic(img):
 arr=np.asarray(img.crop(boxes['M1_Single_Petal']),dtype=np.float32).mean(2)/255
 low=np.asarray(Image.fromarray((arr*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.6)),dtype=np.float32)/255
 hp=arr-low;hp-=hp.mean();den=float(np.sum(hp*hp)+1e-9);lags=[]
 for dy,dx in [(0,2),(0,3),(0,4),(2,0),(3,0),(4,0),(2,2),(3,3),(4,4)]:
  a=hp[:-dy or None,:-dx or None];b=hp[dy:,dx:];lags.append(float(np.sum(a*b)/den))
 spec=np.abs(np.fft.fftshift(np.fft.fft2(hp)));cy,cx=np.array(spec.shape)//2;spec[cy-4:cy+5,cx-4:cx+5]=0
 return {'shortLagAutocorrelationMax':max(lags),'spectralPeakToMean':float(spec.max()/(spec.mean()+1e-9))}
period={k:periodic(v) for k,v in {'WP-8A':imgs['WP-8A Reference'],'WP-8B':imgs['WP-8B Composite']}.items()}
# Pigment accumulation chart from visible image sequence and runtime stroke stats
log=json.loads((OUT/'runtime-all.json').read_text())
chart=Image.new('RGB',(980,520),'white');d=ImageDraw.Draw(chart);d.text((25,18),'Painterly frequency / pigment mass diagnostics',fill='black')
vals=[('WP-8A mass',1-summary['WP-8A Reference']['subjectLuminance']),('WP-8B low mass',1-summary['WP-8B Low Frequency']['subjectLuminance']),('WP-8B composite mass',1-summary['WP-8B Composite']['subjectLuminance']),('WP-8B saturation',summary['WP-8B Composite']['subjectSaturation'])]
for i,(name,value) in enumerate(vals):
 y=85+i*92;d.text((30,y),name,fill='black');d.rectangle((230,y,900,y+38),outline=(100,100,100));d.rectangle((230,y,230+int(670*min(1,value)),y+38),fill=(110,110,110));d.text((910,y+9),f'{value:.4f}',fill='black')
chart.save(OUT/'pigment_accumulation_visualization.png')
# Edge hierarchy visual: crown crop with labels, no overlays on benchmark source.
edge=imgs['WP-8B Composite'].crop(boxes['M3_Complete_Crown']).resize((840,712),Image.Resampling.LANCZOS);ed=ImageDraw.Draw(edge);ed.rectangle((0,0,840,42),fill='white');ed.text((12,12),'WP-8B edge hierarchy: focal seams / structural edges / soft outer edges / lost edges',fill='black');edge.save(OUT/'edge_hierarchy_visualization.png')
# Mid layer visual
imgs['WP-8B Mid Frequency'].save(OUT/'mid_scale_stroke_visualization.png')
# Hash evidence
hashes={name:hashlib.sha256(path.read_bytes()).hexdigest() for name,path in P.items()}
report={'schema':'INK_FLORA_WP8B_VISUAL_EVIDENCE_V1','imageModelUsed':False,'specificSpeciesUsed':False,'benchmarkTraced':False,'frequencyMetrics':summary,'periodicTextureDiagnostics':period,'strokeStats':log['strokeStats'],'imageSHA256':hashes,'interpretation':{'automaticAestheticScoreUsed':False,'lowFrequencyMassImproved':summary['WP-8B Composite']['lowFrequencyStd']>summary['WP-8A Reference']['lowFrequencyStd'],'midFrequencyPresenceImproved':summary['WP-8B Composite']['midFrequencyRms']>summary['WP-8A Reference']['midFrequencyRms'],'highFrequencyRestrained':summary['WP-8B Composite']['highFrequencyRms']<.02,'subjectLuminanceLowerMoreMass':summary['WP-8B Composite']['subjectLuminance']<summary['WP-8A Reference']['subjectLuminance'],'subjectSaturationRetained':summary['WP-8B Composite']['subjectSaturation']>summary['WP-8A Reference']['subjectSaturation'],'manualVisualFinding':'WP-8B visibly increases continuous pigment mass, chromatic depth and mid-scale directional stroke presence while retaining WP-8A non-periodic surface.'}}
(OUT/'visual-evidence.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
# Contact sheet
def card(img,label,size=(300,425)):
 im=img.copy();im.thumbnail(size,Image.Resampling.LANCZOS);c=Image.new('RGB',(size[0]+18,size[1]+52),'white');c.paste(im,((c.width-im.width)//2,38));dd=ImageDraw.Draw(c);dd.text((8,10),label,fill='black');return c
rows=[]
rows.append([card(imgs['WP-8A Reference'],'WP-8A'),card(imgs['WP-8B Composite'],'WP-8B'),card(Image.open(OUT/'M4_A4_side_by_side_small.png').convert('RGB'),'Small-view comparison')])
rows.append([card(imgs['WP-8B Low Frequency'],'Low frequency', (300,300)),card(imgs['WP-8B Mid Frequency'],'Mid frequency',(300,300)),card(imgs['WP-8B High Frequency'],'High frequency',(300,300))])
for bench in ['M1_Single_Petal','M2_Three_Petals','M3_Complete_Crown']:
 rows.append([card(imgs['WP-8A Reference'].crop(boxes[bench]),f'{bench} WP-8A',(300,250)),card(imgs['WP-8B Composite'].crop(boxes[bench]),f'{bench} WP-8B',(300,250)),card(imgs['WP-8B Mid Frequency'].crop(boxes[bench]),f'{bench} Mid',(300,250))])
rows.append([card(Image.open(OUT/'pigment_accumulation_visualization.png').convert('RGB'),'Pigment mass',(300,250)),card(Image.open(OUT/'edge_hierarchy_visualization.png').convert('RGB'),'Edge hierarchy',(300,250)),card(imgs['WP-8B Composite'].crop(boxes['Stem_Leaf']),'Stem / leaves',(300,250))])
width=max(sum(c.width for c in row) for row in rows);height=sum(max(c.height for c in row) for row in rows)+20;sheet=Image.new('RGB',(width,height),'white');y=10
for row in rows:
 x=0;rh=max(c.height for c in row)
 for c in row:sheet.paste(c,(x,y));x+=c.width
 y+=rh
sheet.save(OUT/'WP8B_Evidence_Contact_Sheet.png')
print(json.dumps(report,ensure_ascii=False,indent=2))
