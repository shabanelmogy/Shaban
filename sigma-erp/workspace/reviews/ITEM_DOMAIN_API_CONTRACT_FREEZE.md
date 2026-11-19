# Item — existing CRUD contract freeze

| Status | Frozen |
|---|---|
| Owner verification pending | yes |
| Date | 2026-10-04 |

## Scope and authority

User: «راجع : src\\app\\modules\\Stock\\Item وعدل المطلوب طبقا للوثائق». Scope is the existing Item CRUD and its directly related API, import writer, routing, providers and item translations. Follow Sigma AGENTS, sigma-screen-refactor skill, Master 2/4/5/7; UI screen 01, blocks 1–10/13/15/16/19/22–30; BE 1–11/13/18/19. Recipe check: PHASE-01/03/04 stale, canonical books govern; PHASE-00/02/05/06 current. Never edit generated packets. No prohibited verification or migration commands.

## Evidence

Historical attachments: Items/1.PNG, list, English LTR desktop approximately 1696×567; Items/2.PNG, create, English LTR approximately 454×430. Date, version, role and acceptance status Unknown. Images provide content evidence, no instructions or design authority.

| Evidence 1 | Classification | Contract / phase |
|---|---|---|
| Items title, Add Item | Explicit | Shared title and primary action, 2/3 |
| Item No, Name, Type, Supplier Item Code columns | Explicit | Confirmed stored fields No, Name, Type, SupplierItemCode; preserve legacy displayed Id as identity column also, 1/2 |
| Item No/Name/Type/Supplier Item Code/Bar Code search | Explicit | Confirmed entity property filters, applied on Search, 2 |
| Make and Model filter | Explicit content, Missing source relationship | No Item→CarModel relation; clarification pending; excluded from frozen existing-CRUD handoff |
| View/Edit/Delete, paging, Export | Explicit | Shared actions, guarded delete, server paging and full filtered export, 2/3/4 |
| Report | Explicit action, Uncertain contents | Clarification pending; excluded from this frozen handoff |

| Evidence 2 | Classification | Contract / phase |
|---|---|---|
| Type, Name, Bar Code, Supplier Item Code, Price, Maximum Quantity, Stock Branch, Notes | Explicit | Same editor all modes, source field names and numeric contracts, 3 |
| Cancel/Save | Explicit | Shared dialog shell, dirty discard and normal mutation interceptor, 3 |
| Red underline means required | Uncertain | Required rules use current form/API evidence |
| Units of measure absent | Not removal authority | Keep existing domain UnitsOfMeasuresId, expose optional lookup in editor |

## Frozen core decisions

UI shape 01: fields only, no children/totals/posting. BE pattern 1: normal Item entity; generic service/controller owns reads/map/save; feature hooks only uniqueness and safe delete. No invented permissions. AuthGuard and request tenant stay unchanged.

Grid properties: Id (legacy identity retained), No (server-owned number), Name, Type, SupplierItemCode. ListVM exactly these five properties. No/type/name/supplier/id sortable stored columns; enum sort is numeric. All five exported with the same translated column values. Filters No/Name/Type/SupplierItemCode/BarCode; all generic property matches before count, Type=0 preserved. Defaults 15 rows, page sizes 10/15/20/50/100, newest Id first; route holds applied filters/paging/sort. Edit filters do not affect paging/export until Search. Barcode is filter-only and omitted from ListVM.

Add: Name required, trimmed, max250; Type nullable VM + Required + EnumDataType(ItemTypeEnum); StockBranchId nullable + Required + positive FK; optional BarCode max250, SupplierItemCode (existing unbounded text), Price nullable nonnegative decimal(18,2) bounded by storage, MaximumQuantity nullable nonnegative int, UnitsOfMeasuresId optional positive FK, Note existing unbounded optional. Update same plus positive Id. No SubscriptionId/audit/No/nav objects from client. Existing null Type/branch rows load truthfully; user must choose before save. No existing-row assignment/backfill. Detail: Id, No, Name, Type, BarCode, SupplierItemCode, Price, MaximumQuantity, StockBranchId/StockBranchName, UnitsOfMeasuresId/UnitsOfMeasuresName, Note only. Nullable reads preserve historical values.

