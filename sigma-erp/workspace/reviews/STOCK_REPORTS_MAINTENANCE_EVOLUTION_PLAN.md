| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Stock reports — 2026-10-04

Request: «راجع stock reports / طبق التعديلات وفقا ل Guide». Review and implement the confirmed defects in the eight existing routes. Source-only execution; no build/test/lint/browser/database/migration/commit/push/deployment. Recipe `-Check` reports all packets stale; canonical blocks govern. Regeneration and semantic review remain owner work.

Impact map: `SiGmaAngularFrontEnd/src/app/modules/stockReports` (eight report screens, models, services, routes), consumed EN/AR vocabulary, `SigmaBackend/SiGma.Business/Services/StocksServices/StockReportsService.cs`, its interface/controller and `SiGma.Helpers/Reports/StockReports` DTOs. Existing stock/workshop/voucher writers and entities are evidence only. No entity, EF, snapshot or writer edits. Previous menu relocation artifacts remain historical and unchanged. Both repositories have substantial unrelated pending edits; report module itself starts clean.

| Classification | Existing owner | Frozen treatment |
|---|---|---|
| Keep | Eight routes, authorized controller, read-only report service | Preserve URL and GET action names, paged default and existing columns absent from screenshots |
| Replace | Legacy `ms-lib` table-list, untyped forms/services/options | Typed shared report shell/title/grid/actions/states/summary/print/date/enum helpers |
| Extend | Existing report response | Add explicit completeReport opt-in, complete flag, filtered totals and accurate count metadata |
| Refactor | Report query projections | Tenant/live-parent-safe reads, source-supported labels, stable row identity/order, correct item-correlated lookup; database aggregates/counts before paging |
| Create | Repeated stock-report lifecycle | Feature-family shared composition of canonical components, typed filters, one request stream and print/export session; no new visual framework |
| Keep | Stock costing policy | Preserve opening-balance valuation basis; correct detailed denominator to opening quantity. No weighted-average/FIFO/posting/backfill invented |
| Remove | Legacy duplicate rendering/lifecycle | Remove obsolete report HTML use and duplicated request/button handlers in scope; no data deletion |

Chosen alternative: additive complete-response opt-in preserves other API callers and computes each report once. Rejected raising pageSize or repeatedly recalculating all report pages. Presentation uses complete arrays with a local 15-row shared paginator; full print/export preserve all matching rows and returned totals.

Source-supported business choices: item metadata comes from Item/StockBranch and the real persisted ItemType values; missing Minimum Stock Value has no source and stays null/empty. Preserve actual UOM Name and document No. Issue/return report has one row per persisted stock line; correlate JobItem by Job+Item and choose latest stable Id when more than one matching price exists, clearly a fallback because stock lines lack historic price. Do not multiply stock lines by every job item. Pending PO receipt linkage uses the existing textual GRN.LPONo, not an invented FK. The final contract records its matching and fallback limits. Parts report includes Items with no issues and preserves confirmed issue-quantity measures.

Phases 0/1/2/5/6 apply. Phases 3/4 do not: no editors or domain transitions. No new authorization or schema. No unresolved decision authorizes an accounting posting or data rewrite. Runtime/accounting acceptance of existing valuation and textual receipt linkage remains pending.
