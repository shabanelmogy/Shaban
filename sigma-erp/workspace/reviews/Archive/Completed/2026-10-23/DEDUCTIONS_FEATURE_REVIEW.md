# Deductions review and implementation — 2026-10-10

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

## Manifest and scope
User request: «راجع : src\app\modules\HRM\Deductions وطبق التعديلات وفقا للوثائق». Frontend Deduction folder and directly related Deduction API/VM/service/mapping are in scope, plus EN/AR deduction keys and the existing HRM user guide. Existing unrelated working-tree edits (HRM, payroll, guides, translations and shell) are preserved. Deduction files were clean at discovery. No application execution, build, test, lint, migration, database, commit or push is authorized.

Type 01 list with modal editor: flat schedule inputs; TotalAmount is a user-entered schedule principal, not a computed aggregate total. Backend Pattern 1. No child collection, posting, approval or new payroll calculation. Phase 0–6 apply; phase 4 only existing delete/discard and the screenshot import, no invented state transition.

Recipe drift check: all PLAN-00 and PHASE-00 through PHASE-06 packets OK on 2026-10-10. Canonical directory F:/My Work/Shaban Documents/Shaban/sigma-erp. No derivative refresh required at discovery.

## Screenshot evidence
All images are English/LTR desktop; capture date, role and product version unknown.

| ID | Evidence | Classification | Implementation |
|---|---|---|---|
| S1 1.PNG | Date Range, Staff, Type, Status; Search/Excel/Create/Import | Explicit | Shared title/filter panel/fill grid; current-month default; full applied-result Excel |
| S1 | Start Date, Type, Staff, Amount, installment count, deducted count, Status | Explicit | Confirmed entity fields; server paging and typed scalar list |
| S2 2.PNG | Voucher No, Type, Staff, Total Amount, Start Date, Number of Deductions, Detail; Save/Cancel | Explicit | Controlled shared modal. No is existing generated EntityBase.No, displayed read-only after save; not a new voucher relationship |
| S2 | Voucher selector source, edit/delete locks, posting effect | Uncertain | No source for voucher FK or posting. No invented voucher/accounting relationship |
| S3 3.PNG | File, sample download, Import from Excel, Reset, Cancel; No/Status/Employee Code/Name/Date/Type/Amount/Remarks | Explicit | .xlsx sample and first-sheet preview/results through shared dialog and DataTable |
| Source | PaidInstallments and PassOverDeductionForThisMonth are currently editable | Confirmed | Keep inputs; no silent removal or change to payroll calculation |

## Frozen contracts and reviewer decisions
Reviewer decision (owner standing rule): resolve Voucher No to existing generated No; rejected adding a new voucher FK without evidence. Preserve old create/details deep links as redirects to list query-driven modal, not routed editor duplicates.

Grid columns, after shared Actions: no (text/link), startDate(date), type(translated), staffName(text), totalAmount(money), numberOfDeductions(number), paidInstallments(number), status(translated badge). ListVM properties beside these: Id, No, StartDate, Type, StaffName, TotalAmount, NumberOfDeductions, PaidInstallments, Status ONLY. Remove nested Staff, StaffId, Detail, PassOver flag and inherited audit/tenant/flags from the list. Detail: Id/No, StaffId/StaffName, Type, TotalAmount, StartDate, NumberOfDeductions, PaidInstallments, Detail, PassOverDeductionForThisMonth, Status.

Filters: dateFrom/dateTo inclusive calendar-day StartDate boundaries, staffId numeric optional, type enum optional (0 retained), status enum optional (0 retained). Clearing dates includes all dates; Reset restores current month. Generic scalar filters remain base-owned. Navigation-name sorting only if backend source confirms it; StaffName is initially non-sortable. Other stored columns use base sort with Id tie-breaker. GET Deduction uses base Results metadata PageNo/PageSize/TotalCount/TotalPages; frontend defaults DEFAULT_PAGE_SIZE=15, server clamp unchanged.

Write DTOs: StaffId, Type, TotalAmount (entered principal), StartDate, NumberOfDeductions, PaidInstallments, Detail, PassOverDeductionForThisMonth; Update additionally Id. No tenant/no/status/audit write fields. Required staff/type/start/amount/count; nonnegative amount, count >=1, paid 0..count. These are source-supported by PayrollRunService lines 527–540, not new formulas. Paid is editable existing data; do not recalculate status from it or modify payroll. FK tenant existence is validated server-side; no invented uniqueness key. Entity schema remains unchanged.

