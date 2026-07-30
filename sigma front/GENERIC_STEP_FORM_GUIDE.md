# Generic Angular Step Form Guide

This is the project standard for full-page Create, View, and Edit forms that
contain multiple logical sections. It is based on the completed
`Customers/Individual/IndividualPartner` workflow and is intended to produce
the same behavior in other features such as Company Partner.

Use this guide together with
`GENERIC_ANGULAR_GRID_SCREEN_GUIDE_REVIEWED.md`. The reviewed grid guide covers
the list screen and row actions; this guide covers the full-page editor opened
by explicit Create, View, and Edit routes. Its compact-dialog rule does not
apply to a multi-step full-page editor.

## 1. Required outcome

A compliant step form must have:

- one title inside the editor card and no duplicate router title outside it;
- a back button at the start of the title row;
- explicit Create, View, and Edit routes;
- one reusable reactive form for all three modes;
- a compact, clickable, responsive stepper;
- a fixed title/header, fixed stepper, and fixed footer;
- vertical scrolling only inside the form-content region;
- no vertical page/body scrollbar while the editor route is active;
- validation messages in the stepper header;
- validation items that navigate, scroll, focus, and highlight the exact field;
- validation items that disappear immediately after their field is corrected;
- searchable dropdown overlays appended to `body`;
- the shared themed datepicker panel;
- safe nested collection rows with icon Add/Delete/Upload actions;
- full light, dark, RTL, keyboard, and responsive support;
- backend-aligned DTOs and normalized payload values.

## 2. Reference implementation

Use these files as the behavior and visual reference:

```text
src/app/modules/Customers/Individual/IndividualPartner/
├── individualpartner.routes.ts
└── components/details/
    ├── details.component.ts
    ├── details.component.html
    └── details.component.scss
```

Do not copy customer-specific field names blindly. Copy the shell, state
management, mode behavior, validation behavior, date/upload patterns, theme
rules, and responsive behavior. Preserve the target feature's own DTO fields
and business collections.

## 3. Recommended feature structure

```text
feature-name/
├── feature.routes.ts
├── models/
│   ├── details.ts
│   ├── create.ts
│   └── list.ts
├── services/
│   └── feature.service.ts
└── components/
    ├── list/
    └── details/
        ├── details.component.ts
        ├── details.component.html
        └── details.component.scss
```

Large feature-specific steps may remain standalone child components:

```text
components/details-form/
├── basic-info/
├── contacts/
├── documents/
├── billing/
├── credit-cards/
└── drivers/
```

Child components must receive the parent `FormGroup`. They must not create an
unrelated form that is absent from the parent payload.

## 4. Route contract

Declare all modes explicitly:

```ts
export const FeatureRoutes: Routes = [
  { path: '', component: FeatureListComponent },
  {
    path: 'create',
    component: FeatureDetailsComponent,
    data: { mode: 'create' },
  },
  {
    path: 'view/:id',
    component: FeatureDetailsComponent,
    data: { mode: 'view' },
  },
  {
    path: 'edit/:id',
    component: FeatureDetailsComponent,
    data: { mode: 'edit' },
  },

  // Optional compatibility route for old links.
  {
    path: 'details/:id',
    component: FeatureDetailsComponent,
    data: { mode: 'view' },
  },
];
```

Rules:

- Never infer mode only by checking whether an ID exists.
- Read the route `data.mode` once during construction or initialization.
- Create has no ID.
- View and Edit require an ID.
- A compatibility `details/:id` route must map to View, not Edit.

## 5. Mode state

```ts
type EditorMode = 'create' | 'view' | 'edit';

readonly pageMode = signal<EditorMode>('create');
readonly isViewMode = computed(() => this.pageMode() === 'view');
readonly isEditableMode = computed(() => this.pageMode() !== 'view');
readonly saving = signal(false);

readonly pageTitleKey = computed(() => {
  if (this.pageMode() === 'view') return 'featureForm.viewTitle';
  if (this.pageMode() === 'edit') return 'featureForm.editTitle';
  return 'featureForm.createTitle';
});
```

Mode rules:

| Behavior | Create | View | Edit |
|---|---:|---:|---:|
| Load record | No | Yes | Yes |
| Form enabled | Yes | No | Yes |
| Step buttons usable | Yes | Yes | Yes |
| Add/Delete/Upload usable | Yes | No | Yes |
| Save visible | Yes | No | Yes |
| Edit shortcut visible | No | Yes | No |
| Footer Cancel text | Cancel | Close | Cancel |
| Footer Previous/Next | Yes | Yes | Yes |

Disable the form only after loaded data has been patched:

```ts
private applyFormMode(): void {
  if (this.isViewMode()) {
    this.form.disable({ emitEvent: false });
  } else {
    this.form.enable({ emitEvent: false });
  }
}
```

Disabling the form must not disable navigation between steps. Step buttons are
outside the form controls and remain clickable in View mode.

## 6. Step definition and reactive state

Keep the step definition in TypeScript:

```ts
readonly FORM_STEPS = [
  {
    key: 'details',
    label: 'featureForm.steps.details',
    description: 'featureForm.steps.detailsDescription',
    icon: 'bi bi-person',
  },
  {
    key: 'documents',
    label: 'featureForm.steps.documents',
    description: 'featureForm.steps.documentsDescription',
    icon: 'bi bi-file-earmark-check',
  },
  {
    key: 'billing',
    label: 'featureForm.steps.billing',
    description: 'featureForm.steps.billingDescription',
    icon: 'bi bi-credit-card',
  },
] as const;

readonly currentStepIndex = signal(0);
readonly currentStep = computed(
  () => this.FORM_STEPS[this.currentStepIndex()],
);
readonly stepProgress = computed(() =>
  this.FORM_STEPS.length <= 1
    ? 100
    : (this.currentStepIndex() / (this.FORM_STEPS.length - 1)) * 100,
);
```

Do not base a `computed` value on a plain mutable property. A computed value
only updates when it reads a signal. The current step index or current step key
must therefore be a signal.

## 7. Page shell and no-page-scroll rule

The visual hierarchy is:

```text
editor page (overflow hidden)
└── editor card (flex column, overflow hidden)
    ├── title/header (fixed)
    ├── stepper and validation summary (fixed)
    └── card body (flex, overflow hidden)
        └── form (flex column, overflow hidden)
            ├── step content (overflow-y auto)
            └── footer actions (fixed)
```

Core SCSS:

```scss
:host {
  display: block;
  min-width: 0;
  min-height: 0;
  height: 100%;
}

.editor-page {
  display: flex;
  min-width: 0;
  min-height: 0;
  height: calc(
    100dvh
    - var(--bs-app-header-height, 74px)
    - var(--bs-app-footer-height, 60px)
    - 6px
  );
  max-height: calc(
    100dvh
    - var(--bs-app-header-height, 74px)
    - var(--bs-app-footer-height, 60px)
    - 6px
  );
  flex-direction: column;
  overflow: hidden;
}

.editor-card,
.editor-body,
.editor-form {
  display: flex;
  min-height: 0;
  flex: 1 1 auto;
  flex-direction: column;
  overflow: hidden;
}

.editor-scroll {
  min-height: 0;
  flex: 1 1 auto;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.editor-actions {
  flex: 0 0 auto;
}
```

Prefer making the routed editor shell the single scroll owner without mutating
global `html`/`body` classes. If the application shell genuinely requires a
global scroll lock, use one shared reference-counted scroll-lock service so a
nested dialog/editor cannot remove a lock still owned by another overlay. Do
not add and remove a feature-specific body class independently.

Important:

- Do not place `overflow-y: auto` on the page, card, body, and step content at
  the same time.
- There must be one vertical scrolling owner: `.editor-scroll`.
- Keep the footer outside `.editor-scroll`.
- When a shared lock is required, release exactly the ownership token acquired
  by the current component during destruction.

## 8. Title/header

Use one concise title:

```html
<header class="editor-heading">
  <button
    type="button"
    class="editor-back"
    (click)="cancel()"
    [attr.aria-label]="'general.back' | translate"
  >
    <i class="bi bi-arrow-left" aria-hidden="true"></i>
  </button>

  <h1>{{ pageTitleKey() | translate }}</h1>

  @if (isViewMode()) {
    <button type="button" class="primary-action" (click)="openEdit()">
      <i class="bi bi-pencil-square" aria-hidden="true"></i>
      {{ 'general.edit' | translate }}
    </button>
  }
</header>
```

Do not render:

```text
Entity
Create New Entity
Description...
```

when a single `Create New Entity` title is enough.

## 9. Stepper markup

The example below implements the ARIA tabs pattern. If the screen will not
implement linked tab panels, roving focus, and arrow-key behavior, do not
declare `tablist`/`tab`; use a labelled `<nav>` or `<ol>` of step buttons
instead.

```html
<div
  class="editor-stepper"
  role="tablist"
  [attr.aria-label]="'featureForm.steps' | translate"
  (keydown)="onStepKeydown($event)">
  <div class="editor-stepper-track" aria-hidden="true">
    <span [style.width.%]="stepProgress()"></span>
  </div>

  @for (step of FORM_STEPS; track step.key; let index = $index) {
    <button
      type="button"
      class="editor-step"
      role="tab"
      [id]="'editor-step-' + step.key"
      [attr.aria-controls]="'editor-panel-' + step.key"
      [class.is-active]="currentStepIndex() === index"
      [class.is-complete]="currentStepIndex() > index"
      [attr.aria-selected]="currentStepIndex() === index"
      [attr.aria-current]="currentStepIndex() === index ? 'step' : null"
      [attr.tabindex]="currentStepIndex() === index ? 0 : -1"
      (click)="goToStep(index)"
    >
      <span class="editor-step-number">
        @if (currentStepIndex() > index) {
          <i class="bi bi-check-lg" aria-hidden="true"></i>
        } @else {
          <i [class]="step.icon" aria-hidden="true"></i>
        }
      </span>
      <span class="editor-step-copy">
        <strong>{{ step.label | translate }}</strong>
        <small>{{ step.description | translate }}</small>
      </span>
    </button>
  }
</div>

@for (step of FORM_STEPS; track step.key; let index = $index) {
  <section
    role="tabpanel"
    [id]="'editor-panel-' + step.key"
    [attr.aria-labelledby]="'editor-step-' + step.key"
    [hidden]="currentStepIndex() !== index">
    <!-- Step content -->
  </section>
}
```

