# Custom Lookups — screen contract freeze

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-14 |

## Scope and evidence

Owner request: “راجع : src\app\modules\Administration\CustomLookups وطبق التعديلات طبقا للوثائق”. Review and implement confirmed guide findings in the named feature and directly related backend contracts. No new custom-field business model is authorized by this wording.

S1: `C:/Users/user/Desktop/custom lookup.png`, list, English/LTR, desktop 1672×384. Role, capture date and product version unknown. Functional evidence only.

| Evidence | Classification | Contract |
|---|---|---|
| Custom Lookups title; Name column | Explicit | Existing Name string retained |
| Add (+), Actions dropdown | Explicit | Existing Create/View/Edit/Delete through shared controls; menu contents are not proved by S1 |
| Paging | Explicit | Existing server list, authoritative TotalCount and TotalPages |
| Custom Field selector | Explicit control; Missing options/relation | Source entity has Name only; CustomFieldType contains Input only and is a settings input-kind enum. No category/relation or options source exists. Deferred outside confirmed-fixes scope; do not repurpose that enum or fake a selector |
| Customer / Mohamed Mohamed Elmogy values | Explicit examples | Do not seed or invent production data |

UI type 01, list with modal editor (fields only, no children/totals). Backend Pattern 1 normal entity, retaining EntityBaseWithName and tenant/soft-delete repository behavior. References: `Workshop/Job/components/list` shell/filter/grid; shared EditorDialog controlled single-section composition (UI13); `BranchService` base hooks (BE13). Existing unrelated changes in both repositories must be preserved. Existing scoped details TS changes are button icons; their save/cancel/edit/delete intent remains through shared components.

No Maintenance/Evolution Plan required: bounded migration to documented existing owners, no new workflow/aggregate. Phases 0–6 apply; Phase4 covers Delete only. No financial actions, uploads or child reconciliation. Authentication via existing AuthGuard/API Authorize; no permission API.

## Grid, filters and paging

| Grid/action need in order | Angular | Backend ListVM | Status |
|---|---|---|---|
| Actions (shared first) | id: number | Id: int | Confirmed |
| Existing No, link to View | no: string/null | No: string/null | Confirmed EntityBase/ListBase; retain current source column even though S1 does not show it |
| Name, text | name: string/null | Name: string/null | Confirmed |

ListVM becomes exactly Id, No, Name. Remove inherited SubscriptionId, IsActive, IsValid, IsChanged, GUID, CreatedAt, CreatedBy; no list action consumes them. Unused FullList contract is not a replacement list API and is outside this narrowing.

| Control | Angular/query | Backend | Type/default |
|---|---|---|---|
| No | no / Filters[no] | generic stored No contains | trimmed string, omitted empty |
| Name | name / Filters[name] | generic stored Name contains | trimmed string, omitted empty |
| Pager | PageNo/PageSize | base NormalizePaging/CountAsync | 1/DEFAULT_PAGE_SIZE=15; 10,15,20,50,100 |
| Sort | Filters[sortField], Filters[sortOrder] | base stored-column sort + Id tie-breaker | no/name whitelist; initial id descending |

Applied filter snapshot survives paging, mutations, editor closing and URL restore. switchMap cancels old reads. Empty/error states separate. Export reuses frozen applied query and fetchAllPages only for explicit output; not for ordinary paging.

## Detail and write

| Field | Form | Detail | Add | Update | Validation/owner |
|---|---|---|---|---|---|
| Identity | no editable control | Id | — | Id | positive int, existing tenant-owned record |
| Identifier subtitle | read-only | No | — | — | server-owned; fallback to Id, no invented document numbering |
| Name | non-null string | Name nullable for historical data | Name | Name | trim, required, max250 from existing Add/Update base; backend authoritative |

Name is the only editable business key. Normal-entity guide requires tenant/name uniqueness excluding deleted rows and excluding self on Update: use UniqueColumns + filtered unique `(SubscriptionId,Name)` index. Preserve nullable entity Name for historical rows; add max250 EF limit from existing write contract. Owner must check long/duplicate existing values before applying migration. No data cleanup/backfill is authorized. No custom-field property, IsInactive flag or activation UI is added.

GET CustomLookup → Results<List>; GET CustomLookup/GetByWithNavigationsId/{id} → Result<Detail>; POST CustomLookup {name}; PUT CustomLookup {id,name}; DELETE CustomLookup?id={id} → Result. Keep existing generic routes and root HttpClient. Reads suppress global errors and show inline Retry; writes use global error/success interceptors and restore form/busy state for both response failure and HTTP failure.

