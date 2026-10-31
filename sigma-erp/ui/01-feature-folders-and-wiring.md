## 1. Feature folders and wiring

> **Status: Canonical** — route/model shape; the interceptor wiring inside is Transitional

For a conventional routed CRUD/list-detail feature, use this folder shape.
Special shapes such as reports, hierarchy workspaces, routed financial editors,
tabbed settings workspaces, and other explicitly documented exceptions follow
their owning blocks instead of being forced into this baseline.

```
<Feature>/
  <feature>.routes.ts          # see route table below
  components/
    list/    list.component.{ts,html,scss}
    details/ details.component.{ts,html,scss}
    detailsForm/<section>/     # step sections; see naming note
  models/
    list.ts      # grid row + filters + query
    create.ts    # write payload
    details.ts   # detail read
  services/
    <feature>.service.ts
```

**Naming, two corrections to what you will see in source.**

`CompanyPartner` spells the sections folder `detalisForm` — a typo. Paths in this
book quote it verbatim so you can find the real files, but **new features use
`detailsForm`.** Do not propagate the typo.

Company's CSS classes are `individuals-*` / `individual-*` because it imports
IndividualPartner's stylesheet (block 6). **New features prefix classes with
their own feature name**, as Fleet does with `fleet-*`. A new Warehouse screen
uses `warehouse-page`, `warehouse-filters`, `warehouse-add-button` — never
another feature's prefix.

Routes carry the mode, so one component serves all three states:

```ts
export const CompanyPartner_Routes: Routes = [
  { path: '', component: CompanyPartnersComponent },
  { path: 'create',   component: DetailsComponent, data: { mode: 'create' } },
  { path: 'view/:id', component: DetailsComponent, data: { mode: 'view' } },
  { path: 'edit/:id', component: DetailsComponent, data: { mode: 'edit' } },
];
```

**Route shape depends on the editor shape.** Use four routes only when the
editor is a routed page, as Company does. A dialog-based editor needs just the
list route, because the editor never owns a URL. `Sales/Fleet` currently
declares both — routes *and* an inline `<app-equipment-details>` in the list —
so treat that as a dual-mode outlier, not the target.

| Editor shape | Routes needed |
|---|---|
| Routed page editor | `''`, `create`, `view/:id`, `edit/:id`, each with `data.mode` |
| Dialog editor | `''` only; the list drives visibility and mode via inputs |

Three wiring steps, all required:

1. Lazy route in `pages/routing.ts`:

```ts
{
  path: 'CompanyPartner',
  loadChildren: () =>
    import('./../modules/Customers/Companies/CompanyPartner/companypartner.routes')
      .then((m) => m.CompanyPartner_Routes),
},
```

2. Service `@Injectable({ providedIn: 'root' })` — see *One `HttpClient`* below.

3. Menu entry, or the page is reachable only by typing the URL.

### Standalone dialog registration and built-in control flow

**Standalone consumer contract — mandatory source check.** Before adding or
moving shared controls, inspect the exact imported file's exports and the
current owning component/directive declaration. A sibling `.directives.ts`
file is not automatically re-exported by `.component.ts`. Every component,
directive and pipe used by a standalone template must also be present in that
consumer's `@Component.imports` (or supplied by an actually imported NgModule);
a TypeScript import alone does not register it. For example, a filter using
`app-field-error` needs `FieldErrorComponent` in both places. Check bound input
names and literal values against the current public types (block22 states).
Do not add `CUSTOM_ELEMENTS_SCHEMA`/`NO_ERRORS_SCHEMA`, casts, export aliases or
new compiler roots to conceal an incorrect import or unsupported input.

When removing an injected dependency, inspect remaining `this.<member>`
uses and the actual base-class members. Removing duplicate API success toasts
does not remove an existing non-API informational action (block22); preserve
its declared service injection. Inspect the installed framework declarations
before using a version-sensitive API (block28). TypeScript/Angular parsing,
path-existence checks and template-name scans establish only their respective
source facts; they do not validate exports, Angular registration, input types,
class members or application compilation. The Lease compiler-feedback repair
is the source-backed example; owner compilation remains pending.

**TypeScript library compatibility — mandatory source check.** Inspect the
effective `compilerOptions.lib` before introducing standard JavaScript APIs.
The Angular21 CLI migration removes the old explicit `es2018`/`dom` override;
the current `es2022` target selects TypeScript's default ES2022 browser libraries.
If another config supplies an explicit lib, it still overrides that default.
Neither target nor declarations supply runtime polyfills. ES2019 through
ES2022 APIs are now available under the application contract; do not retain
the former blanket ban on flat/flatMap/fromEntries/replaceAll/at. Typed
`for...of`/`push` export accumulation and typed form construction remain valid.
Preserve source order, null handling, headers and values. Do not widen lib or
add a polyfill to silence a local feature error; such a project compatibility
change requires its own explicit scope and runtime support review. Template/TS
parser success proves syntax only, not library/type compatibility. CashFlow
export and Budget form construction are the source-backed repair examples.

