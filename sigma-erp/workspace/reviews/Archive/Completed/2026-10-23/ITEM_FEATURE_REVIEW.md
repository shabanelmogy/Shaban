# Item feature review

| Status | Implemented — source-only |
|---|---|
| Owner verification pending | yes |
| Date | 2026-10-04 |

## Manifest and evidence

Request: «راجع : src\app\modules\Stock\Item وعدل المطلوب طبقا للوثائق». Implemented the confirmed existing Item workflow and its directly related API/import contract. Historical screenshots are content evidence, not instructions or layout authority. Contracts and evidence were frozen before implementation in [ITEM_DOMAIN_API_CONTRACT_FREEZE.md](<../../../ITEM_DOMAIN_API_CONTRACT_FREEZE.md>); the report slice was planned before implementation in [ITEM_MAINTENANCE_EVOLUTION_PLAN.md](<../../../ITEM_MAINTENANCE_EVOLUTION_PLAN.md>). Append-only contract addenda record later report, duplicate-feedback and numeric-default decisions.

| Manifest item | Selection |
|---|---|
| Frontend root | `F:/My Work/Sigma/SiGmaAngularFrontEnd` — `src/app/modules/Stock/Item`, ItemService-only Layout registration edits, item translation blocks |
| Backend root | `F:/My Work/Sigma/SigmaBackend` — Item VMs/config/profile/service and Item-only ImportDataService slices |
| Existing working tree | Many changes already existed, including earlier UnitsOfMeasures/ItemType work and unrelated Sales/Workshop/shared changes. Preserve them; no cleanup or reset. Existing migrations/snapshot changes are outside this task and were not edited. |
| UI shape | UI screen01, fields-only list plus Create/View/Edit modal; no child collections, tabs, totals or posting |
| Backend shape | BE pattern1, ordinary entity using inherited service/controller reads/writes, feature uniqueness and dependency-aware delete hooks |
| Canonical references | Job list for shell/filters/grid/query/export; VehicleService details for EditorDialog/modes/discard/lookups; IndividualPartner and shared validation helpers for advisory uniqueness; BranchService and shared service for backend hooks |
| Routes | `/Item` owns modal modes; legacy `/Item/create` and `/Item/details/:id` redirect to list intent |
| Endpoints | GET `/Item` → `Results<ItemListVM>`; GET `/Item/GetByWithNavigationsId/{id}` → `Result<ItemDetailVM>`; POST/PUT `/Item`, DELETE `/Item?id=...` → existing Result; inherited `/Item/GetSelect` and `/Item/CheckUnique` retained |
| Actions | Search/reset/page/sort/retry, Create/View/Edit/Save/Cancel/discard, dependency-aware Delete, full filtered Excel export, read-only catalogue report/print |
| Authorization | Existing AuthGuard, interceptor and request tenant mechanism retained. No feature permission codes invented; visibility is not authorization. |
| Exclusions | New Item–CarModel relationship, valuation/balances/accounting formulas, numbering-format changes, historical data backfill, shared owner refactoring |

Screenshot metadata: English LTR desktop; list approximately 1696×567, editor approximately 454×430. Date/version/role/acceptance Unknown.

| Evidence | Explicit content | Uncertain/Missing and treatment |
|---|---|---|
| `C:/Users/user/Desktop/Stock/Items/1.PNG` | Items/Manage Items/Add Item; No, Name, Type, Supplier Item Code columns; No/Name/Type/Make and Model/Supplier Code/Barcode filters; View/Edit/Delete; paging, Export, Report | Make/Model relationship Missing in source: excluded pending persisted-scope decision. Report contents Uncertain: minimal same-filter catalogue chosen under Master2 owner standing rule. Old styling/page10 is not design authority. |
| `C:/Users/user/Desktop/Stock/Items/2.PNG` | Type, Name, Barcode, Supplier Code, Price, Maximum Quantity, Stock Branch, Notes, Save/Cancel | Red underline does not prove required rules; current form/API evidence governs. Existing optional UoM retained despite screenshot omission. No invented defaults for historical rows. |

Optional clarification received no answer during independent work. No approval is inferred from preselected suggestions. Catalogue report is a labelled reviewer decision; Make/Model remains unresolved.

## Decisions and contracts

