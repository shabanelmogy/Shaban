# تسليم صلاحيات قائمة عقود التأجير

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |

## النتيجة المحددة

تبني القائمة النشطة والمغلقة في مالكها الحالي. العرض مستقل عن الإنشاء
والتعديل ومنح الإجراءات. كل عنصر ActionList يحمل متطلبه المجمد، ويكرر
callback الحراسة على المنحة والـbusy وحالة الصف وعضوية كائن الصف الفعلية،
لا الهوية وحدها. القائمة المغلقة تبقي View فقط. مرشحات الفرع والعميل
والمندوب اختيارية بمنح مصادرها؛ لا طلب خيارات ممنوعة ولا تسميات قديمة
أو قيمة مرشح ممنوع في الاستعلام المطبق.

تراقب الجلسة تغيّر الممثل والوصول حتى بين دورتَي effect؛ تلغى القراءات
والقرارات وتُمسح النتائج والبوابات فور الانتهاء. تبديل A→B→A يمسح
مرشحات الممثل السابق. استعادة الوصول تعيد bootstrap مرة تحت busy tail،
ولا تعيد كتابة مرسلة. تبقى الحوارات خارج hidden/inert الخاص بالقائمة؛
حراسة جلساتها عند مالك الحوار، دون تدمير المسودة لمجرد سحب View.

الحذف يستخدم تأكيدًا lazy يلغي بالسحب/السياق ثم يعيد حراسة المنحة
والصف والحالة مباشرة قبل الإرسال. الطلب المرسل لا يرتبط بالـdestroy؛
تثبت نتيجة النجاح على كائن الصف قبل publication، وتُحرس النتائج المحلية
والعامة بسياق CAN_PRESENT_API_OUTCOME. يعود إلى الصفحة السابقة عند حذف
آخر صف ويعيد القراءة دون replay. يظل busy حتى اكتمال الطلب.

التصدير يقرأ كل الصفحات من نسخة المرشحات المطبقة ويستخدم أعمدة الجدول
والترجمات لحظة الطلب؛ لا يعتمد تغييرات النموذج غير المطبقة أو صلاحيته.
يلغى بتغير الوصول/الممثل، وتُحرس النتيجة والرسالة بنسخة القائمة.

## مطابقة الكتّاب والمصادر المشتركة

| العنصر | المصدر والمالك | الدليل والحالة |
|---|---|---|
| النمط والقائمة | UI1/4/6/7/8 وWorkshop/Job/components/list | نفس FilterPanel/DataTable/FeatureTitle والصفحة الداخلية؛ SCSS الحالي يخص شارة الحالة فقط |
| القراءة | LeaseAgreementService.getList → GET LeaseAgreement | switchMap على trigger دائم؛ إلغاء inner فقط؛ فشل business وHTTP محفوظ مع Search للمحاولة |
| الميديا والإجراءات | ملف lease-agreement-access | مفاتيح المتحكم/resolver الحقيقية؛ create مستقل، edit مع View ومصادره؛ تفاصيل الأفعال في العقد المجمد |
| الإخراج | fetchAllPages/dataTableExportRows | كل النتائج والترتيب والحقول الحالية؛ لا ملف جزئي عند فشل صفحة |
| التحميل | UI22 LoadingService + ReferenceLookupStatus | القراءة/التصدير/الحذف global start/finalize؛ bootstrap الخيارات page shared owner؛ لا inline filter spinner جديد |
| الخيارات | Branch/GetSelect وCustomer/GetSelect | cache opt-in موجود، finite read ثم watch منفصل؛ mutations/imports/realtime مشتركة تملك invalidation؛ watch يلغى مع الجلسة |
| المندوب | Staff/GetSelect | direct reference بلا cache opt-in عند StaffService؛ لا cache/watch مخترع |
| الحوارات | EditorDialog عند كل طفل | تبقى مثبتة خارج protected list host، حراسة ودورة الحفظ عند الطفل |
| الروابط | registry وroutes المالكة | View للنشطة والمغلقة والتفاصيل؛ Create ومصادره مستقل؛ Edit مع View/Update ومصادره |

الأعمدة الحالية: no/isClosed/agreementType/poNo/vehiclePlateNo/
permanentVehicle/customerName/customerCode/driverName/dateAndTime/endDate/
branchName. تقابل قائمة DTO نفس الحقول مع id وbranchId وisVoided
وأعلام canEdit/canReplaceVehicle/canReplaceDriver/canExtend/canClose/
canDelete/canVoid اللازمة للإجراءات. لا تغيير حساب مالي أو مخطط هنا.

## أدلة التحقق وحدوده

فُحص نحو٧ ملفات/قالبًا و٨٩ استيرادًا محليًا بلا مشاكل في دفعة الجذر
الأولى؛ أزيل سطر EOF زائد كشفه diff-check. تظل مطابقة الدفعة النهائية
تحت الجذر، وانتهى تدقيق عامل الخلفية للقائمة دون finding مؤكدة. كُتبت٢١ حالة أعمار للقائمة و١٥ حالة نقل
سياق mutation و٦ حالات routes؛ هذه مواصفات **غير منفذة**.

المتبقي التشغيلي: منح كل إجراء منفردة، revoke/regrant سريع، تغيير الحساب
والفرع، تأكيد الحذف وسحب المنحة، tail طلب الحذف، إخراج متعدد الصفحات،
الأخطاء وإعادة المحاولة، والـRTL/theme/keyboard وحجب البوابات فعليًا.
قياس cold/warm load وSQL plans وIO والـnetwork/overlay معلق؛ حذف طلبات
غير مسموحة من المصدر لا يثبت قياس أداء. لا مخطط فهارس للقائمة من الجذر؛
يراجعه مالك الخلفية ضد query/coverage الفعلي قبل المطابقة النهائية.

لا بناء أو اختبارات أو lint أو typecheck أو متصفح أو قاعدة بيانات أو
هجرات أو commit. لا ترقية للجرد حتى انتهاء كل توابع الوحدة والتدقيق.

ملاحظة UI2: تغيير revision لا يمس bootstrap إذا ظلت منح القراءة والممثل
نفسها؛ مالك cache يملك إعادة التحقق الصامتة. توجد مراقبات مستقلة للمنح
الاختيارية الممنوحة، حتى لا يضيع استرداد bootstrap بعد سحب/إعادة سريعَين
قبل استقرار effect.
