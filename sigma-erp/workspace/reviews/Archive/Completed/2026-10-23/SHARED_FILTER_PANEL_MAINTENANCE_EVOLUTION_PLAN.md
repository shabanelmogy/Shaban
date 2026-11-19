# Shared Filter Panel — Maintenance / Evolution Plan

| | |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-09-30 |
| Scope | Stage 1 of "shared components, minimal customization": list filter strips. Stage 2 (`app-data-table` overrides) is a separate plan. |
| Owner decisions | 2026-09-30 — "تمام ابدأ وطبعا عايزين نوصل ب jobs لاقصى نظام بحيث تكون مرجع قوى": approve moving filter look from features to a shared component, Job list as the pilot and canonical reference, migrate other screens during the sidebar review, remove the unused `custom-filter` |
| Guides | Master; UI blocks 1 (page fill), 4 (filters), 16 (dropdowns), 19 (validation), 23 (translations), 25 (RTL/dark); packet `PLAN-00` (drift check 8×OK) |

## 1. Outcome, non-goals, success

**Outcome.** A list screen declares *which* filters it has, their order and width, and its
form/search logic. The look — strip surface, grid, field label/control styling, *More filters*
toggle and panel, toolbar row, light/dark theme, RTL, responsive, motion — is owned once by a
shared component and global tokens. The Job list becomes the canonical reference for list
screens.

**Non-goals.** No change to search/paging/export/route-restore logic, APIs or backend. No
mass migration of the 64 screens in this plan. `app-data-table` overrides are Stage 2.

**Success.** (1) Job list renders the same as today in light and dark, LTR and RTL, desktop
and phone, with its feature SCSS holding no filter colours, borders or dark rules. (2) A new
list screen needs zero filter SCSS. (3) The book and the skill say so, and Phase 6 checks it.

## 2. Existing-State Inventory

| Concern | Current owner/source | Current behavior | Consumers | Known debt/constraint | Evidence |
|---|---|---|---|---|---|
| Filter strip look | Each feature SCSS (UI block 4: "a feature continues to own layout, colors, borders, focus treatment, and responsive behavior") | Every screen re-declares surface, grid, label, control, dark rules | 64 feature SCSS files with a strip | Heavy duplication; up to 61 filter lines per file (Rental Agreement), 52 in Job | grep `-filter-grid`/`-filters {` over `modules/**/*.component.scss` |
| Dark theme of filter controls | Each feature (`:host-context([data-bs-theme='dark']) ::ng-deep … .p-dropdown`) | Present in some screens, missing/wrong in others | 31 screens carry their own dark dropdown rules | Job used undefined tokens (`--feature-filter-*`, `--sigma-text-secondary`, `--sigma-button-secondary-*`) → light colours in dark mode (fixed 2026-09-30) | Job `list.component.scss` history; UI block 4 step 9 |
| Control height | Global `styles.scss` (`:where(.sigma-filter-form, [class$='-filters'], …)`) | 34px for inputs/dropdowns/calendars in any `*-filters` form | All filter forms | Only the dimension is centralized (comment in styles.scss) | `src/styles.scss` ≈ line 2840 |
| Theme tokens | `styles.scss` `:root` / `[data-bs-theme='dark']` | `--sigma-filter-panel-surface/-border/-label` exist for light and dark | Few screens use them; most invent feature tokens | No control-border / muted / toggle tokens | `src/styles.scss` lines 20–56 |
| *More filters* | Feature markup | Job (canonical pill toggle, 2026-09-30), Lease Agreement (older text toggle) | 2 screens | Each re-implements toggle, count, panel | UI block 4 *Main row and More filters* |
| Actions row | Feature markup | Export (secondary) + `app-primary-action-button type="submit"` | ~81 templates | Reset present in some screens (Lease) and not others (Job) | grep |
| `custom-filter` shared component | `shared/components/custom-filter` | Unused | 0 templates | Dead code | grep `app-custom-filter` = 0 |
| Legacy lists | ms-lib `table-list` | Own built-in search, no feature strip | 163 templates | Out of scope (migrated when each screen is rebuilt on `app-data-table`) | grep `<table-list` |

