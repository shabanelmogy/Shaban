# Quotation and Master Agreement final reconciliation — 2026-10-07

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope | EquipmentQuotation and EquipmentMasterAgreement frontend, existing PO integration |

Consumes the frozen document handoff in ../EQUIPMENT_RENTAL_FRONTEND_CONTRACT_FREEZE.md. The worker implemented isolated source changes; root finished and inspected them after the worker usage limit. The parent feature report owns all-feature reconciliation, full inventory and backend follow-ups.

Quotation list adopts shared shell/title/FilterPanel stableLayout/DataTable, current-month range/Reset, applied filters/route state, complete Excel and server Can* action availability. Confirmation state gates actions and rechecks the current row after confirmation. Typed routed Create/View/Edit preserves source-supported fields and full detail snapshots; description and periodMonths are visible. Shared row removal/dirty handling, QuantityInput, FieldError, focus and money owners replace local chrome. Required details blocks an empty array; all actual integer quantity/period fields reject fractions. Edit deep links reject noneditable loaded state. Two shared editor panes bound the header scroll and table scroll. The PO viewer reads the actual saved search response, has inline error/retry and saved-identity checks; no duplicate edit button is offered there. Existing PO editor integration retains its own current workflow, with list-owned dirty/saving exit protection through its public form. Full PO source conformance is deferred.

Master list shares the same geometry and state/output owners; status badges remain visible through a shared status column. customerId remains in the filter interface because the form and backend both consume it. Returned pageSize is reconciled. Routed Edit uses the existing PUT contract and loaded approval guard, not Create. Quotation customer resolution uses switchMap, identity/version checks and customer lock; successful lookup data and saved options are retained when another request fails. Shared date hydration preserves picker dates.

The sales-order dialog edits existing same-customer association IDs only, using current GET/PUT/{id}/sale-orders. It does not create/delete SaleOrders. Allowed empty snapshot unlinks existing associations; invalid/fractional/out-of-range IDs block Save instead of being filtered into an accidental empty snapshot. Duplicates are rejected. Shared EditableRows supplies removal confirmation and Add/invalid focus. Shared bounded pane, fixed dropdown column and MoneyPipe retain the canonical geometry/format. CanDeactivate delegates through the list route, with shared discard confirmation and reload protection.

Final conformance: UI1/3/4/6 actual Job list/routed editor and shared shell/filter/grid; UI13/14 actual EditorDialog/FormSection/EditableCollectionTable and EditableRows; UI17/19/27 actual date-utils/DatePicker/FieldError/focus; UI9/10 ConfirmationDialogService and routed/list guards; UI2/8/22/28 query/route/all-pages/API error/lifecycle owners. No copied table/filter/palette or new framework. All fields/columns/flags/endpoints are reconciled in the parent report; backend remains read-only.

Root verification passes as part of36 runtime files/11 templates: TS/Angular syntax, local exports, standalone registration/public inputs, translations, declared members, application roots and unused named imports. Full scoped diff and whitespace inspected; compilation/runtime/browser/visual verification remain pending. The owner acceptance list and unresolved backend invariant findings are in the parent report. No build/test/lint/browser/database/migration/commit/push/deploy was performed.
