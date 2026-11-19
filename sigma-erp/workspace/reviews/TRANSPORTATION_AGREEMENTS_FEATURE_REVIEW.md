# مراجعة وتنفيذ اتفاقيات النقل

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | 2026-10-27 |
| الحجم | M — شاشة واحدة بعقودها المباشرة |
| العقد | [العقد المجمد](TRANSPORTATION_AGREEMENTS_DOMAIN_API_CONTRACT_FREEZE.md) وتعديلاته A1/A2 |

## Manifest and authority

Request: review TransportationAgreements and apply required corrections. Root
traced `pages/routing.ts: TransportationAgreements` →
`transportationagreement.routes.ts` → `TransportationAgreementsComponent` →
`DetailsComponent`. UI screen01 (one owned schedule collection, no posting or
totals); backend pattern2. Approved references: Workshop/Job list shell;
shared EditorDialog, ReferenceLookupBindings/Status, EditableRows/Table;
PurchaseOrderService and base tracked ownership helpers. Existing guarded
create/view/edit compatibility URLs are retained under the same modal host.
No screenshots, video or additional requirements supplied. No missing business
decision is silently inferred. Existing daily/weekly figures remain display
previews, amount pricing and schedule-generation policy unchanged.

Scope: frontend Transportation/TransportationAgreement, its transportation
user-guide topic; backend agreement service/interface/controller/maps/DTOs and
direct localized messages. Other Transportation screens, invoice/generation
policies, standalone item APIs, shared providers/styles and references excluded.
Both repositories contained substantial unrelated user changes before work;
target feature files were clean. Backend localization files may contain existing
changes; only added agreement keys belong to this task. No unrelated edits reverted.

Initial recipe `-Check`: all eight packets OK. Phases00/01 discovery/freeze,
02 list,03 detail/write,04 close/delete,05 integration and06 reconciliation
apply. PLAN00 unnecessary: bounded corrections retain existing business/schema;
approval/posting/upload/stepper phases are not applicable. Packets read only
after drift check; shared-owner/reference roles compared with current books.

## Confirmed findings and disposition

| Finding | Source evidence before correction | Target/result |
|---|---|---|
| Oversized list graph and broken display-alias filtering | GetManyWithNavigationsAsync included Items and both locations plus full Customer/Driver/Vehicle detail VMs; grid uses scalar aliases | Scalar list projection; same projected fields filter before count/page; no child list payload |
| Generic detached update loses retained ownership/state | UpdateAsync validates only optional header references then base.UpdateAsync | Tracked full-snapshot reconciliation, reject duplicate/foreign child IDs, retain IsExtra/no/audit |
| Frontend-only closed edit restriction | UI hides edit when IsClosed; API generic update did not check it | Server closed guard under participating write lock |
| Incomplete boundary validation | Optional IDs skip checks, no all-distinct branch or time/rate checks | Required positive IDs, valid day/time/rates/notes; every distinct branch belongs to live tenant |
| Parent-only deletion | Inherited RemoveAsync does not remove Items | Dependency-aware owned-child soft delete, one save |
| Close unsafe retries/state scope | Root by id, append extras without closed check | Tenant/live root, safe repeated close, validated extras and shared existing lock |
| Reference live adoption absent | Finite getSelectList only; copied arrays never watched | Successful finite bootstrap then once-bound shared watches for eligible sources |
| Duplicate or hidden progress | Filter control spinners, list table/search progress plus page; dialog detail global counter plus local read indicator | Page initial/list/output/action owner; single local editor read owner; shared public suppression |
| Focus and source readability | focusOnShow false without initial focus, compressed statements | Shared close-button focus target and readable touched methods |
| Trip amount cannot be entered | Every mode rendered amount as a span; new rows seed0 and no calculation assigns it | Editable signed amount through shared numeric widget, required/finite feedback, View read-only |
| Empty bootstrap/context completion | Cache reset may complete a finite source without next; forkJoin then skips result handling | defaultIfEmpty(null), context-version fencing, cancel/reacquire finite lookup batch and clear previous-context options |

## Grid, filters and write reconciliation

Grid after Actions: `no`, `customerName`, `customerCode`, `vehiclePlateNo`,
`driverName`, `startDate` (date), `ratePerMonth` (money), `ratePerTrip` (money),
`isClosed` (status/boolean). ListVM: `Id`, `No`, `CustomerName`, `CustomerCode`,
`VehiclePlateNo`, `DriverName`, `StartDate`, `RatePerMonth`, `RatePerTrip`,
`IsClosed`. Only additional field is action identity Id. Removes list Items,
all nested detail objects/foreign IDs, weekdays, notes and inherited plumbing.
Details keep their consumed nested reference label shape independently.

