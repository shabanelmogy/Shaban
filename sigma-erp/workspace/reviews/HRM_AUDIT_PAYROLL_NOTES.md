# HRM payroll, settlements, payslips and reports audit notes

| Field | Value |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Review mode | Source-only business audit; no application-source change |
| Scope | Payroll calculation/revisions/approval, leave salary, final settlement, payslips, legacy salary vouchers and payroll report |
| Market objective | Configurable foundation for Egypt and other Arab-country deployments; no jurisdiction-specific rule is asserted without an owner policy |

## Evidence and boundaries

This note reconciles current source with `HRM_PAYROLL_CONTRACT_FREEZE.md`, `HRM_PAYROLL_FINAL_RECONCILIATION.md`, `PAYROLL_FINAL_SETTLEMENT_PAY_SLIPS_CONTRACT_FREEZE.md`, `LEAVE_SALARY_PAYROLL_PROCESS_FRONTEND_BACKEND_CONTRACT_FREEZE.md`, `PAYROLLS_REPORT_CONTRACT_FREEZE.md` and `HRM_SETTINGS_SCREEN_CONTRACT_FREEZE.md`. The initial recipe check was reported current for PLAN-00 and phases 00–06 by the coordinating review. No build, test, lint, database, migration, browser, commit or push command was run.

The current frozen v1 policy deliberately calculates normal salary from the payroll-month start or the source joining date. The reviewed `JoiningOrRejoiningDate` is a final-settlement/leave-salary context input and snapshot fact. Current code therefore does not prove a regression merely because that input does not alter normal-salary coverage. Rehire episode behavior remains an unresolved policy decision.

## Prioritized findings and material scope gaps

### P1 material deliberate scope gap — Payroll has no disbursement, payment, reversal or void owner

`PayrollRun` reserves `IsPaid` and `PaidAt` for a separate disbursement workflow (`F:/My Work/Sigma/SigmaBackend/SiGma.Helpers/Models/Staffs/PayrollRun.cs:15`). The public service contains calculation, save, reads, revisions, list, approval and logs only (`F:/My Work/Sigma/SigmaBackend/SiGma.Business/IServices/IPayrollRunService.cs:7`), and the controller exposes the same actions (`F:/My Work/Sigma/SigmaBackend/SiGma.ServerAPI/Controller/PayrollRunsController.cs:16`). No route atomically consumes an approved revision, records payment, creates accounting entries, advances deductions or loans, or reverses those effects.

Trigger: an approved payroll must be disbursed or corrected after disbursement. Impact: the application cannot complete the payroll lifecycle through this aggregate; `IsPaid` has no in-scope writer and approval must not be presented as payment. This is a deliberate frozen scope boundary and material production-completion gap, not a defect in the currently frozen calculation/save/approval scope.

Recommended target: `Calculated/Draft -> Saved revision -> Approved -> Payment batch -> Paid`, with a compensating Void/Reversal action. Payment must bind the exact approved revision and atomically create the payment/accounting evidence, apply deduction/loan installments once, update the run and append the operation log. A paid recalculation should create a separately traceable arrears/adjustment result rather than mutate history. Owner decisions remain required for payment instruments, journal model, posting accounts, reversal date/period rules and reopen authority.

### P1 — Legacy SalaryVoucher is an unlinked client-priced header

The generic controller exposes the inherited CRUD surface (`F:/My Work/Sigma/SigmaBackend/SiGma.ServerAPI/Controller/SalaryVoucherController.cs:6`) and the service adds no payroll-specific validation (`F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/SalaryVoucherService.cs:5`). Add and Update accept client-owned number, type, date and total amount (`F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/SalaryVoucher/SalaryVoucherAddVm.cs:9`, `F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/SalaryVoucher/SalaryVoucherUpdateVm.cs:9`). The entity stores only those values (`F:/My Work/Sigma/SigmaBackend/SiGma.Helpers/Models/SalaryVoucher.cs:3`): it has no staff, payroll run/revision, approval, payment, source snapshot or journal relation.