## 3. Logic Ambiguity Register

| Rule/question | Current evidence | Status | Why it matters | Required decision/source | Owner |
|---|---|---|---|---|---|
| Who owns filter look | UI block 4 says feature | Conflicting → **resolved** | Root cause of duplication | Owner approved moving it to shared (2026-09-30) | Owner |
| Reset button in every strip | Lease has Reset, Job not; book silent | Confirmed | Reference completeness | **Mandatory** (owner 2026-09-30 "خلى زر reset اجبارى"): the panel always shows Reset and emits `resetRequested`; the feature restores its defaults and searches page 1 | Owner |
| Main-row size | UI block 4 step 1: ≤ 6 | Confirmed | Layout | — | Book |
| Screens whose filters need special layout (vehicle + checkbox pair in Lease) | Lease `lease-agreement-vehicle-filter` | Derived | Must not force every field into one cell | Field classes `--wide` (span 2) and `--full`; anything else stays a recorded feature exception | Reviewer |
| Migration pace | Owner: during sidebar review | Confirmed | Risk control | — | Owner |

## 4. Impact Map

| Area | Producer/owner | Consumers | Data/calculation impact | Compatibility risk | Required phase |
|---|---|---|---|---|---|
| New `app-filter-panel` component | shared/components | Job now; others on review | None | Additive (new selector) | Phase 2 (read-grid) |
| Global filter field styles + tokens | `src/styles.scss` | Any `.sigma-filter-field` | None | New class names only; existing `*-filters` height rule unchanged | Phase 2 |
| Job list template/SCSS | Workshop/Job list | Job users | None | Visual parity required | Phase 2, Phase 6 |
| UI block 4 rule + skill §3 | Docs | Every future screen | — | Book version bump; packets regenerated | Learning protocol |
| Master block 5 / Phase 6 check | Docs | Every review | — | New check item | Learning protocol |
| `custom-filter` removal | shared | none | None | None (0 usages; verify imports) | Phase 5 |
| Backend / API | — | — | None | None | — |

## 5. Gap Decision Table

| Area | Current state | Decision | Target responsibility | Reason/evidence |
|---|---|---|---|---|
| Strip surface, grids, toolbar, *More filters* | Feature SCSS/markup | **Create** `app-filter-panel` | Shared component | One implementation of UI block 4 steps 1–11 |
| Field label/control look, dark controls | Feature SCSS | **Create** global `.sigma-filter-field` (+ `--wide`, `--full`) | `styles.scss` | Controls are projected; global class styles them without `::ng-deep` |
| Filter tokens | Partly global, mostly feature | **Extend** `--sigma-filter-panel-*` with `-control-border`, `-muted`, toggle-icon tokens (light + dark) | `styles.scss` | No undefined `var()` again |
| 34px height rule | Global | **Keep** | `styles.scss` | Already canonical |
| Active-count logic | Feature signal + valueChanges | **Refactor** into the component (reads the host `FormGroupDirective`, counts named controls) | Shared component | Feature passes names only |
| Job filter SCSS/markup | Feature | **Refactor** to the component; delete filter styles | Job list | Pilot + reference |
| Lease *More filters* | Feature (text toggle) | **Keep** until its review, then Refactor | Lease list | Owner: migrate during review |
| Other 62 strips | Feature | **Keep** until each review, then Refactor | Each screen | Owner decision |
| `custom-filter` | Unused | **Remove** | — | 0 usages |
| UI block 4 ownership sentence | Feature owns look | **Replace** | Book | Owner decision |

## 6. Option / Decision Matrix

| Option | Business correctness | Maintainability | Compatibility/migration | Future extension | Complexity/risk | Decision |
|---|---|---|---|---|---|---|
| A. Global SCSS classes only (no component) | Same | Medium: markup (toggle, count, toolbar) still copied per screen | Easy | Toggle behaviour duplicated | Low | Rejected |
| B. Config-driven component (fields as JSON config) | Same | High for simple fields, poor for custom templates (enums with translated items, calendars with `#ref` overlays) | Every screen rewritten | Rigid | High | Rejected |
| **C. Attribute component on the form + content projection + global field class** | Same | High: feature keeps its fields/templates as-is, look is shared | Screen-by-screen, additive | New slots/inputs without breaking | Medium | **Selected** |

