# Driver Time Sheet Report

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Request | 2026-10-10: «ضيف تحت src\app\modules\HRM\Reports», screenshot 2.PNG |

## Manifest and frozen handoff

New read-only HRM report at `/HRM/Reports/DriverTimeSheet`; keep the existing payroll report at `/HRM/Reports` and the Rental Driver Time Sheet editor unchanged. UI type 07 Report (UI20/21/6), backend Pattern 5 (BE17). Approved references: shared ReportPage/ReportActions/DataTable, Customer Statement lifecycle, TrialBalance shared report strip. PayrollsReport is a sibling implementation example only. AuthGuard owns layout authentication; explicit authorized report GET endpoints and QueryReport own server/tenant boundaries. No invented permission system.

Existing working tree has substantial unrelated user work. HRM/Reports and hrm-reports-topics.ts are already untracked existing work; menu, vocabularies and tsconfig.app.json already modified. Backend GeneralMessage resources already modified. Preserve all of these; extend exact source locations only. No entity, EF, existing CRUD/editor, shared visual owner or calculation writer is in scope.

Packets: initial Generate-SigmaRecipes.ps1 -Check passed all eight packets. Apply PHASE-00, 01, 02, 05, 06. Skip 03/04 (no editing or domain actions). PLAN-00 not required: bounded additive report; no existing write behavior changes. No generated documentation edits required.

## Screenshot evidence

E1 = C:/Users/user/Desktop/Reports/2.PNG, Driver Time Sheet Report, report state, English/LTR, desktop 1715×863. Role/capture date/product version unknown; screenshot dates do not establish metadata. User request approves the visible report content. Screenshot supplies functional evidence only.

| Evidence | Classification | Implementation | Phase |
|---|---|---|---|
| Driver Time Sheet Report title | Explicit | FeatureTitle in shared report panel | 2 |
| Date Range, Agreement No, Driver Type, Driver | Explicit | Typed range and three optional selectors | 1/2 |
| Date, Agreement No, Customer, Driver, Holiday, Working Hours, Driver OT Hours | Explicit | Seven typed DataTable columns in this order | 1/2 |
| Export Summary to Excel, Export to Excel, Refresh | Explicit | Full filtered summary, full detail, form submit refresh | 2 |
| Exact options, summary grouping and data completeness | Uncertain from screenshot | Reviewer decisions below, frozen from source | 1 |
| Demo customer/name/numbers/zeros and holiday dates | Explicit example values only | No sample rows; use persisted facts | 1 |

## Reviewer decisions (owner standing rule, Master2 rule6)

1. Report reads persisted DriverTimeSheet rows with a live non-voided RentalAgreement. Date means WorkDay (inclusive endpoints, strict yyyy-MM-dd); all dates through 9999-12-31 are supported using an inclusive final-day predicate without AddDays overflow. Closed/invoiced agreements remain available for historical reporting; editing-only Common setting is not a report restriction. Exclude deleted parents/children through QueryReport. Missing live customer/driver label stays null. No synthetic unsaved daily zero rows: editor generates these, but unsaved hours are not stored facts.
2. Driver Type is an explicit source-supported report classification: Independent=0 when Driver.CompanyId is null; Company=1 when nonnull. Driver.cs has no staff/self/other driver-type field. Reject Agreement.CustomerType (actually Individual/Company customer enum), Booking labels (not persisted driver employment classification), new schema field without a writer, and invented Staff membership. Expose explanatory bilingual hint and guide text. This proxy describes current company association, not employment or a historical snapshot. Type filtering excludes missing/deleted driver relations; without type filtering retain their saved rows with a blank name.
3. Summary grouping: AgreementId + DriverId, retaining agreement/customer/driver labels. Backend SQL aggregates saved rows for the exact same filters: recordedDays=count(rows), holidayDays=count(IsHoliday), workingHours=sum(WorkingHours), driverOvertimeHours=sum(DriverOvertimeHours). These are row counts, not inferred attendance/working-day counts. Persisted Holiday and OT remain authoritative; no recalculation against mutable calendars/settings.
4. Complete unpaged response containing dateFrom/dateTo/rows/summaryRows; no Skip/Take or page caps. Deterministic detail order WorkDay/AgreementId/Id, summary order AgreementId/DriverId. Local presentation paging uses shared default15; Excel and print always consume full arrays. No row actions, write DTOs, entities, mappings or transaction needed.
5. Report-specific typed options endpoint returns all current non-voided agreements and current drivers directly from their scoped entities (not document navigation graphs), with DropdownDto id/value/no contracts. It includes closed/invoiced agreements. A failed option request blocks Refresh and exposes Retry; an empty successful options set permits an unfiltered report.

