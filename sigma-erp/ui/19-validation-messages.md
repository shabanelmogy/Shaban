## 19. Validation messages

**Topic files of this block** (read only the one the task needs; they are part of this block):

- [Money and tax in forms](19/01-money-and-tax.md)

> **Status: Canonical** — `shared/components/field-error` (`app-field-error`, 2026-10-01)

Shared keys live under `validationMessages` in `en.ts`/`ar.ts`, so messages read the same
everywhere:

The generic English required-field message is `Required field` (owner wording
request, 2026-10-04). `validationMessages.required` owns it; existing overrides
with the same generic meaning use that wording too. Keep keys, validators,
visibility timing and Arabic translations unchanged; contextual messages may
retain their necessary detail.

- `required`, `email`, `minlength`, `maxlength`, `min`, `max`, `pattern`;
- `number`, `digits`, `date`, `expiryAfterIssueDate`, `url`, `confirmPassword`, `unique`;
- `fileSize`, `fileType`, `maxItems`, `minItems`, `invalidSelection`;
- `custom` is the fallback.

**Numeric scale.** `decimalScaleValidator(() => decimalPlaces)` in
`shared/utils/scalar-validators` accepts optional empty values, requires a finite
number and rejects excess decimal scale, including exponent notation. It never
rounds a control. `appQuantityInput`'s classified profiles reuse it (block14),
and `FieldError` maps `decimalScale` to the neutral bilingual shared message.
Money retains `financialScaleValidator` and its `financialScale` message;
`FieldError` recognizes that existing key too. Requiredness, signs, bounds,
currency precision and domain calculations are separate owners. Reuse the
shared decimal-place reader rather than copying it into a feature validator.

`uniqueCheckFailed` identifies an unavailable duplicate preflight and remains
an invalid field until a successful retry; it is never treated as available.
The shared component shows `validationMessages.checking` with `role="status"`
while a touched/dirty control is PENDING, using the shared muted token rather
than error styling. Actual errors retain `role="alert"`. No feature-local
pending/error markup or toast is added. Early uniqueness and retry ownership
is defined by block12 and BE8.

**A message without a control** (a file the picker rejected, block 18) uses the same component:
`<app-field-error [message]="key" />`; `control` is then omitted.

**One inline error component.** Put `app-field-error` immediately below every control that has
a validator in an Add/Edit form, including validated controls inside editable child
collections. It owns the icon, colour, spacing and `role="alert"`, and it shows only once the
control is touched:

```html
<label for="driver-email" class="form-label required">{{ 'mangeDetails.email' | translate }}</label>
<input id="driver-email" type="email" formControlName="email"
       [attr.aria-invalid]="form.controls.email.invalid && form.controls.email.touched" />
<app-field-error [control]="form.controls.email" [messages]="{ pattern: 'companyForm.emailFormat' }" />
```

- Every error the control can produce gets the right message. An error name with a shared key
  uses `validationMessages.<error>` automatically. `[messages]` overrides a key per error name
  (`default` replaces the final fallback). Never write "email, otherwise required": it labels
  pattern, length and date-order errors as required.
- Every override key exists in `en.ts` **and** `ar.ts`. Add a feature key only when the
  validator needs context or parameters.
- On Save/submit, call `markAllAsTouched()` before returning so every invalid control reveals
  its message. A form-level summary may add context but never replaces the field messages.
- Features write no error markup, `validationMessageKey` helper or error CSS
  (`company-field-error`, `job-editor-field-error`, …); those copies are removed when the screen
  is reviewed.

**Reserve feedback without layout shifts.** The optional `reserveMessage` input
accepts an existing translation key representing the longest expected feedback.
The shared component renders that translated text and its icon invisibly
(`visibility:hidden`, `aria-hidden=true`) in the same grid cell as the active
message. Its actual wrapped geometry reserves space at the current language and
field width even when valid; it adds no duplicate alert. A longer active message
can still expand and is never clipped. Omit the input to retain content-sized
feedback. Keep error selection/validators feature-owned and use one error host
for mutually exclusive child/group errors. Customers Balance From/To reserves
its existing balanceRangeOrder message; shared FilterPanel stableLayout owns
neighbor alignment (block4). No feature error CSS or arbitrary fixed line count.

Mark the label, not the input, as required:

```html
<label class="form-label" [class.required]="field.required" [for]="'company-driver-' + field.name">
  {{ field.label | translate }}
</label>
```

On submit, reveal everything and move focus to the first invalid field:

```ts
if (this.driverDraft.invalid) {
  this.driverDraft.markAllAsTouched();
  const first = this.invalidFields()[0];
  if (first) queueMicrotask(() => this.navigateToInvalidField(first));
  return;
}
```

**Every `<form>` binds `[formGroup]`.** Components import `ReactiveFormsModule`,
which has no `NgForm`. A bare `<form (ngSubmit)="…">` is therefore not an Angular
form: `ngSubmit` never fires, the browser submits natively, and the whole page
reloads. Put the controls in a `FormGroup` and write
`<form [formGroup]="…" (ngSubmit)="…" novalidate>`, or use a `<div>` with a
`type="button"` action.


### Signed Int32 transport validation
Use `int32ValueValidator` from `shared/utils/scalar-validators.ts` for an actual
nullable C# Int32 field. Empty values are accepted; non-number, fractional and
out-of-range values return the shared `number` error. Its inclusive bounds are
-2147483648..2147483647. Requiredness and any narrower business/sign rule stay
with the feature contract; a native min=0 cannot invent a nonnegative invariant.
Custody/Workshop Movement mileage and Logs threshold adopt it. String mileage
contracts (Collection/Delivery/NRM) retain text and are never coerced through
Number. This extends the existing scalar owner, not a private validator or
backend validation substitute.


### Strict dependent validation reads
When a required settings read fails, retain entered values, show the translated read error and keep the dependent action unavailable until Retry succeeds. Do not normalize a failed required read into a valid default. This is a read-validation gate and does not change the backend calculation owner. Source-only evidence: Limousine quotation, TripBooking editor/list.
