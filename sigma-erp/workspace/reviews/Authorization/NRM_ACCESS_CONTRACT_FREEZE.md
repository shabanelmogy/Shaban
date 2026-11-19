# عقد صلاحيات حركة NRM — تجميد المصدر

| البند | القيمة |
|---|---|
| الحالة | Frozen — source-only implementation |
| تاريخ التجميد | 2026-11-11 |
| الجرد عند البدء | 141 من 263 مؤكد مصدرّيًا؛ `NRM` لا يزال resource-only حتى المطابقة |

## مصدر Speed ومقارنة Sigma

قُرئ دليل Speed بتاريخ 2026-10-27 الفصل التاسع (الحركة غير الإيرادية)، ثم `references/speed-analysis/2026-10-28/sidebar/13-movements/screens/01-nrms.md`، ثم controllers `C1118--tenant.views.crs.staffMovement.createOrEditModal.js` و`C1119--tenant.views.staffMovements.index.js` و`C1117--tenant.views.crs.staffMovements.closeStaffMovement.js`. يثبت Speed فتح/إغلاق/تعديل/حذف وExcel والطباعة وإشعارات SMS/Email عند إعداد ميزات معينة. كود الإنشاء يقرأ `contact.id` ومن ثم يتوقع جهة اتصال/موظف في ذلك المسار، ويظهر فرع الوصول بشكل مشروط للأنواع؛ **Sigma الحالية لا تنفذ تلك الانتقالات**، وتحتفظ في نموذج NRM باختيار الموظف اختياريًا. هذا فرق مقصود في نطاق تطبيق الصلاحيات، ولا يُنقل اشتراط موظف العهدة أو عقد التسليم إلى NRM. توجد 5 قيم enum في Sigma `NrmMovementType` 0..4، ولا تنقل قيم أنواع Speed الرقمية.

## حدود الأفعال المسموحة

