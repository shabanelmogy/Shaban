# DEBT_COLLECTION — Discovery and Contract Freeze

**Feature:** Customers > Debt Collection follow-up report
**Artifact scope:** Discovery evidence and frozen contract for the Debt Collection report refactor.

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

**Scope:** Customers > Debt Collection follow-up report — the Angular feature folder `SiGmaAngularFrontEnd\src\app\modules\Customers\debtCollection\` and its directly related routing, layout-provider, translation, and .NET backend files (`CustomerController`, `ICustomerService`, `CustomerService.GetDebtCollectionAsync`, `DebtCollectionDto`, `BlackListController`, `FollowUpController`, and the two dead report-support files). No other feature is in scope.

---

## Discovery evidence

All facts in this section were read from source by the lead reviewer. Runtime, build, test, browser, and database verification were not performed and remain pending for the owner. Where something was not read, this artifact says "Not inspected" rather than inferring it.

### Frontend scope folder

`F:\My Work\Sigma\SiGmaAngularFrontEnd\src\app\modules\Customers\debtCollection\`

| File | Role |
|---|---|
| `debtCollection.routes.ts` | One route only: path `''`, component `DebtCollectionReportComponent`. |
| `components/report/report.component.ts` \| `.html` \| `.scss` | The report screen. 403 lines TS, 363 lines HTML, 836 lines SCSS. |
| `components/followup-report/followup-report.component.ts` \| `.html` \| `.scss` | Follow-up history dialog plus add-follow-up dialog. 205 / 138 / 283 lines. |
| `components/report/report.component.spec.ts` | Existing spec file. |
| `models/debtCollection.ts` | `DebtCollectionDTO`, `DebtCollectionFilter`, `BlackListPayload`, `BlackListListItem`. |
| `models/followUpReport.ts` | `FollowUpHistoryDTO`, `AddFollowUpPayload`. |
| `services/debtCollection.service.ts` | `DebtCollectionReportService`, `GET Customer/DebtCollection`. |
| `services/black-list.service.ts` | `BlackListService`, `GET BlackList/GetAllWithNavigations`. |
| `services/followUp-report.service.ts` | `FollowUpReportService`, `GET FollowUp/Customer/{id}`, `POST FollowUp` (BaseService `'FollowUp'`). |

Related wiring outside the feature folder:

- `src\app\pages\routing.ts` — registers the feature at path `'DebtCollection'` via a lazy import of `DebtCollection_Routes`.
- `src\app\_metronic\layout\components\sidebar\sidebar-menu\sidebar-menu-item\..\sidebar-menu-data.ts` — sidebar link `'/DebtCollection'`.
- `src\app\_metronic\layout\layout.module.ts` — imports `DebtCollectionReportService` and lists it in `providers` (line ~314 and ~901).

### Backend scope files

| File | Relevant symbol |
|---|---|
| `SiGma.ServerAPI\Controller\CustomerController.cs` | `[HttpGet("DebtCollection")] GetDebtCollection([FromQuery] DebtCollectionRequestDto, CancellationToken)` delegating to `Service.GetDebtCollectionAsync`. |
| `SiGma.Business\IServices\ICustomerService.cs` | `Task<Result<List<DebtCollectionResultDto>>> GetDebtCollectionAsync(DebtCollectionRequestDto request, CancellationToken)`. |
| `SiGma.Business\Services\Customers\CustomerService.cs` | `GetDebtCollectionAsync` implementation, lines 298–644. |
| `SiGma.Helpers\Reports\CustomerReports\DebtCollectionDto.cs` | `DebtCollectionRequestDto : SpecificationRequestDto`; `DebtCollectionResultDto` with 19 members. |
| `SiGma.ServerAPI\Controller\BlackListController.cs` | Generic `SiGmaControllerBase<BlackListAddVM, BlackListUpdateVM, BlackListDetailVM, BlackListListVM, IBlackListService>` — so `POST BlackList` and `GET BlackList/GetAllWithNavigations` are inherited, not declared. |
| `SiGma.ServerAPI\Controller\FollowUpController.cs` | Generic `SiGmaControllerBase` over `IFollowUpService` — so `POST FollowUp` and `GET FollowUp/Customer/{id}` are inherited. |
| `SiGma.Business\Specifications\Customers\DebtCollectionSpec.cs` | 68 lines. **DEAD CODE** — nothing in either repository references `DebtCollectionSpec`. |
| `SiGma.Business\FakeData\Customers\DebtCollectionFakeData.cs` | **DEAD CODE** — nothing references `DebtCollectionFakeData`. It returns 6 fabricated `DebtCollectionResultDto` rows. |

### Shared owners referenced by the corrections

- `src\styles.scss` — the shared report classes `appReportPage`, `sigma-report-panel`, `sigma-report-filter-panel`, `sigma-report-table-frame`, `sigma-report-table`, `sigma-report-number`, `sigma-report-empty`, verified present at lines 3056–3320 and 3965–4090; shared `--sigma-*` tokens; shared print styles.
- `app-editor-dialog` / `EditorDialogComponent` — supports `title`, `subtitle`, `contentPadded`, `saving`, `primaryActionVisible`, and the disabled-close contract.
- Shared date recipe `toApiDate` / `appDatePicker` / `dateInputMask`; shared `money` pipe; shared display-date helper.
- `src\app\modules\i18n\vocabs\en.ts` and `ar.ts` — the `reports.*` namespace.

---

## Confirmed review findings

### F1 — Fake-data specification is dead and misleading

`DebtCollectionSpec` builds fake predicate filters (`CustomerId % 3 == customerType % 3`, `% 2`, `% 4`, `% 5`) and is referenced nowhere. `DebtCollectionFakeData` is likewise unreferenced. The live behaviour is the real implementation in `CustomerService.GetDebtCollectionAsync`.

**Evidence:** repository-wide symbol search returned only the declarations plus `DebtCollectionFakeData`'s own file.

### F2 — Silent row truncation at 100

`CustomerService.GetDebtCollectionAsync` ends with `var size = Math.Clamp(request.PageSize, 1, 100)` then `Skip((page-1)*size).Take(size)`, and returns `Result<List<DebtCollectionResultDto>>` with no total count. The Angular service hardcodes `PageNumber=1` and `PageSize=100`. Consequence: when more than 100 customers match, the screen, its print output and its Excel export silently omit the remainder.

**Evidence:** `CustomerService.cs` lines 636–643; `debtCollection.service.ts` lines 23–25.

### F3 — Report page does not use the canonical report shell

The screen renders bespoke `debt-collection-page` / `debt-collection-panel` wrappers, a bespoke 5-column filter grid, bespoke action buttons and a bespoke table, instead of the shared `appReportPage` + `sigma-report-panel` + `sigma-report-filter-panel` + `sigma-report-table-frame` + `sigma-report-table` + `sigma-report-number` + `sigma-report-empty` classes that already exist in `src\styles.scss` (verified present at lines 3056–3320 and 3965–4090). UI block 20 declares this replacement mandatory.

### F4 — Forbidden page height

`report.component.scss` lines 3–7 and 724–729 and 758–761 compute a page height with `calc(100dvh - var(--bs-app-header-height) - ...)`. `AGENTS.md` and UI block 1 forbid a page-height calc and require the container-fill host chain.

### F5 — Rogue palette and ad-hoc visuals

`report.component.scss` defines ~15 ad-hoc hex tokens (`--debt-accent: #20aaa7` teal fork, `#f1f3f7`, `#5f778b`, `#314b60`, `#20aaa7`, `#2d92d1`, `#237bb5`, `#ed5d6c`, plus dark values), a zebra rule (`tbody tr:nth-child(even)`), a hover rule, and an orange gradient badge (`.debt-blocked-badge { background: linear-gradient(135deg,#e7a13a,#cf741d) }`). UI block 24 forbids ad-hoc/deprecated hexes and the teal forks; the shared tokens are `--sigma-*`.

