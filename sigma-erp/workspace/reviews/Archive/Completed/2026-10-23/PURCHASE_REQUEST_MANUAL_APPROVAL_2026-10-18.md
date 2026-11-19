| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Purchase Request manual approval activation

Owner decision2026-10-18: enable Approve and Reject now; lock editing after either decision; create POs only after approval. Approver roles, permissions and configurable Approval Cycle remain deferred. This continuation supersedes the pending-only approval presentation and ungated PO creation in PURCHASE_REQUEST_PO_EVOLUTION_2026-10-18.md. Earlier PO allocation/remaining rules remain.

## Inventory / impact / option review

Existing PR has no approval state or history. Approval context component is an empty preparation used by list and routed editor; PO conversion is implemented with source locks. Existing enum ApprovalStatus is Approved=0, NotApproved=1, Rejected=2. Workshop JobEstimation owns the approved pending-to-terminal reference. Reuse that lifecycle and existing confirmation service, not its job/accounting rules. Options shown to owner: terminal Approve/Reject and PO gate (chosen); reversible approval; recording-only approval. No decision remains open for this slice.

| Area | Classification | Target |
|---|---|---|
| PR aggregate and EF | Extend | Server-owned ApprovalStatus initialized NotApproved; explicit DB default1 for historical rows, concurrency token. New owned append-only PurchaseRequestApprovalLog with status and existing audit identity/date. No invented employee identity, role or cycle level. |
| Writes | Extend | Pending -> Approved or Rejected only. Approve allowed for saved live PR, including requisition-linked PR. Reject additionally requires no live source POs (legacy pending rows can already have POs; preserve their consistency). No unapprove/reopen. Pending-only update and delete on all direct/batch writers; retain existing requisition/source-basis rules. |
| PO conversion | Extend | Draft and Create require PR Approved. List/detail canCreatePurchaseOrder = Approved plus remaining capacity. Existing linked POs retained, including legacy rows; no backfill approval or fabricated historical log. |
| Approval history | Create | Append one decision log atomically with state transition; source audit CreatedBy/CreatedAt names current authenticated tenant session, not a verified internal employee. Level/Role/Reason remain empty because not configured/collected. |
| UI | Extend | Current Approval Cycle action opens same component with real status/history and Approve/Reject buttons. Saved View tab allows decisions; Edit tab shows saved history with save/view guidance; unsaved Create asks to save first. Add list Approval Status column and optional advanced status filter. |
| Permissions | Keep deferred | Existing authentication and tenant Repository remain. Catalogue Approve/Reject actions only; no role, permission or actor resolution/enforcement introduced. |

## Frozen API / projections

- `GET PurchaseRequest/{id}/approval` -> `Result<PurchaseRequestApprovalVM>` with `purchaseRequestId`, `no`, `supplierName`, `amount` (sum of live pre-tax line Amount before discount, preserving the existing context), `approvalStatus`, `canApprove`, `canReject`, `history`.
- Each history entry: `id`, `approvalStatus`, `statusDate` (nullable audit date), `user` (nullable audit identity). Ordered by CreatedAt then Id. No invented cycle, role, rejection reason or identity labels.
- `POST PurchaseRequest/{id}/approval` body `{approvalStatus}`. Enum annotations plus business allowlist Approved/Rejected. Standard Result id. Fresh state must be NotApproved; all reads and the graph save under existing tenant PR ExecuteUniqueWriteAsync boundary, same as PO conversion and PR updates/deletes. No repeated-decision log on stale/double call; return conflict409.
- Add/Update request VMs have no approval inputs; mappings explicitly ignore state/log fields. Ordinary Add, batch Add and ItemRequisition-created PRs default NotApproved. Domain method records legal state transition and adds owned log.
- List adds `approvalStatus` (displayed) and `canDelete` (delete visibility); existing `canEdit` now Pending and not requisition-linked. Detail adds `approvalStatus`; canEdit same state rule. Approval action flags/history come from dedicated read contract, not duplicated in editor DTO.
- Advanced filter `approvalStatus` serialized as normal typed filter with numeric values0/1/2, empty=all, no initial restriction; server enum filter and sort support. Preserve active filters, page, sort and export headings.
- A decision that moves the last row out of an applied approval filter steps back one page if necessary, consistent with existing delete paging. After success, UI immediately locks terminal actions and waits for fresh backend flags before enabling Create PO; failed View refresh offers a safe Retry.
- Approved/Rejected edits/deletes return409; approval status concurrency token is forced into root update when pending aggregate updates only touch children. The existing source lock is the primary cooperative write boundary. Source-linked PO edits still follow existing capacity/allocation rules; no unrelated PO workflow restriction.
- Reviewer decision (owner standing rule): before final approval, reuse PO-compatible source readiness checks (description<=1,000, existing type/reference validity, source amount/storage bounds and discount within pre-tax amount). Otherwise the terminal lock could make a previously saved PR impossible to convert and impossible to correct. No new positive-quantity rule or accounting effect is introduced; rejection does not need conversion readiness.

