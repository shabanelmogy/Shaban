# شاشة: Month Closing

المسار في القائمة: Accounts ← Month Closing.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_monthEndClosing`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0495](../../../readable/routes/R0495--tenant-crs-monthendclosing.js)، والأصل [raw/application.js:5205](../../../raw/application.js#L5205).
- قالب الشاشة: `~/App/tenant/views/crs/accounting/monthEndClosing/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.monthEndClosing.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.monthEndClosing.index](../../../readable/controllers/C0502--tenant.views.crs.monthEndClosing.index.js) | 7 | 4 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.monthEndClosing.index`: `getMonthYear`، `getlocalDate`، `getOpenFiscalYears`، `getMonths`، `closeFiscalMonth`، `uncloseFiscalMonth`، `monthStatus`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.fiscalYear.getOpenFiscalYears` | POST | api/services/app/fiscalYear/GetOpenFiscalYears | [المصدر](../../../raw/application.js#L128289) |
| `abp.services.app.fiscalMonth.getFiscalMonths` | POST | api/services/app/fiscalMonth/GetFiscalMonths | [المصدر](../../../raw/application.js#L128313) |
| `abp.services.app.fiscalMonth.closeFiscalMonth` | POST | api/services/app/fiscalMonth/CloseFiscalMonth | [المصدر](../../../raw/application.js#L128339) |
| `abp.services.app.fiscalMonth.uncloseFiscalMonth` | POST | api/services/app/fiscalMonth/UncloseFiscalMonth | [المصدر](../../../raw/application.js#L128360) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Accounts.UncloseMonthEnd`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.fiscalYear` | select | fiscalYearId | ng-options=fiscalYear as vm.getlocalDate(fiscalYear.startDate) + ' to ' + vm.getlocalDate(fiscalYear.endDate) for fiscalYear in vm.fiscalYears |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
