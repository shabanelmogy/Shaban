# App shell — Sidebar — Feature Review

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-01 |
| Scope | `_metronic/layout/components/sidebar/{menu-item.ts, sidebar-menu/*}`, sidebar block in `src/styles.scss`, `sidebarMenu` block in `en.ts` / `ar.ts` |
| Repository / branch | `SiGmaAngularFrontEnd`, applied to `review-movements` working tree (uncommitted) |
| Guides | Master Guide; UI blocks 1, 22, 23, 24, 25, 27, 30 (item 15); `sigma-screen-refactor` skill |
| Owner instruction | "Implement all the notes" (phases 1–3 of the proposed plan) |

## Findings and resolution

| # | Before | Resolution |
|---|---|---|
| S1 | Search matches inside a closed group stayed hidden: `expanded` marks a group, not its open state, which Metronic owns | Accordions get `[class.show]` while a search term is present; clearing rebuilds the list, so the route-active group reopens through `routerLinkActive` |
| S2 | Arabic search was literal | `normalizeSearchText` folds case, tashkeel, tatweel, أ/إ/آ/ٱ→ا, ة→ه, ى/ئ→ي, ؤ→و; the highlight uses the same folding (`searchHighlightPattern`) |
| S3 | No keyboard access to search | Ctrl+K / ⌘K (by `event.code`, so it works on an Arabic layout) and `/` outside text fields focus the search; Esc clears; `aria-keyshortcuts` and a `Ctrl K` hint |
| S4 | Clear "button" was a `span` with inline style and English `title` | `<button>` with a translated `aria-label`; Bootstrap Icons |
| S5 | `id="#kt_app_sidebar_menu"` (stray `#`, matched nothing) | Removed. The attribute was dead, so Metronic scroll sizing is unchanged |
| S6 | `any` everywhere; PrimeNG `MenuItem` used for local data | Local `MenuItem` (`styleClass` added); typed filtering and cloning instead of `JSON.parse(JSON.stringify())` |
| S7 | Font Awesome and Bootstrap Icons mixed; dashboard and agreements dashboard shared one icon | `toBootstrapIcon` maps every Font Awesome name in the data (all verified in bootstrap-icons 1.13.1); guessed icons are Bootstrap Icons; agreements dashboard → `bi-speedometer2` |
| S8 | No visible marker for the current page | 3px `--sigma-primary` bar on the active leaf (logical inset, RTL-safe) |
| S9 | No quick access in a ~290-link menu | **Favorites** (star toggle on every leaf, `aria-pressed`) and **Recently visited** (last 5 menu routes, clearable), shown above the menu under section headings with an "All modules" divider; hidden while searching |
| S10 | Empty search text was hand-written | `app-state-message` (UI block 22) plus the searched term |
| S11 | Literal-sentence keys (`'Search menu...'`, `'No results found'`) | New `sidebarMenu.*` keys (11, en/ar parity 0/0/0). The old literal keys are left in the vocabularies, per UI block 23 |

## Decisions

- **Storage:** favorites and recent lists live in `localStorage` under `sigma.sidebar.<userId>.{favorites,recent}`. Every read and write is wrapped in try/catch. They are a per-user, per-browser convenience; no backend change and no shared state.
- **Recent** records only routes that exist as menu leaves (query and fragment ignored, case-insensitive).
- **Minimized sidebar:** Metronic already fades `.menu-content`/`.menu-title`; the star toggles are hidden with the same conditions through a global rule in `styles.scss`.
- **Kept as is:** the group icon tones (`submenu-tone-*`), the Metronic accordion, the menu data and order.
- The leaf link reserves 34px at its inline end for the star, so long titles truncate slightly earlier.

## Follow-up (2026-10-01, owner request "collapse and a bigger title")

- Favorites and Recently visited headings became toggle buttons. Each has `aria-expanded` and `aria-controls`, a count badge, and a chevron that rotates by direction. The collapsed state is stored per user (`sigma.sidebar.<userId>.collapsed`).
- Section headings grew from 0.72rem muted to 0.875rem in the text colour.
- Interpretation recorded: "collapse" was read as the new sections, not the whole sidebar. Metronic already provides sidebar minimize.

## Doc-worthy rules for the owner

1. UI block 1 (shell): Metronic accordion open state is the `show` class; a filtered menu must set it on groups that contain matches.
2. UI block 23: Arabic search normalisation (`normalizeSearchText`) should be the shared rule for every client-side text filter.
3. UI block 30 item 15: the sidebar no longer uses Font Awesome.

## Verification

Source-only. Build, tests, lint and browser verification were not run and remain pending for the owner.

## Later owner amendment — remove sidebar Favourites, 2026-10-03

Owner: "عايز الغى قائمة favourite من sidebar هسيب pin بس". This explicitly supersedes the earlier decision to retain sidebar Favourites. The section, leaf star toggles, favourite-only component/service APIs/styles and three en/ar keys are removed. Existing appbar Pin buttons, handlers, ordered per-user appbar storage, catalog routes/IDs, manager, search and Recently Visited retain their owners. The remaining Pin occupies the one-button logical-end space; minimized/touch/keyboard/theme behavior remains. Legacy browser favourites are left dormant, with no deletion/conversion to appbar pins. Exact implementation and source reconciliation: F:/My Work/Sigma/reviews/Archive/Completed/2026-10-23/SIDEBAR_FAVOURITES_REMOVAL_FEATURE_REVIEW.md. No backend or migration change. Runtime/browser acceptance pending; previous content remains historical evidence.

