| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-26 |

# Monthly Posting — implementation plan

Owner outcome: repair the missing monthly page. After being asked whether the
page should only display a report or perform posting, the owner supplied
MonthlyPosting.png showing Month, Prepare, Excel, provision number/title,
first/last/due dates, amount, Posted?, and Post. This resolves the earlier
deferral in the Provisions contract in favor of the explicit Post action.
The image is functional evidence, not layout authority. No background posting
or real execution against the owner's database is authorized.

## Inventory, impact and alternatives

The sidebar already links /MonthlyPosting, but the active router has no such
route, component, service or API. Its wildcard redirects to error/404. Existing
Provision owns balanced monthly template lines and immutable scheduled
ProvisionOccurrence rows. Each occurrence has DueDate and a nullable JV link;
the unique tenant/provision/due-date key already prevents duplicate schedules.
Provision edit/delete guards lock retained journal history. Transactions reads
occurrence journals. The existing resolver owns accounting validation, open
periods, base currency, cost centers, references and journal numbers.

| Area | Decision | Reason / impact |
|---|---|---|
| Provision definitions/schedule | Keep | Reuse saved monthly amounts and due dates; no new schedule or division by months |
| Monthly read/action | Create | Missing route/API; bounded operational snapshot and explicit confirmed Post |
| Occurrence journal FK | Extend writer use | Existing source identity; no parallel monthly batch entity needed |
| Journal resolver / audit / number authority | Keep | No duplicate ledger or numbering engine |
| JV source guards and source navigation | Extend | Occurrence-owned JVs must stay protected and resolve back to the provision |
| Shared UI owners | Reuse | FeatureTitle, FilterPanel, DataTable, PrimaryActionButton, confirmation, StateMessage, Excel |
| Schema / historical data | Keep | No entity/config/migration/snapshot changes or inferred legacy backfill |

Selected: direct Post of saved due occurrences, an explicit domain action on
existing scheduled work, with final confirmation. It is not ordinary document
Save and has no separate editable batch document. Generated JVs are source-owned
and approved as part of that explicit posting action, retaining approval audit.
Rejected: report-only (does not satisfy Post); redirecting to another page or
legacy line CRUD (wrong business); creating another schedule/batch schema (no
proven need); automatic catch-up or reposting retained canceled history (unsafe).

## Decisions, compatibility and execution

See MONTHLY_POSTING_DOMAIN_API_CONTRACT_FREEZE.md for the exact handoff. Stored
dates and amounts are authoritative. One JV per scheduled occurrence, dated at
its saved due date, with exact monthly debit/credit lines and nullable branch
(the template has no branch contract). No tax, currency conversion or cash flow
is introduced. Missing account/cost-center/fiscal configuration fails safely.
Legacy definitions without occurrence evidence are counted as an exclusion
warning rather than guessed into dates or amounts. Legacy root-JV/agreement-owned
scheduled rows are visible blocked rows; they are not posted a second time.

Only explicit unlinked valid occurrences can be posted; retained draft/void/
deleted/malformed journal links block the batch. Posted rows remain visible.
Post re-prepares under source/financial locks and compares the preview key before
writing. Batch is all-or-nothing in one outer multi-save transaction. No partial
posting, mutation replay on Retry, arbitrary client amounts or hidden filtering.
No unpost/void/delete action is invented for this page. Existing source-owned
general-JV restrictions remain authoritative; future correction requires its
own frozen owner workflow.

Phases: discovery/freeze now; isolated backend read/action and frontend workspace
after freeze; root integrates routing/vocabulary/guide/JV source ownership, then
reviews the complete scoped diff. Appropriate shapes: bounded read workspace
with domain Post (UI1/4/6/7/9/22, financial collection workspace exception),
BE17 operational read plus BE15/18 financial domain action on existing aggregate.
Reference roles selected from books: Job list for shared strip/table contracts,
OpeningBalances for workspace shell, InvoiceService/resolver for transaction
authority, existing confirmation and journal readers for public interaction.

Verification: source only; parse TS/HTML, compare namespace/import/project and
API contracts, inspect guards/transaction/source navigation/loading/cache/query
boundaries and indices. Owner builds/runs and checks month boundaries, repeated
Post/concurrency, stale snapshot, invalid references/periods, rollback of the
whole batch, legacy exclusions, tenant isolation, exact journals and report
navigation, lost-response recovery, RTL/themes/mobile. Measure fixed tenant,
month, volume and cold/warm conditions; no speed claim from source inspection.
Existing schedule schema must already be deployed. No new migration required
by this implementation; do not generate a duplicate of the existing migration.
