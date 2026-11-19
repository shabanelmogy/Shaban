# Currencies — bounded persistence hardening

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-14 |
| Scope | Existing currency master screen, existing duplicate rules, storage validation and dependency-safe deletion |

This is the bounded plan required by Master1 for EF index hardening. It does not replace or freeze Deferred/CURRENCY_EXCHANGE_RATE_MAINTENANCE_EVOLUTION_PLAN.md. Owner authorized confirmed documentation fixes, not new currency-system business semantics.

| Existing owner | Evidence / decision |
|---|---|
| CurrencyService Add/Update | Three existing unique keys Code/Name/DecimalName; precision integer0–6, base<=2; round rate6 places; earliest live currency IsBase. Keep rules, normalize input and share duplicate checks. |
| CurrencyConfig | Required strings100/10/50 and decimal(18,6); no unique indexes. Extend with live-tenant unique indexes (BE2/8). |
| DTOs | Add Name250, Update Name50 versus EF100. Refactor to explicit Name100; lean List/Detail (BE3/7). |
| Delete | Generic RemoveAsync lacks usage checks (known BE19/31). Extend scoped currency delete with shared RemoveWithChildrenAsync; no parent/owned collections. |
| Readers | Currency list/detail, inherited currency selects; FinancialNumberPolicyResolver/GetFinancialNumberPolicy and existing account-report rate reads; Supplier, Bank, PartnerBillingInfo, JournalVoucher references. Keep rate/base meanings and existing select shape. |
| UI | Replace ms-lib and routed legacy form with canonical shared type01 screen. Preserve existing fields/actions/filter property keys. |

## Ambiguities and options

Confirmed: three uniqueness rules, current persisted string bounds, stored rate scale, server-owned base flag. Derived: matching VM/UI bounds and filtered indexes enforce those rules rather than inventing new ones. Unknown: existing duplicate rows and database collation; owner inspects prior to migration. Missing base-currency lifecycle policy and full exchange mechanism stay in the existing deferred plan, outside this slice.

Options: (1) retain UI-only validation: rejected because API can accept invalid lengths/duplicate concurrent writes; (2) harden existing owners using shared helpers and matching indexes: selected, no accounting formula change; (3) new exchange-rate/history/conversion subsystem: deferred, materially different business semantics needing owner decisions.

Source-backed amendment 2026-10-14: extend the existing FinancialNumberPolicyService with synchronous cache invalidate(), consumed only by successful typed currency writes. Its existing load(force) and financial formulas remain. Next policy consumer load obtains a fresh server result. This directly related stale-read fix is included in the frozen integration slice; owner checks a policy read before and after editing currency precision. Alternative forced reload after Save adds a second request/feedback boundary unnecessarily; rewriting other consumers is outside scope. Re-election validation also checks the actual earliest-live winner before Add/Update so base precision<=2 remains enforced without changing which record is selected.

## Impact and target contract

Backend ownership: only CurrencyService, Currency VMs, CurrencyConfig, GeneralMessage EN/AR resources. Frontend ownership: Currencies files, existing CurrencyService, currency EN/AR block, existing administration guide. No entity fields removed/added; no migration/model snapshot edits. Preserve CurrencyProfiler's four maps. API endpoints/envelopes unchanged; trim/read shapes/client-only payload fixed atomically with UI. Frozen exact handoff: CURRENCIES_FULL_STACK_CONTRACT_FREEZE.md. Existing lookup and financial-policy consumers retain their named fields/endpoints.

Schema change: add three unique indexes (SubscriptionId,Code), (SubscriptionId,Name), (SubscriptionId,DecimalName), filter IsDeleted=0. No default/backfill change. Owner checks duplicate live keys per tenant, collation, whitespace and lengths before Add-Migration and deployment; do not automatically trim/rewrite saved data. Deploy backend and frontend together after owner checks. Rollback requires owner migration reversal plus reverting scoped application changes; no reviewer data commands.

Slices: freeze this plan/handoff (0/1); backend DTO/input/duplicate/delete/index correction (1/2/3/4); frontend shared list/editor and wiring (2/3/4/5); user-guide handoff and scoped reconciliation (6). Backend/frontend can run in parallel with disjoint owned files after freeze.

Verification: root reviews full scoped diffs, contract parity, real exports/standalone imports and EN/AR keys; no builds/tests/lint/database/browser/commits. Owner builds both repos, creates migration, checks valid/invalid lengths and numeric values, duplicate self exclusion and concurrent duplicate writes, FK-blocked delete, first-currency precision, list search/paging/export, detail read failures/retry, failed Save retention, discard/X/Escape and mobile/RTL/themes/guide. Source completion remains Implemented — source-only until owner acceptance.
