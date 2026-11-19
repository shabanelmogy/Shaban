# Recently visited dropdown in TopBar — 2026-10-08

| Field | Value |
|---|---|
| Status | Implemented — source-only reconciliation complete |
| Owner verification pending | yes |
| Request | Move Recently visited from Sidebar into a TopBar dropdown |
| Shape | Authenticated-shell navigation, extending existing AppbarShortcutsComponent |
| Authority | AGENTS.md; sigma-screen-refactor; Master4/5/7; UI1/23/24/25/27/29/30 |
| Packets | Check run: Phase06 current; PLAN00 and Phase00–05 stale. Canonical blocks govern; regeneration/semantic review pending |

## Discovery, scope and frozen decisions

The actual Header renders AppbarShortcutsComponent beside NavbarComponent; the older TopbarComponent is not this active header placement. AppbarShortcuts already imports RouterModule, TranslateModule, NgbDropdownModule and StateMessageComponent. Its existing dropdown is the presentation/library owner approved in APPBAR_SHORTCUTS_MAINTENANCE_EVOLUTION_PLAN. SidebarMenuComponent currently presents the recent section and records visits after NavigationEnd.

Keep SidebarShortcutsService's MAX_RECENT5, per-user/browser storage namespace, recent ordering/deduplication and clearRecent behavior. Keep SidebarMenu's existing tracking of navigable menu leaf routes; remove its recent presentation, obsolete display adapters and section styles only. Service collapsed preferences remain compatible stored data, without active UI; no storage migration/cleanup. Preserve sidebar search, disclosure, route highlighting and appbar pins.

Extend AppbarShortcutsComponent with a recent dropdown visible at all sizes, including an empty state. Resolve saved normalized route keys through existing MenuCatalogService link entries; hide stale keys. Use existing original routes, translated titles, Bootstrap icons and breadcrumb context. Catalog identity is canonical for duplicate destinations; no arbitrary external route. Opening a link closes the dropdown. Clear recent empties only visit history and closes the dropdown; it does not remove appbar pins. No confirmation is needed for this existing personal-history control.

Place recent before the existing header shortcuts, using the existing appbar button/menu/link classes and NgbDropdown keyboard/outside/Escape behavior. Narrow sizes show a labelled history icon instead of long text. Keep dropdown max-width/row scroll tokens and inherited dark/RTL behavior; no new component, feature route, provider or tsconfig entry.

Add appbarShortcuts.recent/clearRecent/recentEmpty EN/AR keys. Sidebar keys remain compatible but are no longer read for the recent display. Update the existing in-app UserGuide overview with one generic navigation instruction (`userGuide.navigationHint`, EN/AR), describing last five visits, opening a page and clearing history. Shell navigation is shared by existing guides rather than an additional routed screen, so no duplicate guide/module/sidebar entry is created. No business content changes.

## Pre-edit reference conformance

| Concern | Book | Actual reference/owner and target contract |
|---|---|---|
| Placement/dropdown | UI1/27; existing frozen appbar plan | Header template's app-appbar-shortcuts; NgbDropdownModule; reuse existing dropdown placement/container behavior, native toggle/item controls |
| Button/menu/theme | UI24/25 | appbar-shortcuts.component.scss: 40px/11px token-based buttons; appbar-shortcut-menu width min350/viewport24 and bounded appbar-menu-scroll; reuse same classes, add only recent structural/narrow rules |
| Records/navigation | Master5 | SidebarShortcutsService.recent -> catalog.get(link:key) -> RouterLink; keep service and original routes |
| Translation/state | UI23/22 | Existing TranslateModule and StateMessageComponent; matching EN/AR keys, no API/loading stage |
| Guide | Master7 | Existing UserGuide FormSection overview/user-guide-hint presentation; generic navigation paragraph reused by existing guides |

