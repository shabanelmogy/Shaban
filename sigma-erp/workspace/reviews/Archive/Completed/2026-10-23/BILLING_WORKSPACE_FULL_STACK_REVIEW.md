# Billing screenshot workspace — implementation and reconciliation

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-14 |

## Outcome and authority

Owner clarifies that Billing must open the screenshot workspace, then says «كمل» and «خلى Billing فيها collapse افضل». This supersedes the earlier navigation-only interpretation and direct-link decision. Frozen plan: BILLING_WORKSPACE_MAINTENANCE_EVOLUTION_PLAN.md; frozen read handoff with recorded menu amendment: BILLING_WORKSPACE_READ_CONTRACT_FREEZE.md.

Billing now has a shared sidebar accordion below Data Entry Corrections: Invoices opens `/BillingInvoice`, Billing guide opens `/UserGuide/billing`. Its list route now renders the screenshot's Outstanding/Cleared sections, Billing Info, commercial-type dropdown, Refresh, stored-value total and counts. The old unrelated product columns/actions/Create button are removed from that workspace. The screen uses Sigma's canonical shared presentation rather than copying screenshot colors/layout details.

Applied phases: PLAN00 inventory/options/freeze, discovery0, domain/API1, read2, integration5, reconciliation6. Editor3 and domain-action4 are not applicable to this read-only screenshot. Existing legacy create/details deep links and generic CRUD APIs remain for compatibility; they are not exposed as workspace actions or certified by this task. No additional Add/Edit/Delete/Pay/Clear/Print/export workflow was invented.

## Evidence and decisions

B1 `C:/Users/user/Desktop/Billings.jpg`: English/LTR, wide desktop empty-list state; role/date/version/current-versus-historical acceptance Unknown. Explicit: Billing/Billing Info, Refresh, Outstanding/Cleared invoice sections/counts, total, category dropdown and nine columns. No attachment instructions are adopted. Commercial subscription/service billing purpose is an inference from the category names. Payment/settlement/generation/formulas/record relationships cannot be derived from this static empty screenshot.

| Decision | Final implementation and reasoning |
|---|---|
| UI/backend shapes | UI07 read-only sectioned report and BE5 dedicated read endpoint; existing BillingInvoice generic CRUD remains BE1 compatibility. No accounting write owner is introduced |
| Category | Independent nullable BillingCategory on BillingInvoice: Subscription0/ChangeRequest1/Project2. Existing shared InvoiceType Standard/CreditNote/DebitNote retains its accounting meaning. Historical missing values remain null; All includes them with an explicit Unclassified label/count |
| State grouping | Persisted Open0/OpenOverAllocated2 → Outstanding; Closed1 → Cleared; Voided3 excluded. This is a source-supported display classification, not a new settlement transition |
| Total | Database sum of stored TotalAmount for matching open statuses; signed values retained, no client sum or VAT recomputation. Explicit translated note: full invoice values, no partial-payment deduction; Closed is stored state, not independently verified payment evidence |
| Dataset | Complete filtered tenant/live-row response, descending Date then Id, no server cap. Both groups use the same typed projection; local paging does not change totals/counts. QueryReport fail-closed tenant/soft-delete behavior retained |
| Writes/compatibility | Optional enum field on existing write/read VMs; API EnumDataType validation. Public single Update path reads the existing entity before conditional category mapping, so omitted/null category preserves it. Add omitted category remains null. No workspace mutation or category-clearing workflow. No named internal batch BillingInvoice consumer was found |
| AutoMapper | Four one-way maps, no redundant ReverseMap/Ignore. One property condition is justified solely by older clients omitting category. Workspace uses direct typed projection, not a heavy list VM |
| Feedback/lifetime | GET-only root service; environment.baseUrl and existing root interceptors. Inline error header + apiErrorMessage/StateMessage handle declared and HTTP failures once. Subject/switchMap/defer, takeUntilDestroyed and finalize retain cancellation and loader balance. Disable filter/refresh during reads; loading/failure clears stale output |
| Access | AuthGuard layout and dedicated [Authorize] controller; QueryReport enforces tenant/live rows. No permission API or security-by-hidden-button claim |
| Menu | Latest owner instruction selects shared accordion, expanded=true as group marker, no parent link; existing route/default/search/keyboard/disclosure/pin owners retained. Both children have actual existing route destinations |

Grid beside read model: `invoiceNo(text), category(translated text), date(date), period(text), description(wrapped text), amount(money), vat(money), totalAmount(money), status(status badge)`. DTO properties exactly `id,invoiceNo,category,date,period,description,amount,vat,totalAmount,status`; id supports stable row identity. No workspace ListVM, tenant/audit/flags or row actions. Legacy ListVM is a compatibility contract and remains unchanged apart from the additive nullable category.

