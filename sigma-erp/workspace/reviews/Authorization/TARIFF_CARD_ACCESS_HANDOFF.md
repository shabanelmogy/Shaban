# Tariff Card access handoff

## Scope and frozen mapping

The implemented scope is `Rental/TariffCard`: its list, embedded editor,
delete flow and Tariff Card branch-settings launcher. The frozen mapping is:

| Surface | Requirement |
|---|---|
| List, filtering, paging, retry and details read | `TariffCard.View` |
| Create | `TariffCard.View` + `TariffCard.Create` |
| Edit | `TariffCard.View` + `TariffCard.Update` |
| Delete | `TariffCard.View` + `TariffCard.Delete` |
| Branch settings launch | Tariff Card view plus the shared `branchTariffRead` requirement |

`getEditorOptions()` remains unchanged and unrelated to the Tariff Card screen;
it remains available to the Rental Tariff consumer.

## Source reconciliation

- `AdministrativeDefinitionSession(tariffCardAccess)` owns list/editor access
  observation. List and detail reads use `denied$`; policy expiry clears the
  protected list and disables the mounted editor while retaining its draft.
- List actions validate current list membership and a positive integer identity
  immediately before opening, confirming and deleting.
- Delete, create and update capture `trackWrite(...).context`, are not tied to
  component destruction, and use `mayPublish()` before post-revocation UI
  effects. Successful editor writes mark `saveCompleted` before that fence.
- The editor closes body-appended date-picker portals when access is removed.
  Dirty-close confirmation remains available for explicit local discard after
  loss of access; its restoration cannot re-enable the form after revocation.
- Detail edit is not enabled until the matching detail response is loaded; a
  stale/mismatched response does not hydrate the form.
- The shared branch settings component receives the parent view requirement;
  it stays mounted outside the hidden list host to retain its own state.

## Reference evidence and guide handoff

Read Speed analysis snapshot `2026-10-28`, Rental workflow mapping: Tariff
Cards at `/crs/tariffCards`, controller `C1129` (the contract also records
`C1128–C1129`). It supports the list/view/create/edit/delete screen shape but
does not establish extra Sigma permission, server, accounting or branch-write
rules. The available original 2026-10-27 material supplied menu/navigation
evidence only; no additional functional behavior was adopted. No Odoo source
was needed because this authorization contract resolves the scoped behavior.

The existing Tariff Card in-app guide should describe that visibility and reads
need View, while Create, Edit and Delete are independently action-gated; branch
settings also require their shared branch read/write grants. This task does not
change that guide.

## Verification and pending owner acceptance

Source-only checks completed: TypeScript syntax parsing for the edited Tariff
Card files and scoped `git diff --check`. No build, tests, lint, browser,
database, migration, commit or deployment command was run. Owner runtime
acceptance remains required for revocation during list/detail reads, dirty
discard, sent writes, body portals and branch-settings access.
