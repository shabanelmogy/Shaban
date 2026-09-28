## 15. View mode

> **Status: Canonical**

The owning editor container supplies the mode and disables the whole form once.
A routed editor normally derives `create | view | edit` from route data/params;
a list-owned dialog receives the same explicit mode from its parent/list. Child
sections consume the resulting form state rather than inventing another mode.

```ts
readonly pageMode = signal<CompanyEditorMode>('create');
readonly isViewMode = computed(() => this.pageMode() === 'view');
readonly isEditableMode = computed(() => this.pageMode() !== 'view');

readonly pageTitleKey = computed(() => {
  if (this.pageMode() === 'view') return 'companyForm.viewTitle';
  if (this.pageMode() === 'edit') return 'companyForm.editTitle';
  return 'companyForm.createTitle';
});

private applyFormMode(): void {
  if (this.isViewMode()) this.companyPartnerForm.disable({ emitEvent: false });
  else this.companyPartnerForm.enable({ emitEvent: false });
}
```

Child sections need no mode input — they read `parentForm.disabled`. Header
swaps Cancel for Close and shows an Edit button:

```html
@if (isViewMode()) {
  <app-primary-action-button
    [label]="'general.edit' | translate"
    icon="bi bi-pencil-square"
    (pressed)="openEdit()"
  />
}
```
```html
{{ (isViewMode() ? 'general.close' : 'general.cancel') | translate }}
```

**View-only dialogs.** `app-editor-dialog` defaults to
`primaryActionVisible = true`, and in `mode="view"` that primary action is an
**Edit** button. A dialog that is strictly a read-only viewer (no edit path, or
a state where editing is not allowed) binds `[primaryActionVisible]="false"`.

**Mode-specific lookups.** Request option lists only for controls rendered in
the active mode. In View, display the names the Detail DTO already carries and
skip edit-only dropdown lookups; do not show lookup warnings for controls that
are not rendered.

**Check:** `disable({ emitEvent: false })` so it does not fire `valueChanges` ·
step navigation still works in view mode · Save hidden, not just disabled · Add
and Delete buttons disabled through `parentForm.disabled` · read-only dialogs
bind `[primaryActionVisible]="false"` · no edit-only lookups in View.

---

