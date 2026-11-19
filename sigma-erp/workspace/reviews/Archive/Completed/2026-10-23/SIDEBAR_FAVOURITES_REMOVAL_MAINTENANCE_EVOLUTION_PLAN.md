| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Sidebar favourites removal — 2026-10-03

Owner: "عايز الغى قائمة favourite من sidebar هسيب pin بس". Remove the sidebar Favourites section and star toggle, retain the existing appbar Pin action. This expressly supersedes the earlier sidebar/appbar plans' decision to retain favourites. Shape: authenticated shell navigation, not CRUD. Applicable owners: Master 1/5, UI1/23/24/25/27, checked PHASE-05 integration packet and sigma-screen-refactor skill. No screenshot, missing business decision or API handoff.

| Owner | Classification | Frozen decision |
|---|---|---|
| Sidebar template/component | Remove | Favourites section, computed items and star handlers; All Modules divider depends on Recent only |
| Sidebar style/global minimize rule | Remove/Extend | Delete star-only styles; reserve one 36px trailing area and move remaining 24px Pin to logical end 6px |
| SidebarShortcutsService | Remove/Keep | Remove favourites signal/read/write/API; retain recent and appbar storage/IDs/order; load collapse state for Recent only |
| Menu catalog | Keep | Same routes/IDs; correct comment referring to retired favourites |
| en/ar sidebarMenu keys | Remove | Three dead favourite-only keys, no change to appbar labels |
| Appbar shortcuts and other navigation | Keep | Existing leaf/group pin handlers, manager, navigation, search, keyboard and minimized-sidebar behavior |

Remove the feature in place; merely hiding the section would leave a dead star workflow, while migrating stars into Pins would silently alter the owner's saved choices. Existing legacy `.favorites` browser data is left dormant: no data deletion, migration or automatic conversion. Appbar IDs remain stored separately and are unaffected. No backend/schema changes or migration.

## Conformance evidence before edits

| Concern | Book | Inspected producer/consumer | Frozen comparison |
|---|---|---|---|
| Navigation ownership | UI1; PHASE05 | SidebarMenuComponent + root SidebarShortcutsService + MenuCatalogService; AppbarShortcutsComponent consumes appbar-only APIs | Remove only the single-consumer favourites APIs; preserve pin methods and catalog IDs |
| Pin geometry/theme/RTL | UI24/25 | existing sigma-menu-appbar-pin: 24px, logical end32px; link trailing padding62px | Same icon/tokens/size/focus; logical end6px, trailing padding36px for one button |
| Keyboard/accessibility | UI27 | existing pin aria-label/pressed/title, toggleAppbar preventDefault/stopPropagation, focus-visible, hover-none rule | Retain exact pin behavior and labels; remove star-only DOM/styles |
| Translation consumers | UI23 | sidebarMenu favorites/pin/unpin referenced only by removed sidebar star/section; appbarShortcuts add/remove labels independent | Delete only the three dead keys in each dictionary |

Both sidebar and appbar source owners were read; no sibling-screen appearance is copied. Source comparison does not imply browser acceptance. This is one small coupled workstream, so no subagents. Final source changes/reconciliation and owner checks belong in SIDEBAR_FAVOURITES_REMOVAL_FEATURE_REVIEW.md. Existing dirty translation/global-style edits must remain.