| Master4 decision | Final decision and evidence |
|---|---|
| Reference/editor/routes | UI01 fields-only modal, width760, shared default viewport bounds and two-column grid; no tabs/steps because no domain groups require them. Actual shared EditorDialog and VehicleService source inspected. One canonical list route; legacy links redirect. |
| Grid/ListVM | Actions first, then `id` number, `no` text, `name` text, `type` translated enum, `supplierItemCode` text. All five stored fields sortable and exported. Preserve legacy Id as correctly labelled identity and add actual persisted No. |
| Write/detail scope | Exact editable fields below; no SubscriptionId, audit, No or navigation object in client writes. Read nulls honestly and show backend relation names in View. |
| Style | Shared route/list/filter/DataTable/EditorDialog/grid/state/print owners only. Empty feature SCSS removed; no new feature stylesheet. Two columns selected through public grid variable. |
| Confirmation/dirty state | Confirm only Delete and dirty discard. Pristine/View closes silently. Save/validation/discard/printing guard their affected exits; successful mutations refresh applied list state. |
| Entity/base | Existing Item entity and tenant-owned base unchanged. No children or status transition fields required. |
| Business key | Existing import rejects duplicate Name and Barcode; extend to ordinary writes using UniqueColumns and matching live tenant indexes. Blank Barcode remains optional in ordinary CRUD, required by existing import template. Advisory UI check excludes current Id; serialized server write remains authoritative. |
| Required and lengths | Name trimmed/nonblank/max250 (existing Add contract); Update50 inconsistency removed. Type and StockBranch required from current form; defined enum/positive live FK enforced. Barcode max250 is reviewer decision for bounded index. SupplierCode/Note remain unbounded existing optional text. |
| Numeric fields | Price optional/nonnegative within existing decimal(18,2), quantity optional/nonnegative integer ≤2147483647. Keep existing Create defaults0; cleared values become null. JS Price must be finite and <1e16 because exact decimal maximum rounds to that boundary. No new rounding or calculation. |
| Enum | Exact persisted values Battery0, Tyre1, BodyPart2, Electrical3, Mechanical4, Consumable5, Cushning6, SheetsForCars7, Walls8. Display Cushioning label, retain stored symbol. ItemType master/category is a different domain. |
| FK/delete | Shared backend live-tenant reference validation for Branch and optional UoM; UI rejects unavailable current selections. Delete uses RemoveWithChildrenAsync, no owned children/cascade. Inventory verified below. |
| Filter/paging | Five source-supported property filters before count; zero Type preserved; page default15, choices10/15/20/50/100, maximum100; inherited newest Id default, explicit stored-field sorting. Route persists applied values. |
| Registration/errors | ItemService root only/environment.baseUrl; remove its redundant Layout providers. Reads opt out of global error presentation and own retry; mutations use existing global interceptor. Cancellation/finalize releases loading. |
| Report | Same complete filtered/sorted five-column catalogue through existing paged read API, no new backend endpoint/formulas. Shared print session/dialog; snapshot on opening, disabled until all pages succeed. Inventory/valuation report alternatives lacked evidence. |
| Overrides/mapping | Only UniqueColumns and RemoveAsync feature overrides. Four one-way CRUD maps; retained import-only ignore rules for manually resolved Branch. No reverse read-to-entity mapping. |
| Migration | Owner must generate/review/apply migration for constraints/indexes. No migration/snapshot edits by this task. |
| Maintenance/children/calculations | Frozen plan for report/current behavior. Child snapshot/VAT/domain totals Not Applicable: Item is scalar master data with no monetary aggregate or posting state. |

Grid/ListVM reconciliation:

| Grid/action need | Angular property/type | Backend ItemListVM property | Result |
|---|---|---|---|
| Identity/actions + retained ID column | `id:number` | `Id:int` | Confirmed |
| Item number | `no:string|null` | `No:string?` | Confirmed, persisted server value |
| Name | `name:string|null` | `Name:string?` | Confirmed |
| Type | `type:ItemType|null` | `Type:ItemTypeEnum?` | Confirmed, numeric lookup/translated display |
| Supplier item code | `supplierItemCode:string|null` | `SupplierItemCode:string?` | Confirmed |

Removed editor-only list fields BarCode, Price, MaximumQuantity, StockBranchId, UnitsOfMeasuresId, Note and inherited unused tenant/audit/state fields. Barcode remains a filter. Unused ItemFullListVM retired after exact-symbol scan; ItemDeleteVM and inherited GetSelect consumers preserved.

| UI filter | Angular/query key | Backend property | Parser/default |
|---|---|---|---|
| Item No | `no` | `No` | trimmed string; empty omitted |
| Name | `name` | `Name` | trimmed string; empty omitted |
| Type | `type` | `Type` | defined numeric enum; null omitted, 0 transmitted |
| Supplier code | `supplierItemCode` | `SupplierItemCode` | trimmed string; empty omitted |
| Barcode | `barCode` | `BarCode` | trimmed string; empty omitted |

