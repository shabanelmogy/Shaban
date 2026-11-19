# التدقيق المستقل لقائمة وخدمة ومسارات عروض الإيجار

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | 2026-11-10 |
| النطاق | القائمة ومواصفاتها، `rentalquotation.service.ts` ومواصفاتها، ثوابت الصلاحيات ومسارات RentalQuotation |
| التنفيذ | قراءة فقط؛ لم يُعدّل مصدر التطبيق ولم تُشغّل اختبارات أو build/typecheck/lint |

## النتائج المفتوحة

لا توجد نتائج مفتوحة في النطاق المقروء.

## نقاط مقفلة في المصدر الحالي

- `rental-quotation-access.ts` يطابق العقد: View مستقل، Create بلا View ومع كل
  المصادر الإلزامية، Edit يضيف View+Update، Contact اختياري، ومجموعتا الاعتماد
  منفصلتان.
- route registry specifications تغطي list/view/create/edit، كل grant مفقود،
  استقلال Create، وcreator landing route. `rentalquotation.routes.ts` يربط
  create/view/edit بالمحرر وCanDeactivate.
- list read/export واللوكات الاختيارية تحمل owner/sequence/access cancellation؛
  A→B يمسح grid والمرشحات الخاصة، وعودة A تعيد bootstrap/watch دون نشر القراءة
  القديمة. customer/branch failures لا تمنع القائمة وتحافظ selected label.
- callbacks تعيد فحص exact row membership وid والـflag والمنحة بعد التأكيد؛
  التأكيد lazy ويُلغى عند denial. list/date/branch/customer/grid/enum-zero
  filters تنتقل من applied snapshot إلى page/export وroute state.
- mutations المرسلة لا تستخدم `takeUntilDestroyed` أو denial cancellation،
  وتحمل `CAN_PRESENT_API_OUTCOME`. الحذف يثبت actor/id latch قبل publication؛
  loader وbusy يفرجان في finalize، والفشل بقناتيه يسمح retry.
- `completedActions` المرتبط بكائن الصف مقصود للأفعال الانتقالية غير الحذف:
  يمنع callback المكرر على الصف السلطوي الحالي، ثم يسمح بدورة صحيحة مثل
  approve→revise→approve عندما يعيد GET صفًا جديدًا بحالة وflags سلطوية. لا يوجد
  auto-replay في القائمة، والخلفية تنفذ انتقال الحالة synchronously مع
  compare-and-swap؛ لذلك لا يوجد دليل مصدري على late-consistency bug يبرر latch
  دائمًا بـactor/id/action، والذي كان سيمنع الدورة الشرعية. يبقى الحذف وحده
  دائمًا بحسب id لأنه غير قابل للعكس في الشاشة.
- الخدمة تمرر `HttpContext` إلى create/update/delete والأفعال الستة، ومواصفة
  النقل تغطي جميع الطلبات التسعة. getList يحافظ على query params والـfeature
  headers، وlookups Customer/Branch يعيدان استخدام shared cache owners.
- القالب يخفي الصفحة ويجعلها inert عند فقد View، ويترك الحوارات mounted لحفظ
  مسوداتها. مواصفات القائمة تغطي initial denial، repeated revoke/regrant، busy
  modal tail، superseded reads، late sent writes، export cancellation وroute
  exit delegation.
- زر Add New في `components/list/list.component.html:9-14` يمرر الآن
  `[permission]="permissions.create"` إلى مالك الإجراء المشترك؛ وبذلك لا يُعرض
  فعل Create لمستخدم View-only مع بقاء استقلال مسار Create المباشر صحيحًا.

## قرار التدقيق

أُغلق نطاق القائمة دون findings مصدرية متبقية. يبقى تشغيل المواصفات والبناء
والقبول في المتصفح عند المالك ضمن الحدود المعلنة.
