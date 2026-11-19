# عقد صلاحيات طلبات ونماذج تصحيح الإدخال

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| التاريخ | ٩ نوفمبر ٢٠٢٦ |
| النطاق | DataEntryCorrection وDataEntryCorrectionModel وshared correction workspace/editor/API ومرفقاتهما |
| التفويض | استكمال الهدف النشط لكل الصلاحيات؛ تنفيذ المصدر والمطابقة والدليل دون توقف بين الوحدات |
| الحدود | Source-only؛ لا build/tests/lint/browser/DB/migration/snapshot/reset/commit/push/deploy |

## الأدلة والعقد السابق

قُرئ DATA_ENTRY_CORRECTIONS_MAINTENANCE_EVOLUTION_PLAN المجمد في١٤أكتوبر،
وشروح S148 الأصلية من library/pages/08290416292651b0.html، ثم sidebar
٢٨أكتوبر `27-data-entry-corrections/screens/01-data-entry-corrections.md`،
وC0338 كاملًا وC0336 بشرائح init/SLA/upload/save/validate. يثبت المرجع تسجيل
طلب دعم مع SLA ووصف ومرفقات وقائمة المفتوح والمغلق والإخراج، ولا يثبت
تصحيحًا آليًا أو خادم تفويض. سجلات الردود/الأولوية/customer-care coordination
فجوات منتج منفصلة لا تمنح أفعالًا وهمية. لا شرح أصلي مستقل لنماذج Sigma؛
هي سجل محلي مستقل مثبت بعقده. قُرئ مدخل Odoo المكمل؛ لا فجوة مفهومية عامة
تحسم سلوك صلاحيات هذا المنتج الخاص بدل مصدره المحلي.

يبقى شكل UI01: قائمة ومحرر dialog واحد، والمدخلات وصف وSLA ومجموعة مرفقات
scalar. يبقى نمط BE1 مع مالك validation والمراجع والـstatus/metadata الحالي.
لا طلب مستخدم لدعم خارجي أو إرسال رسائل أو تنفيذ تصحيح مالي. سجلات SLA
التاريخية ذات غرض domain تبقى كما عقدها، ولا تستخدم سياسة البيانات التجريبية
لمحو معلومات عمل مقصودة. جميع البيانات الحالية تجريبية؛ لا توافق لمسارات
ملفات عامة قديمة أو backfill/ترحيل تخميني. لا حذف أو reset في هذا النطاق.

## المنح والمسارات والبيانات

| السطح | الشرط الفعلي |
|---|---|
| قائمة الطلبات/الفلاتر/التحديث/كل صفحات Excel | DataEntryCorrection.View؛ لا Export مخترع |
| قائمة النماذج/الفلاتر/التحديث/Excel | DataEntryCorrectionModel.View |
| عرض محرر | View للمورد نفسه، دون GET لاتفاقيات التحرير |
| إنشاء | Create للمورد + SupportSlaAgreement.Available |
| تعديل من القائمة أو زر العرض | View + Update للمورد + Available |
| حذف من القائمة | View + Delete للمورد، وعضوية كائن الصف الحالي وسياقه |
| إغلاق طلب مفتوح | View + DataEntryCorrection.Close، بلا Update ضمني؛ لا Reopen ولا إغلاق للنموذج |
| الروابط بين القائمتين | View لوجهة الرابط نفسها |
| upload | Media.UploadMedia + منحة المحرر؛ رفع خاص بالرافع، لا ملف عام |
| read | Media.ReadCorrectionAttachment + View للمورد صاحب الرابط الحي؛ المسودة لرافعها مع Create/Update لأحد الموردين |
| إزالة/استبدال محفوظ | منحة المحرر + Media.DeleteMedia؛ التفريغ لا يحتاج Upload؛ سجل pathless لا يحتاج Cleanup |

الطلبات والنماذج مشتركة داخل الشركة، بلا فرع حركة أو أثر محاسبي. تبقى
حدود tenant والفروع المسندة للجلسة لدى الحراس العامين؛ لا BranchId جديد
أو تخمين فرع من SLA. Available قراءة WholeDocumentRead صريحة.

