| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Frontend esbuild startup trial — 2026-10-21

## Scope and frozen decisions

- Owner request: try `@angular-devkit/build-angular:browser-esbuild` to reduce frontend startup time. This authorizes the bounded local development-server compilation trial; no database, browser workflow, production deployment, package upgrade, or unrelated fixes.
- Repository: `F:/My Work/Sigma/SiGmaAngularFrontEnd`; initial working tree clean.
- Scope: build configuration only. Preserve full source maps, existing Angular/library versions, assets, styles, scripts, production budgets, API/domain contracts and tsconfig roots.
- Trial the existing webpack development build, then change only the build builder to browser-esbuild and repeat with the same CLI/node/memory/development options. Retain the change if compilation succeeds; restore it if the replacement fails and needs unrelated source changes. Record failures rather than concealing them.
- Both production and development consume the existing build target. A retained builder replacement therefore affects both; only development compilation is authorized/tested here. Production validation remains pending.
- Use an isolated loopback port, do not stop the owner's existing server on 4200; stop only trial-owned processes. No cache deletion. Single-run timing is indicative, not a controlled cold-cache benchmark.
- UI shape/backend pattern, screen reference, grid/DTO/action/mapping/calculation decisions, translations, user guide and schema migrations: not applicable to this tooling-only change.

## Evidence and conformance

| Concern | Authority | Source/reference | Owner | Target |
|---|---|---|---|---|
| Configuration compatibility | Owner request; Master 4/5 | Installed build-angular 17.3.8 browser-esbuild/index.js `normalizeOptions` | Angular CLI | Compatibility adapter preserves main/polyfills/service worker/output layout; inspect actual trial result |
| Debugging and budgets | UI 29; Master 5 | angular.json development.sourceMap=true and production.budgets | Existing build target | Preserve values, no warning suppression |
| Verification claim | UI 29; Master 7 | Trial logs and complete scoped Git diff | This review | Report actual compilation separately from browser/production acceptance |

- Recipe drift check: all eight packets OK. Consulted `phase-05-integration-runtime`; only integration compatibility/verification concerns apply, not feature route/provider changes. No packet refresh required.
- Discovery, bounded configuration freeze, integration trial and final diff reconciliation apply. Screen/data implementation phases skipped because their contracts are unchanged.
- No subagents: one small, sequential configuration trial does not meet the delegation gate.
- Shared extraction and learning promotion: no new shared application behavior or reusable Sigma-specific rule established.

## Trial results

- Baseline webpack trial compiled successfully in 293.198 seconds wall time; Angular reports 249.631 seconds build time. Log: `FRONTEND_ESBUILD_TRIAL/webpack.log`.
- Initial esbuild trial failed after 71.534 seconds on six webpack-only tilde-prefixed CSS imports. This is a failed trial, not a valid performance result. Preserved failure log: `FRONTEND_ESBUILD_TRIAL/esbuild-initial.log`.

## Bounded compatibility amendment (before the second esbuild trial)

- Supersedes the one-line-only scope above: the trial established six direct compatibility errors in `src/assets/sass/style.angular.scss`. The owner's request to try the builder includes the minimal path adaptation necessary to make it runnable.
- Remove only the leading `~` from those six package CSS imports; preserve package names, files, order, full source maps and all style rules. Angular's official build migration guide identifies removal of webpack-specific tilde imports as part of migration. This is directly related compatibility work, not unrelated source refactoring.
- Conformance: Master 5 compatibility discipline / UI29 actual compiler evidence; shared owner remains `style.angular.scss`; exact same six CSS package entry points and order. Retain only if the follow-up compilation succeeds; otherwise revert trial-owned source changes.
- No screen redesign or user-facing workflow change; in-app user-guide editing is not applicable.

## Media filename compatibility amendment (before the third esbuild trial)

- The second esbuild trial passed the import-resolution stage, then failed after 185.113 seconds on colliding flag image output basenames (e.g. `flags/4x3/eg.svg` and `flags/1x1/eg.svg`). Preserved log: `FRONTEND_ESBUILD_TRIAL/esbuild-media-collision.log`.
- Set development `outputHashing` to `media`. Installed application/options.js produces `media/[name]-[hash]` for this value, resolving distinct image content without removing either aspect ratio or editing vendor files. Production already uses `outputHashing: all` and is preserved.
- Compatibility-only configuration extension is within the requested runnable builder trial. Full source maps and application source contracts remain unchanged. Do not mark compilation successful until the follow-up result confirms it.

## Final reconciliation and measured result

