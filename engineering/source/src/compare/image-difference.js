import { PNGImage, decodePNG as decodePNGInternal, encodePNG as encodePNGInternal } from './png-codec.js';
import { overlayPNG, sideBySidePNG } from './layout-renderer.js';

export function imageDifference(before, after, threshold = 8) {
  if (before.width !== after.width || before.height !== after.height) throw Object.assign(new Error('PNG dimension mismatch'), { code: 'COMPARE_DIMENSION_MISMATCH' });
  const difference = new PNGImage({ width: before.width, height: before.height }); let changedPixels = 0;
  for (let index = 0; index < difference.data.length; index += 4) {
    const delta = Math.max(...[0, 1, 2].map(channel => Math.abs(before.data[index + channel] - after.data[index + channel]))), changed = delta > threshold;
    if (changed) changedPixels += 1;
    difference.data[index] = changed ? 255 : 245; difference.data[index + 1] = changed ? Math.max(0, 190 - delta) : 245; difference.data[index + 2] = changed ? 180 : 245; difference.data[index + 3] = 255;
  }
  const totalPixels = before.width * before.height;
  return { difference, overlay: overlayPNG(before, after), sideBySide: sideBySidePNG(before, after), metrics: { width: before.width, height: before.height, changedPixels, totalPixels, changedRatio: changedPixels / totalPixels, threshold } };
}

export function decodePNG(bytes) { return decodePNGInternal(bytes); }
export function encodePNG(png) { return encodePNGInternal(png); }
