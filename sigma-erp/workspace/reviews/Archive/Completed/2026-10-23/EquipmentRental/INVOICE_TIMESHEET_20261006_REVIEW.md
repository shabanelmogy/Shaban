# Equipment Rental Invoice and TimeSheet frontend review

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope | EquipmentRentalInvoice and TimeSheet frontend folders only; backend read-only |
| Contract | EQUIPMENT_RENTAL_FRONTEND_CONTRACT_FREEZE.md, Frozen document handoff |
| Evidence | Actual write/list/detail VMs, generic services/controllers, entities and generic filter/select producers; no screenshots |

UI shape: type01 field-only modal editor. InvoiceBase inheritance does not expose a financial workflow through these six-field VMs. Backend pattern1 generic CRUD is the current producer; backend validation, accounting and lifecycle deficiencies remain owner follow-ups. Recipe Check was root-owned: Phase01 current, other applicable packets stale; canonical books govern this change.

## Reference conformance before implementation

| Concern | Book | Reference symbol/source | Shared owner | Target decision |
|---|---|---|---|---|
| List bounds and title | UI1/3/6 | Workshop/Job/components/list shell and imports | sigma-route-host/list-page/list-panel/list-header/list-table; FeatureTitle; DataTable | Same container-fill chain, single fill grid, no feature SCSS |
| Filter controls/reset | UI4/17/19 | Job filterForm/search/reset and filter template | FilterPanel, DatePicker, FieldError | stableLayout, at most6 main fields; exact date criteria; mandatory reset to empty/page1 |
| Typed columns/actions | UI5/7/9 | Job columns/actions/confirmDelete | DataTable/ActionList; ConfirmationDialogService | Source-backed scalar columns, supported View/Edit/Delete; no invented states |
| Dialog state/form | UI13/15/10/22 | VehicleService requestClose/canDeactivate/save; shared EditorDialog public inputs | EditorDialog, FormSection, StateMessage, FieldError | Field-only modal, contentPadded; no tabs without peer sections; View read text; controlled dirty discard |
| Reads and output | UI2/8/10/28 | Job bindListQueries and shared list-query/list-route-state | switchMap/defer/finalize; fetchAllPages; dataTableExportRows | Applied snapshot, cancellation, query restoration, complete export; inline errors skip global error presentation |
| Lookups | UI16; BE10 | SelectAsync/GetDropdownAsync and current ControllerBase GetSelect | Existing typed Results/DropDownSelect | TimeSheet saved IDs, ordinary existing GetSelect, visible retry; no source-free names |
| Dates/numeric | UI17/19/27; BE3 | Shared date validators/transport; actual int VM fields | date-utils, DatePickerDirective, NumericFocusDirective | Three required TimeSheet dates/one Invoice date; integer32 numeric bounds; no hours/time calculations |
| Integration | UI1/10/26 | pages/routing current EquipmentRentalInvoice/TimeSheet paths | Existing root HttpClient/AuthGuard | List-owned modal; original create/details URLs retained as compatibility entry points; no permissions invented |

Application compilation and visual/runtime acceptance remain owner-pending.

## Frozen scalar contracts implemented

The shared table supplies Actions first. The lists then display the exact fields below; frontend ListDTOs declare those fields only. Backend inherited tenant/audit/flags remain unused read-only evidence and were not edited.

| Invoice grid order/type | Frontend ListDTO | Backend EquipmentRentalInvoiceListVM |
|---|---|---|
| ID/number | id | Id |
| Master Agreement No/text | masterAgreementNo | MasterAgreementNo |
| Delivery Note No/text | deliveryNoteNo | DeliveryNoteNo |
| Equipment Detail/text | equipmentDetail | EquipmentDetail |
| Start Date/date | startDate | StartDate |
| Invoicing Rule/text | invoicingRule | InvoicingRule |
| Period/text | period | Period |

| TimeSheet grid order/type | Frontend ListDTO | Backend TimeSheetListVM |
|---|---|---|
| ID/number | id | Id |
| Date/date | date | Date |
| Period Start Date/date | dateRangeStart | DateRangeStart |
| Period End Date/date | dateRangeEnd | DateRangeEnd |
| Delivery ID/number | deliveryId | DeliveryId |
| Customer ID/number | customerId | CustomerId |
| Master Agreement ID/number | masterAgreementId | MasterAgreementId |
| Hours To Invoice/number | hoursToInvoice | HoursToInvoice |
| Break Hours/number | breakHours | BreakHours |
| Start H M/number | startHM | StartHM |
| Ending H M/number | endingHM | EndingHM |
| Operator Overtime Hours/number | operatorOvertimeHours | OperatorOvertimeHours |

### Filters and queries

