# Location Grid Screen Guide

This document is the implementation guide for the Location screen and for any future CRUD screen that should use the same pattern.

The pattern is:

```text
Page heading + Add button
        |
Searchable table/grid + row action menu
        |
PrimeNG dialog
        |
Reusable reactive-form details component
```

The current implementation is in:

`SiGmaAngularFrontEnd/src/app/modules/Limousine/Location`

The backend contract is documented in:

`SigmaBackend/UserStories/LocationService_UserStory.md`

## 1. Module structure

```text
Location/
├── components/
│   ├── list/
│   │   ├── list.component.ts       # grid state, actions, dialog state, refresh
│   │   ├── list.component.html     # page, table-list, dialog
│   │   ├── list.component.scss     # page/table/action-menu layout
│   │   └── list.component.spec.ts
│   └── details/
│       ├── details.component.ts    # form, load, search, create/update
│       ├── details.component.html  # modal form and buttons
│       ├── details.component.scss  # CSS Grid form layout
│       └── details.component.spec.ts
├── models/
│   ├── list.ts                     # grid response and list query
│   ├── details.ts                  # view/edit response
│   ├── create.ts                   # create/update request DTOs
│   └── SearchGoogleLocation.ts     # place-search response/query DTOs
├── services/
│   └── location.service.ts         # typed HTTP contract
├── location.routes.ts
└── docs/
    └── LOCATION_GRID_SCREEN_GUIDE.md
```

Keep the list and details components separate. The list owns the grid and dialog; the details component owns the form and save operation. The details component communicates back through events instead of directly refreshing the grid.

## 2. Screen responsibilities

### List component

`list.component.ts` should own:

- the grid rows and columns;
- the current search/filter;
- row actions such as View and Edit;
- dialog visibility, mode, and selected id;
- table page restoration after an update;
- navigation to the last page after an add;
- refreshing the grid after the details component emits a successful change.

### Details component

`details.component.ts` should own:

- the reactive form;
- create, view, and edit mode;
- loading the selected record;
- autocomplete/search behavior;
- validation and Save button state;
- choosing POST or PUT;
- emitting `create` or `update` after success;
- closing the dialog after the save completes.

Do not make the grid reach into the details form to read values. Do not make the details component mutate the grid array directly.

## 3. List page composition

The list template uses the shared action template and `ms-lib` table component:

```html
<section class="locations-page">
  <div class="locations-heading">
    <div>
      <h1>{{ 'location.title' | translate }}</h1>
    </div>

    <button type="button" class="add-location" (click)="goCreate()">
      <i class="bi bi-plus-lg"></i>
      {{ 'location.addNew' | translate }}
    </button>
  </div>

  <div class="locations-table-panel">
    <app-action-button
      [moreActions]="moreActions()"
      (SendActionTemplate)="setActionTemplate($event)">
    </app-action-button>

    <table-list
      #locationTable
      [columns]="columns()"
      [list]="data()"
      [hasCreate]="false"
      [hasCustomSearch]="false"
      [hasDeleteList]="false"
      (clickSearch)="search($event)">
    </table-list>
  </div>
</section>
```

The first grid column is a template column named `actions`. Its template comes from `ActionButtonComponent`:

```typescript
this.columns.set([
  {
    colName: 'actions',
    displayName: 'general.actions',
    type: ColType.template,
    celTemp: this.actionTemplate,
    isShowSearch: false,
  },
  { colName: 'shortName', displayName: 'location.shortName' },
  { colName: 'detail', displayName: 'location.detail' },
]);
```

The row action list should contain only actions that are allowed by the screen:

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

## 4. Dialog and mode state

Use one dialog and one details component for all three modes:

```typescript
visible = signal(false);
modalMode = signal<'create' | 'view' | 'edit'>('create');
selectedLocationId = signal<string | null>(null);
```

State transitions:

| User action | Mode | Selected id | Form behavior |
|---|---|---:|---|
| Add | `create` | `null` | Empty and enabled |
| View | `view` | Row id | Load then disable |
| Edit | `edit` | Row id | Load then enable |

Use an `@if (visible())` around the details component. This recreates the form when the dialog opens and prevents stale values from a previous record:

```html
@if (visible()) {
  <app-location-details
    [embedded]="true"
    [embeddedMode]="modalMode()"
    [recordId]="selectedLocationId()"
    (changed)="onLocationChanged($event)"
    (closed)="closeDialog()">
  </app-location-details>
}
```

The dialog should use `appendTo="body"`, a high `baseZIndex`, and a fixed maximum width so autocomplete lists and modal content are not clipped by the page container.

## 5. Details form and CSS Grid layout

The modal form contains exactly three editable fields:

1. `searchGoogleLocations`
2. `shortName`
3. `detail`

Use a CSS Grid wrapper for the desktop layout:

```scss
.location-modal-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 30px;
  row-gap: 0;
}

.location-search-field {
  grid-column: 1 / -1;
  grid-row: 1;
}

.location-short-field {
  grid-column: 1;
  grid-row: 2;
}

.location-detail-label {
  grid-column: 2;
  grid-row: 2;
}

.location-detail-field {
  grid-column: 1 / -1;
  grid-row: 3;
}
```

This produces:

```text
┌──────────────────────────────────────────┐
│ Search Location                           │  row 1
├──────────────────────┬───────────────────┤
│ Short Name            │ Detail label      │  row 2
├──────────────────────┴───────────────────┤
│ Detail textarea                           │  row 3
└──────────────────────────────────────────┘
```

The Search Location field must remain the only item in row 1. Do not assign `grid-row: 1` to Short Name in View/Edit mode because that makes it overlap the full-width search field.

For small screens, switch to one column:

```scss
@media (max-width: 650px) {
  .location-modal-fields {
    display: block;
  }
}
```

Do not use `position: absolute` for the form fields. Absolute positioning breaks when translations, validation messages, or a longer address changes the content height.

## 6. Reactive form rules

The HTML `required` attribute is not enough for an Angular reactive form. Add validators in `FormBuilder`:

```typescript
this.locationForm = this.fb.group({
  searchGoogleLocations: [
    { value: '', disabled: !this.isCreateMode() },
    [Validators.required, Validators.maxLength(300)],
  ],
  shortName: [
    { value: '', disabled: !this.isCreateMode() },
    [Validators.required, Validators.maxLength(100)],
  ],
  detail: [
    { value: '', disabled: !this.isCreateMode() },
    [Validators.required, Validators.maxLength(500)],
  ],
});
```

Mode rules:

- Create starts enabled.
- View loads the record and disables the form.
- Edit loads the record and enables the form.
- Use `getRawValue()` when saving so a disabled field is not accidentally omitted.
- If View must not allow changes, do not show Save in View mode.
- Edit must not show separate Update or Delete header buttons. Use the Save button for PUT.

The Save button should be disabled while invalid or saving:

```html
<button
  type="button"
  class="location-save-button"
  [disabled]="locationForm.invalid || saving()"
  (click)="onButtonClick('btn-save')">
  {{ 'general.save' | translate }}
</button>
```

The disabled CSS state must be explicit. Otherwise Bootstrap or a shared button style can make an enabled and disabled button look identical:

```scss
.location-save-button {
  color: #fff;
  background: #71b8e2;
  border-color: #71b8e2 !important;
}

.location-save-button:disabled {
  color: #9aa3aa;
  background: #e4e8eb;
  border-color: #d2d8dd !important;
  cursor: not-allowed;
  opacity: 1;
}
```

## 7. Place search/autocomplete

The backend endpoint is:

```text
GET /Location/SearchPlaces?searchKey={text}&lat={lat}&lng={lng}
```

The current service uses typed DTOs:

```typescript
export interface LocationSearchDTO {
  shortName: string;
  longName: string;
  placeId: string;
  longitude: number;
  latitude: number;
}
```

Use a debounced RxJS pipeline:

```typescript
this.searchInput$
  .pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(searchKey => {
      if (searchKey.length < 2) {
        this.searchSuggestions.set([]);
        return of(null);
      }

      this.searchingPlaces.set(true);
      return this.locationService.searchPlaces({ searchKey }).pipe(
        catchError(() => of(null)),
        finalize(() => this.searchingPlaces.set(false)),
      );
    }),
    takeUntilDestroyed(this.destroyRef),
  )
  .subscribe(response => {
    this.searchSuggestions.set(response?.isSuccess ? response.entities : []);
  });
```

On selection:

- put the short address into `searchGoogleLocations`;
- put the display name into `shortName`;
- put the full address and coordinates into `detail`;
- keep `detail` within 500 characters;
- close the suggestions list.

The backend recognizes coordinates in this detail marker:

```text
Lat/Lng: 25.2048, 55.2708
```

Use an absolutely positioned suggestions panel only inside `.location-input-with-arrow`, not against the whole page. Give it a local `z-index` and ensure the dialog is appended to `body`.

## 8. Save flow

Save must choose the endpoint from the mode, not from a separate Update button:

```typescript
const data = this.locationForm.getRawValue() as LocationCreateDTO;

const request$ = this.isCreateMode()
  ? this.locationService.createLocation(data)
  : this.locationService.updateLocation({
      ...data,
      id: this.id(),
      subscriptionId: this.subscriptionId,
    });
```

On success:

1. emit `create` for POST or `update` for PUT;
2. close the embedded dialog;
3. stop loading and saving states.

The event type is important because Add and Edit have different grid pagination behavior:

```typescript
@Output() changed = new EventEmitter<'create' | 'update'>();

this.changed.emit(this.isCreateMode() ? 'create' : 'update');
```

## 9. Refresh and pagination behavior

The list stores the last filter and restores the current page after an update:

```typescript
onLocationChanged(changeType: 'create' | 'update'): void {
  this.getListItems(
    undefined,
    changeType === 'create',  // Add: move to last page
    changeType === 'update',  // Edit: restore current page
  );
}
```

Required behavior:

| Operation | Refresh | Page behavior |
|---|---|---|
| Add | Yes | Navigate to last page |
| Update | Yes | Stay on current page |
| Search | Yes | Store and reuse current filter |
| View | No | Close only |
| Cancel | No | Close only |

The current implementation uses `tableList.dt.first` and `tableList.dt.rows` to restore the page. If the backend is changed to real server-side pagination, replace this client-side calculation with the response `pageNo`, `pageSize`, and `totalPages`.

Do not refresh the grid by mutating one row in place unless the table library requires it. A service refresh keeps server-normalized values, generated ids, coordinates, and audit fields correct.

## 10. Action dropdown and the one-row case

The shared `ActionButtonComponent` provides a Bootstrap dropdown template. The Location table must allow the dropdown to escape the table's clipping containers:

```scss
.locations-table-panel,
:host ::ng-deep .locations-table-panel .p-datatable-wrapper,
:host ::ng-deep .locations-table-panel .p-datatable-tbody,
:host ::ng-deep .locations-table-panel .p-datatable-tbody > tr,
:host ::ng-deep .locations-table-panel .p-datatable-tbody > tr > td {
  overflow: visible !important;
}

:host ::ng-deep .locations-table-panel .dropdown {
  position: relative;
  z-index: 1000;
}

:host ::ng-deep .locations-table-panel .dropdown-menu {
  z-index: 1100;
}
```

For a single row or the last row, open the menu above the button so it is not hidden by the paginator or table boundary:

```scss
:host ::ng-deep .locations-table-panel .dropdown-menu.show {
  top: auto !important;
  right: 0 !important;
  bottom: calc(100% + 4px) !important;
  left: auto !important;
  margin: 0 !important;
  transform: none !important;
}
```

If a future screen needs automatic placement instead, use Bootstrap/Popper placement and a viewport boundary rather than copying fixed offsets. Test the first row, middle row, last row, and one-row table.

## 11. HTTP model and service contract

Keep API models separate by operation:

```typescript
export interface LocationCreateDTO {
  searchGoogleLocations: string;
  shortName: string;
  detail: string;
}

export interface LocationUpdateDTO extends LocationCreateDTO {
  id: number;
  subscriptionId: number;
  no?: string | null;
}

export interface LocationListQuery {
  pageNo?: number;
  pageSize?: number;
  filters?: Record<string, string | number | boolean>;
}
```

The list service must serialize filters and pagination separately:

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

Do not pass `{ pageNo, pageSize }` through a generic `BaseService.get(object)` if that service serializes every property as `Filters[key]`. That produces the wrong wire format.

Expected operations:

| Operation | Method | Route | Payload |
|---|---|---|---|
| List | GET | `/Location` | `Filters[key]`, top-level `pageNo/pageSize` |
| Create | POST | `/Location` | Three form fields |
| Details | GET | `/Location/GetByWithNavigationsId/{id}` | None |
| Update | PUT | `/Location` | Three fields + `id` + `subscriptionId` |
| Delete | DELETE | `/Location?id={id}` | Query id |
| Place search | GET | `/Location/SearchPlaces` | `searchKey`, optional coordinates |

