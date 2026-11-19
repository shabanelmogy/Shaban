# Job Estimation Feature Review

| Item | Decision or evidence |
|---|---|
| Requested outcome | Add Job Estimation under `SiGmaAngularFrontEnd/src/app/modules/Workshop`, with matching backend APIs and persistence. |
| Source scope | Workshop Angular feature, top-level lazy route/menu/i18n, existing JobEstimation backend and directly required Job/JobDetail, numbering, upload, and lookup sources. |
| Maintenance / Evolution Plan | [Plan](JOB_ESTIMATION_MAINTENANCE_EVOLUTION_PLAN.md), Frozen after the user approved append-only log entries in every estimate state. |
| UI shapes | Routed list with `app-feature-title`, compact filters and `app-data-table`; amended full-page routed Create/Edit/View form with a full-width estimate-details section above a two-column Jobs/master-detail workspace; shared `app-form-section` and editable child-collection tables; separate shared Report page and small log-entry dialog. See the user-directed editor amendment below. |
| Backend patterns | Canonical Pattern 3 master-detail shape for server-owned calculations; this estimate does not post journals or allocations. Use canonical `GetManyAsync(ListSmBase)` for the paged list; do not use the legacy custom search or transitional `QueryReport<T>`. |
| Approved UI references | Shared `data-table`; `Fleet/VehicleService/components/list`; `Accounts/openingBalances/components/details`; canonical routed full-page detail form at `Rental/RentalQuotation/components/details`; shared `form-section`, `editable-collection-table`, report page/actions and `ReportPrintService`; `Fleet/VehicleService/components/details`. |
| Approved backend references | Canonical Backend Pattern 3 / `InvoiceService` for its graph and transaction decision points only; `SalesQuotationService` for the stateful-action specialization, with only the approved transitions. Do not copy invoice accounting writes or quotation actions not present in this domain. |
| Routes | Add lazy top-level `/JobEstimation` route to the Workshop feature, full-page `create`, `edit/:id`, and `view/:id` editor routes, and a report child route that receives current list filters. Create/Edit/View route state carries list filters, page, page size, and sort back to the list. This supersedes the initial modal-only route decision by explicit user instruction. |
| Endpoints | Canonical paged GET list, existing generic detail/add/update/delete routes with guarded semantics, status transition action, create-Job action, log read/add, insurer select source, and typed JobEstimation/options for effective tax percentage. Keep existing POST search additive for external compatibility. |
| Actions | View, Edit, Delete (pending only), Approve, Reject, Print, Log, Create Job (approved and not yet linked), list Report, and Excel Export. See the action matrix. |
| Permission mechanism | AuthGuard only. There is no backend permission API; enforce state and ownership rules server-side and do not describe menu visibility as authorization. |
| Applicable phases | PLAN-00; PHASE-00 through PHASE-06. Recipe drift check passed on 2026-09-24. |
| Explicit exclusions | Migration generation/application; builds, tests, lint, database commands, browser/runtime verification; unrelated Job/Workshop refactors; historical number or Job-link backfill. |
| Existing changes | Both application repositories were clean at preflight. Only review artifacts and the requested reusable skill guidance have been edited so far. |

## Evidence boundary and metadata

The attached screenshots are user-provided functional/content evidence. They do
not override the request or canonical guides and do not authorize copying layout,
styles, control choice, or business rules that are not visible or source-backed.
Screenshot locale/version, capture date, role, and viewport metadata were not
provided.

### Evidence E1 — `1.PNG`

| Evidence | Classification | Required feature behavior | Owning phase | Guide-compliant implementation |
|---|---|---|---|---|
| E1 | Explicit visible list content; row action/state mapping supported by E2/E3 and owner decisions | Estimate list filters and columns, Search, Report and Export to Excel. Pending row shows View/Edit/Print/Delete/Approve/Reject/Log in the menu. | 0, 2, 4 | Compact filter strip and `app-data-table`; server paging, exact filters and a typed action menu. Report and export use shared report/export patterns. |

### Evidence E2 — `2.PNG`

| Evidence | Classification | Required feature behavior | Owning phase | Guide-compliant implementation |
|---|---|---|---|---|
| E2 | Explicit menu content; association with Approved comes from the visible row badge | Approved row exposes View, Print and Log; after a Job exists, the separately approved conversion action is not offered again. | 0, 2, 4 | Backend `ApprovalStatus` and `HasJob` drive the action model; backend rejects invalid/replayed actions. |

### Evidence E3 — `3.PNG`

| Evidence | Classification | Required feature behavior | Owning phase | Guide-compliant implementation |
|---|---|---|---|---|
| E3 | Explicit menu content; association with Rejected comes from the visible row badge | Rejected row exposes View and Log. It cannot be edited, deleted, approved again, or converted to a Job. | 0, 2, 4 | Terminal state is enforced by service methods; visible menu is a convenience, not security. |

