# HRM Leave, Attendance, Overtime, Holiday and Deduction Audit Notes

| Field | Value |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Scope | Read-only business audit of Leave, Leave Type, Leave Opening Balance, Attendance, Shift, Staff Timesheet, Overtime, Holiday and Deduction |
| Verification | Source-only; no build, test, lint, database, migration or browser execution |

## Evidence boundary

The current source and the existing frozen feature reviews were inspected together. Findings below distinguish confirmed current-source defects from deliberate baseline limits. The existing Leave, Attendance Family and Deduction contracts intentionally implemented bounded CRUD without inventing approval, entitlement, payroll, shift-duration or posting policy. Those limits are target-design gaps unless the implemented CRUD violates its own stored-data invariant.

The canonical backend and UI backlogs do not already record these HRM business findings. UI backlog item 39 mentions only a local StaffTimesheet month-validator copy, which is presentation debt outside this business audit.

## Confirmed current-source defects

### P1 — Attendance has competing writers without a unique staff-day invariant

Generic Attendance writes validate only that `Date` is not the default value (`F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/AttendanceService.cs:117` and `:122`). `AttendanceConfig` defines no tenant/staff/calendar-day unique key (`F:/My Work/Sigma/SigmaBackend/SiGma.DataAccess/Configuration/AttendanceConfig.cs:3`). The monthly Staff Duty writer groups duplicates and silently selects the greatest Id (`F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StaffServices/StaffService.cs:1414` and `:1585`); the older duty schedule reader does the same (`F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/AttendanceService.cs:65`).

Trigger: create two live Attendance rows for one tenant, staff member and calendar day, then open or save the monthly duty schedule. Impact: one row is displayed and updated while another remains live, so downstream attendance facts are ambiguous. Target: one canonical AttendanceDay aggregate and a filtered unique database key; constrain or retire alternate writers.

### P1 — Duty punches have no calendar-day/overnight interval contract

Duty save verifies only that each clock string parses (`F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StaffServices/StaffService.cs:1544`). `TryParseDutyTime` falls back to unrestricted `TimeSpan.TryParse` and does not restrict a value to one clock day (`F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StaffServices/StaffService.cs:1684`). A day-qualified value such as `1.01:00:00` can therefore parse even though persistence has only four `TimeSpan?` clock fields and no day offset. Save then persists the four fields without pair completeness or interval-overlap validation (`F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StaffServices/StaffService.cs:1611`).

An `Out` earlier than `In` is not inherently invalid because it can mean an overnight shift. The defect is the absence of an explicit service-date/day-offset rule that distinguishes legitimate overnight work from malformed or overlapping intervals. Target: represent punch instants or explicit offsets, define service-date attribution, and validate complete non-overlapping intervals against that policy.

### P2 — Holiday dates can be duplicated

`SettingsHolidayModelConfig` creates a nonunique Date index (`F:/My Work/Sigma/SigmaBackend/SiGma.DataAccess/Configuration/SettingsHolidayModelConfig.cs:8`), while its service uses ordinary generic writes (`F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/SettingsHolidayModelService.cs:14`). Current HashSet consumers avoid multiplying overtime calculations, but duplicate rows create ambiguous names and maintenance behavior. Target: filtered unique tenant+date, or tenant+calendar+date when multiple calendars exist.

### P1 — Staff overtime lacks the bounds enforced by the parallel overtime service

The Staff overtime writer rejects negative minutes only (`F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StaffServices/StaffService.cs:1925`), calculates amount without the overflow handling used by `OvertimeService` (`F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StaffServices/StaffService.cs:1937`), and converts stored decimal hours to `int` minutes directly on read (`F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StaffServices/StaffService.cs:1796`). The parallel service applies maximum hours/amount and catches overflow (`F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/OvertimeService.cs:85` and `:115`).

Target: one shared bound/calculation owner with checked conversion and the persistence precision limits applied consistently to both APIs.

### P2 — Clearing a duty row leaves an empty attendance fact

When an Attendance row exists, a blank submitted duty row clears shift and all four clocks, forces `IsAbsent=false`, and retains the row (`F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StaffServices/StaffService.cs:1591`). Target: define explicit Present, Absent, Rest, Holiday and Leave states and specify whether clearing deletes a draft row or records a deliberate empty state.

### P1 — Editing a touched duty day silently clears an existing absence

The monthly duty payload carries shift and clock fields but no `IsAbsent` decision. For every touched existing day, the backend assigns those fields and then unconditionally sets `attendance.IsAbsent = false` (`F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StaffServices/StaffService.cs:1591` and `:1616`). Sparse frontend writes limit the mutation to changed days, but changing only the Shift on a manually absent Attendance row still clears the absence.

