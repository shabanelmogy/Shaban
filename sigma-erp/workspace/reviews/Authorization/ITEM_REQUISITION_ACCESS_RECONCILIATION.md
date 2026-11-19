# مطابقة صلاحيات ونطاق فروع طلبات الأصناف — البند ١٦١ (`/ItemRequisition`)

عولجت الملاحظات التسع في [مراجعة ١٣ نوفمبر](AUTHORIZATION_161_SOURCE_REVIEW_20261113.md)
في المصدر: اعتماد الصرف الناتج، وحفظ المسودات، وملكية القراءة والطباعة،
ووجهة مستخدم الإنشاء فقط، وصلاحية نتائج الكتابة، والتحقق من الفلتر والمواصفات
وتوثيق المسارات. نجح بناء الخادم والواجهة وفحص تجميع المواصفات المحصور.
القبول السلوكي ودورة الحفظ والاعتماد على SQL Server معلّقان.

| البند | القيمة |
|---|---|
| Status | Review fixes implemented; scoped builds passed; behavioral/SQL acceptance pending |
| Owner verification pending | yes |
| التاريخ | 2026-11-13 |
| الاكتشاف | [تتبع المصدر والشكل](ITEM_REQUISITION_ACCESS_DISCOVERY.md) |
| العقد المجمد | [العقد المجمد](ITEM_REQUISITION_ACCESS_CONTRACT_FREEZE.md) |
| قرارات المالك المعتمدة | `Q1 = A1` · `Q2 = A2` · `Q3 = A3` |
| النطاق | البند ١٦١ — طلبات الأصناف `ItemRequisition` (`/ItemRequisition`، `/ItemRequisition/create`، `/ItemRequisition/details/:id`، `/ItemRequisition/purchase-request/:id`)، وتحويل الرابط الموروث `/ItemRequisitionItem`، ونوافذ القائمة والتفاصيل والصرف وطلب الشراء والتقرير وتصدير Excel، وواجهات `ItemRequisition` و`ItemRequisitionItem` و`ItemIssueService` |

---

## ١. تتبّع كل إجراء من الواجهة إلى مسار HTTP والمنحة والاعتماديات والمرشّح والخدمة وأين يصدر الرفض

