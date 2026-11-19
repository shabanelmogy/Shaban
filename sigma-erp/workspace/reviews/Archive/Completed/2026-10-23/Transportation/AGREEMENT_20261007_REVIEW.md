# Transportation Agreement implementation review — 2026-10-07

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Owned scope | Transportation/TransportationAgreement directory only; unique review and translation handoff |
| Frozen handoff | TRANSPORTATION_FRONTEND_CONTRACT_FREEZE.md including remaining-producer append |
| Backend changes | None; read-only producer inspection |

This bounded worker used the inherited parent model after the root froze source contracts. Root owns shared utilities, translations, documents and whole-feature reconciliation. Prior Equipment Rental and concurrent Transportation changes were preserved. No overall feature completion is asserted here.

## Evidence and decisions

No screenshot was supplied. Type01 list-owned Create/View/Edit modal is selected by UI13: fields, one small child collection, rates without totals/posting. Actual shared EditorDialog/FormSection/EditableCollectionTable declarations and Job list/close-job integration were read. Catalog VehicleService modal reference has drifted to routed source; root owns documentation promotion to the actual shared modal owner. Recipe drift uses canonical books and requires owner regeneration/semantic review.

Actual producer evidence: TransportationAgreementController; TransportationAgreementService GET root/GetById, AddAsync/UpdateAsync/CloseAgreementAsync; exact TransportationAgreement Add/Update/Detail/List VMs and TransportationAgreementItem Add/Update/Detail VMs. Detail child locations are BranchDetailVM, so Branch/GetSelect replaces Limousine Location/GetSelect. DriverDetailVM supplies first/middle/last name components; unsupported displayName is removed. No accounting or invoice-lock workflow is invented.

| Concern | Owning book / actual reference / shared owner | Final source match |
|---|---|---|
| Route bounds, title, grid | UI1/3/6; Job list; sigma-route-host/sigma-list-page/panel/header/table + FeatureTitle/DataTable | Fixed list shell with internal grid scroll; former local SCSS removed from metadata and emptied; no viewport-height page calculation |
| Filters and dates | UI4/17; Job list FilterPanel; date-utils/DatePicker/FieldError | Stable six main fields, mandatory Reset, current-month two-month range, complete optional date validation, applied snapshot/page/URL preservation; single editor date mask + dd/mm/yyyy placeholder |
| Dialog/editor | UI13/15/19/27; actual EditorDialog/FormSection public declarations | One controlled modal, explicit modes, contentPadded=true/default focus; bounded form/body/scroll and fixed footer; errors/retry and first-invalid-field focus |
| Child rows | UI14; actual EditableCollectionTable/EditableRows | Typed full snapshot, one binding style, Add focus, saved/edited removal confirmation, pending confirmation gates Save/Add/navigation; empty collection allowed |
| Clock/scalars | UI17/19/27; root shared time-utils/scalar-validators, actual declarations | No private parser/validator or UTC conversion; saved seconds/fraction preserved when clock unchanged; finite numeric transport, existing nonnegative rates preserved |
| Lookups and View labels | UI16/22/28; BaseService.GetSelect/mergeSelectOptions | Branch owner for locations; independent retained lookup successes + visible Retry; saved fallback labels merged; View loads detail only, no lookup requests |
| Paging/output | UI2/6/8/21/28; Job bindListQueries; fetchAllPages/toListParams/dataTableExportRows/ReportPrintSession | switchMap+defer/finalize and both error channels; server response page/size/count retained; cap100 complete output; shared translated Excel and report dialog; row Print loads actual detail |
| Exit/actions | UI9/10/26/28; ConfirmationDialogService | Identified Delete/Close confirmation, confirmation/submission gates, CanDeactivate + beforeunload, deep links list-owned, closed detail cannot switch to Edit; no invented authorization |

## Read and write contracts

Grid order beside ListVM consumption:

- Grid: no, customerName, customerCode, vehiclePlateNo, driverName, startDate, ratePerMonth, ratePerTrip, isClosed status.
- Response consumption: id/no/startDate/ratePerMonth/ratePerTrip/isClosed; customerId + customer(name/no), vehicleId + vehicle(plateNo), driverId + driver(firstName/middleName/lastName). IDs provide neutral identity fallback only. Aggregate/audit/billing/card data no longer belong to the list type.
- Filters: agreementNo, status numeric 1/2, customerId, plateNo, driverId, fromDate/toDate. Null status is All. Server ignores sorting, therefore no sortable headers or misleading sort transport. The producer's upper-day comparison remains documented, not repaired here.

