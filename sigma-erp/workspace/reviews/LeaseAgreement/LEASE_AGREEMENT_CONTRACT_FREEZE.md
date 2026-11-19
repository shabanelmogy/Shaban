# LeaseAgreement Feature Review Manifest and Contract Freeze

Date: 2026-08-20  
Scope: `SiGmaAngularFrontEnd/src/app/modules/Lease/LeaseAgreement` and the directly related LeaseAgreement API/service/mapper/VM files in `SigmaBackend`.  
Authority: `SIGMA_FEATURE_REVIEW_MASTER.md` v1.4, canonical UI book v0.48, canonical backend book v0.11.  
Packet drift: every generated packet from PHASE-00 through PHASE-06 is stale. The canonical books govern; generated packets must be regenerated and semantically reviewed by the owner.

Reconciliation note: the 2026-08-20 desktop capture at `C:\Users\shaban\Desktop\1.PNG` is post-refactor gap evidence. The earlier 24 captures remain the functional acceptance evidence; the later capture does not supersede their demonstrated controls or create contracts for omitted domain actions.

## Selected shapes

- UI list: canonical shared `app-data-table`, server paging/filtering/sorting, full filtered basic export.
- UI editor: canonical modal `app-editor-dialog` with `app-editor-tabs` and shared editable-collection tables.
- Backend ordinary write slice: stateful master-detail aggregate without a confirmed accounting side effect for Create/Edit; one aggregate save.
- Backend action slice: Agreement Documents is a feature-owned upload action and Agreement Discounts is a tenant-scoped LeaseAgreement child collection. Unrelated state transitions and financial workflows are not inferred from screenshots.
- Reports: no typed LeaseAgreement report contract exists, so a report route is not frozen.

## Functional evidence table

| Evidence | Classification | Frozen requirement or result |
|---|---|---|
| 1 | Explicit | Empty Lease Agreements list: title/Create, basic and advanced filters, basic export, search, and server-paged grid. |
| 2 | Explicit | Open/Create editor: Detail, Provisions, Clauses, and Pre-Termination tabs plus booking-charge rows and summary values. |
| 3 | Explicit | Populated list/grid and row action menu. Supported actions are frozen individually below; visible actions without contracts are not inferred. |
| 4 | Explicit workflow / Frozen | Agreement Documents dialog lists active configured document types by Name and provides Upload. One server-owned attachment is stored per LeaseAgreement/document type; closed or invoiced agreements remain viewable but cannot upload. |
| 5 | Explicit workflow / Frozen | Agreement Discounts opens a list-owned dialog with dated Discount rows. The feature owns a tenant-scoped child collection and replacement save; it does not alter the unresolved agreement total/tariff calculation. |
| 6 | Explicit workflow / Conflicting contract | Create Receipt dialog; current receipt agreement validation targets `RentalAgreement`, not LeaseAgreement. |
| 7 | Explicit workflow / Missing contract | Deposit dialog; no Lease-owned accounting source/allocation contract exists. |
| 8 | Explicit workflow / Missing transition | Vehicle Replacement with incoming/outgoing vehicle facts; no atomic transition, movement, or vehicle-state contract exists. |
| 9 | Explicit workflow / Missing transition | Driver Replacement; no replacement payload, history, or state-transition contract exists. |
| 10 | Explicit workflow / Missing calculation | Additional Charges rows; no owned entity/action or authoritative calculation rule exists. |
| 11 | Explicit workflow / Missing transition | Extend Lease Agreement (period) current summary; no versioned extension action/history contract exists. |
| 12 | Explicit workflow / Missing transition | Extend Rate and Period current-detail tab; source/target state and carry-forward rules are absent. |
| 13 | Explicit workflow / Missing calculation | Extension new Detail/rates; tariff snapshot, total formula, and history rules are absent. |
| 14 | Explicit workflow / Missing schedule rule | Extension Provisions tab; required persisted schedule-date derivation is absent. |
| 15 | Explicit workflow / Missing transition | Extension Clauses tab; no extension-owned reconciliation/versioning action exists. |
| 16 | Explicit workflow / Missing transition | Extension Pre-Termination tab; no extension-owned reconciliation/versioning action exists. |
| 17 | Explicit workflow / Missing transition/calculation | Agreement Closing; final fuel/KM/branch, charge, movement, accounting, and atomicity rules are absent. |
| 18 | Explicit workflow / Missing report | Agreement Billing History summary; no Lease billing read model/relation exists. |
| 19 | Explicit workflow / Missing contract | Payment Instructions method selector; no agreement-owned instruction contract exists. |
| 20 | Explicit workflow / Missing contract | Direct Debit instruction fields; ownership, validation, secure-storage, and invoicing rules are absent. |
| 21 | Explicit workflow / Missing contract | Cheque instruction row collection; no persistence/allocation contract exists. |
| 22 | Explicit workflow / Missing contract | Continuation of cheque rows and Save; row limits, totals, validation, and persistence rules are absent. |
| 23 | Explicit workflow / Missing read model | Agreement Log; audit fields do not provide the displayed event history. |
| 24 | Explicit workflow / Missing transition | Change Delivery Date; no Lease delivery-date property/action or DeliveryMovement rule exists. |
| 25 | Explicit current-state gap | Post-refactor desktop list capture (English/LTR, 1337×683; role/version Unknown) demonstrates that Permanent Vehicle became a dropdown, the single Date Range became two inputs, the basic export label renders as a raw key, and the grid extends beneath the usable viewport. Reconcile these presentation/interaction gaps through the canonical list pattern; do not use this capture to infer missing report or transition APIs. |

