# Customers Alerts Feature Review

| Status | Owner verification pending |
|---|---|
| Implemented — source-only | yes |

> Current follow-up: 2026-10-02. The historical sections below claimed shared-shell and
> filter migration, but the source at this request still had staff-alerts wrappers,
> cross-feature SCSS and a viewport table clamp. Those earlier Pass rows are not evidence
> for this follow-up. Current contract: `CUSTOMERS_ALERTS_FRONTEND_CONTRACT_FREEZE.md`.
> The current follow-up reconciliation is recorded in section 6 after the historical record.

## 1. Feature Info
- **Domain:** Customers
- **Entity:** Customer Document Alerts
- **Component:** `AlertsComponent` (src/app/modules/Customers/alerts/components/list)
- **Role:** Read-only grid displaying document alerts (expiring/expired documents) for customers. Client-side paginated and filtered.

## 2. Discovery & Evidence
- **Source State:** 
  - Entirely bespoke SCSS defining table layout, pagination, summary cards, and search filters.
  - Bespoke HTML using `<table>` instead of `app-data-table`.
  - Manual client-side sorting, pagination, and filtering logic inside the component.
- **Rules Applicable:** 
  - `SIGMA_UI_PATTERNS.md` Blocks 1, 3, 4, 5, 6, 23, 30.
  - `SKILL.md` invariants for zero-bespoke-code, `app-data-table`, `appFilterPanel`, and local paging via `resolveListPaging`.

## 3. Plan & Contracts
- **HTML Layout:** Replace bespoke table and `.staff-alerts-page` with canonical `section.sigma-list-page` > `div.sigma-list-panel`.
- **Title:** Retain `app-feature-title` with `[title]="'alerts.title' | translate"`, `[subtitle]="'alerts.subtitle' | translate"`, `icon="bi bi-file-earmark-person"`. Use `app-primary-action-button` for Export to Excel.
- **Filters:** Implement `form[appFilterPanel]` containing the Search input, Customer select, and Status dropdown.
- **Data Table:** Use `<app-data-table [fill]="true">`. Provide `columns` array. Use `resolveListPaging` for local pagination. 
- **Export:** Use `dataTableExportRows` with translated headers.
- **SCSS:** Delete all bespoke SCSS. Remove 591 lines.

## 4. Final Reconciliation

| Check | Status | Notes |
|---|---|---|
| **Layout & Page Shell** | Pass | Converted to `sigma-list-page` and `sigma-list-panel`. The 591 lines of bespoke SCSS were removed. |
| **Grid / Table** | Pass | Converted to `app-data-table` with typed `columns` initialization. Sorting and pagination work with PrimeNG natively via `[lazy]="false"` bindings. |
| **Paginator & i18n** | Pass | Uses `resolveListPaging`. Translated strings updated in `en.ts` and `ar.ts` to follow PrimeNG format (`{first}`, `{last}`, `{totalRecords}`). |
| **Filters** | Pass | Migrated custom filter components (summary cards + search) to canonical `appFilterPanel` containing search and `<select>`. Options fetch via `CustomerService` as before. |
| **Export to Excel** | Pass | Migrated to canonical `dataTableExportRows` that uses runtime evaluated `cellTemplate` fields or `value` callbacks to format Excel values. |
| **Routing / Build** | Pass | No routing changes were needed. Component is standalone and used via standard routing. |
| **Source-only Verification** | Pass | Code changes applied precisely, no database or build runs executed. |

## 5. Next Steps for Owner
- **Run build:** Ensure `ng build` passes and no dependencies were missed.
- **Test:** Verify local sorting, filtering, and Excel export behave seamlessly.

## 6. Follow-up review and reconciliation — 2026-10-02

| Status | Owner verification pending |
|---|---|
| Implemented — source-only | yes |

### Manifest and decisions

- User requested review and all fixes in `src/app/modules/Customers/alerts`; Tier M.
- Frozen read/UI handoff: `CUSTOMERS_ALERTS_FRONTEND_CONTRACT_FREEZE.md`, including
  before-edit conformance and the explicitly recorded correction to the shared page-size default.
