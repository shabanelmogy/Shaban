# شاشة: Depreciation Report FY

المسار في القائمة: Assets ← Depreciation Report FY.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_depreciationReportFY`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0474](../../../readable/routes/R0474--tenant-crs-depreciationreportfy.js)، والأصل [raw/application.js:5032](../../../raw/application.js#L5032).
- قالب الشاشة: `~/App/tenant/views/crs/assets/depreciationReportFY/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.assets.depreciationReportFY.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.assets.depreciationReportFY.index](../../../readable/controllers/C0598--tenant.views.crs.assets.depreciationReportFY.index.js) | 9 | 3 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.assets.depreciationReportFY.index`: `getLocationName`، `getLocationNameTwo`، `getPerColumTotal`، `getSumBookAndDepreciationValue`، `CurrencyFormate`، `getlocalDateTime`، `getMonth`، `exportToExcelMethod`، `getDepreciationReportFY`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.fiscalYear.getFiscalYears` | POST | api/services/app/fiscalYear/GetFiscalYears | [المصدر](../../../raw/application.js#L162819) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L162826) |
| `abp.services.app.depreciationReportFY.getDepreciationReportFY` | POST | api/services/app/depreciationReportFY/GetDepreciationReportFY | [المصدر](../../../raw/application.js#L162942) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.fiscalYear` | select |  | ng-options=year as (vm.getlocalDateTime(year.startDate) + ' - ' + vm.getlocalDateTime(year.endDate)) for year in vm.fiscalYears \| orderBy: '-startDate' |
| `vm.filters.locationId` | select | locationId | ng-options=location.id as location.name for location in vm.locations |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
