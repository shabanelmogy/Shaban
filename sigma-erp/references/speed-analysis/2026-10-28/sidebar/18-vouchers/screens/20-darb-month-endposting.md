# شاشة: Darb Month-EndPosting

المسار في القائمة: Vouchers ← Darb Month-EndPosting.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_darbMonthEndPosting`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0291](../../../readable/routes/R0291--tenant-crs-darbmonthendposting.js)، والأصل [raw/application.js:3612](../../../raw/application.js#L3612).
- قالب الشاشة: `~/App/tenant/views/crs/vouchers/darbMonthEndPosting/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.vouchers.darbMonthEndPosting.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.vouchers.darbMonthEndPosting.index](../../../readable/controllers/C1274--tenant.views.crs.vouchers.darbMonthEndPosting.index.js) | 11 | 4 |
| [tenant.views.crs.vouchers.darbMonthEndPosting.showUnIdentifiedDarbs](../../../readable/controllers/C1275--tenant.views.crs.vouchers.darbMonthEndPosting.showUnIdentifiedDarbs.js) | 3 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.vouchers.darbMonthEndPosting.index`: `getlocalDateTime`، `dateRangeCheck`، `dateRangeModelChange`، `getlocalDateTime`، `showUnIdentifiedTolls`، `postTollsMonthEnd`، `callbackOnComplete`، `downloadTolls`، `processTollsMonthEndPosting`، `cancelAll`، `getTollsMonthEndPosting`.
- وحدة `tenant.views.crs.vouchers.darbMonthEndPosting.showUnIdentifiedDarbs`: `cancel`، `rounding`، `getlocalDateTime`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.tollMonthEndPosting.postDarbsMonthEnd` | POST | api/services/app/tollMonthEndPosting/PostDarbsMonthEnd | [المصدر](../../../raw/application.js#L334552) |
| `abp.services.app.salikAccount.getSalikAccountsForExtension` | POST | api/services/app/salikAccount/GetSalikAccountsForExtension | [المصدر](../../../raw/application.js#L334613) |
| `abp.services.app.toll.processDarbsMonthEndPosting` | POST | api/services/app/toll/ProcessDarbsMonthEndPosting | [المصدر](../../../raw/application.js#L334809) |

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
