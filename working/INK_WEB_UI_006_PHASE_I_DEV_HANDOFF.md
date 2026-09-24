# INK-WEB-UI-006 — Phase I FINAL GATE DEV HANDOFF

STATUS: DEV_HANDOFF / STATIC_PASS / UR_FINAL_RUNTIME_REQUIRED / UI_ONLY / PHASE_I / STOP
OWNER: UI DEV
REVIEWER: INK UR
BRANCH: `work/ink-web-ui-006-i`
BASELINE_PHASE_H_ACCEPTED_BRANCH_HEAD: `34a7925ef097ab771859d3722d9964a69d46bc94`
BASELINE_PHASE_H_TESTED_PRODUCT_SHA: `1eb8757bc3d1b3983ad8e727c434a8a9f2ae9fbf`
PHASE_H_RUNTIME: `35953369828 / PASS`

## Goal

Execute only Phase I — Final Runtime QA + Certification Prep.

This is the final certification phase for INK-WEB-UI-006. Do not reopen earlier phases unless a specific failing assertion requires one bounded correction.

## Final checks

Verify the accepted A–H result remains intact:
- command-map / shell / branding
- top cleanup
- left toolbar
- right Panel Dock
- Primary Home enforcement
- typography
- canvas / status / responsive

Confirm:
- one Primary Home per command family
- no unintended equal-status duplicate command surfaces
- left Toolbar remains tool-selection Primary Home
- contextual Options remains immediate-control surface
- Properties remains deep-settings surface
- Panel Dock remains panel Primary Home
- Window menu remains secondary
- Specialist remains separate
- no second Inspector, panel router, or canvas authority
- mobile remains a responsive alternative, not a divergent taxonomy
- Web / Portable parity
- visible version remains v0.1
- FORMAT_VERSION = 4

## Runtime harness audit

Do not remove or weaken accepted assertions.

Confirm the authoritative UI harness still covers:
- reduced desktop file chrome and File menu Primary Home
- toolbar single/double-column behavior
- Panel Dock grouping and one-active-primary-panel behavior
- Primary Home route classifications
- selection handler proxies
- contextual vs deep Properties separation
- typography token authority / readable minimums
- CJK / Latin / numeric consistency
- all eight primary-panel canvas boundaries
- Inspector resize → canvas-width delta
- fullscreen containment
- 960px narrow desktop
- compact/mobile essential reachability
- mobile Inspector overlay
- duplicate DOM ID regression
- Web / Portable parity

## Source freeze

Phase I should be QA/evidence-only.

Product presentation files should remain frozen. If any product source must change, stop and explain exactly why before Runtime dispatch.

Allowed by default:
- Phase I handoff/evidence documents
- `qa/runtime/ink-web-ui-001-harness.html` only if a deterministic final-gate assertion itself needs bounded correction

Do not modify:
- Document authority/schema
- artwork Text semantics
- History semantics
- Revision semantics
- Renderer/WebGL/Canvas authority
- Geometry / Recipe / Core contracts
- CHAT semantics
- Service Worker
- runtime bootstrap
- cache/build identity
- product version v0.1
- FORMAT_VERSION = 4

## Final candidate

Prepare one exact final candidate SHA for UR Windows self-hosted Runtime.

Required suites:
- UI PASS
- Creative PASS
- Geometry PASS

DEV must not claim final certification from static checks alone.

## Evidence

Create:
`working/INK_WEB_UI_006_PHASE_I_FINAL_GATE_EVIDENCE.md`

Include:
- exact final candidate SHA
- accepted Phase H baseline
- A–H coverage matrix
- changed-file compare
- final harness coverage
- static checks
- Web / Portable parity
- authority-preservation statement
- any remaining `POLISH_CANDIDATE`

The final Photoshop / Figma / INK visual comparison is intentionally deferred to UR after the final Runtime PASS, per user direction.

## DEV return

Return:
- exact final candidate SHA
- changed files
- A–H coverage matrix
- harness coverage summary
- static verification
- Web / Portable parity
- any POLISH_CANDIDATE
- confirmation that protected authorities remain unchanged

Completion:

`DEV_HANDOFF → UR_FINAL_RUNTIME → STOP`

Do not self-promote to FINAL_CERTIFIED.

---

## DEV completion — Phase I final gate

Final Runtime candidate source SHA:

`5ad4a271b37a1dca9236239be8bb867bff320b7c`

Accepted Phase H baseline:

- branch head: `34a7925ef097ab771859d3722d9964a69d46bc94`
- tested product SHA: `1eb8757bc3d1b3983ad8e727c434a8a9f2ae9fbf`
- Runtime: `35953369828 / PASS`