Trigger: an authenticated API consumer creates or changes a Salary/LeaveSalary voucher. Impact: the header cannot prove which payroll or entitlement produced its amount and cannot serve as the authoritative disbursement record. The reviewed source does not show it creating journal entries, so this finding does not claim that posted financial statements are corrupted. It is legacy traceability and integrity debt, already rejected as the payroll calculation owner by the frozen leave-salary review.

Recommended target: first inventory any external consumers. Replace mutations with a dedicated payroll payment/document aggregate linked to the approved revision and accounting result; then restrict or retire generic SalaryVoucher writes without deleting historical evidence.

### P1 — Salary-package write precision is wider than storage and lacks a shared money boundary

`StaffSalaryRevisionVm` permits each salary input up to the full .NET Decimal range and applies no scale restriction (`F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/Staff/StaffSalaryPackageVm.cs:8`). `AddSalaryPackages` copies those raw values and computes stored Gross with an unrounded in-memory sum (`F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StaffServices/StaffService.cs:338`, especially line 351). EF config constrains every `SalaryPackage.Amount` to `decimal(18,2)` (`F:/My Work/Sigma/SigmaBackend/SiGma.DataAccess/Configuration/SalaryPackageConfig.cs:8`). Payroll later requires persisted Gross to equal persisted Basic plus allowances (`F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/Payrolls/PayrollRunService.cs:766`).

Trigger: a salary input exceeds decimal(18,2) magnitude or contains more than two fractional digits; independently rounded component rows and the separately stored raw Gross sum can cease to satisfy the exact payroll invariant. Impact: persistence can fail for out-of-range values, or a persisted salary revision can later block payroll as `invalidSalary`. The exact provider behavior for excess scale was not executed in this read-only review, so the structural mismatch is confirmed while a specific SQL rounding result is not asserted.

Recommended target: validate storage magnitude and the tenant currency precision before constructing rows; round each component once through the shared financial-number policy; compute Gross from those rounded authoritative components; reject unsupported precision with a business error. Add the salary revision to the payroll source-version/concurrency design so a concurrent replacement cannot escape the payroll snapshot boundary.

## Material policy and design gaps

### Rejoining semantics — Uncertain, not a confirmed defect

The service validates `JoiningOrRejoiningDate` (`PayrollRunService.cs:471`) and stores it in the settlement snapshot (`PayrollRunService.cs:708`), while `normalSalaryFrom` remains `max(period start, Staff.DateOfJoining)` (`PayrollRunService.cs:521`). `ServiceDays` also uses original joining (`PayrollRunService.cs:723`). This matches the frozen normal-salary baseline. For employers with break-in-service/rehire episodes, the target needs an effective-dated employment episode and explicit decisions for salary coverage, leave accrual and gratuity continuity. Do not silently reinterpret the current input as a new calculation start.

### Historical employment eligibility — source limitation

Employee selection evaluates current `IsActive`/`IsInactive` plus joining date (`PayrollRunService.cs:447`). Staff has no effective-dated termination/reactivation episode in the reviewed chain. Recalculating an old unpaid period after current status changes can therefore change candidate membership. Existing saved revisions remain snapshots, and the current behavior was frozen deliberately. Target: effective-dated employment episodes, or block/label historical recalculation until an owner-reviewed employee scope exists.

### Proration, attendance and leave — explicit blockers

Mid-month joining or salary changes add `prorationRequired`, and dated absences add `absencePolicyRequired` (`PayrollRunService.cs:521`–`530`). This is safe blocking behavior rather than wrong arithmetic. The Egypt/Arab-country target needs effective-dated configuration for calendar/30-day/working-day divisors, payroll cutoffs, unpaid/paid leave, lateness, holidays, overtime, retroactivity and rounding. Those policies must be versioned into each payroll revision.

### Settings are configuration-only today

HRM settings expose month-day rule, gratuity rates, leave-salary items, attendance flag and pay-structure formulas (`F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/HrmSetting/HrmSettingDetailVm.cs:10`). Payroll consumes only unsupported-mode flags and previous-month overtime (`PayrollRunService.cs:419`–`445`); salary calculation remains hard-coded component ranges (`PayrollRunService.cs:745`–`769`), and final settlement uses reviewed request bases/divisor (`PayrollRunService.cs:653`–`696`). `HRM_SETTINGS_SCREEN_CONTRACT_FREEZE.md` explicitly froze the new fields as configuration-only. A future evaluator must not make the existing UI fields silently financial without a frozen policy, effective date, validation language and immutable policy version.

