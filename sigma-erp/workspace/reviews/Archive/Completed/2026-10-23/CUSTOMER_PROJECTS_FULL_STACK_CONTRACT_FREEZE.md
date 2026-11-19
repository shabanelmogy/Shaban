| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-14 |

# Customer Projects contract

Scope: Administration/CustomerProjects/CustomerProject and directly related CustomerProject backend contracts; user authorizes review and implementation. No supplied screenshots. Original detail-file user edits add Save/Cancel/Delete/Edit icons; retain these semantics through shared controls. Other pending repository changes remain untouched.

UI01 modal editor (fields only, no children/totals); BE1 normal entity. Canonical references: Workshop/Job/components/list for list and action inventory, shared EditorDialog/FormSection declarations and UI13 for controlled composition; BranchService/BranchProfiler for base hooks and one-way maps.

## Frozen read/write contract

Grid order: Actions, name (text/link), customerId (number), customerName (text), isActive (status). ListVM and frontend row: id:int, name:string?, customerId:int?, customerName:string?, isActive:bool?. Detail: same five properties over LeanDetailBaseVm. Remove unused inherited tenant/audit/No/GUID/valid/changed/deletion properties and nested CustomerDetailVM; no named external consumer found for these CustomerProject read shapes. FullListVM is unused and remains outside the public read handoff.

Add: name required/max250 (existing Add boundary), customerId nullable positive when supplied, isActive nullable default true. Update: those fields plus positive id. Explicit Name on simple Add/Update bases aligns the existing Add limit with Update without changing persistence. Entity/EF remain unchanged. Existing base FK validation proves live tenant Partner identity. No subtype restriction, duplicate rule/index or financial rule is introduced: source defines no CustomerProject business key beyond identity.

Customer choices: existing Customer/GetSelect returns Individual/Company Partner IDs, matching CustomerProject.Customer's Partner principal. View reads customerName without lookup. Edit preserves a saved Partner ID/name by shared mergeSelectOptions when missing from current choices; backend live/tenant FK validation remains authoritative (no new subtype eligibility rule). Nullable FK follows actual entity, optional controls in source and generic optional-reference validation. No destructive data conversion.

Filters: name text -> Filters[name] generic Contains; isInactive checkbox unchecked -> absent, checked -> Filters[isActive]=false; default all rows. Sorting: name/customerId/isActive; customerName unsortable (not stored property). Page default15, choices10/15/20/50/100; server base clamp1–100 and CountAsync total; sorts serialized inside Filters. Export all pages100 through fetchAllPages, same applied filters/sort and translated grid columns. CustomerId zero is invalid as input and never an absent FK.

## Endpoints and state

GET CustomerProject -> Results<ListVM>; GET CustomerProject/GetByWithNavigationsId/{id} -> Result<DetailVM> (inherited navigation detail, needed for customerName); POST CustomerProject -> Result, PUT CustomerProject -> Result; DELETE CustomerProject?id=... -> Result; POST CustomerProject/handleActivate {ids:[id],isActive:boolean} -> Result. Bearer authentication inherited; app has no permission system. Add/Update inputs exclude subscriptionId, audit and generated numbers.

Create/Edit/View share one controlled dialog; list route only, with CanDeactivate delegated to mounted editor. No direct create/details route consumers found; remove obsolete feature routes. X/Cancel/Escape and navigation share deferred dirty confirmation with freezeFormState; Save freezes draft, failures restore it, success closes and refreshes the applied list. API interceptors own mutation feedback; scoped inline reads suppress error interceptor. Each loader has finalize cleanup; switchMap cancels superseded list reads. Delete confirms identified record, dependency check through base RemoveWithChildrenAsync, previous page after last-row delete. Activation confirms, base validates all IDs before updating tracked state; nullable state displays Unknown, Activate sets true, Deactivate offered only for true. Editor status input preserves actual chosen false/null rather than forced true.

Reference action classification: View/Edit/Delete Supported. Labour Time, Invoice Customer, Close, Cancel Job, Quality Check, Log, Estimation, Print Gate Pass Not Applicable: CustomerProject has no job aggregates, lines, transitions or accounting. Create/Search/Reset/Export Supported; Activate/Deactivate supported by inherited controller and persisted IsActive. Authorization candidates: write/delete/activation endpoints; authentication only, no invented permissions.

## Overrides and transactions

MaterializeListAsync only for ProjectTo navigation label. RemoveAsync only to use dependency-aware generic RemoveWithChildrenAsync. Add/Update/Detail/GetMany/HandleActive/controller inherit; generic validation/mapping/count/paging/save and localized feedback remain owners. One SaveChanges per mutation: implicit EF transaction; no explicit transaction or calculations.

## Conformance before implementation

| Concern | Book | Actual reference/shared owner | Target |
|---|---|---|---|
| bounded list/title/filters | UI1/3/4 | Job list HTML; styles.scss/FeatureTitle/FilterPanel | sigma-route-host, sigma-list-page/panel/header/table, stableLayout=true |
| columns/pager/export | UI5/6/8 | Job list/DataTable/list-query | fill=true, server totals, page15, translated all-page export |
| editor | UI13/15/19 | EditorDialog public inputs; FormSection; FieldError | contentPadded=true, flex-fill autoheight chain, one section, typed form |
| dirty close/focus | UI10/27/28 | ConfirmationDialogService, freezeFormState, focusField | deferred same-session decision, pending freeze, scoped Escape |
| backend shape | BE3/4/7/13 | BranchService/BranchProfiler/base Service | lean reads, explicit client writes, minimal hooks, one-way maps |
| guides | Master7 | UserGuide/content/administration-guide.ts | add bilingual Customer Projects topic before handoff |

Applicable phases00–06. PLAN00 not needed: bounded confirmed conformance repairs, no ambiguous new workflow. Generated packets initial -Check all8 OK, 2026-10-14; no regeneration needed absent canonical changes. No migrations, model snapshots, builds/tests/lint/database/browser/commits/push/deployment authorized.

### Source clarification before frontend edits

UI16 historical-select rule supersedes saved-option merging above: an absent Customer choice may be deleted or outside current customer selection. Keep its detail-derived label in View and beside the Edit picker, never reintroduce it into choices. Saving requires a current choice or clearing the optional reference. Backend keeps its existing live Partner FK rule with no subtype restriction. IsActive is explicitly editable in the original screen, so it is a client input here, an exception to generic server-owned-status guidance; independent activation uses the existing endpoint.

### Final scope clarification

BE3/7: repository-wide symbol lookup found only the declaration of CustomerProjectFullListVM, so remove that unused read VM instead of retaining a second oversized contract without a named consumer. UI1/3 wiring: remove CustomerProjectService's duplicate LayoutModule providers/import and suppress the shared toolbar title specifically on /CustomerProject. Preserve all other pending shared-file hunks. Remove the two empty feature stylesheets and two placeholder creation-only specs (the list spec incorrectly targets Widgets ListsComponent); no meaningful regression tests are removed or new tests executed.
