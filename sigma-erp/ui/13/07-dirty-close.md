<!-- Part of UI block 13: see ../13-modal-with-tabs.md. Same status and authority as the block. -->

### Closing a dirty tabbed modal — canonical

The shared editor shell is controlled, but the feature still owns the decision
to close because only the feature knows whether its form or child drafts are
dirty. A two-way visibility/onHide reset allows PrimeNG to hide the surface
before the feature decides whether changes may be discarded.

For every editable tabbed dialog, use **controlled visibility**: the dialog never closes
itself, every close attempt goes through one method, and reset happens only after
the close is agreed.

```html
<app-editor-dialog
  [visible]="visible()"
  [title]="titleKey() | translate"
  [mode]="mode()"
  [closeDisabled]="closeConfirmationPending() || saving()"
  [saving]="saving()"
  (closeRequested)="requestClose()"
  (escapeRequested)="onDialogEscape($event)"
  (editRequested)="enableEditing()"
  (saveRequested)="save()"
>
  <div class="feature-editor-content">…tabs and field groups…</div>
</app-editor-dialog>
```

The shared shell disables PrimeNG's own exits, so the header X, Cancel/Close and
scoped Escape output all funnel into `requestClose()`. Do not add a `document`
Escape listener: it also sees Escape from a dropdown or the discard confirmation
and can immediately open a second confirmation.

```ts
readonly visible = signal(false);
readonly closeConfirmationPending = signal(false);

onDialogEscape(event: Event): void {
  event.preventDefault();
  event.stopPropagation();
  this.requestClose();
}

requestClose(): void {
  if (this.closeConfirmationPending()) return;

  if (!this.driverDraft?.dirty) {
    this.close();
    return;
  }

  this.closeConfirmationPending.set(true);
  this.confirmationDialog
    .confirm({
      severity: 'warning',
      title:   { key: 'companyForm.discardDriverTitle' },
      message: { key: 'companyForm.discardDriverMessage' },
      icon: 'bi bi-exclamation-triangle',
      confirmLabel: { key: 'companyForm.discard' },
      cancelLabel:  { key: 'general.cancel' },
      confirmIcon: 'bi bi-x-circle',
    })
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.closeConfirmationPending.set(false)),
    )
    .subscribe((confirmed) => {
      if (confirmed) this.close();
    });
}

// Hide first, then reset. Never reset from a visibility hook.
private close(): void {
  this.visible.set(false);
  this.driverDraft = null;
  this.editIndex = null;
}
```

Order matters: hide, then reset. Resetting inside `(onHide)` runs before the user
has answered, which is the defect being replaced. The confirmation dialog is
appended to body, so it correctly stacks above this dialog (block 11).

**Check:** the feature consumes `app-editor-dialog` rather than declaring a
feature-owned `p-dialog` shell · width/breakpoint overrides are passed only
through supported shared-component inputs when the content genuinely needs them ·
child draft mutates its parent only in Save · close intent goes through one
method that applies the discard rule, then `close()` hides and resets · no reset
in `(onHide)` · nested dropdowns and calendars use their approved body-appended
overlay contract · rebuild translated field config on `onLangChange` when the
feature stores translated configuration.

Optional workflow footer actions (2026-10-17; Languages): the existing
`EditorDialogComponent` exposes readonly `EditorDialogFooterAction[]` through
`footerActions`, defaulting to an empty array, and emits the selected stable
action id through `footerActionRequested`. Each action supplies its translated
label, optional icon and disabled state. The shared shell renders them before
Cancel/Close using its existing secondary-button owner and disables them during
Save. The feature owns navigation, validation, dirty-discard and independent
busy guards. Use this extension for Previous or Save-and-Next; do not repurpose
Save-and-Print, duplicate the dialog footer, or add feature footer styling.
An empty array preserves existing consumers.
The shared actions group wraps within min-width0, aligns to logical end and
retains its existing8px gap. Previous/Next chevrons mirror through the existing
global body-overlay owner `[dir='rtl'] .app-editor-dialog`, since the dialog is
appended to body and feature-host ancestry cannot own its direction selectors.

The shared `app-editor-dialog` owns `appendTo="body"`, modal/drag/resize behavior,
the header hierarchy and close control, responsive shell sizing, footer action
markup, primary-icon contrast, focus styling, RTL, dark theme and Escape output.
Do not recreate its `pTemplate="header"`, footer buttons, or internal classes in
feature templates/SCSS. A feature owns projected content and may supply only the
documented public inputs, outputs and `dialogClass` hook.

**Shared branch-setting consumer evidence (2026-10-09; Master5 extraction gate):**
`shared/components/branch-tariff-settings/BranchTariffSettingsComponent` owns the
existing tenant-wide branch/percentage settings workflow used by RentalTariff,
LeaseTariff and TariffCard. All three mount the same controlled editor and delegate
its deferred discard decision from their list route guards. It uses the public
720px width, viewport-bounded 560px definite height, padded shared flex body and
the UI14 fill/sticky collection. The Add toolbar is independent of saved row
count; successful empty loading remains editable. Lookup or settings failure
blocks partial replacement and offers inline Retry. Invalid inputs leave Save
available to reveal field/duplicate feedback; pending reads, Save and confirmations
retain their gates. This business owner composes existing EditorDialog,
EditableRows and freezeFormState; do not copy its form/request implementation
into consumers or infer separate rental/lease settings from the entry location.
The source API has no module/card discriminator; that contract stays in the
feature freeze.

---
