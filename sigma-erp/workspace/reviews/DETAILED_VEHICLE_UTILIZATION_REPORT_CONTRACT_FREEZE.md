# عقد تقرير الاستخدام التفصيلي للمركبات

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-11-19 |
| Scope | Reports/DetailedVehicleUtilizationReport · UI07 · BE17 · Tier M |

## ملخص العقد والقرارات

طلب المالك مراجعة التقرير الظاهر في الصورتين وتنفيذ المطلوب وفق الوثائق. كان رابط `sideMenu.reportss.detailedVehicleUtilizationReport` في القائمة الجانبية يشير خطأً إلى `/Vehicle` دون مسار أو خدمة أو واجهة لتقرير الاستخدام التفصيلي. يستبدل هذا العقد الرابط الخاطئ بالمسار المخصص `/Reports/DetailedVehicleUtilizationReport` تحت نمط الشاشة **07 Report** (`UI20`/`UI21`/`UI6`) ونمط الخلفية **Pattern 5 — Reports** (`BE17`).

## الأدلة المرجعية المقروءة

- **المرجع الأساسي — Speed (دليل 2026-10-27)**: فُحص `library/catalog.csv` و`Speed_Analysis_Guide.md`؛ لا يوجد شرح شاشة مخصص لتقرير `Detailed Vehicle Utilization Report` (`S020` صفحة تسويقية عامة فقط).
- **المرجع الأساسي — Speed (كود 2026-10-28)**: قُرئت شاشة `sidebar/23-reports/screens/35-detailed-vehicle-utilization-report.md` والمتحكمان `C0990--tenant.views.crs.reports.detailedVehicleUtilizationReport.index.js` و`C0991--tenant.views.crs.reports.detailedVehicleUtilizationReport.vehicleUtilizationDetail.js` ومطابقة قالب `index.cshtml` في `data/template-bindings.json` (القالب الثانوي `vehicleUtilizationDetail.cshtml` غير ملتقط في الحزمة).
- **المرجع المكمل — Odoo 19.0 (2026-11-02)**: فُحص `references/odoo-rental/README.md` و`COMPARISON_MATRIX.md:27`؛ لا يغطي Odoo القياسي مصفوفة الاستخدام اليومي ذات الأقسام الستة (`Not applicable` بعد التحقق).
- **الصورتان المرفقتان**:
  - `media_1795108586554_0127c8b1.jpg`: العنوان، مرشح الشهر (`Month`)، أزرار `Search` و`Print` و`Export to Excel`، وأقسام `Overall` و`Service and Maintenance` و`Accident Repair` و`Rented` بأعمدة `Fleet` و`Average` والأيام `01`..`30` مع ظهور الأيام غير الملتقطة/المستقبلية بشرطات (`-----`).
  - `media_1795108586554_f2a3b584.jpg`: قسم `Average Values` بثلاث نسب مئوية وقسم `Branch Wise Rented` بجدول فرعي لكل فرع (`Short Term` و`Long Term` و`Leasing` و`Subtotal`) بما في ذلك الفروع ذات القيمة الصفرية.

## قرارات المراجع بموجب قاعدة المالك الدائمة (Master 2 — Rule 6)

