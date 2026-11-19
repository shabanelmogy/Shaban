# Job — Invoice on Customer implementation review

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-03 |
| Request | Add Invoice on Customer to the Job Actions button; 321.PNG is a functional reference |
| Repositories | F:/My Work/Sigma/SiGmaAngularFrontEnd; F:/My Work/Sigma/SigmaBackend |
| Plan / handoff | JOB_INVOICE_CUSTOMER_MAINTENANCE_EVOLUTION_PLAN.md / JOB_INVOICE_CUSTOMER_ACTION_CONTRACT_FREEZE.md, both Frozen |
| UI / backend | UI08 financial document with routed editor (UI13 D4-2); backend pattern 3, existing MiscellaneousInvoice posting owner |
| References | Actual Job routed editor and existing Close Job invoice input; InvoiceService journal rules; shared UnitOfWork.ExecuteUniqueWriteAsync |
| Scope exclusions | Other Job actions, Lubrication Job invoice workflow, new insurance allocation, new accounting policy, historical journal rewrite, schema or permission mechanism |

## Evidence / decisions

E1: `C:/Users/user/Desktop/321.PNG`. Locale English/LTR; approximately 723×392 image. User role/product version/capture date Unknown (the displayed invoice date is content, not proven capture metadata). Business content Explicit: Invoice on Customer, record identifier, Date and Time, customer name/code, Details, charge type / vehicle / description / amount / tax / gross rows, Add Row, remove, amounts in words, Close and Save. Layout/colors are visual evidence only. Availability in other Job states, accounting journal, permission and duplicate behavior are Uncertain in this image and confirmed from source/approved contracts instead.

| Decision | Evidence and business reason |
|---|---|
| Standalone invoice leaves Job open | User requested a separate action; Close owns status/ClosedAt and remains distinct |
| Reuse MiscellaneousInvoice with Module Workshop / JobNo | Owner decisions C3–C5 in JOB_ACTIONS_FEATURE_REVIEW; avoids another document or posting policy |
| Fixed customer comes from Job | Screenshot displays customer context; backend loads authenticated tenant Job and live Partner, rather than trusting a client customer |
| Open ordinary Job without a live linked invoice | Existing Close HasInvoice rule; HasInvoice is action-only grid state; no Lubrication Job business contract introduced |
| Four existing workshop types | Existing ChargeTypes 41–44 and Close input; account links already approved |
| Date/time now, job details/vehicle/nonzero charge defaults | Reviewer source-supported defaults under the standing owner rule; all editable invoice inputs remain editable |
| Routed editor | UI13: totals or posting require a routed page; screenshot content is preserved in canonical components |
| Tax/amounts server-owned | Settings ITaxPolicyService and D4-4; VAT rounded once per rate and distributed to lines; header and journal must reconcile |
| Repeat/concurrent participating actions | Existing tenant Job exclusive-write boundary, duplicate recheck and one transaction; financial duplication must be prevented |
| Resource-backed annotation messages | Program config has AddControllers but no AddDataAnnotationsLocalization; JobInvoiceValidationMessages resolves existing GeneralMessage resources directly for MVC and internal validation |
| Schema / maps | Response fields and request VM metadata only; no entities/EF changes. Reuse existing maps and create the action payload explicitly; no new ReverseMap/Ignore |
| Ledger versus display precision | FinancialNumberPolicyResolver reads the base Currency.DecimalPrecision; read context adds moneyDecimalPlaces for preview/scale/step, while CommonDTO precision is used only for currency wording. Frozen handoff has a dated additive correction |

No required Missing/Conflicting/Uncertain functional contract remains in this bounded action slice. Unknown screenshot metadata and owner runtime/visual acceptance remain explicitly unverified. Save issues the existing no-approval financial document/journal as confirmed by C3–C5; it uses the financial editor's explicit Save, with no separate confirmation-only workflow.

## Backend implementation

