# Vehicle Type groups access handoff

| Status | Owner verification pending |
|---|---|
| Implemented — source-only | yes |

## Frozen mapping

| Surface | Requirement |
|---|---|
| Open/read vehicle-type groups | `VehicleType.View` + `VehicleType.GetGroups` |
| Change and save group order | read requirement + `VehicleType.UpdateGroupNo` |

The dialog consumes `administrativeDefinitionAccess.FleetVehicleType` and does
not add a branch, field, schema or hidden group-number update path.

## Source reconciliation

- A captured `AdministrativeDefinitionSession` exposes a read-only dialog to a
  groups reader, while all group number inputs, mock-data access and Save need
  `groupsSave`.
- Group reads are cancelled through `denied$`; a regrant retries only an
  unfinished, clean initial read. Failed reads remain explicit Retry work and
  dirty rows are never overwritten.
- The dialog keeps its dirty draft mounted and disables it on expiry. Dirty
  close uses a lazy confirmation cancelled on expiry/context change; cancelled
  confirmation cannot re-enable a denied form, while a new local discard stays
  possible.
- Save requires loaded, valid rows with positive integer identities. It sends
  `trackWrite(...).context`, is not teardown/denial-cancelled, and latches a
  successful result before publication is fenced by `mayPublish()`.

## Reference evidence

The frozen contract records Speed explanation `S053`, snapshot 2026-10-28
screen `08-fleet/02-vehicle-types`, and group controller `C1218`. They support
classification/group ordering but do not define Sigma permission keys or server
semantics. No Odoo clarification is needed for this frozen local contract.

## Verification and pending acceptance

Added unexecuted behavioral specs for reader-only save blocking, dirty draft
retention through revoke/cancelled discard, and regrant after interrupted read.
Source-only checks are TypeScript syntax parsing and scoped `git diff --check`.
Runtime owner acceptance remains required for read/revoke/regrant, local
discard, sent save outcome and server-side permission enforcement.
