# تسليم حوارات عرض الإيجار

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | 2026-11-10 |
| النطاق | الرفض وإنشاء الاتفاقية الرئيسية من العرض |

## التنفيذ والتكامل

بدأ العامل تنفيذ الحوارات، واستكمل الجذر الدمج والتصحيحات عند توقفه بسبب حد
استخدام الخدمة. لا إقفال معتمد بمجرد تقرير العامل؛ الملفات الحالية قرأها الجذر
وتجري مراجعتها المستقلة المحددة.

عقد الرفض: inputs visible/quotationId/quotationNo/rejectionType، outputs
visibleChange/saved، وsubmitting signal وcanDeactivate. يملك الحوار نفسه
الكتابة ومنحتي الاعتماد القائمتين، وتعيد القائمة القراءة عند saved/close وفق
صاحب الجلسة وbusy tail. لا يستخدم حدث reason متقادم من قائمة مختلفة.

عقد الماستر: visible/quotationId وvisibleChange/saved وsubmitting/canDeactivate.
يقرأ المصدر بـRentalQuotation.View قراءة محلية، والكتابة تتطلب أيضًا
RentalMasterAgreement.Create. غياب منحة الكتابة يعطّل الحقول والإرسال دون
تحويل قراءة العرض إلى كتابة أو طلب lookups غير مستهلكة. التوقيع الفعلي
MasterAgreementService.create(payload, context?)؛ لا class مخترعة باسم المورد.

هوية actor/record/type مثبتة، وinput setters تنهي السياق عند تغييره حتى إذا
عاد قبل change detection. القيم القديمة مخفية ولا تُنشر لحساب آخر. تستعيد
نفس الجلسة قراءات المصدر مرة بعد denial/regrant وbusy tail دون overwrite
تواريخ وملاحظات dirty. local discard lazy ومتوفر عند denial؛ تأكيد قديم يُلغى
إلىfalse. MockData والبوابات والتركيز لها notifier مستمر وعمر المستند.

الكتابات المرسلة مستقلة عن teardown/denial، مع CAN_PRESENT_API_OUTCOME.
يثبت success/committed/pristine قبل شرط النشر، فلا حفظ ثانٍ عند حجب النتيجة؛
saved يسبق visibleChange لحفظ مالك النتيجة في الأب. لا فشل صامت ولا auto replay.
التحميل في قراءة الماستر StateMessage محلي، وSave يستخدم owner القائم مع
EditorDialog.saving لظهور التقدم فوق overlay؛ يظل local close متاحًا.

## التحقق والحدود

مواصفات سلوكية مصدرية للرفض والماستر، تشمل المنح المستقلة والسبب والهوية
والتعافي والمسودة وفشلي HTTP/business والتأكيد المؤجل والكتابة المرسلة
والنجاح المحجوب/الهدم والتوليد والتركيز. لم تُشغّل المواصفات. استُخدمت
الترجمات الموجودة لكل من rentalQuotation/masterAgreement/general؛ لا keys
بديلة تعتمد على مجرد تشابه الاسم. parsing/import/diff النهائي والمراجعة
المستقلة تُثبت في المطابقة. التشغيل والبناء وظهور التحميل ولوحة المفاتيح
وRTL/theme عند المالك. لا schema أو migration لهذه الحوارات.
