# Lookup Caching — Backend Inventory

| Status | Owner verification pending |
|---|---|
| Draft | yes |

## Scope and authority

This is a read-only, bounded inventory for the first lookup-caching planning step. It covers the backend sources directly supporting common Angular dropdowns, the current-branch selector, enum option endpoints, their tenant/availability predicates, and nearby create/update/delete/activation writers. It does not claim an application-wide cache inventory.

Applied authority: `SIGMA_FEATURE_REVIEW_MASTER.md` blocks 4, 5 and 8; `SIGMA_BACKEND_PATTERNS.md` blocks 10 (select/dropdowns) and 16 (settings); `sigma-screen-refactor/SKILL.md` operational digest. The owner reported the recipe `Generate-SigmaRecipes.ps1 -Check` green for all eight packets on 2026-10-23. No source, configuration, generated packet, migration, build, test, database command or runtime verification was performed.

## Lookup contracts and tenant scope

| Concern | Evidence | Contract finding |
|---|---|---|
| Shared response shape | `SigmaBackend/SiGma.Helpers/Dtos/DropdownDto.cs:3-8`, `SigmaBackend/SiGma.Business/Services/Bases/Service.cs:1289-1302` | Generic `GetSelect` returns `Results<DropdownDto>` with `Id`, `Value`, optional `No`; success includes empty `Entities` and paging metadata with zero totals. Preserve this wrapper and empty-success behavior. |
| Generic endpoint | `SigmaBackend/SiGma.ServerAPI/Controller/SiGmaControllerBase.cs:64-66` | Authenticated controllers expose `GET /<controller>/GetSelect`; the base calls virtual `SelectAsync`. `ApiPermissionCatalog.cs:105-118` maps `GetSelect` to `Lookup`. |
| Generic lookup query | `SigmaBackend/SiGma.Business/Services/Bases/Service.cs:1289-1291`; `SigmaBackend/SiGma.Repos/Repository/Repository.cs:568-585` | Base service delegates to repository `GetDropdownAsync<TEntity>`. Repository filters `SubscriptionId == _subscriptionId` and `IsDeleted != true`, applies optional stricter predicate and deterministic order, then materializes rows. |
| Label projection | `SigmaBackend/SiGma.Repos/Repository/Repository.cs:587-654` | Labels use explicit selectors where supplied, known entity-specific fields for a small set of types, otherwise `Name`, with `No` fallback. A cache must preserve the producer's exact label and ordering contract. |
| Tenant guard | `SigmaBackend/SiGma.Repos/Repository/Repository.cs:20-45, 658-660`; `SigmaBackend/SiGma.Helpers/EntityBases/EntityBase.cs:3-19` | Repository derives the subscription from authenticated claims and requires it before tenant queries. Lookup keys must include tenant identity (and any lookup-specific predicate/version inputs); never use client ids as ownership proof. |
| Auth boundary | `SigmaBackend/SiGma.ServerAPI/Controller/SiGmaControllerBase.cs:10-13`; `CurrentBranchController.cs:12-15` | Generic and current-branch controllers require authentication. The application has authentication but no feature authorization mechanism to invent. |

## Direct dropdown owners

`BranchService`, `CountryService`, `CurrencyService`, `UnitsOfMeasuresService`, and `CustomLookupService` inherit the generic `Service` lookup without a `SelectAsync` override:

- `SigmaBackend/SiGma.Business/Services/BranchService.cs:11-19`
- `SigmaBackend/SiGma.Business/Services/AdministrationsServices/CountryService.cs:6-15`
- `SigmaBackend/SiGma.Business/Services/AdministrationsServices/CurrencyService.cs:8-16`
- `SigmaBackend/SiGma.Business/Services/StocksServices/UnitsOfMeasuresService.cs:6-12`
- `SigmaBackend/SiGma.Business/Services/CustomLookupService.cs:6-12`

Their generic `GetSelect` therefore inherits the repository tenant and soft-delete predicates. `EntityBaseWithName` types also inherit nullable `IsActive` from `EntityBase`; the generic lookup does not automatically filter inactive rows. Backend block 10 requires an override or typed lookup when “selectable” is stricter than row existence. Whether each of these five domains should exclude inactive rows is a contract decision, not safe to infer for caching.

Specialized lookup producers found in the bounded scan include:

- `RentalAgreementService.SelectAsync` and `LeaseAgreementService.SelectAsync` (`SigmaBackend/SiGma.Business/Services/AgreementServices/RentalAgreementService.cs:56-66`; `LeaseAgreementService.cs:117-128`) with explicit predicates/selectors.
- `CustomerService.SelectAsync` (`SigmaBackend/SiGma.Business/Services/Customers/CustomerService.cs:128-152`).
- `AccountService.SelectAsync` (`SigmaBackend/SiGma.Business/Services/AccountServices/AccountService.cs:268-286`) and its in-memory statement-subgroup options (`AccountService.cs:220-240`).
- `FiscalYearService.SelectAsync` (`SigmaBackend/SiGma.Business/Services/FiscalYearService.cs:180-204`) and `LanguageService.SelectAsync` (`LanguageService.cs:152-160`).
- Typed endpoints such as `CostCenter/GetSelectByGroup`, `Contact/GetSelectByCompany`, and `ContactGroup/GetSelectByType` (`CostCenterController.cs:13-18`, `ContactController.cs:13-18`, `ContactGroupController.cs:14-18`) delegate to predicates in their services.

