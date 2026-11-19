# مطابقة صلاحيات الفوترة وإعدادات الفواتير

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| العقد | [العقد المجمد](BILLING_ACCESS_CONTRACT_FREEZE.md) |
| النطاق | تقرير BillingInvoice، محرره المنفرد وروابطه القديمة، وقائمة ومحرر BillSettings والخدمة الفعلية |
| الحدود | Source-only؛ المواصفات مكتوبة دون تنفيذ، ولا قبول بناء أو تشغيل ضمن هذا السجل |
| بوابة الإقفال | انتهت مطابقة المصدر والتدقيق المستقل للنطاق؛ قبول التشغيل مجمع للنهاية |

## نطاق المطابقة وقراراتها

هذه شريحة صلاحيات، وليست إعادة تصميم للفوترة المالية. التقرير يبقى تقريرًا
بكامل السجلات المطابقة وترقيم محلي وإجماليات الخادم، والمحرر المنفرد يبقى
مساري create وdetails الحاليين. لا منحة افتراضية من اسم الدور ولا اعتماد
على إخفاء الزر وحده. الإعدادات سجلات متعددة فعلية؛ لم يثبت مصدرًا أنها
singleton. كلا الكيانين EntityBase بلا BranchId، فهما مشتركان داخل الشركة؛
صلاحية العملية ونشاط المستخدم وربط الشركة والجلسة يظلون عند المالكين
الخلفيين. لا فرع يُخمن لهما من شاشة أخرى أو من بيانات التجربة.

الطبقات: تقرير UI07/BE5، ومحرران بسيطان مع إبقاء routes الحالية وفق العقد
المجمد. لا تعديل دورة VAT أو دفع أو تسوية أو ترحيل، ولا تغيير سياسة عددية
لتنفيذ منحة شاشة. المبالغ number في النقل القديم وdecimal في الخادم، وهي
قيم مستقلة؛ لا تُشتق TotalAmount من Amount/Vat. القيم التجريبية لا تستدعي
fallback أو backfill، ولا يتضمن العمل حذفًا أو إعادة تهيئة بيانات.

## المنح والمسارات والطلبات

| السطح/الإجراء | المنحة | المنتج/المستهلك والدليل |
|---|---|---|
| تقرير الفوترة وRefresh وCategory وTabs/ترقيم محلي | BillingWorkspace.Get | BillingInvoice/components/list → BillingWorkspaceService.get → GET BillingWorkspace → BillingWorkspaceController.GetAsync → ReviewedPermissionOperations |
| إنشاء فاتورة منفردة | BillingInvoice.Create | /BillingInvoice/create → DetailsComponent.create → POST BillingInvoice؛ لا يلزم View أو قراءة التقرير |
| عرض فاتورة محفوظة | BillingInvoice.View | /BillingInvoice/details/:id → GET BillingInvoice/GetByWithNavigationsId/{id}؛ View لا يتيح الكتابة |
| تعديل الفاتورة | View+Update | enableEditing/save → PUT BillingInvoice؛ هوية السجل المحمل والممثل والمسار محفوظة |
| حذف الفاتورة | View+Delete | تأكيد مشترك ثم DELETE BillingInvoice?id=؛ Delete مستقل عن Update |
| قائمة وعرض الإعدادات | BillSettings.View | /BillSettings و/details/:id؛ منتج عام tenant/live، والمراجعة النهائية أدناه |
| إنشاء الإعدادات | BillSettings.Create | /BillSettings/create؛ المدخلان التجاريان فقط |
| تعديل/حذف الإعدادات | View+Update / View+Delete | المنحة وهوية السجل والتأكيد والحفظ مستقلون؛ قيد المطابقة النهائية |
| القائمة والبداية والروابط المباشرة | سياسة المسار نفسها | billing-access.ts → RouteAccessPolicyRegistry → currentAccessGuard/sidebar؛ unknown roots مغلقة للعادي |

تُربط العمليات العامة في PermissionEndpointResolver بالفعل؛ GetById/
GetByIdWithNavigations/GetList→View، Add→Create، Update→Update، Remove→Delete.
العملية BillingWorkspace.Get ثابتة في ReviewedPermissionOperations وصُنفت
WholeDocumentReads في BranchOperationRules. لا منحة مخترعة لـPay/Clear/
receipt/print/export، ولا activation input يسمح بتجاوز Activate.

