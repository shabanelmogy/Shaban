# Generic Angular Grid Screen Guide

> **IMPORTANT — READ THIS GUIDE CAREFULLY BEFORE IMPLEMENTING**
>
> Read the relevant guide sections completely before changing code. Follow the
> approved patterns and reference screenshot exactly. Keep small requests
> focused: implement only the requested scope, and do not expand into unrelated
> audits, builds, browser checks, or refactoring unless the user asks for them.

This is the reviewed and reorganized version of the reusable Angular CRUD grid guide. It separates mandatory behavior from advanced patterns, removes conflicting rules, and makes server-side pagination the default for database-backed grids.

The guide targets Angular standalone components that use the project's shared `table-list`, `action-button`, button, translation, loading, and result-wrapper primitives.

For full-page step forms with fixed headers, step navigation, uploads, nested collections, and internal scrolling, also follow [`GENERIC_STEP_FORM_GUIDE.md`](./GENERIC_STEP_FORM_GUIDE.md).

## Approved modal design reference

The approved Add/Edit grouped-modal design is the compact modal shown in the
provided reference: a fixed header with an icon tile, title, helper text, and
Close action; a scrollable body containing bordered field groups with icon,
heading, helper text, and responsive input grids; and a fixed footer with the
required-fields note at the inline start and Cancel/Save actions at the inline
end. This is the grouped editor modal pattern documented in Section 6.

Use the same modal for Add and Edit, changing only its mode, title, loaded data,
and Save behavior. View mode must be read-only. Preserve the documented compact
spacing, required markers, focus states, responsive layout, dark theme, RTL
support, and internal body scrolling.

## How to use this guide

- **Core sections (1-5):** apply to normal grid-based CRUD features.
- **Advanced section (6):** apply only when the form contains nested editable collections or a large grouped editor.
- **Delivery sections (7-8):** use during implementation, review, and acceptance.
- Project-specific exceptions must be documented beside the feature; do not silently diverge from the shared pattern.

### Mandatory implementation execution checklist

This checklist is a delivery gate, not an optional summary. Copy it into the
feature's review notes before implementation begins. Mark every applicable item
complete and record a reason and replacement verification for every `N/A`.
Do not declare the screen complete while an applicable item remains unchecked.

#### Discovery and contracts

- [ ] Read the user story and confirm the visible reference screen, supported
  actions, sort order, and post-create destination.
- [ ] Inspect the backend controller, service, result wrappers, entity,
  `ListVM`, details VM, create VM, update VM, and mappings.
- [ ] Inspect the shared `table-list`, action-button, buttons, loading,
  translation, dropdown-portal, and base-service behavior used by the feature.
- [ ] Audit every list field across backend projection, frontend DTO, visible
  column, action predicate, and export; remove unused or permanently empty
  fields.
- [ ] Confirm the GET contract sends `pageNo` and `pageSize` at the top level
  and business filters as `Filters[key]`.
- [ ] Confirm filtering and exact counting happen before stable ordering,
  `Skip`, and `Take`, and that `totalCount` is returned.

#### Grid and interaction

- [ ] Implement typed list, paging, filter, loading, dialog, selection, and
  action state.
- [ ] Use one search experience only. Server-paged grids send keyword/filter
  changes to the backend; the shared local Keyboard Search is allowed only
  when the complete searchable dataset is loaded in memory.
- [ ] Configure server-side lazy paging once, synchronize `first`, `rows`, and
  `totalRecords`, and prevent duplicate subscriptions.
- [ ] Keep one page title owner; keep the feature title and Add button outside
  the white grid card and suppress the exact-route shell title.
- [ ] Keep Name and other data columns as plain text; expose View and Edit
  through the typed Actions menu.
- [ ] Verify the Actions menu on first, middle, last, and one-row grids,
  including downward placement, keyboard use, and outside-click closing.
- [ ] For compact CRUD forms, open Add, View, and Edit in one details dialog.
  For a full-page multi-step editor, follow `GENERIC_STEP_FORM_GUIDE.md` and
  use explicit Create/View/Edit routes instead.
- [ ] Verify Create moves to the row's page according to the stable sort,
  Update preserves the active page/filter, and View/Cancel do not refresh.
- [ ] Verify Export retrieves every filtered server page without changing the
  visible grid page and shows a clear busy/disabled state.

#### Form, validation, and API behavior

- [ ] Build separate details, create, and update models from the API contract.
- [ ] Initialize the form after resolving mode; Add is empty/enabled, View is
  loaded/disabled, and Edit is loaded/enabled.
- [ ] Keep one Save path: POST in Add and PUT in Edit; View shows only Close.
- [ ] Keep Save clickable for validation, mark invalid controls touched, keep
  the dialog open, and send no invalid request.
- [ ] Use `getRawValue()` only as input to an explicit payload builder; never
  spread raw form state or disabled server-owned fields into the request.
- [ ] Stop loading and saving state in `finalize()` for success, API failure,
  and HTTP error paths.
- [ ] Emit typed create/update success events only when `isSuccess` is true;
  Cancel and failed Save must not emit success.
- [ ] Mirror backend required, length, email, enum, date, and relationship
  validation in the reactive form and accessible error summary.

#### Visual, theme, responsive, and accessibility

- [ ] Match the approved reference at its exact viewport and record the
  measured title, card, toolbar/button, table, and paginator placement.
- [ ] Apply feature-scoped page, panel, table, modal, form, button, menu,
  focus, disabled, hover, and reduced-motion styles.
- [ ] Verify light and dark themes across the page shell, card, search, table,
  rows, paginator, dropdown, dialog, inputs, and body-appended overlays.
- [ ] Verify desktop, tablet, mobile, LTR, and RTL layouts with no unintended
  page scrollbar, overlap, clipping, or duplicate title/search.
- [ ] Use translation keys for user-facing text, labels for every input,
  visible focus states, and translated `title`/`aria-label` text for icon-only
  controls.

#### Owner-run verification and delivery evidence

Do not build, test, or run Sigma unless the owner explicitly requests it in the
current task. Supply these scenarios for the owner and record only evidence the
owner returns:

- [ ] Owner runs the frontend TypeScript check and affected feature specs.
- [ ] Owner builds the affected frontend and backend projects and records
  unrelated pre-existing budget or repository failures separately.
