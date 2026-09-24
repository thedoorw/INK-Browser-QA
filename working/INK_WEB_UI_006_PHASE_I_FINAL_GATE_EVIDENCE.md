# INK-WEB-UI-006 — Phase I Final Gate Evidence

STATUS: `DEV_HANDOFF / STATIC_PASS / UR_FINAL_RUNTIME_REQUIRED / STOP`
TASK: `INK-WEB-UI-006 / PHASE_I`
BRANCH: `work/ink-web-ui-006-i`
FINAL_RUNTIME_CANDIDATE_SOURCE_SHA: `5ad4a271b37a1dca9236239be8bb867bff320b7c`
BASELINE_PHASE_H_ACCEPTED_BRANCH_HEAD: `34a7925ef097ab771859d3722d9964a69d46bc94`
BASELINE_PHASE_H_TESTED_PRODUCT_SHA: `1eb8757bc3d1b3983ad8e727c434a8a9f2ae9fbf`
PHASE_H_RUNTIME: `35953369828 / PASS`
PRODUCT_VERSION: `v0.1 / PRESERVED`
FORMAT_VERSION: `4 / PRESERVED`

## Phase I scope result

Phase I remained QA / evidence only.

No product presentation file, product source file, runtime harness file, Core authority, document schema, History, Revision, Renderer, Geometry, CHAT semantic, Service Worker, runtime bootstrap, cache/build identity, product version or format version was modified.

The final Runtime candidate source SHA is the Phase I authorization head:

`5ad4a271b37a1dca9236239be8bb867bff320b7c`

Compare from the accepted Phase H branch head:

`34a7925ef097ab771859d3722d9964a69d46bc94...5ad4a271b37a1dca9236239be8bb867bff320b7c`

is:

- ahead by 1;
- behind by 0;
- exactly one changed file:
  - `working/INK_WEB_UI_006_PHASE_I_DEV_HANDOFF.md` — added;
- product delta: none;
- QA harness delta: none.

Therefore the Phase I final Runtime candidate preserves the exact accepted Phase H product / QA implementation while adding only the Phase I authorization document.

## A–H coverage matrix

| Phase | Accepted surface | Phase I final-gate result |
|---|---|---|
| A | command map / baseline authority | PRESERVED / no Phase I source delta |
| B | global shell / branding | PRESERVED / no Phase I source delta |
| C | reduced top file chrome + File menu Primary Home | ASSERTION RETAINED |
| D | left toolbar frozen order + single / dual column | ASSERTIONS RETAINED |
| E | right Panel Dock + one-active-primary-panel + Properties / Specialist separation | ASSERTIONS RETAINED |
| F | duplication cleanup + Primary Home route classification + handler proxies | ASSERTIONS RETAINED |
| G | typography token authority + readable floors + CJK/Latin/numeric consistency | ASSERTIONS RETAINED |
| H | canvas / status / fullscreen / narrow desktop / compact-mobile responsive geometry | ASSERTIONS RETAINED / Phase H Runtime PASS baseline preserved |

## Primary Home / authority audit

Final source and harness retain the accepted classification:

- File menu = desktop File `PRIMARY_HOME`;
- left Toolbar = tool-selection `PRIMARY_HOME`;
- contextual Options / quick controls = immediate-control `PRIMARY_HOME`;
- Properties = deep settings / normal property family surface;
- Panel Dock = panel-navigation `PRIMARY_HOME`;
- Window menu = secondary panel route;
- Specialist = separate advanced / diagnostic primary panel using the existing Inspector authority;
- mobile controls remain responsive alternatives, not a divergent command taxonomy.

No second Inspector, panel router, canvas authority or hidden editor authority was introduced in Phase I.

## Final harness audit

Authoritative harness:

`qa/runtime/ink-web-ui-001-harness.html`

Retained coverage includes:

