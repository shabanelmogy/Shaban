# Shared export and print colours — 2026-10-10

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

User first requested Driver Time Sheet Report button appearance, then clarified colours only, rejected green in favour of light blue from the existing palette, and explicitly extended the scope to shared application-wide styling. This supersedes the earlier neutral-export choice only for export/print button paint. No green styling or toolbar rearrangement was applied.

Frozen presentation: one shared 34px inline-flex output style with 6px icon gap, 10px horizontal padding, 1px solid 4px-radius border, 0.75rem/700 text and no shadow. It uses a light primary-blue surface (10% primary/surface), primary-blue/strong-border mix (45%), theme-aware balance text; hover/focus use 16% primary/surface and primary border. Icons inherit text. Preserve ordering, labels, events, loading, disabled states, RTL, print hiding and business/API contracts.

| Concern | Book / reference | Shared owner and target |
|---|---|---|
| Report action geometry and colour | UI20; Customer Statement list template and Accounts report composition; existing report filter-action CSS | Keep geometry; replace neutral output colour through global styles.scss |
| Application buttons and theme | UI24; shared PrimaryActionButton template/SCSS and sigma-secondary-button | One global output colour rule, native output icon compatibility and explicit sigma-output-action marker |
| Loading keeps output role | UI24; PrimaryActionButton.resolvedIcon replaces icon while loading | Mark output role from original icon before spinner substitution |
| Scope | Master5/7; current owner clarification | Shared paint and output geometry only; no feature template bulk edits or runtime/business changes |

Source inventory found output glyphs in 155 module HTML/TS files, including native buttons, shared Buttons models, primary buttons and one legacy Font Awesome print control. Compatibility matching is limited to output buttons/btn anchors containing output icons and the existing report export variant; it does not style menu links or report title icons. New callers may use sigma-output-action explicitly. Record final source/packet reconciliation below before handoff.

Recipe -Check passed all eight packets before PHASE02 use. UI20/24 and the required screen-refactor skill govern this shared paint change. Phases02/06 apply; domain/API/edit/state/integration phases do not change. No migration, AutoMapper or calculation change. No subagents: small sequential shared-style work. Existing in-app guides describe the same actions and remain accurate; colours do not change their workflow.

## Implementation and source-only reconciliation

Global `src/styles.scss` now owns the light-blue output paint. It uses only `--sigma-primary`, `--sigma-border-strong`, `--sigma-surface` and `--sigma-balance-value`, with primary wash/border hover and focus. The rule covers the explicit `sigma-output-action` role, the report export variant and native buttons/anchors containing the existing Excel/Print glyphs. It excludes dropdown menu items and preserves disabled/aria-disabled states. `PrimaryActionButtonComponent` derives the role from the original icon, so a loading spinner does not lose the output colour; the shared editor save-and-print action opts in explicitly.

The Driver Time Sheet Report needs no feature colour override and no HTML geometry change. Existing report export/print actions inherit the global rule. UI20 and UI24 were updated with the owner decision, the skill digest and history were synchronized, and generated phase-02, phase-03, phase-04 and phase-06 packets were refreshed through the generator. Final `Generate-SigmaRecipes.ps1 -Check` passed all eight packets.

Source checks: TypeScript parser accepted the changed shared class; scoped `git diff --check` passed. No build, test, lint, browser/runtime, database, migration, commit or push command was run. Owner visual verification remains pending in light/dark themes and RTL, including native output buttons and shared PrimaryActionButton print actions.

Suggested frontend commit: `style(shared): unify export and print action colours`.


## Follow-up — unified output geometry

The owner clarified that every Export/Print button must share one pattern, including the frame. The global rule now enforces the shared secondary geometry on explicit output roles, report output actions and existing native output glyph buttons. The Driver Time Sheet Report and Payrolls Report require no feature markup change. Source-only checks and the eight-packet recipe check remain passing; visual/theme/RTL acceptance is pending.