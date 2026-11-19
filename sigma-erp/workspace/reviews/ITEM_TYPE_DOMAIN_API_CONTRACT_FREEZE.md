| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-04 |

# Item Type — shared domain/API/UI contract

Authorized scope: review `src/app/modules/Stock/ItemType` and implement confirmed documented fixes, including its directly related backend API, EN/AR feature translations and root provider cleanup. Feature files were clean at discovery; both repositories contain unrelated pending changes, including the prior UnitsOfMeasures task, shared translations/Layout and backend migrations/snapshot. Preserve them. No build/test/lint/browser/database/migration/commit/push/deployment is authorized.

## Manifest and evidence

UI type01, list with modal editor (UI13 D4-2): Name and Category, no child collections/totals/posting. Backend Pattern1: `ItemType : EntityBaseWithName` with persisted `Type:ItemCategory`. References: Workshop/Job list and routes for shared shell/query/exit adapter, shared EditorDialog + Fleet/VehicleService for dialog/dirty handling, BranchService/BranchProfiler for ordinary generic contract with later BE8 base hooks taking precedence over older manual examples. No PLAN-00: bounded repair of one established CRUD owner; no domain redesign or extra relationship.

| Evidence | Classification | Content / decision |
|---|---|---|
| E1 `C:/Users/user/Desktop/Stock/ItemType/1.PNG` | Explicit, historical/current date unknown, English LTR | Name and Category grid, Create, View/Edit/Delete, scrolling and paging. Examples are not seeds. |
| E2 `C:/Users/user/Desktop/Stock/ItemType/2.PNG` | Explicit, historical/current date unknown, English LTR | Create dialog with Name and Category dropdown, Cancel/Save. |
| Combined `Liquid/SemiLiquid` screenshot text | Conflicting with current enum if treated as transport | Current authoritative C#/TS enum defines Part=0, Liquid=1, SemiLiquid=2. Preserve all three stored values and translate labels; do not merge categories or migrate values based on historical text. Conflict resolved by source. |
| Screenshot layout and category links | Guidance / uncertain linked destination | Canonical components own presentation. Current category is an enum, no category entity/navigation/route exists; show translated text, invent no link. |

Guides: Master0–8; UI1–10,13,15–16,19,22–30; BE1–9,13,18–19. Recipe -Check: Phase0/2/5/6 current; Phase1/3/4 stale, use owning canonical books and report owner regeneration/semantic review. No generated edits.

## Read/grid/filter contract

| Grid column/action need (order) | Frontend | ListVM | Status |
|---|---|---|---|
| Shared Actions first | id:number | Id:int | Confirmed |
| Name text, sortable | name:string\|null | Name:string? | Confirmed |
| Category text, sortable stored value | type:ItemCategory | Type:ItemCategory | Confirmed |

ListVM exactly Id,Name,Type. Remove unused inherited SubscriptionId, IsActive, IsValid, IsChanged, No, GUID, CreatedAt, CreatedBy; remove frontend unused audit members. Detail exactly Id,Name,Type (also remove inherited IsDeleted). FullListVm is removable only after exact consumer search proves declaration only; same export shape uses ListVM. No action depends on status.

| Control | Form/applied filter | Query | Backend | Default / edge cases |
|---|---|---|---|---|
| Name | name:string | Filters[name] | Generic property Contains | Trim; omit empty. |
| Category | type:ItemCategory\|null | Filters[type] | Generic enum equality | Null means all; **0 Part must be retained**; undefined/invalid route enum becomes absent. |
| Paging | pageNo,pageSize | pageNo,pageSize | Generic count/clamped slice | Default15, choices10/15/20/50/100; actual TotalCount. |
| Sort | name/type only | Filters[sortField], Filters[sortOrder] | Generic stored-column order + Id tie-breaker | Default Id descending; category sorts numeric enum, not translated alphabetical text. |

Draft filters remain separate from applied state; paging/actions/export use the last Search snapshot. Route query state restores applied Name/Type/page/sort. Excel collects all applied-filter pages through fetchAllPages and renders the same two translated data columns; no copied paging loop or type-to-label mutation of DTOs.

## Detail/write contract

| Field | Form | Detail | Add | Update | Validation / ownership |
|---|---|---|---|---|---|
| Identity | no editable control | Id:int | omitted | Id:int | Positive saved identity; tenant server-owned. |
| Name | non-null string | Name:string? | Name:string | Name:string | Required, whitespace-only rejected, max250; request normalization owned by existing TrimIncomingStrings. |
| Category | ItemCategory\|null, initially null | Type:ItemCategory | Type:ItemCategory? | Type:ItemCategory? | Required plus EnumDataType; defined values0/1/2 only. |

