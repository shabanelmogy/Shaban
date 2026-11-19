# عقد صلاحيات عروض أسعار التأجير وتوابعها

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| النطاق | LeaseQuotation list/routed Create/View/Edit/details alias، actions/rejection/master dialog وembedded PO Create من العرض فقط |
| التفويض | هدف الصلاحيات حتى النهاية؛ الاستمرار دون أسئلة واختيار الأنسب؛ تجربة المالك مجمعة |
| الحدود | Source-only؛ لا build/tests/typecheck/lint/browser/DB/migration/snapshot/commit/push/deploy |

## العقد والمراجع الحالية

LEASE_QUOTATION_FEATURE_REVIEW يملك دورة القرار الثنائية وأسعار الشهر
لكل مدة ومصدر أمر الشراء. فقرات٢٨أكتوبر تعتمد أمر شراء واحد General
بكل بنود المصدر وبسعر شراء يدوي، وفقرات٢٩أكتوبر تصحح monthly prices؛
تتقدمان على baseline أغسطس. لا تغيير للأرقام/العملة أو approval state أو
financial posting أو source-line policy من شريحة الصلاحيات. UI02 routed
editor (رأس وبنود وأسعار وtransitions) مع action dialogs؛ backend BE14.
تُستهلك UI26/28/22/2/7/13/14/18/21 والمالكون المشتركون، والمراجع من
الكتالوج Job list/routed shell وEditorDialog؛ لا شاشة أو wrapper بديل.

قُرئ Speed S182/c555b4b275c5325e وS222/ec4ae78bcbccc986 من٢٧أكتوبر؛
يثبتان الرأس والمركبات وأسعار الشهر حسب المدة والبحث/الحالة وملكية
ترقيم الوثيقة للإعدادات. ثم sidebar10-lease/05-quotations وشرائح C0878
من٢٨أكتوبر تثبتان approvals/export/master/PO تحت state eligibility؛
frontend reference لا يثبت server permission أو أثر محاسبي. التفصيل
المرجعي calculations/process/log غير منفذ بAPI Sigma لهذه الشاشة؛ يبقى
gap مستقلة لا action أو grant مخترعة. Odoo المكمل للquotation/rental
عام ولا يغير عقد monthly rates أو مصدر PO المعتمد؛ لا قرار ماديًا معلقًا.
لا screenshot جديدة، ولا اعتبار قالب قديم مصدرًا لعقد مالي جديد.

## مفاتيح الأفعال الفعلية

| السطح | المتطلب |
|---|---|
| root list/menu/Search/Refresh/Reset/paging/sort/Excel كامل | LeaseQuotation.View |
| view/:id وdetails/:id والطباعة | View؛ alias تفاصيل قراءة فقط |
| create route/POST | LeaseQuotation.Create + CarModel.Lookup + VehicleType.Lookup + Customer.Lookup |
| edit route/PUT | View+Update + نفس مصادر الإنشاء، والحالة canEdit/current server state |
| Delete | View+Delete + exact current row وcanDelete وإعادة فحص بعد القرار |
| InternallyApprove/InternallyReject/Revise/Unapprove | View+LeaseQuotation.ManageApproval + flag/tuple الحالي؛ reject reason5–500 |
| CustomerApprove/CustomerReject | View+LeaseQuotation.ManageCustomerApproval + flag/tuple الحالي؛ reason5–500 |
| optional customer list filter | View+Customer.Lookup؛ لا bootstrap/watch عند غيابها |
| optional contact editor | Contact.GetSelectByCompany مع write requirement وcustomer الحالية؛ ID محفوظة دون denied GET |
| Create master dialog | View+LeaseMasterAgreement.Create مع canCreateMasterAgreement؛ fresh quotation read وPOST للماستر لا master list grants |
| Create PO dialog | متطلب source PO الكامل أدناه مع canCreatePurchaseOrder؛ fresh source read وPOST، لا PO list/View grant لمجرد الإنشاء |