## Source conformance

| Concern / book | Actual consumer ↔ producer comparison | Result |
|---|---|---|
| UI1/3/20, Statement and ReportPage/ReportActions | BillingInvoicesComponent.sigma-route-host → section appReportPage.sigma-report-page--fill → shared sigma-report-panel; in-card FeatureTitle and labelled report filter/Refresh; Toolbar suppresses duplicate title only on exact `/BillingInvoice` | Matched in source |
| UI6/20, DataTable and document frame | Typed sections() drives one shared template, two full-width FormSections/grids, lazy=false/fill=false/scrollable=false, shared default15/choices10,15,20,50,100; outer sigma-report-table-frame owns both axes, public min-width1260 covers1040 fixed tracks +220 description | Matched to documented complete-document variant; pagers flow inside document |
| UI24, SummaryCard/SummaryCards | Three typed cards read only report totals/counts; slim/row/min140/max80 and12px host separation; no copied card/number formatting | Matched in source |
| UI16/23/22/28 | Typed static category options retain numeric0, null omitted; current language rebuilds labels;32 keys per vocabulary; translated states and bounded frame; shared error helper and cancellation | Matched in source |
| BE17, DailyServiceLogReport/QueryReport | BillingWorkspaceService has dedicated interface/controller; no Save, no tracking, one SQL aggregate and one complete ordered row query; tenant/live/filter predicate identical | Matched in source |
| BE3/4, compatibility | Nullable entity/read/write field, optional API enum validation, update category condition retains existing single-record value; no shared enum relabel or historical backfill | Matched to frozen compatibility scope |
| Master7, UserGuide | BILLING_GUIDE registered once, billing id, same route, one submenu entry and header link; purpose/filter/Refresh/status/count/full-value limits/unknown category/history/FAQs in EN/AR; common guidance updated for collapse | Matched in source; reader/print/navigation acceptance pending |

Shared-extraction gate: existing ReportPage, ReportActions, FeatureTitle, FormSection, DataTable and SummaryCards own visual composition. Both sections reuse one typed metadata list, one template and one columns definition. No new general component or duplicate transport is required; the nullable category and report population/formula decisions are feature-specific and belong to the plan/contract. No new reusable canonical rule was introduced by this workspace implementation. The preceding sidebar-height repair independently synchronized UI1/skill/history/packets.

## Files and integration

Frontend actual repository `F:/My Work/Sigma/SiGmaAngularFrontEnd`:

- Replaced `src/app/modules/Billing/BillingInvoice/components/list/list.component.{ts,html,scss}`.
- Added `models/workspace.ts`, `services/billing-workspace.service.ts` in that feature.
- Added `src/app/modules/UserGuide/content/billing-guide.ts`; registered in guide-reader.component.ts; amended common shared-screen-guidance.ts.
- Added only billingWorkspace keys to en.ts/ar.ts; sidebar-menu-data.ts Billing group; toolbar.component.ts exact workspace title suppression.

Backend actual repository `F:/My Work/Sigma/SigmaBackend`:

- Added `SiGma.Helpers/Enum/BillingInvoiceCategory.cs`; nullable field in Models/Vouchers/BillingInvoice.cs.
- Added `SiGma.Helpers/Dtos/BillingWorkspace/{BillingWorkspaceDto,BillingWorkspaceInvoiceDto}.cs`.
- Added `SiGma.ViewModels/ViewModels/BillingWorkspace/BillingWorkspaceFilterVm.cs`, `SiGma.Business/IServices/IBillingWorkspaceService.cs`, `Services/VouchersServices/BillingWorkspaceService.cs`, `SiGma.ServerAPI/Controller/BillingWorkspaceController.cs`.
- Additive nullable category in BillingInvoice Add/Update/Detail/ListVM; updated BillingInvoiceProfiler only. Existing sealed BillingInvoiceConfig already maps the entity; conventions map nullable enum. DependencyResolver's scoped Scrutor assembly scan already discovers the new public service/interface; no second registration/client or changed provider is needed.

Existing lazy BillingInvoice route mounts the replacement component; no new route or preemptive tsconfig files/include change. Existing UserGuide `:sectionId` route consumes the new billing section. Neither old generic details/model/service implementation nor unrelated frontend/backend changes are overwritten.

## Verification, migration and owner handoff

Source checks performed: complete scoped tracked diffs separately in both actual repositories plus direct reads of all added files; final TypeScript syntax parser9 files and Angular template parser1 template with zero syntax errors;23 direct named source exports compared with zero missing names; translation checker32/32 keys, zero missing/case differences; whitespace and merge/legacy source scans clear, including all7 added backend files. Installed HttpParams.set accepts number; standalone controls/directives match actual declarations and imports. These checks do not certify Angular/.NET compilation, provider runtime, SQL translation or visual appearance. Recipe Check passes all eight packets after the preceding canonical update; workspace introduces no further canonical drift.