Import reviewer decision: use EmployeeCode as existing Staff.No; exact live tenant code must resolve uniquely. First-sheet .xlsx columns EmployeeCode, Date, Type, Amount, Remarks, NumberOfDeductions; first five correspond to screenshot input content, the sixth optional defaults to 1 because omitted screenshot installment detail has no contract. Type 0/LoanDeduction or 1/AdvanceDeduction; Date ISO or DMY; Amount numeric nonnegative. PaidInstallments=0 and PassOver=false for new import schedules. No guessing missing employee/date/type/amount. Import creates schedules only, no journal, payment or posting. Atomic batch, reject all on any invalid row; no updating existing records or inferred duplicate business key.

POST Deduction/Import: { rows: [{ rowNo, employeeCode, startDate, type, totalAmount, numberOfDeductions, detail }] }, max 1000. Result<DeductionImportResult>: entity { importedCount, rows: [{ rowNo, employeeCode, name, startDate, type, totalAmount, detail, isSuccess, message }] }. IsSuccess=false preserves row diagnostics and importedCount=0; success=true means entire batch saved once. Cancellation/logging/localized errors use current backend conventions. No automatic retry of a successful import; UI locks imported session until reset/new file.

Actions: Create/View/Edit/Delete supported by current source; Delete existing generic dependency-aware behavior plus shared confirmation. No new access restriction. Import follows frozen endpoint above. Export all pages of applied filters. Reference Job domain actions (close, invoice, logs, quality, lubrication) Not Applicable: Deduction has no corresponding aggregate/transition. Standard mutations retain interceptor success/error ownership; list/detail/lookup/import diagnostics use opt-in inline ownership. Authorization candidates: POST/PUT/DELETE Deduction and POST Deduction/Import; app currently AuthGuard only.

## Reference conformance before implementation
| Concern | Owner | Actual reference / shared owner | Target |
|---|---|---|---|
| List host/panel/title | UI1/3 | Workshop/Job/components/list + styles.scss sigma-list-* and FeatureTitle | Adopt no page scroll/container fill |
| Filters | UI4/17/19 | Job list stableLayout/date feedback; FilterPanel, DatePicker, FieldError | 4 fields; 34px; one two-month date range |
| Grid/paging/output | UI5/6/8/28; BE9/13 | Job list bindListQueries/onLazyLoad; DataTable, resolveListPaging, fetchAllPages, dataTableExportRows | Shared first Actions, scalar model, switchMap, all applied pages |
| Modal/modes | UI13/15 | actual EditorDialog declaration + UI13 controlled composition | Padded body, content-sized flex-fill chain, create/view/edit; no tabs for one section |
| Validation/lookups | UI16/17/19/22 | shared enumOptions/translateOptions, scalar/date validators, FormSection/StateMessage | Typed fields, read recovery, saved option fallback |
| Discard/delete | UI9/10 | ConfirmationDialogService + freezeFormState | Deferred guard, stable draft, common exit path |
| Backend | BE3/4/7/8/9/13 | actual Service base hooks, BranchService | lean VMs, forward maps, projection, base CRUD, import boundary |
| Guide | Master7/UI23/29 | UserGuide HRM_GUIDE and existing /UserGuide/hrm reader/menu | Add deduction topic from final source |

This is the frozen implementation handoff. Final source reconciliation, file inventory and owner steps will be appended after implementation.

## Additional frozen source decisions before final integration

- Storage bounds: SiGmaDbContext.ConfigureConventions uses FinancialNumberPolicy StoragePrecision=18 / LedgerAmountStorageDecimalPlaces=2. Bound entered principal to 0..9999999999999999.99 at the VM boundary and matching frontend preview; preserve the existing storage rounding, without new rounding/calculation or schema change.
- Legacy create/details URLs redirect through CanActivate UrlTree to /Deduction with modal query state. The owning list observes query changes and defers dirty replacement/close decisions, retaining one modal owner.
- Delete adopts metadata-driven RemoveWithChildrenAsync(id, default); the original generic RemoveAsync did not perform dependency checks. No state/accounting/access lock is introduced.
- DeductionFullListVM has no named consumer (whole-backend symbol search), so remove that dead DTO. The two stale generated smoke specs refer to the wrong class/screen and are removed, without writing replacement smoke tests.
- Workbook file selection uses the existing UI18 sigma-file-field presentation. FileFieldComponent's FileUploadService currently accepts only images/PDF and cannot select Excel; a workbook is local parsing with no server file upload/storage, so keep that domain parser here rather than widening Media validation.
- Focus source mismatch: UI27 requires focus inside the dialog; UI17 requires focusOnShow=false to keep calendars shut. EditorDialog currently has no addressable close-button target. Add a default-empty optional closeButtonId to the shared owner, use shared focusField for the two in-scope shown handlers, and leave existing consumers unchanged. This restores focus using the existing shared helper with openOverlay=false. Update UI13 and skill with this reusable public input in the same task; source-only runtime acceptance remains pending.

