| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Review date | 2026-10-26 |
| Authorization | Source-read-only review; review artifact writes only |
| Outcome | Review finalized; seven source findings remain unimplemented |
| Latest authorized follow-up | Current balance through today implemented source-only; see dated amendment below |

# Suppliers — current-source full-stack review

## Manifest and review boundary

Request: review Suppliers screens against current Sigma documentation. Tier L, module review. Existing Frozen `SUPPLIERS_MAINTENANCE_EVOLUTION_PLAN.md` and `SUPPLIERS_FRONTEND_BACKEND_CONTRACT_FREEZE.md`, including recorded amendments, provide the upstream business/API contract. Earlier implementation reports are historical evidence, not proof of current conformance. No new implementation is authorized.

Scope: the four active routes `/Supplier`, `/SupplierStatement`, `/SupplierBalancesSummary`, `/PayableAgeAnalysis`, their Angular module files, directly related Supplier API/service/DTO/entity/configuration/mapping, actual consumed shared owners, lookup sources and in-app Suppliers guide. Supplier import is inspected only as a successful cache/uniqueness writer. Purchasing/vouchers and opening balances are outside implementation scope; direct report producer links may be read.

Shapes: Supplier type 01 list with modal editor, backend normal entity with one owned address; three type 07 reports, backend report pattern 5. References: Workshop Job list; shared EditorDialog and UI13 controlled composition; shared ReportPage/ReportActions and Customers Statement section semantics, TrialBalance shared filter/totals. No approval or posting lifecycle is invented for Supplier.

Actions: list/search/paging/export, Create/View/Edit/Delete, dirty discard; reports Search/Refresh/Reset/Print/Excel, statement section selection, balances statement drill-down, aging custom periods. Access: existing AuthGuard and authenticated API, no per-action permission system.

Initial source contracts retained for review: lean Supplier list identity plus code/name/phone/website/email; client-owned Supplier input fields with optional owned address; existing endpoint paths and Result/Results wrappers; complete report opt-in `includeAllRows=true` for balances/aging, server totals and existing AP sign/allocation/as-of semantics. Current-source differences will be recorded as findings, never silently frozen as new business rules.

Existing working tree: substantial unrelated Customers/Receipts/shared vocabulary/routing/backend work is present in both application repositories. Supplier feature files are initially clean. All pre-existing changes, including migrations/snapshot changes, remain untouched. Repository roots are `SiGmaAngularFrontEnd` and `SigmaBackend`; workspace reviews are local artifacts.

Authority: workspace AGENTS, sigma-screen-refactor skill, Master1/3/4/5/7/8, UI catalog 01/07 and applicable owning blocks; backend entity/EF/DTO/mapping/service/controller/list/validation/filter/normal/report blocks. Recipe check passed PLAN00 and PHASE00–06 before packet use; no regeneration required. Existing Frozen plan reused. Phases0–3/5/6 are review-only; Phase4 limited to ordinary Delete/confirmation source review, no new transition. No screenshots/videos supplied, functional screenshot table not applicable.

## Findings and evidence

### F1 — P2: error interceptor releases progress it does not own

Evidence: `SiGmaAngularFrontEnd/src/app/modules/shared/interceptores/error.interceptor.ts:40,62`; actual registration `app.config.ts:33`; Supplier list `components/list/list.component.ts:96-112,192-200`; detail `components/details/details.component.ts:282-291`.

Every unsuccessful Result or HTTP error calls `loading.endLoading()` in the interceptor, including `X-Skip-Error-Interceptor` auxiliary requests that never started a global count. Feature requests also release their own count in finalize. Reproduction from source: start two counted requests (list refresh plus Excel, both controls permit this); failure of one decrements twice and hides global progress while the other is pending. Alternatively a failed Currency/Country/ContactGroup read during Supplier detail consumes the detail's count. The floor at zero prevents negative numbers but does not preserve ownership. This contradicts UI22's one release per subscribed start. Recommendation: let the request owner release its own token/count; error presentation must not release an anonymous global count. Preserve navigation/write safety and all current error feedback. This shared dependency is reported, not changed. Runtime overlap acceptance pending. UI30's resolved boolean-loader item does not address this double release.

### F2 — P2: balances statement dialog has no visible progress owner

Evidence: `SupplierBalancesSummary/components/list/list.component.ts:190-205` starts global loading; `components/list/list.component.html:104-134` renders EditorDialog and a loading table but no loading StateMessage. The shared dialog appends to body (`shared/components/editor-dialog/editor-dialog.component.html:16`); shell progress is content-local with z-index10 (`layout/layout.component.scss:21-24`), while installed PrimeNG modal default is1100 (`node_modules/primeng/fesm2022/primeng-config.mjs:224-225`). Shared DataTable hides its loader whenever global loading is true (`data-table.component.html:37`), and PrimaryActionButton suppresses its spinner the same way.

Trigger: activate a supplier row in Balances Summary, or Search in that statement dialog. The local table and Search spinner disappear while the global indicator is behind the body-appended modal. Recommendation: classify this read as local dialog, render one existing shared StateMessage, retain loading/busy/disabled/error/recovery and suppress a duplicate table mask using its public input. Retain cancellation on close/identity changes. This is a confirmed wiring mismatch under UI22; actual perceived visibility/timing is owner-pending.

### F3 — P2: Supplier Save hides its only foreground progress indicator