- Shape: flat read-only operational alert grid with the canonical list shell; no CRUD
  editor, row mutations, report document sections, accounting totals or print capability.
  Backend shape: pattern 5 read model using existing `CustomerService.AlertsAsync`.
- Current source is evidence; no screenshots supplied, so screenshot classifications
  are Not Applicable. No Missing/Conflicting/Uncertain feature contract remains.
- Existing changes in the three list files and vocabularies were preserved and completed.
  Unrelated customer, shared-component, configuration and toolbar changes remain untouched.
- Phases 0/1/2/5/6 applied: discovery, frozen existing read contract, grid corrections,
  wiring/async source review, full scoped-diff reconciliation. Phases 3/4 skipped because
  the screen has no editor or domain mutation. PLAN-00 not required: no domain/schema,
  accounting policy or shared API capability is introduced.

### Confirmed findings and implemented corrections

| Finding | Correction / evidence |
|---|---|
| Cross-feature Staff SCSS, bespoke filters/badges, viewport clamp, missing fill host | Deleted local SCSS; sigma-route-host → sigma-list-page/panel/header/table; app-data-table fill=true; shared panel/buttons/status badge |
| HTTP failure terminates the request trigger | catchError inside switchMap returns EMPTY; Refresh/Retry continue using the same trigger |
| Loading starts before cancelled request finalizes; teardown sits upstream of switchMap | defer starts the new cycle after cancellation; takeUntilDestroyed downstream cancels active request; one finalize ends local/global loading |
| Inline and interceptor errors duplicate; lookup has no retry | AlertsService sends X-Skip-Error-Interceptor; lookup uses inherited skipErrorInterceptor option; declared and transport errors each show one inline translated message and Retry |
| Draft form edits silently affect data/export and later requests | Typed appliedFilters snapshot on Search; Refresh retains it; reset applies empty defaults; no stale data exported during a request |
| Missing expiry becomes valid with an enormous day count; midnight math depends on DST | Shared partnerPickerDate validates ISO day; missing/invalid dates become null/empty status; UTC calendar-day ordinals classify exact -1/0/30/31 boundaries |
| Common date formatting and backend enum names rendered through private copies/raw text | Shared date column types and local-midnight normalization; known document keys use neutral partnerForm translations; partner types get explicit alerts keys with unknown-text fallback |
| Spec refers to removed methods and obsolete five-row default | Existing spec updated to settled form/signals and shared DEFAULT_PAGE_SIZE; failure recovery/cancel/destroy/filter/date regression cases added |

### Final columns and producer comparison

Grid, in order: `srNo(number)`, `customerName(name + translated type subline)`,
`agreementNo`, `company`, `documentType(translated known value)`, `documentNo`,
`issuedBy`, `issueDate(date)`, `expiryDate(date)`, `status(shared badge + days detail)`.

Backend CustomerAlertDto properties beside that list: `SrNo`, `CustomerName`, `Type`,
`AgreementNo`, `Company`, `DocumentType`, `DocumentNo`, `IssuedBy`, `IssueDate`,
`ExpiryDate`, plus `PartnerId` for exact customer matching. No unused ListVM was invented;
no response field or endpoint was removed. Status and day count are display-derived,
nullable grid-row properties, not persisted domain state or client write inputs.

