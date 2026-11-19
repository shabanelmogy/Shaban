# مراجعة تقرير أسعار المركبات حسب مجموعة التعرفة

## تعديل الاسم وحذف منطقة الملخص — ١٦ نوفمبر ٢٠٢٦

بتوجيه المالك ولقطته123.PNG، وُحد الاسم الإنجليزي إلى `Vehicle Price Base On Tariff Group` في عنوان التقرير والقائمة والدليل. أُزيل شريط ملخص المرشحات ونص تفسير السعر وPrice notes من الشاشة والطباعة؛ أزيل CSS المخصص وأصبحت مساعدات السياق/الملاحظات خاصة بالتصدير مع إزالة computed الخريطة غير المطلوبة للعرض. أعمدة الجدول والمرشحات والبيانات والأذونات ومخرج Excel لم تتغير. عُدل الدليل في `/UserGuide/reports` ليطابق عرض الجدول وملاحظات Excel. توجيه العرض مضاف لعقد التنفيذ نفسه، ولا أثر مالي أو schema أو cache/loading/query/index جديد. شريحة Tier S، مراحل العرض/التكامل/المطابقة فقط، بلا تفويض أو تحليل وظيفي جديد؛ مرجع UI20 ومالكو ReportPage/DataTable الحاليون والعقد القائم.

نجح ngc --noEmit للمكون وقالب Angular والترجمة الإنجليزية والدليل؛ حُذف إعداد التجميع المؤقت. فُحصت الفروق المحصورة والفراغات وبقاء الاسم في مواضعه الثلاثة، وغياب المنطقة من القالب. أُبقيت التعديلات السابقة. لم تُشغّل tests/lint أو متصفح أو SQL أو commit/push/deploy؛ القبول البصري معلق. اقتراح commit للواجهة فقط: `fix(reports): rename tariff price report and remove summary notes block`.

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-11-11 |
| Mode | Authorized implementation after source-read-only review; source-only acceptance |
| Tier / shape | M / UI07 Report / BE5 |

الجزء التالي يحفظ نتائج مراجعة الأساس قبل التفويض. الحالة الحالية وقرارات التنفيذ والتحقق مسجلة في قسم «مصالحة التنفيذ» بنهاية الملف؛ عبارات عدم التنفيذ في المراجعة تصف تلك المرحلة السابقة.

## النتيجة والنطاق

التقرير **موجود** بمسار `/Reports/VehiclePriceBasedOnTariffGroup`، مع مكون وخدمة وموديل في Reports/VehiclePriceBasedOnTariffGroup، وخدمة خلفية وDTOs لدى VehicleReports. شرط الإنشاء في طلب المالك لا ينطبق. لم يُنشأ تقرير مكرر ولم يُعدّل مصدر التطبيق. هذه مراجعة لعقد قائم مع نتائج مؤكدة بالمصدر؛ ليست مصادقة تشغيلية أو عقد تسعير جديدًا.

الصورة4 دليل وظيفي: المركبة، الماركة والموديل، الحقل المعنون نوع المركبة؛ أعمدة اللوحة/اللون/الماركة والموديل/الساعي/اليومي/الأسبوعي/الشهري؛ إجراءات تقرير وExcel وتحديث. ألوانها وشكل الجدول ليست مرجع تنفيذ. مرجع Sigma المعتمد هو ReportPage/ReportActions/DataTable وStatementOfAccount، لا الشجرة القديمة.

## النتائج مرتبة بالأثر

