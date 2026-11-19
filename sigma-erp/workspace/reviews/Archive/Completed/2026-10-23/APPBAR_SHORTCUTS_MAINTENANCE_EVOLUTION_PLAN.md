# Appbar shortcuts

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-02 |

## Scope, inventory and evidence

User requests a button adding sidebar entries to appbar as personal quick choices, for whole menus or single entries, with good organization. Existing SidebarShortcutsService persists sidebar favorites/recent/collapsed sections per user in localStorage; favorites cover links only. SidebarMenuComponent embeds the navigation tree and normalizes icons. NavbarComponent has branch/language/theme/notification/account actions. LayoutModule imports standalone sidebar; EditorDialogComponent is the approved modal owner. No backend shortcut persistence/API exists in the inspected path.

UI shape: shared shell navigation and a view-mode preference-management dialog, not CRUD. Canonical owners: Master 1/3/4/7; UI 13, 23–27, 29/30, plus project skill. Recipe check reports generated packet drift; canonical blocks govern this work. Current dirty seven shell files belong to earlier requests in this conversation; preserve all.

## Impact and options

| Area | Classification | Decision |
|---|---|---|
| Sidebar tree | Refactor | Extract exact existing tree into shared catalog, preserve all routes/labels/order |
| Sidebar favorites/recent | Keep | Preserve existing semantics/storage, independent of appbar selections |
| Personal preferences | Extend | Extend existing SidebarShortcutsService with appbar IDs and bounded reordering |
| Appbar | Extend | Standalone shortcuts component in the header's opposite side from existing navbar actions; direct links, group menus, overflow and manage button |
| Sidebar | Extend | Add separate pin-to-appbar button on links and groups; whole original group pinned even when search filters children |
| Backend/data/permissions | Keep | No new endpoints, schema or authorization; convenience only |
| Localization/theme | Extend | Matching en/ar keys, global Sigma tokens, logical positioning, keyboard controls |

Rejected: copying menu tree into appbar (drift), conflating sidebar favorites with appbar pins (changes existing choices), inventing a new backend preference API (no source contract). Select browser-local per-user preferences using the current owner; device sync is outside this request.

## Frozen contract

- Shared catalog `sidebar-menu/menu-catalog.service.ts` exposes `tree: MenuItem[]`, `entries: AppbarShortcutEntry[]`, `get(id): AppbarShortcutEntry | undefined`, `idFor(item: MenuItem): string | undefined`.
- Data `SIDEBAR_MENU_ITEMS` in `sidebar-menu/sidebar-menu-data.ts` is exact extracted existing literal; icon preparation remains compatible. Shared catalog normalizes icons with existing menu-icons utilities.
- `AppbarShortcutEntry` in its own `sidebar-menu/appbar-shortcut-entry.ts`: `id: string`, `title: string`, `icon: string`, `link?: string`, `kind: 'group' | 'link'`, `breadcrumbs: string[]`, `links: MenuItem[]` (flattened navigable descendants of groups; empty for leaf). IDs are `link:<normalized-route>` or `group:<ancestor title keys joined by />`; no invented routes.
- Catalog includes navigable leaves and groups with descendants, deduplicated by ID; group label and translated breadcrumb distinguish same-name groups. Group shortcut opens descendant links with breadcrumb context. Exact leaf route identity comes from existing sidebar tree.
- SidebarShortcutsService adds readonly `appbar` signal of string IDs; `isAppbarPinned(id)`, `toggleAppbar(id)`, `removeAppbar(id)`, `moveAppbar(id, direction: -1 | 1)`. Persist ordered deduplicated validated strings separately under current per-user namespace, never overwrite favorites. No invalid route navigation; stale IDs hidden in component. Storage failure keeps session preferences usable. Load is idempotent for same user; user changes reload preferences. Existing sidebar load continues to work.
- New standalone `app-appbar-shortcuts` uses catalog + service, RouterModule, TranslateModule, ng-bootstrap dropdown, shared EditorDialogComponent and existing shared empty-state component as appropriate. Show up to three direct desktop shortcuts, then overflow; compact widths use one shortcuts dropdown plus manage control. Groups open a dropdown; leaf clicks navigate via routerLink. Outside/Escape keyboard closing uses existing dropdown library behavior, no hand-rolled backdrop.
- Manage button opens shared view-mode dialog with primaryActionVisible=false, contentPadded=true, explicit close/escape handlers and translated labels; selections apply immediately (no unsaved draft). Search catalog with normalizeSearchText and translated label/breadcrumb. Pinned list has Remove/Move up/Move down controls; all choices show group/link type and toggle button. Hide stale IDs; duplicate addition impossible. No arbitrary maximum or loss of saved ordering.
- Sidebar exposes a distinct appbar pin button (separate from favorite star) for leaf and group headings, with translated label/pressed state; stop event propagation so pinning does not navigate/collapse. Filtered group resolves to full original catalog identity.
- Root integrates shortcuts into the header's growing start-side slot opposite navbar actions, with logical spacing that mirrors in RTL, and imports the standalone component in LayoutModule; no routes or pre-emptive tsconfig files entries. Existing explicit entries amended only if an obsolete moved entry exists.
- Storage scope is current user/browser using existing auth identity; no cloud/account syncing claim, no authorization claim, no migrations.