- `IJobService.InvoiceCustomerAsync` / `JobController.POST invoice-customer/{jobId}` consume the existing invoice VM and return the delegate Result, preserving invoice Id, success message and failure status.
- `JobService.InvoiceCustomerAsync` loads Job number/state/customer inside `ExecuteUniqueWriteAsync<Job>`, rejects unavailable/closed/invoiced Jobs and calls `RaiseWorkshopInvoiceAsync`; it does not change Job state.
- `CloseAsync` uses the same boundary; `CloseCoreAsync` keeps its existing close-only or invoice-plus-close decisions. Invoice, journal and close state now roll back together on failure rather than allowing a partially completed close.
- `RaiseWorkshopInvoiceAsync` reuses annotation metadata for internal calls, refuses charge types outside the workshop set, validates all selected vehicles and live customer, builds only the input fields for the existing service and returns its Result directly.
- `MiscellaneousInvoiceService.AddAsync` joins an outer transaction and commits/rolls back only its own. `PriceChargesAsync` allocates document VAT and persists header Amount/Tax/TotalAmount only for Workshop-linked invoices; other document shapes retain their current behavior and accounting backlog.
- `GetClosingAsync` adds CustomerCode and MoneyDecimalPlaces from the registered FinancialNumberPolicyResolver, preserving an invalid/incompatible precision failure. Mixed grid adds HasInvoice through a server subquery and explicitly sets false in the Lubrication projection; actual provider translation is owner-pending.

## Frontend implementation

- `JobsComponent.actions` adds the typed Invoice on Customer action for ordinary Open, uninvoiced rows; `openInvoiceCustomer` passes the existing list query state to `/Job/invoice-customer/:id`.
- `JobInvoiceCustomerComponent` uses the shared routed shell, FeatureTitle title/job subtitle, FormSection, EditableCollectionTable and EditableRows. Date/time, fixed customer/code/vehicle, editable details and six row fields preserve E1's content. Nonzero charge groups prefill rows; Add/Remove remain available.
- Typed controls validate date, supported workshop types, positive amount/base-currency scale, settings-or-optional-zero tax and text lengths. Save constructs the frozen input-only payload. Customer/module/number/tenant/audit, tax amounts, totals and journal never enter the request.
- Shared documentTax/allocateDocumentTax/roundMoney use backend-provided ledger precision. Compact SummaryCards stay outside the scrolling table section; the header is bounded at 38% of the remaining form body, summary cards use their public 132px maximum, and amount words have a bounded 76px scroll region. This is source layout conformance, not proof of visual behavior at every viewport.
- Shared amountInWords uses CommonDTO currency labels/display precision and existing English voucher wording, including Quadrillion for safe integers. Missing required wording labels produce no partial amount text; the UI shows a dash. No hardcoded Dirham/Fils. Arabic interface keys exist; Arabic number-word conversion is outside the existing English helper capability.
- Detail and required lookups cancel/stale-check with DestroyRef/request IDs and expose inline Retry. Save is blocked until they succeed, disables form/row mutations, and owns global loading/finalize. Both Result-false and HTTP-error recover a dirty retained draft while the interceptor owns the single failure message. Successful Save marks pristine, blocks reissue and returns to the list.
- Cancel/Back and route exit share confirmDiscard; saving blocks exit even for a pristine default draft. A confirmed button exit sets the navigation allowance so the route guard does not ask twice.
- The existing Close Job `lineTotal` consumer now uses the same shared VAT allocation and ledger precision, since it calls the same pricing owner. Its existing workflow/layout is not redesigned here.

## Scoped files

Backend:

- SiGma.Business/IServices/IJobService.cs
- SiGma.Business/Services/JobService.cs
- SiGma.Business/Services/VouchersServices/MiscellaneousInvoiceService.cs
- SiGma.ServerAPI/Controller/JobController.cs
- SiGma.ViewModels/ViewModels/Job/JobCloseInvoiceVM.cs
- SiGma.ViewModels/ViewModels/Job/JobCloseInvoiceLineVM.cs
- SiGma.ViewModels/ViewModels/Job/JobInvoiceValidationMessages.cs (new)
- SiGma.ViewModels/ViewModels/Job/Dtos/JobClosingDto.cs
- SiGma.ViewModels/ViewModels/Job/Dtos/JobGridRowDto.cs
- SiGma.Helpers/Localization/Shared/GeneralMessage.resx and GeneralMessage.ar-SA.resx (12 JobInvoice keys each)

Frontend:

- src/app/modules/Workshop/Job/components/invoice-customer/invoice-customer.component.ts (new)
- src/app/modules/Workshop/Job/components/invoice-customer/invoice-customer.component.html (new)
- src/app/modules/Workshop/Job/components/invoice-customer/invoice-customer.component.scss (new; region sizing only)
- src/app/modules/Workshop/Job/components/list/list.component.ts
- src/app/modules/Workshop/Job/components/close-job/close-job.component.ts (calculation consumer only)
- src/app/modules/Workshop/Job/job.routes.ts
- src/app/modules/Workshop/Job/models/closing.ts
- src/app/modules/Workshop/Job/models/list.ts
- src/app/modules/Workshop/Job/models/invoice-customer.ts (new)
- src/app/modules/Workshop/Job/services/job.service.ts
- src/app/modules/shared/utils/financial-number.util.ts
- src/app/modules/shared/utils/amount-in-words.ts (new)
- src/app/modules/i18n/vocabs/en.ts and ar.ts (Job action/editor keys only; other pending work preserved)

Documentation: canonical UI19/preamble/changelog (Job promotion UI1.62; later unrelated UI1.63 updates preserved), required sigma-screen-refactor skill rule/history and generator-produced phase packets; this review, Frozen plan/handoff and handoff's dated integration addendum. Review/skill records remain local outside the current application repositories.

## Final contracts / phases

Phases 0/1: scope/evidence/frozen handoff. Phase 2: only action visibility/read flags; grid columns, filters, pager/export semantics unchanged. Phase 3: new invoice form Save. Phase 4: standalone invoice issue and participating Close concurrency. Phase 5: new route and service call. Phase 6: final source reconciliation complete. Reports/uploads/ordinary Job aggregate editing and new schema are Not Applicable to this action; no application/runtime phase was run.

Grid column list: Actions (shared), no (text), recordType (translated text), status (status), estimationNo (text), vehicle (text), customerName (text), customerCode (text), createdBy (text), totalCharges (money), dateAndTime (dateTime), estimatedCompletionTime (dateTime), branch (text), insuranceCompany (text). JobGridRowDto/JobListRow contain these corresponding fields plus id/recordKey/hasInvoice only. No visible column is added for HasInvoice.

| Action/grid need | Angular model | Backend DTO | Final comparison |
|---|---|---|---|
| Displayed fields above | same camel-case fields | matching PascalCase fields | Confirmed; columns unchanged |
| Identity / mixed-source row key | id / recordKey / recordType | Id / RecordKey / RecordType | Confirmed; source-aware routing unchanged |
| Invoice visibility | status / hasInvoice | Status / HasInvoice | Confirmed; both projections assign flags |

Filters remain recordType/no/estimationNo/workOrderNo/status/customerId/dateFrom/dateTo/plateNoOrChassisNo/jobType/branchId/ownership/createdBy/insuranceCompany/salesPersonId/labourType/itemType. Existing buildFilters serializes `Filters[PascalCaseKey]`, skips only null/undefined/empty string and preserves enum zero; the mixed-grid read's case-insensitive lookup, date bounds, count/paging/clamp/sort and full export remain unchanged. Existing current-month/Open defaults and list state are retained. This task introduces no filter control or backend parser.

Add/Update payload: invoiceDate, details, lines[].chargeType/vehicleId/description/amount/taxPercent. Job ID is the route target; customer, JobNo, Module, status, tenant/audit, line tax/total, header amounts and journal are server-owned. Response-only CustomerCode/MoneyDecimalPlaces do not enter a write payload. There is no invoice Update mode in this action. New line collection is a complete create snapshot; no persisted line IDs/removals are involved.

| UI input/context | Typed form / read producer | Write field | Validation owner |
|---|---|---|---|
| Date and time | Date/string/null; local Date validator + appDatePicker | invoiceDate, local wall clock via toApiDateTime | Required VM date; UI real-date/year check |
| Details | nonnullable string, default translated Job No | details/null | MaxLength500 VM/UI |
| Charge / optional vehicle / description | enum/null; number/null; nonnullable string | corresponding line inputs | Required/EnumDataType + workshop subset; live tenant FK; Range/MaxLength250 |
| Amount / tax rate | number/null; number | amount / taxPercent | positive VM/UI, base-currency preview scale; server ITaxPolicyService |
| Customer/code/Job number / precision | JobClosingDto from authenticated Job + financial resolver | omitted | Server-owned |
| Row gross / summary / words | shared preview helpers and summary component | omitted | Backend row/header/journal pricing authoritative |