1. **اشتقاق الحالة اليومية دون جدول لقطات جديد (`BE17`)**: لا يملك Sigma جدول لقطات يومية محفوظة رغم وجود حقل الإعداد `SettingsCommonModel.DetailedUtilizationReportTime` / `UtilizationSettings.TimeOfDayToGenerateDetailedUtilizationReport`. يُحسب التقرير لحظيًا للقراءة فقط من `Vehicle` و`VehicleStatus` و`RentalAgreement` و`LeaseAgreement` و`CollectionMovement` و`WorkshopMovement` و`NRM` و`Branch` عبر `QueryReport<T>()`، دون إنشاء كيان تقرير أو هجرة قاعدة بيانات.
2. **حدود الأيام المعبّأة والأيام المستقبلية**: لكل شهر مطلوب (`YYYY-MM`) تُعرض الأعمدة `01`..`daysInMonth`. للأشهر الماضية تُحسب كل أيام الشهر حتى نهاية كل يوم UTC (`< dayStart.AddDays(1)`). للشهر الحالي تُحسب الأيام من `01` حتى اليوم الحالي UTC (الأيام السابقة حتى نهاية اليوم واليوم الحالي حتى `asOfUtc`) وتُعاد الأيام المستقبلية (`day > todayUtc.Day`) بقيمة `null` (`—`). للشهر المستقبلي الكامل تكون `populatedDays = 0` وتُعرض الأيام فارغة (`—`).
3. **تصنيف حالات `Overall` (متنافية ومجموعها يساوي `Total` بدقة)**:
   - تُستبعد المركبات التي لم تدخل الأسطول بعد في ذلك اليوم (`CreatedAt > cutoff`) أو التي حالتها `Sold` أو `Defleeted` في ذلك اليوم.
   - `Hired` / `Rented`: تُطابق العقود النشطة غير الملغاة على المركبة في ذلك اليوم (مع اعتماد تاريخ الإرجاع الفعلي من أحدث `CollectionMovement` عبر `AgreementReturnReportQueries.LatestIdsAsync` للعقود المغلقة، واعتبار عقود التأجير التمويلي التي لها `LeaseAgreementVehicleReplacement` غير قابلة للإسناد الحتمي لسيارة واحدة):
     - عقد `LeaseAgreement` وحيد دون استبدال -> `lease` (`Lease`).
     - عقد `RentalAgreement` وحيد بنوع `Monthly` -> `longTermRental` (`Long Term Rental`).
     - عقد `RentalAgreement` وحيد بنوع `Daily` أو `Weekly` -> `shortTermRental` (`Short Term Rental`).
     - حالة `Hired`/`Rented` دون عقد وحيد مطابق -> `other` (لا تُخترع فئة إيجار ولا تُضخّم `Idle`).
   - `Workshop` / `Maintenance` / `PendingWorkshopDelivery`: إن كان أحدث `WorkshopMovement` مسموح حتى ذلك اليوم بنوع `AccidentRepair` -> `accidentRepair` (`Accident Repair`)، وإلا -> `serviceAndMaintenance` (`Service & Maintenance`).
   - `NRM`: إن كان أحدث `NRM` مسموح حتى ذلك اليوم بنوع `NrmStaffMovement` أو `StaffCar` (أو غاب السجل وكانت `Vehicle.FleetType == FleetType.Staff`) -> `staffAndManagementUse` (`Staff & Management Use`)، وإلا -> `operationalUse` (`Operational Use`).
   - `ForSale` -> `forSale`، `TotalLoss` -> `totalLoss`، `Available`/`ReadyToGo` -> `idle`.
   - باقي الحالات النشطة (`Booked`، `NotReady`، `Custody`، `PendingCustomerDelivery`، `Replacement`، `null`، غير معرّفة) -> صف شرطي `other` (`Other / Unclassified`) يظهر فقط عند وجود قيمة أكبر من صفر، بحيث يبقى `Total` مساويًا لمجموع صفوف `Overall` دون تضخيم `Idle`.
4. **تقسيم الأسطول `Rental Fleet` و`Lease Fleet` في أقسام `Service and Maintenance` و`Accident Repair` و`Rented`**:
   - يثبت سلوك الصورتين أن تقسيم `Rental Fleet` و`Lease Fleet` يتبع خاصية نوع الأسطول على المركبة (`Vehicle.FleetType`) وليس نوع العقد.
   - في Sigma يحوي `FleetType` القيم `Rental` و`Replacement` و`Staff` فقط، ولا توجد قيمة `Lease`. لذا يعرض `Rental Fleet` عدد مركبات `FleetType.Rental` في القسم، ويعرض `Total` إجمالي القسم كله مطابقًا لـ`Overall`، بينما يُعاد `Lease Fleet` بقيمة `null` (`kind = "unavailable"`, عرض `—`) دون اختراع صفر كاذب أو خلطه بعقود التأجير التمويلي.
5. **المتوسطات (`Average`) ونسب `Average Values` والسياسة العددية**:
   - خلافًا لعرض Speed الذي ترك عمود `Average` صفرًا في الأقسام 2–6، يحسب الخادم في Sigma قيمة `Average` لكل صف في كل قسم.
   - الأعداد اليومية (`01`..`31`) أعداد صحيحة (وفق السياسة العددية للعدادات الحقيقية)، بينما `Average` لصفوف العد مقرب لمنزلتين (`sum / populatedDays`)، والنسب المئوية في `Average Values` مقربة لمنزلتين مع `%`:
     - `Utilization Excluding Cars for Sale` = `Rented / (Total - ForSale) × 100`.
     - `Utilization Excl. For Sale, Total Loss & NRMs` = `Rented / (Total - ForSale - TotalLoss - StaffAndManagementUse - OperationalUse) × 100`.
     - `Net Company Utilization` = `Rented / (Rented + Idle) × 100`.
   - يُحسب متوسط كل نسبة على مستوى الفترة المعبّأة كنسبة المجموع الكلي للبسط إلى المجموع الكلي للمقام (`sum(Rented) / sum(Denominator) × 100`)، ويكون `0.00%` عند انعدام المقام و`null` عند `populatedDays == 0`.
6. **قسم `Branch Wise Rented`**: يضم جميع الفروع المسموحة للمستخدم مرتبةً بالاسم ثم المعرّف (حتى لو كانت مؤجراتها صفرًا)، مع صفوف `Short Term` و`Long Term` و`Leasing` و`Subtotal` وعمود `Average`. تُضاف مجموعة `Unassigned` فقط إذا وُجدت مركبة مؤجرة بلا `BranchId`.
7. **نافذة تفاصيل اليوم في Speed (`C0991`)**: مستبعدة كفجوة مرصودة لأن الصورتين لا تظهرانها ولم يلتقط أرشيف Speed قالبها `vehicleUtilizationDetail.cshtml` (أعمدتها غير مثبتة).