Schema changes in this task: one nullable BillingCategory field only; no existing property type/nullability/length/index/relationship change and no removed column. Owner must run **Add-Migration AddBillingInvoiceCategory** (no same-named migration found). Review the generated migration against existing pending model changes; keep old rows null, retain original InvoiceType/amount/status values, and do not infer a category from text or enum0. Apply reviewed migration before backend deployment/use. No migration/snapshot was created/edited/run by this task. Existing workspace migration/snapshot changes belong to the owner and were preserved.

Responsive matrix — visual acceptance pending in every row:

| Range | Source expectation |
|---|---|
| Wide/intermediate/around1260px document width | Nine columns retain widths, descriptions wrap, bounded frame contains horizontal overflow; full-width sections in source order |
| Around1100px summary container | Existing SummaryCards row owner fits3 equal columns when wide and wraps below1100 with max80 internal card bounds |
| Below720px and620px | Shared report page/panel padding changes; fixed title/filter/cards and one shrinking document frame retain internal scroll. No feature page-height or color rule |
| Mobile sidebar around992px / minimized / short heights | Existing drawer/minimize owner; corrected measured search-height dependency applies; Billing group uses same disclosure and route highlight as other groups |
| Arabic/English, RTL/light/dark, long labels/values | Shared controls/theme/logical owners retained; filter overlay body-appended and32-key bilingual parity; owner checks keyboard focus and both table sections |

Owner checks after migration/compile: open Billing group and collapse/reopen by mouse/Enter/Space; choose Invoices and guide; GET All/null/category0,1,2/invalid category; confirm soft-deleted/foreign-tenant/Voided exclusion, legacy null visibility and empty groups. Compare stored totals and complete array counts including >100 matching records, date/id order and local pages. Exercise Refresh/category change/load declared and HTTP failure/Retry/route cancellation, long Arabic descriptions, both directions/themes and short/narrow sizes. No invoice Save/payment/database mutation is needed for screen verification.

Risks/limits: screenshot does not establish invoice generation, settlement/allocation, payment integration or currency conversion. Those workflows are not implemented. Existing data requires a real producer to classify records; all historic nulls remain visible under All. Aggregate and row queries are separate reads and can observe concurrent changes at different instants; no snapshot-isolation guarantee is claimed. Complete-array response can grow with invoice volume; no hidden server cap is introduced. Legacy deep-link editor defects remain outside the read workspace scope. Live browser acceptance remains unavailable due the broken Windows helper/absent browser connection.

Agent utilization: one bounded `billing_frontend` agent (gpt-5.6-sol/high) was dispatched after freeze with exclusive frontend ownership while root implemented backend, expecting independent layer work to reduce wall time. It hit the account usage limit before edits. Root completed all frontend/backend/integration; no delegated source output was merged, no overlapping agents.

Suggested commits (only these task files/hunks):

- Frontend: `feat(billing): add invoice workspace and collapsible menu`
- Backend: `feat(billing): add categorized billing workspace read model`

Builds, tests, lint, migrations, database operations, commits/pushes and deployments were not run. No application record was mutated. Status remains Implemented — source-only, with migration/compiler/API/visual owner verification pending.

## Follow-up: owner-reported active compiler errors and Web Deploy 401

Owner reports CS0234/CS0246 for BillingWorkspaceFilterVm and IBillingWorkspaceService in Business/ServerAPI, plus a separate ERROR_USER_UNAUTHORIZED publishing to win8058.site4now.net. This follow-up is confined to those source dependencies and deployment-error diagnosis. No source defect requiring a change was established, and no publish profile or credential was modified.

Read-only MSBuild metadata evaluation used `dotnet msbuild <project> -getItem:Compile,ProjectReference -getProperty:EnableDefaultCompileItems,DefaultItemExcludes,TargetFramework` with no target, compilation, restore or deployment. ViewModels includes ViewModels/BillingWorkspace/BillingWorkspaceFilterVm.cs; Business includes both its interface and implementation; ServerAPI includes its controller. Default compile items are enabled, no relevant exclusion exists, Business references ViewModels, and ServerAPI references Business. Namespaces/type names match their consumers and GlobalUsing.cs imports IServices. Both Debug and Release solution configurations include the projects in Build. No explicit Compile Include or redundant project reference was added.

