# تسليم شريحة صلاحيات قائمة المركبات

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ٩ نوفمبر ٢٠٢٦ |
| النطاق | Fleet/Vehicle/components/list فقط؛ بقية الوحدة والتكامل والدليل والجرد عند الجذر |
| العقد | VEHICLE_ACCESS_CONTRACT_FREEZE.md وملحقه؛ لا تعديل حسابات أو بيانات أو schema |

## المنح والأفعال

أساس القائمة والبحث والترقيم والفرز والتقرير والطباعة وExcel هو
Vehicle.Search، مستقل عن Vehicle.View. لا مفتاح Report/Export مخترع.
المضيف mounted لكنه hidden/inert عند الرفض، مع حالة الرفض المشتركة.
تستخدم القائمة AccessViewPolicyService وAdministrativeDefinitionSession
وvehicleAccess المصدر الموحد الذي جهزه الجذر، ولا تقرأ snapshot إداريًا.

يفحص كل handler المنحة الحالية وbusy والسياق وعضوية كائن الصف الحالي؛
لا يقبل كائنًا منفصلًا لمجرد مساواة Id. الإنشاء يحتاج متطلبات create؛
والعرض View؛ والتعديل edit؛ والحذف Search/Delete؛ والحالة status؛
والتاريخ history؛ والتعرفة tariffRead مع hasTariff/vehicleTypeId.
التعديل والحذف للعادي يحتاجان CanTransact لفرع الصف الفعلي؛ لا يستنتج
BranchId من الاسم، والفرع null لا يسمح له بالكتابة. المدير يتبع عقد
العملية والخادم. الحالة والتاريخ والطباعة لا تشترط تسجيلًا على الفرع.

الحجوزات تمر عبر RouteAccessPolicyRegistry.allows للوجهة الفعلية
RentalBooking. تظل الوجهة غير المتبناة مغلقة للعادي ولو حمل Booking.View؛
لم يُخترع grant لها ولم يرق العامل مسارها أو مسار details البديل.

أعمدة القائمة والتقرير التفصيلي كما كانت: PlateNo، MakeName، ModelName،
VehicleTypeName، Color، Status، BranchName، KMs، Fuel،
NextRegistrationDate، NextInsuranceDate، FleetNo، EngineCapacity،
CustomField1. الموجز أول سبعة أعمدة بنفس المالك السابق. يستهلك نموذج
الصف هذه الخصائص ومعرف Id وBranchId nullable وVehicleTypeId وHasTariff
كأقل هوية/حالة إجراء. المنتج/النموذج يملكهما الجذر؛ لا DTO جديد من العامل.

## مصادر المرشحات والكاش

| المصدر الفعلي | المنحة | التصنيف والمالك | النتيجة |
|---|---|---|---|
| مصدر Branch/GetSelect عبر BranchService | Branch.Lookup مع Search | opted-in BaseService/ReferenceLookupCacheService | finite bootstrap ثم ReferenceLookupBindings/watchSelectList؛ refreshSelectList للإبطال/Retry؛ إبقاء label المختار في السياق نفسه |
| مصدر CarModel/GetMakeAndModel عبر CarModelService.getGetMakeAndModels | CarModel.GetMakeAndModelDropdown مع Search | قراءة مباشرة؛ لا opt-in | bootstrap/error/Retry مستقل؛ لا cache جديد |
| مصدر TariffGroup/GetSelect عبر TariffGroupService | TariffGroup.Lookup مع Search | قراءة مباشرة؛ لا opt-in | bootstrap/error/Retry مستقل؛ لا cache جديد |
| مصدر Vehicle/Search | Vehicle.Search مع grants للفلاتر الاختيارية المطبقة | قراءة تشغيلية مباشرة | paged list، unpaged output بنفس العقد؛ لا memo/cache |
| مصدر Vehicle/{id}/status-detail | Search/GetStatusDetail | قراءة تشغيلية محلية بالحوار | إلغاء عند الإغلاق أو سحب الوصول/تغير السياق، وRetry محلي |
| مصدر Vehicle/{id}/agreements | Search/GetAgreementHistory | قراءة تشغيلية محلية بالحوار المشترك | مصدر lazy يلتقط row/context ثابتين؛ gate وإلغاء من parent؛ لا منح داخلية جديدة بالحوار |

يفصل الطلب كل مصدر اختياري عن الآخرين؛ لا forkJoin يطلب مصدرًا محجوبًا
أو يحجب نجاح الباقي. لكل مصدر flags/error/Retry وwatch للوصول حتى بعد
اكتمال القراءة. الإبطال للـBranch مصدره الكتابات الناجحة في BranchService
والإشعارات/السياق لدى مالك الكاش، وليس مخزنًا محليًا جديدًا بالمركبات.
المصدر المباشر يبقى مباشرًا؛ إعادة محاولة مصدر لا تعيد المصدرين الآخرين.

عند denial أو تبدل actor/tenant/branch-access context تمسح raw/applied/URL
لمعرفات BranchId/CarModelId/TariffGroupId والخيارات والـbinding. تنقح
routeParams وطلبات الإخراج المعرفات المحجوبة قبل effects أيضًا. لا طلب
اختيارات عند غياب منحتها. بقية المرشحات النصية/التعدادات والتاريخ محلية.

## عمر الطلب والمضيف والإخراج

تبقى قائمة Subject/switchMap مع sequence وowner لكل قراءة. رفض الوصول
يلغي القراءة الفردية دون إنهاء trigger، وvisibleData ترفض السياق القديم
فورًا قبل انتظار effects. watcher يبقى بعد النجاح لمسح المخرجات القديمة.
تستهلك recovery مرة واحدة بعد regrant/context change وتنتظر انتهاء busy؛
فشل الطلب أو finalize لا يولدان retry loop. تظل قناتا خطأ النقل والأعمال
مقروءتين، والبحث المعتاد هو المحاولة الصريحة للقائمة.

