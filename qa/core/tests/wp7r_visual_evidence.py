from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import shutil

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'Runtime_Evidence'/'WP7R'
old=Image.open(ROOT/'Runtime_Evidence'/'WP7'/'01_wp7_refined_complete.png').convert('RGB')
new=Image.open(OUT/'01_wp7r_recovered_complete.png').convert('RGB')
shutil.copy2(ROOT/'Runtime_Evidence'/'WP7'/'01_wp7_refined_complete.png', OUT/'00_wp7_original.png')
font_path='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
font=ImageFont.truetype(font_path,18) if Path(font_path).exists() else ImageFont.load_default()
small_font=ImageFont.truetype(font_path,14) if Path(font_path).exists() else ImageFont.load_default()

def pair(a,b,title,path,scale=1):
    if scale!=1:
        a=a.resize((round(a.width*scale),round(a.height*scale)),Image.Resampling.LANCZOS)
        b=b.resize((round(b.width*scale),round(b.height*scale)),Image.Resampling.LANCZOS)
    gap=18; top=44
    canvas=Image.new('RGB',(a.width+b.width+gap,max(a.height,b.height)+top),'white')
    canvas.paste(a,(0,top)); canvas.paste(b,(a.width+gap,top))
    d=ImageDraw.Draw(canvas)
    d.text((8,8),'WP-7',font=font,fill='black')
    d.text((a.width+gap+8,8),'WP-7R',font=font,fill='black')
    tw=d.textbbox((0,0),title,font=small_font)[2]
    d.text(((canvas.width-tw)//2,26),title,font=small_font,fill=(70,70,70))
    canvas.save(path)
    return canvas

def crop(im,box): return im.crop(box)

pairs=[]
pairs.append(pair(old,new,'Complete A4 comparison',OUT/'04_full_side_by_side.png',.70))
regions={
 '05_single_petal_before_after.png':('Single petal', (180,25,405,235)),
 '06_three_petals_before_after.png':('Three adjacent petals', (70,65,530,355)),
 '07_crown_silhouette_before_after.png':('Crown silhouette', (35,15,560,405)),
 '08_center_before_after.png':('Flower center integration', (190,125,405,335)),
 '09_stem_before_after.png':('Stem continuity', (235,330,360,835)),
 '10_left_leaf_before_after.png':('Left leaf form', (0,430,315,842)),
 '11_right_leaf_before_after.png':('Right leaf form', (280,410,595,842)),
}
for filename,(title,box) in regions.items():
    p=pair(crop(old,box),crop(new,box),title,OUT/filename,1.15)
    pairs.append(p)
# Background uses edge areas where the subject is absent.
def background_strip(im):
    left=im.crop((0,0,120,420)); right=im.crop((475,0,595,420)); bottom=im.crop((165,650,430,842)).resize((240,174),Image.Resampling.LANCZOS)
    c=Image.new('RGB',(240,594),'white'); c.paste(left,(0,0)); c.paste(right,(120,0)); c.paste(bottom,(0,420)); return c
pairs.append(pair(background_strip(old),background_strip(new),'Background space',OUT/'12_background_before_after.png',1))
pairs.append(pair(old.resize((149,211),Image.Resampling.LANCZOS),new.resize((149,211),Image.Resampling.LANCZOS),'Small-view readability',OUT/'13_small_view_before_after.png',1))
# Actual local recompilation image evidence.
before=Image.open(OUT/'02_before_local_recompile.png').convert('RGB')
after=Image.open(OUT/'03_after_local_recompile.png').convert('RGB')
pairs.append(pair(before,after,'Single-petal local recompilation',OUT/'14_local_recompile_before_after.png',.70))
# Contact sheet of the principal evidence panels.
thumbs=[]
for p in pairs:
    q=p.copy(); q.thumbnail((620,440),Image.Resampling.LANCZOS); thumbs.append(q)
cols=2; gap=18; cellw=640; cellh=460
sheet=Image.new('RGB',(cols*cellw+(cols+1)*gap,((len(thumbs)+1)//2)*cellh+(((len(thumbs)+1)//2)+1)*gap),(235,235,235))
for i,q in enumerate(thumbs):
    x=gap+(i%cols)*cellw+(cellw-q.width)//2; y=gap+(i//cols)*cellh+(cellh-q.height)//2; sheet.paste(q,(x,y))
sheet.save(OUT/'WP7R_Evidence_Contact_Sheet.png')
print({'pairs':len(pairs),'sheet':str(OUT/'WP7R_Evidence_Contact_Sheet.png')})
