# مراجعة تقرير تفاصيل تأجير المركبات

## حذف العنوان المكرر — ١٦ نوفمبر ٢٠٢٦

بطلب المالك حُذف h2 المكرر Current fleet status داخل التاب، مع إبقاء عنوان التاب ورابط ARIA وتاريخ الملخص. أزيل محدد h2 غير المستخدم من SCSS. لا تغيير وظائف أو بيانات/تحميل/كاش أو عقود مالية؛ دليل التابات الحالي صالح دون تعديل. نجح ngc --noEmit المحدود للمكون والقالب، وفحص الفراغات ومراجعة الشريحة؛ حُذف إعداده المؤقت. لا اختبارات أو متصفح أو بيانات أو نشر، والمعاينة الحية معلقة. اقتراح commit: `fix(reports): remove duplicate fleet status heading`.

## صف الفلاتر والمعلومات وتابات النتائج — ١٦ نوفمبر ٢٠٢٦

نفذ طلب المالك ترتيب الشهر وفئة العقد والأفعال على صف واحد بالمالك المشترك inline/stable وreserveMessage للشهر، دون تعديل القيم أو التحقق أو الأفعال الخمسة. نُقل نص amountBasis نفسه من الشريط الظاهر إلى EditorDialog للقراءة، يفتحه زر Info الأخير في صف الإجماليات. تحرسه صلاحية القراءة والنتيجة الحالية، ويغلق عند إبطالها أو تغير السياق؛ لا طلب أو تحميل أو حساب جديد.

استبدل المالك طلب الطي بطلب تابات؛ الحالة النهائية Rental details وCurrent fleet status بمكوّن EditorTabs appearance=workspace ذي مفاتيح مكتوبة وربط ID/ARIA ولوحتين قابلتين للتركيز. كل تاب يشغل العرض كاملًا، وتبقى اللوحتان مركبتين مع إخفاء غير النشطة في screen فقط. أزيل تخطيط العمود الجانبي والطي السابق بالكامل. يبدل selectTab العرض ويعيد تمرير الجدول المختار للبداية بواجهته العامة دون طلب أو نقل التركيز من التاب. تعيد تعديلات المرشحات/Reset والسياق التاب الأساسي، ويحافظ Refresh لنفس المرشحات على الاختيار. تبقى الطباعة لقسمي التقرير، وExcel كاملًا وفق عقد المخرج القائم؛ طلب التابات لا يغير هذا النطاق المجمد ضمنيًا.

مرجع العرض UI20/13، والملاك الفعليون ReportActions/FieldError/EditorTabs/EditorDialog/DataTable؛ قورنت دلالة الشهر والفئة مع دليل Speed فصل16 وشاشة23/04 وكود C1087 المؤرخ2026-10-28 ومع العقد والدليل الحاليين. لا قرار أعمال أو مالية جديد يستدعي Odoo إضافيًا. خيارات الفئات محلية، وقراءات التقرير والتصدير والبريد تحت الملاك القائمين؛ لا URL أو trigger أو مصدر كاش أو invalidation/watch أو ميزانية تحميل جديدة. لا تغيير backend أو SQL/حجم بيانات/index/schema، فلا مؤشر جديد لهذا العرض ولا ادعاء سرعة مقاسة. التعديل Tier S مترابط بلا تفويض عوامل، والبطاقات/الحسابات والإجماليات خارج إعادة التصميم.

نجح ngc --noEmit المحدود بعد آخر تعديل للمكوّن والقالب والدليل والترجمتين، exit0. روجعت الفروق المحددة كاملة مع حفظ تعديلات ملفات الترجمة السابقة واجتاز فحص الفراغات، وحُذف إعداد التجميع المؤقت. حُدث دليل Reports المسجل في /UserGuide/reports بشرح الصف وInfo والتابات والمخرجات. لم تُنفّذ اختبارات/lint أو متصفح أو بيانات أو نشر؛ قبول المقاسات واللغتين والثيمين ونافذة Info وطباعة القسمين معلّق عند المالك. اقتراح commit للواجهة: `fix(reports): align rental filters and add info and result tabs`.

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-11-11 |
| Mode | Authorized implementation after discovery; source-only verification |
| Tier / shape | M / UI07 Report / BE5 |