- [ ] Owner inspects real request/response traffic for initial page, page 2,
  page-size change, search reset, Update refresh, empty results, and Export.
- [ ] Owner captures the final exact-viewport screen and compares it with the approved
  reference; record any intentional difference.
- [ ] Review the final diff to confirm no temporary authentication bypass,
  debug code, hard-coded test data, unrelated edit, or generated artifact
  remains.
- [ ] Attach the completed checklist and verification evidence to the feature
  handoff.

## Review decisions

1. A grid has one search experience: server-backed keyword/filter search for
   database-paged grids, or built-in local search only for a fully loaded
   in-memory grid.
2. Database-backed grids use server-side pagination; fetch-all pagination is not a normal browsing strategy.
3. The page shown after Create follows the active stable sort; it is not always the last page.
4. Save remains clickable to reveal validation errors and is disabled only while saving or in View mode.
5. Row actions use a typed action model; the legacy `ActionList` shape is an adapter for the existing shared component.
6. Core grid guidance is separated from nested-editor, upload, and document-table patterns.

## Contents

1. Architecture and feature boundaries
2. Grid composition, state, dialogs, and row actions
3. Details forms and Save behavior
4. API contracts, server pagination, refresh, and export
5. Visual, responsive, dark-theme, and menu standards
6. Advanced nested editors and editable collections
7. Routing, translation, and accessibility
8. Testing, refactoring workflow, common failures, and definition of done


## 1. Architecture and feature boundaries

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

## 2. Grid composition, state, dialogs, and row actions

### Page and grid composition

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
4. A fully loaded in-memory grid may use the shared compact `Keyboard Search`.
   A server-paged grid uses a feature-owned server search and suppresses the
   local table-header search so users never search only the visible page.
5. Gray table header with dark text and sortable indicators.
6. Compact alternating row backgrounds with readable text and vertical alignment.
7. Blue Actions button in the first column, with a dropdown for row actions.
8. Paginator below the rows, aligned consistently with the application direction.
9. No duplicate title from the global toolbar.
10. No unrelated Create, Delete, status, filter, or extra input controls unless the screen explicitly needs them.

The Location screen is the reference implementation for these colors, spacing, table density, action-button treatment, and paginator placement.

### Search choice by data source

Use one search experience per grid:

- **Complete in-memory list:** the shared `table-list` Keyboard Search may
  filter the full local collection.
- **Server-paged simple grid:** use one feature-owned keyword input that sends
  a backend filter, resets to page 1, and keeps that filter on later pages.
- **Server-paged filter-heavy grid:** use the dedicated filter bar for all
  server filters.

The shared `table-list` component currently renders its local global-search
caption even when `[hasCustomSearch]="false"`. For every server-paged screen,
keep the feature-owned server search, set `[hasCustomSearch]="false"`, omit
`gridSearchClear`, and hide the local caption with a feature-scoped selector:

```scss
:host ::ng-deep .feature-table-panel table-list .p-datatable-header {
  display: none !important;
}
```

Do not hide or change the table header globally. This rule belongs to the
server-paged feature. Never present the local `filterGlobal` input as a
database-wide search.

### List component state

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

### Choose the editor shape before routing

Use one dialog and one details component for Add, View, and Edit only when the
form is compact enough for a bounded modal.

The grid's **Add/New** button opens the modal directly for that compact CRUD
shape. After a successful Create, close the modal, reload the grid, and show
the page dictated by the active stable sort; never assume it is the last page.
Edit restores the active page and filters.

When the editor is multi-step, contains large nested collections/uploads, or
needs deep links and browser history, use the full-page pattern from
`GENERIC_STEP_FORM_GUIDE.md` with explicit `create`, `view/:id`, and `edit/:id`
routes. In that shape, the dialog requirements in this section are not
applicable. Do not squeeze a step form into a modal merely to satisfy this
guide.

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

## 3. Details forms and Save behavior

### Details form modes

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

### Reactive form and validation

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
- Use `getRawValue()` only before building a whitelisted request object.
- Include disabled mutable values deliberately; omit tenant, number, audit,
  deletion, calculated, and other server-owned controls.
- Mark all controls touched when Save is clicked on an invalid form.
- Keep Save clickable so an invalid submission can reveal validation errors; disable it only while a request is running or in View mode.
- Restore loading/saving state in both success and error paths.
- Do not use a database entity interface as the create payload.

Example Save button:

```html
@if (embeddedMode !== 'view') {
  <button
    type="button"
    class="entity-save-button"
    [disabled]="saving()"
    (click)="save()">
    {{ 'general.save' | translate }}
  </button>
}
```

Example button styling:

```scss
.entity-save-button {
  color: #fff;
  background: #1478b5;
  border-color: #1478b5 !important;
}

.entity-save-button:disabled {
  color: #9aa3aa;
  background: #e4e8eb;
  border-color: #d2d8dd !important;
  cursor: not-allowed;
  opacity: 1;
}

.entity-save-button:hover:not(:disabled) {
  background: #10699e;
  border-color: #10699e !important;
}
```

If the Save button remains disabled, inspect `saving()`, View-mode rules, disabled CSS, and whether a shared button model is setting an HTML `disabled` attribute.

### One Save action for Create and Update

The save operation chooses POST or PUT from the mode:

```typescript
save(): void {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const raw = this.form.getRawValue();
  const values: EntityCreateDTO = {
    displayName: raw.displayName.trim(),
    description: raw.description.trim(),
  };
  const request$ = this.isCreateMode()
    ? this.entityService.create(values)
    : this.entityService.update({
        id: this.id(),
        displayName: values.displayName,
        description: values.description,
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

### CSS Grid form layout

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

### Form labels, controls, focus, and errors

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
  border-color: var(--feature-error-text);
}

.feature-field-error {
  margin-top: 4px;
  color: var(--feature-error-text);
  font-size: 12px;
}
```

Use one consistent input style within the modal. Do not mix underlined inputs, Bootstrap filled inputs, and custom bordered inputs without a deliberate design reason.

Use the application's shared validation translation keys for form errors. For a required field, render `validationMessages.required`; do not invent `general.required`, because a missing translation key is displayed literally to the user. Verify every validation key in both English and Arabic dictionaries.

### Optional autocomplete fields

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

