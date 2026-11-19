# Workshop, Workshop Movement and NRM discovery

متابعة تنفيذ محدودة بتاريخ٣١ أكتوبر٢٠٢٦: طلب المالك تحويل Open Workshop Movement إلى تبويبات. أُنجزت شريحة العرض «البيانات/المستندات» في المحرر المشترك، مع الملاحظات في البيانات وفتح تبويب الخطأ والطباعة الكاملة. الملحق الأخير يحكم هذه الشريحة فقط؛ Status Draft والتوصيات التاريخية أدناه تخص الاكتشاف الأوسع ولا تعني تجميدًا أو إنجازًا لكل Workshop/NRM.

| Field | Value |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Scope | Read-only source discovery for Angular Movements/Workshop, WorkshopMovement and NRM |
| Source baseline | Frontend HEAD 3886cdef (root-confirmed); backend read-only |
| Handoff | Root owns freeze and final decisions; no source edits authorized to this agent |

Authority: `F:/My Work/Sigma/AGENTS.md`, screen-refactor skill, canonical split UI/BE blocks and UI screen01 catalog. Root reports recipe drift in all generated phases except Phase01; canonical blocks prevail. Applicable shapes: Workshop is a normal master entity; WorkshopMovement and NRM are normal movement records, fields plus WorkshopMovement's single small document child collection, without totals, approval or posting. UI01 list with controlled modal editor applies. Job is the approved list-shell/reference source; shared EditorDialog declarations and UI13 controlled composition own modal integration (Fleet/Vehicle is routed and is not a modal reference).

## Source distinctions

`Movements/Workshop` consumes `WorkshopController` / `WorkshopService` / `Helpers.Models.Workshops.WorkShops.Workshop`, a named internal-workshop master (`EntityBaseWithName`). It is independent of the supplier relation on `WorkshopMovement`.

`WorkshopMovement.WorkshopId` and `Workshop` navigation point to Supplier. Therefore `Supplier/GetSelect` is the current correct workshop lookup. The entity separately has `InternalWorkshopId` / `InternalWorkshop`, `VehicleServiceId`, `ExternalWorkshop` (max200) and Amount (decimal18,2) used by other owning sources; none are in the Movement Add/Detail/List DTO contract. Do not replace Supplier with Workshop/GetSelect or expose the extra entity fields in this scope. `WorkshopService.POST vehicles` is an additional vehicle-grid contract, owned by Workshop/workshopVehicles rather than Movements/Workshop; this review does not change it.

## Exact API and frozen-candidate contract

All endpoints inherit authorized `SiGmaControllerBase` routing `[controller]`. GET `/Workshop` uses inherited GetManyAsync. GET `/WorkshopMovement` and `/NRM` override the controller to call their feature GetManyWithNavigationsAsync. POST feature root creates; PUT root updates; DELETE root takes `id`; inherited `handleActivate`, GetSelect, GetById/{id}, GetByWithNavigationsId/{id}, GetAllWithNavigations exist. API failure is either a result's `isSuccess:false` or a transport error; ToActionResult maps failures to StatusCode/default400. The custom movement list controllers currently return Ok even for an unsuccessful list result.

### Grid/DTO match

| Screen | Current business columns | Minimal frontend row/DTO consumed by those columns/actions | Current backend over-scope |
|---|---|---|---|
| Workshop | Existing name, sku, categoryName, createdBy, createdAt; sku/categoryName have no producer | Source-supported replacement: id, no, name, createdAt; createdBy only if root elects to retain current valid column | Inherited ListBaseVm includes SubscriptionId, flags, GUID, audit; no sku/categoryName/localizedName producer |
| WorkshopMovement | no, plateNo, makeAndModel, workshopName, workshopCode, dateOut, dateIn; View/Print need id | id + the seven displayed properties | workshopMovementNo duplicate, type/typeName/dateOf, vehicleId/driverId/workshopId, fuelLevel/KMs, PurchaseOrderNo/Notes, status/createdAt and nested Vehicle/Driver/Workshop/Document unused by grid |
| NRM | no, typeName, plateNo, makeAndModel, staffName, staffCode, dateOut, dateIn; View/Print need id | id + eight displayed properties; type additionally needed for translated type presentation | nrmNO duplicate, dateAndTime, vehicleId/staffId/customerId/branchId, fuelLevel/KMs/notes/status/valuePerDay/valuePerKm and nested objects unused by grid |

Both movement services project No as movement-specific number ?? base No ?? Id.ToString(). DateOut and DateIn both equal the one timestamp. WorkshopMovement TypeName is enum ToString and NRM TypeName is enum ToString; frontend translations should use numeric Type and shared enumOptions/enumKey when required rather than showing raw C# names. These are display aliases, not separate dispatch/return timestamps.

### Filters/order/paging/defaults

| Concern | Workshop | WorkshopMovement | NRM |
|---|---|---|---|
| Supported filters | Generic entity-property Filters: name/no/createdAt/isActive etc.; string Contains, date calendar-day equality, numeric/bool equality. No SearchColumns, so generic search key has no effect. Minimal name/no filters are supported. | movementNo (alias workshopMovementNo): Contains on specific/base No; type >=0 equality; plateNo Contains; workshopId>0 equality against Supplier; fromDate >= DateOf.Date; toDate <= last tick of calendar day | movementNo (alias nrmNo): Contains on specific/base No; type>=0 equality; plateNo Contains; staffId>0 equality; fromDate/toDate inclusive calendar days |
| Unsupported current filter | No frontend filters | status ignored | status ignored |
| Order | Base accepts stored entity property Filters[sortField], sortOrder -1 desc else asc; newest Id desc fallback/tie-breaker | Fixed DateOf desc, ignores sortField/order; no Id tie-breaker | Fixed DateAndTime desc, ignores sortField/order; no Id tie-breaker |
| Paging | Both omitted returns complete list; otherwise page>=1,size1..100; fallback1/10; TotalCount and TotalPages returned | Always page>=1,size1..100; fallback1/10; TotalCount/PageNo/PageSize, no explicit TotalPages | Same as WorkshopMovement |
| Frontend starting size | Adopt shared DEFAULT_PAGE_SIZE15 and standard10/15/20/50/100 | Current shared default15; current local choices omit15 but shared DataTable normalizes legacy standard | Same |
| Date default | No range filter required for minimal master | Current null range is drift; UI17 says currentMonthRange and reset to current month | Same |

Custom movement lists explicitly scope tenant `_subscriptionId` and soft-delete `!=true`. Request filters are sent as Filters[key]. Angular-only correction must remove unsupported status and sortable claims, omit ineffective sort params, keep fixed server order and supported filters, and not change producer APIs. All-pages export can use fetchAllPages and existing TotalCount fallback to calculate page count. Every request must use the applied snapshot, not unsaved filter edits. Date-only filters must use parseDateRange/toApiDate, never toISOString.

