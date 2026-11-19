# TripBooking — frozen implementation handoff

| Status | Frozen |
|---|---|
| Owner verification pending | yes |

Frozen 2026-10-07 against TripBookingController/Service/VMs and current Angular editors. UI02 routed editor (charges/tax/net totals + documents + workflow), backend pattern2 aggregate without journal posting. Root owns TripBooking frontend and directly related backend contracts only.

## Read and filters

Grid: actions; no; tripTypeName; customerName; guestName; pickUpDateAndTime(dateTime); dropOffDateAndTime(dateTime); pickUpLocationName; dropOffLocationName; vehicleTypeName; vehiclePlateNo; driverName; notes; status(status); amount(money); fromAddress; toAddress. List read must carry these plus id/invoiced/externalVehicle/searchVehicleByAny/vehicleId/driverId/charges/tax/endKms required for workflow dialog initialization. Nested graphs/documents and unrelated editor fields do not belong to the list. Preserve direct consumers before narrowing.

GET TripBooking uses pageNo/pageSize + Filters[tripNo,guestName,fromDate,toDate,branchId,vehicleId,customerId,driverId,tripTypeId,vehicleTypeId,invoiced,zeroAmountTrips,pickUpLocation,dropOffLocation]. Filters apply before exact CountAsync, order Id desc. Existing service caps size200; canonical backend NormalizePaging caps100; adopt canonical clamp while preserving unpaged compatibility for old consumers. Frontend uses shared query helpers, initial15, switchMap, explicit Search applied snapshot and URL state. Current-month range sends local calendar dates; pickup/dropoff are wall-clock date-times without Z (UI17/backend DateTime). Export/print reads all pages of the same applied query through shared fetchAllPages, never replaces/mutates visible pager rows.

## Detail/write

Required customer/trip/location/vehicleType IDs, pickup/dropoff timestamps; vehicle/driver assignment and external vehicle/supplier fields retain existing rules. Editable charges/tax/discount/supplierCharges >=0; backend owns authoritative netCharges and tax policy (manual Tax only when settings allow). Invoiced remains the current explicit API/editor contract; changing accounting ownership is outside this task. No tenant/no/status/audit/net fields in writes. Update adds id. Documents use full snapshots, existing id on Update, none on Add; type/number/issue/expiry required, number/issuedBy max100, path max400, expiry after issue. No tenant/no in children. View displays stored server totals/lookup names, skips edit-only lookups. Load/lookup failure blocks Save with retry. Uploads reuse app-file-field/DocumentUploadTracker and only clean abandoned/replaced files through its lifecycle; cleanup retry never re-saves the aggregate.

## Actions

| Action | Source -> target / lock | API / recovery |
|---|---|---|
| Assign | New -> Assigned | POST Assign/{id}, vehicle/driver/searchVehicleByAny/notes; resources lookup by selected id, stale results ignored |
| Dispatch | Assigned, or New when settings allow -> Dispatched | POST Dispatch/{id}, same input; backend revalidates resources |
| Start | Dispatched -> Started | POST Start/{id}, startDateAndTime/notes |
| Finish | Started -> Finished | POST Finish/{id}, dropOffDateAndTime/kms/tripCharges/tax/notes |
| NoShow | Dispatched -> NoShow | POST NoShow/{id}, optional notes; shared confirmation |
| Cancel | uninvoiced New/Assigned/Dispatched -> Cancelled | POST Cancel/{id}, required reason max1000; typed dialog |
| Delete | uninvoiced New/Cancelled | DELETE {id}; shared confirmation, step back after final row |
| History | saved row | GET History/{id}, complete local read grid; stale identity/open state ignored |

View/Edit/Print use same owning editor routes, edit only New/Assigned/Dispatched/Started. Routes list/create/view/:id/edit/:id, data.mode and canDeactivate; details/:id compatibility redirects. Return with applied list state. Busy guards, stable submitted forms, finalize loader, safe failure feedback and same-page refresh mandatory. Job's invoice/close/gate-pass/labour-time actions Not Applicable: no such trip endpoints/business records. Existing trip-specific actions above Supported.

## Conformance before implementation

