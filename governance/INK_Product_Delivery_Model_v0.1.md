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