## إصلاح أنواع الأعمدة بعد سجل أخطاء المالك — ٢٠٢٦-١١-١١

شريحة S تحت التفويض القائم. أخطاء TS2322/TS2345 سببها إضافة Partial<Record<dayN,string>> إلى row interface مع تمرير صفوف API دون هذه index signature. أزيل النوع الافتراضي DisplayRow، واستعمل VehicleRentalDetailsRowVm نفسه في العرض والتصدير والتذييل. أعمدة الأيام ترتبط الآن بحقل cells الحقيقي، برقم يوم مستقل في header وvalue callback الحالي؛ field/header pair يميز الأعمدة وفق UI5، وتبقى filterable:false لأنها عرض يوم مختار من مجموعة خلايا. لا مفاتيح API جديدة أو any/index signature شاملة ولا تغيير للحسابات أو الأرقام أو تصميم الصفحة. حُدثت المواصفة الموجودة لاختيار اليوم بواسطة cells/header بدل المفتاح الوهمي؛ لم تُشغل.

فحص parse7 ملفاتTS وقالبينAngular وAST لأعمدة العرض/التصدير اجتاز دون قضايا، وفحص scoped diff whitespace سليم. فحص recipe -Check أعاد8/8OK. راجعت مصدر التعديلات المحددة مع الحفاظ على العمل السابق في المستودع؛ بناء Angular وtypecheck والاختبارات والقبول التشغيلي لم تنفذ. الدليل والعقد التجاري السابقان صالحان دون تغيير سلوك ظاهر، ومصالحة أسماء الأعمدة هنا تقنية. لا schema/backend أو query/cache/loading/index impact؛ لا migration. المراحل2 و6 فقط؛ لا agent لأن الإصلاح صغير مترابط. اقتراح commit الواجهة: fix(reports): bind rental day columns to the actual cells field.

## النطاق والواقع

طلب المالك مراجعة الصورة6 وإنشاء التقرير إذا لم يكن موجودًا، ثم أضاف الصورة7 لتوثيق إجماليات نهاية التقرير. التقرير موجود فعليًا: Reports_Routes → VehicleRentalDetailsComponent وخدمته وموديلاته، Sidebar /Reports/VehicleRentalDetails، وVehicleReportsController/VehicleReportsService وVMs. لا ينطبق شرط الإنشاء ولا يشمل الطلب الحالي إصلاح تقرير قائم. هذا السجل وفهرس المراجعات فقط قابلان للتعديل؛ لا مصدر تطبيق أو دليل مستخدم أو إعدادات أو تعليمات.

المستودعان SiGmaAngularFrontEnd وSigmaBackend. ملفات ميزة الواجهة الستة وVMs الخلفية الثلاثة غير معدلة في git عند الاكتشاف؛ routes/VehicleReportsService/Controller عليها تغييرات سابقة من التقارير السابقة محفوظة ولا تنسب لهذه المراجعة.

المراجع المبدئية: AGENTS والدليل الحي ومهارة Sigma، README/INDEX، UI07/Master1/4/5/7/UI20/21/22/2/26/28/29 وBE17؛ الحزم الثماني recipe Check OK. مهارات Superpowers متاحة فعليًا بملفات using-superpowers/systematic-debugging/verification-before-completion. لا delegates لأن هذه مراجعة مترابطة بعقد مالي غير مجمد، ولا تشغيل build/test/lint/browser/database/migration/commit/push/deploy أو Sigma MCP/Graphify.

## جرد الأدلة

الصورة6: شهر2026-11، فلتر معنون Vehicle Type، Email/Excel/Refresh؛ ملخص Status/Count/Percentage مع Hired/Reservation/Service/Available/Nrm/ForSale/TotalLoss/Total؛ الصفوف plate/makeModel وأيام1..30 وخلايا status أو مبلغ يومي، ثم Total مالي للصف. الصورة7: footer يعرض Total:225 وعدد المركبات، وإجماليات مالية للأيام وإجماليًا عامًا. الأرقام لقطات دليل لا بيانات اختبار أو قاعدة حساب مالية بذاتها؛ إجمالي الملخص220 في6 وعدد footer225 في7 ليسا دليلًا على نفس population أو snapshot.

