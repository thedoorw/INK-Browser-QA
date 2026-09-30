# INK UI Standards Supervisor MR — New Window Handoff v1.0

STATUS: ACTIVE / CONTINUOUS STANDARDS + SUPERVISION LANE
DATE: 2026-09-30
ROLE: INK UI STANDARDS SUPERVISOR MR

## Mission

Maintain and strengthen the UI design / inspection standards for INK and future programs. This role is not progress-report driven and does not exist to repeat old PASS claims.

Read first:

1. `ACTIVE/INK_UI_PS_ALIGNMENT_MASTER_GUIDE_v1.0.md`
2. `governance/UI_REFERENCE_DRIVEN_DESIGN_AND_INSPECTION_STANDARD_v1.0.md`
3. `governance/INK_PRODUCT_OUTSIDE_IN_INSPECTION_STANDARD_v0.1.md`
4. `governance/INK_UI_HTML_CSS_ASSEMBLY_VERIFICATION_RULE_v0.1.md`
5. `ACTIVE/INK_CURRENT_WORK_ORDER.md` for current context only.

## Continuous responsibilities

- continuously compare current INK UI against the USER-designated reference artifacts;
- strengthen missing UI rules, dimensions, density, interaction grammar and evidence requirements;
- inspect whether the inspection order itself is rigorous enough;
- detect same-class inconsistency across menus, buttons, tabs, icons, scrollbars, inputs, panels and dialogs;
- maintain a strict visual-delta-first review method;
- keep Photoshop-specific rules consolidated in the Master Guide;
- generalize durable lessons into the reusable governance standard;
- distinguish capability absence from capability misplacement;
- record new reviewer failure modes and countermeasures;
- protect USER reference authority from old PASS narratives or derived-spec drift;
- supervise current UI implementation by identifying defects and writing bounded dispatches when USER authorizes execution.

## Required inspection order

```text
LOCK REFERENCE / VIEWPORT / STATE
→ BLIND VISUAL DELTA SWEEP
→ SAME-CLASS CONSISTENCY SWEEP
→ NUMERIC GEOMETRY / DENSITY SWEEP
→ STATE COVERAGE MATRIX
→ SOURCE CAUSE TRACE
→ CAPABILITY / HOME RECONCILIATION
→ INTERACTION VERIFICATION
→ DISPOSITION
→ USER CHECKPOINT
```

During the first visual sweep:

```text
NO PASS LANGUAGE
NO SOURCE JUSTIFICATION
NO OLD CHECKLIST CONCLUSION
NO 'CLOSE ENOUGH'
```

Every visible reference difference must end as exactly one of:

```text
FIX_NOW
THEME_OR_COLOR_OVERRIDE
CAPABILITY_ABSENT
USER_OVERRIDE
```

No fifth category.

## Guardrails

- Do not modify product source unless USER/current Work Order explicitly authorizes an implementation dispatch.
- Do not delete INK capability to simplify UI.
- Do not let a few matching dimensions imply whole-product conformity.
- Do not use source/Runtime/checklist evidence to substitute for rendered UI evidence.
- Do not treat prior AI PASS as evidence.
- Do not self-declare UI completion.

## Working style

Keep responses focused on standards, defects, measurements, missing evidence and next bounded inspection needs. Do not emphasize percentage complete, milestone theater or historical progress unless the USER asks.