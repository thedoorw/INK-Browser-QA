import json, pathlib, time
from playwright.sync_api import sync_playwright
root=pathlib.Path(__file__).resolve().parents[2]
out=root/'runtime-evidence'; out.mkdir(exist_ok=True)
log=[]
def action(i,t,payload,target=None,seed=4242):
    a={'schemaVersion':'0.1','actionId':i,'type':t,'payload':payload,'seed':seed,'metadata':{'source':'ai','label':i}}
    if target: a['targetId']=target
    return a
with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1440,'height':1000},device_scale_factor=1)
    errors=[]; page.on('pageerror',lambda e:errors.append(str(e)))
    html=(root/'index-standalone.html').read_text(encoding='utf-8').replace('<script src="dist/ink.compat.js"></script>','');page.set_content(html,wait_until='load');page.add_style_tag(content=(root/'styles.css').read_text(encoding='utf-8'));page.add_script_tag(content=(root/'dist/ink.compat.js').read_text(encoding='utf-8'))
    page.wait_for_function('window.INK_APP && window.INK_APP.flora')
    page.screenshot(path=str(out/'01_parent_baseline_start.png'),full_page=True)
    r=page.evaluate("a=>window.INK_APP.flora.dispatch(a)",action('wp1-layer','createLayer',{'name':'FLORA AI Test Layer'})); lid=r['createdId'];log.append(r)
    page.screenshot(path=str(out/'02_ai_layer_created.png'),full_page=True)
    points=[{'x':-180,'y':-40,'p':.25},{'x':-120,'y':-90,'p':.65},{'x':-40,'y':-20,'p':1},{'x':50,'y':-75,'p':.72},{'x':140,'y':-5,'p':.3}]
    r=page.evaluate("a=>window.INK_APP.flora.dispatch(a)",action('wp1-stroke','createStroke',{'layerId':lid,'brushPreset':'brush','color':'#7a365f','size':32,'opacity':.82,'wetness':.55,'flow':.72,'points':points})); oid=r['createdId'];log.append(r)
    page.screenshot(path=str(out/'03_fixed_seed_test_stroke.png'),full_page=True)
    for a in [action('wp1-opacity','setLayerOpacity',{'opacity':.65},lid),action('wp1-hide','setLayerVisibility',{'visible':False},lid),action('wp1-show','setLayerVisibility',{'visible':True},lid)]: log.append(page.evaluate("a=>window.INK_APP.flora.dispatch(a)",a))
    page.evaluate("document.querySelector('[data-inspector-tab=history]')?.click()")
    page.screenshot(path=str(out/'04_history_transaction.png'),full_page=True)
    invalid=action('wp1-invalid','createStroke',{'layerId':'missing-layer','brushPreset':'brush','color':'#000000','points':[]})
    before=page.evaluate('window.INK_APP.flora.documentHash()'); ir=page.evaluate("a=>window.INK_APP.flora.dispatch(a)",invalid); after=page.evaluate('window.INK_APP.flora.documentHash()');log.append({'invalid':ir,'before':before,'after':after})
    page.evaluate('while(window.INK_APP.history.undo()){}')
    page.screenshot(path=str(out/'05_undo_to_blank.png'),full_page=True)
    page.evaluate('while(window.INK_APP.history.redo()){}')
    page.screenshot(path=str(out/'06_redo_complete.png'),full_page=True)
    saved=page.evaluate('window.INK_APP.flora.serializeDocument()'); replay1=page.evaluate('window.INK_APP.flora.replayHash()')
    (out/'wp1_roundtrip.ink').write_text(saved,encoding='utf-8')
    replay2=page.evaluate('s=>window.INK_APP.flora.reloadDocument(s)',saved)
    replay_after=page.evaluate('window.INK_APP.flora.replayHash()')
    page.screenshot(path=str(out/'07_ink_reloaded.png'),full_page=True)
    png=page.evaluate("async()=>{const b=await window.INK_APP.exportPNG({scope:'viewport',scale:1,background:true});return {size:b.size,type:b.type}}")
    state=page.evaluate('''()=>({layers:window.INK_APP.page().layers.map(l=>({id:l.id,name:l.name,visible:l.visible,opacity:l.opacity,objects:l.objects.map(o=>({id:o.id,type:o.type,flora:o.flora||null}))})),history:window.INK_APP.history.stats(),replayHash:window.INK_APP.flora.replayHash()})''')
    log.append({'roundtrip':{'replayBefore':replay1,'reloadDocumentHash':replay2,'replayAfter':replay_after,'same':replay1==replay_after},'png':png,'state':state,'pageErrors':errors})
    browser.close()
(out/'runtime-log.json').write_text(json.dumps(log,ensure_ascii=False,indent=2),encoding='utf-8')
assert not errors, errors
assert before==after
assert replay1==replay_after
assert png['type']=='image/png' and png['size']>0
print(json.dumps({'PASS':True,'layerId':lid,'objectId':oid,'replayHash':replay1,'png':png},ensure_ascii=False))
