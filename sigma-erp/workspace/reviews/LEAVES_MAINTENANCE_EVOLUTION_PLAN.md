# Leaves maintenance / evolution plan

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

2026-10-10. User requests review and implementation of HRM/Leaves with screenshots 1–8. Owner continuation: business is incomplete; select the most suitable provisional implementation and revisit business in a later feature build. Scope includes the directly shown Holiday UI, whose existing backend owner is SettingsHolidayModel. Preserve unrelated dirty files in both repositories.

## Impact map and decisions

| Owner | Classification | Decision |
|---|---|---|
| Leave entity, VMs, service, maps, controller | Extend / Refactor | Nullable date-only FromDate/ToDate preserve undated legacy rows. Server computes inclusive calendar duration on dated writes. Existing paid/half-paid/unpaid, previous and remaining counters remain untouched on update and are not client writable. No payroll effect or entitlement formula. |
| LeaveType entity / child / API | Extend / Refactor | One ordered optional staff approver collection; configuration only, no approval authorization or automatic transition. Nullable Gender and MaritalStatus support Any without an invented enum value. Preserve existing rules/flags. |
| Leave / LeaveType grids and editors | Refactor | Shared list/filter/grid and typed payloads. Leave routed editor (state/counters); type modal (one small child collection). Keep existing deep URLs working through route/query editor composition. |
| Holiday | Refactor / Reuse | Use existing SettingsHolidayModel CRUD, date-only contract and tenant ownership. Do not introduce a second holiday entity or endpoint. |
| Leave dashboard | Create | Read-only operational requests, per-type quota configuration, statuses, monthly counts, recent and upcoming requests. Unproved total earned/available balances show unavailable; do not sum catalogue quotas as employee entitlement. Explicit optional staff context, no invented current-user/staff relation. |
| Payroll | Keep | No leave-period deduction, payout, journal or payroll calculation change. |
| UserGuide / bilingual text / routes | Extend | Add topics to existing HRM guide and shared reader/menu. Preserve existing topics/dirty wiring. |

Rejected alternatives: copy screenshot styling; invent accrued employee balances; infer paid allocation from type caps; add a parallel Holiday table; introduce approver permission checks. Accounting/access effects need separate business direction. The provisional request record is operational only.

## Implementation slices and verification

Phase 0 discovery and Phase 1 freeze precede three non-overlapping implementation streams: backend, LeaveType/Holiday Angular, and root Leave/dashboard/integration/text/guide. Phase 4 covers existing Delete and dirty-discard only; no new approval transition. Phase 6 is root-owned source reconciliation. No build/test/lint/browser/DB/migration/commit/push. Owner must create the incremental migration and verify legacy data, CRUD, pagination, dates, lookups, RTL/theme and narrow layouts.
