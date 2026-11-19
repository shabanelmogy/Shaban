# Leaves frontend/backend contract

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

2026-10-10. Frozen under the user's implementation request and continuation authorizing provisional reviewer choices while business remains incomplete. Plan: LEAVES_MAINTENANCE_EVOLUTION_PLAN.md.

## Functional evidence

| Evidence | Classification | Contract |
|---|---|---|
| 1 dashboard | Explicit | Type/date filters, Add Leave, six metrics, per-type breakdown, status/monthly distribution, recent/upcoming tables. Earned/available entitlement has no source: null/unavailable with explanation. |
| 2,4 leave editor | Explicit | Type, staff, reason, dates, server summary, Save/Cancel. Inclusive calendar days provisional owner-approved reviewer choice; no holiday/weekend subtraction. |
| 3 leave list | Explicit | Staff/type/range, rejected/pending approval/pending rejoining, staff/type/from/to/status and actions. Preserve source record number as additional column. |
| 5,6 leave types | Explicit | Type/category/quota/accrual/rule/start/count; existing additional start column retained. All editor policy fields/flags, Any gender, marital filter, ordered approvers. No automatic approver workflow inferred. |
| 7,8 holidays | Explicit | Name/date, range/name filters, Create/View/Edit/Delete. Reuse SettingsHolidayModel backend. |
| approval, balances, payment | Uncertain | No new transition/permission/payroll/accrual formula. Existing state and stored split/counter values preserved. Guide states limitations. |

## Read contracts

- Leave GET /Leave: Results<LeaveListVM>, rows {id,no,staffName,leaveTypeName,fromDate,toDate,leaveStatus,pendingRejoining}. Columns No, Staff, Leave Type, From, To, Status; pendingRejoining is action/filter context only. Filters staffId,leaveTypeId,dateFrom,dateTo,rejected,pendingApproval,pendingRejoining; selected status flags form OR status set, pendingRejoining AND. Range selects interval overlap; undated legacy rows included when no date filter. Sort stored no/fromDate/toDate/leaveStatus; staffName/leaveTypeName projection sorting only if supported.
- Type GET /LeaveType: rows {id,name,leaveCategory,leaveQuotaType,accrualPeriod,leaveQuotaRule,leaveStartFrom,noOfLeaves}. Columns correspond exactly minus Id. Filters name,leaveCategory,leaveQuotaType,accrualPeriod,leaveQuotaRule,leaveStartFrom.
- Holiday GET /SettingsHolidayModel: rows {id,name,date}; columns Name,Date; filters name,dateFrom,dateTo. Existing /Holiday UI route remains.
- Paging: toListParams, authoritative totalCount/totalPages/pageNo/pageSize, frontend DEFAULT_PAGE_SIZE 15, base server clamp; default newest Id and stable tie-breaker. Export uses fetchAllPages and shared column export.

## Write/detail contracts

- Leave Add {leaveTypeId:number,staffId:number,reason:string|null,fromDate:string,toDate:string}; Update same + id, nullable paired dates only for legacy undated records. Positive required staff/type, max1000 reason, real ordered date-only dates. Derived NoOfLeaves/CurrentlyBooked are backend inclusive duration; MaxLeaves from configured type for new requests. Status defaults Pending and PendingRejoining comes from type on Add. Update preserves existing status, pending rejoining, booked-history/remaining/pay split values. Do not overwrite historic metrics merely by viewing. Detail returns identity, editable fields, status/rejoining and persisted summary only; navigation DTO trees unnecessary.
- Type Add all current configuration fields except tenant/audit/No; numeric policies nonnegative integer, name trim/max50 (compatible with existing Update base), enums numeric matching C#, nullable gender/marital. approverStaffIds:number[] optional ordered, positive unique tenant-live staff IDs. Update adds id; detail returns same fields + id/name and approverStaffIds. Stable child reconciliation by staff identity; collection omission vs empty is frozen as full empty snapshot. No claim this configuration secures approval.
- Holiday Add {name,date}, Update + id; trim/max50, required real date. Existing settings entity/VM/date-only owner. Only existing API methods exposed.
- Details: existing GetByWithNavigationsId/{id}. Global interceptor owns save/delete failures/success; local state restored on both failure channels. Read/lookup inline requests opt out and show retry. Edit needs successful snapshot. Save freezes form; dirty close/navigation uses reusable confirmation and restores values on refusal.

