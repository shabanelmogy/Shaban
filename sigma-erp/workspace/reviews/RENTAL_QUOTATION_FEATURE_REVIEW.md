# Rental Quotation Feature Review Manifest

Review date: 2026-08-14

## Manifest

| Item | Decision or evidence |
|---|---|
| Requested outcome | Refactor `SiGmaAngularFrontEnd/src/app/modules/Rental/RentalQuotation` and its directly related .NET aggregate/API from the five supplied functional screenshots, then align its complete quotation action cycle with `SalesQuotationService`. |
| Source scope | Angular route, list/editor/rejection components, models, service, specs, print integration and EN/AR translations; .NET RentalQuotation header/item entities, EF configurations, VMs, mappers, service/interface and controllers. RentalMasterAgreement and SalesQuotation were inspected as read-only contract references. |
| Existing user changes | Unrelated working-tree changes, including migration and model-snapshot files, are excluded and preserved. No generated migration or snapshot was edited as part of this implementation. |
| Evidence | `RQ-E1` through `RQ-E5`: `C:/Users/user/Desktop/Quotation/1.PNG` through `5.PNG`; user confirmation that quotation Type is Daily, Weekly or Monthly; user confirmation that Revise appears after internal approval and that customer approve/reject must follow the SalesQuotation lifecycle. |
| UI shapes | Canonical shared list/grid with flat filters; list-owned controlled editor dialog; canonical editable collection table; shared confirmation dialog for confirmation-only actions; typed rejection dialog for reason-collecting actions. |
| Backend pattern | Pattern 2 master-detail plus the canonical quotation domain-action specialization. Header and owned lines are validated, recalculated and saved as one tracked aggregate; state transitions use explicit service methods and exact source-state validation. |
| Approved references | Shared `data-table`, `editor-dialog`, `editable-collection-table`, confirmation service, report-print service and the guide-approved list/editor references. Quotation action reference: `SalesQuotationService` plus its controller/interface and SalesQuotation list action cycle. |
| Routes and modes | `/RentalQuotation` owns the list and the controlled `create | view | edit` dialog state. No parallel dialog route or duplicate owner is exposed. |
| Endpoints | Inherited CRUD/detail routes; custom filtered/paged `GET /RentalQuotation`; POST actions `internally-approve`, `internally-reject`, `customer-approve`, `customer-reject`, `revise`, and `unapprove`. |
| Actions | Create, View, Print, Edit, Delete, Internally Approve/Reject, Customer Approve/Reject, Revise and Unapprove. Export and Refresh remain list operations. |
| Permission mechanism | Authenticated route/layout only; no application authorization API exists. UI action visibility is state presentation, while the backend revalidates ownership, dependencies and the legal source state. |
| Applicable phases | 00 discovery, 01 domain/API, 02 list/grid, 03 detail/write, 04 state actions, 05 integration, 06 reconciliation. |
| Packet status | The required recipe drift check reports every generated Phase 00–06 packet as stale. Generated packets were not treated as authority; the canonical books govern this implementation. The packet set must be regenerated and semantically reviewed. |
| Explicit exclusions | Database execution, migrations, runtime/browser verification, new authorization, Sales-only down-payment receipt generation, revision-copy/numbering without a frozen persistence contract, and master-agreement creation without a compatible contract. |
| Unresolved requirements | Screenshot R0/R1 copy/numbering is not represented by the current RentalQuotation entity/API. RentalMasterAgreement source conflicts with screenshot fields (Start/End/Approval versus Master Agreement Date/PO No/Payment Terms), so no invented or no-op creation action is exposed. |

## Functional Evidence