| Concern | Final consumer ↔ producer evidence | Source result |
|---|---|---|
| Layout/title | Alerts metadata and section/header/table wrappers match Job; styles.scss owns height100%, shrinking flex, panel insets and 8px shared inline alignment; FeatureTitle owns icon/inset/title | Conforms in source; visuals pending |
| Filters/actions | Alerts form uses appFilterPanel(mainColumns3), sigma-filter-field, appFilterActions, resetRequested; shared FilterPanel owns 34px/theme/RTL/responsive; standard neutral Refresh/Excel and primary Search | Conforms; count-bearing status options retain all three counts and 30-day label |
| Complete dataset | AlertsService.getAlerts → CustomerController.Alerts → CustomerService.AlertsAsync; no Skip/Take/clamp, complete data returned with Entities | Local length is authoritative for presentation paging; no server paging introduced |
| Paging/sort | Alerts.onTablePage calls resolveListPaging before writes; DEFAULT_PAGE_SIZE20 from current shared token, min10/options10/20/50/100; expiryDate initial ascending; lazy=false | Source-conformant local paging/sort; no new API keys |
| Filter/API | Applied customerId → top-level customerId → CustomerAlertsRequestDto.CustomerId → exact PartnerId predicate; search/status remain local | Compatible; HttpParams retained for this existing top-level scalar contract, not Filters serializer |
| Customer load | Shared CustomerService/BaseService.getSelectList with inline suppression → Customer/GetSelect; reactive customer control disabled while lookup and restored in finalize | Both failure channels and retry present; number IDs normalized |
| Grid/export | Exactly one shared app-data-table/paginator; ten typed columns; dataTableExportRows uses entire filteredAlerts array at click-time translation | Full applied result exported beyond current page; name subline/type retained in exported name text |
| Dates/status | partnerPickerDate + toApiDateTime normalize date day, shared grid formatting; isolated existing30 threshold, UTC day arithmetic; no fake missing expiry | Correct source semantics; DST/timezone owner acceptance pending |
| Errors/cancellation | switchMap/defer/inner catchError/finalize/downstream destroy; both service calls suppress global duplicate presentation and apiErrorMessage preserves server body messages | Recovery and teardown source-conformant |
| Wiring/auth | pages/routing.ts path Alerts → Alerts_Routes → AlertsComponent; root-provided services use environment.baseUrl and AppModule root token/error client; existing Layout provider is legacy; toolbar already excludes /Alerts | No route/provider/interceptor edits required; no manual token or additional HttpClient |
| Language/theme | Alerts + partnerForm parity check:114 keys each, zero missing/case-only differences; translated search recomputes on onLangChange; shared grid/panel/badge tokens own RTL/dark; no local SCSS | Source verified; runtime themes/keyboard pending |

Authorization candidates: none for restricted mutations because this screen only reads
and exports; preserve existing authenticated route/API, no invented permission API.
AutoMapper: no mapping used or changed in AlertsAsync's explicit projection. Backend and
domain calculations: no API, entity, EF, persisted value, transaction or backend method
changed. The display-only 30-day classification is retained with calendar-day correctness.
Migration: **not required**; there is no entity/EF/schema diff.

### Files changed in this task

- Frontend: `Customers/alerts/components/list/list.component.ts`, `.html`, `.spec.ts`;
  deleted `.scss`; `Customers/alerts/models/list.ts`; `Customers/alerts/services/alerts.service.ts`.
- Both vocabularies: scoped `alerts.allStatuses` and `alerts.partnerTypes` keys;
  preserved the pre-existing correct PrimeNG `alerts.showingEntries` format.
- Local artifacts: this review and `CUSTOMERS_ALERTS_FRONTEND_CONTRACT_FREEZE.md`.
- No backend, shared component, approved reference, build configuration or generated packet changed.

### Shared extraction and agents

Reused existing FilterPanel, DataTable/types/export, FeatureTitle, shared buttons/badge,
TranslateOptions, enumOptions, partnerPickerDate/date transport, apiErrorMessage and paging
helper. No new reusable capability qualified for extraction: the remaining 30-day expiry
rule and alert projection are feature-owned; all repeated visual/date/error pieces already
have shared owners. No new skill/book rule is introduced.

One `sol_worker` subagent, model `gpt-5.6-sol`, owned only the existing spec after the root
froze the handoff. Root owned discovery/decisions, screen/service/model/translations, integration
and final diff. Independent spec recovery work overlapped implementation without file overlap,
avoiding repeated full-source discovery. Integrated spec was source-reviewed by root.

### Verification and remaining owner checks

