# INK UI Assembly Rebuild Feasibility v0.1

STATUS: R&D COMPLETE / SUB-FINDING OF ARCHITECTURE RECOMPOSITION / NO PRODUCT MUTATION  
DATE: 2026-10-03  
REPO: `thedoorw/INK-Browser-QA`

Related:
- `research/INK_ARCHITECTURE_RECOMPOSITION_ASSESSMENT_v0.1.md`
- `ACTIVE/INK_UI_MICRO_MODULE_GRAMMAR_v1.0.md`
- `ACTIVE/INK_UI_PS_ALIGNMENT_MASTER_GUIDE_v1.0.md`
- `governance/UI_REFERENCE_DRIVEN_DESIGN_AND_INSPECTION_STANDARD_v1.0.md`

## 1. Question

Evaluate this candidate inside Architecture Recomposition:

```text
KEEP
Document / History / Renderer / Drawing / Vector / Raster /
verified mature capabilities

REORGANIZE
Command + State authority

REBUILD
UI Shell
├─ Top Menu
├─ Tools
├─ Options Bar
├─ Canvas chrome
├─ Right Panels
├─ Dialogs
└─ Window / workspace controls
```

The key question is whether current UI is already thin enough to rebuild directly, or whether product command/state extraction must happen first.

## 2. Decision

```text
CORE_REWRITE = NO
UI_ASSEMBLY_REBUILD = FEASIBLE / RECOMMENDED INSIDE OPTION B
DIRECT_UI_REBUILD_BEFORE_AUTHORITY_EXTRACTION = NO
REQUIRED_FIRST = UI-CRITICAL COMMAND / STATE SEAM
```

The preferred architecture direction is therefore:

**preserve Core + extract shared command/state authority + rebuild UI Assembly against existing Photoshop grammar.**

This is materially different from a full INK rewrite.

## 3. Current UI coupling evidence

### 3.1 Three active UI assembly/handler layers exist

Current major UI surfaces:

```text
src/ink.js
ui/full-capability-controls.js
web-shell.js
```

Approximate event/DOM coupling:

| File | DOM/event evidence |
|---|---:|
| `src/ink.js` | ~195 direct event assignments/listeners; ~428 selector/helper calls |
| `ui/full-capability-controls.js` | 62 listeners; ~177 selector/helper calls |
| `web-shell.js` | 69 direct listeners/onclick assignments; 181 querySelector calls |

This means the current UI is not one thin adapter.

### 3.2 InkApp already contains a large UI routing surface

`InkApp.bindUI()` alone is approximately 15.6k characters and routes UI events into a very broad method surface including:

- document/page/layer actions;
- selection/group/alignment/reorder;
- transform;
- stroke/path editing;
- tool switching;
- brush settings;
- paper/artboard;
- workspace/layout viewport;
- zoom/navigation;
- History undo/redo;
- export;
- diagnostics;
- panel/workspace state.

This is useful evidence in both directions:

1. many controls already call callable app methods rather than embedding all algorithms inside DOM handlers;
2. those callable methods still live in the same broad `InkApp`, so they are not yet a clean public command boundary.

### 3.3 Direct product mutation still exists in UI layers

`full-capability-controls.js` directly imports and invokes Core mutation functions including:

```text
createAdjustment
createFilter
createLayerEffect
createLiquifyFilter
applyNonDestructiveDeformation
updateTextObject
cropImageData
resizeImageData
convertBitDepth
convertColor
```

It also wraps product changes directly with `app.history.pushScoped(...)`.

Examples:

```text
UI click
→ addAdjustment()
→ app.history.pushScoped()
→ target.adjustments.push(createAdjustment(...))
→ app.refreshAll()
→ app.renderer.render()
```

and:

```text
UI dialog
→ addFilter / addLayerEffect / raster mutation
→ Core function directly
→ History directly
```

Therefore this file cannot simply be visually replaced while preserving identical behavior unless those mutation paths are first exposed through shared commands.

