import { stableCompositeId } from '../core/stable-id.js';

function fail(code, details = {}) {
  throw Object.assign(new Error(`INK_PRECISION_LAYOUT_${code}`), { code: `PRECISION_LAYOUT_${code}`, ...details });
}

const clone = value => JSON.parse(JSON.stringify(value));

function normalizeBounds(bounds, label = 'bounds') {
  if (!bounds || ![bounds.x,bounds.y,bounds.w,bounds.h].every(Number.isFinite) || bounds.w < 0 || bounds.h < 0) fail('BOUNDS_INVALID', { label });
  return { x:+bounds.x, y:+bounds.y, w:+bounds.w, h:+bounds.h };
}

export function normalizeRulerGuide(raw = {}) {
  const orientation = raw.orientation === 'vertical' ? 'vertical' : raw.orientation === 'horizontal' ? 'horizontal' : null;
  if (!orientation || !Number.isFinite(+raw.position)) fail('GUIDE_INVALID');
  const position = +raw.position;
  const id = raw.id == null ? stableCompositeId('guide', [orientation, String(position)]) : String(raw.id);
  return { id, orientation, position, locked: Boolean(raw.locked), visible: raw.visible !== false };
}

export function addRulerGuide(guides = [], guide) {
  if (!Array.isArray(guides)) fail('GUIDE_STATE_INVALID');
  const next = normalizeRulerGuide(guide);
  if (guides.some(item => item?.id === next.id)) fail('GUIDE_ID_DUPLICATE', { id: next.id });
  return [...guides.map(item => normalizeRulerGuide(item)), next];
}

export function moveRulerGuide(guides = [], id, position) {
  if (!Array.isArray(guides) || !Number.isFinite(+position)) fail('GUIDE_STATE_INVALID');
  let found = false;
  const next = guides.map(item => {
    const guide = normalizeRulerGuide(item);
    if (guide.id !== id) return guide;
    found = true;
    if (guide.locked) fail('GUIDE_LOCKED', { id });
    return { ...guide, position:+position };
  });
  if (!found) fail('GUIDE_NOT_FOUND', { id });
  return next;
}

export function removeRulerGuide(guides = [], id) {
  if (!Array.isArray(guides)) fail('GUIDE_STATE_INVALID');
  const normalized = guides.map(item => normalizeRulerGuide(item));
  if (!normalized.some(item => item.id === id)) fail('GUIDE_NOT_FOUND', { id });
  return normalized.filter(item => item.id !== id);
}

function axisValues(bounds, axis) {
  return axis === 'x'
    ? { start:bounds.x, end:bounds.x+bounds.w, size:bounds.w }
    : { start:bounds.y, end:bounds.y+bounds.h, size:bounds.h };
}

function equalGapCandidates(moving, peers, axis) {
  const source = axisValues(moving, axis);
  const peerValues = peers.map((bounds,index)=>({ ...axisValues(bounds,axis), index })).sort((a,b)=>a.start-b.start || a.end-b.end || a.index-b.index);
  const candidates = [];
  for (let leftIndex=0; leftIndex<peerValues.length; leftIndex+=1) {
    for (let rightIndex=leftIndex+1; rightIndex<peerValues.length; rightIndex+=1) {
      const left=peerValues[leftIndex], right=peerValues[rightIndex];
      const existingGap=right.start-left.end;
      if (existingGap < 0) continue;
      const betweenStart=left.end+(right.start-left.end-source.size)/2;
      const betweenGap=betweenStart-left.end;
      if (betweenGap >= 0) candidates.push({ delta:betweenStart-source.start, evidence:{type:'equal-between',axis,leftPeer:left.index,rightPeer:right.index,gap:betweenGap} });
      candidates.push({ delta:(right.end+existingGap)-source.start, evidence:{type:'match-existing-gap-after',axis,leftPeer:left.index,rightPeer:right.index,gap:existingGap} });
      candidates.push({ delta:(left.start-existingGap-source.size)-source.start, evidence:{type:'match-existing-gap-before',axis,leftPeer:left.index,rightPeer:right.index,gap:existingGap} });
    }
  }
  return candidates;
}

function chooseCandidate(candidates, tolerance) {
  return candidates.filter(candidate=>Math.abs(candidate.delta)<=tolerance).sort((a,b)=>
    Math.abs(a.delta)-Math.abs(b.delta) ||
    a.delta-b.delta ||
    a.evidence.type.localeCompare(b.evidence.type) ||
    a.evidence.leftPeer-b.evidence.leftPeer ||
    a.evidence.rightPeer-b.evidence.rightPeer
  )[0] || null;
}

export function equalDistanceSmartSnap(movingBounds, peerBounds = [], { tolerance = 4 } = {}) {
  const moving = normalizeBounds(movingBounds, 'moving');
  if (!Array.isArray(peerBounds) || !Number.isFinite(+tolerance) || +tolerance < 0) fail('SNAP_INPUT_INVALID');
  const peers = peerBounds.map((bounds,index)=>normalizeBounds(bounds, `peer:${index}`));
  const x = chooseCandidate(equalGapCandidates(moving, peers, 'x'), +tolerance);
  const y = chooseCandidate(equalGapCandidates(moving, peers, 'y'), +tolerance);
  return {
    delta: { x:x?.delta || 0, y:y?.delta || 0 },
    snapped: { x:Boolean(x), y:Boolean(y) },
    evidence: { x:x?.evidence || null, y:y?.evidence || null }
  };
}

export function measurePoints(from, to) {
  if (!from || !to || ![from.x,from.y,to.x,to.y].every(Number.isFinite)) fail('MEASURE_POINT_INVALID');
  const dx=to.x-from.x, dy=to.y-from.y;
  return { from:{x:from.x,y:from.y}, to:{x:to.x,y:to.y}, dx, dy, distance:Math.hypot(dx,dy), angleDegrees:Math.atan2(dy,dx)*180/Math.PI };
}

export function measureBounds(bounds) {
  const value=normalizeBounds(bounds);
  return { ...clone(value), width:value.w, height:value.h, center:{x:value.x+value.w/2,y:value.y+value.h/2} };
}
