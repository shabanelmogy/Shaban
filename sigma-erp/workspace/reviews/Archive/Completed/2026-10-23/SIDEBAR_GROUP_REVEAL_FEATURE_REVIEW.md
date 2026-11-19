# Sidebar group reveal

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

## Scope and frozen decision — 2026-10-14

Owner request: opening a sidebar menu should move it upward so its contents are visible. Apply generally through the authenticated-shell sidebar disclosure owner (UI1), not a CRUD screen. Backend shape: Not Applicable.

Source: `SiGmaAngularFrontEnd/src/app/_metronic/layout/components/sidebar/sidebar-menu/sidebar-menu.component.{ts,html}`. Both group levels use `groupHeader` and `toggleGroup`; the existing `#kt_app_sidebar_menu_scroll` is the menu's single scroll owner. No scroll follows explicit opening currently. Evidence is the written request and inspected source; no screenshots supplied or inferred business requirements.

Frozen behavior: after Angular renders an explicitly opened group and closes siblings, align its header with the top of the existing menu scroll viewport, limited by native available scroll range. Long groups remain internally scrollable. Both pointer and native Enter/Space use the same path. Closing, Pin, route defaults and search defaults do not initiate this reveal. Keep focus, page position, horizontal scroll, routes, disclosure defaults, storage, drawer, desktop minimize and theme/RTL geometry. No smooth motion or arbitrary delay is required.

Existing changes: sidebar logo/component/menu-data and shared-screen-guidance already contain owner/other-task changes; preserve them. Menu component TS/HTML were clean before this task.

## Conformance before implementation

| Concern | Book | Reference / symbol | Shared owner | Target contract |
|---|---|---|---|---|
| Disclosure | UI1, Authenticated-shell sidebar disclosure | SidebarMenuComponent.isGroupOpen/toggleGroup; groupHeader | SidebarMenuComponent | Keep WeakMap overrides, sibling closure, route highlighting and native aria-expanded controls |
| Scroll boundary | UI1; UI27 | sidebar-menu.component.html, kt_app_sidebar_menu_scroll; sidebar.component.html | Existing menu viewport | Change this viewport's scrollTop only after rendered disclosure; no scrollIntoView or focus call |
| General adoption | Master5 | Both groupHeader outlets | Same shared owner | Root and nested groups inherit behavior without flags or duplicate handlers |
| Guidance | Master7 | SHARED_SCREEN_GUIDANCE → GuideReaderComponent.sharedScreenGuidance | Existing UserGuide reader | Add EN/AR navigation guidance to existing common overview |
| Compatibility | UI1, UI25, UI29 | tsconfig.json es2018/dom; existing desktop 992px boundary | Existing shell / styles | No new framework API, CSS or responsive/theme/direction branches |

Phases: bounded discovery and contract freeze, Phase5 event/scroll integration, scoped final reconciliation. Grid/editor/domain-action/backend phases are Not Applicable. Packets passed generator -Check (all eight IDs); phase-05-integration-runtime applies. No broad ambiguous maintenance plan is required for this bounded behavior.

No API/DTO, money/VAT, mapping, permission, persistence or migration changes. No new translation keys: authored guide text is bilingual. Subagents are not used because this is one small sequential shared-owner fix.

## Final reconciliation

Implemented the frozen behavior in SidebarMenuComponent: `toggleGroup` captures the clicked common header only on opening, `ngAfterViewChecked` consumes it once after DOM updates, checks containment/current show, measures its offset within `#menuScroll`, then clamps and writes only viewport.scrollTop. Search invalidates pending work. The template adds only the viewport reference. No asynchronous callback or listener requiring cleanup was introduced; installed Angular core declares AfterViewChecked. No new control imports or translation keys.

All conformance rows above reconcile to final source. The same groupHeader handler is instantiated for both levels; no duplicate helper or per-feature adoption is required. Existing routing, root/child disclosure states, sibling loops, pins and Metronic attributes remain. Responsive matrix: below992px retains mobile drawer ownership; at/above992px retains existing minimized/expanded widths; all intermediate widths/short heights use measured viewport clientHeight and native scroll limits. No CSS or direction/theme fork was added. Visual acceptance is pending in every interval.

Changed application files: sidebar-menu.component.ts, sidebar-menu.component.html and UserGuide/content/shared-screen-guidance.ts (one new bilingual entry; pre-existing date/minimize guidance retained). Common guidance is consumed by GuideReaderComponent.sharedScreenGuidance in the existing module overviews, including /UserGuide/administration and its existing administration sidebar guide entry. Topic: explicit root/nested opening, pointer/Enter/Space, long-content scrolling, closing/Pin behavior and native range limits.

Reviewed complete scoped application diff separately in the frontend repository and documentation diff in `F:/My Work/Shaban Documents/Shaban`; git diff --check passed. Scoped merge-marker scan is clear. UI1, skill section6 plus revision row and documentation changelog synchronized. Generator regenerated all eight packets and -Check passed; this task changes UI1 provenance for dependent packets, with unchanged procedure/reference roles. Existing backend/date provenance and changelog changes from other tasks were preserved. Semantic review: Phase5 still owns event/scroll wiring, canonical UI1 supplies sidebar shape; CRUD reference roles remain unrelated and no generic grid/editor workflow is imposed.

Owner runtime/visual checks: open a low main group and a nested group; switch siblings above it; close and Pin without automatic reveal; search/clear then open; repeat with Enter/Space; long groups and final groups clamp to available scroll; preserve page position and focus at short heights, below/at/above992px, mobile drawer, minimized/expanded, LTR/RTL and light/dark. No unresolved contract decision; compilation and actual browser layout/scroll timing remain owner verification risks.

Prohibited commands are not authorized. Build, tests, lint, browser/runtime, database, migrations, commit/push and deployment remain unrun. Suggested frontend commit: `fix(sidebar): reveal opened groups in the menu viewport`.
