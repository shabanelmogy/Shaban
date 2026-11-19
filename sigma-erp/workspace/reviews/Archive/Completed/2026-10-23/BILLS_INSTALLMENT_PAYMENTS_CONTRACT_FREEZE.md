# Bill installments — full scheduled payment

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-20 |

## Decision and scope

Later owner scope (2026-10-21): the separate Frozen `BILLS_LOAN_LIFECYCLE_CONTRACT_FREEZE.md` now extends the original full-payment slice with audited rescheduling and early settlement. It reuses this contract's source-owned accounting and immutable payment evidence; the original exclusions below remain historical for this initial slice. No general partial-payment, principal writeoff, asset-attribution or arbitrary interest-amendment workflow is implied.

Owner explicitly approved the proposed accounting rule in this chat: debit saved principal to the supplier account in the original posted Bill journal, debit saved interest to existing LinkAccountsGeneral.InterestExpense, credit total to RecoveryBankAccount, create/link PV and allocate principal to the Bill. This freezes the full saved-installment Pay slice proposed in BILLS_INSTALLMENT_PAYMENTS_MAINTENANCE_EVOLUTION_PLAN.md. It extends the independent saved viewer, not unrelated payment workflows. No automatic lender transfer, interest amendment, partial payment, asset attribution, early settlement or restructuring is authorized by this slice.

## API and read contract

- POST `Bill/{billId:int}/installments/{installmentId:int}/pay`, body `BillInstallmentPayVM { requestId: Guid(required nonempty), date: DateTime(required valid calendar date) }`. Client sends no amounts, status, account, supplier, payment ID or tenant. Result success has Id=actual Payment.Id; frontend reloads authoritative plan and parent balances. ToActionResult owns HTTP status. Standard localization and both failure channels.
- Existing LoanEMIDetailVM extends `paymentId:int?`, `paymentNo:string?`, `canPay:bool`; no list child graph. Existing loan-payment-plan endpoint returns these with the actual server-owned statuses/summary. Real PV No only from a durable source-owned link to a valid same-tenant payment; never derive from descriptions or fabricate old Paid references.
- canPay on the earliest live Unpaid row in Date/Id order only, from an explicitly Approved, nonvoided Bill with owned posted nonvoided generated Bill/JV, usable unique original supplier payable credit, consistent saved schedule, all payment history unambiguous and sufficient remaining actual Bill principal capacity. Historical Paid rows without links remain readable but block new payment until reviewed. Other rows omit Pay. The POST revalidates all rules under the same existing allocation->PurchaseRequest tenant locks as Bill Approve/Void/allocation.

## Persistence and atomicity

Add one source-owned `BillInstallmentPayment : EntityBase` in its own file, with BillId/Bill, LoanEMIId/LoanEMI, PaymentId/Payment, RequestId, PaymentDate, Principal, Interest, Amount (all server snapshots). Restrict FKs and unique tenant+LoanEMIId, tenant+PaymentId and tenant+RequestId. Server never accepts these fields through generic DTOs. No generic CRUD/controller for this link. New owner migration required; agents must not create/edit/run migration/snapshot.

One transaction encloses all dependent saves under existing locks, including Payment+PaymentDetail, generated posted JV, source link, explicit paired allocation and EMI Paid status. Resolver owns number generation, valid leaves/period/balance. A retry with the same RequestId/date/Bill/installment and valid saved link returns the same Payment ID without another cash entry; conflicting reuse or a different request for an already paid installment fails409. First mutation starts only after complete validation. Failed Result/exception rolls back all writes, never returns a false success. Do not nest a second transaction if ExecuteUniqueWriteAsync already owns it.

Original payable identity comes from the stored source-owned Bill/JV, not current mutable supplier control mapping. Validate same tenant, branch and base-normalized currency, no shared source JV, no deleted/foreign/invalid source lines and no effective-void history. Save Payment with supplier partner, source branch, actual date, BankTransfer type, actual gross PaymentDetail and source reference; JournalVoucherId points to its own generated Payment/JV. Principal debit carries supplier PartnerId, interest uses InterestExpense only when positive, RecoveryBank credit has no supplier attribution. Reject same bank/liability/interest role accounts and invalid mappings, money scale, nonpositive principal/gross or negative interest; no guessed fallback accounts or extra tax. Payment date cannot precede original Bill/JV date or previous paid installment payment date; do not prohibit a legitimate payment before the installment due date.