مفاتيح ManageApproval/ManageCustomerApproval من DocumentApprovalEndpointRules
الفعلية لا أسماء URL. BranchOperationRules يصنف GetPurchaseOrderSource
قراءة whole-domain بلا registration لمجرد المعاينة. العرض تعريف tenant-shared
بلا BranchId؛ الحساب العادي يحتاج branch عام وفق guard القائم. Create
لا تحتاج View، وfirstAllowedRoute تختار /LeaseQuotation/create عند اكتمالها.
المدير يمر بالصفة الموقعة وقواعد state/tenant/branch المعتادة. backend
يحتاج View بجوار native transition grant وGetPurchaseOrderSource؛ لا يغير
grant الخاص بPOST Create المستقل أو يمنح البيانات المالية من اسم الزر.

## مصدر أمر الشراء وحدود التبني

إعادة استخدام PurchaseOrderDetailsComponent القائم مع optional
accessRequirement خاص بالمستهلك embedded+leaseQuotationId، لا محرر موازٍ
ولا تبنٍ مزعوم لبقية PurchaseOrder. source entry requirement هو:
View+LeaseQuotation.GetPurchaseOrderSource+PurchaseOrder.Create، ومصادر
Supplier.Lookup/Branch.Lookup/SettingsCommonModel.GetMySetting،
Supplier.GetTaxRate وSupplier.View، وCurrency.GetFinancialNumberPolicy/
Lookup/PreviewConversion. هذا يوافق supplier/tax/currency المصدر الفعلي؛
لا نضيف PO.View أو subscription admin. الفرع المختار يحتاج التسجيل الحالي
بالخادم كما POST العادي؛ لا تحويل فروع أو تعيين branch للمصدر المالي.

مصدر General source-locked لا يستخدم Vehicle/Job/Item/AssetType/UOM
لتحرير وصف/كمية المصدر؛ يجوز تخطي bootstrap/watch هذه الخمسة فقط في
هذا الوضع، وإبقاء الخيارات الحالية الفارغة/readonly والنماذج كما هي.
supplier/branch references opted-in تبقى bootstrap finite ثم watch مع
clear/invalidation/labels/Retry/context. Common settings singleton والتوقيت
والـtax/currency owners كما هي؛ لا نشر value من actor سابق. بقية PO modes
دون optional input تحت عقودها السابقة، ولا توسع لإقفال وحدتها العامة.

المرفقات اختيارية وتحتاج Media.UploadMedia وMedia.DeleteMedia لإضافتها/
استبدالها وتنظيفها بDocumentUploadTracker وFileField permissions الحاليين؛
لا تفرض grant الرفع لكتابة PO بلا مرفق. لا اختيار طلبات شراء/Job source أو
GRN/Bill/approval من Create source mode. no replay/old publication عند
تبدل actor أو source، وتبقى sent PO/upload/cleanup outcomes مستقلة تحت
ملاكها الفعليين، مع terminal success/discard وroute parent canDeactivate.
أي private-file/API ownership فجوة مثبتة تُعالج في مالكها أو تسجل شرط
إقفال تابع؛ لا ادعاء سرية من FileLink بصري وحده.

## أعمار القراءة والكتابة والعقود

كل callbacks للأفعال تستخدم exact row object+current access+flags+nonbusy،
والتأكيد lazy/cancellable يعيد فحصها قبل dispatch. rejection/master/PO
مسودات mounted hidden/inert بعد denial، expired actor/id لا يعيد hydrate
أو publish. حوارات خرجها public canDeactivate مشترك مع Close/route؛ قرار
discard المحلي متاح بعد denial وقبوله terminal. reads تحت denied$/context/
sequence/destroy، وwatch وصول مستقل بعد completion يعاد تسليحه للrapid
revoke/regrant مع recoveryPending بعدbusy tail؛ لا loop failure retry.

