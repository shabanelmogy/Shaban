# Sales Fleet current source-review contract — 2026-10-26

## Frozen confirmed-fix execution amendment — 2026-10-26

Status of amendment: Implemented — source-only. FL26-01/02/03 source-reconciled; final syntax/whitespace and bounded peer audit passed. Owner runtime/visual/timing acceptance pending; FD26-01/02 remain open decisions.

Owner now requests fixing the reviewed findings. This amendment authorizes application implementation of FL26-01/02/03 only, superseding the review-only execution status below for those findings. UI type02/BE14, current API/payload/financial/lifecycle/cache and applied-query contracts remain Frozen. FD26-01 Reserved inactivity and FD26-02 exact text lengths remain decisions, not authorized invented rules. No backend/schema/index change required.

- FL26-01: react to distinct routed mode/ID changes; cancel previous detail/finite lookup reads before resetting record-owned state, forms/children/errors/exit flags and saved-label merge state; bootstrap the new matching unit. Keep one component-lifetime Branch watch, finite bootstrap and dirty/write/upload guards. Query-only changes never reset the draft. Matching failed-detail Retry remains safe. Peer reconciliation: if a successfully completed discard exit is cancelled/errored by a later navigation guard, rehydrate the existing saved/new record and reset the finished-exit flag; accepted discard must not leave deleted temporary paths/disabled stale form behind. Cancelled discard consent itself retains the draft. Distinguish this discard recovery from a successful Save/Delete terminal exit; never turn a cancelled post-create exit into a fresh writable Create form or reload an already-deleted record.
- FL26-02: explicitly serialize Fleet's applied tri-state isActive as the string true/false or absent in its existing routeParams seam. HTTP/filter state stays boolean; avoid changing the generic serializer's compatibility contract for unrelated screens.
- FL26-03: acquire the existing page LoadingService count inside subscribed defer for discard cleanup and cleanup-only retry, release in finalize on success/error/cancel/destroy. Keep the original successful Equipment Save once, original exit destination, retained files and busy/error/Retry. No local loader, shared tracker redesign or new endpoint.

Read Master5, UI10/13/18/22/28 and actual shared LoadingService, DocumentUploadTracker, form/route helpers and Workshop Job editor; all8 recipe checks passed again before Phase02/03/05/06. Root owns these coupled editor changes and the tiny list serializer change plus guide/reconciliation; no agent implementation split because route/discard/cleanup share one file/lifetime and remaining list edit is one bounded seam. A later bounded read-only peer audit may inspect the finished lifecycle while root updates artifacts. Source-only execution/migration boundaries remain unchanged.

| Concern | Frozen review boundary |
|---|---|
| Mode / tier | Source-read-only, tier M; application/config/instructions untouched; artifacts only |
| Scope | Active Sales `/Fleet` list/create/view/edit and legacy details redirect; directly consumed Equipment APIs, catalog sources and guide; not the separate `/FleetVehicle` module |
| Evidence | Current source and existing Frozen SALES_CYCLE / SALES_REVIEW_FIXES / SALES_CURRENT_REVIEW contracts; no new screenshots or business requirement |
| UI / backend shape | Type02 routed aggregate editor (Documents and Warranties); BE14 master-detail, no Fleet Save accounting effect |
| References | UI4/6 Workshop Job list; UI1/13/14 Workshop Job editor; actual shared EditorTabs, EditableCollectionTable, FileField, FieldError, ReferenceLookupStatus/Bindings; BE14 PurchaseOrder aggregate conventions |
| Discovery | Actual pages/routing `/Fleet` import → Fleet_Routes → FleetComponent / EquipmentDetailsComponent inspected; all8 recipe checks passed |
| Pending source changes | Four Fleet component files and Sales guide already dirty from authorized prior work; preserve them. EquipmentService has previous grid-forwarding change. No finding assumes a clean baseline |
| Execution | No builds/tests/lint/typecheck/browser/app/DB/migrations/snapshots/commits/push/deploy/Graphify/Sigma MCP |

## Frozen consumed API and state contracts

- GET Equipment: typed Results<EquipmentDTO>; fixed filters plateNo, chassisNo, interiorColor, branchId, carModelId, vehicleTypeId, isActive, saleStatus; encoded grid, whitelisted sortField/sortOrder; pageNo/pageSize with Count/TotalPages and page clamp. Search defaults active, every sale status; all-pages print/Excel reuse applied query, size100, fail rather than emit partial output.
- Grid order: shared Actions first, plateNo, make, model, vehicleType, interiorColor, isActive(status), saleStatus(status), branch, chassisNo, engineNo, purchaseDate(date), purchaseCost(money). Backend EquipmentListVM has matching PascalCase properties plus Id only.
- GET Equipment/GetByWithNavigationsId/{id}: Result<EquipmentDetailsDTO>; scalar identity/reference labels, branch/make/model/type, vehicle/purchase fields, server SaleStatus, full Documents and Warranties. POST/PUT Equipment: editable fields only (branchId, plateNo, carMakeId, carModelId, year, chassisNo, engineNo, engineCapacity, interiorColor, fuelTankCapacity, vehicleTypeId, isActive, purchaseDate, purchaseCost, documents, warranties); Update adds root id, retained children carry id. No client tenant, accounting or saleStatus write.
- DELETE Equipment?id and inherited activation preserve current backend dependency/lifecycle/tenant protection; UI delete only Available. Catalog writes POST CarMake(name) / CarModel(name,makeId), followed by selectable saved catalog result; no new catalog workflow.
- Documents/Warranties remain full snapshots, missing rows removed and retained IDs ownership-validated. Required make/model/plate and existing purchase/warranty/date limits are reviewed against actual backend; no business-rule invention.
- List/create/view/edit route query state, explicit View read-only, dirty discard and write/upload busy protection are current contract. Sold/Delivered state/cost authority stays with existing Sales cycle; ordinary Fleet Save does not reserve/invoice/deliver.
- Cache eligibility comes from real producer opt-in, not GET names. Approved Branch choices require finite bootstrap plus shared watch; CarMake/CarModel/VehicleType without opt-in remain direct. Equipment/availability/state and uploads stay operational. Record every actual consumed URL, producer and writer/topic evidence in the review.
- Loading: required routed bootstrap and page/list/detail/save/delete/output reads use one visible page owner; nested catalog/dialog reads local when covered; retained cache refresh silent. Trace actual subscribe/finalize/cancel and rendered shell. Runtime remains pending.

## Review allocation / handoff

Root owns manifest, contract decisions, list/wiring/cache/loading/layout source chain, integration, artifact and final reconciliation. Independent read-only backend audit owns Equipment service/VM/profile/entity/config/dependencies, query/index/lifecycle; independent read-only editor audit owns Fleet detail TS/HTML/SCSS, form/payload/file/catalog/exit behavior. They may read related owners but never modify application or artifacts, run prohibited commands, or redefine contracts. Return actionable current defects with exact file/line, reproducible trigger, impact and book rule; do not repeat resolved historical findings. No implementation authorized by this freeze.