| Action | Source → target | Flag / API / service | Interaction / recovery |
|---|---|---|---|
| Invoice on Customer | ordinary Job Open + no live linked Invoice/MiscellaneousInvoice → same Job state + new invoice/JV | HasInvoice; IJobService/JobController POST invoice-customer/{jobId}; JobService.invoiceCustomer | Routed typed input + Save; duplicate recheck in Job lock, one transaction; failed draft retained, success returns to reloaded list |
| Existing reference Close invoice creation | same posting owner; Close alone changes state | CloseAsync uses same lock; existing close service/payload retained | Supported existing action; row preview reconciled, separate layout not redesigned |
| Close-only transition inside standalone issue | Not Applicable | No Status/ClosedAt write | User requested invoice action, not Job closing |
| View/Edit/LabourTime/Delete | existing reference actions Supported unchanged | existing routes/services | No new workflow introduced |

Route `/Job/invoice-customer/:id` is a standalone action editor under the existing Job lazy route/AuthGuard ancestry, with an action-specific CanDeactivateFn. Existing root JobService and the environment.baseUrl interceptor-enabled client are reused; no feature providers/new HttpClient. Detail GET and settings/vehicle lookups opt out of error presentation because the screen owns inline failure. Save uses the existing global interceptor for exactly one success/error message and only handles state recovery. Both exits retain the list query parameters; the list is recreated and its normal source reload runs.

Scoped override audit: JobService's preexisting GetMany/GetAllWithNavigations/DetailWithNavigations/Add/Update/Remove are unchanged except mixed-grid read consumer outside those overrides; no new generic override. MiscellaneousInvoiceService Add remains justified by financial posting; Update remains justified by journal rebuilding/pricing and Remove by existing journal handling. Existing SalesAgreement guards were already present and preserved. No controller base operation is redeclared.

Authorization candidate: issuing a customer invoice, POST Job/invoice-customer/{id}. AuthGuard/[Authorize] and tenant repository validation exist. Visibility is presentation; no authorization mechanism is invented.

## Reconciliation and source verification

| Path | Final producer / consumer evidence | Status |
|---|---|---|
| New action request | JobInvoiceCustomerComponent.save → JobService.invoiceCustomer → JobController/IJobService.InvoiceCustomerAsync → existing JobCloseInvoiceVM | Confirmed source |
| State and duplicate | InvoiceCustomerAsync + CloseCoreAsync inside UnitOfWork.ExecuteUniqueWriteAsync<Job> | Confirmed source; concurrency runtime pending |
| Tax and journal | New editor / Close lineTotal → shared allocateDocumentTax; PriceChargesAsync → VatPolicy.AllocateDocumentTax → stored rows/header → AddJournalLines | Confirmed source; ledger acceptance pending |
| Customer context / HasInvoice / precision | GetClosingAsync + FinancialNumberPolicyResolver + both JobGridRowDto selectors → typed models/action/editor | Confirmed source |
| Resource messages | 12 keys each, valid XML, no duplicate resource keys; localized annotation properties | Confirmed source |
| Editor / route / recovery | Job_Routes guard → component.canDeactivate/requestClose/save/finalize + list query return | Confirmed source; owner runtime/visual pending |

| Concern | Book / actual reference owner | Final target symbols and compared values |
|---|---|---|
| Bounded routed shell | UI1/13; Job editor + shared global editor styles | sigma-route-host → page/panel/form/body; new header and table internal regions; summary/footer outside table scroll; no page-height calc or feature palette |
| Child mechanics / controls | UI14/16/19; EditableRows/EditCollectionTable/FieldError | typed InvoiceLineForm, editableLines.replace/add/requestRemove, public table fillHeight/stickyHeader/fixed widths, all validated inputs have app-field-error, translated row options/body overlays |
| Dates/focus | UI17/27; DatePickerDirective/date-utils/focusField | showTime24; toApiDateTime (no UTC Z), invoiceDate validator, invalid field focus and helper Add focus |
| Summary | UI24; SummaryCardsComponent public inputs | compact/row, minCardWidth160 and maxHeight132; three money-format net/tax/gross cards |
| Financial preview | UI19/BE15; financial-number.util/VatPolicy/FinancialNumberPolicyResolver | per-rate tax rounded once, proportional allocation/largest absolute remainder/first tie/zero-net; backend ledger precision, not display precision; derived fields excluded |
| Tax lookup | UI19 default rate owner / ITaxPolicyService | Justified context reuse: backend GetClosing supplies the authoritative settings rate, and the same Common settings lookup supplies optional-tax state/currency labels with visible retry, rather than a second silent fallback request |
| Async and feedback | UI22/28; shared errorInterceptor + loading | canceled reads/request IDs, actual Save handler lookup/busy gate, both failure paths recover; interceptor-only Save presentation, inline reads with skip header |
| Exit | UI10; ConfirmationDialogService.confirmDiscard | pristine exit, saving-first block, pending dialog gate and one confirmed exit across button/route guard |
| Posting/transaction | BE8/15; MiscellaneousInvoice/UnitOfWork | derived job customer/module/no; customer Dr/charges+VAT Cr; outer transaction joining; duplicate check after shared tenant Job lock |

