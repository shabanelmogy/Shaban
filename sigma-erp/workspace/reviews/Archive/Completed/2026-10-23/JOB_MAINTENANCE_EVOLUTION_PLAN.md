# Sigma Maintenance / Evolution Plan: Workshop Job and Lubrication Job refactor

This plan records the existing Job capability and the requested refactor before
implementation. It is **Frozen** using the user's direction to choose the best
business-aligned implementation, with conservative choices grounded in the
current Job and Lubrication Job models and APIs.

## Plan metadata

| Item | Value |
|---|---|
| Change | Workshop Job list/editor, Lubrication Job create, and unified typed Jobs grid |
| Requested outcome | Refactor src/app/modules/Workshop/Job to the Sigma patterns and Job Estimation layout/interaction reference, add the screenshot-backed Lubrication Job create workflow, and distinguish Job and Lubrication Job records in the main list with a type filter and column. |
| Plan date | 2026-09-25 |
| Status | Job and Lubrication Job View/Edit/Approve/Reject lifecycle source implementation is complete; owner-run Add-Migration and build/test/runtime checks remain pending |
| Plan owner | User/system owner; the user specified the required list actions and approved the pending-to-terminal lifecycle |
| Canonical references | Master 1.6; UI and Backend pattern books; generated PLAN-00 and Phase 00–06 packets (recipe drift check passed earlier in this task) |
| Scope | Workshop Job Angular list/editor, unified Job and Lubrication Job read grid, separate Lubrication Job create route/form, direct route/provider/menu/i18n wiring, Job backend DTO/service/controller/mapping, Lubrication Job validation and aggregate persistence, plus feature review artifacts and the reusable skill note |
| Non-goals | Implement unrequested screenshot actions (print, close, invoice, quality report); change Job Estimation behavior; create, edit, or run a migration; build, test, lint, database, or browser commands |

## Requested outcome and boundaries

Use Job Estimation as the direct list/editor layout and interaction reference:
shared title and primary button, compact aligned filters, shared data table,
bounded full-page editor, and internal pane scrolling. Retain Job's own master
fields, grouped work details, child rows, financial calculations, and API
contracts. The separately user-approved approval lifecycle is documented below;
do not copy estimate log or conversion behavior into Job.

Add the separate Lubrication Job create form visible in Job/4.PNG and reached
from the Jobs page button. Reuse the existing backend LubricationJob and
LubricationJobItem contract: JobDate, CustomerId, and repeated VehicleId, SMR,
ServiceDate, Consumable, and Quantity rows. Show Make and Model from the
selected Vehicle; do not persist duplicate vehicle labels. Use shared Sigma
page/editor controls and do not add a separate Lubrication Job list. The later
user-approved View/Edit/Approve/Reject actions belong on the unified Jobs grid.

The four screenshots are functional and content evidence only. The user
initially deferred row-action behavior and later specified View/Edit plus the
approval/rejection lifecycle below. Other screenshot actions remain deferred.

## Scope Extension: Unified Jobs Read Grid (2026-09-25)

The user requested a filter alongside the existing list filters and a table
column that distinguishes Jobs from Lubrication Jobs. Source inspection showed
that `JobService.GetManyAsync` reads only `Job`, while `LubricationJob` is a
separate entity with its own create route and no frontend list. Extend the
existing `/Job` paged read contract to return both entity types in one server-
filtered, server-sorted, server-paged result. Add a `RecordType` filter with
All/Job/Lubrication Job choices and a `RecordType` column. Keep the existing
Job detail `JobType` filter separate.

Use the existing common list fields where each source has matching data:
Lubrication Job number, creator, JobDate, customer, and its item vehicles map to
the corresponding visible columns. Keep unavailable values (estimate number,
completion time and financial total) null and render them as not applicable;
do not fabricate values. Approval status is now persisted for both sources by
the lifecycle extension below. Apply shared filters to each
source where the fields exist. Job-only filters exclude Lubrication Job rows
when active. Keep the unified grid composite key because primary keys are
independent across the two tables. For a Lubrication Job with multiple
vehicles, vehicle, branch, ownership, and insurance filters must all match the
same item vehicle. The unified grid itself needs no schema change; the
subsequent lifecycle extension below adds persisted ApprovalStatus to
LubricationJob.

