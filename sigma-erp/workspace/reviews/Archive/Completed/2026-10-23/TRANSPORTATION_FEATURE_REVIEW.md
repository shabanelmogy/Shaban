# TRANSPORTATION Feature Review

| Status | Owner verification pending |
|---|---|
| Implemented — source-only | yes |

## Scope and evidence

The reviewed scope is `SiGmaAngularFrontEnd/src/app/modules/Transportation`.
The recipe drift check passed for `plan-00-maintenance-evolution` and
`phase-00` through `phase-06` on 2026-10-09. The review follows the canonical
Master Guide, UI blocks 1, 3, 4, 6, 10, 13, 14, 17, 19, 22, 23, 25, 27, and 28,
and the generated phase packets 01, 02, 03, 05, and 06.

The module currently contains the canonical shared list shell, `app-data-table`,
`app-editor-dialog`, typed DTOs/forms, shared date/time helpers, cancellation
streams, and `EditableRows`. No application source outside the requested module
is in scope.

## Frozen findings

| Finding | Evidence | Decision |
|---|---|---|
| Pending discard confirmations do not preserve the prior disabled-control state or defer the guard decision. | Transaction, TransactionItem, TransportationAgreementItem, TransportationInvoice, TransportationAgreement, and TripSheet details call `confirmDiscard` directly and only toggle a pending flag. | Apply `freezeFormState` during every pending discard decision; restore only while the same editor remains visible and unfinished. Build `CanDeactivate` confirmations inside `defer` with the current visibility/busy/identity gate. |
| Agreement child-row removal does not freeze its parent form while confirmation is open. | `TransportationAgreement/components/details/details.component.ts` creates `EditableRows` without `freezeParentOnConfirmation`. | Set `freezeParentOnConfirmation: true`; retain the existing `canMutate` and same-row re-resolution. |
| Shared confirmation and error/cancellation ownership must remain feature-local. | Existing services use root `BaseService` and skip interceptor errors for inline state; all list queries already use `switchMap`/`takeUntilDestroyed`. | Preserve services, endpoints, payloads, translations, route aliases, and list behavior. No API or schema change. |

## Canonical conformance

| Concern | Canonical block | Reference | Target match / deviation |
|---|---|---|---|
| Route host and one internal scroll owner | UI 1 | Workshop Job list/editor shell | Matches shared classes and `sigma-route-host`. |
| List/grid and lazy paging | UI 4/6/8 | Workshop Job list and shared `DataTableComponent` | Matches typed columns, shared table, route state, and all-pages export helper. |
| Dialog editor and controlled close | UI 10/13 | Fleet Vehicle dialog and shared `EditorDialogComponent` | Matches shell; pending-decision freeze is the scoped repair. |
| Child collection | UI 14 | shared `EditableRows` and `EditableCollectionTableComponent` | Matches; add the documented pending-removal freeze option. |
| Dates/times and validation | UI 17/19 | shared date/time utilities and `FieldErrorComponent` | Matches; no transport or validator contract changes. |
| Cancellation and stale responses | UI 28 | Workshop Job list/editor | Matches `switchMap`, `takeUntilDestroyed`, and identity checks. |

## Implementation boundary

Only the Transportation detail components, their direct child-table config, the
shared `freezeFormState` utility used by those editors, and the Transportation
UserGuide registration/content are in the implementation boundary. No
migration, backend source, generated packet, or unrelated feature will be
edited.

## Implementation and verification

The six detail editors now build discard confirmations with `defer`, recheck
editor identity, visibility and busy state, and use `freezeFormState` so a
cancelled decision restores the prior disabled-control state and dirty values.
Transportation Agreement enables `freezeParentOnConfirmation` for editable-row
removal. Existing payloads, routes, endpoints and compatibility aliases remain
unchanged. The Transportation section was added to the in-app UserGuide reader
with bilingual workflows and discard/export guidance.

| Check | Result |
|---|---|
| Recipe drift check | Passed (`-Check`) before implementation; no canonical source or packet changed. |
| Scoped TypeScript compilation | Passed (`tsc --noEmit -p tsconfig.app.json`). |
| Diff whitespace check | Passed for scoped Transportation and guide changes. |
| Runtime/browser/database/owner visual acceptance | Pending owner verification under source-only workflow. |

## 2026-10-09 renewed review manifest

The new request authorizes review and confirmed frontend fixes across all seven
Transportation screens. Earlier implementation/compilation statements above
are historical evidence, not checks executed or results claimed in this task.