| Filter control | Angular / serialized Filters[key] / server key | Type and default |
|---|---|---|
| Agreement number | agreementNo | Trimmed string, No/Id contains |
| Date range | fromDate / toDate | Local calendar date, current month initially; restored clear retained; inclusive end day |
| Status | status | 1 open/2 closed/null all; legacy isClosed compatibility retained |
| Customer | customerId | Nullable positive identity; null omitted |
| Driver | driverId | Nullable positive identity; null omitted |
| Plate | plateNo | Trimmed contains string |
| Column menus | grid | Shared encoded whitelist over the actual scalar response |
| Page | pageNo / pageSize | ≥1 and1–100; descending Id; count before page |

Search snapshots filters. Paging/Refresh/Excel/Report reuse applied filters;
draft filter edits do not silently change export membership. Shared
fetchAllPages obtains all pages at100 and fails the whole output on any failed
envelope/transport, with composedReadErrorMessage. Printing uses the existing
ReportPrintService session and print flow; no new print owner or local CSS.

| Editor group | Detail/form/request | Ownership and validation |
|---|---|---|
| Header | startDate; customerId; driverId; vehicleId | Valid date, required positive Int32 identities; server checks tenant/live |
| Rates | ratePerMonth/ratePerTrip | Finite/nonnegative client, decimal/nonnegative server |
| Weekdays/notes | Seven bools, optional notes | Bool input; notes≤2000 |
| Schedule | Full items{id?,tripTimes,pickUpLocationId,dropOffLocationId,amount} | New0/omitted id; retained owned live id; required time within day and both branch IDs; amount retains current signed decimal contract |
| Read-only | no, IsClosed, IsExtra, reference labels; daily/weekly preview | Never sent as client state/tenant/audit or saved derived totals |

No minimum row count is invented. An empty snapshot clears owned rows. Retained
extra-trip rows keep server IsExtra during edit. Save disables input, owns one
success toast through the mutation interceptor, preserves draft on both failure
channels, then closes and refreshes only after success. Shared discard and row
remove confirmation preserve cancelled drafts; page/deep-link guards retained.

## Action and reference coverage

| Action | State / endpoint | Contract |
|---|---|---|
| View/Print | Any live agreement; GET GetById/{id} | Fresh scoped detail; no edit-only lookups for View |
| Create/Edit | POST/PUT root | Edit only open; tracked owned full snapshot and authoritative boundary validation |
| Close | Open → closed; POST CloseAgreement {agreementId,extraTrips?} | Shared confirmation-only UI; optional legacy extras remain API-compatible; repeated closed no-op; refresh on success |
| Delete | Live root; DELETE ?id | Shared delete confirmation; inspect current dependencies; owned-child soft delete; refresh current page |
| Remove row | Editable draft | Shared EditableRows; save snapshot persists removal |

Canonical reference domain actions that require purchasing-only states
(Approve/UnApprove/Reject, receipt/bill progress, conversions, allocations,
down payments and journal actions) are Not Applicable: this model has only
IsClosed and no approval/posting/source-quantity aggregate. The current close
slice is Supported end-to-end; no reference action silently omitted. The app
has AuthGuard/authenticated controllers and no permission mechanism. Create,
edit, close and delete are authorization candidates; hidden buttons are not security.

## Conformance evidence

| Concern / book | Actual producer/shared reference → target consumer | Compared source contract |
|---|---|---|
| Width/scroll UI1 | styles.scss .sigma-route-host → list component host → .sigma-list-page/.sigma-list-panel/.sigma-list-table → DataTable fill | display:block,min-width:0,height100%,overflow:hidden; column panel flex; rows own grid scroll; no attached local geometry stylesheet |
| Title/filter UI3/4 | Workshop Job list + FeatureTitle/FilterPanel → agreement list template | Title inside card; stable full-width filter panel, reset, field tracks and action slot |
| Grid UI5/6/8 | DataTable + list-query → columns/getList/getAllList | Display-only scalar whitelist; fixed pager; complete applied export; showLoadingIndicator=false while busy retained |
| Modal UI13/15 | EditorDialog public contentPadded/mode/closeDisabled/height → Details template | Same create/edit/view; title and muted record subtitle; bounded body and one sigma-editor-scroll; shared close focus target |
| Children UI14/19 | EditableRows/EditableCollectionTable/FieldError → typed items | Stable row identities,200px location columns, shared add/remove/validation; no custom table skin |
| Controls UI16/17/27 | Installed Select/DatePicker/InputNumber and shared adapters | optionDisabled metadata, local date/time helpers, quantity adapter, shared focusField; no experimental API introduced |
| Cache UI2 | BaseService/ReferenceLookupCache → finite bootstrap + ReferenceLookupBindings | Watch only after success; selected/current rows and context clear; no form patch from watch |
| Errors/loading UI22/28 | Shared Status/LoadingService/interceptors → actual list/detail/save/output callbacks | Single feedback owner per failure, paired release/teardown, query-only URL updates retain active reads |

