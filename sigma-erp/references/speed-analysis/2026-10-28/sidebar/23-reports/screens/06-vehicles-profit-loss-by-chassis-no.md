# شاشة: Vehicles Profit/Loss By Chassis No

المسار في القائمة: Reports ← Vehicles Profit/Loss By Chassis No.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_vehiclesProfitAndLossByChassisNo`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0401](../../../readable/routes/R0401--tenant-crs-vehiclesprofitandlossbychassisno.js)، والأصل [raw/application.js:4437](../../../raw/application.js#L4437).
- قالب الشاشة: `~/App/tenant/views/crs/reports/vehiclesProfitAndLossByChassisNo/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.reports.vehiclesProfitAndLossByChassisNo.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.reports.vehiclesProfitAndLossByChassisNo.index](../../../readable/controllers/C1097--tenant.views.crs.reports.vehiclesProfitAndLossByChassisNo.index.js) | 7 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.reports.vehiclesProfitAndLossByChassisNo.index`: `getlocalDate`، `getVoucherType`، `CurrencyFormate`، `roundingforView`، `getVehiclesProfitAndLossByChassisNo`، `getExpenseType`، `exportToExcelByChassisNo`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.profitAndLoss.getVehicleProfitAndLossByChassisNo` | POST | api/services/app/profitAndLoss/GetVehicleProfitAndLossByChassisNo | [المصدر](../../../raw/application.js#L290229) |
| `abp.services.app.profitAndLoss.exportToExcelByChassisNo` | POST | api/services/app/profitAndLoss/ExportToExcelByChassisNo | [المصدر](../../../raw/application.js#L290373) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max |
| `vm.profitLoss.chassisNo` | text |  | ng-required=true |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
