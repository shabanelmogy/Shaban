# RentalQuotation backend access handoff

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

## Scope and authority

- Implemented the frozen backend slice from `RENTAL_QUOTATION_ACCESS_CONTRACT_FREEZE.md`.
- Read the mandatory Sigma workflow companion, the Sigma screen/API skill, the documentation root and review index, applicable canonical backend blocks 3–9 and 14, and the relevant Speed analysis entry and current Sigma owners.
- Speed remains the primary functional reference. No unresolved functional gap in this bounded backend slice required opening the complementary Odoo material.
- Superpowers process skills were available and used within Sigma's source-only boundary; they did not authorize build, test, lint, browser, database, migration, commit, push, or deployment execution.

## Implemented contract

- `RentalQuotation.Update`, `Delete`, `ManageApproval`, and `ManageCustomerApproval` now require `RentalQuotation.View` as a prerequisite for non-administrators.
- Creating `RentalMasterAgreement` from a quotation now requires both `RentalMasterAgreement.Create` and `RentalQuotation.View`. Standalone master-agreement creation retains its existing contract.
- The six quotation workflow actions remain represented by the existing `ManageApproval` and `ManageCustomerApproval` grants. No grant or permission key was added.
- `RentalQuotation.Activate` is nonassignable and returns HTTP 405 without entering the approval state machine.
- The quotation detail DTO now uses the numbered lean base, and item detail uses the lean base. The master-agreement quotation consumer was reconciled with the reduced DTO.
- Detail reference labels and child rows are limited to live records in the current tenant. Update, remove, and approval-readiness child ownership use the same live/current-tenant boundary.
- Both inherited detail endpoints now delegate to the same guarded detail projection. The inherited `GetAllWithNavigations` endpoint now returns the bounded `RentalQuotationListVM` projection rather than materializing an unsafe navigation graph.
- AutoMapper fallback mappings for quotation/customer/staff/contact/branch and item model/type labels now apply the same tenant/live guards for remaining direct consumers.
- List customer labels, their ordering, and generic Grid filtering all use the guarded live/current-tenant projection, preventing foreign or soft-deleted labels from influencing inclusion.
- Existing calculations, approval transitions, concurrency handling, transaction boundary, and branch ownership were preserved.

## Evidence and pending acceptance

- Added source-written authorization specifications in `RentalQuotationEndpointAccessTests.cs` and read/branch regressions in `RentalQuotationReadAccessTests.cs`; they were not executed.
- Confirmed from `PermissionAuthorizationFilter`, `BranchOperationRules`, `SiGmaDbContext.BranchAccess`, and `BranchScopeRegistry` that `RentalMasterAgreement.Create` selects transaction branch ids before the service reads its source quotation. No registry or general master-agreement scope change was needed.
- Reviewed the scoped backend diff and ran source checks for whitespace/conflict markers only. No build, tests, lint, browser, or database command was run under the standing boundary.
- No schema, migration, or model snapshot change was made. No migration is requested by this slice.
- Runtime/build/test acceptance remains pending with the authorized owner.
- `PermissionAuthorizationFilter.cs` and `PermissionEndpointResolver.cs` are shared, currently untracked files containing pre-existing peer work. Only the scoped RentalQuotation/RentalMasterAgreement additions belong to this handoff; the complete files must not be attributed to or reverted with this slice.

## Root integration note

The root added bilingual GeneralMessage resources for unsupported rental quotation activation and uses the localized key without changing generated resource designers. Source-only XML checks apply; no schema change.
