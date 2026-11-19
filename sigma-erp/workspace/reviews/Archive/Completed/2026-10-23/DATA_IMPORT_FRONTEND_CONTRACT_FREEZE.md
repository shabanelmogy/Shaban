# Data Import — frontend handoff

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-14 |

Authorization: owner requested review and implementation according to the documentation. Scope: Administration/DataImport and its directly consumed shared CSV, module user guide, translations and provider wiring. Initial frontend and backend working trees are clean. No screenshots supplied.

## Frozen contracts

UI shape is a CSV import workspace with complete local preview/result arrays, not a CRUD list/editor or report. Backend shape is the existing specialized ImportData pipeline (exception to the five CRUD/settings/report patterns). Preserve backend persistence, partial commits, validation, numbering, calculations and authorization. Backend source is inspected only to reconcile transport; no entity/EF/mapping changes.

| Screen | POST route after environment.baseUrl | Body key |
|---|---|---|
| Vehicles | ImportData/Vehicles | vehicles |
| Staff | ImportData/Staff | staffs |
| Suppliers | ImportData/Supplier | suppliers |
| Companies | ImportData/Companies | companies |
| IndividualPartner | ImportData/IndividualPartner | individualPartner |
| Assets | ImportData/Assets | assets |
| Items | ImportData/Items | items |
| RentalAgreements | ImportData/RentalAgreement | rentalAgreements |
| ClosedRentalAgreements | ImportData/Closed RentalAgreement | closedRentalAgreements |
| LeaseAgreements | ImportData/LeaseAgreements | leaseAgreements |
| ClosedLeaseAgreements | ImportData/Closed LeaseAgreements | closedLeaseAgreements |

All eleven return ImportResult: isSuccess, totalRows, savedRows, validationFailedRows, mappingFailedRows, persistenceFailedRows, skippedRows, errorMessages, summary, failedRecords. ImportResult.IsSuccess means at least one saved row; HTTP 200 can have failed rows, HTTP 400 can carry the same result or ModelState errors. Never show complete success solely from HTTP status. Data/result tables have no CRUD actions, identity, tenant, audit or generated No fields. Grid columns and CSV fields are the consumed backend import VM fields in their existing template order, excluding unsupported fields (Asset name/originalPrice and Individual no); lease KMs is serialized/displayed as kMs with legacy kms header alias. Numeric and nullable/date/boolean types match actual C# VMs. Existing imported TaxPercent is preserved as a source field; no new tax formula or rate.

Customers, Salik, Darb and Fines have menu/routes but no matching implemented endpoint in ImportDataController or the directly searched controllers. Their mutation contract remains Missing/Blocked. Preserve routes and existing CSV columns for inspection, display an explicit unavailable advisory and allow local preview only. Do not fabricate a replacement endpoint, redirect customer payloads to a different aggregate, or send the obsolete requests.

## Shared presentation and preparation

Create shared `CsvImportWorkspaceComponent<T>` composing existing FeatureTitle, ImportCsv, PrimaryActionButton, SummaryCards, StateMessage and DataTable owners. Public inputs: title:string, csvColumns:readonly CsvImportColumn[], headerAliases:readonly record (optional), prepare:(row:CsvRecord, reader:CsvRowReader)=>T, submit:(rows:T[])=>Observable<CsvImportResult<T>> (optional). No submit means local-only unavailable workspace. Features own exact column order, explicit typed payload construction and endpoint function; shared owner owns preview/manual Import, local paging, duplicate execution guard, bounded diagnostics, counters, HTTP/declared failure, finalize/destruction and data retention.

Reviewer decision: select file prepares a local preview; a separate explicit Import action starts the existing POST. This reversible UI change makes the existing bulk mutation reviewable, keeps the same payload/backend behavior, and prevents a file-picker action from silently writing data. Do not automatically retry mutations. After any request, require a newly selected file for another POST, since partial saves/network failure may already have persisted rows. Show failedRecords where supplied; never label raw preview rows as saved. Review failed/skipped counts and errors. Retain the preview when no failed records are returned.

`CsvRowReader` public methods: text(field):string, nullableText(field):string|null, number(field):number (empty -> existing nonnullable default 0), nullableNumber(field):number|null, integer(field):number, nullableInteger(field):number|null, boolean(field):boolean, nullableBoolean(field):boolean|null, date(field):string (required), nullableDate(field):string|null, dateTime(field):string (required), nullableDateTime(field):string|null, activity(field):number|null (0/1 or true/false). Invalid nonempty cells record field diagnostics and block POST, never turn invalid input into zero. Shared dates use parseDateValue/toApiDateTime without UTC conversion. Int32 bounds apply to int fields; nullable blanks remain null. Backend owns business validation and lookups.

Import services use root HttpClient and typed result with both X-Skip-Error-Interceptor and X-Skip-Success-Toast because the workspace owns persistent composite import feedback. No manual toasts, no interceptor forks, no manual bearer headers.

## Conformance evidence before edits

| Concern | Owner blocks | Actual reference/shared symbol | Target decision |
|---|---|---|---|
| Container/frame/title | UI1/3, Master5 | Workshop/Job/components/list/list.component.html; sigma-route-host/list-page/list-panel; FeatureTitleComponent | Same bounded flex shell; title inside card |
| Table | UI5/6 | DataTableComponent public fill/lazy/paginator/paginationChange; Job list | fill=true, lazy=false, complete arrays, controlled local paging via resolveListPaging; no invented API paging/filter/CRUD |
| Upload | UI18 | ImportCsvComponent columns/aliases/parse outputs | Reuse parser; type output CsvRecord[]; template columns owned by each screen |
| Actions/states | UI22/24/28 | PrimaryActionButtonComponent, StateMessageComponent, SummaryCardsComponent, takeUntilDestroyed | One busy owner, both failure channels, backend counters; no local palette |
| Dates | UI17 | parseDateValue/toApiDateTime | Preserve wall-clock/date-only values; invalid cells rejected |
| Guide | Master7 | UserGuide content/administration-guide.ts + existing reader | Add bilingual topics for all 15 existing import routes |