## الحقول والعقود والحسابات

| السطح | الحقول المرئية | عقد النقل/القرار |
|---|---|---|
| التقرير | InvoiceNo/Category/Date/Period/Description/Amount/Vat/TotalAmount/Status | BillingWorkspaceInvoiceDto يطابق التسعة ويضيف Id فقط؛ أقسام كاملة وOutstandingTotal/OutstandingCount/ClearedCount/UnclassifiedCount |
| المحرر المنفرد | InvoiceNo/Date/Period/Description/Amount/Vat/TotalAmount | BillingInvoiceCreateDTO والمدخلات التجارية السابقة؛ Update يضيف Id ويحافظ InvoiceType/Status/BillingCategory المحملة غير المعروضة؛ create defaults السابقة 0/0/null |
| تفاصيل الفاتورة | الحقول السبعة والهوية وحالة الاحتفاظ الداخلية | BillingInvoiceDetailVM يرث LeanDetailBaseVm؛ أزيل audit/tenant/IsActive من الاستجابة المستخدمة |
| إعدادات الفواتير | Id/CostCenterRequired/CustomFieldOneIsMandatoryInBill | ListVM وDetailVM مقتصران على الأعمدة والمدخلين؛ لا أعمدة منتجات وهمية أو حقول تدقيق في المسودة |

التاريخ يستخدم DatePicker/date-utils الفعليين، ويحفظ تاريخًا محليًا دون Z.
الأعداد/Id صحيحة؛ المبالغ مال وليست QuantityInput. التخزين الحالي المعلن
decimal(18,2)، ولا يعد اختبار InMemory لصيانة قيم النقل دليلًا على تخزين
كسور أعلى على SQL. قُرئ FinancialNumberPolicy وConfigureConventions؛ لا
precision/schema أو formula جديدة في هذه الشريحة.

خرائط BillingInvoice الحالية تحتفظ بتصنيف الفاتورة عند null وفق العقد
السابق؛ لا تحرير التصنيف من الواجهة الحالية. BillSettingsProfiler يقتصر
على خرائط Entity→List/Detail وAdd/Update→Entity؛ جرى تصحيح Add المفقودة
وإزالة ReverseMap/duplicate غير المستهلكة. الخدمات العامة بلا override
تجاري جديد: قواعد ملكية الشركة والحفظ والتدقيق والحذف عند المالك العام.
الـoverride الوحيد الجديد هو MaterializeListAsync في BillSettingsService:
يُسقط الحقول الثلاثة بعد paging بدل تحميل Entity/audit بالكامل؛ نفس
tenant/live/grid/count/order محفوظة. تبقى خريطة Entity→List مستخدمة من
الـgrid whitelist العامة، ولا override للحفظ أو DTO جانبية جديدة.

ملاك العرض والتفاعل المشتركون مستهلكون فعلًا: FeatureTitle وPrimaryAction/
DataTable وStateMessage وConfirmationDialog وLoadingService وdate-utils
وAccessViewPolicy/RouteRegistry وAdministrativeDefinitionSession.trackWrite.
لا CSS palette أو wrapper موازٍ ولا lifecycle service جديدة. ربط route/
record/payload لكل محرر يبقى محليًا بعقده؛ لا تُعمم الحقول المالية أو
طريقة حفظ التصنيفات على boolean settings لمجرد تشابه حراسة الوصول.

## العمر والقرارات والكتابات

المحرر المنفرد يحفظ owner/mode/id/routeKey، ويلغي القراءات القديمة، ويبقي
المسودة mounted ومحجوبة عند انتهاء الوصول. لا تُحمّل هوية جديدة فوق
مسودة dirty أو كتابة مرسلة. watcher الوصول يبقى بعد الاستجابة؛ استعادة
الوصول تنتظر busy عبر recoveryPending وتستهلك فرصة واحدة دون تكرار خطأ
HTTP تلقائيًا. إغلاق overlays وتركيز الحقل المؤجل محكومان بالسياق والإلغاء.