| Manifest concern | Current decision |
|---|---|
| Scope | `SiGmaAngularFrontEnd/src/app/modules/Transportation`, owning Transportation guide, direct API producers inspected read-only |
| Existing changes | Transportation starts clean; user edits in Limousine, Workshop, HRM, other guides, reader, routes, sidebar and EN/AR vocabularies preserved |
| Evidence | User text and current source; no supplied screenshots or videos, no visual inference |
| Shapes | UI01 controlled modal CRUD; Agreement has one small schedule collection and rate previews, no document totals/posting; Trips is operational read-only paged output with row viewer; TripSheet has two server-paged tabs and ExtraTrip typed action dialog |
| Backend classification | BE13 normal scalar CRUD; BE14 Agreement aggregate; custom operational trip reads; InvoiceBase inheritance without an exposed posting workflow is an existing exception, not authorization to invent accounting |
| References | UI catalog01: actual Workshop/Job list for shell/query, shared EditorDialog for modal composition; shared EditableRows/EditableCollectionTable for schedule; shared DataTable and ReportPrintSession for complete output |
| Phases | 0 discovery, 1 compatibility contract freeze, 2 read/grid, 3 details/discard, 4 existing actions source comparison, 5 wiring, 6 source reconciliation |
| Plan | No ambiguous business redesign or new implementation owner; reuse existing frozen screen contracts and append confirmed repairs |
| Boundary | No backend edits, migration, build/test/lint/browser/database/commit/push/deploy |

### Reference conformance before edits

| Concern | Book | Actual reference/shared owner | Target evidence and correction |
|---|---|---|---|
| List fill/filters | UI1/3/4/6 | Job list HTML: sigma-list-page/panel/table, stableLayout, date reserveMessage; DataTable public fill/page/rows | Agreement uses identical shared hierarchy, six fields and reserved date feedback; missing currentPageReport/showEmpty will be repaired. Other scalar lists already bind these. |
| Pending exit | UI10/13/28 | EditorDialog closeRequested/escapeRequested; form-state.freezeFormState | Agreement must add captured mode/version/visibility and one-subscription checks; Item must use one deferred guard for all exits. Existing shared helper retains disabled subtrees without events. |
| Clock | UI17/19 | DatePicker constructor keepInvalid=true/showOnFocus=false/appendTo=body; time-utils.parseTimeValue(savedTime) | Agreement/Item preserve clock precision; Item's explicit numeric-guard opt-out is removed. |
| Report | UI6/8/21 | DataTable flow when printing, shared all-pages fetch, ReportPrintSession | Existing outputs load all pages separately from ordinary server paging; no simulated count or list all-pages request introduced. |
| Feedback | UI22 | apiErrorMessage and interceptor skip header | Agreement reads already skip global errors but drop messages in lookup catchError; preserve messages through existing shared formatter. Mutation success remains interceptor-owned. |
| User guide | Master7 | UserGuide typed content/reader and existing Transportation registration | Existing guide has four topics, missing Transaction/TransactionItem/AgreementItem; add bilingual topics and reconcile actual routes/backend limitations. |

### Final decisions and contracts for this continuation

The original implementation-boundary paragraph is superseded for this renewed
handoff by the frontend scope above and its directly related shared date helper,
guide menu and translation leaves. Backend source remains read-only. No
screenshot-derived requirement or unresolved frontend API shape was invented.

Actions are first in every operational grid through DataTable's shared actions
column. The property lists below follow the actual displayed order after it;
date/dateTime/money denote DataTable types. Backend over-scope is reported as
producer drift, not hidden by the smaller Angular interfaces.

