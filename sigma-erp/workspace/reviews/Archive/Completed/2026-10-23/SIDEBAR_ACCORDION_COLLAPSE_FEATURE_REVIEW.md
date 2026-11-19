# Sidebar accordion collapse — feature review

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-03 |
| Request | Opening a sidebar group and selecting an entry leaves the group unable to close. |
| Scope / tier | S: one accordion state rule in the existing authenticated shell, both group levels. |
| Repository | F:/My Work/Sigma/SiGmaAngularFrontEnd |
| Shape | Shared shell navigation exception; no CRUD/editor/backend shape. |
| Authority | Master 1/4/5/7; UI 1/25/27/29/30; sigma-screen-refactor skill; Phase 5 and scoped Phase 6. |
| Packet drift check | Generate-SigmaRecipes.ps1 -Check: all packets OK before use. |

## Manifest and evidence

- User note is explicit workflow evidence; no screenshot/video supplied.
- Existing Staff, StaffBalancesSummary and en/ar working-tree changes are unrelated and preserved.
- Later concurrent Customer Statement/styles and documentation edits are also outside this task; preserved. Owner explicitly withdrew the two ReportType/color and row-spacing messages from this chat, so neither was applied here.
- Direct owners: SidebarMenuComponent, its template and SCSS; MenuComponent and menu/_base.scss are read-only behavior/style references.
- Existing shell imports SidebarComponent -> standalone SidebarMenuComponent. AuthGuard and routes, link/pin/recent/search/catalog/storage contracts stay unchanged.
- No API, persistence, accounting, permissions or destructive workflow decisions apply.
- UI backlog 30 has no entry for this accordion collapse defect.

## Confirmed finding

At both group levels, RouterLinkActive writes `here show`, Angular also binds `show` for search, and Metronic toggles the same class through animated submenu inline display. RouterLinkActive re-applies classes on NavigationEnd and descendant-link changes. Metronic checks parent `show`, while slideUp/slideDown return without the completion callback when the submenu is already hidden/visible. Thus route-driven class changes can disagree with the inline display and leave subsequent toggles stuck. This is source evidence; exact runtime reproduction remains owner-pending.

## Frozen scoped decision before implementation

Keep Metronic menu markup/palette and route-active styling; put sidebar accordion disclosure in SidebarMenuComponent only. Route activity supplies the initial open state, while an explicit user toggle overrides it. Opening a group closes its siblings at the same level, preserving the existing expand=false behavior. Search opens matching groups and rebuilds nodes when changed/cleared. Group trigger buttons support native Enter/Space and expose aria-expanded. Pin buttons stay separate and stop bubbling. Remove sidebar accordion data triggers so Metronic cannot also mutate this state. Do not modify the global MenuComponent or its other consumers.

This supersedes the route-owned `show` decision in APP_SHELL_SIDEBAR_FEATURE_REVIEW.md S1 for this bug fix. Leaf `active`, parent `here` and submenu `menu-active-bg` remain route-owned. No sidebar drawer/minimize change.

## Reference conformance before edits

| Concern | Owning block | Actual reference / symbol | Shared owner | Target / justified correction |
|---|---|---|---|---|
| Disclosure ownership | Master 5; UI 1 | MenuComponent._toggle/_showAccordion/_hideAccordion; DomHelpers.slide | SidebarMenuComponent | Replace competing sidebar writers with one Angular disclosure state; leave global engine untouched. |
| Sibling expansion | UI 1 | MenuComponent._hideAccordions; defaultMenuOptions.accordion.expand=false | SidebarMenuComponent | Preserve one open sibling at each group level. |
| Existing appearance | UI 25 | assets/sass/core/components/menu/_base.scss accordion show and arrow selectors; current sidebar SCSS | Existing Metronic/Sigma style owners | Keep menu-item/menu-accordion/menu-link/menu-arrow classes; only structural trigger layout/focus CSS. |
| Keyboard/pin isolation | UI 27 | SidebarMenuComponent.toggleAppbar; current section toggle buttons | SidebarMenuComponent | Native buttons, aria-expanded, translated existing label, separate pin stopPropagation. |
| Wiring / cleanup | UI 1/29; Phase 5 | layout.module.ts, app-routing.module.ts, existing takeUntilDestroyed | Existing shell / router | No route, import, provider or subscription changes. |

## Reconciliation

