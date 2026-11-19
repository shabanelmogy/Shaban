# Trip Type access implementation handoff

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope | `SiGmaAngularFrontEnd/src/app/modules/Limousine/TripTypes/**` |

## Implemented mapping

| Surface / request | Requirement | Source outcome |
|---|---|---|
| Route/list/filter/paging/retry and list host | `TripType.View` | `AdministrativeDefinitionSession.watchList`, denied read cancellation, hidden/inert protected list and denied message |
| Create dialog and POST | `TripType.View` + `TripType.Create` | primary action, open handler, mounted dialog and tracked write context |
| View detail and `GET /TripType/GetById/{id}` | `TripType.View` | row action, editor access state and denied read cancellation |
| Edit dialog and PUT | `TripType.View` + `TripType.Update` | row action, edit transition, form access state and tracked write context |
| Delete and DELETE `/TripType?id={id}` | `TripType.View` + `TripType.Delete` | row action/handler, denial-cancelled confirmation and tracked write context |
| Tariff read | `TripType.View` + `TripType.GetTariffSettings` | row action, `GET /TripType/{id}/TariffSettings`, denial fence and mounted dialog access state |
| Tariff save | tariff read plus `TripType.UpdateTariffSettings` | read-only dialog for read-only users; fields and Save require the save grant; PUT carries the tracked write context; both tabs remain readable |

Numeric IDs now stay numeric from list row through the service request. Sent mutations do
not use `takeUntilDestroyed`; `trackWrite` prevents post-revocation publication. A successful
response sets `saveCompleted` before the publication fence, preventing a duplicate save even
when access is revoked while the request is in flight. Pending delete/discard confirmations
are cancelled on relevant denial; a later local close after denial is still allowed.

The mounted detail and tariff dialogs bind their policy owner to the actor that opened them.
An access/context withdrawal hides and inert-locks protected content without clearing its
loaded draft or cancelling a sent write; tariff multiselect body portals close immediately.
Regrant never reloads or overwrites that retained draft. Busy saves and pending discard
decisions remain navigation-blocking before the denied/local-discard branch is considered.

## Evidence read

- Frozen contract: `TRIP_TYPE_ACCESS_CONTRACT_FREEZE.md`.
- Speed 2026-10-28 Limousine `02-trip-types`, controllers C0940–C0942, and their declared
  list/create/edit/delete/settings flows. The matching 2026-10-27 catalog has no dedicated
  Trip Types explanation; the available Limo overview pages do not establish this dialog's
  permission or server rule.
- Sigma controller and service: `TripTypeController.cs` and `TripTypeService.cs`; they confirm
  numeric IDs and the independent tariff GET/PUT endpoints. Authorization remains enforced by
  the frozen server contract, not inferred from the legacy reference UI.

## User-guide handoff suggestion

In the Limousine guide, describe that the Trip Types list is visible with its view access;
the Add, Edit, Delete, and Tariff actions appear independently according to the current
session. State that tariff settings may open read-only when tariff-read is granted but
tariff-save is not, and that permission/context changes close off protected content without
discarding an already sent save.

## Source-only checks

- TypeScript parser check over the owned TripTypes `.ts` files: no parse diagnostics.
- Scoped `git diff --check`: clean.
- No build, tests, lint, browser, database, migration, commit, or push command was run.

Runtime authorization, route/menu visibility, request interceptor feedback, and the guide
publication remain owner verification items.
