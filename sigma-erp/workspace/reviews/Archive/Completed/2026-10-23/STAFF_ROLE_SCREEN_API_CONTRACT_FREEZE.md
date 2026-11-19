| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Staff Roles — screen/API contract freeze (2026-10-11)

Scope: existing StaffRole feature only, directly related API and HRM user-guide topic. Authority: Sigma AGENTS, Master 0–8, canonical UI Screen01/UI1–10/13/15/19/22–29 and BE1–9/13/18. Recipe drift check passed for phase-00..06; no canonical or generated documentation edits required.

Evidence: screenshot 1 confirms Name search, create, Name/Description grid, Edit/Delete and paging; screenshot 2 confirms Name/Description, Cancel/Save. Legacy colors, sizing and placement are historical visual evidence only. Source confirms int identity, tenant-owned EntityBase, optional description, no child collections or model references to StaffRole. No permissions, calculations, uploads, approvals or posting are evidenced.

Shape: UI Screen01 list with modal editor; approved Job list shell and shared EditorDialog declarations/UI13 controlled composition. Backend Pattern1 normal entity, approved BranchService/base hooks. No reference feature modifications.

| Decision | Frozen contract / evidence |
|---|---|
| Grid / ListVM | Name, Description; identity Id for actions. ListVM inherited properties Id, Name, Description. Remove unsupported client No/audit columns. |
| Filter/paging/sort | Filters[search] trimmed, searches Name. pageNo/pageSize, default shared 15; base stable server order with Id tie-breaker; TotalCount/TotalPages from base. |
| Detail | Id:int, Name:string, Description:string?; same modal view/edit. |
| Add | Name required trimmed nonblank max50; Description optional trimmed max250. |
| Update | Id plus same editable fields. Preserve established update max50 and narrow create to the same bound; prevents create-only names that cannot be edited. |
| Ownership | Tenant, audit, deletion/state and numbering fields excluded from client payload. No new stored properties. |
| Duplicate | live tenant-scoped Name, compare with database collation; exclude self on update, unique filtered index (SubscriptionId, Name), IsDeleted=0. Base UniqueColumns owns checks and concurrent-write handling. |
| Delete | Existing soft delete; no inbound FK/owned collections in current model. Use shared InUseAsync guard before base removal to cover model references if added. Confirmation names record. |
| Routes | `/StaffRole` owns the list and modal; legacy create/details URLs redirect to the list because the reviewed screen no longer uses routed editors. Dirty state is handled by the modal close flow. |
| Actions | Create/View/Edit/Delete supported. Edit is possible from View. No activate/deactivate UI, posting or domain transition because no business state/requirement for this feature. |
| Errors/feedback | Feature handles declared/transport failures with retry and preserved edit data. Global mutation interceptor owns one success toast. |
| Export | Not applicable: neither screenshot nor existing feature proves an export requirement. |
| Transactions | Add/Update/Delete reach one SaveChanges in one scoped DbContext; EF implicit transaction sufficient. Unique-write serialization remains base-owned. No financial/domain calculation. |
| Migration | EF Name50/Description250 + live tenant name unique index need owner migration AddStaffRoleValidationAndUniqueName; reviewer does not generate/run migrations. Existing overlength/duplicate rows require owner preflight. |
| User guide | Add Staff Roles bilingual topic to HRM_GUIDE, existing reader/menu /UserGuide/hrm. |

No unresolved required Missing/Conflicting/Uncertain contracts. Runtime and visual acceptance remain pending. Single root agent: tightly coupled small screen, delegation overhead and shared files do not meet gate. Preserve unrelated edits; no build/test/lint/browser/database/migration/commit/push/deployment.



