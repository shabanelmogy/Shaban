## 27. Focus and keyboard

> **Status: Canonical**

**Canonical:** the shared confirmation dialog and any `p-dialog`; PrimeNG handles
the trap, you handle the edges.

When a shared row menu opens a dialog, capture the lasting row trigger through
the popup ID/aria-controls relationship, not the body-appended menu element
that will detach. Shared resolveActionMenuTrigger owns that lookup. On close,
restoreOverlayFocus may receive the actual closing dialog container so it can
return from that surface while preserving a newly focused external field or
dialog. Do not retain Bootstrap portal selectors after Menu migration. Message
Logs is the compatibility consumer; rendered shared menu tests cover the trigger
resolution (runtime retirement,2026-10-22).

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

### Deferred field focus in protected editors (2026-11-09)

For an adopted protected editor, pass the existing `focusField` owner's optional
`cancelOn`, `destroyRef` and `allowed` options. Capture the actor/document identity
when scheduling, cancel permanently on access denial or route identity change,
and recheck that identity before each frame and delayed overlay click. A rapid
regrant must not revive an expired focus operation. Both animation frames and
the scroll-settle timer belong to this lifetime; release notifier/destroy
registrations on cancellation or completion. Hidden/inert or detached targets
must not receive a delayed click. Keep existing invalid-tab selection and
`openOverlay` behavior; do not add feature-local timers or a second focus owner.
Accidents provides the adopted consumer and source specifications; execution
and keyboard/portal acceptance remain pending.

EditableRows passes its existing `confirmationCancelled$`, DestroyRef and current
row/mutation eligibility to that same focus owner when adding a row. Removing
the row or expiring its context before the queued frames must not focus a newly
reused field id. It keeps `openOverlay:false`; no second focus implementation.

Shared invalid-field focus also accepts the actual `[contenteditable="true"]`
element used by an installed rich-text editor. Give that editable element its
stable field id and translated accessible label through the editor's public
attributes API, then reuse `focusField(id, { openOverlay: false })`. The shared
owner reveals only actual scroll regions and focuses with preventScroll; do not
focus a toolbar button or add a second feature scroll/focus implementation.
Email Templates supplies the consumer evidence (2026-10-17); compilation and
keyboard/visual acceptance remain owner-pending.

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
owner without altering parse/format/value contracts. The native appearance
adapter remains for read-only displays; editable numeric fields adopt the
shared stepping widget below. The application-wide service changes selection only. Source-only,
pointer/keyboard/RTL/runtime acceptance pending.

### Numeric fields: shared widget with stepping (owner expansion, 2026-10-23)

**PrimeNG20/21 typed input boundary (2026-10-22).** Use lowercase
`p-inputnumber`. Bind numeric limits/precision as numbers (`[min]="0"`,
`[max]="100"`, `[minFractionDigits]="2"`), not static string attributes.
Shared consumers read `InputNumber.min()`/`max()` signal values; never compare
the signal function to a number or overwrite it. Preserve the same numeric
limits, null handling, validator authority and calculation events. The shared
quantity step-button hooks are `p-inputnumber-increment-button` and
`p-inputnumber-decrement-button`.

The owner explicitly expands the Purchase Order Details shared stepping control
to every editable numeric field across all screens, including Customers. This
supersedes the earlier2026-10-04 quantity-only adoption boundary. Use the existing
PrimeNG `p-inputnumber appQuantityInput` composition with
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

Preserve explicit formatting/grouping/precision on existing InputNumber
consumers; make previously implicit defaults explicit when the shared defaults
differ. Migrated native decimal fields keep their existing step and validators,
not an invented two-digit ceiling. Integer contracts explicitly set zero
fraction digits. Native `(blur)`/`(focus)` outputs become publisher
`(onBlur)`/`(onFocus)`; event-target parsers read the typed numeric output or
current form control after CVA, never assume the wrapper is a native input.

**Bounds are field-owned, not a universal nonnegative rule.** Retain existing
min/max/step and signed ranges. Customer credit period/limit, discounts and
surcharges already have min0 in their forms and backend Range annotations;
bind that same minimum to the shared widget. Signed balances, adjustments and
unbounded numeric inputs retain their existing policy. Do not infer a new
business bound from a field label or change a server rule as presentation work.
Use number/undefined signal inputs for optional bounds, not string attributes.

