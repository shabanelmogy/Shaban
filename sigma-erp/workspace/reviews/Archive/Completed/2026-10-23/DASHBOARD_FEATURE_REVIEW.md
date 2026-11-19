# Dashboard (home page `/dashboard`) — Feature Review

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-01 |
| Scope | Frontend only: `src/app/pages/dashboard/**`, `DASHBOARD_UI` block in `en.ts` / `ar.ts` |
| Repository / branch | `SiGmaAngularFrontEnd`, worktree branch `claude/friendly-kowalevski-e6c16c` (reset to `review-movements` @ `f13f322`, uncommitted changes) |
| Guides | Master Guide; UI blocks 1, 3, 4, 22, 23, 24, 25, 27, 30; `sigma-screen-refactor` skill |
| Packet drift | `Generate-SigmaRecipes.ps1 -Check` reported **all packets stale** (PLAN-00, PHASE-00..06). The canonical books were used directly; the packets must be regenerated and semantically reviewed |

## 1. Screen type

No KPI-dashboard type exists in `ui/screens/00-catalog.md`. **Canonical exception: Dashboard.** The
blocks that apply to every screen type were used. The dashboard reuses the shared list shell
(`sigma-route-host` → `sigma-list-page` → `sigma-list-panel` → `sigma-list-header` /
`app-feature-title`) and the shared filter panel (`form[appFilterPanel]`), with no grid. One
feature region, `.dashboard-scroll`, is the single vertical scroll owner.

## 2. Owner decisions (2026-10-01)

| # | Decision | Owner answer |
|---|---|---|
| D1 | Where to implement (the shared shell exists only on `review-movements`) | Main checkout. A session hook blocks edits there, so the clean worktree branch was moved with `git reset --keep review-movements` and the work is in the worktree |
| D2 | Filters and card actions did nothing | Keep the filters. Wire the actions to their screens and remove "Check Availability" when no screen exists |
| D3 | Static (mock) data | UI only. The data contract is recorded as **Missing** |
| — | Visual direction | "An attractive, distinctive look" |

## 3. Findings and resolution

| # | Finding (before) | Rule | Resolution |
|---|---|---|---|
| F1 | All counts hard-coded; no backend endpoint. `DashboardController` has only `Agreements2` (agreement analysis) | Master 4 | **Missing** data contract. Content moved to typed `dashboard.data.ts`; a future `PLAN-00` must freeze `Dashboard` read DTOs and the filter request |
| F2 | Filters and card buttons only wrote to an unread `actionName` signal | UI 3 | Filters → `form[appFilterPanel]` radio fieldsets plus the shared Reset; values held in `filterForm`. Card links → owning routes (see §4) |
| F3 | "Live overview" pulse claimed live data | Correctness | Removed; replaced by a date chip (`formatDisplayDate`, UI 17) |
| F4 | Host `calc(100dvh - …)` | UI 1, backlog 35 | `host: { class: 'sigma-route-host' }` |
| F5 | Table `max-height: 300px` created a nested vertical scroll owner | UI 1 | Tables grow naturally; horizontal overflow only |
| F6 | Custom hero title outside the shared title | UI 3 | `app-feature-title` inside `sigma-list-panel` (toolbar already excludes `/dashboard`) |
| F7 | English literals for titles, metrics, columns, filters | UI 23 | 71 keys under `DASHBOARD_UI` in `en.ts` and `ar.ts`; `Check-Translations.ps1 -Block DASHBOARD_UI` reports 0/0/0. Removed unused keys `FLEET_OPERATIONS`, `LIVE_OVERVIEW`, `FILTERS`, `FILTERS_HELP`, `SNAPSHOT` |
| F8 | Feature palette (`--dashboard-*`, many hex values) | UI 24 | No palette. Uses `--sigma-*`, Bootstrap theme colours (`--bs-success/info/warning/danger`) and the shared `sigma-status-badge` variants |
| F9 | Doughnut data (`33.3/33.3/33.4`, 2 labels) did not match the items; chart colours ≠ legend colours | Correctness | `p-chart` replaced by an SVG ring computed from the metrics (share of total). Ring and legend dots read the same tone tokens |
| F10 | 8–10px text, hover lift on non-interactive cards, no `scope`, chart without text alternative | UI 27 | ≥ 0.72rem text, no hover lift, `<dl>` metrics, `th scope="col"` / `scope="row"`, ring is `aria-hidden` with the total in HTML, card `article[aria-labelledby]` |
| F11 | Physical `left`/`right` with RTL overrides; date in English under Arabic | UI 25, 17 | Logical properties; only the "View all" arrow flips; date via `formatDisplayDate` |
| F12 | `getCardById(…)!` ×10, unused `colClass`/`scrollable`/`styleClass`, unreferenced `DashboardModule` | Cleanup | `@for` over `DASHBOARD_CARDS` with a typed `span`; dead model fields and `dashboard.module.ts` removed |

