# INK Product Delivery Model v0.1

STATUS: `ACTIVE / PRODUCT DIRECTION`

## Principle

INK remains one product core with two delivery forms.

```text
                    INK CORE
                       │
          ┌────────────┴────────────┐
          │                         │
     Portable/Web               Cloud Editor
       INK.html                   INK Cloud
          │                         │
 offline/local use          browser/cloud workflow
 single-file target        shared cloud persistence
 portable archive          CHAT/GitHub collaboration
```

These are not separate products with separate drawing engines.

## 1. Portable / Web INK

The original project goal remains authoritative:

`single INK.html`

Purpose:
- portable;
- directly openable in a standard browser;
- local/offline capable where browser APIs permit;
- preserves INK drawing/vector/raster/natural-media/Recipe/AI-compatible core;
- suitable for archival, download and local use.

The existing three-piece delivery target remains:

```text
INK.html
WORKING_STATUS.md
SHA256SUMS.txt
```

## 2. INK Cloud Editor

INK Cloud Editor is the cloud delivery form created to provide a browser design workspace that can replace the project's dependence on Figma for CHAT-assisted collaborative design.

It may add:
- cloud file/revision storage;
- browser account/session layer;
- richer editor-domain UI;
- future collaboration capabilities;
- persistent project access for CHAT/GitHub workflows.

It must reuse the same INK document/editor core wherever practical.

## 3. Shared-core rule

Improvements made for Cloud Editor should improve portable INK when they are genuinely core editor capabilities.

Examples:
- frame/container model;
- nested hierarchy;
- transform/selection behavior;
- vector/path editing;
- snapping/guides;
- component/layout semantics;
- serialization/migration;
- performance improvements.

Cloud-only concerns must remain adapters/layers outside the portable core where possible.

Examples:
- authentication;
- remote file transport;
- server permissions;
- multiplayer presence;
- remote collaboration transport.

## 4. Penpot role

Penpot is an open-source architecture/interaction reference.

Its mature editor concepts may accelerate INK when they improve the existing INK core.

Penpot is not the product platform, and INK Cloud Editor is not defined as a Penpot fork.

Direct source reuse requires a separate explicit license/dependency/maintenance review.

## 5. Product architecture target

```text
UI / editor interaction
        ↓
shared INK editor domain
        ↓
shared INK document / vector / history / render / recipe core
        ↓
persistence adapters
   ├─ local/offline → portable INK.html
   └─ cloud/revision → INK Cloud Editor
```

## 6. Regression rule

Cloud development must not silently degrade the portable single-HTML target.

Portable packaging work must not block modular source development needed to keep the core maintainable.

Both delivery forms are validated separately, but share the same accepted core behavior.


## Cloud delivery start gate

INK Cloud Editor implementation is gated behind structural-core readiness.

The first Cloud work order requires all of the following:

- MR marks the relevant document-format / hierarchy / serialization core as sufficiently stable;
- unresolved structural migration risks are documented;
- deferred Runtime QA debt is recorded and does not hide unknown format corruption risk;
- the user is explicitly reminded that the pre-Cloud stage is complete;
- the user explicitly authorizes beginning Cloud implementation.

This gate prevents Cloud transport/storage work from freezing an unstable document structure.


## 7. Continuous shared-core evolution after Cloud start

Starting INK Cloud does **not** freeze or declare the shared INK core functionally complete.

The Cloud milestone means only that the document-format / structural foundation is stable enough for Cloud persistence and adapter work to begin.

After Cloud starts, INK continues to evolve through one shared core.

Core/editor capabilities that should continue to mature in the shared layer include, where applicable:

- Frame / container behavior;
- Component / Instance / Variant capabilities;
- Layout / Constraints / future flex-grid behavior;
- transform, bounds, selection and editor overlays;
- snapping, rulers and guides;
- vector/path editing;
- text and effects;
- History;
- serialization, migration and integrity;
- rendering and performance;
- reusable editor-domain UI logic.

The default rule is:

