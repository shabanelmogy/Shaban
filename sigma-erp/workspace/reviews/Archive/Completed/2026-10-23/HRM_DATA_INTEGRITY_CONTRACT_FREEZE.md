# HRM data integrity — implementation slice

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-11 |
| Authorization | Owner: «طبق إصلاح سلامة البيانات»، then «كمل» |

## Scope and evidence

Stage1 of HRM_BUSINESS_LOGIC_FULL_STACK_REVIEW: F01 absence preservation, F03 salary storage/money validation, F04 overtime calculation bounds, Attendance duplicate prevention and safe handling of existing conflicts. Source and existing frozen contracts determine compatible DTOs/routes. This targeted amendment supersedes the old DutySchedule unconditional absence reset; it does not introduce attendance reclassification workflow, new legal policies, payroll payments or mass data cleanup.

## Frozen decisions

| Concern | Contract / reason |
|---|---|
| Duty save | Existing Attendance.IsAbsent survives shift/clock edits and clears. New attendance defaults false. Existing Attendance CRUD remains the explicit state writer. Sparse changed-day writes unchanged. |
| Attendance day | One live row per authenticated tenant, nonnull StaffId and Date.Date. NULL IsDeleted is live. Generic Add/Update/bulk and Duty save participate in existing Staff tenant write guard. Dates normalized for new/changed inputs, legacy datetime rows still compared by calendar day. |
| Existing duplicates | No delete, merge, or newest-row selection in the active Staff Duty reader/writer: return localized conflict before mutation. Attendance list remains available for owner correction. No runtime database preflight in this task; owner preflight before migration. |
| Legacy Duty read | Internal IAttendanceService return becomes Result<List<row>> so its controller can return localized409 for conflicts; GET Attendance/StaffDutySchedule successful JSON stays the existing array. No active Angular consumer found. All attendance readers stop picking a duplicate silently. |
| Bulk occupied keys | Updating a row to a key currently owned by another row is rejected even if the other row is in the same batch and moving away. No key-swap workflow introduced; avoids transient SQL uniqueness violations. |
| Monthly preflight/refresh | Duty save checks the complete month for conflicts before mutation. Failed refresh from Duty/StaffOT propagates failure through the write guard, so its owned transaction cannot commit a successful partial command with an empty response. |
| EF enforcement | Computed calendar-day and deleted-row keys with unique tenant/staff/day/live key, same null-live approach as existing OvertimeConfig. Owner generates/applies migration after duplicate review; no migration or snapshot edited here. |
| Salary amounts | Current SalaryPackage and frozen payroll use two fractional digits, decimal(18,2). Reject negative, out-of-capacity or unsupported fractional values before mutation; accept equivalent trailing zeros. Validate Basic+Transport+House Gross capacity after each component is bounded. Same validator used for Staff create and salary revision. No repricing saved salaries and no implicit rounding of client values. |
| Shared money owner | FinancialNumberPolicy.HasValidMoneyScale/RoundMoney with existing storage decimal places. No currency schema/general payroll policy change. |
| Minute round trip | Six-decimal stored hours lose fractional precision from integer minutes/60. Recover a whole minute only within half a storage unit (0.00003 minute), before Int32 conversion; other fractional-minute records retain existing truncation. No monetary repricing. Example 2 minutes→0.033333 stored hours→2 minutes, not1. |
| Existing OT validation | Validate stored hours/rate even when an amount snapshot exists, preserve that amount. For legacy missing amounts only, the read fallback uses original stored hours through the shared calculation; do not derive money from truncated display minutes. |
| Overtime | Shared StaffOvertimePolicy validates nonnegative hours, decimal(22,6) hours capacity, decimal(18,2) rate/amount capacity and catches arithmetic overflow. Existing rate resolution, snapshot behavior, two-decimal AwayFromZero formula unchanged. Both daily and Staff save use same calculation boundary. Staff minute read checks Int32 conversion and monthly aggregate; return actionable localized failure, never clamp/drop historical amounts. |
| API / ownership | Existing endpoints, request/response fields, status/enums/routes unchanged; errors through localized Result. No tenant/audit/client-total fields added. |
| Atomicity | Validate entire requested batch and all calculated values before changing tracked rows. One graph save. Existing ExecuteUniqueWriteAsync<Staff> owns transaction because cross-writer duplicate checks require serialized reads+writes. |
| Guides | Update existing bilingual HRM and Staff topics to describe actual preservation, duplicate rejection and number bounds; same UserGuide reader/menu. |

## Pattern and conformance evidence

Attendance ordinary CRUD = BE13/UI01, BranchService duplicate-before-base/FK validation and localized failures. Duty/OT monthly workspace are domain-specific exceptions; existing StaffService monthly batch owner and shared UI shell retained. Salary aggregate = BE14/current Staff tracked children; financial number policy = BE15/FinancialNumberPolicy. Race boundary = BE8/15 UnitOfWork.ExecuteUniqueWriteAsync and current OvertimeService. EF null-live day uniqueness = existing OvertimeConfig (feature reference, preserving canonical tenant uniqueness). No screen layout change or new action inventory; Add/Update/Delete and sparse calendar Save supported as before.

DTO/grid contracts unchanged: Attendance displayed staff/code/designation/shift/absence/date and clocks retain current DTOs; Duty day/date/weekday/shift/clocks/identity remain current fields; Salary client Basic/Transport/House/OT rates/ApplicableFrom, server Gross; daily OT staff/date/code/designation/normal/holiday hours with server total/rate/amount. No ListVM changes.

Overrides justified: Attendance single/bulk writes need composite duplicate validation under common lock; delete serialized with the same writer family. Staff create/revision need monetary validation; existing Duty/OT methods need business preservation/conflict and bounds. All remaining inherited operations stay unchanged. AutoMapper unchanged unless required for prepared batch mapping; no reverse maps added.

## Boundaries and owner verification

Required guides: canonical Master4/5/7, backend2/5/8/13/14/15/19; UI catalog/validation/translation/guide handoff; applicable PLAN00 and phase01/03/05/06 packets. All8 recipe checks current before use. Builds/tests/lint/database/browser/migration/commit/push/deploy/SigmaMCP/Graphify remain prohibited by project AGENTS. Source-only verification and separate scoped diffs are required.

Data owner must review conflicting live Attendance keys before Add-Migration/AddAttendanceDayUniqueness and application. No policy for automatic merging exists, so none is executed. Payroll snapshots and existing financial histories are preserved. Overnight interpretation and holiday/department policy changes remain later slices.

Owner continuation: data is experimental and correctness is the priority. This confirms schema integrity over preserving invalid duplicate-writing behavior; no data cleanup was requested or executed. Two separate In/Out pairs remain supported in each unique employee-day row. Day uniqueness does not limit work to one interval.