Stepper rules:

- Active, complete, and future steps need different visual states.
- Completed steps use a check icon.
- Clicking a previous step is always allowed.
- Clicking a future step validates the current step first in Create/Edit.
- Left/Right Arrow move roving focus between horizontal tabs; Home/End move to
  the first/last tab; Enter/Space activate the focused step.
- In RTL, visual arrow behavior must follow the rendered order.
- Every tab references one `tabpanel`, and every panel references its tab.

```ts
onStepKeydown(event: KeyboardEvent): void {
  const tabs = Array.from(
    (event.currentTarget as HTMLElement)
      .querySelectorAll<HTMLButtonElement>('[role="tab"]'),
  );
  const current = tabs.indexOf(document.activeElement as HTMLButtonElement);
  if (current < 0) return;

  let next = current;
  if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = tabs.length - 1;
  else if (event.key === 'ArrowRight') next = (current + 1) % tabs.length;
  else if (event.key === 'ArrowLeft') {
    next = (current - 1 + tabs.length) % tabs.length;
  } else if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    this.goToStep(current);
    return;
  } else {
    return;
  }

  event.preventDefault();
  tabs[next]?.focus();
}
```
- View mode allows free movement across every step.
- On small screens, the stepper may scroll horizontally; do not shrink labels
  until unreadable.

## 10. Step navigation and validation gates

```ts
goToStep(index: number): void {
  if (index < 0 || index >= this.FORM_STEPS.length) return;

  if (
    !this.isViewMode()
    && index > this.currentStepIndex()
    && !this.validateCurrentStep()
  ) {
    return;
  }

  this.activateStep(index);
}

private activateStep(index: number): void {
  this.currentStepIndex.set(index);
  requestAnimationFrame(() =>
    this.stepScroll.nativeElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    }),
  );
}
```

Validation navigation must be able to bypass the forward-step gate. Otherwise
clicking a missing field from a later step may be blocked by an earlier invalid
step. Use the private `activateStep` method from validation navigation.

## 11. Validation summary

The validation summary belongs below the stepper, not at the bottom of the
form. It must contain:

- a visible error icon;
- a clear title;
- a short instruction;
- the current invalid-field count;
- clickable field items.

Example:

```html
@if (validationAttempted() && invalidFields().length > 0) {
  <div class="editor-validation" role="alert" aria-live="polite">
    <i class="bi bi-exclamation-lg" aria-hidden="true"></i>
    <div>
      <strong>{{ 'featureForm.validationTitle' | translate }}</strong>
      <small>{{ 'featureForm.validationHint' | translate }}</small>
    </div>
    <span>
      {{ 'featureForm.invalidFields'
        | translate: { count: invalidFields().length } }}
    </span>

    <div class="editor-validation-fields">
      @for (field of invalidFields(); track field.controlPath) {
        <button type="button" (click)="navigateToInvalidField(field)">
          <i class="bi bi-arrow-down-right-circle"></i>
          {{ field.labelKey | translate }}
        </button>
      }
    </div>
  </div>
}
```

Recommended field descriptor:

```ts
interface InvalidField {
  labelKey: string;
  controlPath: string;
  stepIndex: number;
}
```

For arrays, keep the row index in `controlPath`:

```text
documents.0.documentType
billing.creditCards.2.cardNumber
drivers.1.documents.0.expiryDate
```

## 12. Live validation-item removal

Do not compute the missing-field list only when Save is clicked. Once the
summary is visible, update it on every form change:

```ts
readonly validationAttempted = signal(false);
readonly invalidFields = signal<InvalidField[]>([]);

this.form.valueChanges
  .pipe(takeUntilDestroyed(this.destroyRef))
  .subscribe(() => {
    if (this.validationAttempted()) {
      this.refreshInvalidFields();
    }
  });

private refreshInvalidFields(): void {
  const fields = this.collectInvalidFields();
  this.invalidFields.set(fields);

  if (fields.length === 0) {
    this.validationAttempted.set(false);
  }
}
```

Expected behavior:

1. User clicks Next or Save.
2. Missing-field list appears.
3. User completes one field.
4. That field disappears immediately from the list.
5. When the last field is valid, the entire validation error summary hides.

## 13. Navigate, scroll, focus, and highlight

A validation item must do all four actions:

1. activate the field's step;
2. scroll the exact field or array row into view;
3. focus the input/dropdown/calendar;
4. highlight the visible control briefly.

Every control that can appear in the missing-field list must expose its full
reactive-form path in the DOM. Do not rely only on `formControlName`: repeated
rows commonly contain the same names and will focus the wrong row.

```html
<!-- Normal field -->
<input
  formControlName="name"
  [attr.data-control-path]="'details.name'"
/>

<!-- FormArray field -->
<p-dropdown
  formControlName="documentType"
  [attr.data-control-path]="'documents.' + rowIndex + '.documentType'"
></p-dropdown>
```

The validation descriptor must carry that same `controlPath`. Use it as the
primary selector and retain the `formControlName` lookup only as a defensive
fallback for older child components.

