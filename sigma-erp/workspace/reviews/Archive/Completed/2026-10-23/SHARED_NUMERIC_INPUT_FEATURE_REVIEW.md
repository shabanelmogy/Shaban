| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-23 |

# Shared numeric input implementation

Frozen scope, Impact Map, alternatives, shared contracts, sign policy, phase selection and delegation ownership: SHARED_NUMERIC_INPUT_MAINTENANCE_EVOLUTION_PLAN.md. Owner's explicit application-wide request supersedes UI27's prior quantity-only adoption boundary. Existing APIs/domain rules remain frozen unchanged. No screenshot supplied for this follow-up; PO Details is the named reference and inspected source authority for the requested numeric presentation.

## Conformance before edits

| Concern | Book | Reference / shared owner | Target / disposition |
|---|---|---|---|
| Numeric control | UI27/24/14 | PO details p-inputnumber appQuantityInput; QuantityInputDirective; styles.scss | Match 34px control and 22px rail, real input labels, shared selection and number/null behavior across numeric roles; eliminate old editable native boxes. |
| Bounds/precision | UI27/19; BE8 | Existing native attributes + typed form validators; PartnerBillingInfoAddVM Range | Preserve every explicit limit and integer/decimal contract; Customers min0 confirmed. Replace native automatic min/max validation through shared owner. |
| Calculations | UI27/19 | Existing InputNumber spin/handleOnInput CVA-before-event behavior | Adapt native input events and event-target parsers; keep existing calculations and payloads. |
| Layout/accessibility | UI1/24/25/27 | Existing shared numeric widget, same-host PrimeNG21 root | Keep per-feature widths and labels, readonly/disabled, body/filter/table scroll. Shared geometry adjustments only where old native selectors excluded new hosts. |
| Screen guides | Master7 | Shared common guidance inherited by existing module readers, Customer topic | Update EN/AR use/limits; retain reader/menu/routes. |

Implementation results, coverage, changed files, agent output, final diff review and owner verification will be appended after integration.

## Final source reconciliation — 2026-10-23

The plan and numeric handoff above were Frozen before source edits. The owner-requested presentation expansion was implemented without changing API, domain, persistence or calculation contracts.

- Baseline: 535 numeric source tags in 167 template/component sources, comprising 408 native inputs and 127 InputNumbers (28 already shared).
- Final: 521 shared InputNumbers; 394 editable native inputs converted and 99 existing unshared InputNumbers adopted. No editable native number field or unshared InputNumber remains in the targeted application inventory.
- Remaining 14 native displays are readonly/disabled derived values with the existing spinner-free adapter. They remain non-editable, with no increase/decrease actions; exact files/control identities are listed below.
- All 22 inventoried module groups covered; dynamic input-type sources were checked separately and represent text/email/telephone/password, not numeric values. Phone/card/CVV/textual identifiers remain unchanged.

| Concern | Final producer/consumer comparison | Source result / acceptance |
|---|---|---|
| Shared control and reference | Every editable numeric tag now uses the same InputNumber + appQuantityInput composition as PO Details, with existing 34px/22px shared geometry | Match; no second CVA/component/style owner. Visual acceptance pending. |
| Customer nonnegative bounds | Company and Individual credit period/limit, discounts and all surcharge groups retain min0; Company credit-period branch retains int32 maximum and zero fraction digits | Match frontend forms and backend PartnerBillingInfoAddVM Range. No backend edits. |
| Signed fields | Customer balance filters remain unbounded/signed; branch tariff adjustment retains -100..100 and step0.01; other existing negative/unbounded policies retained | No blanket min0 or new sign policy. |
| Precision/format | Explicit native step1 contracts use integer precision; unconstrained native decimals retain shared20 ceiling; explicit old InputNumber settings retained and implicit format/grouping/3-digit default made explicit where needed | Existing business validators and money-scale owners unchanged. Typing/paste acceptance pending. |
| Range validity | QuantityInputDirective now provides standard Angular min/max validators using current publisher signal values and revalidates dynamic bound changes | Preserves validity previously supplied automatically by native number hosts, including loaded/programmatic invalid values. No value write or dirty-state change. |
| Validator lifecycle | Optional NgControl resolved at OnInit through the injector, outside provider construction; stable Object.is comparison avoids repeated NaN-bound notifications | Source-reviewed for dependency-cycle and repeated-notification risks; runtime acceptance pending. |
| Labels and error accessibility | inputId/ariaLabel/ariaDescribedBy bindings address the inner input; root audit fixed BalancesSummary ariaRequired and forwarded explicit host/group errors and publisher invalid state through shared owner | Source match, including balanceRangeOrder with individually valid endpoints. Keyboard/screen-reader acceptance pending. |
| Calculation events | Native input/focus/blur events map to publisher outputs. Rental Booking/Agreement and Lease Agreement adapters read current typed controls after CVA; payroll standalone amount input now emits number/null | Existing formulas/clamping/null semantics preserved; no event-target casts on wrapper events. Owner typing/step/clear acceptance pending. |
| Local layout | Shared unit/fixed-number selectors now include InputNumber host. Receipt's native paint selectors exclude p-inputnumber so shared border/height/padding is authoritative | Allocation/columns/units preserved, no feature widget palette. Narrow/RTL/theme acceptance pending. |
| Import integration | Standalone owners import InputNumberModule + QuantityInputDirective; old NumericFocusDirective removed only when unused; readonly displays retain it | All167 inventory owners parsed and inspected for required/duplicate imports; no new compiler entry or runtime file. |
| API/model/grid contracts | No new field, ListVM property, filter key, payload property, endpoint, route, provider/HttpClient, permission, server override, AutoMapper, financial calculation, entity or EF change | Grid column/ListVM comparison not applicable to this numeric presentation migration. Server invariants stay authoritative. No migration. |
| Guide handoff | EN/AR common numeric instructions in shared-screen-guidance.ts, inherited through existing GuideReader overview; Individual/Company billing topics updated in customer-profile-topics.ts | Existing /UserGuide/:sectionId readers/menu and /UserGuide/customers remain; no viewer or menu duplication. |
| Canonical learning | UI27 owns general adoption, min/max parity, lifecycle/events/ARIA/sign rules; UI14 numeric unit host geometry; UI24 unchanged shared visual producer; skill rules/history and CHANGELOG updated | Derivative packets regenerated through generator and semantically reconciled with owner blocks/reference roles; final -Check passes all8. |