## Contracts

| Filter | Control | Query key | API type/default |
|---|---|---|---|
| Date Range | Date[] / string / null | Filters[dateFrom], Filters[dateTo] | Required real ordered yyyy-MM-dd; current month |
| Agreement No | number / null | Filters[agreementId] | Positive int, absent=all |
| Driver Type | 0 / 1 / null | Filters[driverType] | 0 Independent,1 Company; absent=all; zero preserved |
| Driver | number / null | Filters[driverId] | Positive int, absent=all |

| Visible grid (ordered) | Row DTO | Source/format | Sort | Export |
|---|---|---|---|---|
| Date | workDay / WorkDay | DriverTimeSheet.WorkDay; date | no | yes |
| Agreement No | agreementNo / AgreementNo | RentalAgreement.No; text or dash | no | yes |
| Customer | customerName / CustomerName | scoped Partner.Name; text or dash | no | yes |
| Driver | driverName / DriverName | scoped Driver full name, Name fallback; text/dash | no | yes |
| Holiday | isHoliday / IsHoliday | saved flag; translated Yes/No | no | yes |
| Working Hours | workingHours / WorkingHours | saved decimal; numeric | no | yes |
| Driver OT Hours | driverOvertimeHours / DriverOvertimeHours | saved decimal; numeric | no | yes |

Report row has exactly those seven values plus Id for grid identity. No CRUD ListVM. Summary DTO has agreementNo/customerName/driverName/recordedDays/holidayDays/workingHours/driverOvertimeHours. Keys used to group are query-local, not extra transported fields. Summary exports these seven fields; no frontend sums.

GET /DriverTimeSheetReport: Result<DriverTimeSheetReportDto>. GET /DriverTimeSheetReport/options: Result<DriverTimeSheetReportOptionsDto> containing agreements/drivers. Both [Authorize], cancellation-aware, QueryReport for every relation. Invalid dates/IDs/type return typed localized failure (400). Frontend root HttpClient/environment.baseUrl/toFilterParams, skip-error header and one inline feedback owner.

Refresh validates, freezes applied labels and filters, disables form with emitEvent=false, clears old output, fetches once and restores in finalize. Filter changes and Reset invalidate rows/summary/applied context and local page; failed report offers another Refresh. Printing uses shared ReportPrintSession, disables form/actions, renders every row and restores local paging. All subscriptions use takeUntilDestroyed. Report is read-only: no discard or confirmation. Reference actions Search, Reset, Print, Excel supported; specialized Summary Excel added from E1. CRUD/detail and financial actions not applicable.

## Reference conformance before implementation

| Concern | Book | Actual reference/shared owner | Target contract |
|---|---|---|---|
| Container fill/edges | UI1/3/20 | ReportPage + global sigma-report-panel, FeatureTitle | sigma-route-host sigma-print-flow, same shell; no feature SCSS |
| Filters/actions | UI16/17/19/20/24 | TrialBalance filter strip, global report strip + ReportActions + DatePicker/FieldError | Four typed fields, stable grid, actions on full-width row, body overlays |
| Report lifecycle | UI20/22/28 | CustomerStatement.search / ReportPrintService.createSession | validated request, applied snapshot, filter invalidation, form freeze, both failure channels |
| Rows/output | UI6/8/21 | DataTableColumn/format/dataTableExportRows + shared DataTable | lazy=false, complete row arrays, shared local paging and full print/export |
| Backend | BE17 | QueryReport repository, own typed service/controller report pattern | scoped joins, SQL GroupBy before materialization, no N+1/CRUD/maps |
| Provider | UI1/2, BE5/6 | DependencyResolver assembly scanning / root HttpClient | implemented service interface auto-registered scoped, no client forks |

No new shared extraction qualifies: existing visual, date, error, export and print owners cover every reusable concern; query/grouping and fields are specific to this report. Authorization candidates: authenticated tenant report reads only, no state-changing restrictions. Schema impact: none; Add-Migration not required.

## Reconciliation

The Frozen handoff above was recorded before implementation/delegation; its decisions remain unchanged. Source implementation is reconciled below. Build/runtime/visual acceptance remains owner-pending; this is not runtime closure.

