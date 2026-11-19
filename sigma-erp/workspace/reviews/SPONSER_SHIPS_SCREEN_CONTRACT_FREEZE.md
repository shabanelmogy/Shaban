| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-14 |

# Sponsorships screen contract

User request: review `Administration/SponserShips` and implement confirmed documentation fixes. Authority: Sigma AGENTS, Master 4/5/7, screen-refactor skill and applicable canonical UI/backend books. Recipe check passed for all eight packets on 2026-10-14; PHASE-00 through PHASE-06 apply. No screenshots supplied. PLAN-00 is not required: bounded adoption of documented CRUD conventions, no ambiguous aggregate/workflow or financial effect.

## Scope and initial evidence

Frontend: existing SponserShips folder, its translations and owning Administration user-guide topic. Backend: directly related SponserShip service, DTOs, EF configuration and localized duplicate message. References remain read-only. Existing scoped feature files were clean. Shared vocabularies, Administration guide and LayoutModule already contain unrelated changes; retain them and edit only the necessary feature block. Staff consumes the existing root SponserShipService through GetSelect, not its screen List/Detail DTOs.

UI shape 01, list with controlled modal: only Name, no children/totals/posting. Canonical list reference: Workshop/Job/components/list. Modal reference: actual shared EditorDialog declarations and UI13 composition. Backend pattern 1: BranchService hooks. Entity retains EntityBaseWithName; numbering/tenant/audit remain server-owned. AuthGuard and authorized generic controller supply authentication, no permission mechanism is introduced.

## Frozen read/write contract

| Grid order/need | Frontend | Backend | Type |
|---|---|---|---|
| Actions first | id | Id | View/Edit/Delete target |
| ID | id | Id | number |
| Sponsorship Name | name | Name | text |
| Created by | createdBy | CreatedBy | nullable text |
| Created at | createdAt | CreatedAt | dateTime |

ListVM becomes explicit Id/Name/CreatedBy/CreatedAt only. Remove inherited SubscriptionId, No, GUID, IsActive, IsValid and IsChanged. Detail becomes LeanDetailBaseVm + Name only; remove unused tenant, No, audit and state fields. Record identity is rendered in the modal subtitle. Existing four one-way AutoMapper maps remain convention maps; no Ignore/ReverseMap needed.

| Control | Form type | Detail | Add | Update | Validation |
|---|---|---|---|---|---|
| Name | nonnullable string | Name | Name | Name | Required, trimmed, max 250 |
| Identity | mode input number/null | Id | absent | Id | existing positive record ID |

Preserve Add's documented current 250-character limit and correct Update's inherited 50-character mismatch through feature-local UpdateBaseVm + annotated Name. Add continues AddBaseVmWithName. BE backlog 4 identifies this inconsistency; no shared base change. Name is the only editable/business label and normal-entity business key (BE2/8/13): per-tenant live names must be unique. Use UniqueColumns + localized SponserShipNameExists and matching filtered `(SubscriptionId, Name)` unique index; no arbitrary normalization/collation changes. Explicit EF max 250 matches existing Add. Owner checks legacy duplicates/overlength values before applying migration; no data cleanup by reviewer.

| Filter | Serialized key | Backend | Default |
|---|---|---|---|
| ID number/null | Filters[id] | generic stored Id equality/int | null/absent |
| Name string | Filters[name] | generic Name Contains | empty/absent |
| Sort | Filters[sortField], Filters[sortOrder] | generic stored-column sort + Id tie-break | id/-1 |
| Paging | pageNo/pageSize | NormalizePaging/CountAsync | 1/15 client; backend clamp 1..100 |

ID rejects invalid/nonpositive Int32. No date filter introduced. Explicit Search freezes draft filters; paging, refresh, mutations and Excel reuse that snapshot. ResolveListPaging runs before state writes; switchMap cancels superseded reads. TotalCount/TotalPages come from base GetManyAsync, no fabricated totals. Excel fetchAllPages at 100/page and dataTableExportRows uses all matching records, exact displayed columns, click-time translations; any failed page aborts the file.

## Endpoints and actions

Keep generic `/SponserShip`: GET list Results<ListVM>, GET GetById/{id} Result<DetailVM> (no relations on this scalar entity), POST {name}, PUT {id,name}, DELETE ?id=; Result write envelope. Staff GetSelect keeps its existing shape. No API or permission invented.

