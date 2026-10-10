## 19. Validation messages

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
When rows display their own tax or gross, use `allocateDocumentTax(lines, decimalPlaces)`
from that shared file, matching `VatPolicy.AllocateDocumentTax`: allocate each rate's rounded
tax in proportion to its line amounts; the largest absolute amount takes the remainder and
the first line wins a tie. A zero-net rate group has zero allocated tax. The row shares must
reconcile to the document tax. Never sum independently rounded per-line taxes. Screens that
still preview per line move with their backend in their review. Job Invoice on Customer is
the current routed consumer, and Close Job's affected invoice row preview also reuses it;
the backend Workshop-linked MiscellaneousInvoice uses the same
allocation and persists matching rows/header totals. Source conformance is not runtime
acceptance.

Use the backend's base-currency ledger precision for these monetary previews, not a
literal two or Common settings' display precision. Job's context returns `moneyDecimalPlaces`
from `FinancialNumberPolicyResolver` (base `Currency.DecimalPrecision`); its input scale and
step use that value. Display precision remains the money/word formatting owner's setting.

**Amount in words is presentation.** Reuse `amountInWords` from
`shared/utils/amount-in-words.ts` when the scoped document needs the existing English
voucher wording. Pass `SettingsCommonModel` / `CommonDTO` currency name, decimal-currency
name and display precision; never copy a feature converter or assume Dirham/Fils from a
screenshot. This helper does not write a total or replace backend pricing. Job Invoice on
Customer adopts it; legacy voucher converters migrate only when those screens are scoped.
Arabic number-word conversion is not supplied by this English presentation helper.

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

### Signed Int32 transport validation (2026-10-07)

Use `int32ValueValidator` from `shared/utils/scalar-validators.ts` for an actual
nullable C# Int32 field. Empty values are accepted; non-number, fractional and
out-of-range values return the shared `number` error. Its inclusive bounds are
-2147483648..2147483647. Requiredness and any narrower business/sign rule stay
with the feature contract; a native min=0 cannot invent a nonnegative invariant.
Custody/Workshop Movement mileage and Logs threshold adopt it. String mileage
contracts (Collection/Delivery/NRM) retain text and are never coerced through
Number. This extends the existing scalar owner, not a private validator or
backend validation substitute. Source-only; owner input/compiler acceptance pending.


### Strict dependent validation reads (2026-10-09)
When a required settings read fails, retain entered values, show the translated read error and keep the dependent action unavailable until Retry succeeds. Do not normalize a failed required read into a valid default. This is a read-validation gate and does not change the backend calculation owner. Source-only evidence: Limousine quotation, TripBooking editor/list.
