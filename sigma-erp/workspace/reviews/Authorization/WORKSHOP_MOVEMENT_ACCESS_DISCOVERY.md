# اكتشاف صلاحيات حركة الورشة — WorkshopMovement

| البند | النتيجة |
|---|---|
| Status | Discovery completed; source contract frozen |
| التاريخ | 2026-11-11 |
| حالة الجرد قبل التبني | `WorkshopMovement` resource-only، آخر جرد مؤكد 143/263 |

## بوابة المرجع وأوجه الاختلاف

المصدر الأساسي للدورة هو دليل Speed `references/speed-analysis/2026-10-27/Speed_Analysis_Guide.md` قسم الحركات والورش، ثم شرح شاشة `references/speed-analysis/2026-10-28/sidebar/13-movements/screens/02-workshop-movements.md` (الصفحة 1–195)، ثم مسار `R0296` وcontrollers ذات التاريخ نفسه `C1459` (قائمة)، `C1457` (فتح/تحرير)، `C1456` (إغلاق)، `C1461` (عرض)، `C1458` (استيراد)، `C1460` (مرفقات). إثباتات Speed المرصودة تشمل فلترة الرقم والنوع والتواريخ والمورد، وإجراءات فتح/تحرير/إغلاق/حذف واستيراد وتصدير وارسال بريد/واتساب. أنواع Speed الرقمية الواردة لا تطابق Enum Sigma الحالي 0..4؛ لا تُنقل الأرقام أو حالات Speed مباشرةً بلا نموذج بيانات وموافقة أعمال. لا يثبت مجرد وجود أزرار Speed وجود endpoint أو حالات معتمدة في Sigma.

في Sigma الحالية شاشة `/WorkshopMovement` تعرض **إنشاء، عرض، طباعة، Excel**؛ لا تعرض تعديلًا أو إغلاقًا أو حذفًا أو import. الكيان `Helpers/Models/Movements/WorkshopMovement.cs:8-31` لا يملك حقل status أو تاريخ إغلاق، رغم وجود enum `WorkshopMovementStatus` غير مرتبط، ولذلك كتابة `Status="Completed"` و`DateIn=DateOf` في `WorkshopMovementService.cs:90-104` **استنتاج مضلل** يتطلب الحذف من الإخراج حتى تُنفّذ دورة حياة مستقلة. المورد هنا `Supplier` في `WorkshopId`، وليس جدول `Workshop` master.

## مصادر Sigma الفعلية

| البوابة | مصدر التنفيذ | الحقيقة |
|---|---|---|
| routes | `Movements/WorkshopMovement/workshopmovement.routes.ts:4-8` | list/create/details/:id في مكوّن واحد |
| list/export/print | `components/list/list.component.ts:69-99,99-151,173-300` | فلتر تاريخ/نوع/رقم/لوحة/ورشة المورد، paging وExcel كامل، عرض/طباعة لسجل محفوظ |
| editor | `components/details/details.component.ts:96-107,163-322,353-429,515-569` | إنشاء بفرع تنفيذ ومركبة وتاريخ؛ مورد/سائق/مرجع PO/مرفقات اختيارية؛ cleanup للمرفقات بعد حفظ ناجح |
| read APIs | `services/workshopmovement.service.ts:28-40`; `WorkshopMovementController.cs:15-17` | GET list؛ تفاصيل `GetByWithNavigationsId/{id}`؛ GET list يستخدم Ok بدل ToActionResult |
| lookup | `WorkshopMovementService.ts:41-51` | `Vehicle/GetSelect`, `Driver/GetSelect`, `Supplier/GetSelect`, `PurchaseOrder/GetSelect`، والأخير للـdropdown الاختياري editable فقط |
| Backend | `WorkShopServices/WorkshopMovementService.cs:21-195` | branch-scoped list/detail عبر DbContext؛ Add يثبت فرع تنفيذ، لكن لا يتحقق مبكرًا من جميع المراجع والحقول؛ أنواع DTO تسمح للعميل بإرسال `WorkshopMovementNo` |
| حارس DB | `SiGmaDbContext.BranchAccess.cs` و`BranchScopeRegistry.cs:56` | `WorkshopMovement.BranchId` نطاق تاريخي، الحماية المركزية عند SaveChanges تفرض `AllowsWrite`؛ عدم وجود `DemandWrite` مبكر ليس تسريبًا مثبتًا ولكن رسالة خطأ/رفض مبكر مفيدان |
| LogsMovement | `Movements/logsMovement/components/view/view.component.ts:531-532` | قارئ تفاصيل WorkshopMovement مستخدم فعليًا من سجل الحركات؛ يجب الحفاظ على `WorkshopMovement.View` أو فصل منحة قارئ مخصصة إذا قُدمت لاحقًا، وليس إلغاء منفذه |

## فجوات يجب إغلاقها

المسارات غير مسجلة بسياسة الوصول. القائمة تشغّل GET وخيارات المورد حتى عند create-only، وحالات سحب/عودة الصلاحية وتبديل الحساب والتصدير/الطباعة غير محمية. المحرر يربط POST بـ`takeUntilDestroyed` ويعتمد قائمة كل lookups عبر `forkJoin`، فيحظر Create لو غابت صلاحية Driver/Supplier/PurchaseOrder الاختيارية. ينبغي فصل Vehicle المطلوب عن الاختياري، وصيانة Cleanup المرفقات وحياة POST المرسَل دون كشف نتيجة جلسة قديمة. backend يلزمه منع حمل رقم عميل وتقييد مصادر Vehicle/Driver/Supplier/branch والتحقق من `DateOf` و`FuelLevel` وعداد صحيح وType 0..4، وإرجاع 405 للعمليات الموروثة غير المستعملة، وToActionResult للقراءة.

**بوابة الأداء والكاش:** pagination/count الحاليان قبل مواد القائمة، لكن Includes متعددة وتحويل ListVM بعد تحميل entities، وفرز التاريخ بلا `Id` tie breaker؛ يلزم مراجعة Query/Projection وقيد branch scope وفهرس `(SubscriptionId,BranchId,DateOf)` الموجود في `WorkshopMovementConfig`. Vehicle وSupplier يملكان selectable cache مشتركًا؛ Driver/PurchaseOrder direct reads ما لم تثبت opt-in. مطلوب جدول UI22 وRetry، وتحقق SQL-plan/timing لاحق دون ادعاء قياس.