### Evidence E4 — `4.PNG`

| Evidence | Classification | Required feature behavior | Owning phase | Guide-compliant implementation |
|---|---|---|---|---|
| E4 | Explicit detail content | Read-only detail shows estimate date, customer, vehicle, mileage, make/model, year, chassis; grouped type/service/detail; item/labour/misc rows; discounts, 5% tax and totals. | 0, 1, 3 | Same View-mode `app-editor-dialog`; typed detail DTO; backend-calculated totals and shared collection/view patterns. |

### Evidence E5 — `5.PNG`

| Evidence | Classification | Required feature behavior | Owning phase | Guide-compliant implementation |
|---|---|---|---|---|
| E5 | Explicit log columns and example events | Estimate log shows date/time, user, detail and attachments. System events include estimate creation, approval outcome and Job creation. | 0, 1, 3, 4 | Dedicated estimate log/attachment child records; server-owned audit values; event kinds rendered through translations. |

### Evidence E6 — `6.PNG`

| Evidence | Classification | Required feature behavior | Owning phase | Guide-compliant implementation |
|---|---|---|---|---|
| E6 | Explicit manual log form content | Add an entry with detail and attachments, then save/cancel. | 0, 1, 3 | Shared small `app-editor-dialog`; existing Media upload rules (PDF/JPG/JPEG/PNG, 5 MB); track and clean abandoned paths per canonical upload guidance. Append-only entries are allowed in every estimate state. |

### Evidence E7 — `7.PNG`

| Evidence | Classification | Required feature behavior | Owning phase | Guide-compliant implementation |
|---|---|---|---|---|
| E7 | Explicit editor fields and collection groups | Create estimate with date/time, type, customer, vehicle, mileage, read-only vehicle details, grouped jobs, items, labour, misc, live total preview and server save. | 0, 1, 3 | Create mode of the same controlled dialog; typed reactive form and shared editable collection components; server owns numbering/status/totals. |

## Grid column contract

| Visible label | Frontend property | Backend ListVM property | Display transformation | Filterable | Sortable | Exported | Confidence |
|---|---|---|---|---|---|---|---|
| Actions | `id`, `approvalStatus`, `hasJob` | `Id`, `ApprovalStatus`, `HasJob` | State-specific menu; print additionally consumes the existing print setting | No | No | No | Confirmed by frozen actions and server source |
| Estimation No | `no` | `No` | Exact server-generated value; badge reflects approval state | Yes (`No`) | Yes | Yes | Confirmed; current custom search incorrectly returns Id |
| Vehicle | `vehicle` | `Vehicle` | Plate number, falling back to chassis number | Yes (`PlateNoOrChassisNo`) | Yes | Yes | Confirmed by existing projection |
| Customer | `customer` | `Customer` | Partner name | Yes (`CustomerId`) | Yes | Yes | Confirmed by existing projection |
| Customer Code | `customerCode` | `CustomerCode` | Customer code | No separate control | Yes | Yes | Confirmed by existing projection |
| Creator User Name | `createdBy` | `CreatedBy` | Stored audit identity string as-is; no user-name join is evidenced | Yes (`CreatedBy`) | Yes | Yes | Derived from `EntityBase.CreatedBy` |
| Total Charges | `totalCharges` | `TotalCharges` | Locale-formatted decimal, two fractional digits | No | Yes | Yes | Confirmed; backend calculation is authoritative |
| Date & Time | `dateAndTime` | `DateAndTime` | Localized date/time presentation | Yes (date range) | Yes | Yes | Confirmed |
| Status | `status` | `Status` | Open for NotApproved; Closed for Approved or Rejected | Yes (`Status`) | Yes | Yes | Confirmed in current service |
| Insurance Company | `insuranceCompany` | `InsuranceCompany` | Latest non-expired vehicle Insurance document IssuedBy; stable order IssueDate/CreatedAt/Id | Yes (`InsuranceCompany`) | Yes | Yes | User-approved derived value |

Default list order is `DateAndTime` descending, then `Id` descending. The backend
whitelists sort properties, counts before paging, and returns authoritative
`TotalCount`/`TotalPages`. Default page size is 10. Empty optional filter values
are omitted; `Status` enum values are serialized explicitly.

## Filter contract

