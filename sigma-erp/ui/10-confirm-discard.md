## 10. Confirm: discard

> **Status: Canonical**

Any editable form that can be left with unsaved data needs this. Reference is
`Fleet/Vehicle/components/details/details.component.ts` `requestClose()`; the
Company editor uses the same shape.

```ts
cancel() {
  if (this.isViewMode() || !this.companyPartnerForm.dirty) {
    this.leave();
    return;
  }

  this.confirmationDialog
    .confirm({
      severity: 'warning',
      title:   { key: 'companyForm.discardTitle' },
      message: { key: 'companyForm.discardMessage' },
      icon: 'bi bi-exclamation-triangle',
      confirmLabel: { key: 'companyForm.discard' },
      cancelLabel:  { key: 'general.cancel' },
      confirmIcon: 'bi bi-x-circle',
    })
    .pipe(takeUntilDestroyed(this.destroy$))
    .subscribe((confirmed) => {
      if (confirmed) this.leave();
    });
}

private leave(): void {
  this.router.navigate(['/CompanyPartner']);
}
```

Keys per feature: `<feature>.discardTitle`, `.discardMessage`, `.discard`.

For a dialog editor, do not rely on two-way `visible` binding or `(onHide)` to
decide whether closing is allowed: by then PrimeNG has already hidden the
surface. Use the controlled-visibility pattern in block 13. Its X, Cancel and
scoped Escape handler call `requestClose()`; its mask close is disabled. If a
screen must support mask-to-close, the mask intent must be intercepted before
visibility changes and routed through the same method.

**Check:** view mode leaves silently · pristine form leaves silently · dirty
form always prompts · Cancel, X and Escape use one method · mask closing is
either disabled or goes through that method before the dialog hides.

---