| Screen/UI criteria | Angular property = Filters[key] = backend stored property key | Producer parser/operator | Default/Reset |
|---|---|---|---|
| Invoice main text criteria | masterAgreementNo, deliveryNoteNo, equipmentDetail, invoicingRule, period | Generic BuildFilterPredicate string Contains | empty; omitted |
| Invoice Start Date (exact) | startDate | DateTime.Date equality | null; omitted |
| TimeSheet main exact dates | date, dateRangeStart, dateRangeEnd | DateTime.Date equality; independent criteria, not From/To range | null; omitted |
| TimeSheet main reference IDs | deliveryId, customerId, masterAgreementId | Generic integer equality | null; omitted |
| TimeSheet advanced integers | hoursToInvoice, breakHours, startHM, endingHM, operatorOvertimeHours | Generic integer equality; zero preserved | null; omitted |
| Paging/sort | pageNo/pageSize and Filters[sortField]/Filters[sortOrder] | NormalizePaging100 cap; ApplyListOrder stored-property selection and Id tie-breaker | page1, DEFAULT_PAGE_SIZE15; date/startDate descending |

Every filter uses `toListParams`; no ignored plate/chassis/agreement-number criteria remain. TimeSheet has six main fields and five advanced fields; restored numeric zero opens the advanced region and is sent. Both panels select stableLayout, reserve date/numeric feedback, restore defaults and search page1 through mandatory shared Reset. CurrentMonthRange is not applied to exact-equality criteria. Sort acceptance is derived from sortable columns. A size-only change uses `resolveListPaging` against prior state; an unchanged event does not fetch.

Search applies a typed snapshot. Paging, sorting, Refresh, post-mutation reload, Excel and TimeSheet Report use that snapshot rather than unsent draft edits. All-page export uses the shared100-row collector and grid-derived values/translated headers; failed or empty output produces visible feedback and no file. TimeSheet Report retains its existing action, replaces bare window.print with ReportPrintService.createSession, fetches all matching pages, switches the one grid to complete data with lazy/paginator/fill/scrollable off, hides non-report actions, releases every bounding chain with sigma-print-flow, and restores the original dataset/page/size automatically. Print does not mutate the stored page data.

### Detail/Add/Update

| Screen/input | Typed form control | Detail member | Add/Update member | Validation/ownership |
|---|---|---|---|---|
| Invoice Master/Delivery No, Invoicing Rule, Period | FormControl<string> | same scalar camelCase names | same names; Update adds numeric id | MaxLength100; no newly invented nonempty requirement |
| Invoice Equipment Detail | FormControl<string> | equipmentDetail | equipmentDetail | MaxLength500 |
| Invoice Start Date | FormControl<Date|string|null> | startDate | startDate, yyyy-MM-dd | required real complete date; shared validator/transport |
| TimeSheet Date/Period Start/Period End | FormControl<Date|string|null> | date/dateRangeStart/dateRangeEnd | same names, yyyy-MM-dd | required real complete dates; no invented comparison/formula |
| TimeSheet Delivery/Customer/Master Agreement | FormControl<number|null> | deliveryId/customerId/masterAgreementId | same names | required positive integer32 IDs per frozen handoff; actual selects or retained saved IDs |
| TimeSheet Hours/Break/StartHM/EndingHM/Operator OT | FormControl<number|null> | hoursToInvoice/breakHours/startHM/endingHM/operatorOvertimeHours | same names | required integer32, signed bounds, zero preserved; no invented nonnegative/hour format rule |
| Identity | no editable control | id | Update id only | API identity, never audit or tenant |

Invoice strings have only declared MaxLength metadata, entity strings are nullable, and the incoming-string producer preserves empty nonnullable text. The UI always sends typed strings and applies length limits; it does not add a new required-text business rule. No write payload sends subscriptionId, createdBy/createdAt, isActive/isDeleted, approval/posting fields, or calculated values. TimeSheet no longer uploads or sends unsupported shift/document/plate/chassis/rate/name fields. Existing historical files are not deleted; no schema/data change occurs.

API dates are restored with the root-extracted shared `toPickerDate`, which reuses the existing partner date algorithm to preserve the local API calendar day. Calendars use appDatePicker with structured masks; shared `parseDateValue` sends yyyy-MM-dd without UTC conversion. No private date parser, ISO conversion, string-to-calendar workaround or local mask remains. Root owns UI17/skill/history promotion of this shared extraction.

### Action, state and route contract