## Grid and ListVM contract

| Grid column | `LeaseAgreementListVM` property |
|---|---|
| row identity/actions | `Id`, server-owned `CanEdit` |
| Agreement No | `No` |
| Agreement Type | `AgreementType` |
| PO No | `PONo` |
| Vehicle | `VehiclePlateNo` |
| Permanent Vehicle | `PermanentVehicle` |
| Customer | `CustomerName` |
| Customer Code | `CustomerCode` |
| Driver | `DriverName` |
| Start Date | `DateAndTime` |
| End Date | `EndDate` |
| Status | `IsClosed` |
| Branch | `BranchName` |

No other feature property belongs in the list response. `Id` is the non-displayed identity field; `CanEdit = !IsClosed && !Invoiced` is the minimum non-displayed action-state field needed to prevent an open-but-invoiced row from advertising Edit. Action availability for unsupported stateful actions is not frozen and must not be guessed.

## Filter, paging, sorting, and export contract

- Exact keys: `agreementNo`, `manualAgreementNo`, `branchId`, `plateNo`, `permanentVehicle`, `isClosed`, `customerId`, `salesPersonId`, `ownership`, `fromDate`, `toDate`, `sortField`, `sortOrder`.
- The owning UI uses one typed `dateRange: Date[] | null` calendar control and serializes its two local calendar values to the existing exact `fromDate` and `toDate` query keys. A partial range is not sent; a reversed complete range fails inline before a request.
- Permanent Vehicle is the screenshot-demonstrated checkbox. Checked serializes `permanentVehicle=true`; unchecked omits the key and therefore means all vehicle assignments. A false-only filter is not demonstrated and is not exposed by this screen.
- `fromDate` and `toDate` are local calendar dates; `toDate` is inclusive via a half-open server predicate `< toDate + 1 day`.
- Reversed ranges fail explicitly. Unknown/malformed filters are ignored. Page number is clamped only to at least 1, page size to 1..200, and a page past the end returns an empty successful page.
- Sort fields are whitelisted and always include `Id` as a tie breaker.
- The owning LeaseAgreement grid uses a fixed interactive page size of 5 and exposes only `[5]` in its rows-per-page selector. Lazy-load events and API response metadata cannot change that UI-owned size. Basic export remains an all-pages workflow and may continue fetching bounded batches of 200.
- Basic export uses the same filters and ordered ListVM contract and retrieves every page. A failure on any page fails the whole export.
- Detailed export is Missing because no dedicated exact export DTO/endpoint exists. The unused broad `LeaseAgreementFullListVM` was removed rather than accepted as a grid/export contract.

