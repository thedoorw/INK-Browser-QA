# INK UI REBUILD 001 — Technical Debt Cleanup DEV Handoff

STATUS: `DEV_HANDOFF / MR_REVIEW_REQUIRED / STOP`

TASK: `INK-UI-REBUILD-001-TECH-DEBT-CLEANUP`

BRANCH: `work/ink-ui-rebuild-001-tech-debt-cleanup`

## Objective

Remove the UI technical debt identified by UR without touching Core behavior, and leave evidence strong enough to prove the cleanup reduced debt instead of merely hiding it.

## Mandatory gate order

```text
G0 BASELINE_EVIDENCE              = PASS / already recorded
G1 OBSOLETE_UI_QA_CONTRACTS
G2 MENU_PANEL_AUTHORITY
G3 FIRST_PAINT_AUTHORITY
G4 TYPOGRAPHY_AUTHORITY
G5 CSS_SHELL_AUTHORITY
G6 RESPONSIVE_AUTHORITY
G7 BRAND_CONTRACT
G8 FULL_RUNTIME_AND_VISUAL_EVIDENCE
```

Do not combine later gates to conceal an earlier failure.

## Authorized product surfaces

```text
product/source/styles.css
product/source/web-shell.js
product/source/shell.template.html
product/source/generate-shell.mjs
product/source/index.html                 # generated output only
product/source/index-standalone.html      # generated output only
product/source/service-worker.js
product/source/src/ink.js                 # UI binding cleanup only; no Core semantics
product/source/assets/favicon.svg         # contract only unless asset replacement is explicitly proven/approved
product/source/assets/ink-mark.svg        # contract only
product/source/assets/INK_MARK_SOURCE_W-300.jpg  # retirement only when accepted contract permits
```

Authorized QA:

```text
qa/core/tests/unit/ui-debt-001-shell-panel-authority-v0.1.test.mjs
qa/core/tests/unit/ui-maint-002-readability-panel-favicon-v0.1.test.mjs
qa/core/tests/unit/final-ui-responsive-regression-v0.1.test.mjs
qa/core/tests/unit/photoshop-shell-geometry-v0.1.test.mjs
qa/runtime/ink-web-ui-001-harness.html
qa/runtime/ink-cloud-018-browser-harness.html
new focused UI debt cleanup QA if needed
```

Documentation/evidence files are allowed.

## Frozen authorities

```text
Renderer
WebGL / Canvas
Document model/schema/migration
History
Revision
Recipe
Geometry
CHAT proposal/approval/execution
persistence
FORMAT_VERSION
product base version
```

If a cleanup appears to require changing one of these, STOP and return MR_HOLD with evidence.

## Gate rules

### G1 — obsolete UI QA contracts

Replace contradictory/obsolete assertions first.

Required result:

```text
old JPG favicon assertion = 0
required inspectorEdgeToggle presentation assertion = 0
required legacy Inspector opener assertion = 0 where superseded
new accepted contract assertions = real, not unconditional PASS
```

Do not change product UI in G1 unless required to keep generated shell contract consistent.

### G2 — menu / panel authority

Required:

```text
Panel Dock same active item → close
Panel Dock different item → switch
Window menu → same state owner
contextual Advanced → Properties subsection navigation only
floating edge tab retired
legacy Inspector opener retired where duplicate
one application-menu controller/registry
one menu open at a time
Escape closes
outside click closes
dead menu labels not presented as live menus
```

### G3 — first paint

Server/generated shell must declare the intended initial visual state before runtime boot.

No whole-workstation restyle from a legacy dark state after boot.

Change service-worker BUILD_ID with this delivery contract.

### G4 — typography

One normal workstation font stack and one normal workstation scale.

Monospace is allowed only for diagnostic/code semantics.

Remove Georgia workstation usage and cascade-war typography overrides.

### G5 — CSS shell authority

No appended "final override" block.

For each touched shell surface:

```text
locate old authority
delete/replace old authority
leave one desktop authority
leave one responsive authority
use named tokens
```

Record after metrics against G0.

### G6 — responsive authority

Define only:

```text
DESKTOP_WIDE
DESKTOP_NARROW
COMPACT
```

Existing thresholds may be mapped/removed, but no anonymous fourth taxonomy may be introduced.

### G7 — brand

One favicon authority.
One visible-logo authority.

If the exact visible logo asset is not proven, report `HOLD_ASSET` rather than inventing one.

### G8 — evidence / Runtime

Required source QA:

```text
generate-shell.mjs --check
Web / Portable parity
duplicate DOM IDs = 0
contradictory favicon assertion = 0
same-panel Dock toggle contract
single panel state owner
shared menu controller
first-paint source contract
CSS before/after metric report
```

Required browser evidence:

```text
same Dock open → close
different Dock switch
Window route convergence
File + non-File shared menu controller
first paint stable
1280×1024 containment
960px containment
```

Required artifacts:

