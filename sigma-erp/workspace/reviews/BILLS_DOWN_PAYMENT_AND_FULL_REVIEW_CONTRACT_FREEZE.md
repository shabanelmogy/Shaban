# Bills — down-payment settlement and comprehensive review

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-21 |

## Authority, scope and existing state

Owner: "تمام كمل المطلوب ومحتاج مراجعة شاملة على شاشة bill" explicitly accepts the proposed source-owned down-payment payment+posting+allocation action. Implement that capability; conduct comprehensive source review of existing Bill workflows, correct confirmed in-scope defects under existing frozen contracts, report unresolved business-policy changes. Earlier approved installment/loan/conditional-UnApprove/flag-only-Void contracts remain. No payments from merely entering financing terms, no automatic historical backfill.

AGENTS/skill, Master4/5/7, BE15 and UI screens08/09 own this work. All8 recipe checks pass at discovery. Applicable PLAN00 and PHASE00..06. Existing read/list/editor/action/loan contracts are inherited, not replaced. UI financial routed editor reference Workshop/Job editor; action-dialog reference Workshop/Job close-job; backend financial service reference InvoiceService and existing JournalVoucherResolver/source-owned installment writer. Shared EditorDialog/FormSection/DataTable/FieldError own presentation. AuthGuard only; no permission API.

Existing: DownPayment reduces financed LoanAmount but creates no cash. Installment payments create real PV/JV/allocation and durable BillInstallmentPayment. Lifecycle requires remaining principal == effective Bill payable capacity. Screenshot shows downpayment2500.50 and mismatch of exactly2500.50; an outstanding financing term must not be assumed paid. General PaymentService currently does not expose the required complete source-owned workflow. Existing unrelated dirty files/migrations/snapshot preserved.

## Impact and alternatives

| Area | Decision | Owner/impact |
|---|---|---|
| Bill create/update, five types, manual approval | Keep | Existing frozen DTOs/tax/domain owners |
| Existing external allocations | Keep | No new cash if already allocated; actual ledger capacity authoritative |
| Dedicated downpayment | Create | BillLoanDownPayment durable link, exact amount/date/bank/PV/request; own entity/config |
| Cash journal construction | Extend/refactor | Existing source-owned bank-payment writer reused for EMI/settlement/downpayment; caller transaction |
| Loan detail read and viewer | Extend | Server downpayment eligibility, paid link, outstanding amount and mismatch explanation |
| Payment/JV mutation guards, Bill correction | Extend | Downpayment source-owned history blocks unsafe mutation/unapproval/edit |
| Financial docs/user guide | Extend | Explain new action and schema/acceptance; same reader/routes |

Reject synthetic EMI row (changes installment count/interest), nullable-EMI reinterpretation (historical identity break), silent automatic payment at Bill save/approve (unapproved cash). Dedicated durable link is additive and minimum compatible source ownership. Owner acceptance covers accounting: Dr original Bill supplier payable, Cr saved RecoveryBank, amount exactly saved DownPayment, zero interest, no separate financing liability or transfer. No amount/account client input. Already-settled external downpayment stays an external settlement; never invent its PaymentId.

## Frozen transport and UI

POST Bill/{billId:int}/loan/down-payment with BillDownPaymentPayVM {requestId:Guid,date:DateTime}; Result id=actual PaymentId. Date required whole valid day >= Bill/JV/latest actual installment payment/latest revision, open period. Exact whole saved positive downpayment only; partial and extra payment unavailable.

LoanPaymentPlanDetailVM extends canPayDownPayment:boolean,downPaymentOutstanding:decimal? (null if unknown),downPaymentPaymentId:int?,downPaymentPaymentNo:string?. These are service-computed read values only. Existing downPayment field remains financing term. Unknown/unreliable capacity returns null+false. Existing matching external allocations => outstanding0+false with no invented link. Can pay iff explicit Approved, live IsLoan/sourceowned exclusive JV, reliable schedule/payment history, positive saved downpayment not source-owned before, effective principal capacity minus remaining schedule principal == full saved downpayment exactly, active valid distinct RecoveryBank/posting supplier account. Do not reuse next EMI interest-account eligibility to decide zero-interest downpayment. After success capacity matches remaining schedule principal, loan lifecycle flags recomputed. Existing Pay is preserved unless a confirmed correctness defect needs correction; no new policy that forces downpayment first.

