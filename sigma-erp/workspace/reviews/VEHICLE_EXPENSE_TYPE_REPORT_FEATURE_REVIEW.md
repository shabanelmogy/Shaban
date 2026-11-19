# مراجعة تقرير أنواع مصروفات المركبات

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-11-18 |
| Scope | Reports/VehicleExpenseType · UI07 · BE17 · Tier M |
| Contract | [العقد المجمد](VEHICLE_EXPENSE_TYPE_REPORT_CONTRACT_FREEZE.md) |

الصورة تثبت المرشحات الخمسة والأعمدة الاثني عشر وRefresh وExcel. لا يوجد تنفيذ Sigma للتقرير، وكان رابط القائمة يشير إلى شاشة Vehicle. اعتمد المالك سابقًا حسابات المصروفات وصافي القيود المرحّلة، وأكد في هذا النطاق اقتصار البيانات على المرتبطة بمركبة، رغم صفوف الصورة ذات اللوحة الفارغة. يُستبعد عرض حساب الدائنين كنوع مصروف لأن هذا خلاف الأساس المعتمد، ولا يُضاف عمود Revenue أو Print من مرجع مختلف.

المراجع المقروءة: Speed الفصل16 من دليل2026-10-27، ومدخل تحليل2026-10-28، وشاشة Reports21 ومسارR0425، والمتحكمC1084 من `raw/application.js:287078–287329`. يثبت الكود المرشحات وgetVehicleExpenseTypeReport وExcel واستخدام اسم الحساب وكوده عند تشغيل الحسابات. تختلف قائمة أعمدته القديمة عن الصورة الحالية؛ الصورة تحدد12 عمودًا. قُرئ مكمل Odoo19 في `applications/hr/fleet/service.rst` بعد Speed؛ يوضح مصدر الخدمة والمورد والمركبة، ولا يغير قرار Sigma المالي. فحص الوصفات8/8 ناجح، ومهارات Sigma وSuperpowers وAngular متاحة.

المالكون: UI07/UI20/21/22 وBE17 للقراءة، UI6 للجدول، UI16 لاختيارات Select، UI26/28 للصلاحيات والعمر، والسياسة المالية للمبالغ الدقيقة. Reference ReportPage/ReportActions وStatementOfAccount. يُعاد استخدام مصدر VehicleExpenseReportService بدل قارئ مالي موازٍ، وتبقى بيانات رؤوس المستندات والحقول التعريفية مسارًا تابعًا للقيد نفسه لا مبالغ إضافية.

| الاهتمام | المالك والتنفيذ المستهدف |
|---|---|
| بيانات الصف | حقول الصف13: journalLineId للهوية فقط و12 حقلاً للأعمدة؛ العملة ودقتها على مستوى الرأس. لا ListVM أو CRUD أو Mapper. |
| المصدر | القيود Expense المرتبطة بمركبة، QueryReport للمستأجر والفروع، الفترة نصف المفتوحة، نفس تحقق الدقة مع الملخص. |
| المستند | علاقة JournalVoucherId+Type وحيدة؛ لا تضاعف صفوف أو اختيار عشوائي للمورد أو طريقة الدفع. |
| المنح | Read+Options مرتبطان بالقراءة، وExport يشترط Read؛ BranchOperationRules يحدد ReportEffects صراحةً. |
| التحميل | طلب Options أولي، وRead، وExport تحت createReportReadState بمالك page واحد وfinalize، وإغلاق تقويم/Select عند تغير السياق. |
| الذاكرة | Options قراءة تقرير مباشرة غير مؤهلة للـCache المرجعي، والمبالغ تشغيلية مباشرة؛ لا Watch أو كاتب إبطال جديد. |
| المخرجات | مجموعة كاملة، ترقيم محلي وقاع ثابت، Excel مستقل للفترة المطبقة ويشمل كل الصفوف. |
| الواجهة | عنوان واحد والفلاتر الخمسة وأزرار الصورة وجدول مشترك12 عمودًا دون شروح. الترجمتان ودليل التطبيق ومداخل tsconfig صريحة. |

اكتمل التنفيذ والمطابقة المصدرية والبناء. لا اختبارات أو متصفح أو تشغيل API أو بيانات أو هجرة أو التزام أو نشر في هذه المهمة. تبقى SQL plans والقياس البصري والتصدير الفعلي قبولًا منفصلًا.

## المصدر والتحميل والأداء

أُعيد استخراج ExpenseLines وBaseCurrencyAsync وInvalidAmountsAsync من المالك السابق دون تغيير شروط تقرير الملخص. يستخدم التقرير التفصيلي السطور نفسها ثم يطبق vehicleId وaccountId والوصف والمورد؛ لا يتضمن مصروفًا بلا مركبة. تُقرأ هويات المرشحات المرسلة من مجموعاتها المسموحة، وتُرفض هوية حساب ليس Expense أو هوية غير مرئية. يظل كل QueryReport تحت نطاق المستأجر وsoft-delete والفروع، والعمليات الثلاث تحت ReportEffects المراجع.