## Detail/Add/Update contract

Frozen client-editable header inputs are: `dateAndTime`, `endDate`, `poNo`, `vehicleId`, `permanentVehicle`, `makeAndModelId`, `fuelLevel`, `kMs`, `customerId`, compatibility `customerType`, `driverId`, optional `additionalDriverId`, `salesPersonId`, optional `notes`, `discount`, `taxPercent`, `advance`, and `deposit`.

Date-control reconciliation: the Angular editor owns `dateAndTime` and `endDate` as typed `Date | null` controls rendered with time-enabled canonical `p-calendar` controls. Provision `entryDate` is a typed `Date | null` date-only calendar. All calendars append to `body` with `sigma-datepicker-panel`; local parts are serialized to the unchanged string DTO fields at the service boundary, and date-only values never use `toISOString()`.

Validation reconciliation: Save validates the complete typed header and all owned collection rows, calls `markAllAsTouched()`, and renders a localized icon-bearing error directly below every invalid validated control. Cross-field date ordering is owned by `endDate`; each pre-termination range error is owned by that row's `monthsTo` control. If the first invalid control is in another editor tab, the UI activates that tab, scrolls the control into view, and focuses it. `aria-invalid` is exposed only when the corresponding control is invalid and touched; the summary alert remains supplemental and never replaces field-level messages.

The screenshots display “Number of Months,” but neither `Agreement` nor `LeaseAgreement` persists that value. Start and end dates are authoritative. The refactored UI therefore derives a read-only calendar-month display from those dates; `noOfMonths` is not accepted by Add/Update, returned by detail, or used for end-date, pricing, or validation decisions. An independently persisted/round-tripped month count remains **Missing** pending an owner-supplied business rule and schema decision.

Frozen owned collections are:

- booking charges: `id` on update only, `chargeType`, `isSelected`, `rate`, `rateUnit`, `totalCharge`;
- provisions: existing rows expose `id`, `voucherSubType`, `entryDate`, `title`, `dayOfMonth`, `numberOfMonths`; creation of a new row is blocked pending the required schedule rule below;
- clauses: `id` on update only, `clauseTypeId`, `clauseDetail`;
- pre-termination rules: `id` on update only, `monthsFrom`, `monthsTo`, `type`, `value`.

Omitted and empty collection semantics are replacement semantics: the Angular editor always sends arrays; an empty array removes all existing owned rows for that collection. Child ids must belong to the selected LeaseAgreement and tenant. Required FKs, enum values, date order, non-negative values, and child references are validated server-side. Closed or invoiced agreements are read-only.

`Provision.FirstDate` and `Provision.LastDate` are non-null persisted fields, but neither the screenshots nor the LeaseAgreement editor/API establishes how they are derived from Entry Date, agreement dates, or the “After Every” inputs. New Provision rows therefore fail closed with an actionable localized result; the UI disables Add Provision. Existing provision rows may be edited while their persisted first/last dates are preserved. This affected workflow remains **Missing** until the owner supplies the schedule rule.

Server-owned fields are identity, tenant/audit values, `No`, `IsClosed`, `Invoiced`, `LeaseMasterAgreementId`, advance transaction metadata, and aggregate `TotalCharges`. Generic base-class exposure of tenant/audit fields remains canonical backend backlog item 2/6 and cannot be removed inside this feature while the generic service constraints require those bases.

The visible Self/Staff/Other selector and Lease write VMs use `CustomerType`, while the shared `Agreement` entity stores `CustomerTypeIC` (Individual/Company). Numeric casting can persist the Self/Staff/Other value `2`, which is undefined in `CustomerTypeIC`. Changing the shared entity would affect RentalAgreement and is outside this feature freeze. This domain mismatch is **Conflicting** and requires the owner to decide whether the field represents customer category or driver source before the shared model is changed.

## Agreement Documents action contract

