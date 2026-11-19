# مطابقة صلاحيات حركات الورشة — WorkshopMovement

| البند | النتيجة |
|---|---|
| الحالة | Implemented in source — runtime acceptance pending |
| المرجع | [WORKSHOP_MOVEMENT_ACCESS_CONTRACT_FREEZE.md](WORKSHOP_MOVEMENT_ACCESS_CONTRACT_FREEZE.md) |
| الاكتشاف | [WORKSHOP_MOVEMENT_ACCESS_DISCOVERY.md](WORKSHOP_MOVEMENT_ACCESS_DISCOVERY.md) |
| الجرد | 144/263 operation-confirmed بعد ترقية `WorkshopMovement` وحده، و60 resource-only |
| حالة التوقف | البند 144 مغلق مصدرّيًا؛ توقف بطلب المستخدم، ولا تبدأ `collectionMovement` أو أي وحدة تالية دون تعليمات جديدة صريحة |

تحديث أمني12نوفمبر: المعالجة اللاحقة تستبدل الافتراض القديم لحماية
المرفقات بملفات خاصة ومنفذ مصادق وفحص الشركة وفرع الحركة. تُحجب الروابط
العامة القديمة المملوكة للحركة ولا تُرحّل الملفات تلقائيًا.
[مطابقة الإصلاح وحدود الملفات القديمة](AUTHORIZATION_140_144_REMEDIATION_RECONCILIATION.md)
هي المرجع الأحدث لهذه الجزئية، مع بقاء التشغيل معلقًا. يتقدم هذا التحديث
على وصف وسائط التخزين والحالة التاريخية أدناه.

## جدول الإنتاج والاستهلاك

| الوظيفة | Angular | Backend/Authorization |
|---|---|---|
| قائمة/بحث/تصفية/صفحات وExcel | `WorkshopMovement/components/list/list.component.ts/html`؛ View فقط، صفوف قابلة للاستخدام تحت صلاحية وسياق المالك؛ request cancellation عند revoke؛ `fetchAllPages` للصادرات المسموح بها | `WorkshopMovementController.GetListAsync` يعيد `ToActionResult`؛ `WorkshopMovementService.GetManyWithNavigationsAsync` يبدأ بـ`Repository.Query<WorkshopMovement>` تحت فرع التاريخ، يعدّ قبل الصفحة، ترتيب DateOf desc/Id desc وتقييد الصفحة 100 |
| بحث المورد/مرشحات grid | فلتر `workshopId` وحقول `workshopId/workshopName/workshopCode` تفترض `Supplier.Lookup` اختياريا مع View؛ يزيل filter وgrid عند السحب ويعيد البحث، ويفصل قوائم الخيارات عن القائمة | `PermissionPrerequisites` يشترط `Supplier.Lookup` عند فلتر المورد أو grid الخاص به؛ إسقاط أسماء المورد مشروط بنطاق القراءة ولا يكشف فرعًا محجوبًا |
| View وPrint من القائمة أو رابط details | `workshopmovement.routes.ts` و`workshop-movement-access.ts`؛ `details.component.ts/html` يتأكد من الجلسة والـgrant قبل GET ثم الطباعة ويحجب تفاصيل قديمة | `GetByWithNavigationsId/{id}` و`GetById/{id}` يخضعان لـ`WorkshopMovement.View`، ويرجعان 404 عند حركة خارج فرع القراءة؛ `logsMovement` يستخدم detail نفسه ولا يُحذف endpoint |
| Create مستقل | مسار `/WorkshopMovement/create` يفتح المحرر دون GET list؛ إنشاء يتطلب `WorkshopMovement.Create`+`Vehicle.Lookup` مع خيارات فرع التنفيذ من CurrentBranch الموقّعة، ودون View | `AddAsync` يتحقق من BranchId/VehicleId/DateOf/FuelLevel/Type ومدخلات السائق والمورد الاختياريين بنطاق القراءة، و`AllowsWrite` لفرع التنفيذ، مع احتفاظ `SiGmaDbContext` بالحارس المركزي |
| Driver/Supplier/PurchaseOrder | `details.component.ts` يجلب Vehicle required وDriver/Supplier/PurchaseOrder اختياريا عند وجود Lookup لكل مورد، ويعزل أخطاء Retry؛ رقم PO نص حر دون lookup إلزامي | `PermissionPrerequisites` يجعل Driver.Lookup وSupplier.Lookup مشروطين عند إرسال Id اختياري فقط؛ لا `Workshop.Lookup` لأنها ليست ورشة Master |
| رقم الحركة والحالة | لا يقبل النموذج No/SubscriptionId من المتصفح، ويعرض `DateIn` فارغًا عند عدم وجود إغلاق حقيقي | `WorkshopMovementAddVM` لا يقبل `WorkshopMovementNo`؛ الخدمة تستخدم رقم المستودع. لم يُنشأ Status أو تاريخ إغلاق مصطنع، وتعود القيم غير المثبتة null |
| العمليات غير المدعومة | لا أزرار Edit/Delete/Activate/Close/Return/Import أو تدفقات وهمية | Update/Remove/Activate/CheckUnique/GetSelect/GetAllWithNavigations/bulk تعود 405، و`PermissionEndpointResolver` يجعل منحها غير قابلة للإسناد |
| وسائط ومستندات | `DocumentUploadTracker` يفصل أذونات UploadMedia/DeleteMedia، ومرفقات الحركة اختيارية؛ `finishSentSave` يسمح إنهاء cleanup بعد تدمير محرر لنفس المالك؛ فشل cleanup داخل المحرر لا يعيد إرسال POST | قارئ تفاصيل الحركة يعيد مسارات المستندات ضمن نطاق الحركة؛ فتح الملف ذاته تظل له حماية media المنفصلة |

