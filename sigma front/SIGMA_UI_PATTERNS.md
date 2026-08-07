# Sigma UI Pattern Book — Draft Canonical

| | |
|---|---|
| Status | **Draft canonical.** Binding for new work; open items in block 30 |
| Version | 0.9 |
| Last verified against source | 2026-08-06 |
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
| List, grid, filters, footer | `Sales/Fleet/components/list` | Owns its SCSS, class prefix, and structural tokens; no cross-feature import |
| Step form | `Customers/Companies/CompanyPartner/components/details` | Five real steps, one parent form, validation summary |
| Tabbed modal shell | `Sales/Fleet/components/details` | Clear `p-dialog` shell, header hierarchy, tabs, scroll body, responsive layout and footer |
| Nested child draft | `…/CompanyPartner/components/detalisForm/drivers` | Draft-form isolation and parent commit on Save only; not the modal shell reference |
| Confirmation and discard | `shared/service/confirmation-dialog.service.ts`, `Fleet/Vehicle` `requestClose()` | Single shared dialog for every yes/no |
| Report | `Customers/StatementOfAccount/components/list` | Typed filter, sectioned response, totals, print |

Where a block shows Company markup for a grid concern, it is because Company and
Fleet implement the same structure; **Fleet is the one to copy** because its
styles are locally owned.

## Pattern status

Every block is labelled. Check the label before copying.

| Label | Meaning |
|---|---|
| **Canonical** | Copy this. It is the intended pattern. |
| **Transitional** | Works and is consistent, but a better shared solution is planned in block 30. Match existing screens; do not spread it further than needed. |
| **Legacy — do not copy** | Present in source, kept working, but wrong. Never use as a model. |
| **Governance** | Tracking information, not an implementation pattern. |

