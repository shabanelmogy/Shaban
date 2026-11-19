# HRM repair, payroll calculation and disbursement — implementation plan

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-12 |
| Authorization | Owner requests current error fixes, correct payroll calculation/disbursement, and a future development plan |

## Scope and first-slice freeze

This plan is Frozen for independent confirmed repair slice R1 below. Calculation and accounting disbursement slices are gated by their separate domain/API freeze, after discovery of the existing settings and ledger/payment owners. This is not authority to invent missing monetary policy. Existing source changes in StaffTimesheet list TS/HTML and HRM guide are retained.

Owner continuation 2026-10-12: payout scope delegated to reviewer; payroll disbursement must now be linked to a payment voucher and accounting entries, superseding earlier journal deferral for this slice. Payroll calculation must read existing HRM setting options. Proposed scope is employee-level payments with partial balance tracking, extending PayrollRun and the existing payment/journal owners; no manual IsPaid toggle or parallel legacy SalaryVoucher calculator.

## Existing state / impact map / classification

| Area | Current owner and behavior | Decision | Impact / slice |
|---|---|---|---|
| Numeric write errors | Timesheet/Deduction VMs, UI/import and decimal(18,2) storage | Refactor representability validation; no silent rounding or schema change | API/UI/import and feedback; R1 |
| Leave filter | Applied checkbox snapshot and generic boolean equality | Refactor unchecked positive restriction to omission | List/export/navigation; R1 |
| Attendance/Duty clocks | Two writers of same Attendance; Duty truncates original precision | Refactor metadata-only preservation and clock transport bounds | StaffService + direct Duty UI/HRM consumer; R1 |
| StaffRole navigation | Child guard exists, list route omits delegation | Extend existing guard | Route/list only; R1 |
| FinalSettlement review/output | Authoritative server snapshot, concealed mandatory policy and incomplete output | Refactor existing overview with shared owners and complete snapshot disclosure | Current component/models/export, no calculation formula change; R1 |
| Driver report | Complete rows and summary from separate mutable queries | Refactor consistent read scope | Dedicated report service; R1 |
| Department paging | Custom raw paging override | Refactor to inherited list hooks/projection/count | API metadata/current UI compatibility; R1 |
| Final month/i18n | Month9999-12 overflow, one Arabic label absent | Refactor boundary handling / extend translation | Direct monthly paths and vocab; R1 |
| Payroll calculation | Immutable salary revisions, setting owner, source hash, blockers for unconfirmed proration/absence | Keep lifecycle, extend same calculation owner based on actual settings | Salary inputs/settings/PayrollRun snapshots/reports; R2 gate |
| Payroll payment | IsPaid/PaidAt prepared, no current writer; generic Payment lacks salary allocation context | Extend payment/journal owner; create only necessary immutable salary allocations | Payroll/payment/JV/period/accounts/concurrency/UI; R3 gate |
| Future business | Leave ledger, regularization/calendar, country policies, statutory obligations and auth | Plan only | Separate future roadmap file; R4 |

## Options and decisions

Repairs retain representable current values rather than round them silently. Current two-decimal storage is the evidence; wider hour precision would require a separate schema contract. Duty preserves unchanged saved seconds/fractions on minute-level metadata edits; changed/cleared clocks still change/clear normally. No overnight policy added.

Payroll alternatives: a whole-run Paid flag is insufficient for individual/partial payments; selected employee payments with immutable allocations and derived paid totals provide auditability and future extension. This choice is allowed by the owner's delegated payout-scope decision. Reusing generic SalaryVoucher client totals is rejected because it has no employee/revision/allocation authority. Existing HRM settings must be read before choosing daily-rate and deduction policy.

## Dependency-ordered slices

| Slice | Outcome | Gate | Main phases |
|---|---|---|---|
| R1 | Resolve confirmed audit F01–F11 with current compatible business contracts | Frozen `HRM_REPAIR_SOURCE_CONTRACT_FREEZE.md` | 01–05 implementation, 06 reconciliation |
| R2 | Correct settings-driven payroll calculation, preserve approved/paid historical facts | Settings/source discovery and exact policy/API freeze | 01,03,04,05,06 |
| R3 | Voucher-linked accounting disbursement with immutable employee allocations and outstanding balances | Ledger/accounts/fiscal-period and payout contract frozen | 01–06 |
| R4 | Authored future development roadmap and bilingual user-guide handoff | Actual final source and open-policy inventory | 06 |

## Verification and compatibility

Source-only execution per AGENTS; no builds/tests/lint/runtime/browser/DB commands, migrations, commits or deployment. Review full scoped diffs in both actual repositories, types/imports/templates/resources, request/response fields, concurrency and reachable save boundaries. New schema reports owner-run Add-Migration with preflight/rollout instructions; historical payroll/payment/JV data is never rewritten. Required guide updates use existing HRM/Staff/Accounts topics and reader rather than a new viewer.

Owner acceptance will cover invalid values, retained clock precision, checkbox and exit behavior, settlement breakdown/export, same-read report output, version races, payment replay/partial balance/accounting reconciliation and responsive/RTL/dark/print checks. Future roadmap targets remain Draft until independently approved/frozen. No uncertain rule is implemented merely to remove a blocker.
