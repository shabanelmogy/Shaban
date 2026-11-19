# عقد واجهة تقرير المبيعات

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-11-18 |
| Scope | Reports/Sale، UI07 / BE17، عقد الواجهة والنقل فقط |

طلب المالك مراجعة التقرير وإصلاحه وفق SalesReport/1.png. الأعمدة التسعة حرفيًا وبترتيبها: agreementNo/type/status/startDate/endDate/vehicle/customer/salesPerson/revenue. جدول مسطح لا tree أو children، هوية key خارج العرض، footer total من الخادم في salesPerson/revenue. يملأ الجدول المساحة وتثبت أدوات صفحاته، مع scrollable=!printing. كل عملة قسم مستقل دون جمع العملات أو أعمدة إضافية. الطباعة كاملة وExcel كامل بنفس الأعمدة التسعة. لا شرح داخل الجدول.

الفلاتر: fromDate/toDate تاريخا اليوم المحليين افتراضيًا، contactType الفرد0 والشركة1، agreementCategory Rental0/Lease1، agreementType Daily0/Weekly1/Monthly2/Lease3 فقط (LeaseToOwn4 ليس له سجل نوع فعلي في المصدر)، branchId int?، salesPersonId int?، ownership Own0/External1/BuyBack2. كل الاختيارات optional غير التاريخ، صفر قيمة حقيقية، null يعني الكل. عند اختيار Rental تقصر الأنواع على0–2، Lease على3، وغير المختار0–3؛ تغيير الفئة يمسح النوع المخالف ولا يفرض نوعًا جديدًا. فرع العمل افتراضيًا مرة ضمن الخيارات، والمسح اليدوي محفوظ. يرفض الخادم التركيبات المتعارضة؛ لا يستبدل الاختيار بفئة أخرى كما يفعل المصدر القديم.

يستعمل المكون القائم SaleReportComponent ومساره Reports/Sale وReportPage/ReportActions/FeatureTitle/DataTable ومالكي DatePicker/FieldError/PrimaryActionButton/StateMessage.compact، ودورة createReportReadState للقراءات والصلاحيات والإلغاء والمخرجات. لا BaseService أو lookup لعميل عام أو SalesAgreement payments. الخيارات التشغيلية المباشرة branches/salesPersons فقط من العقود المسموحة ومرجع الموظف المسموح؛ بقية المجالات قيم محلية مترجمة.

واجهة API ضمن SalesReports القائمة: GET SalesReport وSalesReportOptions بمنحة SalesReports.SalesReport، GET SalesReportPrint بمنحتي القراءة وSalesReports.SalesReportPrint، GET SalesReportExportData بمنحتي القراءة وSalesReports.SalesReportExport. تبقى SalesReportExport الثنائية حاليًا وتستخدم قارئ التقرير نفسه؛ لا كاتب أو معادلة موازية. كل النقل Result<T>؛ يفوض DI القائم ISalesReportsService. لا إضافة migration أو كيان.

العقد المشترك Angular/C#: SalesReportSearchVm/Filter يحمل أسماء الفلاتر أعلاه بلا Id ملحقة بالمجالات enum. SalesReportVm/Response fromDate/toDate/sections. SalesReportCurrencySectionVm/Section: currencyId int، currencyCode string، decimalPlaces int، rows SalesReportRowVm[] وtotalRevenue decimal/string exact. الصف key string، agreementNo/type/status/vehicle/customer/salesPerson string، startDate تاريخ، endDate تاريخnullable، revenue decimal/string exact. SalesReportOptionsVm/Options branches/salesPersons كقائمتي id/name.

قاعدة الإيراد والفترة المالية قرار منفصل معلق بسؤال المالك، ولا يجري تنفيذ حساب الإيراد قبل رده. يمكن تنفيذ الواجهة والفلاتر والمخرجات typed طبقًا لهذا العقد لأنها لا تحدد المصدر أو الحساب، ولا تحسب مالًا محليًا. عنوان revenue وحده لا يثبت هل هو إجمالي عقد أو فواتير أو توزيع أيام. لا موافقة جديدة على طلب التنفيذ أو الترتيب؛ المعلق قرار مالي محدد فقط.

ملكية العمل: وكيل الواجهة مجلد Reports/SaleReport فقط. الجذر يملك باقي الربط والترجمات والدليل والمراجعة، ويبقى تنفيذ الخادم المالي معلقًا إلى قرار المصدر. لا تداخل ملفات أو اختبارات تشغيل أو متصفح أو database أو commits؛ البناء مسموح. الطباعة تعرف ReportReadOperation.Print وReport كما في الصورة يعني إجراء الطباعة/عرض التقرير بالمالك القائم لا عارض خاص جديد.

تسوية القرار اللاحق: أجاب المالك باعتماد صافي الفواتير المرحّلة خلال الفترة قبل الضريبة، وجُمّد مصدره في SALE_REPORT_FINANCIAL_CONTRACT_FREEZE.md. أصبح Branch فرع الفاتورة التاريخي؛ تعيد الخيارات فروع الفواتير المرحّلة المسموحة، بينما تبقى قائمة المندوبين من مراجع العقود المسموحة. الجذر أكمل الخلفية بعد انتهاء وكيل الواجهة؛ لا قرار مالي معلق الآن.
