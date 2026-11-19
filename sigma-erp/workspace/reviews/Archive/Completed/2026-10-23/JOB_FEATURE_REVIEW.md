# Workshop Job Feature Review

## Feature Review Manifest

| Item | Contract |
|---|---|
| Feature | Workshop Job and Lubrication Job create |
| Request | Refactor the Job screen under src/app/modules/Workshop/Job, add the screenshot-backed Lubrication Job create workflow and required backend/frontend support, follow the guides without inventing patterns; the user later specified View/Edit and approval/rejection actions for both Job record types |
| Status | Job and Lubrication Job View/Edit/Approve/Reject source implementation is complete; the later row-action extension is recorded in `Workshop/JOB_ACTIONS_20261009.md`; owner-run verification and LubricationJob Add-Migration remain pending |
| UI reference | Job Estimation list/editor, explicitly selected by the user as the exact layout/interaction reference; preserve Job-specific fields and domain behavior |
| Backend shape | Pattern 3: master-detail with server-owned financial recalculation |
| Screenshot source | User-provided Job/1.PNG through Job/4.PNG; content/workflow evidence only |
| Existing-state plan | JOB_MAINTENANCE_EVOLUTION_PLAN.md |
| Scope | Job Angular list/editor and unified Job/Lubrication Job grid, Lubrication Job create route/form, direct routing/provider/menu/i18n wiring, Job backend controller/service/interface/mapping/ViewModels and Lubrication Job validation/aggregate persistence; direct Job consumers only |
| Preserved behavior | Job Estimation conversion, generic Job select/detail consumers, server-side Job financial calculation at the existing 5% rate |
| Deferred | Historical screenshot actions were deferred here; the later user-authorized Cancel/quality report/log/estimation extension is frozen in `Workshop/JOB_ACTIONS_20261009_CONTRACT_FREEZE.md` and reconciled in `Workshop/JOB_ACTIONS_20261009.md` |
| Prohibited | Creating/editing/running migrations; build, tests, lint, database and browser checks per AGENTS |

## User-Approved Scope Extension — Unified Typed Grid (2026-09-25)

This addendum supersedes the earlier decision that Lubrication Job has a create
route only and is absent from the Jobs list. The user requested a filter and a
table column to distinguish the two record kinds. The main `/Job` grid will
include records from both existing entities and show a `Record Type` column plus
a `Record Type` filter (All, Job, Lubrication Job). Keep the existing nested
`Job Type` filter for `JobDetail.JobType` as a separate filter.

The backend list remains server-filtered, server-sorted, and server-paged with
an accurate combined count. Map existing values only: Lubrication Job number,
creator, job date, customer, vehicles, branch, and insurer where available.
Leave fields absent from that entity (estimate number, completion time, and
total charges) null and render them as not applicable. Approval status is
persisted for both entities by the lifecycle extension below. Shared
filters apply to both sources when supported; Job-only filters exclude
Lubrication Job rows while active. Dispatch View/Edit/Approve/Reject actions by
record type to the matching route and service. Keep View available in every
state; only pending records can be edited or approved/rejected.
Use a composite frontend table key to avoid collisions between independent
entity IDs.

## User-Approved Scope Extension — Approval Lifecycle (2026-09-25)

The user requested approval/rejection on both Job record types and view/edit
actions for Lubrication Job. Use the existing Job Estimation transition:
`NotApproved -> Approved` or `NotApproved -> Rejected`; approved/rejected are
terminal. Backend Add owns the pending default; Update/Delete reject terminal
records. Keep View available in every state and Edit/Approve/Reject pending
only. Do not add a reopen/unapprove, Delete UI, rejection reason, or log action.

Job already has the persisted ApprovalStatus. LubricationJob needs a non-null
ApprovalStatus column whose initial/backfilled value is NotApproved. Backend
DTOs keep this status server-owned. The repository workflow prohibits
assistant-created or modified migrations/snapshots, so the owner must run
Add-Migration before using the expanded lifecycle against the database.

The UI also enforces the lock for direct edit routes: a terminal record opens
read-only and exposes no edit action. The backend independently rejects edits,
deletes, and invalid status transitions.

## Screenshot Functional Evidence Tables

### Screenshot 1 — list with filters and action affordances

