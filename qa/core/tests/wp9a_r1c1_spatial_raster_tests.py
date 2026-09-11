from __future__ import annotations
from pathlib import Path
from PIL import Image, ImageFilter
import json, math
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
OLD = ROOT / 'Runtime_Evidence' / 'Retention'
NEW = ROOT / 'Runtime_Evidence' / 'NonPeriodicFill'

CASES = {
    'petal': (OLD / 'Isolated_outer_ring.png', (260, 45, 342, 230), NEW / 'R1c1_Isolated_petal.png', None),
    'center': (OLD / 'Isolated_center.png', None, NEW / 'R1c1_Isolated_center.png', None),
    'leaf': (OLD / 'Isolated_leaves.png', (35, 575, 270, 842), NEW / 'R1c1_Isolated_leaf.png', None),
    'stem': (OLD / 'Isolated_stem.png', None, NEW / 'R1c1_Isolated_stem.png', None),
}


def load_rgba(path: Path, crop=None):
    im = Image.open(path).convert('RGBA')
    if crop:
        im = im.crop(crop)
    return np.asarray(im).astype(np.float64) / 255.0


def axial_profile(arr: np.ndarray):
    alpha = arr[..., 3]
    rgb = arr[..., :3]
    lum = .2126 * rgb[..., 0] + .7152 * rgb[..., 1] + .0722 * rgb[..., 2]
    mask = alpha > .04
    yy, xx = np.nonzero(mask)
    if len(xx) < 24:
        raise AssertionError('insufficient foreground samples')
    coords = np.column_stack([xx, yy]).astype(float)
    weights = alpha[mask]
    center = (coords * weights[:, None]).sum(axis=0) / weights.sum()
    centered = coords - center
    covariance = (centered * weights[:, None]).T @ centered / weights.sum()
    _, vectors = np.linalg.eigh(covariance)
    axis = vectors[:, -1]
    t = centered @ axis
    lo, hi = np.percentile(t, [1, 99])
    count = max(40, int(hi - lo) + 1)
    edges = np.linspace(lo, hi, count + 1)
    bins = np.clip(np.digitize(t, edges) - 1, 0, count - 1)
    density = ((1.0 - lum[mask]) * alpha[mask])
    sums = np.bincount(bins, weights=density * weights, minlength=count)
    ws = np.bincount(bins, weights=weights, minlength=count)
    profile = np.divide(sums, ws, out=np.full(count, np.nan), where=ws > 1e-8)
    valid = np.isfinite(profile)
    x = np.arange(count)
    return np.interp(x, x[valid], profile[valid])