| Action | Availability/API | UI behavior and failure/refresh |
|---|---|---|
| Create | existing generic POST EquipmentRentalInvoice or TimeSheet; exact typed AddDTO | One create modal, guarded Save, required/length/integer/date feedback; preserves inputs and stays open on either failure channel |
| View | GET {controller}/GetById/{id}, Result<DetailDTO> | Read-only saved text/IDs; no edit-only lookups; saved identity on muted translated subtitle; shared shell offers the supported Edit path |
| Edit | same GET, then generic PUT, typed Add inputs + id | Same controlled modal; no duplicate POST on update; supported View→Edit loads lookup options only when needed |
| Delete | existing generic DELETE {controller}?id={id}; no server can* state supplied | Shared destructive confirmation with record identity/subtitle/warning, pending/busy guard, both inline failure channels; last-row deletion steps back then reloads applied page |
| Close/discard | no API | View/pristine close immediately; dirty Cancel/X/Escape/route exit share confirmDiscard; pending save/confirmation cannot be abandoned |
| Excel | GET pages of same applied query | fetchAllPages + dataTableExportRows + onExportToExcel; no partial file |
| TimeSheet Report | GET pages of same applied query | shared print session and all-page rows; output disabled during preparation; controlled state and shared afterprint/destroy cleanup |

Invoice route root is `/EquipmentRentalInvoice`, TimeSheet route root `/TimeSheet`, matching pages/routing.ts. Both lists own their modal, and original create/details links remain compatibility entry points. Invoice `details/:id` stays View, reflecting its prior disabled detail fields; TimeSheet `details/:id` stays Edit, reflecting its prior explicit mode. Explicit edit/view aliases pass route data. `paramMap` consumption and an id-tracked editor instance ensure a reused details route displays the new record and cancels the old instance. Route guards delegate dirty-editor checks and block active delete/confirmation/print preparation. Closing a compatibility modal returns to its actual list path with the applied filter/page/sort query.

No state transition, number generator, posting, financial total, permission API or backend endpoint was invented. Lists have no factual Can* flag to consume; generic CRUD availability is retained. Authentication remains the existing AuthGuard/root HttpClient chain. Authorization candidates: DELETE EquipmentRentalInvoice?id and DELETE TimeSheet?id; UI guards are not authorization.

## Final conformance and source evidence

| Concern | Actual final consumer/producer and compared contract | Result |
|---|---|---|
| Bounded list layers | Both list @Component.host sigma-route-host; templates list-page/panel/header/list-table and one DataTable fill; TimeSheet toggles shared flow only during print | Matched in source; no local page/table/filter CSS |
| Filter geometry/actions | Both FilterPanelComponent imports from exact component file; FilterActions/TimeSheet FilterAdvanced from directives file; stableLayout=true; Reset handler; ≤6 primary fields | Matched; shared default34px, six/three/one grid geometry retained |
| Columns/actions | Typed columns match tables above; DataTable actions first; ActionList<Row>; ordinary source-supported CRUD; sortable whitelist from columns | Matched |
| Dialog shell/state | Both DetailsComponent: shared EditorDialog contentPadded=true, focusOnShow=false, controlled visible; primary state follows loading/error; same Create/Edit/View mode | Matched; View shows read-only fields and supported Edit, no Save |
| Form pane bounds | sigma-editor-form/body/scroll each flex-fill; shared FormSection compact and sigma-editor-grid/field/read | Matched with UI13 content-sized flex alternative; no shell padding/height copy |
| Validation and focus | shared FieldError below every validated control; label/actual inputId pairs; aria-invalid; markAllAsTouched; shared focusField first invalid; onShown focuses shared close after lifetime-guarded timer | Matched in source; keyboard/visual acceptance pending |
| Dates | DatePickerDirective export/import/standalone registration; dateInputMask boolean; toPickerDate restore; dateValueValidator/parseDateValue; DataTable date types | Matched; exact-date filter semantics retained |
| Lookups | TimeSheet editor uses owning DeliveryNoteService/CustomerService/EquipmentMasterAgreementService inherited getSelectList<Results<DropDownSelect>>({skipErrorInterceptor:true}) | Matched; no duplicate GET select implementation; visible error/retry, saved IDs retained, no View lookups |
| Loading/cancellation | Both bindQueries Subject→switchMap→defer→catchError/finalize; takeUntilDestroyed; details also takeUntil closedReads plus id/open checks | Matched; one local inline failure owner and balanced feature loader starts/ends |
| Feedback | Feature HTTP calls carry X-Skip-Error-Interceptor; apiErrorMessage and composedReadErrorMessage; no MessageService success/error duplication | Matched; standard mutation success remains global interceptor-owned |
| Complete output | Typed getAllList→shared fetchAllPages, pageSize100 actual generic clamp; Excel grid mapping; TimeSheet shared ReportPrintSession | Matched in source; failed page aborts complete output |
| Public standalone contract | Four metadata imports sets: 46 registered symbols; 124 local named imports inspected against exact exports; all14 runtime paths resolve | No source export/registration mismatch found |
| Public input types | EditorDialog mode create/view/edit, contentPadded/focusOnShow booleans; StateMessage kind loading/error; FormSection density compact; PrimaryAction loading; FilterPanel stableLayout/busy; DataTable paging/fill/lazy/scrollable | Compared with current owning declarations; no invented input literal or Angular DestroyRef.destroyed |
| Translation parity | Root merged INVOICE_TIMESHEET_TRANSLATIONS_20261006.json into matching EN/AR blocks; scoped Check-Translations reports100 EN/100 AR,zero missing/zero case-only differences | Source parity passed |

