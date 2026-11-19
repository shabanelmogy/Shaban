# Dashboard snapshot backend implementation

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-19 |
| Contract | DASHBOARD_REALTIME_API_CONTRACT_FREEZE.md |
| Scope | Snapshot read API only; reusable real-time infrastructure and UI remain root/peer owned |

## Pattern and conformance

Pattern 5 operational report (BE17), not CRUD. Canonical AGENTS, sigma-screen-refactor sections 8/8.1/8.2 and BE3/5/6/17 apply. Root owns packet drift check, shared contract freeze and final reconciliation.

| Concern | Owning block | Actual primary reference and symbol | Shared owner | Source comparison |
|---|---|---|---|---|
| Report read | BE17 | `SiGma.Business/Services/DailyServiceLogReportService.cs`, `BuildVehicleServiceMetricsAsync` | Repository `QueryReport<T>` | Dashboard `GetSnapshotAsync` uses `GroupBy`/Count/Sum projections before materialization; no CRUD inheritance, entity or mapping |
| Controller | BE6/17 | `SiGma.ServerAPI/Controller/DailyServiceLogReportController.cs`, `GetAsync` | MVC model validation, standard `Result<T>` | New `Snapshot` is GET, query filter and CancellationToken, `[Authorize]`, typed `Result<DashboardSnapshotDto>`; existing `Agreements2` keeps its historical route/auth behavior |
| Data carriers | BE3/5 | report filter/response and current DI scan rule | ViewModels and Helpers assemblies | Five new public sealed classes in five files; no nested data carriers or Business records introduced |
| Latest current state | BE17 | `SiGma.Business/Services/VehicleService.cs`, `SearchAsync` status ordering | VehicleStatus persisted source | Identical `CreatedAt DESC, Id DESC`; anti-exists row selection makes subsequent SQL grouping safe and handles null dates last |
| Tenant/live rows | BE17 | `SiGma.Repos/Repository/Repository.cs`, `QueryReport<T>` | NameIdentifier subscription resolution | Every source uses tenant/live/as-no-tracking report query, including branch names; no tenant supplied by client |
| Read consistency | BE17 | `DailyServiceLogReportService.GetReportAsync` | Scoped DbContext | All awaited database queries sequential; grouped rows only; no per-row/N+1 reads |

Reference service contains preexisting nested carriers and some financial in-memory reconciliation; these unrelated legacy details were not copied. Dashboard declarations follow current separate-file rule. No generic infrastructure extraction qualifies inside this feature-specific report query; root owns reusable SignalR extraction.

## Actual derivation evidence