```ts
navigateToInvalidField(field: InvalidField): void {
  this.activateStep(field.stepIndex);

  window.setTimeout(() => {
    const parts = field.controlPath.split('.');
    const controlName = parts.at(-1)!;
    const rowIndex = parts.find((part) => /^\d+$/.test(part));
    const scope = this.stepScroll.nativeElement;

    const exactTarget = scope.querySelector<HTMLElement>(
      `[data-control-path="${CSS.escape(field.controlPath)}"]`,
    );
    const matches = Array.from(
      scope.querySelectorAll<HTMLElement>(
        `[formcontrolname="${controlName}"]`,
      ),
    );
    const target =
      exactTarget ?? matches[rowIndex ? Number(rowIndex) : 0] ?? matches[0];
    if (!target) return;

    const visualTarget =
      target.matches('.p-dropdown, .p-calendar')
        ? target
        : target.querySelector<HTMLElement>('.p-dropdown, .p-calendar')
          ?? target;
    const focusTarget =
      target.matches('input, textarea, select, button')
        ? target
        : target.querySelector<HTMLElement>(
            'input:not([type="hidden"]), textarea, select, button, [tabindex]',
          ) ?? target;

    visualTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
    visualTarget.classList.add('is-validation-target');
    window.setTimeout(() => {
      focusTarget.focus({ preventScroll: true });
      const dropdown = target.matches('.p-dropdown')
        ? target
        : target.querySelector<HTMLElement>('.p-dropdown');
      dropdown?.click();
    }, 180);

    window.setTimeout(
      () => visualTarget.classList.remove('is-validation-target'),
      1800,
    );
  }, 80);
}
```

Highlight style:

```scss
:host ::ng-deep .is-validation-target {
  border-color: #e9a23b !important;
  outline: 3px solid rgb(233 162 59 / 18%) !important;
  box-shadow: 0 0 0 1px #e9a23b !important;
}
```

Use `@ViewChild` for the scroll container when practical. A route-level query
is acceptable only if the page guarantees one editor instance.

## 14. Form initialization

The parent component owns the complete payload form:

```ts
this.form = this.fb.group({
  details: this.fb.group({
    name: ['', Validators.required],
    branchId: [null, Validators.required],
  }),
  contacts: this.fb.array([]),
  documents: this.fb.array([]),
  billing: this.fb.group({
    creditPeriod: [0],
    creditLimit: [0],
    creditCards: this.fb.array([]),
  }),
  drivers: this.fb.array([]),
});
```

Rules:

- Required validators must match backend `[Required]` rules.
- Do not make optional backend fields required only because an old UI did.
- Do not omit required nested fields.
- The parent defines the complete API form shape before child steps render.
- Child components receive their `FormGroup`/`FormArray` and manage values or
  rows; they do not opportunistically change the contract after loading.
- Avoid logic that adds the same checkbox/dropdown twice.
- Use boolean defaults for checkboxes, `null` for dropdowns/dates, `0` for
  numeric amounts when zero is a meaningful default, and `''` for text.

For a genuinely dynamic extension field, register it once through an explicit
parent-owned method before record loading:

```ts
registerExtensionField(field: ExtensionField): void {
  if (!this.form.contains(field.name)) {
    this.form.addControl(field.name, this.createControl(field));
  }
}
```

Do not let multiple step components race to add the same control during
`ngOnInit`/`ngOnChanges`.

## 15. Load and patch order

Recommended order:

1. configure route mode;
2. initialize the entire form shape;
3. load dropdown/select data;
4. load the record for View/Edit;
5. clear and rebuild every `FormArray`;
6. patch scalar values;
7. apply mode (disable for View);
8. stop loading.

For dates used by PrimeNG Calendar, patch `Date` objects. First classify each
backend field:

- **date-only business value** such as Date of Birth, joining date, issue date,
  or expiry date: preserve the calendar day as `yyyy-MM-dd`;
- **timestamp**: preserve time and timezone using the backend UTC convention.

Parse a date-only value from its components so JavaScript does not reinterpret
it as UTC:

```ts
private parseDateOnly(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  return date.getFullYear() === year
    && date.getMonth() === month - 1
    && date.getDate() === day
      ? date
      : null;
}
```

Do not patch `yyyy-MM-dd` strings into a calendar that expects `Date`, and do
not parse date-only strings with `new Date(value)`.

## 16. Dropdown standard

All editor dropdowns should follow this pattern unless the field is tiny and
has only two fixed values:

```html
<p-dropdown
  formControlName="branchId"
  [options]="branchOptions()"
  optionLabel="value"
  optionValue="id"
  [filter]="true"
  filterBy="value"
  [showClear]="true"
  appendTo="body"
  [placeholder]="'featureForm.selectBranch' | translate"
></p-dropdown>
```

Rules:

- Use the endpoint's actual `id` and display `value`.
- For Contact Group on customer forms, call
  `ContactGroup/GetSelect` filtered by `ContactType.Customer`.
- Append overlays to `body` so fixed/scrolling containers do not clip them.
- Ensure overlay panels have global light/dark theme rules.
- Use a stable `optionValue` type. Convert numeric IDs before sending payloads.

## 17. Backend-sourced enums

When the backend provides enum select endpoints, prefer them so a backend enum
change appears without a frontend deployment. If an API does not yet expose the
enum, a shared string enum is acceptable temporarily.