## Conformance / execution plan

| Concern | Owning blocks / actual reference | Shared owner / target |
|---|---|---|
| Lifecycle | Master4, BE12/14, skill4.5; JobEstimationService.ChangeApprovalStatusAsync / Update / Remove | Explicit PR transition, source write lock, owned history, state-backed can flags. |
| Confirmation/action | UI7/9/22/28; JobEstimation list confirmApproval; ConfirmationDialogService | Feature approval component owns one confirmation/mutation path reused from list and View; pending requests freeze close/navigation. |
| Layout/table/status | UI6/13/15/24; existing PR EditorTabs and DataTable | No feature palette or new shell; real status/history replace deferred warning. Empty role/level/reason displayed as em dash. |
| Persistence | BE1/2/3/8/14; JobEstimationLog and config | EntityBase audit identity/date; append-only child; tenant FK/index; explicit migration owner. |

Reference action coverage: View/Edit/Delete/Approve/Reject supported with target flags. Create Job and Workshop operations Not Applicable; PR downstream action remains existing partial Create PO. No unapprove/reopen/revise added. History was already in screen scope from owner screenshot and existing tab; it now records real decisions.

Packet check: all8 recipes passed2026-10-18 before use. Apply PLAN00, PHASE00/01/03/04/05/06. Root owns Angular/guide/translations/integration/review; bounded backend worker owns backend only after this freeze. Both repos have prior uncommitted PO work; frontend also has unrelated topbar/layout changes. Preserve all. Source-only verification: no builds/tests/lint/browser/database/migration/Git writes/deploy.

Owner migration required: `AddPurchaseRequestManualApproval` (new status with explicit pending default, concurrency metadata, log table/FK/index). If prior PO-link migration is still pending, owner may include both sets in the owner-generated migration. No migration or historical data changes are executed here. Historical PRs become pending through default; existing POs are kept, approvals must be reviewed manually; do not infer approval from an order.

No new global guidance is proposed. Existing direct-approval lifecycle and shared controls are reused. Owner compilation, API/EF/concurrency, responsive/RTL/themes and workflow acceptance remain pending. Final source reconciliation follows below.

Catalogue clarification: the one POST carries the target decision in the body. It uses the existing single `PermissionCatalogAction("ManageApproval")` classification, GET uses View. Separate future Approve/Reject permission enforcement is deferred; no shared catalogue/attribute extension is introduced merely to classify this interim endpoint.

## Final source reconciliation — 2026-10-18

| Concern | Producer / source | Consumer / compared behavior | Result |
|---|---|---|---|
| Persisted state | PurchaseRequest.ApprovalStatus private setter, RecordApprovalDecision; PurchaseRequestConfig default/sentinel NotApproved(1), concurrency token | List/detail approvalStatus and enum numeric0/1/2 | New and historical rows default Pending, never silently Approved(enum0). Add/Update maps ignore state/log. |
| Decision command | IPurchaseRequestService.DecideApprovalAsync and PR controller POST{id}/approval | PurchaseRequestService.changeApproval(id,status), ApprovalCycleComponent.decide | Exact enum-only input, one POST, pending->approved/rejected,409 after a competing decision, one graph save with owned log. |
| Decision read | GetApprovalAsync -> PurchaseRequestApprovalVM/HistoryVM | models/approval.ts and shared feature component | Matching fields/nullability, sum live pre-tax line Amount before discount; audit user/date, ordered real history. Role/Level/Reason are null display-only fields. |
| Terminal locks | PrepareUpdate/public Update/UpdateList/Remove/HandleActive guards, forced root concurrency field | canEdit/canDelete visibility and disabled edit form | Every relevant inherited writer reviewed; terminal request cannot be edited/deleted/activated. View/Print remain. API status cannot be mass-assigned. |
| PO gating | RequestsWithRemainingCapacity approved predicate; PurchaseOrderService draft/create fresh status checks | Existing list/view Create PO action flag | Pending/Rejected cannot create even through direct POST. Existing approved partial quantity/discount behavior preserved. |
| Approval readiness | PurchaseRequestOrderSourcePolicy.Invalid/SourceAmount, shared by approval and conversion, existing FK helpers | Approve command before domain/log mutation | Description/type/UOM/money/discount boundaries and live tenant references checked before terminal lock. Failure leaves Pending and writes no decision. |
| Legacy linked orders | GetApprovalAsync.CanReject and DecideApprovalAsync live-order check | Reject button visibility | Pending legacy PR with POs can be approved; rejection blocked. Existing PO rows retained, never infer historical approval or log. |
| List | MaterializeListAsync projects status and canDelete; explicit enum filter/sort | List13 columns, optional approvalStatus filter, URL restore/reset/export | Actions first; fields id,no,type,date,approvalStatus,vehicles,quotation,supplierName,supplierCode,total,amountPlusTax,discount,net. Applied filter values0/1/2 preserved, null=all. |
| Shared interaction | ApprovalCycleComponent used by list dialog and View tab; ConfirmationDialogService and DataTable public APIs | List closeDisabled/canDeactivate; editor busy/tab/close guards | One confirmation/mutation path, record identity, no double click/close during decision, typed output refreshes parent and real history. Edit tab has no mutation action. |
| Feedback/recovery | Service inline skip-error option; component declared/HTTP error branches, finalize | StateMessage and global mutation success feedback | One error and one success owner. Failed attempts retain current record; Refresh rereads status, successful View reload failure has safe Retry. |
| Bilingual help | Existing purchase-requests-topic.ts and EN/AR vocabulary/resources | Existing `/UserGuide/invoice` reader/menu | Documents manual decisions, final locks, PO gate/partials, current-account audit identity, deferred permissions, readiness and legacy behavior. |

