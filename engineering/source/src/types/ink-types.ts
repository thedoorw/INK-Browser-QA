export type Matrix2D = [number, number, number, number, number, number];
export type ObjectId = string;
export type LayerId = string;
export type PageId = string;
export type NodeMode = 'corner' | 'smooth' | 'symmetric';
export type NaturalMediaRenderMode = 'auto' | 'gpu' | 'canvas2d';

export interface Vector2 { x: number; y: number; }
export interface Point {
  x: number;
  y: number;
  p?: number;
  tiltX?: number;
  tiltY?: number;
  altitude?: number;
  azimuth?: number;
  twist?: number;
  predicted?: boolean;
  t?: number;
  mode?: NodeMode;
  in?: Vector2;
  out?: Vector2;
}

export interface SegmentStyle {
  color?: string;
  size?: number;
  opacity?: number;
}

export interface Bounds { x: number; y: number; w: number; h: number; }

export interface ArtboardSettings {
  /** Deprecated compatibility field. Artboards remain fixed; view space lives in workspace.activeSpace. */
  mode: 'fixed';
  preset: 'A4';
  orientation: 'portrait' | 'landscape';
  widthMm: number;
  heightMm: number;
  ppi: 72 | 96 | 150 | 300 | 600;
  bleedMm: number;
  safeMarginMm: number;
  unit: 'mm' | 'px';
  showBleed: boolean;
  showSafeArea: boolean;
  showCenter: boolean;
  clipContent: boolean;
}


export interface WorkspaceCamera { x: number; y: number; scale: number; rotation: number; }
export interface WorkspaceState {
  activeSpace: 'creation' | 'layout';
  /** Deprecated compatibility flag; creation-space artboard overlay is always disabled. */
  showLayoutFrameInCreation: false;
  layoutViewport: WorkspaceCamera;
  cameras: { creation: WorkspaceCamera; layout: WorkspaceCamera };
  visited: { creation: boolean; layout: boolean };
}

export interface InkObjectBase {
  id: ObjectId;
  type: 'stroke' | 'shape' | 'text' | 'image' | 'group';
  name?: string;
  matrix: Matrix2D;
  opacity: number;
}

export interface StrokeObject extends InkObjectBase {
  type: 'stroke';
  color: string;
  size: number;
  kind: string;
  smoothing: number;
  pressure: number;
  points: Point[];
  segmentStyles?: SegmentStyle[];
  flow?: number;
  wetness?: number;
  bristle?: number;
  grain?: number;
  softness?: number;
  mediaModel?: 'natural-v1' | 'natural-v2';
}

export interface ShapeObject extends InkObjectBase {
  type: 'shape';
  shape: 'line' | 'arrow' | 'rect' | 'ellipse' | 'triangle';
  color: string;
  fillColor: string;
  fill: boolean;
  size: number;
  x2: number;
  y2: number;
  w: number;
  h: number;
}

export interface TextObject extends InkObjectBase {
  type: 'text';
  text: string;
  color: string;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
}

export interface ImageObject extends InkObjectBase {
  type: 'image';
  src: string;
  w: number;
  h: number;
}

export interface GroupObject extends InkObjectBase {
  type: 'group';
  children: InkObject[];
}

export type InkObject = StrokeObject | ShapeObject | TextObject | ImageObject | GroupObject;

export interface InkLayer {
  id: LayerId;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  objects: InkObject[];
}

export interface InkPage {
  id: PageId;
  name: string;
  artboard: ArtboardSettings;
  workspace: WorkspaceState;
  paper: { type: string; color: string; gridSize: number; absorbency: number; roughness: number; fiberStrength: number; fiberAngle: number; sizing: number; granulation: number; seed: number; textureVisible: boolean };
  camera: { x: number; y: number; scale: number; rotation: number };
  layers: InkLayer[];
  activeLayerId: LayerId;
}

