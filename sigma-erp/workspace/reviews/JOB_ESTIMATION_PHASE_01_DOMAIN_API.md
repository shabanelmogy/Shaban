# Job Estimation — Phase 1 Domain, Persistence, and API Handoff

**Status:** Frozen after the user approved append-only manual log entries in every estimate state on 2026-09-24.

**Inputs:** [Maintenance plan](JOB_ESTIMATION_MAINTENANCE_EVOLUTION_PLAN.md),
[Phase 0 feature review](JOB_ESTIMATION_FEATURE_REVIEW.md), canonical Backend
Pattern 3, canonical list/filter/action/numbering/report blocks, and the generated
PHASE-01 packet. Recipe drift check passed on 2026-09-24.

## Selected backend shape

Use canonical Backend Pattern 3 as the master-detail shape for server-owned
discount and tax calculations. Job Estimation does not write journal vouchers,
allocations, or accounting state. A one-save graph path uses EF Core's implicit
transaction; only the numbering path needs an explicit transaction if the
counter lock/update is not part of the same atomic save.

Use `GetManyAsync(ListSmBase)` with `FilterHelper` for the screen list. Retain the
existing POST search action during the compatibility window, but do not use it
for the new Angular client. Use the standard aggregate detail route. Do not use
the transitional `QueryReport<T>`; the report page gathers all pages from the
canonical list endpoint using the current filters.

## Entity and persistence contract

| Entity | Frozen/proposed data shape | Persistence/ownership rule |
|---|---|---|
| `JobEstimation` | Existing date, customer, vehicle, mileage, ApprovalStatus, totals, and grouped child collection | EntityBase No is generated on the server. ApprovalStatus defaults NotApproved and is server-owned. Totals recalculate on the server. Add unique `(SubscriptionId, No)` index. |
| `JobEstimationJob` | Existing JobType plus nullable `ServiceId` -> WorkshopActivity and optional `Detail` text | Add/Update require at least one group and a defined JobType. Keep the persisted JobType column nullable to preserve legacy null rows; service FK is tenant-valid when present. |
| `JobDetail` | Add nullable `ServiceId` -> WorkshopActivity and optional `Detail` | Preserve group data when estimate creates a Job. Existing JobDetails remain valid with null values. |
| `Job` | Add nullable `JobEstimationId` and navigation to JobEstimation | Unique filtered/nullable index enforces at most one linked Job per estimate. Do not infer/backfill old links from `EstimationNo`. Keep `EstimationNo` for compatibility/display. |
| `JobEstimationLog` | Estimate FK, event kind, optional manual detail, EntityBase audit | Server owns CreatedAt/CreatedBy. Event kinds: Added, Approved, Rejected, JobCreated, Manual. Manual text is preserved as entered. |
| `JobEstimationLogAttachment` | Log FK, original file name, shared Media path | Tenant-owned log parent; path must be in the authenticated tenant's Media area. |
| `DocumentNumberCounter` | EntityBase tenant ownership, document type key, current sequence | Unique `(SubscriptionId, DocumentType)`; increments atomically with estimate creation. Do not expose or mutate SubscriptionId in payloads. |

Existing estimates/jobs remain readable because ServiceId/Detail and the
JobEstimation link are nullable. Existing numbers and unlinked Jobs are not
rewritten. Before adding the unique estimate-number index, the owner must check
for duplicate `(SubscriptionId, No)` values and resolve any collisions.

## DTO ownership matrix

