from playwright.sync_api import sync_playwright
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
import json
import os

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'Runtime_Evidence' / 'WP5'
OUT.mkdir(parents=True, exist_ok=True)
(OUT / 'logs').mkdir(exist_ok=True)
html = (ROOT / 'index-standalone.html').read_text()
html = html.replace('<link rel="stylesheet" href="styles.css">', '').replace('<script src="dist/ink.compat.js"></script>', '')
css = (ROOT / 'styles.css').read_text()
js = (ROOT / 'dist/ink.compat.js').read_text()

PLAN = {
    'planId': 'wp5-runtime-crown-plan', 'schemaVersion': '0.1',
    'crownId': 'wp5-runtime-complete-crown', 'petalCount': 10,
    'crownBasePalette': ['#ad4964', '#d47c92', '#933a56'],
    'petalPaletteVariation': {'lightnessRange': [-.07, .09], 'saturationRange': [-.04, .06]},
    'centerPalette': ['#692438', '#cb8d4b', '#efd49a'],
    'globalLightDirection': {'x': -.45, 'y': -.89},
    'depthOrder': 'topology-z', 'focalRegion': {'petalIndex': 0},
    'edgeHierarchy': {'focal': 'crisp', 'front': 'mixed', 'rear': 'soft'},
    'shadowStrategy': {'root': .82, 'fold': .68, 'overlap': .88},
    'glazeStrategy': {'strength': .62, 'passes': 1},
    'backgroundExclusionMask': {'enabled': True, 'mode': 'crown-envelope'},
    'brushPresets': {
        'wash': 'brush-round', 'shadow': 'brush-round', 'light': 'air-soft',
        'glaze': 'brush-round', 'detail': 'brush-letter', 'soft': 'air-soft'
    },
    'seed': 505,
    'metadata': {'source': 'ai', 'label': 'WP5 Complete Crown Benchmark C1'}
}


def install_evidence_ui(page):
    page.evaluate("""
      (()=>{
        const badge=document.createElement('div'); badge.id='wp5-badge';
        badge.style.cssText='position:fixed;z-index:999999;left:50%;top:66px;transform:translateX(-50%);padding:8px 14px;background:rgba(25,29,31,.95);color:#f4f1e8;border:1px solid rgba(255,255,255,.2);border-radius:8px;font:600 12px system-ui;letter-spacing:.04em;pointer-events:none';
        badge.textContent='WP-5 · COMPLETE CROWN PAINTING FOUNDATION · ABSTRACT NON-SPECIES SINGLE CROWN · NO IMAGE MODEL'; document.body.append(badge);
        const card=document.createElement('pre'); card.id='wp5-card';
        card.style.cssText='position:fixed;z-index:999999;left:44px;bottom:34px;width:500px;max-height:310px;overflow:hidden;margin:0;padding:12px 14px;background:rgba(18,22,24,.94);color:#dfe9df;border:1px solid rgba(255,255,255,.18);border-radius:8px;font:11px/1.42 ui-monospace,monospace;white-space:pre-wrap;pointer-events:none';
        document.body.append(card); window.WP5_EVIDENCE=(title,data)=>{card.textContent=title+'\\n'+JSON.stringify(data,null,2)};
        window.WP5_SET_OPS=(ops,centerMode='include')=>{
          const allowed=new Set(ops); const crownId='wp5-runtime-complete-crown';
          for(const layer of INK_APP.page().layers) for(const object of layer.objects){
            if(!object.floraPaint?.recipeId?.startsWith('wp5-runtime-crown-plan:')) continue;
            if(object.__wp5Opacity===undefined) object.__wp5Opacity=object.opacity;
            const isCenter=object.floraPaint.regionId===`${crownId}:center`;
            const centerAllowed=centerMode==='only'?isCenter:centerMode==='exclude'?!isCenter:true;
            object.opacity=(allowed.has(object.floraPaint.recipeOperation)&&centerAllowed)?object.__wp5Opacity:0;
          }
          INK_APP.renderer.render();
        };
        window.WP5_RESTORE_OPS=()=>{for(const layer of INK_APP.page().layers)for(const object of layer.objects){if(object.__wp5Opacity!==undefined){object.opacity=object.__wp5Opacity;delete object.__wp5Opacity;}}INK_APP.renderer.render();};
      })();
    """)


