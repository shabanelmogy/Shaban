# شاشة: Cost Setting

المسار في القائمة: Lease ← Cost Setting.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_costingSetup`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0377](../../../readable/routes/R0377--tenant-crs-costingsetup.js)، والأصل [raw/application.js:4254](../../../raw/application.js#L4254).
- قالب الشاشة: `~/App/tenant/views/crs/lease/CostingSetup/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.lease.costingSetup.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.lease.costingSetup.index](../../../readable/controllers/C0864--tenant.views.crs.lease.costingSetup.index.js) | 5 | 2 |
| [tenant.views.crs.lease.costingSetup.createOrEditModal](../../../readable/controllers/C0863--tenant.views.crs.lease.costingSetup.createOrEditModal.js) | 9 | 4 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.lease.costingSetup.index`: `roundingforView`، `createCostSetting`، `editCostSetting`، `viewCostSetting`، `deleteCostSetting`.
- وحدة `tenant.views.crs.lease.costingSetup.createOrEditModal`: `localize`، `roundingforView`، `searchModel`، `addRow`، `removeRow`، `addCostParametersSetting`، `getcostingParameters`، `cancel`، `save`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.costSetting.deleteCostSetting` | POST | api/services/app/costSetting/DeleteCostSetting | [المصدر](../../../raw/application.js#L236476) |
| `abp.services.app.costSetting.getCostSettings` | POST | api/services/app/costSetting/GetCostSettings | [المصدر](../../../raw/application.js#L236491) |
| `abp.services.app.vehicleModel.searchVehicleModelsNew` | POST | api/services/app/vehicleModel/SearchVehicleModelsNew | [المصدر](../../../raw/application.js#L236250) |
| `abp.services.app.costParameter.getcostingParameters` | POST | api/services/app/costParameter/GetcostingParameters | [المصدر](../../../raw/application.js#L236317) |
| `abp.services.app.costSetting.createOrUpdateCostSetting` | POST | api/services/app/costSetting/CreateOrUpdateCostSetting | [المصدر](../../../raw/application.js#L236331) |
| `abp.services.app.costSetting.getCostSettingForEdit` | POST | api/services/app/costSetting/GetCostSettingForEdit | [المصدر](../../../raw/application.js#L236340) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Lease.CostSettings`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Lease.CostSettings.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Lease.CostSettings.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Lease.CostSettings.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Lease.CostSettings.ManageVehicleCost`: ممنوحة في السياق الملتقط.

لم تتوفر روابط حقول مثبتة من القالب. خصائص الواجهة المستخرجة آليًا موجودة في فهرس وحدات التحكم، ولا تمثل جميع حقول النموذج.

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