The component does not collect rejection reasons or fabricate cycle levels. Approver authorization is intentionally deferred; authenticated tenant scoping remains active. No tenant-login/role-editor/shared permission catalogue changes were made. No posting, stock movement or journal is generated.

Shared-extraction outcome: the existing feature approval component now owns the real action/read cycle for two surfaces. A feature helper owns repeated status presentation. Internal PurchaseRequestOrderSourcePolicy shares the same conversion-readiness/amount contract between the two services. Existing shared confirmation, shell, tables, money, dates and errors are reused. These are feature-specific rules/compositions, not a new cross-feature standard, so no canonical book/skill/packet semantics changed. An existing flatMap use in the touched PO action was replaced with typed iteration to comply with installed es2018 declarations.

Override audit: existing aggregate/update/list/detail/PO reasons from the PO evolution remain; PR Update/UpdateList/UpdateCore add terminal guard and force root status comparison for child-only snapshots. Remove adds terminal guard; HandleActive adds the same guard to the inherited compatibility endpoint then preserves the shared activation-only save. New decision is an explicit service operation, not a generic update. No redundant base-only override was added.

Responsive source comparison: list uses existing shared filters/table; status filter is within advanced wrapping layout. Approval dialog remains920px and viewport bounded, height520px, one internal vertical scroll. Four context grid tracks reduce to2 below1024px and1 below700px; action group wraps with shared classes. Routed approval tab retains full-width shared FormSection and internal scroll. No feature CSS or shared color/geometry override was added. Long EN/AR, narrow/intermediate/short-height, RTL/theme/keyboard/focus-return acceptance remains pending.

Source checks: root parsed22 TypeScript/templates with zero syntax diagnostics;138 EN/AR purchaseRequest leaves match;13 production TS local import paths resolve; all13 grid fields exist on the DTO. Root parsed15 directly touched C# files using local Roslyn with zero syntax errors; both backend resource XML files parse without duplicate keys. Scoped diffs reviewed separately in both repositories; whitespace checks pass. These checks are not compilation, EF translation, API replay or runtime evidence. The existing untouched list spec has a pre-existing unresolved import and was excluded from production-source path audit; no tests were changed or run.

Agent utilization: reused the prior backend worker (inherited model) for the bounded backend lifecycle/DTO/EF/API slice while root implemented Angular. Root resumed final backend ownership after interrupting the worker, integrated source-readiness/activation/amount corrections, and reviewed the resulting cross-layer diff. Non-overlapping ownership reduced duplicate discovery; previous uncommitted PO and unrelated frontend layout/topbar changes were preserved.

Owner actions pending: generate/apply `AddPurchaseRequestManualApproval` and any still-pending PO-link migration; inspect default Pending(1) for existing rows and log FK/index. Build and replay create->approve->partialPO->remainder; create->reject; duplicate/conflicting decisions; stale editor/update/bulk/activation/delete after a decision; cross-tenant ids; historical pending with POs; invalid source readiness; real current-account audit stamp. Verify failure recovery and all supported viewport/RTL/theme intervals. No build/test/lint/browser/database/migration/commit/push/deployment ran.

Suggested commits, not created: backend `feat(purchase-requests): add manual approval lifecycle`; frontend `feat(purchase-requests): enable approval actions and status`.
