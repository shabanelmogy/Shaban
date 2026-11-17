# شاشة: Units of Measures

المسار في القائمة: Stock ← Units of Measures.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.CRS_unitOfMeasures`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0566](../../../readable/routes/R0566--tenant-crs-unitofmeasures.js)، والأصل [raw/application.js:5833](../../../raw/application.js#L5833).
- قالب الشاشة: `~/App/tenant/views/pos/unitOfMeasure/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.pos.unitOfMeasure.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.pos.unitOfMeasure.index](../../../readable/controllers/C1653--tenant.views.pos.unitOfMeasure.index.js) | 6 | 2 |
| [tenant.views.pos.unitOfMeasure.createOrEditModal](../../../readable/controllers/C1652--tenant.views.pos.unitOfMeasure.createOrEditModal.js) | 2 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.pos.unitOfMeasure.index`: `category`، `getUnitOfMeasures`، `createUnitOfMeasure`، `editUnitOfMeasure`، `viewUnitOfMeasure`، `deleteUnitOfMeasure`.
- وحدة `tenant.views.pos.unitOfMeasure.createOrEditModal`: `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.unitOfMeasure.getUnitOfMeasures` | POST | api/services/app/unitOfMeasure/GetUnitOfMeasures | [المصدر](../../../raw/application.js#L455166) |
| `abp.services.app.unitOfMeasure.deleteUnitOfMeasure` | POST | api/services/app/unitOfMeasure/DeleteUnitOfMeasure | [المصدر](../../../raw/application.js#L455226) |
| `abp.services.app.unitOfMeasure.createOrUpdateUnitOfMeasure` | POST | api/services/app/unitOfMeasure/CreateOrUpdateUnitOfMeasure | [المصدر](../../../raw/application.js#L455048) |
| `abp.services.app.unitOfMeasure.getUnitOfMeasureForEdit` | POST | api/services/app/unitOfMeasure/GetUnitOfMeasureForEdit | [المصدر](../../../raw/application.js#L455071) |

## الصلاحيات والحقول

- صلاحية `Pages.STOCK.UnitOfMeasures`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.STOCK.UnitOfMeasures.Create`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.STOCK.UnitOfMeasures.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.STOCK.UnitOfMeasures.Delete`: ممنوحة في السياق الملتقط.

لم تتوفر روابط حقول مثبتة من القالب. خصائص الواجهة المستخرجة آليًا موجودة في فهرس وحدات التحكم، ولا تمثل جميع حقول النموذج.

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