| Screen | Grid fields / frontend row needs | Backend read fields consumed / producer excess |
|---|---|---|
| Transaction | `id, poType, date(date), supplierQuotationNo, supplierId, notes, discount(money), createdAt(dateTime)` | `Id, POType, Date, SupplierQuotationNo, SupplierId, Notes, Discount, CreatedAt`; unused `GUIId, Items` and remaining ListBaseVm metadata |
| TransactionItem | `id, description, purchaseOrderId, vehicleId, quantity(number), uom, unitPrice(money), tax(money), createdAt(dateTime)` | Same PascalCase fields; unused `GUIId` and remaining ListBaseVm metadata |
| Agreement | `no, customerName, customerCode, vehiclePlateNo, driverName, startDate(date), ratePerMonth(money), ratePerTrip(money), isClosed(status)` plus `id` | `No, Customer.Name/No, Vehicle.PlateNo, Driver.FirstName/MiddleName/LastName, StartDate, RatePerMonth, RatePerTrip, IsClosed, Id`; current ListVM additionally exposes Items, weekdays, Notes, large detail navigations and metadata |
| AgreementItem | `id(number), tripTimes, pickUpLocationId(number), dropOffLocationId(number), amount(money), isExtra` | Same PascalCase fields; list-only Branch detail navigations and unused inherited metadata remain producer excess |
| Invoice | `id(number), no, agreementId(number), customerId(number), startDate(date), period` | Same PascalCase fields; Agreement/Customer detail graphs and other base metadata remain producer excess |
| Trips | `tripNo, agreementNo, tripDate(dateTime), pickUpLocation, dropOffLocation, vehicle, driver, isExtra`; viewer/output also consume amount, invoiced, notes, customer | Existing `TransportationTripsDto` read contract, synthetic trip identity; no separate detail API invented; output preserves existing additional amount/invoiced columns |
| TripSheet | Scheduled: `tripNo, tripDate(dateTime), pickUpLocation, dropOffLocation, vehicle, driver, notes`; Extra adds `amount(money), invoiced`; viewer/action context also uses agreementId/agreementNo/customer/itemId/isExtra | Existing `TransportationTripsDto`, separate scheduled/extra paged endpoints. Known producer counts remain imperfect; UI retains explicit unknown-count page navigation |

| Screen | Angular filters / exact HTTP transport | Producer parser and default |
|---|---|---|
| Transaction | `id, poType, date, supplierQuotationNo, notes, discount` through `Filters[key]`; pageNo/pageSize and sort in shared toListParams | Generic stored-property case-insensitive binding, string containment and scalar comparisons; optional signed Int32 id; no default date-range rule for this exact-date field |
| TransactionItem | `id, description, quantity, uom, unitPrice, tax`, same serializer | Same generic scalar parser; signed numeric contract retained |
| Agreement | `agreementNo, fromDate, toDate, status, customerId, plateNo, driverId` through `Filters[key]` | Actual FilterHelper string/date/int keys; current-month range, nullable status or1=open/2=closed; custom producer has no sorting |
| AgreementItem | `pickUpLocationId, dropOffLocationId, amount, isExtra` through `Filters[key]` | Generic stored scalar keys; false and zero preserved, absent/null/empty omitted. Clock filter remains excluded because generic Convert.ChangeType cannot parse TimeSpan |
| Invoice | `agreementId, customerId, startDate, period` through `Filters[key]` | Generic scalar parser; exact startDate, optional/null defaults, period string match |
| Trips | UI dateRange becomes top-level `fromDate, toDate`; also `agreementNo, tripNo, customerId, driverId, pageNumber, pageSize` | Actual TransportationAgreement/Trips controller parameters; current-month default; no unsupported sort UI |
| TripSheet | Required parsed month becomes top-level fromDate/toDate, optional agreementId/tripNo plus pageNumber/pageSize | Actual TripSheetScheduled/TripSheetExtra parameters; current month by default. Full-year local boundaries repaired without changing request names |

Generic lists keep real server totals and stored-column sorting. Agreement
CountAsync and paging use the same filtered query and a1..100 size clamp.
All list triggers retain switchMap/defer/takeUntilDestroyed. Empty pages beyond
the last known Agreement page recover to that page. Search resets to page1;
mutation/editor refresh uses the applied snapshot. All-pages requests belong
only to existing Excel/report output, never ordinary list simulation.