Speed2026-10-28 screen23/04 → R0398 raw4415 وC1087 raw287631–288124، ونافذة C1089 raw288247–288277. القالب يربط monthYear وvehicleType لكن dropdown مصدره agreementCategories Rental/Lease؛ ليس كيان VehicleType. هذه مفارقة تسمية مثبتة يجب أن توضح قبل تثبيت المرشح. الكود يقرأ getVehiclesSummary(vehicleType) مستقلًا بلا شهر، ثم getVehicleRentalDetailsReport(startDate,endDate,vehicleType). rate>0 فقط يدخل totalDaysRate، وvm.totalRate يجمع هذه القيم؛ vehiclesRentPerDay يجمع rate لكل الصفوف دون شرط موجب. لذا totals ليست بالضرورة صافيًا متصالحًا بين اليوم والصف والإجمالي العام. server source/formula للعملة/المبلغ غير محفوظين؛ لا نستنتجهما من الاسم.

الإنشاء غير مطلوب لأن التقرير موجود. تفاصيل النتائج/المصالحة ستستكمل هنا بعد تتبع المصادر والأدلة المباشرة.


## تغيير التفويض

بعد اكتشاف الموجود، طلب المالك تنفيذ كل التعديلات وفوض اختيار الأقرب في مبلغ اليوم وتوحيد المجاميع. انتهى حد المراجعة فقط من هذه النقطة؛ يثبت العقد الجديد في VEHICLE_RENTAL_DETAILS_IMPLEMENTATION_CONTRACT_FREEZE.md. تبقى فقرات عدم التنفيذ أعلاه تاريخ مرحلة الاكتشاف، ويضاف final reconciliation بعد المصدر. السعر المختار تحليلي لبند الإيجار المحفوظ، لا journal-date أو خادمSpeed مجهول؛ الصافي موحد شامل السالب.

## المصالحة النهائية — ٢٠٢٦-١١-١١

نُفذ العقد المجمد وخطة التذييل المشترك. الفقرات السابقة سجل اكتشاف وليست حدود التفويض النهائي. لا ادعاء مساواة مع معادلة خادم Speed غير المتاحة أو تحقق تشغيلي. الأقرب لطبيعة هذا التقرير التشغيلي هو توزيع بند الإيجار المحفوظ على أيام العقد الفعلية؛ التقرير المحاسبي المرحّل يبقى تقرير أرباح وخسائر المركبات المنفصل.

| المحتوى والدليل | النتيجة في Sigma | التغطية |
|---|---|---|
| الشهر، الفئة، Refresh؛ الصور6/7 وC1087 | شهر صارم yyyy-MM، الفئة Rental/Lease مع جميع الفئات، استبدال النتائج | Matched؛ تصحيح تسمية Vehicle Type المثبتة كمصدر فئات عقود |
| لوحة/صانع وطراز/أيام الشهر/Total | columns: plateNo,makeAndModel,day1..dayN,total؛ RowVM: vehicleId,plateNo,makeAndModel,cells[{day,status,amount,issue}],total | Matched؛ vehicleId هوية الحد الأدنى وcells تحمل العرض اليومي |
| تذييل عدد المركبات وإجماليات الأيام والعام؛ الصورة7 | vehicleCount,dayTotals,grandTotal مصدرها الخادم، footerRows داخل نفس الجدول | Matched وظيفيًا؛ محاذاة التشغيل والطباعة معلقة |
| ملخص Status/Count/Percentage/Total؛ الصورة6 | statusSummary مع statusSummaryTotal مستقل، نفس population وعدد المركبات | Matched؛ current snapshot بتوقيت ظاهر كما قراءة Speed بلا شهر |
| مبلغ rate وتعارض المجاميع في Speed | توزيع TotalCharge لبند Rent المختار الوحيد، مدة كاملة ثم قص الشهر، صافي في الصف واليوم والعام | قرار مفوض؛ معادلة الخادم الأصلية Uncertain وليست منسوخة |
| الحالات اليومية | آخر حالة/حركة مع الحجوزات والعقود، unknown عند الغياب أو التعارض | Partial تاريخيًا؛ لا توجد إعادة بناء كاملة لإسناد الاستبدالات |
| استبدالات Lease | attributionUnavailable للمركبات المتصلة بدل نسبة دخل تخمينية | قيد مصدر موضح بالخلايا والدليل، دون backfill |
| Excel/Email؛ C1087/C1089 | قراءة كاملة حديثة للتصدير والبريد، ملخص وتذييل، بريد مستلم واحد ومحتوى من الخادم | Matched مصدرًا؛ SMTP والملف الفعلي معلّقان |
| قالب Speed القديم بإعلان P/L grid | استبعاد الإعلان المتناقض مع matrix الفعلية | Excluded بالدليل؛ لا أعمدة مالية غير ظاهرة مخترعة |

