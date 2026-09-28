## 19. Validation messages

> **Status: Canonical**

Shared keys, so messages read the same everywhere:

| Key | Use |
|---|---|
| `validationMessages.required` | empty required field |
| `validationMessages.email` | malformed email |
| `validationMessages.expiryAfterIssueDate` | date ordering |

Inline error under the control, with icon, shown only after `touched`:

```html
@if (driverDraft.get(field.name)?.invalid && driverDraft.get(field.name)?.touched) {
  <small class="company-field-error">
    <i class="bi bi-exclamation-circle" aria-hidden="true"></i>
    {{ validationMessageKey(driverDraft.get(field.name), field.validationMessages) | translate }}
  </small>
}
```

Apply this inline pattern to every control that has a validator in an Add/Edit
form, placing the message immediately below that control (including validated
controls inside editable child collections). On Save/submit, call
`markAllAsTouched()` before returning so every invalid control reveals its own
message; a form-level summary may remain as additional context but must not
replace the field-level messages. Bind `aria-invalid` to the same invalid and
touched state.

Do not use “email, otherwise required”: it labels pattern, length and date-order
errors as required. Map every validator the control can actually produce and
provide a translated fallback:

```ts
interface FieldValidationMessages {
  default: string;
  [errorName: string]: string;
}

private validationMessageKey(
  control: AbstractControl | null,
  messages: FieldValidationMessages,
): string {
  const errors = control?.errors;
  if (!errors) return messages.default;
  for (const errorName of Object.keys(errors)) {
    if (messages[errorName]) return messages[errorName];
  }
  return messages.default;
}
```

Define the map with every validator on that field:

```ts
validationMessages: {
  default: 'companyForm.invalidField',
  required: 'validationMessages.required',
  email: 'validationMessages.email',
  pattern: 'companyForm.emailFormat',
}
```

Every key in the map must exist in both `en.ts` and `ar.ts`; add
feature-specific keys when a validator needs context or parameters.

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

**Check:** error appears only after touch or submit · shared keys, not literal
English · one required marker per label, not duplicated by a global rule ·
every possible validator maps to the right key · `markAllAsTouched()` before the
first invalid return · focus moves to the first invalid field.

---