export interface InkDocument {
  format: 'INK';
  formatVersion: 4;
  appVersion: string;
  id: string;
  title: string;
  createdAt: string;
  modifiedAt: string;
  activePageId: PageId;
  pages: InkPage[];
  strokeSessions?: UnifiedStrokeSession[];
  brushPackages?: Array<Record<string, unknown>>;
  handDrawingReports?: Array<Record<string, unknown>>;
  deviceCalibrationProfiles?: Array<Record<string, unknown>>;
  deviceValidationReports?: Array<Record<string, unknown>>;
  interactivePerformanceReports?: Array<Record<string, unknown>>;
  deviceReplayProfileSelection?: 'ORIGINAL_PROFILE' | 'CURRENT_PROFILE' | 'ORIGINAL_OR_CURRENT_SELECTABLE';
  drawingGapRanking?: Record<string, unknown> | null;
  recentColors: string[];
}

export interface UnifiedStrokeSample {
  position: Vector2; timestamp: number; pressure: number; tiltX: number; tiltY: number;
  azimuth: number; altitude: number; velocity: number; direction: number; size: number;
  opacity: number; flow: number; spacing: number; scatter: number; rotation: number;
  textureCoordinates: { u: number; v: number }; wetness: number; paintLoad: number;
  smudge: number; blend: number; glaze: number; seed: number; pointerType: string;
  predicted: boolean; coalesced: boolean;
  preserveWhite?: boolean; maskId?: string | null; scrape?: boolean;
}

export interface UnifiedStroke {
  format: 'INK-STROKE'; schemaVersion: 2; id: string; brushId: string; layerId: string;
  pointerType: string; color: string; opacity: number; seed: number; transform: Matrix2D;
  samples: UnifiedStrokeSample[]; boundingBox: { x: number; y: number; width: number; height: number };
  dependencies: Array<Record<string, unknown>>; replayMetadata: Record<string, unknown>;
  selected: boolean; metadata: Record<string, unknown>; contentHash: string;
}

export interface UnifiedStrokeSession {
  format: 'INK-STROKE-SESSION'; schemaVersion: 2; id: string; name: string; seed: number;
  status: string; strokes: UnifiedStroke[]; events: Array<Record<string, unknown>>;
  dependencies: Array<Record<string, unknown>>; intermediateStates: Array<Record<string, unknown>>;
  finalOutput: Record<string, unknown> | null; deterministicHash?: string;
}

export type PatchPath = Array<string | number>;
export interface SetPatch { op: 'set'; path: PatchPath; value: unknown; }
export interface DeletePatch { op: 'delete'; path: PatchPath; }
export interface ArrayInsertPatch { op: 'array-insert'; path: PatchPath; index: number; value: { id: string } & Record<string, unknown>; }
export interface ArrayDeletePatch { op: 'array-delete'; path: PatchPath; index: number; id: string; }
export interface ArrayMovePatch { op: 'array-move'; path: PatchPath; from: number; to: number; id: string; }
export type HistoryPatch = SetPatch | DeletePatch | ArrayInsertPatch | ArrayDeletePatch | ArrayMovePatch;

export type InputRole = 'tool' | 'navigate' | 'gesture';

export interface PenProfile {
  pressureMin: number;
  pressureMax: number;
  pressureGamma: number;
  pressureSmoothing: number;
  tiltSensitivity: number;
  tiltDeadzone: number;
  azimuthOffset: number;
  useCoalescedEvents: boolean;
  usePredictedEvents: boolean;
  palmRejection: boolean;
  palmRadiusThreshold: number;
  penTouchGuardMs: number;
}

export interface CalibratedPenSample {
  pressure: number;
  rawPressure: number;
  tiltX: number;
  tiltY: number;
  altitude: number;
  azimuth: number;
  twist: number;
  predicted: boolean;
  pointerType: string;
  latencyMs: number;
}

export interface GPUResourceDiagnostics {
  budgetBytes: number;
  usedBytes: number;
  availableBytes: number;
  peakBytes: number;
  utilization: number;
  resources: number;
  allocations: number;
  releases: number;
  evictions: number;
  rejected: number;
  byType: Record<string, number>;
}

export interface TilePlanItem {
  index: number; row: number; column: number;
  coreX: number; coreY: number; coreWidth: number; coreHeight: number;
  x: number; y: number; width: number; height: number;
  cropX: number; cropY: number;
}

export interface TilePlan { width: number; height: number; scale: number; tileSize: number; overlap: number; step: number; columns: number; rows: number; tiles: TilePlanItem[]; }


export interface StrokeEditState {
  ref: { layerId: LayerId; objectId: ObjectId };
  nodeIndices: Set<number>;
  segmentIndex: number | null;
  segmentT: number;
  handle: { index: number; kind: 'in' | 'out' } | null;
}