| Evidence | Classification | Required behavior | Owner | Decision |
|---|---|---|---|---|
| RQ-E1 | Explicit | Title/Create, six filters, Export/Refresh, data columns, status badges, paging and stateful row actions | 02/04 | Shared title/data table, typed filters, server paging/sorting/export, server-projected action flags and confirmations/reason dialogs. |
| RQ-E2 | Explicit | Create editor with Date, Type, Sales Person, Customer, Contact, Branch, line collection, totals, discount and notes | 03 | One typed modal editor with shared collection table; backend owns persisted totals. |
| RQ-E3 | Explicit | Existing quotation opens populated for revision; line charges show subtotal and Tax 5% | 01/03/04 | Detail/view/edit and 5% backend tax are implemented. Revise returns an internally approved/customer-pending quotation to Pending, matching SalesQuotation. Revision copy/numbering remains Missing. |
| RQ-E4 | Explicit | Approved quotation exposes View, Print and Create Master Agreement | 03/04 | View and shared print flow are implemented. Agreement hand-off remains Conflicting and is not simulated. |
| RQ-E5 | Explicit | Master Agreement modal asks for date, PO No and Payment Terms | 01/04 | Existing RentalMasterAgreement persistence requires a different field/lifecycle contract; creation remains blocked pending an owner decision. |
| User note | Confirmed | Quotation Type is Daily, Weekly or Monthly | 01/03 | Shared backend/frontend numeric enum uses exactly those three values. Existing persisted enum values require owner-led data cleanup/conversion before migration. |
| User note + Sales source | Confirmed | Revise after internal approval; customer approve/reject; unapprove after customer approval | 04 | Complete applicable Rental action matrix is implemented with exact source-state validation and backend-projected visibility flags. |
| RQ-E3 + entity source | Confirmed | Customer/Branch and at least one line are required; Sales Person and Contact may be blank | 01/03 | Nullable Sales Person/Contact are preserved; supplied ids are tenant-validated. Customer, Branch and one-or-more lines are required. |

## Grid, Filter and ListVM Contract

| Order | Grid label | Angular field | Backend ListVM field | Sortable/exported |
|---:|---|---|---|---|
| 1 | Actions | `id` + action-state booleans | `Id`, `CanEdit`, `CanDelete`, `CanApproveInternally`, `CanRejectInternally`, `CanApproveByCustomer`, `CanRejectByCustomer`, `CanRevise`, `CanUnapprove` | No / No |
| 2 | No | `no` | `No` | Yes / Yes |
| 3 | Date | `date` | `Date` | Yes / Yes |
| 4 | Customer | `customerName` | `CustomerName` | Yes / Yes |
| 5 | Customer Code | `customerCode` | `CustomerCode` | Yes / Yes |
| 6 | Amount | `amount` | `Amount` | Yes / Yes |
| 7 | Internal Approval | `internalApproval` | `InternalApproval` | Yes / Yes |
| 8 | Customer Approval | `customerApproval` | `CustomerApproval` | Yes / Yes |

The ListVM contains no tenant, audit, GUID, navigation, notes, lookup ids or child collection. Filter keys are exactly `quotationNo`, `customerId`, `branchId`, `dateFrom`, `dateTo`, `internalApproval`, and `customerApproval`; paging uses `PageNo`/`PageSize`, and sorting is whitelisted through `sortField`/`sortOrder`.

| Filter/control | Request key | Behavior |
|---|---|---|
| Quotation No | `Filters[quotationNo]` | Trimmed contains match. |
| Customer | `Filters[customerId]` | Exact tenant-owned id. |
| Branch | `Filters[branchId]` | Exact tenant-owned id. |
| Date range | `Filters[dateFrom]`, `Filters[dateTo]` | Inclusive local calendar dates; no invented initial default. |
| Internal Approval | `Filters[internalApproval]` | Defined enum value only. |
| Customer Approval | `Filters[customerApproval]` | Defined enum value only. |
| Paging | `PageNo`, `PageSize` | One-based; server clamps size to 1..200 and corrects a page beyond the last page. |
| Sorting | `Filters[sortField]`, `Filters[sortOrder]` | Whitelisted grid field and `1`/`-1`; stable `Id` tie-breaker. |

## Detail and Write Contract