## Scope Extension: Job and Lubrication Job Approval Lifecycle (2026-09-25)

The user requested approval and rejection actions for both record types, and
view/edit actions for Lubrication Job, following the existing Job Estimation
lifecycle. Apply one-way `NotApproved -> Approved` or `NotApproved -> Rejected`
transitions. Both terminal states are read-only and undeletable. Only pending
records expose edit/approve/reject actions. Keep view available in all states;
do not add an unapprove/reopen/delete UI action or a rejection-reason flow.

Job already persists the shared `ApprovalStatus` enum. LubricationJob does not;
add the same non-null enum property with a `NotApproved` default and configure
the database default so existing rows receive the pending state. Add/Update
requests do not accept ApprovalStatus; the backend owns it. This requires the
owner to run `Add-Migration` for the LubricationJob column. Do not create, edit,
or run a migration or model snapshot here, per the repository boundary.

Expose dedicated approval-status operations through each existing service and
controller. Enforce pending-only mutation at the backend even when a caller
bypasses the UI. Use ApprovalStatus as an optimistic concurrency value and
force the aggregate-root check for child-only edits so a stale editor cannot
commit after a concurrent decision. Extend the existing Lubrication Job create form component to
serve create/view/edit route modes, using its existing aggregate endpoint and
shared controls. Do not add a Job/Lubrication Job log or other row actions as
part of this lifecycle slice; neither entity currently has the Job Estimation
append-only log model, and those extra actions were not requested here.

## Screenshot evidence register

| Evidence | Visible content/behavior | Classification | Source cross-check |
|---|---|---|---|
| Job/1.PNG | Job list title; Lubrication Job and Create Job buttons; filters for Job No, Estimation No, Work Order No, Type, date range, plate/chassis, customer, status, branch, ownership, creator, insurance company, sales person, labour type, and item type; table columns Job No, Estimation No, Vehicle, Customer, Customer Code, Creator User Name, Total Charges, Date & Time, Completion Date/Time, Status, Branch, Insurance Company | Visible fields/buttons are Explicit; request serialization and filter semantics are not shown | Job model supports several fields and related vehicle/customer data; Work Order relationship and Open/Closed Job status are not present in the Job model |
| Job/2.PNG | Row action dropdown showing View, Edit, Print, Print Gate Pass, Labour Job Time, Close Job, Create Invoice, Cancel Job, Delete, Vehicle Quality Check Report, and Log | Labels are explicit; beyond the later user-approved View/Edit/Approve/Reject lifecycle, effects and authorization remain unknown/deferred | Implement View/Edit/Approve/Reject as defined in the lifecycle extension; leave print, close, invoice, quality report, log, and other screenshot workflows deferred |
| Job/3.PNG | Full-page Job editor: date and estimated completion, customer, sales person, PO, vehicle, mileage, make/model/year/chassis, notes; job type/detail; item, labour, misc, and external-work rows; totals and save/cancel | Visible fields and groups Explicit; editable/read-only ownership, validation, and calculation inputs must follow existing source/domain | Job/JobDetail and child entities already model most group/row values; current Job Add/Update VMs and Angular models omit several of them |
| Job/4.PNG | Separate Lubrication Job form with date, customer, vehicle, make/model, SMR, consumable, service date, quantity, add/remove row, save/cancel | Visible fields and add workflow Explicit | Existing backend entity/DTO/API has JobDate, CustomerId, VehicleId, SMR, ServiceDate, Consumable, Quantity; no Workshop Angular screen or route was found |

Locale, viewport, role, current-vs-historical states, and action permissions were
not supplied as separate metadata.

## Existing-State Inventory

