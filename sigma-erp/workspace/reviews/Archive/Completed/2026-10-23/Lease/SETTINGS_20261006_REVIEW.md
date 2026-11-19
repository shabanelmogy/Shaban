# Lease settings frontend conformance — 2026-10-06

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

Scope: LeaseClause, LeaseCostParameter, LeaseCostSetting and unsupported dormant LeaseCostSettingItem root. The root's LEASE_FRONTEND_CONTRACT_FREEZE.md governs this handoff. Frontend-only; no supplied new screenshots. Historical Clause/CostSetting screenshot decisions remain frozen. Recipe drift check was completed by root: use canonical books. Phases 2/3 and ordinary confirmed Delete/removal presentation apply; root owns integration and reconciliation. Backend source is read-only. No runtime/build/test/lint/browser/database/migration/commit/deployment commands authorized.

## Before-edit conformance evidence

| Concern | Owning block | Actual reference / shared producer | Target symbols and compared contract | Before edit / target |
|---|---|---|---|---|
| List container/scroll | UI1/3/6; Job/list HTML, TS | sigma-route-host, sigma-list-page/panel/header/table in styles.scss; DataTable.fill | LeaseClausesComponent, LeaseCostParametersComponent, LeaseCostSettingsComponent metadata + templates; route height100%, rows sole scroll owner, fixed title/footer | Feature copies and no fill; adopt exact shared shell/fill and remove copied list SCSS |
| Search strip/reset | UI4; Job/list filter form | FilterPanelComponent + FilterActionsDirective | Parameter.filterForm.search; stableLayout=true, mandatory Reset restores search='' and page1; shared34px controls | Local strip/no Reset; adopt panel, existing search key only |
| Paging/sort | UI5/6/28; Job.onLazyLoad/bindListQueries | resolveListPaging, DEFAULT_PAGE_SIZE=15; toListParams | Three onLazyLoad handlers; compare before updating signals; Clause sortable name only, choices10/15/20/50/100 | Hand calculations, Clause lazy load resets to page1; use shared helper and preserve page |
| Dialog content/state | UI13/15/19/22; VehicleService picker dialog and editor fields | EditorDialog.contentPadded; StateMessage; FieldError | Clause/details, Clause/clauses, Parameter/details, Setting/details; controlled visible, dirty-close, header title + separate identity subtitle | Local body padding/state/error/field styles; adopt shared content/fields/state/error |
| Child mechanics | UI14; VehicleService typed rows and EditableRows | EditableRows.replace/add/requestRemove, confirmationPending/canMutate | Clause clauses and Setting items; stable FormGroup identity, full snapshot, guards against Save/close/mutation while confirmation pending | Setting View loses all rows due add's mode gate; Clause removal captures stale index; reconcile using shared mechanics |
| Enum choices | UI16; VehicleService profile dropdown | enumOptions/enumKey + TranslateOptionsPipe | Setting.rateTypeOptions numeric0..4; Member-name keys preserve same labels | Hand five-entry list/templates; shared enum helper and translated pipe |
| Errors/loading | UI2/22/28; Job read flow | apiErrorMessage; X-Skip-Error-Interceptor; finalize | All owned live services/components; one inline error, one global standard mutation success | Clause duplicate toast+inline; private parsers/no skip header; adopt shared parser/skip and balanced finalize |
| Lookups/view | UI15/16/22; VehicleService mode-specific lookups | typed Results<DropDownSelect>, shared inline Retry | Setting getMakeAndModels/getCostParameters; View uses detail names, Create/Edit uses full selects; lookups local busy only | All modes load selects as blocking detail graph, swallowed errors; separate mode-specific retryable lookup reads |
| Dead root | Master5 dead roots, current parent freeze | Parent LeaseCostSetting aggregate only | Item route/component/model/service consumers; LayoutModule references assigned to root | No page/selector/config root consumer; unsupported standalone writer; retire after wiring reconciliation |

## Exact frozen contracts

