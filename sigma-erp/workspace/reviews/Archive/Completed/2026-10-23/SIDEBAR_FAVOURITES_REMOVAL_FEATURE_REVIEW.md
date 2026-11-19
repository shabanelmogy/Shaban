| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Sidebar keeps Pin only — 2026-10-03

Scope/contract and pre-edit source conformance are Frozen in SIDEBAR_FAVOURITES_REMOVAL_MAINTENANCE_EVOLUTION_PLAN.md. Owner explicitly removes Favourites and retains appbar Pin. Recent, search, routes/catalog, pin storage/order and manager stay with existing owners. Legacy favourite preferences remain dormant; no deletion or migration. No backend, AutoMapper, domain calculation, DTO/grid column or permission change.

Phases: discovery and bounded contract freeze applied; Phase5 applies shell/template/service integration and Phase6 source reconciliation. Phases2–4 skipped: no grid, editor/write or domain action changes. No screenshots or unresolved contract decision. No subagents: one coupled removal. No build/test/lint/browser/database/migration/commit/push/deployment authorized or run.

## Changed files

- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/_metronic/layout/components/sidebar/sidebar-menu/sidebar-menu.component.ts` — remove favourite items and handlers.
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/_metronic/layout/components/sidebar/sidebar-menu/sidebar-menu.component.html` — remove Favourite section/star and keep the divider conditional on Recent.
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/_metronic/layout/components/sidebar/sidebar-menu/sidebar-menu.component.scss` — remove star styles, one-button 36px link padding, existing 24px Pin at logical end6px.
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/_metronic/layout/components/sidebar/sidebar-menu/sidebar-shortcuts.service.ts` — remove favourites state/read/write/API; collapse loads Recent only.
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/_metronic/layout/components/sidebar/sidebar-menu/menu-catalog.service.ts` — update retired-favourites comment only.
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/styles.scss` — remove obsolete star-only minimize rule; retain pin minimize rule.
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/i18n/vocabs/en.ts` and `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/i18n/vocabs/ar.ts` — remove sidebarMenu.favorites/pin/unpin only.

Local artifacts: this report and its Frozen maintenance plan; explicit dated amendments in `F:/My Work/Sigma/reviews/Archive/Completed/2026-10-23/APP_SHELL_SIDEBAR_FEATURE_REVIEW.md`, `F:/My Work/Sigma/reviews/Archive/Completed/2026-10-23/APPBAR_SHORTCUTS_MAINTENANCE_EVOLUTION_PLAN.md` and `F:/My Work/Sigma/reviews/Archive/Completed/2026-10-23/APPBAR_SHORTCUTS_FEATURE_REVIEW.md`. This is a product-choice removal, not a new reusable implementation rule: canonical books/skill remain unchanged. Recipe drift check passed all eight packets; no regeneration is needed.

## Final source reconciliation

All four conformance concerns in the Frozen plan match their final source contract. No remaining favourite/star symbols, service calls, template keys or global selectors in the scoped sidebar/appbar sources; direct-consumer symbol search found no other consumer of the retired API. All three existing leaf/main/nested-group Pin button blocks and both component/service pin-handler blocks are byte-identical to their pre-edit contents. Dictionary/global-style hashes match exactly the baseline plus approved removals, preserving unrelated dirty edits. Four other sidebar source files equal the baseline plus specified edits exactly; sidebar SCSS matches those edits after LF/CRLF normalization (the changed padding line uses CRLF). Full scoped diff reviewed; git diff --check passes with existing line-ending notices. Remaining sidebarMenu key sets match en/ar. No canonical reference, appbar component, catalog IDs, routes, pin persistence or business logic was changed.

Owner checks absence of Favourites/star in normal/search/recent views, leaf/main/nested-group pin/unpin, persistence/manager and user switching, Recent collapse/clear, minimized-sidebar hover, mobile touch, keyboard focus, Arabic RTL and dark theme. Suggested frontend commit: `refactor(sidebar): remove favourites and retain appbar pins`. Runtime/build/browser verification remains pending per AGENTS.md; no Add-Migration required. Prohibited commands were not run.

## Owner-reported Pin inset correction — 2026-10-03

Owner reports Pin extending outside the selected item's background and requests moving it slightly inward. This later instruction supersedes the previous 6px logical-end placement in the Frozen removal plan. Tier S: one CSS positioning rule, no new contract/artifact or reusable book/skill rule.

| Concern | Book/reference evidence | Approved correction |
|---|---|---|
| Leaf button containment | UI24/25; existing sidebar sigma-menu-leaf sibling link/button, 24px Pin absolutely positioned within the leaf at logical end6px; Metronic menu/base owns link background and item padding | Increase logical-end inset6 → 16px; link trailing reservation36 → 46px preserves the existing text gap |
| Interaction and group pins | UI27; button aria-label/pressed/focus, toggleAppbar and static group variant | Keep their source and 24px button size; no markup, handlers, theme or group-layout change |

Source owner: F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/_metronic/layout/components/sidebar/sidebar-menu/sidebar-menu.component.scss. Selected shell-navigation shape; Master5 conformance and checked Phase05 packet apply, with Phase6 scoped source reconciliation. Phases1–4 skipped: no API/grid/editor/action contract change. All eight recipe drift checks pass. No screenshot supplied; rendered overflow is owner's explicit observation, exact CSS correction is a minimal source-supported reviewer choice. Source verification of the two changes pending; owner visual check remains pending. No backend, AutoMapper, calculation, migration, translation or Pin persistence change. No subagents for this one coupled CSS fix. Suggested commit: `fix(sidebar): inset pin within the active item background`. No prohibited commands run.

Final source reconciliation: full scoped SCSS diff reviewed; current file equals the captured current baseline plus exactly the two approved value replacements. git diff --check passes (existing LF/CRLF notice only). Logical inset/padding preserve RTL mirroring; group buttons retain position:static, their margins and transform:none. Source conformance matches both rows above. Owner checks selected/pinned leaf containment and text spacing in English/Arabic, light/dark, main/nested/recent/search entries and minimized/touch views. Build/runtime/browser acceptance remains pending; no build/test/lint/browser/database/migration/commit/push/deploy action ran.