| Concern | Current owner/source | Current behavior and consumers | Gap/risk |
|---|---|---|---|
| Angular list | SiGmaAngularFrontEnd/src/app/modules/Workshop/Job/components/list | Legacy ms-lib table-list; untyped rows; no screenshot filters; columns expose master IDs/raw fields | Refactor to app-data-table and the Job Estimation list pattern |
| Angular editor | Workshop/Job/components/details | One route component for create/view/edit; raw IDs and native date inputs; no nested editor arrays; basic save/update/delete handlers | Replace with explicit create/edit/view route modes and typed aggregate form following the Job Estimation editor layout |
| Angular models/API | Workshop/Job/models and services/job.service.ts | DTOs expose only shallow master fields; service relies on generic calls | Expand only to existing domain fields and standard paged/list/detail contracts; inspect direct consumers before narrowing models |
| Domain/persistence | SigmaBackend/SiGma.Helpers/Models/Workshops/Jobs/Job.cs and JobDetail.cs | Job stores estimate link/number, dates, customer/salesperson/PO/vehicle/mileage/notes, totals, ApprovalStatus; detail groups store JobType, ServiceId, Detail and child item/labour/misc/external-work rows | Core group/row domain already exists; LubricationJob ApprovalStatus is the later confirmed schema addition |
| Backend Job writer/read | SigmaBackend/SiGma.Business/Services/JobService.cs | Full aggregate loaded for old list; add/update validate FK collections with ExistsAsync; update is untracked and omits ExternalWorks; missing-Job guard is commented out | Replace with canonical paged GetManyAsync(ListSmBase) and Pattern 3 tracked aggregate reconciliation, count validation, and server recalculation |
| Backend API/DTOs | JobController, Job VMs, JobProfiler | Controller overrides GET list to call GetManyWithNavigationsAsync; VMs omit ServiceId/Detail and do not return display names needed by a useful view/list | Freeze field ownership and standard list/detail contracts before implementation |
| Job Estimation conversion | JobEstimationService.CreateJobAsync | Creates Job with JobEstimationId/EstimationNo, date, customer, vehicle, mileage, JobType/ServiceId/Detail, items/labour/misc; uses 5% Job domain tax; leaves external works empty | Direct writer must keep working when Job DTO/editor changes; conversion itself is out of scope |
| Direct consumers | Angular voucher/stock consumers use JobService; backend Job reads include generic selects and Job Estimation conversion | Job service is used by Purchase Requests/Orders, Provisions, Credit Notes, Bills, JVs, GRNs and Stock item flows | Preserve generic select/detail endpoints and response wrappers; inspect only directly changed consumers during reconciliation |
| Lubrication Job | Backend controller/service/models/DTOs exist; no matching Workshop Angular screen found | Generic CRUD plus eager-loaded detail/list; current writers use weak FK existence checks and untracked replacement on update | Add screenshot-backed create form/route and Jobs entry point; repair reference validation and tracked item reconciliation using the existing schema/API |
| Shared wiring | LayoutModule provides JobService and the interceptor-enabled HttpClient | Authenticated services are resolved from the Layout injector | Retain provider identity; no feature-level client/interceptor workaround |

## Logic Ambiguity Register

