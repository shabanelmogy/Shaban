# Company data reset — proposed Advanced Settings screen

| Item | Value |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Date | 2026-10-23 |

Owner requests a concept for a general option under Settings / Advanced Settings,
organized by deletion category (transactions, customers, etc.). Explicitly limited
to the company currently signed in; another customer may want a fresh start or
selected data removed. Special permissions are a future phase. This is planning
only: no cleanup source edited, no delete invoked, no permission API invented.
PLAN-00 read after the eight-packet drift check passed. No screenshot evidence.

## Existing state and impact map

| Concern | Current owner/evidence | Classification and proposed responsibility |
|---|---|---|
| Backend reset | Development/DatabaseResetService; IDatabaseResetService; DatabaseResetController | Refactor the destructive execution boundary before any customer-facing reuse. Existing ordinary scopes execute whole-table DELETE without tenant predicate, disable constraints across mapped tables and reseed identities; incompatible with signed-in-company-only reset. Do not wire the new screen to these endpoints. |
| Preview | DatabaseResetPreviewVM/ScopePreviewVM | Extend/replace the company reset preview with scoped record counts, primary scope and dependent record impact. Existing preview counts mapped tables, not affected company records. |
| Categories | ScopeDefinitions/ResolveScopeTables | Keep concepts such as transactions, opening balances, accounting, banking, sales, inventory, assets and HR. Current crm-partners combines customers/suppliers/contacts; split by the actual business entities/roles, not table-name guessing. |
| Dependencies | ExpandWithDependentTables | Replace whole-dependent-table closure with explicit record dependency rules limited to the authenticated company. Show the added affected records before confirmation; never expand silently. |
| Opening balances | OpeningBalanceResetService | Reuse its tenant-aware query ownership and existing lifecycle guards where applicable. It already refuses settled/posted/approved dependent history; do not bypass by calling full-table reset. |
| Authentication/tenant | Existing authenticated controller/repository; BE8 | Derive company/tenant from the authenticated server identity. No client tenant selector or submitted tenant ID; reject missing/invalid ownership and never delete global/shared rows. Confirm the exact company-to-tenant boundary before implementation. |
| UI | No matching frontend reset screen found in scoped filename search | Create a typed action workspace under Advanced Settings. Screen06 workspace plus screen09 typed action dialog are candidate shapes; choose exact canonical reference before implementation. |
| User guide | Existing Settings/UserGuide reader | Extend the owning bilingual guide during implementation with actual categories, dependency preview, recovery limits and outcomes. |
| Other company data | Raw SQL reset currently bypasses repository filtering | Keep all other tenants' rows, global reference data and identities untouched. No global constraint disable or identity reseed for company deletion. |

## Proposed workflow and alternatives

The screen names the current company and offers two paths: a fresh business-data
start, or one selected data category. Category examples: journals/transactions,
opening balances, customers, suppliers, stock, assets, employees and module
transactions. Each category has a short description and Preview action. Start
with one category per run using one atomic backend operation; multi-category
selection, if desired later, needs a combined backend plan rather than UI loops
of independently committed deletes.

Preview shows company identity, selected category, direct and dependent record
counts, protected data and blocking dependencies. Execution uses a typed shared
dialog containing the exact confirmation inputs; this collects input and is not
a confirmation-only dialog. Backend recomputes/checks the plan and current
dependencies before committing. During execution disable competing mutations;
success returns authoritative per-category results. Failed execution rolls back
the company operation and retains a useful reason for correction/re-preview.

| Option | Assessment |
|---|---|
| Wrap existing full-database reset | Rejected: contradicts the owner's explicit company boundary and separate-customer use case. |
| Company-aware explicit domain categories | Proposed: respects tenant and business dependencies; more implementation work but supports later permissions and reliable preview. |
| Arbitrary table selection | Exclude from the customer screen; table names do not express row ownership or financial dependencies. Existing developer utility remains separate unless explicitly reviewed later. |

## Decision register and unfrozen contracts

| Decision | Status/evidence | Remaining work |
|---|---|---|
| Location and availability | Confirmed owner: general option under Advanced Settings, future special permissions | Reuse existing routing/sidebar/authentication; do not claim current controls provide authorization. |
| Tenant scope | Confirmed owner: signed-in company only, including the case of a customer starting over or deleting selected categories | Server derives ownership from the authenticated tenant/company boundary; no client-chosen company and no whole-database execution. Trace branch/shared-row ownership before freezing category predicates. |
| Categorized selective deletion | Confirmed owner | Freeze the actual rows/links each category deletes and protects. Customers and suppliers require separate role/shared-party handling. |
| Fresh-start retained setup | Proposed: preserve company, users, branches, reference/configuration and accounting setup | Owner must confirm exact retained list; do not treat the old GoLive name whitelist as a frozen domain contract. |
| Financial history | Missing reset-specific business decision | Decide treatment of posted/approved/settled/closed-year records and whether selective categories block or require a larger reset. Existing normal lifecycle guards remain until explicitly superseded. |
| Shared customer/supplier identity | Uncertain until domain tracing | Define preservation of a party with both roles and cross-module documents; no silent deletion of the other role. |
| Preview freshness/concurrency | Proposed server plan verification | Freeze cancellation, concurrent writes, stale preview and transactional execution; no second unguarded path. |
| Backup/audit/recovery | Proposed impact report and execution record | Set concrete retention/restore expectations before claiming reversibility; a SQL transaction cannot undo a committed delete. |
| Schema/migration | No approved persistence changes | No migration created, edited or run. Decide if durable execution history needs a new schema only after contract freeze. |

## Implementation and verification sequence

1. Resolve identity, category dependency/lifecycle and retained-setup decisions;
   freeze company-scoped API/preview/action contract (PHASE-00/01/04).
2. Implement explicit tenant-scoped backend preview/execution; keep developer
   whole-database utility separate. Review every affected writer/reference.
3. Implement Advanced Settings workspace and typed confirmation using shared
   owners, bilingual states and guide (PHASE-03/04/05).
4. Reconcile scoped source and owner-run acceptance (PHASE-06): prove another
   tenant's rows unchanged, reject forged/missing identity and stale previews,
   validate dependencies/rollback and each preserved setup, then verify fresh
   account setup can be initialized and operational documents created.

No application reset implementation is authorized by this concept document.
No build/test/runtime/browser/database/migration/commit/deletion commands run.