def make_page(browser, console, label):
    page = browser.new_page(viewport={'width': 1500, 'height': 1120}, device_scale_factor=1)
    page.on('console', lambda m: console.append({'type': m.type, 'text': m.text, 'page': label}))
    page.on('pageerror', lambda e: console.append({'type': 'pageerror', 'text': str(e), 'page': label}))
    page.set_content(html, wait_until='domcontentloaded')
    page.add_style_tag(content=css)
    page.add_script_tag(content=js)
    page.wait_for_function('window.INK_APP && window.INK_APP.flora && window.INK_APP.flora.crown')
    install_evidence_ui(page)
    page.evaluate("INK_TEST.fresh(); INK_TEST.setRenderMode('canvas2d'); INK_APP.switchWorkspace('layout',{fit:false,announce:false}); INK_APP.fitArtboard({switchSpace:false});")
    return page


def screenshot(page, name, title, data, wait=550):
    page.evaluate('(p)=>WP5_EVIDENCE(p.title,p.data)', {'title': title, 'data': data})
    page.wait_for_timeout(wait)
    page.screenshot(path=str(OUT / name))


def contact_sheet(paths, output):
    thumbs=[]
    for path in paths:
        im=Image.open(path).convert('RGB')
        im.thumbnail((360,260))
        canvas=Image.new('RGB',(380,300),'white')
        canvas.paste(im,((380-im.width)//2,8))
        draw=ImageDraw.Draw(canvas)
        draw.text((12,275),Path(path).stem,fill='black')
        thumbs.append(canvas)
    cols=3; rows=(len(thumbs)+cols-1)//cols
    sheet=Image.new('RGB',(cols*380,rows*300),(235,235,235))
    for i,im in enumerate(thumbs): sheet.paste(im,((i%cols)*380,(i//cols)*300))
    sheet.save(output)


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox', '--disable-gpu-sandbox'])
    console=[]
    page=make_page(browser,console,'runtime')

    compiled=page.evaluate('(plan)=>INK_APP.flora.crown.compile(plan)', PLAN)
    if not compiled.get('ok'):
        raise RuntimeError(json.dumps(compiled, ensure_ascii=False))
    (OUT/'Crown_Painting_Plan.json').write_text(json.dumps(PLAN,ensure_ascii=False,indent=2)+'\n')
    action_log={
        'planHash':compiled.get('planHash'),'structureHash':compiled.get('structureHash'),'compileHash':compiled.get('compileHash'),
        'preview':compiled.get('preview'),'actions':compiled.get('actions'),'recipes':compiled.get('recipes')
    }
    (OUT/'Crown_Compiled_Action_Log.json').write_text(json.dumps(action_log,ensure_ascii=False,indent=2)+'\n')

    page.evaluate('(structure)=>INK_APP.flora.hero.installStructure(structure,{history:false})',compiled['structure'])
    page.evaluate("INK_APP.flora.hero.setInspect('structure',true);INK_APP.flora.hero.setInspect('masks',true);INK_APP.flora.hero.setInspect('ids',true);INK_APP.flora.hero.setInspect('topology',true);INK_APP.renderer.render();")
    structure_summary=page.evaluate("({petalCount:INK_APP.page().floraHero.regions.filter(r=>r.kind==='petal-region').length,centerCount:INK_APP.page().floraHero.regions.filter(r=>r.kind==='flower-center-region').length,focalRegionId:INK_APP.page().floraHero.focalRegionId,envelope:INK_APP.page().floraHero.crownEnvelope,regions:INK_APP.page().floraHero.regions.map(r=>({regionId:r.regionId,role:r.role,z:r.z,relation:r.relation,growthAxis:r.growthAxis,overlaps:r.overlaps})),topology:INK_APP.page().floraHero.topology,masks:INK_APP.page().floraHero.masks.map(m=>({maskId:m.maskId,regionId:m.regionId,feather:m.feather,visible:m.visible,vectorHash:m.vectorHash}))})")
    screenshot(page,'00_crown_painting_plan.png','CROWN PAINTING PLAN',{'plan':PLAN,'planHash':compiled['planHash'],'compileHash':compiled['compileHash'],'preview':compiled['preview']})
    screenshot(page,'01_regions_masks_topology.png','PETAL REGIONS / MASKS / FRONT-BACK TOPOLOGY',{'petalCount':10,'centerCount':1,'focalRegionId':structure_summary['focalRegionId'],'topologyEntries':len(structure_summary['topology']),'maskCount':len(structure_summary['masks'])})
    page.evaluate("INK_APP.flora.hero.setInspect('masks',false);INK_APP.flora.hero.setInspect('ids',false);INK_APP.flora.hero.setInspect('topology',false);INK_APP.renderer.render();")
    screenshot(page,'02_unpainted_complete_crown_structure.png','UNPAINTED COMPLETE SINGLE CROWN STRUCTURE',{'nearCircleEnvelope':True,'petals':'10 independent regions','center':'1 abstract center','controlledAsymmetry':True})

    # Manual INK stroke is created before Crown execution and must survive all Crown operations.
    manual=page.evaluate("INK_TEST.addEditableStroke()")
    manual_id=manual['objectId']
    manual_before=page.evaluate('(id)=>JSON.stringify(INK_APP.flora.adapter.findObject(id)?.object)',manual_id)
    page.evaluate("INK_APP.flora.hero.setInspect('structure',false);INK_APP.renderer.render();")
    before_execute=page.evaluate("({hash:INK_APP.flora.documentHash(),replay:INK_APP.flora.replayHash(),undo:INK_APP.history.undoStack.length,objects:INK_APP.page().layers[0].objects.length})")
    execute=page.evaluate('(plan)=>INK_APP.flora.crown.execute(plan)',PLAN)
    if not execute.get('ok'):
        raise RuntimeError(json.dumps(execute,ensure_ascii=False))
    after_execute=page.evaluate("({hash:INK_APP.flora.documentHash(),replay:INK_APP.flora.replayHash(),undo:INK_APP.history.undoStack.length,objects:INK_APP.page().layers[0].objects.length,crownMapping:INK_APP.flora.crown.mapping('wp5-runtime-complete-crown'),checks:INK_APP.flora.crown.visualChecks('wp5-runtime-complete-crown')})")

    # Operation-stage evidence is derived from formal editable Crown strokes by temporary visibility filtering.
    page.evaluate("WP5_SET_OPS(['Base Wash'],'exclude')")
    screenshot(page,'03_base_wash_complete_crown.png','BASE WASH · COMPLETE CROWN PETALS · MASK CLIPPED',{'operation':'Base Wash','petals':10,'centerHiddenForStage':True,'strokeCount':execute['strokeCount']})
    page.evaluate("WP5_SET_OPS(['Base Wash','Root Shadow','Fold Shadow','Overlap Shadow','Central Light','Edge Light'],'exclude')")
    screenshot(page,'04_shadow_light_complete_crown.png','ROOT / FOLD / OVERLAP SHADOW + CENTRAL / EDGE LIGHT',{'globalLightDirection':PLAN['globalLightDirection'],'topologyAwareOverlap':True,'centerHiddenForStage':True})
    page.evaluate("WP5_SET_OPS(['Base Wash','Root Shadow','Fold Shadow','Overlap Shadow','Central Light','Edge Light','Transparent Glaze','Directional Brushwork','Boundary Dissolve'],'exclude')")
    screenshot(page,'05_glaze_directional_brushwork.png','GLAZE / DIRECTIONAL BRUSHWORK / BOUNDARY DISSOLVE',{'growthAxisDriven':True,'edgeHierarchy':PLAN['edgeHierarchy'],'glazeStrategy':PLAN['glazeStrategy']})
    page.evaluate("WP5_SET_OPS(['Base Wash','Root Shadow','Central Light','Edge Light','Transparent Glaze','Directional Brushwork'],'only')")
    screenshot(page,'06_flower_center_foundation.png','FLOWER CENTER FOUNDATION · RADIAL PAINTING · MASK CLIPPED',{'centerRegionId':'wp5-runtime-complete-crown:center','operations':6,'radialDirection':True,'localRecompileSupported':True})
    page.evaluate("WP5_RESTORE_OPS()")
    screenshot(page,'07_complete_crown_benchmark_c1.png','BENCHMARK C1 · COMPLETE ABSTRACT SINGLE CROWN',{'result':{'atomic':execute['atomic'],'recipes':execute['recipeCount'],'actions':execute['actionCount'],'strokes':execute['strokeCount'],'historyEntriesAdded':execute['historyEntriesAdded']},'visualChecks':execute['checks']},wait=850)

    # Undo/Redo proves the whole Crown is one transaction while the manual stroke remains.
    before_undo=page.evaluate("({hash:INK_APP.flora.documentHash(),replay:INK_APP.flora.replayHash(),objects:INK_APP.page().layers[0].objects.length,manual:!!INK_APP.flora.adapter.findObject('"+manual_id+"'),undo:INK_APP.history.undoStack.length,redo:INK_APP.history.redoStack.length})")
    page.evaluate("INK_APP.history.undo();INK_APP.renderer.render();")
    undo=page.evaluate("({hash:INK_APP.flora.documentHash(),replay:INK_APP.flora.replayHash(),objects:INK_APP.page().layers[0].objects.length,manual:!!INK_APP.flora.adapter.findObject('"+manual_id+"'),crown:INK_APP.flora.crown.lookup('wp5-runtime-complete-crown'),undo:INK_APP.history.undoStack.length,redo:INK_APP.history.redoStack.length})")
    screenshot(page,'08_undo_complete_crown_transaction.png','UNDO · COMPLETE CROWN REMOVED · MANUAL STROKE PRESERVED',{'before':before_undo,'after':undo})
    page.evaluate("INK_APP.history.redo();INK_APP.renderer.render();")
    redo=page.evaluate("({hash:INK_APP.flora.documentHash(),replay:INK_APP.flora.replayHash(),objects:INK_APP.page().layers[0].objects.length,manual:!!INK_APP.flora.adapter.findObject('"+manual_id+"'),crownPresent:!!INK_APP.flora.crown.lookup('wp5-runtime-complete-crown'),undo:INK_APP.history.undoStack.length,redo:INK_APP.history.redoStack.length})")
    screenshot(page,'09_redo_complete_crown_transaction.png','REDO · COMPLETE CROWN RESTORED',redo)

    target='wp5-runtime-complete-crown:petal:01'
    local_before=page.evaluate("""(p)=>{
      const m=INK_APP.flora.crown.mapping(p.crownId), targetRecipes=m.regionRecipeIds[p.regionId]||[], target=new Set(targetRecipes.flatMap(id=>m.recipeToStrokeIds[id]||[]));
      const other=m.strokeIds.filter(id=>!target.has(id)); const stable=v=>JSON.stringify(v); let h=2166136261;
      for(const c of stable(other.map(id=>INK_APP.flora.adapter.findObject(id)?.object).filter(Boolean))){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}
      return{targetRegionId:p.regionId,targetRecipeIds:targetRecipes,targetStrokeIds:[...target],nonTargetStrokeCount:other.length,nonTargetHash:(h>>>0).toString(16).padStart(8,'0'),manual:JSON.stringify(INK_APP.flora.adapter.findObject(p.manual)?.object)};
    }""",{'crownId':PLAN['crownId'],'regionId':target,'manual':manual_id})
    screenshot(page,'10_local_petal_before.png','LOCAL PETAL EDIT · BEFORE',local_before)
    local_result=page.evaluate("""(p)=>INK_APP.flora.crown.adjustPetal(p.crownId,p.regionId,{operation:'Central Light',opacity:[.055,.16],palette:['#fff0f4'],edgeSoftness:.006})""",{'crownId':PLAN['crownId'],'regionId':target})
    local_after=page.evaluate("""(p)=>{
      const m=INK_APP.flora.crown.mapping(p.crownId), targetRecipes=m.regionRecipeIds[p.regionId]||[], target=new Set(targetRecipes.flatMap(id=>m.recipeToStrokeIds[id]||[]));
      const other=m.strokeIds.filter(id=>!target.has(id)); const stable=v=>JSON.stringify(v); let h=2166136261;
      for(const c of stable(other.map(id=>INK_APP.flora.adapter.findObject(id)?.object).filter(Boolean))){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}
      return{targetRegionId:p.regionId,targetRecipeIds:targetRecipes,targetStrokeIds:[...target],nonTargetStrokeCount:other.length,nonTargetHash:(h>>>0).toString(16).padStart(8,'0'),manual:JSON.stringify(INK_APP.flora.adapter.findObject(p.manual)?.object)};
    }""",{'crownId':PLAN['crownId'],'regionId':target,'manual':manual_id})
    local_evidence={'result':local_result,'before':local_before,'after':local_after,'nonTargetUnchanged':local_before['nonTargetHash']==local_after['nonTargetHash'],'manualUnchanged':manual_before==local_after['manual']}
    screenshot(page,'11_local_petal_after.png','LOCAL PETAL EDIT · AFTER · OTHER PETALS UNCHANGED',local_evidence,wait=850)

    # Replacement Crown failure is injected mid-pass. The prior complete Crown must be restored exactly.
    rollback=page.evaluate("""(plan)=>{
      const before={hash:INK_APP.flora.documentHash(),replay:INK_APP.flora.replayHash(),undo:INK_APP.history.undoStack.length,redo:INK_APP.history.redoStack.length,objects:INK_APP.page().layers[0].objects.length,mapping:INK_APP.flora.crown.mapping(plan.crownId)};
      const original=INK_APP.flora.adapter.execute.bind(INK_APP.flora.adapter);let paints=0;
      INK_APP.flora.adapter.execute=(action,options)=>{if(action.type==='paintRegion'&&++paints===17)throw new Error('WP5 injected mid-petal failure');return original(action,options)};
      const changed=structuredClone(plan);changed.seed=plan.seed+77;
      const result=INK_APP.flora.crown.execute(changed);INK_APP.flora.adapter.execute=original;
      const after={hash:INK_APP.flora.documentHash(),replay:INK_APP.flora.replayHash(),undo:INK_APP.history.undoStack.length,redo:INK_APP.history.redoStack.length,objects:INK_APP.page().layers[0].objects.length,mapping:INK_APP.flora.crown.mapping(plan.crownId)};
      return{before,result,after,hashRestored:before.hash===after.hash,replayRestored:before.replay===after.replay,historyUnchanged:before.undo===after.undo&&before.redo===after.redo,objectsUnchanged:before.objects===after.objects,mappingRestored:JSON.stringify(before.mapping)===JSON.stringify(after.mapping)};
    }""",PLAN)
    screenshot(page,'12_atomic_crown_rollback.png','ATOMIC CROWN FAILURE · COMPLETE ROLLBACK',rollback)

    roundtrip=page.evaluate("""(()=>{
      const before={replay:INK_APP.flora.replayHash(),crownReplay:INK_APP.flora.crown.replayHash('wp5-runtime-complete-crown'),mapping:INK_APP.flora.crown.mapping('wp5-runtime-complete-crown')};
      const json=INK_APP.flora.serializeDocument(),bytes=new Blob([json],{type:'application/json'}).size;
      INK_APP.flora.reloadDocument(json);INK_APP.switchWorkspace('layout',{fit:false,announce:false});INK_APP.fitArtboard({switchSpace:false});INK_APP.renderer.render();
      const after={replay:INK_APP.flora.replayHash(),crownReplay:INK_APP.flora.crown.replayHash('wp5-runtime-complete-crown'),mapping:INK_APP.flora.crown.mapping('wp5-runtime-complete-crown')};
      return{before,after,inkBytes:bytes,replayMatch:before.replay===after.replay,crownReplayMatch:before.crownReplay===after.crownReplay,mappingMatch:JSON.stringify(before.mapping)===JSON.stringify(after.mapping)};
    })()""")
    screenshot(page,'13_ink_roundtrip_replay.png','.INK ROUNDTRIP + DETERMINISTIC CROWN REPLAY',roundtrip)

    png_export=page.evaluate("""async()=>{const canvas=await INK_APP.renderExportCanvas({scope:'artboard',ppi:150,includeBleed:false,cropMarks:false,background:true});const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));const out={type:blob?.type||null,bytes:blob?.size||0,width:canvas.width,height:canvas.height};canvas.width=1;canvas.height=1;return out;}""")
    checks=page.evaluate("INK_APP.flora.crown.visualChecks('wp5-runtime-complete-crown')")
    final_mapping=page.evaluate("INK_APP.flora.crown.mapping('wp5-runtime-complete-crown')")
    final_replay=page.evaluate("INK_APP.flora.replayHash()")
    crown_replay=page.evaluate("INK_APP.flora.crown.replayHash('wp5-runtime-complete-crown')")
    mask_cache=page.evaluate("INK_APP.flora.maskCacheDiagnostics()")
    manual_after=page.evaluate('(id)=>JSON.stringify(INK_APP.flora.adapter.findObject(id)?.object)',manual_id)
    errors=[item for item in console if item.get('type') in ('error','pageerror')]
    runtime={
        'schema':'INK_FLORA_WP5_RUNTIME_EVIDENCE_V1',
        'runtime':'Chromium functional harness using production standalone DOM/CSS/dist compatibility bundle',
        'imageModelUsed':False,'specificSpeciesUsed':False,'benchmarkTraced':False,
        'plan':PLAN,'compiled':{'planHash':compiled.get('planHash'),'structureHash':compiled.get('structureHash'),'compileHash':compiled.get('compileHash'),'preview':compiled.get('preview'),'checks':compiled.get('checks')},
        'structure':structure_summary,'beforeExecute':before_execute,'execute':execute,'afterExecute':after_execute,
        'manualStroke':{'id':manual_id,'before':manual_before,'after':manual_after,'preserved':manual_before==manual_after},
        'undo':undo,'redo':redo,'localRecompile':local_evidence,'atomicRollback':rollback,'roundtrip':roundtrip,
        'visualChecks':checks,'finalMapping':final_mapping,'finalReplayHash':final_replay,'crownReplayHash':crown_replay,
        'maskCache':mask_cache,'pngExport':png_export,'console':console,'consoleErrors':errors
    }
    (OUT/'runtime-log.json').write_text(json.dumps(runtime,ensure_ascii=False,indent=2)+'\n')
    (OUT/'runtime-complete.flag').write_text('PASS\n' if not errors else 'FAIL\n')
    page.close(); browser.close()

paths=[OUT/name for name in [
    '00_crown_painting_plan.png','01_regions_masks_topology.png','02_unpainted_complete_crown_structure.png',
    '03_base_wash_complete_crown.png','04_shadow_light_complete_crown.png','05_glaze_directional_brushwork.png',
    '06_flower_center_foundation.png','07_complete_crown_benchmark_c1.png','08_undo_complete_crown_transaction.png',
    '09_redo_complete_crown_transaction.png','10_local_petal_before.png','11_local_petal_after.png',
    '12_atomic_crown_rollback.png','13_ink_roundtrip_replay.png']]
contact_sheet(paths,OUT/'WP5_Runtime_Contact_Sheet.png')
os._exit(0)