Evidence: `Supplier/components/details/details.component.ts:241-249`, template `:12,24-25`; shared EditorDialog `editor-dialog.component.ts:25-28` and body append/stacking evidence in F2. Save sets saving and starts the global counter; the dialog suppresses its Save animation when that global count is active. Its local StateMessage covers loadingDetails only. Thus Create/Update leaves a disabled foreground form without visible save progress while the indicator remains behind the modal. Recommendation: resolve visible save ownership in the existing shared dialog/global policy, retaining the required global write count, one foreground progress presentation, duplicate-save blocking and write-navigation safety. Do not add a feature timer/skin or confuse this write with the local read exception. Source-only finding; runtime/accessibility acceptance pending.

### F4 — P3: Supplier discard duplicates an existing shared owner

Evidence: `Supplier/components/details/details.component.ts:196-205` traverses disabled controls, freezes and restores them itself. UI10 now requires the existing `shared/utils/form-state.ts:5-32` freezeFormState owner for reviewed pending decisions. Current Supplier has flat controls, so no demonstrated data loss is claimed. Recommend adoption of the existing helper while retaining deferred identity/mode/save checks and accepted-value ordering. No new wrapper or business contract is needed.

### F5 — P2: report payable-account selection omits logical slot dimensions

Evidence: backend `SiGma.Business/Services/SupplierServices/SupplierService.cs:126-135` filters Contacts links by supplier group and live account identity, but omits SubType, normalized JobType and LinkSection. Actual posting identity is defined in `Resolver/LinkAccountLookup.cs:32-36,90-95`; Bill's existing validation uses Supplier subtype, job type0 and Default section (`Services/VouchersServices/BillService.cs:1517-1524`). `LinkAccountsConfig.cs:19-27` allows distinct logical slots at the same Type/Value because the other dimensions belong to the unique key.

If legacy/inconsistent mappings retain an additional Contacts slot for the same supplier-group Value, reports union its account into AP and can include its posted supplier movements. All three reports consume this helper. Recommend exact read-side slot resolution with diagnostic handling for ambiguous/missing mappings, preserving the frozen history rules. **Do not copy write-only IsActive/AllowChildren guards into reports without a historical-data contract**: disabling a posting account must not silently remove its old posted movements. QueryReport already scopes tenant/live account identities; no cross-tenant leak is established. This is a source predicate mismatch and conditional correctness risk, not proof that current production totals are wrong. Historical mapping replacement/account-membership policy remains an explicit decision before broad financial redesign.

### F6 — P2: opening Supplier details recursively loads unrelated graphs

Actual path: frontend `SupplierService.getSupplierDetails` calls `Supplier/GetByWithNavigationsId/{id}`; inherited `SiGmaControllerBase.cs:61-63` → `Service.DetailWithNavigationsAsync` (`Services/Bases/Service.cs:1307-1320`) → `Repository.GetByIdDeepAsync/LoadNavigationsRecursiveAsync` (`SiGma.Repos/Repository/Repository.cs:457-565`). SupplierService has no bounded override. The repository enumerates each reference/collection and recurses per loaded entity. Supplier inherits Partner's salesperson/customer/branch/billing/documents/cards relations in addition to its actual address/country/group/currency needs.

Thus one View/Edit HTTP call can cause data-dependent sequential queries/materialization for graphs unused by SupplierDetailVM, before mapping the lean response. Visited IDs prevent loops but do not bound graph size or query count. Recommendation: a Supplier-specific bounded read projection or includes for the actual detail contract, retaining tenant/live root checks and required historical labels. Keep the generic deep loader unchanged for other consumers in a bounded implementation. No measured query count/latency or data disclosure is claimed; the mapper does not expose those unused graphs in this DTO. BE7/UI29 require owner SQL/response/render evidence.

### F7 — P2: aging rescans the full journal population for every supplier

Evidence: `SupplierService.cs:677-689` materializes the required as-of journal/allocations population. At `:719-722`, each supplier executes `jvLines.Where(l => l.SupplierId == supplier.Id).ToList()`. Source complexity is O(S×L) scans before row construction and `:774-781` paging. Larger supplier count multiplies CPU work despite one HTTP call and a small visible page. Recommend one ToLookup/GroupBy keyed by SupplierId, then use the matching collection per supplier, preserving matcher results, signed buckets, total count, deterministic order and complete output. This is in-memory repeated work, **not SQL N+1**. Timing improvement remains unmeasured.

### Improvements and rejected overstatements

- Statement performs a separate TaxAdvanceInvoice query although those same dated AP rows are already in rawLines (`SupplierService.cs:246-268,312-337`). Consolidating that subsection from the existing typed projection is a supported query-reduction candidate, preserving voucher/date/order/allocations/running-total semantics. No measured latency claim is made.
- Aging's report error is a feature alert (`PayableAgeAnalysis/components/list/list.component.html:88-90`) rather than shared StateMessage. A visible Retry would make recovery clearer. Search already reruns the same unchanged valid form, and the balances dialog also has Search; these are **not** classified as a total recovery failure or P1. The frozen aging guide does not promise a separate Refresh action. Adding a new action is a recommendation, not a missing financial/API contract.
- Statement Outstanding is correctly credit-side only: SupplierPayableLine.Net is Credit−Debit and the matcher retains its sign; remaining>0 excludes debit residuals. No arithmetic defect is reported from that predicate.
- TaxAdvanceInvoiceLines are a subset of the already-returned period ledger, not an independent payable population. Adding their due values to OutstandingTotal would double-count; no such change is recommended.
- A subreview's proposed removal of lean detail base classes was rejected: the later owner lightweight-base amendment at the top of SUPPLIERS_FEATURE_REVIEW explicitly approves NumberedDetailBaseVm/LeanDetailBaseVm. They add only the contracted identity/number fields. Older explicit-class wording does not override that amendment.
- Supplier import maximum-length validation deserves a separate Administration/import review; this task inspected import only for successful reference invalidation/uniqueness participation. No import UI rewrite or new contract is implied.

## Current contract comparisons

