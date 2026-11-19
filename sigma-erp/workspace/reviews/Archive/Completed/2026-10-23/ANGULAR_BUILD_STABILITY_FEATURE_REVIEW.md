# Angular development build stability repair

| Item | Value |
|---|---|
| Status | Implemented; development compile and watched rebuilds verified |
| Owner verification pending | yes |
| Date | 2026-10-14 |
| Source scope | Frontend package.json scripts |

The supplied logs show successful initial compilation followed by a watched compilation exhausting V8 near the default 4GB ceiling. The existing scripts.ng entry now runs the installed local Angular CLI through node --max-old-space-size=6144. start/build/build-prod/watch delegate through that one owner. start explicitly selects the existing development default. The test/lint/rtl commands are unchanged.

## Decisions and conformance

| Concern | Governing reference / shared owner | Final decision and evidence |
|---|---|---|
| Scope and recovery | Master1/4/7; frozen stability plan | Apply the confirmed heap-ceiling fix before changing dependency versions; no application behavior or contract change |
| CLI reuse | Master5; package.json scripts.ng | Use one existing CLI entry; no new launcher file, package or duplicated memory constant |
| Build configuration | UI1/29; angular.json development/production configurations | Preserve current source maps, optimization, budgets and PWA configurations |
| Package graph | Installed and locked Angular17.3.10, CLI/builder17.3.8 | Preserve current matched graph and existing PWA dependency addition; no install or lock rewrite |
| Historical difference | Existing PWA setup record | npm install aligned local Angular17.3.12 to already locked17.3.10; possible variable, no demonstrated causal memory comparison |
| Runtime | Installed Node24.18.1 | Angular17 compatibility risk recorded; no global runtime change in this slice |
| Verification | Root AGENTS source boundary plus subsequent owner authorization | Owner explicitly approved development build/watch verification with «نعم، شغّل وتحقق»; bounded runtime check now in progress |

Applied PHASE-05 command wiring and PHASE-06 scoped reconciliation. Recipe -Check passed all eight packets. UI/grid/dialog/backend/schema/guide phases do not apply to this tooling fix. Screenshot fields and contracts from the earlier correction work are unaffected. No new screenshot requirement. No guide revision: npm tooling changes no in-app workflow. No DTO, AutoMapper, domain calculation or migration change. Subagents were not used: this small sequential fix does not meet the delegation gate.

Source checks: package.json parsed; all four scripts delegate to the shared CLI entry; installed CLI path exists; tiny Node process reports 6336MiB total V8 heap with the 6144MiB old-space flag. Complete package diff reviewed in its frontend repository; existing service-worker addition preserved. Scoped whitespace check passed. No reinstall or cleanup of node_modules, where the required local ms-lib is currently present.

Authorized development verification used npm.cmd start -- --open=false. The actual Angular CLI process command includes --max-old-space-size=6144. Results:

| Compilation | Time | Result |
|---|---|---|
| Initial, 2026-10-14T18:02:23.943Z | 102606ms | Compiled successfully |
| Subsequent automatic watched rebuild, 18:02:56.830Z | 31024ms | Compiled successfully |
| Controlled TypeScript comment addition, 18:04:03.606Z | 38974ms | Compiled successfully |
| Exact source restoration, 18:04:53.658Z | 10233ms | Compiled successfully |

Controlled verification appended a temporary comment to the already-repaired EmailTemplates component after checking its recorded modification time, backed up its exact bytes, and restored only after verifying the temporary SHA256 still matched. Original/restored SHA256: 05B7621CCA415EB03E00680FB7F8556AD27A431060AEDA077968406BDC54EC35. No temporary comment remains; restored webpack hash ee284b38b3e8875d matches the preceding automatic rebuild. Source content and unrelated edits preserved.

Read-only HTTP request to http://localhost:4200/ returned 200 and the correct 7STARSS ERP document, with runtime/polyfills/styles/scripts/vendor/main bundle references. The application root is body[root], matching the actual AppComponent selector. No browser interaction or API/data mutation. Development server left running for the owner (Node PID43528, tool session81740). Observed final process working set about5779MiB/private committed about6710MiB; these are process-memory figures, not V8 heap measurements. No OOM in the observed initial plus three rebuilds. This bounded verification does not establish long-term stability. Existing autoprefixer warning for align-items: start remains; it does not block compilation.

Production build, browser/UI/API acceptance and long-term memory behavior remain pending. Manual follow-up: use the running development server, perform normal source edits with npm start in later sessions, and report any further OOM with the actual command and log. No repeated testing beyond these successful relevant rebuilds was required.

No tests, lint, production build, migrations, database commands, browser automation, commits, pushes or deployment run. Only the owner-approved development build/watch process is permitted in this verification.

Suggested frontend commit (this task's npm-script hunks only): fix(build): raise Angular CLI heap limit for npm scripts.
