# Sigma PrimeNG authenticated shell — first implementation slice

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Authority | Owner: replace Metronic with PrimeNG; start with shell, 2026-10-22 |
| Shape | Cross-cutting authenticated shell; backend/API unchanged |

## Scope and authority
Replace the active header, navigation presentation, mobile drawer and content frame. This explicit owner instruction supersedes Metronic-specific shell initialization in UI1; retain its viewport, route-fill and print invariants. No feature layout or business workflow migration in this slice. Preserve all existing public shared-control contracts. No package removal until feature consumers are migrated. Baseline frontend working tree is clean on upgrade/angular-21-validation.

## Impact and classification
| Owner | Classification | Frozen target |
|---|---|---|
| LayoutComponent | Replace | Angular-owned frame, PrimeNG Drawer/Toolbar, no LayoutInit or ScriptsInit/Metronic plugin initialization |
| LayoutModule | Extend | Retain lazy URL boundary and complete existing business provider registry; prune only presentation imports |
| SidebarMenuComponent | Replace presentation | PrimeNG navigation; retain one MenuCatalog tree, all links, search, active exclusions, pinning and visit tracking |
| AppbarShortcutsComponent | Refactor | PrimeNG overlays/buttons, same storage IDs, recent/pinned/reorder and manager workflow |
| Header controls | Replace | PrimeNG branch/language/theme/account controls using existing services; read-only profile from existing Topbar form |
| ThemeModeService | Refactor | Native theme/image updates, same storage keys, observable API, dark selector and change event |
| Branch/translation/auth/loading services | Keep | Same startup/session/gates/retry/errors and one interceptor-equipped HttpClient |
| Global legacy Sass/Bootstrap | Keep compatibility | Existing feature consumers retained, no duplicate CSS import |
| Static demo notifications/drawers/modals | Remove from active shell | Static defaultAlerts/defaultLogs have no real endpoint; no fake badge/status |
| Footer/print IDs | Keep contract | Existing support destination/copyright; preserve kt_app_root/page/wrapper/main/content_container identifiers for existing print consumers |

## Frozen integration contract
- Keep app.routes AuthGuard, hash navigation and every pages/routing route. LayoutModule route remains the single active shell. Provider list unchanged.
- Start/end TranslationService session on auth changes and shell teardown. Root AppComponent retains theme/input services.
- Branch selection calls CurrentBranchService.change. Block while loading/saving/editorOpen; content inert during saving. Load only if not initialized/loading, expose loadError and retry, never mount outlet before ready.
- Language catalog/runtime retry uses existing TranslationService, direction remains its owner. Theme uses light/dark/system with persisted current preferences.
- User account uses current Login data only; reuse source-supported read-only profile fields. Help administration guide, logout current AuthService. Unavailable account actions remain unavailable. No permission API or notifications backend invented.
- Navigation preserves catalog identity, exactActive/activeExclusions, translated search, Ctrl/Meta+K and slash, pins/recent storage and shortcut manager. Mobile closes on completed navigation; Drawer owns escape/mask/focus return. One visible navigation instance per breakpoint.
- Shell is CSS grid/flex with no Bootstrap layout utilities or data-kt interactions. Logical properties, Sigma theme tokens, 992px desktop breakpoint, bounded route region; compatibility IDs do not imply plugin use. No repeated title toolbar.
- Keep header/sidebar/footer fixed in their frame. Content is fallback scroll owner; bounded routes remain 100% fill. Print must hide shell chrome and release viewport/overflow under existing print classes.

## Conformance before edits
| Concern | Book | Source/reference | Shared owner | Match/deviation |
|---|---|---|---|---|
| Frame/scroll | UI1 | current LayoutComponent, styles.scss viewport and print chain | LayoutComponent | Owner-approved replacement; same fill/print contract |
| Navigation | UI1/27 | MenuCatalogService, SidebarMenuComponent, SidebarShortcutsService | Existing catalog/services | Same route identity/search/pins; PrimeNG presentation |
| Branch/session | UI1/22/28 | CurrentBranchService, NavbarComponent, LayoutComponent | Existing services | Preserve all guards and recovery |
| Account | UI1/26 | TopbarComponent profile dialog, UserInnerComponent | New shell header | Reuse supported read-only profile and disabled actions |
| Theme/RTL | UI24/25 | ThemeModeService, sigmaPreset, TranslationService | Existing services | Same tokens/data-bs-theme/direction; native implementation |
| Verification | UI29/Master7 | app-bootstrap-compatibility.spec.ts | Shell tests and guide | Authorized build/test, interactive browser availability separate |