### 3.4 web-shell is mostly shell logic but not purely UI-local

`web-shell.js` is closer to a shell adapter, but still contains direct product mutations.

Current examples:

```text
mutateFrameLayoutFromShell()
→ app.history.pushScoped()
→ found.object.layout = next
```

```text
mutateLayoutItemFromShell()
→ app.history.pushScoped()
→ found.object.layoutItem = next
```

Other shell actions still proxy through hidden/existing DOM controls:

```text
shell action
→ find old control by selector
→ click old control
→ old handler
→ InkApp method
```

This is a migration bridge, not a clean final authority.

### 3.5 InkApp itself owns product mutation and UI-local state together

Static responsibility evidence in `src/ink.js`:

```text
History mutation wrappers ≈ 77
direct this.doc writes ≈ 12
direct this.selection writes ≈ 32
```

Not every assignment is problematic; selection/draft/tool/view state includes legitimate application state.

But the same class currently mixes:

```text
product document
selection
History
Renderer
input interaction
view/camera
tools
panels
local preferences
PWA update state
UI refresh
DOM binding
product commands
```

That is the boundary that must be decomposed before the rebuilt shell becomes simple.

## 4. Important positive finding

A UI rebuild is **not blocked by missing design authority**.

INK already has:

- Photoshop reference dataset;
- canonical Photoshop alignment Master Guide;
- shared Micro-Module Grammar;
- durable reference-driven UI inspection standard.

The Micro-Module Grammar already specifies the intended implementation model:

```text
DEFINE SHARED TOKENS / PRIMITIVES
→ MIGRATE ALL APPLICABLE SURFACES
→ REMOVE SUPERSEDED LOCAL OVERRIDES
→ VERIFY STATES
```

It already defines shared roles for:

- typography;
- gray hierarchy;
- divider hierarchy;
- compact control geometry;
- parameter rows;
- spacing;
- icon envelope;
- scrollbar;
- slider;
- panel grammar;
- side collapse;
- window controls;
- menus;
- Layers;
- panel content.

Therefore the design system should be **kept and used as the rebuild specification**, not rediscovered.

## 5. Recommended UI-target architecture

```text
                     PRODUCT / CORE
                           │
                  Shared Command API
                           │
                  Shared State Selectors
                           │
          ┌────────────────┴────────────────┐
          │                                 │
   Human UI Adapter                 CHAT / Recipe Adapter
          │
   ┌──────┴────────────────────────────────────────┐
   │                                               │
UI SHELL                                        dialogs
   │
   ├─ Top Menu
   ├─ Tools
   ├─ Options Bar
   ├─ Canvas chrome
   ├─ Right Panel Stack
   ├─ Dialog framework
   └─ Window / workspace controls
          │
     shared primitives
          │
   Photoshop-aligned grammar
```

### State split

Three state classes should be explicit:

```text
PRODUCT STATE
document / page / layer / object / selection semantic state

VIEW STATE
camera / zoom / rulers / panel sizes / workspace view

UI-LOCAL STATE
menu open / hover / flyout / dialog visibility / transient focus
```

UI controls may own only UI-local state.

Product and view state should have named authorities/selectors.

## 6. What to preserve

### KEEP unchanged unless a later parity test disproves it

```text
Document model
HistoryManager
RevisionController
InkStore
Renderer algorithms
Drawing / Stroke
Vector Core
Raster / Image Core
Text
Transform
Material
Recipe engine
Import / Export
CHAT governance
```

Renderer implementation is preserved; only renderer **composition/extension wiring** may change.

“Canvas chrome rebuild” means rulers, scrollbars, zoom UI, overlays and surrounding interaction shell — not rewriting the rendering engine.

## 7. What to rebuild

Primary UI rebuild scope:

```text
Top application menu
Contextual Options Bar
Left Tools
Canvas chrome
Right panel stack
Panel headers / tabs / splitters
Panel bodies / compact controls
Dialogs / Preferences
Window controls
Workspace controls
Status chrome
```

