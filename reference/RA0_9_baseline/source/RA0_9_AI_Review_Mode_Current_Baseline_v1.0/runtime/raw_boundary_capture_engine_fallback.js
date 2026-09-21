#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const cvModule = require("../vendor/opencv-js");
const { PNG } = require("../vendor/pngjs");

async function getOpenCv() {
  if (cvModule instanceof Promise) return cvModule;
  if (cvModule.Mat) return cvModule;
  await new Promise((resolve) => {
    cvModule.onRuntimeInitialized = resolve;
  });
  return cvModule;
}

function round(value, digits = 4) {
  const factor = 10 ** digits;
  return Math.round((Number(value) + Number.EPSILON) * factor) / factor;
}

function decimate(points, maxPoints = 220) {
  if (points.length <= maxPoints) return points;
  const step = Math.max(1, Math.ceil(points.length / maxPoints));
  const output = points.filter((_, index) => index % step === 0);
  const last = points[points.length - 1];
  const outputLast = output[output.length - 1];
  if (last[0] !== outputLast[0] || last[1] !== outputLast[1]) output.push(last);
  return output;
}

function fingerprint(points) {
  const bytes = Buffer.alloc(points.length * 8);
  points.forEach(([x, y], index) => {
    bytes.writeInt32LE(Math.round(x), index * 8);
    bytes.writeInt32LE(Math.round(y), index * 8 + 4);
  });
  return crypto.createHash("sha256").update(bytes).digest("hex").slice(0, 16);
}

function lineFit(points) {
  const count = points.length;
  const centerX = points.reduce((sum, point) => sum + point[0], 0) / count;
  const centerY = points.reduce((sum, point) => sum + point[1], 0) / count;
  let xx = 0;
  let xy = 0;
  let yy = 0;
  for (const [x, y] of points) {
    const dx = x - centerX;
    const dy = y - centerY;
    xx += dx * dx;
    xy += dx * dy;
    yy += dy * dy;
  }
  const angle = 0.5 * Math.atan2(2 * xy, xx - yy);
  const direction = [Math.cos(angle), Math.sin(angle)];
  const normal = [-direction[1], direction[0]];
  const projections = [];
  const residuals = [];
  for (const [x, y] of points) {
    const delta = [x - centerX, y - centerY];
    projections.push(delta[0] * direction[0] + delta[1] * direction[1]);
    residuals.push(Math.abs(delta[0] * normal[0] + delta[1] * normal[1]));
  }
  const minimum = Math.min(...projections);
  const maximum = Math.max(...projections);
  const squared = residuals.reduce((sum, value) => sum + value * value, 0);
  return {
    parameters: {
      start: {
        x: round(centerX + direction[0] * minimum),
        y: round(centerY + direction[1] * minimum)
      },
      end: {
        x: round(centerX + direction[0] * maximum),
        y: round(centerY + direction[1] * maximum)
      },
      angleDeg: round(angle * 180 / Math.PI)
    },
    metrics: {
      rmse: round(Math.sqrt(squared / count)),
      maxResidual: round(Math.max(...residuals))
    }
  };
}

function solve3(matrix, vector) {
  const augmented = matrix.map((row, index) => [...row, vector[index]]);
  for (let column = 0; column < 3; column += 1) {
    let pivot = column;
    for (let row = column + 1; row < 3; row += 1) {
      if (Math.abs(augmented[row][column]) > Math.abs(augmented[pivot][column])) pivot = row;
    }
    if (Math.abs(augmented[pivot][column]) < 1e-12) return null;
    [augmented[column], augmented[pivot]] = [augmented[pivot], augmented[column]];
    const divisor = augmented[column][column];
    for (let index = column; index < 4; index += 1) augmented[column][index] /= divisor;
    for (let row = 0; row < 3; row += 1) {
      if (row === column) continue;
      const factor = augmented[row][column];
      for (let index = column; index < 4; index += 1) {
        augmented[row][index] -= factor * augmented[column][index];
      }
    }
  }
  return augmented.map((row) => row[3]);
}

function unwrapAngles(angles) {
  const output = [angles[0]];
  for (let index = 1; index < angles.length; index += 1) {
    let value = angles[index];
    const previous = output[index - 1];
    while (value - previous > Math.PI) value -= 2 * Math.PI;
    while (value - previous < -Math.PI) value += 2 * Math.PI;
    output.push(value);
  }
  return output;
}

