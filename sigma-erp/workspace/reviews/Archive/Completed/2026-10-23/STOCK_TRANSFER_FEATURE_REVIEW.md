| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Stock Transfer feature review — 2026-10-04

Frozen plan and handoff: STOCK_TRANSFER_MAINTENANCE_EVOLUTION_PLAN.md; STOCK_TRANSFER_DOMAIN_API_CONTRACT_FREEZE.md. Canonical UI screen01 list+modal and backend pattern2 aggregate apply. Generated packets stale after UI1.72; owner regeneration and semantic review pending. Screenshots are Explicit content/workflow evidence, not style authority.

## Scope and decisions

Screenshot1 proves Add, No/date-range/Search, Actions/View, No/Date columns and paginator. Screenshot2 proves DateTime, read-only current Branch context, ToBranch, Item/Branch/Quantity rows and add/remove/save/cancel. Existing source also supports Edit/Delete; retained using shared modal and confirmation. No Report/Excel added because neither screenshot nor feature source establishes them.

Columns beside ListVM: Actions first, no/dateAndTime; ListVM exactly id/no/dateAndTime. Filters no/dateFrom/dateTo, inclusive dates; current month and15 rows default, shared10/15/20/50/100, server sort whitelist no/dateAndTime, deterministic tie-break, applied query snapshot and route restoration. Shared stable same-line filter panel with reserved date-error space; invalid Search focuses the date field. Stale requests canceled; both declared and transport failures release loading and expose inline retry.

Reviewer decision under owner standing screenshot rule: existing header BranchId represents ToBranch/destination; each row BranchId is source. No parallel field/schema change. Read-only Create header is clearly labelled Current Branch and defaults row source only if current user branch is a live selectable branch; it is display/default context, not a security boundary. Saved header context uses actual source branch labels from rows. Historical data is not rewritten. Owner acceptance of this interpretation and existing historic records remains pending. Source and destination must differ; multiple source branches are allowed because the current row storage supports them.

Detail/read contract: id/no/dateAndTime/branchId/branchName and child id/itemId/itemName/branchId/branchName/quantity. Historical same-tenant labels remain readable even if referenced branch/item was soft-deleted; write selections remain live. Dedicated StockTransferLineDetailVM keeps standalone child read API unchanged.

Write contract: dateAndTime + destination branchId + rows itemId/source branchId/integer quantity. Update adds root ID and preserved row IDs/new0. No No, tenant, audit, parentID or calculated field from client. Require >=1 row, valid date, every FK live in tenant, positive integer quantity1..2147483647, unique item/source pair, source!=destination. Add/AddList validate; UpdateCore loads tracked live tenant children, validates, OwnsAll, RemoveDropped usage checks, scalar map, ReconcileOwned, SaveUpdate once/implicit transaction. Parent detached bulk UpdateList rejected in favor of aggregate editor. RemoveWithChildren soft-deletes owned aggregate after usage checks. No new permissions, workflow status or locks.

No persisted stock ledger, availability calculation or posting contract exists in this feature. No new accounting effect, stock-balance preview/cap or Item.StockBranchId mutation introduced. Financial calculations/tax/approval are Not Applicable. No entity or EF change; **Add-Migration not required**.

## Files and conformance

FE: Stock/StockTransfer list TS/HTML; details TS/HTML; models/create/details/list; typed service; stocktransfer.routes.ts. Shared EN/AR stockTransfer vocabulary; duplicate StockTransferService layout import/providers removed; toolbar suppresses duplicate page title. Existing empty SCSS is unreferenced/unchanged, scaffold specs untouched. Existing unrelated dirty-tree changes preserved.

BE: StocksServices/StockTransferService; MapperConfig/StockTransferProfiler and StockTransferItemProfiler; StockTransfer Add/Update/Detail/List VMs; new StockTransferLineDetailVM; unused FullList VM removed after consumer scan; StockTransferItem Add/Update positive integer VMs; GeneralMessage EN/ar-SA six localized failure keys. Generic StockTransferController inherited and unchanged. Standalone StockTransferItemService unchanged; its legacy bulk writers remain a separately owned validation boundary and no access restriction was added.

| Concern | Book/reference | Final match |
|---|---|---|
| List shell/grid | UI1/3/6, Workshop Job list | sigma-route-host + shared panel/title/fill DataTable; rows own scroll, fixed paginator; no feature SCSS |
| Filters | UI4/19, Job FilterPanel | mainColumns2/stableLayouttrue; reserved error; shared Search/Reset; same control baseline |
| Modal | UI10/13/15, Fleet VehicleService EditorDialog | explicit Create/Edit/View, title+record subtitle, contentPadded; flex-fill form/body/scroll, footer fixed |
| Collection | UI14/16/27, VehicleService rows | shared EditableRows/Table; Item360px/Source220px/Qty150px; Numeric InputNumber+global quantity directive; centered blue View badge |
| Validation | BE8, PurchaseOrder FK checks | every distinct live Item/Branch checked; typed payload and VMs match; no trust in client tenant |
| Ownership/update | BE14 pattern2, Individual UpdateCore | tracked owned snapshot, retained IDs, new0, dropped usage checks, one save |
| Delete | BE actions/PurchaseOrder delete | shared confirmation and RemoveWithChildrenAsync; failures preserve row/editor |
| Mapping | BE mapping rules | explicit one-way read/write maps; sole Ignore is manually reconciled StockTransferItems; no ReverseMap |
| Wiring | UI1/22 | root service, lazy list route, legacy URLs redirect to modal, unsaved canDeactivate; read inline vs global mutation feedback |

Necessary generic-service overrides are date filters, whitelist order, list materialization, legacy navigation-list materialization, navigation-detail projection, Add/AddList validation, UpdateCore, parent UpdateList and owned Remove. Remaining operations/controller inherited.

## Final reconciliation and pending owner verification

Root reviewed complete scoped FE/BE diffs, source for new DTO, models/payloads/routes/interceptor wiring and directly related translations/resources. Whitespace checks passed; all consumed ItemReturn/StockTransfer EN/AR keys present; twelve total ItemReturn/StockTransfer localized BE keys present exactly once in each resource. No ms-lib remnants, merge markers, stale imports or server-owned write fields in reviewed feature. No build/runtime/visual verification claim.

Phases0–3/5–6 applied; Phase4 covers ordinary shared-confirmed deletion, no additional domain transition. Agents reused after frozen handoff: return_editor (inherited model) owned StockTransfer editor TS/HTML; return_backend (gpt-5.6-sol per AGENTS complex persistence routing) owned BE files. Disjoint ownership reduced latency without repeated source discovery. Root integrated list/models/service/routes/translations/resources, resolved branch semantics and audited final result; currentBranch label integrated after worker handoff.

Owner checks: build FE/API; create with current live default and source/destination distinction; reject same branch, invalid/deleted/foreign FKs, duplicate pair, fractional/nonpositive qty, no rows and foreign/duplicate saved rowIDs; View historic labels; Edit unchanged/add/remove retained rows; dirty close/route exit; delete dependencies/lastpage; dates/no sorting/paging/retry; keyboard/focus/ARIA, RTL/dark/narrow and Qty stepping/blue centered View badge. No migration. Existing storage interpretation and inventory behavior require owner manual acceptance.

Suggested commits only: FE `refactor(stock): standardize stock transfer list and editor`; BE `fix(stock): validate and reconcile stock transfer aggregates`.
No prohibited commands run: no builds/tests/lint/browser/DB/migrations/snapshots/commits/push/deploy/Graphify/SigmaMCP.
