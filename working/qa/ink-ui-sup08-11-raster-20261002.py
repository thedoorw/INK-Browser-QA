from pathlib import Path
import json,math,os
from PIL import Image
root=Path(os.environ.get('INK_REPO_ROOT','.'));e=root/'working/evidence/ink-ui-sup08-11-20261002'
def envelope(im,b,threshold=170,inset=0):
 x0=max(0,math.ceil(b['x'])+inset);y0=max(0,math.ceil(b['y'])+inset);x1=min(im.width,math.ceil(b.get('right',b['x']+b['width']))-inset);y1=min(im.height,math.ceil(b.get('bottom',b['y']+b['height']))-inset)
 pts=[(x,y) for y in range(y0,y1)for x in range(x0,x1)if max(im.getpixel((x,y))[:3])<threshold]
 if not pts:return None
 left,right=min(x for x,y in pts),max(x for x,y in pts);top,bottom=min(y for x,y in pts),max(y for x,y in pts)
 return{'inkPixels':len(pts),'boundsInclusive':[left,top,right,bottom],'size':[right-left+1,bottom-top+1],'center':[(left+right+1)/2,(top+bottom+1)/2]}
report={'method':'Rendered PNG raster, threshold max(R,G,B)<170 on light surfaces, bounded by final DOM Range or SVG/control crop. Source/reference threshold is separate. Coordinates are source-pixel edges; inclusive raster bounds. No DOM text box is mislabeled as visible ink.','baseline':'80a1016f1ba39ae75f401929bd8892b3bd5f023c','states':{},'window':{},'collapse':{},'checks':[]}
for pref in ['before','after']:
 d=json.loads((e/(pref+'-browser.json')).read_text());assert not d.get('failure'),d.get('failure')
 rows=[]
 for state in ['active','reference','reference-details','layers','layers-locked','dock-expanded']:
  im=Image.open(e/(pref+'-'+state+'.png')).convert('RGB')
  for r in d['states'][state]['rows']:
   for m in r['members']:
    if m['kind']!='text':continue
    ink=envelope(im,m['rect']);
    if not ink:continue
    rows.append({'state':state,'rowClass':r['class'],'rowTag':r['tag'],'text':m['text'],'row':r['rect'],'rowCenter':r['center'],'rangeBox':m['rect'],'glyph':ink,'glyphToRowDelta':ink['center'][1]-r['center'],'lineHeight':m['lineHeight'],'textBoxTrim':m['textBoxTrim'],'controls':[{'kind':x['kind'],'id':x.get('id'),'class':x.get('class'),'box':x['rect'],'centerDelta':x['rect']['y']+x['rect']['height']/2-r['center']}for x in r['members']if x['kind']!='text']})
 report['states'][pref]=rows
 im=Image.open(e/(pref+'-active.png')).convert('RGB');report['window'][pref]=[]
 for b in d['states']['active']['windowButtons']:
  ink=envelope(im,b['svg'],threshold=210);report['window'][pref].append({'label':b['label'],'button':b['rect'],'svgBox':b['svg'],'glyph':ink,'glyphToButtonDelta':[ink['center'][0]-(b['rect']['x']+b['rect']['width']/2),ink['center'][1]-(b['rect']['y']+b['rect']['height']/2)]})
 report['collapse'][pref]={}
 for state in ['active','tools-single','dock-collapsed','dock-expanded']:
  im=Image.open(e/(pref+'-'+state+'.png')).convert('RGB');items=[]
  for b in d['states'][state]['collapse']:
   ink=envelope(im,b['svg'],threshold=210);items.append({**b,'glyph':ink,'glyphToButtonDelta':ink['center'][1]-(b['button']['y']+b['button']['height']/2)if ink else None})
  report['collapse'][pref][state]=items
