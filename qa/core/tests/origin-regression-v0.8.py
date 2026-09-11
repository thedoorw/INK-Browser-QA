import asyncio, json, threading
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from functools import partial
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]
REPORT = {"version":"0.8.3","checks":[],"errors":[],"passed":False}

def check(name, passed, details=None):
    REPORT["checks"].append({"name":name,"passed":bool(passed),"details":details})
    if not passed:
        raise AssertionError(f"{name}: {details}")

async def run():
    handler = partial(SimpleHTTPRequestHandler, directory=str(ROOT))
    server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    port = server.server_address[1]
    try:
        async with async_playwright() as pw:
            browser = await pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox','--enable-webgl','--ignore-gpu-blocklist'])
            context = await browser.new_context()
            page = await context.new_page()
            page.on('pageerror', lambda exc: REPORT['errors'].append(str(exc)))
            page.on('console', lambda msg: REPORT['errors'].append(f'console:{msg.type}:{msg.text}') if msg.type == 'error' else None)
            url = f'http://127.0.0.1:{port}/index.html?fresh=1'
            await page.goto(url, wait_until='networkidle')
            await page.wait_for_function('window.INK_TEST && INK_TEST.version === "0.8.3"')
            check('Normal localhost HTTP origin loads modular application', await page.evaluate('Boolean(INK_TEST && INK_ARCHITECTURE.moduleMode === "ESM")'), url)
            env = await page.evaluate('({origin:location.origin,secure:isSecureContext,sw:"serviceWorker" in navigator,idb:"indexedDB" in window,cache:"caches" in window})')
            check('Localhost is treated as a secure context with required storage APIs', env['secure'] and env['sw'] and env['idb'] and env['cache'], env)
            idb = await page.evaluate('''async()=>{
              const name='ink-origin-regression-v083';
              const db=await new Promise((resolve,reject)=>{const req=indexedDB.open(name,1);req.onupgradeneeded=()=>req.result.createObjectStore('records');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});
              await new Promise((resolve,reject)=>{const tx=db.transaction('records','readwrite');tx.objectStore('records').put({value:'verified'},'probe');tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});
              const value=await new Promise((resolve,reject)=>{const tx=db.transaction('records');const req=tx.objectStore('records').get('probe');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});
              db.close();indexedDB.deleteDatabase(name);return value;
            }''')
            check('IndexedDB primary path writes and reads verified data', idb and idb.get('value') == 'verified', idb)
            cache = await page.evaluate('''async()=>{
              const name='ink-origin-regression-v083';const cache=await caches.open(name);const request=new Request(location.origin+'/__ink_cache_probe__');await cache.put(request,new Response('verified',{headers:{'content-type':'text/plain'}}));const match=await cache.match(request);const text=match?await match.text():null;await caches.delete(name);return{text};
            }''')
            check('CacheStorage writes, matches and removes a response', cache.get('text') == 'verified', cache)
            sw = await page.evaluate('''async()=>{
              const registration=await navigator.serviceWorker.register('./service-worker.js');
              await navigator.serviceWorker.ready;
              const active=registration.active||registration.waiting||registration.installing;
              return{scope:registration.scope,state:active?.state||null,controlled:Boolean(navigator.serviceWorker.controller)};
            }''')
            check('Service Worker installs and reaches an active state on normal origin', sw.get('state') in ['activated','activating','installed'], sw)
            await page.reload(wait_until='networkidle')
            await page.wait_for_function('window.INK_TEST && INK_TEST.version === "0.8.3"')
            controlled = await page.evaluate('Boolean(navigator.serviceWorker.controller)')
            check('Service Worker controls the application after reload', controlled, controlled)
            storage = await page.evaluate('INK_TEST.storageHealth()')
            check('Application storage health uses a verified persistent backend', storage['storage']['ok'] and storage['storage']['verified'] and storage['storage']['backend'] == 'indexeddb', storage['storage'])
            check('Origin runtime errors are zero', len(REPORT['errors']) == 0, REPORT['errors'])
            await context.close(); await browser.close()
    finally:
        server.shutdown(); server.server_close()

if __name__ == '__main__':
    try:
        asyncio.run(run()); REPORT['passed']=True
    except Exception as exc:
        REPORT['fatal']=repr(exc)
    (ROOT/'tests/origin-validation-v0.8.json').write_text(json.dumps(REPORT,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps(REPORT,ensure_ascii=False,indent=2))
    raise SystemExit(0 if REPORT.get('passed') else 1)
