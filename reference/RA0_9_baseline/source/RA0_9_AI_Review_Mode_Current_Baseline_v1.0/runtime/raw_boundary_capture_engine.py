#!/usr/bin/env python3
from __future__ import annotations
import argparse, hashlib, json, math, subprocess, sys
from pathlib import Path
from typing import Any

import numpy as np

try:
    import cv2
except ModuleNotFoundError:
    cv2 = None


def _round(v: float, n: int = 4) -> float:
    return round(float(v), n)


def _decimate(points: np.ndarray, max_points: int = 220) -> np.ndarray:
    pts = points.reshape(-1, 2)
    if len(pts) <= max_points:
        return pts
    step = max(1, math.ceil(len(pts) / max_points))
    out = pts[::step]
    if not np.array_equal(out[-1], pts[-1]):
        out = np.vstack([out, pts[-1]])
    return out


def _line_fit(pts: np.ndarray) -> dict[str, Any]:
    p = pts.astype(np.float64)
    center = p.mean(axis=0)
    uu, ss, vv = np.linalg.svd(p - center, full_matrices=False)
    direction = vv[0]
    projection = (p - center) @ direction
    a = center + direction * projection.min()
    b = center + direction * projection.max()
    normal = np.array([-direction[1], direction[0]])
    residuals = np.abs((p - center) @ normal)
    angle = math.degrees(math.atan2(direction[1], direction[0]))
    return {
        "parameters": {"start": {"x": _round(a[0]), "y": _round(a[1])}, "end": {"x": _round(b[0]), "y": _round(b[1])}, "angleDeg": _round(angle)},
        "metrics": {"rmse": _round(np.sqrt(np.mean(residuals ** 2))), "maxResidual": _round(residuals.max())}
    }


def _circle_fit(pts: np.ndarray) -> dict[str, Any]:
    p = pts.astype(np.float64)
    x, y = p[:, 0], p[:, 1]
    A = np.column_stack([2 * x, 2 * y, np.ones_like(x)])
    b = x * x + y * y
    try:
        sol, *_ = np.linalg.lstsq(A, b, rcond=None)
        cx, cy, c = sol
        r = math.sqrt(max(0.0, c + cx * cx + cy * cy))
    except Exception:
        cx = cy = r = 0.0
    dist = np.hypot(x - cx, y - cy)
    residuals = np.abs(dist - r)
    angles = np.unwrap(np.arctan2(y - cy, x - cx))
    start, end = float(angles[0]), float(angles[-1])
    sweep = end - start
    return {
        "parameters": {
            "center": {"x": _round(cx), "y": _round(cy)},
            "radius": _round(r),
            "startAngleDeg": _round(math.degrees(start)),
            "endAngleDeg": _round(math.degrees(end)),
            "sweepDeg": _round(math.degrees(sweep)),
            "clockwiseScreen": bool(sweep > 0)
        },
        "metrics": {
            "rmse": _round(np.sqrt(np.mean(residuals ** 2))),
            "maxResidual": _round(residuals.max()),
            "radiusDeviation": _round(float(np.std(dist) / r) if r > 1e-9 else 1.0, 6)
        }
    }


