# Rental Master Agreement backend authorization handoff

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-11-10 |
| Scope | RentalMasterAgreement backend permission adoption, guarded reads/writes, lean DTOs, and bounded source specifications |
| Frozen input | `reviews/Authorization/RENTAL_MASTER_AGREEMENT_ACCESS_CONTRACT_FREEZE.md` |

## Implemented permission keys

| Endpoint/operation | Required grants | Branch access mode | Source disposition |
|---|---|---|---|
| List, generic detail/navigation reads, all-with-navigation, and `GET /RentalMasterAgreement/{id}/view` | `RentalMasterAgreement.View` | read | `GetView` is explicitly classified as `View`; it no longer publishes a separate `RentalMasterAgreement.GetView` grant. |
| Create | `RentalMasterAgreement.Create` + `RentalQuotation.View` | transaction | Does **not** require `RentalMasterAgreement.View`. The quotation prerequisite is unconditional at authorization, while the service still rejects a missing quotation. |
| Update | `RentalMasterAgreement.Update` + `RentalMasterAgreement.View` | transaction | Existing generic update key retained; View prerequisite added. |
| Delete | `RentalMasterAgreement.Delete` + `RentalMasterAgreement.View` | transaction | Existing generic delete key retained; View prerequisite added. |
| Approve | `RentalMasterAgreement.ManageApproval` + `RentalMasterAgreement.View` | transaction | Existing document-approval resolver owns `ManageApproval`; no feature-local approval key was created. |
| Activate/deactivate | nonassignable `RentalMasterAgreement.Unreviewed.Activate`; service returns HTTP 405 | transaction if reached by administrator | `RentalMasterAgreement` added to the unsupported-activation resolver set and the service rejects the inherited operation without mutation. |
| Generic select | existing `RentalMasterAgreement.Lookup` | read | Not changed: it is not the list/detail/export contract frozen for the MasterAgreement screen and remains a compatibility lookup for separately owned RentalAgreement flows. |
| Linked RentalAgreement Create/Update (`RentalMasterAgreementId` supplied) | existing `RentalAgreement.Create` or `RentalAgreement.Update` + `RentalMasterAgreement.View` | transaction | The extra View prerequisite is request-shape-specific, covers single and typed enumerable payloads, and leaves unlinked writes unchanged. |

`RentalMasterAgreement.View` deliberately owns the saved quotation aggregate returned by `GetView`; `RentalQuotation.View` is not a prerequisite for viewing the master agreement.

Current source exposes only single Add/Update routes on `RentalAgreementController`; its service also has AddList/UpdateList overrides but no current controller route for them. The authorization predicate still inspects typed enumerable Add/Update payloads when an endpoint is classified as `RentalAgreement.Create` or `RentalAgreement.Update`, so a future reviewed batch route cannot omit the linked-master prerequisite by payload shape.

## Files changed

### Backend repository

- `SiGma.Business/Services/RentalMasterAgreementService.cs`
  - rejects activation with 405;
  - projects both generic detail routes through one finite lean query;
  - keeps list filters/count/page/order in SQL and guards relationship labels with tenant/live predicates;
  - uses guarded repository queries for the saved quotation and quotation children;
  - clears `QuotationId` from `GetView` when the scoped quotation lookup is inaccessible, so a hidden source identity is not published without its source;
  - validates a live tenant-owned customer in Add, Update, and Approve;
  - blocks deletion when any live same-tenant RentalAgreement child exists, including a child hidden by its vehicle branch filter;
  - keeps Update quotation uniqueness validation and save in a serializable boundary;
  - preserves the pre-existing peer change that removed generic tenant/audit metadata from the quotation nested in `GetView`.
- `SiGma.Business/MapperConfig/RentalMasterAgreementProfiler.cs`
  - removes obsolete Update ignores now that Update carries neither `No` nor `SubscriptionId`;
  - maps lean detail/list labels only from same-tenant live relationships;
  - maps generic detail `QuotationId` only through the same scoped quotation navigation, making it null for branch-hidden, foreign, or deleted sources.
- `SiGma.ServerAPI/Controller/RentalMasterAgreementController.cs`
  - classifies `GetViewAsync` as the shared `View` action.
- `SiGma.ServerAPI/Authorization/PermissionEndpointResolver.cs`
  - marks inherited RentalMasterAgreement activation nonassignable.