Shared presentation remains source-owned: no feature palette or shared CSS
override. Responsive source chain uses shared page inset20px /12px below992;
editor field grid4 tracks,2 below1024,1 below700; dialog94vw below1099 and
viewport-minus16 below767. Editable table owns horizontal overflow for the
fixed location tracks. Check empty/loading/error/populated, long EN/AR labels,
validation, sidebar open/closed, both themes/directions at those boundaries
and intermediate widths. These are source facts; visual geometry is pending.
Angular21 declarations and installed package contracts inspected; signals,
typed forms, standalone imports, existing ViewChild and Zone setup retained.
No broad OnPush/zoneless/Signal Forms migration is warranted by this correction.

## Mandatory source/cache matrix

| Exact source suffix / envelope | Classification and producer/writers/topic | Actual consumer lifecycle and final source evidence |
|---|---|---|
| Customer/GetSelect / Results<DropDownSelect> | Approved cache via CustomerService.cacheSelect; Company/IndividualPartner typed+inherited writers declare Customer dependency; imports savedRows>0 refresh; topic lookup-customers maps Company/IndividualPartner | List.loadLookups and Details.loadLookups successful finite reads then bind customers; selected ID/current arrays; destroy teardown; cache resets clear arrays; no draft writes |
| Driver/GetSelect / Results<DropDownSelect> | Direct reference, DriverService inherits cacheSelect=false; no watch/topic added | Finite list/editor read in forkJoin; both failures visible, Retry; saved selected label merge, no cache eligibility assumption |
| Vehicle/GetSelect / Results<DropDownSelect> | Approved ordinary labels, VehicleService.cacheSelect; typed/inherited mutations invalidate; positive savedRows import invalidates; topic lookup-vehicles | Editor finite success then bind vehicles with selected/current getters and disableRetainedOptions=true; availability not inferred |
| Branch/GetSelect / Results<DropDownSelect> | Approved BranchService.cacheSelect; typed/inherited mutations invalidate; topic lookup-branches | Editor locations success then one watch for pickup/dropoff IDs from all current rows; selected labels retained disabled; context null clears arrays |
| TransportationAgreement root/GetById / Results<scalar> or Result<detail> | Direct operational list/detail; no source opt-in | switchMap/defer/finalize list; fresh identity-checked detail; complete export finite requests; no caching of live state |
| Status/weekdays | Local constants, no URL | No cache/writer/watch requirement |

Eligible watch requests retain matching inline-error identity. Shared binding
applies only fresh successful snapshots; selected labels survive an empty
success; context reset explicitly clears without merging detail labels back.
Refresh failure retains usable arrays and inputs; shared Retry targets failed
sources. Initial bootstrap failure keeps required Save gate/Retry; successful
retry binds once. Retained revalidation is silent and never patches a form or
recalculates rates. Root shared cache owns scope, expiry, coalescing, tenant
notifications/rejoin and final teardown, with its existing delivery limitations.

## Mandatory loading request matrix

| Operation / consumer | Visible owner | Lifecycle / recovery |
|---|---|---|
| List initial/Search/page/Refresh; getList | Page shell | defer start, switchMap cancellation, finalize end, destroyed teardown; false/HTTP failure visible, Refresh retries |
| List initial customer/driver options | Same page shell via ReferenceLookupStatus | loadingLookups finite forkJoin/finalize + binding.loading lease; no Select/search spinner; shared errors/Retry |
| Modal detail; getDetail | Local ReferenceLookupStatus → StateMessage | loadingDetails/finalize and identity guard; no hidden global count; error/Retry independent |
| Modal options and cache without snapshot | Same local Status, inherited EditorDialog dialog scope | loadingLookups/referenceLookups.loading; pending tail remains visible with error; Retry deferred until settled |
| Save | Global LoadingService + shared EditorDialog foreground progress precedence | saving start/finalize; frozen form/navigation; one visible foreground shared owner; inline failed draft retained |
| Close/Delete | Page shell | confirmed mutation start/finalize, duplicate/write guards; inline error and refreshed page on success |
| Excel/Report data reads | Page shell | exporting start/finalize, complete-output errors; no partial output |
| Retained reference revalidation | Silent screen, existing shared header activity | Shared binding loading=false with retained successful data; failed refresh Retry; no new visible owner |