## 4. API contracts, server pagination, refresh, and export

### Query and API contracts

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
}

export interface EntityListQuery {
  pageNo?: number;
  pageSize?: number;
  filters?: Record<string, string | number | boolean>;
}
```

`SubscriptionId`, generated `No`, audit fields, deletion flags, calculated
totals, and immutable status are server-owned. Do not place them in a normal
frontend Update model or derive them from form state.

If a legacy Sigma base ViewModel still requires `SubscriptionId`, isolate that
compatibility in the service adapter rather than the form model. Send the
authenticated subscription only as an untrusted assertion required by the
legacy contract. The backend must compare it with the tenant-scoped existing
record and preserve the persisted value after mapping. A frontend assertion
never authorizes ownership.

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

### Confirmed server-side GET pagination contract

Use server-side pagination for database-backed grids. The browser must request
only the visible page; it must not request an arbitrary large page such as
`pageSize=5000` and then paginate the returned array locally.

The confirmed request shape is:

```text
GET /Entity?pageNo=1&pageSize=10&Filters[search]=term&Filters[branchId]=3
```

`pageNo` and `pageSize` are top-level query parameters. Business filters use
`Filters[key]`. A successful response must contain:

```json
{
  "entities": [],
  "pageNo": 1,
  "pageSize": 10,
  "totalPages": 0,
  "totalCount": 0,
  "isSuccess": true
}
```

`entities.length` is the number of rows in the current page. It is not the
total number of matching records. The paginator must use `totalCount`.

#### Backend implementation

The backend owns filtering, counting, ordering, `Skip`, and `Take`:

```csharp
public override async Task<Results<EntityListVM>> GetManyAsync(
    ListSmBase searchModel)
{
    const int defaultPageSize = 20;
    const int maximumPageSize = 100;

    var pageNo = Math.Max(1, searchModel.PageNo ?? 1);
    var pageSize = Math.Clamp(
        searchModel.PageSize ?? defaultPageSize,
        1,
        maximumPageSize);
    var filters = searchModel.Filters ?? [];

    var query = UnitOfWork.Repository
        .Query<Entity>()
        .AsNoTracking();

    // Apply every filter to this query before CountAsync.
    if (FilterHelper.GetString(filters, "search") is { } search)
    {
        query = query.Where(x =>
            x.Name.Contains(search) ||
            (x.No != null && x.No.Contains(search)));
    }

    var totalCount = await query.CountAsync();
    var totalPages = totalCount == 0
        ? 0
        : (int)Math.Ceiling(totalCount / (double)pageSize);

    // Deleting the final row of the last page must not leave an invalid page.
    pageNo = totalPages == 0
        ? 1
        : Math.Min(pageNo, totalPages);

    var entities = await query
        .OrderByDescending(x => x.Id) // stable, deterministic order
        .Skip((pageNo - 1) * pageSize)
        .Take(pageSize)
        .ProjectTo<EntityListVM>(Mapper.ConfigurationProvider)
        .ToListAsync();

    return new Results<EntityListVM>
    {
        IsSuccess = true,
        Entities = entities,
        PageNo = pageNo,
        PageSize = pageSize,
        TotalPages = totalPages,
        TotalCount = totalCount
    };
}
```

Backend requirements:

- apply subscription and soft-delete rules to the same query used for both
  `CountAsync` and page retrieval;
- apply filters before `CountAsync`;
- calculate `totalCount` before `Skip` and `Take`;
- always assign `TotalCount` in the result wrapper;
- use a stable `OrderBy` before `Skip` and `Take`;
- clamp invalid page numbers, especially after Delete;
- cap normal page size to protect the API from accidental huge requests;
- project directly to the small list DTO;
- do not `Include` the complete aggregate merely to render a grid row;
- use a separate details endpoint for documents, drivers, addresses, billing,
  and other nested data.

##### Required `ListVM` and UI field audit

Treat the paged list response as a purpose-built projection, not a smaller copy
of the entity or details DTO. Before completing a grid or changing its
pagination, compare these four contracts:

1. backend `ListVM` properties;
2. AutoMapper/manual list projection;
3. frontend list DTO and derived grid-row model;
4. visible columns, row-action predicates, status badges, and list exports.

Keep a property in the backend `ListVM` only when the current page needs it for
one of these purposes:

- a visible grid cell;
- a derived visible value, such as `displayName` or `contactNo`;
- a row action, permission, status, or workflow predicate;
- a lightweight list-level export that intentionally uses the same contract.

Delete a `ListVM` property when no list consumer reads it. Also delete its
explicit mapping, unnecessary navigation join/`Include`, and matching frontend
list-DTO property. Unused list fields increase SQL projection width, response
size, serialization work, and the chance that frontend and backend contracts
silently drift apart.

After trimming the `ListVM`, review the complete `GetManyAsync` implementation
again. Remove projection code, navigation joins, `Include` calls, and output
transformations that existed only for deleted response fields. Keep filtering
and ordering on the entity query, then apply `Skip`/`Take`, then
`ProjectTo<ListVM>`. Prefer correlated `Any` for existence filters such as
agreement status instead of loading identifiers into memory. Do not remove a
supported API filter merely because the current grid does not expose it until
all endpoint consumers have been checked.

Apply the rule in the other direction too: every frontend grid column or
derived list property must be supplied by the backend `ListVM`. Delete a UI
column that is not mapped and has no product requirement; do not keep an
optional property and render a permanently empty cell. If the value is
required, add it deliberately to the `ListVM` projection and verify the
generated query.

Do not add documents, credit cards, addresses, drivers, billing collections,
or other heavy nested data to the normal `ListVM` merely because a View dialog
or export needs it:

- View/Edit uses the details endpoint;
- a heavy or compliance-sensitive export uses a dedicated export endpoint or
  export DTO;
- the normal grid request remains a lean, bounded page.

Use a small audit table during implementation:

| Field | Backend `ListVM` | UI consumer | Decision |
|---|---|---|---|
| `No` | Yes | Code column and display name | Keep |
| `ContactGroupId` | Yes | Edit Contact Group row action | Keep |
| `Branch` | Yes | Grid/export display | Keep |
| `Gender` | Yes | None on list screen | Delete from list contract |
| `Documents` | No | View/Edit only | Keep in details contract only |

After removing fields:

- rebuild the backend so `ProjectTo<ListVM>` is validated;
- review and simplify `GetManyAsync` after the projection is reduced;
- run the frontend type check so deleted response properties cannot remain in
  columns or row mapping;
- inspect one real JSON page and confirm there are no unused properties and no
  visible empty columns;
- repeat the audit when adding a new column, action predicate, or export.

If the response contains rows but `totalCount` is zero or null, verify:

1. `TotalCount = totalCount` is assigned in the returned `Results<T>`;
2. `CountAsync` runs before paging;
3. count and page queries use the same filters and tenant scope;
4. the API process was restarted after rebuilding—the running process may
   still have the older DLL loaded.

#### Frontend state and response handling

Keep paging state separate from the current page array:

```typescript
readonly data = signal<EntityListDTO[]>([]);
readonly pageNo = signal(1);
readonly pageSize = signal(10);
readonly totalRecords = signal(0);