This application currently has an explicit `files` boundary in
`SiGmaAngularFrontEnd/tsconfig.app.json`. When a new standalone dialog or
feature component produces Angular's “missing from the TypeScript compilation”
diagnostic, add its exact `.component.ts` path to that `files` array, following
the existing LeaseAgreement dialog entries. Do not replace the project boundary
with a broad include glob, and do not add models, HTML, or SCSS files there;
their component imports own their compilation. A missing component root can
also make a valid standalone import appear “not statically analyzable” in the
parent component's `imports` array.

Use built-in control flow consistently. An `as` alias is allowed
only on the primary `@if` of a control-flow block; it is invalid on an
`@else if`. When loading and error states precede an optional response, make
the response alias the primary condition of a nested `@if` inside the final
`@else`:

```html
@if (loading()) {
  <app-loading-state />
} @else if (errorMessage()) {
  <app-error-state [message]="errorMessage()" />
} @else {
  @if (summary(); as summary) {
    <app-summary [total]="summary.total" />
  } @else {
    <app-empty-state />
  }
}
```

Never write `@else if (summary(); as summary)`: Angular rejects it and the
alias is then out of scope for the response markup. Keep aliases scoped to the
smallest response block and reference the aliased value only inside that block.

**Check:** new standalone dialog components are present in the current
`tsconfig.app.json` `files` boundary when required · no `as` alias appears on
an `@else if` · the fallback state remains reachable when the response is null.

### Sigma authenticated shell — PrimeNG (owner-approved replacement, 2026-10-22)

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

**Complete style retirement (owner2026-10-22, supersedes the earlier layout-only
slice).** `assets/sass/style.scss` composes only Sigma base, status tokens, native
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
  successful navigation. Render only one menu instance. Use logical CSS and
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
  clamp (owner clarification2026-10-24 supersedes earlier truncation).
  Rows grow naturally while fixed controls remain centered. This keeps third/deeper-level actions within the existing
  viewport without clipping their focus outlines or changing pin/chevron order
  (owner2026-10-24; source-only visual acceptance pending).
- Active sidebar rows use the existing route-derived active state in the shared
  SidebarMenuComponent (owner2026-10-23). Paint the whole custom row, including
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
### Global viewport and vertical-scroll ownership

The authenticated Sigma shell must not make the browser document and the
feature content competing vertical scroll owners. `LayoutComponent` owns the
`sigma-app-viewport` body class while the authenticated shell is active. That
class is bounded to one dynamic viewport, the flex ancestors use `min-height: 0`, and
`.app-content` is the shell's last-resort scroll owner. Under the *No page
scroll* rule below, no Sigma route may rely on it: every route fills its box and
scrolls inside its own components. The shell rule stays as the safety net:

```scss
html { height: 100%; }

body.sigma-app-viewport {
  height: 100dvh;
  min-height: 100dvh;
  overflow: hidden;
  overscroll-behavior: none;
}

body.sigma-app-viewport #kt_app_root,
body.sigma-app-viewport #kt_app_page,
body.sigma-app-viewport #kt_app_wrapper,
body.sigma-app-viewport #kt_app_main,
body.sigma-app-viewport #kt_app_main > .d-flex.flex-column.flex-column-fluid {
  min-height: 0;
  overflow: hidden;
}

body.sigma-app-viewport .app-content {
  min-height: 0;
  flex: 1 1 auto;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-gutter: stable;
}

@media print {
  body.sigma-app-viewport.app-print-content-only,
  body.sigma-app-viewport.app-print-content-only #kt_app_root,
  body.sigma-app-viewport.app-print-content-only #kt_app_page,
  body.sigma-app-viewport.app-print-content-only #kt_app_wrapper,
  body.sigma-app-viewport.app-print-content-only #kt_app_main,
  body.sigma-app-viewport.app-print-content-only #kt_app_main > .d-flex.flex-column.flex-column-fluid,
  body.sigma-app-viewport.app-print-content-only .app-content {
    height: auto;
    min-height: 0;
    overflow: visible;
    overscroll-behavior: auto;
  }

  body.sigma-app-viewport.app-print-content-only .app-content {
    flex: none;
    scrollbar-gutter: auto;
  }
}
```

Add the class in `LayoutComponent` initialization and remove it
on destruction; do not use Metronic's persistent `app-default` class as the
lifecycle boundary. Authentication and error layouts then keep normal document
flow. Do not globally hide overflow without leaving one
keyboard- and touch-scrollable content region, and do not hide the content
scrollbar merely to imitate a short screenshot. Feature pages must not add a
second page-height calculation or body scroll lock. Dialogs continue to own
their bounded internal scroll. The `app-print-content-only` override must
release the shell height and overflow so multi-page reports are not clipped;
pair it with the print lifecycle in block 21.

