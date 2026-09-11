import asyncio, json
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]
REPORT = {
    "version": "0.8.3", "checks": [], "errors": [], "metrics": {},
    "limitations": [
        "Browser navigation to HTTP, HTTPS and file origins is blocked by the test container administrator; runtime regression uses the exact standalone DOM, CSS and generated compatibility bundle through page.set_content.",
        "The container Chromium build may expose neither WebGL nor WebGL2. When unavailable, this run validates the deterministic Canvas multi-channel reference backend and automatic fallback rather than successful MRT shader execution.",
        "Service Worker installation, CacheStorage and IndexedDB primary backend require final validation on an unrestricted secure or localhost origin.",
        "No physical Apple Pencil, S Pen or Windows Pen is attached to the container; device calibration regression uses synthetic PointerEvent-shaped samples and validates the calibration pipeline rather than device-specific hardware behavior.",
        "Only the bundled Chromium runtime is exercised here; Firefox, Safari, Edge, normal-origin WebGL2 and physical-pen validation remain external release gates."
    ]
}

def inline_app():
    html = (ROOT / 'index-standalone.html').read_text(encoding='utf-8')
    css = (ROOT / 'styles.css').read_text(encoding='utf-8')
    js = (ROOT / 'dist/ink.compat.js').read_text(encoding='utf-8').replace('</script>', '<\\/script>')
    html = html.replace('<link rel="stylesheet" href="styles.css">', f'<style>{css}</style>')
    html = html.replace('<script src="dist/ink.compat.js"></script>', f'<script>{js}</script>')
    return html

APP_HTML = inline_app()

def check(name, passed, details=None):
    REPORT['checks'].append({'name': name, 'passed': bool(passed), 'details': details})
    if not passed:
        raise AssertionError(f'{name}: {details}')

async def load(page):
    await page.set_content(APP_HTML, wait_until='load')
    await page.wait_for_function('window.INK_TEST && INK_TEST.version === "0.8.3"')

