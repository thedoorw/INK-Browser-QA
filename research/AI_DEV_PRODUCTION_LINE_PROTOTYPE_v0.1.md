# AI Development Production Line — Prototype v0.1

STATUS: `R&D PROTOTYPE / NO INK PRODUCT MUTATION`
DATE: 2026-09-30
BASELINE_MAIN: `f10acf3384e27becb6a5eb54e009077e0d7da7a0`

## 1. Prototype objective

Test one small production-line mechanism in the current ChatGPT Plus + GitHub environment without GitHub Actions and without changing INK product behavior.

The prototype tests whether GitHub can carry enough machine-readable state that a fresh reviewer can continue from an exact artifact without the USER manually relaying DEV/MR/UR history.

Target handoff:

```text
PLANNED
→ BUILDING
→ ARTIFACT_READY
→ fresh reviewer reads GitHub
→ REVIEWING
```

The first trial intentionally stops before product deployment. The full commit → artifact → deployed → browser-loaded identity model is defined now; deployment/browser legs remain `UNVERIFIED` unless the running product exposes an exact build identity.

## 2. Why this prototype is based on INK evidence

The INK history demonstrates several repeated failure modes:

- `ACTIVE/INK_CURRENT_WORK_ORDER.md` accumulated many historical `NEXT_OWNER` / gate blocks while also carrying a current owner. A human can interpret chronology; a machine state authority should expose exactly one current state and one next owner.
- `working/INK_UI_A_PHOTOSHOP_SHELL_PANELS_MR_REVIEW_v1.0.md` shows MR technical PASS → UR review → bounded revision → MR re-review → UR recheck → promotion. The logic was valid, but each transition depended on role-specific handoff awareness.
- `working/INK_UI_FINAL_RUNTIME_MR_REVIEW_v1.0.md` shows an exact Runtime PASS that still did not close the full UI program.
- `working/INK_UI_USER_ACCEPTANCE_REJECTION_R31_v1.0.md` shows USER rejection after technical/runtime closure, proving that technical evidence cannot substitute for visual/user evidence.
- `research/AI_DEVELOPMENT_PRODUCTION_LINE_R_AND_D_HANDOFF_v1.0.md` records a generated-entrypoint regression where source/template correctness did not guarantee generated/deployed/browser correctness.

The production-line correction is therefore state/evidence identity, not additional prose review ceremony.

## 3. Prototype files

```text
ACTIVE/AI_DEV_STATE.json
  one machine-readable current state authority

governance/AI_DEV_STATE_TRANSITIONS_v0.1.json
  legal transition authority

research/AI_DEV_EVIDENCE_MANIFEST_MODEL_v0.1.json
  evidence-layer and identity-chain model

engineering/ai-dev-production-line/validate_state.py
  zero-dependency local validator

research/ai-dev-production-line/prototype/trial-artifact.json
  harmless research-only artifact used for exact identity testing

research/ai-dev-production-line/prototype/evidence-manifest.json
  exact evidence for the trial artifact
```

No file under `product/` is touched.

## 4. AI_DEV_STATE.json architecture

Minimum top-level authority:

```text
schema / schema_version
program_id / task_id / mode
state
current_owner
next_owner
authority
identity
required_artifacts
required_evidence_layers
evidence_plan
reviewer_isolation
user_checkpoint
open_blockers
transition_history
allowed_transitions
```

Design rules:

1. one current state only;
2. one current owner only;
3. one next owner only;
4. `allowed_transitions` must exactly match the transition authority for the current state;
5. prose documents may explain state but cannot override this file;
6. every transition is written to `transition_history`;
7. artifact/deployment/browser verification is monotonic: a later leg cannot be VERIFIED while an earlier leg is unverified;
8. USER checkpoints are explicit data, not implied by a checklist paragraph.

## 5. Legal states and transitions

Primary path:

```text
PLANNED → BUILDING → ARTIFACT_READY → REVIEWING → ACCEPTED
```

Direction-sensitive path:

```text
REVIEWING → USER_CHECKPOINT → ACCEPTED
```

Revision path:

```text
REVIEWING / USER_CHECKPOINT → REVISE → BUILDING
```

Blocking path:

```text
any active state → BLOCKED → recorded resume state
```

Terminal states: `ACCEPTED`, `CANCELLED`.