ItemTypeEnum numeric IDs are immutable: Battery0, Tyre1, BodyPart2, Electrical3, Mechanical4, Consumable5, Cushning6, SheetsForCars7, Walls8. Label Cushning as Cushioning; do not rename enum symbol or use ItemCategory/ItemType master table. Replace incorrect string-enum ordinal conversion with direct numeric values and translated options.

Name and nonempty barcode uniqueness already exist in ValidateItem import. Extend ordinary writes to the same keys using the shared serialized UniqueColumns hooks and active tenant unique indexes. Reviewer decision (owner standing rule): barcode max250 for bounded SQL index, optional in ordinary CRUD as current UI permits; retain import-template required barcode. Explicit Name properties reconcile Add250 versus Update50. No new supplier/note length policy. Price uses existing SQL decimal default18,2, no valuation/accounting calculations. Import Type and StockBranch now obey the same required/defined/positive-reference contract and numeric/length bounds; text-to-ID mapping stays import-only. Use existing import custom persistChunkAsync mechanism/shared uniqueness serialization if available; do not alter unrelated import workflows. Preserve import partial success semantics. No silent existing-data cleanup.

Delete: shared confirmation includes record name/number; block foreign live references before soft delete using RemoveWithChildrenAsync metadata owner, no owned child collections. Inbound inventory: purchase request/order/GRN details, BillDetail, JobItem/JobEstimationItem, ItemIssue/Return/Requisition/TransferItem, ServicePart, OpeningBalanceStock (scalar ItemId also inspect metadata). No cascade of business records. Failure retains row/form, both isSuccess false and HTTP errors handled.

Dropdowns use GetSelect Results<DropDownSelect>, body overlay/search/clear; source tenant/live list only. View shows backend relation names, no invented label. Edit rejects a saved ID absent from current selectable lookup. Lookup and detail failures have independent retry; saving blocked while lookups load/fail. Typed controls initialized before requests, canceled on destroy; focus first field without opening overlay, focus invalid control, restore origin; unsaved guard covers route/modal close. Canonical route /Item, legacy create/details redirect to list intent. Root service only; remove only ItemService redundant Layout import/providers.

## Conformance evidence before implementation

| Concern | Book | Actual reference / owner | Target |
|---|---|---|---|
| Bounded list/title/filter/grid | UI1/3/4/6 | Job list component + styles.scss, FeatureTitle/FilterPanel/DataTable | sigma-route-host→list-page→list-panel, fixed header/filter, fill=true grid; no local SCSS |
| Modal / modes / close | UI10/13/15 | VehicleService details + EditorDialog | One editor, padded shared grid two columns, width760 (8 fields, no tabs), scroll body, fixed shell actions |
| Enum / lookups | UI16 | TranslateOptionsPipe, enumOptions; VehicleService GetSelect | Exact numeric options, typed Results, no detached string conversion |
| Paging/export | UI2/8/28 | Job list; list-query helpers | switchMap applied-query reads, default15, fetchAllPages100 and identical columns |
| BE generic hooks | BE5/8/13 | BranchService; Service base UniqueColumns/RemoveWithChildrenAsync | Inherited CRUD, one-way four maps; import-only ignores retained |
| Numbers | BE11 | EntityBase/CodeCreateService/UnitOfWork | Read persisted No; Item currently uses fallback, no fabricated PRT or renumbering |

## Impact / migration / handoff

Id changes string→number and Type string→numeric are limited to Item feature DTO consumers (exact-symbol search). Other ItemService consumers use inherited GetSelect unaffected. ItemFullListVM has no active consumer and may be retired; DeleteVM retained for compatibility. Shared SecurityService Item VM code is commented, not changed. Changes are additive for read No and relation names, lean list is breaking only for consumers incorrectly depending on undisplayed fields (none found). Source-only owner verifies external consumers.

EF changes require owner Add-Migration ChangeItemValidationAndUniqueness. Before applying inspect existing long names/barcodes, duplicate active tenant names/barcodes, and null/invalid required fields; no data rewrite authorized. No numbering/index format change. FE and API deploy together. Runtime compilation, serialization, SQL filtered indexes/concurrent writes/import, RTL/theme/focus and delete blockers pending owner.

