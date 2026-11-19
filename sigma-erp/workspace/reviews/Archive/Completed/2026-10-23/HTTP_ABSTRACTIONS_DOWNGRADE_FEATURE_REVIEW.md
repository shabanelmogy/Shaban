| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# HTTP abstractions dependency downgrade — 2026-10-22

## Scope and decision

Fix the reported NU1605 in `SigmaBackend/SiGma.Repos/SiGma.Repos.csproj` by raising its direct `Microsoft.AspNetCore.Http.Abstractions` reference from 2.3.11 to 2.3.13. Source confirms Helpers and DataAccess already require 2.3.13; Repos references Helpers but explicitly selects the older version. Keep the existing package-based architecture and warning/error policy.

Preserve the pre-existing Helpers changes (Http.Abstractions 2.3.13 and Extensions.Http 10.0.13). Repos was listed as modified at entry, but its scoped Git diff was empty; make only the explicitly scoped edits. Remove the second duplicate CS8669 entry as required by Master 5 PROD-04 when this project is next edited; retain one suppression. PROD-03's broader framework-reference migration remains deferred.

## Conformance and applicability

| Concern | Canonical owner | Source evidence and final target |
|---|---|---|
| Proportional compatibility fix | Master 5 | Repos package reference matches Helpers/DataAccess at 2.3.13 |
| Conditional duplicate cleanup | Master 5 PROD-04 | Repos NoWarn retains exactly one CS8669 |
| Source-only reconciliation | Master 7; phase-06-final-reconciliation | Complete scoped Git diff and whitespace check; restore/build pending owner |
| Packet governance | Master 8 | Recipe -Check passed for all eight packets; no refresh needed |

Discovery, decision freeze and scoped reconciliation apply. Domain/API, grid, detail, action and runtime-wiring phases are not applicable to this dependency-only correction. Backend CRUD/UI shapes and screen-refactor skill are not applicable. No screenshots, frontend, user-guide, DTO/API, mapping, calculation or schema changes; no migration required. No shared code extraction qualifies. No subagents: one small sequential fix.

## Final reconciliation

Implemented the frozen edits and reviewed the complete scoped diff in the SigmaBackend repository: only the Repos version alignment and duplicate-warning cleanup were added. Confirmed Helpers' pre-existing changes remain untouched. Both project files parse as XML and their Http.Abstractions references match at 2.3.13. The scoped whitespace check passed, and no merge markers were found. No unresolved source-contract decisions remain.

No restore, build, tests, lint, migrations, database/browser/runtime commands, commits, pushes or deployment were run. The phase-06 source-only reconciliation checks apply; owner verification remains pending.

Owner verification: restore `SiGma.ServerAPI/SiGma.ServerAPI.csproj`, confirm the Http.Abstractions NU1605 is absent and rerun the original failing operation. Package resolution and runtime behavior are not proven by source inspection.

Suggested backend commit, covering only this task's Repos edits: `fix(deps): align http abstractions version in repos`
