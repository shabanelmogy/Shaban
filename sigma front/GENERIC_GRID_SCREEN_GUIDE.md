# Generic Angular Grid Screen Guide

This guide describes a reusable pattern for building or refactoring any Angular CRUD screen that contains:

- a page heading and Add button;
- a searchable grid/table;
- a row action dropdown;
- Add, View, and Edit dialogs;
- a reactive form arranged with CSS Grid;
- typed service and API models;
- predictable refresh and pagination behavior.

The examples use neutral names such as `Entity`, `EntityService`, and `feature-name`. Replace them with the feature's real names.

The pattern is suitable for Angular standalone components using the project's shared `table-list`, `action-button`, `buttons`, translation, and result-wrapper components.

For a full-page Add/View/Edit workflow with a fixed header, clickable steps,
internal scrolling, nested editable collections, live validation navigation,
uploads, and date rules, also follow
[`GENERIC_STEP_FORM_GUIDE.md`](./GENERIC_STEP_FORM_GUIDE.md).

## 1. Recommended feature structure

```text
feature-name/
├── components/
│   ├── list/
│   │   ├── list.component.ts       # grid state and dialog state
│   │   ├── list.component.html     # page, table, dialog
│   │   ├── list.component.scss     # grid/table/action-menu styles
│   │   └── list.component.spec.ts
│   └── details/
│       ├── details.component.ts    # form, load, save, validation
│       ├── details.component.html  # modal form and buttons
│       ├── details.component.scss  # CSS Grid form layout
│       └── details.component.spec.ts
├── models/
│   ├── list.ts                     # grid response and query
│   ├── details.ts                  # view/edit response
│   ├── create.ts                   # create/update request DTOs
│   └── search.ts                   # optional autocomplete DTOs
├── services/
│   └── entity.service.ts           # typed HTTP operations
├── feature.routes.ts
└── docs/
    └── GRID_SCREEN_GUIDE.md
```

Keep list and details responsibilities separate:

| Component | Owns |
|---|---|
| List | Rows, columns, filters, row actions, dialog state, refresh, page restoration |
| Details | Form, create/view/edit mode, loading, validation, search, POST/PUT |
| Service | URLs, HTTP parameters, request/response types |
| Models | API contracts; do not use one entity model for every operation |

The details component must notify the list through outputs. It should not mutate the list's array or know how the table paginates.

## 2. Page and grid composition

The list page should have one clear container for the heading and one clear container for the grid:

```html
<section class="feature-page">
  <div class="feature-heading">
    <div>
      <h1>{{ 'feature.title' | translate }}</h1>
      <span>{{ 'feature.manage' | translate }}</span>
    </div>

    <button type="button" class="add-entity" (click)="goCreate()">
      <i class="bi bi-plus-lg"></i>
      {{ 'feature.addNew' | translate }}
    </button>
  </div>

  <div class="feature-table-panel">
    <app-action-button
      [moreActions]="moreActions()"
      (SendActionTemplate)="setActionTemplate($event)">
    </app-action-button>

    <table-list
      #entityTable
      [columns]="columns()"
      [list]="data()"
      [hasCreate]="false"
      [hasCustomSearch]="false"
      [hasDeleteList]="false">
    </table-list>
  </div>
</section>
```

Use the shared action template as a template column:

```typescript
this.columns.set([
  {
    colName: 'actions',
    displayName: 'general.actions',
    type: ColType.template,
    celTemp: this.actionTemplate,
    isShowSearch: false,
  },
  { colName: 'displayName', displayName: 'feature.displayName' },
  { colName: 'description', displayName: 'feature.description' },
]);
```

Define only the actions that the screen is allowed to expose:

### View action and plain data columns

For grids that support viewing, render the entity Name and other data columns as plain text. Do not configure Name as `ColType.link` and do not assign a details route to that column. Expose **View Details** as an explicit item in the Actions dropdown instead, alongside Edit and any other permitted actions.

View Details must open the shared details modal in `view` mode. Load the selected record, disable all form controls, hide Save/Update/Delete, and show only a translated Close button. Edit remains a separate action and opens the same modal in editable mode.

```typescript
this.moreActions.set([
  {
    title: 'general.viewDetails',
    icon: 'bi bi-eye',
    action: item => this.openView(item),
  },
  {
    title: 'general.edit',
    icon: 'bi bi-pencil-square',
    action: item => this.openEdit(item),
  },
]);
```

Do not add Delete, Activate, or other actions just because the backend supports them. Add an action only when the product behavior and confirmation flow are defined.

### Variable and dependent actions

The action dropdown must not assume that every grid has exactly two actions. Some grids may have View, Edit, Delete, Activate, Deactivate, Duplicate, Export, History, Assign, or other actions. The action list should be data-driven:

```typescript
export interface GridAction<T> {
  key: string;
  title: string;
  icon?: string;
  order?: number;
  visible?: (row: T, context: GridActionContext<T>) => boolean;
  disabled?: (row: T, context: GridActionContext<T>) => boolean;
  execute: (row: T, context: GridActionContext<T>) => void;
}

export interface GridActionContext<T> {
  row: T;
  permissions: ReadonlySet<string>;
  busyAction: string | null;
  selectedRows: readonly T[];
  results: Readonly<Record<string, unknown>>;
}
```

Use `visible` when an action should not appear. Use `disabled` when the user should see the action but cannot run it yet. Examples:

```typescript
const actions: GridAction<EntityListDTO>[] = [
  {
    key: 'view',
    title: 'general.viewDetails',
    icon: 'bi bi-eye',
    execute: row => this.openView(row),
  },
  {
    key: 'edit',
    title: 'general.edit',
    icon: 'bi bi-pencil-square',
    visible: (row, context) =>
      row.status !== 'archived' && context.permissions.has('entity.edit'),
    execute: row => this.openEdit(row),
  },
  {
    key: 'activate',
    title: 'general.activate',
    icon: 'bi bi-check-circle',
    visible: row => row.isActive === false,
    disabled: (_row, context) => context.busyAction !== null,
    execute: row => this.activate(row),
  },
  {
    key: 'deactivate',
    title: 'general.deactivate',
    icon: 'bi bi-slash-circle',
    visible: row => row.isActive === true,
    disabled: (_row, context) => context.busyAction !== null,
    execute: row => this.deactivate(row),
  },
];
```

Actions may depend on:

- row data, such as status, active state, owner, or workflow stage;
- permissions, roles, or feature flags;
- the current request state, such as an action already running;
- another action's result, such as showing Approve only after Submit succeeds;
- selection state, when the grid supports bulk selection.

Do not encode these rules only in the HTML. Keep the rules in typed action predicates so they can also be checked when the action is executed.

### Shared action-button integration

The basic shared `ActionList` model only contains `title`, `icon`, and `action`. That is enough when every row has the same actions. For conditional actions, use one of these approaches:

1. Extend the shared action component to accept `GridAction<T>[]` and evaluate `visible`/`disabled` for the current row.
2. Keep the shared component unchanged and create a feature-level action template that calls `getRowActions(row)`.
3. Convert conditional actions to a simple `ActionList[]` per row before passing them to the shared component.

The preferred long-term API is a row-aware action provider:

```typescript
getRowActions(row: EntityListDTO): GridAction<EntityListDTO>[] {
  const context = this.getActionContext(row);

  return this.actions()
    .filter(action => action.visible?.(row, context) ?? true)
    .sort((left, right) => (left.order ?? 0) - (right.order ?? 0));
}
```