1. `NRM.View` لقراءة القائمة والفلاتر والصفحات والتفاصيل والعرض المباشر والطباعة وExcel. فلتر `staffId` اختيار إضافي يحتاج `Staff.Lookup`، ويختفي/يُصفّر عند غياب منحة خيارات الموظفين، دون حجب القائمة. الطباعة تتحقق أولًا من نجاح تحميل تفاصيل الـid الصحيح بمنحة View وتلغي الطلب والطباعة عند سحب المنحة/تغير سياق الحساب.
2. `NRM.Create` للإنشاء المستقل عن View، مع اعتماديات `Vehicle.Lookup` و`Branch.Lookup` الإلزاميتين لاختيار مركبة وفرع التنفيذ؛ `Staff.Lookup` **شرطي فقط عند إرسال** `StaffId`. قائمة الموظفين الاختيارية لا تمنع الإنشاء عند غياب منحتها/تعذر تحميلها؛ مسار `/NRM/create` لا يطلق قراءة القائمة أو خيارات فلتر القائمة المحجوبة. يتم عرض غياب المنحة وتعطل الاختيارات محليًا دون نتيجة كتابة مكررة.
3. `DateAndTime` و`VehicleId` و`Type` و`BranchId` مطلوبة عند الإنشاء؛ `BranchId` فرع التنفيذ التاريخي، يختار من خيارات الفرع ويجب أن يكون عددًا صحيحًا موجبًا وفرعًا حيًا ضمن `BranchAccessSnapshot.AllowsWrite`. لا يُستنتج الفرع من المركبة الحالية. تبقى خاصية EF `BranchId` nullable تاريخيًا إلى معالجة المالك؛ لا يسمح بإنشاء سجل جديد دونها. المعاملة تمنع المركبة غير مرئية للمستخدم في نطاق الفروع. `StaffId` اختياري ويجب التحقق عند تقديمه من نفس الاشتراك، غير محذوف، نشط وغير معطل، ضمن نطاق الفرع عند لزومه. `FuelLevel` و`KMs` نصان اختياريان بطول لا يتجاوز 50 حرفًا (لا يُفرض عليهما رقم إن لم يكن عقد المصدر كذلك)، و`Notes` حتى 2000 حرف.
4. حقول DTO العامة غير المستخدمة في محرر Sigma مثل `CustomerId`, `ValuePerDay`, `ValuePerKm` أو أي `SubscriptionId`, `NrmNO`, `No` لا تُقبل كبيانات مقدمة للإنشاء: يُشتق/يُهمل ما لا تؤكده الواجهة، ويُعين المستودع الاشتراك والرقم من التوكن. `ClaimTypes.NameIdentifier` يحمل SubscriptionId عمدًا في Sigma؛ لا تغيّر Repository أو JWT أو SiGmaDbContext tenant design. `NRM` الحالي ذو مفتاح int؛ `NonRentalMovement` القديم Guid غير مملوك وممنوع توسيع نطاقه ضمن هذه الوحدة.
5. `NRM.BranchId` هو نطاق ملكية الحركة المقيّد في `BranchScopeRegistry`. كل list/detail/filter/print/export و`GET /NRM/{id}/movement-log-detail` يجب أن يقرأوا من `Repository.Query<NRM>` تحت نطاق اشتراك وفرع الحركة المحفوظ، وتُسقط أسماء المركبة/الموظف من استعلامات مرتبطة مقيّدة بالنطاق دون إخفاء حركة تاريخية عند نقل المركبة لاحقًا أو تسريب تفاصيل الفرع الآخر. الإجراء `GetMovementLogDetails` مستهلك حاليًا من سجل الحركات `logsMovement`، ويظل action مستقلًا ضمن `ReviewedPermissionOperations` يحتاج مراجعة ربط منحته إلى `NRM.GetMovementLogDetails`، دون فتحه باعتباره قراءة عامة بلا تصنيف أو تعديله إلى View بلا أدلة إضافية.
6. العمليات الموروثة غير المستهلكة (`Update`, `Remove`, `HandleActivate`, `CheckUnique`, `GetAllWithNavigations`, `GetSelect`, bulk AddList/UpdateList) ترجع HTTP 405 وتستبعد منحها القابلة للإسناد؛ لا إظهار أزرار تعديل/حذف/إغلاق/رسائل SMS/Email من Speed دون endpoint Sigma حقيقي. `NRMController.GetListAsync` يستخدم `ToActionResult` لفشل الخدمة بدل `Ok` عامًا، ويرتب paging ترتيبًا ثابتًا.
7. الواجهة: مسارات القائمة `/NRM` والتفاصيل `/NRM/details/:id` تتطلب View؛ الإنشاء المباشر Create+Vehicle.Lookup+Branch.Lookup. حراسة `AccessViewPolicyService` مع session/context expiry ومراقبة منحة الموظفين الاختيارية، `switchMap`/`takeUntil` لقراءات القائمة والخيارات والتفاصيل/الصادرات، `UI22` مؤشر الصفحة للقائمة/Excel/الحفظ واختيارات المحرر محلية، وتحديث cache الناجح صامت. حفظ POST يستمر بعد destroy ويملك معترض API العام نجاح/خطأ وحيدًا مع إخفاء نتيجة سياق قديم. لا طباعة بيانات stale أو مجهود تحميل مكرر.
8. تحدد source specs (غير منفذة) العقد الأمني والـroute permissions وأسماء فروع التنفيذ والحالات السالبة. تحافظ فروق Git على ملفات الآخرين. لا تشغيل build/tests/lint/typecheck/browser/db/migration/snapshot/commit/push، ولا تعديل migration أو snapshot، ولا ترقية الجرد قبل مطابقة مصدر متكاملة.

## بوابة المالك المؤجلة

يحتاج المالك إلى مراجعة قاعدة البيانات الحقيقية لمعالجة الحركات القديمة التي بلا `BranchId` من مصدر موثوق أو استثناء إداري خاضع للرقابة؛ **لا backfill تخميني**. أي FK/فهرس `(SubscriptionId,BranchId,DateAndTime,Id)` أو تغيير مخطط يحتاج هجرة مصرحًا بها، وتجربة EF/SQL وفرز الأداء وصلاحيات فروع فعلية لا تدخل ضمن التحقق المصدرّي.