Reviewer decision (owner standing rule): max250 follows existing Add and fixes Update's old50 mismatch without a shared-base change. Feature Add derives AddBaseVm; Update derives UpdateBaseVm, both explicitly declare Name and nullable required Type. Nullable request Type rejects omission rather than silently choosing Part, consistent with the empty screenshot dropdown; entity stays non-nullable and transport remains numeric. Required/EnumDataType validates before mapping.

Reviewer decision (owner standing rule): live tenant Name is the business key, following normal Name master contracts and avoiding ambiguous duplicate named choices; no source proves category-dependent duplicate names are needed. Reject speculative Name+Type identity. UniqueColumns uses existing RecordAlreadyExists with base serialized writes; filtered unique `(SubscriptionId,Name)` index uses existing DB collation. Owner must inspect existing duplicate/long/null data before migration; no automatic cleanup/truncation/backfill. EF Name max250. Suggested owner command: `Add-Migration ChangeItemTypeNameAndUniqueness`.

Four one-way maps: Add→ItemType, Update→ItemType, ItemType→Detail, ItemType→List. No ReverseMap/extra Ignore; mapping only happens after model validation. No derived calculations, accounting, new transactions or entity changes.

## Actions, overrides and integration

| Action | Source → target / endpoint | UI, dependency and recovery |
|---|---|---|
| Create | New → saved; POST ItemType `{name,type}` | Typed modal, required choice, success closes/refreshes applied list, failure retains form. |
| View | Saved → read-only; GET ItemType/GetByWithNavigationsId/{id} | Same modal, translated Name/Category read text; Close and switch to Edit. No lookup HTTP needed for enum. |
| Edit | Saved → saved; PUT ItemType `{id,name,type}` | Same modal; authoritative backend validation/uniqueness excludes self. |
| Delete | Live saved → soft deleted; DELETE ItemType?id={id} | Shared named confirmation; RemoveWithChildrenAsync checks actual metadata; success current/last previous page refresh, failure retains row. |
| Discard | Dirty create/edit → close after confirmation | Shared confirmDiscard; Cancel/X/Escape/route leave; pristine/View silent, busy cannot close. |

Scoped EF-model symbol inventory found no inbound ItemType FK or owned children. `Item.Type` is a separate ItemTypeEnum, not an ItemType FK. Do not invent a relationship or falsely state Item blocks deletion. Use `RemoveAsync => RemoveWithChildrenAsync(id,CancellationToken.None)` so future modeled references are checked. Shared delete/tenant rules remain authoritative.

Reference action coverage: Job Create/View/Edit/Delete Supported; labour time, invoice customer, close job, gate pass and lubrication job Not Applicable (no workshop workflow/state). VehicleService nested selection/child actions Not Applicable (no children). No print/activation/state action inferred; keep generic endpoint compatibility.

Override audit: UniqueColumns for Name uniqueness and RemoveAsync for usage-aware delete. Inherit Add/Update/List/Detail/Select/activation/controller actions; no manual FK chain, validation duplication or custom read endpoint.

Canonical `/ItemTypes` owns all three modal modes. Existing `create` and `details/:id` redirect via CanActivateFn UrlTrees with one-time editor intent, preserving old links; local typed CanDeactivateFn calls list.canDeactivate which delegates active modal. List owns changed refresh and caller focus. Service providedIn root/environment.baseUrl/AppModule interceptor HttpClient; remove only redundant ItemTypesService Layout import/provider. Read list/detail inline errors opt out via X-Skip-Error-Interceptor; save/delete global owns feedback, feature owns flags/state recovery. takeUntilDestroyed/finalize, switchMap/defer and identity/closed guards cover cancellation/late responses.

Existing authentication/authorized controller retained; no permission mechanism invented. Authorization candidates: POST create, PUT edit, DELETE delete. Category enum choices use existing enumOptions/enumKey and TranslateOptionsPipe, start null, appendTo body, fill layout-defined field and switch language without remapping IDs.

## Pre-edit conformance evidence