**A bounded route fills the container the shell already sized — it does not
recompute the page height.** The shell gives the routed content an exactly-sized
box: `.sigma-shell__content` owns the bounded content region, and its
`.sigma-shell__route` child is `flex: 1 1 auto; min-height: 0`. So the route host only
has to claim it:

```scss
:host {
  display: block;
  min-height: 0;
  height: 100%;
  overflow: hidden;
}
```

Do **not** calculate route height by subtracting header, toolbar, footer or
per-screen offsets from the viewport. The shell already owns those boundaries;
a second calculation can leave unused space or overflow when the shell changes.
Use the container-fill `height: 100%` contract above and bounded internal scroll
owners. Retired Metronic dimension variables do not describe the current shell.

The shared class `sigma-route-host` is this `:host` block (`host: { class: 'sigma-route-host' }`
in the component metadata); `Workshop/Job/components/list` is the reference. Do not repeat the
block in feature SCSS. Legacy screens still carrying a viewport calc are
unification debt: do not copy the calc, and replace it with `height: 100%` when
the feature is reviewed.

**Full available width — implementation and handoff gate (owner2026-10-26).**
For a standard shared list/editor/workspace, implement this exact ownership chain:

1. Trace the live lazy route to its actual component. Declare
   `host: { class: 'sigma-route-host' }`; the shared `src/styles.scss` owner supplies
   its block layout and container-fill height. Write no feature `:host` geometry.
2. Put the shared page (`sigma-list-page` or `sigma-editor-page`) directly inside
   that host, then its shared panel. Their normal block/column stretch fills the
   available route width, excluding only the shared page inset. Keep title,
   filters, summaries and the bounded body on that panel's logical edges.
3. Inspect the actual shared declarations **and every feature-local override**
   affecting this chain: display, flex direction/growth, grid tracks, alignment,
   width/inline-size, max-width/max-inline-size and ancestor wrappers. In
   particular, a feature `:host { display: flex; }` defaults to a row; a page
   child with default `flex: 0 1 auto` can become content-width. A shared class
   name does not cancel a more specific encapsulated host rule. Do not repair
   this by adding another width rule, `100vw`, viewport calculations or a fixed
   max-width; remove the conflicting feature geometry and reuse the shared owner.
4. If the screen has a documented multi-pane exception, put its layout on the
   **inner workspace**, preserving the outer host/page/panel contract. A new
   reusable capability belongs to the existing shared owner under Master5;
   record a source-supported exception before introducing different outer geometry.
   An approved flex-parent exception must explicitly grow/stretch its direct
   page child (`min-width: 0; flex: 1 1 auto`, or its shared equivalent) and
   preserve scroll containment and print release; it is not the standard host.
5. In the existing screen review, record the route/component, shared and local
   selectors, before/after winner and width/stretch contract at each link.
   Reconcile empty, loading, error/Retry and populated states: data must not be
   what makes the card reach full width. Keep the body/table as the single scroll
   owner. UI29 owns the responsive/visual acceptance matrix; pending browser
   verification is explicit and never inferred from class-name or syntax checks.

The Monthly Posting correction is the concrete failure example: deleting its
local flex host restores the existing shared block host. Do not copy the removed
host rule into the next screen. This gate applies to new and reviewed screens;
it does not authorize unrelated screen rewrites or browser/build execution.

#### Shared list page shell

> **Status: Canonical** — classes in `src/styles.scss`; reference `Workshop/Job/components/list`
> (owner request 2026-09-30: shared, customization kept to a minimum).

A list route writes **no** page, panel, header, alert or table-fill SCSS. It uses:

| Where | Use | Replaces the feature copy of |
|---|---|---|
| Component metadata | `host: { class: 'sigma-route-host' }` | the container-fill `:host` block above |
| Page | `<section class="sigma-list-page">` | `.feature-page` |
| Card | `<div class="sigma-list-panel">` (dark shadow included) | `.feature-panel` |
| Title | `<header class="sigma-list-header"><app-feature-title>` | header wrapper rules |
| Filters | `form[appFilterPanel]` (block 4) | the filter strip |
| Alerts | `div.sigma-alert` (danger), `sigma-alert--warning` | `.feature-alert` |
| Secondary actions | `button.sigma-secondary-button` (Export, Reset, header actions) | `.feature-secondary-button` |
| Grid | `<div class="sigma-list-table"><app-data-table [fill]="true">` (block 6) | the table wrapper and the `::ng-deep` fill block |

The chain below is what these classes implement. A screen that needs something they do not
express records it as an exception in its review; it does not restyle the shared classes.

#### Shared editor page shell

> **Status: Canonical** — classes in `src/styles.scss`; reference `Workshop/Job/components/editor`
> (step 3 of the shared-first rewrite, 2026-10-01).

A routed editor (block 13 *Modal or routed page*) writes no page, panel, alert, field, totals or
footer SCSS. It uses:

| Where | Use |
|---|---|
| Component metadata | `host: { class: 'sigma-route-host' }` |
| Page / card | `section.sigma-editor-page` > `div.sigma-editor-panel` (same values as the list shell) |
| Title | `app-feature-title` with a Back button `button.sigma-secondary-button.sigma-icon-button` in `feature-title-leading` |
| Alerts | `div.sigma-alert`, `sigma-alert--warning` |
| Form region | `form.sigma-editor-form` > `div.sigma-editor-body` — the bounded region; each pane inside owns its scroll. A one-pane editor (step form, plain record) puts its sections in `div.sigma-editor-scroll`, the single scroll owner; its children keep their content height (`flex: 0 0 auto`), so a section is never squeezed under the next one |
| Fields | `div.sigma-editor-grid` (`--sigma-editor-columns`, default 4; 2 under 1024px, 1 under 700px) of `div.sigma-field` (label + one control of exactly `--sigma-editor-control-height` — 34px, the filter height — for inputs, dropdowns, calendars and numbers; cells align to the top, so an error under one control never moves its neighbours; `sigma-field__read` for a read-only value, `--full` spans the row, `--check` for a checkbox with its label) and `app-field-error` (block 19); a file is `div.sigma-file-field` (block 18) |
| Document totals | `div.sigma-editor-totals` (`__grand` for the total) with the `money` pipe; Debit/Credit summaries use `sigma-report-summary-bar` (block 14) |
| Footer | `footer.sigma-editor-footer`: Cancel `sigma-secondary-button`, then the primary action |