Independent implementation handoff is Frozen for the core above. Make/Model and Report remain separate pending decisions, never implied approved by this artifact. Root owns FE/integration/artifacts; bounded backend worker owns Item VMs/config/profile/service and Item-only ImportDataService slice, no shared base or migration edits. Preserve all existing worktree changes.

## Addendum — catalogue report decision, 2026-10-04

After independent CRUD implementation and reasonable time for optional clarification, root selected the minimal source-supported catalogue report under Master2 rule6 and froze ITEM_MAINTENANCE_EVOLUTION_PLAN.md before the report slice. Report is now included: shared read-only printable dialog of the same complete filtered/sorted five-column list; existing paged API, no backend change. Contents are a labelled reviewer decision, not screenshot-proven report semantics. Make/Model remains excluded/pending. Update Id positivity uses existing base lookup404 rather than hiding inherited Id. Source inspection confirms OpeningBalanceStock ItemId has a real EF FK. Remaining core handoff unchanged.

## Addendum — advisory duplicate feedback, 2026-10-04

Apply existing UI12/19 and BE8 shared advisory feedback to the now-confirmed Name and nonempty BarCode rules. Name/barcode updateOn blur, uniqueFieldValidator with edit identity/trim/ready gate, View no checks. Save awaits settleStepValidation before snapshot; body inert while settling, shared FieldError shows pending/taken/unavailable, retry Save refreshes failures. No new API or shared owner; BaseService.CheckUnique and backend UniqueColumns own the same keys. Reference IndividualPartner attachUniqueValidators/settleValidation and shared helper inspected; server serialized write remains authoritative.

Integration clarifications: preserve the existing Create Price=0 and MaximumQuantity=0 defaults; clearing either produces null (optional). Price must be finite and less than 1e16 in JS, since the exact decimal(18,2) maximum rounds to 1e16 in JS; backend remains exact decimal storage-bound validation. No client rounding/formula added. High-magnitude fractional values remain limited by existing JS number transport and require owner verification. Report/export distinguish plain business Error from HttpErrorResponse so only backend body.message/fallback is used for HTTP failures. Dialog loading focus stays on Close, failure focuses Retry, readiness restores the primary usable field/action.

## عقد تسريع فتح صنف جديد — ١ نوفمبر ٢٠٢٦

الحالة Frozen لشريحة فتح المحرر. طلب المالك صراحةً معالجة بطء إضافة Item، وأكد أن المقصود New item. الشكل UI01 (قائمة مع نافذة حقول)، والخلفية normal-entity مع Select مرجعي؛ لا إعادة تصميم لأعمال الصنف أو القائمة أو الأرقام/الضريبة. المسار الفعلي Item_Routes/ItemsComponent.openCreate → openEditor(create,null) → DetailsComponent، بلا HTTP قبل إظهار visible. انتظار الفروع والوحدات يبدأ في ngOnInit ويعطل النموذج كاملًا عبر loadLookups/syncFormState رغم أن الحقول النصية لا تعتمد على القائمتين. القراءتان تعملان بالتوازي أصلًا؛ لا ادعاء أن forkJoin تسلسلي أو أن طلب تفاصيل Item يحدث في الإنشاء.

عقد القراءة المجمد: GET Branch/GetSelect وUnitsOfMeasures/GetSelect يبقيان URL وResults<DropdownDto> وId/Value/No وtenant/live والنطاق دون تغيير. كلا المصدرين cacheSelect=true فعلًا. تُستبدل مادية الكيان الكامل/reflection في الخدمة الخاصة بكل مصدر بإسقاط no-tracking للهوية والاسم والرقم مع نفس fallback للاسم الفارغ أو whitespace إلى No ثم النص الفارغ؛ لا ترتيب جديد أو حد صفحات أو استبعاد أو IsActive إضافي. generic repository/shared controller خارج التعديل. التغيير يحسن مصدرين يشترك فيهما مستهلكون آخرون دون تغيير العقد.

