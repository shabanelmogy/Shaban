# عقد صلاحيات الاتفاقيات الرئيسية للتأجير وتوابعها

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| التفويض | استكمال صلاحيات التطبيق دون أسئلة، والقبول مجمع للنهاية |
| الحدود | مصدر فقط؛ لا بناء أو اختبارات أو فحص أنواع أو متصفح أو قاعدة بيانات أو هجرات أو حفظ إصدار |

## الأدلة والنطاق

نطاق الشريحة قائمة LeaseMasterAgreement وتفاصيلها واعتمادها وفتح عقد من بند
بمحرر LeaseAgreement الحالي، في وضع embedded+masterAgreementSource فقط.
لا تُرقى وحدة LeaseAgreement العامة من تبني هذا المصدر. ينشأ الماستر من
عرض السعر وفق العقد المقفل؛ لا تُضاف أزرار إنشاء/تعديل/حذف غير موجودة للقائمة.
التفعيل الموروث بلا مالك حالة مدعوم يُرفض405 ويصبح غير قابل للإسناد.

قُرئ دليل Speed وتحليله، ثم S269/41eb2f187c26cb7b (٢٧أكتوبر)، ثم قسم
10-lease/screens/06-master-agreements وC0886 (٢٨أكتوبر). يثبت البحث بالرقم
والحالة والعميل والتاريخ ومرجع العرض، والتفاصيل والطباعة والتصدير والاعتماد.
التمديد الجماعي وPO المرجعيان ليس لهما عقد تنفيذ هنا؛ يبقيان فجوتين مستقلتين،
دون اختراع endpoint أو أثر مالي. نسخة الاكتشاف المؤرشفة دليل ميزة تاريخي؛
تتقدم عليها عقود فتح بند الماستر في LEASE_QUOTATION_FEATURE_REVIEW بتاريخ
٢٨/٢٩أكتوبر. Odoo المكمل عام ولا يقرر توزيع كمية البند أو مالية سيجما؛
لا حاجة لاستبدال قرار المالك بمرجع عام. لا صور جديدة.

الشكل UI02: قائمة وتفاصيل مقروءة ذات تبويبين واعتماد، مع استثناء المالك
المعتمد لفتح عقد داخل حوار. الخلفية BE13 مع انتقال اعتماد ومصدر تشغيلي؛
العقد التابع BE14 الحالي. المراجع الشكلية Job list/editor وEditorDialog،
والمالكون UI2/7/13/14/21/22/26/27/28؛ لا تعديل مرجع ولا wrapper جديد.

## المفاتيح والأحداث

| السطح | المتطلب |
|---|---|
| القائمة والبحث والصفحات والترتيب والتحديث والإعادة وإكسل | LeaseMasterAgreement.View |
| التفاصيل والطباعة والتبويبات | LeaseMasterAgreement.View |
| الاعتماد | View + LeaseMasterAgreement.ManageApproval مع exact current row وCanApprove |
| اختيار العميل المرشح | Customer.Lookup اختيارية؛ لا طلب أو watch عند سحبها |
| فتح عقد من بند | View + LeaseMasterAgreement.GetOpeningSource + LeaseAgreement.Create + Driver.Lookup + Staff.Lookup + ClauseType.Lookup + SettingsCommonModel.GetMySetting + LeaseTariff.GetBookingCharges |

المنحة الفعلية للاعتماد من DocumentApprovalEndpointRules وليست Approve.
الخادم يحتاج View أيضًا بجانب ManageApproval وGetOpeningSource. يُصنف
GetOpeningSource وLeaseTariff.GetBookingCharges كقراءة كاملة لا تسجيل.
قائمة المركبات المضمنة في المصدر تتبع فروع الاستعراض الحالية؛ حفظ العقد
يتطلب تسجيل فرع المركبة المختارة وفق مالكه. لا Vehicle.Lookup أوCustomer.Lookup
أوCarModel.Lookup مصطنعة في المصدر لأنها متخطاة فعليًا في bootstrap.
لا LeaseAgreement.View لمجرد إنشائه، ولا tenant-admin إلزامية جديدة.

## البيانات والمالكون

أعمدة القائمة: No/Date/CustomerName/CustomerCode/QuotationNo، وأعلام
ApprovalStatus/CanApprove والهوية Id. يُستبدل توريثListBaseVm بـNumberedDetailBaseVm.
التفاصيل تحوي الرأس والبنود الحالية فقط وتُحرس أسماء العميل والعرض بالشركة
والحذف؛ الأطفال live/current-tenant، وموديلاتهم وأنواعهم محدودة التسمية.
مصدر فتح العقد يحتفظ بهويتي الماستر والبند والعميل والطراز والنوع وأسعار
الشهر وقائمة المركبات المحدودة الحالية. لا تقسيم وحدات أو حجز كمية جديد.
DTOs التجارية والأسعار والضريبة وحسابات العقد لا تتغير.

