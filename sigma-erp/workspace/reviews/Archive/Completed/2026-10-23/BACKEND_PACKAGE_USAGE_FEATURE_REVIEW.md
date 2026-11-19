| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Backend package usage review — 2026-10-22

## Scope and evidence contract

Source-read-only review of the main ServerAPI dependency graph: ServerAPI, Business, DataAccess, Repos, Helpers and ViewModels. The backend project-reference inventory establishes this boundary; Security, SubscriptionAPI and CustomerMVC package usage is not audited here. No application source, project configuration, migration or snapshot was changed. User changes in PurchaseOrderService and PurchaseRequestService were preserved.

This is dependency configuration analysis; no CRUD/UI shape, screen skill/reference, screenshot, domain/API, list, editor, action, user-guide, mapping, calculation or schema change applies. Master 4/5/7 govern evidence, proportional recommendations and source-only reconciliation. Master 5 PROD-03 already records the optional move from legacy HTTP packages to the shared framework; it is not a new defect or an authorized implementation. Backend 19 backlog was checked. All eight recipe packets passed -Check, with no drift/refresh. Use only the applicable source/compatibility comparisons from phase-06-final-reconciliation; no feature implementation phases are started.

Searches target the named package APIs, configuration and registrations in the six projects, excluding generated bin/obj C# and migration contents. Existing obj/project.assets.json files provide supporting dependency edges only: no restore was run and freshness/resolution is not guaranteed. Absence of source usage is evidence for a removal candidate, not a build/runtime proof.

## Candidates to remove after owner-authorized implementation

| Package | Project/reference | Evidence | Recommendation |
|---|---|---|---|
| FluentAssertions 8.11.0 | ServerAPI csproj:35 | No FluentAssertions namespace or Should assertion usage in ServerAPI; no test source found by bounded API audit | High-confidence source candidate: remove production reference |
| Microsoft.EntityFrameworkCore.Proxies 10.0.13 | DataAccess csproj:22 | No UseLazyLoadingProxies, UseChangeTrackingProxies, CreateProxy, ILazyLoader or proxy options in the main graph. Context OnConfiguring and API AddDbContext use SQL Server without enabling proxies | High-confidence source candidate: remove reference; verify behavior after restore/build |
| Microsoft.AspNetCore.Http.Features 5.0.17 | ViewModels csproj:14 | No Http/Features namespaces, IFormFile/FormFile, IFormCollection or feature collection/interface APIs in ViewModels C# | Remove the unused direct reference. Helpers still brings Http.Features transitively, so this does not remove all HTTP packages from the graph |

