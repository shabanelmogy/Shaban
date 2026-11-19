# عقد صلاحيات تعريف الورش Workshop — تجميد مصدرّي

| البند | القيمة |
|---|---|
| Status | Frozen — source-only implementation authorized |
| التاريخ | 2026-11-11 |
| الجرد قبل التنفيذ | `Workshop` resource-only؛ 142/263 operation-confirmed |

## تعريف النطاق

يشير هذا العقد إلى شاشة **تعريف الورش** `/Workshop`، وليس شاشة الحركات `/WorkshopMovement` أو Jobs/WorkOrders؛ لا تنقل إجراءات إغلاق Speed أو حركة الفرع التاريخية إليها. دليل Speed للقسم التاسع وشرح `02-workshop-movements.md` وcontrollers `C1459/C1457/C1456/C1461` يخص الحركات، وليس سجل الاسم البسيط في Sigma. المصدر الفعلي للشاشة والدليل الحالي وController/Service وVMs هو الحاكم لنطاق عملياتها.

1. `Workshop.View` لقراءة القائمة والتصفية والصفحات والتفاصيل المباشرة وExcel. `Workshop.Create` يفتح محرر إنشاء مباشر مستقلًا عن View، بلا lookup إلزامي؛ `Name` غير فارغ، طوله الأقصى 250. `Workshop.Update` مع `Workshop.View` لتحرير سجل محفوظ، و`Name` غير فارغ بحد 50. لا تسمح بفتح edit من صف أو تحوّيل تفاصيل العرض إلى تحرير دون تحقق حالي من المنحتين.
2. `Workshop.Lookup` مستهلك فعليًا ومستقل تمامًا لخدمات ServiceLog/Job؛ احفظ `/Workshop/GetSelect` والـgeneric service reader حيين، ولا تشترط `Workshop.View` على منحة اختيار تعريف الورشة. `Workshop.GetVehicleDetails` و`Workshop.SearchVehicles` منفصلتان ضمن العمليات المراجعة، ولا تُمنحان تلقائيًا مقابل View أو Create، ولا تُمزجان مع قائمة تعريف الورش.
3. سجل تعريف Workshop مشترك بين فروع الاشتراك، فلا تتطلب `Branch.Lookup` أو فرعًا عند إنشائه/تعديله؛ اشتراك JWT الموقّع `ClaimTypes.NameIdentifier` والمستودع `SubscriptionId` هما حدود الخادم. استعمل `Repository.Query<Workshop>` للقراءة وتحقق وجود السجل ضمن الاشتراك قبل التعديل. لا تقبل `SubscriptionId` أو `No` من العميل كهوية قابلة للتغيير.
4. لا تعرض أو تعيّن منح حذف أو تفعيل أو تحقق فريد أو قراءة قوائم عامة غير مستخدمة أو bulk write من وراثة Base: `Remove`, `HandleActivate`, `CheckUnique`, `GetAllWithNavigations`, `AddList`, `UpdateList`. العمليات الموروثة غير المدعومة يجب أن تعيد `405`، مع استبعاد منحها من واجهة الإسناد؛ حافظ على `GetById`, `GetByIdWithNavigations` (نفس قراءة View المقيّدة ونفس 404), `GetList`, `GetSelect`, `Add`, `Update` والمداخل المستقلة المراجعة. هذا تصحيح للعقد بعد المطابقة المصدرية مع الحاجة إلى alias العرض المتسق؛ لا يُسمح لـ`GetByIdWithNavigations` بمنحة أوسع من `Workshop.View`.
5. UI22: مؤشر الصفحة للقائمة والبحث وExcel والحفظ، ومؤشر محلي للقراءة داخل المحرر. امنع أي تحميل قائمة من `/Workshop/create` أو `/Workshop/details/:id` لمستخدم create-only/view-only. راقب تغير المنحة والجلسة وسياق الشركة والفروع، وألغِ قراءات القائمة/التفاصيل والصادرات القديمة وامنع عرض بيانات أو إرفاق ملف Excel بعد سحب الصلاحية أو تبديل المالك. المسودة غير المرسلة تبقى للحساب نفسه عند سحب المنحة؛ تغير الحساب يبطل المخرجات. اترك POST/PUT المرسَلَين ينتهيان مرة واحدة بعد إغلاق المحرر، واحجب نشر نتيجة ملكية قديمة باستخدام `CAN_PRESENT_API_OUTCOME`؛ معترض API العام هو مالك إخطار الكتابة الواحد.
6. مسارات `/Workshop` (View) و`/Workshop/create` (Create) و`/Workshop/details/:id` (View) تُسند بحارس route policy صريح. تعامل مع إعادة التوجيه عند غلق create-only دون جلب القائمة أو إظهاره. ينبغي إضافة source-only specs سلبية لتغير السياق والـgrant والـLookup وحظر العمليات الموروثة، **دون تشغيلها**.

## تسليم المالك

لن يُرقّى صف Workshop في الجرد حتى مطابقة Angular وBackend واستلام التسليم المصدرّي. لا migration ولا snapshot مخطط مطلوبان لاسم Workshop وفق المصدر الحالي. قبول التشغيل والاختبارات وقياس استعلامات Vehicle الخاصة مؤجَّل للمالك. لا تُغيّر `WorkshopMovement` أو صلاحياته أو ملفات زملاء العمل خارج أجزاء Workshop المحددة.
