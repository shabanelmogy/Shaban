# Vehicle QR Label editor access handoff

| Status | Owner verification pending |
|---|---|
| Implemented — source-only | yes |

The details editor consumes `vehicleQrLabelAccess` through an
owner-bound `AdministrativeDefinitionSession`. View reads the saved detail only
and renders the returned branch/tariff names without lookup requests. Create and
edit bootstrap Branch (existing cache plus watch) and TariffGroup (direct) only
while their editor requirement is available; non-admin branch choices are
limited to `CurrentBranchService.options().canTransact` and require a branch.

Read, lookup and confirmation decisions expire on access/context loss while the
mounted draft is hidden/inert and retained. Sent save/delete writes carry the
tracked HTTP context and latch success before the presentation fence. The page
loader owns routed detail, lookup and write progress; retained Branch refresh is
silent through the existing reference status owner. Its routed Retry/loading
scope was corrected to the shared page default during root integration.

No backend, DTO, service, route, registry, report, schema, or grant source was
modified. Source-only owner verification remains required for deny/regrant,
branch filtering/defaulting, lookup refresh, dirty discard and sent outcomes.

Source behavioural specifications cover saved view without lookups, dirty
discard cancellation/draft retention with regrant bootstrap, and sent create or
delete completion after revocation without navigation or replay. They are not
executed under the source-only boundary.

## Root integration — 2026-11-09

Root restored CommonModule for the template's retained ngClass, formatted the
editor, gated Edit/Delete presentation, and preserved original/requested branch
recording checks separately from form editability. Exit blocks pending reads,
writes and decisions while allowing a successful persisted outcome to leave.
Denied local discard still cancels on a subsequent actor-context change.

Interrupted read recovery is explicit, including quick revoke/regrant before
effects flush and recovery after a sent-write failure or cancelled decision.
Ordinary read errors remain explicit Retry. Saved Branch/TariffGroup labels
missing from current options are retained as disabled display options through
mergeSelectOptions; choice disablement uses source-validated Select.optionDisabled.
Default branch is applied once for a pristine create and cannot select a
nonrecordable branch for an ordinary user. The bilingual branch-denial message
and complete report/DTO/route integration remain root-owned.

The final source specs cover eight editor behaviours; templates are overridden
in these behavioural specs, so they do not claim rendered acceptance. Root's
47-file syntax/import check, metadata-only Select validation and scoped diff
checks succeeded; build/type checks/tests/runtime remain unexecuted.