### Add/update/detail

| Screen/field | Backend shape/rules | Current Angular consumer/default |
|---|---|---|
| Workshop name | AddBaseVmWithName Required max250; UpdateBaseVmWithName Required max50; Update Id only | Name currently unvalidated; unrelated LocalizedName/audit/tenant/flags controls and payload members have no write producer; retain legitimate display fields only, name write only |
| Workshop detail | DetailBaseVmWithName (id/no/name + inherited audit/flags/tenant); no LocalizedName | Current form expects nonexistent LocalizedName and deleted audit fields; createdAt/createdBy available if retained as read-only display |
| WorkshopMovement dateOf | DateTime, no date DataAnnotation; Add service default DateTime.UtcNow when default | Required UI, new Date default; preserve required and use dateTimeValueValidator/toApiDateTime |
| WorkshopMovement vehicleId | int? | Required UI selection; keep existing requirement (no stricter new backend invariant) |
| WorkshopMovement fuelLevel | Nonnullable FuelLevel0..8; no EnumDataType attribute currently; omitted maps default0 | Current nullable UI; sending undefined omits it and server defaults Empty0. Existing shared `_metronic/shared/enums/fuelLevel.ts` is root-confirmed owner |
| WorkshopMovement kms | int? (Int32); no Range/nonnegative contract | Numeric optional; preserve integer transport and zero; do not invent nonnegative rule |
| WorkshopMovement driverId/workshopId/type | int?, int? Supplier, WorkshopMovementType?0..4 | Optional null defaults; Vehicle/Driver/Supplier/GetSelect; shared enum numeric options |
| WorkshopMovement PurchaseOrderNo/Notes | string? max100 / string? max2000 | Optional. PurchaseOrder/GetSelect optionValue no; editable free reference input currently allowed |
| WorkshopMovement documents | List<CustomerDocumentAddVM>? / UpdateVM children / detail children | Parent's single document collection. No document identities on Add payload; one tracker owns upload cleanup |
| NRM type | Nonnullable NrmMovementType0..4, no enum DataAnnotation | Required, default0=NrmStaffMovement; retain numeric wire |
| NRM dateAndTime | DateTime; service defaults UtcNow when default | Required UI, new Date default; shared datetime transport |
| NRM vehicleId | Add/Update int; entity/detail int? | Required UI; Vehicle/GetSelect |
| NRM fuelLevel/kms | string? max50 each | Optional text. Fuel choices currently `Empty`,`1/4`,`1/2`,`3/4`,`Full`; preserve string wire, not numeric fuel enum. KMs is text, not numeric |
| NRM staffId | int? | Optional Staff/GetSelect |
| NRM notes | string? max2000 | Optional |
| NRM extra DTO fields | valuePerDay/valuePerKm decimal?, customerId/branchId int? | Not exposed by current UI, no formula/lifecycle supported; do not add them |

WorkshopMovement Add also declares optional WorkshopMovementNo, but existing UI does not edit it; numbering remains server-owned/omitted. Update does not declare this field. WorkshopMovement detail navigation graphs return Vehicle/Driver/Supplier and documents; NRM inherits deep detail loading from generic Service, so no new projection endpoint is needed. Minimal frontend detail fields are id/no/specificNo for subtitle, actual displayed form values, and documents when applicable. Nullable fields must retain zero via `??`, not `||`.

CustomerDocumentAddVM exact boundary: documentType nullable numeric DocumentType0..38 with Required+EnumDataType; documentNumber Required max100; issuedBy optional max100; documentPath optional max400; issueDate Required; expiryDate Required with strict DateAfter(issueDate); isInternational bool. The shared DocumentRow/createDocumentRow/documentPayload factory enforces this rule set. Existing local document list maps numeric indices to hardcoded English string enum labels, uses untyped standalone ngModel, defaults Other38, native date inputs and silently removes rows. Current file selection saves only file.name; there is no upload. UI18 canonical owner is `app-documents` (CompanyPartner/components/detalisForm/documents) plus DocumentUploadTracker/partner-editor models/form factory. Use stored path upload in CustomerDocuments and preserve dates/path on View; Add payload may omit helper id and unused isInternational can remain false unless already displayed.

### Action-state and route contract

| Screen | Current useful UI actions | Source-supported target boundary |
|---|---|---|
| Workshop | legacy table create; name link detail. Unrendered header update/delete methods; unrelated console-only loyalty/house-account/tag menu | Normal master Create/View/Edit supported by inherited API; retained Delete requires shared confirmation and root choice. No new supplier/vehicle workflow |
| WorkshopMovement | Create/View/Print only | Keep Create/View and repair record print through rendered selected detail + ReportPrintService; do not expose Edit/Delete/activate solely because generic API exists |
| NRM | Create/View/Print only | Same; no Open/Close state transition |

WorkshopMovementStatus enum exists but is not a persisted WorkshopMovement property and no feature controller action consumes it. Service Status Completed is constant. NRM has no state property and Status Close is constant. Status/lifecycle semantics remain undefined and cannot authorize return/close/cancel/edit/delete restrictions or new timestamps.

Each route currently has root/list, details/:id and create. Workshop master editor reads route params, but navigates unrelated `/manage/workshops`/`inventory/Workshop`; movement editors are controlled Input components yet their legacy routed create/details entries receive no visible/mode/id binding and do not hydrate params, so direct route renders an invisible editor. UI1 legacy-route compatibility should route these entries through the list-owned modal and consume id/create context; do not add parallel editors. Parent pages/routing.ts mounts `/Workshop`, `/WorkshopMovement`, `/NRM`; root owns any outer route/toolbar reconciliation.

## Conformance evidence and confirmed frontend findings

