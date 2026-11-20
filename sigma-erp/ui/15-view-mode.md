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

**Read-only close.** A pure viewer does not run
an editable draft's upload-discard/cleanup path just to leave. Its dialog Close,
header close, Escape and route guard share a close decision which permits
cancelling pending detail reads; a read is not an unsaved write. Invalidate the
view identity, cancel its reads and pending print preparation, then emit the
accepted close result. Preserve genuine save/upload/cleanup, confirmation and
active-print safety; never cancel an independent write as a read. Create/Edit
retain their dirty-discard and attachment cleanup contracts. WorkshopMovement's
View correction applies this through the existing EditorDialog public
closeDisabled contract and the feature's read owner (UI13/28), without overriding
the shared shell or claiming runtime verification from source review.

**Mode-specific lookups.** Request option lists only for controls rendered in
the active mode. In View, display the names the Detail DTO already carries and
skip edit-only dropdown lookups; do not show lookup warnings for controls that
are not rendered.

**Disabled vs readonly.** A disabled control is missing from `form.value`, so a payload is always
built from `form.getRawValue()` (View mode disables the whole form). Use `disabled` for a control
the user cannot change in this mode or state. Use a `readonly` input, or the `sigma-field__read`
text, for a value the server owns or derives (tax rate, line total, document number): it stays
visible, keeps its styling and is never sent as an input (blocks 14 and 19).

**Check:** `disable({ emitEvent: false })` so it does not fire `valueChanges` · payloads from
`getRawValue()` · derived and server-owned values `readonly` or read text ·
step navigation still works in view mode · Save hidden, not just disabled · Add
and Delete buttons disabled through `parentForm.disabled` · read-only dialogs
bind `[primaryActionVisible]="false"` · no edit-only lookups in View.

---

