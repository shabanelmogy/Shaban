# Sigma UI Pattern Book — Draft Canonical

| | |
|---|---|
| Status | **Draft canonical.** Binding for new work; open items in block 30 |
| Version | 0.57 |
| Last verified against source | 2026-09-18 |
| Verified by | source inspection only — no build, test, or browser run |

One page per UI building block. Every block has a **reference file** you can
open, a **copy-this** snippet from real code, and a short **check** list.

Paths are relative to `SiGmaAngularFrontEnd/src/app/modules`.

This book answers "how do I build the next screen so it matches", and it is the
single authority for Angular work. The companion for server-side work is
`SIGMA_BACKEND_PATTERNS.md`; the two share the ListVM, filter and payload
contracts, so a change to either side is a change to both.

Review orchestration, screenshot evidence, phase ownership, contract artifacts,
and final reconciliation are defined by `SIGMA_FEATURE_REVIEW_MASTER.md`. This
book remains the Angular implementation authority incorporated by that master.
Screenshots supply functional and content evidence only; they do not override
this book's component, layout, accessibility, RTL, theme, or responsive rules.

### Application-wide visual consistency invariant

Sigma uses one visual language across the application. For the same UI role,
features must consume the same shared component, appearance variant, design
tokens, density, border radius, focus treatment, icon treatment, RTL behavior
and dark-theme behavior. A feature must not invent a second visual treatment for
Tabs, Dropdowns, Inputs, Buttons, Filters, Tables, Cards, Dialogs, Confirmations,
Loading/Error states or other repeated controls merely because local CSS can
produce it.

When an approved screen exposes a reusable visual pattern, move that pattern to
the owning shared component or shared token first, then make all in-scope
consumers use it. Do not copy the reference feature's CSS into another feature.
`app-editor-tabs appearance="workspace"` is the canonical routed-workspace tab
appearance used by Opening Balances and Link Accounts. Canonical PrimeNG
Dropdowns use one wrapper border, `6px` radius, shared surface/text/border
tokens, the common primary focus ring, and the shared `34px` filter height or
`36px` editable-row height according to context.

Existing legacy screens may still contain older visual forks. Treat those as
unification debt: do not copy them, and replace them with the canonical shared
pattern when the feature is reviewed or modified. A deliberate visual exception
must be named by UI shape in this book with a concrete usability/business reason;
feature preference alone is not an exception.

**Definition-of-Done gate:** every frontend review/reconciliation must compare
repeated controls against their canonical shared owner. A scoped feature is not
visually complete while it keeps feature-local duplicate tab/dropdown/button
styling that the shared component or token already owns.

### Generation packets

Coding models should not load this entire book when a reviewed phase or task
packet exists. Use the generated packet under `recipe-system/generated/` and
the approved reference named by that packet. Generated packets are derivative:
this book remains authoritative when they disagree.

`recipe-system/Generate-SigmaRecipes.ps1 -Check` verifies that each generated
packet still carries the current fingerprints of its canonical source blocks.
Tasks without a matching recipe use the smallest applicable block dependency
closure from this book.

## Reference per shape

Do not read one feature as the reference for everything. Each shape has its own,
and they differ deliberately.

| Shape | Canonical reference | Why |
|---|---|---|
| Solid primary action | `shared/components/primary-action-button/` | Shared `app-primary-action-button` owns button/submit semantics, primary tokens, icon placement, busy state, focus visibility, and RTL arrows; features supply translated labels and behavior |
| List, grid, paging | `shared/components/data-table/` + `Fleet/VehicleService/components/list` | Shared `app-data-table` owns PrimeNG rendering and table styling; the feature owns typed columns, server paging, sorting, errors, and refresh state |
| List filters | `Sales/Fleet/components/list` | Owns the approved typed filter form and list-level actions; do not copy its legacy table wrapper |
| Step form | `shared/components/step-form/` + `shared/components/form-validation-summary/` + `Customers/Companies/CompanyPartner/components/details` | Shared `app-step-form` owns progress navigation and `app-form-validation-summary` owns the accessible invalid-field summary; the feature owns one parent form, step gating, invalid-field discovery/focus, content, actions, and persistence |
| Form section | `shared/components/form-section/` + `Customers/Companies/CompanyPartner/components/details` | Shared `app-form-section` owns the repeated section card, translated heading, optional description/icon, projected header actions, compact density, fill-height mode, responsive layout, and light/dark styling; the feature projects its form controls and owns validation and behavior |
| Ordinary Add/View/Edit modal | `shared/components/editor-dialog/` + `Fleet/VehicleService/components/details` | Shared `app-editor-dialog` owns the controlled PrimeNG shell and mode-aware footer; the feature owns content, forms, validation, dirty-close and persistence |
| Tabbed Add/View/Edit modal | `shared/components/editor-dialog/` + `shared/components/editor-tabs/` + `Fleet/VehicleService/components/details` | Use `app-editor-dialog` for the shell and `app-editor-tabs` for accessible navigation; the feature owns typed tab state, panels, bounded content and forms |
| Editable child collection | `shared/components/editable-collection-table/` + `Fleet/VehicleService/components/details` + `Customers/Companies/CompanyPartner/components/detalisForm/{contact-persons,credit-cards,documents,drivers}` | Shared `app-editable-collection-table` owns collection chrome, required headers, optional heading, Add/default Remove or projected row actions, empty state, responsive table behavior, bounded `fillHeight` scrolling, and light/dark styling; the feature owns typed rows, projected cells/actions, validation, confirmation, mutation, and persistence |
| Hierarchy tree workspace | `Accounts/Account/components/list` + `components/details` | Canonical routed tree editor for true parent/child master data: feature title + compact tree toolbar + bounded internal tree scroll + embedded detail pane; preserve hierarchy semantics instead of converting the tree to a flat Grid |
| Financial collection editor | `Accounts/openingBalances/components/details` + tab editors + `shared/components/editable-collection-table/` | Routed accounting workspace for dense editable financial rows: immutable/server-owned context in the feature header, compact tabs/filters, grow-until-cap card, internal row scroll with sticky headers, visible Debit/Credit/Balance summary and Save action |
| Tabbed settings workspace | `Accounts/Link Accounts/LinkAccounts/components/details` + `shared/components/editor-tabs/` | Routed settings/account-mapping workspace: shared workspace tabs, fixed route surface with no main-page vertical scroll, one internal content scroll owner, and Save outside that scroll region |
| Nested child draft | `shared/components/editor-dialog/` + `shared/components/editor-tabs/` + `Customers/Companies/CompanyPartner/components/detalisForm/drivers` | Shared dialog/tab/section components own presentation and accessible navigation; the feature owns draft isolation, dirty-close approval and parent commit on Save only |
| Confirmation and discard | `shared/service/confirmation-dialog.service.ts`, `Fleet/Vehicle` `requestClose()` | Single shared dialog for every yes/no |
| Report | `shared/components/report-page/` + `shared/components/report-actions/` + `Customers/StatementOfAccount/components/list` + `Reports/TrailBalance/components/list` | Shared page/action chrome around a typed filter, sectioned response and totals; Trial Balance is the canonical dense accounting tree/table visual variant; shared print coordination |

Where a block shows Company or Sales/Fleet markup for a filter concern, use it
only for the filter shape. `shared/components/data-table` owns the reusable
table shell, while `Fleet/VehicleService` is the canonical feature integration.

## Pattern status

Every block is labelled. Check the label before copying.

| Label | Meaning |
|---|---|
| **Canonical** | Copy this. It is the intended pattern. |
| **Transitional** | Works and is consistent, but a better shared solution is planned in block 30. Match existing screens; do not spread it further than needed. |
| **Legacy — do not copy** | Present in source, kept working, but wrong. Never use as a model. |
| **Governance** | Tracking information, not an implementation pattern. |

Nothing in this book is "copy exactly" without reading its label first.

### Reusable replacement invariant

When a Canonical block names an approved shared component as a mandatory
replacement, every scoped review, fix, or refactor must replace the legacy
implementation in the existing feature before completion. A request to restore
or preserve the previous appearance applies only to feature-owned layout,
filter placement, and styling; it never authorizes restoring a legacy wrapper,
copying shared internals, or treating Git history as the component authority.

If the required appearance cannot be expressed through the shared component's
public inputs, outputs, content projection, or supported CSS variables, report
the missing shared capability and improve that component in scope. Do not
silently revert the consumer to the legacy implementation.

## Contents

**Structure**

