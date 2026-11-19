# Rental feature review — 2026-10-06

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

Requested outcome: review the complete Rental frontend module and implement confirmed canonical-guide fixes. Frozen disposition and impact map: `RENTAL_MAINTENANCE_EVOLUTION_PLAN.md`. No new screenshots or business requirements. Existing unrelated user changes are preserved; backend contracts are read-only unless a specifically frozen directly related correction proves necessary.

## Pre-edit conformance evidence

| Concern | Owning block | Reference / shared producer | Target before implementation |
|---|---|---|---|
| List container/scroll | UI1/3/6 | Job list `host.class=sigma-route-host`; shared `styles.scss` shell; DataTable `fill` | Live Rental lists use local shells/styles; compare and migrate individually |
| Filters/reset/alignment | UI4/17 | Job `form[appFilterPanel]`, `stableLayout=true`, `resetRequested`; shared currentMonthRange/parseDateRange | Local strips and paging copies require migration; retain actual API keys |
| Dialog vs routed editor | UI13 D4-2 | Job routed editor; VehicleService modal; EditorDialog contentPadded | Classify each live editor by child/totals/approval source, not earlier visual layout |
| Error ownership | UI22/28 | Job stream; shared apiErrorMessage and `X-Skip-Error-Interceptor` | Local extraction/error duplication and loading lifecycle require audit |
| Pricing/notification ownership | BE16; Master5 | NotificationsSettingsModelService.UpsertByKeyAsync; FieldsSettingsService; live Booking/Agreement tariff charges | Five unused frontend roots duplicate or misrepresent authoritative contracts; retired per frozen plan |
| Planner exception | Historical frozen planner contract; UI1/4/17/22 | Existing grouped p-table timeline | Preserve approved grouped timeline exception; canonical shared list grid cannot render its semantics |

## Phase and verification boundary

00 discovery, 01 source-contract freeze, 02 read/grid, 03 detail/write presentation, 04 existing confirmation/action guards, 05 integration and 06 scoped reconciliation apply. Generated packets are stale except01, so canonical sources govern. Domain implementation and schema migrations are excluded unless an exact contract is frozen. No restricted verification commands will be run; owner build/runtime/RTL/theme/print verification remains pending.

## Shared extraction

Reuse existing shared owners first; no feature-specific copy is introduced. Each workstream must record repeated capability gaps and reusable extractions (book + skill together when required).

## Final result and manifest

Confirmed frontend findings were implemented across the eight live Rental roots: Agreement, Booking, RentalQuotation, MasterAgreement, RentalTariff, TariffCard, DriverTimeSheet and RentalPlanner. Source contracts and existing state transitions remain unchanged. The three Frozen handoffs (CORE_UI, AUX_UI and WRITE_UI) and the Frozen maintenance plan govern the result. The complete path/status inventory is `Rental/FINAL_SOURCE_INVENTORY.md`; discovery artifacts preserve the original evidence and excluded decisions.

Five obsolete standalone CRUD roots were retired according to the Frozen plan: BookingCharge UI/models/routes, BookingNotificationFlags, RentalBookingNotification, RentalNotificationEvents and RentalQuotationSettings. The live Administration settings owners remain intact. BookingChargeService remains at its original path with root provision because Lease/closedLeaseAgreements imports it. Four unreachable DriverTimeSheet generic details/spec files were also retired. No persisted records or database objects were removed.

The directly related shared changes are: Rental route removal, obsolete layout providers/imports removal, toolbar duplicate-title suppression, EN/AR Rental vocabulary, and optional inline-error suppression on TariffSettingService. Existing changes in shared routing/layout/toolbar/translations were compared against the task-entry snapshots, rather than treated as Rental changes against HEAD. No reference module was edited.

## Decisions taken and final contracts