## Final reconciliation — 2026-10-10

Phases 0/1 discovery and freeze, 2 list/read, 3 details/write, 4 scoped delete/discard/import, 5 integration and 6 reconciliation implemented. Broad PLAN-00 and financial posting/state-transition phases are not applicable: no aggregate redesign, accounting posting, new status transition, permission restriction or persisted field. Screenshot details with no source were resolved above under the owner's standing rule; no required business decision remains blocked. Runtime/visual acceptance is separate and still pending.

### Final column and filter evidence

| Visible label / source | Final grid field | Backend ListVM | Type / transform | Filter / sort / Excel |
|---|---|---|---|---|
| Existing No; S2 Voucher No | no | No | text, opens View | no / yes / yes |
| S1 Start Date | startDate | StartDate | shared date | inclusive dateFrom/dateTo / yes / yes |
| S1 Type | type | Type | enum 0 loan, 1 advance, current-language text | type (including 0) / yes / yes |
| S1 Staff | staffName | StaffName | existing Staff.Name projection | staffId / no / yes |
| S1 Amount | totalAmount | TotalAmount | shared money | no / yes / yes |
| S1 Number Of Installments | numberOfDeductions | NumberOfDeductions | shared number | no / yes / yes |
| S1 Deducted Installments | paidInstallments | PaidInstallments | shared number | no / yes / yes |
| S1 Status | status | Status | shared translated status badge | status (including 0) / yes / yes |
| Shared Actions, identity | id | Id | View/Edit/Delete target | no / default Id order / not exported |

Every ListVM property is listed above. `DeductionService.ApplyListFilters` adds only StartDate boundaries; `Service.BuildFilterPredicate` owns nullable numeric StaffId and enum Type/Status, retaining zero. `Service.GetManyAsync` counts the filtered query then orders/pages it; `MaterializeListAsync` ProjectTo supplies StaffName without loading the complete Staff DTO. Query uses pageNo/pageSize and Filters[sortField]/Filters[sortOrder]. Pagination resolver runs before state writes; switchMap cancels earlier reads. Export gathers all pages with pageSize100 using the applied filter snapshot and current grid columns/translations; it fails on an incomplete page.

### Source conformance reconciled

| Target consumer/producer | Compared contract/value and outcome |
|---|---|
| DeductionsComponent / Job list / global shell | host sigma-route-host; primary sigma-list-page/panel/header; FeatureTitle in-card; Toolbar suppresses only Deduction's duplicate title. No feature page-height/SCSS or palette. Matched. |
| list HTML / FilterPanel / Job filters | mainColumns4, stableLayout=true, labelled sigma-filter-field controls, shared34px owner, reserveMessage=date, one two-month typeable date range, required Reset; default currentMonthRange. Matched. |
| list DataTable / shared DataTable | one fill grid, automatic Actions first, Id identity, 15-row initial paging, actual TotalCount/PageNo/PageSize and column-derived sort whitelist. StaffName deliberately non-sortable as frozen. Matched. |
| DeductionDetailsComponent / EditorDialog/UI13 | explicit mode create/view/edit, width760px for two-column flat inputs, maxHeight90dvh, contentPadded=true and flex-fill form/body/scroll. View disables form and skips Staff lookup; Edit merges saved staff label, requires loaded snapshot/lookup, failures retain draft. Matched. |
| modal dates/validation / DatePicker, scalar validators, FieldError | typeable masked dd/mm/yyyy; toPickerDate hydration, parseDateValue transport, no timezone shift; signed Int32 syntax plus contract minima; group paid<=count with own scalar feedback taking precedence; frozen Save and pending discard. Matched. |
| close consumers / EditorDialog.closeButtonId, focusField, UI10 | unique target IDs, shown focus to shared Close with openOverlay=false; accepted close checks independent busy gates because confirmation emits before finalize. No default consumer change. Matched from source; interaction pending. |
| DeductionImportComponent / UI13/18 + DataTable | padded bounded shared shell, one internal fill grid; local sigma-file-field because shared Media field rejects Excel; .xlsx first-sheet parsing, native Excel dates including1904 or strict ISO/DMY text, formatted codes retained, numeric Amount/Count use actual cell values. Workbook-only parser is a domain adapter, no uploaded-file lifecycle. Matched/justified as frozen. |
| Import frontend / controller/service | payload row keys and nullable types match named VMs; ToActionResult preserves HTTP400 diagnostics; frontend handles Result and HTTP bodies, max1000, no partial save, no repeat after success. A failed replacement file clears the old preview. Matched. |
| HRM_GUIDE / UserGuide reader/menu | existing HRM guide registration and /UserGuide/hrm menu retained; /Deduction topic covers list, fields, CRUD, validation, discard/retry, Excel sample/preview/atomic import and payroll limits in EN/AR. Matched. |

