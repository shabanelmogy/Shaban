# شاشة: Income Statement FY 2

المسار في القائمة: Accounts ← Income Statement FY 2.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_incomeStatementFY2`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0493](../../../readable/routes/R0493--tenant-crs-incomestatementfy2.js)، والأصل [raw/application.js:5186](../../../raw/application.js#L5186).
- قالب الشاشة: `~/App/tenant/views/crs/accounting/incomeStatementFY2/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.accounting.incomeStatementFY2.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.accounting.incomeStatementFY2.index](../../../readable/controllers/C0492--tenant.views.crs.accounting.incomeStatementFY2.index.js) | 13 | 3 |
| [tenant.views.common.locations.searchContactModal](../../../readable/controllers/C0400--tenant.views.common.locations.searchContactModal.js) | 3 | 1 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.accounting.incomeStatementFY2.index`: `currencyAndRoundingWithThree`، `roundingforView`، `stateBranchPopoup`، `clearLocation`، `formatNumber`، `getMonth`، `getlocalDateTime`، `rounding`، `getProfitLossStatements`، `getProfitLossStatement`، `getTotalByRow`، `hasNonZeroValues`، `exportToExcel`.
- وحدة `tenant.views.common.locations.searchContactModal`: `cancel`، `branchSelected`، `init`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.fiscalYear.getFiscalYears` | POST | api/services/app/fiscalYear/GetFiscalYears | [المصدر](../../../raw/application.js#L124853) |
| `abp.services.app.journal.getProfitLossStatement2` | POST | api/services/app/journal/GetProfitLossStatement2 | [المصدر](../../../raw/application.js#L124939) |
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L101577) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.fiscalYear` | select |  | ng-options=year as (vm.getlocalDateTime(year.startDate) + ' - ' + vm.getlocalDateTime(year.endDate)) for year in vm.fiscalYears \| orderBy: '-startDate' |
| `vm.filters.locationName` | text |  |  |
| `vm.filters.doNotShowAccountWithZeroActivity` | checkbox | doNotShowAccountWithZeroActivity |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
