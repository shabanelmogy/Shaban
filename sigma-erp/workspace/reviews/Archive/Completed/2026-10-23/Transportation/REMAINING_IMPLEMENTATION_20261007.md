# Transportation remaining screens — 2026-10-07

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Owned scope | Transportation/TripSheet, Transportation/TransportationInvoice, Transportation/TransportationAgreementItem |
| Handoff | TRANSPORTATION_FRONTEND_CONTRACT_FREEZE.md, including root-accepted discovery deltas |
| Backend | Read-only; producer findings retained |

No screenshots were supplied. This bounded agent implements the confirmed frontend contracts and reports to the root; it does not close the complete Transportation review. Prior Equipment Rental and other agents' changes were preserved. Canonical sources govern because generated packets are stale; root owns documentation, shared owners and final integration.

## Implemented contracts

| Screen | Grid column order after shared Actions | Frontend list properties |
|---|---|---|
| TransportationInvoice | id, no, agreementId, customerId, startDate(date), period | id/no plus the four editable scalars; no nested list navigation/audit/tenant fields |
| TransportationAgreementItem | id, tripTimes, pickUpLocationId, dropOffLocationId, amount(money), isExtra | Exact six displayed fields; no tenant, parent-editable link, vehicle, driver or rates |
| TripSheet Scheduled | tripNo, tripDate(dateTime), pickUpLocation, dropOffLocation, vehicle, driver, notes | Existing TransportationTripsDto snapshot; agreement/customer/itemId/isExtra/amount/invoiced also consumed by actual viewer or actions |
| TripSheet Extra | Scheduled columns plus amount(money), invoiced(translated yes/no) | Same exact producer DTO |

Invoice writes agreementId/customerId nullable positive integer references, calendar startDate and nullable period(max100); Update adds numeric id. Agreement choices use the existing **Agreement/GetSelect** API, not TransportationAgreement or RentalAgreement. Customer options use the existing owning CustomerService. There is no installed Angular service for the generic Agreement endpoint; the feature owns a small typed read adapter rather than pretending another service targets it.

Standalone Item writes nullable clock tripTimes, Branch pickup/dropoff IDs and signed finite amount; Update adds id. Root explicitly retained its current generic Create despite the missing writable parent linkage. No parent ID, subscription, document number, audit fields, driver/vehicle or header rates are sent. Amount has no invented minimum, precision or rounding rule. Invalid historical clock strings remain in the form and fail validation instead of silently becoming null; unchanged valid picker clocks preserve saved seconds/fractions through the shared time helper.

Invoice/Item saved View/Edit read the existing **GetByWithNavigationsId/{id}** endpoint with the same DetailVM, because the ordinary detail reader does not reliably load saved navigation labels. View renders saved names with only actual ID fallback when the relation is absent; it does not load current lookups. Successful option sets survive partial lookup failures, retry remains visible, and saved named choices use mergeSelectOptions. Scalar write snapshots exclude nested UpdateVM navigation graphs.

TripSheet keeps scheduled/extra server-paged reads and the existing ExtraTrip POST/DELETE endpoints. It captures active tab and applied month/agreement/trip-number query, cancels stale list requests and uses exact pageNumber transport. Both tabs use root's shared DataTable unknown-total navigation (`totalRecordsKnown=false`, actual `totalPages`); no fabricated total or all-pages read is used for ordinary listing. All-pages reads are exclusively complete Excel/print output, through fetchAllPages. Scheduled producer metadata remains imperfect and is reported below.

ExtraTrip creates the existing typed action payload: agreementId, local tripDate, clock tripTimes, nullable Branch IDs, signed amount, notes. Driver/vehicle/customer are actual read-only parent context. Ignored driverId/vehicleId are omitted. View renders the returned row names and date/time, amount, notes and invoiced flag; no fabricated detail endpoint or Edit action was added. Existing input-only create/details deep links redirect to the actual list.

Root accepted the initial all-agreements filter and explicit **applied** agreement selection before ExtraTrip Add. This uses the existing optional GET filter and avoids an accidental write context from the first lookup option. It adds no backend required relationship rule.

## Source conformance