Compute principal capacity from effective existing allocations on the original payable line under the existing lock. Reject nonpositive/over-reserved/ambiguous header-only source history. Add one paired JournalVoucherAllocation for principal: target Bill payable credit -> new payment principal debit, with date=chosen payment date. Interest is never allocated to the Bill principal. Allocation-only and down-payment amounts do not automatically change EMI Paid flags.

Linked source-created Payments and PaymentDetails must be protected from every exposed generic update/delete/active/bulk/child mutation path, using existing source-owned payment guards where available. Generated journal edit/post/unpost/void/delete remains owned by source, not a bypass. No new payment cancellation action in this slice; preserve existing financial flag-only Void rule for any future source cancellation. Legacy orphan Paid rows are not repaired/backfilled.

## UI contract

Source-audit amendment: the new source link also snapshots BankAccountId:int and InterestAccountId:int? with Restrict Account FKs, set only by the payment owner. Historical journal credit must equal the saved bank snapshot, and positive-interest debit must equal the saved interest snapshot. Do not validate old interest postings against a later mutable LinkAccounts mapping. Reject a linked payment journal referenced by any other live same-tenant Payment. This strengthens evidence for the already approved accounting roles without changing their financial effect, API input, existing records or migration boundary.

Extend the saved Installments viewer with real PV No and Pay action from canPay. Opening Pay mounts a nested controlled EditorDialog with separate Bill/installment subtitle, read-only saved EMI/interest/principal, one required explicit payment date and Pay primary action. Confirmation is the typed payment form, no second empty confirmation. Its body and parent controls are inert/busy while child is open; Escape/Close during request cannot dismiss or repeat the mutation. Native/typed date controls use shared owner and FieldError. One stable requestId per opened form, including retries. Failed save preserves form and error; success closes only payment form, reloads saved installments and emits parent refresh so list/details current balances and action flags update. No auto-repeat Save on refresh.

Shared EditorDialog/DataTable/FormSection/FieldError/LoadingService own presentation, one global progress owner, both Result/HTTP failures, finalize/destroy/stale guards and EN/AR translations. User preference: compact narrow terms + wide schedule, no duplicate tab titles. Existing draft loan editor remains separate. Unknown/unavailable payment actions are omitted, no no-op buttons.

## Ownership and source-only validation

Integration clarification: the paid viewer refreshes immediately after Pay; the parent may record the successful mutation and refresh its same-page balances/actions when the outer viewer closes. This avoids an existing parent read guard swallowing the refresh or a detail reload unmounting the active child. No stale parent becomes interactive between payment and that refresh.

Historical-read clarification: a retained source Bill/JV cancellation does not hide a real historical PV whose own saved payment/journal/link and exact raw live allocation pair are proven. That identity read permits a canceled original Bill source; its Payment still requires its own generated posted nonvoided journal and snapshots. Active cash eligibility and request replay explicitly reject canceled Bill/source journals; principal capacity remains an effective-ledger calculation only. The shared active OwnsBillJournal transition helper remains unchanged. The new source writer prevents Bill Void while paid installments exist; this correction preserves consistent historical reads rather than creating such a transition.

Backend worker owns all new payment model/config/VM/service+interface/controller/read mappings/guards/resources. Frontend worker owns new nested payment component, saved viewer and typed transport/model/parent refresh/tsconfig. Root owns frontend EN/AR keys, guide, review/contract, final accounting/concurrency/source integration. Independent read-only audit may inspect completed backend writes without edits.

Phases0/1 freeze;2 read flags;3 typed form/read;4 approved payment domain action;5 integration;6 source reconciliation. No build/test/lint/browser/runtime/database/migration/snapshot/commit/push/deploy. Owner-generated migration suggested `AddBillInstallmentPaymentLinks`; owner acceptance must cover accounting balance, same-request replay, competing payment/allocation/Void, rollback and failed-period/mapping/capacity cases.
