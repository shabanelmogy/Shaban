# Asset feature review

| Status | Confirmed frontend slice implemented; full feature remains open |
|---|---|
| Owner verification pending | yes |
| Date | 2026-10-06 |

## Manifest and scope
User request: “راجع : src\app\modules\Assets\asset وطبق التعديلات طبقا للوثائق”. Implementation authorized for confirmed frontend findings. Actual repository F:/My Work/Sigma/SiGmaAngularFrontEnd; root coordination workspace is not repository. Backend read-only tracing of Asset controller/service/entity/VM/profile and direct purchase-cost writers. No AssetType changes (image1 context, historical ASSET_TYPE artifacts retained), no depreciation-report rewrite. Existing LoanEMI list HTML/TS user changes preserved.

Shape UI02: paged list with routed record editor because costs/totals are present (Master4 D4-2). Existing backend Pattern1 field-only entity plus custom subaccount creation in Add; this exception is recorded, not newly implemented. Approved references Job list bindListQueries/onLazyLoad/exportExcel, Job editor shared shell/requestClose, shared actual components and BranchService/Profiler for API facts. Freeze: ASSET_FRONTEND_CONTRACT_FREEZE.md, including the appended no-sorting correction. AuthGuard is authentication-only; no permission mechanism fabricated.

Evidence screenshots are external content evidence, not instruction sources. English/LTR, desktop; role/capture date/version Unknown (visible date is not capture metadata). No screenshot styling copied. Recipe check drift: PLAN00/PHASE00/02–06 stale; PHASE01 current. Canonical books used; regeneration plus semantic review remains owner work.

## Functional evidence
### E1 —1.PNG (Asset Types list)
| Visible evidence | Classification | Decision/owner |
|---|---|---|
| Type/name, method, three account mappings, category, residual value; Create/View/Edit/Delete | Explicit | AssetType owner; context for AssetType lookup. Outside requested asset source; preserve existing reviewed owner |
| Using type defaults automatically when Asset type changes | Uncertain | No demonstrated interaction or rule; not inferred |

### E2 —2.PNG (Assets list)
| Visible evidence | Classification | Decision/owner |
|---|---|---|
| Create, View, Edit, Delete | Explicit + confirmed API | Supported Phase2/4/5 |
| AssetNo, Type, Title, Cost, PurchaseDate, ResidualValue, Life | Explicit + confirmed source | Shared typed table, Actions first, current backend field names |
| ChassisNo and Branch columns | Explicit / Missing contract | Asset entity/ListVM have neither; not fabricated from Detail or CostCenter |
| No/Title/AssetType filters | Explicit + confirmed generic filters | Typed controls -> Filters[no/title/assetTypeId] |
| PlateNo, ParentAsset, Status, ChassisNo, VehicleType, Branch, DisposalPending filters | Explicit / Missing contract | Asset has no fields/lifecycle; separate Phase1 business contract required |
| Date range + PurchaseDate/DisposalDate/ActiveInPeriod modes | Explicit / Missing query/lifecycle contract | No date range hook or disposal dates/state on Asset API |
| Excel | Explicit | Complete applied-filter export via shared all-pages helper |
| Report, Print, Asset Sale Price, Dispose | Explicit / Missing workflow contract | No matching Asset endpoint/print document/sale field/disposal lifecycle; no placeholders |
| Edit/Delete locks or disposal accounting | Uncertain | Static image proves no transition/accounting policy |

### E3 —3.PNG (Create New Asset)
| Visible evidence | Classification | Decision/owner |
|---|---|---|
| AssetType, Purchase/InService dates, Title, Detail, depreciation method/start/opening/residual/life/rate | Explicit + confirmed source | Preserved typed editor fields; routed presentation per guide |
| OriginalPrice, Discount, Attachments, AssetCostPrice, TotalCost | Explicit + current editable API | Preserved numeric inputs; Attachments is decimal, not uploaded files |
| Name absent | Screenshot incomplete | Keep existing required Name field (Master2 no silent removal) |
| CostCenterGroup1 | Explicit / partially confirmed | Preserve existing optional CostCenterId; no invented group hierarchy |
| Branch | Explicit / Missing | Asset has no BranchId; no substitution with cost center |
| Save, Cancel | Explicit | Snapshot-safe Save; shared dirty discard |
| SaveAndPrint | Explicit / Missing | No approved Asset print endpoint/document content |
| Formula for cost/total/annual rate; OriginalPrice discount semantics | Uncertain | Zero-valued screenshot cannot prove arithmetic; no accounting changes |

