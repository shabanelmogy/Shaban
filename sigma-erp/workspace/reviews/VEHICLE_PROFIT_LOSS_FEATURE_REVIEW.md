# مراجعة تقرير أرباح وخسائر المركبات

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-11-11 |

النطاق: طلب المالك إنشاء التقرير المفقود من الصور1–3، على الحركات المحاسبية المرحلة وصلاحياته. الخطة والعقد المرافقان يملكان قرارات التنفيذ. ملفات المصدر الحالية لا تحتوي شاشة التقرير؛ توجد خدمات مالية قديمة لا تستوفي الأساس المختار. لا تعديل للتقرير المختلف برقم الشاسيه.

## إصلاح قراءة المركبات بلا حركة — ١٦ نوفمبر ٢٠٢٦

أرسل المالك سجل خطأ76 من HTTP GET VehicleReports/VehicleProfitAndLoss، trace `0HNQ3VFBQP8FQ:0000001B`، وتوقف ToListAsync داخل CreateVehicleProfitAndLossReport باستثناء InvalidOperation_NoValue في materializer. اجتاز التنفيذ فحص العملة والاستبعادات، فالخطأ مختلف عن تكرار الإعدادات الذي عولج سابقًا.

الفحص المأذون للقراءة فقط على `SQL5106.site4now.net / db_a82a9c_sigmaoperations1` أكد اشتراك1007 للمستخدم24، و52 مركبة حية، منها49 بلا سجل حالة، وجميع52 بلا حركة إيراد/مصروف مرحلة مؤهلة حتى عند إلغاء قيد الفترة. استعلام القيود يحتفظ بنطاق الشركة والحذف وposted/nonvoid وحسابات الفئتين4/5. لم تُعدل بيانات في هذه المتابعة.

الخلل المصدري في ربط تجميع الحركات بالمركبات عبر LEFT JOIN: التجميع كان يحمل مفتاح VehicleId غير قابل للفراغ وdecimal غير قابلة للفراغ، ثم يختبر كائن الإسقاط المجهول. صف المركبة بلا حركة يترك أعمدة التجميع NULL ويعرض materializer لقراءة قيمة غير موجودة. صُحح المالك نفسه بجعل مفتاح/مبالغ التجميع nullable داخليًا، ثم إسقاط Revenue/Expense بالصفر عبر coalesce وحساب ProfitLoss من نفس المبلغين. لا إسقاط للمركبات الخالية ولا حذف بيانات أو توزيع مبالغ تخميني. VehicleStatus.Status nullable بالفعل؛ لم يغير عقد الحالة أو يختلق سجلًا لها.

العقد القائم يقتضي شمول المركبات بلا نشاط، فهذه معالجة للـquery shape وليست توافقًا مع بيانات قديمة أو سياسة استبعاد جديدة. أعمدة الجدول وDTO والأموال ومرشحات الفترة/المورد/الشركة/الفرع/الأذونات ثابتة. ملخص التصدير يستعمل مالك الملخص نفسه فيستفيد من الإصلاح؛ استعلاما التفاصيل والبيع لا يملكان هذا الربط ولم يُعدلا. لا تغيير cache أو loading أو طلبات الواجهة. لا query إضافي لكل صف أو فهرس/migration مقترح: الشكل الحالي يحتفظ بنفس التجميع والربط والمفاتيح، وخطة SQL والزمن الناجح يظلان قياس قبول منفصلًا. مدة3852ms في سجل الفشل ليست قياس أداء تقرير ناجح.

أضيفت مواصفتان في VehicleProfitLossSummaryTests: أسطول بلا حركة/حالة يبقى بأرقام صفر، ومزيج مركبة بإيراد100 ومصروف30 وأخرى صفرية يعطي صفين وإجمالي70 مع علامة Defleeted من الحالة الفعلية. يستخدم الاختبار مدخل الخدمة وfixtures منفصلة عن المستخدم؛ تجميعه لا يثبت ترجمة SQL Server. نجح بناء tests/SiGma.BranchAccess.Tests/SiGma.BranchAccess.Tests.csproj مع API/business: صفر أخطاء و24 تحذيرًا خارج الملفين المتأثرين، وسجل البناء `F:/MyWorkBuild/approval-inline-20261116/profit-loss-null-summary-build.log`. لم تُشغل المواصفات أو HTTP/المتصفح بعد التعديل.

