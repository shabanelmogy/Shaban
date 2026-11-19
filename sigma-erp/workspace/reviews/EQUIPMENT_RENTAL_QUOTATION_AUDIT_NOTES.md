# Equipment Rental — Quotation bounded source audit

| Item | Value |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Date | 2026-10-27 |
| Authorization | Source-read-only; this review artifact only |
| Owning report | `reviews/EQUIPMENT_RENTAL_FULL_STACK_REVIEW.md` |
| Scope | Active EquipmentQuotation list, routed detail/editor, associated-PO dialog, Quotation API/entity/DTO/config and immediate downstream source guards |

The audit below records the initial read-only state. The later owner-authorized
Slice A implementation and corrections to that audit are recorded in the final
section; historical findings are retained rather than silently replaced.

Paths below are relative to `F:/My Work/Sigma/`. This is an auditor handoff to the root review, not an implementation freeze. Existing feature handoffs are historical evidence only; all statements below come from current source. No application/configuration/instruction/generated file was changed; no build, test, lint, browser, database, migration or commit was executed.

## Authority and shape

Applied the `sigma-screen-refactor` execution skill, UI screen catalog/type02, canonical UI2/7/22/28, backend2/7/8/9/14/18, and inspected UI30/BE19 for prior debt. Root recorded the successful eight-packet recipe `-Check` before delegation; PHASE02/03/04 packet entry/checklists were inspected. Type02 is justified by the two-axis approval lifecycle, not by copying an existing page. Backend pattern2 is an operational aggregate with no journal effect. Job list/editor and existing shared table/editor/collection owners are references, not change targets.

The active import is `SiGmaAngularFrontEnd/src/app/pages/routing.ts:492-496` → `modules/Equipment Rental/EquipmentQuotation/equipmentrental.routes.ts` → the inspected list/detail components. No similarly named RentalQuotation/SalesQuotation implementation is used as factual proof for this route. Neither feature route declares `showPageLoading=false`; layout defaults to a visible page host (`src/app/layout/layout.component.ts:48`, `.html:38`).

## Confirmed findings

### Q1 — P1: source approval can be reversed after creating dependent documents

- Location: `SigmaBackend/SiGma.Business/Services/VouchersServices/QuotationService.cs:228-239`; related eligibility at `:206` and edit/delete guards `:57`, `:121`.
- Trigger: approve both axes, create a linked master agreement or Asset PO, call Unapprove, then Revise. Unapprove checks only the two approval values, sets customer approval back to Pending and saves. Revise then returns both axes to Pending. The ordinary editor and Delete become available, despite those dependent documents remaining live.
- Impact: a master agreement or PO can retain a source quotation that has been changed or soft-deleted. FK Restrict protects physical deletion only, and does not stop this service's soft delete. `EquipmentMasterAgreementService.cs:67-78` explicitly requires both source approvals and derives its customer from the source on creation; `PurchaseOrderService.cs:311-329` likewise requires both approvals before persisting `EquipmentQuotationId`. There is no downstream query in Quotation Unapprove, Revise, Update or Remove.
- Recommendation: define and reuse authoritative live-dependency eligibility for the existing source reversal/edit/delete paths and list flags. At minimum block reversal for the existing master-agreement/PO consumers according to their live/historical contracts. Make downstream creation and source reversal share a transaction/lock invariant; a standalone precheck still races creation. Preserve the existing two-axis lifecycle; this finding does not authorize migration to unified approval or adding reason DTOs.
- Authority: UI7 quotation action-cycle explicitly requires dependency-blocked Unapprove; BE8 requires reference plus state checks for aggregate deletion. Existing approval-property concurrency tokens only detect competing changes to the quotation row, not creation of a different dependent row.

### Q2 — P1: applying any advanced column filter reaches a missing projection map

- Location: `SigmaBackend/SiGma.Business/Services/VouchersServices/QuotationService.cs:170`; shared dependency `Services/Bases/Service.cs:864-865`, `:886-895`; missing map evidenced by complete `MapperConfig/QuotationProfiler.cs:8-50`.
- Trigger: apply a nonempty shared column filter, including a simple `no` rule. The list manual projection works when no rules exist. With a rule, `ApplyGridFilters` obtains `GridFilterProjection`; QuotationService does not override it, so the base calls `ProjectTo<QuotationListVM>`. QuotationProfiler has only detail and write maps and no `Quotation -> QuotationListVM` map. Targeted symbol search found no other registration for that pair; `DependencyResolver.cs:149-152` loads the business profiles.
- Impact: the filtered request cannot resolve its AutoMapper projection; filtered list/count/export fail before the manual `Select` at `QuotationService.cs:187`. This is a source-established execution-path defect; the HTTP response/exception text was not runtime-tested.
- Recommendation: give the service an explicit `GridFilterProjection` using the same scalar expressions as its actual list projection (including ContactName and CustomerCode), and reuse those expressions rather than introduce default flags/labels. Keep shared parser, pre-count SQL filtering, pagination and complete export contracts. Adding an ordinary map alone must not omit the computed fields.
- Authority: BE9 says a manual read materializer needs the matching filter projection; UI6 requires count/page/export parity.