Effective route has no showPageLoading=false metadata; Layout
showPageLoading defaults true and renders .sigma-shell__loading/StateMessage.
LoadingService separates lookup leases from request counters and compares parsed
UrlTree roots: same-path query/fragment writes retain progress, actual departure
resets counts and destroys leases. EditorDialog providers set dialog scope;
its shared saving foreground and shared overlay precedence suppress covered
shell loading. Runtime overlap/timing/visibility remain pending.

## Performance, query and index evidence

List source before: Count plus page materialization with Items/pickup/dropoff,
Customer/Driver/Vehicle graph and oversized mapped VMs. After: count and scalar
page projection only,1–100 root rows, stable descending Id, same screen/grid
filters before both. No list child read or per-row enrichment. This proves
source data-volume reduction, not measured SQL commands or elapsed speed.
Detail now uses exactly two source materializations: one scoped header/reference
projection and one ordered live-tenant owned-line projection. Header reference
validation uses three shared FK existence reads and one all-distinct branch
count for the entire batch, rather than per-line branch reads. The existing
CodeCreateService resolver uses its ticks fallback for both this aggregate and
its internal lines before reading settings; no per-child settings query or
number-policy cache was introduced. Runtime SQL counts remain unmeasured.
View avoids four edit-only lookups; edit hydrates saved detail before the finite
four-source option batch so retained labels are available before watch mount.
Page customer and editor customer use the same approved shared source/feedback
identity; Driver remains direct, so reopening intentionally re-reads it.
Export intentionally issues ceil(total/100) page requests with repeated counts;
no unbounded per-page child response. No complete-output schema or endpoint
invented to reduce calls. Writes batch distinct location checks and save one
tracked aggregate; existing UnitOfWork numbering/audit pipeline retained.

| Physical table/query | Existing source evidence | Proposed index and hypothesis | Cost / verification / disposition |
|---|---|---|---|
| TransportationAgreement tenant/live + StartDate range + Id order | Config ToTable; current snapshot PK Id and single CustomerId/DriverId/VehicleId indexes; no tenant/date composite declaration | Nonunique keys (SubscriptionId,StartDate,Id DESC), INCLUDE(IsDeleted,IsClosed,CustomerId,DriverId,VehicleId,RatePerMonth,RatePerTrip), no filter | May bound typical monthly tenant reads; range may still sort Id; include width and insert/update cost. Compare actual plan/IO/selectivity before choosing; proposal only, no EF/index change |
| TransportationAgreementItem detail owner/live/tenant | Snapshot existing IX on TransportationAgreementId, plus pickup/dropoff FKs | No new index justified without child-count/plan evidence; existing parent FK narrows one aggregate | Avoid duplicate parent-prefix index; inspect residual live/tenant predicates on representative large aggregate |
| No/Plate contains | Contains and Id text compatibility are not ordinary prefix seeks | No speculative B-tree per text filter; No is nvarchar(max), not a safe key proposal | Preserve semantics; investigate actual workload before any separate search/schema design |

No filtered index proposed because live reads use IsDeleted!=true and nullable
legacy rows must remain included. Deployed index/statistics state unknown.
Owner timing plan: same build/API/database/tenant, record agreement/item counts,
current-month filters and page20/100, cold and warm approved cache, five repeats
each; capture initial usable/settled content, Search/page/View/Edit/Save and
complete export separately, HTTP count/bytes, SQL commands/reads/plans and render
duration. Compare same rows/counts/guards, include empty/large page and errors/
cancel/Retry. Goal: preserve result parity while removing list child payload and
per-child reference reads; no universal latency target was agreed. All measured
before/after timings and SQL-plan acceptance remain pending owner execution.

## User guide and final handoff