الدليل `UserGuide/content/vehicle-profit-loss-topic.ts` تحت `/UserGuide/reports` يوضح الصفوف الصفرية وعدم وضع علامة خروج من الأسطول بلا تاريخ؛ نجح ngc --noEmit له، وحُذف إعداد البناء المؤقت. روجعت الفروق المصدرية والفراغات مع حفظ تعديل مالك الاستبعاد السابق. تطبيق المراحل1/2/6 بقدر الاستعلام؛ لا مرحلة domain mutation أو migration. مهارتا Sigma/systematic-debugging والعقد الحالي وBE17 ومرجع شاشة Speed23/01 ومصدر المسارR0390 قُرئت؛ لا فجوة وظيفية جديدة تستدعي Odoo. لا تفويض لصغر التغيير المتسلسل. لا tests/lint/browser أو commit/push/deploy منفذة.

قبول المالك المعلق: بناء وتشغيل API بالمصدر الحالي، ثم طلب الملخص/التصدير للمدى الفارغ ومع مركبة ذات حركة، ومطابقة الأرقام والعدد وحالة الخروج والفروع. اقتراح commit للخادم: `fix(reports): coalesce nullable vehicle profit-loss activity aggregates`؛ ودليل الواجهة: `docs(reports): explain zero-activity vehicle rows`.

## إصلاح الأنواع بعد سجل أخطاء المالك — ٢٠٢٦-١١-١١

شريحة S، ضمن تفويض إصلاح التنفيذ السابق. سجل المالك يثبت تعارض DataTableColumn<DetailRow> مع SellingRow بسبب cellTemplate الذي يعيد column typed داخل سياقه؛ اتساع return annotation أضاف هذا الاحتمال رغم عدم وجود templates في المصفوفة الفعلية. حُفظت المصفوفة المستنتجة مع satisfies للتحقق من عقد DetailRow، فتظل الحقول literal وcallbacks تقبل صف التفاصيل والصف الممتد دون إسقاط أمان النوع أو casting. حقل rateCurrencyCode موجود في موديل البيع الحالي ومطابق DTO الخادم؛ لم يضف ثانية ولم يغير العقد المالي.

الملف المعدل في الواجهة: Reports/VehicleProfitAndLoss/vehicle-profit-loss-presentation.ts فقط لهذه الشريحة. لا source backend أو تغيير مجال/عملة/permissions أو UI/guide-visible behavior؛ الدليل القائم صالح. مرجع UI5 للحقول typed ومالك DataTable الحالي، والعقد المجمد وملحق عملة المعدل قُرئت؛ لا تغيير وظيفة يستلزم إعادة تحليل Speed/Odoo أو frozen financial decision. المراحل المتأثرة2 و6 فقط، لا agent لصغر الإصلاح. لا query/cache/loading/index أو migration impact. اقتراح commit الواجهة: fix(reports): retain precise column types for selling details.

فحص المصدر المشترك مع تفاصيل التأجير: parse7 ملفاتTS وقالبينAngular، ومراجعة AST للعقد ووجود rateCurrencyCode؛ لا diagnostics أو قضايا في تلك الفحوص. راجعت مصدر الملف كاملًا لأنه untracked قبل هذا الإصلاح، وحفظت التغييرات السابقة. لا build/typecheck أو tests منفذة؛ سجل المالك ليس نتيجة تشغيل بعد الإصلاح. تأكيد Angular compilation وdisplay/export ما زال عند المالك. لا build/test/lint/browser/database/migration/commit/push/deploy أثناء هذه الشريحة.

