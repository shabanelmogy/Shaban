| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Test salary package setup — 2026-10-09

Owner authorizes adding salary components for every employee to begin test payroll. Previous explicit target remains SQL5106.site4now.net / db_a82a9c_sigmaoperations1, all companies. Owner confirms any test numbers may be used. Scope: add missing complete salary revisions in dbo.SalaryPackage; preserve existing valid revisions, employees, inactivity, joining dates, payroll snapshots, approvals, logs, attendance, deductions and overtime. No payment/posting/schema/migration action.

Read-only discovery: 32 staff records in SubscriptionId1007, 30 not deleted (12 active,18 inactive). SalaryPackage has31 rows (19 live), no undated active packages, no tenant mismatches, no enabled SalaryPackage/Staff/Partner triggers. Staff276,501,502 have complete six-row packages; Staff97 has only a historical Gross=10000 row. Other26 live staff have no package. Current PayrollRun/Attendance October/Deduction/September Overtime reads return no applicable rows. No October/future joiners.

Frozen values for incomplete staff: effective2026-10-01; Basic2000, Housing350, Transport250, Gross2600, normal overtime hourly rate10, holiday20. These test values reuse source-supported fields and amounts; the owner explicitly authorizes arbitrary test values. Add27 complete revisions/162 rows, including9 active and18 inactive employees. Keep all31 original rows unchanged, including Staff97's incomplete older revision. Only the new complete October revision takes precedence for calculation. Deleted staff are excluded; no employee is activated. Existing valid salaries remain2100,2600,5500 gross.

Source evidence: StaffService.AddSalaryPackages writes six rows using SalaryType OtherIncentive=2 (Basic Type0, Transport Type2, Housing Type1), GrossSalary=0/Type0, Overtime=1/Types0,1. Gross is Basic+Transport+Housing; overtime package values are hourly rates, not monthly earning amounts. PayrollRunService.CalculateSalary uses the latest complete same-date package and guards negative/duplicate/unknown/missing/mismatched gross. EntityBase owns SubscriptionId/GUID/CreatedBy/CreatedAt/live flags. dbo.SalaryPackage.StaffId FK references dbo.Staff.Id. Canonical BE1/8 own audit/tenant/duplicate boundaries; this owner-authorized direct test setup explicitly supplies equivalent ownership and audit fields, without pretending to invoke the authenticated service.

Execution plan: guarded exact-target ADO connection; one Serializable transaction; lock staff/partner inputs and salary table; recheck30 live staff/27 candidates/3 preserved revisions/no current October candidate package/no tenant mismatch/no triggers. Write all original salary rows and minimal staff input snapshot to timestamped JSON outside the repository, verify readable row counts and SHA256 before mutation. Insert six same-date rows per candidate with marker SigmaTestPayrollSeed, tenant taken from each staff parent, unique GUIDs and traceable TEST-PAY No. Recheck complete latest packages for all30, all162 inserted rows and unchanged originals before Commit. Independently read after Commit; idempotent candidate logic prevents duplicate seeding. Roll back on any invariant/backup/SQL failure.

Only authorized data operations run. No application source/backend/calculation/DTO/mapper/schema change for seeding; no build/test/lint/browser/commit/push/deploy. Source/application verification for Payroll Process remains owner-pending. UI notes follow-up is recorded separately in HRM_PAYROLL_FINAL_RECONCILIATION.md.

## Execution and independent verification

| Field | Value |
|---|---|
| Status | Closed |
| Owner verification pending | no |

Committed one Serializable transaction successfully. Added162 rows for27 employees (9 active/18 inactive); retained3 complete existing employee packages and all31 original SalaryPackage rows byte-equivalent in the normalized pre/post JSON comparison. No prior row was updated/deleted. Postcommit independent connection finds30 complete latest employee packages,12 active employees,0 invalid/incomplete/duplicate latest packages,0 tenant mismatches and0 malformed seed rows. SalaryPackage total193; marker SigmaTestPayrollSeed identifies exactly162 rows/27 employees. Effective date2026-10-01. Active salary inputs sum Basic24000 + Allowances9600 = Gross33600. This is a database source check, not an application payroll execution or disbursement.

Backup: HRM_PAYROLL_TEST_SALARY_SEED_20261009T164323734Z_BACKUP.json. SHA256: 2CFBA3659BBA58231C50EB639CBD402A59FDD446C9B53DA9F000C2976B89F883. Readable31-row backup/count validation preceded mutation. Script and outcome evidence: HRM_PAYROLL_TEST_SALARY_SEED.ps1 and HRM_PAYROLL_TEST_SALARY_SEED_OUTCOME.json. The script guards the exact authorized target and expected input counts; subsequent execution fails closed at the now-changed candidate count rather than adding duplicates. No connection credentials are recorded.

All current target salary inputs are ready for October2026. Deleted staff remain excluded and inactive staff remain inactive. The owner can select October2026 and Process, review, Save and then approve through the independent approvals screen. UI/build/runtime acceptance remains separate and pending; this data setup performs no application/API/payment action. No schema/migration/source-backend change is required for the added data. No subagents were used for this sequential owner-authorized setup.