### Q3 — P2: cached Branch/Customer options never mount active bindings or clear on context reset

- Locations: list `components/list/list.component.ts:423-440`; editor `components/details/details.component.ts:269-306`, `:556-565`, all under the EquipmentQuotation feature path.
- Trigger: keep either screen open after a Branch/Company/Individual change, positive-row import, cache expiry or session/language/branch context change. Both consumers only take finite GetSelect snapshots into component arrays. Neither uses `watchSelectList`, `ReferenceLookupBindings` or context-reset handling.
- Impact: the shared cache source may invalidate, but current list/editor arrays keep old labels/options until explicit retry/remount. A context reset has no consumer callback clearing the previous options. Selected saved labels are merged at bootstrap but there is no distinction between a refresh and a context reset.
- Producer proof: BranchService `cacheSelect=true` at `Administration/Branches/services/branch.service.ts:16`, typed Add/Update invalidate at `:42-49` and inherited Delete uses the shared operator. CustomerService opts in at `shared/service/customer.service.ts:9`. CompanyPartnerService `:19`, `:45-59` and IndividualPartnerService `:24`, `:58-74` declare Customer dependency and invalidate on successful writes. `ImportCompanies/services/import-companies.service.ts:18-20` and `ImportIndividualPartner/services/import-individual-partner.service.ts:18-20` refresh on positive `savedRows`. Shared cache topic map includes Customer/Branch at `reference-lookup-cache.service.ts:373-374`; server definitions exist at `Realtime/RealtimeServiceCollectionExtensions.cs:27-30`.
- Recommendation: preserve the finite successful bootstrap, then bind separate once-per-key watches through the existing shared owner, with inline feedback identity, selected IDs/current options, null-context clearing, Retry and DestroyRef teardown. Do not enable caching for the other direct sources just to address this omission.
- Authority: UI2 mandatory screen-cache adoption checklist. This is an adoption gap, not a defect in the source invalidation owner.

### Q4 — P2: required lookup/export progress is missing; dialog read retains unnecessary global ownership

- Locations: list `list.component.ts:423-440` and `:449-458`; editor `details.component.ts:148-161`, `:269-306`, `:234-240`; editor template `details.component.html:8`.
- Trigger/impact: after the page list/detail settles while required lookups or customer contacts remain pending, no global lookup lease represents that work. A create page starts and immediately ends a synthetic `of(null)` detail lease while its five actual lookups remain pending. Export only sets `exporting`; its all-page HTTP reads acquire no page lease. There are busy booleans/error/Retry, so do not remove those controls while fixing ownership.
- Recommendation: use shared ReferenceLookupStatus for the routed initial lookup/contact bootstrap and one global start/finalize for the full export operation. Keep table/button busy inputs: their existing shared owners suppress their visible indicators while global loading is active (`data-table.component.html:37`, primary-action-button `showLoadingIndicator`). Critical CSS in `src/index.html:67-70` also suppresses routed loading StateMessage/control indicators while the shell overlay exists, so the editor's local loading branch is **not** a confirmed visible duplicate. No feature spinner/timer is needed.
- Related local-dialog mismatch: `components/purchase-orders/purchase-orders.component.ts:88-96` starts/releases a global lease while `.html:2` owns a local loading StateMessage inside the body-appended EditorDialog. `src/index.html:72-77` suppresses the shell loader while a dialog StateMessage is present, so this is unnecessary page-count ownership, **not** a confirmed duplicate visible spinner. Keep the local read owner and remove the redundant global ownership for that read; actual overlay visibility remains an owner check.
- Authority: UI22 loading gate and 2026-10-26 routed-lookup clarification. Root owns shared loader query-only navigation verification; current LoadingService compares parsed path trees and preserves same-path queries.

### Q5 — P2: rent input has no explicit policy for precision beyond its stored scale

