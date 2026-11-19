| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Stock Transfer maintenance/evolution and impact — 2026-10-04

Request: guide-conformant Stock/StockTransfer review and implementation after ItemReturn, then menu move StockReports into Stocks/Reports. AGENTS and canonical Master2–5,7; UI screen01; BE pattern2. Recipe drift check stale; canonical books used. This plan is Frozen under owner's implementation request/standing reviewer rule.

Existing: StockTransfer DateAndTime + nullable BranchId and owned StockTransferItems(ItemId,BranchId,integer Quantity). FE routed legacy list/editor, no validation/owned rowids/error state. Header and rows both have ambiguous Branch labels. No ToBranchId or transfer ledger/posting state; StockReportsService does not consume transfer lines. Entities/configs have no effects on stock balances. Current user login model supplies branchId/branchName through AuthService.getCurrentUser. Existing detail exposes Update/Delete and generic API accepts CRUD, although screenshot's open action menu shows View only.

Classification: Keep existing entities/schema/routes API addresses/child standalone read API; Refactor list/service/models/owned write persistence; Extend shared modal and required validation; Replace ms-lib and legacy wrappers; Create lean aggregate-line DetailVM; Remove oversized duplicate FullList only if no consumer. No alternative UI/editor or inventory engine created.

Reviewer decision (Master2 standing rule), evidence and rejected options: use existing header BranchId for screenshot To Branch (destination); row BranchId remains source branch, default current user's branch and editable in each row. Display current user's Branch as nonpersisted readonly context in Create; saved View displays source branch names from rows, never current-user context in place of stored row data. This supports screenshot's current Branch/ToBranch/row Branch without schema addition. Rejected a new ToBranchId parallel field or inferring source/destination ledger because existing two-level branch fields suffice and source contains no ledger semantics. This is a declared contract clarification; existing saved IDs are retained as stored, no backfill or rewriting historical records. Historical source/destination semantics require owner manual acceptance; no data migration.

No balance reduction/increase, Item.StockBranchId rewrite, journal, stock availability cap or posting/approval state invented. Inventory accounting effect is outside this screen contract and requires explicit owner decision.

Impact: FE StockTransfer list/details/models/service/routes; directly related providers/toolbar/translations. BE StockTransferService/controller/profile/VMs and necessary reused StockTransferItem write/profile mappings; dedicated slim line DetailVM to keep legacy child read shape. Entity/EF unchanged; no migration. Menu move later limited sidebar data and EN/AR group key; report routes retained.

Alternatives: shared modal chosen (one small collection/no totals) over routed document editor (no decision-rule trigger); aggregate tracked full-snapshot over generic detached graph; header existing BranchId destination versus schema expansion (rejected above). Existing Edit/Delete retained from source, without imposing unexplained new locks merely from screenshot omissions.
