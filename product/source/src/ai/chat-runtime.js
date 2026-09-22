import { AICommandError, AI_LAYER_VERSION, createCommand, hashValue } from './ai-core.js';
import { createCreativeIntelligenceContextAdapter } from './creative-intelligence-context.js';

export const CHAT_RUNTIME_VERSION = '1.6.0';
export const STARTUP_MODES = Object.freeze(['STANDARD', 'AI_ASSISTED', 'LOCAL_ONLY', 'SAFE', 'VALIDATION']);
export const CONTEXT_LEVELS = Object.freeze(['CAPABILITY_ONLY', 'DOCUMENT_SUMMARY', 'TARGET_CONTEXT', 'DETAILED_CONTEXT']);
export const TRANSMISSION_CHOICES = Object.freeze(['TEXT_SUMMARY', 'SELECTED_LAYERS', 'SELECTED_REGION', 'LOW_RES_PREVIEW', 'FULL_IMAGE', 'NO_IMAGE', 'LOCAL_ONLY']);
export const PLAN_RESULTS = Object.freeze(['APPROVED', 'VALIDATION REQUIRED', 'RESEARCH', 'REJECTED']);

const clone = value => value === undefined ? undefined : structuredClone(value);
const now = () => new Date().toISOString();
const asArray = value => Array.isArray(value) ? value : value == null ? [] : [value];
const utf8Bytes = value => new TextEncoder().encode(typeof value === 'string' ? value : JSON.stringify(value)).byteLength;
const estimateTokens = value => Math.ceil(utf8Bytes(value) / 3.4);
const secretPattern = /(api[_-]?key|authorization|bearer|credential|access[_-]?token|refresh[_-]?token|secret|password)/i;
const idPattern = /^[A-Za-z0-9][A-Za-z0-9._:-]{2,127}$/;

export function redactSecrets(value) {
  if (Array.isArray(value)) return value.map(redactSecrets);
  if (!value || typeof value !== 'object') return typeof value === 'string' && /bearer\s+[A-Za-z0-9._~+\/-]+/i.test(value) ? value.replace(/bearer\s+\S+/ig, 'Bearer [REDACTED]') : value;
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, secretPattern.test(key) ? '[REDACTED]' : redactSecrets(item)]));
}

export class RuntimeError extends AICommandError {
  constructor(code, message, details = {}, { retryable = false, provider = null } = {}) {
    super(code, message, redactSecrets(details));
    this.retryable = retryable;
    this.provider = provider;
  }
}

export class ErrorMapper {
  static map(error, provider = null) {
    if (error instanceof RuntimeError) return error;
    if (error?.name === 'AbortError') return new RuntimeError('REQUEST_CANCELLED', 'The model request was cancelled.', {}, { retryable: true, provider });
    const status = Number(error?.status || error?.response?.status || 0);
    if (status === 401 || status === 403) return new RuntimeError('AUTHENTICATION_FAILURE', 'Authentication failed.', { status }, { provider });
    if (status === 408 || status === 504) return new RuntimeError('TIMEOUT', 'The model endpoint timed out.', { status }, { retryable: true, provider });
    if (status === 413) return new RuntimeError('CONTEXT_TOO_LARGE', 'The selected context is too large.', { status }, { provider });
    if (status === 429) return new RuntimeError('RATE_LIMIT', 'The model endpoint rate limit was reached.', { status }, { retryable: true, provider });
    if (status >= 500) return new RuntimeError('PROVIDER_ERROR', 'The model provider returned an error.', { status }, { retryable: true, provider });
    if (error instanceof SyntaxError) return new RuntimeError('MODEL_JSON_INVALID', 'The model response is not valid JSON.', {}, { retryable: true, provider });
    return new RuntimeError('MODEL_REQUEST_FAILED', error?.message || 'Model request failed.', {}, { retryable: true, provider });
  }
}

export function createConnectionSettings(input = {}) {
  const settings = {
    provider: input.provider || 'manual-json', endpoint: String(input.endpoint || ''), model: String(input.model || ''), apiVersion: String(input.apiVersion || ''),
    authenticationMethod: input.authenticationMethod || 'NONE', credentialAlias: String(input.credentialAlias || ''), timeout: Number(input.timeout ?? 30000), retryCount: Number(input.retryCount ?? 1),
    streaming: input.streaming !== false, maximumContext: Number(input.maximumContext ?? 16000), dataTransmissionPolicy: input.dataTransmissionPolicy || 'TEXT_SUMMARY',
    imageTransmissionPolicy: input.imageTransmissionPolicy || 'NO_IMAGE', loggingPolicy: input.loggingPolicy || 'METADATA_ONLY', localOnlyMode: input.localOnlyMode === true,
    urlAllowlist: asArray(input.urlAllowlist).map(String), saveCredential: input.saveCredential === true, requestHeaders: clone(input.requestHeaders || {})
  };
  if (!Number.isFinite(settings.timeout) || settings.timeout < 1000 || settings.timeout > 300000) throw new RuntimeError('INVALID_TIMEOUT', 'Timeout must be 1000–300000 ms.');
  if (!Number.isInteger(settings.retryCount) || settings.retryCount < 0 || settings.retryCount > 3) throw new RuntimeError('INVALID_RETRY', 'Retry count must be 0–3.');
  if (!Number.isFinite(settings.maximumContext) || settings.maximumContext < 256 || settings.maximumContext > 1000000) throw new RuntimeError('INVALID_CONTEXT_BUDGET', 'Maximum context must be 256–1000000 tokens.');
  if (settings.localOnlyMode && settings.endpoint) throw new RuntimeError('LOCAL_ONLY_ENDPOINT_REJECTED', 'Local-only mode cannot configure an external endpoint.');
  if (settings.endpoint) {
    let url; try { url = new URL(settings.endpoint); } catch { throw new RuntimeError('INVALID_ENDPOINT', 'Endpoint must be a valid URL.'); }
    if (url.protocol !== 'https:' && !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) throw new RuntimeError('INSECURE_ENDPOINT', 'Remote endpoints must use HTTPS.');
    if (settings.urlAllowlist.length && !settings.urlAllowlist.some(allowed => url.origin === allowed || url.hostname === allowed)) throw new RuntimeError('ENDPOINT_NOT_ALLOWED', 'Endpoint is outside the configured allowlist.', { origin: url.origin });
  }
  if (Object.keys(settings.requestHeaders).some(secretPattern.test.bind(secretPattern))) throw new RuntimeError('SECRET_HEADER_REJECTED', 'Authentication headers must come from the credential vault.');
  return settings;
}