| الأولوية | النتيجة وشرط ظهورها | الدليل المصدرّي | التصحيح المقترح دون تنفيذ |
|---|---|---|---|
| P1 | طلب التقرير لا يتصل بالمسار الفعلي. وحتى تغيير URL وحده يترك استجابة غير قابلة للقراءة وأسماء مرشحات غير مرتبطة | خدمة Angular سطور20–25 تطلب `Report/VehiclePriceBasedOnTariffGroupReport` وترسل vehicle/makeAndModel/vehicleType؛ Controller75–81 يملك GET `VehicleReports/VehiclePriceBasedOnTariffGroup` ويربط VehicleId/CarModelId/VehicleTypeId/TariffGroupId ويعيد array مباشرة؛ المكون214 ينتظر res.accounts. لم يوجد alias للعنوان القديم في controllers | توحيد URL/query/response end-to-end لدى المالك القائم؛ لا endpoint وهمي أو تقرير مكرر |
| P1 | المستخدم العادي يُمنع من فتح التقرير حتى لو مُنح صلاحية API؛ المسار غير معتمد في سجل الواجهة | route موجود في reports.routes.ts25 والقائمة sidebar-menu-data.ts1234؛ route-access-policy لا يحتويه ولا سياسة reports عامة، وallows يعيد false عند غياب policy؛ LayoutModule220 يطبق currentAccessGuard | تبني مسار التقرير وعمليات الخيارات/المخرجات بمفاتيح الخادم الحقيقية؛ لا تجاوز الحارس. هذه فجوة adoption معروفة عامًّا في UI30#20، موثقة هنا للتقرير تحديدًا |
| P1 | فلتر الماركة والموديل يحمل هويات ماركات بدل الموديلات، والحقل الثالث لا يحقق معنى مرجع الشاشة | المكون133 يقرأ CarMakeService.get وعنوانه CarMake، بينما DTO الخلفي CarModelId؛ مرجع Speed C1085 يرسل tariffGroupId من dropdown ذي label Vehicle Type؛ Angular الحالي يرسل vehicleType | استعمال مصدر CarModel/GetMakeAndModel أو مالكه المعتمد، وحسم/تسمية مجموعة التعرفة مقابل نوع المركبة دون مساواة هوياتهما |
| P1 | السعر قد يأتي من تعرفة أو بطاقة مختلفة عن المقصودة. وجود تعريفتين لنفس VehicleType مع Type أو TariffCard مختلف يكفي لإظهار الخلل | VehicleReportsService480–494 يقرأ التعرفات النشطة ويجمعها بحسب VehicleTypeId فقط ثم g.First بلا OrderBy؛ TariffConfig يسمح بسجلات متميزة بمفتاح SubscriptionId,VehicleTypeId,Type,TariffCardId؛ TariffService171–226 يختار السياق الدقيق ويقدم fallback واضحًا للمحرر | تثبيت سياق التقرير: مجموعة التعرفة، نوعها، البطاقة/الافتراضي، ومعنى أسعار الأسبوع والشهر؛ إعادة استعمال مالك الاختيار المؤكد، لا ترتيب تعسفي يخفي القرار |
| P1 | سطر سعر محذوف قد يُعرض، وغياب Regular أو غياب bucket يتحول إلى سعر آخر دون تشخيص | VehicleReportsService480 Include(RentalRates) بلا child live/tenant predicate؛ GetRate541–571 لا يستبعد IsDeleted، يبدل Regular بأي Weekend/Vacation ثم بأصغر FromDay، ويعيد0 عند الغياب؛ في المقابل TariffService280 يستبعد المحذوف ويطلب نطاقات صحيحة | مصدر قراءة tenant/live لكل child؛ تحديد الحالة عند غياب السعر والتداخل ومنع fallback غير المعتمد. تمييز صفر محفوظ من سعر غير متاح |
| P2 | البحث المتكرر يضيف النتائج الجديدة إلى السابقة بدل استبدالها؛ تعديل المرشحات لا يزيل بيانات البحث السابق ولا يلغي طلبه | المكون187 يحدث files عبر append، و214 يقرأ المصدر؛ لا reset في getListItems. takeUntilDestroyed وحده لا يلغي search أقدم عند search أحدث أو تغيير فلتر؛ shared onCancel يعيد النموذج دون مسح output | لقطة applied filters، طلب أخير واحد، استبدال array كامل وإبطال المخرجات عند التعديل؛ no accumulation |
| P2 | الخطأ أو إلغاء الاشتراك قد يترك عداد التحميل محجوزًا، ولا يوجد Retry للحالتين isSuccess=false/HTTP failure | loadDropDowns129 يضيف startLoading وينهي167 في complete فقط؛ search179 يضيف startLoading وينهي191 في next فقط، لا error/finalize. الخدمة المشتركة LoadingService تحتفظ بعداد ولا تصفره عند التنقل | defer/finalize لكل اشتراك؛ مالك مرئي واحد بالصفحة، حالة خطأ وترجمة وRetry، وإلغاء عند context/access/session |
| P2 | إجراء Report وExcel غير منفذين في واجهة Sigma الحالية، مع استخدام شجرة لصفوف مسطحة | قالب المكون يمرر app-reports فقط. ReportsComponent يعرض Search/Cancel وشجرة بصفحات5 ولا يملك export/print؛ config.isTree=true رغم backend array مسطحة؛ لا ReportPrintSession أو feature title داخل هذا المسار | تطبيق التقرير المسطح والجدول المشترك ذي الأعمدة المحددة، طباعة/Excel لكل المجموعة المطبقة، وعنوان ميزة؛ لا نسخ export DOM الخاص بسبيد |
| P2 | الدقة المالية والتوضيح وقراءة الخيارات لا تتبع العقود الحالية، والدليل غائب | معدلات DTO decimal تصل JSON numbers وAngular number وتُعرض interpolation بلا policy/عملة. الخيارات تقرأ CRUD كاملًا من Vehicle/CarMake/VehicleType دون مصدر select/watch معتمد. لا topic بالمسار في دليل التقارير الحالي | عقد أرقام دقيقة وصيغة/عملة مؤيدة بالمصدر، خيارات خفيفة بمالكيها، دليل EN/AR داخل Reports القائم؛ لا جمع أسعار كوحدة إجمالي |