function circleFit(points) {
  let sx = 0;
  let sy = 0;
  let sxx = 0;
  let syy = 0;
  let sxy = 0;
  let sb = 0;
  let sxb = 0;
  let syb = 0;
  for (const [x, y] of points) {
    const b = x * x + y * y;
    sx += x;
    sy += y;
    sxx += x * x;
    syy += y * y;
    sxy += x * y;
    sb += b;
    sxb += x * b;
    syb += y * b;
  }
  const count = points.length;
  const solution = solve3(
    [
      [4 * sxx, 4 * sxy, 2 * sx],
      [4 * sxy, 4 * syy, 2 * sy],
      [2 * sx, 2 * sy, count]
    ],
    [2 * sxb, 2 * syb, sb]
  ) || [0, 0, 0];
  const [cx, cy, constant] = solution;
  const radius = Math.sqrt(Math.max(0, constant + cx * cx + cy * cy));
  const distances = points.map(([x, y]) => Math.hypot(x - cx, y - cy));
  const residuals = distances.map((distance) => Math.abs(distance - radius));
  const angles = unwrapAngles(points.map(([x, y]) => Math.atan2(y - cy, x - cx)));
  const start = angles[0];
  const end = angles[angles.length - 1];
  const sweep = end - start;
  const meanDistance = distances.reduce((sum, value) => sum + value, 0) / count;
  const variance = distances.reduce((sum, value) => sum + (value - meanDistance) ** 2, 0) / count;
  return {
    parameters: {
      center: { x: round(cx), y: round(cy) },
      radius: round(radius),
      startAngleDeg: round(start * 180 / Math.PI),
      endAngleDeg: round(end * 180 / Math.PI),
      sweepDeg: round(sweep * 180 / Math.PI),
      clockwiseScreen: sweep > 0
    },
    metrics: {
      rmse: round(Math.sqrt(residuals.reduce((sum, value) => sum + value * value, 0) / count)),
      maxResidual: round(Math.max(...residuals)),
      radiusDeviation: round(radius > 1e-9 ? Math.sqrt(variance) / radius : 1, 6)
    }
  };
}

function parseArguments(argv) {
  const args = { image: argv[2], output: argv[3], caseId: null, maxContours: 96 };
  for (let index = 4; index < argv.length; index += 1) {
    if (argv[index] === "--case-id") args.caseId = argv[++index];
    else if (argv[index] === "--max-contours") args.maxContours = Number(argv[++index]);
  }
  if (!args.image || !args.output || !args.caseId) {
    throw new Error("usage: raw_boundary_capture_engine_fallback.js IMAGE OUTPUT --case-id ID [--max-contours N]");
  }
  return args;
}

