# Bills — reschedule and early settlement

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-21 |
| Plan | BILLS_LOAN_LIFECYCLE_MAINTENANCE_EVOLUTION_PLAN.md |

## Authority and limits

Owner authorizes best proposed lifecycle, emphasizing logical validation over reference example numbers. Keep separate Pay, Reschedule and Early Settlement. Extend the previously approved original supplier principal/InterestExpense/recovery-bank payment accounting to full early settlement. Preserve Paid rows/PVs, archive replaced Unpaid rows and retain original Bill principal/tax/JV. Reschedule conserves remaining principal AND interest; settlement uses explicit agreed interest from zero through saved remaining interest. No fees, principal writeoff, capitalization, partial cash, lender transfer, refund, reversal or invented asset attribution.

AGENTS/skill/Master4/5/7, BE15, UI screen08 with nested screen09 action forms apply. Actual Workshop Job close-job and shared EditorDialog/DataTable/FieldError references inspected. Reuse Result/ToActionResult, LoadingService, source-owned payment engine and tenant locks. Initial all8 recipe checks pass. This contract freezes the plan before disjoint implementation.

## Persistence

- Append-only LoanScheduleRevision : EntityBase, own file/config: BillId,LoanPaymentPlanId,RevisionNo,Kind(Reschedule0/EarlySettlement1),RequestId,RequestFingerprint,OperationDate,Reason,PreviousPrincipal,PreviousInterest,Principal,Interest,EMINo,FirstEMIDate. Existing authenticated audit stamps CreatedAt/CreatedBy. Unique tenant+plan+RevisionNo and tenant+RequestId; Restrict FKs. No generic mutable revision API.
- LoanEMI adds nullable CreatedByRevisionId and SupersededByRevisionId, Restrict FKs. Only active Unpaid rows can be archived; no status reinterpretation or deletion. Paid rows/payment links never change. Null new fields preserve existing records. Revision history proves old/new generations by real FKs rather than guessed dates or JSON.
- Effective rows are live owned same-tenant rows without SupersededByRevisionId. Exclude archived rows from active summaries/Pay, retain them in historical read. Reject orphan/foreign/inconsistent revision chains. Header updates through domain: Interest=paidInterest+newRemainingInterest; LoanWithInterest=originalLoanAmount+effectiveInterest; EMINo=paidCount+newRemainingCount; FirstEMIDate=first effective date. Original TotalAmount/DownPayment/LoanAmount/FlatRate/finance/recovery/cheque terms remain; label saved FlatRate as original.
- Any retained revision blocks generic Bill edit/UnApprove/reapproval correction; protect plan/EMI generic mutation and archive bypass. Existing flag-only Void retains history and existing guards.

## Eligibility, validation and atomicity

Require explicitly Approved/nonvoided Bill with exclusive generated posted nonvoided owned source JV, consistent saved schedule and every real Paid PV/link/allocation proof from existing full-payment owner. Unknown/negative/overpaid/ambiguous history stays readable but ineligible. Remaining schedule principal must equal actual effective Bill payable capacity exactly; never use min or silently settle down-payment/external allocation discrepancies.

Inputs require nonempty Guid requestId, matching expectedVersion, valid whole dates, reason nonblank <=500, positive bounded integer count (effective total <=600), increasing monthly dates and storage/precision-valid money. Operation date cannot precede Bill/JV, latest actual payment or revision. Reschedule firstEMIDate >= operation date and > latest retained Paid due date. Settlement replacement EMI retains next Unpaid due date; explicit actual payment date can precede due but not prior actual payments. Validate open operation/payment period through resolver where applicable.

Server floor-rounds equal principal/interest shares and assigns exact final remainder; every principal/EMI >0, interest >=0, sums conserved. Reject counts causing zero principal. Settlement agreedInterest is explicit, scale-valid, between0 and remainingInterest; no principal discount or assumed automatic waiver. Preserve old/new interest in audited history.

Version hashes effective row ids/dates/values/status/payment history, latest revision and actual capacity; concurrent Pay/allocation/revision invalidates it. Prepare is read-only. Commit revalidates under tenant allocation-then-PurchaseRequest locks. Revision/archival/new rows and settlement Payment/JV/link/principal allocation/Paid state share one transaction and rollback on false Result/exception. Reuse existing source-payment core and immutable bank/interest role snapshots. Retained request fingerprint enables identical valid replay without cash duplication; conflicting request reuse fails409. No mutation replay on voided/unavailable source.

