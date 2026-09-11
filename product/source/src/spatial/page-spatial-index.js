import { boundsContains, unionBounds } from '../core/index.js';
import { Quadtree } from './quadtree.js';

export class PageSpatialIndex {
  constructor({ padding = 256, capacity = 12, maxDepth = 8 } = {}) {
    this.padding = padding;
    this.capacity = capacity;
    this.maxDepth = maxDepth;
    this.tree = null;
    this.items = [];
    this.itemById = new Map();
    this.pageId = null;
    this.revision = 0;
    this.incrementalUpdates = 0;
    this.fullRebuilds = 0;
  }

  makeRootBounds(world) {
    return world
      ? { x: world.x - this.padding, y: world.y - this.padding, w: Math.max(512, world.w + this.padding * 2), h: Math.max(512, world.h + this.padding * 2) }
      : { x: -2048, y: -2048, w: 4096, h: 4096 };
  }

  rebuild(page, boundsForObject) {
    this.pageId = page?.id || null;
    this.items = [];
    this.itemById.clear();
    let world = null;
    for (let layerIndex = 0; layerIndex < (page?.layers?.length || 0); layerIndex += 1) {
      const layer = page.layers[layerIndex];
      if (!layer.visible) continue;
      for (let objectIndex = 0; objectIndex < layer.objects.length; objectIndex += 1) {
        const object = layer.objects[objectIndex];
        const bounds = boundsForObject(object);
        if (!bounds) continue;
        world = unionBounds(world, bounds);
        const item = { layer, layerIndex, object, objectIndex, bounds };
        this.items.push(item);
        this.itemById.set(object.id, item);
      }
    }
    this.tree = new Quadtree(this.makeRootBounds(world), { capacity: this.capacity, maxDepth: this.maxDepth });
    for (const item of this.items) this.tree.insert(item);
    this.revision += 1;
    this.fullRebuilds += 1;
    return this;
  }

  removeObject(objectId) {
    const item = this.itemById.get(objectId);
    if (!item) return false;
    this.tree?.remove(candidate => candidate.object.id === objectId);
    this.itemById.delete(objectId);
    this.items = this.items.filter(candidate => candidate.object.id !== objectId);
    this.revision += 1;
    this.incrementalUpdates += 1;
    return true;
  }

  upsertObject({ layer, layerIndex, object, objectIndex, bounds }) {
    if (!object?.id || !bounds) return false;
    const nextItem = { layer, layerIndex, object, objectIndex, bounds };
    const outside = this.tree && !boundsContains(this.tree.bounds, bounds);
    if (outside) return false;
    this.tree?.remove(candidate => candidate.object.id === object.id);
    this.items = this.items.filter(candidate => candidate.object.id !== object.id);
    this.itemById.set(object.id, nextItem);
    this.items.push(nextItem);
    this.tree?.insert(nextItem);
    this.revision += 1;
    this.incrementalUpdates += 1;
    return true;
  }

  syncObject(page, objectId, boundsForObject) {
    if (!this.tree || page?.id !== this.pageId) return false;
    let found = null;
    for (let layerIndex = 0; layerIndex < page.layers.length && !found; layerIndex += 1) {
      const layer = page.layers[layerIndex];
      const objectIndex = layer.objects.findIndex(object => object.id === objectId);
      if (objectIndex >= 0 && layer.visible) found = { layer, layerIndex, object: layer.objects[objectIndex], objectIndex };
    }
    if (!found) return this.removeObject(objectId);
    const bounds = boundsForObject(found.object);
    return this.upsertObject({ ...found, bounds });
  }

  syncObjects(page, objectIds, boundsForObject) {
    if (!this.tree || page?.id !== this.pageId) return false;
    for (const objectId of new Set(objectIds)) {
      if (!this.syncObject(page, objectId, boundsForObject)) return false;
    }
    return true;
  }

  refreshMetadata(page) {
    if (!this.tree || page?.id !== this.pageId) return false;
    for (let layerIndex = 0; layerIndex < page.layers.length; layerIndex += 1) {
      const layer = page.layers[layerIndex];
      for (let objectIndex = 0; objectIndex < layer.objects.length; objectIndex += 1) {
        const item = this.itemById.get(layer.objects[objectIndex].id);
        if (item) Object.assign(item, { layer, layerIndex, object: layer.objects[objectIndex], objectIndex });
      }
    }
    return true;
  }

  query(bounds) {
    if (!this.tree) return [];
    return this.tree.query(bounds, []);
  }

  stats() {
    return {
      pageId: this.pageId,
      objects: this.items.length,
      nodes: this.tree?.countNodes() || 0,
      revision: this.revision,
      fullRebuilds: this.fullRebuilds,
      incrementalUpdates: this.incrementalUpdates,
      mode: 'incremental-quadtree'
    };
  }
}
