| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

Frozen clarification (2026-10-03): Timesheet Month is a month picker using the shared complete MM/YYYY parser. Its existing date-only/DateTime API field receives `yyyy-MM-01`, retaining the existing wire type while normalizing the month's day to 1. No relationship between the separate work Date and Month is inferred. Overtime/Duty continue existing `yyyy-MM` transport. Shared default comes from `currentMonthRange()[0]`; all three use `appDatePicker` structured month mask.

Frozen presentation clarification (2026-10-03): preserve existing staff name/code/month context, Overtime designation, weekend/pre-joining annotations and the working pre-joining visibility toggle. The complete-calendar contract owns the fetched baseline and sparse writes (all 28–31 days), plus complete-month print/export; a retained local visibility toggle may hide disabled pre-joining rows in the screen only. It cannot truncate the baseline, discard pending edits, enable pre-joining edits or redefine server payroll rules. Restore these source-demonstrated controls/content through shared form/field presentation; their accidental removal during shell conversion is a finding.

# Staff operational screens — 2026-10-03

User authorizes all confirmed fixes across Staff. Source/API discovery by staff_operations_ui (gpt-5.6-sol high), root reviewed and froze this handoff before implementation. No screenshots supplied. Existing payroll policy and calendar rows are preserved.

| Screen | Read/write contract | UI and actions |
|---|---|---|
| /StaffTimesheet | GET StaffTimesheet with pageNo/pageSize/Filters; Results<ListVM>; detail via generic GetByWithNavigationsId; POST inputs staffId:int, code/designation max100, shiftId:int, date/month date-only, workingHours/overtimeHours decimal; PUT same + id:int; DELETE id | Type 01 normal entity: shared list/grid, default15, options10/15/20/50/100; visible staff, code, designation, shift, date, working/overtime hours, month. One modal Create/View/Edit; compatibility detail routes redirect with identity/mode and list query retained. View hides Save; failed detail cannot enable Edit/Save; dirty close confirms; Delete confirms and server enforces references. |
| /StaffOverTime | GET Staff/Overtime Month yyyy-MM + StaffId; active staff lookup without valid pair; complete month-day rows and five totals. POST month,staffId,rows[{day,overtimeMinutes:int>=0}] | Monthly collection, unpaged; date-effective server rate/amount/totals authoritative. Submit changed days only, including clearing existing day; no frontend money calculation. |
| /StaffDutySchedule | GET Staff/DutySchedule Month+StaffId; complete month days + shift/staff options. POST month,staffId,rows[{day,attendanceId?,shiftId?,in?,out?,in2?,out2?}] | Monthly editable operational collection, unpaged; schedule time HH:mm and saved identity preserved. Sparse changed days, including existing row clearing. |

Timesheet canonical menu route is /StaffTimesheet (root owns sidebar linkage). /StaffTimesheets HRM compatibility route is retained. No transport enum change. Overtime salary type/category resolution, Friday/Saturday/configured holiday handling and AwayFromZero rounding stay server-owned. Duty preserves before-joining/day/time/shift validation. Existing last-write behavior for a touched day remains; no invented concurrency token.

Dirty monthly rows survive filter editing; Save requires filters to match the applied month/staff. Search/Reset/route exit confirm discard, cancelled intents retain edits. Loading/saving gate all mutating actions, and request streams cancel stale reads. Required option failures stay visible/retryable. Inline read errors use X-Skip-Error-Interceptor + apiErrorMessage; ordinary mutations use the existing interceptor as the single feedback owner. No audit/tenant/derived fields in payloads.

| Concern | Book/reference | Shared owner/target |
|---|---|---|
| List shell/grid/paging | UI1/3/4/5/6, Workshop/Job list | sigma-route-host/list-panel, FilterPanel, DataTable, list-query/paging; Timesheet matches values |
| One modal + dirty close | UI13, shared editor-dialog and Fleet/VehicleService | EditorDialog; typed feature form, load/save gates, one discard path |
| Routed collections | UI1/14, openingBalances workspace and shared editable-collection-table | sigma-editor classes; EditableCollectionTable owns frame/rows/sticky header; fixed footer, no viewport calc |
| Structured month/date | UI17 | appDatePicker + dateInputMask, typeable mm/yyyy/dd/mm/yyyy; transport unchanged |
| Summary/error/cancellation/theme | UI22/24/25/27/28 | SummaryCards, StateMessage, shared buttons/tokens, switchMap/finalize/takeUntilDestroyed |

Agent implementation ownership: StaffTimesheet/, StaffOverTime/, StaffDutySchedule/ only; root owns translations, tsconfig, shared guards/config, sidebar, artifacts. Backend is separately owned by staff_backend. No migrations/model snapshots, shared references or unrelated HRM source edits. Source-only checks; owner build/runtime/manual acceptance pending.

## Reconciliation clarification — existing output actions

HEAD source confirms Timesheet, Overtime and DutySchedule have no print/export controls. The generic discovery manifest and the earlier complete-month print/export phrase do not create new workflows. Preserve this existing action scope; monthly fetched baselines remain complete calendars irrespective of the visible pre-joining toggle. No new output action is introduced. Retained report/list exports elsewhere remain complete.
