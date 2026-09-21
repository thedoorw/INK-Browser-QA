#!/usr/bin/env python3
from pathlib import Path
import base64, hashlib, json, re, socket, subprocess, time, urllib.request
import websocket

ROOT=Path(__file__).resolve().parents[2]
ENTRY=ROOT/'RA0_9_AI_Review_Mode_Candidate.html'
OUT=ROOT/'qa/evidence/ai_review_mode/visual_browser'
OUT.mkdir(parents=True,exist_ok=True)

def free_port():
    with socket.socket() as s: s.bind(('127.0.0.1',0)); return s.getsockname()[1]
def data_url(path):
    mime='image/png'; return f'data:{mime};base64,'+base64.b64encode(path.read_bytes()).decode('ascii')
def inline_entry():
    html=ENTRY.read_text(encoding='utf-8')
    css=(ROOT/'ui/ai_review_mode.css').read_text(encoding='utf-8')
    html=html.replace('<link rel="stylesheet" href="ui/ai_review_mode.css"/>','<style>'+css+'</style>')
    pattern=re.compile(r'<script src="([^"]+)"></script>')
    def repl(m):
        rel=m.group(1)
        if rel=='visual_test_assets/asset_manifest.js':
            obj=json.loads((ROOT/'visual_test_assets/asset_manifest.json').read_text(encoding='utf-8'))
            manifest={'version':'1.0','classification':'TEST_ONLY_NON_AUTHORITATIVE','cases':{}}
            for cid in ['PL-015','PL-036']:
                manifest['cases'][cid]={'reference':data_url(ROOT/f'visual_test_assets/{cid}/reference.png'),'runtime':data_url(ROOT/f'visual_test_assets/{cid}/runtime.png'),'logicalWidth':1002,'logicalHeight':1421,'provenance':'visual_test_assets/asset_manifest.json'}
            return '<script>window.RA_AI_VISUAL_TEST_ASSETS=Object.freeze('+json.dumps(manifest,separators=(',',':'))+');</script>'
        p=ROOT/rel
        if not p.is_file(): return f'<script>console.warn("Missing inlined source: {rel}")</script>'
        return '<script>\n'+p.read_text(encoding='utf-8').replace('</script>','<\\/script>')+'\n</script>'
    return pattern.sub(repl,html)
class CDP:
    def __init__(self,url): self.ws=websocket.create_connection(url,timeout=30,origin='http://127.0.0.1'); self.seq=0; self.events=[]
    def call(self,method,params=None):
        self.seq+=1; ident=self.seq; self.ws.send(json.dumps({'id':ident,'method':method,'params':params or {}}))
        while True:
            msg=json.loads(self.ws.recv())
            if msg.get('id')==ident:return msg
            self.events.append(msg)
    def eval(self,expr):
        r=self.call('Runtime.evaluate',{'expression':expr,'returnByValue':True,'awaitPromise':True})['result']['result']
        if r.get('subtype')=='error': raise RuntimeError(r.get('description'))
        return r.get('value')
    def shot(self,name):
        r=self.call('Page.captureScreenshot',{'format':'png','captureBeyondViewport':False})
        p=OUT/name; p.write_bytes(base64.b64decode(r['result']['data'])); return p.relative_to(ROOT).as_posix()
    def close(self): self.ws.close()
def wait_json(url,timeout=15):
    end=time.time()+timeout; last=None
    while time.time()<end:
        try:
            with urllib.request.urlopen(url,timeout=1) as r:return json.load(r)
        except Exception as e:last=e;time.sleep(.2)
    raise RuntimeError(last)
def wait(cdp,expr,timeout=15):
    end=time.time()+timeout
    while time.time()<end:
        if cdp.eval(expr): return True
        time.sleep(.2)
    return False
def select_case(cdp,cid):
    return cdp.eval(f"(()=>{{const i=window.RAWorkbenchBridge.state.cases.findIndex(c=>c.id==='{cid}');if(i<0)return false;const s=document.querySelector('#caseSelect');s.value=String(i);s.dispatchEvent(new Event('change',{{bubbles:true}}));return true;}})()")
def mode(cdp,name):
    return cdp.eval(f"(()=>{{const b=document.querySelector('[data-ra-visual-mode=\"{name}\"]');b.click();return b.classList.contains('active');}})()")