- Locations: `SigmaBackend/SiGma.ViewModels/ViewModels/Quotation/QuotationDetailAddVM.cs:20-26`, `QuotationDetailUpdateVM.cs:22-29`; service `QuotationService.cs:319`; persistence `Configuration/QuotationDetailConfig.cs:14-15`; frontend `details.component.ts:498-499`, `details.component.html:44-45`.
- Trigger: input `1.234` as either rent, within the accepted magnitude range. Shared QuantityInput sets `maxFractionDigits=20` (`shared/directives/quantity-input.directive.ts:38`); a `step=0.01` is not a scale validator. Both DTOs and the service check range only, while EF config stores decimal(18,2). There is no explicit pre-save rounding/rejection in this writer.
- Impact: input can be accepted then changed by database conversion rather than a documented domain rule. The chosen reject-versus-round policy is a material contract question and is unresolved; do not silently pick it during implementation.
- Recommendation: freeze the intended rent input precision/rounding rule; apply it consistently in backend attributes/service and typed UI controls. If exact decimal(18,2) input is approved, reuse NonnegativeStoredDecimalAttribute/IsRepresentable; if rounding is intended, perform it explicitly in this domain before persistence.
- Authority: BE18 precision boundary; BE8 shared stored-decimal input validation. No migration/data rewrite is recommended for this issue.

## Observed contracts and matched behavior

### Grid, filter, ListVM and export

| Contract | Current source |
|---|---|
| Display columns | `no`, `quotationType`, `date`, `contactName`, `customerCode`, `internalApproval`, `customerApproval` (`list.component.ts:287-296`) |
| Identity/actions | Id plus CanEdit/CanDelete/CanApproveInternally/CanRejectInternally/CanApproveByCustomer/CanRejectByCustomer/CanRevise/CanUnapprove/CanCreatePurchaseOrder/HasPurchaseOrders; all consumed by actions. QuotationListVM adds no feature-specific unused columns. Inherited ListBaseVm plumbing is known BE19 debt6, not a newly discovered feature-only DTO problem. |
| Search fields | `quotationNo` (trimmed substring), partnerId (backend also accepts legacy customerId alias), branchId, dateFrom/dateTo inclusive DateOnly bounds, internalApproval/customerApproval only for defined enums; reserved `grid` retained end-to-end |
| Filter state | Typed form; default current month and current branch; date range validator; Reset clears grid and reapplies month; URL roundtrip through shared read/writeListRoute; search applies snapshot; sort/paging/export reuse snapshot |
| Sorting | Every displayed column supported; Date default descending; Id tiebreaker in same direction |
| Count/page | Same query filtered before CountAsync, corrected page, Skip/Take and TotalCount/TotalPages. Backend defaults5/caps200; UI default shared10 and options10/15/20/50/100. The 5/200 backend override differs from BE9's canonical10/100: record as contract drift, not a claimed performance fix. |
| List replacement | Subject/switchMap/defer; previous HTTP unsubscribed before replacement, paired finalize, DestroyRef teardown; false and transport failures clear rows and give Retry |
| Export | fetchAllPages pageSize200; translated shared dataTableExportRows; complete traversal or failure, no partial download path; Q2 filter defect and Q4 missing global lease apply |
| Refresh after mutations | Authoritative re-read, no local merge that could violate filter membership; last-page correction exists on both server and client |
| Embedded PO detail | Uses existing PurchaseOrderDetailsComponent; parent forwards source ID only on create with AssetPO initial type; parent guard delegates dirty/saving/cleanup ownership, no duplicated PO editor |

### Header, rows and actions

- Client-owned header inputs: Date, Period, PartnerId, ContactId?, BranchId, SalesPersonId?, QuotationType, Notes?, HoursAllowed?, MobilizationCharges?. Detail inputs: EquipmentTypeId, CarModelId, Units, Description?, PeriodMonths?, RentWithoutOperator?, RentWithOperator?; update adds header/retained-child Id. No tenant, No, approval or audit fields in frontend payload.
- Backend overrides own Date/Period/trimmed text, new Pending/Pending, rejected-edit reset to internal Pending and cleared reason. Mapper ignores tenant, No, approval and child ownership. Current rejected APIs do not accept a reason; null body and confirmation match current contract. Do not invent a required-reason endpoint from another quotation type.
- Header FK validation: tenant/live Repository Exists for customer Individual/Company, branch, optional staff; contact must belong to that customer. Distinct detail equipment/model IDs checked by count equality. Unit/range/text/type/date rules run before graph changes. All current child IDs must be unique and owned by the tracked quotation before mapping. Omitted children are passed through Repository.DeleteRange and removed; DbContext soft-delete handling remains owner. New children take entity tenant and QuotationId.
- Current state tuples: editable/deletable = customer Pending plus internal Pending/Rejected. InternallyApprove/InternallyReject = Pending/Pending. CustomerApprove/CustomerReject/Revise = Approved/Pending; Revise targets Pending/Pending. Unapprove = Approved/Approved -> Approved/Pending. Create PO = Approved/Approved. Rejected customer tuple has no revision action; legacy enum Revised=3 is displayed but no current action produces it. Those are current behavior, not newly approved business decisions.
- Internal approval revalidates readiness. All mutations check current header state and catch DbUpdateConcurrencyException. Both approval axes are EF concurrency tokens (`QuotationConfig.cs:20-25`), so simultaneous status updates do not silently overwrite one another. No client version token protects concurrent same-state form edits; lost-update expectations remain unresolved rather than claimed solved by status tokens.
- Delete explicitly marks live details deleted/inactive with timestamp. This matches the owned-child soft-delete concern in BE19 backlog23; it is not a missing cascade here. Q1 remains about reference/dependency protection.
- Dirty exit uses shared confirmation, form freeze, id/version fences, teardown and beforeunload; Save disables form, handles false/HTTP failures, preserves draft, re-enables on failure, marks pristine and returns with query state on success. Save/confirmation guards prevent duplicate mutations. Request versions fence replaced detail/bootstrap responses; contact subject uses switchMap and customer/id/version checks.
- Backend generic Detail/List/Update/Remove lack cancellation tokens by the existing shared IService boundary (BE19 backlog27/D5-2); do not file a new per-service migration request. Client destroy/navigation cancellation does not prove server cancellation.

