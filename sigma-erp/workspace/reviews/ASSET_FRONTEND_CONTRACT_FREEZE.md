# Asset frontend contract freeze

| Status | Frozen |
|---|---|
| Owner verification pending | yes |
| Date | 2026-10-06 |

Scope: requested `src/app/modules/Assets/asset` frontend and directly related wiring/translations. Backend source inspected to freeze compatibility; no backend edits or accounting-policy changes authorized by this handoff. Unrelated LoanEMI list TS/HTML changes preserved.

Authority: F:/My Work/Sigma/AGENTS.md; sigma-screen-refactor skill; Master 1–7; UI screen 02 and relevant blocks 1–10,13,15–17,19,22–30. Recipe -Check: phase01 current, PLAN00/phase00/02–06 stale; canonical blocks prevail, regeneration and semantic review owner-pending.

Decision: UI02 list/routed editor (cost totals; D4-2), backend Pattern1 for current field-only CRUD plus existing account-creation exception. References: Workshop/Job list `bindListQueries`, editor `requestClose` and shared sigma-editor classes; BranchService/base Service for filter/paging facts. No child collections/uploads (Attachments is decimal monetary input).

Routes: list, create(data.mode=create), view/:id(view), edit/:id(edit); preserve details/:id as redirect to view/:id. Preserve applied list filters/page/size in editor handoff and return. Authentication via existing AuthGuard/one root HttpClient; no permission invention.

## Frozen read contract
Actions first (shared table), then no:text, assetType.name:text, title:text(link/view), totalCost:money, purchaseDate:date, residualValue:money, assetLifeYears:number. Identity id:number. Current backend AssetListVM is oversized and remains a recorded backend finding; frontend new AssetListRow contains displayed fields/id only. Existing AssetDTO retained for out-of-scope depreciation report consumer (its `assetType` is a string). Backend list metadata totalCount/totalPages/pageNo/pageSize; default frontend15, choices10/15/20/50/100, explicit server paging, no local slicing. No sortable columns or sort transport: current navigation-list endpoint keeps repository id-desc ordering.

Filters frozen: no:string -> Filters[no] -> generic Asset.No Contains; title:string -> Filters[title] -> Asset.Title Contains; assetTypeId:number|null -> Filters[assetTypeId] -> generic equality. Empty/null absent; zero not inferred as a lookup choice. No date-range API filter: current backend lacks a business range hook. No unavailable controls/endpoints.

List/search uses applied snapshot, switchMap/defer cancellation, both failure channels, inline errors with X-Skip-Error-Interceptor/apiErrorMessage; complete Excel uses fetchAllPages/dataTableExportRows/composedReadErrorMessage, click-time translated headers. Root service methods: getList(AssetListQuery), getAllList(AssetFilters), getDetails(number), createAsset(AssetCreateDTO), updateAsset(AssetUpdateDTO), removeAsset(number,options?:{skipErrorInterceptor?:boolean}).

## Frozen detail/write compatibility
Detail identity id:number, no:string|null, name, assetTypeId:number|null, assetType:{name:string}|null, purchaseDate:string, inServiceDate:string|null, title, detail, originalPrice, discount, attachments, assetCostPrice, totalCost, depreciationMethod:numeric enum (StraightLine0/DecliningBalance1/UnitsOfProduction2), depreciationStartDate, openingDepreciation, residualValue, assetLifeYears, annualDepreciationRate, costCenterId:number|null, costCenter:{name:string}|null.
Create same editable fields without identity/no/navigation; update plus id:number. Remove subscription/audit/deleted/active/valid/changed and fictitious screenshot-only members. Dates use Date|string|null controls, dateValueValidator, required as current frontend on purchase/inService/depreciationStart; serialization parseDateValue. Name/title preserve existing required,min2,max50; detail and assetType required. Cost center optional. Existing monetary input/null->0 behavior preserved; assetLifeYears integer only. Do not impose unconfirmed monetary minima/formulas.

**Accounting slice Uncertain and blocked separately:** current write VMs accept assetCostPrice,totalCost,annualDepreciationRate as editable values; screenshot suggests derived values but supplies no formula. Preserve existing manual input compatibility until owner supplies formula/discount meaning; no frontend preview invented, no backend derived-rule change. This is a known departure from derived-field guidance, not claimed compliant or complete. Owner asked asynchronously on2026-10-06.