| إجراء الواجهة / المسار | مسار HTTP الفعلي | المنحة الأساسية في `PermissionEndpointResolver` | الاعتماديات (`PermissionPrerequisites`) | مرشّح/نطاق الفرع (`BranchAccess`) والخدمة | أين يصدر الرفض |
|---|---|---|---|---|---|
| فتح `/ItemRequisition` وعرض القائمة وتصدير Excel وفتح التقرير | `GET /api/ItemRequisition`؛ التصدير يجمع صفحات القائمة المصفّاة | `ItemRequisition.View` (قراءة فقط) | شرطي `itemRequisitionJobFilterSpecified` -> `Job.Lookup` عند التصفية بـ `jobId` أو الفرز بـ `jobName` أو عمود `grid` يخص `JobName`/`JobId`/`Job.*` أو `grid` تالف/تجاوز `16384` ([PermissionPrerequisites.ItemRequisition.cs](file:///F:/My Work/Sigma/SigmaBackend/SiGma.ServerAPI/Authorization/PermissionPrerequisites.ItemRequisition.cs#L9-L43)) | نطاق قراءة `Job.BranchId` عبر `BranchScopeRegistry` ([L78](file:///F:/My Work/Sigma/SigmaBackend/SiGma.DataAccess/Authorization/BranchScopeRegistry.cs#L78)) + `DemandRequestScope()` ([L72](file:///F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StocksServices/ItemRequisitionService.cs#L72)) + `SanitizeListSearchModel` ([L215](file:///F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StocksServices/ItemRequisitionService.cs#L215)) | حارس المسار في الواجهة (`route-access-policy.ts`), `403` من مرشّح المنح/الاعتماديات (`PermissionAuthorizationFilter`), `400 GridFilterUnsupportedField`/`GridFilterInvalidValue` من الخدمة، إخفاء الصفوف خارج فروع القراءة من EF Query Filter |
| فتح تفاصيل السجل (`view` / `/ItemRequisition/details/:id`) | `GET /api/ItemRequisition/GetById/{id}` و`GetByWithNavigationsId/{id}` | `ItemRequisition.View` (قراءة فقط) | — (دون اشتراط `Job.Lookup` أو `Item.Lookup`) | قراءة الطلب وفق `Job.BranchId`؛ حساب الحالة والمتبقي على مستوى الشركة دون إرجاع تفاصيل مستندات الصرف أو الشراء غير المرئية | `403` من مرشّح المنح، `404 ItemRequisitionNotFound` عندما يكون الطلب في فرع محجوب أو غير موجود |
| إنشاء طلب أصناف (`/ItemRequisition/create` أو زر الإضافة) | `POST /api/ItemRequisition` (`AddAsync`) | `ItemRequisition.Create` (كتابة) | `Job.Lookup` + `Item.Lookup` ([PermissionPrerequisites.cs](file:///F:/My Work/Sigma/SigmaBackend/SiGma.ServerAPI/Authorization/PermissionPrerequisites.cs#L475)) | `DemandRequestScope()` + `DemandBranchWrite(job.BranchId)` + `IsActiveBranchAsync(job.BranchId)` + فحص نشاط `Job` و`Item` + حارس `SiGmaDbContext.BranchAccess` | في الواجهة قبل الإرسال (`details.component`), `403` عند غياب `Create` أو أحد الـLookups، `BranchAccessDeniedException` عند فرع غير مصرح فيه بالتسجيل، `400 ItemRequisitionInvalidBranch` لفرع غير نشط (حتى لمدير الشركة) |
| تعديل طلب غير مرتبط (`edit`) | `PUT /api/ItemRequisition` (`UpdateAsync`) | `ItemRequisition.Update` (كتابة) | `ItemRequisition.View` + `Job.Lookup` + `Item.Lookup` ([PermissionPrerequisites.cs](file:///F:/My Work/Sigma/SigmaBackend/SiGma.ServerAPI/Authorization/PermissionPrerequisites.cs#L476)) | `DemandBranchWrite(request.Job.BranchId)` على الفرع المحفوظ + فحص الفرع الجديد عند نقل `JobId` + فحص الارتباط على مستوى الشركة + استثناء المرجع غير النشط للسطر المحفوظ نفسه | `403` من مرشّح المنح/الاعتماديات، `404` للسجل غير القابل للكتابة/المخفي، `BranchAccessDeniedException` عند غياب `CanTransact` على المحفوظ أو الجديد، `ItemRequisitionLinkedDocument` عند وجود صرف أو طلب شراء في أي فرع، `ItemRequisitionInvalidBranch`/`InvalidJob`/`InvalidItems` |
| حذف طلب غير مرتبط (`delete`) | `DELETE /api/ItemRequisition?id={id}` (`RemoveAsync`) | `ItemRequisition.Delete` (كتابة) | `ItemRequisition.View` ([PermissionPrerequisites.cs](file:///F:/My Work/Sigma/SigmaBackend/SiGma.ServerAPI/Authorization/PermissionPrerequisites.cs#L477)) | `DemandRequestScope()` + `DemandBranchWrite(source.BranchId)` + `IsActiveBranchAsync` + فحص الارتباط `LinkedAsync(id)` | `403` من مرشّح المنح، `404` للسجل غير المسموح، `BranchAccessDeniedException` لفرع قراءة فقط، `400 ItemRequisitionLinkedDocument` للطلب المرتبط بأي حركة على مستوى الشركة |
| التحويل إلى إذن صرف (`Issue`) | `POST /api/ItemRequisition/{id}/Issue` | `ItemRequisition.Issue` (كتابة) | `ItemRequisition.View` + `Branch.Lookup` (**A3**: دون اشتراط `ItemIssue.Create`) ([L478](file:///F:/My Work/Sigma/SigmaBackend/SiGma.ServerAPI/Authorization/PermissionPrerequisites.cs#L478)) | المصدر: قراءة عبر `LoadReadableForActionAsync` (`BeginBranchReferenceRead` -> يكفي `ReadBranchIds`)؛ الوجهة `vm.BranchId`: `DemandBranchWrite` + `IsActiveBranchAsync` + سقف المتبقي على مستوى الشركة داخل `ExecuteUniqueWriteAsync<ItemRequisition>` | `403` من مرشّح المنح، `404` إذا كان المصدر غير مرئي، `BranchAccessDeniedException` أو `ItemRequisitionInvalidBranch` لوجهة قراءة-فقط أو غير نشطة، `ItemRequisitionQuantityExceeded` عند تجاوز المتبقي |
| التحويل إلى طلب شراء (`/ItemRequisition/purchase-request/:id`) | `POST /api/ItemRequisition/{id}/PurchaseRequest` | `ItemRequisition.CreatePurchaseRequest` (كتابة) | `ItemRequisition.View` + `Supplier.Lookup` + `Branch.Lookup` + `UnitsOfMeasures.Lookup` + `Currency.Lookup` + `Currency.GetFinancialNumberPolicy` + `Currency.PreviewConversion` + `Supplier.View` + `SettingsCommonModel.GetMySetting` (**A3**: دون `PurchaseRequests.Create` أو `Media.*`) ([L479-L489](file:///F:/My Work/Sigma/SigmaBackend/SiGma.ServerAPI/Authorization/PermissionPrerequisites.cs#L479-L489)) | المصدر: `LoadReadableForActionAsync`؛ الوجهة `vm.BranchId`: **إلزامي لجميع المستخدمين بما فيهم مدير الشركة (A2)** + `DemandBranchWrite` + `IsActiveBranchAsync`؛ قفل `ItemRequisition` -> `PurchaseRequest` -> `CurrencyWriteLock`؛ تحقق `ValidDocuments` من مسار `/{tenantId}/purchaseRequest/*.ext` | `403` من مرشّح المنح، `404` لمصدر مخفي، `BranchAccessDeniedException` لفرع غير قابل للتسجيل، `ItemRequisitionInvalidBranch` لفرع غير نشط، `ItemRequisitionInvalidInput` لنقص `BranchId` أو مسار مرفق مخالف، `ItemRequisitionPurchaseRequestExists` لوجود طلب شراء في أي فرع |
| قدرات اختيارية داخل طلب الشراء | رفع `POST Media` / حذف `DELETE Media` / قراءة `PurchaseRequest/GetByWithNavigationsId/{id}` | `Media.UploadMedia`، `Media.DeleteMedia`، `PurchaseRequests.View` | منحة كل قدرة اختيارية على حدة دون حجب الحفظ الأساسي (**A3**) | تخفي الواجهة الرفع/التنظيف أو "حفظ وطباعة" عند غياب الصلاحية ولا ترسل حذف ملف دون `Media.DeleteMedia` | إخفاء/تعطيل محلي في `purchase-request.component.ts` + رفض خادمي `403` لو طُلب المنفذ مباشرة |
| المنافذ الموروثة ومسار البنود `/ItemRequisitionItem` | تحويل الواجهة إلى `/ItemRequisition`؛ ومنافذ `HandleActivate`/`CheckUnique`/`GetSelect`/`GetAllWithNavigations` الموروثة، وطرائق الخدمة الداخلية `AddList`/`UpdateList`، و`ItemRequisitionItemService` | خارج كتالوج الإسناد (`UnsupportedActivation` في `PermissionEndpointResolver.cs:21` و`L85`) | — | إرجاع `405 Method Not Allowed` (`ItemRequisitionOperationNotSupported` / `ItemRequisitionUseAggregateEditor`) | المستخدم العادي يُرفض بـ`403` في مرشّح الصلاحيات، والمدير يصل إلى نتيجة الخدمة `405`. الواجهة تعيد التوجيه عبر `CanMatchFn` في [itemrequisitionitem.routes.ts](file:///F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemRequisitionItem/itemrequisitionitem.routes.ts#L1-L8)؛ الخادم يرجع `405` |

---

## ٢. الرصيد والكمية المتبقية والارتباط على مستوى الشركة تحت قفل الكتابة وحماية التفاصيل المقيدة

- في [ItemRequisitionSourceQuery.cs](file:///F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StocksServices/ItemRequisitionSourceQuery.cs#L8) و[ItemRequisitionService.cs](file:///F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StocksServices/ItemRequisitionService.cs#L96-L150)، تُقرأ جميع أذون الصرف وطلبات الشراء داخل الشركة (`QueryReport<T>().IgnoreQueryFilters()` مقيّدًا بـ `SubscriptionId` و`IsDeleted != true`) لحساب `IssuedLines` و`AmbiguousSourceIds` و`ReferencedByIssues` و`ReferencedByPurchases` في القائمة والتفاصيل وإجراءات الكتابة والتحويل.
- تتم عمليات الحذف (`RemoveAsync`) والصرف (`IssueAsync`) وإنشاء طلب الشراء (`CreatePurchaseRequestAsync`) والتعديل (`UpdateCoreAsync`) تحت `ExecuteUniqueWriteAsync<ItemRequisition>` (مع `ExecuteUniqueWriteAsync<PurchaseRequest>` و`CurrencyWriteLock` في `CreatePurchaseRequestAsync` بالترتيب الثابت `[L768-L772]`)، بما يمنع سباق صرف كميات تتجاوز المتبقي أو إنشاء طلب شراء ثانٍ عبر فرعين متوازيين.
- **حماية التفاصيل المقيدة**: لا تُعيد `ProjectListWithSets` ولا `ReadDetailAsync` ولا رسائل الخطأ أي رقم أو معرف أو اسم فرع لإذن صرف أو طلب شراء في فرع غير مرئي؛ وإنما تعود فقط القيم التجميعية (`Status`, `HasPurchaseRequest`, `CanEdit`, `CanDelete`, `CanCreatePurchaseRequest`, `CanIssue`, `IssuedQuantity`, `RemainingQuantity`).
- **إصلاح المستهلك المرتبط `ItemIssueService`**: حُدّثت `SourceProvenanceErrorAsync` (`L615`) و`RequisitionCapacityErrorAsync` (`L690`) في [ItemIssueService.cs](file:///F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StocksServices/ItemIssueService.cs#L615-L720) لقراءة `ItemRequisition` و`ItemRequisitionItem` عبر `IgnoreQueryFilters()` على نطاق الشركة بعد التحقق من فرع إذن الصرف، فلا ينكسر اعتماد إذن صرف عابر للفروع بفرض تصفية الفرع على `ItemRequisition`.

---

## ٣. فحص الفرع المحفوظ والجديد والنشاط ومدير الشركة والمراجع غير النشطة للسطر المحفوظ

- **التعديل المباشر (`UpdateCoreAsync`, [L628-L661](file:///F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StocksServices/ItemRequisitionService.cs#L628-L661))**: يثبت `DemandBranchWrite` و`IsActiveBranchAsync` على `request.Job.BranchId` المحفوظ وعلى `job.BranchId` الجديد عند النقل؛ وإذا لم يبق للفرع نشاط فعلي (`IsActive == false`) يُرفض الحفظ بـ `ItemRequisitionInvalidBranch` **حتى لمدير الشركة**.
- **الإنشاء والحذف (`AddAsync` و`RemoveAsync`)**: يتحققان بالمثل من `DemandBranchWrite` و`IsActiveBranchAsync` على `Job.BranchId`؛ وحارس قاعدة البيانات في [SiGmaDbContext.BranchAccess.cs](file:///F:/My Work/Sigma/SigmaBackend/SiGma.DataAccess/SiGmaDbContext.BranchAccess.cs#L733-L756) و[L818-L845](file:///F:/My Work/Sigma/SigmaBackend/SiGma.DataAccess/SiGmaDbContext.BranchAccess.cs#L818-L845) يثبّت `JobId` كرمز تزامن على `ItemRequisition` و`ItemRequisitionId` على `ItemRequisitionItem`.
- **استثناء المراجع غير النشطة للسطر المحفوظ نفسه**: عند التعديل تُمرَّر `retainedJobId: request.JobId` و`retainedItemIds` المقتصرة على السطور المحفوظة دون تغيير (`line.Id > 0 && savedItemsByLine.TryGetValue(line.Id, out var savedItemId) && savedItemId == line.ItemId`)؛ أي تغيير لـ `JobId` أو إضافة سطر جديد أو تغيير `ItemId` على سطر موجود يشترط مرجعًا نشطًا. في الواجهة ([details.component.ts](file:///F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemRequisition/components/details/details.component.ts)) تبقى القيمة المحفوظة غير النشطة ظاهرة ومعطلة الاختيار الجديد عبر `optionDisabled="disabled"`، كما ترشّح نافذتا الصرف وطلب الشراء الفروع القابلة للتسجيل (`canTransact` + نشط).

---

## ٤. تطابق القائمة والتقرير وExcel والفلاتر والفرز والترقيم وحالة `Job.Lookup` والطباعة

- تستخدم القائمة والتقرير وتصدير Excel الدالة الموحدة `effectiveItemRequisitionQuery(query, canLookupJob)` ([models/list.ts](file:///F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemRequisition/models/list.ts#L31-L45)) والخدمة المشتركة `ItemRequisitionService.GetManyAsync` المقيّدة بـ `SanitizeListSearchModel` (`no`, `jobId`, `status`, `hasPurchaseRequest`, `dateFrom`, `dateTo`, `grid`, `sortField`, `sortOrder`) مع استبعاد الحقول غير المسموحة (`ExcludedGridFields`) والترقيم المحدود `[1..100]`.
- عند سحب `Job.Lookup` أثناء فتح التقرير في وضع الاستعلام، يُصفَّى الاستعلام وتُعاد قراءة التقرير تلقائيًا دون `jobId` أو `jobName` sort أو شروط `Job` في `grid`؛ وفي القائمة يُخفى عنصر التصفية بأمر الشغل ويُستدعى `clearJobFilter(true)` مع إغلاق المنبثقات (`closeOverlays`).
- تحفظ نسخة الصفوف إصدار الوصول وجلسة الدخول إلى جانب السياق والاستعلام؛ يُلغى الإطار المنتظر وتؤجل إعادة القراءة حتى `afterPrint` أثناء طباعة يملكها المتصفح ما دام العرض قائمًا. سحب العرض يمسح البيانات الخاصة.
- ترتبط الطباعة في [report.component.ts](file:///F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemRequisition/components/report/report.component.ts#L214-L259) بإصدار الاستعلام والصفوف (`rowsVersion`: `mode`, `query`, `jobLookup`, `dataContext`) عبر `ReportPrintService` مع إلغاء القراءة والطباعة المعلّقة فور تغيّر الصلاحية أو سياق البيانات.

---

## ٥. فصل سحب العرض عن منحة الإجراء أثناء فتح النوافذ الفرعية والتجاهل المحلي وتسوية الطلبات

- **القائمة والإنشاء المباشر**: المسار `/ItemRequisition/create` يعمل مستقلًا عن `ItemRequisition.View` (`isCreateRoute`) دون استدعاء `GetList` أو قراءة القائمة. سحب `View` مع بقاء حوار مفتوح (`Details` / `Issue` / `Report`) لا يعرض تراكب الحجب فوق النافذة الفرعية ولا يُسقط التغييرات الجارية بل يُفرغ صفوف الخلفية فقط ويُغلق المنبثقات (`closeOverlays`).
- **التفاصيل (`Details`) والصرف (`Issue`) وطلب الشراء (`PurchaseRequest`)**:
  - سحب `ItemRequisition.Update` أو `ItemRequisition.Issue` أو `ItemRequisition.CreatePurchaseRequest` مع بقاء `ItemRequisition.View` يُبقي الحوار/الصفحة في حالة قراءة ويعطل الإرسال والحفظ فقط (`canWriteGrant` / `canIssueGrant` / `canCreatePRGrant` مفصولة عن `canOpen` / `canView`).
  - سحب `ItemRequisition.View` مع وجود مسودة متسخة (`form.dirty`) لا يمسح تعديلات المستخدم ولا يعلق `CanDeactivate`، بل يتيح مغادرة آمنة عبر تأكيد التجاهل المحلي (`ConfirmationDialogService.confirmDiscard('itemRequisition')` / `purchaseRequest`) ويستبعد في طلب الشراء استدعاء حذف الملفات من الخادم إذا غابت `Media.DeleteMedia` (`uploads.canCleanup()`).
  - أي طلب `POST`/`PUT`/`DELETE` أُرسل قبل سحب الصلاحية يُترك ليستقر مع ضبط `saveCommitted` ومنع عرض رسائل متقادمة via `CAN_PRESENT_API_OUTCOME` وتفادي تعليق `CanDeactivate` عند إغلاق النافذة.
- **دليل المستخدم**: حُدّث موضوع `sideMenu.stocks.itemRequisitions` (`/ItemRequisition`) في [stock-guide.ts](file:///F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/UserGuide/content/stock-guide.ts#L168-L190) باللغتين الإنجليزية والعربية ليعكس الصلاحيات وفصل العرض عن الإجراءات وفروع الوجهة والقدرات الاختيارية.

---

## ٦. حالات التحقق وتفريق ما ثبت بالمصدر وما تحقق بالبناء وما هو معلّق تشغيلًا

### مواصفات الاختبار المُنشأة/المحدّثة (مصدرها خاضع للمراجعة؛ التنفيذ معلّق)

تعكس القائمة التالية نطاق المواصفات، ولا تثبت تشغيلها أو نجاحها. صححت مراجعة
١٣ نوفمبر التهيئة والبيانات وحدود المزود. حالات الحفظ التي تعتمد معاملات
وأقفال SQL Server معزولة صراحة عن حالات التحقق قبل الحفظ؛ دورة التحويل ثم
الاعتماد الكامل ما زالت تحتاج قاعدة تكامل SQL، ولا يثبتها بناء المشروع.

- **الخادم ([ItemRequisitionAccessContractTests.cs](file:///F:/My Work/Sigma/SigmaBackend/tests/SiGma.BranchAccess.Tests/ItemRequisitionAccessContractTests.cs))**:
  1. تطابق `PermissionEndpointResolver` (`View`/`Create`/`Update`/`Delete`/`Issue`/`CreatePurchaseRequest`) واستبعاد المنافذ المتقاعدة (`HandleActivateAsync`, `CheckUniqueAsync`, `GetSelectAsync`, `GetAllWithNavigationsAsync`) و`ItemRequisitionItemController`.
  2. شرطية `Job.Lookup` في `PermissionPrerequisites` (`jobId`, `sortField=jobName`, `grid` بـ`JobName`/`JobId`/`Job.*`, JSON تالف/زائد الحجم > 16384 fail-closed) وبقية الاعتماديات دون اشتراط `ItemIssue.Create` أو `PurchaseRequests.Create` أو `Media.*`.
  3. تصفية فروع القراءة + الحساب على مستوى الشركة (منصرف/متبقي/ارتباط مع فرع مخفي 30) دون تسريب تفاصيل المستندات المقيدة + رفض حقول BE9 غير المدعومة.
  4. فحص `Job.BranchId` المحفوظ والجديد في التعديل، وفشل الارتباط المخفي، واستثناء المرجع غير النشط للسطر المحفوظ دون الجديد/المبدّل، ومنع المدير على الفرع غير النشط في الإنشاء والتعديل والحذف.
  5. تحويل `IssueAsync` من مصدر قراءة-فقط إلى وجهة `CanTransact` + فرض سقف المتبقي على مستوى الشركة + رفض وجهة قراءة-فقط أو غير نشطة للمدير.
  6. تحويل `CreatePurchaseRequestAsync`: إلزام `BranchId` النشط القابل للتسجيل للجميع بمن فيهم المدير، وحظر التكرار عبر الفروع، والتحقق من مسار المرفقات `^purchaseRequest/...` ورفض traversal.
  7. إثبات `405` للمنافذ المتقاعدة على `ItemRequisitionService` و`ItemRequisitionItemService`.
- **الواجهة (`*.spec.ts`)**:
  - [item-requisition-access.spec.ts](file:///F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemRequisition/item-requisition-access.spec.ts) و[itemrequisitionitem.routes.spec.ts](file:///F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemRequisitionItem/itemrequisitionitem.routes.spec.ts)
  - [list.component.spec.ts](file:///F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemRequisition/components/list/list.component.spec.ts)
  - [report.component.spec.ts](file:///F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemRequisition/components/report/report.component.spec.ts)
  - [details.component.spec.ts](file:///F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemRequisition/components/details/details.component.spec.ts)
  - [issue.component.spec.ts](file:///F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemRequisition/components/issue/issue.component.spec.ts)
  - [purchase-request.component.spec.ts](file:///F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemRequisition/components/purchase-request/purchase-request.component.spec.ts)

### نتيجة الفحوص المصرّح بها وتوثيق المعلّق (`Pending Verification`)

### التحقق المنفذ بعد الإصلاح

- نجح بناء `tests/SiGma.BranchAccess.Tests/SiGma.BranchAccess.Tests.csproj`
  بواسطة `dotnet build --no-restore -m:1 --disable-build-servers --verbosity quiet`:
  رمز خروج 0، صفر أخطاء، ٣٧ تحذيرًا في ملفات خارج تعديل هذا البند،
  زمن 00:01:12.36. يشمل تجميع تطبيق الخادم ومواصفاته؛ لم يُشغّل test runner.
- نجح `npm run build`: رمز خروج 0، اكتمال حزمة التطبيق في 152.868 ثانية؛
  ستة تحذيرات ميزانية حجم الحزمة وملفات SCSS خارج هذا التعديل.
- نجح `tsc --noEmit` بإعداد مؤقت يرث `tsconfig.spec.json` ويشمل ملفات
  مواصفات `ItemRequisition` الستة فقط: رمز خروج 0، دون أخطاء. أزيل الملف
  المؤقت، ولم تتغير إعدادات المشروع. هذا فحص تجميع وليس تشغيل اختبارات.
- فُحصت فروق الملفات المحصورة والملفات الجديدة للمسافات وعلامات الدمج،
  ومطابقة الأنواع والاستيرادات والعقد. فحص الوصفات الحالي 8/8 مطابق.
- لم تُشغّل اختبارات أو lint أو متصفح أو HTTP أو أوامر قاعدة بيانات أو هجرة،
  ولم يحدث commit أو push أو نشر.


- **سجل البناء السابق قبل إصلاح ملاحظات مراجعة ١٣ نوفمبر** (دليل تاريخي، وليس تحققًا من التعديلات الحالية):
  - `dotnet build "F:\My Work\Sigma\SigmaBackend\SiGma.sln" --no-restore -m:1 --disable-build-servers`: نجح البناء (`Build succeeded. 3 Warning(s)` تحذيرات `NU1902`/`NU1903` مسبقة في `SiGma.Security` و`SiGma.SubscriptionAPI`، `0 Error(s)`، `Time Elapsed 00:00:14.80`).
  - `dotnet build "F:\My Work\Sigma\SigmaBackend\tests\SiGma.BranchAccess.Tests\SiGma.BranchAccess.Tests.csproj" --no-restore -m:1 --disable-build-servers`: نجح البناء (`Build succeeded. 22 Warning(s)` مسبقة و`0` تحذيرات/`0` أخطاء في [ItemRequisitionAccessContractTests.cs](file:///F:/My%20Work/Sigma/SigmaBackend/tests/SiGma.BranchAccess.Tests/ItemRequisitionAccessContractTests.cs)، `0 Error(s)`، `Time Elapsed 00:00:14.03`).
  - `npm run build` (في `SiGmaAngularFrontEnd`): اكتمل بنجاح (`Command exited with code 0`، `Application bundle generation complete. [176.111 seconds]`، المخرجات `F:\My Work\Sigma\SiGmaAngularFrontEnd\dist\sigma`).
  - `npx tsc --noEmit -p tsconfig.spec.json`: `IR_MATCHES=0` (`0` أخطاء في مواصفات `ItemRequisition` و`ItemRequisitionItem` و`permission-dependencies` و`route-access-policy`)، مع `TOTAL_SPEC_ERRS=55` مسبقة في وحدات غير مرتبطة (`BalanceSheet`، `login`، `TimeSheet`، `Accidents`، `ServiceBookings`، `ServiceLog`، `StaffTimesheet`، `Rental/Agreement`، `Rental/MasterAgreement`، `Bill`).
  - `git diff --check` (`SigmaBackend` و`SiGmaAngularFrontEnd`): `BE_DIFF=0` و`FE_DIFF=0`.
  - `Generate-SigmaRecipes.ps1 -Check`: `8/8 OK` (`RECIPE_CHECK=0`).
- **معلّق خارج حدود المصدر (لم يُنفَّذ وفق حدود التحقق)**: تشغيل `dotnet test` و`ng test` و`ng lint` واختبار المتصفح الحي وقواعد بيانات SQL الفعلية وأي هجرة/نشر.
- **تحديث السجلات والجرد**: ترقية `ItemRequisition` إلى `operation-confirmed` وتحويل `ItemRequisitionItem` إلى `alias` في [ROUTE_PERMISSION_ADOPTION_INVENTORY.json](file:///F:/My Work/Sigma/reviews/Authorization/ROUTE_PERMISSION_ADOPTION_INVENTORY.json) (`160 operation-confirmed`, `47 resource-only`, `50 unknown`, `2 context-only`, `4 alias` من `263`) وتحديث [MODULE_PERMISSIONS_COVERAGE.md](file:///F:/My Work/Sigma/reviews/Authorization/MODULE_PERMISSIONS_COVERAGE.md).