Mappings: Entity→List and Entity→Detail one-way; Add→Entity and Update→Entity one-way. No ReverseMap/extra Ignore. Backend retains inherited generic operations; overrides limited to business-key UniqueColumns and any proven feature requirement. Generic RemoveAsync checks actual EF inbound references; entity has no owned children or named inbound relation in the scanned model/configuration. No domain calculations. One entity save; keep base transaction owner, no feature transaction.

## Actions and integration

| Action | State/endpoint | Interaction/recovery |
|---|---|---|
| Create | POST; new draft | shared modal, validate, Save once, close and refresh applied list only on success |
| View | GET existing Id | read text; no Save; close silently |
| Edit | GET then PUT existing Id | same shared modal; preserve draft on failure |
| Delete | existing tenant record, base inbound-reference gate | shared confirmDelete identifies row; decline does nothing; success refreshes count and clamps last page; failure retains row |
| Discard | dirty editable draft only | deferred shared confirmDiscard, freezeFormState during confirmation; Cancel/X/Escape and route guard share decision |
| Export | applied filtered set | shared fetchAllPages/dataTableExportRows; explicit output only |

Reference Job actions: Create/View/Edit/Delete Supported; Close, time logs, lubrication job, invoice/down payment/financial and child actions Not Applicable (CustomLookup has no such aggregate/state). Refresh/Search/Reset/paging/output are UI operations, not domain transitions.

List route only (`CustomLookup`); remove feature create/details child routes per modal shape after verifying direct consumers. Editor instantiated per session, destroyed on close. List canDeactivate delegates to current editor, prevents leaving during mutation/confirmation. Root service providedIn root; no feature HttpClient provider. Suppress duplicate toolbar title via existing route predicate when needed. Existing Administration user guide route/menu reused, bilingual topic added after final source reconciliation.

## Pre-implementation reference conformance

| Concern | Book | Actual reference / shared owner | Target commitment |
|---|---|---|---|
| Bounds/title | UI1/3 | Job list template / sigma-route-host, sigma-list-*; FeatureTitle | host fill, fixed title and filters, no stylesheet/page scroll |
| Filters | UI4 | Job form appFilterPanel / FilterPanel + FilterActionsDirective | same stableLayout/reset/busy/action projection, own two text fields |
| Grid | UI5/6 | Job app-data-table / DataTable | fill=true, lazy server paging, authoritative count, translated report, actions first |
| Editor | UI13/15/19 | EditorDialogComponent/FormSection/FieldError | controlled padded content-sized single section; no tabs or local shell CSS; actual name field |
| States | UI22/28 | StateMessage, finalize, switchMap / root interceptors | inline read failure+Retry, global mutation feedback, balanced loading and cancellation |
| Confirmations | UI9/10 | ConfirmationDialogService + freezeFormState | Delete identity, dirty exit freeze and same-session checks |
| Backend | BE3/4/7/8/9/13 | BranchService + generic Service hooks | minimal read/write shapes and unique name hook/index; no redundant CRUD override |

Recipe -Check succeeded for all eight packets before use. No canonical book changes planned, so no generation needed unless verified reusable guidance emerges. Final conformance and full scoped diffs are root-owned; owner build/runtime/API/RTL/theme/visual verification remains pending.

## Source corrections and implementation clarification — 2026-10-14

These entries preserve the preceding frozen target and correct initial source descriptions:

- Existing Add Name has max250; existing shared UpdateBaseVmWithName has max50. The frozen intended max250 for both writes is implemented only in CustomLookupUpdateVM over UpdateBaseVm, matching Add and the target EF/UI limit, without changing the shared base.
- Generic Service.RemoveAsync does not check inbound references. Implement the approved BranchService `RemoveAsync` delegation to `RemoveWithChildrenAsync` to fulfill the frozen intended reference-aware Delete. It handles current EF references and missing IDs; no speculative relationship checks are introduced.
- Existing shared mock-data form's public `isPending()` gates Save, X/Cancel/Escape, mode changes and route leave while generation/preview owns the frozen draft. Reuse it; no new navigation framework.
- Content-sized editor retains shared default width1040/maxHeight and public contentPadded=true; form/body/scroll each use existing flex-fill. One Name section/one column, no tabs or local spacing/style override.
- Final reconciliation preserves the existing Name-to-View link as well as the No-to-View link; the frozen Name text presentation is corrected to a shared column link. Payloads and column/property lists are unchanged.