async function capture(imagePath, caseId, maxContours) {
  const cv = await getOpenCv();
  const png = PNG.sync.read(fs.readFileSync(imagePath));
  const rgba = cv.matFromArray(png.height, png.width, cv.CV_8UC4, Array.from(png.data));
  const gray = new cv.Mat();
  const blurred = new cv.Mat();
  const edges = new cv.Mat();
  const kernel = cv.Mat.ones(3, 3, cv.CV_8U);
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  try {
    cv.cvtColor(rgba, gray, cv.COLOR_RGBA2GRAY);
    cv.GaussianBlur(gray, blurred, new cv.Size(3, 3), 0, 0, cv.BORDER_DEFAULT);
    const values = Array.from(blurred.data).sort((a, b) => a - b);
    const median = values[Math.floor(values.length / 2)];
    const low = Math.floor(Math.max(10, 0.66 * median));
    const high = Math.floor(Math.min(245, Math.max(low + 20, 1.33 * median)));
    cv.Canny(blurred, edges, low, high, 3, true);
    cv.morphologyEx(edges, edges, cv.MORPH_CLOSE, kernel);
    cv.findContours(edges, contours, hierarchy, cv.RETR_TREE, cv.CHAIN_APPROX_NONE);
    const rows = [];
    for (let index = 0; index < contours.size(); index += 1) {
      const contour = contours.get(index);
      try {
        const points = [];
        for (let pointIndex = 0; pointIndex < contour.data32S.length; pointIndex += 2) {
          points.push([contour.data32S[pointIndex], contour.data32S[pointIndex + 1]]);
        }
        if (points.length < 8) continue;
        const perimeter = cv.arcLength(contour, true);
        const area = Math.abs(cv.contourArea(contour));
        const box = cv.boundingRect(contour);
        if (perimeter < 45 || Math.max(box.width, box.height) < 8) continue;
        rows.push({
          sourceIndex: index,
          raw: points,
          points: decimate(points),
          perimeter,
          area,
          bbox: box,
          hierarchy: Array.from(hierarchy.data32S.slice(index * 4, index * 4 + 4))
        });
      } finally {
        contour.delete();
      }
    }
    rows.sort((a, b) =>
      b.perimeter - a.perimeter ||
      b.area - a.area ||
      a.bbox.y - b.bbox.y ||
      a.bbox.x - b.bbox.x
    );
    const selected = rows.slice(0, maxContours);
    const sourceToId = new Map(
      selected.map((row, index) => [row.sourceIndex, `${caseId}-contour-${String(index + 1).padStart(4, "0")}`])
    );
    const result = selected.map((row) => {
      const points = row.points;
      const first = points[0];
      const last = points[points.length - 1];
      const endpointGap = Math.hypot(first[0] - last[0], first[1] - last[1]);
      const contourId = sourceToId.get(row.sourceIndex);
      const parentContourId = sourceToId.get(row.hierarchy[3]) || null;
      const closed = endpointGap <= 3 || row.area > 4;
      const moments = (() => {
        const contour = cv.matFromArray(row.raw.length, 1, cv.CV_32SC2, row.raw.flat());
        try {
          return cv.moments(contour, false);
        } finally {
          contour.delete();
        }
      })();
      const centroid = Math.abs(moments.m00) > 1e-9
        ? { x: moments.m10 / moments.m00, y: moments.m01 / moments.m00 }
        : {
            x: points.reduce((sum, point) => sum + point[0], 0) / points.length,
            y: points.reduce((sum, point) => sum + point[1], 0) / points.length
          };
      const line = lineFit(points);
      const circle = circleFit(points);
      return {
        contourId,
        stableFingerprint: fingerprint(points),
        evidenceState: "measured",
        recipeEligible: false,
        formalPromotionBlocked: true,
        closed,
        chainType: closed ? "closedLoop" : "openChain",
        sourcePointCount: row.raw.length,
        samplePointCount: points.length,
        points: points.map(([x, y]) => ({ x, y })),
        bbox: {
          x: row.bbox.x,
          y: row.bbox.y,
          width: row.bbox.width,
          height: row.bbox.height
        },
        centroid: { x: round(centroid.x), y: round(centroid.y) },
        perimeter: round(row.perimeter),
        area: round(row.area),
        touchesCanvas:
          row.bbox.x <= 1 ||
          row.bbox.y <= 1 ||
          row.bbox.x + row.bbox.width >= png.width - 1 ||
          row.bbox.y + row.bbox.height >= png.height - 1,
        parentContourId,
        fits: { LINE: line, ARC: circle, CIRCLE: circle }
      };
    });
    return {
      kind: "ra-raw-boundary-capture",
      version: "1.0",
      caseId,
      source: { path: path.basename(imagePath), width: png.width, height: png.height },
      capture: {
        method: "Canny + ordered OpenCV.js contours",
        lowThreshold: low,
        highThreshold: high,
        maxContours,
        formalPolicy: "Evidence only; recipeEligible is always false."
      },
      contours: result,
      summary: {
        contourCount: result.length,
        closedCount: result.filter((contour) => contour.closed).length,
        openCount: result.filter((contour) => !contour.closed).length,
        recipeEligibleCount: result.filter((contour) => contour.recipeEligible).length
      }
    };
  } finally {
    rgba.delete();
    gray.delete();
    blurred.delete();
    edges.delete();
    kernel.delete();
    contours.delete();
    hierarchy.delete();
  }
}

async function main() {
  const args = parseArguments(process.argv);
  const result = await capture(args.image, args.caseId, args.maxContours);
  fs.mkdirSync(path.dirname(args.output), { recursive: true });
  fs.writeFileSync(args.output, JSON.stringify(result, null, 2));
  process.stdout.write(`${JSON.stringify(result.summary)}\n`);
}

main().catch((error) => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
