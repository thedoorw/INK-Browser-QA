(() => {
  'use strict';

  const ACTIVE_KEY = 'ink.web.branding.active.v1';
  const PRODUCT_DEFAULT_KEY = 'ink.web.branding.product-default.v1';
  const LOGO_MAX_BYTES = 768 * 1024;
  const FAVICON_MAX_BYTES = 256 * 1024;

  const els = {};
  let factoryBranding = null;
  let activeBranding = null;

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function safeParse(raw) {
    if (!raw) return null;
    try {
      const value = JSON.parse(raw);
      return value && typeof value === 'object' ? value : null;
    } catch {
      return null;
    }
  }

  function readStored(key) {
    try { return safeParse(localStorage.getItem(key)); } catch { return null; }
  }

  function writeStored(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      setStatus('無法寫入本機偏好儲存空間', 'error');
      return false;
    }
  }

  function removeStored(key) {
    try { localStorage.removeItem(key); } catch {}
  }

  function normalize(value, fallback) {
    const source = value || {};
    const clean = {
      name: String(source.name || fallback.name || 'INK').trim().slice(0, 40) || 'INK',
      title: String(source.title || fallback.title || 'INK').trim().slice(0, 100) || 'INK',
      logo: String(source.logo || fallback.logo || ''),
      favicon: String(source.favicon || fallback.favicon || '')
    };
    if (!/^(?:assets\/|data:image\/)/i.test(clean.logo)) clean.logo = fallback.logo;
    if (!/^(?:assets\/|data:image\/)/i.test(clean.favicon)) clean.favicon = fallback.favicon;
    return clean;
  }

  function getProductDefault() {
    return normalize(readStored(PRODUCT_DEFAULT_KEY), factoryBranding);
  }

  function setStatus(message, state = 'ok') {
    if (!els.status) return;
    els.status.textContent = message;
    els.status.dataset.state = state;
  }

  function syncDialogFields(branding) {
    if (!els.nameInput) return;
    els.nameInput.value = branding.name;
    els.titleInput.value = branding.title;
    els.previewName.textContent = branding.name;
    els.previewTitle.textContent = branding.title;
    els.previewLogo.src = branding.logo;
  }

  function applyBranding(branding, { persist = false, status = '' } = {}) {
    const next = normalize(branding, factoryBranding);
    activeBranding = next;

    document.title = next.title;
    const appNameMeta = document.querySelector('meta[name="application-name"]');
    if (appNameMeta) appNameMeta.content = next.name;

    document.querySelectorAll('[data-brand-app-name]').forEach(node => { node.textContent = next.name; });
    document.querySelectorAll('[data-brand-logo]').forEach(img => { img.src = next.logo; });
    document.querySelectorAll('.menu-app-mark,.brand').forEach(node => {
      node.setAttribute('aria-label', next.name + ' · ' + next.title);
    });

    let favicon = document.querySelector('link[rel~="icon"]');
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    favicon.href = next.favicon;

    syncDialogFields(next);
    if (persist) writeStored(ACTIVE_KEY, next);
    if (status) setStatus(status);
    globalThis.dispatchEvent(new CustomEvent('ink:branding-changed', { detail: clone(next) }));
    return next;
  }

  function applyDraftFromInputs() {
    const next = {
      ...activeBranding,
      name: els.nameInput.value,
      title: els.titleInput.value
    };
    applyBranding(next, { persist: true, status: '已即時套用並保存' });
  }

  function fileToDataUrl(file, maxBytes, label) {
    return new Promise((resolve, reject) => {
      if (!file) return reject(new Error('未選擇檔案'));
      if (!String(file.type || '').startsWith('image/')) return reject(new Error(label + ' 必須是圖片檔'));
      if (file.size > maxBytes) return reject(new Error(label + ' 檔案過大'));
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('無法讀取 ' + label));
      reader.readAsDataURL(file);
    });
  }

  async function handleAsset(kind, file) {
    const isLogo = kind === 'logo';
    try {
      const dataUrl = await fileToDataUrl(file, isLogo ? LOGO_MAX_BYTES : FAVICON_MAX_BYTES, isLogo ? 'Logo' : 'Favicon');
      applyBranding({ ...activeBranding, [kind]: dataUrl }, {
        persist: true,
        status: (isLogo ? 'Logo' : 'Favicon') + ' 已即時套用並保存'
      });
    } catch (error) {
      setStatus(error?.message || 'Branding 圖檔無法使用', 'error');
    } finally {
      if (isLogo) els.logoInput.value = '';
      else els.faviconInput.value = '';
    }
  }

  function openDialog() {
    els.dialog.hidden = false;
    syncDialogFields(activeBranding);
    setStatus('變更會即時預覽並自動保存');
    requestAnimationFrame(() => els.nameInput.focus());
  }

  function closeDialog() {
    els.dialog.hidden = true;
  }

  function bind() {
    els.dialog = document.getElementById('brandingSettingsDialog');
    els.close = document.getElementById('closeBrandingSettings');
    els.nameInput = document.getElementById('brandingAppName');
    els.titleInput = document.getElementById('brandingAppTitle');
    els.previewLogo = document.getElementById('brandingPreviewLogo');
    els.previewName = document.getElementById('brandingPreviewName');
    els.previewTitle = document.getElementById('brandingPreviewTitle');
    els.logoChoose = document.getElementById('brandingLogoChoose');
    els.logoInput = document.getElementById('brandingLogoInput');
    els.faviconChoose = document.getElementById('brandingFaviconChoose');
    els.faviconInput = document.getElementById('brandingFaviconInput');
    els.reset = document.getElementById('brandingReset');
    els.promote = document.getElementById('brandingPromoteDefault');
    els.restoreFactory = document.getElementById('brandingRestoreFactory');
    els.status = document.getElementById('brandingSettingsStatus');

    if (!els.dialog || !els.nameInput || !els.titleInput) return;

    const favicon = document.querySelector('link[rel~="icon"]');
    factoryBranding = {
      name: document.querySelector('[data-brand-app-name]')?.textContent?.trim() || 'INK',
      title: document.title || 'INK',
      logo: document.querySelector('[data-brand-logo]')?.getAttribute('src') || 'assets/INK_MARK_SOURCE_W-300.jpg?v=0.1',
      favicon: favicon?.getAttribute('href') || 'assets/favicon.svg?v=0.1'
    };

    const initial = normalize(readStored(ACTIVE_KEY) || getProductDefault(), factoryBranding);
    applyBranding(initial);

    globalThis.addEventListener('ink:branding-open', openDialog);
    els.close.addEventListener('click', closeDialog);
    els.dialog.addEventListener('click', event => {
      if (event.target === els.dialog) closeDialog();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !els.dialog.hidden) {
        event.preventDefault();
        closeDialog();
      }
    });

    els.nameInput.addEventListener('input', applyDraftFromInputs);
    els.titleInput.addEventListener('input', applyDraftFromInputs);

    els.logoChoose.addEventListener('click', () => els.logoInput.click());
    els.faviconChoose.addEventListener('click', () => els.faviconInput.click());
    els.logoInput.addEventListener('change', () => handleAsset('logo', els.logoInput.files?.[0]));
    els.faviconInput.addEventListener('change', () => handleAsset('favicon', els.faviconInput.files?.[0]));

    els.reset.addEventListener('click', () => {
      applyBranding(getProductDefault(), { persist: true, status: '已 Reset 至 Product Default' });
    });

    els.promote.addEventListener('click', () => {
      const promoted = normalize(activeBranding, factoryBranding);
      if (writeStored(PRODUCT_DEFAULT_KEY, promoted)) {
        writeStored(ACTIVE_KEY, promoted);
        setStatus('目前 Branding 已 Promote 為 Product Default');
      }
    });

    els.restoreFactory.addEventListener('click', () => {
      removeStored(PRODUCT_DEFAULT_KEY);
      removeStored(ACTIVE_KEY);
      applyBranding(factoryBranding, { persist: true, status: '已恢復 Factory INK Branding' });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind, { once: true });
  else bind();
})();