export interface SpatialIndexStats {
  pageId: PageId | null;
  objects: number;
  nodes: number;
  revision: number;
  fullRebuilds: number;
  incrementalUpdates: number;
  mode: 'incremental-quadtree';
}

export interface NaturalMediaDiagnostics {
  preference: NaturalMediaRenderMode;
  activeBackend: 'webgl2' | 'canvas2d' | 'webgl2-multichannel' | 'canvas2d-multichannel';
  gpuAvailable: boolean;
  gpuState: string;
  forcedReason: string | null;
  fallbacks: number;
  batchFallbacks: number;
}

export interface IntegrityIssue {
  code: string;
  path: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface DocumentIntegrityReport {
  passed: boolean;
  errors: IntegrityIssue[];
  warnings: IntegrityIssue[];
  stats: {
    pages: number;
    layers: number;
    objects: number;
    groups: number;
    strokes: number;
    points: number;
    duplicateIds: number;
    byteLength: number;
  };
  fingerprint: string | null;
}

export interface RuntimeHealthDiagnostics {
  startedAt: string;
  uptimeMs: number;
  attached: boolean;
  frames: number;
  averageFrameMs: number;
  longFrames: number;
  errorCount: number;
  longFrameRatio: number;
  unfinishedOperations: number;
  status: 'pass' | 'warn' | 'fail';
  reasons: string[];
}

export interface ServiceWorkerUpdateDiagnostics {
  supported: boolean;
  state: 'idle' | 'registering' | 'ready' | 'installing' | 'update-ready' | 'activating' | 'activated' | 'unsupported' | 'error';
  hasRegistration: boolean;
  updateReady: boolean;
  controllerChanged: boolean;
  error: string | null;
}

export interface HistoryDiagnostics {
  undo: number;
  redo: number;
  patchCount: number;
  storedBytes: number;
  capturedBytes: number;
  scopedEntries: number;
  fullEntries: number;
  scopedRatio: number;
  mode: 'hybrid-target-scoped-id-aware-patches';
  metrics: {
    scopedBegins: number;
    fullBegins: number;
    scopedCapturedBytes: number;
    fullCapturedBytes: number;
    inPlaceApplies: number;
  };
}

export interface TileAtlasDiagnostics {
  generation: number;
  bounds: { x: number; y: number; w: number; h: number };
  scale: number;
  tiles: number;
  allocated: number;
  dirty: number;
  clean: number;
  errors: Array<{ tile: number; error: string }>;
  stats: {
    configured: number;
    dirtyMarks: number;
    fullInvalidations: number;
    renders: number;
    cacheHits: number;
    allocations: number;
    evictions: number;
    failedAllocations: number;
    cancelledUpdates: number;
    durationMs: number;
  };
  budget: GPUResourceDiagnostics;
}

export interface TiledExportCheckpoint {
  schema: 'INK_TILED_EXPORT_CHECKPOINT_V1';
  planFingerprint: string;
  nextTileIndex: number;
  completedTiles: number;
  totalTiles: number;
  startedAt: number;
}

export interface TiledExportDiagnostics {
  state: 'idle' | 'running' | 'cancelling' | 'cancelled' | 'failed' | 'completed';
  checkpoint: TiledExportCheckpoint | null;
  hasOutputCanvas: boolean;
  startedAt: number | null;
  finishedAt: number | null;
  durationMs: number;
  error: string | null;
}

export interface ExternalValidationGate {
  id: string;
  status: 'pass' | 'warn' | 'fail' | 'not-run';
  at: string;
  details: Record<string, unknown>;
}

export interface ExternalDiagnosticBundle {
  schema: 'INK_EXTERNAL_DIAGNOSTIC_BUNDLE_V1';
  capturedAt: string;
  product: 'INK';
  version: string | null;
  formatVersion: number | null;
  capabilities: Record<string, unknown>;
  storage: Record<string, unknown>;
  app: Record<string, unknown> | null;
  validation: {
    startedAt: string;
    pen: Record<string, unknown>;
    penSamples: Array<Record<string, unknown>>;
    events: Array<Record<string, unknown>>;
    gates: ExternalValidationGate[];
  } | null;
  notes: string[];
}
