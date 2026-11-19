| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-23 |

# Frontend helper script organization

## Manifest and decision

The owner requested inspection of files similar to `inspect-custom.cjs`, then
authorized a clear folder for these cases. Scope is the frontend root helper
scripts and their direct inputs/configuration references. This is a bounded
tooling task, not a screen implementation: no UI/backend shape, business/API
contract, in-app guide, migration or screen-reference change applies.

Authority: workspace AGENTS.md, Master block 1 proportional process and scope
discipline; PHASE-00 discovery inventory. Recipe generator `-Check` passed all
eight packets before use. UI block 1 concerns feature wiring, not standalone
developer-tool locations; no feature layout was imposed on this tooling task.

Freeze: retain active `scripts/build-rtl.mjs`; archive the 26 root `.cjs`
helpers with their `remote-table-inventory.json` input under
`tools/archive/shared-table-filters/`; archive `extract.js` unchanged under
`tools/archive/legacy-sidebar/`; document purpose, effects, dependencies and
future helper placement in `tools/README.md` and link it from the main README.
Preserve existing runtime/source/build configuration and historical review
records. Do not permanently delete helpers or rerun transformations.

## Evidence and classification

| Area | Evidence | Decision |
|---|---|---|
| 26 root `.cjs` helpers | All use TypeScript AST inspection and/or task-specific remote table filter inventories; 13 write source, 4 write review artifacts, 9 print only | Archive with per-file effect table |
| Table inventory snapshot | Read by `remote-inventory.cjs`, `reconcile-remote-column-scope.cjs` and `write-coverage.cjs` | Archive alongside its readers; adjust their input paths |
| Legacy extraction | Hard-coded former checkout and `_metronic` paths; no package/build references | Archive unchanged, explicitly document incompatibility |
| RTL generator | Package `rtl` and `rtl:check` commands and README reference it | Keep active in existing location |
| Root configuration | Angular, TypeScript, ESLint, Karma, hosting and package files serve configuration roles | Keep in place; outside expendable-helper classification |
| `ngcc.config.js` | Legacy configuration, not part of the helper relocation | Leave unchanged; retirement would be a separate configuration decision |
| Ignored `NUL` | Untracked/ignored stale CSS artifact, not a helper script | Leave untouched; excluded from this organization |

No matches to helper filenames or snapshot were found in the scoped application
source/editor/CI reference search. Current package scripts and Angular build
configuration do not invoke the helpers. Existing shared-table-filter review
and coverage records explain their historical role.

## Implementation and reconciliation

Organization implemented after the above decision freeze. The frontend root was
clean at discovery. Its Git repository is
`F:/My Work/Sigma/SiGmaAngularFrontEnd`; this review is an unversioned workspace
artifact under `F:/My Work/Sigma/reviews/`.

| Check | Result |
|---|---|
| All 26 `.cjs` moves | Verified against pre-move source: only archive comment, repository working-directory initialization, TypeScript package resolution and co-located snapshot input paths changed |
| Legacy extraction | Original content preserved exactly |
| Inventory snapshot | Original and relocated Git blob hash both `49c53e9e8063aae1eb8522d0347c628e382e85ea` |
| Local documentation links | All links in the root and three tooling READMEs resolve |
| Script source inspection | Every archived script and its read/write effects inspected; 26 entries documented |
| Complete scoped changes | Original deletions compared with relocated files and path-only adaptations; new README contents and root README diff reviewed |
| Application and configuration | No diff under `src/`, `scripts/`, package/lockfile, Angular, TypeScript, ESLint, Karma, ngcc or hosting configuration |
| Whitespace | `git diff --check` passed |
| Backend, API, mappings, calculations and migrations | No changes; not applicable |
| Screen user guide | Not applicable: developer-tool organization, no screen changes |
| Packet maintenance | Initial check passed all eight packets; canonical sources and generated packets unchanged |

No archived scripts, builds, tests, lint, browser, database, migrations, commits,
pushes or deployment commands were run. Script execution and runtime behavior
remain unverified; historical scripts still require current-input/source review
before reuse. This archive does not convert one-off transformations into reusable
maintenance automation. The preserved legacy extraction remains incompatible
with the current checkout until its former hard-coded inputs are replaced.

Owner handoff: inspect `tools/README.md` and its per-topic inventories. There is
no required application runtime or migration step for this organization.
Suggested frontend commit: `chore: organize historical frontend review helpers`.
No permanent deletion was performed. Git currently represents relocations as old
path deletions and new untracked files because nothing was staged or committed.

One read-only `luna_explorer` agent using `gpt-5.6-luna` audited ancillary root
files and active tooling while the root inspected the 26 `.cjs` scripts. The
ownership was non-overlapping and avoided repeating the script scan. The root
owns organization, integration and reconciliation.
