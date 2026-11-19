| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Purchase request source selection inside Create PO

Date: 2026-10-22. The owner narrowed the purchasing-chain request to PR to PO, approved opening a modal, and explicitly preferred entry from both PR and PO. This supersedes only the 2026-10-18 choice to expose the conversion dialog from the PR screen alone. The existing source-aware conversion API, partial quantities, discount allocation and concurrency ownership stay authoritative.

## Frozen contract

- Create PO keeps manual General/Stock/Asset entry. After selecting a supplier, a source action opens one dialog. Its first state lists approved requests for that supplier with at least one positive remaining line; searching and paging apply on the server before page slicing. Selecting a row shows the existing conversion form in the same dialog, including requested, ordered, remaining and quantity-to-order per line. Back returns to the source list; dirty changes require the shared discard confirmation.
- The list reads the existing paged `GET PurchaseRequest` with `Filters[supplierId]` and a new read-only `Filters[availableForPurchaseOrder]=true`. The new filter reuses `RequestsWithRemainingCapacity()` before count/order/page. No entity, ListVM, mapping, schema or new controller route is needed. Modal columns: request No, date, type, supplier, total amount. The selector uses the existing `canCreatePurchaseOrder` flag only as an additional stale-row guard.
- The selected request continues to use `GET PurchaseRequest/{id}/purchase-order-draft` and `POST PurchaseRequest/{id}/purchase-orders` with date, branch and selected source detail IDs/quantities. The server remains authoritative for supplier, PO type, prices, source links, discount and fresh capacity under the existing unique-write lock. After success, the returned PO id can open the saved PO. The existing PR list/detail Create PO action remains usable.
- The PO source action is shown only for a manual Create PO with a selected supplier. It is unavailable for saved, embedded and Workshop Job orders. The conversion form verifies the loaded request still belongs to the chosen supplier. A dirty manual PO draft beyond the supplier choice must not be silently lost when a source PO is created. No schema migration is introduced.

## Source and conformance evidence

| Concern | Book block | Reference / shared owner | Target |
|---|---|---|---|
| Modal composition and dirty close | UI13/10 | `shared/components/editor-dialog`; existing PR `CreatePurchaseOrderComponent` | Reuse same controlled shell, current date/branch/line form and confirmation. |
| Eligible paged read | UI2/5/6; BE9 | PR `getList`, `PurchaseRequestService.ApplyListFilters`, `RequestsWithRemainingCapacity`, shared `DataTable` | Server filter before paging; no client page pruning. |
| Partial conversion | UI14/16/17; BE14 | `PurchaseOrderService.GetPurchaseRequestDraftAsync` and `CreateFromPurchaseRequestAsync` | Reuse draft/write endpoints and source line validation; no generic PO POST. |
| PO entry and navigation | UI1/13 | Existing PO routed details and route guard | Supplier-scoped source entry; saved PO view after creation with no silent draft loss. |
| Text/help | UI19/22/23; Master7 | EN/AR vocabs; Purchase Order and Purchase Request in-app guide | Search/loading/empty/error, action labels and bilingual instructions. |

Recipe drift check passed all eight generated packets. Applicable phases: 00/01 contract, 02 paged selector, 03 conversion modal, 05 integration, 06 reconciliation. Phase 04 adds no new transition: conversion uses the existing command. Runtime/build/test/browser/database checks remain owner-pending by workspace rule.

## Source reconciliation

| Contract | Producer and consumer evidence | Result |
|---|---|---|
| Eligible supplier sources | `PurchaseRequestService.ApplyListFilters` applies `availableForPurchaseOrder` through the pre-existing remaining-capacity query before base `GetManyAsync` count/order/page. The modal sends supplier id, flag and optional request No through the typed `PurchaseRequestService.getList`. | Matched in source; SQL runtime pending. |
| Row and detail fields | Selector columns are No, Date, Type, Supplier, Total Amount, matching the existing PR ListVM. The selected draft uses requested/ordered/remaining per source line and retains the existing quantity validation. | Matched in source; visual/interaction acceptance pending. |
| Write and navigation | The shared conversion component invokes the existing PR conversion command; the PO entry receives the created id and opens saved PO View. Existing PR list/detail entry and refresh stay intact. | Matched in source; runtime acceptance pending. |
| Draft protection | Source picker is unavailable for Job/embedded/saved PO. Dirty manual fields prompt before opening, explain that cancel preserves the draft and successful conversion leaves it unsaved; documents block conversion until removed. | Matched in source; owner usability acceptance pending. |
| Text and help | EN/AR keys and the existing PR/PO UserGuide topics describe both entry points, source capacity, and server recheck. Existing guide routes/menu entries remain. | Matched in source. |

Backend mapping/entity/EF and conversion calculations are unchanged; no migration is needed. The previously observed capacity policy counts live rejected POs as reservations too; this was not changed as part of the entry-point feature. Root inspected the scoped diffs in the separate frontend/backend repositories; `git diff --check` found no whitespace error and a merge-marker scan found none. Existing uncommitted PO list Bill Status column work was preserved. No build, test, lint, browser, database, migration, commit or deployment command ran. Suggested commits: frontend `Add supplier-scoped PR picker to PO creation`; backend `Filter available purchase requests before paging`.

## Source correction — 2026-10-22

The owner reported TS2322 because the boolean source-picker flag had been added to the ordinary PR list filters, which are also spread into URL query parameters typed as strings or numbers. The flag now belongs only to the typed API list query; ordinary list filters and route state retain their string/number contract. The picker still sends `availableForPurchaseOrder=true` through `toListParams`. Scoped source diff and whitespace check passed; compilation and runtime acceptance remain owner-pending.

## Detail toolbar placement — 2026-10-22

The owner moved the PO-side source action from under Supplier in Basic Information into the Details table toolbar beside Add Detail. UI14's shared `EditableCollectionTableComponent` remains the toolbar owner; a projected toolbar-action slot carries the PO-specific button, while its supplier/create/job and busy gates and conversion workflow remain unchanged. The Purchase Order in-app guide now states the new location. No backend, API, calculation or schema change; owner visual/runtime verification remains pending.