Editor shared shell, one form pane internal scroll, fixed footer, shared FormSection/FieldError/DatePicker/NumericFocus/Money/StateMessage; typed forms, successful snapshot gate, required lookup retry, View uses detail names/no editable lookup, mode disables entire form; Save freezes inputs, releases loading via finalize, failures retain draft; Cancel/Back dirty confirmation and busy gates; first invalid focusField. In-service/date values preserved without timezone conversion. Cost center must patch and persist (current source omitted it).

Actions Supported: create/view/edit/delete via current endpoints; delete confirmation preset+record, busy guard, refresh applied page and previous page on last-row deletion. Delete permission candidate DELETE Asset?id=; authentication only. Reference Job labourTime/invoice/close/gatePass Not Applicable (no owning Asset contracts). Screenshot Print/SaveAndPrint/Report/SalePrice/Dispose Missing (no confirmed Asset implementation/contracts); do not add no-op actions. Screenshot1 AssetType is separate already-reviewed feature/context only.

## Reference conformance preflight
| Concern | Book | Reference actual symbol | Shared owner | Target |
|---|---|---|---|---|
| List shell/title | UI1/3 | Job list HTML metadata/header | styles.scss/FeatureTitle | sigma-route-host/list-page/panel/header/table fill |
| Query lifecycle | UI6/22/28 | Job.bindListQueries | LoadingService/apiErrorMessage | switchMap/defer/finalize+totalCount |
| Paging/export | UI6/8 | Job.onLazyLoad/exportExcel | resolveListPaging/fetchAllPages/dataTableExportRows | typed request, all pages/applied filters |
| Editor | UI1/13/15 | Job editor HTML/requestClose | styles.scss/FormSection | single scroll pane/fixed footer/explicit modes |
| Discard/delete | UI9/10 | Job.requestClose/confirmDelete | ConfirmationDialogService presets | dirty/busy gates+record confirmation |
| Controls | UI16/17/19/27 | shared actual components/directives | enumOptions/TranslateOptions/DatePicker/FieldError/focusField | real numeric enum IDs, masked dates/typed validation |

Frozen handoff consumers: list worker owns components/list TS/HTML/SCSS only; editor worker owns components/details TS/HTML/SCSS only; root owns models/service/routes/toolbar/translations/artifacts and final diff. No overlap. Source-only verification, no builds/tests/lint/database/migrations/browser/commit/push/deploy.

## Contract correction after deeper source trace —2026-10-06
AssetController.GetListAsync calls Service.GetManyWithNavigationsAsync (893), which uses repository FindAllByAsync and does NOT invoke ApplyListOrder. Supersedes initial sort paragraph: no sortable columns, no sort request or route state in this frontend slice. Service getAllList(filters) has one argument. List filter/paging still confirmed. Backend canonical list projection and oversized DTO remain backend findings and are not described as conformance.

Owner reply to accounting question: “طبقا للصورة”. Image3 shows zero inputs and dashed cost/total/rate fields, but contains no nonzero worked example/formula or discount semantics. The reply confirms screenshot as requested reference; it does not supply the exact rule. Accounting calculation contract remains Uncertain; preserve current API inputs until a concrete rule is supplied. No computed amount invented.

## Integration refinement —2026-10-06
Create/update and editor delete use inline error presentation, therefore X-Skip-Error-Interceptor is sent; standard mutation success remains global (no X-Skip-Success-Toast). List delete uses default global error owner. removeAsset(id,options?:{skipErrorInterceptor?:boolean}) preserves default behavior. Editor depreciationMethod starts at named StraightLine (existing nonnullable enum0 server default); clearing it is invalid with a required-field message instead of silently rejecting Save. Masked calendars show dd/mm/yyyy. CanDeactivateFn is attached to all editor modes, covering Back/Cancel/sidebar navigation. Duplicate confirmation busy gates are part of the frozen action/navigation contract. Purchase-source user steering trace remains read-only; no link/capitalization policy introduced.

## Source integration reconciliation —2026-10-06
Confirmed frontend slice implemented and scoped diff reviewed. ISO backend date-times are normalized with shared toApiDate before parseDateValue and local Date reconstruction; user-entered dates still pass strict dateValueValidator/parseDateValue. This prevents empty Edit dates or calendar-day shifts without adding a new parser. Full feature remains open for the accounting/purchase linkage and screenshot-only missing workflows documented in ASSET_FEATURE_REVIEW.md. Owner verification pending remains yes. Concurrent AssetType and depreciation-detail report changes were preserved and are outside this task's ownership.
