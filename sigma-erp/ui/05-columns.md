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

**Template columns and status text.** When a column uses a custom cell template
(`#statusTemplate`, `#dateTemplate`), declare it with
`@ViewChild('statusTemplate', { static: true }) protected statusTemplate!: TemplateRef<unknown>;`
and build the `columns` signal in `ngOnInit()` through an `initColumns()` method,
so the template reference exists before the table renders. Give a status column
**both** `cellTemplate` and a `value: (row) => this.getStatusText(row.status)`
fallback that returns translated text. Export and any render path that bypasses
the template then still show translated text instead of a raw enum. In the
template, bind the row with `let-row` (`$implicit`).

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