Viewer narrow terms shows outstanding downpayment/actual payment number and compact Pay down payment action when server allows. Typed shared payment date dialog, fixed amount and bank read-only, stable request id for same-input retry, new key if date changes after submit, dirty/busy/stale/destroy guards, both failure channels. Parent inert during child; changed:void and actual paymentCommitted drive existing deferred parent refresh. Lifecycle hint names pending downpayment when exact gap is known; no backend policy duplicated in UI.

## Persistence, validation and source ownership

BillLoanDownPayment: EntityBase, BillId/Bill, LoanPaymentPlanId/plan,PaymentId/Payment,RequestId,PaymentDate,Amount,BankAccountId/BankAccount. Unique tenant+BillId,tenant+PaymentId,tenant+RequestId; Restrict FKs; decimal18,2; no generic mutable API. Retained deleted link blocks reuse. Guard cross-workflow idempotency collisions with EMI/revision requests. Before any write/replay fully prove Bill/JV/schedule/history, downpayment link/PV/lines/paired allocation/tenant identity and exact amount. Request replay date/bill mismatch conflicts; no replay mutation. Validate two-line Dr original payable+Cr bank, one PaymentDetail, banktransfer, proper account/branch/currency and generated posted live JV. New payment+posting+source link+paired allocation atomic under allocation then PurchaseRequest tenant locks. Revalidate capacity inside transaction; false Result/exception rolls back all resolver saves. No description matching as payment identity. Downpayment history included in latest-payment/version proof and mutation guards on Payment/JournalVoucher and Bill correction; no orphan or canceled link can manufacture settled status. Source-owned history is retained.

## Review and acceptance

Comprehensive inventory: list/filter/columns/ListVM/report/print, create/update/GRN selection, domain/tax/loan arithmetic, approval/unapprove/void/journal, supplier debit and ordinary allocation, saved installments/pay/reschedule/settlement/history, FK/tenancy/transactions/idempotency, UI typed forms/routes/translations/loading/cancel/dirty/parent refresh, user guide/schema. Record exact source findings and fixes separately from owner-runtime pending. No broad unrelated refactor.

Owner migration required AddBillLoanDownPayment after AddBillLoanScheduleRevisions and earlier installment link/lifecycle schema. Agent never edits/creates/runs migration/snapshot. Build/tests/lint/browser/runtime/DB/commit/push/deploy prohibited without current owner authorization. Source syntax parsing only. Acceptance owner-run: downpayment0/positive, missing roles, already externally settled, partial/mismatched allocations, paid EMI retained, replay/date change/concurrent Pay/allocation/Void, closed period rollback, independent bank-supplier amounts, history mutation blocked, eligible lifecycle after success, EN/AR/RTL/theme/narrow/short height.

## Confirmed review correction — draft aggregate deletion

Independent source audit found RemoveCoreAsync delegates base.RemoveAsync, which
only soft-deletes the Bill header and omits the active owned BillDetails/loan
plan/EMIs and canonical inbound usage validation. Existing BE8/14/15 owned-row
contract supplies the correction: soft-delete the already-deletable draft's
owned graph under its existing allocation->PR transaction and inbound-reference
checks. This does not permit deleting posted/audited/paid/revised/downpayment
history or change terminal Void. Backend worker implements this directly related
confirmed finding; no hard deletion or data rewrite is authorized.

## Confirmed review corrections — editable loan/reapproval/error paths

Existing frozen draft editing permits changing loan terms and toggling IsLoan;
reapproval retains/rebuilds the source journal. Audit found two violations:
(1) replacing a softdeleted LoanPaymentPlan with another sharing its unique
BillId conflicts with the retained unique FK slot; reconcile the editable plan
rather than invent a second retained owner. Handle off/on without restoring any
paid/revised/DP history or changing historical data. (2) retained deleted old
JV rows after reapproval were reloaded by Includes and rejected by live payment
and correction readers; exclude deleted source rows while still rejecting live
foreign/invalid rows, leaving actual immutable payment proof strict.

Configuration exceptions for fiscal-year overlap/link accounts must use the
existing localized business-result channel in Approve/Void/Pay, consistent with
other source actions, not become generic500. No policy/period bypass is allowed.
Frontend validation can enforce only already-frozen backend loan constraints:
DownPayment < BillTotal, manual Interest < EMI, count <=600 and positive
principal; no new rate or financial formula. These are confirmed corrections
within the comprehensive Bill screen review.