## Artifacts and phase selection
Recipe check: all eight packets current before use. PLAN-00, Phase05 and Phase06 apply; phases01–04 domain/grid/write/actions N/A. Master4/5/7, UI1/22/24/25/26/27/28/29/30 and existing source references inspected. No new permission candidates or backend changes. User guide: Administration existing reader/topic, bilingual navigation instructions required before handoff.

## Validation / reconciliation
Pending implementation, rendered shell/navigation tests, lazy bootstrap, production build, scoped diff review, guide update and packet refresh after owning-book lesson update. Owner visual acceptance remains distinct.

## Implementation amendment — legacy sizing compatibility (2026-10-22)
Discovery of remaining legacy viewport calculations found their header/footer variables were supplied by the removed Metronic body configuration. The new shell will publish measured header/footer heights and zero duplicated toolbar height on its own root using a bounded ResizeObserver. This is a transitional compatibility adapter only, not a new feature height formula; shared fill routes continue to use 100% of the content box. It avoids hard-coded responsive header dimensions and preserves legacy consumers until their screen reviews. The observer disconnects with the shell.

Source correction to sizing amendment: current scoped consumer scan found no remaining feature viewport formulas using those three variables; the live direct consumer is Receipt details' fixed top inset using --bs-app-header-height. Therefore implement only the measured header-height compatibility variable. Do not introduce unused footer/toolbar adapters. Historical guide counts remain historical, not current inventory.

## Integration inventory amendment — page title
ScriptsInit previously calculated the browser title from rendered Metronic menu DOM. Preserve that supported behavior through native Router + existing MenuCatalog + TranslateService, including deep links and language changes when navigation is hidden. Do not retain ScriptsInit solely for its title subscription or run template plugins.

## Feature Review Manifest and final source reconciliation

| Field | Value |
|---|---|
| Scope identity | PRIMENG_SHELL — authenticated app shell, frontend only |
| Baseline | upgrade/angular-21-validation at dd94355c; clean frontend working tree |
| Entry | app.routes empty guarded lazy LayoutModule → LayoutComponent → unchanged pages/routing |
| Contract handoff | Frozen above; no API/DTO/backend/database changes |
| Applicable phases | PLAN-00, discovery/freeze, Phase05 integration and Phase06 reconciliation |
| Non-applicable phases | Domain persistence, grid payloads, editor writes and domain actions are unchanged |
| Evidence | Current source/publisher declarations, complete scoped diff, real ChromeHeadless DOM tests |
| Screenshots | No new shell screenshot supplied; earlier screen images do not prescribe this replacement design |
| Authorization candidates | No new permission, protected action or permission API; existing authentication retained |

| Concern | Final source comparison | Result |
|---|---|---|
| Single route/provider owner | LayoutModule retains exact provider suffix compared with HEAD, same child Routing and app.routes AuthGuard | Matched |
| Active frame | LayoutComponent imports new header/Prime Drawer, one menu and existing footer; no LayoutInit/ScriptsInit/template plugin bootstrap | Matched |
| Menu/catalog identity | Sidebar adapter reads existing tree, keeps exactActive/exclusions and IDs; custom anchors avoid publisher root duplicates | Matched |
| Disclosure/keyboard | multiple=false, separate Pin with key isolation, publisher header activation, pending own-scroll reveal | Matched; rendered keyboard/anchor tests pass |
| Responsive/scroll | One menu instance, desktop280px at992px, mobile body Drawer, bounded flex route/content/footer; root lifecycle cleanup | Matched; frame and header width/theme/direction tests pass |
| Current branch | Existing loading/saving/editor guards; typed selection resets to confirmed branch on failed server write, content/mobile nav inert during save | Matched |
| Language/theme | Existing language/runtime service, confirmed-language rollback, existing theme keys/events/system mode, native image swaps and cleanup | Matched |
| Recent/pins | Existing shortcut service/storage/manager preserved; root records exact catalog visits only when no menu is mounted | Matched; additional hidden-menu test passes |
| Account | Current Login-only read-only profile, four unavailable items, existing help route/logout; no fabricated notifications | Matched |
| Print | Original root/page/main/content IDs retained; new frame print release plus marked Drawer/Select/Popover/profile layers hidden | Source matched; interactive print acceptance pending |
| Appearance | Existing Sigma tokens, logical spacing and actual publisher host hooks; no feature-specific control forks | Matched; four bounded header geometry cases pass |
| Guide | Administration adds shell navigation topic (shell.guide) and existing account topic; common guidance replaces the old rail/hover instructions | Matched; existing reader and /UserGuide/administration entry reused, EN/AR |