Backend complete scoped Git diff reviewed in the actual repository; working baseline of already-modified MiscellaneousInvoiceService/resources was also compared, preserving unrelated SalesAgreement and report changes. Backend diff --check passed. New local message class read separately as untracked source. No new entity property/nullability, EF relationship/index/length, model snapshot or persisted column changed. VM MaxLength constraints affect input validation only, so **no Add-Migration is required for this task**.

Frontend complete scoped tracked diff and all new untracked component/model/helper sources reviewed separately; Job translation parity reports **272 en / 272 ar, zero missing or case-only keys**. Scoped frontend/backend `git -C <actual repo> diff --check` passed. Actual lazy Job route, shared component public inputs, generic ActionList type, annotation localization, client headers and save ownership were traced. No build/TypeScript/C# compilation is implied. The new runtime component is reachable through the existing lazy route import; no reported missing-entry error exists, so no broad tsconfig include was added.

Shared-extraction result: reuse existing UnitOfWork lock/transaction, VatPolicy, typed invoice VM, posting owner and shared editor/row/state/summary/confirmation/date/focus/select helpers. Added shared allocateDocumentTax and adopted it in the new editor and the affected Close preview; added shared settings-based English amountInWords and adopted it in the new editor. Canonical UI19 and skill rules/history promoted both in UI1.62, changelog updated, generated recipes regenerated mechanically and semantically reviewed (fingerprints only for the current book edits). No new cross-screen backend policy was invented; JobInvoiceValidationMessages is a single workflow resource bridge.

Final prescribed recipe check: all eight packets OK. A concurrent documentation update briefly staled Phase06; the generator restored the current fingerprints, and comparison excluding fingerprints proved all eight packet bodies unchanged. New untracked source files contain zero trailing-whitespace/merge-marker findings. No independent application execution occurred.

## Owner acceptance / limitations

No build, tests, lint, application/browser/database checks, migrations, commits, pushes or deployment were run. No Sigma MCP or Graphify was used. Build/runtime/visual/database acceptance remains pending.

1. Configure existing Workshop charge mappings under Link Accounts → Charges Type → Miscellaneous and TaxCollected; issue an open Job invoice and reconcile net/tax/gross against the persisted invoice and posted journal.
2. Verify the Job stays open, action disappears, and Close uses its close-only path. Verify mixed Job/Lubrication grid paging and the HasInvoice subquery translate on the actual EF/provider version.
3. Repeat an issue request and race issue-versus-issue and issue-versus-Close; expect one document. Lock scope protects participating Job action writers, not arbitrary SQL or another future bypass writer; conflicts require reload, not blind retry.
4. Missing accounts, unavailable/cross-tenant vehicle/customer and illegal state must fail without a partial document/journal/close. Input date/text/amount errors display in the current language.
5. Verify dirty Cancel, failure-retained draft, retry, list query state, keyboard focus, narrow viewport, Arabic/RTL, light/dark, single scroll ownership and fixed totals/footer.
6. Check base-currency ledger precision0/1/2 separately from Common display precision, multiple equal/small line amounts and optional zero tax. Confirm line/header/journal totals match and the Close invoice preview shares that allocation. Incompatible base precision must fail via the existing policy. English amount words use configured labels; no Arabic number-word capability is claimed.

Possible compile/runtime risks are owner verification items: actual Angular/template/C# compilation, the EF/provider mixed-grid subquery, inherited shared controls under short/narrow RTL viewports and transactional/account-link behavior on the configured database. Existing unrelated Job/Close layout or accounting backlog is not certified by this bounded action review. No migration name is suggested because this task does not change schema.

## Agent utilization / suggested commits