String business choices must be normalized before patch and before save:

```ts
enum CalculationType {
  Fixed = 'Fixed',
  Percentage = 'Percentage',
}

private normalizeCalculationType(value: unknown): CalculationType | null {
  const normalized = String(value ?? '').trim().toLowerCase();
  if (normalized === 'fixed') return CalculationType.Fixed;
  if (normalized === 'percentage') return CalculationType.Percentage;
  return null;
}
```

This guarantees the request sends exact strings:

```json
{
  "salikRentalType": "Fixed",
  "salikLeaseType": "Percentage",
  "rentalType": "Fixed",
  "leaseType": "Percentage"
}
```

## 18. Reusable datepicker standard

Use PrimeNG Calendar for date inputs:

```html
<p-calendar
  formControlName="issueDate"
  [showIcon]="true"
  [showButtonBar]="true"
  appendTo="body"
  panelStyleClass="sigma-datepicker-panel"
  dateFormat="dd/mm/yy"
  placeholder="dd/mm/yyyy"
></p-calendar>
```

The global `sigma-datepicker-panel` must style:

- panel surface and border;
- month/year controls;
- weekday labels;
- selected, today, hover, and disabled days;
- button bar;
- light and dark themes;
- RTL direction.

Do not recreate datepicker CSS in each component.

## 19. Issue/expiry date rule

The boundary is a business decision, not a universal UI rule. Inspect the
backend contract and use exactly one of:

- inclusive: expiry is on or after issue (`expiry >= issue`);
- strict: expiry is after issue (`expiry > issue`).

The example below implements the strict rule. Rename the validator and adjust
the comparison/minimum date when the backend allows the same day:

```ts
readonly expiryAfterIssueDate: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const issue = control.get('issueDate')?.value;
  const expiry = control.get('expiryDate')?.value;
  if (!issue || !expiry) return null;

  const issueDate = issue instanceof Date ? issue : this.parseDateOnly(issue);
  const expiryDate = expiry instanceof Date ? expiry : this.parseDateOnly(expiry);
  if (!issueDate || !expiryDate) return null;
  if (
    Number.isNaN(issueDate.getTime())
    || Number.isNaN(expiryDate.getTime())
  ) {
    return null;
  }

  return expiryDate.getTime() > issueDate.getTime()
    ? null
    : { expiryAfterIssueDate: true };
};
```

Apply it to the row `FormGroup`, not to only one control.

The UI must also prevent invalid selection:

```html
<p-calendar
  formControlName="expiryDate"
  [minDate]="getExpiryMinimum(document)"
></p-calendar>
```

### Stable min/max `Date` references

Do not create a new `Date` from a template-called method on every change
detection cycle. This can cause repeated PrimeNG updates and UI freezing.

Cache the minimum per form-row control:

```ts
private readonly expiryMinimumCache = new WeakMap<
  AbstractControl,
  { issueDateTimestamp: number; minimumDate: Date }
>();

getExpiryMinimum(row: AbstractControl): Date | undefined {
  const value = row.get('issueDate')?.value;
  if (!value) return undefined;

  const parsed = value instanceof Date ? value : this.parseDateOnly(value);
  if (!parsed || Number.isNaN(parsed.getTime())) return undefined;

  const timestamp = parsed.getTime();
  const cached = this.expiryMinimumCache.get(row);
  if (cached?.issueDateTimestamp === timestamp) {
    return cached.minimumDate;
  }

  const minimumDate = new Date(timestamp);
  minimumDate.setHours(0, 0, 0, 0);
  minimumDate.setDate(minimumDate.getDate() + 1);

  this.expiryMinimumCache.set(row, {
    issueDateTimestamp: timestamp,
    minimumDate,
  });
  return minimumDate;
}
```

## 20. Editable collection standard

Documents, cards, contacts, and drivers use compact editable tables:

- section heading with icon, title, and one-line description;
- sticky or visually distinct header;
- horizontal scroll inside the section only;
- icon-only row actions with accessible labels;
- Add button below the table;
- empty state row;
- row-level validation message;
- no page-level horizontal or vertical overflow.

Use stable tracking:

```html
@for (row of rows.controls; let i = $index; track row) {
  <tr [formGroupName]="i">...</tr>
}
```

Do not track only `row.value.id` because every new row may have ID `0`.

## 21. Document upload standard

Do not show the native browser file input as the main UI. Use:

- current file/path display;
- Upload icon button;
- loading icon while uploading;
- Remove icon button when a file exists;
- hidden native input;
- accepted-extension list;
- required validation when the backend needs a path.

```html
<label class="icon-button is-upload">
  <i class="bi bi-cloud-arrow-up"></i>
  <input
    type="file"
    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
    [disabled]="isViewMode() || uploading"
    (change)="onFileSelect($event, rowIndex)"
  />
</label>
```

Upload-state rules:

- Track loading by row, not one global boolean.
- Clear the native input value after each selection so the same file can be
  selected again.
- Patch the returned server path into `documentPath`.
- Mark `documentPath` touched after success or removal.
- Never send a browser fake path.
- Disable Upload and Remove in View mode.
- Validate file size and extension in Angular for immediate feedback, but never
  treat those client checks as security.
