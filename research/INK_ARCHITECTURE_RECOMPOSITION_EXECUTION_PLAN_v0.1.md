# INK Architecture Recomposition Execution Plan v0.1

STATUS: PLANNED / USER-DIRECTED / PRE-IMPLEMENTATION  
DATE: 2026-10-03  
REPO: `thedoorw/INK-Browser-QA`  
GITHUB: SOLE SSOT

Related:
- `research/INK_ARCHITECTURE_RECOMPOSITION_R_AND_D_v0.1.md`
- `research/INK_ARCHITECTURE_RECOMPOSITION_ASSESSMENT_v0.1.md`
- `research/INK_UI_ASSEMBLY_REBUILD_FEASIBILITY_v0.1.md`
- `ACTIVE/INK_UI_PS_ALIGNMENT_MASTER_GUIDE_v1.0.md`
- `ACTIVE/INK_UI_MICRO_MODULE_GRAMMAR_v1.0.md`

## 1. Chosen working direction

The current planned direction is Architecture Recomposition Option B:

```text
KEEP
Document / History / Revision / Storage / Renderer algorithms /
Drawing / Vector / Raster / Text / Transform / Material /
Import / Export / verified mature capabilities

REORGANIZE
Command + State Authority

REBUILD
UI Shell / Assembly

RETAIN AS ADAPTERS
Human UI / CHAT / Recipe / Public API
→ all invoke the same native command authority
```

This is **not** a full INK rewrite.

## 2. Mandatory precondition — preserve a recoverable original baseline

No recomposition product mutation may begin until one explicit pre-recomposition baseline has been frozen.

Required order:

```text
finish current bounded PWA integration + actual live gate
→ identify exact accepted main SHA
→ freeze PRE-RECOMPOSITION BASELINE
→ verify baseline artifacts
→ begin B1 architecture contract
```

Required baseline package:

```text
Git tag
  pre-architecture-recomposition-v1

Archive branch
  archive/pre-architecture-recomposition

Baseline manifest
  exact commit SHA
  FORMAT_VERSION
  source/build/deployment/browser-loaded identity
  capability baseline pointer
  Runtime / QA status
  PWA live-gate status
  known open independent lanes

Source snapshot
  complete repository/source ZIP or equivalent immutable archive
  checksum recorded in the manifest
```

The exact baseline SHA must be the accepted state **after** the current bounded PWA work is closed, not an intermediate PWA candidate.

## 3. Recomposition sequence

### B0 — Baseline freeze

Goal:
- create the recoverable pre-recomposition identity;
- prove it can be checked out / recovered;
- make the baseline explicit in GitHub SSOT.

No product behavior change.

### B1 — Command + State Contract

Define architecture contracts before refactoring implementation.

Required outputs:

```text
COMMAND CONTRACT
- command id
- input schema
- state owner
- mutation target
- History policy
- Revision policy
- render invalidation
- result/error contract

STATE AUTHORITY MAP
- Product State
- View State
- UI-local State

UI-CRITICAL COMMAND REGISTRY
- Document
- Page
- Layer
- Selection
- Transform
- Tool / drawing settings
- Artboard / Paper
- View / navigation
- History
- Raster / Vector / Text / Layout / Import / Export routes
```

B1 is a design/contract package. It does not itself authorize moving product logic.

### B2 — First bounded command vertical slice

Only after B1 review/authorization:

```text
introduce shared command authority
→ route one low-risk Human UI path
→ route equivalent CHAT/API path
→ parity evidence
→ switch caller
→ retain old route until evidence passes
```

### B3 — UI Shell primitives

Use existing UI authority, not a new visual research program:

```text
Photoshop Dataset
+ PS Alignment Master Guide
+ UI Micro-Module Grammar
```

Build one shared primitive/token system.

### B4 — New UI Shell / Assembly

Rebuild:

```text
Top Menu
Tools
Options Bar
Canvas chrome
Right Panels
Dialogs / Preferences
Window / workspace controls
```

New UI owns UI-local state only and invokes shared commands/state selectors.

### B5 — Capability migration

Migrate by bounded capability families with old/new parity:

```text
document/page/layer/selection/transform
→ drawing/vector/raster/text/material
→ panels/dialogs/specialist capabilities
→ Recipe / CHAT parity
```

### B6 — Retire old assembly paths

Only after parity / Runtime / browser evidence:

```text
old DOM handlers
old proxy-click routes
duplicate UI mutations
superseded web-shell paths
legacy CSS overrides
duplicate command routes
```

### B7 — Final recomposition closure

Required closure layers:

```text
command contract tests
adapter parity
History / Revision parity
render/output parity
assembled UI interaction
exact-SHA Runtime
deployed Pages identity
USER acceptance
```

## 4. Architecture target

```text
Product Model
     ↓
Capability Core
     ↓
Shared Command + State Authority
     ↓                  ↓
Human UI Adapter    CHAT / Recipe / API
     \                  /
      └──── same commands ────┘
                ↓
       History / Revision
                ↓
       Renderer / Output
```

## 5. UI implementation rule

Do not continue architecture-scale UI repair by accumulating local CSS/DOM fixes.

The rebuilt shell must be assembled from shared primitives derived from the existing Micro-Module Grammar.

```text
reference geometry
→ shared primitive/token
→ shell assembly
→ shared command binding
→ rendered / interaction comparison
```

## 6. Migration safety rule

For every migrated command family:

```text
introduce new authority
→ keep old path temporarily
→ old/new parity evidence
→ switch one caller class
→ exact regression
→ retire old path
```

No mass file move first.

No old authority is deleted merely because the replacement compiles.

## 7. Protected assets

Unless a later evidence-based work order specifically authorizes change:

```text
Document model = KEEP
HistoryManager = KEEP
RevisionController = KEEP
InkStore = KEEP
Renderer algorithms = KEEP
Vector/Raster/Drawing/Text/Transform/Material Core = KEEP
Recipe engine = KEEP
CHAT governance = KEEP
Public Creative API role = KEEP
FORMAT_VERSION = 4 / unchanged
```

## 8. Independent lanes

Architecture Recomposition must not silently absorb unrelated active lanes.

Current bounded PWA integration/live closure completes first because its accepted publication identity becomes part of the frozen baseline.

Other independent tasks remain independent unless a later Work Order explicitly reconciles them.

## 9. Immediate authorized planning package

Immediate next package:

```text
B0 PRE-RECOMPOSITION BASELINE FREEZE
+
B1 COMMAND / STATE ARCHITECTURE CONTRACT
```

Constraints:

```text
NO product/source mutation
NO Core rewrite
NO UI implementation
NO FORMAT_VERSION change
NO old-route deletion
STOP after baseline/contract package → MR / USER review
```

## 10. Current decision state

```text
ARCHITECTURE_DIRECTION = B / RECOMPOSITION
CORE_REWRITE = NO
UI_SHELL_REBUILD = PLANNED
PRE_RECOMPOSITION_BACKUP = MANDATORY
PWA_CLOSURE_BEFORE_BASELINE = REQUIRED
B0_B1_PACKAGE = READY_TO_DISPATCH
PRODUCT_REFACTOR = NOT YET AUTHORIZED
```
