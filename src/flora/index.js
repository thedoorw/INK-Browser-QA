import { FloraRuntimeAdapter } from './runtime/flora-runtime-adapter.js';
import { FloraCommandDispatcher } from './action/flora-command-dispatcher.js';
import { HeroStructureRuntime } from './structure/hero-runtime.js';
import { RasterMaskCache, normalizedPointToWorld, traceVectorMaskWorld, traceVectorPathWorld } from './mask/vector-mask.js';
import { PaintingRecipeRuntime } from './recipe/painting-recipe-runtime.js';
import { CrownPaintingRuntime } from './crown/crown-painting-runtime.js';
import { CompleteHeroPaintingRuntime } from './hero/complete-hero-painting-runtime.js';
import { FLR012AdonisRuntime } from './species/flr012-adonis.js';
import { resolveReferenceMapping, validateReferenceIdentity } from './reference/reference-mapping.js';
import { measureHeroPaintedRetention, measureRegionPaintedRetention, diagnoseRegionPaintedStages, evaluatePaintedRetentionGates, PAINTED_RETENTION_THRESHOLDS } from './retention/painted-geometry-retention.js';

export function installFloraActionLayer(app) {
  const maskCache = new RasterMaskCache();
  const hero = new HeroStructureRuntime(app, maskCache);
  const adapter = new FloraRuntimeAdapter(app, { heroRuntime: hero, maskCache });
  const dispatcher = new FloraCommandDispatcher(adapter);
  const recipe = new PaintingRecipeRuntime(app, adapter, dispatcher, maskCache);
  const crown = new CrownPaintingRuntime(app, adapter, recipe, hero, maskCache);
  const completeHero = new CompleteHeroPaintingRuntime(app, adapter, recipe, crown, hero, maskCache);
  const flr012 = new FLR012AdonisRuntime(completeHero);
  return Object.freeze({
    schemaVersion: '0.5',
    visualRefinementVersion: '0.8B',
    botanicalGeometryVersion: '0.9A-R1a.1',
    paintedRetentionVersion: '0.9A-R1c.1',
    baseMassStrategy: 'non-periodic-full-body',
    dispatch: action => dispatcher.dispatch(action),
    dispatchMany: actions => dispatcher.dispatchMany(actions),
    documentHash: () => adapter.documentHash(),
    replayHash: () => adapter.replayHash(),
    serializeDocument: () => adapter.serializeDocument(),
    reloadDocument: json => adapter.reloadDocument(json),
    maskCacheDiagnostics: () => maskCache.diagnostics(),
    hero, recipe, crown, completeHero, retention: Object.freeze({ measure: measureHeroPaintedRetention, measureRegion: measureRegionPaintedRetention, diagnoseRegionStages: diagnoseRegionPaintedStages, evaluate: evaluatePaintedRetentionGates, thresholds: PAINTED_RETENTION_THRESHOLDS }), reference: Object.freeze({ resolve: resolveReferenceMapping, validateIdentity: validateReferenceIdentity }), species: Object.freeze({ flr012 }), adapter
  });
}

function floraMaskForObject(object, page) {
  if (!object?.floraPaint?.regionId) return null;
  return page?.floraHero?.masks?.find(mask => mask.regionId === object.floraPaint.regionId || mask.maskId === object.floraPaint.maskId) || null;
}

function drawFloraInspectionOverlay({ renderer, ctx, page }, flora) {
  const hero = page?.floraHero, inspect = flora?.hero?.inspect;
  if (!hero || !inspect || !Object.values(inspect).some(Boolean)) return;
  ctx.save();
  const scale = Math.max(.05, renderer.worldScreenScale(page));
  ctx.lineWidth = 1.2 / scale;
  ctx.font = `${12 / scale}px ui-monospace,monospace`;
  ctx.textBaseline = 'middle';
  for (const region of hero.regions || []) {
    const mask = (hero.masks || []).find(item => item.regionId === region.regionId);
    if (inspect.structure) {
      ctx.beginPath(); traceVectorPathWorld(ctx, region.path, page);
      ctx.strokeStyle = region.relation === 'front' ? 'rgba(59,95,124,.88)' : 'rgba(117,91,71,.72)';
      ctx.setLineDash([5 / scale, 4 / scale]); ctx.stroke();
    }
    if (inspect.masks && mask?.visible) {
      ctx.beginPath(); traceVectorMaskWorld(ctx, mask, page);
      ctx.fillStyle = 'rgba(78,145,175,.075)'; ctx.fill(mask.excludePaths?.length ? 'evenodd' : 'nonzero');
      ctx.strokeStyle = mask.feather > 0 ? 'rgba(213,109,137,.95)' : 'rgba(48,122,155,.95)';
      ctx.setLineDash(mask.feather > 0 ? [8 / scale, 4 / scale] : []);
      ctx.lineWidth = Math.max(1 / scale, (1 + mask.feather * 45) / scale); ctx.stroke();
    }
    const first = region.path?.[0];
    const anchor = Number.isFinite(first?.cx) ? normalizedPointToWorld(page, { x: first.cx, y: first.cy }) : normalizedPointToWorld(page, first);
    if (inspect.ids) {
      ctx.fillStyle = 'rgba(28,31,32,.92)'; ctx.fillText(region.regionId, anchor.x + 4 / scale, anchor.y - 4 / scale);
    }
    if (inspect.topology) {
      ctx.fillStyle = 'rgba(92,63,42,.9)'; ctx.fillText(`${region.relation} z${region.z}`, anchor.x + 4 / scale, anchor.y + 10 / scale);
    }
  }
  ctx.restore();
}

export function installInkCapability({ app }) {
  const flora = installFloraActionLayer(app);
  app.flora = flora;

  if (typeof location !== 'undefined' && new URLSearchParams(location.search).get('ink-flora-smoke') === '1') {
    try {
      const result = flora.hero.createBenchmarkPetal({ seed: 101 }, { history: false });
      document.documentElement.dataset.inkFloraSmoke = result?.ok ? 'pass' : 'fail';
    } catch (error) {
      document.documentElement.dataset.inkFloraSmoke = 'fail';
      document.documentElement.dataset.inkFloraSmokeError = error instanceof Error ? error.message : String(error);
      throw error;
    }
  }

  return {
    api: flora,
    hooks: {
      requiresIndividualRender: ({ object }) => Boolean(object?.floraPaint),
      renderObject: ({ ctx, object, options, renderDefault }) => {
        if (!object?.floraPaint) return false;
        const page = options.page || app.page(), mask = floraMaskForObject(object, page);
        if (!mask) return true;
        ctx.save(); ctx.beginPath(); traceVectorMaskWorld(ctx, mask, page);
        ctx.clip(mask.excludePaths?.length ? 'evenodd' : 'nonzero');
        renderDefault(); ctx.restore();
        return true;
      },
      renderOverlay: payload => drawFloraInspectionOverlay(payload, flora),
      documentReplaced: () => flora.hero.cache.clear()
    }
  };
}
