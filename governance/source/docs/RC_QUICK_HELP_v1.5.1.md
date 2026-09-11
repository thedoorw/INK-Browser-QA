# INK v1.5.1 RC Quick Help

INK starts in Standard Mode: the AI Panel is closed and no model connection is created. Open the AI tab only when you want assisted planning.

For an external model, select AI-assisted Mode, enter an HTTPS Endpoint, Model, Authentication Method and Credential Alias, then store the credential for this session. Review the transmission preview before each external request. Credentials are not stored in `.ink` files or Audit Logs.

Use Local-only Mode for Manual JSON and Deterministic validation without network. Safe Mode disables external models and scripts. Validation Mode is intended for the separate Validation Package.

Every AI change follows Plan → Preview → explicit Approval → Recipe execution. If the document changes after Preview, the Preview becomes `STALE` and must be rebuilt. Destructive operations require additional confirmation.

External model execution remains `EXTERNAL CREDENTIAL REQUIRED` until a user supplies an endpoint and session credential. Physical stylus validation is `DEFERRED`; artistic quality is `USER VISUAL VALIDATION REQUIRED`.
