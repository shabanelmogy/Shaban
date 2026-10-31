# شاشة: Outstanding Agreements

المسار في القائمة: Reports ← Outstanding Agreements.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_activeAgreements`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0441](../../../readable/routes/R0441--tenant-crs-activeagreements.js)، والأصل [raw/application.js:4779](../../../raw/application.js#L4779).
- قالب الشاشة: `~/App/tenant/views/crs/reports/activeAgreements/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.reports.activeAgreements.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.reports.activeAgreements.index](../../../readable/controllers/C0965--tenant.views.crs.reports.activeAgreements.index.js) | 13 | 4 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.reports.activeAgreements.index`: `CurrencyFormate`، `roundingforView`، `searchUser`، `getlocalDate`، `exportToExcel`، `refresh`، `onEstimateChargesTillNow`، `refreshClosed`، `showError`، `clearSalesPerson`، `sendCaptcha`، `focusWindow`، `closeAllTabs`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L262212) |
| `abp.services.app.outStandingAgreementReport.getOpenAgreements` | POST | api/services/app/outStandingAgreementReport/GetOpenAgreements | [المصدر](../../../raw/application.js#L262359) |
| `abp.services.app.outStandingAgreementReport.getOutStandingClosedAgreements` | POST | api/services/app/outStandingAgreementReport/GetOutStandingClosedAgreements | [المصدر](../../../raw/application.js#L262407) |
| `abp.services.app.trafficFile.getTrafficFiles` | POST | api/services/app/trafficFile/GetTrafficFiles | [المصدر](../../../raw/application.js#L262526) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.estimateChargesTillNow` | checkbox | EstimateChargesAgreements |  |
| `row.captchaTxt` | input |  |  |
| `vm.filters.salesPerson` | ui-select |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