Payroll preparation reads `Attendance.IsAbsent` as its absence blocker (`F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/Payrolls/PayrollRunService.cs:482`) and adds the required absence-policy issue when such rows exist (`F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/Payrolls/PayrollRunService.cs:528`). Trigger: mark a day absent through Attendance CRUD, then change that day’s shift or clock in Staff Duty Schedule. Impact: the absence blocker silently disappears from payroll recalculation. This conforms to the old duty-save behavior but violates cross-writer state ownership. Target: carry an explicit attendance state/version in the duty command, or prohibit duty edits from changing absence without a separate transition.

## Confirmed current-source conformance

### Overtime processing is intentionally append-only history

`POST /Overtime/process` inserts a new immutable `OvertimeProcessRun` summary (`F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/OvertimeService.cs:184` and `:204`). The frozen contract explicitly defines this as an append-only operational snapshot, not payroll posting, and says multiple deliberate runs are separate history (`F:/My Work/Sigma/reviews/Archive/Completed/2026-10-23/OVERTIME_FRONTEND_CONTRACT_FREEZE.md:37` and `:41`). The nonunique process-run index therefore conforms to the approved contract and is not an idempotency defect.

If the product later needs a single authoritative financial process, source-row identities/version, an idempotency key, approval/posting states and reversal semantics are a target contract change rather than a repair to the current snapshot feature.

## Multi-country policy gaps requiring a target contract

### Friday/Saturday classification is a current v1 policy, not a universal country model

The shared overtime policy classifies every Friday and Saturday as holiday/rest time (`F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StaffServices/StaffOvertimePolicy.cs:55`). `OvertimeService` repeats the same rule (`F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/OvertimeService.cs:140`), and duty schedule uses it too (`F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StaffServices/StaffService.cs:1433`). The frozen overtime contract approved this v1 behavior. It becomes insufficient when targeting tenants or branches with Friday-only, Saturday/Sunday, rotating or contract-specific rest days. Target: effective-dated country/company/branch/staff work calendars. Country packs may seed defaults, but the application should not encode one “Arab countries” weekend globally.

### Shift overtime eligibility needs an owner policy

`Shift.IsEligibleForOvertime` is persisted (`F:/My Work/Sigma/SigmaBackend/SiGma.Helpers/Models/Staffs/Shift.cs:7`), but neither overtime writer consults attendance or shift eligibility; they resolve only staff, date, holiday category and rate (`F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/OvertimeService.cs:102` and `F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StaffServices/StaffService.cs:1937`). Target decision: hard gate, approval warning or informational flag.

## Approved baseline gaps requiring a target business contract

### Leave entitlement and opening balances

`LeaveOpeningBalance` is isolated CRUD. Scoped source use of `OpeningDays` is limited to its own service/configuration/mapping. New Leave creation copies `LeaveType.MaxLeaves` and calculates inclusive calendar duration only (`F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/LeaveService.cs:55`; `F:/My Work/Sigma/SigmaBackend/SiGma.Helpers/Models/Staffs/Leave.cs:23`). It does not consume opening balances, accrual, carry-over, approved requests, holidays/rest days or eligibility fields. The frozen Leaves plan explicitly approved this provisional behavior, so this is a missing entitlement engine rather than a regression.

Target: an auditable LeaveLedger of effective-dated credits/debits, with balance by staff/type/period and links to approved request transitions. Define calendar-day versus working-day types, half-day segments, cross-period splitting, accrual, rollover and encashment. Egyptian statutory entitlements and employer policy should remain distinguishable and legally reviewed.

### Leave workflow, locks and authorization

Leave Add and Update DTOs contain only type, staff, reason and dates; they do not accept `LeaveStatus` or another approval-status input (`F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/Leave/LeaveAddVm.cs:7`; `F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/Leave/LeaveUpdateVm.cs:7`). Generic editing therefore cannot arbitrarily set approval status. The gap is that no approval/rejection/cancellation/rejoin transition exists, and there is no state lock protecting approved or imported historical rows. `LeaveController` exposes generic CRUD plus dashboard only (`F:/My Work/Sigma/SigmaBackend/SiGma.ServerAPI/Controller/LeaveController.cs:8`); update preserves stored status but permits editable fields to change (`F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/LeaveService.cs:70`), and removal has no status gate (`F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/LeaveService.cs:89`). Leave-type approvers remain configuration only.

