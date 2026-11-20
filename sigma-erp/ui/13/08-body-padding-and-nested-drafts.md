<!-- Part of UI block 13: see ../13-modal-with-tabs.md. Same status and authority as the block. -->

### Body padding — `[contentPadded]`

**Bounded body chain.** The shared PrimeNG content and
`.app-editor-dialog-content` pass a shrinking flex column (`min-height: 0`) to the
projected editor. A long form uses `sigma-editor-form` → `sigma-editor-body` →
`sigma-editor-scroll`; the inner region scrolls while dialog header/footer stay fixed.
Do not restore a viewport-height calculation or scroll owner in feature SCSS.

**Definite height for flex editors.** When projected content uses that zero-basis
flex chain, give `app-editor-dialog` a definite `height` through its shared input,
such as `height="min(720px, calc(100dvh - 24px))"` when a fixed workspace is needed.
A maximum height alone does not supply available height to zero-basis flex
descendants; they can collapse under an auto-height dialog. The shared shell
still owns maximum height, header/footer and content bounds; the inner editor
scrolls. Default dialogs retain auto height when the input is omitted. Do not
patch `.p-dialog-content` or copy viewport-height selectors into a feature.
Recheck this contract when converting a content-sized form to tabs: adding a
zero-basis form/body/scroll chain without setting the shared height can hide the
entire projected body. WorkshopMovement's2026-10-31 first correction used a680px
viewport-bounded height. Creation retains that workspace; after the owner's
size correction, View uses the fully auto-basis content-sized alternative below.
Syntax parsing alone does not verify nonzero geometry or appropriate empty space.

**Content-sized dialog alternative.** For a form that should fit its content
without blank space, omit `height`, keep a shell `maxHeight`, and use existing
`sigma-u-flex-fill` (`flex: 1 1 auto`) on every projected link of that editor chain:
form, body and inner scroll region. This retains intrinsic content sizing while
allowing the inner region to shrink/scroll at the shell limit; keep `min-height: 0`
and overflow ownership from the shared classes. Do not leave a zero-basis child
in the auto-height chain. Company Driver draft uses this alternative with
`maxHeight="90dvh"` after the owner requested removal of unused space.

**Compact action forms.** Choose a single-column
field layout through the shared `--sigma-editor-columns` contract. Keep loading,
error, explanation and multiline field blocks full-span (`sigma-field--full`)
so the shared intermediate two-column breakpoint cannot place them side by
side. A Reason textarea can keep native rows and maxlength, with its description
associated by aria-describedby. Use the existing content-sized form/body/scroll
chain above; when EditorDialog owns padding, existing `sigma-u-p-0` on its body
avoids a second workspace inset. Shared `sigma-u-m-0` keeps an alert inside that
grid aligned with its fields. The current utility owner is
`assets/sass/_sigma-utilities.scss`; do not use the retired unprefixed flex-fill
name. Native shared utilities own those values, not feature CSS. Preserve the
shared shell/footer, access boundary and request behavior. Compilation does not
establish nonzero geometry, scrolling, focus or visual acceptance (UI29).

Item Return's basic/items panels adopt this content-sized alternative in
Create/Edit/View; all three projected links keep the shared
auto-basis utility. Its approval adapter retains a definite bounded shell height
because that independent panel uses a zero-basis scroll chain. The same editor
uses the existing workspace tab appearance, as requested against Link Accounts,
and one compact FormSection card around Items in every mode. Hide the repeated
tab/collection titles through the owners' existing showTitle/headingVisible
inputs; the FormSection keeps its editable mock action while the collection
keeps Add/Remove and validation. No feature tab/card CSS or private toolbar.

> **Status: Canonical** (2026-09-28)

The dialog header and footer carry the global inset from `src/styles.scss`
(`.app-editor-dialog .p-dialog-header` / `.p-dialog-footer`), but the body is
deliberately unpadded (`contentStyle` sets `padding: 0`) so tabs, toolbars and
full-bleed tables can reach the edges. Without a body inset, fields touch the
dialog edge and do not line up with the title and the footer buttons.

`app-editor-dialog` owns that inset through an opt-in input:

```html
<app-editor-dialog
  [contentPadded]="true"
  …
>
```

- **New and refactored editors set `[contentPadded]="true"`.** The shell then
  applies the body inset that matches the header and footer. Do not add
  `padding` to the feature's own content wrapper, and do not restate the value in
  feature SCSS.
