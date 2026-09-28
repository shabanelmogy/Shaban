## 12. Step form

> **Status: Canonical composite** — shared navigation plus feature-owned form workflow

Use for a long routed record with several ordered groups or child collections.
Company has five real steps: Detail, Contact Persons, Billing & Cards,
Documents, and Drivers.

The reusable source is:

```text
shared/components/step-form/step-form.component.ts
shared/components/step-form/step-form.component.html
shared/components/step-form/step-form.component.scss
shared/components/form-section/form-section.component.ts
shared/components/form-section/form-section.component.html
shared/components/form-section/form-section.component.scss
shared/components/form-validation-summary/form-validation-summary.component.ts
shared/components/form-validation-summary/form-validation-summary.component.html
shared/components/form-validation-summary/form-validation-summary.component.scss
```

`app-step-form` owns the progress track, translated labels and descriptions,
complete/current presentation, ordinary-button keyboard behavior, `nav`/`ol`
semantics, `aria-current="step"`, responsive overflow, RTL-safe logical
placement, and light/dark styling. It deliberately does not announce tabs.

`app-form-validation-summary` owns the accessible alert shell, translated
title/hint/count, horizontally scrollable invalid-field actions, focus-visible
states, responsive behavior, and light/dark styling. It receives typed items
with `label` and `controlPath` and emits the selected item; it never discovers
invalid controls, changes steps, or moves focus.

The feature owns the typed step list, active index, forward-validation gate,
one parent `FormGroup`, step content, invalid-field discovery and step/focus
navigation, Previous/Next, Save/Cancel, dirty exit, routing, payloads, and
persistence. `app-step-form` emits a requested index; neither shared component
mutates feature state or decides whether forward navigation is allowed.

`app-form-section` owns the repeated content card, translated heading, optional
description and icon, projected-content spacing, responsive behavior, and
light/dark styling. The feature projects the step control component and retains
its form group, control layout, validation, and behavior. Do not repeat a local
section/header/content shell or depend on feature-specific section selectors.

```ts
import {
  StepFormComponent,
  StepFormStep,
} from 'src/app/modules/shared/components/step-form/step-form.component';

readonly FORM_STEPS: ReadonlyArray<StepFormStep> = [
  {
    key: 'Detail',
    label: 'companyForm.companyDetails',
    description: 'companyForm.companyDetailsHint',
    icon: 'bi bi-building',
  },
  {
    key: 'contactPersons',
    label: 'companyForm.contactPersons',
    description: 'companyForm.contactPersonsHint',
    icon: 'bi bi-people',
  },
];
```

Project the shared validation summary under the shared navigation while keeping
the typed invalid-field list and navigation method in the feature:

```html
<app-step-form
  class="card-header"
  [steps]="FORM_STEPS"
  [activeStep]="currentStepIndex()"
  [ariaLabel]="'companyForm.formSteps' | translate"
  (stepRequested)="goToStep($event)"
>
  @if (validationAttempted() && invalidFields().length > 0) {
    <app-form-validation-summary
      title="companyForm.validationTitle"
      description="companyForm.validationHint"
      countLabel="companyForm.invalidFields"
      [items]="invalidFields()"
      (itemSelected)="navigateToInvalidField($event)"
    />
  }
</app-step-form>
```

The feature still guards forward movement and owns the final state change:

```ts
goToStep(index: number): void {
  if (index < 0 || index >= this.FORM_STEPS.length) return;
  if (
    !this.isViewMode()
    && index > this.currentStepIndex()
    && !this.validateCurrentStep()
  ) return;

  this.activateStep(index);
}
```

Each step content component receives the same parent form. Validation summary
buttons jump to the bad field using a `data-control-path` attribute:

```html
[attr.data-control-path]="'billingInfo.creditCards.' + i + '.cvv'"
```

Wrap each visible step group with the shared section shell:

```html
<app-form-section
  *ngSwitchCase="'billingInfo'"
  title="companyForm.billingInfo"
  description="companyForm.billingInfoDescription"
  icon="bi bi-receipt"
>
  <app-billing-info [parentForm]="companyPartnerForm" />
</app-form-section>
```

The body remains one feature-owned scroll area. The fixed feature footer keeps
Cancel on one side and Previous/Next/Save on the other; the last step swaps Next
for Save:

```html
@if (currentStepIndex() < FORM_STEPS.length - 1) {
  <app-primary-action-button
    [label]="'general.next' | translate"
    icon="bi bi-arrow-right"
    iconPosition="end"
    (pressed)="next()"
  />
} @else if (!isViewMode()) {
  <app-primary-action-button
    [label]="'general.save' | translate"
    icon="bi bi-check2-circle"
    [loading]="saving()"
    (pressed)="save()"
  />
}
```

**Check:** `app-step-form` used once · `app-form-validation-summary` used for the
invalid-field alert · no feature-owned stepper/summary markup or styles · no
tab roles · ordinary step buttons plus `aria-current` · step state not
conveyed by colour alone · one parent `FormGroup` · steps receive
`[parentForm]` · feature gates forward navigation · Next validates its step,
Save validates all · Back/Next are `type="button"` · one scroll region · footer
always reachable · Cancel goes through block 10 · `data-control-path` on every
validated input.

**Shared content check:** each repeated content group uses `app-form-section`;
the feature does not recreate the section/header/content shell or depend on
feature-specific section selectors for that shell.

---