def capture(image_path: Path, case_id: str, max_contours: int = 96) -> dict[str, Any]:
    if cv2 is None:
        raise RuntimeError("OpenCV-Python is unavailable; use the packaged CLI fallback.")
    image = cv2.imread(str(image_path), cv2.IMREAD_COLOR)
    if image is None:
        raise FileNotFoundError(image_path)
    h, w = image.shape[:2]
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(gray, (3, 3), 0)
    median = float(np.median(gray))
    low = int(max(10, 0.66 * median))
    high = int(min(245, max(low + 20, 1.33 * median)))
    edges = cv2.Canny(gray, low, high, L2gradient=True)
    edges = cv2.morphologyEx(edges, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
    contours, hierarchy = cv2.findContours(edges, cv2.RETR_TREE, cv2.CHAIN_APPROX_NONE)
    hierarchy = hierarchy[0] if hierarchy is not None else np.empty((0, 4), dtype=int)
    rows = []
    for i, contour in enumerate(contours):
        if len(contour) < 8:
            continue
        perimeter = float(cv2.arcLength(contour, True))
        area = float(abs(cv2.contourArea(contour)))
        x, y, bw, bh = cv2.boundingRect(contour)
        if perimeter < 45 or max(bw, bh) < 8:
            continue
        pts = _decimate(contour)
        rows.append({
            "sourceIndex": i,
            "raw": contour,
            "pointsArray": pts,
            "perimeter": perimeter,
            "area": area,
            "bbox": [x, y, bw, bh],
            "hierarchy": hierarchy[i].tolist() if i < len(hierarchy) else [-1, -1, -1, -1]
        })
    rows.sort(key=lambda r: (-r["perimeter"], -r["area"], r["bbox"][1], r["bbox"][0]))
    rows = rows[:max_contours]
    index_to_id = {r["sourceIndex"]: f"{case_id}-contour-{n:04d}" for n, r in enumerate(rows, 1)}
    result = []
    for n, row in enumerate(rows, 1):
        pts = row["pointsArray"].astype(np.float64)
        m = cv2.moments(row["raw"])
        if abs(m["m00"]) > 1e-9:
            cx, cy = m["m10"] / m["m00"], m["m01"] / m["m00"]
        else:
            cx, cy = pts[:, 0].mean(), pts[:, 1].mean()
        x, y, bw, bh = row["bbox"]
        first, last = pts[0], pts[-1]
        endpoint_gap = float(np.hypot(*(first - last)))
        parent_idx = row["hierarchy"][3]
        contour_id = index_to_id[row["sourceIndex"]]
        fingerprint = hashlib.sha256(np.rint(pts).astype(np.int32).tobytes()).hexdigest()[:16]
        line = _line_fit(pts)
        circle = _circle_fit(pts)
        closed = bool(endpoint_gap <= 3.0 or row["area"] > 4.0)
        result.append({
            "contourId": contour_id,
            "stableFingerprint": fingerprint,
            "evidenceState": "measured",
            "recipeEligible": False,
            "formalPromotionBlocked": True,
            "closed": closed,
            "chainType": "closedLoop" if closed else "openChain",
            "sourcePointCount": int(len(row["raw"])),
            "samplePointCount": int(len(pts)),
            "points": [{"x": int(p[0]), "y": int(p[1])} for p in pts],
            "bbox": {"x": int(x), "y": int(y), "width": int(bw), "height": int(bh)},
            "centroid": {"x": _round(cx), "y": _round(cy)},
            "perimeter": _round(row["perimeter"]),
            "area": _round(row["area"]),
            "touchesCanvas": bool(x <= 1 or y <= 1 or x + bw >= w - 1 or y + bh >= h - 1),
            "parentContourId": index_to_id.get(parent_idx),
            "fits": {
                "LINE": line,
                "ARC": circle,
                "CIRCLE": circle
            }
        })
    return {
        "kind": "ra-raw-boundary-capture",
        "version": "1.0",
        "caseId": case_id,
        "source": {"path": image_path.name, "width": w, "height": h},
        "capture": {
            "method": "Canny + ordered OpenCV contours",
            "lowThreshold": low,
            "highThreshold": high,
            "maxContours": max_contours,
            "formalPolicy": "Evidence only; recipeEligible is always false."
        },
        "contours": result,
        "summary": {
            "contourCount": len(result),
            "closedCount": sum(1 for c in result if c["closed"]),
            "openCount": sum(1 for c in result if not c["closed"]),
            "recipeEligibleCount": sum(1 for c in result if c["recipeEligible"])
        }
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("image", type=Path)
    ap.add_argument("output", type=Path)
    ap.add_argument("--case-id", required=True)
    ap.add_argument("--max-contours", type=int, default=96)
    args = ap.parse_args()
    if cv2 is None:
        fallback = Path(__file__).with_name("raw_boundary_capture_engine_fallback.js")
        command = [
            "node",
            str(fallback),
            str(args.image),
            str(args.output),
            "--case-id",
            args.case_id,
            "--max-contours",
            str(args.max_contours),
        ]
        return subprocess.run(command, check=False).returncode
    data = capture(args.image, args.case_id, args.max_contours)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    print(json.dumps(data["summary"], ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
