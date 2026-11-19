# عقد إصلاح تقرير أسعار المركبات حسب مجموعة التعرفة

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-11-11 |

## التفويض والاختيار

### تعديل عرض المالك — ١٦ نوفمبر ٢٠٢٦

طلب المالك الاسم الإنجليزي الدقيق `Vehicle Price Base On Tariff Group`، ثم حذف الجزء المصور الذي يجمع ملخص المرشحات/العملة، ونص تفسير الأسعار، وقسم Price notes. يعلو هذا التوجيه شرط عرض تلك المنطقة في الشاشة والطباعة الوارد أدناه؛ أزيلت المنطقة من قالب التقرير وCSS الخاص بها، ووُحد الاسم في عنوان الصفحة وبند القائمة وعنوان الدليل. تبقى الأعمدة والأسعار والمرشحات ومخرجات Excel وسياقها وملاحظاتها بعقدها الحالي، مع بقاء null سعرًا غير متاح والصفر سعرًا محفوظًا. لا تعديل مصدر أو أذونات أو حساب أو API أو بيانات.

وافق المالك على تنفيذ التعديلات ثم فوّض اختيار الأقرب للصحة في السعر/المصدر. القرار: استخدام تعريفات Daily/Weekly/Monthly المستقلة والبطاقة الافتراضية مع إمكانية اختيار بطاقة محفوظة، وفق مفتاح TariffService/GetEditor الدقيق VehicleType+Type+TariffCard. لا ضرب لسعر اليوم في7/30، ولا استخدام tariffGroup النصي المتروك دون مالك تعيين في المحرر الحالي. يستمر اسم التقرير ومساره الحاليان؛ فلتر المركبة والموديل والنوع محفوظ، وتضاف بطاقة التعرفة بوضوح. لا تعديل محرر التعرفة أو كياناته أو تسعير العقود أو postings.

الساعة من Daily/Regular/Hour وشريحة تشمل الساعة1، واليوم من Daily/Regular/Day وشريحة تشمل اليوم1. الأسبوع من Weekly/Regular/Day، والشهر من Monthly/Regular/Day كقيمة الفترة المستقلة كما يعرض محرر التعرفة الدوري؛ تتطلب كل خانة اختيارًا واحدًا. غياب التعرفة/السعر/النطاق => null وملاحظة missing، تعدد تعريفات السياق أو الصفوف المناسبة أو نطاق غير صالح => null وملاحظة ambiguous/invalid. الصفر المسجل فعليًا يبقى0. لا Weekend/Vacation fallback أو اختيار First تعسفي. للبطاقة المحددة exact saved selection فقط؛ لا استعارة قالب Default غير محفوظ. لا حساب خصم أو حجز أو ضريبة أو تحويل عملة؛ هذا تقرير أسعار معرفة بعملة الأساس، وليس محاكاة سعر عقد/تاريخ.

## عقد القراءة المشترك

المسار `/Reports/VehiclePriceBasedOnTariffGroup`. المالك الحالي IVehicleReportsService/VehicleReportsService/VehicleReportsController. GET `VehicleReports/VehiclePriceBasedOnTariffGroup` يعيد Result<VehiclePriceBasedOnTariffGroupReportVm>. Query: vehicleId,carModelId,vehicleTypeId,tariffCardId nullable positive integers. يزال tariffGroupId غير المستخدم في الواجهة ويستبدل بعقد البطاقة الجاري؛ لا legacy workaround لبيانات تجريبية.

الاستجابة entity: rows:VehiclePriceBasedOnTariffGroupRow[],currencyCode:string,decimalPlaces:number,tariffCardId:number|null,tariffCardName:string|null,issues:VehicleTariffPriceIssueVm[]. الصف: vehicleId:number,plateNo:string,color:string,makeAndModel:string,hourlyRate/dailyRate/weeklyRate/monthlyRate:string|null؛ كل المال exact decimal strings عبر converter. issue:vehicleId:number,rate:string (hourlyRate/dailyRate/weeklyRate/monthlyRate),reason:string (missing/ambiguous/invalid). الصفوف كاملة غير مرقمة خادميًا ومرتبة plateNo ثم vehicleId؛ local paging فقط، لا جمع أسعار كمجاميع مالية.