## Cache/read source inventory

All URLs below are relative to the configured Sigma API base URL. Exact environment hostname is runtime deployment data. Envelope is Results<DropDownSelect> unless specified.

| Actual URL and consumer | Classification / shared owner | Writer/notification evidence and consumer adoption |
|---|---|---|
| `Branch/GetSelect`; list and editor EquipmentQuotationService.getBranches | Approved reference, BranchService -> BaseService.readReferenceSelect -> ReferenceLookupCacheService | Successful typed Add/Update/inherited Delete invalidate; tenant lookup-branches topic. Finite success assignment and Retry exist. No active watch/context clearing: Q3. |
| `Customer/GetSelect`; list and editor getPartners | Approved reference, CustomerService -> same shared cache | Company/Individual successful writes/deletes and positive import rows invalidate; lookup-customers topic. Finite success assignment/Retry and initial saved-label merge exist; watch/context gap Q3. |
| `Staff/GetSelect`; editor getSalesPersons | Direct reference with no source opt-in | StaffService has no cacheSelect override; BaseService false default. Normal direct read; no watch expected. This review does not authorize opting it in. |
| `Equipment/GetSelect`; editor getEquipmentTypes | Direct reference with no source opt-in | FleetService constructor names Equipment, no cacheSelect override. Normal direct read; no watch expected. Do not confuse Vehicle/GetSelect's approved opt-in with this Equipment source. |
| `CarModel/GetSelect`; editor getMakesAndModels | Direct reference with no source opt-in | CarModelService no cacheSelect override; this consumer uses inherited GetSelect, not its GetMakeAndModel method. Normal direct read; no watch expected. |
| `Contact/GetSelectByCompany/{customerId}`; editor getContactsByCustomer | Direct contextual reference with no source cache seam | Feature HttpClient directly. Contact switchMap cancels replacement, clears choices/errors then validates customer/id/version; saved contact label merged only for current quotation customer; failure retains form contact ID and exposes Retry. No cache opt-in is inferred. Required page progress gap Q4. |
| `Quotation` GET / repeated export pages; Results<QuotationListVM>; `Quotation/GetByWithNavigationsId/{id}` Result<QuotationDetailsVM> | Direct operational document reads | No document data cached; authoritative list/detail and refresh, identity/version/cancellation logic as above. |
| `PurchaseOrder/search` POST `{equipmentQuotationId}`; Result<PurchaseOrderSearchListDTO[]> | Direct operational document association read | No reference cache; no active watch needed. Complete per-quotation result, no paginator. Component DestroyRef teardown and version/visible/source checks; retry/empty/errors/local StateMessage. It does not label read-only POST with NAVIGATION_READ_ONLY, but current parent conditional destroys the dialog on departure, so teardown remains the cancellation path. |
| local quotation type and internal/customer status enums | Local deterministic options, no HTTP/cache | No writers/watch/topic needed. Existing list duplicates translated item templates (known UI30 backlog39), editor uses translateOptions. |

Finite lookup HTTP failures are caught to null so forkJoin completes and displays one aggregate Retry; successful arrays are retained on retry failure. Editor merges saved labels on successful bootstrap/detail. Its existing includeSavedOptions cannot substitute for Q3's context-reset-aware watch behavior.

## Loading operation reconciliation

