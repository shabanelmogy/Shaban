# ERP operational approval effect inventory

| Field | Value |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Scope | Goods Received Note (GRN), Item Issue, Stock Transfer, Workshop Job |
| Method | Source-only pre-implementation baseline under `PLAN-00-maintenance-evolution`; see the reconciliation below for later changes |
| Packet drift gate | `Generate-SigmaRecipes.ps1 -Check`: all eight generated packets OK on 2026-10-21 |

## Purpose and evidence boundary

**Historical baseline, not the current GRN/Issue implementation.** The GRN and Item Issue approval source slice was added later on 2026-10-21. Its current code and remaining acceptance work are recorded in `GRN_ITEM_ISSUE_APPROVAL_SOURCE_RECONCILIATION_2026-10-21.md`. The rows below preserve the findings that motivated the change; they must not be read as present behavior for those two documents.

This inventory records when the four operational documents changed stock or job state before the GRN/Issue approval slice, what reversal or terminal action existed, and which downstream records prevented change. The owner subsequently decided that GRN and ItemIssue Save must be stock-neutral and Approve must release their respective quantity effects. A GRN with Issue to Job creates a linked draft ItemIssue only after GRN approval, and the issue requires its own approval before stock is reduced. The owner also selected no PO reservation for draft GRNs, approval-time source-capacity validation, guarded operational cancellation and no negative stock on issue approval. The precise GRN/Issue implementation contract is frozen in `GRN_ITEM_ISSUE_APPROVAL_CONTRACT_FREEZE.md`; other document families remain unresolved. The services, entities, controllers, and stock-report queries cited below are baseline evidence only. No database, build, test, browser, migration, or full-solution scan was used.

## Existing-state inventory before the approval slice

| Document | Save effect today | Approval effect today | Cancellation / void / delete today | Downstream links and guards | Evidence |
|---|---|---|---|---|---|
| GRN | `AddAsync` saves the GRN aggregate immediately. A Stock GRN with `IssueToJob=true` atomically creates an `ItemIssue` for the grouped received quantities. Stock reports count every non-voided GRN line as inbound quantity as soon as it exists. An approved Stock/Asset PO is required only when a PO is selected; received quantities consume the source PO line capacity immediately. | No approval state, history, GET/POST approval endpoint, or approval transition exists. Therefore no separate Approve effect exists; Save is the effective stock/PO-consumption event. | `POST {id}/void` requires a reason and sets the terminal `IsVoided` flag. It refuses a referenced GRN. Stock reports exclude voided GRNs, so void removes their inbound quantity from derived stock without a separate reversal movement. Delete is blocked when voided or referenced. | A live Bill detail or generated/linked Item Issue locks edit/delete/void. PO availability and remaining quantity exclude voided GRNs and include live linked and unambiguous legacy rows. Purchase Order must be approved before it can source a GRN. | `GoodsReceivedNoteService.cs`: Add/Issue-to-job 140-194; source validation/consumption 260-377; detail locks 400-416; PO availability 425-635; void/reference/delete 644-680. `GoodsReceivedNoteController.cs`: void endpoint 34-42. `StockReportsService.cs`: non-voided GRN inbound query 33-40 and 100-107. `GoodsReceivedNote.cs`: terminal void state/method. |
| Item Issue | Add/Update saves issue lines immediately. Stock reports subtract every live Item Issue line immediately; there is no status predicate. A GRN `IssueToJob` save can create the issue in the same save. A requisition-owned issue is another source path. | No approval state/history/endpoints exist. Save is the effective outbound-stock and job-consumption event. | No dedicated cancel or void action. Generic delete removes the aggregate and thereby reopens derived source remaining quantities; linked issues cannot be edited or toggled active. | Optional `GoodsReceivedNoteId` or `ItemRequisitionId` is source provenance; linked sources lock edit/active changes. `JobId` connects consumption to a job and also makes the Job referenced for Job cancellation/deletion. The service validates positive unique item quantities and existence, but does not validate available-on-hand stock. | `ItemIssueService.cs`: validation 75-84; add 86-109; linked update guard 111-130; active guard 136-143; source-aware removal 145-165. `ItemIssue.cs`: source and Job FKs. `StockReportsService.cs`: issue subtraction 41-45 and 108-112. `JobService.cs`: reference guard 1206-1223. |
| Stock Transfer | Add/Update saves destination branch, source branch per line, item and positive quantity immediately. | No approval state/history/endpoints exist. There is no Approve effect. | No dedicated cancel/void action; generic delete removes the aggregate. No downstream-reference guard is present beyond owned-line reconciliation. | The service validates different source/destination branches, positive unique item/source-branch pairs, and existing items/branches. The stock summary/detailed report formulas inspected do not read `StockTransfer`/`StockTransferItem`, so Save currently has **no demonstrated stock-balance effect** in those authoritative reports. It also does not validate available source-branch stock. | `StockTransferService.cs`: add/update/delete 59-117 and validation 119-136. `StockTransfer.cs`: destination header plus owned lines. `StockReportsService.cs`: quantity inputs at 29-57 and 96-128 include opening, GRN, returns and issues, but no transfer rows. `StockTransferController.cs`: generic CRUD only. |
| Workshop Job | Add saves an Open Job aggregate, calculates item/labour/misc/external-work totals and adds an Added log. Update is Open-only and recalculates totals. Job item rows are commercial/workshop detail; they do not themselves create an Item Issue or change stock in the inspected Job service. | No approval state/history/endpoints exist. Close is a lifecycle/business action, not approval: it requires Open state, date validity, optional required quality check, creates a workshop miscellaneous invoice when none exists, then sets `Closed`/`ClosedAt` and writes logs in the Job lock/transaction. `invoice-customer` can create the invoice while leaving Job Open. | Cancel is Open-only, refuses any referenced Job, sets `Cancelled`, and logs it. Delete is Open-only and also refuses references. There is no reopen/unapprove action. | Reference guard covers provisions, GRN, PO/header and lines, PR lines, Item Issue, Item Requisition, Item Return, Bill details, credit/debit notes, JV details, and invoice documents. Close creates/uses invoices and has financial consequences through the invoice owner. | `JobService.cs`: closing summary 728-782; invoice-customer 792-815; cancel 817-840; close/invoice 967-1078; add/update 1080-1179; delete/reference guard 1181-1223. `JobController.cs`: invoice/close/cancel endpoints 45-62. |