ورد أيضًا خطأ حذف حركات الاستلام Expected1argument في السجل؛ الفحص الحالي وجد service method بوسيط context?:HttpContext وممررًا إلى HTTP DELETE، واستيراد القائمة يطابق هذا المالك. لا تعديل جديد عليها أو ادعاء زوال الخطأ بالبناء؛ قد يعكس السجل نسخة سابقة من الشغل المتزامن.

## الأدلة والفجوات عند الاكتشاف

| البند | الدليل | الحالة/التصرف |
|---|---|---|
| الفترة والملكية والمركبة والموديل والشاسيه والنوع والأسطول والمورد والملف المروري | صورة1؛ C1095 | نُفذت المرشحات التسعة ذات الأنواع وفق أسماء Sigma الفعلية؛ المرجع يميز tariffGroup عن fleetType ولا تُنسخ قيمه الرقمية |
| اللوحة والماركة/الموديل والإيراد والمصروف والربح | صورة1؛ C1095 | مصدر محاسبي وخمس أعمدة، والهوية لعرض التفاصيل |
| التفاصيل11 عمودًا وإجمالياتها والتصدير | صورتا2/3؛ C1096 | حركة القيد الفعلية بصف لكل سطر؛ عدم اختراع طريقة دفع أو مستند مرتبط |
| التصدير الملخص والتفصيلي وبتفاصيل البيع | صورة1؛ C1095 | مخرجات كاملة ومنح مستقلة، مع نفس أساس القيد |
| الحساب الحالي | VehicleReportsService432–945 | استبدال تجميع فواتير التشغيل؛ NormalizePlate داخل WHERE غير مثبت الترجمة؛ لا حراسة posted/voided؛ خلط أساس الضرائب والعملات |
| ملكية الحركة | JournalVoucherDetail، Vehicle، CostCenter | لا VehicleId مباشر؛ مجموعة مركز تكلفة مشتركة لا تثبت مركبة. إضافة ربط صريح ومنتجين مؤكدي الهوية |
| الصلاحيات | CurrentAccess/PermissionEndpointResolver/BranchOperationRules | آلية حقيقية موجودة رغم العبارات القديمة في بعض الفهارس؛ استخدامها لا إنشاء بديل |

## المراجع والمهارات

قرئت تعليمات AGENTS والدليل الحي ومهارة Sigma، README وفهرس المراجعات، كتالوج07، Master1/4، UI20، BE17، مرجع Speed S107 والكود C1095/C1096 وشاشته23/01، ومدخل Odoo وFleet cost analysis المحلي. Superpowers متاح بملفات using-superpowers/brainstorming/writing-plans/systematic-debugging/TDD/dispatching-parallel-agents؛ تعليمات المشروع تقيد التنفيذ بالمصدر وتحسم التصميم المتفق عليه دون موافقات مكررة. Angular21.2.25/PrimeNG21.1.10 من package.json. بقية الكتل ومالكو المصدر تُقرأ بحسب مسار التنفيذ، ولا يُدّعى فحصها قبل القراءة.

## المطابقة النهائية

نُفذت شاشة التقرير المفقودة بمصدرها المحاسبي وصلاحياتها، مع مراجعة الجذر للمصدر وتكامله. هذا تسليم مصدري للعقد الحالي؛ لا يثبت اكتمال تبني ربط المركبة في كل منتجي النظام أو قبولًا تشغيليًا أو مطابقة شاملة لكل حركات سبيد. يظل تقرير الشاسيه وتقرير الأرباح العام خارج التعديل.

### قرارات المصدر والواجهات

