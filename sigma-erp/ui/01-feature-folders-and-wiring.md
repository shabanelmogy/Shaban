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

2. Service in `_metronic/layout/layout.module.ts` `providers` — see below.

3. Menu entry, or the page is reachable only by typing the URL.

### Standalone dialog registration and Angular 17 control flow

This application currently has an explicit `files` boundary in
`SiGmaAngularFrontEnd/tsconfig.app.json`. When a new standalone dialog or
feature component produces Angular's “missing from the TypeScript compilation”
diagnostic, add its exact `.component.ts` path to that `files` array, following
the existing LeaseAgreement dialog entries. Do not replace the project boundary
with a broad include glob, and do not add models, HTML, or SCSS files there;
their component imports own their compilation. A missing component root can
also make a valid standalone import appear “not statically analyzable” in the
parent component's `imports` array.

Use Angular 17 built-in control flow consistently. An `as` alias is allowed
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

Never write `@else if (summary(); as summary)`: Angular 17 rejects it and the
alias is then out of scope for the response markup. Keep aliases scoped to the
smallest response block and reference the aliased value only inside that block.

**Check:** new standalone dialog components are present in the current
`tsconfig.app.json` `files` boundary when required · no `as` alias appears on
an `@else if` · the fallback state remains reachable when the response is null.

### Global viewport and vertical-scroll ownership

The authenticated Metronic shell must not make the browser document and the
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

Add the class in `LayoutComponent` initialization/config refresh and remove it
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
box: `.app-content` is `flex: 1 1 auto` inside the content wrapper, and its
`.app-container` child is `flex: 1 1 auto; min-height: 0`. So the route host only
has to claim it:

```scss
:host {
  display: block;
  min-height: 0;
  height: 100%;
  overflow: hidden;
}
```

Do **not** write `height: calc(100dvh - var(--bs-app-header-height) -
var(--bs-app-toolbar-height) - var(--bs-app-footer-height) - <slack>)`. That is
the "second page-height calculation" this rule forbids, and it is wrong by
construction: the shell sizes the toolbar from the toolbar's own padding
(`toolbar.fixed` is `false`, so Metronic forces `height: auto`), while the calc
reserves a fixed `--bs-app-toolbar-height`, which is a *reservation* the shell
keeps in step with the band by hand (`31px` desktop, `55px` base — see *Shell
vertical insets* below) rather than a measurement of it. The two agree only by
maintenance, and the per-screen `<slack>` is the fudge factor absorbing whatever
is left —
a number that cannot stay correct, because the toolbar's real height depends on
whether a page title resolves at runtime. The visible symptom is a strip of dead
space above the footer (calc too short) or a scrollbar in `.app-content` (calc too
long), and it changes whenever the shell's toolbar or footer is touched.

`Rental/RentalPlanner` and `Staff/designations` are the reference implementations
of the container-fill host. Legacy screens still carrying a viewport calc are
unification debt: do not copy the calc, and replace it with `height: 100%` when
the feature is reviewed.

#### No page scroll — one scroll owner per region

Owner requirement (2026-09-28): **the page never scrolls, at any breakpoint.**
`.app-content` must not show a scrollbar. Only components scroll, each inside
its own bounded box:

```text
:host                 height: 100%; overflow: hidden        (container-fill, above)
 └ .feature-page       display: flex; flex-direction: column; min-height: 0; overflow: hidden
    └ .feature-panel   display: flex; flex-direction: column; min-height: 0; overflow: hidden
       ├ app-feature-title        flex-shrink: 0        (fixed)
       ├ .feature-filters         flex-shrink: 0        (fixed, block 4)
       └ .feature-table-wrapper   flex: 1 1 auto; min-height: 0; overflow: hidden
          ├ grid rows              the single scroll owner (block 6)
          └ paginator / actions    flex-shrink: 0        (fixed at the bottom)
```

- A region has exactly **one** vertical scroll owner: grid rows (block 6), a
  form or master/detail pane (blocks 12 and 14), or the dialog body (block 13).
  Never nest two scroll owners for the same content.
- Narrow widths rearrange panes (stacking, fewer filter columns) but never hand
  scrolling back to the page. Do not switch outer containers to
  `overflow: visible` and do not add content-sized minimum heights at a
  breakpoint.
- The panel is the primary card: `padding: 6px 12px`, `border: 1px solid
  var(--sigma-border)`, `border-radius: 4px`, `background: var(--sigma-surface)`,
  `box-shadow: var(--sigma-panel-shadow, 0 1px 3px rgb(35 48 62 / 8%))`, with a
  small `gap` between its children and dark-theme values under `:host-context`.
  Legacy `.card` / `.card-body` wrappers are not used.

#### Base component

List and details components extend `BaseComponentService`
(`shared/service/base-component.service.ts`). It already provides `loading`,
`router`, and `activatedRoute`, so do not inject a second `Router`. It also
exposes `subscriptionId`, read from `localStorage`. Never put that value in a
request payload: the tenant is server-owned (backlog 8 and 19).

