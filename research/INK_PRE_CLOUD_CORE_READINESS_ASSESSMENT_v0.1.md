# INK Pre-Cloud Core Readiness Assessment v0.1

STATUS: `PRE_CLOUD_CORE_NOT_READY / ONE_FINAL_STRUCTURAL_WORKPACK_REQUIRED`

ASSESSMENT_BASELINE: `main`

CURRENT_MAIN_PROMOTION:

`INK-CLOUD-005 → 58b584051afe6fab8cfcd387e65f62d4e78bd4f0`

## Purpose

Determine whether the document-format / structural core is sufficiently stable to begin the first INK Cloud implementation work order.

This assessment does not authorize Cloud implementation.

## Structural readiness matrix

| Structural area | Status | Evidence |
|---|---|---|
| Document / Page / Layer / Object baseline | `READY` | format-4 document model, stable IDs, migration, integrity, snapshots, local storage |
| Frame + nested hierarchy | `READY` | INK-CLOUD-002 |
| Container / ownership semantics | `READY` | INK-CLOUD-003 |
| Transform / bounds / coordinate contract | `READY` | INK-CLOUD-004 |
| Component / Instance identity and references | `READY` | INK-CLOUD-005 |
| Layout / Constraints structural schema | `BLOCKING GAP` | no first-class layout/constraints schema found in current main |
| Serialization / Migration / Persistence contract closure | `PARTIAL / BLOCKING CLOSURE` | native/local persistence is strong, but no explicit transport-neutral file/revision envelope or final extension compatibility contract exists |

## What is already structurally stable

The accepted pre-Cloud sequence has established:

- stable native object IDs;
- Page → Layer → Frame/Group → Object structural ownership;
- deterministic parent ownership;
- local/parent/world transform semantics;
- nested bounds and transform-root rules;
- History integration;
- structured SVG compatibility;
- Component definition/source-node/Instance identity;
- broken-reference and cycle diagnostics;
- native JSON retention;
- local verified storage and recovery;
- document fingerprint/snapshot integrity;
- no required FORMAT_VERSION change through INK-CLOUD-005.

## Remaining blocking gap 1 — Layout / Constraints schema

The Cloud gap audit identified responsive constraints / flex-grid semantics as a first-class editor-model gap.

Current main has workspace/layout-viewport concepts, but no first-class object/container layout schema.

Before Cloud persistence freezes project files, INK should establish the minimum versioned structural contract for future responsive layout.

Required before PRE_CLOUD_CORE_READY:

- versioned optional layout envelope;
- clear Frame/container authority;
- child participation/sizing metadata;
- deterministic constraint metadata;
- normalization/integrity rules;
- save/load preservation;
- explicit unknown/future field policy;
- no full layout UI required;
- no mature flex/grid editor required.

The goal is schema stability, not completion of Auto Layout.

## Remaining blocking gap 2 — Persistence / Revision contract closure

INK already has:

- structured native document JSON;
- FORMAT_VERSION;
- migration;
- stable serialization;
- fingerprints;
- snapshots;
- verified local storage envelopes;
- checkpoints/recovery;
- assetManifest.

Before first Cloud storage work, define a transport-neutral file envelope around the existing document, without implementing a backend.

Minimum contract should distinguish:

```text
file identity
revision identity / sequence
document formatVersion
feature / extension declarations
migration identifiers
document payload
asset/media references
saved/modified timestamps
integrity fingerprint
```

Local InkStore remains separate and authoritative for local/offline recovery.

The Cloud adapter later consumes this contract; the pre-Cloud task must not implement network transport, authentication, remote storage, permissions, or collaboration.

## Deferred capabilities that do NOT block Cloud start

These remain important editor work, but are not judged to require completion before Cloud persistence begins:

- persistent ruler/guides;
- scalable snapping index / worker;
- richer transform overlay/interaction;
- richer text/effects;
- mature Component UI;
- variants/component sets;
- nested Instances;
- full flex/grid UI and interaction;
- collaboration/presence;
- remote component libraries.

Reason:

Their future data can be added through versioned optional extensions if the final persistence/extension contract is established now.

## Runtime QA debt

Runtime/browser QA remains deferred under the current GitHub Actions quota constraint.

This is known validation debt, but current evidence does not indicate unknown document-format corruption.

The final pre-Cloud workpack must preserve this distinction and must not claim Runtime certification.

## Assessment decision

`PRE_CLOUD_CORE_READY = NO`

Exactly one final structural workpack is recommended:

**INK-CLOUD-006 — Layout / Constraints Schema + Persistence Contract Closure v0.1**

After INK-CLOUD-006 passes MR and is promoted:

1. MR performs one final compatibility/readiness audit.
2. If no structural blocker remains, set `PRE_CLOUD_CORE_READY`.
3. Explicitly remind the user that the pre-Cloud stage is complete.
4. Wait for separate user approval.
5. Only then issue the first actual Cloud implementation Work Order.
