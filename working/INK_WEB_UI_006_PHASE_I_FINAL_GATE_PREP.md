# INK-WEB-UI-006 — Phase I Final Gate PREP CHECKLIST

STATUS: PREP_ONLY / NOT_AUTHORIZED_FOR_EXECUTION
OWNER: INK UR
DEPENDENCY: PHASE_H_UI_PASS_REQUIRED

This document prepares the final certification work in parallel with Phase H implementation.

It does **not** authorize Phase I Runtime, promotion, or final certification before Phase H is accepted and source-frozen.

## Entry condition

Phase I may begin only after:

`PHASE_H = UI_PASS / WINDOWS_RUNTIME_PASS / STOP`

and a final accepted Phase H product/QA SHA is frozen.

## Final gate coverage

Phase I will certify the complete INK-WEB-UI-006 result across:

- Phase A command map / baseline authority
- Phase B global shell + branding
- Phase C top area cleanup
- Phase D left toolbar
- Phase E right Panel Dock
- Phase F duplication cleanup / Primary Home enforcement
- Phase G typography
- Phase H canvas / status / responsive

## Final structural checks

- one Primary Home per function family;
- no unintended equal-status duplicate command surfaces;
- File / Edit / View / panel routing remains coherent;
- toolbar order/groups/shortcuts stable;
- Panel Dock remains the single panel navigation authority;
- Window menu remains secondary;
- Specialist remains separated from normal Properties;
- no second Inspector/router/controller;
- Web / Portable parity;
- visible version remains `v0.1`;
- `FORMAT_VERSION = 4`.

## Final visual comparison

After Phase I Runtime passes, UR will perform the requested final comparison against mature editor references.

Comparison dimensions:

- overall workstation hierarchy;
- Photoshop-like spatial/editor grammar;
- Figma-like lighter chrome/density where adopted;
- top menu + contextual options;
- left toolbar;
- right Panel Dock;
- panel title/tab/property hierarchy;
- typography;
- canvas working-space dominance;
- status bar;
- fullscreen;
- narrow desktop;
- mobile/compact responsive;
- duplicate visual noise;
- alignment / spacing / density consistency;
- INK-specific Creative Loop visibility and usability.

Reference comparison is for interaction grammar, hierarchy and density only; no proprietary visual copying.

## Runtime final gate

The final exact-SHA Windows self-hosted Runtime must include:

- UI suite PASS
- Creative suite PASS
- Geometry suite PASS
- all accepted UI-006 phase assertions
- fullscreen
- narrow desktop
- responsive/mobile reachability
- panel switching/resizing/collapse
- canvas geometry
- Primary Home classification
- typography
- Web / Portable parity

## Final outcomes

Possible UR outcomes:

`UI_PASS / FINAL_CERTIFIED`

or

`UI_POLISH_REQUIRED`

or

`UI_HOLD`

or

`INTEGRATION_REQUIRED → MR`

If only small visual inconsistencies remain after functional certification, issue one bounded final polish batch rather than reopening earlier phases.

## Execution lock

Until Phase H is accepted:

`PHASE_I_EXECUTION = LOCKED`
