# متابعة تبني صلاحيات الأسطول وتجهيز البيع

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ٢٠٢٦-١١-٠٧ |
| النطاق | Fleet UI02،حوار تجهيز البيع UI09،المرفقات المشتركة،المسار والدليل |
| العقد | FLEET_ACCESS_ADOPTION_CONTRACT_FREEZE.md مع CURRENT_ACCESS_IMPLEMENTATION_CONTRACT_FREEZE.md |
| الهدف الشامل | تفعيل الصلاحيات في كل الشاشات والأحداث ما زال active؛ هذه دفعة مستقلة وليست إغلاق التطبيق |

## التقدم المثبت

- جرى تتبع route الفعلية ومصادر كل lookup/action/callback قبل كتابة السياسة.
  عرض Fleet وحده يحتاج Equipment.View، وتبقى فلاتر الاختيارات اختيارية؛
  create/edit يحتاجان مصادر المحرر الفعلية دون وراثة Create داخل edit.
- أضيفت متطلبات upload/cleanup اختيارية في DocumentUploadTracker وpermission
  في FileField، مع preserving sent write outcomes وفشل cleanup القابل للـRetry.
  أضيفت hooks row-specific في EditableRows لإعادة الفحص قبل/بعد confirmation
  وتنفيذ markRemoved فقط قبل إزالة صف مقبولة فعلًا.
- ثبت RED للمرفقات: ٢/٥ فشل tracker و٢/٤ فشل FileField. ثبت RED لصفوف
  المرفقات٢/٢، ثم نجحت مجموعة shared/route/layout **٢٩/٢٩** بعد إضافة حالة
  الاختفاء التفاعلي وبقاء اسم الملف. السجل `%TEMP%/sigma-fleet-shared-green.log`.
- ثبت RED للقائمة/تجهيز البيع: **٨فشل/١نجاح** بعد تصحيح fixture enum إلى
  EquipmentSaleStatus.Available، السجل `%TEMP%/sigma-fleet-list-prep-red.log`.
- ثبت RED لمحرر Fleet/route: **١٦فشل/١٦نجاح** في الاختبارات المحددة، السجل
  `%TEMP%/sigma-fleet-editor-route-red.log`. صحح إعداد اختبار المحرر ليستخدم
  ActivatedRoute حقيقية للإضافة/التعديل/العرض بدل دخول view بلا id؛ ظلت
  assertions السلوكية. ثم كُشف قرار حذف صف يقبل actor جديدًا قبل effect،
  فأضيف confirmationCancelled$ من denied$ للقرار نفسه. نجحت تفاصيل المحرر٢٢.
- أنجزت سياسة route Fleet وlanding بالأسماء الفعلية واختبارات CRUD
  المستقلة؛ نجاحها ضمن٢٩ لا يثبت اكتمال كل events في feature consumers.
- أثبت التدقيق فجوة متطلب parent dialog (View+Get) الذي كان للتخفي فقط؛
  أصبح جزءًا من جميع can* وread notifiers. نجحت القائمة/التجهيز١٠حالات،
  ومنها سحب View فقط مع بقاء منح تجهيز البيع. لم تُقطع Confirm المرسلة.
- أثبت اختبار row visibility RED أن زر حذف المرفق المحجوب ما زال يظهر رغم
  حراسة handler؛ تبنى الجدول removeAllowed نفس rule الخاص بالصف، ثم نجحت
  مجموعة Fleet/shared/route/layout **٦٢/٦٢**. لم يضف CSS أو markup حذف منافس.
- أثبت اختبار هدم مستهلك الرفع RED أن HTTP يُقطع قبل pending.add؛ أصبح
  upload الواحد مشتركًا بعمر tracker المحرر، مع destroyRef upstream من
  shareReplay. نجحت **٧/٧** بما في ذلك consumer unsubscribe ثم تنظيف path،
  وإلغاء المصدر فعلًا عند هدم المحرر/المالك. حفظ المسار للتنظيف محدود بعمر
  tracker وسياقه؛ لا ضمان تنظيف عبر actor/link جديد. لا discard تلقائي من
  سياق جديد قد يحذف مرجعًا حفظه Save قديم؛ تبقى قاعدة orphan server في UI18.
