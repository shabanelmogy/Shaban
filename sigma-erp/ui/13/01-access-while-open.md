<!-- Part of UI block 13: see ../13-modal-with-tabs.md. Same status and authority as the block. -->

### Access changes while a body-appended editor is open
Adopted editors pass the explicit `accessRequirement` to the existing
`EditorDialogComponent` (or its explicit `accessBlocked` state for a composed
policy). The owner hides/inerts its projected body and hint, renders the shared
access state and prevents mutation footer/primary commands while the requirement
is unsatisfied. Preserve the mounted draft and an already sent write's outcome;
do not destroy the editor or force navigation to enforce a later UI snapshot.
Keep Close/Cancel under the existing closeDisabled/dirty decision contract.

The access boundary wrapper uses `display:contents` so existing forms retain
their flex/scroll ownership, with `[hidden]` explicitly `display:none!important`.
Hiding the route container alone does not cover portals appended to `body`.
Audit the adopted surface's nested preview/dialog/select overlays too: close a
publisher select through its public owner API or give a nested editor the same
owner requirement plus its own permission. MockData's `mockDataAccessRequirement`
and route/generation checks follow this rule; generation completion after lost
access must release a no-preview form freeze without applying proposed values.
UI26 owns the session policy; backend checks remain authoritative.

For a mounted editor whose document can expire while the same actor still has
route access, pass MockData's optional `mockDataPublicationAllowed` callback and
`mockDataCancelled$` notifier (2026-11-10). The callback rechecks the parent
document lifetime before generation, response, preview and Apply. The notifier
cancels a pending replace confirmation or generation, closes a completed preview
and releases its form freeze without changing the original draft. It remains
subscribed after generation completes; replacing the notifier unsubscribes the
old one. Undefined inputs retain existing consumers. Permission grants alone
do not establish mounted document identity.
Each active generation also retains its access-denial watch after the finite
response completes, until Apply/Cancel releases it. Denial destroys the generated
candidates and closes the preview; a rapid regrant cannot revive that preview.
The parent notifier covers identity expiry even if the same grants remain valid.