ملاحظة: وصف الأعطال أعلاه استنتاج مباشر من مسار المصدر وليس نتيجة تجربة شبكة أو SQL. الخطأ في HTTP URL يسبق عيب res.accounts؛ كليهما مستقل ويجب إصلاحهما معًا. عيب التكرار قائم في مسار العرض ويظهر عندما تصل استجابة بالشكل الذي ينتظره حاليًا؛ إصلاح النقل وحده لا يصلحه.

## مقارنة الأدلة والمراجع

| العنصر | المصدر ونوع الدليل | الواقع/التصرف |
|---|---|---|
| المرشحات الثلاثة | صورة4، Speed2026-10-28 screen23/02، routeR0394، C1085 application.js287333–287572 | المركبة matched جزئيًا؛ make/model خاطئ المصدر؛ الثالث اختلاف دلالي مثبت: label Vehicle Type مربوط بـtariffGroupId في المرجع |
| الأعمدة السبعة | صورة4 وC1085/قالب الشاشة المذكور في screen23/02 | الأسماء موجودة في الموديلين، لكن النقل لا يصلها والعرض شجري؛ القيم المالية غير معتمدة سياقيًا |
| بحث المركبة | C1085 searchVehicles/searchVehiclePopup، C1186 المشار إليه في الفهرس | المكون الحالي dropdown غير قابل للبحث؛ لم يُقرأ C1186 كاملًا لأنه لا حاجة لتوسيع مراجعة مالك البحث في هذه الشريحة، ولا يُدّعى تطابق نافذته |
| Refresh/Report/Excel | صورة4، C1085 getVehiclesTariffGroupReport/reportModal/exportToExcel | البحث جزئي؛ الطباعة وExcel مفقودان. Report يُنفذ عند الإصلاح بمالك الطباعة في Sigma، لا بمشغل تقرير موازٍ |
| شرح التعرفة | Speed2026-10-27 S205، library/pages/6ad680cb0d65bf54.html | العنوان مناسب لكن النص يصف معالجة مخالفات/Download بدل التعرفة؛ مصدر متعارض/غير كافٍ للحسابات، لا تعتمد خطواته كقاعدة |
| مفهوم فترات السعر | Odoo19 pinned originals/content/applications/sales/rental/configure_products/products.rst، فقرة rental periods and prices | يوضح أن السعر يتبع period/pricelist؛ لا يقرر Group/Type/Card أو أسبوع7/شهر30 في Sigma. لا استيراد algorithm أودو |
| عقد تعريف Sigma | RENTAL_TARIFF_FEATURE_REVIEW.md119/190 وTariffService/Config | Type/VehicleType/Card سياق محفوظ؛ TariffGroup منفصل legacy/reporting ولا يملك المحرر الحالي تعيينه للسجلات الجديدة. فجوة معروفة، لا يُخترع workflow لإخفائها |

المراجع الحالية: AGENTS والدليل الحي ومهارة Sigma، README وINDEX، كتالوج التقرير07، Master1/4/5/7 حسب نطاق المراجعة وUI20/21/22/2/26/28/29 وBE17/2/19. فحص الحزم الثماني OK قبل الاستعمال. مهارات Superpowers متاحة محليًا بملفات using-superpowers وsystematic-debugging وverification-before-completion؛ التتبع جرى قبل اقتراح التصحيح، ودون تشغيل محظور. لا تصميم/خطة تنفيذ مجمدة؛ هذه مراجعة وضع قائم فقط، والمهارات لا تمنح إذن الإصلاح.

