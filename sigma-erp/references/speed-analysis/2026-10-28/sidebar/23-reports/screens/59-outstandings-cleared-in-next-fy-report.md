# شاشة: Outstandings Cleared In Next FY Report

المسار في القائمة: Reports ← Outstandings Cleared In Next FY Report.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_outstandingsClearedInNextFYReport`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0418](../../../readable/routes/R0418--tenant-crs-outstandingsclearedinnextfyreport.js)، والأصل [raw/application.js:4576](../../../raw/application.js#L4576).
- قالب الشاشة: `~/App/tenant/views/crs/reports/outstandingsClearedInNextFYReport/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.reports.outstandingsClearedInNextFYReport.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.reports.outstandingsClearedInNextFYReport.index](../../../readable/controllers/C1027--tenant.views.crs.reports.outstandingsClearedInNextFYReport.index.js) | 7 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.reports.outstandingsClearedInNextFYReport.index`: `getPerColumTotal`، `getMonth`، `getlocalDateTime`، `CurrencyFormate`، `roundingforView`، `exportToExcelMethod`، `getReport`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.fiscalYear.getFiscalYears` | POST | api/services/app/fiscalYear/GetFiscalYears | [المصدر](../../../raw/application.js#L275097) |
| `abp.services.app.outstandingsClearedInNextFYReport.getOutstandingsClearedInNextFYReport` | POST | api/services/app/outstandingsClearedInNextFYReport/GetOutstandingsClearedInNextFYReport | [المصدر](../../../raw/application.js#L275203) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filter.fiscalYear` | select |  | ng-options=year as (vm.getlocalDateTime(year.startDate) + ' - ' + vm.getlocalDateTime(year.endDate)) for year in vm.fiscalYears \| orderBy: '-startDate' |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