| Field | Detail | Add | Update | Owner/validation |
|---|---|---|---|---|
| `id`, `no` | Yes | No | `id` only | Server identity/document number |
| `date` | Yes | Yes | Yes | Real date, normalized to date-only |
| `type` | Yes | Yes | Yes | Required nullable command input prevents an omitted value silently binding to Daily; persisted value is one of Daily/Weekly/Monthly |
| `customerId`, `branchId` | Yes | Yes | Yes | Required positive ids verified inside the tenant |
| `salesPersonId`, `contactPersonId` | Yes | Optional | Optional | Omitted is valid; supplied positive ids are verified inside the tenant, and a supplied contact must belong to the selected customer |
| `discount` | Yes | Yes | Yes | Client input percentage, 0..100 |
| `total`, `grandTotal` | Yes | No | No | Persisted server-owned values needed by list/history |
| `notes` | Yes | Yes | Yes | Optional, trimmed, bounded length |
| line `id` | Yes | No | Optional existing child id | Server proves ownership on update |
| line car model/type/description/units/period/rate | Yes | Yes | Yes | Required FKs, ranges, two-decimal rate and bounded text; calculated aggregate must fit `decimal(18,2)` |
| line subtotal/tax/charges | Yes | No | No | Domain-calculated; 5% tax from RQ-E3 |
| approvals/rejection reason/action state | Approval state only | No | No | Server-owned lifecycle; reason enters only through typed rejection commands |

Update proves child-id ownership, removes omitted owned rows, updates existing rows and adds id-less rows. Empty lines are rejected. One `SaveChangesAsync` persists each tracked aggregate write, so EF Core implicit transaction ownership applies.

## Action-State Contract

| Source state `(Internal/Customer)` | Visible/server-permitted actions | Required input | Target state |
|---|---|---|---|
| `Pending/Pending` | Edit, Delete, Internally Approve, Internally Reject | Confirm approve/delete; typed 5..500 reason for reject | `Approved/Pending`, `Rejected/Pending`, or deleted |
| `Rejected/Pending` | Edit, Delete | Typed edit form | Successful edit resets to `Pending/Pending` and clears reason |
| `Approved/Pending` | Customer Approve, Customer Reject, Revise | Confirm approve/revise; typed 5..500 reason for reject | `Approved/Approved`, `Approved/Rejected`, or `Pending/Pending` |
| `Approved/Approved` | Unapprove | Warning confirmation; no linked RentalMasterAgreement | `Approved/Pending` |
| Other combinations | View and Print only | None | No transition |

Every transition is repeated at the backend boundary and performed only from its exact source state. Approval fields are EF concurrency tokens so a stale tracked Edit/Delete cannot overwrite a completed transition. Agreement-dependent Delete/Unapprove checks use a serializable cross-table boundary. `Revise` matches the current SalesQuotation reference by returning the existing document to Pending; it does not create a new R-numbered copy. Sales-only `GenerateDownPaymentReceipt` is deliberately not copied because RentalQuotation has no corresponding down-payment/receipt contract.

## Generic-Service Override Audit

| Method | Decision | Evidence |
|---|---|---|
| `AddAsync` | Override | Aggregate validation, normalization, server-owned approval defaults, line calculations and header totals are required before the single save. Repository add still owns tenant propagation and document-number generation. |
| `UpdateAsync` | Override | State lock, existing-child ownership, add/update/remove reconciliation and server recalculation are feature-specific. |
| `RemoveAsync` | Override | Deletion is state-dependent, blocked by a linked master agreement and must soft-delete the aggregate children. |
| `DetailAsync` | Inherited | No feature-specific scalar detail behavior is required. |
| `DetailWithNavigationsAsync` | Override | The editor consumes customer/branch/staff/contact names and active child lookup names. |
| `GetManyAsync` | Override | The list requires the frozen filters, stable paging/sorting projection and server-owned action flags. |
| `GetManyWithNavigationsAsync` | Inherited | No second list contract is used. |
| Controller CRUD actions | Inherited | The controller adds only the six explicit domain-transition routes; it does not duplicate generic CRUD endpoints. |

## Route, Provider and Runtime Contract

