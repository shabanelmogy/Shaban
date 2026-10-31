# شاشة: Detailed Stock Report

المسار في القائمة: Stock ← Reports ← Detailed Stock Report.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_stockReportDetailedStockReport`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0586](../../../readable/routes/R0586--tenant-crs-stockreportdetailedstockreport.js)، والأصل [raw/application.js:5960](../../../raw/application.js#L5960).
- قالب الشاشة: `~/App/tenant/views/stock/reports/detailedStockReport/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.stock.report.detailedStockReport.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.stock.report.detailedStockReport.index](../../../readable/controllers/C1697--tenant.views.stock.report.detailedStockReport.index.js) | 10 | 5 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.stock.report.detailedStockReport.index`: `dateRangeModelChanged`، `CurrencyFormate`، `searchItems`، `clearItem`، `getlocalDateTime`، `getDetailedStockReport`، `getItemTypes`، `filterItemType`، `exportToExcel`، `rounding`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.item.searchItems` | POST | api/services/app/item/SearchItems | [المصدر](../../../raw/application.js#L467803) |
| `abp.services.app.stockReport.getDetailedStockReport` | POST | api/services/app/stockReport/GetDetailedStockReport | [المصدر](../../../raw/application.js#L467836) |
| `abp.services.app.itemType.getItemTypes` | POST | api/services/app/itemType/GetItemTypes | [المصدر](../../../raw/application.js#L467862) |
| `abp.services.app.user.getSelectedBranchIdsByUserId` | POST | [object Object] | [المصدر](../../../raw/application.js#L467934) |
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L467944) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max |
| `vm.filters.item` | ui-select |  |  |
| `vm.filters.locationId` | select | locationId |  |
| `vm.filters.itemTypeId` | select | itemTypeId | ng-options=itemType.id as itemType.name for itemType in vm.itemTypes |
| `vm.filters.doNotShowItemWithZeroQuantity` | checkbox | doNotShowItemWithZeroQuantity |  |
| `vm.filters.doNotShowItemWithZeroQuantity` | checkbox | doNotShowItemWithZeroQuantity |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