| Editor/write path | Frozen client inputs and detail behavior | Ownership/validation decision |
|---|---|---|
| Transaction | `guiId, poType, date, supplierQuotationNo, supplierId, notes, discount`; Update adds id; saved detail through GetById | GUID syntax including EMPTY_GUID, real date and finite signed discount retain existing contract; no new business requiredness or permission |
| TransactionItem | `guiId, purchaseOrderId, description, vehicleId, quantity, uom, unitPrice, tax`; Update adds id | Existing GUID/finite quantity/price/tax inputs only; saved derived amount figures remain read-only and omitted from writes |
| Agreement | `startDate, customerId, driverId, vehicleId, ratePerMonth, ratePerTrip, weekdays, notes, items[]`; Update adds id and retained saved child ids | Existing required selections/date/nonnegative rates, Notes max2000, required row time/locations. Full child snapshot still sent. Rates per day/week remain existing display previews and are not sent |
| AgreementItem | `tripTimes, pickUpLocationId, dropOffLocationId, amount`; Update adds id; GetByWithNavigationsId supplies saved location labels | Optional real clock and positive optional location identifiers, required signed finite amount; saved clock seconds/fractions retained through shared time helper. Parent link remains unavailable rather than invented |
| Invoice | `agreementId, customerId, startDate, period`; Update adds id; navigated detail supplies labels | Agreement FK uses actual generic Agreement/GetSelect, not TransportationAgreement. Valid required date, optional existing references, period max100; no number/audit/derived state or nested navigation write |
| TripSheet ExtraTrip | `agreementId, tripDate, tripTimes, pickUpLocationId, dropOffLocationId, amount, notes` | Applied agreement selection required by existing owning UI; customer/vehicle/driver are parent context. Local date-time transport, optional locations and finite signed amount unchanged; no ignored driver/vehicle inputs added |
| Trips/TripSheet View | Existing returned row supplies fields; Trips deep-link viewer reads the existing trip query | No new CRUD or invented detail endpoint |

Create, Edit and View reuse each screen's current controlled EditorDialog.
View is read-only. Compatibility URLs remain as previously frozen. All dirty
exits in Item/ExtraTrip now delegate to the same deferred decision; Agreement
adds visible/id/mode/version/one-subscription gates. Shared freezeFormState
preserves intentionally disabled controls and dirty values. Stale/duplicate
decisions cannot enable or close another record; Retry cannot start during
the decision. Agreement no longer clears dirty state merely when navigation
was approved; successful Save marks pristine, actual close disposes the editor.

### Existing action and backend comparison

| Reference action category | Target classification and evidence |
|---|---|
| Create/View/Edit/Save | Supported for the five existing scalar/aggregate CRUD screens through existing GET detail + POST/PUT; Trips is read-only, TripSheet creates ExtraTrip only and does not edit generated rows |
| Search/Reset/Refresh/paging/Excel | Supported through existing applied query/serializer, DataTable and all-pages output owners |
| Print/report | Supported where already present: Agreement and Trips/TripSheet/Invoice/Item complete-output flows; Transaction/TransactionItem retain their existing Excel-only output |
| Delete | Supported existing generic DELETE?id for CRUD screens and TripSheetExtra/{id} for extra rows; shared confirmation, double-action gates, row identity checks, inline failure, applied-query refresh |
| CloseAgreement | Supported open->closed, POST TransportationAgreement/CloseAgreement `{agreementId}`; UI checks IsClosed, re-resolves row before request, shared warning confirmation, failure recovery and refresh. Producer lacks an explicit closed-state rejection; recorded below |
| Approve/post/payment/refund/upload/batch selection | Not Applicable to current exposed workflow; no action endpoint, file workflow or accounting UI invented from InvoiceBase or unrelated Job reference actions |

Authorization candidates are existing Create/Update/Delete, CloseAgreement,
ExtraTrip Add/Delete endpoints. The app has AuthGuard and the root token client,
not a feature authorization API; hiding/disabling these actions is presentation
only. BaseService injects the root HttpClient; AppModule provides
`withInterceptors([tokenInterceptor, errorInterceptor])`, with no Transportation
client fork/manual token. Inline feature requests send X-Skip-Error-Interceptor;
apiErrorMessage handles HTTP failures and Result.message handles declared ones.
Success remains owned once by the mutation interceptor.

| Actual backend override | Existing reason / source-only result |
|---|---|
| Agreement GetManyWithNavigationsAsync | Custom filters/paging/navigated read; required by current list, broad projection remains a backend finding |
| Agreement DetailAsync | Loads tenant-owned nondeleted aggregate/context; feature-specific read |
| Agreement AddAsync / UpdateAsync | FK existence checks then generic persistence; no frontend rule added or override removed |
| AgreementController GetListAsync | Routes list to custom navigated producer; feature-specific reason |
| Invoice UpdateAsync / RemoveAsync | Current settlement guard and shared allocation write lock; **preserved**. Older review wording about absent state guards is superseded by current source |
| Invoice UpdateListAsync | Validates ids, prevents settled-invoice mutation and serializes writes under the allocation guard; existing multi-save producer path, unchanged and not reached by this UI's Save |
| Item/Transaction/TransactionItem generic services | Inherited generic operations; no redundant overrides introduced |

No backend, entity, EF, mapping or financial calculation source changed. No
migration is required by this task and no migration name is suggested. Existing
InvoiceSettlementWriteGuard failures continue through the inline owner.
Agreement read maps already have one-way ownership maps; legacy scalar
ReverseMap/read-metadata issues are producer findings for separate backend scope.