| Concern | Book block | Approved actual owner/reference | Target source evidence / action |
|---|---|---|---|
| Container-fill/shared list shell | UI1/3/6 | Job list metadata host sigma-route-host; HTML sigma-list-page/panel/header/table; shared src/styles.scss | WM/NRM use custom prefixes, viewport calc and <=768px overflow visible; Workshop card/table-list. Replace with shared chain; no list SCSS |
| Filters/reset | UI4/17 | Job HTML form[appFilterPanel], sigma-filter-field, appFilterActions; FilterPanelComponent busy/resetRequested/default6 columns | WM/NRM custom two rows, no Reset, wrong null range, status ignored. Restore five supported filters, currentMonthRange + reset and shared directive calendar |
| Columns/paging | UI5/6 | DataTableColumn public type/sortable; list-query DEFAULT_PAGE_SIZE15/resolveListPaging | Current movement fields claim sortable although backend ignores it; keep fixed order. Workshop sku/categoryName fictional. Shared page size and authoritative total |
| Async/error ownership | UI2/22/28 | Job.bindListQueries Subject+switchMap+defer+finalize; apiErrorMessage/StateMessage | WM/NRM independent subscriptions race; lookups catchError to null silently. Add cancellation, lookup error/retry and no stale dialog patch after close/id change. Workshop lacks error callbacks and finalizers |
| Export | UI8 | Job.exportExcel + dataTableExportRows + onExportToExcel; list-query fetchAllPages | WM/NRM manually CSV-export current page only, unescaped quote risks, date copies. Use full applied filters and grid columns; fail whole export on page failure |
| Modal/header/close | UI13/15/10 | EditorDialog inputs subtitle/contentPadded/closeDisabled/primaryActionDisabled, escapeRequested; confirmation service confirmDiscard | Current modal no identifier subtitle, local padding/layout; save double-submit and close during saving possible; requestClose closes when saving because dirty condition is false. Guard saving/loading/confirmation and bind Escape |
| Fields/lookups/enum | UI16/17/19/27 | date-utils dateTimeValueValidator; DatePicker directive; translateOptions/enumOptions; FieldError | Current untyped FormGroup, id instead of inputId on PrimeNG, no validation messages/date validators/length limits; duplicated option templates; toISOString shifts every date/time |
| Documents/upload | UI14/18 | shared DocumentRow/factory; Company app-documents; DocumentUploadTracker | Current raw table/ngModel/manual file.name/no validation/removal confirmation; migrate existing child contract without new lifecycle |
| Print | UI21/28, UI30 resolved24 | ReportPrintService.print/createSession | Both row print methods ignore row and call window.print: prints list rather than selected record. Load/view selected record before print and guard loaded id |

Known backlog matches: UI30 feature copies39, bare print resolved24 (these targets still retain it), local editor padding36, server-field payload8/19; BE19 name limits4, ListBase over-scope6, redundant ReverseMap21, no-token27. Backend defects are recorded here only; backend remains read-only for this Angular scope.

No builds, tests, lint, browser, database, migrations, snapshots, commits, pushes, deployment, SigmaMCP or Graphify were used. Source-only finding confidence does not imply runtime, visual, theme/RTL or compiler acceptance. No application source/shared/i18n/canonical docs edited.


## تبويبات فتح حركة الورشة — ٢٠٢٦-١٠-٣١

الطلب والتناسب: «Open Workshop Movement عدل الشاشة الى تابات». شريحة S لتكوين المحرر الحالي وفق Master1؛ إعادة استخدام UI13 وEditorTabs دون تغيير مالك مشترك أو عقد أعمال، لذلك لا ملف freeze/خطة جديد ولا وكلاء لمسار تعديل صغير مترابط. القرار Frozen ضمن الشريحة: تبويبان أفقيان Information/Documents، كل حقول الحركة والملاحظات في الأول، ومستندات الحركة في الثاني. تستخدم Create/View نفس المحرر؛ لا إظهار Edit جديد. لا تغيير supplier workshop إلى Workshop master، ولا حقول أو أزرار أو حالات أو قيم أرقام جديدة.

المسار والأدلة: pages/routing.ts:428–432 ← Movements/WorkshopMovement/workshopmovement.routes.ts ← list يستضيف WorkshopMovementDetailsComponent كـEditorDialog. الشكل UI01 قائمة مع modal fields +single document collection بلا totals، والخلفية operational movement بالنمط2 الحالي. قُرئت مهارة Sigma وUI13/شكل01 ومالكا EditorDialog/EditorTabs/FormSection الفعليان، وحزمة PHASE03 بعد Check الثماني الناجح. مدخل تحليل Speed ثم لقطة٢٨ أكتوبر sidebar/13-movements/screens/02-workshop-movements.md تربط R0296 وC1457؛ قرئت مقدمة C1457 (raw/application.js:398474–398953) لتعريف نافذة الفتح والوثائق ومرجع أمر الشراء والملاحظات. قورن الشرح الأصلي S113 library/text/90c6e368ce903381.txt (لقطة٢٧ أكتوبر) ومدخل دليل movements الحالي. المرجع يثبت سياق الفتح/الوثائق، لا يفرض تبويبات أو قواعد permissions/PO/Notes جديدة في سيجما؛ تصريحه بإعدادات/صلاحيات المرجع لا يعتمدها تلقائيًا. فجوات الوظائف الأوسع تبقى في الاكتشاف أعلاه ولا تُستبعد من هدف المنتج المرجعي؛ هذه الشريحة لتنظيم الموجود فقط بطلب المالك.

التنفيذ: EditorTabsComponent مستورد بواجهة typed WorkshopMovementTab وحالة activeTab، افتراضي Information عند كل syncState/session. الـtabs تستخدم labels مترجمة ومظهر underline الأفقي المشترك، وID prefix فريد workshop-movement-editor وروابط tabpanel/aria-labelledby/keyboard roving المملوكة للمشترك. بنيت body/form/scroll على shared sigma-editor-body/form/scroll، مع tab strip خارج منطقة تمرير الحقول وفوتر EditorDialog الحالي؛ لا feature SCSS أو ألوان أو حساب ارتفاع جديد. لم تتغير شبكة الحقول/عروضها أو الأزرار/المرجع القابل للكتابة.

القسمان يظلان mounted داخل FormGroup نفسه ويختفي غير المختار عبر hidden، بدل إنشاء/تدمير Documents عند كل انتقال. لذلك FormArray/dirty/رفع الملفات وحالة تأكيد إزالة الصف وfreeze/cleanup وViewChild تظل بمالكيها الحاليين. setTab يرفض التنقل أثناء busy، بما فيه حفظ/تحميل/رفع/تأكيد/تنظيف/طباعة. save يختار documents قبل focusField لأول صف غير صحيح أو information لباقي الحقول، مع helper الانتظار/التركيز الحاليين؛ الحفظ ذاته والـpayload لم يتغيرا. showTitle=false يزيل تكرار عنوان التبويب في قسم البيانات وقسم مستندات View مع بقاء وظائف header/print.

الطباعة تستخدم printing من جلسة ReportPrintService الحالية لرفع hidden عن القسمين؛ الشريط no-print، وsigma-print-flow يحرر body/form/scroll. يبقى getDetails/printRequested وسجل المصدر ومرفقاته كما كان، ولا طباعة التبويب الظاهر وحده. لم يتغير عمر الكتابة/الإغلاق/guard أو cleanup/نجاح الحفظ، ولم تضف معاينة بيانات جديدة.