| Operation | Current owner/lifetime | Source result |
|---|---|---|
| List GET | global start within defer; end in finalize, switchMap/destroy cancel; effective page metadata visible | Matched in source; table and button suppress redundant indicator through shared owners |
| List required Branch/Customer bootstrap | boolean only, no ReferenceLookupStatus lease | Finding Q4; page may stop indicating after list completes |
| Routed detail GET | global start/end; local StateMessage suppressed by critical route CSS while shell overlay exists | Matched visible-owner source wiring; runtime acceptance pending |
| Create five-lookups / edit five-lookups / contextual contact read | boolean only; forkJoin/version/destroy and contact switchMap fences | Finding Q4 missing global lease; retained cache refresh would be silent after proper binding |
| Save / six domain actions / Delete | global start/finalize; saving/confirmation guards and DestroyRef | Matched lease pairing; domain dependency defect remains Q1 |
| All-page export | exporting boolean/finalize only | Finding Q4; needs one lease around the entire read |
| Associated PO dialog POST search | global lease plus local StateMessage; CSS suppresses shell while local dialog progress exists; no second table loader | Finding Q4: unnecessary global lease; keep local dialog owner. Body-appended EditorDialog evidence at shared template:16 |

Actual visibility, overlapping requests, query-only URL updates, aria-busy accessibility and browser timing remain owner verification, not claimed accepted from source.

## Performance/query/index evidence

| Trigger/path | Source boundary, scope and potential work |
|---|---|
| List initial navigation | Two independent finite filter lookups plus one operational list request; cache hits/coalescing may eliminate source HTTP for the two approved sources. List SQL has CountAsync and bounded scalar page ToListAsync; HasPurchaseOrders is an in-query correlated EXISTS with explicit tenant/live/quotation predicate, not one network request per row. Q2 stops filtered reads before this materialization. |
| Editor create | Five independent forkJoin lookups; contextual contact read only after customer selection. Synthetic of(null) starts a meaningless short detail lease; no detail HTTP. |
| Editor edit | Detail and five initial lookups start independently; detail hydration triggers one customer-contact request. At most seven read subscriptions before cache effects. Header/details loaded AsNoTracking with four header references, one child collection, equipment/model joins; one collection avoids a sibling-collection Cartesian multiplier but reads full entity columns for this narrow DTO. Projection is a candidate if measurement supports it; do not claim measured speed from fewer Includes. |
| Save | Validation: required customer+branch, optional staff+contact serial Exists; two distinct-FK count queries; update first loads tracked parent/live rows. One aggregate SaveChanges, with per-added-row numbering inside UOW. Root document sequence still reads fresh policy/counter; unsupported child CodeCreateService resolver returns ticks fallback before settings read, so no per-child settings query is implied. No parallel EF on one DbContext is recommended. |
| Actions | Current ChangeApprovalAsync loads detail rows for all five transitions even though only internal approval validates details. Header-only transitions could avoid child Includes; bounded source optimization candidate, measured impact unknown. Unapprove loads header only. Preserve Q1 dependency guards when optimizing. |
| PO dialog search | Dedicated spec filters EquipmentQuotationId and applies tenant/live repository scope, then ProjectTo and one ToListAsync. Result is complete/unpaged per quotation. Spec includes Supplier/Job/Vehicle/details; actual SQL may remove unused Includes under projection, so no claim of entity overfetch without SQL evidence. Result-volume/payload growth needs owner measurement. |
| Complete export | Serial fetchAllPages at200 per page, reuses CountAsync on each list call; total work grows with number of pages. Preserve complete-output/failure semantics. Server default/max differs from canonical10/100; changing cap is a compatibility change, not an automatic optimization. |

Existing index declarations were checked in QuotationConfig/QuotationDetailConfig/PurchaseOrderConfig and the read-only DbContext model snapshot. Deployed migrations/indexes/statistics/actual plans were not checked. Current Quotation indexes: PK Id; FK indexes BranchId/ContactId/PartnerId/SalesPersonId; Date; (InternalApproval,CustomerApproval); unique (SubscriptionId,No), SQL null-No filter only in snapshot. QuotationDetail has (SubscriptionId,QuotationId) plus FK support. PO has (SubscriptionId,EquipmentQuotationId) and FK index EquipmentQuotationId.

| Query / candidate | Benefit hypothesis / existing overlap | Cost, semantics and disposition |
|---|---|---|
| Quotation default current-tenant date-desc list: proposed nonunique `(SubscriptionId ASC, Date DESC, Id DESC)` | Align tenant equality and date range/order; existing Date lacks tenant prefix, unique tenant/No cannot supply date order. Branch default may make `(SubscriptionId,BranchId,Date DESC,Id DESC)` more selective; pick one only after real plan/cardinality comparison. No INCLUDE initially: avoid covering all DTO joins/flags without evidence. | Additional write/storage/sort maintenance; overlap Date. Predicate currently IsDeleted != true includes false/null, so no `[IsDeleted]=0` filter is proposed. Proposed only; owner actual SQL/plan/read IO/timing determines keep/reject and overlap treatment. |
| PO associated existence/search | Existing `(SubscriptionId,EquipmentQuotationId)` already aligns equality and related lookup. | No new index justified without plan/cardinality evidence; retain existing declaration. Adding live-only duplicate would risk overlap and null semantics. |
| Quotation children detail/reconciliation | Existing `(SubscriptionId,QuotationId)` plus parent FK supports owned lookup. | No new index justified from this source inspection. |

