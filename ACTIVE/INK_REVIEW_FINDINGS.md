# INK REVIEW FINDINGS

STATUS: `MR_REVISE`

TASK: `INK-CLOUD-004`

Reviewed fingerprint:

```text
BRANCH work/ink-cloud-004
HEAD   479bcca83e0c375592bff6542115b971e88002c7
```

## MR decision

`MR_REVISE / BOUNDED_FIX_ONLY`

The Transform / Bounds / Coordinate System foundation is substantially accepted at source level. One interaction/history safety defect must be corrected before MR PASS.

## Source findings accepted

- explicit local / parent / world / screen coordinate contract is present;
- affine world/local helpers and safe inversion helpers are present;
- same-Layer reparent computes target-local geometry before detach;
- cross-Layer reparent remains rejected;
- Frame bounds are explicit width/height geometry;
- Group bounds remain child-derived;
- selection bounds use transform-root collapse;
- Frame geometry resize is separated from matrix transform;
- batch object transforms preflight before applying mutations;
- singular ordinary-object hit-test and eraser paths avoid identity-inverse fallback;
- derived world/selection/container bounds are not promoted to serialized authority;
- `FORMAT_VERSION = 4` remains unchanged;
- excluded Cloud/component/layout/package work was not introduced.

## Required revision

### Singular editor interaction can leave History pending

In the current `beginSelection()` stroke-node path:

1. `history.begin(...)` is called;
2. only afterward is `Matrix.tryInvert(...)` checked;
3. if the matrix is non-invertible, the function returns without `history.cancel()`;
4. no interaction is installed, so pointer-up does not clear that pending transaction.

This violates the Work Order requirement that non-invertible transform/edit cases fail safely without corrupting editor/history state.

The stroke-handle and selection-transform interaction paths should be hardened under the same rule so inverse/preflight rejection cannot leave a pending History transaction or partially active interaction.

## Required bounded fix

1. Preflight required matrix invertibility before `history.begin()` for stroke node/handle editing where world→local conversion is required.
2. Preflight transform-root parent invertibility before starting interactive move/scale/rotate, or provide an equivalent bounded guard that cancels/restores History deterministically on rejection.
3. On rejection:
   - no object geometry mutation;
   - no hierarchy mutation;
   - no pending History transaction;
   - no active interaction/draft left behind;
   - clear user-facing failure result/toast is acceptable.
4. Add bounded regression evidence for the rejected singular cases, including History pending state.
5. Update DEV progress and implementation report, then hand off again.

Do not redesign History or the transform UI.

## Runtime QA

`RUNTIME_QA_DEFERRED` remains unchanged.

Hosted GitHub Actions are unavailable. This revision must be source/unit bounded and must not require Runtime certification.

## Gate

```text
INK-CLOUD-004
→ MR_REVISE
→ DEV bounded singular/history guard
→ DEV_HANDOFF
→ MR_REVIEW_REQUIRED
```

No main merge, package update, version promotion, next task, or Cloud implementation is authorized.
