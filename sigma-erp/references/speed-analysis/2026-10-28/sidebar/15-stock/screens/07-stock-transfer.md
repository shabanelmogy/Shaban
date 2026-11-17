# شاشة: Stock Transfer

المسار في القائمة: Stock ← Stock Transfer.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.CRS_StockTransfer`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0570](../../../readable/routes/R0570--tenant-crs-stocktransfer.js)، والأصل [raw/application.js:5856](../../../raw/application.js#L5856).
- قالب الشاشة: `~/App/tenant/views/stock/stockTransfer/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.stock.stockTransfer.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.stock.stockTransfer.index](../../../readable/controllers/C1712--tenant.views.stock.stockTransfer.index.js) | 7 | 1 |
| [tenant.views.stock.stockTransfer.createOrEditModal](../../../readable/controllers/C1711--tenant.views.stock.stockTransfer.createOrEditModal.js) | 8 | 5 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.stock.stockTransfer.index`: `dateRangeModelChanged`، `dateRangeCheck`، `getlocalDateTime`، `openCreateOrEditModel`، `openViewModal`، `deleteItem`، `getStockTransfers`.
- وحدة `tenant.views.stock.stockTransfer.createOrEditModal`: `cancel`، `clearModelData`، `productSelected`، `addRow`، `removeRow`، `searchItems`، `getBranchTo`، `save`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.stockTransfer.getStockTransfers` | POST | api/services/app/stockTransfer/GetStockTransfers | [المصدر](../../../raw/application.js#L470951) |
| `abp.services.app.item.searchItems` | POST | api/services/app/item/SearchItems | [المصدر](../../../raw/application.js#L470664) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L470677) |
| `abp.services.app.stockTransfer.createOrUpdateStockTransfer` | POST | api/services/app/stockTransfer/CreateOrUpdateStockTransfer | [المصدر](../../../raw/application.js#L470732) |
| `abp.services.app.stockTransfer.getStockTransferForEdit` | POST | api/services/app/stockTransfer/GetStockTransferForEdit | [المصدر](../../../raw/application.js#L470748) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.voucherNo` | text |  |  |
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