## Verification and limitations

Root source audit walked the complete535-tag baseline and final inventory, comparing form bindings, explicit limits, state and native-binding conversions. It parsed all167 templates (including the inline Sales Agreement action dialog) and all167 owning TypeScript sources with zero syntax diagnostics. Required standalone imports, duplicate imported symbols, remaining editable native inputs, missing shared directive, native-only widget bindings and unforwarded label/required ARIA attributes reported zero issues after fixes. This is source parsing, not compilation/typechecking, a test run or browser verification.

The root reviewed shared/customer diffs and all changed event adapters/Receipt style changes; workers reviewed the complete scoped diffs for their disjoint modules and baseline attributes. Final scoped Git whitespace/merge-marker review is recorded below. Existing Country/UOM/CompanyDriver cache service changes, reference cache files, the earlier document-date repair and unrelated backend slnf/wwwroot changes were preserved. Shared guide and editable-table changes retain their pre-task edits.

Applied PLAN-00, Phase0, Phase1 existing-contract freeze, Phase2 numeric filters, Phase3 editable controls/guide, Phase5 standalone imports/events and Phase6 source reconciliation. Phase4 is not applicable: no domain transition changes. Existing screen shapes/layout owners were preserved, rather than refactoring167 screens' shells.

No builds, typechecking, tests, lint, application/browser verification, database commands, migrations, commits, pushes or deployment were run. Compilation and all runtime/visual/print acceptance remain owner-pending. No unresolved source/business decision blocks this frozen presentation scope. Main remaining risk is broad UI integration across old layouts and numerical entry modes, which source parsing alone cannot certify.

## Agent utilization

- Root: initial discovery/drift check/plan/contract freeze; shared directive, Customer/shared consumers, common ARIA/validator/geometry integration, translations/guides, books/skill/packets, complete reconciliation.
- Operations terra_worker (inherited available model, because mapped terra model unavailable): Fleet/Workshop/Lease/Rental/Equipment Rental/Transportation/Limousine/Sales/Agreements Dashboard2. Converted218 native inputs; reviewed229 final shared widgets plus1 readonly display. Also performed a bounded read-only audit of root changes, finding2 ARIA issues that the root fixed.
- Finance terra_worker (same inherited model): Vouchers/Billing/Accounts/Banking/HRM/Staff/Stock/Assets/Suppliers/Administration/Movements. Converted155 natives and adopted98 old widgets, reviewed270 final shared widgets plus13 readonly displays. Root supplied shared foundation and handled all common files.
- Disjoint module ownership avoided shared-file edits and merge risk; two workers reduced wall-clock time for hundreds of repetitive but contract-sensitive changes. Both completed source-only reviews; neither declared overall completion or ran prohibited commands.

## Owner verification

1. Open Company and Individual billing: confirm matching PO-style buttons; type/paste a negative credit period, credit limit, discount and surcharge; step down at zero. Verify negative entry cannot be accepted and loaded/programmatic bad data keeps the form invalid. Check integer credit period and decimal amounts.
2. Check a PO quantity/unit price and a Rental/Lease charge: type, replace selected value, clear, step up/down and confirm dependent previews update once. Existing null/zero distinctions and Save validation should remain.
3. Check signed Customer Balance From/To and branch tariff adjustments. Confirm permitted negatives remain; reversed balance ranges announce invalidity on the actual input and show the existing message.
4. Exercise dynamic numeric bounds in reports/settings and payroll amounts, plus currency/money precision/grouping compatibility. Readonly computed totals must stay non-editable and disabled controls inactive.
5. Inspect a list filter, dense table, modal and routed form at narrow/intermediate/desktop widths, LTR/RTL, light/dark themes, and print where supported. Confirm labels focus the input, step-button names are translated, input text/rail never overlap and scrolling remains internal.
6. Run the normal frontend compilation and relevant existing checks under owner authorization. No Add-Migration is required.

Suggested frontend commit, limited to this task's appended file list:

```text
refactor(numeric-inputs): reuse shared stepping control across screens
```

Suggested documentation commit, limited to UI14/24/27, CHANGELOG and their derivative packet changes:

```text
docs(ui-book): generalize shared numeric entry and preserve bounds
```

The local plan/review/skill remain under the workspace's current unversioned instruction-layer ownership. Backend has no task-owned changes and needs no commit or migration.