اكتملت قراءة Speed README/catalog ومقطع التحليل الأصلي المتاح للفصل16 وS020/S194، ثم sidebar23/04 وR0398/C1087/C1089. بنية القالب المحفوظة ذات البصمة fcb947bef4b9ce81f5b41d00f2dec6a606e9098a2b1db753d596f74256d3ca97 استُخدمت كدليل ربط لا كقاعدة خادم. بعد Speed قرئ README/matrix لمجموعة Odoo19 المثبتة2026-11-02 ومصدر fleet/cost_analysis.rst؛ مكمل لمفهوم تحليل الأسطول فقط، لا يحدد معادلة الإيجار اليومية أو قواعد الحالة أو صلاحيات Sigma.

## الملفات والمالكون والمراحل

في مستودع الواجهة: مجلد Reports/VehicleRentalDetails للـcomponent/template/style/models/service/access ومواصفات component/service؛ إزالة خدمة وموديل الملخص الوهميين؛ route-access-policy، تسميات permission-tree وauthorization، مفاتيح en/ar، layout.module لإزالة تسجيل مكرر، tsconfig.app للملفات التشغيلية الصريحة. دليل vehicle-rental-details-topic مسجل في reports-guide، والاسم القديم في table-workspace-topics يعيد تصدير الموضوع نفسه إلى RentalGuide. المسار الحالي للدليل وقائمة التقارير محفوظان؛ رابط الموضوع /Reports/VehicleRentalDetails.

في مستودع الخلفية: VehicleReportsService.cs وإضافتا RentalDetails وRentalDetailsEmail، IVehicleReportsService، VehicleReportsController، DTOs تحت ViewModels/VehicleReports، وسياسة VehicleRentalDetailsReadPolicy وأشكال القراءة المنفصلة، BranchOperationRules وPermissionPrerequisites، موارد GeneralMessage للغتين، ومواصفات السياسة والصلاحيات. لا AutoMapper لهذا الإسقاط التحليلي؛ projection صريح ولا تغيير خرائط أو كيانات أو EF أو migrations/snapshots.

اكتملت مراحل0 اكتشاف و1 عقد و2 قراءة/جدول و5 تكامل و6 مصالحة؛ من3 نافذة البريد فقط، ولا editor CRUD أو كتابة مستند مالي. المرحلة4 لا انتقال مجال مطلوب. توسيع shared DataTable محصور في footerRows الافتراضي الفارغ؛ الدليل UI6 ومهارة Sigma routing/revision تحديثا معًا ثم أعيد توليد الحزم من المصدر وإعادة فحصها. لا تعديل مباشر للحزم، والتغيير الدلالي لا ينقل سلطة الحساب أو يغير مراجع الأشكال المعتمدة.