### F6 — Table geometry contradicts the canonical report table

`report.component.scss` sets `min-width: 1840px`, `height: 52px` rows, `text-align: center` cells and its own sticky header, while block 20 requires roughly 30px compact rows, logical-end alignment for numeric cells with tabular numerals, logical-start for the description column, and no feature header palette.

### F7 — Custom print mode

`report.component.scss` has its own `@media print` block overriding page/panel/frame and hiding `.no-print`. Block 21 and the shared print styles own print release; a report should mark bounded layers `sigma-print-flow` instead.

### F8 — Date filtering bypasses shared helpers

`report.component.ts` defines a private `formatApiDate` (lines 396–402) instead of the shared `toApiDate` / `appDatePicker` / `dateInputMask` single-date recipe. UI block 17 requires `p-calendar appDatePicker` with `[dateInputMask]="true"` and a matching `dd/mm/yyyy` placeholder.

### F9 — Money formatting bypasses the shared pipe

The result table formats amounts with `| number: '1.0-2'` in 11 cells instead of `| money` (block 20 requires the money pipe for report amounts).

### F10 — Duplicated export header construction

`report.component.ts` builds translated export keys inside a `computed()` (lines 87–107). Block 20 marks memoising translated object keys in a `computed()` as **Legacy — do not copy**: `translate.instant()` reads no signal, so a language switch does not invalidate cached headers. Export rows must be built at click time.

