<!-- Part of UI block 1: see ../01-feature-folders-and-wiring.md. Same status and authority as the block. -->

### Sigma authenticated shell — PrimeNG
The owner approved replacing Metronic and starting with the authenticated shell.
The active shared owner is `app/layout/LayoutComponent`, with
`app/layout/ShellHeaderComponent`, existing
`SidebarMenuComponent` and `AppbarShortcutsComponent`. This supersedes the
Metronic initialization, sidebar rail and toolbar-sizing implementation below;
those old insets remain historical compatibility evidence, not a new reference.
The owner's subsequent complete-retirement instruction includes all dependent
screens. `_metronic` and the unused Builder/demo/KT tree are removed after moving
the live shell to `app/layout`, domain enums to `modules/shared/enums` and form/Excel
helpers to `modules/shared/utils/form-export`. All direct consumers, lazy route,
explicit compile roots and retained tests follow the new owners. Enum values,
routes, providers, feature form/control names, API payloads and business rules do
not change. No compatibility re-export barrel may recreate the old tree.

**Complete style retirement.** `assets/sass/style.scss` composes only Sigma base, status tokens, native
controls and utilities, independent of the retired Sass core/components/layout/
vendor trees. Existing native fields/buttons receive PrimeNG directives through
their real owning imports; presentation classes/selectors and dynamic class
consumers migrate together. Shared wrappers retain their public contracts.
Sigma's shell owns its overflow, native unpadded route/content classes and
bounded-route scrollbar gutter. Keep historical IDs only where current print
consumers require them. Routed Receipt now fills its route container rather
than positioning against historical header/sidebar offsets; embedded/dialog
sizing stays with its existing owner. With that last dimension consumer removed,
the measured-header bridge and unused layout-dimension tokens are retired too.
Do not add a new viewport-height calculation or a fake compatibility offset.
Footer's optional container-class input remains compatible through native Sigma
markup; it does not require app-container or the vendor visually-hidden utility.

Error-page Return Home actions also use ordinary Router navigation. Do not
bootstrap/reinitialize legacy KT menus/drawers/sticky/scroll/toggles through a
delayed callback after returning to the PrimeNG shell; Angular and the current
publisher components own that lifetime. Preserve the error page's route,
theme/background subscriptions and body-class cleanup (runtime retirement,
2026-10-22).

- Keep one lazy authenticated shell and the complete `pages/routing` catalog,
  AuthGuard/hash/deep links, existing business provider registry, one HttpClient,
  translation session, current-branch and loading-service contracts. Do not run
  LayoutInit/ScriptsInit, template plugin bootstraps or demo drawers/modals in
  the active shell. Browser titles derive from Router/catalog/translations,
  independently of whether navigation is visible.
- LayoutComponent owns one flex viewport: header above workspace; a280px
  desktop aside from992px, one flexible content region and a fixed footer.
  The header button explicitly hides/shows the aside, giving its width back to
  content. Below992px PrimeNG Drawer owns mask/Escape/focus and closes after
  successful navigation to another page that started after the drawer opened.
  Capture the current or last-successful Router navigation ID on every open,
  including shortcut opening. Compare parsed UrlTree roots on NavigationEnd,
  preserving matrix parameters and outlets while ignoring query and fragment
  changes. Earlier in-flight navigation completion retains the newly opened
  drawer. Render only one menu instance. Use logical CSS and
  Sigma tokens; never copy Bootstrap layout utilities into this shell.
  PrimeNG21's Drawer destruction skips mask cleanup when visible already became
  false during leave. The bounded ShellDrawerCleanupDirective invokes that
  instance's exported idempotent destroyModal if its mask survives destruction.
  Retain it until the publisher fixes this lifecycle; do not patch node_modules
  or sweep arbitrary body masks. Verify immediate mobile-close → desktop resize
  leaves no mask blocking the next page.