| الجانب | المالك/الدليل | النتيجة |
|---|---|---|
| الشكل | UI07، UI20/21/6، StatementOfAccount/ReportPage/DataTable | تقرير قراءة كامل، جدول مشترك بصفحات محلية؛ التفاصيل EditorDialog بملخص الخادم |
| الأعمدة مقابل DTO | summaryColumns/VehicleProfitAndLossRowVm | المعروض بالترتيب plateNo,makeAndModel,revenue,expense,profitLoss؛ vehicleId لهوية التفاصيل؛ branch/chassisNo لمخرجات Excel؛ isDefleeted لعلامة اللوحة. لا ListVM/CRUD جديد |
| تفاصيل الصورة | detailColumns/VehicleProfitAndLossDetailRowVm | date,voucherNo,type,plateNo,contact,branch,expenseType,paymentMethod,description,revenue,expense؛ journalLineId هوية الصف وvehicleId لنطاق المركبة |
| المال | FinancialNumberPolicy.SumCurrencyReadAmounts وCurrencyAmountJsonConverter | المبالغ نصوص عشرية دقيقة، والإجماليات من الخادم لكل المجموعة؛ الإيراد credit-debit لحساب Revenue والمصروف debit-credit لحساب Expense؛ لا VAT أو ذمم ضمن الحساب لمجرد ارتباطها بمستند |
| الفترة | ProfitLossLines | تاريخ القيد، من بداية اليوم إلى بداية اليوم التالي للنهاية حصريًا؛ ليس تاريخ الفاتورة ولا وقت الترحيل |
| التصفية | VehicleProfitLossSearchVm/HttpParams | تطابق fromDate,toDate,ownership,fleetType,vehicleId,carModelId,vehicleTypeId,supplierId,chassisNo,trafficFileId؛ الأعداد هويات أو enum وليست كميات؛ المورد يقيد المصروف فقط |
| الاستبعاد | الإعدادات العامة/قرار المالك بالاختيار الأنسب | أكواد الحسابات الصريحة، الحساب نفسه لا أبناؤه؛ خطأ عند كود مجهول/غامض أو تعدد سجل الإعدادات؛ لا تجاهل صامت |
| معنى النوع والأسطول | Sigma enum | Own0/External1/BuyBack2 وRental0/Replacement1/Staff2؛ لا نسخ لأرقام سبيد أو إضافة enum غير مدعوم |
| AutoMapper | JournalVoucherDetailProfiler | identity convention للربط، projection للوحة المركبة فقط؛ لا Ignore/ReverseMap إضافية |
| الكتابة والمبالغ | JournalVoucherResolver/Bill/InvoiceAccounting | أُضيف الربط دون تغيير قواعد الحساب/التوازن/الترحيل؛ سطور rental مفصولة حسب المركبة ونوع الرسم مع حفظ إجماليها؛ InvoiceActionService يراجع السطور الجديدة دون cap7 الخاطئ |
| التاريخ المالي | RentalInvoiceItem.VehicleId | snapshot محفوظ، العكس يحتفظ بـVehicleId؛ أحداث fine من هويتها الفعلية، وأحداث toll غير المثبتة تبقى غير مسندة |
| تفاصيل البيع | source Invoice.JournalVoucherId الوحيد | بيانات وصفية فقط؛ معدل نصي بعملة المصدر المبينة، لا تنسيق له بدقة عملة الأساس أو استنتاج اتفاقية لصف غير مربوط |
| الاستثناء التخطيطي | UI4 FilterPanel كما BalancesSummary | ثلاثة مرشحات رئيسية وستة إضافية لحفظ مساحة الجدول؛ لا مكون طي أو CSS محلي |

### الصلاحيات والفروع

المسار الفعلي يبدأ من pages/routing.ts إلى Reports_Routes ثم VehicleProfitAndLossComponent. يطبق currentAccessGuard سجل route-access-policy، والقائمة تستخدم السجل نفسه. الخدمة root تستعمل HttpClient الحالي مع interceptor؛ لا provider محلي منافس. Controller موجود تحت Authorize وPermissionAuthorizationFilter الحقيقي، وتطبق QueryReport قواعد المستأجر/soft-delete وفلاتر BranchScopeRegistry. لا أمن مبني على إخفاء الزر وحده.