### F11 — Filter lifecycle not reactive

The filter form is disabled through template `[disabled]` bindings on each control instead of `filterForm.disable({ emitEvent: false })` plus re-enable in `finalize`. Block 20 requires the reactive busy contract. There is also no Reset action and no `hasSearched` distinction between "not run" and "empty".

### F12 — Redundant blacklist request

The screen calls `BlackListService.getAllForDebtCollection()` (`GET BlackList/GetAllWithNavigations` — the whole blacklist table) on init and keeps a client-side `Set<number>` of ids, although the same response's `status` member already carries the per-row blacklist state, which the backend sets from the same source (`var status = blacklistedIds.Contains(p.Id) ? "BLACKLIST" : string.Empty`). The extra request is removable without behaviour change.

### F13 — Untranslated aria-label

`report.component.html` line 204 has a hard-coded English `aria-label="Blacklist status"`.

### F14 — Unused import

`report.component.ts` imports `CheckboxModule` and uses `p-checkbox` — verify during implementation; if any imported module is unused after the refactor it must be removed. Recorded as a cleanup, not a behaviour finding.

### F15 — Dialogs bypass the shared editor shell

Both the blacklist reason dialog and the follow-up dialogs use raw `p-dialog` with `[closable]="false"`, feature-specific footer buttons and feature-specific headers, instead of `app-editor-dialog` (which already supports `title`, `subtitle`, `contentPadded`, `saving`, `primaryActionVisible` and the disabled-close contract). The follow-up dialog's primary button is rendered inside the dialog header instead of the shared footer.

---

## Decisions frozen for this refactor

| ID | Decision |
|---|---|
| D1 | **Shape:** the screen stays a read-only single-section report. Canonical references: `ui/screens/07-report.md`, `ui/20-report-page.md`, `ui/21-report-print.md`; backend Pattern 5 (reports). Approved Angular reference: `Customers/StatementOfAccount/components/list`. |
| D2 | **Transport contract is NOT changed in this refactor.** `GET Customer/DebtCollection` keeps `Result<List<DebtCollectionResultDto>>`, the same `Filters[key]` convention and the same 100-row ceiling. F2 is instead resolved by a recorded limitation plus a documented owner decision request; the screen must stop implying an unpaged complete dataset and must state the applied ceiling in its review evidence. Rationale: `AGENTS.md` forbids inventing a contract, and block 20 forbids inferring completeness from `Result<T>`. |
| D3 | F12 is resolved by deleting the redundant blacklist fetch and reading the row's `status` member through the existing `isBlacklistedValue` normalisation. |
| D4 | Dead code F1 (`DebtCollectionSpec.cs` and `DebtCollectionFakeData.cs`) is removed, since removing dead roots is the recorded cleanup convention and it cannot change behaviour. |
| D5 | The feature SCSS is reduced to column geometry and section structure only (block 20), and the page adopts the container-fill host chain; all filter, panel, table, print, palette and dark-theme rules are deleted in favour of the shared classes and tokens. |
| D6 | Money cells use `\| money`; blanks render `—`; dates render through the shared display helper. |
| D7 | Export rows are built at click time from the current language. |
| D8 | Filters move to the shared report filter strip with a Reset action, reactive `disable()`/`enable()` around the request, and `hasSearched` separating not-run from empty. |
| D9 | The three dialogs migrate to `app-editor-dialog` with `[contentPadded]="true"`, the shared footer, and the feature keeping only its own field layout. |
| D10 | New translation keys are added to BOTH `src\app\modules\i18n\vocabs\en.ts` and `ar.ts` with no duplicates, using the existing `reports.*` namespace. |
| D11 | **No permission API is introduced:** the app has `AuthGuard` but no authorisation mechanism. Any destructive or access-restricting action is listed as an authorisation candidate instead of being hidden. |