No uniqueness/filter change for document No is proposed: generated financial/document numbers are server-owned and historical reuse is a separate contract; do not mechanically reuse soft-deleted number uniqueness rules intended for reusable reference names.

Reproducible owner check: same authenticated tenant, branch, month, filters, language, dataset/row cardinalities, page size and sort; capture at least cold-cache and warm-cache navigation/list/edit runs, request count/order/payload, detail line count and associated-PO count, SQL command count/duration/read IO/actual plan, then rendered-ready time. Separately time filtered list+count, one-page versus complete export and create/edit save with1/20/200 lines. Keep browser/network/cache state and sample distribution consistent before/after; currently no changes were applied, so before/after measured speed is not available. Reproduce Q1 with live linked dependents, Q2 with each of the seven column filters and matching export, Q3 with source writes/import/context reset, Q4 with deliberately slow last lookup/contact/export, and Q5 only after the owner freezes reject-versus-round. All timing/SQL-plan checks are pending owner authorization/execution.

## Unresolved decisions and final bounded reconciliation

- Keep the currently distinct internal/customer approval axes unless the owner explicitly approves a migration. Current reasonless reject/unapprove requests are factual contract; shared unified-approval policy adoption, reason/history shape and legacy Revised-state treatment need an exact feature decision. Their absence does not authorize guessed endpoints or state changes.
- Freeze rent scale handling and concurrent same-state edit expectations before implementing those policy changes. The confirmed projection/loading/cache/dependency findings can be planned independently, preserving current API shape where possible.
- PO context is document-wide association, not source-line conversion; BE14 explicitly permits quotation context on a document. Do not remove EquipmentQuotationId by copying PR-to-PO detail provenance rules.
- Reference shapes/cancellation/dirty/date-payload/child-ownership contracts are source-matched as noted; Q1–Q5 and backend paging drift remain open. Source review establishes neither compiled correctness nor runtime acceptance. Only this Draft notes file was written. Root owns final module reconciliation, shared dependencies, user-facing summary and the authoritative review outcome.

## Owner-authorized Slice A implementation — 2026-10-27

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Frozen contract | `reviews/EQUIPMENT_RENTAL_MAINTENANCE_EVOLUTION_PLAN.md`, Slice A |
| Owned application file | `SigmaBackend/SiGma.Business/Services/VouchersServices/QuotationService.cs` only |
| Remaining source integration limitation | PurchaseOrder's approved-reference writer does not acquire Quotation lock; concurrent create versus reversal remains possible until its participation is explicitly authorized |

The owner subsequently authorized implementation after the rental-cycle research
and Freeze. This agent changed only the owned Quotation service plus this notes
artifact. No mapper, DTO, frontend, vocabulary, guide, shared source, approved
reference, EF configuration, migration or snapshot was changed by this agent.

### Correction to initial Q2 diagnosis

Preimplementation dependency inspection established an **earlier** failure than
the initial Q2 explanation: `ListBaseVm.Id` is `int?`, while the then-current
generic `Service.ApplyGridFilters` required exactly `int` and threw
`GridFilterUnsupportedField` before calling the also-missing AutoMapper map.
Consequently the initial description of the first failing operation as a map
resolution was inaccurate. Both incompatibilities were real; the implemented
feature filter hook and explicit scalar projection avoid both. Root separately
owns the generic nullable-Id correction in `Service.cs`; this agent did not edit
that shared owner.

### Implemented contract reconciliation

