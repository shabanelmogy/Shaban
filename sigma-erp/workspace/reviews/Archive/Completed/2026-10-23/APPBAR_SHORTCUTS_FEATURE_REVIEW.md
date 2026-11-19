# Personal appbar shortcuts

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-02 |

## Manifest and frozen decisions

User-authorized addition: pin a sidebar group or page as a personal appbar shortcut and organize choices. Frozen handoff: `APPBAR_SHORTCUTS_MAINTENANCE_EVOLUTION_PLAN.md`. Shape: shared shell navigation plus immediate preference-management modal; backend/entity/editor/API contracts are not applicable. Canonical guides: Master 1/3/4/7, UI 13/23–27/29/30 and project skill. Recipe check reports stale generated packets; canonical source used. No screenshots supplied. Existing seven shell-colour files are prior user-authorized changes from this conversation and preserved.

| Decision | Source evidence / implementation |
|---|---|
| Menu owner | Exact sidebar literal extracted into SIDEBAR_MENU_ITEMS; shared catalog prepares icons and IDs; sidebar and appbar consume it |
| Quick choices | Individual entries are links; whole group exposes its original descendants in a dropdown |
| User preferences | Extend existing SidebarShortcutsService; separate appbar list under per-user browser namespace; no favorites migration |
| ID/route rules | Internal source-backed links only, normalized route ID; group ancestry title keys, deduplicated IDs |
| Manage UI | Shared EditorDialogComponent with immediate changes, Close/escape, no Save or dirty draft |
| Organization | Ordered choices, controls move earlier/later and remove; up to three direct choices from 1600px, one shortcuts menu below that threshold, remaining choices in overflow |
| Placement amendment | User requested the other side: moved the sole shortcuts instance to HeaderComponent's existing growing slot opposite navbar actions; logical me-3 spacing mirrors with RTL |
| Translation | New appbarShortcuts block in both en/ar, double-brace parameters |
| Style/focus | Existing Sigma tokens, logical alignment, shared modal and library dropdowns; accessible action labels |
| Auth/authorization | Convenience, not a security boundary; existing authentication unchanged; no authorization candidate endpoint introduced |
| Backend/DTO/AutoMapper/calculations | Not applicable, no source changes |
| Migration | Not required; no persistence schema changes |

## Ownership and phases

Root owns menu data extraction, sidebar integration, translations, global minimized-pin rule, artifacts and final review. Reused bounded workers: `topbar_menus` owns catalog/interface/preferences service; `topbar_styles` owns appbar component and Navbar HTML/LayoutModule integration. Inherited model because mapped Terra unavailable. Parallel file ownership shortens work without overlap. All earlier theme changes are preserved.

Maintenance planning and freeze, Phase 0, source UI implementation, Phase 5 integration and Phase 6 reconciliation apply. Domain/API/grid/write DTO/domain action phases skipped; there is no business-data mutation. No new route or speculative tsconfig entry. Learning protocol: apply existing rules; no new reusable canonical policy needed.

Both bounded workers integrated successfully against the frozen catalog/preference APIs. No file ownership overlap or unresolved integration requirement remains. Delegation allowed catalog/storage and presentation work to progress together while root preserved the sidebar tree and reviewed integration. Screenshot evidence: not supplied; rendered appearance remains Uncertain pending owner verification. No Missing or Conflicting business requirement remains. No grid columns/ListVM apply to shell preferences.

## Scoped files

Frontend repository: `F:/My Work/Sigma/SiGmaAngularFrontEnd`.

- `sidebar/sidebar-menu/sidebar-menu-data.ts` (new exact shared data)
- `sidebar/sidebar-menu/menu-catalog.service.ts`, `appbar-shortcut-entry.ts` (new)
- `sidebar/sidebar-menu/sidebar-shortcuts.service.ts`
- `sidebar/sidebar-menu/sidebar-menu.component.ts/html/scss`
- `header/appbar-shortcuts/appbar-shortcuts.component.ts/html/scss` (new)
- `header/header.component.html` (opposite-side placement; removed the earlier insertion in `header/navbar/navbar.component.html`)
- `_metronic/layout/layout.module.ts`
- `modules/i18n/vocabs/en.ts`, `ar.ts`
- `src/styles.scss` (minimized shortcut toggle only; earlier colours retained)

Component paths above are under `src/app/_metronic/layout/components` except the explicitly stated module/translations/global stylesheet.

## Completed source reconciliation

- Reviewed the scoped frontend diff and all new catalog/data/component files. Existing shell-colour changes remain intact.
- Compared the extracted menu literal with HEAD: routes, translated title keys, hierarchy and ordering match exactly.
- Verified catalog IDs and routes, filtered-group resolution to the complete original group, duplicate/stale preference filtering, boundary-safe reordering, per-user loading and storage failure handling against the existing authentication model.
- Checked standalone imports, navbar/module wiring, shared dialog inputs/outputs and ng-bootstrap dropdown usage against related local source. A single responsive overflow collection avoids hidden duplicate keyboard items.
- Reviewed the placement amendment: HeaderComponent and NavbarComponent share LayoutModule; the standalone import remains valid and there is exactly one shortcuts instance. The growing header slot separates shortcuts from the navbar action group. Root handled this small sequential move without additional delegation.
- Verified all 17 referenced shortcut translation keys exist in both Arabic and English. Logical CSS properties and existing Sigma theme tokens cover the new UI.
- Verified modal search focus, removal focus recovery, close/Escape focus return and sidebar keyboard-shortcut guard in source. Runtime focus/placement remains pending.
- New and modified frontend files contain no merge markers or trailing whitespace; `git diff --check` passed.
- No backend, DTO, AutoMapper or domain-calculation change. No migration required; owner does not need `Add-Migration` for this feature.

