# Provisions editor access handoff

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Slice | `/Provision/create`, `/Provision/view/:id`, `/Provision/edit/:id`, compatibility redirect and list exit guard |
| Runtime/build acceptance | Pending owner verification |
| Date | 2026-11-10 |

## Implemented contract

- Create uses `Provision.Create + Account.GetPostingSelect + Currency.GetFinancialNumberPolicy`; it does not acquire `Provision.View`.
- View uses `Provision.View` only and does not request editing lookups. Edit and PUT use the frozen edit requirement plus the loaded record's `canEdit === true`.
- Account posting select and financial-number policy are fresh required reads. Customer, Supplier and Job are independently grant-gated optional sources with finite bootstrap, owner watch, Retry, cancellation and selected-value retention.
- Route, mode, identifier and actor context own the mounted editor. Denial or actor replacement hides and makes the mounted editor inert without destroying its draft. Dirty, sent and committed state is not hydrated over during route reuse.
- Detail/lookup reads are cancellable and sequence/context guarded. Recovery waits for active work to finish and envelope failures remain explicit-Retry only.
- Sent POST/PUT uses `AdministrativeDefinitionSession.trackWrite`, the service `HttpContext` and `CAN_PRESENT_API_OUTCOME`. A successful envelope latches terminal committed state before identifier/publication checks, and cannot replay after revoke/regrant. Route exit does not cancel a dispatched write.
- Save and Print sends one write. It navigates to a View reread with `print=true` only when `Provision.View` is present; ordinary Save and create-only completion return through the allowed-route fallback without adding View.
- Print/autoprint, focus, row removal confirmation, discard and deferred navigation are route/actor/access cancellable. View may close while its detail read is pending. Accepted discard is terminal.
- The editor preserves the frozen schedule, monetary validation, payload and two-line minimum. No branch decision, schema, migration, backend or shared-owner change was made.
- The list route now calls the list owner's `canDeactivate()` for pending confirm/delete/export work, as coordinated with the list slice owner.

## Source specifications

Added `details-access.spec.ts` covering exact View/Create lookup behavior, optional label/id retention, revoke/regrant recovery, actor isolation, sent-write latching/no replay, create-only completion, and the one-write Save and Print handoff.

The existing smoke specification remains present. No build, test, type-check, lint, browser, database, migration, commit or deployment command was run under the source-only boundary.

## Translation and shared-owner impact

No new translation key is required. The denial panel reuses `authorization.currentAccess.denied` and existing general/provision keys. No registry, access constant, service, shared component or guide owner was modified in this slice.

## Pending owner acceptance

- Execute the normal Angular build/type-check/spec suite when runtime execution is authorized.
- Verify revoke/regrant, create-only Save, Save and Print reread, cached optional lookup refresh, and dirty-route reuse in the application.
- Reconcile this editor handoff with the list, transaction reader, registry and in-app guide slices before feature closure.

## Root integration follow-up — 2026-11-10

The independent editor audit identified terminal-save exit being blocked when
the accepted result could not be published or carried no usable identity. Root
moved the local exit latch beside committed success, before id/publication
checks. A mismatched PUT identity cannot open/print a different provision.
Added source-only cases cover these paths; the auditor rechecked the fix and
closed the finding without executing tests. Root added the EN/AR
`provisionScreen.errors.savedIdentityUnavailable` warning and updated the guide.
The earlier "no new translation" statement applies to the original worker
slice, not this integration follow-up. Branch ownership remains unresolved;
the parent module is not closed or promoted in the inventory.