| Concern | Decision | Evidence |
|---|---|---|
| Lazy route | Existing `/RentalQuotation` lazy route remains the single entry point. | `src/app/pages/routing.ts` and `rentalquotation.routes.ts`. |
| Dialog ownership | The list owns create/view/edit/print dialog state. | Canonical list-owned editor pattern; no compatibility routes remain. |
| Service lifetime | Existing layout provider is retained; `providedIn: 'root'` remains compatible with current source. | `layout.module.ts` and the canonical provider/interceptor guidance. |
| Success feedback | Feature code does not duplicate mutation success toasts. | The application interceptor owns the single success message, uses the backend action message, and includes DELETE. |
| Failure feedback | RentalQuotation opts out of the interceptor dialog and owns inline recoverable list/editor errors plus action toasts for both result and transport failures. | Canonical single-owner loading/error contract; no duplicate logical-failure dialog. |
| Authorization | No permission API or invented permission guard is added. | Current application has authentication but no authorization mechanism. Backend state and tenant validation remain authoritative. |

## Unresolved Requirements Register

| Requirement | Status | Missing/conflicting source | Blocked behavior | Safe work continuing |
|---|---|---|---|---|
| Revision R0/R1 copy/number | Missing | No parent-revision relation, revision counter or numbering service contract | New revision record and number increment | Confirmed Revise state transition is implemented exactly like SalesQuotation. |
| Create Master Agreement | Conflicting | Screenshot asks for Date/PO/Payment Terms; entity has StartDate/EndDate/ApprovalStatus/CustomerId | Agreement creation hand-off | Unapprove is blocked when a current agreement already references the quotation. |
| Customer-scoped Contact lookup | Missing | Existing `Contact/GetSelect` exposes tenant contacts without customer ownership metadata or a customer filter | Preventing every incompatible contact selection before submit | Customer changes clear an existing contact; backend proves `Contact.CompanyId == CustomerId` on every write. |
| Default screenshot date range | Uncertain | Visible range includes rows outside it and no source default exists | Automatic initial filtering | Date range starts empty; user-selected bounds are exact. |
| Existing quotation Type data | Conflicting | Old property used a different enum whose numeric meanings do not match Daily/Weekly/Monthly | Safe schema/data transition | Owner must delete or explicitly convert old rows before applying a migration. |

## Migration Handoff

The owner must create and review a new RentalQuotation migration after cleaning or backfilling legacy rows. It must cover the approval/rejection fields and defaults, required header/child foreign keys, indexes, precision/length constraints and aggregate relationship. Existing Type values require an explicit delete/conversion decision before the new Daily/Weekly/Monthly contract is applied. The existing dirty snapshot and untracked `20260814172300_modifyRentalTarriffSettings*` files are unrelated Tariff work and were preserved; they must not be treated as the RentalQuotation migration.

## Final Reconciliation

| Gate | Status | Source evidence |
|---|---|---|
| Grid equals ListVM | Reconciled | Seven display properties match exactly; `Id` and eight `Can*` values are the minimum action state. |
| Filters/paging/sorting | Reconciled | Angular query keys and backend whitelist match the frozen filter contract. |
| Form equals write/detail contracts | Reconciled with documented base-class compatibility | Editable payload contains client fields only; totals and approvals are server-owned. Generic detail/update base members remain inherited but are not authored or trusted by this feature. |
| Aggregate persistence | Reconciled | Required relationships are non-null in EF; existing child ids are ownership-checked; omitted rows are removed; new rows inherit tenant; totals are range-checked; one save owns each aggregate write. |
| Action lifecycle | Reconciled for applicable Rental actions | UI uses server-projected flags; backend repeats exact source-state and dependency checks. Sales receipt is N/A; master-agreement creation and R-numbered copying remain explicitly unresolved. |
| Loading and errors | Reconciled | Both `isSuccess: false` and transport errors release loading and retain recoverable inline/global feedback. |
| Runtime ownership | Reconciled | The list owns the editor/rejection dialogs and the lazy route has one component owner. |
| Cross-cutting UI | Source reviewed | EN/AR, RTL, dark theme, responsive behavior, busy guards, dirty close, stale-request handling and print cleanup are present. Runtime verification remains owner-pending. |
| Generated packets | Drifted | All Phase 00–06 packets require regeneration and semantic review; canonical books were used directly. |