- Require the backend to validate authorization, tenant/parent ownership,
  maximum size, allowed extension, MIME type, and file signature.
- Generate the storage name on the server; do not trust the original filename
  as a path.
- Define replacement, remove, failed-parent-save, orphan cleanup, and permanent
  deletion behavior.
- Preserve the existing stored path when Edit submits no replacement.

## 22. Credit-card standard

Only render payment-card fields when an approved payment workflow requires
them. Card rows may include:

- type dropdown;
- card number;
- month/year expiry calendar;
- masked CVV input used only for immediate authorization;
- name on card;
- bank name;
- default checkbox;
- optional active date;
- icon Delete action.

Security rules:

- Use `type="password"` for CVV entry.
- Collect CVV only when required to authorize the current transaction.
- Never persist CVV after authorization, even encrypted.
- Never return CVV in Detail/Edit/View models.
- Do not log card number or CVV.
- Do not put card details in route/query strings.
- Prefer a payment-provider token instead of storing card data.
- Export sensitive fields only when the approved business export explicitly
  requires them.
- View mode should avoid exposing full sensitive values when masking is part of
  the product policy.

## 23. Child dialogs inside a step

Complex nested items such as Company Drivers may use a modal editor:

- append the dialog to `body`;
- give it a bounded width and max viewport height;
- scroll the dialog content, not the whole page;
- use the same field/dropdown/calendar standards;
- use Cancel and Save in the dialog footer;
- do not push the draft into the parent array until the draft is valid;
- clone nested arrays when editing; do not mutate the saved row until Save.

## 24. Footer actions

The footer is outside the scroll region:

```html
<footer class="editor-actions">
  <button type="button" class="secondary-action" (click)="cancel()">
    {{ (isViewMode() ? 'general.close' : 'general.cancel') | translate }}
  </button>

  <div class="editor-step-actions">
    @if (currentStepIndex() > 0) {
      <button type="button" class="secondary-action" (click)="previous()">
        {{ 'general.previous' | translate }}
      </button>
    }

    @if (currentStepIndex() < FORM_STEPS.length - 1) {
      <button type="button" class="primary-action" (click)="next()">
        {{ 'general.next' | translate }}
      </button>
    } @else if (!isViewMode()) {
      <button
        type="button"
        class="primary-action"
        [disabled]="saving()"
        (click)="save()"
      >
        {{ 'general.save' | translate }}
      </button>
    }
  </div>
</footer>
```

Rules:

- Save appears on the last step only unless the product requires otherwise.
- Save must be protected against duplicate clicks.
- Show a visible saving state.
- View mode shows Close and may offer Edit in the header.
- Previous and Next are step-navigation controls in Create, View, and Edit.
  Do not reduce the View footer to a Close button only.
- Hide or disable Previous on the first step and Next on the last step. On the
  final View step, show Previous but never replace Next with Save.
- Keep Close/Cancel separate from the step-navigation group, normally at the
  opposite edge of the fixed footer.
- In View mode, Previous and Next move freely without running editable-form
  validation gates. They must not enable the disabled form controls.
- Keep all footer actions outside the internal scroll owner so Close,
  Previous, and Next remain visible while step content scrolls.

## 25. Save workflow

```ts
save(): void {
  if (!this.isEditableMode() || this.saving()) return;

  this.validationAttempted.set(true);
  this.form.markAllAsTouched();
  this.refreshInvalidFields();

  if (this.form.invalid) {
    const first = this.invalidFields()[0];
    if (first) this.navigateToInvalidField(first);
    return;
  }

  this.saving.set(true);
  this.loading.startLoading();
  const payload = this.buildPayload(this.form.getRawValue());

  const request$ = this.pageMode() === 'create'
    ? this.service.create(payload)
    : this.service.update(payload);

  request$
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => {
        this.saving.set(false);
        this.loading.endLoading();
      }),
    )
    .subscribe({
      next: (result) => {
        if (result.isSuccess) this.cancel();
      },
    });
}
```

`getRawValue()` may be used to read disabled mutable controls, but it is never
the API payload. Pass it to a typed builder that explicitly selects allowed
fields. Do not spread tenant, generated number, audit, deletion, calculated,
authorization, or other server-owned controls into the request.

## 26. Payload normalization

Build an explicit request object. Do not send raw form state blindly.

Normalize:

- `''` to `null` for nullable IDs/enums;
- dropdown IDs to numbers;
- enum display labels to API enum values;
- date-only calendar values to `yyyy-MM-dd`;
- timestamp values to the backend's explicit UTC format;
- calculation types to exact strings;
- `undefined` booleans to explicit defaults;
- nested address and billing IDs;
- existing child `id` fields needed to identify rows during Update;
- uploaded paths from the server response.

Helpers:

```ts
private toNullableInt(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

private toDateOnly(value: Date | null): string | null {
  if (!value || Number.isNaN(value.getTime())) return null;
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
```

For Update:

- preserve the entity ID;
- preserve nested entity IDs;
- omit `SubscriptionId`, generated `No`, audit fields, calculated totals,
  deletion state, and other server-owned fields from normal payloads;
