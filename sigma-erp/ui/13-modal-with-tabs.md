## 13. Modal with tabs

> **Status: Canonical composite** — use `app-editor-dialog` for the modal shell,
> `app-editor-tabs` for accessible navigation, `Fleet/VehicleService` for the
> feature integration, and block 10 for controlled dirty-close behavior

Use for Create, Edit, and View editors with real peer sections. A modal having
tabs does not create a new shell shape: it uses the same shared
`app-editor-dialog` as a single-section editor and projects `app-editor-tabs`
plus its feature-owned tab panels into the body.

**Mandatory CRUD modal rule.** For an ordinary list-owned Add/Create, View and
Edit workflow, all three actions open the same controlled `app-editor-dialog`
editor and pass an explicit `create | view | edit` mode. The Create button and View/Edit row
actions must not navigate to separate routed pages or mix modal and routed
editors. A routed editor is allowed only when confirmed source or a documented
business workflow requires an independently addressable page; absence of an
existing modal is not such evidence. View mode reuses the same data/detail
contract and modal shell, makes controls read-only, hides Save, and offers Close.

```text
shared/components/editor-dialog/editor-dialog.component.ts
shared/components/editor-dialog/editor-dialog.component.html
shared/components/editor-dialog/editor-dialog.component.scss
shared/components/editor-tabs/editor-tabs.component.ts
shared/components/editor-tabs/editor-tabs.component.html
shared/components/editor-tabs/editor-tabs.component.scss
Fleet/VehicleService/components/details/details.component.html
Fleet/VehicleService/components/details/details.component.ts
```

`app-editor-dialog` owns the body-appended PrimeNG shell, header hierarchy,
close control, responsive width, Create/Edit Save action, View Edit action, and
Cancel/Close action. `app-editor-tabs` owns the tablist markup, translated tab
labels, stable tab IDs, `aria-controls`, roving `tabindex`, active presentation,
LTR/RTL arrow navigation, Home/End navigation, and focus movement. The feature
projects its body and optional `editorDialogHint`, supplies translated labels,
and handles the emitted close, edit, save, Escape and shown events. The feature
remains responsible for mode state, typed active-tab state, matching tab panels,
forms, validation, dirty detection, confirmation and persistence. Keep the
feature's own class prefix for projected panel content; never import another
feature's SCSS or recreate the shared tab-button styles.

```html
<app-editor-dialog
  [visible]="editorVisible()"
  [title]="pageTitleKey() | translate"
  [subtitle]="'feature.editorSubtitle' | translate"
  icon="bi bi-pencil-square"
  [mode]="editorMode()"
  dialogClass="feature-editor-dialog"
  [closeDisabled]="saving() || closeConfirmationPending()"
  [primaryActionVisible]="!loading() && !loadError()"
  [primaryActionDisabled]="saving()"
  [saving]="saving()"
  [closeLabel]="'general.close' | translate"
  [cancelLabel]="'general.cancel' | translate"
  [editLabel]="'general.edit' | translate"
  [saveLabel]="'general.save' | translate"
  (closeRequested)="requestClose()"
  (editRequested)="enableEditing()"
  (saveRequested)="save()"
  (escapeRequested)="onDialogEscape($event)"
  (shown)="onEditorShown()"
>
  <div class="feature-editor-content">…tabs or form…</div>

  @if (isEditableMode()) {
    <p editorDialogHint>{{ 'feature.requiredFieldsHint' | translate }}</p>
  }
</app-editor-dialog>
```

### Shared accessible tabs

Use the shared component for every new or refactored custom editor tablist. The
feature supplies a typed key union and translation keys; the shared component
emits only a valid key from that list:

```ts
import {
  EditorTab,
  EditorTabsComponent,
} from 'src/app/modules/shared/components/editor-tabs/editor-tabs.component';

type FeatureEditorTab = 'general' | 'children' | 'documents';

readonly tabs: ReadonlyArray<EditorTab<FeatureEditorTab>> = [
  { key: 'general', label: 'feature.tabs.general', icon: 'bi bi-card-list' },
  { key: 'children', label: 'feature.tabs.children', icon: 'bi bi-list-check' },
  { key: 'documents', label: 'feature.tabs.documents', icon: 'bi bi-file-earmark-text' },
];

readonly currentTab = signal<FeatureEditorTab>('general');
```