| Concern | Actual source contract | Result |
|---|---|---|
| Supplier columns / ListVM | Actions first through shared DataTable; `no:text, name:text, phone1:text, website:text, email:text`; frontend SupplierDTO / backend SupplierListVM: `id/Id, no/No, name/Name, phone1/Phone1, website/Website, email/Email` | Matched; identity supports View/Edit/Delete; no ListVM field removed in this review |
| List filters | nonNullable search; applied snapshot; `Filters[search]`, optional `Filters[grid]`; pageNo/pageSize/sortField/sortOrder via toListParams; server sorting; local draft excluded from paging/export until Search | Matched; URL hydration, switchMap/defer, full fetchAllPages export and last-row-delete page fallback retained |
| Supplier detail | id/no/name/vat/trn/website/otherDetail/contactGroupId+Name/currencyId+Name+Code/taxExempted/email/phone1/phone2/partnerAddress | Typed; currencyCode is unused by this modal, but direct nested consumers need review before narrowing the shared backend DTO |
| Add/Update | name required nonblank≤250; VAT/TRN≤50; website≤100; phones≤50; email valid≤254; notes≤1000; nullable positive group/currency; taxExempted boolean; optional address≤250/city+state≤100/zip≤30/country positive; Update adds root id and saved optional address id | getRawValue; no client tenant/no/audit/calculated totals; retained child id; backend validation authoritative |
| View/exit | explicit parent mode/id; component remounted through @if per session; View no Save/no edit-only lookups; disabled form; deferred dirty confirmation checks identity and restores state; list route canDeactivate forwards to editor | Behavioral source match; shared freeze-owner drift F4 |
| Writes and Delete | POST/PUT Supplier; DELETE Supplier?id; shared confirmation + dependency-aware backend delete; successful mutation feedback from root interceptor; closed(true) reloads applied list | No invented approval/posting/permission; failure leaves draft/row intact |
| Statement rows | date:date, voucherType:text, voucherNo:text, description:text, age:number, optional poNo:text, allocations/debit/credit:money, outstanding-only dueAmount:money, runningBalance:signed display; both complete response arrays | Shared supplierStatementColumns, separate tab paging, active-section Excel/grouped export and both-section print |
| Balances columns | code/name/contactPerson/mobile/contactNo/email/balance; backend SupplierBalanceSummaryDto + supplierId identity, metadata/compatibility fields | Complete IncludeAllRows request and exact count/page validation before local paging; authoritative totalBalance |
| Aging columns | name/code/contactGroup; seven money buckets; balance:money; backend PayableAgeAnalysisRowDto plus supplierId | Complete IncludeAllRows request and metadata check; customize-off uses30/60/90/120/150/180, custom positive increasing integers; effective applied headers shared across output |
| Report filters | Statement supplierId/fromDate/toDate/reportType/includeInactive; Balances fromDate/toDate/branchId/supplierId/supplierStatus/salesPersonId/balanceType/balanceFrom/balanceTo; Aging asOfDate/supplierId/supplierGroupId/customizePeriods/p1Days…p6Days | Shared date serialization, strict range validation; optional null/blank omitted, false and zero retained; signed inclusive Range before totals/page |
| Access/provider | root AuthGuard → Layout → pages lazy entries721–746 → actual four components; root provided services; app.config HttpClient token/error/navigation interceptors | Matched source; authentication only, no invented per-action authorization |

No contract, AutoMapper, domain calculation, entity or EF source is changed by this review. Detailed backend audit and index disposition follow below.

## Per-source cache adoption evidence

URL prefix below is the actual configured `environment.baseUrl`; preserve build-specific local/remote base selection. All option sources use Results<DropDownSelect> and inline skip-error mode in these consumers. Financial operations use Result/Results of their own typed data and stay uncached.

| Exact URL suffix / consumers | Classification, real owner and successful writers | Finite read / active binding / scope and failure evidence | Status |
|---|---|---|---|
| Currency/GetSelect — Supplier editor | Approved reference; CurrencyService.cacheSelect=true; typed create/update and inherited delete invalidate on success; lookup-currencies tenant topic | editor forkJoin/readLookup checks both failure channels; bind currencies once after success with selected-ID/current-options getters; options-only update | Source-conformant; network pending |
| Country/GetSelect — Supplier editor | Approved reference; CountryService.cacheSelect=true; typed create/update/remove and inherited writes invalidate; lookup-countries | same finite read + countries binding; saved country label merged only in initial detail/bootstrap; View uses detail text and skips lookup | Source-conformant; network pending |
| ContactGroup/GetSelectByType/Supplier — editor and aging | Approved typed reference; ContactGroupService exact encoded type URL; group CRUD/active/default writers invalidate family; Supplier typed/inherited writes and positive savedRows imports invalidate ContactGroup dependency; lookup-contact-groups | editor forkJoin/readLookup and aging independent finite bootstrap; bind contactGroups/supplierGroups after success; selected IDs/options retained on fresh empty result; errors/Retry and teardown | Source-conformant; network pending |
| Supplier/GetSelect — all report filters | Approved reference; SupplierSharedService and SupplierService both opt in; typed Supplier create/update/inherited delete success hooks; ImportSupplierService invalidates Supplier and ContactGroup when savedRows>0 even partial failure; lookup-suppliers | finite initial source reads; separate supplier binding once on success; selected-ID/current-row getters; no form patch/recalculation in callbacks | Source-conformant; network pending |
| Branch/GetSelect — balances filter | Approved reference; BranchService create/update/delete + inherited success hooks; lookup-branches | finite forkJoin with supplier/staff, all-success batch contract; separate branches binding; CurrentBranchService initial default preserves manual/clear/restored values | Source-conformant; network pending |
| Staff/GetSelect — balances salesperson filter | Direct reference, no source opt-in: StaffService inherits cacheSelect=false. No eligible-source decision is invented | finite forkJoin, lookup error and Retry; deliberately no active reference watch/topic obligation under current source contract | Correct direct exception |
| Supplier (list), Supplier/GetByWithNavigationsId/{id}, Supplier/Statement, Supplier/BalancesSummary, Supplier/PayableAgeAnalysis | Direct operational/financial reads; no reference-cache opt-in for these URLs. TaxRate/{id} is a fresh financial-policy read used outside these four screen workflows | switchMap/defer or identity/destroy-guarded detail; inline errors on reads; direct authoritative backend responses | Correct direct exception; loading findings remain separate |