| Decision | Evidence and final result |
|---|---|
| Evidence classification | No new screenshot, video or written business specification was supplied. Current source plus canonical books and Frozen handoffs supply the evidence. Historical screenshot requirements are not new user requirements. |
| UI shapes | Agreement/Booking/Quotation are routed document aggregate editors; MasterAgreement retains its current routed create/view fields. TariffCard is a normal entity modal. RentalTariff retains the Frozen dense configuration dialog exception. DriverTimeSheet remains an operational agreement/all-days workspace. Planner retains its approved grouped timeline report exception. |
| Backend shapes | Existing aggregate writers for Booking/Agreement/Quotation/Tariff and DriverTimeSheet; current MasterAgreement and TariffCard writers; Planner report. Backend source was inspected read-only; no DTO, entity, service, controller or mapping change. |
| Contract boundary | Existing endpoints, editable inputs, full child snapshots, saved IDs, replacement semantics, enums and business flags are preserved. Optional service headers control UI error/toast ownership only. No new permission or authorization mechanism. |
| Calculation ownership | Backend remains authoritative for charge totals, taxes, durations, balances, overtime, holidays and state. Existing frontend previews are retained for editing; calculated totals are omitted from aggregate Add/Update payloads. Booking/Agreement View total uses the returned totalCharges; Quotation View lines/totals use persisted responses. Journal sums and amount-in-words are existing presentation calculations. |
| AutoMapper | No changes; existing mappings retained. No Ignore/ReverseMap additions. |
| Migration | None required. No schema or EF change; no suggested migration name. |
| Shared extraction | Existing shared owners suffice: FilterPanel, DataTable/export/paging helpers, FormSection, EditorDialog/Tabs, FieldError/StateMessage, SummaryCards, NumericFocus/QuantityInput, DatePicker/date parsers, EditableRows, focusField, confirmation and DocumentUploadTracker. No new reusable rule was established, so no book/skill promotion is needed. |
| Missing business choices | Weekly/monthly tariff calculation selection, unsupported protection types/extra units and the historical MasterAgreement Date/PO/PaymentTerms redesign remain outside this presentation task. Equipment Rental/TimeSheet mismatch is a separate scope and was not repaired or retired. These do not block the confirmed current-source Rental fixes. |

The displayed grid properties are recorded beside their response contract. Actions are the shared leading column and are not a new DTO field. Existing compatibility/action metadata is retained; this task does not authorize backend ListVM reduction.

| Grid | Final column order | ListVM properties / necessary metadata |
|---|---|---|
| Agreement | no, status, poNo, type, vehicleType, vehiclePlateNo, makeAndModel, notes, customerType, customer, customerCode, driver, dateAndTime, returnDateAndTime, rate, branch, salesPerson, saleOrigin, createdBy, totalCharges, advance, deposit | RentalAgreementListVM same displayed properties; id, branchId, salesPersonId, isClosed/isVoided/invoiced, canEdit/canDelete/canUnclose/canVoid retained as source compatibility/action state. |
| Booking | no, plateNo, vehicleType, pickUp, pickUpLocation, makeAndModel, customer, customerCode, createdBy, salesPerson, saleOrigin, status | BookingListVM same displayed properties; id/type, canEdit/canDelete/canConfirm/canCancel/canNoShow/canAddDeposit/hasJournal retained. |
| RentalQuotation | no, date, customerName, customerCode, amount, internalApproval, customerApproval | RentalQuotationListVM same displayed properties; id, canEdit/canDelete/canApproveInternally/canRejectInternally/canApproveByCustomer/canRejectByCustomer/canRevise/canUnapprove/canCreateMasterAgreement. |
| MasterAgreement | masterAgreementNo (display alias for no), date, customerName, customerCode, quotationNo, approvalStatus | RentalMasterAgreementListVM id/no/date/customerName/customerCode/quotationNo/approvalStatus. Approval is displayed in the shared status column rather than local number-cell markup. |
| RentalTariff | name, detail, notes | VehicleType list owner id/name/detail/notes; configuration uses Tariff/GetEditor, not a fictitious Tariff list. |
| TariffCard | name, discountPercentage, fromDateTime, toDateTime | TariffCardListVM id/name/discountPercentage/fromDateTime/toDateTime. |
| DriverTimeSheet | workDay/dayName, driverName/driver selection, isHoliday, workingHours, driverOvertimeHours, invoiceOvertimeHours | Operational row id/agreementId/driverId/driverName/workDay/dayName/workingHours/overtime/isHoliday/canEdit; payload retains editable driver/workDay/hours and identity only. |
| Planner | vehicleType group, plateNo/makeAndModel/current status, date/hour reservation cells | vehicleId/vehicleType/plateNo/makeAndModel/statusCode/reservations(start,end,BKG/HIR); read-only, no paging. |

Filters retain the exact typed keys in the Frozen contracts and models. Agreement/Booking retain PageNo/PageSize casing; MasterAgreement/Quotation retain pageNo/pageSize. All use the existing Filters[key] shape. Ordinary lists use default15 and choices10/15/20/50/100, resolveListPaging, source-supported sort whitelists, server totals and cancellation. Core full exports use fetchAllPages and fail the entire export if any page fails; ordinary grid exports use dataTableExportRows. Agreement's distinct detailed export remains a separate column contract. Range defaults are the current month, including Planner; zoom and grouped timeline semantics remain unchanged.

## Final conformance reconciliation

