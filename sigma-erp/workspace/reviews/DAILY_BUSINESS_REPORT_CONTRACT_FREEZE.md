# عقد تقرير النشاط اليومي

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-11-18 |
| Scope | Reports/DailyBusiness، UI07 / BE17، Tier M |

طلب المالك مراجعة التقرير وإصلاحه وفق صورتين، ثم طلب تقسيمه تابات. يبقى المسار Reports/DailyBusiness والمكون القائم DaiyBusinessComponent. سبعة تابات مشتركة الفترة والفرع والبحث والطباعة وExcel، دون شروحات داخل الجداول. الطباعة جميع الأقسام؛ Excel التاب النشط بكامل صفوفه وفق UI20. الفلاتر fromDate/toDate/branchId، أيام محلية حتى بداية اليوم التالي الحصرية، البداية الافتراضية اليوم حسب مرجع هذه الشاشة، وغياب الفرع كل المسموح.

الخادم الجديد DailyBusinessReports: GET Read/Options/Print/Export، Result<T>، منح Read وPrint وExport المستقلة مع Read شرط المخرجات. يصنف EffectReads ويستعمل QueryReport ومرشحات الشركة/الفروع القائمة. لا كتابة أو كيان أو migration. قراءة كاملة واحدة مع أقسام مرتبة وأعداد كاملة، ولا اعتماد على صفحة جزئية. Options يعيد branches من النشاط المسموح فقط، لا تحميل دليل عميل أو موظف عام. لا تخزين لبيانات التقرير أو خياراته التشغيلية؛ يملك report-read-state دورة الطلب والتحميل وإلغاء السياق والمخرجات.

العقد المنقول في namespace SiGma.ViewModels.ViewModels.DailyBusinessReport:

- يضم DailyBusinessReportFilterVm FromDate/ToDate DateTime وBranchId int?.
- يضم DailyBusinessReportVm FromDate/ToDate، CollectionSections List<DailyBusinessCollectionSectionVm>، AgreementsOpened/AgreementsClosed List<DailyBusinessAgreementRowVm>، Nrms/WorkshopMovements List<DailyBusinessMovementRowVm>، VehicleReplacements List<DailyBusinessReplacementRowVm>، وأعداد AgreementsOpenedCount/AgreementsClosedCount/NrmsCount/WorkshopMovementsCount/VehicleReplacementsCount الصحيحة.
- يضم DailyBusinessReportOptionsVm Branches List<CollectionOptionVm>.
- يضم DailyBusinessCollectionSectionVm CurrencyId/CurrencyCode/DecimalPlaces وTotal decimal بنقل exact money string وQuantity int وRows List<CollectionRowVm> وPaymentMethods List<DailyBusinessPaymentMethodVm>.
- يضم DailyBusinessPaymentMethodVm Key/PaymentMethod string وQuantity int وAmount decimal بنقل string دقيق.
- يضم DailyBusinessAgreementRowVm Key string وAgreementNo/Type/Customer/Vehicle/SaleOrigin string، StartDate DateTime وEndDate DateTime?؛ يستعمل عمود EndDate عنوان Expected End Date في المفتوحة وEnd Date في المغلقة.
- يضم DailyBusinessMovementRowVm Id int وMovementNo/Vehicle/Staff string، FuelLevelOut/FuelLevelIn/KmOut/KmIn string?، DateOut DateTime وDateIn DateTime?.
- يضم DailyBusinessReplacementRowVm Id int وAgreementNo/Customer/Vehicle/Reason/Notes string وReplacementDate DateTime.

ملخص التحصيل: paymentMethod/quantity/amount، وتفاصيله voucherType/voucherNo/date/customer/agreementNo/paymentMethod/amount. المصدر ICollectionReportService.ReadAsync بنفس فترة/فرع فقط، مع قواعد القبض المرحل وغير المبطل واحتساب قبض الوديعة مرة واحدة وعدم تكرار الاستخدام. تحافظ Sections على العملات وإجمالياتها؛ Quantity عدد السندات الفريدة في القسم ولكل طريقة، وليس كمية كسرية أو عدد تخصيصات. يشتق الخادم العدد من نفس الصفوف الكاملة المقبولة، بلا استعلام مستقل يمكن أن يختلف. لا تدخل المرتجعات في قسم التحصيل.