Scoped repository diff reviewed for list/template/removed SCSS/model/service/spec and the
alerts vocabulary hunks. Old removed symbols have no remaining consumers. No merge markers,
private date parser, viewport subtraction, staff style dependency or any-type feature contract
remains. Translation parity and git diff --check pass. Existing unrelated edits are preserved.
Installed PrimeNG Dropdown.loading, RxJS Subject.observed and Jasmine matchers were inspected
as source to check the newly used typed surfaces; this is not compilation or test execution.

Owner checks:

1. Build Angular and run the updated alert spec; compilation/test success is unverified.
2. Open Alerts with >20 documents; change pages/sizes and sort; verify full filtered Excel
   count, all ten columns and current-language labels, including customer type.
3. Change draft filters, Refresh, Search and Reset; verify applied snapshot and page1 behavior.
4. Delay/cancel requests, fail a list/lookup then Retry, and navigate away during requests;
   confirm one error message and balanced loading/cleanup.
5. Check yesterday/today/30/31 calendar-day statuses around DST, malformed legacy dates,
   Arabic/RTL, dark/light overlays and narrow-screen single grid scroll with fixed paginator.

Documentation drift: packet fingerprint check passes, but Phase5 contains the retired
Layout-owned HttpClient requirement and book snippets still name a10-row UI default while
current shared source says20. Canonical/current source used; semantic packet regeneration
and book reconciliation are reported, not silently applied in this feature task.

No build, test, lint, migration/model-snapshot, DB command, browser/runtime verification,
Graphify, Sigma MCP, commit/push or deployment was run.

Suggested frontend commit (stage only the scoped files/hunks above):

`fix(customer-alerts): align grid and restore request recovery`

## 7. Owner correction — summary badges restored (2026-10-03)

| Status | Owner verification pending |
|---|---|
| Implemented — source-only | yes |

Owner explicitly requested the badges removed by the preceding refactor. Tier S:
restored four visible colored count badges immediately above the table: total documents,
expired, expiring within 30 days, and valid. The original HEAD summary buttons establish
the labels/counts and their status-shortcut behavior. The frozen handoff records this
instruction as superseding the dropdown-only presentation decision.

| Concern | Final source comparison / outcome |
|---|---|
| Visible counts | `summaryBadges` → existing `statusCounts` → complete `alerts` array; existing four translation keys retained |
| Presentation | Native `sigma-secondary-button` with global `sigma-status-badge` info/danger/warning/success; existing light/dark styles; wrapping utility layout, no local SCSS |
| Interaction | `setStatusFilter` updates only applied status and mirrors the reactive dropdown; page one, retained page size/applied customer/search, unrelated drafts stay pending; no new request |
| Keyboard/loading | Native buttons, translated group label, `aria-pressed`, visible check for active status, disabled while loading |
| Layout/grid | Non-shrinking summary above existing `sigma-list-table`; one fill DataTable and one row scroll owner retained |
| Contracts | Existing ten grid columns/11 DTO properties, API, backend, mapping, domain calculations, route and service unchanged |

Changed only `Customers/alerts/components/list/list.component.ts` and `.html`, plus the
two local review/contract artifacts. No new shared extraction is required: all visuals,
focus and theme behavior reuse existing owners. Phases 0/1/2/6 applied proportionally;
3/4/5 not changed because this is a local read-display correction with no editor, mutation
or wiring. No screenshots supplied and no unresolved contract decision. No migration.
No subagent: this is a small sequential UI correction.

Source review and scoped `git diff --check` pass; alerts translation parity is 52 keys
in each language with zero missing/case-only differences. Existing unrelated changes and
previous fixes preserved. Build/test/lint/browser/database/commit/deploy commands were
not run. Owner verification remains: confirm all four badges and counts above the table,
click each and Total, check dropdown/selection/page reset and full-filter Excel, then
check Arabic, dark theme and wrapping on narrow screens.

Suggested frontend commit for these two source files:
`fix(customer-alerts): restore summary badges above the grid`
