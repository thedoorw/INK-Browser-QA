# INK UI Final Checklist — UR R16 Workstation Partial Closure v1.0

STATUS: `9_IDS_CLOSED / 1_DEFECT_REPRODUCED / 1_DIAGNOSTIC / CENTRAL_RUNTIME_NOT_RUN`

PROMOTED_PRODUCT: `c636354c29f0dfc5e379088de169d083e3df4ce5`
WORKFLOW_RUN: `36529681273`
EVIDENCE: `qa/evidence/ink-ui-final-checklist-issue92-workstation-c636354c29f0/workstation-interactions.json`

Focused result was `10 PASS / 2 FAIL`, but only nine valid item-specific PASS rows are closed here:
`D10 E03 E04 E05 E10 G06 J01 J02 J05`

`N03` is deliberately not closed from the first run because the attempted second-page creation failed, so its PASS was a same-page false-positive test condition.

## Reproduced defect

`K02`:
- Frame row correctly showed active selection.
- Clicking the child row changed canonical `app.selection` to the child object.
- The child Layers row did not receive active state afterward.
- This reproduces a real canvas/Layers visual-selection synchronization defect.

Bounded UI correction is authorized for K02. No Core/global/schema/FORMAT_VERSION change is authorized.

## Diagnostic hold

`N02`:
- shell Pages list remained at one row after the Add button click in the first harness;
- row visibility was also false.
A second diagnostic pass is required to distinguish panel/binding defect from harness timing/mount assumptions before any product mutation.

## Ledger
```text
TOTAL = 592
PASS = 497
FAIL = 94
N_A = 1
OPEN = 94
USER_ACCEPTANCE = 10 / PENDING
UI_COMPLETE = HOLD
```

Central Runtime was not run.
