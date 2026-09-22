(() => {
  'use strict';

  const DESKTOP_QUERY = '(min-width: 761px)';
  const LAST_PANEL_KEY = 'ink.web.ui.last-panel.v0.1';
  const PANEL_DEFS = Object.freeze([
    { id: 'properties', label: '屬性', icon: 'i-sliders', kind: 'inspector' },
    { id: 'layers', label: '圖層', icon: 'i-layers', kind: 'inspector', tab: 'layers' },
    { id: 'history', label: '歷史', icon: 'i-history', kind: 'inspector', tab: 'history' },
    { id: 'reference', label: 'Reference', icon: 'i-image', kind: 'creative', stage: 'reference' },
    { id: 'compose', label: 'Compose', icon: 'i-group', kind: 'creative', stage: 'compose' },
    { id: 'chat', label: 'CHAT', icon: 'i-spark', kind: 'creative', stage: 'chat' },
    { id: 'revision', label: 'Revision', icon: 'i-history', kind: 'creative', stage: 'revision' }
  ]);

  const state = {
    root: null,
    dock: null,
    windowMenu: null,
    windowButton: null,
    runtimeBound: false,
    lastPanel: null,
    resizeObserver: null,
    mutationObserver: null,
    retryCount: 0
  };

  function runtime() {
    return globalThis.INK_APP || null;
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

  function createDock() {
    if (document.querySelector('#panelDock')) return document.querySelector('#panelDock');
    const appRoot = document.querySelector('#app');
    if (!appRoot) return null;
    const dock = document.createElement('nav');
    dock.id = 'panelDock';
    dock.className = 'panel-dock';
    dock.setAttribute('aria-label', '面板 Dock');
    dock.innerHTML =
      '<div class="panel-dock-group">' +
      PANEL_DEFS.slice(0, 3).map(def => buttonMarkup(def)).join('') +
      '</div><div class="panel-dock-separator"></div><div class="panel-dock-group creative">' +
      PANEL_DEFS.slice(3).map(def => buttonMarkup(def)).join('') +
      '</div>';
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
    if (document.querySelector('#panelWindowMenu')) return document.querySelector('#panelWindowMenu');
    const appRoot = document.querySelector('#app');
    if (!appRoot) return null;
    const menu = document.createElement('div');
    menu.id = 'panelWindowMenu';
    menu.className = 'panel-window-menu';
    menu.setAttribute('role', 'menu');
    menu.hidden = true;
    menu.innerHTML = PANEL_DEFS.map(def => buttonMarkup(def, true)).join('');
    menu.addEventListener('click', event => {
      const button = event.target.closest('[data-shell-panel]');
      if (!button) return;
      event.preventDefault();
      togglePanel(button.dataset.shellPanel);
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

  function currentPanel() {
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

  function isPanelOpen(id) {
    return currentPanel() === id;
  }

  function closePrimaryPanels() {
    const app = runtime();
    if (!app) return;
    app.creativeWorkspace?.setOpen?.(false);
    app.toggleInspector?.(false);
    syncSoon();
  }

  function showInspector(def) {
    const app = runtime();
    if (!app) return false;
    app.creativeWorkspace?.setOpen?.(false);
    const tab = def.tab || (app.selection?.length ? 'object' : 'brush');
    app.toggleInspector?.(true, tab);
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

  function togglePanel(id) {
    const def = PANEL_DEFS.find(item => item.id === id);
    if (!def || !runtime()) return false;
    if (isPanelOpen(id)) {
      closePrimaryPanels();
      return true;
    }
    const opened = def.kind === 'inspector' ? showInspector(def) : showCreative(def);
    if (opened) {
      state.lastPanel = id;
      try { localStorage.setItem(LAST_PANEL_KEY, id); } catch {}
      syncSoon();
    }
    return opened;
  }

  function activePanelElement() {
    const app = runtime();
    if (!app) return null;
    if (app.creativeWorkspace?.open) return document.querySelector('#creativeWorkspace');
    if (state.root?.classList.contains('inspector-open')) return document.querySelector('#inspector');
    return null;
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
    document.querySelectorAll('[data-shell-panel]').forEach(button => {
      const pressed = button.dataset.shellPanel === active;
      button.classList.toggle('active', pressed);
      button.setAttribute('aria-pressed', String(pressed));
    });
    if (state.windowMenu && !state.windowMenu.hidden) positionWindowMenu();
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
    if (source === 'creative') app.toggleInspector?.(false);
    else app.creativeWorkspace?.setOpen?.(false);
  }

  function bindRuntime() {
    const app = runtime();
    if (!app || !state.root) return false;
    if (!state.runtimeBound) {
      state.runtimeBound = true;

      // Fresh Web entry is deliberately canvas-first. Only the last selected
      // panel identity is persisted; open/closed state is not.
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
      if (creativeRoot) state.mutationObserver.observe(creativeRoot, { attributes: true, attributeFilter: ['class', 'data-stage'] });

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

    createDock();
    createWindowMenu();

    const tryBind = () => {
      if (bindRuntime()) return;
      state.retryCount += 1;
      if (state.retryCount < 40) setTimeout(tryBind, 50);
    };
    tryBind();
  }

  globalThis.INK_WEB_SHELL = {
    version: '0.1',
    panels: PANEL_DEFS.map(def => def.id),
    open(id) {
      const def = PANEL_DEFS.find(item => item.id === id);
      if (!def || !runtime()) return false;
      if (def.kind === 'inspector') showInspector(def);
      else showCreative(def);
      state.lastPanel = id;
      syncSoon();
      return true;
    },
    toggle: togglePanel,
    close: closePrimaryPanels,
    state() {
      const panel = activePanelElement();
      return {
        version: '0.1',
        activePanel: currentPanel(),
        lastPanel: state.lastPanel,
        collapsed: !activePanelElement(),
        inspectorOpen: Boolean(state.root?.classList.contains('inspector-open')),
        creativeOpen: Boolean(runtime()?.creativeWorkspace?.open),
        creativeStage: runtime()?.creativeWorkspace?.stage || null,
        panelWidth: panel ? Math.round(panel.getBoundingClientRect().width) : 0,
        stageWidth: Math.round(document.querySelector('#stageWrap')?.getBoundingClientRect().width || 0),
        dockWidth: Math.round(state.dock?.getBoundingClientRect().width || 0)
      };
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
})();