- Desktop brand region and aside share `--sigma-navigation-width: 280px`
  from LayoutComponent, including their borders. The logo region begins at
  logical start; its32px hide/show button is centered on the logical-end border
  between navigation and content. Below992px use a normal40px drawer button.
  Preserve accessible expanded/action labels and mirrored directional glyphs.
  Keep shortcut labels compact at992–1400px and bound wide direct labels to100px
  without removing their full accessible names, titles or overflow actions.
- A menu group row ends with its disclosure chevron; the independent Pin is
  before it, so a hidden Pin never reserves trailing space after the arrow.
  Custom rows own8px padding and publisher wrappers add none. Native
  group buttons also have zero margin/padding so their icons and titles align
  with sibling page links; the custom row alone supplies their common inset.
  Each nested root/submenu list adds14px logical-start padding and zero logical-end padding.
  The bounded shared menu rule must override the existing global physical
  `ul` padding!important; do not change feature lists. Verify both directions
  against actual nested publisher lists, retaining disclosure/keyboard owners.
  The owner's third-level Pin adjustment adds8px logical-end margin only to
  that Pin. Publisher treeitem aria-level2 corresponds to application level3
  because the top-level group is outside its tree; preserve other levels and
  the arrow position.
  Bound each PanelMenu motion grid to `grid-template-columns: minmax(0, 1fr)`;
  its content wrappers and nested lists have `min-inline-size: 0`.
  Match the installed publisher's actual `ul[pPanelMenuSub]` list host.
  Within the row, keep icons and the1.75rem centered Pin
  fixed while the label uses a zero flex basis and zero minimum inline size
  with normal whitespace and `overflow-wrap: anywhere`. Long sidebar names
  appear in full across as many lines as needed; no ellipsis, clipping or line
  clamp.
  Rows grow naturally while fixed controls remain centered. This keeps third/deeper-level actions within the existing
  viewport without clipping their focus outlines or changing pin/chevron order
  (owner2026-10-24; source-only visual acceptance pending).
- Selecting a sidebar page preserves the current bounded menu scroll position
 .
  Keep the existing panel-item objects, child arrays and disclosure alive on
  ordinary route changes; update active styling in place instead of rebuilding
  the publisher model. A route signal read by the projected row template keeps
  its active classes current across OnPush publisher views. Leaf commands cancel
  pending group alignment without requesting their own reveal; NavigationEnd
  updates selection without restarting alignment, including real path changes
  and reselecting the current page. Query/fragment-only route changes also do
  not start a fresh reveal. Search/language changes may rebuild the
  model for their own purpose; existing manual-cancellation, remount, keyboard,
  Pin and native-scroll ownership stay intact. No window scrolling, node
  reordering, artificial spacer or feature-specific tracker workaround.
- Exactly one sidebar row is the current page. Several
  catalog entries may open the same route, and a parent route also prefixes its
  child pages, so route matching (exactActive/activeExclusions) only yields
  candidate leaves. SidebarMenuComponent selects one by its catalog title-key
  path: the most specific matching route, then the entry the user chose last,
  then the first in catalog order; reselecting another entry for the already
  open page updates the selection without navigation. Groups are never the
  current page, even when they carry a link. Only groups on the selected path
  auto-expand and show primary label/icon colour without the row fill; the
  selected leaf carries `aria-current="page"`. Do not fix duplicate selection by
  editing catalog links.
- Active sidebar rows use the existing route-derived active state in the shared
  SidebarMenuComponent. Paint the whole custom row, including
  its Pin area, with `--sigma-primary-soft`, a1px border mixing38% primary with
  `--sigma-border`, and a3px logical-start edge in `--sigma-primary`; retain the
  existing primary bold label/icon and .5rem radius. Reserve transparent borders
  on inactive rows too:7px padding and5px logical-start padding plus the borders
  preserve the previous8px effective inset without selection-induced movement.
  Both desktop aside and mobile Drawer inherit this single rule, using existing
  light/dark tokens; do not copy it into individual feature screens.