## العقد الحالي والقرارات المطلوبة

| الجانب | الواقع الحالي | القرار/الاقتراح |
|---|---|---|
| المسار | Reports/VehiclePriceBasedOnTariffGroup | موجود؛ تمديد مالكه، لا إنشاء نسخة |
| الواجهة الخلفية | VehicleReports/VehiclePriceBasedOnTariffGroup → List<VehiclePriceBasedOnTariffGroupRow> | response array كاملة بغير Skip/Take؛ local presentation paging جائز بعد ضبط المستهلك. لو تغير wrapper فليتغير منتجه ومستهلكه معًا |
| الأعمدة مقابل DTO | plateNo,color,makeAndModel,hourlyRate,dailyRate,weeklyRate,monthlyRate | السبعة متطابقة أسماءً؛ children/accounts إضافتان غير منتجتين يجب إزالتهما عند التوحيد. لا ListVM/CRUD أو Add/Update للتقرير |
| الحساب | اختيار أول تعرفة بالـVehicleType ثم Regular أو fallback، أيام1/7/30 | لا توجد أولوية Group/Type/Card مثبتة لهذا التقرير؛ لا اعتماد لسعر أسبوعي/شهري كوحدة يوم أو كإجمالي دون عقد صريح |
| الصلاحية | API مصنف تحت VehicleReports.VehiclePriceBasedOnTariffGroup، Authorize والفلتر العام قائم؛ BranchOperationRules يصنفه ReportEffects | ليست هناك ثغرة ثبتت من مجرد غياب UI gate؛ العكس: المسار الحالي fail-closed للمستخدم العادي. لا grants تلقائية أو اختراع إذن Detail من سبيد |
| البيانات والمبالغ | مركبات وتعرفة live حسب بعض شروط parent فقط؛ rate18,2 | أسعار مال وليست كميات، وهويات المرشحات integers. لا تحويل عملة أو إجمالي مالي مفترض |
| التعديل والهجرة | لم يُنفذ أي تعديل | لا حاجة لترحيل من هذه المراجعة؛ قرار تعيين Group أو تغيير domain قد يتطلب شريحة مستقلة عند طلب التنفيذ |

قبل إصلاح الحساب: يلزم تثبيت هل التقرير يختار التعرفة الافتراضية لكل نوع Daily/Weekly/Monthly أم بطاقة/مجموعة محددة، ومعنى سعر أسبوع/شهر عند شرائح الأيام، ومعالجة غياب Regular أو غياب سعر مطابق. الصورة وتصريحات الواجهة المرجعية لا تحسم هذه القواعد. المصدر الحالي في Sigma لا يصلح بذاته موافقة على g.First أو fallback Weekend/Vacation.

## التحميل والكاش والأداء

| الطلب/المصدر | التصنيف الفعلي | التحميل والعمر/النتيجة |
|---|---|---|
| GET Vehicle وCarMake وVehicleType | CRUD reads مباشرة؛ ليست GetSelect وليست opt-in reference-cache consumers | forkJoin واحد يبدأ من ngOnInit، loader.page start/complete غير متوازن في الخطأ/التدمير؛ لا reference watch أو invalidation/retry أو سياق مسجل. عدم وجود الكاش ليس سببًا لتخزين كل GET؛ المطلوب اعتماد source owner المناسب للخيارات |
| GET Report/VehiclePriceBasedOnTariffGroupReport | تقرير تشغيلي مباشر بلا cache، URL غير متوافق | start قبل الاشتراك، end في next فقط؛ لا applied-filter/cancel-on-change/access/context، ولا local result error |
| API الفعلي | قراءات EF مباشرة AsNoTracking؛ tenant parent predicates وفلاتر فروع Context القائمة | lookup اختياري للمجموعة، ثم كل المركبات بكيانات Make/Model، ثم التعرفات وchildren كاملة؛ لا N+1/network per row؛ grouping/rates/ordering النهائي في الذاكرة، وCancellationToken لا يصل للخدمة/ToListAsync رغم وجوده في controller |

