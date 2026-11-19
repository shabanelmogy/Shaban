# Balance Summary filter layout — owner follow-up

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-03 |
| Authorization | Owner reports elements changing position while typing filters and asks to apply the correction in Suppliers and Staff Balance Summary too. |
| Scope | Customers/BalancesSummary, Suppliers/SupplierBalancesSummary, Staff/StaffBalancesSummary and their shared filter/validation presentation owners. |

This is a presentation-only amendment to the existing three report contracts. Preserve their fields, query keys, range meanings, validation, applied-query invalidation, totals, paging, statement viewers, exports and print. Customers already has signed amount bounds; Suppliers/Staff retain their existing nonzero Range contract. No new amount-range business is authorized by this layout request.

## Before-edit decisions and conformance

| Concern | Book / inspected source | Frozen target / shared owner |
|---|---|---|
| Filter shape | UI4 Workshop/Job list template and FilterPanelComponent; UI20 TrialBalance report template; actual three summary templates | Keep Customers' existing list/filter exception and Staff's More Filters exception. Apply the same five-column main/advanced filter presentation to Suppliers, keeping the report shell and zero inline inset. This is the scoped interpretation of the owner's request to fix the same presentation across the summaries. |
| Stable control geometry | UI4 FilterPanel SCSS: minmax(0,1fr), 34px controls, three/one columns at1250/720; actual PrimeNG host/root selectors | Add an opt-in shared stableLayout capability on the three main forms. Align fields from the top and bound both PrimeNG hosts and roots to their grid field, so changing text/selection cannot determine field width or move neighboring controls. Preserve reference columns/gaps/height/theme/RTL and default behavior for other consumers. |
| Validation space | UI19 FieldErrorComponent currently emits no error content when valid; Customers range fields currently have two separate To error hosts | Add optional shared reserveMessage translation key, rendered invisibly in the same grid cell as the active message to reserve its actual wrapped geometry. Customers uses its existing range-order message as the reservation for both bounds. One To error host selects the invalid child or form-level order error, which are mutually exclusive under existing validators. Do not clip or suppress actual errors. |
| Toolbar count | UI4 FilterPanel template inserts/removes count badge on edits | In stableLayout keep an invisible badge slot at zero, so the toggle/chevron and toolbar wrapping do not depend on typing. Active-count semantics and accessible label remain. |
| Supplier actions/form | SupplierBalancesSummaryComponent existing typed filterForm, reset/search/refresh/printing/read streams; shared FilterAdvancedDirective and ReportActionsComponent | Project Search/Refresh/Print/Excel through FilterActionsDirective, use the single shared Reset and preserve all existing disabling/search/reset handlers. Same FormGroup owns hidden balanceType. Closing advanced filters changes no values. |

No screenshot supplied for this task. No domain, DTO, AutoMapper, schema, migration, route or permission change. Recipe drift check passed all eight packets; PHASE02 applies with focused discovery/freeze/reconciliation. Write, backend and domain-action phases are not applicable. Root owns the tightly coupled shared presentation and consumers; no subagents. Only source inspection/parsing/diff checks; builds/tests/lint/browser/database/migrations/commits/push/deployment remain prohibited.
