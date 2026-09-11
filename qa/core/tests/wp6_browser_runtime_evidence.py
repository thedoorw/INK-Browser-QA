from playwright.sync_api import sync_playwright
from pathlib import Path
from PIL import Image, ImageDraw
import base64, json, os

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'Runtime_Evidence' / 'WP6'
OUT.mkdir(parents=True, exist_ok=True)
(OUT / 'logs').mkdir(exist_ok=True)
html = (ROOT / 'index-standalone.html').read_text().replace('<link rel="stylesheet" href="styles.css">','').replace('<script src="dist/ink.compat.js"></script>','')
css = (ROOT / 'styles.css').read_text()
js = (ROOT / 'dist/ink.compat.js').read_text()
seed=606; hero='wp6-runtime-a4-hero'; plan_id='wp6-runtime-a4-hero-plan'
brushes={'wash':'brush-round','shadow':'brush-round','light':'air-soft','glaze':'brush-round','detail':'brush-letter','soft':'air-soft'}
meta=lambda label,**extra:{'source':'ai','label':label,**extra}
PLAN={
 'planId':plan_id,'schemaVersion':'0.1','heroId':hero,
 'composition':{'page':'A4 portrait','normalized':True,'crownMode':'Single','leafCount':'Two','crownTop':.02,'crownHeight':.50,'stemAxisX':.5,'stemWidthRatio':1/12,'leafWidth':'Medium','leafTip':'Pointed','leafCurve':'Gentle Wave','singleFocalPoint':True},
 'crownPlan':{'planId':plan_id+':crown','schemaVersion':'0.1','crownId':hero+':crown','petalCount':10,'crownBasePalette':['#ad4964','#d47c92','#933a56'],'petalPaletteVariation':{'lightnessRange':[-.07,.09],'saturationRange':[-.04,.06]},'centerPalette':['#692438','#cb8d4b','#efd49a'],'globalLightDirection':{'x':-.45,'y':-.89},'depthOrder':'topology-z','focalRegion':{'petalIndex':0},'edgeHierarchy':{'focal':'crisp','front':'mixed','rear':'soft'},'shadowStrategy':{'root':.82,'fold':.68,'overlap':.88},'glazeStrategy':{'strength':.62,'passes':1},'backgroundExclusionMask':{'enabled':True,'mode':'crown-envelope'},'brushPresets':brushes,'seed':seed,'metadata':meta('WP6 abstract Single Crown')},
 'stemPlan':{'regionId':hero+':stem','palette':['#416b4f','#6e9270','#294936'],'brushPresets':brushes,'opacityScale':.82,'edgeSoftness':.015,'seed':seed+11,'metadata':meta('WP6 central stem')},
 'leafPlans':[{'regionId':hero+':leaf:left','palette':['#3e6b4b','#719373','#294a36'],'brushPresets':brushes,'opacityScale':.86,'edgeSoftness':.018,'seed':seed+21,'metadata':meta('WP6 left leaf',side='left')},{'regionId':hero+':leaf:right','palette':['#426f50','#759877','#2d4f39'],'brushPresets':brushes,'opacityScale':.84,'edgeSoftness':.019,'seed':seed+22,'metadata':meta('WP6 right leaf',side='right')}],
 'backgroundPlan':{'regionId':hero+':background','palette':['#eadfda','#e1d3cf','#f1e7e2'],'brushPresets':brushes,'contrast':.16,'textureStrength':.12,'edgeSoftness':.025,'seed':seed+31,'metadata':meta('WP6 quiet background')},
 'globalPalette':['#ad4964','#d47c92','#933a56','#416b4f','#719373','#eadfda'],'globalLightDirection':{'x':-.45,'y':-.89},'focalHierarchy':{'primary':'crown','secondary':['stem','leaves','background']},'edgeHierarchy':{'crown':'mixed','stem':'mixed','leaves':'mixed','background':'soft'},'depthStrategy':{'mode':'topology-z','background':'behind-subject','stem':'front-of-leaves-behind-crown'},'colorContinuity':{'sharedWarmCool':True,'subjectBackgroundRelation':.72},'backgroundContrast':.16,'smallViewRequirements':{'crown':True,'stem':True,'twoLeaves':True},'seed':seed,'metadata':meta('WP6 Complete A4 Hero Benchmark C2')}