The shared action template must call the original row action directly:

```html
@for (action of getRowActions(row); track action.key) {
  <button
    type="button"
    class="dropdown-item"
    [disabled]="action.disabled?.(row, getActionContext(row)) ?? false"
    (click)="runAction(action, row)">
    <i [class]="action.icon"></i>
    {{ action.title | translate }}
  </button>
}
```

For a long menu, constrain the shared Bootstrap menu rather than hiding items:

```scss
.dropdown-menu {
  max-height: min(70vh, 420px);
  overflow-y: auto;
}
```

### Dependent action execution

When one action changes the availability of another action, update the source state and recompute the action list after success:

```typescript
private readonly actionState = signal<Record<string, unknown>>({});
busyAction = signal<string | null>(null);

runAction(action: GridAction<EntityListDTO>, row: EntityListDTO): void {
  const context = this.getActionContext(row);

  // Re-check because the row or permission state may be stale in the open menu.
  if (action.visible && !action.visible(row, context)) return;
  if (action.disabled?.(row, context)) return;

  this.busyAction.set(action.key);
  action.execute(row, context);
}

onActionSuccess(actionKey: string, result: unknown): void {
  this.actionState.update(state => ({ ...state, [actionKey]: result }));
  this.busyAction.set(null);
  this.refreshGrid();
}
```

For a dependency such as `Approve` depending on `Submit`, use an explicit state rule:

```typescript
visible: (_row, context) => context.results['submit'] === 'success'
```

Prefer refreshing the row from the server after a state-changing action. That prevents the menu from using stale status, permissions, or workflow data. If several actions are mutually exclusive, express the rule once in their predicates instead of hiding buttons through unrelated template conditions.

Do not silently trigger a dependent action from another action unless the business workflow explicitly requires it. If an action needs a confirmation, dialog, or API response before the next action becomes available, model that sequence as state and show the user the current status.

### Unified visual standard

Every grid screen should follow the same visual contract unless a documented product requirement requires a variation:

1. Light gray page canvas: `#f1f3f7`.
2. Page header outside the white card: title on the left, optional management subtitle beside it, Add button on the right.
3. White grid card with a subtle shadow and consistent horizontal padding.
4. Simple grids use the shared grid's compact `Keyboard Search` input in the table header, with the magnifier on the left. Filter-heavy grids with dedicated multi-field filters do not render a second table-header search.
5. Gray table header with dark text and sortable indicators.
6. Compact alternating row backgrounds with readable text and vertical alignment.
7. Blue Actions button in the first column, with a dropdown for row actions.
8. Paginator below the rows, aligned consistently with the application direction.
9. No duplicate title from the global toolbar.
10. No unrelated Create, Delete, status, filter, or extra input controls unless the screen explicitly needs them.

The Location screen is the reference implementation for these colors, spacing, table density, action-button treatment, and paginator placement.

### Search choice for filter-heavy grids

Use one search experience per grid:

- **Simple grid:** keep the shared table-list `Keyboard Search` input in the table header.
- **Filter-heavy grid:** when the screen already exposes multiple dedicated filters (for example, quotation number, customer, date range, and approval status), remove the redundant table-header `Keyboard Search` input. The dedicated filter bar is the grid's search interface.

The shared `table-list` component currently renders its global search caption even when `[hasCustomSearch]="false"`. For a filter-heavy screen, keep the feature's dedicated filters, set `[hasCustomSearch]="false"`, omit `gridSearchClear`, and hide the caption with a feature-scoped selector:

```scss
:host ::ng-deep .feature-table-panel table-list .p-datatable-header {
  display: none !important;
}
```

Do not hide or change the table header globally. This rule is only for the feature that owns the multi-field search form.

## 3. List component state

Use signals for local UI state and keep the selected row id separate from the row object:

```typescript
data = signal<EntityListDTO[]>([]);
columns = signal<ListCol[]>([]);
actions = signal<GridAction<EntityListDTO>[]>([]);
visible = signal(false);
modalMode = signal<'create' | 'view' | 'edit'>('create');
selectedEntityId = signal<string | null>(null);
private lastListFilter: unknown;
```

If the shared action component still accepts only `ActionList[]`, keep a separate adapter signal named `moreActions`. For row-dependent menus, prefer the typed `GridAction<T>[]` model and a row-aware action template.

The list component should expose these operations:

```typescript
goCreate(): void {
  this.modalMode.set('create');
  this.selectedEntityId.set(null);
  this.visible.set(true);
}

openView(item: EntityListDTO): void {
  this.modalMode.set('view');
  this.selectedEntityId.set(item.id == null ? null : String(item.id));
  this.visible.set(true);
}

openEdit(item: EntityListDTO): void {
  this.modalMode.set('edit');
  this.selectedEntityId.set(item.id == null ? null : String(item.id));
  this.visible.set(true);
}

closeDialog(): void {
  this.visible.set(false);
}
```

## 4. One dialog, three modes

Use one dialog and one details component for Add, View, and Edit:

The grid's **Add/New** button must open this modal directly; it must not navigate to a separate create page. Do not register a `create` route for the normal grid flow. After a successful create, close the modal, reload the grid, and navigate to the last page so the newly added row is visible. Keep a standalone create route only when an explicitly documented deep-link requirement exists.

The row **Edit** action must open the same details component in Edit modal mode instead of navigating to a separate edit page. Pass the selected record id into the modal, load the record, enable the editable fields, and use the Save button to send PUT. After success, close the modal, reload the grid, and restore the page that was active before Edit.

```html
<p-dialog
  [header]="dialogTitle()"
  [modal]="true"
  appendTo="body"
  [autoZIndex]="true"
  [baseZIndex]="2000"
  [visible]="visible()"
  (visibleChange)="visible.set($event)">

  @if (visible()) {
    <app-entity-details
      [embedded]="true"
      [embeddedMode]="modalMode()"
      [recordId]="selectedEntityId()"
      (changed)="onEntityChanged($event)"
      (closed)="closeDialog()">
    </app-entity-details>
  }
</p-dialog>
```

The `@if` is intentional. Recreating the details component when the dialog opens prevents stale form values from the previous row.

Mode behavior:

| User action | Mode | Id | Form |
|---|---|---:|---|
| Add | `create` | `null` | Empty and enabled |
| View | `view` | Selected row id | Loaded and disabled |
| Edit | `edit` | Selected row id | Loaded and enabled |

The details component should react to `recordId` and `embeddedMode` changes in `ngOnChanges`, especially if the dialog remains mounted in another screen.

## 5. CSS Grid form layout

Use a stable, named grid instead of Bootstrap offsets or absolute coordinates:

```html
<div class="entity-modal-fields">
  <div class="entity-search-field">
    <!-- optional autocomplete/search field -->
  </div>

  <div class="entity-primary-field">
    <!-- first normal field -->
  </div>

  <div class="entity-secondary-field">
    <!-- second normal field -->
  </div>

  <div class="entity-wide-field">
    <!-- textarea or other full-width field -->
  </div>
</div>
```

```scss
.entity-modal-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 30px;
  row-gap: 0;
  padding-top: 25px;
}

.entity-search-field {
  grid-column: 1 / -1;
  grid-row: 1;
}

.entity-primary-field {
  grid-column: 1;
  grid-row: 2;
}

.entity-secondary-field {
  grid-column: 2;
  grid-row: 2;
}

.entity-wide-field {
  grid-column: 1 / -1;
  grid-row: 3;
}
```