| Field | Entity owner | List | Detail | Add | Update | Select/action | Owner/reason |
|---|---|---|---|---|---|---|---|
| Identity | JobEstimation.Id | Id | Id | — | Id | action route | Server identity |
| Estimate number | JobEstimation.No | No | No | — | — | — | Server counter and settings; never client supplied |
| Date/time | JobEstimation.DateAndTime | — | DateAndTime | DateAndTime | DateAndTime | — | Required user input |
| Customer | CustomerId/Partner | Customer, CustomerCode | Id, name, code | CustomerId | CustomerId | customer select | Required; server verifies Partner |
| Vehicle | VehicleId/Vehicle | Vehicle | Id, plate, chassis, make/model/year | VehicleId | VehicleId | vehicle select | Required; server verifies Vehicle |
| Mileage | JobEstimation.Mileage | — | Mileage | Mileage | Mileage | — | Editable text; server does not accept derived display details |
| Approval | ApprovalStatus | ApprovalStatus | ApprovalStatus | — | — | ChangeApprovalStatus request | Server-owned; only NotApproved -> Approved/Rejected |
| Job conversion state | Job.JobEstimationId | HasJob | linked Job Id in action response | — | — | CreateJob action | At most one; approved estimates only |
| Service/detail | JobEstimationJob / JobDetail | — | ServiceId/name, Detail | ServiceId, Detail | same plus child Id | WorkshopActivity select | Optional service/text; validate tenant-owned lookup |
| Item rows | JobEstimationItem | — | item Id/name, UnitPrice, Qty, Disc, Price | ItemId, UnitPrice, Qty, Disc | child Id plus editable values | item select | Price is calculated, never accepted |
| Labour rows | JobEstimationLabour | — | LabourType, StaffId/name, Cost, Disc, Charges | LabourType, StaffId, Cost, Disc | child Id plus editable values | staff select | Charges is calculated, never accepted |
| Misc rows | JobEstimationMisc | — | MiscDescription, Charges | MiscDescription, Charges | child Id plus editable values | — | Client-editable charges; parent total recalculated |
| Totals/tax | JobEstimation | TotalCharges | ItemsTotal, LabourTotal, MiscTotal, TaxAmount, TotalCharges | — | — | — | Server calculation; preserve current 5%; the backend calculation accepts an effective rate input for future settings resolution |
| Log audit | JobEstimationLog | — | CreatedAt, CreatedBy, event/detail, attachments | — | — | AddLog request has detail + uploaded attachment metadata | Server audit; log is append-only |

Every update child id must be proven to belong to the tenant and the submitted
parent. Validate every distinct FK by count, not with `Any`. Update loads the
tracked graph and reconciles children before saving. Add/Update do not accept
No, approval status, calculated values, CreatedBy, CreatedAt, or SubscriptionId.

## Validation and invariant table

| Invariant | Add | Update | Delete/action | Persistence support | Failure |
|---|---|---|---|---|---|
| Customer and Vehicle required | Verify tenant-valid ids | Verify tenant-valid ids | — | FK relations | Actionable business failure |
| At least one Job group | Require one, validate each JobType | Same | — | Owned detail collection | Actionable business failure |
| Service/item/staff references | Verify all distinct ids and tenant ownership | Same, plus child ownership | — | FK relations | Reject any missing/foreign id |
| Calculations | Recalculate item price, labour charges and parent totals | Recalculate after tracked child reconciliation | Job conversion recalculates target Job | Existing domain methods and precision | Client totals ignored |
| Approval state | New record NotApproved | Update only NotApproved | Only NotApproved -> Approved/Rejected; terminal rows cannot be edited/deleted | ApprovalStatus concurrency token; service state guard | Stale/concurrent transition fails with safe message |
| Job creation | — | — | Explicit action only when Approved, no linked Job | Unique nullable JobEstimationId | Retry returns existing linked Job; potential legacy EstimationNo conflict is not auto-linked |
| Number | Ignore client | Preserve current | Generate under tenant/document-type counter | Unique `(SubscriptionId, No)` plus counter unique key | Collision/config errors surface; do not renumber history |
| Log | Added event in same write unit | No implicit edit event | Approved/Rejected/JobCreated system events; manual append allowed in every estimate state | Dedicated log/attachment tables, cascade from estimate | Do not commit event without its owning mutation |
| Upload | No upload fields in estimate DTO | — | Media validates tenant path/signature/size/type | Shared Media endpoint; allow PDF/JPG/JPEG/PNG, 5MB | Invalid/unowned paths rejected; UI retains failed cleanup paths |

Job conversion copies DateAndTime to Job.DateAndTime and
Job.EstimatedCompletionTime, CustomerId, VehicleId, Mileage, and the estimate
No to Job.EstimationNo. It copies every JobType/ServiceId/Detail group and each
item/labour/misc row. It uses the existing Job NotApproved default and server
recalculation. SalesPersonId and PONo stay unset because the estimate has no
source value for them. The conversion and JobCreated event persist together.

The action must not infer/backfill a historical `Job.EstimationNo` string as a
link. If the target uniqueness check finds an existing link, return it. If an
unlinked legacy Job appears to use the same estimate number, return a conflict
for owner reconciliation rather than creating a duplicate or inventing a link.

## Transaction boundary table