- `SiGma.ServerAPI/Authorization/PermissionAuthorizationFilter.cs`
  - requires RentalQuotation View for every RentalMasterAgreement Create request;
  - adds Master View prerequisites for Update, Delete, and ManageApproval;
  - requires Master View when a single or typed enumerable RentalAgreement Create/Update body supplies any `RentalMasterAgreementId`, without changing unlinked writes.
- `SiGma.Business/Services/AgreementServices/RentalAgreementService.cs`
  - validates a supplied master link against the current tenant/live/active master;
  - requires that master to be approved and its customer to match the RentalAgreement request.
- `SiGma.ServerAPI/Authorization/ReviewedPermissionOperations.cs`
  - removes the obsolete custom `RentalMasterAgreement.GetView` operation.
- `SiGma.ViewModels/ViewModels/RentalMasterAgreement/RentalMasterAgreementDetailVM.cs`
  - adopts `NumberedDetailBaseVm` and only the consumed scalar/detail labels.
- `SiGma.ViewModels/ViewModels/RentalMasterAgreement/RentalMasterAgreementListVM.cs`
  - adopts `NumberedDetailBaseVm`; exact server list fields remain `id`, `no`, `date`, `approvalStatus`, `customerName`, `customerCode`, `quotationNo`.
- `tests/SiGma.BranchAccess.Tests/RentalMasterAgreementAccessContractTests.cs`
- `tests/SiGma.BranchAccess.Tests/RentalMasterAgreementEndpointAccessTests.cs`
- `tests/SiGma.BranchAccess.Tests/RentalMasterAgreementReadAccessTests.cs`
  - adds source-written cases for a live same-tenant RentalAgreement child hidden by vehicle branch scope and for suppressing hidden/foreign/deleted quotation identifiers.
- `tests/SiGma.BranchAccess.Tests/RentalAgreementMasterLinkContractTests.cs`
  - source-written authorization and service cases for linked/unlinked write prerequisites, tenant/live/active master validation, approval, and customer match.

`IRentalMasterAgreementService.cs` required no signature change. `BranchOperationRules.cs` required no feature entry because `GetView` now resolves directly to `View`, which is already a shared read classification. The bounded RentalAgreement edit is limited to validating the supplied master link; no other RentalAgreement behavior was changed.

## DTO, mapping, and domain decisions

- Grid fields and ListVM match exactly: `id`, `no`, `date`, `approvalStatus`, `customerName`, `customerCode`, `quotationNo`. The client-only derived `masterAgreementNo` remains outside the server DTO.
- Add/Update remain client-input contracts for dates, quotation/customer selection, and notes. Tenant, number, audit, delete, activation, and approval state remain server-owned.
- The active MasterAgreement detail route continues to use `RentalMasterAgreementViewVM`, with nested lean customer and saved quotation/items. The generic inherited detail routes no longer return recursive Partner/Quotation/RentalAgreement graphs.
- AutoMapper remains explicit one-way mapping. No `ReverseMap` or compatibility `Ignore` chain was added.
- No calculation, tax, total, financial, approval-policy, entity, EF configuration, or schema contract changed.
- RentalAgreement Add/Update contracts and the entity persist `RentalMasterAgreementId` only. They do not carry or persist a `RentalQuotationItemId`; no quotation-item reservation, schema field, or inferred source row was added.

## Tenant, live-row, and branch evidence