## Final inventory and files

| Module | Shared numeric tags | Readonly native displays | Sources |
|---|---:|---:|---:|
| Billing | 14 | 0 | 3 |
| Workshop | 24 | 0 | 9 |
| Fleet | 36 | 0 | 12 |
| Administration | 75 | 0 | 15 |
| Accounts | 18 | 0 | 10 |
| Banking | 7 | 0 | 6 |
| Assets | 13 | 0 | 3 |
| Vouchers | 91 | 11 | 31 |
| Equipment Rental | 20 | 0 | 3 |
| Customers | 20 | 0 | 4 |
| Sales | 13 | 0 | 4 |
| Suppliers | 3 | 0 | 2 |
| Agreements Dashboard 2 | 10 | 0 | 3 |
| Limousine | 8 | 0 | 5 |
| Lease | 54 | 1 | 14 |
| Rental | 50 | 0 | 8 |
| Stock | 10 | 0 | 7 |
| Staff | 14 | 2 | 5 |
| Transportation | 14 | 0 | 9 |
| HRM | 22 | 0 | 9 |
| Movements | 3 | 0 | 3 |
| shared | 2 | 0 | 2 |

### Readonly exception inventory

- `src/app/modules/Vouchers/Receipts/Receipt/components/details/details.component.html`: `receiptActualAmount`, `receiptCommissionPercentage`, `receiptCommission`, `receiptVatAmount`, `amount`, `alreadyAllocated`, `due`.
- `src/app/modules/Vouchers/CreditNote/components/details/details.component.html`: `Row.perHourRate`, `Row.amount`, `Row.tax`.
- `src/app/modules/Vouchers/Bills/BillDetail/components/details/details.component.html`: `tax`.
- `src/app/modules/Staff/Staff/components/list/list.component.html`: `staff-revise-gross`.
- `src/app/modules/Staff/Staff/components/details/details.component.html`: `staff-gross`.
- `src/app/modules/Lease/LeaseAgreement/components/details/details.component.html`: `lease-agreement-months`.

### Frontend task file list (319 files)

Paths are relative to the confirmed frontend Git root `F:/My Work/Sigma/SiGmaAngularFrontEnd`. This list excludes six untouched pre-existing source-change paths and three concurrent unrelated shared/action-button changes. It includes shared guide/table paths whose compatible pre-task edits were preserved.

