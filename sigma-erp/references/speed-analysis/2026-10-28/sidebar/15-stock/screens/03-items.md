# شاشة: Items

المسار في القائمة: Stock ← Items.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.CRS_Items`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0563](../../../readable/routes/R0563--tenant-crs-items.js)، والأصل [raw/application.js:5806](../../../raw/application.js#L5806).
- قالب الشاشة: `~/App/tenant/views/stock/items/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.stock.items.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.stock.items.index](../../../readable/controllers/C1685--tenant.views.stock.items.index.js) | 10 | 5 |
| [tenant.views.stock.items.createOrEditModal](../../../readable/controllers/C1684--tenant.views.stock.items.createOrEditModal.js) | 10 | 9 |
| [tenant.views.stock.items.viewModal](../../../readable/controllers/C1687--tenant.views.stock.items.viewModal.js) | 1 | 1 |
| [common.views.common.reportViewer](../../../readable/controllers/C0006--common.views.common.reportViewer.js) | 2 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.stock.items.index`: `searchModel`، `getItems`، `getItemTypes`، `filterItemType`، `clearModel`، `openCreateItemsModel`، `openItemsViesModel`، `deleteItem`، `exportToExcel`، `report`.
- وحدة `tenant.views.stock.items.createOrEditModal`: `cancel`، `searchModel`، `searchMake`، `clearModelData`، `createItem`، `getUnitOfMeasures`، `getItemTypes`، `filterItemType`، `addRow`، `removeRow`.
- وحدة `tenant.views.stock.items.viewModal`: `cancel`.
- وحدة `common.views.common.reportViewer`: `exportToExcelFromReport`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.vehicleModel.searchVehicleModelsNew` | POST | api/services/app/vehicleModel/SearchVehicleModelsNew | [المصدر](../../../raw/application.js#L465638) |
| `abp.services.app.item.getItems` | POST | api/services/app/item/GetItems | [المصدر](../../../raw/application.js#L465814) |
| `abp.services.app.itemType.getItemTypes` | POST | api/services/app/itemType/GetItemTypes | [المصدر](../../../raw/application.js#L465727) |
| `abp.services.app.item.deleteItem` | POST | api/services/app/item/DeleteItem | [المصدر](../../../raw/application.js#L465996) |
| `abp.services.app.item.exportToExcel` | POST | api/services/app/item/ExportToExcel | [المصدر](../../../raw/application.js#L466013) |
| `abp.services.app.vehicleModel.searchVehicleMakes` | POST | api/services/app/vehicleModel/SearchVehicleMakes | [المصدر](../../../raw/application.js#L465649) |
| `abp.services.app.item.createOrUpdateItem` | POST | api/services/app/item/CreateOrUpdateItem | [المصدر](../../../raw/application.js#L465663) |
| `abp.services.app.unitOfMeasure.getUnitOfMeasures` | POST | api/services/app/unitOfMeasure/GetUnitOfMeasures | [المصدر](../../../raw/application.js#L465731) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L465688) |
| `abp.services.app.item.getItem` | POST | api/services/app/item/GetItem | [المصدر](../../../raw/application.js#L466136) |

## الصلاحيات والحقول

- صلاحية `Pages.STOCK.Items`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.STOCK.Items.Create`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.STOCK.Items.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.STOCK.Items.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.STOCK.Items.Edit.EditPrice`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.items.itemNo` | text |  |  |
| `vm.items.itemName` | text |  |  |
| `vm.items.itemTypeId` | select | itemTypeId | ng-options=itemType.id as itemType.name for itemType in vm.itemTypes |
| `vm.items.model` | ui-select |  |  |
| `vm.items.supplierItemCode` | text |  |  |
| `vm.items.barCode` | text |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