toListParams/shared backend property binding own serialization. No boolean/date/multi-select filter applies. Search commits edits into a snapshot; paging/export/report use that snapshot, not unsubmitted filter edits.

| Control/view | Form type | Detail | Add/Update | Validation/ownership |
|---|---|---|---|---|
| ID/No | no editable control | Id/No | Id only on Update | server identity/numbering |
| Name | string | Name nullable | Name | required250, trim, advisory uniqueness, backend authoritative |
| Type | ItemType/null | Type nullable | Type | required defined enum; 0 valid |
| Barcode | string | BarCode nullable | BarCode/null | optional250, nonempty uniqueness |
| Supplier code | string | SupplierItemCode nullable | SupplierItemCode/null | existing optional text |
| Price | number/null | Price nullable | Price/null | finite/min0/storage bound; Create0 default |
| Maximum quantity | number/null | MaximumQuantity nullable | MaximumQuantity/null | finite/min0/int32 integer; Create0 default |
| Stock Branch | number/null | StockBranchId/StockBranchName | StockBranchId | required positive current live tenant selection |
| UoM | number/null | UnitsOfMeasuresId/UnitsOfMeasuresName | UnitsOfMeasuresId/null | optional positive current live tenant selection |
| Notes | string | Note nullable | Note/null | existing optional text |

View does not fetch current choices; names come from detail navigation mapping. Existing null required values render blank, and Edit requires an explicit selection. No backfill.

## Action and integration reconciliation

| Approved-reference action | Item classification | Evidence/reason |
|---|---|---|
| Job Create/View/Edit/Delete/Search/reset/page/sort/Excel | Supported | Same scalar catalogue operations, implemented with Item contract |
| Job Lubrication Create | Not Applicable | Item has no job subtype/aggregate |
| Job Labour Time | Not Applicable | Item has no labour log/state |
| Job Invoice Customer/Close/Print Gate Pass | Not Applicable | Item is not an invoiced/closed job document; catalogue print is a separate read workflow |
| VehicleService Save/Edit/Close/Escape/dirty guard/retry | Supported | Item fields-only editor shares shell/mode/exit rules |
| VehicleService service-item picker/select, add/remove parts/profiles, tabs | Not Applicable | Item has no service/profile/part child collections |
| Shared report Print/Close | Supported | Read-only catalogue, no Save or posting |

| Action | Source → target state / row flags | API/service/UI contract | Dependency, failure, refresh |
|---|---|---|---|
| Create/Update | new/live row → saved live row; no state flags | inherited AddAsync/UpdateAsync; POST/PUT Item; typed create/update; validated dialog Save | tenant/live FKs, serialized uniqueness/index; failure preserves fields, success closes and reloads |
| Delete | live row → soft-deleted row; no exposed status flag | ItemService.RemoveAsync→RemoveWithChildrenAsync; DELETE Item?id; remove + shared record confirmation | block live references, no cascade; failure retains row; success adjusts last page/reloads |
| Advisory check | edit/create value → availability feedback | inherited CheckUnique; shared uniqueFieldValidator(Name/BarCode, excludeId); blur + settleStepValidation before Save | no View calls; pending body inert; unavailable/duplicate feedback; final server check wins |
| Read/export/report | applied-query snapshot → complete authoritative read | GET Item; switchMap list/getAllList100; shared export and print | no partial report/export after failed page; errors retry; print route/Close guarded while printing |

Inbound delete dependencies inspected: ItemIssueItem, ItemReturnItem, ItemRequisitionItem, StockTransferItem, purchase request/order/GRN details, BillDetail, JobItem, JobEstimationItem, ServicePart, OpeningBalanceStock. OpeningBalanceStock scalar ItemId is a real EF FK in source/snapshot; no snapshot edit. Shared metadata owner handles these references.

| Inherited member | Target override | Justification |
|---|---|---|
| UniqueColumns | yes | confirmed Name/nonempty Barcode business keys |
| RemoveAsync | yes | dependency-aware soft delete, unlike ordinary base removal |
| reads/select/add/update/filter/paging/mapping controller methods | no | shared owner already provides correct normal-entity behavior |