Generated recipe packets still require owner regeneration; canonical guides were used directly. Build/runtime/browser verification is pending because AGENTS.md prohibits running those actions without an explicit current-task request.

## Owner verification

Build then check:

1. Pin a leaf, a main group and a nested group from sidebar; pinning must not navigate or collapse the group. Repeat through manager; no duplicate pin.
2. Group pinned during filtered sidebar search still opens its complete original menu. Existing favorites/recent remain.
3. Open direct/group/overflow choices, navigate a route, use keyboard navigation/outside click/Escape; focus returns correctly.
4. Search manager by translated group/page/path; add/remove/reorder, close/refresh/reopen and verify order. No blank or lost preference list when storage is blocked.
5. Switch users and verify each sees only their own saved shortcuts; stale IDs ignored. Choices are local to this browser, no cloud synchronization claim.
6. Verify English/Arabic, light/dark, mobile/laptop/desktop, minimized sidebar, long labels and many shortcuts, with no header collision or page scroll. Shortcuts must sit on the opposite side from navbar actions and mirror with RTL.

Possible risks: compilation and rendered dropdown placement/height/focus have not been verified; existing explicit compiler-root policy is preserved. Modern palette CSS is already used by the app. Build/tests/lint/browser/database/migrations/commits/pushes/deployment were not run.

Suggested frontend commit: `feat(appbar): add personal page and menu shortcuts`.

## Later owner amendment — remove sidebar Favourites, 2026-10-03

Owner: "عايز الغى قائمة favourite من sidebar هسيب pin بس". This explicitly supersedes the earlier decision to retain sidebar Favourites. The section, leaf star toggles, favourite-only component/service APIs/styles and three en/ar keys are removed. Existing appbar Pin buttons, handlers, ordered per-user appbar storage, catalog routes/IDs, manager, search and Recently Visited retain their owners. The remaining Pin occupies the one-button logical-end space; minimized/touch/keyboard/theme behavior remains. Legacy browser favourites are left dormant, with no deletion/conversion to appbar pins. Exact implementation and source reconciliation: F:/My Work/Sigma/reviews/Archive/Completed/2026-10-23/SIDEBAR_FAVOURITES_REMOVAL_FEATURE_REVIEW.md. No backend or migration change. Runtime/browser acceptance pending; previous content remains historical evidence.

## Sidebar pin scrollbar clearance — 2026-10-23

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Scope / tier | S: existing shared sidebar pin visibility beside the menu scrollbar |
| Evidence | Owner reports intermittent scrollbar overlap. Source uses `overflow: auto`, no stable gutter and 8px inline padding on `.sigma-menu-scroll`; actual overlay placement remains unverified. |
| Shape / reference | UI1 authenticated-shell sidebar exception: `SidebarMenuComponent` and `LayoutComponent`; no CRUD shape or backend pattern applies. |
| Decision before edits | Reserve the native scrollbar gutter; use vertical-only menu scrolling and 16px logical-end viewport padding, preserving 8px start padding, 8px row padding, 14px nested indentation, the third-level pin's 8px margin and the trailing chevron. Let the host/viewport shrink in inline size. |
| Boundaries | Keep catalog, stored pin identities, handlers, routes, disclosure, keyboard and pin visibility policy. No domain/API/DTO/AutoMapper/calculation/schema change; no migration. |
| Existing changes | Component TS, menu catalog/interface, shared guide, auth, vocabulary and README already dirty; preserve them. Only sidebar SCSS and an additional bilingual guide paragraph are application changes in this amendment. |
| Phases | Focused discovery, UI1 shell correction, scoped reconciliation; domain/read-grid/editor/action phases do not apply. No separate freeze file under Master1 tier S. |

| Concern | Book block | Actual reference / shared owner | Target conformance |
|---|---|---|---|
| Scroll clearance | UI1 shell/disclosure; Master5 | `LayoutComponent` bounded aside/drawer → `SidebarMenuComponent` `.sigma-menu-scroll` | Keep one vertical scroll owner, reserve stable gutter and logical-end clearance even with overlay scrollbars. |
| Row / pin | UI1 shell row values; UI25/27 | Existing `.sigma-panel-item`, `.sigma-menu-appbar-pin`, custom PanelMenu item template; installed PrimeNG21/PrimeUIX PanelMenu wrappers inspected | Preserve row spacing, pin size/order and independent focus/click/Enter/Space behavior; no template or publisher change. |
| Guidance | Master7 | `SHARED_SCREEN_GUIDANCE` → existing guide reader | Add bilingual instructions to pin a group/page while scrolling; retain module guide registration. |

Responsive source contract: at >=992px the 280px desktop aside consumes these rules; below992px the same component in the bounded `min(320px,90vw)` drawer consumes them. Intermediate widths share the same logical spacing; labels already truncate inside a shrinking link. English/Arabic direction and existing theme tokens remain. Visual/runtime acceptance at narrow widths, nested/long labels and both scrollbar modes is pending. No screenshots supplied; no missing business decision. One small sequential styling workstream does not meet the delegation gate; no subagents used.