Target: explicit transitions with ordered approver snapshots, actor authorization, concurrency/audit, cancellation and rejoining. Lock staff/type/dates after submission or approval according to the frozen workflow.

### Leave overlap, day classification and pay allocation

The backend has no overlap check. Duration is inclusive calendar days (`ToDate - FromDate + 1`), while persisted PaidDays, HalfPaidDays and UnpaidDays are not calculated by this service (`F:/My Work/Sigma/SigmaBackend/SiGma.Helpers/Models/Staffs/Leave.cs:17`). The frozen contract deliberately retained stored counters without inventing formulas. Target policy must define overlap/exclusivity, holidays/rest days, half days, working calendars, pay allocation and cross-year behavior.

### Shift duration and overnight behavior

Shift writes only enforce clocks within one 24-hour value range and deliberately have no start/end ordering rule (`F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/ShiftService.cs:43` and `:56`). The frozen Attendance Family contract kept DutyHours and Weekdays as independent values. Target policy must define overnight duration, break treatment, weekday assignment, flexible shifts and effective-dated staff assignment before deriving attendance hours.

### StaffTimesheet ownership and locks

StaffTimesheet remains an independently editable generic record. Its service validates only Date/Month presence, then delegates inherited Add/Update; there is no payroll/state/concurrency lock (`F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StaffServices/StaffTimesheetService.cs:37` and `:44`). This matches the frozen CRUD baseline. Target decision: make it a derived immutable payroll input sourced from approved attendance, or retire it to avoid parallel editable hours.

### Deduction lifecycle and payroll coupling

Deduction write DTOs keep `PaidInstallments` and `PassOverDeductionForThisMonth` client-editable, with only scalar validation (`F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/Deduction/DeductionAddVm.cs:7`; update has the same shape). `DeductionService` owns filtering/import/removal but no status transition, concurrency token or payroll lock (`F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/DeductionService.cs:11`). This matches the frozen Deduction review and requires PayrollRunService evidence before labeling a concrete cross-service defect.

Target: DeductionSchedule plus immutable posted-installment allocations tied to payroll runs; derive lifecycle status server-side and require payroll reversal rather than rewriting consumed history. Country policy must separately define protected-wage caps, priority, tax and social-insurance treatment.

## Current formulas and state inventory

- Leave duration: inclusive calendar days; `LeaveStatus` defaults Pending and has no transition API.
- Overtime amount: `round(hours * rate, 2, AwayFromZero)` (`F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StaffServices/StaffOvertimePolicy.cs:61`).
- Overtime rate: latest effective SalaryPackage Overtime type 0/1; normal falls back to designation hourly rate, holiday falls back to resolved normal (`F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StaffServices/StaffOvertimePolicy.cs:5`).
- Daily Overtime has a tenant/staff/computed-calendar-day/live-row unique key (`F:/My Work/Sigma/SigmaBackend/SiGma.DataAccess/Configuration/OvertimeConfig.cs:11`).
- Deduction principal, installment count, paid count and pass-over remain client inputs. Payroll installment ownership is pending cross-review.

## Recommended target architecture for Egypt and other Arab-country deployments

1. Effective-dated `WorkCalendarAssignment`: jurisdiction, company, branch and staff overrides; rest days, public holidays, timezone and working periods.
2. `AttendanceDay` aggregate: source/device/audit/idempotency plus explicit punch intervals and service-date offsets.
3. `LeaveLedger` and `LeaveRequest` workflow: immutable balance entries, approval snapshots, overlap/state rules and cancellation/rejoin events.
4. `OvertimeClaim`: derived from approved attendance where available, explicit manual override reason, approval, and immutable payroll-input snapshot.
5. `DeductionSchedule` with posted installment allocations and reversal linkage.
6. Country packs provide reviewed default policies, never hardcoded universal Arab rules; every effective rule records jurisdiction, effective dates and tenant overrides.

## Owner decisions and manual verification

- Confirm jurisdiction/company/branch precedence and the legal-policy owner for Egypt and every target country.
- Decide the canonical attendance writer and migration handling for existing duplicate staff-day rows.
- Define overnight service-date attribution and whether punches may span more than one day.
- Define Leave approval/cancellation/rejoin states, approver authority, locks, accrual and pay allocation.
- Define overtime eligibility, caps, approvals and payroll posting/reversal semantics.
- Cross-check PayrollRunService deduction reads/writes, then classify any editable-history race with exact payroll evidence.
- Inspect existing data for duplicate Attendance and Holiday keys before adding constraints.

No application source, configuration, guide or instruction file was changed. No build, test, lint, database, migration, browser, commit or push command was run.