Shared source chain inspected: BaseService readReferenceSelect/watchReferenceSelect/invalidateSelectOnSuccess; ReferenceLookupCacheService.topicFor URL matching; server AddSigmaRealtime registration for actual entity types; ReferenceLookupBindings.bind selected/current option merge, explicit null context apply([]), retained-data silent refresh, per-failed-source Retry and takeUntilDestroyed. A watch callback never remerges the prior saved detail or changes form IDs/dirty state. Runtime coalescing, TTL, tab-return/rejoin, partial imports, credential/tenant/language/branch isolation and post-commit delivery remain owner checks. Mock-data assistance/preferences are inherited shared infrastructure, not a new Supplier lookup/cache source or business authority.

## Loading request and visibility reconciliation

| Actual path / request | Required owner / subscribed lifecycle | Effective host and source result |
|---|---|---|
| /Supplier initial/search/page/sort; getSuppliers | global start inside defer; finalize on replacement/failure/success/destroy; loadingList retains table/button busy | route has no showPageLoading=false; sole shell host exists; shared table/button suppress duplicate spinner. F1 corrupts count on failures/overlap |
| /Supplier Excel; getAllSuppliers | global start + finalizer around finite all-pages fetch; exporting prevents duplicate export | shell global, complete or error/no partial file; F1 overlap risk |
| Supplier View/Edit detail | body-dialog local read should own visibility; current implementation starts global and renders local StateMessage while loadingDetails | one foreground StateMessage exists, but unnecessary hidden global ownership overlaps lookups; align with F2's local-read policy in a future fix |
| Supplier editor lookups | local loadingDropdowns/readLookup; finite forkJoin finalize; watches silent with retained data | local StateMessage/lookup error/Retry, reference status; no global start. F1 lets their failures consume unrelated global count |
| Supplier Save / Delete | global start + finalize; form/write/close guards and interceptor feedback; list Delete confirmation blocks duplicate action | Delete shell visible; Save foreground indicator suppressed: F3 |
| /SupplierStatement /SupplierBalancesSummary /PayableAgeAnalysis report GET | global defer/finalize; filter disable/restore; switchMap cancellation; error/empty state kept | route metadata allows shell; shared table/Search mask suppressed. Main reports source match, apart from shared F1 |
| balances statement dialog read | required local visible StateMessage; switchMap/finalize/close cancellation exists | current hidden global + suppressed table/Search: F2 |
| report Excel/Print | already-loaded complete data, no additional HTTP; print session owns render preparation and teardown | no new global data request implied; table bounds/paging released for print |
| cached retained refresh | shared cache request; no new page count or form busy state | silent local options update, shared header background badge; error/Retry retained |

LoadingService itself compares parsed route-path trees (UrlTree root), so same-path query/fragment updates from writeListRoute retain pending progress; actual path departure resets. Its immediate count and microtask publication are source-conformant. This does not cancel NavigationActivityService's independent write lifetime.

## Reference, layout and Angular adoption reconciliation

| Concern / book | Actual owner and compared source | Result |
|---|---|---|
| Width/scroll UI1/29 | Supplier component has sigma-route-host and no local host geometry; global styles.scss:3629 display:block/min-width0/min-height0/height100%/overflow:hidden; page/panel flex-column fill; table flex1/min-height0/overflow hidden | Supplier source-conformant to Job list; content width does not depend on row count |
| Report width/scroll UI1/20 | actual three hosts sigma-route-host sigma-print-flow; no local :host display override; shared report page/panel; report table frames flex/min-height0/overflow hidden; Supplier report SCSS only internal frame/card/period layout | Source-conformant outer stretch; print release retained |
| Title/filter/table UI3/4/6 | Job list's FeatureTitle/FilterPanel/DataTable; Supplier title inside panel, stableLayout+inlineActions, shared Reset, fill=true, actions first; reports use ReportPage/ReportActions and DataTable | Matched; no feature palette, table internals or extra pager |
| Dialog/controls UI13/15/16/19 | EditorDialog default width1040/max viewport/breakpoints; controlled visible/mode/close; shared FormSection/FieldError/ValidationSummary; public p-select value/id/filter/body append | Matched composition; F3 progress and F4 reuse drift remain |
| States UI22 | actual StateMessage, table/button global suppression, root error interceptor | F1–F3, aging error-owner recommendation; errors retain recovery through Retry or Search |
| Platform UI1 | package.json and installed Angular core21.2.25 / PrimeNG21.1.10; root bootstrap/app.config one client + explicit Zone; standalone imports/control flow; typed reactive forms and signals; takeUntilDestroyed | Declared and installed evidence matched; runtime versions unverified; no blanket OnPush/zoneless/Signal Forms migration required |
| Print UI21 | ReportPrintService.createSession(DestroyRef); complete arrays; paginator/scrollable disabled during printing; statement both sections retained | Source-conformant, actual browser pagination/restore pending |