Phases0/1 source discovery/freeze, Phase5 shell integration, Phase6 source reconciliation. No financial/write/list/editor/API/domain-action changes. No backend/mapping/calculation/schema changes or migration. Existing sidebar-menu-data/vocabs/UserGuide modifications are user/earlier task work and preserved. One tightly coupled move; no agents needed. Root owns all scoped files.

Source checks planned: parse changed TS and Angular templates; import/member/translation parity; verify recent UI removed once and new toggle appears once; check existing recording/service unchanged; full scoped diff/whitespace. No builds/tests/lint/browser/runtime/database/migrations/commits/push/deploy/Graphify/Sigma MCP. Owner checks keyboard/outside/Escape/focus, navigation/clear/refresh/user-switch, empty/stale records, narrow/RTL/theme/header wrapping. Suggested commit: `feat(layout): move recent visits into topbar dropdown`.

## Final implementation and reconciliation

Implemented the frozen presentation move in nine existing source files:

- `src/app/_metronic/layout/components/header/appbar-shortcuts/appbar-shortcuts.component.ts`: derived recent catalog entries retain stored order and exclude unknown destinations.
- The same component's HTML: one history dropdown before existing shortcuts, translated title/count, original RouterLink destinations with icon/title/breadcrumb, shared empty state, and a disabled clear action for an empty list. Clearing closes the menu and restores focus to its toggle.
- The same component's SCSS: existing menu/button/row theme tokens retained; only recent heading alignment and responsive history-button sizing added. Narrow view hides text with accessible label/title retained.
- `src/app/_metronic/layout/components/sidebar/sidebar-menu/sidebar-menu.component.{ts,html,scss}`: removed recent presentation/adapters and its obsolete section styles; retained search, disclosure, route highlighting, appbar pins and navigation recording.
- `src/app/modules/i18n/vocabs/{en,ar}.ts`: three matching appbar keys and the generic `userGuide.navigationHint` paragraph added; existing earlier-task translation changes preserved.
- `src/app/modules/UserGuide/components/reader/guide-reader.component.html`: shared overview displays the new translated navigation instruction; existing guide content, routing and print behavior retained.

Final source evidence:

| Check | Result |
|---|---|
| TS syntax via TypeScript source parser | Four changed TS sources passed; no compiler/build/type-check executed |
| Angular template syntax via parseTemplate | Appbar, Sidebar and Guide reader templates passed |
| Imports via existing tsconfig module-resolution options | All 25 Appbar/Sidebar imports resolve; no configuration/provider/import changes required |
| Translation block parity | EN/AR appbarShortcuts and userGuide each have 22 matching top-level keys without duplicates; new key values and reader usage inspected |
| Navigation/store preservation | Sidebar ngOnInit/prepareMenu/recordVisit/filterMenu/toggleAppbar/toggleGroup match HEAD after line-ending normalization; service and catalog source diff empty |
| Presentation ownership | Exactly one recent dropdown; no recentItems/sigma-menu-recent/sigma-menu-section references in Sidebar component files |
| Guide gate | One generic navigation paragraph in the existing shared reader, with matching EN/AR text describing last five visits and user/browser persistence |
| Scoped diff review | Six shell file diffs reviewed in full; owned translation additions and guide paragraph reviewed separately from prior uncommitted work |
| Whitespace | Scoped git diff --check passed; guide reader trailing-whitespace check passed. Git emitted only ordinary LF/CRLF notices |

All applicable confirmed source changes are complete. No new reusable abstraction or canonical guidance was established; the existing approved Appbar dropdown and guide reader remain the owners. No financial/domain/API/backend/schema effects.

Owner acceptance remains pending for compilation and interaction/visual checks: history ordering/navigation/refresh, clear preserving appbar pins, per-user history, empty/stale records, keyboard/Escape/outside/focus, narrow header wrapping, AR/RTL and light/dark presentation. Build/runtime/browser checks were not run under the standing source-only boundary. Stale packets still require owner regeneration and semantic review; generated files were not edited.