## Dashboard contract

GET /Leave/dashboard with ListSmBase Filters[staffId,leaveTypeId,dateFrom,dateTo]. Result<LeaveDashboardVM> {applied,pending,approved,rejected,types:[{id,name,noOfLeaves,applied,pending,approved,rejected}],monthly:[{month,pending,approved,rejected}],recent:LeaveListVM[],upcoming:LeaveListVM[]}. Counts are requests in the applied overlap scope, not days; type quotas are configuration only. Recent newest10; upcoming non-rejected dated requests whose FromDate >= local/calendar server Today, within same filters, first10 chronological. No total/available employee balance claim. Server date-only Today semantics recorded; owner timezone acceptance pending. No client aggregation of a first paged response. Dashboard uses shared SummaryCards/DataTable/section owners.

## Actions / integration / ownership

Existing generic Create/View/Edit/Delete only. Shared confirmDelete and confirmDiscard. No new record lock or permission API. AuthGuard remains authentication only; delete/configuration/approval are authorization candidates for a future owner-approved mechanism. Services root/interceptor HTTP, environment.baseUrl, no feature provider. Preserve /Leave, /Leave/create, /Leave/details/:id; add edit/:id and dashboard under /Leave. Type/Holiday deep URLs select controlled modal on same list; query mode edits preserve applied list state. HRM guide /UserGuide/hrm already registered.

## Pre-edit conformance evidence

| Concern | Book | Actual reference / shared owner | Target |
|---|---|---|---|
| List shell/title/filter/grid | UI1/3/4/5/6 | Workshop/Job/components/list/list.component.html and .ts; FeatureTitle, FilterPanel, DataTable | sigma-route-host/list-page/list-panel/list-header; stableLayout; fill table; controlled15 paging, source-owned columns |
| Modal | UI13/15/10 | shared/editor-dialog/editor-dialog.component.ts and .html; canonical UI13 controlled composition | contentPadded, explicit mode, no View Save, typed body, busy/dirty gates |
| Routed editor | UI1/13/24 | Workshop/Job/components/editor shell; FormSection, SummaryCards | bounded form pane, fixed footer, one scroll owner, summaries display only |
| Controls | UI16/17/19/22/23/28 | enumOptions/TranslateOptionsPipe, DatePickerDirective/date-utils, FieldError, StateMessage | numeric enum IDs; nullable dropdowns; real masked calendars; both failure channels; switchMap stale reads |
| Generic backend | BE3/4/5/7/8/9/13 | BranchService; Services/Bases/Service.cs actual hooks | inherit standard reads/writes where possible; projection only for navigation names; tracked retained writes to preserve server values; one-way maps; scoped validation |
| Child configuration | BE14/8 | PurchaseOrderService.RemoveAsync; shared OwnsAll/ReconcileOwned/RemoveWithChildrenAsync | one small child collection with tenant validation and full snapshot reconcile; one SaveChanges implicit transaction |

## Schema and compatibility

New nullable Leave date columns; nullable LeaveType gender/marital; new ordered approver children. Preserve legacy dates as null and existing counters, no guessed backfill. Owner creates migration; agent does not edit migrations/snapshot. Narrow DTO fields have no outside feature consumer unless a targeted symbol scan proves one. Remove ReverseMap only for scoped mappings. Holiday has no new entity. FullList DTOs retained for compatibility unless proven unused.

## Frozen integration addendum — 2026-10-10

The owner selected the most suitable conservative current behavior while business policy is incomplete. Inclusive calendar duration, retained stored counters and no accrual/payroll/rollover calculation remain Frozen. Missing total/available entitlement is shown as unavailable, not zero. No new approval action is introduced.