EF proxies require explicit enabling for lazy loading, as documented by [Microsoft](https://learn.microsoft.com/en-us/ef/core/querying/related-data/lazy). This supports the source finding; virtual navigation properties alone do not prove enabled proxies.

## Redundant direct declarations, with the dependency still retained

| Direct reference | Evidence | Meaning of removal |
|---|---|---|
| ServerAPI: Swashbuckle.AspNetCore.Swagger 8.1.1 (csproj:45) | Swashbuckle.AspNetCore 8.1.1 at csproj:43 already requests Swagger 8.1.1 in existing assets and the official package metadata | Remove only the duplicate declaration; Swagger middleware remains installed and used |
| DataAccess: Microsoft.EntityFrameworkCore.Abstractions 10.0.13 (csproj:16) | Core 10.0.13 already requests Abstractions 10.0.13 in existing assets | Optional project-file simplification; not removal of an unused runtime library |
| DataAccess: Microsoft.EntityFrameworkCore.Relational 10.0.13 (csproj:23) | SqlServer 10.0.13 already requests Relational 10.0.13 in existing assets | Optional project-file simplification; relational APIs are actively needed |

The [official Swashbuckle package dependencies](https://www.nuget.org/packages/Swashbuckle.AspNetCore/8.1.1) and [SQL Server provider metadata](https://www.nuget.org/packages/Microsoft.EntityFrameworkCore.SqlServer/10.0.13) support these edges. Explicit references to directly used APIs may reasonably remain for dependency clarity. Do not count deleted declarations as eliminated packages or claim measured size/performance gains.

## Conditional cleanup requiring coordinated code changes

| Candidate | Current dependency | Required decision/change |
|---|---|---|
| Swashbuckle.AspNetCore.Filters | ServerAPI Examples/DetailedStockReportRequestExample.cs:1,6 imports Filters and implements IExamplesProvider. No ExampleFilters/AddSwaggerExamples registration, request-example attribute or consumer of the example class was found | Removing the package alone breaks compilation. Remove/replace the unused example together, or wire it if the example is wanted |
| Microsoft.AspNetCore.OpenApi | ServerAPI Program.cs:72 calls AddOpenApi. No MapOpenApi route or other OpenAPI package API usage found; Swagger document/UI paths are registered separately | Possible cleanup of unused built-in generator registration together with the package; retain as-is until that coordinated cleanup is authorized. Not an unused-reference-only deletion |
| Microsoft.EntityFrameworkCore.Design in Business | No design API/factory implementation in non-generated source; package is PrivateAssets=all | Candidate only after confirming EF target/startup project workflow. Keep Design in the intended tooling projects; duplicate declarations across projects are not automatically redundant because private assets do not flow |
| Old ASP.NET HTTP package family | Helpers ApiHelper.cs and ApiSecurityHelper.cs use IHttpClientFactory/IHttpContextAccessor; Repos Repository/UnitOfWork and DataAccess context/audit code use HttpContext access | Used APIs, not unused packages. Any migration to FrameworkReference Microsoft.AspNetCore.App must coordinate library references and consuming hosts; this is the existing deferred PROD-03 recommendation |

[Microsoft's shared-framework guidance](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/target-aspnetcore?view=aspnetcore-10.0) describes FrameworkReference for class libraries. [EF tooling guidance](https://learn.microsoft.com/en-us/ef/core/cli/dotnet) distinguishes target/startup projects and requires Design for tooling; source namespace search alone is insufficient to delete tooling packages.

## Packages to retain

- Scrutor: ServerAPI Extensions/DependencyResolver.cs:170 uses services.Scan to register business services.
- Swashbuckle.AspNetCore umbrella: Program.cs:43,102,107 configures/serves Swagger and its UI.
- Ardalis.Specification and its EntityFrameworkCore adapter: PurchaseOrderSearchSpec derives Specification; PurchaseOrderService.cs:392 calls WithSpecification. AutoMapper and localization APIs are also used by service constructors/mappings.
- SQL Server provider and EF runtime: active DbContext/provider and repository queries depend on them.
- Helpers Microsoft.Extensions.Http: ApiHelper/ApiSecurityHelper use IHttpClientFactory; API DependencyResolver registers HTTP clients.
- DataAccess System.Security.Cryptography.Pkcs 10.0.13: intentionally pins a patched version. Current existing assets show SqlClient 6.1.7 requests Pkcs 9.0.11; removing the direct pin could lower the selected version. The prior task's security finding remains relevant; no claim that lack of a direct C# call makes this unused.
- EF Tools/Design in DataAccess and Design in ServerAPI: preserve migration tooling, particularly the owner's Package Manager Console workflow. Analyzer packages are not classified unused just because no namespace is referenced or build analyzers are disabled.

## Final reconciliation and handoff

Root re-read the API example, services.Scan registration, startup, shared project references and package dependency edges. Full scoped Git diff of the audited project/configuration/API files was empty; the review created only this unversioned artifact. No source fixes were applied, so no migration or source commit is required. No screen guide change or reusable extraction applies.

Owner verification remains yes: an authorized removal pass must restore/build the main API graph and confirm Swagger, service registration, DB behavior and the existing migration-tool workflow. Current review deliberately ran no restore/build/tests/lint/runtime/browser/database/migrations/commits/pushes/deployment commands. No compilation or runtime success is claimed, and no exact output-size savings were measured.

Agent utilization: root owned scope, dependency inventory, library audit and reconciliation. One gpt-5.6-luna explorer performed a bounded read-only ServerAPI package audit; no file ownership overlap or agent edits. Delegation allowed API and library usage checks to proceed concurrently at lower discovery cost. Root validated and integrated the findings.

## Authorized removal addendum — 2026-10-22

The owner subsequently instructed: "احذفهم". This authorizes the six candidates presented in the chat, including their necessary coordinated cleanup; the original read-only review above is retained as historical evidence.

Frozen implementation scope before edits:

- ServerAPI: remove FluentAssertions, explicit Swashbuckle.AspNetCore.Swagger, Swashbuckle.AspNetCore.Filters and Microsoft.AspNetCore.OpenApi references. Delete the unregistered DetailedStockReportRequestExample class and remove the sole AddOpenApi registration. Retain Swashbuckle.AspNetCore, its active Swagger configuration/UI, Scrutor and EF Design.
- DataAccess: remove only Microsoft.EntityFrameworkCore.Proxies. Preserve the patched PKCS reference, EF runtime/provider and migration tooling.
- ViewModels: remove the unused Http.Features reference and its now-empty ItemGroup. Helpers' HTTP dependencies remain.
- Do not implement the review's separate optional EF reference simplification, Business Design cleanup or shared-framework migration.

Entry Git status is clean. Repeated targeted source searches still find only the AddOpenApi registration and the example class for the conditional removals; no newly introduced uses of the other removal candidates were found. All recipe packets pass -Check. This is dependency/registration cleanup, not a screen change; no screen guide or schema migration is required. No shared extraction qualifies. Root performs this small, tightly related edit locally without new subagents.

Implemented the frozen removal scope. The complete scoped diff was reviewed: four package references removed from ServerAPI, one from DataAccess, one from ViewModels, the now-empty ViewModels ItemGroup removed, the unregistered example file deleted, and the sole AddOpenApi registration removed. No other application edits were made.

Final source reconciliation: all three modified project files parse as XML; scoped git diff --check passes; repeated targeted searches find no stale C# references to the removed functionality. Swashbuckle's active AddSwaggerGen/UseSwagger/UseSwaggerUI configuration remains, with its umbrella dependency supplying Swagger transitively. Scrutor registration, the patched PKCS pin, and EF Design/Tools remain. No API/DTO, mapping, calculation, schema, translation or screen-guide change occurred. No migration is required. Optional cleanup outside the frozen six-reference scope remains deferred.

Applied discovery/freeze and dependency cleanup, the narrow registration compatibility checks of phase-05-integration-runtime, and source-only phase-06-final-reconciliation. UI route/provider/interceptor and domain/write/action concerns are not applicable. No new general screen rule or canonical-book change was established, so packet regeneration is unnecessary.

Owner verification pending: restore the main ServerAPI project so old assets are refreshed, then build and verify Swagger, service registration, database behavior and migration tooling. No restore, build, tests, lint, runtime/browser/database commands, migrations, commits, pushes or deployment were run. Source conformance does not prove compilation/runtime success or package-size savings.

Suggested backend commit, covering only the five application files listed in this addendum: `chore(deps): remove unused backend package references`