| Concern | Owner/reference | Actual target match |
|---|---|---|
| List shell/header/grid | UI1/3/6; inspected Job list and shared DataTable | sigma-route-host/list-page/list-panel/header/table; fill grid, internal rows, shared footer; six legacy feature SCSS files retired |
| Filters | UI4/17/19; FilterPanel/DatePicker/FieldError | Stable layout, mandatory Reset, labelled bounded fields, reserved feedback, validated calendar/exact scalar transport; month default retained |
| Modal content | UI13/15; actual EditorDialog/FormSection declarations | Controlled modes/visibility, contentPadded, no focus-open calendar, one sigma-editor-scroll region, saved View text; View Edit only where CRUD exists |
| Numeric/date/clock | UI17/19/27; shared helpers/directives | Calendar mask/placeholder, local date/date-time transport, finite signed amount and step=any, optional clock; no UTC serialization/private parser |
| Requests/output | UI2/8/21/22/28; list-query/api-error/ReportPrintSession | switchMap/defer list, captured output queries/columns, complete paged reads only for output, both failure channels, inline feedback with skip header, balanced loading |
| Dirty state/actions | UI7/9/10/13; shared ConfirmationDialog | Saved-row identity rechecked after Delete confirmation, pending/saving gates, dirty Cancel/Escape/navigation/reload, protected submitted form snapshot |
| Routes/providers | UI1/26 | Invoice/Item list-owned modal Create/View/Edit aliases; historical details stays View; CanDeactivate delegates to actual editor; existing root services reused |
| Translation | UI23 | Typed EN/AR payload at REMAINING_TRANSLATIONS_20261007.json; root merges and reconciles owning vocabulary blocks |

Filters are actual supported producer predicates. Invoice startDate is an exact calendar date, not a range. Item filters pickup/dropoff IDs, amount and explicit nullable isExtra; false survives URL serialization as text while HTTP retains boolean false. Final source inspection found that generic Convert.ChangeType cannot parse TimeSpan, so **tripTimes is displayed/editable but excluded from filters**, as accepted by the root. Generic stored-column sorting remains available; TripSheet advertises no unsupported sorting.

## Retained producer findings

- TripSheetScheduled pages the combined schedule/extra result before excluding extras; returned scheduled pages/counts can disagree.
- TripSheetExtra computes but omits TotalCount. Custom paging lacks the generic clamp/range boundary checks.
- AddExtraTrip assigns dto.TripDate to CreatedAt, then DbContext Added audit overwrites CreatedAt with UtcNow. Correct frontend wall-clock transport does **not** repair actual trip-date persistence. A domain field/schema or explicit audit-policy decision remains required.
- Trip generation retains its current soft-delete/date/state boundary limitations, broad enumeration and constant Invoiced=false. No new accounting or invoice locks were inferred.
- ExtraTrip DTO driver/vehicle inputs are ignored by its writer. The frontend now displays actual parent context.
- Notes are persisted as item.No; no declared max length was confirmed for this member, so no invented notes length is imposed.
- Standalone Item Create has no writable parent link; generic parent-lock and dependency delete semantics remain backend work.
- Invoice still inherits InvoiceBase without an exposed financial workflow; nested UpdateVM inputs/ReverseMap and oversized read graphs remain producer findings.

No backend/AutoMapper/entity/EF changes were made. No migration is required for these frontend changes. A future true TripDate persistence repair may require an owner-run migration, but that contract is outside this implementation.

## Verification and handoff

21 runtime TypeScript files and six templates were syntax-parsed using the installed TypeScript/Angular parsers; exact local named imports/exports were inspected. Shared public inputs/events were checked against actual declarations, including DataTable rows/rowsPerPageOptions setters and root-added totalPages/totalRecordsKnown. Current installed control/directive metadata was reconciled. Source searches found no runtime any, ms-lib, toISOString, window.print, console actions, stale old screen keys or retired stylesheet consumers. Scoped models/services/routes and component source/diffs were reviewed; git diff --check passes after removing trailing whitespace.

These checks do not establish Angular compilation, runtime, visual, keyboard, RTL, theme or server behavior. Root still owns full-feature integration/translation reconciliation and the complete scoped diff. Owner should verify modal aliases, saved labels/time fractions, partial lookup retry, pending confirmations, dirty navigation/reload, tab/search cancellation, month stepping, unknown-total navigation and complete Excel/print output. Producer date/count limitations must remain visible in the final review.

Suggested frontend commit fragment: `refactor transportation trip sheet and scalar editors` (suggestion only).

The bounded discovery/implementation agent used the inherited model because mapped discovery/worker models were unavailable, with exclusive ownership of these directories and separate review/translation artifacts. No build, test, lint, browser automation, database command, migration/snapshot edit, commit, push or deployment was run.
