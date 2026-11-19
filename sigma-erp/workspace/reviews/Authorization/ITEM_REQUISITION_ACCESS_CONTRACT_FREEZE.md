# تجميد عقد صلاحيات طلبات الأصناف — البند ١٦١ (`ItemRequisition`)

| البند | القيمة |
|---|---|
| Status | Contract Frozen (Implementation in progress) |
| Owner verification pending | yes |
| التاريخ | ١٣ نوفمبر ٢٠٢٦ |
| الشاشة / المسار | `/ItemRequisition` و`/ItemRequisition/purchase-request/:id` (تحويلات التوافق: `/ItemRequisition/create` و`/ItemRequisition/details/:id`)، وتحويل مسار البنود القديم `/ItemRequisitionItem` |
| قرارات المالك المعتمدة | Q1 = A1، Q2 = A2، Q3 = A3 |

## 1. ملكية الفرع والنطاق (A1 + A2)

1. **ملكية `ItemRequisition` و`ItemRequisitionItem`**:
   - يتبع طلب الأصناف (`ItemRequisition`) وبنوده (`ItemRequisitionItem`) فرع أمر العمل المرتبط (`Job.BranchId`).
   - على القراءة (`View`، `GetList`، `GetById`، `GetByIdWithNavigations`، والتقرير، وتصدير Excel) يقتصر ظهور الطلب على فروع القراءة المسموح بها للمستخدم (`ReadBranchIds`) أو مدير الشركة (`BranchScopeIsAdministrator`).
   - على الحفظ المباشر (`Create`، `Update`، `Delete`) وقيود حفظ EF (`SiGmaDbContext`): يتطلب إنشاء الطلب وتعديله وحذفه فرع تنفيذ نشطًا مسموحًا فيه بالكتابة (`CanTransact` + `IsActive != false`) على `Job.BranchId` المحفوظ والجديد عند النقل (`Update` يغيّر `JobId`)، حتى لمدير الشركة فيما يخص نشاط الفرع المرجعي.
   - تُسجَّل `JobId` كرمز تزامن (`ConcurrencyToken`) على `ItemRequisition` وتُسجَّل `ItemRequisitionId` كرمز تزامن على `ItemRequisitionItem` مع التحقق من ملكية الأب وأصل `Job.BranchId` على مستوى قاعدة البيانات (`SiGmaDbContext.BranchAccess`).
2. **أفعال التنفيذ والتحويل (`Issue` و`CreatePurchaseRequest`) (A1 + A2)**:
   - تتطلب عملية `Issue` (`POST /api/ItemRequisition/{id}/Issue`) و`CreatePurchaseRequest` (`POST /api/ItemRequisition/{id}/PurchaseRequest`):
     - صلاحية العرض (`ReadBranchIds`) على الطلب المصدر (`Job.BranchId`) دون اشتراط `CanTransact` على فرع الطلب نفسه (`BeginBranchReferenceRead()`).
     - صلاحية التنفيذ (`TransactionBranchIds` / `CanTransact`) **ونشاط الفرع** (`IsActive != false`) على **فرع المستند الوجهة (`vm.BranchId`)** المنشأ (`ItemIssue.BranchId` أو `PurchaseRequest.BranchId`).
   - في `CreatePurchaseRequest`: يصبح `BranchId` **إلزاميًا** (`[Range(1, int.MaxValue)] public int BranchId { get; set; }`) لجميع المستخدمين بمن فيهم مدير الشركة.

## 2. الحسابات على مستوى الشركة وحماية التفاصيل المقيدة (البند 2)

- تُحسب الكميات المنصرفة (`IssuedLines`)، وحالة الغموض (`AmbiguousSourceIds`)، وارتباط الطلبات بأذون الصرف (`ReferencedByIssues`) وطلبات الشراء (`ReferencedByPurchases` / `LivePurchaseRequests`)، وخطوط `Remaining` على مستوى **جميع فروع الشركة (`QueryReport<T>().IgnoreQueryFilters()`)** داخل قفل الكتابة المتسلسل (`ExecuteUniqueWriteAsync<ItemRequisition>`)، وكذلك قفل `ExecuteUniqueWriteAsync<PurchaseRequest>` + `CurrencyWriteLock` في `CreatePurchaseRequestAsync`.
- لا تكشف الاستجابات (القائمة أو التفاصيل) أي معرف أو رقم أو فرع لمستند صرف أو طلب شراء مقيد؛ يُعرض فقط ملخص الحالة والأعلام المنطقية (`Status`, `HasPurchaseRequest`, `CanEdit`, `CanDelete`, `CanCreatePurchaseRequest`, `CanIssue`, `IssuedQuantity`, `RemainingQuantity`).
- يحدَّث `ItemIssueService` (`SourceProvenanceErrorAsync` و`RequisitionCapacityErrorAsync`) ليقرأ `ItemRequisition` و`ItemRequisitionItem` عبر `QueryReport<T>().IgnoreQueryFilters()` بعد إثبات فرع إذن الصرف، حتى لا ينكسر اعتماد إذن صرف عابر للفروع مرتبط بطلب أصناف بعد تفعيل تصفية الفرع على `ItemRequisition`.

