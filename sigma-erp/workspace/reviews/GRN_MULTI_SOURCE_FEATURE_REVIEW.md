# GRN source selection and multi-order receipt

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-24 |

## Manifest and authorization

Owner rejected the initial source toolbar layout: all controls on one row, source
at the opposite end from Add. Then explicitly requested Load to open a modal,
blank source showing eligible orders and selected source opening its details,
partial item/quantity selection from several orders, and a reusable rule for
similar document cycles. Written requirements only; no new screenshot authority.
Frozen plan/contract: GRN_MULTI_SOURCE_MAINTENANCE_EVOLUTION_PLAN.md and
GRN_MULTI_SOURCE_DOMAIN_API_CONTRACT_FREEZE.md (including read-count amendment).
Shared extraction + cross-layer source changes: proportional tier L. Scope:
GRN source selection, existing shared collection toolbar, source-document picker,
and directly affected PO/progress/bill-source/pending-stock readers. Unrelated
accounting, approval/cache/topbar changes already dirty in both repos preserved.

UI shapes: existing routed GRN document editor, typed local selection dialog,
shared complete local DataTable and existing lazy GRN list. Backend shape:
BE14 master-detail with existing separate approval/stock effects; no new journal,
no new permission, no persisted schema, no migration/snapshot/database work.

## Shared conformance

| Concern | Owning book | Inspected reference / public owner | Final source |
|---|---|---|---|
| Source toolbar | UI14/24/25 | EditableCollectionTable toolbar projection, existing PO source button, PrimaryActionButton | toolbarLayout split keeps projected source at logical start and Add at logical end; validation below; no copied Add |
| Picker shell | UI13/27 | EditorDialog inputs/events, ConfirmationDialogService | New shared SourceDocumentPicker; parent owns mount/Apply consent; labelled controls, independent selection, cancellation/teardown |
| Line grid / quantities | UI6/14/16 | DataTable selectable/selection/selectionChange/fill API, QuantityInputDirective | Shared grid, loaded order rows, positive whole selected quantity; no stale-value clamping |
| Domain authority | BE14/18 | GoodsReceivedNoteService PrepareLines/DecideApprovalCore, existing PurchaseRequest write boundary | Validate every line source, derive orders, same supplier/type/effective currency; no draft receipt reservation |
| Source readers | BE14/17/18 | PurchaseOrderService, PurchasingBillingProgressQuery, BillService source display, StockReportsService pending report | Derive source from receipt-line FK; preserve disjoint legacy fallback and pending reference locks |
| Guide / language | Master7; UI23 | purchase-documents-topics and shared-screen-guidance, existing UserGuide reader | EN/AR steps, reusable future-cycle rule, all36 picker dictionary keys present |

## Read, form and action contracts

Existing source endpoints/POST/PUT remain. Candidate order list is supplier/type
scoped; details load fresh on demand, not prefetched per candidate and never
lookup-cached. Initial PO number opens that source. Picks retain across orders;
selected source line + quantity is the only imported receipt content after Apply.
Empty/error/loading/retry exist for both list and detail failure channels. A
failed/missing retained source needs Retry or removal; lower remaining quantity
keeps the typed quantity invalid until user corrects it. Currency conflict does
not silently remove an earlier selection. Parent dirty consent runs only when
applying selected rows; cancellation does not overwrite draft content.

Picker columns: item/asset label, description, unit, ordered, received, remaining,
unit price; complete local data, optional local sorting/filtering through the
existing DataTable. Selected-card quantity is explicit positive whole input.
Identity is document ID + line ID. Adapter opaque data retains original source
line/draft; parent sends source-line ID and user inputs only. Display provenance
IDs/numbers live in disabled form controls and detail DTO, excluded from write
payloads except the existing compatibility header ID and line source FK.

GRN detail lines add PurchaseOrderId/PurchaseOrderNo. Header retains single
source ID/no for one order and null for several. Manual LPONo remains intact.
Editor/print shows actual source for every line. List/tax report SourceOrderCount
renders a translated multi-order count; advanced LPO filter matches actual
source numbers. Scalar per-column LPO filter is disabled for this composite
display; old header sort retained. Other list paging/count/actions unchanged.