- الجولة الموسعة مع نواة الوصول والأصول والإسنادات وEditorDialog/MockData
  نجحت **١٣٧/١٣٧**، السجل `%TEMP%/sigma-fleet-authorization-final.log`.
  انتهى بناء التطبيق النهائي بعد آخر تعديل tracker بنجاح (exit 0) بتاريخ
  ٢٠٢٦-١١-٠٦ الساعة٢٣:٤٨UTC، في `%TEMP%/sigma-fleet-application-final.log`.
  التحذير الوحيد NG8113 يخص QuantityInputDirective غير المستخدم في
  PurchaseOrdersComponent خارج النطاق؛ القبول المرئي على التطبيق ما زال معلقًا.
- استكمال التدقيق النهائي كشف تكرار GET مع الاستجابة غير المتزامنة، وبقاء
  تأكيد الحذف بعد السحب، وعدم إعادة فحص حالة Available، وتعذر cleanup Retry
  خلف route محجوبة. ثبت RED٩فشل/٢٢نجاح للتفاصيل، ثم RED٣فشل/٤نجاح للقائمة
  مع حالة منح فلتر جديد أثناء bootstrap معلقة. أُصلحت في مالكيها الحاليين.
- صُحح اختبار auto-cleanup ليُثبّت دورة Angular ويتحقق من الانتقال والخروج
  بدل افتراض تصفير cleanupKind قبل هدم component. أُعيد RED بعزل شرط
  auto-retry مؤقتًا فقط، ثم أُعيد المصدر فورًا؛ فشل الاختباران المستهدفان
  وكذلك مسار الخروج المحلي الجديد. نُفذ lazy decision notifier الذي يُلغي
  القرار المفتوح عند السحب مع إبقاء قرار discard جديد عند denial القائم،
  ولا يقطع cleanup مرسلًا. نجحت الجولة الموسعة الأحدث **١٥١/١٥١**، السجل
  `%TEMP%/sigma-fleet-authorization-reviewed-final.log` (exit0).
  نجح بناء التطبيق بعد هذه الإصلاحات (exit0) بتاريخ٧نوفمبر٢٠٢٦ الساعة
  ٠٠:١٥UTC في `%TEMP%/sigma-fleet-application-reviewed-final.log`؛ بقي
  تحذير NG8113 نفسه خارج النطاق، ولا يوجد خطأ بناء.

## المراجع والمالكون

قُرئت قواعد Sigma والمهارة، UI7/13/14/18/26/28، وpacket04 بعد Check. قُرئ
Speed Sales/Fleet screen ثم C0800/C0799 منفصلين؛ declarations فقط، لا دليل
لحساب/حماية خادم غير ملاحظ. راجع root مدخل Odoo ولا توجد فجوة مرجعية لهذا
التبني. أكدت declarations PrimeNG21.1.10 وvalidate_usage الضيق للمكونين
إغلاق Select.hide وDatePicker.hideOverlay؛ النتيجتان valid، وليستا قبولًا
مرئيًا للدورة. استُخدمت مهارات Sigma وAngular وSuperpowers التشخيص/TDD/
المراجعة والتحقق، وPrimeNG audit للـoverlay API.

ملكية root: shared tracker/FileField/EditableRows،route policy،وثائق/دليل
واختبارات التشغيل والتكامل. عامل editor: Fleet/details وحده. عامل القائمة:
Fleet/list وsale-preparation. المراجع قرأ shared diff دون تغييرات، ثم جرد
SalesAgreement/Receipt للدفعة التالية. لا عاملين يكتبان نفس الملف.

قالب layout القديم فشل٤حالات لأنه يفترض محاذاة زر Remove مع أول control
track رغم قرار UI14٣١أكتوبر لتوسيط مجموعة file/error بكاملها. صُحح توقع
الاختبار إلى النص الحاكم، ولم يُعدل CSS أو شكل لمجرد إرضائه؛ نجحت حالات
LTR/RTL والثيمين والvalidation بعدها ضمن٢٩. لا ادعاء قبول متصفح التطبيق.

## المطابقة المتبقية

