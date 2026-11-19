| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-04 |

# Units of Measures — shared domain/API/UI handoff

Authorized by the request to review `Stock/UnitsOfMeasures` and implement all applicable documented fixes. Screenshots are guidance for content only. Scope: existing Angular feature, matching backend service/profile/VM/configuration, feature EN/AR translations, review records. Preserve all unrelated working-tree edits, including migrations and shared translations. Scoped feature files were clean at discovery.

## Manifest and evidence

UI type 01: list with modal editor (UI13 D4-2: Name only, no children/totals/posting). Backend Pattern1: tenant-owned `UnitsOfMeasures : EntityBaseWithName`. Approved references: Workshop/Job list for shell/filter/table/request flow; Fleet/VehicleService details for shared dialog integration (current reference is routed because its own aggregate has several child collections; use shared modal shell rule, not its domain/routes); BranchService and BranchProfiler for normal-entity generic hooks/maps. No PLAN-00 needed: bounded fixes to one established CRUD owner, with source-supported contracts.

| Evidence | Classification | Content / decision |
|---|---|---|
| E1 `Desktop/Stock/UnitOfMeasurement/1.PNG` | Explicit, historical/current date unknown, English LTR | Name column, Create, Edit, Delete, scrolling grid and pagination. Values are samples, not seeds. |
| E2 `Desktop/Stock/UnitOfMeasurement/2.PNG` | Explicit, historical/current date unknown, English LTR | Create dialog, Name input, Cancel and Save. |
| E1 name link | Strong inference | Current source links to details; preserve View in same modal. |
| E1/E2 appearance | Guidance only | Shared canonical components own layout, RTL/dark/responsive behavior. |
| Unshown rules | Confirmed from source/books | Tenant ownership, required name, usage-aware soft delete, generic paging/filter/sort, duplicate business-key protection. No extra fields or lifecycle inferred. |

Documentation: Master0–8; UI1–10,13,15,19,22–30; BE1–9,13,18–19. Recipe `-Check` reports stale Phase1/3/4: use owning books for them; regeneration/semantic review pending with documentation owner. Phase0/2/5/6 are current. Books BE5/13 contain older override examples contradicted by their later base-hook rules and BE8: current source and newer explicit shared rules control; do not copy redundant methods or manual usage chains.

## Grid and filters

| Grid/action need | Frontend | Backend | Status |
|---|---|---|---|
| Actions first (shared generated column) | id | Id:int | Confirmed |
| Name (text/link, sortable) | name:string\|null | Name:string? | Confirmed |

ListVM is exactly Id, Name. Remove inherited SubscriptionId, IsActive, IsValid, IsChanged, No, GUID, CreatedAt, CreatedBy. Detail is Id, Name only; also remove IsDeleted. No action uses status. FullListVm has no named consumer (symbol search required before removal); retire when confirmed unused.

Name filter uses `Filters[name]`: shared generic string Contains; trim query input, empty omitted. No guessed `search` hook needed. `PageNo/PageSize` use generic clamped paging (1–100), frontend default15, choices10/15/20/50/100; use actual TotalCount. Sort `Filters[sortField]=name`, `Filters[sortOrder]=1|-1`, shared Id tie-breaker; omitted sort defaults Id descending. No Boolean/date/enum/multiselect fields. Route state preserves applied name, page and sort; draft name changes do not alter paging/action refresh/export until Search. Excel exports all applied-filter pages and the same Name column through existing shared helpers.

## Detail/write and persistence

| Field | Form | Detail | Add | Update | Owner/validation |
|---|---|---|---|---|---|
| identity | no editable control | Id | omitted | Id | integer backend identity, positive selected row |
| Name | non-null FormControl<string> | Name nullable for existing rows | Name required,max250 | Name required,max250 | API trim/model validation; Angular trims, rejects whitespace-only and >250 |

Reviewer decision: use existing Add's250-character maximum and extend Update's old50 limit to match, avoiding the current create-then-uneditable defect (BE backlog4). Explicit feature VMs derive AddBaseVm/UpdateBaseVm; no shared-base change. EF Name max250 aligns the existing create boundary. Existing long/null/duplicate values must be inspected by owner before migration; no automatic cleanup/backfill/truncation. Business key is live tenant Name, using existing database collation, unique filtered `(SubscriptionId,Name)` index. Declare `UniqueColumns => [(x=>x.Name,"RecordAlreadyExists")]`; existing base performs exclusion of self and serialized writes. Existing localized RecordAlreadyExists supplies duplicate feedback; no invented resource API.

Four one-way AutoMapper maps: Add→entity, Update→entity, entity→Detail, entity→List. No ReverseMap or unnecessary Ignore. Entity unchanged; no calculation/accounting effect. EF config requires owner `Add-Migration AlignUnitsOfMeasuresNameAndUniqueness`; do not create/run migrations.