## 3. المراجع النشطة والاستثناءات المرتبطة بالسطر المحفوظ (البند 3)

- **الإنشاء (`AddAsync`)**: يتطلب `Job` نشطًا، وفرع `Job` نشطًا (`CanTransact`)، وجميع `Item` نشطة.
- **التعديل (`UpdateCoreAsync`)**:
  - يفحص نشاط فرع `Job.BranchId` المحفوظ والجديد عند تغييره (بما في ذلك لمدير الشركة).
  - يسمح بالاحتفاظ بـ `Job` غير نشط فقط عندما `vm.JobId == stored.JobId` (نفس `JobId` المحفوظ)، ويرفض اختيار `Job` غير نشط جديد أو تغيير `JobId` إليه.
  - يربط استثناء الصنف غير النشط **بالسطر المحفوظ نفسه** (`line.Id > 0 && savedItemsByLine[line.Id] == line.ItemId`)، ويرفض أي صنف غير نشط مضاف في سطر جديد أو مُبدَّل إليه في سطر آخر.
- **التنفيذ (`IssueAsync` / `CreatePurchaseRequestAsync`)**: يفحص فرع الوجهة النشط القابل للتنفيذ، ويحتفظ بالمرجع المحفوظ على بنود الطلب فقط دون السماح بقبول بنود مكررة أو متجاوزة للمتبقي؛ ويتحقق في `CreatePurchaseRequestAsync` من نشاط `Supplier` و`Branch` و`UnitsOfMeasures` و`Currency`، ويقيّد المرفقات المرسلة بمسار رفع هذا المستأجر (`/{tenantId}/purchaseRequest/{file}.{ext}`).

## 4. مصفوفة الصلاحيات والاعتماديات وتقاعد المنافذ الموروثة (A3 + البند 1 و4)

- **المنافذ المتقاعدة (405 Method Not Allowed، غير مسندة في الكتالوج)**:
  - على `ItemRequisition`: `HandleActivate`, `CheckUnique`, `GetSelect`, `GetAllWithNavigations`, `UpdateList`, `AddList`.
  - على `ItemRequisitionItem`: تحويل الرابط الأمامي `/ItemRequisitionItem` كـ`alias` إلى `/ItemRequisition` (بدون منحة مسار مستقلة)، مع إبقاء `ItemRequisitionItemService` رافضًا للتعديل المباشر ومُغلقًا في الحلول.
- **اعتماديات `ItemRequisition` في الخادم (`PermissionPrerequisites`)**:
  - `ItemRequisition.View`: شرطي `itemRequisitionJobFilterSpecified` -> `Job.Lookup` عند التصفية بـ `jobId` أو الفرز بـ `jobName` أو وجود `JobName`/`JobId`/`Job.*` في `grid` أو عند إرسال `grid` معطوب/زائد الحجم (fail-closed). بدون `Job.Lookup` يظل البحث بالرقم والحالة وحالة طلب الشراء والفترة الزمنية متاحًا.
  - `ItemRequisition.Create`: `Job.Lookup`, `Item.Lookup`.
  - `ItemRequisition.Update`: `ItemRequisition.View`, `Job.Lookup`, `Item.Lookup`.
  - `ItemRequisition.Delete`: `ItemRequisition.View`.
  - `ItemRequisition.Issue`: `ItemRequisition.View`, `Branch.Lookup`.
  - `ItemRequisition.CreatePurchaseRequest`: `ItemRequisition.View`, `Supplier.Lookup`, `Branch.Lookup`, `UnitsOfMeasures.Lookup`, `Currency.Lookup`, `Currency.GetFinancialNumberPolicy`, `Currency.PreviewConversion`, `Supplier.View`, `SettingsCommonModel.GetMySetting`.