## Effect boundary before the approval slice

| Record | Draft exists after Save? | Stock/job effect before any approval? | Existing terminal/reversal behavior |
|---|---:|---:|---|
| GRN | No approval-defined draft state | Yes: inbound stock and PO received capacity; optional same-save outbound Item Issue | Void flag removes GRN from stock reports only when unreferenced; delete otherwise restricted |
| Item Issue | No approval-defined draft state | Yes: outbound stock and Job consumption link | Delete removes the issue; no cancel/void document state |
| Stock Transfer | No approval-defined draft state | No demonstrated balance effect in inspected reports; only transfer rows persist | Delete only; no cancel/void document state |
| Workshop Job | `Open` is an operational lifecycle state, not an approval draft | Save creates/updates Job work and totals; Close creates/uses invoice and closes | Cancelled terminal state while unreferenced; Open-only delete; Close is terminal in current service |

## Logic ambiguity and owner-decision register

| Question | Current evidence/status | Why owner decision is required |
|---|---|---|
| Should Save become draft and Approve become the inventory effect for GRN and Item Issue? | **Owner decision frozen, 2026-10-21: yes.** Current source still applies report-derived stock on Save and has no approval fields/endpoints. | Implementation must change all quantity/capacity readers together, handle historical effective rows without replay, and recheck capacity at Approve. |
| Should GRN approval create the optional Issue-to-Job document, or should that remain a separate saved action? | **Owner decision frozen, 2026-10-21:** GRN approval creates a linked draft ItemIssue; the separate issue approval releases the outbound quantity. Current source still creates the issue at GRN Save. | Approval must be idempotent; the linked draft cannot deduct stock early, and cancellation/deletion must preserve provenance and downstream locks. |
| What should Reject mean for an operational document? | **GRN/Issue resolved:** rejection is terminal for that saved draft and has no stock effect. Transfer/Job remain undecided. | Corrections use a new document for the frozen GRN/Issue slice; do not infer the same rule for unrelated operational documents. |
| May an approved operational document be unapproved? | **GRN/Issue resolved:** no unapprove transition; guarded operational cancellation is separate. Transfer/Job remain undecided. | An approved stock movement must retain its provenance and pass dependency checks before any cancellation. |
| Should void/cancel reverse by excluding the original row or create an immutable compensating movement? | **Owner decision for GRN/Issue:** guarded, audited operational cancellation of the retained original movement with a reason and no negative resulting stock; the effective quantity predicate excludes the canceled movement. Transfer/Job remain unresolved. | Auditability and dependency checks remain mandatory; no accounting reversal journal is created. |
| How should historical saved rows be initialized when approval is introduced? | **GRN/Issue resolved:** null approval remains effective but unproven; no silent backfill or replay. Transfer/Job remain undecided. | Treating old effective rows as pending would incorrectly remove stock; a nullable state preserves their original effect and exposes the uncertainty. |
| What is the stock owner for transfers and branch balances? | **Confirmed gap / unresolved target.** Transfer rows persist but inspected stock formulas ignore them and item stock uses an item-level stock branch label. | An approval transition cannot “post” a transfer until source/destination quantity ownership and report consumption are defined. |
| Must Item Issue and Stock Transfer prevent negative stock? | **Owner decision for ItemIssue:** prohibit negative stock at approval and show item plus shortage. Transfer remains unresolved. | Approval must serialize competing outbound approvals and compare authoritative available quantity; branch/transfer ownership still needs a separate contract. |
| Does Workshop Job itself need approval, or only controlled lifecycle actions? | **Missing business decision.** Current Open/Closed/Cancelled lifecycle plus quality check and invoicing already controls execution. | Adding approval may duplicate Close, block operational logs/time, or delay purchasing/stock links unless its exact purpose is named. |
| If Job approval is required, which actions require it? | **Missing.** GRN, PO/PR details, issues, returns, vouchers and invoices can reference an Open Job today. | The owner must decide whether approval gates requisition, issue, time logs, quality checks, invoicing, gate pass, closing, or none of them. |