- Phase C reduced desktop file-command chrome and File menu Primary Home;
- Phase D frozen tool order;
- Phase D single-column default;
- Phase D dual-column rail geometry and restoration;
- Phase E active Inspector resize / canvas-width coupling;
- Phase E Properties normal-family isolation;
- Phase E Geometry reachability for Path Boolean / Repeat without duplicate endpoints;
- Phase E Specialist using the existing Inspector;
- Phase E one-primary-panel switching and collapse/restore;
- Phase F Panel Dock `PRIMARY_HOME` / Window menu `SECONDARY_ROUTE`;
- Phase F File route `PRIMARY_HOME` vs responsive alternatives;
- Phase F workspace and Toolbar Primary Home markers;
- Phase F contextual selection surface with hidden handler proxies;
- Phase F no duplicate DOM command IDs;
- Phase G typography token authority;
- Phase G interactive and metadata readable minimums;
- Phase G CJK / Latin / numeric size and font-stack consistency;
- Phase H all eight primary-right-panel canvas boundaries;
- Phase H Inspector resize → canvas geometry delta;
- Phase H fullscreen containment;
- Phase H 960px narrow-desktop canvas/status behavior;
- Phase H compact/mobile essential reachability;
- Phase H mobile Inspector overlay behavior;
- existing UI / Creative / Geometry regression coverage.

No accepted assertion was removed, weakened or bypassed.

## Static verification

Connector-side exact-source checks on `work/ink-web-ui-006-i`:

```text
PHASE_H_TO_PHASE_I_COMPARE = AHEAD 1 / BEHIND 0
PHASE_H_TO_PHASE_I_CHANGED_FILES = Phase I handoff document only
PRODUCT_PRESENTATION_DELTA = 0
QA_HARNESS_DELTA = 0
WEB_TEMPLATE_GENERATION_PARITY = PASS
PORTABLE_TEMPLATE_GENERATION_PARITY = PASS
UNRESOLVED_SHELL_TOKENS = 0
HARNESS_INLINE_JAVASCRIPT_SYNTAX = PASS
CSS_BRACE_BALANCE = PASS / 1587 : 1587
SHELL_TEMPLATE_DUPLICATE_DOM_IDS = 0
FORMAT_VERSION = 4 / PASS
VISIBLE_PRODUCT_VERSION = v0.1 / PRESERVED
WEB_SHARED_STYLES = PASS
PORTABLE_SHARED_STYLES = PASS
WEB_SHARED_WEB_SHELL = PASS
PORTABLE_SHARED_WEB_SHELL = PASS
```

## Web / Portable parity

The checked-in delivery files exactly match the shared `shell.template.html` substitution contract in `generate-shell.mjs`:

- Web → `index.html`
- Portable → `index-standalone.html`

Both continue to consume the same:

- `styles.css`
- `web-shell.js`
- accepted shell structure and command/panel taxonomy.

The intended delivery-specific runtime/manifest substitutions remain the only generated-shell differences.

Result:

`WEB_PORTABLE_PARITY = PASS / SHARED_UI_AUTHORITY PRESERVED`

## Protected-authority preservation

```text
DOCUMENT_SCHEMA_AUTHORITY = UNCHANGED
ARTWORK_TEXT_SEMANTICS = UNCHANGED
HISTORY = UNCHANGED
REVISION = UNCHANGED
RENDERER_WEBGL_CANVAS_AUTHORITY = UNCHANGED
GEOMETRY_RECIPE_CORE = UNCHANGED
CHAT_SEMANTICS = UNCHANGED
SERVICE_WORKER = UNCHANGED
RUNTIME_BOOTSTRAP = UNCHANGED
CACHE_BUILD_IDENTITY = UNCHANGED
PRODUCT_VERSION = v0.1 / PRESERVED
FORMAT_VERSION = 4 / PRESERVED
```

## POLISH_CANDIDATE

`NONE_FROM_STATIC_FINAL_GATE`

The user-requested Photoshop / Figma / INK final visual comparison remains intentionally deferred to UR after the final Windows Runtime PASS. Any visual-only inconsistency found there should be handled by UR as a bounded polish decision rather than reopening earlier phases automatically.

## Runtime boundary

DEV does not claim final certification from static evidence.

UR must execute the authoritative Windows self-hosted Runtime against the exact final candidate/source-equivalent branch state and require:

- UI PASS;
- Creative PASS;
- Geometry PASS.

Phase I completion state:

`DEV_HANDOFF → UR_FINAL_RUNTIME → STOP`