private lastListFilter: EntityListFilters = {};
```

Every request sends the current paging state:

```typescript
this.entityService.getList({
  pageNo: this.pageNo(),
  pageSize: this.pageSize(),
  filters: this.lastListFilter,
}).subscribe(response => {
  if (!response.isSuccess) {
    this.data.set([]);
    this.totalRecords.set(0);
    this.syncRemoteTable();
    return;
  }

  this.pageNo.set(Math.max(1, response.pageNo || 1));
  if (response.pageSize > 0) this.pageSize.set(response.pageSize);
  this.totalRecords.set(this.resolveTotalRecords(response));
  this.data.set(response.entities ?? []);
  this.syncRemoteTable();
});
```

Search or a materially different filter resets `pageNo` to `1`. Changing the
paginator requests the selected page. A refresh after Edit keeps the current
page. A refresh after Delete keeps the current page and accepts the backend's
clamped page number.

The normal frontend request must not use a constant such as
`GRID_FETCH_SIZE = 5000`.

#### Shared `table-list` lazy paging

The current shared `table-list` wraps a PrimeNG table but does not expose lazy
paging inputs directly. Until the shared component exposes `[lazy]`,
`[totalRecords]`, `[first]`, `[rows]`, and `(onLazyLoad)`, configure its
internal table once after view initialization:

```typescript
private remoteTableConfigured = false;

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

  table.onLazyLoad
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(event => {
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

Do not subscribe more than once. Repeated subscriptions create duplicate GET
requests whenever the user changes page size or page number.

If a feature uses a native `p-table`, prefer normal template bindings instead
of reaching into the component instance:

```html
<p-table
  [value]="data()"
  [lazy]="true"
  [paginator]="true"
  [first]="(pageNo() - 1) * pageSize()"
  [rows]="pageSize()"
  [totalRecords]="totalRecords()"
  [rowsPerPageOptions]="[10, 25, 50]"
  (onLazyLoad)="onLazyLoad($event)">
</p-table>
```

#### Temporary compatibility when `totalCount` is missing or zero

The backend's real `totalCount` is the source of truth. During a staged
deployment, however, an older running API may return `totalPages` correctly
while returning `totalCount` as null or zero. Do not make inference the normal
contract. Use the fallback only behind an explicitly named compatibility flag,
record the backend version/removal condition, and remove it after deployment:

```typescript
private readonly allowLegacyTotalCountFallback = false;

private resolveTotalRecords(
  response: Results<EntityListDTO>,
): number {
  const entitiesCount = response.entities?.length ?? 0;
  const totalCount = Number(response.totalCount);

  if (Number.isFinite(totalCount) && totalCount >= 0
      && !(totalCount === 0 && entitiesCount > 0)) {
    return totalCount;
  }

  if (!this.allowLegacyTotalCountFallback) {
    throw new Error('Paged list response is missing an exact totalCount.');
  }

  const totalPages = Math.max(0, Number(response.totalPages ?? 0));
  const pageSize = Math.max(
    1,
    Number(response.pageSize || this.pageSize()),
  );
  const pageNo = Math.max(1, Number(response.pageNo || this.pageNo()));

  if (totalPages <= 1) return entitiesCount;

  return pageNo >= totalPages
    ? (totalPages - 1) * pageSize + entitiesCount
    : totalPages * pageSize;
}
```

The inferred count can overstate the real total until the final page is loaded.
Do not display it as an exact result count, use it for export, or leave the
flag permanently enabled. It is not a replacement for fixing and restarting
the backend.

#### Export behavior with server pagination

After server pagination, `data()` contains only the visible page. Export must
not silently change to "export current page" unless the button explicitly says
that.

For normal **Export all filtered rows** behavior:

- keep normal browsing at 10/25/50 rows;
- fetch all matching pages only after the user clicks Export;
- reuse the active filters;
- respect the backend maximum page size;
- combine page results for the export;
- do not change the visible grid page while exporting;
- for very large exports, add a dedicated streaming/background export
  endpoint instead of loading all records into the browser.

Example service helper:

```typescript
getAllList(
  filters: EntityListFilters = {},
): Observable<EntityListDTO[]> {
  const pageSize = 100;
  const requireSuccess = (
    page: Results<EntityListDTO>,
  ): Results<EntityListDTO> => {
    if (!page.isSuccess) {
      throw new Error(page.message || 'Export page request failed.');
    }
    return page;
  };

  return this.getList({ pageNo: 1, pageSize, filters }).pipe(
    map(requireSuccess),
    expand(page => {
      const currentPage = Math.max(1, Number(page.pageNo ?? 1));
      const nextPage = currentPage + 1;
      const totalPages = Math.max(0, Number(page.totalPages ?? 0));

      return nextPage <= totalPages
        ? this.getList({ pageNo: nextPage, pageSize, filters }).pipe(
            map(requireSuccess),
          )
        : EMPTY;
    }),
    reduce(
      (entities, page) => entities.concat(page.entities ?? []),
      [] as EntityListDTO[],
    ),
  );
}
```

Any failed page fails the complete export; never generate a workbook from a
successful prefix of the result set. Disable repeat Export clicks, show
progress/busy state, and support cancellation. Use a dedicated authorized
streaming/background endpoint when the bounded browser export would require
too many rows or too much memory.

#### Pagination verification

Verify the Network tab, not only the paginator UI:

- [ ] Initial GET sends `pageNo=1&pageSize=10`.
- [ ] The response returns at most 10 rows and the exact database
  `totalCount`.
- [ ] Page 2 sends `pageNo=2&pageSize=10`.
- [ ] Page-size 25 sends `pageNo=1&pageSize=25`.
- [ ] Search resets to page 1 and keeps the filter on later pages.
- [ ] Different pages return different stable row sets.
- [ ] An empty result returns `entities=[]`, `totalCount=0`,
  `totalPages=0`, and `pageNo=1`.
- [ ] Delete on the final page returns or reloads the new last valid page.
- [ ] Edit remains on the current page.
- [ ] Export retrieves every filtered page without changing the visible page.
- [ ] No normal grid request uses `pageSize=5000` or another fetch-all value.

Check `isSuccess` before emitting success events. Stop loading indicators on both successful and failed requests.

### Refresh and page behavior

The list must distinguish Create, Update, Delete, Search, View, and Cancel. The post-refresh page depends on the operation and the active stable sort.

| Operation | Refresh grid | Page behavior |
|---|---|---|
| Create | Yes | Show the page that contains the new row |
| Update | Yes | Keep the current page when still valid |
| Delete | Yes | Keep the current page; accept backend clamping |
| Search/filter change | Yes | Reset to page 1 and store the filter |
| View | No | Close only |
| Cancel | No | Close only |

Do not hard-code “go to the last page after Create” in a generic guide. With `OrderByDescending(Id)`, a new row normally appears on page 1. With ascending creation order, it may appear on the last page. Define the strategy from the actual server ordering:

```typescript
type CreatePageStrategy = 'first' | 'last' | 'current';

private readonly createPageStrategy: CreatePageStrategy = 'first';

onEntityChanged(changeType: 'create' | 'update'): void {
  if (changeType === 'create') {
    this.moveToCreateDestination();
  }

  this.getListItems();
}

private moveToCreateDestination(): void {
  if (this.createPageStrategy === 'first') {
    this.pageNo.set(1);
  } else if (this.createPageStrategy === 'last') {
    this.pageNo.set(Math.max(1, this.totalPages()));
  }
}
```

When the create response returns the created id or row, prefer locating the row according to the active sort/filter rather than guessing. If the active filter excludes the new row, keep the current filtered view and show the normal success result.

For Update, preserve the active page and filters:

```typescript
private lastListFilter: EntityListFilters = {};

getListItems(filter?: EntityListFilters): void {
  if (filter !== undefined) {
    this.lastListFilter = filter;
    this.pageNo.set(1);
  }

  this.entityService.getList({
    pageNo: this.pageNo(),
    pageSize: this.pageSize(),
    filters: this.lastListFilter,
  });
}
```

For server-side pagination, the API is the source of truth for `pageNo`, `pageSize`, `totalPages`, and `totalCount`. After Delete, accept the clamped page number returned by the backend. For legacy client-side pagination only, capture and restore the table's `first` index and clamp it to the new array size.

### Refresh and pagination verification

- [ ] Create shows the new row according to the documented stable sort.
- [ ] Update remains on the same page when that page is still valid.
- [ ] Delete of the final row on the last page returns to the new last valid page.
- [ ] Search and material filter changes reset to page 1.
- [ ] Active filters survive Create, Update, and Delete refreshes.
- [ ] View and Cancel do not refresh or change the selected page.
- [ ] The implementation does not mix local-array totals with server `totalCount`.

## 5. Visual, responsive, dark-theme, and menu standards

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

`color_system.md` is the color authority. Consume its semantic values instead
of creating a second feature palette:

```scss
.feature-page {
  --feature-page-bg: #f1f3f7;
  --feature-panel-bg: #fff;
  --feature-border: #dce4eb;
  --feature-muted: #5f7185;
  --feature-text: #34495e;
  --feature-primary: #1478b5;
  --feature-primary-hover: #10699e;
  --feature-focus: #31c4cf;
  --feature-error-text: #b4232d;
  --feature-error-border: #f1b8bd;
  --feature-error-surface: #fff5f5;
  --feature-disabled-bg: #e4e8eb;
  --feature-disabled-text: #5f7185;
  --feature-radius: 2px;
  --feature-shadow: 0 2px 5px rgb(0 0 0 / 8%);
}
```

Prefer global semantic tokens when the application exposes them. A
feature-level alias may clarify ownership, but it must reference the same
approved values and must not redefine validation or theme semantics.

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

### Search controls for simple grids

Column count does not decide search behavior; the data source does.

For a fully loaded in-memory grid, keep exactly one search control: the shared
`Keyboard Search` input rendered by `table-list`. It may use
`gridSearchClear`, because `filterGlobal` receives the complete searchable
list.

Example for a deliberately in-memory grid:

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

For a database-backed server-paged grid, do not use that local input as the
screen search. Render one compact feature-owned keyword form, send its value in
the backend filter contract, reset to page 1, preserve it for subsequent page
requests and Export, and hide the local `.p-datatable-header` caption with the
feature-scoped rule shown earlier. Clearing the server search must issue a new
page-1 request.

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

### Action dropdown portal and table clipping

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

## 6. Advanced nested editors and editable collections

### Reusable grouped editor modal

Use the **Add Company Driver** treatment as the reference pattern when a parent
form contains a complex nested collection item that needs more space than an
editable table row. Suitable examples include drivers, contacts, guarantors,
authorized persons, workshop technicians, or any nested record with identity,
contact, address, notes, and documents.

Reference implementation:
`SiGmaAngularFrontEnd/src/app/modules/Customers/Companies/CompanyPartner/components/detalisForm/drivers/`.

This is an editor for a nested `FormArray` item. Saving the modal commits the
draft to the parent form; it does not call the page API independently. The
parent Add/Edit action persists the complete aggregate later.

#### Interaction and state contract

- Keep the collection summary as a compact table with Edit and Delete icon
  buttons plus one **Add Driver** button below it.
- Open Add and Edit in the same dialog. Change only the title and header icon.
- Create an isolated `driverDraft` (or generic `itemDraft`) when the dialog
  opens. Never bind the modal directly to the existing `FormArray` row.
- On Add success, push the valid draft into the parent `FormArray`.
- On Edit success, replace the row with `setControl(editIndex, draft)`.
- On Cancel or dialog close, discard the draft and reset `editIndex`; the
  original parent row must remain unchanged.
- Disable Add/Edit/Delete when the parent form is disabled in View mode.
- Put general fields in the first tab and nested documents in a second tab.
  Do not display every field and every document row in one continuous surface.
- Invalid Save calls `markAllAsTouched()`, keeps the dialog open, and shows
  field-level errors. It must not partially update the parent form.
- Use backend nullability as the source of required validators. For the Company
  Driver contract, First Name, Middle Name, Last Name, and Mobile No are
  required. Do not wait for an HTTP 400 to reveal a required nested property.

```typescript
type NestedEditorMode = 'add' | 'edit';

draft: FormGroup | null = null;
editIndex: number | null = null;
visible = false;

openAdd(): void {
  this.editIndex = null;
  this.draft = this.createItemForm();
  this.visible = true;
}

openEdit(index: number): void {
  this.editIndex = index;
  this.draft = this.cloneItemForm(this.items.at(index) as FormGroup);
  this.visible = true;
}

saveDraft(): void {
  if (!this.draft) return;

  if (this.draft.invalid) {
    this.draft.markAllAsTouched();
    return;
  }

  if (this.editIndex === null) {
    this.items.push(this.draft);
  } else {
    this.items.setControl(this.editIndex, this.draft);
  }

  this.closeEditor();
}

closeEditor(): void {
  this.visible = false;
  this.draft = null;
  this.editIndex = null;
}
```

When cloning an Edit row, create a new form group and deep-copy nested
`FormArray` values such as documents. `patchValue()` does not create child
array controls, and reusing the original controls makes Cancel behave like
Save.

#### Dialog shell and sizing

Use a wide, viewport-safe dialog. The Add Company Driver reference uses:

- desktop width: `1280px`;
- maximum width: `calc(100vw - 24px)`;
- maximum height: `calc(100dvh - 24px)`;
- width below 1200px: `94vw`;
- width below 768px: `calc(100vw - 16px)`;
- `appendTo="body"` for the dialog and all dropdown/calendar overlays;
- no drag or resize;
- no padding or scrolling on `.p-dialog-content`;
- internal scrolling only in the tab body when content exceeds the available
  height;
- header and footer outside the scrolling body so Close/Save remain visible.

```html
<p-dialog
  [(visible)]="visible"
  [modal]="true"
  appendTo="body"
  styleClass="feature-nested-editor-dialog"
  [draggable]="false"
  [resizable]="false"
  [closeOnEscape]="true"
  [style]="{
    width: '1280px',
    maxWidth: 'calc(100vw - 24px)',
    maxHeight: 'calc(100dvh - 24px)'
  }"
  [breakpoints]="{
    '1199px': '94vw',
    '767px': 'calc(100vw - 16px)'
  }"
  [contentStyle]="{ overflow: 'hidden', padding: '0' }"
  (onHide)="resetDraft()">

  <ng-template pTemplate="header">
    <div class="feature-editor-heading">
      <span class="feature-editor-heading-icon">
        <i class="bi bi-person-plus" aria-hidden="true"></i>
      </span>
      <div>
        <h2>{{ dialogTitleKey() | translate }}</h2>
        <p>{{ dialogDescriptionKey | translate }}</p>
      </div>
    </div>
  </ng-template>

  @if (draft) {
    <div class="feature-editor" [formGroup]="draft">
      <p-tabView styleClass="feature-editor-tabs">
        <!-- Details tab: grouped field cards -->
        <!-- Documents tab: reusable editable documents component -->
      </p-tabView>
    </div>
  }

  <ng-template pTemplate="footer">
    <div class="feature-editor-footer">
      <p class="feature-required-hint">
        <i class="bi bi-info-circle" aria-hidden="true"></i>
        {{ 'companyForm.requiredFieldsHint' | translate }}
      </p>
      <div class="feature-editor-actions">
        <button type="button" class="feature-secondary" (click)="closeEditor()">
          <i class="bi bi-x-lg" aria-hidden="true"></i>
          {{ 'general.cancel' | translate }}
        </button>
        <button type="button" class="feature-primary" (click)="saveDraft()">
          <i class="bi bi-check2-circle" aria-hidden="true"></i>
          {{ 'general.save' | translate }}
        </button>
      </div>
    </div>
  </ng-template>
</p-dialog>
```

Keep the dialog itself fixed within the viewport and make only the tab-panel
body scroll:

```scss
:host ::ng-deep .feature-nested-editor-dialog {
  display: flex;
  max-height: calc(100dvh - 24px);
  flex-direction: column;
  overflow: hidden;
}

:host ::ng-deep .feature-nested-editor-dialog .p-dialog-header,
:host ::ng-deep .feature-nested-editor-dialog .p-dialog-footer {
  flex: 0 0 auto;
}

:host ::ng-deep .feature-nested-editor-dialog .p-dialog-content {
  min-height: 0;
  flex: 1 1 auto;
  overflow: hidden;
}

:host ::ng-deep .feature-nested-editor-dialog .p-tabview-panels {
  max-height: calc(100dvh - 190px);
  overflow: auto;
  overscroll-behavior: contain;
}
```

The header uses a 36 x 36 px tinted icon tile, a 15 px bold title, and a short
10 px helper line. On narrow phones, hide only the helper text; keep the title
and close control visible.

#### Grouped field-card layout

Group fields by user intent instead of rendering one large undifferentiated
form:

| Group | Recommended fields | Desktop columns |
|---|---|---:|
| Identity | first, middle and last name; gender; nationality; birth date | 3 |
| Contact Information | email, mobile, home phone, work phone | 4 |
| Address | address, city, state, zip code, country | 3 |
| Additional Details | notes | 3, with notes spanning 2 |

Each group is a bordered card with:

- 10 px corner radius;
- compact 7 px x 10 px heading padding;
- a 27 x 27 px section icon tile;
- 12 px bold title and 9 px helper text;
- an 8 px x 10 px field-area padding;
- 7 px vertical and 10 px horizontal gaps.

Use data-driven field and group definitions when several sections share the
same rendering rules. A field configuration should own its key, translation
label, control type, required flag, options provider, and validation messages.
A group configuration should own its key, icon, title, description, and list
of field keys. Rebuild translated validation text after language changes, but
keep form values and controls intact.

```scss
.feature-editor-groups {
  display: grid;
  gap: 8px;
}

.feature-editor-group {
  overflow: hidden;
  border: 1px solid var(--feature-border);
  border-radius: 10px;
  background: var(--feature-panel-bg);
}

.feature-editor-group-heading {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-bottom: 1px solid var(--feature-border);
  background: var(--feature-page-bg);
}

.feature-editor-field-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 7px 10px;
  padding: 8px 10px;
}

.feature-editor-field-grid.is-contact-group {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.feature-editor-field.is-wide {
  grid-column: span 2;
}

@media (max-width: 900px) {
  .feature-editor-field-grid,
  .feature-editor-field-grid.is-contact-group {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .feature-editor-field-grid,
  .feature-editor-field-grid.is-contact-group {
    grid-template-columns: minmax(0, 1fr);
  }

  .feature-editor-field.is-wide {
    grid-column: auto;
  }
}
```

#### Compact controls and inline clear action

The reference modal intentionally uses compact controls to prevent page-level
scrolling:

- minimum control height: 34 px;
- field label: 11 px, weight 700, 3 px bottom margin;
- control text: 12 px;
- field error: 10 px, weight 600;
- control radius: 6 px;
- text input horizontal padding: 9 px;
- clear-button reserve: 36 px at the inline end.

Wrap text inputs in a positioned container and center the clear icon vertically.
Set `data-clear-button="off"` when the application has a global text-input
clear directive; otherwise both the global and local buttons will render.
Clear through the reactive control, then mark it dirty and touched.

```html
<div class="feature-text-control" data-clear-button="off">
  <input
    class="form-control"
    [id]="'feature-editor-' + field.name"
    [type]="field.type"
    [formControlName]="field.name" />

  @if (draft.get(field.name)?.value) {
    <button
      type="button"
      class="feature-field-clear"
      (click)="clearField(field.name)"
      [attr.aria-label]="'general.clearField' | translate"
      [title]="'general.clearField' | translate">
      <i class="bi bi-x-lg" aria-hidden="true"></i>
    </button>
  }
</div>
```

Dropdowns must fill the field width, use searchable options for long lists,
and append their panel to `body`. Date controls follow the shared calendar
rules: Date of Birth uses `maxDate="today"`, `dd/mm/yy`, a calendar icon, a
button bar, and the global `sigma-datepicker-panel` popup theme.

#### Footer, theme, accessibility, and reuse checklist

The footer uses `justify-content: space-between`: required-field guidance is on
the inline start and Cancel/Save actions are on the inline end. On screens below
640px, hide the guidance and keep the actions visible. Primary and secondary
buttons use a 33 px minimum height, at least 86-92 px width, icons, uppercase
11 px labels, visible focus rings, and white icon/text on the primary gradient.

Theme every layer, not only the dialog shell:

- dialog header, content, footer, tab navigation, and active tab;
- group surface, group heading, icon tiles, borders, title, and helper text;
- text input, dropdown, calendar, focus, invalid, and disabled states;
- inline clear, Edit/Delete, Cancel/Save, and document actions;
- body-appended dropdown and calendar panels through global theme selectors.

Use logical properties (`margin-inline-start`, `padding-inline-end`,
`inset-inline-end`) so the pattern works in RTL without separate positioning
rules. Every icon-only button needs a translated `title` and `aria-label`.

Before reusing this pattern, verify:

- [ ] Add starts with a clean isolated draft.
- [ ] Edit clones simple fields and every nested document row.
- [ ] Cancel and Escape leave the original row unchanged.
- [ ] Save stays open and focuses/reveals invalid required fields.
- [ ] Add pushes one row; Edit replaces exactly one row.
- [ ] Parent View mode disables all mutating controls.
- [ ] Detail and Documents tabs remain usable in Add, Edit, dark, and RTL modes.
- [ ] Header and footer stay visible while only the dialog body scrolls.
- [ ] Desktop, 900 px, and 640 px layouts render as 3/4, 2, and 1 columns.
- [ ] Dropdown and calendar overlays are not clipped.
- [ ] Only one clear button appears in every text input.
- [ ] No page-level vertical or horizontal scroll is introduced.

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

Mirror the backend DTO validation on every nested row. A collection can be optional while each row, once added, still requires all non-nullable enum, date, and text fields. Mark those columns as required, add matching reactive-form validators, and include them in the clickable validation summary before allowing Save. Preserve numeric enum value `0` with nullish checks (`value ?? null`), not truthy fallbacks (`value || null`), because `0` is usually the first valid enum member. Convert dates and enum values only after the row is valid; do not let ASP.NET model binding become the first validation layer and return an avoidable HTTP 400. Enforce the backend's documented relationship boundary with a form-group validator—for example `expiryDate >= issueDate` or strict `expiryDate > issueDate`—and show the translated error beside the dependent field and in the validation summary.

#### Reusable calendar controls

Use the shared PrimeNG calendar treatment for dates in both editable tables and
normal personal-information fields. Import `CalendarModule` and keep the
form-control value as a `Date`, but distinguish date-only business values from
timestamps.

For a backend `yyyy-MM-dd` date-only value, parse local calendar components and
serialize the same local components. Do not use `new Date('yyyy-MM-dd')` or
`toISOString()`, because UTC conversion can change the calendar day:

```typescript
function parseDateOnly(value: string | null | undefined): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? '');
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return date.getFullYear() === Number(match[1])
    && date.getMonth() === Number(match[2]) - 1
    && date.getDate() === Number(match[3])
      ? date
      : null;
}

function toDateOnly(value: Date | null): string | null {
  if (!value || Number.isNaN(value.getTime())) return null;
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
```

Use ISO UTC serialization only for backend timestamp fields whose contract
explicitly includes time and timezone.

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
- derive the exact boundary from the backend contract: for strict
  `expiryDate > issueDate`, use the next calendar day; for inclusive
  `expiryDate >= issueDate`, allow the same day. The picker aid and group
  validator must implement the same rule.

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
- enforce size and extension before upload for early feedback, while treating
  client checks as non-security hints;
- require the backend to validate authorization, tenant/parent ownership,
  maximum size, allowed extension, MIME type, and file signature;
- use server-generated storage names and never trust a browser path;
- define replacement, failed-parent-save, orphan cleanup, remove, and permanent
  delete behavior;
- keep existing stored files unchanged when Edit submits no replacement.

For payment-card rows, collect CVV only when it is required for immediate
payment authorization. Use a masked field and the appropriate browser hints,
but never persist CVV after authorization—even encrypted—and never include it
in models returned for Edit/View, logs, exports, routes, query strings, toast
messages, analytics, or debug output. Prefer a payment-provider token instead
of storing card data. Other cardholder data may be persisted only under an
approved backend contract and security policy.

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

## 7. Routing, translation, and accessibility

### Translation and accessibility

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

### Routes and standalone details

Typical routes are:

```typescript
export const routes: Routes = [
  { path: '', component: EntityListComponent },
  { path: 'details/:id', component: EntityDetailsComponent },
];
```

Do not register a normal `create` route: Add opens the create modal from the grid. The optional `details/:id` route is only for an explicitly required direct link, browser refresh, or deep-link workflow; View and Edit actions in the grid still open the shared modal. If a standalone details route is retained, verify that the details component works with and without `embedded=true`.

## 8. Testing, delivery, and maintenance

### Testing checklist

At minimum, test:

#### Grid

- initial load;
- empty result;
- search/filter;
- search filter preserved after update;
- action menu on the first row;
- action menu on the last row;
- action menu with exactly one row;
- page restoration after update;
- navigation to the page that contains the newly created row, according to the active sort.

#### Details

- Add opens an empty enabled form;
- View loads and disables the form;
- Edit loads and enables the form;
- View does not show Save, Update, or Delete;
- Edit shows Save and does not show Update or Delete;
- invalid Save marks controls touched, keeps the modal open, and sends no request;
- Save is disabled only while a request is running or in View mode;
- Save sends POST in Add;
- Save sends PUT in Edit;
- successful save closes the modal and refreshes the grid;
- failed save leaves the form open and stops the spinner;
- cancel does not call the API.

#### Layout

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

### Refactoring workflow

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

### Common failure symptoms

| Symptom | Likely cause | Fix |
|---|---|---|
| Save stays disabled | `saving()` never reset, View mode is active, or a shared button forces disabled | Reset request state in `finalize()`, verify mode, and inspect the rendered `disabled` attribute |
| Save state is unclear | Loading/disabled styles are missing or overridden | Add explicit request-running and View-mode styles |
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
| Grid loads 10 rows but shows only one page | `totalCount` is missing/zero or the table is still using local pagination | Return `TotalCount`, enable lazy paging, sync `totalRecords`, and use the documented compatibility fallback during deployment |
| Response has rows but `totalCount` is zero | Count is calculated after paging, not assigned to the wrapper, or an old API DLL is still running | Count the filtered query before `Skip`/`Take`, assign `TotalCount`, rebuild, and restart the API process |
| Every paginator page shows the same rows | Frontend always sends page 1 or backend does not apply `Skip`/`Take` | Send the current `pageNo`/`pageSize` and page the stably ordered backend query |
| GET loads hundreds or thousands of rows | Frontend uses a fetch-all page size and paginates locally | Request only the visible page and reserve multi-page retrieval for explicit Export |
| Export contains only the current page | Export maps the grid's paged `data()` signal | Retrieve all filtered pages on demand or use a dedicated export endpoint |
| Paginator sends duplicate GET requests | Lazy-load handler was subscribed more than once | Configure the remote table once and guard the subscription |
| List response contains fields the grid never reads | `ListVM` was copied from the entity/details model or was not re-audited after UI changes | Delete unused `ListVM`, projection, and frontend list-DTO properties |
| Grid column is always empty | The frontend column/property is absent from the backend `ListVM` projection | Delete the unsupported column or deliberately add and map the required field |
| Nested editor Cancel changes the saved row | The modal edits the original `FormGroup` or reuses nested `FormArray` controls | Edit an isolated deep-cloned draft and commit it only from modal Save |
| Nested editor shows two clear icons | The local clear button and global text-input clear directive are both active | Set `data-clear-button="off"` on the locally managed input wrapper |
| Nested editor footer disappears | The whole dialog or page scrolls instead of only the dialog body | Keep header/footer outside the scrolling tab body and cap the dialog with `100dvh` |

### Definition of done

A generic grid screen is ready when:

- list, details, models, and service responsibilities are separate;
- the grid displays typed data and supports search;
- row actions work for first, middle, last, and one-row cases;
- compact CRUD forms share one dialog/details component; multi-step forms use
  the explicit full-page routes defined by the step-form guide;
- the form uses CSS Grid on desktop and one column on mobile;
- fully loaded in-memory grids may use one built-in local Search input;
- server-paged grids use one backend search/filter experience and suppress the
  page-local table-header Keyboard Search;
- View is read-only and Edit uses Save for PUT;
- invalid Save reveals validation, keeps the modal open, and sends no request;
- Add refreshes to the page containing the new row, based on the active stable sort;
- Update refreshes without leaving the current page;
- the active filter survives Update;
- actions support any number of menu items;
- dependent actions correctly reflect row state, permissions, and previous action results;
- the screen has one title owner and no unnecessary page-level vertical scroll;
- dark mode covers the page, panel, filters, table, paginator, menus, and dialogs without isolated light surfaces;
- no server-paged grid presents PrimeNG `filterGlobal` as a database-wide search;
- API requests match backend parameter names and wrappers;
- database grids use server-side GET pagination and never fetch thousands of rows for normal browsing;
- backend list responses return `pageNo`, `pageSize`, `totalPages`, and an exact `totalCount`;
- backend `ListVM` projections contain only fields consumed by the grid, list actions, status rules, or intentional list exports, and every visible UI column is mapped;
- frontend lazy paging uses `totalCount`, sends the selected page, and resets to page 1 for a new search;
- exports intentionally retrieve all filtered pages without changing the visible grid page;
- complex nested collection items reuse the grouped editor modal pattern with isolated drafts, internal scrolling, fixed actions, responsive field groups, and complete dark/RTL states;
- page, table, modal, form, button, menu, responsive, RTL, focus, and disabled styles are scoped and consistent;
- translations, accessibility, RTL, and loading/error states are handled;
- owner-run TypeScript validation and affected feature tests pass, when the
  owner supplies that evidence.