- if a legacy base contract still requires `SubscriptionId` or `No`, isolate
  that compatibility in the service adapter as an untrusted assertion; the
  backend must compare/ignore it and preserve the stored value;
- send deleted/removed rows according to backend reconciliation behavior.

## 27. Backend contract checklist

Before building the form, inspect:

- Add VM;
- Update VM;
- Detail VM;
- List VM;
- service foreign-key validation;
- duplicate rules;
- nested collection update behavior;
- delete/reference guards;
- select endpoints;
- enum endpoints.

Confirm each form field maps to one real request property.

Confirm the Detail endpoint returns everything needed by View/Edit:

- direct values;
- resolved select values/IDs;
- address;
- billing;
- documents;
- cards;
- child contacts/drivers/items.

Never add a frontend action whose backend endpoint does not exist.

## 28. Service methods

Prefer explicit typed methods:

```ts
getDetails(id: number | string): Observable<Result<FeatureDetails>> { ... }
create(payload: FeatureCreateRequest): Observable<Result<unknown>> { ... }
update(payload: FeatureUpdateRequest): Observable<Result<unknown>> { ... }
delete(id: number | string): Observable<Result<unknown>> { ... }
```

Use the same authenticated `HttpClient`/base service/interceptor as working
screens. Do not create a separate client that skips the authorization pipeline.

## 29. Dark theme

Every visible layer needs a dark equivalent:

- page canvas;
- editor card;
- title row;
- stepper header and track;
- active/complete steps;
- validation summary;
- section cards and headings;
- inputs, dropdowns, calendars;
- editable table headers/rows;
- empty states;
- icon buttons;
- dialog surfaces;
- overlay panels;
- footer actions.

Do not fix only the table while leaving the surrounding card white.

Prefer CSS variables on the page root:

```scss
.editor-page {
  --editor-text: #243648;
  --editor-muted: #708295;
  --editor-border: #dce5ed;
  --editor-surface: #fff;
  --editor-canvas: #f4f7fa;
}

:host-context([data-bs-theme='dark']) .editor-page {
  --editor-text: #e4edf5;
  --editor-muted: #9dafbf;
  --editor-border: #405364;
  --editor-surface: #19232d;
  --editor-canvas: #111820;
}
```

## 30. RTL

Use logical properties:

- `margin-inline-start`;
- `margin-inline-end`;
- `padding-inline`;
- `inset-inline-start`;
- `text-align: start`.

Reverse direction-sensitive icons where needed:

```scss
:host-context([dir='rtl']) .editor-back i,
:host-context([dir='rtl']) .next-action i {
  transform: scaleX(-1);
}
```

Dropdown and calendar overlays appended to `body` must inherit or explicitly
receive RTL direction.

## 31. Responsive behavior

Desktop:

- show icon, title, and description for each step;
- use 2–3 form columns depending on width;
- keep collection rows compact.

Tablet:

- reduce step copy and gaps;
- use two form columns;
- keep horizontal scrolling inside editable tables.

Mobile:

- one form column;
- horizontally scrollable stepper;
- compact title/footer;
- action buttons may wrap;
- dialogs use `calc(100vw - 16px)`;
- never introduce page-level horizontal scrolling.

Large monitors:

- the card expands to use available height;
- the internal content area expands;
- footer remains fixed;
- do not use a fixed small pixel height that leaves a large blank region;
- still subtract the actual app header/footer so the page does not scroll.

## 32. Accessibility

Required:

- `type="button"` on non-submit buttons;
- when tab semantics are used: linked `tablist`, `tab`, and `tabpanel` roles,
  `aria-controls`, `aria-labelledby`, `aria-selected`, roving `tabindex`, and
  the standard arrow/Home/End/Enter/Space keyboard behavior;
- otherwise, a labelled navigation/list pattern without partial tab roles;
- `aria-current="step"` on the active step navigation item;
- accessible labels on icon-only buttons;
- visible keyboard focus;
- `role="alert"` and `aria-live="polite"` on validation summary;
- real labels associated with inputs;
- disabled states in View mode;
- keyboard focus moved to the selected invalid field;
- color is not the only indicator of invalid/complete state.

## 33. Performance rules

- Use signals for reactive visual state.
- Do not create new arrays/dates/objects in template-called methods unless
  cached.
- Cache calendar min/max dates by row.
- Use `takeUntilDestroyed`.
- Use `finalize` for loading/saving cleanup.
- Track editable rows by control reference.
- Avoid repeated subscriptions on language/mode changes.
- Avoid session cache keys shared by incompatible data shapes.
- Do not reload all select lists on every step navigation.
- Do not render all heavy step content simultaneously unless needed.

## 34. Common failure modes

### Page still scrolls

Cause:

- page height does not subtract header/footer;
- body lock applied to only `body`, not `html`;
- footer placed inside the scroll region;
- multiple ancestors own vertical scrolling.

Fix:

- lock `html` and `body`;
- keep one `.editor-scroll`;
- use `min-height: 0` on every flex ancestor;
- keep footer outside the scroll region.

### View mode cannot change steps

Cause:

- step buttons are inside a disabled fieldset;
- navigation is blocked whenever form invalid.
- the View footer was simplified to Close and omitted Previous/Next.

Fix:

