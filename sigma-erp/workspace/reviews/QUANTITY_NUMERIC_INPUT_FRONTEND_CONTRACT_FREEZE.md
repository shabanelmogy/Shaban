| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Shared Quantity input handoff — 2026-10-04

Authorizing evidence: owner explicitly requests Quantity numeric inputs with increase/decrease buttons across the whole application. Shared contracts frozen before delegation.

- Shared standalone `QuantityInputDirective`, selector `p-inputNumber[appQuantityInput]`, lives in `src/app/modules/shared/directives/quantity-input.directive.ts`. Direct consumers import it plus `InputNumberModule`.
- PrimeNG remains the sole numeric CVA. Directive defaults: showButtons=true, buttonLayout=stacked, grouping=false, format=false, locale=en-US, maxFractionDigits=20 for otherwise unconstrained fields; PrimeNG existing default step=1. Feature bindings override these defaults and preserve current bounds and decimal stepping. Integers with an existing integer contract declare maxFractionDigits=0; decimal lubrication retains min/step .01 and decimal values. No inferred positive bounds for previously unconstrained controls.
- Host `sigma-quantity-input-host`; wrapper `sigma-quantity-input`; inner `sigma-numeric-input`. Shared CSS owns width100%, min-width0, height existing 34px token, 22px stacked rail, token-based borders/surfaces/focus and LTR numeric alignment. Existing column/field widths remain unchanged.
- Preserve direct formControlName/[formControl], control identities and validators, readonly/disabled gates and calculation ownership. Native input calculation callbacks migrate to PrimeNG onInput (actual source updates CVA first for typing and stepping). No duplicate handler, new form graph, payload changes or backend edits.
- Native IDs become inputId so labels/focus resolve the real input; translated native aria-label becomes ariaLabel. Directive sets inner aria-invalid using the same invalid+(touched or dirty) rule as shared FieldError. Read-only text and badges are unchanged.
- Root owns shared source/styles/docs/artifacts, all Stock consumers and Accounts stock. Independent workers own only Vouchers+Billing/BillDetail, and Workshop+Fleet+LeaseInquiry+TransactionItem respectively; no overlapping file writes.
- Preserve existing dirty work. No broad feature cleanup; no unrelated styles, translations, routes, tests or configuration edits.

Transport remains number/null on the existing controls and the unchanged Add/Update payloads. API/action state, PR badge diagnostics and Remaining Quantity authority are outside this change. No schema or migration is needed. Verification is source-only; owner must check typing/clearing/stepping, min/max, decimal inputs, row recalculation, disabled/View, focus, narrow/RTL and theme behavior after rebuilding the frontend.

Implementation refinement (source-supported, 2026-10-04): the host carries `data-no-clear`, supported by GlobalInputClearService.isEligible. PrimeNG numeric inputs are text spinbuttons; this prevents the text service from introducing a third control over the compact numeric line. Keyboard clearing remains widget-owned. Invalid state is also synchronized after view initialization, then on checks, without form writes.

Accessibility refinement frozen before edits: inspected PrimeNG stacked buttons are focusable but aria-hidden without a label. Shared directive supplies translated general.increaseQuantity/decreaseQuantity accessible names and removes aria-hidden on the two actual buttons, preserving PrimeNG event/disabled behavior. Matching EN/AR keys belong to shared numeric presentation (UI27 icon-only button requirement), not to feature handlers.