### Validation evidence
- Full existing+new suite: 498/498 ChromeHeadless tests passed; full-suite-final.log. A later isolated hidden-menu recent-visit fix is covered by the final31/31 shell/bootstrap/theme/navigation/header acceptance tests in acceptance-tests.log.
- Final targeted tests include real Select failure rollback, branch guards, popup entry focus/account profile, four header widths (320/380/800/1600), RTL/light/dark, menu keyboard/anchor/pin/search, one responsive navigation instance, session/content/loading and lazy metadata compatibility.
- Scoped ESLint completed without diagnostics before the final markup-only mobile inert/guide-label amendment; final lint evidence is lint-final.log.
- Provider registry suffix compared equal to HEAD. app.routes/pages/routing, API services and package manifests unchanged.
- Recipe maintenance: UI1 and UI27 plus skill rule/revision updated together; generator regenerated all eight packets. Semantic review confirms current UI1 shell ownership and unchanged Phase05/06 route/provider/auth/scroll/verification duties; final -Check returned all8 OK. Historical Metronic insets labelled superseded, feature CSS boundary retained.
- Interactive browser inventory exposes no localhost-capable browser (only empty MCP Apps). Real headless browser tests do not claim interactive screen or print acceptance. No live business data was saved.
- Production build and final whitespace check are recorded below when finished.

### Remaining migration boundary
This slice replaces the active authenticated shell. Global Metronic/Bootstrap feature Sass, unused legacy template files and other feature compatibility dependencies remain intentionally present. Their migration and removal require the next bounded shared-component/feature slices; do not uninstall them now or claim whole-project Metronic removal.

### Final handoff — 2026-10-22

| Field | Value |
|---|---|
| Status | Closed |
| Owner verification pending | yes |
| Closure boundary | First authenticated-shell slice implemented and automated checks passed; owner interactive screen/print acceptance remains pending |

- Production: exit0,93.687s,2026-10-22T17:30:58.034Z; initial5.74MB, estimated transfer678.04kB, six size-budget warnings, no compilation errors. Evidence: .angular/shell-modernization/production-final.log.
- Strict production template compilation required mutable Select arrays (UI16 existing typed-option-array rule). Header now exposes memoized top-level copies of readonly branch/language collections, preserving option objects/IDs and service immutability without casts. This compile-boundary correction followed the31 passing acceptance tests; final production verifies the corrected input types.
- Full suite498/498 and final targeted31/31 passed. Test output retains pre-existing reactive-form dot-key/disabled warnings and the theme fixture's harmless light.png404; no template/runtime errors were hidden. The full suite was not rerun after the isolated hidden-menu fix; its new case passed in the final targeted run.
- Final scoped diff/whitespace review passed. The complete provider registry compared exactly with HEAD; no route catalog, package, backend or database changes. New files are the shell header, bounded rendered regression specs and one shared overlay-focus helper.
- Scoped ESLint exit0; final output is empty. Final mutable-array change is type-safe and production-compiled; no lint suppressions, schemas, warning suppression or dependency force updates were introduced.
- User guide and canonical UI1/UI27/skill revisions are updated. All eight generated packets were regenerated by the generator, semantically reconciled and passed the final drift check.
- Browser inventory still provides only an empty MCP Apps surface, so direct localhost visual/print acceptance was unavailable. ChromeHeadless rendered geometry/interaction checks are recorded separately; owner should exercise real screens in both directions/themes before the next migration slice.
- No commit, push, deployment, package uninstall or live business mutation performed. Existing branch remains upgrade/angular-21-validation.

## Owner visual amendment — 2026-10-22: restore Appbar presentation quality

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Request | Owner prefers the former Appbar components and rejects the plain replacement appearance |

Scope: presentation-only refinement of existing ShellHeader and its PrimeNG Select/Popover templates. Keep PrimeNG interaction, all service/FormControl/rollback/guard/focus/route contracts and shortcut workflows. Restore the visual language of the existing Navbar/UserInner source without reactivating it or importing its plugins:42px branch card,30px leading icon tile, two-line label,40px rounded11px toolbar controls, language flag from stored metadata, account avatar and structured account/theme menus, token-based surface wash/border/shadow. Keep the64px header baseline and responsive wrapping. No notification demos or invented presence status. Direct shared header consumers inherit the improvement.

