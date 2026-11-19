# Asset Type frontend review — 2026-10-06

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

## Outcome and scope

Implemented the confirmed frontend documentation fixes for `SiGmaAngularFrontEnd/src/app/modules/Assets/assetType`, preserving the existing seven columns, CRUD actions, one list route and modal Create/View/Edit contract. The frozen handoff and screenshot evidence are in `ASSET_TYPE_FRONTEND_CONTRACT_FREEZE.md`; the September 2 `ASSET_TYPE_FEATURE_REVIEW.md` remains historical.

This is a frontend deliverable. Directly related backend source was inspected for request/response compatibility; backend modernization was not implemented. No entity, EF configuration, AutoMapper or calculation changes. No new migration required by this diff.

## Applied phases

| Phase | Result |
|---|---|
| 0 | Manifest, source discovery, screenshot E1 classification, references and recipe drift recorded |
| 1 | Existing server contracts verified; frontend handoff frozen before delegation |
| 2 | Shared list shell, fill table, paging/query/error/enum helpers and explicit read Retry |
| 3 | Shared editor form/section/field/state owners; load/lookup/save/discard guards and Retry |
| 4 | Existing delete confirmation enhanced with warning and pending guard; current-page/last-page recovery retained |
| 5 | Imports, route/provider/interceptor path, translations and close/refresh events source-reviewed |
| 6 | Complete scoped diff, conformance, contracts, translations, whitespace and stale-code checks reviewed |
| PLAN 00 | Not applicable: no business capability, schema, shared-owner or accounting change |
| Other actions/export/uploads/tabs | Not applicable: no matching feature contract or collection |

Recipe `-Check`: Phase 01 current; PLAN 00 and Phases 00, 02–06 stale. Canonical books governed those phases. Owner should regenerate and semantically review the packets; generated files were not edited.

## Findings implemented

1. Local page/panel/editor palettes, manual field validation/state markup and viewport-height scroll rules were replaced with the approved shared owners. Both obsolete feature SCSS files were removed.
2. Grid rows now own scrolling via `sigma-route-host` → list page/panel → table wrapper → DataTable `fill=true`; title and paginator use the shared fixed layout. The existing public minimum table width remains 1120px, without internal-table overrides.
3. Paging uses `resolveListPaging`; query serialization uses `toListParams`; initial size is shared DEFAULT_PAGE_SIZE=15 and omitted options consume shared 10/15/20/50/100. Sort fields derive from the seven backend-confirmed sortable columns.
4. Row actions use `ActionList<AssetTypeDTO>` and pending confirmation prevents duplicate prompts/actions. Deletion failures retain the row and use the global interceptor; successful deletion keeps the existing page recovery.
5. Inline list/detail/account read errors use skip-error headers and `apiErrorMessage`, with explicit Retry. Standard Save/Delete keep one global success/error owner; duplicate feature messages/private parsers were removed.
6. Details and account choices load independently. Only detail loads use the global loading channel; account choices use local loading. Failed account lookup disables account editing and blocks Save while retaining all draft values. Retry replaces options only.
7. Save/Edit guards cover detail/lookup loading or failure, saving and pending discard. Saving disables the whole form and restores mode after failure; both failure channels keep the draft dirty and open. Cancel/X/Escape share the original controlled discard flow.
8. Name is trimmed before local validation, aligning the 2–50 character check with the backend. Shared FieldError covers all four validated fields, including required/min/max/integer messages; numeric bounds/payload types remain unchanged. NumericFocusDirective supplies shared appearance and focusField owns invalid/initial field navigation.
9. Shared enumOptions/enumKey/TranslateOptionsPipe replace hand lists and enum coercion. Enum wire IDs and labels remain; both dictionaries follow actual member casing. Null/unknown list values retain an em dash instead of coercing null to the first enum.

## Decisions and final contracts