| UI control | Angular property | Query key | Backend parser/type | Default or absence behavior |
|---|---|---|---|---|
| Estimation No | `no` | `No` | `FilterHelper.GetString` | Contains match against human-readable `EntityBase.No` |
| Customer | `customerId` | `CustomerId` | `GetInt` | No filter when absent |
| Approval Status | `approvalStatus` | `ApprovalStatus` | `GetEnum<ApprovalStatus>` | No filter when absent |
| Date Range | `dateRange` | `DateFrom`, `DateTo` | `GetDate` | Defaults to first through last day of current month; end is inclusive in UI and converted to a half-open server interval |
| Plate No/Chassis No | `plateNoOrChassisNo` | `PlateNoOrChassisNo` | `GetString` | Contains match against either vehicle field |
| Status | `status` | `Status` | `GetEnum<Status>` | Open means NotApproved; Closed means Approved or Rejected |
| Type | `jobType` | `JobType` | `GetEnum<JobType>` | Matches any grouped Job type |
| Branch | `branchId` | `BranchId` | `GetInt` | Matches Vehicle.BranchId |
| Created By | `createdBy` | `CreatedBy` | `GetString` | Matches stored creator identity |
| Insurance Company | `insuranceCompany` | `InsuranceCompany` | `GetString` | Matches latest non-expired Insurance document IssuedBy; null expiry remains current |

Use the shared typeable two-month range picker. Report receives the current
filter set and displays every matching record. Excel export also fetches every
matching page; a failed page fails the export rather than producing a partial
file. Export columns follow the grid contract, translated for the current
language, without Actions.

## Detail, Add and Update contract

| UI field | Detail DTO | Add DTO | Update DTO | Server-owned/validation |
|---|---|---|---|---|
| Estimate identity/No | `Id`, `No` | — | `Id` only | `No` generated server-side; never accepted from client |
| Date & Time | `DateAndTime` | `DateAndTime` | `DateAndTime` | Required; editor initializes to current time on Create |
| Customer | Id/name/code | `CustomerId` | `CustomerId` | Required, validates Partner id |
| Vehicle | id/plate/chassis/make/model/year | `VehicleId` | `VehicleId` | Required; validate vehicle; read-only vehicle display values are not posted |
| Mileage | `Mileage` | `Mileage` | `Mileage` | Client editable; vehicle details remain server-derived |
| Approval Status | `ApprovalStatus` | — | — | Server-owned; new estimate defaults NotApproved |
| Job group | Type, ServiceId/name, Detail, child arrays | `JobType`, `ServiceId`, `Detail`, Add child DTOs | `Id`, same editable values | Add/Update require at least one group and a defined JobType; preserve legacy nullable stored JobType values; validate WorkshopActivity; Service and Detail are optional |
| Item row | Item id/name, UnitPrice, Qty, Disc, Price | ItemId, UnitPrice, Qty, Disc | Id plus editable values | Verify distinct item ids belong to tenant; recalculate Price |
| Labour row | LabourType, StaffId/name, Cost, Disc, Charges | LabourType, StaffId, Cost, Disc | Id plus editable values | Verify staff ids; recalculate Charges |
| Misc row | MiscDescription, Charges | MiscDescription, Charges | Id plus editable values | Recalculate parent totals |
| Totals/Tax | ItemsTotal, LabourTotal, MiscTotal, TaxAmount, TotalCharges | — | — | Server-owned; current 5% is returned as effectiveTaxRatePercent by JobEstimation/options; future settings integration stays backend-owned |

The form may show live totals as a preview only. Save recalculates child amounts
and the aggregate on the backend. Add/Update reconcile the tracked graph, reject
foreign child ids and duplicate/invalid lookup ids, and save once after
validation. The backend requires at least one job group; no line-type-specific
minimum beyond the existing row validation is inferred.

## Action-state contract

| Action | Visible when | Server permits when | Confirmation/input | Refresh/recovery |
|---|---|---|---|---|
| View | Every state | Record exists in tenant | None | Open same editor in view mode |
| Edit | NotApproved only | NotApproved only | Dirty-discard confirmation on close | Refresh current page on success |
| Delete | NotApproved only | NotApproved only | Shared delete confirmation | Refresh current page; if last row was removed, move to prior page |
| Approve | NotApproved only | NotApproved only -> Approved | Shared yes/no confirmation | Refresh row state and action menu |
| Reject | NotApproved only | NotApproved only -> Rejected | Shared yes/no confirmation | Refresh row state and action menu |
| Print estimate | Approved; NotApproved only when the existing setting permits it | Record exists; rejected estimates are not printable through this menu | None | Use ReportPrintService; print full estimate |
| Log | Every state | Record exists in tenant | None | Open log; append entries are available in every estimate state |
| Add log entry | Log dialog | Record exists in any state | Typed detail and selected attachments | Preserve draft on save failure; clean orphaned uploads on cancel/failure |
| Create Job | Approved and no linked Job | Approved and no linked Job; duplicate/replayed request returns the existing linked Job | Shared confirmation | Add one Job plus Job Created log; refresh row/action state |
| Report | List page | Read-only | Current list filters | Open shared report page with all matching records |
| Export to Excel | List page | Read-only | Current list filters | Fetch all pages; no partial workbook on page failure |