export class CredentialSecuritySystem {
  #memory = new Map();
  #sessionKey = null;
  constructor({ sessionStorage = globalThis.sessionStorage, crypto = globalThis.crypto } = {}) { this.sessionStorage = sessionStorage; this.crypto = crypto; }
  async set(alias, credential, { persistence = 'SESSION_ONLY' } = {}) {
    if (!alias || !idPattern.test(alias)) throw new RuntimeError('INVALID_CREDENTIAL_ALIAS', 'Credential alias is invalid.');
    if (!credential || typeof credential !== 'string') throw new RuntimeError('CREDENTIAL_REQUIRED', 'Credential is required.');
    this.#memory.set(alias, credential);
    if (persistence === 'SESSION_ENCRYPTED') await this.#storeEncrypted(alias, credential);
    else if (persistence !== 'SESSION_ONLY') throw new RuntimeError('UNSAFE_CREDENTIAL_STORAGE', 'Only session-only credential storage is available in this runtime.');
    return { alias, persistence, stored: true };
  }
  async get(alias) { return this.#memory.get(alias) || await this.#readEncrypted(alias) || null; }
  clear(alias) { this.#memory.delete(alias); this.sessionStorage?.removeItem(`ink.credential.${alias}`); }
  clearAll() { for (const alias of this.#memory.keys()) this.sessionStorage?.removeItem(`ink.credential.${alias}`); this.#memory.clear(); this.#sessionKey = null; }
  listAliases() { return [...this.#memory.keys()]; }
  serialize() { return { format: 'INK-CREDENTIAL-VAULT', version: 1, persistence: 'SESSION_ONLY', aliases: this.listAliases(), credentials: '[NEVER SERIALIZED]' }; }
  async #key() { if (!this.crypto?.subtle) return null; if (!this.#sessionKey) this.#sessionKey = await this.crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']); return this.#sessionKey; }
  async #storeEncrypted(alias, credential) { const key = await this.#key(); if (!key || !this.sessionStorage) return; const iv = this.crypto.getRandomValues(new Uint8Array(12)), data = await this.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(credential)); this.sessionStorage.setItem(`ink.credential.${alias}`, JSON.stringify({ iv: [...iv], data: [...new Uint8Array(data)] })); }
  async #readEncrypted(alias) { try { const packed = JSON.parse(this.sessionStorage?.getItem(`ink.credential.${alias}`) || 'null'), key = await this.#key(); if (!packed || !key) return null; const plain = await this.crypto.subtle.decrypt({ name: 'AES-GCM', iv: new Uint8Array(packed.iv) }, key, new Uint8Array(packed.data)); const value = new TextDecoder().decode(plain); this.#memory.set(alias, value); return value; } catch { return null; } }
}

function sanitizeProtected(value) {
  if (Array.isArray(value)) return value.map(sanitizeProtected).filter(item => item !== undefined);
  if (!value || typeof value !== 'object') return value;
  if (value.protected === true || value.transmissionAllowed === false) return undefined;
  return Object.fromEntries(Object.entries(value).filter(([key]) => !secretPattern.test(key)).map(([key, item]) => [key, sanitizeProtected(item)]).filter(([, item]) => item !== undefined));
}

export class CapabilityProvider {
  constructor(layer) { this.layer = layer; }
  get({ detailed = false } = {}) {
    const manifest = sanitizeProtected(this.layer.manifest.toJSON());
    if (detailed) return manifest;
    return { format: manifest.format, version: manifest.version, operationCount: manifest.operations.length, operations: manifest.operations.map(item => ({ name: item.operationName, version: item.operationVersion, targets: item.supportedTargets, permission: item.requiredPermission, maturity: item.currentMaturity, preview: item.previewSupport, rollback: item.rollbackSupport, deterministic: item.deterministicSupport, externalDependency: item.externalDependency || null })), restrictions: ['NO_DOM_ACCESS', 'NO_DIRECT_CANVAS_ACCESS', 'NO_DIRECT_FILE_WRITE', 'NO_CREDENTIAL_ACCESS', 'NO_PERMISSION_ESCALATION', 'PREVIEW_BEFORE_EXECUTE'] };
  }
}
export class DocumentStateProvider {
  constructor(layer) { this.layer = layer; }
  get(query = {}) {
    const state = this.layer.stateReader.read(this.layer.currentDocument(), query), blockedTargets = new Set(state.protectedTargets || []), blockedLayers = new Set((state.layerTree || []).filter(layer => layer.locked).map(layer => layer.layerId));
    state.layerTree = (state.layerTree || []).filter(layer => !blockedLayers.has(layer.layerId)).map(layer => ({ ...layer, objectIds: layer.objectIds.filter(id => !blockedTargets.has(id)) }));
    state.objectIndex = (state.objectIndex || []).filter(item => !item.protected && !item.locked && !blockedTargets.has(item.objectId) && !blockedLayers.has(item.layerId));
    state.strokeIndex = (state.strokeIndex || []).filter(item => !blockedTargets.has(item.strokeId) && !blockedLayers.has(item.layerId));
    state.editableTargets = (state.editableTargets || []).filter(id => !blockedTargets.has(id));
    state.transmissionExclusions = { protectedTargetCount: blockedTargets.size, protectedLayerCount: blockedLayers.size, policy: 'CONTENT AND IDS OMITTED' };
    delete state.protectedTargets;
    return sanitizeProtected(state);
  }
}

export class ContextBuilder {
  constructor({ capabilityProvider, documentStateProvider, groundedContextProvider = null, previewProvider = null, defaultTokenBudget = 16000 } = {}) { this.capabilityProvider = capabilityProvider; this.documentStateProvider = documentStateProvider; this.groundedContextProvider = groundedContextProvider; this.previewProvider = previewProvider; this.defaultTokenBudget = defaultTokenBudget; this.cache = new Map(); }
  build({ level = 'DOCUMENT_SUMMARY', targets = [], layerIds = [], region = null, includeHistory = false, includeImage = false, tokenBudget = this.defaultTokenBudget, userApprovedDetailed = false, documentVersion = null, groundedContext = true, groundedContextOptions = {} } = {}) {
    if (!CONTEXT_LEVELS.includes(level)) throw new RuntimeError('INVALID_CONTEXT_LEVEL', 'Unknown context level.', { level });
    if (level === 'DETAILED_CONTEXT' && !userApprovedDetailed) throw new RuntimeError('DETAILED_CONTEXT_APPROVAL_REQUIRED', 'Detailed context requires explicit user approval.');
    const capabilities = this.capabilityProvider.get(), state = level === 'CAPABILITY_ONLY' ? null : this.documentStateProvider.get({ limit: level === 'DETAILED_CONTEXT' ? 2000 : 500 });
    const sections = { constraints: { permission: 'PROPOSE', noDirectDOM: true, noDirectCanvas: true, noDirectFileWrite: true, previewBeforeExecute: true }, capabilities };
    let groundedFingerprint = groundedContext === false ? 'disabled' : 'unavailable';
    if (state && groundedContext !== false && this.groundedContextProvider?.read) {
      try {
        const allowedObjectIds = (state.objectIndex || [])
          .map(item => item?.objectId)
          .filter(id => typeof id === 'string')
          .sort((a, b) => a.localeCompare(b));
        const grounded = this.groundedContextProvider.read({
          ...(groundedContextOptions && typeof groundedContextOptions === 'object' ? groundedContextOptions : {}),
          allowedObjectIds
        });
        sections.groundedCreativeIntelligence = grounded;
        groundedFingerprint = grounded?.contextFingerprint || 'available';
      } catch (error) {
        groundedFingerprint = `unavailable:${error?.code || 'GROUNDED_CONTEXT_UNAVAILABLE'}`;
      }
    }
    if (state) sections.documentSummary = state.documentSummary;
    if (level !== 'CAPABILITY_ONLY' && state) sections.summary = { layerTree: state.layerTree, selection: state.selection, semanticRegions: state.semanticRegions, palette: state.palette, historySummary: includeHistory ? state.historySummary : { entries: [], omitted: 'history not selected' } };
    if (['TARGET_CONTEXT', 'DETAILED_CONTEXT'].includes(level) && state) {
      const wanted = new Set(targets); sections.targetContext = { targets: [...state.objectIndex, ...state.strokeIndex, ...state.regionIndex].filter(item => !wanted.size || wanted.has(item.objectId || item.strokeId || item.regionId)), layerTree: state.layerTree.filter(layer => !layerIds.length || layerIds.includes(layer.layerId)), region, preview: includeImage ? this.previewProvider?.({ targets, layerIds, region, maximumDimension: 768 }) || null : null };
    }
    if (level === 'DETAILED_CONTEXT' && state) sections.details = { objectIndex: state.objectIndex, strokeIndex: state.strokeIndex, regionIndex: state.regionIndex, recipes: state.historySummary?.recipes || [] };
    const cleaned = sanitizeProtected(sections), sourceVersion = documentVersion || state?.documentHash || 'capability-only', cacheKey = hashValue({ level, targets, layerIds, region, includeHistory, includeImage, tokenBudget, sourceVersion, groundedFingerprint });
    if (this.cache.has(cacheKey)) return clone(this.cache.get(cacheKey));
    const { value, disclosure } = this.#fit(cleaned, tokenBudget), context = { format: 'INK-CHAT-CONTEXT', version: CHAT_RUNTIME_VERSION, level, sourceVersion, hash: hashValue(value), tokenBudget, estimatedTokens: estimateTokens(value), retained: disclosure.retained, omitted: disclosure.omitted, omissionReasons: disclosure.reasons, confidenceImpact: disclosure.confidenceImpact, payload: value };
    this.cache.set(cacheKey, clone(context)); return context;
  }
  invalidate(version) { for (const [key, value] of this.cache) if (!version || value.sourceVersion !== version) this.cache.delete(key); }
  #fit(value, budget) {
    const required = ['constraints', 'capabilities'], retained = Object.keys(value), omitted = [], reasons = [];
    let fitted = clone(value);
    const order = ['details', 'targetContext.preview', 'groundedCreativeIntelligence', 'summary.historySummary', 'summary.palette', 'summary.layerTree'];
    const drop = path => { const parts = path.split('.'); let node = fitted; for (let i = 0; i < parts.length - 1; i++) node = node?.[parts[i]]; if (node && parts.at(-1) in node) { delete node[parts.at(-1)]; omitted.push(path); reasons.push(`${path}: token budget`); } };
    for (const path of order) { if (estimateTokens(fitted) <= budget) break; drop(path); }
    if (estimateTokens(fitted) > budget) throw new RuntimeError('CONTEXT_BUDGET_TOO_SMALL', 'Token budget cannot contain required capabilities and safety constraints.', { budget, required, estimatedTokens: estimateTokens(fitted) });
    return { value: fitted, disclosure: { retained: retained.filter(key => !omitted.some(path => path === key)), omitted, reasons, confidenceImpact: omitted.length ? 'MODEL_CONFIDENCE_MAY_DECREASE' : 'NONE' } };
  }
}

export class PlanRequest {
  constructor({ sessionId, prompt, context, responseSchema = 'ink-editable-plan-v1', images = [], transmissionDecision, metadata = {} } = {}) {
    if (!sessionId || !prompt || !context) throw new RuntimeError('PLAN_REQUEST_INVALID', 'Session, prompt, and context are required.');
    this.format = 'INK-PLAN-REQUEST'; this.version = CHAT_RUNTIME_VERSION; this.requestId = `planreq:${hashValue([sessionId, prompt, context.hash, now()])}`; this.sessionId = sessionId; this.prompt = prompt; this.context = context; this.responseSchema = responseSchema; this.images = images; this.transmissionDecision = transmissionDecision; this.metadata = clone(metadata);
  }
}
export class PlanResponse { constructor({ requestId, provider, model, raw, plan, toolCalls = [], usage = null } = {}) { this.format = 'INK-PLAN-RESPONSE'; this.version = CHAT_RUNTIME_VERSION; this.requestId = requestId; this.provider = provider; this.model = model; this.raw = raw; this.plan = plan; this.toolCalls = toolCalls; this.usage = usage; this.receivedAt = now(); } }

export class ConversationRequest {
  constructor({ sessionId, prompt, context, transcript = [], transmissionDecision = 'TEXT_SUMMARY' } = {}) {
    if (!sessionId || !prompt || !context) throw new RuntimeError('CONVERSATION_REQUEST_INVALID', 'Session, prompt, and context are required.');
    this.format = 'INK-CONVERSATION-REQUEST'; this.version = CHAT_RUNTIME_VERSION;
    this.requestId = `chatmsg:${hashValue([sessionId, prompt, context.hash, now()])}`;
    this.sessionId = sessionId; this.prompt = prompt; this.context = context;
    this.transcript = clone(transcript).slice(-12); this.transmissionDecision = transmissionDecision;
  }
}
export class ConversationResponse {
  constructor({ requestId, provider, model, content, usage = null, source = 'MODEL' } = {}) {
    this.format = 'INK-CONVERSATION-RESPONSE'; this.version = CHAT_RUNTIME_VERSION;
    this.requestId = requestId; this.provider = provider; this.model = model;
    this.content = String(content || ''); this.usage = usage; this.source = source; this.receivedAt = now();
  }
}

const conversationContent = response => {
  if (typeof response === 'string') return response;
  if (typeof response?.content === 'string') return response.content;
  if (Array.isArray(response?.content)) return response.content.map(item => item?.text || item?.content || '').filter(Boolean).join('\n');
  if (typeof response?.output_text === 'string') return response.output_text;
  if (typeof response?.text === 'string') return response.text;
  if (typeof response?.message?.content === 'string') return response.message.content;
  if (typeof response?.choices?.[0]?.message?.content === 'string') return response.choices[0].message.content;
  throw new RuntimeError('CONVERSATION_RESPONSE_INVALID', 'Conversation provider did not return text content.');
};

export class ChatClientInterface {
  constructor(settings = {}) { this.settings = createConnectionSettings(settings); }
  async createPlan() { throw new RuntimeError('CLIENT_NOT_IMPLEMENTED', 'Chat client must implement createPlan().'); }
  async createMessage() { throw new RuntimeError('CLIENT_NOT_IMPLEMENTED', 'Chat client must implement createMessage().'); }
  cancel() {}
  get external() { return Boolean(this.settings.endpoint) && !this.settings.localOnlyMode; }
}

export class ManualJSONClient extends ChatClientInterface {
  constructor({ valueProvider = null } = {}) { super({ provider: 'manual-json', localOnlyMode: true }); this.valueProvider = valueProvider; }
  async createPlan(request) { const value = await this.valueProvider?.(request); if (!value) throw new RuntimeError('USER_EDIT_REQUIRED', 'Paste a structured Plan response to continue.'); return { content: typeof value === 'string' ? value : JSON.stringify(value), toolCalls: [] }; }
  async createMessage(request) {
    const summary = request.context?.payload?.documentSummary || {};
    const selection = request.context?.payload?.summary?.selection || [];
    const title = summary.title || summary.documentId || 'current document';
    const objectCount = summary.objects ?? summary.objectCount ?? 'unknown';
    return { content: `LOCAL CONTEXT · ${title} · objects ${objectCount} · selection ${Array.isArray(selection) ? selection.length : 0}. No remote model is configured; discussion is context-only and cannot mutate the document.`, source: 'LOCAL_CONTEXT' };
  }
}
export class RuntimeDeterministicTestClient extends ChatClientInterface {
  constructor({ planFactory } = {}) { super({ provider: 'deterministic-test', localOnlyMode: true }); this.planFactory = planFactory; }
  async createPlan(request) { return { content: JSON.stringify(await this.planFactory(request)), toolCalls: [], semanticMaturity: 'NOT A REAL CHAT SERVICE' }; }
  async createMessage(request) { return { content: `DETERMINISTIC TEST · ${request.prompt}`, source: 'DETERMINISTIC_TEST', semanticMaturity: 'NOT A REAL CHAT SERVICE' }; }
}

export class StreamHandler {
  async read(response, { onToken, signal } = {}) {
    if (!response.body?.getReader) return response.text();
    const reader = response.body.getReader(), decoder = new TextDecoder(); let buffer = '', output = '';
    while (true) { if (signal?.aborted) { await reader.cancel(); throw new DOMException('Cancelled', 'AbortError'); } const { done, value } = await reader.read(); if (done) break; buffer += decoder.decode(value, { stream: true }); const lines = buffer.split('\n'); buffer = lines.pop() || ''; for (const line of lines) { const item = line.trim(); if (!item || item === 'data: [DONE]') continue; if (item.startsWith('data:')) { const chunk = JSON.parse(item.slice(5).trim()), token = chunk.choices?.[0]?.delta?.content || chunk.delta?.text || ''; output += token; onToken?.(token, chunk); } } }
    return output + buffer;
  }
}

export class HTTPModelAdapter extends ChatClientInterface {
  constructor(settings, { credentialStore, fetchImpl = globalThis.fetch, streamHandler = new StreamHandler() } = {}) { super(settings); this.credentialStore = credentialStore; this.fetchImpl = fetchImpl; this.streamHandler = streamHandler; this.active = new Map(); }
  buildPayload(request) { return { model: this.settings.model, input: request.prompt, context: request.context.payload, response_schema: request.responseSchema, tools: request.metadata?.tools || [], images: request.images, stream: this.settings.streaming }; }
  buildConversationPayload(request) { return { model: this.settings.model, input: request.prompt, context: request.context.payload, transcript: request.transcript, mode: 'conversation', stream: this.settings.streaming }; }
  async requestRemote(request, payload, { onToken, signal } = {}) {
    if (this.settings.localOnlyMode) throw new RuntimeError('LOCAL_ONLY_NETWORK_BLOCKED', 'External requests are disabled in local-only mode.');
    if (!this.settings.endpoint) throw new RuntimeError('ENDPOINT_REQUIRED', 'A model endpoint is required.');
    const credential = this.settings.authenticationMethod === 'NONE' ? null : await this.credentialStore?.get(this.settings.credentialAlias);
    if (this.settings.authenticationMethod !== 'NONE' && !credential) throw new RuntimeError('EXTERNAL_CREDENTIAL_REQUIRED', 'A session credential is required.');
    const controller = new AbortController(), requestId = request.requestId, timeout = setTimeout(() => controller.abort('timeout'), this.settings.timeout); this.active.set(requestId, controller);
    const abort = () => controller.abort(signal?.reason || 'user'); signal?.addEventListener?.('abort', abort, { once: true });
    try {
      const headers = { 'content-type': 'application/json', accept: this.settings.streaming ? 'text/event-stream, application/json' : 'application/json', ...this.settings.requestHeaders };
      if (credential) headers.authorization = this.settings.authenticationMethod === 'API_KEY_HEADER' ? undefined : `Bearer ${credential}`;
      if (credential && this.settings.authenticationMethod === 'API_KEY_HEADER') headers['x-api-key'] = credential;
      const response = await this.fetchImpl(this.settings.endpoint, { method: 'POST', headers: Object.fromEntries(Object.entries(headers).filter(([, value]) => value !== undefined)), body: JSON.stringify(payload), signal: controller.signal, credentials: 'omit', referrerPolicy: 'no-referrer', cache: 'no-store' });
      if (!response.ok) throw Object.assign(new Error(`HTTP ${response.status}`), { status: response.status });
      if (this.settings.streaming && response.headers.get('content-type')?.includes('text/event-stream')) return { content: await this.streamHandler.read(response, { onToken, signal: controller.signal }), toolCalls: [] };
      return await response.json();
    } catch (error) { throw ErrorMapper.map(error, this.settings.provider); }
    finally { clearTimeout(timeout); signal?.removeEventListener?.('abort', abort); this.active.delete(requestId); }
  }
  async createPlan(request, options = {}) { return await this.requestRemote(request, this.buildPayload(request), options); }
  async createMessage(request, options = {}) {
    const response = await this.requestRemote(request, this.buildConversationPayload(request), options);
    return { content: conversationContent(response), usage: response?.usage || null, source: 'MODEL' };
  }
  cancel(requestId) { const controller = this.active.get(requestId); if (!controller) return false; controller.abort('user'); return true; }
}

export class OpenAICompatibleAdapter extends HTTPModelAdapter {
  buildConversationPayload(request) {
    const transcript = (request.transcript || []).filter(item => ['user','assistant'].includes(item.role) && typeof item.content === 'string').map(item => ({ role: item.role, content: item.content }));
    return { model: this.settings.model, messages: [{ role: 'system', content: 'Discuss the current INK artwork using the supplied document context. Do not mutate the document, do not claim execution, and never request direct DOM, Canvas, file-system, or credential access. When the user requests a change, describe it as a bounded proposal; actual execution requires the separate INK approval flow.' }, ...transcript, { role: 'user', content: request.prompt }], stream: this.settings.streaming, user_context: request.context.payload };
  }
  buildPayload(request) {
    const content = [{ type: 'text', text: request.prompt }];
    for (const image of request.images || []) content.push({ type: 'image_url', image_url: { url: image.dataUrl, detail: image.detail || 'low' } });
    return { model: this.settings.model, messages: [{ role: 'system', content: 'Return only an INK structured editable Plan. Use published tools only; never request DOM, Canvas, files, or credentials.' }, { role: 'user', content }], tools: request.metadata?.tools || [], tool_choice: 'auto', response_format: { type: 'json_object' }, stream: this.settings.streaming, user_context: request.context.payload };
  }
  async createPlan(request, options = {}) { const response = await super.createPlan(request, options); if (typeof response?.content === 'string') return response; const message = response.choices?.[0]?.message || {}; return { content: message.content || '{}', toolCalls: message.tool_calls || [], usage: response.usage || null, id: response.id || null }; }
}
export class CustomEndpointAdapter extends HTTPModelAdapter {
  buildPayload(request) { return { version: CHAT_RUNTIME_VERSION, request: { id: request.requestId, sessionId: request.sessionId, prompt: request.prompt, context: request.context, images: request.images, tools: request.metadata?.tools || [], responseSchema: request.responseSchema } }; }
  buildConversationPayload(request) { return { version: CHAT_RUNTIME_VERSION, request: { id: request.requestId, sessionId: request.sessionId, mode: 'conversation', prompt: request.prompt, context: request.context, transcript: request.transcript } }; }
}

export class ModelOutputValidator {
  constructor({ layer, maxRepairAttempts = 2 } = {}) { this.layer = layer; this.maxRepairAttempts = maxRepairAttempts; }
  parse(raw) { if (typeof raw === 'object' && raw) return clone(raw); if (typeof raw !== 'string') throw new RuntimeError('MODEL_RESPONSE_UNSUPPORTED', 'Model response must be JSON text or an object.'); try { return JSON.parse(raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')); } catch (error) { throw ErrorMapper.map(error); } }
  validate(raw) {
    const plan = this.parse(raw), errors = [];
    if (!plan || typeof plan !== 'object') errors.push('PLAN_OBJECT_REQUIRED');
    if (!['INK-EDITABLE-PLAN', 'INK-MODEL-PLAN'].includes(plan.format)) errors.push('FORMAT_INVALID');
    if (!plan.userIntent && !plan.summary) errors.push('INTENT_REQUIRED');
    if (!Array.isArray(plan.orderedSteps) || !plan.orderedSteps.length) errors.push('STEPS_REQUIRED');
    for (const [index, step] of (plan.orderedSteps || []).entries()) {
      if (!step.stepId) errors.push(`STEP_${index}_ID_REQUIRED`);
      if (!this.layer.manifest.get(step.operation)) errors.push(`STEP_${index}_UNKNOWN_COMMAND`);
      if (!step.target && !['document.create', 'document.inspect'].includes(step.operation)) errors.push(`STEP_${index}_TARGET_REQUIRED`);
      if (step.parameters?.script || step.parameters?.code) errors.push(`STEP_${index}_UNSAFE_SCRIPT`);
    }
    if (Number(plan.confidence ?? 1) < this.layer.policy.confidenceThreshold && plan.requestedAction === 'EXECUTE') errors.push('LOW_CONFIDENCE_EXECUTION');
    if (!plan.rollbackStrategy) errors.push('ROLLBACK_STRATEGY_REQUIRED');
    const destructiveSteps = (plan.orderedSteps || []).filter(step => ['layer.delete', 'stroke.delete', 'raster.composite', 'document.restoreCheckpoint'].includes(step.operation));
    if (destructiveSteps.length && !plan.destructiveOperations?.length) errors.push('DESTRUCTIVE_DISCLOSURE_REQUIRED');
    if (errors.length) throw new RuntimeError('PLAN_INVALID', 'Model Plan failed schema and safety validation.', { errors });
    return plan;
  }
  async repair(raw, repairRequester) {
    let value = raw, lastError;
    for (let attempt = 0; attempt <= this.maxRepairAttempts; attempt++) { try { return { plan: this.validate(value), attempts: attempt }; } catch (error) { lastError = error; if (attempt === this.maxRepairAttempts) break; value = await repairRequester({ invalidOutput: typeof value === 'string' ? value.slice(0, 20000) : value, errorSummary: error.details?.errors || [error.code], attempt: attempt + 1 }); } }
    throw new RuntimeError('MODEL_RESPONSE_UNSUPPORTED', 'Model output could not be repaired within the retry limit.', { lastError: lastError?.details, result: 'USER EDIT REQUIRED' });
  }
}

export const TOOL_NAMES = Object.freeze(['get_capabilities', 'get_document_summary', 'get_layer_tree', 'get_editable_targets', 'get_target_details', 'get_palette', 'get_history_summary', 'create_plan', 'validate_plan', 'request_preview', 'get_preview_difference', 'request_approval', 'execute_approved_plan', 'rollback_execution', 'save_variant', 'export_document']);
export function toolDefinitions() { return TOOL_NAMES.map(name => ({ type: 'function', function: { name, description: `INK public tool: ${name}`, parameters: { type: 'object', additionalProperties: false, properties: { id: { type: 'string' }, plan: { type: 'object' }, recipeId: { type: 'string' }, previewId: { type: 'string' }, approvalId: { type: 'string' }, executionId: { type: 'string' }, targets: { type: 'array', items: { type: 'string' } }, options: { type: 'object' } } } } })); }

export class ToolCallRouter {
  constructor({ layer, auditBridge, maxCallsPerMinute = 120 } = {}) { this.layer = layer; this.auditBridge = auditBridge; this.maxCallsPerMinute = maxCallsPerMinute; this.calls = []; this.completed = new Map(); }
  async route(call, { permission = 'PROPOSE', scope = 'CURRENT_DOCUMENT', sessionId = 'chat' } = {}) {
    const id = call?.id || call?.toolCallId; if (!id || !idPattern.test(id)) throw new RuntimeError('TOOL_CALL_ID_INVALID', 'Tool call ID is invalid.');
    if (this.completed.has(id)) return clone(this.completed.get(id));
    const name = call.name || call.function?.name, argsRaw = call.arguments ?? call.function?.arguments ?? {}, args = typeof argsRaw === 'string' ? JSON.parse(argsRaw) : clone(argsRaw);
    if (!TOOL_NAMES.includes(name)) throw new RuntimeError('UNKNOWN_TOOL', 'The model requested an unpublished tool.', { name });
    if (scope !== 'CURRENT_DOCUMENT') throw new RuntimeError('SCOPE_VIOLATION', 'Tool call scope is not permitted.', { scope });
    const cutoff = Date.now() - 60000; this.calls = this.calls.filter(time => time > cutoff); if (this.calls.length >= this.maxCallsPerMinute) throw new RuntimeError('TOOL_RATE_LIMIT', 'Tool call rate limit exceeded.', {}, { retryable: true }); this.calls.push(Date.now());
    const mutating = ['request_preview', 'request_approval', 'execute_approved_plan', 'rollback_execution', 'save_variant', 'export_document'];
    if (mutating.includes(name) && permission === 'OBSERVE') throw new RuntimeError('PERMISSION_DENIED', 'Observe permission cannot request this tool.', { name, permission });
    if (name === 'execute_approved_plan' && permission !== 'EXECUTE') throw new RuntimeError('PERMISSION_DENIED', 'Execute tool requires explicit EXECUTE bridge.', { name, permission });
    let result;
    switch (name) {
      case 'get_capabilities': result = this.layer.manifest.toJSON(); break;
      case 'get_document_summary': result = this.layer.stateReader.read(this.layer.currentDocument(), { sections: ['documentSummary', 'capabilityState'] }); break;
      case 'get_layer_tree': result = this.layer.stateReader.read(this.layer.currentDocument(), { sections: ['layerTree'] }); break;
      case 'get_editable_targets': result = this.layer.stateReader.read(this.layer.currentDocument(), { sections: ['editableTargets', 'protectedTargets'] }); break;
      case 'get_target_details': result = this.layer.stateReader.read(this.layer.currentDocument(), { objectIds: args.targets, limit: 100 }); break;
      case 'get_palette': result = this.layer.stateReader.read(this.layer.currentDocument(), { sections: ['palette'] }); break;
      case 'get_history_summary': result = this.layer.stateReader.read(this.layer.currentDocument(), { sections: ['historySummary'] }); break;
      case 'create_plan': result = this.layer.createPlanFromSteps(args.plan?.userIntent || args.plan?.summary || 'External CHAT Plan', args.plan?.orderedSteps || [], args.plan || {}); break;
      case 'validate_plan': result = this.layer.editPlan(args.plan?.planId || args.id, {}); break;
      case 'request_preview': result = this.layer.preview(args.recipeId, args.options); break;
      case 'get_preview_difference': result = clone(this.layer.previews.get(args.previewId)?.difference || null); break;
      case 'request_approval': result = { status: 'USER_APPROVAL_REQUIRED', previewId: args.previewId, selectedSteps: args.options?.selectedSteps || null, modelCannotApprove: true }; break;
      case 'execute_approved_plan': result = this.layer.executeApproval(args.approvalId); break;
      case 'rollback_execution': result = this.layer.rollback(args.executionId); break;
      case 'save_variant': result = { status: 'VARIANT_READY', name: args.options?.name || 'AI Variant', document: this.layer.previewEngine.branch(args.previewId), editable: true }; break;
      case 'export_document': result = { status: 'USER_GESTURE_REQUIRED', export: clone(args.options || {}), documentHash: hashValue(this.layer.currentDocument()) }; break;
    }
    const envelope = { format: 'INK-TOOL-RESULT', version: CHAT_RUNTIME_VERSION, toolCallId: id, name, status: 'COMPLETED', result: redactSecrets(result) };
    this.auditBridge?.record({ sessionId, toolCallId: id, name, permission, scope, status: 'COMPLETED', resultHash: hashValue(envelope.result) }); this.completed.set(id, clone(envelope)); return envelope;
  }
}

export class ApprovalBridge { constructor(layer) { this.layer = layer; } request(previewId, options) { return this.layer.approve(previewId, options); } }
export class ExecutionBridge { constructor(layer) { this.layer = layer; } execute(approvalId) { return this.layer.executeApproval(approvalId); } rollback(executionId) { return this.layer.rollback(executionId); } }
export class AuditBridge {
  constructor(layer) { this.layer = layer; this.networkRecords = []; }
  record(entry) { const clean = { ...redactSecrets(entry), timestamp: now() }; this.networkRecords.push(clean); this.layer.audit.add({ permissionLevel: entry.permission || 'OBSERVE', actor: { type: 'chat-runtime', id: entry.sessionId || 'runtime' }, commands: entry.name ? [entry.name] : [], securityEvents: entry.securityEvents || [], auditMetadata: clean }); return clean; }
  recordTransmission(preview, decision) { return this.record({ sessionId: preview.sessionId, name: 'network.transmission', permission: 'OBSERVE', provider: preview.provider, endpoint: preview.endpoint, model: preview.model, decision, dataCategories: preview.dataCategories, imageIncluded: preview.imageIncluded, estimatedBytes: preview.estimatedBytes, credential: '[NEVER LOGGED]' }); }
  report() { return clone(this.networkRecords); }
}

export function buildTransmissionPreview({ settings, request, image = null, decision = 'TEXT_SUMMARY' } = {}) {
  if (!TRANSMISSION_CHOICES.includes(decision)) throw new RuntimeError('INVALID_TRANSMISSION_DECISION', 'Unknown transmission decision.');
  const includesImage = ['SELECTED_REGION', 'LOW_RES_PREVIEW', 'FULL_IMAGE'].includes(decision) && Boolean(image);
  return { format: 'INK-TRANSMISSION-PREVIEW', version: CHAT_RUNTIME_VERSION, sessionId: request.sessionId, provider: settings.provider, endpoint: settings.endpoint || 'LOCAL', model: settings.model || 'N/A', dataCategories: { text: true, capability: true, documentStructure: request.context.level !== 'CAPABILITY_ONLY', history: Boolean(request.context.payload?.summary?.historySummary?.entries?.length), image: includesImage, personalOrExternalAssets: Boolean(image?.externalAsset) }, imageIncluded: includesImage, thumbnail: includesImage ? image.thumbnail || null : null, imageSize: includesImage ? image.size || null : null, transmissionResolution: includesImage ? image.transmissionResolution || null : null, cropped: includesImage ? Boolean(image.cropped) : false, region: includesImage ? image.region || null : null, providerRetention: settings.loggingPolicy, estimatedBytes: utf8Bytes(request.context) + utf8Bytes(request.prompt) + (includesImage ? Number(image.bytes || 0) : 0), risks: settings.endpoint ? ['External endpoint may process transmitted data under its own policy.'] : [], requiresApproval: settings.endpoint ? true : false };
}

export class ChatSessionManager {
  constructor({ layer, clients = {}, contextBuilder, validator, toolRouter, auditBridge, credentialStore } = {}) { this.layer = layer; this.clients = new Map(Object.entries(clients)); this.contextBuilder = contextBuilder; this.validator = validator; this.toolRouter = toolRouter; this.auditBridge = auditBridge; this.credentialStore = credentialStore; this.sessions = new Map(); this.mode = 'STANDARD'; }
  setMode(mode) { if (!STARTUP_MODES.includes(mode)) throw new RuntimeError('INVALID_STARTUP_MODE', 'Unknown startup mode.'); this.mode = mode; if (['LOCAL_ONLY', 'SAFE'].includes(mode)) for (const [name, client] of this.clients) if (client.external) this.clients.delete(name); return mode; }
  register(name, client) { if (!(client instanceof ChatClientInterface)) throw new RuntimeError('CLIENT_INTERFACE_REQUIRED', 'Client must implement ChatClientInterface.'); this.clients.set(name, client); return name; }
  start({ client = 'manual-json', settings = null } = {}) { if (!this.clients.has(client)) throw new RuntimeError('CLIENT_NOT_FOUND', 'Selected chat client is unavailable.', { client }); const sessionId = `chat:${hashValue([client, now(), Math.random()])}`; const session = { sessionId, client, settings: redactSecrets(settings), createdAt: now(), messages: [], status: 'READY' }; this.sessions.set(sessionId, session); return clone(session); }
  async requestPlan(sessionId, { prompt, contextOptions = {}, images = [], transmissionDecision = 'TEXT_SUMMARY', userConsent = false, onToken } = {}) {
    const session = this.sessions.get(sessionId), client = this.clients.get(session?.client); if (!session || !client) throw new RuntimeError('SESSION_NOT_FOUND', 'Chat session is unavailable.');
    const context = this.contextBuilder.build(contextOptions), request = new PlanRequest({ sessionId, prompt, context, images: images.filter(Boolean), transmissionDecision, metadata: { tools: toolDefinitions() } }), preview = buildTransmissionPreview({ settings: client.settings, request, image: images[0], decision: transmissionDecision });
    if (client.external && !userConsent) return { status: 'TRANSMISSION_APPROVAL_REQUIRED', transmissionPreview: preview, request: redactSecrets(request) };
    if (this.mode === 'STANDARD' && client.external) throw new RuntimeError('STANDARD_MODE_CONNECTION_BLOCKED', 'Standard mode never establishes external connections.');
    if (['LOCAL_ONLY', 'SAFE'].includes(this.mode) && client.external) throw new RuntimeError('LOCAL_ONLY_NETWORK_BLOCKED', 'External requests are disabled in this mode.');
    this.auditBridge.recordTransmission(preview, transmissionDecision);
    let response, attempt = 0;
    while (true) { try { response = await client.createPlan(request, { onToken }); break; } catch (error) { const mapped = ErrorMapper.map(error, client.settings.provider); if (!mapped.retryable || attempt >= client.settings.retryCount) throw mapped; attempt++; } }
    for (const call of response.toolCalls || []) await this.toolRouter.route(call, { permission: 'PROPOSE', sessionId });
    const repaired = await this.validator.repair(response.content, async repair => { const repairRequest = new PlanRequest({ sessionId, prompt: `Repair this Plan. Errors: ${repair.errorSummary.join(', ')}. Return JSON only.`, context, transmissionDecision, metadata: { invalidOutput: repair.invalidOutput, tools: [] } }); const repairedResponse = await client.createPlan(repairRequest, { onToken }); return repairedResponse.content; });
    const plan = repaired.plan.format === 'INK-EDITABLE-PLAN' && repaired.plan.recipeDraft ? repaired.plan : this.layer.createPlanFromSteps(repaired.plan.userIntent || repaired.plan.summary, repaired.plan.orderedSteps, repaired.plan);
    const output = new PlanResponse({ requestId: request.requestId, provider: client.settings.provider, model: client.settings.model, raw: redactSecrets(response.content), plan, toolCalls: response.toolCalls, usage: response.usage }); session.messages.push({ role: 'user', content: prompt, contextHash: context.hash }, { role: 'assistant', planId: plan.planId, responseHash: hashValue(output) }); return output;
  }
  async requestConversation(sessionId, { prompt, contextOptions = {}, transmissionDecision = 'TEXT_SUMMARY', userConsent = false, onToken } = {}) {
    const session = this.sessions.get(sessionId), client = this.clients.get(session?.client); if (!session || !client) throw new RuntimeError('SESSION_NOT_FOUND', 'Chat session is unavailable.');
    const normalizedPrompt = String(prompt || '').trim(); if (!normalizedPrompt) throw new RuntimeError('CONVERSATION_PROMPT_REQUIRED', 'Conversation prompt is required.');
    const context = this.contextBuilder.build(contextOptions);
    const transcript = session.messages.filter(item => ['user','assistant'].includes(item.role) && typeof item.content === 'string').slice(-12);
    const request = new ConversationRequest({ sessionId, prompt: normalizedPrompt, context, transcript, transmissionDecision });
    const preview = buildTransmissionPreview({ settings: client.settings, request, decision: transmissionDecision });
    if (client.external && !userConsent) return { status: 'TRANSMISSION_APPROVAL_REQUIRED', transmissionPreview: preview, request: redactSecrets(request) };
    if (this.mode === 'STANDARD' && client.external) throw new RuntimeError('STANDARD_MODE_CONNECTION_BLOCKED', 'Standard mode never establishes external connections.');
    if (['LOCAL_ONLY', 'SAFE'].includes(this.mode) && client.external) throw new RuntimeError('LOCAL_ONLY_NETWORK_BLOCKED', 'External requests are disabled in this mode.');
    this.auditBridge.recordTransmission(preview, transmissionDecision);
    let response, attempt = 0;
    while (true) { try { response = await client.createMessage(request, { onToken }); break; } catch (error) { const mapped = ErrorMapper.map(error, client.settings.provider); if (!mapped.retryable || attempt >= client.settings.retryCount) throw mapped; attempt++; } }
    const output = new ConversationResponse({ requestId: request.requestId, provider: client.settings.provider, model: client.settings.model, content: conversationContent(response), usage: response?.usage || null, source: response?.source || (client.external ? 'MODEL' : 'LOCAL_CONTEXT') });
    session.messages.push({ role: 'user', content: normalizedPrompt, contextHash: context.hash }, { role: 'assistant', content: output.content, responseHash: hashValue(output), source: output.source });
    return output;
  }
  end(sessionId, { clearCredentials = true } = {}) { const session = this.sessions.get(sessionId); if (!session) return false; this.clients.get(session.client)?.cancel?.(); this.sessions.delete(sessionId); if (clearCredentials) this.credentialStore?.clearAll(); return true; }
}

function defaultGroundedContextProvider(layer) {
  const app = layer?.app;
  if (!app || typeof layer?.currentDocument !== 'function') return null;
  return createCreativeIntelligenceContextAdapter({
    getDocument: () => layer.currentDocument(),
    getSelectedObjectIds: () => (Array.isArray(app.selection) ? app.selection : [])
      .map(item => item?.objectId)
      .filter(id => typeof id === 'string'),
    getRevisionId: () => app.revisions?.revisionIdFor?.(layer.currentDocument()?.id) ?? null,
    getRevisionRecords: () => {
      const documentId = layer.currentDocument()?.id;
      const records = app.revisions?.records;
      if (!records || typeof records.values !== 'function') return [];
      return [...records.values()].filter(record => record?.documentId === documentId);
    },
    getHistoryEntries: () => [
      ...(Array.isArray(app.history?.undoStack) ? app.history.undoStack : []),
      ...(Array.isArray(app.history?.redoStack) ? app.history.redoStack : [])
    ].map(entry => ({
      label: typeof entry?.label === 'string' && entry.label.trim() ? entry.label : 'History change',
      objectIds: Array.isArray(entry?.objectIds) ? entry.objectIds.filter(id => typeof id === 'string') : [],
      patchCount: Number.isFinite(Number(entry?.patchCount)) ? Number(entry.patchCount) : 0,
      storedBytes: Number.isFinite(Number(entry?.storedBytes)) ? Number(entry.storedBytes) : 0
    }))
  });
}

export function createChatRuntime(layer, { fetchImpl = globalThis.fetch, sessionStorage = globalThis.sessionStorage, crypto = globalThis.crypto, groundedContextProvider = undefined } = {}) {
  const resolvedGroundedContextProvider = groundedContextProvider === undefined ? defaultGroundedContextProvider(layer) : groundedContextProvider;
  const credentialStore = new CredentialSecuritySystem({ sessionStorage, crypto }), capabilityProvider = new CapabilityProvider(layer), documentStateProvider = new DocumentStateProvider(layer), auditBridge = new AuditBridge(layer), contextBuilder = new ContextBuilder({ capabilityProvider, documentStateProvider, groundedContextProvider: resolvedGroundedContextProvider }), validator = new ModelOutputValidator({ layer }), toolRouter = new ToolCallRouter({ layer, auditBridge });
  const manager = new ChatSessionManager({ layer, contextBuilder, validator, toolRouter, auditBridge, credentialStore });
  manager.register('manual-json', new ManualJSONClient());
  let configuredProvider = null;
  return { version: CHAT_RUNTIME_VERSION, manager, credentialStore, capabilityProvider, documentStateProvider, groundedContextProvider: resolvedGroundedContextProvider, contextBuilder, validator, toolRouter, auditBridge, approvalBridge: new ApprovalBridge(layer), executionBridge: new ExecutionBridge(layer), clients: { HTTPModelAdapter, OpenAICompatibleAdapter, CustomEndpointAdapter, RuntimeDeterministicTestClient, ManualJSONClient }, configure(name, settings) { const normalized = createConnectionSettings(settings); if (configuredProvider && configuredProvider !== normalized.provider) credentialStore.clearAll(); configuredProvider = normalized.provider; const Adapter = normalized.provider === 'openai-compatible' ? OpenAICompatibleAdapter : normalized.provider === 'custom-endpoint' ? CustomEndpointAdapter : HTTPModelAdapter; const client = new Adapter(normalized, { credentialStore, fetchImpl }); manager.register(name, client); return redactSecrets(client.settings); } };
}