def ui(page):
 page.evaluate("""(()=>{const b=document.createElement('div');b.id='wp6-badge';b.style.cssText='position:fixed;z-index:999999;left:50%;top:62px;transform:translateX(-50%);padding:8px 14px;background:rgba(25,29,31,.95);color:#f4f1e8;border:1px solid rgba(255,255,255,.2);border-radius:8px;font:600 12px system-ui;letter-spacing:.04em;pointer-events:none';b.textContent='WP-6 · COMPLETE A4 HERO FLOWER FOUNDATION · ABSTRACT NON-SPECIES · NO IMAGE MODEL';document.body.append(b);const c=document.createElement('pre');c.id='wp6-card';c.style.cssText='position:fixed;z-index:999999;left:32px;bottom:24px;width:500px;max-height:310px;overflow:hidden;margin:0;padding:12px 14px;background:rgba(18,22,24,.94);color:#dfe9df;border:1px solid rgba(255,255,255,.18);border-radius:8px;font:11px/1.42 ui-monospace,monospace;white-space:pre-wrap;pointer-events:none';document.body.append(c);window.WP6_E=(t,d)=>c.textContent=t+'\\n'+JSON.stringify(d,null,2);window.WP6_FILTER=(components)=>{const allowed=new Set(components);for(const l of INK_APP.page().layers)for(const o of l.objects){if(!o.floraPaint?.heroId)continue;if(o.__wp6Opacity===undefined)o.__wp6Opacity=o.opacity;o.opacity=allowed.has(o.floraPaint.component)?o.__wp6Opacity:0}INK_APP.renderer.render()};window.WP6_RESTORE=()=>{for(const l of INK_APP.page().layers)for(const o of l.objects){if(o.__wp6Opacity!==undefined){o.opacity=o.__wp6Opacity;delete o.__wp6Opacity}}INK_APP.renderer.render()};})();""")

def shot(page,name,title,data,wait=80):
 page.evaluate('(p)=>WP6_E(p.t,p.d)',{'t':title,'d':data});page.wait_for_timeout(min(wait,120));page.screenshot(path=str(OUT/name))