def axial_metrics(arr: np.ndarray):
    profile = axial_profile(arr)
    n = len(profile)
    x = np.linspace(-1, 1, n)
    baseline = np.polyval(np.polyfit(x, profile, 3), x)
    residual = profile - baseline
    residual -= residual.mean()
    spectrum = np.abs(np.fft.rfft(residual)) ** 2
    spectrum[0] = 0
    cycles = np.arange(len(spectrum))
    periodic = (cycles >= 6) & (cycles <= min(60, n // 4))
    total = float(spectrum[1:].sum()) + 1e-12
    dominant = float(spectrum[periodic].max() / total) if periodic.any() else 0.0
    periodic_energy = float(spectrum[periodic].sum() / total) if periodic.any() else 0.0
    variance = float(np.dot(residual, residual)) + 1e-12
    ac = []
    for lag in range(4, min(31, n // 3)):
        ac.append(float(np.dot(residual[:-lag], residual[lag:]) / variance))
    autocorrelation = max(ac) if ac else 0.0
    stripe_contrast = float(np.std(residual) / (np.mean(profile) + 1e-9))
    abs_residual = np.abs(residual)
    threshold = np.percentile(abs_residual, 65)
    peaks = np.where((abs_residual[1:-1] > abs_residual[:-2]) & (abs_residual[1:-1] >= abs_residual[2:]) & (abs_residual[1:-1] > threshold))[0] + 1
    gaps = np.diff(peaks)
    spacing_cv = float(np.std(gaps) / (np.mean(gaps) + 1e-9)) if len(gaps) >= 2 else 1.0
    return {
        'sampleCount': n,
        'dominantFrequencyPeakRatio': dominant,
        'periodicEnergyRatio': periodic_energy,
        'orientationAutocorrelation': autocorrelation,
        'stripeContrast': stripe_contrast,
        'spacingCoefficientOfVariation': spacing_cv,
    }


def transverse_gradient_ratio(arr: np.ndarray):
    alpha = arr[..., 3]
    rgb = arr[..., :3]
    lum = .2126 * rgb[..., 0] + .7152 * rgb[..., 1] + .0722 * rgb[..., 2]
    mask = alpha > .10
    inner = mask.copy()
    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        inner &= np.roll(mask, (dy, dx), (0, 1))
    yy, xx = np.nonzero(inner)
    coords = np.column_stack([xx, yy]).astype(float)
    weights = alpha[inner]
    center = (coords * weights[:, None]).sum(axis=0) / weights.sum()
    centered = coords - center
    covariance = (centered * weights[:, None]).T @ centered / weights.sum()
    _, vectors = np.linalg.eigh(covariance)
    growth = vectors[:, -1]
    normal = np.array([-growth[1], growth[0]])
    gy, gx = np.gradient(lum)
    along = gx * growth[0] + gy * growth[1]
    across = gx * normal[0] + gy * normal[1]
    e_along = float(np.mean(along[inner] ** 2))
    e_across = float(np.mean(across[inner] ** 2))
    return e_along / (e_along + e_across + 1e-12)


def local_density_continuity(arr: np.ndarray):
    alpha = arr[..., 3]
    rgb = arr[..., :3]
    lum = .2126 * rgb[..., 0] + .7152 * rgb[..., 1] + .0722 * rgb[..., 2]
    density = alpha * (.30 + .70 * (1 - lum))
    mask = alpha > .08
    ys, xs = np.where(mask)
    crop = density[ys.min():ys.max()+1, xs.min():xs.max()+1]
    cmask = mask[ys.min():ys.max()+1, xs.min():xs.max()+1]
    radius = max(2, round(min(crop.shape) * .035))
    low = np.asarray(Image.fromarray(np.uint8(np.clip(crop * 255, 0, 255))).filter(ImageFilter.GaussianBlur(radius=radius))).astype(float) / 255
    high = (crop - low)[cmask]
    low_energy = float(np.mean(low[cmask] ** 2))
    high_energy = float(np.mean(high ** 2))
    return {
        'lowFrequencyDominance': low_energy / (low_energy + high_energy + 1e-12),
        'highFrequencyRestraint': high_energy / (low_energy + high_energy + 1e-12),
        'localDensityCV': float(np.std(crop[cmask]) / (np.mean(crop[cmask]) + 1e-9)),
    }


def detected(kind: str, m: dict):
    # Autocorrelation alone is not a band detector: a continuous low-frequency field is
    # intentionally autocorrelated. It is coupled to high-pass contrast or periodic energy.
    if kind == 'petal':
        return (m['transverseGradientRatio'] > .30 or m['periodicEnergyRatio'] > .30 or
                (m['orientationAutocorrelation'] > .40 and m['stripeContrast'] > .030))
    if kind == 'leaf':
        return ((m['periodicEnergyRatio'] > .35 and m['stripeContrast'] > .030) or
                m['transverseGradientRatio'] > .45)
    if kind == 'stem':
        return (m['dominantFrequencyPeakRatio'] > .15 or m['periodicEnergyRatio'] > .50 or
                m['transverseGradientRatio'] > .10 or m['stripeContrast'] > .10)
    if kind == 'center':
        return (m['dominantFrequencyPeakRatio'] > .06 or m['periodicEnergyRatio'] > .25 or
                (m['orientationAutocorrelation'] > .50 and m['stripeContrast'] > .030))
    raise KeyError(kind)


def metrics(path: Path, crop=None):
    arr = load_rgba(path, crop)
    m = axial_metrics(arr)
    m['transverseGradientRatio'] = transverse_gradient_ratio(arr)
    m.update(local_density_continuity(arr))
    return m

results = {}
checks = []
for kind, (old_path, old_crop, new_path, new_crop) in CASES.items():
    old = metrics(old_path, old_crop)
    new = metrics(new_path, new_crop)
    old['repeatedBandDetected'] = detected(kind, old)
    new['repeatedBandDetected'] = detected(kind, new)
    results[kind] = {'R1c': old, 'R1c1': new}
    checks.append((f'{kind}: repeated-band detector clears', old['repeatedBandDetected'] and not new['repeatedBandDetected']))
    checks.append((f'{kind}: low-frequency field dominates', new['lowFrequencyDominance'] >= (.85 if kind == 'leaf' else .93)))
    checks.append((f'{kind}: high-frequency surface restrained', new['highFrequencyRestraint'] <= (.15 if kind == 'leaf' else .07)))

# Aggregate comparisons deliberately use the four diagnosed object classes, not the white background.
for metric in ('dominantFrequencyPeakRatio', 'periodicEnergyRatio', 'stripeContrast'):
    old_mean = float(np.mean([results[k]['R1c'][metric] for k in CASES]))
    new_mean = float(np.mean([results[k]['R1c1'][metric] for k in CASES]))
    checks.append((f'aggregate {metric} improves', new_mean < old_mean))
old_ac_artifact = float(np.mean([results[k]['R1c']['orientationAutocorrelation'] * results[k]['R1c']['stripeContrast'] for k in CASES]))
new_ac_artifact = float(np.mean([results[k]['R1c1']['orientationAutocorrelation'] * results[k]['R1c1']['stripeContrast'] for k in CASES]))
checks.append(('aggregate contrast-weighted orientation autocorrelation improves', new_ac_artifact < old_ac_artifact))

# Layer mass proves sparse directional deposits do not replace the body field.
def layer_mass(name: str):
    arr = load_rgba(NEW / name)
    alpha = arr[..., 3]
    rgb = arr[..., :3]
    lum = .2126 * rgb[..., 0] + .7152 * rgb[..., 1] + .0722 * rgb[..., 2]
    return {'alphaMass': float(alpha.sum()), 'pigmentMass': float(((1-lum)*alpha).sum())}

layers = {
    'continuousBody': layer_mass('Continuous_Body_Field_only.png'),
    'lowFrequencyDensity': layer_mass('Low_Frequency_Density_Field_only.png'),
    'sparseDirectional': layer_mass('Sparse_Directional_Deposit_only.png'),
}
base_mass = layers['continuousBody']['pigmentMass'] + layers['lowFrequencyDensity']['pigmentMass']
checks.append(('sparse directional variation remains secondary', layers['sparseDirectional']['pigmentMass'] / base_mass < .03))

old_avg = {m: float(np.mean([results[k]['R1c'][m] for k in CASES])) for m in ('dominantFrequencyPeakRatio','periodicEnergyRatio','orientationAutocorrelation','stripeContrast')}
new_avg = {m: float(np.mean([results[k]['R1c1'][m] for k in CASES])) for m in ('dominantFrequencyPeakRatio','periodicEnergyRatio','orientationAutocorrelation','stripeContrast')}
old_avg['contrastWeightedOrientationAutocorrelation'] = old_ac_artifact
new_avg['contrastWeightedOrientationAutocorrelation'] = new_ac_artifact
output = {
    'schema': 'INK_FLORA_WP9A_R1C1_SPATIAL_RASTER_TEST_V2',
    'source': 'actual isolated object rasters from the single PREVIEW_ONLY compile',
    'objectMetrics': results,
    'aggregateComparison': {'R1c': old_avg, 'R1c1': new_avg},
    'layerMass': layers,
    'checks': [{'name': name, 'passed': bool(passed)} for name, passed in checks],
    'passed': sum(1 for _, p in checks if p),
    'failed': sum(1 for _, p in checks if not p),
}
(NEW / 'spatial-raster-tests.json').write_text(json.dumps(output, indent=2) + '\n')
for name, passed in checks:
    print(('PASS' if passed else 'FAIL') + ': ' + name)
print(f"RESULT: {output['passed']}/{len(checks)} passed; {output['failed']} failed")
if output['failed']:
    raise SystemExit(1)