القراءات/الكاش/التحميل والأداء لهذه الشريحة:

| المصدر/رمز المستهلك الحقيقي | الوضع والأثر |
|---|---|
| Vehicle/GetSelect عبر WorkshopMovementService.getVehiclesSelect ثم VehicleService | source cacheSelect=true الحالي؛ finite read الموروث نفسه، لم يضف انتقال التبويب قراءة أو تغيير أهلية/selected values |
| Driver/GetSelect عبر getDriversSelect ثم DriverService | direct reference بلا source opt-in؛ لا caching جديد |
| Supplier/GetSelect عبر getWorkshopsSelect ثم SupplierService | source cacheSelect=true الحالي؛ الورشة هنا Supplier كما يقضي العقد، ليست Workshop/GetSelect |
| PurchaseOrder/GetSelect عبر getPurchaseOrdersSelect ثم PurchaseOrderService | direct reference بلا source opt-in، مرجع no القابل للكتابة محفوظ |
| WorkshopMovement/GetByWithNavigationsId/{id} عبر getWorkshopMovementDetails | direct operational detail، session/id/visible gates وswitchMap/Finalize وRetry/printRequested كما كانت |
| POST WorkshopMovement عبر addWorkshopMovement | كتابة مستقلة عن read lifecycle، payload نفسه والنجاح بعد cleanup كما كان |

لم تتغير عناوين أو writers/import invalidation أو سياق المصادر المشتركة بهذه المتابعة. يغطي هذا الجرد موضع استهلاك المصادر، ولا يُدّعى تحويل الشاشة كلها إلى أحدث watch/tenant conformance: consumer الحالي لـVehicle/Supplier يملك finite bootstrap دون active watch؛ تلك فجوة مراجعة lifecycle الأوسع تُسجل هنا ولا يُجرى اختراع watcher أو تغيير سياق أثناء طلب العرض المحدود. لا ذاكرة/selected label جديدة أو eligibility اختراع من تبويبات. لا query/index/cache/مالية/BackEnd تغير؛ نُظمت نفس القراءات الأربع المتوازية عند Create ونفس detail read عند View، ولا طلب لكل تبويب/صف.

تقدم الحوار: StateMessage المحلي الموجود أصبح يتتبع loadingData أو lookupsLoading بدل إخفاء فترة تهيئة الخيارات؛ busy والـform freeze/Retry محفوظة. body-appended EditorDialog يخفي shell أثناء القراءة؛ العرض المحلي الواحد داخل الحوار يملكه نفس StateMessage، وsaving overlay يُستخدم في الكتابة كما كان. start/finalize/end الخاص بالـdetail/save لم يتغير ولا indicator إضافي جديد موازٍ في التبويب. الطباعة/القراءات وحفظ البيانات كما في المصدر؛ هذا التحقق لا يدعي visibility runtime أو timing.

لا فهرس جديد مبرر لتغيير panels؛ predicates/order/response graph/row count نفسها. اقتراحات SQL/graphs الأوسع تبقى في سجل الاكتشاف السابق بلا تعديل أو migration. القياس المتبقي عند السماح بالتشغيل: نفس المستخدم/المستأجر وحجم قوائم المركبات/الموردين/السائقين/PO والمرفقات، cold/warm ومدة lookup/detail والرسم والتبديل مع نفس الحقول. بقاء DOM mounted متعمد لحفظ المسودة لا ادعاء تخفيف network أو سرعة مقاسة.

الملفات: TS/HTML لمحرر WorkshopMovement، مفتاح workshopMovement.tabs.information في ar/en، وموضوع حركة الورشة في UserGuide/content/movements-guide.ts عبر القارئ القائم /UserGuide/movements. يشرح الدليل التبويبين والملاحظات/التحقق والطباعة الكاملة. لا تغيير قواعد canonical/skill لأن القدرة موجودة أصلًا ولا قاعدة عامة جديدة؛ الحزم الثماني متسقة بلا حاجة توليد جديد. لا تعديلات Backend أو DTO أو Mapper/EF/schema أو migration؛ لا Add-Migration مطلوب.

الفحوص: روجعت فروق TS/HTML للنطاق وحفظ الحقول وtyped imports والـIDs/hidden/printing/validation، وفُحصت صياغة المكوّن/القاموسين/الدليل وقالب Angular وwhitespace. لا build/test/lint/browser/database/commit/push/deploy. القبول المرئي متبقٍ: فتح Create/View والتنقل بالماوس/الأسهم/Home/End وRTL/theme/العرض الضيق والارتفاع القصير، بقاء المدخلات والمرفقات/تأكيد الإزالة، خطأ مستند مخفي وخطأ ملاحظات، منع التنقل أثناء الرفع/cleanup، وطباعة القسمين من أي تبويب. رسالة واجهة مقترحة فقط: refactor(movements): organize workshop movement editor into tabs.


## تصحيح الجسم الفارغ بعد إضافة التبويبات — ٢٠٢٦-١٠-٣١

بلاغ المالك: «الشاشة مفتوحة فاضية». تصحيح مباشر لشريحة التبويبات السابقة S؛ عند تحويل النموذج إلى sigma-editor-body/form/scroll استُعمل flex:1 1 0، بينما EditorDialog.height ظل فارغًا افتراضيًا، وmaxHeight وحده لا يعطي السلسلة ارتفاعًا محددًا. هذا قصور في التنفيذ السابق عن قاعدة UI13 الموجودة، ولم يكن نجاح parser دليلًا لارتفاع محتوى غير صفري. البلاغ يثبت العرض الملاحظ، وفحص المصدر يثبت تعارض ارتفاع auto مع zero-basis؛ لا ادعاء إعادة إنتاج داخل متصفح.

الإصلاح: height="min(680px, calc(100dvh - 24px))" على app-editor-dialog عبر مدخله المشترك الحالي، بلا CSS خاص أو override لـp-dialog-content أو تغيير عرض/حقل/حفظ/اختيار تبويب. يحافظ المالك على حد النافذة والهيدر والفوتر، وتملأ body/form المساحة وتملك sigma-editor-scroll تمرير الحقول. ما زالت اللوحتان mounted/hidden وتكشفهما printing كما كانت؛ inline dialog height يُحرر في print بقواعد sigma-report-print-dialog القائمة، ولم يُختَر الرجوع لتوزيع بلا تبويبات.