- Final esbuild development compilation succeeded: 105.949 seconds wall time; Angular reports 103.126 seconds bundle generation. Evidence: `FRONTEND_ESBUILD_TRIAL/esbuild.json` and `FRONTEND_ESBUILD_TRIAL/esbuild.log`.
- Baseline command wall time: 293.198 seconds; difference 187.249 seconds (approximately 64% shorter in these measured runs). Baseline Angular build time 249.631 seconds versus final esbuild bundle generation 103.126 seconds. Report command wall time and builder-reported time separately.
- These are sequential, single-run local observations, not guaranteed cold-start results: caches and filesystem warming differ, the final run follows failed esbuild attempts, and the owner's existing server remained running. No cache was cleared. Trial Node version: v24.18.1; this is outside Angular 17's official compatibility matrix and is recorded as the existing environment, not changed by this task.
- Scoped application changes: `angular.json` uses the requested browser-esbuild builder and development media hashing; `src/assets/sass/style.angular.scss` preserves the same six CSS files/order with webpack-only tilde prefixes removed. Normal `npm start` now uses this builder after restart.
- Source conformance: full development sourceMap=true preserved; production outputHashing=all, budgets, optimization policy, entry points, asset configuration, package versions and explicit TypeScript file roots preserved. Media hashes distinguish the square and rectangular flag resources. The installed adapter preserves the existing `dist/sigma` output layout.
- Complete scoped Git diff reviewed; `git diff --check` passed. Two application files changed, with no backend/API/domain/schema changes and no migration requirement. No shared UI extraction or screen guide change applies.
- The final successful compilation has one expected warning: `vendorChunk` is ignored by this builder. It remains in configuration for compatibility; no errors are suppressed.
- Stopped only trial-owned process trees after each result. No browser or external API/database workflow was exercised. Production compilation and functional/visual acceptance (icons, flags, themes, lazy routes) remain pending; development compilation is confirmed, not inferred from source.
- Phases applied: discovery, bounded tooling contract/amendments, integration compatibility trial and source reconciliation. Screen implementation/data phases skipped as not applicable. Recipe check passed without derivative updates.
- Build/dev-server trials were authorized by the owner's explicit request to try the builder. No unit tests, lint, migrations, database commands, commits, pushes or deployment were run. No subagents were used because this was one sequential workstream.
- Suggested frontend commit: `chore(frontend): switch browser builds to esbuild with compatible styles`.
- Owner handoff: restart the existing development server with `npm start`; inspect icons/flags and normal screen navigation. Before release, validate the production build and visual behavior separately. Revert the two scoped configuration/style-path changes together if needed.

## Follow-up: owner-reported Autoprefixer alignment warning

- Owner supplied the webpack/PostCSS warning already captured in the baseline log: generated `src/styles.scss:47897:3`, `align-items: start`. Generated CSS line numbers are not source SCSS line numbers.
- Source discovery identifies `src/assets/sass/core/components/_tree.scss` `.tree .tree-node` with `display: flex`, `flex-direction: column`, `align-items: start`. Installed `autoprefixer/lib/processor.js` `insideFlex` emits the exact warning only for a rule containing a flex display declaration. The report-filter occurrence is a grid rule and is excluded; the helper/stepper occurrences do not contain display in the same rule.
- Frozen bounded fix: replace only the tree-node value with `flex-start`, retaining its selector, column direction, padding, tokens, and existing RTL/theme behavior. In this non-wrapping column rule it preserves the intended cross-axis start alignment and follows the warning's compatibility advice. No other alignment occurrence is changed.
- Conformance: Master5 compatibility/change discipline and UI29 verification honesty; shared owner remains `_tree.scss`; source comparison confirms a single declaration-value change. No DTO/API/schema, guide-topic or new shared presentation contract changes. No learning-rule promotion or packet regeneration is needed for this local compatibility correction.
- Verification: source/scoped-diff review and whitespace check only for this follow-up; no additional build/test/lint/browser run. The earlier successful esbuild compilation predates this one-line change, so disappearance of the warning and visual acceptance remain pending on the owner's next compilation.
- The warning's `postcss-loader` source identifies the webpack path; the owner must restart the pre-existing server to adopt the previously changed esbuild builder. No existing owner server is stopped automatically.

## Follow-up: remove the ignored vendorChunk option

- Explicit owner instruction: remove the unused option after explaining the warning.
- Supersedes the earlier decision to retain it for compatibility: removed only `build.configurations.development.vendorChunk` from `angular.json`. The active browser-esbuild builder ignores that value, as confirmed by installed `browser-esbuild/builder-status-warnings.js`; removal does not change its bundling behavior.
- Master5/UI29 conformance: full source maps, media hashing, production options and all other existing changes are preserved. Scoped diff/whitespace review and JSON parsing performed; no additional build/test/lint/browser execution. Runtime confirmation of warning removal awaits the next development-server restart. No API/schema/guide/packet change or subagent work applies.
