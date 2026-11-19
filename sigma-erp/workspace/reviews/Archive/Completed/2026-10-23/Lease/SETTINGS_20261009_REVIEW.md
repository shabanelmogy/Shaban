# Lease settings, clauses, tariff and SMS follow-up — 2026-10-09

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

Scope follows LEASE_FRONTEND_FOLLOWUP_CONTRACT_FREEZE.md; application source was unchanged in the five owned feature folders at resumed discovery. Other working-tree changes belong to the owner/peers and remain untouched. No backend/schema/permission/workflow change. No build, test, lint, browser or database execution.

## Before-edit conformance

| Concern | Book block | Actual reference/symbol | Shared owner | Target decision |
|---|---|---|---|---|
| Modal small records/one child list | UI13, UI1 | EditorDialog declarations; Job list HTML | EditorDialog, shared editor/list classes | Clause/CostParameter/CostSetting retain controlled modal shape |
| Routed four-collection tariff | UI13 D4-2, UI1 | Job editor requestClose/canDeactivate and route guard | Shared routed editor shell | Add one deferred guard for all exits; preserve list return params |
| Pending discard/edit snapshot | UI10, UI28 | Movements pending-decision rule; current Job guard demonstrates ownership | freezeFormState | Freeze controls, restore only current visible identity; Save snapshot frozen |
| Saved month picker hydration | UI17 | shared date-utils parseMonthValue/toPickerDate | date-utils, DatePickerDirective | Validate saved month then hydrate local first calendar day; retain existing month payload |
| Child removal snapshot | UI14, UI10 | current EditableRows requestRemove; Job EditableRows composition | EditableRows opt-in freezeParentOnConfirmation | Enable freeze for Clause, CostSetting and four Tariff collections |
| Int32 transport | UI19 | scalar-validators int32ValueValidator; C# CostParameterAddVM.Order / CostSettingItemAddVM years | scalar-validators | Preserve existing nonnegative rule and add Int32 transport limit |
| Feedback and cancellation | UI22, UI28 | Job list switchMap/defer; all five services inline headers | apiErrorMessage, LoadingService | Existing inline ownership and cancellation retained |

## Confirmed fixes to apply

- Clause and CostParameter discard flags/readOnly markup do not disable reactive controls; their Save snapshots also remain enabled. Clause child editor shares the gap.
- Tariff has no CanDeactivate routes, so external navigation bypasses dirty checks. Its pending discard leaves calendars/inputs enabled. Successful Save requires explicit guard bypass.
- Tariff eight saved month controls use unchecked native Date construction instead of validated shared hydration.
- Clause/CostSetting/Tariff row removal adopts root-owned shared opt-in freeze to prevent editing while deciding.
- CostParameter Order and CostSetting child years lack the confirmed C# Int32 upper transport boundary.
- Clause child GUID identities were treated as unsaved by EditableRows numeric identity fallback. Adopt the root-owned isSavedRow predicate to retain confirmation for pristine saved GUID rows.
- Tariff branch-settings manual Remove/Discard decisions now freeze reactive controls, capture settings request sequence and recheck visible/current identity. Reopening starts a fresh enabled settings draft; failed saves restore the same values.

## Final source reconciliation

| Concern | Result | Evidence |
|---|---|---|
| Controlled modal exits | Matched | Clause type/clauses, CostParameter, CostSetting capture identity, freeze shared control state and restore only same visible editor |
| Routed Tariff exits | Matched | create/edit/view routes use preventUnsavedExit; requestClose delegates to canDeactivate; deferred subscription rechecks busy state; saveCompleted bypasses discard |
| Month restoration/transport | Matched | Eight Tariff control seeds normalize through parseMonthValue and toPickerDate; all payload month strings still use parseMonthValue |
| Child removals | Matched | Six EditableRows configs enable freezeParentOnConfirmation; GUID Clause rows declare isSavedRow; shared helper owns same-row re-resolution |
| Save locks | Matched | Clause type/clauses, CostParameter, Tariff use freezeFormState; CostSetting retains existing applyFormMode save lock |
| C# Int32 transport | Matched | CostParameter Order and CostSetting FromYear/ToYear use int32ValueValidator alongside existing nonnegative/required validators |
| Feedback/cancellation | Matched | Services preserve X-Skip-Error-Interceptor; inline Result/HTTP failures and balanced finalize retained; existing switchMap list requests remain |
| Layout/template imports | Source matched | Existing shared Job-shaped list/routed shell, EditorDialog controlled composition, typed arrays and direct standalone imports retained; only Tariff panel layout SCSS remains |
| Runtime/visual checks | Pending | Explicit task prohibits builds/tests/lint/browser/database; source checks are not runtime acceptance |

Owned source diff reviewed; git diff --check passed (only existing Git CRLF normalization warnings). No backend/schema/locales/tsconfig/shared files changed by this worker. SMS remained unchanged after bounded source audit. Root shared owner and guide integration are separate deliverables.

## Frozen contracts retained

| Feature | Grid / filters | Detail and write inputs | Actions |
|---|---|---|---|
| Clause | name, paging/sort(name) | ClauseType name; child clauses id?/clauseDetail/isDefault, full snapshot | Create/Edit/Delete type; Manage Clauses; exactly one default when rows exist |
| CostParameter | name/order, search, paging | name/order; id for Update | Create/Edit/Delete |
| CostSetting | makeAndModelName/markUpPercent, paging | makeAndModelId/markUpPercent/vehicleCost; child costParameterId/fromYear/toYear/rateType/rate, id on Update | Create/Edit/View/Delete, parent-owned rows only |
| Tariff | VehicleType name/detail/notes, search, paging | isInactive/vehicleTypeId and rental/protection/mileage/extra snapshots; numeric rates and existing range/overlap checks; yyyy-MM boundaries | Configure/View tariff; existing branch settings branchId/adjustment only |
| SMS | code/name/mobileNo/email/status, search/paging/sort | simulation customerIds/message only | Page-only selection; simulate only; no delivery integration |

SMS simulation is an existing operational exception; typed payload, inline failures, paging, selection locks and message readOnly handling are present. Preserve simulation-only API and current behavior.

Root owns in-app guide, shared helper/book/skill changes, complete integration and final reconciliation. Compiler/runtime/visual/RTL/keyboard/route/navigation acceptance remains owner-pending.
