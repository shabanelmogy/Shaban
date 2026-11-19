# Departments frontend contract freeze

| Status | Owner verification pending |
|---|---|
| Frozen | no |

## Frozen handoff

The Departments screen is a UI screen 01 list with a controlled modal editor. The existing Department backend is a normal entity API with paged `Results<DepartmentListVM>` responses, `GetByWithNavigationsId/{id}` details, POST/PUT writes and DELETE by query id. The implementation consumes that contract without changing server code or schema.

## Evidence and references

- `3.PNG`: list title/subtitle, Name filter, Search, Actions/Name/Description columns, Edit/Delete menu, pager.
- `4.PNG`: Create Department modal with Name, Description, Cancel and Save.
- Canonical: UI blocks 1, 2, 3, 4, 5, 6, 7, 9, 13, 15, 19, 22, 23, 24, 25, 27, 28; BE blocks 2, 3, 5, 6, 8, 13; approved list reference `Workshop/Job/components/list`; editor owner `shared/components/editor-dialog`.

## Contract tables

| List concern | Frozen value |
|---|---|
| Query | `{ pageNo, pageSize, filters: { search } }` encoded by `toListParams` |
| Rows | `{ id: number, name: string, description: string | null }` |
| Columns | Name, Description (id is identity only) |
| Actions | Edit opens modal; Delete uses shared confirmation |
| Paging | `totalPages`, unknown total-record count, shared DataTable page-count footer |
| Reset | Clears search and requests page 1 |

| Write concern | Frozen value |
|---|---|
| Create | `{ name, description }` |
| Update | `{ id, name, description }` |
| Validation | required/nonblank Name; max 250 on Create and max 50 on Update; max 250 Description; server duplicate check |
| Dirty close | shared discard confirmation for Cancel/Close/Escape |
| Failure | `isSuccess:false` and transport errors stay in dialog; entered values remain |

## Scope boundary

No backend source, EF configuration, migration, model snapshot, route-level permission, or accounting behavior is changed. The existing unrelated Staff Roles working-tree edits are preserved. `ToolbarComponent.showPageTitle()` excludes `/Department` to preserve the single in-panel title required by UI block 3.

## Reconciliation amendments — 2026-10-11

The frozen tables above preserve the initial handoff. Source-supported refinements below supersede the affected rows, without changing the API or business rules:

1. Preserve View Details in addition to screenshot-proven Edit/Delete. The original Department details component loaded saved fields disabled until Update was selected; removing that behavior on screenshot absence would breach the preservation rule. One controlled Create/Edit/View dialog now owns it; View offers the shared Edit footer action.
2. Dirty exit covers route navigation as well as Cancel/X/Escape. The list feature route delegates CanDeactivate to the current editor; the shared deferred confirmation freezes/restores controls and rechecks captured id/mode. Pending reads, saves and Delete decisions/mutations block exit.
3. Phase04 applies to the existing destructive Delete slice. Its frontend confirmation/repeat-request/error/refresh behavior is reconciled, with the existing Staff-reference backend guard retained; no new domain transition is introduced.
4. No export exists in this scope: the legacy screen and table declaration expose no export action. An earlier review column note about hypothetical shared exports was incorrect and has been corrected; no export API/content is invented.
5. The content-sized two-field editor uses public shared width440px/contentPadded=true and one `sigma-editor-scroll flex-fill` region under the shared shell. This is a content-based reviewer sizing choice, not screenshot geometry; shared responsive bounds remain authoritative. Runtime/visual acceptance remains pending.

API compatibility notes: Add Name250 / Update Name50 / Description250 are the actual existing write validations. The backend returns TotalPages without TotalCount, so the shared unknown-count pager is selected rather than fabricating an item total. Server read DTOs still inherit unused plumbing and the handwritten list/service validations remain existing backend deviations, outside this frontend implementation. Final source reconciliation and owner verification steps are recorded in `DEPARTMENTS_FEATURE_REVIEW.md`.