| Concern / book | Final source match | Remaining owner verification |
|---|---|---|
| Shell/title/scroll — UI1/3/6/13 | Live routes carry sigma-route-host; shared list/editor chains fill the container. Lists use DataTable fill. Routed forms use bounded shared body/scroll/footer; Booking documents and Quotation items use fillHeight/sticky collection regions. History/journal/log dialogs avoid a second vertical table scrollbar. Toolbar suppresses duplicate Rental titles. | All breakpoints, no page scrollbar, fixed title/filter/paginator/footer. |
| Filters — UI4/17 | FilterPanel stableLayout/reset, shared fields and reserved FieldError messages; typed ordered ranges. TariffCard has no invented filters and has explicit failed-read Retry. | Reset/advanced counters, alignment, keyboard order. |
| Fields/collections — UI14/15/16/19/27 | Shared field/error/numeric owners; EditableRows preserves saved identity and same-row confirmation. Add focuses the row's first control. Quotation units use QuantityInput; money/rates/hours keep numerical roles. Numeric read values use shared highlight. | Mouse/keyboard Add/Remove, zero replacement, precision and invalid-field focus. |
| Dates — UI17 | Every live calendar uses appDatePicker; single date/month masks and matching validators. Typed single dates normalize with parseDateValue; ranges use parseDateRange; local time uses toApiDateTime without Z. Booking document dates reload as local midnight. Date ordering/business bounds remain. | Picker and DD/MM/YYYY/manual partial values, month expiry, local-time reload and date bounds. |
| Totals — UI24 | Existing SummaryCards public API uses slim/row/min140/max80 and typed money format. Values retain preview/persisted ownership. | Responsive density and authoritative returned totals. |
| Dialog/action lifecycle — UI10/13/22/28 | Shared EditorDialog padding/title/subtitle/states. Dirty route exits use CanDeactivate and shared confirmation. Forms lock during Save and pending discard; competing close/upload/cleanup/removal paths are gated. Reason/date input workflows remain typed dialogs. | Cancel/confirm/repeated clicks, browser Back, View→Edit, stale responses and parent refresh. |
| Upload cleanup — UI18/22/28 | Booking and Agreement deposit use editor-scoped DocumentUploadTracker. Original files survive discard/failed save. Cleanup follows successful persistence; failures retain retry state. Retry never resubmits the saved aggregate/deposit. Composite success toast occurs once after cleanup. Agreement immediate saved document endpoint remains selectionOnly FileField without aggregate staging. | Upload/replace/remove, save failure, discard cleanup failure, save-success cleanup failure, retry and no double persistence. |
| Loading/errors/interceptors — UI22/28 | Both response-failure and transport-failure branches remain; inline owners use skip-error headers and shared formatters. Required lookup failures block Save with recovery. Ordinary mutation success remains interceptor-owned. Planner initial search starts after make lookup completion. | Network failures, lookup retries, cancellation and exactly one success/error notification. |
| Theme/RTL/print — UI24/25/27 | Feature shell/palette copies removed. Shared tokens/logical properties own appearance. Planner retains only Frozen matrix geometry/status semantics; feature print documents retain their required print layout. | Arabic/English, light/dark, narrow desktop/mobile, printable output and matrix sticky columns/month performance. |
| Integration — UI1/2; Master5 | Feature route guards, runtime local imports/exports, retired module references and existing explicit app-file configuration inspected. BookingCharge compatibility consumer retained. | Owner Angular compilation and runtime navigation. |

## Phases applied

| Phase | Result |
|---|---|
| PLAN-00 | Frozen maintenance disposition/impact map applied; existing owners reused and obsolete duplicate roots removed. |
| 00 | Current-source discovery and functional/API evidence completed; no new screenshots to classify. |
| 01 | Three frontend handoffs Frozen against unchanged backend contracts. |
| 02 | Shared list/filter/paging/export/read presentation implemented. |
| 03 | Routed/modal/operational editor and child write presentation/lifecycle implemented. |
| 04 | Existing domain action confirmations, typed reason/date dialogs and guards reconciled. No new state transition or backend domain implementation. |
| 05 | Routes/providers/toolbar/translations/interceptor and upload lifecycle integrated. |
| 06 | Scoped source diffs reconciled, import/template/vocabulary/whitespace inventories checked; runtime acceptance remains pending. |

Backend/schema implementation was skipped because the confirmed fixes are frontend presentation/adapters with unchanged Frozen APIs. Generated PLAN-00/PHASE-00/02–06 still require owner regeneration and semantic review; the drift check does not authorize editing generated files.

## Source-only verification and owner handoff

Final verification evidence is recorded in `Rental/FINAL_SOURCE_VERIFICATION.md`. TypeScript syntax/local import/export inventory covers83 files; Angular template parsing covers28 templates. These are parsing/inventory checks, not compilation or tests. Rental EN/AR key parity, duplicates/references, mandatory Check-Translations and scoped Git whitespace/conflict/stale-reference checks are included there. Both actual repository roots were confirmed. Backend working tree is unchanged. Complete scoped frontend diffs were reviewed; unrelated shared changes were preserved against entry snapshots.