- `Vehicle` stores `Ownership`, `FleetType` and nullable `BranchId`; actual enums are Own/External/BuyBack and Rental/Replacement/Staff. Filter VM accepts only the frozen string allowlists and defaults API omission to all/all. API model validation rejects missing/unknown supplied text.
- `VehicleStatus.Status` is nullable. `VehicleService.SearchAsync` orders by CreatedAt then Id descending. Snapshot uses those same live tenant rows, retaining no-status/unknown status rather than treating absence as Available. HIRED_OUT combines Hired/Rented; WORKSHOP combines Workshop/Maintenance. Per root's recorded contract amendment, IDLE comprises PendingCustomerDelivery/PendingWorkshopDelivery/Available/ReadyToGo/Custody, excluding separately displayed NOT_READY. The idle **table** retains all six statuses including NotReady. Remaining literal enum states have separate counts. `ALL_ACTIVE_PLUS_DEFLEETED` counts that literal stored state, not an invented active-fleet formula. `UNKNOWN_STATUS` covers null/no current status or an undefined persisted enum value.
- Idle table groups only the six idle states by the vehicle's current branch, with complete branch summaries. A missing, deleted or inaccessible branch name stays null; identity remains nullable/stored as appropriate. No per-branch lookup follows materialization.
- `Booking` stores Status, Inactive, PickUp and VehicleId. New/Confirmed and !Inactive form the current booking population. UTC midnight/tomorrow delimit due-today; earlier pickup means overdue.
- `RentalAgreement` and `LeaseAgreement` store IsVoided; base Agreement stores IsClosed and DateAndTime. Open means !IsClosed and !IsVoided. DateAndTime delimits opened-today, independent of current open/closed state. Open ReturnDateAndTime/EndDate supplies due/overdue. No authoritative close timestamp exists on these types; CLOSED_TODAY stays null.
- Open branch agreements use those same open rental/lease populations, unioned in SQL, with Daily/Weekly/Monthly from RentalAgreement.Type and Lease from the lease source. Current live vehicle supplies branch, never a historical branch guess. Missing vehicle/branch produces a null branch summary when all/all includes the agreement.
- Hired table counts **open agreements**, not distinct vehicles. Rental permanent/temporary have no classification source and remain null. Lease PermanentVehicle true/false supports permanent/temporary. ServiceReplacement is null for both. The table always returns rental and lease category rows, including truthful zero totals on empty populations.
- `WorkshopMovement.DateOf` and nullable Type support latest dated movement per current Workshop/Maintenance vehicle, with Id tie-breaker. `NRM.DateAndTime`/Type likewise classify current NRM vehicles. Missing classification is omitted from category totals rather than guessed; Workshop Breakdown is not relabelled as Repair.
- `CustomerRequest.Status` supports Open; CreatedAt supplies opened-today across the tenant. Close() stores no close timestamp, so CLOSED_TODAY remains null. Requests have no vehicle relation and are tenant-wide.
- `TripBooking.Status` supplies limousine counts. FINISHED_TODAY additionally requires FinishedAt inside the UTC day. Assigned is not silently counted as New/Dispatched. With a selected vehicle filter, records without matching live vehicle membership are excluded.
- `Job.Status == Open` forms WIP; SQL DateDiffDay(DateAndTime, UTC today) supplies disjoint <=2/3-5/6-8/9-10/>10 buckets. Future open jobs enter the first bucket so all open jobs appear exactly once. `JobEstimation.ApprovalStatus == NotApproved` supplies the filtered operational pending count.
- Due approvals are **tenant-wide**, confirmed by root during implementation. Source-backed pending-state expansion was approved and appended to the frozen contract by root. LeaseQuotation.InternalApproval Pending and JobEstimation.ApprovalStatus NotApproved remain. RentalQuotation requires InternalApproval Pending and CustomerApproval Pending, matching RentalQuotationService.CanApproveInternally. RentalMasterAgreement/LeaseMasterAgreement/PurchaseRequest use ApprovalStatus NotApproved; their Add/Approve/DecideApproval source establishes the state. PurchaseOrder uses ApprovedStatus NotApproved, matching source creation and ToggleApprovalStatusCoreAsync. Receipt/CreditNote/DebitNote require !IsVoided and ApprovalStatus NotApproved, matching their persisted fields and void rejection in ToggleApprovalCore. Manual JournalVoucher requires !IsGenerated, !IsVoided, !IsPosted, ApprovalStatus NotApproved and VoucherSubType != OpeningBalanceJV, matching the source-owned and opening-balance rejection in JournalVoucherService.ApproveCoreAsync. These are pending **state** counts, never a promise that account, period, linked-journal and other action validation will succeed. Companies/Invoice/Bills/Payments/Asset Dispose remain null: no direct matching workflow/source is proven, and no journal proxy was invented. Operational job-estimation pending honors vehicle filters while its due-approvals counterpart remains tenant-wide.
- Selected ownership/fleet predicates restrict vehicles first and then membership in bookings/agreements/trips/jobs/operational estimates. all/all includes unassigned operational rows. No new permissions, transitions, write methods, or accounting decisions were introduced.

All date comparisons use one UTC day captured at request start. GeneratedAtUtc records completion; sections execute sequentially and are not a transactionally frozen database snapshot. Intermediate committed writes may make sequential sections briefly differ; later invalidation/reconciliation reloads. No isolation/schema change is introduced.

## Exact count keys