لا سرعة مقاسة أو SQL plans من هذه المراجعة. read-volume متناسب مع كل المركبات والتعرفات/شرائحها، ولا داعي لفرض server paging من الشكل وحده. نقطة الإصلاح الأولى correctness ثم إسقاط minimal rows والخيارات الصحيحة وتقييد Type/Card/Group والchildren قبل التحميل وتمرير الإلغاء. توقيت المالك لاحقًا على نفس tenant/branch/dataset/filters مع خمس عينات باردة/دافئة، وفصل bootstrap/report/print/export وSQL IO/payload/render.

تغطية الفهارس المصدرية: TariffConfig يملك unique (SubscriptionId,VehicleTypeId,Type,TariffCardId) بفلتر IsDeleted=0؛ FK rates على TariffId وFK المركبة لنوعها تتبع conventions. لا اقتراح فهرس إضافي قبل إصلاح تعريف predicate وقياس الخطة؛ الفهرس القائم قد يخدم سياقًا صحيحًا بعد استكمال Type/Card. فلتر IsDeleted=0 لا يشمل live NULL، ولا تغيير unique لغرض performance. لا schema/DB/index أوامر منفذة ولا ادعاء نشر فهرس.

## المصالحة والتحقق

لم يغيّر هذا الطلب أي مصدر تطبيق أو settings أو تعليمات أو guide. أُنشئ هذا السجل وتحديث فهرس المراجعات فقط. تعديلات سابقة موجودة في Reports routes وVehicleReportsService/Controller تخص العمل السابق في المحادثة، بقيت محفوظة؛ مجلد واجهة هذا التقرير وDTOs الخاصة به بلا تغييرات معلنة من هذا الطلب.

تمت قراءة المسار الفعلي إلى المكون وخدمته/موديله والwrapper/LoadingService، وController/الخدمة/DTOs وTariff models/EF والاختيار الحالي وصلاحيات المسار/الخادم. فحص المصدر يثبت mismatch والعمر/التكرار/غياب المخرجات، ولا يثبت runtime أو قياس أداء. مراحل discovery/read/integration/reconciliation للمراجعة مطبقة؛ كتابة/إجراءات مجال/مهاجرات غير منطبقة، ولا عقد إصلاح مجمد لأن التنفيذ غير مطلوب لتقرير موجود.

لا Agents في هذه الشريحة: تقرير واحد مترابط وعقد التسعير يحتاج حسمًا قبل أي مسارين مستقلين، فلا يتحقق باب التفويض. لا builds/tests/lint/browser/DB/migrations/snapshots/commits/push/deploy أو Sigma MCP/Graphify. لا AutoMapper أو حساب مالي أو schema غُيّر. لا commit مقترح لمصدر لم يُعدّل؛ لاحقًا يمكن تنفيذ الإصلاح على المالك نفسه بعد تفويضه وتثبيت سياق السعر. دليل الشاشة المطلوب عند التنفيذ يضاف إلى UserGuide/content/reports-guide.ts الحالي مع topic EN/AR وroute/menu القائمين، لا قارئ جديد.


## مصالحة التنفيذ — ١١ نوفمبر ٢٠٢٦

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Authorization | المالك طلب تنفيذ التعديلات وفوض اختيار الأنسب للسعر والبطاقة |
| Frozen contract | VEHICLE_PRICE_BASED_ON_TARIFF_GROUP_IMPLEMENTATION_CONTRACT_FREEZE.md |

### النتيجة والقرارات

أُصلح التقرير القائم دون إنشاء نسخة. استُبدلت قراءة الشجرة بعرض مسطح من مالكي Sigma المشتركين، ووُحّد URL والمرشحات وResult envelope والمنتج والمستهلك. قرار التفويض اختار السياق الدقيق للنوع والبطاقة المحفوظة؛ الأسبوع والشهر من Weekly/Monthly المستقلين، والساعة واليوم من Daily/Regular في شريحة تشمل1. غياب السعر أو تعدد تعريفه أو عدم صلاحية مبلغه/نطاقه ينتج null مع missing/ambiguous/invalid، والصفر المسجل محفوظ. إصلاح نهائي من تدقيق الخلفية منع تجاوز فحص النطاق المشوه/المقلوب في الأسعار الدورية، مع مواصفات غير منفذة للحالتين.

