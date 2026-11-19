# Bill installment payments — accounting decision proposal

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-20 |

Original proposal retained below. Owner subsequently explicitly approved the full saved-value payment accounting rule; the executable handoff is now Frozen in BILLS_INSTALLMENT_PAYMENTS_CONTRACT_FREEZE.md. The remaining partial/interest-amendment/settlement/restructuring slices are still unfrozen. The independent saved Installments read continues.

## Existing-state impact and evidence

Screenshot d proves a Pay Installment dialog with EMI, Interest, Principal; saved Payment Voucher numbers; Paid/Unpaid rows; updated Overall/Paid/Due. Screenshots b/c separately show asset attribution and early settlement. They do not prove posting accounts, partial payments, dates, interest amendments or cancellation semantics.

| Owner | Current state | Decision |
|---|---|---|
| Bill approval | BillService.AddBillJournalLinesAsync credits actual supplier control account with bill total | Keep original saved liability/account/partner; do not silently transfer to FinanceBankAccount |
| Loan terms/rows | LoanPaymentPlan/LoanEMI persist schedule + Paid/Unpaid only | Extend only after payment contract frozen; preserve current history |
| Payment | Payment has JournalVoucherId and PaymentDetails; PaymentService is generic and has no installment posting writer | Extend via bounded source-owned installment action; do not claim the legacy generic Save already posts a loan payment |
| Proven payment composition | PayrollDisbursementService creates Payment + posted source journal under one transaction with idempotency and dedicated link | Reuse resolver/consistency approach, not payroll business rules or its reference module files |
| Linked interest account | LinkAccountsGeneral.InterestExpense exists | Reuse existing LinkAccounts setting; no new invented financial setting |
| Loan finance/recovery accounts | Generic Account references; no source transfer or loan-ledger writer | Recovery account proposed as payment bank; finance account remains descriptive until a separate confirmed transfer exists |
| Allocation | Posted payable Bill credit is settled by paired existing ledger links, under existing locks | Allocate only actual principal debit to the original payable credit; never include interest in principal settlement |
| Loan reports | Read persisted EMI statuses; no partial payment/PV relationship | Reconcile source-owned payment/status reads together if mutation implemented |

## Recommended financial contract for owner approval

1. Pay opens a source-owned payment form prefilled for the next unpaid installment; no accounting effect occurs merely by opening it. An explicit payment date is required, because the source financial period matters.
2. A successful full-installment payment creates one Payment/PV and one balanced posted journal atomically, linked durably to that installment. Debit the **same supplier/account from the original posted Bill payable line** by saved principal; debit existing **InterestExpense** by saved interest; credit the plan's **RecoveryBankAccount** by their total. Validate all accounts as active posting leaves, same tenant, matching effective branch/currency, open payment fiscal period, valid approved/nonvoided source. Never infer a new lender transfer or re-resolve an existing posted liability to a changed control mapping.
3. Pair the actual principal debit with the source Bill payable credit using the existing allocation capacity/lock owner. Interest is not a Bill principal allocation. The outstanding Bill liability and installment history must agree; reject insufficient or ambiguous available source capacity instead of claiming payment.
4. Mark the installment Paid and show the real PV number only after every effect commits. One immutable source link/idempotency key plus server locking prevents double payment, retries or simultaneous clicks creating another PV. Failures roll back all effects. Existing orphan Paid history has no invented PV and is not silently rewritten.
5. Proposed first payment slice pays the **saved full principal and interest**. The screenshot's editable interest needs a separate decision if it may change the principal split while preserving EMI. Do not recast historical schedules or permit partial payments without a defined model. Down payment is not automatically paid by creating a loan schedule.
6. Source-created payment records must be protected from generic Payment Update/Delete/Active paths; any future source-owned cancellation follows the confirmed flag-only Void convention, retains history, excludes the payment from effective balances and updates source settlement atomically. No reversal journals.

Alternative: manually create a Payment in its generic current screen and link it later. Rejected as the default UX because the current generic Save has no installment posting/ownership contract and encourages duplicate entries. A future link-existing-PV option must validate the same source/amount/account/currency/ownership invariants and must never create a second cash movement.

## Unfrozen downstream slices

- Editable paid-interest split, partial installment payments, loan liability transfer and prepayment accounting require separate explicit rules; no guessed source accounts or fake cash movements.
- Asset-wise principal allocation is absent from current model; cannot infer 100% to a vehicle merely because it appears in a Bill line.
- Early settlement requires interest/waiver treatment and asset attribution; restructuring requires paid-row immutability, remaining principal, dates and interest policy. Preserve screenshot evidence and freeze those slices before mutations.

## Migration and validation boundary

A durable installment-to-Payment link and source action/audit fields will require an owner-generated migration after their exact model is frozen. No model/schema changes, migrations, snapshots, DB commands, builds or tests are authorized by this Draft. Owner migration/compilation/transaction/concurrency/API/visual acceptance remain pending. No new financial write is implemented by this plan.