| UI evidence | Classification | Current contract/source | Decision |
|---|---|---|---|
| Create Job button | Explicit | Existing create route exists | Keep as primary title action |
| Lubrication Job button | Explicit | Backend capability exists; no Workshop Angular screen was found | Route to the confirmed separate Lubrication Job create form |
| Job No filter/column | Explicit | EntityBase number | Supported |
| Estimation No filter/column | Explicit | Job.EstimationNo and Job.JobEstimationId | Supported |
| Work Order No filter | Explicit | No Job/WorkOrder relationship exists; user delegated the best business-aligned choice | Omit this filter/column; do not add a relationship or schema solely to support it |
| Type filter | Explicit | JobDetail.JobType | Supported as any non-deleted group match, subject to frozen contract |
| Date range | Explicit | Job.DateAndTime | Supported |
| Plate/Chassis filter; Vehicle column | Explicit | Job.VehicleId -> Vehicle.PlateNo/ChassisNo | Supported |
| Customer filter/column/code | Explicit | Job.CustomerId -> Partner; Partner.Customer.Code | Supported where tenant-safe |
| Status filter/column | Explicit | Job.ApprovalStatus exists; separate Open/Closed state does not | Show/filter the actual ApprovalStatus values with the label Approval Status; do not infer Open/Closed |
| Branch filter/column | Explicit | Vehicle.BranchId -> Branch | Supported where tenant-safe |
| Ownership filter | Explicit | Vehicle.Ownership | Supported |
| Created By filter/creator column | Explicit | EntityBase.CreatedBy | Stored audit value exists; display semantics need confirm if a human-readable name is required |
| Insurance Company filter/column | Explicit | Vehicle insurance documents; Job Estimation already implements latest effective document projection | Reuse existing source semantics |
| Sales Person filter | Explicit | Job.SalesPersonId -> Staff | Supported |
| Labour Type filter | Explicit | JobDetail.JobLabours.LabourType | Supported as any nested row match |
| Item Type filter | Explicit | JobDetail.JobItems.Item.ItemType | Supported as any nested row match |
| Report/export/search controls | Explicit | No Job report contract has been reviewed/frozen | Do not invent report/export scope; search is part of the list contract |
| Table columns | Explicit | Job number, estimate number, vehicle, customer, customer code, creator, total, date/time, completion, status, branch, insurer | All except Status have a source projection candidate; freeze Status before implementation |

### Screenshot 2 — row-action menu

| UI evidence | Classification | Decision |
|---|---|---|
| View, Edit, Print, Print Gate Pass, Labour Job Time, Close Job, Create Invoice, Cancel Job, Delete, Vehicle Quality Check Report, Log | Labels Explicit; state visibility/effects/permissions Unknown except later lifecycle request | Implement View in all states and Edit/Approve/Reject only while pending. Defer other screenshot workflows; terminal records cannot be edited or deleted through the backend. |

### Screenshot 3 — create/edit Job form

| UI evidence | Classification | Current source | Decision |
|---|---|---|---|
| Date and estimated completion time | Explicit | Job master fields | Add/Update fields; calendar controls following Job Estimation |
| Customer, sales person, PO number | Explicit | Job master fields/relationships | Typed controls and lookups |
| Vehicle, mileage | Explicit | Job master fields | Typed vehicle lookup; mileage remains editable |
| Make/model/year/chassis | Explicit | Vehicle master data | Display from selected Vehicle; do not duplicate these fields in Job |
| Notes | Explicit | Job master field | Editable text |
| Job type/service/detail | Explicit | JobDetail entity; incomplete Add/Update VMs | Preserve existing JobDetail shape and expose missing existing values in contracts |
| Item/labour/misc/external-work rows | Explicit | Child entities and calculation methods exist | Typed nested collections; backend recalculates prices/totals |
| Tax 5% and displayed totals | Explicit | Job.DefaultTaxRate is 5%; JobEstimation conversion also recalculates Job at this rate | Keep 5% for this refactor; do not change financial semantics |
| Save/cancel | Explicit | Generic Job add/update exists | Keep single standard write path and route back to list after success |

### Screenshot 4 — Lubrication Job

| UI evidence | Classification | Current source | Decision |
|---|---|---|---|
| Separate create form with Job Date and Customer | Explicit | LubricationJobAddVM has JobDate/CustomerId | Implement using the existing generic create API |
| Repeated Vehicle, Make and Model, SMR, Service Date, Consumable, Quantity rows; add/remove | Explicit | LubricationJobItemAddVM has VehicleId/SMR/ServiceDate/Consumable/Quantity; vehicle labels are available through Vehicle | Implement a typed collection; display Make and Model from the selected Vehicle without persisting duplicate fields |
| Save/Cancel | Explicit | Generic LubricationJob POST exists | Save aggregate then return to Jobs; cancel returns to Jobs |

The user explicitly added Lubrication Job after the initial row-action deferral,
then requested that it use the same View/Edit/Approve/Reject lifecycle. This
separate form and the source-specific actions in the shared Jobs grid are in
scope; other screenshot workflows and a separate Lubrication Job list remain
deferred.