Updated existing `UserGuide/content/transportation-guide.ts`, agreement topic
route `/TransportationAgreements`; reader already registers
TRANSPORTATION_GUIDE at `/UserGuide/transportation`, and module sidebar already
links that guide. EN/AR topics cover prerequisites, applied filters, create/view/
edit, weekday/trip rows, rates/notes, close/delete, full export/report/print,
closed state, required lookup Retry, silent refresh and preserved drafts.
No duplicated reader/menu created. Runtime reading/print/RTL acceptance pending.

Shared-extraction result: existing ReferenceLookupBindings/Status, editable
collection, state/error/date/focus/query owners cover the repeated mechanisms;
no competing wrapper/cache created. The inherited GridFilterProjection already
uses AutoMapper ProjectTo, so the redundant feature override was removed and
the profile is the single scalar projection owner, including displayed fallback
IDs and tenant-safe labels. The reusable empty-completion bootstrap guidance
was promoted to UI2 and the execution skill with a2026-10-27 revision row.
The generator refreshed PLAN00 and PHASE00–06; final -Check passed all eight.
Semantic review checked the changed UI2 provenance hash and cache/readiness/
Retry clauses against the owning block; reference roles and templates unchanged.

Agents: root froze contracts and owns details/guide/integration/reconciliation;
sol_worker owns backend; terra_worker owns list+models. Two bounded independent
file sets reduced wall time after freeze. Older mapped models unavailable in
orchestrator, so both inherited root model. No overlapping edits or ownership
conflict. Root reviews both outputs; agents do not close the feature.

## Final reconciliation

| Path | Final source evidence | Result |
|---|---|---|
| List/grid/filters | Controller inherits GET → GetManyAsync → ApplyListFilters → inherited GridFilterProjection/AutoMapper → GridFilter.Apply → Count/Id page → scalar DTO/grid | Source matched; all displayed aliases including fallback values filter before count/page |
| Detail | DetailAsync two no-tracking projections → numbered/lean agreement-specific detail VMs → independent frontend details.ts → fillForm | Source matched; no standalone item DTO altered |
| Save | API DataAnnotations → InvalidInputAsync header-only/shared FK checks + AllExistAsync Branch batch → tracked OwnsAll/ReconcileOwned → one SaveUpdateAsync | Source matched; no detached graph replacement, closed guard, no client tenant/no/state |
| Extra state/close | Dedicated close/extra DTOs, validation resources, existing tenant/type lock, scoped FindById, closed no-op and one tracked save | Source matched; excludes standalone child writers from concurrency claim |
| Delete | Existing RemoveWithChildrenAsync/MarkRemovedAsync root dependency check and Items soft-delete | Source matched; no current inbound reference exists to an item; future child references need their own guard review |
| Loading | List/query/global counts; Status page lookup lease; modal inherited dialog scope; EditorDialog saving foreground; src/index.html shared covered-host suppression | Source matched; runtime overlap/visibility pending |
| Reference lifetime | loadLookups successful bootstrap, separate bind; defaultIfEmpty null failure; contextChanges cancels batch/clears arrays/version-fences/reacquires; detail stale response ignored during reset; selected draft values untouched | Source matched; no old-context detail merge from watch |
| Focus/amount | Pristine pending read can close/cancel, enabled shared close target receives initial focus; writes/dirty pending Retry remain guarded; signed editable amount and invalid focus id | Source matched; keyboard/runtime pending |
| Translations |78 directly referenced feature/shared keys found in both EN/AR; ten backend agreement keys in both parsed XML resources | Source matched; no duplicate agreement resource key |
| Guide | Existing agreement topic in transportation guide updated EN/AR, same reader/module sidebar route | Source matched; owner reading/print/RTL pending |
| Type inclusion | New backend types share SiGma.ViewModels.ViewModels.TransportationAgreement namespace; service/controller/interface/profile import it; SDK default compile inclusion and existing ViewModels→Helpers/Business→ViewModels references inspected | Source matched; not a compilation claim |

### Override audit

| Method | Feature-specific reason |
|---|---|
| GetManyAsync | Count and page the scalar projection without generic recursive navigation materialization; retain legacy nullable-live scope |
| ApplyListFilters | Actual agreement/date/customer/driver/plate/status predicates |
| DetailAsync | Two bounded projections with the consumed historical labels/live owned lines |
| AddAsync | Header plus batched distinct location validation and one aggregate save |
| UpdateAsync | Participating write lock protects the state read against close/delete |
| UpdateCoreAsync | Tracked owned full snapshot, saved identity/state/reference validation |
| RemoveAsync | Same write lock and owned-child dependency-aware soft deletion |
| GridFilterProjection | Inherited; profile already owns the exact scalar projection; removed duplicate override |
| Controller GetListAsync | Inherited; removed redundant custom navigation-list delegation |