## Implementation and verification

Placement amendment (2026-10-02): user explicitly requested the other side. Freeze moving the existing component instance from NavbarComponent into HeaderComponent's existing flex-grow spacer, preserving dropdowns, preferences and controls. Root owns this small sequential adjustment; no additional worker needed. Both header and navbar are declared by LayoutModule, so the existing standalone import covers the move. Owner should check opposite-side alignment in English/Arabic and compact widths.

Root extracts menu data, owns sidebar TS/HTML/SCSS, en/ar translations, artifacts and integration. Worker A owns catalog service, AppbarShortcutEntry and SidebarShortcutsService. Worker B owns only new appbar shortcuts component files, Navbar HTML insertion and LayoutModule import; consumes frozen APIs. No overlapping file ownership; coordinate root/worker before mutation. Existing navbar theme changes stay.

Phases 0, frozen contracts, preference UI implementation, 5 integration and 6 reconciliation apply; no domain/API/grid/write DTO/state-transition phases. Source-only verification: complete scoped diff, exact extracted tree comparison, valid route-backed IDs, ordering bounds, no duplicate pins, user loading/storage resilience, matching translation keys, shared modal/dropdown behavior and token ownership. Owner build/runtime/browser checks: pin leaf/group from sidebar/manager, navigate descendants, search, remove/reorder/refresh, user switching, blocked storage, Arabic/dark/mobile/overflow and keyboard focus/close. No build/tests/lint/browser/database/migrations/commit/push/deploy run. Open business decisions: none; low-risk source-supported presentation/storage choices frozen within user-authorized scope.

## Later owner amendment — remove sidebar Favourites, 2026-10-03

Owner: "عايز الغى قائمة favourite من sidebar هسيب pin بس". This explicitly supersedes the earlier decision to retain sidebar Favourites. The section, leaf star toggles, favourite-only component/service APIs/styles and three en/ar keys are removed. Existing appbar Pin buttons, handlers, ordered per-user appbar storage, catalog routes/IDs, manager, search and Recently Visited retain their owners. The remaining Pin occupies the one-button logical-end space; minimized/touch/keyboard/theme behavior remains. Legacy browser favourites are left dormant, with no deletion/conversion to appbar pins. Exact implementation and source reconciliation: F:/My Work/Sigma/reviews/Archive/Completed/2026-10-23/SIDEBAR_FAVOURITES_REMOVAL_FEATURE_REVIEW.md. No backend or migration change. Runtime/browser acceptance pending; previous content remains historical evidence.