Owner verification remains required: compile the Angular application with its existing explicit tsconfig.app.json entries; exercise all live lists/editors/actions, more-than200-row exports and failed-page export; test date/amount invalid input, unsaved exits and the cleanup-failure paths; verify Arabic/English, RTL, light/dark, responsiveness, page/internal scrolling and print; verify Planner current-month/hour-zoom performance and initial/retry reads. Source parsing does not prove template typing, DI, runtime HTTP behavior or visual layout.

Suggested frontend commit message: `refactor(rental): align live screens and editor lifecycles with Sigma UI contracts`. No backend commit suggested; no backend changes. Commit only the reviewed task-owned portions of already-dirty shared files. No commit or push was performed.

## Agent utilization and prohibitions

Bounded discovery roles `core_review`, `aux_review` and `contract_audit` inspected separate core/auxiliary/write contracts. Implementation roles `core_implementation`, `aux_implementation` and `write_implementation` were assigned nonoverlapping feature folders after freezing the handoffs; shared wiring and translations remained root-owned. Model settings were inherited where required by the orchestration fork. Delegation reduced independent source-discovery/implementation time across the large module; agents returned partial artifacts/source work before usage limits interrupted them. Root completed, integrated and reviewed the final changes. No agent declares overall completion independently.

No build, test, lint, browser/application verification, database command, migration, model snapshot edit, commit, push, deployment, Graphify or Sigma MCP action was run. Status remains Implemented — source-only; owner verification pending yes.

## Follow-up: owner-reported Angular errors

The owner supplied three compilation diagnostics after source-only handoff. Corrected the Agreement customer-type radio caption from option.label to its actual option.key; implemented the Quotation contact Retry handler through the existing version-guarded loader, with pending/editor-state guards; and initialized Quotation activeFilters from currentFilters after the typed filter form is created, rather than assigning an incomplete empty object. No API/model contract was weakened.

Affected files: Agreement details HTML; RentalQuotation details TS/HTML and list TS. Reviewed the bindings and initializer order. Repeated source parsing/import inventory (83 files), template parsing (28 templates) and scoped git diff --check without errors. These checks do not establish Angular template typing; a new owner compilation remains pending. No build/test/lint was run. No subagent was used for this small, sequential correction.

## Follow-up: DriverTimeSheet Reset placement

Explicit owner request places Reset beside the agreement search/selector. DriverTimeSheet list HTML enables FilterPanel inlineActions with inlineActionCaption="general.actions", the UI4 supported placement for a short validated strip. Shared caption alignment keeps the button on the input line while FieldError feedback remains reserved below it. Existing reset handler, validation, busy/discard gates, responsive behavior, RTL and shared appearance are retained. No local positioning CSS or duplicate Reset was added. Source-only; visual acceptance pending. No build/test/browser verification or subagent was used for this small presentation change.

## Documentation-confirmed frontend follow-up — 2026-10-09

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Authorization | Review src/app/modules/Rental and apply documentation-confirmed changes; continued by owner |
| Frozen handoff | RENTAL_FRONTEND_FOLLOWUP_CONTRACT_FREEZE.md, retaining historical maintenance/core/aux/write contracts |

This continuation covers the eight live roots and directly related guide,
settings service and translation wiring. No screenshots, new business scope or
new permission decision was supplied. Historical unsupported MasterAgreement
fields, tariff-choice business gaps, new financial/state workflows and retired
roots remain outside this follow-up. Current source, canonical Master/UI blocks
and the required skill govern; approved references are Workshop Job list/editor,
Movements Collection deferred guard and Workshop Job invoice-customer currency
wording. Existing typed shared owners are reused.

### Implemented findings and final conformance