- `AgreementDocument` remains the tenant-scoped settings catalog. Only active, non-closed settings rows appear, ordered by Name and Id.
- `LeaseAgreementDocument` is a tenant-scoped owned association containing `LeaseAgreementId`, `AgreementDocumentId`, and server-owned `DocumentPath`. The unique key is `(SubscriptionId, LeaseAgreementId, AgreementDocumentId)`, so each configured type has at most one current file per agreement.
- Read endpoint: `GET /LeaseAgreement/{id}/documents`. Exact response fields are `leaseAgreementId`, `agreementNo`, server-owned `canUpload`, and rows containing `agreementDocumentId`, `name`, and `hasDocument`.
- Upload endpoint: `POST /LeaseAgreement/{id}/documents/{agreementDocumentId}` with one multipart `file`. The authenticated tenant must own the agreement and configured type. The service revalidates state and ownership after file validation and before persistence.
- `canUpload = !IsClosed && !Invoiced`. Viewing the configured rows remains allowed for read-only agreements; upload/replacement is blocked at the API boundary.
- The established `FileStore` is authoritative for tenant folder isolation, signatures, extensions, and the 5 MB limit. Accepted files are valid JPG/JPEG, PNG, and PDF. The physical path is never client-editable or returned by this action.
- A successful upload replaces the current association path and best-effort removes the previous physical file. A failed persistence attempt cleans up the newly uploaded file. Delete and download actions are not demonstrated and are not added.
- This introduces a table/index and therefore requires an owner-run EF migration. No migration or model snapshot is created or edited in this refactor.

## Agreement Discounts action contract

- `LeaseAgreementDiscount` is a tenant-scoped child of `LeaseAgreement` with only `LeaseAgreementId`, `FromDate`, `ToDate`, and `Discount` in addition to the inherited identity/audit fields. `Agreement.Discount` remains the existing header scalar and is not repurposed by this action.
- Read endpoint: `GET /LeaseAgreement/{id}/discounts`. Exact response fields are `leaseAgreementId`, `agreementNo`, server-owned `canEdit`, and rows containing only `id`, `fromDate`, `toDate`, and `discount`.
- Save endpoint: `PUT /LeaseAgreement/{id}/discounts`. Its body contains `leaseAgreementId` and a replacement `discounts` array; a row contains its existing `id` (zero for a new row), `fromDate`, `toDate`, and `discount`. No tenant, agreement number, state, audit, calculated total, or header field is client-writable.
- The shared dialog receives its `agreementId` and display number from the selected list row; it uses the canonical `app-editor-dialog`, `app-editable-collection-table`, typed reactive rows, and date-only canonical `p-calendar` controls. Save calls `markAllAsTouched()` and exposes an inline localized error beneath each invalid date or amount input.
- When an editable agreement has no saved discount rows, the dialog starts with one pristine blank row, matching the supplied workflow capture. It is not persisted until the user completes it and saves; read-only empty collections use the shared empty state.
- `canEdit = !IsClosed && !Invoiced`. Read-only agreements remain viewable, while the API independently blocks mutation.
- Row validation is enforced both client-side and server-side: both dates are required and valid, `FromDate <= ToDate`, Discount is non-negative, existing IDs must belong to the selected tenant-owned agreement, and duplicate exact `(FromDate, ToDate)` periods are rejected. The screenshot does not establish a percent cap, overlap rule, or total-charge calculation, so no upper bound, overlap exclusion, or price recalculation is invented.
- The request is replacement semantics: the client sends all currently retained rows; an empty array soft-removes all existing rows. The aggregate is loaded and reconciled in one `SaveChangesAsync()` implicit transaction. A zero-id row that repeats an active period is safely reconciled to that tracked period, avoiding an accidental remove/add uniqueness collision.
- The tenant-scoped active-row unique index `(SubscriptionId, LeaseAgreementId, FromDate, ToDate)` with `[IsDeleted] = 0` protects the exact-duplicate invariant without blocking soft-deleted history. This introduces a table/index and therefore requires an owner-run EF migration. No migration or model snapshot is created or edited in this refactor.