| العملية | المفتاح/الشرط |
|---|---|
| فتح/قراءة | VehicleReports.VehicleProfitAndLoss ومعه VehicleProfitAndLossOptions لفتح الشاشة |
| الخيارات | VehicleReports.VehicleProfitAndLossOptions مع prerequisite عرض التقرير |
| التفاصيل والتصدير التفصيلي | VehicleReports.VehicleProfitAndLossDetail مع prerequisite عرض التقرير |
| تصدير الملخص | VehicleReports.VehicleProfitAndLossExport مع prerequisite عرض التقرير |
| تصدير بيانات البيع | VehicleReports.VehicleProfitAndLossWithSellingDetail مع prerequisite عرض التقرير |
| ربط المركبة باليدوي | شرط journalVehicleChanged مع Vehicle.Lookup عند إنشاء الربط/تغييره؛ الاحتفاظ بالمحفوظ متاح دون الصلاحية |

لا تُمنح الصلاحيات لأي مستخدم تلقائيًا. الإدارة تراجعها من الكتالوج؛ أسماء العمليات والشرط مترجمة EN/AR. تقرير القراءة ومخرجاته يعملان بوضع ReportEffects القائم، ولا يوسع ذلك عرض مستند كامل أو تعديله. الربط الجديد يتحقق من وجود المركبة ومِلْكيتها عند الكتابة ويقيد حذفها بـRestrict. تفاصيل الموردين والعملاء تأتي من الروابط المحفوظة المتاحة، ولا تُغير PartnerId السطر.

### التحميل والكاش وعمر الطلبات

| الطلب | نقطة البدء/المالك المرئي | الإنهاء والإبطال |
|---|---|---|
| GET VehicleProfitAndLossOptions | finite bootstrap ثم ReferenceLookupStatus.page | error/Retry؛ cancel عند السياق/الصلاحية/تدمير الصفحة، يطلق host تحميل الصفحة؛ مصدر تقرير خاص غير مشترك ولا opt-in cache |
| GET VehicleProfitAndLoss | defer/startLoading والصفحة | finalize/endLoading؛ إلغاء بالمرشحات/السياق/المنح/التدمير؛ لا خلط مع نتيجة قديمة |
| GET Detail داخل النافذة | StateMessage محلي خلف EditorDialog | لا loader shell مخفي خلف overlay؛ finalize محلي وإغلاق عند السياق/المنح/الجلسة |
| GET Export/Detail/Selling للمخرجات | defer/page loading | لقطة المرشحات المطبقة كاملة، guard عند النقر وعند الاستجابة، finalize ومراقبة المنح |
| الطباعة | ReportPrintSession | طباعة كل الصفوف مع تعطيل paginator/scroll؛ إلغاء التحضير المؤجل عند فقد السياق/المنح/التدمير |
| منتقي المركبة في اليدوي | Vehicle.GetSelect المصدر opted-in الموجود | finite bootstrap من page loader ثم ReferenceLookupBindings.watch؛ يحتفظ بالمسودة والملصق الحالي، يفصل المتابعة عند grant/context، Retry؛ لا مصدر كاش منافس |

طلبات التقرير ومخرجاته والإعدادات/عملة الأساس تشغيلية مباشرة بلا memo أو كاش مالي. قائمة خيارات التقرير تقرأ vehicle/car model/vehicle type/supplier/traffic من نفس tenant/branch دون صلاحيات إدارة إضافية. X-Skip-Error-Interceptor يترك الخطأ للشاشة مع معالجة isSuccess=false وHTTP error. readAuthSessionKey يحفظ عمر الجلسة عبر renewal؛ denied$ وdataContext يمنعان نشر قراءة قديمة أو إكمال مخرج بعد انتهاء ملكيته.

### السرعة والاستعلامات والفهارس