Desktop layout:

```text
┌──────────────────────────────────────────┐
│ Optional search/autocomplete             │ row 1
├──────────────────────┬───────────────────┤
│ Primary field         │ Secondary field   │ row 2
├──────────────────────┴───────────────────┤
│ Wide field / details                      │ row 3
└──────────────────────────────────────────┘
```

The search field must be the only full-width item in row 1. Do not assign `grid-row: 1` to another field in a mode-specific selector; that creates an overlap.

For mobile:

```scss
@media (max-width: 650px) {
  .entity-modal-fields {
    display: block;
  }
}
```

When a field is full-width, prefer `grid-column: 1 / -1`. Avoid `position: absolute` for form fields because labels, validation messages, translations, and long values change the required height.

## 6. Styling system

The screen should have a small, predictable visual system. Keep feature styles in the feature component stylesheet and use shared styles only for genuinely shared controls.

### Style boundaries

- Prefix feature classes with the feature name, such as `.feature-page`, `.feature-table-panel`, and `.feature-save-button`.
- Keep page, grid, form, and modal styles in their owning component stylesheet.
- Use `:host` for the component root so the feature can be embedded safely.
- Use `:host ::ng-deep` only when overriding third-party table or dialog markup that cannot be styled through an input or global theme.
- Scope every deep selector under the feature panel or dialog class. Never change every `.p-datatable` or `.dropdown-menu` globally from one feature.
- Use `!important` only for third-party rules that win through specificity, and document why it is needed.
- Do not use inline styles for normal layout. Use classes and CSS variables.

### Design tokens

Define feature-level tokens once and consume them throughout the stylesheet:

```scss
.feature-page {
  --feature-page-bg: #f1f3f7;
  --feature-panel-bg: #fff;
  --feature-border: #d7dade;
  --feature-muted: #71859a;
  --feature-text: #4e5963;
  --feature-primary: #3498db;
  --feature-primary-hover: #2587c5;
  --feature-focus: #78b9dd;
  --feature-disabled-bg: #e4e8eb;
  --feature-disabled-text: #9aa3aa;
  --feature-radius: 2px;
  --feature-shadow: 0 2px 5px rgb(0 0 0 / 8%);
}
```

If the application already has global design tokens, consume those instead of defining duplicate colors. The important rule is consistency: one primary color, one focus color, one border color, and one disabled state.

### Dark theme is a complete screen state

A grid screen that supports theme switching must define a complete dark-mode surface hierarchy. Do not change only the browser canvas or shell while leaving the feature page, white card, filters, table, paginator, or action menu in light colors.

The reusable `table-list` primitive must own the global dark styles for its card, built-in search, table, paginator, and row action dropdown. Define these once in the application stylesheet under `[data-bs-theme='dark'] table-list`; do not copy the same table-theme block into every feature stylesheet. This makes theme changes apply to all shared grids immediately.

The shared global contract must also theme both containers outside the table:

1. the feature page shell that owns the title and Add button;
2. the panel/card that directly owns `table-list`.

Existing grid screens can be covered with a guarded relational selector:

```scss
[data-bs-theme='dark'] :where(section, main, div):has(> table-list) {
  border-color: #344758;
  color: #e4edf5;
  background: #19232d;
}

[data-bs-theme='dark'] :where(section, main, div)[class*='-page']:has(table-list) {
  color: #e4edf5;
  background: #111820;
}
```

The `:has(table-list)` guard is mandatory. Do not apply dark backgrounds to every class containing `page` or `panel`, because that would change unrelated forms and dashboards. New reusable grid shells may additionally expose stable shared classes such as `.grid-screen` and `.grid-panel`, but they must keep the same global theme behavior.

```scss
[data-bs-theme='dark'] table-list .p-datatable,
[data-bs-theme='dark'] table-list .p-datatable-wrapper {
  color: #e4edf5;
  background: #19232d;
}

[data-bs-theme='dark'] table-list .p-datatable-thead > tr > th {
  border-color: #3b4d5d;
  color: #d7e2eb;
  background: #243441;
}

[data-bs-theme='dark'] table-list .p-datatable-tbody > tr {
  color: #dce6ee;
  background: #1d2a37;
}
```

Feature styles still own custom filter controls and feature-specific dialogs. Override their tokens with `:host-context([data-bs-theme='dark'])`. Keep those selectors feature-scoped because they are not part of the shared grid primitive. A feature may define layout, padding, and height for its page shell/panel, but must not override the global dark surfaces with fixed light colors.

If legacy feature selectors with fixed light colors override the shared dark theme, the global `table-list` dark rules may use `!important` temporarily so the active theme always wins. Document that reason and remove the legacy fixed colors as those screens are refactored.

Dark-mode verification:

- [ ] The page canvas and feature panel use related dark surfaces with a visible boundary.
- [ ] The shell outside the table and the direct `table-list` panel/card are not white.
- [ ] Titles, subtitles, labels, values, placeholders, and disabled text remain readable.
- [ ] Inputs, selects, dropdown triggers, focus rings, and checkbox states are themed.
- [ ] Table header, odd/even rows, hover state, empty area, and grid borders are themed.
- [ ] Paginator, page-size selector, action dropdown, modal header, and modal body are themed.
- [ ] Primary action icons stay white and secondary action icons have sufficient contrast.
- [ ] No isolated white or light-gray block remains after switching to dark mode.
- [ ] Switching light to dark and back updates the screen immediately without a refresh.

### Page shell and heading

```scss
:host {
  display: block;
}

.feature-page {
  box-sizing: border-box;
  min-height: 100%;
  padding: 20px 14px 12px;
  color: var(--feature-text);
  background: var(--feature-page-bg);
}

.feature-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 35px;
  margin-bottom: 8px;
}

.feature-heading h1 {
  margin: 0;
  color: #5d6c79;
  font-size: 23px;
  font-weight: 400;
}

.feature-heading span {
  margin-inline-start: 5px;
  color: #8b9aa8;
  font-size: 13px;
}
```

The heading should not depend on table markup. It remains stable when the grid is loading, empty, or hidden by a permission rule.

### Title ownership and page height

Use one title owner. The unified grid standard places the feature title and Add button outside the white grid card, above it, matching the reference screen:

```html
<section class="feature-page">
  <div class="feature-heading">
    <h1>{{ 'feature.title' | translate }}</h1>
    <button class="feature-add-button">{{ 'feature.addNew' | translate }}</button>
  </div>

  <div class="feature-table-panel">
    <!-- Built-in table-header Search, then the grid and paginator -->
  </div>
</section>
```

Do not render another title inside the white grid card when using this layout.

If the application has a global toolbar/page-title component, exclude this route from the global title when the feature owns the title in its page header. The title must have one owner; hiding the global title prevents a duplicate above the feature header.

Apply the exclusion to the exact grid route, not every child route by prefix, unless the child pages also own their titles. The visible feature title stays in the feature header; the shell title above the feature card is the one that must be removed.

Verification rule:

- [ ] The page contains exactly one feature title.
- [ ] The title and Add button are outside the white grid card.
- [ ] The white grid card starts with Search, followed by the grid and paginator.
- [ ] There is no duplicate global toolbar title.

For a simple grid, match the Location screen and let the page use its natural content height:

```scss
.feature-page {
  box-sizing: border-box;
  padding: 20px 14px 12px;
  background: #f1f3f7;
}
```

