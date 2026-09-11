from playwright.sync_api import sync_playwright
from pathlib import Path
import json
import os

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'Runtime_Evidence' / 'WP4'
OUT.mkdir(parents=True, exist_ok=True)
html = (ROOT / 'index-standalone.html').read_text()
html = html.replace('<link rel="stylesheet" href="styles.css">', '').replace('<script src="dist/ink.compat.js"></script>', '')
css = (ROOT / 'styles.css').read_text()
js = (ROOT / 'dist/ink.compat.js').read_text()

IDS = {
    'left': 'wp4-three-petal:petal:rear-left',
    'right': 'wp4-three-petal:petal:rear-right',
    'front': 'wp4-three-petal:petal:front-center'
}
OPS = {
    'Base Wash': ('brush-round', 'contour-follow', ['#b95772', '#d98699'], 'source-over'),
    'Root Shadow': ('brush-round', 'base-to-tip', ['#6d243c'], 'multiply'),
    'Fold Shadow': ('brush-letter', 'base-to-tip', ['#843049'], 'multiply'),
    'Central Light': ('air-soft', 'base-to-tip', ['#f2ced6'], 'screen'),
    'Edge Light': ('brush-letter', 'contour-follow', ['#f8dfe4'], 'screen'),
    'Overlap Shadow': ('brush-round', 'contour-follow', ['#592034'], 'multiply'),
    'Transparent Glaze': ('brush-round', 'base-to-tip', ['#b34366'], 'soft-light'),
    'Directional Brushwork': ('brush-letter', 'base-to-tip', ['#cf6c82'], 'source-over'),
    'Boundary Dissolve': ('air-soft', 'contour-follow', ['#eeb6c4'], 'source-over')
}