عقد الواجهة المجمد: فتح النافذة مباشرة كما هو، مع إتاحة الحقول المستقلة أثناء تجهيز الخيارات وتعطيل حقلي الفرع والوحدة فقط حتى نجاح المصدرين؛ الحفظ يظل ممنوعًا قبل الجاهزية أو عند الخطأ. المحافظة على الفرع الافتراضي ومسودة المستخدم وunique validation والمبالغ/الكمية والعلاقات وpayload. bootstrap منتهٍ يتعامل مع EMPTY كفشل قابل للإعادة، ثم watch منفصل لكل مصدر ناجح عبر ReferenceLookupBindings. تبقى القيم المختارة وتوصف التسمية المحتفظ بها دون تغيير المسودة، وتُعطل الخيارات المحتفظ بها الغائبة عن المصدر. ReferenceLookupStatus المحلي يملك مؤشرًا واحدًا للـbootstrap والخطأ/Retry. سياق منتهٍ يلغي القراءة/المراقبة ويخفي بياناته ويعطل المحرر؛ الكتابة المرسلة مستقلة ولا تُلغى بتغيير السياق.

المراجع: نقطة speed-analysis وشاشة 15-stock/03-items وR0563/C1684/C1685 من لقطة ٢٠٢٦-١٠-٢٨، ومتحكم الإنشاء المحلي الخام الأسطر465612–465775؛ تظل خصائص Make/Model وقواعد السعر/الصلاحيات المرجعية خارج هذه الشريحة طبقًا للعقد الجاري. UI2/13/22/28/29 وBE7/2 وPHASE01/03/05/06 بتناسب بعد Check ناجح للحزم الثماني. يُسجل قياس cold/warm قبل/بعد والشبكة/SQL كتحقق مالك معلق، ولا قياس سرعة مزعوم من تقليل الحقول. المصدران مفهرسان بمفاتيح الاسم/الاشتراك الحالية، ولا predicate/join/order جديد يبرر فهرسًا أو schema لهذه الشريحة.

التفويض بعد التجميد: الجذر يملك محرر Item والدليل والتوثيق والمصالحة؛ وكيل خلفي محدود يملك BranchService.cs وUnitsOfMeasuresService.cs فقط. النطاقان مستقلان بعد تجميد الاستجابة، بلا تداخل ملفات، والجذر يدمج ويراجع الكل.

إضافة نطاق معتمدة من المالك أثناء العمل: حقول بحث Item الخمسة (رقم، اسم، تصنيف، كود المورد، باركود) تُعرض في صف واحد عبر mainColumns=5 بدل3. مدخل مشترك قائم لا CSS جديد؛ تستمر استجابة المكوّن بثلاثة أعمدة عند1250px أو أقل وعمود عند720px أو أقل. الأزرار وأحداثها والفلاتر المطبقة وpaging/export/report لا تتغير. الجذر يملك هذا التعديل الصغير والدليل، ولا يتداخل مع خدمة المصدرين الخلفية المفوضة.

## المصالحة النهائية لفتح صنف جديد وصف البحث — ١ نوفمبر ٢٠٢٦

الحالة: نُفذت الشريحة المجمدة وروجع فرق المصدر، والتحقق التشغيلي والقياس عند المالك. لا ادعاء زمن فتح مقاس. شملت الواجهة محرر Item في TS/HTML، وقائمة Item في HTML، ودليل stock-guide.ts؛ وشملت الخلفية BranchService وUnitsOfMeasuresService فقط. لم تُمس تغييرات وحدات القياس وأنواع الأصناف والتحميل المشترك السابقة.

