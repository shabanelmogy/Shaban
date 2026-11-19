| Status | Owner verification pending |
|---|---|
| Frozen | yes |

# Stock movement by branch — contract freeze, 2026-10-21

Owner decisions: saving an Issue or Return creates a draft without stock effect; approval applies the operational effect. A Stock Transfer approval deducts source-branch quantity and adds destination-branch quantity, rejecting a shortage. Every new Issue and Return records an explicit branch; the Issue branch is the source, the Return branch is the destination. Data is experimental; historical movements without a proven branch are not silently assigned to an item's default branch.

Reviewer decisions under Master block 2 rule 6: legacy Issue/Return rows with null BranchId retain their existing *global* stock effect but are excluded from a named branch's balance; a pending row without branch cannot be approved until a draft is corrected. A GRN-created Issue inherits the approved GRN's branch. An Issue created from a requisition receives a branch in its action payload. A new stock GRN cannot be approved without its branch. Historic Stock Transfers had no ledger effect, so their null approval status is read-only and has no effect; this avoids inventing an unrecorded historic transfer. All new Transfer approvals and voids share the stock write boundary with Issue and Return, with shortage/reversal guards. There is no accounting journal for these operational documents.

Authoritative branch balance for one Item/Branch is opening quantity from posted, nonvoided opening-stock journal of that branch + effective stock GRNs of that branch + effective Item Returns into that branch + approved, nonvoided transfers into that branch - effective Item Issues from that branch - approved, nonvoided transfers out of that branch. Effective pre-approval legacy GRN/Issue/Return records with a known branch remain included; unknown-branch movements remain in global stock only. Rejected, draft, voided, soft-deleted or cross-tenant movements contribute nothing. A transfer with identical source and destination is invalid. Approval checks each item/source sum under the serialized stock write boundary; Void checks whether deducting its inbound quantity from the destination would leave a negative balance. Issue approval and GRN/Return void guards use this same branch balance.

Global stock quantity is the original all-branch opening + GRN + Return - Issue sum; transfers cancel globally. The Stock Summary and Detailed Stock reports gain an optional branch filter: when selected, quantity and monetary totals use movements attributed to that branch, and the branch name identifies the selected branch; without a branch filter, existing global totals remain, while transfers have no net global quantity. Historic unknown-branch amounts are therefore visible only in the global view. A selected branch must exist in the tenant.

## Conformance and handoff

| Concern | Owner | Reference | Target |
|---|---|---|---|
| List/editor shell | UI type 01 exception retained for current small one-list editors; UI blocks 1/7/13 | Workshop Job list; shared EditorDialog/EditorTabs | Stock Transfer gains same approval status modal/tab as Issue/Return without introducing a second editor |
| Operational aggregate | BE14 and Master4 | PurchaseOrderService aggregate; ItemIssue source-specific approval precedent | Explicit transition, owned-line validation and stock effect at approval |
| Approval action | UI7/13 | Shared ActionList, EditorDialog and ItemIssue approval component | Server-owned status/history/eligibility; Approve/Reject/Void in one contract |
| Branch lookup | UI16 | Existing BranchService select list and CurrentBranchService default | Explicit required branch in Issue/Return and requisition Issue action |
| Stock report | BE17/UI20 | Existing StockReportsService and shared stock-report-page | Optional branch filter with server-owned quantities and complete report scope |

Stock Transfer list columns: Actions, No, Date & Time, Approval Status. ListVM: Id, No, DateAndTime, ApprovalStatus, IsLegacyUnproven, IsVoided, CanEdit, CanDelete, CanApprove, CanReject, CanVoid. Issue/Return lists add BranchName to their current No/Date/Job/Status grid and ListVM. Add/Update own BranchId and editable header/line fields only. Detail owns BranchId/BranchName and rendered rows/status. Future configurable approval policy remains in Settings, not this form.

2026-10-21 implementation amendment: Stock Transfer's list action opens the approval contract on demand, so its minimal ListVM is Id, No, DateAndTime, ApprovalStatus, IsVoided, CanEdit and CanDelete. `CanApprove`, `CanReject`, `CanVoid`, history and the legacy marker are returned by the separate approval read only. This follows the Master ListVM minimum rule without changing the frozen lifecycle.

Routes remain the existing list and modal editor routes; GET/POST `StockTransfer/{id}/approval` and POST `StockTransfer/{id}/void` use typed server results. Existing Issue/Return endpoints stay. Scope includes GRN approval's generated Issue and requisition's Create Issue action as direct producers, plus stock guards and reports as direct consumers. Migrations and snapshot changes are owner-run only. Source-only verification applies; no build, test, lint, browser, database or migration command is authorized.