On 2026-10-14, filter/interface sources were last modified at approximately 21:56 Cairo time. Debug reference assemblies were last modified at 19:50 (ViewModels) and 19:51 (Business); Release at 19:57 and 19:58 respectively. Read-only byte-string inspection finds neither new type name in those existing reference DLLs. Helpers Debug reference DLL at 22:15 does contain BillingInvoiceCategory. The stale downstream reference assemblies are therefore verified; attribution of the active Visual Studio diagnostics to those references is a supported inference, not a successful compiler validation.

Owner recovery: reopen/reload the actual SiGma.sln, then explicitly build the ViewModels, Business and ServerAPI dependency chain (or Rebuild Solution) to refresh the references. If errors remain, inspect the first actual Build-output error in Helpers/ViewModels instead of only dependent Active/IntelliSense diagnostics. Reload alone is not claimed to refresh compiled assemblies. No build was run by this follow-up, respecting the owner's stop-build instruction and AGENTS.md boundary.

Web Deploy 401 is independent of C# type resolution. Microsoft documents ERROR_USER_UNAUTHORIZED as potentially an incorrect/nonexistent publishing user, password, nonexistent site or missing IIS Manager permission for the site's scope: https://learn.microsoft.com/en-us/troubleshoot/developer/webapps/iis/deployment-migration/web-deploy-error-codes#ERROR_USER_UNAUTHORIZED . Owner should verify the provider-issued Web Deploy site name and publishing credentials and, if needed, obtain a current publish profile from the hosting provider; persisting a 401 requires the hosting administrator to check site-scoped permissions. No remote validation or publish attempt was made and the exact rejected credential/permission is unknown.

Phase06 and BE17 report ownership retained; no business/API/category/guide/schema change in this follow-up. Recipe drift check passed all eight packets. New source files were read directly and scoped project/source diff and whitespace checks were reviewed. No subagent used: this is one small, tightly related diagnosis. Compilation, runtime and deployment verification remain owner-pending.

## Follow-up: Outstanding and Cleared workspace tabs

Owner «خليهم tabs افضل» supersedes the stacked complete-document presentation. Frozen amendment recorded before source edits. Billing now uses shared EditorTabsComponent with appearance=workspace, response-owned count badges, Outstanding default and typed BillingWorkspaceSection['id'] keys. Both complete-array tables remain mounted while a screen-media inactive class hides the unselected panel, retaining each local page and size across tab selection. Category changes return to Outstanding; same-filter Refresh keeps the selected tab. Selection triggers no API call and resets the row viewport through the shared public scrollToStart method after rendering.

| Concern | Owning book / source reference | Final source match |
|---|---|---|
| Tab navigation and focus | UI13/20; EditorTabs public API and Customer Statement selectTab/template | Shared translated labels/counts/RTL arrows/Home/End; billing-invoices tab/panel ID prefix matches aria-controls/aria-labelledby; focus stays on tab, panels tabindex0 |
| One visible section title | UI20 tabbed-report sections | Tab caption identifies section; repeated heading uses d-none d-print-block only; both panels stay in DOM |
| Bounded table/pager | UI6/20; Customer Statement fill panels and DataTable scrollToStart | Overflow-hidden shrinking flex frame/panel; fill=true/scrollable=true complete local tables, shared default15 and size options; active row viewport owns both axes, table paginator fixed |
| Fixed outer controls | UI1/20 | Title/filter/slim summary retained; tab host flex0 and outside results frame; no viewport calc or feature tab palette |
| Guide | Master7; BILLING_GUIDE | EN/AR tab selection/counts/paging/keyboard/category reset/Refresh retention replaces old scroll-to-second-section instruction, same reader route/menu |

Files in frontend: list.component.ts/html/scss plus UserGuide/content/billing-guide.ts. No backend/API/mapping/calculation/schema changes; no new migration needed for this presentation amendment (original category migration remains pending). Columns and complete response unchanged. No new print/export action introduced; mounted panels/print-only headings preserve section structure without claiming a complete paginated print workflow.

Applied focused read presentation/integration/reconciliation phases; backend/writes skipped because unaffected. No canonical rule change or derivative regeneration needed; all eight recipe checks passed. Full scoped frontend diff reviewed plus direct guide read; TypeScript source parser9 files and Angular template parser1 file return zero syntax errors, shared generic tab API and ID bindings matched in source. Checks do not certify compilation or live layout. Owner checks both tabs with mouse/arrows/Home/End, zero-count tabs, individual page retention, category reset versus Refresh retention, short/narrow viewport row scroll/pager and Arabic/English/themes. No subagent used because this is a small sequential UI change. No build/test/lint/browser/database/migration/commit/push/deployment executed.

Suggested frontend commit for this amendment: `feat(billing): display invoice sections in workspace tabs`. Status remains Implemented — source-only with owner compiler/runtime/visual verification pending.