## عقد HTTP والصلاحيات ونطاق الفروع والأداء

- **المسارات (`DetailedVehicleUtilizationReportsController`, `[Authorize]`)**:
  - `GET /DetailedVehicleUtilizationReports/Options` (`PermissionCatalogAction("Read")`) -> `Result<DetailedVehicleUtilizationOptionsVm>` (`{ defaultMonth, asOfUtc }`).
  - `GET /DetailedVehicleUtilizationReports/Read?month=YYYY-MM` (`PermissionCatalogAction("Read")`) -> `Result<DetailedVehicleUtilizationReportVm>`.
  - `GET /DetailedVehicleUtilizationReports/Print?month=YYYY-MM` (`PermissionCatalogAction("Print")`) -> `Result<DetailedVehicleUtilizationReportVm>`.
  - `GET /DetailedVehicleUtilizationReports/Export?month=YYYY-MM` (`PermissionCatalogAction("Export")`) -> `Result<DetailedVehicleUtilizationReportVm>`.
- **الصلاحيات**: `DetailedVehicleUtilizationReports.Read` للقراءة والتهيئة، و`DetailedVehicleUtilizationReports.Print` و`DetailedVehicleUtilizationReports.Export` مستقلتان مع اشتراط `Read` في `PermissionPrerequisites`. جميع العمليات الأربع مسجلة ضمن `BranchOperationRules.WholeDocumentReads`.
- **الحدود الآمنة للقراءة**: حد 10,000 مركبة و2,000 فرع و200,000 سجل تاريخ/عقد/حركة مع فشل صريح `DetailedVehicleUtilizationReadLimit` دون إرجاع ملخص مبتور.
- **الواجهة**: مسار `/Reports/DetailedVehicleUtilizationReport`، مرشح شهر إلزامي عبر `p-datepicker` (`view="month"`)، أزرار `Search` و`Print` و`Export to Excel` داخل `appReportActions`، استغلال `createReportReadState` لإدارة الجلسة والتحميل العام والإلغاء وإصدار المخرجات الطازجة، عرض جميع الأقسام الستة عبر `app-data-table` داخل إطار مستند واحد `.sigma-report-table-frame.sigma-print-flow` دون تمرير الصفحة، وتصدير Excel كامل يشمل كل الأقسام والفروع، وتحديث الترجمتين ودليل الاستخدام و`tsconfig.app.json`.

## ملحق قرار المالك (2026-11-19 — تقسيم التقرير إلى تابات)

- بطلب صريح من المالك («قسم التقرير تابات»)، يُعرض التقرير عبر المكوّن المشترك `app-editor-tabs` (`appearance="workspace"`، `no-print`) في ستة تابات مقابلة للأقسام الستة: `Overall`، `Service and Maintenance`، `Accident Repair`، `Rented`، `Average Values`، `Branch Wise Rented`.
- يلتزم العرض بقواعد `UI20`/`UI21` للتقارير المقسّمة بتابات: لا يُكرَّر عنوان التاب داخل لوحته على الشاشة ويبقى العنوان للطباعة فقط عبر الأداة المشتركة `.sigma-print-only` في `src/styles.scss` (بدلًا من `d-none d-print-block` المتقاعدة وغير المحمّلة في Sigma)، وتبقى كل اللوحات الست في الـDOM فتطبع الطباعة جميع الأقسام كاملة، بينما يصدّر Excel التقرير كاملًا عبر كل الأقسام والفروع، دون تغيير على عقد API أو الحسابات الخلفية.
- بطلب لاحق من المالك بتاريخ `2026-11-19` («Branch Wise Rented قسمها داخليا زى تقرير : Overdue Agreements» و«ومتتكررش عنوان التاب داخلها ووثق ده فى الوثائق» و«انا اقصد كل تابات التقرير مش Branch Wise Rented فقط»)، ينقسم تاب `Branch Wise Rented` داخليًا إلى شريط فروع جانبي قابل للبحث (`p-listbox` مع شارة متوسط المؤجر `p-badge`) وجدول الفرع المحدد بجواره (`app-data-table` مع `fill=!printing()` و`scrollable=!printing()`). لا يُكرَّر عنوان أي تاب من التابات الستة ولا عنوان الفرع المختار داخل اللوحة على الشاشة وتستخدم كلها `.sigma-print-only` للطباعة فقط مع الحفاظ على `aria-labelledby`/`aria-label`. وُثّقت القاعدة والأداة المشتركة في `ui/20-report-page.md` و`ui/21-report-print.md` ومهارة `sigma-screen-refactor`.
