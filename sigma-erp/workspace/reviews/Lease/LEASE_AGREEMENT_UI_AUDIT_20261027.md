# Lease Agreement UI source audit — 2026-10-27

Read-only contribution to `reviews/LEASE_FULL_STACK_REVIEW.md`. The root owns the module result, backend audit and shared wiring/guide reconciliation. No application, configuration or instruction file changed; no build, test, lint, browser, database or migration command ran.

## Scope and authority

The active `LeaseAgreement` lazy route imports `LeaseAgreement_Routes`; its list and routed Create/View/Edit all belong to `modules/Lease/LeaseAgreement`. `closedLeaseAgreements/closedleaseagreements.routes.ts:2–9` imports **these same components** and supplies `closedOnly`/`listRoute`. The copied old closed-agreement components are not active evidence.

This is the Agreement slice of the root's tier L read-only audit, with its fixed contracts and passing all-eight-packet entry check. Read workspace AGENTS, the current screen skill, current README/catalog and screen02/screen09 routers, Master1/3/4/5/7, UI1/2/6/13/15/16/21/22/28/29/30 and the current Phase06 packet. The current shape is routed aggregate editor plus action dialogs; UI list/editor references are Workshop Job's list/editor and shared EditorDialog/EditorTabs. The actual references were inspected; their own historical loading omissions do not override current UI22. The UI backlog39 already covers generic private list-state/enum/status styling debt; that is not reported as a newly discovered Agreement defect.

The active Agreement freeze and separate delete, void, delivery-date, deposit, payment-instructions and log contracts were compared. Old Missing-action rows and stale-packet statements in the August main freeze are historical where later action contracts and current source supersede them. No new business decision or API shape was invented.

Paths below are relative to `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/`, except explicit backend/style/review paths.

## Confirmed findings

### A01 — P1: A failed tariff preview can silently replace the saved prices with zero

Source: `modules/Lease/LeaseAgreement/components/details/details.component.ts:987` and `:1003`; save gate `:652`, payload rate `:706`; default catalogue `models/details.ts:24`.

Both false-envelope and HTTP failures replace every booking charge with the zero-rate default catalogue, retaining selections only. Once finalization releases `loadingTariff`, Save and its template disable condition do not check `tariffError`. A transient preview failure followed by recovery of the backend tariff read therefore permits saving those zero inputs without an explicit decision to change prices. This is not protected by authoritative server totals: the narrow related source check at `SigmaBackend/SiGma.Business/Services/AgreementServices/LeaseAgreementService.cs:3782` takes `RoundMoney(input.Rate)` and at `:3791` computes the total from that supplied rate. The server can successfully recalculate **zero**, rather than restoring the tariff price.

Retain the existing draft on either failure, block ordinary Save while the current vehicle/date tariff is unresolved, and expose an explicit Retry through the existing request owner. Reconcile with the backend stream before implementation. This finding does not request changing the approved manual rate override.

### A02 — P1: Routed Agreement printing still hides the whole application root

Source: `modules/Lease/LeaseAgreement/components/details/details.component.ts:769` and `:1162`; `SiGmaAngularFrontEnd/src/styles.scss:168`; `layout/layout.component.html:1`.

Both manual Print and list-triggered auto-print add `lease-agreement-print`. Its stale modal print rule sets `#kt_app_root` to `display:none !important`. The current editor is routed inside that root, rather than portalled outside it, so the print document is hidden for current and closed-agreement View. The stale `.lease-agreement-editor-dialog` selectors further demonstrate the modal-to-route mismatch. `ReportPrintService.print` only applies classes and invokes print; it does not relocate the document.

Complete the fix against UI13/21, rather than removing just the hiding selector: `details.component.html:85` uses `@switch(currentTab())`, so three saved sections are absent from the DOM. The remaining Print would still omit Provisions, Clauses and Pre-Termination (or omit Detail when another tab is active). Retain all applicable saved sections for printing through the shared print-flow ownership, independent of active tab, and preserve on-screen tab behavior.

### A03 — P2: Approved cached sources lack mounted-consumer revalidation and context clearing

Source: list `components/list/list.component.ts:733–763`, editor `components/details/details.component.ts:1098–1145`, Deposit `components/deposit/deposit.component.ts:342–367`, Vehicle Replacement `components/vehicle-replacement/vehicle-replacement.component.ts:213–239`, Closing `components/closing/closing.component.ts:302–343`.

These consumers finish finite reads but never bind the approved sources' separate `watchSelectList` streams. Branch/Customer/Vehicle/Country/PaymentMethod cache owners already opt in, invalidate on successful source writes and receive registered tenant topics. Their invalidation can refresh the shared source while these mounted option signals remain stale; an explicit context reset also has no consumer path to clear the existing arrays. No retained-data refresh error/Retry is visible because no watch exists.

