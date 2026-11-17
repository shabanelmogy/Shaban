# شاشة: Amortization FY

المسار في القائمة: Reports ← Amortization FY.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_amortizationReportFY`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0417](../../../readable/routes/R0417--tenant-crs-amortizationreportfy.js)، والأصل [raw/application.js:4566](../../../raw/application.js#L4566).
- قالب الشاشة: `~/App/tenant/views/crs/reports/amortizationReportFY/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.reports.amortizationReportFY.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.reports.amortizationReportFY.index](../../../readable/controllers/C0969--tenant.views.crs.reports.amortizationReportFY.index.js) | 8 | 3 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.reports.amortizationReportFY.index`: `getLinkedPrepaid`، `getPerColumTotal`، `getMonth`، `getlocalDateTime`، `CurrencyFormate`، `roundingforView`، `exportToExcelMethod`، `getAmortizationReport`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.fiscalYear.getFiscalYears` | POST | api/services/app/fiscalYear/GetFiscalYears | [المصدر](../../../raw/application.js#L263308) |
| `abp.services.app.amortizationReportFY.searchPrepaidAccounts` | POST | api/services/app/amortizationReportFY/SearchPrepaidAccounts | [المصدر](../../../raw/application.js#L263322) |
| `abp.services.app.amortizationReportFY.getAmortizationReportFY` | POST | api/services/app/amortizationReportFY/GetAmortizationReportFY | [المصدر](../../../raw/application.js#L263465) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filter.fiscalYear` | select |  | ng-options=year as (vm.getlocalDateTime(year.startDate) + ' - ' + vm.getlocalDateTime(year.endDate)) for year in vm.fiscalYears \| orderBy: '-startDate' |
| `vm.filter.account` | ui-select |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