Nothing in this book is "copy exactly" without reading its label first.

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
| 5 | [Columns](#5-columns) | Canonical | `components/list/list.component.ts` |
| 6 | [Grid and footer](#6-grid-and-footer) | Canonical | same |
| 7 | [Action button cycle](#7-action-button-cycle) | Transitional | `shared/components/action-button/` |
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
| 12 | [Step form](#12-step-form) | Transitional | `components/details/` |
| 13 | [Modal with tabs](#13-modal-with-tabs) | Canonical composite | `Sales/Fleet/components/details/` + block 10 close lifecycle |
| 14 | [Child collection table](#14-child-collection-table) | Canonical | drivers, contact-persons |
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
| 20 | [Report page](#20-report-page) | Canonical | `Customers/StatementOfAccount/` |
| 21 | [Report print](#21-report-print) | Transitional | same, `list.component.scss` |

**Cross-cutting**

| # | Block | Status | Reference |
|---|---|---|---|
| 22 | [Loading, empty, error, toast](#22-loading-empty-error-toast) | Canonical | list + dialogs |
| 23 | [Translations](#23-translations) | Canonical | `i18n/vocabs/en.ts`, `ar.ts` |
| 24 | [Colors, icons, buttons](#24-colors-icons-buttons) | Transitional | see block |
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
      <button type="button" class="feature-add-button" (click)="openCreate()">
        <i class="bi bi-plus-lg" aria-hidden="true"></i>
        {{ 'companyPartners.addNew' | translate }}
      </button>
    </app-feature-title>
```

**Check:** icon set · title and subtitle translated · Create inside
`app-feature-title` · white glyph on the solid button.

---

## 4. Filters

> **Status: Canonical**

One `<form>`, `[formGroup]`, `(ngSubmit)`. Every control labelled.

```html
    <form class="feature-filters" [formGroup]="filterForm" (ngSubmit)="search()">
      <div class="feature-filter-field">
        <label for="company-branch">{{ 'companyPartners.branch' | translate }}</label>
        <p-dropdown
          inputId="company-branch"
          formControlName="branchId"
          [options]="branchOptions()"
          optionLabel="value"
          optionValue="id"
          [showClear]="true"
          [filter]="true"
          filterBy="value"
          appendTo="body"
          [placeholder]="'companyPartners.allBranches' | translate"
        ></p-dropdown>
      </div>

      <div class="feature-filter-actions">
        <button type="submit" class="feature-primary-button" [disabled]="searching()">
          <i class="bi" [class.bi-search]="!searching()"
             [class.bi-arrow-repeat]="searching()" aria-hidden="true"></i>
          {{ 'general.search' | translate }}
        </button>
      </div>
    </form>
```

Typed form, and build the request by hand so empty values are dropped:

```ts
readonly filterForm = this.fb.nonNullable.group({
  branchId: this.fb.control<number | null>(null),
  search: '',
  agreementStatus: this.fb.control<number | null>(null),
  isInactive: false,
});

private buildFilters(): CompanyPartnerListFilters {
  const value = this.filterForm.getRawValue();
  const filters: CompanyPartnerListFilters = {};
  const search = value.search.trim();
  if (value.branchId !== null) filters.branchId = value.branchId;
  if (search) filters.search = search;
  if (value.agreementStatus !== null) filters.agreementStatus = value.agreementStatus;
  if (value.isInactive) filters.isInactive = true;
  return filters;
}
```

**Check:** `label for` matches `inputId` · Search is `type="submit"` and
disabled while running · changing filters resets to page 1 · search value
trimmed · no extra search/clear button beside a dropdown that already has
`[showClear]` and `[filter]`.

---

## 5. Columns

> **Status: Canonical**

Actions column first, then business columns. `displayName` is always a key.

```ts
private initColumns(): void {
  this.columns.set([
    {
      colName: 'actions',
      displayName: 'general.actions',
      type: ColType.template,
      celTemp: this.actionTemplate,
      isShowSearch: false,
    },
    { colName: 'no',           displayName: 'general.code' },
    { colName: 'displayName',  displayName: 'mangeDetails.companyName' },
    { colName: 'contactGroup', displayName: 'companyPartners.contactGroup' },
    { colName: 'contactNo',    displayName: 'mangeDetails.contactNo' },
    { colName: 'website',      displayName: 'mangeDetails.website' },
    { colName: 'email',        displayName: 'mangeDetails.email' },
  ]);
}
```

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

`ColType` options: `template` (custom cell), `date`, `link`.

**Check:** actions column first · every `displayName` is a key · derived values
in `toGridRow` · no model field that no column or action reads.

---

## 6. Grid and footer

> **Status: Canonical** — follow Fleet: locally owned SCSS and feature-prefixed classes

`table-list` owns the footer. Never hand-build a pager on the main grid.

Using the `<table-list>` tag is not, by itself, a complete implementation.
The canonical list shape has three independently reviewable layers, and all
three must be present:

| Layer | Required evidence |
|---|---|
| Template | Feature-prefixed grid wrapper containing `app-action-button` and exactly one `table-list`; package-owned controls disabled where the feature supplies them |
| TypeScript | `TableListComponent` import, `@ViewChild`, guarded lazy-load subscription, page conversion and `totalRecords` synchronization |
| SCSS | Feature-owned integration of the package table, actions and paginator using the selector inventory below |

A reviewer must report evidence for each layer. Finding the component in the
template must never be used as evidence that its paging or visual integration
is complete.

```html
    <div class="feature-grid">
      <app-action-button
        [moreActions]="moreActions()"
        (SendActionTemplate)="setActionTemplate($event)"
      ></app-action-button>

      <table-list
        [columns]="columns()"
        [list]="data()"
        [hasCreate]="false"
        [hasCustomSearch]="false"
        [hasAllList]="false"
        [hasActiveList]="false"
        [hasInActiveList]="false"
        [hasDeleteList]="false"
        [moreActions]="moreActions()"
      ></table-list>
    </div>
  </div>
</section>
```

`table-list` comes from the `ms-lib` package, so its internals are not editable.
Set the flags off and drive paging yourself through `tableList.dt`:

```ts
@ViewChild(TableListComponent) tableList?: TableListComponent;

ngAfterViewInit(): void {
  queueMicrotask(() => this.configureRemoteTable());
}

private configureRemoteTable(): void {
  const table = this.tableList?.dt;
  if (!table) return;
  table.lazy = true;
  table.lazyLoadOnInit = false;
  this.syncRemoteTable();

  if (this.remoteTableConfigured) return;
  this.remoteTableConfigured = true;
  table.onLazyLoad.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
    const rows = Math.max(1, Number(event.rows ?? this.pageSize()));
    const first = Number(event.first ?? 0);
    const nextPage = Math.floor(first / rows) + 1;
    if (nextPage === this.pageNo() && rows === this.pageSize()) return;
    this.pageNo.set(nextPage);
    this.pageSize.set(rows);
    this.getListItems(undefined, true);
  });
}

private syncRemoteTable(): void {
  const table = this.tableList?.dt;
  if (!table) return;
  table.lazy = true;
  table.totalRecords = this.totalRecords();
  table.rows = this.pageSize();
  table.first = (this.pageNo() - 1) * this.pageSize();
}
```

### Grid styles — own them locally

**Canonical: `Sales/Fleet`.** The list SCSS owns its structural tokens and class
names while consuming the application-wide primary action tokens:

```scss
:host { display: block; }

.fleet-page {
  --fleet-border: #c9d2dc;
}

.fleet-add-button {
  border: 1px solid var(--sigma-primary);
  background: var(--sigma-primary);
}
```

The following is the minimum `table-list` selector inventory. Adapt the
structural values from `Sales/Fleet` under the new feature's own grid prefix;
do not copy the entire Fleet stylesheet or reuse its class names.

| Selector inside the feature grid | Required responsibility |
|---|---|
| `.card` | Remove package card chrome, such as a second shadow, when the feature panel already owns the surface |
| `table-list .p-datatable-header` | Hide the package `Keyboard Search` caption when the feature renders its own search or filter area; do not leave two search interfaces |
| `.p-datatable-wrapper` | Own minimum grid height and horizontal overflow without clipping action menus |
| `.p-datatable-table` | Set the feature-appropriate minimum width from its confirmed columns |
| `.p-datatable-thead > tr > th` | Own compact header sizing, borders, typography and non-wrapping behavior |
| `.p-datatable-tbody > tr > td` | Own compact row sizing, borders, overflow and ellipsis behavior |
| First header/body cell | Keep the actions column narrow, visible and non-wrapping |
| `.action-button-toggle` | Use the global Sigma primary tokens and preserve a white icon on the solid action button |
| `.dropdown-menu` | Provide sufficient stacking and bounded scrolling without clipping |
| `.p-paginator` | Integrate the package-owned footer with the feature panel; never replace it with custom paging markup |

Because these elements are inside the `ms-lib` component, scope the selectors
through the feature boundary with `:host ::ng-deep .feature-grid ...`. This is
an integration boundary for package internals, not permission to add unscoped
global table rules. Shared global dark-theme rules should remain the default;
if a feature-local rule overrides a themed property, add the corresponding
`:host-context([data-bs-theme='dark'])` override. Use logical properties for
RTL.

**Transitional: cross-feature `@use`.** Company instead imports a sibling
feature's stylesheet, which is why its templates carry `individuals-*` class
names:

```scss
@use "../../../../Individual/IndividualPartner/components/list/list.component";
```

It works and it avoids duplication, but it makes one feature's styles depend on
another feature's internals and hides who owns a class. Do not introduce new
cross-feature imports. For a new screen, follow Fleet: local SCSS, local
structural/semantic tokens, shared global primary tokens, and class names
prefixed with your own feature. Shared page, filter, table, button and editor
styles belong in shared tokens or mixins — tracked in block 30, item 3.

Never paste a copy of another feature's stylesheet either; that is worse than
the `@use`.

**Check:** template, TypeScript and SCSS evidence reported separately · footer
from `table-list`, no second pager · no duplicate `Keyboard Search` when the
feature owns search · `totalRecords` from the API total, never `rows.length` ·
page conversion `first / rows + 1` once · `remoteTableConfigured` guard so
`onLazyLoad` subscribes once · package wrapper, table, cells, action control,
dropdown and paginator covered by feature-prefixed selectors · SCSS and
structural tokens are locally owned · primary actions use the global Sigma
tokens and solid-button icons remain white · class names carry the feature's
own prefix · no cross-feature `@use` added.

---

## 7. Action button cycle

> **Status: Transitional** — `ActionList` is untyped (`any`), backlog 22

One `ActionList[]`. The shared component renders the gear menu and hands back
the cell template.

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

setActionTemplate(template: TemplateRef<unknown>): void {
  this.actionTemplate = template;
  this.initColumns();          // re-run so celTemp picks up the template
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

Full cycle for every action:

| Step | Do this |
|---|---|
| 1 Define | translation key, `bi` icon, `visible`/`disabled` when row state matters |
| 2 Click | receive the row object; use `row.id`, never an index |
| 3 Confirm | **destructive or risky** → confirmation dialog (block 9); needs input → form modal (block 13); ordinary Save/Next → no dialog |
| 4 Run once | guard with a `saving`/`deleting` signal so double click cannot fire twice |
| 5 Success | toast via `MessageService` key `'global'`, then refresh keeping the page |
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

**Check:** `setActionTemplate` re-runs `initColumns` · row identified by `id` ·
destructive and risky actions confirm, routine ones do not · busy guard ·
last-page-delete handled.

---

## 8. Export to Excel

> **Status: Canonical** — translate headers; Company literal headers are Legacy

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

**Legacy — do not copy.** The Company list hard-codes English headers, which
contradicts block 23. It still works, so it is left alone, but a new export must
translate its headers:

```ts
// Legacy: literal English keys. Do not reproduce in new code.
private mapExportRows(rows: CompanyPartnerGridRow[]): Array<Record<string, string>> {
  return rows.map((row) => ({
    Code: row.no ?? '',
    Company: row.companyName ?? '',
    Status: row.isInactive ? 'Inactive' : 'Active',
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

> **Status: Transitional** — the stepper claims `role="tablist"` without full tab semantics, backlog 23

Use for a long record with several groups and child collections. Company has 5
steps: Detail, Contact Persons, Billing & Cards, Documents, Drivers.

One parent form in the container; each step is a component taking `[parentForm]`.

```html
<div class="card-header individual-stepper-header">
  <div class="individual-stepper" role="tablist"
       [attr.aria-label]="'companyForm.formSteps' | translate">
    <div class="individual-stepper-track" aria-hidden="true">
      <span [style.width.%]="stepProgress()"></span>
    </div>
    @for (step of FORM_STEPS; track step.key; let index = $index) {
      <button type="button" class="individual-step" role="tab"
        [class.is-active]="currentStepIndex() === index"
        [class.is-complete]="currentStepIndex() > index"
        [attr.aria-selected]="currentStepIndex() === index"
        (click)="goToStep(index)">
        <span class="individual-step-number">
          @if (currentStepIndex() > index) {
            <i class="bi bi-check-lg" aria-hidden="true"></i>
          } @else {
            <i [class]="step.icon" aria-hidden="true"></i>
          }
        </span>
        <span class="individual-step-copy">
          <strong>{{ step.label | translate }}</strong>
          <small>{{ step.description | translate }}</small>
        </span>
      </button>
    }
  </div>
</div>
```

### Stepper semantics — pick one and finish it

The markup above declares `role="tablist"` / `role="tab"` / `aria-selected`, but
it does **not** provide the rest of the tab contract: there is no `role="tabpanel"`
on the step content, no `aria-controls`/`id` pairing, no roving `tabindex`, and no
Arrow/Home/End handling. Announcing tabs without tab behaviour is worse for a
screen-reader or keyboard user than not announcing them, so this is backlog
item 23.

Choose deliberately:

**Option A — real tabs.** Every step button gets `id`, `aria-controls`,
`tabindex="0"` when selected and `-1` otherwise; the content region gets
`role="tabpanel"`, `aria-labelledby` and `tabindex="0"`; Left/Right move
selection, Home/End jump to first/last.

**Option B — step navigation, simpler and usually right.** Drop the tab roles and
describe progress instead. Buttons stay ordinary buttons, so Tab order and Enter
already work:

```html
<nav class="individual-stepper" [attr.aria-label]="'companyForm.formSteps' | translate">
  <ol>
    @for (step of FORM_STEPS; track step.key; let index = $index) {
      <li [attr.aria-current]="currentStepIndex() === index ? 'step' : null">
        <button type="button" (click)="goToStep(index)">
          <span class="visually-hidden">
            {{ 'companyForm.stepProgress' | translate: { current: index + 1, total: FORM_STEPS.length } }}
          </span>
          <strong>{{ step.label | translate }}</strong>
        </button>
      </li>
    }
  </ol>
</nav>
```

Use Option B unless the design genuinely needs tab semantics. Either way, step
state must not be conveyed by colour alone — keep the label text and
`aria-current`.

Validation summary under the stepper, jumping to the bad field:

```html
@if (validationAttempted() && invalidFields().length > 0) {
  <div class="individual-stepper-validation" role="alert" aria-live="polite">
    <span class="individual-validation-count">
      {{ 'companyForm.invalidFields' | translate: { count: invalidFields().length } }}
    </span>
    <div class="individual-validation-fields">
      @for (field of invalidFields(); track field.controlPath) {
        <button type="button" class="individual-validation-field"
                (click)="navigateToInvalidField(field)">
          <i class="bi bi-arrow-down-right-circle" aria-hidden="true"></i>
          {{ field.label }}
        </button>
      }
    </div>
  </div>
}
```

Each invalid field is found by a `data-control-path` attribute on the input, so
the summary can scroll to it across steps:

```html
[attr.data-control-path]="'billingInfo.creditCards.' + i + '.cvv'"
```

Body is one scroll area; footer is fixed with Cancel left, Previous/Next/Save
right. The last step swaps Next for Save:

```html
@if (currentStepIndex() < FORM_STEPS.length - 1) {
  <button type="button" class="individual-primary-action" (click)="next()">
    {{ 'general.next' | translate }}
    <i class="bi bi-arrow-right" aria-hidden="true"></i>
  </button>
} @else if (!isViewMode()) {
  <button type="button" class="individual-primary-action"
          [disabled]="saving()" (click)="save()">
    <i class="bi" [class.bi-check2-circle]="!saving()"
       [class.bi-arrow-repeat]="saving()" aria-hidden="true"></i>
    {{ 'general.save' | translate }}
  </button>
}
```

**Check:** one parent `FormGroup` · steps receive `[parentForm]` · Next
validates its step, Save validates all · Back/Next are `type="button"` · one
scroll region · footer always reachable · Cancel goes through block 10 ·
`data-control-path` on every validated input.

---

## 13. Modal with tabs

> **Status: Canonical composite** — use `Sales/Fleet` for the modal shell and
> tabs, then apply block 10 for controlled dirty-close behavior

Use for Create, Edit, and View editors with real peer sections. The canonical
shell reference is:

```text
Sales/Fleet/components/details/details.component.html
Sales/Fleet/components/details/details.component.scss
```

Inspect `details.component.ts` for mode handling and accessible tab navigation,
but do **not** copy its current `onEditorDialogVisibleChange()`/`cancel()` close
path. A new or refactored editor must combine the Fleet shell with the
controlled-visibility and discard rules in block 10 and later in this block.
Keep the target feature's own class prefix; never import Fleet SCSS.

### Screenshot functional evidence + named modal shell

When the owner supplies screenshots **and** explicitly names an existing Sigma
modal whose style must be reused, split the acceptance criteria instead of
choosing only one reference:

- the screenshots identify functional content: visible fields, labels, logical
  groups, diagrams/images, actions, and the captured state. Classify each item
  under the Master Guide evidence policy; do not infer completeness;
- the owner-named modal controls the shared shell: overlay, width constraints,
  header/title/description, close-button position, approved group presentation,
  field layout, content padding and scrolling, footer, Cancel/Save order,
  button/icon treatment, responsive behaviour, accessibility, RTL and dark
  theme;
- inspect that modal's current HTML and SCSS before editing; never reproduce it
  from memory;
- apply the same shell to Create, Edit and View. Change only the mode-specific
  title, read-only state and available actions;
- keep the target feature's own class prefix and business logic. Do not import
  another feature's SCSS or copy its feature-specific controls and payloads.

The screenshot evidence establishes the Vehicle Type data and logical groups;
the applicable guide block and Sales/Fleet source determine the component and
property arrangement. If required content does not fit, use the approved
responsive and scrolling pattern. Do not infer modal width or breakpoints from
the captured viewport.

The Fleet shell means: `p-dialog` appended to `body`; a full-width flex header
with icon, title, optional description and close control at the logical edge; a
horizontal accessible tablist; one bounded scrolling body; and a footer with
the required-fields hint separated from Cancel/Save actions. Its current width
is `1120px`, with `94vw` and narrow-screen breakpoints. Re-check the source
before copying because the source wins when these values drift.

### Nested child draft variant

The CompanyPartner driver component remains useful only when a tabbed modal
edits a child draft inside a parent form. It does not own the tabbed-modal
shell. The child draft is isolated and the parent collection is changed only
after the child Save succeeds:

```html
<p-dialog
  [modal]="true"
  [(visible)]="visible"
  appendTo="body"
  styleClass="company-driver-dialog"
  [draggable]="false"
  [resizable]="false"
  [closeOnEscape]="true"
  [style]="{ width: '1280px', maxWidth: 'calc(100vw - 24px)',
             maxHeight: 'calc(100dvh - 24px)' }"
  [breakpoints]="{ '1199px': '94vw', '767px': 'calc(100vw - 16px)' }"
  [contentStyle]="{ overflow: 'hidden', padding: '0' }"
  (onHide)="resetDialog()"
>
  <ng-template pTemplate="header"> … icon + title + description … </ng-template>

  @if (driverDraft) {
    <div [formGroup]="driverDraft" class="company-driver-editor">
      <p-tabView styleClass="company-driver-tabs">
        <p-tabPanel>
          <ng-template pTemplate="header">
            <span class="company-driver-tab-label">
              <i class="bi bi-person-lines-fill" aria-hidden="true"></i>
              {{ 'mangeDetails.Detail' | translate }}
            </span>
          </ng-template>
          … field groups …
        </p-tabPanel>
        <p-tabPanel>
          <ng-template pTemplate="header">…Documents…</ng-template>
          <app-documents [parentForm]="driverDraft" arrayName="documents"></app-documents>
        </p-tabPanel>
      </p-tabView>
    </div>
  }

  <ng-template pTemplate="footer">
    <button type="button" class="company-dialog-secondary" (click)="closeDialog()">
      <i class="bi bi-x-lg" aria-hidden="true"></i>{{ 'general.cancel' | translate }}
    </button>
    <button type="button" class="company-dialog-primary" (click)="saveDriver()">
      <i class="bi bi-check2-circle" aria-hidden="true"></i>{{ 'general.save' | translate }}
    </button>
  </ng-template>
</p-dialog>
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

**Single-section variant:** same dialog, drop `p-tabView`, keep the groups. Use
tabs only for real peer groups such as Detail + Documents.

### Closing a dirty tabbed modal — canonical

Neither the Fleet shell's current direct visibility change nor the drivers
component's two-way visibility/onHide reset is the canonical close lifecycle.
Both allow PrimeNG to hide the surface before the feature decides whether a
dirty form may be discarded. The shell reference and close-lifecycle reference
are deliberately separate.

For every editable tabbed dialog, use **controlled visibility**: the dialog never closes
itself, every close attempt goes through one method, and reset happens only after
the close is agreed.

```html
<p-dialog
  [modal]="true"
  [visible]="visible()"
  [closable]="false"
  [closeOnEscape]="false"
  [dismissableMask]="false"
  appendTo="body"
  styleClass="company-driver-dialog"
  [draggable]="false"
  [resizable]="false"
  [style]="{ width: '1280px', maxWidth: 'calc(100vw - 24px)',
             maxHeight: 'calc(100dvh - 24px)' }"
  [breakpoints]="{ '1199px': '94vw', '767px': 'calc(100vw - 16px)' }"
  [contentStyle]="{ overflow: 'hidden', padding: '0' }"
>
  <ng-template pTemplate="header">
    <div class="company-driver-dialog-heading"
         (keydown.escape)="onDialogEscape($event)">
      …icon + title…
      <button type="button" class="company-driver-dialog-close"
              (click)="requestClose()"
              [attr.aria-label]="'general.close' | translate">
        <i class="bi bi-x-lg" aria-hidden="true"></i>
      </button>
    </div>
  </ng-template>

  <div class="company-driver-editor"
       (keydown.escape)="onDialogEscape($event)">
    …tabs and field groups…
  </div>

  <ng-template pTemplate="footer">
    <div class="company-driver-dialog-footer"
         (keydown.escape)="onDialogEscape($event)">
      <button type="button" class="company-dialog-secondary" (click)="requestClose()">
        <i class="bi bi-x-lg" aria-hidden="true"></i>{{ 'general.cancel' | translate }}
      </button>
      <button type="button" class="company-dialog-primary" (click)="saveDriver()">
        <i class="bi bi-check2-circle" aria-hidden="true"></i>{{ 'general.save' | translate }}
      </button>
    </div>
  </ng-template>
</p-dialog>
```

`[closable]="false"` and `[closeOnEscape]="false"` remove PrimeNG's own exits, so
the header X, Cancel and Escape events from inside the dialog all funnel into
`requestClose()`. Bind Escape on the dialog template roots, not on `document`:
the latter also sees Escape from a dropdown or the discard confirmation and can
immediately open a second confirmation.

```ts
readonly visible = signal(false);
readonly closeConfirmationPending = signal(false);

onDialogEscape(event: KeyboardEvent): void {
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

## 14. Child collection table

> **Status: Canonical**

The parent side of block 13: a compact table over a `FormArray`, plus an Add
row button.

```html
<div class="company-editable-collection" [formGroup]="parentForm">
  <div formArrayName="drivers" class="company-table-shell">
    <table class="table company-editable-table company-driver-table">
      <thead>
        <tr>
          <th>{{ 'mangeDetails.firstName' | translate }}</th>
          <th>{{ 'mangeDetails.mobileNo' | translate }}</th>
          <th>{{ 'general.actions' | translate }}</th>
        </tr>
      </thead>
      <tbody>
        @for (driver of drivers.controls; let i = $index; track driver) {
          <tr [formGroupName]="i">
            <td>{{ driver.get('firstName')?.value || '—' }}</td>
            <td>{{ driver.get('mobileNo')?.value || '—' }}</td>
            <td class="company-actions-cell">
              <button type="button" class="company-icon-button"
                      [disabled]="parentForm.disabled" (click)="editDriver(i)"
                      [attr.aria-label]="'general.edit' | translate">
                <i class="bi bi-pencil-square" aria-hidden="true"></i>
              </button>
              <button type="button" class="company-icon-button is-delete"
                      [disabled]="parentForm.disabled" (click)="deleteDriver(i)"
                      [attr.aria-label]="'general.delete' | translate">
                <i class="bi bi-trash3" aria-hidden="true"></i>
              </button>
            </td>
          </tr>
        } @empty {
          <tr>
            <td colspan="3" class="company-empty-row">
              <i class="bi bi-person-vcard" aria-hidden="true"></i>
              {{ 'companyForm.noDrivers' | translate }}
            </td>
          </tr>
        }
      </tbody>
    </table>
  </div>

  <button type="button" class="company-add-row"
          [disabled]="parentForm.disabled" (click)="openDialog()">
    <i class="bi bi-plus-lg" aria-hidden="true"></i>
    {{ 'general.add' | translate }} {{ 'mangeDetails.driver' | translate }}
  </button>
</div>
```

Attach the array in `ngOnInit`, creating it when absent:

```ts
ngOnInit(): void {
  this.drivers = this.parentForm.get('drivers') as FormArray;
  if (!this.drivers) {
    this.drivers = this.fb.array([]);
    this.parentForm.setControl('drivers', this.drivers);
  }
}
```

**Check:** `@empty` state with icon and translated text · `—` for blank cells ·
icon-only buttons have `aria-label` · every button honours
`[disabled]="parentForm.disabled"` · delete confirms (block 11) · `track` on the
control, not the index.

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
  <button type="button" class="individual-primary-action" (click)="openEdit()">
    <i class="bi bi-pencil-square" aria-hidden="true"></i>
    {{ 'general.edit' | translate }}
  </button>
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

**Check:** lookup failures show a message, not silence · `optionLabel`/
`optionValue` match the source shape · `appendTo="body"` on every dropdown ·
`[showClear]` and `[filter]` instead of companion buttons · enum options mapped
once in memory · no unversioned enum data stored in browser storage.

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

**Check:** `appendTo="body"` and `panelStyleClass="sigma-datepicker-panel"` ·
no `toISOString()` on a date-only value · `[maxDate]`/`[minDate]` where the
business requires it · issue/expiry and start/end ordering validated.

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

> **Status: Canonical**

A report is **not** a list. There is no `table-list`, no row actions, no server
paging. The user picks filters, presses Search, and gets one document with
sections and totals. Reference:
`Customers/StatementOfAccount/components/list/`.

Sibling reports that follow the same shape: `Customers/BalancesSummary`,
`Customers/ReceivableAgeAnalysis`, `Suppliers/SupplierStatementOfAccount`,
`Staff/StaffStatementOfAccount`.

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

    <div class="statement-actions">
      <button type="button" (click)="print()" [disabled]="!report() || loadingReport()">…</button>
      <button type="button" (click)="exportToExcel()"
              [disabled]="!ledgerLines().length || loadingReport()">…</button>
      <button type="button" (click)="refresh()" [disabled]="loadingReport()">…</button>
    </div>
  </div>
</form>
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
together · dates serialized from local parts.

---

## 21. Report print

> **Status: Transitional** — no shared print utility; every report repeats its own block, backlog 16

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
report. So add it, print, then remove it:

```ts
print(): void {
  const body = this.document.body;
  body.classList.add('app-print-content-only');
  // afterprint fires on cancel as well as on completion, so cleanup is reliable.
  const cleanup = () => {
    body.classList.remove('app-print-content-only');
    window.removeEventListener('afterprint', cleanup);
  };
  window.addEventListener('afterprint', cleanup);
  window.print();
}
```

Inject the document rather than touching the global:

```ts
private readonly document = inject(DOCUMENT);
```

The existing report screens call bare `window.print()`, so they rely on their own
`@media print` block to hide their own chrome and still print the app shell. Use
the version above for new screens; consolidating the rest is backlog item 16.

Mark every non-report element `no-print` in the template — filters, toolbars,
inline errors:

```html
<form class="statement-filters no-print" …>
```

Then in `@media print`, release the fixed heights and scroll containers so the
whole report flows onto paper instead of being clipped to one viewport:

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

**Check:** filters, action toolbar and inline errors hidden · every scroll
container switched to `height: auto` + `overflow: visible` · dark surfaces
forced to white with dark text · totals footer prints with the rows · the
printed scope is the full report, not the visible page.

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

**Success toast** — `MessageService`, always key `'global'`:

```ts
private showSuccess(detailKey: string): void {
  this.messageService.add({
    key: 'global',
    severity: 'success',
    summary: this.translate.instant('general.success'),
    detail: this.translate.instant(detailKey),
    life: 3500,
  });
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

**Check:** every request has `finalize` releasing loading · `isSuccess` and
`error` both handled · no silent `undefined` handler · toast key is `'global'` ·
dialogs show loading and empty states · entered data survives a failed save.

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

| Role | Class in Company | Used for |
|---|---|---|
| Primary | `individuals-add-button`, `individuals-primary-button`, `individual-primary-action` | Create, Search, Next, Save |
| Secondary | `individuals-secondary-button`, `individual-secondary-action` | Cancel, Close, Export, Previous |
| Dialog primary | `company-dialog-primary` | Save inside a dialog |
| Dialog secondary | `company-dialog-secondary` | Cancel inside a dialog |
| Row icon | `company-icon-button`, `.is-delete` | Edit/Delete in a child table |
| Add row | `company-add-row` | Add under a child table |

Never leave a raw `btn-primary` / `btn-danger` in a feature template.

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

Same button, icon swaps:

```html
<i class="bi" [class.bi-check2-circle]="!saving()"
   [class.bi-arrow-repeat]="saving()" aria-hidden="true"></i>
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

`src/styles.scss` already carries this load: 98 `.p-dialog` rules, 29
`.p-dropdown` rules and 151 `[data-bs-theme='dark']` rules, including the shared
`[data-bs-theme='dark'] table-list` grid theme. Put new overlay rules there
beside them rather than fighting encapsulation with `::ng-deep`.

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
where it is the correct selector — as the existing overlay and `table-list`
rules do.

**Check:** role class not a raw Bootstrap class · glyph white on solid · both
themes declared · dialog variables declared on the overlay class · `aria-hidden`
and `aria-label` correct.

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

Flip only directional arrows, never semantic icons, numbers or text:

```scss
:host-context([dir='rtl']) {
  .feature-primary-action .bi-arrow-right,
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

Shared dark rules for every grid live in `src/styles.scss` under
`[data-bs-theme='dark'] table-list`, so a new list inherits them.

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
| Step form | Back/Next are `type="button"` so Enter cannot skip a step |

Getting these free is the reason to use `p-dialog` and the shared confirmation
service rather than a hand-rolled backdrop. A plain `<div>` with
`role="dialog"` provides none of them — which is why the hand-rolled Staff
salary-revision modal (`Staff/Staff/components/list/list.component.html`) must
not be used as a model. Block 13 shows the canonical replacement.

Filter forms submit on Enter because they are real `<form>` elements with
`type="submit"` on Search. Keep that; do not intercept Enter.

**Check:** focus enters, traps, returns · Escape defined for every dialog ·
`aria-label` on icon-only controls · first invalid control focused on failed
submit · no `role="dialog"` hand-rolled markup in new code.

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
| 18 | Child dialogs discard silently | `drivers.component.ts` closes on Escape/X and `(onHide)` clears the draft, losing a half-filled driver. Apply the block 13 canonical close |
| 23 | Stepper announces tabs it does not implement | `role="tablist"`/`role="tab"` with no `tabpanel`, `aria-controls`, roving `tabindex` or arrow keys. Pick Option A or B in block 12 |
| 14 | `CacheService.clearLocal()` exists | Would wipe the auth token and `subscriptionId` if ever called |
| 28 | Enums cached indefinitely in browser storage | Company stores `gender` and `documentType` under unversioned global keys. Old values survive deployments and can collide with another feature; map the small enums in memory instead |
| 24 | Bare `window.print()` | Report screens do not add `app-print-content-only`, so the app header, sidebar and toolbar print with the report |
| 27 | Global loading state is a boolean | `LoadingService.startLoading()` writes `true` and any `endLoading()` writes `false`; overlapping requests can hide the spinner while another request is active. Use a reference counter or scoped loading tokens |
| 29 | Uploaded-file cleanup is fire-and-forget | Fleet starts one delete subscription per path, clears tracking immediately and ignores failures. Coordinate cleanup as in block 18 and add server-side expiry for abandoned temporary files |

### P4 — consistency and appearance

| # | Problem | Evidence |
|---|---|---|
| 1 | Three different primary blues | `#3498db` IndividualPartner list, `#2497d4` its details and drivers, `#1478b5` Fleet |
| 2 | `company-dialog-primary` defined twice, different colours | `Sales/Fleet/.../details.component.scss` `#1478b5` vs `drivers.component.scss` `#2497d4` |
| 15 | Two icon libraries | `Customers/StatementOfAccount` uses Font Awesome (`fas fa-print`, `far fa-file-excel`); everything else uses Bootstrap Icons |
| 3 | Cross-feature SCSS import | Company `@use`s IndividualPartner's stylesheet and inherits `individuals-*` names. Move shared page/filter/table/button/editor styles into shared tokens and mixins |
| 16 | Reports have no shared shell | 20 features each carry their own `@media print` block; five reports repeat the filter bar and totals footer |
| 21 | Export headers not translated | Company list hard-codes `Code`, `Company`, `Status`; `StatementOfAccount` translates its headers |
| 10 | 1,439 keys only in `en.ts` | Arabic falls back to English in those places |
| 11 | Nested dialog pager is hand-built | Agreements dialog draws its own chevrons |
| 13 | Dead feature roots still routed | `Companies/Company`, `CompanyContactPerson`, `CompanyDriver` wired in `pages/routing.ts` and `LayoutModule`, no menu entry |

### Resolved

| # | Problem | Resolution |
|---|---|---|
| 9a | `mangeDetails.cVV` missing from `ar.ts` | Fixed 2026-08-06. Was a casing mismatch: `en` used `cVV`, `ar` had only `cvv`. First fix landed in the wrong block (`statementOfAccount`) and read correctly in the diff — see block 29 |
| 25 | Company editor had no discard prompt | Fixed 2026-08-06. `cancel()` now applies block 10 |
| 26 | Driver rows deleted with no confirmation | Fixed 2026-08-06. `deleteDriver()` now applies block 11 |