| Feature | Grid order (Actions first) | Frontend row / backend ListVM | Filters and paging | Actions |
|---|---|---|---|---|
| Clause Type | Actions, name(text; sortable) | id/name ↔ Id/Name; optional clauses belongs to shared detail response | No filter UI; sort name asc default, Filters[sortField]/[sortOrder], pageNo/pageSize; backend name order + Id tie | Create/Edit, Clauses aggregate editor, Delete confirmation; no approval/accounting transitions |
| Cost Parameter | Actions, name(text), order(number) | id/name/order ↔ Id/Name/Order | search trimmed; empty omitted, Filters[search]; default page1/15; backend Order then Id | Create/Edit from current grid scalar snapshot; Delete reference-checked by backend |
| Cost Setting | Actions, makeAndModelName(text), markUpPercent(number) | id/makeAndModelName/markUpPercent ↔ Id/MakeAndModelName/MarkUpPercent | No evidenced filter/sort controls; pageNo/pageSize, default1/15; backend Id asc | Create/View/Edit/Delete; Add/Remove child/full aggregate Save |

Clause write: name(max250), optional clauses[{id?,clauseDetail(max2000),isDefault}]; update id. Omitted clauses preserves children; empty clauses clears templates. Nonempty set exactly one default; new first row defaults; removal of default promotes first. Server owns reusable-template reconciliation and agreement history.

Parameter write: name(max100 required), order(required nonnegative integer); update id. No tenant/audit fields. Backend duplicate-name and setting references own validation.

Setting write: makeAndModelId(required positive), markUpPercent(required0..100), vehicleCost(required >=0), items minimum1; each item costParameterId(required positive), fromYear/toYear(nonnegative integers; zero open endpoint), rateType(numeric0..4), rate(nonnegative). Update adds parent id and each saved child id/new0. Duplicate exact ranges and finite overlaps remain feature/backend rules. Detail includes saved display names only; no new calculations/postings/permissions. No backend/schema contract changes.

No new reusable capability is planned: reuse existing shell, filters, query/error/enum/focus/EditableRows owners. Feature-specific exactly-one-default and finite-range/overlap rules remain local. No export exists in these frozen screens, so export/print actions and speculative filters remain Not Applicable.

## Implementation and final source reconciliation

| Concern | Final target evidence | Result |
|---|---|---|
| Page/header/grid bounds | All three list metadata set `sigma-route-host`; templates use `sigma-list-page/panel/header/table` and DataTable `fill=true`. Their copied list SCSS and `styleUrl` entries are removed. No viewport subtraction or narrow-screen page-scroll override remains. | Matches UI1/3/6 shared owners; visual acceptance pending |
| Filter behavior | Parameter template selects FilterPanel `stableLayout=true`, `inlineActions=true`, `mainColumns=1`; `resetFilters` restores search empty and page1 through `requestList({})`. `lastFilters` supplies paging/refresh independently of unsubmitted edits. Clause/Setting retain their source-supported no-filter shapes. | Matches UI4/28; no invented filters |
| Paging/sorts | Each `onLazyLoad` uses `resolveListPaging` before writes, with default15 and10/15/20/50/100 choices. Clause derives its name sort allowlist from actual sortable columns and calls `requestList(true)` to retain changed page. All three delete-success paths step back when the page's last row is removed. | Matches UI5/6/7 |
| Requests/loading | All list streams use `switchMap` plus `defer`, and each request balances `startLoading/endLoading` in `finalize`. Detail/mutation subscriptions use `takeUntilDestroyed`. Clause templates additionally cancel their previous detail subscription and reject late closed/different-ID responses. | Matches UI22/28 source contracts |
| Dialog/feedback ownership | All four dialog templates use EditorDialog `contentPadded=true` with shared editor form/body/scroll, StateMessage and FieldError. Identity names occupy subtitle. Clause detail/template loading exposes explicit Retry; missing detail entity is a load failure, never an empty authoritative template snapshot. | Matches UI13/19/22 |
| Typed menus and DTOs | Lists declare `ActionList<ClauseTypeDTO/LeaseCostParameterDTO/LeaseCostSettingDTO>`. Clause list DTO is separated from `ClauseTypeDetailsDTO.clauses`. No tenant/audit/derived values are introduced into any write payload. | Matches UI2/5/7 |
| Child mutation/default | Clause and Setting reuse typed EditableRows; removal re-resolves row identity, pending confirmation blocks Save/Add/Close. Clause factory preserves initial default, and `onRemoved` promotes first remaining row when none is default. Clause default-selection business logic remains local. | Matches UI14; aggregate contracts unchanged |
| Setting View detail | `patchDetails` calls `rows.replace` directly for all modes, then `applyFormMode` disables View. It no longer calls the editable-only Add method while hydrating View, so saved children are retained. View reads detail names and skips edit-only lookups. | Confirmed empty-View-child defect fixed; UI15 |
| Setting lookup recovery | `loadLookups` is edit/create-only with local `lookupsLoading`; each of the two failure channels keeps inline `lookupError` and Retry. `canMutate` and `applyFormMode` lock on loading, lookup/detail failure, save, close/removal confirmation. Switching View to Edit loads options. | Matches UI15/16/22 |
| Setting enum/numeric cells | `enumOptions/enumKey` preserve actual ChargeRateTypeEnum0..4 values; TranslateOptionsPipe handles current-language labels. Dropdown columns declare width210px/170px. View child numeric cells select shared value/highlight classes, keeping values and range formulas unchanged. Exact-case enum translation aliases are root-owned. | Matches UI14/16/23/27 |
| Inline error boundaries | Three feature services send X-Skip-Error-Interceptor for existing inline-feedback requests; components use apiErrorMessage and inspect isSuccess. Former Clause duplicate feature toast/parser are removed. Success remains global interceptor-owned. | One failure/success presentation owner; UI2/22 |
| Unsupported Item root | Earlier worker/root retirement follows the parent aggregate freeze and scoped consumer search; no live standalone writer was introduced. Root owns LayoutModule provider/import removal and final wiring reconciliation. | Master5 retirement boundary preserved |