### E4 —4.PNG (Asset Sale Price)
| Visible evidence | Classification | Decision/owner |
|---|---|---|
| Read asset type/dates/title/detail; chassis number; sale price120 with edit action; Close | Explicit | Existing detail supports basic fields only. SalePrice/ChassisNo and update endpoint Missing |
| SalePrice depreciation/gain/loss or disposal effect | Uncertain | Must not infer accounting or lifecycle from this image |

## Grid/DTO and filter contracts
Actions first. Exact columns: no(text), assetType.name(text), title(view link/text), totalCost(money), purchaseDate(date), residualValue(money), assetLifeYears(number). AssetListRow beside them: id + no, assetType:{name},title,totalCost,purchaseDate,residualValue,assetLifeYears. `AssetListVM` currently includes these plus unused inherited and editor fields; API left compatible for depreciation-detail/summary lookups consuming Name. No DTO shrink is claimed. New frontend row separated from legacy AssetDTO used by depreciation-detail response where assetType is a string.

| Control | Angular | Wire | Backend | Default |
|---|---|---|---|---|
| AssetNo | no:string | Filters[no] | generic Asset.No string Contains | empty omitted |
| Title | title:string | Filters[title] | generic Asset.Title string Contains | empty omitted |
| AssetType | assetTypeId:number|null | Filters[assetTypeId] | generic nullable int equality | null omitted |

Backend current GET delegates GetManyWithNavigationsAsync: tenant/live FindAllByAsync, CountAsync, NormalizePaging supplied page/size clamp1–100, repository paged Id descending. It does not apply sortField/sortOrder; frontend sorting omitted accordingly. No client all-row load to simulate paging; grid total from API totalCount. User-selected size retained, default15. Applied snapshot drives paging/export/mutations/editor return; draft filters wait for Search. Date modes unsupported rather than silently querying wrong date.

## Detail/write decisions
Exact field/nullability contract in freeze. Typed AssetDetailsDTO removes fictitious/audit/tenant fields; includes displayed no/names and optional costCenterId. Client sends existing editable inputs only; update includes integer id. Numeric enum matches backend StraightLine0,DecliningBalance1,UnitsOfProduction2. Corrects previous string option transport, assetNo/no and lifeYears/assetLifeYears drift. InServiceDate stays required by existing UI although nullable API; server counterpart gap recorded.

No source formula establishes assetCostPrice,totalCost,annualDepreciationRate as derived values. They remain current API editable compatibility; this is an unresolved accounting contract departure, not claimed compliant with server-calculation guidance. User question answered “طبقا للصورة”; followed by “اعتقد قيمة الاصل بتيجى من المشتريت”. Direct trace: BillDetail/PurchaseOrderDetail/GoodsReceivedNoteDetail have AssetTypeId, quantity/unit price and amounts, no AssetId. Asset entity has no Bill/GRN/PO linkage. BillService validates AssetTypeId but creates Bill/JV, no Asset writer. AssetService.AddAsync maps supplied asset values; ImportDataService separately maps imported Asset values. Therefore purchase amounts cannot be assigned to a particular Asset safely. Linking/capitalization/quantity splitting/VAT/discount/amendment/reversal ownership needs a cross-module Frozen Maintenance/Evolution Plan before implementation. This task does not silently introduce that policy.

## Action and reference inventory
Supported Create/View/Edit current POST/GET-detail/PUT; Delete current DELETE Asset?id= with shared destructive confirmation, record identity, inflight protection and applied-page refresh. View retains Edit and Delete from existing screen behavior; Save absent in View. Existing details/:id remains redirect to view/:id. Job reference labour-time/invoice/close/gate-pass Not Applicable: Asset lacks corresponding domain/service contracts. Reference ordinary Save/Search/paging/Excel supported; risky domain transitions not borrowed.