---

## Conformance table

Pre-refactor state is recorded as found in source. "deviation — corrected in this refactor" marks a row where a confirmed finding applies.

| Concern | Owning block | Reference file/symbol | Target file/symbol | Match or deviation |
|---|---|---|---|---|
| Report shell | UI block 20 (`ui/20-report-page.md`); `ui/screens/07-report.md` | `appReportPage`, `sigma-report-panel` in `src\styles.scss` (lines 3056–3320, 3965–4090) | `report.component.html`: `debt-collection-page`, `debt-collection-panel` | deviation — corrected in this refactor (F3) |
| Filter strip | UI block 20 + UI block 17 | `sigma-report-filter-panel` (shared) | `report.component.html` / `.scss`: bespoke 5-column filter grid, per-control `[disabled]` | deviation — corrected in this refactor (F3, F8, F11) |
| Table frame | UI block 20 | `sigma-report-table-frame`, `sigma-report-table`, `sigma-report-empty` (shared) | `report.component.html` / `.scss`: bespoke table, own sticky header, `min-width: 1840px`, `height: 52px` | deviation — corrected in this refactor (F3, F6) |
| Numeric cells | UI block 20 | `sigma-report-number` (logical-end + tabular numerals) | `report.component.scss`: `text-align: center` cells | deviation — corrected in this refactor (F6) |
| Money formatting | UI block 20; D6 | shared `money` pipe | `report.component.html`: `\| number: '1.0-2'` in 11 cells | deviation — corrected in this refactor (F9) |
| Print flow | UI block 21 (`ui/21-report-print.md`); D5 | shared print styles + `sigma-print-flow` marker class | `report.component.scss`: feature `@media print` block, `.no-print` hiding | deviation — corrected in this refactor (F7) |
| Date control | UI block 17; D6 | `appDatePicker`, `dateInputMask`, `toApiDate` | `report.component.ts`: private `formatApiDate` (lines 396–402) | deviation — corrected in this refactor (F8) |
| Dialogs | UI block 20; D9 | `app-editor-dialog` / `EditorDialogComponent` | blacklist reason dialog and `followup-report.component.html`: raw `p-dialog`, feature headers/footers, header-hosted primary button | deviation — corrected in this refactor (F15) |
| Translations | UI block 20; D10 | `reports.*` namespace in `src\app\modules\i18n\vocabs\en.ts` + `ar.ts` | `report.component.html` line 204: hard-coded `aria-label="Blacklist status"`; export keys memoised in `computed()` (F10) | deviation — corrected in this refactor (F10, F13) |
| Page height | UI block 1 (container-fill host chain); `AGENTS.md` | container-fill chain, `height: 100%` on the route host | `report.component.scss` lines 3–7, 724–729, 758–761: `calc(100dvh - var(--bs-app-header-height) - ...)` | deviation — corrected in this refactor (F4) |
| Palette | UI block 24 (`--sigma-*` tokens) | shared `--sigma-*` tokens in `src\styles.scss` | `report.component.scss`: ~15 ad-hoc hexes incl. `--debt-accent: #20aaa7`, zebra + hover rules, `.debt-blocked-badge` orange gradient | deviation — corrected in this refactor (F5) |
| Export | UI block 20; D7 | export rows built at click time from the current language | `report.component.ts` lines 87–107: translated keys memoised in a `computed()` | deviation — corrected in this refactor (F10) |

