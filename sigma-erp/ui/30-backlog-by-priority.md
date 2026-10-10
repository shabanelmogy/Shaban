## 30. Backlog, by priority

> **Status: Governance** — evidence and remediation order, not code to copy

Ordered by risk. Correctness and security first; appearance last. Item numbers
are stable identifiers, so they are not renumbered when priority changes. Re-ranked
2026-10-01 (completion plan R8): resolved items moved to *Resolved*.

### P1 — security and data correctness

| # | Problem | Evidence |
|---|---|---|
| 20 | No authorization mechanism | `AuthGuard` is authentication only — no roles, claims, permission service or directive. Every signed-in user reaches every routed feature; the backend endpoint is the sole boundary. **Deferred by the owner 2026-10-01**: `reviews/Deferred/AUTHORIZATION_MAINTENANCE_EVOLUTION_PLAN.md`; screen reviews record *Authorization candidates* (block 26) |
| 8 | Server-owned fields in the write model | `models/create.ts` `AddBase` carries `SubscriptionId` (typed `boolean`), `IsDeleted`, `IsActive`, plus `createdBy` . The backend ignores them since 2026-09-30 (`UpdateBaseVm` carries `Id` only, BE block 3), so removing them from payloads is safe. **Owner decision 2026-10-01:** removed screen by screen during its review, with a build, per block 2 *Write payloads carry client inputs only*; no bulk edit and no interceptor strip. Size at decision: ≈860 `subscriptionId` references in ≈465 files, ≈130 `no:` payload entries |
| 19 | Client sends `subscriptionId` | Document rows and the driver draft (`localStorage.getItem('subscriptionId')`) put the tenant in the payload. Ignored by the API; removed per screen with item 8 (block 2) |
| 5 | Dates sent through `toISOString()` | 73 TypeScript files call `toISOString()` (2026-10-01 count), for example `drivers.component.ts` `formatDate`: at UTC+4 a date-only value lands one day early and a date-time moves by four hours. Each moves to `toApiDate`/`toApiDateTime` (block 17) in its screen review |
| 9 | Export can produce a partial file | `getAllList` stopped on a failed page and returned what it had. Now throws — confirm the caller surfaces the error |

### P2 — contract and type safety

| # | Problem | Evidence |
|---|---|---|
| 7 | Detail model is all `any` | `models/details.ts` — 12 `any` fields, and both `trn` and `tRN` |
| 6 | Untyped write payloads | `companypartner.service.ts` `create(payload: unknown)`, `update(payload: unknown)` |
| 22 | Untyped shared contracts | `ActionList<TRow>` (2026-09-30) and `Result`/`Results` (2026-10-01, D5-4: `id: number | string | null`, no `entity` on a list) are typed. Remaining: the Excel helper takes `any`; `EnumToArrayPipe` (legacy, replaced by `enumOptions`) |
| 12 | `getStaff()` builds `"First undefined Last"` | `companypartner.service.ts` concatenates `middleName` with no null check |

### P3 — behaviour and accessibility

| # | Problem | Evidence |
|---|---|---|
| 14 | `CacheService.clearLocal()` exists | Would wipe the auth token and `subscriptionId` if ever called |
| 28 | Enums cached indefinitely in browser storage | Company stores `gender` and `documentType` under unversioned global keys. Old values survive deployments and can collide with another feature; map the small enums in memory instead |
| 29 | Uploaded-file cleanup missing | 24 screens upload files; only 3 track uploaded-but-unsaved paths, and Fleet fires unobserved deletes. `DocumentUploadTracker` (block 18, 2026-10-01) is the fix, adopted per screen review. The legacy `FileUploadService.uploadFile` also returns validation/failure messages as if they were the uploaded path; screens that store its value unchecked can save a message as a document path |
| 31 | Manual success notifications can duplicate the global mutation toast | `errorInterceptor` already emits one success toast for successful POST/PUT/PATCH/DELETE responses with a message, while current features still contain manual `MessageService` success helpers after standard mutations (for example Fleet VehicleService/VehicleType list actions). Remove the feature success or explicitly suppress the interceptor only for a documented composite workflow |

### P4 — consistency and appearance

