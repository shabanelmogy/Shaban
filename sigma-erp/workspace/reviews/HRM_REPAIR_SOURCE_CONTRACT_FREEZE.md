# HRM confirmed repairs — source contract freeze

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-12 |

Authority: AGENTS, Master4/5/7, relevant canonical UI/BE blocks, sigma-screen-refactor digest, all8 recipe checks current. Current evidence is `HRM_FRONTEND_COMPREHENSIVE_FEATURE_REVIEW.md` F01–F11 and the actual named source. User authorizes fixes and accounting payroll extension; this handoff covers only compatible independent fixes, excluding new payroll payment/calculation policy.

| Concern | Frozen rule / evidence |
|---|---|
| Numeric F01 | Timesheet WorkingHours/OvertimeHours and Deduction principal: retain decimal(18,2) source storage; reject nonnegative out-of-capacity or nonrepresentable fractional inputs before mutation, including generic bulk and import paths. Accept equivalent trailing zeros. Reuse FinancialNumberPolicy.HasValidMoneyScale. UI reuses financialScaleValidator with2 and existing finite/min/max validation; backend remains authoritative. No new24h cap or rounding/schema change. Existing supported values preserved. |
| Leave F02 | Unchecked pendingRejoining is omitted/null, checked istrue in applied list/export/dashboard filters. Shared serializer false remains supported for genuine negative filters. |
| Duty F03/F09 | HH:mm input matching a saved clock's displayed minute preserves original seconds/fractions; explicit changed minute or empty clear remains a normal edit. An explicit seconds transport may remain exact. Validate all requested clocks as0<=time<24h before mutation. Keep ordinary Attendance rules; do not infer overnight ordering or absent reclassification. |
| StaffRole F04 | Route exit delegates to visible editor's existing canDeactivate, returnsfalse during pending mutation/confirmation, silent exit for view/pristine. Department route/list delegation is exact reference. |
| Settlement F05/F06 | Mandatory policy region is revealed before first-invalid focus. Preserve current identifying fields, payout groups and inputs. Display authoritative normal Additional, monthly/day/divisor/rate context and full payout breakdown. Saved-revision export includes all relevant component/policy values with click-time translated keys. Empty/not-processed values are not fabricated zeros. Reuse shared shell/FormSection/SummaryCards owners, remove obsolete tab code and deep card overrides; no formula/request field change. |
| Report F07 | Complete detail and summary consume one consistent backend read snapshot. Keep SQL grouping and typed output; if retaining two SQL queries use documented serializable read scope. No report dataset/page contract change. |
| Department F08 | Replace custom GetManyAsync with ApplyListFilters/MaterializeListAsync as appropriate, inherit canonical bounded paging/count/order with existing descending identity and same search/id semantics. Return real totalCount; UI current unknown-count compatibility remains usable. No schema/name policy change in this repair. |
| Month F10 | Use safe final-supported-month bounds on direct Staff Duty/OT and legacy Attendance monthly reads/writes; preserve yyyy-MM year1..9999. Payroll's separate max9998 unchanged. |
| Translation F11 | Add existing English Process Overtime Arabic counterpart with no rename. Root owns common vocabularies/resources and guide integration. |

## Conformance/reference evidence

Normal lists: UI1/4/6/10/28 and actual Workshop Job trigger stream, Department modal delegation, shared EditorDialog/freezeFormState. Backend list: BE5/9/13 and actual BranchService hooks/baseService GetManyAsync/NormalizePaging/projection. Money/input: BE3/15 and FinancialNumberPolicy storage constants/HasValidMoneyScale; UI19 and current financialScaleValidator/FieldError. Time/date: UI17 and actual Attendance parseTimeValue(original) + source Duty writer; report: UI20/BE17 complete-output service and consistency requirement. Settlement totals: UI24 SummaryCards public inputs, current PayrollProcess slim/row owner; typed final snapshot producer is authoritative. Body/page sizing and responsive boundaries remain shared.

## Ownership

Backend repair worker: Timesheet/Deduction VMs/services/validation helper if necessary, StaffService/AttendanceService clock/month fixes, DepartmentService hooks and DriverTimeSheetReportService consistency. No PayrollRun service/entity/payment/JV/resource edits.

Frontend repair worker: HRM Leave list/dashboard, StaffRole route/list, Timesheet details, Deduction details/import, FinalSettlement component/model/export only. Preserve pre-existing Timesheet list edits. Reuse current financial validator. No en/ar, UserGuide, shared component or Payroll models/API edits without root coordination.

Root: Payroll/settings/payment/JV discovery and subsequent contract, common resources/vocab, guides, future roadmap, integration and full reconciliation. Workers are not alone; preserve all user/peer changes, never revert others. No generated packet, migration/snapshot, approved reference or prohibited command changes.