| Concern | Implemented source | Evidence / preserved behavior |
|---|---|---|
| Quotation write boundary | `QuotationService.cs:29`, `:57`, `:125`, `:262`, `:303` | Add/Update/Delete/Unapprove and five shared approval transitions acquire existing tenant-scoped `ExecuteUniqueWriteAsync<Quotation>` before reads, validation and Save. No new lock service or database schema. |
| Authoritative dependency guards | `:66`, `:134`, `:270`, `:315-316` | Update/Delete/Unapprove/Revise reuse `InUseAsync<Quotation>(id, quotation => quotation.Details)`. Owned details do not block their parent. Existing EF live referencing rows block through shared localized RecordInUse feedback; no competing hand-written blocker list/message. Current explicit source FKs are PO.EquipmentQuotationId and EquipmentMasterAgreement.QuotationId. |
| List eligibility | `:235-244` | CanEdit/CanDelete/CanRevise/CanUnapprove retain current state predicates and additionally require no live PO/MA. Other action flags retain their current rules; same two-axis enums/API/target tuples, pricing and numbering remain. |
| Exact scalar grid projection | `:216-248` | One explicit `GridFilterProjection` projects actual seven columns plus identity and current action-state fields. Page materialization at `:200` calls that same owner. No AutoMapper list map or fallback placeholder projection is required. |
| Display alias | `:205-213` | Shared GridFilter remains parser/validator. Server-owned `no` expression follows the current UI's nonempty-No/Id text fallback. ContactName and CustomerCode use the actual navigation expressions; enum/date values remain native scalars. Nullable Id membership is safe without changing the DTO contract. |
| Filter/count/page/export | `:183-202` | Existing filters and shared encoded grid constrain SQL before CountAsync, deterministic sort, corrected page and bounded page projection. Existing all-page export continues through this same endpoint; no in-memory result filtering or extra HTTP operation introduced. |
| Performance | `:218-224` | Two tenant/live reference query roots become correlated SQL Any expressions for PO and MA. No per-row materialization, network loop, cached action flags or parallel EF is introduced. Existing PO(SubscriptionId,EquipmentQuotationId) coverage remains; root owns MA index evaluation. Actual command/plan/render measurements remain pending. |
| Namespace/type | source imports and existing declarations | Added actual EquipmentMasterAgreement namespace `SiGma.Helpers.Models.Agreements.Equipment` and `System.Linq.Expressions`. Existing global usings supply PurchaseOrder/IQueryable/Result; no hypothetical entity/DTO was created. |

### Concurrency boundary and residual limitation

`ExecuteUniqueWriteAsync` acquires a SQL transaction-owned application lock keyed
by entity full name and authenticated tenant. Its existing owner commits only
successful writes and rolls back its own failed scope. Root is integrating
MasterAgreement participants under Quotation → SalesAgreement → MasterAgreement
ordering. Once those participants are integrated, agreement creation/relinking
and guarded source changes serialize through that common Quotation boundary.

The approved-reference `PurchaseOrderService.AddAsync` still acquires only
`ExecuteUniqueWriteAsync<PurchaseRequest>` and checks the quotation inside its
create pipeline. It can read both approvals before a simultaneously running
quotation reversal commits, then insert its link afterward. Existing sequential
live PO guards are implemented, but a global concurrent-creation invariant is
**not** claimed. Root explicitly kept that reference file outside this agent's
mutation scope and will report this exact residual integration work. No claim
is made that a status concurrency token protects insertion of another table's
row or that UI flags supply write authorization.

### Source verification and remaining items

- Reviewed the entire scoped service diff against the frozen inputs/actions,
  current EF reference declarations, shared InUse implementation, lock owner,
  current response model and actual list columns/filters. No new API shape,
  approval rule, money policy or schema was introduced. `git diff --check` on
  the owned service completed without whitespace defects (Git reported its
  existing LF-to-CRLF normalization advisory).
- Q1 is source-corrected for sequential dependency guards and participating
  Quotation/MasterAgreement writes; the PO concurrent participant limitation
  above remains explicit. Q2 has an implemented feature projection/filter path;
  root owns shared generic Id handling and final integration review.
- Q3/Q4 frontend source adoption is assigned to root/other owners; this agent
  has not claimed those fixed. Q5 exact-rent rejection/rounding remains unfrozen
  and unchanged. Backend default/max page-size drift remains unchanged.
- No build/test/lint/browser/database commands ran. Owner acceptance must cover
  each of seven grid fields (including numeric0 enum values), empty/compound
  rules and filtered complete export; live PO/MA blockers for all four guarded
  actions; deleted dependents; ordinary legal transitions with no dependencies;
  same-tenant parallel quotation/agreement mutations; and the separately
  unresolved quotation/PO creation race. Measure SQL command count/plan/IO and
  comparable cold/warm durations before attributing speed gains to this source
  refactor.

The routed writer inventory was also reconciled against the complete generic
controller: single POST/PUT/DELETE plus inherited `handleActivate`, and the six
feature state POSTs. No AddList/UpdateList or bulk-delete endpoint is exposed by
this controller. IService's inherited bulk method surface remains unused by the
current feature controller and was not silently presented as hardened. Inherited
activation changes IsActive; live dependency checks use IsDeleted and cannot be
released by that toggle. The feature `UpdateCoreAsync` correctly overrides the
existing protected virtual hook, preserving base namespace/signature contracts
instead of hiding the inherited method.

## Owner follow-up — quotation tabs, 2026-10-27

Tier S presentation slice, authorized: split the existing quotation editor into Basic quotation details and Equipment/prices tabs. Frozen local contract before source edits: reuse shared EditorTabs, keep the one typed parent form and child identities, retain both panels in the DOM to preserve form/mock state and print every section, show only the active panel on screen, preserve Save/Cancel/approval/API/financial rules. Invalid Save activates the owning tab before focus; empty required lines activate Items. Disable tab changes during saves and confirmations. Initialize Basic only on actual record initialization. No additional tab reads, queries, cache sources or schema changes.