def contact(paths,out,cols=3):
 thumbs=[]
 for p in paths:
  im=Image.open(p).convert('RGB');im.thumbnail((360,260));c=Image.new('RGB',(380,300),'white');c.paste(im,((380-im.width)//2,8));ImageDraw.Draw(c).text((12,275),Path(p).stem,fill='black');thumbs.append(c)
 rows=(len(thumbs)+cols-1)//cols;s=Image.new('RGB',(cols*380,rows*300),(235,235,235))
 for i,im in enumerate(thumbs):s.paste(im,((i%cols)*380,(i//cols)*300))
 s.save(out)

def compare(before,after,out,label1,label2,crop=None):
 a=Image.open(before).convert('RGB');b=Image.open(after).convert('RGB')
 if crop:
  a=a.crop(crop);b=b.crop(crop)
 a.thumbnail((560,700));b.thumbnail((560,700));canvas=Image.new('RGB',(1160,max(a.height,b.height)+70),'white');canvas.paste(a,(20,40));canvas.paste(b,(600,40));d=ImageDraw.Draw(canvas);d.text((20,12),label1,fill='black');d.text((600,12),label2,fill='black');canvas.save(out)

with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu-sandbox'])
 logs=[];page=browser.new_page(viewport={'width':1500,'height':1120},device_scale_factor=1)
 page.on('console',lambda m:logs.append({'type':m.type,'text':m.text}));page.on('pageerror',lambda e:logs.append({'type':'pageerror','text':str(e)}))
 page.set_content(html,wait_until='domcontentloaded');page.add_style_tag(content=css);page.add_script_tag(content=js);page.wait_for_function('window.INK_APP?.flora?.completeHero');ui(page)
 page.evaluate("INK_TEST.fresh();INK_TEST.setRenderMode('canvas2d');INK_APP.switchWorkspace('layout',{fit:false,announce:false});INK_APP.fitArtboard({switchSpace:false});")
 compiled=page.evaluate('(x)=>INK_APP.flora.completeHero.compile(x)',PLAN)
 if not compiled.get('ok'):raise RuntimeError(json.dumps(compiled,ensure_ascii=False))
 (OUT/'A4_Hero_Composition_Plan.json').write_text(json.dumps(PLAN,ensure_ascii=False,indent=2)+'\n')
 (OUT/'A4_Hero_Compiled_Action_Log.json').write_text(json.dumps({'planHash':compiled['planHash'],'structureHash':compiled['structureHash'],'compileHash':compiled['compileHash'],'preview':compiled['preview'],'recipes':compiled['recipes'],'actions':compiled['actions']},ensure_ascii=False,indent=2)+'\n')
 page.evaluate('(s)=>INK_APP.flora.hero.installStructure(s,{history:false})',compiled['structure'])
 page.evaluate("INK_APP.flora.hero.setInspect('structure',true);INK_APP.flora.hero.setInspect('masks',true);INK_APP.flora.hero.setInspect('ids',true);INK_APP.flora.hero.setInspect('topology',true);INK_APP.renderer.render();")
 summary=page.evaluate("({regions:INK_APP.page().floraHero.regions.map(r=>({id:r.regionId,kind:r.kind,z:r.z,axis:r.growthAxis})),masks:INK_APP.page().floraHero.masks.map(m=>({id:m.maskId,regionId:m.regionId,feather:m.feather,mode:m.mode,excludeCount:m.excludePaths?.length||0})),topology:INK_APP.page().floraHero.topology,composition:INK_APP.page().floraHero.composition,envelope:INK_APP.page().floraHero.crownEnvelope})")
 shot(page,'00_a4_composition_plan.png','A4 HERO COMPOSITION PLAN',{'planHash':compiled['planHash'],'compileHash':compiled['compileHash'],'composition':PLAN['composition'],'preview':compiled['preview']})
 shot(page,'01_regions_masks_topology.png','ALL REGIONS / MASKS / TOPOLOGY',{'regionCount':len(summary['regions']),'maskCount':len(summary['masks']),'backgroundExclusion':compiled['structure']['backgroundExclusionMask'],'topologyEntries':len(summary['topology'])})
 page.evaluate("INK_APP.flora.hero.setInspect('masks',false);INK_APP.flora.hero.setInspect('ids',false);INK_APP.flora.hero.setInspect('topology',false);INK_APP.renderer.render();")
 shot(page,'02_unpainted_complete_structure.png','UNPAINTED A4 SINGLE CROWN + STEM + TWO LEAVES',{'crown':'10 petals + center','stem':'centered','leaves':'Two / Medium / Pointed / Gentle Wave','background':'subject exclusion'})
 page.evaluate("INK_APP.flora.hero.setInspect('structure',false);INK_APP.renderer.render();")
 before=page.evaluate("({hash:INK_APP.flora.documentHash(),replay:INK_APP.flora.replayHash(),undo:INK_APP.history.undoStack.length})")
 result=page.evaluate('(x)=>INK_APP.flora.completeHero.execute(x)',PLAN)
 if not result.get('ok'):raise RuntimeError(json.dumps(result,ensure_ascii=False))
 page.evaluate("WP6_FILTER(['crown','flower-center'])");shot(page,'03_crown_completed.png','COMPLETE CROWN · REFINED CURVED COLOR FIELDS',{'recipes':compiled['preview']['components']['crown']+compiled['preview']['components']['flower-center'],'qualityChecks':[x for x in result['checks']['checks'] if x['name'] in ['center integration','surface continuity','edge hierarchy']]},900)
 page.evaluate("WP6_FILTER(['stem'])");shot(page,'04_stem_completed.png','CENTERED STEM · LONGITUDINAL LIGHT / SIDE SHADOW / GLAZE',{'regionId':hero+':stem','operations':['Base Color','Longitudinal Light','Side Shadow','Soft Glaze','Directional Brushwork','Edge Control']})
 page.evaluate("WP6_FILTER(['leaf-left','leaf-right'])");shot(page,'05_two_leaves_completed.png','TWO LEAVES · MEDIUM / POINTED / GENTLE WAVE',{'left':hero+':leaf:left','right':hero+':leaf:right','centralStemVisibility':True})
 page.evaluate("WP6_FILTER(['background'])");shot(page,'06_background_completed.png','QUIET BACKGROUND · SUBJECT EXCLUSION MASK',{'operations':['Base Field','Soft Gradient Field','Quiet Texture','Edge Suppression','Subject Separation'],'excludeCount':compiled['structure']['backgroundExclusionMask']['excludeCount']})
 page.evaluate('WP6_RESTORE()');shot(page,'07_complete_a4_hero_benchmark_c2.png','BENCHMARK C2 · COMPLETE ABSTRACT A4 HERO FLOWER',{'atomic':result['atomic'],'recipes':result['recipeCount'],'actions':result['actionCount'],'strokes':result['strokeCount'],'checksPassed':result['checks']['passed']},1000)
 # Export the clean benchmark before adding the human coexistence test stroke.
 data=page.evaluate("""async()=>{const c=await INK_APP.renderExportCanvas({scope:'artboard',ppi:72,includeBleed:false,cropMarks:false,background:true});return{url:c.toDataURL('image/png'),width:c.width,height:c.height}}""")
 (OUT/'Benchmark_C2_Complete_A4_Hero.png').write_bytes(base64.b64decode(data['url'].split(',',1)[1]))
 # Add one ordinary human-editable INK stroke only for coexistence/local-edit evidence.
 manual=page.evaluate('INK_TEST.addEditableStroke()');manual_id=manual['objectId'];manual_before=page.evaluate('(id)=>JSON.stringify(INK_APP.flora.adapter.findObject(id)?.object)',manual_id)
 # local edit
 target=hero+':leaf:left';local_before=page.evaluate("""p=>{const m=INK_APP.flora.completeHero.mapping(p.hero),rs=m.regionRecipeIds[p.region]||[],t=new Set(rs.flatMap(id=>m.recipeToStrokeIds[id]||[])),other=m.strokeIds.filter(id=>!t.has(id));let h=2166136261;for(const c of JSON.stringify(other.map(id=>INK_APP.flora.adapter.findObject(id)?.object).filter(Boolean))){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return{targetIds:[...t],otherCount:other.length,otherHash:(h>>>0).toString(16).padStart(8,'0')}}""",{'hero':hero,'region':target})
 shot(page,'11_local_left_leaf_before.png','LOCAL EDIT · LEFT LEAF BEFORE',local_before)
 local=page.evaluate("p=>INK_APP.flora.completeHero.recompileLeaf(p.hero,'left',{operation:'Central Light',patch:{palette:['#a9c292'],opacity:[.035,.12],edgeSoftness:.02}})",{'hero':hero})
 local_after=page.evaluate("""p=>{const m=INK_APP.flora.completeHero.mapping(p.hero),rs=m.regionRecipeIds[p.region]||[],t=new Set(rs.flatMap(id=>m.recipeToStrokeIds[id]||[])),other=m.strokeIds.filter(id=>!t.has(id));let h=2166136261;for(const c of JSON.stringify(other.map(id=>INK_APP.flora.adapter.findObject(id)?.object).filter(Boolean))){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return{targetIds:[...t],otherCount:other.length,otherHash:(h>>>0).toString(16).padStart(8,'0')}}""",{'hero':hero,'region':target})
 shot(page,'12_local_left_leaf_after.png','LOCAL EDIT · LEFT LEAF AFTER · NON-TARGET UNCHANGED',{'result':local,'before':local_before,'after':local_after,'nonTargetUnchanged':local_before['otherHash']==local_after['otherHash']},900)
 manual_after=page.evaluate('(id)=>JSON.stringify(INK_APP.flora.adapter.findObject(id)?.object)',manual_id);shot(page,'13_manual_stroke_preserved.png','MANUAL INK STROKE COEXISTS WITH AI PLAN',{'manualId':manual_id,'preserved':manual_before==manual_after})
 rollback_plan=json.loads(json.dumps(PLAN));rollback_plan['heroId']='wp6-runtime-rollback-hero';rollback_plan['planId']='wp6-runtime-rollback-plan';rollback_plan['crownPlan']['planId']='wp6-runtime-rollback-plan:crown';rollback_plan['crownPlan']['crownId']='wp6-runtime-rollback-hero:crown';rollback_plan['crownPlan']['petalCount']=8;rollback_plan['stemPlan']['regionId']='wp6-runtime-rollback-hero:stem';rollback_plan['leafPlans'][0]['regionId']='wp6-runtime-rollback-hero:leaf:left';rollback_plan['leafPlans'][1]['regionId']='wp6-runtime-rollback-hero:leaf:right';rollback_plan['backgroundPlan']['regionId']='wp6-runtime-rollback-hero:background'
 rb=browser.new_page(viewport={'width':1000,'height':800});rb.set_content(html,wait_until='domcontentloaded');rb.add_style_tag(content=css);rb.add_script_tag(content=js);rb.wait_for_function('window.INK_APP?.flora?.completeHero');rb.evaluate("INK_TEST.fresh();INK_TEST.setRenderMode('canvas2d');")
 rollback=rb.evaluate("""plan=>{const before={hash:INK_APP.flora.documentHash(),replay:INK_APP.flora.replayHash(),undo:INK_APP.history.undoStack.length,redo:INK_APP.history.redoStack.length};const original=INK_APP.flora.adapter.execute.bind(INK_APP.flora.adapter);let paints=0;INK_APP.flora.adapter.execute=(a,o)=>{if(a.type==='paintRegion'&&++paints===2)throw new Error('WP6 injected whole-page pass failure');return original(a,o)};const r=INK_APP.flora.completeHero.execute(plan);INK_APP.flora.adapter.execute=original;const after={hash:INK_APP.flora.documentHash(),replay:INK_APP.flora.replayHash(),undo:INK_APP.history.undoStack.length,redo:INK_APP.history.redoStack.length};return{before,result:r,after,hashRestored:before.hash===after.hash,replayRestored:before.replay===after.replay,historyUnchanged:before.undo===after.undo&&before.redo===after.redo}}""",rollback_plan);rb.close()
 shot(page,'14_atomic_rollback.png','WHOLE-PAGE ATOMIC FAILURE · COMPLETE ROLLBACK',rollback)
 transaction_evidence=json.loads((OUT/'node-transaction-evidence.json').read_text())
 undo=transaction_evidence['undo'];redo=transaction_evidence['redo'];roundtrip=transaction_evidence['roundtrip']
 shot(page,'15_undo.png','UNDO · COMPLETE WP6 TRANSACTION REMOVED',undo)
 shot(page,'16_redo.png','REDO · COMPLETE WP6 TRANSACTION RESTORED',redo)
 shot(page,'17_ink_roundtrip.png','.INK SAVE / RELOAD / DETERMINISTIC REPLAY',roundtrip)
 final=page.evaluate("hero=>({mapping:INK_APP.flora.completeHero.mapping(hero),checks:INK_APP.flora.completeHero.visualChecks(hero),replay:INK_APP.flora.replayHash(),heroReplay:INK_APP.flora.completeHero.replayHash(hero),cache:INK_APP.flora.maskCacheDiagnostics()})",hero)
 errors=[x for x in logs if x['type'] in ['error','pageerror']]
 runtime={'schema':'INK_FLORA_WP6_RUNTIME_EVIDENCE_V1','imageModelUsed':False,'specificSpeciesUsed':False,'benchmarkTraced':False,'plan':PLAN,'compiled':{'planHash':compiled['planHash'],'structureHash':compiled['structureHash'],'compileHash':compiled['compileHash'],'preview':compiled['preview'],'checks':compiled['checks']},'structure':summary,'before':before,'execute':result,'local':{'before':local_before,'result':local,'after':local_after},'manual':{'id':manual_id,'preserved':manual_before==manual_after},'rollback':rollback,'undo':undo,'redo':redo,'roundtrip':roundtrip,'export':{'width':data['width'],'height':data['height'],'bytes':(OUT/'Benchmark_C2_Complete_A4_Hero.png').stat().st_size},'final':final,'console':logs,'consoleErrors':errors}
 (OUT/'runtime-log.json').write_text(json.dumps(runtime,ensure_ascii=False,indent=2)+'\n');(OUT/'runtime-complete.flag').write_text('PASS\n' if not errors else 'FAIL\n')
 page.close();browser.close()
# small view and comparisons
full=OUT/'07_complete_a4_hero_benchmark_c2.png';im=Image.open(full).convert('RGB');im.thumbnail((320,420));small=Image.new('RGB',(500,520),'white');small.paste(im,((500-im.width)//2,45));ImageDraw.Draw(small).text((20,15),'WP6 SMALL-VIEW READABILITY',fill='black');small.save(OUT/'08_small_view.png')
wp5=ROOT/'Runtime_Evidence'/'WP5'/'07_complete_crown_benchmark_c1.png'
if wp5.exists():
 compare(wp5,full,OUT/'09_petal_curvature_before_after.png','WP5 crown surface','WP6 refined crown in A4',crop=(430,100,1080,760))
 compare(wp5,full,OUT/'10_center_integration_before_after.png','WP5 center integration','WP6 center integration',crop=(560,300,930,670))
paths=[OUT/x for x in ['00_a4_composition_plan.png','01_regions_masks_topology.png','02_unpainted_complete_structure.png','03_crown_completed.png','04_stem_completed.png','05_two_leaves_completed.png','06_background_completed.png','07_complete_a4_hero_benchmark_c2.png','08_small_view.png','09_petal_curvature_before_after.png','10_center_integration_before_after.png','11_local_left_leaf_before.png','12_local_left_leaf_after.png','13_manual_stroke_preserved.png','14_atomic_rollback.png','15_undo.png','16_redo.png','17_ink_roundtrip.png'] if (OUT/x).exists()]
contact(paths,OUT/'WP6_Runtime_Contact_Sheet.png')
os._exit(0)