قورنت مباشرة EditorDialog.dialogStyle/contentStyle وdefault height='' مع styles.scss لسلسلة flex، وUI13 «Definite height for flex editors» وبديل auto-basis. أعيد فحص الحزم الثماني، وأضيف تذكير إعادة فحص السلسلة عند تبويب modal إلى نفس UI13 والمهارة مع revision، بدل اختراع مالك ارتفاع موازٍ. الدليل العربي/الإنجليزي يشرح بقاء التبويبات والأفعال مع تمرير المحتوى. مرجع Speed/مسار الشاشة والعقود الوظيفية المقروءة في الملحق السابق باقية؛ هندسة ارتفاع سيجما ليست عقد أعمال في المرجع ولا تستدعي تجميع أدلة خارجية جديدة.

لا تغيير قراءات/كاش/writers/watch/tenant أو start/finalize/error/Retry أو DTO/Backend/SQL/index/migration. جرد الشريحة السابقة وحدود مراجعة lifecycle الأوسع يظلان كما هما. لا سبب لفهرس أو ادعاء تحسن سرعة من زيادة ارتفاع محتوى؛ الأداء/ظهور الحقول وscroll والـ680px/viewport القصير وRTL/theme/Print يبقون قياسًا/معاينة منفصلة.

فحص المصدر: تحليل قالب Angular والدليل والـdiff/whitespace وCheck للحزم بعد توليدها؛ لا build/test/lint/browser/DB/migration/commit. لا وكلاء إضافية لتعديل height واحد مرتبط بنفس مالك الشاشة. القبول المتبقي: فتح Create/View والتأكد من ارتفاع المحتوى الفعلي وظهور البيانات والمستندات، آخر حقل/صف وfooter ثابتان، العرض والارتفاع الضيقان، والطباعة الكاملة بعد تحديد أي تبويب. رسالة commit مقترحة فقط: fix(movements): bound workshop movement tabbed dialog height.

متابعة طلب المالك «كمل»: أُعيدت مراجعة الفرق الكامل للمحرر والدليل وربط المسار الفعلي pages/routing.ts بالقائمة والمحرر، وتطابق tab/panel IDs مع EditorTabs. تحليل صياغة TypeScript وقالب Angular نجح دون تشغـيل build أو tests؛ وdiff --check وفحص الحزم الثماني نجحا. لم يظهر عيب مصدري إضافي يستدعي تغييرًا بعد إصلاح ارتفاع النافذة. تظل معاينة ظهور المحتوى والتمرير والطباعة في التشغيل متبقية؛ لم يُدّع تحقق مرئي أو قياس سرعة.

## توسيع حقول المستندات المشتركة — ٢٠٢٦-١٠-٣١

طلب المالك توسيع تاريخي تبويب المستندات ثم «وسع كل المربعات». الحالة Implemented — source-only؛ تحقق المالك المتبقي yes. العقد المصغر S مجمّد لتوسيع عرض العرض فقط داخل app-documents الحالي، ويسري على مستهلكيه حسب توجيه العرض المشترك. لا تغيير حقول/تاريخ/قيم/ترتيب/تحقق/رفع/حفظ.

قورنت الشريحة بـUI14 وUI17 وUI18 وPHASE03 بعد نجاح فحص الحزم. مالك العرض الحقيقي DocumentsComponent في CompanyPartner/detalisForm/documents، ومالك عرض الأعمدة/colgroup/overflow هو EditableCollectionTable؛ النمط modal UI01/UI13 وBackend master-detail no-financial بلا تغيير. مرجع Speed المقروء: مدخل references/speed-analysis/README.md ثم شاشة Workshop Movements المؤرخة2026-10-28 وC1457 ووصف S113 الأصلي 90c6e368ce903381؛ declarations المستندات ليست مصدرًا لأبعاد حقول سيجما. طلب المالك وقواعد سيجما يحددان الأبعاد، ولا عقد API/حسابات/صلاحيات جديد.

الأبعاد الحالية: النوع280px، الرقم240px، جهة الإصدار240px، تاريخا الإصدار والانتهاء180px لكل منهما، المرفق320px، الدولي140px؛ الحد الأدنى للجدول1680px بدل1100px مع إطار التمرير الأفقي المشترك. السبب المؤكد: وجود عرض240px للنوع يشغل fixed table layout مع ترك بقية الأعمدة تتقاسم المساحة الصغيرة، فتنضغط صناديق التاريخ والنص. توحيد widths عبر API الموجودة يصلح توزيع المساحة بلا CSS محلي أو تغيير PrimeNG. النصوص/أسماء الملفات الأطول من المساحة ما زالت تخضع للتحرير/ellipsis المعتاد؛ لا ادعاء إظهار سلسلة غير محدودة داخل حقل ثابت.

لا طلب شبكة جديد أو قراءة لكل خلية؛ جرد lookups/detail/cache/watch والقيود المتبقية في الشريحة السابقة ثابت. لم يتغير loader/start/finalize/Retry أو SQL/predicates/index؛ لا فهرس أو migration مبرر لتغيير metadata العرض، ولا ادعاء تحسن سرعة مقاس. يظل القياس/القبول المرئي owner-pending بنفس البيانات والسياق.

حُدث UI18 والمهارة مع revision في المهمة نفسها، وتولدت الحزم الثماني عبر المولد فقط. روجع أثرها الدلالي: توسيع الأعمدة داخل المالك الموجود، دون توجيه بإنشاء مكوّن/سياسة تاريخ أخرى؛ فحص Check نجح. أُضيف شرح عربي/إنجليزي للإرشادات المشتركة في UserGuide/content/shared-screen-guidance.ts بالقارئ الموجود. نجح syntax للمكوّن والدليل وقالب Angular وdiff --check؛ روجع الفرق الكامل للمكوّن وكان نظيفًا قبل هذه الشريحة. لم تُستخدم وكلاء لصغر التعديل وتسلسله، ولم تُشغّل build/test/lint/browser/DB أو commit. القبول المتبقي: إضافة مستند، تاريخ كامل، أسماء وأرقام طويلة، تمرير الجدول في نافذة ضيقة، RTL/light/dark والطباعة. رسالة commit مقترحة فقط: fix(documents): widen entry columns and preserve table scrolling.

## عقد تصغير عرض حركة الورشة وإصلاح الإغلاق — ٢٠٢٦-١٠-٣١

الحالة Frozen؛ Owner verification pending yes. بلاغ المالك: View Workshop Movement أكبر من اللازم وزرClose لا يعمل. النطاق S في WorkshopMovementDetailsComponent وشرح الدليل والمراجع المشتركة ذات الصلة. المسار الفعلي WorkshopMovement_Routes والقائمة تملك المحرر، وonEditorClosed يستهلك closed مباشرة دون إعادة guard. UI13/15/28 وPHASE03/06 بعد Check ناجح؛ لا عقد backend/domain أو schema.