```text
If a capability is fundamentally an editor/document capability,
implement it in the shared INK core/editor domain first.

Portable/Web INK and INK Cloud then consume the same accepted capability.
```

Cloud-only capabilities remain adapter/service concerns where possible:

- authentication;
- remote file transport;
- remote revision storage;
- permissions;
- synchronization;
- presence;
- collaboration transport;
- remote service integration.

A Cloud requirement must not create a second drawing engine, document model, hierarchy, transform engine, History engine or renderer merely for the Cloud delivery form.

## 8. Portable target remains active during Cloud development

The long-term portable target remains a current, directly usable single `INK.html`.

Cloud development does not supersede this target.

The modular source tree is the development authority; the portable single-file artifact may be rebuilt at controlled packaging checkpoints from the same accepted shared core.

Therefore:

```text
shared core evolves continuously
        ↓
Portable/Web INK is refreshed at controlled package checkpoints
        +
INK Cloud consumes the same evolving core
```

Neither delivery form is allowed to become a permanently divergent product fork.


## 9. Current primary creative objective

The first INK Cloud product milestone is not a complete generic Cloud platform.

The current highest-priority creative loop is:

```text
Reference → Extract → Path → Edit → Compose → Repaint → CHAT Review → Revision
```

This loop is the product-level organizing principle for the next development sequence.

The Cloud workspace should grow only as required to make this loop strong, editable and repeatable.

Detailed plan:

`research/INK_CLOUD_CREATIVE_LOOP_DEVELOPMENT_PLAN_v0.1.md`


## 10. Static-hosting + browser-local execution is a hard product constraint

INK Cloud's human-AI collaboration core must be able to function under:

```text
static hosting
+
browser-local execution
```

This is a product architecture requirement, not merely a deployment preference.

The required creative collaboration loop must not depend on:

- GitHub Actions;
- a proprietary server API;
- a mandatory application backend;
- paid cloud compute;
- paid AI orchestration infrastructure;
- paid database/storage services;
- any remote service whose absence prevents the core editor/collaboration workflow from functioning.

The default architecture rule is:

```text
CORE CAPABILITY
= static-hostable assets
+ browser-local execution
+ local document/history/state
+ optional external adapters
```

Remote/server capabilities may exist only as optional enhancements.

Examples of optional enhancement layers:

- remote persistence and sync;
- account/session services;
- collaboration transport;
- server-side automation;
- hosted inference;
- GitHub Actions;
- paid cloud storage/compute;
- external model/API acceleration.

If an optional enhancement is unavailable, the INK Cloud core must degrade to a still-usable browser-local workflow rather than become non-functional.

Any future Work Order that introduces a mandatory server/Actions/paid-cloud dependency for the core human-AI collaboration loop must STOP for architecture review.


## Product display-version policy

User-authoritative rule:

```text
PORTABLE_BASE_VERSION = v0.1
CLOUD_WEB_BASE_VERSION = v0.1
```

Both delivery forms stay on base version `v0.1` until the USER explicitly authorizes a base-version change.

Supplementary text may follow the base version to identify delivery form, maturity, build context or release state. Examples:

```text
INK v0.1 · Portable
INK v0.1 · Web
INK v0.1 · Web Preview
INK v0.1 · Portable RC
```

The supplementary text is not a semantic version increment.

The following do **not** justify changing the base version by themselves:

- bug fixes;
- bounded fixes;
- UI corrections;
- refactors;
- QA closure;
- runtime fixes;
- deployment changes;
- adapter substitutions;
- documentation corrections;
- ordinary feature completion inside the same user-defined product stage.

Base-version changes require explicit USER decision. DEV and MR must not infer a version bump from the number of fixes, commits, Work Orders or internal milestones.

Historical engineering/source identities such as `INK v1.6.5 RC` remain valid only as identities for the imported historical baseline from which the current project evolved. They must not be presented as the current product display version after this policy takes effect.

This version policy is independent from document/schema `FORMAT_VERSION`. A product display version of `v0.1` does not imply changing `FORMAT_VERSION = 4`.