| Concern / owner | Final source evidence and decision |
|---|---|
| Applied list state — UI10/2 | Agreement, Booking, Quotation and Master lists restore and write through readListRoute/writeListRoute. returnQueryParams uses activeFilters plus page/sort; drafts are not applied on editor return. dateRange=all retains cleared ranges; Agreement false complimentary is serialized as text. Editor View-to-Edit and return keep incoming state. Backend filter names, request casing, sort whitelist, paging and export remain unchanged. |
| Pending discard — UI10/28 | Agreement/Booking/Quotation/Master/Driver route guards defer side effects and recheck identity/busy state at subscription/acceptance. Cancel retains values/dirty state; rate and holiday disabled controls remain disabled. Pending flags release even on stale completion, with restoration gated to the matching editor. |
| Child/dialog controls — UI10/13 | Agreement deposit, delivery date, salesperson, void, document upload; Booking deposit; Quotation rejection/master creation; TariffCard and RentalTariff explicitly freeze typed controls during pending discard. Tariff restores its periodic shape and standalone selectors. Existing upload/cleanup gates remain. |
| Date-only hydration — UI17 | Booking document dates, Agreement delivery context, Quotation date, Master creation context, list restores and Planner range use toPickerDate. TariffCard time-enabled controls and all other existing wall-clock transport remain. No UTC date conversion introduced. |
| Money — UI19/24 | Agreement/Booking/Quotation private preview rounding copies replaced by shared roundMoney at existing two decimals. Agreement print money/deductibles/excess rates use MoneyPipe with standalone registration; quantities/percentages remain numeric. Stable print loops track actual control/charge objects. Backend totals/calculations remain authoritative and payload-derived-field exclusions unchanged. |
| Deposit wording — UI19/2/22 | Agreement deposit uses shared amountInWords and CommonDTO currency labels/decimals. Hardcoded Dirham/Fils converter removed. Settings are read in the inline lookup batch; failure/Retry retains entered values. CommonSettingsService optional skipErrorInterceptor reuses existing header; default callers retain global feedback. Existing endpoint/payload shape retained. |
| Loading — UI22 | Primary Agreement/Booking dialog reads/saves and Quotation master creation/context now pair LoadingService start with finalize end. Invalid-ID return precedes loader start. Local busy/error signals remain; auxiliary option/settings reads remain local. |
| Deferred/stale work — UI28 | All scoped queueMicrotask callbacks replaced with timer plus destruction teardown. Quotation print retains two frames with tracked cancellation onDestroy and record/load-version checks. Agreement Logs ignores stale hidden/record/version responses; Retry requires visibility. |
| Invalid input focus — UI27 | Void/Delivery date/Master create/master dialog/Quotation rejection select their existing invalid input IDs through shared focusField. Existing validators/order/requiredness retained. |
| Guide — Master7/UI23 | New bilingual rental-guide.ts covers all eight roots and parent-owned child workflows; registered once in GuideReader and Rental sidebar at /UserGuide/rental. Master creation is documented from eligible Quotation with readonly customer context; no nonexistent list Create/Edit/approval action claimed. TariffCard optional period/discount, Driver locks/holiday/overtime and Planner range/zoom/status meanings are covered. Missing Arabic Rental sidebar/title keys filled. |

### Contracts, phases and unchanged producers

Phases00/01: existing source discovery and frozen follow-up evidence confirmed.
Phase02: list-state adapters. Phase03: editor/dialog lifecycle, hydration and
wording. Phase04: existing action-dialog UI only; domain transitions retained.
Phase05: guide/menu/settings feedback/translation integration. Phase06: scoped
diff reconciliation. No new plan or backend implementation phase was required: the
existing Frozen maintenance disposition is retained. No screenshot classifications
or unresolved new Missing/Conflicting/Uncertain business decisions exist.

Grid columns and ListVM properties remain the exact eight pairs in the existing
"Grid and ListVM" table above; no list column, VM field or API filter changed.
All Add/Update/API/domain/AutoMapper contracts remain frozen; backend source is
evidence only. Backend scoped diff is empty. No entity/EF/schema change was made:
no Add-Migration is required and no migration name is suggested. Frontend preview
rounding/wording is presentation only, and write payloads retain client inputs.

### Changed application files

Frontend repository: `F:/My Work/Sigma/SiGmaAngularFrontEnd`. Rental was clean
at entry. Task-owned paths/portions are:

- `src/app/modules/Rental/Agreement/components/billing-history/billing-history.component.ts`
- `src/app/modules/Rental/Agreement/components/delivery-date/delivery-date.component.ts`
- `src/app/modules/Rental/Agreement/components/deposit/deposit.component.ts`
- `src/app/modules/Rental/Agreement/components/details/details.component.html`
- `src/app/modules/Rental/Agreement/components/details/details.component.ts`
- `src/app/modules/Rental/Agreement/components/discounts/discounts.component.ts`
- `src/app/modules/Rental/Agreement/components/documents/documents.component.ts`
- `src/app/modules/Rental/Agreement/components/list/list.component.ts`
- `src/app/modules/Rental/Agreement/components/logs-dialog/logs-dialog.component.ts`
- `src/app/modules/Rental/Agreement/components/print/print.component.html`
- `src/app/modules/Rental/Agreement/components/print/print.component.ts`
- `src/app/modules/Rental/Agreement/components/sales-person/sales-person.component.ts`
- `src/app/modules/Rental/Agreement/components/void/void.component.ts`
- `src/app/modules/Rental/Booking/components/deposit/deposit.component.ts`
- `src/app/modules/Rental/Booking/components/details/details.component.ts`
- `src/app/modules/Rental/Booking/components/history/history.component.ts`
- `src/app/modules/Rental/Booking/components/journal/journal.component.ts`
- `src/app/modules/Rental/Booking/components/list/list.component.ts`
- `src/app/modules/Rental/DriverTimeSheet/components/list/list.component.ts`
- `src/app/modules/Rental/MasterAgreement/components/create/create.component.ts`
- `src/app/modules/Rental/MasterAgreement/components/list/list.component.ts`
- `src/app/modules/Rental/RentalPlanner/components/list/list.component.ts`
- `src/app/modules/Rental/RentalQuotation/components/details/details.component.ts`
- `src/app/modules/Rental/RentalQuotation/components/list/list.component.ts`
- `src/app/modules/Rental/RentalQuotation/components/master-agreement-dialog/master-agreement-dialog.component.ts`
- `src/app/modules/Rental/RentalQuotation/components/rejection-dialog/rejection-dialog.component.ts`
- `src/app/modules/Rental/RentalTariff/components/details/details.component.ts`
- `src/app/modules/Rental/TariffCard/components/details/details.component.ts`
- `src/app/modules/Administration/Settings/services/common.service.ts`
- `src/app/modules/UserGuide/content/rental-guide.ts (new)`
- `src/app/modules/UserGuide/components/reader/guide-reader.component.ts (Rental registration only)`
- `src/app/_metronic/layout/components/sidebar/sidebar-menu/sidebar-menu-data.ts (Rental guide entry only)`
- `src/app/modules/i18n/vocabs/en.ts (Rental guide key only)`
- `src/app/modules/i18n/vocabs/ar.ts (Rental guide and missing Rental sidebar keys only)`

