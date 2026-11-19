| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-03 |

# Shared application summary cards

Authority: owner requested one fixed application shape, explicitly preferred Dashboard, required documentation for every screen type, and added Customers/Alerts, BalancesSummary and ReceivableAgeAnalysis to FollowUpReport and DebtCollection. Width/height remain suitable to the screen and card content. Frozen handoff: [shared card contract](<REPORT_SUMMARY_CARDS_UI_CONTRACT_FREEZE.md>). No screenshots supplied; written instructions and actual Dashboard source are the evidence. Visual/runtime acceptance is pending.

## Final implementation and source comparison

`SummaryCardsComponent` is the one display owner. `SummaryCard` descriptors carry ids, translation keys, original values, icons and approved accents; optional hints, secondary values and number/money/text format remain display inputs. The component performs no request, aggregation, lifecycle calculation or business action. It emits a stable id only in optional native-button selection mode.

| Concern | Owning book/reference | Actual producer/consumer comparison | Source result |
|---|---|---|---|
| Reference shape | UI 24/25; Dashboard KPI strip in dashboard.component.scss before extraction | Shared component keeps 14/16px padding, 44px icon, 14% icon wash, 10px radius, 12px gap, 1.6rem value, 9% surface wash, 3px logical-start stripe | Matched; user-authorized wrapped labels and money suffix support extend content handling |
| Compact dimensions | Owner flexible-size choice; UI 24 shared owner | Shared compact density: 10/12px padding, 32px icon, 8px gap, 1.35rem value | One shared variant; no per-screen card typography or palette |
| Dense values/fit row | Latest owner Aging correction; shared component SCSS | Dense density uses8/10px padding,24px icon,6px content gap,1.05rem value and0.6875rem label. Shared row uses actual card-count equal minmax(0,1fr) tracks; container query <=1100px falls back to min-width-based auto-fit | All cards stay within the host; no horizontal off-screen rail; feature selects shared options only |
| Responsive/height | UI 1/20/24; frozen sizing refinement | Shared auto-fit columns from minCardWidth; natural equal row height; optional maxHeight bounds only the card list with internal scroll, keyboard focus and visible focus | No page scroller; remaining grid height preserved by bounded card regions |
| Dashboard | DashboardComponent.kpis from existing DASHBOARD_KPIS | Maps existing items to stable label-key id; app-summary-cards uses default comfortable/190px, natural height | Same values/labels/icons/accents; page-local KPI markup/SCSS removed; larger chart/table cards unchanged |
| FollowUpReport | FollowUpReportListComponent.totals/referenceDate; prior frozen backend Totals DTO | summaryCards maps four exact backend counts, existing backend promise percentage and reference-date captions; comfortable/220px/max180 | Full-width route modifier and 100% Summary; no response/formula changes |
| FollowUp table/actions | UI 6/20/21; existing DataTable/EditorTabs/ReportPrintService | Same Details/Summary panels, complete arrays, controlled default20 local paging, print preparation and active-section Excel; new reports.followUpShowingEntries uses totalRecords placeholders; count column w-175px, bar88x7 | Title/filter alignment retained; shared user action style; tab/page/form restoration unchanged |
| DebtCollection | DebtCollectionReportComponent.statusChips; latest owner bottom-spacing request | Six descriptors preserve counts, labels, order and debit/credit/balance accents; compact/170px/max180, no-print,12px bottom margin on host | Local card/chip rules removed; request, row ceiling, dialogs/actions and print scope unchanged |
| Alerts | AlertsComponent.statusCounts/summaryBadges/setStatusFilter | Four compact/180px/max160 selectable cards; selected id follows applied status; known-id mapping calls existing guarded filter setter | Counts scope, native disabled/aria-pressed, page reset and existing filter semantics preserved |
| BalancesSummary | totalBalance, statement response, formatBalance | Main card host bounded to320px with existing8px list inset; three statement cards retain order; compact/180px. Each uses Math.abs solely for presentation + formatMoney + translated Dr/Cr suffix | Backend totals and paged transport intact; grid/export formatBalance unchanged; direction suffix never shrinks away |
| ReceivableAgeAnalysis | totals/appliedPeriods; existing complete-response contract; owner single-row and off-screen/smaller-value correction | Five fixed totals then seven effective period labels/values, money format; dense/140px/max180, shared layout=row,12px host bottom separation | Twelve equal cards fit within the host above1100px; smaller containers wrap cards automatically; no horizontal rail or off-screen last card;1.05rem values. Print wraps all twelve; formulas/periods/scope/output/paging unchanged |
| Monetary and language | UI 14/20/23; shared formatMoney/MoneyPipe | Component calls the same formatter as the grid/pipe (two Latin decimals, existing rounding); suffix/hints/labels translate at render; title includes the complete amount and translated suffix | No new rounding/calculation or cached translated descriptors |
| Print | UI 21; shared component SCSS and existing print preparation | Card-list max height/overflow removed; white surface/neutral border/text, no stripe/icons, amounts/hints wrap; existing no-print respected | Full source print flow retained; actual pagination/layout acceptance pending |
| Integration | UI preamble/shared owner; explicit tsconfig.app.json files list | Every direct consumer imports standalone SummaryCardsComponent; new runtime component entry explicitly listed, no broad include | Same routes/providers/services; no new external dependency |

