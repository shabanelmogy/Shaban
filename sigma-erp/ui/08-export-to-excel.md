## 8. Export to Excel

> **Status: Canonical** — translate headers when the export action runs

Shared helper, signature `onExportToExcel(data, fileName, headers?)` where
`data` is currently a `Signal<any[]>`. Keep feature rows typed; the `any`
belongs to the Transitional shared helper boundary (backlog 22), not to the
feature contract.

**Column headers are UI text, so translate them.** Resolve header text when the
user clicks Export. Customer Statement dispatches to the selected section's
typed grid columns (block 20); it does not cache translated object keys:

```ts
// sectionRows and sectionColumns are the selected feature-owned typed data.
const rows = dataTableExportRows(
  sectionRows,
  sectionColumns,
  (key) => this.translate.instant(key),
);
if (rows.length) {
  onExportToExcel(signal(rows), sectionFileName);
}
```

`translate.instant()` reads no Angular signal. Do not memoise translated object
keys in a `computed()` unless that computed also reads a language signal;
otherwise an export after a language switch keeps the previous headers.

**Tabbed report scope.** The ordinary Excel action exports the selected
section's complete response array with that section's current columns, including
mode-conditional fields. Local pagination never limits export rows, and the
selected section's count governs availability, even when the primary section is
empty. Include section/mode identity in the file name. An explicitly named
all-sections action is a separate contract; do not silently export the primary
table from every tab. Printing may still cover the whole report (block 21).

A specialized grouped export follows the selected applicable data collection
and keeps its existing confirmed grouping formula. Show/enable it only where
those fields exist; do not aggregate unrelated rows or fall back to the first
tab. Customer Statement's voucher-type grouping applies to ledger/outstanding
and advance invoice lines, not deposits, PDCs or ageing.

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
getAllList(filters: CompanyPartnerFilters): Observable<CompanyPartnerDTO[]> {
  return fetchAllPages(
    (pageNo) => this.getList({ pageNo, pageSize: 100, filters }),
    'companyPartners.exportError',
  );
}
```

`fetchAllPages` (`shared/utils/list-query.ts`, block 2) follows `totalPages`/`totalCount` and
throws on the first failed page. Do not copy the `expand` loop into a feature (38 copies at
2026-10-01, removed per screen review).

A report may wrap paged rows and metadata inside Result<T>. Inspect that endpoint's
page-size limit, returned count and rows; the wrapper name does not prove a full
dataset. Adapt its confirmed rows/page/count fields to the existing shared all-pages
helper when needed, preserving unsuccessful results as failures. Never substitute
a larger pageSize for collecting all pages when the server clamps it. Print and
Excel use the same frozen applied filters and effective column/bucket labels (20/21).

**Export from the grid columns.** A list export calls
`dataTableExportRows(rows, this.columns, (key) => this.translate.instant(key))` from the shared
data table: translated headers, the same formatted values as the grid (column `type`/`value`),
translated statuses, resolved at click time. Hand-written export mappers are only for exports
whose columns differ from the grid. Reference: Job list.

**No secrets in a file.** An export never contains a card security code, a password, a token or a
secret key, and a card number shows only its last four digits (payment-card data, PCI DSS).
Reference: the Individual customers card export (2026-10-01).

**Check:** no secret or full card number in the file · uses the current filters, not unfiltered data · covers all pages · a
failed page produces an error and no file · loading released on every outcome ·
export disabled while running · all pages loaded with `fetchAllPages` · a list export that mirrors the grid uses `dataTableExportRows`.

**No card export (owner decision 2026-10-01).** The Individual and Company lists no longer export
credit cards: the button, the Company endpoint and the browser-side Individual export were removed.
If a card export is ever needed again, it comes from an export-only backend endpoint that returns
the last four digits and never the CVV. The browser never downloads a full card list (G15;
backend backlog 28).

---