تتكون بيانات المصدر من Bill وPayment وInvoiceBase وDebitNote وCreditNote وPurchaseReturn وReceipt، مع قيد JournalVoucherId ونوع القيد الحقيقي. تجمع مصادر الرأس حسب JournalId وتُقبل المجموعة الوحيدة فقط؛ لا تتضاعف قيمة سطر القيد عند وجود مصدرين متعارضين. يحتوي المصدر الداخلي nullable scalars ليستوعب غياب الرأس في LEFT JOIN، ويتقدم PartnerId الصريح للسطر على جهة الرأس في العرض ومرشح المورد. مصدر رؤوس المستندات مرتبط بنسخة metadataLines ثابتة قبل إضافة مرشح المورد، كي لا يتكوّن مرجع دوري في IQueryable.

قراءة Options ثلاث استعلامات مباشرة للمركبات والحسابات والموردين، دون كاش مالي أو نداء لكل صف. قراءة/تصدير التقرير حتى3 استعلامات اختيارية لهويات المرشحات، ثم عملة الأساس، وفحص دقة المساهمات، واستعلام صفوف واحد بروابط الرأس الفريدة. لا تُحمّل كل القيود ثم تُصفى في الواجهة ولا يُقرأ كل رأس منفردًا. لا قياس سرعة قبل/بعد لأن المسار لم يكن منفذًا. خطة SQL الفعلية لتجميع مصادر الرأس وUNION ALL والروابط والنطاق معلقة، ولا نثبت أداءً بقياس البناء.

راجعت فهارس JournalVoucherDetail على مفاتيح القيد والمركبة والحساب، وفهارس العلاقات المصدرية بالقيد. مرشح تحسين للفترة هو JournalVoucher(SubscriptionId, IsPosted, IsVoided, Date, Id) INCLUDE (BranchId)، وللفحص التفصيلي JournalVoucherDetail(SubscriptionId, VehicleId, JournalVoucherId, AccountId) INCLUDE (BranchId, PartnerId, Debit, Credit). تبقى اقتراحات تحتاج مراجعة التغطية وخطة SQL وكلفة الكتابة والتخزين قبل ترحيل؛ لم يُعدّل مخطط أو فهرس ضمن المهمة.

| العملية | المالك الفعلي |
|---|---|
| GET VehicleExpenseTypeReports/Options | createReportReadState.loadOptions: اشتراك defer، تحميل page واحد وfinalize، إلغاء الجلسة/المنح/السياق/المغادرة. البيانات مرجع تقرير مباشر غير مسجل في ReferenceLookupCache. |
| GET VehicleExpenseTypeReports/Read | createReportReadState.run: لقطة مرشحات مطبقة، تحميل page واحد، إلغاء ورفض نتيجة قديمة، تفعيل/تعطيل النموذج، أخطاء envelope وHTTP مع Refresh/Retry. |
| GET VehicleExpenseTypeReports/Export | قراءة مستقلة للمرشحات المطبقة كاملة بمنحتي Read وExport. ينسق Excel النص المالي الدقيق، بلا صفحة جزئية أو إجماليات مختلقة. |
| التقويم وقوائم Select | closeOverlays يخفي DatePicker وSelect عند تغير السياق أو زوال المنح؛ النماذج typed والاختيارات nullable. |

المسار النشط يبدأ من sidebar-menu-data ثم Reports_Routes إلى VehicleExpenseTypeComponent. لا metadata تعطل showPageLoading، ويبقى shell host مالك التقدم؛ الجدول showLoadingIndicator=false ولا توجد مؤشرات فلاتر منافسة. التخطيط يستخدم report-page وreport-actions وfeature-title وDataTable وFieldError وStateMessage compact، والقوائم PrimeNG Select المعتمدة. اجتاز فحص خصائص PrimeNG المصدري بعد فصل توجيه Sigma appDatePicker وصفة maxlength الأصلية عن خصائص المكتبة؛ المعاينة البصرية منفصلة.

دليل التطبيق `src/app/modules/UserGuide/content/vehicle-expense-type-report-topic.ts` ضمن دليل Reports الحالي، مع القاموس العربي والإنجليزي ومداخل tsconfig.app الصريحة قبل البناء. لا تعديل في منطق الفواتير أو الدفع أو المورد أو مصدر مالي خارج مالك التقرير. فصل وكيل واجهة محدد الملكية العمل عن الجذر الذي تولى الخادم والعقد والدمج؛ يُعاد استخدامه للمراجعة المصدرية النهائية دون تنفيذ أو تعديل.

## المطابقة المصدرية المستقلة

