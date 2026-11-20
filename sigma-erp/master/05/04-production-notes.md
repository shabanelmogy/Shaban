<!-- Part of Master block 5: see ../05-continuous-quality-gates.md. Same status and authority as the block. -->

### Production notes (owner request, 2026-10-02)

This section records deferred preparation for production. A configuration concern
is not a demonstrated runtime defect: state the evidence, affected scope and
remaining verification. Do not turn a recommendation into a release blocker
without a confirmed failure or an explicit owner decision. Adding a note does
not authorize source changes, builds, tests, restore, database commands or deployment.
Existing execution permissions still apply.

| ID | Note | Proposed preparation before production | Current status and evidence |
|---|---|---|---|
| PROD-01 | Broad compiler warning suppression | Review project-wide `NoWarn`, especially CS8618, CS8602, CS8603, CS8629 and CS4014. When this work is authorized, expose diagnostics and fix actual cases according to their required/optional contract, null checks and awaited operations. Keep justified exceptions local; do not make every property nullable, add `!` or invent defaults just to silence a warning. Treating all warnings as errors is a separate choice. | Deferred recommendation. Confirmed in `SiGma.Repos/SiGma.Repos.csproj:10`. No concrete unprotected null failure was established in the inspected Repos examples; the paging `.Value` use already has a null guard. The initial high-priority assessment was reduced after source follow-up. |
| PROD-02 | Analyzers disabled during build and live editing | Consider enabling `RunAnalyzersDuringBuild` for the production build path. Live analysis may stay disabled if editor performance requires it. Review actual diagnostics and measure build cost before choosing the final configuration. | Deferred recommendation. Both properties are false in `SiGma.Repos/SiGma.Repos.csproj:8–9`; no analyzer violation or performance measurement has been established. Compiler error detection remains active. |
| PROD-03 | HTTP reference alignment with the target framework | Consider replacing `Microsoft.AspNetCore.Http.Abstractions 2.3.11` with a `FrameworkReference` to `Microsoft.AspNetCore.App` for the net10.0 library. Coordinate Repos and Helpers, since Helpers carries the same package transitively. Verify consuming applications and shared-framework deployment requirements before accepting the change; do not remove required HTTP APIs without a replacement. | Deferred recommendation. Package references confirmed in `SiGma.Repos/SiGma.Repos.csproj:14` and `SiGma.Helpers/SiGma.Helpers.csproj:14`. Repos uses IHttpContextAccessor and StatusCodes. No current compatibility failure or vulnerability was established; the package version number alone proves neither. |
| PROD-04 | Duplicate warning ID in NoWarn | Remove one duplicate CS8669 entry when the Repos project file is next edited. Retain the other entry until the separate suppression-policy review decides whether it is needed. | Deferred low-priority cleanup. CS8669 appears twice in `SiGma.Repos/SiGma.Repos.csproj:10`. Duplication does not change suppression behavior or establish a runtime/build failure; no urgent change or release blocker. |

For PROD-03, the framework-reference option follows Microsoft's
[ASP.NET Core APIs in a class library guidance](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/target-aspnetcore?view=aspnetcore-10.0).
The initial evidence is recorded in `reviews/Archive/Completed/2026-10-23/REPOS_PROJECT_FEATURE_REVIEW.md`.
These notes concern the inspected Repos configuration; other projects need their
own source evidence before applying the same finding. Record later notes here
with a stable ID, source location, proposed action and status. After authorized
work, update its status and link the verification evidence; source inspection
alone never establishes production readiness. Backend API validation remains
necessary even when the frontend already checks required fields.
