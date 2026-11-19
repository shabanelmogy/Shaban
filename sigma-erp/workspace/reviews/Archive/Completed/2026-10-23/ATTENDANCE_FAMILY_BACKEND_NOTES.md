# Attendance family backend implementation — 2026-10-10

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

## Ownership and authority

Bounded backend worker, inherited model; root owns integration, canonical evidence classification, folder relocation, guide and final handoff. Read AGENTS, required sigma-screen-refactor skill backend sections, applicable BE3–5/7–9/13/18/19 and Phases01–04/06. Root reports initial recipe check passed all packets. Approved reference read: BranchService and four-map Branch/Shift conventions; shared Service hook/write/delete implementations inspected. Freeze: ATTENDANCE_FAMILY_DOMAIN_API_CONTRACT_FREEZE.md including root-authorized monthFilter amendment. No builds, tests, lint, typecheck, database, browser, migrations, commits, pushes or deployment.

## Files changed and preserved

- SiGma.Business/Services/ShiftService.cs
- SiGma.Business/Services/StaffServices/StaffTimesheetService.cs
- SiGma.ViewModels/ViewModels/Shift/ShiftAddVm.cs
- SiGma.ViewModels/ViewModels/Shift/ShiftUpdateVm.cs
- SiGma.ViewModels/ViewModels/Shift/ShiftDetailVm.cs
- SiGma.ViewModels/ViewModels/Shift/ShiftListVm.cs
- Deleted ShiftFullListVm.cs: exact symbol search showed declaration only.
- SiGma.ViewModels/ViewModels/StaffTimesheet/StaffTimesheetListVm.cs
- SiGma.Helpers/Localization/Shared/GeneralMessage.resx and GeneralMessage.ar-SA.resx: only five new feature entries per resource; all pre-existing modifications preserved.

ShiftProfiler already has four explicit one-way convention maps and needs no change. StaffTimesheetProfiler already flattens StaffName/ShiftName with null fallbacks; deleting unused list IDs requires no map change. Controller, interfaces, entities, EF configuration, shared base, migrations and snapshots untouched.

## Source contract reconciliation

| Concern | Actual implementation and evidence |
|---|---|
| Shift grid / ListVM | Name, DutyHours, CreatedAt, combined StartTime/EndTime; Id only identity. ShiftListVM exactly Id, nullable Name/CreatedAt, StartTime, EndTime, DutyHours. Nullable read values preserve actual EntityBaseWithName/EntityBase source. |
| Shift writes/detail | AddBaseVm / UpdateBaseVm Id only, explicit required Name max250, two bools, two TimeSpan clocks, signed Int32 DutyHours/Weekdays; lean detail Id and exactly editable values. 250 is existing AddBaseVmWithName API bound; entity/config do not explicitly set a Name length. Old Update base bound50 corrected to250. |
| Shift list boundaries | Generic ListQuery tenant/live predicate, authoritative count/paging/max100/sort/Id tie-breaker retained; SearchColumns reads trimmed name; dateFrom >= CreatedAt day, dateTo < next day, safe MaxValue final-day branch. Scalar ProjectTo selects lean columns. No GetMany replacement. |
| Shift writes | Trim name, clock transport 0<=value<24h, repository tenant/live name duplicate checks, self exclusion Update, missing/foreign/deleted ID indistinguishable404; delegate base map/validation/persistence. No duty-hour derivation, day mask, overnight or time ordering business rule. |
| Shift delete | RemoveWithChildrenAsync without owned navigation, 404/live/tenant root, EF inbound Staff/StaffTimesheet/Attendance usage blocking, localized generic RecordInUse, field-only soft delete one save. |
| Timesheet grid / ListVM | StaffName, Code, Designation, ShiftName, Date, WorkingHours, OvertimeHours, Month; plus Id only. Removed StaffId/ShiftId. Existing ProjectTo handles flattened nullable names. |
| Timesheet filter | Reads monthFilter through shared GetMonthStart; >= first day, <next month, 9999-12 uses <=MaxValue; generic staffId equality. Key monthFilter avoids the prior generic Month equality collision; root froze amendment before edit. |
| Timesheet writes | Existing Add/Update full contract, date sentinel checks, generic FK validation and delete remain untouched; no batch/absence/from/to/payroll invention. |
| Localization | ShiftNameExists, ShiftNotFound, ShiftClockInvalid, EntityAttendance, EntityStaffTimesheet added EN/AR; resource XML parsed and duplicate key scan none. Existing EntityStaff reused. |

## Override inventory and justification

ShiftService overrides five methods plus one declarative property:
1. ApplyListFilters: creation-date day range only.
2. MaterializeListAsync: lean projection of the displayed scalars.
3. AddAsync: source name duplicate rule/trim and frozen clock transport boundary then base.
4. UpdateAsync: same rules, self exclusion and localized missing response then base.
5. RemoveAsync: shared usage-safe delete replacing unchecked generic delete.
6. SearchColumns: Name search handled by inherited engine.

StaffTimesheetService adds ApplyListFilters for monthFilter bounds. Existing MaterializeListAsync (name joins), Add/Update date sentinel checks and RemoveAsync safe delete unchanged. No unnecessary generic read/detail/selection replacement.

## Verification and limits

Complete scoped service/DTO diff and complete resource diff reviewed. Resource delta separates five authored keys from all pre-existing leave/payroll/overtime/job/attendance modifications. git diff --check passes all owned paths; only Git future LF-to-CRLF warnings. Exact removed-type and direct constructor symbol searches found no consumers. Mapping profiles, base generic constraints/hook signatures, current net10/implicit usings, controller/service/interface closures, shared request trim and entity/config source inspected. No merge markers in owned files. Root must reconcile Angular consumers and all source contracts.

Pending owner checks: application compilation; mapping/serialization; sorting/count/day-range/month-filter queries including stored non-first-day Month and9999-12; blank/required form inputs; clocks midnight/end fractions/negative/>=24h; name duplicate/create/update-self; cross-tenant/deleted ID checks; each inbound Shift blocker and safe delete. No schema change: owner does not need Add-Migration.

Known source limits preserved: explicit Shift name check is application-level and has a check/save race without a filtered unique index or participating shared lock; entity name has no explicit EF250 bound. Existing nonnullable TimeSpan/int write scalars bind omitted JSON to zero (UI requiredness does not prove server presence); zero clock is valid midnight. Inherited bulk Add/Update bypass single-row feature service checks and no bulk caller was introduced. Timesheet default Date/Month sentinel rejects0001-01-01 midnight as existing source does. Shared GetMonthStart accepts existing compatible forms beyond yyyy-MM; FE sends canonical month. Generic update last-write behavior and repository/base concurrency remain outside this bounded contract. No financial/domain calculation, children, transaction orchestration, upload, posting or activation work applies.

Suggested backend commit: refactor(attendance): align shift and timesheet contracts
