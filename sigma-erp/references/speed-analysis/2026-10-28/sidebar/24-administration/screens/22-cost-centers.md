# شاشة: Cost Centers

المسار في القائمة: Administration ← Cost Centers.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.costCenters`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0175](../../../readable/routes/R0175--tenant-costcenters.js)، والأصل [raw/application.js:2778](../../../raw/application.js#L2778).
- قالب الشاشة: `~/App/tenant/views/common/costCenters/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.costCenters.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.costCenters.index](../../../readable/controllers/C0323--tenant.views.costCenters.index.js) | 6 | 2 |
| [tenant.views.costCenters.createOrEditModal](../../../readable/controllers/C0322--tenant.views.costCenters.createOrEditModal.js) | 2 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.costCenters.index`: `getCostCenterType`، `getCostCenterTypeName`، `getCostCenters`، `createCostCenter`، `editCostCenter`، `deleteCostCenter`.
- وحدة `tenant.views.costCenters.createOrEditModal`: `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.costCenter.getCostCenters` | POST | api/services/app/costCenter/GetCostCenters | [المصدر](../../../raw/application.js#L86924) |
| `abp.services.app.costCenter.deleteCostCenter` | POST | api/services/app/costCenter/DeleteCostCenter | [المصدر](../../../raw/application.js#L86962) |
| `abp.services.app.costCenter.createOrUpdateCostCenter` | POST | api/services/app/costCenter/CreateOrUpdateCostCenter | [المصدر](../../../raw/application.js#L86799) |
| `abp.services.app.costCenter.getCostCenterForEdit` | POST | api/services/app/costCenter/GetCostCenterForEdit | [المصدر](../../../raw/application.js#L86816) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.CostCenter.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.CostCenter.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.CostCenter.Delete`: ممنوحة في السياق الملتقط.

لم تتوفر روابط حقول مثبتة من القالب. خصائص الواجهة المستخرجة آليًا موجودة في فهرس وحدات التحكم، ولا تمثل جميع حقول النموذج.

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
