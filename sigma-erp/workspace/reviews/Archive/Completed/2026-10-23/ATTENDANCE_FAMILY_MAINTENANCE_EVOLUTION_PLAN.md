# Attendance family folder and Timesheet owner alignment

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

Authority: user's explicit move instruction and same-pattern clarification, 2026-10-10. Scope is grouping under HRM/Attendances and consolidating two source owners for the same StaffTimesheet API; not an application-wide rewrite.

| Existing owner | Impact / decision |
|---|---|
| HRM/Shifts/Shift | Move/refactor under Attendances/Shift; API/select/public URL kept |
| HRM/StaffTimesheets/StaffTimesheet | Move/refactor under Attendances/StaffTimesheet; typed shared list/modal |
| Staff/StaffTimesheet | Replace duplicate same-API CRUD with one relocated owner; preserve Code/Designation filters advanced, existing fields/URLs/guide |
| pages/routing.ts | Both singular/plural Timesheet routes load one owner; Shift route path changes only import |
| LayoutModule | One root TimesheetService provider/import, moved ShiftService import |
| Attendance, Staff, DutySchedule direct Shift consumers | Import relocation only |
| HRM_GUIDE, staff-guide existing Timesheet link | Extend HRM guide; retained existing singular link; no reader change |
| Shift/Timesheet backend DTO/services | Lean reads, compatible editable writes, generic query boundaries |
| Entity/EF/database/payroll/monthly bulk logic | Keep; no migration/effects |

Alternatives: keeping both independently implemented owners would preserve behavioral drift and duplicate maintenance; changing only sidebar would lose the current singular owner's filters; forwarding both URLs to one relocated owner with preserved filters satisfies the request and keeps navigation compatible. The latter is selected under explicit user authorization. No business data deletion, access restriction or accounting effect occurs.

No source-old files removed until consumer/dirty/untracked audit; git retains tracked history. No new shared mechanism, global layout change or compiler widening. Applied snapshots, all-page export, modal guard, errors/retry and bilingual guide included. Source reconciliation required; owner build/runtime pending. No open material business decision; weekday numeric semantics and absence/batch Timesheet remain the existing source contract, never inferred formulas.
