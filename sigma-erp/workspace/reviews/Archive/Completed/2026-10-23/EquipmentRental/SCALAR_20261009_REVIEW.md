# Equipment Rental scalar editors review — 2026-10-09

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope | EquipmentRentalInvoice and TimeSheet frontend directories only |
| Frozen handoff | FOLLOWUP_20261009_REVIEW.md; historical EQUIPMENT_RENTAL_FRONTEND_CONTRACT_FREEZE.md |
| Guide integration | Root-owned handoff; overall completion requires the module guide |

The worker owns only these two bounded frontend slices. Their initially clean files were edited without touching user or peer changes outside ownership. No screenshots or video were supplied. Source evidence preserves both current type01 field-only modal shapes and their generic backend producer contract; the invoice name does not authorize accounting expansion. Root confirmed the initial recipe -Check passed all eight packets before delegation. Applicable phases02/03/05/06 were reviewed through canonical UI blocks and the generated packets; backend implementation, domain transitions, uploads and schema work are not applicable.

## Conformance and decisions

| Concern | Owning rule | Actual reference/shared owner | Final consumer evidence |
|---|---|---|---|
| Shell, filters, table and paging | UI1/3/4/5/6/28 | Workshop/Job list; FilterPanel, DataTable, resolveListPaging | Both route hosts use sigma-route-host, bounded sigma-list-panel, stableLayout filter panel, mandatory Reset, one filling shared grid, API totalCount and column sort whitelist; bindQueries uses Subject/switchMap/defer/finalize |
| Modal lifecycle | UI10/13/15/28 | Current EditorDialog declarations/composition; Movements discard; Lease freezeFormState | Both DetailsComponent.canDeactivate methods capture recordId/mode/editorVersion, defer confirmation until subscription, reject stale/duplicate subscriptions, recheck busy state, use freezeFormState and guard pending release/restoration. requestClose/X/Cancel/Escape share this decision; finish is idempotent and successful Save marks pristine and bypasses discard |
| Prior disabled controls | UI10/21 | shared/utils/form-state.ts | Modal temporary form-state effects and TimeSheet print filter-state effect capture one prior-state callback rather than unconditionally enabling every control; pending discard restoration applies only to the same visible editor. Current parent @for tracks record ID and recreates the editor when changing records; arbitrary external retargeting is not certified |
| Title/identifier | AGENTS; UI13 | EditorDialog title/subtitle inputs and header template | Existing templates already use translated create/edit/view screen title and translated recordSubtitle with id on a smaller shared subtitle line; retained unchanged |
| Scalar input | UI19 | shared/utils/scalar-validators.ts int32ValueValidator; actual TimeSheetAddVM | All eight integer editor/filter controls consume the existing shared validator. Required editor values, optional filters, positive saved FK rules and -2147483648..2147483647 signed scalar bounds stay unchanged. Reserved filter feedback uses existing validationMessages.number |
| Lookup recovery | UI16/22/28 | getSelectList skipErrorInterceptor; mergeSelectOptions | TimeSheet requests ordinary DeliveryNote/Customer/Master select lists only for Create/Edit; retains existing saved numeric ID fallback through the shared merger without inventing names. Both failure channels remain visible with Retry; Save blocks while lookup data fails or loads; pending discard blocks retry/edit entry |
| Calendar data | UI17/19 | appDatePicker/dateValueValidator/toPickerDate/parseDateValue | Masked typeable calendars preserve invalid text through the shared directive, hydrate local saved dates and serialize yyyy-MM-dd. Three TimeSheet date criteria and invoice startDate remain exact equality filters; no inclusive range, order rule or hour/time conversion introduced |
| Excel and TimeSheet output | UI8/21/28 | fetchAllPages/dataTableExportRows/ReportPrintService.createSession | Both Excel paths snapshot currentQuery from applied filters and collect pageSize100 pages via shared fetchAllPages, fail on any failed page and export translated grid columns. TimeSheet openReport fetches the complete same applied scope, sets printRows and immediately invokes printSession; it does not open a separate report dialog. Print disables paginator/lazy/scroll/fill, preserves screen paging, carries sigma-print-flow and clears prepared rows afterward |
| Failure feedback | Master5/UI2/22 | apiErrorMessage/composedReadErrorMessage; inline request header | Typed Result/Results calls retain X-Skip-Error-Interceptor for inline errors, preserve declared and HTTP failures, finalize loaders and leave standard mutation success interceptor-owned |