---

## Reviewer decisions (owner standing rule)

| ID | Decision | Evidence (one line) |
|---|---|---|
| D1 | Keep the read-only single-section report shape. | `ui/screens/07-report.md` + `ui/20-report-page.md` + `ui/21-report-print.md` select the report shape; backend Pattern 5 owns reports; approved reference `Customers/StatementOfAccount/components/list`. |
| D2 | Do not change the transport contract; record F2 as a limitation and request the owner decision. | `CustomerService.cs` lines 636–643 and `debtCollection.service.ts` lines 23–25 show the 100-row clamp and hardcoded paging; `AGENTS.md` forbids inventing a contract. |
| D3 | Delete the redundant blacklist fetch and use the row `status` member. | `CustomerService.GetDebtCollectionAsync` sets `var status = blacklistedIds.Contains(p.Id) ? "BLACKLIST" : string.Empty` from the same source the extra request reads. |
| D4 | Remove `DebtCollectionSpec.cs` and `DebtCollectionFakeData.cs`. | Repository-wide symbol search returned only the declarations plus `DebtCollectionFakeData`'s own file (F1). |
| D5 | Reduce feature SCSS to column geometry and section structure; adopt the container-fill chain. | UI block 20 owns the report classes; block 1 owns the container-fill chain; the shared classes already exist in `src\styles.scss` lines 3056–3320, 3965–4090. |
| D6 | Use `\| money`, render blanks as `—`, render dates through the shared display helper. | UI block 20 requires the money pipe for report amounts; F9 shows 11 cells using `\| number: '1.0-2'`. |
| D7 | Build export rows at click time from the current language. | F10: `translate.instant()` reads no signal, so the `computed()` at `report.component.ts` lines 87–107 does not invalidate on language switch (block 20 marks this Legacy — do not copy). |
| D8 | Move filters to the shared filter strip with Reset, reactive `disable()`/`enable()`, and `hasSearched`. | F11: per-control `[disabled]` bindings and no Reset/no `hasSearched` in `report.component.ts` / `.html`. |
| D9 | Migrate all three dialogs to `app-editor-dialog` with `[contentPadded]="true"`. | F15: raw `p-dialog` with `[closable]="false"`, feature headers/footers, and a header-hosted primary button. |
| D10 | Add new keys to both `en.ts` and `ar.ts` under `reports.*` with no duplicates. | F13 (`aria-label="Blacklist status"` at `report.component.html` line 204) and the export-header keys at `report.component.ts` lines 87–107 need translated replacements. |
| D11 | Introduce no permission API; list restricted actions as authorisation candidates. | `AGENTS.md`: the app has `AuthGuard` but no authorisation mechanism; do not invent a permission API or describe a hidden control as secured. |

**Data destruction, access restrictions and accounting effects were not decided by the reviewer.** These remain with the owner under the standing rule; D2's ceiling question and O2's permission question are surfaced below rather than resolved.

---

## Open decisions

**O1 — Dataset ceiling (F2).** The owner must decide between:

- (a) accepting the 100-row ceiling as the report's contract;
- (b) raising it;
- (c) converting the endpoint to the platform paged contract (`Results<T>` with `TotalCount`/`TotalPages` and `NormalizePaging`) and giving the screen real paging.

The reviewer recommends **(c)** as the business-correct answer but did not implement it because it changes the transport contract (see D2).

**O2 — Blacklist permission.** Whether the blacklist action should require a permission once the authorisation plan resumes — recorded under "Authorization candidates": `POST BlackList` with its endpoint.

### Authorization candidates

| Action | Endpoint | Owner decision |
|---|---|---|
| Add a customer to the blacklist | `POST BlackList` | O2 — pending the authorisation plan. |

