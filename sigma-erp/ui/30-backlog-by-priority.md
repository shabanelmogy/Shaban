## 30. Backlog, by priority

> **Status: Governance** — evidence and remediation order, not code to copy

Ordered by risk. Correctness and security first; appearance last. Item numbers
are stable identifiers, so they are not renumbered when priority changes.

### P1 — security and data correctness

| # | Problem | Evidence |
|---|---|---|
| 20 | No authorization mechanism | `AuthGuard` is authentication only — no roles, claims, permission service or directive. Every signed-in user reaches every routed feature; the backend endpoint is the sole boundary |
| 17 | Two `HttpClient` instances | `AppModule` imports `HttpClientModule` (no interceptors); `LayoutModule` calls `provideHttpClient(withInterceptors([...]))`. A service missing from `LayoutModule.providers` sends requests with no `Authorization` header. Provide the chain once at the root, then drop the ~300-entry providers array and the dead `bootstrapApplication`/`provideHttpClient` imports in `main.ts` |
| 8 | Server-owned fields in the write model | `models/create.ts` `AddBase` carries `SubscriptionId` (typed `boolean`), `IsDeleted`, `IsActive`, plus `createdBy` |
| 19 | Client sends `subscriptionId` | Document rows and the driver draft (`localStorage.getItem('subscriptionId')`) put the tenant in the payload. Fix with item 8 |
| 5 | Date helper shifts the day | `drivers.component.ts` `formatDate` uses `toISOString()`; at UTC+4 a date-only value lands one day early |
| 9 | Export can produce a partial file | `getAllList` stopped on a failed page and returned what it had. Now throws — confirm the caller surfaces the error |

### P2 — contract and type safety

| # | Problem | Evidence |
|---|---|---|
| 7 | Detail model is all `any` | `models/details.ts` — 12 `any` fields, and both `trn` and `tRN` |
| 6 | Untyped write payloads | `companypartner.service.ts` `create(payload: unknown)`, `update(payload: unknown)` |
| 22 | Untyped shared contracts | `ActionList.action/visible/disabled` and the Excel helper take `any`; `Result.id` is `any`; `Results<T> extends Result<any>`; `EnumToArrayPipe` declares string values although numeric enums return numbers. Add generic typed replacements |
| 12 | `getStaff()` builds `"First undefined Last"` | `companypartner.service.ts` concatenates `middleName` with no null check |

### P3 — behaviour and accessibility

| # | Problem | Evidence |
|---|---|---|
| 14 | `CacheService.clearLocal()` exists | Would wipe the auth token and `subscriptionId` if ever called |
| 28 | Enums cached indefinitely in browser storage | Company stores `gender` and `documentType` under unversioned global keys. Old values survive deployments and can collide with another feature; map the small enums in memory instead |
| 27 | Global loading state is a boolean | `LoadingService.startLoading()` writes `true` and any `endLoading()` writes `false`; overlapping requests can hide the spinner while another request is active. Use a reference counter or scoped loading tokens |
| 29 | Uploaded-file cleanup is fire-and-forget | Fleet starts one delete subscription per path, clears tracking immediately and ignores failures. Coordinate cleanup as in block 18 and add server-side expiry for abandoned temporary files |
| 31 | Manual success notifications can duplicate the global mutation toast | `errorInterceptor` already emits one success toast for successful POST/PUT/PATCH/DELETE responses with a message, while current features still contain manual `MessageService` success helpers after standard mutations (for example Fleet VehicleService/VehicleType list actions). Remove the feature success or explicitly suppress the interceptor only for a documented composite workflow |

### P4 — consistency and appearance

