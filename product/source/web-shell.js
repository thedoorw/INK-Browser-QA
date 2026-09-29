(() => {
  'use strict';

  const DESKTOP_QUERY = '(min-width: 761px)';
  const LAYOUT_MODES = Object.freeze({
    DESKTOP_WIDE: 'DESKTOP_WIDE',
    DESKTOP_NARROW: 'DESKTOP_NARROW',
    COMPACT: 'COMPACT'
  });
  const RUNTIME_READY_EVENT = 'ink:runtime-ready';
  const LAST_PANEL_KEY = 'ink.web.ui.last-panel.v0.1';
  const TOOLBAR_LAYOUT_KEY = 'ink.web.ui.toolbar-layout.v0.1';
  const DEFAULT_PRIMARY_PANEL_WIDTH = 252;
  const MIN_PRIMARY_PANEL_WIDTH = 244;
  const MAX_PRIMARY_PANEL_WIDTH = 420;
  const FILE_COMMAND_TARGETS = Object.freeze({
    new: 'newBtn',
    open: 'openBtn',
    save: 'saveBtn',
    export: 'exportBtn'
  });
  const APPLICATION_MENU_REGISTRY = Object.freeze([
    { id: 'file', label: '檔案', live: true },
    { id: 'edit', label: '編輯', live: true },
    { id: 'image', label: '影像', live: true },
    { id: 'layer', label: '圖層', live: true },
    { id: 'type', label: '文字', live: true },
    { id: 'select', label: '選取', live: true },
    { id: 'filter', label: '濾鏡', live: true },
    { id: 'object', label: '物件', live: true },
    { id: 'view', label: '檢視', live: true },
    { id: 'window', label: '視窗', live: true },
    { id: 'help', label: '說明', live: true }
  ]);
  const DRAW_CONTEXT_TOOLS = new Set(['pen', 'pencil', 'marker', 'brush', 'airbrush']);
  const CONTEXT_CONTROL_IDS = Object.freeze(['quickControls', 'eraserOptions', 'shapeOptions', 'textOptions', 'selectionBar']);
  const CONTEXT_TOOL_META = Object.freeze({
    pen: { label: '鋼筆', icon: 'i-pen' },
    pencil: { label: '鉛筆', icon: 'i-pencil' },
    marker: { label: '麥克筆', icon: 'i-marker' },
    brush: { label: '毛筆', icon: 'i-brush' },
    airbrush: { label: '噴筆', icon: 'i-airbrush' },
    eraser: { label: '橡皮擦', icon: 'i-eraser' },
    select: { label: '選取', icon: 'i-select' },
    lasso: { label: '套索', icon: 'i-lasso' },
    shape: { label: '幾何', icon: 'i-shape' },
    text: { label: '文字', icon: 'i-text' },
    image: { label: '圖片', icon: 'i-image' },
    pan: { label: '移動畫布', icon: 'i-pan' }
  });
  const PANEL_DEFS = Object.freeze([
    { id: 'properties', label: '屬性', icon: 'i-sliders', kind: 'inspector', group: 'editor' },
    { id: 'layers', label: '圖層', icon: 'i-layers', kind: 'inspector', tab: 'layers', group: 'editor' },
    { id: 'history', label: '歷史', icon: 'i-history', kind: 'inspector', tab: 'history', group: 'editor' },
    { id: 'navigator', label: '導覽器', icon: 'i-pan', kind: 'inspector', tab: 'navigator', group: 'editor' },
    { id: 'pages', label: '頁面', icon: 'i-pages', kind: 'inspector', tab: 'pages', group: 'editor' },
    { id: 'color', label: '顏色', icon: 'i-brush', kind: 'inspector', tab: 'color', group: 'appearance' },
    { id: 'channels', label: '色版', icon: 'i-layers', kind: 'inspector', tab: 'channels', group: 'appearance' },
    { id: 'adjustments', label: '調整', icon: 'i-sliders', kind: 'inspector', tab: 'adjustments', group: 'appearance' },
    { id: 'libraries', label: 'Libraries', icon: 'i-image', kind: 'inspector', tab: 'libraries', group: 'creative' },
    { id: 'reference', label: 'Reference', icon: 'i-image', kind: 'creative', stage: 'reference', group: 'creative' },
    { id: 'compose', label: 'Compose', icon: 'i-group', kind: 'creative', stage: 'compose', group: 'creative' },
    { id: 'chat', label: 'CHAT', icon: 'i-spark', kind: 'creative', stage: 'chat', group: 'creative' },
    { id: 'revision', label: 'Revision', icon: 'i-history', kind: 'creative', stage: 'revision', group: 'creative' },
    { id: 'specialist', label: 'Specialist', icon: 'i-settings', kind: 'inspector', tab: 'ai', group: 'specialist' }
  ]);
  const PANEL_GROUPS = Object.freeze([
    { id: 'editor', label: 'Editor', items: PANEL_DEFS.filter(def => def.group === 'editor') },
    { id: 'appearance', label: 'Color / Output', items: PANEL_DEFS.filter(def => def.group === 'appearance') },
    { id: 'creative', label: 'Creative Loop', items: PANEL_DEFS.filter(def => def.group === 'creative') },
    { id: 'specialist', label: 'Specialist', items: PANEL_DEFS.filter(def => def.group === 'specialist') }
  ]);
  const PRIMARY_PANEL_STATES = Object.freeze(['collapsed', ...PANEL_DEFS.map(def => def.id)]);
  const LIBRARY_TYPES = Object.freeze(['component', 'material', 'recipe', 'parametric-structure', 'reference-derived-structure']);
  const LIBRARY_TYPE_LABELS = Object.freeze({
    component: 'Components',
    material: 'Materials',
    recipe: 'Recipes',
    'parametric-structure': 'Parametric',
    'reference-derived-structure': 'Reference-derived'
  });

  const state = {
    root: null,
    dock: null,
    windowMenu: null,
    windowButton: null,
    applicationMenus: new Map(),
    openApplicationMenu: null,
    applicationMenuBound: false,
    toolbarLayout: 'single',
    runtimeBound: false,
    activePanel: 'collapsed',
    lastPanel: null,
    resizeObserver: null,
    mutationObserver: null,
    contextObserver: null,
    contextualRoot: null,
    contextualHost: null,
    contextRaf: 0,
    panelOptionsMenu: null,
    documentChrome: null,
    panelStackHost: null,
    activePanelResizer: null,
    shellTooltip: null,
    tooltipTarget: null,
    guidePreview: null,
    guideReadout: null,
    snapReadout: null,
    viewSyncObserver: null,
    viewSyncRaf: 0,
    navigatorBounds: null,
    libraryTypes: new Set(LIBRARY_TYPES),
    libraryResults: [],
    librarySelectedRef: null,
    libraryLastProposal: null,
    libraryProposalSequence: 0
  };

  function runtime() {
    return globalThis.INK_APP || null;
  }

  function resolveLayoutMode(width = globalThis.innerWidth || 1280) {
    if (width <= 760) return LAYOUT_MODES.COMPACT;
    if (width <= 1120) return LAYOUT_MODES.DESKTOP_NARROW;
    return LAYOUT_MODES.DESKTOP_WIDE;
  }

  function isDesktop() {
    return resolveLayoutMode() !== LAYOUT_MODES.COMPACT;
  }

  function svgIcon(id) {
    return '<svg aria-hidden="true"><use href="#' + id + '"></use></svg>';
  }

  function buttonMarkup(def, menu = false) {
    return '<button type="button" class="' + (menu ? 'panel-window-item' : 'panel-dock-button') +
      '" data-shell-panel="' + def.id + '" title="' + def.label +
      '" aria-label="' + def.label + '" aria-pressed="false">' +
      svgIcon(def.icon) + (menu ? '<span>' + def.label + '</span>' : '') + '</button>';
  }

  function applicationMenuElements(id) {
    const trigger = document.querySelector(`[data-application-menu-trigger="${id}"]`);
    const menu = id === 'window'
      ? document.querySelector('#panelWindowMenu')
      : document.querySelector(`#${id}Menu`);
    return { trigger, menu };
  }

  function runShellAction(action) {
    const app = runtime();
    if (action === 'undo') document.querySelector('#undoBtn')?.click();
    else if (action === 'redo') document.querySelector('#redoBtn')?.click();
    else if (action === 'canvas-settings') document.querySelector('#settingsToggle')?.click();
    else if (action === 'branding-settings') globalThis.dispatchEvent(new CustomEvent('ink:branding-open'));
    else if (action === 'fit-current') document.querySelector('#fitBtn')?.click();
    else if (action === 'fullscreen') document.querySelector('#fullscreenToggle')?.click();
    else if (action === 'toggle-rulers') {
      const enabled = state.root?.dataset.rulers !== 'true';
      if (state.root) state.root.dataset.rulers = String(enabled);
      const item = document.querySelector('[data-shell-action="toggle-rulers"]');
      item?.setAttribute('aria-checked', String(enabled));
      try { localStorage.setItem('ink.web.ui.rulers.v0.1', String(enabled)); } catch {}
      syncSoon();
    } else if (action === 'about') {
      app?.toast?.('INK · Photoshop-aligned UI shell');
    }
  }

  function closeApplicationMenus({ focus = false } = {}) {
    const activeId = state.openApplicationMenu;
    for (const entry of state.applicationMenus.values()) {
      entry.menu.hidden = true;
      entry.trigger.setAttribute('aria-expanded', 'false');
    }
    state.openApplicationMenu = null;
    if (focus && activeId) state.applicationMenus.get(activeId)?.trigger?.focus();
  }

  function setApplicationMenu(id, open) {
    const entry = state.applicationMenus.get(id);
    if (!entry) return false;
    const next = Boolean(open);
    closeApplicationMenus();
    if (!next) return true;
    entry.menu.hidden = false;
    entry.trigger.setAttribute('aria-expanded', 'true');
    state.openApplicationMenu = id;
    if (id === 'window') positionWindowMenu();
    return true;
  }

  function moveApplicationMenuFocus(menu, direction) {
    const items = [...menu.querySelectorAll('[role="menuitem"]:not([disabled])')];
    if (!items.length) return;
    const current = items.indexOf(document.activeElement);
    const next = direction === 'first'
      ? 0
      : direction === 'last'
        ? items.length - 1
        : (current + direction + items.length) % items.length;
    items[next]?.focus();
  }

  function bindApplicationMenus() {
    if (state.applicationMenuBound) return true;
    const root = document.querySelector('#applicationMenus');
    if (!root) return false;

    for (const def of APPLICATION_MENU_REGISTRY) {
      if (!def.live) {
        const label = root.querySelector(`[data-application-menu-id="${def.id}"]`);
        if (!label || label.matches('button,[role="menuitem"]')) return false;
        continue;
      }
      const { trigger, menu } = applicationMenuElements(def.id);
      if (!trigger || !menu) return false;
      state.applicationMenus.set(def.id, { ...def, trigger, menu });
      trigger.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        setApplicationMenu(def.id, state.openApplicationMenu !== def.id);
      });
      trigger.addEventListener('keydown', event => {
        if (event.key !== 'ArrowDown') return;
        event.preventDefault();
        setApplicationMenu(def.id, true);
        moveApplicationMenuFocus(menu, 'first');
      });
      menu.addEventListener('click', event => {
        const fileItem = event.target.closest('[data-file-command]');
        const panelItem = event.target.closest('[data-shell-panel]');
        const actionItem = event.target.closest('[data-shell-action]');
        if (!fileItem && !panelItem && !actionItem) return;
        event.preventDefault();
        if (fileItem) {
          const targetId = FILE_COMMAND_TARGETS[fileItem.dataset.fileCommand];
          closeApplicationMenus();
          if (targetId) document.getElementById(targetId)?.click();
          return;
        }
        if (actionItem) {
          const action = actionItem.dataset.shellAction;
          closeApplicationMenus();
          runShellAction(action);
          return;
        }
        const panelId = panelItem.dataset.shellPanel;
        closeApplicationMenus();
        togglePanel(panelId);
      });
      menu.addEventListener('keydown', event => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          moveApplicationMenuFocus(menu, event.key === 'ArrowDown' ? 1 : -1);
        } else if (event.key === 'Home' || event.key === 'End') {
          event.preventDefault();
          moveApplicationMenuFocus(menu, event.key === 'Home' ? 'first' : 'last');
        } else if (event.key === 'Escape') {
          event.preventDefault();
          closeApplicationMenus({ focus: true });
        }
      });
    }

    document.addEventListener('click', event => {
      if (!state.openApplicationMenu) return;
      const active = state.applicationMenus.get(state.openApplicationMenu);
      if (!active) return;
      if (event.target.closest('.application-menu') || event.target.closest('#panelWindowMenu')) return;
      closeApplicationMenus();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && state.openApplicationMenu) closeApplicationMenus({ focus: true });
    });
    state.applicationMenuBound = true;
    return true;
  }

  function applyToolbarLayout(layout, { persist = false } = {}) {
    const normalized = layout === 'dual' ? 'dual' : 'single';
    state.toolbarLayout = normalized;
    const effective = isDesktop() ? normalized : 'single';
    state.root?.classList.toggle('toolbar-layout-dual', effective === 'dual');
    if (state.root) state.root.dataset.toolbarLayout = effective;
    const button = document.querySelector('#toolbarLayoutToggle');
    if (button) {
      const dual = effective === 'dual';
      button.setAttribute('aria-pressed', String(dual));
      button.setAttribute('aria-label', dual ? '切換為單欄工具列' : '切換為雙欄工具列');
      button.title = dual ? '切換為單欄工具列' : '切換為雙欄工具列';
    }
    if (persist) {
      try { localStorage.setItem(TOOLBAR_LAYOUT_KEY, normalized); } catch {}
    }
    syncSoon();
  }

  function bindToolbarLayout() {
    const button = document.querySelector('#toolbarLayoutToggle');
    if (!button) return false;
    let stored = 'single';
    try { stored = localStorage.getItem(TOOLBAR_LAYOUT_KEY) || 'single'; } catch {}
    applyToolbarLayout(stored);
    if (button.dataset.shellToolbarLayoutBound !== 'true') {
      button.dataset.shellToolbarLayoutBound = 'true';
      button.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        if (!isDesktop()) return;
        applyToolbarLayout(state.toolbarLayout === 'dual' ? 'single' : 'dual', { persist: true });
      });
      globalThis.matchMedia?.(DESKTOP_QUERY)?.addEventListener?.('change', () => applyToolbarLayout(state.toolbarLayout));
    }
    return true;
  }

  function mountContextualControls() {
    const root = document.querySelector('#contextualOptions');
    const host = document.querySelector('#contextualControlHost');
    if (!root || !host) return false;
    for (const id of CONTEXT_CONTROL_IDS) {
      const node = document.getElementById(id);
      if (node && node.parentElement !== host) host.append(node);
    }
    state.contextualRoot = root;
    state.contextualHost = host;
    return true;
  }

  function contextualDescriptor(app) {
    const selected = Array.isArray(app?.selection) ? app.selection.length : 0;
    if (selected > 0) return { mode: 'selection', tool: 'select', label: `選取 · ${selected} 個物件`, icon: 'i-select' };
    const tool = app?.tool || 'pen';
    const meta = CONTEXT_TOOL_META[tool] || { label: '工具', icon: 'i-sliders' };
    if (DRAW_CONTEXT_TOOLS.has(tool)) return { mode: 'draw', tool, ...meta };
    if (tool === 'eraser' || tool === 'shape' || tool === 'text') return { mode: tool, tool, ...meta };
    return { mode: 'neutral', tool, ...meta };
  }

  function syncContextualOptions() {
    const app = runtime();
    const root = state.contextualRoot || document.querySelector('#contextualOptions');
    if (!app || !root) return;
    const descriptor = contextualDescriptor(app);
    root.dataset.contextMode = descriptor.mode;
    root.dataset.contextTool = descriptor.tool;
    const use = document.querySelector('#contextualToolUse');
    const name = document.querySelector('#contextualToolName');
    const advanced = document.querySelector('#contextualAdvancedBtn');
    if (use) use.setAttribute('href', '#' + descriptor.icon);
    if (name) name.textContent = descriptor.label;
    if (advanced) {
      const propertiesOpen = currentPanel() === 'properties';
      const available = ['draw', 'eraser', 'shape', 'text', 'selection'].includes(descriptor.mode);
      advanced.hidden = !available;
      advanced.textContent = descriptor.mode === 'selection' ? '物件' : '進階';
      advanced.classList.toggle('active', propertiesOpen);
      advanced.setAttribute('aria-pressed', String(propertiesOpen));
      advanced.setAttribute('aria-expanded', String(propertiesOpen));
      advanced.setAttribute('aria-controls', 'inspector');
      const action = descriptor.mode === 'selection' ? '前往物件屬性' : '前往工具進階設定';
      advanced.setAttribute('aria-label', action);
      advanced.title = action;
    }
  }

  function syncContextualSoon() {
    if (state.contextRaf) cancelAnimationFrame(state.contextRaf);
    state.contextRaf = requestAnimationFrame(() => {
      state.contextRaf = 0;
      syncContextualOptions();
    });
  }

  function openContextualAdvanced() {
    if (!runtime()) return false;
    return selectPanel('properties');
  }

  function bindContextualOptions() {
    if (!mountContextualControls()) return false;
    const advanced = document.querySelector('#contextualAdvancedBtn');
    if (advanced && advanced.dataset.contextBound !== 'true') {
      advanced.dataset.contextBound = 'true';
      advanced.addEventListener('click', openContextualAdvanced);
    }
    if (!state.contextObserver) {
      state.contextObserver = new MutationObserver(syncContextualSoon);
      const toolName = document.querySelector('#activeToolName');
      const selectionBar = document.querySelector('#selectionBar');
      if (toolName) state.contextObserver.observe(toolName, { childList: true, subtree: true });
      if (selectionBar) state.contextObserver.observe(selectionBar, {
        attributes: true,
        attributeFilter: ['hidden', 'data-mode'],
        childList: true,
        subtree: true
      });
    }
    syncContextualSoon();
    return true;
  }

  function createDocumentChrome() {
    if (document.querySelector('#documentShellChrome')) return document.querySelector('#documentShellChrome');
    const root = document.querySelector('#app');
    if (!root) return null;
    const chrome = document.createElement('div');
    chrome.id = 'documentShellChrome';
    chrome.className = 'document-shell-chrome';
    chrome.setAttribute('aria-label', '作用中文件框架');
    chrome.innerHTML =
      '<div class="document-tab-band"><button type="button" class="document-tab active" aria-current="page"><span id="documentTabTitle">未命名作品</span></button></div>' +
      '<div class="document-ruler-corner" aria-hidden="true"></div>' +
      '<div class="document-ruler document-ruler-horizontal" data-ruler-axis="horizontal" role="button" tabindex="0" aria-label="水平尺；拖曳建立水平參考線"><canvas class="document-ruler-canvas" data-ruler-canvas="horizontal" aria-hidden="true"></canvas></div>' +
      '<div class="document-ruler document-ruler-vertical" data-ruler-axis="vertical" role="button" tabindex="0" aria-label="垂直尺；拖曳建立垂直參考線"><canvas class="document-ruler-canvas" data-ruler-canvas="vertical" aria-hidden="true"></canvas></div>';
    root.append(chrome);
    state.documentChrome = chrome;
    return chrome;
  }


  function niceRulerStep(worldPerPixel, targetPixels = 72) {
    const target = Math.max(Number.EPSILON, Math.abs(worldPerPixel) * targetPixels);
    const exponent = 10 ** Math.floor(Math.log10(target));
    const fraction = target / exponent;
    const nice = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
    return nice * exponent;
  }

  function formatRulerLabel(value, majorStep) {
    const normalized = Math.abs(value) < majorStep * 1e-6 ? 0 : value;
    const decimals = majorStep < 1 ? Math.min(3, Math.max(1, Math.ceil(-Math.log10(majorStep)))) : majorStep < 10 ? 1 : 0;
    return Number(normalized.toFixed(decimals)).toString();
  }

  function renderDocumentRuler(ruler, axis, app) {
    const renderer = app?.renderer;
    const canvas = ruler?.querySelector('[data-ruler-canvas]');
    const stageRect = document.querySelector('#stageWrap')?.getBoundingClientRect();
    const rect = ruler?.getBoundingClientRect();
    if (!renderer?.screenToWorld || !canvas || !stageRect || !rect) return false;
    const length = axis === 'horizontal' ? rect.width : rect.height;
    if (!(length > 1)) return false;
    const dpr = Math.max(1, Math.min(3, Number(globalThis.devicePixelRatio) || 1));
    const cssWidth = Math.max(1, Math.round(rect.width));
    const cssHeight = Math.max(1, Math.round(rect.height));
    const pixelWidth = Math.max(1, Math.round(cssWidth * dpr));
    const pixelHeight = Math.max(1, Math.round(cssHeight * dpr));
    if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
    if (canvas.height !== pixelHeight) canvas.height = pixelHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssWidth, cssHeight);
    ctx.fillStyle = '#f1f1f1';
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    const sampleStart = axis === 'horizontal'
      ? renderer.screenToWorld(rect.left, stageRect.top)
      : renderer.screenToWorld(stageRect.left, rect.top);
    const sampleEnd = axis === 'horizontal'
      ? renderer.screenToWorld(rect.right, stageRect.top)
      : renderer.screenToWorld(stageRect.left, rect.bottom);
    if (!sampleStart || !sampleEnd) return false;
    const startValue = axis === 'horizontal' ? sampleStart.x : sampleStart.y;
    const endValue = axis === 'horizontal' ? sampleEnd.x : sampleEnd.y;
    const span = endValue - startValue;
    if (!Number.isFinite(span) || Math.abs(span) < Number.EPSILON) return false;

    const worldPerPixel = Math.abs(span) / length;
    const major = niceRulerStep(worldPerPixel);
    const subdivisions = major / worldPerPixel >= 70 ? 10 : 5;
    const minor = major / subdivisions;
    const minValue = Math.min(startValue, endValue);
    const maxValue = Math.max(startValue, endValue);
    const first = Math.floor(minValue / minor) * minor;
    const count = Math.min(600, Math.ceil((maxValue - first) / minor) + 2);

    ctx.strokeStyle = '#8c8c8c';
    ctx.fillStyle = '#5f5f5f';
    ctx.lineWidth = 1;
    ctx.font = '9px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.textBaseline = 'top';
    for (let index = 0; index < count; index += 1) {
      const value = first + index * minor;
      if (value < minValue - minor || value > maxValue + minor) continue;
      const pixel = (value - startValue) / span * length;
      const majorRatio = value / major;
      const isMajor = Math.abs(majorRatio - Math.round(majorRatio)) < 1e-5;
      const halfRatio = value / (major / 2);
      const isHalf = !isMajor && Math.abs(halfRatio - Math.round(halfRatio)) < 1e-5;
      ctx.beginPath();
      if (axis === 'horizontal') {
        ctx.moveTo(pixel + .5, isMajor ? 7 : isHalf ? 10 : 13);
        ctx.lineTo(pixel + .5, cssHeight);
      } else {
        ctx.moveTo(isMajor ? 7 : isHalf ? 10 : 13, pixel + .5);
        ctx.lineTo(cssWidth, pixel + .5);
      }
      ctx.stroke();
      if (!isMajor) continue;
      const label = formatRulerLabel(value, major);
      if (axis === 'horizontal') {
        ctx.fillText(label, pixel + 2, 0);
      } else {
        ctx.save();
        ctx.translate(1, pixel - 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(label, 0, 0);
        ctx.restore();
      }
    }
    return true;
  }

  function renderDocumentRulers() {
    const app = runtime();
    const root = state.root || document.querySelector('#app');
    if (!app?.renderer || !root || root.dataset.rulers !== 'true' || root.dataset.documentActive === 'false' || !isDesktop()) return false;
    document.querySelectorAll('[data-ruler-axis]').forEach(ruler => renderDocumentRuler(ruler, ruler.dataset.rulerAxis, app));
    return true;
  }

  function syncViewOverlaysSoon() {
    if (state.viewSyncRaf) cancelAnimationFrame(state.viewSyncRaf);
    state.viewSyncRaf = requestAnimationFrame(() => {
      state.viewSyncRaf = 0;
      renderDocumentRulers();
      if (currentPanel() === 'navigator') renderShellNavigator();
    });
  }

  function bindRendererViewObserver() {
    if (state.viewSyncObserver) return true;
    const heartbeat = document.querySelector('#zoomText');
    if (!heartbeat || !('MutationObserver' in globalThis)) return false;
    state.viewSyncObserver = new MutationObserver(syncViewOverlaysSoon);
    state.viewSyncObserver.observe(heartbeat, { childList: true, subtree: true, characterData: true });
    const stage = document.querySelector('#stageWrap');
    if (stage && stage.dataset.shellViewSyncBound !== 'true') {
      stage.dataset.shellViewSyncBound = 'true';
      stage.addEventListener('pointermove', syncViewOverlaysSoon, { passive: true });
      stage.addEventListener('pointerup', syncViewOverlaysSoon, { passive: true });
      stage.addEventListener('wheel', syncViewOverlaysSoon, { passive: true });
    }
    renderDocumentRulers();
    return true;
  }

  function ensureSnapReadout() {
    const root = state.root || document.querySelector('#app');
    if (!root) return null;
    if (state.snapReadout?.isConnected) return state.snapReadout;
    const readout = document.createElement('output');
    readout.id = 'shellSnapReadout';
    readout.className = 'shell-guide-readout shell-snap-readout';
    readout.hidden = true;
    readout.setAttribute('aria-live', 'polite');
    readout.setAttribute('aria-label', 'Snap feedback');
    root.append(readout);
    state.snapReadout = readout;
    return readout;
  }

  function snapFeedbackText(evidence = {}) {
    const parts = [];
    for (const axis of ['x', 'y']) {
      const item = evidence?.[axis];
      if (!item) continue;
      const label = axis.toUpperCase();
      if (item.type === 'equal-distance' && Number.isFinite(Number(item.gap))) {
        parts.push(label + ' gap ' + Number(item.gap).toFixed(Math.abs(Number(item.gap)) < 10 ? 1 : 0) + ' px');
        continue;
      }
      if (Number.isFinite(Number(item.correction)) && Math.abs(Number(item.correction)) > 1e-9) {
        parts.push('Δ' + label + ' ' + Number(item.correction).toFixed(Math.abs(Number(item.correction)) < 10 ? 1 : 0) + ' px');
        continue;
      }
      if (Number.isFinite(Number(item.targetValue))) {
        parts.push(label + ' ' + Number(item.targetValue).toFixed(Math.abs(Number(item.targetValue)) < 10 ? 1 : 0) + ' px');
      }
    }
    return parts.join(' · ');
  }

  function showSnapFeedback(evidence = {}, point = {}) {
    const readout = ensureSnapReadout();
    if (!readout) return false;
    const text = snapFeedbackText(evidence);
    if (!text) {
      readout.hidden = true;
      readout.value = '';
      readout.textContent = '';
      delete readout.dataset.mode;
      return false;
    }
    readout.value = text;
    readout.textContent = text;
    readout.dataset.mode = Object.values(evidence || {}).some(item => item?.type === 'equal-distance') ? 'equal-spacing' : 'snap';
    const fallback = document.querySelector('#stageWrap')?.getBoundingClientRect();
    const x = Number.isFinite(Number(point.clientX)) ? Number(point.clientX) : (fallback ? fallback.left + 24 : 24);
    const y = Number.isFinite(Number(point.clientY)) ? Number(point.clientY) : (fallback ? fallback.top + 24 : 24);
    readout.style.left = Math.max(6, Math.min(globalThis.innerWidth - 180, x + 12)) + 'px';
    readout.style.top = Math.max(6, Math.min(globalThis.innerHeight - 28, y + 12)) + 'px';
    readout.hidden = false;
    return true;
  }

  function clearSnapFeedback() {
    const readout = state.snapReadout || document.querySelector('#shellSnapReadout');
    if (!readout) return false;
    readout.hidden = true;
    readout.value = '';
    readout.textContent = '';
    delete readout.dataset.mode;
    return true;
  }

  function ensureTooltipController() {
    if (state.shellTooltip?.isConnected) return state.shellTooltip;
    const root = state.root || document.querySelector('#app');
    if (!root) return null;
    const tooltip = document.createElement('div');
    tooltip.id = 'shellTooltip';
    tooltip.className = 'shell-tooltip';
    tooltip.setAttribute('role', 'tooltip');
    tooltip.hidden = true;
    root.append(tooltip);
    const show = target => {
      if (!target || !isDesktop()) return;
      const title = target.getAttribute('title') || target.dataset.shellTooltipTitle;
      if (!title) return;
      target.dataset.shellTooltipTitle = title;
      target.removeAttribute('title');
      state.tooltipTarget = target;
      tooltip.textContent = title;
      tooltip.hidden = false;
      const rect = target.getBoundingClientRect();
      const box = tooltip.getBoundingClientRect();
      const left = Math.max(6, Math.min(globalThis.innerWidth - box.width - 6, rect.right + 8));
      const top = Math.max(6, Math.min(globalThis.innerHeight - box.height - 6, rect.top + Math.max(0, (rect.height - box.height) / 2)));
      tooltip.style.left = left + 'px';
      tooltip.style.top = top + 'px';
    };
    const hide = target => {
      const current = target || state.tooltipTarget;
      if (current?.dataset?.shellTooltipTitle && !current.hasAttribute('title')) current.setAttribute('title', current.dataset.shellTooltipTitle);
      if (current?.dataset) delete current.dataset.shellTooltipTitle;
      state.tooltipTarget = null;
      tooltip.hidden = true;
    };
    document.addEventListener('pointerover', event => {
      const target = event.target.closest?.('[title]');
      if (target && target !== state.tooltipTarget) show(target);
    });
    document.addEventListener('pointerout', event => {
      if (!state.tooltipTarget) return;
      if (event.relatedTarget && state.tooltipTarget.contains(event.relatedTarget)) return;
      if (state.tooltipTarget.contains(event.target)) hide(state.tooltipTarget);
    });
    document.addEventListener('focusin', event => {
      const target = event.target.closest?.('[title]');
      if (target) show(target);
    });
    document.addEventListener('focusout', event => {
      if (state.tooltipTarget?.contains(event.target)) hide(state.tooltipTarget);
    });
    state.shellTooltip = tooltip;
    return tooltip;
  }

  function bindRulerGuideDrag() {
    const root = state.root || document.querySelector('#app');
    const app = runtime();
    const chrome = createDocumentChrome();
    if (!root || !app || !chrome || chrome.dataset.guideBound === 'true') return Boolean(chrome?.dataset.guideBound === 'true');
    chrome.dataset.guideBound = 'true';
    const preview = document.createElement('div');
    preview.id = 'shellGuidePreview';
    preview.className = 'shell-guide-preview';
    preview.hidden = true;
    const readout = document.createElement('output');
    readout.id = 'shellGuideReadout';
    readout.className = 'shell-guide-readout';
    readout.hidden = true;
    root.append(preview, readout);
    state.guidePreview = preview;
    state.guideReadout = readout;
    let drag = null;
    const move = event => {
      if (!drag) return;
      const stage = document.querySelector('#stageWrap')?.getBoundingClientRect();
      if (!stage) return;
      const world = app.renderer?.screenToWorld?.(event.clientX, event.clientY);
      if (!world) return;
      const value = drag.orientation === 'horizontal' ? world.y : world.x;
      preview.dataset.axis = drag.orientation;
      if (drag.orientation === 'horizontal') {
        preview.style.left = stage.left + 'px';
        preview.style.top = event.clientY + 'px';
        preview.style.width = stage.width + 'px';
        preview.style.height = '1px';
      } else {
        preview.style.left = event.clientX + 'px';
        preview.style.top = stage.top + 'px';
        preview.style.width = '1px';
        preview.style.height = stage.height + 'px';
      }
      preview.hidden = false;
      readout.value = (drag.orientation === 'horizontal' ? 'Y: ' : 'X: ') + value.toFixed(1);
      readout.style.left = Math.max(6, Math.min(globalThis.innerWidth - 74, event.clientX + 10)) + 'px';
      readout.style.top = Math.max(6, Math.min(globalThis.innerHeight - 28, event.clientY + 10)) + 'px';
      readout.hidden = false;
      drag.value = value;
      drag.inside = event.clientX >= stage.left && event.clientX <= stage.right && event.clientY >= stage.top && event.clientY <= stage.bottom;
      event.preventDefault();
    };
    const end = event => {
      if (!drag) return;
      const commit = drag.inside && Number.isFinite(drag.value);
      const orientation = drag.orientation;
      const value = drag.value;
      drag = null;
      preview.hidden = true;
      readout.hidden = true;
      globalThis.removeEventListener('pointermove', move);
      globalThis.removeEventListener('pointerup', end);
      globalThis.removeEventListener('pointercancel', end);
      if (commit) app.addGuide?.({ orientation, position: value });
    };
    chrome.querySelectorAll('[data-ruler-axis]').forEach(ruler => {
      ruler.addEventListener('pointerdown', event => {
        if (!isDesktop() || root.dataset.rulers !== 'true' || root.dataset.documentActive === 'false' || event.button !== 0) return;
        drag = { orientation: ruler.dataset.rulerAxis, value: NaN, inside: false };
        globalThis.addEventListener('pointermove', move);
        globalThis.addEventListener('pointerup', end);
        globalThis.addEventListener('pointercancel', end);
        move(event);
      });
    });
    return true;
  }

  function ensurePropertyInspectorSupplement() {
    const selection = document.querySelector('#selectionControls');
    if (!selection) return false;
    if (document.querySelector('#shellPropertySupplement')) return true;
    selection.insertAdjacentHTML('beforeend', `
      <div id="shellPropertySupplement" class="shell-property-supplement">
        <div id="shellPathAppearance" class="property-card shell-property-card" hidden>
          <div class="subpanel-title"><strong>Appearance</strong><span>PATH</span></div>
          <label class="control-row"><span>Fill</span><input id="shellPathFill" type="color" value="#202020"></label>
          <label class="control-row"><span>Stroke</span><input id="shellPathStroke" type="color" value="#202020"></label>
          <label class="control-row range-row"><span>Opacity</span><input id="shellPathOpacity" type="range" min="0" max="100" step="1" value="100"><output id="shellPathOpacityOutput">100%</output></label>
        </div>
        <div id="shellMaterialCard" class="property-card shell-property-card" hidden>
          <div class="subpanel-title"><strong>Material</strong><span>EXISTING AUTHORITY</span></div>
          <label class="control-row"><span>Template</span><select id="shellMaterialSelect"></select></label>
          <div class="shell-property-actions"><button type="button" id="shellMaterialApply">Apply</button><button type="button" id="shellMaterialRemove">Remove</button></div>
          <p id="shellMaterialState" class="shell-panel-note">No material</p>
        </div>
        <div id="shellFrameLayout" class="property-card shell-property-card" hidden>
          <div class="subpanel-title"><strong>Frame / Layout</strong><span>INK-LAYOUT-1</span></div>
          <label class="control-row"><span>Mode</span><select id="shellFrameLayoutMode"><option value="manual">Manual</option><option value="horizontal">Horizontal</option><option value="vertical">Vertical</option></select></label>
          <label class="control-row"><span>Gap</span><input id="shellFrameLayoutGap" type="number" min="0" step="1" value="0"></label>
          <label class="control-row"><span>Padding</span><input id="shellFrameLayoutPadding" type="number" min="0" step="1" value="0"></label>
        </div>
        <div id="shellLayoutItem" class="property-card shell-property-card" hidden>
          <div class="subpanel-title"><strong>Layout Item</strong><span>INK-LAYOUT-ITEM-1</span></div>
          <label class="control-row"><span>Flow</span><select id="shellLayoutParticipation"><option value="flow">Flow</option><option value="absolute">Absolute</option></select></label>
          <label class="control-row"><span>Width</span><select id="shellLayoutHorizontal"><option value="hug">Hug</option><option value="fixed">Fixed</option><option value="fill">Fill</option></select></label>
          <label class="control-row"><span>Height</span><select id="shellLayoutVertical"><option value="hug">Hug</option><option value="fixed">Fixed</option><option value="fill">Fill</option></select></label>
        </div>
        <div id="shellComponentState" class="property-card shell-property-card" hidden>
          <div class="subpanel-title"><strong>Component Instance</strong><span>OVERRIDES</span></div>
          <p id="shellComponentReadout" class="shell-panel-note"></p>
          <label class="control-row"><span>Node</span><select id="shellComponentOverrideNode"></select></label>
          <label class="control-row range-row"><span>Opacity</span><input id="shellComponentOverrideOpacity" type="range" min="0" max="100" step="1" value="100"><output id="shellComponentOverrideOpacityOutput">100%</output></label>
          <div class="shell-property-actions"><button type="button" id="shellComponentOverrideApply">Apply override</button><button type="button" id="shellComponentOverrideReset">Reset</button></div>
        </div>
      </div>`);
    return true;
  }

  function ensureSupplementalInspectorSections() {
    const inspector = document.querySelector('#inspector');
    if (!inspector) return false;
    ensurePropertyInspectorSupplement();
    if (inspector.querySelector('[data-content="navigator"]')) return true;
    inspector.insertAdjacentHTML('beforeend', `
      <section class="inspector-section tab-content shell-panel-section navigator-panel" data-content="navigator" aria-label="導覽器">
        <div class="shell-panel-body">
          <div id="shellNavigatorPreview" class="shell-navigator-preview" role="application" aria-label="導覽器縮圖；拖曳框可平移視圖">
            <canvas id="shellNavigatorCanvas" width="220" height="150"></canvas>
            <div id="shellNavigatorProxy" class="shell-navigator-proxy" tabindex="0"></div>
          </div>
        </div>
        <div class="shell-panel-footer navigator-footer">
          <button type="button" id="shellNavigatorFit">符合</button>
          <button type="button" id="shellNavigatorZoomOut" aria-label="縮小">−</button>
          <input id="shellNavigatorZoomSlider" type="range" min="3" max="2400" step="1" value="100" aria-label="導覽器縮放">
          <output id="shellNavigatorZoom">100%</output>
          <button type="button" id="shellNavigatorZoomIn" aria-label="放大">＋</button>
        </div>
      </section>
      <section class="inspector-section tab-content shell-panel-section pages-shell-panel" data-content="pages" aria-label="頁面">
        <div id="shellPagesList" class="shell-pages-list" role="listbox" aria-label="頁面清單"></div>
        <div class="shell-panel-footer">
          <button type="button" id="shellPagesAdd">新增</button>
          <button type="button" id="shellPagesDuplicate">複製</button>
          <span class="shell-panel-footer-spacer"></span>
          <button type="button" id="shellPagesDelete">刪除</button>
        </div>
      </section>
      <section class="inspector-section tab-content shell-panel-section color-shell-panel" data-content="color" aria-label="顏色">
        <div class="shell-panel-body">
          <label class="shell-field"><span>目前顏色</span><input id="shellColorInput" type="color" value="#202020"></label>
          <label class="shell-field"><span>HEX</span><input id="shellColorHex" type="text" value="#202020" maxlength="7"></label>
          <p class="shell-panel-note">使用既有工具顏色 authority；此面板不建立第二份顏色狀態。</p>
        </div>
      </section>
      <section class="inspector-section tab-content shell-panel-section" data-content="channels" aria-label="色版">
        <div class="shell-panel-body"><p class="shell-panel-note">Channels 的正常 panel home 已建立；process／alpha／spot／Multichannel 控制由 UI-B 配線至既有 capability authority。</p></div>
      </section>
      <section class="inspector-section tab-content shell-panel-section" data-content="adjustments" aria-label="調整">
        <div class="shell-panel-body"><p class="shell-panel-note">Adjustments 的正常 panel home 已建立；完整調整命令與參數控制由 UI-B 配線。</p></div>
      </section>
      <section class="inspector-section tab-content shell-panel-section shell-library-panel" data-content="libraries" aria-label="Libraries">
        <div class="shell-panel-body">
          <label class="shell-library-search-label" for="shellLibrarySearch"><span>Search</span><input id="shellLibrarySearch" type="search" autocomplete="off" placeholder="Search library"></label>
          <div id="shellLibraryFilters" class="shell-library-filters" role="group" aria-label="Library families">
            <button type="button" data-library-type="component" aria-pressed="true">Components</button>
            <button type="button" data-library-type="material" aria-pressed="true">Materials</button>
            <button type="button" data-library-type="recipe" aria-pressed="true">Recipes</button>
            <button type="button" data-library-type="parametric-structure" aria-pressed="true">Parametric</button>
            <button type="button" data-library-type="reference-derived-structure" aria-pressed="true">Reference</button>
          </div>
          <p id="shellLibraryStatus" class="shell-panel-note shell-library-status">Library ready</p>
          <div id="shellLibraryResults" class="shell-library-results" role="listbox" aria-label="Library results"></div>
          <label class="shell-library-inspect-label" for="shellLibraryInspect"><span>Inspect · read-only</span><textarea id="shellLibraryInspect" class="shell-library-inspect" readonly aria-readonly="true" spellcheck="false"></textarea></label>
        </div>
      </section>`);
    return true;
  }

  function renderShellPages() {
    const app = runtime();
    const list = document.querySelector('#shellPagesList');
    if (!app?.doc || !list) return;
    list.innerHTML = '';
    for (const page of app.doc.pages || []) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'shell-page-row' + (page.id === app.doc.activePageId ? ' active' : '');
      button.dataset.pageId = page.id;
      button.setAttribute('role', 'option');
      button.setAttribute('aria-selected', String(page.id === app.doc.activePageId));
      const preview = document.createElement('img');
      preview.className = 'shell-page-thumb';
      try { preview.src = app.renderer?.renderThumbnail?.(page) || ''; } catch {}
      const copy = document.createElement('span');
      copy.className = 'shell-page-copy';
      const title = document.createElement('strong');
      title.textContent = page.name || '頁面';
      const meta = document.createElement('small');
      meta.textContent = (page.layers || []).reduce((n, layer) => n + (layer.objects?.length || 0), 0) + ' 個物件';
      copy.append(title, meta);
      button.append(preview, copy);
      list.append(button);
    }
  }

  function fitNavigatorBoundsToAspect(bounds, aspect) {
    const centerX = bounds.x + bounds.w / 2;
    const centerY = bounds.y + bounds.h / 2;
    let width = Math.max(1, bounds.w);
    let height = Math.max(1, bounds.h);
    if (width / height < aspect) width = height * aspect;
    else height = width / aspect;
    return { x: centerX - width / 2, y: centerY - height / 2, w: width, h: height };
  }

  function navigatorDocumentBounds(app, canvas) {
    const page = app?.page?.();
    const renderer = app?.renderer;
    const content = renderer?.contentBounds?.(page);
    let bounds = content && [content.x, content.y, content.w, content.h].every(Number.isFinite) && content.w > 0 && content.h > 0
      ? { x: content.x, y: content.y, w: content.w, h: content.h }
      : { x: -400, y: -300, w: 800, h: 600 };
    const extent = Math.max(1, bounds.w, bounds.h);
    const pad = Math.max(24, extent * .08);
    bounds = { x: bounds.x - pad, y: bounds.y - pad, w: bounds.w + pad * 2, h: bounds.h + pad * 2 };
    return fitNavigatorBoundsToAspect(bounds, Math.max(.1, canvas.width / Math.max(1, canvas.height)));
  }

  function drawNavigatorDocument(app, canvas, bounds) {
    const context = canvas.getContext('2d');
    if (!context) return false;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#d8d8d8';
    context.fillRect(0, 0, canvas.width, canvas.height);
    const scale = canvas.width / Math.max(1, bounds.w);
    context.save();
    context.setTransform(scale, 0, 0, scale, -bounds.x * scale, -bounds.y * scale);
    try {
      app.renderer?.renderPageWorld?.(context, app.page(), { bounds, preferredScale: scale });
    } catch {
      context.fillStyle = app.page()?.paper?.color || '#fff';
      context.fillRect(bounds.x, bounds.y, bounds.w, bounds.h);
    }
    context.restore();
    return true;
  }

  function centerCameraOnWorld(app, worldPoint) {
    const renderer = app?.renderer;
    const camera = app?.page?.()?.camera;
    if (!renderer?.worldToScreen || !camera || !worldPoint) return false;
    const screen = renderer.worldToScreen(worldPoint);
    if (!screen) return false;
    camera.x += renderer.width / 2 - screen.x;
    camera.y += renderer.height / 2 - screen.y;
    return true;
  }

  function navigatorWorldFromClient(preview, bounds, clientX, clientY) {
    const rect = preview.getBoundingClientRect();
    return {
      x: bounds.x + (clientX - rect.left) / Math.max(1, rect.width) * bounds.w,
      y: bounds.y + (clientY - rect.top) / Math.max(1, rect.height) * bounds.h
    };
  }

  function renderShellNavigator() {
    const app = runtime();
    const canvas = document.querySelector('#shellNavigatorCanvas');
    const proxy = document.querySelector('#shellNavigatorProxy');
    const zoom = document.querySelector('#shellNavigatorZoom');
    const slider = document.querySelector('#shellNavigatorZoomSlider');
    if (!app?.page?.() || !app.renderer?.viewportWorldBounds || !canvas || !proxy || !zoom || !slider) return;
    const bounds = navigatorDocumentBounds(app, canvas);
    state.navigatorBounds = bounds;
    drawNavigatorDocument(app, canvas, bounds);
    const viewport = app.renderer.viewportWorldBounds();
    const proxyW = viewport.w / bounds.w * 100;
    const proxyH = viewport.h / bounds.h * 100;
    const proxyX = (viewport.x - bounds.x) / bounds.w * 100;
    const proxyY = (viewport.y - bounds.y) / bounds.h * 100;
    proxy.style.width = proxyW + '%';
    proxy.style.height = proxyH + '%';
    proxy.style.left = proxyX + '%';
    proxy.style.top = proxyY + '%';
    const scale = Math.min(24, Math.max(.03, Number(app.page().camera?.scale) || 1));
    const percent = Math.round(scale * 100);
    zoom.value = percent + '%';
    slider.value = String(percent);
    slider.setAttribute('aria-valuetext', zoom.value);
  }

  function libraryTools(app = runtime()) {
    return app?.inkPublicApi?.tools?.invoke ? app.inkPublicApi.tools : null;
  }

  function setLibraryStatus(message, stateName = 'ready') {
    const node = document.querySelector('#shellLibraryStatus');
    if (!node) return;
    node.textContent = String(message || '');
    node.dataset.state = stateName;
  }

  function selectedLibraryTargets(app) {
    const pageId = app?.page?.()?.id || app?.doc?.activePageId || '';
    return (app?.selection || []).map(ref => ({
      pageId,
      layerId: String(ref?.layerId || ''),
      objectId: String(ref?.objectId || '')
    })).filter(ref => ref.pageId && ref.layerId && ref.objectId);
  }

  function inspectLibraryItem(item) {
    const tools = libraryTools();
    const inspect = document.querySelector('#shellLibraryInspect');
    if (!tools || !inspect || !item?.ref) return false;
    const response = tools.invoke('search_ink_library', { action: 'inspect', ref: item.ref });
    const inspected = response?.result?.item || response?.result || null;
    inspect.value = JSON.stringify(inspected, null, 2);
    inspect.dataset.libraryInspectType = item.type || '';
    inspect.dataset.libraryInspectId = item.ref?.id || '';
    state.librarySelectedRef = item.ref;
    setLibraryStatus(response?.status === 'COMPLETED' ? 'Inspect · ' + (item.label || item.type) + ' · read-only' : 'Inspect failed', response?.status === 'COMPLETED' ? 'ready' : 'error');
    return response?.status === 'COMPLETED';
  }

  function proposeLibraryReuse(item) {
    const app = runtime();
    const tools = libraryTools(app);
    const reuse = item?.reuse;
    if (!app || !tools || reuse?.classification !== 'REUSE_AVAILABLE_EXISTING_AUTHORITY' || !reuse.operation) return null;
    const componentCreate = reuse.operation === 'component.instance.create.v1';
    const targets = componentCreate ? [] : selectedLibraryTargets(app);
    if (reuse.operation === 'path.material.apply.v1' && !targets.length) {
      setLibraryStatus('Select a Path before proposing material reuse', 'warn');
      return null;
    }
    const argumentsPayload = { ...(reuse.arguments || {}) };
    if (componentCreate) {
      const pageId = app.page?.()?.id || app.doc?.activePageId || '';
      const layerId = app.layer?.()?.id || app.page?.()?.activeLayerId || '';
      if (!pageId || !layerId) {
        setLibraryStatus('Active page/layer unavailable for component reuse', 'error');
        return null;
      }
      argumentsPayload.pageId = pageId;
      argumentsPayload.layerId = layerId;
    }
    const task = {
      taskId: 'library-panel-' + (++state.libraryProposalSequence),
      operation: reuse.operation,
      targets,
      arguments: argumentsPayload
    };
    const response = tools.invoke(reuse.namedTool || 'propose_ink_edit', { task });
    state.libraryLastProposal = response;
    const proposed = response?.status === 'PROPOSED';
    setLibraryStatus(proposed ? 'Proposal created · ' + reuse.operation + ' · not executed' : 'Proposal failed · ' + reuse.operation, proposed ? 'proposal' : 'error');
    return response;
  }

  function renderShellLibraries() {
    const app = runtime();
    const tools = libraryTools(app);
    const search = document.querySelector('#shellLibrarySearch');
    const root = document.querySelector('#shellLibraryResults');
    if (!app || !tools || !search || !root) return false;
    const types = [...state.libraryTypes];
    document.querySelectorAll('[data-library-type]').forEach(button => button.setAttribute('aria-pressed', String(state.libraryTypes.has(button.dataset.libraryType))));
    const response = tools.invoke('search_ink_library', { action: 'search', query: search.value || '', types, limit: 50 });
    const results = Array.isArray(response?.result?.results) ? response.result.results : [];
    state.libraryResults = results;
    root.innerHTML = '';
    for (const item of results) {
      const row = document.createElement('div');
      row.className = 'shell-library-result';
      row.dataset.libraryResultType = item.type || '';
      row.dataset.libraryResultId = item.ref?.id || '';
      row.setAttribute('role', 'option');
      const head = document.createElement('div');
      head.className = 'shell-library-result-head';
      const copy = document.createElement('span');
      const strong = document.createElement('strong');
      strong.textContent = item.label || item.ref?.id || item.type || 'Library item';
      const small = document.createElement('small');
      small.textContent = LIBRARY_TYPE_LABELS[item.type] || item.type || '';
      copy.append(strong, small);
      const actions = document.createElement('span');
      actions.className = 'shell-library-result-actions';
      const inspectButton = document.createElement('button');
      inspectButton.type = 'button';
      inspectButton.textContent = 'Inspect';
      inspectButton.addEventListener('click', () => inspectLibraryItem(item));
      actions.append(inspectButton);
      if (item.reuse?.classification === 'REUSE_AVAILABLE_EXISTING_AUTHORITY' && item.reuse?.operation) {
        const reuseButton = document.createElement('button');
        reuseButton.type = 'button';
        reuseButton.textContent = 'Use / Propose';
        reuseButton.dataset.libraryReuseType = item.type || '';
        reuseButton.dataset.libraryReuseOperation = item.reuse.operation;
        reuseButton.addEventListener('click', () => proposeLibraryReuse(item));
        actions.append(reuseButton);
      }
      head.append(copy, actions);
      row.append(head);
      root.append(row);
    }
    const matched = Number(response?.result?.totalMatched ?? results.length);
    setLibraryStatus(response?.status === 'COMPLETED' ? matched + ' matched · ' + results.length + ' shown' : 'Library search failed', response?.status === 'COMPLETED' ? 'ready' : 'error');
    return response?.status === 'COMPLETED';
  }

  function propertySelection(app = runtime()) {
    const selected = app?.selectedObjects?.() || [];
    return selected.length === 1 ? selected[0] : null;
  }

  function shellHex(value, fallback = '#202020') {
    const text = String(value || '');
    return /^#[0-9a-f]{6}$/i.test(text) ? text : fallback;
  }

  function defaultFrameLayout(object) {
    const current = object?.layout;
    if (current?.schema === 'INK-LAYOUT-1') return current;
    return {
      schema: 'INK-LAYOUT-1',
      mode: 'manual',
      gap: 0,
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
      align: { main: 'start', cross: 'start' },
      sizing: { horizontal: 'fixed', vertical: 'fixed' }
    };
  }

  function defaultLayoutItem(object) {
    const current = object?.layoutItem;
    if (current?.schema === 'INK-LAYOUT-ITEM-1') return current;
    return {
      schema: 'INK-LAYOUT-ITEM-1',
      participation: 'flow',
      sizing: { horizontal: 'hug', vertical: 'hug' },
      fixedSize: { width: Math.max(1, Number(object?.w ?? object?.width) || 1), height: Math.max(1, Number(object?.h ?? object?.height) || 1) },
      constraints: { horizontal: 'start', vertical: 'start' }
    };
  }

  function componentSourceNodes(root, output = []) {
    if (!root || typeof root !== 'object') return output;
    if (root.id) output.push(root);
    for (const child of root.children || []) componentSourceNodes(child, output);
    return output;
  }

  function renderShellProperties() {
    const app = runtime();
    const found = propertySelection(app);
    const object = found?.object || null;

    const pathCard = document.querySelector('#shellPathAppearance');
    const materialCard = document.querySelector('#shellMaterialCard');
    const pathActive = object?.type === 'path';
    if (pathCard) pathCard.hidden = !pathActive;
    if (materialCard) materialCard.hidden = !pathActive;
    if (pathActive) {
      const fill = document.querySelector('#shellPathFill');
      const stroke = document.querySelector('#shellPathStroke');
      const opacity = document.querySelector('#shellPathOpacity');
      const opacityOutput = document.querySelector('#shellPathOpacityOutput');
      if (fill) fill.value = shellHex(object.fill, '#202020');
      if (stroke) stroke.value = shellHex(object.stroke, '#202020');
      const opacityPercent = Math.round(Math.min(1, Math.max(0, Number(object.opacity ?? 1))) * 100);
      if (opacity) opacity.value = String(opacityPercent);
      if (opacityOutput) opacityOutput.value = opacityPercent + '%';

      const materialSelect = document.querySelector('#shellMaterialSelect');
      if (materialSelect) {
        const selected = materialSelect.value;
        materialSelect.innerHTML = '';
        for (const template of app?.doc?.materialLibrary?.templates || []) {
          if (!template?.templateId) continue;
          const option = document.createElement('option');
          option.value = template.templateId;
          option.textContent = template.name || template.label || template.semanticRole || template.templateId;
          materialSelect.append(option);
        }
        if ([...materialSelect.options].some(option => option.value === selected)) materialSelect.value = selected;
        else if (object.materialAppearance?.templateId && [...materialSelect.options].some(option => option.value === object.materialAppearance.templateId)) materialSelect.value = object.materialAppearance.templateId;
      }
      const stateNode = document.querySelector('#shellMaterialState');
      if (stateNode) stateNode.textContent = object.materialAppearance?.templateId ? 'Applied · ' + object.materialAppearance.templateId : 'No material';
      const apply = document.querySelector('#shellMaterialApply');
      if (apply) apply.disabled = !(materialSelect?.value);
      const remove = document.querySelector('#shellMaterialRemove');
      if (remove) remove.disabled = !object.materialAppearance;
    }

    const frameCard = document.querySelector('#shellFrameLayout');
    const frameActive = object?.type === 'frame';
    if (frameCard) frameCard.hidden = !frameActive;
    if (frameActive) {
      const layout = defaultFrameLayout(object);
      const mode = document.querySelector('#shellFrameLayoutMode');
      const gap = document.querySelector('#shellFrameLayoutGap');
      const padding = document.querySelector('#shellFrameLayoutPadding');
      if (mode) mode.value = layout.mode;
      if (gap) gap.value = String(layout.gap ?? 0);
      if (padding) padding.value = String(layout.padding?.top ?? 0);
    }

    const itemCard = document.querySelector('#shellLayoutItem');
    const itemActive = Boolean(object && found?.parentObject?.type === 'frame');
    if (itemCard) itemCard.hidden = !itemActive;
    if (itemActive) {
      const item = defaultLayoutItem(object);
      const participation = document.querySelector('#shellLayoutParticipation');
      const horizontal = document.querySelector('#shellLayoutHorizontal');
      const vertical = document.querySelector('#shellLayoutVertical');
      if (participation) participation.value = item.participation;
      if (horizontal) horizontal.value = item.sizing.horizontal;
      if (vertical) vertical.value = item.sizing.vertical;
    }

    const componentCard = document.querySelector('#shellComponentState');
    const componentActive = object?.type === 'component-instance';
    if (componentCard) componentCard.hidden = !componentActive;
    if (componentActive) {
      const definition = (app?.doc?.components?.definitions || []).find(item => item?.id === object.definitionId) || null;
      const source = definition ? app.findObject?.({ objectId: definition.sourceRootId }) : null;
      const nodes = componentSourceNodes(source?.object);
      const readout = document.querySelector('#shellComponentReadout');
      if (readout) readout.textContent = (definition?.name || object.definitionId || 'Component') + ' · ' + Object.keys(object.overrides || {}).length + ' override(s)';
      const select = document.querySelector('#shellComponentOverrideNode');
      if (select) {
        const selected = select.value;
        select.innerHTML = '';
        for (const node of nodes) {
          const option = document.createElement('option');
          option.value = node.id;
          option.textContent = node.name || node.id;
          select.append(option);
        }
        if ([...select.options].some(option => option.value === selected)) select.value = selected;
      }
      const apply = document.querySelector('#shellComponentOverrideApply');
      const reset = document.querySelector('#shellComponentOverrideReset');
      if (apply) apply.disabled = !select?.value;
      if (reset) reset.disabled = !select?.value;
    }
  }

  function mutateFrameLayoutFromShell() {
    const app = runtime();
    const found = propertySelection(app);
    if (!app || found?.object?.type !== 'frame') return false;
    const current = defaultFrameLayout(found.object);
    const mode = document.querySelector('#shellFrameLayoutMode')?.value || current.mode;
    const gap = Math.max(0, Number(document.querySelector('#shellFrameLayoutGap')?.value) || 0);
    const pad = Math.max(0, Number(document.querySelector('#shellFrameLayoutPadding')?.value) || 0);
    const next = {
      ...current,
      schema: 'INK-LAYOUT-1',
      mode,
      gap,
      padding: { top: pad, right: pad, bottom: pad, left: pad }
    };
    const target = app.objectPath?.(found);
    if (!target || !app.history?.pushScoped) return false;
    app.history.pushScoped('調整 Frame Layout', [target], () => { found.object.layout = next; });
    app.refreshAll?.();
    renderShellProperties();
    return true;
  }

  function mutateLayoutItemFromShell() {
    const app = runtime();
    const found = propertySelection(app);
    if (!app || !found?.object || found?.parentObject?.type !== 'frame') return false;
    const current = defaultLayoutItem(found.object);
    const next = {
      ...current,
      schema: 'INK-LAYOUT-ITEM-1',
      participation: document.querySelector('#shellLayoutParticipation')?.value || current.participation,
      sizing: {
        ...current.sizing,
        horizontal: document.querySelector('#shellLayoutHorizontal')?.value || current.sizing.horizontal,
        vertical: document.querySelector('#shellLayoutVertical')?.value || current.sizing.vertical
      }
    };
    const target = app.objectPath?.(found);
    if (!target || !app.history?.pushScoped) return false;
    app.history.pushScoped('調整 Layout Item', [target], () => { found.object.layoutItem = next; });
    app.refreshAll?.();
    renderShellProperties();
    return true;
  }

  function renderShellLayerHierarchyControls() {
    const app = runtime();
    if (!app) return false;
    document.querySelectorAll('#layersList [data-object-id]').forEach(row => {
      const found = app.findObject?.({ objectId: row.dataset.objectId });
      const existing = row.querySelector('[data-reparent-action]');
      if (found?.parentObject?.type !== 'frame') {
        existing?.remove();
        return;
      }
      if (existing) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'tree-state-button shell-reparent-button';
      button.dataset.reparentAction = 'root';
      button.title = '移出 Frame';
      button.setAttribute('aria-label', '移出 Frame');
      button.textContent = '↱';
      button.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        app.reparentObjectToFrame?.(found.object.id, null);
        requestAnimationFrame(renderShellLayerHierarchyControls);
      });
      row.append(button);
    });
    return true;
  }

  function syncSupplementalPanels() {
    const app = runtime();
    if (!state.root) return;
    const hasDocument = Boolean(app?.doc);
    state.root.dataset.documentActive = String(hasDocument);
    const title = document.querySelector('#documentTabTitle');
    if (title && hasDocument) title.textContent = app.doc.title || document.querySelector('#docTitle')?.value || '未命名作品';
    const active = currentPanel();
    if (active === 'pages') renderShellPages();
    else if (active === 'navigator') renderShellNavigator();
    else if (active === 'libraries') renderShellLibraries();
    else if (active === 'properties') renderShellProperties();
    else if (active === 'layers') renderShellLayerHierarchyControls();
    else if (active === 'color') {
      const current = document.querySelector('#colorInput')?.value || '#202020';
      const color = document.querySelector('#shellColorInput');
      const hex = document.querySelector('#shellColorHex');
      if (color) color.value = current;
      if (hex) hex.value = current.toUpperCase();
    }
  }

  function bindSupplementalPanelControls() {
    const app = runtime();
    if (!app) return false;
    const bindChange = (selector, handler) => {
      const node = document.querySelector(selector);
      if (!node || node.dataset.shellChangeBound === 'true') return;
      node.dataset.shellChangeBound = 'true';
      node.addEventListener('change', handler);
    };
    bindChange('#shellPathFill', event => { app.repaintSelectedPaths?.({ fill: event.target.value }); renderShellProperties(); });
    bindChange('#shellPathStroke', event => { app.repaintSelectedPaths?.({ stroke: event.target.value }); renderShellProperties(); });
    const shellPathOpacity = document.querySelector('#shellPathOpacity');
    if (shellPathOpacity && shellPathOpacity.dataset.shellOpacityBound !== 'true') {
      shellPathOpacity.dataset.shellOpacityBound = 'true';
      shellPathOpacity.addEventListener('input', event => {
        const output = document.querySelector('#shellPathOpacityOutput');
        if (output) output.value = event.target.value + '%';
      });
      shellPathOpacity.addEventListener('change', event => { app.repaintSelectedPaths?.({ opacity: Number(event.target.value) / 100 }); renderShellProperties(); });
    }
    bindChange('#shellFrameLayoutMode', mutateFrameLayoutFromShell);
    bindChange('#shellFrameLayoutGap', mutateFrameLayoutFromShell);
    bindChange('#shellFrameLayoutPadding', mutateFrameLayoutFromShell);
    bindChange('#shellLayoutParticipation', mutateLayoutItemFromShell);
    bindChange('#shellLayoutHorizontal', mutateLayoutItemFromShell);
    bindChange('#shellLayoutVertical', mutateLayoutItemFromShell);

    const materialApply = document.querySelector('#shellMaterialApply');
    if (materialApply && materialApply.dataset.bound !== 'true') {
      materialApply.dataset.bound = 'true';
      materialApply.addEventListener('click', () => {
        const found = propertySelection(app);
        const templateId = document.querySelector('#shellMaterialSelect')?.value;
        const template = (app.doc?.materialLibrary?.templates || []).find(item => item?.templateId === templateId);
        if (!found || found.object?.type !== 'path' || !templateId) return;
        app.applySelectedPathMaterial?.({
          templateId,
          ...(template?.templateVersion ? { templateVersion: template.templateVersion } : {})
        });
        renderShellProperties();
      });
    }
    const materialRemove = document.querySelector('#shellMaterialRemove');
    if (materialRemove && materialRemove.dataset.bound !== 'true') {
      materialRemove.dataset.bound = 'true';
      materialRemove.addEventListener('click', () => { app.clearSelectedPathMaterial?.(); renderShellProperties(); });
    }

    const componentOpacity = document.querySelector('#shellComponentOverrideOpacity');
    if (componentOpacity && componentOpacity.dataset.shellOpacityBound !== 'true') {
      componentOpacity.dataset.shellOpacityBound = 'true';
      componentOpacity.addEventListener('input', event => {
        const output = document.querySelector('#shellComponentOverrideOpacityOutput');
        if (output) output.value = event.target.value + '%';
      });
    }
    const componentApply = document.querySelector('#shellComponentOverrideApply');
    if (componentApply && componentApply.dataset.bound !== 'true') {
      componentApply.dataset.bound = 'true';
      componentApply.addEventListener('click', () => {
        const found = propertySelection(app);
        const nodeId = document.querySelector('#shellComponentOverrideNode')?.value;
        const opacity = Number(document.querySelector('#shellComponentOverrideOpacity')?.value) / 100;
        if (found?.object?.type !== 'component-instance' || !nodeId || !Number.isFinite(opacity)) return;
        app.overrideInstance?.(found.object.id, nodeId, Math.min(1, Math.max(0, opacity)));
        renderShellProperties();
      });
    }
    const componentReset = document.querySelector('#shellComponentOverrideReset');
    if (componentReset && componentReset.dataset.bound !== 'true') {
      componentReset.dataset.bound = 'true';
      componentReset.addEventListener('click', () => {
        const found = propertySelection(app);
        const nodeId = document.querySelector('#shellComponentOverrideNode')?.value;
        if (found?.object?.type !== 'component-instance' || !nodeId) return;
        app.overrideInstance?.(found.object.id, nodeId, null);
        renderShellProperties();
      });
    }

    const propertyRefreshHost = document.querySelector('#selectionControls');
    if (propertyRefreshHost && propertyRefreshHost.dataset.shellPropertyRefreshBound !== 'true') {
      propertyRefreshHost.dataset.shellPropertyRefreshBound = 'true';
      document.addEventListener('pointerup', () => {
        if (currentPanel() === 'properties') requestAnimationFrame(renderShellProperties);
        else if (currentPanel() === 'layers') requestAnimationFrame(renderShellLayerHierarchyControls);
      }, { passive: true });
    }

    const librarySearch = document.querySelector('#shellLibrarySearch');
    if (librarySearch && librarySearch.dataset.bound !== 'true') {
      librarySearch.dataset.bound = 'true';
      librarySearch.addEventListener('input', renderShellLibraries);
    }
    document.querySelectorAll('[data-library-type]').forEach(button => {
      if (button.dataset.bound === 'true') return;
      button.dataset.bound = 'true';
      button.addEventListener('click', () => {
        const type = button.dataset.libraryType;
        if (!LIBRARY_TYPES.includes(type)) return;
        if (state.libraryTypes.has(type)) {
          if (state.libraryTypes.size > 1) state.libraryTypes.delete(type);
        } else state.libraryTypes.add(type);
        renderShellLibraries();
      });
    });
    const pageList = document.querySelector('#shellPagesList');
    if (pageList && pageList.dataset.bound !== 'true') {
      pageList.dataset.bound = 'true';
      pageList.addEventListener('click', event => {
        const row = event.target.closest('[data-page-id]');
        if (!row) return;
        app.switchPage?.(row.dataset.pageId);
        renderShellPages();
      });
      pageList.addEventListener('dblclick', event => {
        const row = event.target.closest('[data-page-id]');
        const page = (app.doc.pages || []).find(item => item.id === row?.dataset.pageId);
        if (page) app.pageContextMenu?.(page);
        renderShellPages();
      });
    }
    const bind = (id, fn) => {
      const node = document.querySelector(id);
      if (!node || node.dataset.bound === 'true') return;
      node.dataset.bound = 'true';
      node.addEventListener('click', fn);
    };
    bind('#shellPagesAdd', () => { app.addPage?.(); renderShellPages(); });
    bind('#shellPagesDuplicate', () => { app.duplicatePage?.(); renderShellPages(); });
    bind('#shellPagesDelete', () => { app.deletePage?.(); renderShellPages(); });
    bind('#shellNavigatorFit', () => { app.fitContent?.(); renderShellNavigator(); });
    bind('#shellNavigatorZoomOut', () => { app.zoomBy?.(1 / 1.2); renderShellNavigator(); });
    bind('#shellNavigatorZoomIn', () => { app.zoomBy?.(1.2); renderShellNavigator(); });
    const zoomSlider = document.querySelector('#shellNavigatorZoomSlider');
    if (zoomSlider && zoomSlider.dataset.bound !== 'true') {
      zoomSlider.dataset.bound = 'true';
      zoomSlider.addEventListener('input', event => {
        const requested = Math.min(24, Math.max(.03, Number(event.target.value) / 100 || 1));
        const current = Math.min(24, Math.max(.03, Number(app.page?.().camera?.scale) || 1));
        if (Math.abs(requested - current) > 1e-6) app.zoomBy?.(requested / current);
        renderShellNavigator();
      });
    }

    const color = document.querySelector('#shellColorInput');
    const hex = document.querySelector('#shellColorHex');
    if (color && color.dataset.bound !== 'true') {
      color.dataset.bound = 'true';
      color.addEventListener('input', event => { app.setColor?.(event.target.value, false); if (hex) hex.value = event.target.value.toUpperCase(); });
    }
    if (hex && hex.dataset.bound !== 'true') {
      hex.dataset.bound = 'true';
      hex.addEventListener('change', event => { app.setColor?.(event.target.value, true); syncSupplementalPanels(); });
    }

    const proxy = document.querySelector('#shellNavigatorProxy');
    const preview = document.querySelector('#shellNavigatorPreview');
    if (preview && preview.dataset.clickBound !== 'true') {
      preview.dataset.clickBound = 'true';
      preview.addEventListener('pointerdown', event => {
        if (event.button !== 0 || event.target.closest?.('#shellNavigatorProxy')) return;
        const bounds = state.navigatorBounds || navigatorDocumentBounds(app, document.querySelector('#shellNavigatorCanvas'));
        const target = navigatorWorldFromClient(preview, bounds, event.clientX, event.clientY);
        if (centerCameraOnWorld(app, target)) app.renderer?.render?.();
        syncViewOverlaysSoon();
        event.preventDefault();
      });
    }
    if (proxy && preview && proxy.dataset.bound !== 'true') {
      proxy.dataset.bound = 'true';
      let start = null;
      proxy.addEventListener('pointerdown', event => {
        const viewport = app.renderer?.viewportWorldBounds?.();
        const bounds = state.navigatorBounds || navigatorDocumentBounds(app, document.querySelector('#shellNavigatorCanvas'));
        if (!viewport || !bounds) return;
        start = {
          x: event.clientX,
          y: event.clientY,
          centerX: viewport.x + viewport.w / 2,
          centerY: viewport.y + viewport.h / 2,
          bounds: { ...bounds }
        };
        proxy.setPointerCapture?.(event.pointerId);
        proxy.classList.add('dragging');
        event.preventDefault();
      });
      proxy.addEventListener('pointermove', event => {
        if (!start) return;
        const rect = preview.getBoundingClientRect();
        const target = {
          x: start.centerX + (event.clientX - start.x) / Math.max(1, rect.width) * start.bounds.w,
          y: start.centerY + (event.clientY - start.y) / Math.max(1, rect.height) * start.bounds.h
        };
        if (centerCameraOnWorld(app, target)) app.renderer?.render?.();
        syncViewOverlaysSoon();
      });
      const end = event => {
        if (!start) return;
        start = null;
        proxy.releasePointerCapture?.(event.pointerId);
        proxy.classList.remove('dragging');
        syncViewOverlaysSoon();
      };
      proxy.addEventListener('pointerup', end);
      proxy.addEventListener('pointercancel', end);
    }
    return true;
  }

  function setPrimaryPanelWidth(width, { persist = true } = {}) {
    const next = Math.max(MIN_PRIMARY_PANEL_WIDTH, Math.min(MAX_PRIMARY_PANEL_WIDTH, Math.round(Number(width) || DEFAULT_PRIMARY_PANEL_WIDTH)));
    state.root?.style.setProperty('--inspector-w', next + 'px');
    const app = runtime();
    if (app) {
      app.inspectorWide = next > 370;
      if (!app.inspectorWide) app.inspectorNormalWidth = next;
      document.querySelector('#inspectorSizeToggle')?.classList.toggle('active', app.inspectorWide);
    }
    if (persist && (!app || !app.inspectorWide)) {
      try { localStorage.setItem('ink-inspector-width', String(next)); } catch {}
    }
    syncSoon();
    return next;
  }

  function ensureActivePanelResizeEdge() {
    if (state.activePanelResizer?.isConnected) return state.activePanelResizer;
    const root = state.root || document.querySelector('#app');
    if (!root) return null;
    const edge = document.createElement('div');
    edge.id = 'shellActivePanelResizer';
    edge.className = 'active-panel-resizer';
    edge.setAttribute('role', 'separator');
    edge.setAttribute('aria-orientation', 'vertical');
    edge.setAttribute('aria-label', '調整面板寬度');
    edge.setAttribute('aria-valuemin', String(MIN_PRIMARY_PANEL_WIDTH));
    edge.setAttribute('aria-valuemax', String(MAX_PRIMARY_PANEL_WIDTH));
    let active = false;
    const move = event => {
      if (!active) return;
      const rootRect = root.getBoundingClientRect();
      setPrimaryPanelWidth(rootRect.right - event.clientX, { persist: false });
      syncLayout();
    };
    const end = () => {
      if (!active) return;
      active = false;
      root.classList.remove('panel-width-resizing');
      const app = runtime();
      if (!app?.inspectorWide && Number.isFinite(app?.inspectorNormalWidth)) {
        try { localStorage.setItem('ink-inspector-width', String(Math.round(app.inspectorNormalWidth))); } catch {}
      }
      globalThis.removeEventListener('pointermove', move);
      globalThis.removeEventListener('pointerup', end);
      syncSoon();
    };
    edge.addEventListener('pointerdown', event => {
      if (!isDesktop() || !root.classList.contains('panel-primary-open')) return;
      event.preventDefault();
      active = true;
      root.classList.add('panel-width-resizing');
      globalThis.addEventListener('pointermove', move);
      globalThis.addEventListener('pointerup', end);
    });
    root.append(edge);
    state.activePanelResizer = edge;
    return edge;
  }

  function ensurePanelStackFramework() {
    if (state.panelStackHost?.isConnected) return state.panelStackHost;
    const root = state.root || document.querySelector('#app');
    if (!root) return null;
    const host = document.createElement('div');
    host.id = 'shellPanelStackFramework';
    host.className = 'panel-stack-framework';
    host.dataset.panelRegistry = 'PANEL_GROUPS';
    host.setAttribute('aria-label', 'Expanded panel groups');
    host.innerHTML = PANEL_GROUPS.map((group, index) =>
      (index ? '<div class="panel-stack-splitter" data-panel-stack-splitter="' + group.id + '" role="separator" aria-orientation="horizontal"></div>' : '') +
      '<section class="panel-stack-region" data-panel-stack-group="' + group.id + '">' +
      '<button type="button" class="panel-stack-region-head" data-panel-stack-target="' + group.items[0].id + '">' +
      '<span>' + group.label + '</span><span class="panel-stack-region-current" data-panel-stack-current></span></button></section>'
    ).join('');
    host.addEventListener('click', event => {
      const trigger = event.target.closest('[data-panel-stack-target]');
      if (!trigger) return;
      event.preventDefault();
      selectPanel(trigger.dataset.panelStackTarget);
    });
    let stackDrag = null;
    const stackMove = event => {
      if (!stackDrag) return;
      const delta = event.clientY - stackDrag.startY;
      const previous = Math.max(24, stackDrag.previousHeight + delta);
      const next = Math.max(24, stackDrag.nextHeight - delta);
      stackDrag.previous.style.flexBasis = previous + 'px';
      stackDrag.next.style.flexBasis = next + 'px';
      host.classList.add('stack-resizing');
      event.preventDefault();
    };
    const stackEnd = () => {
      if (!stackDrag) return;
      stackDrag = null;
      host.classList.remove('stack-resizing');
      globalThis.removeEventListener('pointermove', stackMove);
      globalThis.removeEventListener('pointerup', stackEnd);
      globalThis.removeEventListener('pointercancel', stackEnd);
    };
    host.addEventListener('pointerdown', event => {
      const splitter = event.target.closest('[data-panel-stack-splitter]');
      if (!splitter || !isDesktop()) return;
      const previous = splitter.previousElementSibling;
      const next = splitter.nextElementSibling;
      if (!previous?.matches('.panel-stack-region') || !next?.matches('.panel-stack-region')) return;
      stackDrag = {
        startY: event.clientY,
        previous,
        next,
        previousHeight: previous.getBoundingClientRect().height,
        nextHeight: next.getBoundingClientRect().height
      };
      globalThis.addEventListener('pointermove', stackMove);
      globalThis.addEventListener('pointerup', stackEnd);
      globalThis.addEventListener('pointercancel', stackEnd);
      event.preventDefault();
    });
    host.hidden = true;
    root.append(host);
    state.panelStackHost = host;
    return host;
  }

  function syncPanelStackFramework(active, panel, desktop) {
    const host = ensurePanelStackFramework();
    if (!host || !state.root) return;
    const activeDef = active ? PANEL_DEFS.find(def => def.id === active) : null;
    if (!desktop || !panel || !activeDef) {
      host.hidden = true;
      if (host.parentElement !== state.root) state.root.append(host);
      return;
    }
    if (host.parentElement !== panel) panel.append(host);
    host.hidden = false;
    host.querySelectorAll('[data-panel-stack-group]').forEach(region => {
      const group = PANEL_GROUPS.find(item => item.id === region.dataset.panelStackGroup);
      const isActive = group?.id === activeDef.group;
      region.classList.toggle('active', isActive);
      const current = region.querySelector('[data-panel-stack-current]');
      if (current) current.textContent = isActive ? activeDef.label : (group?.items?.[0]?.label || '');
    });
  }

  function createPanelOptionsMenu() {
    if (document.querySelector('#shellPanelOptionsMenu')) return document.querySelector('#shellPanelOptionsMenu');
    const root = document.querySelector('#app');
    if (!root) return null;
    const menu = document.createElement('div');
    menu.id = 'shellPanelOptionsMenu';
    menu.className = 'panel-options-menu';
    menu.setAttribute('role', 'menu');
    menu.hidden = true;
    menu.innerHTML =
      '<button type="button" role="menuitem" data-panel-option="reset-width">重設面板寬度</button>' +
      '<span class="application-menu-separator" aria-hidden="true"></span>' +
      '<button type="button" role="menuitem" data-panel-option="close">關閉面板</button>';
    root.append(menu);
    menu.addEventListener('click', event => {
      const item = event.target.closest('[data-panel-option]');
      if (!item) return;
      if (item.dataset.panelOption === 'reset-width') {
        setPrimaryPanelWidth(DEFAULT_PRIMARY_PANEL_WIDTH, { persist: true });
      } else if (item.dataset.panelOption === 'close') closePrimaryPanels();
      menu.hidden = true;
    });
    document.addEventListener('pointerdown', event => {
      if (menu.hidden || event.target.closest('#shellPanelOptionsMenu') || event.target.closest('[data-panel-options-trigger]')) return;
      menu.hidden = true;
    });
    state.panelOptionsMenu = menu;
    return menu;
  }

  function ensurePanelOptionsTriggers() {
    const menu = createPanelOptionsMenu();
    const heads = [
      document.querySelector('#inspector .inspector-head'),
      document.querySelector('#creativeWorkspace .creative-workspace-head')
    ].filter(Boolean);
    for (const head of heads) {
      if (head.querySelector('[data-panel-options-trigger]')) continue;
      const actions = head.querySelector('.header-actions') || head;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'mini-button panel-options-trigger';
      button.dataset.panelOptionsTrigger = 'true';
      button.setAttribute('aria-label', '面板選項');
      button.title = '面板選項';
      button.innerHTML = '<svg aria-hidden="true"><use href="#i-more"></use></svg>';
      actions.append(button);
      button.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        const rootRect = state.root.getBoundingClientRect();
        const rect = button.getBoundingClientRect();
        menu.style.left = Math.max(4, Math.round(rect.right - rootRect.left - 162)) + 'px';
        menu.style.top = Math.round(rect.bottom - rootRect.top + 1) + 'px';
        menu.hidden = !menu.hidden;
      });
    }
    return true;
  }

  function createDock() {
    if (document.querySelector('#panelDock')) return document.querySelector('#panelDock');
    const appRoot = document.querySelector('#app');
    if (!appRoot) return null;
    const dock = document.createElement('nav');
    dock.id = 'panelDock';
    dock.className = 'panel-dock';
    dock.dataset.uiHome = 'panels';
    dock.dataset.uiRoute = 'PRIMARY_HOME';
    dock.setAttribute('aria-label', '面板 Dock');
    dock.innerHTML = PANEL_GROUPS.map((group, index) =>
      (index ? '<div class="panel-dock-separator" aria-hidden="true"></div>' : '') +
      '<div class="panel-dock-group ' + group.id + '" data-panel-group="' + group.id +
      '" aria-label="' + group.label + '">' +
      group.items.map(def => buttonMarkup(def)).join('') +
      '</div>'
    ).join('');
    dock.addEventListener('click', event => {
      const button = event.target.closest('[data-shell-panel]');
      if (!button) return;
      event.preventDefault();
      togglePanel(button.dataset.shellPanel);
    });
    appRoot.append(dock);
    state.dock = dock;
    return dock;
  }

  function createWindowMenu() {
    const existing = document.querySelector('#panelWindowMenu');
    if (existing) {
      state.windowMenu = existing;
      state.windowButton = document.querySelector('#windowMenuToggle');
      return existing;
    }
    const appRoot = document.querySelector('#app');
    if (!appRoot) return null;
    const menu = document.createElement('div');
    menu.id = 'panelWindowMenu';
    menu.className = 'panel-window-menu';
    menu.dataset.uiHome = 'panels';
    menu.dataset.uiRoute = 'SECONDARY_ROUTE';
    menu.setAttribute('role', 'menu');
    menu.setAttribute('aria-label', '視窗');
    menu.hidden = true;
    menu.innerHTML = PANEL_GROUPS.map(group =>
      '<div class="panel-window-group" data-panel-group="' + group.id + '">' +
      '<div class="panel-window-group-label">' + group.label + '</div>' +
      group.items.map(def => buttonMarkup(def, true)).join('') +
      '</div>'
    ).join('');
    appRoot.append(menu);
    state.windowMenu = menu;
    state.windowButton = document.querySelector('#windowMenuToggle');
    return menu;
  }

  function positionWindowMenu() {
    if (!state.windowMenu || state.windowMenu.hidden || !state.windowButton) return;
    const rootRect = state.root.getBoundingClientRect();
    const rect = state.windowButton.getBoundingClientRect();
    state.windowMenu.style.left = Math.max(4, Math.round(rect.left - rootRect.left)) + 'px';
    state.windowMenu.style.top = Math.round(rect.bottom - rootRect.top) + 'px';
  }

  function observedPanel() {
    const app = runtime();
    if (!app || !state.root) return null;
    const creative = app.creativeWorkspace;
    if (creative?.open) {
      const stage = creative.stage;
      return PANEL_DEFS.some(def => def.kind === 'creative' && def.stage === stage) ? stage : null;
    }
    if (state.root.classList.contains('inspector-open')) {
      const tab = state.root.dataset.panel;
      const direct = PANEL_DEFS.find(def => def.kind === 'inspector' && def.tab === tab && !['ai', 'studio'].includes(tab));
      if (direct) return direct.id;
      if (tab === 'ai' || tab === 'studio') return 'specialist';
      return 'properties';
    }
    return null;
  }

  function currentPanel() {
    if (isDesktop()) return state.activePanel === 'collapsed' ? null : state.activePanel;
    return observedPanel();
  }

  function isPanelOpen(id) {
    return currentPanel() === id;
  }

  function closePrimaryPanels() {
    const app = runtime();
    if (!app) return false;
    state.activePanel = 'collapsed';
    app.creativeWorkspace?.setOpen?.(false);
    app.toggleInspector?.(false);
    syncSoon();
    return true;
  }

  function showInspector(def) {
    const app = runtime();
    if (!app) return false;
    app.creativeWorkspace?.setOpen?.(false);
    if (def.id === 'properties') app.toggleInspector?.(true, app.selection?.length ? 'object' : 'brush');
    else if (def.id === 'specialist') {
      const currentTab = state.root?.dataset.panel;
      app.toggleInspector?.(true, currentTab === 'ai' || currentTab === 'studio' ? currentTab : def.tab);
    } else app.toggleInspector?.(true, def.tab || def.id);
    return true;
  }

  function showCreative(def) {
    const app = runtime();
    const creative = app?.creativeWorkspace;
    if (!app || !creative) return false;
    app.toggleInspector?.(false);
    creative.setStage?.(def.stage);
    creative.setOpen?.(true);
    return true;
  }

  function rememberPanel(id) {
    state.lastPanel = id;
    try { localStorage.setItem(LAST_PANEL_KEY, id); } catch {}
  }

  function selectPanel(id) {
    const def = PANEL_DEFS.find(item => item.id === id);
    if (!def || !runtime()) return false;
    if (isPanelOpen(id)) {
      rememberPanel(id);
      syncSoon();
      return true;
    }
    const opened = def.kind === 'inspector' ? showInspector(def) : showCreative(def);
    if (opened) {
      state.activePanel = id;
      rememberPanel(id);
      syncSoon();
    }
    return opened;
  }

  function togglePanel(id) {
    if (isPanelOpen(id)) {
      closePrimaryPanels();
      return true;
    }
    return selectPanel(id);
  }

  function activePanelElement() {
    const app = runtime();
    if (!app) return null;
    if (app.creativeWorkspace?.open) return document.querySelector('#creativeWorkspace');
    if (state.root?.classList.contains('inspector-open')) return document.querySelector('#inspector');
    return null;
  }

  function bindInspectorCloseControl() {
    const button = document.querySelector('#closeInspector');
    if (!button) return false;
    if (button.dataset.shellCloseBound === 'true') return true;
    button.dataset.shellCloseBound = 'true';
    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      closePrimaryPanels();
    });
    return true;
  }

  function syncCreativePresentation() {
    const app = runtime();
    const creative = document.querySelector('#creativeWorkspace');
    if (!app?.creativeWorkspace || !creative) return;
    const stage = app.creativeWorkspace.stage || 'reference';
    creative.dataset.shellStage = stage;
    const def = PANEL_DEFS.find(item => item.kind === 'creative' && item.stage === stage);
    const label = def?.label || (stage === 'edit' ? 'Edit' : 'Creative Workspace');
    const title = creative.querySelector('.creative-workspace-head strong');
    if (title) title.textContent = label;
    creative.setAttribute('aria-label', 'INK ' + label);
  }

  function syncInspectorPresentation(active) {
    const title = document.querySelector('#inspectorTitle');
    if (!title) return;
    const tab = state.root?.dataset.panel;
    if (active === 'specialist') {
      title.textContent = tab === 'studio' ? '進階製作／診斷' : 'AI／連線與計畫';
      return;
    }
    if (active === 'properties') {
      title.textContent = tab === 'object' ? '物件屬性' : tab === 'geometry' ? 'Path／Repeat' : '工具屬性';
      return;
    }
    const def = PANEL_DEFS.find(item => item.id === active);
    if (def) title.textContent = def.label;
  }

  function syncLayout() {
    if (!state.root) return;
    const active = currentPanel();
    const panel = activePanelElement();
    const layoutMode = resolveLayoutMode();
    const desktop = layoutMode !== LAYOUT_MODES.COMPACT;
    state.root.dataset.layoutMode = layoutMode;
    let width = 0;
    if (desktop && panel) {
      const rect = panel.getBoundingClientRect();
      if (rect.width > 0) width = Math.round(rect.width);
    }
    state.root.style.setProperty('--active-panel-w', width + 'px');
    state.root.classList.toggle('panel-primary-open', Boolean(desktop && panel && width));
    state.root.dataset.shellPanel = active || 'collapsed';
    const responsiveInspectorToggle = document.querySelector('#inspectorToggle');
    responsiveInspectorToggle?.setAttribute('aria-expanded', String(Boolean(state.root.classList.contains('inspector-open'))));
    document.querySelectorAll('[data-shell-panel]').forEach(button => {
      const pressed = button.dataset.shellPanel === active;
      button.classList.toggle('active', pressed);
      button.setAttribute('aria-pressed', String(pressed));
    });
    const activeDef = active ? PANEL_DEFS.find(def => def.id === active) : null;
    syncPanelStackFramework(active, panel, desktop);
    const sharedResizer = ensureActivePanelResizeEdge();
    if (sharedResizer) sharedResizer.setAttribute('aria-valuenow', String(width || DEFAULT_PRIMARY_PANEL_WIDTH));
    state.dock?.querySelectorAll('[data-panel-group]').forEach(group => {
      group.classList.toggle('group-active', group.dataset.panelGroup === activeDef?.group);
    });
    syncInspectorPresentation(active);
    if (state.windowMenu && !state.windowMenu.hidden) positionWindowMenu();
    syncCreativePresentation();
    syncContextualOptions();
    syncSupplementalPanels();
    renderDocumentRulers();
    ensurePanelOptionsTriggers();
  }

  function syncSoon() {
    requestAnimationFrame(syncLayout);
  }

  function enforceSinglePrimary(source) {
    const app = runtime();
    if (!app) return;
    const inspectorOpen = state.root.classList.contains('inspector-open');
    const creativeOpen = Boolean(app.creativeWorkspace?.open);
    if (!(inspectorOpen && creativeOpen)) return;
    const active = currentPanel();
    if (active && PANEL_DEFS.find(def => def.id === active)?.kind === 'creative') app.toggleInspector?.(false);
    else if (active && PANEL_DEFS.find(def => def.id === active)?.kind === 'inspector') app.creativeWorkspace?.setOpen?.(false);
    else if (source === 'creative') app.toggleInspector?.(false);
    else app.creativeWorkspace?.setOpen?.(false);
  }

  function bindRuntime() {
    const app = runtime();
    if (!app || !state.root) return false;
    if (!state.runtimeBound) {
      state.runtimeBound = true;
      try {
        if (!localStorage.getItem('ink-inspector-width')) {
          app.inspectorNormalWidth = DEFAULT_PRIMARY_PANEL_WIDTH;
          state.root.style.setProperty('--inspector-w', DEFAULT_PRIMARY_PANEL_WIDTH + 'px');
        }
      } catch {
        app.inspectorNormalWidth = DEFAULT_PRIMARY_PANEL_WIDTH;
        state.root.style.setProperty('--inspector-w', DEFAULT_PRIMARY_PANEL_WIDTH + 'px');
      }
      bindContextualOptions();
      bindInspectorCloseControl();
      bindSupplementalPanelControls();
      bindRulerGuideDrag();
      bindRendererViewObserver();
      ensureTooltipController();
      ensurePanelOptionsTriggers();
      ensurePanelStackFramework();
      ensureActivePanelResizeEdge();
      const pagesToggle = document.querySelector('#pagesToggle');
      if (pagesToggle) pagesToggle.onclick = () => {
        if (isDesktop()) togglePanel('pages');
        else {
          document.querySelector('#pagesPanel')?.classList.toggle('open');
          app.refreshScrim?.();
        }
      };
      const closePages = document.querySelector('#closePagesBtn');
      if (closePages) closePages.onclick = () => {
        if (isDesktop()) closePrimaryPanels();
        else {
          document.querySelector('#pagesPanel')?.classList.remove('open');
          app.refreshScrim?.();
        }
      };
      document.querySelector('#docTitle')?.addEventListener('change', syncSoon);

      // Fresh entry is deliberately canvas-first. Only the last selected panel
      // identity is persisted; open/closed state is never restored.
      state.activePanel = 'collapsed';
      app.creativeWorkspace?.setOpen?.(false);
      app.toggleInspector?.(false);

      const creativeRoot = document.querySelector('#creativeWorkspace');
      state.mutationObserver = new MutationObserver(records => {
        let source = 'inspector';
        if (records.some(record => record.target === creativeRoot)) source = 'creative';
        enforceSinglePrimary(source);
        syncSoon();
      });
      state.mutationObserver.observe(state.root, { attributes: true, attributeFilter: ['class', 'data-panel'] });
      if (creativeRoot) {
        state.mutationObserver.observe(creativeRoot, { attributes: true, attributeFilter: ['class', 'data-stage'] });
        creativeRoot.addEventListener('click', event => {
          if (event.target.closest('[data-workspace-stage]')) syncSoon();
        });
      }

      if ('ResizeObserver' in globalThis) {
        state.resizeObserver = new ResizeObserver(syncSoon);
        const inspector = document.querySelector('#inspector');
        if (inspector) state.resizeObserver.observe(inspector);
        if (creativeRoot) state.resizeObserver.observe(creativeRoot);
      }

      window.addEventListener('resize', syncSoon, { passive: true });
      globalThis.matchMedia?.(DESKTOP_QUERY)?.addEventListener?.('change', syncSoon);
    }
    syncSoon();
    return true;
  }

  function install() {
    const appRoot = document.querySelector('#app');
    if (!appRoot) return;
    state.root = appRoot;
    appRoot.classList.add('web-shell-v0-1');
    appRoot.dataset.layoutMode = resolveLayoutMode();
    try {
      const last = localStorage.getItem(LAST_PANEL_KEY);
      if (PANEL_DEFS.some(def => def.id === last)) state.lastPanel = last;
    } catch {}

    createDocumentChrome();
    ensureTooltipController();
    ensureSnapReadout();
    ensureSupplementalInspectorSections();
    createPanelOptionsMenu();
    try {
      const rulers = localStorage.getItem('ink.web.ui.rulers.v0.1');
      if (rulers === 'true' || rulers === 'false') appRoot.dataset.rulers = rulers;
    } catch {}
    document.querySelector('[data-shell-action="toggle-rulers"]')?.setAttribute('aria-checked', String(appRoot.dataset.rulers === 'true'));
    mountContextualControls();
    bindToolbarLayout();
    createDock();
    createWindowMenu();
    bindApplicationMenus();

    const onRuntimeReady = () => bindRuntime();
    globalThis.addEventListener(RUNTIME_READY_EVENT, onRuntimeReady, { once: true });
    if (bindRuntime()) globalThis.removeEventListener(RUNTIME_READY_EVENT, onRuntimeReady);
  }

  globalThis.INK_WEB_SHELL = {
    version: '0.1',
    runtimeReadyEvent: RUNTIME_READY_EVENT,
    states: PRIMARY_PANEL_STATES,
    layoutModes: Object.values(LAYOUT_MODES),
    panels: PANEL_DEFS.map(def => def.id),
    open: selectPanel,
    select: selectPanel,
    toggle: togglePanel,
    close: closePrimaryPanels,
    closeMenus: closeApplicationMenus,
    showSnapFeedback,
    clearSnapFeedback,
    state() {
      const active = currentPanel();
      const panel = activePanelElement();
      return {
        version: '0.1',
        authority: 'single',
        layoutMode: state.root?.dataset.layoutMode || resolveLayoutMode(),
        primaryState: state.activePanel,
        activePanel: currentPanel(),
        lastPanel: state.lastPanel,
        collapsed: !activePanelElement(),
        inspectorOpen: Boolean(state.root?.classList.contains('inspector-open')),
        creativeOpen: Boolean(runtime()?.creativeWorkspace?.open),
        panelWidth: panel ? Math.round(panel.getBoundingClientRect().width) : 0,
        stageWidth: Math.round(document.querySelector('#stageWrap')?.getBoundingClientRect().width || 0),
        dockWidth: Math.round(state.dock?.getBoundingClientRect().width || 0),
        panelGroup: active && PANEL_DEFS.find(def => def.id === active)?.group || (runtime()?.creativeWorkspace?.open ? 'creative' : null),
        creativeStage: runtime()?.creativeWorkspace?.stage || null,
        contextMode: state.contextualRoot?.dataset.contextMode || null,
        contextTool: state.contextualRoot?.dataset.contextTool || null,
        toolbarLayout: state.root?.dataset.toolbarLayout || 'single',
        toolbarLayoutPreference: state.toolbarLayout,
        menuController: 'application-menu-registry',
        openApplicationMenu: state.openApplicationMenu,
        liveApplicationMenus: [...state.applicationMenus.keys()]
      };
    }
  };

  if (document.querySelector('#app')) install();
  else document.addEventListener('DOMContentLoaded', install, { once: true });
})();
