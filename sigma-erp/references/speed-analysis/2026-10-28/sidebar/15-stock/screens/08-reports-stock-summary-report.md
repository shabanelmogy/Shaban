# شاشة: Stock Summary Report

المسار في القائمة: Stock ← Reports ← Stock Summary Report.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.CRS_StockReport`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0571](../../../readable/routes/R0571--tenant-crs-stockreport.js)، والأصل [raw/application.js:5861](../../../raw/application.js#L5861).
- قالب الشاشة: `~/App/tenant/views/stock/reports/stockReport/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.stock.stockReport.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.stock.stockReport.index](../../../readable/controllers/C1704--tenant.views.stock.stockReport.index.js) | 12 | 8 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.stock.stockReport.index`: `CurrencyFormate`، `searchItems`، `getItemTypes`، `filterItemType`، `searchItemsType`، `clearItem`، `getlocalDateTime`، `getStockReport`، `exportToExcel`، `exportToExcel`، `rounding`، `enterKeyPress`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.item.searchItems` | POST | api/services/app/item/SearchItems | [المصدر](../../../raw/application.js#L469420) |
| `abp.services.app.itemType.getItemTypes` | POST | api/services/app/itemType/GetItemTypes | [المصدر](../../../raw/application.js#L469428) |
| `abp.services.app.stockReport.getItemTypes` | POST | api/services/app/stockReport/GetItemTypes | [المصدر](../../../raw/application.js#L469452) |
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L469654) |
| `abp.services.app.stockReport.getItemStockReport` | POST | api/services/app/stockReport/GetItemStockReport | [المصدر](../../../raw/application.js#L469482) |
| `abp.services.app.stockReport.exportToExcel` | POST | api/services/app/stockReport/ExportToExcel | [المصدر](../../../raw/application.js#L469575) |
| `abp.services.app.user.getSelectedBranchIdsByUserId` | POST | [object Object] | [المصدر](../../../raw/application.js#L469644) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.item` | ui-select |  |  |
| `vm.filters.itemTypeId` | select | itemTypeId | ng-options=itemType.id as itemType.name for itemType in vm.itemTypes |
| `vm.filters.locationId` | select | locationId |  |
| `vm.filters.doNotShowItemWithZeroQuantity` | checkbox | doNotShowItemWithZeroQuantity |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