السبب المصدري المؤكد للمساحة: height680px فُرض سابقًا لمنع انهيار سلسلة flex بعد التبويبات، فيطبق على View الصغير أيضًا. القرار: View فقط يعود إلى content-sized dialog، height فارغ مع maxHeight المشترك، ويُضبط كل من body/form/scroll إلى flex auto عبر sigma-u-flex-fill الموجودة؛ Create يحافظ على ارتفاعه المحدد. لا حذف مدخلheight وحده وإعادة مشكلة الجسم الفارغ، ولا CSS داخلي خاص لـp-dialog-content، ولا عرض اعتباطي جديد.

الإغلاق الحالي: [closeDisabled]=busy يشمل detail loading، وcanDeactivate يرسل View إلى discardUploads رغم أنه لا يملك مسودة رفع/حذف. القرار المحافظ: حارس إغلاق واحد يستثني قراءةView القابلة للإلغاء فقط، ويحفظ حواجز saving/confirmation/printing/upload/cleanup؛ View يغلق مباشرة دون مسار تنظيف الملفات. requestClose المقبول يخفي الجلسة، يزيد session revision، ويلغي detail/lookups/print preparation قبل closed(false). تنتهي قراءات HTTP الحالية بـfinalize/endLoading، ولا تمس كتابة مستقلة. Create dirty-discard/cleanup وحفظ المرفقات كما هما. لا ادعاء أن كل سبب runtime لعدم الإغلاق أعيد إنتاجه؛ المصدر يثبت مسار الحجب غير اللازم، وتحقق النقر/الهروب/عنوانالنافذة متبقٍ.

المراجع المحلية: مدخل speed-analysis وملف Workshop Movements/C1457/C1461 في لقطة2026-10-28 يدعمان نافذة العرض/البيانات/المستندات، ولا يفرضان height680 أو تنظيف مسودة عند View. دليل سيجما الحالي مقروء، والطلب لا ينقل صلاحية أو إجراء أعمال جديدًا من المرجع. لا صورة جديدة مرفقة لهذه الشريحة.

## تنفيذ تصغير عرض حركة الورشة وإصلاح الإغلاق — ٢٠٢٦-١٠-٣١

الحالة Implemented — source-only؛ Owner verification pending yes. نافذة View تستخدم height فارغًا وsigma-u-flex-fill على body/form/scroll كاملة وفق بديل UI13 content-sized، مع maxHeight والتمرير الداخلي الحاليين. يبقى ارتفاعCreate المحدد680px، فلا عودة لانهيار الجسم الفارغ ولا تغيير للعرض الافتراضي أو الحقول/التبويبات/الوثائق. شريط التبويبات لا ينكمش، والطباعة تحرر الحدود عبر sigma-print-flow كما كانت.

أصبح closeBlocked المالك الواحد لزر Close وزر العنوان وقرار Escape/route guard. View يُغلق مباشرة دون discardUploads عندما لا توجد كتابة/رفع/cleanup/confirmation/printing فعلية؛ لا تُعد قراءة detail وحدها مانعًا. الإغلاق المقبول يخفي الجلسة ويزيد session ويلغي detail/lookups وpending print قبل closed(false)، مع منع تكرار requestClose لجلسة مخفية. switchMap/takeUntil يؤديان إلى finalize/endLoading الحالي، وid/session/visible ترفض النتائج المتأخرة. hasPendingChanges يستخدم نفس معيار الإغلاق، فلا تعامل قراءة View كمسودة غير محفوظة عند beforeunload. Create dirty confirmation/cleanup وأمان الحفظ والملفات كما كانت؛ مسارات نجاح الحفظ/Retry cleanup لم تُعد كتابتها. حدث closed يستهلكه الأب مباشرة دون guard ثانٍ كما في UI13. الإلغاء هنا اشتراك العميل؛ لم يُغير generic backend action أو يثبت توقف SQL منشور لا يستهلك request token.

قورنت وثائق UI13/15/28 بالمالكين الفعليين EditorDialog وDocumentUploadTracker وReportPrintService وأداة flex-fill؛ أُضيفت قاعدة الإغلاق للعرض الخالص في UI15 وتذكيرها/سطرrevision في المهارة بنفس المهمة، وصُحح مثال UI13 القديم لتفريق Create680 وViewauto. تولدت الحزم الثماني عبر المولد فقط، ونجح Check. المراجعة الدلالية: المعنى الجديد يسمح إلغاء read فقط ولا يتجاوز actual save/upload/cleanup/print، والبديل الهندسي auto-basis موثق أصلًا؛ لا غلاف/مؤقت/مالك CSS منافس.

جرد القراءات والكاش والـwriters/watch/context يبقى السابق لهذه الشاشة، بلا opt-in جديد: Vehicle/Supplier selects من مصادرها المعتمدة وDriver/PurchaseOrder direct، وWorkshopMovement detail/write direct. لا requests أو predicates/joins/index/schema إضافية، ولا سبب لفهرس أو migration لتغيير عرض/حارس خروج. لا قياس سرعة من الإصلاح؛ تحقق الأحجام cold/warm وgeometry وإلغاء القراءة والـglobal count متبقٍ عند السماح بالتشغيل.

الملفات: WorkshopMovement details TS/HTML ودليل UserGuide/content/movements-guide.ts عبر /UserGuide/movements، مع UI13/UI15 والمهارة والحزم المولدة. الدليل العربي/الإنجليزي يشرح محتوى View وحجمه والإغلاق أثناء القراءة، ويحفظ قواعد مسودة الإنشاء والمرفقات. نجح تحليل الصياغة وقالب Angular وdiff --check وروجع فرق المصدر الكامل للنطاق؛ لا semantic build أو browser/runtime proof. تحقق المالك المتبقي: View ببيانات/مستندات قليلة وكثيرة، زرClose والعنوان وEscape أثناء وبعدالقراءة وفيالفشل، توقفإعادةالملءبعدالإغلاق، Create dirty/discard/upload/cleanup، وعرضقصير/RTL/theme/طباعةالقسمين. لا build/test/lint/browser/DB/migration/commit/push أو وكلاء لهذه الشريحة الصغيرة المترابطة. رسالة commit مقترحة فقط: fix(workshop-movements): fit view content and cancel reads on close.

## عقد تحسين أكشن العرض في سجل الحركات — ٢٠٢٦-١٠-٣١

