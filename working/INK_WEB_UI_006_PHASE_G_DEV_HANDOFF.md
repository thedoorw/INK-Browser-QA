# INK-WEB-UI-006 — Phase G DEV HANDOFF

STATUS: DEV_HANDOFF / STATIC_PASS / RUNTIME_DISPATCH_PENDING / UI_ONLY / PHASE_G / STOP
OWNER: UI DEV
REVIEWER: INK UR
BRANCH: `work/ink-web-ui-006-g`
BASELINE_PHASE_F_ACCEPTED_BRANCH_HEAD: `ed06a4562017c1ea78bcd2c39ced5c0b81d1ad71`
BASELINE_PHASE_F_TESTED_PRODUCT_SHA: `1ccfa450d8fe3248e402d26315c386a50e4f4a1b`
PHASE_F_RUNTIME: `35945848484 / PASS`

## Goal

Implement only:

**Phase G — Typography System**

Do not start Phase H or later phases.

Phase G converts the current scattered UI text sizing into one coherent workstation typography system without changing command semantics, layout authority, document content, or the artwork Text tool.

---

## G1 — Scope separation

This phase concerns only **INK application UI typography**.

In scope:
- application menus
- contextual/options bar
- left toolbar labels/tooltips
- right panel titles/tabs/property labels
- input/select values
- status text
- shortcut badges
- metadata/diagnostic labels
- CJK / Latin / numeric consistency

Out of scope:
- artwork Text tool font model
- document text objects
- document font serialization
- typography engine
- paragraph/layout semantics

Do not change Text-tool document behavior.

---

## G2 — Font stack

Preserve the current cross-platform stack unless a concrete rendering defect requires bounded adjustment:

`Inter → Noto Sans TC → PingFang TC → Microsoft JhengHei → system-ui`

Do not add downloadable font dependencies.

Do not ship font files.

---

## G3 — Named typography tokens

Replace scattered ad-hoc sizing where practical with named UI tokens.

Target token families:

- `UI-XS` — noncritical metadata / compact badges
- `UI-SM` — secondary labels / compact controls
- `UI-MD` — normal workstation control text
- `UI-LG` — panel/application headings
- `BRAND` — INK brand mark text only

Use CSS custom properties or an equivalent single presentation authority.

Rules:
- no arbitrary new font-size values unless justified;
- 8–9px may be used only for noncritical metadata;
- normal interactive/control text must remain comfortably legible;
- CJK must not render materially smaller than adjacent Latin/numeric text;
- avoid false hierarchy caused only by inconsistent font sizes.

Exact px values should be frozen from the current accepted shell and runtime comparison, not invented from scratch.

---

## G4 — Weight / line-height / density

Normalize:
- font-weight hierarchy
- line-height
- uppercase eyebrow/metadata treatment
- tab/button label density
- input/select numeric readability
- shortcut badges

Avoid heavy bolding across normal controls.

Do not change control geometry beyond what is strictly required for typography fit.

If typography changes require structural layout rework:
`STOP → UR REVIEW`.

---

## G5 — Panel typography

Review all accepted panel families:

- Properties
- Layers
- History
- Reference
- Compose
- CHAT
- Revision
- Specialist

Ensure:
- panel titles share one hierarchy;
- tabs share one hierarchy;
- property labels are consistent;
- values/inputs are legible;
- diagnostic metadata remains visually subordinate;
- no panel invents its own typography scale.

Preserve Phase E/F routing and Primary Home classifications.

---

## G6 — Top / left / status typography

Top application/menu/contextual areas:
- keep the accepted reduced chrome;
- do not increase vertical footprint unnecessarily;
- improve legibility through hierarchy, not more permanent chrome.

Left toolbar:
- icons remain primary;
- labels/tooltips/accessible text should not force toolbar growth.

Status / metadata:
- maintain compact density;
- do not use microtext for important state or warnings.

---

## G7 — Responsive

At narrow desktop/mobile:
- typography may scale within bounded responsive rules;
- do not create a second typography system;
- preserve existing mobile toolbar/panel authority;
- avoid clipping/truncation of important command labels.

---

## G8 — QA expectations

Update the existing UI runtime harness only where required to verify:

- tokenized typography authority is present;
- normal control text does not fall below the accepted minimum;
- metadata-only text may use the smallest token;
- panel titles/tabs/labels share consistent token classes/values;
- menu/contextual/control text remains readable;
- CJK / Latin / numeric text does not diverge unexpectedly;
- narrow desktop does not overflow from typography changes;
- fullscreen remains stable;
- Web / Portable parity;
- Phase C/D/E/F behavior remains intact;
- UI / Creative / Geometry regression.

No pixel-perfect screenshot copy from Photoshop is required.

Photoshop/Adobe/Spectrum remain reference standards for mature editor density and hierarchy only.

---

## Authority / implementation constraints

Preserve:
- current shell authority
- Phase E Panel Dock authority
- Phase F Primary Home classifications
- current responsive behavior

Normally allowed:
- `product/source/styles.css`
- `product/source/shell.template.html` only if token/class hooks are required
- regenerated `product/source/index.html`
- regenerated `product/source/index-standalone.html`
- task-specific UI Runtime harness assertions

Avoid `web-shell.js` changes unless strictly necessary for presentation-class synchronization.

Do not modify:
- Document authority/schema
- artwork Text semantics
- History semantics
- Revision semantics
- Renderer/WebGL/Canvas
- Geometry/Recipe/Core
- CHAT semantics
- approval/execution authority
- Service Worker
- runtime bootstrap
- cache/build identity
- product visible version `v0.1`
- `FORMAT_VERSION = 4`

If typography work requires any semantic or cross-lane change:

`INTEGRATION_REQUIRED → UR → MR`

---

## DEV return

Return:
- exact HEAD;
- changed files;
- typography token map;
- old scattered size inventory and normalized result;
- any intentional exceptions;
- shell generator check if shell touched;
- static/unit checks;
- runtime-harness assertions added/updated;
- explicit confirmation:
  - artwork Text semantics unchanged
  - Document unchanged
  - History unchanged
  - Revision unchanged
  - Geometry/Core unchanged
  - CHAT semantics unchanged
  - Service Worker/bootstrap/build identity unchanged
  - FORMAT_VERSION unchanged
  - Phase H not started

Completion state:

`DEV_HANDOFF → UR_REVIEW → STOP`

Do not begin Phase H automatically.


---

## DEV completion — 2026-09-24

Implemented only Phase G — Typography System.

### Exact product / QA checkpoint

`718eff8c31a82a8ffd82bbf3d2b83f38b2aa993b`

Later Phase G commits are handoff/evidence/progress documentation only unless otherwise noted by final branch compare.

### Changed product / QA files

- `product/source/styles.css`
- `qa/runtime/ink-web-ui-001-harness.html`

No `product/source/src/**` file changed.

No shell template or generated shell file changed.

### Typography token map

```text
UI-XS  = 9px   / metadata + compact badges
UI-SM  = 9.5px / secondary labels + compact state
UI-MD  = 10px  / normal workstation controls
UI-LG  = 11px  / panel/application headings
BRAND  = 10px  / INK brand text only

WEIGHT_REGULAR = 400
WEIGHT_CONTROL = 500
WEIGHT_HEADING = 650
WEIGHT_META = 700
LINE_CONTROL = 1.2
LINE_COPY = 1.45
```

### Baseline scattered size inventory

Accepted Phase F stylesheet literal sizes before normalization:

`6 / 7 / 8 / 8.5 / 9 / 9.5 / 10 / 10.5 / 11 / 12 / 13 / 14 / 16 / 17px`

Phase G preserves historical/fallback blocks but adds one final application-UI presentation authority so effective readable workstation typography resolves through the named tokens above.

### Intentional exceptions

- application menu commands and document title use `UI-LG` to retain accepted prominence;
- low-priority contextual identity may step down to `UI-XS` on narrow/mobile;
- icon/decorative glyph dimensions are not treated as readable typography;
- artwork Text/document typography is out of scope and unchanged.

### Verification

PASS:

- CSS brace balance;
- exact named token values;
- no literal Phase G font size below 9px;
- interactive-control metadata-scale leak guard;
- UI Runtime harness inline-script parse;
- six Phase G Runtime assertions added;
- accepted Phase F baseline compare is ahead-only;
- product/QA delta limited to `styles.css` + UI Runtime harness;
- `product/source/src/**` unchanged.

Runtime-harness coverage added for:

- tokenized typography authority;
- control minimum;
- metadata minimum;
- panel title/tab hierarchy;
- CJK / Latin / numeric consistency;
- narrow-desktop typography containment.

Full evidence:

`working/INK_WEB_UI_006_PHASE_G_EVIDENCE.md`

### Shell generator

`N/A / SHELL_UNTOUCHED`

`shell.template.html`, `index.html`, and `index-standalone.html` were not changed by Phase G.

### Runtime

The available DEV GitHub connector does not expose workflow dispatch.

No Runtime PASS is claimed.

UR must run the authoritative Windows self-hosted Runtime against the final exact DEV revision before promotion.

### Boundary confirmation

- artwork Text semantics unchanged
- Document unchanged
- History unchanged
- Revision unchanged
- Geometry/Core unchanged
- CHAT semantics unchanged
- Service Worker/bootstrap/build identity unchanged
- product version remains `v0.1`
- `FORMAT_VERSION = 4` unchanged
- Phase H not started

Completion state:

`DEV_HANDOFF → UR_REVIEW → STOP`


---

## UR source review — 2026-09-24

Reviewed product / QA checkpoint:

`718eff8c31a82a8ffd82bbf3d2b83f38b2aa993b`

Accepted Phase F branch baseline:

`ed06a4562017c1ea78bcd2c39ced5c0b81d1ad71`

Compare result:
- Phase G branch is 7 commits ahead / 0 behind the accepted Phase F branch baseline.
- Product / QA delta is limited to `product/source/styles.css` and `qa/runtime/ink-web-ui-001-harness.html`.
- Later branch changes after `718eff8...` are progress / handoff / evidence documentation only; no product / QA source delta exists after the checkpoint.
- No shell template or generated Web / Portable entry file changed in Phase G.

UR static findings:
- one named typography token authority is present: UI-XS / UI-SM / UI-MD / UI-LG / BRAND;
- the accepted cross-platform font stack is preserved and no font binary/dependency was added;
- normal interactive/control text is normalized to UI-MD or above;
- smallest UI-XS token is reserved for metadata / compact badges;
- panel titles, tabs, property labels, inputs, contextual controls, status and Creative Workspace surfaces are mapped into the common typography hierarchy;
- CJK / Latin / numeric UI text shares the same inherited font-stack and size authority;
- artwork Text/document typography semantics are outside this authority and remain unchanged;
- Phase E Panel Dock and Phase F Primary Home routing are untouched;
- `product/source/src/**`, Document, History, Revision, Geometry/Core, CHAT semantics, Service Worker, runtime bootstrap and build/cache identity are unchanged;
- visible version remains `v0.1`; `FORMAT_VERSION = 4`;
- Phase H has not started.

UR static result:

`STATIC_PASS`

Runtime gate required before UI_PASS:
- authoritative Windows self-hosted exact-SHA browser Runtime against `718eff8c31a82a8ffd82bbf3d2b83f38b2aa993b`;
- Phase G token authority / minimum readable control size / metadata floor / panel hierarchy / CJK-Latin-numeric / narrow-desktop assertions;
- Phase C/D/E/F regression;
- fullscreen / responsive / Web-Portable parity;
- UI / Creative / Geometry regression.

Current UR result:

`UR_REVIEW / STATIC_PASS / WINDOWS_RUNTIME_REQUIRED / PHASE_G`

Do not begin Phase H.


---

## UR final gate — 2026-09-24

Authoritative Windows self-hosted Runtime:

- run: `35949410959`
- attempt: `1`
- tested SHA: `718eff8c31a82a8ffd82bbf3d2b83f38b2aa993b`
- runner: `DESKTOP-NSOQH69`
- browser: Google Chrome
- UI: PASS
- Creative: PASS
- Geometry: PASS
- artifact: `10788111361`
- artifact digest: `sha256:4f067accdd59f147293d79905893abbd0280e3ffbffe82eaad1c161ac8f5e4da`

The Runtime tested the exact Phase G product / QA checkpoint. Later branch changes are review / evidence / progress documentation only and do not alter the tested product payload.

Final UR result:

`UI_PASS`

Phase G is accepted.

Completion state:

`UR_REVIEW → UI_PASS → STOP`

Phase H remains separately authorized work and is not started by this gate.