| الموضوع | المرجع والمالك الفعلي | المصالحة |
|---|---|---|
| صفحة التقرير والفلتر | UI07,UI20؛ approved StatementOfAccount shape؛ ReportPage/FeatureTitle/ReportActions/DatePicker | لا page-height خاص؛ فئات ثابتة محلية لا lookup غير حقيقي |
| الجدول والتذييل | UI6؛ DataTable/displayValue/formatMoney | أعمدة واحدة وtfoot ثابت خارج التصفية والترقيم والاختيار والأفعال؛ توضيح نطاق الإجمالي الكامل |
| الطباعة والتصدير | UI21/UI8؛ ReportPrintService/dataTableExportRows | جميع الصفوف والإجماليات والملخص، printAllRows، دون جمع مالي في العميل |
| البريد | UI13/28؛ EditorDialog/ConfirmationDialog وMessageDeliveryService | تحميل محلي، sent POST مستقل؛ نتيجة uncertain بلا إعادة آلية، تحذير قبل التكرار داخل النافذة |
| المال | UI19/BE15؛ FinancialNumberPolicy وNullableCurrencyAmountJsonConverter | نصوص مالية دقيقة؛ تجميع خادمي، NULL عند مساهمة غير معروفة؛ توزيع القيمة المطلقة ثم إعادة الإشارة يحفظ إشارة المبالغ السالبة |
| الوصول | UI26؛ AccessViewPolicy/route registry وPermissionAuthorizationFilter | read موجود؛ Export/Email يتطلبان إذنهما + read، دون منح تلقائية |

## التحميل والكاش والعمر

قراءة التقرير والتصدير GET مباشرتان تشغيليتان، بلا تبني reference cache أو singleton أو TTL؛ البيانات المتغيرة مرتبطة بالمرشحات/الفرع/المستأجر. الفئات ثوابت محلية1/2، لا bootstrap lookup. الملخص يعاد مع نفس التقرير؛ أزيل الطلب غير الموجود بدل مالك تحميل ثانٍ. request واحد ظاهر في كل عملية قراءة؛ defer/startLoading وfinalize/endLoading بمالك الصفحة، وshowLoadingIndicator=false في الجدولين يمنع تكرار progress. حالة الخطأ تدعم HTTP وfalse-envelope وRetry، والنتيجة الفارغة واضحة. لا تعني مطابقة المصدر قياسًا لظهور loader.

تعديل الفلتر أو dataContext أو session/permission expiry يلغي القراءة والطباعة المؤجلة ويخفي الناتج والـbody portals؛ generation وowner fencing يمنعان نشر استجابة قديمة، واشتراك outputExpiry يمنع إحياء النتيجة عبر revoke/regrant. تدمير العرض ينهي القراءات. البريد المرسل يحتفظ بعمره المستقل مع منع نشر نتيجة قديمة؛ لا automatic retry ولا durable outbox/idempotency جديد. إغلاق النافذة وإعادة فتحها ليس سجلًا دائمًا للمحاولة السابقة، لذلك يشرح الدليل عدم تكرار الإرسال غير المؤكد دون تحقق.

## الاستعلامات والأداء والفهارس

المصدر القديم أرسل طلبين بطرق/عقود غير متطابقة وأعاد أيام تأجير بدل المال؛ ليس baseline قياسًا صالحًا. الحالي GET واحد يعيد المصفوفة والملخص والتذييل، وإسقاطات QueryReport بلا tracking مع tenant/softdelete/branch owners؛ حذف/void/cancel مستبعد. أعلى مسار all-categories يتضمن8 قراءات محدودة العدد: العملة، الأسطول، rental، lease، replacements، charges، bookings، واتحاد الأحداث. لا SQL داخل حلقة المركبات أو الأيام؛ التحويل بعد materialization. آخر baseline قبل الشهر لكل مصدر مع أحداث الشهر فقط بدل تحميل التاريخ كله. تبقى كلفة history correlates وتوزيع كامل العقود الطويلة وحجم matrix مجال قياس فعلي؛ لا ادعاء speedup مقاس.

