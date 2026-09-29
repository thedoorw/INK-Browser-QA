import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, mkdtemp, rm, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const TARGET_SHA = process.env.INK_TARGET_SHA || '';
assert.match(TARGET_SHA, /^[a-f0-9]{40}$/, 'Exact target SHA required');

const mime = {
  '.html':'text/html; charset=utf-8',
  '.js':'text/javascript; charset=utf-8',
  '.mjs':'text/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8',
  '.svg':'image/svg+xml',
  '.png':'image/png',
  '.jpg':'image/jpeg',
  '.jpeg':'image/jpeg',
  '.json':'application/json',
  '.webmanifest':'application/manifest+json',
  '.wasm':'application/wasm'
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');

function findBrowser() {
  const candidates = [process.env.INK_CHROMIUM_PATH, process.env.CHROME_PATH];
  for (const base of [process.env.ProgramFiles, process.env['ProgramFiles(x86)'], process.env.LOCALAPPDATA].filter(Boolean)) {
    candidates.push(path.join(base, 'Google/Chrome/Application/chrome.exe'));
    candidates.push(path.join(base, 'Microsoft/Edge/Application/msedge.exe'));
  }
  const found = candidates.find(file => file && existsSync(file));
  if (!found) throw new Error('Installed Chrome/Edge required; set INK_CHROMIUM_PATH');
  return found;
}

async function startServer(root) {
  const site = path.join(root, 'product/source');
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://127.0.0.1');
      res.setHeader('Cache-Control', 'no-store');
      if (!['GET','HEAD'].includes(req.method)) {
        res.writeHead(405).end();
        return;
      }
      const decoded = decodeURIComponent(url.pathname);
      if (decoded.includes('\\') || decoded.includes('\0')) {
        res.writeHead(403).end();
        return;
      }
      const dest = path.resolve(site, '.' + (decoded === '/' ? '/index.html' : decoded));
      if (!dest.startsWith(site + path.sep)) {
        res.writeHead(403).end();
        return;
      }
      if (!(await stat(dest)).isFile()) {
        res.writeHead(404).end();
        return;
      }
      const bytes = await readFile(dest);
      res.setHeader('Content-Type', mime[path.extname(dest)] || 'application/octet-stream');
      res.writeHead(200).end(req.method === 'HEAD' ? undefined : bytes);
    } catch (error) {
      res.writeHead(error.code === 'ENOENT' ? 404 : 400).end('Request failed');
    }
  });
  server.requestTimeout = 15000;
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  return { server, origin:'http://127.0.0.1:' + server.address().port };
}

function createCdpPipe(child) {
  const input = child.stdio[3];
  const output = child.stdio[4];
  assert.ok(input && input.writable && output && output.readable, 'CDP pipe unavailable');
  let nextId = 1;
  let buffer = Buffer.alloc(0);
  const pending = new Map();

  const rejectAll = error => {
    for (const entry of pending.values()) {
      clearTimeout(entry.timer);
      entry.reject(error);
    }
    pending.clear();
  };

  output.on('data', chunk => {
    buffer = Buffer.concat([buffer, chunk]);
    while (true) {
      const boundary = buffer.indexOf(0);
      if (boundary < 0) break;
      const raw = buffer.subarray(0, boundary).toString('utf8');
      buffer = buffer.subarray(boundary + 1);
      if (!raw) continue;
      let message;
      try { message = JSON.parse(raw); }
      catch (error) { rejectAll(error); continue; }
      if (!message.id) continue;
      const entry = pending.get(message.id);
      if (!entry) continue;
      pending.delete(message.id);
      clearTimeout(entry.timer);
      if (message.error) entry.reject(new Error(entry.method + ': ' + message.error.message));
      else entry.resolve(message.result || {});
    }
  });
  output.once('error', rejectAll);
  output.once('close', () => rejectAll(new Error('CDP pipe closed')));
  child.once('error', rejectAll);

  const send = (method, params = {}, sessionId = null, timeoutMs = 20000) => new Promise((resolve, reject) => {
    const id = nextId++;
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(new Error('CDP timeout: ' + method));
    }, timeoutMs);
    pending.set(id, { method, resolve, reject, timer });
    const message = { id, method, params };
    if (sessionId) message.sessionId = sessionId;
    input.write(JSON.stringify(message) + '\0');
  });
  return { send };
}