## Actions and integration

| Action | State/endpoint | UI and recovery |
|---|---|---|
| Create | POST UnitsOfMeasures `{name}` | editable modal; success closes and refreshes applied list; failed save retains form |
| View | existing row, GET UnitsOfMeasures/GetByWithNavigationsId/{id} | read-only modal, Close/Edit; skip lookups |
| Edit | existing row, same detail then PUT UnitsOfMeasures `{id,name}` | one typed modal, saved identifiers never editable |
| Delete | existing row → soft deleted, DELETE UnitsOfMeasures?id={id} | named shared danger confirmation; base usage helper blocks all live FK references; success refresh current/previous last page |
| Discard | dirty Create/Edit → closed after confirmation | shared confirmDiscard; Cancel/X/Escape/browser route leave use same dirty guard; View/pristine close silently |

Inbound references proven in models: Item.UnitsOfMeasuresId, PurchaseRequestDetail.UnitsOfMeasuresId, PurchaseOrderDetail.UnitsOfMeasuresId, GoodsReceivedNoteDetail.UnitsOfMeasuresId, BillDetail.UnitOfMeasuresId. `RemoveAsync` delegates to `RemoveWithChildrenAsync(id,CancellationToken.None)` with no owned relations; EF metadata owns the inventory. Generic RemoveAsync lacks the check (known backlog31); fix only this feature.

Reference action coverage: Job View/Edit/Delete apply; Labour Time, Invoice Customer, Close Job, Gate Pass, Lubrication Job are Not Applicable (no Job/labour/invoice/close state on unit). VehicleService nested item/part/profile actions are Not Applicable (no children). Branch extra fields/actions are Not Applicable. Activation exists only on generic backend, has no feature UI/visible state evidence: preserve compatibility endpoint; add no action. No Print workflow.

Overrides: UniqueColumns only for the name business key; RemoveAsync only for usage protection. Inherit Add/Update/List/Detail/Select/activation and controller endpoints. No backend custom endpoint/provider.

Canonical route is `/UnitsOfMeasures` only. Existing `create` and `details/:id` links redirect to list query intent (create/view), opened once by list and cleared afterward; no parallel editor route. Modal receives explicit create/view/edit + integer id and emits boolean changed; list owns refresh and caller focus. Scope includes route-leave guard for modal dirty state using existing shared PendingChangesGuard. Service providedIn root, environment.baseUrl, AppModule's existing interceptor client. Inline list/detail read errors explicitly skip global error presentation and use apiErrorMessage; save/delete use global error and success owners, local flags only. All requests finalize loading and takeUntilDestroyed; list requests switchMap/defer; closed/identity checks discard late detail responses.

Authentication retained (AuthGuard / authorized generic API); no permission system invented. Authorization candidates: Create POST, Edit PUT, Delete DELETE. State visibility is not security.

## Pre-edit conformance evidence

| Concern | Owning block | Actual reference/shared producer | Target before → frozen target |
|---|---|---|---|
| Bounded shell/title | UI1/3 | JobsComponent host sigma-route-host + Job HTML sigma-list-page/panel/header; FeatureTitleComponent/styles.scss | legacy card → identical shared chain and inset ownership, no local CSS |
| Filter | UI4 | Job form appFilterPanel, busy/resetRequested; FilterPanelComponent | absent → one labelled Name input, Search/Reset/Export; retain shared34px/control geometry |
| Table/page | UI5/6 | Job bindListQueries/onLazyLoad; DataTableComponent, resolveListPaging | ms-lib/unpaged → fill=true, typed Name sortable, server total, DEFAULT_PAGE_SIZE15, switchMap |
| Modal | UI13/10 | VehicleService requestClose + EditorDialogComponent | routed legacy buttons → controlled shared dialog, contentPadded=true, one field, width560px (source-supported simple-form content), no tabs |
| Validation/state | UI19/22/27 | FieldErrorComponent, StateMessageComponent, focusField | none → required/maxlength feedback, read retry, busy/close/focus handling |
| API | BE3/4/5/8/13 | BranchProfiler four one-way maps, generic Service.UniqueColumns/RemoveWithChildrenAsync | missing Detail map / broad VMs / unsafe delete → exact two-field read models, four maps, documented shared validation/delete hooks |

No new reusable mechanism is needed: adopt existing shared shell, filter/table, confirmation presets, query/route/export/field-error/state/focus helpers. Verification is source-only. No builds/tests/lint/browser/DB/commit/push/deploy/migrations authorized.

### Source correction before implementation

The initial integration row named PendingChangesGuard prematurely; scoped source confirms no such shared guard exists. Preserve the established Job route pattern instead: a typed local CanDeactivateFn adapter calls the list's canDeactivate, which delegates to its active dialog. This corrects the symbol evidence without changing the frozen dirty-exit behavior. Compatibility paths use typed CanActivateFn redirect adapters returning Router UrlTrees to the canonical list with a one-time editor intent. No new shared guard or parallel editor.