create/update/delete/native actions/master/PO المرسلة مستقلة عن denied/
destroy، تمرر HttpContext/CAN_PRESENT_API_OUTCOME مع trackWrite. success
latch قبل mayPublish يمنع replay ولو حُجب الرد. failure/Retry محلية
بمالك واحد، ونجاح interceptor وحده؛ لا toast/navigation/print/refresh من
جلسة قديمة. root route reads/page bootstrap تستخدم page owner، dialogs
fresh reads local progress؛ Save/action page progress دون local duplicate.
route showPageLoading=true، ومصادر optional لا تفشل الشاشة الأساسية.
MockData/print/deferred focus/body portals تخضع لنفس feature requirement
وهوية الجلسة؛ print session يلغى قبل output عند expiry.

Customer.GetSelect opted-in cache عبر CustomerService، finite successful
bootstrap ثم separate ReferenceLookupBindings watch. CarModel/GetSelect
وVehicleType/GetSelect direct بلا opt-in لهذه الخدمة. Contact التشغيلية
مرتبطة بالعميل؛ لا تغيير saved contact حين تسحب lookup، وتغيير customer
يمسح الاتصال القديم. يُحتفظ بـcurrent selected labels لنفس actor دون
إرجاع original detail labels فوق اختيار جديد. View بلا write lookups.

ListVM يقتصر على أعمدة No/Date/CustomerName/CustomerCode/internal/customer
approval، وId وflags الفعلية. تُزال inherited audit/default identity fields
غير المستهلكة وCustomerId إن لم يُستهلك. Detail/items تقرأ lean required
head/labels/items فقط؛ إذا nested Partner/Contact DTO يسرّب غير مستهلك
يُستبدل بإسقاط labels محدود مع كل consumer source/print/master معًا.
يحافظ backend على tenant/live لجميع الأطفال والـFKs في update/delete/
detail/approval/read source، ولا تضعف source invariant أو precision.
لا schema أو migration لهذه الشريحة؛ كل الأسعار غير سالبة بمنزلتين
كما العقد، والوحدات int32 موجب، ونطاق معدلات الحساب الحالي باقٍ.

## الملكيات والإقفال

ملحق مرفقات مصدر PO: ثبت أن folder القديم purchaseOrder يخزن ملفات عامة
بلا record/branch read boundary؛ لا يكفي إخفاء الرابط. مصدر الإنشاء المعتمد
يستخدم من الآن folder خاص PurchaseOrderDocuments عبر private FileStore
ومورد FileLink المغلق purchase-order-document؛ لا نقل أوحفظ ملفات قديمة
لأن البيانات تجريبية. root يملك هذا الامتداد المحدد بـMedia endpoint/
path/storage/access وstatic rejection وقراءة الملف، وworker PO يستهلكه
في source mode فقط (FileField folder+FileLink protectedResource). مفتاح
Media.ReadPurchaseOrderDocument مستقل واختياري للمعاينة، مع متطلب المصدر.
الخادم يتحقق من مالك draft+PO.Create أو PO.View وكل فروع أي PO حي مرتبط؛
الحذف الفيزيائي يقبل orphan المرفوع بيد الممثل فقط ويمنع أي ملف مرتبط
بسجل حتى لو كان محذوفًا، فلا history fallback مخترع. source POST يتحقق
من مسار tenant/uploader/storage وعدم إعادة استعمال ملف مربوط، وMedia
upload/delete grants القائمة لازمة لإسناد مرفق جديد. لا schema جديدة،
ولا claim اكتمال مرفقات PurchaseOrder القديمة أو وحدتها العامة من هذا
الامتداد. يُوثق resource الجديد بمالك UI18/skill وتُجدد recipes عند الحاجة.

لمنع فقد دليل الملكية من منافذ PO القديمة، لا يقبل Create آخر المسارات
الخاصة الجديدة، ويحتفظ Update بمجموعتها الخاصة المحفوظة كما هي (لا إضافة/
إزالة/استبدال) حتى تُعتمد ownership history في وحدة PO. الحذف المنطقي
يبقي الوثائق مرتبطة ولا يبيح DELETE فيزيائي. هذه قاعدة حفظ ownership
لملفات الخصوصية الجديدة، لا محاولة الاحتفاظ ببيانات تجريبية قديمة، وتُذكر
في دليل المصدر وقبول المالك. لا يُدعى اكتمال إدارة مرفقات PO العامة.