- **القدرات الاختيارية داخل صفحة إنشاء طلب الشراء (A3)**:
  - المرفقات (`Media.UploadMedia` للرفع و`Media.DeleteMedia` للحذف/التنظيف): مخفية/معطلة عند غياب الصلاحية، ويبقى الحفظ العادي متاحًا.
  - "حفظ وطباعة" (`PurchaseRequests.View`): يُخفى/يُعطل زر "حفظ وطباعة" عند غياب `PurchaseRequests.View` أو تعذر قراءة فرع طلب الشراء المحفوظ؛ كما لا يُجبر المستخدم على حجب زر الحفظ العادي.

## توضيح مسارات HTTP والتكامل بعد مراجعة ١٦١

- القائمة الفعلية هي `GET /api/ItemRequisition` والحذف
  `DELETE /api/ItemRequisition?id={id}`. `GetManyWithNavigationsAsync`
  تفويض داخلي إلى القائمة. لا يعرّف المتحكم مسار HTTP له.
- تطبق المنح والاعتماديات بواسطة `PermissionAuthorizationFilter`. يرفض
  المستخدم العادي المنفذ غير القابل للإسناد بـ403، بينما يصل مدير الشركة
  إلى نتيجة الخدمة 405 عند استدعائه. طرق الإضافة والتعديل الجماعي داخلية.
- عند اعتماد إذن منشأ من الطلب، يسبق فحص فرع الإذن وإثبات أصل السطور
  قراءةَ مرجع أمر الشغل المحفوظ داخل الشركة. يظل المصدر مطابقًا لأمر
  الشغل المحفوظ على الإذن، وتظل مداخل الإنشاء والتعديل المباشرة بنطاقها.
- حالات المطابقة تشمل الانشاء ثم الاعتماد من مصدر للقراءة فقط إلى وجهة
  قابلة للتسجيل، والمسودة المعدلة عند سحب المنحة واستعادتها، وفقد منحة
  عرض طلب الشراء قبل الطباعة، وعودة مستخدم الإنشاء إلى وجهة مسموحة.

## 5. سلوك الواجهة ودورة الحياة (UI21 + UI28 + البند 4 و5)

- تعريف `itemRequisitionAccess` في `item-requisition-access.ts` وتسجيل `/itemrequisition` و`/itemrequisition/purchase-request` و`/itemrequisitionitem` (تحويل إلى `/itemrequisition`) في `route-access-policy.ts`.
- **فصل سحب العرض عن سحب منحة الإجراء** داخل القائمة والنوافذ الفرعية (`Details`, `Issue`, `PurchaseRequest`, `Report`):
  - سحب `View` يفرغ بيانات القائمة والتقرير ويعرض حالة رفض الوصول مع عدم ترك قوائم `p-select`/`p-datepicker` المفتوحة معلقة (`closeOverlays`/`closePortals`).
  - سحب منحة الإجراء (`Create`/`Update`/`Issue`/`CreatePurchaseRequest`/`Delete`) أثناء بقاء نافذة مسودة مفتوحة يُعطّل الإرسال مع إبقاء مسار **تجاهل المسودة عبر التأكيد المحلي** شغالًا ودون تعليق إغلاق النافذة الرئيسية (`CanDeactivate`).
  - تسوية الطلب المرسل (`saving`): إذا أُرسل `POST`/`PUT`/`DELETE` بالفعل قبل سحب الصلاحية لا يُلغى الطلب ولا يعرض نتائج متقادمة (`CAN_PRESENT_API_OUTCOME` + `saveCommitted`) ويُغلق المحرر أو يكتمل تنظيفه بأمان دون تكرار الإرسال.
  - التقرير والطباعة: تنظيف `reportQuery` عبر `effectiveItemRequisitionQuery(query, canLookupJob)` عند غياب/سحب `Job.Lookup` أثناء فتح التقرير، وربط `print()` بإصدار الاستعلام والصفوف (`rowsVersion`) عبر `ReportPrintService`.
  - تحديث دليل الاستخدام `UserGuide/content/stock-guide.ts` ومفاتيح الترجمة وجرد المسارات `ROUTE_PERMISSION_ADOPTION_INVENTORY.json` ومستندات التغطية.