Do not add `height: calc(100dvh - ...)`, `min-height: 0`, or `overflow: hidden` to a simple grid page. A guessed shell offset can make the feature taller than its available content area and create an unwanted browser scrollbar. TripTypes must follow Location's natural-height pattern.

Only when a screen explicitly requires a full-height grid with many rows should the page own the viewport height and the table wrapper own the internal scroll:

```scss
.feature-page {
  box-sizing: border-box;
  height: calc(100dvh - 80px);
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.feature-table-panel {
  display: flex;
  min-height: 0;
  flex: 1 1 auto;
  flex-direction: column;
  overflow: hidden;
}

:host ::ng-deep .feature-table-panel > .card,
:host ::ng-deep .feature-table-panel .p-datatable {
  display: flex;
  min-height: 0;
  flex: 1 1 auto;
  flex-direction: column;
}

:host ::ng-deep .feature-table-panel .p-datatable-wrapper {
  min-height: 0;
  flex: 1 1 auto;
  overflow: auto !important;
}
```

For an explicitly approved full-height screen, use `100dvh` and verify the shell subtraction at desktop and mobile sizes. A table with many rows still needs one internal scroll owner; do not combine browser-page scrolling with a second independently growing table wrapper.

Use the shared Bootstrap action template for row menus. It preserves the original `ActionList.action(row)` callbacks and opens the menu downward. The shared `appDropdownPortal` directive temporarily moves the **same open menu DOM element** to `body`, positions it below the clicked button, then restores it when closed. This escapes table clipping without recreating menu items or breaking their Angular click handlers. Do not replace this shared callback path with another popup library at feature level.

### Simple grids with few columns

For a simple grid with a small number of columns, keep exactly one search control: the original compact `Keyboard Search` input rendered by `table-list` in the grid header. Do not add a second feature-owned Search form, input, or Search button. This is the standard used by both Location and TripTypes.

Configure the grid like this:

- keep the shared table header visible;
- set `hasCustomSearch` to `false` when the multi-field filter dialog is not needed; this disables the filter dialog, not the built-in header search;
- set `hasCreate` to `false` when Add is owned by the page header;
- set `hasMoreAction`, `hasAllList`, `hasActiveList`, `hasInActiveList`, and `hasDeleteList` to `false` when those controls are not part of the screen;
- do not bind `(clickSearch)` for this simple header search; that event is for a feature-owned custom filter/search workflow;
- keep the component's original compact width, solid background, left magnifier, and `Keyboard Search` placeholder;
- do not override `.p-datatable-header`, the built-in input width, icon position, or placeholder for a simple grid;
- add the shared `gridSearchClear` directive so a compact clear button appears inside the input only when it contains text;
- use `general.keyboardSearch` and `general.clearSearch` for the translated placeholder and accessible clear-button label;
- keep required form inputs on the details screen; “simple grid” applies only to the grid toolbar, not to create/edit fields.

Example:

```html
<table-list
  gridSearchClear
  [columns]="columns()"
  [list]="data()"
  [hasCreate]="false"
  [hasCustomSearch]="false"
  [hasMoreAction]="false"
  [hasAllList]="false"
  [hasActiveList]="false"
  [hasInActiveList]="false"
  [hasDeleteList]="false">
</table-list>
```

The page must contain no separate grid search form. Verify that the only search input is the compact `Keyboard Search` control rendered under `.p-datatable-header`. Its clear button must reset the grid filter, disappear when the input is empty, and return focus to the input without changing its width or left magnifier.

Keep this built-in keyword search visible on every grid. If a complex grid needs additional field-specific search inputs and a Search button, implement them only from that screen's supplied requirements and keep their purpose distinct from the built-in keyword search.

### Add and form buttons

Use a clear primary button for Add and Save. Use a secondary button for Cancel. Use a danger button only for a destructive action that is actually exposed:

```scss
.feature-add-button,
.feature-save-button {
  border: 0;
  border-radius: var(--feature-radius);
  color: #fff;
  background: var(--feature-primary);
  font-weight: 700;
}

.feature-add-button:hover,
.feature-add-button:focus-visible,
.feature-save-button:hover:not(:disabled),
.feature-save-button:focus-visible:not(:disabled) {
  color: #fff;
  background: var(--feature-primary-hover);
}

.feature-add-button:focus-visible,
.feature-save-button:focus-visible,
.feature-cancel-button:focus-visible {
  outline: 2px solid var(--feature-focus);
  outline-offset: 2px;
}

.feature-save-button:disabled {
  color: var(--feature-disabled-text);
  background: var(--feature-disabled-bg);
  border-color: var(--feature-disabled-bg);
  cursor: not-allowed;
  opacity: 1;
}
```

Do not represent disabled state only with opacity. Low opacity can fail contrast and makes it difficult to tell whether a button is disabled or simply styled differently.

### Table panel and grid header

```scss
.feature-table-panel {
  position: relative;
  z-index: 1;
  overflow: visible;
  padding: 40px 18px 14px;
  background: var(--feature-panel-bg);
  box-shadow: var(--feature-shadow);
}

```

For a simple grid, prefer no `.p-datatable-header` override at all. The shared component already supplies the required compact input, magnifier, placeholder, and keyword filtering behavior.

### Table header, rows, and cells

```scss
:host ::ng-deep .feature-table-panel .p-datatable {
  font-size: 14px;
}

:host ::ng-deep .feature-table-panel .p-datatable-thead > tr > th {
  padding: 6px 8px;
  border-color: #cfd3d7;
  color: #222;
  background: #f3f3f3;
  font-weight: 600;
}

:host ::ng-deep .feature-table-panel .p-datatable-tbody > tr > td {
  padding: 3px 8px;
  border-color: var(--feature-border);
  color: var(--feature-text);
  vertical-align: middle;
}

:host ::ng-deep .feature-table-panel .p-datatable-tbody > tr:nth-child(even) {
  background: #f1f1f1;
}

:host ::ng-deep .feature-table-panel .p-datatable-tbody > tr:hover {
  background: #f3f8fc;
}
```

### Standard row height

All simple grids must use the same compact row height as the Location grid. Apply `padding: 3px 8px` to body cells and use `white-space: nowrap` when columns contain short values. Do not increase the body-cell vertical padding in an individual feature, because that makes its rows taller than the shared UI standard.

Grids with long descriptions or translated text should keep the standard padding and enable wrapping only for those specific columns:

```scss
:host ::ng-deep .feature-table-panel .p-datatable-thead > tr > th:first-child,
:host ::ng-deep .feature-table-panel .p-datatable-tbody > tr > td:first-child {
  width: 1%;
  white-space: nowrap;
}

:host ::ng-deep .feature-table-panel .p-datatable-tbody > tr > td {
  white-space: nowrap;
}

:host ::ng-deep .feature-table-panel .p-datatable-tbody > tr > td.long-text-column {
  white-space: normal;
  overflow-wrap: anywhere;
}
```

### Paginator and empty state

Keep the paginator visually attached to the grid and aligned with the page direction:

```scss
:host ::ng-deep .feature-table-panel .p-paginator {
  justify-content: flex-start;
  padding: 8px 0 0;
  border: 0;
  background: transparent;
}
```

Define an intentional empty state instead of leaving a large blank table. The empty state should explain that there are no records and, when permitted, offer Add or Clear Search.

Loading state rules:

- show a spinner or loading overlay while the first list request is running;
- keep the grid structure stable while refreshing;
- do not remove the table to show a spinner after every update;
- disable only actions that would duplicate the active request;
- always clear loading state in `finalize()`, not only at the bottom of the success callback;
- treat both HTTP errors and a response with `isSuccess === false` as failures;
- let the global HTTP interceptor stop the shared loader and show one error modal using the API message;
- add an `error` subscription handler so a rethrown HTTP error does not become an unhandled stream error;
- use null-safe row mapping because an exception inside the success callback must not leave the loader active.

```typescript
this.loading.startLoading();
this.service.getList().pipe(
  takeUntilDestroyed(this.destroyRef),
  finalize(() => this.loading.endLoading()),
).subscribe({
  next: (response) => {
    if (response.isSuccess) this.data.set(response.entities);
  },
  error: () => undefined, // the global interceptor displays the error modal
});
```

### Dialog and modal surface

Give the dialog a stable content surface and let its body scroll on small screens:

```scss
:host ::ng-deep .feature-dialog .p-dialog-header {
  min-height: 56px;
  padding: 15px;
  border-bottom: 1px solid #e2e2e2;
  border-radius: 0;
  color: #4e5963;
  font-size: 18px;
  font-weight: 400;
}

:host ::ng-deep .feature-dialog .p-dialog-content {
  overflow: visible;
  padding: 0;
}

.feature-modal-card {
  padding: 0 15px 28px;
  background: #fff;
}

.feature-modal-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 9px;
  margin-top: 34px;
}
```

Use the dialog's `appendTo="body"`, a stable `baseZIndex`, and a width with a viewport-safe maximum. Do not solve clipping by giving the form an unlimited z-index.

### Form labels, inputs, focus, and errors

```scss
.feature-modal-form {
  color: #777;
  text-align: start;
}

.feature-modal-form label {
  display: block;
  margin-bottom: 7px;
  color: #8c8c8c;
  font-size: 14px;
  font-weight: 400;
}

.feature-modal-form input,
.feature-modal-form textarea,
.feature-modal-form select {
  width: 100%;
  border: 1px solid #c5cfdb;
  border-radius: 4px;
  color: #555;
  background: #fff;
  font-size: 14px;
}

.feature-modal-form input,
.feature-modal-form select {
  min-height: 36px;
  padding: 0 10px;
}

.feature-modal-form textarea {
  min-height: 160px;
  padding: 10px;
  resize: vertical;
}

.feature-modal-form input:focus,
.feature-modal-form textarea:focus,
.feature-modal-form select:focus {
  border-color: var(--feature-focus);
  outline: 2px solid rgb(120 185 221 / 25%);
  outline-offset: 0;
}

.feature-modal-form .ng-invalid.ng-touched {
  border-color: #dc3545;
}

.feature-field-error {
  margin-top: 4px;
  color: #dc3545;
  font-size: 12px;
}
```

Use one consistent input style within the modal. Do not mix underlined inputs, Bootstrap filled inputs, and custom bordered inputs without a deliberate design reason.

Use the application's shared validation translation keys for form errors. For a required field, render `validationMessages.required`; do not invent `general.required`, because a missing translation key is displayed literally to the user. Verify every validation key in both English and Arabic dictionaries.

### Editable collection sections

Forms that contain repeatable rows, such as documents, credit cards, contacts, or account mappings, should use one reusable editable-table pattern:

- keep the section heading and helper text outside the table;
- put horizontal overflow on a section-local wrapper, never on the page;
- append dropdown, calendar, and autocomplete overlays to `body` when the section wrapper scrolls, so the overlay is not clipped and still opens for rows near an edge;
- give body-appended calendar overlays a reusable `panelStyleClass` with explicit light/dark popup styles; component-scoped selectors cannot reliably theme an overlay after it is moved under `body`;
- give the table a stable minimum width so controls do not collapse or overlap;
- use the standard 36 px control height for row inputs and action buttons;
- use an icon-only destructive action in each row and an icon-plus-label Add button below the rows;
- keep the Actions column narrow and center its button;
- use `type="button"` so row actions never submit the parent form accidentally;
- provide translated `title` and `aria-label` text for every icon-only action;
- disable or hide all mutating actions in View mode;
- support the same hover, focus-visible, disabled, dark-theme, RTL, and reduced-motion states as the rest of the form.

Use neutral reusable class names such as `.feature-editable-icon-button` and `.feature-editable-add-button`. Do not create a new set of identical Add/Delete button styles for every collection.

Mirror the backend DTO validation on every nested row. A collection can be optional while each row, once added, still requires all non-nullable enum, date, and text fields. Mark those columns as required, add matching reactive-form validators, and include them in the clickable validation summary before allowing Save. Preserve numeric enum value `0` with nullish checks (`value ?? null`), not truthy fallbacks (`value || null`), because `0` is usually the first valid enum member. Convert dates and enum values only after the row is valid; do not let ASP.NET model binding become the first validation layer and return an avoidable HTTP 400. Enforce relationships such as `expiryDate > issueDate` with a form-group validator, show the translated error beside the dependent field, and include the range error in the validation summary.

#### Reusable calendar controls

Use the shared PrimeNG calendar treatment for dates in both editable tables and normal personal-information fields. Import `CalendarModule`, keep the form-control value as a `Date`, and convert it to the API's ISO format only when building the request. When filling Edit/View forms, use `new Date(apiValue)`; do not pass a `yyyy-MM-dd` string into a date-valued `p-calendar`.

```html
<p-calendar
  class="feature-calendar"
  inputId="birthDate"
  formControlName="birthDate"
  dateFormat="dd/mm/yy"
  [readonlyInput]="true"
  [showIcon]="true"
  [showButtonBar]="true"
  [maxDate]="today"
  appendTo="body"
  panelStyleClass="sigma-datepicker-panel">
</p-calendar>
```

Calendar rules:

- use `dd/mm/yy` for normal business dates;
- use `view="month"` with `dateFormat="mm/yy"` for payment-card expiry;
- use a stable `readonly today = new Date()` as the maximum Date of Birth so future dates are unavailable;
- append table calendars to `body` and reuse the globally themed `panelStyleClass`;
- keep popup styling in a global stylesheet because a body-appended overlay is outside component encapsulation;
- style the input, calendar trigger, focus, invalid, disabled, dark, and RTL states together;
- use `showClear` only for optional dates; required dates should remain visibly required after clearing;
- use a group validator as the source of truth for related dates and use `minDate` only as an additional picker aid;
- for a strict rule such as `expiryDate > issueDate`, set the picker minimum to the next calendar day, reject equal dates in the validator, and show the translated error beside Expiry Date.

Do not return a newly constructed `Date` from a template-bound `minDate` or `maxDate` expression during every change-detection pass. PrimeNG can interpret the changing object reference as a new configuration and reinitialize the popup while the user is selecting. Store a stable property for fixed limits and memoize/cache row-dependent limits by form row and source timestamp. Recalculate only when the source date actually changes.

When a row contains a file upload:

- visually hide the native file input without removing it from the accessibility tree;
- use a matching `for`/`id` pair for the styled picker;
- show the selected file name and accepted file types;
- distinguish **clear the selected file** from **delete the complete row** with separate controls and labels;
- keep upload state per row; a global upload flag must not change unrelated profile or document controls;
- update the form control that actually stores the file path after upload and clear that same control when removing the file;
- stop loading state with `finalize`, including failed requests;
- determine success from the API result and saved path, not from a loose `OR` condition that accepts partial failures.

For payment-card rows, add the appropriate browser hints (`cc-number`, `cc-name`, and `cc-csc`), use a masked CVV field, and never include CVV in logs, exports, toast messages, or debug output. Persist sensitive card data only when the backend contract and security requirements explicitly permit it.

