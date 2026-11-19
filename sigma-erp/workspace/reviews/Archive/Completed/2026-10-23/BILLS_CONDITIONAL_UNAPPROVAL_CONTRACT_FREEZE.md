# Bills — conditional UnApprove

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-20 |

## Owner decision and authority

Owner explicitly says implement the discussed conditional UnApprove: an approved Bill may return to an editable draft when there are no subsequent payments/allocations/paid installments and its original posting period remains open. This supersedes the previous Bills-only terminal-Void-only restriction, not the application-wide flag-only Void rule. Void remains independent and creates no reversing journal. No new permission/configuration/approval Settings screen.

AGENTS, sigma-screen-refactor skill, Master4/5/7 and BE15 govern. Initial all8 recipe checks pass; use phase01/02/04/05/06, phase03 only for existing View action wiring. Parent remains UI screen08/BE15 financial document; action uses UI7 typed ActionList, shared confirmation, LoadingService and existing Result transport. Actual references read: InvoiceService financial source ownership; JournalVoucherResolver.UnpostAsync and AccountingPeriodService open-year/month behavior; shared ConfirmationDialogService declarations and existing Bill approve UI wiring. No new dialog/editor shape.

## Impact / evolution choice

| Owner | Decision |
|---|---|
| Existing POST Bill/{id}/unapprove and IBillService | Extend disabled implementation; keep exact route/bodyless payload/Result |
| Bill domain + BillApprovalLog | Extend with explicit Approved->NotApproved decision; append audited NotApproved using existing persistence audit, preserve previous decisions |
| Journal ownership/resolver | Reuse source-owned UnpostAsync, retain original header/number/lines/FK; no opposite journal or posted-row deletion |
| List/detail | Add minimal canUnapprove:bool; server owns eligibility; no new grid column/filter |
| Read period | Batched original-date/year/month checks, no per-row EnsurePeriodOpen calls and no new fiscal-period public API |
| Existing Approve/Edit | Reuse approved-state guards and reapproval rebuild of owned unposted journal; recheck dependency locks and snapshot validity |
| Void | Keep existing independent date/reason flag-only cancellation and its own guards |

## Frozen eligibility and transition

1. Only explicit ApprovalStatus.Approved, nonvoided Bill. Unknown/null historical approval is read-only for this new transition; do not invent approval provenance. Draft/rejected/voided -> UnApprove rejected409.
2. Positive total requires the unique same-tenant live generated Bill/JV linked by its source FK, posted/nonvoided, valid balanced one-sided live same-tenant lines/effective source branch and one original supplier payable credit equal to Bill.TotalAmount. Reject shared/foreign/deleted/malformed journal ownership. Use stored original source, not current supplier account mappings.
3. Block any live allocation touching either header or actual detail parent of the original journal, including malformed/header-only history; do not manufacture eligibility by ignoring ambiguous reservations. Block persisted Paid EMI history (including retained/deleted related rows), any retained BillInstallmentPayment source link for Bill/its owned EMI, and live positive DebitNoteAllocationDetail dependencies whose parent is live same-tenant nonvoided. No deletion/unlinking/auto-payment to unlock a Bill.
4. Original JV date must be in exactly one live Open fiscal year, its stored fiscal-year identity (if present) must match that open year, and the matching MonthClose must not be Closed. Approved zero-total Bills with no JV use Bill.Date and the same period rule. Linked zero-total journals remain unavailable for this transition, consistent with the existing review requirement; don't invent a zero journal accounting workflow.
5. Expose canUnapprove only when all above checks pass; period queries batch candidate dates, years and months. POST reuses authoritative eligibility under allocation->PurchaseRequest tenant locks, rechecks through resolver period/dependency guards, unposts original JV and appends NotApproved in the same transaction/save. No partial state on conflict/failure. Unknown actor/time values are never accepted from client; existing append-only persistence audit stamps the decision.
6. UnApprove keeps saved amounts, tax, documents and loan schedule. The source Bill becomes NotApproved, its original journal becomes unposted/NotApproved, and existing Edit/Approve become available if still valid. Reapproval validates then rebuilds/posts the same owned unposted journal. The independent canceled state stays terminal. Audited Bills remain protected from deletion.
7. A positive retained original journal followed by a zero-total edited Bill must not be re-approved while silently leaving obsolete draft journal amounts. The source-supported linked-zero case requires review: fail reapproval safely with a localized conflict before mutation rather than deleting/unlinking historical source identity or inventing an empty posted journal. Ordinary new approved zero Bills without a JV still support UnApprove.

## UI/API conformance and ownership

Safety refinement (2026-10-20 final source reconciliation, supersedes the live-only DN assumption in eligibility item3): any retained positive same-tenant DebitNote target history blocks correction, including voided/soft-deleted notes and target details. CounterPayable stores proportional expense/tax credits derived from the old Bill journal; after source editing, merely restoring the old note would reuse obsolete credits even if the Bill was reapproved. This implements the owner's no-subsequent-dependencies concept conservatively, without a new revision/fingerprint/rebuild or historical deletion workflow. The same guard applies to Edit/Approve and read flags. The historical live-only assumption remains above as decision history.

Integration addendum (2026-10-20): a directly dependent DebitNote restore/approval path must apply the same live posted Bill target gate as its picker and Add/Update validation. After a voided DebitNote stops blocking correction and the Bill returns to draft, restoring that DebitNote must not silently reconnect a posted transaction to the unposted Bill. Extend the existing target guard only: reject deleted/foreign/voided Bills or missing/deleted/voided/unposted source journals. Reuse existing failure transport; no new API, schema, accounting effect or independent DebitNote workflow.

List/detail read VMs add canUnapprove only; no Add/Update fields or persisted schema additions. Mapping ignores the calculated flag. Angular service adds typed bodyless unapprove. List menu and View header use server visibility, transient busy guards, shared warning confirmation describing return to draft/unposting, paired global loader/finalize, declared+HTTP inline errors and existing same-page/detail refresh. Keep current Installments/Journal/Allocation children and busy/navigation guards intact. Exactly one global success-feedback owner.

Backend worker owns domain/service/read flag/mapper/VM and backend resx changes; frontend worker owns typed models/service/list/details wiring. Root owns frontend translations, in-app Bills guide, canonical BE15/skill reconciliation, packet regeneration, artifacts, integration and final audit. Disjoint ownership; preserve all unrelated owner/peer changes. Existing old contracts remain historical with a superseding cross-reference.

No migration needed for this slice: existing approval state, log, JV posting fields and financial-period data suffice. Earlier owner migrations for Bills/loan payments remain independent. No migration/snapshot/DB/build/test/lint/browser/commit/push/deploy commands. Syntax/source review only; owner must verify approve->unapprove->edit->reapprove, dependency/period/ownership rejection, race with payment/allocation/Void, zero/legacy states, UI refresh/RTL/theme and audit continuity.
