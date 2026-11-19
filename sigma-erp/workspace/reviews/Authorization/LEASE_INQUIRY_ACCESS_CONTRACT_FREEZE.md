# عقد تبني صلاحيات استفسارات التأجير

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| النطاق | Lease/LeaseInquiry الفعلية: القائمة والمحرر modal وتغيير المرحلة والسجل وExcel وحذف inquiry وبنودها |
| تفويض المالك | استكمال الصلاحيات دون أسئلة واختيار الأنسب؛ المراجعة مجمعة للنهاية |
| الحدود | Source-only؛ لا build/tests/typecheck/lint/browser/DB/migration/snapshot/commit/push/deploy |

## المصدر والشكل والمرجع

عقد LEASE_INQUIRY_DISCOVERY_CONTRACT_FREEZE السابق يملك الحقول والبنود
وقواعد الإضافة/التعديل/الحذف/المراحل؛ لا يعاد اختراعه من أجل الصلاحيات.
المسار الحقيقي يستورد Lease/LeaseInquiry/leaseinquiry.routes.ts وقائمة
تملك modal editor وstage/logs dialogs؛ لا child route أو alias حية أخرى.
النوع UI01 controlled modal بطفل واحد بلا totals؛ Backend master-detail
غير مالي BE14. Quantity عدد مركبات صحيح، PeriodYears عدد سنوات صحيح؛
لا تحويل إلى precision مالية/كمية كسرية. لا قيد أو حجز أو اتفاقية تنشأ
من الحفظ أو تغيير المرحلة. الدليل القائم موضوع Lease inquiries في
lease-guide.ts تحت /UserGuide/lease، ويحدث بمالكه بدل موضوع مكرر.

قُرئ دليل سبيد وفهرس الأصل ثم S248 (صفحة a95bc100c0f63163) لإدارة
الاستفسار وS220 (81e9d03556b4f363) لترقيمه. وقُرئت شاشة sidebar10-lease/
04-inquiries وC0868/C0866/C0865/C0869 من لقطة٢٨أكتوبر. تثبت الرأس
والبنود والبحث/view/edit/delete وstage مستقلًا والسجل، وتُطابق القائمة
والمحرر الحاليين. إعداد الترقيم من Settings مالكه المستقل ولا تمنحه
صلاحية inquiry. يُستبقى code-generated No من الخادم، لا payload audit.
يعلن سبيد فتح quotation من inquiry وبعض custom referral؛ لا منتج API
مستهلك لهما في Sigma الحالية ولا ضمن العقد السابق. يُسجلان gap وظيفية
مستقلة، لا grants أو تحويل خلفي مختلق في شريحة الصلاحيات. Odoo المكمل
للتأجير لا يحدد عقد Sigma لهذه التحويلات، ولا يحل محل مصدرها.

## المنح ونطاق الشركة

| السطح | المتطلب الفعلي |
|---|---|
| القائمة/البحث/reset/paging/sort/grid/Excel كامل/فتح العرض | LeaseInquiry.View |
| إنشاء modal وحفظ POST | LeaseInquiry.Create + CarModel.GetMakeAndModelDropdown + Staff.Lookup + Customer.Lookup + VehicleType.Lookup |
| التعديل وPUT | View+Update مع مصادر الإنشاء الأربعة؛ تفاصيل fresh وهوية المصدر |
| حذف | View+Delete مع exact current row object وتأكيد المصدر وهوية السجل |
| تغيير المرحلة | View+LeaseInquiry.ChangeStage، مستقلة عن Update |
| السجل | View+LeaseInquiry.GetLogs، مستقلة عن Update وChangeStage |
| عميل فلتر القائمة | View+Customer.Lookup اختيارية؛ لا طلب أو watch دونها |
| جهة اتصال العميل في المحرر | Contact.GetSelectByCompany اختيارية مع متطلب الكتابة وCustomerId الحالية |
| دخول route/menu/firstAllowedRoute | أي من View أو متطلب Create الكامل؛ Create-only يرى مدخل الإنشاء دون قائمة/فلاتر/بيانات محجوبة |

المفتاح CarModel.GetMakeAndModelDropdown من method name الفعلية، رغم أن
URL تنتهي GetMakeAndModel؛ لا key مخمن من الرابط. قائمة Staff وVehicleType
تعتمدان GetSelect العام→Lookup. التعريف والـitems والـstage history
مشتركة داخل tenant بحسب grants ولا BranchId؛ لا حاجة تسجيل فرع لمجرد
قراءة سجل. API global nobranch guard باقٍ، وكل query/write تستخدم
Repository tenant/live. تغيير المرحلة يتحقق من المرحلة الحالية ويؤرخها
في الخادم، لا يعتمد قيمة stage قديمة من الصف. الخادم يمنح العملية
الحقيقية ويحتاج View أيضًا لـGetLogs/ChangeStage ضمن هذا العقد؛ المدير
يمر بمالكه المعتاد ولا تتغير شروط العملية أو الأدوار الموقعة.

## القراءات والاختيارات والتحميل

قائمة GET وExcel composed complete مباشرة/تشغيلية بpage owner واحد؛
الـapplied query مستقلة عن raw draft، وتحفظ stage=0/false filters وCount/
page/URL. row links/actions تتحقق من عضوية الكائن نفسه لا clone بالمعرف.
لا eager filter lookup قبل grant، ولا تفشل القائمة بفشل اختيار اختياري.
Customer/GetSelect مصدر cache opted-in بCustomerService؛ bootstrap finite
ناجحة ثم watch منفصلة بReferenceLookupBindings، مع invalidation/context/
labels/Retry/clear/teardown وwatch دائم لإلغاء rapid revoke/regrant.

