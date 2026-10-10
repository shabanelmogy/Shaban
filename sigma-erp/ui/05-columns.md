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

**Column identity.** A field may have two distinct presentations, such as its
retained numeric quantity column and a derived status badge with another header.
The shared DataTable header and body loops track `column.field + ':' + column.header`;
each field/header pair must be unique. The header is the stable translation key,
so language changes do not change identity. Keep sorting bound to the actual
field and use a distinct meaningful header for each presentation; do not add
a transport property solely to make DOM keys unique. Stock Reports uses this
shared capability for its approved appended statuses (2026-10-05). Numeric
values, status formatting/export and row identity retain their existing owners;
runtime acceptance remains pending after source review.

**Complete multi-line content.** Set a column's public `cellClass` to
`sigma-data-table__cell--wrap` when full notes or attachment links must remain
visible. The shared table owns wrapping, long-token breaks and top alignment;
features must not override its cell selectors. Compact cells retain their
default single-line ellipsis. This changes presentation only, preserving the
complete value used by templates and exports.

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

**Column types (shared formatting).** `DataTableColumn.type` formats the field so a feature
writes no `value` function or template for common cells:

| `type` | Renders | Export writes |
|---|---|---|
| `'dateTime'` / `'date'` | `dd/MM/yyyy HH:mm` / `dd/MM/yyyy` (`formatDisplayDate`) | the same text |
| `'money'` | 2 decimals, Latin digits, half away from zero (`formatMoney`) | the same text |
| `'number'` | the number | the number |
| `'status'` + `status: (row) => ({ label, tone })` | `sigma-status-badge` with `tone` `success`/`info`/`warning`/`danger`/`neutral`, translated `label` | the translated label |

`value` still wins over `type`, and `cellTemplate` remains for anything richer. Reference:
Job list (`type: 'status' | 'money' | 'dateTime'`, no templates, no formatting helpers).

**Status badge (shared).** A status cell is `<span class="sigma-status-badge …">` with a
variant — `--success` (active/open), `--info`, `--warning`, `--danger` (voided/rejected), or
the neutral base (closed/inactive) — defined once in `src/styles.scss` for light and dark. No
feature badge CSS. A list whose status filter or row actions depend on the status **shows** the
Status column, so the user sees why an action is missing; the backend sort switch includes
`status`.

**Sort whitelist from the columns.** `onLazyLoad` accepts a sort field only when a column with
that `field` is `sortable`: build the set from `columns`, never a second hand-written list.

**Required columns rule.** The list model carries only what the grid shows, plus
`id`, plus what a row action needs. Company's 6 columns need: `id`, `no`,
`companyName`, `phone1`, `phone2`, `contactGroup`, `contactGroupId` (Edit
Contact Group action), `website`, `email`, `inActive`. Anything else is dead
weight — give export-only data its own contract.

**Check:** actions column first when actions exist · every header uses a
translation key · every `field` is a typed row property · sortable fields are
backend-confirmed and whitelisted · derived values remain feature-owned · no
model field that no column or action reads · no `ListCol`, `ColType` or
`initColumns()` remains · status cells use `sigma-status-badge` with a translated `value` fallback · the sort whitelist is derived from the sortable columns · dates, money and statuses use `type` (and `status`) instead of per-feature `value` functions or templates.

---