Documentation/evidence: frozen follow-up handoff, this review continuation,
Rental/2026_10_08_CORE_FOLLOWUP.md, Rental/2026_10_08_AUX_FOLLOWUP.md and static
Rental/2026_10_09_source_inventory.cjs. Optional Common settings feedback is
promoted in canonical UI2/22, UI preamble1.94, CHANGELOG and the required
sigma-screen-refactor skill/revision history. Unrelated Fleet/Sales/Lease/shared
changes present or concurrently added were preserved; they are not this task's
source changes. Do not commit the entire dirty shared-file diffs as Rental.

### Verification evidence and remaining limits

Root reviewed complete scoped frontend diffs in batches, including shared-file
Rental portions and new guide content, and the separate backend scoped diff.
git diff --check passes. Scoped scans find no merge markers, remaining
queueMicrotask, forbidden DestroyRef.destroyed usage or silent undefined handler.
TypeScript static parsing/import/export inventory covers87 directly related
files: syntax and named-export diagnostics are empty. Angular template parsing
covers28 templates with no parse errors. These checks do not type-check or
compile Angular. Static guide inventory confirms8 exact routes, nonempty EN/AR
text, all guide title keys and no duplicate Rental vocabulary leaves. Mandatory
Check-Translations reports787 EN/AR keys, zero missing or case-only differences
across the scoped Rental blocks.

At verification time the shared GuideReader contains a concurrently added
`../../content/lease-guide` import with no file yet present. This is an unrelated
Lease integration risk, preserved for that workstream/owner; Rental guide import
and registration resolve. No unrelated source was removed to hide it.

Recipe -Check: before edits only PHASE03 was stale. After synchronized owning-book
changes, PLAN00 and PHASE00/02/03/04/05/06 are stale; PHASE01 matches. No generated
file was edited. Owner must regenerate and semantically review derivative packets.

Owner verification: compile frontend with its existing explicit tsconfig roots;
exercise filter/page/sort return through Create/View/Edit/Print and browser Back;
try Cancel/Confirm/repeated clicks and changed identities while dirty; verify
rate/holiday/period/discount locks; fail/retry Common settings and primary reads;
check one loader/error/success owner; verify attachment cleanup Retry without
resubmitting; open /UserGuide/rental and all8 topics in both languages; check
keyboard focus, print, RTL, themes, narrow layouts and scroll bounds.

Suggested frontend commit: `fix(rental): preserve list state and harden editor lifecycles`.
No backend commit is suggested. No commit was performed.

### Agent utilization and execution boundary

Bounded core_followup and aux_followup implementation streams (gpt-5.6-sol)
owned nonoverlapping core-list/Quotation/Master and auxiliary roots after the
freeze. Their source/evidence survived interruption; root reconciled them and
completed remaining dialog/loading/deferred/guide fixes. Earlier read-only
explorers returned no retained completion and are not credited with implementation.
A gpt-5.6-sol core_final_audit read only the focused core diff, found the pending
flag finalizer ordering defect, then verified the root correction. Delegation
reduced independent review time; final integration and complete diff accountability
remained root-owned.

No build, tests, lint, browser/application verification, database command,
migration, snapshot edit, commit, push, deployment, Graphify or Sigma MCP action
was run. Status is Implemented — source-only, with owner verification pending.

## Owner follow-up: DriverTimeSheet Save remains available — 2026-10-09

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

Explicit owner instruction keeps Save available when data is incomplete;
validation appears on click. The frozen follow-up handoff records this amendment
and pre-edit UI19/27/13 conformance evidence (Workshop Job editor and shared
FieldError/PrimaryActionButton/focusField). DriverTimeSheet retains its operational
workspace shape and invoiced CanEdit contract.

