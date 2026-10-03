export class ServiceWorkerUpdateManager {
  constructor({
    scriptURL = './service-worker.js',
    scope = './',
    buildId = null,
    onStatusChange = null,
    autoActivate = true,
    reloadOnActivate = false
  } = {}) {
    this.scriptURL = scriptURL;
    this.scope = scope;
    this.buildId = buildId;
    this.onStatusChange = onStatusChange;
    this.autoActivate = autoActivate;
    this.reloadOnActivate = reloadOnActivate;
    this.registration = null;
    this.waiting = null;
    this.state = 'idle';
    this.error = null;
    this.controllerChanged = false;
    this.controllerAtRegister = false;
    this.reloadIssued = false;
    this.controllerListenerBound = false;
  }

  supported() { return Boolean(globalThis.navigator?.serviceWorker); }

  emit(extra = {}) {
    const status = this.diagnostics(extra);
    this.onStatusChange?.(status);
    return status;
  }

  bindControllerChange() {
    if (this.controllerListenerBound || !this.supported()) return;
    this.controllerListenerBound = true;
    navigator.serviceWorker.addEventListener?.('controllerchange', async () => {
      this.controllerChanged = true;
      this.state = 'activated';
      try { await this.refreshWorkerIdentity(); } catch {}
      this.emit();
      if (this.reloadOnActivate && this.controllerAtRegister && !this.reloadIssued) {
        this.reloadIssued = true;
        globalThis.location?.reload?.();
      }
    });
  }

  async register() {
    if (!this.supported()) { this.state = 'unsupported'; return this.emit(); }
    this.state = 'registering'; this.emit();
    try {
      this.controllerAtRegister = Boolean(navigator.serviceWorker.controller);
      this.bindControllerChange();
      this.registration = await navigator.serviceWorker.register(this.scriptURL, {
        scope: this.scope,
        updateViaCache: 'none'
      });
      this.registration.addEventListener?.('updatefound', () => this.trackInstalling(this.registration.installing));
      await this.registration.update();
      this.waiting = this.registration.waiting || null;
      if (this.waiting && this.autoActivate) this.activateUpdate();
      else this.state = this.waiting ? 'update-ready' : 'ready';
      try { await this.refreshWorkerIdentity(); } catch {}
      return this.emit();
    } catch (error) {
      this.error = error instanceof Error ? error.message : String(error);
      this.state = 'error';
      return this.emit();
    }
  }

  trackInstalling(worker) {
    if (!worker) return;
    this.state = 'installing'; this.emit();
    worker.addEventListener?.('statechange', () => {
      if (worker.state === 'installed') {
        this.waiting = this.registration?.waiting || worker;
        this.state = navigator.serviceWorker.controller ? 'update-ready' : 'ready';
        if (this.autoActivate && navigator.serviceWorker.controller) this.activateUpdate();
      } else if (worker.state === 'activated') {
        this.state = 'activated';
        this.refreshWorkerIdentity().then(() => this.emit({ workerState: worker.state })).catch(() => {});
        return;
      } else if (worker.state === 'redundant') this.state = 'error';
      this.emit({ workerState: worker.state });
    });
  }

  async refreshWorkerIdentity() {
    const worker = navigator.serviceWorker.controller
      || this.registration?.active
      || this.registration?.waiting
      || this.registration?.installing;
    if (!worker || typeof MessageChannel === 'undefined') return null;
    const detail = await new Promise((resolve, reject) => {
      const channel = new MessageChannel();
      const timer = setTimeout(() => reject(new Error('Service Worker identity timeout')), 3000);
      channel.port1.onmessage = event => {
        clearTimeout(timer);
        resolve(event.data || null);
      };
      worker.postMessage({ type: 'INK_GET_VERSION' }, [channel.port2]);
    });
    if (detail?.buildId) this.buildId = detail.buildId;
    return detail;
  }

  async checkForUpdate() {
    if (!this.registration) return { ...this.emit(), checked: false };
    try {
      await this.registration.update();
      this.waiting = this.registration.waiting || this.waiting;
      if (this.waiting) {
        this.state = 'update-ready';
        if (this.autoActivate) this.activateUpdate();
      }
      return { ...this.emit(), checked: true };
    } catch (error) {
      this.error = error instanceof Error ? error.message : String(error);
      this.state = 'error';
      return { ...this.emit(), checked: false };
    }
  }

  activateUpdate() {
    const worker = this.registration?.waiting || this.waiting;
    if (!worker) return false;
    worker.postMessage({ type: 'INK_SKIP_WAITING' });
    this.state = 'activating';
    this.emit();
    return true;
  }

  diagnostics(extra = {}) {
    return {
      supported: this.supported(),
      state: this.state,
      hasRegistration: Boolean(this.registration),
      updateReady: Boolean(this.registration?.waiting || this.waiting),
      controllerChanged: this.controllerChanged,
      reloadIssued: this.reloadIssued,
      autoActivate: this.autoActivate,
      error: this.error,
      buildId: this.buildId,
      registrationScriptURL: this.registration?.active?.scriptURL || this.registration?.waiting?.scriptURL || this.registration?.installing?.scriptURL || this.scriptURL,
      ...extra
    };
  }
}
