# MOVEMENTS discard-freeze contract

| Status | Owner verification pending |
|---|---|
| Frozen | yes |

## Frozen handoff

The six movement write editors keep their existing forms, payloads, routes and
identity/session gates. A pending discard decision is created inside `defer`,
rechecks visibility, captured identity and busy state, freezes controls with
`freezeFormState`, and restores the prior control state only for the same
unfinished visible editor. Workshop Movement additionally gates restoration on
upload and cleanup idleness. Check Card applies the same rule to its pending
supporting-document upload controls.

The existing Logs Check Card tabs, read adapters, atomic upload endpoint and
cleanup ownership remain unchanged. This handoff does not introduce new
business actions or backend contracts.

## Compiler-feedback repair handoff — 2026-10-09

Owner supplies six TS2367 errors in NRM, Workshop and WorkshopMovement deferred
guards and five TS2741 errors in movements-guide topics. Frozen repair: remove
only the redundant captured-mode comparisons with view; the early View return
already narrows captured mode to create/edit, and this.mode === mode still
rechecks the live mode. Keep visibility, session, ID, busy, dirty and cleanup
guards. Add notes: [] to the five guide topics missing the required property;
keep GuideTopic.notes required and preserve authored EN/AR content/routes.

| Concern | Owning block | Actual reference/source | Shared owner | Target match |
|---|---|---|---|---|
| Discard identity | UI10 | collectionMovement details.canDeactivate; affected guards' early View returns and captured mode checks | freezeFormState / ConfirmationDialogService | Same active editor and cancellation behavior, without impossible literal comparisons |
| Typed guide content | Master7 / UI1 | UserGuide/models/user-guide.model.ts GuideTopic.notes; first existing Movements topic | Existing typed guide reader | All six existing topics supply notes; no optional-property/cast workaround |

This is a compiler-feedback follow-up, not a new business/API contract or a build
authorization. Source-only verification and prohibited-command boundaries remain.

