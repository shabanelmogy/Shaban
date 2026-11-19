# اكتشاف حركات التسليم — DeliveryMovement

| البند | النتيجة |
|---|---|
| Status | Discovery completed — owner decisions frozen for source-only work |
| التاريخ | 2026-11-11 |
| مرجع العقد | [DELIVERY_MOVEMENT_ACCESS_CONTRACT_FREEZE.md](DELIVERY_MOVEMENT_ACCESS_CONTRACT_FREEZE.md) |
| جرد ما قبل التنفيذ | 140 مؤكدًا من 263؛ صف `DeliveryMovement` لا يُرقّى قبل المطابقة |

## دليل Speed بالترتيب

1. دليل `Speed_Analysis_Guide.md` بتاريخ 2026-10-27، فقرة حركات المركبات (نحو 195–204): تسليم فتح وإغلاق، وعلاقته بالعقد ومسؤولية الحيازة تحتاج فصلًا عن تخصيص المركبة.
2. شرح `2026-10-28/sidebar/13-movements/screens/04-delivery-movements.md`: الشاشة تعرض البحث بحسب الرقم/الاتفاقية/اللوحة والنوع والتاريخ، مع تفاصيل Excel، وفتح/عرض/إغلاق/إرجاع. الإجراءان الأخيران مثبتان مرجعيًا ولا يظهران منفذين في Sigma الحالية.
3. الكود الملتقط `C0770--tenant.views.crs.deliveries.createOrEditModal.js`: `AgreementDelivery=8` و`ReplacementDelivery=9` في Speed، اختيار اتفاقية واجب لسياق حركة التسليم، اختيار سائق متاح، تفاصيل الوقود/العداد/التاريخ؛ `C0771` يحرس العرض/الإنشاء/الإغلاق/الإرجاع بمنح منفصلة؛ `C0769`, `C0772` تحفظان إنهاء الحركة. Sigma enum المقابل `AgreementDelivery=0`, `ReplacementDelivery=1`؛ لا تنقل القيم الرقمية.

## شاشة Sigma ومنافذها الفعلية

| الوظيفة | Angular | Backend | قرار وصول |
|---|---|---|---|
| قائمة وفلاتر وصفحات | `DeliveryMovement/components/list/list.component.ts` → `DeliveryMovementService.getList` | `DeliveryMovementController.GetListAsync` → `GetManyWithNavigationsAsync` | `DeliveryMovement.View`، نطاق `BranchOutId` التاريخي |
| تصدير كل الصفحات | `getAllList` → `fetchAllPages` | endpoint القائمة نفسه | `DeliveryMovement.View` مع إلغاء المخرجات القديمة |
| تفاصيل/routed view | نافذة `details` → `GetByWithNavigationsId/{id}` | `DetailWithNavigationsAsync` | `DeliveryMovement.View` |
| إنشاء | محرر `details` → `POST /DeliveryMovement` | `AddAsync` | `DeliveryMovement.Create` + `Branch.Lookup` + `RentalAgreement.Lookup` + `RentalAgreement.View` |
| سياق اتفاقية | `RentalAgreementService.getDetails` | `RentalAgreement.GetById` | `RentalAgreement.View` مطلوب حاليًا لأن المحرر يقرأ التفاصيل |
| خيارات سائق | `Driver/GetSelect` | منحة `Driver.Lookup` | اختيارية؛ لا تمنع الإنشاء دون سائق |
| إغلاق/إرجاع Speed | لا يظهر زر في Sigma | لا توجد خدمة/متحكم متخصص | خارج وظائف Sigma الحالية، لا تُنشأ grant وهمية |

## فجوات البداية وتعليل التصميم

- خدمة `DeliveryMovementService` القديمة استخدمت `DbContext.DeliveryMovements` مع `.Include` خارج `Repository.Query`، وفحصت `SubscriptionId` فقط؛ لم تطبق `BranchAccessContext`, بينما `BranchScopeRegistry` يسجل `DeliveryMovement` تحت `BranchOutId` بالفعل.
- `BranchOutId` اختياري في الكيان وDTO لكنه **غير قابل للتعيين من المحرر** (نص الفرع فقط)؛ لذلك اتخذ العقد قرار اختيار فرع التنفيذ الإلزامي عند الحفظ مع إبقاء EF nullable مؤقتًا وعدم منح قراءة افتراضية للسجلات القديمة بلا فرع. لا تستخدم فرع مركبة قد تتنقل بدل الفرع التاريخي.
- نموذج الإنشاء الحالي يطلب اتفاقية بواجهة `Validators.required`؛ في الخلفية كانت optional ولا تتحقق من وجودها. العقد يوحده كاتفاقية إلزامية لإنشاء التسليم، والسائق اختياري.
- أرقام `No` تولد بالخادم. `KMs` حقل نصي و`Type` enum 0/1، ولا تُعتمد أسماء/أرقام Type القادمة من Speed.
- `GetListAsync` القديم يرجع `Ok` حتى على Result فاشل؛ والمنفذ الموروث قد يعرض Update/Delete/Activate أو Lookup بلا فعل فعلي في الشاشة. العقد يثبت `ToActionResult` و405 للمنافذ غير المدعومة مع استبعاد grants القابلة للتعيين.
- لم تُشغّل استعلامات DB ولا أداء ولا بناء ولا اختبارات ولا متصفح. قبول المالك يفحص الترحيل/تنظيف السجلات القديمة مجهولة الفرع ونتيجة الترجمة EF ونطاق الحركة عند انتقال المركبة.
