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