الروابط create وdetails/:id الحالية navigation aliases تعيد للقائمة؛ ليست
عقد فتح محرر تلقائي أو كشف سجل آخر. تُحرس بمنحة View للقائمة المقابلة
وتوثق كتحويل قديم فقط. لا تحويل لسجل بلا إذن عرض، ولا route تحرير جديد.
يُضاف الموردان إلى registry والبداية بعد إثبات تبني أحداثهما فقط.

الأعمدة الحالية للطلب Id/EntryNo/DateTime/By/Detail/Status، وللنموذج Id/Detail؛
لا حقول إضافية في ListVM. المدخلات Detail/SelectedSlaAgreementIds/Attachments
ومعرف Update فقط، والـstatus/metadata/SLA snapshot خادم. الحذف لا يغلق
الطلب ولا يلغي تصحيحًا محاسبيًا. المرجع لا يثبت قيد Closed على Edit/Delete؛
يبقي عقدهما السابق. لا cache opt-in على Available أو list/detail؛ direct
reads مع إلغاء/error/Retry، بلا cache جديد. لا مصادر lookup في القائمة.

## عقد المرفقات الخاصة

يبقى اسم المجلد DataEntryCorrections، وتُحفظ الملفات الجديدة تحت private
store خارج wwwroot؛ يُرفض static alias القديم. يضاف
CorrectionAttachmentPath بمالك PrivateUploadPath القائم، وواجهة
IPrivateCorrectionAttachmentStorage.Exists(path,subscriptionId).
الأنواع JPEG/PNG/PDF؛ اسم uploader/GUID/ext يحدد الرافع والشركة.

يضاف GET Media/correction-attachment?path بمنحة Media.ReadCorrectionAttachment،
وFileLink protectedResource='correction-attachment' دون arbitrary URL أو
fallback ثابت؛ PDF رابط دون صورة، مع no-store/nosniff وobject URL lifetime.
يتبنى قارئ المرفق داخل الحوار FileLink.localReadProgress=true: StateMessage
محلي واحد بدل lease الصفحة، مع التقاط مالك التقدم عند بدء القراءة كي لا
تفسد تغييرات المدخلات اللاحقة عداد التحميل. القيمة الافتراضية false تحفظ
مستهلكي FileLink خارج الحوار.

يحتفظ كل من الكيانين بحقل داخلي server-only:
`List<string> RetiredAttachments = []`.
تُضاف إليه مسارات الملفات المحفوظة التي أُزيلت أو استُبدلت، وتبقى Attachments
العاملة كما هي في DTO/list scalar. الغرض دليل تفويض تنظيف بعد إزالة الرابط،
وليس عرض تاريخ ملفات أو حفظ بيانات اختبار قديمة. لا VM أو payload لهذا الحقل.
الحذف الناعم للطلب/النموذج يحتفظ بالقوائم كدليل تاريخي. المخطط عند المالك:
`AddCorrectionAttachmentOwnershipHistory`؛ لا هجرة أو snapshot في عمل الوكلاء.

كل mutation للموردين وbulk المثبت وClose/Delete تأخذ القفل نفسه
ExecuteUniqueWriteAsync<DataEntryCorrection> ضمن الشركة وSerializable،
وتأخذه إزالة الملف الفعلي قبل إعادة فحص المراجع/الحذف. يجري فحص الجديد
داخل القفل: path صحيح/موجود/لرافع الطلب، ولا مسار مشترك أو سبق ربطه بسجل
آخر من أحد الموردين بما يشمل المتعقب والمزال. لا تخمين FK أو سماح اعتماد
مسار معروف من tenant آخر. توضع المصالحة والأدلة المشتركة في مالك helper
واحد عند الحاجة، مع بقاء قواعد SLA/status في مالكها الحالي.

قراءة ملف مرتبط تحتاج View لكل مالك حي له. لا يعود ملف تاريخي إلى مسودة
إذا أزيل من Attachments أو حذف أصله. تنظيف المرتبط حيًا مرفوض؛ التنظيف
التاريخي يحتاج Update أو Delete لكل مورد مرجعي، والمسودة بلا مرجع لرافعها
دون اشتراط بقاء business grant. Media endpoint grants مستقلة عند الفلتر.
المدير لا يحذف ملفًا مرتبطًا حيًا. لا اشتراط DeleteMedia مخفي لكل aggregate
Update؛ الواجهة تطلبه عند إزالة/استبدال محفوظ، والخادم يملك تاريخ الرابط.