- keep step buttons outside disabled controls;
- skip validation gates in View mode.
- render the same Previous/Next group in View mode, but never render Save.

### Validation item changes step but does not focus

Cause:

- no stable element/control selector;
- focus occurs before the step renders;
- focus is applied to the PrimeNG host instead of its input.

Fix:

- keep a full control path in both the validation descriptor and the
  control's `data-control-path` attribute;
- activate step first;
- wait for rendering;
- focus the inner input;
- scroll and highlight the visible widget.

### Missing-field item stays after correction

Cause:

- invalid list was generated only when Save was clicked.

Fix:

- refresh it from `form.valueChanges` while validation is active;
- hide the summary when the list reaches zero.

### Dropdown/calendar is clipped

Cause:

- overlay renders inside an overflow-hidden card.

Fix:

- `appendTo="body"`;
- use global overlay theme classes and correct z-index.

### Expiry calendar freezes

Cause:

- `[minDate]` receives a new `Date` on every change detection.

Fix:

- cache stable `Date` references in a `WeakMap`.

### Existing date is blank in Edit

Cause:

- API string was patched into a calendar expecting `Date`.

Fix:

- convert API dates to `Date` while rebuilding the form array.

### Nested row gives HTTP 400

Cause:

- enum IDs, required fields, nested IDs, dates, or uploaded path do not match
  the backend VM.

Fix:

- inspect Add/Update VMs;
- normalize every nested row explicitly;
- preserve update IDs/no values;
- test request JSON against the controller contract.

## 35. Verification matrix

Test every row:

| Area | Create | View | Edit |
|---|---:|---:|---:|
| Correct title | ✓ | ✓ | ✓ |
| Back/Cancel/Close | ✓ | ✓ | ✓ |
| Step click | ✓ | ✓ | ✓ |
| Next/Previous | ✓ | ✓ | ✓ |
| Future-step validation | ✓ | N/A | ✓ |
| Validation item focus | ✓ | N/A | ✓ |
| Live item removal | ✓ | N/A | ✓ |
| Internal scroll only | ✓ | ✓ | ✓ |
| Fixed footer | ✓ | ✓ | ✓ |
| Dropdown overlay | ✓ | ✓ | ✓ |
| Datepicker overlay | ✓ | ✓ | ✓ |
| Add/Delete nested rows | ✓ | disabled | ✓ |
| Upload/Remove | ✓ | disabled | ✓ |
| Save and duplicate-click guard | ✓ | N/A | ✓ |
| Payload IDs/enums/dates | ✓ | N/A | ✓ |
| Light theme | ✓ | ✓ | ✓ |
| Dark theme | ✓ | ✓ | ✓ |
| LTR | ✓ | ✓ | ✓ |
| RTL | ✓ | ✓ | ✓ |
| Desktop/24-inch | ✓ | ✓ | ✓ |
| Tablet/mobile | ✓ | ✓ | ✓ |

Also test:

- no rows, one row, and many rows in each collection;
- first and last invalid rows;
- same file selected twice;
- upload failure;
- issue date changed after expiry;
- direct URL to View/Edit;
- browser Back;
- slow API load;
- API validation error;
- save success and list refresh.

## 36. Owner-run verification

Do not build, test, or run Sigma unless the owner explicitly requests it in the
current task. Provide the following commands and acceptance scenarios for the
owner; record only results the owner returns.

Frontend commands the owner may run:

```powershell
npx tsc -p tsconfig.app.json --noEmit
npx ngc -p tsconfig.app.json
npm run build -- --configuration development
```

For backend changes, commands the owner may run:

```powershell
dotnet build SiGma.ViewModels.csproj --no-restore
dotnet build SiGma.Business.csproj --no-restore
dotnet build SiGma.ServerAPI.csproj --no-restore
```

If the full solution is slow, the owner can compile the changed project
dependency chain. Never claim a build or test result that was not supplied by
the owner, and do not report a timeout as success.

## 37. Definition of done

A step form is done only when:

- [ ] Create, View, Edit, and compatibility routes are correct.
- [ ] There is one title inside the card.
- [ ] Header, stepper, and footer remain visible.
- [ ] Only step content scrolls vertically.
- [ ] Page/body does not scroll.
- [ ] View mode is read-only but all steps remain accessible.
- [ ] View mode keeps Close plus Previous/Next in the fixed footer and never
      shows Save.
- [ ] Future-step navigation validates the current step.
- [ ] Save validates the complete form.
- [ ] Missing-field items navigate, scroll, focus, open, and highlight.
- [ ] Corrected missing-field items disappear live.
- [ ] Nested collection validators match backend VMs.
- [ ] Dropdown overlays are searchable and not clipped.
- [ ] Calendars use the shared panel and real `Date` values.
- [ ] Expiry is after issue and min dates use stable references.
- [ ] Upload controls use icon actions and server-returned paths.
- [ ] Add/Delete/Upload actions are disabled in View mode.
- [ ] Numeric IDs, enum values, dates, booleans, and string business types are
      normalized in the request.
- [ ] Light, dark, LTR, RTL, desktop, tablet, and mobile are verified.
- [ ] TypeScript, Angular compiler, SCSS, and bundled build pass.
- [ ] Any new backend endpoint and DTO compile successfully.
