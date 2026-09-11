import { randomUUID } from 'node:crypto';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { defaultDocument } from '../document/model.js';
import { migrateDocument } from '../document/migration.js';
import { hashValue } from '../ai/ai-core.js';
import { writeJSON } from './result-packager.js';

const clone = value => structuredClone(value);
const iso = () => new Date().toISOString();

export function deterministicBlankDocument(seed = 15101) {
  const document = defaultDocument(), stamp = '2000-01-01T00:00:00.000Z';
  document.id = `document-${seed}`; document.title = 'INK Headless Document'; document.createdAt = stamp; document.modifiedAt = stamp;
  document.pages[0].id = `page-${seed}`; document.activePageId = document.pages[0].id;
  document.pages[0].layers[0].id = `layer-base-${seed}`; document.pages[0].activeLayerId = document.pages[0].layers[0].id;
  document.pages[0].paper.color = '#ffffff'; document.pages[0].paper.textureVisible = false;
  return document;
}

export class SessionManager {
  constructor({ root = path.resolve('.ink-headless', 'sessions') } = {}) { this.root = path.resolve(root); }
  sessionDirectory(sessionId) { return path.join(this.root, sessionId); }
  sessionPath(sessionId) { return path.join(this.sessionDirectory(sessionId), 'session.json'); }

  async create({ document = null, documentPath = null, seed = 15101, sessionId = null } = {}) {
    const id = sessionId || `session-${randomUUID()}`, directory = this.sessionDirectory(id);
    await mkdir(directory, { recursive: true });
    const loaded = migrateDocument(document || (documentPath ? JSON.parse(await readFile(documentPath, 'utf8')) : deterministicBlankDocument(seed)));
    const currentPath = path.join(directory, 'current.ink'); await writeJSON(currentPath, loaded);
    const now = iso(), session = {
      format: 'INK-CONVERSATIONAL-SESSION', version: '1.0', sessionId: id, documentPath: 'current.ink',
      currentDocumentHash: hashValue(loaded), currentExecutionId: null, currentCheckpointId: null,
      rounds: [], activeTargets: [], unresolvedItems: [], constraints: {}, pending: null,
      createdAt: now, updatedAt: now
    };
    await writeJSON(this.sessionPath(id), session); return clone(session);
  }

  async resolve(reference) {
    const candidate = path.resolve(reference || '');
    try { await access(candidate); return candidate; } catch {}
    const byId = this.sessionPath(reference); await access(byId); return byId;
  }

  async load(reference) {
    const file = await this.resolve(reference), session = JSON.parse(await readFile(file, 'utf8'));
    if (session.format !== 'INK-CONVERSATIONAL-SESSION') throw Object.assign(new Error('Invalid INK conversational session'), { code: 'SESSION_INVALID' });
    return { session, file, directory: path.dirname(file) };
  }

  async document(reference) {
    const loaded = await this.load(reference), documentPath = path.resolve(loaded.directory, loaded.session.documentPath);
    return { ...loaded, documentPath, document: migrateDocument(JSON.parse(await readFile(documentPath, 'utf8'))) };
  }

  async save(file, session) { session.updatedAt = iso(); await writeJSON(file, session); return clone(session); }

  async replaceDocument(reference, document) {
    const loaded = await this.load(reference), documentPath = path.resolve(loaded.directory, loaded.session.documentPath);
    await writeJSON(documentPath, document); loaded.session.currentDocumentHash = hashValue(document);
    await this.save(loaded.file, loaded.session); return { ...loaded, documentPath, document };
  }
}
