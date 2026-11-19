<!-- Part of UI block 20: see ../20-report-page.md. Same status and authority as the block. -->


### Tabbed report sections

**One on-screen section title.**
In every new or reviewed tabbed report, when the Tab caption identifies the
table's section, do not repeat that caption as a heading above the table on
screen. Keep the main feature title and column headers. Retain a print-only
section heading because tabs are hidden in print; use the shared
`.sigma-print-only` utility in `src/styles.scss` (do **not** rely on retired
Bootstrap `d-none d-print-block` utilities, which are not loaded in Sigma) on
the heading, without duplicating per-feature screen-hide CSS. Keep each panel's
aria-labelledby pointing to its Tab, its existing mode-specific caption and
all applicable sections in the DOM. Supplier Statement adopts this for its
Ledger/Outstanding and Advance Tax headings; other consumers adopt in scope.
This makes the existing Customer Statement print-only-heading rule below
explicit for all reviewed tabbed reports; it changes no data or print scope.

**Owner clarification (2026-11-19) — no repeated active tab or inner selector title:**
This rule applies to **every** tab in a tabbed report (`app-editor-tabs`) and
also to inner master-detail navigation selectors (such as a side `p-listbox`
branch or group list inside a report or tabbed report). When the active tab
caption or selected side-list item already identifies the displayed table or
group on screen, never repeat that title as a heading or `app-form-section`
banner inside the panel on screen. Keep section and group headings print-only
with `.sigma-print-only` so printed output retains every section and group
title when screen navigation (`no-print`) is hidden, and preserve accessible
region labelling (`aria-labelledby` or `aria-label`). Detailed Vehicle
Utilization Report adopts `.sigma-print-only` for all six workspace tabs and
its inner `Branch Wise Rented` split pane; other existing reports adopt it when
reviewed in scope.

**Frozen owner refinement, 2026-10-03:** Follow Up keeps two shared workspace
tabs, Details and Summary, and both sections stretch to the report panel's full
content width through the existing public `sigma-route-host--full-width`
placement. This supersedes the earlier 520px and 960px Summary limits; the panel
remains responsive and the public shared-grid minimum width owns any internal
horizontal overflow without page scroll. Summary remains unpaginated;
Details binds the complete array to the existing controlled local paginator with
the shared default 15 rows and 10/15/20/50/100 choices (the later owner decision
in UI6 supersedes the earlier 20-row default), using the feature
`reports.followUpShowingEntries` page-report key with `{first}`, `{last}` and
`{totalRecords}` placeholders. Details retains its page and
chosen size when switching tabs; valid Search, filter edits, Reset and the
raw-username drill-down reset its offset while preserving size. Existing shared
`app-summary-cards` presents the four server-owned additive operational KPI cards
in equal auto-fit columns with `[minCardWidth]="220"` and `[maxHeight]="180"`:
four columns when the
container permits, then three, two or one as it narrows. Use its
comfortable Dashboard KPI shape: 14px vertical/16px horizontal padding, 44px
semantic icon with a 14% accent wash, 10px radius, 12px gap, 1.6rem value, 9%
accent wash and 3px
logical-start accent through the shared sigma/Bootstrap tokens. Compact density
uses the shared 10px/12px padding, 32px icon, 8px gap and 1.35rem value when the
screen's content requires it; no feature card geometry or palette is copied.
The overall follow-up count uses the approved primary accent through its
descriptor; no feature-only emphasis variant is introduced. The user
cell uses the quiet shared `sigma-report-user-action` secondary action, including
inherited hover/focus/busy behavior; null/blank groups remain label-only.
Comparison bars remain custom cells in the shared grid renderer, with feature
placement limited to the public 88px/7px semantic bar dimensions and Summary's
175px count column through public column classes. A compact translated
scope/reference-date row and balanced caption row sit above the grid. Ordinary
Excel follows the active complete section and its current columns, exporting all
filtered Details rows regardless of the visible page; full print keeps KPI values,
captions, reference text and all Summary/Details arrays regardless of selection,
hides decorative icon tiles, temporarily releases pagination/scrolling, then
restores the controlled page, size, selected tab and form state. Follow Up's
existing `.sigma-report-panel` also opts into the public
`sigma-report-panel--aligned-title` modifier. Keep busy, printing,
filter-invalidation, metrics, formulas and reference-date semantics unchanged;
feature formulas remain in the frozen contract/review.
Metric formulas, scopes and reference-date semantics remain in the frozen Follow
Up contract/review and are not universal report defaults. No new shared
disclosure capability or feature-owned tab/card palette is required.

**Explicit presentation choice, 2026-10-02:** the owner requests every Customer
Statement section table to match BalancesSummary's shared grid. That report
uses typed `app-data-table` columns with lazy=false and owner-approved local
pagination (block 6), retaining full response arrays and backend totals. To keep
the paginator at the card bottom, it uses fill=true and scrollable=!printing():
the external report frame is a flex layout boundary with overflow hidden and the
active shared grid row wrapper owns both scroll axes. Pass shrinking flex height
through the visible panel. The tab label identifies the section on screen; the
owner removes its duplicate table heading, which remains visible only in print.
Panel aria-labelledby still points to the tab. Every section
keeps independent controlled paging; print preparation turns pagination and
scrolling off and restores them after print/cancel/failure (block 21). Print
panel layout returns to block flow. Every report section follows this shared-grid
baseline when the report is reviewed. Existing out-of-scope consumers migrate at
their own review; no feature table palette is added.

When the owner approves tabs for an existing sectioned report, reuse
`app-editor-tabs` with `appearance="workspace"` (block 13), typed keys, existing
translation labels and optional response-row counts. Keep this `no-print`
navigation outside the bounded results area, below the filters and
backend totals. Each feature panel follows the shared ID/aria-labelledby
contract and remains keyboard focusable. The shared component owns tab styling
and keyboard navigation; feature CSS owns only section layout and visibility.

Preserve the report's mode-specific section conditions and existing radio/select
mode controls. Switching sections changes presentation without another API call,
server paging or changed accounting. Ordinary Excel follows the selected section's
complete array and current columns (block 8); print still covers every applicable
section (block 21). When converting an existing grouped report to tabs, check its
output contract first. If one export already covers every group, retain that
scope and label the action accordingly under [UI8, tabbed report scope](../08-export-to-excel.md).
Empty sections remain inspectable without a fabricated response. Resetting filters
selects the primary section; a Refresh of the same filters retains selection.
Reset the actual row viewport when selecting a section without moving keyboard
focus off the selected tab. Flow reports reset the outer frame; filling
shared grids use `DataTableComponent.scrollToStart()` (block 6), never a feature
query of PrimeNG internals.

Keep all sections applicable to the chosen report mode in the DOM and hide
inactive panels with screen-media CSS only. Do not use `@switch`, conditional
rendering or `[hidden]` for the active-section selection: full-report printing
requires all applicable panels, independently of the selected tab (block 21).
Existing mode conditions still govern which sections belong to the report.
