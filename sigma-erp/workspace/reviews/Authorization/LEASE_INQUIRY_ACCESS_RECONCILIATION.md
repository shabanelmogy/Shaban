# متابعة مصالحة صلاحيات استفسارات التأجير

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| العقد | LEASE_INQUIRY_ACCESS_CONTRACT_FREEZE.md، Frozen |
| الحدود | Source-only؛ no build/tests/typecheck/lint/browser/DB/migration/snapshot/commit/push/deploy |

## المطابقة الخلفية والتكامل الجاري

المورد المشترك tenant بلا BranchId أو قيد مالي. View للقائمة والتفاصيل؛
Create مستقلة، Update/Delete مستقلتان. ChangeStage وGetLogs موجودتان
بالـreviewed catalogue أصلًا. أضاف root تبعية View لهما في الفلتر الحقيقي،
وصنف GetLogs وCarModel.GetMakeAndModelDropdown وContact.GetSelectByCompany
كقراءتين اختيارات وقارئ سجل whole-domain لا يحتاج تسجيل فرع. لا تغيير
لـnobranch guard العام أو grants لباقي الموردين. لا عملية تحويل quotation
أو referral ناتجة من شريحة الصلاحيات.

Helper موحد بالواجهة يحدد route entry =View أوCreate مع CarModel custom
lookup وStaff/Customer/VehicleType.Lookup. registry/start route تستهلكه،
والsidebar بمالك registry الحالي، مع فشل child routes غير الموجودة.
خدمة الميزة تقبل HttpContext اختياريًا على أربعة writes دون تغيير body/
URL أو feedback headers. اكتملت القائمة والمحرر والحوارات وتدقيقها المستقل.

أعمدة No/Date/CustomerName/CustomerCode/SalePersonName/LeaseInquiryStage
والنص المترجم تقابل ListVM الفعلية؛ Id للهوية. أزيلت وراثة audit/tenant/
GUID/activation غير المستهلكة من list/detail/item-detail بمالكي lean
الموجودين. DTO الرأس date/salePerson/customer/contact وأطفال model/type/
quantity/years؛ Add/Update inputs لا audit/calculated fields أصلًا. لا
AutoMapper جديد أو reverse mapping؛ الإسقاطات الصريحة تبقى المالك الفعلي.

GetManyAsync يحفظ stage=0، ويطبق tenant/live/search/date/customer/grid
ثم count ثم sort+Id/skip/take وprojection، pageSize<=200. أصلح root حد
dateTo=9999-12-31 فلا AddDays overflow؛ inclusive max يستوعب كل DateTime
المدعومة. ChangeStage يقرأ المرحلة الحالية ويتحقق من enum والnotes
ويضيف history ويحفظ مرة. Update يثبت ملكية IDs الأطفال وFKs قبل حفظ
aggregate؛ لا محاسبة أو mutation آثار فروع جديدة.

مواصفات root غير منفذة:١٢endpoint/catalog،٣classification،٦read/contract
وحالة registry. ليست نتائج runner أو compilation. الملفات source SDK
default inclusion ومراجع Helpers/Business/ServerAPI الحالية؛ لا مشروع جديد.

انتهى التدقيق الخلفي المستقل بلا findings مؤكدة، بما فيه ملحق تعطيل
activation غير المملوكة. قُرئت constraints للمتحكم/Service/IService
فعليًا: DetailVm:class ولا قيد ListBaseVm، فالإرث lean لا يحتاج تغيير
المستهلكين أو Mapper. مراجعة parent-child validation لم تغير السلوك.

متابعة إضافية: شُخصت HandleActivate الموروثة بلا حالة IsActive ضمن
عقد الشاشة أو مدخلاتها؛ رُفضت ب405 في الخدمة وأزيلت assignability
بUnsupportedActivation القائم. أضيفت حالتا catalog/service غير منفذتين
لمنع تعديل علم خفي بلا دورة أعمال. بقيت المرحلة ChangeStage مستقلة،
ولا CRUD مستقل للبند أو workflow تفعيل جديد. أضيفت مواصفتا HTTP بالواجهة
لبقاء stage=0 وسياق outcome لكل writes. لا تساوي كتابة المواصفات تنفيذها.

## بوابات المصادر والتحميل والأداء

| المصدر | التصنيف والعمر المطلوب | الحالة |
|---|---|---|
| List/Excel | operational مباشر، complete fetchAllPages applied query، page progress/cancel context | مكتملة؛ query المطبقة وstage=0 وfalse محفوظة؛ switchMap وsequence للصفحات وExcel مركب قابل للإلغاء |
| Details | operational fresh مباشر، local dialog progress/Retry/cancel | مكتملة؛ ترفض هوية مختلفة قبل patch، وتبقى المسودة mounted بعد denial مع منع إعادة hydration لسجل أو ممثل آخر |
| Customer.GetSelect | opted-in CustomerService cache، finite bootstrap ثم watch/invalidation/selected labels/context | مكتملة في القائمة والمحرر؛ watch مستقل يلتقط rapid revoke/regrant ويحفظ label الحالية لنفس actor حتى مع bootstrap فارغة |
| CarModel.GetMakeAndModel/Staff.GetSelect/VehicleType.GetSelect | direct بلا opt-in لهذا الإسقاط، required write sources | مكتملة؛ لا GET دون متطلب الكتابة، readiness تمنع Save، Retry لا تمسح IDs أو labels الحالية |
| Contact.GetSelectByCompany | operational customer-specific، optional grant، محفوظة label/ID دون GET محجوب | مكتملة؛ تبدأ بعد readiness للمصادر المطلوبة؛ recovery يعيد ربط watch والطلب دون تكرار، وتغيير العميل يمسح الاتصال السابق |
| GetLogs | operational read dialog، disposable expiry، local host | مكتمل؛ الإغلاق/expiry يلغي ويمسح viewer؛ لا regrant يعيد فتحه، وتبديل actor يمنع late result |
| Create/Update/Delete/ChangeStage | sent writes مستقلة، page progress، owner callback/HttpContext، terminal latch | مكتملة؛ outcome محروسة وهوية الجلسة وterminal success يسبقان النشر؛ لا replay أو toast قديمة |