## Grid, filter, detail, and write contracts

### Grid columns

Actions (View for all states; Edit/Approve/Reject while pending); Job No; Estimation No;
Vehicle; Customer; Customer Code; Creator User Name; Total Charges; Date & Time;
Completion Date/Time; Approval Status; Branch; Insurance Company. Action routes
and API calls dispatch by Record Type.

### Filters

Job No, Estimation No, Job Type, date range, plate/chassis, Customer,
Approval Status, Branch, Ownership, Created By, Insurance Company, Sales Person,
Labour Type, and Item Type. Work Order No is omitted because no Job/WorkOrder
relationship exists. Filters must use server-side paging/filtering, stable
sorting, and exact query keys.

### Detail/Add/Update

- Detail returns the Job master values, selected customer/vehicle/salesperson
  display data, Job Estimation number, grouped JobType/Service/Detail data,
  nested items/labour/misc/external work, server totals, and current
  ApprovalStatus as a domain value. ApprovalStatus is server-owned: create uses
  the existing NotApproved default and ordinary update cannot change it.
- Add/Update payloads include only editable master values and nested rows. The
  server owns Job number, identity, audit/tenant fields, ApprovalStatus,
  calculated child prices, and totals.
- Add/Update require tracked graph persistence, validation by distinct FK count,
  explicit reconciliation of child IDs/ownership, and one save of the aggregate
  graph. Preserve the current tax calculation and Job Estimation conversion.
- Screenshot actions are not covered by these DTOs/endpoints.

## Route, provider, and interceptor contract

| Path | Component/mode | Exit/return |
|---|---|---|
| /Job | Job Estimation-style list | Preserve filters/page/sort |
| /Job/create | Full-page Job editor, create | Return to list and restore query state |
| /Job/edit/:id | Full-page Job editor, edit | Return to list and restore query state |
| /Job/view/:id | Full-page Job editor, read-only | Return to list and restore query state |
| /LubricationJob/create | Lubrication Job create form using the existing aggregate API | Return to Jobs and restore query state |

JobService is already registered in LayoutModule, which owns the
interceptor-enabled HttpClient. Preserve that provider scope; do not add manual
authorization headers or a second HttpClient chain.

## Backend/API contract handoff

| Operation | Current route | Proposed contract |
|---|---|---|
| Paged Job list | Generic GET overridden to GetManyWithNavigationsAsync | Standard GET list bound to ListSmBase and JobService.GetManyAsync; Results<JobListVM> with total/page metadata |
| Job detail | Generic GetByWithNavigationsId/{id} | Return the read-only labels and full nested aggregate required by the editor |
| Create | Generic POST Job | Typed JobAddVM; server validates references, maps nested group/rows, calculates financial values and saves once |
| Update | Generic PUT Job | Typed JobUpdateVM; load tracked aggregate with every child collection, validate child ownership/reference counts, reconcile, calculate and save once |
| Delete and screenshot actions | Existing generic delete and potential future actions | No Delete UI action; backend rejects deleting terminal records. Other screenshot actions remain deferred until the user defines their behavior |

No association or Open/Closed operational state is introduced for Work Order
No. LubricationJob ApprovalStatus requires the owner-run migration noted above.

## Verification and phase handoff

Phase 0 evidence, frozen contracts, implementation slices, and source-only
reconciliation are recorded in JOB_MAINTENANCE_EVOLUTION_PLAN.md and this
manifest. The workspace instructions prohibit builds, tests, lint,
migration/database commands, and browser/runtime verification; those remain
owner-run.

## Relocated from the sigma-screen-refactor skill — 2026-09-28

Owner decision D5 (`SIGMA_DOCUMENTATION_SYSTEM_MAINTENANCE_EVOLUTION_PLAN.md`):
feature-specific choices live in the feature artifact, not in the general
skill. The following text was in skill §2.5 and §4.5 and is preserved here
unchanged in meaning.

| Item | Scoped decision |
|---|---|
| UI reference | Use the implemented Job Estimation list/editor as the direct layout and interaction reference. Keep Job-specific fields, nested rows, and business rules; do not copy Job Estimation's domain behavior. Implement Job row-action workflows only as the user specifies them |
| Lubrication Job create fields | Job Date, Customer, and repeatable vehicle rows with Make and Model, SMR, Service Date, Consumable, and Quantity. Show vehicle labels from the selected Vehicle instead of persisting duplicates |
| Mixed Job grid actions | In the unified Job / Lubrication Job grid, dispatch View/Edit/Approve/Reject by the row's record discriminator to that source's route and API; show View always and Edit/Approve/Reject only while pending |
