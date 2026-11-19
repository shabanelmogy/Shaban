# HRM Settings — screen contract

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-11 |

## Scope and authority

User requests review and implementation of HRM/Administration/Settings against images7–9 and project documents. Apply AGENTS, sigma-screen-refactor, Master4/5/7, UI screen06/1/13/14/16/19/22, BE16. Recipe Check all eight OK. Images are functional evidence; canonical shared owners govern appearance. No source edits existed in this feature at discovery; preserve other HRM/Account Linking and shared-file peer hunks.

Selected UI: routed tabbed settings workspace, one header/Save All, Pay Structure/Common tabs, one content viewport. Shared FeatureTitle, PrimaryActionButton, EditorTabs(workspace), FormSection, EditableCollectionTable, FieldError, translated options, EditableRows and confirmation. Approved reference Accounts/Link Accounts/details supplies bounded scroll composition; do not edit it. Backend: existing SingleRowSettingsService and IServiceHelper upsert, GET/PUT HrmSetting/Mine. No record list/create/delete UI.

## Functional evidence

| Image | Explicit | Inferred / reviewer resolution |
|---|---|---|
|7|Pay Structure/Common; Save All; Gross Salary rows Basic,Gross,Transportation Allowance,House Allowance; Overtime Normal/Holiday; Other Incentive Air Ticket,Leave Salary,Insurance,Leave Encashment; Type/Formula, Add Row/Remove; Basic/Gross formulas disabled|Use catalog types HrmSalaryItemType1–18 from Account Linking, not incompatible legacy SalaryItemType. Reorder with accessible Up/Down actions instead of inferring drag implementation. Formula optional text, max2000; Basic/Gross and Other Incentive never accept formula.|
|8|Deduction rows Advance,Loan,Fines,Extra,Unpaid,Absent,Halfpaid; Long Term Liabilities(Company Contributions) Gratuity; Formula/Add/Remove|Five fixed sections; each item only in its evidenced section; duplicates rejected. Full ordered collection snapshot, explicit removal confirmation, zero rows allowed.|
|9|Employer MOL Personal Number/Employer Bank Routing Code; Account Linking Type(Default); Days(Thirty Days); first/after-five-year gratuity days; leave salary items; six payroll/leave flags; attendance enable/max regularizations/grace/cutoff/min overtime|Employer strings optional max250, never copy sample identifiers. Linking mode only Default0 because no source-backed alternatives. Days ThirtyDays0/CalendarDays1 supported by current final-settlement proration vocabulary; configure only, no new calculation. Days decimal>=0 max1,000,000 (current settlement input limit), precision18,4. Attendance nonnegative optional Int32, cutoff1–31. Leave salary selection from gross-section items; unique values. Screenshot boolean flags defaultfalse; attendance and other settings config only.|

Keep existing IsBusinessUnitsWisePayrollProcess (not shown) and the two previous-month flags. No automatic commission/business-unit enablement: current PayrollRunService rejects those two flags and continues to do so. Default pay rows use exact image order and empty formulas; rows are config defaults, not invented financial amounts. New nullable PayStructureJson distinguishes legacy/unconfigured data from explicitly saved empty[]. Read defaults only; no DB mutation on GET.

## API/DTO/storage

HrmSetting/Mine read/write retains the existing owner. AddVM editable fields, expanded DetailVM same fields plus inherited identity. New fields (camelCase Angular / PascalCase backend): employerMolPersonalNumber:string?, employerBankRoutingCode:string?, accountLinkingType:Default0, monthDaysCalculationRule:ThirtyDays0|CalendarDays1, gratuityDaysFirstFiveYears:decimal, gratuityDaysAfterFiveYears:decimal, salaryItemsForLeaveSalaryCalculation:List<HrmSalaryItemType>, isPreviousMonthOvertimeForPayrollProcess, isPreviousMonthSalesCommissionForPayrollProcess, isBusinessUnitsWisePayrollProcess, isDepartmentwiseSalaryPaymentForPayroll, isStaffPayrollJournalWithoutContactName, isShowDeleteOptionForApprovedLeave, isShowNormalHolidayOvertimeHoursInProcessedPayroll, enableAttendanceDeductions, maxRegularizationsPerMonth:int?, lateArrivalGracePeriodMinutes:int?, payrollCutoffDay:int?, minimumOvertimeMinutesPerDay:int?, payStructure:List<{section:1..5,salaryItemType:1..18,formula:string?}>.

