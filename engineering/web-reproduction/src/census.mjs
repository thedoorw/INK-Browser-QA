import { PlaywrightCrawler } from 'crawlee';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

function arg(name, fallback = null) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : fallback;
}

function normalizeUrl(value, root) {
  const u = new URL(value, root);
  u.hash = '';
  for (const key of [...u.searchParams.keys()]) u.searchParams.delete(key);
  u.pathname = u.pathname.replace(/\/+/g, '/');
  return u;
}

function bucket(n) {
  if (n <= 0) return '0';
  if (n === 1) return '1';
  if (n <= 3) return '2-3';
  if (n <= 7) return '4-7';
  if (n <= 15) return '8-15';
  if (n <= 31) return '16-31';
  return '32+';
}

const configPath = arg('config', 'config/case-001.json');
const config = JSON.parse(await fs.readFile(configPath, 'utf8'));
const root = new URL(config.targetRoot);
const records = [];
const failures = [];

const excluded = config.excludedPathPrefixes ?? [];
const assetExt = /\.(?:jpe?g|png|gif|webp|svg|pdf|zip|mp3|m4a|wav|mp4|mov|xml|json|css|js|ico|woff2?|ttf|eot)$/i;

const crawler = new PlaywrightCrawler({
  maxRequestsPerCrawl: config.maxRequests ?? 150,
  maxConcurrency: config.maxConcurrency ?? 2,
  sameDomainDelaySecs: config.sameDomainDelaySecs ?? 1,
  respectRobotsTxtFile: true,
  retryOnBlocked: false,
  maxRequestRetries: 1,
  navigationTimeoutSecs: 45,
  requestHandlerTimeoutSecs: 75,
  launchContext: { launchOptions: { headless: true } },

  async requestHandler({ page, request, response, enqueueLinks }) {
    const loaded = normalizeUrl(request.loadedUrl || request.url, root);
    if (loaded.origin !== root.origin) return;

    const structure = await page.evaluate(() => {
      const q = (sel) => [...document.querySelectorAll(sel)];
      const tagCounts = {};
      for (const tag of ['header','nav','main','article','aside','footer','section','form','h1','h2','h3','p','ul','ol','li','img','button','input']) {
        tagCounts[tag] = document.getElementsByTagName(tag).length;
      }

      const landmarkSequence = q('header,nav,main,article,aside,footer,section,form')
        .slice(0, 80)
        .map((el) => el.tagName.toLowerCase());

      const headingLevels = q('h1,h2,h3,h4,h5,h6')
        .slice(0, 40)
        .map((el) => el.tagName.toLowerCase());

      const forms = q('form').slice(0, 20).map((form) => ({
        method: (form.getAttribute('method') || 'get').toLowerCase(),
        inputCount: form.querySelectorAll('input,select,textarea,button').length
      }));

      const images = q('img').slice(0, 120).map((img) => ({
        width: img.getBoundingClientRect().width,
        height: img.getBoundingClientRect().height
      }));

      const internalPaths = [...new Set(q('a[href]').map((a) => {
        try {
          const u = new URL(a.href, location.href);
          return u.origin === location.origin ? u.pathname : null;
        } catch {
          return null;
        }
      }).filter(Boolean))].slice(0, 500);

      return {
        lang: document.documentElement.lang || '',
        bodyClassTokens: [...document.body.classList].sort().slice(0, 40),
        landmarkSequence,
        headingLevels,
        tagCounts,
        forms,
        images,
        internalPaths,
        document: {
          scrollWidth: document.documentElement.scrollWidth,
          scrollHeight: document.documentElement.scrollHeight
        }
      };
    });

    const coarse = {
      landmarkSequence: structure.landmarkSequence,
      headingLevels: structure.headingLevels.slice(0, 16),
      bodyClassTokens: structure.bodyClassTokens,
      tagBuckets: Object.fromEntries(Object.entries(structure.tagCounts).map(([k, v]) => [k, bucket(v)])),
      formCount: bucket(structure.forms.length),
      imageCount: bucket(structure.images.length)
    };

    const signature = crypto.createHash('sha256')
      .update(JSON.stringify(coarse))
      .digest('hex')
      .slice(0, 16);

    let canonicalPath = loaded.pathname;
    const canonical = await page.locator('link[rel="canonical"]').first().getAttribute('href').catch(() => null);
    if (canonical) {
      try {
        const c = normalizeUrl(canonical, root);
        if (c.origin === root.origin) canonicalPath = c.pathname;
      } catch {}
    }

    records.push({
      url: loaded.href,
      path: loaded.pathname,
      canonicalPath,
      status: response?.status?.() ?? null,
      title: await page.title(),
      depth: request.userData?.depth ?? 0,
      signature,
      structure
    });

    await enqueueLinks({
      strategy: 'same-origin',
      transformRequestFunction: (next) => {
        try {
          const u = normalizeUrl(next.url, root);
          if (u.origin !== root.origin) return false;
          if (assetExt.test(u.pathname)) return false;
          if (excluded.some((prefix) => u.pathname.startsWith(prefix))) return false;
          next.url = u.href;
          next.userData = { ...(next.userData || {}), depth: (request.userData?.depth ?? 0) + 1 };
          return next;
        } catch {
          return false;
        }
      }
    });
  },

  async failedRequestHandler({ request }) {
    failures.push({
      url: request.url,
      errors: request.errorMessages ?? []
    });
  }
});

await crawler.run([{ url: root.href, userData: { depth: 0 } }]);

records.sort((a, b) => a.path.localeCompare(b.path));
failures.sort((a, b) => a.url.localeCompare(b.url));

const outDir = path.resolve(config.artifactsDir ?? 'artifacts/case-001', 'census');
await fs.mkdir(outDir, { recursive: true });

const summary = {
  schema: 'ink-web-reproduction-census',
  version: 1,
  caseId: config.caseId,
  targetRoot: root.href,
  generatedAt: new Date().toISOString(),
  requestCap: config.maxRequests ?? 150,
  pageCount: records.length,
  failureCount: failures.length,
  records
};

await fs.writeFile(path.join(outDir, 'site-census.json'), JSON.stringify(summary, null, 2));
await fs.writeFile(path.join(outDir, 'crawl-failures.json'), JSON.stringify(failures, null, 2));

console.log(JSON.stringify({
  caseId: config.caseId,
  pageCount: records.length,
  failureCount: failures.length,
  output: outDir
}, null, 2));
