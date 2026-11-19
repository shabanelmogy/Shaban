| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Stock Transfer domain/API/UI handoff — 2026-10-04

Plan: STOCK_TRANSFER_MAINTENANCE_EVOLUTION_PLAN.md frozen. Evidence screenshot1: title StockTransfer, Add, No/date-range/Search filters, grid No/Date, View action, paginator; screenshot2: DateTime, readonly Branch context, ToBranch, Item/Branch/Quantity rows, add/remove/cancel/save. Layout authority UI screen01; BE2. Existing Edit/Delete workflows retained from source (not screenshot-inferred). No state flags.

Exact list {id:number,no:string|null,dateAndTime:string}; columns No,DateTime plus Actions first. Filters {no:string,dateFrom:string|null,dateTo:string|null}; ISO date query, inclusive endpoints, current month default, shared15 rows/options10/15/20/50/100; paging server clamp1..100, sorting whitelist no/dateAndTime + deterministic Id tie-break, filters beforecount. No report/export added when not evidenced/existing; Search and shared Reset.

Detail {id,no,dateAndTime,branchId:number|null,branchName:string|null,stockTransferItems:[{id,itemId:number|null,itemName:string|null,branchId:number|null,branchName:string|null,quantity:number|null}]}. Lean explicit classes; dedicated StockTransferLineDetailVM preserves standalone child API.
Add {dateAndTime:string,branchId:number,stockTransferItems:[{itemId:number,branchId:number,quantity:number}]}. Update same plus rootid and saved lineids/new0. Header BranchId=ToBranch destination; row BranchId=source (preserves current storage). Branch context readonly user default is display only. Full snapshot mandatory >=1 row; date valid, every ID positive and every distinct Job-free Item/Branch reference live in tenant, quantities int1..2147483647. No repeated (ItemId,BranchId) pair; each source branch differs from destination. Client no tenant/No/audit/parentID. No need to enforce rows allsame source: current row contract supports individual source branches. Current user's branch is only a convenience default and never a trust/security boundary.

Persistence: validation Add/AddList, tracked UpdateCore load live tenant children; OwnsAll before scalar mapping; RemoveDropped usage checks; Update map ignores only manually reconciled collection; ReconcileOwned maps retained rows; one SaveUpdateAsync/implicit transaction. Reject parent detached UpdateList in favor of aggregate editor; standalone StockTransferItem service unchanged/outside assignment, legacy alternate writer boundary recorded. RemoveWithChildrenAsync for parentusage+owned softdelete. No extra transitions, ledger, counters or migrations.

Service URLs GET StockTransfer, GET StockTransfer/GetByWithNavigationsId/id, POST/PUT StockTransfer, DELETE StockTransfer?id. Generic controller inherited; lean materialization hooks. List root-only route with legacy create/details redirects, explicit modes, unsaved guard delegates editor. providedInroot with duplicate layout provider removed; single featuretitleinpanel.

Conformance before edits:
| Concern | Book | Actual approved reference | Shared owner | Target |
|---|---|---|---|---|
| List/grid/filter | UI1,3,4,6 | Workshop/Job list shell/grid | global shell, FilterPanel, DataTable | fill host; mainColumns2 stableLayouttrue; date error reserved; no SCSS |
| Modal | UI10,13,15 | Fleet/VehicleService Details EditorDialog | EditorDialog | contentPadded, controlled modes/dirty close, flex-fill autoheight scroll |
| Owned rows | UI14,16,27 | VehicleService parts/EditableRows | EditableCollectionTable + QuantityInputDirective | Item360px Branch220px Quantity150px; blue centered View quantities; shared row removal |
| Save/delete | BE8,14 | PurchaseOrder FK/deletion; Individual UpdateCore | Service ownership/reconciliation helpers | all distinct live FKs, tracked snapshot, one save |

Root owns list/models/service/routes/resources/menu/artifacts/reconciliation. Editor worker owns StockTransfer details TS/HTML only; backend worker owns feature BE only, not resources or standalone child service. Root confirms full source changes. Build/test/runtime/browser/DB/migrations/commits prohibited; manual owner build/save/paging/ARIA/RTL/theme/quantity/sources-vs-destination acceptance pending. Legacy existing data not changed.
