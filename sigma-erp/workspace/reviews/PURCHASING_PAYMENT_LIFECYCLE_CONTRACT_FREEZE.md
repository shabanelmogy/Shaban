# General payment lifecycle and journal

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-25 |

Owner explicitly approves Pending Save, explicit approval creating the journal,
separate settlement, and routing cheques through the existing PDC lifecycle.
Currency feature work is excluded; preserve base-currency posting guard.

Implementation amendment (2026-10-25): Payment list/detail action flags are
server-owned results of the same lifecycle dependencies used by writes. `CanEdit`
requires a live ordinary Pending payment with no installment, down-payment or
payroll owner and either no journal or one valid owned, unshared, unallocated
unposted Payment journal. Detail `CanDelete` additionally requires no approval
history. Detail `CanVoid` requires an ordinary Approved payment with its valid
owned, unshared, unallocated posted Payment journal and an open original period.
The list resolves edit eligibility in a bounded SQL-shaped batch for the returned
rows; it does not issue a dependency query per row.

Extend existing Payment aggregate, not loan/payroll writers: new ordinary drafts
get nullable ApprovalStatus=Pending, append-only approval history, IsVoided and
reason. Existing source-generated Payment rows keep null status and their current
posted journals, read-only through ordinary Payment actions. No historical
automatic approval/backfill. Keep immutable loan/down-payment/payroll ownership.

Ordinary payment has required live branch, date, partner, payment method and one
or more positive money-precision amount rows. Resolve actual method type/category/
branch and linked account at approval; do not trust submitted type/account.
Method must allow payments. Dr resolved partner control account, Cr configured
payment-method cash/bank/clearing account, amount=sum rows. No automatic allocation
or tax/fee/commission entry. Bank transfer uses the payment method's configured
posting account; no guessed bank. Cheque is not accepted by this generic posting
path: UI provides existing /ChequesPayable route, whose own maturity writes the
bank effect. No duplicate PDC journal. Other method types retain their actual
configured credit role. Both accounts must be active posting leaves and distinct.

POST/PUT Payment becomes full-snapshot amount-row aggregate with owned saved row
IDs; client excludes audit/subscription/approval/totals. Save creates/edits Pending
without a journal. GET detail/list expose read status/canEdit and saved labels.
GET Payment/{id}/approval returns existing normalized shared approval contract;
POST same route receives {approvalStatus,reason?}. Pending->Approved or terminal
Rejected; Approved->Pending unposts only owned unshared valid journal, no live
allocations/source-owned dependency and original period open. Reject/UnApprove
require reason1..500. Approved Void retains journal/number/history and marks both
void, no reversal; collect reason and require original period open and no live
allocations. Delete only Pending with no financial dependency; retain source
history. Generic bulk/active paths cannot bypass these guards. The same allocation
lock protects competing actions; resolver multiple saves roll back atomically.

UI uses existing Payment routes/create and details plus edit/view aliases, shared
routed financial shell, typed amount rows, FieldError, shared Approvals tab/status
panel and Log. Existing list gains actual status and Edit action. No alternate
palette or universal financial writer. Dedicated installment/payroll journals
remain readable but cannot use ordinary actions. Guide describes Save/Approve,
separate allocation from Bill and cheque path. Migration needed for lifecycle and
log fields; owner generates/applies it; agent never touches migration/snapshot.

## Source-conformance amendment — 2026-10-25

The verified existing cheque destination is /PDCPayable, superseding the draft
/ChequesPayable spelling above. Actual source action flags now cover ownership,
validity, allocation and retained approval history through PaymentService.Read.
The list uses flat BranchName/CustomerName/PaymentMethodName, replacing oversized
nested detail DTOs; its Angular producers/consumers changed together. PaymentType
is server-derived and removed from Add/Update input. Header+amount rows are one
full-snapshot write; child-only writes check the root approval concurrency token.
The original Payment/JV history remains retained; ordinary active/bulk endpoints
return an aggregate-workflow failure. Customer and payment-method GetSelect use
root reference cache with finite bootstrap, active bindings, success invalidation
and verified post-commit type topics; operational choices remain uncached.
