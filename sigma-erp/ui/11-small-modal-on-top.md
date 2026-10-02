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
      if (!confirmed) return;
      this.drivers.removeAt(index);
      this.parentForm.markAsDirty();           // the editor now has unsaved changes
    });
}
```

A child row of a collection normally goes through `EditableRows.requestRemove` (block 14), which
adds the untouched-new-row rule and marks the editor dirty; use this hand-written form only when
the confirmation needs a custom `record`.

**Check:** shared service, not a nested `p-dialog` · the parent form is marked dirty after a
removal · fallback title when the
record has no name yet · removal only inside `if (confirmed)`.

**Agreement history (shared, 2026-10-01).** A list's *agreements history* action opens
`<app-agreement-history-dialog [source]="historySource" [subtitle]="…" (closed)="…">` from
`shared/components/agreement-history-dialog`, inside `@if (historyRow(); as row)`.

- **The dialog owns:** the load from `source` when it opens, the loading, empty and error
  states (the source call sends `X-Skip-Error-Interceptor`), and the columns and their status
  badge.
- **Columns:** `[showCustomer]="false"` on a customer's own history, `[showVehicle]="false"` on
  a vehicle's.
- **Rows:** `AgreementHistoryRow` from `shared/models/agreement-history.ts`.
- **Translations:** the `agreementHistory.*` keys.

The feature keeps only the selected row and the `source` function. References: the
Individual, Company and Vehicle lists.

---