| البند | القرار |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| النطاق | بلاغ المالك عن بطء View في /logsMovement؛ تنفيذ الإصلاحات المصدرية المحددة التالية ضمن متابعة تحسين العرض |
| المسار | pages/routing.ts:442 → LogsMovement_Routes → LogsMovementListComponent.moreActions/openMovementDetails → MovementCheckCardComponent |
| مصدر NRM الجديد | GET NRM/{id:int}/movement-log-detail → INRMService.GetMovementLogDetailsAsync(id, cancellationToken) → Result<NrmMovementLogDetailVM> |
| حقول NRM | Id, Type(NrmMovementType), DateAndTime(DateTime), FuelLevel(string?), KMs(string?), Notes(string?), Staff{Id,No,FirstName,MiddleName,LastName} أوnull؛ لا Vehicle/Customer/Branch graph أو بيانات مالية/رواتب/بنوك |
| حدود القراءة | Query<NRM>(Id) يفرض tenant/live وAsNoTracking؛ Staff LEFT JOIN مستأجري includeDeleted:true للحفاظ على الاسم التاريخي؛ projection واحد وFirstOrDefaultAsync(token). الفشل FailedToFound المعهود. DTOs الجديدة مستقلة، ولا تعديل Generic NRM detail أو Mapper أو بقية مستهلكيه |
| واجهة NRM | getMovementLogDetails جديد في NRMService مع نوع مصغر فيmodels/details؛ يحول kMs إلىkms كما محول المصدر الحالي؛ normalizeNrm يحفظ row??entity الأولويات والحقول نفسها |
| أول فتح View | تحميل المصدر الأساسي وحده؛ لا Agreement Documents أو ChecklistItem حتى تبويبهما |
| المستندات | Agreement documents تتحمل عند documents مرة ناجحة لكلجلسة؛ عودة للتبويب لا تكررها؛ فشل يبقي Retry، ونجاح فارغ معتبر loaded. السياسة canUpload تأتي من نفسالقراءة المباشرة، ومسار upload/تأكيده/حفظه لا يتغير |
| الفحص والطباعة | ChecklistItem يتحمل عند checklist في View؛ printPreview يظل يحمّل detail+checklist قبل الطباعة؛ لا إسقاط بيانات أو تغيير fallback labels/إجابات غير متاحة/صور/توقيعات |
| Loader/lifetime | مؤشر StateMessage محلي واحد خارج panels لأي read نشط معaria-busy، مع حواجز busy/Retry والـglobal leases المصدرية؛ close/generation/cancelReads/DestroyRef كماكانت، وdefaultIfEmpty failure. لا mask ثانٍ أو cache جديد |
| المصدر الباقي | RentalAgreement/Delivery/Collection/Workshop detail APIs كما هي؛ أولويات القيم المحملة والمستندات والـupload ثابتة |
| الفهارس/الترحيل | root NRMId/StaffId joins على مفاتيح موجودة، لا فهرس جديد أو schema/migration مبرر لإزالة traversal. SQL/timing منشور غير مقاس |
| الأشكال/المراحل | UI01/13 viewer + UI02/22/28/29؛ BE7 projection. PHASE01/03/05/06 بتناسب؛ لا grid/write/domain تعديل |

الدليل المرجعي المقروء: speed-analysis entry والملف2026-10-28/sidebar/13-movements/screens/06-movements-log.md، R0240/C1636 (قراءة JavaScript محفوظة فقط). تُحفظ مجموعات التفاصيل/المستندات/الفحص/الرسوم/التوقيعات الحالية، ولا تُنفذ features أو صلاحيات غير مثبتة من Speed. مصدر C1636 يشرح عرض الحركة لا SQL سيجما. دليل UserGuide/movements الحالي مقروء. أُنجزت مراجعة الخلفية read-only بوكيل موجود: NRM وحده deep recursive، والاتفاقية projection محملة برسوم إضافية، والتسليم/الاستلام/الورشة Includes محدودة؛ لا تضييق لعقودها المشتركة في هذه الشريحة. أثرquery: NRM الجديد استعلاممصدرواحد بدلgraphمتغير، وView initial من2 أو3 reads إلى1، بينماprintPreview يحتفظ بقراءةالفحص. هذهميزانيةمصدر وليستسرعةمقاسة.

ملكية التنفيذ: الوكيل الخلفي يملك NRMService/INRMService/NRMController وDTOsالاثنين الجديدة فقط بعدهذاالتجميد؛ root يملك frontend/logsView/NRMclient/models والدليل والدمج والـdiff. لا overlap أو build/test/lint/browser/DB/migration/commit. فجوات lifecycle القائمة/بقيةالقراءات التي لمتتغير لا تُدّعى مطابقتها بالكامل من هذاالتعديل المحدود.

## تنفيذ تحسين أكشن العرض في سجل الحركات — ٢٠٢٦-١٠-٣١

| البند | النتيجة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| النطاق | تحسين View في /logsMovement وإعادة استخدام التحسينات في قارئ الحركة المضمن لاحقًا داخل View Vehicles |

أول فتح View العادي يستدعي detail المصدر فقط بدل detail+ChecklistItem، وبدل detail+Agreement Documents+ChecklistItem لحركة الاتفاقية. تنتقل قراءتا المستندات والفحص إلى اختيار تبويبهما مع loaded-success flags لكل جلسة، ومنع تكرار المتوازي أو إعادة المحاولة الآلية بعد فشل حتى Retry الصريح. النجاح الفارغ يعتبر loaded؛ لا cache/TTL أو source opt-in جديد. Check Card printPreview يبقي detail+checklist ضمن التحضير الأول قبل السماح بالطباعة، مع نفس fallback labels والحقول غير المتاحة. لا حذف بيانات للإخراج الكامل أو تغيير المستندات/الرفع/الضريبة.

مصادر detail الفعلية: RentalAgreement/GetByWithNavigationsId/{id} projection لكنه يتضمن BookingCharges غير المستهلكة هنا؛ DeliveryMovement/GetByWithNavigationsId/{id} وCollectionMovement/GetByWithNavigationsId/{id} وWorkshopMovement/GetByWithNavigationsId/{id} تحميل محدود بالمراجع، لا traversal متشعب. بقيت هذه العقود المشتركة كما هي؛ كلفة رسوم الاتفاقية المحتملة تبقى قياسًا لاحقًا قبل تضييق عقد يستهلكه محررها المالي. NRM وحده كان يمر GetByIdDeepAsync إلى graph المركبة/الموظف بما فيه رواتب/بنوك غير معروضة؛ لذلك أضيفت له القراءة الخاصة التالية دون تعديل تفاصيله العامة.

