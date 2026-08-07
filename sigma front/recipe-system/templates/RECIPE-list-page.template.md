# RECIPE: Sigma List Page

Use this packet for a routed Angular list page and its direct list, filter, and
ListVM contract. It does not cover a step editor, child dialog, settings screen,
financial aggregate, or report-shaped response.

## Canonical provenance

This packet is generated from the following source-block fingerprints:

{{SOURCE_FINGERPRINTS}}

Approved implementation reference:

{{APPROVED_REFERENCES}}

The Master Guide and canonical pattern books are authoritative. When the
reference conflicts with this packet, follow this packet. When this packet
conflicts with a canonical source block, stop and report recipe drift.

## Functional evidence gate

Screenshots provide functional and content evidence only. They may establish
visible columns, filters, labels, actions in the captured state, and information
grouping. They do not select layout, Grid implementation, controls, buttons,
icons, spacing, pagination, validation presentation, accessibility, RTL, theme,
or responsive behavior.

Before resolving `{{GridColumns}}` or `{{FilterProperties}}`:

1. Classify screenshot evidence as Explicit, Strong inference, or Uncertain.
2. Do not treat one screenshot as an exhaustive column or action list.
3. Match each visible value to a confirmed frontend and backend field.
4. Mark an unsupported value Missing and identify the exact contract required.
5. Do not implement Uncertain evidence or invent a backend property.

Required evidence table when screenshots are supplied:

| Evidence | Classification | Required feature behavior | Owning phase | Guide-compliant implementation |
|---|---|---|---|---|
| | | | | |

Required Grid evidence table:

| Visible label | Proposed field | Source DTO field | Display transformation | Filterable | Sortable | Exported | Confidence |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

## Required task inputs

Resolve every value before editing source:

| Placeholder | Meaning |
|---|---|
| `{{Feature}}` | PascalCase feature name used by classes and DTOs |
| `{{feature}}` | camelCase feature name used by variables |
| `{{feature-kebab}}` | kebab-case prefix used by CSS classes |
| `{{FeatureRoute}}` | lazy route segment |
| `{{Controller}}` | backend controller name passed to the service |
| `{{GridColumns}}` | exact displayed columns in order, excluding Actions |
| `{{ListRowProperties}}` | typed DTO properties required by the grid and row actions |
| `{{FilterProperties}}` | typed filters and their exact backend key casing |
| `{{SearchFields}}` | persisted fields searched by a combined search filter |
| `{{RowActionState}}` | minimum state needed by View, Edit, Delete, or other row actions |

Record these decisions:

1. List-only page or list plus dialog editor.
2. Exact grid columns, with Actions first.
3. Exact filters and default values.
4. Server paging or intentionally unpaged data.
5. Row actions and state-based visibility or disabled rules.
6. Whether export is required.
7. Whether the list endpoint already satisfies the contract or needs a scoped
   backend change.

Do not invent permissions. Sigma currently has authentication but no frontend
authorization service. A hidden button is not a security boundary.

## Step 1: Establish scope and reference

Inspect only:

- the requested feature folder;
- its route entry, service, models, translations, and direct backend list
  contract;
- the approved Fleet list reference for list layout and behavior;
- shared components directly invoked by the feature.

Do not modify the reference module. Preserve unrelated working-tree changes.

For a list-only or dialog-editor feature, the feature routes file contains only:

```ts
export const {{Feature}}_Routes: Routes = [
  { path: '', component: {{Feature}}Component },
];
```

Add create, view, and edit routes only when the editor is a routed page.

## Step 2: Freeze the grid and ListVM contract

Write the two lists beside each other before implementation:

| Grid column or action need | Frontend property | Backend ListVM property |
|---|---|---|
| Identity | `id` | `Id` |
| `{{GridColumns}}` | `{{ListRowProperties}}` | matching typed properties |
| `{{RowActionState}}` | matching typed properties | matching typed properties |

The ListVM contains only:

- identity;
- displayed grid values;
- state genuinely required by a row action.

Move editor-only values to the Detail DTO. Do not add export-only, dropdown-only,
tenant, audit, GUID, delete, approval, or calculated write values to the list
contract.

Frontend model shape:

```ts
export interface {{Feature}}ListDTO {
  id: number;
  {{ListRowProperties}}
}

export interface {{Feature}}ListFilters {
  {{FilterProperties}}
}

export interface {{Feature}}ListQuery {
  pageNo: number;
  pageSize: number;
  filters?: {{Feature}}ListFilters;
}
```

All placeholders above must be replaced with real typed properties. Do not leave
a placeholder, `any`, `unknown`, or duplicate compatibility alias in finished
source.

## Step 3: Implement the typed service call

The service extends `BaseService`, passes the controller once, and exposes a
typed list method only when the inherited method cannot express the required
pagination contract.