- Opening a main or nested sidebar group aligns its heading toward the top of
  the existing menu scroll viewport, clamped to its available range. PrimeNG
  invokes the command before disclosure; wait for rendered expanded state and
  the next layout, then observe the actual menu/motion-container size changes
  while siblings collapse and children expand. A one-shot pre-motion scroll
  can be clamped too early. Keep this in SidebarMenuComponent for both aside and
  Drawer, without moving nodes, adding spacer height or scrolling the page.
  Manual pointer/wheel/touch/navigation keys, search/pin, another command,
  route/model rebuild or destruction cancel pending animation-frame work and
  disconnect the observer. Closing a group does not start alignment. Preserve
  publisher keyboard/focus/disclosure and native scrollbar/pin geometry
  (owner2026-10-24; source-only visual acceptance pending).
- Retain `sigma-app-viewport` lifecycle, `kt_app_root/page/wrapper/main` and
  content-container IDs as print/consumer compatibility boundaries, without
  data-kt interactions. `.app-content` remains fallback scroll owner, with
  zero padding; shared bounded routes fill their box and own their inner scroll.
  Header responsiveness uses its own inline-size container, independently of
  the992px navigation breakpoint. The owner correction2026-10-24 supersedes
  the earlier two-row layout: Toolbar stays nowrap at every width. Narrow the
  branch/language controls, gaps and secondary captions first. Below768px hide
  the decorative logo and separate Manage button; Manage stays available in
  Shortcuts. Keep Recent, navigation, branch, language, theme, account and refresh
  status on that row. Below480px use32px controls; below360px branch becomes an
  icon with its full selected name in the title/popup. Compact status badges
  retain accessible text and full hover titles. Return manager focus to the
  visible Manage or Shortcuts trigger. Keep names reachable in Select popups
  and preserve accessible labels. Never infer usability from widths alone.
  Shortcut CSS and overflow membership must use the same1600px header-width
  boundary, not different browser-width/media-query rules. Observe the existing
  header container, disconnect on destruction and close a shortcut popup when
  switching layouts hides its trigger. Every saved entry stays in overflow when
  direct shortcuts collapse; preserve saved IDs/order and existing focus helpers.
  Bound shell Popover/Select surfaces to viewport width; popup content owns its
  bounded vertical scroll on short screens. Projected content retains component
  styles; body-appended publisher wrappers use the existing global shell selectors.
- A native ResizeObserver measures only the header host and publishes
  `--bs-app-header-height` on the shell root for Receipt's existing fixed top
  inset. Disconnect on shell destruction. This is not a new route-height
  formula or permission to copy old viewport calculations. No unused footer or
  toolbar measurement adapter is needed by the current feature source.
- Branch/language Selects use typed FormControls as a view of confirmed shared
  service state. Reset a candidate immediately to the confirmed selection,
  then let successful service state update it; retain loading/saving/editor
  guards and recoverable error text/retry. A one-way ngModel binding alone can
  leave the failed candidate displayed because the confirmed input never changed.
  Do not change API, default-branch, translation cancellation or failure owners.
- ThemeModeService retains light/dark/system, storage keys, observable API,
  data-bs-theme and its existing change event. Native image-attribute updates
  replace the template ThemeMode plugin. Account/profile remains current Login
  data, read only; Help/logout and unavailable placeholders keep their contracts.
  Static template notification samples do not become real notification data.
- PrimeNG Select/Popover/Drawer own overlay behavior. Shared overlay focus
  edges follow UI27. Print hides shell chrome and all marked body overlays,
  releasing frame height/overflow for the existing report lifecycle (UI21).

Canonical sources for this shape: current LayoutComponent, ShellHeaderComponent,
SidebarMenuComponent, AppbarShortcutsComponent, native ThemeModeService and
styles.scss shell overlay rules. Evidence and migration boundary:
`reviews/PRIMENG_SHELL_MAINTENANCE_EVOLUTION_PLAN.md`. Build/rendered tests and
owner interactive visual acceptance remain distinct.

### Authenticated-shell sidebar disclosure

