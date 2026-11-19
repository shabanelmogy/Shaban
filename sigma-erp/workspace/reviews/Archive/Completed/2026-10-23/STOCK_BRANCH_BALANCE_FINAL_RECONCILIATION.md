| Status | Owner verification pending |
|---|---|
| Implemented — source-only | yes |

# Stock branch balance and transfer approval — final reconciliation, 2026-10-21

## Scope and decisions

The owner confirmed: no reservation at draft save; stock changes at approval; no negative balance; an approved movement may be canceled only with a recorded reason and a safe reversal; GRN and its Issue to Job require separate approvals; transfers move quantity between the source and destination at approval; Issue and Return have explicit branches. The owner described existing data as experimental. Historic null-branch movements remain global and are never silently assigned to Item.StockBranchId. Historic transfers with no verified approval status are read-only and have no newly invented branch-ledger effect. The frozen handoff is `STOCK_BRANCH_BALANCE_CONTRACT_FREEZE.md`.

The action contract is draft → Approved or Rejected, then only an approved transfer may be voided. A transfer void removes its stock effect only if the destination still has the quantity. Issue approval checks its source branch. Return approval checks the same job/item/source branch and adds quantity to its selected receiving branch; Return and GRN void check their branch balance. The approval decision and void reason are persisted with a separate history row. No accounting journal is created for these operational movements.

Stock Transfer grid columns: Actions, No, Date & Time, Approval Status. Its list VM is Id, No, DateAndTime, ApprovalStatus, IsVoided, CanEdit, CanDelete. The approval read owns CanApprove, CanReject, CanVoid, legacy marker and history. Issue/Return grids include BranchName; their list VMs include that name and current status/action fields. Add/Update contain explicit BranchId, while detail reads expose BranchId/BranchName. Requisition Issue action now submits BranchId. GRN-generated Issue inherits its GRN branch. AutoMapper projects only the required labels and action flags; server services own balance calculations.

The optional branch filter on Stock Summary and Detailed Stock Report counts only attributed movement of the selected branch and includes approved transfers in and out. The unfiltered report remains global; transfers have no net global effect. A selected branch must exist. Historic unknown-branch movements appear only in the global view; an old effective issue without a branch blocks new stock deductions for its item until reconciled.

## Source conformance

| Concern | Canonical owner / approved reference | Result |
|---|---|---|
| Entity/EF, approval action, owned children | BE14; ItemReturn and PurchaseOrder approval shapes | Transfer aggregate, history, branch navigation, guards, owned-line write protection |
| List/editor, status modal and tab | UI type 01; UI7/13; shared EditorDialog/EditorTabs and ItemReturn approval UI | List badge and modal, editor tab, typed service and states |
| Branch lookup and validation | UI16; BranchService and CurrentBranchService | Required Issue/Return/Requisition Issue branch; server existence check |
| Reports | BE17/UI20; shared stock report page | Optional branch lookup, server balance projection and transfer movements |
| In-app guide | Master block 7; Stock guide route | `src/app/modules/UserGuide/content/stock-guide.ts` updated for all movement and branch-report topics |

## Source-only checks and owner handoff

Reviewed scoped backend and frontend diffs separately. `git diff --check` found no whitespace errors; it emitted only existing line-ending warnings. Scoped search found no conflict markers. No build, test, lint, browser, database, migration, commit, push or deployment command was run. The working tree contained extensive pre-existing Bill, purchasing, GRN and instruction changes; they were preserved. The required recipe drift check was current before implementation.

The ERP-wide approval evolution plan now records GRN, Issue, Return and Transfer as implemented at source level, while leaving the unrelated document families and Job approval contract pending.

**Owner verification pending:** run the application's compile and a migration after reviewing the schema diff. Suggested migration name: `AddStockBranchAttributionAndTransferApproval`. Verify draft save has no stock effect, approve Issue/Return/Transfer applies the correct branch effect, insufficient source stock is rejected, approved transfer void is blocked after downstream use, and selected-branch report quantities reconcile with the global total. Exercise both languages and the Approval modal/tab. Existing null-branch records must be reconciled deliberately if they affect an item to be deducted.

Suggested backend commit message: `Add branch-attributed stock approval and transfer balance guards`. Suggested frontend commit message: `Expose stock branches and transfer approval workflow`.
