(() => {
  'use strict';

  const DESKTOP_QUERY = '(min-width: 761px)';
  const RUNTIME_READY_EVENT = 'ink:runtime-ready';
  const LAST_PANEL_KEY = 'ink.web.ui.last-panel.v0.1';
  const TOOLBAR_LAYOUT_KEY = 'ink.web.ui.toolbar-layout.v0.1';
  const DEFAULT_PRIMARY_PANEL_WIDTH = 252;
  const FILE_COMMAND_TARGETS = Object.freeze({
    new: 'newBtn',
    open: 'openBtn',
    save: 'saveBtn',
    export: 'exportBtn'
  });
  const APPLICATION_MENU_REGISTRY = Object.freeze([
    { id: 'file', label: '檔案', live: true },
    { id: 'edit', label: '編輯', live: false },
    { id: 'view', label: '檢視', live: false },
    { id: 'select', label: '選取', live: false },
    { id: 'object', label: '物件', live: false },
    { id: 'layer', label: '圖層', live: false },
    { id: 'brush', label: '筆刷', live: false },
    { id: 'window', label: '視窗', live: true },
    { id: 'help', label: '說明', live: false }
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
    { id: 'reference', label: 'Reference', icon: 'i-image', kind: 'creative', stage: 'reference', group: 'creative' },
    { id: 'compose', label: 'Compose', icon: 'i-group', kind: 'creative', stage: 'compose', group: 'creative' },
    { id: 'chat', label: 'CHAT', icon: 'i-spark', kind: 'creative', stage: 'chat', group: 'creative' },
    { id: 'revision', label: 'Revision', icon: 'i-history', kind: 'creative', stage: 'revision', group: 'creative' },
    { id: 'specialist', label: 'Specialist', icon: 'i-settings', kind: 'inspector', tab: 'ai', group: 'specialist' }
  ]);
  const PANEL_GROUPS = Object.freeze([
    { id: 'editor', label: 'Editor', items: PANEL_DEFS.filter(def => def.group === 'editor') },
    { id: 'creative', label: 'Creative Loop', items: PANEL_DEFS.filter(def => def.group === 'creative') },
    { id: 'specialist', label: 'Specialist', items: PANEL_DEFS.filter(def => def.group === 'specialist') }
  ]);
  const PRIMARY_PANEL_STATES = Object.freeze(['collapsed', ...PANEL_DEFS.map(def => def.id)]);

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

  function applicationMenuElements(id) {
    const trigger = document.querySelector(`[data-application-menu-trigger="${id}"]`);
    const menu = id === 'file'
      ? document.querySelector('#fileMenu')
      : id === 'window'
        ? document.querySelector('#panelWindowMenu')
        : null;
    return { trigger, menu };
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
        if (!fileItem && !panelItem) return;
        event.preventDefault();
        if (fileItem) {
          const targetId = FILE_COMMAND_TARGETS[fileItem.dataset.fileCommand];
          closeApplicationMenus();
          if (targetId) document.getElementById(targetId)?.click();
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
      if (tab === 'layers' || tab === 'history') return tab;
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
    } else app.toggleInspector?.(true, def.tab);
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
    }
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
    const responsiveInspectorToggle = document.querySelector('#inspectorToggle');
    responsiveInspectorToggle?.setAttribute('aria-expanded', String(Boolean(state.root.classList.contains('inspector-open'))));
    document.querySelectorAll('[data-shell-panel]').forEach(button => {
      const pressed = button.dataset.shellPanel === active;
      button.classList.toggle('active', pressed);
      button.setAttribute('aria-pressed', String(pressed));
    });
    const activeDef = active ? PANEL_DEFS.find(def => def.id === active) : null;
    state.dock?.querySelectorAll('[data-panel-group]').forEach(group => {
      group.classList.toggle('group-active', group.dataset.panelGroup === activeDef?.group);
    });
    syncInspectorPresentation(active);
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
