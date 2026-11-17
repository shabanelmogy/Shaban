# شاشة: Item Types

المسار في القائمة: Stock ← Item Types.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.CRS_ItemTypes`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0565](../../../readable/routes/R0565--tenant-crs-itemtypes.js)، والأصل [raw/application.js:5827](../../../raw/application.js#L5827).
- قالب الشاشة: `~/App/tenant/views/stock/itemTypes/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.stock.itemTypes.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.stock.itemTypes.index](../../../readable/controllers/C1689--tenant.views.stock.itemTypes.index.js) | 6 | 2 |
| [tenant.views.stock.itemTypes.createOrEditModal](../../../readable/controllers/C1688--tenant.views.stock.itemTypes.createOrEditModal.js) | 2 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.stock.itemTypes.index`: `category`، `getItemTypes`، `createItemType`، `editItemType`، `viewItemType`، `deleteItemType`.
- وحدة `tenant.views.stock.itemTypes.createOrEditModal`: `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.itemType.getItemTypes` | POST | api/services/app/itemType/GetItemTypes | [المصدر](../../../raw/application.js#L466278) |
| `abp.services.app.itemType.deleteItemType` | POST | api/services/app/itemType/DeleteItemType | [المصدر](../../../raw/application.js#L466349) |
| `abp.services.app.itemType.createOrUpdateItemType` | POST | api/services/app/itemType/CreateOrUpdateItemType | [المصدر](../../../raw/application.js#L466166) |
| `abp.services.app.itemType.getItemTypeForEdit` | POST | api/services/app/itemType/GetItemTypeForEdit | [المصدر](../../../raw/application.js#L466191) |

## الصلاحيات والحقول

- صلاحية `Pages.STOCK.ItemTypes`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.STOCK.ItemTypes.Create`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.STOCK.ItemTypes.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.STOCK.ItemTypes.Delete`: ممنوحة في السياق الملتقط.

لم تتوفر روابط حقول مثبتة من القالب. خصائص الواجهة المستخرجة آليًا موجودة في فهرس وحدات التحكم، ولا تمثل جميع حقول النموذج.

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
