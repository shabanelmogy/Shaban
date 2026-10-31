# شاشة: Driver Time Sheet Report

المسار في القائمة: HRM ← Reports ← Driver Time Sheet Report.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.hrm_driverTimeSheet_report`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0150](../../../readable/routes/R0150--tenant-hrm-drivertimesheet-report.js)، والأصل [raw/application.js:2579](../../../raw/application.js#L2579).
- قالب الشاشة: `~/App/tenant/views/common/hrm/report/driverTimeSheetReport.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.common.hrm.report.driverTimeSheetReport as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.common.hrm.report.driverTimeSheetReport](../../../readable/controllers/C0394--tenant.views.common.hrm.report.driverTimeSheetReport.js) | 9 | 5 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.common.hrm.report.driverTimeSheetReport`: `getlocalDateTime`، `searchDrivers`، `search`، `searchAgreement`، `dateRangeCheck`، `getHoliday`، `dateRangeModelChanged`، `exportToExcel`، `exportSummaryToExcel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L100847) |
| `abp.services.app.driverTimeSheetForAgreement.driverTimeSheetReport` | POST | api/services/app/driverTimeSheetForAgreement/DriverTimeSheetReport | [المصدر](../../../raw/application.js#L100858) |
| `abp.services.app.agreement.searchAgreement` | POST | api/services/app/agreement/SearchAgreement | [المصدر](../../../raw/application.js#L100873) |
| `abp.services.app.driverTimeSheetForAgreement.exportReportToExcel` | POST | api/services/app/driverTimeSheetForAgreement/ExportReportToExcel | [المصدر](../../../raw/application.js#L100905) |
| `abp.services.app.driverTimeSheetForAgreement.exportSummaryReportToExcel` | POST | api/services/app/driverTimeSheetForAgreement/ExportSummaryReportToExcel | [المصدر](../../../raw/application.js#L100919) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max |
| `vm.filters.agreement` | ui-select |  |  |
| `vm.filters.driverTypeObj` | ui-select |  |  |
| `vm.filters.driver` | ui-select |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
