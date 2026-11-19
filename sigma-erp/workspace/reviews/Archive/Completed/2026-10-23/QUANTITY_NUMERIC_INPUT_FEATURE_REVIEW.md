| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Shared Quantity input — 2026-10-04

Implemented owner instruction for one general Quantity numeric input with increase/decrease buttons. Frozen Maintenance/Evolution plan and frontend contract are in the matching QUANTITY_NUMERIC_INPUT artifacts. Source owner is F:/My Work/Sigma/SiGmaAngularFrontEnd. Prior dirty feature/shared changes were preserved; the current task changed only the numeric controls/direct standalone imports and directly related shared presentation/docs. Later filter steering is separately scoped to ItemIssue onward and recorded in its historical contract/review; earlier feature filters were not edited.

## Decisions and conformance

| Concern | Frozen owner/reference | Final target evidence | Result |
|---|---|---|---|
| Widget and form | PrimeNG InputNumber + Opening Balances stock/UI14 | QuantityInputDirective configures the installed CVA; each consumer keeps its original reactive binding | Match; no second form graph |
| General stepping | Explicit owner instruction supersedes spinner-free Quantity appearance | Shared showButtons true/stacked; global 22px rail, 34px control token, width100/minwidth0 | Implemented, visual pending |
| Number formatting/precision | Existing integer domain/form contracts; LubricationJobItem and TransactionItem decimal | 33 integer controls maxFractionDigits0; lubrication decimal min/step.01, transaction decimal default20; legacy ServiceChecklistItem1 unrestricted default20 | Source-supported; no invented domain precision |
| Bounds and persistence | Existing forms, backend quantity members | Original min/max/dynamic remaining limit/step and number-null transport retained; payloads/backend untouched | Match |
| Calculations | PrimeNG spin/handleOnInput/updateModel inspected | Job/JobEstimation recalculateItem moved from native input to onInput after model update; other subscriptions remain feature-owned | Match; runtime pending |
| Focus | UI27 GlobalNumericFocusService | Same native input.p-inputnumber-input role=spinbutton matcher; no new selection handler | Match |
| Label and errors | UI19/27 FieldError/focusField | inputId/ariaLabel preserve labels; directive mirrors invalid+touched/dirty to inner aria-invalid; EN/AR actual button labels | Match |
| Generic clear | GlobalInputClearService.isEligible | Shared data-no-clear prevents text-clear overlay on numeric rail; keyboard clearing stays widget-owned | Match |
| Theme/width/read-only | UI14 and shared stylesheet | Shared theme tokens/LTR numeric text; existing widths and read-only Remaining/derived/View text untouched | Source match; visual pending |
| Wiring | UI1 standalone/tsconfig existing import closure | All 28 standalone consumers import directive and InputNumberModule; new runtime directive is imported from those runtime entry points | Source match; compiler pending |
| Docs | UI14/27 + required skill | Book1.70/skill/history record Quantity recipe; later1.71 records ItemIssue filter alignment | Synchronized; packets stale |

Legacy Fleet/ServiceChecklistItem1 has a frontend numeric Qty control but no matching backend model in inspected source. Existing decimal-capable entry was retained; its unrelated runtime API contract remains uncertain. This presentation task introduces no API change. No new grid/ListVM, action state, permissions, domain calculations, AutoMapper, schema or migration. No screenshot styling was transplanted. Prior PR-status runtime diagnosis remains separate and unresolved without its actual API response.

## Files and scoped adoption

Shared new source: src/app/modules/shared/directives/quantity-input.directive.ts. Shared changed source: src/styles.scss; general.increaseQuantity/decreaseQuantity only in EN/AR vocabs. All template rows below have their paired standalone .ts imports updated. Total36 controls/28templates:

| Template | Controls |
|---|---|
| src/app/modules/Billing/BillDetail/components/details/details.component.html (+ paired .ts) | 1 |
| src/app/modules/Accounts/openingBalances/components/stock/stock.component.html (+ paired .ts) | 1 |
| src/app/modules/Workshop/LubricationJob/components/create/create.component.html (+ paired .ts) | 1 |
| src/app/modules/Stock/StockTransferItem/components/details/details.component.html (+ paired .ts) | 1 |
| src/app/modules/Stock/StockTransfer/components/details/details.component.html (+ paired .ts) | 1 |
| src/app/modules/Stock/ItemReturnItem/components/details/details.component.html (+ paired .ts) | 1 |
| src/app/modules/Workshop/JobEstimation/components/editor/editor.component.html (+ paired .ts) | 1 |
| src/app/modules/Stock/ItemReturn/components/details/details.component.html (+ paired .ts) | 1 |
| src/app/modules/Stock/ItemRequisitionItem/components/details/details.component.html (+ paired .ts) | 1 |
| src/app/modules/Stock/ItemRequisition/components/purchase-request/purchase-request.component.html (+ paired .ts) | 1 |
| src/app/modules/Stock/ItemRequisition/components/issue/issue.component.html (+ paired .ts) | 1 |
| src/app/modules/Lease/LeaseInquiry/components/details/details.component.html (+ paired .ts) | 1 |
| src/app/modules/Stock/ItemRequisition/components/details/details.component.html (+ paired .ts) | 1 |
| src/app/modules/Stock/ItemIssueItem/components/details/details.component.html (+ paired .ts) | 1 |
| src/app/modules/Workshop/Job/components/editor/editor.component.html (+ paired .ts) | 1 |
| src/app/modules/Stock/ItemIssue/components/details/details.component.html (+ paired .ts) | 1 |
| src/app/modules/Stock/Item/components/details/details.component.html (+ paired .ts) | 1 |
| src/app/modules/Vouchers/Bills/BillDetail/components/details/details.component.html (+ paired .ts) | 1 |
| src/app/modules/Vouchers/Bills/Bill/components/details/details.component.html (+ paired .ts) | 4 |
| src/app/modules/Vouchers/PurchaseRequests/PurchaseRequestDetail/components/details/details.component.html (+ paired .ts) | 1 |
| src/app/modules/Vouchers/PurchaseRequests/PurchaseRequest/components/details/details.component.html (+ paired .ts) | 1 |
| src/app/modules/Vouchers/GRNs/GoodsReceivedNoteDetail/components/details/details.component.html (+ paired .ts) | 2 |
| src/app/modules/Vouchers/PurchaseOrders/PurchaseOrderDetail/components/details/details.component.html (+ paired .ts) | 1 |
| src/app/modules/Vouchers/GRNs/GoodsReceivedNote/components/details/details.component.html (+ paired .ts) | 4 |
| src/app/modules/Vouchers/PurchaseOrders/PurchaseOrder/components/details/details.component.html (+ paired .ts) | 2 |
| src/app/modules/Transportation/TransactionItem/components/details/details.component.html (+ paired .ts) | 1 |
| src/app/modules/Fleet/VehicleService/components/details/details.component.html (+ paired .ts) | 1 |
| src/app/modules/Fleet/ServiceChecklistItem1/components/details/details.component.html (+ paired .ts) | 1 |

Documentation: ui/14-editable-collection-table.md, ui/27-focus-and-keyboard.md, ui/00-preamble.md and CHANGELOG.md in the canonical documentation root; required sigma-screen-refactor skill rule/history. Separate filter refinement touches UI4/skill/version1.71 and only ItemIssue list HTML.

## Phase and final reconciliation

PLAN00/Phase0 inventory and existing owner review, Phase1 frontend freeze, Phase3 controls, Phase5 standalone wiring, Phase6 scoped source/diff reconciliation applied. Backend/read-grid/domain-action phases skipped: no domain or API changes. Source inventory confirms36 shared Quantity widgets and no remaining native editable inputs bound to quantity/qty/quantityOrdered/quantityReceived/maximumQuantity in the application template scope; readonly values remain text. Directives/modules, integer/decimal precision, labels/events/bounds and task whitespace reviewed. No merge-marker or stale NumericFocusDirective usage in migrated consumers; other numeric fields keep that directive when used. Generated recipes drift; regenerate and semantically review as owner follow-up, no generated packet edits.

Two inherited-model bounded workers owned Vouchers+Billing and Workshop+Fleet+Lease+Transportation after freeze; root owned Stock/Accounts/shared/docs, integration and source audit. Parallel ownership avoided file overlap and shortened migration. Both wrote their bounded changes, then final reporting hit their usage capacity; root completed source reconciliation. Their final reports are not taken as runtime acceptance.

Owner verification: frontend build; keyboard/type/paste/clear and up/down buttons; existing min/max and remaining cap; decimals in lubrication/transaction; Job/Estimate row totals after typing/stepping; Save/disabled/View/dirty validation; labels/Tab/select-on-entry; Arabic/English/narrow/dark/light. Browser/runtime acceptance is pending. No build/test/lint/browser/DB/migration/snapshot/Graphify/Sigma MCP/commit/push/deploy commands were run. Suggested FE commit: feat(ui): unify quantity inputs with shared numeric stepping. No BE commit or migration needed.