- Root master reads/writes use `UnitOfWork.Repository.Query/FindByIdAsync`, retaining authenticated subscription and live-row filters.
- RentalMasterAgreement headers remain tenant-shared because they are not registered as branch-scoped owners. Their nested/saved RentalQuotation remains branch-filtered.
- The raw quotation foreign key is part of the restricted source identity, not tenant-shared master metadata. `GetView` and generic detail return it only when the linked quotation is visible through current tenant/live/branch scope; header id/number/dates/customer remain shared.
- Customer labels and validation use repository-scoped Partner queries, so foreign/deleted customers do not publish or validate.
- RentalQuotation is registered as a direct `BranchId` owner in `BranchScopeRegistry`; RentalQuotationItem uses the parent quotation branch path. Authorization classifies Master View reads as read scope and Create/Update/Delete/ManageApproval as transaction scope, so the same `BranchAccessContext` snapshot selects readable versus transactable quotation branches.
- `GetView` first proves the saved quotation is readable before loading its items. Child queries retain tenant/live/branch query filters, deterministic item ordering, and tenant/live model/type name queries.
- List quotation filter/sort/projection does not expose a foreign/deleted relationship label. Branch visibility remains owned by the current RentalQuotation global query filter rather than a duplicate feature-local branch predicate.
- RentalAgreement inherits the branch-scoped Agreement filter through its Vehicle. The master deletion blocker therefore deliberately bypasses global filters for a boolean structural check, then explicitly constrains `SubscriptionId`, `IsDeleted != true`, and `RentalMasterAgreementId`; it does not expose child contents.
- The analogous `LeaseMasterAgreementService.RemoveAsync` child-existence pattern may miss a hidden LeaseAgreement child. It was recorded for the shared owner and not changed in this Rental slice.

## Loading, cache, query, and performance notes

- This backend slice adds no cache and no invalidation owner. Master and quotation data are operational reads and remain fresh per request.
- Paged list source shape is bounded: filtered `CountAsync` plus one no-tracking paged projection, stable secondary order by `Id`, and no per-row materialization loop.
- `GetView` is a finite aggregate read: header/customer projection, optional quotation projection, then optional ordered item projection. Scalar names are composed into those queries; there is no source-level per-item database loop.
- Existing schema evidence declares FK indexes for `CustomerId` and `QuotationId`. No source-backed measured bottleneck or SQL plan was available, and the date/text/status/sort combinations do not justify an additional index by inspection alone. A possible tenant/date candidate must be evaluated only after owner SQL-plan/cardinality evidence, including the nullable `IsDeleted != true` semantics and overlap with deployed indexes. No index or EF configuration was changed.
- Runtime network timing, SQL command count/translation, execution plan, cold/warm measurements, and database cardinality remain owner acceptance.

## Source verification and limits

- Recipe drift check: all eight generated packets reported `OK` before use.
- Reviewed the scoped backend Git diff separately under `F:\My Work\Sigma\SigmaBackend`.
- `git diff --check` returned no whitespace errors for the scoped tracked files.
- Scoped merge-marker search returned none.
- Namespace/project inclusion was inspected for `NumberedDetailBaseVm`, `ActiveVm`, controller authorization metadata, Business/ViewModels/ServerAPI references, and default SDK inclusion of the new test files.
- Direct consumer search confirmed the only other `RentalMasterAgreementDetailVM` property is ignored by the existing RentalAgreement mapper. The separately authorized RentalAgreement edit is confined to the linked-master validation block.
- The hidden-child deletion and linked-single-write specifications were written before their production changes; typed-enumerable authorization cases were added during scoped review. None were run, so RED/GREEN, compilation, runtime, database, HTTP, and branch-filter translation are not claimed.
- The hidden-source-identifier specification was written before its production mapping/read changes. It was not run under the source-only boundary.
- No build, tests, typecheck, database command, migration, snapshot edit, browser run, commit, push, or deployment command was executed.

## Remaining owner acceptance

1. Build the backend and run the bounded BranchAccess tests, including the three RentalMasterAgreement files and `RentalAgreementMasterLinkContractTests.cs`.
2. Verify permission catalogue output contains View/Create/Update/Delete/Lookup/ManageApproval and a nonassignable activation candidate, with no assignable `GetView` key.
3. Replay ordinary-user requests for each prerequisite combination and confirm administrator activation returns 405 without changing `IsActive`.
4. Verify list/detail/view behavior with foreign/deleted tenants and readable-versus-transactable quotation branches on the relational provider.
5. Verify a hidden-branch RentalAgreement child blocks master deletion without publishing the child, and replay linked/unlinked RentalAgreement writes with and without Master View.
6. Verify hidden-branch, foreign-tenant, and deleted linked quotations produce null `QuotationId`, `QuotationNo`, and nested quotation while leaving the tenant-shared master header readable.
7. Measure the paged list and `GetView` SQL/timing before considering any index proposal.

No `Add-Migration` is required. Suggested backend commit message:

`feat(rental-master-agreement): enforce frozen access contract`

The frontend/in-app guide handoff remains with the root/frontend owners; this backend-only slice changed no user-guide source.