### Integration reconciliation decisions

The Name cell is plain typed text; the existing details entry is provided by the shared grid's accessible `rowInteractive`/`rowActivated` View workflow plus the explicit View action. This follows UI6's approved public interaction rather than inventing a feature link class. Edit/Delete remain independent menu controls and the shared table suppresses row activation from those controls.

Direct provider tracing found a redundant UnitsOfMeasuresService registration in LayoutModule (which already held unrelated changes). Remove only this feature's import/provider to use providedIn root and AppModule's one HttpClient; preserve other pending edits. Migration command corrected to `Add-Migration ChangeUnitsOfMeasuresNameAndUniqueness` to follow Master7's verb naming rule; no matching migration filename exists. Original suggested Align name was never generated.

## أزرار البحث في صف واحد — ١ نوفمبر ٢٠٢٦

نُفذ طلب المالك بوضع أزرار البحث وإعادة الضبط والتصدير بجوار حقل الاسم. التعديل S في صفحة قائمة بمحرر نافذة من الشكل UI01؛ الخلفية تبقى normal entity ولا تُعدل في هذه الشريحة. شُغّل فحص الحزم ونجح للثمانية، واستُخدم PHASE02 بتناسب مع UI4 ومالكه FilterPanelComponent الفعلي. للمكوّن مدخل inlineActions قائم يضع حقول البحث وشريط الأزرار في مسارين متجاورين؛ أضيف [inlineActions]=true فقط، مع إبقاء mainColumns=1 وstableLayout. لا قدرة مشتركة جديدة أو CSS أو نقل لزر إنشاء أو تغيير للأحداث.

تتبع المسار: pages/routing:599–603 ثم UnitsOfMeasures_Routes إلى UnitsOfMeasuresComponent؛ قائمة الأسماء الحالية وعمود الاسم وid للإجراءات تبقى كما هي. المقارنة المرجعية المختصة: نقطة speed-analysis ثم شاشة Stock/01-units-of-measures من لقطة ٢٠٢٦-١٠-٢٨، R0566 وC1653/C1652؛ تثبت قائمة ووظائف بحث/نافذة ولا تملك مظهر شريط Sigma. هذا طلب تنسيق واحد، فلا تغيير API/DTO/Mapper أو حقول أو تحقق أو صلاحيات أو حسابات أو حالة أو workflow. العقد القديم يبقى مرجع حدود الأعمال فقط؛ ملاحظة انجراف الحزم التاريخية فيه لا تصف فحص اليوم الناجح.

جرد الأداء/التحميل/الكاش المتناسب: الفلتر نص محلي لا يستهلك lookup؛ GET UnitsOfMeasures عبر getList مع name/grid/page، وgetAllList ينفذ fetchAllPages للتصدير كما كان. قراءة قائمة تشغيلية مباشرة وليست GetSelect المخزن في المصدر. List switchMap/defer مع startLoading وfinalize/endLoading وDestroyRef ما زال كما هو، ولا اشتراك جديد أو طلب لكل صف. المصدر cacheSelect=true مخصص لمستهلكي GetSelect، وكُتّاب create/update الناجحون يلغون المصدر عبر invalidateSelectOnSuccess؛ الشريحة لا تغير هؤلاء المستهلكين أو الكاتب أو التصدير. لا predicate/join/order جديد ولا فهرس أو مخطط مطلوب من تعديل العرض؛ قياس الزمن والقبول المرئي معلّقان ولا ادعاء تحسن مقاس. جرد حراس القائمة والمحرر الكامل خارج نطاق هذا التعديل الصغير ولم يُعاد تصميمه.

الملفان المعدلان في مستودع الواجهة هما قائمة UnitsOfMeasures HTML ودليل UserGuide/content/stock-guide.ts. حُدث موضوع وحدات القياس داخل دليل /UserGuide/stock بوصف ترتيب الأزرار بالعربية والإنجليزية. روجع فرق الملفين كاملًا، ونجح تحليل قالب Angular ودليل TypeScript وgit diff --check. لا تغيير كتاب/مهارة يحتاج توليدًا، ولا backend أو Add-Migration. لم تُشغل بناء أو اختبارات أو lint أو متصفح أو قاعدة بيانات أو commit. لا وكلاء لتناسب تغيير مدخل واحد؛ لا عمل مستقل يبرر التفويض. قبول المالك: تأكيد ظهور الأزرار بجوار حقل الاسم في العرض المعتاد وعمل البحث وإعادة الضبط والتصدير كما قبل.

رسالة حفظ مقترحة للواجهة: fix(units-of-measures): align filter actions with search
