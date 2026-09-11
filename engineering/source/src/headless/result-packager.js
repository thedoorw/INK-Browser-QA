import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

export async function ensureDirectory(directory) { await mkdir(directory, { recursive: true }); return directory; }
export async function writeJSON(file, value) { await ensureDirectory(path.dirname(file)); await writeFile(file, `${JSON.stringify(value, null, 2)}\n`); return file; }
export async function writeText(file, value) { await ensureDirectory(path.dirname(file)); await writeFile(file, String(value)); return file; }

export function structuredError(error, fallback = 'HEADLESS_RUNTIME_FAILED') {
  return { format: 'INK-HEADLESS-ERROR', version: '1.0', status: 'FAILED', code: error?.code || fallback, message: error?.message || String(error), details: error?.details || {}, reproducible: true };
}