| Concern | Book / actual reference and shared symbols | Before → frozen target / compared value |
|---|---|---|
| Shell/title | UI1/3; Job host/template, FeatureTitleComponent/global styles | Legacy card → sigma-route-host/list-page/panel/header, shared title inset/paint, no local CSS. |
| Filter | UI4/16; Job appFilterPanel/FilterActions, FilterPanelComponent/TranslateOptionsPipe | None → Name + Category reactive fields, mainColumns2, Search/Reset/Export, shared34px controls. |
| Grid | UI5/6/8/28; Job query flow, DataTableComponent, resolveListPaging/fetchAllPages/dataTableExportRows | ms-lib/unpaged/mutated string type → typed Id/Name/Type, fill=true, default15/count, cancellation and same-column complete export. |
| Modal/dirty | UI10/13/15; EditorDialog public inputs/outputs, VehicleService requestClose/canDeactivate | Routed editor → one content-sized560px modal, contentPadded=true, one-column Name/Category group, shared footer and discard. |
| Enum | UI16; enumOptions/enumKey, TranslateOptionsPipe, authoritative ItemCategory | Duplicate enum/index-based legacy mapping → single enum source and stable0/1/2 IDs, translated live/read/export labels. |
| Validation/state/focus | UI19/22/27; FieldError/StateMessage/focusField | No validation or errors → required/max250/defined enum, Retry/retained input/balanced loading/focus. |
| Backend | BE3/4/5/8/13; generic class detail constraint, directional Branch maps, UniqueColumns/RemoveWithChildrenAsync | Oversized models/reverse maps/no guard → lean read models, four maps, shared uniqueness/delete hooks. |

Shared-extraction gate: reuse existing shell/table/filter/dialog/confirmation/query/export/enum/validation/error/focus pieces; no new generic abstraction is justified by feature-specific orchestration. Source-only conformance and runtime/visual acceptance are separate. No unresolved material business contract remains in scope; live data and execution are owner-pending.

## أزرار أنواع الأصناف بجوار حقول البحث — ١ نوفمبر ٢٠٢٦

نُفذ طلب المالك كتعديل S للعرض فقط: تفعيل inlineActions على FilterPanelComponent القائم مع mainColumns=2. يبقى حقل الاسم واختيار التصنيف في الشبكة، وتظهر البحث وإعادة الضبط والتصدير بجانبهما على العرض المعتاد، مع استجابة الشاشات الصغيرة التي يملكها المكوّن. لا CSS محلي أو فراغات ثابتة أو نقل إنشاء أو تغيير أحداث/صلاحيات/قيم التصنيف.

الشكل UI01 بقائمة ومحرر نافذة؛ المسار الفعلي pages/routing:613 → Stock/ItemType/item-types.routes → ItemTypesComponent. الخلفية normal entity كما في العقد المجمد ولا تُعدل. أدلة مرجع لقطة ٢٠٢٦-١٠-٢٨: sidebar/15-stock/screens/02-item-types، R0565 وC1689/C1688؛ قرئت صفحة الشاشة وحدودها، ولا تملك شكل شريط Sigma. استُخدمت مهارة الشاشة وUI4 وقدرة inlineActions العامة وPHASE02 بتناسب بعد Check ناجح للحزم الثماني. لا screenshot جديد أو قرار أعمال ناقص لهذه الإضافة.

مطابقة مصدرية: أعمدة القائمة name/type وهوية id للإجراءات ما زالت تطابق ListVM دون تغيير. التصنيف خيارات enum محلية مترجمة بلا lookup شبكي. GET ItemType/getList بمرشحي الاسم والنوع وgrid/paging قراءة تشغيلية مباشرة؛ getAllList يستخدم fetchAllPages. لا cacheSelect opt-in في ItemTypesService، ولا اعتماد كاش جديد أو writer/import/topic أو طلب إضافي. مسار القائمة switchMap/defer/startLoading/finalize/endLoading/DestroyRef باقٍ. لا تغيير query أو tenant/count/order أو payload أو Mapper أو مالية، ولا فهرس أو schema جديد مبرر من ترتيب الأزرار، ولا Add-Migration أو قياس سرعة مزعوم.

حُدث دليل UserGuide/content/stock-guide.ts في موضوع أنواع الأصناف داخل /UserGuide/stock بالعربية والإنجليزية. روجع فرق قالب القائمة وتعديل الدليل مع حفظ تعديل وحدات القياس الموجود مسبقًا، ونجح تحليل قالب Angular ودليل TypeScript وgit diff --check. لا قاعدة جديدة تتطلب تغيير كتاب/مهارة أو توليد حزم. لم تُشغل بناء أو اختبارات أو lint أو متصفح أو قاعدة بيانات أو commit؛ لا وكلاء لأن تغيير مدخل واحد لا يبرر تفويضًا. قبول المالك المتبقي: معاينة الصف وعمل البحث وإعادة الضبط والتصدير على العرض المعتاد والصغير.

رسالة حفظ مقترحة للواجهة: fix(item-types): align filter actions with search fields
