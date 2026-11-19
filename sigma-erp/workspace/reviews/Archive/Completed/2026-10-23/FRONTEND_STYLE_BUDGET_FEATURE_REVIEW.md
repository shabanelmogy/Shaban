# Frontend production component-style budget

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-13 |

Owner supplied production build failures while updating an already deployed
SmartASP.NET frontend. Every supplied failure names anyComponentStyle's4KB
maximum. Largest reported emitted component stylesheet: shared DataTable16.44KB.
This establishes the configuration failure, not successful compilation or an
explanation of every stylesheet's size. No screenshot or business/API change.

Frozen bounded correction: angular.json production anyComponentStyle warning
2→10KB, error4→20KB. Twenty KB accommodates all supplied failures with bounded
headroom;10KB retains warnings on larger components. Initial bundle thresholds
2MB/5MB, builder, optimization behavior, hashing, environment replacement, output
path and every stylesheet remain unchanged. This adjusts the enforcement policy;
it does not shrink CSS or certify build success/performance.

Conformance: actual projects.sigma.architect.build.configurations.production
budgets object is the shared producer; Angular browser builder/schema owns the
anyComponentStyle/maximumWarning/maximumError fields. UI1 wiring and UI29 source
verification govern the change. Existing config had no prior scoped Git diff;
only two string values changed. No new routing, UI shell or screen user-guide
topic: this is build configuration only. JSON parsing/builder-schema comparison
and scoped diff/whitespace review apply; build/test/lint/browser/deployment are
not run. Backend/maps/domain/schema/migration N/A. Root works alone on this small
sequential correction; no subagent gate. Phases discovery/freeze/configuration/
reconciliation apply; CRUD/grid/domain phases N/A.

Owner verification: rerun npm run build-prod -- --base-href / from frontend.
The supplied budget errors should be resolved; warnings above10KB remain allowed.
Investigate any additional compiler/budget failures separately. After a successful
build, copy existing web.config into dist/sigma and upload the current artifact
through the established hosting workflow. No publish/build operation was executed.
Suggested frontend commit: fix(build): align component style budgets with current UI.

Source: https://angular.dev/reference/configs/workspace-config#extra-build-and-test-options

Final evidence: JSON parses; installed Angular17 browser builder schema confirms
anyComponentStyle and string maximumWarning/maximumError. Exact values10KB/20KB
and initial2MB/5MB verified. Complete scoped Git diff contains only those two
values and whitespace check passes. UI29/skill/CHANGELOG record the reusable
budget/source-claim distinction; all eight regenerated recipe drift checks pass
after semantic comparison to that policy. No production build was executed.

## Subsequent initial bundle amendment — 2026-10-13

Owner supplied another production failure: initial total5.22MB exceeds the5MB
error threshold by221.39KB. This supersedes the initial-budget preservation
decision above: frozen bounded change is initial maximumError5→6MB only.
Initial maximumWarning2MB, component10/20KB, builder and optimization stay intact.
The initial budget measures bootstrapping JavaScript/CSS; this policy adjustment
does not reduce download size or prove build success. No backend, API, UI-guide,
migration, or deployment change. Same small sequential scope and phase exceptions.
Reference/owner: installed Angular browser budget schema and production budgets
object; UI29 governs source-only claims. UI29/skill/CHANGELOG now describe the
current2MB/6MB initial policy; historical rows above retain their earlier decision.
Owner reruns the same production build command; warning2MB remains allowed.
Suggested frontend commit: fix(build): align production size budgets.
Source: https://angular.dev/tools/cli/build#configure-size-budgets

Amendment verification: JSON and installed builder schema pass; exact initial
2MB/6MB and component10KB/20KB confirmed. Full scoped angular.json diff contains
only three budget strings including the earlier component amendment; whitespace
check passes. All eight recipe IDs listed in the prior evidence were regenerated
and pass -Check; generated UI29 policy matches the canonical size evidence and
source-only claim boundary. No builds/tests/lint/browser/database/migration/
commit/push/deployment commands were run; owner build remains pending.
