# INK AI Command and CHAT Integration

`window.INK_AI` is the public browser adapter. AI clients negotiate versions and capabilities before creating a Plan. Formal write flow is:

`Command → validation → permission → canonical operation → Recipe Draft → isolated Preview → explicit approval → execute → Difference → Audit → rollback`

Default permission is `PROPOSE`. `EXECUTE` cannot directly mutate the document: it must reference a valid approval whose base document hash still matches. Preview branches do not enter formal history.

The local interfaces are:

- `manifest`, `stateReader`, `semantics`;
- `textToPlan`, `imageToPlan`, `documentToPlan`, `planFromSteps`, `editPlan`;
- `preview`, `approve`, `execute`, `rollback`, `audit`;
- `adapter`, `localClient`, `testClient`, `negotiate`.

The test clients validate transport, determinism, permission and rollback. They are not evidence of mature language or image semantics.

