# تسليم صلاحيات محرر عروض أسعار التأجير

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| النطاق | `LeaseQuotation` routed Create/View/Edit و`details/:id` alias داخل `components/details/**` فقط |
| العقد | `LEASE_QUOTATION_ACCESS_CONTRACT_FREEZE.md` — Frozen |
| مسؤولية التكامل والترقية | عند الجذر؛ لا يثبت هذا التسليم اكتمال القائمة أو الأفعال أو الخلفية أو دليل الوحدة |

## الملكية والملفات

عُدلت ملفات المحرر التالية في مستودع الواجهة:

`SiGmaAngularFrontEnd/src/app/modules/Lease/LeaseQuotation/components/details/details.component.ts`

`SiGmaAngularFrontEnd/src/app/modules/Lease/LeaseQuotation/components/details/details.component.html`

`SiGmaAngularFrontEnd/src/app/modules/Lease/LeaseQuotation/components/details/details.component.spec.ts`

وأضيفت المواصفة المصدرية:

`SiGmaAngularFrontEnd/src/app/modules/Lease/LeaseQuotation/components/details/details-access.spec.ts`

لم تُعدّل الخدمة أو helper أو registry أو القائمة أو المسارات أو الحوارات أو
النماذج أو الخلفية أو الدليل أو الترجمة أو أي مالك مشترك. استُهلكت تعديلات
الجذر الجاهزة `leaseQuotationAccess` و`create/update(..., context?)` كما هي،
وحُفظت تغييرات الجذر والزملاء خارج الملكية.

## مطابقة العقد

| الجانب | التنفيذ المصدرّي |
|---|---|
| View وalias | يتطلبان `LeaseQuotation.View` وحدها؛ قراءة التفاصيل والطباعة لا تطلب أي lookup تحرير |
| Create | يتطلب `LeaseQuotation.Create` مع `CarModel.Lookup` و`VehicleType.Lookup` و`Customer.Lookup` دون إضافة View |
| Edit | يتطلب View+Update والمصادر الثلاثة، ويظل الحفظ تابعًا لحالة approval الحالية كما كانت |
| هوية الجلسة | يلتقط المحرر actor data context و`mode:id` عند التركيب؛ تبديل actor أو route mode/id يحجب الجلسة القديمة ولا يرطّب سجلًا بديلًا فوقها |
| الغلاف والبيانات الخاصة | المسودة المركبة hidden/inert/aria-hidden، والـsubtitle لا ينشر رقم العرض القديم؛ يوجد Close/Cancel محلي خارج الغلاف المحجوب |
| قراءة التفاصيل | مربوطة بالactor والroute key والsequence والمنحة؛ تلغى عند الانتهاء، وترفض `entity.id` المخالف قبل الترطيب، والمعرف المشوه لا يرسل GET |
| استعادة التفاصيل | pending read المسحوبة تستأنف مرة واحدة بعد regrant لنفس المالك؛ detail المكتملة لا تعاد فوق المسودة |
| Customer | finite bootstrap ثم `ReferenceLookupBindings` watch منفصل عبر `CustomerService`؛ rapid revoke/regrant يعيد bootstrap/watch مع حفظ الاختيار الحالي |
| CarModel/VehicleType | قراءتان مباشرتان finite بلا cache opt-in جديد، مع حفظ labels المحددة خلال الانقطاع وإعادة bootstrap |
| Contact الاختياري | `Contact.GetSelectByCompany` مع requirement الكتابة والعميل الحالي؛ غياب المنحة أو سحبها لا يرسل GET ولا يمسح ID/label المحفوظة أو payload، وتغيير العميل فقط يمسح الاتصال السابق |
| labels الحالية | تُلتقط خيارات customer/contact/model/type الحالية قبل clear؛ detail labels لا تعلو على اختيار جديد مختلف في نفس الجلسة |
| الأطفال | Add/Remove/EditableRows تعتمد `canEdit` نفسها وتُلغى قراراتها عند انتهاء route/access؛ لا منحة طفل أو سياسة مالية جديدة |
| MockData | يستقبل `mockDataAccessRequirement=requirement` الكامل للوضع الفعلي |
| التركيز والمنافذ | Select/DatePicker portals تغلق عند الانتهاء، و`focusField` مقيد بالمالك والroute والمنحة والتدمير |
| الطباعة | `ReportPrintSession` يتطلب View والسجل الحالي، ويلغي frame المؤجل عند route/access expiry؛ auto-print لا ينشر من جلسة قديمة |
| الحفظ المرسل | POST/PUT تستخدم `AdministrativeDefinitionSession.trackWrite` و`HttpContext/CAN_PRESENT_API_OUTCOME`؛ لا `takeUntilDestroyed` أو `denied$` على الكتابة المرسلة |
| نجاح الحفظ | `committed` يثبت قبل `mayPublish`، فيمنع replay بعد السحب أو تبديل actor/route حتى إذا حُجب navigation/feedback القديم |
| الخروج | `canDeactivate(): boolean | Observable<boolean>` عام ويستخدمه زر Close/Cancel والمسار؛ الخروج بعد dispatch لا يلغي الكتابة المرسلة، وView يلغي القراءة/الطباعة المعلقة |
| discard | القرار lazy وقابل للإلغاء؛ قرار محلي جديد متاح بعد denial، وقبوله terminal فيحجب Save/Add/Remove ويظل يسمح بالخروج إذا ألغيت محاولة الملاحة |
| العقود التجارية | بقيت حالة التحرير: customer approval Pending وinternal Pending/Rejected؛ بقيت الوحدات int32 موجبة والأسعار غير سالبة بمنزلتين، دون تغيير rate precision أو monthly contracts أو branch rules |

