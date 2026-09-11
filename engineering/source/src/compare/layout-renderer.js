import { PNGImage } from './png-codec.js';

function bitblt(source, target, sx, sy, width, height, dx, dy) {
  for (let y = 0; y < height; y += 1) {
    const start = ((sy + y) * source.width + sx) * 4;
    const end = start + width * 4;
    const dest = ((dy + y) * target.width + dx) * 4;
    Buffer.from(source.data).copy(target.data, dest, start, end);
  }
}

export function sideBySidePNG(before, after) {
  if (before.height !== after.height) throw Object.assign(new Error('PNG height mismatch'), { code: 'COMPARE_DIMENSION_MISMATCH' });
  const output = new PNGImage({ width: before.width + after.width, height: before.height });
  bitblt(before, output, 0, 0, before.width, before.height, 0, 0);
  bitblt(after, output, 0, 0, after.width, after.height, before.width, 0);
  return output;
}

export function overlayPNG(before, after, opacity = 0.5) {
  if (before.width !== after.width || before.height !== after.height) throw Object.assign(new Error('PNG dimension mismatch'), { code: 'COMPARE_DIMENSION_MISMATCH' });
  const output = new PNGImage({ width: before.width, height: before.height });
  for (let index = 0; index < output.data.length; index += 4) for (let channel = 0; channel < 3; channel += 1) output.data[index + channel] = Math.round(before.data[index + channel] * (1 - opacity) + after.data[index + channel] * opacity);
  for (let index = 3; index < output.data.length; index += 4) output.data[index] = 255;
  return output;
}