| Contract/path | Final producer/consumer evidence | Result |
|---|---|---|
| Screenshot title/filters/columns/actions | DriverTimeSheetReportComponent.filterForm/columns and its template: exactly four filters and seven ordered fields; two exports and Refresh; Reset/Print from report reference retained | Matched |
| Grid ↔ report DTO | WorkDay/AgreementNo/CustomerName/DriverName/IsHoliday/WorkingHours/DriverOvertimeHours plus Id map to identically named camelCase model fields; no CRUD ListVM | Matched |
| Filters ↔ HTTP ↔ query | toFilterParams retains driverType=0, omits null; DriverTimeSheetReportFilterVM case-insensitive setter and GetReportAsync validate exact keys/type/date order | Matched |
| Date source/boundary | WorkDay >= dateFrom and <= dateTo.AddTicks(TicksPerDay-1), no AddDays overflow; shared parseDateRange in client | Matched; SQL parameter acceptance pending |
| Dataset/output scope | GetReportAsync has ToListAsync over fully filtered query, no Skip/Take; local lazy=false table, default15 paging via pageSize→rows adapter; exports read full rows/summaryRows; print paginator/scrollable=false | Matched |
| Summary calculation | SQL GroupBy AgreementId/DriverId + Count/Sum; frontend summaryColumns formats seven returned fields with no frontend aggregate | Matched; EF SQL translation pending |
| Parent/tenant scope | QueryReport on saved rows, RentalAgreement, Partner and Driver; inner live nonvoided agreement, left scoped labels; no editable-only closed-agreement setting | Matched |
| Failure/recovery | GET requests send skip-error header; both isSuccess:false/missing entity and transport errors populate visible inline state; option Retry; valid Refresh retries report; local flags/global loading finalized | Matched |
| Applied filter lifetime | valueChanges clears output/context/page; search freezes scalar values/labels, disables FormGroup, busy guards prevent overlapping refresh/reset/page/print; takeUntilDestroyed on all subscriptions | Matched |
| Layout/reference values | sigma-route-host/sigma-print-flow and ReportPage/ReportActions/global report panel used; inline stable four-track weighted template and full-row actions use existing UI20 public owners; no feature SCSS/cards/height calc | Matched from source; narrow/RTL/theme/visual pending |
| Registered controls | Exact standalone imports include DataTable, FeatureTitle, FieldError, PrimaryActionButton, ReportPage/Actions, StateMessage, DatePicker, TranslateOptionsPipe; installed PrimeNG Dropdown exposes ariaLabelledBy and Calendar exposes date dataType | Matched; Angular compilation pending |
| Routes/menu | reports.routes.ts: existing empty Payroll route pathMatch=full, new DriverTimeSheet child; existing pages/routing lazy owner unchanged; both HRM and general report links now resolve new child, translated with driverTimeSheetReport.title | Matched |
| Providers/authentication | Frontend root HttpClient + environment.baseUrl; no new providers; backend own interface picked up by DependencyResolver.FromAssemblyOf<AccountService>/AsImplementedInterfaces/Scoped; explicit [Authorize] on controller | Matched; runtime pending |
| Translations | New feature block has30 EN/AR keys, exact parity0 missing/case differences; two resource keys in each language; Holiday status exports use current translator | Matched |
| User guide | HRM_REPORT_TOPICS first topic, titleKey driverTimeSheetReport.title, operational route /HRM/Reports/DriverTimeSheet; HRM_GUIDE already spreads these topics; reader already registers HRM_GUIDE; sidebar guide link /UserGuide/hrm exists | Matched from source; reader navigation/print acceptance pending |
| Schema/maps/writes | No entity/EF/snapshot/migration/AutoMapper changes, zero SaveChanges paths, no write DTOs or overrides; all report fields are projections/persisted facts | Matched; Add-Migration not required |

### Files changed by this task

Frontend repository `F:/My Work/Sigma/SiGmaAngularFrontEnd`:

- New `src/app/modules/HRM/Reports/components/driver-time-sheet-report.component.ts` and `.html`.
- New `src/app/modules/HRM/Reports/models/driver-time-sheet-report.ts` and `services/driver-time-sheet-report.service.ts`.
- Extend existing untracked `src/app/modules/HRM/Reports/reports.routes.ts` with one child route and full-match existing default. Payroll report files preserved.
- Add one bilingual topic to existing untracked `src/app/modules/UserGuide/content/hrm-reports-topics.ts`; retain all payroll topics/questions and existing HRM reader/menu registration.
- Add only driverTimeSheetReport block to `src/app/modules/i18n/vocabs/en.ts` / `ar.ts`; preserve earlier pending blocks.
- Change only the two Driver Time Sheet Report destinations/titles in `src/app/_metronic/layout/components/sidebar/sidebar-menu/sidebar-menu-data.ts`; retain earlier pending menu changes.
- No tsconfig change: the component is imported directly by the existing lazily imported report routes. Existing explicit compilation roots preserved; if owner compilation reports a missing runtime root, add its exact .component.ts path per UI1.

