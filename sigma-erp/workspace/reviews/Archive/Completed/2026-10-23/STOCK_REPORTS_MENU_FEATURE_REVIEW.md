| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Stock Reports menu relocation — final reconciliation

Frozen handoff STOCK_REPORTS_MENU_CONTRACT_FREEZE.md implemented. Stocks now contains the existing seven stock screens followed by Reports, with all eight existing report links/icons/tones intact. English sideMenu.stockReports=Reports; Arabic=التقارير with all eight report leaf labels present in the consumed sideMenu.stockReportss namespace. Legacy unrelated root vocabulary remains intact.

Files: sidebar-menu/sidebar-menu-data.ts (move existing group); sidebar-shortcuts.service.ts (normalize old saved Reports group pin to its new parent-path identity, dedupe); modules/i18n/vocabs/en.ts and ar.ts (direct labels). Existing shared groupHeader/disclosure/search, catalog breadcrumbs, links and route-key leaf identities reused. No template/styles/routes/API/report changes.

Source-only inspection confirms exactly one nested Reports group, no root duplicate, and routes /StockSummary, /DetailedStockReport, /PurchaseOrdersDetailReport, /PurchaseDetailsReport, /ItemIssueReport, /ItemsReturnReport, /GrnPendingReport, /PartsMovingReport in the same order. All consumed report labels match EN/AR. Complete scoped diff reviewed; whitespace checks passed. Phases0/1/5/6 only; read-grid/detail/domain-action/backend phases not applicable to this menu-only change. No agents: small sequential UI wiring. No migrations.

Owner checks pending: build FE; Stocks→Reports hierarchy and each report route, search/clear/disclosure/keyboard, old group pin and individual pins, appbar breadcrumbs, EN/AR/RTL/theme/narrow/minimized sidebar. No build/test/browser/runtime or storage mutation executed. Generated recipe drift already reported; canonical UI1 authenticated-shell sidebar block used pending owner regeneration/semantic review.

Suggested FE commit only: `refactor(stock): nest reports under stocks`. No prohibited commands run.
