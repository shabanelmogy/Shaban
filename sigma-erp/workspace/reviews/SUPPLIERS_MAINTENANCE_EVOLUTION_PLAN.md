| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-03 |

# Suppliers maintenance and evolution plan

Requested outcome: review and implement documentation-backed corrections for **every screen** below `SiGmaAngularFrontEnd/src/app/modules/Suppliers`. Owner explicitly confirmed the entire folder on 2026-10-03. Source-only execution; no builds, tests, lint, database, migrations, browser, commits, pushes or deployment.

## Existing state and impact map

| Area | Current owner / consumers | Decision | Evidence / impact |
|---|---|---|---|
| Supplier list and modal | Supplier/components/list, details, models, SupplierService; Supplier backend CRUD | Refactor | Five displayed business columns already match SupplierListVM. Existing modal has optional single address; reuse normal-entity list and tracked owned-reference write patterns. |
| Supplier statement | SupplierStatementOfAccount; GET Supplier/Statement; SupplierStatementResponseDto | Refactor / Extend | Complete ledger and advance-tax arrays, no slicing. Existing outstanding filter uses cumulative balance and never supplies due/allocation amounts. Resolve residuals from persisted allocation links, return authoritative outstandingTotal. |
| Supplier balances | SupplierBalancesSummary; GET Supplier/BalancesSummary | Refactor / Extend | Current clamp 1..200, Skip/Take and totals across all filtered suppliers; page-only export and page-only client sorting misrepresent scope. Add explicit IncludeAllRows opt-in, preserve paged default. |
| Payable aging | PayableAgeAnalysis; GET Supplier/PayableAgeAnalysis | Refactor / Extend | First 200 rows only; custom toggle ignored by API; allocation amount deducted again from credit-minus-debit ledger net. Correct both-sided matching before aging; complete-response opt-in. |
| Shared UI | Existing shells, grid, dialogs, summary cards, dates, errors, money, serializers | Keep / Adopt | UI owning blocks and actual references; no parallel controls or feature palettes. |
| Supplier persistence | SupplierConfig and existing VAT/TRN constraints | Extend | Align duplicate checks/indexes with authenticated tenant and live rows. Owner-run migration if configuration changes. No persisted report fields or historical rewrites. |
| Other modules and reference screens | Existing unrelated dirty changes | Keep | References read only. Do not change CustomerService, customer screens or generic base behavior. |

## Logic ambiguity and decision review

| Concern | Resolution / authority | Status |
|---|---|---|
| Scope | All four Suppliers screens and directly related API/persistence contracts | Confirmed — user |
| UI shapes | Supplier type 01 list + modal; three type 07 reports | Confirmed — catalog, fields/owned single address, report sources |
| Aging sign | AP credit-minus-debit, preserved; statement/balances debit-minus-credit with translated Dr/Cr | Confirmed — SupplierService existing sign contracts |
| Allocation arithmetic | Reduce eligible opposite-signed lines equally, bounded by both capacities; allocation informational, never subtract again from net | Confirmed — BE 17 and persisted JournalVoucherAllocation links; CustomerService inspected as source evidence only |
| As-of eligibility | Same cutoff on allocation and both live, tenant-scoped, posted, non-voided AP sides | Confirmed — BE 17; JournalVoucherAllocationQueryExtensions; DebitNoteService explicit AP source-link writer |
| Statement outstanding | Credit-side payable residuals at toDate; positive due amount and backend total. Preserve ledger balance calculation over complete period. | Derived — existing AP sign and allocation facts; replaces running-balance test |
| Custom periods | Off = 30/60/90/120/150/180; on = six positive strictly increasing integers; effective applied labels everywhere | Confirmed — documented defaults and BE 17 |
| Complete response | IncludeAllRows=false remains existing paged contract; Suppliers consumers opt in true for full output | Confirmed — BE 17 and existing response metadata |
| Missing AP mapping | Fail with localized configuration error; never widen to all accounts or report false zero balances | Confirmed — BE 17 |
| Posting / access / destructive data correction | No posting changes, access policy invention or existing-data rewrite | Not Applicable |

## Options and target

Keep legacy UI/partial exports was rejected because it leaves known contract violations. Repeatedly fetching paged reports was rejected in favor of a backward-compatible complete-response opt-in: these reports currently recalculate the full filtered dataset before slicing. Replacing APIs or adding persistence was rejected because existing owners already supply the data. The selected implementation adopts shared presentation, corrects the scoped read arithmetic and validation, preserves endpoint and persisted accounting ownership, and adds only minimal read metadata.

## Migration and compatibility

Keep existing request filters and endpoint paths. Additive IncludeAllRows and outstandingTotal only. VAT/TRN index changes require owner-run migration and inspection of existing live tenant duplicates before applying it. No migrations or snapshots edited. Existing posted journals and allocations are not modified.

## Implementation and verification

Phases 0/1 root-owned: discovery, source evidence and frozen contract. Independent backend, Supplier CRUD frontend, and payable-aging frontend work follow the frozen handoff. Root owns statement/balances frontend, translations, integration and Phase 6. Each worker owns disjoint files, preserves peer/user changes and reports contract conflicts. Final source comparisons cover fields, filters, complete rows/totals, errors, cancellation, routes, shared presentation, translations and complete scoped Git diffs in both repositories. Owner verifies compilation, CRUD, concurrent writes, reports with >200 suppliers, partial/full allocations, future/deleted/voided sources, custom periods, print, language, RTL, dark theme and narrow layouts.