Phase I source-freeze result:

- product presentation files changed: NO
- QA harness changed: NO
- protected Core / Document / History / Revision / Renderer / Geometry / CHAT / Service Worker authorities changed: NO
- product version: `v0.1 / PRESERVED`
- `FORMAT_VERSION = 4 / PRESERVED`

Changed-file compare from accepted Phase H head to the Phase I candidate source SHA:

```text
AHEAD = 1
BEHIND = 0
CHANGED = working/INK_WEB_UI_006_PHASE_I_DEV_HANDOFF.md only
PRODUCT_DELTA = 0
HARNESS_DELTA = 0
```

Final static verification:

```text
WEB_TEMPLATE_GENERATION_PARITY = PASS
PORTABLE_TEMPLATE_GENERATION_PARITY = PASS
UNRESOLVED_SHELL_TOKENS = 0
HARNESS_INLINE_JAVASCRIPT_SYNTAX = PASS
CSS_BRACE_BALANCE = PASS / 1587 : 1587
SHELL_TEMPLATE_DUPLICATE_DOM_IDS = 0
PRIMARY_HOME_CLASSIFICATIONS = PRESERVED
TYPOGRAPHY_AUTHORITY = PRESERVED
ALL_EIGHT_PRIMARY_PANEL_BOUNDARY_ASSERTION = PRESERVED
INSPECTOR_RESIZE_ASSERTION = PRESERVED
FULLSCREEN_ASSERTION = PRESERVED
NARROW_DESKTOP_ASSERTIONS = PRESERVED
COMPACT_MOBILE_ASSERTIONS = PRESERVED
WEB_PORTABLE_PARITY = PASS
```

Evidence:

- `working/INK_WEB_UI_006_PHASE_I_FINAL_GATE_EVIDENCE.md`

POLISH_CANDIDATE:

`NONE_FROM_STATIC_FINAL_GATE`

The final Photoshop / Figma / INK visual comparison remains deferred to UR after the final Runtime PASS as instructed.

DEV does not claim `FINAL_CERTIFIED`.

Completion:

`DEV_HANDOFF → UR_FINAL_RUNTIME → STOP`


---

## UR final source review — 2026-09-24

Reviewed final Runtime candidate:

`5ad4a271b37a1dca9236239be8bb867bff320b7c`

Accepted Phase H branch baseline:

`34a7925ef097ab771859d3722d9964a69d46bc94`

Exact compare result:
- candidate is 1 commit ahead / 0 behind;
- the only changed file is `working/INK_WEB_UI_006_PHASE_I_DEV_HANDOFF.md`;
- product presentation delta = 0;
- QA harness delta = 0;
- no protected authority changed.

Branch changes after the candidate are progress / handoff / evidence documentation only and do not alter product or QA payload.

UR source findings:
- Phase I correctly remained source-frozen;
- accepted A–H UI implementation is preserved exactly;
- all accepted Phase C–H Runtime assertions remain intact;
- Web / Portable shared UI authority remains preserved;
- visible product version remains `v0.1`;
- `FORMAT_VERSION = 4`;
- static final-gate evidence reports no polish candidate.

UR source result:

`STATIC_PASS / FINAL_RUNTIME_REQUIRED`

Authoritative exact-SHA Windows Runtime must test:

`5ad4a271b37a1dca9236239be8bb867bff320b7c`

After Runtime PASS, UR will perform the user-requested Photoshop / Figma / INK final visual comparison before issuing FINAL_CERTIFIED or a bounded polish decision.


---

## UR final Runtime gate — 2026-09-24

Authoritative Windows self-hosted Runtime:

- run: `35954873725`
- attempt: `1`
- tested SHA: `5ad4a271b37a1dca9236239be8bb867bff320b7c`
- runner: `DESKTOP-NSOQH69`
- browser: Google Chrome
- overall: `PASS`
- UI: `PASS`
- Creative: `PASS`
- Geometry: `PASS`
- artifact: `10789638247`
- artifact digest: `sha256:1abef6759597176cde9548ce03fdfed2b662364a9b3254a433fe63bdba0696f8`

The final Runtime tested the exact Phase I candidate. No product or QA source delta exists between the accepted Phase H implementation and this Phase I candidate.

Phase I Runtime result:

`FINAL_RUNTIME_PASS`

Remaining UR action before FINAL_CERTIFIED:
- user-requested Photoshop / Figma / INK final visual and structural comparison;
- bounded polish decision only if that comparison finds a visible inconsistency.

Current state:

`PHASE_I / STATIC_PASS / FINAL_RUNTIME_PASS / VISUAL_COMPARISON_REQUIRED`