## Changed files

Within `src/app/modules/Lease/LeaseClause`: `components/list/list.component.{ts,html}`, `components/details/details.component.{ts,html}`, `components/clauses/clauses.component.{ts,html}`, `models/clause-type.ts`, `services/leaseclause.service.ts`; the three component SCSS copies were deleted.

Within `LeaseCostParameter`: `components/list/list.component.{ts,html}`, `components/details/details.component.{ts,html}`, `services/leasecostparameter.service.ts`; the two component SCSS copies were deleted.

Within `LeaseCostSetting`: `components/list/list.component.{ts,html}`, `components/details/details.component.{ts,html}`, `services/leasecostsetting.service.ts`; the two component SCSS copies were deleted.

Existing routes, endpoints, backend models/services/mappings and aggregate reconciliation remain unchanged. All applicable phases2/3 and ordinary confirmed Delete/removal presentation are implemented for this bounded handoff. Root owns phases5/6. No domain transition beyond the existing Create/Update/Delete is applicable, and export/print/screenshots/new financial calculations are Not Applicable. No schema/AutoMapper/entity change requires Add-Migration.

## Source-only verification and pending owner acceptance

- Reviewed the complete scoped frontend diff and directly related current services/models/templates against the frozen payloads and backend ListVMs. Grid columns and corresponding properties are shown beside each other in the exact-contract table above.
- TypeScript AST parsing:20 runtime files; Angular `parseTemplate`:7 templates; no syntax diagnostics. This establishes source syntax only, not type checking, application compilation or rendering.
- Static translation-key reconciliation found every literal Clause/Parameter/Setting/general/validation key in both EN/AR dictionaries; dynamic rate-type member aliases are integrated by root.
- Scoped `git diff --check` passed. Git reported only existing LF/CRLF conversion warnings.
- Scoped source scan found no legacy ms-lib/p-table/native-date usage, private error parser/validation-key helper, stale styleUrl, untyped ActionList or silent HTTP-error callback in these three live features.
- Builds, tests, lint, browser/runtime/database verification, migrations, commits/pushes and deployment were not run. The source-only status remains owner-verification-pending=yes.

Owner acceptance: check narrow/desktop and Arabic RTL/dark dialogs with internal scroll and fixed footer; page-size-only changes, Clause sorting/page2, Parameter applied search versus unsubmitted text, delete last row; Clause failed-load Retry and exactly-one-default after add/removal; Setting View children/names with no lookup request, View-to-Edit options, lookup failure/retry, minimum-one-item/range validation, and blocked double Save/remove/close while confirmations or writes are pending. Verify the standard global success and single inline failure surfaces.

Suggested frontend commit: `refactor(lease): align settings editors and grids with shared UI contracts` (suggestion only; root may use one whole-Lease commit). No backend commit or migration is required for this handoff.

Delegation: isolated settings workstream used inherited model settings_worker/settings_finish; root owns common vocabulary, shared APIs and provider wiring. Bounded ownership allowed settings changes to proceed alongside agreement/document work without file overlap. No new reusable rule was established in this handoff, so no owning-book/skill promotion was required here.