| Concern | Decision and evidence |
|---|---|
| UI/reference | Screen01 fields-only modal; Job list/reference and VehicleService editor/shared components, under UI1/3/6/13 |
| Routes | Keep `assetType` lazy route and one empty-path list route; list supplies explicit Create/View/Edit inputs |
| Fields | Keep nine editable fields from current typed models/form and prior contract; screenshot is minimum list evidence, not grounds to remove editor fields |
| Accounts | Optional IDs remain optional; failed lookup blocks Save because unavailable choices must not silently clear defaults |
| Validation | Trimmed name2–50; rate optional0–100; residual/life required nonnegative int32; backend remains authoritative |
| Layout | Shared shell/section/field/control owners supply theme, RTL, geometry and responsive breakpoints; no feature palettes |
| Confirmation | Only Delete and dirty discard; routine Save requires none |
| Errors | Inline reads suppress interceptor; standard writes use global interceptor; both channels restore state |
| Provider | AssetTypeService in LayoutModule, inherited BaseService HttpClient; root AppModule registers tokenInterceptor/errorInterceptor once; URLs use environment.baseUrl |
| View lookups | Current Detail DTO contains account IDs only. View retains disabled dropdown controls and their account lookup; no invented historical names. Skipping that lookup would lose visible account labels |
| Screenshot None | Existing enums contain no None; prior conflict remains recorded. No new depreciation policy or data conversion |
| AutoMapper/calculations | Existing backend list code/name projection retained; no mapping or calculation changes |
| Migration | No schema change, no Add-Migration required for this task |

Grid/property comparison (Actions first):

| Column/action | Frontend | Backend AssetTypeListVM | Result |
|---|---|---|---|
| Identity | id | Id | Matches action target |
| Asset Type | name | Name | Matches |
| Method | depreciationMethod | DepreciationMethod | Matches; translated enum |
| Asset Account | assetAccountName | AssetAccountName | Matches code/name projection |
| Accumulated account | accumulatedDepreciationAccountName | AccumulatedDepreciationAccountName | Matches |
| Expense account | depreciationExpenseAccountName | DepreciationExpenseAccountName | Matches |
| Category | category | Category | Matches; translated enum |
| Residual | residualValue | ResidualValue | Matches; type:number |

Angular list model carries only these fields. Backend base-derived surplus fields are a known separate backend item below; this table proves consumed-field compatibility, not minimality of the entire serialized backend response.

Writes contain only name, category, three account IDs, depreciationMethod, annualDepreciationRate, residualValue and assetLifeYears; Update adds id. Detail patching consumes exactly those plus id. No tenant/audit/No/status/totals are sent. Existing backend validation trims/checks duplicates excluding self, validates enums/ranges and current-tenant account existence. Account IDs remain number/null.

## Actions and authorization candidates

| Action | Route | Interaction/failure/refresh |
|---|---|---|
| Create | POST AssetType | Typed modal; guards; global mutation feedback; close/refresh on success |
| View | GET AssetType/GetById/{id} | Disabled form; inline failure/Retry; Close |
| Edit | PUT AssetType | Same editor; loaded snapshot required; draft preserved on failure; close/refresh on success |
| Delete | DELETE AssetType?id={id} | Shared destructive confirmation/warning; duplicate guard; row preserved on failure; page recovery on success |
| Accounts | GET Account/GetSelect | Local loading, inline failure/Retry, values retained |

Job reference View/Edit/Delete are Supported in the target. Labour Time, Invoice Customer, Close and Print Gate Pass are Not Applicable: AssetType has no workshop job, labour, invoice, completion or gate-pass aggregate/workflow. Create uses the reference title slot. No unsupported reference action was copied.

Candidates for future authorization: POST/PUT AssetType (account and depreciation defaults), DELETE AssetType. Authentication exists; no permission service/API exists and no control was hidden as a security measure.

Existing backend overrides inspected: GetManyAsync (current bespoke paged/navigation read), AddAsync/UpdateAsync (validation/persistence), RemoveAsync (five reference checks). Controller adds no override. No backend override was added or removed.

## Conformance reconciliation

| Concern | Actual target producer/consumer and compared contract | Result |
|---|---|---|
| List/title | AssetTypesComponent host sigma-route-host; HTML shared list-page/panel/header; Job uses the same chain; FeatureTitle/global styles own title margins and tokens | Source match |
| Table/pager | One DataTable with fill=true, totalRecords from backend CountAsync metadata, first=(pageNo−1)*pageSize; resolveListPaging BEFORE signal updates; shared default15/options10/15/20/50/100 | Source match |
| Sorting/cancel | Same seven sortable columns and backend ApplyOrdering keys; listRequests switchMap+defer and finalize balance each load | Source match |
| Editor scroll | EditorDialog contentPadded=true; form/body/scroll use flex-fill auto-basis, retaining intrinsic auto-height; sigma-editor-scroll is sole content scroll owner; FormSection/fields use shared geometry | Source match; visual pending |
| Fields/errors | Actual name/rate/residual/life controls → FieldError with matching validators/keys; all labels refer to real inputId/id; no local state/error markup remains | Source match |
| Enums/lookups | enumOptions/enumKey numeric IDs + exact EN/AR member keys; translated mutable options; Account/GetSelect retained; appendTo=body | Source match |
| Loading/recovery | loadDetails global loading; loadAccounts local; primaryActionDisabled + applyMode guard/restore; lookup retries do not patch the draft | Source match |
| Notifications | getList/getDetails-inline/getSelect-inline suppress only errors; create/update/delete have no skip/error copy; standard interceptor owns mutation feedback | Source match |
| Theme/RTL/responsive | No feature styles or cross-feature stylesheet import; public1120px table token plus shared field/panel/dropdown owners | Source match; runtime pending |