Import `EditorTabsComponent` in the standalone feature component, then keep the
panels in the feature form:

```html
<app-editor-tabs
  [tabs]="tabs"
  [activeTab]="currentTab()"
  [ariaLabel]="'feature.editorSections' | translate"
  idPrefix="feature-editor"
  (activeTabChange)="currentTab.set($event)"
/>

@switch (currentTab()) {
  @case ('general') {
    <section
      id="feature-editor-panel-general"
      role="tabpanel"
      aria-labelledby="feature-editor-tab-general"
      tabindex="0"
    >
      …feature fields…
    </section>
  }
}
```

`idPrefix` is required and must be unique among simultaneously rendered tabsets.
Each panel ID must be `${idPrefix}-panel-${key}` and its `aria-labelledby` must
be `${idPrefix}-tab-${key}`. Tab labels are translation keys; `ariaLabel` is the
already translated accessible name. The shared component owns the tab-strip
styles and consumes the shared editor-dialog tokens plus the global Sigma
primary tokens. Feature SCSS owns only panel content and responsive layout.
The component also owns the dark theme: its stylesheet is encapsulated, so its
dark rules sit under `:host-context([data-bs-theme='dark'])` (block 25), and
their token fallbacks are the dark editor-dialog values. A host that defines
the `--app-editor-dialog-*` tokens (the dialog, the Link Accounts card) keeps
its own colours; a routed workspace that defines none still gets a dark strip.
Do not add feature SCSS or page tokens only to darken the tabs.

`app-editor-tabs` has two canonical appearances. `underline` is the default for
modal/detail editors. `workspace` is the routed dense-workspace appearance and
is the single source of the rounded tab strip, icon tile, active underline,
hover/focus treatment, horizontal overflow, RTL keyboard behavior and dark
state used by both Opening Balances and Link Accounts. Use it as:

```html
<app-editor-tabs
  [tabs]="tabs"
  [activeTab]="currentTab"
  [ariaLabel]="'feature.sections' | translate"
  idPrefix="feature-workspace"
  appearance="workspace"
  (activeTabChange)="setCurrentTab($event)"
/>
```

Do not reproduce workspace-tab markup or styles in feature SCSS. When an older
workspace is refactored, remove its local tab button loop and point it to this
shared appearance so all routed workspaces stay visually and behaviorally
consistent.

Do not keep a feature-local `onTabKeydown`, tab-button loop, or duplicate tab
styles after adopting `app-editor-tabs`.

### Screenshot functional evidence + named modal shell

When the owner supplies screenshots **and** explicitly names an existing Sigma
modal whose style must be reused, split the acceptance criteria instead of
choosing only one reference:

- the screenshots identify functional content: visible fields, labels, logical
  groups, diagrams/images, actions, and the captured state. Classify each item
  under the Master Guide evidence policy; do not infer completeness;
- `app-editor-dialog` controls the shared shell: overlay, width constraints,
  header/title/description, close-button position, approved group presentation,
  field layout, content padding (through `[contentPadded]`, see *Body padding*
  below) and scrolling, footer, Cancel/Save order,
  button/icon treatment, responsive behaviour, accessibility, RTL and dark
  theme;
- inspect the shared editor component and the owner-named feature's projected
  content before editing; never reproduce either from memory;
- apply the same shell to Create, Edit and View. Change only the mode-specific
  title, read-only state and available actions;
- keep the target feature's own class prefix and business logic for projected
  content. Do not import another feature's SCSS or copy its feature-specific
  controls and payloads.

The screenshot evidence establishes the feature data and logical groups;
`app-editor-dialog` determines the shell and `app-editor-tabs` determines the
projected tab navigation. The feature still owns its panel implementation. If
required content does not fit, use the approved responsive and scrolling
pattern. Do not infer modal width or breakpoints from the captured viewport.

The shared shell means: an internal `p-dialog` appended to `body`; a full-width
flex header with icon, title, optional description and close control at the
logical edge; one bounded scrolling body; and a footer with the optional hint
separated from mode-aware actions. Its default width is `1040px`, with `94vw`
and narrow-screen breakpoints. Override the width inputs only when confirmed
content requires it. `app-editor-tabs` and the feature-owned panels remain
projected editor body content.

### Body padding — `[contentPadded]`

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
openDialog() {                       // Add
  this.editIndex = null;
  this.driverDraft = this.createDriverForm();
  this.visible = true;
}

