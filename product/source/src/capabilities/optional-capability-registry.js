export class OptionalCapabilityRegistry {
  constructor(app) {
    this.app = app;
    this.records = new Map();
  }

  register({ id, load, install }) {
    if (!/^[a-z][a-z0-9-]*$/.test(id || '')) throw new Error('Capability id must be a stable lowercase identifier.');
    if (this.records.has(id)) throw new Error(`Capability already registered: ${id}`);
    if (typeof load !== 'function' || typeof install !== 'function') throw new Error(`Capability ${id} requires load and install functions.`);
    this.records.set(id, { id, load, install, state: 'available', error: null, api: null, hooks: Object.freeze({}), pending: null });
    return this.status(id);
  }

  status(id) {
    const record = this.records.get(id);
    if (!record) return Object.freeze({ id, state: 'unavailable', error: 'Capability is not registered.' });
    return Object.freeze({ id: record.id, state: record.state, error: record.error });
  }

  list() {
    return [...this.records.keys()].sort().map(id => this.status(id));
  }

  installedIds() {
    return this.list().filter(item => item.state === 'installed').map(item => item.id);
  }

  markUnavailable(id, reason = 'Capability is unavailable.') {
    const record = this.records.get(id);
    if (!record) throw new Error(`Unknown capability: ${id}`);
    if (record.state === 'installed') throw new Error(`Installed capability cannot be marked unavailable: ${id}`);
    record.state = 'unavailable';
    record.error = String(reason);
    return this.status(id);
  }

  async install(id) {
    const record = this.records.get(id);
    if (!record || record.state === 'unavailable') throw new Error(record?.error || `Capability is unavailable: ${id}`);
    if (record.state === 'installed') return record.api;
    if (record.pending) return record.pending;
    if (record.state === 'failed') throw new Error(record.error || `Capability previously failed: ${id}`);

    record.pending = (async () => {
      try {
        const module = await record.load();
        const installed = await record.install(module, { app: this.app, registry: this });
        if (!installed || typeof installed !== 'object') throw new Error(`Capability ${id} installer returned no result.`);
        record.api = installed.api ?? installed;
        record.hooks = Object.freeze({ ...(installed.hooks || {}) });
        record.state = 'installed';
        record.error = null;
        return record.api;
      } catch (error) {
        record.state = 'failed';
        record.error = error instanceof Error ? error.message : String(error);
        console.error(`INK optional capability failed: ${id}`, error);
        throw error;
      } finally {
        record.pending = null;
      }
    })();
    return record.pending;
  }

  some(hook, payload) {
    for (const record of this.records.values()) {
      if (record.state !== 'installed' || typeof record.hooks[hook] !== 'function') continue;
      try {
        if (record.hooks[hook](payload) === true) return true;
      } catch (error) {
        this.failHook(record, hook, error);
      }
    }
    return false;
  }

  notify(hook, payload) {
    for (const record of this.records.values()) {
      if (record.state !== 'installed' || typeof record.hooks[hook] !== 'function') continue;
      try {
        record.hooks[hook](payload);
      } catch (error) {
        this.failHook(record, hook, error);
      }
    }
  }

  failHook(record, hook, error) {
    record.state = 'failed';
    record.error = `${hook}: ${error instanceof Error ? error.message : String(error)}`;
    console.error(`INK optional capability hook failed: ${record.id}.${hook}`, error);
  }
}