الحفظ والحذف مستقلان بعد الإرسال ولا يلغيهما destroy/denied. latch النجاح
يسبق فحص mayPublish، ويُمرر CAN_PRESENT_API_OUTCOME عبر HttpContext لمنع
إظهار نتيجة حساب منتهٍ. لا تكرار لكتابة ناجحة عبر Retry. قرار الخروج lazy
ويُعاد فحص busy عند الاشتراك، ويلغى عند expiry؛ local discard جديد يبقى
متاحًا بعد denial، ويصدر false عند الإلغاء. قبول discard يبقى terminal
حتى لو منع guard آخر المغادرة. Create-only يرجع إلى وجهة مسموحة أو /access
بدل العودة إلى نفس صفحة create المنتهية.

التقرير يمسح النتائج synchronously عند expiry عبر watcher وvisibleReport،
ويمنع نتائج الحساب السابق قبل effect. تغيير الممثل يصفر category/tab/data؛
التبويبات والترقيم محليان دون GET إضافي. scroll المؤجل له watcher مستقل
يلغيه نهائيًا حتى في revoke/regrant سريع.

قائمة الإعدادات حُرست بالمنح الفعلية وlistOwner، مع visibleRows تمسح
فورًا عند expiry. watcher يبقى بعد اكتمال القراءة ويلتقط revoke/regrant
السريع؛ refreshPending تنتظر read/decision/write busy ثم تقرأ مرة واحدة.
تأكيد الحذف lazy ويعاد فحصه بعد تحرير confirming، فتُمنع double execution
دون تعطيل الحذف الموافق عليه. WeakSet للسجل القديم تُسجل نجاح DELETE
قبل publication حتى لا يُعاد من نفس object؛ لا يُلغى الطلب المرسل أو
يُحدّث حساب آخر. refresh بعد finalize يراجع count وصفحة النهاية، ويحفظ
الفلاتر/الفرز بالخادم بما فيها false. خطأ envelope/HTTP له مالك محلي واحد،
ولا retry تلقائي عند failure. جدول القائمة disposable عند denial؛ لا
درافت محرر داخله تُفقد، والمحرر نفسه مستقل ومحتفظ بحياته.

محرر الإعدادات تسلّم ودُقق مستقلا دون finding مؤكدة. يطبق نفس حدود
actor/route/read/sent-write/discard السابقة على الحقلين فقط، ويستقبل قصد
Edit من القائمة بعد detail مطابق ومع View+Update. يحمل المساران mode
وCanDeactivate؛ Create-only يخرج إلى /access إذا لم توجد وجهة أخرى،
والعنوان Create/View/Edit مع Id السجل المحمل. mutations concrete ترسل
سياق النشر ورأس الخطأ المحلي، وDELETE يحمل query id. لا بيانات audit
أو state controls بديلة عن منح الخادم.

## التحميل والكاش والأداء

| المسار/الطلب | المالك المرئي والعمر | الكاش وحجم العمل |
|---|---|---|
| GET BillingWorkspace | LoadingService page start/finalize داخل الاشتراك؛ cancel/HTTP/false/success تُحرر العداد؛ أزيل inline spinner المنافس | operational direct، لا cache opt-in أو watch مصدر؛ aggregate query ثم projection كاملة مرتبة Date DESC/Id DESC |
| GET BillingInvoice details | page start/finalize وإلغاء route/denied/destroy + owner/sequence | operational identity read؛ لا lookup أو N+1 أو كاش جديد |
| POST/PUT/DELETE BillingInvoice | page start/finalize؛ independent sent write وbusy/error باقون | لا cache/إعادة إرسال؛ interceptor واحد لنجاح مسموح وinline error مع X-Skip-Error-Interceptor |
| قائمة/حذف BillSettings | page start/finalize؛ read ملغاة وsent delete مستقلة، ولا table mask منافسة | operational direct؛ GetManyAsync يحسب Count قبل Skip/Take، مع فرز ثابت وفلاتر projection قبل العد؛ لا local filtering على صفحة مبتورة |
| تفاصيل/حفظ BillSettings | page start/finalize؛ read ملغاة وsent POST/PUT/DELETE مستقلة؛ busy/error/Retry دون spinner ثانٍ | operational identity read؛ إنشاء بلا GET، بلا كاش جديد أو lookup مخترع |

لا suppress لـshowPageLoading في مسارات الفوترة؛ مضيف الصفحة في shell
يبقى مالك الظهور وفق UI22. هذا إثبات wiring من المصدر، لا معاينة overlay
أو قياس زمن. لا lookup sources أو كاش مرجعي/TTL/invalidation جديد تستدعيه
الشاشات الحالية. نجاح الكتابات لا يُعرض على جلسة منتهية ولا يعاد تلقائيًا.

