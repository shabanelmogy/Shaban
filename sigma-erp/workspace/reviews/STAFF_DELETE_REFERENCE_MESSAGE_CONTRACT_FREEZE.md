| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Staff delete reference message — 2026-10-03

## Manifest and evidence

Owner reports `This record cannot be deleted: it is used in Partner.` and expects shared delete handling. Written report only; no screenshot or database evidence. Scope is shared delete-reference message resolution and its directly related resources, with Staff as the reported consumer. Existing unrelated frontend/backend changes (including Staff, translations, entities and owner migrations) are preserved.

UI shape: existing type 03 routed step-form record with paged list; references are IndividualPartner and the shared ConfirmationDialogService (UI9/22). Backend shape: pattern 2 aggregate without a financial effect for record deletion; approved reference PurchaseOrderService.RemoveAsync and shared Service.InUseAsync (BE8/14). Salary posting is outside this deletion-message task.

The earlier inheritance correction is already present: InUseAsync excludes IsBaseLinking(). Staff derives from MemberPartner -> Partner. PartnerConfig separately declares Partner.SalesPersonId -> Staff; this is an ordinary business FK. Its existence must continue to block deletion. A Partner query includes derived records, but the current message uses the FK-declaring type instead of the matched row's concrete entity type, so a Company/Individual/Supplier usage is reported as Partner. No claim is made about the owner's specific saved reference without data verification.

Development details is independently enabled by ApiErrorDialogService.read when environment.production is false. Its current development-only contract is retained. The pending clarification concerns the owner's actual data/expected deletion outcome; it does not authorize unlinking or bypassing a legitimate usage.

## Frozen bounded correction

- Keep DELETE Staff?id=, standard Result, authentication, tenant-scoped target lookup, owned rows, soft-delete fields and the existing business-reference predicate.
- Resolve a positive reference with one AsNoTracking FirstOrDefaultAsync read and use EF runtime entity metadata for the actual matched type. Retain declared metadata as fallback. Return only the translated entity category, without row names, IDs or other saved data.
- Add en/ar Entity keys for the Partner hierarchy so concrete references have business labels. RecordInUse wording and response shape remain compatible.
- Do not skip Partner.SalesPersonId, external references, business self-references or a whole base table. Do not alter generic base.RemoveAsync (BE backlog31).
- No entity/configuration/DTO/map/calculation/route/provider/frontend change; no migration, database mutation or permission-policy change.

## Action and recovery contract

| Action | State | Boundary | Confirmation/busy | Result/recovery |
|---|---|---|---|---|
| Delete Staff | Live -> soft deleted only when unused | StaffService.RemoveAsync -> RemoveWithChildrenAsync -> InUseAsync -> one SaveChangesAsync | Existing ConfirmationDialogService.confirmDelete; list busy gate and finalize | Failure keeps the row and is presented once by the interceptor; success refreshes the applied page, moving back for its last row |

Backend remains authoritative. Existing authentication is not an authorization system; no new permission mechanism. Reference-check/save concurrency semantics remain unchanged and require owner verification.

## Conformance before implementation

| Concern | Book | Reference file/symbol | Shared owner | Target comparison |
|---|---|---|---|---|
| Aggregate deletion | BE8/14 | PurchaseOrderService.RemoveAsync | Service.RemoveWithChildrenAsync | Staff passes address/documents/eligibilities/salary/bank accounts; unchanged |
| Inheritance versus business FK | BE8 | Service.InUseAsync; PartnerConfig.Configure | Service | IsBaseLinking excluded; Partner.SalesPersonId remains checked |
| User-facing blocker label | BE8; Master5 | Service.TableName | Service + GeneralMessage resources | Current declared Partner label loses actual subtype; correction resolves matched runtime entity |
| Error ownership | UI9/22 | Staff list deleteRecord; errorInterceptor; ApiErrorDialogService.read | Interceptor/dialog | Both Result and HTTP failure handling retained; development details intentionally unchanged |

## Workflow and verification boundary

Recipe drift check passed before use. Applied phases: 0 scoped discovery, 1 bounded contract freeze, 4 domain-action message correction, 6 scoped source reconciliation. Phases2/3/5 implementation is unnecessary because read/editor/wiring contracts are unchanged. PLAN-00 is unnecessary for this bounded message defect with preserved business behavior. No agents: one shared helper and resources do not meet the independent-workstream delegation gate.

Implementation review is pending in STAFF_DELETE_REFERENCE_MESSAGE_FEATURE_REVIEW.md. Owner must verify actual referenced and unused Staff records after restarting the backend. Builds/tests/lint/browser/database/migration/commit/push/deployment commands are not authorized or run.

## Owner continuation and implementation refinement

Owner instructs `كمل` after concurrent CheckUnique changes were reported. Continue above the current compatible source and documentation without reverting or claiming those changes. The helper's non-inheritance case retains the existing AnyAsync query; only a declared type with derived types needs one AsNoTracking FirstOrDefaultAsync read to resolve the concrete blocker. This refines the technical approach above without changing references, labels, business rules or the API. Concurrent-write permission does not authorize changing the separate CheckUnique behavior.

Implementation handoff: STAFF_DELETE_REFERENCE_MESSAGE_FEATURE_REVIEW.md now records source-only reconciliation and pending owner verification. The pending-file statement above is retained as the historical pre-implementation handoff.