العقود المفتوحة: DateAndTime داخل الفترة لكل RentalAgreement/LeaseAgreement غير مبطل، سواء أقفل لاحقًا أم لا؛ هذا سجل بداية النشاط وليس قائمة الحالة الحالية. الفرع حسب مالك Agreement الحالي Vehicle.BranchId. Type لقصير الأجل Daily/Weekly/Monthly وللطويل Lease. SaleOrigin محفوظ في RentalAgreement فقط، وتظل خانة التأجير الطويل فارغة. EndDate في هذا القسم موعد العودة المتوقع ReturnDateAndTime أو Lease.EndDate.

العقود المغلقة: IsClosed حاليًا مع حدث CollectionMovement محفوظ للعقد، أحدث حدث بالوقت ثم الهوية، وتاريخ الحدث داخل الفترة. EndDate هو وقت التحصيل/العودة الفعلي لا الموعد المتوقع. يتبع مرشح الفرع BranchInId للحركة مع بقاء نطاق العقد المسموح. لا تُختلق أوقات للعقود التجريبية المستوردة المغلقة بلا حدث محفوظ؛ تسجل كفجوة بيانات. لا تغيير في دورة إغلاق العقود ضمن تقرير قراءة.

توضيح التنفيذ من مراجعة المصدر: يسمح بفحص هوية مستقل ومحدود للشركة لتحديد آخر حركة عودة فعلية للعقود المغلقة المرشحة، قبل مرشح الفترة والفرع المختار. يستخدم IgnoreQueryFilters مع SubscriptionId الصريح وIsDeleted!=true، ويعيد المعرّفات فقط ثم ينتهي قبل الاستعلام المنشور. تبقى قراءة الصف والفرع تحت QueryReport الطبيعي. يمنع ذلك ظهور حدث قديم مسموح كأنه الإغلاق الأخير عندما يقع الأحدث خارج الفرع المسموح؛ لا تتسرب صفوف أو تسميات من فحص الهوية.

الحركات غير التأجيرية: NRM.DateAndTime داخل الفترة، BranchId المحفوظ، الكود NrmNO ثم No، Staff المرئي، الوقود والعداد المحفوظان. الورشة WorkshopMovement.DateOf، BranchId المحفوظ، WorkshopMovementNo ثم No، وStaff هنا اسم الورشة الفعلية (Supplier أو InternalWorkshop أو ExternalWorkshop) كما بالصورة؛ الوقود enum يحول بصيغته المعتمدة. لا توجد عودة محفوظة في هذين الكيانين، لذا DateIn/FuelLevelIn/KmIn null صراحةً؛ لا اقتران زمني مصطنع أو نسخ من حالة المركبة الحالية. تبقى أعمدة الصورة التسعة.

الاستبدالات: LeaseAgreementVehicleReplacement الفعلي فقط، وقت OutgoingDateTimeOut، فرع OutgoingBranchOutId، مع بقاء صلاحية كامل العلاقة والعقد حسب المالك القائم؛ vehicle مركبة OutgoingVehicle الجديدة كما يكتب LeaseAgreementService، السبب ReplacementReason.Reason والملاحظات المحفوظة. لا يكرر DeliveryMovement الرديف، ولا يخترع استبدال إيجار قصير غير موجود. الأعمدة agreementNo/customer/replacementDate/vehicle/reason/notes.

الجذر يملك الواجهة والعقد والترجمات ودليل المستخدم والربط والصلاحيات والبناء والمصالحة. وكيل خادم محدد يملك الملفات الجديدة DailyBusiness في Business/ViewModels/Controller ومواصفاته فقط؛ لا تعديل ملاك ماليين أو كيانات أو فروع مشتركة. لا اختبارات تشغيل أو متصفح؛ البناء مسموح والمواصفات تُجمع فقط. لا موافقة جديدة للقرارات المحسومة بالمصدر وهذه المهمة.

توضيح مرشح الفرع وفق UI16: يستعمل فرع شريط النظام افتراضيًا عند وجوده ضمن الخيارات المسموحة، وإلا يبقى الاختيار خاليًا. يطبّق عند التهيئة/تغير السياق فقط، ولا يعيد ملء اختيار مسحه المستخدم عمدًا.

تعديل المالك اللاحق بتاريخ18 نوفمبر2026: تثبيت أدوات الصفحات أسفل مساحة كل جدول في التابات. يستعمل DataTable.fill ووضع scrollable خارج الطباعة، مع tab/currency pane محدود flex وoverflow:hidden. يكون تمرير الصفوف داخل المالك المشترك وتبقى أدوات الصفحات خارجه. تطلق الطباعة الحدود وتعرض الأقسام كلها كما في العقد؛ لا تغيير مصدر أو إجمالي أو نطاق مخرجات.