| Concern | Book | Actual source owner/reference | Target mismatch / correction |
|---|---|---|---|
| List | UI1/3–8/28 | Workshop/Job list bindListQueries; shared DataTable/FilterPanel/ActionList | ms-lib, direct PrimeNG pager access, private menus/layout -> controlled shared owners |
| Editor | UI1/13/14/15/19/24 | Workshop/Job editor; global editor shell, FormSection/FieldError, SummaryCards/Money | untyped form, bespoke fields/totals, no title/dirty exit -> shared bounded typed record |
| Dates | UI17 | shared date-utils/DatePickerDirective | toISOString loses wall-clock day/time -> toApiDateTime; docs parseDateValue/toPickerDate |
| Documents | UI18/BE14 | shared FileField/UploadTracker/EditableRows; base OwnsAll/ReconcileOwned | legacy upload/error-as-path and tenant payload -> typed full snapshot and guarded lifecycle |
| Error | UI2/22 | global interceptor; api-error skip headers for inline reads | private message parsing/duplicate inline failures -> one feedback owner |

Invoice's generic-vs-bulk mismatch is separately Blocked; no invoice workflow is invented. Tracker remains a source-supported map exception with existing center; no live driver data API was found.

## Historical implementation amendments — 2026-10-07

The initial freeze above remains the historical handoff. BE3/5/14 and verified consumer inspection refine its response/implementation shape without adding business behavior:

- Detail is explicit: current editor inputs plus id/no/status/invoiced, authoritative netCharges and eight flat lookup labels (customerName/tripTypeName/pickUpLocationName/dropOffLocationName/vehicleTypeName/vehiclePlateNo/driverName/supplierName). Documents expose only id/documentType/documentNumber/documentPath/issuedBy/issueDate/expiryDate/isInternational. Nested navigation and inherited audit/tenant data are removed in both producer and consumer.
- List uses inherited generic GetManyAsync with ApplyListFilters and ProjectTo through MaterializeListAsync. Its forwarding controller override and unused FullListVM/map are removed. Omitted paging retains generic unpaged compatibility; explicit paging caps100 and exposes exact metadata.
- Calendar toDate includes the whole final day by next-day exclusive comparison. Existing precise timestamp filters preserve their previous inclusive instant comparison; local editor timestamps keep wall-clock semantics.
- Update uses the base UpdateCoreAsync hook and one tracked aggregate save. OwnsAll rejects negative/duplicate/foreign/deleted child IDs before mapping; live children must match parent tenant. Full snapshots reconcile retained/new/removed rows; legacy null documents remain unchanged. Detail excludes deleted/cross-tenant rows. Delete soft-deletes the owned documents and parent in the same save, retaining existing history/state/invoiced constraints.
- The report projection UtilizationGroupRow moves into its own file; no calculation changes. NetCharges is absent from writes. Localized failure/success keys preserve transition predicates and historical notes.
- Legacy details/:id redirects retain mode=edit/edit=true and applied query context. Forms freeze on cold discard subscription; obsolete/duplicate subscriptions are rejected. Workflow list restores manually disabled tax and requires finite nonnegative nonempty finish numbers. Full literal translation records own workflow/status/history labels.

No schema change, new permission, invoice posting workflow or concurrency locking policy is introduced. Existing overlap checks are not proof against simultaneous writers; owner race verification remains pending.

## Owner-approved partial invoice amendment — 2026-10-07

The owner subsequently approved trip-based generation and several partial invoices, requiring the total invoiced never exceed the trip total. This expressly supersedes the historical editable Invoiced input and first-invoice eligibility above. See LIMOUSINE_INVOICE_CONTRACT_FREEZE.md for the frozen accounting/write contract.

- Remove Invoiced from Trip Add/Update VMs and client payloads. Saved list/detail expose billedAmount and derive fully-invoiced from actual live tenant invoice sums, including both plain/deep detail and the list invoiced filter. Editor shows the derived state readonly.
- Update, UpdateList, Finish, Cancel and Delete participate in the same tenant/type invoice application lock. Update/Finish reject a new total below the existing billed gross, a saved tax below billed tax, or remaining tax exceeding remaining gross. Cancel/Delete reject any positive billed gross, including a partial invoice. Other existing state/resource/history/document predicates remain.
- Existing two candidate readers use positive actual remaining rather than stale stored flags and expose billed/remaining amounts. Original source charge/tax/discount fields and complete response remain; the typed compatibility DTO is updated. Date upper bounds avoid maximum-date overflow.
- Trip invoice refresh is field-only. Actual balance reads override legacy first-invoice flags; no bulk historical rewrite or schema change is needed.

The lock amendment covers participating invoice and trip pricing/lifecycle writers. Existing vehicle-allocation overlap prechecks remain a separate runtime concern. No build, database/race execution, migration or snapshot change was performed.