قراءة التقرير تستخدم QueryReport<T> no-tracking مع tenant/live fail-closed،
ونفس status/category population للإجماليات والسجلات. تشمل Open و
OpenOverAllocated وClosed وتستبعد Voided، دون حد مائة صف العام. الاستعلامان
متتاليان دون وعد transactional snapshot؛ قد تختلف اللحظة تحت كتابة متزامنة.
حجم التقرير الكامل قابل للنمو، وهو عقد سابق؛ لا يُخفى cap لمعالجة ذلك.

قُرئت Configuration/BillingInvoiceConfig وBillSettingsConfig وقسم كل كيان
فقط من أحدث Designer موجود بتاريخ٩نوفمبر؛ PK(Id) فقط معلن فيهما، دون
ادعاء غياب فهارس مطبقة خارجيًا. اقتراح قابل للقياس لا يغير المصدر:

| الطلب | مفاتيح مرشحة وINCLUDE/filter | الفائدة والتكلفة والقرار |
|---|---|---|
| تقرير BillingInvoice دون category | (SubscriptionId, Date DESC, Id DESC) INCLUDE (Status, BillingCategory, TotalAmount, IsDeleted) بلا filtered predicate | فرضية تضييق tenant وتقليل sort مع بقاء nullable IsDeleted != true؛ lookup لبقية النصوص يظل. insert/write/storage إضافية؛ SQL plan/cardinality/IO عند المالك قبل اختيار index |
| تقرير category فقط | (SubscriptionId, BillingCategory, Date DESC, Id DESC) INCLUDE (Status, TotalAmount, IsDeleted) بلا filter | بديل للمقارنة إذا filter انتقائي؛ لا تنفيذ الاثنين آليًا ولا INCLUDE لكل DTO أو نصوص max. لا يخدم suffix Date بنفس الكفاءة في all-types؛ قارن workload فعليًا |
| هوية الفاتورة/الإعدادات وقائمة الإعدادات الصغيرة | لا فهرس جديد مطلوب من هذه الشريحة | PK يغطي الهوية، ولا volume/plan يثبت فائدة index آخر للإعدادات؛ حدود tenant/live تبقى. أي فهرس لاحق يحتاج قرارًا ومخطط المالك |

قبول الأداء: نفس tenant/data volume/category، cold/warm، حجم response،
عدد SQL commands وIO/actual plan ووقت API/render. لم تُقَس قبل/بعد؛ إلغاء
قراءة غير مصرح بها لا يثبت تحسن سرعة مقاسًا.

## المرجع الوظيفي ودليل المستخدم

دليل Speed الأصلي S159/صفحة811e27125ce449ac، وsidebar Billing لقطة٢٨أكتوبر
وC0651 الكامل ومرجع القراءة السابق المؤرخ موثقة في العقد المجمد. التصنيف
والأقسام والعدد والحالة والقيم matched للعقد المحلي. print/payment detail/
Stripe/payment/renewal فجوات مرجع محددة تحتاج API/عقدًا ماليًا ومنحًا قبل
تنفيذها، وليست actions مخفية باسم الصلاحيات. Odoo entry والمصفوفة لا
يحسمان تفويض billing التجاري؛ لا استبدالهما بمصدر قواعد خلفية غير موجودة.
لا screenshot جديد supplied لهذه الشريحة.

دليل التطبيق:
`src/app/modules/UserGuide/content/billing-guide.ts`، والroute
`/UserGuide/billing` ومدخله تحت Billing. مواضيع التقرير والإعدادات والمحرر
المنفرد ثنائية اللغة، مع فصل Get/View/Create وتفسير القيم المحفوظة وعدم
وجود payment workflow. الموضوع القديم الوهمي للإعدادات يُستبعد محليًا من
RECORD_LIST_TOPICS بدل تغيير شاشات أخرى. يطابق موضوع الإعدادات خيارات
القائمة الحقيقية وفلاتر الخادم وفرزها وصفحاتها وCreate-only المستقل.
قراءة/طباعة/RTL/themes/mobile للمرشد قبول المالك.

## التحقق والإقفال