Backend repository `F:/My Work/Sigma/SigmaBackend`:

- New `SiGma.Business/IServices/IDriverTimeSheetReportService.cs` and `Services/DriverTimeSheetReportService.cs`.
- New `SiGma.ServerAPI/Controller/DriverTimeSheetReportController.cs`.
- New `SiGma.ViewModels/ViewModels/DriverTimeSheetReport/DriverTimeSheetReportFilterVM.cs`.
- New four DTO files in `SiGma.Helpers/Dtos/DriverTimeSheetReport/`: ReportDto, RowDto, SummaryRowDto and OptionsDto with prefix `DriverTimeSheetReport`.
- Append only `DriverTimeSheetReportDateRangeInvalid` and `DriverTimeSheetReportFilterInvalid` to both `SiGma.Helpers/Localization/Shared/GeneralMessage.resx` / `GeneralMessage.ar-SA.resx`, preserving prior pending keys.

### Verification and remaining limits

- Identified both actual repository roots with git rev-parse. Reviewed all authored new source, shared-file edit hunks and the route/guide extensions separately by repository. Existing pending unrelated menu/vocabulary/resource hunks are not attributed to this task. New untracked source checked using git diff --no-index --check; scoped tracked git diff --check passed. No merge markers in authored report files.
- Read-only source parser: eight touched TypeScript files and one Angular template parsed with zero errors; relative report imports exist. This checks syntax/path existence only and is not a build, type check, Angular input validation or runtime proof. Shared declarations and installed PrimeNG public inputs were separately inspected.
- Check-Translations.ps1 -Block driverTimeSheetReport:30/30,0 missing,0 case differences. Backend RESX XML parse and exactly two scoped new keys per language verified by worker.
- Recipe -Check passed all eight packets initially and at handoff. No packet/template/book modification, no refresh needed.
- Derived Driver Type is resolved by the frozen source-supported company-association decision. Screenshot option identities and summary grouping were not proven by E1 and are explicitly resolved above, not undocumented assumptions. No unresolved Missing/Conflicting/Uncertain requirement blocks the frozen implementation.
- The response is intentionally unpaged and can be large. Labels/company associations are current, while hours and holiday flags are persisted facts. Unsaved generated editor days are excluded. These are frozen semantics; owner acceptance must include realistic volume and data cases.

### Owner verification

1. Compile frontend/backend and check the new report route and DI activation; if Angular reports a missing compilation root, use the exact runtime file rule above. Verify SQL translation for grouped label MAX/name Trim, including left joins and final-day datetime2 parameter.
2. Save known driver hours, then compare detail and summary Excel for the inclusive range and each optional filter, including driverType=0, combined filters, zero hours, holiday flags, closed/invoiced and voided/deleted agreement cases and missing labels. Verify summary row counts and sums by agreement+driver.
3. Check malformed dates, reversed endpoints, invalid type/IDs, empty successful options, option failures/Retry, report failures/Refresh, form freezing, Reset and output invalidation after editing filters; confirm tenant isolation/authenticated access.
4. Verify Arabic/English headings/status/export, body-appended calendar/dropdowns, desktop/narrow RTL and both themes; ensure only grid rows scroll. Print beyond one screen/page, close/cancel print and confirm original local page/size remains.
5. Open `/UserGuide/hrm` and the new bilingual report topic; verify navigation and stated prerequisites/actions/limitations against the screen.

### Execution and suggested commits

Root owned discovery/freeze, frontend, routing/menu, bilingual guide and final integration/source review. One inherited-model `report_backend` worker owned the eight new backend files and two resource append locations only. The configured terra model was unavailable, so no override was used. The non-overlapping frozen backend/read and frontend work reduced elapsed implementation time without concurrent shared-file ownership. Worker contract matched root consumer; root reviewed the integrated files. No extra audit agents were needed.

