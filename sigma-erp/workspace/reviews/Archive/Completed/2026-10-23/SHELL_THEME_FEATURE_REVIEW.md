# Shell theme reconciliation

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-02 |

## Manifest and decisions

Scope: authenticated shell body, sidebar/search/footer, navbar buttons and branch/language/theme/account/notification menus. User requests in this conversation authorize implementation. No screenshots supplied; evidence is source plus the user's reported mismatches. Working-tree `src/styles.scss` change at entry is the earlier sidebar/footer correction from this conversation and is included, not reverted.

Frozen presentation contract: `SHELL_THEME_MAINTENANCE_EVOLUTION_PLAN.md`. Master 1/3/4/7, UI 24/25/29/30 and the project `sigma-screen-refactor` skill apply. Shell is a canonical shared styling concern, with no feature-screen/editor/backend shape. Generated recipe drift was detected; canonical sources were used. Owner packet regeneration and semantic review remain pending.

| Decision | Evidence and result |
|---|---|
| Style owner | Existing global Sigma tokens and existing shell components; no feature palettes or new component copies |
| Background hierarchy | Canvas for body/toolbar, surface for navigation/footer/menu shells, soft surface for controls and bands |
| Body background producer | Metronic reboot uses `--bs-app-bg-color`; toolbar/background helpers use `--bs-body-bg`; authenticated dark scope bridges both plus RGB to Sigma canvas |
| Sidebar colours | Metronic variable bridge for surface, selection, text, icons, headings and scrollbar; scoped submenu/title override removes hardcoded legacy text colour |
| Search appearance | Scoped class consumes global tokens for complete input group; native input/clear behavior and shortcut unchanged; focus-within uses shared ring |
| Topbar actions | Consistent token-based button surfaces, border, hover and focus; existing button sizes/menus preserved |
| Menus | Global surfaces/text/borders and blue interaction accents; status/error/warning colours keep their semantic meaning |
| Shared extraction | Existing global tokens already own the shared palette; consume them in existing shared components, no new behavioral component needed |
| Backend/API/permissions/AutoMapper/calculation | Not applicable; presentation only, no changes |
| Migration | Not required; no entity/EF/schema changes |

## Files

Repository: `F:/My Work/Sigma/SiGmaAngularFrontEnd`.

- `src/styles.scss`
- `src/app/_metronic/layout/components/sidebar/sidebar-menu/sidebar-menu.component.html`
- `src/app/_metronic/layout/components/sidebar/sidebar-menu/sidebar-menu.component.scss`
- `src/app/_metronic/layout/components/header/navbar/navbar.component.scss`
- `src/app/_metronic/partials/layout/theme-mode-switcher/theme-mode-switcher.component.scss`
- `src/app/_metronic/partials/layout/extras/dropdown-inner/user-inner/user-inner.component.scss`
- `src/app/_metronic/partials/layout/extras/dropdown-inner/notifications-inner/notifications-inner.component.scss`

## Phases and agents

Frozen maintenance plan, Phase 0 source discovery, source integration checks and Phase 6 reconciliation apply. Phases 1–4 and runtime wiring changes are skipped because no domain/API/read-write/state-transition/routing contracts change.

Root owns global/search files, contracts, integration and final diff review. Two bounded `terra_worker` roles use the inherited model (mapped Terra unavailable): `topbar_styles` owns navbar/theme-switcher SCSS; `topbar_menus` owns account/notification SCSS. Independent file ownership reduces elapsed time without merge risk; the root integrates both.

## Owner acceptance

Build and verify the authenticated shell in light/dark, English/Arabic, desktop/mobile and expanded/minimized sidebar. Check body/toolbar/sidebar/footer colour continuity, search typing/clear/shortcut/focus, topbar button hover and keyboard focus, and each menu's default/active/hover/empty state. Switch light/dark/system mode and language; confirm branch/account/notification behavior remains the same. Check avatar and status colours, menu readability, scrolling and narrow layouts.

Risk: source review cannot prove rendered colours, dropdown attachment behavior or compilation. Modern colour mixing is already used by the existing global styling. No new translations, TypeScript imports or transport bindings are introduced. No missing business requirements remain.

Suggested frontend commit: `fix(shell): unify navigation and dark canvas colours`.

Build, tests, lint, database, browser automation, migrations, commits, pushes and deployment were not run, per project instructions.

## Final reconciliation

| Comparison | Source result | Owner check pending |
|---|---|---|
| Frozen palette → body/header/sidebar/footer | Existing tokens consumed; body bridges actual Metronic background and Bootstrap helper variables, with matching canvas RGB | Rendered theme continuity |
| Search → colours/focus/events | Complete group styled; only one class added to HTML; all input/clear/keyboard handlers preserved | Search/clear/shortcut and focus |
| Topbar → buttons/menu styling | Same default/hover/focus palette for branch/language/theme/notification/account buttons; legacy dark colour copies removed | Hover and keyboard interaction |
| Account/notification → semantic colours | Semantic Bootstrap globals + text/surface mixing; dark overrides contain shadows only | Rendered statuses and menus |
| Typography → palette | Small muted text mixes muted70% + text30%; small blue account/notification labels mix primary50% + text50% | Actual rendered text and icon contrast |
| RTL/responsive → scoped diff | Existing sizes/breakpoints/directional rules preserved; no route or TypeScript changes | Arabic and narrow viewports |
| Tokens/selectors → declared owners | All introduced Sigma tokens declared in global stylesheet; ordinary component styles remain scoped, dark shadow overrides use host-context; inherited Keenicon colour explicitly scoped | Browser CSS/attachment behavior |
| Complete diff → whitespace/conflicts | All seven changed frontend files reviewed; `git diff --check` passes; no merge markers | Compilation |

Source-only contrast arithmetic for new muted text on light/dark soft surfaces is approximately 4.68:1 / 8.08:1. The worker checked account/notification blue labels on their strongest 16% tinted background (4.52:1 light / 6.41:1 dark) and semantic foregrounds at least 4.50:1 on their tints. These are mathematical palette checks, not rendered accessibility or browser verification.

Both bounded workers integrated successfully with disjoint files. Root strengthened navbar/theme small muted text to the same 70/30 mix and reviewed all subsequent changes. No unrelated changes or business contract effects were found. No new reusable behavioral rule was established; this is application of existing token ownership, so no canonical-book/skill rule update is needed.

## Follow-up — body colour, 2026-10-02

Owner reports the body still has the old colour. Source review confirms the previous canvas bridge was dark-only; light retained Metronic `#fcfcfc`. The authenticated body now directly sets `background-color: var(--sigma-canvas)` and synchronizes Bootstrap app/body/RGB variables in both themes. The more specific rule takes precedence over both the original and dynamically loaded RTL reboot body rules. Dark remains `#111820`, light becomes existing Sigma canvas `#f1f3f7`; surfaces retain their lighter hierarchy. No new palette is introduced. Actual served-build/cache/computed-style cause remains unverified. Scope is one source file; root handled the sequential follow-up without subagents. Source diff/whitespace checks pass; owner build and visual verification remain pending. No backend, schema, API, runtime wiring or prohibited command changes.