| ID | Rule/contract | Status | Evidence | Owner/input needed |
|---|---|---|---|---|
| J-01 | Filter/list column Work Order No and its Job relationship | Resolved by conservative scope choice | Job has no WorkOrderId/navigation; WorkOrder has no JobId/navigation; user delegated the best business-aligned choice | Omit this filter/column. Do not add a relationship or migration solely to support a screenshot filter; revisit only when the business defines a real link |
| J-02 | Screenshot Job Status Open/Closed | Resolved by conservative scope choice | Job stores ApprovalStatus only; screenshot shows Open/Closed and a deferred Close Job action; user delegated the best business-aligned choice | Show and filter the existing ApprovalStatus values, labelled Approval Status. Do not map them to Open/Closed or invent a lifecycle field |
| J-03 | Screenshot-specific row actions | Superseded in part | The user later specified View/Edit and the approval/rejection lifecycle for Job and Lubrication Job | Implement View for every state; Edit/Approve/Reject only while pending. Keep unrequested print, close, invoice, and quality-report actions deferred |
| J-04 | Lubrication Job entry point and form | Resolved/in scope | User explicitly asked to inspect and add Lubrication Job; screenshot 4 shows the separate create form and the backend entity/DTO/API already exist | Add `/LubricationJob/create` and link it from Jobs; keep records in the unified list, apply the separately approved lifecycle, and do not add a separate list |
| J-05 | Make/model/year/chassis on Job editor | Derived | These values are on the selected Vehicle; Job does not persist duplicate fields | Display from Vehicle DTO; retain user-entered Mileage; do not add duplicate columns |
| J-06 | Branch/insurance/ownership filters and list projection | Derived, subject to query translation | Vehicle has BranchId, Ownership, and Documents; Job is linked to Vehicle | Reuse the existing Job Estimation vehicle/insurance projection semantics where supported; no new persistence |
| J-07 | Job type/labour type/item type filter semantics | Derived | Types are in JobDetail.JobType, JobLabour.LabourType, and Item.ItemType | Filter Jobs where any non-deleted nested row/group matches the selected value |
| J-08 | Editable ApprovalStatus ownership | Resolved | Job persists ApprovalStatus; the user later requested lifecycle actions for both record types | Server owns initial NotApproved and persisted status; ordinary Add/Update cannot change it; only pending records can transition to Approved or Rejected |

## Impact Map

| Producer/consumer | Potential effect | Handling |
|---|---|---|
| Job list and routed editor | New paged filters/list row and full aggregate form | Implement with J-01 omitted and J-02 represented by ApprovalStatus |
| Job backend add/update | Nested grouped children and totals | Use Pattern 3; preserve 5% current calculation and keep totals server-owned |
| Job Estimation create-job | Directly creates Job graph | Preserve API/domain compatibility; no change to conversion rules |
| Generic Job selects and direct Angular consumers | Depend on list/detail and standard response shapes | Retain endpoints and avoid narrowing shared Job types without checking consumers |
| Work Order and Job domain | No change | No business relationship exists in current models; do not introduce one just to populate a filter |
| Job action menu and state | Could change persistence, invoices, status, authorization | Implement user-approved View/Edit/Approve/Reject lifecycle; defer remaining screenshot actions pending their individual contracts |
| Lubrication Job | Separate create route using existing endpoint | Add the confirmed create form and wire the Jobs page button to it; expose its source-specific lifecycle actions in the shared Jobs list, with no separate list |

## Gap Decision Table

| Area | Decision | Evidence/reason |
|---|---|---|
| Job list UI | Refactor | Existing screen uses retired ms-lib; Job Estimation is the user-selected direct reference |
| Job editor UI | Refactor | Existing form omits nested aggregate and uses native date controls; Job Estimation is direct layout reference |
| Job list API | Refactor | Existing list loads full graph and uses a nonstandard list override; backend pattern requires paged GetManyAsync(ListSmBase) |
| Job Add/Update | Refactor | Existing update is untracked and incomplete for ExternalWork; aggregate needs tracked reconciliation and FK distinct-count validation |
| Job financial calculation | Keep and harden | Existing domain is authoritative for item/labour/misc/external work and 5% tax; do not change tax semantics |
| Work Order link/status lifecycle | Defer | Do not invent properties or states without a business relationship/lifecycle requirement |
| Screenshot row actions | Partially implement | User later specified View/Edit/Approve/Reject and the one-way approval lifecycle; other screenshot actions still lack defined effects |
| Lubrication Job create | Implement | User explicitly added it; screenshot and existing backend contract define the create fields and row operations |

## Option / Decision Matrix