## عمر الواجهة والتحميل والتعافي

ملف correction-access.ts يملك grants المشتركة للموردين؛ لا إنشاء مخزن
صلاحيات أو استخدام snapshot إداري. handlers تعيد فحص grant/context/object
membership/busy/state، وتلغي قراءات القائمة/detail/SLA/export والتأكيدات
والتركيز المؤجل ومنافذ body عند expiry. القائمة mounted hidden/inert، وتمسح
بيانات السياق السابق. استعادة الوصول لا تعيد طلبًا فاشلًا في loop.

المحرر mounted ومسودته محفوظة عند السحب، والـdialog يستخدم
accessRequirement/accessBlocked. يصرح parent بمتطلب العرض/الفتح، ولا يدمر
المحرر لمجرد فقد منحة القائمة إن بقي editor draft/sent outcome. يملك كل
save/delete/close HttpContext+trackWrite؛ لا takeUntilDestroyed/denied بعد
الإرسال، ويسجل نجاحه قبل mayPublish حتى لا تكرر Retry كتابة نجحت.
تتبع delete/close نتائجها بحساب ثابت للمنع من الإعادة عند regrant.

القرار قبل الكتابة lazy/cancellable مع إعادة الفحص بعده. local discard
بعد denial متاح وفق UI28، دون قطع cleanup مرسلة أو تنظيف باسم actor آخر.
يربط FileField permission المحرر وuploadPermission row-specific، ويتتبع
publicationCancelled$/Allowed وprivate FileLink، وEditableRows
canRemove/onRemoving/removeAllowed وfocusField بعمرها. لا حذف ملف قبل نجاح
الحفظ. cleanup وحدها يعاد عند فشلها، دون POST/PUT آخر.

القائمة/export/الكتابات يتبعان page LoadingService start/finalize،
وقراءة detail وAvailable داخل dialog يتبعان progress المحلي StateMessage
الواحد؛ لا spinner عالمي محجوب ولا تحميلين. لكل failure envelope/HTTP
feedback واحد مع explicit Retry، وsent outcome context يمنع global error
من حساب قديم. source parsing لا يدعي نجاح build/tests أو ظهور loader.

## خطة التنفيذ والملكيات

١. الجذر يثبت هذا العقد والمفاتيح وtransport contexts وFileLink resource.
٢. عامل خلفية يملك فقط كود backend للموردين وprivate Media/storage/helper
والكيانات/config/المواصفات المرتبطة. لا migration/snapshot.
٣. عامل محرر يملك correction-editor.component.ts/html/spec فقط.
٤. الجذر يملك workspace TS/HTML/spec والroutes/registry/guide/docs والجرد.
٥. تكامل ثم تدقيق مستقل بملكية قراءة فقط ومصالحة، وبعدها ترقية الموردين
فقط إذا أُغلقت كل findings؛ schema/runtime/SQL/storage قبول المالك المجمع.

كل عامل يقرأ التعليمات الحية والمهارة والكتل المناسبة ويحفظ تغييرات الزملاء؛
لا مصدر مشترك بين ملكيتين. هدف الصلاحيات العام active، ولا يُطلب قبول
وسطي من المالك. فشل عقد مادي يوقف شريحته فقط؛ لا يُخترع workflow مالي.

## الأداء والقبول المخطط

القائمة Count/paging من المالك الحالي، وExcel fetchAllPages تسلسلي محدود
بـ١٠٠ صف للطلب، دون per-row reads. Available direct active/non-expired SLA.
يفحص backend ترجمة primitive Attachments/RetiredAttachments predicates وحجم
evidence؛ لا تسلسل EF متوازٍ على DbContext. لا فهرس JSON عام بالتخمين.
يسجل الفهرس المقترح فقط بعد قراءة keys/predicates/index coverage؛ الأوقات
وSQL plan/cold-warm network عند المالك، لا measured speed في المصدر.

قبول المالك: منح مستقلة للموردين وView/Create/Update/Delete/Close/Available،
tenant/branch session، aliases/الرابط المباشر، revoke/regrant/actor switch
أثناء read/decision/write/upload/export، وSLA expired/unchanged، وPDF/image
private draft/live/retired/other uploader، cleanup بعد replacement/delete،
race attach/delete/bulk وتزامن Close، ثم البناء والمواصفات وRTL/themes/mobile.
