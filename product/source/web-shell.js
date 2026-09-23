(() => {
  'use strict';

  const DESKTOP_QUERY = '(min-width: 761px)';
  const RUNTIME_READY_EVENT = 'ink:runtime-ready';
  const LAST_PANEL_KEY = 'ink.web.ui.last-panel.v0.1';
  const DEFAULT_PRIMARY_PANEL_WIDTH = 252;
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
    { id: 'reference', label: 'Reference', icon: 'i-image', kind: 'creative', stage: 'reference', group: 'creative' },
    { id: 'compose', label: 'Compose', icon: 'i-group', kind: 'creative', stage: 'compose', group: 'creative' },
    { id: 'chat', label: 'CHAT', icon: 'i-spark', kind: 'creative', stage: 'chat', group: 'creative' },
    { id: 'revision', label: 'Revision', icon: 'i-history', kind: 'creative', stage: 'revision', group: 'creative' }
  ]);
  const PANEL_GROUPS = Object.freeze([
    { id: 'editor', label: 'Editor', items: PANEL_DEFS.filter(def => def.group === 'editor') },
    { id: 'creative', label: 'Creative Loop', items: PANEL_DEFS.filter(def => def.group === 'creative') }
  ]);
  const PRIMARY_PANEL_STATES = Object.freeze(['collapsed', ...PANEL_DEFS.map(def => def.id)]);

  const state = {
    root: null,
    dock: null,
    windowMenu: null,
    windowButton: null,
    runtimeBound: false,
    activePanel: 'collapsed',
    lastPanel: null,
    resizeObserver: null,
    mutationObserver: null,
    contextObserver: null,
    contextualRoot: null,
    contextualHost: null,
    contextRaf: 0
  };

  function runtime() {
    return globalThis.INK_APP || null;
  }

  function isDesktop() {
    return globalThis.matchMedia?.(DESKTOP_QUERY)?.matches ?? true;
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
      const action = propertiesOpen ? '關閉屬性面板' : (descriptor.mode === 'selection' ? '開啟物件屬性' : '開啟工具進階設定');
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
    if (currentPanel() === 'properties') {
      closePrimaryPanels();
      return true;
    }
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

  function createDock() {
    if (document.querySelector('#panelDock')) return document.querySelector('#panelDock');
    const appRoot = document.querySelector('#app');
    if (!appRoot) return null;
    const dock = document.createElement('nav');
    dock.id = 'panelDock';
    dock.className = 'panel-dock';
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
      selectPanel(button.dataset.shellPanel);
    });
    appRoot.append(dock);
    state.dock = dock;
    return dock;
  }

  function createWindowMenu() {
    if (document.querySelector('#panelWindowMenu')) return document.querySelector('#panelWindowMenu');
    const appRoot = document.querySelector('#app');
    if (!appRoot) return null;
    const menu = document.createElement('div');
    menu.id = 'panelWindowMenu';
    menu.className = 'panel-window-menu';
    menu.setAttribute('role', 'menu');
    menu.hidden = true;
    menu.innerHTML = PANEL_GROUPS.map(group =>
      '<div class="panel-window-group" data-panel-group="' + group.id + '">' +
      '<div class="panel-window-group-label">' + group.label + '</div>' +
      group.items.map(def => buttonMarkup(def, true)).join('') +
      '</div>'
    ).join('');
    menu.addEventListener('click', event => {
      const button = event.target.closest('[data-shell-panel]');
      if (!button) return;
      event.preventDefault();
      selectPanel(button.dataset.shellPanel);
      setWindowMenu(false);
    });
    appRoot.append(menu);
    state.windowMenu = menu;

    const windowButton = Array.from(document.querySelectorAll('.application-menus button'))
      .find(button => button.textContent.trim() === '視窗');
    if (windowButton) {
      state.windowButton = windowButton;
      windowButton.setAttribute('aria-haspopup', 'menu');
      windowButton.setAttribute('aria-expanded', 'false');
      windowButton.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        setWindowMenu(menu.hidden);
      });
    }
    return menu;
  }

  function positionWindowMenu() {
    if (!state.windowMenu || state.windowMenu.hidden || !state.windowButton) return;
    const rootRect = state.root.getBoundingClientRect();
    const rect = state.windowButton.getBoundingClientRect();
    state.windowMenu.style.left = Math.max(4, Math.round(rect.left - rootRect.left)) + 'px';
    state.windowMenu.style.top = Math.round(rect.bottom - rootRect.top) + 'px';
  }

  function setWindowMenu(open) {
    if (!state.windowMenu) return;
    state.windowMenu.hidden = !open;
    state.windowButton?.setAttribute('aria-expanded', String(open));
    if (open) positionWindowMenu();
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
      if (tab === 'layers' || tab === 'history') return tab;
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
    else app.toggleInspector?.(true, def.tab);
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

  function bindCollapseControl() {
    const button = document.querySelector('#inspectorEdgeToggle');
    if (!button) return false;
    if (button.dataset.shellCollapseBound === 'true') return true;
    button.dataset.shellCollapseBound = 'true';
    button.setAttribute('aria-controls', 'inspector creativeWorkspace');
    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      if (currentPanel()) closePrimaryPanels();
      else selectPanel(state.lastPanel || 'properties');
    });
    return true;
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

  function syncCollapseControl(active) {
    const button = document.querySelector('#inspectorEdgeToggle');
    if (!button) return;
    const expanded = Boolean(active);
    button.classList.toggle('active', expanded);
    button.setAttribute('aria-expanded', String(expanded));
    const label = expanded ? '收合右側面板' : '展開右側面板';
    button.setAttribute('aria-label', label);
    button.title = label;
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

  function syncLayout() {
    if (!state.root) return;
    const active = currentPanel();
    const panel = activePanelElement();
    const desktop = globalThis.matchMedia?.(DESKTOP_QUERY)?.matches ?? true;
    let width = 0;
    if (desktop && panel) {
      const rect = panel.getBoundingClientRect();
      if (rect.width > 0) width = Math.round(rect.width);
    }
    state.root.style.setProperty('--active-panel-w', width + 'px');
    state.root.classList.toggle('panel-primary-open', Boolean(desktop && panel && width));
    state.root.dataset.shellPanel = active || 'collapsed';
    syncCollapseControl(active);
    const legacyInspectorToggle = document.querySelector('#inspectorToggle');
    legacyInspectorToggle?.setAttribute('aria-expanded', String(Boolean(state.root.classList.contains('inspector-open'))));
    document.querySelectorAll('[data-shell-panel]').forEach(button => {
      const pressed = button.dataset.shellPanel === active;
      button.classList.toggle('active', pressed);
      button.setAttribute('aria-pressed', String(pressed));
    });
    const creativeOpen = Boolean(runtime()?.creativeWorkspace?.open);
    state.dock?.querySelector('[data-panel-group="editor"]')?.classList.toggle('group-active', Boolean(state.root.classList.contains('inspector-open')));
    state.dock?.querySelector('[data-panel-group="creative"]')?.classList.toggle('group-active', creativeOpen);
    if (state.windowMenu && !state.windowMenu.hidden) positionWindowMenu();
    syncCreativePresentation();
    syncContextualOptions();
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
      bindCollapseControl();
      bindInspectorCloseControl();

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

      document.addEventListener('click', event => {
        if (!state.windowMenu?.hidden && !event.target.closest('#panelWindowMenu') && event.target !== state.windowButton) setWindowMenu(false);
      });
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
    try {
      const last = localStorage.getItem(LAST_PANEL_KEY);
      if (PANEL_DEFS.some(def => def.id === last)) state.lastPanel = last;
    } catch {}

    mountContextualControls();
    createDock();
    createWindowMenu();

    const onRuntimeReady = () => bindRuntime();
    globalThis.addEventListener(RUNTIME_READY_EVENT, onRuntimeReady, { once: true });
    if (bindRuntime()) globalThis.removeEventListener(RUNTIME_READY_EVENT, onRuntimeReady);
  }

  globalThis.INK_WEB_SHELL = {
    version: '0.1',
    runtimeReadyEvent: RUNTIME_READY_EVENT,
    states: PRIMARY_PANEL_STATES,
    panels: PANEL_DEFS.map(def => def.id),
    open: selectPanel,
    select: selectPanel,
    toggle: togglePanel,
    close: closePrimaryPanels,
    state() {
      const active = currentPanel();
      const panel = activePanelElement();
      return {
        version: '0.1',
        authority: 'single',
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
        contextTool: state.contextualRoot?.dataset.contextTool || null
      };
    }
  };

  if (document.querySelector('#app')) install();
  else document.addEventListener('DOMContentLoaded', install, { once: true });
})();
