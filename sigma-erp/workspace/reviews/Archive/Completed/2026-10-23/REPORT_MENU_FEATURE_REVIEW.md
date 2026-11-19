# Reports menu initial disclosure

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-23 |

Owner requests the Reports navigation group to start closed. Scope: one sidebar disclosure rule (tier S), source-only implementation; no backend/API/business contract. UI1 authenticated-shell sidebar disclosure and actual SidebarMenuComponent/PanelMenu/MenuCatalog are the approved owners; UI27/29 and Master5/7 govern keyboard/source evidence/guide handoff. Phase5 integration and scoped Phase6 reconciliation apply. Initial full recipe -Check passed. No screenshot supplied, no tests/build/browser/DB/commits authorized. No subagents: small sequential change.

Before edit, SidebarMenuComponent.toPanelItems expands any group with an active descendant. The Reports catalogue duplicates links such as /Account and /Vehicle, so unrelated primary menu destinations also open Reports. Catalogue expanded flags are group markers, not the current disclosure state (MenuItem comment); changing expanded:true to false there alone would not fix runtime behavior.

Frozen decision: add an optional typed autoExpandOnActive flag to the existing MenuItem adapter, defaulting to existing behavior. Set false only on sideMenu.reportsss. In the shared adapter, suppress active-route expansion for this group, while retaining manual publisher disclosure and search-driven expansion. Preserve route links/catalog and pin identities/active matching, other groups, accordion/keyboard, scroll/RTL/theme. This is explicitly Reports-scoped, not a global navigation policy. Existing shared bilingual user guide will explain the default and manual/search behavior. No material business/API decisions outstanding.

Implemented in existing frontend owners: `layout/components/sidebar/menu-item.ts`, `sidebar-menu/sidebar-menu-data.ts` and `sidebar-menu/sidebar-menu.component.ts`. Only Reports disables autoExpandOnActive. Adapter retains search OR route expansion, applying the new flag to the route arm only; no change to manual publisher commands. The catalogue spread preserves the flag through MenuCatalog.prepare and filtered clones. Other groups retain default true; active leaf matching, navigation/pin IDs and markup/CSS untouched. No backend/API, migration, mapping or calculation change.

Added one EN/AR paragraph to `UserGuide/content/shared-screen-guidance.ts` in the existing GuideReader overview, available through existing module guide routes/menu entries (for example `/UserGuide/customers`). Prior login/actions/numeric guidance edits are preserved. UI1 sidebar-disclosure block and skill rule/revision row updated together to record the owner-scoped exception; no new viewer or translation keys.

Reviewed the complete scoped source diff; four touched TS files parse with zero syntax diagnostics, scoped whitespace passes. Source comparisons confirm initially closed Reports even with an active duplicated /Account link, search-driven expansion retained and other active groups unchanged. These are source assertions, not executed interaction tests. No tests were added/run for this small reversible default-state change; no builds/lint/browser/database/migration/commit/push ran. Owner check: reload on dashboard and Account/Vehicle/report routes, open/close Reports manually, search and clear, verify active other groups, Pin, keyboard and RTL/themes. Scoped source completion does not establish visual/runtime acceptance.

Frontend commit suggestion (only the three sidebar files and this task's common-guide paragraph): `fix(sidebar): start the reports menu collapsed`.
Documentation commit suggestion: `docs(ui-book): record reports disclosure default`.

Packet maintenance: compared affected normalized procedures to current templates (unchanged), retained approved shared wiring/reference roles, regenerated PHASE-00/02/03/05 through Generate-SigmaRecipes.ps1 for the UI1 fingerprint change, then full -Check passed. Canonical/packet scoped whitespace check passed. No generated file directly edited; unrelated documentation changes preserved. Final conformance is source-only; backend and domain action phases are not applicable.
