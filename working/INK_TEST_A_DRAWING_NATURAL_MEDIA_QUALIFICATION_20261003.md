# INK TEST A — Drawing / Natural Media Qualification — 2026-10-03

TYPE = FORMAL LIVE QUALIFICATION / TEST EVIDENCE
ROLE = INK TEST A — Drawing / Natural Media Qualification
SOURCE_REPO = thedoorw/INK-Browser-QA
LIVE_REPO = thedoorw/INK
LIVE_URL = https://thedoorw.github.io/INK/
PRODUCT_MUTATION = NONE
UI_MUTATION = NONE
FORMAT_VERSION_CHANGE = NONE
POINTER_MOUSE_SIMULATION = NONE

## Exact identities

```text
DEPLOYED_SOURCE_SHA = cc9b623258123da0e00e31a9e686357fba0d4ec0
LIVE_REPO_HEAD_AT_TEST = 145a00587bcc6dbc9717b05179f2c5e131a5b587
BUILD_INFO_BLOB = 12548bca1625467e6944e3e279b3a41f40aac438
PUBLIC_API = window.INK_APP.inkPublicApi
NAMED_TOOL_COUNT = 23
```

The deployed source identity was read from `thedoorw/INK/BUILD_INFO.json` and independently returned by the completed A1 regression Runtime identity.

## Required sequence result

| Package | Formal Live result | Classification |
|---|---|---|
| A2 Native Stroke | BLOCKED_AT_PUBLIC_EXPOSURE | EXPOSURE_GAP |
| NaturalMedia | BLOCKED_AT_PUBLIC_EXPOSURE because the required native Stroke creation operation is not exposed | EXPOSURE_GAP |
| Airbrush | BLOCKED_AT_PUBLIC_EXPOSURE because the required native Stroke creation operation is not exposed | EXPOSURE_GAP |
| A3 Paper | BLOCKED_AT_PUBLIC_EXPOSURE | EXPOSURE_GAP |
| A1 regression | PASS | PASS |

No failure was converted into an implementation task in this package.

## A2 — Native Stroke / NaturalMedia / Airbrush

Formal request:

```text
REQUEST_ID = clusterA-A2-native-stroke-discovery-live-001
REQUEST_COMMIT = 0753b4971abdb41749fbc66fadb663243d716660
RESULT_COMMIT = 9f7dd86e246014e18e8be71010b3a545e07bfd42
RESULT = FAILED
ERROR = INK_SEQUENCE_STEP_FAILED:describeStroke:INK_CAPABILITY_NOT_FOUND
```

Reproducer:

1. `get_ink_capabilities`
2. `describe_ink_capability({ idOrToolName: "stroke.create.v1" })`

Expected:
- `stroke.create.v1` is formally discoverable;
- then pencil / brush / drybrush / airbrush can enter the full CHAT lifecycle.

Actual:
- the formal describe step returns `INK_CAPABILITY_NOT_FOUND`;
- no legal `propose_ink_edit → approve_ink_edit → execute_ink_edit` call can be made for native Stroke;
- therefore native state / Canvas / History / Preview / Undo / Redo cannot be exercised for A2 on this deployment.

Source authority check on the exact deployed source:
- `product/source/src/ink.js` still owns interactive `beginStroke()`;
- native tools include pen / pencil / marker / brush / airbrush;
- brush/drybrush/airbrush use the existing natural-media semantics, including `mediaModel:'natural-v2'` where defined;
- `NaturalMediaController` remains imported/installed through the existing renderer path;
- `product/source/src/agent/capability-registry.js` contains `paint.session.create.v1` but no `stroke.create.v1`.

Disposition:

```text
AFFECTED = C29 / C30 / C31 / C34
CLASS = EXPOSURE_GAP
PRODUCT_CAPABILITY_GAP = NOT ESTABLISHED
PRODUCT_INTEGRATION_GAP = NOT ESTABLISHED BY THIS TEST
POINTER_EMULATION = NONE
```