The editor additionally maps raw choices to `{key,value}` only (`details.component.ts:1193`), has no selected-label merge/current-option getters and its detail DTO contains identities without corresponding display labels. A historical identity omitted by a fresh lookup therefore loses its visible name in View/Edit. Adopt the real shared bindings after successful finite bootstrap, preserve selected values/drafts, disable retained unavailable editor options where the source contract excludes them, and clear options on null context without merging old-context labels. Historical list-filter selections retain the shared default enabled behavior. Do not opt the other direct sources into cache as part of this repair.

### A04 — P2: Required bootstrap and tariff requests do not use the required page progress owner

Source: list `components/list/list.component.ts:733`, editor `components/details/details.component.ts:1098`, tariff `:967`; templates `components/list/list.component.html` and `components/details/details.component.html:350`.

List lookup and editor lookup forkJoins set operation flags and release them in finalize, but neither contributes to `LoadingService` nor renders `ReferenceLookupStatus`. List loading can finish while required filter choices are still pending, leaving disabled actions and no page progress. Create has no detail request to accidentally cover its required lookup bootstrap. Tariff reads similarly show a feature-local loading StateMessage instead of contributing to the one page host. Detail read itself starts/releases global progress correctly. Its local template loading branch is suppressed while the global shell host exists by `src/index.html:67–71`; it is **not** a confirmed duplicate visible indicator.

Use the shared page-default lookup-status contract for required bootstrap; pair tariff subscription/finalize with the page owner and keep request replacement, errors, Retry, disabled and aria-busy state. Dialog lookup scope remains local. Actual shell visibility/overlap remains owner-run evidence.

### A05 — P2: Deposit's prerequisite currency read silently fails, and failed payment-method details have no Retry

Source: `components/deposit/deposit.component.ts:211–215`, `:382–441`; template`:22`, `:72–75`.

The initial full Agreement detail read is used only to obtain `customerId`. It has no pending flag or visible read owner; false/HTTP errors are swallowed into null. The shared DocumentCurrency is mounted only for a non-null customer, so its own corrected error/Retry lifecycle never runs and currency stays `—` without recovery. Independently, a failed payment-method detail read sets `paymentMethodDetailsValid=false`, disabling Save, but the only lookup Retry is conditional on `!lookupsValid`. Successful initial choices plus a failed selected-method request therefore expose no Retry; clearing and reselecting is the undocumented workaround.

Keep these operational reads fresh and give each failed current context an explicit Retry using the existing dialog status owner, preserving payment-method switchMap cancellation and form state. The source-customer failure does not establish an accounting error because the payload contains no client-owned currency; it is a missing-data/recovery defect.

## Historical decision conflict — interactive paging

Source: `components/list/list.component.ts:136`, `:185`, `:487`, `:955`; `reviews/LeaseAgreement/LEASE_AGREEMENT_CONTRACT_FREEZE.md:76`.

The August feature contract requires exactly five rows and `[5]`, unaffected by lazy/API metadata. Current source uses the newer shared default and exposes `[10,15,20,50,100]`, accepts lazy page-size changes and restores those alternate sizes. The root classifies this as a historical contract reconciliation item, **not an additional confirmed current defect**: the record needs a traceable owner amendment or confirmation before changing current paging. Export's bounded 200-row batches are separate and remain valid.

## Cache source matrix

All URLs are relative to `environment.baseUrl`; ordinary choices return `Results<DropDownSelect>`. Repeated consumers share the exact same source identity; caching eligibility is source-owned.

