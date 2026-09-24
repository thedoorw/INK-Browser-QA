# INK-WEB-UI-006 — Phase I FINAL GATE DEV HANDOFF

STATUS: AUTHORIZED / UI_ONLY / PHASE_I / FINAL_GATE_START
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