- `src/app/modules/Accounts/Budget/components/budget/budget.component.html`
- `src/app/modules/Accounts/Budget/components/budget/budget.component.ts`
- `src/app/modules/Accounts/openingBalances/components/accounts/accounts.component.html`
- `src/app/modules/Accounts/openingBalances/components/accounts/accounts.component.ts`
- `src/app/modules/Accounts/openingBalances/components/cost-center/cost-center.component.html`
- `src/app/modules/Accounts/openingBalances/components/cost-center/cost-center.component.ts`
- `src/app/modules/Accounts/openingBalances/components/customers/customers.component.html`
- `src/app/modules/Accounts/openingBalances/components/customers/customers.component.ts`
- `src/app/modules/Accounts/openingBalances/components/deposit/deposit.component.html`
- `src/app/modules/Accounts/openingBalances/components/deposit/deposit.component.ts`
- `src/app/modules/Accounts/openingBalances/components/prepaid/prepaid.component.html`
- `src/app/modules/Accounts/openingBalances/components/prepaid/prepaid.component.ts`
- `src/app/modules/Accounts/openingBalances/components/staff/staff.component.html`
- `src/app/modules/Accounts/openingBalances/components/staff/staff.component.ts`
- `src/app/modules/Accounts/openingBalances/components/stock/stock.component.html`
- `src/app/modules/Accounts/openingBalances/components/suppliers/suppliers.component.html`
- `src/app/modules/Accounts/openingBalances/components/suppliers/suppliers.component.ts`
- `src/app/modules/Accounts/shared/report-family/account-report-page.component.html`
- `src/app/modules/Accounts/shared/report-family/account-report-page.component.ts`
- `src/app/modules/Administration/Branches/components/list/list.component.html`
- `src/app/modules/Administration/Branches/components/list/list.component.ts`
- `src/app/modules/Administration/ChecklistItem/components/details/details.component.html`
- `src/app/modules/Administration/ChecklistItem/components/details/details.component.ts`
- `src/app/modules/Administration/Countries/components/list/list.component.html`
- `src/app/modules/Administration/Countries/components/list/list.component.ts`
- `src/app/modules/Administration/Currencies/components/details/details.component.html`
- `src/app/modules/Administration/Currencies/components/details/details.component.ts`
- `src/app/modules/Administration/Currencies/components/list/list.component.html`
- `src/app/modules/Administration/Currencies/components/list/list.component.ts`
- `src/app/modules/Administration/PaymentMethods/components/details/details.component.html`
- `src/app/modules/Administration/PaymentMethods/components/details/details.component.ts`
- `src/app/modules/Administration/ReplacementReasons/components/list/list.component.html`
- `src/app/modules/Administration/ReplacementReasons/components/list/list.component.ts`
- `src/app/modules/Administration/Settings/components/common/common.component.html`
- `src/app/modules/Administration/Settings/components/common/common.component.ts`
- `src/app/modules/Administration/Settings/components/document-number/document-number.component.html`
- `src/app/modules/Administration/Settings/components/document-number/document-number.component.ts`
- `src/app/modules/Administration/Settings/components/e-darb/e-darb.component.html`
- `src/app/modules/Administration/Settings/components/e-darb/e-darb.component.ts`
- `src/app/modules/Administration/Settings/components/e-salik/e-salik.component.html`
- `src/app/modules/Administration/Settings/components/e-salik/e-salik.component.ts`
- `src/app/modules/Administration/Settings/components/fields/fields.component.html`
- `src/app/modules/Administration/Settings/components/fields/fields.component.ts`
- `src/app/modules/Administration/SponserShips/components/list/list.component.html`
- `src/app/modules/Administration/SponserShips/components/list/list.component.ts`
- `src/app/modules/Administration/VehicleNotReadyReasons/components/list/list.component.html`
- `src/app/modules/Administration/VehicleNotReadyReasons/components/list/list.component.ts`
- `src/app/modules/Administration/VoucherReasons/components/list/list.component.html`
- `src/app/modules/Administration/VoucherReasons/components/list/list.component.ts`
- `src/app/modules/Agreements Dashboard 2/Clause/components/details/details.component.html`
- `src/app/modules/Agreements Dashboard 2/Clause/components/details/details.component.ts`
- `src/app/modules/Agreements Dashboard 2/PreTerminationRule/components/details/details.component.html`
- `src/app/modules/Agreements Dashboard 2/PreTerminationRule/components/details/details.component.ts`
- `src/app/modules/Agreements Dashboard 2/ProvisionDetail/components/details/details.component.html`
- `src/app/modules/Agreements Dashboard 2/ProvisionDetail/components/details/details.component.ts`
- `src/app/modules/Assets/asset/components/details/details.component.html`
- `src/app/modules/Assets/asset/components/details/details.component.ts`
- `src/app/modules/Assets/assetType/components/details/details.component.html`
- `src/app/modules/Assets/assetType/components/details/details.component.ts`
- `src/app/modules/Assets/depreciationReportFy/components/list/list.component.html`
- `src/app/modules/Assets/depreciationReportFy/components/list/list.component.ts`
- `src/app/modules/Banking/Bank Reconciliation/components/list/list.component.html`
- `src/app/modules/Banking/Bank Reconciliation/components/list/list.component.ts`
- `src/app/modules/Banking/Bank/components/cheque-settings/cheque-settings.component.html`
- `src/app/modules/Banking/Bank/components/cheque-settings/cheque-settings.component.ts`
- `src/app/modules/Banking/Card Transactions Bank Transfers/CardTransactionBankTransfer/components/details/details.component.html`
- `src/app/modules/Banking/Card Transactions Bank Transfers/CardTransactionBankTransfer/components/details/details.component.ts`
- `src/app/modules/Banking/Cash Deposits/CashDeposit/components/details/details.component.html`
- `src/app/modules/Banking/Cash Deposits/CashDeposit/components/details/details.component.ts`
- `src/app/modules/Banking/ChequesPayables/components/details/details.component.html`
- `src/app/modules/Banking/ChequesPayables/components/details/details.component.ts`
- `src/app/modules/Banking/ChequesReceivables/components/details/details.component.html`
- `src/app/modules/Banking/ChequesReceivables/components/details/details.component.ts`
- `src/app/modules/Billing/BillDetail/components/details/details.component.html`
- `src/app/modules/Billing/BillSettings/components/details/details.component.html`
- `src/app/modules/Billing/BillSettings/components/details/details.component.ts`
- `src/app/modules/Billing/BillingInvoice/components/details/details.component.html`
- `src/app/modules/Billing/BillingInvoice/components/details/details.component.ts`
- `src/app/modules/Customers/BalancesSummary/components/list/list.component.html`
- `src/app/modules/Customers/BalancesSummary/components/list/list.component.ts`
- `src/app/modules/Customers/Companies/CompanyPartner/components/detalisForm/billing-info/billing-info.component.html`
- `src/app/modules/Customers/Companies/CompanyPartner/components/detalisForm/billing-info/billing-info.component.ts`
- `src/app/modules/Customers/Individual/IndividualPartner/components/details/details.component.html`
- `src/app/modules/Customers/Individual/IndividualPartner/components/details/details.component.ts`
- `src/app/modules/Customers/ReceivableAgeAnalysis/components/list/list.component.html`
- `src/app/modules/Customers/ReceivableAgeAnalysis/components/list/list.component.ts`
- `src/app/modules/Equipment Rental/EquipmentQuotation/components/details/details.component.html`
- `src/app/modules/Equipment Rental/EquipmentQuotation/components/details/details.component.ts`
- `src/app/modules/Equipment Rental/TimeSheet/components/details/details.component.html`
- `src/app/modules/Equipment Rental/TimeSheet/components/details/details.component.ts`
- `src/app/modules/Equipment Rental/TimeSheet/components/list/list.component.html`
- `src/app/modules/Equipment Rental/TimeSheet/components/list/list.component.ts`
- `src/app/modules/Fleet/Accidents/components/editor/editor.component.html`
- `src/app/modules/Fleet/Accidents/components/editor/editor.component.ts`
- `src/app/modules/Fleet/Accidents/components/list/list.component.html`
- `src/app/modules/Fleet/Accidents/components/list/list.component.ts`
- `src/app/modules/Fleet/Alerts/components/complete-service-dialog/complete-service-dialog.component.html`
- `src/app/modules/Fleet/Alerts/components/complete-service-dialog/complete-service-dialog.component.ts`
- `src/app/modules/Fleet/ServiceBookings/components/editor/editor.component.html`
- `src/app/modules/Fleet/ServiceBookings/components/editor/editor.component.ts`
- `src/app/modules/Fleet/ServiceChecklistItem1/components/details/details.component.html`
- `src/app/modules/Fleet/ServiceLog/components/details/details.component.html`
- `src/app/modules/Fleet/ServiceLog/components/details/details.component.ts`
- `src/app/modules/Fleet/Vehicle/components/details/details.component.html`
- `src/app/modules/Fleet/Vehicle/components/details/details.component.ts`
- `src/app/modules/Fleet/Vehicle/components/list/list.component.html`
- `src/app/modules/Fleet/Vehicle/components/list/list.component.ts`
- `src/app/modules/Fleet/Vehicle/components/tariff/tariff.component.html`
- `src/app/modules/Fleet/Vehicle/components/tariff/tariff.component.ts`
- `src/app/modules/Fleet/VehicleService/components/details/details.component.html`
- `src/app/modules/Fleet/VehicleType/components/details/details.component.html`
- `src/app/modules/Fleet/VehicleType/components/details/details.component.ts`
- `src/app/modules/Fleet/VehicleType/components/manage-groups/manage-groups.component.html`
- `src/app/modules/Fleet/VehicleType/components/manage-groups/manage-groups.component.ts`
- `src/app/modules/HRM/Administration/Leave Opening Balance/LeaveOpeningBalance/components/details/details.component.html`
- `src/app/modules/HRM/Administration/Leave Opening Balance/LeaveOpeningBalance/components/details/details.component.ts`
- `src/app/modules/HRM/Administration/Settings/HrmSetting/components/list/list.component.html`
- `src/app/modules/HRM/Administration/Settings/HrmSetting/components/list/list.component.ts`
- `src/app/modules/HRM/Attendances/Shift/components/details/details.component.html`
- `src/app/modules/HRM/Attendances/Shift/components/details/details.component.ts`
- `src/app/modules/HRM/Attendances/StaffTimesheet/components/details/details.component.html`
- `src/app/modules/HRM/Attendances/StaffTimesheet/components/details/details.component.ts`
- `src/app/modules/HRM/Deductions/Deduction/components/details/details.component.html`
- `src/app/modules/HRM/Deductions/Deduction/components/details/details.component.ts`
- `src/app/modules/HRM/Leaves/LeaveType/components/details/details.component.html`
- `src/app/modules/HRM/Leaves/LeaveType/components/details/details.component.ts`
- `src/app/modules/HRM/Overtimes/Overtime/components/details/details.component.html`
- `src/app/modules/HRM/Overtimes/Overtime/components/details/details.component.ts`
- `src/app/modules/HRM/Payroll/FinalSettlementProcess/components/process/final-settlement-process.component.html`
- `src/app/modules/HRM/Payroll/FinalSettlementProcess/components/process/final-settlement-process.component.ts`
- `src/app/modules/HRM/Payroll/PayrollProcess/components/disbursement/payroll-disbursement.component.html`
- `src/app/modules/HRM/Payroll/PayrollProcess/components/disbursement/payroll-disbursement.component.ts`
- `src/app/modules/Lease/LeaseAgreement/components/additional-charges/additional-charges.component.html`
- `src/app/modules/Lease/LeaseAgreement/components/additional-charges/additional-charges.component.ts`
- `src/app/modules/Lease/LeaseAgreement/components/closing/closing.component.html`
- `src/app/modules/Lease/LeaseAgreement/components/closing/closing.component.ts`
- `src/app/modules/Lease/LeaseAgreement/components/deposit/deposit.component.html`
- `src/app/modules/Lease/LeaseAgreement/components/deposit/deposit.component.ts`
- `src/app/modules/Lease/LeaseAgreement/components/details/details.component.html`
- `src/app/modules/Lease/LeaseAgreement/components/details/details.component.ts`
- `src/app/modules/Lease/LeaseAgreement/components/discounts/discounts.component.html`
- `src/app/modules/Lease/LeaseAgreement/components/discounts/discounts.component.ts`
- `src/app/modules/Lease/LeaseAgreement/components/extend-period/extend-period.component.html`
- `src/app/modules/Lease/LeaseAgreement/components/extend-period/extend-period.component.ts`
- `src/app/modules/Lease/LeaseAgreement/components/extend-period/extend-rate-period.component.html`
- `src/app/modules/Lease/LeaseAgreement/components/extend-period/extend-rate-period.component.ts`
- `src/app/modules/Lease/LeaseAgreement/components/payment-instructions/payment-instructions.component.html`
- `src/app/modules/Lease/LeaseAgreement/components/payment-instructions/payment-instructions.component.ts`
- `src/app/modules/Lease/LeaseAgreement/components/vehicle-replacement/vehicle-replacement.component.html`
- `src/app/modules/Lease/LeaseAgreement/components/vehicle-replacement/vehicle-replacement.component.ts`
- `src/app/modules/Lease/LeaseCostParameter/components/details/details.component.html`
- `src/app/modules/Lease/LeaseCostParameter/components/details/details.component.ts`
- `src/app/modules/Lease/LeaseCostSetting/components/details/details.component.html`
- `src/app/modules/Lease/LeaseCostSetting/components/details/details.component.ts`
- `src/app/modules/Lease/LeaseInquiry/components/details/details.component.html`
- `src/app/modules/Lease/LeaseInquiry/components/details/details.component.ts`
- `src/app/modules/Lease/LeaseTariff/components/details/details.component.html`
- `src/app/modules/Lease/LeaseTariff/components/details/details.component.ts`
- `src/app/modules/Limousine/LimoQuotation/components/details/details.component.html`
- `src/app/modules/Limousine/LimoQuotation/components/details/details.component.ts`
- `src/app/modules/Limousine/LimousineInvoice/components/details/details.component.html`
- `src/app/modules/Limousine/LimousineInvoice/components/details/details.component.ts`
- `src/app/modules/Limousine/TripBooking/components/details/details.component.html`
- `src/app/modules/Limousine/TripBooking/components/details/details.component.ts`
- `src/app/modules/Limousine/TripBooking/components/list/list.component.html`
- `src/app/modules/Limousine/TripBooking/components/list/list.component.ts`
- `src/app/modules/Limousine/limousineTariff/components/limousine-tariff/limousine-tariff-editor.component.html`
- `src/app/modules/Limousine/limousineTariff/components/limousine-tariff/limousine-tariff-editor.component.ts`
- `src/app/modules/Movements/CustodyMovement/components/details/details.component.html`
- `src/app/modules/Movements/CustodyMovement/components/details/details.component.ts`
- `src/app/modules/Movements/WorkshopMovement/components/details/details.component.html`
- `src/app/modules/Movements/WorkshopMovement/components/details/details.component.ts`
- `src/app/modules/Movements/logsMovement/components/list/list.component.html`
- `src/app/modules/Movements/logsMovement/components/list/list.component.ts`
- `src/app/modules/Rental/Agreement/components/deposit/deposit.component.html`
- `src/app/modules/Rental/Agreement/components/deposit/deposit.component.ts`
- `src/app/modules/Rental/Agreement/components/details/details.component.html`
- `src/app/modules/Rental/Agreement/components/details/details.component.ts`
- `src/app/modules/Rental/Booking/components/deposit/deposit.component.html`
- `src/app/modules/Rental/Booking/components/deposit/deposit.component.ts`
- `src/app/modules/Rental/Booking/components/details/details.component.html`
- `src/app/modules/Rental/Booking/components/details/details.component.ts`
- `src/app/modules/Rental/DriverTimeSheet/components/list/list.component.html`
- `src/app/modules/Rental/DriverTimeSheet/components/list/list.component.ts`
- `src/app/modules/Rental/RentalQuotation/components/details/details.component.html`
- `src/app/modules/Rental/RentalQuotation/components/details/details.component.ts`
- `src/app/modules/Rental/RentalTariff/components/details/details.component.html`
- `src/app/modules/Rental/RentalTariff/components/details/details.component.ts`
- `src/app/modules/Rental/TariffCard/components/details/details.component.html`
- `src/app/modules/Rental/TariffCard/components/details/details.component.ts`
- `src/app/modules/Sales/Fleet/components/details/details.component.html`
- `src/app/modules/Sales/Fleet/components/details/details.component.ts`
- `src/app/modules/Sales/SalesAgreement/components/action-dialog/action-dialog.component.ts`
- `src/app/modules/Sales/SalesAgreement/components/details/details.component.html`
- `src/app/modules/Sales/SalesAgreement/components/details/details.component.ts`
- `src/app/modules/Sales/SalesQuotation/components/details/details.component.html`
- `src/app/modules/Sales/SalesQuotation/components/details/details.component.ts`
- `src/app/modules/Staff/Staff/components/details/details.component.html`
- `src/app/modules/Staff/Staff/components/details/details.component.ts`
- `src/app/modules/Staff/Staff/components/list/list.component.html`
- `src/app/modules/Staff/Staff/components/list/list.component.ts`
- `src/app/modules/Staff/StaffOverTime/components/list/list.component.html`
- `src/app/modules/Staff/StaffOverTime/components/list/list.component.ts`
- `src/app/modules/Staff/StaffStatementOfAccount/components/allocation/staff-allocation-dialog.component.html`
- `src/app/modules/Staff/StaffStatementOfAccount/components/allocation/staff-allocation-dialog.component.ts`
- `src/app/modules/Staff/designations/list/list.component.html`
- `src/app/modules/Staff/designations/list/list.component.ts`
- `src/app/modules/Stock/Item/components/details/details.component.html`
- `src/app/modules/Stock/Item/components/details/details.component.ts`
- `src/app/modules/Stock/ItemRequisition/components/purchase-request/purchase-request.component.html`
- `src/app/modules/Stock/ItemRequisition/components/purchase-request/purchase-request.component.ts`
- `src/app/modules/Suppliers/PayableAgeAnalysis/components/list/list.component.html`
- `src/app/modules/Suppliers/PayableAgeAnalysis/components/list/list.component.ts`
- `src/app/modules/Suppliers/SupplierBalancesSummary/components/list/list.component.html`
- `src/app/modules/Suppliers/SupplierBalancesSummary/components/list/list.component.ts`
- `src/app/modules/Transportation/Transaction/components/details/details.component.html`
- `src/app/modules/Transportation/Transaction/components/details/details.component.ts`
- `src/app/modules/Transportation/Transaction/components/list/list.component.html`
- `src/app/modules/Transportation/Transaction/components/list/list.component.ts`
- `src/app/modules/Transportation/TransactionItem/components/details/details.component.html`
- `src/app/modules/Transportation/TransactionItem/components/details/details.component.ts`
- `src/app/modules/Transportation/TransactionItem/components/list/list.component.html`
- `src/app/modules/Transportation/TransactionItem/components/list/list.component.ts`
- `src/app/modules/Transportation/TransportationAgreement/components/details/details.component.html`
- `src/app/modules/Transportation/TransportationAgreement/components/details/details.component.ts`
- `src/app/modules/Transportation/TransportationAgreementItem/components/details/details.component.html`
- `src/app/modules/Transportation/TransportationAgreementItem/components/details/details.component.ts`
- `src/app/modules/Transportation/TransportationAgreementItem/components/list/list.component.html`
- `src/app/modules/Transportation/TransportationAgreementItem/components/list/list.component.ts`
- `src/app/modules/Transportation/TransportationInvoice/components/list/list.component.html`
- `src/app/modules/Transportation/TransportationInvoice/components/list/list.component.ts`
- `src/app/modules/Transportation/TripSheet/components/details/details.component.html`
- `src/app/modules/Transportation/TripSheet/components/details/details.component.ts`
- `src/app/modules/UserGuide/content/customer-profile-topics.ts`
- `src/app/modules/UserGuide/content/shared-screen-guidance.ts`
- `src/app/modules/Vouchers/Bills/Bill/components/allocation/allocation.component.html`
- `src/app/modules/Vouchers/Bills/Bill/components/allocation/allocation.component.ts`
- `src/app/modules/Vouchers/Bills/Bill/components/details/details.component.html`
- `src/app/modules/Vouchers/Bills/Bill/components/details/details.component.ts`
- `src/app/modules/Vouchers/Bills/Bill/components/list/list.component.html`
- `src/app/modules/Vouchers/Bills/Bill/components/list/list.component.ts`
- `src/app/modules/Vouchers/Bills/Bill/components/loan-change/loan-change.component.html`
- `src/app/modules/Vouchers/Bills/Bill/components/loan-change/loan-change.component.ts`
- `src/app/modules/Vouchers/Bills/Bill/components/loan-plan/loan-plan.component.html`
- `src/app/modules/Vouchers/Bills/Bill/components/loan-plan/loan-plan.component.ts`
- `src/app/modules/Vouchers/Bills/Bill/components/supplier-debit-allocation/supplier-debit-allocation.component.html`
- `src/app/modules/Vouchers/Bills/Bill/components/supplier-debit-allocation/supplier-debit-allocation.component.ts`
- `src/app/modules/Vouchers/Bills/BillDetail/components/details/details.component.html`
- `src/app/modules/Vouchers/Bills/BillDetail/components/details/details.component.ts`
- `src/app/modules/Vouchers/CreditNote/components/details/details.component.html`
- `src/app/modules/Vouchers/CreditNote/components/details/details.component.ts`
- `src/app/modules/Vouchers/DebitNotes/DebitNote/components/details/details.component.html`
- `src/app/modules/Vouchers/DebitNotes/DebitNote/components/details/details.component.ts`
- `src/app/modules/Vouchers/GRNs/GoodsReceivedNote/components/details/details.component.html`
- `src/app/modules/Vouchers/GRNs/GoodsReceivedNote/components/details/details.component.ts`
- `src/app/modules/Vouchers/Invoices/Invoice/components/action-dialog/invoice-action-dialog.component.html`
- `src/app/modules/Vouchers/Invoices/Invoice/components/action-dialog/invoice-action-dialog.component.ts`
- `src/app/modules/Vouchers/Invoices/Invoice/components/core-editor/core-editor.component.html`
- `src/app/modules/Vouchers/Invoices/Invoice/components/core-editor/core-editor.component.ts`
- `src/app/modules/Vouchers/Invoices/Invoice/components/details/details.component.html`
- `src/app/modules/Vouchers/Invoices/Invoice/components/details/details.component.ts`
- `src/app/modules/Vouchers/Invoices/Invoice/components/workshop-editor/workshop-editor.component.html`
- `src/app/modules/Vouchers/Invoices/Invoice/components/workshop-editor/workshop-editor.component.ts`
- `src/app/modules/Vouchers/Invoices/InvoiceBase/components/details/details.component.html`
- `src/app/modules/Vouchers/Invoices/InvoiceBase/components/details/details.component.ts`
- `src/app/modules/Vouchers/Invoices/MiscInvoiceItem/components/details/details.component.html`
- `src/app/modules/Vouchers/Invoices/MiscInvoiceItem/components/details/details.component.ts`
- `src/app/modules/Vouchers/JVs/components/details/details.component.html`
- `src/app/modules/Vouchers/JVs/components/details/details.component.ts`
- `src/app/modules/Vouchers/Payments/PaymentDetail/components/details/details.component.html`
- `src/app/modules/Vouchers/Payments/PaymentDetail/components/details/details.component.ts`
- `src/app/modules/Vouchers/Provisions/Provision/components/details/details.component.html`
- `src/app/modules/Vouchers/Provisions/Provision/components/details/details.component.ts`
- `src/app/modules/Vouchers/Provisions/ProvisionDetail/components/details/details.component.html`
- `src/app/modules/Vouchers/Provisions/ProvisionDetail/components/details/details.component.ts`
- `src/app/modules/Vouchers/PurchaseOrders/PurchaseOrder/components/details/details.component.html`
- `src/app/modules/Vouchers/PurchaseOrders/PurchaseOrder/components/details/details.component.ts`
- `src/app/modules/Vouchers/PurchaseOrders/PurchaseOrder/components/list/list.component.html`
- `src/app/modules/Vouchers/PurchaseOrders/PurchaseOrder/components/list/list.component.ts`
- `src/app/modules/Vouchers/PurchaseRequests/PurchaseRequest/components/details/details.component.html`
- `src/app/modules/Vouchers/PurchaseRequests/PurchaseRequest/components/details/details.component.ts`
- `src/app/modules/Vouchers/PurchaseRequests/PurchaseRequest/components/list/list.component.html`
- `src/app/modules/Vouchers/PurchaseRequests/PurchaseRequest/components/list/list.component.ts`
- `src/app/modules/Vouchers/PurchaseRequests/PurchaseRequestDetail/components/details/details.component.html`
- `src/app/modules/Vouchers/PurchaseReturns/PurchaseReturn/components/details/details.component.html`
- `src/app/modules/Vouchers/PurchaseReturns/PurchaseReturn/components/details/details.component.ts`
- `src/app/modules/Vouchers/PurchaseReturns/PurchaseReturnDetail/components/details/details.component.html`
- `src/app/modules/Vouchers/PurchaseReturns/PurchaseReturnDetail/components/details/details.component.ts`
- `src/app/modules/Vouchers/Receipts/Receipt/components/details/details.component.html`
- `src/app/modules/Vouchers/Receipts/Receipt/components/details/details.component.scss`
- `src/app/modules/Vouchers/Receipts/Receipt/components/details/details.component.ts`
- `src/app/modules/Vouchers/SalaryVouchers/SalaryVoucher/components/details/details.component.html`
- `src/app/modules/Vouchers/SalaryVouchers/SalaryVoucher/components/details/details.component.ts`
- `src/app/modules/Vouchers/TrafficFines/TrafficFine/components/details/details.component.html`
- `src/app/modules/Vouchers/TrafficFines/TrafficFine/components/details/details.component.ts`
- `src/app/modules/Workshop/Job/components/close-job/close-job.component.html`
- `src/app/modules/Workshop/Job/components/close-job/close-job.component.ts`
- `src/app/modules/Workshop/Job/components/editor/editor.component.html`
- `src/app/modules/Workshop/Job/components/editor/editor.component.ts`
- `src/app/modules/Workshop/Job/components/invoice-customer/invoice-customer.component.html`
- `src/app/modules/Workshop/Job/components/invoice-customer/invoice-customer.component.ts`
- `src/app/modules/Workshop/Job/components/time-logs/time-logs.component.html`
- `src/app/modules/Workshop/Job/components/time-logs/time-logs.component.ts`
- `src/app/modules/Workshop/JobEstimation/components/editor/editor.component.html`
- `src/app/modules/Workshop/JobEstimation/components/editor/editor.component.ts`
- `src/app/modules/Workshop/LabourTariff/components/labour-tariff/labour-tariff.component.html`
- `src/app/modules/Workshop/LabourTariff/components/labour-tariff/labour-tariff.component.ts`
- `src/app/modules/Workshop/WorkOrder/components/details/details.component.html`
- `src/app/modules/Workshop/WorkOrder/components/details/details.component.ts`
- `src/app/modules/Workshop/workshopVehicles/components/list/list.component.html`
- `src/app/modules/Workshop/workshopVehicles/components/list/list.component.ts`
- `src/app/modules/i18n/vocabs/ar.ts`
- `src/app/modules/i18n/vocabs/en.ts`
- `src/app/modules/shared/components/branch-tariff-settings/branch-tariff-settings.component.html`
- `src/app/modules/shared/components/branch-tariff-settings/branch-tariff-settings.component.ts`
- `src/app/modules/shared/components/editable-collection-table/editable-collection-table.component.scss`
- `src/app/modules/shared/components/reports/reports.component.html`
- `src/app/modules/shared/components/reports/reports.component.ts`
- `src/app/modules/shared/directives/quantity-input.directive.ts`

### Documentation and local artifacts

- Documentation Git root: `F:/My Work/Shaban Documents/Shaban`; task changes: `sigma-erp/ui/14-editable-collection-table.md`, `sigma-erp/ui/24-colors-icons-buttons.md`, `sigma-erp/ui/27-focus-and-keyboard.md`, `sigma-erp/CHANGELOG.md`, derivative generated packet provenance refreshed by the generator. All eight generated packets were refreshed and checked; no manual generated edits.
- Local `.agents/skills/sigma-screen-refactor/SKILL.md`, this review and `SHARED_NUMERIC_INPUT_MAINTENANCE_EVOLUTION_PLAN.md`.
- Final source syntax parsing also covered every task-changed TypeScript file, including the shared directive, EN/AR vocabularies and guide content, with zero parse diagnostics. Final whole frontend `git diff --check` and scoped documentation diff checks passed; scoped merge-marker scan was clear. No new application source files or tsconfig entries were required.