## 7. Decision Review

| Decision requiring owner input | Options presented | Trade-offs explained | Owner decision | Evidence/date | Remaining condition |
|---|---|---|---|---|---|
| Move filter look from feature to shared | Keep feature-owned / shared component | Duplication vs one owner | Shared | Chat 2026-09-30 "تمام ابدأ" | Book updated in slice 3 |
| Pilot and reference | Job | — | Job, "أقصى نظام … مرجع قوى" | Chat 2026-09-30 | Slice 4 audit |
| Migration pace | All at once / during review | Risk vs speed | During review | Chat 2026-09-30 | — |
| Remove `custom-filter` | Keep / remove | Dead code | Remove | Chat 2026-09-30 | Verify no TS import |

## 8. Target Contract

| Contract | Target owner | Exact rule/shape | Existing consumers affected | Status/evidence |
|---|---|---|---|---|
| Domain/invariant | — | None | — | N/A |
| Persistence/data | — | None | — | N/A |
| Calculation/precision | — | None | — | N/A |
| API/request/response | — | None (search payloads unchanged) | — | N/A |
| Failure behavior | Feature | Search/export errors stay in the feature (`errorMessage`, both failure channels) | Job | Unchanged |
| Authorization/tenancy | — | None | — | N/A |
| UI/workflow | `shared/components/filter-panel` | See §8.1 | Job (slice 2) | Frozen |
| Reports/export | Feature | Export button projected into the actions slot; export reads the same form | Job | Unchanged |
| Integration/runtime | — | Standalone component, no providers | — | Frozen |

### 8.1 UI contract — `FilterPanelComponent`

```html
<form class="job-filters" appFilterPanel
      [formGroup]="filterForm" (ngSubmit)="search()"
      [advancedControls]="advancedFilterNames"
      [(advancedOpen)]="advancedFiltersVisible"
      moreFiltersLabel="job.filters.moreFilters"
      (resetRequested)="resetFilters()">
  <!-- main row: plain fields -->
  <div class="sigma-filter-field"> <label for="job-no">…</label> <input id="job-no" formControlName="no" /> </div>
  …
  <!-- advanced panel: lazy template -->
  <ng-template appFilterAdvanced>
    <div class="sigma-filter-field">…</div>
  </ng-template>
  <!-- actions (inline-end of the toolbar) -->
  <ng-container appFilterActions>
    <button type="button" class="sigma-filter-secondary" (click)="exportExcel()">…</button>
    <app-primary-action-button type="submit" … />
  </ng-container>
</form>
```

- **Selector** `form[appFilterPanel]` — the component *is* the form, so the existing `*-filters`
  height rule, `ngSubmit` and `formControlName` resolution stay unchanged. Projected content and
  the `ng-template` keep the feature's injector, so `formControlName` binds to the feature form.
- **Inputs:** `mainColumns = 6`, `advancedColumns = 5`, `advancedControls: readonly string[] = []`
  (names counted for the badge), `moreFiltersLabel` (translation key, default
  `general.moreFilters`), `busy = false` (disables toggle/reset). Reset is always rendered.
- **Model:** `advancedOpen` (two-way signal model, default `false`).
- **Outputs:** `resetRequested`.
- **Slots:** default = main fields; `ng-template[appFilterAdvanced]` = advanced fields (toggle
  shown only when present, rendered with `@if`); `[appFilterActions]` = inline-end actions.
- **Count badge:** component injects the host `FormGroupDirective`, subscribes to
  `valueChanges` (and counts once after view init) and counts `advancedControls` whose value is
  not null/empty.
- **Field classes (global):** `.sigma-filter-field` (label + one control), `--wide` (span 2),
  `--full` (full row); `.sigma-filter-secondary` for Export/Reset.
- **Tokens (global, light + dark):** `--sigma-filter-panel-surface`, `-border`, `-label`
  (exist), plus new `-control-border`, `-control-surface`, `-control-text`, `-placeholder`,
  `-muted`, `-toggle-icon-color`, `-toggle-icon-bg`, `-toggle-icon-bg-active`,
  `-toggle-icon-ring` — values exactly those frozen in UI block 4 steps 7–10.