Backend rejects duplicates, mixed manual/source rows, nonapproved/deleted or
cross-context POs, mixed currencies and quantities beyond current capacity.
Prices/items/UOM/tax remain server-owned. Saved edits cannot change a retained
line source or add a new source order; dropping rows retains existing guards.
Approval revalidates all sources under the existing serialized write boundary.
Current draft/reject/approve/unapprove/void/item-issue/accounting contracts stay
unchanged. PO references include pending nonvoid GRNs, so a draft cannot lose
its protected source. Effective stock/capacity still uses approved-or-legacy-null,
live nonvoid rows; bill drafts reserve only per existing billing policy.

Route/provider/interceptor changes: none. Existing GRN routes and source query
parameter preserved; create-from-PO now prefills context and opens line selection
without auto-accepting all source rows. New component is imported standalone and
included in explicit tsconfig.app files; no broad test include added. Root HTTP
and finite services reused. Existing attachment ownership/cleanup/discard unchanged.

## Source reconciliation

Compared API/DTO names/casing and actual namespace/global using, list projection
and displayed fields, picker inputs/events with imports, typed form/payload,
manual/single/multiple-source and saved-edit/approval paths, PO receipt and billing
progress, draft reference locks, source-number display on bills, pending stock
report, and print provenance. Reviewed shared empty/header/body/scroll/focus
ownership and final scoped frontend/backend diffs. Scoped diff --check passed.
Translation source check: no missing picker keys in EN/AR. No merge markers in
new picker. New widget regression specs cover retained multi-order quantities,
currency refusal, stale lower capacity without clamping, cancellation teardown
and Cancel without parent Apply; source written, not executed.

Reusable UI13/UI14/BE14 rules and skill revision updated together. Regenerated
all8 packets only via Generate-SigmaRecipes.ps1, reviewed changed provenance and
preserved shape-specific reference/ownership boundaries in phases01/02/03/04/06;
final recipe -Check passed all8. Existing default toolbar shape remains compatible;
GRN uses the explicitly requested split mode. Similar future/refactored source-line
workflows must reuse the picker through their model-specific adapter; no blanket
relaxation of existing single-source or accounting policies.

Root froze contracts before delegating disjoint backend aggregate/DTO vs reader
work and shared-picker UI folder. Workers preserved dirty state; root integrated,
finished/reviewed the picker after its worker stopped at a usage limit, added
translations/guides/read summaries, inspected all final changes and owns closure.

## Owner verification pending

No build/test/lint/browser/runtime/DB/migration/commit/push commands executed.
Run both application builds and widget specs; then exercise manual/single/multi
source, Stock/Asset, same supplier/type/currency refusal, partial quantities,
reopen/cancel/dirty consent, source failure/retry/stale capacity, simultaneous
approval capacity, partial saved row removal/edit, PO mutation references,
billing reservation/progress, pending-stock report, list/advanced-source filter,
print/export and long-label small-width RTL/light/dark/keyboard operation.
EF SQL translation, persisted multi-order round-trip and rendered geometry are
not proven by source inspection. No required source implementation remains.


## Compact picker owner amendment — 2026-10-24 (Frozen before editing)

Owner requests GRN Select source document lines to match the PR-to-PO compact
selection presentation. Tier M bounded shared UI adoption; no domain/API/schema
change. This supersedes the split panels/card-quantity layout recorded above for
GRN. Root owns the coupled shared picker + GRN binding/guide; no delegation.

UI13/14 shared owners: SourceDocumentPicker + EditorDialog + DataTable +
QuantityInput, with UI4 FilterPanel for the local document search. Extend the
existing compact layout with optional internal document navigation: eligible
complete document table first when no initial ID, selected document's compact
line/unit/available/inline quantity table otherwise. Back retains working picks
inside the same picker session; local list shows selected counts. Choose another
compatible source, Insert all retained valid picks to parent GRN Details only.
Preserve parent dirty replacement consent, original-session Cancel/discard,
supplier/type/currency/capacity guards, finite operational source GET/teardown,
positive integer quantities, explicit invalid/stale rows and error/Retry states.
PR external-list compact caller and default split consumers retain their public
contracts. New shared inputs/events/states promoted to UI13 + skill, packets
regenerated/checked; guide bilingual update is part of this task.

