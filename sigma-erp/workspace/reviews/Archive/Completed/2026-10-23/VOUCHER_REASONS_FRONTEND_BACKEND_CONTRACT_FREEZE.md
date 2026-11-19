| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-14 |

# Voucher Reasons contract

Authorization: review `src/app/modules/Administration/VoucherReasons` and apply confirmed guide fixes. Direct backend contracts are included; no new domain workflow. Source evidence: existing list exposes ID/Reason; details requires Reason; controller/service inherit generic CRUD; entity has nullable Reason and no business-key index, child collections, or inbound reference in the scoped entity/configuration search.

## Decisions

| Concern | Frozen decision and evidence |
|---|---|
| Shape | UI catalog01 / UI13 D4-2: one controlled modal for Create/View/Edit, one list route `/VoucherReason`; no tabs for one field. Backend pattern1, BranchService hooks and BranchProfiler explicit maps. |
| Grid ↔ ListVM | Actions first, `id` (number/link), `reason` (text). Frontend `{id:number,reason:string|null}` ↔ backend `{Id:int,Reason:string?}` only. Export uses the same business columns. |
| Filters | Optional `id:number|null` → `Filters[id]` → generic Int32 equality; `reason:string` trimmed → `Filters[reason]` → generic Reason Contains. Absent/empty omitted; zero retained; malformed/fractional/out-of-Int32 ID blocks Search. No date/enum/boolean/multiselect filters. |
| Paging/sort | `pageNo`≥1, frontend default shared DEFAULT_PAGE_SIZE, options10/15/20/50/100; backend clamps supplied size1–100 and counts before slicing. Sort whitelist from id/reason columns; stable backend Id tie-breaker. Applied snapshot drives paging/export/mutation refresh; Search/Reset page1. |
| Detail | `{Id:int,Reason:string?}`; lean identity base, no unused tenant/audit/flags. Historical null reasons hydrate as empty text. |
| Add/Update | Add `{reason:string}`, Update `{id:number,reason:string}`. Reason required after trimming, matching existing frontend requirement; add `[Required]` to both write VMs. No invented maximum. Request trim converter remains owner. No client tenant/audit/state fields. |
| Uniqueness | No source-supported unique business key: descriptive reason text may repeat as today. Do not create a unique index or duplicate restriction from another entity's rules. |
| Delete | Existing authenticated tenant-scoped generic soft delete; shared confirmation showing ID/reason; single inflight guard. No inbound FK/owned child found; inherit RemoveAsync, avoid speculative dependency checks. Success refreshes applied query and goes to a remaining page; failure keeps row/query. |
| Other actions | View/Edit/Create supported. Job's cancel/close/quality check/logs/labour time/gate pass/invoice/estimate actions N/A: no corresponding state, job/customer/financial/child aggregates. Activation API remains inherited compatibility surface; no UI lifecycle evidence, no new control. |
| Exit | View/pristine close silently; dirty Cancel/X/Escape/route asks via shared confirmDiscard + deferred guard and freezeFormState. Busy/mock work prevents close. Successful Save closes without discard. |
| Failures | Inline list/detail/export reads suppress error interceptor; apiErrorMessage/composedReadErrorMessage + shared state + Retry own feedback. Mutations retain global success/error owner and entered drafts/rows; finalize balances loader on every path. |
| Routes/provider | List receives canDeactivate; obsolete create/details routes removed per UI1. Root service/environment URL and existing AppModule token/error client. Remove duplicate VoucherReasonService entries in LayoutModule only. Existing menu remains. |
| Persistence/migration | Entity/EF unchanged; nullable storage retained for legacy rows. Required validation applies to new writes only. No migration, financial calculation or explicit transaction. EF implicit save transaction retained. |

## Endpoints

| Operation | Endpoint | Request → response | State/recovery |
|---|---|---|---|
| List/export pages | GET VoucherReason | ListSmBase filters/page/sort → Results<VoucherReasonListVM> | Live tenant rows, API total; cancellable reads, retry same query, no partial export |
| Detail | GET VoucherReason/GetById/{id} | numeric ID → Result<VoucherReasonDetailVM> | Same-session identity, readonly View; Retry on missing/failure |
| Create | POST VoucherReason | required Reason → Result | Server identity/tenant/audit; retained draft on failure, close/refresh on success |
| Update | PUT VoucherReason | Id + required Reason → Result | Generic existence/tenant checks; retained draft on failure, close/refresh on success |
| Delete | DELETE VoucherReason?id= | numeric ID → Result | live tenant target → soft deleted; confirmation + guard + applied refresh |

## Override audit and compatibility

No VoucherReason service/controller override is needed: property filters, sort, count, detail, validation boundary, writes and delete already have owners. No named second FullList consumer found; remove unused duplicate FullList VM after complete scoped consumer check. DTO narrowing removes inherited SubscriptionId/IsActive/IsValid/IsChanged/No/GUID/CreatedAt/CreatedBy and Detail IsDeleted, none consumed by the requested grid/editor. Preserve inherited auxiliary endpoint names and envelopes. Only list route remains; historical direct editor URLs intentionally retire with canonical modal adoption, no in-scope source caller found beyond existing list/routes.

No screenshots supplied. No Missing/Conflicting/Uncertain requirement blocks this source-supported contract. Runtime/build/visual/database acceptance remains owner-pending.