| # | Block | Status | Reference |
|---|---|---|---|
| 1 | [Feature folders and wiring](#1-feature-folders-and-wiring) | Canonical | `CompanyPartner/` |
| 2 | [Service and response wrappers](#2-service-and-response-wrappers) | Transitional | `services/companypartner.service.ts` |

**Main page**

| # | Block | Status | Reference |
|---|---|---|---|
| 3 | [Header](#3-header) | Canonical | `components/list/list.component.html` |
| 4 | [Filters](#4-filters) | Canonical | same |
| 5 | [Columns](#5-columns) | Canonical | `Fleet/VehicleService/components/list/list.component.ts` |
| 6 | [Grid and footer](#6-grid-and-footer) | Canonical | `shared/components/data-table/` + `Fleet/VehicleService/components/list` |
| 7 | [Action button cycle](#7-action-button-cycle) | Transitional + canonical quotation specialization | `shared/components/action-button/` + `Sales/SalesQuotation/components/list` |
| 8 | [Export to Excel](#8-export-to-excel) | Canonical | list `exportToExcel` |

**Dialogs**

| # | Block | Status | Reference |
|---|---|---|---|
| 9 | [Confirm: delete](#9-confirm-delete) | Canonical | list `confirmDelete` |
| 10 | [Confirm: discard](#10-confirm-discard) | Canonical | `Fleet/Vehicle` + Company editor |
| 11 | [Small modal on top](#11-small-modal-on-top) | Canonical | drivers `deleteDriver` |

**Create and edit**

| # | Block | Status | Reference |
|---|---|---|---|
| 12 | [Step form](#12-step-form) | Canonical composite | shared step navigation + form sections + CompanyPartner details |
| 13 | [Modal with tabs](#13-modal-with-tabs) | Canonical composite | `shared/components/editor-dialog/` + `shared/components/editor-tabs/` + `Fleet/VehicleService/components/details` + block 10 close lifecycle |
| 14 | [Editable collection table](#14-editable-collection-table) | Canonical | shared editable collection, VehicleService details |
| 15 | [View mode](#15-view-mode) | Canonical | editor + child sections |

**Controls**

| # | Block | Status | Reference |
|---|---|---|---|
| 16 | [Dropdowns, lookups, enums](#16-dropdowns-lookups-enums) | Canonical | filters + drivers |
| 17 | [Dates](#17-dates) | Canonical | drivers, documents |
| 18 | [Documents and upload](#18-documents-and-upload) | Transitional | `detalisForm/documents/` |
| 19 | [Validation messages](#19-validation-messages) | Canonical | child sections |

**Reports**

| # | Block | Status | Reference |
|---|---|---|---|
| 20 | [Report page](#20-report-page) | Canonical composite | shared report page/actions + `Customers/StatementOfAccount/` + `Reports/TrailBalance/` |
| 21 | [Report print](#21-report-print) | Canonical | `shared/service/report-print.service.ts` |

**Cross-cutting**

| # | Block | Status | Reference |
|---|---|---|---|
| 22 | [Loading, empty, error, toast](#22-loading-empty-error-toast) | Canonical | list + dialogs |
| 23 | [Translations](#23-translations) | Canonical | `i18n/vocabs/en.ts`, `ar.ts` |
| 24 | [Colors, icons, buttons](#24-colors-icons-buttons) | Transitional | `shared/components/primary-action-button/` + approved composite controls |
| 25 | [RTL and dark theme](#25-rtl-and-dark-theme) | Canonical | `translation.service.ts` |

**Governance**

| # | Block | Status | Reference |
|---|---|---|---|
| 26 | [Permissions and route access](#26-permissions-and-route-access) | Transitional | `auth.guard.ts`, `app-routing.module.ts` |
| 27 | [Focus and keyboard](#27-focus-and-keyboard) | Canonical | shared confirmation, `p-dialog` |
| 28 | [Request cancellation and stale responses](#28-request-cancellation-and-stale-responses) | Canonical | list + dialog components |
| 29 | [Verification expectations](#29-verification-expectations) | Canonical | — |
| 30 | [Unification backlog](#30-backlog-by-priority) | Governance | app-wide |

---

## 1. Feature folders and wiring

> **Status: Canonical** — route/model shape; the interceptor wiring inside is Transitional

Every feature is a folder with a routes file. Copy this shape exactly.

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
`.app-content` is the single vertical scroll owner when routed content exceeds
the available height:

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

**Routed full-page editor exception:** when a feature has an explicitly
approved independently addressable Create/Edit/View route, the editor may use a
fixed host bounded by the existing header/footer variables. The host must use
`min-height: 0` and `overflow: hidden`; its action footer is a fixed-height
flex sibling of the form body, and only a deliberately bounded child collection
frame may own vertical row scrolling. This exception does not change block 13's
rule that ordinary list-owned CRUD uses the shared editor dialog.
**Routed settings-workspace exception:** when a routed settings or account-mapping
workspace is intentionally designed without main-page scrolling, bound the route
surface to the authenticated shell with the existing header/toolbar/footer
variables and use `overflow: hidden` on the route/card flex chain. Keep the
feature header, Save action, workspace tabs and compact search/filter controls
outside the scrolling region. Exactly one feature-owned content viewport may use
`overflow-y: auto`; child sections and editable tables must grow naturally and
must not add a second vertical scrollbar unless a separately bounded collection
is an explicit business requirement. Horizontal tab/table overflow remains
allowed. On narrow screens, preserve this single vertical-scroll owner rather
than falling back to nested page + child scrolling.

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

Until this is centralised (block 30, item 17), register every feature service in
`LayoutModule.providers`. Do not add a manual `Authorization` header in a feature
service as a workaround.

**Check:** routes file exists · route count matches the editor shape · `models/`
has the files its shape needs · lazy route registered · service in
`LayoutModule` providers · menu entry.

**Do not copy from** `Companies/Company`, `Companies/CompanyContactPerson`,
`Companies/CompanyDriver`. Dead scaffolding: `/menu/products` columns, empty
action bodies, `console.log("Delete2")`, 0-byte SCSS.

---

## 2. Service and response wrappers

> **Status: Transitional** — `Result.id` and `Results<T> extends Result<any>` are untyped, backlog 22

Extend `BaseService` and pass the controller name once.

```ts
@Injectable({ providedIn: 'root' })
export class CompanyPartnerService extends BaseService {
  constructor() {
    super('Company', environment.baseUrl);
  }
}
```

Inherited helpers, so you do not rewrite them:

| Method | Calls |
|---|---|
| `get<T>(obj?)` | `GET {control}?Filters[key]=value&...` |
| `getById<T>(id)` | `GET {control}/GetById/{id}` |
| `getByIdWithNavigation<T>(id)` | `GET {control}/GetByWithNavigationsId/{id}` |
| `getSelectList<T>()` | `GET {control}/GetSelect` — dropdown options |
| `getByType<T>(type)` | `GET {control}/GetByType/{type}` |
| `post<T>` / `put<T>` | `POST` / `PUT {control}` |
| `delete<T>(id)` | `DELETE {control}?id={id}` |

Every response is one of two wrappers. Always check `isSuccess` before reading
data.

**These two contracts are Transitional.** `Result.id` is `any`, and
`Results<T> extends Result<any>` so `entity` is untyped on a list response.
`ActionList.action`, `.visible` and `.disabled` also take `any` (block 7). Use
them as they are — they are shared contracts and changing them is a coordinated
edit — but do not treat `any` here as licence for `any` in your own feature
models. Typed replacements are backlog item 22.

```ts
export interface Result<T> {
  entity: T | null;
  isSuccess: boolean;
  isInfo: boolean;
  message: string;
  id: any | null;
}

export interface Results<T> extends Result<any> {
  entities: T[];
  pageNo: number;
  pageSize: number;
  totalPages: number | null;
  totalCount?: number | null;
}
```

Paged list with filters — note the `Filters[key]` convention:

```ts
getList(query: CompanyPartnerListQuery = {}): Observable<Results<CompanyPartnerDTO>> {
  let params = new HttpParams();
  Object.entries(query.filters ?? {}).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      params = params.set(`Filters[${key}]`, String(value));
    }
  });
  if (query.pageNo !== undefined) params = params.set('pageNo', String(query.pageNo));
  if (query.pageSize !== undefined) params = params.set('pageSize', String(query.pageSize));
  return this.http.get<Results<CompanyPartnerDTO>>(`${environment.baseUrl}Company`, { params });
}
```

**Check:** extends `BaseService` · empty filters dropped, not sent as `''` ·
`isSuccess` checked · payload types are real interfaces, never `unknown`.

---

## 3. Header

> **Status: Canonical**

Always `app-feature-title` with the Create button in its slot. Never a second
title in the Metronic toolbar.

Import `PrimaryActionButtonComponent` in the standalone feature and use the
shared primary action from block 24. The feature supplies translated content
and behavior; it does not recreate primary-button markup or styling.

Snippets in the main-page blocks use the neutral `feature-*` prefix. Replace
`feature` with the owning feature name (`fleet-*`, `warehouse-*`, and so on);
never copy another feature's prefix.

```html
<section class="feature-page">
  <div class="feature-panel">
    <app-feature-title
      [title]="'companyPartners.title' | translate"
      [subtitle]="'companyPartners.manage' | translate"
      icon="bi bi-buildings"
    >
      <app-primary-action-button
        [label]="'companyPartners.addNew' | translate"
        (pressed)="openCreate()"
      />
    </app-feature-title>
```

The solid title-icon tile is owned by `app-feature-title`. Its glyph must be
explicitly white by targeting the nested `i` element; feature pages must not
recreate or override that styling. The same explicit-white rule applies to the
icon inside the solid Create button.

A screenshot-confirmed Create action is a functional requirement, not optional
decoration. Do not omit it merely because the write contract is initially
missing, and do not ship it as a disabled or nonfunctional placeholder. When
backend work is in scope, finish Phase 1 and freeze the Add contract before
wiring the editor and enabled Save action. When backend work is outside scope,
record the Add contract as Missing and report the feature blocked instead of
silently changing the demonstrated workflow.

**Check:** icon set · title and subtitle translated · Create inside
`app-feature-title` · white glyph in the solid title-icon tile · white glyph on
the solid Create button.

---

## 4. Filters

> **Status: Canonical**

Presentation reference: `Customers/Individual/IndividualPartner/components/list`;
primary action implementation remains owned by block 24.

One `<form>`, `[formGroup]`, `(ngSubmit)`. Every control labelled. The canonical
list filter is a compact, flat 12-column grid inside the primary panel. Do not
wrap it in a second bordered, rounded, padded, or tinted filter card.

All single-line filter controls use the application token
`--sigma-filter-control-height: 34px` from `src/styles.scss`. This is a shared
invariant, not a feature-level design choice. It applies to native single-line
inputs and selects plus PrimeNG dropdown, select, multiselect, calendar, and
input-number controls. The outer wrapper, internal input, and calendar trigger
must resolve to the same 34px height in light and dark themes. Checkbox, radio,
file, button, multi-select-list, and textarea controls keep their intrinsic or
component-owned dimensions.

New or refactored feature-owned filter forms must use a class ending in
`-filters` or `-filter-form`. Reusable or dynamic filter forms, plus existing
legacy filter forms that have not yet been renamed, use `sigma-filter-form`.
These are the canonical filter boundaries consumed by the shared height rule.
Do not override `height`, `min-height`, or `max-height` for a single-line
filter control in feature SCSS. A feature continues to own layout, colors,
borders, focus treatment, and responsive behavior.

On a wide screen, Branch and Search occupy the first row (`3 + 9` columns).
Agreement Status, the inactive toggle, and actions occupy the second row
(`3 + 3 + 6`). Snippets use the neutral `feature-*` prefix; replace it with the
owning feature prefix.

```html
    <form class="feature-filters" [formGroup]="filterForm" (ngSubmit)="search()">
      <div class="feature-filter-field feature-branch-filter">
        <label for="individual-branch">{{ 'individualPartners.branch' | translate }}</label>
        <p-dropdown
          inputId="individual-branch"
          formControlName="branchId"
          [options]="branchOptions()"
          optionLabel="value"
          optionValue="id"
          [showClear]="true"
          [filter]="true"
          filterBy="value"
          appendTo="body"
          [placeholder]="'individualPartners.allBranches' | translate"
        ></p-dropdown>
      </div>

      <div class="feature-filter-field feature-search-filter">
        <label for="individual-search">{{ 'general.search' | translate }}</label>
        <input
          id="individual-search"
          type="search"
          formControlName="search"
          autocomplete="off"
          [placeholder]="'individualPartners.searchPlaceholder' | translate"
        />
      </div>

      <div class="feature-filter-field feature-status-filter">
        <label for="individual-agreement-status">
          {{ 'mangeDetails.agreementstatus' | translate }}
        </label>
        <p-dropdown
          inputId="individual-agreement-status"
          formControlName="agreementStatus"
          [options]="agreementStatusOptions"
          optionLabel="label"
          optionValue="id"
          [showClear]="true"
          appendTo="body"
          [placeholder]="'individualPartners.allAgreementStatuses' | translate"
        ></p-dropdown>
      </div>

      <label class="feature-inactive-filter" for="individual-is-inactive">
        <input
          id="individual-is-inactive"
          type="checkbox"
          formControlName="isInactive"
        />
        <span>{{ 'mangeDetails.inactiveCustomersOnly' | translate }}</span>
      </label>

      <div class="feature-filter-actions">
        <app-primary-action-button
          type="submit"
          [label]="'general.search' | translate"
          icon="bi bi-search"
          [loading]="loadingList()"
        />
      </div>
    </form>
```

Use this compact presentation. The filter owns layout and control placement;
the shared primary action continues to own Search button markup and styling.

```scss
.feature-page {
  --feature-filter-border: #c9d2dc;
}

.feature-filters {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 12px 20px;
  margin-bottom: 18px;
}

.feature-filter-field {
  min-width: 0;

  label {
    display: block;
    margin-bottom: 5px;
    color: #222;
    font-size: 12px;
    font-weight: 400;
  }

  > input {
    box-sizing: border-box;
    width: 100%;
    height: var(--sigma-filter-control-height);
    padding: 0 10px;
    border: 1px solid var(--feature-filter-border);
    border-radius: 2px;
    color: #3f4850;
    background: #fff;
    outline: none;
    font-size: 12px;

    &:focus {
      border-color: #69b7df;
      box-shadow: 0 0 0 2px rgb(105 183 223 / 18%);
    }
  }
}

.feature-branch-filter,
.feature-status-filter {
  grid-column: span 3;
}

.feature-search-filter {
  grid-column: span 9;
}

.feature-inactive-filter {
  display: inline-flex;
  grid-column: 4 / span 3;
  align-items: center;
  align-self: end;
  gap: 8px;
  min-height: 35px;
  color: #333;
  cursor: pointer;
  font-size: 12px;

  input {
    width: 15px;
    height: 15px;
    margin: 0;
    accent-color: var(--sigma-primary);
  }
}

.feature-filter-actions {
  display: flex;
  grid-column: 7 / -1;
  justify-content: flex-end;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 7px;
}

:host ::ng-deep .feature-filter-field .p-dropdown {
  width: 100%;
  height: var(--sigma-filter-control-height);
  min-height: var(--sigma-filter-control-height);
  max-height: var(--sigma-filter-control-height);
  border-color: var(--feature-filter-border);
  border-radius: 2px;
  color: #3f4850;
  background: #fff;
  font-size: 12px;
}

:host ::ng-deep .feature-filter-field .p-dropdown-label {
  padding: 8px 10px;
}

:host-context([data-bs-theme='dark']) {
  .feature-page {
    --feature-filter-border: #405364;
  }

  .feature-filter-field {
    label {
      color: #bdcbd7;
    }

    > input {
      border-color: #405364;
      color: #e5edf4;
      background: #182631;

      &::placeholder {
        color: #8194a5;
      }

      &:focus {
        border-color: #69b7df;
        background: #1b2b38;
      }
    }
  }

  .feature-inactive-filter {
    color: #cad6df;
  }
}

:host-context([data-bs-theme='dark']) ::ng-deep .feature-filter-field .p-dropdown {
  border-color: #405364;
  color: #e5edf4;
  background: #182631;
}

:host-context([data-bs-theme='dark'])
  ::ng-deep
  .feature-filter-field
  .p-dropdown-label {
  color: #e5edf4;
}

:host-context([data-bs-theme='dark'])
  ::ng-deep
  .feature-filter-field
  .p-dropdown-label.p-placeholder {
  color: #8194a5;
}

:host-context([data-bs-theme='dark'])
  ::ng-deep
  .feature-filter-field
  .p-dropdown-trigger,
:host-context([data-bs-theme='dark'])
  ::ng-deep
  .feature-filter-field
  .p-dropdown-clear-icon {
  color: #9dafbf;
}

@media (max-width: 900px) {
  .feature-search-filter {
    grid-column: span 8;
  }

  .feature-branch-filter,
  .feature-status-filter,
  .feature-inactive-filter {
    grid-column: span 4;
  }

  .feature-filter-actions {
    grid-column: span 8;
  }
}

@media (max-width: 700px) {
  .feature-branch-filter,
  .feature-search-filter,
  .feature-status-filter,
  .feature-inactive-filter,
  .feature-filter-actions {
    grid-column: 1 / -1;
  }

  .feature-filter-actions {
    justify-content: stretch;
  }

  .feature-filter-actions > * {
    flex: 1 1 calc(50% - 7px);
  }
}
```

Secondary actions such as Export use the approved compact secondary role from
block 24. The feature must not reach into shared button internals.

Typed form, and build the request by hand so empty values are dropped:

```ts
readonly filterForm = this.fb.nonNullable.group({
  branchId: this.fb.control<number | null>(null),
  search: '',
  agreementStatus: this.fb.control<number | null>(null),
  isInactive: false,
});

private buildFilters(): IndividualPartnerListFilters {
  const value = this.filterForm.getRawValue();
  const filters: IndividualPartnerListFilters = {};
  const search = value.search.trim();
  if (value.branchId !== null) filters.branchId = value.branchId;
  if (search) filters.search = search;
  if (value.agreementStatus !== null) filters.agreementStatus = value.agreementStatus;
  if (value.isInactive) filters.isInactive = true;
  return filters;
}
```

**Check:** one flat 12-column filter grid, with no nested filter card · desktop
spans are `3 + 9` then `3 + 3 + 6` · all controls collapse to one column by
700px · every single-line native and PrimeNG filter control consumes
`--sigma-filter-control-height` and remains exactly 34px high in light and dark
themes · no feature-level height override · `label for` matches
`inputId` · Search is `type="submit"` and disabled while running · changing
filters resets to page 1 · search value trimmed · no extra search/clear button
beside a dropdown that already has `[showClear]` and `[filter]`.

---

## 5. Columns

> **Status: Canonical**

Actions are first when the feature supplies `ActionList[]`; `app-data-table`
renders that column automatically. Declare business columns as a typed
`DataTableColumn<T>[]` in the feature list component. Do not reuse the legacy
`ListCol[]` or `ColType` contracts. Every `header` is a translation key, and
`sortable: true` is permitted only for a backend-confirmed sort field.

```ts
import {
  DataTableColumn,
  DataTableComponent,
} from 'src/app/modules/shared/components/data-table/data-table.component';

readonly columns: ReadonlyArray<DataTableColumn<FeatureListVM>> = [
  { field: 'name', header: 'feature.name', sortable: true },
  { field: 'status', header: 'feature.status' },
];
```

`field` is constrained to a real key of the row type. Use `value` only for a
small display transformation and use `cellTemplate` when a cell needs semantic
markup such as a status badge, icon, link, or multi-line content. The API model
or a feature-owned Grid-row mapper remains the source of business derivations;
the shared table must not invent fields or domain rules.

Values the grid shows but the API does not return are built in one mapper:

```ts
private toGridRow(item: CompanyPartnerDTO): CompanyPartnerGridRow {
  const name = item.companyName?.trim() ?? '';
  return {
    ...item,
    displayName: item.no && name ? `${name} (${item.no})` : name || item.no || '',
    contactNo: item.phone1?.trim() || item.phone2?.trim() || '',
    isInactive: item.inActive ?? false,
  };
}
```

**Required columns rule.** The list model carries only what the grid shows, plus
`id`, plus what a row action needs. Company's 6 columns need: `id`, `no`,
`companyName`, `phone1`, `phone2`, `contactGroup`, `contactGroupId` (Edit
Contact Group action), `website`, `email`, `inActive`. Anything else is dead
weight — give export-only data its own contract.

**Check:** actions column first when actions exist · every header uses a
translation key · every `field` is a typed row property · sortable fields are
backend-confirmed and whitelisted · derived values remain feature-owned · no
model field that no column or action reads · no `ListCol`, `ColType` or
`initColumns()` remains.

---

## 6. Grid and footer

> **Status: Canonical** — reusable `app-data-table` with feature-owned data and
> query state

**Mandatory replacement rule.** New and refactored list pages must use one
shared `<app-data-table>`. The `ms-lib` `<table-list>` wrapper,
`TableListComponent`, and feature-local copies of PrimeNG table markup are
**Legacy — do not copy**. When a list feature is placed in refactor scope,
replace its existing table in place; do not add a parallel component or route.
Restoring an older filter, header, or action-button appearance changes only the
feature-owned shell around the grid. It must not restore `<table-list>`, direct
feature-owned `<p-table>` markup, or any internal-table mutation.

The reusable component contains the one direct PrimeNG `<p-table>` and owns its
paginator, action-column rendering, translated headers, default cells, custom
cell-template outlet, optional accessible row activation, optional checkbox
selection, loading state, empty state, responsive scrolling, and table-level
light/dark styling. Never
hand-build a second pager on the main grid. The feature retains all data and
business ownership.

The selected paginator page is a primary action state: use
`var(--sigma-primary)` for its border and background, with white text retained
through hover and keyboard focus. Keep this in the shared table stylesheet so
light theme, dark theme, and every consuming list use the same state.

The canonical list shape has four independently reviewable layers:

| Layer | Required evidence |
|---|---|
| Shared component | `shared/components/data-table` contains exactly one direct `p-table`, typed `DataTableColumn<T>`, optional actions/custom cell templates/row activation/checkbox selection, table-owned paginator, empty/loading states, and table-level theme/RTL-safe styling |
| Feature template | Exactly one `app-data-table` with feature data, columns, actions, paging/sort inputs, translated report/empty keys, error-aware empty visibility, one typed lazy-load output, optional typed row-activation output only when the whole row has one clear workflow, and optional typed checkbox selection only for a confirmed batch workflow |
| Feature TypeScript | `DataTableComponent`, typed `DataTableColumn<Row>`, typed `TableLazyLoadEvent`, page conversion in one handler, API `totalRecords`, sort whitelist and stale-request protection; no `TableModule`, table `@ViewChild`, or internal mutation |
| Feature SCSS | Feature-owned page/panel/error layout plus optional public `--sigma-data-table-*` variable overrides; no copied `.p-datatable-*`, action-menu, or paginator integration rules |

A reviewer must report evidence for each layer. Finding `app-data-table` in the
feature template does not prove that API paging, sort whitelisting, refresh, or
failure handling is correct.

```html
<app-data-table
  class="feature-grid"
  [value]="data()"
  [columns]="columns"
  [actions]="moreActions()"
  dataKey="id"
  [first]="firstRecord()"
  [rows]="pageSize()"
  [totalRecords]="totalRecords()"
  [rowsPerPageOptions]="rowsPerPageOptions"
  [loading]="loading()"
  [sortField]="sortField()"
  [sortOrder]="sortOrder()"
  [showEmpty]="!errorMessage()"
  currentPageReport="feature.pageReport"
  emptyMessage="feature.empty"
  (lazyLoad)="onLazyLoad($event)"
></app-data-table>
```

When a confirmed workflow opens from the whole row, opt in explicitly and keep
the feature responsible for the resulting business action:

```html
<app-data-table
  [value]="data()"
  [columns]="columns"
  [rowInteractive]="true"
  (rowActivated)="openWorkflow($event)"
></app-data-table>
```

The shared table owns pointer, `Enter`, `Space`, focus-visible styling, and
suppression when the event originated from a nested link, button, form control,
or other interactive element. Do not enable whole-row activation when it would
be ambiguous beside conflicting row controls. The emitted row remains typed;
the feature decides whether to open a modal, navigate, or run another confirmed
workflow.

When a confirmed batch workflow acts on rows, opt in through the shared table's
checkbox column. The shared table owns the header checkbox, row checkboxes,
accessible labels, and suppression of row activation from checkbox events. The
feature owns the typed selected rows, action availability, batch payload, and
clearing selection when a search, page, sort, refresh, or mutation replaces the
rendered result:

```html
<app-data-table
  [value]="data()"
  [columns]="columns"
  dataKey="id"
  [selectable]="true"
  [selection]="selectedRows()"
  [selectionPageOnly]="true"
  [selectAllAriaLabel]="'feature.selectAllVisible' | translate"
  [rowSelectionAriaLabel]="rowSelectionAriaLabel"
  (selectionChange)="selectedRows.set($event)"
></app-data-table>
```

The canonical select-all scope is the current rendered page. Never label or
treat it as "all matching records" unless a separate confirmed server contract
loads or identifies the complete filtered result. A batch action must be
disabled when selection is empty and must send stable identifiers, not row
indexes. If whole-row activation is also enabled as a single-item shortcut,
selecting a checkbox must not open that workflow.

### One screen, multiple report variants

When radio buttons, tabs, or another selector switch one report page between
different alert types, every selectable type must have a confirmed endpoint and
must replace the complete report contract together: request route, default sort,
sort whitelist, columns, count label, empty state, export columns, and print
columns. Do not leave a control enabled while continuing to call the previous
type's endpoint, and do not duplicate a separate screen for each variant when
the filters and page shell are shared.

Selection and row activation belong to a **workflow**, not automatically to the
shared screen. Enable them only for the variants that have a confirmed action
contract. Clear selection when the variant changes. A read-only alert variant
must not show checkboxes, a primary mutation button, or pointer/keyboard row
activation merely because another variant on the page supports them.

For Fleet Alerts specifically, Insurance owns checkbox selection, whole-row
activation, and batch renewal. Services owns checkbox selection for customer
email reminders and one direct per-row Update Vehicle Service button rendered
through the shared table's typed custom-cell contract. Whole-row activation
remains a single-record shortcut to the same dialog; checkbox interaction must
not open it. Do not add a selected-row toolbar edit action, because service
completion updates exactly one row. Keep the circular action within the shared
compact row height; an oversized control must not make Services the only variant
that expands the route page. The direct button must own its click, prevent row
event propagation, and pass the row's normalized positive `serviceId` to the
dialog. Whole-row activation may call the same helper. A missing or invalid
service ID is a visible response-contract error, never a silent return.
Registration, Mileage, and Warranty are
read-only variants. Fleet Alerts opts into a bounded shared table
`scrollHeight` so row overflow scrolls inside the Grid and the paginator stays
visible:
do not reproduce a screenshot checkbox unless a matching mutation or batch
contract is confirmed. Every variant still owns type-specific columns and
screen/export/print parity. The Services dialog records date/time, fuel level,
current KMs, and the due service; opening the dialog must not auto-open its
calendar, while an intentional click on the calendar field or icon must open it.

Drive paging and sorting directly from the typed lazy-load event:

```ts
onLazyLoad(event: TableLazyLoadEvent): void {
  const rows = Math.max(1, Number(event.rows ?? this.pageSize()));
  const first = Math.max(0, Number(event.first ?? 0));
  const nextPage = Math.floor(first / rows) + 1;
  const nextSort = this.isSortField(event.sortField)
    ? event.sortField
    : this.sortField();

  if (nextPage === this.pageNo() && rows === this.pageSize()
      && nextSort === this.sortField()) return;

  this.pageNo.set(nextPage);
  this.pageSize.set(rows);
  this.sortField.set(nextSort);
  this.requestList();
}
```

### Grid styles — shared table, feature placement

**Canonical:** `shared/components/data-table/data-table.component.scss` owns
PrimeNG wrapper, table, header, cells, action control, paginator, empty state,
and table-level light/dark defaults. A feature must not copy those selectors.
Its list SCSS owns only page/panel/error layout and the placement of the shared
component:

```scss
:host { display: block; }

.feature-grid {
  --sigma-data-table-min-width: 640px;
  display: block;
  margin: 0 14px 12px;
}
```

Ordinary paginated screens must use the table's natural height: do not pass a
screen-specific `scrollHeight`. This keeps every standard grid consistent and
places the paginator directly at the actual bottom of the rendered grid. A
bounded table body is an explicit exception, not a visual preference.

For a confirmed dense report that must keep row overflow inside the Grid, pass
an explicit `scrollHeight` to `app-data-table`. The shared component then owns
the vertical row viewport while leaving its paginator outside that viewport.
It binds the value to the PrimeNG scroll contract and to the wrapper's explicit
`max-height`, so responsive table mode cannot silently expand the route page.
Do not add a feature-local `.p-datatable-wrapper` override. Keep this opt-in:
`.app-content` remains the route-shell fallback scroll owner for ordinary pages.

```html
<app-data-table
  scrollHeight="clamp(200px, calc(100dvh - 500px), 460px)"
  ...
/>
```

Public CSS variables allow an exceptional feature-specific width or semantic
color without copying component internals: `--sigma-data-table-min-width`,
`--sigma-data-table-empty-height`, `--sigma-data-table-border`,
`--sigma-data-table-header-background`, `--sigma-data-table-header-color`,
`--sigma-data-table-row-background`, `--sigma-data-table-row-alt-background`,
`--sigma-data-table-row-hover-background`, `--sigma-data-table-text`, and
`--sigma-data-table-muted`. Prefer defaults. If a feature overrides a color, it
must supply the corresponding dark-theme value under `:host-context`.

**Feature-owned presentation boundary.** The Company and Individual lists both
use the compact filter geometry from block 4, but each feature keeps locally
prefixed page and filter selectors (`companies-*` and `individuals-*`). Neither
feature imports the other's stylesheet. Use approved shared components for the
data table, primary action, and editor shell; retain only feature-specific
placement and secondary-action styling locally. Never add a cross-feature
`@use` or paste a sibling feature stylesheet.

**Check:** no `table-list`, `TableListComponent`, feature-local `p-table`,
`tableList.dt` or remote-table mutation remains · shared component plus feature
template, TypeScript and SCSS evidence reported separately · exactly one
`app-data-table` and no second pager · typed translated columns and empty state ·
`totalRecords` from the API total, never `rows.length` · page conversion
`first / rows + 1` once in the typed event handler · no copied
`.p-datatable-*`, action-control, dropdown, or paginator rules · public CSS
variables used only for real feature variation · no cross-feature `@use`.

---

## 7. Action button cycle

> **Status: Transitional** — `ActionList` is untyped (`any`), backlog 22

One `ActionList[]`. Pass it to `app-data-table` through `[actions]`. The shared
table renders the Actions column first and composes the existing
`ActionButtonComponent`; feature components do not manage `TemplateRef` or
rebuild column definitions after view initialization.

```ts
private initActions(): void {
  this.moreActions.set([
    { title: 'general.viewDetails', icon: 'bi bi-eye',
      action: (item: CompanyPartnerGridRow) => this.openView(item) },
    { title: 'general.edit', icon: 'bi bi-pencil-square',
      action: (item: CompanyPartnerGridRow) => this.openEdit(item) },
    { title: 'companyPartners.agreementsHistory', icon: 'bi bi-clock-history',
      action: (item: CompanyPartnerGridRow) => this.openAgreementHistory(item) },
    { title: 'general.delete', icon: 'bi bi-trash',
      action: (item: CompanyPartnerGridRow) => this.confirmDelete(item) },
  ]);
}
```

Use the model for conditional rows instead of hiding logic in HTML:

```ts
export interface ActionList {
  title: string;
  icon?: string;
  action: (action?: any) => void;
  visible?: (row?: any) => boolean;
  disabled?: (row?: any) => boolean;
}
```

Use `visible` for actions unavailable in the row's business state, such as an
edit or state transition that is not allowed after close or void. Use
`disabled` for transient UI conditions such as an in-flight request. Do not
leave a permanently unavailable row action visible as a disabled or no-op menu
item; the backend `can*` contract remains the source of truth and still
revalidates the action.

Full cycle for every action:

| Step | Do this |
|---|---|
| 1 Define | translation key, `bi` icon, `visible`/`disabled` when row state matters |
| 2 Click | receive the row object; use `row.id`, never an index |
| 3 Confirm | **destructive or risky** → confirmation dialog (block 9); needs input → form modal (block 13); ordinary Save/Next → no dialog |
| 4 Run once | guard with a `saving`/`deleting` signal so double click cannot fire twice |
| 5 Success | one toast from the global mutation interceptor, then refresh keeping the page; the feature must not emit a duplicate |
| 6 Failure | clear the busy flag, keep the row, show a translated message |

After a delete that empties the current page, step back one page before
refreshing:

```ts
if (this.data().length === 1 && this.pageNo() > 1) {
  this.pageNo.update((page) => page - 1);
}
this.getListItems(undefined, true);
```

**What needs a confirmation, and what does not.** Confirmations are for actions
the user cannot easily undo. Putting one on an ordinary Save trains people to
click through them.

| Confirm | Do not confirm |
|---|---|
| Delete, remove, void, cancel a document | Save, Update, Next, Previous |
| Irreversible status transitions: post, approve, unapprove, finalize, close | Opening a dialog, switching tab or step |
| Discarding unsaved edits (block 10) | Search, refresh, export, print |
| Actions with side effects on other records | Adding a blank child row |

### Quotation action-cycle specialization

> **Status: Canonical for quotation lists.** `Sales/SalesQuotation` is the
> complete reference for the action lifecycle. A quotation type may expose a
> smaller action set, but it must use the same lifecycle for every action it
> supports.

Freeze the quotation action-state contract in Phase 1 before implementing the
menu. A single-status quotation may expose its persisted status when the public
enum is already the API contract. A quotation with separate internal and
customer approval axes, or more complex dependencies, should expose the minimum
explicit `can*` flags required by the list. The feature consumes that contract
in `ActionList.visible`; it does not duplicate workflow rules in HTML. The
backend must still revalidate every transition because UI visibility is not a
security or concurrency boundary.

#### Mandatory reference-action preflight

Do not build the menu from memory, one screenshot, or a partial scan of a
reference component. Before editing Angular, enumerate every action in the
approved reference's backend interface/service/controller and Angular
service/list. Reconcile that inventory against the target backend contract.

| Reference action | Target backend route exists? | Target ListVM state exists? | Target UI decision | Evidence |
|---|---|---|---|---|
| | Yes / No | enum or `can*` flag | Supported / Not Applicable / Missing / Conflicting | |

Every reference action must appear once. A target-specific exclusion is valid;
a silent omission is not. If the backend contract is Missing or Conflicting,
stop that row instead of adding a disabled, hidden-by-constant, or no-op menu
item.

Not every quotation type supports every row below. Include an action only when
the entity, service interface, controller route, response model, translation,
and owning UI workflow all exist. Preserve the feature's actual HTTP verb,
route, payload, and target-state rules; do not manufacture a common endpoint
because another quotation type has one.

| Action shape | Usual source state or flag | UI interaction | Contract rule |
|---|---|---|---|
| View | Existing row | Open the owning View editor; no confirmation | Always identify the row by `id` |
| Internally approve | Pending or `canApproveInternally` | Shared confirmation, then one guarded request | Backend validates readiness and the legal source state |
| Internally reject | Pending or `canRejectInternally` | Typed reason dialog when the endpoint requires a reason; otherwise shared confirmation | Send a reason only when it is part of the backend request contract |
| Customer approve | Internally approved or `canApproveByCustomer` | Shared confirmation, then one guarded request | Backend owns the transition to customer-approved |
| Customer reject | Internally approved or `canRejectByCustomer` | Typed reason dialog when required; otherwise shared confirmation | Rejected and revised are distinct unless the domain contract explicitly equates them |
| Revise | Feature-confirmed approved state or `canRevise` | Confirm the transition; open Revise mode only when the contract identifies the revision being edited | Revision number, copy semantics, and target state are feature-specific and must not be inferred |
| Unapprove | Customer-approved or `canUnapprove` | Shared warning confirmation | Backend blocks the transition when a dependent agreement, receipt, or other final record exists |
| Print | States allowed by the feature contract | Print directly; no confirmation | Use block 21 `ReportPrintService`; the owning view supplies printable content |
| Edit | `canEdit` or a documented editable status | Open the same editor in Edit mode; no confirmation | Save revalidates the current state and may reset a rejected quotation to Pending only when documented |
| Open agreement, master agreement, or receipt | Approved state plus an explicit availability rule | Open the owning typed editor; no confirmation merely for opening | Creating the downstream record is a separate validated mutation; do not invent missing fields or routes |
| Delete | `canDelete` or a documented editable status | Shared destructive confirmation | Backend revalidates state and dependencies; use last-page-delete handling |

Keep quotation actions in one predictable order: View; internal transitions;
customer transitions; Unapprove/Revise; Print; Edit; confirmed downstream
workflows; Delete. Omit unavailable entries without leaving disabled or no-op
items. Risky transitions use the shared confirmation dialog. When the workflow
collects a reason, note, or date, it is a typed form dialog, not a confirmation.

The execution path is the same for each supported transition: guard duplicate
clicks with a local busy signal; start the approved loading channel; call the
typed service method; inspect `isSuccess` before using the response; handle the
transport `error` callback; keep the row and show a translated error on failure;
clear the busy state in `finalize`; and refresh the current page after success.
Rely on the global mutation interceptor for the success toast so the feature
does not emit a duplicate.

`ToActionResult` commonly converts `Result.IsSuccess == false` into a non-2xx
response. Therefore the transport `error` callback must recover the backend
`Result.Message` from `HttpErrorResponse.error.message` when present, then fall
back to the translated feature error. Handling only the `next` branch loses
business failures such as an invalid transition or blocked Unapprove; showing
only a generic error also fails the contract.

```ts
import { HttpErrorResponse } from '@angular/common/http';

private mutationError(error: unknown, fallbackKey: string): string {
  if (error instanceof HttpErrorResponse && error.error &&
      typeof error.error === 'object') {
    const message = (error.error as { message?: unknown }).message;
    if (typeof message === 'string' && message.trim()) return message;
  }
  return this.translate.instant(fallbackKey);
}
```

Before reconciliation, trace every Supported action through all of these links:

```text
ListVM enum/can* -> ActionList.visible -> typed Angular service method
-> exact controller route/payload -> backend transition -> same-page refresh
-> EN/AR labels, confirmation/reason text, and both failure channels
```

One missing link blocks completion. Add source-level or owner-run verification
cases for every legal transition, every illegal source state, required reason
validation, dependency-blocked reversal, duplicate-click guard, and stale-row
recovery. A spec that only asserts that the component is defined does not cover
the action cycle.

**Quotation check:** action-state contract frozen before UI work · one typed
service method per supported route · no unsupported or no-op action · reason
dialog only when the payload requires it · both failure channels handled ·
backend failure message preserved · same-page refresh after success · backend
revalidates every transition · reference inventory has no unclassified row.

**Check:** actions passed once to `app-data-table` · no feature-owned
`TemplateRef` wiring · row identified by `id` · destructive and risky actions
confirm, routine ones do not · busy guard · last-page-delete handled.

---

## 8. Export to Excel

> **Status: Canonical** — translate headers when the export action runs

Shared helper, signature `onExportToExcel(data, fileName, headers?)` where
`data` is currently a `Signal<any[]>`. Keep feature rows typed; the `any`
belongs to the Transitional shared helper boundary (backlog 22), not to the
feature contract.

**Column headers are UI text, so translate them.** The `StatementOfAccount`
report proves the required columns, but its existing memoised `computed()` is
not language-reactive. Resolve header text when the user clicks Export:

```ts
private buildExportRows(): Array<Record<string, string | number>> {
  return this.ledgerLines().map((line) => ({
    [this.translate.instant('customerStatement.date')]: this.formatDisplayDate(line.date),
    [this.translate.instant('customerStatement.debit')]: line.debit,
    [this.translate.instant('customerStatement.credit')]: line.credit,
  }));
}

exportToExcel(): void {
  const rows = this.buildExportRows();
  if (rows.length) {
    onExportToExcel(signal(rows), 'CustomerStatementOfAccount');
  }
}
```

`translate.instant()` reads no Angular signal. Do not memoise translated object
keys in a `computed()` unless that computed also reads a language signal;
otherwise an export after a language switch keeps the previous headers.

The Company list is the direct list-screen reference: derive object keys from
translation keys when the export action runs, and translate status values too:

```ts
private mapExportRows(rows: CompanyPartnerGridRow[]): Array<Record<string, string>> {
  const key = (name: string) =>
    this.translate.instant(`companyPartners.export.${name}`);
  return rows.map((row) => ({
    [key('code')]: row.no ?? '',
    [key('name')]: row.companyName ?? '',
    [key('status')]: this.translate.instant(
      row.isInactive ? 'general.inActive' : 'general.active',
    ),
  }));
}
```

The same applies to a `headers` array passed for fixed column order — translate
its entries too.

**Export the full result, not the visible page.** Gather every page, and fail
loudly if any page fails — otherwise the user gets a truncated file that looks
complete:

```ts
getAllList(filters = {}): Observable<CompanyPartnerDTO[]> {
  const pageSize = 100;
  return this.getList({ pageNo: 1, pageSize, filters }).pipe(
    expand((page) => {
      if (!page.isSuccess) {
        return throwError(() => new Error(page.message || 'companyPartners.exportError'));
      }
      const nextPage = Number(page.pageNo || 1) + 1;
      const totalPages = Number(page.totalPages ?? 0);
      return nextPage <= totalPages
        ? this.getList({ pageNo: nextPage, pageSize, filters })
        : EMPTY;
    }),
    reduce((entities, page) => entities.concat(page.entities ?? []), [] as CompanyPartnerDTO[]),
  );
}
```

**Check:** uses the current filters, not unfiltered data · covers all pages · a
failed page produces an error and no file · loading released on every outcome ·
export disabled while running.

---

## 9. Confirm: delete

> **Status: Canonical**

Never `confirm()`, never a private `p-dialog` for a yes/no. Always
`ConfirmationDialogService`.

```ts
confirmDelete(item: CompanyPartnerGridRow): void {
  this.confirmationDialog
    .confirm({
      severity: 'danger',
      title:    { key: 'companyPartners.confirmDeleteTitle' },
      subtitle: { key: 'companyPartners.confirmDeleteSubtitle' },
      message:  { key: 'companyPartners.confirmDeleteQuestion' },
      warning:  { key: 'companyPartners.confirmDeleteWarning' },
      icon: 'bi bi-trash3',
      record: {
        label: { key: 'companyPartners.customer' },
        title: item.displayName,
        meta: item.no ? `${this.translate.instant('mangeDetails.no')}: ${item.no}` : undefined,
        icon: 'bi bi-building',
      },
      confirmLabel: { key: 'general.delete' },
      cancelLabel:  { key: 'general.cancel' },
      confirmIcon: 'bi bi-trash3',
    })
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((confirmed) => {
      if (confirmed) this.deleteCompany(item);
    });
}
```

Severity picks the default icons for you:

| severity | use for | default icon / confirm icon |
|---|---|---|
| `danger` | delete, remove, irreversible | `bi bi-exclamation-triangle` / `bi bi-trash3` |
| `warning` | discard, unapprove, risky but reversible | `bi bi-exclamation-triangle` / `bi bi-check2-circle` |
| `info` | plain yes/no | `bi bi-info-circle` / `bi bi-check2-circle` |
| `success` | positive confirm | `bi bi-check2-circle` / `bi bi-check2-circle` |

Defaults: width `460px`, collapsing to `calc(100vw - 20px)` under `520px`,
`closeOnEscape` true, confirm label `general.yes`, cancel label `general.cancel`.

Anything that collects a reason, note or date is **not** this dialog — it is a
form modal (block 13).

**Check:** `record` filled so the user sees which row · `subtitle` and `warning`
for destructive actions · mutation only inside `if (confirmed)`.

---

## 10. Confirm: discard

> **Status: Canonical**

Any editable form that can be left with unsaved data needs this. Reference is
`Fleet/Vehicle/components/details/details.component.ts` `requestClose()`; the
Company editor uses the same shape.

```ts
cancel() {
  if (this.isViewMode() || !this.companyPartnerForm.dirty) {
    this.leave();
    return;
  }

  this.confirmationDialog
    .confirm({
      severity: 'warning',
      title:   { key: 'companyForm.discardTitle' },
      message: { key: 'companyForm.discardMessage' },
      icon: 'bi bi-exclamation-triangle',
      confirmLabel: { key: 'companyForm.discard' },
      cancelLabel:  { key: 'general.cancel' },
      confirmIcon: 'bi bi-x-circle',
    })
    .pipe(takeUntilDestroyed(this.destroy$))
    .subscribe((confirmed) => {
      if (confirmed) this.leave();
    });
}

private leave(): void {
  this.router.navigate(['/CompanyPartner']);
}
```

Keys per feature: `<feature>.discardTitle`, `.discardMessage`, `.discard`.

For a dialog editor, do not rely on two-way `visible` binding or `(onHide)` to
decide whether closing is allowed: by then PrimeNG has already hidden the
surface. Use the controlled-visibility pattern in block 13. Its X, Cancel and
scoped Escape handler call `requestClose()`; its mask close is disabled. If a
screen must support mask-to-close, the mask intent must be intercepted before
visibility changes and routed through the same method.

**Check:** view mode leaves silently · pristine form leaves silently · dirty
form always prompts · Cancel, X and Escape use one method · mask closing is
either disabled or goes through that method before the dialog hides.

---

## 11. Small modal on top

> **Status: Canonical**

A small confirm over an open dialog. `ConfirmationDialogService` uses PrimeNG
`DialogService`, which appends to body, so it already stacks above a `p-dialog`.
Just call it — no z-index work.

```ts
deleteDriver(index: number) {
  const driver = this.drivers.at(index);
  if (!driver) return;

  const name = [driver.get('firstName')?.value, driver.get('lastName')?.value]
    .map((part: unknown) => String(part ?? '').trim())
    .filter((part) => part.length > 0)
    .join(' ');

  this.confirmationDialog
    .confirm({
      severity: 'danger',
      title:   { key: 'companyForm.removeDriverTitle' },
      message: { key: 'companyForm.removeDriverMessage' },
      icon: 'bi bi-person-x',
      record: {
        label: { key: 'mangeDetails.driver' },
        title: name || this.getTranslation('companyForm.unnamedDriver'),
        icon: 'bi bi-person',
      },
      confirmLabel: { key: 'general.delete' },
      cancelLabel:  { key: 'general.cancel' },
      confirmIcon: 'bi bi-trash3',
    })
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((confirmed) => {
      if (confirmed) this.drivers.removeAt(index);
    });
}
```

**Check:** shared service, not a nested `p-dialog` · fallback title when the
record has no name yet · removal only inside `if (confirmed)`.

---

## 12. Step form

> **Status: Canonical composite** — shared navigation plus feature-owned form workflow

Use for a long routed record with several ordered groups or child collections.
Company has five real steps: Detail, Contact Persons, Billing & Cards,
Documents, and Drivers.

The reusable source is:

```text
shared/components/step-form/step-form.component.ts
shared/components/step-form/step-form.component.html
shared/components/step-form/step-form.component.scss
shared/components/form-section/form-section.component.ts
shared/components/form-section/form-section.component.html
shared/components/form-section/form-section.component.scss
shared/components/form-validation-summary/form-validation-summary.component.ts
shared/components/form-validation-summary/form-validation-summary.component.html
shared/components/form-validation-summary/form-validation-summary.component.scss
```

`app-step-form` owns the progress track, translated labels and descriptions,
complete/current presentation, ordinary-button keyboard behavior, `nav`/`ol`
semantics, `aria-current="step"`, responsive overflow, RTL-safe logical
placement, and light/dark styling. It deliberately does not announce tabs.

`app-form-validation-summary` owns the accessible alert shell, translated
title/hint/count, horizontally scrollable invalid-field actions, focus-visible
states, responsive behavior, and light/dark styling. It receives typed items
with `label` and `controlPath` and emits the selected item; it never discovers
invalid controls, changes steps, or moves focus.

The feature owns the typed step list, active index, forward-validation gate,
one parent `FormGroup`, step content, invalid-field discovery and step/focus
navigation, Previous/Next, Save/Cancel, dirty exit, routing, payloads, and
persistence. `app-step-form` emits a requested index; neither shared component
mutates feature state or decides whether forward navigation is allowed.

`app-form-section` owns the repeated content card, translated heading, optional
description and icon, projected-content spacing, responsive behavior, and
light/dark styling. The feature projects the step control component and retains
its form group, control layout, validation, and behavior. Do not repeat a local
section/header/content shell or depend on feature-specific section selectors.

```ts
import {
  StepFormComponent,
  StepFormStep,
} from 'src/app/modules/shared/components/step-form/step-form.component';

readonly FORM_STEPS: ReadonlyArray<StepFormStep> = [
  {
    key: 'Detail',
    label: 'companyForm.companyDetails',
    description: 'companyForm.companyDetailsHint',
    icon: 'bi bi-building',
  },
  {
    key: 'contactPersons',
    label: 'companyForm.contactPersons',
    description: 'companyForm.contactPersonsHint',
    icon: 'bi bi-people',
  },
];
```

Project the shared validation summary under the shared navigation while keeping
the typed invalid-field list and navigation method in the feature:

```html
<app-step-form
  class="card-header"
  [steps]="FORM_STEPS"
  [activeStep]="currentStepIndex()"
  [ariaLabel]="'companyForm.formSteps' | translate"
  (stepRequested)="goToStep($event)"
>
  @if (validationAttempted() && invalidFields().length > 0) {
    <app-form-validation-summary
      title="companyForm.validationTitle"
      description="companyForm.validationHint"
      countLabel="companyForm.invalidFields"
      [items]="invalidFields()"
      (itemSelected)="navigateToInvalidField($event)"
    />
  }
</app-step-form>
```

The feature still guards forward movement and owns the final state change:

```ts
goToStep(index: number): void {
  if (index < 0 || index >= this.FORM_STEPS.length) return;
  if (
    !this.isViewMode()
    && index > this.currentStepIndex()
    && !this.validateCurrentStep()
  ) return;

  this.activateStep(index);
}
```

Each step content component receives the same parent form. Validation summary
buttons jump to the bad field using a `data-control-path` attribute:

```html
[attr.data-control-path]="'billingInfo.creditCards.' + i + '.cvv'"
```

Wrap each visible step group with the shared section shell:

```html
<app-form-section
  *ngSwitchCase="'billingInfo'"
  title="companyForm.billingInfo"
  description="companyForm.billingInfoDescription"
  icon="bi bi-receipt"
>
  <app-billing-info [parentForm]="companyPartnerForm" />
</app-form-section>
```

The body remains one feature-owned scroll area. The fixed feature footer keeps
Cancel on one side and Previous/Next/Save on the other; the last step swaps Next
for Save:

```html
@if (currentStepIndex() < FORM_STEPS.length - 1) {
  <app-primary-action-button
    [label]="'general.next' | translate"
    icon="bi bi-arrow-right"
    iconPosition="end"
    (pressed)="next()"
  />
} @else if (!isViewMode()) {
  <app-primary-action-button
    [label]="'general.save' | translate"
    icon="bi bi-check2-circle"
    [loading]="saving()"
    (pressed)="save()"
  />
}
```

**Check:** `app-step-form` used once · `app-form-validation-summary` used for the
invalid-field alert · no feature-owned stepper/summary markup or styles · no
tab roles · ordinary step buttons plus `aria-current` · step state not
conveyed by colour alone · one parent `FormGroup` · steps receive
`[parentForm]` · feature gates forward navigation · Next validates its step,
Save validates all · Back/Next are `type="button"` · one scroll region · footer
always reachable · Cancel goes through block 10 · `data-control-path` on every
validated input.

**Shared content check:** each repeated content group uses `app-form-section`;
the feature does not recreate the section/header/content shell or depend on
feature-specific section selectors for that shell.

---

## 13. Modal with tabs

> **Status: Canonical composite** — use `app-editor-dialog` for the modal shell,
> `app-editor-tabs` for accessible navigation, `Fleet/VehicleService` for the
> feature integration, and block 10 for controlled dirty-close behavior

Use for Create, Edit, and View editors with real peer sections. A modal having
tabs does not create a new shell shape: it uses the same shared
`app-editor-dialog` as a single-section editor and projects `app-editor-tabs`
plus its feature-owned tab panels into the body.

**Mandatory CRUD modal rule.** For an ordinary list-owned Add/Create, View and
Edit workflow, all three actions open the same controlled `app-editor-dialog`
editor and pass an explicit `create | view | edit` mode. The Create button and View/Edit row
actions must not navigate to separate routed pages or mix modal and routed
editors. A routed editor is allowed only when confirmed source or a documented
business workflow requires an independently addressable page; absence of an
existing modal is not such evidence. View mode reuses the same data/detail
contract and modal shell, makes controls read-only, hides Save, and offers Close.

```text
shared/components/editor-dialog/editor-dialog.component.ts
shared/components/editor-dialog/editor-dialog.component.html
shared/components/editor-dialog/editor-dialog.component.scss
shared/components/editor-tabs/editor-tabs.component.ts
shared/components/editor-tabs/editor-tabs.component.html
shared/components/editor-tabs/editor-tabs.component.scss
Fleet/VehicleService/components/details/details.component.html
Fleet/VehicleService/components/details/details.component.ts
```

`app-editor-dialog` owns the body-appended PrimeNG shell, header hierarchy,
close control, responsive width, Create/Edit Save action, View Edit action, and
Cancel/Close action. `app-editor-tabs` owns the tablist markup, translated tab
labels, stable tab IDs, `aria-controls`, roving `tabindex`, active presentation,
LTR/RTL arrow navigation, Home/End navigation, and focus movement. The feature
projects its body and optional `editorDialogHint`, supplies translated labels,
and handles the emitted close, edit, save, Escape and shown events. The feature
remains responsible for mode state, typed active-tab state, matching tab panels,
forms, validation, dirty detection, confirmation and persistence. Keep the
feature's own class prefix for projected panel content; never import another
feature's SCSS or recreate the shared tab-button styles.

```html
<app-editor-dialog
  [visible]="editorVisible()"
  [title]="pageTitleKey() | translate"
  [subtitle]="'feature.editorSubtitle' | translate"
  icon="bi bi-pencil-square"
  [mode]="editorMode()"
  dialogClass="feature-editor-dialog"
  [closeDisabled]="saving() || closeConfirmationPending()"
  [primaryActionVisible]="!loading() && !loadError()"
  [primaryActionDisabled]="saving()"
  [saving]="saving()"
  [closeLabel]="'general.close' | translate"
  [cancelLabel]="'general.cancel' | translate"
  [editLabel]="'general.edit' | translate"
  [saveLabel]="'general.save' | translate"
  (closeRequested)="requestClose()"
  (editRequested)="enableEditing()"
  (saveRequested)="save()"
  (escapeRequested)="onDialogEscape($event)"
  (shown)="onEditorShown()"
>
  <div class="feature-editor-content">…tabs or form…</div>

  @if (isEditableMode()) {
    <p editorDialogHint>{{ 'feature.requiredFieldsHint' | translate }}</p>
  }
</app-editor-dialog>
```

### Shared accessible tabs

Use the shared component for every new or refactored custom editor tablist. The
feature supplies a typed key union and translation keys; the shared component
emits only a valid key from that list:

```ts
import {
  EditorTab,
  EditorTabsComponent,
} from 'src/app/modules/shared/components/editor-tabs/editor-tabs.component';

type FeatureEditorTab = 'general' | 'children' | 'documents';

readonly tabs: ReadonlyArray<EditorTab<FeatureEditorTab>> = [
  { key: 'general', label: 'feature.tabs.general', icon: 'bi bi-card-list' },
  { key: 'children', label: 'feature.tabs.children', icon: 'bi bi-list-check' },
  { key: 'documents', label: 'feature.tabs.documents', icon: 'bi bi-file-earmark-text' },
];

readonly currentTab = signal<FeatureEditorTab>('general');
```

Import `EditorTabsComponent` in the standalone feature component, then keep the
panels in the feature form:

```html
<app-editor-tabs
  [tabs]="tabs"
  [activeTab]="currentTab()"
  [ariaLabel]="'feature.editorSections' | translate"
  idPrefix="feature-editor"
  (activeTabChange)="currentTab.set($event)"
/>

@switch (currentTab()) {
  @case ('general') {
    <section
      id="feature-editor-panel-general"
      role="tabpanel"
      aria-labelledby="feature-editor-tab-general"
      tabindex="0"
    >
      …feature fields…
    </section>
  }
}
```

`idPrefix` is required and must be unique among simultaneously rendered tabsets.
Each panel ID must be `${idPrefix}-panel-${key}` and its `aria-labelledby` must
be `${idPrefix}-tab-${key}`. Tab labels are translation keys; `ariaLabel` is the
already translated accessible name. The shared component owns the tab-strip
styles and consumes the shared editor-dialog tokens plus the global Sigma
primary tokens. Feature SCSS owns only panel content and responsive layout.

`app-editor-tabs` has two canonical appearances. `underline` is the default for
modal/detail editors. `workspace` is the routed dense-workspace appearance and
is the single source of the rounded tab strip, icon tile, active underline,
hover/focus treatment, horizontal overflow, RTL keyboard behavior and dark
state used by both Opening Balances and Link Accounts. Use it as:

```html
<app-editor-tabs
  [tabs]="tabs"
  [activeTab]="currentTab"
  [ariaLabel]="'feature.sections' | translate"
  idPrefix="feature-workspace"
  appearance="workspace"
  (activeTabChange)="setCurrentTab($event)"
/>
```

Do not reproduce workspace-tab markup or styles in feature SCSS. When an older
workspace is refactored, remove its local tab button loop and point it to this
shared appearance so all routed workspaces stay visually and behaviorally
consistent.

Do not keep a feature-local `onTabKeydown`, tab-button loop, or duplicate tab
styles after adopting `app-editor-tabs`.

### Screenshot functional evidence + named modal shell

When the owner supplies screenshots **and** explicitly names an existing Sigma
modal whose style must be reused, split the acceptance criteria instead of
choosing only one reference:

- the screenshots identify functional content: visible fields, labels, logical
  groups, diagrams/images, actions, and the captured state. Classify each item
  under the Master Guide evidence policy; do not infer completeness;
- `app-editor-dialog` controls the shared shell: overlay, width constraints,
  header/title/description, close-button position, approved group presentation,
  field layout, content padding and scrolling, footer, Cancel/Save order,
  button/icon treatment, responsive behaviour, accessibility, RTL and dark
  theme;
- inspect the shared editor component and the owner-named feature's projected
  content before editing; never reproduce either from memory;
- apply the same shell to Create, Edit and View. Change only the mode-specific
  title, read-only state and available actions;
- keep the target feature's own class prefix and business logic for projected
  content. Do not import another feature's SCSS or copy its feature-specific
  controls and payloads.

The screenshot evidence establishes the feature data and logical groups;
`app-editor-dialog` determines the shell and `app-editor-tabs` determines the
projected tab navigation. The feature still owns its panel implementation. If
required content does not fit, use the approved responsive and scrolling
pattern. Do not infer modal width or breakpoints from the captured viewport.

The shared shell means: an internal `p-dialog` appended to `body`; a full-width
flex header with icon, title, optional description and close control at the
logical edge; one bounded scrolling body; and a footer with the optional hint
separated from mode-aware actions. Its default width is `1040px`, with `94vw`
and narrow-screen breakpoints. Override the width inputs only when confirmed
content requires it. `app-editor-tabs` and the feature-owned panels remain
projected editor body content.

### Nested child draft variant

The CompanyPartner driver component is the reference integration for a nested
child draft with shared dialog, tabs, form sections and collection summary. It
owns draft isolation, validation, dirty-close approval and parent commit; it
does not own any dialog/tab/section shell markup or styling. Define
`driverTabs` and `currentDriverTab` with the typed shared-tab contract above.
The parent collection changes only after child Save succeeds:

```html
<app-editor-dialog
  [visible]="visible"
  [title]="driverTitleKey() | translate"
  [subtitle]="'companyForm.driverDialogDescription' | translate"
  icon="bi bi-person-vcard"
  [mode]="driverDialogMode()"
  width="1280px"
  [breakpoints]="{ '1199px': '94vw', '767px': 'calc(100vw - 16px)' }"
  [closeDisabled]="saving || closeConfirmationPending"
  [saving]="saving"
  [closeLabel]="'general.close' | translate"
  [cancelLabel]="'general.cancel' | translate"
  [saveLabel]="'general.save' | translate"
  (closeRequested)="requestClose()"
  (escapeRequested)="onDialogEscape($event)"
  (saveRequested)="saveDriver()"
>
  @if (driverDraft) {
    <div [formGroup]="driverDraft" class="company-driver-editor">
      <app-editor-tabs
        [tabs]="driverTabs"
        [activeTab]="currentDriverTab()"
        [ariaLabel]="'mangeDetails.driver' | translate"
        idPrefix="company-driver"
        (activeTabChange)="currentDriverTab.set($event)"
      />

      @switch (currentDriverTab()) {
        @case ('detail') {
          <section id="company-driver-panel-detail" role="tabpanel"
                   aria-labelledby="company-driver-tab-detail" tabindex="0">
            … field groups …
          </section>
        }
        @case ('documents') {
          <section id="company-driver-panel-documents" role="tabpanel"
                   aria-labelledby="company-driver-tab-documents" tabindex="0">
            <app-documents [parentForm]="driverDraft" arrayName="documents"></app-documents>
          </section>
        }
      }
    </div>
  }

</app-editor-dialog>
```

Draft in, parent touched only on Save:

```ts
openDialog() {                       // Add
  this.editIndex = null;
  this.driverDraft = this.createDriverForm();
  this.visible = true;
}

editDriver(index: number) {          // Edit
  this.editIndex = index;
  this.driverDraft = this.createDriverForm();
  this.driverDraft.patchValue(driverValues);
  this.visible = true;
}

saveDriver() {
  if (!this.driverDraft) return;
  if (this.driverDraft.invalid) { this.driverDraft.markAllAsTouched(); return; }
  if (this.editIndex !== null) this.drivers.setControl(this.editIndex, this.driverDraft);
  else this.drivers.push(this.driverDraft);
  this.driverDraft = null;
  this.visible = false;
}
```

Field groups are declarative, so the template loops instead of repeating markup:

```ts
private readonly driverFieldGroupDefinitions = [
  { key: 'identity', titleKey: 'companyForm.driverIdentity',
    descriptionKey: 'companyForm.driverIdentityHint', icon: 'bi bi-person-vcard',
    fieldNames: ['firstName', 'middleName', 'lastName', 'gender', 'nationality', 'birthDate'] },
  { key: 'contact',  … fieldNames: ['email', 'mobileNo', 'phoneHome', 'phoneWork'] },
  { key: 'address',  … fieldNames: ['address', 'city', 'state', 'zipCode', 'country'] },
  { key: 'additional', … fieldNames: ['notes'] },
];
```

**Single-section variant:** use the same `app-editor-dialog`, drop
`app-editor-tabs`, and keep the groups. Use tabs only for real peer groups such
as Detail + Documents.

### Routed full-page detail form with a bounded child collection

> **Status: Canonical composite variant** — use only when the feature has an
> explicitly approved independently addressable Create/Edit/View route; this
> does not replace the ordinary CRUD modal rule above

Approved reference:

```text
Rental/RentalQuotation/components/details/details.component.{ts,html,scss}
shared/components/form-section/
shared/components/editable-collection-table/
```

Use this shape when the editor must occupy the authenticated viewport as a
route-level page. Keep one typed parent form and use the shared section and
editable-table components; the feature owns only the route state, controls,
payload, validation, and business behavior.

The routed shell owns the available viewport between the existing header and
footer. It must have `min-height: 0` and `overflow: hidden`, with no browser/page
scroll. The form body is a flex column: the first section keeps its intrinsic
height, the child-collection section fills the remaining height, and the
Save/Cancel footer is a non-shrinking sibling outside the clipped form body.

Use the section header action projection for Add. Do not render a second Add
toolbar inside the child table when the enclosing section already owns the
visible title:

```html
<app-form-section
  title="feature.items"
  icon="bi bi-list-check"
  density="compact"
  [fill]="true"
>
  <app-primary-action-button
    form-section-actions
    [label]="'general.add' | translate"
    icon="bi bi-plus-lg"
    [disabled]="!isEditable()"
    (pressed)="addItem()"
  />

  <div class="feature-items-table-area">
    <app-editable-collection-table
      title="feature.items"
      [headingVisible]="false"
      [columns]="itemColumns"
      [editable]="isEditable()"
      [fillHeight]="true"
      tableMinWidth="1200px"
      maxHeight="clamp(120px, calc(100dvh - 540px), 240px)"
      (removeRequested)="requestRemoveItem($event)"
    >
      <!-- projected typed cells only -->
    </app-editable-collection-table>
  </div>

  <div class="feature-summary" aria-live="polite">
    <!-- totals, discount and grand total; never place this inside the table frame -->
  </div>
</app-form-section>
```

`app-form-section [fill]="true"` makes the section and its content a bounded
flex column. The feature table area gets `min-height: 0`, `flex: 1 1 auto`, and
`overflow: hidden`; `app-editable-collection-table [fillHeight]="true"` makes
its frame the flex child. Give the frame a responsive `maxHeight` and keep
`overflow-x: auto` plus `overflow-y: auto` in the shared table. The summary
must be `flex: 0 0 auto`, so it remains visible when the row frame acquires a
vertical scrollbar. Use logical properties and existing light/dark/RTL tokens;
do not add a feature body scroll or a second page-height calculation.

The page action footer is outside the form's overflow region and remains
reachable at all row counts:

```html
</form>
<footer class="feature-page-actions">
  <button type="button" (click)="requestClose()">…</button>
  @if (!isView()) {
    <app-primary-action-button
      [label]="'general.save' | translate"
      icon="bi bi-check2-circle"
      (pressed)="save()"
    />
  }
</footer>
```

**Check:** route approval is recorded before using this variant · one parent
`FormGroup` · fixed shell ends above the normal app footer · no page/body scroll
introduced · section Add is projected into the title row · child table owns the
only row scroll · totals/discount/grand total remain outside the table frame and
visible · action footer is outside the clipped form body · `Save` is hidden in
View mode · logical properties, RTL, dark theme and print overrides remain
valid.

### Closing a dirty tabbed modal — canonical

The shared editor shell is controlled, but the feature still owns the decision
to close because only the feature knows whether its form or child drafts are
dirty. A two-way visibility/onHide reset allows PrimeNG to hide the surface
before the feature decides whether changes may be discarded.

For every editable tabbed dialog, use **controlled visibility**: the dialog never closes
itself, every close attempt goes through one method, and reset happens only after
the close is agreed.

```html
<app-editor-dialog
  [visible]="visible()"
  [title]="titleKey() | translate"
  [mode]="mode()"
  [closeDisabled]="closeConfirmationPending() || saving()"
  [saving]="saving()"
  (closeRequested)="requestClose()"
  (escapeRequested)="onDialogEscape($event)"
  (editRequested)="enableEditing()"
  (saveRequested)="save()"
>
  <div class="feature-editor-content">…tabs and field groups…</div>
</app-editor-dialog>
```

The shared shell disables PrimeNG's own exits, so the header X, Cancel/Close and
scoped Escape output all funnel into `requestClose()`. Do not add a `document`
Escape listener: it also sees Escape from a dropdown or the discard confirmation
and can immediately open a second confirmation.

```ts
readonly visible = signal(false);
readonly closeConfirmationPending = signal(false);

onDialogEscape(event: Event): void {
  event.preventDefault();
  event.stopPropagation();
  this.requestClose();
}

requestClose(): void {
  if (this.closeConfirmationPending()) return;

  if (!this.driverDraft?.dirty) {
    this.close();
    return;
  }

  this.closeConfirmationPending.set(true);
  this.confirmationDialog
    .confirm({
      severity: 'warning',
      title:   { key: 'companyForm.discardDriverTitle' },
      message: { key: 'companyForm.discardDriverMessage' },
      icon: 'bi bi-exclamation-triangle',
      confirmLabel: { key: 'companyForm.discard' },
      cancelLabel:  { key: 'general.cancel' },
      confirmIcon: 'bi bi-x-circle',
    })
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.closeConfirmationPending.set(false)),
    )
    .subscribe((confirmed) => {
      if (confirmed) this.close();
    });
}

// Hide first, then reset. Never reset from a visibility hook.
private close(): void {
  this.visible.set(false);
  this.driverDraft = null;
  this.editIndex = null;
}
```

Order matters: hide, then reset. Resetting inside `(onHide)` runs before the user
has answered, which is the defect being replaced. The confirmation dialog is
appended to body, so it correctly stacks above this dialog (block 11).

**Check:** Fleet shell structure + target-owned class prefix · `appendTo="body"`
+ unique `styleClass` · `[draggable]="false"` · responsive
`[style]`/`[breakpoints]`, never `100vw`/`100vh` · child draft mutates its parent
only in Save · close intent goes through one method that applies the discard
rule, then `close()` hides and resets · no reset in `(onHide)` · nested dropdowns
and calendars also `appendTo="body"` · width sized for the widest tab, not the
first · rebuild translated field config on `onLangChange`.

**Header and action styling:** a custom header supplied through `pTemplate="header"`
is a flex item inside PrimeNG's dialog header. Give the custom header
`width: 100%` and keep the close control at the logical edge with
`margin-inline-start: auto`; otherwise the header can shrink-wrap around the
title and place the X button beside it instead of at the dialog edge. Primary
action buttons must set their icon colour explicitly so theme or Bootstrap icon
rules cannot reduce contrast:

```scss
.company-driver-dialog-heading {
  display: flex;
  width: 100%;
  align-items: flex-start;
  justify-content: space-between;
}

.company-driver-dialog-close {
  margin-inline-start: auto;
}

.company-dialog-primary,
.company-dialog-primary i {
  color: #fff;
}
```

The same rules apply when a feature uses its own class prefix instead of the
CompanyPartner names above.

---

## 14. Editable collection table

> **Status: Canonical**

`shared/components/editable-collection-table` is the single owner of compact
editable collection chrome. It renders the optional heading icon, title and
hint, shared primary Add action, collection-level validation alert, translated/required headers, responsive table
shell with an optional minimum width, default Remove or projected row actions,
empty state, and light/dark styling. The feature projects only its typed data
cells/actions and retains all domain behavior. CompanyPartner uses the same
component for contact persons, credit cards, documents, and the driver summary;
do not copy their former `company-editable-table` markup.

Import both standalone declarations in the direct consumer:

```ts
import {
  EditableCollectionActionsDirective,
  EditableCollectionRowDirective,
  EditableCollectionTableColumn,
  EditableCollectionTableComponent,
} from 'src/app/modules/shared/components/editable-collection-table/editable-collection-table.component';

@Component({
  imports: [
    EditableCollectionActionsDirective,
    EditableCollectionRowDirective,
    EditableCollectionTableComponent,
  ],
})
export class DetailsComponent {
  readonly partColumns: ReadonlyArray<EditableCollectionTableColumn> = [
    { header: 'services.part' },
    { header: 'services.qty', numeric: true },
  ];
}
```

The column `header` and every text input below are translation keys. Set
`numeric: true` for a compact numeric column and `required: true` when the
projected control is required. The shared component translates the keys and
supplies the accessible table and button labels.

```html
<app-editable-collection-table
  title="services.parts"
  description="services.partsHint"
  addLabel="services.addPart"
  emptyMessage="services.noParts"
  [columns]="partColumns"
  [editable]="isEditableMode()"
  [addDisabled]="partOptions().length === 0"
  (addRequested)="addPart()"
  (removeRequested)="confirmRemovePart($event)"
>
  <ng-template [appEditableCollectionRow]="parts.controls" let-control>
    <ng-container [formGroup]="control">
      <td>
        <p-dropdown
          formControlName="itemId"
          [options]="partOptions()"
          optionLabel="value"
          optionValue="id"
        ></p-dropdown>
      </td>
      <td class="is-number">
        <input
          type="number"
          formControlName="quantity"
          min="1"
          max="2147483647"
          step="1"
        />
      </td>
    </ng-container>
  </ng-template>
</app-editable-collection-table>
```

The shared component renders each `<tr>` and tracks the row object. The
`appEditableCollectionRow` template must therefore emit `<td>` cells only; do
not project another `<tr>`. A reactive row can wrap those cells in
`<ng-container [formGroup]="control">` because the container adds no DOM node.

When a row needs more than the standard Remove request, project the shared
action context. The table still owns the action cell and the feature owns the
typed Edit/Delete behavior:

```html
<ng-template appEditableCollectionActions let-index="index">
  <span class="app-editable-collection-table__row-actions">
    <button type="button" class="app-editable-collection-table__row-action"
            (click)="editDriver(index)" [attr.aria-label]="'general.edit' | translate">
      <i class="bi bi-pencil-square" aria-hidden="true"></i>
    </button>
    <button type="button"
            class="app-editable-collection-table__row-action app-editable-collection-table__row-action--danger"
            (click)="confirmRemoveDriver(index)" [attr.aria-label]="'general.remove' | translate">
      <i class="bi bi-trash3" aria-hidden="true"></i>
    </button>
  </span>
</ng-template>
```

### Contract

| Binding | Meaning |
|---|---|
| `title` | Required translated-key heading and table accessible name |
| `description` | Optional translated-key helper text |
| `headingIcon` | Optional decorative Bootstrap icon for the visible heading |
| `headingVisible` | Defaults true; set false when an enclosing `app-form-section` already renders the visible title. `title` remains required for the table accessible name |
| `tableMinWidth` | Optional CSS minimum width such as `900px`; preserve wide editable-row usability while the shared frame supplies horizontal scrolling |
| `fillHeight` | Defaults false; set true only when the feature places the table in a bounded flex area; the shared host and scroll frame then participate in the available height instead of expanding the page |
| `maxHeight` | Optional responsive upper bound for the shared scroll frame; pair with `fillHeight` when totals or other content must remain visible below the table |
| `columns` | Required ordered header definitions; `numeric` applies the compact numeric-column class and `required` renders the required marker |
| `emptyMessage` | Required translated-key empty-state message |
| `emptyIcon` | Optional decorative Bootstrap icon for the empty state |
| `editable` | Shows the Add action, action column, and Remove buttons when true |
| `addLabel` | Translated-key label for the shared primary Add action |
| `addDisabled` | Disables Add while a prerequisite such as lookup data is unavailable |
| `validationMessage` | Optional translated-key collection-level validation alert rendered in the shared toolbar; the feature owns the condition/key (for example duplicate logical rows) |
| `actionsLabel` | Optional action-column translation key; defaults to `general.actions` |
| `removeLabel` | Optional Remove translation key; defaults to `general.remove` |
| `addRequested` | Requests a feature-owned add/default-row/dialog workflow |
| `removeRequested` | Requests removal by current row index; it does not mutate the collection |
| `appEditableCollectionActions` | Optional projected action buttons with typed row and index context; replaces the default Remove button without moving action-cell ownership into the feature |

When the table is inside an enclosing `app-form-section`, project the Add action
into the section heading with the `[form-section-actions]` slot and set
`headingVisible="false"` on the table. This keeps one visible title row and
places Add at its logical end. Do not keep both the section-header Add and the
table toolbar Add.

The ownership boundary is strict:

- Shared component: optional toolbar, Add button, table frame, required headers,
  empty state, action column, default Remove or projected-action presentation,
  row tracking, responsive behavior, focus styles, RTL-safe layout, and
  light/dark colors.
- Feature: typed `FormArray` or row collection, row controls, projected cells,
  lookup options, validation messages, view/edit cell rendering, removal
  confirmation, collection mutation, dirty state, payload mapping, and
  persistence.
- Nested draft dialogs: block 13 still owns draft-form isolation and parent
  commit-on-Save mechanics. Use them when Add/Edit needs a form dialog; present
  the resulting rows through this shared table.

Keep the array typed and feature-owned. Create or attach it in the feature form;
the shared component must never create controls or reconcile the aggregate.
Handle removal as a request and confirm before mutating:

```ts
confirmRemovePart(index: number): void {
  if (!this.isEditableMode()) return;

  this.confirmationDialog
    .confirm({
      severity: 'warning',
      title: { key: 'services.removeChildTitle' },
      message: { key: 'services.removePartMessage' },
      confirmLabel: { key: 'general.remove' },
      cancelLabel: { key: 'general.cancel' },
      confirmIcon: 'bi bi-trash3',
    })
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((confirmed) => {
      if (!confirmed) return;

      this.parts.removeAt(index);
      this.vehicleServiceForm.markAsDirty();
    });
}
```

**Check:** shared component and row directive are both imported · the actions
directive is imported when custom actions are projected · column order matches
projected cell order · row template emits cells, not a row · translation
keys exist · collection-level blockers use the shared `validationMessage` alert · `editable` is false in View mode · Add prerequisites use
`addDisabled` · feature confirms Remove (block 11) before mutation · feature
marks the parent dirty and maps the collection into the write payload ·
`fillHeight` is used only inside a bounded flex parent · `maxHeight` and
`overflow-y: auto` keep row scrolling inside the table · totals/summaries remain
outside the table frame and do not disappear when the frame scrolls.

### Financial collection editor — canonical routed variant

Use this variant for accounting setup or maintenance screens that edit many
financial rows under one shared business context, especially when the screen is
split into source/type tabs. The approved reference is:

```text
Accounts/openingBalances/components/details/
Accounts/openingBalances/components/{accounts,cost-center,customers,suppliers,staff,stock,prepaid,deposit}/
shared/components/editable-collection-table/
```

The feature owns the typed forms, filters, totals, row mapping and persistence.
`app-editable-collection-table` still owns the table chrome. Routed source/type
navigation uses `app-editor-tabs appearance="workspace"`; Opening Balances and
Link Accounts are the approved routed references for that shared visual shape.
Do not fork or copy the shared editable-table or tab components just to change
height, scrolling or tab presentation.

#### Header and immutable business context

Use `app-feature-title` once. Put server-owned context that the user needs while
editing in its action/metadata area rather than in an editable field. Examples
include fiscal-year start, posting context or an immutable status. A server-owned
value must not be presented with a fake Save/Change action.

#### Grow until the footer, then scroll rows internally

The desktop card grows naturally while the row count is small. It must not force
an empty full-height workspace when only a few rows exist. As rows are added, the
workspace may grow until the available authenticated-shell height is reached.
After that point, the browser page must not keep growing for those rows: the
editable table frame becomes the vertical scroll owner.

Keep header, tabs, state banner, compact filters, financial summary and primary
Save action outside the row-scroll frame. Keep table headers sticky inside that
frame. The required flex-shrink chain uses `min-height: 0` on every shrinking
ancestor between the route/card and the table frame; missing one link usually
causes the page itself to grow despite `overflow: auto` lower in the DOM.

Prefer inheriting the bounded authenticated shell established in block 1. When a
route truly needs a local grow-until-cap boundary, apply one route-level
`max-height` using the existing Metronic shell variables; do not repeat viewport
calculations in tab components or child forms:

```scss
.financial-editor-page {
  box-sizing: border-box;
  display: flex;
  min-width: 0;
  min-height: 0;
  max-height: calc(
    100dvh - var(--bs-app-header-height, 74px) -
      var(--bs-app-toolbar-height, 55px) -
      var(--bs-app-footer-height, 60px) - 60px
  );
  flex-direction: column;
  overflow: hidden;
}

.financial-editor-card,
.financial-editor-content,
.financial-editor-tab,
.financial-editor-tab > form {
  display: flex;
  min-width: 0;
  min-height: 0;
  flex: 1 1 auto;
  flex-direction: column;
  overflow: hidden;
}

.financial-editor-content app-editable-collection-table,
.financial-editor-content .app-editable-collection-table {
  display: flex;
  min-width: 0;
  min-height: 0;
  flex: 1 1 auto;
  flex-direction: column;
}

.financial-editor-content .app-editable-collection-table__frame {
  min-height: 0;
  flex: 1 1 auto;
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-gutter: stable both-edges;
}

.financial-editor-content .app-editable-collection-table__frame thead th {
  position: sticky;
  z-index: 1;
  top: 0;
}
```

The final `60px` above is breathing room for the current shell, not another
footer. Use the actual existing layout variables and the closest approved screen
when the shell changes. Never create page scroll plus table scroll for the same
row set. On narrow/mobile layouts, relax the bounded editor when necessary so
controls remain usable; avoid nested vertical scroll regions.

#### Compact filters inside financial editors

Financial-editor filters are a compact toolbar, not a second large card and not
one field per line on ordinary desktop widths:

- wrap with flex/grid and align controls to the bottom;
- target roughly `170px` field basis and allow useful fields to grow to about
  `300px`;
- consume `--sigma-filter-control-height` (`34px` current fallback) for
  single-line native and PrimeNG controls;
- keep labels legible at about `11px`, with small `5-8px` gaps and `5-8px`
  vertical padding;
- Search is primary; Reset is neutral/secondary;
- body-appended dropdown/calendar overlays must remain visible despite bounded
  editor overflow.

Do not compress filters by removing labels, shrinking practical hit targets or
reducing contrast.

#### Financial summary/action strip

Do not render Total Debit, Total Credit or Balance as one unstructured sentence.
Place a compact summary strip immediately below the scrollable table and keep it
outside the table frame so totals and Save remain visible while rows scroll.

```html
<div class="financial-summary-bar">
  <div class="financial-summary-items">
    <div class="financial-summary-item financial-summary-item--debit">
      <span class="financial-summary-label">{{ '...' | translate }}</span>
      <strong class="financial-summary-value">{{ totalDebit() | number:digitsInfo() }}</strong>
    </div>
    <div class="financial-summary-item financial-summary-item--credit">
      <span class="financial-summary-label">{{ '...' | translate }}</span>
      <strong class="financial-summary-value">{{ totalCredit() | number:digitsInfo() }}</strong>
    </div>
    <div class="financial-summary-item financial-summary-item--balance">
      <span class="financial-summary-label">{{ '...' | translate }}</span>
      <strong class="financial-summary-value">{{ balance() | number:digitsInfo() }}</strong>
    </div>
  </div>
  <app-primary-action-button ... />
</div>
```

Current Sigma financial-summary geometry is compact: `8-10px` strip padding,
`8px` radius, normal border and soft surface. Individual totals use about `132px`
minimum width, `6px 10px` padding and `7px` radius. Labels are muted and about
`9px`; values are about `14px`, weight `800`, and use
`font-variant-numeric: tabular-nums` so monetary columns do not visually jump.

Accounting accents are presentation only:

- Debit: green accent (`#2f9d72` border / `#237b59` light value /
  `#7fd6b2` dark value);
- Credit: warm accent (`#c46a52` border / `#9e503d` light value /
  `#f0a28d` dark value);
- Balance: Sigma primary family (`#176f9d` light / `#8fd7f5` dark).

Debit green and Credit warm/red are **not** Success/Error semantic states. Do not
attach success/error copy, icons or accessibility meaning to them based only on
color. Totals use the same backend-driven monetary precision policy as row
inputs; never introduce a separate frontend rounding rule.

**Financial collection check:** one `app-feature-title` · server-owned context is
read-only header metadata · compact desktop filters · shared editable collection
component retained · complete `min-height: 0` flex chain · one internal row
scroll after the workspace cap · sticky table header · totals and Save outside
the scroll frame · tabular monetary values · backend monetary precision · Debit/
Credit colors remain non-semantic · RTL logical properties and dark equivalents.
---

## 15. View mode

> **Status: Canonical**

The route supplies the mode; the container disables the whole form once.

```ts
readonly pageMode = signal<CompanyEditorMode>('create');
readonly isViewMode = computed(() => this.pageMode() === 'view');
readonly isEditableMode = computed(() => this.pageMode() !== 'view');

readonly pageTitleKey = computed(() => {
  if (this.pageMode() === 'view') return 'companyForm.viewTitle';
  if (this.pageMode() === 'edit') return 'companyForm.editTitle';
  return 'companyForm.createTitle';
});

private applyFormMode(): void {
  if (this.isViewMode()) this.companyPartnerForm.disable({ emitEvent: false });
  else this.companyPartnerForm.enable({ emitEvent: false });
}
```

Child sections need no mode input — they read `parentForm.disabled`. Header
swaps Cancel for Close and shows an Edit button:

```html
@if (isViewMode()) {
  <app-primary-action-button
    [label]="'general.edit' | translate"
    icon="bi bi-pencil-square"
    (pressed)="openEdit()"
  />
}
```
```html
{{ (isViewMode() ? 'general.close' : 'general.cancel') | translate }}
```

**Check:** `disable({ emitEvent: false })` so it does not fire `valueChanges` ·
step navigation still works in view mode · Save hidden, not just disabled · Add
and Delete buttons disabled through `parentForm.disabled`.

---

## 16. Dropdowns, lookups, enums

> **Status: Canonical**

**Server lookup** — always `getSelectList` returning `DropDownSelect`:

```ts
export interface DropDownSelect {
  id: number | string;
  value: string;
  no?: string;
}
```

```ts
private loadBranches(): void {
  this.branchService
    .getSelectList<Results<DropDownSelect>>()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (response) => {
        if (response.isSuccess) this.branchOptions.set(response.entities ?? []);
      },
      error: () => this.showError('companyPartners.lookupLoadError'),
    });
}
```

Bind `optionLabel="value"` and `optionValue="id"` — that matches
`DropDownSelect`, so do not invent other field names.

**Enum dropdown** — `EnumToArrayPipe` turns an enum into `{ key, value, id }[]`.
Map it once in memory when the component is created; mapping a small enum is
cheaper and safer than persisting it:

```ts
readonly documentTypeOptions = this.enumToArrayPipe.transform(DocumentTypeEnum);
readonly genderOptions = this.enumToArrayPipe.transform(GenderEnum);
```

For an enum dropdown bind `optionLabel="key"` and `optionValue="value"`.

**Legacy — do not copy.** Company caches these arrays under unversioned
`localStorage` keys such as `gender` and `documentType`. They can survive a
deployment after the enum changes, collide with another feature, and add storage
failure modes to a trivial transform. `CacheService.clearLocal()` and
`clearSession()` are worse: they wipe all storage, including the auth token and
`subscriptionId`. Do not use that cache for enum options and never call either
clear-all method.

The shared pipe currently declares `value: string`, but numeric enums such as
`GenderEnum` produce numbers at runtime. Keep the form control and payload
aligned with the real enum value. Correcting the shared generic return type is
part of backlog 22.

**Single dropdown border and appearance ownership.** A closed `.p-dropdown`
wrapper renders exactly one 1px border with `var(--sigma-control-radius)` (`6px` canonical). Its
nested `.p-dropdown-label` and trigger render no independent border, radius,
background, or box shadow, so they cannot cover the wrapper edge or create a
second outline. Use the shared surface/text/border tokens; do not create
feature-specific square, underline-only, pill, or double-border dropdowns.

Reset inherited inner `height`, `min-height`, and `max-height` constraints
because PrimeNG also puts `.p-inputtext` on the dropdown label; an oversized
label must never paint across the wrapper border. Do not target every
`.p-inputtext` under a field; scope input styling to the direct input or
`.p-calendar .p-inputtext`.

Keyboard focus uses the application primary color on the existing wrapper border
plus the common subtle focus ring (`0 0 0 3px` with a low-opacity
`--sigma-primary` mix). This is the same interaction treatment used by the
approved accounting workspaces and Chart of Accounts. Do not invent a different
focus halo per feature. The body-appended `.p-dropdown-panel` is a separate
overlay and may retain its single theme boundary. Give it a unique
`panelStyleClass` and style it in global `src/styles.scss` only when the feature
requires a real overlay variation.

When the dropdown is inside a canonical filter boundary from block 4, its
outer wrapper consumes `--sigma-filter-control-height`; do not replace that
shared 34px height in feature SCSS.

**Check:** lookup failures show a message, not silence · `optionLabel`/
`optionValue` match the source shape · `appendTo="body"` on every dropdown ·
`[showClear]` and `[filter]` instead of companion buttons · enum options mapped
once in memory · exactly one wrapper border with borderless label and trigger ·
inner label/trigger dimensions cannot cover the wrapper edge · focus changes
the existing border without an outer halo · filter dropdowns use the shared
34px height · no unversioned enum data stored in browser storage.

---

## 17. Dates

> **Status: Canonical**

`p-calendar`, always appended to body with the shared panel class:

```html
<p-calendar
  [inputId]="'company-driver-' + field.name"
  [formControlName]="field.name"
  [showIcon]="true"
  [showButtonBar]="true"
  [maxDate]="today"
  [readonlyInput]="true"
  appendTo="body"
  panelStyleClass="sigma-datepicker-panel"
  dateFormat="dd/mm/yy"
  [placeholder]="'dd/mm/yyyy'"
></p-calendar>
```

Display format is `dd/mm/yy` in the picker and `dd/MM/yyyy` in tables:

```html
{{ agreement.startDate | date: 'dd/MM/yyyy HH:mm' }}
```

When the calendar is inside a canonical filter boundary from block 4, its
wrapper, input, and visible trigger consume `--sigma-filter-control-height`.
Do not add a feature-local filter-calendar height.

**Date-only values must not go through `toISOString()`.** It converts local time
to UTC, which changes the calendar date whenever the local offset is **ahead of
UTC** — exactly the region this app runs in.

`new Date(2024, 0, 15)` is local midnight. In Dubai (UTC+4) that is
`2024-01-14T20:00:00Z`, so `toISOString().split('T')[0]` yields **`2024-01-14`**
— a day early. In Cairo (UTC+2) it yields the same. A negative offset such as
UTC−5 happens to survive, which is why the bug hides in some environments and
not others.

Build from local parts instead:

```ts
private toDateInput(value: string | Date | null | undefined): string {
  if (!value) return '';
  if (typeof value === 'string') {
    const dateOnly = /^(\d{4}-\d{2}-\d{2})/.exec(value);
    if (dateOnly) return dateOnly[1];
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
```

Validate ordering in the UI as well as the backend, e.g.
`validationMessages.expiryAfterIssueDate` for issue/expiry pairs.

A dialog should normally open with its calendar overlay closed. Because the
shared editor shell focuses the first focusable control, place `autofocus` on a
different meaningful input when a calendar would otherwise receive initial
focus. Keep the calendar's `[showOnFocus]="true"` so a later click on either the
date input or calendar icon opens it. Do not use `[showOnFocus]="false"` when
the input itself must remain an opening target; PrimeNG then opens only from the
icon.

When an editor has only date controls, or its first focusable control is a
calendar, bind the shell's `[focusOnShow]="false"` and do not call the calendar
input's `focus()` from `ngOnInit`, `onEditorShown`, or another lifecycle hook.
Keep `[showOnFocus]="true"`; the calendar then opens on an intentional user
click or keyboard focus, not while the dialog is being displayed. If initial
focus is required in View mode, focus the shared dialog close control instead
of a calendar.

When a small dialog's first required action is choosing a date, it may open the
calendar overlay after the shared editor shell emits `shown`. Keep this opt-in
and local to that workflow; do not auto-open every calendar in the app:

```ts
@ViewChild('effectiveDateCalendar')
private effectiveDateCalendar?: Calendar;

openDatePicker(): void {
  queueMicrotask(() => {
    const calendar = this.effectiveDateCalendar;
    if (!calendar) return;
    calendar.inputfieldViewChild?.nativeElement.focus();
    calendar.showOverlay();
  });
}
```

```html
<app-editor-dialog (shown)="openDatePicker()">
  <p-calendar
    #effectiveDateCalendar
    [showOnFocus]="true"
    appendTo="body"
    ...
  ></p-calendar>
</app-editor-dialog>
```

**Check:** `appendTo="body"` and `panelStyleClass="sigma-datepicker-panel"` ·
no `toISOString()` on a date-only value · `[maxDate]`/`[minDate]` where the
business requires it · issue/expiry and start/end ordering validated · any
calendar that must start closed does not receive initial focus · a user click
on its input or icon opens it · any auto-open behavior waits for dialog `shown`,
defers one microtask so projected content is settled, focuses the input, and is
limited to an explicitly confirmed date-first workflow · filter calendars use
the shared 34px wrapper, input, and trigger height.

---

## 18. Documents and upload

> **Status: Transitional** — rows carry server-owned `subscriptionId` and the
> reference cleanup is fire-and-forget, backlog 19 and 29

### Shared Documents/Images presentation

The Documents tab in **Create New Vehicle** is the visual reference for
document and image collection sections. Its reusable presentation lives in
global `src/styles.scss` behind the opt-in `sigma-documents` prefix. Use these
classes instead of copying the Fleet component SCSS:

| Concern | Shared class |
|---|---|
| Section card | `sigma-documents` |
| Header, icon and title | `sigma-documents__header`, `__icon`, `__title` |
| Add/delete/upload actions | `sigma-documents__actions`, `__action` plus `--add`, `--delete` or `--upload` |
| Content and file input | `sigma-documents__body`, `__file-row`, `__file-input`, `__file-name` |
| Collection table | `sigma-documents__table-wrap`, `__table`, `__row-actions` |
| File/image list | `sigma-documents__list`, `__list-item` |
| Empty state | `sigma-documents__empty` |

The global selector is intentionally opt-in; never style every `table`, file
input or `.document-*` element globally. Feature components retain their own
typed forms, upload workflow, validation and payloads. The shared pattern owns
presentation only and already includes light, dark, RTL and responsive rules.

`app-documents` is reusable across a step and a dialog tab. It takes the parent
form plus the array name, so one component serves both:

```ts
@Input() parentForm!: FormGroup;
@Input() arrayName: string = 'documents';

ngOnInit(): void {
  const documentsArray = this.parentForm.get(this.arrayName) as FormArray;
  if (!documentsArray) this.parentForm.addControl(this.arrayName, this.fb.array([]));
}
```

```html
<!-- inside the step -->
<app-documents [parentForm]="companyPartnerForm"></app-documents>

<!-- inside the driver dialog tab -->
<app-documents [parentForm]="driverDraft" arrayName="documents"></app-documents>
```

Upload stores a server path on the row; it does not hold the file in the form:

The reference implementation subscribes bare. Follow block 28 instead — tear
down, release the busy flag, and handle failure:

```ts
onFileSelected(index: number, file: File): void {
  if (!this.isAllowed(file)) {
    this.uploadError.set('companyForm.fileTypeOrSizeInvalid');
    return;
  }

  this.uploadError.set('');
  this.uploadingIndex.set(index);

  this.fileService.uploadFile('PartnerDocuments', file)
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.uploadingIndex.set(null)),
    )
    .subscribe({
      next: (path) => {
        this.pendingPaths.add(path);
        const row = this.documents.at(index);
        if (!row) return; // retained in pendingPaths for cleanup
        row.patchValue({ documentPath: path });
        row.get('documentPath')?.markAsTouched();
      },
      error: () => this.uploadError.set('companyForm.uploadFailed'),
    });
}
```

### Validation and abandoned uploads

Client checks are convenience only; the backend must re-validate extension,
MIME/signature, size and storage path.

```ts
private static readonly ALLOWED = ['pdf', 'jpg', 'jpeg', 'png'];
private static readonly MAX_BYTES = 5 * 1024 * 1024;

private isAllowed(file: File): boolean {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  return DocumentsComponent.ALLOWED.includes(ext)
    && file.size > 0
    && file.size <= DocumentsComponent.MAX_BYTES;
}
```

State the allowed types and size limit in the UI, not only in the validator.

**Abandoned uploads.** A file uploaded to the server before the parent form is
saved is an orphan if the user cancels. `Fleet/Vehicle` is the reference: it
tracks paths, but its current cleanup fires one unobserved request per path and
clears the sets before those requests succeed. That part is **Legacy — do not
copy**. Coordinate cleanup and retain failures:

```ts
private readonly pendingPaths = new Set<string>();   // uploaded, not yet saved
private readonly removedPaths = new Set<string>();   // saved, removed in this session
readonly fileCleanupRunning = signal(false);

private deleteTrackedPaths(paths: Set<string>): Observable<string[]> {
  const candidates = [...paths];
  if (!candidates.length) return of([]);

  return forkJoin(
    candidates.map((path) =>
      this.fileService.deleteFile(path).pipe(
        map(() => ({ path, deleted: true })),
        catchError(() => of({ path, deleted: false })),
      ),
    ),
  ).pipe(
    map((outcomes) => {
      const failed: string[] = [];
      outcomes.forEach((outcome) => {
        if (outcome.deleted) paths.delete(outcome.path);
        else failed.push(outcome.path);
      });
      return failed;
    }),
  );
}

// After the parent save succeeds, remove paths referenced by the saved form from
// the pending set. Anything left there was replaced/removed before Save and is
// an orphan. Delete it together with removed paths, retaining failures.
private finishSuccessfulSave(): void {
  const persistedPaths = new Set(
    this.documents.controls
      .map((control) => String(control.get('documentPath')?.value ?? '').trim())
      .filter(Boolean),
  );
  persistedPaths.forEach((path) => this.pendingPaths.delete(path));

  this.fileCleanupRunning.set(true);
  forkJoin({
    removedFailed: this.deleteTrackedPaths(this.removedPaths),
    orphanedFailed: this.deleteTrackedPaths(this.pendingPaths),
  })
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.fileCleanupRunning.set(false)),
    )
    .subscribe(({ removedFailed, orphanedFailed }) => {
      if (removedFailed.length || orphanedFailed.length) {
        this.uploadError.set('companyForm.fileCleanupFailed');
      }
      this.finish(true);
    });
}

// Before discard/close, wait for cleanup to settle. Failed paths remain in the
// set and are reported; the server must also expire abandoned temporary files.
private discardAndClose(): void {
  if (this.fileCleanupRunning()) return;
  this.fileCleanupRunning.set(true);
  this.deleteTrackedPaths(this.pendingPaths)
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.fileCleanupRunning.set(false)),
    )
    .subscribe((failed) => {
      if (failed.length) this.uploadError.set('companyForm.fileCleanupFailed');
      this.close();
    });
}
```

Replacing a file adds the old path to `removedPaths` rather than deleting it
immediately, so a failed save does not destroy the previous document.
Browser cleanup is best effort: a tab can be killed before any request runs, so
temporary uploads also need a server-side expiry/orphan-cleanup policy.
Add `companyForm.fileCleanupFailed` to both `en.ts` and `ar.ts` before using the
example message.

Row shape as currently built: `id`, `subscriptionId`, `documentType`,
`documentNumber`, `issuedBy`, `issueDate`, `expiryDate`, `documentPath`.

**`subscriptionId` should not be there.** It is the tenant, which is server-owned
— the backend must take it from the authenticated principal, never from the
request. The driver draft does the same thing
(`subscriptionId: Number(localStorage.getItem('subscriptionId') || 0)`). Both are
**legacy**: leave them until the backend contract is corrected together (block
30, items 8 and 19), and do not add server-owned fields to a new child row.

Server-owned, never client-supplied: tenant/`subscriptionId`, record number,
`createdAt`/`createdBy` and other audit values, delete flags, approval status,
calculated totals.

**Check:** `arrayName` passed when the array is not called `documents` · no
server-owned fields in a new row contract · existing `documentPath` preserved when no new
file is chosen · removal clears the path and marks touched · empty state present ·
issue/expiry ordering validated · never store CVV or card data in a document row.

---

## 19. Validation messages

> **Status: Canonical**

Shared keys, so messages read the same everywhere:

| Key | Use |
|---|---|
| `validationMessages.required` | empty required field |
| `validationMessages.email` | malformed email |
| `validationMessages.expiryAfterIssueDate` | date ordering |

Inline error under the control, with icon, shown only after `touched`:

```html
@if (driverDraft.get(field.name)?.invalid && driverDraft.get(field.name)?.touched) {
  <small class="company-field-error">
    <i class="bi bi-exclamation-circle" aria-hidden="true"></i>
    {{ validationMessageKey(driverDraft.get(field.name), field.validationMessages) | translate }}
  </small>
}
```

Apply this inline pattern to every control that has a validator in an Add/Edit
form, placing the message immediately below that control (including validated
controls inside editable child collections). On Save/submit, call
`markAllAsTouched()` before returning so every invalid control reveals its own
message; a form-level summary may remain as additional context but must not
replace the field-level messages. Bind `aria-invalid` to the same invalid and
touched state.

Do not use “email, otherwise required”: it labels pattern, length and date-order
errors as required. Map every validator the control can actually produce and
provide a translated fallback:

```ts
interface FieldValidationMessages {
  default: string;
  [errorName: string]: string;
}

private validationMessageKey(
  control: AbstractControl | null,
  messages: FieldValidationMessages,
): string {
  const errors = control?.errors;
  if (!errors) return messages.default;
  for (const errorName of Object.keys(errors)) {
    if (messages[errorName]) return messages[errorName];
  }
  return messages.default;
}
```

Define the map with every validator on that field:

```ts
validationMessages: {
  default: 'companyForm.invalidField',
  required: 'validationMessages.required',
  email: 'validationMessages.email',
  pattern: 'companyForm.emailFormat',
}
```

Every key in the map must exist in both `en.ts` and `ar.ts`; add
feature-specific keys when a validator needs context or parameters.

Mark the label, not the input, as required:

```html
<label class="form-label" [class.required]="field.required" [for]="'company-driver-' + field.name">
  {{ field.label | translate }}
</label>
```

On submit, reveal everything and move focus to the first invalid field:

```ts
if (this.driverDraft.invalid) {
  this.driverDraft.markAllAsTouched();
  const first = this.invalidFields()[0];
  if (first) queueMicrotask(() => this.navigateToInvalidField(first));
  return;
}
```

**Check:** error appears only after touch or submit · shared keys, not literal
English · one required marker per label, not duplicated by a global rule ·
every possible validator maps to the right key · `markAllAsTouched()` before the
first invalid return · focus moves to the first invalid field.

---

## 20. Report page

> **Status: Canonical composite** — shared page/actions plus shared report filter/summary visual language; feature-owned contracts, data and calculations

A report is **not** a list. It does not use the direct list `p-table` shape,
has no row actions and has no server
paging. The user picks filters, presses Search, and gets one document with
sections and totals. Reference:
`Customers/StatementOfAccount/components/list/`.

Sibling reports that follow the same shape: `Customers/BalancesSummary`,
`Customers/ReceivableAgeAnalysis`, `Suppliers/SupplierStatementOfAccount`,
`Staff/StaffStatementOfAccount`.

### Shared shell — mandatory replacement

Every report route imports `ReportPageComponent` and places `appReportPage` on
its outer `section`. Every report action group imports `ReportActionsComponent`
and uses `appReportActions`; this supplies the toolbar role, translated accessible
name, wrapping, spacing and print hiding. Do not recreate those host rules in a
feature and do not restore a legacy bare wrapper during review or refactor:

```html
<section appReportPage class="customer-statement-page">
  …feature-owned filters and report sections…
  <div
    appReportActions
    class="statement-actions"
    [ariaLabel]="'general.actions' | translate"
  >
    …Search, Print and Export buttons…
  </div>
</section>
```

```ts
imports: [
  ReportPageComponent,
  ReportActionsComponent,
  …
]
```

`shared/components/reports/` already applies both hosts, so its consumers must
not add another report page or action wrapper around `app-reports`. These shared
hosts own page/action presentation. API contracts, calculations, report sections,
data mapping, loading/error state and export mapping remain feature-owned. The
visual language for repeated report filters and accounting totals is shared and
must not be recreated feature-by-feature.

### Report filter + totals visual invariant

Opening Balances is the visual reference for compact accounting filters and
Debit/Credit/Balance summaries. Reports use the shared classes defined in
`src/styles.scss`, not copied feature CSS:

```html
<form class="sigma-filter-form sigma-report-filter-panel no-print" ...>
  <div class="sigma-report-filter-field">...</div>
  <label class="sigma-report-filter-check">...</label>
  <div appReportActions class="sigma-report-filter-actions">...</div>
</form>

<div class="sigma-report-summary-bar">
  <div class="sigma-report-totals">
    <div class="sigma-report-total sigma-report-total--debit">...</div>
    <div class="sigma-report-total sigma-report-total--credit">...</div>
    <!-- add --balance/--net only when the response owns that total -->
  </div>
</div>
```

The filter strip must match Opening Balances: compact wrapping layout, primary
inline-start accent, soft surface/gradient, shared 34 px control height, shared
6 px input/dropdown radius and focus ring, and actions visually contained in the
same strip. Search is the primary blue action; Refresh is a quieter primary-tinted
action; Reset is a neutral surface/outline action; Excel/export uses a distinct
export treatment. Action icons inherit the action colour so solid and outlined
variants remain legible in light and dark themes. On mobile the group may wrap or
stack, but it must not create a second vertical scroll owner.

Accounting report totals use the same compact summary bar/card language as
Opening Balances: shared surface/border/radius, tabular numerals, and semantic
Debit/Credit/Balance-or-Net accents. The **numbers still come from the backend
response**; shared styling never authorizes client-side recomputation of
accounting totals. Keep the summary as small as the report needs: Trial Balance
uses only **Total Debit** and **Total Credit**. Do not add Beginning/Ending/Net
cards merely because the line model exposes those values. Add Balance or Net
summary cards only when they are a deliberate report KPI owned by the backend
contract and useful to the user.
If a report has a non-accounting KPI layout that genuinely needs another visual
shape, document the reason in its review evidence instead of silently forking the
filter/summary pattern.

For an explicitly approved dense accounting report that keeps its controls
visible, the routed report may be bounded to the available shell height and use
one internal **table-frame** vertical scroll owner. Keep the feature title,
filter strip, lookup/error messages and accounting summary outside that scrolling
frame. The table frame owns vertical row scrolling and any required horizontal
overflow, and the table header remains sticky at the top of that frame. Do not
put the vertical scroll on the surrounding card/results container and do not
introduce a nested TreeTable vertical scrollbar. Printing releases those bounds
so the full report can flow across pages.

### Dense accounting tree/report table visual invariant

`Reports/TrailBalance/components/list/` is the canonical visual reference for a
dense accounting report that renders hierarchical rows (`p-treeTable`) or for a
flat accounting report whose table serves the same read-only role. Reports with
this same UI role must keep the same compact visual grammar rather than inventing
a feature-specific table treatment:

- keep the table inside one bordered report table frame; the **table frame** is
  the row-scroll owner, never the surrounding report card;
- keep the table header sticky inside that frame and visually distinct with a
  soft themed surface, strong text, subtle vertical separators and a slightly
  stronger bottom rule; do not use an oversized or card-like header;
- target a compact header around `34px` high and compact data rows around `30px`
  high, with roughly `5-6px` header block padding and `3px` row block padding;
- numeric headers and cells align to logical end and use tabular numerals;
- the first account/description column aligns to logical start and receives the
  width needed to prevent hierarchy controls from crushing the label;
- hierarchy togglers stay compact (about `22px`) and must not inflate row height;
- when account code and account name are both shown, render them as separate
  visual parts: code is quieter/smaller, name is the primary readable label;
- hierarchy indentation must stay tight enough for dense accounting data. Do not
  add decorative nested cards, large left padding, or oversized tree icons;
- top-level hierarchy rows may receive a **subtle** weight/surface emphasis only;
  deeper levels rely on indentation and the tree control, not progressively
  louder backgrounds;
- preserve horizontal overflow when required by financial columns, but avoid a
  second nested vertical scrollbar inside the TreeTable itself;
- sticky-header, row-density and hierarchy styling must use logical properties
  (`inline-start`/`inline-end`) so Arabic RTL and English LTR remain equivalent;
- print mode removes height/overflow bounds and lets the complete table flow.

Use these rules for Trial Balance-like accounting reports and for any other
report with the same dense read-only tree/table role. A different table style is
valid only when the interaction model is materially different (for example an
editable collection, paged CRUD grid, or KPI dashboard), and that difference
must be recorded in review evidence.

`Reports/TrailBalance/components/list/` is the current report consumer and
Opening Balances remains the approved visual reference. A report review fails
final reconciliation if it reintroduces feature-local filter-strip or accounting
total-card styling when these shared classes fit the same UI role.

### Contract

One typed filter, one typed response holding every section:

```ts
export interface CustomerStatementFilter {
  customerId: number | string;
  fromDate: string;
  toDate: string;
  reportType: CustomerStatementReportType;   // 'ledger' | 'outstanding'
  includeInactive: boolean;
}

export interface CustomerStatement {
  contact: CustomerStatementContact;
  beginningBalance: number;
  totalDebit: number;
  totalCredit: number;
  endingBalanceTill: number;
  currentBalance: number;
  outstandingTotal: number;
  ageingSummary: StatementAgeingSummary | null;
  ledgerLines: StatementLedgerLine[];
  deposits: StatementDeposit[];
  pendingPDCs: StatementPendingPDC[];
  advanceTaxInvoiceLines: StatementLedgerLine[];
}
```

**All totals come from the response**, never summed in the template. A report
service is thin — one `GET`, same `Filters[key]` convention, `Result<T>` not
`Results<T>` because there is no paging:

```ts
@Injectable({ providedIn: 'root' })
export class CustomerStatementOfAccountService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.baseUrl}Customer/Statement`;

  getStatement(filter: CustomerStatementFilter): Observable<Result<CustomerStatement>> {
    const params = new HttpParams()
      .set('Filters[customerId]', String(filter.customerId))
      .set('Filters[fromDate]', filter.fromDate)
      .set('Filters[toDate]', filter.toDate)
      .set('Filters[reportType]', filter.reportType)
      .set('Filters[includeInactive]', String(filter.includeInactive));
    return this.http.get<Result<CustomerStatement>>(this.endpoint, { params });
  }
}
```

### Derived operational summary reports

A report that combines KPI-style summary sections with a detail table still
uses this report pattern. It is not a paged list and must not be converted to
`app-data-table`, `table-list`, or a client-side collection of placeholder
totals. Use one typed response containing every ordered summary section and the
detail rows. The template only formats values returned by the backend.

When the supplied evidence shows summary labels but not their calculations,
freeze a named backend derivation before implementing the screen. Record every
proxy (for example, how internal versus outside work or open versus closed jobs
is identified), the date boundary, the source entity, and the age buckets in
the feature handoff. Never fill an unconfirmed section with zeroes or derive a
different total for screen, print, and export.

Use the shared report shell and the current filter/action style:

- keep `app-feature-title` inside the report panel;
- place the complete typed filter form in one `no-print` row;
- for a single-day report, use one `p-calendar`, default it to today, require
  the value, and serialize it from local year/month/day parts;
- place Print, Export and Refresh/Search in one `appReportActions` toolbar;
- use a native semantic table for report rows and responsive horizontal
  scrolling, not list paging or row actions;
- show loading, inline error, empty-summary, and empty-detail states; and
- make solid action and title icons explicitly white in light and dark themes.

`Fleet/DailyServiceLogs/` is the baseline for the single-date operational
summary shape. Its ordered response arrays carry stable metric codes so labels
remain translated while calculation ownership stays on the backend.

### Filter bar

Date range as one control, `no-print` on the whole form, every control disabled
while the report runs:

```html
<form class="statement-filters no-print" [formGroup]="filterForm" (ngSubmit)="search()">
  <div class="statement-filter-grid">
    <div class="statement-field statement-date-field">
      <label for="statementDateRange">{{ 'customerStatement.dateRange' | translate }}</label>
      <p-calendar
        inputId="statementDateRange"
        formControlName="dateRange"
        selectionMode="range"
        [numberOfMonths]="2"
        dateFormat="dd/mm/yy"
        [showIcon]="true"
        [showClear]="true"
        [showButtonBar]="true"
        [hideOnDateTimeSelect]="false"
        iconDisplay="input"
        panelStyleClass="sigma-datepicker-panel statement-range-picker"
        [disabled]="loadingReport()"
        appendTo="body"
      ></p-calendar>
    </div>
    …customer dropdown, include-inactive checkbox…
  </div>

  <div class="statement-filter-footer">
    <div class="statement-report-types">
      <label>
        <p-radioButton formControlName="reportType" value="ledger"
                       [disabled]="loadingReport()"></p-radioButton>
        <span>{{ 'customerStatement.ledgerReport' | translate }}</span>
      </label>
      …outstanding…
    </div>

    <div
      appReportActions
      class="statement-actions"
      [ariaLabel]="'general.actions' | translate"
    >
      <button type="button" (click)="print()" [disabled]="!report() || loadingReport()">…</button>
      <button type="button" (click)="exportToExcel()"
              [disabled]="!ledgerLines().length || loadingReport()">…</button>
      <button type="button" (click)="refresh()" [disabled]="loadingReport()">…</button>
    </div>
  </div>
</form>
```

For a range calendar, keep the popup open after the first date is selected so
the user can select the end date from the same control:

```html
<p-calendar selectionMode="range" [hideOnDateTimeSelect]="false"></p-calendar>
```

Keep the range value date-based and make both dates easy to choose when the
range spans more than one month:

```html
<p-calendar
  selectionMode="range"
  dataType="date"
  [numberOfMonths]="2"
  rangeSeparator=" - "
></p-calendar>
```

Default the range to month-to-date so the page is useful on arrival:

```ts
private defaultDateRange(): Date[] {
  const toDate = new Date();
  toDate.setHours(0, 0, 0, 0);
  const fromDate = new Date(toDate.getFullYear(), toDate.getMonth(), 1);
  return [fromDate, toDate];
}
```

Serialize dates from local parts, never `toISOString()` (block 17):

```ts
private formatApiDate(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
```

### Search: validate, then run

Report filters are validated inline into `errorMessage`, not as a toast, because
the message belongs beside the filters:

```ts
search(): void {
  if (this.loadingReport()) return;

  const values = this.filterForm.getRawValue();
  const fromDate = values.dateRange?.[0] ?? null;
  const toDate = values.dateRange?.[1] ?? null;

  if (!fromDate || !toDate || fromDate.getTime() > toDate.getTime()) {
    this.errorMessage.set(this.translate.instant('customerStatement.invalidDateRange'));
    return;
  }
  if (values.customerId === null || values.customerId === '') {
    this.errorMessage.set(this.translate.instant('customerStatement.customerRequired'));
    return;
  }

  const filter: CustomerStatementFilter = {
    customerId: values.customerId,
    fromDate: this.formatApiDate(fromDate),
    toDate: this.formatApiDate(toDate),
    reportType: values.reportType,
    includeInactive: values.includeInactive,
  };

  this.errorMessage.set('');
  this.hasSearched.set(true);
  this.loadingReport.set(true);
  this.loading.startLoading();

  this.statementService.getStatement(filter)
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => { this.loadingReport.set(false); this.loading.endLoading(); }),
    )
    .subscribe({
      next: (response) => {
        if (response.isSuccess && response.entity) { this.report.set(response.entity); return; }
        this.report.set(null);
        this.errorMessage.set(response.message
          || this.translate.instant('customerStatement.loadError'));
      },
      error: () => {
        this.report.set(null);
        this.errorMessage.set(this.translate.instant('customerStatement.loadError'));
      },
    });
}
```

Changing the report type clears the previous result rather than showing stale
numbers under a new heading:

```ts
this.filterForm.controls.reportType.valueChanges
  .pipe(takeUntilDestroyed(this.destroyRef))
  .subscribe((reportType) => {
    this.selectedReportType.set(reportType);
    this.report.set(null);
    this.hasSearched.set(false);
    this.errorMessage.set('');
  });
```

### Sections from computed slices

Each section reads one `computed` off the single response, so the template never
touches `report()?.x?.y` chains:

```ts
readonly ledgerLines        = computed(() => this.report()?.ledgerLines ?? []);
readonly deposits           = computed(() => this.report()?.deposits ?? []);
readonly pendingPDCs        = computed(() => this.report()?.pendingPDCs ?? []);
readonly advanceTaxInvoices = computed(() => this.report()?.advanceTaxInvoiceLines ?? []);
readonly isOutstanding      = computed(() => this.selectedReportType() === 'outstanding');
```

### Rows, numbers, empty state

Amounts always `| number: '1.2-2'`. Blanks always `—`. Truncated text carries a
`[title]`. Conditional columns appear in header, body **and** footer together:

```html
<td class="description-cell" [title]="line.description || ''">{{ line.description || '—' }}</td>
<td>{{ line.debit | number: '1.2-2' }}</td>
@if (isOutstanding()) {
  <td>{{ line.dueAmount | number: '1.2-2' }}</td>
}
```

The empty row distinguishes "no result" from "not run yet":

```html
} @empty {
  <tr>
    <td [attr.colspan]="isOutstanding() ? 11 : 10" class="statement-empty-row">
      {{ (hasSearched() ? 'customerStatement.noData'
                        : 'customerStatement.selectCustomerPrompt') | translate }}
    </td>
  </tr>
}
```

### Totals footer

A separate summary table reusing the same `<colgroup>` via
`*ngTemplateOutlet`, so columns stay aligned with the scrolling body:

```html
<div class="statement-table-summary">
  <table class="statement-table statement-ledger-table" [class.outstanding-table]="isOutstanding()">
    <ng-container *ngTemplateOutlet="ledgerColumns"></ng-container>
    <tfoot>
      <tr>
        <td colspan="7" class="summary-caption">{{ 'customerStatement.summary' | translate }}</td>
        <td class="summary-value">
          <span>{{ 'customerStatement.totalDebit' | translate }}</span>
          <strong>{{ report()?.totalDebit || 0 | number: '1.2-2' }}</strong>
        </td>
        …
      </tr>
    </tfoot>
  </table>
</div>
```

Signed balances render as magnitude plus a Dr/Cr marker, not a minus sign:

```ts
balanceDirection(value: number | null | undefined): string {
  return (value ?? 0) >= 0
    ? this.translate.instant('customerStatement.debitShort')
    : this.translate.instant('customerStatement.creditShort');
}
absoluteAmount(value: number | null | undefined): number {
  return Math.abs(value ?? 0);
}
```

### Export

Build export objects when Export is clicked so translated property names use the
current language (block 8):

```ts
private buildExportRows(): Array<Record<string, string | number>> {
  return this.ledgerLines().map((line) => ({
    [this.translate.instant('customerStatement.date')]: this.formatDisplayDate(line.date),
    [this.translate.instant('customerStatement.debit')]: line.debit,
    …
  }));
}

exportToExcel(): void {
  const rows = this.buildExportRows();
  if (rows.length) {
    onExportToExcel(signal(rows), 'CustomerStatementOfAccount');
  }
}
```

The existing Statement of Account source memoises translated object keys in a
`computed()`. That is **Legacy — do not copy**: `translate.instant()` reads no
signal, so a language switch does not invalidate those cached headers.

A second export may aggregate the same lines — group in a `Map`, never a second
request:

```ts
readonly chargesTypewiseTotals = computed(() => {
  const totals = new Map<string, { voucherType: string; debit: number; credit: number; balance: number }>();
  this.ledgerLines().forEach((line) => { … });
  return Array.from(totals.values()); // neutral data; translate headers on click
});
```

**Check:** typed filter and one typed response · totals from the response, never
summed in the template · required filters validated into `errorMessage` before
the request · `hasSearched` distinguishes empty from not-run · every action
disabled while loading · export and print disabled with no data · amounts
`1.2-2` · `—` for blanks · conditional columns added to header, body and footer
together · dates serialized from local parts · one outer `appReportPage` · each
report action group uses `appReportActions` with a translated accessible name.

---

## 21. Report print

> **Status: Canonical** — `shared/service/report-print.service.ts`

Print is a first-class output, not an afterthought.

**`window.print()` on its own is not enough.** Metronic ships the rule that
strips the application shell, but it is opt-in via a body class. From
`assets/sass/core/layout/base/_print.scss`:

```scss
// Add .app-print-content-only class to body element in order to allow printing only the content area
@media print {
  .app-print-content-only {
    .app-wrapper, .app-page, .app-content, .app-container { padding: 0 !important; margin: 0 !important; }
    .app-aside, .app-sidebar, .app-header, .app-footer, .app-toolbar,
    .drawer, .scrolltop, .btn { display: none !important; }
  }
}
```

Without that class the app header, sidebar and toolbar print alongside the
report. `ReportPrintService` owns adding it, invoking the browser print dialog,
and removing it after print or cancel. Report components must not call
`window.print()`, inject `DOCUMENT`, or register their own `afterprint` cleanup:

```ts
private readonly reportPrint = inject(ReportPrintService);

print(): void {
  this.reportPrint.print();
}
```

When a report temporarily loads all filtered rows, pass cleanup as the callback
and wait for rendering before opening print:

```ts
this.printData.set(allRows);
requestAnimationFrame(() =>
  this.reportPrint.print({ afterPrint: () => this.printData.set([]) }),
);
```

Mark every non-report element `no-print` in the template — filters, toolbars,
inline errors. `appReportActions` already supplies `no-print` to its host:

```html
<form class="statement-filters no-print" …>
```

Feature `@media print` rules are still required only for feature-specific fixed
heights and scroll containers, so the whole report flows onto paper instead of
being clipped to one viewport. Universal page reset and action hiding belong to
`appReportPage` and `appReportActions`, not copied feature rules:

```scss
@media print {
  :host,
  .customer-statement-page,
  .customer-statement-panel {
    height: auto;
    min-height: 0;
    padding: 0;
    color: #222;
    background: #fff;
    box-shadow: none;
    overflow: visible;
  }

  .no-print,
  .statement-error {
    display: none !important;
  }

  .statement-ledger-section,
  .statement-ledger-scroll,
  .statement-supporting-scroll,
  .supporting-table-frame {
    height: auto;
    min-height: 0;
    overflow: visible;
  }
}
```

**Check:** print goes through `ReportPrintService` · no feature-level
`window.print()`, `DOCUMENT`, body-class or `afterprint` code · filters, action
toolbar and inline errors hidden · every scroll container switched to
`height: auto` + `overflow: visible` · dark surfaces forced to white with dark
text · totals footer prints with the rows · the printed scope is the full
report, not the visible page.

---

## 22. Loading, empty, error, toast

> **Status: Canonical**

**Page loading** — `LoadingService` drives the global spinner. Always pair
start with `finalize`:

```ts
this.loading.startLoading();
this.service.getList(query)
  .pipe(
    takeUntilDestroyed(this.destroyRef),
    finalize(() => {
      this.searching.set(false);
      this.loading.endLoading();
    }),
  )
  .subscribe({ next: …, error: … });
```

**Local busy flags** for per-action state: `searching`, `saving`, `revising`,
`contactGroupSaving`. Use them to disable the button that is running.

**Success toast — single owner.** The global `errorInterceptor` owns the one
success toast for standard `POST`, `PUT`, `PATCH`, and `DELETE` responses whose result has
`isSuccess: true` and a non-empty `message`. The feature subscription owns its
local state, close event, and refresh only; it must not inject `MessageService`
and add another success toast for the same response. This applies equally to
state-changing actions such as close, void, approve, post, and delete.

A composite Save is different when the user-visible operation is not complete at
the mutation response. If a successful mutation must be followed by required
row/state/detail reloads before the screen can safely represent the committed
result, the success message belongs to the **complete workflow**, not the first
HTTP response. Suppress the mutation interceptor toast with the existing
`X-Skip-Success-Toast` request header and emit exactly one feature success toast
after all required refreshes succeed and loading has ended. Do not use a timer or
network delay to reorder feedback.

`BaseService.addSettingList` exposes the approved convenience option for this
case:

```ts
let saveSuccessMessage: string | null = null;
this.saving.set(true);
this.loading.startLoading();
this.service
  .addSettingList<Result<unknown>>(
    payload,
    { skipSuccessToast: true },
  )
  .pipe(
    switchMap((result) => {
      if (!result.isSuccess) {
        this.showBusinessFailure(result.message);
        return EMPTY;
      }
      saveSuccessMessage = result.message;
      return forkJoin({
        rows: this.service.get<Results<Row>>(),
        state: this.stateService.load(true),
      });
    }),
    finalize(() => {
      this.saving.set(false);
      this.loading.endLoading();
      if (saveSuccessMessage) this.showSaveSuccess(saveSuccessMessage);
    }),
  )
  .subscribe({
    next: ({ rows, state }) => {
      const failed = [rows, state].find((response) => !response.isSuccess);
      if (failed) {
        saveSuccessMessage = null;
        this.showBusinessFailure(failed.message);
        return;
      }
      this.replaceRows(rows.entities ?? []);
    },
    error: (error) => {
      saveSuccessMessage = null;
      this.showTransportFailure(error);
    },
  });
```

If the mutation succeeds but a required refresh fails, clear the pending success
message and do not show success because the current screen cannot yet represent
the committed state reliably.

```ts
next: (result) => {
  if (!result.isSuccess) { this.showError(result.message); return; }
  this.form.markAsPristine();
  this.closed.emit(true);
}
```

**Error toast** — same shape, `severity: 'error'`, longer life:

```ts
private showError(message?: string): void {
  const detail = message?.startsWith('companyPartners.')
    ? this.translate.instant(message)
    : message || this.translate.instant('companyPartners.operationError');
  this.messageService.add({
    key: 'global',
    severity: 'error',
    summary: this.translate.instant('companyPartners.errorTitle'),
    detail,
    life: 5000,
  });
}
```

Handle **both** failure channels. `isSuccess: false` is a business failure and
`error:` is a transport failure — neither may pass silently:

```ts
.subscribe({
  next: (response) => {
    if (!response.isSuccess) { this.showError(response.message); return; }
    …
  },
  error: () => this.showError(),
});
```

`error: () => undefined` is never acceptable. The Company list still has six of
these — see block 24.

**Dialog states** — loading, empty and content are explicit:

```html
@if (agreementsLoading()) {
  <div class="individual-dialog-state">
    <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
    {{ 'Please wait...' | translate }}
  </div>
} @else if (agreements().length === 0) {
  <div class="individual-dialog-state is-empty">
    <i class="bi bi-journal-x" aria-hidden="true"></i>
    <strong>{{ 'companyPartners.noAgreements' | translate }}</strong>
  </div>
} @else {
  … table …
}
```

**Check:** every request has `finalize` releasing loading · composite saves suppress an early interceptor toast and show success only after required refreshes complete · `isSuccess` and
`error` both handled · no silent `undefined` handler · exactly one success
toast owner per mutation · manual toast key is `'global'` when a non-standard
workflow genuinely needs one · dialogs show loading and empty states · entered
data survives a failed save.

---

## 23. Translations

> **Status: Canonical**

Two files are maintained: `i18n/vocabs/en.ts` and `ar.ts`. The other five
(`ch`, `de`, `es`, `fr`, `jp`) are stubs — do not add feature keys to them.

Nested objects, one block per screen area:

```ts
companyPartners: {          // list screen
  title: 'Companies',
  manage: 'Manage Companies',
  addNew: 'Create New Company',
  confirmDeleteTitle: 'Delete Company',
  …
},
companyForm: {              // create/view/edit screen
  createTitle: 'Create New Company',
  viewTitle: 'View Company',
  editTitle: 'Edit Company',
  discardTitle: 'Discard changes?',
  …
},
```

Shared blocks to reuse instead of inventing keys:

| Block | Holds |
|---|---|
| `general.*` | save, cancel, close, delete, edit, add, next, previous, search, actions, success, code, exportExcel |
| `mangeDetails.*` | field labels shared across customer screens: firstName, mobileNo, email, documentType, cardNumber |
| `validationMessages.*` | required, email, expiryAfterIssueDate |
| `sideMenu.*` | navigation entries |

Naming: `<feature>` for the list, `<feature>Form` for the editor. Suffix
conventions — `Title`, `Hint`, `Description`, `Placeholder`, `Error`, plus
`confirmDelete{Title,Subtitle,Question,Warning}`.

Parameters use double braces and are passed as an object:

```ts
invalidFields: '{{count}} invalid fields',
```
```html
{{ 'companyForm.invalidFields' | translate: { count: invalidFields().length } }}
```

**`en` is the fallback language** (`setDefaultLang('en')` in
`translation.service.ts`). Consequences:

- a key missing from **`en`** renders as the raw key for English and for any
  active language that also lacks the key. An active language with its own value
  can still resolve it, but the fallback is broken — this is the severe case;
- a key missing from **`ar`** falls back to English text, which looks
  untranslated but is not broken.

Add every new key to **both** `en.ts` and `ar.ts` in the same edit. Current
state, measured: `en` 7,129 keys, `ar` 5,791; 1,439 keys exist only in `en`,
101 only in `ar`. None of the `ar`-only keys are referenced in code, so no
screen currently renders a raw key.

**Watch the casing, and watch the block.** The two files drift on both. The
credit-card header asked for `mangeDetails.cVV`; `en.ts` had `cVV` but `ar.ts`
had only `cvv`, so Arabic silently fell back to English. Confirm the enclosing
block before adding a key — `cvv` also exists under `statementOfAccount`, and
dropping a key into the wrong block looks correct in a diff but never resolves.

One oddity to know: some keys are literal English sentences, e.g.
`'Please wait...': 'Please wait...'`. It resolves and is used in dialog loading
states, so leave it alone.

**Check:** key added to `en.ts` **and** `ar.ts` · placed in the matching feature
block · reuses `general.*`/`mangeDetails.*`/`validationMessages.*` where one
exists · no literal English in a template · parameters use `{{name}}` and an
object argument.

---

## 24. Colors, icons, buttons

> **Status: Transitional** — three primary blues and two icon libraries in use, backlog 1, 2, 15

### Button roles

| Role | Approved implementation | Used for |
|---|---|---|
| Primary | `app-primary-action-button` | Create, Search, Next, Save, Edit from View |
| Secondary | `individuals-secondary-button`, `individual-secondary-action` | Cancel, Close, Export, Previous |
| Dialog primary | `company-dialog-primary` | Save inside a dialog |
| Dialog secondary | `company-dialog-secondary` | Cancel inside a dialog |
| Row icon | Feature-owned semantic icon button | Edit or another nonstandard child-row action |
| Child row remove | `app-editable-collection-table` | Standard confirmed Remove request in an editable child collection |
| Add row | `app-editable-collection-table` → `app-primary-action-button` | Add/select under a compact child table |

Never leave a raw `btn-primary` / `btn-danger` in a new or refactored feature
template. Use `app-primary-action-button` for solid primary actions. Destructive
actions use their approved confirmation or action pattern; they are not primary
actions.

### Shared primary action — canonical

`shared/components/primary-action-button` is the single owner of solid primary
action markup and styling. Import its standalone component in each direct
consumer:

```ts
import { PrimaryActionButtonComponent } from
  'src/app/modules/shared/components/primary-action-button/primary-action-button.component';

@Component({
  standalone: true,
  imports: [PrimaryActionButtonComponent],
})
```

The component contract is:

| Input/output | Contract |
|---|---|
| `label` | Required, already translated visible label and accessible name |
| `icon` | Bootstrap Icon classes; defaults to Create/Add |
| `type` | `button` by default; use `submit` inside a real form |
| `iconPosition` | `start` by default; use `end` for forward actions such as Next |
| `disabled` | Business-disabled state |
| `loading` | Swaps to the busy icon, sets `aria-busy`, disables execution, and prevents double submission |
| `loadingIcon` | Optional busy-icon override; defaults to `bi bi-arrow-repeat` |
| `pressed` | Click/keyboard action for `type="button"`; form submit buttons normally rely on `(ngSubmit)` |

The shared component consumes `--sigma-primary` and
`--sigma-primary-hover`, keeps the solid glyph white, provides visible focus,
spins the busy icon, and reverses directional arrow glyphs in RTL. Consumers
must not override its internal class or duplicate its SCSS. Keep
`app-editor-dialog` for dialog footer actions because that composite owns its
mode-aware Save/Edit behavior.

### Icon rule

An icon on a **solid** coloured button is always white, and you must target the
`i` element too — Bootstrap Icons rules otherwise beat the inherited colour:

```scss
.company-dialog-primary { color: #fff; }
.company-dialog-primary i { color: #fff; }
```

On a white or transparent surface use the semantic text colour, never forced
white.

### Loading swap

Set `[loading]` on the same shared button; do not conditionally render a second
button or duplicate the icon swap:

```html
<app-primary-action-button
  [label]="'general.save' | translate"
  icon="bi bi-check2-circle"
  [loading]="saving()"
  (pressed)="save()"
/>
```

### Standard icons

| Action | Icon | Action | Icon |
|---|---|---|---|
| Create / Add | `bi bi-plus-lg` | Save | `bi bi-check2-circle` |
| Search | `bi bi-search` | Cancel / Clear | `bi bi-x-lg` |
| Busy | `bi bi-arrow-repeat` | Discard | `bi bi-x-circle` |
| View | `bi bi-eye` | Excel export | `bi bi-file-earmark-excel` |
| Edit | `bi bi-pencil-square` | History | `bi bi-clock-history` |
| Delete | `bi bi-trash3` | Warning | `bi bi-exclamation-triangle` |
| Back | `bi bi-arrow-left` | Next | `bi bi-arrow-right` |
| Step done | `bi bi-check-lg` | Field error | `bi bi-exclamation-circle` |

Decorative icons always get `aria-hidden="true"`; icon-only buttons always get
`aria-label`.

### Tokens

The application primary action color is global. It is declared once in
`src/styles.scss`, using the clearer blue already proven by the Staff feature:

```scss
:root {
  --sigma-primary: #3498db;
  --sigma-primary-hover: #2587c5;
}
```

All features use `var(--sigma-primary)` and
`var(--sigma-primary-hover)` for primary borders, solid primary actions, active
tabs, focus accents, and checkbox/radio accents. Do not introduce
`--<feature>-primary` aliases or repeat the hex values in each module. A
body-appended overlay inherits the global token from `:root`, so it does not
need to redeclare the primary color on its overlay root.

Feature-owned structural and semantic tokens remain local to the feature SCSS,
light then dark:

```scss
--feature-accent: #32b6ad;
--feature-text: #243648;
--feature-muted: #708295;
--feature-border: #dce5ed;
--feature-surface: #fff;
--feature-canvas: #f4f7fa;
```

Replace `feature` with the owning feature prefix, as in block 1. A feature may
add a distinct semantic color only when it represents a real domain role rather
than another version of the shared primary action color.

### Where body-appended overlay styles belong

A `p-dialog`, dropdown panel or calendar with `appendTo="body"` is moved outside
the component's host element. It therefore **cannot** be styled by
component-scoped rules and does **not** inherit `:host` custom properties.
`:host ::ng-deep .my-dialog` will not match it.

Ownership rule:

| Concern | Where it lives |
|---|---|
| Overlay shell: width, radius, header/body/footer chrome | global `src/styles.scss`, scoped by the overlay's unique `styleClass` |
| Overlay dark theme | global `src/styles.scss` under `[data-bs-theme='dark'] .my-dialog` |
| Overlay RTL | global `src/styles.scss` under `[dir='rtl'] .my-dialog` |
| Overlay z-index / stacking | global `src/styles.scss` |
| Content inside the overlay that is still part of your component template | component SCSS, plus the variables redeclared on the overlay root |

`src/styles.scss` already carries the shared body-appended dialog and dropdown
overlay rules. Put new overlay rules beside the matching existing rules rather
than recording volatile selector counts or fighting encapsulation with
`::ng-deep`.
`app-data-table` content remains owned by its shared component and follows
block 6.

Always give the overlay a unique `styleClass` so the global rule cannot leak to
every dialog in the app.

### Dark theme selector inside a component

For an **ordinary component** element, `[data-bs-theme='dark']` written inside
component SCSS will not match, because the attribute sits on `<html>` which is
outside the component's scope. Use `:host-context`:

```scss
:host-context([data-bs-theme='dark']) {
  --feature-text: #e4edf5;
  --feature-surface: #1d2a37;
  --feature-canvas: #16222d;
}
```

Use the bare `[data-bs-theme='dark'] …` form only in **global** `styles.scss`,
where it is the correct selector for body-appended overlays. Feature-owned
direct table rules use `:host-context([data-bs-theme='dark'])`.

**Check:** shared primary component instead of a raw Bootstrap or feature-local
primary class · glyph white on solid · loading disables double execution · both
themes declared · dialog variables declared on the overlay class ·
`aria-hidden` and `aria-label` correct.

---

## 25. RTL and dark theme

> **Status: Canonical**

`TranslationService.checkAndRemoveElement()` owns direction. Selecting `ar`
sets `dir="rtl"` on `<html>` and `<body>` and injects
`assets/css/style.rtl.css`; any other language removes it. Features must not
add their own direction flag.

Write layout with logical properties so both directions work from one rule:

```scss
margin-inline-start: 8px;
padding-inline: 12px;
inset-inline-end: 10px;
text-align: start;
```

`app-primary-action-button` owns RTL flipping for its directional arrows. Flip
only remaining directional arrows, never semantic icons, numbers or text:

```scss
:host-context([dir='rtl']) {
  .feature-secondary-action .bi-arrow-left {
    transform: rotate(180deg);
  }
}
```

Dark theme keys off `data-bs-theme` on `<html>`; redeclare the same tokens:

```scss
:host-context([data-bs-theme='dark']) {
  --feature-text: #e4edf5;
  --feature-muted: #9dafbf;
  --feature-border: #344557;
  --feature-surface: #1d2a37;
  --feature-canvas: #16222d;
}
```

This is component SCSS, so `:host-context` is required. Body-appended overlays
use the global `[data-bs-theme='dark'] .<overlay-style-class>` form from block
24 instead.

The shared `app-data-table` owns table-level dark-theme defaults under its
`:host-context([data-bs-theme='dark'])` boundary. A feature that overrides a
public `--sigma-data-table-*` color variable must override that same variable
for dark theme. The legacy global `table-list` rules are compatibility only and
are not an implementation reference.

**Check:** no hard-coded `left`/`right` in feature layout · only arrows flipped ·
dark tokens declared for host and dialog roots · body-appended overlays checked
in both directions and themes · Arabic text not mirrored.

---

## 26. Permissions and route access

> **Status: Transitional** — authentication only; no authorization mechanism exists, backlog 20

**Transitional.** State of the app, verified 2026-08-06:

- `app-routing.module.ts` guards the whole layout with
  `canActivate: [AuthGuard]`.
- `AuthGuard` (`modules/auth/services/auth.guard.ts`) is **authentication only**:
  it checks `authService.currentUserValue`, calls `getCurrentUser()` once if
  empty, and logs out when there is still no user.
- There is **no** permission service, no permission directive, no role or claim
  check in `auth.service.ts`, and no per-feature route guard.

So today: every signed-in user can reach every routed feature, and the backend
endpoint is the only real authorization boundary.

What this means when you build a screen:

- do not invent a permission API — none exists to call;
- do not hide a button and call it secured; hiding is cosmetic;
- when an action must be restricted, say so explicitly and confirm the backend
  enforces it;
- when row state rather than permission decides availability, use the
  `ActionList` hooks, which do exist:

```ts
{
  title: 'general.delete',
  icon: 'bi bi-trash',
  visible: (row) => row.canDelete === true,
  disabled: (row) => this.deletingId() === row.id,
  action: (row) => this.confirmDelete(row),
}
```

When a permission mechanism is introduced it belongs in `shared`, applied at the
route and at the action, and this block plus block 7 must be updated together.
Tracked in block 30, item 20.

**Check:** no fabricated permission call · restricted actions confirmed as
backend-enforced · `visible`/`disabled` used for row-state rules · no claim that
a hidden control is secure.

---

## 27. Focus and keyboard

> **Status: Canonical**

**Canonical:** the shared confirmation dialog and any `p-dialog`; PrimeNG handles
the trap, you handle the edges.

| Surface | Required behaviour |
|---|---|
| Dialog open | focus moves into the dialog |
| Dialog | Tab cycles inside; it must not reach the page behind |
| Dialog close | focus returns to the control that opened it |
| Escape | closes, and for a dirty editor routes through the discard rule (block 10) |
| Row action menu | Escape and outside click close it; focus returns to the trigger |
| Icon-only button | `aria-label`, always |
| Decorative icon | `aria-hidden="true"`, always |
| Invalid submit | focus the first invalid control, do not only paint it red |
| Step form | `app-step-form` owns ordinary-button navigation and `aria-current`; feature Back/Next remain `type="button"` so Enter cannot skip a step |
| Editor tabs | `app-editor-tabs` owns roving focus, Home/End, and direction-aware arrow keys; feature panels keep matching IDs and labels |

Getting these free is the reason to use `p-dialog` and the shared confirmation
service rather than a hand-rolled backdrop. A plain `<div>` with
`role="dialog"` provides none of them — which is why the hand-rolled Staff
salary-revision modal (`Staff/Staff/components/list/list.component.html`) must
not be used as a model. Block 13 shows the canonical replacement.

Filter forms submit on Enter because they are real `<form>` elements with
`type="submit"` on Search. Keep that; do not intercept Enter.

**Check:** focus enters, traps, returns · Escape defined for every dialog ·
`aria-label` on icon-only controls · first invalid control focused on failed
submit · custom editor tabs use `app-editor-tabs` with matching panel IDs · no
feature-local duplicate tab keyboard handler · no `role="dialog"` hand-rolled
markup in new code.

---

## 28. Request cancellation and stale responses

> **Status: Canonical**

Every subscription is torn down with `takeUntilDestroyed`, which is the app-wide
pattern:

```ts
this.service.getList(query)
  .pipe(
    takeUntilDestroyed(this.destroyRef),
    finalize(() => this.loading.endLoading()),
  )
  .subscribe({ … });
```

`destroyRef` is `inject(DestroyRef)` in newer components and a constructor
parameter (`private destroy$: DestroyRef`) in older ones such as the Company
editor. Either is fine — match the file you are editing.

That handles destroy. It does **not** handle a slower earlier response landing
after a newer one. Two cases to guard:

**Rapid re-search, paging and refresh.** Disabling Search prevents a second Search
click, but it does not prevent a lazy-page or Refresh event from overlapping the
current request. Drive list queries through `switchMap` so the previous HTTP
request is cancelled before the next one starts:

```ts
private readonly listQuery$ = new Subject<CompanyPartnerListQuery>();

ngOnInit(): void {
  this.listQuery$
    .pipe(
      switchMap((query) =>
        defer(() => {
          this.searching.set(true);
          this.loading.startLoading();
          return this.service.getList(query).pipe(
            catchError(() => {
              this.showError('companyPartners.loadError');
              return EMPTY; // keep listQuery$ alive for the next attempt
            }),
            finalize(() => {
              this.searching.set(false);
              this.loading.endLoading();
            }),
          );
        }),
      ),
      takeUntilDestroyed(this.destroyRef),
    )
    .subscribe((response) => this.applyListResponse(response));
}

private requestList(query: CompanyPartnerListQuery): void {
  this.listQuery$.next(query);
}
```

`defer` is important: when a new query arrives, `switchMap` first unsubscribes
the previous request (running its `finalize`), then starts the new loading cycle.
The shared `LoadingService` is currently a plain boolean, not a reference
counter, so unrelated concurrent callers can still hide each other's spinner;
that shared defect is backlog 27.

**Row/dialog detail requests.** Discard a late response by identity as well as
tearing it down on destroy:

```ts
openRevise(item: StaffGridRow): void {
  this.reviseStaff.set(item);
  this.service.getSalaryRevision(item.id)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (response) => {
        // Ignore a response for a row the user has already moved away from.
        if (!this.reviseVisible() || this.reviseStaff()?.id !== item.id) return;
        …
      },
    });
}
```

**Dialog closed mid-flight.** Check the dialog is still open before patching its
form, as above.

Do not introduce NgRx, an application-wide request-sequence service, or a custom
cancellation framework for this. A local trigger stream plus `switchMap`, and an
identity/open-state check for dialogs, are enough.

**Check:** every subscription has `takeUntilDestroyed` · the trigger is disabled
while its request runs · list refresh/paging uses `switchMap` · late dialog
responses discarded by row id or open-state check · `finalize` releases loading
on success, failure and cancellation · no new state framework added.

---

## 29. Verification expectations

> **Status: Canonical**

What a source change can and cannot claim.

| Check | Who runs it | Claimable from source review |
|---|---|---|
| Pattern conformance to this book | author | yes |
| Contract match against the service and model | author | yes |
| Translation keys exist in `en.ts` **and** `ar.ts`, correct block and casing | author | yes, see block 23 |
| Stale imports, dead types, merge markers | author | yes |
| TypeScript compiles | owner | **no** |
| Unit tests pass | owner | **no** |
| Runtime behaviour, network headers, `401` cause | owner | **no** |
| Visual match, light and dark, LTR and RTL | owner | **no** |
| Responsive behaviour at each breakpoint | owner | **no** |
| Backend persistence and authorization | owner | **no** |

State honestly which of these were not performed. Source inspection is not proof
of runtime behaviour, and "it looks right in the diff" is not verification — the
`mangeDetails.cVV` fix in this repository was placed in the wrong translation
block on the first attempt and read correctly in the diff.

Owner acceptance pass for a screen built from this book:

1. Create, view, edit, delete the record.
2. Cancel a dirty form; cancel a clean form; cancel in view mode.
3. Filter, page, change rows-per-page, delete the last row on a page.
4. Export with filters applied; confirm row count and headers.
5. Print, if the screen has a report.
6. Switch to Arabic: check direction, arrows, and that no raw key appears.
7. Switch to dark theme, including every dialog and dropdown overlay.
8. Narrowest supported viewport.
9. Confirm protected requests carry `Authorization: Bearer …` without recording
   the token value.

**Check:** report lists what was and was not verified · no runtime claim from
source alone · owner acceptance steps included in the handoff.

---

## 30. Backlog, by priority

> **Status: Governance** — evidence and remediation order, not code to copy

Ordered by risk. Correctness and security first; appearance last. Item numbers
are stable identifiers, so they are not renumbered when priority changes.

### P1 — security and data correctness

| # | Problem | Evidence |
|---|---|---|
| 20 | No authorization mechanism | `AuthGuard` is authentication only — no roles, claims, permission service or directive. Every signed-in user reaches every routed feature; the backend endpoint is the sole boundary |
| 17 | Two `HttpClient` instances | `AppModule` imports `HttpClientModule` (no interceptors); `LayoutModule` calls `provideHttpClient(withInterceptors([...]))`. A service missing from `LayoutModule.providers` sends requests with no `Authorization` header. Provide the chain once at the root, then drop the ~300-entry providers array and the dead `bootstrapApplication`/`provideHttpClient` imports in `main.ts` |
| 8 | Server-owned fields in the write model | `models/create.ts` `AddBase` carries `SubscriptionId` (typed `boolean`), `IsDeleted`, `IsActive`, plus `createdBy` |
| 19 | Client sends `subscriptionId` | Document rows and the driver draft (`localStorage.getItem('subscriptionId')`) put the tenant in the payload. Fix with item 8 |
| 5 | Date helper shifts the day | `drivers.component.ts` `formatDate` uses `toISOString()`; at UTC+4 a date-only value lands one day early |
| 9 | Export can produce a partial file | `getAllList` stopped on a failed page and returned what it had. Now throws — confirm the caller surfaces the error |

### P2 — contract and type safety

| # | Problem | Evidence |
|---|---|---|
| 7 | Detail model is all `any` | `models/details.ts` — 12 `any` fields, and both `trn` and `tRN` |
| 6 | Untyped write payloads | `companypartner.service.ts` `create(payload: unknown)`, `update(payload: unknown)` |
| 22 | Untyped shared contracts | `ActionList.action/visible/disabled` and the Excel helper take `any`; `Result.id` is `any`; `Results<T> extends Result<any>`; `EnumToArrayPipe` declares string values although numeric enums return numbers. Add generic typed replacements |
| 12 | `getStaff()` builds `"First undefined Last"` | `companypartner.service.ts` concatenates `middleName` with no null check |

### P3 — behaviour and accessibility

| # | Problem | Evidence |
|---|---|---|
| 4 | Six silent failures in the Company list | `loadBranches`, `loadContactGroups`, `getListItems`, `deleteCompany`, `saveContactGroup`, export all use `error: () => undefined` |
| 14 | `CacheService.clearLocal()` exists | Would wipe the auth token and `subscriptionId` if ever called |
| 28 | Enums cached indefinitely in browser storage | Company stores `gender` and `documentType` under unversioned global keys. Old values survive deployments and can collide with another feature; map the small enums in memory instead |
| 27 | Global loading state is a boolean | `LoadingService.startLoading()` writes `true` and any `endLoading()` writes `false`; overlapping requests can hide the spinner while another request is active. Use a reference counter or scoped loading tokens |
| 29 | Uploaded-file cleanup is fire-and-forget | Fleet starts one delete subscription per path, clears tracking immediately and ignores failures. Coordinate cleanup as in block 18 and add server-side expiry for abandoned temporary files |

### P4 — consistency and appearance

| # | Problem | Evidence |
|---|---|---|
| 1 | Three different primary blues | `#3498db` IndividualPartner list, `#2497d4` its details and drivers, `#1478b5` Fleet |
| 15 | Two icon libraries | `Customers/StatementOfAccount` uses Font Awesome (`fas fa-print`, `far fa-file-excel`); everything else uses Bootstrap Icons |
| 10 | 1,439 keys only in `en.ts` | Arabic falls back to English in those places |
| 11 | Nested dialog pager is hand-built | Agreements dialog draws its own chevrons |
| 13 | Dead feature roots still routed | `Companies/Company`, `CompanyContactPerson`, `CompanyDriver` wired in `pages/routing.ts` and `LayoutModule`, no menu entry |

### Resolved

| # | Problem | Resolution |
|---|---|---|
| 24 | Bare `window.print()` | Fixed 2026-08-09. `ReportPrintService` now owns the Metronic body class, print invocation and `afterprint` cleanup; report, list and detail print actions use it instead of calling the browser directly |
| 16 | Reports had no shared shell | Fixed 2026-08-09. `appReportPage` and `appReportActions` now own reusable report-page and action-toolbar presentation; `shared/components/reports` applies them for its consumers, while standalone report routes import them directly |
| 3 | Cross-feature SCSS import | Fixed 2026-08-09. Company owns locally prefixed `companies-*` page/filter styles and consumes the shared data table, primary action, and editor dialog without importing Individual SCSS |
| 21 | Export headers not translated | Fixed 2026-08-09. Company resolves translated export headers and status values at click time for the active language |
| 18 | Child dialogs discarded silently | Fixed 2026-08-09. Company driver now uses controlled `app-editor-dialog`; X, Cancel and scoped Escape all run one dirty-discard decision before the draft is reset |
| 2 | `company-dialog-primary` defined twice, different colours | Fixed 2026-08-09. Company driver no longer owns dialog action styles; it consumes the shared editor-dialog footer and primary tokens |
| 30 | Company child collections rebuilt table chrome | Fixed 2026-08-09. Contact persons, credit cards, documents and drivers now consume `app-editable-collection-table`; custom driver Edit/Delete actions use the shared action projection |
| 31 | Step-form validation summary was feature-owned | Fixed 2026-08-09. Shared `app-form-validation-summary` now owns accessible alert/count/action presentation while Company retains invalid-field discovery, step changes and focus |
| 23 | Stepper announced tabs it did not implement | Fixed 2026-08-08. Shared `app-step-form` now owns ordinary step navigation with `nav`/`ol`, ordinary buttons, visible labels and `aria-current="step"`; Company no longer carries feature-local tab-role stepper markup or styles |
| 9a | `mangeDetails.cVV` missing from `ar.ts` | Fixed 2026-08-06. Was a casing mismatch: `en` used `cVV`, `ar` had only `cvv`. First fix landed in the wrong block (`statementOfAccount`) and read correctly in the diff — see block 29 |
| 25 | Company editor had no discard prompt | Fixed 2026-08-06. `cancel()` now applies block 10 |
| 26 | Driver rows deleted with no confirmation | Fixed 2026-08-06. `deleteDriver()` now applies block 11 |
