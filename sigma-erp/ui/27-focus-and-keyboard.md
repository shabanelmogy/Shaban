## 27. Focus and keyboard

> **Status: Canonical**

**Canonical:** the shared confirmation dialog and any `p-dialog`; PrimeNG handles
the trap, you handle the edges.

| Surface | Required behaviour |
|---|---|
| Dialog open | focus moves into the dialog |
| Dialog | Tab cycles inside; it must not reach the page behind |
| Dialog close | focus returns to the control that opened it |
| Escape | closes, and for a dirty editor routes through the discard rule (block 10) |
| Row action menu | Escape and outside click close it; focus returns to the trigger |
| Icon-only button | `aria-label`, always |
| Decorative icon | `aria-hidden="true"`, always |
| Invalid submit | focus the first invalid control; shared `focusField` reveals clipped fields inside actual scroll regions, with no page/clipped-shell movement (block 12) |
| Added child row | `EditableRows.add` uses shared `focusField(focusId, { openOverlay: false })`: wait for rendering, reveal within real scroll regions, focus with preventScroll, leave picker closed (block 14) |
| Step form | `app-step-form` owns ordinary-button navigation and `aria-current`; feature Back/Next remain `type="button"` so Enter cannot skip a step |
| Editor tabs | `app-editor-tabs` owns roving focus, Home/End, and direction-aware arrow keys; feature panels keep matching IDs and labels |

Getting these free is the reason to use `p-dialog` and the shared confirmation
service rather than a hand-rolled backdrop. A plain `<div>` with
`role="dialog"` provides none of them — which is why a hand-rolled `role="dialog"` modal must not be used. (The Staff salary-revision
modal now uses `app-editor-dialog`, verified 2026-10-01.) Block 13 shows the canonical replacement.

Filter forms submit on Enter because they are real `<form>` elements with
`type="submit"` on Search. Keep that; do not intercept Enter.

### Numeric fields: immediate replacement (general owner rule, 2026-10-04)

Every numeric field selects its current value when focus enters, so typing
replaces zero or an existing number immediately. The owner's application-wide
instruction (2026-10-04) supersedes the previous adoption-on-review boundary.
This applies to quantities, prices, amounts, discounts, durations and numeric
filters through the shared `GlobalNumericFocusService` in `shared/service/`.
AppComponent starts/stops this root service alongside GlobalInputClearService.
Document-delegated events cover lazy views, dynamic rows and body-appended
dialogs without imports or handlers in individual feature templates.

The service matches native `input[type="number"]` and PrimeNG
`input.p-inputnumber-input[role="spinbutton"]`; ordinary text, telephone and
inputmode-only fields are not assumed to represent numeric values. It selects
on focusin (Tab or programmatic focus) and restores selection on the first
primary left pointer click if that click collapsed it. Bubble-phase handlers
run after PrimeNG's own cursor handling. Further clicks in the focused field
keep normal caret/range editing. Disabled and read-only controls are excluded.
Pointer cancellation/focusout resets pending selection; root destruction
removes every listener. Keep native input type, number value accessor,
min/max/step, validation, decimal precision and existing calculation handlers.

Selection never clears zero, writes a form value, marks a form dirty, dispatches
an input event or recalculates totals. Do not copy focus handlers into features
or defer selection until after typing. The standalone `NumericFocusDirective`
remains an opt-in appearance adapter only: import it in the direct consumer and
add `appNumericFocus` to a native numeric input. It adds no selection listener.
Its shared
`sigma-numeric-input` treatment owns LTR, right-aligned tabular digits and a
text-field appearance without spinner buttons; native keyboard stepping remains.
Other custom numeric controls implement the same entry rule in their shared
owner without altering parse/format/value contracts. Appearance remains
opt-in; the application-wide service changes selection only. Source-only,
pointer/keyboard/RTL/runtime acceptance pending.

### Quantity: shared numeric widget with stepping (owner rule, 2026-10-04)

The owner explicitly requests increase/decrease buttons on every editable
Quantity field across the application. This supersedes the spinner-free native
appearance for Quantity only. Use PrimeNG `p-inputNumber appQuantityInput` with
the standalone `QuantityInputDirective` from `shared/directives/quantity-input.directive.ts`
and `InputNumberModule` in each direct consumer. Do not copy numeric handlers,
button markup or per-feature widget styles, or build a second CVA/form graph.

The directive defaults to stacked buttons, no grouping/formatting, en-US numeric
parsing, and a 20-digit fraction ceiling for otherwise unconstrained decimal
entry (avoiding the widget's implicit three-decimal cap). That ceiling is not
a business precision rule. Features retain existing min/max/step and explicitly
set `maxFractionDigits=0` for their integer contracts, or the existing fraction
precision for a constrained decimal contract. Preserve current validators,
number/null values, disabled/read-only state and payload/calculation ownership.
Native calculation `(input)` bindings become widget `(onInput)` bindings;
PrimeNG's inspected `spin`/`handleOnInput` update the CVA before emitting, so
both typing and stepping recalculate the existing row once.

Shared `src/styles.scss` owns the full-width/min-width-zero 34px control token,
22px stacked button rail, themed borders/surfaces/focus and LTR/right tabular
digits. Existing field and column widths still own allocation. The directive
adds the wrapper/input appearance classes and mirrors invalid+touched/dirty to
the real input's `aria-invalid`, matching FieldError. Use `inputId` instead of a
host `id` and `ariaLabel` instead of a host aria-label, preserving actual labels
and `focusField` targets. `data-no-clear` prevents the generic text-clear service
from adding another rail/control inside this numeric widget; keyboard clearing
remains PrimeNG-owned. GlobalNumericFocusService already covers the inner
spinbutton, so no additional focus listeners or value writes are introduced.
The shared directive supplies translated increase/decrease accessible names on
the actual stacked buttons and removes PrimeNG's aria-hidden from these focusable
controls; the widget retains all stepping/disabled handlers.

Application adoption: 36 controls in 28 templates across Stock, Vouchers,
Billing, Workshop, Fleet, Lease, Transportation and Opening Balances Stock.
Remaining/derived/View quantities keep their existing read-only text/badge
owners (block 14). Other numeric roles keep existing controls. New Quantity
fields follow this recipe. Source-only; owner build, input/step/clearing,
decimal/bounds/recalculation, RTL/theme and narrow-layout acceptance pending.

```html
<p-inputNumber appQuantityInput inputId="part-quantity"
  formControlName="quantity" [min]="1" [max]="2147483647"
  [step]="1" [maxFractionDigits]="0"
  [ariaLabel]="'services.qty' | translate" />
```

Platform reference: [`HTMLInputElement.select()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select).

**Check:** focus enters, traps, returns · Escape defined for every dialog ·
`aria-label` on icon-only controls · first invalid control focused on failed
submit · custom editor tabs use `app-editor-tabs` with matching panel IDs · no
feature-local duplicate tab keyboard handler · no `role="dialog"` hand-rolled
markup in new code.

---