لا تحسب أسعار العقود أو الخصم أو الضريبة أو تحويل عملة أو أسعار نافذة تاريخية؛ الدليل يشرح أن القيم أسعار معرفة محفوظة بعملة الأساس. المصدر لا يثبت تسعيرًا نافذًا لعقد بعينه. قرار استخدام البطاقة الافتراضية/المختارة يحل فجوة المجموعة القديمة لهذه الشريحة فقط، ولا يضيف تعيين TariffGroup إلى المحرر.

| الجانب | العقد/النتيجة الفعلية | المصالحة |
|---|---|---|
| الصورة4 والأعمدة | اللوحة، اللون، الماركة والموديل، الساعي، اليومي، الأسبوعي، الشهري | matched مصدرّيًا؛ مظهر Sigma المشترك، قبول بصري pending |
| الموديل المعروض | vehicleId هوية فقط؛ plateNo,color,makeAndModel,hourlyRate,dailyRate,weeklyRate,monthlyRate | السبعة تقابل الأعمدة؛ لا children/accounts أو مجاميع أسعار |
| المرشحات | vehicleId,carModelId,vehicleTypeId,tariffCardId أعداد صحيحة موجبة nullable | matched مع قرار بطاقة صريح؛ الموديل من CarModel لا CarMake |
| البحث عن المركبة | searchable select باللوحة من الخيارات المسموح بها | target intent matched؛ نافذة Speed غير منسوخة، owner Sigma مستعمل |
| Refresh/Report/Excel | بحث/تحديث، طباعة كاملة بواسطة ReportPrintSession، Excel بقراءة كاملة مستقلة | matched مصدرّيًا؛ سياق المرشحات والبطاقة والعملة والملاحظات بكل المخرجات |
| السعر/البطاقة | exact saved VehicleType+Type+TariffCard؛ لا default template أو Weekend/Vacation fallback | matched مع عقد تعريف Sigma؛ لا First عشوائي |
| المال | nullable decimal-string converters ودقة عملة الأساس، DataTable exactMoney/export shared format | لا money→number أو تقريب محلي؛ الخانة الفارغة غير متاحة، الصفر سعر محفوظ |
| الصلاحيات | route read+options؛ server options/export prerequisite read؛ export يحتاج منحته | matched؛ لا grants أو CRUD lookup permissions تلقائية |
| النطاق | QueryReport tenant/live، Vehicle branch filter، model/make tenant/live صريح | matched مصدرّيًا؛ تجربة عدة فروع/مستأجرين pending |
| دليل Speed S205 | نصه المتعارض لم يُستخدم لحساب | excluded evidence مع السبب؛ لا متطلب مادي مفتوح |
| دليل Odoo19 | مفهوم الفترات/قائمة الأسعار فقط | complementary؛ لا algorithm مستورد |
| التعديل/الكيانات/AutoMapper | تقرير قراءة وإسقاط minimal DTO مباشر | لا editor أو mapping أو schema أو migration مطلوبة |

### المالك المشترك والتحميل والكاش والعمر

| العنصر | المالك الفعلي/المصدر | النتيجة المصدرية |
|---|---|---|
| الشكل/التمدد/الطباعة | ReportPage/FeatureTitle/ReportActions/DataTable + UI07/20/21 | عنوان داخل اللوحة، صفوف محلية بمالك تمرير، printAllRows، print flow القائم يلغي حدود الملاحظات عند الطباعة |
| التقدم للخيارات | ReferenceLookupStatus → LoadingService.setPageLookupLoading، scope الافتراضي page | مالك صفحة واحد؛ ليس spinner مرشحًا موازيًا، الفشل وRetry قائم |
| التقدم للتقرير/Excel | defer يبدأ lease في الاشتراك وfinalize داخل المصدر المشترك | إلغاء/خطأ/تدمير يحرر نفس الطلب؛ deny الفوري لا ينهي عدادًا لم يبدأ |
| مصدر الخيارات | GET VehicleReports/VehiclePriceBasedOnTariffGroupOptions عبر getOptions | direct report-specific operational selection، بلا cache opt-in؛ لا watch/invalidation من مصدر غير متبنٍ للكاش؛ يعاد bootstrap عند context/access recovery |
| مصدر القراءة | GET VehicleReports/VehiclePriceBasedOnTariffGroup عبر getReport | direct operational read، snapshot filters؛ تغير المرشح يبطل النتيجة ويلغي القراءة فقط ولا يلغي bootstrap |
| مصدر التصدير | GET VehicleReports/VehiclePriceBasedOnTariffGroupExport عبر getExport | direct complete operational output، إذن مستقل وقراءة على applied filter |
| النشر/الإلغاء | AccessViewPolicyService.denied$/dataContext، ownedDataContext، mounted auth-session، DestroyRef | إخفاء/تنقية النتيجة فورًا ثم مسح IDs والخيارات وإغلاق Select portals وإلغاء المخرجات؛ قراءة جديدة لا تُعاد آليًا |
| الأخطاء | X-Skip-Error-Interceptor مع StateMessage/API error + Retry محلي | قناة واحدة لكل isSuccess=false وHTTP؛ لا ابتلاع للخطأ |
| موفر الخدمة | providedIn root؛ أزيل تكرار Layout provider | لا خدمة جديدة منافسة أو تغيير shared lifecycle |