Shared extraction review: existing list/grid/dialog/form/filter/state/date/query/output/confirmation/focus owners are reused. Root extracts and promotes toPickerDate, and these four consumers adopt it. Typed producer-specific DTOs, field lists and their query/payload wiring remain feature business contracts. No new framework, copied generic lookup producer, palette, validator-message helper or all-page loop was added.

## Backend constraints retained for owner follow-up

- Both feature services/controllers inherit ordinary generic CRUD without feature validation or action locks; no redundant backend overrides were introduced or removed.
- TimeSheet has no server Range/date-order/FK-existence/ownership checks in its shown VMs/service. The frozen positive-ID UI contract and ordinary select membership are presentation validation, not backend protection. Source does not establish a numeric interpretation for StartHM/EndingHM or billing formulas, so none was added.
- Delivery and MasterAgreement GetSelect exist through the base controller, but GetDropdownAsync reads Name/No and may provide blank labels for their differently named number properties. The UI displays actual #id identity for a blank or historical option; it never fabricates a document number/customer name. Better labels/eligibility need owner-scoped producer work.
- InvoiceBase inheritance exposes no lines/totals/journal/post/unpost endpoint here; the field-only contract remains the frozen repair scope. Generic RemoveAsync has no financial lifecycle guard. Full financial workflow/accounting restrictions remain a separate backend/business review.
- Backend inherited list/detail audit breadth remains unchanged because this is frontend-only. Frontend contracts contain only consumed scalars.

## Changed files and verification

Each folder changes eleven existing files: its routes, models/create.ts, models/details.ts, models/list.ts, service, list component TS/HTML/SCSS, detail component TS/HTML/SCSS (22 files total). Empty/comment-only SCSS files are no longer referenced from component metadata. No peer folder, shared source, backend, tsconfig, translations or instruction file was edited by this child; root integrates translations/shared changes.

Phases: root-owned discovery/freeze consumed; frontend read/grid/detail/write/ordinary actions and route integration implemented; scoped reconciliation performed. Backend implementation, financial transitions, migrations and screenshot extraction are not applicable to this source-backed frontend repair. No screenshot requirements remain Missing/Conflicting; backend constraints above remain owner follow-ups.

Source checks: TypeScript syntax and module-resolution check passes14 runtime sources; Angular17.3.12 parseTemplate passes4 templates; static local named-export/standalone-import scan passes124 named imports/46 registrations; scoped translation parity passes; scoped Git diff reviewed with whitespace errors corrected. These checks do not establish application type checking, compilation or runtime behavior. Existing scaffold specs were not rewritten or executed.

Owner acceptance pending: compile and run the two real list paths plus create/details/view/edit deep links, including details/:id changes; Create/View/Edit/Delete and last-row paging; blank/maximum Invoice text lengths; partial/invalid dates; integer/null/zero bounds; actual reference selection and historical IDs; both failure channels and retry; dirty-close X/Cancel/Escape/navigation; stale list/dialog cancellation; draft-vs-applied filters; all-page Excel/Report exceeding100 rows with a failed intermediate page; print/cancel restoration; exactly one success notification; auth headers; keyboard/focus/RTL/dark/narrow presentation and no page scroll.

No migration is needed. Suggested frontend commit: `refactor equipment rental invoice and timesheet screens to canonical contracts`. No backend commit suggestion is needed. Agent utilization: this bounded inherited-model child owns only Invoice/TimeSheet; root owns shared contracts, integrations/translations and final reconciliation; no further child agents were used.

Prohibited commands were not run: no builds, tests, lint, browser/application/database verification, migration/snapshot edits, commits, pushes or deployment. Generated packets were not edited. Their regeneration and semantic review remain owner-pending.

Final root reconciliation addendum — 2026-10-07: modal browser-reload protection added; TimeSheet partial lookup success is retained when a sibling request fails and saved IDs remain. These compatible root repairs follow UI10/16/28. Final full-feature source checks pass36 runtime files/11 templates; parent report owns the updated complete inventory and pending owner acceptance.