Visual acceptance matrix (all pending): before-read/loading/error/empty/populated states; sidebar expanded/collapsed; shared page-gap breakpoint991.98px, dialog1099/767px, aging periods900/600px and intermediate widths; LTR/RTL × light/dark. Measure route/card bounds, logical edges, fixed filters/actions/pager and sole internal scroll owner. Source reading does not prove actual all-width layout.

## User guide and language

Existing bilingual `src/app/modules/UserGuide/content/suppliers-guide.ts` covers the four operational routes, Supplier Create/View/Edit/Delete/discard and complete export; statement required dates/supplier/sections/outstanding/output; balances signed inclusive Range/all-result total/drill-down; aging custom periods/movement-date aging/signed matching. GuideReader registers SUPPLIERS_GUIDE and sidebar entry links `/UserGuide/suppliers`. No missing module guide is found. The current guide does not promise approval, permissions or report writes. Any authorized UI correction must update its affected recovery steps after implementation; this read-only task does not edit the guide. Supplier/report key blocks and case-sensitive action/error/date keys were inspected in both vocabularies; no confirmed missing scoped key found. Visual language/focus/RTL acceptance remains pending.

## Backend reconciliation and override audit

| Owner | Reason / evidence | Review outcome |
|---|---|---|
| UniqueColumns | VAT/TRN nonblank uniqueness over live same-tenant suppliers, including inactive; inherited ExecuteUniqueWriteAsync; Supplier import chunks participate in same unique-write boundary | Match existing Frozen TPT exception. SupplierConfig has no invalid inherited tenant/live composite index; no schema change proposed for uniqueness |
| SearchColumns | code/name/VAT/TRN/Phone1/Phone2/email search | Match guide/search scope and frontend applied query |
| AddAsync | discard entirely blank new address and resolve/validate Supplier-type contact group before base add | Justified feature validation; generic add/save/audit retained |
| UpdateAsync | resolve/validate Supplier group then invoke generic unique-write boundary | Justified validation; not a base-only override |
| UpdateCoreAsync | tracked supplier + address, InvalidInputAsync, OwnsReference, map onto retained root, ReconcileReference, SaveUpdateAsync | Justified owned-reference write; null address preserves existing one per frozen contract, retained address identity preserved |
| RemoveAsync | RemoveWithChildrenAsync includes owned address, blocks inbound live references | Justified aggregate/delete handling; ordinary inherited base delete limitation is not applied here |
| DetailWithNavigationsAsync | no Supplier override, inherited deep read | F6, requires a feature-specific bounded read in a later authorized implementation |
| SupplierController | no override; custom Statement/BalancesSummary/PayableAgeAnalysis/TaxRate call shared ToActionResult | Status/body wrapper preserved, including tax-rate404; no hardcoded BadRequest regression |
| Mapping | explicit one-way Supplier Add/Update/read/list/address maps; Update intentionally ignores PartnerAddress/PartnerAddressId for service reconciliation | Match; no ReverseMap or unnecessary new Ignore added. Import map is not changed |
| Entity/base | Supplier:Partner; Partner tenant/audit/name identity; SupplierDetailVM:NumberedDetailBaseVm and address detail:LeanDetailBaseVm | Later owner-approved lean bases retained; no new/moved type and no source namespace/project-reference change |

The tracked Supplier/address write uses its existing shared save boundary. Default contact-group/account provisioning can have its own persistence before root Save; this task neither merges those boundaries nor claims a single SQL command per Save. Financial reports use tenant/live QueryReport, posted/nonvoided JV membership, allocation effective-source/cutoff predicates and deterministic capacity-bounded two-sided matching. Total signs remain Debit−Credit for statement/balances and Credit−Debit residual for aging; allocations are not subtracted twice. Source conformance is limited by F5 and the temporal question below; this is not financial acceptance of production data.

## Load-speed, request/query and data-volume evidence

These are source execution boundaries, not measured SQL round trips. Query translation, FK/index behavior, deployed cardinality and elapsed time are unknown.

| Route/trigger | HTTP / server boundaries and response/render scope | Source finding or preserved contract | Pending comparison |
|---|---|---|---|
| Supplier initial/Search/page/sort | one list GET; base CountAsync + bounded page materialization; UI default15, export pages100; lean six-field response from entity materialization | no feature N+1 observed; list may materialize more entity columns than list projection needs, inherited base concern | compare page15/100, empty and late page, count/query/bytes/render |
| Supplier Create/View/Edit | Create: three finite lookups, potentially cache hits; Edit: one detail GET alongside those lookups; View skips edit-only lookups | F6: one detail HTTP hides recursive data-dependent queries; lookup cache is not proof of fast detail | use same supplier with small/large related graph; capture detail query count/materialized rows, TTFB and usable modal |
| Supplier Save/Delete | one POST/PUT/DELETE, then applied list refresh; default group provisioning, unique/FK/ownership/dependency/audit/numbering pipeline retained | no new unsafe cache or parallel EF; source call count does not establish DB latency | owner-run cases with existing/missing default group, duplicate keys, owned address and dependency deletion |
| Supplier Excel | sequential fetchAllPages GETs of100 until full metadata count; each base page performs count+page; no partial file after page failure | full dataset required; preserve applied search/grid/sort while measuring volume | record page/SQL count, bytes, full exported row count and concurrent-read failure behavior F1 |
| Statement and balances drill-down | one direct Statement GET; contact, payable accounts, period rows, payable history through cutoff, allocations, tax subset; optional beginning sum =6 materializations without fromDate,7 with it | redundant tax-subset query candidate; all-history payable matching scope is needed and cannot be removed merely to reduce rows | small/large supplier history, ledger/outstanding, old/recent period, allocations dense/sparse |
| Balances | initial three-lookup batch; first report waits for all-success bootstrap (existing contract), then one complete GET; optional filter-ID validations, suppliers projection, AP mapping, SQL-grouped journals, optional salesperson map | complete dataset/count/total before local page15; no report row request per local page/print/Excel | >200 suppliers, signed inclusive Range and optional branch/supplier/status/salesperson filters; inspect response bytes and first-usable time |
| Aging | two independent finite lookup requests; one complete GET; optional ID validations, suppliers projection, AP mapping, journal lines, allocations, optional group/branch label maps; full data before local paging | F7 O(S×L) CPU scan, plus compatibility fields/maps not displayed in current grid; preserve whole-result bucket/count totals | S suppliers × L history distribution, custom/default buckets, as-of boundary, partial/full matching; separate query vs matching/bucketing CPU vs transfer/render |
| Report Print/Excel | loaded complete arrays, no additional data HTTP; print session releases bounded local pages, statement includes both sections | no fake speed claim from local paging or loader correctness | verify full row counts, page restoration, both sections and correct applied totals/labels |

