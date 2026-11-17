# شاشة: Balance Sheet

المسار في القائمة: Accounts ← Balance Sheet.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_balanceSheet`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0481](../../../readable/routes/R0481--tenant-crs-balancesheet.js)، والأصل [raw/application.js:5086](../../../raw/application.js#L5086).
- قالب الشاشة: `~/App/tenant/views/crs/accounting/balanceSheet/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.accounting.balanceSheet.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.accounting.balanceSheet.index](../../../readable/controllers/C0474--tenant.views.crs.accounting.balanceSheet.index.js) | 11 | 4 |
| [tenant.views.common.locations.searchContactModal](../../../readable/controllers/C0400--tenant.views.common.locations.searchContactModal.js) | 3 | 1 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.accounting.balanceSheet.index`: `formatNumber`، `roundingforView`، `currencyAndRoundingWithThree`، `getlocalDate`، `stateBranchPopoup`، `rounding`، `clearLocation`، `getBalanceSheet`، `getDepths`، `exportToExcel`، `openLedger`.
- وحدة `tenant.views.common.locations.searchContactModal`: `cancel`، `branchSelected`، `init`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L101577) |
| `abp.services.app.division.searchDivisions` | POST | api/services/app/division/SearchDivisions | [المصدر](../../../raw/application.js#L121527) |
| `abp.services.app.journal.getBalanceSheetForMultiCurrency` | POST | api/services/app/journal/GetBalanceSheetForMultiCurrency | [المصدر](../../../raw/application.js#L121537) |
| `abp.services.app.journal.getBalanceSheet` | POST | api/services/app/journal/GetBalanceSheet | [المصدر](../../../raw/application.js#L121545) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.locationName` | text |  |  |
| `vm.filters.devisionId` | select | devisionId | ng-options=division.id as division.name for division in vm.divisions |
| `vm.asOfDate` | input | asOfDate |  |
| `vm.filters.depth` | select | depth | ng-options=depth.id as depth.name for depth in vm.depths |
| `vm.filters.doNotShowAccountWithZeroActivity` | checkbox | doNotShowAccountWithZeroActivity |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