## 4. Decisions taken (Master block 4, applicable rows)

| Decision | Choice | Evidence |
|---|---|---|
| Shell and scroll | Shared list shell; `.dashboard-scroll` is the single scroll owner; title and filters fixed | UI 1, 3 |
| Filters | `form[appFilterPanel]`, `[mainColumns]="4"`, two `sigma-filter-field--choice` fieldsets; Reset restores `DASHBOARD_FILTER_DEFAULTS` | UI 4; owner D2 |
| Card links (reviewer decision, owner standing rule) | Vehicles → `/FleetVehicle`, Bookings → `/RentalBooking`, Rental agreements and Open agreements → `/RentalAgreement`, Workshop → `/Job`, NRM → `/NRM`. Fleet type, Due approvals, Idle vehicles and Hired summary have no single owning screen, so they get no link. "Check Availability" was removed because no availability screen exists | `pages/routing.ts`, `sidebar-menu.component.ts` |
| KPI strip | Five headline counts derived from the same card data (`DASHBOARD_KPIS`), so they cannot disagree with the cards | Reviewer decision |
| Loading / error | Not applicable: no request exists. Empty states use `app-state-message` for an empty table or metric list | UI 22 |
| Authorization | None invented; links are navigation only | UI 26, backlog 20 |
| Grid columns vs ListVM | No ListVM (no API); the summary tables are not paged grids | — |
| Summary tables | Semantic `<table>` instead of `app-data-table`: the shared grid always bounds a vertical scroll (`scrollHeight`), which would nest a second scroll owner inside the dashboard region | Canonical exception |

## 5. Missing / Uncertain

| Item | State | Needed |
|---|---|---|
| Dashboard data API (counts per card, branch tables, filter request: ownership, fleet type) | **Missing** | Owner: `Maintenance / Evolution Plan Dashboard data` (backend `DashboardService` / `DashboardVM` is empty) |
| Mock values disagree with each other (Rental agreements "Open" = 0, Open agreements table total = 2; vehicle statuses sum to 1 of 3) | Uncertain | Resolved once real data exists; values were kept, not invented |
| Filter semantics (does "Own/External" filter every card?) | Missing | Part of the data contract |

## 6. Doc-worthy rules for the owner (not applied mid-task)

1. Add a **Dashboard / KPI overview** screen type to `ui/screens/00-catalog.md`: shared list shell, `appFilterPanel` for page filters, one feature scroll region, a KPI strip, cards on a 12-column grid, and no `app-data-table` for small summary tables.
2. UI block 6 / 24: the shared grid has no "unbounded" mode, so a small read-only summary table must use a semantic table. Consider a shared `app-summary-table` if a second consumer appears.
3. UI block 24: accent mapping from shared theme colours (`--bs-success/info/warning/danger`, `--sigma-primary`, `--sigma-muted`) is the approved way to colour categories without declaring a palette. On a light accent, darken icon glyphs toward `--sigma-text` with `color-mix` to keep contrast.

## 7. Verification

Source-only. Build, tests, lint, browser and runtime verification were not run and remain pending
for the owner.
