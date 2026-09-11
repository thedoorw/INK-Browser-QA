from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import json,textwrap,shutil
R=Path(__file__).resolve().parents[1];O=R/'Runtime_Evidence/WP7'
OLD=R/'Runtime_Evidence/WP6/Benchmark_C2_Complete_A4_Hero.png';shutil.copy2(OLD,O/'00_wp6_original_complete.png')
NODE=json.loads((O/'node-transaction-evidence.json').read_text());runtime=json.loads((O/'runtime-log.json').read_text())
try:
 FONT=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',22);SMALL=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',17);TITLE=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',28)
except:FONT=SMALL=TITLE=ImageFont.load_default()
def fit(im,box,bg='white'):
 im=im.convert('RGB');im.thumbnail(box,Image.Resampling.LANCZOS);c=Image.new('RGB',box,bg);c.paste(im,((box[0]-im.width)//2,(box[1]-im.height)//2));return c
def compare(old,new,crop,title,issue,params,judgement,outname):
 a=Image.open(old).convert('RGB').crop(crop);b=Image.open(new).convert('RGB').crop(crop);pw,ph=560,520;ca=fit(a,(pw,ph),'#f6f3f1');cb=fit(b,(pw,ph),'#f6f3f1');canvas=Image.new('RGB',(pw*2+30,ph+190),'white');canvas.paste(ca,(0,190));canvas.paste(cb,(pw+30,190));d=ImageDraw.Draw(canvas);d.text((18,10),title,font=TITLE,fill='black');d.text((18,50),'WP-6 BEFORE',font=FONT,fill='#555');d.text((pw+48,50),'WP-7 REFINED',font=FONT,fill='#555');y=84
 for raw in [f'Issue: {issue}',f'Recipe: {params}',f'Assessment: {judgement}']:
  for line in textwrap.wrap(raw,width=118):d.text((18,y),line,font=SMALL,fill='#333');y+=22
 canvas.save(O/outname)
old=O/'00_wp6_original_complete.png';new=O/'01_wp7_refined_complete.png'
compare(old,new,(220,30,380,245),'SINGLE PETAL REFINEMENT','fragmented dry-brush strips and weak root-to-tip volume','axis color-field interpolation; curvature paths; smoothing .88; texture suppression .80','continuous curved volume, protected silhouette, retained directional surface marks','03_single_petal_before_after.png')
compare(old,new,(105,25,490,320),'THREE ADJACENT PETALS','parallel repeated marks and unclear overlap','overlap-aware shadow falloff; deterministic length variation; local glaze accumulation','three petals separate cleanly with controlled seam depth and shared color field','04_three_petals_before_after.png')
compare(old,new,(55,20,540,455),'COMPLETE CROWN','mechanical radial fragments and incomplete silhouette','nonuniform petal geometry; radial regularity check; silhouette protection','near-circle crown remains readable while petal rhythm is less mechanical','05_complete_crown_before_after.png')
compare(old,new,(205,150,390,325),'FLOWER CENTER','detached pale center and weak inner-petal connection','radial interpolation; root depth; center glaze; inner overlap shadow','abstract center is smaller, deeper, and integrated with inner petals','06_flower_center_before_after.png')
compare(old,new,(245,325,350,842),'STEM REFINEMENT','stacked dabs and segmented vertical form','continuous growth-axis field; longitudinal light; side shadow; texture suppression .88','single continuous central volume remains clear at small size','07_stem_before_after.png')
compare(old,new,(0,450,310,842),'LEFT LEAF REFINEMENT','bundle of parallel strokes without a complete mass','full leaf field; axis interpolation; local edge hardness; pointed-tip protection','one continuous leaf mass with central volume and intact tip','08_left_leaf_before_after.png')
compare(old,new,(285,450,595,842),'RIGHT LEAF REFINEMENT','bundle of parallel strokes and mirrored repetition','controlled deterministic variation; full field; glaze; boundary dissolve','distinct right leaf mass, near symmetry without exact mirroring','09_right_leaf_before_after.png')
compare(old,new,(0,0,145,842),'BACKGROUND REFINEMENT','visible regular linear scaffolding','texture suppression .94; broad segmented fields; subject exclusion','low-contrast quiet field supports the subject without a second focus','10_background_before_after.png')
compare(old,new,(0,0,595,842),'COMPLETE A4 BENCHMARK C3','programmatic rough-dry-brush foundation','all WP-7 refinement controls; same A4 Single/Two skeleton and seed','substantial continuity, volume, silhouette, center, stem, leaf, and background improvement','02_wp6_wp7_side_by_side.png')
A=fit(Image.open(old),(250,354),'white');B=fit(Image.open(new),(250,354),'white');sm=Image.new('RGB',(560,440),'white');sm.paste(A,(20,66));sm.paste(B,(290,66));d=ImageDraw.Draw(sm);d.text((18,12),'SMALL-VIEW READABILITY · WP-6 / WP-7',font=TITLE,fill='black');d.text((75,45),'WP-6',font=SMALL,fill='#555');d.text((360,45),'WP-7',font=SMALL,fill='#555');sm.save(O/'11_small_view_before_after.png')
def card(title,data,name):
 w,h=1200,760;im=Image.new('RGB',(w,h),'white');d=ImageDraw.Draw(im);d.text((24,18),title,font=TITLE,fill='black');y=65
 for raw in json.dumps(data,ensure_ascii=False,indent=2).splitlines():
  for line in textwrap.wrap(raw,width=125,replace_whitespace=False,drop_whitespace=False) or ['']:
   if y>h-30:break
   d.text((25,y),line,font=SMALL,fill='#333');y+=21
  if y>h-30:break
 im.save(O/name)
card('WP7 REFINED RECIPE PARAMETERS',json.loads((O/'Visual_Refinement_Recipe_Diff.json').read_text()),'14_recipe_diff.png')
card('NON-TARGET REGION HASH + MANUAL STROKE PRESERVATION',NODE['local'],'15_non_target_hash.png')
card('ATOMIC WHOLE-PAGE ROLLBACK',NODE['rollback'],'16_atomic_rollback.png')
card('UNDO · COMPLETE HERO TRANSACTION',NODE['undo'],'17_undo.png')
card('REDO · COMPLETE HERO TRANSACTION',NODE['redo'],'18_redo.png')
card('.INK ROUNDTRIP + DETERMINISTIC REPLAY',{'roundtrip':NODE['roundtrip'],'deterministic':NODE['deterministic']},'19_ink_roundtrip.png')
card('A4 PNG EXPORT',runtime['export'],'20_a4_png_export.png')
names=['00_wp6_original_complete.png','01_wp7_refined_complete.png','02_wp6_wp7_side_by_side.png','03_single_petal_before_after.png','04_three_petals_before_after.png','05_complete_crown_before_after.png','06_flower_center_before_after.png','07_stem_before_after.png','08_left_leaf_before_after.png','09_right_leaf_before_after.png','10_background_before_after.png','11_small_view_before_after.png','12_local_edit_before.png','13_local_edit_after.png','14_recipe_diff.png','15_non_target_hash.png','16_atomic_rollback.png','17_undo.png','18_redo.png','19_ink_roundtrip.png','20_a4_png_export.png']
thumbs=[]
for name in names:
 p=O/name
 if p.exists():thumbs.append((name,fit(Image.open(p),(360,300),'#eeeeee')))
cols=3;cw,ch=390,350;rows=(len(thumbs)+cols-1)//cols;sheet=Image.new('RGB',(cols*cw,rows*ch+70),'white');d=ImageDraw.Draw(sheet);d.text((18,15),'WP-7 HERO FLOWER VISUAL QUALITY REFINEMENT · RUNTIME EVIDENCE',font=TITLE,fill='black')
for i,(name,img) in enumerate(thumbs):
 x=(i%cols)*cw+15;y=(i//cols)*ch+65;sheet.paste(img,(x,y+28));d.text((x,y),name,font=SMALL,fill='#333')
sheet.save(O/'WP7_Runtime_Contact_Sheet.png')
print(json.dumps({'evidenceCount':len(thumbs),'contactSheet':str(O/'WP7_Runtime_Contact_Sheet.png')},indent=2))