| URL/service and actual consumers | Classification and producer | Finite/watch/selected/context/failure disposition |
|---|---|---|
| `Branch/GetSelect`, BranchService — list, Deposit, Vehicle Replacement, Closing | Approved cache; `cacheSelect=true` at source`:16`; typed create/update and inherited writes invalidate; `lookup-branches` tenant topic | Finite forkJoin + DestroyRef; initial failure/Retry present. No mounted watch/context clear or selected-retention seam: A03. |
| `Customer/GetSelect`, CustomerService — list/editor | Approved cache; source`:9`; Company/IndividualPartner declare Customer dependency and successful typed/inherited writes invalidate; positive Company/IndividualPartner imports invalidate; `lookup-customers` | Finite + DestroyRef; initial false/HTTP feedback/Retry. No watch/context/selected-label handling: A03. |
| `Vehicle/GetSelect`, VehicleService — editor | Approved ordinary identity/PlateNo cache at source`:19`; typed Create/Update/Delete and positive import invalidation; `lookup-vehicles`. This is not availability. | Finite + DestroyRef; initial error/Retry. No watch/context/retained option metadata: A03. Vehicle Replacement's outgoingVehicles are instead direct operational context. |
| `Country/GetSelect`, CountryService — Vehicle Replacement | Approved cache at source`:16`; typed/inherited writes invalidate; `lookup-countries` | Finite + DestroyRef; initial failure blocks loadReady with Retry. No watch/context: A03. |
| `PaymentMethod/GetSelect`, PaymentMethodService — Deposit | Approved cache at source`:15`; createPaymentMethod/updatePaymentMethod/inherited Delete invalidate; `lookup-payment-methods` | Finite + DestroyRef; initial error/Retry. No watch/context: A03. Selected-method details remain excluded operational reads below. |
| `Staff/GetSelect`, StaffService — list/editor/Extend Rate and Period | Direct reference, no source opt-in: source extends BaseService without cacheSelect; default is false (`base-service.service.ts:19`) | Documented current direct read. Finite + DestroyRef; forkJoin false/HTTP and bootstrap Retry. No watch is required for an unopted source. |
| `Driver/GetSelect`, DriverService — editor | Direct reference, no source opt-in (`driver.service.ts:8–11`) | Finite + DestroyRef; bootstrap failure/Retry. Driver Replacement uses separate current operational context, not this source. |
| `Bank/GetSelect`, BankService — Deposit | Direct reference, no source opt-in (`Banking/Bank/services/bank.service.ts:14–17`) | Finite + DestroyRef; bootstrap failure/Retry. No new cache requirement. |
| `ReplacementReason/GetSelect`, ReplacementReasonService — Vehicle Replacement | Direct reference, no source opt-in (`replacementreason.service.ts:13–16`) | Finite + DestroyRef; initial failure/Retry; no invented cache topic. |
| `CarModel/GetMakeAndModel`, LeaseAgreementService.getCarModelOptions — editor | Direct custom reference URL, explicit HTTP at service`:86–89`, no source cache contract | Finite forkJoin + DestroyRef; bootstrap error/Retry; direct read is allowed. |
| `ClauseType/GetSelect`, LeaseAgreementService.getClauseTypeOptions — editor/Extend Rate and Period | Direct custom reference call at service`:92–95`; ClauseType source has no cache opt-in | Finite + DestroyRef; bootstrap error/Retry; do not infer caching from the endpoint suffix. |
| `SettingsCommonModel/GetMySetting`, TaxSettingsService.load → CommonSettingsService — Create/extension previews | Explicit approved singleton exception; CommonSettingsService`:15–31` uses the shared scoped cache and invalidates successful settings writes | Finite demand, no persistent policy watch rewriting drafts. Existing tax fallback/settings behavior remains unchanged; source conformance does not prove current business rates. |
| `PaymentMethod/GetById/{id}`, BaseService.getById — Deposit method contract | Direct operational detail; determines payment/bank/card behavior | switchMap cancellation + current-ID finalization + DestroyRef. False/HTTP invalidates readiness; missing Retry: A05. |
| `Partner/GetByWithNavigationsId/{id}`, PartnerCurrencyLookupService — Deposit's DocumentCurrency | Direct partner financial/display detail | Shared component cancels replaced reads, version-fences, finalizes, preserves fallback and exposes Retry. Initial Agreement-to-customer prerequisite prevents this owner mounting on failure: A05. |
| `Currency/GetFinancialNumberPolicy`, FinancialNumberPolicyService — DocumentCurrency | Explicit separate financial-policy service contract (its existing coalescing/invalidate), excluded from reference cache | Shared DocumentCurrency base pending/finalize and inherited dialog ReferenceLookupStatus. No policy watch/cache expansion. |
| `LeaseTariff/GetBookingCharges?vehicleId&startDate&endDate`, LeaseAgreementService.getTariffCharges | Direct operational price preview, no cache opt-in | Debounce/switchMap + DestroyRef; loading finalizes; failure destroys current rates/no Retry: A01/A04. |

Source owners use `BaseService.readReferenceSelect/watchReferenceSelect/invalidateSelectOnSuccess` (`base-service.service.ts:102–150`). Registered topics are visible in `reference-lookup-cache.service.ts:372–375`. Their source coherence cannot make absent consumer watches compliant. Import/topic transport details remain cross-referenced to the root's shared integration audit rather than duplicated here.

## Operational reads/actions and loading reconciliation

All Agreement controller URLs below remain direct operational reads/writes through LeaseAgreementService, with inline-error headers. No operational GET is proposed for caching.