**Canonical shared owner:** existing `SidebarMenuComponent`, using PrimeNG21
PanelMenu and the one MenuCatalogService tree. Translate/filter the adapter
without copying route lists or changing catalog/pin identities. Preserve leaf
exactActive/activeExclusions, recent visits and translated parent/child search;
rebuild labels on language change. Ctrl/Command+K and slash focus search, opening
hidden navigation through LayoutComponent when needed; never steal modal focus.

PrimeNG owns disclosure/keyboard state. Root multiple=false preserves sibling
accordion behavior; route/search supply initial expansion. Hide/show and
desktop/Drawer remounts preserve expanded and collapsed groups plus search text
through the typed SidebarMenuState owned by the existing LayoutComponent and
passed to its single mounted menu. This is transient workspace state, not local
storage or a user/account preference. Snapshot final publisher item.expanded
after rendering and before rebuilding/destruction, so root sibling auto-collapse
is retained too. Cache stable catalog group IDs in the adapter; never key saved
state by translated labels or DOM positions. Keep search expansion separately;
changing the query resets only search disclosure, and clearing search restores
normal disclosure. Reopening the same query retains its disclosure. Known saved
group states take precedence over initial route expansion; route-derived active
leaf styling remains authoritative. Do not retain another hidden menu instance
or change Drawer mask/focus ownership merely to preserve state.
The shared adapter
honors optional MenuItem.autoExpandOnActive (default true). The main
Reports group sets false, so duplicate report links do not
open it automatically on initial rendering or route-driven rebuilds. Manual
publisher disclosure and search expansion remain available; other groups
retain active-route expansion. Catalogue expanded remains a group marker,
not the publisher's initial open state. The custom item
adapter owns one native anchor per leaf. Do not also set the publisher root
routerLink: PrimeNG21 renders that root anchor even with an item template.
Keep publisher roving focus, custom leaf/group elements tabindex=-1 and a
separate accessible pin. Enter/Space on Pin must not bubble into disclosure.
Group Enter activates the group button rather than the first Pin; native leaf
links retain href/modified-click navigation. Retain active exclusions through
the custom active style rather than a second RouterLinkActive rule.

An explicitly opened group requests one pending header reveal. After render,
consume it only if still connected, within the menu viewport and expanded;
write only that viewport's scrollTop, clamped by the native range. Closing,
Pin and route/search expansion do not request movement. Keep focus and page
position; no scrollIntoView or Metronic measured-scroll plugin. Search stays
above the flexing internal menu scroll owner.

On a remount with retained disclosure, request one reveal after the adapter has
rendered. Prefer the active visible leaf, then its deepest visible ancestor,
then the deepest restored expanded group. Preserve closed ancestors; revealing
their heading must not open them. Resolve the rendered row through its stable
catalog ID, and reuse the same bounded frame/resize alignment rather than a
second scroll owner. A restored leaf or collapsed heading needs no expanded
attribute; newly opened groups still require rendered expanded=true. Wait for
nonzero Drawer/row geometry through the existing ResizeObserver, and observe
the target plus viewport/content/motion containers. Manual input, search, pin,
navigation and destruction cancel restoration as well as explicit reveal.
No window scrolling, forced disclosure, focus change or artificial scroll
spacer (owner correction2026-10-24: retained selection was not brought upward).

Keep that viewport shrinkable in inline size and vertically scrollable only,
with `scrollbar-gutter: stable` and 1rem logical-end padding (logical-start
remains .5rem). The extra end clearance also protects row Pins when the browser
uses overlay scrollbars, which do not reserve a gutter. Preserve the row,
nested-list and third-level Pin spacing above; do not move Pins outside rows
or hide the vertical scrollbar. Owner-reported overlap correction,2026-10-23;
source conformance only, visual acceptance pending.

### Desktop navigation visibility

The new header's explicit Angular toggle replaces the historical75px Metronic
rail/hover attributes. Default desktop navigation is visible, hidden navigation
returns the full280px to content, and hover does not reopen it. Below992px the
PrimeNG Drawer owns visibility. Do not add per-feature margins or plugin/body
attribute toggles. Preserve query/deep-link state and responsive internal scroll.
