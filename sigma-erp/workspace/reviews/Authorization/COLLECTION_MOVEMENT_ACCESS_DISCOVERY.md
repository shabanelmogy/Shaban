# اكتشاف الصلاحيات — حركات الاستلام CollectionMovement

| البند | النتيجة |
|---|---|
| Status | Discovery completed — source implementation pending |
| التاريخ | 2026-11-11 |
| جرد البداية | 144/263 operation-confirmed؛ صف `collectionMovement` مورد فقط |

## دليل Speed وفروق دورة العمل

دليل Speed المؤرخ `2026-10-27/Speed_Analysis_Guide.md` فصل 9/10 يميز تسليم المركبة واستلامها عن تحصيل المال وإغلاق العقد. تحليل الشاشة المؤرخ `2026-10-28/sidebar/13-movements/screens/05-collection-movements.md` يربط المسار `R0299`، والقائمة `C0693`، وإغلاق الحركة `C0692`، وتعيين السائق `C0691`، وعرضها `C0694`. يستخدم Speed نوعي 11/12 (Agreement/Replacement Collection) وحالات Open/Delivered/Returned، وإجراء Close/AddDriver؛ شاشة Sigma الحالية تستخدم `NrmMovementType?` بالقيم 0..4 أو null (Agreement Collection)، ولا تملك حالة مفتوحة/عودة/إغلاق ولا حقل إغلاق في Entity. هذه **فجوة وظيفية** مشروطة بتصميم دورة lifecycle وAPI، لا يُستعار Close ولا قيم Speed بلا عقد أعمال/حالة معتمدة. دليل Speed لا يثبت أن endpoint إغلاق موجود في Sigma.

## خريطة مصدر Sigma

| الوظيفة | المصدر | دليل التشغيل الفعلي |
|---|---|---|
| المسارات | `Movements/collectionMovement/collection-movement.routes.ts:6-11` | `/collectionMovement`, `/create`, `/details/:id` في مكوّن قائمة واحد |
| القائمة/Excel | `components/list/list.component.ts:81-102,103-173,181-284`، `services/collection-movement.service.ts:28-35` | View/Export للبحث بالرقم/الاتفاقية/اللوحة/النوع والتاريخ وجمع كل الصفحات |
| عرض/إنشاء/حذف | `components/list/list.component.ts:288-375`, `components/details/details.component.ts:36-415`, الخدمة :36-45 | Create/Details، وحذف حقيقي مع تأكيد؛ لا Update أو Close في UI |
| خيارات إنشاء | `services/collection-movement.service.ts:47-60` | `RentalAgreement.GetSelect`, `Driver.GetSelect`, `Branch.GetSelect`, `Vehicle.GetSelect`؛ اتفاقية مختارة تطلب `RentalAgreement.GetByWithNavigationsId` |
| الجذر التاريخي | `Helpers/Models/Movements/CollectionMovement.cs:5-32`, `DataAccess/Authorization/BranchScopeRegistry.cs:40` | `BranchInId` nullable في المصدر القديم، لكنه فرع استلام تاريخي حاكم لقراءة الحركة. حماية EF المركزية ترفض الجذر بلا فرع صالح عند الكتابة؛ مطلوب API/UI برسالة واضحة قبل الحفظ |
| Backend GET | `Business/Services/CollectionMovementService.cs:33-235`; Controller :23-25 | Includes متعددة، filters/Count/Skip/Take، 404 غير محدد للصف المخفي، controller يعيد Ok حتى الفشل، Status="Delivered" غير محفوظ. `DateIn` هو `DateAndTime` تاريخ استلام حقيقي، وليس تاريخ إغلاق مصطنعًا |
| Backend POST | `CollectionMovementService.cs:237-275` | DateAndTime default تتحول UTC صامتًا، No يحسب Max(Id)+1 وهو قابل للتسابق، المراجع بلا validate scoped، BranchInId قد يغيب، وCustomerId يقبل من العميل رغم اشتقاقه من الاتفاقية |
| ربط السجل الموحد | `CollectionMovementController.GetMovementsAsync:17-22` و`CollectionMovementService.GetMovements:308-441`, `logsMovement` | `CollectionMovement.GetMovements` عملية منفصلة مراجعة مسبقًا تجمع مصادر Agreement/NRM/Workshop/Delivery/Collection؛ لا تُغلق ولا تُدمج مع View من هذه الشاشة |

## فجوات واجهة/صلاحيات مثبتة

الحارس الحالي لا يميز View/Create/Delete. القائمة تطلق GET عند رابط create-only؛ التصدير والصفوف والحذف/التأكيد/POST بعد الإغلاق لا تتحقق من آخر session/actor/grant. جميع الخيارات الأربعة تتطلب نجاح `forkJoin` رغم اختيار السائق والمركبة والاتفاقية الاختياري، وفشل Lookup اختياري يمنع حفظ حركة بفرع فقط. صفحة التفاصيل تتبع `takeUntilDestroyed` للـPOST، فتُلغي الكتابة المرسلة عند تغيير المسار. ينبغي منع تسرب تفاصيل الاتفاقية/العميل/السائق من فروع أخرى، وتأمين GET التاريخي بـ`Repository.Query<CollectionMovement>`، وفصل `GetMovements` عن grants الأساسية، وضمان إرسال حذف واحد دون نشر نتيجة جلسة أخرى.

## الحمل والكاش والمخطط

صفحة GET الحالية تحمل Include لتفرعات لا يستهلكها الجدول قبل Paging وmaterialization ثم map، وتستحق projection SQL صغيرًا وفصل المراجع المحجوبة؛ الفرز DateAndTime+Id مستقر مسبقًا؛ يُلزم Count على نفس filtered projection. حد pageSize 100، guard Skip overflow وMaxDate overflow. وضع `CollectionMovementConfig.cs` يقتصر على ToTable دون FK/Findex تاريخي؛ مقترح هجرة بعد إثبات/قرار ملكية BranchInId مع بيانات تجريبية، ولا تُخترع branch data. خيارات Vehicle وRentalAgreement تُراجع حسب opt-in `BaseService.cacheSelect`، وخيارات Driver/Branch وفق مالكها؛ سياسة Create ضمن CurrentBranch Options لا تعتمد حقل BranchId من JWT اختياري. لا توجد قياسات SQL/متصفح في المصدر فقط.