راجع الجذر محرر الفاتورة source/specs مباشرة بما فيها untracked؛25حالة
وsmoke واحدة غير منفذة. راجع عامل مستقل التقرير/backend/registry/sidebar/
guide read-only دون findings مؤكدة؛ لم يراجع محرره بنفسه أو يتداخل مع
إعدادات الفواتير. مواصفات التقرير10، والخادم5، وتصنيف WholeRead واحدة؛
كلها source-written لا نتائج tests ناجحة. رموز namespaces/imports/مشاريع
lean detail متطابقة من المصدر؛ compilation غير مثبت.

تسلّم root محرر BillSettings وقرأه ومواصفاته غير المتتبعة مباشرة؛٢٠مواصفة
للمحرر والخدمة وsmoke غير منفذة، و١٥للقائمة وخمس حالات للخلفية. دققت
القائمة/الخلفية مستقلا، ودقق محررها عامل مستقل آخر دون findings مؤكدة.
صحح root namespace Helpers.Authorization في اختبارَي الخلفية بعد مقارنة
المنتجين والواردات؛ لا نتائج compile مُدعاة. فحوص parsing/import وdiff/XML/
الحزم النهائية مثبتة أدناه. رُقي صفا BillingInvoice وBillSettings فقط؛
الجرد الفعلي١٢١confirmed/٧٨resource-only/٦٠unknown/٢context-only/٢alias
من٢٦٣ ومطابق للـmetadata. لا اكتمال للتطبيق أو reference parity؛ الهدف active.

أدوار الفريق: fleet_alerts_final_audit نفذ محرر الفاتورة ثم راجع تقرير
الفوترة وقائمة الإعدادات خارج ملكية كتابته؛ billing_editor_final_review
راجع المحررين قراءة فقط؛ bill_settings_access بدأ الإعدادات وتوقف لحد
الخدمة قبل تسليم؛ billsettings_editor_completion أكمل محرر الإعدادات
وخدمته/routes؛ root استعاد القائمة والخلفية ودمج المنح والدليل والوثائق
والجرد وأجرى المطابقة. الاستقلال بعد العقد المجمد منع تداخل الملفات
وخفض تكرار قراءة شريحتي التقرير/المحرر؛ root احتفظ بقرار الإقفال.

التحقق النهائي: تحليل TypeScript/قوالب Angular ووجود local imports في٣٥
ملفًا وقالبًا ضمن Billing ومالكي التكامل المحددين، problems=[]؛ ليس
typecheck أو compilation. فحص٧٥مفتاح ترجمة حرفيًا في EN/AR انتهى بلا
missing بعد إصلاح٤مفاتيح عربية. قُرئت الفروق المقيدة في المستودعين
ومصادر untracked مباشرة، وdiff --check بلا أخطاء مع تحذيرات EOL فقط.
قُرئت namespaces الفعلية وglobal imports وSDK inclusion وProjectReferences
وجرى parsing XML لخمس مشاريع مرتبطة. الحزم الثماني -Check كلهاOK؛ لم
تتغير كتب أو قوالب بهذه الشريحة. .NET source names/casing ثبتت مقابل
المسار الفعلي BillingInvoiceDetailVm.cs، دون ادعاء نجاح build.

لا تغيير entity/nullability/EF/max length/index ولا حاجة migration جديدة
من هذه الشريحة. هجرات الوحدات السابقة لا تُلغى بهذا السجل. لا builds/
tests/typecheck/lint/browser/DB/migrations/snapshots/commit/push/deploy،
ولا Sigma MCP أو Graphify/full-solution scan.

التجربة النهائية للمالك تشمل: مدير/عادي وشركتين؛ كل grant مستقل، روابط
مباشرة وقائمة وبداية؛ tenant/live/branch session؛ revoke/regrant وactor/
route أثناء read/focus/decision/write؛ no replay وpayloads/التصنيف؛ count/
صفحة أخيرة وحذف آخر سجل؛ جميع failure channels؛ loader/RTL/themes/mobile؛
وأخيرًا build/specs/SQL/storage compatibility وفق أدوات المالك.

رسائل commit مقترحة فقط عند دمج المالك:

```text
SiGmaAngularFrontEnd:
fix(billing): enforce workspace and editor permissions

SigmaBackend:
fix(billing): align lean responses and read permission scope
```
