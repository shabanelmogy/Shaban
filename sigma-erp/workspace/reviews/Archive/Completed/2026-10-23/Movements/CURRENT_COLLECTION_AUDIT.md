# Current Collection Movement frontend audit — 2026-10-09

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope | `SiGmaAngularFrontEnd/src/app/modules/Movements/collectionMovement` only |
| Contract | `MOVEMENTS_CURRENT_FRONTEND_CONTRACT_FREEZE.md`; historical `MOVEMENTS_FRONTEND_CONTRACT_FREEZE.md` retained |

The selected screen is UI01, a paged list with a controlled modal. Backend is the existing BE13 normal entity; the root's producer evidence is read-only. Root completed the recipe `-Check` before this workstream; phase-02-read-grid, phase-03-detail-write and phase-04-domain-actions are used for the existing read, Save and Delete paths. Root owns Phase 5, Phase 6, shared integration, EN/AR changes and the module user guide.

## Before-edit reference conformance

| Concern | Owning block | Actual reference file / symbol | Shared owner | Target before edit |
|---|---|---|---|---|
| Container, title and grid scroll | UI1/3/6 | `Workshop/job/components/list/list.component.html`: `sigma-list-page/panel/header/table`, `app-feature-title`, `app-data-table [fill]` | `styles.scss`, FeatureTitle, DataTable | `CollectionMovementsComponent` has route-host metadata; template uses the same chain, title in panel and fill grid. No stylesheet is registered. Matched source composition. |
| Filters and paging | UI4/6/17/28 | Job list filter form and `bindListQueries`; `resolveListPaging` | FilterPanel, date-utils, DatePickerDirective, list-query | Five fields, stableLayout=true, reserved date error, mandatory shared Reset; activeFilters snapshot, API counts/pages and switchMap/defer. No unsupported sort. Matched. |
| Calendar overlay | UI17 | `DatePickerDirective` constructor and click/keyboard opening | Shared directive | Both templates use appDatePicker; shared constructor supplies dd/mm/yy, button bar, showOnFocus=false, body append and panel class. No duplicated attributes needed. |
| Modal shell and View | UI13/15 | `EditorDialogComponent`: mode, contentPadded, focusOnShow, primaryActionVisible | EditorDialog, FormSection, shared editor flex classes | Padded controlled shell; content-sized flex-fill chain; View disables controls and renders scalar labels, no Save/Edit. Screen title and translated record subtitle separate. Matched. |
| Pending discard | UI10/28 | `freezeFormState` and deferred confirmation contract | form-state, ConfirmationDialogService | Deferred identity/busy recheck already freezes form and restores Cancel only for same visible editor. Matched. |
| Pending Save state | UI10/22/28 | `freezeFormState(form, destroyRef)` preserves disabled subtrees | form-state | Mismatch: onSave directly disables form then enables every control in finalize; it does not retain intentionally disabled state. Use existing snapshot owner at Save boundary. |
| Delete and feedback | UI7/9/22 | `ConfirmationDialogService.confirmDelete`; Job action lifecycle | ConfirmationDialog, interceptor, api-error | Record context, queryVersion/current-row recheck, busy guard, both inline failure channels and prior-page correction already present. Matched. |
| Complete Excel | UI8/22 | Job list export; `fetchAllPages` and `dataTableExportRows` | list-query, DataTable, Excel helper, composedReadErrorMessage | Complete applied snapshot with pageSize100; same grid columns and current translated headers; empty/failure visible. Matched. |
| Code layout | Master5 G10 | Job list methods and shared owner source | Existing TypeScript conventions | Mismatch: list/details/service include one-line methods, inline if blocks and multiple statements on a line. Expand these without changing contracts. |

## Confirmed changes to implement

- C-COL-01: reuse `freezeFormState` during Save, restoring only the same visible editable identity after a failed request. This retains values, dirty state and original disabled controls.
- C-COL-02: expand compressed TypeScript methods, blocks and request callbacks in the three current source owners. This is a readability correction under Master5 G10.

Current API, nullable string mileage, null Agreement Collection type, optional fields, default dates/fuel, Agreement scalar branch context, Create/View/Delete actions, applied filters and deferred dirty-exit decisions remain frozen. No material conflict found.

## Translation proposals

None required by the confirmed fixes. Existing keys and fuel/movement enum namespaces remain unchanged; root owns scoped translation reconciliation.

## Owner verification

Compilation, tests, runtime, browser, database, RTL/theme/responsive and interaction acceptance are pending; no such commands are authorized. Root must complete the module guide and full scoped reconciliation before overall handoff.

## Final root reconciliation

C-COL-01 and C-COL-02 are implemented. Save snapshots use the existing freezeFormState owner; final restoration is visibility/identity/mode gated. Root additionally gated lookup and Agreement Retry by full busy state. List/service changes are formatting only; normalized AST comparison confirms no column, action, filter, payload or API change. Source syntax/import/translation and scoped whitespace checks pass. Root completed all seven EN/AR guide topics and final scoped-diff review; see ../MOVEMENTS_CURRENT_FEATURE_REVIEW.md for acceptance and shared ownership. This is source completion only; owner runtime/visual verification remains pending.
