# Individual — full-width steps

| Field | Value |
|---|---|
| Date | 2026-10-01 |
| Contract | Frozen: Individual step navigation distributed across the editor width |
| Implementation | Complete; source-only |
| Owner verification pending | yes |
| Shape | Existing UI type 03, Backend Pattern 2 unchanged |

The shared navigation already had width 100%, but desktop markers/labels sat at
the start of their grid columns. The owner requested full-width distribution.
Reviewer choice: an optional shared `fill` input, adopted by Individual, centres
each marker above its label in equal-width columns. Its progress track aligns
with marker centres. Existing Company/Staff consumers keep the default mode.
Narrow navigation retains its internal horizontal overflow; the page gains none.

Changed frontend files: shared step-form `.ts`, `.html`, `.scss`, and Individual
details template (one input binding). No backend, payload, validation gate,
translation, persisted field or calculation change. No migration required.

Phases: source discovery/contract selection, detail UI implementation and scoped
source reconciliation. Grid/backend/domain-action phases are inapplicable. No
screenshot or uncertain business decision. Shared extraction: `StepFormComponent`
owns layout; no local feature CSS. UI book 1.14/block 12, changelog and skill were
updated together. All eight generated packets remain stale; canonical blocks
were used, generated files untouched, regeneration/semantic review pending.

Verification: scoped source diff and reference review only. Owner should check
Create/Edit/View distribution, progress position, RTL and a narrow screen. No
build, test, lint, browser/runtime, database, migration, commit or deployment was
run. No subagents: this is a small sequential layout change. Prior user edits
were preserved.

Scoped frontend/documentation diff checks passed (source repository reports only
LF/CRLF notices). `Check-BookReferences.ps1` passed: every checked reference resolves.

Suggested frontend commit: `style(individual): distribute steps across editor width`.
Suggested documentation commit: `docs(ui): document shared step fill option`.