### ملفات التنفيذ المملوكة للنطاق

تغييرات الواجهة تحت المستودع SiGmaAngularFrontEnd:

- ملفات المكون والقالب والموديل والخدمة الحالية داخل Reports/VehiclePriceBasedOnTariffGroup، مع تنسيق محلي ومواصفتي المكون والخدمة الجديدتين.
- ملف vehicle-tariff-price-access.ts الجديد في نفس الميزة، وتبنيه في shared/authorization/route-access-policy.ts والمسار البديل المسموح.
- ملفات i18n/vocabs/en.ts وar.ts وauthorization.ts، وإضافة ثلاثة labels إلى permission-tree.component.ts فقط ضمن مالكها القائم.
- ملف layout/layout.module.ts لإزالة import/provider المكرر، وtsconfig.app.json لتسجيل runtime entries صراحة دون specs.
- ملف UserGuide/content/vehicle-tariff-price-topic.ts الجديد وتسجيله في reports-guide.ts. دليل التقارير بالقائمة والمسار القائمين /UserGuide/reports؛ الموضوع يشير إلى مسار التقرير الفعلي ويغطي الفلاتر والحساب والحالات والمخرجات والصلاحيات والعمر.

تغييرات الخلفية تحت المستودع SigmaBackend:

- ملفا IVehicleReportsService.cs وVehicleReportsService.cs، مع نقل قراءة التقرير القديمة فقط إلى VehicleReportsService.TariffPrices.cs وإزالة GetRate/TryParseInt القديمين التابعين لها.
- ملفا VehicleTariffRateReadRow.cs وVehicleTariffPriceReadPolicy.cs الجديدان للقراءة الحتمية من المدخلات المحفوظة؛ لا إعادة تسعير مجال.
- ملفا Request وRow الحاليان وموديلات ReportVm/IssueVm/OptionVm/OptionsVm الجديدة داخل ViewModels/VehicleReports/VehiclePriceBasedOnTariffGroup.
- ملف VehicleReportsController.cs لنقاط الخيارات والتصدير وتمرير CancellationToken للقراءة، وBranchOperationRules.cs لتصنيفها ReportEffects، وPermissionPrerequisites.cs لتبعيات القراءة.
- ملفا GeneralMessage.resx وGeneralMessage.ar-SA.resx لمفتاح البطاقة غير المتاحة فقط ضمن هذه الشريحة.
- ملفا VehicleTariffPriceReadPolicyTests.cs وVehicleTariffPricePermissionTests.cs الجديدان في tests/SiGma.BranchAccess.Tests؛ مواصفات مكتوبة غير منفذة.

التعديلات السابقة/الموازية في الربحية ودفتر اليومية والحركات والتأجير والصلاحيات المشتركة محفوظة. فروق الملفات المشتركة عن HEAD تشمل عملًا سابقًا لا تنسبه هذه الشريحة لنفسها. لا تغيير reference module أو canonical owner عام؛ قرارات التسعير تخص العقد المجمد ولا تستلزم قاعدة كتاب جديدة.

### الأداء والفهارس

قراءة التقرير تسقط العملة والصفوف/التعرفات/الأسعار الدنيا بأربع رحلات SQL عند الافتراضي وخمس عند تحديد بطاقة، والخيارات بأربع قراءات مسلسلة على DbContext واحد. المصدر يقيد نوع التعرفة والبطاقة والمركبات قبل التحميل، ويستبعد child المحذوف/المستأجر الآخر عبر QueryReport، ويحسب اختيار السعر مرة لكل سياق باستخدام dictionary/lookups دون SQL لكل مركبة. الملاحظات/التصدير تجمع بالهوية بمسار خطي؛ لا بحث كامل في الصفوف لكل ملاحظة. تعرض كل المركبات المسموح بها لأن التقرير كامل؛ paging محلي للمشاهدة فقط.