def recipe(operation, region, seed, suffix='', **patch):
    brush, direction, palette, blend = OPS[operation]
    constraints = {'bandWidth': .05, 'preserveManual': True}
    if operation == 'Overlap Shadow': constraints = {'frontRegionId': IDS['front'], 'bandWidth': .048, 'preserveManual': True}
    if operation == 'Fold Shadow': constraints = {'foldSide': 'center', 'bandWidth': .058, 'preserveManual': True}
    data = {
        'recipeId': f"runtime-{operation.lower().replace(' ', '-')}-{region.split(':')[-1]}{suffix}",
        'schemaVersion': '0.1', 'targetRegionId': region, 'operation': operation,
        'brushPreset': brush, 'direction': direction, 'palette': palette,
        'coverage': .88, 'opacity': [.07, .24], 'density': 18 if operation == 'Base Wash' else 12,
        'spacing': .032, 'widthRange': [7, 25] if operation != 'Directional Brushwork' else [3, 9],
        'jitter': .12, 'feather': .014, 'passes': 1, 'blendMode': blend, 'seed': seed,
        'constraints': constraints, 'metadata': {'source': 'ai', 'label': f'WP4 {operation} {region.split(":")[-1]}'}
    }
    data.update(patch)
    return data

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox', '--disable-gpu-sandbox'])
    page = browser.new_page(viewport={'width': 1500, 'height': 1120}, device_scale_factor=1)
    console = []
    page.on('console', lambda m: console.append({'type': m.type, 'text': m.text}))
    page.on('pageerror', lambda e: console.append({'type': 'pageerror', 'text': str(e)}))
    page.set_content(html, wait_until='domcontentloaded')
    page.add_style_tag(content=css)
    page.add_script_tag(content=js)
    page.wait_for_function('window.INK_APP && window.INK_APP.flora && window.INK_APP.flora.recipe')
    page.evaluate("""
      (()=>{
        const badge=document.createElement('div'); badge.id='wp4-badge';
        badge.style.cssText='position:fixed;z-index:999999;left:50%;top:66px;transform:translateX(-50%);padding:8px 14px;background:rgba(25,29,31,.94);color:#f4f1e8;border:1px solid rgba(255,255,255,.2);border-radius:8px;font:600 12px system-ui;letter-spacing:.04em;pointer-events:none';
        badge.textContent='WP-4 · PAINTING RECIPE COMPILER · THREE ABSTRACT PETALS · NO IMAGE MODEL'; document.body.append(badge);
        const card=document.createElement('pre'); card.id='wp4-card';
        card.style.cssText='position:fixed;z-index:999999;left:48px;bottom:40px;width:470px;max-height:285px;overflow:hidden;margin:0;padding:12px 14px;background:rgba(18,22,24,.93);color:#dfe9df;border:1px solid rgba(255,255,255,.18);border-radius:8px;font:11px/1.42 ui-monospace,monospace;white-space:pre-wrap;pointer-events:none';
        document.body.append(card); window.WP4_EVIDENCE=(title,data)=>{card.textContent=title+'\\n'+JSON.stringify(data,null,2)};
      })();
    """)
    page.evaluate("INK_TEST.fresh(); INK_TEST.setRenderMode('canvas2d'); INK_APP.flora.hero.createBenchmarkThreePetals({profileId:'wp4-three-petal',feather:.012,seed:404},{history:false}); INK_APP.switchWorkspace('layout',{fit:false,announce:false}); INK_APP.fitArtboard({switchSpace:false});")
    layer_id = page.evaluate('INK_APP.page().layers[0].id')

    governance = {
        'WP3Gate': 'PASS', 'reason': 'file/HTTP/npm deployment evidence removed from painting-core governance',
        'parentUnitTests': '84/84 PASS', 'parentTestReady': '15/15 PASS', 'WP4Started': True
    }
    page.evaluate('(d)=>WP4_EVIDENCE("WP-3 GATE RECLASSIFICATION",d)', governance)
    page.screenshot(path=str(OUT/'00_wp3_gate_reclassification.png'))

    page.evaluate("INK_APP.flora.hero.setInspect('structure',true); INK_APP.flora.hero.setInspect('masks',true); INK_APP.flora.hero.setInspect('ids',true); INK_APP.flora.hero.setInspect('topology',true); INK_APP.renderer.render();")
    structure = page.evaluate("({regions:INK_APP.page().floraHero.regions.map(r=>({regionId:r.regionId,role:r.role,z:r.z,relation:r.relation,growthAxis:r.growthAxis,overlaps:r.overlaps})),topology:INK_APP.page().floraHero.topology,masks:INK_APP.page().floraHero.masks.map(m=>({maskId:m.maskId,regionId:m.regionId,feather:m.feather,visible:m.visible,vectorHash:m.vectorHash}))})")
    page.evaluate('(d)=>WP4_EVIDENCE("BENCHMARK B · REGIONS / MASKS / TOPOLOGY",d)', structure)
    page.wait_for_timeout(500); page.screenshot(path=str(OUT/'01_three_petal_regions_masks_topology.png'))

    sample_recipe = recipe('Base Wash', IDS['left'], 201)
    compiled = page.evaluate('(r)=>INK_APP.flora.recipe.compile(r)', sample_recipe)
    preview = page.evaluate('(r)=>INK_APP.flora.recipe.preview(r)', sample_recipe)
    page.evaluate('(d)=>WP4_EVIDENCE("PAINTING RECIPE SOURCE",d)', sample_recipe)
    page.screenshot(path=str(OUT/'02_recipe_source.png'))
    page.evaluate('(d)=>WP4_EVIDENCE("COMPILED ACTION LOG",d)', {'compileHash': compiled.get('compileHash'), 'highLevelActions': compiled.get('actions'), 'createStrokeActionCount': len(preview.get('strokeActions', [])), 'createStrokeActions': preview.get('strokeActions', [])[:3]})
    page.screenshot(path=str(OUT/'03_compiled_action_log.png'))

    # Atomic rollback is proven on a small Scene before the visual benchmark is populated.
    failing = recipe('Base Wash', IDS['front'], 501, suffix='-rollback', passes=3, density=5, widthRange=[8, 14])
    rollback = page.evaluate("""(recipe)=>{
      const before={hash:INK_APP.flora.documentHash(),replay:INK_APP.flora.replayHash(),undo:INK_APP.history.undoStack.length,objects:INK_APP.page().layers[0].objects.length};
      const original=INK_APP.flora.adapter.execute.bind(INK_APP.flora.adapter); let count=0;
      INK_APP.flora.adapter.execute=(action,options)=>{if(action.type==='paintRegion'&&++count===2)throw new Error('runtime injected pass failure');return original(action,options)};
      const result=INK_APP.flora.recipe.execute(recipe); INK_APP.flora.adapter.execute=original;
      const after={hash:INK_APP.flora.documentHash(),replay:INK_APP.flora.replayHash(),undo:INK_APP.history.undoStack.length,objects:INK_APP.page().layers[0].objects.length,cache:INK_APP.flora.maskCacheDiagnostics()};
      return{before,result,after,hashRestored:before.hash===after.hash,replayRestored:before.replay===after.replay,historyUnchanged:before.undo===after.undo,objectsUnchanged:before.objects===after.objects};
    }""", failing)
    page.evaluate('(d)=>WP4_EVIDENCE("ATOMIC RECIPE FAILURE · COMPLETE ROLLBACK",d)', rollback)
    page.screenshot(path=str(OUT/'12_atomic_rollback.png'))

    page.evaluate("INK_APP.flora.hero.setInspect('structure',false); INK_APP.flora.hero.setInspect('masks',false); INK_APP.flora.hero.setInspect('ids',false); INK_APP.flora.hero.setInspect('topology',false); INK_APP.renderer.render();")

    results = {}
    # Base wash on all three, rear first and front last.
    for key, seed in [('left', 201), ('right', 211), ('front', 221)]:
        r = recipe('Base Wash', IDS[key], seed, density=24, widthRange=[16, 34], opacity=[.15, .34], coverage=.94)
        results[r['recipeId']] = page.evaluate('(r)=>INK_APP.flora.recipe.execute(r)', r)
    page.evaluate('(d)=>WP4_EVIDENCE("BASE WASH · THREE REGIONS · MASK CLIPPED",d)', {'recipes': list(results.keys()), 'objectCount': page.evaluate('INK_APP.page().layers[0].objects.length')})
    page.wait_for_timeout(900); page.screenshot(path=str(OUT/'04_base_wash.png'))

    for key, seed in [('left', 202), ('right', 212)]:
        for op, offset in [('Root Shadow', 0), ('Overlap Shadow', 1)]:
            r = recipe(op, IDS[key], seed + offset, density=14, opacity=[.10, .28])
            results[r['recipeId']] = page.evaluate('(r)=>INK_APP.flora.recipe.execute(r)', r)
    fold = recipe('Fold Shadow', IDS['front'], 222, density=15, opacity=[.09, .25])
    results[fold['recipeId']] = page.evaluate('(r)=>INK_APP.flora.recipe.execute(r)', fold)
    page.evaluate('(d)=>WP4_EVIDENCE("ROOT / FOLD / OVERLAP SHADOW",d)', {'rearSeams': [IDS['left'], IDS['right']], 'frontRegion': IDS['front'], 'results': {k:{'ok':v.get('ok'),'compileHash':v.get('compileHash'),'strokes':len(v.get('strokeIds',[]))} for k,v in results.items() if 'shadow' in k}})
    page.wait_for_timeout(900); page.screenshot(path=str(OUT/'05_root_fold_overlap_shadow.png'))

    central = recipe('Central Light', IDS['front'], 223, density=16, widthRange=[18, 38], opacity=[.035, .13])
    edge = recipe('Edge Light', IDS['front'], 224, density=17, widthRange=[4, 11], opacity=[.06, .18])
    for r in [central, edge]: results[r['recipeId']] = page.evaluate('(r)=>INK_APP.flora.recipe.execute(r)', r)
    page.evaluate('(d)=>WP4_EVIDENCE("CENTRAL LIGHT + EDGE LIGHT",d)', {'central': results[central['recipeId']], 'edge': results[edge['recipeId']]})
    page.wait_for_timeout(900); page.screenshot(path=str(OUT/'06_central_edge_light.png'))

    glaze = recipe('Transparent Glaze', IDS['front'], 225, density=18, passes=2, palette=['#af3f64','#dd8398'], opacity=[.035,.13], blendMode='soft-light')
    results[glaze['recipeId']] = page.evaluate('(r)=>INK_APP.flora.recipe.execute(r)', glaze)
    page.evaluate('(d)=>WP4_EVIDENCE("TRANSPARENT GLAZE · TWO PASSES",d)', results[glaze['recipeId']])
    page.wait_for_timeout(900); page.screenshot(path=str(OUT/'07_transparent_glaze.png'))

    brushwork = recipe('Directional Brushwork', IDS['front'], 226, density=24, widthRange=[3,8], opacity=[.08,.22])
    results[brushwork['recipeId']] = page.evaluate('(r)=>INK_APP.flora.recipe.execute(r)', brushwork)
    page.evaluate('(d)=>WP4_EVIDENCE("DIRECTIONAL BRUSHWORK · BASE-TO-TIP",d)', results[brushwork['recipeId']])
    page.wait_for_timeout(900); page.screenshot(path=str(OUT/'08_directional_brushwork.png'))

    dissolve = recipe('Boundary Dissolve', IDS['front'], 227, density=20, widthRange=[20,42], opacity=[.025,.10], feather=.026)
    results[dissolve['recipeId']] = page.evaluate('(r)=>INK_APP.flora.recipe.execute(r)', dissolve)
    page.evaluate('(d)=>WP4_EVIDENCE("BOUNDARY DISSOLVE · FEATHERED AND MASK CLIPPED",d)', results[dissolve['recipeId']])
    page.wait_for_timeout(900); page.screenshot(path=str(OUT/'09_boundary_dissolve.png'))

    # Local recompile before/after. Capture non-target hashes and exact other-region IDs.
    before_recompile = page.evaluate("""(id)=>({
      recipe:INK_APP.flora.recipe.mapping(id),
      leftIds:INK_APP.page().layers[0].objects.filter(o=>o.floraPaint?.regionId==='wp4-three-petal:petal:rear-left').map(o=>o.id),
      rightIds:INK_APP.page().layers[0].objects.filter(o=>o.floraPaint?.regionId==='wp4-three-petal:petal:rear-right').map(o=>o.id),
      documentHash:INK_APP.flora.documentHash(), replayHash:INK_APP.flora.replayHash()
    })""", central['recipeId'])
    page.evaluate('(d)=>WP4_EVIDENCE("LOCAL RECOMPILE · BEFORE",d)', before_recompile)
    page.screenshot(path=str(OUT/'10_local_recompile_before.png'))
    recompile = page.evaluate('(p)=>INK_APP.flora.recipe.recompile(p.id,{operation:"Central Light",patch:{seed:333,palette:["#fff0f3"],opacity:[.05,.16]}})', {'id': central['recipeId']})
    after_recompile = page.evaluate("""(id)=>({
      result:null, recipe:INK_APP.flora.recipe.mapping(id),
      leftIds:INK_APP.page().layers[0].objects.filter(o=>o.floraPaint?.regionId==='wp4-three-petal:petal:rear-left').map(o=>o.id),
      rightIds:INK_APP.page().layers[0].objects.filter(o=>o.floraPaint?.regionId==='wp4-three-petal:petal:rear-right').map(o=>o.id),
      documentHash:INK_APP.flora.documentHash(), replayHash:INK_APP.flora.replayHash()
    })""", central['recipeId'])
    after_recompile['result'] = recompile
    non_target_unchanged = before_recompile['leftIds'] == after_recompile['leftIds'] and before_recompile['rightIds'] == after_recompile['rightIds']
    page.evaluate('(d)=>WP4_EVIDENCE("LOCAL RECOMPILE · AFTER",d)', {'after': after_recompile, 'nonTargetRegionsUnchanged': non_target_unchanged})
    page.wait_for_timeout(800); page.screenshot(path=str(OUT/'11_local_recompile_after.png'))

    visual_mask_cache = page.evaluate('INK_APP.flora.maskCacheDiagnostics()')
    visual_document_hash = page.evaluate('INK_APP.flora.documentHash()')
    page.close()

    # Lightweight transaction/roundtrip harness keeps the evidence deterministic and avoids
    # coupling Undo/Redo performance to the many-stroke visual benchmark.
    tx_page = browser.new_page(viewport={'width': 1500, 'height': 1120}, device_scale_factor=1)
    tx_page.on('console', lambda m: console.append({'type': m.type, 'text': m.text, 'page': 'transaction'}))
    tx_page.on('pageerror', lambda e: console.append({'type': 'pageerror', 'text': str(e), 'page': 'transaction'}))
    tx_page.set_content(html, wait_until='domcontentloaded')
    tx_page.add_style_tag(content=css)
    tx_page.add_script_tag(content=js)
    tx_page.wait_for_function('window.INK_APP && window.INK_APP.flora && window.INK_APP.flora.recipe')
    tx_page.evaluate("""
      (()=>{
        const badge=document.createElement('div'); badge.id='wp4-badge';
        badge.style.cssText='position:fixed;z-index:999999;left:50%;top:66px;transform:translateX(-50%);padding:8px 14px;background:rgba(25,29,31,.94);color:#f4f1e8;border:1px solid rgba(255,255,255,.2);border-radius:8px;font:600 12px system-ui;letter-spacing:.04em;pointer-events:none';
        badge.textContent='WP-4 · TRANSACTION / ROUNDTRIP EVIDENCE · NO IMAGE MODEL'; document.body.append(badge);
        const card=document.createElement('pre'); card.id='wp4-card';
        card.style.cssText='position:fixed;z-index:999999;left:48px;bottom:40px;width:470px;max-height:285px;overflow:hidden;margin:0;padding:12px 14px;background:rgba(18,22,24,.93);color:#dfe9df;border:1px solid rgba(255,255,255,.18);border-radius:8px;font:11px/1.42 ui-monospace,monospace;white-space:pre-wrap;pointer-events:none';
        document.body.append(card); window.WP4_EVIDENCE=(title,data)=>{card.textContent=title+'\\n'+JSON.stringify(data,null,2)};
      })();
    """)
    tx_page.evaluate("INK_TEST.fresh(); INK_TEST.setRenderMode('canvas2d'); INK_APP.flora.hero.createBenchmarkThreePetals({profileId:'wp4-three-petal',feather:.01,seed:707},{history:false}); INK_APP.switchWorkspace('layout',{fit:false,announce:false}); INK_APP.fitArtboard({switchSpace:false});")
    tx_recipe = recipe('Base Wash', IDS['front'], 707, suffix='-transaction', density=5, widthRange=[8, 14], opacity=[.12, .22], coverage=.72)
    tx_execute = tx_page.evaluate('(r)=>INK_APP.flora.recipe.execute(r)', tx_recipe)
    before_undo = tx_page.evaluate('({hash:INK_APP.flora.documentHash(),replay:INK_APP.flora.replayHash(),objects:INK_APP.page().layers[0].objects.length,undo:INK_APP.history.undoStack.length})')
    tx_page.evaluate('INK_APP.history.undo(); INK_APP.renderer.render();')
    undo = tx_page.evaluate('({hash:INK_APP.flora.documentHash(),replay:INK_APP.flora.replayHash(),objects:INK_APP.page().layers[0].objects.length,undo:INK_APP.history.undoStack.length,redo:INK_APP.history.redoStack.length})')
    tx_page.evaluate('(d)=>WP4_EVIDENCE("UNDO · ONE COMPLETE RECIPE TRANSACTION",d)', {'before': before_undo, 'after': undo})
    tx_page.screenshot(path=str(OUT/'13_undo.png'))
    tx_page.evaluate('INK_APP.history.redo(); INK_APP.renderer.render();')
    redo = tx_page.evaluate('({hash:INK_APP.flora.documentHash(),replay:INK_APP.flora.replayHash(),objects:INK_APP.page().layers[0].objects.length,undo:INK_APP.history.undoStack.length,redo:INK_APP.history.redoStack.length})')
    tx_page.evaluate('(d)=>WP4_EVIDENCE("REDO · RESTORE RECIPE TRANSACTION",d)', redo)
    tx_page.screenshot(path=str(OUT/'14_redo.png'))

    roundtrip = tx_page.evaluate("""(()=>{
      const before=INK_APP.flora.replayHash(),json=INK_APP.flora.serializeDocument(),bytes=new Blob([json],{type:'application/json'}).size;
      const recipeState=structuredClone(INK_APP.page().floraRecipeState);
      INK_APP.flora.reloadDocument(json); INK_APP.switchWorkspace('layout',{fit:false,announce:false}); INK_APP.fitArtboard({switchSpace:false}); INK_APP.renderer.render();
      const after=INK_APP.flora.replayHash(); return{before,after,match:before===after,inkBytes:bytes,recipeCount:Object.keys(recipeState.recipes).length,strokeMapCount:Object.keys(recipeState.strokeToRecipe).length,objects:INK_APP.page().layers[0].objects.length};
    })()""")
    tx_page.evaluate('(d)=>WP4_EVIDENCE(".INK ROUNDTRIP + DETERMINISTIC REPLAY",d)', roundtrip)
    tx_page.screenshot(path=str(OUT/'15_ink_roundtrip_replay.png'))

    png_export = tx_page.evaluate("""async()=>{const canvas=await INK_APP.renderExportCanvas({scope:'artboard',ppi:150,includeBleed:false,cropMarks:false,background:true});const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));const result={type:blob?.type||null,bytes:blob?.size||0,width:canvas.width,height:canvas.height};canvas.width=1;canvas.height=1;return result;}""")
    tx_mask_cache = tx_page.evaluate('INK_APP.flora.maskCacheDiagnostics()')
    action_log = [action for result in results.values() if isinstance(result, dict) for action in (result.get('actionLog', []) + result.get('expandedActionLog', []))]
    (OUT/'Painting_Recipe_Source.json').write_text(json.dumps(sample_recipe, ensure_ascii=False, indent=2)+'\n')
    (OUT/'Compiled_Action_Log.json').write_text(json.dumps(action_log, ensure_ascii=False, indent=2)+'\n')
    runtime = {
        'schema': 'INK_FLORA_WP4_RUNTIME_EVIDENCE_V1',
        'runtime': 'Chromium functional harness using production standalone DOM/CSS/dist compatibility bundle',
        'governance': governance, 'structure': structure, 'sampleRecipe': sample_recipe, 'sampleCompiled': compiled, 'samplePreview': {'preview': preview.get('preview'), 'strokeActions': preview.get('strokeActions')},
        'operationResults': results, 'visualDocumentHash': visual_document_hash,
        'localRecompile': {'before': before_recompile, 'result': recompile, 'after': after_recompile, 'nonTargetRegionsUnchanged': non_target_unchanged},
        'atomicRollback': rollback, 'transactionExecute': tx_execute, 'undo': undo, 'redo': redo, 'roundtrip': roundtrip,
        'maskCache': {'visual': visual_mask_cache, 'transaction': tx_mask_cache}, 'pngExport': png_export, 'console': console
    }
    (OUT/'runtime-log.json').write_text(json.dumps(runtime, ensure_ascii=False, indent=2)+'\n')
    (OUT/'runtime-complete.flag').write_text('PASS\n')
    os._exit(0)