اختيارات العميل opted-in عبرCustomerService: finite successful bootstrap ثم
watch مستقل، مع retention لأحدث selected labels وclear علىcontext وتوابع
invalidation القائمة. التفاصيل والمصدر والتعريفة تشغيلية مباشرة بلا cache؛
Driver/Staff/ClauseType مباشرة بلا opt-in جديد؛Common settings singleton القائم.
محرر المصدر لا يعيد broad customer/model/vehicle bootstrap. احتفظ بدقة
الكميات والمال والعقود المالية القائمة، ولا compatibility لبيانات التجربة.

## أعمار الواجهة والكتابة

كل callback يعيد فحص grants/state/exact object/current context/nonbusy.
القرار lazy/cancellable ويُعاد التحقق قبل dispatch. reads وexports والطباعة
والتركيز والـportals مرتبطة بالممثل والمستند والمنحة؛ queries فقط لا تلغي
التهيئة على المسار نفسه. mounted draft تُحجب hidden/inert ولا تُدمر عندdenial؛
الـactor/source expiry نهائي حتىA→B→A بعدسحبمنحة، وحتىإزالةinputالمصدر.
sameactor regrant تعيد قراءات مطلوبة محدودة دون إحياءdraftقديم لممثل آخر.

POST/approval المرسلة مستقلة عنdenied/destroy، تحملCAN_PRESENT_API_OUTCOME
وtrackWrite، وsuccess latch قبلmayPublish يمنعreplay. لا toast/navigation/
print/refresh منجلسة منتهية. الخروج/Cancel يشاركانpublic canDeactivate،
معقرارlocal discard متاحبعدdenial وterminalعندقبوله، وإلغاءالقراراتالسابقة.
MockData يحملrequirementوpublicationpredicateوcancelnotifierلجلسةالمصدر؛
لا تبقىpreviewبعدexpiry أوregrant. parentdialogيستخدمrequirement/blocked
نفسهما،ولا structuraldestroyللمحررعندdenial. selectors/focusمقيدةبنفسالعمر.

القائمة/التفاصيل/إكسل/الاعتماد تقدم صفحة؛ مصدر وlookupsالمحرر فيالحوار تقدم
محلي وحيد عبرReferenceLookupStatus/EditorDialog. الحفظ يطابق المالك الحالي
بلاspinnerمنافس. paired start/finalize،failure/Retry والـaria-busy موجودة.
القياس وخططSQL والفهارس قبولمالك،ولاادعاءسرعةمنفحصالمصدر.

## الملكيات والتسليم

الجذر يملكhelper/service/registry/backend/DTO/mapper/guide/docs/inventory.
عامل مستقل يملكLeaseMasterAgreement/components/list/** فقط.
عامل ثان يملكLeaseMasterAgreement/components/details/** وroutes فقط.
عامل ثالث يملكLeaseAgreement/components/details/** وcreateoptionalcontext
فيخدمتها فقط،للمصدرالمضمن. لستوحيدًافيالشجرة؛احفظتغييراتالآخرينولاتكتب
خارجملكيتك. shared/backend/contractsعندالجذر؛أبلغأيconflictولاتخترعقاعدة.
التدقيقالمستقلوالدمجوالجردعندالجذر،ولاترقيةقبلإقفالالتوابعوالدليل.

لاschemaجديدة؛تظلSourceQuotationItemIdومخططهاالسابققبولمالكمسجلًا،ولا
إنشاءأوتعديلهجرةأوsnapshotهنا. الجردقبلالشريحة١٢٦/٧٥/٥٨/٢/٢=٢٦٣،retired7.
هدفالتطبيقالعامغيرمكتمل؛المواصفاتتُكتبولا تُشغّل،والقبولمجمعفيالنهاية.

## ملحق هوية الأب والمحرر التابع

حوار العقد يظل ظاهرًا عند سحب الصلاحية؛ مالك الحوار يحجب محتواه ويعرض حالة
المنع مع بقاء الإلغاء والإغلاق متاحين لتجاهل المسودة. لا تُربط خاصية الظهور
بإتاحة العملية ولا يُخفى إطار الحوار كله. تُخفى بياناته الحساسة بعنوان فرعي
محروس، ويظل الطفل مثبتًا حتى قرار إغلاق صريح.

إعادة استخدام مسار تفاصيل الماستر قد تنهي جلسة الأب دون تغيير هوية المصدر
المحفوظة في مسودة الطفل. لذلك يمرر الأب للمحرر القائم مدخلي المصدر الاختياريين
`sourcePublicationAllowed` و`sourceCancelled$`: أولهما callback ثابت يتحقق من
هوية الممثل والمستند المثبتين، وثانيهما إشعار تغيير المسار/انتهاء الجلسة.
الإشعار ينهي جلسة المصدر نهائيًا ويلغي قراءاتها وتوليدها وبواباتها، مع بقاء
المسودة والحفظ المرسل. لا يُربط بتقلب جاهزية القراءة أو busy أو سحب منحة
الممثل نفسه، حتى تظل استعادة المنحة تحت مالكها دون إنهاء هوية المستند.
المحرر الذي لم يتبنَّ مصدرًا يحتفظ بعقده السابق؛ لا مالك وصول موازٍ.