| # | Problem | Evidence |
|---|---|---|
| 1 | Multiple primary-color forks remain | `#3498db` (`--sigma-primary`) is the canonical Sigma primary. Current feature/shared styles still contain the blue forks `#2497d4` and `#1478b5` (for example Supplier details / confirmation and Receipt or Staff statement surfaces) and the teal forks `#20b2aa`, `#1a7f82`, `#146264`, `#17a8aa`. None may be used in new work |
| 15 | Two icon libraries | Customer Statement migrated to Bootstrap Icons in its 2026-10-02 refactor (source-only). Other existing consumers such as header/navbar still contain Font Awesome; move them during their own review, no bulk replacement |
| 10 | English/Arabic translation coverage still drifts | Missing Arabic keys fall back to English. Exact key counts are volatile audit data and must be recomputed when translation coverage is reviewed |
| 11 | Nested dialog pager is hand-built | Agreements dialog draws its own chevrons |
| 32 | `[showIcon]` renders nothing | `src/styles.scss` hides `.p-datepicker-trigger` with `display: none !important` (re-verified 2026-09-28), and `iconDisplay` defaults to `'button'` in PrimeNG 17, so `[showIcon]` without `iconDisplay="input"` is a no-op. At the 2026-09-21 count, 155 of 176 calendars set it. **Owner decision 2026-09-28: Sigma calendars carry no icon** (block 17), so remove `[showIcon]` and any `iconDisplay="input"` when a screen is touched. The `34px` inline-end padding the global input rule reserves for the trigger is dead space; reclaim it in the shared calendar rule once the sweep is done |
| 33 | 16 feature stylesheets override the shared paginator | At the 2026-09-21 count, 16 files set `.p-paginator { padding: … }`: Movements ×5 (`6px 0 4px !important`), Fleet ×4 and Limousine ×4 (`8px 0 0`), Transportation ×3 (`8px 0 2px`, `8px 0 0`). The shared paginator in `data-table.component.scss` is `padding: 10px 0 12px` (re-verified 2026-09-28; an earlier note that it had become `4px` is superseded). Resolution: screens adopt the block 6 Transitional fill block, whose `6px 0 4px` is the one permitted override, and every other variant is removed. Backlog 34 retires the workaround itself . Mostly resolved by the 2026-09-30 `[fill]` migration (block 6 exception list) |
| 35 | Legacy page-height calcs | 34 feature stylesheets (2026-09-21 historical count) sized the route with viewport subtraction. Customer Statement now adopts the shared opt-in bounded report shell (2026-10-02, source-only). Other consumers, including the inspected TrialBalance reference, move to container-fill during their own review; delete the compatibility shim when none remain |
| 40 | Editors outside the shared editor shell and `EditableRows` | 77 `FormArray` editors, 66 hand-written `removeAt`, 25 private row factories (2026-10-01). Move each to block 1 *Shared editor page shell*, block 13 decision rule and block 14 `EditableRows` in its review; Job is the reference |
| 41 | Company editor predates the shared editor shell | `Customers/Companies/CompanyPartner/components/details` and its `detalisForm/*` steps use Bootstrap `form-group`/`col-*` fields, feature error markup and their own SCSS. The step-form reference is now Individual (2026-10-01); move Company to the same shell in its review. 2026-10-01: moved to the shell by the parallel implementation; its follow-ups are item 42 |
| 42 | Companies parallel-implementation follow-ups | `reviews/COMPANIES_PARALLEL_IMPLEMENTATION_FEATURE_REVIEW.md`. **Source-resolved in the comprehensive customer fixes (2026-10-01):** forward step validation, explicit badge keys/real IDs, inline errors, consistent collection binding, neutral `partnerForm` keys, Individual shared rows/explicit document enum and decided required set; dead roots and their obsolete config entries retired. Inactive-only semantics and card exports were corrected earlier. Historical G17/G19 concerns about remaining pre-emptive roots/editor machinery are not blanket-closed by this scoped task. Owner build, visual and runtime acceptance remain pending. |
| 39 | Feature copies of shared pieces | Since 2026-10-01 also: calendars without `appDatePicker` (block 17), the item/selectedItem template pair instead of `translateOptions` (≈66 files, block 16), hand-written discard/delete confirmation options instead of the presets (≈60 files, blocks 9, 10), file inputs instead of `app-file-field` (≈27 files, block 18), hand-written list URL state (block 10). 2026-10-01 counts: ≈108 feature palettes (block 24), 38 all-pages export loops (block 8), 25 field-error helpers (block 19), 67 `EnumToArrayPipe` users (block 16), 7 hand-written state blocks (block 22), 3 private date parsers (block 17), feature filter strips on every list except Job (block 4). 2026-10-06: CashDeposit list retains one private composed-read error branch; adopt composedReadErrorMessage (UI22) during its own review. Depreciation extracts monthValueValidator (UI17); two inspected local validator copies remain in Accounts/shared/report-family and StaffTimesheet details for their own review. Each goes in its screen review; no bulk edit |
| 36 | Editor bodies pad themselves with feature-local values | Before `[contentPadded]` existed, every `app-editor-dialog` consumer padded its own content wrapper or form (for example 20px on the `Fleet/ServiceItem` wrapper, 18px on the `Assets/assetType` form), and a consumer that forgot left fields touching the dialog edge. Resolution: when an editor is touched, set `[contentPadded]="true"` and remove the feature wrapper padding (block 13, *Body padding*) |
| 37 | `general.showingEntries` uses `{total}` | `en.ts` and `ar.ts` define `general.showingEntries` with `{total}`, which PrimeNG does not replace (block 6, *Current page report format*), so `Fleet/ServiceItem`, `Fleet/SourceCode`, and `Fleet/VehicleType` show the literal `{total}`. `Limousine/Location` hides the defect by rewriting the report DOM and replacing `'{total}'` itself. Resolution, in one change: switch both keys to `{totalRecords}` and delete the Location DOM rewrite, because fixing only the key breaks Location's English text. At the 2026-09-28 count, 5 of 59 templates using `app-data-table` also bind no `currentPageReport` (`Accounts/MonthClose` list, `EquipmentQuotation` purchase orders, three agreement or inquiry logs dialogs); check whether each pages before adding one |

