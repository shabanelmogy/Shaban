# Multiple purchase requests into one staged purchase order

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-24 |

Explicit owner answer now authorizes combining lines of several purchase requests
for the same supplier. Supersedes single-PR restriction in the earlier line
selection review and MAIN_EDITOR contract. Keep compact table and inline quantity,
retained picks on Back, explicit local Insert, and main editor Save only.

Backend shape: master/detail, source-line provenance and existing PurchaseRequest
tenant unique-write lock. Add POST PurchaseOrder/from-requests with typed
PurchaseOrderFromRequestsCreateVM: SupplierId positive required, Date required,
BranchId positive, Lines nonempty unique PurchaseRequestDetailId + positive int
Quantity, optional Header with quotation/notes/documents as already frozen.
Server derives all source requests from these line IDs; reject mixed suppliers,
request types or effective currencies, unavailable/nonapproved/deleted source
graphs, invalid references and excess current capacity. No manual/source mixture.
Existing direct single-PR endpoint remains supported and shares these policies.

Each line's existing PurchaseRequestDetailId owns provenance. PurchaseOrder's
PurchaseRequestId remains a compatibility summary: one distinct request retains
it, several requests use null. Add nullable decimal(18,2)
PurchaseOrderDetail.PurchaseRequestAllocatedDiscount (server-owned only) to persist
each source's exact allocated share on its lines. For each request, run the same
source discount/cumulative amount/final-rounding policy, distribute that request's
share deterministically across its selected lines, and sum shares for order
Discount. Never split a combined order's total discount heuristically between
requests. Null shares on legacy single-request orders use the old header discount
fallback exactly once; newly saved/updated source orders store line shares.

Reservations use actual line->request membership, exclude rejected/deleted orders,
and sum stored per-request shares with disjoint legacy fallback. Update recognizes
source rows even when header null, retains owned source FKs and original source
identity/prices, forbids adding new source/manual rows through ordinary update,
rechecks each affected request capacity and reallocates shares deterministically
for edited orders under the existing lock. Soft-deleted/removed rows do not count.
Approval/rejection/delete and PR edit/delete/unapproval/reference/progress readers
must recognize every actual source; preserve existing lifecycle timing/guards.

Read detail lines add nullable PurchaseRequestId and PurchaseRequestNo from the
source navigation for persisted presentation; header-only legacy fallback remains.
No source allocation amount is client-editable. Ordinary manual create and DTOs
do not accept source FKs or shares. No new journal/stock/approval effects.

UI stages a collection of typed {draft, selected lines}. Back retains the active
table's working picks and shows the eligible server-paged request list, restricted
to the same supplier/type/effective currency as retained picks. Reopening a request
restores quantities; selecting another adds its lines. Explicit Insert emits all
valid picks to main PO Details; Cancel preserves earlier main draft. Show source
request number per main line and all source numbers in context; prohibit implicit
duplicate lines. Reopen the picker to amend membership; quantities remain editable
on the main screen. Main Save calls from-requests with IDs, quantities and main
header/files. Direct PR entry remains a populated single-source conversion review.

Ownership: backend core worker owns PurchaseOrderService, IPurchaseOrderService,
PurchaseOrderController, new command VM, PO detail read VM/profiler, PO detail
entity/config only. Second worker owns PurchaseRequestService and directly related
PR read/reference queries only; neither touches the other's files. Root owns
Angular/shared picker, docs, contracts and final integration/source audit.

Schema change requires owner Add-Migration AddPurchaseRequestLineDiscountShares
and database update after review. Agents must not create/edit/run migrations or
snapshots. No builds/tests/lint/runtime/browser/database/commits authorized.