الملخص يجمع الأرقام في SQL قبل إسقاط صفوف المركبات الكاملة، ولا يقرأ فواتير خام أو قوائم plate/vehicle IDs ضخمة أو ينفذ N+1. التفاصيل تقرأ إسقاط سطر محدد مرة واحدة؛ مخرجات البيع لها قراءة metadata واحدة محدودة بعلاقة journal لا لكل صف. ملخص التقرير لا ينضم إلى metadata جهة الاتصال الخاصة بالتفاصيل. التاريخ يستخدم مجالًا نصف مفتوح بدل date function على العمود. كل استدعاء يقرأ عملة الأساس وإعداد الاستبعاد مباشرة؛ إذا وُجد استبعاد، يقرأ تعريف الحسابات الموافق مرة واحدة. الخيارات خمس قراءات متتالية على DbContext واحد، لا parallel DbContext.

لا زمن مقاس قبل/بعد أو SQL plan منفذ. الحالة السابقة لم تكن أساسًا ماليًا صحيحًا للمقارنة الوظيفية. قياس المالك: نفس tenant/branch/period/rows/grants، تشغيل بارد ودافئ وخمس عينات، فصل options/summary/detail/selling، وقياس SQL IO/plan/payload/render مع استبعاد وقت المستخدم. الاستجابة كاملة غير مرقمة خادميًا؛ التكلفة تتناسب مع كل الحركات المطابقة.

التكوين الحالي يضيف FK VehicleId إلى كل من JournalVoucherDetail وRentalInvoiceItem، وتغطية FK الاعتيادية تتبع conventions. لم تُضف فهارس أداء أخرى بلا خطة/cardinality. مرشح لاحق محتمل لسطر القيد هو (SubscriptionId,VehicleId,JournalVoucherId) مع INCLUDE(AccountId,Debit,Credit,BranchId,PartnerId)، بلا unique أو filtered soft-delete=0 لأن live NULL مؤهل؛ فائدته فرضية join/aggregation فقط، وتكلفته حجم وكتابة وتداخل مع FK. لا توصية تطبيق قبل مقارنة خطة SQL بالفهرس البسيط وتوزيع الفترة والمركبات. لا schema/SQL يدوي أو ترحيل منشأ من الوكيل.

### الدليل والمطابقة المرجعية

دليل التقرير: UserGuide/content/vehicle-profit-loss-topic.ts ضمن reports-guide.ts والقارئ القائم، والمسار `/UserGuide/reports` وبنده داخل Reports. يغطي التصفية والملخص والتفاصيل والمخرجات والفترة والعملة والمنح والإسناد والاستبعاد. حُدث journal-vouchers-topic.ts لاختيار المركبة وحدود CSV وصلاحية تغيير الربط.

الصور1–3 دليل وظيفي للمرشحات والأعمدة والتفاصيل/المجاميع والمخرجات، لا سلطة ألوان أو تصميم. Speed S107 يشرح الربحية، وصيغته النسبية التسويقية ليست معادلة التقرير النقدي؛ C1095/C1096 تثبت شكل الحركة ومنافذ التصدير لا قواعد الخادم. Odoo cost analysis يوضح تحليل التكلفة فقط ولا يحدد ربط قيود Sigma. تمت مطابقة الوظائف المرئية بمالكي Sigma، مع فجوات واضحة: طريقة الدفع بلا مالك موثوق في سطر القيد فتظل —؛ روابط مستندات غير مثبتة لا تُختلق؛ أحداث toll/بقية أنواع الفواتير والمخصصات/مصادر غير مسندة لا تدخل الحساب. لا يُدّعى أن ترقية التقرير وحدها أتمت ربط كل منتج.

### الفحص والتسليم

فهرس الملفات الدقيق: VEHICLE_PROFIT_LOSS_SOURCE_MANIFEST.md؛ 37 ملف backend و28 ملف frontend ضمن نطاق المصدر، مع وجود تعديلات سابقة في المستودعين حُفظت. فُحصت الفروق المملوكة والتكامل من الجذر، ولم تُنسب تعديلات المستخدم السابقة إلى المهمة. مراجعة Git للملفات ذات تغييرات سابقة حافظت عليها؛ الملف غير المتتبع PermissionPrerequisites قرئ بملكه الحالي قبل إضافة الحالات الجديدة.

