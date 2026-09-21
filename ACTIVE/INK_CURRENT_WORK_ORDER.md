# INK CURRENT WORK ORDER

STATUS: `NO_ACTIVE_DEV_WORK_ORDER / REAL_CREATIVE_WORK_READY`

## Control

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `NONE` |
| LAST_CLOSED_TASK | `INK-CLOUD-017` |
| LAST_GATE | `STRUCTURE_AWARE_MULTI_PATH_RECONSTRUCTION_WORKS` |
| LAST_REVIEWED_DEV_HEAD | `a0fe5833f0a3449c380c7adb5817b4c7cc4b5bd8` |
| LAST_PROMOTION_PR | `#19 / MERGED` |
| LAST_MAIN_PROMOTION | `edb8f11c39e43043584a20ec648dace242574742` |
| DEFAULT_EXTRACTION | `DIRECT_EXTRACTION` |
| STRUCTURE_AWARE_ROLE | `OPTIONAL_STRUCTURED_RECONSTRUCTION` |
| FORMAT_VERSION | `4` |
| CORE_RUNTIME | `STATIC_HOSTING + BROWSER_LOCAL` |
| RUNTIME_QA | `DEFERRED` |

## Accepted creative baseline

The first INK creative-loop core is accepted:

```text
Reference
→ Extract
→ editable Path
→ Edit
→ Expressive Stroke
→ Multi-Contour Compose
→ Repaint / Material
→ CHAT Review / Structured Edit
→ CHAT Multi-Step Creative Plan
→ Revision
```

Also accepted:

```text
Portable/shared-core integrity = VERIFIED
Structure-Aware multi-Path reconstruction = TECHNICALLY_CLOSED
```

## Extraction decision

The INK-CLOUD-017 benchmark showed:

```text
Direct Extraction:
recall 0.904256
precision 0.932975
IoU 0.849098

Structure-Aware multi-Path:
recall 0.505239
precision 0.509176
IoU 0.339764
```

Therefore:

```text
DIRECT_EXTRACTION = DEFAULT
STRUCTURE_AWARE = OPTIONAL / SPECIALIZED STRUCTURED TOOL
AUTOMATIC PIPELINE REPLACEMENT = NO
```

Structure-Aware remains available when repeated/radial geometry and linked editing are useful.

## Current operating mode

No new numbered engineering Work Order is automatically authorized.

Current priority:

```text
use INK on real creative work
→ observe actual friction / missing capability
→ preserve successful workflow
→ issue a bounded engineering task only for a concrete gap
```

This is the transition from capability construction to real-use creative development.

## Persistent constraints

- GitHub remains the engineering SSOT.
- Do not create a second vector/document/History/Revision/renderer authority.
- Static hosting + browser-local execution remains the core requirement.
- Remote AI/services remain optional adapters.
- Do not bump `FORMAT_VERSION` without an explicit new Work Order.
- Do not mutate package/release artifacts without explicit authorization.
- Do not start an autonomous/open-ended agent implementation by default.

## Next action

`USER_REAL_CREATIVE_CASE`

When the user begins a concrete artwork/workflow, use the accepted capabilities first. If the real task exposes a bounded technical gap, MR may define the next engineering Work Order from that evidence.