The enum-backed endpoint scan found `LinkAccounts/GetOptions` using `LinkAccountsEnumCatalog.GetOptions<TEnum>()` (`SigmaBackend/SiGma.Business/Services/AccountServices/LinkAccountsService.cs:153-163`; catalog `:44-55`), plus `AccountService.GetStatementSubGroupsAsync` above. These are process-local enum projections, with no tenant query in the inspected producer. Other compound `Options` endpoints were excluded from this first lookup inventory unless they directly return dropdown-like values.

## CurrentBranch options and settings boundary

`CurrentBranch` is a separate typed contract:

- `SigmaBackend/SiGma.ServerAPI/Controller/CurrentBranchController.cs:21-31` exposes `GET /CurrentBranch/Options`, `GET /CurrentBranch/Mine`, and `PUT /CurrentBranch/Mine`.
- `SigmaBackend/SiGma.Business/Services/CurrentBranchService.cs:34-55` queries `Branch` through the tenant-scoped repository, includes only `IsActive != false`, orders by `Name` then `Id`, and returns `Results<CurrentBranchOptionVM>` with `Id`, `Name`, `BranchCode`, and `BranchCode2`.
- `CurrentBranchService.cs:58-73` reads the latest user preference and treats deleted/deactivated branches as unselected; `:75-109` validates that the selected branch is active and tenant-owned before `IServiceHelper.UpsertByKeyAsync` by username and one `SaveChangesAsync`.

The settings rule in backend block 16 says settings are owned by `IServiceHelper` and explicitly says “Do not add caching for a settings review.” `SettingsCommonModelService` remains a legacy direct service (`SigmaBackend/SiGma.Business/Services/AdministrationsServices/SettingsCommonModelService.cs:22-76`) and is read by `TaxPolicyService` (`SigmaBackend/SiGma.Business/Resolver/TaxPolicyService.cs:31`), but it is outside the direct lookup cache owner and should not be cached as part of this inventory. `CurrentBranch` is a user preference workflow and requires user identity plus tenant in any future cache design.

## Writers and invalidation surface

The generic writer/action surface is inherited by the five direct dropdown owners:

- Add: `SigmaBackend/SiGma.Business/Services/Bases/Service.cs:38-60` maps, repository-adds and saves.
- Update: `Service.cs:95-126` loads tenant-scoped entity, validates, maps and saves (the broader child path follows).
- Delete: `Service.cs:908-926` finds the tenant-scoped entity, calls repository delete and saves; the five direct services override `RemoveAsync` to `RemoveWithChildrenAsync` where required (`BranchService.cs:28-29`, `CountryService.cs:21-22`, `CurrencyService.cs:117-118`, `UnitsOfMeasuresService.cs:18-19`, `CustomLookupService.cs:18-19`).
- Activation: `Service.cs:928-948` handles `POST handleActivate`, requires all ids to exist in the caller tenant, changes `IsActive`, and saves. `SiGmaControllerBase.cs:52-55` exposes the route.
- Currency has additional writer behavior: `CurrencyService.cs:26-67` performs a two-save base-currency add and `:71-114` updates base flags before one save. Any future invalidation must happen only after the complete successful write boundary.

`CurrentBranchService.SaveMineAsync` is a separate writer at `CurrentBranchService.cs:75-109`; its option set is invalidated by Branch add/update/delete/activation, while the selected preference is invalidated by the user's own save and by branch availability changes. The exact cross-request invalidation mechanism is an unresolved design decision.

## Existing cache owners and registration scan

A narrow source search over `SiGma.Business`, `SiGma.ServerAPI`, `SiGma.Repos`, and `SiGma.Helpers` for `IMemoryCache`, `IDistributedCache`, `HybridCache`, Redis registrations, `AddMemoryCache`, `AddDistributedMemoryCache`, `AddStackExchangeRedis`, `MemoryCache`, and `Redis` found no cache owner or registration in those lookup-related paths. `SigmaBackend/SiGma.ServerAPI/Extensions/DependencyResolver.cs:28-187` registers localization, HTTP clients, EF/unit-of-work, scanned business services, and `IServiceHelper`; it contains no cache registration. This is scoped evidence only and does not establish app-wide absence.

## Recommended first low-risk source and open decisions

The lowest-risk first source is the generic repository lookup seam, `IRepository.GetDropdownAsync<T>` / `Repository.GetDropdownAsync<T>` (`SigmaBackend/SiGma.Repos/IRepository/IRepository.cs:68`; implementation `Repository.cs:568-655`), because it is already the common producer for inherited `GetSelect` endpoints. A later implementation should first define a tenant-aware key and an explicit eligibility/version input, preserve `Results<DropdownDto>` and empty-success semantics, and publish invalidation only after successful writes. Specialized `SelectAsync` overrides and typed option endpoints must remain opt-in until their predicates and contracts are separately classified.

The following decisions remain Uncertain and block implementation design: whether inactive rows are selectable for each direct entity; whether all specialized and compound options are in scope; whether `CurrentBranch` options and per-user preference should share a cache owner; the invalidation mechanism and its transaction/error semantics; and whether any external cache infrastructure exists outside the scanned projects. These decisions require owner direction or a later bounded contract-freeze review.

## Verification limits

No build, test, database command, migration, browser/runtime check, or source edit outside this artifact was performed. This document is a Draft handoff with owner verification pending.