GET `VehicleReports/VehiclePriceBasedOnTariffGroupOptions` => Result<VehicleTariffPriceOptionsVm> entity vehicles/carModels/vehicleTypes/tariffCards arrays of {id:number,name:string}. خيار الافتراضي محلي id=null واسم مترجم. مصادر مباشرة خفيفة تابعة للتقرير لا cache جديد، tenant/branch scopes عبر QueryReport. GET `VehicleReports/VehiclePriceBasedOnTariffGroupExport` بنفس query/response لأخذ مجموعة كاملة بإذن مستقل.

## الصلاحية والعمر والمخرجات

مفاتيح permission: read `VehicleReports.VehiclePriceBasedOnTariffGroup`; options `VehicleReports.VehiclePriceBasedOnTariffGroupOptions`; export `VehicleReports.VehiclePriceBasedOnTariffGroupExport`. options/export لهما prerequisite read في الخادم. مسار الشاشة يتطلب read+options؛ print read؛ Excel read+export. الحماية الفعلية عبر global filter وBranchOperationRules ReportEffects. لا grants تلقائية أو طلب صلاحيات CRUD كي يمكن قراءة خيارات تقريره. لغة أسماء العمليات EN/AR.

الشاشة typed FormGroup، ReportPage/FeatureTitle/DataTable/ReportActions/ReferenceLookupStatus/StateMessage وReportPrintSession. سبعة أعمدة مطابقة للصورة، مع vehicleId هوية ثابتة. جميع الأسعار nullable exact money، null ليس0. issues تعرض بنص واضح مترجم ضمن التقرير والمخرجات. الطباعة وExcel يشملان كل الصفوف والسياق/البطاقة والعملات والملاحظات، لا الصفحة الحالية. لا TreeNode/children/accounts أو any. تغير الفلاتر يبطل النتائج ويلغي القراءة؛ bootstrap مستقل عن إبطال البحث ولا تلغيه حركة تحرير عارضة؛ إيقاف النموذج أثناء busy. صفحة loader لbootstrap/read/export، finalize لكل اشتراك، مصدر خطأ واحد وRetry.

تلتقط القراءة mounted session وdataContext؛ denied$ يلغي context/access reads، والمنشورات/الأحداث تفحص المالك فورًا قبل عرض/تصدير. renewal لا يغير session key. السياق يمسح الخيارات/IDs/المخرجات، ويرجع bootstrap عند المنح. إلغاء الطباعة المؤجلة عند المنح/سياق/جلسة/تدمير. لا cache مالي أو watch على مصدر لم يopt-in.

## خطة التنفيذ والملكية

١. الجذر يثبت العقد والقرارات والمراجعة المرجعية السابقة، ويملك backend report/DTO/permission/wiring/translations/integration/final review. يُفصل تقرير الأسعار إلى partial من مالكه الحالي بدل تعديل تقرير الشاسيه أو الربحية.

٢. عامل واجهة مستقل يملك Reports/VehiclePriceBasedOnTariffGroup/** وUserGuide/content/vehicle-tariff-price-topic.ts فقط؛ لا shared/routes/sidebar/vocabs أو backend. يكتب مواصفات سلوكية مصدرية بلا تشغيل. الجذر يدمج الدليل والمفاتيح والمسار.

٣. الجذر يراجع producer/consumer/namespace/full scoped diffs لكل مستودع، ويحدث review والمصالحة والدليل. مراحل0/1/2/5/6؛ لا3 editor أو4 domain mutations للتقرير. لا عمل schema أو AutoMapper أو migration؛ إن ظهر احتياج مادي يتوقف جزؤه فقط.

## المراجع والتحقق

الصورة4 وSpeed2026-10-28 screen23/02 routeR0394/C1085 مع S205 المتعارض، وOdoo19 products.rst المستعمل بالمراجعة السابقة؛ لا توسيع كود جمع خارجي. تقرير المراجعة السابق يسجل mismatches والكلية والعقود. UI07/20/21/22/26/28 وBE17/2 هي المالك؛ أُعيد فحص الحزم الثماني OK. لا builds/tests/lint/browser/DB/migrations/snapshots/commits/push. مواصفات الاختبارات تكتب ولا تُنفذ بسبب حد المصدر؛ لا ادعاء RED/GREEN أو قياس سرعة. الكود/العقود القائمة توضح المعتمد؛ التحقق التشغيلي والمنح/RTL/themes/print وSQL عند المالك.
