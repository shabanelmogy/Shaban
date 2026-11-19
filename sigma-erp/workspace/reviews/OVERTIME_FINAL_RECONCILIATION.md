| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Overtime final reconciliation

## Changed files

- Angular Overtime list, routed editor, routes, typed models and service under `SiGmaAngularFrontEnd/src/app/modules/HRM/Overtimes/Overtime`.
- English and Arabic Overtime translations.
- Existing HRM user-guide content (`src/app/modules/UserGuide/content/hrm-guide.ts`) with the Overtime topic.
- Backend Overtime list projection/filter service, controller list path, mapper and slim nested list staff VM.

## Reconciliation

| Contract/path | Producer | Consumer | Result |
|---|---|---|---|
| Date range | Angular `OvertimeListQuery.filters` | Backend `OvertimeService.ApplyListFilters` | Matched (`fromDate`/`toDate`, inclusive range) |
| Paging/count | Backend base `GetManyAsync` | `app-data-table` `totalRecords`/lazy event | Matched |
| Grid fields | `OvertimeListVM` | `OvertimeListRow` and `columns` | Matched: staff, month, code, designation, normal/holiday/total hours, rate, amount |
| Write payload | `OvertimeCreateDTO` | Backend Add/Update VMs | Matched for editable fields; audit/tenant/derived fields removed |
| Process action | Existing `/StaffOverTime` route | Overtime list primary action | Matched to supported source workflow |
| Import/batch columns | Screenshots only | No current producer | Missing/blocked; no invented endpoint |
| Failure handling | `apiErrorMessage`, `error` callbacks, inline state | List/editor/staff lookup/delete/save | Implemented source-side |
| Route/dirty state | Explicit create/view/edit modes and `CanDeactivate` | Details component | Matched |

## Decisions

- Canonical UI is the shared list/editor shell; screenshot styling was not copied.
- Source-supported CRUD columns replace screenshot-only From/To/Status/Approved By fields because the backend has no producer for those values.
- Process Overtime opens the existing staff/day editor. A batch month-only process and Import remain blocked pending a frozen API/file contract.
- No database schema change was introduced; Add-Migration is not required for this source change.
- AutoMapper uses a dedicated slim `OvertimeStaffListVM` for list rows and keeps `StaffDetailVM` for detail reads.
- Total hours/rate/amount remain server-owned; the client no longer sends audit or derived fields.

## Verification

Performed: packet `-Check`, targeted source reads, repository status/diff review, stale `ms-lib`/`table-list` search in the Overtime folder, and `git diff --check` (only line-ending notices remain). Not run: build, tests, lint, migration, database, browser, runtime or external data actions, per project instructions.

## Owner manual checks

1. Open `/Overtime`, confirm the current-month range, Search, paging, empty/error state and RTL/dark rendering.
2. Verify the list GET sends `Filters[fromDate]`, `Filters[toDate]`, `pageNo`, `pageSize` and receives exact `totalCount`.
3. Open View/Edit/Create; confirm month hydration, staff lookup failure/retry visibility, required validation and dirty-route confirmation.
4. Edit a row and verify the request excludes `subscriptionId`, audit fields, `totalOTHours`, `overtimeRate` and `overtimeAmount`.
5. Press Process Overtime and verify `/StaffOverTime` loads the supported month/staff workflow.
6. Decide and freeze the missing batch Process/Import API before implementing those screenshot actions.

## Suggested commit messages

- Frontend: `refactor(hrm): modernize overtime list and editor`
- Backend: `fix(hrm): add paged overtime date filtering and scoped list projection`

## Prohibited commands

No build, test, lint, migration, database, browser automation, Graphify, Sigma MCP, commit or push command was run.

## Superseding continuation — 2026-10-10

The earlier reconciliation above is historical and no longer describes the current result: the owner authorized completion of missing business, and the changed Frozen handoff adds monthly history/process, validated new-only CSV import, shared server calculations and EF schema changes. Add-Migration AddOvertimeProcessingAndDayUniqueness is now required. Current reconciliation, final source evidence, file ownership, migration/data preflight, guide, verification boundaries and manual acceptance are recorded together in OVERTIME_FEATURE_REVIEW.md → Current reconciliation — 2026-10-10 continuation. Overall status remains Implemented — source-only; owner verification pending yes.