## مصادر البيانات والتحميل

قراءة التفاصيل والمصادر الثلاثة المطلوبة تستخدم مالك تحميل الصفحة الحالي مع
`finalize` وإلغاء route/access/destroy. Contact مصدر تشغيلي اختياري مستقل
بـloading/error/Retry خاص به ولا يمنع الحفظ عند غيابه أو فشله. Customer وحدها
opted-in cache؛ CarModel وVehicleType وContact لم تُمنح watch أو cache غير مثبت.
لا يوجد طلب لكل صف أو query/index/schema جديد، ولا يدعي المصدر قياس سرعة أو
ظهور loader فعليًا؛ قياس cold/warm وnetwork/SQL-plan يبقى قبول مالك.

## المواصفات والفحوص المصدرية

أضيفت **١٩ مواصفة وصول غير منفذة** تغطي استقلال View/Create/Edit، متطلب
MockData، تبدل actor وroute reuse، إلغاء واستعادة detail، rapid customer
cache وContact، حفظ IDs/labels/payload، الكتابة المرسلة وسياج النشر وsuccess
latch ومنع replay، الخروج بعد dispatch، terminal/local discard، إلغاء View،
رفض detail ID، المعرف المشوه وإلغاء الطباعة المعلقة. استُبدلت smoke spec
بمواصفة قالب حقيقية تستخدم `provideRouter` وHTTP testing وTranslate، وتثبت
hidden/inert/aria-hidden وحجب subtitle بعد تبدل actor. كُتبت المواصفات قبل
إنتاج التغيير، لكن لم تُشغّل؛ لذلك لا يُدعى RED/GREEN.

فُحص TypeScript parsing للمكون والمواصفتين بلا أخطاء تحليل، وAngular template
parsing بلا أخطاء، وحُلّت imports المحلية للملفات الثلاثة. فُحص
`git diff --check` للمجلد المنظور، ورُوجع scoped diff وملف المواصفات غير
المتتبع مباشرة. هذه فحوص مصدرية فقط، ولا تثبت type checking أو compile أو
runtime أو سلامة المواصفات عند التشغيل.

لم تُنفذ builds/tests/typecheck/lint/browser/DB/migrations/snapshots/commit/
push/deploy، ولم تُنشأ وكلاء فرعية. لم تُضف مفاتيح ترجمة أو CSS أو schema.

## المتبقي عند الجذر والمالك

يتولى الجذر دمج helper/service/registry/backend/list/actions/dialogs/PO/master/
guide/vocabs والجرد، ثم التدقيق المستقل ومصالحة الـdiff الكامل. قبول المالك
التشغيلي مطلوب للمنح وCreate-only وEdit state، وrapid revoke/regrant أثناء
read/cache/contact/write/discard/print، وroute reuse، وMockData والـportals،
والـRTL والثيمين والمقاسات وظهور تحميل الصفحة. يلزم تشغيل البناء والمواصفات
والتحقق النوعي فقط عند تفويض المالك؛ لا يدعي هذا التسليم نجاحها.

رسالة commit مقترحة عند دمج الواجهة بواسطة المالك:

`fix(lease): enforce quotation editor access lifetimes`
