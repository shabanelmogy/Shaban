# Asset Type frontend contract freeze — 2026-10-06

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

## Manifest and authority

Request: review `src/app/modules/Assets/assetType` and implement confirmed documentation fixes. Tier M, frontend scope; directly related backend is inspected to confirm compatibility. The September 2 `ASSET_TYPE_FEATURE_REVIEW.md` remains a historical frozen record. This handoff supersedes only its presentation/paging conventions under the current books and preserves its business contract.

Authority: Sigma AGENTS; Master 0–7; UI screen 01 (list with modal editor), UI 1–10, 13, 15, 16, 19, 22–30; BE normal entity/read contract blocks. Recipe `-Check` on October 6: Phase 01 current; PLAN 00 and Phases 00, 02–06 stale. Use canonical blocks; do not edit generated packets. No PLAN 00 required: no new business capability, shared owner, schema or accounting change.

Approved references: `Workshop/Job/components/list` list shell/query flow; `Fleet/VehicleService/components/details` editor integration, with current shared EditorDialog/FormSection/FieldError/StateMessage owners. Backend normal entity (`BranchService`) is a reference for comparison, not permission to rewrite the backend in this frontend request.

Existing frontend user changes: `Loan/Loan EMI's/LoanEMI/components/list/list.component.{ts,html}`, preserved. Backend working tree initially clean.

## Screenshot evidence E1

File: `C:/Users/user/Desktop/Assets/1.PNG`, English LTR desktop list, 1251×691; capture date/version/role unknown. Functional evidence only.

| Evidence | Classification | Required behavior | Phase | Implementation |
|---|---|---|---|---|
| Seven visible data columns | Explicit | Preserve name, method, three accounts, category, residual value | 2 | Shared DataTable |
| Create, View, Edit, Delete | Explicit | Preserve current CRUD/dialog workflows | 3/4 | Shared editor/confirmation |
| Account codes with labels, category and method names | Explicit | Preserve backend code/name projection and translated enums | 1/2 | Existing DTO + shared enum helpers |
| Legacy None/empty method | Conflicting | Existing enums have no None | 1 | Retain prior unknown-value em dash; no new enum/accounting behavior |
| Styling and visible row count | Not implementation authority | Current shared layout/pager owns presentation | 2 | No screenshot CSS copy |

## Grid, filters and paging

Actions first, then exactly:

| UI column | Frontend property | Backend ListVM | Type/transformation | Filter / sort / export |
|---|---|---|---|---|
| Asset Type | name | Name | text | none / yes / none |
| Depreciation Method | depreciationMethod | DepreciationMethod | translated enum; unknown em dash | none / yes / none |
| Asset Account | assetAccountName | AssetAccountName | backend code + name | none / yes / none |
| Accumulated Depreciation Account | accumulatedDepreciationAccountName | AccumulatedDepreciationAccountName | backend code + name | none / yes / none |
| Depreciation Expense Account | depreciationExpenseAccountName | DepreciationExpenseAccountName | backend code + name | none / yes / none |
| Category | category | Category | translated enum; unknown em dash | none / yes / none |
| Residual Value | residualValue | ResidualValue | integer number | none / yes / none |
| Identity | id | Id | action target, not column | none / none / none |

No added filters/export (historical frozen exclusion). Query carries PageNo/PageSize and Filters[sortField]/Filters[sortOrder], with the existing allowlist and backend CountAsync, page clamp, tie-breaker and projection. Use shared toListParams and resolveListPaging. Initial rows DEFAULT_PAGE_SIZE=15 (owner October 3 decision supersedes historical 5); public options 15/25/50/100. Keep server-returned page metadata, switchMap cancellation, refresh current page and last-page recovery.

## Detail and write contract

One list route and list-owned Create/View/Edit dialog, no tabs/children/totals. Keep all existing fields even though E1 shows no editor. Detail/Add contain `name`, `category`, three nullable account IDs, `depreciationMethod`, nullable `annualDepreciationRate`, `residualValue`, `assetLifeYears`; Detail/Update add `id`. No server-owned inputs or calculations.