Phases00/01/02/05/06 applied;03/04 skipped because this is read-only output with no editors, save or state actions. AutoMapper/domain-write calculations/migration are Not Applicable. Shared extraction gate: existing owners reused, no new generic owner required.

Suggested commits, limited to the task files/hunks above (suggested only):

- SiGmaAngularFrontEnd: `feat(hrm): add driver time sheet report screen`
- SigmaBackend: `feat(hrm): add driver time sheet report API`

No builds, tests, lint, migrations, database commands, browser automation/application verification, commits, pushes or deployment commands were run. Runtime/visual/SQL/build verification remains pending for the owner.

## Compiler-feedback follow-up — 2026-10-10

Owner reported four active CS0246 diagnostics: IDriverTimeSheetReportService in DriverTimeSheetReportController and IPayrollsReportService in PayrollsReportController, each at field/constructor injection.

Scope: the two report controllers/interfaces, Business/ServerAPI project references and existing Business reference-assembly metadata. Backend Pattern5 remains unchanged. BE6/17 and PHASE05 apply; initial recipe -Check again passed all eight packets. No UI, API shape, guide, schema or calculation change is required. No subagent: small sequential diagnosis.

| Check | Verified evidence | Outcome |
|---|---|---|
| Interface declarations | Both files exist under SiGma.Business/IServices and declare the reported public interface names in namespace SiGma.Business.IServices | Source declarations correct |
| Namespace resolution | SiGma.ServerAPI/GlobalUsing.cs already has global using SiGma.Business.IServices | A missing namespace import is not established by this source |
| Compile/project inclusion | Business.csproj is SDK default compilation with no Compile Remove or disabled default items; ServerAPI.csproj has a ProjectReference to ../SiGma.Business/SiGma.Business.csproj | No source/project-inclusion patch justified |
| Actual compiled reference contents | Read-only PE metadata of obj/Debug/net10.0/ref/SiGma.Business.dll and refint/SiGma.Business.dll contains neither new report interface | Existing reference assemblies predate the interface additions |

Resolution requires owner-run rebuild of SiGma.Business, then SiGma.ServerAPI so the dependent project receives a reference assembly containing the interfaces. If Business compilation fails, its first compiler error must be fixed before ServerAPI can consume the new types. The four reported errors are not claimed resolved until owner compilation confirms this. Do not patch imports or copy interfaces into ServerAPI to disguise the stale reference.

No application source was changed during this follow-up. No build/test/lint/database/browser/migration/commit/push/deployment command was run; compiled assemblies were read as metadata only, not executed or modified. The existing bilingual report guide remains accurate; no user workflow changed. No commit or migration is needed for this diagnosis-only follow-up.

## HTTP400 filter-binding follow-up — 2026-10-10

Owner supplied the request `/DriverTimeSheetReport?Filters[dateFrom]=2024-10-01&Filters[dateTo]=2026-10-31`, HTTP400 and automatic ValidationProblemDetails with title `One or more validation errors occurred.` and an empty `errors` object. The query contains valid ordered ISO dates. This response shape identifies the MVC model-validation boundary, rather than a report's explicit Result failure. No local app terminal/log files were available; no live API/DB/browser request was executed by the agent.