وجدت مراجعة الوكيل ثغرة تطابق بيانات الفاتورة مع نوع قيدها ونقصًا في ترجمة PurchaseReturn. صُحح الشرط وفق InvoiceAccountingService.ResolveMetadata ومصدر الفاتورة المتنوعة، وأضيفت مواصفة مصدرية لفاتورة مرتبطة بنوع قيد خاطئ: يبقى مبلغ القيد الصحيح بلا بيانات رأس غير مطابقة. أضيف PurchaseReturn وRentalRevenueAccrual إلى مترجم أنواع الحركات المشترك وترجمتيه؛ لا منطق جديد أو غلاف ترجمة موازٍ. راجع الوكيل التعديلين مصدريًا وأغلقهما، دون تشغيل.

تُظهر متابعة JournalVoucherResolver أن No للقيد مستقل. أضيف source.No إلى إسقاط المصدر المقيد نفسه، ويُعرض عند مصدر فريد مطابق؛ عند غيابه يُعرض رقم القيد. لا يُخترع رقم لمصدر موجود بلا رقم. سُجل الاستنتاج كقرار عرض في العقد ودليل الاستخدام، وأضيفت تأكيدات المصدر لأرقام Bill وPayment مع اختلافهما عن رقم القيد.

نجح البناء النهائي للخادم وتجميع مشروع `tests/SiGma.BranchAccess.Tests/SiGma.BranchAccess.Tests.csproj` واعتمادياته بما فيها API إلى `.codex/builds/vehicle-expense-type-backend` برمز خروج0، و0 أخطاء و41 تحذيرًا خارج الملفات الجديدة. السجل `.codex/vehicle-expense-type-backend-final-build.log`. يشمل المصدر مواصفات تطابق الملخص والتفاصيل والعكس السالب وآخر يوم واستبعاد غير المرتبط بمركبة والقيود غير المرحّلة، وبيانات رأس Bill/Payment، ومنع fanout عند المصدر المتعارض، ورفض بيانات فاتورة بنوع قيد غير مطابق، والمرشحات ومنح Export/Options وReportEffects. جرى تجميع هذه المواصفات فقط دون تنفيذها. أوقف الجذر بناء الواجهة السابق بعد تغير الترجمة ودليل الشاشة أثناء المراجعة؛ البناء النهائي اللاحق وحده مرجع القبول المصدري.

نجح بناء الواجهة النهائي `npm run build -- --configuration=development` إلى `.codex/builds/vehicle-expense-type-report` برمز خروج0. السجل `.codex/vehicle-expense-type-frontend-final-build.log`. طابقت خرائط المصدر للحزمة النهائية ملفات المكوّن TypeScript وHTML والخدمة والقاموس ودليل الشاشة ومترجم نوع السند المشترك حرفيًا بعد تطبيع نهايات السطر. اجتاز فحص المصدر الفلاتر5 والأعمدة12 بالترتيب ووجود showPaginator مع نداء القالب ومداخل runtime الصريحة والتصدير الكامل ووحدة المصدر المالي. روجعت الفروقات المحددة في المستودعين دون تغيير الأعمال الأخرى، واجتاز فحص whitespace المحدد. لا أخطاء مصدرية مؤكدة متبقية بعد معالجة الملاحظات؛ صحة SQL Server الفعلية والعرض ما زالت تحتاج قبول التشغيل.

## تسليم ومتابعة القبول

أعد بناء وتشغيل API المحدث ثم افتح التقارير ← المالية والمصروفات ← Vehicle Expense Type Report. راجع الشهر الافتراضي والمرشحات الخمسة، واستبعاد المصروف بلا مركبة حتى دون تحديد المركبة، وتطابق المجاميع المحسوبة خارجيًا مع ملخص Vehicle Expense للفترة نفسها. تحقق من رقم مستند مصدر يختلف عن رقم قيده، ومورد صريح للسطر مختلف عن مورد الرأس، ومصدر غير مطابق أو متعارض يبقى بلا تفاصيل مختلقة. جرّب صفحات وفرزًا وExcel لأكثر من صفحة وتغير الصلاحيات/الفروع أثناء الطلب. هذه خطوات قبول مقترحة غير منفذة، وليست نتيجة اختبار.

الملفات الجديدة في الواجهة: `Reports/VehicleExpenseType/vehicle-expense-type.component.{ts,html}` والخدمة والقاموس ودليل الشاشة. الربط في reports.routes وsidebar-menu-data وroute-access-policy وen/ar وreports-guide وtsconfig.app. ملفات الخادم الجديدة: Controller وDTOs تحت VehicleExpenseReport وType/TypeSources وDocumentSource ومواصفات التقرير. تغييرات المالك القائم محصورة باستخراج المصدر المالي المشترك وإضافة واجهتَي ReadType/TypeOptions ومفاتيح المنح. لا تغيير EF أو Mapper أو مخطط أو بيانات؛ لا هجرة مطلوبة. رسالتا الالتزام المقترحتان فقط: `feat(reports): add vehicle expense type details` للواجهة، و`feat(reports): expose scoped vehicle expense ledger details` للخادم. لم يُنفذ التزام.
