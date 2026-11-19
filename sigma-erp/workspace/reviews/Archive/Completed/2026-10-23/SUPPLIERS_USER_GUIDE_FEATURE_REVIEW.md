# Suppliers — review and in-app user guide

## Final source-conformance amendment — 2026-10-08

The later owner request explicitly authorizes the complete Suppliers review and confirmed implementation. Current source comparisons found corrections beyond this artifact's earlier narrow review; the earlier "No source change was required" and "server-paged balances list" descriptions below are historical and superseded for this checkout. See SUPPLIERS_FEATURE_REVIEW.md, Final re-review reconciliation — 2026-10-08, for the nine frontend/three backend files, frozen contracts, checks and complete owner verification list.

Existing `src/app/modules/UserGuide/content/suppliers-guide.ts` now matches the final source in both languages: Supplier Excel exports all matching rows; nonblank VAT/TRN uniqueness covers all live tenant rows including inactive suppliers; dependent deletion can fail and only success removes a row; discard Cancel preserves changes. Statement Reset clears supplier/results and restores current month/ledger; outstanding is remaining payable, print includes both complete sections and active-section Excel/grouped charges cover all rows. Balances Range requires both inclusive signed bounds, including zero, with From ≤ To; balances/aging load complete responses and page locally at the shared default15. Debit-Credit and Credit-Debit signs are distinguished accurately. AP aging allocates both sides without a second deduction and measures journal movement age, not an unsupported due-date overdue period.

The existing guide route `/UserGuide/suppliers`, sidebar entry `userGuide.suppliersMenuEntry` and reader registration remain. Coverage: `/Supplier`, `/SupplierStatement`, `/SupplierBalancesSummary`, `/PayableAgeAnalysis`; four topics, four journey stages, three FAQs and 44 paired EN/AR texts. No reader/shared-layout/icon change is made by this pass. Canonical translation check across the four Supplier blocks and userGuide reports 273 keys in each language, zero missing/casing mismatches. Guide/feature source syntax, template and import checks pass; compilation, readability, print, RTL/theme/narrow layout and runtime behavior remain owner-pending. Status: Implemented — source-only; Owner verification pending: yes.

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-08 |
| Scope | `src/app/modules/Suppliers` (review), `modules/UserGuide` (guide for the Suppliers module) |
| Branch | `review-movements` (uncommitted) |
| Guides | Master block 7 *Screen user guide completion gate* (2026-10-08); UI blocks 2, 22, 23, 24, 25; `sigma-screen-refactor` skill |

## Source review

Prior review: `SUPPLIERS_FEATURE_REVIEW.md` (2026-10-03, no open findings). This pass re-checked the folder against the rules changed since then.

| Check | Result |
|---|---|
| `error: () => undefined` | None. Both error handlers set a failure flag |
| `toISOString`, `subscriptionId` in payloads | None |
| `window.print`, bare `MessageService` success | None |
| `any` | None in non-spec files |
| `calc(100dvh)`, hard-coded colours | None |
| Raw `p-table`, `btn-primary`, `p-dialog` | None |
| Translation parity (supplier, supplierStatement, supplierBalancesSummary, payableAgeAnalysis) | 0 / 0 / 0 |
| Default page size | Shared `DEFAULT_PAGE_SIZE` (15 in this checkout) |
| Date pickers | All carry `appDatePicker` |

No source change was required. Remaining items are documented in the prior review and are not in this scope.

## Drift found, not changed here

- Working copies disagree: `friendly-kowalevski-e6c16c` (worktree) has `DEFAULT_PAGE_SIZE = 20` from an earlier session, while this checkout has 15, which the 2026-10-03 changelog entry 1.55 requires. The worktree also holds an outdated Suppliers folder. Do not merge that branch without reconciling the constant.
- `sideMenu.*` in `en.ts` has 5 raw-key and 186 `ar` gaps owned by other modules (Assets, Banking, Equipment Rental, Fleet, HRM). Not in the Suppliers scope.

## User guide

- Content: `src/app/modules/UserGuide/content/suppliers-guide.ts` (`SUPPLIERS_GUIDE`), English and Arabic.
- Registered in `guide-reader.component.ts`.
- Sidebar: one entry `userGuide.suppliersMenuEntry` under the Suppliers group, linking to `/UserGuide/suppliers`.
- Translation keys: `userGuide.suppliersMenuEntry` in `en.ts` and `ar.ts`.
- Topics (route → screen): `/Supplier`, `/SupplierStatement`, `/SupplierBalancesSummary`, `/PayableAgeAnalysis`.
- Each statement about behaviour was checked against source: required fields (statement date range and supplier), the Range balance type and its From ≤ To rule, the server-paged balances list, Export to Excel covering every matching supplier, the unique VAT/TRN rule (`SupplierVatExists`, `SupplierTrnExists`), and the payable-age boundary rule.

## Owner acceptance pending

Reading, navigation, RTL, theme and print checks in the guide, and the Supplier screens at runtime.

## UI revision (2026-10-08)

- Lists no longer use browser markers. Steps show a numbered circle inside the item; notes show a check icon. Items use flex with one gap, so markers align on the first line in both directions and do not drift with line height.
- Topics accept an optional `icon` (default `bi bi-window`); the four Suppliers topics use the icon of their menu entry.
- "How to use" carries a list icon; subheadings take the primary colour.
- Three icon names used by the earlier content did not exist in the installed Bootstrap Icons 1.13.1 (`bi-balance-scale`, `bi-file-invoice-dollar`, `bi-chart-bar`) and were replaced by existing names (`bi-wallet2`, `bi-receipt-cutoff`, `bi-bar-chart`). Every icon used in `UserGuide` was checked against the font.
- Customers and Sales topics keep the default topic icon; their content files are owned by other sessions.

## Screen and action icons (2026-10-08)

- Screen links in the Screens tab: "All screens" uses the grid icon; each topic uses its topic icon (default window icon).
- Action links: "Open guide" uses the enter icon, and "Back to guides" uses the back arrow. The "Open screen" and "Print guide" buttons already had icons.
- Tab icons (journey, screens, questions) already existed in the reader and were not changed.

## Equal card heights (2026-10-08)

- Journey, Screens and Questions grids use equal rows (`grid-auto-rows: 1fr`), so every card in a tab has the height of the tallest card in that tab. A single selected topic keeps its natural height.
- Cards fill their grid cell through the shared `app-form-section` host. The card's inner box is stretched with `::ng-deep`, because the shared component exposes no height option; its `fill` option was not used since it clips content, which would cut text in print.
- The gap between stacked cards inside these grids is the grid gap (12px); the 16px per-card margin is removed only inside these grids.
- Source-only: layout at desktop and narrow widths, print, RTL and dark theme need owner visual acceptance.
