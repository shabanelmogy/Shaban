# Dashboard snapshot and real-time contract

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-19 |
| Plan | DASHBOARD_REALTIME_MAINTENANCE_EVOLUTION_PLAN.md |

## API and route

New authenticated `GET /Dashboard/Snapshot?ownership=own&fleetType=rental`, `Result<DashboardSnapshotDto>`. Existing `/Dashboard/Agreements2` remains unchanged. New filter VM string allowlists: ownership `all/own/external/buyBack`, fleetType `all/rental/replacement/staff`; omitted defaults all/all at API, existing UI defaults own/rental retained. Unknown values return HTTP400 via model validation. Tenant from existing claims/QueryReport only. No paging/export/editor/write DTO. Snapshot totals cover the complete filtered population; queries aggregate in SQL sequentially on the scoped DbContext.

Pending new DTO files under Helpers/Dtos/Dashboard: DashboardSnapshotDto, DashboardIdleVehicleRowDto, DashboardOpenAgreementRowDto, DashboardHiredVehicleRowDto. Snapshot JSON: `generatedAtUtc` ISO timestamp, `vehiclesTotal` number, `counts` Record<string,number|null>, `idleVehicles`, `openAgreements`, `hiredVehicles`. Count key convention `<card-id>.<metric suffix>`; suffix matches existing `DASHBOARD_UI.METRICS.*` final segment or `TOTAL`. Unknown/missing keys display unavailable. Cards remain frontend-owned presentation metadata.

Idle row fields: `branchId` number|null, `branch` string|null, `pendingCustomerDelivery`, `pendingWorkshopDelivery`, `notReady`, `available`, `readyToGo`, `custody`, `total` all numbers. Open agreement row: `branchId`, `branch`, `daily`, `weekly`, `monthly`, `lease`, `total`. Hired row: `type` = rental/lease, `permanentCar` number|null, `serviceReplacement` number|null, `temporaryCar` number|null, `total` number. Names missing in source stay null, rendered with a translated unavailable label. Tables are complete small branch/category summaries and not paged ListVMs.

## Derived populations

- Vehicle status: latest live tenant VehicleStatus by CreatedAt desc, Id desc, matching VehicleService. No status does not mean Available. Total includes every matching live vehicle. HIRED_OUT includes Hired/Rented, WORKSHOP includes Workshop/Maintenance; IDLE is the union of the six idle-table statuses. Include Booked and remaining statuses in presentation without making overlapping chart segments.
- Bookings: live !Inactive New/Confirmed; pickup today [UTC midnight,tomorrow), overdue <today; New and Confirmed separate current states.
- Rental/lease: !IsVoided; open !IsClosed; opened-today by DateAndTime in UTC day; due/overdue only open and ReturnDateAndTime/EndDate. CLOSED_TODAY null: no authoritative closed timestamp. Open branch table uses same open rows and vehicle's current branch, Daily/Weekly/Monthly and Lease.
- Workshop/NRM: currently Workshop/Maintenance or NRM vehicles; latest dated live WorkshopMovement or NRM per vehicle determines category. Count current vehicles, not historical movements. Missing source classification remains unclassified, never guessed.
- Fleet: actual Rental/Replacement/Staff membership and total. Hired table reads open rental/lease agreements grouped by kind; lease PermanentVehicle gives permanent/temporary; rental permanent/temporary and serviceReplacement remain null without a classification source. The label/guide must explain agreement population, not claim distinct physical fleet vehicles.
- Customer requests: tenant-wide Open and CreatedAt today; CLOSED_TODAY null. Limousine: persisted TripBooking.Status; FINISHED_TODAY uses FinishedAt UTC day. Vehicle membership applies when either filter is selected.
- Jobs: JobStatus.Open; age DATEDIFF(day, DateAndTime, UTC today), buckets 0-2,3-5,6-8,9-10,>10, future dated open jobs in first bucket to keep coverage. Job estimations: ApprovalStatus.NotApproved. Approvals only when persisted source state proves pending: LeaseQuotation.InternalApproval Pending, JobEstimation.NotApproved; company/unsupported categories null. Additional confirmed pending sources may be added only after root records a contract amendment.

## Real-time shared boundary

Hub `/hubs/realtime`, `[Authorize]`, closes at authentication expiration. `Subscribe(topic)` / `Unsubscribe(topic)` accept only registered topic `dashboard` initially; group is server-derived tenant + topic. Client event `ResourceChanged` payload `{topic, occurredAtUtc}`. No browser publish method or tenant argument. JWT query token accepted only on this hub path (WebSocket/SSE requirement), existing HTTP bearer path retained. Hub authorization adds no roles/permission policy.