GET NRM/{id:int}/movement-log-detail يمر من NRMController إلى INRMService.GetMovementLogDetailsAsync ثم projection واحد AsNoTracking من Query<NRM>(Id) tenant/live مع LEFT JOIN لموظف نفس المستأجر includeDeleted:true لحفظ الاسم التاريخي. يتوقف عند Id/Type/DateAndTime/FuelLevel/KMs/Notes وStaff Id/No/FirstName/MiddleName/LastName؛ لا Vehicle/Staff graph أو financial detail. FirstOrDefaultAsync يستخدم CancellationToken من action؛ FailedToFound وToActionResult وAuthorize الموروثون محفوظون. أضيف NrmMovementLogDetailVM/NrmMovementLogStaffVM كلٌ في ملف مستقل، وgetMovementLogDetails في عميلNRM بنوع Pick مصغر وتحويل kMs→kms الحالي. normalizeNrm يحتفظ بترتيب row??entity ونوع العداد/الوقود النصي وأسماء الموظف وكوده كما كانت، ولا calculated financial input أو EF/schema/Mapper change.

التحميل: مؤشر محلي StateMessage واحد خارج panels في العرض العادي يغطي details/documents/checklist أينما انتقل المستخدم، مع aria-busy، وأخطاء/Retry مستقلة وزر إعادة المحاولة غير مكرر أثناء الطلب. detail/documents يحتفظان بصفحة LoadingService start/finalize لأن الحوار يغطي shell، والفحص catalog lookup محلي للحوار كما في UI22. defaultIfEmpty(null) يحول الاكتمال الفارغ إلى رسالة فشل بدل إسقاط next بصمت. generation/visible/cancelReads/DestroyRef تحمي النجاح والخطأ والإغلاق كما كانت؛ لا table mask موازٍ.

| المصدر/المستهلك | تصنيف الكاش والتهيئة النهائي |
|---|---|
| NRM/{id}/movement-log-detail عبر NRMService.getMovementLogDetails | direct operational؛ لا تخزين مرجعي أو watch/TTL؛ كل فتح يقرأ جديدًا، وسياق القراءة مستأجري |
| باقي detail getters الأربعة أعلاه عبر loadMovementDetails | direct operational على عقودها الحالية؛ لا توسيع eligibility أو تغيير writers/invalidation |
| RentalAgreement/{id}/documents عبر getDocuments | direct operational/policy read للملفات وcanUpload؛ يبدأ عند documents فقط، ويحفظ successful view state داخل الجلسة، وإغلاقها ينهيه؛ backend upload authority لم تتغير |
| ChecklistItem GET عبر getChecklistItems | direct reference بلا source opt-in لهذاالقارئ؛ finite read عند checklist أو printPreview، مع fallback/Retry والنجاح الفارغ؛ لا local replay/cache جديد |
| إشعار ReferenceLookupCacheService.contextChanges | data-free notification لإبطال جلسة العرض، وليس source cache adoption؛ يشترك مرة وينتهي مع DestroyRef |

لدعم المستهلكين الاثنين بأمان، أصبح قارئ الحركة المشترك يبطل بياناته وreads وpending print/confirmation عند تغير السياق، ويعرض رسالة إعادة الفتح بدل بيانات/عنوان السجل القديم. يمنع read/retry/new upload/print بعد الإبطال. كتابة الملف المرسلة تبقى خارج cancelReads كما كانت؛ يحفظ uploadingDocumentId حتى finalize الخاص بها، ويُحرر busy بملكية الطلب حتى لو تغير generation، دون تطبيق نتيجة قديمة أو إعادة المحاولة. selected file draft يُمسح كجزء من إبطال جلسة الواجهة، ولا حذف ملف محفوظ. يلغي unsubscribe تأكيد التجاهل المعلّق من خلال الخدمة المشتركة، لا overlay يدوي. يظهر تقدم محلي وحاجز خروج أثناء اكتمال الرفع بعد الإبطال. لا claim بإغلاق print browser نشط أو إيقاف SQL للأكشنات القديمة التي لم تُغيّر رمز الإلغاء.

الفهارس: NRMConfig/لقطةEF يثبتان PK Id وفهارسStaffId/VehicleId، والفهرس المركب الحالي SubscriptionId/VehicleId/DateAndTime(desc)/Id(desc) INCLUDE Type,IsDeleted يخدم القائمة. لا يُضاف فهرس لتغطية rootId/StaffId lookup أو لإخفاء recursive traversal. لا schema أو migration أو تكلفة كتابة جديدة. الميزانية المصدرية: View initial1 بدل2 أو3؛ NRM projection واحد بدل graph متغير؛ printPreview يحتفظ بقراءتي التحضير. لا عدد SQL أو سرعة مقاسان؛ verification المتبقي يثبت translation/plan/payload/timing على نفس tenant/حجم بيانات/مصدر الحركة والشبكة وبعينات cold/warm، مع فصل first usable content عن كل بيانات التبويبات.

فحوص المصدر: Roslyn syntax للملفات الخلفية الخمسة صفر أخطاء، وnamespace/GlobalUsing(enum)/ProjectReferences/default SDK inclusion صحيحة. تطابق حقول DTO والعميل وKMs→kMs ومحوّلkms واضح من المصدر، ولا include واسع في tsconfig. تحليلTS وقالبAngular وdiff --check نجح في الجذرين، وروجع الفرق الكامل والملفات الجديدة، وحُفظت بقية تغييرات المستخدم. حزمPHASE01/03/05/06 الحالية فُحصت وتتبعها صحيح؛ لا phase2/grid أو domain/write refactor. لا build/test/lint/browser/DB/migration/commit/push/deploy.

حُدث دليل /UserGuide/movements في UserGuide/content/movements-guide.ts بالعربية والإنجليزية لشرح التحميل عند التبويب، الفشل/Retry والطباعة وتغير السياق. القبول التشغيلي متبقٍ للخمسةمصادر، العودة لتبويب ناجح/فارغ/فاشل، Check Card كاملة، إغلاق/تبديل سريع، upload/confirmation/context أثناء الكتابة، RTL/themes والعرض القصير. استُخدم الوكيل الخلفي المعاد استخدامه بالموديل الموروث لتشخيص المسارات الخمسة ثم تنفيذ ملفاتNRM الخمسة بعد تجميد العقد؛ root نفذ الواجهة والدمج والمراجعة والدليل. الفصل قلل زمن العمل دون overlap. لا قاعدة مشتركة جديدة هنا خارج UI13/22/28 وBE7 القائمة؛ التذكيرات الجديدة للعرض الخالص وأيقونة الفعل موثقة منفصلًا في مالكيها والمهارة.

رسائل commit مقترحة فقط: backend — perf(movements): project NRM movement log details؛ frontend — perf(movements): defer auxiliary view reads and fence stale sessions. يلزم تشغيل الواجهة والباك إند المعدلين معًا للمعاينة؛ لا Add-Migration.