editDriver(index: number) {          // Edit
  this.editIndex = index;
  this.driverDraft = this.createDriverForm();
  this.driverDraft.patchValue(driverValues);
  this.visible = true;
}

saveDriver() {
  if (!this.driverDraft) return;
  if (this.driverDraft.invalid) { this.driverDraft.markAllAsTouched(); return; }
  if (this.editIndex !== null) this.drivers.setControl(this.editIndex, this.driverDraft);
  else this.drivers.push(this.driverDraft);
  this.driverDraft = null;
  this.visible = false;
}
```

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

### Routed full-page detail form with a bounded child collection

> **Status: Canonical composite variant** — use only when the feature has an
> explicitly approved independently addressable Create/Edit/View route; this
> does not replace the ordinary CRUD modal rule above

Approved reference:

```text
Rental/RentalQuotation/components/details/details.component.{ts,html,scss}
shared/components/form-section/
shared/components/editable-collection-table/
```

Use this shape when the editor must occupy the authenticated viewport as a
route-level page. Keep one typed parent form and use the shared section and
editable-table components; the feature owns only the route state, controls,
payload, validation, and business behavior.

The routed shell owns the available viewport between the existing header and
footer. It must have `min-height: 0` and `overflow: hidden`, with no browser/page
scroll. The form body is a flex column: the first section keeps its intrinsic
height, the child-collection section fills the remaining height, and the
Save/Cancel footer is a non-shrinking sibling outside the clipped form body.

Use the section header action projection for Add. Do not render a second Add
toolbar inside the child table when the enclosing section already owns the
visible title:

```html
<app-form-section
  title="feature.items"
  icon="bi bi-list-check"
  density="compact"
  [fill]="true"
>
  <app-primary-action-button
    form-section-actions
    [label]="'general.add' | translate"
    icon="bi bi-plus-lg"
    [disabled]="!isEditable()"
    (pressed)="addItem()"
  />

  <div class="feature-items-table-area">
    <app-editable-collection-table
      title="feature.items"
      [headingVisible]="false"
      [columns]="itemColumns"
      [editable]="isEditable()"
      [fillHeight]="true"
      tableMinWidth="1200px"
      maxHeight="clamp(120px, calc(100dvh - 540px), 240px)"
      (removeRequested)="requestRemoveItem($event)"
    >
      <!-- projected typed cells only -->
    </app-editable-collection-table>
  </div>

  <div class="feature-summary" aria-live="polite">
    <!-- totals, discount and grand total; never place this inside the table frame -->
  </div>
</app-form-section>
```

`app-form-section [fill]="true"` makes the section and its content a bounded
flex column. The feature table area gets `min-height: 0`, `flex: 1 1 auto`, and
`overflow: hidden`; `app-editable-collection-table [fillHeight]="true"` makes
its frame the flex child. Give the frame a responsive `maxHeight` and keep
`overflow-x: auto` plus `overflow-y: auto` in the shared table. The summary
must be `flex: 0 0 auto`, so it remains visible when the row frame acquires a
vertical scrollbar. Use logical properties and existing light/dark/RTL tokens;
do not add a feature body scroll or a second page-height calculation.

The page action footer is outside the form's overflow region and remains
reachable at all row counts:

```html
</form>
<footer class="feature-page-actions">
  <button type="button" (click)="requestClose()">…</button>
  @if (!isView()) {
    <app-primary-action-button
      [label]="'general.save' | translate"
      icon="bi bi-check2-circle"
      (pressed)="save()"
    />
  }
</footer>
```

**Check:** route approval is recorded before using this variant · one parent
`FormGroup` · fixed shell ends above the normal app footer · no page/body scroll
introduced · section Add is projected into the title row · child table owns the
only row scroll · totals/discount/grand total remain outside the table frame and
visible · action footer is outside the clipped form body · `Save` is hidden in
View mode · logical properties, RTL, dark theme and print overrides remain
valid.

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

The shared `app-editor-dialog` owns `appendTo="body"`, modal/drag/resize behavior,
the header hierarchy and close control, responsive shell sizing, footer action
markup, primary-icon contrast, focus styling, RTL, dark theme and Escape output.
Do not recreate its `pTemplate="header"`, footer buttons, or internal classes in
feature templates/SCSS. A feature owns projected content and may supply only the
documented public inputs, outputs and `dialogClass` hook.

---

