| Item | Value |
|---|---|
| Status | Implemented; authorized development compile/watch verified |
| Owner verification pending | yes |
| Date | 2026-10-14 |

# Angular build stability

Owner instruction: «شوف المناسب المهم المشروع يشتغل». Scope: frontend npm CLI entry and heap exhaustion recovery; preserve application features and unrelated changes. Root AGENTS, Master1/4/5/7, UI1/29, PLAN-00/PHASE-05/PHASE-06 apply. Recipe check passed all eight packets.

## Inventory, impact and alternatives

| Source / existing behavior | Decision | Reason and impact |
|---|---|---|
| Logs: first compile successful, later rebuild fails near4GB V8 heap | Extend npm CLI entry with explicit6144MiB old-space ceiling | Direct response to confirmed process ceiling; source code/application behavior unchanged |
| npm scripts invoke ng directly | Refactor through existing scripts.ng owner | One memory setting for start/build/build-prod/watch, independent of caller-shell NODE_OPTIONS |
| Current locked/installed Angular core/common/compiler/service-worker17.3.10; CLI/builder17.3.8 | Keep current matched graph initially | Version restoration alone is not proven to solve heap failure; avoid another reinstall before isolating the actual ceiling |
| PWA enabled only in production; dev disabled | Keep PWA | No proven PWA failure in dev; owner conditional deletion does not require removing an unaffected feature |
| PWA setup record: local Angular17.3.12 previously differed from lock17.3.10 and npm install realigned it | Record as possible historical variable | No reproducible before/after memory measurements; don't claim a confirmed library regression |
| Node24.18.1; Angular17 compatibility matrix names18/20 | Record compatibility risk | Do not change global runtime or silently introduce another version; isolate heap first, then compare a compatible runtime if verification still fails |

Alternatives: dependency/PWA rollback is deferred without a demonstrated causal result; deleting node_modules/package-lock would destroy the local ms-lib installation and widen scope; disabling development source maps loses debugging and is deferred unless memory remains insufficient. Selected first slice changes only npm commands.

## Frozen contract and verification

scripts.ng executes the existing local Angular CLI using node --max-old-space-size=6144. start/build/build-prod/watch delegate through it, preserving serve -o and existing build configurations; start explicitly names development, matching the existing serve default. No dependency/version/lock/config/PWA/budget/schema change in this slice. No new package or launcher framework.

Source checks: package JSON parse, exact script delegation, installed CLI path, explicit-flag heap limit using a tiny Node process, scoped diff/whitespace and preservation of PWA package changes. Runtime handoff: npm start reaches Compiled successfully and repeated watched compilations complete without heap failure; production build separately pending. A first compile alone cannot certify rebuild stability. Root AGENTS forbids builds/application verification without current explicit authorization; prepare reviewable source fix before requesting the final verification approval. No database/browser/data mutation, commits or deployment.

Implementation: PHASE-05 CLI command wiring, PHASE-06 source reconciliation. No grid/editor/backend/guide workflow is changed. Source-only outcome is not a claim that the project runs. If approved verification reveals further compile errors or memory failure, continue the bounded repair from the actual output and update this record rather than assuming success.

Runtime authorization: owner subsequently replied «نعم، شغّل وتحقق» to the explicit development-server and watched-recompilation verification question. This permits the bounded development build/watch check for this task; production builds, tests, lint, database commands and browser automation remain outside this verification. Start command: npm.cmd start -- --open=false, retaining the npm start owner and suppressing automatic browser opening. Installed CLI process confirmed --max-old-space-size=6144.

Final reconciliation: initial compilation and three subsequent watched compilations succeeded without OOM. Controlled temporary comment change was restored byte-for-byte after concurrent-change/hash checks. Local development document returned HTTP200. Server remains available on localhost:4200. See ANGULAR_BUILD_STABILITY_FEATURE_REVIEW.md for timings, exact restoration evidence, memory observations and pending production/UI/API/long-term verification. No dependency/PWA rollback proved necessary in this observed run.