Minimum interaction checks for every editable collection:

- add a row;
- remove the first, middle, and last row;
- use the section with zero and one row;
- tab to each control and activate icon buttons with the keyboard;
- select Issue Date, then confirm the same day is invalid and the following day can be selected as Expiry Date;
- change Issue Date after selecting Expiry Date and confirm the row validator updates;
- verify Date of Birth accepts past/today values but rejects future dates;
- verify card expiry uses month/year selection and serializes a valid API date;
- verify calendar month navigation, Today/Clear actions, keyboard use, and prefilled Edit/View values;
- verify long file names and narrow screens stay inside the section scroller;
- verify View mode cannot add, clear, upload, or delete;
- verify light mode, dark mode, LTR, and RTL.

### Action menu styling

Keep the Actions column at content width. A Bootstrap `.dropdown` is a block element and can fill a wide table cell; if the menu uses `right: 0`, that makes its items appear far away from the Actions button. Constrain the first column before applying right-aligned menu positioning:

```scss
:host ::ng-deep .feature-table-panel .p-datatable-thead > tr > th:first-child,
:host ::ng-deep .feature-table-panel .p-datatable-tbody > tr > td:first-child {
  width: 1%;
  white-space: nowrap;
}
```

The shared button and menu are rendered through the action template inside the grid. Keep styling scoped under the feature panel unless it is part of the shared action-button component itself.

The action button should be compact but readable:

```scss
:host ::ng-deep .feature-table-panel .action-button-toggle {
  min-width: 94px;
  height: 25px;
  padding: 0 7px;
  border: 0;
  border-radius: var(--feature-radius);
  color: #fff;
  background: var(--feature-primary);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

:host ::ng-deep .feature-table-panel .action-button-toggle:hover,
:host ::ng-deep .feature-table-panel .action-button-toggle:focus-visible,
:host ::ng-deep .feature-table-panel .action-button-toggle.show {
  color: #fff;
  background: var(--feature-primary-hover);
}

```

Keep the shared menu directly below its button:

```scss
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-menu {
  z-index: 1100;
  top: calc(100% + 4px) !important;
  right: auto !important;
  bottom: auto !important;
  left: 0 !important;
  min-width: 170px;
  max-height: min(70vh, 420px);
  overflow-y: auto;
  margin: 0 !important;
  transform: none !important;
}
```

For a menu with many or dependent actions, keep icons aligned, use translated labels, and show disabled state without removing keyboard focus unexpectedly. Use separators or grouped labels only when they materially improve scanning. Verify light, dark, RTL, hover, focus, and disabled states.

### Responsive behavior

Use a small number of intentional breakpoints:

```scss
@media (max-width: 700px) {
  .feature-heading {
    align-items: flex-start;
    gap: 10px;
  }

  .feature-heading h1 {
    font-size: 20px;
  }

  .feature-add-button {
    padding-inline: 9px;
    font-size: 10px;
  }

  .feature-table-panel {
    padding: 16px 8px 8px;
  }
}

@media (max-width: 650px) {
  .entity-modal-fields {
    display: block;
  }

  .feature-modal-actions {
    justify-content: stretch;
  }

  .feature-modal-actions button {
    flex: 1 1 120px;
  }
}
```

For narrow tables, prefer horizontal scrolling or a deliberate responsive column policy. Do not shrink action labels until they become unreadable. Do not hide important columns without providing another way to access their values.

### RTL and direction

Use logical properties where possible:

```scss
.feature-heading span {
  margin-inline-start: 5px;
}

.feature-modal-actions {
  padding-inline: 0;
}

:host-context([dir='rtl']) .entity-input-wrapper i {
  right: auto;
  left: 4px;
}
```

Avoid hard-coded `left` and `right` when `margin-inline`, `padding-inline`, `inset-inline-start`, and `inset-inline-end` express the intent. Keep the same grid row/column structure in RTL unless the product specifically requires a different reading order.

### Layering and overflow rules

Use a small, documented z-index scale:

```text
normal content       0
table action menu  1100
modal mask          1990
modal dialog        2000
```

The exact values can follow the application's existing scale. The important rules are:

- the open table action menu must be above table rows and cells;
- the dialog must be above the page and table;
- an autocomplete list must be above the form fields;
- no component should use an arbitrary `999999` value;
- overflow fixes must be scoped to the feature container.

### Motion and reduced motion

Do not make success, loading, or dropdown behavior depend on animation. If transitions are added, support reduced motion:

```scss
@media (prefers-reduced-motion: reduce) {
  .feature-page *,
  .feature-page *::before,
  .feature-page *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 7. Details form modes

The details component should expose a mode input and a typed change event:

```typescript
@Input() embedded = false;
@Input() embeddedMode: 'create' | 'view' | 'edit' = 'create';
@Input() recordId: string | null = null;

@Output() closed = new EventEmitter<void>();
@Output() changed = new EventEmitter<'create' | 'update'>();
```

Initialize the mode before creating the form. A common mistake is creating the form first and then enabling/disabling controls using an old mode value.

```typescript
isCreateMode = signal(false);

if (this.embedded) {
  this.isCreateMode.set(this.embeddedMode === 'create');
  this.id.set(this.recordId ? Number(this.recordId) : 0);
}

this.initForm();

if (!this.isCreateMode()) {
  this.getItemById(String(this.id()));
}
```

After loading:

```typescript
this.fillForm(response.entity);

if (this.embedded && this.embeddedMode === 'view') {
  this.form.disable();
} else {
  this.form.enable();
}
```

Do not show Update and Delete buttons in Edit. Edit uses the same Save button as Add. View has no Save button.

## 8. Reactive form and validation

Create request models from the backend contract, not from the database entity:

```typescript
this.form = this.fb.group({
  displayName: [
    { value: '', disabled: !this.isCreateMode() },
    [Validators.required, Validators.maxLength(100)],
  ],
  description: [
    { value: '', disabled: !this.isCreateMode() },
    [Validators.required, Validators.maxLength(500)],
  ],
});
```

Rules:

- Add both HTML constraints and reactive validators.
- Use `getRawValue()` when a disabled control must be preserved in an update.
- Mark all controls touched when Save is clicked on an invalid form.
- Disable Save while the form is invalid or a request is running.
- Restore loading/saving state in both success and error paths.
- Do not use a database entity interface as the create payload.

Example Save button:

```html
@if (embeddedMode !== 'view') {
  <button
    type="button"
    class="entity-save-button"
    [disabled]="form.invalid || saving()"
    (click)="save()">
    {{ 'general.save' | translate }}
  </button>
}
```

Example button styling:

```scss
.entity-save-button {
  color: #fff;
  background: #71b8e2;
  border-color: #71b8e2 !important;
}

.entity-save-button:disabled {
  color: #9aa3aa;
  background: #e4e8eb;
  border-color: #d2d8dd !important;
  cursor: not-allowed;
  opacity: 1;
}