| Concern | Book | Reference symbol | Shared owner | Target |
|---|---|---|---|---|
| Branch card/icon/copy | UI1/16/24 | Navbar .topbar-branch-button/icon/copy | ShellHeader Select templates | Match42px/30px/two-line geometry |
| Toolbar icon buttons | UI24/25/27 | Navbar .topbar-icon-button | ShellHeader | Match40px/11px rounded token styling and focus |
| Account menu | UI24/25 | UserInner .profile-summary/.profile-identity | ShellHeader Popover | Same visual hierarchy with existing Login fields only |
| Language/choice overlays | UI16/24/27 | Navbar language menu header/flag | ShellHeader Select/Popover | Stored flag, heading, selected state and action grouping |
| Responsive/behavior | UI1/29 | Existing rendered ShellHeader regression specs | Existing owner | Preserve320–1600px, RTL/themes and async rollback |

### Appbar presentation amendment — reconciliation

| Field | Value |
|---|---|
| Status | Closed |
| Owner verification pending | yes |
| Boundary | Shared Appbar presentation refined; owner subjective visual acceptance remains pending |

- ShellHeader uses PrimeNG selectedItem/item/header templates for42px branch/language cards,30px branch tile, readable two-line copy and stored-language flag/fallback icon. Narrow language becomes48x42px with full accessible selected-language name and readable option popup; branch text remains visible.
- Restored40px/11px rounded icon controls aligned with existing AppbarShortcuts, dynamic light/dark glyph, account initials/name/type, structured identity summary, action icons/groups and token-based menu surface wash/border/shadow. No fake notifications or online presence.
- Preserved confirmed-state FormControls, mutable option adapters, branch/editor guards, language/branch failure rollback, theme/system preference, profile/help/logout, keyboard focus and print classes. Existing providers/routes/catalog/storage remain unchanged.
- Source conformance: Navbar branch42px/tile30px/copy hierarchy and icon40px/corners11px compared with final ShellHeader rules; UserInner identity summary hierarchy implemented through the existing Popover. Previous reference components remain unmodified and inactive. No claim of pixel-identical appearance.
- Regression tests19/19 passed: appbar-presentation-tests.log; cover current header/shell interaction and320/380/800/1600px RTL/light/dark geometry. No new trivial style-only test suite. Scoped ESLint exit0 with no diagnostics.
- Production exit0,124.805s,2026-10-22T17:45:07.801Z; initial5.74MB and the same six existing budget-warning categories. No new header stylesheet budget warning or compiler errors. Evidence: appbar-presentation-production.log.
- In-app Administration guide now describes the compact language flag/icon and readable full-name popup. Matching EN/AR appearance hint added. UI24 and skill rule/revision updated together; all8 generated packets refreshed through the generator, semantically reviewed for unchanged integration/verification ownership and -Check passed.
- Live browser inspection remains unavailable from this tool inventory; rendered regression tests and source comparison are distinct from the owner's preference. No commit/push/deploy/live data mutation.

## Owner shell alignment amendment — 2026-10-22

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Owner decision | Brand/title region is as wide as the sidebar; toggle is at the upper boundary between sidebar and content. Reduce space after menu arrows and indent every nested level. |

- Keep one shared280px navigation-width variable on LayoutComponent, inherited by desktop brand region and aside; no feature-owned offsets.
- Desktop header logo region fills that width from logical start. Place the32px toggle centered on its logical-end boundary, with expanded/collapsed directional glyph and accessible action. On mobile keep a normal40px drawer button; no absolute viewport coordinates.
- A group row ends with the disclosure chevron; independent Pin appears before it. Remove the invisible trailing pin reservation after the arrow. Publisher disclosure/keyboard ownership and all catalog/pin IDs remain unchanged.
- Each nested root/submenu list gets14px logical-start padding, zero logical-end padding; override the existing global ul physical-padding!important only within this shared menu. Custom row owns its8px inset; remove publisher wrapper double padding.
- Compact shortcut labels between992–1400px and cap wide direct pin labels at100px so the280px brand region and existing branch/language/account controls fit; all text remains accessible via existing labels/titles and overflow menu.
- Source conformance owners: UI1/24/25/27, LayoutComponent, ShellHeader, SidebarMenu, existing AppbarShortcuts. Keep theme/RTL/scroll/focus/async/print contracts and update existing in-app guidance after reconciliation.

### Shell alignment amendment — final reconciliation

