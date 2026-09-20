import { Matrix } from '../core/index.js';
import { findPageObject } from '../document/hierarchy.js';
import { moveAnchor, moveBezierHandle, setAnchorMode } from '../vector/vector-core.js';

const ANCHOR_MODES = new Set(['corner', 'smooth', 'symmetric']);
const HANDLE_SIDES = new Set(['in', 'out']);

const fail = (code, details = {}) => {
  const error = Object.assign(new Error(`INK_PATH_EDIT_${code}`), { code: `PATH_EDIT_${code}`, ...details });
  throw error;
};

const keyForAnchor = (subpathIndex, anchorIndex) => `${subpathIndex}:${anchorIndex}`;

function finiteNumber(value, code = 'NON_FINITE_INPUT') {
  if (!Number.isFinite(value)) fail(code);
  return value;
}

function metadataFingerprint(path) {
  return JSON.stringify(path?.metadata ?? {});
}

function selectedCandidate(app, ref = null) {
  if (ref) return findPageObject(app.page(), ref);
  const selected = typeof app.selectedObjects === 'function'
    ? app.selectedObjects()
    : (app.selection || []).map(item => findPageObject(app.page(), item)).filter(Boolean);
  return selected.length === 1 ? selected[0] : null;
}

function validateAnchorRef(path, subpathIndex, anchorIndex) {
  if (!Number.isInteger(subpathIndex) || !Number.isInteger(anchorIndex)) fail('ANCHOR_REF_INVALID');
  const subpath = path?.subpaths?.[subpathIndex];
  const anchor = subpath?.anchors?.[anchorIndex];
  if (!anchor) fail('ANCHOR_NOT_FOUND', { subpathIndex, anchorIndex });
  return { subpath, anchor };
}

export function assertFinitePathGeometry(path) {
  if (!path || path.type !== 'path' || !Array.isArray(path.subpaths)) fail('PATH_INVALID');
  for (let subpathIndex = 0; subpathIndex < path.subpaths.length; subpathIndex += 1) {
    const subpath = path.subpaths[subpathIndex];
    if (!subpath || !Array.isArray(subpath.anchors)) fail('SUBPATH_INVALID', { subpathIndex });
    for (let anchorIndex = 0; anchorIndex < subpath.anchors.length; anchorIndex += 1) {
      const anchor = subpath.anchors[anchorIndex];
      const values = [anchor?.x, anchor?.y, anchor?.in?.x, anchor?.in?.y, anchor?.out?.x, anchor?.out?.y];
      if (!values.every(Number.isFinite)) fail('NON_FINITE_GEOMETRY', { subpathIndex, anchorIndex });
      if (!ANCHOR_MODES.has(anchor.mode || 'corner')) fail('ANCHOR_MODE_INVALID', { subpathIndex, anchorIndex });
    }
  }
  return true;
}

export class PathEditController {
  constructor(app) {
    this.app = app;
    this.state = null;
  }

  get active() {
    return Boolean(this.state);
  }

  enter(ref = null) {
    if (this.app.history?.pending) fail('HISTORY_BUSY');
    const found = selectedCandidate(this.app, ref);
    if (!found || found.object?.type !== 'path') fail('PATH_NOT_FOUND');
    if (found.effectiveLocked || found.effectiveVisible === false) fail('TARGET_UNAVAILABLE');
    if (!Matrix.isInvertible(found.worldMatrix || found.object.matrix || Matrix.identity())) fail('SINGULAR_TARGET');
    assertFinitePathGeometry(found.object);
    this.state = {
      documentId: this.app.doc?.id || null,
      pageId: this.app.page()?.id || null,
      ref: { layerId: found.layer.id, objectId: found.object.id },
      anchorKeys: new Set(),
      handle: null
    };
    this.app.selection = [{ ...this.state.ref }];
    return this.snapshot();
  }

  exit() {
    const hadState = Boolean(this.state);
    this.state = null;
    return hadState;
  }

  resolve({ requireHistoryIdle = false } = {}) {
    const state = this.state;
    if (!state) fail('MODE_INACTIVE');
    if (state.documentId !== (this.app.doc?.id || null) || state.pageId !== (this.app.page()?.id || null)) fail('STALE_TARGET');
    if (requireHistoryIdle && this.app.history?.pending) fail('HISTORY_BUSY');
    const found = findPageObject(this.app.page(), state.ref);
    if (!found || found.object?.type !== 'path') fail('STALE_TARGET');
    if (found.effectiveLocked || found.effectiveVisible === false) fail('TARGET_UNAVAILABLE');
    if (!Matrix.isInvertible(found.worldMatrix || found.object.matrix || Matrix.identity())) fail('SINGULAR_TARGET');
    assertFinitePathGeometry(found.object);
    return found;
  }

  clearSelection() {
    this.resolve();
    this.state.anchorKeys.clear();
    this.state.handle = null;
    return this.snapshot();
  }

  selectAnchor(subpathIndex, anchorIndex, { add = false, toggle = false } = {}) {
    const found = this.resolve();
    validateAnchorRef(found.object, subpathIndex, anchorIndex);
    const key = keyForAnchor(subpathIndex, anchorIndex);
    if (!add && !toggle) this.state.anchorKeys.clear();
    if (toggle && this.state.anchorKeys.has(key)) this.state.anchorKeys.delete(key);
    else this.state.anchorKeys.add(key);
    this.state.handle = null;
    return this.snapshot();
  }

