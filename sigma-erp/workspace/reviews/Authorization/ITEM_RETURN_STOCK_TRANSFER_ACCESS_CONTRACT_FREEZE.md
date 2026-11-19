# تجميد تبنّي صلاحيات المخزون — البنود ١٦٣–١٦٥

| الحقل | القيمة |
|---|---|
| الحالة | Frozen — تنفيذ المصدر والقبول ما زالا قيد المطابقة |
| التاريخ | ١٣ نوفمبر ٢٠٢٦ |
| البنود | ١٦٣ `/ItemReturn` · ١٦٤ `/ItemReturnItem` · ١٦٥ `/StockTransfer` |
| السلوك المجمد | `reviews/STOCK_BRANCH_BALANCE_CONTRACT_FREEZE.md` و`reviews/STOCK_FRONTEND_LIFECYCLE_CONTRACT_FREEZE.md` وعقد ملكية بنود المخزون المؤرشف؛ لا تغيير للحسابات أو بنية البيانات |
| الأدلة الوظيفية | Speed 2026-10-28، `15-stock/screens/06-item-returns.md` و`07-stock-transfer.md`، المتحكمات `C1681/C1682/C1711/C1712`، وشرح دورة الورشة/المخزون |

## ملكية المستند والأفعال

- مرتجع الأصناف مستند تابع لفرع `ItemReturn.BranchId`. القائمة والتفاصيل والتقرير وExcel تعرض فروع القراءة فقط، مع إخفاء اسم `Job` غير المسموح بعرضه دون إخفاء المستند نفسه. يُطلب `Job.Lookup` فقط عند تمرير فلتر `jobId` أو فرز `jobName` أو مرشّح شبكة يعتمد على `Job`. عند سحب المنحة ينظف الاستعلام والحقل والمرجع الحي في النافذة والتصدير والطباعة.
- تحويل المخزون مستند كامل لا يقرأه المستخدم العادي إلا إذا كانت **جميع** فروع المصدر للأسطر وفرع الوجهة من فروع القراءة؛ لا تُسقط أسطر مخفية فتظهر وثيقة ناقصة. يُطلب تنفيذ مسموح على الفرع المحفوظ والجديد (عند التعديل) وعلى كل مصدر ووجهة في عمليات الاعتماد والإبطال، مع نشاط الفرع وفق عقد المخزون. المدير يتجاوز منح الأفعال فقط، ولا يتجاوز سلامة الفرع والنشاط أو الرصيد.
- تُقرأ جميع الحركات المؤثرة **داخل الشركة** لحساب الإصدارات/المرتجعات والمتبقي ورصيد كل فرع تحت قفل الكتابة الموحّد عند الاعتماد والإبطال. لا تُكشف تفاصيل أو هوية مستند غير قابل للعرض؛ تحقَّق من الصلاحية على المستند الهدف قبل استخدام قراءات `IgnoreQueryFilters()` المخصصة لحساب الآثار.
- يجب أن يكون كل مصدر جديد/متغير وصنف جديد/متغير وفرع وجهة جديد مرجعًا نشطًا. يُسمح بالاحتفاظ بمرجع غير نشط فقط عند إثبات تطابق هويته مع **السطر المحفوظ نفسه** في مسودة محدثة؛ وتُفحص فروع المستند القديمة والجديدة عند نقل الملكية.
- عملية `Void` لكل مستند مستقلّة عن `Update`: المفتاحان `ItemReturn.Void` و`StockTransfer.Void` معتمدَان لإبطال مستند معتمد فقط، وتحتاج العملية أيضًا `*.View`. الانتقال `Approve/Reject` يستخدم `*.ManageApproval` مع `*.View`. موافقة المستند لا تحدث بالمنحة العامة `Update`.

## HTTP ومفاتيح المنح

