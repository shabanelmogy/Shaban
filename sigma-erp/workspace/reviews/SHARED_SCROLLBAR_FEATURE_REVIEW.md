# Shared scrollbar feature review

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-23 |
| Scope / tier | Shared scrollbar appearance; L, bounded CSS slice |
| Plan | SHARED_SCROLLBAR_MAINTENANCE_EVOLUTION_PLAN.md — Frozen |

## Manifest and decisions

The owner's Arabic request authorizes implementation of improved scrollbar
appearance. Master5's standing shared-presentation preference selects general
inheritance. UI shape is shared presentation, not a CRUD screen; backend shape
is not applicable. The root owns this slice and reconciliation. No screenshots,
video or Page were supplied, and no material decision remains unresolved.

The frozen plan holds inventory, impact map, alternatives, compatibility,
pre-edit conformance and implementation order. The selected rule is one global
paint owner with existing overflow/sizing/gutter owners preserved. Fine-pointer
desktop uses a 10px transparent track, 2px thumb inset, rounded neutral thumb,
blue hover/drag. Touch/no-hover and forced-colors retain native automatic
scrollbars. Native fallback remains for engines without WebKit scrollbar
selectors. Appearance is browser/OS-dependent and requires owner acceptance.

No grid columns, ListVM properties, DTOs, domain actions, routes, providers,
permissions, mappings, accounting calculations or database contracts change.
Those contract tables are not applicable, rather than invented for this slice.

## Files changed by this task

Application repository: `F:/My Work/Sigma/SiGmaAngularFrontEnd`.

- `src/assets/sass/_sigma-scrollbars.scss`: shared skin, theme-token consumption,
  engine fallback and native touch/forced-colors behavior.
- `src/styles.scss`: one import and removal of competing dark-dropdown-only
  scrollbar rules. Existing local standard declarations are overridden only for
  scrollbar paint, preserving all feature layouts.
- `src/app/modules/UserGuide/content/shared-screen-guidance.ts`: one bilingual
  scrollbar instruction. Other pre-existing/concurrent guide edits preserved.

Documentation repository: `F:/My Work/Shaban Documents/Shaban`.

- `sigma-erp/ui/24-colors-icons-buttons.md`: shared rule recorded under its owner.
- All eight derivative `sigma-erp/recipe-system/generated/` packets refreshed
  through the generator after initial drift. No generated file edited directly.

Local instruction/review records: the screen skill adds the UI24/25 routing
rule and revision row; this report and the frozen maintenance plan. Workspace
root Git remains unavailable; these local records are not treated as frontend
repository files. Existing documentation changes were preserved.

## Phase and conformance reconciliation

| Contract / path | Source evidence | Result |
|---|---|---|
| General inheritance | Master5; frozen plan; global Sass import in styles.scss | Source-conformant; no screen opt-in |
| Geometry | Layout `.sigma-shell__content`, sidebar `.sigma-menu-scroll`, DataTable `.p-datatable-table-container` compared against new partial | Existing overflow, min-height, direction and gutter untouched; visual pending |
| Theme and direction | Root/dark `--sigma-muted`, `--sigma-primary`, `--sigma-text`, `--sigma-primary-hover` → shared thumb tokens | Both axes use theme tokens; no physical placement or direction overrides |
| Overlay paint | Existing dark Select/MultiSelect-only pseudo rules removed; global descendant paint applies to appended content | Shared owner replaces duplicate skin; runtime pending |
| Engine compatibility | WebKit supports branch explicitly resets standard width/color to auto before pseudo paint | Source-conformant; browser/OS acceptance pending |
| Touch / high contrast | Custom paint inside forced-colors:none + hover:hover + pointer:fine; base automatic scrollbar properties override old local colors/widths | Native path preserved in source; device verification pending |
| Guide | SHARED_SCREEN_GUIDANCE → GuideReader.sharedScreenGuidance → overview loop in reader HTML | EN/AR content present; existing module guides receive it |
| Data/API/actions | No producer/consumer changes | Not applicable |

Applied PLAN-00, Phase0 bounded discovery, Phase1 applicability/contract freeze,
Phase5 shared-style integration and Phase6 source reconciliation. Phases2–4
implementation skipped because no list/editor/action business contract changes.
UI30 had no existing scrollbar-specific backlog entry to duplicate. No subagents
were used: this is one shared CSS owner and tightly sequential documentation;
parallel delegation would add coordination without an independent workstream.

## Packet maintenance evidence

Initial read-only generator check found all eight packets stale. Current
templates/manifest already carried in-progress canonical updates; preserved
them. Regenerated PLAN-00 and PHASE-00 through PHASE-06, then checked again;
all eight passed, including after the owning-book change. No source/template
conflict requiring edits was found for this presentation slice.

Semantic review: PLAN-00 retains freeze-before-implementation; Phase0 retains
evidence/shape discovery; Phase5 names main.ts/app.config.ts/app.routes.ts as
standalone bootstrap/root-client/router owners and preserves native shell scroll
ownership; Phase6 keeps source evidence separate from runtime acceptance and
requires the guide. All 25 approved-reference entries resolve to existing
paths; templates contain no stale app.module/app-routing.module/.app-content
or Metronic wiring claims. Unused backend/grid/editor packet details do not
authorize unrelated work. Latest source rules prevail over derivative packets.

## Verification and owner handoff

Reviewed full scoped tracked diffs separately in the frontend and documentation
repositories and read the new Sass source in full. Git whitespace checks passed
for scoped frontend files. Sass uses the current @use entry; no TS runtime
entry/import, route, translation key or request contract is added. Existing
user/peer changes, including sidebar/guide/login work, were preserved.

The standards-versus-pseudo reset follows the browser documentation:
[MDN scrollbar selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::-webkit-scrollbar).
This documents CSS behavior, not a runtime pass of Sigma.

Guide file: `src/app/modules/UserGuide/content/shared-screen-guidance.ts`.
Existing route: `/UserGuide/:sectionId`, reached by module guide sidebar entries;
the shared overview covers mouse wheel, dragging, touch, theme and native
high-contrast appearance. No new guide route/sidebar entry is needed.

Owner checks: open sidebar, a long data table (both axes), an editor dialog and
a dropdown. Check idle/hover/drag, light/dark, Arabic/English, keyboard/wheel,
touch/no-hover and Windows forced colors, and confirm no new document scroll.
Visual result and native/browser differences remain pending. Build, tests,
lint, browser automation, application runtime, database/migrations, commits,
pushes and deployment were not run. No migration is needed.

Suggested frontend commit: `style: unify shared scrollbar appearance`.
Suggested documentation commit: `docs: define shared scrollbar presentation and refresh recipes`.
No commit was made.