Create/View/Edit use one remounted list-owned editor, explicit mode/id, disabled View with no Save. Edit requires successful matching Detail snapshot; inline read failure + Retry. Save freezes the draft and prevents repeats, retains values on either failure, closes/refreshes only on success. Global interceptor owns mutation feedback; inline list/detail/export reads explicitly suppress its error feedback.

Delete source state = live tenant-owned entity, target = soft-deleted. Existing Staff.SponserShipId dependency prohibition retained via canonical RemoveWithChildrenAsync and EF usage discovery, extending to every actual inbound reference. Confirmation preset names row and warns about dependencies. Success refreshes applied query and steps back when deleting the only row of page >1. Failure keeps row; server/global interceptor owns localized feedback. Override only RemoveAsync for dependency-aware delete; GetMany/Add/Update/Detail inherit their generic owners.

Reference action coverage: Job Create/View/Edit/Delete/Export Supported in their CRUD-equivalent slices. Lubrication Job, Labour Time, Close Job, Gate Pass, Quality Check, Logs, invoice/approval actions Not Applicable: SponserShip has no job, time, vehicle, state or financial aggregate. Activate is not a demonstrated screen workflow; inherited compatibility endpoint remains unused. Authorization candidates: DELETE /SponserShip?id=; no control is claimed secured by visibility.

## Routes and closure

Keep `/SponserShip` entry/menu and only empty child list route (UI1). Remove obsolete create/details routes after symbol search found no external callers; no compatibility editor route retained. List CanDeactivate delegates to controlled editor. X/Cancel/Escape/navigation share deferred dirty confirmation; pending confirmation freezes controls, stale decisions cannot act, accepted close does not block on its own pending flag. Pristine/View leave silently. Saved dialog emits boolean for parent refresh.

Root-provided service retains BaseService/root interceptor-equipped HttpClient. Existing LayoutModule duplicate service provider is directly related wiring to remove only for this service; preserve other providers and unrelated edits. No feature HttpClient provider or manual token.

## Pre-edit conformance evidence

| Concern | Book | Actual reference/symbol | Shared owner | Target decision |
|---|---|---|---|---|
| Bounded list/title | UI1/3 | Job list HTML + JobsComponent host | styles.scss/FeatureTitle | same sigma-route-host/list-page/panel/header; 8px shared margins; no local CSS |
| Filters | UI4 | Job form appFilterPanel + imports | FilterPanel/FilterActions | two existing filterable fields, stableLayout/required Reset; feature owns data only |
| Grid/paging | UI5/6/28 | Job app-data-table + resolveListPaging/switchMap | DataTable/list-query | fill=true, lazy, count from API, default15, stored-column whitelist |
| Export | UI8 | Job dataTableExportRows, fetchAllPages | shared utilities | complete applied-filter result/current language |
| Editor | UI13/15 | EditorDialog inputs/outputs and controlled composition | EditorDialog/FormSection | padded single-section form, mode/title/ID subtitle, View hides primary action |
| Validation/errors | UI19/22 | shared FieldError/StateMessage/api-error | shared owners | Required/250, explicit both failure channels and Retry |
| Delete/discard | UI9/10; BE8 | Confirmation presets; BranchService.RemoveAsync | confirmation/form-state/RemoveWithChildrenAsync | named record, frozen pending decision, automatic usage checks |
| DTO/map | BE3/4/7 | Branch convention maps; LeanDetailBaseVm | generic mapping/identity | exact lean reads, client-only writes |

Implementation files/topics remain pending until review artifact reconciliation. No reusable rule changes required: reuse current shared owners. No builds/tests/lint/browser/database/migrations/commits/pushes/deployments are authorized.

## Subsequent governance correction — 2026-10-14

The initial PLAN-00 exclusion above was incorrect once scoped EF/schema and response compatibility changes were included. Master1's schema trigger applies. `SPONSER_SHIPS_MAINTENANCE_EVOLUTION_PLAN.md` records the bounded Frozen target, alternatives, impact, rollout and late planning-gate correction. The already frozen source contracts remain identical; the initial statement is retained as historical evidence rather than silently rewritten. Implementation/reconciliation status belongs to `SPONSER_SHIPS_FEATURE_REVIEW.md`.