Changed frontend files: DriverTimeSheet/components/list/list.component.ts and
.html; UserGuide/content/rental-guide.ts (Driver topic at /UserGuide/rental).
The button no longer gates on invalid/pristine/empty rows, and its footer appears
before selecting an agreement. saveDisabled now covers only pending operations,
failed reads and the existing domain edit lock. save calls markAllAsTouched and
checks agreement/rows/driver/hours before submitting. Missing drivers now show
shared FieldError under their row; invalid-submit navigation opens the affected
row editor and focuses its dropdown/hour input through shared focusField.
The existing agreement validation also works before selection. No validators,
API/write shape, columns/ListVM pairs, formulas, mappings or domain rules changed.

Phases03/06 applied, guide updated under Master7. Other phases have no new work
for this UI-only correction. No screenshots or unresolved business decisions.
No backend/schema changes, Add-Migration or backend commit required. Suggested
frontend commit: `fix(rental): validate driver timesheet on save`.

Reviewed the complete scoped Driver diff and guide addition, preserving earlier
changes. TS source parsing of the two changed content/component files and Angular
parsing of the changed template report no syntax errors; git diff --check passes.
Existing FieldError registration and focusField named export/inputId wiring were
verified. Driver translation parity passes. These checks are source-only, not
compilation. Owner verification: Save before selecting an agreement; select an
editable agreement and Save unchanged; clear a driver/enter invalid hours and
verify messages/focus/no HTTP write; complete fields and Save; verify busy/discard
and invoiced locks still prevent writes. Confirm guide in both languages.

Packet drift unchanged: PLAN00/PHASE00/02–06 stale, PHASE01 current; canonical
books used, generated refresh/semantic review owner-pending. No build/tests/lint,
browser, DB, migration/snapshot edit, commit/push, Graphify or Sigma MCP. No
subagent used because this correction is small and sequential.

## Owner follow-up: blank Branch-wise Tariff Settings — 2026-10-09

Status: Implemented — source-only; owner visual/runtime verification pending.
Owner confirms the entire dialog body is blank, rather than a visible table
with no rows. The explicit Frozen amendment in
RENTAL_FRONTEND_FOLLOWUP_CONTRACT_FREEZE.md records UI13 single-section modal,
UI14 editable collection and shared EditorDialog/EditableCollectionTable/global
form-shell declarations as the pre-edit conformance evidence.

Changed RentalTariff/components/list/list.component.html: supplies shared
EditorDialog.height `min(560px, calc(100dvh - 24px))`, joins the body and form to
the shared sigma-editor-form flex chain, and replaces the separate table cap
with fillHeight/stickyHeader. This gives the body bounded available space and
makes the table frame the scroll owner; header/footer and Add remain outside
row scrolling. Consolidated duplicate addDisabled bindings retain loading,
save, discard and removal gates. No feature/shared CSS was added.

The source supports this layout correction, but cannot certify the exact
runtime cause of the owner's blank body. Owner check: open settings during
loading, after successful/failed reads and with zero saved settings; verify
the Add button/headers/empty message or Retry remain visible. Add enough rows
to scroll and verify fixed dialog header/footer, dropdown overlays, validation,
responsive/RTL/theme presentation. Existing GET returns saved settings only;
empty results are legitimate and must still show the table/empty state.
The Branch lookup, branchId/adjustment DTO, [-100,100] required validation,
duplicate branch check, full-replacement PUT and shared backend remain unchanged.
No implicit branch rows/default settings were introduced.

Updated UserGuide/content/rental-guide.ts, Rental tariff parent topic at
/UserGuide/rental, with EN/AR saved-row/empty/Add/adjustment/scroll/Retry behavior.
Existing guide registration and Rental menu remain. Angular17 template parsing
and guide TypeScript syntax parsing report no errors. rentalTariff translation
parity: 133 EN/133 AR, no missing or case-only keys. Scoped diff/whitespace review
passes. These are source checks, not compiler or runtime verification.

Phases03/06 apply; no backend/API/schema/migration or other feature phase work.
Suggested frontend commit: `fix(rental): bound branch tariff settings content`.
No build/tests/lint/browser/database/migration/snapshot/commit/push/Graphify or
Sigma MCP action, and no subagent. Prior Rental and unrelated edits retained.

Owner also requests continuous packet maintenance. Master8, AGENTS, skill,
templates and manifest now require same-task generator refresh plus semantic
review/final Check. All eight packets refreshed and Check passes; Phase03's stale
Fleet modal reference was reconciled to UI13/shared composition. See
SIGMA_CONTINUOUS_PACKET_MAINTENANCE_2026-10-09.md for the scoped documentation
diff, semantic evidence and verification. Earlier packet-pending notes remain
historical; current packets are synchronized.