Root owns discovery, freeze, backend, documentation and final integration. One bounded sol_worker frontend agent (`gpt-5.6-sol`, high) contributed the new component/model/route/list/service/translation/shared-preview slice after freeze, disjoint from backend work, to reduce elapsed time/cost as allowed by AGENTS. Root integrated and reviewed its actual files, corrected save/exit handling, settings wording, ledger precision, fixed summary placement, converter boundary and the affected Close preview. No independent agent verification report is claimed; final source reconciliation is root-owned and complete.

Suggested only, scoped hunks rather than unrelated pending repository changes:

- SigmaBackend: `feat(job): add standalone customer invoice action`
- SiGmaAngularFrontEnd: `feat(job): add invoice on customer to job actions`
- Documentation repository: `docs(job): document shared invoice previews and conformance`

No commit is created. Unrelated pending changes must be excluded when the owner stages these scoped hunks.
## 2026-10-03 follow-up — invoice badge and filter

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

The owner requested an invoice-status badge and filter, then required the badge column immediately after JobNo. The dated additive read handoff in JOB_INVOICE_CUSTOMER_ACTION_CONTRACT_FREEZE.md is Frozen. It supersedes the earlier action-only HasInvoice and unchanged-grid/filter decisions for this bounded extension. Existing invoice issuance and posting behavior remains outside the extension.

Pre-edit conformance: existing JobsComponent.initColumns/jobStatus uses shared type=status; DataTableComponent template renders sigma-status-badge and dataTableCellText translates status labels for export. FilterPanelComponent.countActive retains boolean false through String(false), so the new first advanced control can use boolean/null without a new enum. TranslateOptionsPipe preserves typed option IDs and refreshes labels on language changes. Shared toListParams retains false and omits null/empty; fetchAllPages fails on a failed page; resolveListPaging compares previous paging before updates. GetWorkshopGridAsync already produces HasInvoice on both branches and orders with RecordType/Id tie-breakers. New filtering will consume that projection before counting/paging.

### Final read contract / conformance

| Concern | Final producer / consumer and comparison | Result |
|---|---|---|
| Column placement | JobsComponent.initColumns: no immediately followed by hasInvoice, then recordType/status and the remaining existing columns; shared Actions remains first | Confirmed source; explicit owner placement |
| Badge / Excel text | invoiceStatus(row) returns job.invoiceStatuses.invoiced + success when true, notInvoiced + neutral when false; shared statusOf/statusClass and dataTableCellText consume the same column status function | Confirmed source; theme/RTL remains shared |
| Filter / control | filterForm.hasInvoice is boolean/null; invoiceStatusOptions has true/false IDs; first appFilterAdvanced field uses TranslateOptionsPipe, optionLabel=label, optionValue=id, inputId/label, showClear and appendTo=body | Confirmed; null shows All invoice statuses, clear restores all. Existing six main fields remain. |
| Request / parsing | JobService.getList calls toListParams; toFilterParams excludes only empty/null/undefined, so false serializes to Filters[hasInvoice]=false. ListSmBase creates OrdinalIgnoreCase dictionary; FilterHelper.GetBool returns null for malformed/empty/absent values | Confirmed; existing PascalCase keys remain accepted, new requests use documented camel-case keys |
| Query / count / sort | GetWorkshopGridAsync applies row.HasInvoice == parsed value after its existing mixed-source projection but before CountAsync/Order/Skip/Take; hasinvoice sort uses existing RecordType/Id tie-breakers | Confirmed source; EF/provider acceptance pending |
| State / reset | search uses raw nullable value; returnQueryParams writes literal true/false; restoreStateFromRoute parses exactly those values; resetFilters clears to null and page1, retains existing current-month/Open defaults | Confirmed; normal route handoff carries the invoice filter |
| Paging / cancellation | onLazyLoad uses resolveListPaging against previous page/size before signal writes; requestList deduplicates identical full queries, switchMap/defer cancels superseded reads | Confirmed; size-only changes still fetch |
| Export | getAllList reuses fetchAllPages at pageSize100 with the same filters/sort; dataTableExportRows exports translated badge text in the new column position | Confirmed; failure stops the complete export |
| States / style | One app-data-table with fill=true, API totalRecords, existing inline errors, showEmpty=!errorMessage; existing shared route/list/filter shell and no feature SCSS | Confirmed source; visual acceptance pending |

