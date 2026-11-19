| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Stock Reports menu relocation — 2026-10-04

User explicitly requests moving Stock Reports under Stocks and naming it Reports, after ItemReturn/StockTransfer. UI-only wiring; no backend, reports or route changes. Master 2/4/5 and UI1 authenticated-shell sidebar disclosure govern. Recipe check already reports stale packets; canonical books govern pending owner regeneration/semantic review.

Impact/classification: Extend existing Stocks children; move existing reports group intact; rename existing sideMenu.stockReports translation to Reports / التقارير. Keep all eight report routes, icons and tone classes. Keep existing menu key identity. Existing Limousine → Reports nested group and SidebarMenu groupHeader/isGroupOpen/toggleGroup are the source-supported composite; no new component/styles/disclosure engine. Arabic lacks nested sideMenu stockReports/report leaf labels, so add those consumed labels in that namespace; preserve unrelated legacy root labels.

Menu contract: Stocks contains existing seven stock screens, then Reports. Reports children: /StockSummary, /DetailedStockReport, /PurchaseOrdersDetailReport, /PurchaseDetailsReport, /ItemIssueReport, /ItemsReturnReport, /GrnPendingReport, /PartsMovingReport. No second root Stock Reports group remains. Report leaf shortcut IDs remain route-based. MenuCatalog group IDs include parent path; normalize previously saved group:sideMenu.stockReports to group:sideMenu.stock/sideMenu.stockReports at shortcut load to preserve existing pins without changing storage schema or key.

Conformance: sidebar-menu-data owns structure; SidebarMenu native button groupHeader owns both existing levels, search/route highlighting remain intact; MenuCatalog builds current breadcrumbs; SidebarShortcuts normalizes only relocated group ID. Existing root Stocks group shortcut naturally includes all current descendant reports.

Sequential small UI change, no agents required. Final scoped diff/key/link inspection required. Build/test/browser/runtime/storage verification remains pending; no prohibited commands. Manual checks: hierarchy and all eight links, search/clear, root+nested disclosure, old Reports pin and individual pins, breadcrumbs, EN/AR, RTL/dark/narrow/minimized sidebar. Suggested FE commit: refactor(stock): nest reports under stocks.