## Frozen transport (camelCase JSON)

- POST Bill/{billId}/loan/reschedule/preview and /loan/reschedule: BillLoanRescheduleVM {requestId:Guid,expectedVersion:string,date:DateTime,reason:string,emiNo:int,firstEMIDate:DateTime}.
- POST Bill/{billId}/loan/settlement/preview and /loan/settlement: BillLoanSettlementVM {requestId:Guid,expectedVersion:string,date:DateTime,reason:string,agreedInterest:decimal}.
- Preview Result<BillLoanChangePreviewVM> {actionVersion:string,moneyDecimalPlaces:int,before:BillLoanScheduleSummaryVM,after:BillLoanScheduleSummaryVM,rows:BillLoanScheduleRowVM[]}. Summaries refer to REMAINING schedule; fields principal,interest,amount,emiNo,firstDate,endDate. Row fields date,principal,interest,emi.
- Commit Result<BillLoanChangeResultVM>, entity:{revisionId:int,paymentId:int?}; standard Id=revisionId for Reschedule, actual Payment.Id for Settlement.
- Existing saved plan extends canReschedule:boolean,canSettleEarly:boolean,actionVersion:string|null,moneyDecimalPlaces:int,loanStatus enum(Draft0/Active1/Settled2/Voided3/RequiresReview4),revisionHistory:LoanScheduleRevisionDetailVM[].
- History fields id,revisionNo,kind,date,reason,createdAt,createdBy,before,after,archivedRows,newRows. Row arrays use saved LoanEMIDetailVM ids/status plus createdByRevisionId?/supersededByRevisionId?. Missing PV stays missing. Saved revision terms remain immutable even when newRows later become paid/superseded.
- Loan status differs from Bill Open/Closed. Settled requires proven actual paid history and zero remaining principal/interest with reconciled Bill capacity; schedule/allocations or Bill Closed alone do not prove payment. No new tenant/derived-money write inputs.

## UI, ownership and acceptance

Source reconciliation clarifications (2026-10-21): the settlement wire field remains a required explicit number. The C# VM uses nullable decimal plus Required and an explicit service null guard so omitted/null never binds to an implicit zero; explicit zero remains valid. Currency precision is part of ActionVersion, because a precision change can alter the prepared distribution. Replay requires the full authoritative source/history/capacity proof, including all-paid history, not a partially populated PaymentId or a simplified Approved flag. Ordinary zero-interest Pay keeps its existing eligibility; proposed positive settlement interest resolves and validates its own expense role before any mutation.

Viewer preserves narrow terms/wide active schedule/direct Pay; adds compact separate Reschedule/Early Settlement actions from server flags and revision-history read. Controlled shared typed dialog: title + Bill subtitle, date/reason and count/first date OR explicit agreed interest; readonly remaining principal/current interest. Prepare shows authoritative before/after and generated table. Any input change invalidates preview; confirm requires matching prepared inputs/version. Opening/Prepare never posts. Global loading/finalize, destroy/stale/duplicate guards, inline Result/HTTP errors, retained failed form and dirty-discard remain. Parent inert while child open; no second empty confirmation.

Success reloads active rows/summary/status/history/flags, then parent Bill list/detail refreshes when outer viewer closes through existing mutation-refresh owner. Reschedule also marks parent changed without claiming cash. History uses shared read tables/dialog; no asset division absent saved attribution.

Backend worker owns all backend domain/config/VM/profile/service/interface/controller/resource/guard files. Frontend worker owns Bill models/service/new action/history dialogs/viewer/tsconfig and EN/AR bill keys. Root owns plan/freeze/review, in-app guide, books/skill/packets and final integration/audit. Disjoint ownership.

Owner migration required: AddBillLoanScheduleRevisions, after existing installment payment link migration. Schema before readers/writers; no fabricated backfill. Agent never creates/edits/runs migrations/snapshots. No build/test/lint/browser/runtime/DB/commit/push/deploy. Owner verifies arithmetic boundaries, immutable Paid/history, stale/duplicate/races, rollback, accounting/period/role failures and EN/AR/RTL/theme/narrow layout.
