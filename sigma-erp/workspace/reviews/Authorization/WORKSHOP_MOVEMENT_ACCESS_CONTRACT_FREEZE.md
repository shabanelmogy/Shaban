# عقد الصلاحيات المجمد — حركات الورشة WorkshopMovement

| البند | الحالة |
|---|---|
| Status | Frozen — authorized source implementation |
| التاريخ | 2026-11-11 |
| الجرد قبل الإقفال | 143 operation-confirmed / 263؛ WorkshopMovement ما زال resource-only |
| الاكتشاف | [WORKSHOP_MOVEMENT_ACCESS_DISCOVERY.md](WORKSHOP_MOVEMENT_ACCESS_DISCOVERY.md) |

## 1. حدود المنتج والفروع

تسجل Sigma حركة فتح ورشة جديدة على **مركبة واحدة** و**فرع تنفيذ تاريخي** ووقت حركة، بينما السائق والورشة الموردة (Supplier) والنوع ومرجع PO والمرفقات اختيارية. `WorkshopMovement` ليس `Workshop` master، ولا يحمل حالات Close أو Return أو Delete التي تظهر في واجهة Speed المؤرخة 2026-10-28. مصدر Type الحالي هو Enum Sigma 0..4، لا تُخلط قيم Speed معه. لا يختلق Backend حالة مكتملة أو DateIn من DateOf؛ يكون الحقلان غير معروفين/`null` إلى حين تصميم دورة إغلاق مستقلة. لا تعديل/حذف/تفعيل/استيراد/إغلاق مدعوم في هذه الواجهة الآن.

فرع الحركة `BranchId` مطلوب من مصدر خيارات الفرع الجاري `CurrentBranch/Options`، ويحكم نطاق القراءة التاريخي حتى لو انتقلت المركبة. لا يكفي فحص ملكية المركبة الحالية لتقرير رؤية الحركة. الحماية المركزية عند SaveChanges تفرض `AllowsWrite` بالفعل؛ تُضاف حماية صريحة مبكرة ورسالة واضحة لمنع جولة DB غير لازمة، وتُتحقق أيضًا من فرع نشط ونفس الاشتراك. لا يعتمد الحفظ على رقم فرع أو مركبة مخمَّن.

## 2. مصفوفة المنح

| العمل | المنحة/الشروط | نقطة التنفيذ |
|---|---|---|
| القائمة والمرشحات والصفحات وExcel | `WorkshopMovement.View` | `GET /WorkshopMovement`, scoped by saved BranchId |
| التفاصيل، طباعة، بطاقة سجل الحركات | `WorkshopMovement.View` | `GET /WorkshopMovement/GetByWithNavigationsId/{id}`، والعرض الموروث GetById تحت View، واللوج مستهلك فعليًا من `logsMovement` |
| إنشاء مباشر | `WorkshopMovement.Create` + `Vehicle.Lookup` | `POST /WorkshopMovement`، مستقل عن View وبدون GET قائمة محجوبة؛ `CurrentBranch/Options` actor-bound وليس Branch.Lookup |
| اختيار سائق أثناء إنشاء | السابق + `Driver.Lookup` **مشروط فقط إذا أُرسل DriverId** | `Driver/GetSelect`، بدون منحة لا يمنع إنشاء بلا سائق |
| اختيار ورشة موردة | السابق + `Supplier.Lookup` **مشروط فقط إذا أُرسل WorkshopId** | `Supplier/GetSelect`؛ لا علاقة بمنحة `Workshop.Lookup` لتعريف أسماء الورش |
| فلتر الورشة الموردة في القائمة | `WorkshopMovement.View` + `Supplier.Lookup` مشروطًا عند تشغيل `workshopId` أو عمود grid للمورد | الفلتر اختياري؛ سقوطه يمسح المرشح ويعيد القائمة دون تسريب |
| اختيار مرجع أمر شراء اختياري | `PurchaseOrder.Lookup` للـdropdown فقط | `PurchaseOrder/GetSelect` عند وجود منحة؛ الحقل string editable بلا FK، لا يتطلب المنحة لمجرد إدخال رقم نصي |

مرفقات الشاشة تستخدم خدمة الرفع/الحذف العامة وقيودها الأمنية القائمة، ولا تعطي هذه المنح إذنًا عامًا للتنزيل؛ تحافظ الشاشة على تنظيف المرفقات بعد نجاح الحفظ وعلى حدود وسائط أخرى. إذا لم تتوافر صلاحيات رفع الوسائط، لا يمنع إنشاء حركة دون مرفقات. مورد `WorkshopMovement.GetSelect` غير مستهلك؛ لا تنشر منحة وهمية، وتُعاد له 405 إن كان generic reader غير آمن/غير مدعوم. `GetAllWithNavigations`, `Remove`, `Update`, `HandleActivate`, `CheckUnique`, bulk AddList/UpdateList لا وظائف لها في Sigma الحالية؛ ترد 405 ويستبعد resolver منحها القابلة للإسناد، بلا إغلاق `GetById` أو تفاصيل اللوج الفعلية.

