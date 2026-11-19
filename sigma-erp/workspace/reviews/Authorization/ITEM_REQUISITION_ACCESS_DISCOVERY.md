# اكتشاف صلاحيات ونطاق فروع طلبات الأصناف (`ItemRequisition` — البند ١٦١/١٦٢)

| البند | القيمة |
|---|---|
| Status | Discovery Complete — Owner Confirmation Pending |
| التاريخ | 2026-11-13 |
| النطاق | `/ItemRequisition`، `/ItemRequisition/create`، `/ItemRequisition/details/:id`، `/ItemRequisitionItem`، `ItemRequisitionController`، `ItemRequisitionItemController`، `ItemRequisitionService`، `ItemIssueService` |
| المراجع المقروءة | `AGENTS.md`، `SKILL.md`، `SIGMA_WORKFLOW_RULES.md`، `BE8`، `UI21`، `UI28`، `Master 7`، `Speed_Analysis_Guide.md` + `S113` (`90c6e368ce903381.txt`)، `15-stock/screens/04-item-requisitions.md` + `C1706` + `C1707`، `ITEM_REQUISITION_DOMAIN_API_CONTRACT_FREEZE.md`، `STOCK_CHILD_WORKFLOW_CONTRACT_FREEZE.md`، `STOCK_BRANCH_BALANCE_CONTRACT_FREEZE.md`، `DOCUMENT_LINE_SOURCE_PROVENANCE_CONTRACT_FREEZE.md`، `PURCHASE_REQUESTS_CONTRACT_FREEZE.md`، `ITEM_ISSUE_ACCESS_CONTRACT_FREEZE.md`، `AUTHORIZATION_159_SOURCE_REVIEW_20261113.md` |

---

## ١. تتبّع الإجراءات والمسارات والمنح (البند ١ من قائمة المراجعة)

| إجراء الواجهة / المسار | المسار الفعلي في الخادم | المنحة الأساسية في `PermissionEndpointResolver` | الاعتماديات والمصادر المساندة |
|---|---|---|---|
| فتح `/ItemRequisition` وعرض القائمة | `GET /api/ItemRequisition` | `ItemRequisition.View` | `Job.Lookup` عند التصفية/الفرز/فلتر الشبكة بحقل أمر الشغل (`jobId` / `jobName`) |
| تصدير Excel والطباعة (`Report`) | `GET /api/ItemRequisition` | `ItemRequisition.View` | نفس استعلام القائمة الفعلي المنظف (`effectiveItemRequisitionQuery`) مع `Job.Lookup` الشرطية |
| عرض التفاصيل (`view` / `/ItemRequisition/details/:id`) | `GET /api/ItemRequisition/GetByWithNavigationsId/{id}` و`GET /api/ItemRequisition/GetById/{id}` | `ItemRequisition.View` | قراءة المستند وبنوده المشتقة دون اشتراط منح المراجع (`Job.Lookup` / `Item.Lookup`) |
| إنشاء طلب أصناف (`/ItemRequisition/create` أو زر الإضافة) | `POST /api/ItemRequisition` | `ItemRequisition.Create` | `Job.Lookup` (`GET /api/Job/GetSelect`) + `Item.Lookup` (`GET /api/Item/GetSelect`) |
| تعديل طلب أصناف غير مرتبط | `PUT /api/ItemRequisition` | `ItemRequisition.Update` | `ItemRequisition.View` + `Job.Lookup` + `Item.Lookup` |
| حذف طلب أصناف غير مرتبط | `DELETE /api/ItemRequisition?id={id}` | `ItemRequisition.Delete` | `ItemRequisition.View` |
| تحويل إلى إذن صرف (`Issue`) | `POST /api/ItemRequisition/{id}/Issue` | `ItemRequisition.Issue` | `ItemRequisition.View` + `Branch.Lookup` |
| تحويل إلى طلب شراء (`Create Purchase Request`) | `POST /api/ItemRequisition/{id}/PurchaseRequest` | `ItemRequisition.CreatePurchaseRequest` | `ItemRequisition.View` + `Supplier.Lookup` + `Branch.Lookup` + `UnitsOfMeasures.Lookup` + `Currency.Lookup` + `Currency.GetFinancialNumberPolicy` + `Currency.PreviewConversion` + `Supplier.View` + `SettingsCommonModel.GetMySetting`، مع `Media.UploadMedia`/`Media.DeleteMedia` للمرفقات و`PurchaseRequests.View` لخيار «حفظ وطباعة» حسب الحاجة |
| المسار القديم `/ItemRequisitionItem` | تحويل في الواجهة إلى `/ItemRequisition` | `alias` يتبع سياسة الوجهة `/ItemRequisition` | المستخدم العادي يُرفض بـ`403` في المرشّح على المنفذ غير المسند، والمدير يصل إلى نتيجة الخدمة `405` |