Add payload: startDate (local calendar yyyy-MM-dd), nullable customerId/vehicleId/driverId, ratePerMonth/ratePerTrip, seven weekday flags, nullable notes max2000, items. Current required UI references/time and nonnegative rate validation remain presentation contracts. Update adds parent id and saved child IDs. Each child sends tripTimes, pickup/dropoff IDs and actual amount; new child amount starts at current backend default0. Saved amount is preserved and shown read-only. IsExtra is read-only display and excluded from writes. No, SubscriptionId, parent child FK and saved-time/display-label form bookkeeping never enter payloads. Empty child list remains valid. Rate/day/month and rate/week previews retain old /30 and *12/52 formulas with existing two-decimal preview rounding; day/week stay read-only and absent from payload. Server results remain authoritative.

Legacy details/:id redirects to view/:id; Create/View/Edit compatibility URLs all render the owning list and its modal. List CanDeactivate delegates to the live modal; dirty same-config ID changes ask before replacing, canceled transitions restore the previous URL. Deferred recreation validates current route identity and is canceled on destroy. Successful close/Save returns to the list preserving applied filters/page. Completed child is exempt from its in-flight save gate, so navigation after Save is not accidentally blocked. Browser reload is gated while dirty/saving/confirmation or preparing print.

Close remains POST CloseAgreement with {agreementId} only. Delete remains DELETE root?id. Both identify the record in shared confirmation, handle Result.isSuccess=false and HTTP error inline, preserve applied query refresh and balance shared loading. List Report/Excel load all matching pages via fetchAllPages at100. Report renders every row during shared print preparation; paging returns afterward. Row Print opens actual saved detail in View, without lookup dependencies, then invokes the shared print session with dialog isolation; no window.print remains.

## Reconciliation and limitations

Implemented source changes: list TS/HTML/SCSS, details TS/HTML/SCSS, models list/details/create, service, route table. Existing unrelated billing-info/credit-card-info model files remain unused; no financial fields are consumed. Existing placeholder list spec imports the widgets example rather than this feature; tests are prohibited here and that historic test fixture is not represented as verification.

Source checks: TypeScript syntax for9 runtime files and Angular parsing for2 templates passed. Exact named shared imports checked against actual file exports. Direct standalone imports and shared inputs were compared with their current owners, including installed PrimeNG Calendar ariaLabel/showSeconds and Dropdown ariaLabel/loading; app files already explicitly contain both runtime components. es2018/dom compatibility retained, with no flatMap/new framework APIs. Scoped whitespace check passes. Root performs complete feature translation reconciliation and final diff integration. Translation payload: AGREEMENT_20261007_TRANSLATIONS.json, each owning leaf contains en/ar; no i18n file was modified by this worker.

Read-only backend findings remain: oversized nested ListVM; ignores sorting; upper date comparison excludes possible end-day times; Update lacks a closed-state boundary; no demonstrated child-location/state/deletion-reference validation; tenant/context custom queries and generic child reconciliation require their own backend review. Delete/Close are authorization candidates at DELETE TransportationAgreement?id and POST TransportationAgreement/CloseAgreement; hiding controls is not security. No backend/entity/EF/map/schema change or migration is needed for these frontend fixes. No accounting effect is asserted.

Owner acceptance: compile application; exercise Create/Save/Edit and both save failure channels, removal/discard accept/cancel, closed record deep link, same-route record changes, reload/exit gates, failed lookup+Retry with saved selections, seconds/fraction preservation and local date reload, current-month Reset/status1/2/search/paging/refresh snapshot, multi-page Excel/list report and actual-detail row print/cancel, desktop/narrow/RTL/light/dark focus and scroll. Prohibited build/test/lint/browser/database/migration/snapshot/commit/push/deploy commands were not run.

Suggested frontend commit after owner checks: `refactor transportation agreement list and modal contracts`. Overall Transportation reconciliation remains root-owned.

Read adapter evidence: Agreement's custom DetailAsync override (TransportationAgreementService lines110–137) already loads Customer/Driver/Vehicle/Items and both child Branch locations, with tenant and soft-delete predicate. GetById is therefore retained; the generic deep adapter needed by sibling scalar features is unnecessary here. Report bounded content uses shared sigma-editor-form → sigma-editor-body → DataTable fill chain, not an intrinsic-height pane, and report paging consumes DEFAULT_PAGE_SIZE.


Optional cleared date range is serialized with dateFilter=true in list and return URL state; restore retains null for that marker, while first visit defaults current month. Grid count consumes actual totalCount or0, never current-page length.

