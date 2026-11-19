# Detail-only conversion provenance — purchasing and analogous stock flows

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-24 |

## Manifest, authority and frozen decisions

Owner requests the same detail-only rule for PO -> PR identity as the completed
GRN change and explicitly generalizes it across purchasing and analogous cycles.
Tier L cross-layer provenance implementation; written instructions, no screenshot.
Contract: DOCUMENT_LINE_SOURCE_PROVENANCE_CONTRACT_FREEZE.md, including the later
frozen requisition/issue amendment. Supersedes older PO header compatibility
policy without rewriting those historical decisions. PLAN-00 inventory and
Keep/Refactor classification informed this bounded direct implementation; no
unapproved feature plan or new selection/financial workflow was introduced.

Applied Master1/4/5/7/8, BE1/3/4/8/14/18, UI13/14/28/29 and generated domain,
detail-write, state-action, integration and reconciliation concerns. Initial
recipe Check passed all eight. Shape: existing routed PO document editor with
shared EditorTabs/EditableCollectionTable/SourceDocumentPicker, backend existing
master/detail conversion aggregates; generated issues remain stock stateful
aggregate exceptions, not generic CRUD. Existing actual source owners were read
before edits. No new backend endpoint, route, permission or presentation owner.

## Impact map and classification

| Flow / association | Decision | Evidence / final outcome |
|---|---|---|
| PR -> PO | Refactor | Remove PO master PR FK/navigation/config/header read DTO ID/number. Add server-derived PR parent FK/navigation on PODetail beside source-line FK. New single/multi conversion, pending edit, approve, capacity, discount and reference readers use details |
| PO -> GRN | Keep + integrate | Prior detail pair already conforms. GRN service's downstream issue references now derive from issue detail membership |
| Requisition -> PR | Refactor | Existing action already selects RequisitionItemId. Persist requisition/item pair in PRDetail; remove PR master source FK/navigation/unique index. Keep source PR readonly and one live PR per requisition via existing tenant requisition lock and duplicate check |
| Requisition -> ItemIssue | Refactor | Existing action selects exact requisition item. Persist pair in ItemIssueItem, remove issue master FK/navigation. Preserve distinct-item capacity, readonly/generated lifecycle and approval consumption |
| GRN -> ItemIssue | Refactor | Existing approval maps saved receipt rows one-for-one. Preserve receipt/detail pair on each issue item; downstream lock, draft void and delete references derive from details |
| GRN/direct PO -> Bill | Keep | Bill has no source master FK. BillDetail already owns GRN/detail or direct PO-detail reference; no new redundant PO ID needed |
| Purchase Return / credit/debit allocation | Keep | Financial source/target references already belong to detail/allocation rows; no fabricated item conversion |
| PO EquipmentQuotation, SaleOrder equipment agreement | Keep document context | Current services validate/associate a document-wide approved quotation/agreement, without a selected source-line consumption contract. Do not remove context IDs or invent lineage |
| Journal, loan plan, approval history and child ownership | Keep | Document-wide effects/ownership are not source-line conversion provenance |

## Contracts and final conformance

| Concern | Owning block / actual source owner | Match |
|---|---|---|
| Persisted field ownership | BE1/3/14; PO/PR/ItemIssue master/detail entities/configs | Source FKs removed from masters and added to details with Restrict and tenant lookup indexes. Own aggregate parent FKs retained. Exact source-line keys preserved by server-generated conversions |
| Ordinary inputs | BE3/4; PO, PRDetail, ItemIssue profilers including independent child mapping owners | Source IDs/navs and allocated discount remain server-owned and explicitly ignored. No redundant writable parent IDs or client-provided allocation values |
| PO discount | BE14; PurchaseOrderService.ReservationsAsync / ValidateSourcePairsAsync | Persisted per-request shares remain authoritative. Legacy monetary header Discount counts once only for a whole, consistent, single-request order with all shares null. Mixed or unprovable shares block new capacity; no proportional historical guesses |
| PR usage | BE9/14; PurchaseRequestService ReliableReservations/AmbiguousRequestIds | Shared named/grid/list/dropdown usage predicates; live tenant source line + null-or-matching stored parent. Ambiguous whole orders unavailable for further capacity. Existing consumption enum unchanged |
| Reference protection | BE8/14; PR/GRN/ItemRequisition/ItemIssue services | Union stored and actual source-line parent for implicated source protection; either-key source flags keep partial pairs readonly. No source can become mutable simply because its stored parent is absent or mismatched |
| Requisition quantity proof | BE14; new ItemRequisitionSourceQuery used by ItemRequisitionService and ItemIssueService | Effective historical parent+ItemId rows preserve existing unique-item grouped policy. A supplied source-item key must be live/tenant/parent/item-consistent. Ambiguous IDs protect both parents and block list/detail/action/approval capacity |
| GRN-generated draft void | Existing GRN/issue lifecycle contract | Tracked linked drafts include their live source-bearing children before domain void. Generation, reapproval/new draft, unapproval, stock reversal and final-void timing retained |
| PO frontend | UI13/14; existing editor/shared picker/table | Remove header PR DTO and all header fallback; linked state, row labels and print source labels read details. Source draft/route selection IDs remain transient. Main Save is unchanged except it cannot depend on master provenance |
| User guidance | Master7; existing purchasing and stock guide topics | Bilingual PO and issue topics explain exact per-line source and server validation; existing /UserGuide/vouchers-purchasing and /UserGuide/stock readers reused |
| Integration | Current root providers/controller/service contracts | No route/provider/interceptor/permission changes. .NET global imports resolve Stocks/Purchases and existing project references/default compile include the new query owner |