async function stopBrowser(child) {
  if (!child || !child.pid) return;
  if (process.platform === 'win32') {
    const killer = spawn(path.join(process.env.SystemRoot, 'System32/taskkill.exe'), ['/PID', String(child.pid), '/T', '/F'], {
      shell:false, windowsHide:true, stdio:'ignore'
    });
    await new Promise(resolve => {
      killer.once('error', resolve);
      killer.once('exit', resolve);
    });
  } else if (child.exitCode === null && child.signalCode === null) {
    child.kill('SIGKILL');
    await once(child, 'exit');
  }
}

async function newTarget(cdp, width, height, scriptEnabled = true) {
  const created = await cdp.send('Target.createTarget', { url:'about:blank' });
  const attached = await cdp.send('Target.attachToTarget', { targetId:created.targetId, flatten:true });
  const sessionId = attached.sessionId;
  await cdp.send('Page.enable', {}, sessionId);
  await cdp.send('DOM.enable', {}, sessionId);
  await cdp.send('CSS.enable', {}, sessionId);
  await cdp.send('Runtime.enable', {}, sessionId);
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width, height, deviceScaleFactor:1, mobile:false
  }, sessionId);
  if (!scriptEnabled) await cdp.send('Emulation.setScriptExecutionDisabled', { value:true }, sessionId);
  return { targetId:created.targetId, sessionId };
}

async function evaluate(cdp, sessionId, expression, timeoutMs = 20000) {
  const result = await cdp.send('Runtime.evaluate', {
    expression,
    returnByValue:true,
    awaitPromise:true
  }, sessionId, timeoutMs);
  if (result.exceptionDetails) throw new Error('Runtime.evaluate failed: ' + JSON.stringify(result.exceptionDetails));
  return result.result ? result.result.value : undefined;
}

async function waitRuntime(cdp, sessionId, expectedUrl) {
  const started = Date.now();
  let last = null;
  while (Date.now() - started < 30000) {
    try {
      last = await evaluate(cdp, sessionId,
        "(()=>({href:location.href,ready:document.readyState,app:Boolean(window.INK_APP),shell:Boolean(window.INK_WEB_SHELL)}))()");
      if (last && last.href === expectedUrl && last.ready === 'complete' && last.app && last.shell) return last;
    } catch {}
    await sleep(100);
  }
  throw new Error('Runtime readiness timeout: ' + JSON.stringify(last));
}

async function waitStyled(cdp, sessionId) {
  const started = Date.now();
  let last = null;
  while (Date.now() - started < 15000) {
    try {
      const doc = await cdp.send('DOM.getDocument', { depth:1, pierce:false }, sessionId);
      const rootId = doc.root && doc.root.nodeId;
      if (rootId) {
        const q = await cdp.send('DOM.querySelector', { nodeId:rootId, selector:'#app' }, sessionId);
        if (q.nodeId) {
          const matched = await cdp.send('CSS.getMatchedStylesForNode', { nodeId:q.nodeId }, sessionId);
          const computed = await cdp.send('CSS.getComputedStyleForNode', { nodeId:q.nodeId }, sessionId);
          last = {
            nodeId:q.nodeId,
            matchedRules:Array.isArray(matched.matchedCSSRules) ? matched.matchedCSSRules.length : 0,
            computed:Object.fromEntries((computed.computedStyle || []).map(item => [item.name, item.value]))
          };
          if (last.matchedRules > 0 && last.computed.display !== 'none') return last;
        }
      }
    } catch (error) {
      last = { retry:String(error && error.message ? error.message : error) };
    }
    await sleep(100);
  }
  throw new Error('Styled shell readiness timeout: ' + JSON.stringify(last));
}

async function navigate(cdp, sessionId, url) {
  const nav = await cdp.send('Page.navigate', { url }, sessionId, 20000);
  if (nav.errorText) throw new Error('Navigation failed: ' + nav.errorText);
}

async function capture(cdp, sessionId, evidenceDir, name, width, height) {
  const shot = await cdp.send('Page.captureScreenshot', {
    format:'png', fromSurface:true, captureBeyondViewport:false
  }, sessionId, 30000);
  const bytes = Buffer.from(shot.data, 'base64');
  assert.ok(bytes.length > 45, 'PNG bytes required');
  assert.ok(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])), 'PNG signature');
  assert.equal(bytes.readUInt32BE(16), width, 'PNG width');
  assert.equal(bytes.readUInt32BE(20), height, 'PNG height');
  const file = name + '.png';
  await writeFile(path.join(evidenceDir, file), bytes);
  return { file, width, height, bytes:bytes.length, sha256:hash(bytes) };
}