No role may infer a transition because a task “looks complete.”

## 6. Evidence manifest

Every evidence record must identify:

```text
evidence_id
task_id
claim_id
layer
status
produced_by
locator
identity
proves
does_not_prove
```

Evidence layers:

```text
SOURCE / ARTIFACT / ASSEMBLY / VISUAL / INTERACTION / FUNCTION /
RENDER / CORE / CAPABILITY / WORKFLOW / USER
```

The critical rule is explicit negative scope. SOURCE evidence proves source content and explicitly does not prove VISUAL or USER acceptance. This prevents the INK pattern where capability/runtime/source evidence was promoted into product-completion evidence.

## 7. Commit → artifact → deployed → browser-loaded identity chain

Required chain:

```text
commit
  repo + exact 40-char SHA
↓
artifact
  path/id + SHA-256 + generated_from_commit
↓
deployment
  URL + deployment marker/id + artifact digest or build SHA
↓
browser-loaded
  loaded URL + reported build SHA/marker + loaded resource digest/capture
```

Rules:

- `deployment.status = VERIFIED` is illegal unless artifact identity is VERIFIED.
- `browser_loaded.status = VERIFIED` is illegal unless deployment identity is VERIFIED.
- “same branch”, “latest”, “main”, “refresh”, or “Runtime PASS” is not an identity.
- If the browser cannot report which build it loaded, the chain is `UNVERIFIED_IDENTITY`; it is not silently accepted.

Current INK already has a source-level `BUILD_ID` in its application/service-worker code, but the R&D lane should not claim a browser-loaded exact commit until a deployed/browser-visible marker is verified against the exact commit/artifact. Adding such a marker would be a later separately authorized product/deployment change, not part of this prototype.

## 8. Reviewer information isolation

### Builder
Receives USER/task intent, primary authority/reference, exact base SHA, scope/boundary, required artifacts/evidence. Does not receive future reviewer conclusions or suggested PASS wording.

### Source reviewer
Receives exact target SHA/diff, source contract and expected changed-file boundary. Does not receive builder narrative beyond required intent, visual reviewer result or USER acceptance result.

### Visual reviewer
Receives primary visual reference, exact deployed/browser-loaded artifact identity and visual claim list. Does not receive source PASS labels, capability census PASS or Runtime PASS narrative except as build identity.

### Interaction reviewer
Receives running exact artifact and interaction claim list. Does not receive source implementation claims as proof.

### USER
Receives actual product/artifact, unresolved visible differences and explicit decisions requiring USER authority.

Isolation strength:

```text
fresh ChatGPT window + GitHub-scoped packet = HARDER isolation
same chat with role-switch prompt = SOFT isolation only
```

The same chat should not certify itself as an independent reviewer for direction-sensitive claims.

## 9. USER checkpoint policy

USER checkpoint is required when any of these is true:

1. first representative visible vertical slice of a new direction/reference;
2. before scaling a direction-sensitive pattern broadly after only technical validation;
3. AI proposes changing primary reference authority, visible structure, or an N/A/adaptation decision;
4. a deployed/browser result contradicts upstream PASS evidence;
5. final acceptance requires subjective product/visual judgment;
6. the USER has previously rejected the same program direction.

USER checkpoint is not required for ordinary exact-SHA bookkeeping, file-presence checks, hash checks, legal-transition checks, or bounded implementation fixes that do not change accepted direction.

Only USER-origin evidence may close a required USER checkpoint.

## 10. INK human-relay / reminder / correction inventory

