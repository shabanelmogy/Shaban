| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-23 |

# Shared numeric input adoption

## Requested outcome and existing state

Owner requests every numeric up/down field to use the shared control shown in Purchase Order Details, explicitly including Customers and negative-entry prevention. This is implementation authorization, not a plan-only command. PLAN-00 precedes the implementation phases because this spans existing modules.

Targeted inventory (numeric markup only, no full-solution audit) finds 535 numeric tags in 167 template/component sources: 408 native inputs and 127 PrimeNG InputNumbers, 28 already carrying appQuantityInput. Counts include source markup and will be reconciled for comments/read-only exceptions. The complete baseline inventory is held in the task's temporary sigma-numeric-tags.json; the final review will carry module coverage and exceptions.

| Concern | Existing owner | Finding / classification |
|---|---|---|
| Shared up/down | QuantityInputDirective + PrimeNG InputNumber + styles.scss | Keep/Extend: existing PO quantity control, 34px/22px rail, number/null CVA, shared selection and translated buttons. Extend existing owner to all numeric roles. |
| Native number fields | Each owning component/template | Replace with the same PrimeNG/shared directive composition; retain controls, names, min/max/step, precision, readonly/disabled, labels and calculation events. |
| Other PrimeNG numeric fields | Existing component imports/templates | Refactor to shared directive; preserve explicit formatting, grouping, precision and business bounds. |
| Native automatic min/max validators | Angular native number directives | Extend shared directive with equivalent min/max validation so replacing the native host does not drop form validity for saved/programmatic bad values. No blanket minimum. |
| Customers billing | Company/Individual forms and PartnerBillingInfoAddVM | Confirmed min0 in frontend validators/attributes and backend Range; preserve and enforce through the shared widget. CreditPeriod remains integer/int32; amounts remain decimal. |
| Signed numbers | Balance report filters and explicit negative minimums | Keep: presentation migration does not authorize changing signed balances, differences, rates or server rules. Preserve existing negative/unbounded limits; no global min0. |
| Read-only values | Existing disabled/readonly displays and derived badges | Keep display contracts; preserve read-only/disabled behavior and do not create writable derived controls. Bound [value] displays may retain their native read-only element with spinner removed, or use standalone one-way ngModel on the shared widget if needed. Record each. |
| API, domain, persistence, calculations | Existing feature/server owners | Keep: no payload, schema, accounting, permission or server-rule changes. Backend is read-only evidence. |
| User guidance | Existing shared-screen-guidance and customer topics | Extend EN/AR common guidance inherited by module guides; update Customer numeric-specific instructions. No extra viewer/routes. |

## Alternatives and frozen target contract

| Option | Assessment | Decision |
|---|---|---|
| Per-screen native spinner styling | Leaves divergent CVA/stepping/bounds and duplicates the current owner | Reject |
| New numeric wrapper/CVA | Adds a parallel form owner and broad API migration | Reject |
| Reuse InputNumber + existing QuantityInputDirective | Meets explicit reference and shared-owner preference; source migration retains public feature contracts | Frozen |

- Native editable fields become p-inputnumber appQuantityInput. Existing InputNumbers adopt the directive. Each direct standalone owner imports InputNumberModule and QuantityInputDirective, removing NumericFocusDirective only when no longer used.
- Move native id/label and accessibility bindings to inputId/ariaLabel/ariaDescribedBy. Move min/max/step to numeric component inputs; explicit integer stepping keeps integer precision; unconstrained decimals retain the shared 20-digit ceiling. Preserve explicit existing widget precision/format/grouping.
- Existing native `(input)` recalculation becomes `(onInput)` after PrimeNG updates its CVA, including button stepping. Native event-target handlers must be adapted to the typed widget value/current control. No recalculation is added where absent.
- Existing domain validators remain; shared numeric min/max validation replaces automatic native-host range validation and reports standard min/max shapes. Retrieve NgControl after construction to avoid validator dependency cycles. Dynamic bounds trigger revalidation without rewriting the value.
- No universal nonnegative default. Customers' confirmed nonnegative credit/discount/surcharge limits remain min0. Signed fields keep their exact policy. Missing business semantics are not guessed; absence of a bound is preserved.
- Numeric identities remain numeric; textual identifiers/cards/CVV/phone/postcode and inputmode-only text are excluded. No global text-input conversion.
- Keep form shape, routes, payloads, calculations, server validation, themes/RTL and layout allocation. Shared visual classes remain the existing owner. No migrations or data fixes.

## Impact map and sequencing

| Slice | Owner / affected consumers | Contract / dependencies | Verification |
|---|---|---|---|
| Shared foundation + Customers | Root; directive, shared styles, customer components, translations/guidance | Frozen rules above; customer min0 source/server evidence | Source adapter/validator/attribute/guide review |
| Operations modules | Worker; Fleet/Workshop/Lease/Rental/Equipment Rental/Transportation/Limousine/Sales/Agreements Dashboard 2 | Same frozen contract; disjoint ownership | Imports, event adapters, bounds/precision and complete scoped diff |
| Financial/configuration modules | Worker; Vouchers/Billing/Accounts/Banking/HRM/Staff/Stock/Assets/Suppliers/Administration/Movements | Same frozen contract; no root shared files | Imports, domain-preserving bounds/precision, complete scoped diff |
| Integration and documentation | Root | Workers complete; no shared file overlap | Targeted remaining-native/missing-directive scan, source parsing, canonical/digest/packet maintenance, source reconciliation |

Phases: PLAN-00 and Phase0 inventory, Phase1 freeze of unchanged domain/API plus numeric input contract; Phase2 filter adaptation, Phase3 editable fields, Phase5 standalone imports/events/shared integration, Phase6 final source review. Phase4 omitted: no domain transition changes. Screen shape is preserved per consumer; this is shared-control adoption, not screen-shell refactoring. Approved reference is PO Details quantity plus the canonical shared producer in UI27/24/14.

No unresolved first-slice decision: sign/precision changes are excluded unless already explicit in source. Existing unrelated frontend cache work, previous date-row repair and backend wwwroot/slnf work are preserved. Root owns common files, books/skill/generated packets/review; workers must not edit those or overlap modules. Use two workers after this freeze because module migrations are bounded and independent, cutting wall-clock time without shared edits.

Owner verification remains required for compilation, typing/paste/clear, negative blocking, signed values, dynamic bounds, calculation events, disabled/read-only controls, filter layout, themes/RTL/narrow widths and no extra page scroll. No builds/tests/lint/browser/database/migration/commit/push/deployment are authorized. Recovery is a source revert of this scoped migration; no stored data/schema is changed.
