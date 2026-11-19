# HRM Attendance integrity implementation notes

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-11 |
| Scope | Attendance CRUD/API, Staff duty integration, repository guard and EF uniqueness |

## Frozen contract implementation

| Concern | Canonical owner / reference | Final source evidence | Result |
|---|---|---|---|
| Ordinary CRUD validation | BE13; `BranchService` duplicate-before-base and FK validation | `AttendanceService.SaveBatchAsync` validates every row, record, Staff, Shift and business key before tracking writes | Matched with Attendance-specific batch override |
| Serialized duplicate boundary | BE8/BE15; `OvertimeService.SaveDailyBatchAsync` | Add, Update, AddList, UpdateList and Delete all use `ExecuteUniqueWriteAsync<Staff>` | Matched common Staff writer family |
| Atomic batch persistence | BE5/BE15; `OvertimeService.SaveDailyBatchAsync` | The complete batch is materialized and validated before Add/Update attachment; one `SaveChangesAsync` persists it | Matched |
| Calendar-day uniqueness | Frozen HRM integrity contract; `OvertimeConfig` | `AttendanceConfig` adds stored `AttendanceDay`, stored `AttendanceDeletedKey`, and unique Subscription/Staff/day/live index with nonnull Staff filter | Matched |
| Legacy Attendance duty API | Frozen safe-conflict rule | Service/interface use internal `Result<List<StaffDutyScheduleRowVm>>`; controller preserves the legacy success array and emits the standard Result failure with HTTP 409 for duplicates | Matched |
| Staff duty read | Frozen safe-conflict rule | Full-month read rejects duplicate days with `AttendanceDuplicateDay`/409 instead of choosing the greatest ID | Matched |
| Staff duty absence ownership | Frozen absence-preservation rule | New rows initialize `IsAbsent = false`; existing rows retain their stored value when shift/clocks change or clear | Matched |
| Repository ownership | BE8 tenant boundary | Repository `Query` requires an authenticated subscription and filters tenant/live rows; Add/Update require subscription and normalize/protect tenant ownership, with `SubscriptionId` as a concurrency predicate | Matched by source inspection |

## Write behavior

- New and changed dates are normalized to `Date.Date`.
- A live, tenant-scoped Staff and Shift must exist for every requested row. Repository query filters and explicit `IsDeleted != true` checks preserve tenant and live-row ownership.
- A batch contains 1–1000 rows, positive Staff/Shift IDs, valid update IDs, unique update IDs and unique `(StaffId, Date.Date)` keys. Code and Designation remain at their existing 100-character limits. Nullable clock values must fit a SQL `time` day (`00:00:00` inclusive to `24:00:00` exclusive).
- Existing update entities are loaded tenant-scoped and no-tracking. All records, foreign keys and collisions are checked before any entity is attached for Add/Update. The batch is saved once.
- Delete joins the same `ExecuteUniqueWriteAsync<Staff>` lock as all Attendance writers.

Failure keys used by the bounded source change are `AttendanceDuplicateDay`, `AttendanceInvalidBatch`, `AttendanceInvalidInput`, `AttendanceNotFound`, `StaffNotFound`, and existing `ShiftNotFound`. All four new Attendance keys are now present in the English and Arabic resources.

## Duty readers and API compatibility

The legacy Attendance service/interface now use `Result<List<StaffDutyScheduleRowVm>>` internally, providing a declared duplicate-conflict channel. `AttendanceController.StaffDutySchedule` unwraps successful results to the existing JSON array and routes failures through `ToActionResult`, so existing successful consumers keep their response shape while duplicate data returns HTTP 409 with the localized Result body. A bounded backend/frontend reference search found this legacy method only in `IAttendanceService`, `AttendanceService`, and the Attendance controller route; the active frontend duty schedule uses the separate Staff endpoint.

The active Staff duty reader now rejects duplicate days for the selected month instead of selecting a newest row. The Staff duty writer also rejects duplicates among the attendance rows it loads and preserves existing `IsAbsent`; only newly created schedule rows default to false.

## Final read-only review findings

1. **Action required — Staff duty save can miss a duplicate conflict before mutation.** `SaveStaffDutyScheduleCoreAsync` restricts `existingAttendances` to `rowDates`, so a duplicate on another day in the selected month is not checked before submitted rows are mutated and saved. Its post-save full-month `GetStaffDutyScheduleAsync` can then return the expected 409, but the save method ignores `refreshedSchedule.IsSuccess` and returns success with `Rows = []`. Load/check the complete month before tracked mutation (or separately preflight complete-month day counts), and propagate any failed refresh defensively. This is a source-level conflict with the frozen rule that the active Staff duty writer reports existing conflicts before mutation.
2. **Runtime risk — multi-row key swaps may reach the unique index in a transient conflicting order.** Attendance bulk update excludes all submitted IDs when checking database collisions, which correctly validates the final key set but permits two existing rows to exchange `(StaffId, Date.Date)`. SQL Server can reject the first physical update against the still-existing second key even though the requested final keys are unique. If key swaps are supported, persistence needs an explicit safe strategy; otherwise reject this case as `AttendanceInvalidBatch` before attachment. This cannot be resolved by source inspection alone.

No compile-type mismatch was found across `AttendanceService`, `IAttendanceService`, `AttendanceController`, `Result<T>`, the protected `ToActionResult` method, repository generic constraints, or EF configuration APIs. `DateTime.MaxValue.Date` remains an accepted input; the collision query uses `row.Date.Date <= to` and does not call `AddDays(1)` on the maximum date.

## EF and migration boundary

The EF change requires a migration after the data owner reviews existing live duplicate `(SubscriptionId, StaffId, Date.Date)` rows. Suggested owner command name: `AddAttendanceDayUniqueness`. No migration or model snapshot was created or edited.

## Source-only verification

Recipe drift check completed successfully before packet use. The final amendment review inspected the cross-API types, tenant/live repository guards, Staff duty read/save flow, computed EF key, maximum-date query, localized failure keys, merge markers and whitespace. No build, test, lint, database, browser, migration, snapshot, commit, push, deployment, Graphify or Sigma MCP command was run. Runtime and database acceptance remain pending for the owner; the two findings above remain pending source correction/decision.