Pending shared Angular service `RealtimeService`: `watch(topic: string): Observable<RealtimeNotification>`, notification `{topic, reason: 'connected'|'changed', occurredAtUtc?: string}`; `status()` signal values connecting/connected/reconnecting/disconnected; `retry(): void`. One ref-counted connection; auto reconnect plus initial/final-close retry; rejoin desired topics then connected event; stop/remove handlers on last unsubscribe/logout/session replacement. Consumer uses typed root HttpClient for snapshots, single switchMap stream, event coalescing, cancellation/teardown, inline error+Retry and periodic reconciliation. The socket uses accessTokenFactory, not a separate HTTP client/manual HTTP authorization.

## Conformance evidence before edits

| Concern | Book | Reference/shared owner | Target contract |
|---|---|---|---|
| Shell/title/filters | UI1/3/4 | existing Dashboard + Job list; FeatureTitle/FilterPanel | Preserve host/container bounds, own/rental reset, fixed header/filter |
| KPI cards | UI24 | SummaryCards + SummaryCard value contract | Readonly typed cards; null represented as text unavailable |
| Error/read lifecycle | UI22/28 | Job bindListQueries; apiErrorMessage | Skip-error header, one inline owner, switchMap/finalize/teardown |
| Read model | BE17 | QueryReport<T>, existing Dashboard service | Sequential SQL aggregation, no CRUD/entity/mapping |
| Vehicle state | BE17 | VehicleService.SearchAsync | CreatedAt then Id latest ordering |
| Security/integration | UI1/26, BE17 | Program/JWT, Repository.NameIdentifier | Existing authentication + tenant isolation, no permissions invented |

## Screenshot evidence

| ID/file | Explicit content | Strong inference / unknown | Treatment |
|---|---|---|---|
| E1 Desktop/1.PNG | Ownership/fleet filters; vehicles, bookings, rental/lease agreements, workshop, NRM, limousine | Formulas, cutoff, authorization unknown | Keep supported labels and source-backed state counts; use real FleetType values |
| E2 Desktop/2.PNG | Idle branch columns; open branch agreement columns | Paging/sort/export unknown | Complete typed summary rows; current branch relationship, no new action |
| E3 Desktop/3.PNG | Fleet totals, hired classification, requests, WIP buckets, pending estimates, approval types | Classification/close-time sources partly absent | Add backed sections; nullable unavailable values for absent source |

All screenshots are English LTR desktop functional evidence; capture date/version/role unknown; numbers are examples, never seeds. Their design does not override shared presentation owners.

## Source reconciliation amendments (2026-10-19)

The root review clarified vehicle `IDLE`: five idle states excluding NotReady,
because the vehicle chart already has a separate `NOT_READY` segment. The idle
branch table keeps all six displayed states; its total equals IDLE + NOT_READY.
The remaining physical statuses have separate keys REPLACEMENT, SOLD, DEFLEETED,
ALL_ACTIVE_PLUS_DEFLEETED and UNKNOWN_STATUS (missing/undefined status). This
preserves disjoint chart counts; it does not change persisted statuses.
Workshop KPI consumes vehicles.WORKSHOP, including unclassified/Breakdown,
rather than summing the four classified movement categories. Approval KPI stays
unavailable when any included category is unsupported. Every due-approval count
is tenant-wide; operational pending Job Estimations apply the vehicle filters.
Ambient transactions and writes bypassing EF interception use periodic
reconciliation rather than an unproven precommit notification. These explicit
delivery boundaries preserve the frozen best-effort snapshot architecture.

Root-approved pending-source expansion after writer/action tracing: Rental
Quotation internal Pending AND customer Pending (CanApproveInternally), Rental
and Lease Master Agreements ApprovalStatus.NotApproved, Purchase Request
ApprovalStatus.NotApproved (GetApproval/DecideApproval), Purchase Order
ApprovedStatus.NotApproved (ToggleApprovalStatus), Receipt/CreditNote/DebitNote
!IsVoided AND ApprovalStatus.NotApproved (their approval actions), manual JV
!IsGenerated AND !IsVoided AND !IsPosted AND ApprovalStatus.NotApproved. These
are count projections only, with no workflow or existing-source edits. Company,
Invoice, Bill, Payment and Asset Disposal remain unavailable because no direct
pending approval contract was established. The topic dependency list includes
every newly counted persisted type. Lease Quotation retains its previously
frozen InternalApproval.Pending count; its scope is pending internal state,
not a claim that every pending item is actionable.

Manual JV also excludes VoucherSubType.OpeningBalanceJV, matching its approval
action's explicit prohibition. Pending-state counts do not promise immediate
action eligibility: existing period, linked-voucher and accounting validation
remain in their domain action owners.