ملحق تصحيح المصدر: وجود PO حي يستهلك العرض على مستوى الشركة، حتى إن
كان فرع PO خارج إسنادات الممثل. flags/source/unapprove تعيد إثبات الوجود
بـIgnoreQueryFilters مع tenant/live/sourceId صريحة وإسقاط existence فقط؛
لا تُرجع حقول PO أو تفتح فروعه. يبقى POST محروسًا بفروع التسجيل، ومصدر
الإنشاء تحت قفل LeaseQuotation الفعلي. هذا يصحح predicate التبعية ولا
يغير اعتماد الأمر الواحد أو المصدر المالي أو يضيف grant قراءة PO.

root يملك helper/service/registry/backend/VMs/guide/vocabs/docs/inventory
والتكامل. ملكية list/**+rejection-dialog/**+master-agreement-dialog/**+
leasequotation.routes.ts مستقلة عن details/**. ملكية ثالثة فقط PO details/**
وPurchaseOrder service optional context/source-mode access، فلا overlap.
LeaseMasterAgreement service create optional context عندroot. لا يكتب
العاملون shared أومصادر مالية/backend خارج الملكية؛ preserve peer changes.
كل قرار متضارب يبلغroot؛ لا أسئلة للمالك أو إعادة approval محسومة.

لا ترقية LeaseQuotation قبل إقفال كل الأفعال بما فيها downstream source
editors، والguide والتدقيق المستقل وparser/imports/translations/XML/diff.
لا ترقية PurchaseOrder العامة من هذه التبعية وحدها. الجرد عند البدء
١٢٥/٧٦/٥٨/٢/٢=٢٦٣،retired=7. التوقيت/SQL-plan/index evidence وbranch/
roles/RTL/themes/viewport/portals وجميع runner/build/HTTP قبول مالك بالنهاية.

## ملحق إقفال أعمار المخرجات —١٠نوفمبر

ثبت بالتدقيق أن grant المسار لا يثبت هوية المستند المفتوح. يمرر كل محرر
مُضمن/حوار تابع متطلبه إلى MockData مع callback لهوية الجلسة وnotifier
لانتهائها؛ يحتفظ المالك المشترك بمراقب المنح حتى بعد اكتمال preview، فلا
تُحيي إعادة المنحة candidates سابقة. المصدر المنتهي لا يتحول إلى محرر
عادي إذا أزيل sourceId أوaccessRequirement أوembedded. مراقب الممثل
يبقى بعد أول permission denial حتى يلحق A→B→A السريع بلا دورة رسم.

طلب رفع مرسل يحتفظ بنتيجته بعد تدمير الحقل والمحرر؛ يمنع tracker اشتراك
رفع جديد بعد تدميره. مصدر العملية الواحدة يحتفظ بالنجاح والخطأ دون reset
لئلا تُعيد subscription لاحقة POST بعد فشلها؛ retry الصريح عملية جديدة.
تدمير tracker يلغي انتظار التنظيف الخامل، ولا يبدأ DELETE بعده ولا يلغي
DELETE مرسلة. لا يتضمن ذلك durable orphan recovery أو تنظيفًا تحت ممثل بديل.

الإسقاط lean يحفظ تسمية الماركة والطراز فيName واحدة، مع حراسة الماركة
بالشركة والحذف؛ لا يفقد معلومةmakeAndModel التي كانيعرضها DTOالقديم ولا
يرجع رسمه البياني. تم حذف fallbackحقول Angularالتي لم يعديعيدهاالخادم.
حد سبب الرفض5–500 بعدTrim في الواجهة والخادم، بدل حدrawمختلف بالtextarea.