### Overrides, mapping, calculations and persistence

- Backend overrides: ApplyListFilters (two date boundaries); MaterializeListAsync (navigation-name projection); RemoveAsync (metadata-driven usage/404/soft-delete checks). Removed the controller's redundant list override, so GET uses the standard base. Add/Update/detail/order/paging/tenant/numbering remain inherited. Import is the named custom action, not a redundant CRUD override.
- AutoMapper now has four forward maps; only StaffName requires ForMember. No ReverseMap or speculative Ignore. No request carries subscription/no/status/audit/flags. TotalAmount is explicitly entered principal, retained in Add/Update; it is not a computed client total.
- PayrollRunService calculation is unchanged: scheduled monthly equal installments floor-round at the server's financial precision and the last takes the remainder. PaidInstallments and PassOver remain stored user inputs; editing paid count does not invent a Status transition. The pass-over flag's existing exclusion remains until cleared, with no automatic monthly reset.
- No duplicate business key is invented. Import requires each employee code to resolve exactly one live tenant Staff.No, uses the ordinary write-VM validation and InvalidInputAsync FK validation, prepares every row before attaching, then AddRangeAsync plus one SaveChangesAsync. EF's implicit transaction owns the batch. Numbering/tenant/audit remain shared owners.
- No entity/EF/schema/migration/model-snapshot change. **Add-Migration: not required.**

### Files changed in this task

Frontend repository `F:/My Work/Sigma/SiGmaAngularFrontEnd`:

- `src/app/modules/HRM/Deductions/Deduction/components/{list,details}` TS/HTML; the existing empty SCSS remains empty and unmodified. Removed both stale unrelated/broken smoke `.spec.ts` files.
- New `components/import/import.component.{ts,html}` and `models/import.ts`; modified `models/{list,create,details}.ts`, `services/deduction.service.ts`, `deduction.routes.ts`.
- `src/app/modules/shared/components/editor-dialog/editor-dialog.component.{ts,html}` optional close-button id only; `src/app/_metronic/layout/components/toolbar/toolbar.component.ts` Deduction suppression only.
- Deduction blocks in `src/app/modules/i18n/vocabs/{en,ar}.ts`; added the Deduction topic to the existing `src/app/modules/UserGuide/content/hrm-guide.ts`. Preserved all pre-existing unrelated translation/guide/shell work.

Backend repository `F:/My Work/Sigma/SigmaBackend`:

- `SiGma.Business/Services/DeductionService.cs`, `IServices/IDeductionService.cs`, `MapperConfig/DeductionProfiler.cs`, `SiGma.ServerAPI/Controller/DeductionController.cs`.
- `SiGma.ViewModels/ViewModels/Deduction/{DeductionAddVm,DeductionUpdateVm,DeductionDetailVm,DeductionListVm}.cs`; new `DeductionImport{Request,Row,RowResult,Result}.cs` and `DeductionValidationMessages.cs`; removed the unused `DeductionFullListVm.cs`.
- Dedicated Deduction resources in `SiGma.Helpers/Localization/Shared/GeneralMessage{,.ar-SA}.resx` (13 corresponding keys); request-culture resource access is shared between Add/Update, with invariant decimal Range limits matching decimal(18,2).