.entity-save-button:hover:not(:disabled) {
  background: #5fa8d4;
  border-color: #5fa8d4 !important;
}
```

If the Save button looks disabled when the form is valid, inspect `form.invalid`, `saving()`, disabled CSS, and whether an HTML `disabled` attribute is being set by a shared button model.

## 9. Create and update through one Save action

The save operation chooses POST or PUT from the mode:

```typescript
save(): void {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const values = this.form.getRawValue() as EntityCreateDTO;
  const request$ = this.isCreateMode()
    ? this.entityService.create(values)
    : this.entityService.update({
        ...values,
        id: this.id(),
        subscriptionId: this.subscriptionId,
      } as EntityUpdateDTO);

  this.saving.set(true);
  request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
    next: response => {
      if (response.isSuccess) {
        this.changed.emit(this.isCreateMode() ? 'create' : 'update');
        this.closed.emit();
      }
      this.saving.set(false);
    },
    error: () => this.saving.set(false),
  });
}
```

Never require a separate Update button for a normal edit form. Keeping one Save path prevents Add and Edit from drifting apart.

## 10. Refresh and pagination behavior

The list must distinguish Add from Update:

```typescript
onEntityChanged(changeType: 'create' | 'update'): void {
  this.getListItems(
    undefined,
    changeType === 'create', // Add: navigate to last page
    changeType === 'update', // Update: restore current page
  );
}
```

Required behavior:

| Operation | Refresh grid | Page behavior |
|---|---|---|
| Add | Yes | Move to last page |
| Update | Yes | Stay on current page |
| Search | Yes | Store and reuse filter |
| View | No | Close only |
| Cancel | No | Close only |

Before refreshing for Update, capture the table's current first row:

```typescript
const currentFirst = this.tableList?.dt?.first ?? 0;
```

After the response replaces the rows, restore it and clamp it when the result count is smaller:

```typescript
const rows = table.rows || 10;
const maxFirst = Math.max(
  0,
  Math.floor((this.data().length - 1) / rows) * rows,
);

table.onPageChange({
  first: Math.min(currentFirst, maxFirst),
  rows,
});
```

If the service uses true server-side pagination, use the API's `pageNo`, `pageSize`, and `totalPages` instead of calculating from the loaded array.

Preserve the active filter. A refresh with `undefined` must not unintentionally remove the user's search criteria:

```typescript
private lastListFilter: unknown;

getListItems(filter?: unknown): void {
  if (filter !== undefined) this.lastListFilter = filter;
  this.entityService.getList(this.toListQuery(filter ?? this.lastListFilter));
}
```

### Add/Edit pagination verification

This behavior is mandatory and must be verified in every grid that uses this pattern:

```text
Add success
  -> details emits 'create'
  -> list refreshes data
  -> list calls navigateToLastPage()
  -> grid selects the page containing the newest row

Edit success
  -> details emits 'update'
  -> list captures the current first-row index
  -> list refreshes data
  -> list calls restorePage(currentFirst)
  -> grid remains on the page the user was viewing
```

Expected implementation call:

```typescript
onEntityChanged(changeType: 'create' | 'update'): void {
  this.getListItems(
    undefined,
    changeType === 'create', // true only after Add
    changeType === 'update', // true only after Edit
  );
}
```

Verification checklist:

- [ ] Add a record while on the first page; the grid selects the last page.
- [ ] Add a record when the current page is already the last page; the grid remains on the last page.
- [ ] Edit a record on the first page; the grid returns to the first page.
- [ ] Edit a record on a middle page; the grid returns to that same middle page.
- [ ] Edit a record on the last page; the grid returns to the last page.
- [ ] Update a record while a filter is active; the filter remains active.
- [ ] If the update reduces the available rows, the restored page is clamped to the new last valid page.
- [ ] View and Cancel do not refresh or change the selected page.

## 11. Query and API contracts

Use separate models for list, details, create, update, and optional search:

```typescript
export interface EntityListDTO {
  id: number | null;
  displayName: string | null;
  description: string | null;
}

export interface EntityCreateDTO {
  displayName: string;
  description: string;
}

export interface EntityUpdateDTO extends EntityCreateDTO {
  id: number;
  subscriptionId: number;
}

export interface EntityListQuery {
  pageNo?: number;
  pageSize?: number;
  filters?: Record<string, string | number | boolean>;
}
```

For services that use the backend's dynamic filter convention, serialize filters and pagination separately:

```typescript
Object.entries(query.filters ?? {}).forEach(([key, value]) => {
  params = params.set(`Filters[${key}]`, String(value));
});

if (query.pageNo !== undefined) {
  params = params.set('pageNo', String(query.pageNo));
}

if (query.pageSize !== undefined) {
  params = params.set('pageSize', String(query.pageSize));
}
```

Do not send `pageNo` and `pageSize` through a generic query serializer if it turns every property into `Filters[key]`.

Keep endpoint methods explicit:

```typescript
getList(query: EntityListQuery = {}): Observable<Results<EntityListDTO>>;
getDetails(id: string): Observable<Result<EntityDetailsDTO>>;
create(data: EntityCreateDTO): Observable<Result<null>>;
update(data: EntityUpdateDTO): Observable<Result<null>>;
delete(id: string): Observable<Result<null>>;
```

Check `isSuccess` before emitting success events. Stop loading indicators on both successful and failed requests.

## 12. Optional autocomplete fields

Autocomplete is optional. If a screen has one, keep it local to the details component:

```typescript
private readonly searchInput$ = new Subject<string>();
searchSuggestions = signal<EntitySearchDTO[]>([]);
searching = signal(false);
```

Use a debounced, cancellable pipeline:

```typescript
this.searchInput$
  .pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(searchKey => {
      if (searchKey.trim().length < 2) {
        this.searchSuggestions.set([]);
        return of(null);
      }

      this.searching.set(true);
      return this.entityService.search({ searchKey }).pipe(
        catchError(() => of(null)),
        finalize(() => this.searching.set(false)),
      );
    }),
    takeUntilDestroyed(this.destroyRef),
  )
  .subscribe(response => {
    this.searchSuggestions.set(response?.isSuccess ? response.entities : []);
  });
```

The suggestions panel should be positioned relative to the input wrapper:

```scss
.entity-input-wrapper {
  position: relative;
}

.entity-suggestions {
  position: absolute;
  z-index: 10;
  top: calc(100% + 4px);
  right: 0;
  left: 0;
}
```

On selection, patch all dependent form fields in one operation and close the list. Truncate derived text to the backend's maximum length.

## 13. Action dropdown and table clipping

Use the shared Bootstrap action template. The action item must invoke its original callback directly; this behavior is application-wide and must not be replaced from one feature.

```html
<div class="dropdown" appDropdownPortal>
  <button
    type="button"
    class="action-button-toggle dropdown-toggle"
    data-bs-toggle="dropdown"
    data-bs-display="static"
    aria-expanded="false">
    {{ 'general.actions' | translate }}
  </button>

  <ul class="dropdown-menu">
    @for (action of moreActions(); track action.title) {
      @if (action.visible?.(row) ?? true) {
      <li>
        <button
          type="button"
          class="dropdown-item"
          [disabled]="action.disabled?.(row) ?? false"
          (click)="action.action(row)">
          <i [class]="action.icon"></i>
          {{ action.title | translate }}
        </button>
      </li>
      }
    }
  </ul>
</div>
```

`data-bs-display="static"` plus the shared menu positioning keeps the menu directly below the clicked button:

```scss
.dropdown-menu {
  top: calc(100% + 4px) !important;
  right: auto !important;
  bottom: auto !important;
  left: 0 !important;
  margin: 0 !important;
  transform: none !important;
}