لا سرعة أو خطة SQL مقاسة. لا فهرس إضافي مؤكد قبل القياس: السياق composite الحالي وفهارس FK قرئت من المصدر. اقتراح index جديد الآن قد يكرر تغطية قائمة ويزيد كلفة الكتابة، فلا schema change. قبول المالك: نفس tenant/branch/dataset/default/card/filter، خمس عينات باردة/دافئة للخيارات/التقرير/Excel مع payload وrender وSQL IO/plan؛ لا ادعاء تحسن زمني من تقليل الإسقاط وحده.

### التحقق المنفذ وحدوده

فحص الصياغة المصدري لملفات TypeScript الأربعة عشر والقالب بواسطة TypeScript parser وAngular parseTemplate: بلا diagnostics. فحص imports المحلية وإدراج runtime files ومطابقة ٢٢ مفتاحًا جديدًا بين اللغتين واستهلاكها: بلا فجوات. لم يكن هذا type-check أو Angular compilation. ملفات RESX صالحة XML ومفتاح البطاقة مرة واحدة بكل لغة. namespaces/global imports ومراجع .NET وSDK default Compile inclusion فُحصت بالمصدر؛ لا build proof. تمت مراجعة فروق المستودعين للنطاق بصورة مستقلة، وفحص whitespace وmerge markers. مواصفات الواجهة ١٤ حالة وHTTP/lifetime/permission/output مكتوبة، ومواصفات الخلفية تغطي الاختيار والصفر/الفجوة/التداخل/النطاق غير الصالح وتبعيات المنح؛ لم تُشغّل.

المراحل0/1/2/5/6 مطبقة؛ المرحلة3 editor والمرحلة4 mutations غير منطبقتين. استُخدم عامل واجهة بعد تثبيت العقد بملكية مستقلة لمجلد التقرير وموضوع الدليل فقط، وعامل تدقيق خلفية قراءة فقط؛ الجذر امتلك اكتشاف/عقد/خلفية/ربط/ترجمات/مصالحة. كلاهما ورث نموذج الجذر دون override. السبب استقلال عرض التقرير عن خدمة قراءته بعد تثبيت العقد وتدقيق المالي/الصلاحيات أثناء الدمج؛ لا claim لتوفير زمن/كلفة مقاس. تكامل الشريحتين تمت مراجعته بواسطة الجذر، وأُغلق finding النطاق الدوري مصدرّيًا.

لم تُشغّل builds/tests/lint/browser/database/migrations/snapshots/commits/push/deployment، ولا Sigma MCP أو Graphify. لا Add-Migration مطلوب. المقترح للمستودع الخلفي: fix(reports): read deterministic vehicle tariff prices and enforce output grants. المقترح لمستودع الواجهة: fix(reports): restore vehicle tariff price filters and complete outputs. رسائل مقترحة فقط؛ لا commit.

### قبول المالك المتبقي

- التحقق تشغيليًا من default/card لكل نوع ومركبة، وعدم استعارة قالب/سعر عطلة، والسعر صفر مقابل خانة ناقصة والتعارض والنطاق غير الصالح.
- التحقق من الفلاتر المنفصلة والبحث المتكرر دون تراكم، والخطأ وRetry، وعدم ضياع bootstrap عند تغير قيمة برمجيًا، وتوازن تقدم الصفحة عند الإلغاء/الخروج.
- التحقق من grants read/options/export المستقلة وتبعياتها لدى المستخدم العادي، ونطاق المستأجر/الفرع، وسحب المنح وإعادتها وتغير الفرع/الدخول وتجديد الاعتماد أثناء العرض والقراءات والطباعة المؤجلة.
- التحقق من كل الصفوف والعملة والسياق والملاحظات في الطباعة وExcel عند تعدد صفحات العرض، والخانة الفارغة مقابل الصفر، واللغتين وRTL/themes/المقاسات ولوحة المفاتيح.
- التحقق من البناء/الاختبارات والترجمة الفعلية لـEF وقياس الأداء المذكور بواسطة المالك. لا قرار وظيفي مادي مفتوح حاليًا؛ المتبقي قبول تشغيل وقياس.