  selectAnchors(refs = [], { add = false } = {}) {
    const found = this.resolve();
    if (!Array.isArray(refs)) fail('ANCHOR_SELECTION_INVALID');
    if (!add) this.state.anchorKeys.clear();
    for (const ref of refs) {
      validateAnchorRef(found.object, ref?.subpathIndex, ref?.anchorIndex);
      this.state.anchorKeys.add(keyForAnchor(ref.subpathIndex, ref.anchorIndex));
    }
    this.state.handle = null;
    return this.snapshot();
  }

  selectHandle(subpathIndex, anchorIndex, side) {
    const found = this.resolve();
    validateAnchorRef(found.object, subpathIndex, anchorIndex);
    if (!HANDLE_SIDES.has(side)) fail('HANDLE_SIDE_INVALID');
    this.state.anchorKeys.clear();
    this.state.anchorKeys.add(keyForAnchor(subpathIndex, anchorIndex));
    this.state.handle = { subpathIndex, anchorIndex, side };
    return this.snapshot();
  }

  selectedAnchors() {
    const found = this.resolve();
    const refs = [];
    for (const key of this.state.anchorKeys) {
      const [subpathIndex, anchorIndex] = key.split(':').map(Number);
      validateAnchorRef(found.object, subpathIndex, anchorIndex);
      refs.push({ subpathIndex, anchorIndex });
    }
    return refs.sort((a, b) => a.subpathIndex - b.subpathIndex || a.anchorIndex - b.anchorIndex);
  }

  mutate(label, operation) {
    const found = this.resolve({ requireHistoryIdle: true });
    const target = this.app.objectPath?.(found);
    if (!Array.isArray(target) || !this.app.history?.pushScoped) fail('HISTORY_REQUIRED');
    const objectId = found.object.id;
    const metadataBefore = metadataFingerprint(found.object);
    let result;
    this.app.history.pushScoped(label, [target], () => {
      result = operation(found.object, found);
      assertFinitePathGeometry(found.object);
      if (found.object.id !== objectId) fail('IDENTITY_CHANGED');
      if (metadataFingerprint(found.object) !== metadataBefore) fail('METADATA_CHANGED');
    });
    this.app.queueSpatialObject?.(this.state.ref);
    this.app.spatialDirty = true;
    this.app.refreshAll?.();
    this.app.renderer?.render?.();
    return result;
  }

  moveSelectedAnchors(dx, dy) {
    finiteNumber(dx);
    finiteNumber(dy);
    const refs = this.selectedAnchors();
    if (!refs.length) fail('ANCHOR_SELECTION_EMPTY');
    this.mutate('Move Path anchors', path => {
      for (const ref of refs) {
        const { anchor } = validateAnchorRef(path, ref.subpathIndex, ref.anchorIndex);
        moveAnchor(path, ref.subpathIndex, ref.anchorIndex, anchor.x + dx, anchor.y + dy);
      }
    });
    return this.snapshot();
  }

  moveAnchorTo(subpathIndex, anchorIndex, x, y) {
    finiteNumber(x);
    finiteNumber(y);
    this.resolve();
    validateAnchorRef(this.resolve().object, subpathIndex, anchorIndex);
    this.mutate('Reshape Path anchor', path => moveAnchor(path, subpathIndex, anchorIndex, x, y));
    this.state.anchorKeys.clear();
    this.state.anchorKeys.add(keyForAnchor(subpathIndex, anchorIndex));
    this.state.handle = null;
    return this.snapshot();
  }

  moveSelectedHandle(x, y) {
    finiteNumber(x);
    finiteNumber(y);
    const selected = this.state?.handle;
    if (!selected) fail('HANDLE_SELECTION_EMPTY');
    this.mutate('Move Path Bézier handle', path => {
      validateAnchorRef(path, selected.subpathIndex, selected.anchorIndex);
      moveBezierHandle(path, selected.subpathIndex, selected.anchorIndex, selected.side, x, y);
    });
    return this.snapshot();
  }

  setSelectedAnchorMode(mode) {
    if (!ANCHOR_MODES.has(mode)) fail('ANCHOR_MODE_INVALID');
    const refs = this.selectedAnchors();
    if (!refs.length) fail('ANCHOR_SELECTION_EMPTY');
    this.mutate('Set Path anchor mode', path => {
      for (const ref of refs) setAnchorMode(path, ref.subpathIndex, ref.anchorIndex, mode);
    });
    this.state.handle = null;
    return this.snapshot();
  }

  snapshot() {
    if (!this.state) return { active: false, ref: null, anchors: [], handle: null };
    return {
      active: true,
      ref: { ...this.state.ref },
      anchors: [...this.state.anchorKeys].sort(),
      handle: this.state.handle ? { ...this.state.handle } : null
    };
  }
}

export function installPathEditing(app) {
  if (!app || typeof app !== 'object') fail('APP_REQUIRED');
  if (app.pathEditing instanceof PathEditController) return app.pathEditing;
  app.pathEditing = new PathEditController(app);
  return app.pathEditing;
}