| المستند | الإجراء | المسار HTTP الحقيقي | المنحة/الاعتماديات |
|---|---|---|---|
| Return | قائمة وتفاصيل وتقرير بيانات | `GET /ItemReturn`، `GetById/{id}`، `GetByWithNavigationsId/{id}` | `ItemReturn.View`؛ `Job.Lookup` مشروط بفلتر/فرز/شبكة أمر الشغل |
| Return | إنشاء | `POST /ItemReturn` | `ItemReturn.Create` + `Job.Lookup`, `Branch.Lookup`, `Item.Lookup` |
| Return | تعديل / حذف | `PUT /ItemReturn`؛ `DELETE /ItemReturn?id=...` | `ItemReturn.Update` / `ItemReturn.Delete` + `ItemReturn.View`؛ التعديل يحتاج منح المراجع الثلاث |
| Return | عرض حالة / اعتماد أو رفض / إبطال | `GET /ItemReturn/{id}/approval`؛ `POST /ItemReturn/{id}/approval`؛ `POST /ItemReturn/{id}/void` | `View` / `ManageApproval+View` / `Void+View` |
| Transfer | قائمة وتفاصيل | `GET /StockTransfer`، `GetById/{id}`، `GetByWithNavigationsId/{id}` | `StockTransfer.View`، وكل فروع المستند |
| Transfer | إنشاء / تعديل / حذف | `POST /StockTransfer`؛ `PUT /StockTransfer`؛ `DELETE /StockTransfer?id=...` | `Create` + `Branch.Lookup` + `Item.Lookup` / `Update+View` + المنحتين / `Delete+View` |
| Transfer | عرض حالة / اعتماد أو رفض / إبطال | `GET /StockTransfer/{id}/approval`؛ `POST /StockTransfer/{id}/approval`؛ `POST /StockTransfer/{id}/void` | `View` / `ManageApproval+View` / `Void+View` |
| ReturnItem | رابط قديم | `/ItemReturnItem/**` | `alias` إلى `/ItemReturn` بعد حارس وجهة `View`؛ لا منحة مستقلة |

المنافذ العامة غير المستخدمة `HandleActivate` و`CheckUnique` و`GetSelect` و`GetAllWithNavigations` في المستندين، وكذلك جميع منافذ `ItemReturnItem` المباشرة وعمليات `AddList/UpdateList` الداخلية، مغلقة بنتيجة خدمة `405` ولا تُعرض في كتالوج المنح. مرشح صلاحيات المستخدم العادي يسبق الخدمة ويعيد `403` عند عدم وجود منحة قابلة للإسناد؛ المدير يمر للرفض `405` في الخدمة. لا ينطبق ذلك على مالك قائمة البنود داخل المستند الأب.

## دورة الواجهة والتحقق

- اعزل `View` عن `Create/Update/Delete/ManageApproval/Void` في القائمة والمحرر وحالة الموافقة والتقرير. يدعم مستخدم `Create` وحده فتح مُنشئ المستند دون طلب قائمة محجوبة. فرّق بين سحب المنحة وتجديدها وبين تغيير السياق/المستأجر.
- عند سحب منحة في حوار متداخل، امنع الإرسال وأغلق القوائم المنبثقة، مع بقاء تجاهل المسودة بتأكيد محلي ممكنًا. لا تلغ طلب حفظ أُرسل بالفعل ولا تكرره عند عودة المنحة؛ انضباط نتيجة الطلب من `CAN_PRESENT_API_OUTCOME`، ويُسمح للأب بالإغلاق بعد التسوية.
- طابق كل فلاتر القائمة والشبكة وحقول الترتيب وعدد النتائج وExcel/Report؛ اربط عملية طباعة المرتجعات بإصدار الاستعلام الذي أنتج الصفوف وأعد التحميل عند تغييره.
- حالات التحقق: مستخدم بدون `View`، إنشاء فقط، صلاحية عرض دون `Job.Lookup`، تصفية مباشرة أو عبر الشبكة دون المنحة، إبطال دون `Void` مع وجود `Update`، المدير مع فرع غير نشط، نقل فرع مسودة، اعتماد رصيد مصدر غير كافٍ بعد حركات من فروع أخرى، إبطال مع استهلاك لاحق، صلاحية مصدر/وجهة غير كاملة، سحب وإعادة منح العرض والفعل داخل نافذة بمسودة وطلب مرسل، رابط بنود قديم بكل امتداداته. افصل إعداد البيانات بصلاحيات كافية عن ممثل السيناريو؛ لا تدّع تشغيل SQL Server قبل إجرائه فعلًا.

مواضع المصدر الحالية قبل الإصلاح: `SigmaBackend/SiGma.ServerAPI/Controller/ItemReturnController.cs:14-29`، `StockTransferController.cs:14-29`، `SiGma.Business/Services/StocksServices/ItemReturnService.cs`، `StockTransferService.cs`، `ItemReturnItemService.cs`، `SiGma.ServerAPI/Authorization/PermissionPrerequisites.cs`، `PermissionEndpointResolver.cs`، `SiGma.DataAccess/Authorization/BranchScopeRegistry.cs`؛ الواجهة في `Stock/ItemReturn` و`Stock/StockTransfer` و`shared/authorization/route-access-policy.ts`.