async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(
            headless=True, executable_path='/usr/bin/chromium',
            args=['--no-sandbox', '--enable-webgl', '--ignore-gpu-blocklist']
        )
        page = await browser.new_page(viewport={'width': 1440, 'height': 960}, device_scale_factor=1)
        page.on('pageerror', lambda exc: REPORT['errors'].append(str(exc)))
        page.on('console', lambda msg: REPORT['errors'].append(f'console:{msg.type}:{msg.text}') if msg.type == 'error' else None)
        await load(page)

        check('Standalone app loads', await page.evaluate('Boolean(INK_TEST && INK_APP)'))
        check('Runtime version 0.8.3', await page.evaluate('INK_TEST.version === "0.8.3"'))
        architecture = await page.evaluate('INK_TEST.architecture()')
        expected_modules = ['dual-workspace', 'layout-model-viewport', 'fullscreen-shell', 'layer-drag-reorder', 'a4-artboard', 'pdf-output', 'live-canvas-tile-renderer', 'paper-profile', 'multi-channel-ink', 'natural-media-mrt', 'gpu-resource-budget', 'dirty-region', 'persistent-tile-atlas-core', 'resumable-tiled-export', 'pen-calibration', 'canvas2d-multichannel', 'document-integrity', 'runtime-health', 'external-diagnostics', 'service-worker-update', 'storage-v3-checkpointed', 'history-target-scoped-id-aware', 'history-panel-step-navigation']
        check('Release candidate modules registered', all(name in architecture['modules'] for name in expected_modules), architecture['modules'])

        history_stats = architecture['history']
        check('History reports target-scoped capture mode', history_stats['mode'] == 'hybrid-target-scoped-id-aware-patches' and history_stats['limit'] == 30, history_stats)
        check('History panel and 20 30 50 limit control exist', await page.locator('[data-tab="history"], #historyList, #historyLimit option[value="20"], #historyLimit option[value="30"], #historyLimit option[value="50"]').count() == 5)
        await page.evaluate('INK_TEST.fresh(); INK_TEST.app.history.pushScoped("歷史 A",[["title"]],()=>INK_TEST.app.doc.title="A"); INK_TEST.app.history.pushScoped("歷史 B",[["title"]],()=>INK_TEST.app.doc.title="B"); INK_TEST.app.history.pushScoped("歷史 C",[["title"]],()=>INK_TEST.app.doc.title="C"); INK_TEST.app.toggleInspector(true,"history"); INK_TEST.app.updateHistoryUI()')
        check('History panel lists retained steps and current state', await page.locator('#historyList .history-step').count() == 4 and await page.locator('#historyList .history-step.current').get_attribute('data-history-position') == '3')
        jumped_history = await page.evaluate('INK_TEST.jumpHistory(1); ({title:INK_TEST.app.doc.title,timeline:INK_TEST.historyTimeline()})')
        check('Click-style history navigation restores the selected transaction', jumped_history['title'] == 'A' and jumped_history['timeline']['applied'] == 1 and len(jumped_history['timeline']['entries']) == 3, jumped_history)
        history_limit = await page.evaluate('INK_TEST.setHistoryLimit(20)')
        check('History limit can be changed to 20 and persisted in UI', history_limit == 20 and await page.locator('#historyLimit').input_value() == '20')
        await page.evaluate('INK_TEST.setHistoryLimit(30); INK_TEST.fresh()')
        atlas = await page.evaluate('INK_TEST.createTileAtlas(2048,1536,1)')
        check('Persistent tile atlas core exposes bounded diagnostics', atlas['tiles'] > 1 and atlas['dirty'] == atlas['tiles'] and atlas['budget']['budgetBytes'] > 0, atlas)
        await page.evaluate('INK_TEST.switchWorkspace("layout"); INK_TEST.app.fitArtboard(); INK_TEST.app.renderer.render()')
        await page.wait_for_timeout(450)
        live_tiles = await page.evaluate('INK_TEST.liveTiles()')
        check('Live Canvas tile renderer is integrated and bounded', live_tiles['atlas'] is not None and live_tiles['atlas']['budget']['budgetBytes'] > 0 and live_tiles['atlas']['tiles'] >= 1, live_tiles)
        diagnostics = await page.evaluate('INK_TEST.externalDiagnostics()')
        check('External diagnostic bundle is generated', diagnostics['schema'] == 'INK_EXTERNAL_DIAGNOSTIC_BUNDLE_V1' and diagnostics['version'] == '0.8.3', {'schema':diagnostics.get('schema'),'version':diagnostics.get('version')})
        check('Format Version remains 4', architecture['formatVersion'] == 4, architecture)
        await page.evaluate('INK_TEST.fresh()')
        workspace = await page.evaluate('INK_TEST.workspace()')
        check('Dual workspace defaults to full creation space', workspace['activeSpace'] == 'creation' and workspace['showLayoutFrameInCreation'] is False and workspace['layoutViewport'] == {'x':0,'y':0,'scale':1,'rotation':0}, workspace)
        check('Creation space has no A4 overlay control', await page.locator('#showLayoutFrameInCreation').count() == 0)
        await page.evaluate('INK_TEST.app.page().camera.x=-145; INK_TEST.app.page().camera.scale=1.45')
        switched_layout = await page.evaluate('INK_TEST.switchWorkspace("layout"); INK_TEST.app.page().camera.x=77; INK_TEST.app.page().camera.scale=.8; INK_TEST.workspace()')
        check('Layout space activates without duplicating document objects', switched_layout['activeSpace'] == 'layout', switched_layout)
        restored_creation = await page.evaluate('INK_TEST.switchWorkspace("creation"); ({workspace:INK_TEST.workspace(),camera:{...INK_TEST.app.page().camera}})')
        check('Creation camera is restored independently', abs(restored_creation['camera']['x']+145)<1e-6 and abs(restored_creation['camera']['scale']-1.45)<1e-6, restored_creation)
        restored_layout = await page.evaluate('INK_TEST.switchWorkspace("layout"); ({workspace:INK_TEST.workspace(),camera:{...INK_TEST.app.page().camera}})')
        check('Layout camera is restored independently', abs(restored_layout['camera']['x']-77)<1e-6 and abs(restored_layout['camera']['scale']-.8)<1e-6, restored_layout)
        artboard = await page.evaluate('INK_TEST.artboard()')
        check('Default layout is fixed A4 portrait at 300 PPI', artboard['mode'] == 'fixed' and artboard['preset'] == 'A4' and artboard['orientation'] == 'portrait' and artboard['widthMm'] == 210 and artboard['heightMm'] == 297 and artboard['ppi'] == 300, artboard)
        check('A4 300 PPI output is exactly 2480 × 3508 pixels', artboard['pixels']['width'] == 2480 and artboard['pixels']['height'] == 3508, artboard['pixels'])
        landscape = await page.evaluate('INK_TEST.setArtboard({orientation:"landscape",widthMm:297,heightMm:210,bleedMm:3})')
        check('A4 landscape and 3 mm bleed are stored in the document', landscape['orientation'] == 'landscape' and landscape['widthMm'] == 297 and landscape['heightMm'] == 210 and landscape['bleedMm'] == 3, landscape)
        geometry = await page.evaluate('INK_TEST.exportGeometry({ppi:300,includeBleed:true,cropMarks:true})')
        check('Artboard export geometry includes bleed and crop-mark margin', abs(geometry['widthMm'] - 315) < .01 and abs(geometry['heightMm'] - 228) < .01 and geometry['width'] > 3508 and geometry['height'] > 2480, {'width':geometry['width'],'height':geometry['height'],'widthMm':geometry['widthMm'],'heightMm':geometry['heightMm']})
        await page.evaluate('INK_TEST.setArtboard({orientation:"portrait",widthMm:210,heightMm:297,bleedMm:0})')
        check('Dual-space switch, viewport, A4 and PDF/print controls exist', await page.locator('#workspaceSwitch, #layoutViewportScale, #layoutViewportX, #layoutViewportY, #fitViewportContentBtn, #artboardOrientation, #artboardPpi, #artboardBleed, #artboardSafeMargin, #exportFormat option[value="pdf"], #exportFormat option[value="print"]').count() == 11)
        a4_export = await page.evaluate('INK_TEST.renderA4Export(300)')
        check('A4 300 PPI export uses the resumable tiled path', a4_export['width'] == 2480 and a4_export['height'] == 3508 and a4_export['tiled'] is True and a4_export['job']['state'] == 'completed', a4_export)
        pdf_info = await page.evaluate('INK_TEST.pdfInfo(150)')
        check('PDF output has a valid PDF header and MIME type', pdf_info['type'] == 'application/pdf' and pdf_info['header'].startswith('%PDF-1.4') and pdf_info['size'] > 1000, pdf_info)
        await page.evaluate('INK_TEST.fresh(); INK_TEST.addDemo()')
        original_matrix = await page.evaluate('JSON.stringify(INK_TEST.app.page().layers[0].objects[0].matrix)')
        fitted_viewport = await page.evaluate('INK_TEST.fitLayoutViewport()')
        check('CAD-like layout viewport fits model content without changing original objects', fitted_viewport['scale'] > 0 and fitted_viewport['scale'] != 1 and await page.evaluate('JSON.stringify(INK_TEST.app.page().layers[0].objects[0].matrix)') == original_matrix, fitted_viewport)
        layout_svg = await page.evaluate('INK_TEST.app.exportSVG({scope:"artboard",background:true})')
        check('A4 SVG export applies the layout viewport transform', 'matrix(' in layout_svg and 'artboardClip' in layout_svg, layout_svg[:240])
        await page.locator('#workspaceMenuToggle').click()
        check('Workspace list button opens a functional menu', await page.locator('#workspaceMenu').is_visible() and await page.locator('[data-workspace-command]').count() >= 5)
        await page.locator('[data-workspace-command="creation"]').click()
        check('Workspace menu command changes active space', await page.evaluate('INK_TEST.workspace().activeSpace === "creation"'))

        check('Fullscreen control is available in the desktop top bar', await page.locator('#fullscreenToggle').count() == 1 and (await page.locator('#fullscreenToggle').get_attribute('aria-label')) == '進入全螢幕')
        fullscreen_support = await page.evaluate('INK_TEST.fullscreen()')
        check('Fullscreen shell reports browser capability', fullscreen_support['supported'] is True, fullscreen_support)
        await page.locator('#fullscreenToggle').click()
        await page.wait_for_timeout(180)
        fullscreen_active = await page.evaluate('INK_TEST.fullscreen()')
        check('Fullscreen button enters application fullscreen', fullscreen_active['active'] is True and await page.locator('#fullscreenToggle').get_attribute('aria-pressed') == 'true', fullscreen_active)
        await page.locator('#fullscreenToggle').click()
        await page.wait_for_timeout(180)
        check('Fullscreen button exits application fullscreen', await page.evaluate('INK_TEST.fullscreen().active === false') and await page.locator('#fullscreenToggle').get_attribute('aria-pressed') == 'false')

        await page.evaluate('INK_TEST.fresh(); INK_TEST.app.addLayer(); INK_TEST.app.addLayer(); const p=INK_TEST.app.page(); p.layers[0].name="底層"; p.layers[1].name="中層"; p.layers[2].name="頂層"; INK_TEST.app.toggleInspector(true,"layers"); INK_TEST.app.refreshLayers()')
        check('Layer panel uses a dedicated lower toolbar', await page.locator('.layer-bottom-toolbar #addLayerBtn, .layer-bottom-toolbar #duplicateLayerBtn, .layer-bottom-toolbar #deleteLayerBtn').count() == 3)
        check('Legacy layer up/down controls are removed', await page.locator('#layerUpBtn, #layerDownBtn, #layerMenuBtn').count() == 0)
        check('Every layer row exposes drag reordering', await page.locator('.layer-row[draggable="true"] .layer-drag-handle').count() == 3)
        layer_ids = await page.evaluate('INK_TEST.app.page().layers.map(layer=>layer.id)')
        reordered = await page.evaluate('(ids)=>{const ok=INK_TEST.reorderLayer(ids[0],ids[2],"before"); return {ok,display:INK_TEST.app.page().layers.map(layer=>layer.id).reverse()};}', layer_ids)
        check('Layer drag reorder changes display order without duplicating layers', reordered['ok'] is True and reordered['display'][0] == layer_ids[0] and len(set(reordered['display'])) == 3, reordered)
        header_buttons = await page.locator('#inspectorSizeToggle, #closeInspector').evaluate_all('(els)=>els.map(el=>{const r=el.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height}})')
        no_overlap = len(header_buttons) == 2 and header_buttons[0]['x'] + header_buttons[0]['w'] <= header_buttons[1]['x'] + .5 and abs(header_buttons[0]['y']-header_buttons[1]['y']) < 1
        check('Inspector width and close buttons no longer overlap', no_overlap, header_buttons)
        layer_type = await page.locator('.layer-row .layer-name strong').first.evaluate('(el)=>parseFloat(getComputedStyle(el).fontSize)')
        inspector_type = await page.locator('.inspector-tab').first.evaluate('(el)=>parseFloat(getComputedStyle(el).fontSize)')
        check('Inspector and layer typography aligns with professional desktop panels', layer_type >= 10.5 and inspector_type >= 10, {'layer':layer_type,'tab':inspector_type})
        await page.evaluate('INK_TEST.app.toggleInspector(false)')
        await page.wait_for_timeout(240)
        quick_color_box = await page.locator('#quickColorInput').bounding_box()
        check('Quick color input is anchored inside the visible left control', quick_color_box is not None and quick_color_box['x'] >= 0 and quick_color_box['y'] >= 0 and quick_color_box['x'] + quick_color_box['width'] <= 1440 and quick_color_box['y'] + quick_color_box['height'] <= 960, quick_color_box)
        inspector_edge = await page.locator('#inspectorEdgeToggle').evaluate('(el)=>{const s=getComputedStyle(el);return{border:s.borderColor,background:s.backgroundColor,transform:s.transform}}')
        check('Inspector edge hover style has no white seam translation', '255, 255, 255' not in inspector_edge['border'] and inspector_edge['transform'] in ['none','matrix(1, 0, 0, 1, 0, 0)'], inspector_edge)
        close_button = await page.locator('#closeInspector').evaluate('(el)=>({title:el.title,aria:el.getAttribute("aria-label"),svgs:el.querySelectorAll("svg").length})')
        check('Inspector has one unambiguous close control', close_button['title'] == '關閉檢查器' and close_button['aria'] == '關閉檢查器' and close_button['svgs'] == 1, close_button)
        settings_icon = await page.locator('#i-settings').evaluate('(el)=>({viewBox:el.getAttribute("viewBox"),circle:[el.querySelector("circle")?.getAttribute("cx"),el.querySelector("circle")?.getAttribute("cy")]})')
        check('Canvas settings icon is optically centered', settings_icon['viewBox'] == '0 0 24 24' and settings_icon['circle'] == ['12','12'], settings_icon)
        await page.evaluate('document.querySelector("#canvasSettings").hidden=false')
        panel_type = await page.locator('#canvasSettings').evaluate('(el)=>{const label=getComputedStyle(el.querySelector(".control-row > span"));const heading=getComputedStyle(el.querySelector(".subpanel-title strong"));return{label:parseFloat(label.fontSize),heading:parseFloat(heading.fontSize)}}')
        check('Canvas settings typography meets professional panel readability', panel_type['label'] >= 11 and panel_type['heading'] >= 11, panel_type)
        eraser_metrics = await page.evaluate('INK_TEST.app.toolSettings[INK_TEST.app.lastDrawTool].size=60; INK_TEST.switchWorkspace("creation"); INK_TEST.app.page().camera.scale=1.75; INK_TEST.eraserMetrics()')
        check('Eraser cursor and hit radius share one scale contract', abs(eraser_metrics['radiusScreen'] - eraser_metrics['radiusWorld'] * eraser_metrics['screenScale']) < 1e-9 and abs(eraser_metrics['diameterWorld'] - 54) < 1e-9, eraser_metrics)
        check('Smart Inspector starts closed', not await page.locator('#app').evaluate('(el)=>el.classList.contains("inspector-open")'))
        check('No fixed tool wheel returns', await page.locator('.tool-wheel, .radial-tool-wheel').count() == 0)
        check('Unified desktop tool stack remains', await page.locator('#drawToolButton').count() == 1)
        check('Release health controls exist', await page.locator('#releaseHealthBtn, #releaseHealthStatus, #downloadDiagnosticsBtn, #checkUpdateBtn, #activateUpdateBtn, #updateStatus').count() == 6)
        integrity = await page.evaluate('INK_TEST.documentIntegrity()')
        check('Current document passes integrity and fingerprint checks', integrity['passed'] is True and integrity['fingerprint'].startswith('fnv1a32:'), integrity)
        runtime_health = await page.evaluate('INK_TEST.runtimeHealth()')
        check('Runtime health monitor is attached', runtime_health['attached'] is True and runtime_health['status'] in ['pass','warn'], runtime_health)

        initial_paper = await page.evaluate('INK_TEST.paperProfile()')
        check('Paper profile defaults are present', all(key in initial_paper for key in ['absorbency','roughness','fiberStrength','fiberAngle','sizing','granulation','textureVisible']), initial_paper)
        changed_paper = await page.evaluate('INK_TEST.setPaperProfile({absorbency:.73,roughness:.61,fiberStrength:.49,fiberAngle:22,sizing:.17,granulation:.55})')
        check('Paper profile mutation is reflected in document', abs(changed_paper['absorbency']-.73)<1e-6 and changed_paper['fiberAngle']==22, changed_paper)
        check('Paper material controls exist', await page.locator('#paperAbsorbency, #paperFiberAngle, #paperGranulation').count() == 3)

        check('Pen calibration controls exist', await page.locator('#penPressureMin, #penPressureMax, #penPressureGamma, #penPressureSmoothing, #penTiltSensitivity, #penUsePredicted, #penPalmRejection').count() == 7)
        pen_profile = await page.evaluate('INK_TEST.setPenProfile({pressureMin:.08,pressureMax:.92,pressureGamma:1.4,pressureSmoothing:.2,tiltSensitivity:1.15,usePredictedEvents:true,palmRejection:true})')
        check('Pen profile mutation is normalized and retained', abs(pen_profile['pressureMin']-.08)<1e-6 and abs(pen_profile['pressureMax']-.92)<1e-6 and abs(pen_profile['pressureGamma']-1.4)<1e-6 and pen_profile['usePredictedEvents'] is True, pen_profile)
        pen_sample = await page.evaluate('INK_TEST.simulatePenSample({pressure:.62,tiltX:32,tiltY:-18,twist:45})')
        check('Synthetic pen sample exposes calibrated pressure and orientation', 0 < pen_sample['pressure'] <= 1 and 0 <= pen_sample['altitude'] <= 90 and 0 <= pen_sample['azimuth'] < 360 and pen_sample['twist'] == 45, pen_sample)
        pen_diag = await page.evaluate('INK_TEST.penCalibration()')
        check('Pen diagnostics record latency and sample counts', pen_diag['penSamples'] >= 1 and 'p95Ms' in pen_diag['latency'], pen_diag)
        tile_plan = await page.evaluate('INK_TEST.tilePlan(5000,3000,2)')
        check('Tiled export plan covers exact 10k × 6k output', tile_plan['width'] == 10000 and tile_plan['height'] == 6000 and len(tile_plan['tiles']) > 1, {'width':tile_plan['width'],'height':tile_plan['height'],'tiles':len(tile_plan['tiles'])})
        check('8× export scale is exposed', await page.locator('#exportScale option[value="8"]').count() == 1)
        storage_health = await page.evaluate('INK_TEST.storageHealth()')
        check('Storage V3 probe verifies checksum and checkpoint policy', storage_health['storage']['ok'] is True and storage_health['storage']['verified'] is True and storage_health['storage']['checkpointLimit'] == 3, storage_health)
        release_health = await page.evaluate('INK_TEST.releaseHealth()')
        check('Release health check passes available environment gates', release_health['pass'] is True and release_health['integrity']['passed'] is True and release_health['storage']['verified'] is True, release_health)
        update_status = await page.evaluate('INK_TEST.updateStatus()')
        check('Update manager exposes a deterministic state', update_status['state'] in ['idle','unsupported','ready','registering','error'], update_status)
        REPORT['metrics']['releaseHealth'] = release_health

        showcase = await page.evaluate('INK_TEST.addWetInteractionShowcase()')
        check('Wet interaction showcase creates contiguous wet strokes', showcase['objects'] == 2, showcase)
        await page.evaluate('INK_TEST.app.setTool("brush"); INK_TEST.app.toggleInspector(true,"brush"); INK_TEST.app.renderer.render(); INK_TEST.app.refreshRenderEngineUI()')
        await page.wait_for_timeout(350)
        after = await page.evaluate('INK_TEST.renderEngine()')
        if after['multiChannelWebgl']['available']:
            check('GPU MRT backend produces a multi-channel run when available', after['multiChannelWebgl']['runs'] > 0 and after['activeBackend'] == 'webgl2-multichannel', after)
        else:
            check('Unavailable MRT automatically uses Canvas multi-channel reference', after['multiChannelCanvas2d']['runs'] > 0 and after['activeBackend'] in ['canvas2d-multichannel','canvas2d'], after)
        check('Natural media engine card is visible for brush', await page.locator('#renderEngineCard').is_visible())
        check('Engine status badge has explicit state', (await page.locator('#renderEngineStatus').text_content()) in ['GPU ACTIVE', 'FALLBACK', 'CANVAS', 'GPU 中斷'])
        REPORT['metrics']['renderEngine'] = after
        check('GPU resource diagnostics are exposed', 'resources' in after['webgl'] and 'resources' in after['multiChannelWebgl'], {'single':after['webgl'].get('resources'),'multi':after['multiChannelWebgl'].get('resources')})
        gpu_validation = await page.evaluate('INK_TEST.gpuValidation()')
        check('GPU validation returns structured single and MRT results without crashing', isinstance(gpu_validation, dict) and 'passed' in gpu_validation and 'single' in gpu_validation and 'multi' in gpu_validation, gpu_validation)
        if after['multiChannelWebgl']['available']:
            check('GPU self-check passes when WebGL2 MRT is available', gpu_validation['passed'] is True, gpu_validation)
        else:
            check('GPU self-check fails closed with unavailable-state diagnostics', gpu_validation['passed'] is False and (gpu_validation['single'].get('error') or gpu_validation['multi'].get('error')), gpu_validation)
        REPORT['metrics']['gpuValidation'] = gpu_validation
        REPORT['metrics']['penCalibration'] = pen_diag
        REPORT['metrics']['tilePlan'] = {'width':tile_plan['width'],'height':tile_plan['height'],'tiles':len(tile_plan['tiles'])}

        canvas_mode = await page.evaluate('INK_TEST.setRenderMode("canvas2d")')
        check('Manual Canvas mode is deterministic', canvas_mode['preference'] == 'canvas2d', canvas_mode)
        await page.evaluate('INK_TEST.app.renderer.render()')
        canvas_after = await page.evaluate('INK_TEST.renderEngine()')
        check('Canvas multi-channel run remains active in Canvas mode', canvas_after['multiChannelCanvas2d']['runs'] > 0, canvas_after)
        auto_mode = await page.evaluate('INK_TEST.setRenderMode("auto")')
        check('Automatic mode can be restored', auto_mode['preference'] == 'auto', auto_mode)

        await page.evaluate('INK_TEST.addEditableStroke(); INK_TEST.enterStrokeEdit(); INK_TEST.selectStrokeSegment(1,.5); INK_TEST.insertStrokeNode(); INK_TEST.selectStrokeNode(2); INK_TEST.setStrokeNodeMode("symmetric")')
        check('v2.5 precision stroke editing remains operational', await page.evaluate('INK_TEST.app.editableStroke().object.points.length === 6'))
        svg = await page.evaluate('INK_TEST.exportSVG()')
        check('SVG export remains operational', '<svg' in svg and '<polygon' in svg, svg[:180])

        await page.evaluate('INK_TEST.addWetInteractionShowcase(); INK_TEST.app.setTool("brush"); INK_TEST.app.toggleInspector(true,"brush"); INK_TEST.app.fitContent(); INK_TEST.app.renderer.render(); INK_TEST.app.refreshRenderEngineUI()')
        await page.locator('#renderEngineCard').scroll_into_view_if_needed()
        await page.evaluate('INK_TEST.app.renderer.render(); INK_TEST.app.refreshRenderEngineUI()')
        await page.wait_for_timeout(500)
        visible_ink = await page.evaluate("""(()=>{const c=INK_TEST.app.el.canvas,ctx=c.getContext('2d'),d=ctx.getImageData(0,0,c.width,c.height).data;let count=0;for(let y=0;y<c.height;y+=4)for(let x=100;x<Math.min(c.width-300,1140);x+=4){const i=(y*c.width+x)*4;if(d[i]+d[i+1]+d[i+2]<650)count++;}return count;})()""")
        check('Desktop showcase contains visible multi-channel ink', visible_ink > 1000, visible_ink)
        desktop_layout = await page.evaluate('({vw:innerWidth,vh:innerHeight,sw:document.documentElement.scrollWidth,sh:document.documentElement.scrollHeight})')
        check('Desktop document has no page overflow', desktop_layout['sw'] == desktop_layout['vw'] and desktop_layout['sh'] == desktop_layout['vh'], desktop_layout)
        REPORT['metrics']['desktopLayout'] = desktop_layout
        await page.evaluate('INK_TEST.switchWorkspace("layout"); INK_TEST.fitLayoutViewport(); INK_TEST.app.fitArtboard(); INK_TEST.app.toggleInspector(false); document.querySelector("#canvasSettings").hidden=false; INK_TEST.app.refreshArtboardUI(); INK_TEST.app.renderer.render()')
        await page.wait_for_timeout(220)
        await page.screenshot(path=str(ROOT / 'tests/desktop-layout-viewport-v0.8.3-p3.png'))
        await page.evaluate('INK_TEST.switchWorkspace("creation"); INK_TEST.app.fitContent(); INK_TEST.app.renderer.render()')
        await page.wait_for_timeout(180)
        await page.screenshot(path=str(ROOT / 'tests/desktop-creation-space-v0.8.3-p3.png'))
        await page.evaluate('document.querySelector("#canvasSettings").hidden=true; INK_TEST.fresh(); INK_TEST.app.addLayer(); INK_TEST.app.addLayer(); const p=INK_TEST.app.page(); p.layers[0].name="底稿"; p.layers[1].name="墨線"; p.layers[2].name="上色"; INK_TEST.app.toggleInspector(true,"layers"); INK_TEST.app.refreshLayers(); INK_TEST.app.renderer.render()')
        await page.wait_for_timeout(160)
        await page.screenshot(path=str(ROOT / 'tests/desktop-layer-workflow-v0.8.3-p3.png'))
        await page.evaluate('INK_TEST.app.history.pushScoped("新增測試筆畫",[INK_TEST.app.layerObjectsPath()],()=>INK_TEST.app.layer().objects.push({id:"history-demo",type:"shape",shape:"ellipse",matrix:[1,0,0,1,90,80],opacity:1,color:"#2f8179",fillColor:"#2f8179",fill:true,size:2,w:120,h:70})); INK_TEST.app.history.pushScoped("調整圖層透明度",[INK_TEST.app.layerPath()],()=>INK_TEST.app.layer().opacity=.72); INK_TEST.app.toggleInspector(true,"history"); INK_TEST.app.updateHistoryUI(); INK_TEST.app.renderer.render()')
        await page.wait_for_timeout(120)
        await page.screenshot(path=str(ROOT / 'tests/desktop-history-panel-v0.8.3-p3.png'))
        await page.evaluate('INK_TEST.switchWorkspace("layout"); INK_TEST.app.fitArtboard(); INK_TEST.app.renderer.render()')

        mobile = await browser.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=1)
        mobile.on('pageerror', lambda exc: REPORT['errors'].append(f'mobile:{exc}'))
        mobile.on('console', lambda msg: REPORT['errors'].append(f'mobile-console:{msg.type}:{msg.text}') if msg.type == 'error' else None)
        await load(mobile)
        mobile_colors = await mobile.evaluate('(()=>{const top=getComputedStyle(document.querySelector(".topbar")).backgroundColor,dock=getComputedStyle(document.querySelector(".mobile-dock")).backgroundColor,body=getComputedStyle(document.body).backgroundColor;return{top,dock,body};})()')
        check('Mobile uses the same dark studio chrome family as desktop', mobile_colors['body'] in ['rgb(35, 36, 38)','rgba(0, 0, 0, 0)'] and '255, 255, 255' not in mobile_colors['dock'], mobile_colors)
        check('Mobile dual-space switch is visible', await mobile.locator('#workspaceSwitch').is_visible())
        check('Mobile defaults to creation space', await mobile.evaluate('INK_TEST.workspace().activeSpace === "creation"'))
        check('Mobile dock visible', await mobile.locator('.mobile-dock').is_visible())
        check('Desktop toolbar hidden on mobile', not await mobile.locator('.desktop-toolbar').is_visible())
        await mobile.evaluate('INK_TEST.addWetInteractionShowcase(); INK_TEST.app.setTool("brush"); INK_TEST.app.fitContent(); INK_TEST.app.refreshRenderEngineUI()')
        await mobile.locator('#inspectorToggle').click()
        await mobile.wait_for_timeout(300)
        check('Mobile Bottom Sheet exposes media engine', await mobile.locator('#renderEngineCard').is_visible())
        check('Mobile runtime includes pen calibration controls', await mobile.locator('#penPressureGamma, #penTiltSensitivity, #penPalmRejection').count() == 3)
        await mobile.locator('#renderEngineCard').scroll_into_view_if_needed()
        await mobile.wait_for_timeout(180)
        mobile_layout = await mobile.evaluate('({vw:innerWidth,vh:innerHeight,sw:document.documentElement.scrollWidth,sh:document.documentElement.scrollHeight})')
        check('Mobile document has no page overflow', mobile_layout['sw'] == mobile_layout['vw'] and mobile_layout['sh'] == mobile_layout['vh'], mobile_layout)
        REPORT['metrics']['mobileLayout'] = mobile_layout
        await mobile.evaluate('INK_TEST.app.toggleInspector(false); INK_TEST.switchWorkspace("creation"); INK_TEST.app.fitContent(); INK_TEST.app.renderer.render()')
        await mobile.wait_for_timeout(180)
        await mobile.screenshot(path=str(ROOT / 'tests/mobile-creation-space-v0.8.3-p3.png'))

        check('Generated compatibility bundle reports ESM architecture', await page.evaluate('INK_ARCHITECTURE.moduleMode === "ESM"'))
        check('Runtime errors are zero', len(REPORT['errors']) == 0, REPORT['errors'])
        await browser.close()

if __name__ == '__main__':
    try:
        asyncio.run(main()); REPORT['passed'] = True
    except Exception as exc:
        REPORT['passed'] = False; REPORT['fatal'] = repr(exc)
    (ROOT / 'tests/runtime-report-v0.8.json').write_text(json.dumps(REPORT, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps(REPORT, ensure_ascii=False, indent=2))
    raise SystemExit(0 if REPORT.get('passed') else 1)
