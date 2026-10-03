# INK Local Main-Program Optimization — closure 2026-10-03

## Scope

This bounded DEV line handled only the two formally evidenced Paper renderer integration gaps:

1. `PAPER_SINGLE_STROKE_RENDER_INTEGRATION`
2. `PAPER_WEBGL_ROUGHNESS_PARITY`

B4 Path Deformation and Combined Capability TEST remained separate. No C1/C2, Eraser, Blender/Smudge, Text deformation, UI, FORMAT_VERSION, or Runtime/UI Shell refactor was taken over.

## 1. Paper single-stroke render integration — CLOSED

Root cause confirmed on latest main at issue start: page rendering only entered existing `renderStrokeRun(..., page.paper)` for `entries.length > 1`; a single eligible native Brush/DryBrush fell back to `renderStroke` and therefore did not consume full page Paper semantics.

Bounded repair:
- existing page renderer opts eligible singleton Brush/DryBrush into the existing multichannel run with explicit `minimumStrokes: 1`;
- controller/backend default minimum remains 2 unless explicitly overridden by the page route;
- no new Stroke, Renderer, NaturalMedia, Paper, History, or document authority.

Identity:
- exact candidate: `29e23abf609bf57603ecfe5e366355b788ddc2fd`;
- PR #130 merge / accepted source: `701c3777dba854df893f61f1d75b97ea694ede62`;
- accepted product/source tree: `5749d904364217df2438550e759b64d2df3d579e`;
- Live deployment commit: `07642e8ae95da557b7cc04f410a11707a8fb9e82`.

Qualification:
- singleton Brush/DryBrush candidate run `37087584729`: PASS;
- Brush Preview `fnv1a32:f12338cd -> fnv1a32:fa55e651`;
- DryBrush Preview `fnv1a32:3438417b -> fnv1a32:af6f8723`;
- active backend: `webgl2-multichannel`;
- stable native Stroke identity; Paper edit adds one History entry; exact Undo/Redo;
- 2+ adjacent A3 regression run `37087624476`: PASS;
- A2 run `37087659009`: PASS;
- A1 run `37087724137`: PASS;
- formal Live run `37087999061`: PASS with exact source identity `701c3777...`.

## 2. WebGL paper roughness parity — CLOSED

Source audit confirmed Canvas2D Paper resistance consumed existing `roughness`, while the WebGL multichannel simulation had no `u_roughness` and incorrectly used `granulation` in the resistance role.

Bounded repair:
- add `u_roughness` to the existing WebGL simulation shader;
- bind it from existing `normalizePaperProfile(paper).roughness`;
- use `sizing * .72 + (1 - paper) * roughness * .35`, matching the existing Canvas2D resistance role;
- retain existing absorbency and granulation behavior separately;
- no second Paper model or NaturalMedia rewrite.

B4 isolation:
- second issue branch was created from latest main at issue start;
- B4 merged while this work was in flight, touching `capability-registry.js`, `chat-bounded-edit.js`, `transform-advanced.js`, and `deformation.js`;
- this line touched none of those product files;
- PR #134 merged cleanly on top of accepted B4 main.

Identity:
- exact pre-merge candidate: `e75ff85e28a7fa6370d25c1a9f38c6488e189023`;
- PR #134 merge / accepted source: `698ce0ef781eeb5899ab5b84183d9a0d0eb8e6f5`;
- accepted/current product/source tree: `6f616cdbf54f172c569d69d14b197c3b6eae746f`;
- Live deployment commit: `27e3acfb7af31c1faf7262a6400de1d33908981c`.

Qualification:
- first candidate attempt failed only because of a QA regex syntax error; product code was unchanged and the QA harness was corrected;
- exact roughness candidate run `37088814441`: PASS;
- roughness-only state: `0.42 -> 0.95`;
- Preview: `fnv1a32:bbeabfad -> fnv1a32:44068a67`; exact Undo/Redo;
- active backend: `webgl2-multichannel`;
- direct Canvas2D: `d89edc99 -> 34a46cf6`;
- direct WebGL: `493bb14e -> 8dc9621f`;
- resistance increased `0.2101061707 -> 0.3632172435`;
- absorbency remained `0.4575191707` in both comparison states;
- pre-merge A2/A3/A1 runs `37088881571`, `37088937716`, `37088987352`: PASS;
- post-B4 merged exact-source roughness run `37089063471`: PASS;
- merged A1/A2/A3 runs `37089114868`, `37089167456`, `37089199118`: PASS;
- Pages deployment run `37089314792`: PASS;
- formal Live run `37089417471`: PASS;
- Live exact source identity: `698ce0ef781eeb5899ab5b84183d9a0d0eb8e6f5`;
- Live Preview `fnv1a32:f4fdfe1a -> fnv1a32:633c4d8e`;
- Undo restored `f4fdfe1a`; Redo restored `633c4d8e`;
- Live Paper retained absorbency `0.58` while roughness became `0.95`;
- Live History retained exactly one scoped native Stroke entry plus one scoped Paper entry.

## Final state

```text
PAPER_SINGLE_STROKE_RENDER_INTEGRATION = CLOSED
PAPER_WEBGL_ROUGHNESS_PARITY = CLOSED
A1_A2_A3_REGRESSION = CLEAN
NO_B4_CONFLICT = TRUE
NO_SECOND_AUTHORITY = TRUE
NO_UI_CHANGE = TRUE
NO_FORMAT_VERSION_CHANGE = TRUE
CURRENT_ACCEPTED_SOURCE = 698ce0ef781eeb5899ab5b84183d9a0d0eb8e6f5
CURRENT_PRODUCT_SOURCE_TREE = 6f616cdbf54f172c569d69d14b197c3b6eae746f
FORMAL_LIVE_SOURCE_IDENTITY = VERIFIED
```