| UI control or view field | Form control type | Detail DTO | Add DTO | Update DTO | Server-owned? | Validation owner |
|---|---|---|---|---|---|---|
| Agreement number | dialog title text | `agreementNo` | — | — | Yes | API read projection |
| From Date | `Date \| null`, date-only `p-calendar` | `discounts[].fromDate` | — | `discounts[].fromDate` | No | UI required/order; API required/order |
| To Date | `Date \| null`, date-only `p-calendar` | `discounts[].toDate` | — | `discounts[].toDate` | No | UI required/order; API required/order |
| Discount | `number \| null` | `discounts[].discount` | — | `discounts[].discount` | No | UI required/non-negative; API non-negative |
| Existing child identity | hidden typed control | `discounts[].id` | — | `discounts[].id` (zero means new) | Yes except existing-row correlation | API tenant/aggregate ownership |
| Mutation availability | dialog state | `canEdit` | — | — | Yes | API derives `!IsClosed && !Invoiced` |

| Action | Exact source state | Exact target state | ListVM status/flag | Backend interface/service | Controller verb/route/payload | Angular service | UI interaction | Dependency/concurrency rule | Failure and refresh |
|---|---|---|---|---|---|---|---|---|---|
| Agreement Discounts | Tenant-owned LeaseAgreement, including closed/invoiced records | Read for every owned agreement; save only when `!IsClosed && !Invoiced` | No extra list property; the dialog's `canEdit` preserves read-only viewing | `GetDiscountsAsync`; `UpdateDiscountsAsync` loads/reconciles the owned collection | `GET /LeaseAgreement/{id}/discounts`; `PUT /LeaseAgreement/{id}/discounts` with the replacement child array | `getDiscounts`; `updateDiscounts` | List action opens one controlled shared editor dialog; Add/Remove rows and Save are typed/reactive | Child IDs must belong to the loaded aggregate; active exact-period uniqueness is tenant-scoped by a filtered database index after owner migration; one aggregate save; database conflict returns the localized duplicate failure | Both `isSuccess: false` and transport failure are surfaced; successful save closes then reloads the list |

### Unresolved calculation contract

`TotalCharges` is server-owned, but the current implementation obtains it by summing client-supplied child `TotalCharge` values. The persisted tariff snapshot, optional-charge selection rule, discount/tax/advance/deposit formula, rounding, and whether rates may be manually overridden are not established by the screenshots or a LeaseAgreement action contract. The existing Lease tariff calculator is evidence of a possible authority, not permission to replace the agreement formula. Calculation reconciliation is therefore **Uncertain** and blocks a claim of full business completion.

## Action-state inventory

| Screenshot action | Decision | Evidence / exact blocker |
|---|---|---|
| Open/Create | Supported | Generic POST plus current AddVM/service validation. |
| View | Supported | Minimal feature-owned detail projection through both generic detail routes. |
| Edit | Supported for open, uninvoiced rows | Generic PUT plus aggregate reconciliation; `IsClosed`/`Invoiced` are stored server states. |
| Print | Supported | Same detail read model with shared `ReportPrintService`; no new persistence. |
| Basic Export to Excel | Supported | All pages of the frozen ListVM. |
| Delete | **Missing destructive policy** | Screenshot distinguishes Delete from Void; source has no Lease-specific dependency/state/reversal contract. UI must not expose unsafe generic delete. |
| Agreement Documents | Supported | Feature-owned GET/upload endpoints, active settings catalog rows, one tenant-scoped attachment per agreement/type, shared file validation, and server-owned `CanUpload`. |
| Agreement Discounts | Supported for open, uninvoiced rows | Feature-owned GET/PUT action with persisted dated child rows, server-owned `CanEdit`, canonical shared editor/table/date controls, and replacement reconciliation. |
| Add Receipt | **Conflicting** | `Receipt.AgreementId` is validated as `RentalAgreement`; the Lease accounting/allocation contract is absent. |
| Add Deposit | **Missing/Conflicting** | Customer deposits are source-wrapper records; no Lease receipt/deposit source contract exists. |
| Replace Vehicle | **Missing transition** | Delivery/Collection movements can reference base Agreement, but no atomic Lease replacement route, payload, target-state, or vehicle-state contract exists. |
| Replace Driver | **Missing transition** | No Lease driver-replacement aggregate/action or history contract exists. |
| Additional Charges | **Missing** | No Lease additional-charge DTO/entity/action or authoritative calculation rule exists. |
| Extend (Period) | **Missing transition** | Generic Update is not a versioned extension action; source/target states and history are absent. |
| Extend (Rate and Period) | **Missing transition/calculation** | No request DTO, rate authority, historical snapshot, or transaction contract. |
| Close Agreement | **Missing transition/calculation** | `IsClosed` exists, but close payload, fuel/KM/branch validation, final-charge formula, movements, and accounting boundary do not. |
| Billing History | **Missing report** | No Lease billing relation/read DTO; receipts currently target RentalAgreement. |
| Payment Instructions | **Missing** | Partner billing information is not an agreement-owned instruction contract; cheque-row persistence is absent. |
| Void Agreement | **Missing destructive/reversal policy** | No void state, legal transitions, reason payload, voucher reversal, or dependency policy. Soft delete is not void. |
| Log | **Missing read model** | Audit creation fields do not provide the screenshot history; no authoritative Lease event/history aggregate exists. |
| Change Delivery Date | **Missing transition** | No Lease delivery-date property/action and no rule connecting DeliveryMovement to the requested change. |
| Report | **Missing report contract** | No typed filters, response sections/totals, service, or route. |
| Detailed Export | **Missing export contract** | No exact dedicated response; broad navigation graph is not acceptable. |