#### Shell vertical insets — where the gap above the content comes from

`.app-content` must carry **no vertical padding**, and in the active shell it
does not. The default layout config is `LightSidebarConfig` (pinned in
`layout.service.ts`), which sets `toolbar.fixed` and `footer.fixed` to `false`,
so Metronic's
`[data-kt-app-toolbar-enabled=true]:not([data-kt-app-toolbar-fixed=true]) .app-content`
and `:not([data-kt-app-footer-fixed=true]) .app-main .app-content` rules both
match and pin `padding-top` and `padding-bottom` to `0`. Do not add a shell
content inset here; a route owns its own inset.

The band that remains between the toolbar and the routed content is the
**toolbar's own vertical padding**, and it is the whole of the toolbar's vertical
size rather than a slice of it: the layout config sets
`app.toolbar.class: 'py-3 py-lg-6'` — `12px` on mobile but `24px` from `992px`
up — while `toolbar.fixed` is `false`, which makes Metronic's
`body:not([data-kt-app-toolbar-fixed=true]) .app-toolbar { height: auto }`
(`assets/sass/layout/_toolbar.scss`) win over the base
`.app-toolbar { height: var(--bs-app-toolbar-height) }`. So `padding` moves the
band one-for-one; there is no fixed `55px` box absorbing it. Do not size this band
from `--bs-app-toolbar-height` — the variable does not size the toolbar here. It
is a *reservation* other screens read, and it is kept in step with the padding by
hand (see the companion rule below).

The toolbar does render real content: `toolbar.component.html` shows
`app-page-title`, and `showPageTitle()` returns true for the `classic` layout
(the active one) on any route not on its exclusion list. Its alternative toolbar
layouts (accounting, extended, reports, saas) are commented out, so the page
title is the only content.

It is tightened in `src/styles.scss`, desktop only, from the layout config's
`py-lg-6` (`24px` / `24px`) to `16px` above and `8px` below:

```scss
@media (min-width: 992px) {
  .app-toolbar {
    padding-top: 16px !important;
    padding-bottom: 8px !important;
  }

  /* 55px (Metronic base) minus the 24px the band gave back. */
  :root {
    --bs-app-toolbar-height: 31px;
  }
}
```

The top keeps the title off the app header; the bottom is the gap between the
title and the routed card, so it only needs a hairline. Mobile is left alone —
`py-3` is already `12px` / `12px`.

**The `--bs-app-toolbar-height` companion is not optional, and this is the trap.**
34 feature stylesheets still size their page with the forbidden
`calc(100dvh - … - var(--bs-app-toolbar-height) - … - <slack>)`, so they reserve a
fixed height for this band. Reducing the band by `N` without reducing that
reserved height by `N` leaves each of those routes `N` taller than its container —
a scrollbar in `.app-content` — including five sibling Movements screens on the
same review branch. The variable has **no other live consumer**: every other use
in the Metronic SASS is gated on `toolbar.fixed` / `toolbar.sticky`, both off here,
so changing it moves nothing else.

A route built on the container-fill host is immune to this band. As those 34
screens migrate, the companion override can be deleted.

**Changing this band is a shell-level change.** It is allowed, but only with the
companion kept in step, and only after checking which routes still compute their
own height:

```
grep -rl "bs-app-toolbar-height" --include=*.scss src/app/modules | wc -l
```

The screen-scoped levers are the route's own outer padding and, if a route still
computes its height, its own `slack` — never the card's internal inset.

**Reduce the gap above a card by removing the OUTER gap — never the card's
internal inset.** "Make the card higher / reduce the space between the card and
the TopBar" means the distance *outside* the card: the route's outer padding (and,
once a route is container-filled, the toolbar band above it). It does **not** mean
the card's `padding`, which is the gap between the card's border/shadow and its
own contents. Trimming the internal inset moves the contents, not the card: the
card's outer edge stays exactly where it was, the border and shadow visibly crowd
the first child, and the requested change appears to have done nothing. A route
that pulls its card upward keeps a full internal inset and sets only its outer
vertical padding to `0`.

Keep any shell override in the stylesheet rather than in the layout config: the
layout service caches its config under `<appVersion>-layoutConfig` in
`localStorage`, so a config edit can be invisible to a browser that already stored
one. `styles.scss` imports the Metronic SASS at the top of the file, so a rule
added later in that file wins the cascade.

**Check:** `.app-content` carries no vertical padding · the toolbar band is the
layout config's value on mobile and the single desktop override (`16px` above /
`8px` below) from `992px` up · no feature stylesheet overrides the toolbar band ·
`--bs-app-toolbar-height` is kept in step with that band, because the routes that
still compute their own page height reserve a fixed height from it · the toolbar
is sized by its padding and not by `--bs-app-toolbar-height` · a route does not
repeat the shell inset · the gap between the toolbar and the first card is the
route's own outer padding and nothing else · the space above a card was reduced by
changing outer padding (shell band or route padding), never the card's internal
`padding` or the shadow · the card's internal `padding` is unchanged from its
designed value · changing the toolbar band was checked against the routes that
still compute their own page height, because it moves every one of them.