The feature keeps only its workspace layout (for example Job's group list and detail panes).

**Preserve working composition during shared adoption (owner correction,
2026-10-27).** Replacing feature chrome with shared owners does not authorize
flattening an existing two-pane workspace, removing semantic field groups,
changing field spans/column counts or moving charges/totals into the same scroll.
Capture the previous composition from current source, relevant Git history and
owner evidence before replacing layout rules. Carry its pane placement, group
order, responsive behavior, internal scroll and print contracts through the
shared shell unless the owner requests a layout change or a documented defect
requires one. Record a before/after composition comparison and preserve current
business bindings; never restore whole historical files over later logic fixes.
Finding a grid declaration or using shared class names is source evidence only,
not visual acceptance (Master5; UI29). Rental Agreement's removed workspace and
Booking's flattened schedule/vehicle/customer groups are the motivating source
regressions; preserve their existing composed structure rather than copy their
old palette or fixed overlay positioning.

**Dense document header row (owner generalization, 2026-10-15).** For comparable
routed document headers, arrange short inputs in one equal-track row when the
wide-screen space supports readable controls. Include Discount with the other
short header inputs when that field belongs to the document; Notes keeps
`sigma-field--full` on a separate row. Set the existing public
`--sigma-editor-columns` to the visible field count, including conditional
fields, instead of fixed widths or feature grid CSS. Purchase Requests uses6
for General and5 for its other types; these counts are evidence, not universal
defaults. Keep the shared two-column1024px/one-column700px fallback and internal
scroll; do not force a single unreadable row at narrow widths. Preserve the
feature's actual field order, validators and data contract. Apply the complete
comparable-editor checklist in UI13 rather than adopting this row in isolation.

**Shared three-pane editor (owner request, 2026-10-04).** Job and JobEstimation
use `form.sigma-editor-form--three-pane` and
`div.sigma-editor-body--three-pane` with three rendered siblings:
`sigma-editor-pane--master`, `sigma-editor-pane--jobs`, and
`sigma-editor-pane--detail` (each also `sigma-editor-pane`). The shared owner
in `src/styles.scss` uses 240–280px / 170–200px / remaining-width columns,
10px gaps and bounded full-height panes. Master fields use
`sigma-editor-grid sigma-editor-pane-fields` inside `sigma-editor-scroll`
for one field column; the Jobs list and selected detail retain their own
internal scroll, fixed summary and outside Save/Cancel footer. An Angular
`ng-container formArrayName` groups the latter two without a DOM grid wrapper,
preserving the existing control hierarchy. A named inline-size container on
the form responds to available width: at 900px the master spans the first
column and Jobs/details stack in the second; at 620px all three stack in source
order. Print releases this layout. Features do not copy these grid/breakpoint
rules. One component serves Create/Edit/View; content and financial contracts
remain unchanged. Source-only; owner desktop/narrow/RTL/print acceptance pending.

**Check boxes (G9, 2026-10-01).** Every boolean field is its own
`<div class="sigma-field sigma-field--check">` with the input before its label. Two check boxes
never share one field or one label.

#### No page scroll — one scroll owner per region

Owner requirement (2026-09-28): **the page never scrolls, at any breakpoint.**
`.app-content` must not show a scrollbar. Only components scroll, each inside
its own bounded box:

```text
.sigma-route-host        height: 100%; overflow: hidden        (container-fill, above)
 └ .sigma-list-page      flex column; min-height: 0; overflow: hidden
    └ .sigma-list-panel  flex column; min-height: 0; overflow: hidden
       ├ .sigma-list-header / app-feature-title   flex-shrink: 0   (fixed, block 3)
       ├ form[appFilterPanel]                      flex-shrink: 0   (fixed, block 4)
       └ .sigma-list-table   flex: 1 1 auto; min-height: 0; overflow: hidden
          └ app-data-table [fill]   rows are the single scroll owner, paginator fixed (block 6)
```

An editor or workspace that is not a list uses the same chain with its own region
(form pane, master/detail pane) as the scroll owner, until the shared editor page shell
(step 3 of the shared-first plan) exists.

- A region has exactly **one** vertical scroll owner: grid rows (block 6), a
  form or master/detail pane (blocks 12 and 14), or the dialog body (block 13).
  Never nest two scroll owners for the same content.
- Narrow widths rearrange panes (stacking, fewer filter columns) but never hand
  scrolling back to the page. Do not switch outer containers to
  `overflow: visible` and do not add content-sized minimum heights at a
  breakpoint.
- The panel is the primary card, `sigma-list-panel`. Its padding, border, surface, shadow,
  gap and dark values live in `src/styles.scss`; do not restate them in a feature or in
  review notes. Legacy `.card` / `.card-body` wrappers are not used.

#### Base component

List and details components extend `BaseComponentService`
(`shared/service/base-component.service.ts`). It already provides `loading`,
`router`, and `activatedRoute`, so do not inject a second `Router`. It also
exposes `subscriptionId`, read from `localStorage`. Never put that value in a
request payload: the tenant is server-owned, and the per-screen cleanup is block 2
*Write payloads carry client inputs only* (backlog 8 and 19).

#### Retired Metronic shell instructions

The former toolbar-band geometry, cached layout configuration and
`--bs-app-toolbar-height` synchronization instructions were removed on
2026-10-23 after complete vendor retirement. They described deleted shell/Sass
owners and must not guide current work. Current shell composition is owned by
this block's *Supported platform and root composition* and *Sigma authenticated
shell — PrimeNG* sections, together with the container-fill/no-page-scroll contract above.
The decision and source reconciliation remain in
`reviews/Archive/Completed/2026-10-23/COMPLETE_VENDOR_RETIREMENT_FINAL_RECONCILIATION.md`.

Reducing space above a card changes the route's outer inset or current shell
placement, not the card's internal padding. Shared owners retain the card's
internal inset; changing it moves its contents without moving the card edge.

**Routed editor pages:** a record that block 13's decision rule (D4-2) sends to a page uses the
shared editor page shell above: container-fill host, `min-height: 0`, `overflow: hidden`, a fixed
`sigma-editor-footer` outside the form body, and only the panes inside `sigma-editor-body` own
vertical scroll. Records the rule keeps in a modal use `app-editor-dialog` (block 13).
**Routed settings-workspace exception:** when a routed settings or account-mapping
workspace is designed without main-page scrolling (every Sigma route is, under
*No page scroll*), bound the route surface with the container-fill host and use
`overflow: hidden` on the route/card flex chain. Keep the
feature header, Save action, workspace tabs and compact search/filter controls
outside the scrolling region. Exactly one feature-owned content viewport may use
`overflow-y: auto`; child sections and editable tables must grow naturally and
must not add a second vertical scrollbar unless a separately bounded collection
is an explicit business requirement. Horizontal tab/table overflow remains
allowed. On narrow screens, preserve this single vertical-scroll owner rather
than falling back to nested page + child scrolling.

**Routed financial collection editors** (Opening Balances) follow the same container-fill chain;
the editable table is the row-scroll owner through `[fillHeight]` + `[stickyHeader]` (block 14).
The former route-level `calc(100dvh - …)` grow-until-cap boundary is legacy and is removed in
the screen's review.

### Hierarchy tree workspace — canonical composite

Use this shape only when the domain is intrinsically hierarchical and the primary
operation is navigating parent/child nodes, not paging flat records. The canonical
reference is `Accounts/Account/components/list` with its embedded
`components/details` pane. A hierarchy tree is a deliberate exception to the
standard `app-data-table` list pattern; do not flatten it merely to reuse Grid
chrome.

Required composition:

- one `app-feature-title` inside the workspace card; do not duplicate the title in
  the Metronic toolbar;
- a compact toolbar containing search plus neutral Expand All / Collapse All
  actions; search controls consume `--sigma-filter-control-height`;
- one tree navigation region with `min-height: 0` and internal vertical scrolling;
- each child level adds a clear logical-axis indentation; the current Chart of Accounts reference uses `2rem` `padding-inline-start` per nested level plus a subtle `border-inline-start`/connector line. Keep the value large enough that parent/child depth is obvious without wasting horizontal space, and implement it with logical properties so RTL mirrors correctly;
- one embedded detail/editor pane for the selected node or Add Child workflow;
- desktop may use a tree/detail split; at narrow breakpoints stack the detail pane
  below the tree instead of forcing two unusably narrow columns;
- tree selection is navigation. Nested Add/Delete/Edit controls must stop
  propagation so they do not also select/open the node;
- preserve expanded ancestors when restoring a selected node after Save/Delete;
- a local tree search may filter already-loaded nodes and retain matching ancestors;
  it must not pretend to be server paging or a complete server-side search;
- root/fixed nodes and leaf/parent capabilities come from backend/domain state.
  Hide unavailable mutations or explain the restriction; do not infer permissions
  from indentation or label text when typed metadata exists;
- use `ConfirmationDialogService` for destructive actions and shared primary
  actions for Create/Save. Do not add feature-local `p-confirmDialog` markup;
- every tree/detail request handles declared and transport failures and releases
  loading in `finalize`;
- server-owned tenant/subscription, generated codes, hierarchy level and other
  protected values are never added to write payloads merely because the detail
  response contains them;
- use logical CSS properties, visible focus, translated accessible labels, and
  light/dark tokens. Avoid inline `style`, DOM `onmouseover/onmouseout`, and raw
  English tooltips in a refactored hierarchy workspace.

Viewport contract: the workspace participates in the existing authenticated shell
and may be bounded like other dense editors. The outer page/card/detail ancestors
use `display:flex`, `min-height:0`, and `overflow:hidden`; the tree viewport is the
single vertical scroll owner for hierarchy rows. Do not make the browser page and
the tree compete for the same row scrolling.

For Chart of Accounts specifically, preserve these domain-facing UI rules from the
backend contract: Level 1 accounts are fixed, Level 5 accounts are leaves, parent
identity is immutable on update, accounts with children/transactions may block
specific mutations, and Add Child is offered only when the selected parent may
accept children. These are reference-specific examples, not universal tree rules.

**Check:** true hierarchy confirmed · no `app-data-table` conversion · one feature
title · compact toolbar · internal tree scroll · responsive tree/detail split ·
selection restored after refresh · nested actions stop propagation · shared
confirmation/actions · `finalize` cleanup · both failure channels · no server-owned
write fields · translated RTL/dark/focus states.

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
or change Drawer mask/focus ownership merely to preserve state (owner2026-10-24).
The shared adapter
honors optional MenuItem.autoExpandOnActive (default true). The main
Reports group sets false (owner2026-10-23), so duplicate report links do not
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
### Working-branch bootstrap and switch safety (2026-10-18)

Root CurrentBranchService owns branch state and authenticated-session lifetime;
by default the content outlet waits for its initial read to settle so UI16 defaults exist
before a screen's first query. Read failures remain visible in the topbar with
Retry; they do not invent a preference. Changing a branch commits the returned
selection only after a successful single-flight save, keeps the previous branch
on failure, and ignores an ended/replaced session's response, including logout
and re-login to the same account. It uses the one interceptor-equipped client.

**Explicit branch-independent reads (owner2026-10-25).** Route data may set
`requiresBranchContext: false` only when its real request is independent of
working-branch defaults; Dashboard/Snapshot's ownership/fleetType-only tenant
read is the approved consumer. `showPageLoading: false` additionally chooses
silent page presentation; both policies default to true when omitted. The
Layout reads actual deepest active-route data at initialization/NavigationEnd,
preserves session recovery, and never resets a global loading counter to hide
an overlay. Header branch error/Retry and branch-save/write/inert guards remain.
The existing navigationPolicyGuard enforces branch readiness before activating
dependent targets, including an immediate departure from Dashboard during
branch bootstrap. Reuse CurrentBranchService's finite, coalesced load; its
forkJoin value precedes readiness finalize, so resume activation via the
firstValueFrom Promise continuation after that synchronous completion/finalize,
then recheck write/saving guards. An initial failed attempt still settles under
the existing header recovery contract; do not invent a selected branch.

**Branch auxiliary read motion (owner2026-10-25).** ShellHeader binds the real
CurrentBranchService.loading state (Options/Mine finite forkJoin/finalize) to
PrimeNG Select's public loading input and loadingicon template. Owner2026-10-26
unifies request-loading appearance: UI22's shared ring replaces the earlier
UI24 PendingMotion trigger; keep confirmed labels, disabled
guards, aria-busy, Result/HTTP errors, Retry and save state. Below360px header
width the branch trigger usually hides its dropdown icon; its data-loading
exception shows only that same motion trigger inside the unchanged32px control
until loading ends. Do not hide the indicator behind the compact CSS or add a
second progress owner. Requests remain local auxiliary reads, not global page
loading or newly opted-in reference-cache reads.

The topbar checks currently rendered canonical editor boundaries (routed
sigma-editor-page, step-form, appMockData form roots and PrimeNG dialog portals)
before permitting a switch. Hidden/unmounted surfaces do not block. This is a
UI safety guard, not authorization or a substitute for existing dirty-discard
rules. Close the editor first; switching never discards it. While saving, the
shell wrapper is inert; existing screen values are not rewritten afterward.
New editor shapes must be reconciled with this shared safety boundary. Shared
bilingual UserGuide guidance describes saved defaults, failures and deferred
permissions. Source conformance and owner interaction/visual acceptance remain
separate; see CURRENT_BRANCH_DEFAULTS artifacts.

**Stable rendered-editor state (owner NG0100 evidence, 2026-10-20).** Do not
evaluate the live DOM boundary predicate from navbar disabled/title/aria or
conditional template bindings: a routed editor or dialog can mount after the
navbar was checked and change the answer during Angular's verification pass.
CurrentBranchService exposes readonly editorOpen for presentation. Its installed
Angular21 afterEveryRender(read) observer coalesces one deferred microtask, re-reads
the same rendered-boundary predicate, and publishes in NgZone only on change;
DestroyRef prevents a queued publish after teardown. Keep hasOpenEditor() live
at change()/Retry action boundaries so a pending presentation update cannot
permit switching over a newly opened editor. No timer polling, forced
detectChanges, feature-specific Bill guard or weakening of the editor boundary.
Shared EN/AR guidance covers block/re-enable behavior; source-only verification
does not prove the owner's open/close/navigation runtime acceptance.

### Supported platform and root composition (2026-10-22)

The supported platform baseline is Angular21 with PrimeNG21. The root is a
standalone `AppComponent`, bootstrapped by `bootstrapApplication` in `main.ts`;
`app.config.ts` owns providers and `app.routes.ts` owns root routes. Existing
lazy feature NgModules remain supported interoperability boundaries. New
features use standalone components and route files; do not recreate AppModule
or duplicate the root client. Preserve `withHashLocation`, token/error
interceptor order, the auth startup completion, Zone-based change detection
and service-worker registration while modernizing wiring. Zoneless adoption
needs a separate change-detection audit; Angular21's new-app default alone
does not establish compatibility for existing imperative third-party consumers.

#### Angular21 adoption review gate (2026-10-26)

For every new or reviewed screen, record Angular adoption against each actual
routed list, editor and dialog consumer. Separate the version declared by
`package.json`/the lock file, the exact installed package version, and runtime
evidence such as Angular's `VERSION.full` from an authorized running deployment;
none substitutes for the others. A matching major version or the presence of
one modern API does not prove that a consumer is fully modern. Start at the
active route import and trace the real component before classifying it.

Angular21 components are standalone by default, so absence of
`standalone: true` is not evidence of NgModule ownership. Establish ownership
from `standalone: false`, declarations/imports and the actual lazy route graph;
retained lazy NgModules remain valid compatibility boundaries. For each consumer,
record source evidence for built-in control flow, typed `signal`/`computed`
state and `inject` where they improve the existing design. Treat compatible
constructor injection, observable state and existing control-flow syntax as
valid exceptions rather than reasons for cosmetic rewrites.

Audit subscription and request lifetime separately: finite completion prevents
an indefinitely retained subscription, but does not establish safe cancellation
on route departure or prevent a late callback from changing a destroyed view.
Apply UI28's actual HTTP/callback cancellation contract to finite reads too.
Retained subscriptions should use `takeUntilDestroyed` or an equally explicit
existing owner; source-driven reads
whose newer value supersedes an older request should use `switchMap` or the
screen's established equivalent cancellation. Do not infer correct cancellation
from an import alone. Signal queries such as `viewChild` are stable and preferred
for new code, while decorator queries remain fully supported; migrate an
existing `@ViewChild` only when the consumer benefits and preserve the required
`read` token and timing contract.

Typed reactive forms remain a supported Angular21 choice. Signal Forms are a
separate experimental v21 API and are not a default migration target. Likewise,
`httpResource`, zoneless change detection and blanket `OnPush` conversion are
not screen-modernity requirements. Audit `OnPush` only as a measured migration
with input identity, imperative callbacks, overlays and third-party controls in
scope. Preserve Sigma's explicit `provideZoneChangeDetection` setting unless a
separately authorized change-detection audit proves the replacement safe.

Finally, confirm one root provider composition and one interceptor-equipped
`HttpClient`; a feature must not create a parallel client/provider chain. Record
per-consumer conformance, supported compatibility exceptions and pending runtime
evidence. Use the Angular21 documentation for v21 behavior and status; the
unversioned current documentation may supplement stable API semantics but must
not silently replace the supported-version contract:

- [Angular21 components and standalone default](https://v21.angular.dev/guide/components)
- [Angular21 standalone bootstrap](https://v21.angular.dev/api/platform-browser/bootstrapApplication)
- [Angular21 built-in control flow](https://v21.angular.dev/api/core/%40if)
- [Angular21 signals and computed state](https://v21.angular.dev/essentials/signals)
- [Angular21 inject API](https://v21.angular.dev/api/core/inject)
- [Angular21 RxJS interop API index](https://v21.angular.dev/reference)
- [Current stable takeUntilDestroyed API](https://angular.dev/api/core/rxjs-interop/takeUntilDestroyed)
- [Angular21 queries and supported decorator queries](https://v21.angular.dev/guide/components/queries)
- [Angular21 reactive forms overview](https://v21.angular.dev/guide/forms)
- [Angular21 experimental Signal Forms](https://v21.angular.dev/tutorials/signal-forms)
- [Angular21 root HttpClient provider](https://v21.angular.dev/api/common/http/provideHttpClient)
- [Angular21 change-detection performance guidance](https://v21.angular.dev/best-practices/performance)
- [Angular21 runtime Version API](https://v21.angular.dev/api/core/Version)

The application builder preserves the existing flat `dist/sigma` deployment
through `outputPath: { base: 'dist/sigma', browser: '' }`, assets/web.config,
service-worker configuration and production budgets. Runtime entries remain
explicit in `tsconfig.app.json`; Jasmine specs belong to `tsconfig.spec.json`.
For official schematics that incorrectly resolve project paths relative to an
explicit source `rootDir`, use a temporary workspace-root setting, run the
schematic, then restore the exact original setting. Never patch library code
or weaken compilation to hide a migration failure. Build authorization and
manual runtime acceptance remain governed by AGENTS/Master7. Historical
Angular17/18 references elsewhere record earlier compatibility evidence;
current Angular21 declarations own new API choices. The recurring render hook
is `afterEveryRender({ read: ... })`; preserve deferred/coalesced publication
in CurrentBranchService instead of reintroducing mutable DOM template reads.
Angular21 effects already permit signal writes; remove the deprecated inert
allowSignalWrites option without changing callbacks or scheduling. Do not copy
the old flag into a new effect or use its removal to justify changing business state.

### Standalone migration dependency gate

After converting a declaration to standalone, remove an import of its former
owning NgModule when the template no longer needs it. A component importing that
module while the module imports/exports the component creates a runtime metadata
cycle, even when application compilation succeeds. Also remove unused parent
component imports introduced by a schematic. Audit components **and** NgModule
imports/exports/declarations, then exercise real lazy login/root and shell metadata
through the authorized test/runtime workflow. The Angular21 Header/Layout,
Notifications/Extras, Card1/Cards, ChatInner and DropdownMenus cases are verified
examples. No schema/diagnostic suppression or speculative provider change.

A template reference on a custom component host (including form[appMockData])
returns that component, not its DOM element. When a focus/scroll owner needs the
native element, query with explicit read:ElementRef; a TypeScript ElementRef type
annotation does not change Angular's runtime query result. Preserve component
queries where the consumer needs the component API. LeaseAgreement's invalid-save
form focus is a verified native-query example; do not add a fake nativeElement
alias to the shared form component to accommodate a mismatched query.

### One `HttpClient`

> **Status: Canonical** (2026-09-30, backlog 17 resolved)

`app.config.ts` provides the only application `HttpClient`:

```ts
providers: [
  provideHttpClient(withInterceptors([tokenInterceptor, errorInterceptor, navigationActivityInterceptor])),
  …
],
```

Every service resolves it, so `providedIn: 'root'` is enough; a feature service no longer needs
an entry in `LayoutModule.providers` (that list is legacy and is removed gradually, not
extended). Both interceptors act only on Sigma API requests (`isSigmaApiRequest`: the URL
starts with `environment.baseUrl`). The login server, assets and third-party URLs pass
through untouched. For an API request:

- `tokenInterceptor` adds `Authorization: Bearer …` when a token is stored, and
  `Accept-Language` from the UI language (`ar` → `ar-SA`, else `en-US`), so backend
  messages follow the UI;
- `errorInterceptor` presents every failure and the standard success toast (block 22).
- `navigationActivityInterceptor` owns subscribed Sigma write activity and page-read
  cancellation through the shared navigation policy (blocks 10, 22 and 28).

Do not add a feature-level `provideHttpClient(...)`, import `HttpClientModule` in a feature
module, or set a manual `Authorization` header. The lazy `AuthModule` also resolves the root
client; Sigma-only interceptors bypass login-server URLs. When one request alone gets `401`, check the token and that its URL is built
from `environment.baseUrl`.

**Check:** routes file exists · route count matches the editor shape · `models/`
has the files its shape needs · lazy route registered · services are `providedIn: 'root'` and API URLs start with `environment.baseUrl` · no
feature `provideHttpClient` chain or `HttpClientModule` import · no
manual Bearer header workaround · menu entry.

**Do not copy from** `Companies/Company`, `Companies/CompanyContactPerson`,
`Companies/CompanyDriver`. Dead scaffolding: `/menu/products` columns, empty
action bodies, `console.log("Delete2")`, 0-byte SCSS.

---