Reproducible owner measurement protocol: use the same application build/mode, API/DB placement, tenant snapshot, device/network and language/branch context; record supplier/journal/allocation counts and chosen filter dates/page sizes. Collect five repeated cold reference-cache opens and five warm opens per representative small/large case, recording each sample and median; this small sample does not justify a stable p95 claim. Capture initial usable UI separately from settled required data, HTTP counts/bytes/TTFB, SQL commands/rows/logical reads/duration/plan and rendering where available. Compare identical report rows/count/totals/order, export content and action guards before/after any later fix. Failure/replacement/cancellation checks accompany performance samples. No feature duration target is Frozen; the owner must agree an evidence-based target after baseline, rather than assuming a universal millisecond limit. **No before/after timings exist in this review and no speed improvement has been implemented.**

### Index disposition — proposals only

Mappings inspected: JournalVoucherConfig, JournalVoucherDetailConfig, JournalVoucherAllocationConfig each names its own table and relationships without a custom HasIndex; SiGmaDbContext.OnModelCreating applies configurations and tenant concurrency, with no generic index sweep. EF convention PK/FK indexes, historic/deployed manual indexes/statistics are not inventoried from these declarations. No claim that the database lacks indexes is made. All proposed indexes below are non-unique and unfiltered so nullable live IsDeleted semantics are retained. No Description/Notes text is included by default.

| Query / table | Candidate exact ordered key / optional coverage | Existing overlap, benefit hypothesis and cost | Disposition |
|---|---|---|---|
| period/as-of posted live journals — JournalVoucher | `(SubscriptionId, IsPosted, IsVoided, Date, Id)`; optional INCLUDE `(IsDeleted)` | equality tenant/state then date range/order; may overlap PK/FK or deployed report indexes; low-selectivity state prefix may offer little on almost-all-posted history; wider write index on post/void/date changes | Proposed only; inspect actual join-driving plan/cardinality before choosing versus date-first alternative |
| partner/account/journal AP lines — JournalVoucherDetail | `(SubscriptionId, PartnerId, AccountId, JournalVoucherId)` INCLUDE `(Debit, Credit, IsDeleted)` | improves tenant/partner/account selection and journal join, overlaps conventional individual Partner/JV FK indexes; storage and every ledger insert/update overhead; may not cover descriptions, deliberately avoiding a1000-character text leaf | Proposed only; compare plan/IO for single supplier and all-supplier report before adoption |
| target detail/as-of allocations — JournalVoucherAllocation | `(SubscriptionId, JournalVoucherDetailId, AllocationDate, Id)` INCLUDE `(AllocatedAmount, AllocatedJournalVoucherDetailId, AllocatedJournalVoucherId, ReceiptId, CreditNoteId, DebitNoteId, IsDeleted)` | target membership + cutoff, partial coverage of projected source joins; does not eliminate source-document/JV effectiveness joins or necessarily the global allocation-date sort; significant leaf width/write cost, trim includes if plan does not use them | Proposed only; compare to conventional target FK and any deployed composite index; preserve positive amount/source-history predicates |
| logical Contacts mapping — LinkAccounts | no extra index proposed | current unique `(SubscriptionId, Type, Value, NormalizedSubType, NormalizedJobType, LinkSection)` filtered live non-Workshop already covers key prefix. Fix/read slot contract first; `IsDeleted!=true` admits NULL unlike existing `=0` filter, so verify coverage without narrowing semantics | Existing coverage; no overlapping index justified |
| Supplier/Partner search, optional group/branch/status filters | no additional index proposed from source alone | TPT splits business fields and tenant/live scope; Contains search across fields is not solved by a blanket B-tree per field; optional filter selectivity/output scope and deployed indexes unknown. Preserve serialized uniqueness boundary | No new index justified without plan/cardinality evidence |

Index acceptance requires owner inventory of deployed keys/includes/filters, generated SQL and actual plan/IO under the same dataset, plus write/storage evaluation. Suggestions authorize no EF/index/schema/migration/database command. Because no schema source changes were made, this review requires **no Add-Migration**. A later approved index implementation must name its exact schema change and migration then.

## Open decision register

| Question | Source evidence / status | Required resolution |
|---|---|---|
| Does Supplier Current Balance mean balance through the selected end date, through today, or all posted history? | Uncertain semantic contract. SupplierService.cs:359 assigns running, identical to EndingBalanceTill for the selected period. CustomerService.cs:1127-1139 separately sums all posted AR history, but another feature's current source is not authority for changing Supplier accounting. Supplier frozen wording names period/current without an explicit distinct cutoff | Confirm intended cutoff and future-dated journal treatment before changing the Supplier total. Safe loading/query-only findings remain independently actionable |
| How should replaced/invalid legacy AP mappings affect historical reports? | Exact slot identity is source-supported (F5); old-account membership after mapping replacement is not fully frozen here | Preserve existing history; agree any expanded historical mapping strategy before changing financial membership or dropping inactive-account movements |

