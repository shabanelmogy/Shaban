# تسليم صلاحيات أمر الشراء المضمّن من عرض التأجير

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| النطاق | `PurchaseOrderDetailsComponent` في وضع `embedded + leaseQuotationId` وخدمة إنشاء أمر الشراء فقط |
| العقد | `LEASE_QUOTATION_ACCESS_CONTRACT_FREEZE.md` بما فيه ملحق مرفقات مصدر PO |
| مسؤولية التكامل | الجذر؛ لا يثبت هذا التسليم اكتمال LeaseQuotation أو PurchaseOrder العامة |

## الملفات والملكية

عُدلت الملفات:

`F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/PurchaseOrders/PurchaseOrder/components/details/details.component.ts`

`F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/PurchaseOrders/PurchaseOrder/components/details/details.component.html`

`F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/PurchaseOrders/PurchaseOrder/services/purchaseorder.service.ts`

وأضيفت المواصفتان المصدريتان:

`F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/PurchaseOrders/PurchaseOrder/components/details/lease-quotation-source-access.spec.ts`

`F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/PurchaseOrders/PurchaseOrder/services/purchaseorder-source-access.spec.ts`

حُفظت التغييرات المالية المتوازية الموجودة مسبقًا في ملفي المكوّن، بما فيها
تبني `DocumentCurrencyComponent` والدقة النصية للعملة. لم تُعدّل القائمة أو
عرض LeaseQuotation أو helper أو registry أو routes أو النماذج أو الخلفية أو
الدليل أو المفردات أو الملاك المشتركين.

## المطابقة المصدرية

| الجانب | النتيجة في المصدر |
|---|---|
| مدخل الوصول | أضيف `accessRequirement` اختياري؛ لا يُستهلك إلا عندما يجتمع `embedded=true` و`leaseQuotationId` موجب، وبقية أوضاع PO تبقى على سلوكها الحالي |
| المتطلب | يستهلك المتطلب الممرر من الأب دون إضافة `PurchaseOrder.View` أو أي grant مساعد محلي |
| هوية الجلسة | تُثبت هوية الممثل ومعرّف LeaseQuotation عند التركيب؛ تبدل الممثل أو المصدر أو خفض مدخلات `embedded/leaseQuotationId/accessRequirement` ينهي الجلسة نهائيًا ويظل محجوبًا حتى لو صار المتطلب الحالي undefined |
| سحب المنح | يوقف قراءات المصدر والـlookups والـtax، يعطّل النموذج، يغلق Select/DatePicker/print portals ويحافظ على المسودة والـlabels الحالية؛ مراقب actor/context يبقى حيًا بعد denial حتى expiry/destroy |
| الاستعادة | watcher مستقل يُعاد تسليحه بعد كل completion؛ same-actor regrant يستأنف بعد busy tail فقط، ويعيد القراءات التي كانت ناجحة/جارية دون loop تلقائي لفشل HTTP |
| قراءة المصدر | مربوطة بالمتطلب والـsequence والممثل ومعرّف المصدر والتدمير؛ fresh reread لا يستبدل description/quantity المقفلة إذا تغيّر snapshot خلف المسودة |
| bootstrap | Supplier وBranch يبقيان finite bootstrap ثم `ReferenceLookupBindings` watch مع Retry والاحتفاظ بالاختيار؛ Common settings وtax والعملات تبقى عند ملاكها الحاليين |
| التخطي | وضع المصدر General يتخطى فقط Vehicle/Job/Item/AssetType/UOM bootstrap/watch ويترك الخيارات فارغة والحقول المصدرية readonly |
| التحرير | وصف المصدر وكميته وكل IDs غير المستهلكة مقفلة؛ يبقى سعر الشراء اليدوي والـsupplier/branch/tax/currency وفق العقد القائم |
| MockData والعملات | `MockData` و`DocumentCurrencyComponent` يستهلكان متطلب المصدر نفسه؛ generation/preview/deferred focus والنشر تُلغى أو ترفض عند انتهاء الجلسة، ولا تُحيا دورة الممثل القديمة بعد A→B→A |
| POST | `createOrder` يقبل `HttpContext` اختياريًا؛ source POST يستخدم `CAN_PRESENT_API_OUTCOME` وwrite lifetime مستقلة عن denied/destroy، ويثبت success latch قبل أي نشر |
| النتيجة القديمة | failure أو success القديم لا ينشر toast/error/navigation/close/print، وsuccess المرسل terminal فلا يعاد POST عند regrant |
| الخروج | `canDeactivate` العام يخدم الأب وClose؛ dirty discard متاح بعد denial، والقبول terminal ويشغّل تنظيف المرفقات عند توفر مالك الحذف |

## المرفقات الخاصة بالمصدر

| الجانب | النتيجة في المصدر |
|---|---|
| التخزين | وضع المصدر وحده يستخدم `PurchaseOrderDocuments`؛ بقية PO تستمر على folder القديم بلا ادعاء تبنٍ عام |
| الرفع والاستبدال | يتطلبان متطلب المصدر مع `Media.UploadMedia` و`Media.DeleteMedia`؛ غيابهما لا يمنع حفظ PO بلا مرفق |
| الحذف والتنظيف | إزالة path تحتاج متطلب المصدر و`Media.DeleteMedia`؛ tracker يحتفظ بملكية Media الفعلية منفصلة كي يستمر تنظيف orphan المرسل بعد سحب grant المصدر |
| المعاينة | لا يُركب `FileLink` للمصدر بلا `Media.ReadPurchaseOrderDocument`؛ وعند السماح يستخدم `protectedResource="purchase-order-document"` و`localReadProgress=true` مع متطلب المصدر |
| رابط عام | لا يوجد `FileLink` عام لمسار source draft؛ مورد القراءة الخاص هو المسار الوحيد المعروض في هذا الوضع |
| النشر | `FileField` يربط publication بالجلسة والممثل ومتطلب المصدر، بينما يبقى upload/cleanup المرسل تحت tracker وMedia owners |
| إسناد POST | وجود path في payload يتطلب منحتي upload/delete الحالية؛ source PO بلا attachments لا يحتاجهما |