Always check `res.isSuccess` and use the shared result wrapper. Stop loading indicators on both success and error.

## 12. Translation and accessibility

Use translation keys in templates rather than hard-coded labels:

- `location.title`
- `location.manageLocations`
- `location.addNew`
- `location.searchGoogleLocationsId`
- `location.shortName`
- `location.detail`
- `general.actions`
- `general.viewDetails`
- `general.edit`
- `general.save`
- `general.cancel`

Every input needs a matching `label` and `id`. Autocomplete suggestions should use `role="listbox"`, each option should use `role="option"`, and the loading state should be exposed through `aria-busy`.

When adding RTL support, mirror the search icon and input padding through `:host-context([dir='rtl'])`; do not duplicate the whole form layout.

## 13. Routes

The current route definitions are:

```typescript
{
  path: '', component: LocationsComponent
},
{
  path: 'details/:id', component: LocationDetailsComponent
},
{
  path: 'create', component: LocationDetailsComponent
}
```

The list currently uses the embedded dialog flow. Keep standalone routes only if direct navigation is required. If standalone details are retained, confirm that Save/Cancel and loading behavior work without `embedded=true`.

## 14. Refactoring checklist

### Before editing

- Read the backend user story and controller/service contract.
- Inspect the shared table, action-button, buttons, and result-wrapper components.
- Confirm the actual JSON property names and response wrapper.
- Identify whether pagination is server-side or client-side.
- Record the required create, view, edit, and delete behavior.

### During implementation

- Keep list, details, models, and service responsibilities separate.
- Use typed DTOs for every endpoint.
- Use one details form with explicit `create`, `view`, and `edit` modes.
- Use CSS Grid for the desktop form and a one-column mobile fallback.
- Keep Search Location in row 1 and do not create conflicting grid row assignments.
- Use Save for both POST and PUT; do not add a separate Update button in Edit mode.
- Emit the operation type so the list can apply the correct pagination behavior.
- Preserve the active filter and page after an update.
- Make the action menu visible for one-row and last-row tables.
- Add `maxlength` in the template and `Validators.maxLength` in the form.

### After implementation

- Run `npm.cmd exec -- tsc --noEmit --project tsconfig.app.json`.
- Test Add, View, Edit, Cancel, Save-invalid, Save-valid, and autocomplete selection.
- Test update while on page 1, a middle page, and the last page.
- Test add when the new record creates a new page.
- Test the action dropdown with one row and with the last row.
- Test desktop, narrow mobile, and RTL layouts.
- Check that the Save button changes color between disabled and enabled states.

## 15. Current module caveats

These points should be addressed when using this module as a template:

- `SearchGoogleLocation.ts` is a legacy filename; the endpoint is `SearchPlaces` and uses OpenStreetMap/Photon-style results. Rename the file only if all imports are updated together.
- The list and details spec files currently reference unrelated example components. Replace them with tests for `LocationsComponent` and `LocationDetailsComponent` before relying on the specs.
- `Renderer2` is imported by the list component but is not used; remove unused imports during cleanup.
- The current `LocationDTO` contains optional compatibility fields `value` and `name`. Keep them only while older consumers need them; the Location list API does not return those fields.
- Delete functionality can remain in the service for future use, but do not expose a Delete button in View/Edit unless the product requirement explicitly asks for it.
- The current dropdown placement is Location-specific. A shared action-button improvement should be evaluated separately because changing it can affect every grid using the shared component.

## 16. Definition of done

A screen built from this guide is complete when:

- the grid loads typed rows and supports search;
- the first column action menu works for every row, including one-row tables;
- Add opens an empty modal with Search Location in the first row;
- View loads and disables the form without Update/Delete buttons;
- Edit loads and enables the form without Update/Delete buttons;
- Save performs POST in Create and PUT in Edit;
- invalid fields keep Save disabled and show the correct visual state;
- successful Add moves to the last page;
- successful Update refreshes without leaving the current page;
- the active search/filter is preserved after Update;
- the modal closes only after a successful save or cancel;
- TypeScript validation passes.
