# HRM Payroll test-data cleanup

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-09 |
| Authorized server | SQL5106.site4now.net |
| Authorized database | db_a82a9c_sigmaoperations1 |
| Authorized tenant scope | All companies, explicitly confirmed by user |

User explicitly requested deletion of prior test data blocking development and confirmed this server/database and all-company scope. This current-task authorization overrides only the standing ban on database commands needed for the cleanup; it does not authorize migrations, builds, commits, deployment or unrelated data destruction.

Read-only inspection identified dbo.HrmSetting with no referencing foreign keys and no enabled triggers. It contains eight live rows (Ids1-8) for SubscriptionId1007 and zero archived rows. Row8 is the latest by CreatedAt/Id; it has previous-month OT=true, previous-month commission=false, business-unit payroll=true. Earlier rows duplicate the tenant settings and also carry unsupported flags. This matches both branches of the PayrollSettingsUnsupported source guard.

Frozen cleanup: obtain a locked full row snapshot and save a local JSON backup before mutation; delete older live duplicate settings, retaining latest by CreatedAt DESC/Id DESC per SubscriptionId; reset unsupported commission/business-unit flags to false on retained live rows; preserve the supported previous-month overtime setting and other retained fields. Execute in one serializable transaction with table lock, FK/trigger recheck, rollback on failure and invariant checks before commit. Re-read afterward to confirm no duplicate live settings and no unsupported enabled flags. Do not delete staff, salary packages, payroll revisions, payments or unrelated operational tables.

No source-code contract or schema changes are part of this data cleanup. The ProcessPayroll action-row source follow-up was completed independently and reconciled in HRM_PAYROLL_FINAL_RECONCILIATION.md.

## Executed outcome

- Committed one atomic cleanup transaction on the authorized database.
- Backed up 8 complete HRM settings rows before mutation.
- Deleted 7 older live duplicate settings rows.
- Reset unsupported flags on 1 retained live settings row(s).
- Backup: F:/My Work/Sigma/reviews/HRM_PAYROLL_TEST_DATA_CLEANUP_20261009T162213278Z_BACKUP.json
- SHA256: 07655C6A70AB398FF7AFE5E293FF1116E011925F5ACD53235C168DE272215875
- Duplicate-live-row and unsupported-enabled-flag invariants passed before commit.
- Independent post-commit verification is the next step.

## Independent post-commit verification

| Field | Value |
|---|---|
| Status | Closed |
| Owner verification pending | yes — retry ProcessPayroll in the application |

A separate read after commit confirms one live HRM setting: Id8, SubscriptionId1007, previous-month OT=true, previous-month commission=false, business-unit payroll=false. Duplicate tenant count=0; unsupported-enabled settings count=0. The two database causes of PayrollSettingsUnsupported are removed. The application workflow was not executed. Eight pre-cleanup rows remain recoverable from the referenced JSON snapshot. No other application table was modified, no schema/migration/build/test/commit/deployment action was performed. Database inspection/mutation in this follow-up was explicitly authorized by the owner, including the named target and all-company scope.