Conformance table: document filter=UI4 FilterPanel actual inputs/directive;
list/line grid=UI6 DataTable actual columns/value/rowActivated/fill contract;
quantity=UI14/16 QuantityInput; shell/return/Cancel=UI13/27 EditorDialog footer
and existing confirmation service; backend=existing BE14 GRN source contract.
Initial all8 recipe Check passed. Builds/tests/runtime/browser/database remain
unexecuted; owner verification pending.


### Compact picker final reconciliation — Implemented — source-only

GRN now binds `layout="table"`, `documentNavigation=true`, and translated
Quantity to include to the existing shared SourceDocumentPicker. No feature-local
popup or replacement wrapper was added. No selected source opens the internal
source DataTable first; a supplied initial ID opens its compact lines directly.
The local complete list uses the real FilterPanel/FilterActionsDirective imports,
FormBuilder reactive group, aligned Search/Reset, source labels and selected
counts. Search remains applied until Search/Reset; no per-candidate prefetch.

The shared internal Back command retains working selections and the original
cancel baseline in the same mounted shell, without Apply or discard. It returns
to the document table, where another order can be chosen; checked line quantities
are restored after its next finite source read. Missing retained candidates remain
accessible to retry/remove, not reauthorized. Blank/initial choice, source-list
loading/error/Retry/empty and line loading/error/Retry/stale correction were traced.
Only one grid region is mounted at a time, with existing shared logical sizing,
tokens/focus and12px gap. Main Apply/currency/duplicate/quantity guards stay.

Parent `applySourceSelection` is unchanged: supplier/type/currency validation,
dirty replacement consent, local GRN detail rows and source FK provenance are
preserved; no save occurs from the picker. Cancel changes no parent draft. Save
and approval backend effects remain the previously frozen GRN contract.

Source regression cases added (not run): no source prefetch in the compact list,
initial ID direct open, two-order retained quantities through Back, local Search/
Reset, missing selected document accessible, and Cancel refusing to discard.
Existing split and external PR adapters retain their defaults and event shapes.

UI13 + skill/revision row document optional internal documentNavigation and its
states, layout, data ownership and usage constraints. All8 generated packets were
regenerated through the generator; UI13 provenance/reference roles semantically
reviewed; -Check passed all8. No generated packet was edited directly.
The existing bilingual GRN topic in UserGuide/content/purchase-documents-topics.ts
now describes the compact tables, quantity column, retained Back, local insertion
and main Save. It remains at /UserGuide/vouchers-purchasing under the existing
Purchasing and Suppliers User Guide entry; no new guide route is required.

Scoped diff whitespace, new shared file markers and public producer/consumer
bindings were reviewed. No build/test/lint/runtime/browser/database/migration or
commit was run. No migration is needed for this GRN presentation amendment.
Owner acceptance: rebuild Angular, Load blank/known PO, select quantities from A,
Back, add B of the same supplier/type/currency, verify retained counts/quantities,
Apply into GRN Details only, Cancel unchanged, Retry errors, invalid capacity,
phone widths/RTL/themes and input focus. Suggested frontend commit:
`refactor(grn): use compact source selection with retained navigation`.
Suggested documentation commit:
`docs(ui-book): document compact source document navigation`.

## Detail-only order provenance amendment — 2026-10-24

Status: Implemented — source-only. Owner verification pending: yes.
Owner explicitly requires purchase-order identity in GRN details only, even for
a single-source receipt. The frozen handoff is
[GRN_DETAIL_ONLY_PURCHASE_ORDER_CONTRACT_FREEZE.md](GRN_DETAIL_ONLY_PURCHASE_ORDER_CONTRACT_FREEZE.md).
It supersedes this review's earlier compatibility-header policy for GRN only;
the PR-to-PO header policy is outside this amendment. No new screenshot evidence.

The master entity, EF relationship/index, header Add/Update/Detail DTOs and
Angular header control/payload no longer contain PurchaseOrderId. Each detail
now persists nullable PurchaseOrderId alongside PurchaseOrderDetailId, with a
Restrict relationship and tenant/order index. Input maps ignore server-owned
order identity/navigation. The server loads the source line, checks existing
identity consistency, and sets the detail order reference; manual lines have
neither reference. Linked receipts persist no generated header LPONo summary.
The optional manual header number remains free text, not new structured proof.