| Contract/path | Final source evidence | Status |
|---|---|---|
| Close/reopen active group | groupOpenStates records explicit true/false; isGroupOpen checks that before route/search fallback. RouterLinkActive now writes only here at both levels. | Confirmed — source-only |
| One disclosure writer | No sidebar data-kt-menu-trigger remains; toggleGroup stops bubbling to delegated MenuComponent handlers. Neither submenu gets animated inline display. | Confirmed — source-only |
| Siblings / nested groups | Both groupHeader consumers pass their own siblings; opening sets peers false, closing preserves other levels. | Confirmed — source-only |
| Search / clear | Existing filterMenu clones nodes per query/clear; WeakMap state applies to rendered-node identity, so fresh matches open through the search default. | Confirmed — source-only |
| Current route and Recent | Leaf active and submenu menu-active-bg remain; current route supplies unopened-node defaults. Existing NavigationEnd recordVisit and cleanup unchanged. | Confirmed — source-only |
| Shared header / keyboard / pin | One groupHeader template renders both levels, native type=button supports Enter/Space, aria-expanded follows disclosure, toggleAppbar stops propagation independently. | Confirmed — source-only |
| Style conformance | menu/_base.scss shows submenus via parent show and rotates menu-arrow; mixins/_menu.scss themes descendant menu-title/menu-icon. Structural button CSS inherits font/color, and root selectors preserve 1.15rem/700 titles and 1.15rem icons; focus uses sigma-primary. | Confirmed — source-only; visual acceptance pending |
| Shell integration | Existing CommonModule supplies ngTemplateOutlet; RouterModule supplies RouterLinkActive exports. No imports/providers/routes/services/requests changed. | Confirmed — source-only |
| Full scoped diff / whitespace / merge markers | Complete TS/HTML/SCSS diff reviewed in actual frontend root; git diff --check clean; no merge markers. Documentation changes reviewed in F:/My Work/Shaban Documents/Shaban. | Confirmed — source-only |

## Changes and phase coverage

- Frontend files: sidebar-menu.component.ts (disclosure state/helper), sidebar-menu.component.html (route separation/shared native header), sidebar-menu.component.scss (inherited disclosure layout/focus, updated root typography selectors).
- Documentation: UI block 1, UI preamble 1.58, CHANGELOG and sigma-screen-refactor rule/revision row updated together. Generated recipes refreshed using Generate-SigmaRecipes.ps1, never edited directly; final -Check passed for all eight. This review is the local unversioned report.
- Applied: proportional discovery/decision capture, Phase 5 event wiring and Phase 6 scoped reconciliation. Phase 1 domain/API, 2 grid, 3 editor, 4 domain transition and PLAN-00 are not applicable to this single shell disclosure rule. No separate contract-freeze artifact under Master 1 tier S.
- Shared extraction: both group levels use one groupHeader template and one disclosure helper in the existing shared sidebar owner. No additional cross-feature service/component was needed.
- Backend, DTO/API, AutoMapper, domain calculations, authorization and schema: no changes; no Add-Migration required.
- No new translated labels; existing catalog and Pin keys retained, en/ar edits untouched.
- Subagents not used: one small, tightly coupled fix; delegation overhead/overlap would exceed any benefit.

## Owner verification and limitations

1. Open a main group, select a leaf, then close/reopen the group several times. Repeat on a group with nested children and on a previously active route.
2. Open another sibling, navigate from Recent/appbar, search for a child, close a matching group, then change/clear search. Confirm leaf navigation, active highlighting and visible search results.
3. Use Tab/Enter/Space on disclosure and Pin; Pin must never toggle disclosure. Check Arabic/English, light/dark and narrow/minimized sidebar layouts, keeping existing drawer behavior.

Build, tests, lint, browser/runtime and visual checks were not run under the project boundary. The submenu no longer uses Metronic slide animation; existing arrow CSS remains. Angular template compilation and actual interaction/layout acceptance remain pending. No required business decision is Missing/Conflicting/Uncertain; runtime acceptance is separately pending.

Prohibited commands not run: no build/test/lint/database/migration/browser automation, Sigma MCP, Graphify, commit/push or deployment.

Suggested frontend commit (only the three sidebar-menu component files):
`fix(sidebar): allow active menu groups to collapse and reopen`

Suggested documentation commit (this task's UI1/header/history hunks and regenerated fingerprints only; preserve unrelated edits):
`docs(ui-book): record single-owner sidebar disclosure`