- **Look/behaviour:** UI block 4 *Main row and More filters* steps 1–11 (surface, pill toggle,
  icon chip, rotating chevron, dashed advanced panel, reduced motion, responsive 3 → 1 columns,
  logical properties for RTL).
- **Feature SCSS after migration:** only screen-specific layout that the field classes cannot
  express, recorded as an exception in the screen review.

## 9. Migration and Compatibility Plan

| Change | Existing data/consumer behavior | Migration/backfill/default | Rollout order | Recovery/rollback | Owner action |
|---|---|---|---|---|---|
| New component + global classes/tokens | No existing screen uses them | None | Slice 1 | Remove the new files/classes | Build |
| Job list migration | Same filters, same logic, same payload | None | Slice 2 | Revert the Job template/SCSS diff | Build + visual check (light/dark, LTR/RTL, phone) |
| Book/skill rule change | Future reviews | Packets regenerated | Slice 3 | Book history (CHANGELOG) | None |
| `custom-filter` removal | 0 usages | None | Slice 5 | Restore folder | Build |
| Other screens | Unchanged until reviewed | None | Each sidebar review | Per screen | Per review |

## 10. Dependency-Ordered Implementation Plan

| Slice | Outcome | Depends on | Applicable phases/packets | Main areas | Completion evidence |
|---|---|---|---|---|---|
| 1 | `FilterPanelComponent` + `appFilterAdvanced`/`appFilterActions` directives, global `.sigma-filter-field`/`.sigma-filter-secondary`, tokens (light/dark), translations `general.moreFilters`, `general.activeFiltersCount`, `general.reset` (reuse if present) | — | PHASE-02, PHASE-05 | `shared/components/filter-panel/`, `src/styles.scss`, vocabs | Source review; no feature changed |
| 2 | Job list on the component; filter SCSS removed; count logic removed from the feature; Reset added | 1 | PHASE-02, PHASE-06 | `Workshop/Job/components/list/*` | Diff: feature SCSS has no filter colour/dark rules; owner visual parity |
| 3 | UI block 4 rule replaced (shared owns look; feature owns fields/order/width/exceptions), UI block 4 reference → component, skill §3.4, Master block 5 gate + Phase 6 check "feature SCSS has no filter colours/borders/dark rules", CHANGELOG, packets | 1–2 | Learning protocol | Books, skill | `-Check` 8×OK |
| 4 | Job list reference audit (read-only first) against UI blocks 1–7, 16, 19, 23, 25, 27 and the Phase 6 checklist; implement confirmed findings | 2 | PHASE-02, PHASE-04, PHASE-06 | Job list | Audit table in `reviews/JOB_LIST_REFERENCE_FEATURE_REVIEW.md`; findings closed or listed |
| 5 | Remove `custom-filter` after confirming no TS import | — | PHASE-05 | `shared/components/custom-filter` | grep = 0 |

## 11. Verification Matrix

| Risk/behavior | Source check | Automated check | Runtime/browser/data check | Owner | Completion gate |
|---|---|---|---|---|---|
| `formControlName` inside projected content/template binds to the feature form | Template review | Build (owner) | Type in a hidden filter, search → payload has it | Owner | Payload correct |
| Visual parity light/dark | Token list = UI block 4 values | — | Job in light and dark | Owner | Screenshots match |
| RTL | Logical properties only | — | Arabic UI | Owner | Toggle/chevron/badge mirrored |
| Responsive | Media queries 1250/720 | — | Phone width | Owner | One column, no page scroll (UI block 1) |
| Count badge after route restore | Code review | — | Navigate away/back with a hidden filter set | Owner | Badge shows count |
| Reset | Code review | — | Reset → defaults, page 1, results reload | Owner | — |
| No leftover feature filter styles | grep Job SCSS for filter colours/`data-bs-theme` filter rules | — | — | Reviewer | 0 matches |
| Height rule still applies | `form` keeps `*-filters` class | — | Controls 34px | Owner | — |
| Prohibited commands | — | — | — | Reviewer | No build/test/browser run by the agent |

