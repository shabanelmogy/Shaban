# Staff Overtime Full-Stack Review

## Scope and screen shape

- Shape: monthly settings-style editor with one row per calendar day.
- Frontend: route, component, template, styles, models, service, translations, and component spec under `SiGmaAngularFrontEnd/src/app/modules/Staff/StaffOverTime`.
- Backend: `GET /Staff/Overtime`, `POST /Staff/Overtime`, controller, service interface/implementation, DTOs, `Overtime` entity/configuration/ViewModels, salary packages, designation rate, and holiday settings.
- Security: reviewed as covered by the shared controller/repository tenant guard; the custom service queries use the tenant-scoped repository.

## Request-flow and endpoint matrix

| UI action | HTTP contract | Backend flow | Persistence |
|---|---|---|---|
| Load staff options | `GET /Staff/Overtime` | `StaffController.GetStaffOvertimeData` -> `StaffService.GetStaffOvertimeDataAsync` | Read-only staff dropdown |
| Load month | `GET /Staff/Overtime?Month=yyyy-MM&StaffId=n` | Same controller/service; resolves effective daily rates and existing snapshots | Read-only `Overtime`, `SalaryPackage`, `StaffDesignation`, `Shift`, holidays |
| Save month | `POST /Staff/Overtime` with `month`, `staffId`, rows of `day` + `overtimeMinutes` | `StaffController.SaveStaffOvertime` -> `StaffService.SaveStaffOvertimeAsync` | Upserts daily `Overtime` rows and stores hours, applied rate, and calculated amount |

Evidence: frontend service `staffovertime.service.ts:18-39`; controller `StaffController.cs:119-140`; service `StaffService.cs:1972-2375`.

## Bidirectional field parity

| Field | Frontend direction | Backend direction | Persistence/source | Status |
|---|---|---|---|---|
| `month` | filter + save | request | selects calendar month; not copied from client into unrelated rows | MATCHED |
| `staffId` | filter + save | request | tenant-scoped `Staff` lookup and `Overtime.StaffId` | MATCHED |
| `day` | save row | request row | converted to a validated date inside the selected month | MATCHED |
| `overtimeMinutes` | editable integer | request + response | `Overtime.TotalOTHours * 60` | MATCHED |
| `overtimeRate` | read-only response | response, server-owned | `Overtime.OvertimeRate` snapshot or current effective rate | SERVER_OWNED |
| `overtimeAmount` | read-only calculated preview/response | response, server-owned | `Overtime.OvertimeAmount` snapshot | SERVER_OWNED |
| `isWeekend` | row styling | response | Friday/Saturday or configured holiday | MATCHED |
| staff identity/display fields | response only | response | current staff/designation projection | MATCHED |
| summary totals | UI-computed and response | response | daily response aggregation | MATCHED |

## Validation and business rules

| Rule | Implementation |
|---|---|
| Month | Strict `yyyy-MM` parsing through the existing helper |
| Staff | Positive ID and tenant-scoped, non-deleted lookup |
| Rows | Valid day range, no duplicate days, minutes cannot be negative |
| Rate type | Normal rate on working days; holiday rate on Friday, Saturday, or configured holiday |
| Effective date | Salary packages with an effective date after the overtime day are excluded |
| Rate precedence | Normal day: date-effective staff normal rate, then designation hourly rate, then zero. Holiday: date-effective staff holiday rate, then the resolved normal rate, then zero |
| Amount | `(minutes / 60) * applied rate`, rounded to two decimals away from zero on the backend |
| Missing rate | The final applied rate is zero and the calculated amount is zero |
| Clearing | Existing day can be cleared with zero minutes; new blank rows are skipped |
| Audit | Positive rows retain the applied rate and amount even if salary settings later change |

## Findings

### STAFF-OT-FS-01 - High - Fixed

- Layer/operation: POST contract and save.
- Evidence: `StaffOverTime.cs:56-61`, `list.ts:33-41`, `StaffService.cs:2145-2238`.
- Observed impact: the client previously supplied the payroll amount, so the value could disagree with configured rates and the backend was not authoritative.
- Fix: save rows now contain minutes only; the backend calculates the amount and the UI renders amount read-only.
- Owner scenario: change minutes, inspect that the POST body excludes `overtimeAmount`, and confirm the returned amount equals the configured daily rate calculation.

### STAFF-OT-FS-02 - High - Fixed

- Layer/operation: GET/POST rate resolution.
- Evidence: `StaffService.cs:2046-2067`, `StaffService.cs:2160-2186`, `StaffService.cs:2283-2369`.
- Observed impact: normal and holiday salary rows were previously added together and one rate was applied to every day; future revisions could also affect earlier overtime.
- Fix: normal and holiday rates are resolved separately for each calendar date, with holiday detection and effective-date filtering.
- Owner scenario: configure different normal/holiday rates and a future revision, then verify a working day, Friday/Saturday, configured holiday, and a day before the revision.

### STAFF-OT-FS-03 - Medium - Code fixed; database action required

- Layer/operation: EF persistence.
- Evidence: `Overtime.cs:12-13`, `OvertimeConfig.cs:8-11`; no matching fields exist in the current model snapshot/migration.
- Impact: the application schema must contain the two snapshot columns before the updated save path can run.
- Fix in source: nullable `OvertimeRate` and `OvertimeAmount`, both decimal `(18,2)`.
- Owner scenario: generate/review/apply a migration, save overtime, change the salary rate, and confirm the historical saved row keeps its original rate and amount.

### STAFF-OT-FS-04 - Low - Fixed

- Layer/operation: summary calculation.
- Evidence: `StaffService.cs:2076-2099`, `list.component.ts:81-106`.
- Observed impact: overtime on weekends could make `DaysWithoutOvertime` negative because all overtime days were subtracted from working days.
- Fix: working days without overtime are counted directly.
- Owner scenario: enter overtime only on a Friday/Saturday and confirm the without-overtime total remains non-negative.

## Query and database observations

- Staff, designation, and active salary packages are loaded once per request; there is no per-day database query.
- Holiday settings and existing overtime rows are loaded once for the selected month.
- Existing duplicate daily records remain resolved by latest ID, matching the prior behavior. A database uniqueness rule for `(SubscriptionId, StaffId, Month)` should be considered separately only after duplicate data is assessed.
- Required owner migration: add nullable `OvertimeRate decimal(18,2)` and `OvertimeAmount decimal(18,2)` to `Overtime` and update the EF snapshot.

## Owner-run acceptance scenarios

1. Normal day: 90 minutes at rate 100 returns and stores 150.00.
2. Holiday/weekend: the same minutes use the holiday rate, not normal plus holiday.
3. Effective revision: a future salary revision does not alter an earlier day.
4. Snapshot: changing rates after save does not alter the saved row on reload.
5. Staff normal-rate fallback: leave the staff normal rate at zero and confirm the designation hourly rate is used.
6. Holiday fallback: leave the staff holiday rate at zero and confirm the resolved normal rate is used.
7. Missing all rates: positive minutes save with applied rate zero and amount zero.
8. Clear: zero minutes clears an existing row to zero amount.
9. Contract: POST contains only `day` and `overtimeMinutes` per row.
10. Theme/accessibility: calculated amount remains visibly read-only in light/dark mode and minutes remain keyboard editable.

## Coverage summary

- Findings: 2 High fixed, 1 Medium code fixed with owner migration outstanding, 1 Low fixed.
- Code changed: yes, frontend and backend.
- Builds, tests, runtime/browser verification, and migrations: not run, per owner instruction.