| # | Problem | Evidence |
|---|---|---|
| 1 | Multiple primary-color forks remain | `#3498db` (`--sigma-primary`) is the canonical Sigma primary. Current feature/shared styles still contain the blue forks `#2497d4` and `#1478b5` (for example Supplier details / confirmation and Receipt or Staff statement surfaces) and the teal forks `#20b2aa`, `#1a7f82`, `#146264`, `#17a8aa`. None may be used in new work |
| 15 | Two icon libraries | `Customers/StatementOfAccount` uses Font Awesome (`fas fa-print`, `far fa-file-excel`); everything else uses Bootstrap Icons |
| 10 | English/Arabic translation coverage still drifts | Missing Arabic keys fall back to English. Exact key counts are volatile audit data and must be recomputed when translation coverage is reviewed |
| 11 | Nested dialog pager is hand-built | Agreements dialog draws its own chevrons |
| 32 | `[showIcon]` renders nothing | `src/styles.scss` hides `.p-datepicker-trigger` with `display: none !important` (re-verified 2026-09-28), and `iconDisplay` defaults to `'button'` in PrimeNG 17, so `[showIcon]` without `iconDisplay="input"` is a no-op. At the 2026-09-21 count, 155 of 176 calendars set it. **Owner decision 2026-09-28: Sigma calendars carry no icon** (block 17), so remove `[showIcon]` and any `iconDisplay="input"` when a screen is touched. The `34px` inline-end padding the global input rule reserves for the trigger is dead space; reclaim it in the shared calendar rule once the sweep is done |
| 33 | 16 feature stylesheets override the shared paginator | At the 2026-09-21 count, 16 files set `.p-paginator { padding: … }`: Movements ×5 (`6px 0 4px !important`), Fleet ×4 and Limousine ×4 (`8px 0 0`), Transportation ×3 (`8px 0 2px`, `8px 0 0`). The shared paginator in `data-table.component.scss` is `padding: 10px 0 12px` (re-verified 2026-09-28; an earlier note that it had become `4px` is superseded). Resolution: screens adopt the block 6 Transitional fill block, whose `6px 0 4px` is the one permitted override, and every other variant is removed. Backlog 34 retires the workaround itself |
| 13 | Dead feature roots still routed | `Companies/Company`, `CompanyContactPerson`, `CompanyDriver` wired in `pages/routing.ts` and `LayoutModule`, no menu entry |
| 34 | `app-data-table` has no fill mode | The wrapper forces `max-height: var(--sigma-data-table-scroll-height, 288px) !important`, and `scrollHeight="flex"` makes that variable invalid, so a list grid cannot fill the panel and be the page's scroll owner without the block 6 Transitional `::ng-deep` block. Add a typed `fill` input (or accept `scrollHeight="flex"`) that sets the flex chain, wrapper and paginator spacing inside the component, then replace every feature copy of the workaround |
| 35 | Legacy page-height calcs | 34 feature stylesheets (2026-09-21 count) still size the route with `calc(100dvh - … - var(--bs-app-toolbar-height) - … - <slack>)`, kept working only by the desktop `--bs-app-toolbar-height: 31px` shim in `src/styles.scss`. Replace each with the block 1 container-fill host when the screen is touched; delete the shim when none remain |
| 36 | Editor bodies pad themselves with feature-local values | Before `[contentPadded]` existed, every `app-editor-dialog` consumer padded its own content wrapper or form (for example 20px on the `Fleet/ServiceItem` wrapper, 18px on the `Assets/assetType` form), and a consumer that forgot left fields touching the dialog edge. Resolution: when an editor is touched, set `[contentPadded]="true"` and remove the feature wrapper padding (block 13, *Body padding*) |
| 37 | `general.showingEntries` uses `{total}` | `en.ts` and `ar.ts` define `general.showingEntries` with `{total}`, which PrimeNG does not replace (block 6, *Current page report format*), so `Fleet/ServiceItem`, `Fleet/SourceCode`, and `Fleet/VehicleType` show the literal `{total}`. `Limousine/Location` hides the defect by rewriting the report DOM and replacing `'{total}'` itself. Resolution, in one change: switch both keys to `{totalRecords}` and delete the Location DOM rewrite, because fixing only the key breaks Location's English text. At the 2026-09-28 count, 5 of 59 templates using `app-data-table` also bind no `currentPageReport` (`Accounts/MonthClose` list, `EquipmentQuotation` purchase orders, three agreement or inquiry logs dialogs); check whether each pages before adding one |

### Resolved

| # | Problem | Resolution |
|---|---|---|
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

