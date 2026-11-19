| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Staff UI recheck — 2026-10-08

Status: bounded implementation reconciled; source-only owner verification pending. Frozen scope: STAFF_DOCUMENTED_REVIEW_CONTRACT_FREEZE.md plus STAFF_OPERATIONS and STAFF_REPORTS_LISTS. Canonical books govern stale generated packets; root ran drift Check. No screenshot supplied.

| Concern | Book and actual reference | Target evidence / decision |
|---|---|---|
| Short search strips | UI4; Workshop/Job list `form[appFilterPanel]`, shared FilterPanel public inputs and separate directive exports | Timesheet3, Alerts2, Designations2 fields: stableLayout + inlineActions + actual mainColumns. Overtime/Duty2 validated fields: same plus inlineActionCaption and reserved string feedback. |
| Pending discard | UI10/13/28; Movements/CollectionMovement details.canDeactivate and requestClose | Timesheet.discardDecision, monthly.discardDecision, Designations.canDeactivate/requestClose and Allocation.canDeactivate/requestClose open eagerly. Defer, capture identity, freeze controls, restore same visible editor only; cancel retains drafts. |
| Shared validation | UI17/19; shared date-utils monthValueValidator/dateRangeValidator, Workshop Job field-error reserved feedback | Timesheet month private copy becomes shared. Monthly filters gain shared month validation. Statement/Balances date ranges require field feedback and shared ordering validator. |
| Report inline actions | UI20; current global report strip and Journal inline action-caption source | Statement old nested full-width fields/actions replaced by stable shared inline grid, five slots, invisible action caption; checkbox wrapped below caption. Six actions/handlers and output gates retained. Balance main advanced toolbar stays separate; statement date dialog inline. |
| Derived numeric cells | UI14 shared EditableCollectionTable public numeric columns/value highlight | Overtime server rate/amount currently plain right-aligned td; use shared noninteractive centered highlighted badge, retaining money pipe and server authority. |
| Complete data / ownership | UI6/8/20/21; existing Staff historical frozen contracts and current source consumers | Alerts server paging/all-page export; Designations complete fetch before local filter/paging; Statement complete two sections/full print; Balances IncludeAllRows metadata proof and immutable statement selection. No API/financial change. |

Owned files: StaffTimesheet, StaffOverTime, StaffDutySchedule, StaffStatementOfAccount, StaffBalancesSummary, alerts, designations and Staff/shared only. Root owns guides, translations, registration and final reconciliation. Prohibited runtime/build/test/typecheck/lint/DB/migration/commit actions not performed.

## Implemented consumer comparisons

| Target symbols | Final source / matched public owner |
|---|---|
| Timesheets.filterForm; Alerts.filterForm; Designations.filterForm | 3/2/2 actual mainColumns, stableLayout=true, inlineActions=true; FilterActionsDirective still imported from its actual separate owner and registered. Handlers, applied queries and payloads unchanged. |
| Overtime.filterForm and Duty.filterForm | 2 columns, stable/inline plus general.actions invisible caption. Required month uses monthValueValidator; staff required/min1 unchanged; FieldError reserves validationMessages.date/required strings. Invalid Search uses focusField. Existing workspace modifier aligns title/filter/collection edges; Alerts uses shared sigma-list-summary inset. |
| Timesheet.form.month | Shared monthValueValidator replaces private copy. Detail hydration and yyyy-MM-01 payload remain unchanged; no inferred work-date/month relationship. |
| All five dirty decisions | Opening occurs only inside defer after identity/busy recheck; one-shot subscription flag rejects duplicate subscriptions. Reactive forms disable during pending decisions; only the same active/visible/editor context restores a previously enabled form. Monthly Cancel now retains draft filters as well as rows, rather than resetting filters. Row edits and Save remain gated by pending state. Timesheet route/X/Cancel/Escape use canDeactivate through requestClose. |
| Confirmation lifecycle | Actual ConfirmationDialogService.confirm opens eagerly and onClose finalize does not close the surface on unsubscription. Therefore the inner decision keeps finalize/takeUntilDestroyed/shareReplay(refCount:false) inside defer: canceled Router subscription does not release the pending freeze before the answer. Close/search/reset intents remain outer subscribers and cannot run from an abandoned route subscription. No shared service edit. |
| Duty.normalizeTime | Shared parseTimeValue handles clock parsing/range. Small domain adapter pads the existing accepted one-digit hour and returns HH:mm only for zero seconds; optional empty still null, invalid still undefined. Existing saved identity, sparse writes and day/shift policy retained. |
| Statement.filterForm and Balances.filterForm/statementForm | Shared required+dateRangeValidator and reserved inline FieldError. markAllAsTouched/focusField on invalid submit. Statement keeps five field slots and exactly six existing output/actions under shared stable/inline report grid + invisible Actions caption; checkbox label nested beneath invisible caption to retain control-line alignment. Balance advanced main toolbar unchanged; one-date statement dialog stable/inline with caption. |
| Overtime table and Allocation table | Rate/Amount and monetary source/due figures use shared numeric highlighted value span under numeric headers; original MoneyPipe/formatMoney, null/zero semantics and server computations retained. Numeric badges are noninteractive. Allocation input IDs support invalid-field focus; save completion/finalize verifies the same selection version. |
| Designations.getAllList and Alerts.getAllAlerts consumers | Shared composedReadErrorMessage retains declared all-pages failure messages and HTTP result fallback; standard mutation interceptor feedback stays unchanged. Designation required Name uses shared required label and first-invalid focus. |

