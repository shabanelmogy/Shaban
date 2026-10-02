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

The shared class `sigma-route-host` is this `:host` block (`host: { class: 'sigma-route-host' }`
in the component metadata); `Workshop/Job/components/list` is the reference. Do not repeat the
block in feature SCSS. Legacy screens still carrying a viewport calc are
unification debt: do not copy the calc, and replace it with `height: 100%` when
the feature is reviewed.

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
### One `HttpClient`

> **Status: Canonical** (2026-09-30, backlog 17 resolved)

`app.module.ts` provides the only application `HttpClient`:

```ts
providers: [
  provideHttpClient(withInterceptors([tokenInterceptor, errorInterceptor])),
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

Do not add a feature-level `provideHttpClient(...)`, import `HttpClientModule` in a feature
module, or set a manual `Authorization` header. The lazy `AuthModule` keeps its own client for
the login server. When one request alone gets `401`, check the token and that its URL is built
from `environment.baseUrl`.

**Check:** routes file exists · route count matches the editor shape · `models/`
has the files its shape needs · lazy route registered · services are `providedIn: 'root'` and API URLs start with `environment.baseUrl` · no
feature `provideHttpClient` chain or `HttpClientModule` import · no
manual Bearer header workaround · menu entry.

**Do not copy from** `Companies/Company`, `Companies/CompanyContactPerson`,
`Companies/CompanyDriver`. Dead scaffolding: `/menu/products` columns, empty
action bodies, `console.log("Delete2")`, 0-byte SCSS.

---

