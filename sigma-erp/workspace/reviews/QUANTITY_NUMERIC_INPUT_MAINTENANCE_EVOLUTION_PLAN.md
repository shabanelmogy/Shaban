| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Application-wide Quantity numeric input

Owner instructions (2026-10-04): every Quantity field uses a numeric input with increase/decrease buttons; the solution is shared across the application. This explicitly supersedes UI27's spinner-free appearance for editable Quantity fields only. Prior screenshots are content evidence, not design authority for this change.

## Impact and classification

| Owner | Decision | Reason |
|---|---|---|
| PrimeNG InputNumber/CVA | Keep | Installed PrimeNG 17.18 already owns numeric parsing, keyboard and stepping, reactive-form writes and disabled state |
| GlobalNumericFocusService | Keep | Already recognizes PrimeNG numeric spinbuttons and owns select-on-entry |
| Shared QuantityInputDirective | Create | One configuration/appearance owner on p-inputNumber; no second form control or feature handlers |
| Global styles | Extend | Full-width compact 34px widget, narrow stacked buttons, token-based theme, numeric LTR/right alignment |
| 36 Quantity controls in 28 templates | Replace/extend | Native Quantity inputs migrate; Opening Balances stock adopts the same directive |
| Native NumericFocusDirective | Keep elsewhere | Other numeric roles retain their existing behavior |
| Typed forms, validators, payloads, formulas, APIs, backend | Keep | This task changes entry presentation, not business or persistence contracts |
| UI14/UI27 and required skill | Extend | Record the explicitly requested general Quantity recipe for future screens |

Scoped modules: Stock, Vouchers, Billing/BillDetail, Workshop Job/JobEstimation/LubricationJob, Fleet VehicleService/ServiceChecklistItem1, LeaseInquiry, Transportation TransactionItem and Accounts Opening Balances Stock. Only their editable Quantity/Qty/Ordered/Received/Maximum Quantity controls and direct standalone imports are in scope. Read-only quantities remain text/badges.

Rejected alternatives: per-screen showButtons/style duplication; CSS-only native spinners (platform-dependent appearance); a wrapper CVA with another form graph; rewriting non-Quantity numeric fields. The existing widget plus an opt-in shared directive is sufficient.

## Reference conformance before implementation

| Concern | Book | Actual reference | Shared owner | Target |
|---|---|---|---|---|
| Numeric stepping/binding | UI14/27 | Accounts/openingBalances/components/stock/stock.component.html quantity p-inputNumber; node_modules/primeng/fesm2022/primeng-inputnumber.mjs spin/handleOnInput/updateModel | PrimeNG InputNumber | Same CVA, numeric value; onInput follows model update including spinner events |
| Focus replacement | UI27 | shared/service/global-numeric-focus.service.ts; shared/directives/numeric-focus.directive.ts | GlobalNumericFocusService | PrimeNG inner spinbutton already matches; no duplicate listeners |
| Control dimensions | UI14 | shared/components/editable-collection-table/editable-collection-table.component.scss inputs; src/styles.scss sigma-field height | Global stylesheet/table | 34px existing control token, width constrained by existing field/column; compact 22px button rail |
| Invalid feedback | UI19/27 | shared/components/field-error/field-error.component.ts messageKey | Feature control/FieldError | Same validation; shared directive mirrors invalid+touched/dirty to inner aria-invalid |
| Integer/decimal contracts | Master4 | Existing min/max/step, validators and corresponding domain quantity types | Feature form | Preserve bounds/step; explicit maxFractionDigits 0 for existing integer contracts; decimal quantity stays decimal |

Source-only workflow: PLAN00/Phase0/1 freeze, scoped Phase3 controls, Phase5 standalone integration, Phase6 reconciliation. Backend/grid/action phases are unnecessary. Generated packets have drift and must be regenerated and semantically reviewed; canonical blocks govern. No build/test/lint/browser/DB/migration/commit/deployment authorization for this task.