The following prefixes plus listed suffixes are the produced dictionary keys. Every numeric key returns zero for an empty proven population; listed unavailable keys return null.

| Prefix | Numeric suffixes |
|---|---|
| `vehicles` | TOTAL, HIRED_OUT, NRM, WORKSHOP, NOT_READY, TOTAL_LOSS, FOR_SALE, BOOKED, REPLACEMENT, SOLD, DEFLEETED, ALL_ACTIVE_PLUS_DEFLEETED, UNKNOWN_STATUS, IDLE |
| `fleet-type` | RENTAL, REPLACEMENT, STAFF, TOTAL |
| `bookings` | NEW, CONFIRMED, DUE_CHECK_OUT_TODAY, OVERDUE_CHECK_OUT |
| `rental-agreements` | OPEN, OPENED_TODAY, DUE_CLOSE_TODAY, OVERDUE_CLOSING |
| `lease-agreements` | OPEN, OPENED_TODAY, DUE_CLOSE_TODAY, OVERDUE_CLOSING |
| `workshop` | MAINTENANCE, REPAIR, ACCIDENT_REPAIR, INSPECTION |
| `nrm` | NRM_STAFF_MOVEMENT, STAFF_CAR, SOLD_CAR_CUSTOMER_MOVEMENT, NRT, NRM_CUSTOMER_MOVEMENT |
| `customer-requests` | OPEN, OPENED_TODAY |
| `limousine` | NEW, DISPATCHED, STARTED, FINISHED_TODAY, CANCELLED, NO_SHOW |
| `jobs` | DAYS_0_2, DAYS_3_5, DAYS_6_8, DAYS_9_10, DAYS_OVER_10, TOTAL |
| `job-estimations` | PENDING |
| `due-approvals` | LEASE_QUOTATIONS, JOB_ESTIMATIONS, RENTAL_QUOTATIONS, RENTAL_MASTER_AGREEMENTS, LEASE_MASTER_AGREEMENTS, PURCHASE_REQUESTS, PURCHASE_ORDERS, RECEIPT, CREDIT_NOTES, DEBIT_NOTES, JV |

Explicit null keys: `rental-agreements.CLOSED_TODAY`, `lease-agreements.CLOSED_TODAY`, `customer-requests.CLOSED_TODAY`; due-approvals suffixes COMPANIES, INVOICE, BILLS, PAYMENTS, ASSET_DISPOSE. Unknown/absent keys remain unavailable at the consumer.

## Files and verification boundary

Changed existing DashboardService, IDashboardService and DashboardController; added DashboardSnapshotFilterVM and Helpers/Dtos/Dashboard/{DashboardSnapshotDto,DashboardIdleVehicleRowDto,DashboardOpenAgreementRowDto,DashboardHiredVehicleRowDto}. Existing SearchAgreementAnalysisAsync/Agreements2 body and authentication remain unchanged. No AutoMapper configuration needed; projections construct DTOs directly. No entity/configuration/schema changes and no migration required.

Source diff and API/DTO/enum/null/cancellation review performed in the actual SigmaBackend Git repository. Owner still verifies compilation, EF SQL translation (especially nullable latest-state anti-join, grouped union and DateDiffDay), performance against real data, UTC date interpretation for existing wall-clock columns, HTTP400 allowlists, auth, tenant isolation and runtime updates. No builds, tests, lint, runtime/browser/database commands, migrations, commits or pushes were run by this agent.

SignalR dependency types queried here: Vehicle, VehicleStatus, Branch, Booking, RentalAgreement, LeaseAgreement, WorkshopMovement, NRM, CustomerRequest, TripBooking, Job, JobEstimation, LeaseQuotation; approved expansion adds RentalQuotation, RentalMasterAgreement, LeaseMasterAgreement, PurchaseRequest, PurchaseOrder, Receipt, CreditNote, DebitNote and JournalVoucher. Root has this same list for committed-change notifications. Suggested backend commit message for the complete root-owned change: `feat(dashboard): add tenant-scoped snapshot and reusable realtime updates`.