Build these from one primitive/token system rather than carrying forward current selector-specific CSS structure.

## 8. What must be extracted first

Do **not** require every INK command to be redesigned before the first new UI exists.

Instead extract the **UI-critical command seam** first.

Minimum first authority set:

```text
Document
  new / open / save / title

Page
  add / duplicate / delete / activate

Layer
  add / duplicate / delete / reorder / opacity

Selection
  set / clear / delete / duplicate / group / ungroup / order

Transform
  move / resize / rotate / align / distribute

Tool / drawing
  activate tool / contextual tool settings

Artboard / Paper

View
  zoom / fit / pan / rotation / rulers / guides / workspace

History
  undo / redo / timeline jump

Panel-capability commands
  raster adjustments / filters / effects
  text
  path edit
  layout/frame
  import/export
```

The command seam must define:

```text
command id
input schema
state owner
mutation target
History policy
Revision policy
render invalidation
result / error contract
```

Human UI and CHAT may then call the same command.

## 9. Fastest safe sequence

Recommended sub-sequence inside Architecture Recomposition Option B:

```text
UI-R0  freeze existing Core / current behavior baseline
UI-R1  extract UI-critical command/state seam
UI-R2  define shared UI primitives/tokens from existing Micro-Module Grammar
UI-R3  build new empty Photoshop-aligned shell
UI-R4  connect one vertical slice:
       Menu + Tools + Options Bar + Layers + History + basic canvas navigation
UI-R5  black-box parity:
       old route vs new route
       document result
       History
       Revision
       render/output
UI-R6  USER visual checkpoint
UI-R7  migrate remaining panels/dialogs by capability family
UI-R8  remove old DOM proxy routes / duplicate handlers
UI-R9  remove superseded legacy CSS / shell code
UI-R10 full assembled visual + interaction + Runtime + USER gate
```

This permits UI rebuilding to begin early, without requiring a complete whole-product architecture migration first.

## 10. Why this is likely faster than continuing UI patching

Current UI standards already prohibit one-off patch accumulation, but the existing implementation still contains multiple shell/handler layers and legacy routing.

Continuing pixel-by-pixel repair has to repeatedly work around:

- current DOM topology;
- existing handler ownership;
- legacy selectors;
- proxy-click routes;
- multiple panel assemblers;
- old CSS interaction;
- direct Core mutation from UI files.

A clean shell rebuild after the command seam removes those constraints.

The Photoshop alignment task becomes:

```text
reference geometry
→ shared primitive
→ shell assembly
→ command binding
→ rendered comparison
```

instead of:

```text
reference delta
→ locate legacy DOM
→ locate existing selector
→ avoid handler breakage
→ add/override CSS
→ discover another inherited interaction
```

## 11. Final disposition

```text
CORE = KEEP
COMMAND_STATE_AUTHORITY = CONSOLIDATE / REHOME
CURRENT ink.js UI responsibilities = SPLIT / REHOME
CURRENT full-capability-controls mutation layer = REHOME
CURRENT web-shell = REPLACE AS FINAL SHELL, but reusable as migration/reference evidence
UI GRAMMAR / PS DATASET = KEEP
UI SHELL = REBUILD
FULL PRODUCT REWRITE = NO
```

### Architecture recommendation refinement

Option B should now be understood as:

```text
ARCHITECTURE RECOMPOSITION
=
preserve mature Core
+ establish shared command/state authority
+ rebuild UI Assembly
+ retain CHAT/Recipe as adapters to the same authority
+ normalize delivery identity
```

## 12. Stop gate

```text
UI_REBUILD_FEASIBILITY = CONFIRMED
COMMAND_STATE_EXTRACTION_FIRST = REQUIRED
PRODUCT_SOURCE_MUTATION = NOT AUTHORIZED
NEXT = STOP → USER DECISION
```
