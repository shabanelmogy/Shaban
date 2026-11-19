# HRM payroll disbursement: bounded source discovery

| Field | Value |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Date | 2026-10-12 |
| Scope | Read-only discovery for root-owned R3 contract freeze; not implementation authorization |

## Owner instructions and evidence

The owner requested salary calculation/disbursement corrections, delegated the suitable payment scope, and explicitly requested payment vouchers and accounting entries now. Earlier accounting deferral therefore does not apply to this slice. `AGENTS.md`, the screen skill and canonical backend blocks 2/5/11/15/18 apply. Backend shape is a stateful financial aggregate (BE15); `InvoiceService` is the approved financial consistency reference. Existing `PayrollRunService` owns revision, approval and tenant lock mechanics; `JournalVoucherResolver` owns posting, periods, accounts, cost centers and journal numbers.

## Existing state

- `Helpers/Models/Staffs/PayrollRun.cs`: run identity, current/approved revision, whole-run `IsPaid`/`PaidAt`; no payment relation.
- `PayrollRunRevision.cs`: immutable calculated totals, lines, base-currency decimal precision and approval metadata; no accrual journal relation.
- `PayrollLine.cs`: saved salary totals and `SourceSnapshot` JSON; no posted component amounts or payment allocation.
- `Business/Services/Payrolls/PayrollRunService.cs`: Save/Approve use `ExecuteUniqueWriteAsync<PayrollRun>`; approval writes metadata/log only. No salary journal writer was found in directly scoped payroll/voucher/resolver sources.
- `Helpers/Models/Vouchers/Payment.cs`: generic payment header with `CustomerId` (Partner FK), method/type/date/branch/reference/note and `JournalVoucherId`.
- `PaymentDetail.cs`: one amount/date/optional cheque number; reusable as generated employee payment amount.
- `Business/Services/VouchersServices/PaymentService.cs`: inherited Add, no posting workflow; Update/Remove only guard active **journal** allocations. Inherited bulk UpdateList bypasses Update, and activation mutates directly. Payroll-owned payment protections must cover all three paths plus Remove.
- `PaymentDetailVM.cs`: omits payment amounts and journal IDs; dedicated payout history must expose voucher/JV identities for reviewability.

## Minimal proposed consistency contract

1. First payout atomically accrues the full current approved immutable revision once. Accrual journal uses `VoucherTypeName.JournalVoucher` / `VoucherSubType.SalaryJV`; one staff payable credit per saved employee line, and exact calculated earning/decreasing-expense/recovery entries.
2. Dedicated disbursement write creates one `Payment` per selected employee, one `PaymentDetail` for its amount and a immutable `PayrollPayment` allocation to its exact `PayrollLine`. Partial positive amounts up to persisted outstanding are supported. Derived whole-run `IsPaid` is true only when every positive saved line is fully settled.
3. Dedicated batch request header holds revision, date, branch, method, reference/note, Guid request key and canonical request fingerprint. Unique tenant/request key gives idempotency; same key with changed payload fails 409. The result returns every generated payment identity, number, amount and journal identity/number.
4. Payout journal: Dr the staff payable account snapshotted in the accrual, Cr selected method cash/bank account. `Payment.CustomerId = PayrollLine.StaffId` is a source-supported reuse: Staff is a Partner.
5. Freeze run revisions from first accrued/disbursed revision even when partially paid. Generic payment Update/bulk Update/Remove/activation reject any payroll-owned payment, including reversed payments. No source accounting history is deleted.
6. Full reversal of one employee payment only: require typed reason/date, open reversal period, append a uniquely related reversal record and a separate posted opposite JV. Original Payment/allocation/JV remain present; original JV remains posted and nonvoided. Recompute net paid from original allocations minus explicit reversal relations.
7. Acquire one explicit transaction **before mutation** and `ExecuteUniqueWriteAsync<PayrollRun>` inside it. Read run/revision/approval/version, idempotency, allocations/outstanding and mappings inside the lock. Prevalidate every requested employee and all accounting references before saves; no partial batch success. Journal engine saves occur inside the same outer transaction. Commit only after payment/FKs/allocations/log/derived flags are persisted; failure rolls back every save and counter reservation.
8. Use a single selected branch for full revision accrual and require subsequent payments use its branch. Base currency only, no FX inference; saved decimal precision must remain ledger compatible. Journal resolver enforces period open, balanced one-sided lines, active leaf accounts and cost centers.

## Exact source-supported account roles

`HrmAccountLinkCatalog` maps Type=Hrm, Value=`HrmSalaryItemType`, SubType=`HrmAccountLedgerRole`, JobType null, LinkSection.Default:

| Salary item | Allowed role and proposed accrual side |
|---|---|
| Basic, HouseAllowance, TransportationAllowance | Dr Expense |
| OvertimeNormal, OvertimeHoliday | Dr Expense |
| AirTicket, LeaveSalary, Gratuity | Dr Expense; Provision is available but its release is **not inferred** without a matched prior benefits accrual |
| LeaveEncashment, Insurance | Dr Expense |
| LoanDeduction, AdvanceDeduction | Cr Staff (asset recovery; auto-link parent Staff Advances) |
| FinesDeduction | Cr Staff (liability; auto-link parent Staff Deductions) |
| AbsentDeduction, UnpaidLeaveDeduction, HalfpaidLeaveDeduction, ExtraDeduction | Cr Expense (expense reduction) |
| Gross | No editable role; not a payable or expense fallback |