## Impact map for a future approval design

| Area | Current producer/consumer | Approval impact that must be designed |
|---|---|---|
| Stock quantities | `StockReportsService` directly aggregates persisted GRN/Issue/Return/opening rows | Every quantity query/report must use one authoritative posted/effective predicate; otherwise list status and stock disagree. |
| PO receipt capacity | GRN source-line queries count non-voided receipts | Pending/rejected receipts must either reserve capacity explicitly or be excluded; concurrent Approve must recheck remaining quantity. |
| Issue-to-Job | GRN Add atomically creates Item Issue | Ownership, idempotency, void/reject dependency and paired approval must be selected. |
| Transfer balances | Transfer aggregate has no demonstrated report consumer | Define source/destination ledger/report integration before approval behavior. |
| Job lifecycle | Job Open/Closed/Cancelled, logs, quality check and invoice paths | Decide whether approval is orthogonal to lifecycle and which transitions it gates. |
| Existing data | All four feature tables | Define legacy status/backfill without replaying stock or invoices. |
| Cancellation/deletion | Four different current patterns | Freeze dependency checks and whether reversal is flag-only, compensating movement, or forbidden. |

## Classification and next gate

| Area | PLAN-00 classification | Reason |
|---|---|---|
| Existing validations, source links and Job reference checks | Keep | They provide concrete ownership/dependency evidence and remain required under any approval design. |
| GRN/Issue stock-effect timing | Source implementation added under the frozen owner decision; see reconciliation report | Save is stock-neutral and Approve is the quantity-effect point in updated source. Migration and owner acceptance remain pending. |
| Stock Transfer stock integration | Create/Refactor after stock ownership decision | Current persisted transfer is not consumed by the inspected balance formulas. |
| Operational cancellation/reversal consistency | Refactor after owner decision | Current void/delete/cancel semantics differ and approval introduces historical decisions. |
| Job approval | Do not create yet | Its business purpose and gated actions remain unspecified; current lifecycle is not evidence for an approval workflow. |

The GRN/Issue slice has a separate frozen Phase 1 contract and source implementation recorded in its reconciliation report. Owner migration, compilation and runtime acceptance are pending. This inventory is the pre-implementation evidence record; use the reconciliation reports for updated source.

**Later reconciliation, 2026-10-21:** the owner froze explicit branch attribution for Issue and Return and approval-time movement for Transfer. The source-level implementation and legacy-data policy are recorded in `STOCK_BRANCH_BALANCE_CONTRACT_FREEZE.md` and `STOCK_BRANCH_BALANCE_FINAL_RECONCILIATION.md`. Transfer is no longer blocked on its branch-stock contract. Workshop Job approval remains blocked: its purpose and which actions it gates have not been selected, and Close may create an invoice through another document owner.

## Source-only verification

- Reviewed the named services, entities, controllers and stock-report consumers only.
- Searched the scoped services/entities/controllers for approval, approve, cancel, void, delete and downstream reference symbols. No approval contract was found for these four features.
- This baseline inventory originally did not edit application source, canonical documents, generated packets, migrations, snapshots, translations or guides. Later source changes are recorded separately in the reconciliation report.
- Owner build, automated tests, runtime/API replay, browser workflows and database/data validation remain pending.