| Method/path | SaveChanges reached | Child reconciliation | Transaction owner and decision |
|---|---:|---|---|
| Add estimate + Added log + counter | One graph save | New graph; server recalculates children | JobEstimation Add owns the explicit serializable counter transaction if required to create/increment sequence safely. Counter and estimate must commit atomically. |
| Update estimate | One | Tracked graph, explicitly reconcile owned children | EF implicit transaction is sufficient for the single save. |
| Approve/Reject + log | One | No estimate-child mutation | EF implicit transaction; approval concurrency condition is included in the same save. |
| Create Job + JobCreated log | One | Build Job graph from the approved estimate; no loaded unrelated navigation objects | EF implicit transaction plus unique JobEstimationId; handle unique-index retry by reading existing link. |
| Add manual log + attachment rows | One | Append rows only | EF implicit transaction. Available in every estimate state. |
| Read list/detail/log/report | Zero | No tracking/projected read | No transaction required. Report gathers every page from the same filtered list contract. |

## Endpoint contract

| Operation | Method/route | Request | Response | State/tenant rule |
|---|---|---|---|---|
| List | `GET /JobEstimation?PageNo=&PageSize=&Filters[key]=` | Filter map, paging, sorting | `Results<JobEstimationListVM>` with total count/pages | Authenticated, repository tenant scope; deterministic filter/order |
| Legacy search | Existing `POST /JobEstimation/search` | Existing request | Existing response | Retain for external compatibility; no new UI use |
| Detail | Generic `GET /JobEstimation/GetByWithNavigationsId/{id}` | id | One aggregate detail VM | Tenant-scoped, includes customer, vehicle and child lookups |
| Add | Generic `POST /JobEstimation` | Add VM | Result | Server No/ApprovalStatus/totals/audit |
| Update | Generic `PUT /JobEstimation` | Update VM | Result | NotApproved only |
| Delete | Generic `DELETE /JobEstimation?id={id}` | id | Result | NotApproved only; standard soft-delete behavior |
| Change approval | Existing `POST /JobEstimation/change-approval-status` | Id + target Approved/Rejected | Result | Only from NotApproved; status+log atomic |
| Create Job | `POST /JobEstimation/{id}/create-job` | id | Result including Job id/number | Approved only, at most one, idempotent |
| Read logs | `GET /JobEstimation/{id}/logs` | id | `Results<JobEstimationLogVM>` or typed list | Tenant-scoped and ordered by CreatedAt, Id |
| Add log | `POST /JobEstimation/{id}/logs` | Manual detail and uploaded attachment paths/filenames | Result | Parent exists in any state; append-only |
| Insurance options | `GET /JobEstimation/insurance-companies` | — | `Results<DropDownSelect>` or typed values | Distinct current IssuedBy values using the approved document rule |
| Calculation options | GET /JobEstimation/options | — | Result<JobEstimationOptionsDto> (effectiveTaxRatePercent) | Backend-owned current value 5%; future source is settings |

The Report page is a UI read-only document built by gathering all pages from the
same GET list contract. It has no extra server-side totals and does not call
transitional `QueryReport<T>`. Individual estimate print and report print use
the shared `ReportPrintService`.

## Migration and compatibility decision

| Change | Schema/API impact | Existing data/consumer handling | Owner action |
|---|---|---|---|
| ServiceId/Detail on JobEstimationJob and JobDetail | Nullable FK/text columns | Existing rows remain valid; no backfill | Run Add-Migration and inspect generated FK/index behavior |
| JobEstimationLog and attachment child | New tables/FKs | No historical logs can be reconstructed; paths are shared Media paths | Run Add-Migration; owner checks retention and cascade behavior |
| Job.JobEstimationId | Nullable FK and unique index | Existing Job.EstimationNo values remain unlinked | Run Add-Migration; do not infer old links |
| DocumentNumberCounter + unique JobEstimation.No | New counter table/index and tenant/business-number unique index | Preserve historical No; audit duplicate `(SubscriptionId, No)` before unique index | Run Add-Migration and validate concurrent create behavior |
| Standard GET list | Additive endpoint | Keep existing POST search while external clients are unknown | Inventory callers before any later deprecation |
| Create Job action/log endpoints | Additive endpoints | New behavior is separately invoked; Jobs have no historical link backfill | Owner validates duplicate/retry and downstream Job workflow |

No migration was generated or run. The owner must run and review Add-Migration
after source changes. Builds, tests, lint, browser, database and runtime checks
remain outside the current authorization boundary.

## Frozen owner decision

Manual log entries are append-only and may be added in every estimate state, including Approved and Rejected. The decision was confirmed by the user on 2026-09-24. The UI must keep estimate values read-only in terminal states while leaving the separate log append action available.