| المطلب | الحالة |
|---|---|
| القائمة/الفلاتر الاختيارية/بحث/صفحات/print/export | source matched؛ handlers وtemplates وصلاحيات مصادر الاختيارات مستقلة، denied$ وdataContext وإعادة bootstrap، GREEN مثبت |
| المحرر/الكتالوج/المرفقات/MockData/dirty exit | source matched؛ create≠edit، Save/Delete/row rules وإلغاء قرار stale، read-only callback reload وcleanup مستقلة عن المنحة المسحوبة، GREEN مثبت |
| إجراء تجهيز البيع والـportal/read cancellation/sent confirm | source matched؛ parent+operation requirement، body portals وإغلاق publisher overlays، actor invalidation والنتيجة المرسلة، GREEN مثبت |
| scoped diff والملفات الجديدة | تمت مراجعة النطاق والملفات الجديدة مباشرة، وتدقيق مستقل للإضافات؛ أُصلحت العوائق وأثبت RED ثم١٥١/١٥١GREEN، ولا عائق مصدري متبقٍ من التدقيق المحدود |
| الدليل | sales-guide في قارئ UserGuide الحالي يشرح permissions/optional filters/Media cleanup وتجهيز البيع باللغتين؛ القبول المرئي الحقيقي pending |
| المخطط/التحصيل | لا schema في هذه الدفعة؛ سؤالا authorization للمخطط والتحصيل ما زالا دون جواب، ولا يوقفان هذه الشريحة |
| الأداء | لا permission HTTP لكل عنصر؛ owners الحالية preserved كما هو موضح أدناه؛ لا قياس سرعة فعلي أو SQL plans في هذه الدفعة |
| الحزم | UI14/18 ثم UI28 والمهارة رُقيت؛ أعيدت الحزم الثماني من المولد وCheck كلها OK، وراجعت المطابقة الدلالية لعمر قرار الخروج والكتابة المستقلة دون تغيير reference roles |

لم تُشغّل DB أو migrations/snapshots أو commits/push/deploy. اختبارات Angular
المعينة headless تحت تفويض المالك الجاري، بدون خدمات API أو بيانات حقيقية.

## التحميل والكاش والحساب والأثر

القائمة تقرأ Equipment بحدود paging الحالية؛ print/export تقرأ كل الصفحات
بمالك page loading نفسه وتلغي التركيب قبل إخراج stale. الفلاتر المطلوبة
للنوع الذي يختاره المستخدم تحمل عبر page bootstrap، وBranch watch/cache
يُفصل ويعاد ربطه عند تغيّر الوصول؛ CarModel/VehicleType يبقيان direct حسب
المصدر. محرر الوحدة يستخدم page loader، وحوار تجهيز البيع مالك EditorDialog
المحلي لقراءاته. القراءة التشغيلية/المعاينة لا تُخزّن grant cache مكررًا.
cleanup بعد Save/discard يظل busy ومنفصلًا عن POST النجاح، وRetry لا يعيد
حفظ الوحدة. لا تقليل تكلفة/ضريبة أو حساب COGS/عملة أو مخطط في هذه الدفعة.
لا EF/VM/AutoMapper أو فهرس جديد؛ فهارس الشريحة الخلفية السابقة لها قبولها
المنفصل غير المطبق. توقيت الشبكة ورؤية loader الفعلية وRTL/themes/mobile
ومسار متصفح على الخدمات ما زالت owner verification.

المستودع المتغير في التطبيق هو SiGmaAngularFrontEnd؛ لم تُعدل خلفية في هذه
الدفعة ولا يُعاد احتساب١٧٠اختبار backend السابقة دليلًا للشاشات. عُدلت كتب
UI14/18 والمهارة وحزمها من المولد في مستودع الوثائق مع مراجعة المصادر الحاكمة.
جميع ملفات المصدر الجديدة راجعت مباشرة لأن Git diff لا يعرض untracked.

أصبح سجل٢٦٢مسارًا يحتوي١٣operation-confirmed و١٤٣resource-only و١٠٢unknown
و٢context-only و٢alias؛ هذا جرد أدلة لا قياس اكتمال كل الأحداث. لا يُستعمل
EquipmentSalePreparation.View المفترض؛ كتالوج الدفعة الفعلي منفصل في
ROUTE_PERMISSION_FLEET_OPERATION_CONFIRMED_20261107.json. التبني التالي
SalesAgreement يحتاج تجميد قراءات الإيصال المدمج الفعلية، والجرد مسجل في
خطة الوصول دون فتح مساره تلقائيًا أو اختراع سياسة تحصيل بين الفروع.

رسالة commit مقترحة للواجهة عند اختيار المالك:
`feat(authz): adopt fleet actions and preserve attachment request ownership`.
الخطوات المتبقية للقبول: مستخدم View فقط؛ إظهار كل optional filter عند منحه؛
create/edit مستقلة؛ سحب Delete قبل/بعد التأكيد؛ سحب grant من dialog مفتوح
بمنتقي body؛ إنشاء make/model ثم سحب Create مع بقاء read؛ upload جارٍ ثم
إخفاء الحقل؛ cleanup مرفوض ثم إعادة منحه؛ confirm تجهيز مرسل ثم سحب Get؛
تغير actor مع بقاء مفاتيحه؛ وبعدها قبول المظهر والاتجاه والثيمين والموبايل.