- Leave it `false` only when the body is full-bleed by design (an
  `app-editor-tabs` strip or a table that must reach the edges); the tab panels
  or sections then own their inner spacing.
- Existing editors that pad their own wrapper keep working because the input is
  off by default. Move them to `[contentPadded]="true"` when the screen is next
  touched and remove the feature padding in the same change (backlog 36).

### Nested child draft variant

The CompanyPartner driver component is the reference integration for a nested
child draft with shared dialog, tabs, form sections and collection summary. It
owns draft isolation, validation, dirty-close approval and parent commit; it
does not own any dialog/tab/section shell markup or styling. Define
`driverTabs` and `currentDriverTab` with the typed shared-tab contract above.
The parent collection changes only after child Save succeeds:

```html
<app-editor-dialog
  [visible]="visible"
  [title]="driverTitleKey() | translate"
  [subtitle]="'companyForm.driverDialogDescription' | translate"
  icon="bi bi-person-vcard"
  [mode]="driverDialogMode()"
  width="1280px"
  [breakpoints]="{ '1199px': '94vw', '767px': 'calc(100vw - 16px)' }"
  [closeDisabled]="saving || closeConfirmationPending"
  [saving]="saving"
  [closeLabel]="'general.close' | translate"
  [cancelLabel]="'general.cancel' | translate"
  [saveLabel]="'general.save' | translate"
  (closeRequested)="requestClose()"
  (escapeRequested)="onDialogEscape($event)"
  (saveRequested)="saveDriver()"
>
  @if (driverDraft) {
    <div [formGroup]="driverDraft" class="company-driver-editor">
      <app-editor-tabs
        [tabs]="driverTabs"
        [activeTab]="currentDriverTab()"
        [ariaLabel]="'mangeDetails.driver' | translate"
        idPrefix="company-driver"
        (activeTabChange)="currentDriverTab.set($event)"
      />

      @switch (currentDriverTab()) {
        @case ('detail') {
          <section id="company-driver-panel-detail" role="tabpanel"
                   aria-labelledby="company-driver-tab-detail" tabindex="0">
            … field groups …
          </section>
        }
        @case ('documents') {
          <section id="company-driver-panel-documents" role="tabpanel"
                   aria-labelledby="company-driver-tab-documents" tabindex="0">
            <app-documents [parentForm]="driverDraft" arrayName="documents"></app-documents>
          </section>
        }
      }
    </div>
  }

</app-editor-dialog>
```

Draft in, parent touched only on Save:

```ts
readonly visible = signal(false);
readonly draft = signal<FormGroup<DriverControls> | null>(null);
private editIndex: number | null = null;

openDialog(): void {                     // Add
  this.editIndex = null;
  this.draft.set(this.createDriverForm());
  this.visible.set(true);
}

editDriver(index: number): void {        // Edit: a copy, so Cancel leaves the row untouched
  this.editIndex = index;
  this.draft.set(this.createDriverForm(this.drivers.at(index).getRawValue()));
  this.visible.set(true);
}

saveDriver(): void {
  const draft = this.draft();
  if (!draft) return;
  if (draft.invalid) { draft.markAllAsTouched(); return; }
  if (this.editIndex !== null) this.drivers.setControl(this.editIndex, draft);
  else this.drivers.push(draft);
  this.parentForm.markAsDirty();
  this.close();
}
```

Build the draft from the row's raw value (`createDriverForm(value)`), not with `patchValue`
alone: `patchValue` does not create the rows of a nested `FormArray` (for example a driver's
documents).

Field groups are declarative, so the template loops instead of repeating markup:

```ts
private readonly driverFieldGroupDefinitions = [
  { key: 'identity', titleKey: 'companyForm.driverIdentity',
    descriptionKey: 'companyForm.driverIdentityHint', icon: 'bi bi-person-vcard',
    fieldNames: ['firstName', 'middleName', 'lastName', 'gender', 'nationality', 'birthDate'] },
  { key: 'contact',  … fieldNames: ['email', 'mobileNo', 'phoneHome', 'phoneWork'] },
  { key: 'address',  … fieldNames: ['address', 'city', 'state', 'zipCode', 'country'] },
  { key: 'additional', … fieldNames: ['notes'] },
];
```

**Single-section variant:** use the same `app-editor-dialog`, drop
`app-editor-tabs`, and keep the groups. Use tabs only for real peer groups such
as Detail + Documents.
