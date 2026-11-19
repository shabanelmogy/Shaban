# Leave Opening Balance — maintenance/evolution plan

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

2026-10-11. User requests a new Administration page from Capture.PNG and expressly asks the reviewer to infer missing business using comparable HR applications. Master 2 standing owner decision resolves the missing details below.

## Existing state and impact

| Area | Evidence | Decision | Impact |
|---|---|---|---|
| LeaveType | Staffs/LeaveType.cs; quota/accrual/rollover flags exist | Keep | Owning type lookup reused |
| Staff | Staffs/Staff.cs; tenant-scoped Staff select | Keep | Employee identity and label reused |
| Leave | Staffs/Leave.cs; LeaveService.InitializeRequest | Keep | Historical request balance/pay snapshots remain untouched |
| Opening balance | No independent entity/API in scoped HR source | Create | Dedicated tenant-owned starting balance, one per employee/type |
| Administration UI | Existing routes/sidebar and UserGuide HRM content | Extend | New page, translations and guide topic |
| Accounting/payroll | No opening leave ledger consumer exists | Keep | No monetary posting, encashment, payroll or historical request rewrite |

## Alternatives and decisions

| Option | Tradeoff | Decision |
|---|---|---|
| Store opening balance in Leave request | Mixes entitlement with absence and pollutes request counts | Rejected |
| Full accrual/allocation/expiry ledger | Requires period and policy decisions not present in the screenshot; changes existing consumers | Deferred separate work |
| Dedicated baseline records with list/modal editor | Minimal persisted starting balance, date and provenance; readily editable | Selected |
| Bulk financial collection editor | Screenshot has no rows/tabs or bulk save; leave days are not a financial collection | Rejected |

Comparable evidence: Frappe HR Leave Allocation (https://docs.frappe.io/hr/leave-allocation) separates employee/type/date/allocated days from Leave Application. Used as functional inspiration, never Sigma implementation authority. New screen stores imported remaining days as at an explicit date, not annual quota. No inferred statutory rules.

## Target and rollout

Frozen handoff: LEAVE_OPENING_BALANCE_FULL_STACK_CONTRACT_FREEZE.md. New table only, no backfill or inferred employee balances. Existing absence of a record remains absence, not a fabricated zero allocation. Owner creates/applies Add-Migration AddLeaveOpeningBalances, then deploys backend and frontend together. Rollback can remove the route without dropping the table or data. Source-only review, owner build/database/browser verification pending.

Slices: Phase 0 discovery → Phase 1 contracts → independent backend and frontend implementation (Phases 2/3) → Phase 5 routing/guide → root Phase 6 diff reconciliation. Ordinary Save/Search/export/confirmed CRUD deletion require no separate domain transition Phase 4.

## Verification matrix

Source: DTO/grid parity, tenant/FK/unique key, decimal/date transport, concurrency token, route/menu/interceptors, both translations, load/save/error/discard gates and guide conformance. Owner: migration, compilation, two-session concurrency, duplicate insert, invalid days/date/FKs, applied filters/paging/export, failed reads/saves/retry, dirty close/navigation, RTL/dark/narrow layout. No runtime policy/calculation is claimed.