## Preserved source contracts and guide facts

- Timesheet routes retain one modal Create/View/Edit plus compatibility detail routes and return query state; minimum Staff/Shift IDs, code/designation100, required Date/Month, working/overtime nonnegative hours; no print/export action introduced.
- Overtime changes integer nonnegative minutes only, submits touched days including clears, keeps full-month baseline and pre-joining visibility toggle; server rates/amounts/five totals remain authoritative. No output action introduced.
- Duty changes Shift and In/Out/In2/Out2 minute clocks, sends sparse touched-day rows including clears and saved attendanceId; before-joining days remain disabled. No output action introduced.
- Designations retains Name50 required, nullable Category0/1/2 and Hourly Rate>=0; getAllList uses fetchAllPages before local filtering/sorting/paging/export; detail loaded by identity, no subscription/audit inputs.
- Alerts retains Staff/search + selectable all/expired/expiringSoon/valid cards, Staff-only counts, canonical15 paging and complete applied-filter/sort export. Optional lookup failures remain visible and retryable.
- Statement retains complete ledger/outstanding + advance-tax arrays, date/staff/inactive/subledger filters, server totals, full two-section print and selected complete section Excel/type-wise export. Allocation uses fixed applied staff/JV/detail identity, positive allocatedNow rows bounded by each source due and line available, same enum0/1/2, standard mutation feedback and statement refresh. Historical original AdvanceTaxInvoice consumption limitation is unchanged.
- Balances retains five main fields and Balance Type only in More Filters, IncludeAllRows=true complete metadata proof, server totalBalance/count, local15 paging/full export/print, immutable selected Staff statement drill-down seeded from applied report month.

Changed 16 frontend files: two each for Balances, Duty, Overtime, Alerts, Designations; four Statement/allocation files; Timesheet list HTML + details TS. No model/service/API/route/shared-owner/SCSS/translation edits. Shared Staff statement helper reviewed and retained.

## Verification and limits

Source parsers cover all owned nonspec33 TypeScript files and9 Angular templates;227 local import paths resolve. Syntax/template results: zero diagnostics. Scoped git diff --check: clean. Direct shared exports, standalone registrations and input types compared for FilterPanel/FieldError/EditorDialog/date/time/focus/error owners; scoped diff reviewed. Parser checks do not certify TypeScript/template types, runtime interactions, financial concurrency or visual fit. No compiler/build/test/lint/typecheck/runtime/browser/DB/migration/commit commands run. No new migration requirement from this worker. Root owns bilingual guide integration and whole-task final reconciliation; owner compilation, dirty navigation/canceled route interaction, desktop/narrow/RTL/dark visual acceptance and report output remain pending.

## Root-requested bounded final scalar parity check

- Overtime.validMinutes already enforces Number.isInteger, >=0 and <=2147483647, matching the frozen C# Int32 row contract and input max; retained. These ngModel rows are feature-owned plain collections, so their existing predicate continues governing invalidDays/canSave rather than creating a parallel reactive control graph.
- Timesheet WorkingHours/OvertimeHours previously checked finiteness only during payload building. Both controls now use shared finiteNumberValidator alongside required/min0; remove their repeated submit-only checks. Existing decimal widget precision and payload stay unchanged.
- Designation nullable HourlyRate previously checked finiteness only during Save. It now uses shared finiteNumberValidator alongside existing min0; repeated submit-only branch removed. NumericFocusDirective imported from the actual standalone owner, registered, and applied to existing native number input for shared appearance; global numeric selection owner remains unchanged.
- Final follow-up changed only existing Timesheet detail TS and Designation list TS/HTML. Direct exports/registration verified against scalar-validators.ts and numeric-focus.directive.ts; relevant3-file syntax/template parse and scoped diff --check passed with zero diagnostics. Full pre-follow-up scan above remains evidence for unchanged files; no typecheck/build/test performed.
