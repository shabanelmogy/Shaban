## 9. Confirm: delete

> **Status: Canonical**

Never `confirm()`, never a private `p-dialog` for a yes/no. Always
`ConfirmationDialogService`.

```ts
confirmDelete(item: CompanyPartnerGridRow): void {
  this.confirmationDialog
    .confirm({
      severity: 'danger',
      title:    { key: 'companyPartners.confirmDeleteTitle' },
      subtitle: { key: 'companyPartners.confirmDeleteSubtitle' },
      message:  { key: 'companyPartners.confirmDeleteQuestion' },
      warning:  { key: 'companyPartners.confirmDeleteWarning' },
      icon: 'bi bi-trash3',
      record: {
        label: { key: 'companyPartners.customer' },
        title: item.displayName,
        meta: item.no ? `${this.translate.instant('mangeDetails.no')}: ${item.no}` : undefined,
        icon: 'bi bi-building',
      },
      confirmLabel: { key: 'general.delete' },
      cancelLabel:  { key: 'general.cancel' },
      confirmIcon: 'bi bi-trash3',
    })
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((confirmed) => {
      if (confirmed) this.deleteCompany(item);
    });
}
```

Severity picks the default icons for you:

| severity | use for | default icon / confirm icon |
|---|---|---|
| `danger` | delete, remove, irreversible | `bi bi-exclamation-triangle` / `bi bi-trash3` |
| `warning` | discard, unapprove, risky but reversible | `bi bi-exclamation-triangle` / `bi bi-check2-circle` |
| `info` | plain yes/no | `bi bi-info-circle` / `bi bi-check2-circle` |
| `success` | positive confirm | `bi bi-check2-circle` / `bi bi-check2-circle` |

Defaults: width `460px`, collapsing to `calc(100vw - 20px)` under `520px`,
`closeOnEscape` true, confirm label `general.yes`, cancel label `general.cancel`.

Anything that collects a reason, note or date is **not** this dialog — it is a
form modal (block 13).

**Check:** `record` filled so the user sees which row · `subtitle` and `warning`
for destructive actions · mutation only inside `if (confirmed)`.

---