Name: trimmed required 2–50 characters; categories Other/Vehicle/Fittings; methods StraightLine/DecliningBalance/UnitsOfProduction. Account IDs optional positive IDs, backend tenant/existence validation. Rate optional 0–100; residual/life required nonnegative int32 values. Shared FieldError owns every validated field. Trim before validation so 1 character surrounded by spaces cannot pass local length validation.

Lookup failure must block Create/Edit Save, show a single inline error and allow explicit Retry without replacing form values. Detail load and lookup load have separate state; auxiliary account select does not drive the global loader. View still renders disabled account controls, since current Detail DTO has IDs only; no invented saved labels. Loaded detail need not wait for account retry. Guard Save/Edit against loading, load errors, lookup errors, pending discard and duplicate requests. Disable editable form while saving, restore the proper mode after failures.

## Actions and integration

View/GetById; Edit/PUT; Create/POST; Delete/DELETE AssetType?id=... through existing generic controller. Delete requires shared destructive confirmation; backend retains its five existing reference checks, including deleted references. No lifecycle flags/activation invented. Dirty Cancel/X/Escape use the same controlled discard flow. Global interceptor owns standard mutation success and failure; the feature restores state without duplicate messages. List/detail/lookup inline failures suppress the interceptor on those exact requests and use apiErrorMessage.

`assetType` lazy route → existing list route; inherited BaseService HTTP client and LayoutModule service registration preserved. No new HttpClient/interceptor/token code. Authorization candidates: POST/PUT account/default configuration, DELETE AssetType; authentication exists, permission API does not.

## Pre-edit conformance and implementation ownership

| Concern | Book | Actual reference / shared owner | Target before → required |
|---|---|---|---|
| Route fill/title | UI1/3 | Job list sigma-route-host/list-page/panel/header; global styles | Local page/panel palette → shared chain/title inside header |
| Grid | UI6 | Job DataTable fill=true/table wrapper; resolveListPaging | Own margins/no fill/pager math → shared scroll/paging |
| Actions | UI7/9 | ActionList<TRow>, ConfirmationDialogService | Untyped actions → typed; pending confirmation guards |
| Read/error | UI2/22/28 | Job inline skip header/apiErrorMessage/switchMap | Private parser/duplicate errors → existing helpers and one owner |
| Editor form | UI13/16/19 | VehicleService sigma editor chain/fields; EditorDialog/FormSection/FieldError | Local grid/palette/errors → shared content padding, section, fields, states |
| Enum presentation | UI16 | enumOptions/enumKey/TranslateOptionsPipe | Hand lists/coercion → shared helpers preserving IDs and key labels |
| Loading/save | UI22/28 | Shared editor disabled/visible inputs and mode restore | Lookup failure permits Save; loading/pending Save gaps → guarded state/retry |
| Focus | UI27 | focusField and EditorDialog return-focus | DOM .focus queries → existing focus helper and form IDs |

Root owns contracts, editor files, translations, integration/reconciliation. After freeze a bounded independent worker may own only list files and assettype.service.ts; no shared file overlap. No backend/source schema changes authorized by this frontend handoff. Source-only verification; builds/tests/lint/browser/database/migrations/commits/push/deploy prohibited.

## Reconciliation amendments — 2026-10-06

- Direct UI6/reference comparison identifies shared standard page options 10/15/20/50/100 (DataTable default), with DEFAULT_PAGE_SIZE=15. These supersede the initial low-risk proposed 15/25/50/100 options above. The list omits a duplicate options array/input and consumes the shared owner. No API change.
- Failed list/detail/lookup reads expose explicit Retry in their existing error region. Retry preserves query or form values and respects current busy/discard gates; this completes the frozen read/write recovery requirement.
- Enum key names follow actual enum members via enumOptions/enumKey; EN/AR casing changes together. A direct-consumer search found only this feature using the old keys.