function rgbTuple(text) {
  const match = String(text || '').match(/rgba?\(([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
  return match ? match.slice(1,4).map(Number) : null;
}

function isDarkBlack(text) {
  const rgb = rgbTuple(text);
  return Boolean(rgb && rgb[0] < 24 && rgb[1] < 24 && rgb[2] < 24);
}

async function rect(cdp, sessionId, selector) {
  return evaluate(cdp, sessionId,
    "(()=>{const e=document.querySelector(" + JSON.stringify(selector) + ");if(!e)return null;const r=e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom,display:getComputedStyle(e).display,visibility:getComputedStyle(e).visibility,hidden:Boolean(e.hidden)}})()");
}

async function moveMouse(cdp, sessionId, x, y) {
  await cdp.send('Input.dispatchMouseEvent', { type:'mouseMoved', x, y }, sessionId);
  await sleep(80);
}

async function clickPoint(cdp, sessionId, x, y) {
  await cdp.send('Input.dispatchMouseEvent', { type:'mousePressed', x, y, button:'left', clickCount:1 }, sessionId);
  await cdp.send('Input.dispatchMouseEvent', { type:'mouseReleased', x, y, button:'left', clickCount:1 }, sessionId);
  await sleep(120);
}

async function browserViewportEvidence(cdp, width, height, origin, evidenceDir, report) {
  const viewport = { width, height, dpr:1, checks:[], captures:[], facts:{} };
  const add = (name, pass, detail) => {
    viewport.checks.push({ name, pass:Boolean(pass), detail });
    if (!pass) report.failures.push(width + 'x' + height + ' ' + name);
  };

  const first = await newTarget(cdp, width, height, false);
  await navigate(cdp, first.sessionId, origin + '/?fresh=1');
  const styled = await waitStyled(cdp, first.sessionId);
  viewport.captures.push(await capture(cdp, first.sessionId, evidenceDir, 'first-paint-' + width + 'x' + height, width, height));
  const firstBg = styled.computed['background-color'] || '';
  viewport.facts.firstPaint = { appBackground:firstBg, matchedRules:styled.matchedRules };
  add('first-paint-light-shell', !isDarkBlack(firstBg), viewport.facts.firstPaint);
  await cdp.send('Target.closeTarget', { targetId:first.targetId });

  const normal = await newTarget(cdp, width, height, true);
  const url = origin + '/?fresh=1';
  await navigate(cdp, normal.sessionId, url);
  await waitRuntime(cdp, normal.sessionId, url);
  const device = await evaluate(cdp, normal.sessionId, "(()=>({dpr:devicePixelRatio,w:innerWidth,h:innerHeight,ready:document.readyState}))()");
  viewport.facts.device = device;
  add('viewport-and-dpr', device && device.w === width && device.h === height && device.dpr === 1, device);

  const shell = await evaluate(cdp, normal.sessionId,
    "(()=>{const st=INK_WEB_SHELL.state();const pick=s=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect(),c=getComputedStyle(e);return{x:r.x,y:r.y,w:r.width,h:r.height,display:c.display,visibility:c.visibility}};return{state:st,app:pick('#app'),tool:pick('.tool-rail'),status:pick('#documentStatusStrip'),doc:pick('.document-shell-chrome'),tab:pick('.document-tab-band'),overflow:{html:document.documentElement.scrollWidth,body:document.body.scrollWidth,inner:innerWidth}}})()");
  viewport.facts.normalShell = shell;
  add('normal-first-runtime-state', shell && shell.state && shell.state.collapsed === true && shell.state.layoutMode !== 'COMPACT', shell);
  add('status-and-document-chrome-visible', shell && shell.status && shell.status.w > 0 && shell.status.h > 0 && shell.doc && shell.doc.w > 0 && shell.doc.h > 0 && shell.tab && shell.tab.w > 0, shell);
  add('no-shell-horizontal-overflow', shell && shell.overflow && shell.overflow.html <= width + 1 && shell.overflow.body <= width + 1, shell && shell.overflow);
  viewport.captures.push(await capture(cdp, normal.sessionId, evidenceDir, 'normal-' + width + 'x' + height, width, height));

  const cascade = await evaluate(cdp, normal.sessionId,
    "(()=>{const one=(s,p)=>{const e=document.querySelector(s);return e?getComputedStyle(e)[p]:null};const many=[...document.querySelectorAll('.tool-rail .tool-label')].map(e=>getComputedStyle(e).display);return{toolLabels:many,emptyMark:one('.empty-hint .empty-mark','display'),statusGap:one('.document-status-info','gap'),brushHead:one('.brush-family-head','display')}})()");
  viewport.facts.cascade = cascade;
  add('tool-labels-remain-hidden-without-important', cascade && cascade.toolLabels.length > 0 && cascade.toolLabels.every(x => x === 'none'), cascade);
  add('status-gap-cascade', cascade && cascade.statusGap === '8px', cascade);

  await evaluate(cdp, normal.sessionId, "document.querySelector('#drawToolButton').click()");
  await sleep(120);
  const flyout = await evaluate(cdp, normal.sessionId,
    "(()=>{const p=document.querySelector('#brushFamilyPopover'),h=document.querySelector('.brush-family-head'),b=p&&p.querySelector('[data-subtool]');const r=p&&p.getBoundingClientRect();return{hidden:p&&p.hidden,aria:document.querySelector('#drawToolButton').getAttribute('aria-expanded'),rect:r&&{w:r.width,h:r.height,x:r.x,y:r.y},headDisplay:h&&getComputedStyle(h).display,subtoolDisplay:b&&getComputedStyle(b).display}})()");
  viewport.facts.flyout = flyout;
  add('brush-flyout-visible-and-heading-hidden', flyout && flyout.hidden === false && flyout.aria === 'true' && flyout.rect && flyout.rect.w > 0 && flyout.rect.h > 0 && flyout.headDisplay === 'none' && flyout.subtoolDisplay !== 'none', flyout);
  viewport.captures.push(await capture(cdp, normal.sessionId, evidenceDir, 'brush-flyout-' + width + 'x' + height, width, height));
  await evaluate(cdp, normal.sessionId, "window.INK_APP.toggleBrushFamilyPopover(false)");

  await evaluate(cdp, normal.sessionId, "window.INK_WEB_SHELL.open('layers')");
  await sleep(180);
  const expanded = await evaluate(cdp, normal.sessionId,
    "(()=>{const st=INK_WEB_SHELL.state(),p=document.querySelector('#inspector'),f=document.querySelector('#shellPanelStackFramework');const pr=p.getBoundingClientRect(),fr=f.getBoundingClientRect();return{state:st,panel:{x:pr.x,y:pr.y,w:pr.width,h:pr.height},framework:{hidden:f.hidden,x:fr.x,y:fr.y,w:fr.width,h:fr.height},regions:f.querySelectorAll('.panel-stack-region').length,splitters:f.querySelectorAll('.panel-stack-splitter').length,section:[...document.querySelectorAll('.shell-panel-section')].map(e=>({padding:getComputedStyle(e).padding,overflow:getComputedStyle(e).overflow,display:getComputedStyle(e).display})).slice(0,8)}})()");
  viewport.facts.expanded = expanded;
  add('expanded-panel-visible', expanded && expanded.state.activePanel === 'layers' && expanded.panel.w >= 244 && expanded.panel.w <= 420 && expanded.framework.hidden === false && expanded.framework.w > 0, expanded);
  add('stacking-framework-present', expanded && expanded.regions === 4 && expanded.splitters === 3, expanded);
  add('panel-section-cascade-without-important', expanded && expanded.section.some(x => x.padding === '0px' && x.overflow === 'hidden'), expanded && expanded.section);
  viewport.captures.push(await capture(cdp, normal.sessionId, evidenceDir, 'expanded-layers-' + width + 'x' + height, width, height));

  const splitterBefore = await evaluate(cdp, normal.sessionId,
    "(()=>{const s=document.querySelector('.panel-stack-splitter');const a=s.previousElementSibling,b=s.nextElementSibling,rs=s.getBoundingClientRect(),ra=a.getBoundingClientRect(),rb=b.getBoundingClientRect();return{split:{x:rs.x+rs.width/2,y:rs.y+rs.height/2},a:ra.height,b:rb.height}})()");
  if (splitterBefore && splitterBefore.split) {
    const x = splitterBefore.split.x, y = splitterBefore.split.y;
    await cdp.send('Input.dispatchMouseEvent', { type:'mouseMoved', x, y }, normal.sessionId);
    await cdp.send('Input.dispatchMouseEvent', { type:'mousePressed', x, y, button:'left', clickCount:1 }, normal.sessionId);
    await cdp.send('Input.dispatchMouseEvent', { type:'mouseMoved', x, y:y + 24, button:'left', buttons:1 }, normal.sessionId);
    await cdp.send('Input.dispatchMouseEvent', { type:'mouseReleased', x, y:y + 24, button:'left', clickCount:1 }, normal.sessionId);
    await sleep(120);
  }
  const splitterAfter = await evaluate(cdp, normal.sessionId,
    "(()=>{const s=document.querySelector('.panel-stack-splitter');const a=s.previousElementSibling,b=s.nextElementSibling;return{a:a.getBoundingClientRect().height,b:b.getBoundingClientRect().height,resizing:document.querySelector('#shellPanelStackFramework').classList.contains('stack-resizing'),cursor:getComputedStyle(s).cursor}})()");
  viewport.facts.splitter = { before:splitterBefore, after:splitterAfter };
  add('splitter-drag-interaction', splitterBefore && splitterAfter && splitterAfter.cursor === 'ns-resize' && splitterAfter.resizing === false && (Math.abs(splitterAfter.a - splitterBefore.a) >= 10 || Math.abs(splitterAfter.b - splitterBefore.b) >= 10), viewport.facts.splitter);

  const scroll = await evaluate(cdp, normal.sessionId,
    "(async()=>{for(let i=0;i<28;i++)window.INK_APP.addLayer();await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));const e=document.querySelector('#layersList');const before=e.scrollTop;e.scrollTop=e.scrollHeight;return{clientHeight:e.clientHeight,scrollHeight:e.scrollHeight,before,after:e.scrollTop,max:e.scrollHeight-e.clientHeight}})()");
  viewport.facts.scroll = scroll;
  add('panel-body-scrolling', scroll && scroll.max > 0 && scroll.after > 0, scroll);
  viewport.captures.push(await capture(cdp, normal.sessionId, evidenceDir, 'scrolled-layers-' + width + 'x' + height, width, height));

  const scrollbar = await evaluate(cdp, normal.sessionId,
    "(()=>{const e=document.querySelector('#layersList');const cs=getComputedStyle(e),pseudo=getComputedStyle(e,'::-webkit-scrollbar'),thumb=getComputedStyle(e,'::-webkit-scrollbar-thumb'),root=getComputedStyle(document.documentElement);return{width:pseudo.width,height:pseudo.height,scrollbarColor:cs.scrollbarColor,thumbBackground:thumb.backgroundColor,tokenThumb:root.getPropertyValue('--ink-ui-scrollbar-thumb').trim(),tokenSubtle:root.getPropertyValue('--ink-ui-surface-subtle').trim()}})()");
  viewport.facts.scrollbar = scrollbar;
  add('scrollbar-tokenized-browser-state', scrollbar && String(scrollbar.scrollbarColor).length > 0 && String(scrollbar.tokenThumb).length > 0 && scroll && scroll.max > 0, scrollbar);

  const triggerRect = await rect(cdp, normal.sessionId, '.panel-options-trigger');
  if (triggerRect && triggerRect.width > 0) await clickPoint(cdp, normal.sessionId, triggerRect.x + triggerRect.width/2, triggerRect.y + triggerRect.height/2);
  const menuBefore = await evaluate(cdp, normal.sessionId,
    "(()=>{const m=document.querySelector('#shellPanelOptionsMenu'),b=m&&m.querySelector('button');if(!m||!b)return null;const r=b.getBoundingClientRect(),c=getComputedStyle(b);return{hidden:m.hidden,button:{x:r.x,y:r.y,w:r.width,h:r.height,bg:c.backgroundColor,color:c.color}}})()");
  if (menuBefore && !menuBefore.hidden) await moveMouse(cdp, normal.sessionId, menuBefore.button.x + menuBefore.button.w/2, menuBefore.button.y + menuBefore.button.h/2);
  const menuHover = await evaluate(cdp, normal.sessionId,
    "(()=>{const m=document.querySelector('#shellPanelOptionsMenu'),b=m&&m.querySelector('button'),root=getComputedStyle(document.documentElement);if(!m||!b)return null;const c=getComputedStyle(b);return{hidden:m.hidden,bg:c.backgroundColor,color:c.color,hover:b.matches(':hover'),tokenHover:root.getPropertyValue('--ink-ui-control-hover').trim(),tokenText:root.getPropertyValue('--ink-ui-text').trim()}})()");
  await cdp.send('Input.dispatchKeyEvent', { type:'keyDown', key:'Tab', code:'Tab', windowsVirtualKeyCode:9, nativeVirtualKeyCode:9 }, normal.sessionId);
  await cdp.send('Input.dispatchKeyEvent', { type:'keyUp', key:'Tab', code:'Tab', windowsVirtualKeyCode:9, nativeVirtualKeyCode:9 }, normal.sessionId);
  const menuFocus = await evaluate(cdp, normal.sessionId,
    "(()=>{const b=document.querySelector('#shellPanelOptionsMenu button');if(!b)return null;b.focus();const c=getComputedStyle(b);return{active:document.activeElement===b,focus:b.matches(':focus'),focusVisible:b.matches(':focus-visible'),bg:c.backgroundColor,outline:c.outlineStyle}})()");
  viewport.facts.menuStates = { normal:menuBefore, hover:menuHover, focus:menuFocus };
  add('panel-menu-hover-state', menuBefore && menuHover && menuHover.hidden === false && menuHover.hover === true && menuHover.bg !== menuBefore.button.bg, viewport.facts.menuStates);
  add('panel-menu-focus-state', menuFocus && menuFocus.active === true && menuFocus.focus === true, menuFocus);
  viewport.captures.push(await capture(cdp, normal.sessionId, evidenceDir, 'panel-options-' + width + 'x' + height, width, height));

  const disabled = await evaluate(cdp, normal.sessionId,
    "(()=>{const d=document.querySelector('#undoBtn'),e=document.querySelector('#saveBtn'),sd=getComputedStyle(d),se=getComputedStyle(e);return{disabled:d.disabled,disabledStyle:{opacity:sd.opacity,color:sd.color,bg:sd.backgroundColor},enabledStyle:{opacity:se.opacity,color:se.color,bg:se.backgroundColor},different:sd.opacity!==se.opacity||sd.color!==se.color||sd.backgroundColor!==se.backgroundColor}})()");
  viewport.facts.disabled = disabled;
  add('disabled-state-distinct', disabled && disabled.disabled === true && disabled.different === true, disabled);

  await evaluate(cdp, normal.sessionId, "window.INK_WEB_SHELL.close()");
  await sleep(120);
  const dockNormal = await evaluate(cdp, normal.sessionId,
    "(()=>{const b=document.querySelector('#panelDock [data-shell-panel=\"layers\"]'),r=b.getBoundingClientRect(),c=getComputedStyle(b);return{x:r.x,y:r.y,w:r.width,h:r.height,color:c.color,bg:c.backgroundColor,active:b.classList.contains('active')}})()");
  if (dockNormal) await moveMouse(cdp, normal.sessionId, dockNormal.x + dockNormal.w/2, dockNormal.y + dockNormal.h/2);
  const dockHover = await evaluate(cdp, normal.sessionId,
    "(()=>{const b=document.querySelector('#panelDock [data-shell-panel=\"layers\"]'),c=getComputedStyle(b);return{hover:b.matches(':hover'),color:c.color,bg:c.backgroundColor}})()");
  if (dockNormal) await clickPoint(cdp, normal.sessionId, dockNormal.x + dockNormal.w/2, dockNormal.y + dockNormal.h/2);
  const dockActive = await evaluate(cdp, normal.sessionId,
    "(()=>{const b=document.querySelector('#panelDock [data-shell-panel=\"layers\"]'),c=getComputedStyle(b);return{active:b.classList.contains('active'),pressed:b.getAttribute('aria-pressed'),color:c.color,bg:c.backgroundColor}})()");
  viewport.facts.dockStates = { normal:dockNormal, hover:dockHover, active:dockActive };
  add('icon-normal-hover-active-states', dockNormal && dockHover && dockActive && dockHover.hover === true && dockActive.active === true && dockActive.pressed === 'true' && (dockHover.bg !== dockNormal.bg || dockHover.color !== dockNormal.color) && (dockActive.bg !== dockNormal.bg || dockActive.color !== dockNormal.color), viewport.facts.dockStates);

  await evaluate(cdp, normal.sessionId, "window.INK_WEB_SHELL.open('properties')");
  await sleep(120);
  const tabNormal = await evaluate(cdp, normal.sessionId,
    "(()=>{const b=[...document.querySelectorAll('.inspector-tab')].find(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0});if(!b)return null;const r=b.getBoundingClientRect(),c=getComputedStyle(b);return{selector:b.dataset.tab||b.textContent,x:r.x,y:r.y,w:r.width,h:r.height,bg:c.backgroundColor,color:c.color}})()");
  if (tabNormal) await moveMouse(cdp, normal.sessionId, tabNormal.x + tabNormal.w/2, tabNormal.y + tabNormal.h/2);
  const tabHover = await evaluate(cdp, normal.sessionId,
    "(()=>{const b=[...document.querySelectorAll('.inspector-tab')].find(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0});if(!b)return null;const c=getComputedStyle(b);return{hover:b.matches(':hover'),bg:c.backgroundColor,color:c.color}})()");
  const tabFocus = await evaluate(cdp, normal.sessionId,
    "(()=>{const b=[...document.querySelectorAll('.inspector-tab')].find(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0});if(!b)return null;b.focus();const c=getComputedStyle(b);return{active:document.activeElement===b,focus:b.matches(':focus'),focusVisible:b.matches(':focus-visible'),bg:c.backgroundColor,outline:c.outlineStyle}})()");
  viewport.facts.tabStates = { normal:tabNormal, hover:tabHover, focus:tabFocus };
  add('panel-tab-hover-focus', tabNormal && tabHover && tabFocus && tabHover.hover === true && tabFocus.active === true, viewport.facts.tabStates);

  const tokens = await evaluate(cdp, normal.sessionId,
    "(()=>{const r=getComputedStyle(document.documentElement);const names=['--ink-ui-bg-base','--ink-ui-surface','--ink-ui-surface-subtle','--ink-ui-text','--ink-ui-text-muted','--ink-ui-text-disabled','--ink-ui-control-hover','--ink-ui-control-active','--ink-ui-border','--ink-ui-border-soft','--ink-ui-border-strong','--ink-ui-scrollbar-thumb'];return Object.fromEntries(names.map(n=>[n,r.getPropertyValue(n).trim()]))})()");
  const roleMatch = await evaluate(cdp, normal.sessionId,
    "(()=>{const root=getComputedStyle(document.documentElement),val=n=>root.getPropertyValue(n).trim(),norm=s=>{const d=document.createElement('i');d.style.color=s;document.body.append(d);const c=getComputedStyle(d).color;d.remove();return c};const h=document.querySelector('.inspector-head strong'),dock=document.querySelector('#panelDock [data-shell-panel="layers"]'),footer=document.querySelector('.shell-panel-footer button');const sh=h&&getComputedStyle(h),sd=dock&&getComputedStyle(dock),sf=footer&&getComputedStyle(footer);return{head:{actual:sh&&sh.color,token:norm(val('--ink-ui-text'))},dock:{actual:sd&&sd.color,token:norm(val('--ink-ui-text-muted'))},footer:{border:sf&&sf.borderTopColor,token:norm(val('--ink-ui-border'))}}})()");
  viewport.facts.tokens = tokens;
  viewport.facts.roleMatch = roleMatch;
  add('semantic-light-token-authority-rendered', tokens && Object.values(tokens).every(Boolean) && roleMatch && roleMatch.head.actual === roleMatch.head.token && roleMatch.dock.actual === roleMatch.dock.token && (!roleMatch.footer.border || roleMatch.footer.border === roleMatch.footer.token), {tokens,roleMatch});

  const contrast = await evaluate(cdp, normal.sessionId,
    "(()=>{const parse=s=>{const m=String(s).match(/rgba?\\((\\d+(?:\\.\\d+)?)[,\\s]+(\\d+(?:\\.\\d+)?)[,\\s]+(\\d+(?:\\.\\d+)?)/);return m?m.slice(1,4).map(Number):null};const lum=rgb=>{const a=rgb.map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*a[0]+.7152*a[1]+.0722*a[2]};const ratio=(a,b)=>{a=parse(a);b=parse(b);if(!a||!b)return null;const l1=lum(a),l2=lum(b);return (Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05)};const pair=(s,bg)=>{const e=document.querySelector(s),p=document.querySelector(bg);if(!e||!p)return null;const ce=getComputedStyle(e),cp=getComputedStyle(p);return{text:ce.color,bg:cp.backgroundColor,ratio:ratio(ce.color,cp.backgroundColor)}};return{head:pair('.inspector-head strong','.inspector-head'),tab:pair('.properties-subnav .inspector-tab','.properties-subnav')}})()");
  viewport.facts.contrast = contrast;
  add('primary-secondary-text-contrast', contrast && contrast.head && contrast.head.ratio >= 4.5 && contrast.tab && contrast.tab.ratio >= 3, contrast);

  const chromeFit = await evaluate(cdp, normal.sessionId,
    "(()=>{const panel=document.querySelector('#inspector').getBoundingClientRect(),status=document.querySelector('#documentStatusStrip').getBoundingClientRect(),tab=document.querySelector('.document-tab-band').getBoundingClientRect();return{panelLeft:panel.left,statusRight:status.right,tabRight:tab.right,viewport:innerWidth,statusInside:status.right<=panel.left+1,tabInside:tab.right<=panel.left+1}})()");
  viewport.facts.chromeFit = chromeFit;
  add('expanded-panel-does-not-overlap-document-chrome', chromeFit && chromeFit.statusInside && chromeFit.tabInside, chromeFit);

  await cdp.send('Target.closeTarget', { targetId:normal.targetId });
  viewport.status = viewport.checks.every(check => check.pass) ? 'PASS' : 'FAIL';
  report.viewports.push(viewport);
}

export async function run(root) {
  const evidenceDir = path.join(root, 'evidence');
  await mkdir(evidenceDir, { recursive:true });
  const report = {
    schema:'INK-UI-FINAL-TARGETED-BROWSER-EVIDENCE',
    version:1,
    task:'INK-UI-FINAL-CHECKLIST-CLOSURE-001',
    targetSha:TARGET_SHA,
    workflowSha:process.env.INK_WORKFLOW_SHA || null,
    runner:process.env.RUNNER_NAME || null,
    centralRuntimeExecuted:false,
    status:'RUNNING',
    failures:[],
    sourceChecks:{},
    viewports:[]
  };

  const styles = await readFile(path.join(root, 'product/source/styles.css'), 'utf8');
  report.sourceChecks.scrollbar16 = /::-webkit-scrollbar[^{}]*\{width:16px;height:16px\}/.test(styles);
  report.sourceChecks.scrollbarToken = /--ink-ui-scrollbar-thumb\s*:\s*#B8B8B8/i.test(styles) && /scrollbar-color\s*:\s*var\(--ink-ui-scrollbar-thumb\)\s+var\(--ink-ui-surface-subtle\)/.test(styles);
  if (!report.sourceChecks.scrollbar16) report.failures.push('source scrollbar 16px rule missing');
  if (!report.sourceChecks.scrollbarToken) report.failures.push('source scrollbar semantic token rule missing');

  const started = await startServer(root);
  const browserPath = findBrowser();
  const profile = await mkdtemp(path.join(root, 'profile-targeted-ui-'));
  let child;
  try {
    child = spawn(browserPath, [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      '--disable-background-networking',
      '--disable-background-timer-throttling',
      '--remote-debugging-pipe',
      '--user-data-dir=' + profile,
      'about:blank'
    ], {
      shell:false,
      windowsHide:true,
      stdio:['ignore','ignore','pipe','pipe','pipe']
    });
    let stderr = '';
    child.stderr.on('data', chunk => { if (stderr.length < 16000) stderr += chunk.toString(); });
    const cdp = createCdpPipe(child);
    report.browser = await cdp.send('Browser.getVersion');
    report.browserPath = browserPath;

    for (const dims of [[1280,1024],[960,800]]) {
      try {
        await browserViewportEvidence(cdp, dims[0], dims[1], started.origin, evidenceDir, report);
      } catch (error) {
        report.failures.push(dims[0] + 'x' + dims[1] + ' runner-error: ' + (error && error.message ? error.message : String(error)));
        report.viewports.push({ width:dims[0], height:dims[1], dpr:1, status:'FAIL', error:String(error && error.stack ? error.stack : error) });
      }
    }

    report.status = report.failures.length === 0 && report.viewports.length === 2 && report.viewports.every(v => v.status === 'PASS') ? 'PASS' : 'FAIL';
    if (report.status !== 'PASS') process.exitCode = 1;
  } catch (error) {
    report.status = 'FAIL';
    report.failures.push(String(error && error.stack ? error.stack : error));
    process.exitCode = 1;
  } finally {
    report.completedAt = new Date().toISOString();
    await writeFile(path.join(evidenceDir, 'report.json'), JSON.stringify(report, null, 2));
    await writeFile(path.join(evidenceDir, 'revision.json'), JSON.stringify({
      task:report.task,
      targetSha:TARGET_SHA,
      workflowSha:report.workflowSha,
      centralRuntimeExecuted:false,
      browser:report.browser || null,
      runner:report.runner
    }, null, 2));
    console.log(JSON.stringify(report, null, 2));
    await stopBrowser(child);
    started.server.closeAllConnections();
    await new Promise(resolve => started.server.close(resolve));
    await rm(profile, { recursive:true, force:true, maxRetries:5, retryDelay:200 });
  }
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await run(path.resolve(process.argv[2] || '.'));
}