:host-context([dir='rtl']) .dropdown-menu {
  right: 0 !important;
  left: auto !important;
}
```

Never force the menu above the button with `bottom: 100%`. If a table wrapper clips the downward menu, use the shared portal directive; do not change the callback markup. The directive must move and restore the existing menu node so `(click)="action.action(row)"` remains attached.

Test the first row, middle row, last row, and one-row grid. For each displayed item, verify that clicking View, Edit, Delete, or another configured action actually runs its original row callback. Also verify downward placement, outside-click closing, keyboard focus, light mode, dark mode, LTR, and RTL. Any shared action component change requires smoke-testing every feature that consumes it.

## 14. Translation and accessibility

Use translation keys, not hard-coded user-facing text:

- `feature.title`
- `feature.manage`
- `feature.addNew`
- `feature.displayName`
- `feature.description`
- `general.actions`
- `general.viewDetails`
- `general.edit`
- `general.save`
- `general.cancel`
- `general.close`
- `general.keyboardSearch`
- `general.clearSearch`
- `validationMessages.required`

Every input needs a matching label and id. For autocomplete:

```html
<label for="entitySearch">{{ 'feature.search' | translate }}</label>
<input
  id="entitySearch"
  autocomplete="off"
  [attr.aria-busy]="searching()"
  (input)="onSearchInput($any($event.target).value)" />

@if (searchSuggestions().length > 0) {
  <div class="entity-suggestions" role="listbox">
    @for (suggestion of searchSuggestions(); track suggestion.id) {
      <button type="button" role="option">
        {{ suggestion.label }}
      </button>
    }
  </div>
}
```

For RTL, mirror only directional properties such as icon position and input padding using `:host-context([dir='rtl'])`. Keep the CSS Grid structure shared by LTR and RTL.

## 15. Routes and standalone details

Typical routes are:

```typescript
export const routes: Routes = [
  { path: '', component: EntityListComponent },
  { path: 'details/:id', component: EntityDetailsComponent },
];
```

Do not register a normal `create` route: Add opens the create modal from the grid. The optional `details/:id` route is only for an explicitly required direct link, browser refresh, or deep-link workflow; View and Edit actions in the grid still open the shared modal. If a standalone details route is retained, verify that the details component works with and without `embedded=true`.

## 16. Testing checklist

At minimum, test:

### Grid

- initial load;
- empty result;
- search/filter;
- search filter preserved after update;
- action menu on the first row;
- action menu on the last row;
- action menu with exactly one row;
- page restoration after update;
- last-page navigation after add.

### Details

- Add opens an empty enabled form;
- View loads and disables the form;
- Edit loads and enables the form;
- View does not show Save, Update, or Delete;
- Edit shows Save and does not show Update or Delete;
- invalid form keeps Save disabled;
- valid form changes Save styling;
- Save sends POST in Add;
- Save sends PUT in Edit;
- successful save closes the modal and refreshes the grid;
- failed save leaves the form open and stops the spinner;
- cancel does not call the API.

### Layout

- an optional details-form autocomplete/search field is in the first form row and is not a second grid search input;
- no fields overlap in View or Edit;
- desktop two-column layout;
- mobile one-column layout;
- RTL direction;
- autocomplete list is not clipped by the form.

Run the project type check:

```text
npm.cmd exec -- tsc --noEmit --project tsconfig.app.json
```

The feature specs should import and instantiate the actual feature components. Do not leave generated specs pointing to unrelated example components.

## 17. Refactoring workflow

1. Read the backend user story, controller, service, and response wrappers.
2. Inspect the shared table, action-button, buttons, and base service components.
3. List the actual API fields and separate DTOs by operation.
4. Define the list state and the Add/View/Edit state machine.
5. Implement the typed service methods and query serialization.
6. Implement the list grid and row action template.
7. Implement the details reactive form and CSS Grid layout.
8. Add the single Save path for POST and PUT.
9. Add typed change events so Add and Update refresh differently.
10. Add overflow and one-row action-menu handling.
11. Add variable/dependent action rules and re-check them before execution.
12. Add validation, loading, error, translation, and accessibility behavior.
13. Apply scoped page, grid, form, modal, menu, responsive, RTL, and focus styles.
14. Run type checking and test the full interaction matrix.

## 18. Common failure symptoms

| Symptom | Likely cause | Fix |
|---|---|---|
| Save stays disabled | Reactive form invalid or `saving()` true | Inspect validators and form values |
| Save color does not change | Disabled CSS is missing/overridden | Add explicit `:disabled` styles |
| Grid does not update | No success output or parent does not refresh | Emit `create`/`update` and subscribe in list |
| Update jumps to another page | Add and Update use the same refresh behavior | Restore `dt.first` for Update |
| Search disappears after refresh | Last filter is not stored | Reuse the stored list filter |
| Fields overlap in Edit | Two controls use the same explicit grid row | Give each grid area one owner |
| Action menu is hidden | A table wrapper clips the shared Bootstrap menu | Apply the shared `appDropdownPortal` directive so the same open menu node is positioned below the button at body level |
| Action item opens far away from its button | The Actions cell expands while the menu is aligned with `right: 0` | Set the first header and body cells to `width: 1%` and `white-space: nowrap` |
| Action menu opens upward | Popper flips placement or feature CSS sets `bottom: 100%` | Use `data-bs-display="static"` and position the shared menu below with `top: calc(100% + 4px)` |
| Conditional action appears for the wrong row | Action visibility is hard-coded or not re-evaluated | Use typed `visible`/`disabled` predicates and re-check before execution |
| Dependent action remains available after a state change | The row/action state was not refreshed | Update action state and refresh the row/grid after success |
| Duplicate title appears | Both the shell and feature render the title | Choose one title owner |
| Dark mode leaves a white grid/card | The feature uses fixed light colors or themes only the shell | Override the full feature surface hierarchy under the active dark-theme selector |
| Simple grid has an unwanted vertical scrollbar | A forced `100dvh` height or guessed shell offset makes the page too tall | Match Location: use natural page height and remove forced height/overflow rules |
| View allows editing | Form was not disabled after load | Disable after `fillForm` in View |
| Edit creates a new row | Save always calls POST | Select PUT when mode is Edit |
| Autocomplete calls the API for every key | No debounce/cancellation | Use `debounceTime` and `switchMap` |
| API ignores pagination | Generic serializer sends `Filters[pageNo]` | Send `pageNo` and `pageSize` at the top level |

## 19. Definition of done

A generic grid screen is ready when:

- list, details, models, and service responsibilities are separate;
- the grid displays typed data and supports search;
- row actions work for first, middle, last, and one-row cases;
- Add, View, and Edit share one dialog and one details component;
- the form uses CSS Grid on desktop and one column on mobile;
- simple grids with few columns have exactly one built-in Search input in the grid header and no external grid Search input;
- complex grids document why they need a custom or multi-field search workflow and suppress the redundant table-header `Keyboard Search` input;
- View is read-only and Edit uses Save for PUT;
- invalid Save is disabled and visually distinct;
- Add refreshes to the last page;
- Update refreshes without leaving the current page;
- the active filter survives Update;
- actions support any number of menu items;
- dependent actions correctly reflect row state, permissions, and previous action results;
- the screen has one title owner and no unnecessary page-level vertical scroll;
- dark mode covers the page, panel, filters, table, paginator, menus, and dialogs without isolated light surfaces;
- simple grids expose one built-in Search input in the table header and no external Search form;
- API requests match backend parameter names and wrappers;
- page, table, modal, form, button, menu, responsive, RTL, focus, and disabled styles are scoped and consistent;
- translations, accessibility, RTL, and loading/error states are handled;
- TypeScript validation and feature tests pass.