Reference CRUD actions Create/View/Edit/Delete/Activate/Export/Print are Not Applicable: this workspace imports batches and renders diagnostics, with no existing row CRUD/output contracts. No new permissions: auth-only application, authorization candidates are the eleven import mutations; missing backend authorization annotations are recorded separately, not altered by frontend scope.

Phases: 0 discovery, 1 API freeze, 2 local table, 3 CSV preparation/import, 5 wiring, 6 reconciliation. Phase4 domain transitions not applicable; closed-agreement imports are existing batch create endpoints, not newly implemented close transitions. No migration required. Build/test/lint/runtime/browser/database/commit/push prohibited and remain owner verification.

## Handoff amendments, 2026-10-14

- Owner reply: `راجع الموجود فقط حاليا واجلهم` explicitly defers the missing Customers/Salik/Darb/Fines mutations. Existing local-preview/advisory routes remain; no missing API implementation is part of the completed scope.
- Master5 extraction gate: the eleven repeated import transports use root `CsvImportService.post<T>(route, request)` at `shared/service/csv-import.service.ts`. It preserves the exact frozen route/body/result and both skip headers through the root HttpClient; screen services remain the owning typed endpoint adapter. This changes internal transport reuse only.
- The action toolbar remains fixed outside the bounded feedback region. Feedback has one region scroll owner; shared table rows have their own independent owner and fixed pager. Summary cards retain their public slim/row bounded capability.

## Presentation amendment — 2026-10-14

Owner: `فى نموذج Importdata الكارت الخاص بتنزيل template - وباقى المكونات محتاج تحسين عايز حاجة اكثر جاذبية`. The presentation-only technical handoff is Frozen before edits. Existing CSV, endpoints, counters and mutation guards are unchanged.

- Shared CSV control renders a template card (spreadsheet icon, CSV badge, ordered-column disclosure and Download Template) and a local-file card (upload icon, CSV guidance, Choose/Change file, parsing state and successfully parsed filename). Both reuse PrimaryActionButton; no whole-card click or claimed drag-and-drop capability.
- The native input stays inside ImportCsvComponent and opens from the keyboard-operable shared Choose/Change button. Existing columns/aliases, header order, Papa parsing, outputs and disabled rules remain. selectedFileName is local presentation state only; clear on selection failure/reset, publish a name only for a valid prepared file. Choosing a file never submits.
- Workspace puts shared cards inside the existing bounded controls region. Import/Reset stay in their own fixed toolbar; preview heading has an icon and translated visible row-count metadata. Result counters retain SummaryCards slim/row and exact backend values. Empty/loading/error/partial/deferred states remain available.
- New EN/AR keys under buttonImportCsv: templateTitle, templateHint, columnsCount(count), viewColumns, fileTitle, fileHint, selectedFile, noFile, changeFile, readingFile. New dataImportWorkspace keys: subtitle, previewCount(count). No fabricated template values or required-column rules.
- Shared CSS owns two equal columns, 580px container stacking, logical spacing, token-based primary wash, focus and safe long-text wrapping. No app/page scrollbar; no table internals or shared button styling overridden. Cards are controls, not KPI totals; result cards still use SummaryCards.
- Reference conformance: UI1/3→Job list shell/FeatureTitle subtitle; UI6→existing shared CSV workspace; UI18→existing ImportCsv/Papa local-file path; UI24→PrimaryActionButton public label/icon/loading/disabled and sigma tokens; UI25/27/29→logical/container sizing, keyboard, all-breakpoint source matrix. Direct CSV consumers read at their actual dialog/scroll wrappers; no changes to Banking/HRM business code.
- Guide: extend existing data-import-topics shared steps/notes in both languages; keep administration-guide reader/menu. Book UI6 and skill CSV digest record the shared presentation values; generator refresh/check required after canonical edits.

Initial scoped source state: import-csv.ts and EN/AR already modified; csv-import-workspace and data-import-topics currently untracked from the preceding implementation. Preserve these complete sources and unrelated edits. No backend changes or migration. This amendment does not alter the earlier frozen business/API handoff.

Final consumer reconciliation: ChequesPayables.clearPreview did not call the shared CSV reset. Add a viewChild bridge to ImportCsvComponent.reset so its existing confirmed Reset also clears the new filename and parser feedback. ChequesReceivables already re-instantiates its CSV control, and Overtime already calls reset. This is presentation-state synchronization only; Banking save/confirmation/payload behavior remains unchanged. Workspace feedback uses existing Bootstrap semantic tokens: success green, partial warning and failure danger; outcome computation is unchanged.
## Sidebar-overlap handoff amendment — 2026-10-14

Owner clarifies that Import Data content sits below the sidebar and the sidebar does not stay closed, requesting a professional solution. Navigation-policy handoff is frozen in SHARED_SIDEBAR_TOGGLE_MAINTENANCE_EVOLUTION_PLAN.md. The actual root cause supported by source is desktop hover reopening over the minimized wrapper offset. Apply persistent explicit toggle in the existing sidebar owner globally; no import-only margins/widths/resize workaround. Preserve all import CSV/API/preview/partial-save contracts and mobile drawer behavior. The native desktop control replaces its own Metronic registration only, uses existing body state and translated accessible labels, and is hidden below992px via shared utilities. No business/schema/migration change.
