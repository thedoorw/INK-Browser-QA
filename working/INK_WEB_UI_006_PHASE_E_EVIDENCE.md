# INK-WEB-UI-006 — Phase E DEV Evidence

STATUS: DEV_HANDOFF / STATIC_PASS / RUNTIME_DISPATCH_PENDING / STOP
BRANCH: `work/ink-web-ui-006-e`
BASELINE_UI_ACCEPTED: `fd7020f2042f2a70d5b33ee6d3a34ca8a7dbe65f`
SOURCE_HEAD: `6ee7ef4343a0bc8d70c3340ba7bd12be4b430931`

## Implemented scope

Phase E only: Right Panel Dock refactor.

The existing `product/source/web-shell.js` controller remains the single panel authority.

Dock groups now expose:

- Editor
  - Properties
  - Layers
  - History
- Creative Loop
  - Reference
  - Compose
  - CHAT
  - Revision
- Specialist
  - existing Inspector-based AI / advanced production / diagnostic surfaces

No second Inspector, panel router, creative controller, or command authority was added.

## Properties / Specialist separation

Properties now exposes only normal editing/property families:

- Tool
- Object
- Geometry

Existing Path Boolean and Repeat controls were moved from the engineering surface into the Geometry subtab under Properties.

The original command-bearing IDs and handlers were preserved:

- `booleanUnion`
- `repeatRadial`
- related Path / Boolean / Repeat controls

Specialist uses the same existing Inspector container and exposes:

- AI
- Advanced

Existing engineering/diagnostic content remains reachable there, including:

- AI connection / plan surfaces
- program-asset / Recipe engineering
- GPU validation
- device validation
- browser performance benchmark
- manual QA / diagnostic controls

GPU self-check UI was removed from the normal Tool Properties hierarchy and moved to Specialist while preserving `runGPUValidationBtn` and `gpuValidationStatus`.

## Dock behavior preserved

- icon-only collapsed dock
- single visible edge expand/collapse affordance
- one active primary panel at a time
- Inspector resize authority
- last-active primary panel memory
- Window-menu access
- canvas expansion when the primary panel closes
- Creative Workspace stages remain the existing Reference / Compose / CHAT / Revision authority
- Web / Portable shell parity

## Layers / History / Creative Loop

No semantics changed.

Layers retains its existing drag reorder, visibility, lock, add, duplicate, delete, opacity and compact bottom action rail.

History remains its own panel and keeps the existing undo/redo/history authority.

Reference / Compose / CHAT / Revision keep their accepted Creative Workspace routing and underlying controllers.

## Changed product / QA files

- `product/source/shell.template.html`
- `product/source/index.html` — generated
- `product/source/index-standalone.html` — generated
- `product/source/styles.css`
- `product/source/web-shell.js`
- `qa/runtime/ink-web-ui-001-harness.html`
- `working/INK_WEB_UI_006_PHASE_E_DEV_HANDOFF.md` — completion update follows this evidence
- this evidence file

## Static / source verification

PASS:

- Web shell output exactly matches `shell.template.html` substitutions
- Portable shell output exactly matches `shell.template.html` substitutions
- no unresolved shell template tokens
- generator parity is equivalent to `node product/source/generate-shell.mjs --check`
- `web-shell.js` parses successfully
- UI runtime harness inline JavaScript parses successfully
- CSS brace balance is zero
- Phase E panel definitions are exactly:
  - Properties
  - Layers
  - History
  - Reference
  - Compose
  - CHAT
  - Revision
  - Specialist
- moved command endpoints remain single-instance IDs
- `product/source/src/ink.js` blob is unchanged from the accepted Phase C/D baseline
  - blob SHA: `4607fa12685543d62556fbded0b27862cd3c6e96`
- `product/source/src/config.js` still declares `FORMAT_VERSION = 4`
- accepted-baseline compare contains no Service Worker, bootstrap, Core, Document, History, Revision, Renderer, build/cache identity, or format source changes

## Runtime harness coverage added

The existing UI runtime harness now asserts Phase E behavior for:

- Properties normal-family isolation
- Geometry subtab Path Boolean / Repeat reachability
- no duplicate Boolean / Repeat command endpoints
- Specialist route uses the existing Inspector
- Specialist group identity
- specialist engineering / diagnostic endpoint reachability
- Editor → Creative Loop switching without simultaneous primary panels
- last-active primary panel restore through the existing edge affordance
- resizable Inspector with canvas width following the panel width
- Window menu exposes Editor / Creative Loop / Specialist groups
- existing Layers / History operation wiring
- existing narrow-desktop / mobile fallback / fullscreen support checks remain

## Exact-SHA Windows Runtime status

NOT EXECUTED by this DEV connection.

Reason:

- the available GitHub connector can inspect workflow runs, jobs, logs and artifacts and can rerun existing runs;
- it does not expose the repository's manual `workflow_dispatch` action needed to start the central Windows Runtime batch against this new exact SHA;
- no workflow or Runtime queue was mutated merely to manufacture a run.

Therefore no exact-SHA Runtime PASS is claimed.

Required review action:

- dispatch the existing authoritative Windows self-hosted Runtime batch against the final DEV exact HEAD before promotion;
- review the Phase E assertions in `qa/runtime/ink-web-ui-001-harness.html`.

## Boundary confirmation

- Core semantics unchanged: YES
- Document/schema unchanged: YES
- History semantics unchanged: YES
- Revision semantics unchanged: YES
- Geometry execution authority unchanged: YES
- CHAT proposal / approval / execution semantics unchanged: YES
- Renderer / WebGL / Canvas unchanged: YES
- Service Worker unchanged: YES
- runtime bootstrap unchanged: YES
- build/cache identity unchanged: YES
- visible product version remains v0.1: YES
- `FORMAT_VERSION` remains 4: YES
- Phase F started: NO

Completion state:

`DEV_HANDOFF → UR_REVIEW → STOP`
