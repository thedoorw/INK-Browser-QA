# INK Application Health Gate v0.1

STATUS: `ACTIVE`

## Purpose

Candidate closure must prove application health before any three-piece release package is marked usable or certified.

## Gate order

`BASELINE → PACKAGE → SYNTAX → CORE → RUNTIME → INTERACTION → PERSISTENCE → REGRESSION → RELEASE`

A later gate cannot replace an earlier failed gate. A visually normal page is not sufficient evidence for Runtime or Persistence health.

## BASELINE

Required:
- authoritative import identity remains traceable;
- working branch has one declared parent baseline;
- preserved `main` source/history is not silently rewritten;
- Candidate source and final artifact SHA256 are recorded.

## PACKAGE / STATIC

Required:
- all JavaScript parses;
- all JSON / manifest files parse;
- TypeScript typecheck passes where configured;
- build step passes;
- no missing runtime dependency referenced by the Candidate;
- single-file Candidate has no undeclared external runtime file dependency.

## CORE

Protected lifecycle surfaces:
- startup controller;
- input routing / stylus path;
- document state and migration;
- history / undo / redo;
- render pipeline;
- layer/object lifecycle;
- persistence adapter;
- export pipeline.

Blocking debt includes duplicate controllers, uncontrolled wrapper stacks, silent state mutation, or optional capabilities that prevent general Runtime startup.

## RUNTIME

A real Chromium/Chrome run must verify:
- page loads;
- initialization completes;
- page exception count = 0;
- critical console error count = 0;
- canvas exists and is usable;
- core API exists;
- no startup / observer / microtask loop.

If the execution environment itself blocks local navigation or Chromium, record exactly:

`LOCAL_RUNTIME = BLOCKED_BY_ENVIRONMENT`

This permits bounded static/source work but does not satisfy Candidate Runtime PASS.

## INTERACTION

Minimum smoke:
- drawing/stroke input;
- select / transform;
- undo / redo;
- layer add / duplicate / reorder / delete;
- zoom / pan;
- vector and raster basic paths;
- open / save / export entry points;
- relevant AI / Recipe capability only when included in Candidate boundary.

## PERSISTENCE

Required where claimed:
- save → reload;
- document schema migration;
- export → import round trip;
- safe behavior on corrupted/unsupported document;
- explicit failure state when persistence write fails.

## REGRESSION

Required:
- non-target core behaviors unchanged;
- no unexplained UI layout/control loss;
- no feature marked PASS solely from historical evidence belonging to another runtime SHA.

## RELEASE

A Candidate may be packaged only when:
- all blocking gates PASS;
- known limitations are explicit;
- exact tested source/artifact SHA is recorded;
- package contains the declared deliverables;
- extracted package re-verifies against SHA256 manifest.

Target release package:

```text
INK.html
WORKING_STATUS.md
SHA256SUMS.txt
```

`BOUNDARY_PENDING`, `BLOCKED_BY_ENVIRONMENT`, `UNTESTED`, or stale-version evidence cannot be relabeled as PASS.