| Field | Value |
|---|---|
| Status | Closed |
| Owner verification pending | yes |
| Boundary | Shared shell alignment implemented and automated checks passed; owner interactive appearance acceptance remains pending |

| Concern | Owning block / source | Final comparison |
|---|---|---|
| Brand and aside width | UI1; LayoutComponent and ShellHeader | Both inherit280px through --sigma-navigation-width with border-box; desktop brand begins at logical start |
| Upper boundary toggle | UI1/24/27; ShellHeader |32px desktop toggle centered on logical-end border (including1px border compensation),40px mobile button in normal flow; expanded label/glyph retained and mirrored in RTL |
| Arrow trailing gap | UI1; SidebarMenu item template | Pin precedes terminal12px chevron; row owns8px padding, wrappers add none; actual arrow-edge distance tested in both directions |
| Nested indentation | UI1; SidebarMenu shared publisher hooks | Every nested root/submenu list adds14px logical start and zero logical end, including against legacy global ul!important; two real nested levels tested |
| Header fit | UI1/24; AppbarShortcuts and ShellHeader | Compact shortcut labels992–1400px, wide direct labels capped100px; no route, shortcut storage or action changes |
| Guide handoff | Master7; Administration topic and common guidance | Existing reader reused; EN/AR now describe the upper boundary button, equal logo width and indented groups |
| Compatibility | UI1/27; scoped diff | No TS runtime logic, APIs, providers, catalog, manifests, print lifecycle or business contracts changed |

- Final ChromeHeadless run:28/28 passed; sidebar-alignment-tests.log. Includes real header/menu/frame behavior,320/380/800/1100/1600px geometry, RTL/light/dark, branch/language rollback, publisher keyboard/anchor/Pin behavior and nested-list spacing. The first run exposed a1px boundary offset; corrected border compensation and final run passed.
- Production: exit0,124.057s,2026-10-22T18:04:37.334Z; initial5.74MB, same six existing size-budget warning categories, no compiler errors and no new shell style warning. Evidence: sidebar-alignment-production.log.
- Scoped ESLint exit0 without diagnostics, including changed templates/specs and user-guide sources. Complete10-file scoped diff reviewed; frontend and scoped canonical/generated documentation whitespace checks passed.
- Canonical UI1/24 and skill rule/revision updated together from the frozen owner decision. Generator refreshed all8 packets; semantic review retained the Phase05 root/provider/auth/scroll boundary and Phase06 final-source/user-guide/verification duties. Final -Check returned all8 OK; no generated file edited manually.
- Existing feature Metronic/Bootstrap Sass remains outside this alignment slice. No commit, push, deployment or live business data mutation. Direct interactive localhost/print acceptance remains distinct from rendered ChromeHeadless evidence.

## Third-level Pin inset amendment — 2026-10-22

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Scope | Owner requests moving the third navigation level Pin slightly inward |

Use8px logical-end margin on only the third-level Pin in the existing shared SidebarMenu stylesheet. PrimeNG renders top-level groups outside its tree; its child treeitem aria-level2 therefore identifies application level3. Compare UI1 shared spacing and the actual PanelMenuSub level/aria-level template before selecting the hook. Keep first/second levels, row/arrow alignment, click targets, Pin identity and keyboard behavior unchanged. This is a presentation-only amendment; no backend/API shape applies.

### Third-level Pin inset — reconciliation

| Field | Value |
|---|---|
| Status | Closed |
| Owner verification pending | yes |

- UI1 conformance: shared SidebarMenu stylesheet applies margin-inline-end8px only to the Pin within a direct item-content child of publisher treeitem aria-level2. Inspected PanelMenuList default root and PanelMenuSub level+1 templates: this maps to application level3. First/second levels, arrows,28px Pin hitbox and all event handlers remain unchanged; logical margin follows RTL.
- Existing SidebarMenu rendered regression suite passed8/8, including navigation, Pin isolation, keyboard disclosure and logical nesting. Evidence: .angular/shell-modernization/third-level-pin-tests.log. No new tests added for this small reversible styling adjustment; the suite compiles the changed Sass. Production build was not repeated for this amendment.
- Guide updated in the existing Administration topic in EN/AR. Owning UI1 block and skill rule/revision updated together. All8 packets regenerated via generator and passed -Check; semantic review keeps Phase05 wiring and Phase06 reconciliation/guide obligations unchanged.
- Changed guide ESLint and frontend diff whitespace checks passed. Reviewed the scoped additions while preserving the prior shell changes. Owner visual acceptance remains pending; no live business data, commit or deployment involved.