---

## ٢. الفجوات المؤكدة في المصدر الحالي (البنود ٢–٦ من قائمة المراجعة)

1. **نطاق الشركة الكامل لحساب المنصرف والمتبقي والارتباط تحت قفل الكتابة (البند ٢ + ملاحظة P2 رقم ٢ من مراجعة ١٥٩)**:
   - في [ItemRequisitionService.cs](file:///F:/My%20Work/Sigma/SigmaBackend/SiGma.Business/Services/StocksServices/ItemRequisitionService.cs#L20-L39) و[السطر 148](file:///F:/My%20Work/Sigma/SigmaBackend/SiGma.Business/Services/StocksServices/ItemRequisitionService.cs#L148):
     - `IssuedLines` و`AmbiguousSourceIds` و`ReferencedByIssues()` و`ReferencedByPurchases()` وفحص `prId` في `ReadDetailAsync` تستعمل `UnitOfWork.Repository.Query<ItemIssue>()` و`UnitOfWork.Repository.Query<PurchaseRequest>()` المقيدين بفروع القراءة للمستخدم الحالي (`BranchReadIds`).
     - إذا صُرف جزء من الطلب أو أُنشئ له طلب شراء في فرع آخر لا يقرؤه المستخدم الحالي، يغيب أثره عن الحساب، فيظهر `IssuedQuantity` أقل من الحقيقة و`RemainingQuantity` أكبر، وقد يسمح بصرف كمية تتجاوز المطلوب أو إنشاء طلب شراء مكرر أو تعديل/حذف طلب مرتبط.
     - الحل: استخدام `UnitOfWork.Repository.QueryReport<ItemIssue>().IgnoreQueryFilters()` و`UnitOfWork.Repository.QueryReport<PurchaseRequest>().IgnoreQueryFilters()` (مع بقاء شرط الشركة `SubscriptionId` و`IsDeleted != true`) داخل حسابات الكميات والارتباط فقط، تحت قفل الكتابة (`ExecuteUniqueWriteAsync`)، دون كشف تفاصيل أذون الصرف أو طلبات الشراء غير المصرح بعرضها.
   - في [ItemIssueService.cs](file:///F:/My%20Work/Sigma/SigmaBackend/SiGma.Business/Services/StocksServices/ItemIssueService.cs#L668-L702) و[StockBranchBalanceReader.cs](file:///F:/My%20Work/Sigma/SigmaBackend/SiGma.Business/Services/StocksServices/StockBranchBalanceReader.cs#L15-L120):
     - فحص الكمية المتبقية على `ItemRequisition` عند اعتماد `ItemIssue` يقرأ عبر `Repository.Query<ItemRequisition>()` و`Repository.Query<ItemIssue>()` المقيدين بفروع المعتمِد.

2. **حصر الفلاتر والفرز وفلتر الشبكة (`grid`) وشرط `Job.Lookup` (البند ٤)**:
   - `ItemRequisitionService.ApplyListFilters` يسمح بمرور `GridFilter.Apply` دون فحص منحة `Job.Lookup` عند التصفية أو الفرز بـ`jobId` / `jobName`، و`Service.GetSortedProjectedData` يرتب بأي `sortField` يطابق اسم خاصية في `ItemRequisition` (مثل `JobId`) ما لم يُحصر في الحقول المعتمدة (`No`, `DateAndTime`, `JobName`, `Status`, `HasPurchaseRequest`).
   - في الواجهة: `report.component.ts` يحتفظ بنسخة الاستعلام الملتقطة عند الفتح ولا يعيد تنظيف فلتر/فرز أمر الشغل عند سحب `Job.Lookup` والتقرير مفتوح، ولا يربط `printSession` بإصدار الاستعلام والصلاحيات (`rowsVersion`).

3. **الاعتماديات في الخادم (`PermissionPrerequisites`) وحجب المنافذ الموروثة (البند ١)**:
   - `ItemRequisition` غير مضاف بعد في `PermissionPrerequisites.cs`.
   - المنافذ الموروثة غير المستعملة على `ItemRequisitionController` (`AddList`, `UpdateList`, `RemoveRange`, `CheckUnique`, `Activate`, `GetAllWithNavigations`, `GetSelect`) لا تزال مفتوحة بدل إرجاع `405 Method Not Allowed`.
   - في `ItemRequisitionService.CreatePurchaseRequestAsync`: `Documents` المرسلة لا تمر عبر `CustomerDocumentUploadPaths.TryNormalizeOwnedDocumentPath` للتحقق من ملكية مسار المرفق للشركة الحالية (`SubscriptionId`).

4. **دورة حياة الصلاحيات والنوافذ الفرعية في الواجهة (البند ٥)**:
   - شاشة `ItemRequisition` (`list`, `details`, `issue`, `purchase-request`, `report`) لا تستهلك `AccessViewPolicyService` ولا `RouteAccessPolicyRegistry` ولا `CAN_PRESENT_API_OUTCOME`.
   - النوافذ الفرعية (`details`, `issue`, `purchase-request`, `report`) وحوار تأكيد حذف السطر أو حذف السجل تحتاج فصل سحب `ItemRequisition.View` عن سحب منحة الإجراء (`Update` / `Issue` / `CreatePurchaseRequest`)، مع بقاء المسودة عند السحب العابر، ومسار محلي لتجاهل المسودة بتأكيد محلي، وتسوية الطلبات المرسلة (`saving` / `saveCommitted`) دون تعليق إغلاق النافذة الرئيسية.

---

## ٣. القرارات المطلوب حسمها مع المالك قبل التجميد والتنفيذ

1. **نطاق الفرع لطلب الأصناف (`ItemRequisition`) وعلاقته بفرع أمر الشغل (`Job.BranchId`)**:
   - الكيان `ItemRequisition` لا يحمل عمود `BranchId` مباشر، لكنه يرتبط وجوبًا بأمر شغل `JobId` (`Job.BranchId` مطلوب).
   - هل يتبع `ItemRequisition` (وبنوده `ItemRequisitionItem`) فرع أمر الشغل (`Job.BranchId`) في القراءة والإنشاء والتعديل والحذف (بحيث يتطلب العرض صلاحية استعراض فرع أمر الشغل، ويتطلب الإنشاء/التعديل/الحذف صلاحية تسجيل `CanTransact` على فرع أمر الشغل النشط، وعند تغيير أمر الشغل في التعديل يُفحص الفرع المحفوظ والجديد معًا)، بينما يفحص التحويل إلى **إذن صرف** أو **طلب شراء** صلاحية التسجيل (`CanTransact`) والنشاط على **فرع المستند الناتج** (`vm.BranchId`) مع الاكتفاء بصلاحية عرض الطلب الأصلي؟
2. **إلزام الفرع عند إنشاء طلب شراء من طلب أصناف (`POST /api/ItemRequisition/{id}/PurchaseRequest`)**:
   - حاليًا `BranchId` اختياري (`int?`) في `ItemRequisitionPurchaseRequestVM` بينما `PurchaseRequest` مقيد بنطاق الفروع في `BranchScopeRegistry` (فتركه فارغًا يرفض الحفظ للمستخدم العادي بـ`403` ويخفي السجل عن غير المدير).
   - هل يُجعل اختيار الفرع (`BranchId`) **إلزاميًا** ونشطًا وقابلًا للتسجيل (`CanTransact`) في حوار إنشاء طلب الشراء من طلب الأصناف (أسوة بحوار الصرف)، أم يبقى اختياريًا للمدير فقط وإلزاميًا للمستخدم العادي؟
3. **منح التحويل (`Issue` و`CreatePurchaseRequest`) والقدرات الفرعية داخل حوار طلب الشراء**:
   - هل تكفي المنحتان المخصصتان `ItemRequisition.Issue` و`ItemRequisition.CreatePurchaseRequest` (مع `ItemRequisition.View` ومنح الـLookup المساندة) لتنفيذ التحويلين دون اشتراط `ItemIssue.Create` و`PurchaseRequests.Create`؟
   - وداخل حوار إنشاء طلب الشراء: هل تُفصل **رفع/حذف المرفقات** (`Media.UploadMedia` / `Media.DeleteMedia`) وزر **«حفظ وطباعة»** (الذي يقرأ `GET /api/PurchaseRequest/GetByWithNavigationsId/{id}` بمنحة `PurchaseRequests.View` ونطاق قراءة فرع طلب الشراء) كقدرات فرعية اختيارية داخل الحوار (تُخفى/تُعطّل عند غياب منحتها مع بقاء «حفظ» العادي متاحًا)، أم تُعد متطلبات إجبارية لفتح الحوار؟