Grid fields, in order: Actions (shared), no, hasInvoice (status), recordType, status (status), estimationNo, vehicle, customerName, customerCode, createdBy, totalCharges (money), dateAndTime (dateTime), estimatedCompletionTime (dateTime), branch, insuranceCompany. Corresponding backend DTO fields: No, HasInvoice, RecordType, Status, EstimationNo, Vehicle, CustomerName, CustomerCode, CreatedBy, TotalCharges, DateAndTime, EstimatedCompletionTime, Branch, InsuranceCompany, plus Id/RecordKey for identity. Angular JobListRow matches these plus id/recordKey. No field was added to the row DTO or removed. JobFilters adds hasInvoice?: boolean|null. HasInvoice now owns display/filter/action state instead of action state only.

| Filter input | Serialized query | Backend behavior |
|---|---|---|
| All / cleared (default null) | invoice key omitted | Both invoice states, within the other applied filters |
| Invoiced true | Filters[hasInvoice]=true | Only rows whose existing HasInvoice projection is true |
| Not Invoiced false | Filters[hasInvoice]=false | Only rows whose existing HasInvoice projection is false, including lubrication rows under their established false contract |
| Malformed / empty / absent external value | No valid bool | Invoice restriction omitted; frontend malformed route value restores null |

Invoice derivation is unchanged: existing repository Query<Invoice>/Query<MiscellaneousInvoice> supplies tenant-owned, nondeleted JobNo values; ordinary Job projection checks their presence; lubrication projection explicitly remains false. No accounting calculation, action mutation, authorization mechanism, entity, EF configuration, transaction or journal was changed by this follow-up. Existing stateful mixed read query is retained; no new generic override or AutoMapper map is required. **No Add-Migration is required.** No new screenshot requirement is inferred: badge/filter existence and column position come from the explicit owner request. No unresolved Missing/Conflicting decision remains for this bounded read change.

Files changed by this follow-up:

- Frontend: src/app/modules/Workshop/Job/components/list/list.component.ts and .html; models/list.ts; services/job.service.ts; src/app/modules/i18n/vocabs/en.ts and ar.ts (five matching Job keys).
- Backend: SiGma.Business/Services/JobService.cs (read filter/sort only); SiGma.ViewModels/ViewModels/Job/Dtos/JobGridRowDto.cs (comment only).
- Local artifacts: this dated follow-up and the additive Frozen handoff. Earlier frozen decisions and source-only results remain historical.

Phases applied: 0 bounded discovery, 1 additive read freeze, 2 complete filter/grid/count/paging/export path, 5 existing service/route-state integration, 6 reconciliation. Phases3/4 skipped because this follow-up has no editor write or domain transition. Shared-extraction result: reuse existing shared badge/filter/option translation, toListParams, resolveListPaging and fetchAllPages; remove feature-private serializer/all-pages/paging copies in the affected consumers. No new reusable capability or guidance was established, so no canonical book/skill/generated packet edit is needed. All eight generated packets passed the prescribed drift check before and after work.

Verification: actual Git roots confirmed separately; complete scoped Job/backend diffs and all Job vocabulary hunks reviewed, including previous action work without overwriting it. Frontend/backend scoped diff --check each exited0. Prescribed translation parity reports **275 en / 275 ar, zero missing and zero case-only keys** at this follow-up. Source search found no stale private buildFilters/expand/HttpParams imports, new any contracts, merge markers or prohibited legacy copy in the changed read consumer. Compilation/runtime is not implied by these checks.

Owner verification pending: check green Invoiced/neutral Not Invoiced directly after JobNo; select both invoice states through More filters and clear to all; combine with Open/Closed, dates and record type; verify count/pages, badge sorting and all-page Excel text; return from invoice/editor with hasInvoice=false preserved. Verify the actual EF provider translates the filtered mixed projection and invoice subquery, and check Arabic/RTL, light/dark and narrow viewport. These checks are acceptance steps only; no build, tests, lint, browser/application/database commands, migrations, commits, pushes, deployment, Sigma MCP or Graphify were run.

No subagents were used for the follow-up: its small tightly sequential read change did not meet the delegation gate. Existing unrelated working-tree changes were preserved. Suggested commits only: SiGmaAngularFrontEnd `feat(job): show invoice badge and filter invoiced jobs`; SigmaBackend `feat(job): filter and sort workshop grid by invoice state`. Stage only this task's scoped hunks.

