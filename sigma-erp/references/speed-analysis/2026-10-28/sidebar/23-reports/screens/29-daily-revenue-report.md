# شاشة: Daily Revenue Report

المسار في القائمة: Reports ← Daily Revenue Report.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_dailyRevenueReport`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0431](../../../readable/routes/R0431--tenant-crs-dailyrevenuereport.js)، والأصل [raw/application.js:4681](../../../raw/application.js#L4681).
- قالب الشاشة: `~/App/tenant/views/crs/reports/dailyReport/dailyRevenueReport.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.reports.dailyReport.dailyRevenueReport as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.reports.dailyReport.dailyRevenueReport](../../../readable/controllers/C0982--tenant.views.crs.reports.dailyReport.dailyRevenueReport.js) | 6 | 3 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.reports.dailyReport.dailyRevenueReport`: `CurrencyFormate`، `exportToExcel`، `localize`، `getlocalDateTime`، `exportToExcel`، `getDailyRevenueReport`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.dailyReport.exportToExcel` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L266903) |
| `abp.services.app.dailyReport.getAgreementIds` | POST | api/services/app/dailyReport/GetAgreementIds | [المصدر](../../../raw/application.js#L266966) |
| `abp.services.app.dailyReport.getDailyRevenueReportByAgreementId` | POST | api/services/app/dailyReport/GetDailyRevenueReportByAgreementId | [المصدر](../../../raw/application.js#L266972) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max |
| `vm.filters.agreementNo` | text |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
