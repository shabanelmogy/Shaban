# Branches final reconciliation

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Contract | `BRANCHES_SCREEN_CONTRACT_FREEZE.md` |
| Date | 2026-10-14 |

## Scope and phases

Phase 0 discovery, Phase 1 contract freeze, Phase 2 read/grid, Phase 3 detail/write, Phase 4 delete action, Phase 5 integration/runtime source review, and Phase 6 reconciliation were applied. No screenshot was supplied, so there is no screenshot evidence table. The generator drift check passed for plan-00 and phase-00 through phase-06 before use and again at handoff. No build, test, lint, browser, database, migration, commit, push, or deployment command was run.

## Final contract comparison

| Path | Producer | Consumer | Source evidence | Status |
|---|---|---|---|---|
| Grid columns | `BranchListVM`, `BranchDTO`, `BranchesComponent.columns` | `app-data-table` | Id, Name, BranchCode, BranchCode2, TRN, State, CreatedBy, CreatedAt; actions are shared first | Matched |
| Filters | `BranchesComponent.filterForm` → `toListParams` | `BranchService.getList` → generic `Service.BuildFilterPredicate` and `BranchService.SearchColumns` | search (Name/BranchCode), name, id, BranchCode, BranchCode2, TRN, State; empty values omitted | Matched |
| Paging/sort | `resolveListPaging`, `pageNo/pageSize`, column-derived sort set | `Service.GetManyAsync` / `Results.TotalCount` | 15 default; 10/15/20/50/100 options; stable Id tie-breaker | Matched |
| Export | `BranchService.getAllList` + `fetchAllPages` | `dataTableExportRows` | applied filter/sort snapshot, translated headers, all pages, failure prevents file | Matched |
| Detail | `BranchDetailVM` → `BranchDetailsDTO` | controlled `BranchDetailsComponent` | Id plus seven editor fields | Matched |
| Writes | `BranchAddVM` / `BranchUpdateVM` | typed BranchCreateDTO / BranchUpdateDTO | no tenant, audit or subscription payload; optional empty strings become null | Matched |
| Delete | `BranchService.RemoveWithChildrenAsync` | shared danger confirmation and refresh | EF-model inbound references block live-row deletion | Matched |
| Routes/modes | `/Branch` only | list-owned `app-editor-dialog` create/view/edit | view loads and is read-only; edit is explicit; dirty exit is guarded | Matched |
| User guide | `UserGuide/content/administration-guide.ts` | `/UserGuide/administration`, existing Administration sidebar entry | bilingual Branches topic covers search, paging/export, CRUD, dirty exit, deletion and limits | Matched |

## Decisions and evidence

- Screen type: UI screen 01, fields-only modal, selected by UI13 D4-2; the old create/details routes were removed.
- Backend pattern: BE Pattern 1 normal entity; generic paging, filtering, mapping and save behavior is retained.
- ListVM scope: the grid consumes exactly eight fields; unused inherited plumbing and the duplicate unreferenced `BranchFullListVM` were removed. Detail retains CCEmails and Address because the editor renders them.
- Validation: Name is required/max100; BranchCode, BranchCode2 and TRN max50; State max100; CCEmails and Address max500, matching `BranchConfig` and the typed Angular form. Empty optional strings are transported as null.
- Mapping: existing `BranchProfiler` maps the explicit write/read contracts; no `Ignore()` or `ReverseMap()` was added.
- Delete: the generic EF-model reference scan is used instead of a partial hand-maintained list, so new direct inbound references are included. This preserves soft-delete semantics and leaves dependent data intact.
- Authorization: AuthGuard and the authenticated backend controller remain the only access mechanism; no permission API or hidden-control security claim was introduced.
- Calculations: none.
- Shared extraction: no new shared capability qualified. The change reuses FilterPanel, DataTable, FeatureTitle, PrimaryActionButton, EditorDialog, FormSection, FieldError, StateMessage, ConfirmationDialogService, freezeFormState, list-query and list-route-state.

## Schema and migration

`BranchConfig` now filters the tenant/name unique index with `[IsDeleted] = 0`, aligning the index with repository duplicate semantics. The owner must run `Add-Migration FilterBranchNameUniqueIndex` and review deleted/live duplicate data before applying it. The agent did not create, edit or run a migration or model snapshot.

## Owner verification still pending

1. Run the Angular application build and resolve any template/compiler diagnostics.
2. Run backend and frontend tests appropriate to the repositories.
3. Exercise `/Branch` in English and Arabic, light and dark themes, RTL, narrow/intermediate widths, list paging/sort/filter/reset, full export, create/view/edit/dirty-close, duplicate-name failure and referenced-delete failure.
4. Apply the migration only after reviewing the existing index/data and confirming the suggested name.
5. Verify the Administration guide route/menu entry and Branch topic navigation.

Known runtime risk is limited to the unverified Angular template/compiler integration and the owner-controlled index migration. Source review found no stale Branch route, legacy table component, feature stylesheet, server-owned write field, silent failure handler, or merge marker in the scoped Branch changes.

## Suggested commits

`SiGmaAngularFrontEnd`: `refactor(branches): align list and modal editor with shared screen patterns`

`SigmaBackend`: `refactor(branches): narrow contracts and protect branch deletion`

Documentation layer: `docs(branches): record contracts and reconciliation`

## Agent utilization

The root agent performed discovery, contract freeze, list/integration/translation/guide work and final reconciliation. A bounded `gpt-5.6-sol` backend worker owned only BranchService, Branch VMs and the Branch EF configuration; it used the frozen contracts and returned the scoped implementation. A bounded editor worker initially read the editor contract and contributed the details implementation; its later turn hit the account usage limit, so the root completed and reviewed the integration. Ownership did not overlap on source files during implementation. No prohibited command was run.