**Routed full-page editor exception:** when a feature has an explicitly
approved independently addressable Create/Edit/View route, the editor may use a
container-fill host (`height: 100%`, see *No page scroll* below). The host must use
`min-height: 0` and `overflow: hidden`; its action footer is a fixed-height
flex sibling of the form body, and only a deliberately bounded child collection
frame may own vertical row scrolling. This exception does not change block 13's
rule that ordinary list-owned CRUD uses the shared editor dialog.
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

**Routed financial-editor exception:** a dense routed accounting editor such as
Opening Balances may use one route-level grow-until-cap boundary and make its
editable table frame the row-scroll owner after that cap is reached. Keep the
feature title, workspace tabs, state/context banner, compact filters, totals and
Save action outside the row-scroll frame. The route may calculate the cap once
from the existing shell variables; child tabs/forms must not repeat viewport
math or add a second vertical scroll owner. Block 14 defines the full financial
editor contract.

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
### Why the service must be in `LayoutModule` providers

**Transitional.** This is a consequence of how the app currently provides
`HttpClient`, not an Angular rule. Verified chain, 2026-08-06:

| Where | What it provides | Interceptors |
|---|---|---|
| `app.module.ts` imports `HttpClientModule` | root `HttpClient` | **none** — no `HTTP_INTERCEPTORS` are registered anywhere |
| `app-routing.module.ts` path `''` | lazy-loads `LayoutModule` behind `AuthGuard`, creating a child injector | — |
| `layout.module.ts` providers call `provideHttpClient(withInterceptors([tokenInterceptor, errorInterceptor]))` | a second `HttpClient` in that child injector | `tokenInterceptor`, `errorInterceptor` |

So there are two `HttpClient` instances. Angular resolves from the nearest
injector, which means:

- a service listed in `LayoutModule.providers` is instantiated in the lazy child
  injector and receives the **interceptor-equipped** client;
- a service that is only `providedIn: 'root'` resolves the root instance and
  receives the **interceptor-free** client, so its requests carry no
  `Authorization` header;
- a service marked `providedIn: 'root'` **and** listed in `LayoutModule.providers`
  is fine for components inside the layout — the layout provider wins. Company
  and Staff both do this.

Also note `main.ts` imports `bootstrapApplication`, `provideHttpClient` and
`withInterceptors` but never calls them; the app boots through
`platformBrowserDynamic().bootstrapModule(AppModule)`. Those imports are dead.

Until this is centralised (block 30, item 17), register every authenticated
feature service in **exactly** `_metronic/layout/layout.module.ts` →
`LayoutModule.providers`, because that injector currently owns the
`provideHttpClient(withInterceptors([tokenInterceptor, errorInterceptor]))`
chain. Do not register the same service only in `AppModule`, a feature module, a
component `providers` array, another layout-like module, or another injector and
assume the token interceptor will follow it. A provider in the wrong injector can
resolve the root interceptor-free `HttpClient` and silently send protected
requests without `Authorization`.

"Every authenticated feature service" includes each service a screen
**borrows** from another feature, such as a lookup's `getSelectList`, not only
the screen's own service. `providedIn: 'root'` alone is not enough. Found
2026-09-28: Labour Tariff injected `StaffProfileService`, which no other screen
used and which was missing from `LayoutModule.providers`; the screen showed its
lookup error (source diagnosis: the `GetSelect` request resolves the root
`HttpClient` and carries no token; the backend `SelectAsync` itself returns
success). For every service a new or refactored component injects, confirm
that a provider entry exists; when a lookup fails, check the HTTP status first
(skill §6, "Lookup Failure Diagnosis").

Do not fix this locally by adding a manual `Authorization` header or by creating
another feature-level `provideHttpClient(...)`. Both approaches create another
HTTP ownership fork and make interceptor behavior harder to reason about. The
temporary rule is one authenticated provider location; the permanent fix is item
17: provide the interceptor chain once at application root and remove the large
Layout provider list.

**Check:** routes file exists · route count matches the editor shape · `models/`
has the files its shape needs · lazy route registered · every authenticated
feature service resolves from `_metronic/layout/layout.module.ts` providers until
item 17 is fixed · no duplicate/alternate feature `provideHttpClient` chain · no
manual Bearer header workaround · menu entry.

**Do not copy from** `Companies/Company`, `Companies/CompanyContactPerson`,
`Companies/CompanyDriver`. Dead scaffolding: `/menu/products` columns, empty
action bodies, `console.log("Delete2")`, 0-byte SCSS.

---