| Trigger / URL | Subscription, progress and recovery evidence |
|---|---|
| List/search/paging `GET LeaseAgreement` | `list.component.ts:650–692`: switchMap/defer starts global count at subscription, catchError/false envelope clear grid with error, finalize releases, DestroyRef tears down. Query state is applied independently from filter draft. |
| Basic export same GET in bounded pageSize200 | `list.component.ts:504–553`,`:897`: fetchAllPages preserves applied filters/order/grid, cancels via DestroyRef and fails the complete export on a failed batch. Global count paired with finalize. No detailed-export endpoint is invented. |
| Detail `GET LeaseAgreement/GetByWithNavigationsId/{id}` | `details.component.ts:807–837`: global count paired with finalize/DestroyRef; false/HTTP loadError with Retry; form stays disabled until valid detail. Global-host CSS suppresses its local loading branch (`src/index.html:67–71`), so no duplicate visible indicator is claimed. Deposit's second use: A05. |
| Ordinary POST/PUT `LeaseAgreement` | `details.component.ts:651–759`: complete typed arrays/raw disabled controls, local calendar serialization, touched-field errors/invalid-tab focus, form disabled during Save, paired global progress, false/HTTP retains editor, successful navigation preserves list query. Tariff readiness hole: A01. |
| Documents `GET {id}/documents`, upload `POST {id}/documents/{type}` | `documents.component.ts:90–180`: local shared StateMessage + paired global read count; upload uses global count and per-row file disable/error; false/HTTP feedback, Retry initial read, tenant/path ownership is server-side. Both subscriptions finalize/DestroyRef. The body-dialog local host is visible; `src/index.html:73–85` suppresses covered shell/inline progress. No duplicate visible indicator is claimed. |
| Discounts `GET/PUT {id}/discounts`; Additional Charges `GET/PUT {id}/additional-charges`; Payment Instructions `GET/PUT {id}/payment-instructions` | Local loading StateMessage and Retry for direct reads; global count also started/released. Save has global count + EditorDialog saving overlay, dirty-close/form freeze and both failure channels; successful parent callbacks refresh the applied list. No cache watch on these operational snapshots. |
| Vehicle Replacement `GET {id}/vehicle-replacement-context`, `POST {id}/vehicle-replacements` | Fresh context and finite three-source lookup join; form disabled until all successful, loadReady gates Save, current outgoing facts come from context. Local read StateMessage plus global count. Form freeze, validation, failed-save retention and success refresh present. Reference watch omissions A03. |
| Driver Replacement `GET {id}/driver-replacement-context`, `POST {id}/driver-replacements` | Direct current drivers/state context, typed date/identity validation, dirty-close and failed-save retention; local shared read state and Retry plus paired global count; DestroyRef. |
| Extension `GET {id}/extend-context`, `POST {id}/extend`; rate extension `GET {id}/extend-rate-period-context`, `POST {id}/extend-rate-period` | Context.canExtend gates Save; typed children/raw values, form disable/dirty-close, error/Retry and parent refresh. Rate extension also reads Staff/ClauseType directly and has explicit lookupsValid. Its local loading branch tracks context only, leaving a later required dialog lookup tail without progress. |
| Closing `GET {id}/close-context`, `POST {id}/close` | Fresh context + Branch finite join, loadReady/canClose guards, typed mileage/date validation, both failures and Retry, form freeze/retention and success refresh. Local read state and paired global count. Reference watch omission A03. |
| Billing History `GET {id}/billing-history`; Log `GET {id}/logs` | Read-only EditorDialog, one local StateMessage/no table mask, Retry/empty/both failures and paired global count. Logs additionally unsubscribe on replacement/hidden input and fence selected agreement (`logs-dialog.component.ts:65–112`). |
| Delivery Date `GET {id}/delivery-date-context`, `POST {id}/delivery-date` | `delivery-date.component.ts:99–202`: contextReady guard, valid local date, dirty form freeze, failed-save retention, Retry, DestroyRef/finalize, local read StateMessage plus global count. |
| Delete `DELETE LeaseAgreement?id=...`; Void `POST {id}/void`; Deposit `POST {id}/deposit` | Row server flags, selected-row recheck after confirmation for Delete, required reason for Void; duplicate-submit locks and paired global progress. Deposit attachment tracker preserves committed/uncommitted cleanup ownership; success refreshes list after cleanup; false/HTTP retains inputs. |
| Embedded Create Receipt | List template`:250–258` supplies embedded/modal/leaseAgreementId to the real shared Receipt editor and refreshes on saved. Its internal read/write owners belong to the root's shared integration audit; old missing-receipt assertions are not reused as current evidence. |

