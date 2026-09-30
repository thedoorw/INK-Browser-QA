import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

function arg(name, fallback = null) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : fallback;
}

function slugFor(p) {
  if (p === '/') return 'home';
  return p.replace(/^\/+|\/+$/g, '').replace(/[^a-z0-9_-]+/gi, '-').toLowerCase() || 'page';
}

const configPath = arg('config', 'config/case-001.json');
const config = JSON.parse(await fs.readFile(configPath, 'utf8'));
const root = new URL(config.targetRoot);
const browser = await chromium.launch({ headless: true });

const outRoot = path.resolve(config.artifactsDir ?? 'artifacts/case-001', 'capture');
await fs.mkdir(outRoot, { recursive: true });

const manifest = {
  schema: 'ink-web-reproduction-capture-manifest',
  version: 1,
  caseId: config.caseId,
  generatedAt: new Date().toISOString(),
  targetRoot: root.href,
  captures: []
};

for (const candidate of config.captureCandidates ?? []) {
  const target = new URL(candidate, root);
  if (target.origin !== root.origin) continue;

  for (const viewport of config.viewports ?? []) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce'
    });
    const page = await context.newPage();

    let status = null;
    let error = null;
    try {
      const response = await page.goto(target.href, { waitUntil: 'domcontentloaded', timeout: 45000 });
      status = response?.status() ?? null;
      await page.evaluate(() => document.fonts?.ready ?? Promise.resolve());
      await page.waitForTimeout(800);

      const metrics = await page.evaluate(() => {
        const first = (selector) => document.querySelector(selector);
        const rect = (el) => {
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return {
            x: r.x, y: r.y, width: r.width, height: r.height,
            top: r.top, right: r.right, bottom: r.bottom, left: r.left
          };
        };
        const styleSample = (selector) => {
          const el = first(selector);
          if (!el) return null;
          const s = getComputedStyle(el);
          return {
            selector,
            rect: rect(el),
            display: s.display,
            position: s.position,
            fontFamily: s.fontFamily,
            fontSize: s.fontSize,
            fontWeight: s.fontWeight,
            lineHeight: s.lineHeight,
            letterSpacing: s.letterSpacing,
            color: s.color,
            backgroundColor: s.backgroundColor,
            textAlign: s.textAlign,
            maxWidth: s.maxWidth,
            marginTop: s.marginTop,
            marginRight: s.marginRight,
            marginBottom: s.marginBottom,
            marginLeft: s.marginLeft,
            paddingTop: s.paddingTop,
            paddingRight: s.paddingRight,
            paddingBottom: s.paddingBottom,
            paddingLeft: s.paddingLeft
          };
        };

        const fixedSticky = [...document.querySelectorAll('body *')]
          .filter((el) => {
            const p = getComputedStyle(el).position;
            return p === 'fixed' || p === 'sticky';
          })
          .slice(0, 60)
          .map((el) => ({
            tag: el.tagName.toLowerCase(),
            position: getComputedStyle(el).position,
            rect: rect(el)
          }));

        return {
          viewport: { width: innerWidth, height: innerHeight },
          document: {
            scrollWidth: document.documentElement.scrollWidth,
            scrollHeight: document.documentElement.scrollHeight,
            horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1
          },
          boxes: {
            header: rect(first('header')),
            nav: rect(first('nav')),
            main: rect(first('main')),
            article: rect(first('article')),
            footer: rect(first('footer')),
            h1: rect(first('h1')),
            firstForm: rect(first('form'))
          },
          styles: [
            styleSample('body'),
            styleSample('h1'),
            styleSample('h2'),
            styleSample('p'),
            styleSample('nav a'),
            styleSample('main a'),
            styleSample('button'),
            styleSample('input')
          ].filter(Boolean),
          imageGeometry: [...document.images].slice(0, 100).map((img) => {
            const r = img.getBoundingClientRect();
            return {
              width: r.width,
              height: r.height,
              naturalWidth: img.naturalWidth,
              naturalHeight: img.naturalHeight,
              objectFit: getComputedStyle(img).objectFit
            };
          }),
          fixedSticky
        };
      });

      const pageDir = path.join(outRoot, slugFor(target.pathname), viewport.name);
      await fs.mkdir(pageDir, { recursive: true });
      const screenshotPath = path.join(pageDir, 'reference-full.png');
      const metricsPath = path.join(pageDir, 'metrics.json');

      await page.screenshot({ path: screenshotPath, fullPage: true, animations: 'disabled' });
      await fs.writeFile(metricsPath, JSON.stringify({
        url: target.href,
        status,
        title: await page.title(),
        viewport,
        metrics
      }, null, 2));

      manifest.captures.push({
        path: target.pathname,
        viewport: viewport.name,
        status,
        screenshot: path.relative(outRoot, screenshotPath).replaceAll('\\', '/'),
        metrics: path.relative(outRoot, metricsPath).replaceAll('\\', '/')
      });
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
      manifest.captures.push({
        path: target.pathname,
        viewport: viewport.name,
        status,
        error
      });
    } finally {
      await context.close();
    }
  }
}

await browser.close();
await fs.writeFile(path.join(outRoot, 'capture-manifest.json'), JSON.stringify(manifest, null, 2));

console.log(JSON.stringify({
  caseId: config.caseId,
  captures: manifest.captures.length,
  failures: manifest.captures.filter((x) => x.error).length,
  output: outRoot
}, null, 2));
