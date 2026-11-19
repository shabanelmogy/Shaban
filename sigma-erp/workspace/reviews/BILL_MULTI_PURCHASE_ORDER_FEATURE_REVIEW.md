# Purchasing source generalization — supplier bills

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-24 |

## Scope and frozen handoff

Owner explicitly requires the same detail-source idea throughout the purchasing
cycle, including Bill. This implements
[the frozen multi-order Bill contract](BILL_MULTI_PURCHASE_ORDER_CONTRACT_FREEZE.md)
and supersedes only the single-direct-PO limitation identified in
[the previous read-only review](BILL_DETAIL_SOURCE_PROVENANCE_FEATURE_REVIEW.md).
Earlier historical decisions are retained, not rewritten. Upstream detail-only
source changes remain recorded in DOCUMENT_LINE_SOURCE_PROVENANCE_FEATURE_REVIEW.

Shape: financial document aggregate (BE15, BE14), workspace tabbed editor (UI13),
operational capacity selector (BE10), guarded lifecycle actions (BE18), not a
reference-data CRUD/cache feature. Master proportional cross-layer contract and
reconciliation apply. Initial generator check passed all eight packets; canonical
BE14/UI13 and skill updated together, then all eight packets regenerated through
the generator. Final semantic/check evidence follows below.

## Conformance and ownership

| Concern | Book | Actual reference/shared owner | Target reconciliation |
|---|---|---|---|
| Financial lifecycle | BE15/18 | BillService PrepareLines/PrepareApproval, existing tenant write lock | Save/preview/approve reuse direct-source preparation; posting, loans, periods and allocations retain their owners |
| Source lineage | BE14 | BillDetail.PurchaseOrderDetailId and existing GRN detail FKs | No master source FK or Bill schema change; order identity derives from each source line |
| Capacity selector | BE10/14 | Bill operational reads, SelectListBaseVm | Finite direct GET, actual value/text shape, batched usage; no lookup cache or per-option source-detail prefetch |
| Picker composition | UI13/14 | SourceDocumentPickerComponent, existing GRN compact mode | Same table/documentNavigation/retainOnBack/inline-quantity contract; local insertion, main Save |
| Editor rows | UI13/14/19 | FormSection, EditableCollectionTable, FieldError | Per-source selected row groups, quantities/accounts, preserved headers/files and translated feedback |
| Async lifetime | UI22/28/29 | Existing switchMap/defer/finalize/takeUntilDestroyed bindings | Cancel stale reads, both failure channels, explicit Retry; draft values retained |
| Progress readers | BE14/18 | PurchasingBillingProgressQuery.DirectOrders | Whole-bill proof plus compatible source set; aggregate exact line quantities, approved invoice versus draft reservation |
| Guide | Master7 | Existing BILLS_TOPIC | Bilingual source selection, staged insertion, compatibility, partial capacities and source storage documented |

## Producers, consumers and cycle coverage

- Request to order: approved compatible multi-request selection and exact request
  source keys/discount shares already adopted; no master request source FK.
- Order to GRN: approved compatible multi-order selection and exact detail source
  keys already adopted; no master order source FK.
- Direct General/Job orders to Bill: now several orders of the same source type,
  supplier, effective currency and compatible selected branch; no General/Job
  mixture. Keep only BillDetail.PurchaseOrderDetailId for direct provenance.
- GRNs to Bill: existing multiple-receipt partial line selection remains, with
  GoodsReceivedNoteId/GoodsReceivedNoteDetailId on BillDetail. Transient selected
  receipt ID command arrays are not persisted master source FKs.
- Requisition-generated request/issue and GRN-generated issue: exact source rows
  already retained under their existing job/branch and reversal ownership; this
  does not authorize merging different jobs or changing generated issue effects.
- Return/allocation rows already own their individual targets. Financial journal,
  loan and agreement context describes the entire document and remains distinct
  from converting selected source quantities.

API: GET Bill/purchase-orders requires supplierId/branchId, optionally poType,
currencyId/excludeBillId. Returns Results<SelectListBaseVm>; actual source uses
string value IDs and text labels, converted by the Bill service adapter. Initial
contract shorthand was corrected from id/value to this verified producer shape
before frontend handoff. GET purchase-order-draft/{id} retains its response shape.
Excluding an edit bill requires the requested order to belong to its saved source
set. Saved row identity is immutable; edits cannot introduce an outside order.

Usage now validates all retained rows of every touched bill, then aggregates only
requested source lines. Progress validates the complete source set too. Another
compatible order alone no longer marks the bill as mixed/NeedsReview. Genuine
manual/receipt mixture, malformed metadata/duplicate lines, inconsistent tenant,
supplier/type/effective currency/branch or overcapacity still requires correction.
Rejected, voided and deleted bills release capacity; pending reserves and approved
invoices remain separate. Default discount sums proportional source suggestions,
preserving a user-edited bill discount and the existing accounting policy.

## Verification and final reconciliation

| Check | Source result | Owner verification |
|---|---|---|
| Endpoint/interface/client shape | supplierId/branchId and optional type/currency/excluded bill agree; SelectListBaseVm value/text converted to numeric choice IDs | Network/runtime pending |
| Direct save/preview/edit/approval | All paths call the same source preparation; effective-currency checks in main BillService already accept a compatible multi-order set | Build and concurrent save/approve pending |
| Source membership and progress | Entire touched bill validated; different compatible PO no longer invalidates it; exact quantities aggregate per source line | SQL translation/filter/export pending |
| Shared picker public contract | table/documentNavigation/retainOnBack, local Apply, main Save, translated failure/Retry; owning Editor/FieldError/collection declarations reconciled | Browser/keyboard/RTL/themes pending |
| Saved document and financial display | All source orders reload; view/print read all numbers; direct totals use authoritative preview; displayed currency follows actual source | Print and numerical runtime pending |
| Recovery edge cases | Preserve entered account/quantity/manual discount; delay route-source opening until prerequisites; null source branch allows user selection before insertion | Runtime pending |
| Test source | New multiple-purchase-orders.spec.ts covers multi-source insertion and save shape, compatibility, capacity, manual-replacement refusal, discounts, totals, reload/edit and branch/currency behavior | Written, not executed |
| Namespace/compile wiring | Explicit SelectList namespace, existing global enum/model/result imports and SDK C# inclusion reviewed; new spec stays under tsconfig.spec, existing runtime imports remain reachable | Compiler pending |
| Diff and documentation | Scoped tracked diffs pass whitespace checks; new source files inspected; BE14/UI13 and skill revision agree; all eight packets regenerated and final -Check passes | Source-only |

No list DTO, report schema, permission, financial posting rule or Bill persistence
schema was added. The source selector is a live operational read. In an initial
picker session its list can contain General and Job orders; applying a mixed
selection is rejected with recoverable feedback. After insertion the query is
restricted to the selected type/effective currency. The shared picker itself
also prevents combining different currencies.

Packet semantic review retained PHASE-03's distinction between reusable shared
presentation and feature-owned typed rows/business validation, and PHASE-06's
owner runtime gates. Updated canonical source hashes are reflected in generated
provenance; no generated file was edited directly. PLAN-00 and PHASE-00 through
PHASE-06 are current after regeneration.

No build, tests, lint, browser/runtime, database, migration or commit was run.
Owner must verify initial route-source loading, blank-source selection, multi-order
Back/Cancel/Insert, incompatible type/currency rejection, saved edit/reload/print,
partial quantities and concurrent reservations, SQL translation and progress
filter/export agreement. No physical Bill schema change is needed for this slice;
the earlier purchasing detail-provenance schema changes still require the owner's
separate migration review.