## إقفال الواجهة والتدقيق

ملكا القائمة/المرحلة/السجل والمحرر سلّما ملكيات غير متداخلة، والجذر راجع
التكامل مع helper والخدمة والـregistry والخلفية والدليل. التدقيق الخلفي
المستقل بلا findings مؤكدة، وكذلك تدقيق list/stage/logs/routes. كشف تدقيق
المحرر أربع findings مؤكدة وأُصلحت ثم أعيد تدقيقها بلا ملاحظات متبقية:

- تجاهل المسودة المقبول terminal عبر discarded؛ لا Save/Add/Remove أو
  restore للنموذج إذا تعثرت مغادرة لاحقة، مع بقاء الخروج المحلي متاحًا.
- تُحفظ الاختيارات الحالية للمصادر الخمسة وIDs الخام، لا labels التفاصيل
  الأصلية وحدها، عبر سحب وإعادة المنحة في جلسة الممثل نفسه.
- يأخذ appMockData متطلب المحرر الفعلي؛ View وحدها لا تُبقي توليد/معاينة
  تعديل بعد سحب Update، وتبقى المسودة اليدوية تحت مالكها.
- subtitleRecordNo يشترط الوصول وهوية السجل المركبة، فلا يظهر رقم قديم
  بعد تبديل الممثل أو انتهاء جلسة الحوار خارج المحتوى hidden/inert.

اختبارات الواجهة المصدرية غير المنفذة:٣٦للقائمة والمرحلة والسجل والقالب،
و١٨للمحرر، ومواصفتا HTTP وحالة registry. لا يُدعى تشغيل test runner أو
RED/GREEN. public canDeactivate موصول من route إلى الطفل الفعال، ويشترك
مع Close في القرار نفسه؛ Create-only بلا قائمة أو customer filter GET،
والأفعال على exact current row object مع إعادة الفحص بعد confirmation.
لا aliases create/details مختلقة أو تحويل quotation/referral منفذ.

التحقق الأخير: parser/import existence لـ٢٥ملفًا/قالبًا بلا problems،
و٥٨مفتاح leaseInquiry في EN/AR موجودة؛ XML المشاريع الخمسة المرتبطة سليمة.
رُوجع scoped diff لكل مستودع وقرئت الملفات untracked مباشرة، وdiff --check
نظيف مع تحذيرات EOL فقط. recipe -Check للحزم الثماني OK. هذه فحوص مصدرية
ولا تثبت compile/typecheck أو التنفيذ أو سرعة/ظهور progress فعليًا.

No per-row HTTP أو SQL query من القائمة؛ Count ثم page بالتسلسل على
DbContext واحد. تفاصيل الرأس والأطفال تُسقط في query graph؛ عدد commands
الفعلي وSQL translation والتوقيت بحاجة owner measurement، لا نستنتجه
من مصدر LINQ. FK indexes conventions الحالية قد تغطي CustomerId و
LeaseInquiryItem.LeaseInquiryId؛ السجل يملك composite(SubscriptionId,
LeaseInquiryId,CreatedAt)، وتبقى tie-breaker Id في الترتيب. اقتراح index
سجل إضافي دون قياس قد يكرر التغطية؛ لا جديد. مرشح مقارنة للقائمة فقط
LeaseInquiry(SubscriptionId,Date DESC,Id DESC) INCLUDE(LeaseInquiryStage,
CustomerId,SalePersonId,No,IsDeleted) وفق حجم/plan فعلي وتكلفة كتابة/
storage؛ لا schema أو filtered IsDeleted=0 يستبعد null الحية ولا ادعاء
فائدة مقاسة. يفحص المالك الفهرس الحالي والخطة قبل أي ترحيل منفصل.

## التسليم والقبول

رُقي صف LeaseInquiry وحده بعد إقفال list/editor/actions/source/guide
والتدقيق المستقل؛ الجرد١٢٤/٧٧/٥٨/٢/٢ من٢٦٣ وخمسة tombstones. الدليل
lease-guide.ts تحت /UserGuide/lease بموضوعه القائم وentry الدليل في قائمة
التأجير؛ يغطي المنح المستقلة، Create-only، الاختيارات المطلوبة والاتصال
الاختياري، السحب/الإعادة والمسودة، Excel، المرحلة والسجل. لا موضوع أو route جديد.
لا schema أو هجرة مطلوبة. المالك يجرب في النهاية admin وView-only
وCreate-only ومنح stage/log/delete/edit مستقلة وtenant/revoke/regrant/
actor والـlookup failures/selected labels/dialog cancellation/sent outcomes/
الـExcel الكامل/التواريخ/RTL/themes/mobile والـloading/SQL. لم ينفذ شيء
من هذه الاختبارات في المصدر، ولا يُدعى إقفال هدف التطبيق العام.

اقتراحا commit دون تنفيذ: للواجهة `fix(lease): enforce inquiry workspace access lifetimes`؛
للخلفية `fix(auth): reconcile inquiry operations and read contracts`.
