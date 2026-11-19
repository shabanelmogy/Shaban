# Cost Centers — backend implementation notes

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-14 |
| Contract | `COST_CENTERS_FRONTEND_BACKEND_CONTRACT_FREEZE.md` (Frozen) |

## Scope and authority

Implemented the bounded CostCenter backend slice under Master blocks 4, 5 and 7; backend blocks 3, 4, 5, 7, 8, 10, 12 and 13; and generated Phase 01–04 packets. The root review recorded that the recipe generator `-Check` passed on 2026-10-14, so the generated packets were used without regeneration. Pattern 1 normal entity applies. `BranchService` is the approved reference for the generic-service override boundary and metadata-aware delete; the existing `MaterializeListAsync` implementations that call `ProjectTo<TListVM>` are the projection reference.

No frontend, translation, entity, EF configuration, migration, model snapshot, shared base, controller, interface, or select-contract file was changed in this backend slice.

## Decisions and implementation evidence

| Concern | Frozen decision | Source implementation and evidence |
|---|---|---|
| List contract | `Id`, `Name`, `Code`, `CostCenterGroupName`, `IsActive` only | `CostCenterListVM` is an explicit lean DTO with exactly those five properties. This matches the frozen grid fields/actions and avoids the unrelated fields inherited from `ListBaseVmWithName`. |
| List navigation label | Materialize through `ProjectTo` | `CostCenterService.MaterializeListAsync` projects `IQueryable<CostCenter>` through the AutoMapper configuration. `CostCenterProfiler` maps nullable `CostCenterGroup.Name` to `CostCenterGroupName`. Generic filtering, count, paging and stable ordering remain inherited. |
| Detail contract | Lean `Id`, `Name`, `Code`, `CostCenterGroupId`, `CostCenterGroupName` | `CostCenterDetailVM` now inherits `LeanDetailBaseVm` and declares only the four editor fields. The base `DetailWithNavigationsAsync` already uses `GetByIdDeepAsync`, so `GetByWithNavigationsId/{id}` loads the group navigation and the profile supplies its label; no detail override was needed. |
| Embedded-consumer compatibility | Narrow only when existing consumers do not use removed members | Symbol audit found embeddings in Asset DTOs, ContactGroupFullListVM, CostCenterGroup detail/list DTOs, and OpeningBalanceAccount detail/full-list DTOs. Frontend audit found Asset consumes `costCenter.name`; the CostCenter editor consumes the five frozen detail properties; lookup consumers use `GetSelect`/`GetSelectByGroup`. No inspected consumer reads the removed tenant/audit/GUID/delete/valid/change/active detail members or the removed nested `CostCenterGroup` object. The lean contract is compatible with the observed consumers. |
| Update validation | Required `Name`, max 250; optional unbounded `Code` | `CostCenterUpdateVM` now derives from `UpdateBaseVm`, declares `[Required][MaxLength(250)] Name`, and retains nullable `Code` and `CostCenterGroupId`. This matches `CostCenterAddVM` and avoids the inherited legacy max 50. No code cap or uniqueness rule was added. |
| Mapping | Four explicit one-way maps | Profile contains Add→entity, Update→entity, entity→detail and entity→list only. Both read maps flatten the nullable group label. There is no `ReverseMap` and no `Ignore`. |
| Delete | Metadata-aware dependency check | `CostCenterService.RemoveAsync` delegates to `RemoveWithChildrenAsync(id, CancellationToken.None)` with no owned children, matching `BranchService`. |
| Existing operations | Preserve inherited CRUD/action and feature lookup | `GetSelectByGroupAsync` is unchanged. `GetSelect`, Add, Update, list/count/paging/filter/order, detail, and activate/deactivate remain inherited. No transaction, calculation, controller endpoint, permission or duplicate rule was introduced. |

## Override inventory

- `MaterializeListAsync`: required because the list exposes a navigation label and must project it in SQL.
- `RemoveAsync`: required because the generic `base.RemoveAsync` does not perform metadata-aware inbound-reference checks.
- Detail override: not added; the generic deep-navigation read supplies the mapped label.
- Add, Update, list, action, select and controller overrides: not added.

## Source-only verification

- Reviewed the complete scoped diff from repository root `F:/My Work/Sigma/SigmaBackend` for the five owned CostCenter source files.
- Checked the scoped diff for whitespace errors and searched directly related backend/frontend symbols and embedded `CostCenterDetailVM` consumers.
- Confirmed the profile has exactly four one-way maps, list materialization uses `ProjectTo`, detail label loading works through the inherited deep-navigation route, and delete calls `RemoveWithChildrenAsync`.
- Confirmed `GetSelectByGroupAsync` and the generic inherited operation surface were not changed.
- No merge markers or stale CostCenterGroup DTO imports remain in the changed DTO files.

Build, tests, lint, runtime/API replay, database verification and browser verification were not run under the source-only boundary. Owner verification should confirm AutoMapper configuration/startup, list group labels, `GetByWithNavigationsId/{id}` group labels, update names between 51 and 250 characters, and blocked deletion of a referenced cost center.

## Risks and handoff

The shared `CostCenterDetailVM` type remains embedded in several legacy response shapes. The inspected application consumers do not rely on the removed heavy-base members, but an external client outside the repositories could observe the narrower JSON response. Runtime and external-client compatibility therefore remain owner-verification items.

No schema change is present and no migration is required. Suggested backend commit message: `refactor cost center API contracts`.

No subagent was used inside this bounded backend workstream; it was already delegated with exclusive file ownership. Prohibited commands were not run.