Root reviewed the scoped source diffs separately in both application
repositories, including the agent outputs, new type declarations, maps,
resources, routes and direct consumers. Resource review covers this task's
added keys; preexisting unrelated resource edits were preserved. Syntax-only
TypeScript and Angular template parsing passed; whitespace checks passed;
merge-marker/stale-import/type/route searches completed. No compilation,
tests, lint, runtime/browser, database, migrations, commits/push/deployment run.
No entity property/nullability/configuration/index/snapshot change: no owner
Add-Migration required. Index candidate above remains a proposal only.

### Files changed

- Frontend: TransportationAgreement `components/list/list.component.ts/html`,
  `components/details/details.component.ts/html`, `models/list.ts`,
  `models/details.ts`; `UserGuide/content/transportation-guide.ts`.
- Backend: `SiGma.Business/Services/TransportationAgreementService.cs`,
  `IServices/ITransportationAgreementService.cs`,
  `MapperConfig/TransportationAgreementProfiler.cs`;
  `SiGma.ServerAPI/Controller/TransportationAgreementController.cs`;
  `SiGma.ViewModels/ViewModels/TransportationAgreement/TransportationAgreementAddVm.cs`,
  `TransportationAgreementUpdateVm.cs`, `TransportationAgreementDetailVm.cs`,
  `TransportationAgreementListVm.cs`; removed unused
  `TransportationAgreementFullListVm.cs`.
- New backend types in that same ViewModels folder:
  `TransportationAgreementClose.cs`, `TransportationAgreementExtra.cs`,
  `TransportationAgreementLineAddVM.cs`, `TransportationAgreementLineUpdateVM.cs`,
  `TransportationAgreementLineDetailVM.cs`,
  `TransportationAgreementNamedReferenceVM.cs`,
  `TransportationAgreementDriverReferenceVM.cs`,
  `TransportationAgreementVehicleReferenceVM.cs`,
  `TransportationAgreementValidationMessages.cs`.
- Backend resources: `SiGma.Helpers/Localization/Shared/GeneralMessage.resx`
  and `GeneralMessage.ar-SA.resx` (agreement additions only).
- Documentation: this review, frozen contract, reviews index, execution skill;
  canonical UI2 and its eight generator-owned dependent packets.

### Owner verification and remaining risks

1. Run frontend/backend builds and relevant tests; source syntax is not type/
   template compilation or AutoMapper/EF validation. Verify projected driver
   concatenation/fallback filters translate to SQL and date9999 end-day handling.
2. Exercise open/create/edit/view/deep links, amount entry/clear/negative, child
   add/update/remove/empty snapshot, invalid/foreign/deleted refs, closed update,
   missing/repeated/parallel close with extras, and delete of owned lines.
3. Inject unsuccessful envelopes, HTTP failures, empty source completion,
   context reset midway through each bootstrap/detail phase, cached refresh
   failure, empty-success, TTL/tab return/rejoin and destroy. Verify Retry,
   pending-tail progress, context-cleared labels and unchanged drafts.
4. Verify modal focus/trap/return and closing a pristine pending read; dirty
   cancel/retry and mutation navigation remain protected. Validate report/Excel
   membership/count and complete print flow across the responsive/theme matrix.
5. Measure cold/warm request bytes, SQL command/IO/plan and latency under the
   comparable plan above. Confirm existing application-lock support/contention;
   participating writes serialize per tenant/type, standalone child writers
   remain excluded. No measured speed improvement is claimed.

No unresolved Missing/Conflicting/Uncertain business decision blocks this
bounded source implementation. Other Transportation scheduling/billing behavior
and legacy child API lifecycle remain excluded, with no new promise of approval,
invoicing or finance effect. Deploy both changed API and frontend contracts
together; external consumers of the former oversized list require coordination.

Suggested commits (suggestions only; stage only the files above):

```text
SiGmaAngularFrontEnd:
fix(transportation-agreements): align editor and list contracts

SigmaBackend:
fix(transportation-agreements): guard aggregate writes and reads

Documentation repository (canonical book/generated packets):
docs(ui): clarify required lookup bootstrap recovery
```

The workspace reviews/skill remain local records under the existing instruction
layer ownership boundary; this task did not move repositories or commit files.