Shared-extraction gate: reused existing shared owners/helpers listed above; no new shared capability or reusable rule was necessary. Removed private copies at their consumers. No book/skill rule was introduced; no learning-protocol promotion is pending.

## Verification and remaining limits

- Complete scoped frontend diff reviewed, including deleted SCSS and matching translation changes. `git diff --check` passed.
- `Check-Translations.ps1 -Block assets.assetTypeManagement`: 40 keys per language, zero missing EN/AR keys and zero case-only differences.
- Source searches checked stale imports/types/styles, private error parsers, old enum keys, manual params, merge markers, disallowed JS APIs and server-owned payload fields.
- Effective compiler lib is es2018/dom; new code uses compatible APIs. Compiler/runtime execution was not performed.
- Backend scoped diff is empty; no backend files changed. Initially unrelated Loan EMI changes and concurrently appearing asset/toolbar work were preserved. No adjacent feature files were edited by this task.

Known out-of-scope backend debt observed while tracing compatibility: AssetType List/Detail inherit surplus plumbing/audit members (BE backlog6); AssetTypeService uses literal English Fail messages and catches all DbUpdateException as duplicates; normal-entity GetManyAsync remains bespoke rather than current materialization/order hooks. These are not claimed fixed by this frontend review. Existing account-code sorting and five dependency checks were preserved; database/concurrent-delete behavior remains unverified.

Documentation drift: stale generated packets; UI2 retains a manual-HttpParams example beside its shared serializer rule; UI6 retains older presentation/SCSS guidance and a nonfunctional empty-height token beside current shared-owner rules. Skill §10 still states universal GetByWithNavigationsId and outdated backend paging defaults; actual feature contract uses GetById. Canonical current rules, actual references and frozen API govern. No derivative packet was edited.

Owner acceptance:
1. Build frontend, then exercise Create/View/Edit; check all nine fields and three account labels in English/Arabic.
2. Test blank/one-character trimmed names, rate bounds and nonnegative integer residual/life; invalid submit focuses its field.
3. Delay/fail detail/account requests; Save stays blocked, Retry recovers, entered values survive account retries. Fail Save through business and HTTP channels; draft remains editable with exactly one notification.
4. Dirty Cancel/X/Escape prompt once; clean/View close silently; focus trap and return work.
5. Page/sort/change size rapidly; latest request wins. Delete last row on a later page; confirmation names the record and page recovers. Used-type deletion remains blocked by backend.
6. Check desktop/narrow, light/dark and LTR/RTL: page has no scrollbar, grid/form body scroll internally, header/pager/footer remain reachable, dropdown overlays remain visible.
7. Confirm one protected GET and mutation include authentication without recording token values; standard mutations show one success/error surface.

No builds, tests, lint, browser automation, runtime checks, database commands, migrations, commits, pushes or deployment ran. Recipe/translation scripts are read-only documentation/source checks.

## Files and agent utilization

Frontend changed: list.component.ts/html; details.component.ts/html; services/assettype.service.ts; vocabs/en.ts/ar.ts. Removed: list.component.scss and details.component.scss. Models/routes unchanged.

Artifacts: this review and `ASSET_TYPE_FRONTEND_CONTRACT_FREEZE.md`. Historical review untouched.

Concurrent-work note from the final diff: EN/AR dictionaries also contain new sibling `assets.*` entries from the separate Asset screen work. Those additions were preserved and are not part of this task. This task owns only changes within `assets.assetTypeManagement`; stage that block selectively rather than the entire dictionary diff.

One routine worker (`list_worker`, inherited root model because mapped terra model is unavailable) owned list/service only after freeze; root owned editor/translations/contracts/integration and final diff. Independent read-only follow-up audit found no concrete integrated defects. This split reduced wall time on independent list/editor work without overlapping edits; no second context scan or backend worker was needed.

Suggested frontend commit (only this task's files):

`fix(asset-type): align shared UI and guard editor save readiness`

Documentation artifacts are local/unversioned under the current instruction-layer ownership boundary. Suggested future documentation-owner commit: `docs(asset-type): record frontend contract and source review`.