```text
reload / first-paint capture
1280×1024 shell capture
960px shell capture
Runtime JSON/log evidence
exact tested SHA
run id
artifact id + digest
```

## Commit discipline

Create a checkpoint at the end of each gate. The evidence report must record each checkpoint SHA.

Do not start Photoshop alignment during this task.

Final handoff only after focused QA:

`DEV_HANDOFF → STOP`

MR owns exact-SHA Windows Runtime and promotion.

## Final DEV handoff — 2026-09-25

```text
MR_REVIEWED_HEAD = f574731b0e920950211f04177826b3ad2ce0157b

G0 = PASS
G1 = PASS
G2 = SOURCE_PASS
G3 = SOURCE_PASS
G4 = SOURCE_PASS
G5 = REVISED_SOURCE_PASS
G6 = SOURCE_PASS
G7 = HOLD_ASSET
G8 = NOT_RUN_BY_DEV / MR_OWNED
```

### G5 revision closure

The MR blocker is closed at source level:

```text
!important
G0 = 223
prior G5 = 220
revised G5 = 19
presentation !important = 0
```

The 19 retained exceptions are limited to semantic display state and reduced-motion behavior.

No new final override block was added.

### G6 completion

Responsive source authority is now explicitly:

```text
DESKTOP_WIDE   > 1120
DESKTOP_NARROW 761–1120
COMPACT        <= 760
```

The focused regression no longer requires retired `980 / 560 / 440` breakpoints.

### G7 disposition

```text
FAVICON_AUTHORITY = PASS / assets/favicon.svg
VISIBLE_LOGO_ROUTE_SINGULARITY = PASS
VISIBLE_LOGO_EXACT_ASSET_APPROVAL = NOT PROVEN
G7 = HOLD_ASSET
```

No final visible-logo asset was guessed or replaced.

### Focused source evidence

Connector-side deterministic source verification: **PASS**.

Verified generator output equality, Web/Portable parity, duplicate DOM IDs = 0, CSS brace balance, semantic-only `!important`, responsive taxonomy, favicon/brand route singularity, FORMAT_VERSION 4, and the G3 service-worker build identity.

No local Node checkout run is claimed because the container cannot resolve GitHub. No Windows Runtime was run by DEV.

### Frozen authorities

No Renderer, WebGL/Canvas, Document, History, Revision, Recipe/Geometry, CHAT, persistence, FORMAT_VERSION or product-version authority was changed by the revision from the MR reviewed HEAD.

### MR next gate

MR should review the exact final HEAD reported in the DEV response.

Because G7 is `HOLD_ASSET`, the exact visible-logo asset authority must be resolved before final cleanup PASS. G8 Runtime/visual evidence remains MR-owned.

Photoshop workstation rebuild remains HOLD.

`DEV_HANDOFF → STOP`

## G7 exact approved asset closure — 2026-09-25

This section supersedes the earlier `G7 = HOLD_ASSET` disposition.

Approved user asset:

```text
SOURCE = /INK-DEV-ASSET-STAGING/INK_APPROVED_VISIBLE_LOGO_W-300.jpg
DIMENSIONS = 300x300
BYTES = 19801
SHA256 = 08fdfd29832ffc06779eae8da9be6d14e9564ed292ba5548483def016338fed8
```

DEV verification and installation:

```text
PREWRITE_SHA256 = PASS
TARGET = product/source/assets/INK_MARK_SOURCE_W-300.jpg
ASSET_INSTALL_COMMIT = c50e10aec6826876ee6b7cedc8af9271538b7274
GIT_BLOB_SHA = bb640a245af35c993c4fe322fbe8744830e872b6
GITHUB_REFETCH_EXACT_BASE64_MATCH = PASS
VISIBLE_LOGO_ROUTE = assets/INK_MARK_SOURCE_W-300.jpg?v=0.1
VISIBLE_LOGO_AUTHORITY = 1
FAVICON_AUTHORITY = 1 / unchanged
```

Focused QA now locks the visible-logo route and exact approved SHA256:

`qa/core/tests/unit/ui-debt-001-shell-panel-authority-v0.1.test.mjs`

Focused QA contract checkpoint:

`1893abd440dc7401156c1bd2c7b9f2a77309f450`

Bounded-delta verification from MR authorization HEAD `8e5308f7b004864f674e6e5a569846ea2f941d24`:

- only approved JPEG changed under `product/source/**`;
- `favicon.svg` blob unchanged;
- Web / Portable visible-logo route remains singular;
- `ink-mark.svg` remains non-authoritative and unchanged;
- no Runtime;
- no Photoshop alignment;
- no Core / Renderer / Document / History / Revision / Geometry / CHAT / persistence / FORMAT_VERSION mutation.

Current gates:

```text
G0-G7 = SOURCE PASS
G8 = MR_OWNED / NOT_RUN_BY_DEV
PHOTOSHOP_WORKSTATION_REBUILD = HOLD
```

`DEV_HANDOFF → STOP`

