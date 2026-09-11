import { createServer } from 'node:http';
import { networkInterfaces } from 'node:os';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { INK_VERSION } from '../src/config.js';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const MIME = new Map([
  ['.html', 'text/html; charset=utf-8'], ['.js', 'text/javascript; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'], ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'], ['.webmanifest', 'application/manifest+json; charset=utf-8'],
  ['.png', 'image/png'], ['.jpg', 'image/jpeg'], ['.jpeg', 'image/jpeg'],
  ['.svg', 'image/svg+xml; charset=utf-8'], ['.ink', 'application/json; charset=utf-8'],
  ['.md', 'text/markdown; charset=utf-8'], ['.csv', 'text/csv; charset=utf-8']
]);

function parseArgs(argv = process.argv.slice(2)) {
  const out = { host: process.env.INK_HOST || '0.0.0.0', port: Number(process.env.INK_PORT || 4173) };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--host' && argv[i + 1]) out.host = argv[++i];
    else if (argv[i] === '--port' && argv[i + 1]) out.port = Number(argv[++i]);
  }
  if (!Number.isInteger(out.port) || out.port < 0 || out.port > 65535) throw new Error('Port must be an integer from 0 to 65535.');
  return out;
}

function safePath(urlPath) {
  const decoded = decodeURIComponent((urlPath || '/').split('?')[0]);
  const relative = decoded === '/' ? 'index.html' : decoded.replace(/^\/+/, '');
  const full = resolve(ROOT, normalize(relative));
  if (full !== ROOT && !full.startsWith(ROOT + sep)) return null;
  return full;
}

export function createInkServer({ host = '0.0.0.0', port = 4173 } = {}) {
  const server = createServer(async (req, res) => {
    try {
      const path = safePath(req.url);
      if (!path) {
        res.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' });
        res.end('Forbidden');
        return;
      }
      let target = path;
      const info = await stat(target).catch(() => null);
      if (info?.isDirectory()) target = join(target, 'index.html');
      const body = await readFile(target);
      const ext = extname(target).toLowerCase();
      const headers = {
        'content-type': MIME.get(ext) || 'application/octet-stream',
        'x-content-type-options': 'nosniff',
        'referrer-policy': 'no-referrer',
        'content-security-policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' https:; worker-src 'self' blob:; object-src 'none'; base-uri 'none'; form-action 'self'",
        'cross-origin-resource-policy': 'same-origin',
        'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=()',
        'cache-control': target.endsWith('service-worker.js') ? 'no-store' : (ext === '.html' ? 'no-cache' : 'public, max-age=60')
      };
      if (target.endsWith('service-worker.js')) headers['service-worker-allowed'] = '/';
      res.writeHead(200, headers);
      if (req.method === 'HEAD') res.end(); else res.end(body);
    } catch (error) {
      const status = error?.code === 'ENOENT' ? 404 : 500;
      res.writeHead(status, { 'content-type': 'text/plain; charset=utf-8' });
      res.end(status === 404 ? 'Not Found' : `Server Error: ${error}`);
    }
  });
  return { server, host, port };
}

function lanAddresses() {
  const values = [];
  let interfaces={};try{interfaces=networkInterfaces();}catch{return values;}
  for (const entries of Object.values(interfaces)) {
    for (const item of entries || []) if (item.family === 'IPv4' && !item.internal) values.push(item.address);
  }
  return [...new Set(values)];
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const options = parseArgs();
  const { server } = createInkServer(options);
  server.listen(options.port, options.host, () => {
    const address = server.address();
    const port = typeof address === 'object' && address ? address.port : options.port;
    console.log(`INK v${INK_VERSION} Test-Ready server`);
    console.log(`Computer: http://127.0.0.1:${port}/`);
    for (const ip of lanAddresses()) console.log(`Phone/LAN: http://${ip}:${port}/`);
    console.log('Press Ctrl+C to stop.');
  });
  const close = () => server.close(() => process.exit(0));
  process.on('SIGINT', close);
  process.on('SIGTERM', close);
}