### Producer limitations retained

These are current backend findings outside the requested Angular folder. They
prevent claiming complete end-to-end business correctness, even though the
frozen frontend repairs are implemented.

| Finding | Current evidence / remaining decision |
|---|---|
| ExtraTrip date persistence | AddExtraTripAsync assigns requested TripDate to CreatedAt; the audit save policy overwrites Added.CreatedAt. A true stored TripDate/audit/schema decision is required before claiming correct historical trip dates |
| Scheduled page counts | GetScheduledTripsAsync removes extra rows **after** GetTransportationTrips paging/counting; pages/counts can disagree |
| Extra totals and custom bounds | GetExtraTripsAsync computes totalCount but omits TotalCount; custom date/page boundaries lack generic clamp/range checks. Frontend retains unknown-total navigation rather than fabricated counts |
| Generated-trip lifecycle | Generator includes agreement.Items without a live-child predicate and does not reconcile agreement start/closed bounds; Invoiced is hardcoded false. Required lifecycle/accounting semantics must be specified for backend work |
| Standalone item parent relationship | AddVM has no writable agreement link. The guide identifies this limitation and directs agreement-owned work to the existing parent schedule/ExtraTrip workflow |
| TransactionItem VehicleId | Entity Guid? versus nonnullable GUID DTO/frontend is a pre-existing contract conflict; no inferred selection/requiredness change |
| Oversized reads | Agreement/scalar ListVMs return unused metadata and/or navigation graphs. Frontend interfaces stay consumed-field-only; BE3/7 lean producer refactor is outside this source scope |
| Existing generic mappings/aggregate behavior | Legacy read ReverseMap and generic child reconciliation deserve owning backend review; no frontend proof of safe aggregate child persistence is claimed. Current ItemUpdateVM is scalar-only, unlike the older report's historical nested-graph claim; InvoiceUpdateVM still includes unused navigation inputs |

### Files and final reconciliation

All source paths below are relative to `SiGmaAngularFrontEnd`:

- Transaction and TransactionItem: each `components/list/list.component.ts`,
  `components/list/list.component.html`, `components/details/details.component.html`.
- TransportationAgreement: list and details `.ts`/`.html` (four files).
- TransportationAgreementItem and TransportationInvoice: each details `.ts`/`.html`.
- TripSheet: list `.ts`, details `.ts`/`.html`.
- `src/app/modules/shared/utils/date-utils.ts`.
- `src/app/modules/UserGuide/content/transportation-guide.ts`.
- `src/app/_metronic/layout/components/sidebar/sidebar-menu/sidebar-menu-data.ts`:
  Transportation guide entry only; other pending menu changes preserved.
- `src/app/modules/i18n/vocabs/en.ts`: Agreement.recordSubtitle only;
  `ar.ts`: that subtitle plus four missing Transportation menu leaves. Other
  pending vocabulary changes preserved.

Total:22 frontend source files. No Trips application file needed a confirmed
change. The guide remains registered in GuideReaderComponent and uses
`/UserGuide/transportation`, now linked under the Transportation sidebar.
It covers Agreement, TripSheet, Trips, Invoice, AgreementItem, Transaction and
TransactionItem in both languages, with prerequisites, steps, actual actions,
validation limits, dirty exits and relevant operational limitations.

| Final path/gate | Current result |
|---|---|
| Frozen handoff -> final source | Confirmed repairs implemented; append-only contract retains original decisions/history |
| Columns/filters/read/page -> UI | Exact tables above; count-backed Agreement pager and error-aware empty states corrected; custom producer limits explicitly retained |
| Detail/write/exit -> UI | Existing DTO inputs unchanged, one pending exit decision, safe retry/control restoration and saved precision preserved |
| Shared extraction | Reused int32ValueValidator, DatePicker, toPickerDate, currentMonthRange, freezeFormState, apiErrorMessage, DataTable and guide reader. No new feature copies. Identity/context gates remain feature-owned per UI10/28 |
| Layout/RTL/theme/keyboard | Shared container-fill/table/dialog/filter owners preserved; no feature SCSS, page-height calculation, table override, palette or additional scroll owner introduced; runtime acceptance pending |
| Translations/guide | Literal EN/AR keys and all seven topic routes source-reconciled; new Agreement identifier subtitle and Arabic menu leaves, one module guide entry |
| Complete scoped diff | Reviewed in frontend repository; relevant shared-file hunks isolated from pre-existing changes. Read-only safe.directory override used per command, no global Git config change |
| Source parsing/import existence | 53 TypeScript files and14 templates parsed, excluding specs; relative/src import paths exist. This establishes syntax/path facts, **not compilation** |
| Literal bilingual coverage | Final scoped scan: 224 feature literal keys plus four Transportation menu keys exist in EN/AR, including the new subtitle. Dynamic editor-title suffixes also checked; dynamic field keys reconciled through existing typed field arrays and vocabulary blocks |
| Whitespace/merge markers | Scoped git diff --check passed; no conflict markers or newly introduced prohibited feature patterns |
| Build/test/lint/runtime/browser/database | Not run in this continuation; pending owner verification. Historical compilation row above is not a result from this task |
| Entity/EF/schema | No changes; Add-Migration not required |

