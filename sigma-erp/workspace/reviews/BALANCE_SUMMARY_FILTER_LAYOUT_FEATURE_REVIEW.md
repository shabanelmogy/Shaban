# Balance Summary filter stability

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-03 |
| Scope | Three Balance Summary main filter forms and shared filter/field-error presentation. |
| Contract | BALANCE_SUMMARY_FILTER_LAYOUT_CONTRACT_FREEZE.md |

Pre-edit conformance and decisions are frozen in the linked contract. Existing unrelated frontend/backend changes are preserved. Runtime/visual acceptance remains pending.

## Final reconciliation

| Concern | Compared consumer / shared owner and result |
|---|---|
| Main fields | Three main forms opt into FilterPanel stableLayout=true (defaultfalse). Customers keeps six columns; Staff/Suppliers five. Shared modifier aligns grids from the top and bounds dropdown/calendar hosts and roots width100%, min-width0, max-width100%; dropdown label flex1 1 0/min-width0/overflowhidden, calendar input width100%/min-width0. Text does not determine field width. Existing minmax columns, 7px/16px gaps,34px controls,1250px three-column/720px one-column breakpoints and theme/RTL remain. |
| Customer feedback | Both bounds pass reserveMessage=balancesSummary.balanceRangeOrder. FieldError becomes grid only when opted in; hidden translated text/icon and active alert share grid-area1/1 with existing font11px,line-height1.35,gap4px,margin3px. Hidden reservation is aria-hidden and has no alert role; longer active text can expand, never clips. Default hosts retain displayblock/content-sized feedback. |
| To errors | One FieldError selects invalid balanceTo or filterForm, retaining the existing order-key override. Existing finite-bound/order validators make child and form order errors mutually exclusive. No validation or range semantics change. |
| Count badge | Stable toggle reserves an invisible zero-count slot with aria-hidden, minimum widthcalc(2ch+10px). Active count keeps its translated accessible name; default consumers keep conditional rendering. |
| Suppliers | Existing main order dateRange/branchId/supplierId/supplierStatus/salesPersonId; BalanceType uses the same parent FormGroup in a fieldset/legend/native-radio advanced template. New advanced signal starts closed, advanced names=['balanceType']. One shared Reset calls reset(); appFilterActions/appReportActions project existing Search/Refresh/Print/Excel handlers and disabled gates. Removed unused RadioButtonModule. Statement-dialog strip retained. |
| Contracts | No backend change. Existing endpoints, cancellation/invalidation, report completeness/paging/count/totals, grid fields/identities, print/export and viewer contracts stay unchanged. No ListVM/DTO/mapping/calculation/schema/migration/route/permission change. Customers amount bounds retained; Staff/Suppliers Range remains historical nonzero. |

## Changed files

Application repository: F:/My Work/Sigma/SiGmaAngularFrontEnd.

- [Customers template](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/BalancesSummary/components/list/list.component.html>)
- [Suppliers template](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Suppliers/SupplierBalancesSummary/components/list/list.component.html>) and [component](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Suppliers/SupplierBalancesSummary/components/list/list.component.ts>)
- [Staff template](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/StaffBalancesSummary/components/list/list.component.html>)
- Shared filter-panel.component.ts/.html/.scss under F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/shared/components/filter-panel/.
- Shared field-error.component.ts/.html/.scss under F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/shared/components/field-error/.

UI4/19/20, UI preamble1.59, CHANGELOG and skill §3.4/history synchronized. All eight packets regenerated with Generate-SigmaRecipes.ps1 and checked; no direct generated-file edits. Existing feature contracts link this later owner amendment.

## Verification / owner handoff

All five component TypeScript/templates parse with zero syntax errors; five styles parse after removal of existing SCSS line comments. Final modified shared source rechecked after the default-host compatibility correction. Existing English/Arabic feedback/general filter keys present; all three stable/advanced/reset bindings present. Complete scoped frontend diff reviewed; diff--check passed. Previous Customer Range/Staff More Filters work and unrelated dirty files preserved. Source parsing is not an Angular build or visual pass.

Focused discovery/freeze, PHASE02 presentation and final source reconciliation applied. Backend/writes/domain actions/schema/routes are not applicable; no screenshot or unresolved business decision. Root handled the tightly coupled fix without subagents. No build/test/lint/browser/application/database/migration/commit/push/deployment/Graphify/Sigma MCP run. Add-Migration is not required.

Owner verification pending: type/edit dates and select/clear long dropdown labels in the three summaries, Arabic/English and light/dark, including widths around1250/720px. Expand/collapse More Filters. In Customers select Range, submit empty bounds, enter valid/reversed/corrected bounds and confirm fields/toolbar remain positioned as feedback changes. Check existing Search/Reset/Refresh and print/Excel gates/output. Longer feedback remains readable and can expand beyond the reservation.

Suggested frontend commit: `fix(balance-summary): stabilize filter layout while editing`. No backend commit for this follow-up; nothing committed.