QuantityInputDirective also owns NG_VALIDATORS min/max parity with the native
number-host validators being replaced. It reads the publisher's current bound
signals, returns standard Angular min/max errors and requests revalidation when
dynamic limits change; it never rewrites a value, marks it dirty or replaces
feature validators. Retrieve optional NgControl at OnInit rather than during
validator construction to avoid a dependency cycle. Requiredness, integer/scale
and business rules retain their current owners. Widget limits prevent invalid
stepping/entry while form/server validation still covers loaded/programmatic
values. The shared button translation keys stay compatible but now say
Increase/Decrease value in both vocabularies, fitting every numeric role.

Shared `src/styles.scss` owns the full-width/min-width-zero 34px control token,
22px stacked button rail, themed borders/surfaces/focus and LTR/right tabular
digits. Existing field and column widths still own allocation. The directive
adds the wrapper/input appearance classes and mirrors invalid+touched/dirty to
the real input's `aria-invalid`, matching FieldError. Use `inputId` instead of a
host `id` and `ariaLabel` instead of a host aria-label, preserving actual labels
and `focusField` targets. Use ariaRequired/ariaDescribedBy for the inner input;
shared invalid-state forwarding also honors explicit host/group errors and the
publisher invalid signal, including otherwise-valid range endpoints.
`data-no-clear` prevents the generic text-clear service
from adding another rail/control inside this numeric widget; keyboard clearing
remains PrimeNG-owned. GlobalNumericFocusService already covers the inner
spinbutton, so no additional focus listeners or value writes are introduced.
The shared directive supplies translated increase/decrease accessible names on
the actual stacked buttons and removes PrimeNG's aria-hidden from these focusable
controls; the widget retains all stepping/disabled handlers.

The PrimeNG21 Quantity root and Sigma classes share one host (UI24): keep the
input and22px step rail in separate inline-flex space, with no absolute rail
over the numeric text. Verify visible0/typed text and pointer hit-testing as
well as keyboard/CVA behavior. A create-screen regression exercises actual
async form disable/enable after required reads, retaining failure guards;
a synchronous lookup stub alone cannot establish startup editability.

**Quantity entry work (verified shared correction, 2026-10-22).** Quantity's
accessibility adapter caches its actual step-button references after rendering;
rebuild that cache when the input/button structure or layout changes. Translate
button names on creation and language/translation/default-language changes,
not in every DoCheck for every quantity row. Keep the cheap invalid+touched/dirty
input-state check and initialize it when an input is created. Excluded numeric
inputs with no generic clear binding must not schedule a whole-form clear-button
geometry refresh on focus/input/change. This preserves select-on-entry,
number/null CVA, limits, precision, stepping and validation; never debounce form
values or totals to hide entry lag. Verify a real multi-row consumer with both
global services, numeric replacement/clearing/stepping, translated/recreated
buttons and disabled/read-only behavior. Count redundant DOM/geometry work;
headless elapsed time is not proof of the owner's interactive latency.

Application adoption now spans editable numeric controls across existing modules;
the2026-10-04 inventory of36 quantity controls/28 templates is historical.
Remaining/derived/View numbers keep their read-only text/badge owners (block14);
native readonly bound-value displays may remain spinner-free, never made
writable or given a second form graph. New numeric fields follow this recipe.
Shared numeric-unit width/flex rules include the InputNumber host as well as
native input, preserving existing unit rails and fixed widths (UI14).
Source-only; owner build, input/step/clearing,
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
### Publisher overlay focus edges (PrimeNG21 shell, 2026-10-22)

Popover does not automatically focus its first ordinary action. Reuse shared
`focusOverlayAction` onShow to focus the first enabled action (or the empty
panel itself), and `restoreOverlayFocus(trigger, closingContainer)` onHide.
Popover emits onHide before detaching its focused descendant, so pass its
actual container: restore when focus is still inside that closing container
or lost to body/disconnected content. Do not steal a newly chosen field or the
focus inside a dialog opened from the overlay. Escape/outside dismissal still
belongs to the publisher. Bind translated accessible names, haspopup=dialog
and the actual overlayVisible expanded state, and reset nested disclosure state
when its overlay closes. The existing shared EditorDialog owns manager/profile
focus; opening it must not be undone by delayed popover teardown.

Header and AppbarShortcuts are current consumers. Body-appended shell layers
carry print-specific classes under the shared print owner; hiding only their
header ancestor cannot hide a detached overlay. Rendered overlay/keyboard tests
and owner interaction/print acceptance are separate evidence.

Compact ImportCsv uses the same Popover focus contract because it contains
commands and explanatory column content. Its native enabled commands retain
ArrowUp/Down/Home/End and Escape; choosing a command closes the popup. Invoke
the native file input synchronously within the user command so the browser's
file-picker gesture is retained. Disabled/parsing state guards the commands
even when the popup is already open. Row action Menus retain the publisher's
own list focus and keyboard implementation (UI7), with conditional return.