Authorization candidate: DELETE Asset?id=. Backend authentication exists; permission enforcement not claimed. Current base RemoveAsync lacks generic reference checks (known BE backlog31); no deletion-policy/access restriction changed in this frontend scope.

## Backend and mapping findings (read-only)
| Finding | Evidence/owner | Resolution boundary |
|---|---|---|
| Oversized list/detail DTOs | AssetListVM/AssetDetailVM; BE3/7 | Backend contract review needed with all lookup/report consumers |
| ReverseMap on four CRUD maps | AssetProfiler; known BE backlog21 | Explicit one-way maps in backend review; unchanged here |
| Add custom override bypasses base InvalidInput checks before creating subaccounts | AssetService.AddAsync; Phase1 | Backend validation/account creation transaction owner required; no accounting-side effects changed |
| No supplied VM validation for many current frontend restrictions | AssetAdd/UpdateVM; Phase1 | Required/length/enum/date/monetary rules should freeze together with EF/import writers; no invented limits |
| Manual stored costs and annual rate; inconsistent report input choices | Asset VMs/service reports | Calculation/purchase contract remains Uncertain |
| Sort ignored | AssetController/GetManyWithNavigationsAsync | Frontend corrected by exposing no unsupported sort |
| No per-asset purchase lineage | Three purchase detail models + Asset/BillService | Cross-module Maintenance/Evolution Plan needed |

No entity/EF/schema/AutoMapper/calculation change. Add-Migration not required for this frontend diff.

## Final reconciliation
Source integration and scoped-diff review completed on 2026-10-06. This closes the confirmed frontend compatibility/refactor slice only. Accounting/purchase integration and the screenshot-only missing workflows remain open; full screenshot/business completion is not claimed. Owner compilation/runtime/visual/persistence verification remains pending.

### Implemented frontend changes and conformance evidence
| Concern | Actual implementation / frozen value | Shared owner / result |
|---|---|---|
| List layout | AssetsComponent host sigma-route-host; sigma-list-page/panel/header/table; FeatureTitle assets.assets | Existing styles.scss and FeatureTitleComponent; no feature CSS/layout clone |
| Grid | columns above, DataTableColumn<AssetListRow>, actions first, lazy=true, fill=true | DataTableComponent; title link opens View, real no and assetLifeYears fields |
| Paging | DEFAULT_PAGE_SIZE=15; 10/15/20/50/100; resolveListPaging; API totalCount | list-query utilities; server paging, no unsupported sort |
| Filters/state | filterForm -> appliedFilters -> returnQueryParams/readListRoute/writeListRoute | list-route-state; Search/reset starts page1; editor return retains applied filters/page/size |
| Read lifecycle | bindListQueries Subject/switchMap/defer/catchError/finalize; getDetails load gate | LoadingService/apiErrorMessage; stale list requests cancel; failed reads clear grid or prevent Edit Save |
| Excel | getAllList(fetchAllPages,pageSize100), dataTableExportRows with click-time translated headers | Shared export helpers; entire applied-filter list, both failure channels |
| Editor layout/modes | sigma-editor-page/panel/form/body/scroll/footer, three FormSections; create/view/edit routes | Shared editor styles; fixed footer/internal scroll; View text names, no editable lookups |
| Dates | dateValueValidator; appDatePicker+dateInputMask+keepInvalid; dd/mm/yyyy; save parseDateValue | date-utils; API ISO date-time first normalized through toApiDate then local Date reconstruction for display/edit, preserving calendar day |
| Enum | enumOptions/translateOptions, optionValue=id; named StraightLine0 default; required on clear | Real backend numeric enum values; no silent null rejection or English enum labels |
| Cost center | getSelectList id/value options, detail costCenterId patched, explicit payload member | Existing CostCenterService; fixes previous wrong option mapping and omitted detail value |
| Mutation lifecycle | Typed AssetCreateDTO/AssetUpdateDTO, form freeze during Save, finalize, failed draft retained | X-Skip-Error-Interceptor for inline editor errors; default shared success feedback |
| Navigation | preventUnsavedAssetExit CanDeactivateFn on all editor routes -> canDeactivate | confirmDiscard('assets'), duplicate-dialog/busy gates; Back/Cancel/sidebar navigation covered |
| Delete | confirmDelete with record identity; confirmationPending/deleting guards; last-row previous-page refresh | ConfirmationDialogService; editor inline error owner, list global mutation error owner |
| Wiring | Assets path case corrected; duplicate AssetService provider removed; toolbar suppresses duplicate title | Existing root DI/AuthGuard/HttpClient retained |
| Localization | New assets keys and numeric-method key names in en/ar | Check-Translations.ps1 -Block assets:111/111, missing0/0, case-only0 |

