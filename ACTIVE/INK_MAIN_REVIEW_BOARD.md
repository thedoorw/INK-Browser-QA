# INK MAIN REVIEW BOARD

STATUS: `ACTIVE`

| Field | Value |
|---|---|
| MR_ROLE | `MAIN REVIEW` |
| CURRENT_STAGE | `INK CLOUD EDITOR — ARCHITECTURE AUDIT` |
| CURRENT_TASK_ID | `INK-CLOUD-001` |
| DEV_AUTHORIZATION | `ANALYSIS_ONLY` |
| PRODUCT_MUTATION | `PROHIBITED` |
| PACKAGE_UPDATE | `PROHIBITED` |
| GATE | `MR_REVIEW_REQUIRED_AFTER_HANDOFF` |
| DEV_WORK_BRANCH | `work/ink-cloud-001` |

## Direction fixed by MR

INK remains the product core.

Penpot is used as an open-source architecture / interaction reference to accelerate INK, not as the platform to operate and not as an automatic fork target.

The intended operating model is:

```text
CHAT / MR / DEV
        ↕
GitHub SSOT
        ↕
INK Cloud Editor
        ↕
standard desktop/mobile browser
```

Do not base the product on ChatGPT Desktop Browser, ChatGPT Work Cloud Browser, or persistent Figma tool attachment.

## Current Work Order — INK-CLOUD-001

### Title

`INK Cloud Editor — INK/Penpot Architecture Gap Audit v0.1`

### Objective

Determine how far the existing INK codebase can be evolved into the project's own cloud vector editor before any Runtime refactor begins.

The audit must identify what INK already has, what should be extended, what is genuinely missing, and which Penpot ideas are worth studying.

### Required baseline

DEV must read:

1. `README.md`
2. `AGENTS.md`
3. `governance/INK_MR_DEV_GOVERNANCE_v0.1.md`
4. `governance/INK_Product_Boundary_v0.1.md`
5. `ACTIVE/INK_MAIN_REVIEW_BOARD.md`
6. `ACTIVE/INK_DEV_PROGRESS.md`
7. `product/source/index.html`
8. only the relevant files under `product/source/src/` needed to prove findings

For Penpot, prefer its official GitHub source and official developer documentation.

### Audit dimensions

Build a source-grounded matrix covering at least:

1. document / page / object model
2. vector shape primitives
3. path / Bézier / node editing
4. selection / multi-selection / bounding box
5. move / scale / rotate transforms
6. layers / groups / nested hierarchy
7. fill / stroke / effects / text properties
8. align / distribute / snapping
9. rulers / guides / smart guides
10. frames / reusable components / instances
11. constraints / responsive layout / flex-grid style layout
12. undo / redo / transaction history
13. SVG import / export and structured serialization
14. local storage / recovery
15. cloud file adapter requirements
16. render / viewport / overlay architecture
17. geometry indexing / worker / performance strategy
18. collaboration requirements — explicitly DEFER unless needed for architecture compatibility
19. AI / Recipe / procedural capabilities that are uniquely valuable in INK and must not regress

### Classification

For every dimension assign one:

- `RETAIN`
- `EXTEND`
- `ADD`
- `DEFER`
- `DO_NOT_IMPORT`

Every classification must cite concrete INK paths and, where relevant, concrete Penpot source/docs references.

### Required conclusions

The audit must answer:

1. Can INK remain the architectural core?
2. Which 5–10 editor capabilities are the highest-value gaps?
3. Which Penpot concepts can be reimplemented cleanly in INK's current JavaScript architecture?
4. Which Penpot implementation details should not be imported because of stack, complexity, licensing, or maintenance cost?
5. What is the smallest safe first implementation slice after this audit?
6. What existing INK capabilities are regression-protected for all future work?

### Mandatory DEV branch

DEV must use:

`work/ink-cloud-001`

Requirements:
- create/use this branch from current `main`;
- commit architecture-audit progress at meaningful checkpoints;
- keep `ACTIVE/INK_DEV_PROGRESS.md` updated on this branch;
- include latest commit SHA in each progress entry;
- do not merge to `main`;
- MR will inspect branch history and diff before authorizing any next step.

### Deliverables

Create:

`research/INK_CLOUD_EDITOR_PENPOT_GAP_AUDIT_v0.1.md`

Update:

`ACTIVE/INK_DEV_PROGRESS.md`

Do not modify Runtime code in this task.

### Completion gate

When deliverables are complete:

```text
TASK_STATUS = DEV_HANDOFF
NEXT_ACTION = MR_REVIEW_REQUIRED
PRODUCT_SOURCE_MUTATION = 0
PACKAGE_MUTATION = 0
STOP
```

DEV must STOP. No second task begins until MR updates this board.