التقرير/Excel يستهلكان query المطبق دون ترقيم مع Search ومنح الاختيارات
المطبقة. يحتفظ watcher مستقل بعمر الإخراج بعد الاستجابة، ويلغي إطار
ReportPrintSession المنتظر ويمسح printData ويفك freeze عند expiry؛ لا
طباعة قديمة عند regrant. طباعة الصف لا تطلب الخادم وتحتاج الصف الحالي.
الطباعة المفتوحة بالفعل يملكها المتصفح؛ لا ادعاء سحبها منه. لا تعديل
ترتيب أو تسمية أو نطاق أعمدة Excel.

الحالة تُغلق وتمسح selectedVehicle/statusDetail عند الرفض أو السياق؛
مصدرها يُلغى عند الإغلاق أيضًا. سجل العقود يستعمل الحوار المشترك القائم
وloading/error/Retry المحلي؛ يحرس parent إظهاره، ويلتقط row/owner قبل
مصدر lazy، ويلغي/يغلقه عند expiry حتى لو احتفظ grant الجديد بالقيم نفسها.
لا فتح للعقد المقابل من مجرد منحة تاريخ المركبة. منافذ Select/DatePicker
الملحقة بـbody تُغلق عند الرفض/تغير السياق والتدمير.

تملك LoadingService القراءة والقائمة والإخراج وDELETE عبر start/finalize.
يستخدم bootstrap كل مصدر ReferenceLookupStatus بمالك الصفحة، وrefresh
المحتفظ ببياناته صامت. أزيل table/search spinner المنافس مع إبقاء busy
وdisabled وaria-busy. تملك نوافذ الحالة/التاريخ StateMessage المحلي؛ لا
global start زائد لهما. إثبات route/shell visibility وقياسه لدى الجذر/المالك.

## الحذف المستقل والتنقل

قرار الحذف قابل للإلغاء بالمنحة/السياق، ويعاد فحص الصف وCanTransact
والمنح قبل الإرسال. يحرس canDeactivate القرار وDELETE الجاري فقط؛
أُرسل عقده للجذر لربطه بمسار القائمة. لا منع دائم للمغادرة ولا قراءة
تفاصيل إضافية أو DELETE ثانٍ. تمنع flags بدء قرار/عملية متداخلة.

يمر DELETE عبر trackWrite.context دون takeUntilDestroyed/denied بعد
الإرسال. يسجل نجاحه tombstone للحساب الثابت Id/tenant/ERP actor قبل
سياج النشر، فلا يظهر صفه أو يقبل عملية ثانية إذا عاد مصدر قديم بعد
regrant/تغير branch revision. السياج نفسه يحرس feedback العالمي والمحلي؛
callback حساب قديم لا تعيد تحميل حساب جديد أو تنشر خطأه. الإبطال في
الخدمة لا يعتمد على السماح بالنشر. لا file cleanup من قائمة المركبات؛
الوثائق وتجمعها يملكهما محرر/خادم المركبة.

## المطابقة والتحقق والحدود

قُرئ العقد الكامل وملحقه والمهارة والمالكون الفعليون، وشكل UI02 الذي
يحيل قائمة Workshop/Job. تطبق الحراسة UI26/28، والكاش UI2، والتحميل
UI22 والأفعال UI7. جمد الجذر مراجع Speed ودليلها وكودها وقرار Odoo؛ لم
يدع العامل قراءة مجموعة النوافذ المرجعية كاملة أو يبدل عقدًا ماليًا.

أضيفت ٢٠ مواصفة مصدرية غير منفذة تغطي: Search مستقلًا عن View، غياب
الاختيارات، الصف المنفصل والمنح المستقلة، وجهة حجوزات مجهولة، تنقيح
المعرفات، Retry/cache watch مستقلين، فشل مصدر مع بقاء نجاح غيره، actor
change وrapid revoke/regrant، status/history expiry، قرار الحذف وإعادة
فحص الفرع، DELETE مستقل وtombstone، branch read-only/null، label المختار
عند cache refresh، queued print وoutput بمصدر اختياري، وعدم إعادة فتح
حوار قديم أو تكرار DELETE. تظل مواصفة should-create السابقة كما هي.

فحص TS/HTML parsing ووجود local imports شمل أربعة ملفات وأعاد
problems:[]، وgit diff --check المحدد نظيف. روجعت الفروق الكاملة لملفي
TS/HTML، وقُرئ ملف المواصفات الجديد مباشرة. لا type checking أو نجاح
build/tests يُدعى. لا builds/tests/lint/browser/DB/migration/snapshot/
commit/push/deploy نفذت. لم يعدل العامل SCSS أو service/model/access/
registry/routes/shared/backend/guide. لا حاجة schema من هذه الشريحة.

يلزم الجذر التكامل مع المحرر والتعرفة وملفات Media والمنتج المستورد
والخادم والمسارات والدليل والجرد قبل ترقية الوحدة. لا قياس سرعة مثبت؛
إزالة دفعة lookups المحجوبة وتكرار retries تحسين مصدر فقط. لا index
مقترح من القائمة وحدها؛ تقييم predicates/plans عند عامل الخلفية والمالك.
قبول المالك: حساب Search-only؛ عمليات مستقلة؛ فروع قراءة/تسجيل؛ revoke
والتبديل بنفس grants خلال read/decision/delete/print/history/status؛
اختيارات/cache refresh؛ ثم desktop/mobile/RTL/light/dark دون تغيير CSS.

رسالة commit مقترحة فقط:
feat(auth): guard vehicle list operations, lookup and output lifetimes
