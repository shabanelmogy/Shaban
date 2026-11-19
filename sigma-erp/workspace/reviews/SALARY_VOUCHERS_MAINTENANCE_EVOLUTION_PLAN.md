| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Salary vouchers evolution — 2026-10-25

Scope: requested review and confirmed fixes of SalaryVouchers, screenshot and explicit HRM relationship review. Owner delegated the suitable choice ("ايه الافضل والانسب") then instructed continuation. Tier L for integration of existing owners; no new payroll/accounting policy.

## Inventory, impact and decisions

| Area / existing owner | Existing behavior | Classification / target | Impact / phases |
|---|---|---|---|
| SalaryVoucher entity/generic API | Header-only manual number, type, date, amount; no FK to HRM/payment/journal | Keep historical records and CRUD in distinct legacy area; refactor validation, filters, lean DTO/maps | Existing data unchanged; phases1–3 |
| PayrollRunService/current revisions | Authoritative monthly/leave/final-settlement snapshot, approval/version/locks | Extend existing list read with No and accounting lock flag; no new calculation | HRM list and salary-voucher entry share producer; phases1/2 |
| PayrollsComponent | Existing type/date filters, view/edit/approve/log/export | Reuse for primary SalaryVoucher route; add number search, payout/history entry, accurate accounting edit lock, legacy navigation | Both entry points share owner; phases2/4/5 |
| PayrollDisbursement | Existing partial/full pay and reasoned void, linked accrual/Payment/JV | Reuse and repair lifecycle, dates, draft/confirmation/request safety; no duplicate writer | Existing HRM and new entry; phases3/4 |
| Process screens | Return hard-coded to ProcessedPayrolls | Extend allowlisted return to SalaryVoucher | phases5/6 |
| UserGuide | Generic manual-list topic | Replace with actual HRM/legacy relationship guidance | phase6 |

## Options / ambiguity

Primary HRM view with separate manual legacy area is selected: it keeps one salary calculation and payment owner and retains old data without guessing identities. Keeping manual entry primary would keep two apparently competing payroll sources; copying HRM writes is rejected. Mapping/importing old manual records into runs is Missing (no staff/period/revision provenance); no automatic migration or accounting is performed. New approval/reject/unapprove policy for PayrollRun is outside this task: retain its frozen approval contract rather than transplanting purchasing policy.

## Compatibility and execution

Preserve /SalaryVoucher, /SalaryVoucher/create and /SalaryVoucher/details/:id for existing records. Primary route reuses PayrollsComponent; /SalaryVoucher/legacy is distinct. No entity/EF change; no migration. Root owns HRM integration, routing, i18n, guide and reconciliation. Bounded agents may own only SalaryVoucher backend and legacy frontend, consuming SALARY_VOUCHERS_DOMAIN_API_CONTRACT_FREEZE.md. Root reviews full scoped diffs. Existing unrelated dirty files, including migrations/snapshot, are preserved. No build/test/lint/browser/database/commit/push.

Verification: source compare filters→projection→count/page/export, writes→server validation, existing payment guard/transaction ownership, view/edit lock, both entry/return routes, bilingual guide, translation keys and complete scoped diffs in each repository. Runtime, database and visual acceptance remain owner-pending.