## 3. العقد الخادمي

`AddVM` يقبل BranchId موجبًا، VehicleId موجبًا، DateOf صالحًا، fuel level enum 0..8، KMs int?، Type null أو 0..4، DriverId وWorkshopId اختياريين وموجبين حين وجودهما، PurchaseOrderNo ≤100، Notes ≤2000 وDocument اختياري. أزل `WorkshopMovementNo` وكل حقول الاشتراك والرقم والهوية الخادم من مدخل الإنشاء، واستخدم `Repository.AddAsync` لتوليد `No` ثم عكسه على `WorkshopMovementNo`. تحقق من موظف السائق والمورد/المركبة من الاشتراك نفسه ومن مصادر `Repository.Query` النطاقية وكونها حية وفق قيودها، ولا تكشف صفًا من فرع غير مرئي. عدم وجود حالة إغلاق يحظر كتابة `Status='Completed'` أو `DateIn=DateOf` في JSON، مع الحفاظ على حقول DTO بشكل nullable إن لزم التوافق مع واجهة القائمة.

المتغير `SubscriptionId` مستمد عمدًا من `ClaimTypes.NameIdentifier` الموقّع، ولا يُغيّر `Repository` أو `DbContext`. استخدم `Repository.Query<WorkshopMovement>` أو RootScoped DbContext query للحركة التاريخية قبل إسقاط المرجع، وطبّق الفلترة على الأسماء الظاهرة للمستخدم فقط لمنع كشف مرجع فرع آخر. القائمة `CountAsync` قبل Take، حدود pageSize 100، مع ترتيب DateOf desc/Id desc مستقر. GET list عبر `ToActionResult` للـHTTP status الصحيح؛ 404 للتفاصيل المخفية مثل غير الموجودة.

## 4. عمر الواجهة والتحميل

- سجل قواعد `/WorkshopMovement`, `/create`, `/details/:id` صراحة. route create يعمل بـCreate+Vehicle.Lookup دون View؛ لا تبدأ bootstrap list/export/supplier filter على direct create. عرض/طباعة/Excel يحترم View ويتوقف فور السحب/تبديل الحساب ويُخفي النتيجة القديمة.
- قائمة البحث/الصفحات/المرشحات عبر `switchMap` مع إلغاء read عند revoke/actor/branch/context، وتحقق row ownership. فلتر الورشة يعتمد Supplier.Lookup اختياريًا، ويُزال عند فقده، و`grid` المورد يحتاج قاعدة grant مماثلة في الخادم.
- المحرر يتطلب Vehicle options للإنشاء، ويقرأ Driver/Supplier/PurchaseOrder اختياريا بحسب grant، مع فشل/Retry مستقل ومؤشرات UI22: القائمة/التصدير/الحفظ مؤشر صفحة، lookups النافذة محلية، التفاصيل داخل dialog محلية إذا أخفى overlay المؤشر العام. الكاش المرجعي لا يخلط اشتراكات؛ يحتفظ بتحديث الكاش الذي لديه بيانات بصمت.
- `POST` المرسل لا يلغى بتدمير المكوّن، ويُمنع تقديمه من سياق انتهى؛ مالك `CAN_PRESENT_API_OUTCOME` يمنع نشر Toast القديم. يحتفظ مسار `DocumentUploadTracker.finishSave/discard` بتنظيف مرفقات save مرة واحدة بعد نجاح الخادم، حتى لو غُلقت النافذة مع بقاء الكتابة المرسلة. ما لم يستطع النموذج تنفيذ cleanup بعد unmount، يوثّق خطر الملفات المؤقتة ولا يدعي اكتماله.
- المحرر لا يعيد إرسال POST إذا نجح وسقط تنظيف الملفات؛ `Retry` ينفذ cleanup فقط. الطباعة بعد GET تفاصيل ناجح بهوية/جلسة حالية فقط، وقابلية إلغاء print عند revoke/session switch. أخطاء قراءات API محلية مع إعادة محاولة، وخطأ الحفظ من معترض API أو خطأ واحد بملكية واضحة حسب سياسة cleanup، بلا تكرار.

## 5. التوثيق وقبول المالك

أضف source specs للسحب/العودة وcreate-only واختيار lookup المشروط والصفحات و405 وعزل البيانات وتبعية فرع الكتابة والرقم الخادمي. حدّث دليل حركات الورشة بالعربية والإنجليزية، وصرّح بأن إغلاق Speed ليس متاحًا هنا، وأن عدم وجود DateIn لا يعني اكتمال الحركة. راجع loading/cache/index وHTTP mapping وجميع فروق Git المحصورة، ولا ترفع الجرد إلا بعد المطابقة. هجرات مخطط/DB فقط عند وجود فرق حقيقي؛ المالك أذن بالهجرات وتجهيز البيانات التجريبية، لكن لا تختلق حالة/عمود status. build/tests/browser/commit/push غير مفوضة؛ تسلم نتائجها للمالك.