def main():
    port=free_port(); profile=OUT/'profile'; import shutil; shutil.rmtree(profile,ignore_errors=True)
    cmd=['chromium','--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--remote-allow-origins=*',f'--remote-debugging-port={port}',f'--user-data-dir={profile}','about:blank']
    proc=subprocess.Popen(cmd,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE,text=True)
    report={'kind':'ra0.9-ai-review-mode-real-visual-browser-test','version':'1.0','status':'BROWSER_VISUAL_UNVERIFIED','checks':{},'screenshots':{},'exceptions':[],'cases':['PL-015','PL-036']}
    try:
        ver=wait_json(f'http://127.0.0.1:{port}/json/version'); pages=wait_json(f'http://127.0.0.1:{port}/json/list')
        report['browserVersion']=ver.get('Browser'); c=CDP(pages[0]['webSocketDebuggerUrl'])
        c.call('Runtime.enable');c.call('Page.enable');c.call('Log.enable');c.call('Emulation.setDeviceMetricsOverride',{'width':1600,'height':1000,'deviceScaleFactor':1,'mobile':False})
        frame=c.call('Page.getFrameTree')['result']['frameTree']['frame']['id'];c.call('Page.setDocumentContent',{'frameId':frame,'html':inline_entry()})
        if not wait(c,"typeof window.RA_AI_ACTIONS==='object'"): raise RuntimeError('RA_AI_ACTIONS not initialized')
        checks=report['checks']; shots=report['screenshots']
        checks['enterMode']=c.eval("document.body.classList.contains('ra-ai-review-active')")
        shots['fullScreen']=c.shot('FULL_SCREEN.png')
        snapshots={}
        for cid in ['PL-015','PL-036']:
            checks[f'{cid}.selectCase']=select_case(c,cid); time.sleep(.7)
            checks[f'{cid}.assetsLoaded']=wait(c,"document.querySelector('#aiVisualStatus')?.dataset.raState==='ASSETS_LOADED'")
            state=json.loads(c.eval('JSON.stringify(window.RA_AI_TASK_STATE)'))
            checks[f'{cid}.taskStateCase']=state['caseId']==cid
            checks[f'{cid}.assetPaths']=c.eval("document.querySelector('#aiRefCrop').dataset.raAssetPath.startsWith('data:image/png') && document.querySelector('#aiRunCrop').dataset.raAssetPath.startsWith('data:image/png')")
            checks[f'{cid}.sharedCropBounds']=c.eval("document.querySelector('#aiRefCrop').dataset.raTargetBounds===document.querySelector('#aiRunCrop').dataset.raTargetBounds")
            checks[f'{cid}.targetIdOnBoth']=c.eval("document.querySelector('#aiRefCrop').dataset.raTargetId===window.RA_AI_TASK_STATE.targetId && document.querySelector('#aiRunCrop').dataset.raTargetId===window.RA_AI_TASK_STATE.targetId")
            checks[f'{cid}.thumbnailMainSameReference']=c.eval("document.querySelector('#aiRefThumb').dataset.raAssetPath===document.querySelector('#aiRefCrop').dataset.raAssetPath")
            view0=c.eval("document.querySelector('#aiRefCrop').dataset.raView")
            c.eval("document.querySelector('#aiRefCrop').dispatchEvent(new WheelEvent('wheel',{deltaY:-100,bubbles:true,cancelable:true}))");time.sleep(.25)
            view1=c.eval("document.querySelector('#aiRefCrop').dataset.raView")
            checks[f'{cid}.synchronizedZoom']=view1!=view0 and view1==c.eval("document.querySelector('#aiRunCrop').dataset.raView")
            rect=c.eval("(()=>{const r=document.querySelector('#aiRefCrop').getBoundingClientRect();return {x:r.left+100,y:r.top+100};})()")
            c.call('Input.dispatchMouseEvent',{'type':'mousePressed','x':rect['x'],'y':rect['y'],'button':'left','buttons':1,'clickCount':1})
            c.call('Input.dispatchMouseEvent',{'type':'mouseMoved','x':rect['x']+25,'y':rect['y']+18,'button':'left','buttons':1})
            c.call('Input.dispatchMouseEvent',{'type':'mouseReleased','x':rect['x']+25,'y':rect['y']+18,'button':'left','buttons':0,'clickCount':1});time.sleep(.25)
            view2=c.eval("document.querySelector('#aiRefCrop').dataset.raView")
            checks[f'{cid}.synchronizedPan']=view2!=view1 and view2==c.eval("document.querySelector('#aiRunCrop').dataset.raView")
            c.eval("document.querySelector('[data-ra-visual-action=\"fit\"]').click()");time.sleep(.2)
            snapshots[cid]=c.eval("JSON.stringify({cases:window.RAWorkbenchBridge.state.cases,queue:window.RAAIReviewQueueWorkspace?.exportState(window.RA_AI_TASK_STATE.caseId),task:window.RA_AI_TASK_STATE,formal:document.querySelector('#formalStatus')?.textContent,caseDigest:window.RASemanticCompiler.digest(window.RAWorkbenchBridge.currentCase())})")
            first=state['targetId']; nr=c.eval('window.RA_AI_ACTIONS.nextTarget()'); time.sleep(.3); second=json.loads(c.eval('JSON.stringify(window.RA_AI_TASK_STATE)'))['targetId']
            checks[f'{cid}.nextTargetCropUpdates']=bool(nr.get('ok')) and first!=second and c.eval("document.querySelector('#aiRefCrop').dataset.raTargetId===window.RA_AI_TASK_STATE.targetId")
            pr=c.eval('window.RA_AI_ACTIONS.previousTarget()'); time.sleep(.3)
            checks[f'{cid}.previousTarget']=bool(pr.get('ok')) and json.loads(c.eval('JSON.stringify(window.RA_AI_TASK_STATE)'))['targetId']==first
            after=c.eval("JSON.stringify({cases:window.RAWorkbenchBridge.state.cases,queue:window.RAAIReviewQueueWorkspace?.exportState(window.RA_AI_TASK_STATE.caseId),task:{caseId:window.RA_AI_TASK_STATE.caseId,targetId:window.RA_AI_TASK_STATE.targetId},formal:document.querySelector('#formalStatus')?.textContent,caseDigest:window.RASemanticCompiler.digest(window.RAWorkbenchBridge.currentCase())})")
            before=json.loads(snapshots[cid]); aft=json.loads(after)
            checks[f'{cid}.navigationDataIntegrity']=before['cases']==aft['cases'] and before['queue']==aft['queue'] and before['formal']==aft['formal'] and before['caseDigest']==aft['caseDigest']
            checks[f'{cid}.rawBoundaryEvidenceOnly']=c.eval("document.querySelector('#aiRawBoundaryDetails').innerText.includes('Evidence only') && document.querySelector('#aiRawBoundaryDetails').innerText.includes('Not formal geometry')")
            checks[f'{cid}.rawBoundaryDefaultCollapsed']=not c.eval("document.querySelector('#aiRawBoundaryDetails').open")
            checks[f'{cid}.sideBySide']=mode(c,'side-by-side');time.sleep(.25)
            if cid=='PL-015': shots['acceptedSideBySide']=c.shot('PL-015_SIDE_BY_SIDE.png')
            checks[f'{cid}.overlay']=mode(c,'overlay');time.sleep(.25)
            if cid=='PL-015': shots['acceptedOverlay']=c.shot('PL-015_OVERLAY.png')
            checks[f'{cid}.difference']=mode(c,'difference');time.sleep(.25)
            if cid=='PL-015': shots['acceptedDifference']=c.shot('PL-015_DIFFERENCE.png')
            else: shots['diagnosticDifference']=c.shot('PL-036_DIFFERENCE.png')
            checks[f'{cid}.wipe']=mode(c,'wipe');c.eval("document.querySelector('#aiWipeRange').value='37';document.querySelector('#aiWipeRange').dispatchEvent(new Event('input',{bubbles:true}))");time.sleep(.25)
            checks[f'{cid}.wipeValue']=c.eval("document.querySelector('#aiWipeRange').value==='37'")
            if cid=='PL-015': shots['acceptedWipe']=c.shot('PL-015_WIPE.png')
            if cid=='PL-036':
                checks['PL-036.blockingSpecific']=c.eval("document.querySelector('[data-ra-region=\"blocking-reason-summary\"]').innerText.includes('Compound offset continuity renderer not implemented')")
                shots['diagnosticBlockingSummary']=c.shot('PL-036_BLOCKING_SUMMARY.png')
        # Missing asset behavior with unprovisioned PL-055.
        checks['missingAssetCaseSelect']=select_case(c,'PL-055');time.sleep(.7)
        checks['missingAssetExplicitError']=c.eval("document.querySelector('#aiVisualStatus').dataset.raState==='ASSET_ERROR' && document.querySelector('#aiVisualStatus').innerText.includes('ASSET_LOAD_FAILED')")
        # Return to accepted and test mode exit/enter without mutation.
        select_case(c,'PL-015');time.sleep(.5); baseline=c.eval('JSON.stringify(window.RAWorkbenchBridge.state.cases)')
        checks['exitMode']=c.eval('window.RA_AI_ACTIONS.exitReviewMode().ok') and c.eval("!document.body.classList.contains('ra-ai-review-active')")
        checks['enterModeAgain']=c.eval('window.RA_AI_ACTIONS.enterReviewMode().ok') and c.eval("document.body.classList.contains('ra-ai-review-active')")
        checks['modeToggleDataIntegrity']=baseline==c.eval('JSON.stringify(window.RAWorkbenchBridge.state.cases)')
        exceptions=[]
        for e in c.events:
            if e.get('method')=='Runtime.exceptionThrown': exceptions.append(e.get('params',{}).get('exceptionDetails',{}).get('text','Runtime exception'))
        report['exceptions']=exceptions;checks['noRuntimeExceptions']=not exceptions
        failed=[k for k,v in checks.items() if v is not True];report['failures']=failed
        report['visualAssetState']='VERIFIED_REAL_ASSETS' if not failed else 'FAILED'
        report['status']='PASS_VISUAL_BROWSER' if not failed else 'FAIL'
        c.close()
    except Exception as e: report['error']=str(e)
    finally:
        proc.terminate()
        try:proc.wait(timeout=5)
        except:proc.kill()
        shutil.rmtree(profile,ignore_errors=True)
    (OUT/'BROWSER_VISUAL_TEST_REPORT.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False,indent=2))
    return 0 if report['status']=='PASS_VISUAL_BROWSER' else 1
if __name__=='__main__': raise SystemExit(main())