```ts
@Injectable({ providedIn: 'root' })
export class {{Feature}}Service extends BaseService {
  constructor() {
    super('{{Controller}}');
  }

  getList(query: {{Feature}}ListQuery): Observable<Results<{{Feature}}ListDTO>> {
    let params = new HttpParams()
      .set('pageNo', String(query.pageNo))
      .set('pageSize', String(query.pageSize));

    Object.entries(query.filters ?? {}).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(`Filters[${key}]`, String(value));
      }
    });

    return this.http.get<Results<{{Feature}}ListDTO>>(
      `${this.baseUrl}{{Controller}}`,
      { params },
    );
  }
}
```

Register the service in `LayoutModule.providers` while Sigma still owns the
interceptor-equipped `HttpClient` in that child injector.

Filter keys are case-sensitive on the backend list contract. The Angular key,
backend `FilterHelper` key, and task contract must use identical casing.

## Step 4: Build page state

The list component owns these typed states:

```ts
readonly data = signal<{{Feature}}ListDTO[]>([]);
readonly columns = signal<ListCol[]>([]);
readonly moreActions = signal<ActionList[]>([]);
readonly loadingList = signal(false);
readonly deletingId = signal<number | null>(null);
readonly pageNo = signal(1);
readonly pageSize = signal(20);
readonly totalRecords = signal(0);
readonly searchForm = this.fb.nonNullable.group({
  {{FilterProperties}}
});
```

Use feature-prefixed names for additional dialog or selection state. Do not put
feature state in a shared singleton.

## Step 5: Serialize list requests

Search, paging, refresh, dialog completion, and post-delete refresh all enter one
request stream. `switchMap` cancels an earlier request before a newer request can
overwrite the grid.

```ts
private readonly listRequests = new Subject<void>();

private connectListRequests(): void {
  this.listRequests
    .pipe(
      switchMap(() =>
        defer(() => {
          this.loadingList.set(true);
          this.loading.startLoading();

          return this.{{feature}}Service.getList({
            pageNo: this.pageNo(),
            pageSize: this.pageSize(),
            filters: this.buildFilters(),
          }).pipe(
            catchError(() => {
              this.clearGrid();
              this.showError('{{feature}}.errors.list');
              return EMPTY;
            }),
            finalize(() => {
              this.loadingList.set(false);
              this.syncRemoteTable();
              this.loading.endLoading();
            }),
          );
        }),
      ),
      takeUntilDestroyed(this.destroyRef),
    )
    .subscribe((result) => this.applyListResult(result));
}
```

Check both failure channels:

1. Transport failure in `catchError` or the subscription error callback.
2. Business failure where `isSuccess` is false.

Every request releases local and global loading state through `finalize`.

## Step 6: Apply the server response

For a successful response:

- assign `entities ?? []`;
- assign exact `totalCount` returned by the backend;
- retain server `pageNo` and `pageSize` when valid;
- synchronize the shared table's `first`, `rows`, `totalRecords`, and `loading`;
- if deleting the last row moved the page past the end, decrement once and
  request the list again.

An empty list is successful and displays the shared empty state. It is not an
error toast.

Never reconstruct `totalCount` from `totalPages * pageSize`.

## Step 7: Define columns and row actions

Columns are initialized in this order:

1. Actions template.
2. `{{GridColumns}}` in the visual order required by the task.

Every `displayName` is a translation key. A derived display value is added when
the response is applied, not recomputed inside the template.

The action template arrives after view initialization. When
`setActionTemplate()` receives it, rebuild the columns so the Actions cell gets
the real template.

Each action:

- uses a typed `{{Feature}}ListDTO` parameter;
- has a translated title and standard Bootstrap icon;
- disables while its own mutation is running;
- uses row-state visibility only when the state exists in the ListVM;
- delegates Delete to the shared confirmation service.

## Step 8: Build the page template

The template order is fixed:

1. Feature page and panel shell.
2. `app-feature-title` with icon, translated title, translated subtitle, and
   Create in its action slot.
3. Real filter `<form>` whose Search button is `type="submit"`.
4. Clear button that resets filters and requests page one.
5. `app-action-button` template source.
6. One `table-list` instance.
7. Dialog editors after the page shell when the selected editor shape is a
   dialog.

Every label uses `for` matched to the control's `id` or `inputId`. Dropdown and
calendar overlays use `appendTo="body"` and their approved panel style class.

Do not add a second paginator outside `table-list`.

Finding the `<table-list>` tag is not enough. Verify all three integration
layers before continuing:

| Layer | Required evidence |
|---|---|
| Template | Feature-prefixed grid wrapper containing `app-action-button` and exactly one `table-list`; package controls disabled where feature controls replace them |
| TypeScript | `TableListComponent` import, `@ViewChild`, one guarded lazy-load subscription, page conversion and API `totalRecords` synchronization |
| SCSS | Feature-prefixed package-boundary selectors for the card/header, wrapper/table/cells, action control/dropdown and paginator |

When the page supplies its own search or filters, hide the package
`.p-datatable-header` so `Keyboard Search` is not rendered as a second search
interface. Keep the package-owned paginator and never replace its total with
`rows.length`.

## Step 9: Implement delete safely

Delete always uses `ConfirmationDialogService`. Include:

- translated title, message, warning, confirm, and cancel labels;
- the record name and useful secondary text;
- the standard trash icon;
- mutation only after the observable emits `true`.

While deletion runs, disable row actions. On success, show a success toast and
refresh the current valid page. On business or transport failure, keep the row
and show an actionable error.

The backend must check all inbound references before soft delete. Each blocker
gets a specific safe message. Do not add manual tenant predicates to repository
queries; repository scope owns tenant and soft-delete filtering.

## Step 10: Implement export only when required

Export uses the current filters and retrieves every filtered row. It does not
export only the visible page. Translate column headers, preserve the grid's value
formatting rules, and fail the whole export if any page fails.

If export is not in the task, omit the export action and its code completely.

## Step 11: Own feature styling

The feature owns its SCSS and class prefix `{{feature-kebab}}-*`.

Required states:

- light theme;
- dark theme using `:host-context` for ordinary component content;
- RTL using logical properties such as `margin-inline-start`;
- narrow viewport without horizontal page overflow;
- disabled, focus-visible, loading, and empty states.

Body-appended overlay shell styles belong in global `src/styles.scss`, scoped by
one unique overlay `styleClass`. Content that remains part of the component
template stays in component SCSS. Do not use another feature's stylesheet or CSS
prefix.

Solid action buttons explicitly set both text and icon color to white.

The minimum `table-list` selector inventory under the feature grid prefix is:

- `.card` when the feature panel already owns the surface;
- `table-list .p-datatable-header` when feature-owned search or filters exist;
- `.p-datatable-wrapper` and `.p-datatable-table`;
- `.p-datatable-thead > tr > th` and `.p-datatable-tbody > tr > td`;
- the first header/body cell for the Actions column;
- `.action-button-toggle` and `.dropdown-menu`;
- `.p-paginator`.

Use selectors beginning with `:host ::ng-deep .{{feature-kebab}}-grid` only at
this `ms-lib` integration boundary. Shared global dark-grid rules remain the default; add a
feature `:host-context([data-bs-theme='dark'])` override only for themed
properties overridden locally.

## Step 12: Add translations

Add every new key to both:

- `src/app/modules/i18n/vocabs/en.ts`;
- `src/app/modules/i18n/vocabs/ar.ts`.

Place keys inside the matching feature block and use exactly the casing requested
by templates and TypeScript. Include title, subtitle, columns, filters, actions,
validation, loading, empty, confirmation, success, and failure messages.

## Step 13: Verify the direct backend contract

When the list endpoint needs a scoped change, follow this order:

1. Start from the tenant-scoped repository query and use `AsNoTracking()`.
2. Read typed filters using exact Angular key casing.
3. Apply filters before counting.
4. Compute `TotalCount` from the filtered query.
5. Apply deterministic ordering with an identity tie-breaker.
6. Project only the ListVM fields defined in Step 2.
7. Apply paging after projection or in the equivalent translated query.
8. Return an empty successful result when no rows match.

Duplicate, foreign-key, ownership, and delete checks remain backend-owned. Do
not broaden the backend change beyond the direct list contract unless the task
explicitly requires it.

## Step 14: Source-only completion check

Before handoff, inspect the complete scoped diff and verify:

- route count matches the editor shape;
- service registration exists;
- grid columns exactly match frontend DTO and backend ListVM properties;
- filter keys match in Angular and .NET, including casing;
- `TotalCount` is returned and consumed directly;
- template, TypeScript, and SCSS `table-list` evidence is complete;
- no duplicate package `Keyboard Search` appears beside feature-owned search;
- package wrapper, table, cells, actions, dropdown and paginator have scoped
  feature integration;
- all subscriptions terminate with `takeUntilDestroyed`;
- list refresh uses `switchMap`;
- both failure channels are handled;
- Delete uses the shared confirmation;
- translations exist in English and Arabic;
- no stale imports, dead types, merge markers, or whitespace errors;
- no unrelated files changed.

Report compile, test, runtime, database, browser, authorization, RTL, dark-theme,
and responsive verification as pending unless they were actually performed.

## Prohibited substitutions

- No `any` or `unknown` in feature-owned contracts.
- No client-supplied tenant, audit, delete, document-number, or calculated fields.
- No hard-coded English display labels.
- No silent `error` callback.
- No raw feature confirmation dialog.
- No second paginator.
- No cross-feature stylesheet import.
- No fabricated permission API.
- No backend total calculated by the client.
- No claim of visual or runtime verification from source inspection alone.

## Owner acceptance pass

1. Load a successful first page and verify displayed columns.
2. Submit each filter and a combined filter.
3. Clear filters and confirm page one is requested.
4. Change page and rows per page.
5. Verify empty results without an error toast.
6. Trigger a transport failure and a business failure.
7. Delete a row, cancel a deletion, and delete the last row on a page.
8. Open every row action and verify state-based availability.
9. Export filtered data when export is present.
10. Verify English, Arabic, LTR, RTL, light, dark, and the narrowest supported
    viewport.
11. Confirm protected requests carry the authorization header without recording
    its token value.
