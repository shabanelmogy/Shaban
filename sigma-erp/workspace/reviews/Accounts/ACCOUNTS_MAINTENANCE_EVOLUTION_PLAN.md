# Accounts maintenance and evolution plan

| Status | Owner verification pending |
|---|---|
| Frozen | yes |

## Scope and impact map

Review and implement canonical conformance across `src/app/modules/Accounts`, its direct routes/providers/compile roots, AccountReports producer paging metadata and shared grid capability needed by in-scope hierarchical reports. Existing business/API rules are kept, not redesigned. No screenshot was supplied; screenshot classification is not applicable. No new permissions, accounting formulas, entities, persistence fields or migrations.

| Existing owner | Classification | Approved scope |
|---|---|---|
| OpeningBalances full-replacement aggregate | Refactor | Existing eight typed row contracts, version/locks and source-owned journals; shared fill/editor/validation/summary/lifecycle |
| Account tree and conversion | Keep + Refactor | Existing hierarchy/business transition, canonical tree exception shell/actions |
| LinkAccounts settings | Keep + Refactor | Existing all-tab replacement/auto-link contract, shared settings lifecycle and layout |
| FiscalYears/MonthClose | Keep + Refactor | Existing period rules, canonical lists/dialogs/actions, read/cancellation/feedback |
| Fourteen complete AccountReports | Keep + Refactor | Existing report fields/sections/totals, typed shared report/grid/output |
| Shared DataTable | Extend | Optional hierarchy only, preserving ordinary consumers |
| Budget matrix | Refactor | Existing changed-cell upsert, typed editing/validation/dirty/readiness and authoritative refresh |
| Journal paged read | Refactor | Preserve PageNumber transport; return authoritative counts, canonical paging/export/filter lifecycle |
| JournalVoucherDetail legacy root | Audit then Remove if proven orphan | Source consumer inventory precedes any removal; canonical Vouchers/JournalVoucher remains |
| Guide recipes | Refactor | Template/manifest reconciliation and generated refresh, complete |

## Alternatives and decisions

Retaining legacy raw tables violates UI20; flattening hierarchical business responses loses semantics; introducing report pagination changes complete output. Extend the shared grid optional hierarchy and retain complete source trees instead. No API/persistence expansion is required. Keep period/conversion/link semantics because source proves them and redesign is outside a guide-conformance request.

The baseline contains user Quantity edits in OpeningBalances stock TS/HTML; preserve them. Root owns discovery/freeze/integration/reconciliation. Independent workers own opening balances, complete reports/shared grid, and Account/settings/periods; root owns Budget/Journal/direct integration. Source-only verification only, with all prohibited commands omitted.

## Gates

Concrete handoffs: `ACCOUNTS_OPENING_BALANCES_CONTRACT_FREEZE.md`, `ACCOUNTS_REPORTS_CONTRACT_FREEZE.md`, `ACCOUNTS_WORKSPACE_CONTRACT_FREEZE.md`. Root freezes Budget/Journal before write. New reusable shared-grid guidance is promoted to UI20 and skill with recipe regeneration. Final source comparisons and scoped complete diffs must precede completion; runtime/build/visual acceptance belongs to owner.