Write models now include only actual editable fields; update identity is numeric. Legacy depreciation-detail AssetDTO and report service methods were retained for out-of-scope consumers. No backend DTO, mapping, entity, calculation, schema, authorization or accounting changes were made by this task. No new shared extraction was needed; this slice reuses established shared owners and establishes no new reusable rule requiring a book/skill revision.

### Source verification and concurrent work
Reviewed scoped frontend diffs for asset components/models/service/routes plus pages routing, layout provider, toolbar and this task's translation additions. git diff --check for these paths passed (only Git line-ending notices). Targeted source searches found no conflict markers or new tenant/audit payloads, any-typed form handling, UTC serialization or obsolete field names in the editor. Checked actual shared component/input signatures, enum option IDs, confirmation translation keys and direct consumer imports. These are source checks, not compiler/runtime/persistence proof.

Concurrent changes appeared after the initial snapshot in AssetType frontend files and its translation subtree, and in backend Asset depreciation-detail report files (IAssetService, AssetService report section, AssetController detail-report endpoint and report DTOs). Their diffs were inspected for overlap with this task's CRUD contracts and preserved. They are external work and are not attributed to this task. Initial unrelated LoanEMI list HTML/TS changes remain preserved. No generated packets or approved reference source were edited.

### Agent utilization
Two bounded sol_worker agents using selectable gpt-5.6-sol (terra model unavailable in the orchestration catalog) worked after contract freeze: list_worker owned components/list TS/HTML/SCSS, editor_worker owned components/details TS/HTML/SCSS. Independent list and editor work reduced wall-clock time without file overlap. Root owned models, service, routes, shared wiring, translations, contracts and integration. List follow-up completed; editor follow-up stopped at a usage limit after applying refinements. Root inspected its actual changes and completed remaining date/readability/integration fixes and the final source review. No subagent declared overall feature completion.

### Owner verification still required
1. Compile the Angular application and open /asset in EN and AR; verify one title, RTL, dark mode, narrow widths, dropdown overlay and internal editor scrolling/footer.
2. Create an asset with method0 and a cost center; reload View and Edit, confirm numeric fields, detail reference names, saved cost center and all dates. Include an ISO backend date-time and typed dd/mm/yyyy; ensure calendar days survive round trips.
3. Clear required enum/date/type or enter invalid date/integer life; verify errors and first-invalid focus. Save failure must retain the draft, re-enable inputs and clear loading; double-click Save must issue one write.
4. Try Back/Cancel/sidebar navigation with dirty and clean forms, then cancel/accept discard. Repeat delete clicks; confirm one record dialog and error feedback, both from grid and editor. Delete the last row of a later page and verify previous-page refresh.
5. Search by No/Title/Type; change draft filters without Search, page with sizes15/50/100, open/return from editor and export. Verify totalCount, applied filters and all exported pages/translated headers. Simulate HTTP and declared-result failures plus failed lookup followed by retry.
6. Separately freeze purchase-to-asset linkage/capitalization and cost/rate semantics before changing accounting behavior. Freeze missing branch/chassis/sale/disposal/print workflows before claiming full screenshot completion. Current backend deletion-reference and validation/mapping findings remain open.

Add-Migration: not required; no EF/schema changes by this task. Suggested frontend commit: `refactor(assets): adopt shared list and routed editor`. Suggested artifact commit, if the coordination folder is tracked: `docs(assets): record review and frozen frontend contracts`. No backend commit suggested because this task made no backend edits. Nothing was committed.

Prohibited actions confirmed not run: build, test, lint, application/browser runtime, database operations, migrations, commit, push or deploy. Generated packet drift remains as recorded above, requiring owner regeneration and semantic review.