| Choice | Option considered | Decision | Reason |
|---|---|---|---|
| UI shape | Copy screenshot CSS vs. use canonical Sigma screen structure | Job Estimation is the direct structure reference, by explicit user instruction | Shared components and current Sigma conventions; keep Job-specific data |
| Backend shape | Generic CRUD vs. master-detail with server financial recalculation | Pattern 3 | Job owns child prices, discounts, external work totals, tax, and total recalculation |
| Work Order filter | Add an association vs. omit | Omit | No persisted relationship or business link exists; avoid a schema change for a filter-only requirement |
| Job Status | Map ApprovalStatus to Open/Closed vs. display the existing approval state | Display existing ApprovalStatus | Preserve the actual domain meaning and defer Open/Closed until the lifecycle/Close action is specified |
| Action menu | Implement screenshot labels now vs. scoped lifecycle actions | Implement the user-approved View/Edit/Approve/Reject actions; defer others | The user explicitly requested view/edit and JobEstimation-style approve/reject; other labels still lack defined behavior |

## Proposed Target Contract (not frozen)

- List/editor visual structure follows Job Estimation: same shared feature title,
  panel, filter alignment, app-data-table, paginator, full-page bounded editor,
  and internal scroll ownership.
- Use explicit routes for list, create, edit, and view. Preserve list query state
  on editor round trips.
- Job editor uses a typed master-detail form for Job master fields, repeated Job
  groups (JobType/Service/Detail), and item/labour/misc/external-work rows.
- Backend uses Pattern 3, paged GetManyAsync(ListSmBase), the standard detail
  endpoint, distinct-count FK validation, tracked aggregate reconciliation, and
  backend calculations. Add/Update exclude identity, audit, approval, and totals;
  a new Job receives the existing server-owned NotApproved default.
- Existing Job Estimation conversion remains compatible. Implement View for all
  records and Edit/Approve/Reject only for pending Job and Lubrication Job rows;
  leave other screenshot action workflows deferred.
- Lubrication Job uses the existing entity/API and a separate create route. It
  validates Customer and Vehicle references, saves its repeatable item
  collection as one aggregate, and displays make/model from the selected
  Vehicle. Keep one shared list; the lifecycle extension adds persisted approval
  state to LubricationJob and requires an owner-run migration.
- Work Order No is intentionally omitted and the status field is labelled
  Approval Status; no Work Order association or Open/Closed operational state
  is introduced.

## Migration and compatibility plan

The original list/editor baseline needs no schema change. The later approval
extension adds persisted ApprovalStatus to LubricationJob; the owner must run
Add-Migration to add a non-null column defaulted/backfilled to NotApproved
before using lifecycle actions. Do not add a Job/WorkOrder relationship or
operational Open/Closed Job status. If future owner-directed work defines either
domain concept, define cardinality/state transitions, backfill, indexes, and
existing-record behavior before any migration.
Keep Job Estimation conversion, existing Job selection APIs, and direct
consumers compatible.

## Dependency-ordered implementation and verification plan

| Slice | Work | Gate |
|---|---|---|
| 0 | Source inventory, screenshot evidence, ambiguity/impact/options | Complete; conservative list/status choices are recorded |
| 1 | Freeze Job list/status/association/DTO contracts and Lubrication Job create payload | Complete; use decisions above and the existing LubricationJob DTOs |
| 2 | Paged read grid and filters | Complete; implement supported filters and omit Work Order No |
| 3 | Full-page create/edit/view form and Pattern 3 API | Complete; preserve Job Estimation conversion and direct consumers |
| 4 | View/Edit and approval actions for both record types | Complete in source; owner migration and verification remain |
| 5 | Route/provider/interceptor/i18n/consumer wiring for Job and Lubrication Job | Complete; editor and Lubrication Job navigation preserve Jobs list query state |
| 6 | Source diff reconciliation only | Complete; source review and git diff --check only. Builds/tests/runtime/db/browser checks remain owner-run per AGENTS |

Source-only verification after implementation will review the scoped diff,
contract parity, direct consumers, mappings, translations, route/provider scope,
and git diff --check. Builds, tests, lint, migration/database, and browser
verification are prohibited in this workspace workflow.

## Open Decisions Register

No decision blocks the list/editor baseline. The following work remains deferred
by user direction and is intentionally outside this plan's implementation:

1. Screenshot actions beyond View/Edit/Approve/Reject (the user will specify
   them one at a time).
2. Any future Job-to-WorkOrder business relationship.
3. An Open/Closed operational Job lifecycle and its state transitions.
