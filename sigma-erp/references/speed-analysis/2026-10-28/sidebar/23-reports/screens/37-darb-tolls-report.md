# شاشة: Darb Tolls Report

المسار في القائمة: Reports ← Darb Tolls Report.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_darbTollsReport`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0403](../../../readable/routes/R0403--tenant-crs-darbtollsreport.js)، والأصل [raw/application.js:4455](../../../raw/application.js#L4455).
- قالب الشاشة: `~/App/tenant/views/crs/reports/darbTollsReport/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.reports.darbTollReport.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.reports.darbTollReport.index](../../../readable/controllers/C0987--tenant.views.crs.reports.darbTollReport.index.js) | 12 | 5 |
| [tenant.views.crs.reports.darbTollReport.attachVehicleModal](../../../readable/controllers/C0985--tenant.views.crs.reports.darbTollReport.attachVehicleModal.js) | 3 | 2 |
| [common.views.common.reportViewer](../../../readable/controllers/C0006--common.views.common.reportViewer.js) | 2 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.reports.darbTollReport.index`: `statusChanged`، `roundingforView`، `invoiceStatusChanged`، `dateRangeCheck`، `searchCustomers`، `searchPlateNo`، `clearCustomer`، `getTollsReport`، `getlocalDateTime`، `attachVehicle`، `report`، `exportToExcel`.
- وحدة `tenant.views.crs.reports.darbTollReport.attachVehicleModal`: `cancel`، `searchVehicles`، `save`.
- وحدة `common.views.common.reportViewer`: `exportToExcelFromReport`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.salikAccount.getSalikAccounts` | POST | api/services/app/salikAccount/GetSalikAccounts | [المصدر](../../../raw/application.js#L267991) |
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L268001) |
| `abp.services.app.toll.getSearchPlateNonew` | POST | api/services/app/toll/GetSearchPlateNonew | [المصدر](../../../raw/application.js#L268009) |
| `abp.services.app.toll.getDarbTollsReport` | POST | api/services/app/toll/GetDarbTollsReport | [المصدر](../../../raw/application.js#L268046) |
| `abp.services.app.toll.darbTollReportViewExportToExcel` | POST | api/services/app/toll/DarbTollReportViewExportToExcel | [المصدر](../../../raw/application.js#L268275) |
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L267631) |
| `abp.services.app.toll.attachVehicleForDarb` | POST | api/services/app/toll/AttachVehicleForDarb | [المصدر](../../../raw/application.js#L267642) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.fromDate` | text |  | ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.fromTime` | text |  | ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.toDate` | text |  | ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.toTime` | text |  | ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.durationType` | radio | tripDate | ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.durationType` | radio | downloadDate | ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.vehicleNoArray` | ui-select |  |  |
| `vm.filters.location` | text |  |  |
| `vm.filters.direction` | text |  |  |
| `vm.filters.salikAccountId` | select | salikAccountId |  |
| `vm.filters.customer` | ui-select |  |  |
| `vm.filters.vehicleStatus` | select |  | ng-options=status.id as status.name for status in vm.invoiceStatuses |
| `vm.filters.status` | select |  | ng-options=status.id as status.name for status in vm.statuses |
| `vm.filters.debitJvStatus` | select |  |  |
| `vm.filters.tollsShareStatus` | select |  |  |
| `vm.filters.enableCharged` | checkbox | enableCharged |  |
| `vm.filters.tollsWithFailedVehicleMappings` | checkbox | tollsWithFailedVehicleMappings |  |
| `vm.filters.invoiceNo` | text |  |  |
| `vm.filters.externalTollsOnly` | checkbox | externalTollsOnly |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