## Owner feedback: settings body remains blank — 2026-10-09

The owner reports that the previous layout correction did not resolve the
visible problem. Do not treat that correction as runtime-accepted or infer
another cause without evidence. Source tracing confirms the exact English
title is used by both /RentalTariff and /LeaseTariff. Rental's dialog now passes
a definite height and bounded flex/table chain; Lease's separate settings dialog
still has an auto-height shell with a zero-basis sigma-editor-form body.
Asked the owner for the current route to establish which consumer is affected.
No further application source changed during this investigation; the existing
API, row validation, loading/error/empty branches and shared projection source
were inspected. The thread has no attached app terminal. Recipe Check passes
for all eight packets. Browser/application verification was not performed under
the existing execution boundary. The remaining visible defect is unresolved;
the next correction depends on the affected route or runtime error evidence.

## Owner amendment implemented: temporarily withdraw branch settings — 2026-10-09

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

The owner requests removal for now, superseding further blank-body diagnosis.
The Frozen amendment records the temporary withdrawal from both lists sharing
the reported title, /RentalTariff and /LeaseTariff. Removed each header's sole
openSettings action. FeatureTitle remains the shared title owner (UI3); list
search/paging/grid and vehicle-type configuration remain available. A scoped
reference search finds openSettings only in its two declarations; settingsVisible
starts false and has no other true writer, route or opening event. Both dialogs
are therefore withdrawn from normal UI access. Their dormant implementation
is intentionally retained for the owner's temporary request. No settings read,
write, saved data deletion, API/schema/calculation/permission change is made.

Files changed in this amendment: Rental/RentalTariff/components/list/list.component.html,
Lease/LeaseTariff/components/list/list.component.html and the Rental/Lease
UserGuide/content module files. Updated the tariff topics and Lease setup journey
in EN/AR, removing instructions to open/edit branch settings and identifying
temporary unavailability with saved adjustments retained. Existing /UserGuide/rental
and /UserGuide/lease menu links remain. Earlier fixes and unrelated owner/peer
changes, including Lease's list component, are preserved.

UI3 shared FeatureTitle's optional content/action projection is the inspected
reference; UI13 controlled visibility remains false without an entry point.
Master7/PHASE06 guide/interaction reconciliation applies. No shared extraction
qualifies: this removes optional action content without introducing a repeated
mechanism. No backend or phase04/domain transition work, migration, mapping or
financial change. Existing translation leaves are retained for restoration.

Angular17 syntax parsing passes for both templates; TypeScript syntax parsing
passes for both guide files. Complete scoped template diffs reviewed and git
diff --check passes. Translation parity passes: rentalTariff133/133 and
leaseTariff106/106, no missing/case-only keys. Recipe Check passes all eight
packets; no canonical/template/manifest edits required regeneration in this
amendment. Owner check: both list headers no longer offer branch settings,
vehicle-type configuration and Search still operate, guides show temporary
unavailability. The prior blank-body defect is not claimed repaired.

Suggested frontend commit: `fix(tariffs): withdraw branch settings temporarily`.
No builds/tests/lint/browser/app/database/migration/snapshot/commit/push/Graphify
or Sigma MCP action. No subagent: this is a small sequential entry-point removal.

## Owner amendment: branch settings entry in TariffCard — 2026-10-09

The owner supplied the branch/percentage screenshot, requested it in Rental/TariffCard,
then explicitly requested the button again and an Add action when saved settings
are empty. Contract and complete source reconciliation:
`reviews/TARIFF_CARD_BRANCH_SETTINGS_UI_CONTRACT_FREEZE.md`.

Added a translated secondary settings action beside Create in TariffCard list
and a feature-owned controlled modal using shared EditorDialog, EditableCollectionTable,
EditableRows, FieldError, form-state freeze and confirmation. Successful empty
GET renders the table and Add; saved rows hydrate on every opening. New rows
require branch and finite percentage [-100,100], duplicates are blocked, and Save
reveals validation without invalid/pristine gating. Existing global settings API
and full replacement contract remain; card Add/Update, backend, mapping, schema,
prices and permissions are unchanged. The older withdrawn tariff entries remain
as recorded by the preceding amendment.

Changed TariffCard list TS/HTML, added branch-settings TS/HTML, added 20 matching
EN/AR keys, updated Rental UserGuide TariffCard/RentalTariff topics and this
review/contract. Source/template syntax, imports, translation parity and scoped
whitespace checks pass. Final recipe Check passes all eight packets; no canonical
change or regeneration needed. Runtime/visual verification remains owner-pending.
No migration required. Suggested frontend commit:
`feat(tariff-cards): add editable branch tariff settings`.
No prohibited commands or subagents used; scoped sequential implementation.