All action components are conditionally mounted by the list (`list.component.html:225–379`), so closing destroys their subscriptions/draft; they do not persist a previous agreement's context. `EditorDialog` uses `appendTo="body"` and has its own saving overlay (`editor-dialog.component.html:16`,`:52–56`). Direct-read local StateMessages are therefore necessary and have a foreground host; global `src/index.html:67–85` chooses the visible routed/dialog progress. Writes retain their global count and dialog saving overlay. Required initial page bootstrap differs and must use the page owner (A04).

Effective `showPageLoading`, actual shell progress host and query-only navigation lifetime are the root audit's shared source responsibility. These Lease routes do not set Dashboard's silent metadata. No runtime visibility was asserted.

## Positive source gates and remaining acceptance

| Concern | Source conclusion |
|---|---|
| Route and width | Current list/editor `host.class=sigma-route-host`, then `.sigma-list-page/.sigma-editor-page` and shared panels. `styles.scss:3650–3705` owns block host, bounded full-height flex frame. Feature styles have no :host width/flex override. Editor's interior grid changes to one column at900px; it does not override the route host. Empty/loading/error/populated share that outer frame. Browser geometry remains pending for sidebar expanded/collapsed, wide/intermediate/narrow/short-height, RTL/LTR and both themes. |
| Modes and closed compatibility | Closed route restricts list actions to View, forces isClosed=true, hides Create/status filter and keeps closed return URL. Detail subsetView blocks Save/Edit. All View and server closed/voided/invoiced modes disable the complete form; main route's edit/create use canDeactivate. |
| Filters/grid/export | Numeric branch/customer/staff IDs, current-branch default/restored clear, complete local date range, true-only permanent checkbox, whitelisted sort, shared grid serialization, corrected last page and complete filtered basic export present. Historical interactive page-size contract needs owner record reconciliation, separately from confirmed defects. |
| Children and validation | Raw typed full child arrays, id retention on Update, shared EditableRows confirmations/freeze, touched FieldError/invalid tab focus and localized date/range errors. New Provision Add remains disabled with the known schedule-required explanation (`details.component.html:503–513`); no new schedule was invented. |
| Actions and feedback | Server action flags drive edit/delete/void/replace/extend/close; transient busy uses disabled, successful writes refresh applied list; Email explicitly explains unavailable delivery rather than inventing a send API. No new permission mechanism inferred. |
| Cache/loading | Source-supported direct exceptions remain direct; eligible finite reads inherit actual cache. Required consumer watch/context/retained labels and page-bootstrap adoption fail A03/A04. Source conformance is not network/visual acceptance. |
| Print | Shared ReportPrintService lifecycle is used, but actual CSS/DOM mismatch is A02. Shared service import alone is not a print pass. |

## Load-speed evidence and reproducible owner check

Source boundary inventory: list mount starts one operational page plus three parallel finite lookups; approved cache may coalesce Branch/Customer while Staff stays fresh. Edit/View start one full Agreement detail plus six parallel choice requests; Create starts those six and Common settings demand. Thus View also loads editable choices because labels are represented by disabled selects, rather than a saved label projection. Tariff triggers are debounced300ms and use switchMap. Interactive paging requests one page; full export visits bounded batches200 serially and materializes the complete export. Vehicle Replacement joins fresh context with three sources; Closing joins context/Branch. Deposit reads three choices and separately loads full Agreement detail only for customerId, then mounts the partner-currency/base-policy readers: a demonstrable extra detail/financial-display waterfall, not a measured latency result.

No timing, HTTP payload, SQL plan, logical-read or browser render measurement exists in this source-only audit. Backend query/index analysis is owned by the separate backend contribution; this UI slice adds no schema/index proposal without that evidence. No new index is justified by missing UI watches or progress ownership.

Owner verification should record the same build/API/database location, representative tenant agreement/child/reference counts, active branch, identical filters and agreed page size. Compare cold and warm approved cache separately, initial usable grid versus settled required choices, repeated search/paging, edit/view open, transient tariff failure→Retry→Save, and each modal's context/lookup tail. Capture request counts/payloads, backend SQL count/plan/IO and render timings separately; record sample count and measured distributions only when supported. Also verify initial failure/false-envelope/Retry, successful reference mutation and tenant/context reset while a draft is open, selected removed labels, replaced tariff inputs, navigation cancellation, print from all four tabs/current and closed route, and preserved row/count/filter results. Acceptance target and before/after measurements remain explicitly pending owner execution.

Review artifact only; root reconciliation and backend/shared evidence remain required before the overall Lease review handoff.
