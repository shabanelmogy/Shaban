| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Settings-driven payroll calculation — 2026-10-12

Owner instructed reading current options instead of inventing day/basis configuration. HrmSetting.MonthDaysCalculationRule already has ThirtyDays/CalendarDays, previous-month overtime and EnableAttendanceDeductions. Owner explicitly selected Gross for absence/unpaid-leave deductions. HrmSetting PayStructure.Formula currently stores text only; no grammar/evaluator exists. This slice consumes existing day/attendance flags and rejects nonempty formulas relevant to calculation rather than silently pretending to execute them. Previous sales commission/business-unit options remain explicit unsupported flags. No client totals.

## Salary and day allocation

Monthly Payroll and existing LeaveSalary salary workspace use every effective-dated salary revision intersecting the covered employment period. Validate each revision with existing duplicate/component/gross invariants; require a dated package effective at the first covered day; future packages excluded. CalendarDays: daily fraction equals calendar overlap/month days. ThirtyDays: full-month employment retains the existing full monthly salary; partial employment fraction is min(actual covered days,30)/30, consistent with existing Fixed30 settlement vocabulary. Divide that payable fraction across salary revisions in proportion to actual calendar days within the covered period. This defines a full monthly entitlement and avoids paying 31/30 merely because salary changed. Each salary component is rounded once after summing its unrounded segment contributions; Gross equals Basic plus rounded allowance components. Monthly package deductions/additions follow the same fractions; authoritative OT and loan/advance installments are separate period amounts. FinalSettlement preserves its reviewed input basis and existing calculation; salary changes crossing its covered period remain a visible blocker until its per-period snapshot contract is extended.

## Attendance and leave

When EnableAttendanceDeductions=false, attendance/leave facts do not automatically reduce pay; include that setting in source version so enabling recalculates. When true, absence and full unpaid approved leave deduct the effective revision's monthly Gross / configured divisor (30 or calendar month days) for each covered date. Deduplicate dates; approved leave excludes the same date's absence. Approved fully unpaid leave is established by LeaveType.IsUnpaidLeave. Pending/rejected leave never deducts. Absence before joining and outside settlement employment dates excluded. Mixed paid/half/unpaid leave aggregates do not identify which date is unpaid; block affected rows with a specific dated-allocation issue instead of allocating guessed days. Ambiguous overlapping approved leave blocks calculation. Absence and unpaid portions are separately snapshotted/accounted through matching expense-reduction slots. Negative net remains a blocker. Do not add holiday/working-day/cutoff/late-arrival deduction formulas without a source-supported contract.

## Immutable accounting evidence

SourceSnapshot adds final rounded AccountingComponents and AccountingUnsupportedComponents per disbursement contract. Per-component rounding and exact normal/holiday OT proportional allocation use FinancialNumberPolicy. Stored overtime amount remains authoritative; no double salary OT. Record all salary segments, settings, covered days/divisor, attendance, approved leaves and component contributions in source/version. Operational deduction installment snapshot includes Type and final installment amount. Unsupported nonzero accounting components prevent payout but do not silently alter salary calculation.

## Locks and verification

PayrollRunService is owned by calculation worker while editing; finance worker owns new service/entities. Save/Approve cannot replace any revision with AccountingJournalVoucherId even if payments were fully reversed. Read saved HasAccounting into PayrollRunVm; changed paid/accounted preview remains comparison-only. Source-only verification, exact API/guide updates and whole scoped diffs; no builds/tests/database/browser or migrations/snapshots.

## Historical change record — exit cutoff clarification (2026-10-12)

The owner asked whether events after the exit date are recorded. The existing
model has no dated employment-exit field or global lifecycle write guard, so this
change is limited to calculation inclusion: Final Settlement clips attendance,
approved leave dates, and deduction start dates through LastWorkingDay, ignores
later overtime for the settlement, and does not run the ordinary monthly
proration before the settlement-specific calculation. Overlapping approved leave
and mixed paid/unpaid leave without date-level allocation block the row. Source
screens may still accept later-dated records; a future employment-lifecycle
cutoff remains a separate plan item.

## Historical change record — enforce the cutoff on writes (2026-10-12)

The owner explicitly changed the requirement from calculation-only exclusion to
write prevention. The saved Final Settlement `LastWorkingDay` is now used as a
server-side cutoff by Attendance, Leave (request and approval), Overtime,
Deduction, and Staff salary-revision writes. New or edited records after that
date return a conflict and are not persisted. A future dedicated employment
lifecycle field may replace the PayrollRun lookup, but it is no longer required
for this enforcement path.

Monthly Payroll and Leave Salary also exclude an employee whose saved Final
Settlement last working day is before the requested period. This prevents a
later monthly run from recreating salary after the final exit.
