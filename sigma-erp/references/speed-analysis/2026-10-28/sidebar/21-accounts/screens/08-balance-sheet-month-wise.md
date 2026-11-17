# شاشة: Balance Sheet Month wise

المسار في القائمة: Accounts ← Balance Sheet Month wise.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_balanceSheetMonthwise`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0482](../../../readable/routes/R0482--tenant-crs-balancesheetmonthwise.js)، والأصل [raw/application.js:5093](../../../raw/application.js#L5093).
- قالب الشاشة: `~/App/tenant/views/crs/accounting/balanceSheetMonthwise/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.accounting.balanceSheetMonthwise.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.accounting.balanceSheetMonthwise.index](../../../readable/controllers/C0475--tenant.views.crs.accounting.balanceSheetMonthwise.index.js) | 13 | 5 |
| [tenant.views.common.locations.searchContactModal](../../../readable/controllers/C0400--tenant.views.common.locations.searchContactModal.js) | 3 | 1 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.accounting.balanceSheetMonthwise.index`: `formatNumber`، `getlocalDate`، `stateBranchPopoup`، `currencyAndRoundingWithThree`، `roundingforView`، `rounding`، `clearLocation`، `getBalanceSheet`، `getBalanceStatement`، `getMonth`، `checkZeroActivity`، `exportToExcel`، `openLedger`.
- وحدة `tenant.views.common.locations.searchContactModal`: `cancel`، `branchSelected`، `init`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L101577) |
| `abp.services.app.division.searchDivisions` | POST | api/services/app/division/SearchDivisions | [المصدر](../../../raw/application.js#L121739) |
| `abp.services.app.journal.getBalanceSheet` | POST | api/services/app/journal/GetBalanceSheet | [المصدر](../../../raw/application.js#L121852) |
| `abp.services.app.journal.exportBalanceSheetMonthwise` | POST | api/services/app/journal/ExportBalanceSheetMonthwise | [المصدر](../../../raw/application.js#L121918) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.locationName` | text |  |  |
| `vm.filters.devisionId` | select | devisionId | ng-options=division.id as division.name for division in vm.divisions |
| `vm.asOfDate` | input | date |  |
| `vm.filters.period` | select |  | ng-options=period.id as period.name for period in vm.periods |
| `vm.filters.doNotShowAccountWithZeroActivity` | checkbox | doNotShowAccountWithZeroActivity |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