`ILinkAccountLookup.GetPartnerAccountAsync(staffId)` resolves salary payable from the single Staff contact group; missing/ambiguous mapping blocks posting. Payment method account resolves using method ID, method branch, payment category and Default link section. Add a narrow HRM lookup using the same exact active leaf and ambiguity rules; do not invent account codes.

Exact known component matches: BasicSalary→Basic; HousingAllowance→HouseAllowance; TransportAllowance→TransportationAllowance; VacationTravelAllowance→AirTicket; LeaveEncashment→LeaveEncashment; EndOfServiceBenefits→Gratuity; LoanRepayment→LoanDeduction; AdvanceSalary→AdvanceDeduction; Absence→AbsentDeduction; OtherDeduction→ExtraDeduction. Operational Deduction.Type Loan/Advance uses the corresponding recovery slot. Calculated final settlement leave salary/ticket/gratuity use dedicated same-name slots. Normal/holiday overtime needs final rounded split amounts.

Other salary additions/statutory deductions have no exact matching current HRM slot. Medical allowance/reimbursement vs Insurance and late penalty vs Fines are semantic decisions, not established mappings. Frozen R3 must either explicitly approve matches, extend mapped catalog slots, or block payout for unsupported components. Never post net expense as a blanket fallback, because that hides asset recovery and statutory liabilities.

## Immutable calculation handoff needed

Calculation should persist final rounded accounting contributions in existing `PayrollLine.SourceSnapshot` JSON, e.g. `AccountingComponents` containing `{ Item, Role, Debit, Credit }`, plus `AccountingUnsupportedComponents`. They must include proration, split overtime, effective deduction installment and final settlement components. Disbursement verifies supported slots and `sum(Debit-Credit) == PayrollLine.NetPay` before adding its staff payable credit. It never re-reads salary inputs or reproduces current salary formulas.

Older snapshots lacking accounting contributions require explicit recalculation/new revision before payout; historical JSON has original salary amounts and cannot prove newly prorated component amounts. Previously approved revision remains historical. Existing `IsPaid=true` without immutable allocation must block new writes as unsupported history, not fabricate vouchers/backfill.

## Existing engine integration and cautions

- `JournalVoucherResolver.NewJV`, `AddLine`, `SaveAndPostJVAsync`, `EnsurePeriodOpenAsync`, `GetMoneyDecimalPlacesAsync`: reuse exactly. Resolver never rounds financial values at save; generator must supply already rounded saved amounts.
- `IJournalVoucherService` is manual screen workflow and refuses generated vouchers; do not call it to approve/delete/void a generated salary or payout JV.
- Existing `JournalVoucherService.VoidCoreAsync` only marks `IsVoided` and does not build a reversal. Ledger queries omit voided originals. Marking original voided **and** posting an opposite JV would therefore misstate the ledger; dedicated payroll reversal keeps original posted/nonvoided.
- Payment numbering already uses generic `CodeCreateService` → `DocumentType.Payment` counter (PAY format; existing BR1 formatting is deferred); journal numbers use `IJournalNumberGenerator`. No feature-owned numbering loops.
- `DependencyResolver` scans Business classes as implemented scoped interfaces. Sealed EF configs are automatically applied. No special registration is needed for a normal narrow service/interface; avoid circular PayrollRun→payment service dependencies.
- New immutable batch/payment/reversal entities and revision accrual FK require an owner-run migration. No migrations or snapshots are authored by agents.
- Period/currency/mappings/method category must be validated. Available payout method scope should begin Cash/BankTransfer. Cheque has PDC lifecycle implications and card/refund types have clearing/fee effects not represented by a salary payout; those remain future development.

## Proposed endpoint and DTO surface for freeze

`GET PayrollRuns/{id}/payments` returns current saved-revision line net/paid/outstanding plus immutable payment and reversal histories. `POST PayrollRuns/{id}/payments` takes request key, revision number, version, date, branch, method, ref/note and selected `{PayrollLineId, Amount}` rows. `POST PayrollRuns/{id}/payments/{paymentId}/reverse` takes current version, reversal date and reason. Responses return authoritative status, amounts and document/JV identities; no client totals, payment type, payable account, journal ID, paid status or numbers are accepted.

Exact DTO names and messages remain root-owned freeze decisions. Expected errors cover unapproved/current revision mismatch, accounting unsupported/missing snapshot, mapping/method/bank/precision unavailable, invalid selection/amount/outstanding, idempotency conflict, legacy paid history, immutable payment, repeated reversal and closed period. Use GeneralMessage EN/AR keys together.

## Verification and ownership

No application source changed. No builds/tests/lint/browser/database commands, migrations/snapshots, commits/pushes, Graphify or Sigma MCP were run. This document is discovery evidence, not a Frozen accounting contract. Root owns the R3 freeze and later bounded delegation.
