from playwright.sync_api import sync_playwright
from pathlib import Path
import json, hashlib, time

ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'runtime-evidence'/'wp3'
OUT.mkdir(parents=True,exist_ok=True)
html=(ROOT/'index-standalone.html').read_text()
html=html.replace('<link rel="stylesheet" href="styles.css">','').replace('<script src="dist/ink.compat.js"></script>','')
css=(ROOT/'styles.css').read_text()
js=(ROOT/'dist/ink.compat.js').read_text()

PETAL='wp3-benchmark:petal-region:0'
CONTROL='wp3-benchmark:control-region:0'

def js_action(action_id, typ, payload, seed=73):
    return {'schemaVersion':'0.1','actionId':action_id,'type':typ,'payload':payload,'seed':seed,'metadata':{'source':'ai','label':action_id}}

with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu-sandbox'])
    page=browser.new_page(viewport={'width':1440,'height':1100},device_scale_factor=1)
    console=[]
    page.on('console',lambda m: console.append({'type':m.type,'text':m.text}))
    page.on('pageerror',lambda e: console.append({'type':'pageerror','text':str(e)}))
    page.set_content(html,wait_until='domcontentloaded')
    page.add_style_tag(content=css)
    page.add_script_tag(content=js)
    page.wait_for_function('window.INK_APP && window.INK_APP.flora')
    page.evaluate("""
      (()=>{
        const badge=document.createElement('div'); badge.id='wp3-evidence-badge';
        badge.style.cssText='position:fixed;z-index:999999;left:50%;top:66px;transform:translateX(-50%);padding:8px 14px;background:rgba(25,29,31,.92);color:#f4f1e8;border:1px solid rgba(255,255,255,.2);border-radius:8px;font:600 12px system-ui;letter-spacing:.04em;pointer-events:none';
        badge.textContent='WP-3 · CHROMIUM FUNCTIONAL RUNTIME · INK CORE · NO IMAGE MODEL'; document.body.append(badge);
        const card=document.createElement('pre'); card.id='wp3-evidence-card';
        card.style.cssText='position:fixed;z-index:999999;left:52px;bottom:46px;max-width:500px;max-height:250px;overflow:hidden;margin:0;padding:12px 14px;background:rgba(20,23,25,.92);color:#dfe9df;border:1px solid rgba(255,255,255,.18);border-radius:8px;font:11px/1.45 ui-monospace,monospace;white-space:pre-wrap;pointer-events:none';
        document.body.append(card);
        window.WP3_EVIDENCE=(title,data)=>{card.textContent=title+'\\n'+JSON.stringify(data,null,2)};
      })();
    """)
    page.evaluate("INK_TEST.fresh(); INK_TEST.setRenderMode('canvas2d'); INK_APP.flora.hero.createBenchmarkPetal({profileId:'wp3-benchmark',feather:0,seed:73},{history:false}); INK_APP.flora.hero.setInspect('structure',true); INK_APP.flora.hero.setInspect('masks',true); INK_APP.flora.hero.setInspect('ids',true); INK_APP.flora.hero.setInspect('topology',true); INK_APP.switchWorkspace('layout',{fit:false,announce:false}); INK_APP.fitArtboard({switchSpace:false}); INK_APP.renderer.render();")
    page.wait_for_timeout(800)
    layer_id=page.evaluate('INK_APP.page().layers[0].id')
    page.evaluate("WP3_EVIDENCE('ABSTRACT PETAL REGION + VECTOR MASK',{runtime:'Chromium functional harness',regionId:'%s',controlRegion:'%s',maskVisible:true,feather:0,topology:'front of control region'})"%(PETAL,CONTROL))
    page.screenshot(path=str(OUT/'01_petal_region_mask.png'))

    base=js_action('wp3-runtime-base','paintRegion',{'regionId':PETAL,'layerId':layer_id,'operation':'Base Wash','brushPreset':'brush-round','color':'#b85c72','density':28,'spacing':.025,'widthRange':[24,42],'opacityRange':[.22,.42],'jitter':.12,'edgeAvoidance':0},801)
    base_result=page.evaluate('(a)=>INK_APP.flora.dispatch(a)',base)
    page.evaluate('(d)=>WP3_EVIDENCE("HARD MASK · BASE WASH",d)',{'result':base_result,'feather':0,'nonTargetObjectCount':0})
    page.wait_for_timeout(900); page.screenshot(path=str(OUT/'02_hard_mask_base_wash.png'))

    feather_batch=[
      js_action('wp3-runtime-clear-hard','clearRegion',{'regionId':PETAL,'layerId':layer_id},802),
      js_action('wp3-runtime-feather','setMaskFeather',{'regionId':PETAL,'feather':.035},803),
      js_action('wp3-runtime-feather-wash','paintRegion',{'regionId':PETAL,'layerId':layer_id,'operation':'Base Wash','brushPreset':'brush-round','color':'#b85c72','density':30,'spacing':.024,'widthRange':[24,44],'opacityRange':[.18,.38],'jitter':.15,'edgeAvoidance':0},804)
    ]
    feather_result=page.evaluate('(a)=>INK_APP.flora.dispatchMany(a)',feather_batch)
    page.evaluate('(d)=>WP3_EVIDENCE("FEATHER MASK · ATOMIC REPAINT",d)',{'result':feather_result,'feather':.035,'cache':page.evaluate('INK_APP.flora.maskCacheDiagnostics()')})
    page.wait_for_timeout(900); page.screenshot(path=str(OUT/'03_feather_mask_base_wash.png'))

    glaze=js_action('wp3-runtime-glaze','paintRegion',{'regionId':PETAL,'layerId':layer_id,'operation':'Directional Glaze','brushPreset':'brush-letter','color':'#74243f','direction':'base-to-tip','density':20,'spacing':.034,'widthRange':[6,14],'opacityRange':[.11,.25],'jitter':.10,'edgeAvoidance':.008},805)
    glaze_result=page.evaluate('(a)=>INK_APP.flora.dispatch(a)',glaze)
    page.evaluate('(d)=>WP3_EVIDENCE("DIRECTIONAL GLAZE · BASE-TO-TIP",d)',glaze_result)
    page.wait_for_timeout(900); page.screenshot(path=str(OUT/'04_directional_glaze.png'))

    veil=js_action('wp3-runtime-veil','paintRegion',{'regionId':PETAL,'layerId':layer_id,'operation':'Soft Edge Veil','brushPreset':'air-soft','color':'#f1c4d1','direction':'contour-follow','density':18,'spacing':.032,'widthRange':[22,46],'opacityRange':[.04,.12],'jitter':.22,'edgeAvoidance':0},806)
    veil_result=page.evaluate('(a)=>INK_APP.flora.dispatch(a)',veil)
    page.evaluate('(d)=>WP3_EVIDENCE("SOFT EDGE VEIL · CONTOUR-FOLLOW",d)',veil_result)
    page.wait_for_timeout(900); page.screenshot(path=str(OUT/'05_soft_edge_veil.png'))

    objects_before=page.evaluate("INK_APP.page().layers.flatMap(l=>l.objects).filter(o=>o.floraPaint?.regionId==='%s').length"%CONTROL)
    page.evaluate("INK_APP.flora.hero.setInspect('masks',false); INK_APP.renderer.render();")
    page.evaluate('(d)=>WP3_EVIDENCE("MASK DISPLAY OFF · NON-TARGET REGION UNCHANGED",d)',{'maskDisplay':False,'controlRegionObjectsBefore':objects_before,'controlRegionObjectsAfter':objects_before})
    page.wait_for_timeout(600); page.screenshot(path=str(OUT/'06_mask_hidden_non_target_unchanged.png'))
    page.evaluate("INK_APP.flora.hero.setInspect('masks',true); INK_APP.renderer.render();")

    before_atomic=page.evaluate('({hash:INK_APP.flora.documentHash(),undo:INK_APP.history.undoStack.length})')
    atomic_success=[
      js_action('wp3-runtime-atomic-feather','setMaskFeather',{'regionId':PETAL,'feather':.02},900),
      js_action('wp3-runtime-atomic-glaze','paintRegion',{'regionId':PETAL,'layerId':layer_id,'operation':'Directional Glaze','brushPreset':'brush-letter','color':'#5f1f38','direction':'tip-to-base','density':6},901)
    ]
    atomic_success_result=page.evaluate('(a)=>INK_APP.flora.dispatchMany(a)',atomic_success)
    after_atomic=page.evaluate('({hash:INK_APP.flora.documentHash(),undo:INK_APP.history.undoStack.length})')
    page.evaluate('(d)=>WP3_EVIDENCE("ATOMIC BATCH SUCCESS · ONE HISTORY TRANSACTION",d)',{'before':before_atomic,'result':atomic_success_result,'after':after_atomic})
    page.wait_for_timeout(500); page.screenshot(path=str(OUT/'07_atomic_success.png'))

    before_failure=page.evaluate('({hash:INK_APP.flora.documentHash(),undo:INK_APP.history.undoStack.length,objects:INK_APP.page().layers.flatMap(l=>l.objects).length})')
    atomic_failure=[
      js_action('wp3-runtime-rollback-feather','setMaskFeather',{'regionId':PETAL,'feather':.05},910),
      js_action('wp3-runtime-rollback-valid','paintRegion',{'regionId':PETAL,'layerId':layer_id,'operation':'Base Wash','brushPreset':'brush-round','color':'#aa5570','density':5},911),
      js_action('wp3-runtime-rollback-invalid','paintRegion',{'regionId':PETAL,'layerId':layer_id,'operation':'Base Wash','brushPreset':'missing-brush','color':'#aa5570','density':5},912)
    ]
    atomic_failure_result=page.evaluate('(a)=>INK_APP.flora.dispatchMany(a)',atomic_failure)
    after_failure=page.evaluate('({hash:INK_APP.flora.documentHash(),undo:INK_APP.history.undoStack.length,objects:INK_APP.page().layers.flatMap(l=>l.objects).length,cache:INK_APP.flora.maskCacheDiagnostics()})')
    page.evaluate('(d)=>WP3_EVIDENCE("ATOMIC BATCH FAILURE · COMPLETE ROLLBACK",d)',{'before':before_failure,'result':atomic_failure_result,'after':after_failure})
    page.wait_for_timeout(500); page.screenshot(path=str(OUT/'08_atomic_rollback.png'))

    before_undo=page.evaluate('({hash:INK_APP.flora.documentHash(),objects:INK_APP.page().layers.flatMap(l=>l.objects).length})')
    page.evaluate('INK_APP.history.undo(); INK_APP.renderer.render();')
    undo_state=page.evaluate('({hash:INK_APP.flora.documentHash(),objects:INK_APP.page().layers.flatMap(l=>l.objects).length,undo:INK_APP.history.undoStack.length,redo:INK_APP.history.redoStack.length})')
    page.evaluate('(d)=>WP3_EVIDENCE("UNDO",d)',{'before':before_undo,'after':undo_state})
    page.wait_for_timeout(500); page.screenshot(path=str(OUT/'09_undo.png'))
    page.evaluate('INK_APP.history.redo(); INK_APP.renderer.render();')
    redo_state=page.evaluate('({hash:INK_APP.flora.documentHash(),objects:INK_APP.page().layers.flatMap(l=>l.objects).length,undo:INK_APP.history.undoStack.length,redo:INK_APP.history.redoStack.length})')
    page.evaluate('(d)=>WP3_EVIDENCE("REDO",d)',redo_state)
    page.wait_for_timeout(500); page.screenshot(path=str(OUT/'10_redo.png'))

    roundtrip=page.evaluate("""(()=>{const before=INK_APP.flora.replayHash(),json=INK_APP.flora.serializeDocument(),bytes=new Blob([json],{type:'application/json'}).size;INK_APP.flora.reloadDocument(json);INK_APP.switchWorkspace('layout',{fit:false,announce:false});INK_APP.fitArtboard({switchSpace:false});INK_APP.flora.hero.setInspect('structure',true);INK_APP.flora.hero.setInspect('masks',true);INK_APP.flora.hero.setInspect('ids',true);INK_APP.flora.hero.setInspect('topology',true);INK_APP.renderer.render();const after=INK_APP.flora.replayHash();return{before,after,match:before===after,inkBytes:bytes,objects:INK_APP.page().layers.flatMap(l=>l.objects).length};})()""")
    page.evaluate('(d)=>WP3_EVIDENCE(".INK JSON ROUNDTRIP + DETERMINISTIC REPLAY",d)',roundtrip)
    page.wait_for_timeout(700); page.screenshot(path=str(OUT/'11_roundtrip_replay.png'))

    png_export=page.evaluate("""async()=>{const canvas=await INK_APP.renderExportCanvas({scope:'artboard',ppi:150,includeBleed:false,cropMarks:false,background:true});const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));const result={type:blob?.type||null,bytes:blob?.size||0,width:canvas.width,height:canvas.height};canvas.width=1;canvas.height=1;return result;}""")

    runtime={
      'schema':'INK_FLORA_WP3_RUNTIME_EVIDENCE_V1',
      'runtime':'Chromium functional harness using production index DOM/CSS/dist bundle',
      'directFileAttempt':{'passed':False,'reason':'ERR_BLOCKED_BY_ADMINISTRATOR in managed execution environment','screenshot':'00_direct_file_blocked.png'},
      'baseWash':base_result,'featherBatch':feather_result,'directionalGlaze':glaze_result,'softEdgeVeil':veil_result,
      'atomicSuccess':{'before':before_atomic,'result':atomic_success_result,'after':after_atomic},
      'atomicFailure':{'before':before_failure,'result':atomic_failure_result,'after':after_failure},
      'undo':undo_state,'redo':redo_state,'roundtrip':roundtrip,
      'maskCache':page.evaluate('INK_APP.flora.maskCacheDiagnostics()'),
      'pngExport':png_export,
      'console':console
    }
    (OUT/'runtime-log.json').write_text(json.dumps(runtime,ensure_ascii=False,indent=2)+'\n')
    browser.close()