## دورة الحياة والبيانات والأداء

- `Workspace` و`Authorization`: الـroute registry يربط list بـView وcreate بـCreate+Vehicle.Lookup وdetails بـView، بينما `AccessViewPolicyService`/`readAuthSessionKey`/`observeAuthSession` تحمي البيانات داخل القائمة والمحرر. بعد سحب صلاحية القراءة أو انتهاء ملكية الحساب لا تُنشر نتائج GET/Excel/Print؛ حارس الخادم مستقل عن إخفاء الواجهة.
- الحفظ: POST المرسل يستمر بعد تدمير المحرر، مع `CAN_PRESENT_API_OUTCOME` لتقييد الإشعار بالجولة الصالحة. نجاح POST لا يعاد عند فشل تنظيف المرفقات؛ يحاول `retryCleanup` الأثر فقط. إذا تغيّر الحساب بين الإرسال والرد لا تُنفذ حذف ملفات بأوراق اعتماد الحساب الجديد؛ انتهاء صلاحية الملفات اليتيمة يبقى مسؤولية التخزين عند الحاجة.
- UI22: مؤشر الصفحة للقائمة والبحث وخيارات فلتر المورد المطلوب بدءًا، والتصدير والحفظ. تحميل التفاصيل والخيارات داخل المحرر مؤشر محلي، وتحديث cache الاحتفاظي لا يمحو مسودة الإنشاء. التصنيف مصدرّي؛ مظهر المؤشرات الفعلي تحت القبول التشغيلي.
- المصدر المرجعي: دليل Speed المؤرخ 2026-10-27 الفصل التاسع، وشرح 2026-10-28 `13-movements/screens/02-workshop-movements.md`، وcontroller `C1459/C1457/C1456/C1461` يبين فتح/عرض/تعديل/إغلاق/حذف. Sigma لا يملك حقل status/close/dateIn محفوظًا، وأرقام أنواعها 0..4 تختلف عن Speed؛ هذه فجوة دورة حياة منفصلة، لا يجوز تقديم إغلاق صوري لمجرد إغلاق الفجوة.
- Query: يقتصر إسقاط تفاصيل العرض على الحقول التي يستهلكها المحرر، ويُحجب اسم المركبة/السائق/المورد إن خرج مرجعه الحالي من نطاق القراءة مع بقاء جذر الحركة التاريخية. القائمة تحسب قبل الصفحة وتترتب بمفتاح مستقر. الفهارس الموجودة بـ`WorkshopMovementConfig` تشمل `(SubscriptionId,BranchId,DateOf)`، ولا دليل حاجة لهجرة مخطط جديدة في هذه الدفعة. خطط التنفيذ SQL والوقت الفعلي وترجمة EF وإثبات الفهرس المناسب قبول لاحق.
- الكاش: Vehicle/Supplier من `BaseService` مع opt-in `cacheSelect`، بينما Driver/PurchaseOrder اختيارات مستقلة غير مُفعّلة cache صراحة. قراءات الحركة نفسها تشغيلية مباشرة، وليست قوائم مرجعية مشتركة. فحص invalidation/renewal والمستندات الفعلية مؤجل للتشغيل.

## مسارات المصدر والتحقق

تمت مراجعة مصادر `SiGmaAngularFrontEnd/src/app/modules/Movements/WorkshopMovement` (list, editor, access, routes, service, models)، و`shared/authorization/route-access-policy.ts` في أجزاء الحركة، و`shared/service/document-upload-tracker.service.ts`، ودليل `UserGuide/content/movements-guide.ts` بالعربية والإنجليزية. الخلفية: `SiGma.Business/Services/WorkShopServices/WorkshopMovementService.cs`، `WorkshopMovementController.cs`، AddVM، `PermissionEndpointResolver.cs` و`PermissionPrerequisites.cs` (الأجزاء الخاصة بالحركة فقط). المواصفات المصدرية: `tests/SiGma.BranchAccess.Tests/WorkshopMovementAccessContractTests.cs` و`components/list/list.component.spec.ts` و`list-access.spec.ts`، دون تشغيل.

فحص `git diff --check` المحصور بمصادر الحركة في المستودعين خرج دون أخطاء whitespace؛ التحذيرات الخاصة بتحويل نهايات الأسطر ليست فشلًا. **لم تُشغّل** build/tests/lint/typecheck/browser/HTTP/SQL/DB/migration/snapshot/commit/push/deploy في هذا الإقفال. كل الموافقات التشغيلية/الأمنية على ترجمة SQL والنطاق الفعلي ووسائط التخزين لازمة قبل وصفها بأنها مكتملة تشغيلًا؛ هذا الإقفال مصدرّي وجرد operation-confirmed للمستهلكين والـendpoints الفعلية فقط.