Source-supported cause: DriverTimeSheetReportFilterVM.Filters cloned the incoming dictionary in its setter. ASP.NET Core10 [DictionaryModelBinder](https://github.com/dotnet/aspnetcore/blob/v10.0.0/src/Mvc/Mvc.Core/src/ModelBinding/Binders/DictionaryModelBinder.cs) registers ShortFormDictionaryValidationStrategy against the actual dictionary model, [ComplexObjectModelBinder.SetProperty](https://github.com/dotnet/aspnetcore/blob/v10.0.0/src/Mvc/Mvc.Core/src/ModelBinding/Binders/ComplexObjectModelBinder.cs) invokes the property's setter, and [ValidationVisitor.GetValidationEntry](https://github.com/dotnet/aspnetcore/blob/v10.0.0/src/Mvc/Mvc.Core/src/ModelBinding/Validation/ValidationVisitor.cs) resolves that strategy by object identity. The cloned property object loses the bracket-key strategy, consistent with unvalidated ModelState entries and400 without error messages. This causal diagnosis is inferred from owner HTTP evidence and the exact framework/project source; the agent did not reproduce the request.

Frozen correction: preserve the bound dictionary instance throughout validation; normalize a service-owned case-insensitive snapshot afterwards. Keep the same endpoint, query keys/types, casing/last-value semantics, authentication, tenant queries, date range and optional-filter checks, complete response, grouping/calculations and frontend lifecycle. No ValidateNever, validation suppression, ModelState.Clear or global binder changes. The existing initialized SpecificationRequestDto.Filters auto-property is the source reference for this narrow DTO correction (BE9).

| Concern | Final implementation | Reconciliation |
|---|---|---|
| Model-binding identity | DriverTimeSheetReportFilterVM.Filters is now an initialized auto-property | Matches framework identity requirement |
| Case-insensitive filters | DriverTimeSheetReportService.GetReportAsync assigns input pairs into a private OrdinalIgnoreCase dictionary after validation | Retains required key semantics and last pair behavior |
| API/UI compatibility | All scalar/date parsing, queries, response fields and Angular source unchanged | No contract/business/schema migration |
| Guide | Existing HRM report topic/actions/routes remain correct | No guide source edits needed |
| Reusable learning | BE9 block and sigma-screen-refactor §8.2 plus history row updated together | Mandatory learning protocol satisfied |
| Packets | Generated phase-01-domain-api and phase-02-read-grid through generator; all8 -Check passed | BE9 dependency hash refreshed, packet procedures/reference roles unchanged |

Files changed in this follow-up: the two backend files above, canonical `sigma-erp/backend/09-search-model-and-filters.md`, its two generated packets, `F:/My Work/Sigma/.agents/skills/sigma-screen-refactor/SKILL.md`, and this existing review. Application changes stay within the Driver Time Sheet Report; the identical legacy PayrollsReportFilterVM/ListSmBase copying setters are recorded for their own scope and were not edited. The book's earlier claim that SpecificationRequestDto also copied its setter was corrected against source. The phase02 diff against HEAD also contains an earlier UI0 hash change; it predates this fix and remains preserved.

Scoped source/doc diffs and whitespace checks reviewed separately in SigmaBackend and the Shaban documentation repository. The app patch removes the copying setter and adds only the post-binding normalization loop; no query/output/interceptor code changed. Semantic packet review confirms only the BE9 dependency changed for this fix, no reference-role or execution-boundary drift. Source-only verification does not confirm HTTP success.

Owner verification: rebuild/restart the Backend and replay the supplied request via Refresh; valid input should reach GetReportAsync instead of automatic400. Verify omitted/empty range, malformed/reversed dates, optional type0/1, invalid IDs/type, casing variants, successful empty results and full Excel/summary/print behavior. Invalid business filters must still return the localized failure. Build/request replay remains pending under AGENTS execution boundaries; no prohibited commands, DB queries, live application verification, commits or pushes were run. No subagent: sequential binding diagnosis and small repair. No migration is needed.

Suggested scoped commits:

- SigmaBackend: `fix(driver-time-sheet-report): preserve query filter binding`
- Shaban documentation repository: `docs(backend): preserve query dictionary validation identity`

Skill/review artifacts still remain local/unversioned under the documented instruction-layer boundary.

## HRM Reports active-menu correction — 2026-10-10

Owner reports both HRM report entries selected when opening Driver Time Sheet Report. Source cause: SidebarMenuComponent.isLeafActive defaults to prefix matching, and /HRM/Reports is a prefix of /HRM/Reports/DriverTimeSheet. Frozen one-property correction: select the existing exactActive option for the Payroll report menu entry; reuse shared active-link logic, with no new CSS or routing algorithm. UI1 / PHASE05 integration and PHASE06 source reconciliation apply; report type07 and all data/UI contracts remain unchanged. Recipe -Check passed all8 packets. Reference conformance: existing /Leave/dashboard uses exactActive, and leaf template binds class.active to isLeafActive(item); target now uses the same public option.

Only application change: src/app/_metronic/layout/components/sidebar/sidebar-menu/sidebar-menu-data.ts, adding exactActive:true to /HRM/Reports. Source branch comparison: /HRM/Reports selects Payroll only; /HRM/Reports/DriverTimeSheet no longer selects Payroll and selects Driver Time Sheet. Source baseline comparison proves all other pending menu changes preserved; scoped whitespace check passed. No new translations, guide changes, backend/API/calculation/schema changes or migration required. The documented report and guide routes/actions remain accurate. No agents used: one sequential menu-configuration fix. No builds/tests/lint/browser/runtime/database/migration/commit/push/deployment commands run; owner navigation/active highlight verification remains pending.

Suggested frontend commit for this fix only: `fix(hrm-reports): match payroll menu route exactly`.