| Route/dialog | Mode/details | Exit/provider/error owner | Parent refresh |
|---|---|---|---|
| `/Item` | list; create null ID; view/edit positive ID + detail | AuthGuard existing; CanDeactivate delegates editor/report; root ItemService | applied list state persists |
| legacy create/details | URL-tree redirect with query intent/itemId | no independent activated editor | canonical list handles intent |
| Item editor | initialized typed form; independent detail/lookup retries | dirty discard, pending/save lock, origin focus; read errors local, mutations global | success reloads, cancel leaves data |
| catalogue report | captured query, all five columns | canceled on destroy; local retry; shared printing cleanup/exit lock/origin focus | read-only, no mutation |

## Source conformance evidence

References were inspected before their applicable slices. Compared producer/consumer values below; runtime/visual acceptance is not implied.

| Concern/books | Actual owner/reference | Final consumer and compared values | Result |
|---|---|---|---|
| List bounds UI1/3/4/6 | Job list, styles.scss, FeatureTitle, FilterPanel, DataTable | ItemsComponent host sigma-route-host; page→panel→header/filter/table; mainColumns3, filltrue, action-first columns | Matched source |
| Dialog UI10/13/15 | VehicleService details, EditorDialogComponent | DetailsComponent width760, contentPaddedtrue, modecreate/view/edit, default maxWidth viewport−24/maxHeight viewport−24; shared two-column grid, one body scroll | Matched source-supported fields-only shape |
| Query UI2/8/28 | list-query/list-route-state, Job list | DEFAULT_PAGE_SIZE15, choices10/15/20/50/100; getAllList page100; shared fetchAllPages; zero enum not dropped; identical columns | Matched source |
| Controls UI16/19/27 | TranslateOptionsPipe/enumOptions/GetSelect/FieldError/NumericFocusDirective | ItemType0..8; optionValue id, relation optionLabel value; body overlay/search/clear; number fields native shared appearance | Matched source |
| Advisory checks UI12/19, BE8 | IndividualPartner, uniqueFieldValidator, settleStepValidation, CheckUnique | Name/BarCode blur, trim/excludeId/readiness gate, no View checks; Save settles before snapshot/body inert | Matched source |
| Errors/cancel UI22/28 | API error helper/LoadingService/interceptor | read skip header, business/HTTP errors, finalize, destroy cancellation; loading focusClose, failuresRetry, readiness field/action | Matched source |
| Report UI20/21 | ReportActions, ReportPrintService, shared print styles | report extends BaseComponentService; local loadingReport+global loading balance; sigma-dialog-print/sigma-report-print-dialog/sigma-print-flow; no pagination/lazy scroll during print | Matched source, print acceptance pending |
| BE normal entity BE3/5/8/13 | shared service and BranchService | four one-way CRUD maps, explicit VMs, UniqueColumns and safe delete only; inherited routes unchanged | Matched source |
| Import BE8/9 | existing ExecuteImportAsync custom persistChunkAsync and ExecuteUniqueWriteAsync | Item Query live/tenant preflight; same VM field annotations; positive resolved Branch/defined Type; serialized final duplicate/FK check | Matched source; chunk partial-success retained |
| Numbers BE11 | EntityBase/CodeCreateService/UnitOfWork | UI displays returned No. Item uses existing fallback numbering; no invented PRT format or renumbering | Matched source |

Phase0 discovery/evidence, Phase1 freeze, Phase2 grid/query/export, Phase3 detail/write, Phase4 dependency-aware Delete, Phase5 integration and Phase6 reconciliation applied. Report adds UI20/21 within the frozen plan. Aggregate children, activate/approve/post/void, uploads, financial totals and step navigation skipped because Item lacks those workflows; shared asynchronous Save gate still applies.

Recipe drift check: PHASE00/02/05/06 and PLAN00 current; PHASE01/03/04 stale. Used canonical owning books for stale packets. Owner must regenerate and semantically review those packets; generated files not edited.

## Changes and verification

Frontend files, under `F:/My Work/Sigma/SiGmaAngularFrontEnd/`:

- `src/app/modules/Stock/Item/components/list/list.component.ts`, `.html`: replace legacy grid, typed applied filters/paging/actions, full export and report entry.
- `src/app/modules/Stock/Item/components/details/details.component.ts`, `.html`: shared typed editor, required/numeric/FK/uniqueness validation, modes/errors/retry/focus/discard.
- `src/app/modules/Stock/Item/components/report/item-report.component.ts`, `.html`: new complete catalogue report/print consumer.
- `src/app/modules/Stock/Item/item.routes.ts`; `models/create.ts`, `details.ts`, `list.ts`, new `item-type.ts`; `services/item.service.ts`: route and typed numeric contracts.
- Delete empty `components/list/list.component.scss` and `components/details/details.component.scss`.
- `src/app/_metronic/layout/layout.module.ts`: only redundant ItemService import/two providers removed by this task.
- `src/app/modules/i18n/vocabs/en.ts`, `ar.ts`: item block only. Other existing hunks preserved.