Documentation repository `F:/My Work/Shaban Documents/Shaban`: UI10/UI13 owning blocks, UI preamble/current version1.96 and CHANGELOG; regenerated PLAN-00 and PHASE-00..06 packets. Workspace skill `.agents/skills/sigma-screen-refactor/SKILL.md` updated with matching rules/history. Review records plus the read-only syntax script are under `F:/My Work/Sigma/reviews`.

### Verification and remaining owner acceptance

- Scoped Git diffs reviewed separately for frontend/backend, including new untracked import/VM/guide source. Scoped git diff --check has no whitespace errors. Source symbols/routes/providers/imports and public shared input bindings reviewed; no ms-lib, legacy enum pipe, any feature payload, old deductionTypeId, client tenant/no/status, native date input, UTC serialization or merge marker remains in the feature.
- `DEDUCTIONS_SOURCE_PARSE.cjs`: 14 TypeScript sources and 4 Angular templates parsed, 0 syntax/import-path findings. This is **not** a build, semantic type-check, Angular compilation, test or runtime verification.
- Translation check: Deduction61 EN/AR keys, 0 missing/case-only differences. Resource XML is well-formed with matching dedicated keys.
- Recipes regenerated through the generator only and final -Check reports all eight packets OK. Semantic review: type01 still references Job for list and shared EditorDialog/UI13 for modal, backend Pattern1 remains Branch/base hooks; new close id/order guidance does not change template defaults or reference roles. No manifest/template change required.
- Book-reference companion reports five existing path-like tokens: SettingsCommonModel/GetMySetting, BranchTariffSettingsComponent appended to its folder, ClauseType/GetSelect, StockReportPage appended to its folder, @angular/core/index.d.ts. These represent endpoint/type/library shorthand, not missing in-scope source. Branch/Stock owner files exist under their quoted folders; the new optional input and owning paths have no missing-reference finding. No unrelated documentation rewrite was made to silence this inventory.
- Owner must compile Angular and .NET and verify Create/View/Edit/Delete, successful and cancelled dirty X/Cancel/Escape/navigation, legacy URL redirects and query-driven modal replacement, staff/detail read Retry and preserved failed Save.
- Check zero-valued Type/Status filters, clearing dates, current-month Reset, multi-page paging/sorting and Excel beyond100 matching rows; test last-row deletion and delayed/stale requests.
- Import: sample headers, string codes with leading zeros, actual Excel dates/1904 epoch and ISO/DMY text, zero/nonnegative amounts, optional count1, invalid employee/date/type/count, one invalid row among valid rows, HTTP400 row diagnostics, no partial write, and no repeated submit after success. Test network timeout by checking the list before retrying; server-side idempotency across a reset/reselected file is not added.
- Check EN/AR, light/dark, desktop/narrow, keyboard focus/trap/return and one internal scrollbar per region. Check auth headers without exposing tokens, and exactly one interceptor-owned mutation success/error surface. Shared .xlsx/JavaScript numeric precision near the decimal storage maximum and new component compilation-root diagnostics remain owner compile/runtime risks; no broad tsconfig inclusion or preemptive runtime root was added.
- No build, test, lint, application/browser verification, database command, migration, commit, push, deployment, Graphify or Sigma MCP was run. Source-only diagnostics/documentation companion checks only.

### Handoff

Suggested commits (suggestions only):

- Frontend: `refactor(hrm): modernize deductions dialogs, filters and Excel import`
- Backend: `fix(hrm): align deduction contracts and validate atomic imports`
- Documentation: `docs(sigma): document modal close focus and accepted discard ordering`

Controlled delegation was attempted after freeze: `deduction_backend` and `deduction_import`, both gpt-5.6-sol, with disjoint backend/import ownership to reduce wall time. Both failed to start because of account usage limits and produced no changes. The root agent completed both workstreams, integration and final reconciliation; no partial agent output was adopted.

Shared extraction result: reused DataTable/FeatureTitle/FilterPanel/EditorDialog/FormSection/FieldError/StateMessage, date/enum/scalar/list/paging/export/form-state/focus helpers. The only new general capability is optional closeButtonId, documented in UI13 and the skill; the accepted-discard ordering lesson is in UI10 and the skill. Deduction-specific workbook and validation contracts stay feature-owned. In-app user guide is complete from source; owner visual/runtime acceptance remains yes.