NaturalMedia and Airbrush are not separately marked as renderer failures: the formal test is blocked earlier at the shared native Stroke exposure boundary.

## A3 — Paper

Formal request:

```text
REQUEST_ID = clusterA-A3-paper-discovery-live-001
REQUEST_COMMIT = 00a1bcc4503b1367a889ff7a8c2308c1234ba85b
RESULT_COMMIT = b66739f60e79b7705b2f8a7b5b228f1d20d1e674
RESULT = FAILED
ERROR = INK_SEQUENCE_STEP_FAILED:describePaper:INK_CAPABILITY_NOT_FOUND
```

Reproducer:

1. `get_ink_capabilities`
2. `describe_ink_capability({ idOrToolName: "page.paper.set.v1" })`

Expected:
- bounded Paper mutation is formally discoverable and can reuse the existing page.paper / History / renderer-cache authority.

Actual:
- `page.paper.set.v1` is not in the deployed public capability surface;
- no formal CHAT mutation can enter native state, render comparison, History, Preview, Undo or Redo.

Source authority check:
- the deployed source still owns `InkApp.changePaper()`;
- page.paper remains the product authority;
- `render/paper-profile.js` remains the existing paper-profile authority;
- no second paper model is needed or created here.

Disposition:

```text
AFFECTED = C31 / C38
CLASS = EXPOSURE_GAP
POINTER_EMULATION = NONE
```

## A1 regression — Paint Session

Formal request:

```text
REQUEST_ID = clusterA-A1-regression-live-001
REQUEST_COMMIT = b96ac419baa9a1f7ae65609ffdee90106a7714aa
RESULT_COMMIT = 9b26e502664b38f2068840d9b6eb3852087eebda
RESULT_BLOB = 6f7035f4dfb79d742cb99fd8b4000f36656f234c
RESULT = COMPLETED
RUNTIME_SOURCE_SHA = cc9b623258123da0e00e31a9e686357fba0d4ec0
```

Lifecycle:

```text
CHAT
→ get_ink_capabilities
→ propose_ink_edit
→ approve_ink_edit
→ execute_ink_edit
→ native paint-session state
→ Renderer / Canvas
→ History
→ Preview
→ Undo
→ Redo
```

Evidence:
- `paint.session.create.v1` is discoverable and proposal-required;
- before: 0 objects / 0 History entries;
- execute: `EXECUTED`;
- created native object type: `paint-session`;
- stable object id: `chat-paint-fnv1a32-a5525b8e`;
- brushes: pencil + watercolor;
- strokes: 2;
- samples: 6;
- History: exactly one scoped entry, label `CHAT create Paint Session`, patchCount=1;
- Preview: `COMPLETED`, render fingerprint `fnv1a32:a6535881`;
- Undo: applied=true, object count 1 → 0;
- Redo: applied=true, restores the same object id;
- Redo Preview fingerprint: `fnv1a32:a6535881` (exact match);
- result file parses as valid JSON; no binary or non-JSON-safe payload is returned;
- operation is structured CHAT data, not pointer/mouse simulation.

Known pre-existing non-blocking limitation remains visible:
- content Preview uses the known 49×49 fallback bounds for `paint-session`;
- this is the already-recorded Paint Session content/world-bounds integration/usability gap;
- it does not invalidate the A1 regression PASS.

## Package disposition

```text
A1_PAINT_SESSION_REGRESSION = PASS
A2_NATIVE_STROKE = EXPOSURE_GAP
NATURALMEDIA = EXPOSURE_GAP AT SHARED STROKE ENTRYPOINT
AIRBRUSH = EXPOSURE_GAP AT SHARED STROKE ENTRYPOINT
A3_PAPER = EXPOSURE_GAP
PRODUCT_CORE_MODIFIED = NO
UI_MODIFIED = NO
FORMAT_VERSION_MODIFIED = NO
```
