export class ServiceWorkerUpdateManager {
  constructor({ scriptURL = './service-worker.js', scope = './', buildId = null, onStatusChange = null } = {}) {
    this.scriptURL = scriptURL;
    this.scope = scope;
    this.buildId = buildId;
    this.onStatusChange = onStatusChange;
    this.registration = null;
    this.waiting = null;
    this.state = 'idle';
    this.error = null;
    this.controllerChanged = false;
  }

  supported() { return Boolean(globalThis.navigator?.serviceWorker); }

  emit(extra = {}) {
    const status = this.diagnostics(extra);
    this.onStatusChange?.(status);
    return status;
  }

  async register() {
    if (!this.supported()) { this.state = 'unsupported'; return this.emit(); }
    this.state = 'registering'; this.emit();
    try {
      this.registration = await navigator.serviceWorker.register(this.scriptURL, { scope: this.scope, updateViaCache: 'none' });
      this.waiting = this.registration.waiting || null;
      this.registration.addEventListener?.('updatefound', () => this.trackInstalling(this.registration.installing));
      navigator.serviceWorker.addEventListener?.('controllerchange', () => {
        this.controllerChanged = true;
        this.state = 'activated';
        this.emit();
      });
      this.state = this.waiting ? 'update-ready' : 'ready';
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
      } else if (worker.state === 'activated') this.state = 'activated';
      else if (worker.state === 'redundant') this.state = 'error';
      this.emit({ workerState: worker.state });
    });
  }

  async checkForUpdate() {
    if (!this.registration) return { ...this.emit(), checked: false };
    try {
      await this.registration.update();
      this.waiting = this.registration.waiting || this.waiting;
      if (this.waiting) this.state = 'update-ready';
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
      error: this.error,
      buildId: this.buildId,
      registrationScriptURL: this.registration?.active?.scriptURL || this.registration?.waiting?.scriptURL || this.registration?.installing?.scriptURL || this.scriptURL,
      ...extra
    };
  }
}