UI visibility is not a security boundary. State guards, ownership and idempotency
are enforced in the backend. Approved and Rejected estimates are terminal,
read-only and undeletable; log entries remain append-only and may be added in
every state.

## Route/provider/integration contract

| Route/dialog | Component | Mode source | Detail id | Exit target | Dirty protection |
|---|---|---|---|---|---|
| `/JobEstimation` | Feature list | Lazy route under authenticated shell | — | Normal route navigation | List has no dirty state |
| `/JobEstimation/create`, `/edit/:id`, `/view/:id` | Full-page `JobEstimationEditorComponent` | Route `data.mode` (`create`, `edit`, `view`) | `:id` for Edit/View | `/JobEstimation` with original filter/page/sort query state | Shared confirmation for dirty Create/Edit; View and pristine state return directly |
| `/JobEstimation/report` | Shared Report page component and typed report rows | Query-string/list state carrying active filters | — | List/back | Read-only |
| Estimate Log | Shared small editor dialog | Selected row id | `JobEstimationId` | Parent editor/list; emit changed if a log was added | Preserve detail/attachments on failure |

Feature HTTP services are registered in the interceptor-owning LayoutModule
provider list and use the configured HttpClient. No manual Authorization header,
root-provider interceptor bypass or feature-specific HttpClient is allowed.
Route access uses AuthGuard; no role/permission API is added. All subscriptions
use destruction/cancellation, loading finalizes on both response paths, and the
UI handles both `isSuccess: false` and transport errors.

## Frozen log rule

The user approved append-only manual log entries in every estimate state on 2026-09-24.

## User-directed editor contract amendment — 2026-09-24

The initial Phase 0 decision used one controlled `app-editor-dialog` and a
list-only editor route. After that decision, the user explicitly requested a
full-page editor and clarified its structure. This amendment supersedes only the
editor shape and route rows above; the frozen Phase 1 backend/API contract and
the list, report, log, and action contracts remain unchanged.

| Decision | Current contract | Evidence |
|---|---|---|
| Editor shape | Use full-page `/JobEstimation/create`, `/edit/:id`, and `/view/:id` routes. Keep one typed parent form and the shared child collections. | User requested “make it full page” on 2026-09-24; canonical UI variant: routed full-page detail form with a bounded child collection. |
| Form layout | First row is a full-width Estimate Details section. Second row is a two-column master-detail workspace: Jobs selector on the left; selected job type, service, detail, items, labour, and misc on the right. | User's 2026-09-24 row-layout clarification, grounded by screenshot E7's estimate and grouped job content. |
| Form state and print | Keep every job group in the existing typed `FormArray`; selection is UI state only. Print all groups even though the screen edits one selected group at a time. | Existing Add/Update detail contract and visible grouped rows in E4/E7. |
| Route round trip | Carry active filters, page, page size, and sort from the list into the editor and back. Dirty editable state uses the shared confirmation before returning. | Full-page route requires preserving the user's list context; user confirmed full-page navigation. |

This is a frontend presentation/routing change only. It does not add or alter
backend fields, endpoints, calculations, or state transitions.

## Phase 0 handoff

Functional evidence, canonical shapes, sources, filters, columns, editor mode,
actions, and integration are recorded. Phase 1 must freeze the server DTO,
validation, transaction, migration, numbering, log, and action contracts before
Phase 2/3 implementation starts. Screenshots remain functional/content evidence
only; the guides own layout and control choices.

## Relocated from the sigma-screen-refactor skill — 2026-09-28

Owner decision D5 (`SIGMA_DOCUMENTATION_SYSTEM_MAINTENANCE_EVOLUTION_PLAN.md`):
feature-specific choices live in the feature artifact, not in the general
skill. The following text was in skill §2.5 and is preserved here unchanged in
meaning.

| Item | Scoped decision |
|---|---|
| Panel shape | Keep the outer list and editor panels of Job Estimation square-cornered, with a clearly visible shadow. Scoped to this feature; not a general Sigma rule |
| Job Details heading | Hide the Job Details section heading using the shared `app-form-section` heading option |
| Reference role | The Job Estimation list/editor is the layout and interaction reference for Workshop Job screens: shared page shell and title, aligned compact filters, data table and paginator, full-page bounded editor, pane-owned scrolling. Job screens copy that layout, not Job Estimation's domain behavior |
| Approval model | The generic approval-lifecycle invariants now in skill §4.5 were first established on this feature |