No new API/field/permission/approval workflow is invented; no implementation is blocked awaiting a reply because implementation was not requested.

## Final reconciliation and handoff

| Gate / phase | Final result |
|---|---|
| Phase0 discovery / Phase1 contract comparison | Existing Frozen module plan/handoff and later amendments reused; actual four route imports confirmed; no screenshots or inferred new business fields |
| Phase2 list/reports | Exact columns/filters/metadata/output compared; F5–F7 and query-reduction candidate recorded; complete print/export preserved in source |
| Phase3 detail/write | typed client inputs, readonly View, owned address and exit flow compared; F3/F4/F6 remain findings |
| Phase4 | Delete confirmation/dependency/read-refresh reviewed only; approval/posting/void Not Applicable to Supplier entity and these reports. Job-specific Close/lubrication/source conversion has no Supplier domain counterpart |
| Phase5 integration | actual root client/token/error/navigation path, standalone imports/routes/guide/menu inspected; F1/F2/F3 loading visibility remain |
| Phase6 | Root reviewed agent findings against current source, rejected superseded-base and unproven accounting claims, recorded cache/loading/performance/index and open questions. Source review finalized; **feature conformance is not declared complete** |
| Scoped diffs | Verified repository roots independently; complete Supplier feature/API/VM/entity/config/profiler/report DTO scoped diffs empty in both repos. Existing unrelated work remains. Direct shared sources are read dependencies, never edited |
| Static source hygiene | inspected registrations/imports/types, query keys, two failure channels, related EN/AR keys, scoped merge markers and whitespace. No new/moved classes to resolve; compilation not established |
| Source changes | none. Only this review and reviews/INDEX.md are written; no generated packet, canonical book, skill, application config/source, migration or snapshot edited |
| Packet state | PLAN00/PHASE00–06 passed initially and again at handoff; used applicable discovery/domain/read/write/Delete-action/integration/reconciliation packets; canonical and derivative files unchanged, no regeneration needed |
| Migration / commits | none required for this read-only delivery. No application commit message applies because no implementation diff exists; local artifact suggestion only: `docs(suppliers): record current screen review findings` |

Agent utilization: two bounded read-only luna_explorer workstreams using selectable gpt-5.6-luna, one for report frontend and one for Supplier backend/query/index evidence. Root owned discovery/contracts, Supplier CRUD/shared progress/cache/guide review, integration and final decisions. No agent had write ownership; source stayed untouched. Parallel review reduced elapsed work across independent report and backend paths without merge risk. Root, not subagents, owns this report's final severity and accepted findings.

Owner checks remain: application builds/tests if desired; real UI loading overlap/business-failure/HTTP-error/cancel and body-dialog visibility; draft discard/save/delete; cache TTL/invalidation/rejoin/isolation; >200-supplier complete reports and output; partial/full allocation and as-of boundaries; SQL/index/timing evidence; responsive/RTL/themes/keyboard/print/guide acceptance. These are proposed owner steps, not executed checks.

No build, test, lint, browser automation/application runtime, database, migration, commit/push, deployment, Graphify or Sigma MCP command was run. Read-only source/Git inspection and the authorized recipe drift check were used.

## Owner-authorized follow-up — current balance explanation, 2026-10-26

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Authorization | Owner accepted current balance through today and requested implementation with an explanatory marker |
| Scope | One balance rule, its dated API response and the two existing statement consumers |

The historical source-read-only report above remains intact. The temporal question is now resolved by the owner's acceptance of the recommendation: current balance includes eligible posted/nonvoided supplier AP entries through today, independently of the selected statement range, and excludes future accounting dates. The separate historical AP-mapping question and F1–F7 remain outside this follow-up. The new Frozen amendment is appended to SUPPLIERS_FRONTEND_BACKEND_CONTRACT_FREEZE.md; this is not approval to implement all review findings.

### Implementation and source conformance

- Backend SupplierService.GetSupplierStatementAsync captures its existing DateTime.Today once. One server-side SumAsync over SupplierJournalLines and the existing AP account population uses Date < today.AddDays(1), Debit−Credit and the request cancellation token. Existing tenant/live supplier/account/detail and posted/nonvoided parent query ownership remains. CurrentBalance now comes from that independent aggregate. Beginning/period ending/outstanding/matching/rows and existing sign labels remain.
- SupplierStatementResponseDto returns additive CurrentBalanceAsOfDate:DateOnly from the same captured day; net10.0/implicit System imports support the existing Helpers project. No new class/namespace/project inclusion or mapping change. Server API XML documents the new response semantics. Frontend SupplierStatement adds currentBalanceAsOfDate:string.
- Both actual summary producers call supplierStatementCards, which uses the existing public SummaryCard icon=bi-info-circle, hintKey/hintParams and amount/suffix contract. New EN/AR title and visible hint describe the independent cutoff and exclude future accounting dates. The date comes from the server response through toPickerDate + formatDisplayDate, avoiding browser UTC date-only shifting. It is not fabricated from the client clock. The information symbol is decorative, while the explanation is real readable text; it requires neither hover nor a new interactive tooltip.
- Actual shared SummaryCards template renders the hint in the current card. Its existing print styles hide decorative icons and preserve the full explanatory hint. Both SupplierStatementComponent.summaryCards and SupplierBalancesSummaryComponent.statementCards inherit this through their existing helper call. No new shared component/markup/style/API, popup, dependency or per-screen presentation fork is needed. No reusable rule was added, so no canonical/skill/generated packet change is needed.
- Suppliers guide adds bilingual explanation under `/SupplierStatement` and the `/SupplierBalancesSummary` dialog, covering cutoff, difference from ending balance, future accounting dates versus payment due dates, refresh/date and print. The same registered GuideReader/menu `/UserGuide/suppliers` remains.