# Approximately one raster pixel; fractional CSS region centers can add 0.02px.
selected=[r for r in report['states']['after']if r['state'] in ['reference','reference-details','layers']and(r['rowTag']=='SUMMARY'or r['rowClass'] in ['creative-workspace-field','creative-workspace-field creative-file-field','ui-b-layer-lock','control-row range-row','layer-row active'])]
report['checks'].append({'name':'Representative Reference / Layers rendered glyph centers within approximately 1px','ok':all(abs(r['glyphToRowDelta'])<=1.05 for r in selected),'sampleCount':len(selected),'maxDelta':max(abs(r['glyphToRowDelta'])for r in selected)})
for label in ['未選擇檔案','圖層 1']:
 b=next(r for r in report['states']['before']if r['state']=='reference'and r['text']==label)
 a=next(r for r in report['states']['after']if r['state']=='reference'and r['text']==label)
 report['checks'].append({'name':'Shared truncated-row text preserves full CJK glyph height: '+label,'ok':a['glyph']['size']==b['glyph']['size'],'before':b['glyph']['size'],'after':a['glyph']['size']})
centers=[b['glyph']['center'][0]for b in report['window']['after']]
for state,items in report['collapse']['after'].items():
 report['checks'].append({'name':state+' collapse family uses common SVG/button/strip boxes','ok':len({(x['svg']['width'],x['svg']['height'],x['button']['width'],x['button']['height'],x['strip']['height'])for x in items})==1,'samples':items})
report['allPanelRowClusters']={}
for pref in ['before','after']:
 d=json.loads((e/(pref+'-browser.json')).read_text());items=[]
 for state,info in d['states'].items():
  if state in ['narrow','compact']:continue
  im=Image.open(e/(pref+'-'+state+'.png')).convert('RGB')
  for r in info['rows']:
   inks=[envelope(im,m['rect'])for m in r['members']if m['kind']=='text'];inks=[x for x in inks if x]
   if not inks:continue
   top=min(x['boundsInclusive'][1]for x in inks);bottom=max(x['boundsInclusive'][3]for x in inks)
   items.append({'state':state,'rowClass':r['class'],'tag':r['tag'],'height':r['rect']['height'],'text':r['text'],'rowCenter':r['center'],'combinedTextEnvelopeY':[top,bottom],'textClusterCenterDelta':(top+bottom+1)/2-r['center'],'singleLine':len(set(x['boundsInclusive'][1]for x in inks))==1})
 report['allPanelRowClusters'][pref]=items
(e/'raster-centers.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print(json.dumps({'checks':[{k:v for k,v in x.items()if k!='samples'}for x in report['checks']],'window':report['window']['after']},ensure_ascii=False))

# PS native frame border spans x1174..1276, y0..18 inclusive at 1280x1024.
reference=Image.open(root.parent/'project_sources/01-ps-1.png').convert('RGB')
psEdgeXs=[x for x in range(1160,1280)if reference.getpixel((x,1))==(99,99,99)]
psCluster={'x':min(psEdgeXs),'y':0,'right':max(psEdgeXs)+1,'bottom':19,'width':max(psEdgeXs)-min(psEdgeXs)+1,'height':19,'rightInset':1280-max(psEdgeXs)-1,'borderGray':[99,99,99],'edgeSamples':psEdgeXs}
report['cluster']={'photoshop':psCluster}
for pref in ['before','after']:
 d=json.loads((e/(pref+'-browser.json')).read_text());report['cluster'][pref]=d['states']['active']['windowCluster']
a=report['cluster']['after']['rect'];b=report['cluster']['before']['rect']
report['checks'].append({'name':'Window cluster outer bounds/right edge match measured Photoshop frame','ok':all(a[k]==psCluster[k]for k in ['x','y','right','bottom','width','height']),'reference':psCluster,'before':b,'after':a})
report['checks'].append({'name':'All three window glyphs have less dark raster ink','ok':all(a['glyph']['inkPixels']<b['glyph']['inkPixels']for a,b in zip(report['window']['after'],report['window']['before'])),'threshold':210,'before':[x['glyph']['inkPixels']for x in report['window']['before']],'after':[x['glyph']['inkPixels']for x in report['window']['after']]})
(e/'raster-centers.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps({'checks':[{k:v for k,v in x.items()if k!='samples'}for x in report['checks']]},ensure_ascii=False))
assert all(x['ok']for x in report['checks'])