### Employee deductions and advances need their own obligation contract

Payroll queries generic active, noncompleted `Deduction` schedules (`PayrollRunService.cs:479`) and calculates the scheduled installment (`PayrollRunService.cs:537`–`552`). Save intentionally does not advance paid installments. `DeductionType.Loan`, or a future employee salary-advance obligation, belongs to this HRM policy discussion. The existing `LoanPaymentPlan` and `LoanEMI` aggregates belong to vehicle/vendor Bill financing under `LOAN_READ_CONTRACT_FREEZE`; they are not employee loans and must not be integrated into payroll. A future payroll payment owner must snapshot employee deduction/advance obligation IDs and due amounts, apply each exactly once and reverse them exactly once; calculation and payment remain separate lifecycle stages.

## Confirmed conformance and non-findings

- Saved payroll calculations are backend-owned, versioned and snapshotted. Save revalidates under serializable isolation and the payroll write guard; approval is current-revision and unpaid only.
- Changed unpaid Save appends a revision and clears the current approval pointer; historical approval remains evidence. Paid mutation remains blocked except the exact saved-request replay.
- Payslips consume saved payroll lines and preserve revision/current/approval/payment state. No confirmed frontend/backend contract mismatch was found.
- Payroll report selects Payroll type, current revision and persisted values. `EarningsSubtotal = Gross + Additional` and separate overtime match the frozen report contract (`F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/PayrollsReportService.cs:95`). Including current unapproved revisions is also a frozen report decision.
- The reviewed final-settlement ticket quota period is recorded context; the frozen formula intentionally uses quota × price × eligibility percentage. Its absence from arithmetic is not a defect.

## Recommended target for Egypt and Arab-country deployments

Create a company/country/effective-date payroll policy profile rather than embedding one national formula in `PayrollRunService`. It should version: employment episodes; wage components and formula language; salary divisor and cutoff; attendance, leave and holiday treatment; overtime categories; tax and social-insurance bases, bands, ceilings and employer/employee portions; loan/deduction ordering and protected-net rules; gratuity/end-of-service and rehire continuity; currency precision; accounting mappings; approval and payment authority. A payroll revision stores the selected policy version, evaluated inputs, results and legal/reporting breakdown.

Keep final settlement as a typed termination workflow with explicit last working day, employment episode, leave entitlement snapshot, gratuity inputs/results, outstanding obligations, payment and accounting references. Corrections append revisions or adjustment documents. Cancellation and reversal preserve the original approved/paid evidence.

## Manual owner scenarios

1. Save, replay, change inputs, resave and approve; verify revision history, approval reset, log idempotency and stale-version conflict.
2. Attempt salary revision values above decimal(18,2) magnitude and with more than two fractional digits; verify a controlled validation error, then test component values whose independent rounding can differ from an unrounded Gross sum.
3. Recalculate an old unpaid month after changing current inactive status; document the current membership change and the desired effective-dated rule.
4. Exercise mid-month join, mid-month salary change and absence; verify Save blocks rather than silently applying an invented policy.
5. Compare HRM settings changes with payroll output; confirm configuration-only fields currently do not change money.
6. Process a due generic employee deduction, including `DeductionType.Loan` when configured; verify the scheduled amount enters calculation and no paid count changes on Save/Approve. Confirm vehicle/vendor `LoanPaymentPlan` and `LoanEMI` records remain outside payroll.
7. Approve then attempt payment, void and reopen through public PayrollRuns routes; verify these transitions are absent and are not simulated with SalaryVoucher CRUD.
8. Review current and superseded payslips, final-settlement snapshot arithmetic and current-revision payroll report rows in both languages.

## Verification status

Source producers and consumers were compared for the findings above. No application source, configuration, migration, guide or instruction file was edited. Build, runtime, database behavior, SQL decimal conversion, accounting posting, legal compliance and browser/print acceptance remain pending for the owner.