### Resolved

| # | Problem | Resolution |
|---|---|---|
| 43 | Dead Individual scaffolds | Source-resolved 2026-10-02: unused PersonBase/Partner/PartnerAddress UI roots retired (39 tracked files). Route/service/DTO/selector consumer searches and current compilation configuration found no external consumers or wiring. Shared translations and backend APIs retained. IndividualPartner remains the live owner. Owner build/runtime acceptance pending; evidence in `reviews/INDIVIDUAL_FRONTEND_FEATURE_REVIEW.md`. |
| 13 | Dead company roots | Source-resolved 2026-10-01: Company alias and standalone CompanyDriver/CompanyContactPerson UI, routes, providers and obsolete explicit compilation roots retired. Reusable driver fields/form moved to CompanyPartner; Driver API service/models used by agreements remain. Owner build/runtime pending. |
| 17 | Two `HttpClient` instances | Resolved 2026-09-30: `AppModule` provides the one interceptor-equipped client; interceptors act only on `environment.baseUrl` requests (block 1). Remaining: remove the legacy `LayoutModule.providers` list and the dead `main.ts` imports gradually |
| 27 | Global loading state is a boolean | Resolved 2026-09-30: `LoadingService` is a reference counter floored at zero and reset on navigation (block 22) |
| 34 | `app-data-table` has no fill mode | Resolved 2026-09-30: `@Input() fill` (`sigma-data-table--fill`) sets the flex chain, wrapper and paginator spacing inside the component (block 6). Feature copies migrated 2026-09-30 (12 screens + 2 duplicate fixed-height blocks); remaining: Fleet Accidents/Alerts/Service Bookings/Service Log need the block 1 page shell first (block 6 *Customizing the grid*) |
| 38 | Workspace tabs stayed light in dark mode | Fixed 2026-09-28. `editor-tabs.component.scss` is encapsulated but prefixed its dark rules with `[data-bs-theme='dark']`, which never matched, and its token fallbacks were light, so Opening Balances and Labour Tariff (no page tokens) showed a white strip. The dark rules now use `:host-context` with dark token fallbacks (block 13) |
| 4 | Company list silent transport failures | Fixed before the 2026-09-20 guide review. Scoped source inspection found no remaining `error: () => undefined` handlers under `Customers/Companies/CompanyPartner`; block 22 keeps the prohibition as the canonical rule |
| 24 | Bare `window.print()` | Fixed 2026-08-09. `ReportPrintService` now owns the Metronic body class, print invocation and `afterprint` cleanup; report, list and detail print actions use it instead of calling the browser directly |
| 16 | Reports had no shared shell | Fixed 2026-08-09. `appReportPage` and `appReportActions` now own reusable report-page and action-toolbar presentation; `shared/components/reports` applies them for its consumers, while standalone report routes import them directly |
| 3 | Cross-feature SCSS import | Fixed 2026-08-09. Company owns locally prefixed `companies-*` page/filter styles and consumes the shared data table, primary action, and editor dialog without importing Individual SCSS |
| 21 | Export headers not translated | Fixed 2026-08-09. Company resolves translated export headers and status values at click time for the active language |
| 18 | Child dialogs discarded silently | Fixed 2026-08-09. Company driver now uses controlled `app-editor-dialog`; X, Cancel and scoped Escape all run one dirty-discard decision before the draft is reset |
| 2 | `company-dialog-primary` defined twice, different colours | Fixed 2026-08-09. Company driver no longer owns dialog action styles; it consumes the shared editor-dialog footer and primary tokens |
| 30 | Company child collections rebuilt table chrome | Fixed 2026-08-09. Contact persons, credit cards, documents and drivers now consume `app-editable-collection-table`; custom driver Edit/Delete actions use the shared action projection |
| 31a | Step-form validation summary was feature-owned | Fixed 2026-08-09. Shared `app-form-validation-summary` now owns accessible alert/count/action presentation while Company retains invalid-field discovery, step changes and focus |
| 23 | Stepper announced tabs it did not implement | Fixed 2026-08-08. Shared `app-step-form` now owns ordinary step navigation with `nav`/`ol`, ordinary buttons, visible labels and `aria-current="step"`; Company no longer carries feature-local tab-role stepper markup or styles |
| 9a | `mangeDetails.cVV` missing from `ar.ts` | Fixed 2026-08-06. Was a casing mismatch: `en` used `cVV`, `ar` had only `cvv`. First fix landed in the wrong block (`statementOfAccount`) and read correctly in the diff — see block 29 |
| 25 | Company editor had no discard prompt | Fixed 2026-08-06. `cancel()` now applies block 10 |
| 26 | Driver rows deleted with no confirmation | Fixed 2026-08-06. `deleteDriver()` now applies block 11 |