الفهارس المصدرية القائمة VehicleStatus(SubscriptionId,VehicleId,CreatedAt DESC,Id DESC) INCLUDE(Status,IsDeleted)، وNRM/Workshop بالتركيب نفسه على DateAndTime/DateOf، وCustody/Delivery(SubscriptionId,VehicleId,MovementDate/DateAndTime) تغطي بادئات الوصول. لا فهرس مطابق مثبت في CollectionMovementConfig؛ مرشح بعد SQL plan فقط: (SubscriptionId,VehicleId,DateAndTime DESC,Id DESC) INCLUDE(IsDeleted). فائدته seek للـbaseline/أحداث المركبة، وكلفته التخزين وصيانة كتابة الحركات؛ قد يتداخل مع FK VehicleId دون أن يغطي التاريخ/المستأجر. يلزم مقارنة existing deployed indexes، cardinality وactualplan قبل تبنيه. باقي overlap predicates والـBookingCharge shadow AgreementId تراجع ببيئة المالك قبل اقتراح إضافة أخرى؛ لا schema change مطلوب للتنفيذ الحالي، ولا Add-Migration الآن. لو اعتمد المالك الفهرس لاحقًا فالاسم المقترح AddVehicleRentalDetailsReadIndexes ضمن شريحة منفصلة.

قياس المالك القابل للتكرار: نفس المستأجر/الفرع/الشهر والفئة وحجم الأسطول، حالات cold/warm، سنوات تاريخ ثابتة؛ قياس زمن GET/حجم response وعدد roundtrips وlogicalreads/actualplan للـbaseline والاتحاد، ثم مقارنة قبل/بعد أي فهرس مع كلفة الكتابة. الترجمة الفعلية لاتحاد EF/Any المترابط معلقة. وحدت جميع DTO projection members ومنها Code=null لتجنب set-operation mismatch ظاهر في المصدر.

## فحوص المصدر المنفذة والقبول المعلق

اجتاز parser لـ17 ملف TypeScript وقالبين Angular دون diagnostics؛ تطابق58 مفتاح ترجمة للميزة، وعدم وجود مفاتيح literal مفقودة؛8 ملفات ذات import/export محلي بلا مسار مفقود؛ ملفات التشغيل صريحة دون إدخال specs في app compile. ملفات RESX صالحة وتطابق37 مفتاحًا جديدًا. فحص PrimeNG usage للتذييل صحيح source metadata، مع مراجعة table footer example ومالك PrimeNG المثبت؛ لا نتيجة browser. recipe -Check أعاد8/8 OK بعد regeneration. مراجعة فروق الملفات المحددة في كل مستودع وgit diff --check، وفحص الملفات الجديدة للمسافات/merge markers. لا تنسب التغييرات السابقة أو المتزامنة خارج الشريحة إلى هذه المهمة.

تحقق namespace/project-reference/default source inclusion وDI: GlobalUsing الفعلي يضم IServices/EF/models/results وDataAnnotations؛ Business يشير إلى ViewModels/Helpers، وViewModels إلى Helpers، وassembly scanning القائم يسجل IMessageDeliveryService. لا إنشاء مباشر VehicleReportsService بالمصادر المفحوصة. هذه قرائن مصدر لا نجاح compile.

كتبت5 حالات سياسة توزيع،8 حالات صلاحيات،9 حالات عمر component،3 حالات عقد HTTP، وحالتي footer. لم تُشغل؛ لا ادعاء RED/GREEN. التدقيق المستقل كشف انعكاس إشارة remainder عند توزيع -1 على200يوم، عولج باستخدام positive shared allocation ثم إعادة الإشارة مع مواصفة تحقق200حصة غير موجبة ومجموع-1. راجع العامل الإصلاح مصدريًا. لا تغيير للسياسة المالية المشتركة أو لكتابة المستند.

على المالك إجراء build/spec execution أولًا، ثم تجربة فبراير الكبيس و30/31 يوم وآخر يوم مع توقيت، عقد عابر للشهر وسالب/صفر وحصص صغيرة، حجوزات ملغاة وvoid/softdelete، حالة غائبة/متعارضة واستبدالات، تطابق row/day/grand totals أو NULL، وsummaryTotal=count مع empty0%. التحقق من tenant/branch، denied/read-only/export/email grants، revoke/regrant/session/route expiry أثناء القراءة والطباعة والبريد، والمحاذاة والتمرير والتصفية/الترقيم وRTL/light/dark والطباعة/Excel كاملين. تشغيل SMTP مصرح منفصلًا مع accepted/rejected/uncertain وMessageLog، ودون إعادة آلية. موافقة خدمة البريد لا تثبت وصول الصندوق.

