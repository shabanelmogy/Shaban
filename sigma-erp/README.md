# Sigma Planning and Pattern System

This folder is the entry point for Sigma feature planning, review, maintenance,
and implementation guidance.

For ready-to-copy Arabic commands for common workflows, use:

`SIGMA_COMMAND_REFERENCE_AR.md`

## Canonical authority

Use these current files directly:

1. `SIGMA_FEATURE_REVIEW_MASTER.md` — review/planning orchestration, contracts,
   phases, gates, handoffs, and final reconciliation.
2. `SIGMA_UI_PATTERNS.md` — Angular/UI implementation authority by UI shape.
3. `SIGMA_BACKEND_PATTERNS.md` — .NET/domain/persistence/API implementation
   authority by backend pattern.
4. `recipe-system/` — derivative generated planning/review packets and reusable
   artifacts. Generated packets never override the three canonical documents.
5. `F:\My Work\Sigma\.agents\skills\sigma-screen-refactor\SKILL.md` — the
   operational checklist digest of the books for screen work. Every skill rule
   cites its owning book block; a lesson is written to the book and the skill
   in the same task (see `F:\My Work\Sigma\AGENTS.md`).

Each of the three guides is stored as one file per block in `master/`, `ui/`,
and `backend/`. The `SIGMA_*.md` file of the same name is a short index; the
block number stays the citation key ("UI block 17" is `ui/17-*.md`). Version
history is in `CHANGELOG.md`.

Read the version/status metadata from each guide's `00-preamble.md` header; do
not duplicate those values in secondary indexes.

## Starting a screen

Pick the screen type in `ui/screens/00-catalog.md`. Each of the seven screen
files names the approved reference, the backend pattern, the contracts to freeze
first, and the UI blocks to read in order. The screen files add no rule; the
cited blocks own every rule.

## Which workflow to start with

For a broad but already understood feature, start with Phase 0 and continue only
through the applicable phases, ending with Phase 6.

For maintenance, extension, or a new cross-cutting capability whose current logic
must be understood or discussed first, start with:

`recipe-system/generated/PLAN-00-maintenance-evolution.md`

Copy and fill:

`recipe-system/templates/MAINTENANCE-EVOLUTION-ARTIFACT.template.md`

Freeze that plan before implementation. Then Phase 0 consumes the frozen target
scope/contracts and the normal Phase 0–6 system carries the change through
implementation and final reconciliation.

Examples that normally need the planning workflow include currency, tax, pricing,
numbering, approvals, posting, inventory valuation, permission changes, shared
integration behavior, or any change where existing business logic is incomplete,
conflicting, or spread across several features.

## Feature review artifact

For one implementation/review run, copy:

`recipe-system/templates/FEATURE-REVIEW-ARTIFACTS.template.md`

Keep unresolved contracts visible until Phase 6; do not replace the artifact with
a prose-only summary.

## Generated packet verification

From this folder:

```powershell
.\recipe-system\Generate-SigmaRecipes.ps1 -Check
```

When a canonical source changes, regenerate with:

```powershell
.\recipe-system\Generate-SigmaRecipes.ps1
```

Then run `-Check` again and perform semantic review of templates, dependency
closure, and manifest approved references. A green hash check proves generated
content synchronization; it does not replace semantic review.

## Historical archive

The August 2026 snapshot `sigma-erp.rar` was moved out of this folder on
2026-09-28 by the owner. It is **not canonical** and must not be used as the
source for current planning or implementation decisions.