GET HrmSetting/options returns Result<{salaryItems:{id,key}[],sections:{id,key,salaryItemIds:number[],formulaDisabledItemIds:number[],supportsFormula:boolean}[],accountLinkingTypes:{id,key}[],monthDaysRules:{id,key}[],defaultPayStructure:row[]}>. Keys reference hrmSettings.* and existing hrmAccountLinking.salaryItems.* EN/AR. Section IDs GrossSalary1/Overtime2/OtherIncentive3/Deductions4/LongTermLiabilities5. Arrays are ordered.

Persist payStructure as nullable nvarchar(max) PayStructureJson on the one settings entity, typed through a feature-owned serializer/catalog and directional AutoMapper maps; do not expose storage JSON to clients. Existing IServiceHelper maps materialized entity, so no SQL projection of serializer. Primitive leave-salary enum list uses existing EF primitive-collection convention (WorkshopSetting.SelectedJobTypes/SettingsCommonModel). Single SaveChanges; no delete by omission of settings records. Array replacement is deliberate configuration value update after explicit row-removal UI, not tenant record reconciliation. Validate all values/catalog section membership/duplicates/disabled formulas before mapping or saving; preserve empty formula as null. Legacy POST routes through validated SaveMine as existing base does. GET default rows if PayStructureJson=null; explicit [] stays empty. Malformed stored JSON produces a controlled read failure, never silently discarded. No EF migrations/snapshot edits.

Schema changes require OWNER Add-Migration ExtendHrmSettingsWorkspace (new scalar/primitive JSON columns, nullable pay structure JSON and filtered unique live SubscriptionId settings index). Owner cleans legacy duplicates before applying index. No migration file/command run by agent.

PayrollRunService's direct settings read must switch to IHrmSettingService.GetMineAsync (latest live tenant row, no duplicate-dependent unsupported error); current unsupported flags, overtime month and financial formulas remain unchanged. Propagate failed settings read as calculation failure. No payroll journal, accrual, formula evaluation, attendance deduction, approved-leave deletion or authorization behavior added; these require owning workflow contracts beyond screen evidence.

## State, integration and reference conformance

- /HrmSetting canonical lazy route already exists; sidebar erroneous /Setting becomes /HrmSetting; /Setting compatibility redirect if unowned route; obsolete feature details/create redirect to root. Child canDeactivate. Exclude feature from duplicate shared toolbar title. AuthGuard/Authorize/root interceptor preserved.
- Initial load + options gate readiness and Save; global LoadingService paired finalize/end; Retry both reads. Failed Save retains values. Typed controls; numeric shared finite/Int32 validators; validators and FieldError each cell/field. Full snapshot comparison detects revert. Save freezes controls via freezeFormState.
- Shared EditableRows owns Add/Remove identity/focus/confirmation. Saved row classification is hydrated identity, not missing numeric ID. Pending removal/discard freezes form; blocks Save, tab switch, Add/move, navigation. Re-resolve row and busy gates after confirmation. Confirm accepted independent pending flag rule preserved.
- Save is ordinary PUT: interceptor owns one success; feature owns recovery/state. Reads/errors inline opt-in skip-error. No new HttpClient providers. Options use translated pipe, fixed dropdown column widths, appendTo body. One feature-owned content scrollbar, naturally growing sections/tables, no nested vertical frame bounds. Feature SCSS only viewport placement, no shared chrome copies.
- UserGuide HRM existing reader, new /HrmSetting topic and /UserGuide/hrm module entry, EN/AR actions/limitations/manual owner checks.

Conformance table: layout UI1→LinkAccounts details SCSS .card/scroll flex1/min0/overflow hidden/auto; tabs UI13→shared EditorTabs appearance workspace; collections UI14→shared table and EditableRows; fields UI19→shared FieldError; dropdown UI16→TranslateOptionsPipe/options endpoint; settings BE16→existing single-row base/helper/one save. Root owns final source comparison.

Phases0/1 discovery/freeze,3 settings write,4 explicit child removal,5 route/provider integration,6 final reconciliation apply;2 paged grid and reports/uploads/transitions do not apply. Backend/frontend coherent file ownership may be delegated after this freeze. No builds/tests/lint/db/browser/Graphify/Sigma MCP/commits/pushes/deployments.