يعتمد اكتمال هذا الجزء على مالك الجذر الذي أضاف/يضيف مورد
`purchase-order-document` في `FileLink`، وMedia endpoint/storage/static block
والتحقق الخلفي لمسارات `PurchaseOrderDocuments`. كما يجب على مالك
LeaseQuotation الأب تمرير متطلب المصدر الكامل إلى `accessRequirement`؛ هذا
الملف لا يملك ذلك consumer.

يوجد شرط إقفال مشترك مثبت لم يُعالج داخل هذه الملكية: `DocumentUploadTracker`
المقدم على المكوّن يضع `takeUntilDestroyed` داخل مصدر upload وداخل انتظار
cleanup، و`FileField` يضعه على subscriber أيضًا. لذلك يثبت المصدر استقلال
الطلبات عن **سحب grant المصدر** مع منع الخروج الطبيعي أثناء busy، لكنه لا
يثبت استمرار upload/cleanup بعد destruction فعلي للمكوّن. هذا يحتاج إصلاحًا
في مالك UI18 المشترك أو قبولًا/تسجيلًا صريحًا من الجذر؛ أما POST أمر الشراء
فنُفذ مستقلًا عن `denied` و`destroy` في هذه الشريحة.

## مصادر البيانات والتحميل

| المصدر | التصنيف والعمر |
|---|---|
| `LeaseQuotation/{id}/purchase-order-source` | قراءة dialog تشغيلية fresh؛ cancellable ومقيدة بالجلسة/الممثل/source id |
| `Supplier/GetSelect` | lookup opted-in؛ finite bootstrap ثم watch مستقل مع retained selected label |
| `Branch/GetSelect` | lookup opted-in؛ finite bootstrap ثم watch مستقل مع retained selected label |
| `SettingsCommonModel/GetMySetting` | singleton المشترك الحالي؛ يبقى required bootstrap |
| `Supplier/TaxRate/{id}` | قراءة policy تشغيلية مرتبطة بالـsupplier والجلسة؛ لا تنشر بعد denial |
| Currency policy/lookup/preview | داخل `DocumentCurrencyComponent` مع `accessRequirement` نفسه |
| `POST PurchaseOrder` | كتابة مستقلة بسياق عرض نتيجة محروس؛ لا `PurchaseOrder.View` ولا endpoint جديد |
| مرفق source | FileField/DocumentUploadTracker ثم private FileLink resource؛ grants اختيارية منفصلة عن إنشاء بلا مرفق |

لا توجد طلبات لكل صف جديدة، بل حُذفت خمس عائلات lookup من هذا الوضع. هذا
دليل شكل مصدر فقط، وليس قياس زمن شبكة أو SQL أو إثبات ظهور loader/watch في
التشغيل.

## المواصفات والفحوص

أضيفت **١٤ مواصفة مصدرية غير منفذة** تغطي: bootstrap المحدود، تخطي المصادر
الخمسة، revoke/regrant، source-id fence، actor fence، استقلال POST وسياق
النشر وterminal success، منح Media الاختيارية والمجلد الخاص وpreview grant،
إلغاء MockData عند input expiry، ومراقبة denial المتكرر ومنع إحياء جلسة
A→B→A، وحجب input downgrade لكل من source id/access requirement/embedded،
وdirty discard/orphan cleanup بعد denial، وتمرير `HttpContext` في الخدمة.

كُتبت المواصفات قبل تنفيذ الإنتاج، لكن حدود المشروع منعت تشغيلها؛ لذلك لا
يُدعى RED/GREEN أو نجاح test runner. فُحص TypeScript syntax للمكوّن والخدمة
والمواصفتين وAngular template syntax، و`git diff --check` والـmerge markers
وفحص absence لـ`PurchaseOrder.View` ومفاتيح lookups الخمسة من عقد المصدر.
هذه ليست typecheck أو build أو tests.

لم تُنفذ builds/tests/typecheck/lint/browser/DB/migrations/snapshots/commit/
push أو deploy، ولم يُستخدم أي وكيل فرعي.

## المتبقي عند الجذر والمالك

على الجذر مصالحة consumer الأب والـhelper/registry والخلفية وMedia owner والدليل
والـrecipes والجرد، ثم إجراء scoped diff review بعد دمج التغييرات المتوازية.
يلزم قبول المالك التشغيلي للمنح وrapid revoke/regrant، اختلاف actor/source،
انتهاء POST/رفع/تنظيف بعد الخروج، private download، orphan ownership، branch
registration، loader/Retry، portals، RTL والثيمين والمقاسات. تشغيل build/tests/
typecheck يبقى فقط عند تفويض المالك.

رسالة commit مقترحة عند دمج الواجهة بواسطة المالك:

`fix(lease): fence embedded purchase order source access`