Applicable type02 routed document editor / existing backend pattern2, UI1/13/14/22/27/29 and Master1/5/7; Phase03 packet after all8 recipe Check passed. Shared EditorTabs and Workshop Job editor inspected as owners/references, not modified. Speed analysis chapter6 and original S182 (Define and handle Quotations) confirm header plus multiple vehicle lines and single Save; leasing prices are excluded and no external layout is copied. Compare existing Equipment Rental guide; update it at handoff. No independent workstreams warrant subagents for this small coupled template/focus change. Source-only verification; no build/test/browser/database/migration authorization inferred.

Implemented and reconciled: existing `pages/routing.ts` -> `EquipmentQuotation/equipmentrental.routes.ts` -> routed `components/details` uses shared EditorTabs with translated Basic / Equipment and prices, stable tab/panel IDs, role/label/keyboard ownership and guarded switching. One form and its complete detail snapshot remain mounted. Shared screen-hide / print-block utilities show one panel during use and both during printing; existing print height/overflow releases remain. The header panel now fills the body instead of reserving40%, while the item table retains the bounded sticky/scroll chain. Invalid Save inspects the actual form, activates Basic before header focus or Items for invalid/missing lines; row description now has a stable focus ID. Mode/record initialization resets Basic; tab navigation never resets values or requests data. Save, discard, approval and source linkage are unchanged.

Files changed this follow-up (frontend repository only): quotation `details.component.ts`, `.html`, `.scss`; bilingual `i18n/vocabs/en.ts`, `ar.ts`; `UserGuide/content/equipment-rental-guide.ts`. No backend, entity, AutoMapper, DTO, grid, filter or financial calculation change. No migration required for tabs. Phase03 and bounded Phase05/06 source integration applied; backend/action phases skipped because their contracts are unchanged.

Loading/cache reconciliation for the touched editor: existing `loadingPage` and Save pair subscribed page LoadingService start/finalize; required lookups/contacts use the single page ReferenceLookupStatus, whose page default lease renders through Layout (no route showPageLoading=false). Body panels contain no subscribed child reads; hiding a panel is not claimed as lazy loading. Busy/error/Retry and destroy/context/version cancellation remain outside the tab panels. Branch/GetSelect and Customer/GetSelect use their opted-in BranchService/CustomerService shared cache, successful finite bootstrap followed by separate ReferenceLookupBindings watches, selected-label retention, successful-writer/import invalidation and auth/tenant/language/realtime context clearing/teardown. Staff/GetSelect, Equipment/GetSelect (FleetService) and CarModel/GetSelect have no source cache opt-in and retain documented direct reads. Contact/GetSelectByCompany/{customerId} and Quotation/GetByWithNavigationsId/{id} are direct operational/customer/detail reads; no caching added. Same-path query navigation retains shared pending progress. Existing bootstrap/read contracts were not moved to tabs or duplicated. Source presentation conforms; rendered loader/keyboard/print visibility and live invalidation remain owner-runtime checks.

Performance/query/index disposition: tab changes call only activeTab.set; zero new requests, joins or per-row reads, same response volume and form rows. No new index is justified by this presentation-only change; existing query/index recommendations in the owning full-stack review remain. Retaining both panels preserves draft/printing, and is not claimed as a measured rendering improvement. Owner should compare cold/warm opening of the same quotation with1/20/200 lines, identical network/viewport, request count/payload and render time; verify repeated tab switches issue no requests. Runtime timings/SQL plans pending, no measured speed claim.

Verification: scoped TypeScript/Angular source parsing passed; final four touched TS files have zero syntax diagnostics, the quotation template has zero parse errors, and bounded no-emit guide/model semantic analysis has zero diagnostics. Earlier bounded module source parser also passed82TS/24external/2inline templates. Scoped Git diff/whitespace reviewed in the actual frontend repository, preserving prior unrelated working-tree changes. Source utilities show print-block after screen-hide at equal importance, and the shared tablist provides RTL arrow/Home/End behavior. Application build and rendered responsive/RTL/theme/print/focus acceptance remain pending for the owner. No builds, tests, lint, browser, database, migrations, snapshots, commits or pushes run.

Guide handoff: updated the quotation topic in `UserGuide/content/equipment-rental-guide.ts`, existing `/UserGuide/equipment-rental` reader/menu. Explains tab fields, retained draft, whole-form Save, automatic invalid-tab activation, View and full printing. Owner checks: enter header and several rows, switch both ways without loss; Save with invalid hidden header then invalid/missing lines; cancel a row-removal/discard decision; verify View, both languages, short-height/narrow layouts and printing from either tab. Suggested frontend commit only: `Split equipment quotation editor into shared tabs`.