## Override audit

| Virtual method | Decision | Feature-specific reason |
|---|---|---|
| `AddAsync` | Override | Header/child/FK validation and server-owned aggregate total boundary. |
| `UpdateAsync` | Override | State lock, ownership checks, explicit child reconciliation. |
| `RemoveAsync` | Override | Fail closed until destructive policy is supplied. |
| `DetailAsync` | Override | Minimal no-tracking projection; no recursive graph loading. |
| `DetailWithNavigationsAsync` | Override | Same consumed minimal projection for the current Angular route. |
| `GetManyAsync` | Inherit | Not the route consumed by this feature. |
| `GetManyWithNavigationsAsync` | Override | Frozen filters, sorting, projection, totals, and paging. |

## Route/runtime contract

- Existing lazy route `/LeaseAgreement` and modal editor are retained; no unsupported child routes are invented.
- Agreement Documents is opened from the row action list with the canonical shared `app-editor-dialog` shell and `app-editable-collection-table` collection presentation. It calls the feature-owned GET/multipart endpoints and does not add a route.
- Agreement Discounts is opened from the row action list with the canonical shared `app-editor-dialog` shell and `app-editable-collection-table` collection presentation. It calls the feature-owned GET/PUT endpoints and does not add a route.
- The feature service remains registered in the layout provider and uses the established BaseService client.
- Authentication is inherited from the API/controller and application routing; no authorization API is invented.
- The list uses the canonical `app-feature-title`, `app-primary-action-button`, and `app-data-table` shapes. Feature SCSS owns only the LeaseAgreement page/panel/filter placement and semantic tokens; table internals remain shared. The list grid receives a bounded responsive scroll height so its paginator remains reachable at desktop viewport heights.

## Phase handoff

- PHASE-00 evidence: Frozen for the 24 screenshot classifications above, including the Agreement Documents content/workflow evidence.
- PHASE-01 domain/API: Frozen for list, detail, create/edit, fail-closed delete, Agreement Documents, and Agreement Discounts; calculation and remaining actions are Uncertain/Missing/Conflicting.
- PHASE-02 read/grid: Frozen for list/filter/paging/basic export.
- PHASE-03 detail/write: Frozen for the existing four-tab aggregate editor, Agreement Documents upload dialog, and Agreement Discounts editor dialog, except the calculation formula and new-Provision schedule rule noted above.
- PHASE-04 actions: Frozen for Print, Agreement Documents upload, and Agreement Discounts; all other listed transitions remain blocked by the exact decisions above.
- PHASE-05 integration: Frozen for existing lazy route/modal/provider wiring, Agreement Documents action wiring, and Agreement Discounts action wiring.
- PHASE-06 completion: cannot be marked fully Frozen until the action and calculation decisions are supplied.