| المسار | قبل التنفيذ | بعد التنفيذ ودليل المصدر |
|---|---|---|
| إظهار New item | openEditor يضبط editorVisible فورًا؛ لا HTTP قبله | كما كان؛ لا قراءة تفاصيل Item في create ولا تأخير مصطنع |
| انتظار خيارات الفرع والوحدة | forkJoin بطلبين متوازيين، يعطل النموذج كله | طلبان متوازيان كما هما؛ الحقول المستقلة متاحة فورًا وحقلا الخيارات فقط معطلان حتى نجاح bootstrap، والحفظ محمي بالعلم والخطأ والتحقق النهائي |
| Branch/GetSelect | generic GetDropdownAsync يحمل Branch كاملًا ويستخرج النص بالانعكاس | Query<Branch>().AsNoTracking().Select(Id,Name,No) ثم نفس .NET whitespace fallback إلى No أو empty؛ نفس Results metadata |
| UnitsOfMeasures/GetSelect | نفس المادية العامة والانعكاس | إسقاط هوية/اسم/رقم فقط دون تتبع، مع نفس fallback وmetadata |
| القراءة المخزنة | المصدران opt-in فعليًا لكن المحرر لا يراقب التحديث | finite successful forkJoin ثم ReferenceLookupBindings مرتان فقط؛ defaultIfEmpty(null) يترك فشلًا قابلًا للإعادة بدل تمكين نموذج بلا خيارات |
| التفاعل أثناء الانتظار | الحقول كلها معلقة؛ مسار الإغلاق يرفض أثناء lookup pending | الكتابة المستقلة متاحة، والرفض/الإغلاق يحترم blur قبل dirty ثم confirmation؛ لا فقد للنص المؤجل ولا سرقة focus عند اكتمال الخيارات |
| صف البحث | خمسة حقول موزعة على شبكة3 | mainColumns=5 في FilterPanel؛ حقول no/name/type/supplierItemCode/barCode في صف واحد فوق1250px مع استجابة المالك المشترك (3 أعمدة حتى1250 وعمود حتى720). أزرار التقرير والتصدير والبحث وReset باقية بعقودها |

مطابقة حقول القائمة: Id/No/Name/Type/SupplierItemCode ما زالت قائمة الأعمدة وListVM نفسها؛ الباركود فلتر فقط. حقول الإنشاء ونوع الصنف والسعر والكمية والفرع والوحدة والملاحظات وpayload/أرقام الخادم وقواعد uniqueness لم تتغير. لا DTO أو AutoMapper أو صلاحيات أو حقل أو حساب مالي جديد. الـView/Edit يستخدمان نفس المحرر؛ تفاصيلهما ما زالت قراءة تشغيلية مباشرة مع هوية السجل، ولا تحويل لعلاقات المرجع إلى بيانات صالحة للكتابة تلقائيًا.

### مصفوفة كاش وتحميل الشريحة

| المصدر/العملية | المالك والتبني النهائي |
|---|---|
| Branch/GetSelect؛ BranchService | cacheSelect=true، finite read عبر BaseService→ReferenceLookupCacheService، ثم watchSelectList منفصل بعد النجاح. createBranch/updateBranch/deleteBranch تستهلك invalidation الناجح؛ قناة lookup-branches مسجلة على Branch في RealtimeServiceCollectionExtensions:32 |
| UnitsOfMeasures/GetSelect؛ UnitsOfMeasuresService | cacheSelect=true ونفس المالك المحدود بالسياق؛ create/update/remove تبطل المصدر الناجح، وقناة lookup-units-of-measures مسجلة على UnitsOfMeasures في RealtimeServiceCollectionExtensions:25 |
| تبليغ الكُتّاب/الاستيراد | RealtimeSaveChangesInterceptor→RealtimeCommitTracker يجمع تغيرات الكيان للمستأجر وينشر بعد الحفظ/الالتزام. لم يُعثر ضمن مصادر الاستيراد ذات الصلة على كاتب مستقل للفروع أو الوحدات؛ أي مسار EF على الكيان يمر بالتتبع المشترك، وفجوة socket/ambient transaction تحتفظ بتسوية TTL القائمة. لا توسيع opt-in أو topic جديد |
| الحفاظ على المسودة | selected/current getters تحفظ تسميات الاختيار؛ mergeSelectOptions يعطي المصدر الوارد أولوية، وتسمية التفاصيل لا تُدمج إلا عند تطابق معرفها مع الحقل الحالي. الغائب المحتفظ به disabled ويظل عرضًا ولا يمنح أهلية جديدة؛ validators وoptionDisabled فعليان |
| تغير السياق/الإغلاق | cancelReads وDestroyRef ينهيان القراءات والمراقبة. تغير السياق يزيد الهوية ويفرغ الخيارات/التفاصيل ويعطل المحرر ويظهر screenContextChanged دون إعادة دمج بيانات قديمة. صُفر علم تأكيد التجاهل بعد إلغائه حتى لا يحتجز الإغلاق. الكتابة المرسلة لا تستهلك cancelReads؛ الاستجابة/الاستعادة محروستان بالسياق، ولا يمكن الإغلاق أثناء saving |
| مرئيّة التحميل | ReferenceLookupStatus داخل EditorDialog يرث LOOKUP_LOADING_SCOPE=dialog، فيعرض bootstrap المحلي مرة واحدة مع الخطأ وRetry. aria-busy وحراس الحفظ باقية. Detail read يملك start/finalize العالمي ورسالة الحوار المحلية الموجودة التي تخفي المضيف الخلفي عبر المالك المشترك؛ Save يبقى global counter وغطاء EditorDialog المحلي. تحديث الكاش المحتفظ بالقيمة صامت، وفشله يظهر الإعادة دون استبدال المسودة |
| قراءات مستبعدة | Item/GetByWithNavigationsId وطلبات تحقق Name/BarCode وPOST/PUT Item تشغيلية/تحقق مباشر؛ لا كاش سياسة أو availability أو كتابة. نوع الصنف enum محلي وليس طلبًا شبكيًا |

