## 19. Validation messages

> **Status: Canonical** — `shared/components/field-error` (`app-field-error`, 2026-10-01)

Shared keys live under `validationMessages` in `en.ts`/`ar.ts`, so messages read the same
everywhere:

- `required`, `email`, `minlength`, `maxlength`, `min`, `max`, `pattern`;
- `number`, `digits`, `date`, `expiryAfterIssueDate`, `url`, `confirmPassword`, `unique`;
- `fileSize`, `fileType`, `maxItems`, `minItems`, `invalidSelection`;
- `custom` is the fallback.

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


### Money and tax in forms

> Money, tax and derived-value rules for every form. Derived row cells: block 14 *Derived cells*.


A form that shows a tax rate, a tax amount or a total with tax takes the rate from
`TaxSettingsService` (`src/app/modules/shared/service/tax-settings.service.ts`):
`load()` once in `ngOnInit` (with `takeUntilDestroyed`), `ratePercent()` for the
default of a new document (only while the control is not dirty), `previewTax()` for
display. The preview never replaces the server result, and the payload sends the rate
only where the contract has one — the backend accepts only the settings rate, or 0
when tax is optional (backend block 5, *Tax in any service*). No literal `5`, `0.05`
or `15` for tax in feature code.

**Preview rounding matches the backend.** A money preview rounds with `roundMoney`
(`shared/utils/financial-number.util.ts`, half away from zero) exactly where the backend rounds.
The document tax is **per tax rate, rounded once** (owner decision D4-4): use
`documentTax(lines)` from the same file, the preview twin of `VatPolicy.CalculateDocumentTax`.
Never sum rounded per-line taxes. Screens that still preview per line move with their backend
in their review.

**The rate is not an input.** A tax-rate control is `readonly` (the rate it shows is the
settings rate or the document snapshot). Only when `taxSettings.isTaxOptional()` it becomes
a `<select>` with two options — the settings rate and `0` — the only values the backend
accepts; never a free number field. The feature stylesheet styles `select` like its inputs.
Purchase forms take the rate from the supplier (`SupplierService.getTaxRate`, settings rate
when tax-registered, otherwise 0); a GRN has no tax input; a bill shows line tax read-only and
accepts only a `taxAdjustment` of ±0.05 (supplier rounding); a trip tax amount is a read-only
`previewTax` unless Limousine settings allow tax editing.

**Check:** `app-field-error` under every validated control, no feature error markup or
helper · error appears only after touch or submit · every `<form>` has
`[formGroup]` · shared keys, not literal
English · one required marker per label, not duplicated by a global rule ·
every possible validator maps to the right key · `markAllAsTouched()` before the
first invalid return · focus moves to the first invalid field · tax defaults and
previews from `TaxSettingsService`, no literal rate · tax rate `readonly`, or a
settings-rate/0 select when optional.

---
