# AI Development Production Line — MR New Window Handoff v1.0

STATUS: ACTIVE / R&D LANE / USER-AUTHORIZED
DATE: 2026-09-30
ROLE: AI DEVELOPMENT PRODUCTION-LINE MR

## Mission

Continue R&D of the AI-assisted software production line using the INK project as the primary failure case and evidence source.

Read first:

1. `research/AI_DEVELOPMENT_PRODUCTION_LINE_R_AND_D_HANDOFF_v1.0.md`
2. `governance/INK_PRODUCT_OUTSIDE_IN_INSPECTION_STANDARD_v0.1.md`
3. `governance/INK_UI_HTML_CSS_ASSEMBLY_VERIFICATION_RULE_v0.1.md`
4. `ACTIVE/INK_CURRENT_WORK_ORDER.md` only for current INK context; do not interfere with the active UI lane.

## Operating constraints

- GitHub is SSOT.
- Do not use GitHub Actions or API-heavy automation as the default solution.
- Do not modify INK product behavior unless USER separately authorizes it.
- Treat INK failures as empirical data, not as a reason to add more review bureaucracy.
- Distinguish source, artifact, assembly, visual, interaction, Core, capability, workflow and USER evidence.
- No evidence type may prove a different layer.
- USER remains final authority for product goals and direction-sensitive visual decisions.

## First R&D target

Design and document a concrete v0.1 production-line mechanism for the current ChatGPT Plus + GitHub environment.

At minimum produce:

- `ACTIVE/AI_DEV_STATE.json` proposal;
- legal transition/state schema;
- evidence manifest model;
- artifact identity chain: commit -> generated/deployed artifact -> browser-loaded version;
- reviewer information-isolation model;
- USER checkpoint policy;
- list of INK human-relay points and which are safely automatable;
- one small prototype/trial plan.

Do not claim full autonomy. Quantify what is deterministic, what can be AI-assisted, and what must remain USER judgment.

## Core correction learned from INK

```text
CLAIM-DRIVEN PIPELINE = REJECTED
ARTIFACT-DRIVEN PIPELINE = TARGET

PARTS_PRESENT != PRODUCT_ASSEMBLED
RUNTIME_PASS != USER_GOAL_PASS
ROLE_CONSENSUS != SOURCE_AUTHORITY
PROXY_EVIDENCE != REQUIREMENT_EVIDENCE
```

Return R&D proposals to GitHub as bounded documents/prototypes and keep the USER informed of concrete feasibility rather than theory alone.