The removed requisition header filtered unique index is replaced by detail
reference indexes. One-PR business uniqueness remains protected by the existing
ItemRequisition tenant write boundary and duplicate query over both parent/source
item membership. Ordinary PR inputs cannot claim requisition source. Approval
checks saved issue pairs, prohibits source/manual or GRN/requisition mixtures,
multiple source parents, duplicate source lines and stale/item-mismatched proof.
No new multi-requisition issue UI was introduced.

Reads retain only existing displayed/action fields. PO master DetailVM drops PR
ID/number; per-line DetailVM already has both. No additional list/filter columns
are introduced: PO/PR/item-requisition/item-issue existing columns and ListVM
fields remain, with their action flags/progress derived from details. No API
names or namespace shims are invented.

## Files and scoped review

Backend repository owners changed: PurchaseOrder/PurchaseRequest/ItemIssue master
and detail entities/configs; PO/PR/issue mapping owners; PO header detail VM;
PurchaseOrderService, PurchaseRequestService, GoodsReceivedNoteService,
ItemRequisitionService, ItemIssueService, ItemIssueItemService; added
StocksServices/ItemRequisitionSourceQuery.cs. Exact provenance examples: PO detail
PurchaseRequestId+PurchaseRequestDetailId; PR detail
ItemRequisitionId+ItemRequisitionItemId; issue item either GRN/detail or
requisition/item pair.

Frontend owners changed: PO models/details.ts; PO details.component.ts;
request-selection.spec.ts; purchasing and stock guide content. Source regression
assertions cover single/multi conversion payloads without master PR ID and saved
detail-only source state/labels. They were added/source-reviewed, not run.

Root froze contracts before independent core/reader implementation, separately
traced analogous stock conversions, then froze that handoff before edits. A
bounded audit found and root corrected two integration gaps: stored-parent-only
reference protection, and inconsistent source-item quantity proof. Re-audit found
no remaining concrete gap in that bounded scope. Workers and root preserved all
unrelated dirty source, including previous auth/sidebar/cache work.

Root reviewed integrated changed source, complete worker-owned diffs, template
producer/consumer shape, source ID types/namespaces, includes for tracked domain
methods, public shared input contracts and mutation call paths. Scoped diff
whitespace checks pass. Removed-master reference/merge-marker scans do not show
remaining affected member branches. No build, test, lint, runtime, browser, DB,
migration, snapshot, commit or push was performed; source conformance does not
prove EF SQL translation, successful compilation or measured runtime behavior.

## Documentation and owner handoff

BE14 and the execution skill/revision row now own the generalized rule, explicit
document-context exclusions, discount proof and shared requisition query policy.
All eight packets were regenerated through Generate-SigmaRecipes.ps1; BE14
provenance and unchanged approved root/editor/source reference roles semantically
reviewed. Final -Check passes all eight. Generated files were not directly edited.

Owner migration suggestion: `MoveDocumentSourceReferencesToDetails`. Review the
current migration state, add detail source columns/FKs/indexes, preserve old
header provenance and backfill only reliable source lines before dropping old
master fields/indexes. Prior pending GRN/discount schema changes must be reconciled
with the owner's actual snapshot; do not blindly duplicate them. Historical
parent-only/mismatched data needs owner review or separately authorized reset;
no automatic deletion or invented source mapping. This task runs no migration.

Owner acceptance pending: both builds; regression specs; manual/single/multiple
PR -> PO creation, partial edit/source removal/discount rounding, stale or
simultaneous capacity, approve/reject/delete and source mutation guards; requisition
partial issue/PR, duplicate PR prevention, issue approval and stock availability;
GRN-generated draft issue approve/void/unapprove/reapprove; malformed/parent-only
history; list/grid/filter/select/detail/print/export parity; mobile/RTL/themes and
keyboard operation. Existing source lifecycle/API decisions are frozen; no
material business decision remains unresolved in this scope.

Suggested backend commit: `refactor(purchasing): persist conversion sources on detail rows`.
Suggested frontend commit: `refactor(purchase-order): derive request context from lines`.
Suggested documentation commit: `docs(patterns): generalize detail-only document provenance`.
