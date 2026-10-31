# شاشة: Cost Parameters

المسار في القائمة: Lease ← Cost Parameters.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_costingParameters`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0376](../../../readable/routes/R0376--tenant-crs-costingparameters.js)، والأصل [raw/application.js:4243](../../../raw/application.js#L4243).
- قالب الشاشة: `~/App/tenant/views/crs/lease/costingParameters/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.lease.costingParameters.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.lease.costingParameters.index](../../../readable/controllers/C0862--tenant.views.crs.lease.costingParameters.index.js) | 4 | 2 |
| [tenant.views.crs.lease.costingParameters.createOrEditModal](../../../readable/controllers/C0861--tenant.views.crs.lease.costingParameters.createOrEditModal.js) | 2 | 1 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.lease.costingParameters.index`: `getcostingParameters`، `createcostingParameter`، `editcostingParameter`، `deletecostingParameter`.
- وحدة `tenant.views.crs.lease.costingParameters.createOrEditModal`: `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.costParameter.getcostingParameters` | POST | api/services/app/costParameter/GetcostingParameters | [المصدر](../../../raw/application.js#L236154) |
| `abp.services.app.costParameter.deleteCostingParameter` | POST | api/services/app/costParameter/DeleteCostingParameter | [المصدر](../../../raw/application.js#L236193) |
| `abp.services.app.costParameter.createOrUpdateCostParameter` | POST | api/services/app/costParameter/CreateOrUpdateCostParameter | [المصدر](../../../raw/application.js#L236061) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.costingParameterss.Addnew`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.costingParameterss.Edit`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.costingParameterss.Delete`: غير ممنوحة في السياق الملتقط.

لم تتوفر روابط حقول مثبتة من القالب. خصائص الواجهة المستخرجة آليًا موجودة في فهرس وحدات التحكم، ولا تمثل جميع حقول النموذج.

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
