| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Overtime frontend/API contract freeze

## Frozen handoff

- List screen uses the shared Sigma list shell and `app-data-table` with server paging.
- Filter query keys are `fromDate` and `toDate`, formatted as `yyyy-MM-dd`.
- List columns and row fields are exactly: `staff`, `month`, `code`, `designation`, `normalOTHours`, `holidayOTHours`, `totalOTHours`, `overtimeRate`, `overtimeAmount`, plus `id`.
- Existing CRUD routes remain available; details use explicit `create`, `view/:id`, and `edit/:id` modes.
- `Process Overtime` navigates to the existing `/StaffOverTime` screen. No new batch endpoint is invented.
- Import is deferred as a blocked action until an API/file contract is supplied.
- Add/update payloads contain only client-editable fields: `staffId`, `code`, `designation`, `normalOTHours`, `holidayOTHours`, and `month`. Tenant/audit/derived fields are server-owned.

## Conformance references

| Concern | Guide block | Reference | Target |
|---|---|---|---|
| Route host/list shell | UI 1/3/6 | `Workshop/Job/components/list` | Shared `sigma-route-host`, list panel, feature title, filter panel, fill data table |
| Filters/date range | UI 4/17/19 | `Workshop/Job/components/list` and shared date utils | Typed range control with validation and API date transport |
| Grid/paging | UI 5/6/28 | shared `app-data-table`; Job list query | Typed columns, count metadata, cancellation and error state |
| Process action | UI 7/13/22 | `Staff/StaffOverTime` route | Navigates to supported editor; no duplicate API |
| Detail editor | UI 1/13/15/17/19 | shared routed editor shell | Typed form, shared date picker and field errors |
| Backend list | BE 7/9/13 | base `Service` hooks | Date filters and `ProjectTo` list materialization |

## Owner verification

Runtime, visual, RTL/dark theme, API, build and accessibility acceptance are pending.

## Contract change — 2026-10-10 continuation

Decision source: owner: «شوف الانس انا عندى شاشات بعمل زيها والبيزنس مش واضح اوى فحاول قدر الامكان كمل الناقص ونراجع الدورة على بعضها فى النهاية». Supersedes the earlier substitute-navigation and deferred-import decisions; those remain historical above.

Reviewer decision (owner standing rule): retain daily overtime CRUD and add a separate monthly processing-history tab on the same list route. Screen 02 is appropriate for the daily editor because it renders authoritative hour/amount totals; backend normal-entity service has justified calculation/tracked-write overrides. Monthly processing is an append-only operational snapshot, not payroll posting. Screen 09 owns the small Month action dialog. Approved references: Workshop/Job/components/list and editor; Workshop/Job/components/close-job; shared EditorDialog/EditorTabs.

- Daily editor date is the full calendar day stored in `Month`, never truncated to month start. Add/update inputs remain staffId, code, designation, normalOTHours, holidayOTHours, month. Max100 text; required existing staff; finite nonnegative hours. Total hours and amount belong to the backend. Use the existing Staff overtime rate hierarchy, Friday/Saturday/configured-holiday classification and two-decimal AwayFromZero amount rule. Existing daily rate snapshots are preserved for the same staff/date; changed staff/date or new rows use the existing effective rate. Do not automatically recalculate any saved rows. A positive normal or holiday input must match its calendar-day category; this prevents a second calculation rule diverging from StaffOverTime. Duplicate staff/day is rejected excluding self. Existing duplicate data is untouched. Same Staff write guard protects all participating paths.
- Daily list columns: staff, month(date), code, designation, normalOTHours(number), holidayOTHours(number), totalOTHours(number), overtimeRate(money), overtimeAmount(money). List DTO scalar staff display Name plus Id, no audit/tenant/deletion fields. Details render staff name, skip lookups in View; required lookup failures block writes and offer Retry. Keep applied query/paging/sort in URL on editor return. One inline failure owner, bounded shell, deferred dirty-discard, stable form snapshots and cancellation.
- `POST Overtime/process` input `{month: yyyy-MM}`. Validate the month; read existing live daily rows only; reject no rows or unpriced positive hours; save one immutable `OvertimeProcessRun` snapshot containing from/to, status Processed, record/staff counts, total hours and total amount. No daily rewrite, payroll/JV write or approval. Multiple deliberate runs are separate history entries. ApprovedBy remains empty: neither source nor screenshots establish an approval authority/action. No access rule invented.
- `GET Overtime/process-runs` takes ListSmBase and fromDate/toDate intersection filters, real counts, deterministic paging. Columns from(date), to(date), status(translated), approvedBy(empty), recordCount(number), staffCount(number), totalHours(number), totalAmount(money), plus Id only. Sort limited to real stored fields. New schema requires owner-run migration, no migration/snapshot edits.
- Import CSV uses the existing shared ImportCsvComponent parser/template. Columns exactly StaffId,Date,OvertimeMinutes; date yyyy-MM-dd inside chosen month, positive Int32 minutes, max1000 rows, no repeated staff/day. Preview all rows/errors before submit. `POST Overtime/import` `{month,rows:[{staffId,date,overtimeMinutes}]}` validates all rows and references before any mutation, rejects ALL on any existing daily key or invalid row, applies the existing Staff calculation owner, and saves once. Rates/amounts/code/designation are server-owned for import. No replacing saved data, partial import or financial posting. Rows are the import command batch, not an aggregate snapshot removing omitted rows.
- Routes/providers/auth unchanged except explicit existing create/view/edit routes; services root interceptor client. No new permission API. Process/import errors inline with skip-error header; success through existing interceptor and refresh applied list only. Repeated actions disabled; close/discard gates freeze form/import preview while pending.

Status of this changed handoff: Frozen for implementation; complete cycle/runtime/financial acceptance remains owner verification pending. Backend reference is the generic service/hooks for daily reads, existing StaffService calculation source for amounts, and explicit single-save operational action methods for process/import.

### Persistence clarification — 2026-10-10 source reconciliation

The existing hour columns default to decimal(18,2). Use decimal(22,6) for normal/holiday/total hours, retaining all 16 integer digits while storing minute fractions; rate/amount stay decimal(18,2). The staff/day unique key must compare calendar days even for legacy timestamps. Persisted shadow OvertimeDay is CONVERT(date, Month). Repository live scope includes IsDeleted=NULL as well as false; a persisted shadow OvertimeDeletedKey is CASE WHEN IsDeleted=1 THEN Id ELSE 0 END. The unique index is (SubscriptionId, StaffId, OvertimeDay, OvertimeDeletedKey), filtered only on StaffId IS NOT NULL. Live rows share key 0, deleted rows remain distinct by Id. This is derived persistence enforcement, not a new business state or data rewrite. Review existing live duplicates before the owner creates/applies a migration; any cleanup requires an explicit owner decision. Remove the unconsumed OvertimeFullListVM and unused write/reverse maps; all write entry points use explicit server calculation.