LeaveType detail additionally exposes ordered `approvers:[{staffId,staffName}]`, derived from the Staff navigation; writes still send only ordered `approverStaffIds`. This supplies View names without edit-only lookup dependence or duplicated persisted names.

LeaveListVM/LeaveDTO additionally exposes persisted `noOfLeaves:number` for the screenshot-backed Days cells in recent/upcoming and the main list. Grid columns now are No, Staff, Leave Type, From Date, To Date, Days, Status. The same list projection serves dashboard request rows, with no client duration calculation and no new write or schema field.

Dashboard integration note (2026-10-10): status totals now use separate server-side `CountAsync` queries rather than conditional grouped counts, reducing provider translation risk while preserving request-count semantics. If a running API still returns an unavailable dashboard after the source update, restart it and apply the required schema migration before retesting; the new nullable Leave dates and approver configuration cannot be queried by an old database schema.

Compiler follow-up (2026-10-10): corrected the frontend error fallback from `LeaveDashboardDTO` to `null`. The observable now retains the frozen `Result<LeaveDashboardDTO> | null` shape; removed the unverified direct-response cast. `displayData` supplies empty collections for the visible sections/chart while `data` remains null and request KPIs remain unavailable on failure. Chart state resets before each request. Updated the bilingual dashboard guide. This resolves the source cause of the four reported TS2339 errors; owner compilation and the separate HTTP failure diagnosis remain pending. No build, tests, runtime, browser, database or migration commands were run for this follow-up. No backend, API, schema or business-policy change in this correction.

Dashboard filter alignment follow-up: owner explicitly requests buttons level with the inputs. The dashboard retains `inlineActions=true`, three fields, stable layout and reserved date feedback; adds the shared `inlineActionCaption="general.actions"` (UI4 validated inline recipe). Compared FilterPanel input/host/template/SCSS to Budget's existing consumer: invisible caption matches label height plus 4px gap and top-aligns actions independently of FieldError. No feature CSS/shared-default/API changes. Source-only review; desktop/narrow/RTL and validation visual acceptance pending. Recipe Check passed all eight packets. Suggested frontend commit: `fix(leaves): align dashboard filter actions with inputs`. No agents needed for this single-property correction; no build/tests/browser/database/migrations run.

## Confirmed dashboard runtime diagnosis — 2026-10-10

The owner-provided `/Leave/dashboard` response confirms SQL Server error 207: `Invalid column name 'ToDate'` and `Invalid column name 'FromDate'`, thrown from `LeaveService.DashboardAsync`. The current `SiGmaDbContextModelSnapshot` also lacks those nullable `Leave` date columns, so the running database schema is behind the frozen Leave contract. This is a schema deployment blocker, not an Angular response-shape or filter-alignment defect. The source-only boundary prohibits creating or running migrations in this task; the owner must generate and apply `ExtendLeaveDatesAndApproverConfiguration`, then restart the API and retry the dashboard. No token or credential from the diagnostic response is recorded here.

## Dashboard type-breakdown presentation update — 2026-10-10

The owner requested the screenshot-backed leave-type breakdown presentation: four responsive cards with quota, total/applied metadata, and circular Applied/Pending/Approved/Rejected counters. The previous tabular breakdown was replaced in the dashboard component with feature-scoped semantic cards; the dashboard contract data shape and server-side request-count semantics remain unchanged. The cards use the existing Sigma theme tokens and collapse to two columns and then one column at narrow widths. Runtime visual verification remains pending because browser verification is outside the current source-only boundary.

## Sidebar active-state correction — 2026-10-10

The sidebar previously used prefix matching for every leaf, so `/Leave` was marked active beside `/Leave/dashboard`. Leave leaf activation now uses the shared menu item metadata with an exact Dashboard match and an explicit `/Leave/dashboard` exclusion for the Leaves item; detail/create routes continue to activate Leaves through prefix matching.