### Final conformance and reconciliation

| Concern | Owning contract/reference | Final source evidence |
|---|---|---|
| Persistence and input ownership | BE1/3/4/14; GRN frozen amendment | GoodsReceivedNote/Detail entities and configs, GRN Add/Update/Detail VMs, GoodsReceivedNoteDetailProfiler: no master FK; server-owned detail order ID ignored in input mapping |
| Source validation and writes | BE8/14; GoodsReceivedNoteService.PrepareLinesAsync | Add, update candidate/reconcile and approval derive source orders from live details; preserve supplier/type/currency, duplicate/whole-quantity, source immutability and existing unique-write/lifecycle boundaries |
| Capacity and historical ambiguity | BE14; frozen amendment | Saved PO-only or mismatched detail references cannot silently become manual or consume an arbitrary source line; implicated capacity is blocked for review. Reliable source-detail fallback handles retained null detail order IDs |
| Read/grid/report membership | BE9/17; current GRN query/projection owners | GRN list/tax/search source labels/counts derive from details. Dedicated LPO/advanced filters search all sources; generic quick search uses the first displayed source number. PO receipt progress, billing/reservations, live-reference guards, bill source labels and pending-stock attribution use detail membership |
| Manual fallback | BE14; existing legacy policy | Existing number/supplier fallback is restricted to wholly unstructured receipts, disjoint from structured detail references; no mixed-receipt double attribution |
| Angular form/save/reload | UI13/14; existing EditorTabs, EditableCollectionTable and SourceDocumentPicker public contracts | Root control/DTO/patch/disable/header fallback removed; linked state/retry use rows. Source-choice/route ID remains transient. Save sends each source-detail ID; server resolves its order ID. No shared presentation change or new wrapper |
| User guide | Master7; existing purchase-documents-topics GRN topic | Bilingual note explains per-line provenance, single/multiple orders, manual number versus actual source selection; existing /UserGuide/vouchers-purchasing reader reused |
| Integration | Existing GRN service/controller route contract | Routes, controller signatures, providers and response wrappers retained; corresponding header DTO producers/consumers changed together |

Root froze the contract before delegating disjoint GRN core versus adjacent
reader files. Root implemented Angular/guide/docs and reviewed integrated source,
member removal, mappings, query predicates, lifecycle call sites and namespaces.
Unrelated dirty changes were preserved. Scoped frontend/backend whitespace
checks passed; bounded conflict-marker and removed-master-member scans found no
remaining affected branches. These are source findings, not compilation proof.

Added source regression cases (not run): one-order and two-order Save payloads
omit the header order ID, retain line source IDs after a capacity rejection, and
clear linked header text; manual text stays text with null source-detail ID.
Test fixtures/imports and editable/validation preconditions were source-reviewed.

BE14 and the execution skill plus revision row now document this explicit GRN
exception and its source proof/migration rules. Regenerated all eight packets
through Generate-SigmaRecipes.ps1; semantically reviewed BE14 provenance and
unchanged shape/reference roles in PHASE-01/03. Final -Check passed all eight.
No generated packet was edited directly.

### Required owner migration and verification

Suggested migration: `MoveGrnPurchaseOrderReferenceToDetails`. Add the detail
column/FK/index, preserve historical provenance and backfill reliable source-line
order IDs before dropping the master column/FK/index. Header-only ambiguous
history requires owner review or a separately authorized development reset;
do not guess source lines or silently discard provenance. This task creates or
runs no migration, snapshot change, database operation, build, test, lint,
runtime/browser check, commit or push.

Owner acceptance remains: create/review/apply the migration, compile both apps,
run regression specs, then persist/reopen/approve single/multi-order and manual
receipts; exercise partial remaining quantity, stale/concurrent capacity,
source-pair inconsistency, order mutation guards, bill labels/coverage/draft
reservations, GRN list/tax/filter/print and pending-stock report. EF translation,
stored round-trips and rendered behavior remain unverified. No required scoped
source change remains.

Suggested backend commit: `refactor(grn): store purchase order provenance on details`.
Suggested frontend commit: `refactor(grn): remove master purchase order identity`.
Suggested documentation commit: `docs(grn): define detail-only source provenance`.