## Owner amendment — remove Dashboard 2 navigation, 2026-10-18

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Request | Remove Dashboard 2 from the sidebar |
| Scope | One entry in `sidebar-menu-data.ts`; bilingual navigation guidance in `UserGuide/content/shared-screen-guidance.ts` |
| UI shape | Authenticated shared-shell navigation exception, UI1; no CRUD/editor shape or backend pattern applies |
| Evidence / decision | The only secondary top-level dashboard entry is `sideMenu.agreementsDashboard` → `/agreementsDashboard`, immediately after `/dashboard`. Its current translations are Agreements Dashboard / لوحة قيادة العقود. Treat the owner's Dashboard 2 wording as this secondary entry; keep the primary Dashboard. |
| Frozen boundary | Remove that catalog entry only. Do not change routes, page implementations, translations, permissions or storage. Existing catalog consumers automatically omit the removed entry, including search and available pins. |
| Existing changes | Prior Purchase Request, topbar, user menu, Administration guide and vocabulary work is already dirty and remains outside this amendment. Target menu-data/common-guidance files were clean before this change. |
| Packet | `PHASE-05-integration-runtime`; recipe `-Check` passed all eight packets before use. Canonical UI1 navigation ownership and packet wiring roles agree. |
| Phases | Focused discovery/freeze, Phase5 navigation integration and scoped final reconciliation. Grid/editor/domain-action/backend phases do not apply. |

### Reference conformance before implementation

| Concern | Owning block | Actual reference / shared owner | Target decision |
|---|---|---|---|
| Navigation source | UI1 | `SIDEBAR_MENU_ITEMS` → `MenuCatalogService.tree` → `SidebarMenuComponent.menuItems` | Remove only the secondary root item; retain the primary `/dashboard` entry and existing renderer/search/disclosure behavior. |
| Pin consumers | UI1 | `MenuCatalogService.index/get`, `SidebarShortcutsService.loadUser` | Existing catalog lookup filters unavailable pins; no new filtering, storage writes or parallel menu definition. |
| User guidance | Master7 | `SHARED_SCREEN_GUIDANCE` → `GuideReaderComponent.sharedScreenGuidance` | Update existing bilingual sidebar explanation, rendered through existing `/UserGuide/:sectionId` readers; keep current module guide menu entries. |

No new reusable presentation rule or shared extraction is needed. No screenshots or unresolved API/business decisions apply. This small, sequential edit does not meet the delegation gate; no subagents are used.

### Source reconciliation — 2026-10-18

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Final source | Removed the six-line `/agreementsDashboard` root entry from `SIDEBAR_MENU_ITEMS`; `/dashboard` remains first. Search/catalog now have no such entry. Updated the existing EN/AR sidebar guidance to point to the main Dashboard. All three conformance rows above match the final source; no new owner or rendering override. |
| Source checks | Reviewed complete scoped diff in frontend repository; whitespace check passed; both changed TypeScript sources parsed without syntax diagnostics; scoped search found no removed entry in menu data. Existing guide route is `/UserGuide/:sectionId`, e.g. `/UserGuide/customers`, with existing module menu entries. |
| Impact | No backend, DTO/API, AutoMapper, calculation, permission, schema or migration change. Translation keys remain available to unrelated consumers. |
| Owner acceptance | Reload the app and verify the secondary dashboard is absent from the sidebar and its search, while the primary Dashboard opens normally. Runtime/visual acceptance remains pending. |
| Suggested frontend commit | `fix(sidebar): remove secondary dashboard link` |
| Execution boundary | No builds, tests, lint, browser automation, database commands, migrations, Git writes or deployment ran. No subagents used for this small sequential fix. |
## Active sidebar item presentation — 2026-10-23

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Scope | Tier S: one selected-row presentation rule in the existing shared sidebar; owner requests a tinted background and distinct colored border. No menu/catalog/route/API behavior changes. |
| Authority | Master1/5/7; UI1/24/25. Recipe drift check passed for all packets before use. Phase6 scoped reconciliation applies; grid/editor/backend/domain-action phases are inapplicable. |
| Decision | Reuse the current route-derived active state. Paint the entire custom row, including its pin area, using Sigma primary/surface/border tokens. Reserve border space for every row and retain the existing 8px effective inset. Apply to desktop aside and mobile drawer through the same SidebarMenuComponent. |

| Concern | Book block | Reference producer/consumer | Shared owner | Target |
|---|---|---|---|---|
| Active identity | UI1 | SidebarMenuComponent.toPanelItems → item.styleClass → custom item template | app/layout/components/sidebar/sidebar-menu | Keep the existing active matching/exclusions; bind row presentation to the same state. |
| Paint and geometry | UI1/24 | sidebar-menu.component.scss .sigma-panel-item / .sigma-panel-item-link; global Sigma tokens in assets/sass/_sigma-base.scss | SidebarMenuComponent | Rounded tinted row, colored outline and stronger logical-start edge; retain effective 8px inset and pin/disclosure layout. |
| Direction/theme | UI25 | Sigma theme tokens and logical border/padding | Existing shared theme and sidebar | No physical left/right placement; colors follow light/dark tokens, same rule at every breakpoint. |
| Guidance | Master7 | SHARED_SCREEN_GUIDANCE → existing GuideReaderComponent | modules/UserGuide | Add bilingual active-screen explanation to existing module guide overviews; existing /UserGuide/:sectionId routes and menu entries retained. |

