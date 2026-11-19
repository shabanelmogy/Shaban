| Field | Value |
|---|---|
| Status | Frozen |
| Date | 2026-10-26 |
| Owner verification pending | yes |

# Staff confirmed review fixes — frontend/backend handoff

Owner says to fix the findings in STAFF_FEATURE_REVIEW current2026-10-26 audit.
This authorizes F1–F8 source fixes, not unresolved historical accounting/schema
decisions. Existing STAFF_RECORD/BANK_ACCOUNTS/OPERATIONS/REPORTS_LISTS/BACKEND
and DOCUMENTED_REVIEW handoffs retain fields, routes, calculation/cutoff,
permissions, children, sparse payroll/calendar/write and report contracts.
Initial generator -Check all8 passes; scoped Staff/Timesheet/backend files clean,
unrelated shared/Customers/Suppliers changes preserved. No builds/tests/lint/
typecheck/browser/DB/migrations/snapshots/commits. Source parsers/diffs allowed.

## Frozen implementation

- F1/F2/F4: existing ReferenceLookupStatus page default owns required routed
  bootstrap, always mounted independent of loaded result; aggregate local flags
  with watches, keep local busy and error/Retry, remove per-select spinners.
  Page-owned tables explicitly suppress duplicate progress. Body-appended dialog
  reads keep one local StateMessage and no global count; writes retain global
  count plus existing EditorDialog foreground save/navigation safety. Balances
  drill-down adds existing-handler Retry and suppresses table/Search indicators.
- F3: Staff editor Branch/Country and Balances Branch finite successful bootstrap
  then once-bound ReferenceLookupBindings watches, correct current selected-ID/
  option getters, no draft writes, null-context clearing, errors/Retry/teardown.
  Preserve both nationality/address country labels. Do not cache direct Staff,
  Role, Department, Shift, Designation, Sponsorship or LeaveType sources.
- F7: shared int32ValueValidator for Overtime/Duty staffId; preserve required/min.
- F5: reuse existing ledger byId dictionary for explicit allocation source;
  maintain original sequence, source authority, capacity and account/sign checks.
  Index receipt/note by journal once while preserving FirstOrDefault first-match
  behavior; no unique-data assumption, query/cache/schema changes.
- F6: move duplicate Staff preflight checks into the existing journal writer's
  transaction via an internal reusable partner/account-constrained allocation
  entry point (IJournalVoucherService overload/new method allowed; no HTTP DTO or
  endpoint change). Staff still resolves fresh allowed staff-account IDs and
  rejects missing policy, then passes expected partner/allowed account constraint.
  Shared AllocateAsync remains compatible for existing callers. Validate Staff
  target constraint inside the writer before source acquisition, acquire open
  sources once there, preserve invalid request/duplicate/source/target capacity,
  posted/approved/nonvoided, account/partner/branch/currency, financial precision,
  effective reservation and transactional write-time rechecks. Do not pass a
  cached/preflight source list across transaction boundaries or weaken guards.
- F8: override Staff's existing deep detail endpoint reader with explicit scoped
  no-tracking projection/finite collection queries, keeping exact StaffDetailVM
  and not altering shared recursive repository globally. Include current labels,
  partner address identity/flags/country, live documents/eligibilities/bank IDs
  and all rendered fields; filter tenant/live child collections, preserve
  historical reference labels without blanket selectable filters. Salary stays
  separate; no financial graph or unrelated aggregate navigation loading.

## Ownership / final gates

Root owns Staff record/list UI, current guide, artifacts, canonical/skill/packet
promotion and integration/final diff. Reports worker owns Statement/allocation,
Balances, Alerts, Designations frontend only. Operations worker owns Overtime/
Duty + active HRM StaffTimesheet frontend only. Backend worker owns StaffService,
JournalVoucherService and IJournalVoucherService + directly needed mapping only.
No overlapping files; peers preserve changes and stop a conflicting slice.

Verify actual symbols/imports/finite/teardown/request ownership, all shared cache
sources/writers/context/selection, unchanged API/payload/rows/totals/state, query
boundaries/index disposition and complete scoped diff. Update existing Staff
in-app guide before handoff. No index/schema source change; prior exact index
proposals remain owner SQL-plan/timing work. Record before/after source budgets
without measured-speed claims. Runtime visibility/DI/cache/SQL/accounting,
RTL/theme/keyboard/print remain pending owner verification.

## Implementation handoff — 2026-10-26

F1–F8 are implemented and root source-reconciled in STAFF_FEATURE_REVIEW's
current corrective section. The backend uses four finite detail materializations
and the existing transaction's constrained allocation path; no schema/HTTP DTO
change. All scoped frontend/backend diffs reviewed; 21 frontend/guide files
and three backend files parsed with zero syntax
errors, scoped diff --check passed.
The in-app Staff guide, BE7 canonical guidance, execution skill/history and
generated packets are current; final generator -Check all8 passed. No execution
outside source-only scope occurred. Runtime/SQL/EF/accounting/visual acceptance
and historic out-of-scope decisions remain explicitly owner-pending.