## 12. Implementation (2026-09-30)

| Slice | Result | Files |
|---|---|---|
| 1 | `FilterPanelComponent` (`form[appFilterPanel]`, OnPush, unencapsulated, host class `sigma-filter-panel`), `FilterAdvancedDirective`, `FilterActionsDirective`; `--sigma-filter-*` tokens light/dark in `src/styles.scss`; `general.moreFilters`, `general.activeFiltersCount` (en/ar) | `shared/components/filter-panel/*`, `src/styles.scss`, vocabs |
| 2 | Job list on the panel: 6 main + 10 advanced fields moved unchanged into `sigma-filter-field`; toggle/count logic removed from the feature; `resetFilters()` (current month, Open, page 1); Export as `sigma-filter-secondary`; list SCSS 293 → ~110 lines with no filter styles; header Lubrication button on shared tokens; unused `job.filters.activeCount` removed | `Workshop/Job/components/list/*` |
| 3 | UI block 4 0.83 (*Shared filter panel*, ownership sentence replaced, check item), Master block 5 1.12 (gate + Phase 6 SCSS search), skill §3.4 + pre-flight item + revision row, CHANGELOG, packets 8×OK | books, skill |
| 5 | `shared/components/custom-filter` deleted (0 template/TS references) | shared |
| 6 | Owner 2026-09-30 "فى styles ممكن تكون shared من ملف css الخاص ب job": shared list page shell in `src/styles.scss` (`sigma-route-host`, `sigma-list-page`, `sigma-list-panel`, `sigma-list-header`, `sigma-list-table`, `sigma-alert`/`--warning`, `sigma-secondary-button`); `app-data-table` `@Input() fill` (backlog 34 resolved); filter panel uses `sigma-secondary-button`; Job list stylesheet deleted (host class `sigma-route-host`, `[fill]="true"`); UI block 1 0.84, block 6, backlog 34, Master 1.13, skill | `src/styles.scss`, `shared/components/data-table/*`, `shared/components/filter-panel/*`, Job list, books |
| 4 | **Pending** — Job list reference audit | — |

Owner verification: build; Job list in light and dark, LTR and RTL, desktop and phone; open *More filters*, set a hidden filter → badge 1, search → payload has it; navigate away and back → badge restored; Reset → current month, Open, page 1; Export still works.

## 13. Stage 2 — `app-data-table` closed (2026-09-30)

Owner: "خلص الاول الجزء ده عشان نقفل النقطة ديه".

| Item | Result |
|---|---|
| Column types | `DataTableColumn.type` = `text`/`number`/`money`/`date`/`dateTime`/`status` (+ `status(row) → { label, tone }` → `sigma-status-badge`); `data-table.format.ts` (`dataTableCellText`, `formatMoney`, `dataTableExportRows`) shared by grid and export |
| Job list | Columns use `type`; no templates, no formatting helpers; export = `dataTableExportRows(rows, columns, translate)` |
| Fill migration | 12 feature copies → `[fill]="true"`: Movements (NRM, Collection, Custody, Delivery, Workshop), Transportation Trips, Workshop Vehicles, Work Order, Job Category, Labour Activities, Job Estimation list + logs dialog |
| Fixed-height grids | TripSheet, Transportation Agreement: duplicate `::ng-deep` removed; their `scrollHeight` input stays |
| Overrides | 47 files / 1,190 lines → 33 files / 652 lines; 22 of the 33 only set the supported `--sigma-data-table-*` variables |
| Exceptions (own review) | Fleet Accidents, Alerts, Service Bookings, Service Log (page not container-filled — block 1 shell first); not on `app-data-table`: Limousine ×4 (`table-list`), Rental Planner, Opening Balance accounts, Workshop Vehicle details |
| Guide | UI 0.86 (blocks 5, 6, 8, backlog 34), Master 1.14, skill, CHANGELOG, packets 8×OK |

Owner verification: build; each migrated screen fills the panel, rows scroll inside, the paginator stays at the bottom, the page never scrolls; TripSheet/Transportation Agreement keep their fixed grid height; Job export = grid columns.