### Documentation, agents and owner handoff

Updated canonical `ui/17-dates.md`, CHANGELOG and
`.agents/skills/sigma-screen-refactor/SKILL.md` together: full-year month
boundaries reuse the existing owner. Generated only through Generate-SigmaRecipes;
all8 packet IDs regenerated/rechecked, with phase-02-read-grid and
phase-03-detail-write affected by UI17. Their UI17 SHA256 is
`c3c2dcb258d006774350cdda4bcbc0edf2ac31281f34ea2162ed973c0cc55287`,
matching the canonical block. Semantic review retained approved Job list/shared
EditorDialog reference roles, local-calendar semantics and complete-output versus
server-paging rules; final -Check passes all8. Prior documentation changes remain
preserved. No pending promotion or direct generated-file edit.

Two bounded discovery streams reduced duplicate source tracing: transaction
and trip screens. `luna_explorer_transactions` used the inherited model because
the mapped gpt-5.6-luna was unavailable, implemented exactly its four frozen
files, then performed a read-only audit of root changes. Root integrated its
work and owned later HTML refinements. `luna_explorer_trips` delivered read-only
date/count findings; its later initialization remained pending, so root
interrupted it and resumed exclusive ownership of the two planned files.
No overlapping edits or additional agents; root owns final reconciliation.

Owner verification: compile the Angular application; exercise dirty Cancel/X/
Escape/back and cancelled navigation; ensure loading/retry/save gates and values
survive failures; check last-page deletion, server Result/HTTP errors and full
Excel/print output; check manual months0001/0099/0100/9999 and Dec/Jan stepping;
inspect all seven guide links in EN/AR and narrow/RTL/light/dark/print modes.
Verify producer trip-date/count limits separately before relying on operational
date/invoicing results.

Suggested frontend commit (only the22 task source files/hunks):
`fix(transportation): align editor guards, dates and guide coverage`

Suggested documentation commit (only the owning UI17/changelog/packet changes):
`docs(ui-book): document full-year month boundaries`

The workspace skill/review artifacts remain local under the existing ownership
decision. No backend commit is suggested. No build, test, lint, browser,
database, migration/snapshot edit, commit, push or deployment command was run.
Current outcome: **Implemented - source-only** for frozen frontend repairs;
owner verification pending, backend business limitations remain open.

### Sidebar guide label correction (2026-10-09)

| Gate | Result |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Owner decision / reference | Replace the generic User Guide label with Transportation Guide / دليل النقل; existing module-specific Customers/Workshop guide entries, Master7 and UI23 |
| Files | sidebar-menu-data.ts title binding, en.ts and ar.ts userGuide.transportationMenuEntry only; unrelated hunks preserved |
| Contract | Append-only correction frozen in TRANSPORTATION_FRONTEND_CONTRACT_FREEZE.md; route /UserGuide/transportation, guide content/topics, icon and layout unchanged |
| Phases | Focused Phase5 translation/menu repair and Phase6 source reconciliation; no read/write/domain-action changes |
| Verification | Recipe -Check passed all eight packets; Check-Translations.ps1 -Block userGuide: 33 EN/AR keys, zero missing/case-only differences; scoped repair diff reviewed and diff --check passed |
| Boundary | No backend/API/schema/calculation/mapping change or migration; no build/test/lint/browser/database/commit/push/deploy command |
| Agents | None for this isolated three-file label correction |

Owner acceptance: confirm the menu says دليل النقل in Arabic and
Transportation Guide in English, and opens the existing seven-topic guide.
Suggested frontend commit: `fix(transportation): name sidebar guide by module`.