CarModel/GetMakeAndModel وStaff/GetSelect وVehicleType/GetSelect مباشرة
من خدمة الميزة القائمة دون opt-in لهذا الإسقاط؛ لا cache جديد مفترض.
Contact/GetSelectByCompany تشغيلية مرتبطة بالعميل؛ تعاد عند تغييره فقط
ضمن grant، وتحفظ قيمة/label محفوظة دون قراءة غير مسموحة. الغياب لا يحذف
ID محفوظًا من payload؛ تغيير customer يمسح Contact القديمة وفق العقد.
View يقرأ التفاصيل فقط ويستخدم saved labels؛ لا تحرير lookups أو policy
مالية جديدة. required sources تمنع Save قبل النجاح دون إسقاط المسودة.
القراءات dialog-owned تفاصيل/اختيارات/سجل تستعمل shared local progress
تحت overlay؛ Initial/filter required routed reads تستعمل الصفحة وفقUI22.
الكتابات تحت مالكها الحالي page progress وbusy دون مؤشر منافس. يصرح
route بـshowPageLoading=true. لا ادعاء سرعة من source wiring.

كل read مقيدة بالممثل/الـcontext/هوية inquiry والـsequence وdenied$/destroy/
dialog close؛ watcher بعد completion يلتقط السحب/الإعادة السريعة مع
recoveryPending تنتظر busy/finalize دون إعادة فشل HTTP تلقائيًا. تبقى
stateful editor وstage draft mounted hidden/inert عند denial، ولا تُمسح
أو تتبدل عند route/context reuse. logs disposable يغلق ويمسح فور expiry.
الأزرار والـbody portals وMockData/focus/deferred decisions تأخذ نفس
المتطلبات بمالكيها المشتركة. context جديد لا يقرأ/ينشر مسودة ممثل سابق.

## الكتابات والقرارات والتكامل

create/update/delete/changeStage المرسلة مستقلة عن destroy/denied، مع
trackWrite/HttpContext/CAN_PRESENT_API_OUTCOME وقفل نجاح قبل mayPublish
والهوية كي لا تعاد بعد regrant. لا Retry يعيد write آليًا أو toast قديم.
القرار مشترك lazy/cancellable، يعاد فحص المصدر عند التأكيد؛ المحلي
discard بعد denial متاح دون business write، والقرار المنتهي يصدر false.
كل child/remove focus وform freeze تُحفظ وفق نفس المالك وdirty contract.
رسالة نجاح واحدة من المالك القائم؛ لا toast محلي مكرر بجانب interceptor.

المحرر وstage يعرضان canDeactivate(): boolean|Observable<boolean> بقرار
dirty واحد مشترك مع Close؛ logs تستطيع الإلغاء والخروج أثناء read.
القائمة تربط CanDeactivateFn إلى child الفعالة عبر public API وتحمي قرار
حذف/Excel المرسل. بعد dispatch يمكن الخروج مع بقاء outcome مستقلة،
ولا يُحبس terminal success إذا مُنع نشرها. مخرجات closed/refresh من
جلسة قديمة لا تغير القائمة الجديدة. لا عنوان/تعديل/حذف للسجل بالـURL
المباشر غير الموجود؛ route root فقط حتى يثبت عقد آخر.

root يملك helper/service/registry/backend/guide/vocabs/docs والجرد.
عامل يملك components/list وstage-dialog وlogs-dialog وroutes؛ عامل آخر
يملك components/details فقط. public child canDeactivate ثابت أعلاه؛
أي تضارب يبلغ root دون كتابة في ملفات متداخلة. لا schema أو AutoMapper/
financial calculation جديدة. dateTo أقصى تاريخ يحافظ inclusive boundary
دون AddDays overflow؛ تصحيح owning filter فقط إن ثبت من المصدر.
الإقفال بعد source specs والتدقيق المستقل وكل الأفعال، ومطابقة الدليل
والترجمات وVM/payload وloading/cache/performance/index evidence.

ملحق DTO المصدرية: root يزيل وراثة audit/tenant/GUID/activation غير
المستهلكة من List/Detail/ItemDetail فقط؛ List يعلن Id/No، وDetail يعتمد
NumberedDetailBaseVm، وItemDetail يعتمد LeanDetailBaseVm. تبقى الحقول
المستهلكة والهويات وpayloads كما هي، ولا إخفاء مالي/صلاحية حقول مختلقة.
الإسقاطات الصريحة الحالية لا تعبئ هذه الحقول أصلًا، فلا تعيد كتالوجًا
أو حسابًا أو actor metadata من default inheritance. ثلاث حالات contract
مصدرية تثبت حدود DTO؛ لا يحتاج schema أو AutoMapper جديد.

ملحق العملية الموروثة غير المملوكة: لا IsActive في form/payload أو حالة
inquiry متفق عليها؛ المرحلة هي دورة المتابعة الوحيدة. HandleActivate
الموروثة كانت تستطيع تغيير علم غير ظاهر بلا دورة تفعيل للشاشة. تُرفض
هذه العملية فقط ب405 في LeaseInquiryService، وتضاف LeaseInquiry لقائمة
UnsupportedActivation الحالية كي لا يعلن الكتالوج grant تدعي دعمها.
لا تتحول stage إلى Activate، ولا تمنع generic View/Lookup الصحيحة.
لا CRUD مستقل لـLeaseInquiryItem مثبت بالخادم أو route في الواجهة.