Backend files, under `F:/My Work/Sigma/SigmaBackend/`:

- `SiGma.ViewModels/ViewModels/Item/ItemAddVm.cs`, `ItemUpdateVm.cs`, `ItemDetailVm.cs`, `ItemListVm.cs`; delete unused `ItemFullListVm.cs`.
- `SiGma.Business/MapperConfig/ItemProfiler.cs`.
- `SiGma.Business/Services/StocksServices/ItemService.cs`.
- `SiGma.DataAccess/Configuration/ItemConfig.cs`.
- Item slices only in `SiGma.Business/Services/AdministrationsServices/ImportDataService.cs`.

Both actual Git roots identified. Complete scoped tracked diffs reviewed separately, new enum/report source explicitly inspected. Shared Layout/i18n dirty hunks reviewed to preserve unrelated changes. Scoped diff whitespace checks exit0 in both repositories (Git LF/CRLF notices only). Direct contract/consumer/route/import/map/merge-marker/stale-symbol checks performed. Item translation parity: 55 English keys, 55 Arabic keys, missing0/case-only0. No active ItemFullListVM consumer found. Inherited ItemService GetSelect consumers retain their API.

No build, tests, lint, browser/application verification, database commands, migration generation, commits, pushes or deployment run. Graphify/Sigma MCP not used. Source-only checks do not establish compilation or runtime acceptance.

## Owner follow-up and unresolved scope

1. Generate migration with `Add-Migration ChangeItemValidationAndUniqueness`; review Name/Barcode max250, filtered active-tenant unique indexes and explicit existing Price18,2 precision. Inspect active duplicates, overlength values and null/invalid historical Type/Branch first. No automatic cleanup/backfill authorized; applying migration may require owner data decisions.
2. Compile frontend/backend together and verify generic VM constraints/serialization and nested ItemDetailVM consumers. Nested business fields are retained, but previously inherited audit/state fields were removed; external consumers remain unverified.
3. Verify Create/Edit/View and Type0; Create Price/Quantity0 versus clearednull; malformed enum/FK, negative/oversized price, fractional/out-of-range quantity; duplicate Name/Barcode including edit-self, concurrent writes, empty Barcode and case/collation behavior. High-magnitude fractional prices retain existing JS number precision limits.
4. Verify import field constraints, required template Barcode/Branch/Type, live tenant lookup, concurrent CRUD/import duplicate guard, partial success and chunk failure cleanup. Final comparisons use DB collation; normalized import preflight remains existing behavior.
5. Verify referenced-row deletion for each inbound dependency, tenant isolation and failed-delete row retention; exercise success from final page.
6. Verify applied route filters/page/sort, cancellation/error/retry, >100-row Excel/report completeness, multipage print and afterprint cleanup. Verify Arabic/English, RTL/theme/responsive bounds, loading/error/invalid-field focus, keyboard/dirty exits and origin focus.
7. Decide Make/Model persisted relationship/cardinality/filter semantics in a new frozen scope before adding that filter. Current source provides no Item–CarModel relation. Catalogue report contents are a reviewer choice; no valuation/inventory report semantics were inferred.

Historical `components/list/list.component.spec.ts` is an unrelated stub importing a widget ListsComponent. It was preserved and not run. This task does not claim test readiness. Known shared numbering fallback is unchanged; feature-local safe Delete uses the existing dependency owner without expanding shared backlog scope.

Suggested commits only: frontend `fix(item): align list editor and catalogue report contracts`; backend `fix(item): align contracts and protect CRUD and import`.

Shared extraction result: no new reusable owner required; existing list/dialog/filter/validation/print/service owners reused. Learning protocol: no verified reusable rule added, so no book/skill update; feature choices remain in this review/freeze. No documentation rule added from unverified runtime behavior.

Agent utilization: root owned freeze, frontend, integration, reconciliation and artifacts. Existing `backend_units` agent reused as bounded backend worker, then read-only integration auditor; inherited model used because a full-history fork inherits and the mapped terra model was unavailable. Owned only the nine listed backend paths (including deleted VM) with Item-only import slice; no overlap with root. Parallel FE/BE work after freeze reduced waiting and avoided duplicate source scans. Root integrated price-bound/error/loading/focus audit findings and reviewed the final source; agent did not declare overall completion.

Confirmed core and catalogue report implemented; Make/Model pending. Closure remains source-only with owner verification pending.
