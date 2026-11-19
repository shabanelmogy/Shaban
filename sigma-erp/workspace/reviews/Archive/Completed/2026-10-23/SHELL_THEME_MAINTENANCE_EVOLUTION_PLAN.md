# Shell theme alignment

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-02 |

## Scope and evidence

User reports mismatched dark sidebar, footer, menu search and body, then authorizes improving all shell colours including topbar buttons. Scope is the authenticated shell and its topbar menus, not feature screens. Existing source change in `src/styles.scss` belongs to this same conversation and is preserved.

Canonical ownership: Master blocks 1, 3, 4, 7 and UI blocks 24, 25, 29, 30; `sigma-screen-refactor` sections 1 and 7. UI shape is shared application shell, not a CRUD screen. Backend shape is not applicable. Existing shell components remain the implementation owners. Recipe check in this conversation reports all generated packets stale; use canonical blocks, leave generation and semantic packet review to the owner.

## Existing state and impact map

| Owner/consumer | Evidence | Decision |
|---|---|---|
| `src/styles.scss` global Sigma tokens | Dark canvas/surface/soft surface already exist | Keep palette; extend Bootstrap body background bridge |
| Metronic body/toolbar | Body uses `--bs-app-bg-color`, toolbar uses `--bs-body-bg`, both old neutral grays | Bind authenticated dark body and toolbar to Sigma canvas; synchronize RGB companion |
| Active `LightSidebarConfig` | Sidebar uses Metronic variables; prior fix bridges background | Keep prior fix; align menu text, separators and selected surface |
| Sidebar search component | `input-group-solid` uses Bootstrap gray-100 | Refactor scoped search colours using Sigma tokens and shared focus ring |
| Navbar and theme switcher | Duplicate hardcoded neutral/violet dark chrome | Refactor presentation to global tokens; identical button states |
| Account and notification menus | Same obsolete dark chrome | Refactor surfaces/text/borders to Sigma tokens; retain meaningful status accents |
| Footer | Prior fix binds surface | Keep surface and existing sizing/text |

## Options and frozen presentation contract

Keep isolated hardcoded dark palettes: rejected because it preserves the reported mismatch. Globally rewrite Bootstrap grays: rejected because it affects unrelated feature controls. Selected: extend existing shell/component owners with global Sigma tokens.

- Body/page background: `--sigma-canvas`; header/sidebar/footer/menu shells: `--sigma-surface`; controls and soft bands: `--sigma-surface-soft`.
- Text: `--sigma-text`; secondary text/icons: `--sigma-muted`; borders: `--sigma-border`; active/focus accents: `--sigma-primary`; tinted states use `color-mix` with the existing surface.
- Topbar branch/language/theme/notification/account buttons share surface, border, hover and visible focus treatment. Preserve sizes, responsive and RTL behavior.
- Menus consume the same global palette in both themes; semantic warning/success/danger indicators retain their meaning and adequate contrast.
- Search covers the input, icon, clear action, shortcut, placeholder and keyboard focus. Preserve existing events and bindings.
- Shell changes are purely visual. Routes, permissions, branch/language/theme selection, notifications, authentication, API, data, calculations and migrations do not change.
- Open business decisions: none. User-directed scope and existing global palette support all presentation decisions.

## Implementation and verification

1. Root owns `src/styles.scss`, sidebar search HTML/SCSS, artifacts and integration review.
2. Parallel bounded workers own navbar/theme-switcher SCSS and account/notification menu SCSS separately, after this freeze. No overlapping file ownership.
3. Root reviews complete frontend diff, token definitions/selectors, encapsulation, RTL, unchanged bindings, merge markers and whitespace.
4. Owner runs build and visual verification in light/dark, Arabic/English, desktop/mobile, expanded/minimized sidebar, menu search/clear, topbar hover/focus, and branch/language/theme/account/notification menus.

Phases 0 and 6 apply; integration is checked from source. Phases 1–4 and runtime wiring changes are not applicable to a presentation-only correction. No database, schema, deployment or data compatibility impact. Rollback restores the scoped styling diff. No build, tests, lint, browser, database, migrations, commits or pushes are authorized or run.

## Follow-up amendment — 2026-10-02

User reports that the body still shows the old colour and questions its suitability. Within the authorized whole-shell colour scope, bind the authenticated body background directly to `--sigma-canvas` in both themes, with matching Bootstrap app/body/RGB bridges. Keep the frozen hierarchy: canvas differs intentionally from navigation surfaces while sharing the palette. Source shows that the prior bridge covered dark theme only; light retained Metronic `#fcfcfc`. Both LTR and dynamically appended RTL reboot styles set body background from Bootstrap variables. The explicit `html body.sigma-app-viewport` background declaration has greater specificity than either reboot rule. No rendered root cause is claimed without owner browser verification.