| # | Human relay / correction point | INK evidence pattern | v0.1 disposition |
|---|---|---|---|
| 1 | USER opens a new DEV/MR/UR window and repeats role/start instructions | `ACTIVE/INK_DEV_NEW_WINDOW_START.md`, handoff rules | **PARTIAL**: window still must be opened, but GitHub state replaces copied task history |
| 2 | Exact branch/base/HEAD handed from DEV to reviewer | UI-A review fingerprints | **DETERMINISTIC** |
| 3 | MR PASS tells UR that UR is next | `NEXT_OWNER = UR` | **DETERMINISTIC** |
| 4 | UR revision findings returned to DEV/MR | UI-A bounded revision | **DETERMINISTIC ROUTING** |
| 5 | Revised exact HEAD returned for MR re-review | UI-A-R1 | **DETERMINISTIC** |
| 6 | MR re-review returns visual items to UR | visual recheck gate | **DETERMINISTIC ROUTING** |
| 7 | Promotion/start-next-package gate remembered | UI-A → UI-B → UI-C | **DETERMINISTIC STATE** unless scope changes |
| 8 | Runtime debt/exact-SHA timing remembered | batched Runtime policy | **DETERMINISTIC DEBT TRACKING** |
| 9 | Review fingerprint becomes stale after HEAD change | handoff governance | **DETERMINISTIC SHA CHECK** |
| 10 | Generated entrypoint checked, not inferred from template | Branding/generated-entrypoint regression | **DETERMINISTIC ARTIFACT CHECK** |
| 11 | Runtime PASS not mistaken for full completion | R30 / completion correction | **DETERMINISTIC GATE RULE** |
| 12 | Full checklist/user gate not lost behind a newer PASS | premature UI_COMPLETE | **DETERMINISTIC REQUIRED-GATE CHECK** |
| 13 | Primary reference drift detected | PS captures displaced by derived spec | **AI-ASSISTED + USER CHECKPOINT** |
| 14 | N/A/adaptation cannot waive visible reference | R&D failure record | **USER CHECKPOINT** |
| 15 | USER rejects technically passing UI as visually wrong | R31 | **USER-ONLY JUDGMENT** |
| 16 | USER corrects theme/direction | current light-theme authority | **USER-ONLY DIRECTION** |
| 17 | USER notices duplicate/low-sense controls or visual mismatch missed by consensus | reassembly/detail dispatch | **AI-ASSISTED**, USER final |
| 18 | Prose current-work file carries multiple historical NEXT_OWNER blocks | `ACTIVE/INK_CURRENT_WORK_ORDER.md` | **DETERMINISTIC FIX**: one machine state authority |
| 19 | USER refreshes and trusts intended build loaded | direct-main UI loop | **NOT FULLY AUTOMATABLE YET** without browser-visible build identity |
| 20 | Decide product failure vs stale QA harness | R28/R29 | **AI-ASSISTED**; evidence constrains classification |

The production line should eliminate 2–12 and 18 first because they are state/bookkeeping problems, not product judgment.

## 11. What is actually automatable now — ChatGPT Plus + GitHub

### Can be automated now without GitHub Actions

- read/write one GitHub SSOT state file;
- validate legal state transitions;
- enforce one current owner / next owner;
- pin branch/base/target SHAs;
- compare changed-file boundaries and exact SHAs;
- record evidence manifests;
- reject evidence-layer mismatches;
- verify repository artifact digests;
- detect unresolved generated-template tokens in repository artifacts;
- record Runtime debt / required gates;
- generate the next reviewer packet from state;
- let a fresh chat recover without USER re-explaining history.

### Partially automatable

- reviewer isolation: strong only with a fresh window;
- visual/interaction review: AI-assisted, but exact browser access and identity must exist;
- deployment identity: possible only when deployment exposes exact marker/digest;
- next-role launch: GitHub can name the next role, but ordinary chat does not autonomously open another independent chat window.

### Must remain USER authority

- product direction;
- choice/change of primary visual reference;
- acceptance of visible deviations;
- subjective final visual/product acceptance;
- cancellation or reprioritization of product goals.

## 12. Prototype trial

Trial ID: `AI-DEV-TRIAL-STATE-HANDOFF-001`

1. Create research branch from exact current main.
2. Commit state authority, validator and harmless trial artifact.
3. Record the artifact-producing branch commit as `identity.target_sha` in a later state commit.
4. Record SHA-256 of the exact trial artifact.
5. Set state to `ARTIFACT_READY` with `next_owner = SOURCE_REVIEWER`.
6. Run the checked-in validator locally.
7. Stop. Do not alter INK product.

Success:

```text
A fresh reviewer can read ACTIVE/AI_DEV_STATE.json,
identify exact artifact and target commit,
see only legal next transitions,
and review without USER relaying previous chat narrative.
```

## 13. Next prototype

Only after this handoff trial passes:

```text
exact commit
→ generated artifact digest
→ deployment marker
→ browser-visible build marker
→ screenshot/interaction evidence pinned to that marker
```

That second prototype may require a tiny separately authorized deployment/build-identity surface. It must not be smuggled into INK product under this R&D task.
