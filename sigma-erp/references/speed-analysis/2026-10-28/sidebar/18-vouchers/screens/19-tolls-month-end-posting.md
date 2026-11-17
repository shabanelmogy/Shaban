# شاشة: Tolls Month-End Posting

المسار في القائمة: Vouchers ← Tolls Month-End Posting.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_salikMonthEndPosting`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0290](../../../readable/routes/R0290--tenant-crs-salikmonthendposting.js)، والأصل [raw/application.js:3607](../../../raw/application.js#L3607).
- قالب الشاشة: `~/App/tenant/views/crs/vouchers/salikMonthEndPosting/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.vouchers.salikMonthEndPosting.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.vouchers.salikMonthEndPosting.index](../../../readable/controllers/C1447--tenant.views.crs.vouchers.salikMonthEndPosting.index.js) | 12 | 4 |
| [tenant.views.crs.vouchers.salikMonthEndPosting.showUnIdentifiedTolls](../../../readable/controllers/C1448--tenant.views.crs.vouchers.salikMonthEndPosting.showUnIdentifiedTolls.js) | 3 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.vouchers.salikMonthEndPosting.index`: `isMv3ExtensionAvailable`، `getlocalDateTime`، `dateRangeCheck`، `dateRangeModelChange`، `getlocalDateTime`، `showUnIdentifiedTolls`، `postTollsMonthEnd`، `callbackOnComplete`، `downloadTolls`، `processTollsMonthEndPosting`، `cancelAll`، `getTollsMonthEndPosting`.
- وحدة `tenant.views.crs.vouchers.salikMonthEndPosting.showUnIdentifiedTolls`: `cancel`، `rounding`، `getlocalDateTime`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.tollMonthEndPosting.postTollsMonthEnd` | POST | api/services/app/tollMonthEndPosting/PostTollsMonthEnd | [المصدر](../../../raw/application.js#L396561) |
| `abp.services.app.salikAccount.getSalikAccountsForExtension` | POST | api/services/app/salikAccount/GetSalikAccountsForExtension | [المصدر](../../../raw/application.js#L396624) |
| `abp.services.app.toll.processTollsMonthEndPosting` | POST | api/services/app/toll/ProcessTollsMonthEndPosting | [المصدر](../../../raw/application.js#L396765) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.monthYear` | input | date |  |
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max |
| `vm.showDateRange` | checkbox | showDateRange |  |
| `row.generate` | checkbox | salikMonthEndPosting{{$index}} | ng-disabled=row.id!=7 && vm.allPostingGroupsOptional=='False'; ng-readonly=row.id!=7 |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