استخدم عامل واحد موروث النموذج لدور terra_worker: ملكية Reports/VehicleRentalDetails/** وموضوع الدليل فقط بعد freeze؛ الجذر تكفل بالخادم والتذييل المشترك والتكامل والترجمات والقرارات. أعيد استخدام العامل لتدقيق خادم read-only بدل تكرار فريق، لتوفير الوقت دون تداخل ملكية؛ محاولات agents القديمة غير النشطة ليست تنفيذًا جديدًا. راجع الجذر التسليم والفرق وعالج نتيجة التدقيق. استخدمت مهارات Sigma وعمليات Superpowers المتاحة وPrimeNG router/component guidance ضمن حدود المصدر فقط.

اقتراح commit للخلفية فقط: `fix(reports): implement vehicle rental details analytical read and guarded delivery`.
اقتراح commit للواجهة فقط: `fix(reports): reconcile rental details matrix totals outputs and access`.
لا commits منفذة؛ ولا build/test/lint/browser/database/migration/snapshot/push/deploy أو Sigma MCP/Graphify أو إرسال بريد فعلي أثناء العمل.

## متابعة أخطاء التجميع — ٢٠٢٦-١١-١٢

| البند | النتيجة |
|---|---|
| الحالة | Implemented — source-only |
| تحقق المالك معلق | yes |
| النطاق | Tier S؛ إصلاح إسقاط تاريخ الحالة فقط مع مراجعة عقد الخدمة والمتحكم |

السبب المؤكد لخطأ CS0266 هو أن `EntityBase.CreatedAt` من نوع `DateTime?`، بينما `VehicleRentalStatusEventReadRow.At` من نوع `DateTime`. أضيف شرط `CreatedAt.HasValue` قبل إسقاط أحداث الحالة في `VehicleReportsService.RentalDetails.cs`، ثم تقرأ القيمة المؤكدة. السجل غير المؤرخ لا يثبت حالة يوم تاريخي؛ لا يُخترع له تاريخ، وتظل `unknown` عند غياب أحداث مؤرخة وفق العقد المجمد. لا تغيير للكيان أو المخطط أو الحسابات أو صلاحيات التقرير أو واجهته ودليله.

أما أخطاء CS1503 وCS1061 المبلغ عنها في المتحكم فلا تطابق المصدر الحالي: `IVehicleReportsService` يحتوي بالفعل على توقيع القراءة بمعاملَي `VehicleRentalDetailsSearchVm` و`CancellationToken`، وعلى `EmailVehicleRentalDetailsReportAsync` و`GetVehiclesRevenueOptionsAsync`، ولها تنفيذ مطابق في الأجزاء الثلاثة للخدمة. روجعت namespaces وglobal imports ومراجع المشاريع والإدراج الافتراضي للمصدر؛ لا استبعاد لهذه الملفات. لذلك لم تُضف overloads قديمة أو تعديلات بديلة إلى عقود صحيحة. يبقى تحديد حالة تجميع Visual Studio الفعلية معلقًا حتى بناء المالك، ولا ينسب هذا الفحص سببًا مؤكدًا للأخطاء التابعة.

التحقق المنفذ: تحليل صياغة Roslyn لتسعة ملفات مرتبطة بلا أخطاء صياغة؛ مراجعة التوقيعات والمراجع وفرق مستودع الخلفية المحصور، وفحص whitespace. لا يثبت ذلك نجاح البناء أو ترجمة استعلام EF. على المالك بناء Business ثم ServerAPI، وتجربة سجل بلا تاريخ وآخر بتاريخ مؤكد، مع توقع تجاهل الأول في التسلسل التاريخي وبقاء الثاني. لا هجرة مطلوبة، ولا تغيير frontend أو AutoMapper أو فهارس أو عدد القراءات؛ شرط التاريخ يضيق نفس الاستعلام فقط. لم تُستخدم عوامل فرعية لصغر الإصلاح وترابطه، ولم تُنفذ أوامر build/test/lint أو تشغيل تطبيق أو قاعدة بيانات أو commit/push/deploy.

اقتراح commit للخلفية: `fix(reports): exclude undated vehicle status events from rental details`.