Grid columns beside ListVM: Invoice id/Id plus masterAgreementNo/MasterAgreementNo, deliveryNoteNo/DeliveryNoteNo, equipmentDetail/EquipmentDetail, startDate/StartDate, invoicingRule/InvoicingRule, period/Period. TimeSheet id/Id plus date/Date, dateRangeStart/DateRangeStart, dateRangeEnd/DateRangeEnd, deliveryId/DeliveryId, customerId/CustomerId, masterAgreementId/MasterAgreementId, hoursToInvoice/HoursToInvoice, breakHours/BreakHours, startHM/StartHM, endingHM/EndingHM, operatorOvertimeHours/OperatorOvertimeHours. Frontend interfaces contain these consumed fields; inherited backend audit fields have no UI consumer and are not added to payloads.

Add payloads retain exactly six invoice or eleven TimeSheet fields; Update adds id only. POST/PUT controller root, GET GetById/{id}, DELETE ?id= and paging/filter transport stay unchanged. Invoice max lengths remain100/100/500/100/100 and required date. TimeSheet three dates and eight integers remain required in Save. No business-hour interpretation, derived calculation, approval, posting, permission, backend, AutoMapper, nullability or financial effect changed. No migration is required. Existing generic producer authorization/reference invariants are not strengthened by frontend presentation; delete remains an authorization candidate for the existing endpoint.

## Changed source

All paths are under `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Equipment Rental/`:

- EquipmentRentalInvoice/components/details/details.component.ts
- EquipmentRentalInvoice/components/details/details.component.html
- TimeSheet/components/details/details.component.ts
- TimeSheet/components/details/details.component.html
- TimeSheet/components/list/list.component.ts
- TimeSheet/components/list/list.component.html

The shared extraction gate reuses freezeFormState, int32ValueValidator and mergeSelectOptions. No new shared owner or new reusable rule was required; therefore books/skill/packets were not edited. Root owns module guide, translations and integration files.

## User guide handoff

Invoice topic: navigate `/EquipmentRentalInvoice`; Search applies six criteria, start date is exact, Reset clears criteria, Refresh retains the applied query, grid supports paging/sort. Create/View/Edit/Delete use the existing shared modal. Invoice identifiers show as record subtitles. Explain the six supported fields, lengths and required start date, Save retry and discarded versus retained drafts; Excel exports all applied matching rows. No line totals, payments, journal/posting workflow or print action is available in this slice.

TimeSheet topic: navigate `/TimeSheet`; Search applies three independently labelled exact dates and three positive IDs, with five scalar filters under More Filters. Create/Edit require the three dates, Delivery/Customer/Master selections and five signed whole-number scalar values. Inputs retain their documented labels without teaching HH:mm conversion, deriving hours or enforcing new sign/order rules. View shows saved IDs, Edit loads selects, lookup failure blocks Save with Retry. Both Excel and Report cover all applied matching rows; Report prepares rows and immediately opens the browser print flow. Cover dirty Cancel/X/Escape/navigation decisions, busy controls, mutation failures retaining drafts, and last-page deletion behavior. Legacy invoice details/:id is View; legacy TimeSheet details/:id is Edit; explicit create/view/edit routes remain.

Root must record final module guide content file, reader route/menu link, bilingual topic identities and final content reconciliation in its parent report. This worker did not edit guide source or claim the overall guide gate complete.

## Source verification and remaining owner acceptance

Complete scoped frontend diff reviewed separately for invoice, TimeSheet details and TimeSheet list; the final captured-identity guard correction was inspected afterward. `git diff --check` passes. Targeted scans found no merge markers, feature any contracts, silent undefined error handlers, native date inputs, feature p-table or new unsupported ES2019+ APIs. New imports were compared with actual named exports; used shared controls/directives remain registered in standalone metadata. Effective compiler lib remains es2018/dom and installed DestroyRef uses onDestroy rather than an assumed destroyed property. Services retain root-injected inherited HttpClient/environment.baseUrl and add no feature provider chain.

Read-only Check-Translations.ps1 for equipmentRentalInvoice,timeSheet,validationMessages reports123 EN/123 AR keys, zero missing keys in either language and zero case-only differences. Existing recordSubtitle/pageReport keys have matching identities/placeholders. No translation source was edited by this worker.

Pending for owner: Angular compilation; dirty guard without subscription, duplicate subscriptions, Cancel/Confirm, X/Escape and route navigation; intentionally disabled control restoration; successful Save exit without another prompt; saved detail/lookup failure+Retry and declined deletion; Int32 endpoints/fraction rejection without hour interpretation; rapid search/page/sort response cancellation; filtered Excel above100 rows and failed later page; TimeSheet Report full-row print/cancel and restored screen state; Arabic/LTR/RTL, narrow-screen scrolling, dark overlays, keyboard focus and one notification per mutation. Source inspection does not certify runtime behavior or visual acceptance.

No builds, tests, lint, browser/application automation, database commands, migrations, commits, pushes, deployment, Graphify or Sigma MCP were run. No subagents were spawned by this worker. Suggested frontend commit for this slice: `fix(equipment-rental): preserve scalar editor discard state`.