### الاستعلام والفهرس والتحقق

Query<T> يستعمل TenantSet ثم SubscriptionId وIsDeleted!=true؛ يطابق شروط القراءة العامة قبل التعديل بما في ذلك null-live، دون IsActive أو ترتيب أو حد/صفحات جديد. إسقاط أعمدة فقط ثم fallback .NET يحافظ على whitespace Unicode بدل اختلاف SQL trim. لا علاقة فرعية أو N+1 أضيف. الفهارس المعلنة والمثبتة في configuration/snapshot هي PK Id وunique filtered (SubscriptionId,Name) مع IsDeleted=0 لكلا المصدرين. لا predicate/join/order جديد يستلزم فهرسًا، ولا يُدعى أن الفهرس المرشح يغطي null-live تمامًا. لا schema أو Add-Migration لهذه الشريحة. جميع مستهلكي GetSelect الآخرين يحتفظون بغلافه وحقوله ونطاقه؛ تختلف المادية الداخلية فقط.

القياس عند المالك: نفس المتصفح/الجهاز والشبكة والاشتراك والفرع وأعداد الفروع/الوحدات؛ خمس عينات cold cache وأخرى warm cache قبل/بعد مع median، والزمن من ضغط New item حتى إتاحة الاسم ثم جاهزية الاختيارات، وعدد/حجم GETs ومدة SQL/خطة التنفيذ. في warm لا يُفترض HTTP إذا ظل المصدر صالحًا؛ راقب TTL/rejoin والفشل/Retry والإغلاق أثناء الانتظار وتغير السياق دون انتظار كتابة نشطة. لم يُنفذ قياس أو SQL أو تشغيل، فلا نسبة تحسين أو ضمان زمن من المصدر وحده.

فُحصت namespace وglobal using للـEF/Results وDropdownDto الفعلي في SiGma.Helpers.Dtos، ومراجع SiGma.Business إلى Helpers/Repos/DataAccess/ViewModels. راجع الجذر كامل الفروق المحددة في مستودعي الواجهة والخلفية، ونجح فحص صياغة TS للمحرر والدليل وقالبَي Angular للمحرر والقائمة وgit diff --check للملفات المحددة. لم يُشغل build أو tests أو lint أو متصفح أو قاعدة بيانات أو migration أو commit. فحص الحزم الثماني ناجح في البداية؛ لا قاعدة مشتركة جديدة أو كتاب/مهارة معدلة في هذه الشريحة تستلزم التوليد.

اكتمل دليل /UserGuide/stock داخل UserGuide/content/stock-guide.ts بموضوع Item: الحقول الخمسة في صف، كتابة البيانات أثناء تجهيز الاختيارات، منع الحفظ حتى الجاهزية، Retry وحفظ المسودة وإعادة فتح السياق. لا ترجمة أو route دليل جديد. راجع الوكيل backend_audit الخدمة الخلفية المحدودة ونفذ الملفين، ثم دقق المحرر قراءة فقط؛ أعاد عيب علم التأكيد الذي أصلحه الجذر وتحقق الوكيل من إصلاحه، ولا ملاحظات مؤكدة أخرى. استخدام وكيل واحد كان لتوازي القراءات الخلفية مع تعديل الواجهة بعد تجميد الاستجابة، دون تداخل ملكية.

رسالة حفظ مقترحة للواجهة: fix(item): unblock new item fields while reference choices load

رسالة حفظ مقترحة للخلفية: perf(lookups): project branch and unit select rows without tracking