---

## Final source reconciliation (Phase 6)

Recorded after the implementation pass. Every row was compared against the final scoped source in
both repositories. Runtime, visual, print, RTL, theme, build and test verification were **not**
performed and remain pending for the owner.

| Concern | Owning block | Final target symbol | Result |
|---|---|---|---|
| Report shell | UI 20 | `report.component.html` — `section[appReportPage].sigma-report-page--fill.sigma-print-flow` › `.sigma-report-panel.sigma-print-flow` | Matched. The bespoke `debt-collection-page`/`-panel` wrappers and their 836-line SCSS are gone. |
| Filter strip | UI 4, 20 | `form.sigma-filter-form.sigma-report-filter-panel` with `sigma-report-filter-field`, `sigma-report-filter-check`, `appReportActions.sigma-report-filter-actions`, `sigma-report-action-group`, `app-primary-action-button[type=submit]`, `btn btn-secondary sigma-report-action--{refresh,reset,export}` | Matched. |
| Table frame and table | UI 20 | `.sigma-report-table-frame.sigma-print-flow` as the single scroll owner; `table.sigma-report-table` with `sigma-report-number` on amount headers/cells and `sigma-report-empty` on the empty cell | Matched. |
| Page height | UI 1 | No `calc(100dvh - …)` remains in the feature; `app-debt-collection-report` host rule deleted | Matched. |
| Palette | UI 24 | No ad-hoc hex, no teal fork, no zebra/hover/gradient rules remain in the feature SCSS; the one emphasis rule uses `var(--bs-danger, #d9214e)` | Matched. |
| Money | UI 20 | `MoneyPipe` on all 11 amount cells and in the export values | Matched. |
| Dates | UI 17 | `p-calendar appDatePicker` + `[dateInputMask]="true"` + `[keepInvalid]="true"` + `[showOnFocus]="false"` + `(click)="…showOverlay()"`; transport through `parseDateValue` and `toApiDateTime`/`formatDisplayDate` | Matched. The private `formatApiDate` and `DatePipe` are removed. |
| Export | UI 8, 20 | `exportToExcel()` builds translated rows on click from `data()`; no cached translated `computed()` | Matched. |
| Filter lifecycle | UI 20, 28 | `form.disable({ emitEvent: false })` before the request, `form.enable()` in `finalize`, `applyingFilters` guard, `hasSearched` separating not-run from empty | Matched. |
| Failure channels | UI 22 | `isSuccess: false` sets the inline message; the `error` callback reads `apiErrorMessage`; the service sends `X-Skip-Error-Interceptor` so the interceptor stays quiet for this inline owner | Matched. |
| Dialogs | UI 13 | `app-editor-dialog` for the blacklist reason dialog and both follow-up dialogs, with `[contentPadded]`/`[focusOnShow]="false"`/`[saving]` and shared footer actions; the record identity is title + subtitle | Matched. |
| Translations | UI 23 | `reports.followupLoadError` and `reports.followupSaveError` added once each to `en.ts` and `ar.ts`; the hard-coded English `aria-label` is replaced by `reports.status` | Matched. |
| Redundant read | Master 5 | `BlackListService.getAllForDebtCollection()` and `BlackListListItem` deleted; the row's own `status` drives `isBlackListed` | Matched. |
| Dead roots | Master 5 | `DebtCollectionSpec.cs` and `DebtCollectionFakeData.cs` deleted after a symbol search returned only their own declarations | Matched. |
| Dataset scope | UI 20 | The screen makes one request at the backend's 100-row ceiling and does not present itself as a complete dataset; the ceiling stays an open owner decision (O1) | **Recorded limitation**, not resolved. |

### Verification performed and still pending

- Performed: source-only comparison of the parent and final feature source; per-repository scoped
  diff review; symbol search for every removed identifier; translation key presence and duplicate
  check in both dictionaries; whitespace/conflict-marker check on the scoped diff.
- Pending for the owner: `ng build`, tests, lint, runtime, print output, RTL, dark theme,
  responsive widths, and every database or API call.