الفحوص المصدرية: صياغة TS/قوالب Angular، الاستيرادات المحلية، مطابقة مفاتيح EN/AR، XML resx للمفاتيح الجديدة، whitespace وmerge markers وtsconfig explicit files دون specs. مواصفات سلوكية مضافة للصلاحيات والعكس/المابينج والكاش الاختياري وإجماليات العرض الدقيقة والمخرجات الكاملة؛ **لم تُشغّل**. لا RED/GREEN أو نجاح build مدعى. PrimeNG Select/DatePicker/InputText metadata مصدري؛ validation valid بعد استبعاد directive Sigma والخاصية HTML الأصلية maxlength من نطاق مكتشف props، دون حذفهما من التطبيق. مصادره الرسمية: https://primeng.dev/select وhttps://primeng.dev/datepicker وhttps://primeng.dev/inputtext؛ هذا لا يثبت تشغيل Angular.

أحدث مخرجات الفحص: 27 ملف TS/HTML بصفر syntax diagnostics؛ فحص tsconfig بلا أخطاء وبلا specs ضمن compile التطبيق؛ 58 مفتاحًا حرفيًا مستخدمًا دون فقد EN/AR وتطابق namespace التقرير؛ لا استيرادات محلية مفقودة؛ مفاتيح resx الثلاثة تظهر مرة واحدة بكل لغة. git diff --check خرج0 لكل مستودع في نطاق الملفات، ولا merge markers. حزم PLAN00/PHASE00–06 الثماني OK عند البداية وعند التسليم. أسماء namespaces/الاستيرادات والـproject references قورنت؛ المشروعات الأربعة المستهلكة net10.0 وتضم الملفات عبر SDK defaults، ولا يثبت ذلك build ناجحًا.

المراحل0/1/2/3(تفاصيل قراءة)/5/6 مطبقة، والمرحلة4 غير منطبقة للتقرير. لا مالك تأكيد/حفظ/حذف جديد في التقرير؛ المنتجون احتفظوا بالمعاملات والتحقق الأصليين. استخدم عاملان بملكية غير متداخلة للواجهة وربط القيود، وبدأ تدقيق قراءة ثالث؛ توقفت الجلسات الفرعية بسبب حد الاستخدام قبل تقرير تسليم نهائي، فاستكمل الجذر التكامل والتصحيح والفحص. لم تصل نتيجة تدقيق مستقل نهائي، ولا تُدعى موافقته. النموذج موروث من الجلسة؛ لم تتوفر أسماء النماذج القديمة المحددة في الدليل؛ الاختيار المتوازي لتقليل زمن مسارين مستقلين بعد تجميد العقد.

### المطلوب من المالك

يلزم ترحيل لإضافة VehicleId الاختياري وعلاقتي Restrict في JournalVoucherDetail وRentalInvoiceItem. الاسم المقترح غير موجود ضمن أسماء migrations الحالية:

`Add-Migration AddJournalVoucherDetailVehicleAttribution`

لا backfill للقيود القديمة ولا تخمين مركبات من بيانات تجريبية؛ جهّز بداية نظيفة أو إسنادًا ماليًا مملوكًا خارج هذا التسليم. ثم نفّذ build/tests وقبول SQL للملخص والتفاصيل/التصفية والاستبعاد والفترة، والمنح/الفروع/tenant، وسحب/إعادة المنح والجلسة، وطباعة/تصدير أكثر من صفحة، ونافذة التفاصيل، وRTL/الثيمين/شاشة ضيقة، وفواتير rental متعددة المركبات وعكسها. يجب أن تساوي مجموعات التقرير نفس القيود المؤهلة دون تضاعف، ولا تُخلط العملات.

رسالتا commit مقترحتان فقط:

- Backend: `feat(vehicle-profit-loss): report posted vehicle ledger movements`
- Frontend: `feat(vehicle-profit-loss): add report details and access controls`

لم تُشغّل builds/tests/lint/browser/database/migrations/commits/push/deploy، ولم يُعدّل أي snapshot أو يستخدم Sigma MCP/Graphify.
