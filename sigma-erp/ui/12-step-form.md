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

For steps distributed across the entire editor width, set `[fill]="true"`.
The shared component gives each step an equal-width column, centres its marker
above the label and aligns the progress track with those markers. Individual
uses this option. The default presentation remains available to other screens;
features do not restyle the shared navigation. At narrow widths, overflow stays
inside the navigation as already owned by `app-step-form`.

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

For Edit, render and save only after a successful detail snapshot. Failure shows an error
and Retry; filling a blank fallback form must never write over the saved aggregate.
Submit checks the whole form's invalid state in addition to the declared summary specs.
Every validated field has a spec, including numeric surcharges, dates and file-path limits.
Header navigation and Next share the same forward gate; View/backward movement need no
validation. Neither navigation nor saving runs during detail load, upload or cleanup.

Keep the submitted form snapshot stable while saving: disable the form with `emitEvent: false`
after building the payload, disable collection mutations, and restore editability on either
failure channel. Success retains the read-only state during attachment cleanup. The
validation-summary navigation obeys the same busy/ready gate as the step header and Next.

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

**Group fields by business meaning (owner feedback 2026-10-01).** Inside a step, each `app-form-section` is one
business group (for example credit and tax, invoicing, surcharges, cards), and a value sits next to the
field that says how it is calculated (an amount beside its Fixed/Percentage type). Rental and lease
variants of the same setting take one row each. Never pour a step's controls into one grid in
form-model order. Reference: the Individual *Billing & Cards* step.

**Invalid-field list (shared, 2026-10-01).** Describe the watched fields once as `StepFormFieldSpec[]`
(path, label key, step, element id; `error` for a group rule such as a date order) — collections
through `rowFields(arrayPath, rowCount, step, fields)` — and build the badges with
`invalidStepFields(form, specs, translate)` (`shared/utils/step-form-fields.ts`). The same specs
mark a step touched for *Next*.

**Error badge → the field (owner requirement 2026-10-01).** A validation-summary item switches to
its step and then moves to the control: `focusField(elementId)` from `shared/utils/focus-field.ts`
waits for the step to render and focuses the control with `preventScroll`. An already visible
field stays in place. A clipped field is revealed by scrolling only actual `auto`/`scroll`
regions with overflow: vertically into view, horizontally to the nearest visible position,
including RTL tables. Do not use unrestricted `scrollIntoView`: it can move `overflow: hidden`
layout containers and the page, lifting the editor's title/steps. Nested scroll regions account
for the inner movement before revealing the field in the outer content pane. A dropdown or a
date picker also opens once the scroll settles, so the
missing value can be picked at once (owner requests 2026-10-01). The date picker opens through the
shared `appDatePicker` click handler (block 17). The step change on this path must **not** scroll the body to the top — that
runs later and undoes the jump. Every badge has its own `controlPath` (a date-order error and a
required date on the same control are two paths). Reference: `Customers/Individual/IndividualPartner`.

Each step content component receives the same parent form. Validation summary
buttons jump to the bad field using a `data-control-path` attribute:

```html
[attr.data-control-path]="'billingInfo.creditCards.' + i + '.cvv'"
```

Wrap each visible step group with the shared section shell:

```html
@switch (currentStep().key) {
  @case ('billingInfo') {
    <app-form-section
      title="companyForm.billingInfo"
      description="companyForm.billingInfoDescription"
      icon="bi bi-receipt"
    >
      <app-billing-info [parentForm]="companyPartnerForm" />
    </app-form-section>
  }
}
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
always reachable · Cancel goes through block 10 · `data-control-path` (or an `id`) on every
validated input · an error badge lands on its control through `focusField`, with no scroll-to-top after it.

**Shared content check:** each repeated content group uses `app-form-section`;
the feature does not recreate the section/header/content shell or depend on
feature-specific section selectors for that shell.

**Forward movement validates by every route (G7, 2026-10-01).** The step header
(`stepRequested`) and *Next* both run the current-step validation before moving forward. Moving
back never validates. A header handler that skips the gate is a finding.

**Badge specs are declared (G8, 2026-10-01).** Each watched field is written in the
`StepFormFieldSpec[]` with its own existing label key and element id. Building labels or ids from
control names (`'mangeDetails.' + name`), or walking the form to generate specs, is not allowed:
an optional control then produces a badge whose key does not exist. Every key in the specs exists
in `en.ts` and `ar.ts` (block 23).

---