### Mandatory gate delta and performance

Existing report cache source and loading matrices above remain the actual source baseline: no new HTTP/lookup/cache/watch source or subscription is introduced; the direct financial Statement GET remains uncached with its existing lifecycle. The known body-dialog progress findings remain recorded and are not claimed fixed by this calculation-only change. The standard shared route/host/panel, summary card width/density/layout, internal scrolling and print release are unchanged; a longer caption/hint needs owner visual acceptance at the existing desktop/narrow/RTL/theme breakpoints.

The correctness change adds **one sequential SQL aggregate boundary per Statement request**, including the balances drill-down: prior6/7 materializations become7/8 without/with a fromDate. This is source boundary counting, not measured SQL traffic or elapsed time. Only a scalar is returned; no extra history graph/array, per-row query, cache or parallel EF work is added. Reuse the report's existing tenant/partner/account/journal/date query and the index proposals/coverage in the performance section above; no additional index is justified by this single SUM without actual plans/cardinality. Preserve nullable IsDeleted and historical account semantics. No index/schema source changes and no migration. Owner compares the same supplier/history/filter/cold-warm dataset, captures query plan/IO/aggregate duration and total response time before/after, and verifies unchanged period rows/totals. No latency improvement is claimed.

## Authorized loading follow-up — 2026-10-26

The later owner request to unify JV loading in Customers/Suppliers/startup authorized the focused changes recorded in SHARED_LOADING_UNIFICATION_FEATURE_REVIEW.md and its Frozen UI handoff. F1's unowned interceptor releases were removed; F2's statement drill-down now uses local StateMessage/Retry with table/button suppression and local finalize, no hidden global count; F3's shared EditorDialog saving state now renders foreground StateMessage while preserving paired global write ownership and navigation safety. Supplier detail reads likewise retain one local status without hidden global count; auxiliary lookup batches have one shared status. Source conformance for these loading findings is reconciled; runtime overlap/stacking/visibility remains owner-pending. This supersedes their earlier current-source status, without rewriting the original audit evidence. F4–F7 and prior financial/business questions are not claimed fixed by this loading task. Existing cache/performance/index evidence remains applicable; no new backend/query/schema change belongs to this follow-up.

### Scoped changes and verification

Backend files: `SigmaBackend/SiGma.Business/Services/SupplierServices/SupplierService.cs`, `SigmaBackend/SiGma.Helpers/Reports/CustomerReports/SupplierStatementResponseDto.cs`, `SigmaBackend/SiGma.ServerAPI/Documentation/SupplierController.xml`.

Frontend files: `SiGmaAngularFrontEnd/src/app/modules/Suppliers/SupplierStatementOfAccount/models/list.ts`, `SiGmaAngularFrontEnd/src/app/modules/Suppliers/shared/supplier-statement-view.ts`, `SiGmaAngularFrontEnd/src/app/modules/i18n/vocabs/en.ts`, `SiGmaAngularFrontEnd/src/app/modules/i18n/vocabs/ar.ts`, `SiGmaAngularFrontEnd/src/app/modules/UserGuide/content/suppliers-guide.ts`. Pre-existing Receipts/CustomerDeposit vocabulary changes remain untouched; only the SupplierStatement title/hint belongs to this task.

Documentation: existing contract amendment, this reconciliation section and reviews/INDEX.md. Phases0/1/2/5/6 apply proportionally to this single read-rule change; editor/write/domain-transition phases are not implementation scope. No screenshot supplied. No subagents used for this small sequential producer/consumer change.

Static verification: reviewed complete scoped diffs separately in the verified frontend/backend repositories; TypeScript syntax parse of helper/model/guide/EN/AR succeeded. AST inspection located the title and new hint exclusively at data.supplierStatement in both vocabularies, with matching date placeholders; no customer translation change remains. Shared icon/hint input types and date helper signatures match the implementation. C# DateOnly uses the owning net10 Helpers project's implicit System imports; existing Business→Helpers reference and cancellation/SumAsync pattern remain. No new or moved type. Diff whitespace and scoped conflict-marker checks are clean; XML well-formedness is checked separately. Syntax/source inspection does not establish compilation.

Source reasoning example (not executed test): a posted September credit10000 and October debit2000 give September ending−10000/Cr and today's current−8000/Cr. An accounting entry tomorrow is excluded from current, even when the selected report extends into the future; a posting anywhere in today is included. A past selected end date cannot truncate current, a future end date cannot widen it, no eligible rows returns zero under the existing EF SUM pattern, and deleted/voided/unposted rows remain outside the shared eligible population. Report-type Outstanding does not turn the current ledger net into a due-only calculation.

Owner acceptance pending: past/today/future date ranges; entries at midnight/end-of-day/tomorrow; server calendar/timezone configuration; no rows; negative/positive/zero signed balances; draft/voided/deleted entries; future payment due date; same value/date in both statement surfaces; refresh across calendar-day change; explanation wrapping/visibility with all cards, light/dark/LTR/RTL/narrow layouts, keyboard reading and complete print. Deploy compatible backend/frontend together for the additive as-of date. No builds/tests/lint/browser/database/migration/commit/push/deployment were run.

Suggested commits (suggestions only): backend `fix(suppliers): calculate current balance through today`; frontend `fix(suppliers): explain the dated current balance`; documentation `docs(suppliers): record current balance cutoff decision`.
