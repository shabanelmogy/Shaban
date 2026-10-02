## 10. Confirm: discard

> **Status: Canonical**

Any editable form that can be left with unsaved data needs this. References: routed editor
`Workshop/Job/components/editor` (`requestClose()`), dialog editor
`Fleet/Vehicle/components/details` (`requestClose()`); the Company editor uses the same shape.

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

**Return to the list as the user left it.** A routed editor goes back with the list's state.
The list passes its filters, page and sort as query parameters when it opens the editor
(`returnQueryParams()`), and the editor navigates back with them:

```ts
private close(): void {
  void this.router.navigate(['/Job'], { queryParams: this.route.snapshot.queryParams });
}
```

The list restores its form and page from those parameters on load. A hard-coded
`router.navigate(['/Feature'])` loses the user's filters — a defect (found in the Company
reference snippet above, kept for the dirty-check shape only).

When Search applies draft filters explicitly, serialize the applied filter snapshot for
paging and editor return. Successful row actions refresh that snapshot too; a draft control
edit without Search must not silently change the query during an action or editor handoff.

For a dialog editor, do not rely on two-way `visible` binding or `(onHide)` to
decide whether closing is allowed: by then PrimeNG has already hidden the
surface. Use the controlled-visibility pattern in block 13. Its X, Cancel and
scoped Escape handler call `requestClose()`; its mask close is disabled. If a
screen must support mask-to-close, the mask intent must be intercepted before
visibility changes and routed through the same method.

**Presets (2026-10-01).** `confirmation.confirmDiscard('<feature>')` uses the three feature keys. The list
keeps its state with `readListRoute(route)` / `writeListRoute(router, route, params)`
(`shared/utils/list-route-state.ts`): `number`, `text`, `flag` and `paging()` read it back.

**Check:** returns to the list with its query parameters · view mode leaves silently · pristine form leaves silently · dirty
form always prompts · Cancel, X and Escape use one method · mask closing is
either disabled or goes through that method before the dialog hides.

---