Accounting accents use the existing `--sigma-debit-value`, `--sigma-credit-value`, `--sigma-balance-value`; category accents use existing Sigma primary and Bootstrap success/info/warning/danger/neutral theme values. These are existing display meanings. Labels and values carry meaning independently of color; financial formulas remain feature/backend-owned.

## Files and scope

Frontend repository: `F:/My Work/Sigma/SiGmaAngularFrontEnd`.

- New shared files: `src/app/modules/shared/components/summary-cards/summary-card.model.ts`, `summary-cards.component.ts`, `.html`, `.scss`.
- FollowUpReport: `components/list/list.component.ts`, `.html`, `.scss`.
- DebtCollection: `components/report/report.component.ts`, `.html`, `.scss`.
- Customers/alerts: `components/list/list.component.ts`, `.html`.
- BalancesSummary: `components/list/list.component.ts`, `.html`, `.scss`.
- ReceivableAgeAnalysis: `components/list/list.component.ts`, `.html`, `.scss` (host bottom separation only).
- Dashboard: `dashboard.component.ts`, `.html`, `.scss` (KPI strip only).
- Shared integration: `tsconfig.app.json`; `src/styles.scss` retains shared quiet user action styles and removes the interim insights implementation; vocabulary `en.ts`/`ar.ts` gains four FollowUp captions and the translated Details paginator report.

Existing dirty source/configuration and deleted scaffold tests were present before this work. Task snapshots under TEMP/sigma-follow-up-visual-20261003 and TEMP/sigma-summary-cards-20261003 identify the actual task delta; no unrelated changes were reverted. The former interim insights and feature-local card styles are removed, leaving one active KPI-card renderer. No backend source, API, DTO, AutoMapper, entity, financial calculation or schema change in this presentation task; no Add-Migration needed.

## Documentation and verification

UI preamble, UI 14/20/24, screen catalog and the skill digest own the rule for **every screen type**: new/reviewed summary, KPI and total-card regions use `app-summary-cards`. Features supply content and public sizing/selection inputs, with host placement only. Existing legacy screens migrate in their scoped review; this work does not claim a bulk application migration. General form sections/editor shells/tables keep their existing shared owners.

Documentation promotion is complete at UI version 1.52: preamble, UI 14/20/24, screen catalog, changelog and skill digest include the all-screen shared owner, public sizing, dense fit/wrap row and 12px separation. Root reviewed source integration, all four new shared files, actual target values, complete task snapshot deltas and repository-scoped source diffs; snapshots distinguish pre-existing dirty modifications. Scoped tracked diff --check and all new shared-file whitespace inspection pass. Every in-scope local import and referenced Bootstrap Icon glyph resolves; no conflict markers or old card-copy/insights references remain in the changed consumers. Translation parity over reports/alerts/balancesSummary/receivableAgeAnalysis/DASHBOARD_UI has 466 keys in each dictionary with zero missing or case-only differences. All eight generated packets were regenerated through the script; final drift and book-reference checks pass.

Phases: discovery and source/reference comparison (0), frozen UI handoff (1), scoped card/read presentation (2), standalone/runtime-root integration (5), source reconciliation (6). No backend/write/editor-persistence/domain-action phase is required. Existing DebtCollection single-page row ceiling/absence of total count remains the prior feature's open business/data-scope decision; this shared UI adoption does not resolve it or relabel counts as complete/global totals.

Agent utilization: one existing documentation worker drafted books/skill/version updates; root completed final promotion and generated packets after the bounded worker stopped. One bounded consumer worker owned the three added customer consumers. Inherited models used under AGENTS routing because the mapped terra worker model was unavailable. Separate source/doc ownership and frozen shared API allowed parallel work without overlapping edits. Root owns shared extraction, Dashboard/Follow/Debt, final sizing/title fixes, documentation refinements, integration and reconciliation. Parallel work reduced the time for independent consumer adoption and documentation drafting.

Owner verification: compile the frontend; inspect English/Arabic, RTL/light/dark and narrow panels; verify long signed amounts keep Dr/Cr and full title, all twelve custom aging labels, zero-value cards, keyboard selection/focus and Alerts page reset; verify Follow Details paginator, tab retention, complete Summary/Details print and Excel, print/cancel restore; inspect bounded card-region scroll without page scroll and enough grid space. No runtime result is claimed. No builds, tests, lint, browser/app, database, migration, commit, push or deployment commands were run.

Suggested commits (suggest only): frontend `refactor(ui): share Dashboard summary cards across customer screens`; documentation `docs(ui): require shared summary cards for every screen type`.
