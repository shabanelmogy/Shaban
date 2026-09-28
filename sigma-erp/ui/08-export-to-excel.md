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

